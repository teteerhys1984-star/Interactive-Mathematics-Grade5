import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import {
  flattenLesson8CoverageIds, lesson8BookTasks, lesson8SourceBranches, lesson8SourceElements,
  lesson8TeacherEntries, lesson8TextbookPageNumbers,
} from '../src/lessons/decimalPartsThreeData'
import definition from '../src/tests/definitions/lessons/decimal-parts-three.test'
import { unit2Lesson7AllEntries } from '../src/teacher/unit2Lesson7'

const lessonId = 'decimal-parts-three'
const fail = (message: string): never => { throw new Error(`Lesson 8 source check failed: ${message}`) }
const registry = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(registry, 'unit 2 is registered')
assert.equal(registry.status, 'complete', 'Unit 2 is complete after its tenth and final lesson shipped')
assert.equal(registry.lessons.length, 10, 'Unit 2 lists all ten textbook lessons after Lesson 10')
assert.equal(registry.lessons[5]?.id, 'tenths-one', 'Lesson 6 remains in place')
assert.equal(registry.lessons[6]?.id, 'decimal-parts-two', 'Lesson 7 remains in place')
assert.equal(registry.lessons[7]?.id, lessonId, 'Lesson 8 is appended after Lesson 7')
assert.equal(registry.lessons[7]?.title, 'الأجزاء العشرية (3)')
assert.equal(registry.lessons[7]?.availability, 'available')
const routeMap = readFileSync('src/content/lessonComponents.tsx', 'utf8')
assert.ok(routeMap.includes("'decimal-parts-three': DecimalPartsThreeLesson"), 'lesson is wired into the shared route map')

assert.deepEqual(lesson8TextbookPageNumbers, [72, 73, 74, 75, 76])
assert.equal(new Set(flattenLesson8CoverageIds()).size, flattenLesson8CoverageIds().length, 'all source ids are unique')
const pagesSeen = new Set(lesson8SourceElements.map((element) => element.page))
assert.deepEqual([...pagesSeen].sort((a, b) => a - b), [72, 73, 74, 75, 76], 'all five supplied pages have source elements')
for (const element of lesson8SourceElements) {
  assert.ok(element.prompt.trim(), `${element.id} has its printed prompt or learning content`)
  assert.ok(element.answer.trim(), `${element.id} has a solution record`)
  if (element.branches?.length) {
    for (const branch of element.branches) {
      assert.ok(branch.prompt.trim() && branch.answer.trim(), `${branch.id} prompt and final answer are transcribed`)
      assert.ok(branch.reasoning.length >= 2, `${branch.id} has stepwise reasoning`)
      assert.ok(lesson8TeacherEntries.some((entry) => entry.id === `t-${branch.id}`), `${branch.id} has a teacher solution`)
    }
  } else assert.ok(lesson8TeacherEntries.some((entry) => entry.id === `t-${element.id}`), `${element.id} has a teacher solution`)
}
assert.equal(lesson8BookTasks.length, 14, 'all fourteen textbook exercise blocks on pp. 72–76 are inventoried')
assert.ok(lesson8SourceBranches.length >= 35, 'all printed exercise parts are represented as branch-level anchors')
assert.equal(new Set(lesson8TeacherEntries.map((entry) => entry.id)).size, lesson8TeacherEntries.length, 'teacher solution ids are unique')
for (const entry of lesson8TeacherEntries) {
  assert.equal(entry.source.type, 'textbook', `${entry.id} is distinguished as a book solution`)
  if (entry.source.type === 'textbook') assert.ok(lesson8TextbookPageNumbers.includes(entry.source.page as (typeof lesson8TextbookPageNumbers)[number]), `${entry.id} has a valid textbook page`)
  assert.ok(entry.prompt && entry.answer && entry.reasoning.length >= 7, `${entry.id} has a full worked solution`)
  for (const section of ['المعطيات:', 'المطلوب:', 'القاعدة المستعملة:', 'لماذا تنطبق هنا:', 'الخطوة 1:', 'الإجابة النهائية:', 'التحقّق:']) {
    assert.ok(entry.reasoning.some((step) => step.startsWith(section)), `${entry.id} has ${section}`)
  }
  assert.ok(entry.note?.includes('المصدر: الكتاب') && entry.note.includes('إضافات تعليمية'), `${entry.id} separates source content from explanatory solution`)
}
for (const entry of unit2Lesson7AllEntries) assert.ok(entry, 'existing Lesson 7 teacher records remain present')

