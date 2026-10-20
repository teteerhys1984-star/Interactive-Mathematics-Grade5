import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import {
  flattenRectangleCoverageIds, rectangleAllTeacherEntries, rectangleBookTasks, rectanglePlatformTeacherEntries, rectangleSourceBranches,
  rectangleSourceElements, rectangleTeacherEntries, rectangleTestTeacherEntries, rectangleTextbookPages, lessonTitle,
} from '../src/lessons/rectangleData'
import { lesson8SourceElements } from '../src/lessons/decimalPartsThreeData'
import definition from '../src/tests/definitions/lessons/rectangle.test'

/**
 * Unit 2 · Lesson 9 — المستطيل (pp. 77–80). Static source/coverage/teacher/test contract.
 * Run with `--write-coverage` to regenerate docs/unit2-lesson9-coverage.json from the ledger.
 */
const lessonId = 'rectangle'
const pages = [...rectangleTextbookPages]

/* ------------------------------------------------------------------ registration & wiring */
const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(unitTwo, 'unit 2 is registered')
assert.equal(unitTwo.status, 'complete', 'Unit 2 is complete after lesson ten shipped')
assert.equal(unitTwo.lessons.length, 10, 'Unit 2 now lists exactly ten lessons')
assert.equal(unitTwo.lessons[5]?.id, 'tenths-one', 'Lesson 6 remains in place')
assert.equal(unitTwo.lessons[6]?.id, 'decimal-parts-two', 'Lesson 7 remains in place')
assert.equal(unitTwo.lessons[7]?.id, 'decimal-parts-three', 'Lesson 8 remains in place')
assert.equal(unitTwo.lessons[8]?.id, lessonId, 'Lesson 9 is appended after Lesson 8')
assert.equal(unitTwo.lessons[8]?.title, 'المستطيل')
assert.equal(unitTwo.lessons[8]?.availability, 'available')
assert.equal(lessonTitle, unitTwo.lessons[8]?.title, 'lesson shell title matches the registry title (unit breadcrumb lookup)')
assert.ok(readFileSync('src/content/lessonComponents.tsx', 'utf8').includes('rectangle: RectangleLesson'), 'lesson is wired into the shared route map')
assert.ok(readFileSync('src/main.tsx', 'utf8').includes("import './lesson-rectangle.css'"), 'lesson stylesheet is loaded')
assert.ok(readFileSync('src/teacher/TeacherArea.tsx', 'utf8').includes("lessonId: 'rectangle'"), 'teacher area lists the lesson guide')
assert.ok(lesson8SourceElements.length > 0, 'Lesson 8 source ledger is still importable (no regression in the previous lesson data)')

/* ------------------------------------------------------------------ source ledger */
assert.deepEqual(pages, [77, 78, 79, 80])
const allIds = flattenRectangleCoverageIds()
assert.equal(new Set(allIds).size, allIds.length, 'all source ids are unique')
assert.ok(allIds.every((id) => id.startsWith('rect-p7') || id.startsWith('rect-p80')), 'ids carry their page prefix')
assert.deepEqual([...new Set(rectangleSourceElements.map((element) => element.page))].sort((a, b) => a - b), pages, 'all four supplied pages have source elements')
for (const element of rectangleSourceElements) {
  assert.match(element.id, new RegExp(`^rect-p${element.page}-`), `${element.id} id matches its page`)
  for (const field of ['prompt', 'given', 'required', 'rule', 'why', 'answer', 'check'] as const) assert.ok(element[field].trim(), `${element.id} has ${field}`)
  assert.ok(element.steps.length >= 1, `${element.id} has solution steps`)
  for (const branch of element.branches ?? []) {
    assert.ok(branch.id.startsWith(`${element.id}-`), `${branch.id} is nested under ${element.id}`)
    for (const field of ['prompt', 'given', 'required', 'rule', 'why', 'answer', 'check'] as const) assert.ok(branch[field].trim(), `${branch.id} has ${field}`)
    assert.ok(branch.steps.length >= 1, `${branch.id} has solution steps`)
  }
}
assert.equal(rectangleSourceElements.length, 17, 'all seventeen printed blocks on pp. 77–80 are inventoried')
assert.equal(rectangleBookTasks.length, 10, 'all ten printed exercise blocks (opening ×2, check ×2, oral, drawing check, تدرّب ①–④) are inventoried')
assert.equal(rectangleSourceBranches.length, 33, 'all printed exercise parts and construction steps are represented as branch anchors')
assert.equal(allIds.length, 50, 'source inventory covers all 50 block and branch anchors')
const branchCounts = Object.fromEntries(rectangleSourceElements.filter((element) => element.branches?.length).map((element) => [element.id, element.branches!.length]))
assert.deepEqual(branchCounts, {
  'rect-p77-opening-q1': 4, 'rect-p77-opening-q2': 2, 'rect-p78-check1': 2, 'rect-p78-check2': 3, 'rect-p79-construction': 5,
  'rect-p80-check-draw': 3, 'rect-p80-ex1': 5, 'rect-p80-ex2': 3, 'rect-p80-ex3': 3, 'rect-p80-ex4': 3,
}, 'branch counts match the printed sub-parts (أ–ج for تدرّب ①, أ–ت for ② و③, AC/EB/FE for ④, five construction steps)')
const flag = rectangleSourceElements.find((element) => element.id === 'rect-p77-flag')!
assert.ok(flag.prompt.includes('ثلاثة مستطيلات') && flag.prompt.includes('ثلثي طوله'), 'flag text is transcribed verbatim')
assert.ok(flag.note?.includes('صورة العلم') && flag.note.includes('كما طُبع'), 'the text/image colour discrepancy on p. 77 is documented, not silently resolved')
assert.equal(rectangleSourceElements.find((element) => element.id === 'rect-p80-ex4')!.branches!.map((branch) => branch.answer).join(' '), 'AC = 5cm. EB = 3cm. FE = 3cm.', 'composite lengths are solved correctly')

