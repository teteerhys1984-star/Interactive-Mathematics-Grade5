import type { LessonMeta, UnitMeta } from '../types'
import { parseDecimal } from './scoring'
import {
  DIFFICULTIES,
  QUESTION_TYPES,
  TEST_TYPES,
  type ChoiceOption,
  type CoverageEntry,
  type Difficulty,
  type FractionAnswerKey,
  type QuestionDefinition,
  type QuestionType,
  type RichContent,
  type SourceConcept,
  type SourceReference,
  type TestBlueprint,
  type TestDefinition,
  type TestType,
} from './types'

export type CoverageMode = 'infrastructure-only' | 'strict'
export type ValidationSeverity = 'error' | 'warning'

export type ValidationIssueCode =
  | 'CURRICULUM_UNIT_ID_DUPLICATE'
  | 'CURRICULUM_LESSON_ID_DUPLICATE'
  | 'TEST_DEFINITION_SHAPE_INVALID'
  | 'TEST_DATA_NOT_SERIALIZABLE'
  | 'TEST_ID_INVALID'
  | 'TEST_ID_DUPLICATE'
  | 'TEST_RELATION_INVALID'
  | 'LESSON_NOT_FOUND'
  | 'LESSON_NOT_AVAILABLE'
  | 'UNIT_NOT_FOUND'
  | 'UNIT_NOT_COMPLETE'
  | 'UNIT_HAS_NO_LESSONS'
  | 'UNIT_LESSON_NOT_AVAILABLE'
  | 'COMPREHENSIVE_SCOPE_EMPTY'
  | 'COMPREHENSIVE_SCOPE_DUPLICATE'
  | 'SCOPE_UNIT_NOT_FOUND'
  | 'SCOPE_LESSON_NOT_FOUND'
  | 'SCOPE_NOT_ELIGIBLE'
  | 'QUESTION_SHAPE_INVALID'
  | 'QUESTION_TYPE_INVALID'
  | 'QUESTION_ANSWER_MISSING'
  | 'QUESTION_ANSWER_INVALID'
  | 'QUESTION_ID_INVALID'
  | 'QUESTION_ID_DUPLICATE'
  | 'QUESTION_TEST_ID_MISMATCH'
  | 'QUESTION_PROMPT_INVALID'
  | 'QUESTION_PROMPT_DUPLICATE'
  | 'QUESTION_METADATA_INVALID'
  | 'QUESTION_SOURCE_UNKNOWN'
  | 'QUESTION_OPTIONS_INVALID'
  | 'SOLUTION_INVALID'
  | 'ORIGINALITY_METADATA_MISSING'
  | 'CONTENT_PLACEHOLDER'
  | 'CONTENT_EMPTY'
  | 'BLUEPRINT_INVALID'
  | 'BLUEPRINT_TARGET_INVALID'
  | 'BLUEPRINT_TARGET_MISMATCH'
  | 'QUESTION_COUNT_CONTRACT'
  | 'BLUEPRINT_DISTRIBUTION_INVALID'
  | 'BLUEPRINT_DISTRIBUTION_MISMATCH'
  | 'LESSON_DIFFICULTY_DISTRIBUTION_INVALID'
  | 'BLUEPRINT_COVERAGE_INVALID'
  | 'BLUEPRINT_COVERAGE_MISMATCH'
  | 'SOURCE_CONCEPT_INVALID'
  | 'SOURCE_REFERENCE_INVALID'
  | 'LESSON_COVERAGE_INVALID'
  | 'LESSON_TEST_DUPLICATE'
  | 'UNIT_TEST_DUPLICATE'
  | 'COMPREHENSIVE_TEST_DUPLICATE'
  | 'LESSON_TEST_MISSING'
  | 'UNIT_TEST_MISSING'
  | 'COVERAGE_DEFERRED'
  | 'NO_PRODUCTION_TEST_DEFINITIONS'
  | 'INFRASTRUCTURE_ONLY_POLICY_HAS_PRODUCTION_DEFINITIONS'

export interface ValidationIssue {
  code: ValidationIssueCode
  severity: ValidationSeverity
  message: string
  testId?: string
  questionId?: string
  lessonId?: string
  unitId?: string
}

export interface ValidationReport {
  valid: boolean
  coverageMode: CoverageMode
  discoveredDefinitionCount: number
  validDefinitionCount: number
  eligibleDefinitionCount: number
  eligibleTestIds: readonly string[]
  issues: readonly ValidationIssue[]
}

export interface CatalogAnalysis {
  report: ValidationReport
  validDefinitions: readonly TestDefinition[]
  eligibleDefinitions: readonly TestDefinition[]
}

interface LessonLocation {
  lesson: LessonMeta
  unit: UnitMeta
}

interface ValidationContext {
  unitsById: ReadonlyMap<string, UnitMeta>
  lessonsById: ReadonlyMap<string, LessonLocation>
}

interface DefinitionResult {
  definition?: TestDefinition
  eligible: boolean
  issues: ValidationIssue[]
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u
const TEST_ID_PATTERN = /^(?:lesson|unit|comprehensive)-[a-z0-9]+(?:-[a-z0-9]+)*-test$/u
const PLACEHOLDER_PATTERN = /\b(?:todo|tbd|placeholder|lorem ipsum|question(?: prompt)? goes here|answer goes here|solution pending|coming soon|insert (?:question|answer|solution)|sample (?:question|answer))\b|سؤال\s+(?:هنا|تجريبي)|حل\s+قيد\s+الإنشاء|سيضاف\s+لاحقًا/iu

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key)
}

function isJsonSerializable(value: unknown, activeObjects = new WeakSet<object>()): boolean {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'object') return false

  const objectValue: object = value
  if (activeObjects.has(objectValue)) return false
  activeObjects.add(objectValue)

  let serializable = true
  if (Array.isArray(value)) {
    const ownKeys = Reflect.ownKeys(value)
    const elementKeys = ownKeys.filter((key) => key !== 'length')
    if (
      ownKeys.some((key) => typeof key !== 'string')
      || elementKeys.length !== value.length
      || elementKeys.some((key) => !/^(?:0|[1-9]\d*)$/u.test(String(key)))
    ) {
      serializable = false
    } else {
      for (let index = 0; index < value.length; index += 1) {
        if (!hasOwn(value, String(index)) || !isJsonSerializable(value[index], activeObjects)) {
          serializable = false
          break
        }
      }
    }
  } else {
    const prototype = Object.getPrototypeOf(value)
    if (prototype !== Object.prototype && prototype !== null) {
      serializable = false
    } else {
      for (const key of Reflect.ownKeys(value)) {
        if (typeof key !== 'string') {
          serializable = false
          break
        }
        const descriptor = Object.getOwnPropertyDescriptor(value, key)
        if (!descriptor || !('value' in descriptor) || descriptor.value === undefined || !isJsonSerializable(descriptor.value, activeObjects)) {
          serializable = false
          break
        }
      }
    }
  }

  activeObjects.delete(objectValue)
  return serializable
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

