import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { curriculumRegistry } from '../src/content/registry'
import { evaluateQuestion, hasProvidedAnswer, normalizeNumericGlyphs, parseDecimal, scoreTest } from '../src/tests/scoring'
import { validateTestCatalog, type CoverageMode, type ValidationReport } from '../src/tests/validation'
import type { TestRegistrySnapshot } from '../src/tests/registry'
import { lessonOneTeacherEntries } from '../src/teacher/lesson1'
import { lessonTwoTeacherEntries } from '../src/teacher/lesson2'
import { lessonThreeTeacherEntries } from '../src/teacher/lesson3'
import { lessonFourTeacherEntries } from '../src/teacher/lesson4'
import { lessonFiveTeacherEntries } from '../src/teacher/lesson5'
import { lessonSixTeacherEntries } from '../src/teacher/lesson6'
import { lessonSevenTeacherEntries } from '../src/teacher/lesson7'
import {
  DIFFICULTIES,
  QUESTION_TYPES,
  type ChoiceOption,
  type Difficulty,
  type QuestionDefinition,
  type QuestionType,
  type RichContent,
  type StudentAnswer,
  type TestBlueprint,
  type TestDefinition,
} from '../src/tests/types'
import type { UnitMeta } from '../src/types'

// Production definitions must satisfy strict curriculum coverage. Infrastructure-only fixtures
// remain exercised below without weakening the production Registry policy.
const PRODUCTION_COVERAGE_MODE: CoverageMode = 'strict'

const EXPECTED_PRODUCTION_TESTS = [
  'lesson-coordinates-test',
  'lesson-line-graphs-test',
  'lesson-natural-numbers-test',
  'lesson-rounding-natural-numbers-test',
  'lesson-adding-subtracting-natural-numbers-test',
  'lesson-angle-measurement-test',
  'lesson-parallelogram-test',
] as const
const EXPECTED_DIFFICULTY_DISTRIBUTION = { basic: 6, medium: 7, advanced: 4, thinking: 3 } as const
const AUDITED_SOURCE_PAGE_RANGES: Readonly<Record<string, readonly [number, number]>> = {
  coordinates: [3, 4],
  'line-graphs': [7, 9],
  'natural-numbers': [10, 14],
  'rounding-natural-numbers': [15, 18],
  'adding-subtracting-natural-numbers': [19, 22],
  'angle-measurement': [23, 30],
  parallelogram: [31, 35],
}
const AUDITED_LEGACY_PROMPTS: Readonly<Record<string, readonly string[]>> = {
  coordinates: lessonOneTeacherEntries.map((entry) => entry.prompt),
  'line-graphs': lessonTwoTeacherEntries.map((entry) => entry.prompt),
  'natural-numbers': lessonThreeTeacherEntries.map((entry) => entry.prompt),
  'rounding-natural-numbers': lessonFourTeacherEntries.map((entry) => entry.prompt),
  'adding-subtracting-natural-numbers': lessonFiveTeacherEntries.map((entry) => entry.prompt),
  'angle-measurement': lessonSixTeacherEntries.map((entry) => entry.prompt),
  parallelogram: lessonSevenTeacherEntries.map((entry) => entry.prompt),
}


function rich(text: string): RichContent {
  return [{ kind: 'text', text }]
}

function flattenRich(content: RichContent): string {
  return content.map((run) => run.text).join(' ')
}

function normalizeAuditText(value: string): string {
  return normalizeNumericGlyphs(value)
    .normalize('NFKC')
    .toLocaleLowerCase('ar')
    .replace(/[\u064b-\u065f\u0670\u0640]/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/gu, ' ')
}

function normalizeTemplate(value: string): string {
  return normalizeAuditText(value).replace(/(?:\d\s*)+/gu, '#').replace(/\s+/gu, ' ').trim()
}

function countQuestionsByType(questions: readonly QuestionDefinition[]): Record<QuestionType, number> {
  return Object.fromEntries(QUESTION_TYPES.map((type) => [
    type,
    questions.filter((question) => question.type === type).length,
  ])) as Record<QuestionType, number>
}

function studentAnswerFromKey(question: QuestionDefinition): StudentAnswer {
  switch (question.type) {
    case 'single-choice': return { type: question.type, value: question.answer }
    case 'true-false': return { type: question.type, value: question.answer }
    case 'multi-select': return { type: question.type, value: question.answer }
    case 'numeric': {
      const suffix = question.answer.unitPolicy.kind === 'none'
        ? ''
        : ` ${question.answer.unitPolicy.acceptedUnits[0]}`
      return { type: question.type, value: `${question.answer.expected}${suffix}` }
    }
    case 'fraction': return { type: question.type, value: `${question.answer.numerator}/${question.answer.denominator}` }
    case 'ordering': return { type: question.type, value: question.answer }
    case 'matching': return { type: question.type, value: question.answer }
    case 'error-analysis': return { type: question.type, value: question.answer }
  }
}

function makeSyntheticQuestion(
  testId: string,
  questionId: string,
  lessonId: string,
  difficulty: Difficulty,
  promptText: string,
): QuestionDefinition {
  return {
    id: questionId,
    testId,
    type: 'true-false',
    prompt: rich(promptText),
    difficulty,
    concepts: ['concept-synthetic'],
    skills: ['skill-synthetic'],
    sourceConcepts: ['source-synthetic'],
    coverage: { lessonIds: [lessonId], applications: [], thinking: [], commonErrors: [] },
    answer: questionId.endsWith('-01'),
    solution: {
      idea: rich('Synthetic reasoning note.'),
      steps: [rich('Synthetic verification step.')],
      finalAnswer: rich('Synthetic fixture answer.'),
    },
    originalityNote: 'Synthetic infrastructure fixture only; not curriculum content.',
  }
}

