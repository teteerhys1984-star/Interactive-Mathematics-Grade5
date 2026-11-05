import type { LessonMeta, UnitMeta } from '../types'
import {
  INDEPENDENT_QUESTION_LEVELS,
  INDEPENDENT_QUESTION_STYLES,
  INDEPENDENT_TEST_QUESTION_COUNT,
  type IndependentQuestion,
  type IndependentQuestionLevel,
  type IndependentQuestionStyle,
  type IndependentTest,
} from './types'

export type IndependentTestIssueCode =
  | 'NO_PRODUCTION_TEST_DEFINITIONS'
  | 'TEST_SHAPE_INVALID'
  | 'TEST_ID_INVALID'
  | 'TEST_ID_DUPLICATE'
  | 'TEST_NUMBER_INVALID'
  | 'TEST_NUMBER_DUPLICATE'
  | 'TEST_SCOPE_INVALID'
  | 'LESSON_NOT_FOUND'
  | 'LESSON_NOT_AVAILABLE'
  | 'QUESTION_COUNT_CONTRACT'
  | 'QUESTION_SHAPE_INVALID'
  | 'QUESTION_NUMBER_INVALID'
  | 'QUESTION_PROMPT_DUPLICATE'
  | 'QUESTION_ANSWER_LEAK'
  | 'QUESTION_LESSON_INVALID'
  | 'SOLUTION_COUNT_CONTRACT'
  | 'SOLUTION_SHAPE_INVALID'
  | 'SOLUTION_NUMBER_MISMATCH'
  | 'STYLE_DIVERSITY'
  | 'LEVEL_DIVERSITY'

export interface IndependentTestIssue {
  code: IndependentTestIssueCode
  severity: 'error' | 'warning'
  message: string
  testId?: string
  questionNumber?: number
}

export interface IndependentTestAnalysis {
  tests: readonly IndependentTest[]
  issues: readonly IndependentTestIssue[]
}

export interface IndependentTestsRegistry {
  tests: readonly IndependentTest[]
  issues: readonly IndependentTestIssue[]
  getTestByNumber(number: number): IndependentTest | undefined
}

