import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import {
  flattenSquareCoverageIds, squareAllTeacherEntries, squareBookTasks, squarePlatformTeacherEntries, squareSourceBranches,
  squareSourceElements, squareTeacherEntries, squareTestTeacherEntries, squareTextbookPages, lessonTitle,
  p81Shapes, p82Check1Shapes, p82WhyNotShapes, p84Ex1Statements, p84Ex4Lengths,
} from '../src/lessons/squareData'
import { rectangleSourceElements } from '../src/lessons/rectangleData'
import definition from '../src/tests/definitions/lessons/square.test'
import unitTwoDefinition from '../src/tests/definitions/units/unit-2.test'

/**
 * Unit 2 · Lesson 10 — المربّع (pp. 81–84). Static source/coverage/teacher/test contract.
 * Run with `--write-coverage` to regenerate docs/unit2-lesson10-coverage.json from the ledger.
 */
const lessonId = 'square'
const pages = [...squareTextbookPages]

/* ------------------------------------------------------------------ registration & wiring */
const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(unitTwo, 'unit 2 is registered')
assert.equal(unitTwo.status, 'complete', 'Unit 2 is complete after lesson ten shipped')
assert.equal(unitTwo.lessons.length, 10, 'Unit 2 lists exactly ten lessons')
assert.equal(unitTwo.lessons[8]?.id, 'rectangle', 'Lesson 9 remains in place')
assert.equal(unitTwo.lessons[9]?.id, lessonId, 'Lesson 10 is appended after Lesson 9')
assert.equal(unitTwo.lessons[9]?.title, 'المربّع')
assert.equal(unitTwo.lessons[9]?.availability, 'available')
assert.equal(lessonTitle, unitTwo.lessons[9]?.title, 'lesson shell title matches the registry title (unit breadcrumb lookup)')
assert.ok(readFileSync('src/content/lessonComponents.tsx', 'utf8').includes('square: SquareLesson'), 'lesson is wired into the shared route map')
assert.ok(readFileSync('src/main.tsx', 'utf8').includes("import './lesson-square.css'"), 'lesson stylesheet is loaded')
assert.ok(readFileSync('src/teacher/TeacherArea.tsx', 'utf8').includes("lessonId: 'square'"), 'teacher area lists the lesson guide')
assert.ok(rectangleSourceElements.length > 0, 'Lesson 9 source ledger is still importable (no regression in the previous lesson data)')

/* ------------------------------------------------------------------ source ledger */
assert.deepEqual(pages, [81, 82, 83, 84])
const allIds = flattenSquareCoverageIds()
assert.equal(new Set(allIds).size, allIds.length, 'all source ids are unique')
assert.ok(allIds.every((id) => id.startsWith('sq-p8')), 'ids carry their page prefix')
assert.deepEqual([...new Set(squareSourceElements.map((element) => element.page))].sort((a, b) => a - b), pages, 'all four supplied pages have source elements')
for (const element of squareSourceElements) {
  assert.match(element.id, new RegExp(`^sq-p${element.page}-`), `${element.id} id matches its page`)
  for (const field of ['prompt', 'given', 'required', 'rule', 'why', 'answer', 'check'] as const) assert.ok(element[field].trim(), `${element.id} has ${field}`)
  assert.ok(element.steps.length >= 1, `${element.id} has solution steps`)
  for (const branch of element.branches ?? []) {
    assert.ok(branch.id.startsWith(`sq-p${element.page}-`), `${branch.id} carries its page prefix (opening-figure anchors are named after the figure, not only after the question)`)
    for (const field of ['prompt', 'given', 'required', 'rule', 'why', 'answer', 'check'] as const) assert.ok(branch[field].trim(), `${branch.id} has ${field}`)
    assert.ok(branch.steps.length >= 1, `${branch.id} has solution steps`)
  }
}
assert.equal(squareSourceElements.length, 18, 'all eighteen printed blocks on pp. 81–84 are inventoried')
assert.equal(squareBookTasks.length, 11, 'all eleven printed exercise blocks (opening ×3, check ×2, oral, drawing check, تدرّب ①–④) are inventoried')
assert.equal(squareSourceBranches.length, 41, 'all printed exercise parts and construction/answer steps are represented as branch anchors')
assert.equal(allIds.length, 59, 'source inventory covers all 59 block and branch anchors')
const branchCounts = Object.fromEntries(squareSourceElements.filter((element) => element.branches?.length).map((element) => [element.id, element.branches!.length]))
assert.deepEqual(branchCounts, {
  'sq-p81-opening-q1': 7, 'sq-p81-opening-q2': 7, 'sq-p82-check1': 2, 'sq-p82-check2': 3, 'sq-p82-oral': 2,
  'sq-p83-construction': 5, 'sq-p84-check-draw': 3, 'sq-p84-ex1': 4, 'sq-p84-ex2': 2, 'sq-p84-ex3': 3, 'sq-p84-ex4': 3,
}, 'branch counts match the printed sub-parts (seven opening figures ×2, two checks, three why-not shapes, two oral prompts, five construction steps, three drawing checks, four statements, two vertices, three descriptions, three lengths)')
assert.equal(p81Shapes.length, 7, 'the seven opening figures are transcribed')
assert.deepEqual(p81Shapes.filter((shape) => shape.kind === 'square').map((shape) => shape.number), [2, 5], 'figures ② and ⑤ are the squares on p. 81')
assert.equal(p82Check1Shapes.length, 2, 'both تحقّق ① figures are inventoried')
assert.equal(p82WhyNotShapes.length, 3, 'all three تحقّق ② why-not figures are inventoried')
assert.ok(squareSourceElements.find((element) => element.id === 'sq-p82-check2')!.prompt.includes('ليس مربّعاً'), 'the printed why-not table prompt is kept')
assert.equal(p84Ex1Statements.length, 4, 'all four true/false statements are transcribed')
assert.equal(p84Ex1Statements.filter((statement) => !statement.truth).length, 1, 'exactly one printed statement is false')
assert.equal(p84Ex4Lengths.map((item) => `${item.label}=${item.answer}`).join(' '), 'RS=2 TS=2 XS=7', 'composite lengths are solved correctly')
assert.ok(squareSourceElements.find((element) => element.id === 'sq-p84-ex2')!.note?.includes('الرسم المطبوع'), 'the p. 84 drawing note is recorded instead of being silently corrected')
const definitions = squareSourceElements.filter((element) => element.id === 'sq-p81-definition')
assert.equal(definitions.length, 1, 'the double definition is inventoried once')
assert.ok(definitions[0].answer.includes('مستطيل') && definitions[0].answer.includes('معيّن'), 'both equivalent definitions are recorded')

