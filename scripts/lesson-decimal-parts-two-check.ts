/**
 * Unit 2 · Lesson 7 source/content/test contract check (textbook pp. 66–71).
 * Checks the coverage ledger, teacher-solution resolution, registry and component wiring,
 * and the 20-question lesson test. Pass --write-coverage only to regenerate the JSON ledger.
 * The jsdom interaction check (lesson-decimal-parts-two-interaction-check.tsx) covers the rendered UI.
 */
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import { flattenLesson7CoverageIds, lesson7CoverageTotals, lesson7SourceCoverage } from '../src/lessons/decimalPartsTwoData'
import { unit2Lesson7AllEntries } from '../src/teacher/unit2Lesson7'
import definition from '../src/tests/definitions/lessons/decimal-parts-two.test'
import { evaluateQuestion } from '../src/tests/scoring'
import type { QuestionDefinition, StudentAnswer } from '../src/tests/types'

const coveragePath = new URL('../docs/unit2-lesson7-coverage.json', import.meta.url)
const auditPath = new URL('../docs/unit2-lesson7-source-audit.md', import.meta.url)

const teacherById = new Map(unit2Lesson7AllEntries.map((entry) => [entry.id, entry]))
const ledgerIds = flattenLesson7CoverageIds()

// 1 · ledger shape and totals
assert.equal(lesson7SourceCoverage.length, 30, 'ledger has 30 element blocks (pp. 66–71)')
const branchCount = lesson7SourceCoverage.reduce((sum, element) => sum + element.branches.length, 0)
assert.equal(branchCount, 51, 'ledger has 51 branch items')
assert.equal(new Set(ledgerIds).size, ledgerIds.length, 'ledger IDs are unique')
assert.equal(lesson7CoverageTotals.sourceBlocks, 30)
assert.equal(lesson7CoverageTotals.confirmed + lesson7CoverageTotals.partial + lesson7CoverageTotals.unresolved, 30)
for (const element of lesson7SourceCoverage) {
  assert.ok([66, 67, 68, 69, 70, 71].includes(element.page), `${element.id} cites a page inside the audited scope`)
}

// 2 · every branch resolves to at least one teacher entry, and every teacher entry resolves
for (const element of lesson7SourceCoverage) {
  for (const branch of element.branches) {
    assert.ok(branch.teacherEntryIds.length > 0, `${branch.id} has a teacher entry`)
    for (const entryId of branch.teacherEntryIds) {
      assert.ok(teacherById.has(entryId), `${branch.id} resolves to teacher entry ${entryId}`)
    }
  }
}
for (const entry of unit2Lesson7AllEntries) {
  assert.ok(entry.id && entry.answer.trim() && entry.reasoning.length >= 1 && entry.prompt.trim(), `${entry.id} has a full solution`)
}

// 3 · registry and component wiring; earlier lessons remain in their original order
const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(unitTwo, 'unit 2 exists in the registry')
assert.equal(unitTwo!.status, 'in-progress', 'unit 2 stays in progress (no unit-2 test yet)')
assert.equal(unitTwo!.lessons[unitTwo!.lessons.length - 3]?.id, 'tenths-one', 'Lesson 6 stays immediately before Lesson 7')
const previousLastLesson = unitTwo!.lessons[unitTwo!.lessons.length - 2]
assert.equal(previousLastLesson?.id, 'decimal-parts-two', 'Lesson 7 keeps its position immediately before Lesson 8')
assert.equal(previousLastLesson?.title, 'الأجزاء العشرية (2)')
assert.equal(previousLastLesson?.availability, 'available')
assert.equal(typeof lessonComponents['decimal-parts-two'], 'function', 'Lesson 7 remains wired into lessonComponents')

