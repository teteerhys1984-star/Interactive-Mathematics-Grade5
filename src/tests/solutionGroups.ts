import type { QuestionDefinition, TestDefinition, TestType } from './types'

export interface NumberedSolutionQuestion {
  question: QuestionDefinition
  questionNumber: number
}

export interface SolutionGroup {
  groupNumber: number
  firstQuestionNumber: number
  lastQuestionNumber: number
  questions: readonly NumberedSolutionQuestion[]
}

// A single grouping rule keeps lesson explanations compact and longer tests navigable.
const SOLUTION_GROUP_SIZE: Readonly<Record<TestType, number>> = {
  lesson: 5,
  unit: 10,
  comprehensive: 10,
}

export function getSolutionGroups(test: TestDefinition): readonly SolutionGroup[] {
  const groupSize = SOLUTION_GROUP_SIZE[test.type]
  const groups: SolutionGroup[] = []

  for (let offset = 0; offset < test.questions.length; offset += groupSize) {
    const questions = test.questions.slice(offset, offset + groupSize).map((question, index) => ({
      question,
      questionNumber: offset + index + 1,
    }))
    const first = questions[0]
    const last = questions[questions.length - 1]
    if (!first || !last) continue
    groups.push({
      groupNumber: groups.length + 1,
      firstQuestionNumber: first.questionNumber,
      lastQuestionNumber: last.questionNumber,
      questions,
    })
  }

  return groups
}