function isRichContentShape(value: unknown): value is RichContent {
  return Array.isArray(value) && value.every((run) => {
    if (!isRecord(run) || typeof run.text !== 'string') return false
    return run.kind === 'text' || run.kind === 'math' || run.kind === 'ltr'
  })
}

function isSourceReferenceShape(value: unknown): value is SourceReference {
  if (!isRecord(value) || typeof value.lessonId !== 'string') return false
  if (value.kind === 'textbook-page') return typeof value.page === 'number'
  return value.kind === 'lesson-content' && typeof value.reference === 'string'
}

function isCoverageEntryShape(value: unknown): value is CoverageEntry {
  return isRecord(value)
    && typeof value.id === 'string'
    && isRichContentShape(value.label)
    && isStringArray(value.questionIds)
}

function isSourceConceptShape(value: unknown): value is SourceConcept {
  return isRecord(value)
    && typeof value.id === 'string'
    && isRichContentShape(value.label)
    && Array.isArray(value.references)
    && value.references.every(isSourceReferenceShape)
}

function isChoiceOptionShape(value: unknown): value is ChoiceOption {
  return isRecord(value) && typeof value.id === 'string' && isRichContentShape(value.label)
}

function isMatchPairShape(value: unknown): value is { leftId: string; rightId: string } {
  return isRecord(value) && typeof value.leftId === 'string' && typeof value.rightId === 'string'
}

function isNumericAnswerShape(value: unknown): boolean {
  if (!isRecord(value) || typeof value.expected !== 'string') return false
  if (value.tolerance !== undefined && typeof value.tolerance !== 'string') return false
  if (value.format !== 'integer' && value.format !== 'decimal') return false
  if (!isRecord(value.unitPolicy)) return false
  if (value.unitPolicy.kind === 'none') return true
  return (value.unitPolicy.kind === 'optional' || value.unitPolicy.kind === 'required')
    && isStringArray(value.unitPolicy.acceptedUnits)
}

function isFractionAnswerShape(value: unknown): value is FractionAnswerKey {
  return isRecord(value)
    && typeof value.numerator === 'string'
    && typeof value.denominator === 'string'
    && (value.equivalentForms === 'accept' || value.equivalentForms === 'reduced-only')
    && (value.allowDecimalEquivalent === undefined || typeof value.allowDecimalEquivalent === 'boolean')
}

function isSolutionShape(value: unknown): boolean {
  return isRecord(value)
    && isRichContentShape(value.idea)
    && (value.rule === undefined || isRichContentShape(value.rule))
    && Array.isArray(value.steps)
    && value.steps.every(isRichContentShape)
    && isRichContentShape(value.finalAnswer)
    && (value.commonError === undefined || isRichContentShape(value.commonError))
}

function isQuestionDefinitionShape(value: unknown): value is QuestionDefinition {
  if (!isRecord(value)) return false
  if (
    typeof value.id !== 'string'
    || typeof value.testId !== 'string'
    || !QUESTION_TYPES.includes(value.type as QuestionType)
    || !isRichContentShape(value.prompt)
    || !DIFFICULTIES.includes(value.difficulty as Difficulty)
    || !isStringArray(value.concepts)
    || !isStringArray(value.skills)
    || !isStringArray(value.sourceConcepts)
    || !isRecord(value.coverage)
    || !isStringArray(value.coverage.lessonIds)
    || !isStringArray(value.coverage.applications)
    || !isStringArray(value.coverage.thinking)
    || !isStringArray(value.coverage.commonErrors)
    || !hasOwn(value, 'answer')
    || !isSolutionShape(value.solution)
    || typeof value.originalityNote !== 'string'
  ) return false

  switch (value.type) {
    case 'single-choice':
      return typeof value.answer === 'string'
        && Array.isArray(value.options)
        && value.options.every(isChoiceOptionShape)
    case 'true-false':
      return typeof value.answer === 'boolean'
    case 'multi-select':
      return isStringArray(value.answer)
        && Array.isArray(value.options)
        && value.options.every(isChoiceOptionShape)
    case 'numeric':
      return isNumericAnswerShape(value.answer)
    case 'fraction':
      return isFractionAnswerShape(value.answer)
    case 'ordering':
      return isStringArray(value.answer)
        && Array.isArray(value.items)
        && value.items.every(isChoiceOptionShape)
    case 'matching':
      return Array.isArray(value.answer)
        && value.answer.every(isMatchPairShape)
        && Array.isArray(value.left)
        && value.left.every(isChoiceOptionShape)
        && Array.isArray(value.right)
        && value.right.every(isChoiceOptionShape)
    case 'error-analysis':
      return isRecord(value.answer)
        && typeof value.answer.diagnosisId === 'string'
        && (value.answer.correctionId === undefined || typeof value.answer.correctionId === 'string')
        && isRichContentShape(value.studentWork)
        && Array.isArray(value.diagnoses)
        && value.diagnoses.every(isChoiceOptionShape)
        && (value.corrections === undefined || (Array.isArray(value.corrections) && value.corrections.every(isChoiceOptionShape)))
    default:
      return false
  }
}

function isDifficultyDistribution(value: unknown): boolean {
  return isRecord(value) && DIFFICULTIES.every((difficulty) => typeof value[difficulty] === 'number')
}

function isQuestionTypeDistribution(value: unknown): boolean {
  return isRecord(value) && QUESTION_TYPES.every((type) => typeof value[type] === 'number')
}

function isTestCoverageShape(value: unknown): boolean {
  if (!isRecord(value)) return false
  const dimensions: readonly (keyof typeof value)[] = ['concepts', 'skills', 'applications', 'thinking', 'commonErrors', 'lessons']
  return dimensions.every((dimension) => Array.isArray(value[dimension]) && value[dimension].every(isCoverageEntryShape))
}

function isBlueprintShape(value: unknown): value is TestBlueprint {
  return isRecord(value)
    && typeof value.targetQuestionCount === 'number'
    && isDifficultyDistribution(value.difficultyDistribution)
    && isQuestionTypeDistribution(value.questionTypeDistribution)
    && Array.isArray(value.sourceConceptInventory)
    && value.sourceConceptInventory.every(isSourceConceptShape)
    && isTestCoverageShape(value.coverage)
}

function isTestDefinitionShape(value: unknown): value is TestDefinition {
  if (!isRecord(value)) return false
  if (
    typeof value.id !== 'string'
    || !TEST_TYPES.includes(value.type as TestType)
    || !isRichContentShape(value.description)
    || !isRichContentShape(value.instructions)
    || (value.title !== undefined && typeof value.title !== 'string')
    || !Array.isArray(value.questions)
    || !value.questions.every(isQuestionDefinitionShape)
    || !isBlueprintShape(value.blueprint)
  ) return false

  switch (value.type) {
    case 'lesson':
      return typeof value.lessonId === 'string' && !hasOwn(value, 'unitId') && !hasOwn(value, 'scope')
    case 'unit':
      return typeof value.unitId === 'string' && !hasOwn(value, 'lessonId') && !hasOwn(value, 'scope')
    case 'comprehensive':
      return typeof value.title === 'string'
        && !hasOwn(value, 'lessonId')
        && !hasOwn(value, 'unitId')
        && isRecord(value.scope)
        && isStringArray(value.scope.unitIds)
        && isStringArray(value.scope.lessonIds)
    default:
      return false
  }
}