// 4 · test contract (strict 20: 6 basic, 7 medium, 4 advanced, 3 thinking)
assert.equal(definition.id, 'lesson-decimal-parts-two-test')
assert.equal(definition.lessonId, 'decimal-parts-two')
assert.equal(definition.questions.length, 20)
const counts = definition.questions.reduce<Record<string, number>>((acc, question) => {
  acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1
  return acc
}, {})
assert.deepEqual(counts, { basic: 6, medium: 7, advanced: 4, thinking: 3 }, 'difficulty split is 6/7/4/3')
assert.equal(new Set(definition.questions.map((question) => question.id)).size, 20, 'question IDs are unique')
assert.ok(
  definition.questions.every((question) => question.originalityNote.trim().length >= 35 && question.solution.steps.length >= 2),
  'every question has a specific note and worked solution',
)
const sourceInventory = new Set(definition.blueprint.sourceConceptInventory.map((item) => item.id))
const usedSources = new Set(definition.questions.flatMap((question) => question.sourceConcepts))
assert.deepEqual([...sourceInventory].sort(), [...usedSources].sort(), 'all cited source concepts are used and inventoried')
for (const source of definition.blueprint.sourceConceptInventory) {
  for (const reference of source.references) {
    if (reference.kind === 'textbook-page') assert.ok(reference.page >= 66 && reference.page <= 71, `${source.id} cites pages 66–71`)
  }
}

function keyAnswer(question: QuestionDefinition): StudentAnswer {
  switch (question.type) {
    case 'single-choice': return { type: 'single-choice', value: question.answer }
    case 'true-false': return { type: 'true-false', value: question.answer }
    case 'multi-select': return { type: 'multi-select', value: question.answer }
    case 'numeric': return { type: 'numeric', value: question.answer.expected }
    case 'fraction': return { type: 'fraction', value: `${question.answer.numerator}/${question.answer.denominator}` }
    case 'ordering': return { type: 'ordering', value: question.answer }
    case 'matching': return { type: 'matching', value: question.answer }
    case 'error-analysis': return { type: 'error-analysis', value: question.answer }
    default: { const exhaustive: never = question; return exhaustive }
  }
}
for (const question of definition.questions) {
  assert.equal(evaluateQuestion(question, keyAnswer(question)).status, 'correct', `${question.id}: answer key scores correct`)
  assert.equal(question.testId, definition.id)
  assert.deepEqual(question.coverage.lessonIds, ['decimal-parts-two'])
}
assert.equal(evaluateQuestion(definition.questions[0], { type: 'single-choice', value: 'q01-b' }).status, 'incorrect')
assert.equal(evaluateQuestion(definition.questions[0], undefined).status, 'unanswered')

// 5 · coverage JSON and audit report
const expectedCoverage = {
  lessonId: 'decimal-parts-two',
  sourcePages: [66, 67, 68, 69, 70, 71],
  totals: { elements: 30, branches: 51, anchors: 81, ...lesson7CoverageTotals },
  elements: lesson7SourceCoverage.map((element) => ({
    id: element.id,
    page: element.page,
    sourceStatus: element.sourceStatus,
    branches: element.branches.map((branch) => ({ id: branch.id, teacherEntryIds: branch.teacherEntryIds })),
  })),
}
if (process.argv.includes('--write-coverage')) {
  writeFileSync(coveragePath, `${JSON.stringify(expectedCoverage, null, 2)}\n`)
}
const coverageOnDisk = JSON.parse(readFileSync(coveragePath, 'utf8'))
assert.deepEqual(coverageOnDisk, JSON.parse(JSON.stringify(expectedCoverage)), 'coverage JSON matches the ledger (regenerate with --write-coverage)')
const auditText = readFileSync(auditPath, 'utf8')
assert.ok(auditText.includes('30 مؤكدة، 0 جزئية، 0 غير محسومة'), 'audit report states the 30/0/0 block count')
assert.ok(auditText.includes('51 فرعاً'), 'audit report states the 51 branch count')

console.log(`PASS decimal-parts-two: ${lesson7CoverageTotals.sourceBlocks} source blocks, ${branchCount} branches (${lesson7CoverageTotals.confirmed} confirmed, ${lesson7CoverageTotals.partial} partial, ${lesson7CoverageTotals.unresolved} unresolved); 20 questions 6/7/4/3; registry and component wired.`)
