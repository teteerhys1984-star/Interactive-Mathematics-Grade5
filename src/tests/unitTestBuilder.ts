import {
  DIFFICULTIES,
  QUESTION_TYPES,
  type Difficulty,
  type QuestionCoverage,
  type QuestionDefinition,
  type QuestionType,
  type RichContent,
  type SourceConcept,
  type TestDefinition,
} from './types'
import { textOnly } from './lessonTestBuilder'

/**
 * Unit-test authoring helper. It mirrors `defineLessonTest` but for a whole unit: a question
 * may cover more than one lesson, and the lesson coverage matrix is derived from the authored
 * question metadata instead of being hand-maintained (the validator then re-checks it).
 */

export type UnitQuestionDraft = {
  [T in QuestionType]: Omit<Extract<QuestionDefinition, { type: T }>, 'id' | 'testId' | 'coverage'> & {
    coverage?: Partial<Omit<QuestionCoverage, 'lessonIds'>>
  }
}[QuestionType]

export function unitQuestion(
  testId: string,
  lessonIds: readonly string[],
  id: string,
  draft: UnitQuestionDraft,
): QuestionDefinition {
  const { coverage: dimensions, ...question } = draft
  return {
    ...question,
    id,
    testId,
    coverage: {
      lessonIds: [...lessonIds],
      applications: dimensions?.applications ?? [],
      thinking: dimensions?.thinking ?? [],
      commonErrors: dimensions?.commonErrors ?? [],
    },
  } as QuestionDefinition
}

export interface UnitSourceConceptInput {
  id: string
  label: string
  lessonId: string
  pages: readonly number[]
}

export interface UnitTestInput {
  id: string
  unitId: string
  title: string
  description: RichContent
  instructions: RichContent
  /** Every lesson of the unit, in curriculum order; each one must carry at least one question. */
  lessonIds: readonly string[]
  lessonLabels: Readonly<Record<string, string>>
  questions: readonly QuestionDefinition[]
  sourceConcepts: readonly UnitSourceConceptInput[]
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
  questions: readonly QuestionDefinition[],
  getIds: (question: QuestionDefinition) => readonly string[],
) {
  const usedIds = [...new Set(questions.flatMap(getIds))].sort()
  return usedIds.map((id) => {
    const label = labels?.[id]
    if (!label?.trim()) {
      throw new Error(`Unit test coverage is missing the ${dimension} label for "${id}".`)
    }
    return {
      id,
      label: textOnly(label),
      questionIds: questions.filter((question) => getIds(question).includes(id)).map((question) => question.id),
    }
  })
}

export function defineUnitTest(input: UnitTestInput): TestDefinition {
  const difficultyDistribution = countBy(
    input.questions.map((question) => question.difficulty),
    DIFFICULTIES,
  ) as Record<Difficulty, number>
  const questionTypeDistribution = countBy(
    input.questions.map((question) => question.type),
    QUESTION_TYPES,
  )

  for (const lessonId of input.lessonIds) {
    const covered = input.questions.filter((question) => question.coverage.lessonIds.includes(lessonId))
    if (covered.length === 0) {
      throw new Error(`Unit test "${input.id}" has no question covering lesson "${lessonId}".`)
    }
    if (!input.lessonLabels[lessonId]?.trim()) {
      throw new Error(`Unit test "${input.id}" is missing the lesson label for "${lessonId}".`)
    }
  }
  for (const question of input.questions) {
    for (const lessonId of question.coverage.lessonIds) {
      if (!input.lessonIds.includes(lessonId)) {
        throw new Error(`Question "${question.id}" covers lesson "${lessonId}" which is outside the unit scope.`)
      }
    }
  }

  const sourceConceptInventory: SourceConcept[] = input.sourceConcepts.map((concept) => ({
    id: concept.id,
    label: textOnly(concept.label),
    references: concept.pages.map((page) => ({
      kind: 'textbook-page',
      lessonId: concept.lessonId,
      page,
    })),
  }))

  return {
    id: input.id,
    type: 'unit',
    unitId: input.unitId,
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
        concepts: labelsFor('concept', input.conceptLabels, input.questions, (question) => question.concepts),
        skills: labelsFor('skill', input.skillLabels, input.questions, (question) => question.skills),
        applications: labelsFor('application', input.applicationLabels, input.questions, (question) => question.coverage.applications),
        thinking: labelsFor('thinking', input.thinkingLabels, input.questions, (question) => question.coverage.thinking),
        commonErrors: labelsFor('common-error', input.commonErrorLabels, input.questions, (question) => question.coverage.commonErrors),
        lessons: input.lessonIds.map((lessonId) => ({
          id: lessonId,
          label: textOnly(input.lessonLabels[lessonId]),
          questionIds: input.questions
            .filter((question) => question.coverage.lessonIds.includes(lessonId))
            .map((question) => question.id),
        })),
      },
    },
  }
}