function issue(
  code: ValidationIssueCode,
  severity: ValidationSeverity,
  message: string,
  location: Partial<Pick<ValidationIssue, 'testId' | 'questionId' | 'lessonId' | 'unitId'>> = {},
): ValidationIssue {
  return { code, severity, message, ...location }
}

function validateRichContent(
  content: RichContent,
  location: Partial<Pick<ValidationIssue, 'testId' | 'questionId'>>,
  issues: ValidationIssue[],
  context: string,
): string {
  const textParts: string[] = []

  if (content.length === 0) {
    issues.push(issue('CONTENT_EMPTY', 'error', `${context} must contain meaningful text or mathematical notation.`, location))
    return ''
  }

  content.forEach((run, index) => {
    const text = run.text.trim()
    if (!text) {
      issues.push(issue('CONTENT_EMPTY', 'error', `${context} run ${index + 1} is empty.`, location))
      return
    }
    if (PLACEHOLDER_PATTERN.test(text)) {
      issues.push(issue('CONTENT_PLACEHOLDER', 'error', `${context} contains placeholder text.`, location))
    }
    textParts.push(text)
  })

  return textParts.join(' ')
}

function checkStringIds(
  values: readonly string[],
  name: string,
  location: Partial<Pick<ValidationIssue, 'testId' | 'questionId'>>,
  issues: ValidationIssue[],
  mustBeNonEmpty: boolean,
): void {
  if (mustBeNonEmpty && values.length === 0) {
    issues.push(issue('QUESTION_METADATA_INVALID', 'error', `Every question needs at least one ${name} reference.`, location))
  }

  const seen = new Set<string>()
  for (const value of values) {
    if (!SLUG_PATTERN.test(value)) {
      issues.push(issue('QUESTION_METADATA_INVALID', 'error', `${name} reference "${value}" is not a stable lowercase ID.`, location))
    }
    if (seen.has(value)) {
      issues.push(issue('QUESTION_METADATA_INVALID', 'error', `${name} reference "${value}" is duplicated.`, location))
    }
    seen.add(value)
  }
}

function countBy<T extends string>(values: readonly T[], allKeys: readonly T[]): Record<T, number> {
  const counts = Object.fromEntries(allKeys.map((key) => [key, 0])) as Record<T, number>
  for (const value of values) counts[value] += 1
  return counts
}

function sameCounts<T extends string>(
  expected: Readonly<Record<T, number>>,
  actual: Readonly<Record<T, number>>,
  keys: readonly T[],
): boolean {
  return keys.every((key) => expected[key] === actual[key])
}

function sameStringSet(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === left.length
    && rightSet.size === right.length
    && [...leftSet].every((entry) => rightSet.has(entry))
}

function validateChoiceOptions(
  options: readonly ChoiceOption[],
  questionId: string,
  testId: string,
  issues: ValidationIssue[],
  label: string,
): Set<string> {
  const ids = new Set<string>()
  if (options.length < 2) {
    issues.push(issue('QUESTION_OPTIONS_INVALID', 'error', `${label} must contain at least two options/items.`, { testId, questionId }))
  }

  for (const option of options) {
    if (!SLUG_PATTERN.test(option.id) || ids.has(option.id)) {
      issues.push(issue('QUESTION_OPTIONS_INVALID', 'error', `${label} IDs must be stable and unique; found "${option.id}".`, { testId, questionId }))
    }
    ids.add(option.id)
    validateRichContent(option.label, { testId, questionId }, issues, `${label} option "${option.id}"`)
  }
  return ids
}

function validateFractionKey(
  answer: FractionAnswerKey,
  questionId: string,
  testId: string,
  issues: ValidationIssue[],
): void {
  if (!/^[+-]?\d+$/u.test(answer.numerator) || !/^[+-]?\d+$/u.test(answer.denominator)) {
    issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Fraction answer key must use integer numerator and denominator text.', { testId, questionId }))
    return
  }

  try {
    const numerator = BigInt(answer.numerator)
    const denominator = BigInt(answer.denominator)
    if (denominator <= 0n) {
      issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Fraction denominator must be a positive integer.', { testId, questionId }))
      return
    }
    if (answer.equivalentForms === 'reduced-only') {
      let a = numerator < 0n ? -numerator : numerator
      let b = denominator
      while (b !== 0n) {
        const remainder = a % b
        a = b
        b = remainder
      }
      if (a !== 1n) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'A reduced-only fraction key must itself be in lowest terms.', { testId, questionId }))
      }
    }
  } catch {
    issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Fraction answer key is not a valid exact integer ratio.', { testId, questionId }))
  }
}

