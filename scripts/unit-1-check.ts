/**
 * Unit 1 completion + Unit Test audit (npm run unit-1-check).
 *
 * This check proves three things without trusting metadata alone:
 *   1. Unit 1 really is complete: eight registered lessons, every one available, routed to a real
 *      component, documented in the Teacher Area and covered by its own eligible lesson test.
 *   2. The Unit 1 test is real content: 50–60 questions (target 60), every lesson of the unit
 *      covered by a meaningful share, every answer key deterministically scorable, every prompt
 *      distinct from the textbook/Teacher Area prompts and from the lesson tests.
 *   3. The eligibility gate works: the unit test disappears from the catalog the moment Unit 1 is
 *      not explicitly marked complete.
 */
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { createServer } from 'vite'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import type { TestRegistrySnapshot } from '../src/tests/registry'
import { analyzeTestCatalog, type CoverageMode } from '../src/tests/validation'
import { evaluateQuestion, normalizeNumericGlyphs, scoreTest } from '../src/tests/scoring'
import { DIFFICULTIES, QUESTION_TYPES, type QuestionDefinition, type RichContent, type StudentAnswer, type TestDefinition } from '../src/tests/types'
import type { UnitMeta } from '../src/types'
import { lessonOneTeacherEntries } from '../src/teacher/lesson1'
import { lessonTwoTeacherEntries } from '../src/teacher/lesson2'
import { lessonThreeTeacherEntries } from '../src/teacher/lesson3'
import { lessonFourTeacherEntries } from '../src/teacher/lesson4'
import { lessonFiveTeacherEntries } from '../src/teacher/lesson5'
import { lessonSixTeacherEntries } from '../src/teacher/lesson6'
import { lessonSevenTeacherEntries } from '../src/teacher/lesson7'
import { lessonEightTeacherEntries } from '../src/teacher/lesson8'

const fail = (message: string): never => { throw new Error(`Unit 1 check failed: ${message}`) }

const EXPECTED_LESSONS = [
  { id: 'coordinates', title: 'شبكة الإحداثيات', entries: lessonOneTeacherEntries },
  { id: 'line-graphs', title: 'التمثيلات البيانية بالخطوط', entries: lessonTwoTeacherEntries },
  { id: 'natural-numbers', title: 'الأعداد الطبيعية', entries: lessonThreeTeacherEntries },
  { id: 'rounding-natural-numbers', title: 'تقريب الأعداد الطبيعية', entries: lessonFourTeacherEntries },
  { id: 'adding-subtracting-natural-numbers', title: 'جمع الأعداد الطبيعيّة وطرحها', entries: lessonFiveTeacherEntries },
  { id: 'angle-measurement', title: 'قياس الزوايا', entries: lessonSixTeacherEntries },
  { id: 'parallelogram', title: 'متوازي الأضلاع', entries: lessonSevenTeacherEntries },
  { id: 'rhombus', title: 'المعيّن', entries: lessonEightTeacherEntries },
] as const

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

function studentAnswerFromKey(question: QuestionDefinition): StudentAnswer {
  switch (question.type) {
    case 'single-choice': return { type: question.type, value: question.answer }
    case 'true-false': return { type: question.type, value: question.answer }
    case 'multi-select': return { type: question.type, value: question.answer }
    case 'numeric': {
      const suffix = question.answer.unitPolicy.kind === 'none' ? '' : ` ${question.answer.unitPolicy.acceptedUnits[0]}`
      return { type: question.type, value: `${question.answer.expected}${suffix}` }
    }
    case 'fraction': return { type: question.type, value: `${question.answer.numerator}/${question.answer.denominator}` }
    case 'ordering': return { type: question.type, value: question.answer }
    case 'matching': return { type: question.type, value: question.answer }
    case 'error-analysis': return { type: question.type, value: question.answer }
  }
}