function makeSyntheticNumericQuestion(
  testId: string,
  questionId: string,
  lessonId: string,
  tolerance: string,
): QuestionDefinition {
  return {
    id: questionId,
    testId,
    type: 'numeric',
    prompt: rich(`Synthetic numeric fixture ${questionId}.`),
    difficulty: 'basic',
    concepts: ['concept-synthetic'],
    skills: ['skill-synthetic'],
    sourceConcepts: ['source-synthetic'],
    coverage: { lessonIds: [lessonId], applications: [], thinking: [], commonErrors: [] },
    answer: { expected: '2', tolerance, format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich('Synthetic numeric reasoning note.'),
      steps: [rich('Synthetic numeric verification step.')],
      finalAnswer: rich('Synthetic numeric fixture answer.'),
    },
    originalityNote: 'Synthetic infrastructure fixture only; not curriculum content.',
  }
}

function makeBlueprint(questions: readonly QuestionDefinition[], lessonIds: readonly string[]): TestBlueprint {
  const difficultyDistribution = Object.fromEntries(DIFFICULTIES.map((difficulty) => [
    difficulty,
    questions.filter((question) => question.difficulty === difficulty).length,
  ])) as Record<Difficulty, number>
  const questionTypeDistribution = Object.fromEntries(QUESTION_TYPES.map((type) => [
    type,
    questions.filter((question) => question.type === type).length,
  ])) as Record<QuestionType, number>
  const allQuestionIds = questions.map((question) => question.id)

  return {
    targetQuestionCount: questions.length,
    difficultyDistribution,
    questionTypeDistribution,
    sourceConceptInventory: [{
      id: 'source-synthetic',
      label: rich('Synthetic source concept.'),
      references: lessonIds.map((lessonId) => ({
        kind: 'lesson-content' as const,
        lessonId,
        reference: 'Synthetic fixture reference; not a textbook claim.',
      })),
    }],
    coverage: {
      concepts: [{ id: 'concept-synthetic', label: rich('Synthetic concept.'), questionIds: allQuestionIds }],
      skills: [{ id: 'skill-synthetic', label: rich('Synthetic skill.'), questionIds: allQuestionIds }],
      applications: [],
      thinking: [],
      commonErrors: [],
      lessons: lessonIds.map((lessonId) => ({
        id: lessonId,
        label: rich(`Synthetic lesson ${lessonId}.`),
        questionIds: questions
          .filter((question) => question.coverage.lessonIds.includes(lessonId))
          .map((question) => question.id),
      })),
    },
  }
}

function makeLessonFixture(count = 20, lessonId = 'fixture-lesson'): TestDefinition {
  const testId = `lesson-${lessonId}-test`
  const lessonDifficultyBlueprint: Difficulty[] = [
    ...Array.from({ length: 6 }, () => 'basic' as const),
    ...Array.from({ length: 7 }, () => 'medium' as const),
    ...Array.from({ length: 4 }, () => 'advanced' as const),
    ...Array.from({ length: 3 }, () => 'thinking' as const),
  ]
  const questions = Array.from({ length: count }, (_, index) => {
    const difficulty = lessonDifficultyBlueprint[index] ?? 'thinking'
    const ordinal = String(index + 1).padStart(2, '0')
    return makeSyntheticQuestion(testId, `${testId}-q-${ordinal}`, lessonId, difficulty, `Synthetic prompt ${ordinal}.`)
  })
  return {
    id: testId,
    type: 'lesson',
    lessonId,
    description: rich('Synthetic fixture test description.'),
    instructions: rich('Synthetic fixture instructions.'),
    questions,
    blueprint: makeBlueprint(questions, [lessonId]),
  }
}

function makeUnitFixture(count = 50, unitId = 'fixture-unit', lessonId = 'fixture-lesson'): TestDefinition {
  const testId = `unit-${unitId}-test`
  const questions = Array.from({ length: count }, (_, index) => {
    const difficulty = DIFFICULTIES[index % DIFFICULTIES.length]
    const ordinal = String(index + 1).padStart(2, '0')
    return makeSyntheticQuestion(testId, `${testId}-q-${ordinal}`, lessonId, difficulty, `Synthetic unit prompt ${ordinal}.`)
  })
  return {
    id: testId,
    type: 'unit',
    unitId,
    description: rich('Synthetic fixture unit-test description.'),
    instructions: rich('Synthetic fixture unit-test instructions.'),
    questions,
    blueprint: makeBlueprint(questions, [lessonId]),
  }
}

function makeChoice(id: string, label: string): ChoiceOption {
  return { id, label: rich(label) }
}