function validateQuestion(
  question: QuestionDefinition,
  test: TestDefinition,
  context: ValidationContext,
  sourceConceptIds: ReadonlySet<string>,
  issues: ValidationIssue[],
): void {
  const location = { testId: test.id, questionId: question.id }

  if (!SLUG_PATTERN.test(question.id)) {
    issues.push(issue('QUESTION_ID_INVALID', 'error', `Question ID "${question.id}" is not a stable lowercase ID.`, location))
  }
  if (question.testId !== test.id) {
    issues.push(issue('QUESTION_TEST_ID_MISMATCH', 'error', `Question testId "${question.testId}" does not match parent test "${test.id}".`, location))
  }

  validateRichContent(question.prompt, location, issues, 'Question prompt')
  if (!question.originalityNote.trim() || PLACEHOLDER_PATTERN.test(question.originalityNote)) {
    issues.push(issue('ORIGINALITY_METADATA_MISSING', 'error', 'Question needs a non-placeholder originality/source audit note.', location))
  }

  checkStringIds(question.concepts, 'concept', location, issues, true)
  checkStringIds(question.skills, 'skill', location, issues, true)
  checkStringIds(question.sourceConcepts, 'source concept', location, issues, true)
  checkStringIds(question.coverage.lessonIds, 'lesson', location, issues, true)
  checkStringIds(question.coverage.applications, 'application', location, issues, false)
  checkStringIds(question.coverage.thinking, 'thinking skill', location, issues, false)
  checkStringIds(question.coverage.commonErrors, 'common error', location, issues, false)

  for (const sourceId of question.sourceConcepts) {
    if (!sourceConceptIds.has(sourceId)) {
      issues.push(issue('QUESTION_SOURCE_UNKNOWN', 'error', `Source concept "${sourceId}" is absent from the test blueprint inventory.`, location))
    }
  }

  switch (question.type) {
    case 'single-choice': {
      const optionIds = validateChoiceOptions(question.options, question.id, test.id, issues, 'Single-choice options')
      if (!optionIds.has(question.answer)) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', `Single-choice answer "${question.answer}" is not one of the option IDs.`, location))
      }
      break
    }
    case 'true-false':
      // A boolean answer key is explicit; false is a valid correct answer, not an empty value.
      break
    case 'multi-select': {
      const optionIds = validateChoiceOptions(question.options, question.id, test.id, issues, 'Multi-select options')
      if (question.answer.length === 0 || new Set(question.answer).size !== question.answer.length) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Multi-select answer must contain one or more unique option IDs.', location))
      }
      for (const answerId of question.answer) {
        if (!optionIds.has(answerId)) {
          issues.push(issue('QUESTION_ANSWER_INVALID', 'error', `Multi-select answer "${answerId}" is not an option ID.`, location))
        }
      }
      break
    }
    case 'numeric': {
      const expected = parseDecimal(question.answer.expected)
      const tolerance = question.answer.tolerance === undefined ? { numerator: 0n, denominator: 1n } : parseDecimal(question.answer.tolerance)
      if (!expected || !tolerance || tolerance.numerator < 0n) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Numeric expected value and tolerance must be finite exact decimals; tolerance cannot be negative.', location))
      }
      if (question.answer.format === 'integer' && expected && expected.denominator !== 1n) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Integer-format numeric questions need an integer answer key.', location))
      }
      if (question.answer.unitPolicy.kind !== 'none') {
        const units = question.answer.unitPolicy.acceptedUnits
        if (units.length === 0 || units.some((unit) => !unit.trim()) || new Set(units.map((unit) => unit.trim().toLowerCase())).size !== units.length) {
          issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Numeric unit policy must contain unique, non-empty accepted units.', location))
        }
      }
      break
    }
    case 'fraction':
      validateFractionKey(question.answer, question.id, test.id, issues)
      break
    case 'ordering': {
      const itemIds = validateChoiceOptions(question.items, question.id, test.id, issues, 'Ordering items')
      if (itemIds.size !== question.items.length || question.answer.length !== question.items.length || new Set(question.answer).size !== question.answer.length) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Ordering answer must list every item exactly once.', location))
      }
      if (question.answer.some((itemId) => !itemIds.has(itemId))) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Ordering answer contains an unknown item ID.', location))
      }
      break
    }
    case 'matching': {
      const leftIds = validateChoiceOptions(question.left, question.id, test.id, issues, 'Matching left column')
      const rightIds = validateChoiceOptions(question.right, question.id, test.id, issues, 'Matching right column')
      const seenLeft = new Set<string>()
      const seenRight = new Set<string>()
      if (question.answer.length !== question.left.length) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Matching answer must provide exactly one pair for each left-side item.', location))
      }
      for (const pair of question.answer) {
        if (!leftIds.has(pair.leftId) || !rightIds.has(pair.rightId) || seenLeft.has(pair.leftId) || seenRight.has(pair.rightId)) {
          issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Matching answer contains an unknown or repeated endpoint.', location))
        }
        seenLeft.add(pair.leftId)
        seenRight.add(pair.rightId)
      }
      break
    }
    case 'error-analysis': {
      validateRichContent(question.studentWork, location, issues, 'Shown student work')
      const diagnosisIds = validateChoiceOptions(question.diagnoses, question.id, test.id, issues, 'Error diagnoses')
      if (!diagnosisIds.has(question.answer.diagnosisId)) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Error-analysis diagnosis answer is not one of the diagnosis IDs.', location))
      }
      if (question.corrections) {
        const correctionIds = validateChoiceOptions(question.corrections, question.id, test.id, issues, 'Correction options')
        if (!question.answer.correctionId || !correctionIds.has(question.answer.correctionId)) {
          issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'A correction option set requires a matching correction answer ID.', location))
        }
      } else if (question.answer.correctionId !== undefined) {
        issues.push(issue('QUESTION_ANSWER_INVALID', 'error', 'Correction answer is present but no correction options are defined.', location))
      }
      break
    }
  }

  const solution = question.solution
  validateRichContent(solution.idea, location, issues, 'Solution idea')
  if (solution.rule) validateRichContent(solution.rule, location, issues, 'Solution rule')
  if (solution.steps.length === 0) {
    issues.push(issue('SOLUTION_INVALID', 'error', 'A solution must include at least one meaningful step.', location))
  }
  solution.steps.forEach((step, index) => validateRichContent(step, location, issues, `Solution step ${index + 1}`))
  validateRichContent(solution.finalAnswer, location, issues, 'Solution final answer')
  if (solution.commonError) validateRichContent(solution.commonError, location, issues, 'Solution common error')

  for (const lessonId of question.coverage.lessonIds) {
    if (!context.lessonsById.has(lessonId)) {
      issues.push(issue('LESSON_COVERAGE_INVALID', 'error', `Question references unknown lesson "${lessonId}".`, { ...location, lessonId }))
    }
  }

}

function validateCoverageDimension(
  entries: readonly CoverageEntry[],
  dimension: string,
  questions: readonly QuestionDefinition[],
  getQuestionTags: (question: QuestionDefinition) => readonly string[],
  testId: string,
  issues: ValidationIssue[],
): void {
  const entriesById = new Map<string, CoverageEntry>()
  for (const entry of entries) {
    if (!SLUG_PATTERN.test(entry.id) || entriesById.has(entry.id)) {
      issues.push(issue('BLUEPRINT_COVERAGE_INVALID', 'error', `${dimension} coverage IDs must be stable and unique; found "${entry.id}".`, { testId }))
    }
    entriesById.set(entry.id, entry)
    validateRichContent(entry.label, { testId }, issues, `${dimension} coverage label "${entry.id}"`)

    if (entry.questionIds.length === 0 || new Set(entry.questionIds).size !== entry.questionIds.length) {
      issues.push(issue('BLUEPRINT_COVERAGE_INVALID', 'error', `${dimension} coverage entry "${entry.id}" needs unique question IDs.`, { testId }))
    }
    for (const questionId of entry.questionIds) {
      if (!questions.some((question) => question.id === questionId)) {
        issues.push(issue('BLUEPRINT_COVERAGE_INVALID', 'error', `${dimension} coverage entry "${entry.id}" references unknown question "${questionId}".`, { testId, questionId }))
      }
    }
  }

  for (const question of questions) {
    const tags = getQuestionTags(question)
    for (const tag of tags) {
      const entry = entriesById.get(tag)
      if (!entry) {
        issues.push(issue('BLUEPRINT_COVERAGE_MISMATCH', 'error', `Question "${question.id}" references ${dimension} "${tag}" absent from the blueprint matrix.`, { testId, questionId: question.id }))
      } else if (!entry.questionIds.includes(question.id)) {
        issues.push(issue('BLUEPRINT_COVERAGE_MISMATCH', 'error', `${dimension} "${tag}" omits question "${question.id}" from its question IDs.`, { testId, questionId: question.id }))
      }
    }
  }

  for (const entry of entries) {
    const expected = questions
      .filter((question) => getQuestionTags(question).includes(entry.id))
      .map((question) => question.id)
    if (!sameStringSet(entry.questionIds, expected)) {
      issues.push(issue('BLUEPRINT_COVERAGE_MISMATCH', 'error', `${dimension} "${entry.id}" question IDs do not match the question-level metadata.`, { testId }))
    }
  }
}

