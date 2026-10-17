/**
 * Unit 2 · Lesson 6 source/content/test contract check (textbook pp. 62–65).
 * The coverage JSON is a review ledger, while this script independently checks its IDs,
 * textbook-page metadata, teacher solutions, key mathematics, and the strict 20-question test.
 * Pass --write-coverage only when intentionally regenerating the reviewed ledger.
 */
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import {
  compareRationalValues, flattenCoverageIds, isAcceptedVerbalTenths, isDecimalEquivalentToTenths,
  isStrictlyBetweenTenths, isTenthsFractionInput, lesson6CoverageTotals, lesson6SourceCoverage,
  p62ComparisonItems, p62GridItems, p63CheckOneItems, p63CheckThreeItems, p63ExampleItems,
  p64ComparisonItems, p64NumberLineValues, p64TableColumns, p65ComparisonItems, p65MatchDecimals,
  p65MatchFractions, p65RulerItems, p65ShadingItems, p65VerbalItems,
} from '../src/lessons/tenthsOneData'
import { unit2Lesson6PlatformEntries, unit2Lesson6TeacherEntries } from '../src/teacher/unit2Lesson6'
import definition from '../src/tests/definitions/lessons/tenths-one.test'
import { evaluateQuestion } from '../src/tests/scoring'
import { DIFFICULTIES, type QuestionDefinition, type StudentAnswer } from '../src/tests/types'

const coveragePath = new URL('../docs/unit2-lesson6-coverage.json', import.meta.url)
const auditPath = new URL('../docs/unit2-lesson6-source-audit.md', import.meta.url)
const auditText = readFileSync(auditPath, 'utf8')
const teacherEntries = [...unit2Lesson6TeacherEntries, ...unit2Lesson6PlatformEntries]
const teacherById = new Map(teacherEntries.map((entry) => [entry.id, entry]))

assert.equal(auditText.includes('25'), true, 'source-audit report must remain in the repository')
assert.ok(auditText.includes('24 مؤكدة، 1 جزئية، 0 غير محسومة'), 'source audit retains the 24/1/0 evidence count')
assert.deepEqual(lesson6CoverageTotals, { sourceBlocks: 25, confirmed: 24, partial: 1, unresolved: 0 })
assert.equal(lesson6SourceCoverage.length, 25, 'all audited source blocks are recorded')
assert.deepEqual([...new Set(lesson6SourceCoverage.map((item) => item.page))].sort(), [62, 63, 64, 65])
assert.equal(new Set(flattenCoverageIds()).size, flattenCoverageIds().length, 'every source block/branch ID is unique')
assert.equal(lesson6SourceCoverage.filter((item) => item.sourceStatus === 'partial').map((item) => item.id).join(','), 'l6-p63-decimal-note')
assert.equal(lesson6CoverageTotals.unresolved, 0)