const scoringTestId = 'comprehensive-scoring-fixture-test'
const scoringLessonId = 'fixture-scoring-lesson'
const scoringQuestions: QuestionDefinition[] = [
  {
    id: 'score-single-choice', testId: scoringTestId, type: 'single-choice',
    prompt: rich('Synthetic single-choice prompt.'), difficulty: 'basic',
    concepts: ['concept-score'], skills: ['skill-score'], sourceConcepts: ['source-score'],
    coverage: { lessonIds: [scoringLessonId], applications: [], thinking: [], commonErrors: [] },
    options: [makeChoice('option-a', 'Option A.'), makeChoice('option-b', 'Option B.'), makeChoice('option-c', 'Option C.')],
    answer: 'option-b',
    solution: { idea: rich('Synthetic solution idea.'), steps: [rich('Synthetic step.')], finalAnswer: rich('Option B.') },
    originalityNote: 'Synthetic scoring fixture only.',
  },
  {
    id: 'score-true-false', testId: scoringTestId, type: 'true-false',
    prompt: rich('Synthetic true-false prompt.'), difficulty: 'basic',
    concepts: ['concept-score'], skills: ['skill-score'], sourceConcepts: ['source-score'],
    coverage: { lessonIds: [scoringLessonId], applications: [], thinking: [], commonErrors: [] },
    answer: false,
    solution: { idea: rich('Synthetic solution idea.'), steps: [rich('Synthetic step.')], finalAnswer: rich('False.') },
    originalityNote: 'Synthetic scoring fixture only.',
  },
  {
    id: 'score-multi-select', testId: scoringTestId, type: 'multi-select',
    prompt: rich('Synthetic multi-select prompt.'), difficulty: 'medium',
    concepts: ['concept-score'], skills: ['skill-score'], sourceConcepts: ['source-score'],
    coverage: { lessonIds: [scoringLessonId], applications: [], thinking: [], commonErrors: [] },
    options: [makeChoice('select-a', 'Choice A.'), makeChoice('select-b', 'Choice B.'), makeChoice('select-c', 'Choice C.')],
    answer: ['select-a', 'select-c'],
    solution: { idea: rich('Synthetic solution idea.'), steps: [rich('Synthetic step.')], finalAnswer: rich('Choices A and C.') },
    originalityNote: 'Synthetic scoring fixture only.',
  },
  {
    id: 'score-numeric', testId: scoringTestId, type: 'numeric',
    prompt: rich('Synthetic numeric prompt.'), difficulty: 'medium',
    concepts: ['concept-score'], skills: ['skill-score'], sourceConcepts: ['source-score'],
    coverage: { lessonIds: [scoringLessonId], applications: [], thinking: [], commonErrors: [] },
    answer: { expected: '12.05', tolerance: '0.05', format: 'decimal', unitPolicy: { kind: 'optional', acceptedUnits: ['cm', 'سم'] } },
    solution: { idea: rich('Synthetic solution idea.'), steps: [rich('Synthetic step.')], finalAnswer: rich('12.05 cm.') },
    originalityNote: 'Synthetic scoring fixture only.',
  },
  {
    id: 'score-fraction', testId: scoringTestId, type: 'fraction',
    prompt: rich('Synthetic fraction prompt.'), difficulty: 'advanced',
    concepts: ['concept-score'], skills: ['skill-score'], sourceConcepts: ['source-score'],
    coverage: { lessonIds: [scoringLessonId], applications: [], thinking: [], commonErrors: [] },
    answer: { numerator: '1', denominator: '2', equivalentForms: 'accept' },
    solution: { idea: rich('Synthetic solution idea.'), steps: [rich('Synthetic step.')], finalAnswer: rich('One half.') },
    originalityNote: 'Synthetic scoring fixture only.',
  },
  {
    id: 'score-ordering', testId: scoringTestId, type: 'ordering',
    prompt: rich('Synthetic ordering prompt.'), difficulty: 'advanced',
    concepts: ['concept-score'], skills: ['skill-score'], sourceConcepts: ['source-score'],
    coverage: { lessonIds: [scoringLessonId], applications: [], thinking: [], commonErrors: [] },
    items: [makeChoice('order-a', 'First item.'), makeChoice('order-b', 'Second item.'), makeChoice('order-c', 'Third item.')],
    answer: ['order-b', 'order-a', 'order-c'],
    solution: { idea: rich('Synthetic solution idea.'), steps: [rich('Synthetic step.')], finalAnswer: rich('B, A, C.') },
    originalityNote: 'Synthetic scoring fixture only.',
  },
  {
    id: 'score-matching', testId: scoringTestId, type: 'matching',
    prompt: rich('Synthetic matching prompt.'), difficulty: 'thinking',
    concepts: ['concept-score'], skills: ['skill-score'], sourceConcepts: ['source-score'],
    coverage: { lessonIds: [scoringLessonId], applications: [], thinking: [], commonErrors: [] },
    left: [makeChoice('left-a', 'Left A.'), makeChoice('left-b', 'Left B.')],
    right: [makeChoice('right-a', 'Right A.'), makeChoice('right-b', 'Right B.')],
    answer: [{ leftId: 'left-a', rightId: 'right-b' }, { leftId: 'left-b', rightId: 'right-a' }],
    solution: { idea: rich('Synthetic solution idea.'), steps: [rich('Synthetic step.')], finalAnswer: rich('The pairs match.') },
    originalityNote: 'Synthetic scoring fixture only.',
  },
  {
    id: 'score-error-analysis', testId: scoringTestId, type: 'error-analysis',
    prompt: rich('Synthetic error-analysis prompt.'), difficulty: 'thinking',
    concepts: ['concept-score'], skills: ['skill-score'], sourceConcepts: ['source-score'],
    coverage: { lessonIds: [scoringLessonId], applications: [], thinking: [], commonErrors: [] },
    studentWork: rich('Synthetic student work: 2 plus 2 equals 5.'),
    diagnoses: [makeChoice('diagnosis-a', 'Diagnosis A.'), makeChoice('diagnosis-b', 'Diagnosis B.')],
    corrections: [makeChoice('correction-a', 'Correction A.'), makeChoice('correction-b', 'Correction B.')],
    answer: { diagnosisId: 'diagnosis-b', correctionId: 'correction-a' },
    solution: { idea: rich('Synthetic solution idea.'), steps: [rich('Synthetic step.')], finalAnswer: rich('Diagnosis B and correction A.') },
    originalityNote: 'Synthetic scoring fixture only.',
  },
]