function validateBlueprint(
  blueprint: TestBlueprint,
  test: TestDefinition,
  questions: readonly QuestionDefinition[],
  context: ValidationContext,
  effectiveLessonIds: readonly string[],
  coverageMode: CoverageMode,
  issues: ValidationIssue[],
): void {
  const { testId } = { testId: test.id }
  const target = blueprint.targetQuestionCount
  if (!Number.isSafeInteger(target) || target <= 0) {
    issues.push(issue('BLUEPRINT_TARGET_INVALID', 'error', 'Blueprint targetQuestionCount must be a positive integer.', { testId }))
  }
  if (target !== questions.length) {
    issues.push(issue('BLUEPRINT_TARGET_MISMATCH', 'error', `Blueprint target is ${target}, but the definition has ${questions.length} questions.`, { testId }))
  }

  if (test.type === 'lesson' && target !== 20) {
    issues.push(issue('QUESTION_COUNT_CONTRACT', 'error', `Lesson tests must contain exactly 20 questions; found ${target}.`, { testId, lessonId: test.lessonId }))
  } else if (test.type === 'unit' && (target < 50 || target > 60)) {
    issues.push(issue('QUESTION_COUNT_CONTRACT', 'error', `Unit tests must contain 50–60 questions (target 60); found ${target}.`, { testId, unitId: test.unitId }))
  }

  const difficultyValues = DIFFICULTIES.map((difficulty) => blueprint.difficultyDistribution[difficulty])
  const typeValues = QUESTION_TYPES.map((type) => blueprint.questionTypeDistribution[type])
  if ([...difficultyValues, ...typeValues].some((count) => !Number.isSafeInteger(count) || count < 0)) {
    issues.push(issue('BLUEPRINT_DISTRIBUTION_INVALID', 'error', 'Blueprint difficulty/type counts must all be non-negative integers.', { testId }))
  }

  const difficultySum = difficultyValues.reduce((sum, count) => sum + count, 0)
  const typeSum = typeValues.reduce((sum, count) => sum + count, 0)
  if (difficultySum !== target || typeSum !== target) {
    issues.push(issue('BLUEPRINT_DISTRIBUTION_INVALID', 'error', `Blueprint distributions must each sum to ${target}; difficulty sum is ${difficultySum}, type sum is ${typeSum}.`, { testId }))
  }

  const actualDifficulty = countBy(questions.map((question) => question.difficulty), DIFFICULTIES)
  const actualTypes = countBy(questions.map((question) => question.type), QUESTION_TYPES)
  if (!sameCounts(blueprint.difficultyDistribution, actualDifficulty, DIFFICULTIES)) {
    issues.push(issue('BLUEPRINT_DISTRIBUTION_MISMATCH', 'error', 'Blueprint difficulty distribution does not match the actual questions.', { testId }))
  }
  if (!sameCounts(blueprint.questionTypeDistribution, actualTypes, QUESTION_TYPES)) {
    issues.push(issue('BLUEPRINT_DISTRIBUTION_MISMATCH', 'error', 'Blueprint question-type distribution does not match the actual questions.', { testId }))
  }
  if (coverageMode === 'strict' && test.type === 'lesson') {
    const requiredDistribution: Record<Difficulty, number> = { basic: 6, medium: 7, advanced: 4, thinking: 3 }
    if (!sameCounts(actualDifficulty, requiredDistribution, DIFFICULTIES)) {
      issues.push(issue(
        'LESSON_DIFFICULTY_DISTRIBUTION_INVALID',
        'error',
        'Strict lesson coverage requires exactly 6 basic, 7 medium, 4 advanced, and 3 thinking questions.',
        { testId, lessonId: test.lessonId },
      ))
    }
  }

  const sourceConceptIds = new Set<string>()
  const sourceConceptsById = new Map<string, SourceConcept>()
  for (const sourceConcept of blueprint.sourceConceptInventory) {
    if (!SLUG_PATTERN.test(sourceConcept.id) || sourceConceptIds.has(sourceConcept.id)) {
      issues.push(issue('SOURCE_CONCEPT_INVALID', 'error', `Source concept IDs must be stable and unique; found "${sourceConcept.id}".`, { testId }))
    }
    sourceConceptIds.add(sourceConcept.id)
    sourceConceptsById.set(sourceConcept.id, sourceConcept)
    validateRichContent(sourceConcept.label, { testId }, issues, `Source concept label "${sourceConcept.id}"`)
    if (sourceConcept.references.length === 0) {
      issues.push(issue('SOURCE_CONCEPT_INVALID', 'error', `Source concept "${sourceConcept.id}" needs at least one source reference.`, { testId }))
    }
    for (const reference of sourceConcept.references) {
      validateSourceReference(reference, context, effectiveLessonIds, testId, sourceConcept.id, issues)
    }
  }

  const usedSourceConceptIds = new Set(questions.flatMap((question) => question.sourceConcepts))
  for (const sourceId of sourceConceptIds) {
    if (!usedSourceConceptIds.has(sourceId)) {
      issues.push(issue('SOURCE_CONCEPT_INVALID', 'error', `Source concept "${sourceId}" is unused by all questions.`, { testId }))
    }
  }
  for (const question of questions) {
    for (const sourceId of question.sourceConcepts) {
      const sourceConcept = sourceConceptsById.get(sourceId)
      if (sourceConcept && !sourceConcept.references.some((reference) => question.coverage.lessonIds.includes(reference.lessonId))) {
        issues.push(issue('SOURCE_REFERENCE_INVALID', 'error', `Question "${question.id}" cites source concept "${sourceId}" without a source reference in one of its covered lessons.`, { testId, questionId: question.id }))
      }
    }
  }

  const coverage = blueprint.coverage
  validateCoverageDimension(coverage.concepts, 'concept', questions, (question) => question.concepts, testId, issues)
  validateCoverageDimension(coverage.skills, 'skill', questions, (question) => question.skills, testId, issues)
  validateCoverageDimension(coverage.applications, 'application', questions, (question) => question.coverage.applications, testId, issues)
  validateCoverageDimension(coverage.thinking, 'thinking skill', questions, (question) => question.coverage.thinking, testId, issues)
  validateCoverageDimension(coverage.commonErrors, 'common error', questions, (question) => question.coverage.commonErrors, testId, issues)
  validateCoverageDimension(coverage.lessons, 'lesson', questions, (question) => question.coverage.lessonIds, testId, issues)

  const expectedLessons = [...new Set(effectiveLessonIds)].sort()
  const matrixLessons = coverage.lessons.map((entry) => entry.id).sort()
  if (!sameStringSet(matrixLessons, expectedLessons)) {
    issues.push(issue('LESSON_COVERAGE_INVALID', 'error', 'Blueprint lesson coverage must list exactly the lessons in the test scope.', { testId }))
  }

  for (const lessonId of effectiveLessonIds) {
    if (!context.lessonsById.has(lessonId)) {
      issues.push(issue('LESSON_COVERAGE_INVALID', 'error', `Test scope contains unknown lesson "${lessonId}".`, { testId, lessonId }))
    }
  }
}

