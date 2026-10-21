import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import {
  flattenUnit2ExercisesCoverageIds,
  unit2ExercisesAllTeacherEntries,
  unit2ExercisesBookTasks,
  unit2ExercisesPlatformTeacherEntries,
  unit2ExercisesSourceBranches,
  unit2ExercisesSourceElements,
  unit2ExercisesTeacherEntries,
  unit2ExercisesTextbookPages,
  lessonTitle,
  lessonId,
} from '../src/lessons/unit2ExercisesData'

/**
 * Unit 2 · Review lesson — «تمرينات الوحدة» (pp. 85–86). Static source/coverage/teacher contract.
 * Run with `--write-coverage` to regenerate docs/unit2-review-coverage.json from the ledger.
 */
const lessonIdCheck = 'unit-2-exercises'
const pages = [...unit2ExercisesTextbookPages]

/* ------------------------------------------------------------------ registration & wiring */
const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(unitTwo, 'unit 2 is registered')
assert.ok(readFileSync('src/content/lessonComponents.tsx', 'utf8').includes("'unit-2-exercises': Unit2ExercisesLesson"), 'lesson is wired into the shared route map')
assert.ok(readFileSync('src/main.tsx', 'utf8').includes("import './lesson-unit2-exercises.css'"), 'lesson stylesheet is loaded')
assert.ok(readFileSync('src/teacher/TeacherArea.tsx', 'utf8').includes("lessonId: 'unit-2-exercises'"), 'teacher area lists the review lesson guide')

/* ------------------------------------------------------------------ source ledger */
assert.deepEqual(pages, [85, 86])
const allIds = flattenUnit2ExercisesCoverageIds()
assert.equal(new Set(allIds).size, allIds.length, 'all source ids are unique')
assert.ok(allIds.every((id) => id.startsWith('u2-p8')), 'ids carry their page prefix')
assert.deepEqual([...new Set(unit2ExercisesSourceElements.map((element) => element.page))].sort((a, b) => a - b), pages, 'both supplied pages have source elements')
for (const element of unit2ExercisesSourceElements) {
  assert.match(element.id, new RegExp(`^u2-p${element.page}-`), `${element.id} id matches its page`)
  for (const field of ['prompt', 'given', 'required', 'rule', 'why', 'answer', 'check'] as const) assert.ok(element[field].trim(), `${element.id} has ${field}`)
  assert.ok(element.steps.length >= 1, `${element.id} has solution steps`)
  for (const branch of element.branches ?? []) {
    assert.ok(branch.id.startsWith(`u2-p${element.page}-`), `${branch.id} carries its page prefix`)
    for (const field of ['prompt', 'given', 'required', 'rule', 'why', 'answer', 'check'] as const) assert.ok(branch[field].trim(), `${branch.id} has ${field}`)
    assert.ok(branch.steps.length >= 1, `${branch.id} has solution steps`)
  }
}
assert.ok(unit2ExercisesSourceElements.length >= 10, 'review lesson inventories the exercises on pp. 85–86')
assert.ok(unit2ExercisesBookTasks.length >= 7, 'book exercise blocks are inventoried')
assert.ok(unit2ExercisesSourceBranches.length >= 10, 'printed exercise parts are represented as branch anchors')
assert.ok(allIds.length >= 20, 'source inventory covers block and branch anchors')

/* ------------------------------------------------------------------ teacher coverage */
assert.equal(new Set(unit2ExercisesAllTeacherEntries.map((entry) => entry.id)).size, unit2ExercisesAllTeacherEntries.length, 'teacher ids are unique across book and platform entries')
for (const id of allIds) assert.ok(unit2ExercisesTeacherEntries.some((entry) => entry.id === `t-${id}`), `${id} has a teacher solution`)
assert.equal(unit2ExercisesTeacherEntries.length, allIds.length, 'exactly one textbook teacher entry per block/branch anchor')
for (const entry of unit2ExercisesTeacherEntries) {
  assert.equal(entry.source.type, 'textbook', `${entry.id} is distinguished as a book solution`)
  if (entry.source.type === 'textbook') assert.ok(pages.includes(entry.source.page), `${entry.id} has a valid textbook page`)
  assert.ok(entry.prompt && entry.answer && entry.reasoning.length >= 7, `${entry.id} has a full worked solution`)
  for (const section of ['المعطيات:', 'المطلوب:', 'القاعدة المستعملة:', 'لماذا تنطبق هنا:', 'الخطوة 1:', 'الإجابة النهائية:', 'التحقّق:']) {
    assert.ok(entry.reasoning.some((step) => step.startsWith(section)), `${entry.id} has ${section}`)
  }
  assert.ok(entry.note?.includes('المصدر: الكتاب') && entry.note.includes('إضافات تعليمية'), `${entry.id} separates source content from explanatory solution`)
  assert.ok(!/\u0302/u.test(entry.prompt + entry.answer) && !/\[[A-Z]{2}\]/u.test(entry.prompt + entry.answer), `${entry.id} prompt/answer avoid combining hats and brackets that BidiText would split`)
  assert.ok(!/انظر الكتاب|راجع الكتاب/u.test(entry.reasoning.join(' ')), `${entry.id} does not defer to the book`)
}
assert.ok(unit2ExercisesPlatformTeacherEntries.length >= 2, 'platform activities are documented for the teacher')
for (const entry of unit2ExercisesPlatformTeacherEntries) assert.equal(entry.source.type, 'platform', `${entry.id} is labelled as a platform activity`)
assert.equal(unit2ExercisesAllTeacherEntries.length, unit2ExercisesTeacherEntries.length + unit2ExercisesPlatformTeacherEntries.length, 'teacher total is textbook anchors + platform activities')

/* ------------------------------------------------------------------ coverage ledger & audit report */
const coverage = {
  lessonId: lessonIdCheck,
  title: lessonTitle,
  sourcePages: pages,
  totals: {
    elements: unit2ExercisesSourceElements.length,
    branches: unit2ExercisesSourceBranches.length,
    anchors: allIds.length,
    bookTasks: unit2ExercisesBookTasks.length,
    teacherTextbookEntries: unit2ExercisesTeacherEntries.length,
    teacherPlatformEntries: unit2ExercisesPlatformTeacherEntries.length,
    confirmed: unit2ExercisesSourceElements.length,
    partial: 0,
    unresolved: 0,
  },
  elements: unit2ExercisesSourceElements.map((element) => ({
    id: element.id,
    page: element.page,
    kind: element.kind,
    sourceStatus: 'confirmed',
    section: element.section,
    note: element.note ?? null,
    teacherEntryIds: [`t-${element.id}`],
    branches: (element.branches ?? []).map((branch) => ({
      id: branch.id,
      label: branch.label,
      teacherEntryIds: [`t-${branch.id}`],
    })),
  })),
}
const coveragePath = 'docs/unit2-review-coverage.json'
if (process.argv.includes('--write-coverage')) writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 2)}\n`)
if (existsSync(coveragePath)) {
  assert.deepEqual(JSON.parse(readFileSync(coveragePath, 'utf8')), JSON.parse(JSON.stringify(coverage)), 'checked-in coverage ledger matches source inventory')
}

console.log(`PASS unit-2 review lesson (تمرينات الوحدة الثانية) source check: ${unit2ExercisesSourceElements.length} source blocks, ${unit2ExercisesSourceBranches.length} branches (${allIds.length} anchors), ${unit2ExercisesBookTasks.length} printed exercise blocks, ${unit2ExercisesTeacherEntries.length} textbook + ${unit2ExercisesPlatformTeacherEntries.length} platform teacher solutions; pages ${pages.join('–')}.`)