const correctAnswers: Readonly<Record<string, StudentAnswer>> = {
  'score-single-choice': { type: 'single-choice', value: 'option-b' },
  'score-true-false': { type: 'true-false', value: false },
  'score-multi-select': { type: 'multi-select', value: ['select-c', 'select-a'] },
  'score-numeric': { type: 'numeric', value: '١٢٫١٠ cm' },
  'score-fraction': { type: 'fraction', value: '٢/٤' },
  'score-ordering': { type: 'ordering', value: ['order-b', 'order-a', 'order-c'] },
  'score-matching': { type: 'matching', value: [{ leftId: 'left-b', rightId: 'right-a' }, { leftId: 'left-a', rightId: 'right-b' }] },
  'score-error-analysis': { type: 'error-analysis', value: { diagnosisId: 'diagnosis-b', correctionId: 'correction-a' } },
}

function makeScoringTest(questions: readonly QuestionDefinition[]): TestDefinition {
  const typeDistribution = Object.fromEntries(QUESTION_TYPES.map((type) => [
    type,
    questions.filter((question) => question.type === type).length,
  ])) as Record<QuestionType, number>
  const difficultyDistribution = Object.fromEntries(DIFFICULTIES.map((difficulty) => [
    difficulty,
    questions.filter((question) => question.difficulty === difficulty).length,
  ])) as Record<Difficulty, number>
  const test: TestDefinition = {
    id: scoringTestId,
    type: 'comprehensive',
    title: 'Synthetic Scoring Fixture',
    scope: { unitIds: [], lessonIds: [scoringLessonId] },
    description: rich('Synthetic scoring test.'),
    instructions: rich('Synthetic scoring instructions.'),
    questions,
    blueprint: {
      targetQuestionCount: questions.length,
      difficultyDistribution,
      questionTypeDistribution: typeDistribution,
      sourceConceptInventory: [{
        id: 'source-score',
        label: rich('Synthetic source.'),
        references: [{ kind: 'lesson-content', lessonId: scoringLessonId, reference: 'Test-only scoring fixture.' }],
      }],
      coverage: {
        concepts: [{ id: 'concept-score', label: rich('Synthetic concept.'), questionIds: questions.map((question) => question.id) }],
        skills: [{ id: 'skill-score', label: rich('Synthetic skill.'), questionIds: questions.map((question) => question.id) }],
        applications: [],
        thinking: [],
        commonErrors: [],
        lessons: [{ id: scoringLessonId, label: rich('Synthetic scoring lesson.'), questionIds: questions.map((question) => question.id) }],
      },
    },
  }
  return test
}

function createViteDiscoveryServer() {
  return createServer({
    configFile: 'vite.config.ts',
    appType: 'custom',
    server: { middlewareMode: true },
  })
}