function validateSourceReference(
  reference: SourceReference,
  context: ValidationContext,
  effectiveLessonIds: readonly string[],
  testId: string,
  sourceId: string,
  issues: ValidationIssue[],
): void {
  const location = { testId }
  if (!context.lessonsById.has(reference.lessonId)) {
    issues.push(issue('SOURCE_REFERENCE_INVALID', 'error', `Source concept "${sourceId}" points to unknown lesson "${reference.lessonId}".`, { ...location, lessonId: reference.lessonId }))
    return
  }
  if (!effectiveLessonIds.includes(reference.lessonId)) {
    issues.push(issue('SOURCE_REFERENCE_INVALID', 'error', `Source concept "${sourceId}" points outside the test's explicit lesson scope.`, { ...location, lessonId: reference.lessonId }))
  }

  if (reference.kind === 'textbook-page') {
    if (!Number.isSafeInteger(reference.page) || reference.page < 1) {
      issues.push(issue('SOURCE_REFERENCE_INVALID', 'error', `Textbook page for source concept "${sourceId}" must be a positive integer.`, location))
    }
  } else if (!reference.reference.trim() || PLACEHOLDER_PATTERN.test(reference.reference)) {
    issues.push(issue('SOURCE_REFERENCE_INVALID', 'error', `Lesson content reference for source concept "${sourceId}" must be meaningful and not a placeholder.`, location))
  }
}

function definitionIdentity(raw: unknown): { id?: string; type?: string; lessonId?: string; unitId?: string } {
  if (!isRecord(raw)) return {}
  return {
    id: typeof raw.id === 'string' ? raw.id : undefined,
    type: typeof raw.type === 'string' ? raw.type : undefined,
    lessonId: typeof raw.lessonId === 'string' ? raw.lessonId : undefined,
    unitId: typeof raw.unitId === 'string' ? raw.unitId : undefined,
  }
}

function validateOneDefinition(raw: unknown, context: ValidationContext, coverageMode: CoverageMode): DefinitionResult {
  const issues: ValidationIssue[] = []
  const identity = definitionIdentity(raw)
  const testLocation = identity.id ? { testId: identity.id } : {}

  if (!isJsonSerializable(raw)) {
    issues.push(issue('TEST_DATA_NOT_SERIALIZABLE', 'error', 'Test definitions must contain plain JSON-serializable data only; JSX, React nodes, functions, symbols, and class instances are not allowed.', testLocation))
  }

  if (isRecord(raw) && !isBlueprintShape(raw.blueprint)) {
    issues.push(issue('BLUEPRINT_INVALID', 'error', 'Test definition is missing a structurally valid inspectable blueprint.', testLocation))
  }

  if (isRecord(raw) && Array.isArray(raw.questions)) {
    raw.questions.forEach((question, index) => {
      if (isRecord(question)) {
        const location = {
          ...testLocation,
          ...(typeof question.id === 'string' ? { questionId: question.id } : {}),
        }
        if (!hasOwn(question, 'answer')) {
          issues.push(issue('QUESTION_ANSWER_MISSING', 'error', `Question at index ${index} has no typed answer key.`, location))
        } else if (typeof question.type === 'string' && !QUESTION_TYPES.includes(question.type as QuestionType)) {
          issues.push(issue('QUESTION_TYPE_INVALID', 'error', `Question at index ${index} uses unknown type "${question.type}".`, location))
        } else if (!isQuestionDefinitionShape(question)) {
          issues.push(issue('QUESTION_ANSWER_INVALID', 'error', `Question at index ${index} does not satisfy its discriminated answer/payload shape.`, location))
        }
      } else {
        issues.push(issue('QUESTION_SHAPE_INVALID', 'error', `Question at index ${index} must be an object.`, testLocation))
      }
    })
  }

  if (!isTestDefinitionShape(raw)) {
    issues.push(issue('TEST_DEFINITION_SHAPE_INVALID', 'error', 'Test definition does not satisfy the typed test/question/blueprint contract.', testLocation))
    return { eligible: false, issues }
  }

  const test = raw
  let eligible = true
  const idPrefixValid = TEST_ID_PATTERN.test(test.id)
  if (!idPrefixValid) {
    issues.push(issue('TEST_ID_INVALID', 'error', `Test ID "${test.id}" must be a stable lowercase lesson-, unit-, or comprehensive-…-test ID.`, { testId: test.id }))
  }

  validateRichContent(test.description, { testId: test.id }, issues, 'Test description')
  validateRichContent(test.instructions, { testId: test.id }, issues, 'Test instructions')
  if (test.title !== undefined && (!test.title.trim() || PLACEHOLDER_PATTERN.test(test.title))) {
    issues.push(issue('CONTENT_EMPTY', 'error', 'Optional test title must be meaningful and not a placeholder.', { testId: test.id }))
  }

  const effectiveLessonIds: string[] = []
  switch (test.type) {
    case 'lesson': {
      const location = context.lessonsById.get(test.lessonId)
      if (!location) {
        issues.push(issue('LESSON_NOT_FOUND', 'error', `Lesson test references unknown lesson "${test.lessonId}".`, { testId: test.id, lessonId: test.lessonId }))
        eligible = false
      } else {
        effectiveLessonIds.push(test.lessonId)
        const expectedId = `lesson-${test.lessonId}-test`
        if (test.id !== expectedId) {
          issues.push(issue('TEST_RELATION_INVALID', 'error', `Lesson test ID must be "${expectedId}" for its lesson.`, { testId: test.id, lessonId: test.lessonId }))
        }
        if (location.lesson.availability !== 'available') {
          issues.push(issue('LESSON_NOT_AVAILABLE', 'error', `Lesson "${test.lessonId}" is not available for a test.`, { testId: test.id, lessonId: test.lessonId, unitId: location.unit.id }))
          eligible = false
        }
      }
      break
    }
    case 'unit': {
      const unit = context.unitsById.get(test.unitId)
      if (!unit) {
        issues.push(issue('UNIT_NOT_FOUND', 'error', `Unit test references unknown unit "${test.unitId}".`, { testId: test.id, unitId: test.unitId }))
        eligible = false
      } else {
        effectiveLessonIds.push(...unit.lessons.map((lesson) => lesson.id))
        const expectedId = `unit-${test.unitId}-test`
        if (test.id !== expectedId) {
          issues.push(issue('TEST_RELATION_INVALID', 'error', `Unit test ID must be "${expectedId}" for its unit.`, { testId: test.id, unitId: test.unitId }))
        }
        if (unit.lessons.length === 0) {
          issues.push(issue('UNIT_HAS_NO_LESSONS', unit.status === 'complete' ? 'error' : 'warning', `Unit "${unit.id}" has no registered lessons.`, { testId: test.id, unitId: unit.id }))
          eligible = false
        }
        if (unit.status !== 'complete') {
          issues.push(issue('UNIT_NOT_COMPLETE', 'warning', `Unit "${unit.id}" is ${unit.status}; its test is retained for validation but is not eligible for learners.`, { testId: test.id, unitId: unit.id }))
          eligible = false
        }
        if (unit.status === 'complete' && unit.lessons.some((lesson) => lesson.availability !== 'available')) {
          issues.push(issue('UNIT_LESSON_NOT_AVAILABLE', 'error', `Complete unit "${unit.id}" contains a lesson that is not available.`, { testId: test.id, unitId: unit.id }))
          eligible = false
        }
      }
      break
    }
    case 'comprehensive': {
      const unitIds = test.scope.unitIds
      const lessonIds = test.scope.lessonIds
      if (unitIds.length + lessonIds.length === 0) {
        issues.push(issue('COMPREHENSIVE_SCOPE_EMPTY', 'error', 'Comprehensive tests require an explicit non-empty unit or lesson scope.', { testId: test.id }))
        eligible = false
      }
      if (new Set(unitIds).size !== unitIds.length || new Set(lessonIds).size !== lessonIds.length) {
        issues.push(issue('COMPREHENSIVE_SCOPE_DUPLICATE', 'error', 'Comprehensive scope IDs must not be duplicated.', { testId: test.id }))
      }
      for (const unitId of unitIds) {
        const unit = context.unitsById.get(unitId)
        if (!unit) {
          issues.push(issue('SCOPE_UNIT_NOT_FOUND', 'error', `Comprehensive scope references unknown unit "${unitId}".`, { testId: test.id, unitId }))
          eligible = false
          continue
        }
        effectiveLessonIds.push(...unit.lessons.map((lesson) => lesson.id))
        if (unit.status !== 'complete' || unit.lessons.some((lesson) => lesson.availability !== 'available')) {
          issues.push(issue('SCOPE_NOT_ELIGIBLE', 'warning', `Comprehensive scope unit "${unitId}" is not complete and fully available.`, { testId: test.id, unitId }))
          eligible = false
        }
      }
      for (const lessonId of lessonIds) {
        const location = context.lessonsById.get(lessonId)
        if (!location) {
          issues.push(issue('SCOPE_LESSON_NOT_FOUND', 'error', `Comprehensive scope references unknown lesson "${lessonId}".`, { testId: test.id, lessonId }))
          eligible = false
          continue
        }
        effectiveLessonIds.push(lessonId)
        if (location.lesson.availability !== 'available') {
          issues.push(issue('SCOPE_NOT_ELIGIBLE', 'warning', `Comprehensive scope lesson "${lessonId}" is not available.`, { testId: test.id, lessonId, unitId: location.unit.id }))
          eligible = false
        }
      }
      break
    }
  }

  const questionIds = new Set<string>()
  const promptTexts = new Map<string, string>()
  const sourceConceptIds = new Set(test.blueprint.sourceConceptInventory.map((source) => source.id))
  for (const question of test.questions) {
    if (questionIds.has(question.id)) {
      issues.push(issue('QUESTION_ID_DUPLICATE', 'error', `Question ID "${question.id}" is duplicated in test "${test.id}".`, { testId: test.id, questionId: question.id }))
    }
    questionIds.add(question.id)

    const promptText = question.prompt.map((run) => run.text.trim()).join(' ').replace(/\s+/gu, ' ').toLowerCase()
    const previousQuestionId = promptTexts.get(promptText)
    if (promptText && previousQuestionId) {
      issues.push(issue('QUESTION_PROMPT_DUPLICATE', 'error', `Question prompt duplicates question "${previousQuestionId}".`, { testId: test.id, questionId: question.id }))
    } else if (promptText) {
      promptTexts.set(promptText, question.id)
    }

    validateQuestion(question, test, context, sourceConceptIds, issues)
    const allowedScope = new Set(effectiveLessonIds)
    if (question.coverage.lessonIds.some((lessonId) => !allowedScope.has(lessonId))) {
      issues.push(issue('LESSON_COVERAGE_INVALID', 'error', `Question "${question.id}" references a lesson outside the test scope.`, { testId: test.id, questionId: question.id }))
    }
  }

  validateBlueprint(test.blueprint, test, test.questions, context, effectiveLessonIds, coverageMode, issues)

  if (issues.some((entry) => entry.severity === 'error')) eligible = false
  return { definition: test, eligible, issues }
}

