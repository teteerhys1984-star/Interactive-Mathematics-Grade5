import {
  INDEPENDENT_QUESTION_LEVELS,
  INDEPENDENT_QUESTION_STYLES,
  INDEPENDENT_TEST_QUESTION_COUNT,
  type IndependentChoiceOption,
  type IndependentQuestion,
  type IndependentQuestionLevel,
  type IndependentQuestionStyle,
  type IndependentSolution,
  type IndependentTable,
  type IndependentTest,
  type RichContent,
  type RichRun,
} from './types'

/** Shared rich-content authoring helpers (same run model as the existing test system). */
export const text = (value: string): RichRun => ({ kind: 'text', text: value })
export const math = (value: string): RichRun => ({ kind: 'math', text: value })
export const ltr = (value: string): RichRun => ({ kind: 'ltr', text: value })
export const rich = (...runs: RichRun[]): RichContent => runs

export const choice = (id: string, ...runs: RichRun[]): IndependentChoiceOption => ({
  id,
  label: rich(...runs),
})

export const choiceText = (id: string, value: string): IndependentChoiceOption => ({
  id,
  label: rich(text(value)),
})

export function independentTable(input: IndependentTable): IndependentTable {
  return input
}

export interface IndependentSolutionDraft {
  answer: RichContent
  idea: RichContent
  steps: readonly RichContent[]
  why: RichContent
}

export interface IndependentQuestionDraft {
  style: IndependentQuestionStyle
  level: IndependentQuestionLevel
  prompt: RichContent
  table?: IndependentTable
  options?: readonly IndependentChoiceOption[]
  solution: IndependentSolutionDraft
}

export interface IndependentTestInput {
  id: string
  number: number
  title: string
  description: RichContent
  lessonIds: readonly string[]
  questions: readonly (IndependentQuestionDraft & {
    number: number
    lessonIds: readonly string[]
  })[]
}

const TEST_ID_PATTERN = /^independent-[a-z0-9]+(?:-[a-z0-9]+)*$/u

function fail(testId: string, message: string): never {
  throw new Error(`Independent test "${testId}" is invalid: ${message}`)
}

function assertRichContent(testId: string, questionNumber: number, field: string, content: RichContent): void {
  if (!Array.isArray(content) || content.length === 0 || content.some((run) => !run.text.trim())) {
    fail(testId, `question ${questionNumber} has an empty ${field}.`)
  }
}

/**
 * Builds an independent test and keeps questions and solutions structurally paired.
 *
 * The public question object is constructed field by field; the authored solution is never
 * spread into it. This makes answer leakage into the student question list impossible, even if
 * an author accidentally adds extra properties to a draft.
 */
export function defineIndependentTest(input: IndependentTestInput): IndependentTest {
  if (!TEST_ID_PATTERN.test(input.id)) fail(input.id, 'id must match independent-<slug>.')
  if (!Number.isSafeInteger(input.number) || input.number < 1) fail(input.id, 'number must be a positive integer.')
  if (!input.title.trim()) fail(input.id, 'title is empty.')
  if (!input.lessonIds.length) fail(input.id, 'scope must declare at least one lesson.')
  if (new Set(input.lessonIds).size !== input.lessonIds.length) fail(input.id, 'scope has duplicate lesson ids.')

  if (input.questions.length !== INDEPENDENT_TEST_QUESTION_COUNT) {
    fail(input.id, `it must contain exactly ${INDEPENDENT_TEST_QUESTION_COUNT} questions; found ${input.questions.length}.`)
  }

  const seenNumbers = new Set<number>()
  const seenPrompts = new Set<string>()
  const coveredLessons = new Set<string>()
  const questions: IndependentQuestion[] = []
  const solutions: IndependentSolution[] = []

  input.questions.forEach((draft, index) => {
    const expectedNumber = index + 1
    if (draft.number !== expectedNumber) {
      fail(input.id, `questions must be authored in order; expected ${expectedNumber}, found ${draft.number}.`)
    }
    if (seenNumbers.has(draft.number)) fail(input.id, `question ${draft.number} is duplicated.`)
    seenNumbers.add(draft.number)

    if (!INDEPENDENT_QUESTION_STYLES.includes(draft.style)) {
      fail(input.id, `question ${draft.number} has an unknown style.`)
    }
    if (!INDEPENDENT_QUESTION_LEVELS.includes(draft.level)) {
      fail(input.id, `question ${draft.number} has an unknown level.`)
    }
    if (!draft.lessonIds.length) fail(input.id, `question ${draft.number} covers no lesson.`)
    for (const lessonId of draft.lessonIds) {
      if (!input.lessonIds.includes(lessonId)) {
        fail(input.id, `question ${draft.number} covers lesson "${lessonId}" outside the declared scope.`)
      }
      coveredLessons.add(lessonId)
    }

    assertRichContent(input.id, draft.number, 'prompt', draft.prompt)

    const promptKey = draft.prompt.map((run) => run.text).join(' ').normalize('NFKC').replace(/\s+/gu, ' ').trim()
    if (seenPrompts.has(promptKey)) fail(input.id, `question ${draft.number} repeats another prompt.`)
    seenPrompts.add(promptKey)

    if (draft.style === 'multiple-choice') {
      const options = draft.options ?? []
      if (options.length < 3 || options.length > 5) {
        fail(input.id, `question ${draft.number} must offer 3–5 options.`)
      }
      if (new Set(options.map((option) => option.id)).size !== options.length) {
        fail(input.id, `question ${draft.number} has duplicate option ids.`)
      }
      for (const option of options) assertRichContent(input.id, draft.number, `option ${option.id}`, option.label)
    } else if (draft.options?.length) {
      fail(input.id, `question ${draft.number} is not multiple-choice but carries options.`)
    }

    const solution = draft.solution
    assertRichContent(input.id, draft.number, 'solution answer', solution.answer)
    assertRichContent(input.id, draft.number, 'solution idea', solution.idea)
    assertRichContent(input.id, draft.number, 'solution reason', solution.why)
    if (solution.steps.length < 2) fail(input.id, `question ${draft.number} needs at least two solution steps.`)
    solution.steps.forEach((step, stepIndex) =>
      assertRichContent(input.id, draft.number, `solution step ${stepIndex + 1}`, step))

    questions.push({
      number: draft.number,
      lessonIds: [...draft.lessonIds],
      style: draft.style,
      level: draft.level,
      prompt: [...draft.prompt],
      ...(draft.table ? { table: draft.table } : {}),
      ...(draft.options ? { options: draft.options.map((option) => ({ id: option.id, label: [...option.label] })) } : {}),
    })

    solutions.push({
      questionNumber: draft.number,
      answer: solution.answer,
      idea: solution.idea,
      steps: solution.steps,
      why: solution.why,
    })
  })

  for (const lessonId of input.lessonIds) {
    if (!coveredLessons.has(lessonId)) fail(input.id, `lesson "${lessonId}" is declared but no question covers it.`)
  }

  return {
    id: input.id,
    number: input.number,
    title: input.title,
    description: input.description,
    lessonIds: [...input.lessonIds],
    questions,
    solutions,
  }
}