async function main(): Promise<void> {
  const completeUnit: UnitMeta = {
    id: 'fixture-unit',
    title: 'Synthetic fixture unit',
    accent: 'blue',
    status: 'complete',
    lessons: [{ id: 'fixture-lesson', title: 'Synthetic fixture lesson', availability: 'available' }],
  }
  const lessonTest = makeLessonFixture()
  const unitTest = makeUnitFixture()
  const validSyntheticReport = validateTestCatalog(
    [completeUnit],
    [lessonTest, unitTest],
    { coverageMode: 'strict' },
  )
  assert.equal(validSyntheticReport.valid, true, JSON.stringify(validSyntheticReport.issues, null, 2))
  assert.equal(validSyntheticReport.eligibleDefinitionCount, 2)
  assert.equal(lessonTest.questions.length, 20)
  assert.equal(unitTest.questions.length, 50)

  const unitTestAtGoal = makeUnitFixture(60)
  const goalCountReport = validateTestCatalog(
    [completeUnit],
    [lessonTest, unitTestAtGoal],
    { coverageMode: 'strict' },
  )
  assert.equal(goalCountReport.valid, true, JSON.stringify(goalCountReport.issues, null, 2))
  for (const invalidCount of [49, 61]) {
    const invalidCountReport = validateTestCatalog(
      [completeUnit],
      [makeUnitFixture(invalidCount)],
      { coverageMode: 'infrastructure-only' },
    )
    assert.ok(invalidCountReport.issues.some((entry) => entry.code === 'QUESTION_COUNT_CONTRACT'))
  }
  for (const invalidLessonCount of [19, 21]) {
    const invalidCountReport = validateTestCatalog(
      [completeUnit],
      [makeLessonFixture(invalidLessonCount)],
      { coverageMode: 'infrastructure-only' },
    )
    assert.ok(invalidCountReport.issues.some((entry) => entry.code === 'QUESTION_COUNT_CONTRACT'))
  }

  const loadedRegistry = await (async () => {
    const server = await createViteDiscoveryServer()
    try {
      return await server.ssrLoadModule('/src/tests/registry.ts') as unknown as {
        discoveredTestDefinitions: readonly unknown[]
        testRegistry: TestRegistrySnapshot
        createTestRegistry: (
          units: readonly UnitMeta[],
          definitions: readonly unknown[],
          options: { coverageMode: CoverageMode },
        ) => TestRegistrySnapshot
      }
    } finally {
      await server.close()
    }
  })()

  const productionAudit = validateTestCatalog(
    curriculumRegistry,
    loadedRegistry.discoveredTestDefinitions,
    { coverageMode: PRODUCTION_COVERAGE_MODE },
  )
  assert.equal(loadedRegistry.discoveredTestDefinitions.length, 7, 'Vite must autodiscover exactly seven lesson definitions.')
  assert.equal(loadedRegistry.testRegistry.discoveredDefinitionCount, 7)
  assert.equal(loadedRegistry.testRegistry.report.coverageMode, 'strict')
  assert.equal(loadedRegistry.testRegistry.report.valid, true, JSON.stringify(loadedRegistry.testRegistry.issues, null, 2))
  assert.equal(loadedRegistry.testRegistry.allTests.length, 7)
  assert.equal(loadedRegistry.testRegistry.lessonTests.length, 7)
  assert.equal(loadedRegistry.testRegistry.unitTests.length, 0)
  assert.equal(loadedRegistry.testRegistry.comprehensiveTests.length, 0)
  assert.equal(productionAudit.coverageMode, PRODUCTION_COVERAGE_MODE)
  assert.equal(productionAudit.valid, true, JSON.stringify(productionAudit.issues, null, 2))
  assert.equal(productionAudit.discoveredDefinitionCount, 7)
  assert.equal(productionAudit.validDefinitionCount, 7)
  assert.equal(productionAudit.eligibleDefinitionCount, 7)
  assert.deepEqual([...productionAudit.eligibleTestIds].sort(), [...EXPECTED_PRODUCTION_TESTS].sort())
  assert.ok(!productionAudit.issues.some((entry) => entry.code === 'LESSON_TEST_MISSING' || entry.code === 'UNIT_TEST_MISSING'))
  assert.equal(curriculumRegistry.length, 1)
  assert.equal(curriculumRegistry[0].id, 'unit-1')
  assert.equal(curriculumRegistry[0].status, 'unknown', 'Unit 1 completion must not be inferred from lesson coverage.')

  const productionTests = loadedRegistry.testRegistry.lessonTests
  assert.deepEqual(productionTests.map((test) => test.id).sort(), [...EXPECTED_PRODUCTION_TESTS].sort())
  assert.equal(productionTests.reduce((total, test) => total + test.questions.length, 0), 140)
  const allProductionQuestionIds = productionTests.flatMap((test) => test.questions.map((question) => question.id))
  assert.equal(new Set(allProductionQuestionIds).size, 140, 'Question IDs must be globally unique.')
  const findProductionQuestion = (testId: string, questionId: string) =>
    productionTests.find((test) => test.id === testId)?.questions.find((question) => question.id === questionId)
  const roundingQuestion17 = findProductionQuestion('lesson-rounding-natural-numbers-test', 'lesson-rounding-natural-numbers-test-q17')
  assert.ok(roundingQuestion17)
  assert.deepEqual(roundingQuestion17.answer, ['q17-a', 'q17-c'])
  assert.ok(flattenRich(roundingQuestion17.solution.finalAnswer).includes('الصحيحان هما نتيجة أقرب مئة ونتيجة أقرب مئة ألف'))
  assert.ok(flattenRich(roundingQuestion17.solution.steps[1]).includes('B خاطئة'))

  const angleQuestion8 = findProductionQuestion('lesson-angle-measurement-test', 'lesson-angle-measurement-test-q08')
  const parallelogramQuestion11 = findProductionQuestion('lesson-parallelogram-test', 'lesson-parallelogram-test-q11')
  assert.ok(angleQuestion8)
  assert.ok(parallelogramQuestion11)
  assert.equal(evaluateQuestion(angleQuestion8, { type: 'numeric', value: '٨٥ درجة' }).status, 'correct')
  assert.equal(evaluateQuestion(angleQuestion8, { type: 'numeric', value: '85 درجات' }).status, 'correct')
  assert.equal(evaluateQuestion(parallelogramQuestion11, { type: 'numeric', value: '٠ سم' }).status, 'correct')
  assert.equal(evaluateQuestion(parallelogramQuestion11, { type: 'numeric', value: '0 سنتيمتر' }).status, 'correct')
  const allOriginalityNotes = productionTests.flatMap((test) => test.questions.map((question) => question.originalityNote.trim()))
  assert.equal(new Set(allOriginalityNotes).size, 140, 'Originality notes must be item-specific, not reused boilerplate.')

  const exactLegacyCollisionDetails: string[] = []
  const numberMaskedTemplateCollisionDetails: string[] = []
  for (const test of productionTests) {
    assert.equal(test.type, 'lesson')
    assert.equal(test.questions.length, 20, `${test.id} must have exactly 20 questions.`)
    assert.equal(test.blueprint.targetQuestionCount, 20)
    assert.deepEqual(test.blueprint.difficultyDistribution, EXPECTED_DIFFICULTY_DISTRIBUTION)
    const actualDifficultyDistribution = Object.fromEntries(DIFFICULTIES.map((difficulty) => [
      difficulty,
      test.questions.filter((question) => question.difficulty === difficulty).length,
    ]))
    assert.deepEqual(actualDifficultyDistribution, EXPECTED_DIFFICULTY_DISTRIBUTION, `${test.id} difficulty counts must match the 6/7/4/3 blueprint.`)
    const actualTypeDistribution = countQuestionsByType(test.questions)
    assert.deepEqual(test.blueprint.questionTypeDistribution, actualTypeDistribution, `${test.id} question-type blueprint must match its questions.`)
    assert.equal(Object.values(actualTypeDistribution).reduce((total, count) => total + count, 0), 20)
    assert.deepEqual(test.blueprint.coverage.lessons.map((entry) => entry.id), [test.lessonId])
    assert.deepEqual([...test.blueprint.coverage.lessons[0].questionIds].sort(), test.questions.map((question) => question.id).sort())
    assert.ok(test.blueprint.sourceConceptInventory.length > 0)

    const expectedPages = AUDITED_SOURCE_PAGE_RANGES[test.lessonId]
    assert.ok(expectedPages, `No audited source page range for ${test.lessonId}.`)
    const sourceIds = new Set(test.blueprint.sourceConceptInventory.map((source) => source.id))
    const usedSourceIds = new Set(test.questions.flatMap((question) => question.sourceConcepts))
    assert.deepEqual([...sourceIds].sort(), [...usedSourceIds].sort(), `${test.id} source inventory must be fully used and traceable.`)
    for (const source of test.blueprint.sourceConceptInventory) {
      assert.ok(source.references.length > 0)
      for (const reference of source.references) {
        assert.equal(reference.lessonId, test.lessonId)
        if (reference.kind === 'textbook-page') {
          assert.ok(reference.page >= expectedPages[0] && reference.page <= expectedPages[1], `${test.id} cites out-of-range page ${reference.page}.`)
        }
      }
    }

    const legacyPrompts = AUDITED_LEGACY_PROMPTS[test.lessonId] ?? []
    const normalizedLegacy = new Set(legacyPrompts.map(normalizeAuditText).filter(Boolean))
    const numberMaskedLegacy = new Set(legacyPrompts.map(normalizeTemplate).filter(Boolean))
    const currentTemplates = new Set<string>()
    for (const question of test.questions) {
      assert.equal(question.testId, test.id)
      assert.deepEqual(question.coverage.lessonIds, [test.lessonId])
      assert.ok(question.solution.steps.length > 0)
      assert.ok(question.originalityNote.trim().length >= 35, `${question.id} needs a specific editorial originality note.`)
      const prompt = flattenRich(question.prompt)
      const normalizedPrompt = normalizeAuditText(prompt)
      const templatePrompt = normalizeTemplate(prompt)
      if (normalizedLegacy.has(normalizedPrompt)) exactLegacyCollisionDetails.push(`${question.id}: ${prompt}`)
      if (numberMaskedLegacy.has(templatePrompt)) numberMaskedTemplateCollisionDetails.push(`${question.id}: ${prompt}`)
      assert.ok(!currentTemplates.has(templatePrompt), `${test.id} repeats a prompt template after masking numbers: ${prompt}`)
      currentTemplates.add(templatePrompt)
      const answer = studentAnswerFromKey(question)
      assert.equal(evaluateQuestion(question, answer).status, 'correct', `Deterministic answer key failed for ${question.id}.`)
    }
    const keyedAnswers = Object.fromEntries(
      test.questions.map((question) => [question.id, studentAnswerFromKey(question)]),
    ) as Record<string, StudentAnswer | undefined>
    assert.equal(scoreTest(test, keyedAnswers).correctCount, 20, `${test.id} must score all keyed answers deterministically.`)
  }
  assert.deepEqual(exactLegacyCollisionDetails, [], 'No production prompt may exactly match normalized audited Teacher Area / final-test prompts.')
  assert.deepEqual(numberMaskedTemplateCollisionDetails, [], 'No production prompt may duplicate a source/final-test prompt after masking number changes.')

  const syntheticRegistry = loadedRegistry.createTestRegistry(
    [completeUnit],
    [lessonTest, unitTest],
    { coverageMode: 'strict' },
  )
  assert.equal(syntheticRegistry.allTests.length, 2)
  assert.equal(syntheticRegistry.lessonTests.length, 1)
  assert.equal(syntheticRegistry.unitTests.length, 1)
  assert.equal(syntheticRegistry.getTestById(lessonTest.id)?.id, lessonTest.id)

  const unknownStatusRegistry = loadedRegistry.createTestRegistry(
    [{ ...completeUnit, status: 'unknown' }],
    [unitTest],
    { coverageMode: 'strict' },
  )
  assert.equal(unknownStatusRegistry.unitTests.length, 0)
  assert.equal(unknownStatusRegistry.getTestById(unitTest.id), undefined)

  const comprehensiveFixture = makeScoringTest(scoringQuestions)
  const comprehensiveUnit: UnitMeta = {
    id: 'scoring-unit',
    title: 'Synthetic scoring unit',
    accent: 'mint',
    status: 'in-progress',
    lessons: [{ id: scoringLessonId, title: 'Synthetic scoring lesson', availability: 'available' }],
  }
  const comprehensiveAudit = validateTestCatalog(
    [comprehensiveUnit],
    [comprehensiveFixture],
    { coverageMode: 'strict' },
  )
  assert.equal(comprehensiveAudit.eligibleDefinitionCount, 1)
  assert.ok(!comprehensiveAudit.issues.some((entry) => entry.code === 'QUESTION_COUNT_CONTRACT'))
  const sameScopeDifferentId: TestDefinition = {
    ...comprehensiveFixture,
    id: 'comprehensive-scoring-fixture-copy-test',
  }
  const duplicateComprehensiveAudit = validateTestCatalog(
    [comprehensiveUnit],
    [comprehensiveFixture, sameScopeDifferentId],
    { coverageMode: 'strict' },
  )
  assert.ok(duplicateComprehensiveAudit.issues.some((entry) => entry.code === 'COMPREHENSIVE_TEST_DUPLICATE'))

  const strictMissingReport = validateTestCatalog([completeUnit], [], { coverageMode: 'strict' })
  assert.equal(strictMissingReport.valid, false)
  assert.ok(strictMissingReport.issues.some((entry) => entry.code === 'LESSON_TEST_MISSING'))
  assert.ok(strictMissingReport.issues.some((entry) => entry.code === 'UNIT_TEST_MISSING'))

  for (const status of ['unknown', 'in-progress'] as const) {
    const incompleteUnit: UnitMeta = { ...completeUnit, status }
    const incompleteRegistry = loadedRegistry.createTestRegistry(
      [incompleteUnit],
      [unitTest],
      { coverageMode: 'strict' },
    )
    assert.equal(incompleteRegistry.unitTests.length, 0)
    assert.equal(incompleteRegistry.getTestById(unitTest.id), undefined)
    const incompleteCoverage = validateTestCatalog([incompleteUnit], [], { coverageMode: 'strict' })
    assert.ok(!incompleteCoverage.issues.some((entry) => entry.code === 'UNIT_TEST_MISSING'))
  }

  const orphanTest = makeLessonFixture(20, 'unknown-lesson')
  const orphanReport = validateTestCatalog([completeUnit], [orphanTest], { coverageMode: 'strict' })
  assert.ok(orphanReport.issues.some((entry) => entry.code === 'LESSON_NOT_FOUND'))

  const unavailableUnit: UnitMeta = {
    ...completeUnit,
    lessons: [{ ...completeUnit.lessons[0], availability: 'coming-soon' }],
  }
  const unavailableReport = validateTestCatalog([unavailableUnit], [lessonTest], { coverageMode: 'strict' })
  assert.ok(unavailableReport.issues.some((entry) => entry.code === 'LESSON_NOT_AVAILABLE'))
  assert.equal(unavailableReport.eligibleDefinitionCount, 0)

  const mismatchedParentTest: unknown = {
    ...lessonTest,
    questions: [{ ...lessonTest.questions[0], testId: 'another-test' }, ...lessonTest.questions.slice(1)],
  }
  const mismatchedParentReport = validateTestCatalog([completeUnit], [mismatchedParentTest], { coverageMode: 'strict' })
  assert.ok(mismatchedParentReport.issues.some((entry) => entry.code === 'QUESTION_TEST_ID_MISMATCH'))

  const placeholderTest: unknown = {
    ...lessonTest,
    questions: [{ ...lessonTest.questions[0], prompt: rich('TODO insert question here') }, ...lessonTest.questions.slice(1)],
  }
  const placeholderReport = validateTestCatalog([completeUnit], [placeholderTest], { coverageMode: 'strict' })
  assert.ok(placeholderReport.issues.some((entry) => entry.code === 'CONTENT_PLACEHOLDER'))

  const nonSerializableTest: unknown = {
    ...lessonTest,
    accidentalUiNode: { $$typeof: Symbol.for('react.element') },
  }
  const serializationReport = validateTestCatalog([completeUnit], [nonSerializableTest], { coverageMode: 'strict' })
  assert.ok(serializationReport.issues.some((entry) => entry.code === 'TEST_DATA_NOT_SERIALIZABLE'))

  const mismatchedBlueprint: unknown = {
    ...lessonTest,
    blueprint: {
      ...lessonTest.blueprint,
      difficultyDistribution: {
        ...lessonTest.blueprint.difficultyDistribution,
        basic: lessonTest.blueprint.difficultyDistribution.basic + 1,
      },
    },
  }
  const distributionReport = validateTestCatalog([completeUnit], [mismatchedBlueprint], { coverageMode: 'strict' })
  assert.ok(distributionReport.issues.some((entry) => entry.code === 'BLUEPRINT_DISTRIBUTION_INVALID'))
  assert.ok(distributionReport.issues.some((entry) => entry.code === 'BLUEPRINT_DISTRIBUTION_MISMATCH'))

  const shiftedDifficultyQuestion = { ...lessonTest.questions[0], difficulty: 'medium' as const }
  const shiftedDifficultyQuestions = [shiftedDifficultyQuestion, ...lessonTest.questions.slice(1)]
  const shiftedDifficultyDistribution = Object.fromEntries(DIFFICULTIES.map((difficulty) => [
    difficulty,
    shiftedDifficultyQuestions.filter((question) => question.difficulty === difficulty).length,
  ])) as Record<Difficulty, number>
  const shiftedDifficultyTest: TestDefinition = {
    ...lessonTest,
    questions: shiftedDifficultyQuestions,
    blueprint: { ...lessonTest.blueprint, difficultyDistribution: shiftedDifficultyDistribution },
  }
  const strictDifficultyReport = validateTestCatalog([completeUnit], [shiftedDifficultyTest], { coverageMode: 'strict' })
  assert.ok(strictDifficultyReport.issues.some((entry) => entry.code === 'LESSON_DIFFICULTY_DISTRIBUTION_INVALID'))
  assert.equal(strictDifficultyReport.eligibleDefinitionCount, 0)
  const fixtureInfrastructureReport = validateTestCatalog([completeUnit], [shiftedDifficultyTest], { coverageMode: 'infrastructure-only' })
  assert.ok(!fixtureInfrastructureReport.issues.some((entry) => entry.code === 'LESSON_DIFFICULTY_DISTRIBUTION_INVALID'))

  const badNumericQuestion = makeSyntheticNumericQuestion(lessonTest.id, lessonTest.questions[0].id, 'fixture-lesson', '-0.1')
  const invalidNumericTest: unknown = {
    ...lessonTest,
    questions: [badNumericQuestion, ...lessonTest.questions.slice(1)],
    blueprint: {
      ...lessonTest.blueprint,
      questionTypeDistribution: {
        ...lessonTest.blueprint.questionTypeDistribution,
        'true-false': 19,
        numeric: 1,
      },
    },
  }
  const negativeToleranceReport = validateTestCatalog([completeUnit], [invalidNumericTest], { coverageMode: 'infrastructure-only' })
  assert.ok(negativeToleranceReport.issues.some((entry) => entry.code === 'QUESTION_ANSWER_INVALID'))
  assert.ok(negativeToleranceReport.issues.some((entry) => entry.code === 'INFRASTRUCTURE_ONLY_POLICY_HAS_PRODUCTION_DEFINITIONS'))

  const malformedQuestion: Record<string, unknown> = { ...lessonTest.questions[0] }
  delete malformedQuestion.answer
  const missingAnswerTest: unknown = {
    ...lessonTest,
    questions: [malformedQuestion, ...lessonTest.questions.slice(1)],
  }
  const missingAnswerReport = validateTestCatalog([completeUnit], [missingAnswerTest], { coverageMode: 'strict' })
  assert.ok(missingAnswerReport.issues.some((entry) => entry.code === 'QUESTION_ANSWER_MISSING'))

  const duplicateReport = validateTestCatalog([completeUnit], [lessonTest, lessonTest], { coverageMode: 'strict' })
  assert.ok(duplicateReport.issues.some((entry) => entry.code === 'TEST_ID_DUPLICATE'))
  assert.ok(duplicateReport.issues.some((entry) => entry.code === 'LESSON_TEST_DUPLICATE'))
  assert.ok(duplicateReport.issues.some((entry) => entry.code === 'QUESTION_ID_DUPLICATE'))
  assert.equal(duplicateReport.eligibleDefinitionCount, 0)

  for (const question of scoringQuestions) {
    const answer = correctAnswers[question.id]
    assert.ok(answer)
    assert.equal(evaluateQuestion(question, answer).status, 'correct', `Scoring failed for ${question.type}`)
  }
  assert.equal(
    evaluateQuestion(scoringQuestions[3], { type: 'numeric', value: '١٢٫١١ cm' }).status,
    'incorrect',
    'Numeric tolerance must be enforced exactly.',
  )
  assert.equal(
    evaluateQuestion(scoringQuestions[3], { type: 'numeric', value: '12.05 inches' }).status,
    'incorrect',
    'Unaccepted units must not be ignored.',
  )
  assert.equal(
    evaluateQuestion(scoringQuestions[2], { type: 'multi-select', value: ['select-a'] }).status,
    'incorrect',
    'Multi-select scoring must be all-or-nothing.',
  )
  assert.equal(evaluateQuestion(scoringQuestions[0], undefined).status, 'unanswered')
  assert.equal(hasProvidedAnswer(scoringQuestions[0], undefined), false)
  assert.equal(hasProvidedAnswer(scoringQuestions[1], { type: 'true-false', value: true }), true)
  assert.equal(evaluateQuestion(scoringQuestions[1], { type: 'true-false', value: true }).status, 'incorrect')
  assert.equal(normalizeNumericGlyphs('۱۲٣٫٤'), '123.4')
  assert.deepEqual(parseDecimal('١٬٢٣٤٫٥'), { numerator: 2469n, denominator: 2n })
  assert.deepEqual(parseDecimal('0.1'), { numerator: 1n, denominator: 10n })

  const scoreAnswers: Record<string, StudentAnswer | undefined> = { ...correctAnswers }
  scoreAnswers['score-true-false'] = { type: 'true-false', value: true }
  delete scoreAnswers['score-matching']
  const scored = scoreTest(makeScoringTest(scoringQuestions), scoreAnswers)
  assert.equal(scored.correctCount, 6)
  assert.equal(scored.incorrectCount, 1)
  assert.equal(scored.unansweredCount, 1)
  assert.equal(scored.score, 6)
  assert.equal(scored.maxScore, 8)
  assert.equal(scored.percentage, 75)

  const emptyScore = scoreTest(makeScoringTest([]), {})
  assert.equal(emptyScore.maxScore, 0)
  assert.equal(emptyScore.percentage, 0)

  console.log('Test infrastructure runtime checks passed: strict validation, eligibility, autodiscovery, and all 8 scoring types.')
  console.log('Production catalog: strict coverage PASS; 7 lesson tests, 140 keyed questions; Unit 1 remains unknown; 0 Unit Tests and 0 Comprehensive Tests.')
  for (const test of [...productionTests].sort((left, right) => left.id.localeCompare(right.id))) {
    const types = QUESTION_TYPES
      .map((type) => [type, test.blueprint.questionTypeDistribution[type]] as const)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => `${type}=${count}`)
      .join(', ')
    console.log(`  ${test.id}: 20 questions; basic/medium/advanced/thinking=6/7/4/3; types: ${types}`)
  }
  console.log(`Originality prompt audit: ${exactLegacyCollisionDetails.length} exact/normalized collisions; ${numberMaskedTemplateCollisionDetails.length} number-masked source/template collisions; all 140 originality notes are distinct.`)
  console.log('Human semantic/template review remains editorial: automated text comparisons are a screen, not proof of semantic originality.')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