function groupValues<T>(values: readonly T[], keyOf: (value: T) => string | undefined): Map<string, T[]> {
  const groups = new Map<string, T[]>()
  for (const value of values) {
    const key = keyOf(value)
    if (!key) continue
    const entries = groups.get(key) ?? []
    entries.push(value)
    groups.set(key, entries)
  }
  return groups
}

export function analyzeTestCatalog(
  units: readonly UnitMeta[],
  rawDefinitions: readonly unknown[],
  options: { coverageMode: CoverageMode },
): CatalogAnalysis {
  const issues: ValidationIssue[] = []
  const unitsById = new Map<string, UnitMeta>()
  const lessonsById = new Map<string, LessonLocation>()

  for (const unit of units) {
    if (unitsById.has(unit.id)) {
      issues.push(issue('CURRICULUM_UNIT_ID_DUPLICATE', 'error', `Curriculum unit ID "${unit.id}" is duplicated.`, { unitId: unit.id }))
    }
    unitsById.set(unit.id, unit)
    for (const lesson of unit.lessons) {
      if (lessonsById.has(lesson.id)) {
        issues.push(issue('CURRICULUM_LESSON_ID_DUPLICATE', 'error', `Curriculum lesson ID "${lesson.id}" is duplicated.`, { lessonId: lesson.id, unitId: unit.id }))
      }
      lessonsById.set(lesson.id, { lesson, unit })
    }
  }

  const context: ValidationContext = { unitsById, lessonsById }
  const results = rawDefinitions.map((raw) => validateOneDefinition(raw, context, options.coverageMode))
  for (const result of results) issues.push(...result.issues)

  const idGroups = groupValues(rawDefinitions, (raw) => definitionIdentity(raw).id)
  const duplicateTestIds = new Set<string>()
  for (const [testId, group] of idGroups) {
    if (group.length > 1) {
      duplicateTestIds.add(testId)
      for (const raw of group) {
        issues.push(issue('TEST_ID_DUPLICATE', 'error', `Test ID "${testId}" appears ${group.length} times; all copies are excluded.`, { testId }))
      }
    }
  }

  const lessonRelationGroups = groupValues(rawDefinitions, (raw) => {
    const identity = definitionIdentity(raw)
    return identity.type === 'lesson' ? identity.lessonId : undefined
  })
  for (const [lessonId, group] of lessonRelationGroups) {
    if (group.length > 1) {
      for (const raw of group) {
        const identity = definitionIdentity(raw)
        issues.push(issue('LESSON_TEST_DUPLICATE', 'error', `Lesson "${lessonId}" has ${group.length} test definitions; all copies are excluded.`, { testId: identity.id, lessonId }))
      }
    }
  }

  const unitRelationGroups = groupValues(rawDefinitions, (raw) => {
    const identity = definitionIdentity(raw)
    return identity.type === 'unit' ? identity.unitId : undefined
  })
  for (const [unitId, group] of unitRelationGroups) {
    if (group.length > 1) {
      for (const raw of group) {
        const identity = definitionIdentity(raw)
        issues.push(issue('UNIT_TEST_DUPLICATE', 'error', `Unit "${unitId}" has ${group.length} test definitions; all copies are excluded.`, { testId: identity.id, unitId }))
      }
    }
  }

  const comprehensiveScopeGroups = groupValues(rawDefinitions, (raw) => {
    if (!isRecord(raw) || raw.type !== 'comprehensive' || !isRecord(raw.scope)) return undefined
    const unitIds = isStringArray(raw.scope.unitIds) ? raw.scope.unitIds : []
    const lessonIds = isStringArray(raw.scope.lessonIds) ? [...raw.scope.lessonIds] : []
    const unresolvedUnits: string[] = []
    for (const unitId of unitIds) {
      const unit = unitsById.get(unitId)
      if (!unit || unit.lessons.length === 0) unresolvedUnits.push(unitId)
      else lessonIds.push(...unit.lessons.map((lesson) => lesson.id))
    }
    const effectiveLessons = [...new Set(lessonIds)].sort()
    const unresolved = unresolvedUnits.sort()
    if (effectiveLessons.length + unresolved.length === 0) return undefined
    return `lessons:${JSON.stringify(effectiveLessons)}|unresolved-units:${JSON.stringify(unresolved)}`
  })
  for (const group of comprehensiveScopeGroups.values()) {
    if (group.length > 1) {
      for (const raw of group) {
        const identity = definitionIdentity(raw)
        issues.push(issue('COMPREHENSIVE_TEST_DUPLICATE', 'error', 'Comprehensive tests with the same explicit scope are duplicates, regardless of test ID.', { testId: identity.id }))
      }
    }
  }

  const questionGroups = groupValues(rawDefinitions.flatMap((raw) => {
    if (!isRecord(raw) || !Array.isArray(raw.questions)) return []
    return raw.questions
  }), (rawQuestion) => isRecord(rawQuestion) && typeof rawQuestion.id === 'string' ? rawQuestion.id : undefined)
  for (const [questionId, group] of questionGroups) {
    if (group.length > 1) {
      for (const rawQuestion of group) {
        const parent = rawDefinitions.find((raw) => isRecord(raw) && Array.isArray(raw.questions) && raw.questions.includes(rawQuestion))
        const parentId = definitionIdentity(parent).id
        issues.push(issue('QUESTION_ID_DUPLICATE', 'error', `Question ID "${questionId}" is not globally unique.`, { testId: parentId, questionId }))
      }
    }
  }

  const relationDuplicateTestIds = new Set<string>()
  for (const group of [
    ...lessonRelationGroups.values(),
    ...unitRelationGroups.values(),
    ...comprehensiveScopeGroups.values(),
  ]) {
    if (group.length > 1) {
      for (const raw of group) {
        const rawId = definitionIdentity(raw).id
        if (rawId) relationDuplicateTestIds.add(rawId)
      }
    }
  }
  const globallyDuplicateQuestionIds = new Set<string>()
  for (const [questionId, group] of questionGroups) {
    if (group.length > 1) globallyDuplicateQuestionIds.add(questionId)
  }

  const validResults = results.filter((result) => result.definition && !result.issues.some((entry) => entry.severity === 'error'))
  const nonDuplicateResults = validResults.filter((result) => {
    const definition = result.definition
    return definition !== undefined
      && !duplicateTestIds.has(definition.id)
      && !relationDuplicateTestIds.has(definition.id)
      && !definition.questions.some((question) => globallyDuplicateQuestionIds.has(question.id))
  })
  const validDefinitions = nonDuplicateResults
    .map((result) => result.definition)
    .filter((definition): definition is TestDefinition => definition !== undefined)
  const eligibleDefinitions = nonDuplicateResults
    .filter((result) => result.eligible)
    .map((result) => result.definition)
    .filter((definition): definition is TestDefinition => definition !== undefined)

  if (options.coverageMode === 'infrastructure-only') {
    issues.push(issue('COVERAGE_DEFERRED', 'warning', 'Curriculum-wide test coverage is explicitly deferred during infrastructure-only Phase 3A/3B.'))
    if (rawDefinitions.length === 0) {
      issues.push(issue('NO_PRODUCTION_TEST_DEFINITIONS', 'warning', 'No production test definitions were discovered; no lesson or unit test is being reported as valid.'))
    } else {
      issues.push(issue('INFRASTRUCTURE_ONLY_POLICY_HAS_PRODUCTION_DEFINITIONS', 'error', 'Infrastructure-only policy cannot be used once production definitions exist; switch the audit to strict coverage.'))
    }
  } else {
    for (const unit of units) {
      if (unit.status !== 'complete') continue
      if (unit.lessons.some((lesson) => lesson.availability !== 'available')) {
        issues.push(issue('UNIT_LESSON_NOT_AVAILABLE', 'error', `Unit "${unit.id}" is marked complete but includes a lesson that is not available.`, { unitId: unit.id }))
      }
      const matchingTests = eligibleDefinitions.filter((definition) => definition.type === 'unit' && definition.unitId === unit.id)
      if (matchingTests.length === 0) {
        issues.push(issue('UNIT_TEST_MISSING', 'error', `Complete unit "${unit.id}" requires exactly one valid and eligible unit test.`, { unitId: unit.id }))
      }
    }

    for (const [lessonId, location] of lessonsById) {
      if (location.lesson.availability !== 'available') continue
      const matchingTests = eligibleDefinitions.filter((definition) => definition.type === 'lesson' && definition.lessonId === lessonId)
      if (matchingTests.length === 0) {
        issues.push(issue('LESSON_TEST_MISSING', 'error', `Available lesson "${lessonId}" requires exactly one valid lesson test.`, { lessonId, unitId: location.unit.id }))
      }
    }
  }

  const report: ValidationReport = {
    valid: !issues.some((entry) => entry.severity === 'error'),
    coverageMode: options.coverageMode,
    discoveredDefinitionCount: rawDefinitions.length,
    validDefinitionCount: validDefinitions.length,
    eligibleDefinitionCount: eligibleDefinitions.length,
    eligibleTestIds: eligibleDefinitions.map((definition) => definition.id),
    issues,
  }

  return { report, validDefinitions, eligibleDefinitions }
}

export function validateTestCatalog(
  units: readonly UnitMeta[],
  rawDefinitions: readonly unknown[],
  options: { coverageMode: CoverageMode },
): ValidationReport {
  return analyzeTestCatalog(units, rawDefinitions, options).report
}
