import type { RichContent } from '../tests/types'

/**
 * Independent tests are a separate, permanent assessment surface from `src/tests`.
 *
 * The existing test-area pipeline is deliberately not reused as a data store: its validator
 * contract requires exactly 20 questions for lesson tests and 50–60 for unit tests, and its
 * solutions stay locked until a submission exists. An independent test is always 30 questions
 * and its solutions are always available in their own tab. The presentation primitives
 * (`RichContentView`, `MathExpression`, design tokens) are reused.
 */

export const INDEPENDENT_TEST_QUESTION_COUNT = 30

export const INDEPENDENT_QUESTION_STYLES = [
  'multiple-choice',
  'fill-blank',
  'show-work',
  'word-problem',
  'compare',
  'error-analysis',
  'explain',
  'multi-step',
  'table-reading',
  'draw',
] as const

export type IndependentQuestionStyle = (typeof INDEPENDENT_QUESTION_STYLES)[number]

export const INDEPENDENT_QUESTION_LEVELS = ['basic', 'medium', 'advanced'] as const

export type IndependentQuestionLevel = (typeof INDEPENDENT_QUESTION_LEVELS)[number]

/** How the printed question asks the learner to respond; answers never live in the question. */
export type IndependentResponseKind = 'choices' | 'blank' | 'work' | 'compare' | 'draw'

export interface IndependentChoiceOption {
  id: string
  label: RichContent
}

export interface IndependentTable {
  caption?: RichContent
  columns: readonly RichContent[]
  rows: readonly (readonly RichContent[])[]
}

/** Student-facing question. It intentionally has no answer, solution, or correctness field. */
export interface IndependentQuestion {
  number: number
  lessonIds: readonly string[]
  style: IndependentQuestionStyle
  level: IndependentQuestionLevel
  prompt: RichContent
  table?: IndependentTable
  options?: readonly IndependentChoiceOption[]
}

/** One detailed solution, keyed only by the question number it belongs to. */
export interface IndependentSolution {
  questionNumber: number
  answer: RichContent
  idea: RichContent
  steps: readonly RichContent[]
  why: RichContent
}

export interface IndependentTest {
  id: string
  number: number
  title: string
  description: RichContent
  /** Explicit authored scope. It is never inferred from whatever lessons happen to exist. */
  lessonIds: readonly string[]
  questions: readonly IndependentQuestion[]
  solutions: readonly IndependentSolution[]
}

const STYLE_LABELS: Readonly<Record<IndependentQuestionStyle, string>> = {
  'multiple-choice': 'اختر الإجابة الصحيحة',
  'fill-blank': 'أكمل الفراغ',
  'show-work': 'أوجد الناتج مع كتابة الخطوات',
  'word-problem': 'مسألة لفظية',
  compare: 'قارن باستخدام الرموز',
  'error-analysis': 'اكتشف الخطأ وصحّحه',
  explain: 'علّل إجابتك',
  'multi-step': 'مسألة متعددة الخطوات',
  'table-reading': 'اقرأ الجدول وفسّر البيانات',
  draw: 'ارسم وسمِّ',
}

const LEVEL_LABELS: Readonly<Record<IndependentQuestionLevel, string>> = {
  basic: 'أساسي',
  medium: 'متوسط',
  advanced: 'متقدم',
}

export function independentStyleLabel(style: IndependentQuestionStyle): string {
  return STYLE_LABELS[style]
}

export function independentLevelLabel(level: IndependentQuestionLevel): string {
  return LEVEL_LABELS[level]
}

/** The response surface is derived from the question style, never authored separately. */
export function independentResponseKind(style: IndependentQuestionStyle): IndependentResponseKind {
  switch (style) {
    case 'multiple-choice': return 'choices'
    case 'fill-blank': return 'blank'
    case 'compare': return 'compare'
    case 'draw': return 'draw'
    case 'show-work':
    case 'word-problem':
    case 'error-analysis':
    case 'explain':
    case 'multi-step':
    case 'table-reading':
      return 'work'
    default: {
      const exhaustive: never = style
      return exhaustive
    }
  }
}

export type { RichContent, RichRun } from '../tests/types'