const allGridCounts = p62GridItems.map((item) => item.numerator)
assert.deepEqual(allGridCounts, [3, 4, 10], 'page 62 blue slices are three, four and ten of ten')
assert.deepEqual(p62ComparisonItems.map((item) => [item.left, item.right, item.relation]), [['3/10', '1', '<'], ['10/10', '1', '='], ['4/10', '3/10', '>']])
assert.deepEqual(p63ExampleItems.map((item) => `${item.numerator}/10`), ['1/10', '4/10', '8/10'])
assert.deepEqual(p63CheckOneItems.map((item) => item.numerator), [6, 7], 'p. 63 item 1 uses both opening facts')
assert.deepEqual(p63CheckThreeItems.map((item) => item.numerator), [7, 5], 'p. 63 item 3 is 7/10 and 5/10')
assert.deepEqual(p64ComparisonItems.map((item) => [item.left, item.right]), [['0.1', '0.3'], ['0.5', '0.6'], ['0.8', '0.4'], ['0.5', '5/10']])
assert.deepEqual([...p64NumberLineValues], [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9])
assert.deepEqual(p64TableColumns.map((column) => [column.printedFraction, column.printedDecimal]), [['', '0.7'], ['', '0.1'], ['', '0.5'], ['2/10', ''], ['6/10', ''], ['3/10', '']])
assert.deepEqual(p65RulerItems.map((item) => [item.label, item.tenths]), [['أ', 9], ['ب', 4], ['ج', 7], ['د', 5]])
assert.deepEqual(p65ShadingItems.map((item) => [item.position, item.decimal]), [['الشكل الأيسر', '0.9'], ['الشكل الأوسط', '0.2'], ['الشكل الأيمن', '0.7']])
assert.deepEqual(p65VerbalItems.map((item) => item.numeral), [1, 5, 2, 6])
assert.deepEqual(p65ComparisonItems.map((item) => [item.left, item.right]), [['0.4', '0.1'], ['0.2', '0.3'], ['0.5', '0.9'], ['4/10', '0.4'], ['0.3', '3/10'], ['1', '0.2']])
assert.deepEqual(p65MatchDecimals.map((item) => item.value), ['0.3', '0.4', '0.5', '0.6'])
assert.deepEqual(p65MatchFractions.map((item) => item.value), ['5/10', '3/5', '9/30', '16/40'])
assert.equal(compareRationalValues('0.3', '9/30'), 0)
assert.equal(compareRationalValues('0.4', '16/40'), 0)
assert.equal(compareRationalValues('0.5', '5/10'), 0)
assert.equal(compareRationalValues('0.6', '3/5'), 0)
assert.equal(isTenthsFractionInput('٩/١٠', 9), true)
assert.equal(isTenthsFractionInput('9/100', 9), false)
assert.equal(isDecimalEquivalentToTenths('٠٫٧', 7), true)
assert.equal(isAcceptedVerbalTenths('تِسْعَةُ أَجْزَاءٍ مِنْ عَشَرَة', 9), true)
assert.equal(isStrictlyBetweenTenths('4/10', 3, 7), true)
assert.equal(isStrictlyBetweenTenths('0.7', 3, 7), false, 'the endpoints of the open interval are excluded')
assert.equal(isStrictlyBetweenTenths('٠٫٣٢', 3, 7), true, 'Arabic decimal input strictly inside the open interval is accepted')

assert.equal(teacherEntries.length, 61, '58 textbook entries plus three platform entries')
assert.equal(new Set(teacherEntries.map((entry) => entry.id)).size, teacherEntries.length, 'teacher entry IDs are unique')
for (const element of lesson6SourceCoverage) {
  const references = [...element.teacherEntryIds, ...element.branches.flatMap((branch) => branch.teacherEntryIds)]
  if (element.branches.length) assert.ok(element.branches.every((branch) => branch.teacherEntryIds.length > 0), `${element.id} has teacher coverage for every branch`)
  for (const id of references) {
    const entry = teacherById.get(id)
    assert.ok(entry, `${element.id}: missing teacher solution ${id}`)
    assert.equal(entry!.source.type, 'textbook', `${id} must carry textbook attribution`)
    assert.equal(entry!.source.type === 'textbook' ? entry!.source.page : -1, element.page, `${id} must refer to page ${element.page}`)
    assert.ok(entry!.answer.trim() && entry!.reasoning.length >= 2, `${id} needs an answer and a worked explanation`)
  }
}
for (const entry of unit2Lesson6PlatformEntries) assert.equal(entry.source.type, 'platform', `${entry.id} must be identified as platform-authored`)
assert.ok(teacherById.get('t-l6-p63-decimal-note')?.note?.includes('لا نجزم'), 'partial punctuation is not guessed in teacher notes')
assert.ok(teacherById.get('t-l6-p64-example1')?.answer.includes('5/10 < 8/10'), 'page 64 example preserves the printed comparison direction')
for (const id of ['t-l6-p65-q8-03', 't-l6-p65-q8-04', 't-l6-p65-q8-05', 't-l6-p65-q8-06']) {
  assert.ok(teacherById.get(id)?.note?.includes('المصدر لا يرسم خطوط وصل'), `${id} must label the matching as a mathematical inference`)
}

assert.equal(lessonComponents['tenths-one'] !== undefined, true, 'the new lesson is wired into the lesson component registry')
const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(unitTwo)
assert.equal(unitTwo!.status, 'in-progress', 'Unit 2 remains in progress')
assert.equal(unitTwo!.lessons[unitTwo!.lessons.length - 1]?.id, 'tenths-one')
assert.equal(unitTwo!.lessons[unitTwo!.lessons.length - 1]?.availability, 'available')