async function main(): Promise<void> {
  /* ---------------------------------------------------- 1. Unit 1 is genuinely complete */
  const unit = curriculumRegistry.find((candidate) => candidate.id === 'unit-1')
  if (!unit) fail('unit-1 is missing from the curriculum registry')
  assert.equal(unit!.status, 'complete', 'Unit 1 must be explicitly marked complete in the curriculum metadata.')
  assert.deepEqual(unit!.lessons.map((lesson) => lesson.id), EXPECTED_LESSONS.map((lesson) => lesson.id))
  for (const expected of EXPECTED_LESSONS) {
    const lesson = unit!.lessons.find((candidate) => candidate.id === expected.id)
    if (!lesson) fail(`lesson ${expected.id} is not registered in unit-1`)
    assert.equal(lesson!.availability, 'available', `lesson ${expected.id} must be available while the unit is complete`)
    assert.equal(lesson!.title, expected.title, `lesson ${expected.id} title drifted from the Teacher Area tab title`)
    if (!lessonComponents[expected.id]) fail(`lesson ${expected.id} has no routed component`)
    if (expected.entries.length === 0) fail(`lesson ${expected.id} has no Teacher Area solutions`)
  }

  /* ---------------------------------------------------- 2. the catalog, as production builds it */
  const lessonDefinitions: TestDefinition[] = []
  for (const file of readdirSync('src/tests/definitions/lessons').sort()) {
    lessonDefinitions.push((await import(`../src/tests/definitions/lessons/${file}`)).default as TestDefinition)
  }
  const unitDefinitions: TestDefinition[] = []
  for (const file of readdirSync('src/tests/definitions/units').sort()) {
    unitDefinitions.push((await import(`../src/tests/definitions/units/${file}`)).default as TestDefinition)
  }
  const allDefinitions = [...lessonDefinitions, ...unitDefinitions]
  const analysis = analyzeTestCatalog(curriculumRegistry, allDefinitions, { coverageMode: 'strict' })
  assert.equal(analysis.report.valid, true, JSON.stringify(analysis.report.issues, null, 2))
  assert.equal(unitDefinitions.length, 1, 'Unit 1 must own exactly one unit-test definition file.')

  // The production registry resolves its definitions through a Vite glob; load it the same way so
  // autodiscovery of the new unit-test file is proven, not assumed.
  const server = await createServer({ configFile: 'vite.config.ts', appType: 'custom', server: { middlewareMode: true } })
  let loaded: {
    discoveredTestDefinitions: readonly unknown[]
    testRegistry: TestRegistrySnapshot
    createTestRegistry: (units: readonly UnitMeta[], definitions: readonly unknown[], options: { coverageMode: CoverageMode }) => TestRegistrySnapshot
  }
  try {
    loaded = await server.ssrLoadModule('/src/tests/registry.ts') as typeof loaded
  } finally {
    await server.close()
  }
  assert.equal(loaded.discoveredTestDefinitions.length, allDefinitions.length, 'Vite autodiscovery must pick up every lesson test plus the Unit 1 test.')
  assert.equal(loaded.testRegistry.report.valid, true, JSON.stringify(loaded.testRegistry.issues, null, 2))
  assert.equal(loaded.testRegistry.unitTests.length, 1, 'the Unit 1 test must be discovered and eligible in the production registry')
  assert.equal(loaded.testRegistry.unitTests[0].id, 'unit-unit-1-test')

  for (const expected of EXPECTED_LESSONS) {
    const test = lessonDefinitions.find((definition) => definition.type === 'lesson' && definition.lessonId === expected.id)
    if (!test) fail(`lesson ${expected.id} has no lesson test, so the unit cannot be complete`)
    assert.equal(test!.questions.length, 20, `lesson test ${test!.id} must keep exactly 20 questions`)
  }

  const unitTest = unitDefinitions[0]
  assert.equal(unitTest.id, 'unit-unit-1-test')
  assert.equal(unitTest.type, 'unit')
  assert.equal(unitTest.type === 'unit' ? unitTest.unitId : '', 'unit-1')

  /* ---------------------------------------------------- 3. size, blueprint and coverage */
  const count = unitTest.questions.length
  assert.ok(count >= 50 && count <= 60, `Unit tests must contain 50–60 questions; found ${count}.`)
  assert.equal(count, 60, 'The agreed target for the Unit 1 test is 60 questions.')
  assert.equal(unitTest.blueprint.targetQuestionCount, count)

  const difficultyCounts = Object.fromEntries(DIFFICULTIES.map((difficulty) => [
    difficulty,
    unitTest.questions.filter((question) => question.difficulty === difficulty).length,
  ])) as Record<(typeof DIFFICULTIES)[number], number>
  assert.deepEqual(unitTest.blueprint.difficultyDistribution, difficultyCounts)
  for (const difficulty of DIFFICULTIES) {
    assert.ok(difficultyCounts[difficulty] >= 5, `the unit test needs a real share of ${difficulty} items; found ${difficultyCounts[difficulty]}`)
  }
  const typeCounts = Object.fromEntries(QUESTION_TYPES.map((type) => [
    type,
    unitTest.questions.filter((question) => question.type === type).length,
  ]))
  assert.deepEqual(unitTest.blueprint.questionTypeDistribution, typeCounts)
  assert.ok(QUESTION_TYPES.filter((type) => (typeCounts as Record<string, number>)[type] > 0).length >= 6, 'the unit test should exercise at least six question types')

  assert.deepEqual(
    unitTest.blueprint.coverage.lessons.map((entry) => entry.id),
    EXPECTED_LESSONS.map((lesson) => lesson.id),
    'the unit blueprint must list every Unit 1 lesson in curriculum order',
  )
  for (const entry of unitTest.blueprint.coverage.lessons) {
    const expectedIds = unitTest.questions
      .filter((question) => question.coverage.lessonIds.includes(entry.id))
      .map((question) => question.id)
    assert.deepEqual([...entry.questionIds].sort(), [...expectedIds].sort(), `coverage mismatch for ${entry.id}`)
    assert.ok(entry.questionIds.length >= 4, `lesson ${entry.id} is under-represented in the unit test (${entry.questionIds.length} questions)`)
  }
  const crossLessonQuestions = unitTest.questions.filter((question) => question.coverage.lessonIds.length > 1)
  assert.ok(crossLessonQuestions.length >= 3, 'a unit test should contain synthesis questions that span more than one lesson')

  /* ---------------------------------------------------- 4. originality + deterministic scoring */
  const legacyPrompts = EXPECTED_LESSONS.flatMap((lesson) => lesson.entries.map((entry) => entry.prompt))
  const legacyExact = new Set(legacyPrompts.map(normalizeAuditText).filter(Boolean))
  const legacyTemplates = new Set(legacyPrompts.map(normalizeTemplate).filter(Boolean))
  const lessonPrompts = lessonDefinitions.flatMap((definition) => definition.questions.map((question) => flattenRich(question.prompt)))
  const lessonExact = new Set(lessonPrompts.map(normalizeAuditText))
  const lessonTemplates = new Set(lessonPrompts.map(normalizeTemplate))
  const seenTemplates = new Set<string>()
  for (const question of unitTest.questions) {
    const prompt = flattenRich(question.prompt)
    const exact = normalizeAuditText(prompt)
    const template = normalizeTemplate(prompt)
    if (legacyExact.has(exact) || legacyTemplates.has(template)) fail(`unit question ${question.id} duplicates a textbook/Teacher Area prompt`)
    if (lessonExact.has(exact) || lessonTemplates.has(template)) fail(`unit question ${question.id} duplicates a lesson-test prompt`)
    if (seenTemplates.has(template)) fail(`unit question ${question.id} repeats another unit prompt after masking numbers`)
    seenTemplates.add(template)
    if (question.originalityNote.trim().length < 35) fail(`unit question ${question.id} needs a specific originality note`)
    if (question.solution.steps.length === 0) fail(`unit question ${question.id} has no solution steps`)
    if (evaluateQuestion(question, studentAnswerFromKey(question)).status !== 'correct') fail(`deterministic answer key failed for ${question.id}`)
  }
  const keyed = Object.fromEntries(unitTest.questions.map((question) => [question.id, studentAnswerFromKey(question)])) as Record<string, StudentAnswer | undefined>
  const scored = scoreTest(unitTest, keyed)
  assert.equal(scored.correctCount, count)
  assert.equal(scored.percentage, 100)
  const empty = scoreTest(unitTest, {})
  assert.equal(empty.correctCount, 0)
  assert.equal(empty.unansweredCount, count, 'an untouched attempt must report every question as unanswered, never as wrong')

  /* ---------------------------------------------------- 5. the completion gate really gates */
  const eligible = loaded.createTestRegistry(curriculumRegistry, loaded.discoveredTestDefinitions, { coverageMode: 'strict' })
  assert.equal(eligible.unitTests.length, 1)
  assert.ok(eligible.getTestById('unit-unit-1-test'))
  for (const status of ['unknown', 'in-progress'] as const) {
    const gated = loaded.createTestRegistry(
      curriculumRegistry.map((candidate) => (candidate.id === 'unit-1' ? { ...candidate, status } : candidate)),
      loaded.discoveredTestDefinitions,
      { coverageMode: 'strict' },
    )
    assert.equal(gated.unitTests.length, 0, `the unit test must be hidden while unit-1 is ${status}`)
    assert.equal(gated.getTestById('unit-unit-1-test'), undefined)
    assert.equal(gated.lessonTests.length, EXPECTED_LESSONS.length + 1, 'all eight Unit 1 lesson tests plus the available Unit 2 Lesson 1 test must stay available regardless of Unit 1 status')
  }

  /* ---------------------------------------------------- report */
  console.log(`Unit 1 check passed: ${EXPECTED_LESSONS.length} lessons complete and available, each routed, documented in the Teacher Area and covered by a 20-question lesson test.`)
  console.log(`Unit 1 test: ${count} questions · difficulty ${DIFFICULTIES.map((difficulty) => `${difficulty}=${difficultyCounts[difficulty]}`).join(', ')}`)
  console.log(`Coverage blueprint: ${unitTest.blueprint.coverage.lessons.map((entry) => `${entry.id}=${entry.questionIds.length}`).join(', ')} (${crossLessonQuestions.length} cross-lesson synthesis questions).`)
  console.log('Eligibility gate verified: the unit test only appears while unit-1 is explicitly complete.')
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