const TEST_ID_PATTERN = /^independent-[a-z0-9]+(?:-[a-z0-9]+)*$/u
const FORBIDDEN_QUESTION_KEYS = new Set([
  'answer', 'correct', 'correctAnswer', 'correctOption', 'isCorrect',
  'solution', 'solutions', 'idea', 'steps', 'why', 'explanation',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function isRichContentShape(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0 && value.every((run) => (
    isRecord(run)
    && typeof run.text === 'string'
    && run.text.trim().length > 0
    && (run.kind === 'text' || run.kind === 'math' || run.kind === 'ltr')
  ))
}

function isChoiceOptionShape(value: unknown): boolean {
  return isRecord(value) && typeof value.id === 'string' && value.id.trim().length > 0 && isRichContentShape(value.label)
}

function isTableShape(value: unknown): boolean {
  if (!isRecord(value)) return false
  const columns = value.columns
  const rows = value.rows
  if (!Array.isArray(columns) || columns.length === 0 || !columns.every(isRichContentShape)) return false
  if (!Array.isArray(rows) || rows.length === 0) return false
  if (!rows.every((row) => Array.isArray(row) && row.length === columns.length && row.every(isRichContentShape))) return false
  return value.caption === undefined || isRichContentShape(value.caption)
}

function isStyle(value: unknown): value is IndependentQuestionStyle {
  return typeof value === 'string' && (INDEPENDENT_QUESTION_STYLES as readonly string[]).includes(value)
}

function isLevel(value: unknown): value is IndependentQuestionLevel {
  return typeof value === 'string' && (INDEPENDENT_QUESTION_LEVELS as readonly string[]).includes(value)
}

function isQuestionShape(value: unknown): value is IndependentQuestion {
  if (!isRecord(value)) return false
  if (Object.keys(value).some((key) => FORBIDDEN_QUESTION_KEYS.has(key))) return false
  if (!Number.isSafeInteger(value.number) || Number(value.number) < 1) return false
  if (!isStringArray(value.lessonIds) || value.lessonIds.length === 0) return false
  if (new Set(value.lessonIds).size !== value.lessonIds.length) return false
  if (!isStyle(value.style) || !isLevel(value.level)) return false
  if (!isRichContentShape(value.prompt)) return false
  if (value.table !== undefined && !isTableShape(value.table)) return false
  if (value.style === 'multiple-choice') {
    if (!Array.isArray(value.options) || value.options.length < 3 || value.options.length > 5) return false
    if (!value.options.every(isChoiceOptionShape)) return false
    if (new Set(value.options.map((option) => option.id)).size !== value.options.length) return false
  } else if (value.options !== undefined) {
    return false
  }
  return true
}

function isSolutionShape(value: unknown): boolean {
  return isRecord(value)
    && Number.isSafeInteger(value.questionNumber)
    && Number(value.questionNumber) > 0
    && isRichContentShape(value.answer)
    && isRichContentShape(value.idea)
    && Array.isArray(value.steps)
    && value.steps.length >= 2
    && value.steps.every(isRichContentShape)
    && isRichContentShape(value.why)
}

function isTestShape(value: unknown): value is IndependentTest {
  return isRecord(value)
    && typeof value.id === 'string'
    && Number.isSafeInteger(value.number)
    && Number(value.number) > 0
    && typeof value.title === 'string'
    && value.title.trim().length > 0
    && isRichContentShape(value.description)
    && isStringArray(value.lessonIds)
    && value.lessonIds.length > 0
    && new Set(value.lessonIds).size === value.lessonIds.length
    && Array.isArray(value.questions)
    && Array.isArray(value.solutions)
}

function promptKey(question: IndependentQuestion): string {
  return question.prompt.map((run) => run.text).join(' ').normalize('NFKC').replace(/\s+/gu, ' ').trim()
}

/**
 * Pure validator. It checks the feature contract (30 questions / 30 paired solutions, explicit
 * scope, varied styles and levels) and the curriculum relationship, but never checks an answer's
 * mathematical correctness — that is authored and reviewed in the data file and its audit script.
 */
export function analyzeIndependentTests(
  curriculum: readonly UnitMeta[],
  rawDefinitions: readonly unknown[],
): IndependentTestAnalysis {
  const issues: IndependentTestIssue[] = []
  const lessonById = new Map<string, LessonMeta>()
  for (const unit of curriculum) {
    for (const lesson of [...unit.lessons, ...(unit.reviewLessons ?? [])]) lessonById.set(lesson.id, lesson)
  }

  if (rawDefinitions.length === 0) {
    issues.push({
      code: 'NO_PRODUCTION_TEST_DEFINITIONS',
      severity: 'warning',
      message: 'No independent test definitions were discovered.',
    })
    return { tests: [], issues }
  }

  const shapeValid: IndependentTest[] = []
  rawDefinitions.forEach((definition) => {
    if (!isTestShape(definition)) {
      issues.push({
        code: 'TEST_SHAPE_INVALID',
        severity: 'error',
        message: 'An independent test definition has an invalid shape and was excluded.',
      })
      return
    }
    shapeValid.push(definition)
  })

  const idCounts = new Map<string, number>()
  const numberCounts = new Map<number, number>()
  for (const test of shapeValid) {
    idCounts.set(test.id, (idCounts.get(test.id) ?? 0) + 1)
    numberCounts.set(test.number, (numberCounts.get(test.number) ?? 0) + 1)
  }

  const eligible: IndependentTest[] = []
  for (const test of shapeValid) {
    const localIssues: IndependentTestIssue[] = []
    const push = (code: IndependentTestIssueCode, message: string, questionNumber?: number) => {
      localIssues.push({ code, severity: 'error', message, testId: test.id, ...(questionNumber ? { questionNumber } : {}) })
    }

    if (!TEST_ID_PATTERN.test(test.id)) push('TEST_ID_INVALID', 'Test id must match independent-<slug>.')
    if (!Number.isSafeInteger(test.number) || test.number < 1) push('TEST_NUMBER_INVALID', 'Test number must be a positive integer.')
    if ((idCounts.get(test.id) ?? 0) > 1) push('TEST_ID_DUPLICATE', `Test id "${test.id}" is used by more than one definition.`)
    if ((numberCounts.get(test.number) ?? 0) > 1) push('TEST_NUMBER_DUPLICATE', `Test number ${test.number} is used by more than one definition.`)

    if (test.lessonIds.length === 0 || new Set(test.lessonIds).size !== test.lessonIds.length) {
      push('TEST_SCOPE_INVALID', 'Test scope must contain unique lesson ids.')
    }
    for (const lessonId of test.lessonIds) {
      const lesson = lessonById.get(lessonId)
      if (!lesson) push('LESSON_NOT_FOUND', `Scope lesson "${lessonId}" is not in the curriculum.`)
      else if (lesson.availability !== 'available') push('LESSON_NOT_AVAILABLE', `Scope lesson "${lessonId}" is not available.`)
    }

    if (test.questions.length !== INDEPENDENT_TEST_QUESTION_COUNT) {
      push('QUESTION_COUNT_CONTRACT', `Independent tests must contain exactly ${INDEPENDENT_TEST_QUESTION_COUNT} questions; found ${test.questions.length}.`)
    }
    if (test.solutions.length !== INDEPENDENT_TEST_QUESTION_COUNT) {
      push('SOLUTION_COUNT_CONTRACT', `Independent tests must contain exactly ${INDEPENDENT_TEST_QUESTION_COUNT} solutions; found ${test.solutions.length}.`)
    }

    const prompts = new Set<string>()
    const coveredLessons = new Set<string>()
    const styles = new Set<IndependentQuestionStyle>()
    const levels = new Set<IndependentQuestionLevel>()
    let multipleChoiceCount = 0

    test.questions.forEach((question, index) => {
      if (!isQuestionShape(question)) {
        push('QUESTION_SHAPE_INVALID', 'A question has an invalid shape or leaks answer data.', index + 1)
        return
      }
      if (question.number !== index + 1) {
        push('QUESTION_NUMBER_INVALID', `Expected question number ${index + 1}; found ${question.number}.`, index + 1)
      }
      const key = promptKey(question)
      if (prompts.has(key)) push('QUESTION_PROMPT_DUPLICATE', 'A question prompt is repeated verbatim.', question.number)
      prompts.add(key)

      styles.add(question.style)
      levels.add(question.level)
      if (question.style === 'multiple-choice') multipleChoiceCount += 1

      for (const lessonId of question.lessonIds) {
        if (!test.lessonIds.includes(lessonId)) {
          push('QUESTION_LESSON_INVALID', `Question covers lesson "${lessonId}" outside the test scope.`, question.number)
        }
        coveredLessons.add(lessonId)
      }
    })

    for (const lessonId of test.lessonIds) {
      if (!coveredLessons.has(lessonId)) {
        push('QUESTION_LESSON_INVALID', `Declared lesson "${lessonId}" has no question.`)
      }
    }

    test.solutions.forEach((solution, index) => {
      if (!isSolutionShape(solution)) {
        push('SOLUTION_SHAPE_INVALID', 'A solution has an invalid shape.', index + 1)
        return
      }
      if (solution.questionNumber !== index + 1) {
        push('SOLUTION_NUMBER_MISMATCH', `Solution ${index + 1} points at question ${solution.questionNumber}.`, index + 1)
      }
    })

    if (styles.size < 4) {
      push('STYLE_DIVERSITY', `Independent tests must use at least four question styles; found ${styles.size}.`)
    }
    if (multipleChoiceCount >= INDEPENDENT_TEST_QUESTION_COUNT) {
      push('STYLE_DIVERSITY', 'A test may not consist only of multiple-choice questions.')
    }
    if (levels.size < 2) {
      push('LEVEL_DIVERSITY', 'Questions must span at least two difficulty levels.')
    }

    if (localIssues.length === 0) {
      eligible.push(test)
    } else {
      issues.push(...localIssues)
    }
  }

  eligible.sort((left, right) => left.number - right.number)
  return { tests: eligible, issues }
}

export function createIndependentTestsRegistry(
  curriculum: readonly UnitMeta[],
  rawDefinitions: readonly unknown[],
): IndependentTestsRegistry {
  const analysis = analyzeIndependentTests(curriculum, rawDefinitions)
  return {
    tests: analysis.tests,
    issues: analysis.issues,
    getTestByNumber: (number) => analysis.tests.find((test) => test.number === number),
  }
}