assert.equal(definition.type, 'lesson')
assert.equal(definition.id, 'lesson-tenths-one-test')
assert.equal(definition.lessonId, 'tenths-one')
assert.equal(definition.questions.length, 20)
assert.equal(definition.blueprint.targetQuestionCount, 20)
assert.deepEqual(definition.blueprint.difficultyDistribution, { basic: 6, medium: 7, advanced: 4, thinking: 3 })
const actualDifficulty = Object.fromEntries(DIFFICULTIES.map((level) => [level, definition.questions.filter((question) => question.difficulty === level).length]))
assert.deepEqual(actualDifficulty, { basic: 6, medium: 7, advanced: 4, thinking: 3 })
assert.equal(new Set(definition.questions.map((question) => question.id)).size, 20, 'test question IDs are unique')
assert.ok(definition.questions.every((question) => question.originalityNote.trim().length >= 35 && question.solution.steps.length >= 2), 'every original test item has a specific note and worked solution')
const sourceInventory = new Set(definition.blueprint.sourceConceptInventory.map((item) => item.id))
const usedSources = new Set(definition.questions.flatMap((question) => question.sourceConcepts))
assert.deepEqual([...sourceInventory].sort(), [...usedSources].sort(), 'all cited source concepts are used, and all used concepts are inventoried')
for (const source of definition.blueprint.sourceConceptInventory) {
  assert.ok(source.references.length > 0)
  for (const reference of source.references) {
    assert.equal(reference.kind, 'textbook-page')
    if (reference.kind === 'textbook-page') assert.ok(reference.page >= 62 && reference.page <= 65, `${source.id} cites a page inside the audited scope`)
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
  assert.equal(evaluateQuestion(question, keyAnswer(question)).status, 'correct', `${question.id}: answer key must score correct`)
  assert.equal(question.testId, definition.id)
  assert.deepEqual(question.coverage.lessonIds, ['tenths-one'])
}
assert.equal(evaluateQuestion(definition.questions[0], { type: 'single-choice', value: 'q01-b' }).status, 'incorrect')
assert.equal(evaluateQuestion(definition.questions[0], undefined).status, 'unanswered')

const expectedCoverage = {
  lessonId: 'tenths-one',
  title: 'الأجزاء العشرية (1)',
  sourcePages: [62, 63, 64, 65],
  sourceAudit: {
    report: 'docs/unit2-lesson6-source-audit.md',
    totalBlocks: 25,
    confirmed: 24,
    partial: 1,
    unresolved: 0,
    partialItem: 'l6-p63-decimal-note',
  },
  sourceNotes: [
    'صور الصفحات الأصلية هي المرجع؛ هذا السجل يربط كل كتلة مصدرية وفروعها بموضع الطالب وحل المعلم.',
    'لا يُجزم بهوية محرف العلامة الصغيرة داخل قوسي ملاحظة الفاصلة في ص63.',
    'أزواج سؤال 8 ص65 استنتاج رياضي من القيم، وليست خطوط وصل مطبوعة في المصدر.',
    'أشكال سؤال 4 ص65 مُعرّفة بموضعها من اليسار إلى اليمين لأن الصورة لا تطبع حروف فروع لها.',
  ],
  sourceIdCount: flattenCoverageIds().length,
  elements: lesson6SourceCoverage,
}

if (process.argv.includes('--write-coverage')) {
  writeFileSync(coveragePath, `${JSON.stringify(expectedCoverage, null, 2)}\n`, 'utf8')
} else {
  const actualCoverage = JSON.parse(readFileSync(coveragePath, 'utf8'))
  assert.deepEqual(actualCoverage, expectedCoverage, 'coverage JSON must match the audited source blocks, branches, student locations, and teacher entries')
}

console.log(`PASS tenths-one: ${lesson6CoverageTotals.sourceBlocks} source blocks (${lesson6CoverageTotals.confirmed} confirmed, ${lesson6CoverageTotals.partial} partial, ${lesson6CoverageTotals.unresolved} unresolved), ${flattenCoverageIds().length} branch anchors, all teacher entries mapped, 20-question test keys validated.`)
