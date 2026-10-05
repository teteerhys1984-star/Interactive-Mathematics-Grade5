import type { UnitMeta } from '../types'

export const TEST_TYPES = ['lesson', 'unit', 'comprehensive'] as const
export type TestType = (typeof TEST_TYPES)[number]

export const DIFFICULTIES = ['basic', 'medium', 'advanced', 'thinking'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const QUESTION_TYPES = [
  'single-choice',
  'true-false',
  'multi-select',
  'numeric',
  'fraction',
  'ordering',
  'matching',
  'error-analysis',
] as const
export type QuestionType = (typeof QUESTION_TYPES)[number]

export type RichRun =
  | { kind: 'text'; text: string }
  | { kind: 'math'; text: string }
  | { kind: 'ltr'; text: string }

export type RichContent = readonly RichRun[]

export interface Solution {
  idea: RichContent
  rule?: RichContent
  steps: readonly RichContent[]
  finalAnswer: RichContent
  commonError?: RichContent
}

export type SourceReference =
  | { kind: 'textbook-page'; lessonId: string; page: number }
  | { kind: 'lesson-content'; lessonId: string; reference: string }

export interface SourceConcept {
  id: string
  label: RichContent
  references: readonly SourceReference[]
}

export interface CoverageEntry {
  id: string
  label: RichContent
  questionIds: readonly string[]
}

export interface TestCoverage {
  concepts: readonly CoverageEntry[]
  skills: readonly CoverageEntry[]
  applications: readonly CoverageEntry[]
  thinking: readonly CoverageEntry[]
  commonErrors: readonly CoverageEntry[]
  lessons: readonly CoverageEntry[]
}

export interface TestBlueprint {
  targetQuestionCount: number
  difficultyDistribution: Readonly<Record<Difficulty, number>>
  questionTypeDistribution: Readonly<Record<QuestionType, number>>
  sourceConceptInventory: readonly SourceConcept[]
  coverage: TestCoverage
}

export interface QuestionCoverage {
  lessonIds: readonly string[]
  applications: readonly string[]
  thinking: readonly string[]
  commonErrors: readonly string[]
}

export interface ChoiceOption {
  id: string
  label: RichContent
}

export interface MatchPair {
  leftId: string
  rightId: string
}

export interface NumericUnitPolicyNone {
  kind: 'none'
}

export interface NumericUnitPolicyWithUnits {
  kind: 'optional' | 'required'
  acceptedUnits: readonly string[]
}

export type NumericUnitPolicy = NumericUnitPolicyNone | NumericUnitPolicyWithUnits

export interface NumericAnswerKey {
  /** Decimal text avoids floating-point ambiguity in authored answer keys. */
  expected: string
  /** Omitted means an exact numeric match. When present, must be finite and non-negative. */
  tolerance?: string
  format: 'integer' | 'decimal'
  unitPolicy: NumericUnitPolicy
}

export interface FractionAnswerKey {
  numerator: string
  denominator: string
  /** `reduced-only` requires the student's fraction to be in lowest terms. */
  equivalentForms: 'accept' | 'reduced-only'
  allowDecimalEquivalent?: boolean
}

export interface ErrorAnalysisAnswerKey {
  diagnosisId: string
  correctionId?: string
}

export interface QuestionAnswerMap {
  'single-choice': string
  'true-false': boolean
  'multi-select': readonly string[]
  numeric: NumericAnswerKey
  fraction: FractionAnswerKey
  ordering: readonly string[]
  matching: readonly MatchPair[]
  'error-analysis': ErrorAnalysisAnswerKey
}

export interface QuestionPayloadMap {
  'single-choice': { options: readonly ChoiceOption[] }
  'true-false': Record<never, never>
  'multi-select': { options: readonly ChoiceOption[] }
  numeric: Record<never, never>
  fraction: Record<never, never>
  ordering: { items: readonly ChoiceOption[] }
  matching: { left: readonly ChoiceOption[]; right: readonly ChoiceOption[] }
  'error-analysis': {
    studentWork: RichContent
    diagnoses: readonly ChoiceOption[]
    corrections?: readonly ChoiceOption[]
  }
}

export interface QuestionBase<T extends QuestionType, A> {
  id: string
  testId: string
  type: T
  prompt: RichContent
  difficulty: Difficulty
  concepts: readonly string[]
  skills: readonly string[]
  sourceConcepts: readonly string[]
  coverage: QuestionCoverage
  answer: A
  solution: Solution
  /** Editorial audit note; it does not claim automated semantic originality verification. */
  originalityNote: string
}

export type QuestionDefinition = {
  [T in QuestionType]: QuestionBase<T, QuestionAnswerMap[T]> & QuestionPayloadMap[T]
}[QuestionType]

export interface ComprehensiveScope {
  /** Explicit scope; never resolved dynamically from whatever happens to be registered later. */
  unitIds: readonly string[]
  lessonIds: readonly string[]
}

export interface TestDefinitionBase {
  id: string
  description: RichContent
  instructions: RichContent
  /** Lesson and unit titles normally come from curriculum metadata. */
  title?: string
  questions: readonly QuestionDefinition[]
  blueprint: TestBlueprint
}

export type TestDefinition =
  | (TestDefinitionBase & {
      type: 'lesson'
      lessonId: string
      unitId?: never
      scope?: never
    })
  | (TestDefinitionBase & {
      type: 'unit'
      unitId: string
      lessonId?: never
      scope?: never
    })
  | (TestDefinitionBase & {
      type: 'comprehensive'
      title: string
      scope: ComprehensiveScope
      lessonId?: never
      unitId?: never
    })

export type StudentAnswer =
  | { type: 'single-choice'; value: string }
  | { type: 'true-false'; value: boolean }
  | { type: 'multi-select'; value: readonly string[] }
  | { type: 'numeric'; value: string }
  | { type: 'fraction'; value: string }
  | { type: 'ordering'; value: readonly string[] }
  | { type: 'matching'; value: readonly MatchPair[] }
  | { type: 'error-analysis'; value: ErrorAnalysisAnswerKey }

export type AnswerStatus = 'correct' | 'incorrect' | 'unanswered'

export interface QuestionResult {
  questionId: string
  status: AnswerStatus
  earnedPoints: 0 | 1
  possiblePoints: 1
}

export interface TestResult {
  testId: string
  correctCount: number
  incorrectCount: number
  unansweredCount: number
  score: number
  maxScore: number
  percentage: number
  questionResults: readonly QuestionResult[]
}

export type CurriculumUnit = UnitMeta