/* ------------------------------------------------------------------ teacher coverage */
assert.equal(new Set(squareAllTeacherEntries.map((entry) => entry.id)).size, squareAllTeacherEntries.length, 'teacher ids are unique across book, platform and test entries')
for (const id of allIds) assert.ok(squareTeacherEntries.some((entry) => entry.id === `t-${id}`), `${id} has a teacher solution`)
assert.equal(squareTeacherEntries.length, allIds.length, 'exactly one textbook teacher entry per block/branch anchor')
for (const entry of squareTeacherEntries) {
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
assert.ok(squarePlatformTeacherEntries.length >= 5, 'platform activities are documented for the teacher')
for (const entry of squarePlatformTeacherEntries) assert.equal(entry.source.type, 'platform', `${entry.id} is labelled as a platform activity`)
assert.equal(squareTestTeacherEntries.length, 20, 'every lesson-test question has a teacher solution')
for (const [index, entry] of squareTestTeacherEntries.entries()) {
  assert.equal(entry.source.type, 'platform', `${entry.id} is labelled as platform-authored`)
  assert.equal(entry.id, `t-${definition.questions[index].id}`, `${entry.id} is derived from the test definition`)
  assert.ok(entry.reasoning.some((step) => step.startsWith('الخطوة 1:')) && entry.reasoning.some((step) => step.startsWith('الإجابة النهائية:')), `${entry.id} carries worked steps and a final answer`)
  assert.ok(entry.note?.includes('اختبار الدرس'), `${entry.id} is identified as a test solution`)
}
assert.equal(squareAllTeacherEntries.length, allIds.length + squarePlatformTeacherEntries.length + 20, 'teacher total is textbook anchors + platform activities + lesson-test solutions')

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
for (const source of definition.blueprint.sourceConceptInventory) for (const ref of source.references) if (ref.kind === 'textbook-page') assert.ok(ref.page >= 81 && ref.page <= 84, `${source.id} cites supplied pages`)
const normalize = (text: string) => text.replace(/[\s،,.؟?:()«»]/gu, '').replace(/\d+/gu, '#')
const bookPrompts = new Set([...squareSourceElements.map((element) => normalize(element.prompt)), ...squareSourceBranches.map((branch) => normalize(branch.prompt))])
for (const question of definition.questions) {
  const prompt = normalize(question.prompt.map((run) => run.text).join(''))
  assert.ok(!bookPrompts.has(prompt), `${question.id} does not reproduce a printed textbook prompt`)
}
assert.ok(!definition.id.includes('unit-2'), 'the lesson test is not a unit test')
assert.equal(unitTwoDefinition.id, 'unit-unit-2-test', 'the Unit 2 test is a separate definition')
assert.equal(unitTwoDefinition.questions.length, 60, 'the Unit 2 test keeps its 60 questions')
assert.equal(unitTwoDefinition.blueprint.targetQuestionCount, 60, 'the Unit 2 blueprint still targets 60 questions')
assert.notEqual(definition.questions.length, unitTwoDefinition.questions.length, 'lesson and unit tests are kept apart')

/* ------------------------------------------------------------------ student component & stylesheet */
const studentSource = readFileSync('src/lessons/SquareLesson.tsx', 'utf8')
assert.ok(studentSource.includes('data-source-id') && studentSource.includes('findSquareElement'), 'student components expose ledger-linked source anchors')
for (const id of ['sq-p81-goals', 'sq-p81-tile-entry', 'sq-p81-opening-figures', 'sq-p81-definition', 'sq-p82-example', 'sq-p82-properties', 'sq-p84-check-draw', 'sq-p84-ex1', 'sq-p84-ex2', 'sq-p84-ex4']) assert.ok(studentSource.includes(`findSquareElement('${id}')`), `${id} is looked up by the student lesson`)
for (const id of ['sq-p82-oral', 'sq-p83-construction', 'sq-p84-ex4']) assert.ok(studentSource.includes(id), `${id} is referenced by the student lesson (the jsdom interaction check verifies every mounted anchor)`)
assert.ok(studentSource.includes('p84Ex1Statements.map') && studentSource.includes('p84Ex3Cases.map'), 'branch anchors that depend on printed data are generated from the ledger, not hard-coded')
assert.ok(studentSource.includes('#tests/run/lesson-square-test') && studentSource.includes('#tests/run/unit-unit-2-test'), 'student can discover both the lesson test and the Unit 2 test')
assert.ok(studentSource.includes('شرح إضافي من المنصة') && studentSource.includes('نشاط من إعداد المنصة'), 'platform additions are labelled in the student view')
assert.ok(studentSource.includes('theme="lesson-square"'), 'lesson uses its own shell theme')
assert.ok(!/className="[^"]*\bl[0-9]+-/u.test(studentSource), 'lesson does not reuse other lessons’ class prefixes')
assert.ok(studentSource.includes('squareStepCount = 14'), 'lesson declares its fourteen short steps')
assert.ok(!studentSource.includes('rect-') && !studentSource.includes('lesson-rectangle'), 'lesson does not reuse Lesson 9 identifiers')
const css = readFileSync('src/lesson-square.css', 'utf8')
const unscoped = css.split('\n').filter((line) => /^[.#a-z]/iu.test(line) && !line.startsWith('.lesson-shell.lesson-square') && !line.startsWith('.lesson-square'))
assert.deepEqual(unscoped, [], 'every stylesheet rule is scoped under .lesson-square')
for (const match of css.matchAll(/font-size:\s*([\d.]+)(rem|px)/gu)) {
  const px = match[2] === 'rem' ? Number(match[1]) * 16 : Number(match[1])
  assert.ok(px >= 13, `lesson text size ${match[0]} is below the 13px floor`)
}
assert.ok(css.includes(':focus-visible') && css.includes('prefers-reduced-motion') && css.includes('min-height: 44px'), 'stylesheet keeps keyboard focus, reduced motion and 44px targets')
assert.ok(!css.includes('.rect-') && !css.includes('.lesson-rectangle'), 'stylesheet does not restyle Lesson 9')

/* ------------------------------------------------------------------ coverage ledger & audit report */
const auditPath = 'docs/unit2-lesson10-source-audit.md'
const coveragePath = 'docs/unit2-lesson10-coverage.json'
const coverage = {
  lessonId,
  title: lessonTitle,
  sourcePages: pages,
  totals: { elements: squareSourceElements.length, branches: squareSourceBranches.length, anchors: allIds.length, bookTasks: squareBookTasks.length, teacherTextbookEntries: squareTeacherEntries.length, teacherPlatformEntries: squarePlatformTeacherEntries.length, teacherTestEntries: squareTestTeacherEntries.length, testQuestions: definition.questions.length, confirmed: squareSourceElements.length, partial: 0, unresolved: 0 },
  elements: squareSourceElements.map((element) => ({
    id: element.id, page: element.page, kind: element.kind, sourceStatus: 'confirmed', section: element.section,
    note: element.note ?? null,
    teacherEntryIds: [`t-${element.id}`],
    branches: (element.branches ?? []).map((branch) => ({ id: branch.id, label: branch.label, teacherEntryIds: [`t-${branch.id}`] })),
  })),
}
if (process.argv.includes('--write-coverage')) writeFileSync(coveragePath, `${JSON.stringify(coverage, null, 2)}\n`)
assert.deepEqual(JSON.parse(readFileSync(coveragePath, 'utf8')), JSON.parse(JSON.stringify(coverage)), 'checked-in coverage ledger matches source inventory')
const audit = readFileSync(auditPath, 'utf8')
assert.ok(audit.includes('81–84') && audit.includes('مقروءة'), 'source report records verified readable source pages')
assert.ok(audit.includes(`${squareSourceElements.length} كتلة`) && audit.includes(`${squareSourceBranches.length} فرعاً`), 'source report records the inventory totals')
assert.ok(audit.includes('الرسم المطبوع'), 'source report documents the p. 84 drawing note')

console.log(`PASS lesson 10 (المربّع) source check: ${squareSourceElements.length} source blocks, ${squareSourceBranches.length} branches (${allIds.length} anchors), ${squareBookTasks.length} printed exercise blocks, ${squareTeacherEntries.length} textbook + ${squarePlatformTeacherEntries.length} platform + ${squareTestTeacherEntries.length} test teacher solutions, 20 lesson-test questions; Unit 2 is complete with its separate 60-question test.`)
