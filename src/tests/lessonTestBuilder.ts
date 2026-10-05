import {
  DIFFICULTIES,
  QUESTION_TYPES,
  type Difficulty,
  type QuestionCoverage,
  type QuestionDefinition,
  type QuestionType,
  type RichContent,
  type RichRun,
  type SourceConcept,
  type TestDefinition,
} from './types'

/** Draft form derived from the existing discriminated QuestionDefinition union. */
export type LessonQuestionDraft = {
  [T in QuestionType]: Omit<Extract<QuestionDefinition, { type: T }>, 'id' | 'testId' | 'coverage'> & {
    coverage?: Partial<Omit<QuestionCoverage, 'lessonIds'>>
  }
}[QuestionType]

export const text = (value: string): RichRun => ({ kind: 'text', text: value })
export const math = (value: string): RichRun => ({ kind: 'math', text: value })
export const ltr = (value: string): RichRun => ({ kind: 'ltr', text: value })
export const rich = (...runs: RichRun[]): RichContent => runs
export const textOnly = (value: string): RichContent => [text(value)]

export function lessonQuestion(
  testId: string,
  lessonId: string,
  id: string,
  draft: LessonQuestionDraft,
): QuestionDefinition {
  const { coverage: dimensions, ...question } = draft
  return {
    ...question,
    id,
    testId,
    coverage: {
      lessonIds: [lessonId],
      applications: dimensions?.applications ?? [],
      thinking: dimensions?.thinking ?? [],
      commonErrors: dimensions?.commonErrors ?? [],
    },
  } as QuestionDefinition
}

export interface LessonSourceConceptInput {
  id: string
  label: string
  pages: readonly number[]
}

export interface LessonTestInput {
  id: string
  lessonId: string
  title: string
  description: RichContent
  instructions: RichContent
  questions: readonly QuestionDefinition[]
  sourceConcepts: readonly LessonSourceConceptInput[]
  conceptLabels: Readonly<Record<string, string>>
  skillLabels: Readonly<Record<string, string>>
  applicationLabels?: Readonly<Record<string, string>>
  thinkingLabels?: Readonly<Record<string, string>>
  commonErrorLabels?: Readonly<Record<string, string>>
}

function countBy<T extends string>(values: readonly T[], allValues: readonly T[]): Record<T, number> {
  return Object.fromEntries(allValues.map((value) => [
    value,
    values.filter((candidate) => candidate === value).length,
  ])) as Record<T, number>
}

function labelsFor(
  dimension: string,
  labels: Readonly<Record<string, string>> | undefined,
  questionIds: readonly string[],
  questions: readonly QuestionDefinition[],
  getIds: (question: QuestionDefinition) => readonly string[],
) {
  const usedIds = [...new Set(questions.flatMap(getIds))].sort()
  return usedIds.map((id) => {
    const label = labels?.[id]
    if (!label?.trim()) {
      throw new Error(`Lesson test coverage is missing the ${dimension} label for "${id}".`)
    }
    const linkedQuestionIds = questionIds.filter((questionId) => {
      const question = questions.find((candidate) => candidate.id === questionId)
      return question ? getIds(question).includes(id) : false
    })
    return { id, label: textOnly(label), questionIds: linkedQuestionIds }
  })
}

export function defineLessonTest(input: LessonTestInput): TestDefinition {
  const questionIds = input.questions.map((question) => question.id)
  const difficultyDistribution = countBy(
    input.questions.map((question) => question.difficulty),
    DIFFICULTIES,
  ) as Record<Difficulty, number>
  const questionTypeDistribution = countBy(
    input.questions.map((question) => question.type),
    QUESTION_TYPES,
  )

  const sourceConceptInventory: SourceConcept[] = input.sourceConcepts.map((concept) => ({
    id: concept.id,
    label: textOnly(concept.label),
    references: concept.pages.map((page) => ({
      kind: 'textbook-page',
      lessonId: input.lessonId,
      page,
    })),
  }))

  return {
    id: input.id,
    type: 'lesson',
    lessonId: input.lessonId,
    title: input.title,
    description: input.description,
    instructions: input.instructions,
    questions: input.questions,
    blueprint: {
      targetQuestionCount: input.questions.length,
      difficultyDistribution,
      questionTypeDistribution,
      sourceConceptInventory,
      coverage: {
        concepts: labelsFor('concept', input.conceptLabels, questionIds, input.questions, (question) => question.concepts),
        skills: labelsFor('skill', input.skillLabels, questionIds, input.questions, (question) => question.skills),
        applications: labelsFor('application', input.applicationLabels, questionIds, input.questions, (question) => question.coverage.applications),
        thinking: labelsFor('thinking', input.thinkingLabels, questionIds, input.questions, (question) => question.coverage.thinking),
        commonErrors: labelsFor('common-error', input.commonErrorLabels, questionIds, input.questions, (question) => question.coverage.commonErrors),
        lessons: [{
          id: input.lessonId,
          label: textOnly(input.title),
          questionIds,
        }],
      },
    },
  }
}