/* ------------------------------------------------------------------ teacher coverage */
assert.equal(new Set(rectangleAllTeacherEntries.map((entry) => entry.id)).size, rectangleAllTeacherEntries.length, 'teacher ids are unique across book, platform and test entries')
for (const id of allIds) assert.ok(rectangleTeacherEntries.some((entry) => entry.id === `t-${id}`), `${id} has a teacher solution`)
assert.equal(rectangleTeacherEntries.length, allIds.length, 'exactly one textbook teacher entry per block/branch anchor')
for (const entry of rectangleTeacherEntries) {
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
assert.ok(rectanglePlatformTeacherEntries.length >= 5, 'platform activities are documented for the teacher')
for (const entry of rectanglePlatformTeacherEntries) assert.equal(entry.source.type, 'platform', `${entry.id} is labelled as a platform activity`)
assert.equal(rectangleTestTeacherEntries.length, 20, 'every lesson-test question has a teacher solution')
for (const [index, entry] of rectangleTestTeacherEntries.entries()) {
  assert.equal(entry.source.type, 'platform', `${entry.id} is labelled as platform-authored`)
  assert.equal(entry.id, `t-${definition.questions[index].id}`, `${entry.id} is derived from the test definition`)
  assert.ok(entry.reasoning.some((step) => step.startsWith('الخطوة 1:')) && entry.reasoning.some((step) => step.startsWith('الإجابة النهائية:')), `${entry.id} carries worked steps and a final answer`)
  assert.ok(entry.note?.includes('اختبار الدرس'), `${entry.id} is identified as a test solution`)
}

/* ------------------------------------------------------------------ independent lesson test */
assert.equal(definition.id, `lesson-${lessonId}-test`)
assert.equal(definition.lessonId, lessonId)
assert.equal(definition.questions.length, 20, 'the lesson quiz contains 20 questions')
const difficulties = definition.questions.reduce<Record<string, number>>((counts, question) => ({ ...counts, [question.difficulty]: (counts[question.difficulty] ?? 0) + 1 }), {})
assert.deepEqual(difficulties, { basic: 6, medium: 7, advanced: 4, thinking: 3 }, 'quiz difficulty distribution is 6/7/4/3')
assert.equal(new Set(definition.questions.map((question) => question.id)).size, 20, 'quiz question IDs are unique')
assert.ok(new Set(definition.questions.map((question) => question.type)).size >= 7, 'quiz uses at least seven question types')
assert.ok(definition.questions.every((question) => question.originalityNote.length >= 35 && question.solution.steps.length >= 2), 'all test questions have full locked solutions and originality notes')
const usedSources = [...new Set(definition.questions.flatMap((question) => question.sourceConcepts))].sort()
const declaredSources = definition.blueprint.sourceConceptInventory.map((source) => source.id).sort()
assert.deepEqual(usedSources, declaredSources, 'test source-concept inventory exactly matches referenced concepts')
for (const source of definition.blueprint.sourceConceptInventory) for (const ref of source.references) if (ref.kind === 'textbook-page') assert.ok(ref.page >= 77 && ref.page <= 80, `${source.id} cites supplied pages`)
const normalize = (text: string) => text.replace(/[\s،,.؟?:()«»]/gu, '').replace(/\d+/gu, '#')
const bookPrompts = new Set([...rectangleSourceElements.map((element) => normalize(element.prompt)), ...rectangleSourceBranches.map((branch) => normalize(branch.prompt))])
for (const question of definition.questions) {
  const prompt = normalize(question.prompt.map((run) => run.text).join(''))
  assert.ok(!bookPrompts.has(prompt), `${question.id} does not reproduce a printed textbook prompt`)
}
assert.ok(!definition.id.includes('unit-2'), 'no unit-two test is created')

/* ------------------------------------------------------------------ student component & stylesheet */
const studentSource = readFileSync('src/lessons/RectangleLesson.tsx', 'utf8')
assert.ok(studentSource.includes('data-source-id') && studentSource.includes('findRectangleElement'), 'student components expose ledger-linked source anchors')
for (const id of ['rect-p77-goals', 'rect-p77-flag', 'rect-p77-definition', 'rect-p78-example', 'rect-p80-check-draw-lengths', 'rect-p80-ex1-j', 'rect-p80-ex3-a', 'rect-p80-ex3-b', 'rect-p80-ex3-t']) assert.ok(studentSource.includes(id), `${id} is referenced by the student lesson (the jsdom interaction check verifies every mounted anchor)`)
assert.ok(studentSource.includes('#tests/run/lesson-rectangle-test'), 'student can discover the independent lesson test')
assert.ok(studentSource.includes('شرح إضافي من المنصة') && studentSource.includes('نشاط من إعداد المنصة'), 'platform additions are labelled in the student view')
assert.ok(studentSource.includes('theme="lesson-rectangle"'), 'lesson uses its own shell theme')
assert.ok(!/className="[^"]*\bl[0-9]+-/u.test(studentSource), 'lesson does not reuse other lessons’ class prefixes')
assert.ok(studentSource.includes('rectangleStepCount = 13'), 'lesson declares its thirteen short steps')
const css = readFileSync('src/lesson-rectangle.css', 'utf8')
const unscoped = css.split('\n').filter((line) => /^[.#a-z]/iu.test(line) && !line.startsWith('.lesson-shell.lesson-rectangle') && !line.startsWith('.lesson-rectangle'))
assert.deepEqual(unscoped, [], 'every stylesheet rule is scoped under .lesson-rectangle')
for (const match of css.matchAll(/font-size:\s*([\d.]+)(rem|px)/gu)) {
  const px = match[2] === 'rem' ? Number(match[1]) * 16 : Number(match[1])
  assert.ok(px >= 13, `lesson text size ${match[0]} is below the 13px floor`)
}
assert.ok(css.includes(':focus-visible') && css.includes('prefers-reduced-motion') && css.includes('min-height: 44px'), 'stylesheet keeps keyboard focus, reduced motion and 44px targets')
assert.ok(!css.includes('.l8-') && !css.includes('.lesson-decimal-three'), 'stylesheet does not restyle Lesson 8')

/* ------------------------------------------------------------------ coverage ledger & audit report */
const auditPath = 'docs/unit2-lesson9-source-audit.md'
const coveragePath = 'docs/unit2-lesson9-coverage.json'
const coverage = {
  lessonId,
  title: lessonTitle,
  sourcePages: pages,
  totals: { elements: rectangleSourceElements.length, branches: rectangleSourceBranches.length, anchors: allIds.length, bookTasks: rectangleBookTasks.length, teacherTextbookEntries: rectangleTeacherEntries.length, teacherPlatformEntries: rectanglePlatformTeacherEntries.length, teacherTestEntries: rectangleTestTeacherEntries.length, testQuestions: definition.questions.length, confirmed: rectangleSourceElements.length, partial: 0, unresolved: 0 },
  elements: rectangleSourceElements.map((element) => ({
    id: element.id, page: element.page, kind: element.kind, sourceStatus: 'confirmed', section: element.section,
    note: element.note ?? null,
    teacherEntryIds: [`t-${element.id}`],
    branches: (element.branches ?? []).map((branch) => ({ id: branch.id, label: branch.label, teacherEntryIds: [`t-${branch.id}`] })),
  })),
}
if (process.argv.includes('--write-coverage')) writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 2)}\n`)
assert.deepEqual(JSON.parse(readFileSync(coveragePath, 'utf8')), JSON.parse(JSON.stringify(coverage)), 'checked-in coverage ledger matches source inventory')
const audit = readFileSync(auditPath, 'utf8')
assert.ok(audit.includes('77–80') && audit.includes('مقروءة'), 'source report records verified readable source pages')
assert.ok(audit.includes(`${rectangleSourceElements.length} كتلة`) && audit.includes(`${rectangleSourceBranches.length} فرعاً`), 'source report records the inventory totals')
assert.ok(audit.includes('صورة العلم'), 'source report documents the p. 77 flag discrepancy')

console.log(`PASS lesson 9 (المستطيل) source check: ${rectangleSourceElements.length} source blocks, ${rectangleSourceBranches.length} branches (${allIds.length} anchors), ${rectangleBookTasks.length} printed exercise blocks, ${rectangleTeacherEntries.length} textbook + ${rectanglePlatformTeacherEntries.length} platform + ${rectangleTestTeacherEntries.length} test teacher solutions, 20 lesson-test questions; Unit 2 remains in progress with no unit test.`)