assert.equal(definition.id, `lesson-${lessonId}-test`)
assert.equal(definition.questions.length, 20, 'the lesson quiz contains 20 questions')
const difficulties = definition.questions.reduce<Record<string, number>>((counts, question) => {
  counts[question.difficulty] = (counts[question.difficulty] ?? 0) + 1
  return counts
}, {})
assert.deepEqual(difficulties, { basic: 6, medium: 7, advanced: 4, thinking: 3 }, 'quiz difficulty distribution is 6/7/4/3')
assert.equal(new Set(definition.questions.map((question) => question.id)).size, 20, 'quiz question IDs are unique')
assert.ok(definition.questions.every((question) => question.originalityNote.length >= 35 && question.solution.steps.length >= 2), 'all independent test questions have full locked solutions and originality notes')
const usedSources = [...new Set(definition.questions.flatMap((question) => question.sourceConcepts))].sort()
const declaredSources = definition.blueprint.sourceConceptInventory.map((source) => source.id).sort()
assert.deepEqual(usedSources, declaredSources, 'test source-concept inventory exactly matches referenced concepts')
for (const source of definition.blueprint.sourceConceptInventory) for (const ref of source.references) if (ref.kind === 'textbook-page') assert.ok(ref.page >= 72 && ref.page <= 76, `${source.id} cites supplied pages`)

const auditPath = 'docs/unit2-lesson8-source-audit.md'
const coveragePath = 'docs/unit2-lesson8-coverage.json'
const coverage = {
  lessonId,
  title: 'الأجزاء العشرية (3)',
  sourcePages: [...lesson8TextbookPageNumbers],
  totals: { elements: lesson8SourceElements.length, branches: lesson8SourceBranches.length, anchors: flattenLesson8CoverageIds().length, confirmed: lesson8SourceElements.length, partial: 0, unresolved: 0 },
  elements: lesson8SourceElements.map((element) => ({
    id: element.id, page: element.page, sourceStatus: 'confirmed', section: element.section,
    teacherEntryIds: element.branches?.length ? [] : [`t-${element.id}`],
    branches: (element.branches ?? []).map((branch) => ({ id: branch.id, teacherEntryIds: [`t-${branch.id}`] })),
  })),
}
if (process.argv.includes('--write-coverage')) writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 2)}\n`)
const previousCoverage = JSON.parse(readFileSync(coveragePath, 'utf8'))
assert.deepEqual(previousCoverage, JSON.parse(JSON.stringify(coverage)), 'checked-in coverage ledger matches source inventory')
const audit = readFileSync(auditPath, 'utf8')
assert.ok(audit.includes('72–76') && audit.includes('مقروءة'), 'source report records verified readable source pages')
assert.ok(audit.includes(`${lesson8SourceElements.length} كتلة`) && audit.includes(`${lesson8SourceBranches.length} فرعاً`), 'source report records the inventory totals')

const studentSource = readFileSync('src/lessons/DecimalPartsThreeLesson.tsx', 'utf8')
assert.ok(studentSource.includes('data-source-id') && studentSource.includes('lesson8SourceElements'), 'student activity components expose ledger-linked source anchors')
assert.equal(flattenLesson8CoverageIds().length, 68, 'source inventory covers all 68 blocks and branch anchors')
assert.ok(!studentSource.includes('l8-self-check-answer'), 'book responses are not printed as an upfront answer key')
assert.ok(studentSource.includes('#tests/run/lesson-decimal-parts-three-test'), 'student can discover the independent lesson test')
assert.ok(!definition.id.includes('unit-2'), 'no unit-two test is created')

console.log(`PASS lesson 8 source check: ${lesson8SourceElements.length} source blocks, ${lesson8SourceBranches.length} exercise branches, ${lesson8TeacherEntries.length} fully keyed teacher entries, and 20 lesson-test questions; Unit 2 remains in progress.`)
