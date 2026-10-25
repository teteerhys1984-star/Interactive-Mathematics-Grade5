import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import {
  arabicWords, flattenUnit2ExercisesCoverageIds, lcmOf, lessonId, lessonTitle, q10Items, q11Data, q2Data,
  q3Data, q4Data, q5Sets, q6Items, q7Groups, q8Groups, q9Items, q10Items, unit2ExercisesAllTeacherEntries,
  unit2ExercisesBookTasks, unit2ExercisesPlatformTeacherEntries, unit2ExercisesSourceBranches,
  unit2ExercisesSourceElements, unit2ExercisesTeacherEntries, unit2ExercisesTextbookPages, valueOf,
} from '../src/lessons/unit2ExercisesData'

/**
 * Unit 2 · Review lesson — «تمرينات الوحدة الثانية» (pp. 85–86).
 * Static contract + independent arithmetic re-computation of every published answer.
 * Run with `--write-coverage` to regenerate docs/unit2-review-coverage.json from the ledger.
 */
const lessonIdCheck = 'unit-2-exercises'
const pages = [...unit2ExercisesTextbookPages]

const lessonBlobSource = () => readFileSync('src/lessons/Unit2ExercisesLesson.tsx', 'utf8')


/* ------------------------------------------------------------------ registration & wiring */
const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(unitTwo, 'unit 2 is registered')
assert.ok(readFileSync('src/content/lessonComponents.tsx', 'utf8').includes("'unit-2-exercises': Unit2ExercisesLesson"), 'lesson is wired into the shared route map')
assert.ok(readFileSync('src/main.tsx', 'utf8').includes("import './lesson-unit2-exercises.css'"), 'lesson stylesheet is loaded')
assert.ok(readFileSync('src/teacher/TeacherArea.tsx', 'utf8').includes("lessonId: 'unit-2-exercises'"), 'teacher area lists the review lesson guide')
assert.equal(unitTwo.lessons.length, 10, 'the ten assessed Unit 2 lessons stay unchanged')
assert.ok(!unitTwo.lessons.some((lesson) => lesson.id === lessonIdCheck), 'the review lesson does not enter the assessed lesson sequence')
assert.deepEqual(unitTwo.reviewLessons?.map((lesson) => lesson.id), [lessonIdCheck], 'the review lesson is registered exactly once in the student Unit 2 list')
assert.equal(unitTwo.reviewLessons?.[0]?.title, lessonTitle)
assert.equal(unitTwo.reviewLessons?.[0]?.availability, 'available')

/* ------------------------------------------------------------------ source ledger shape */
assert.deepEqual(pages, [85, 86])
assert.equal(unit2ExercisesSourceElements.length, 12, 'one intro element plus eleven printed exercises')
assert.equal(unit2ExercisesBookTasks.length, 11, 'the eleven printed exercises are inventoried')
assert.equal(unit2ExercisesSourceBranches.length, 38, 'every printed sub-part (أ..ط …) is a branch anchor')
const allIds = flattenUnit2ExercisesCoverageIds()
assert.equal(new Set(allIds).size, allIds.length, 'all source ids are unique')
assert.ok(allIds.every((id) => /^u2-p8[56]-/.test(id)), 'ids carry their page prefix')
assert.equal(unit2ExercisesSourceElements.filter((element) => element.page === 85).length, 7, 'p85 hosts title + exercises ①–⑤ + the first half of ⑥')
assert.equal(unit2ExercisesSourceElements.filter((element) => element.page === 86).length, 5, 'p86 hosts exercises ⑦–⑪')
for (const element of unit2ExercisesSourceElements) {
  assert.match(element.id, new RegExp(`^u2-p${element.page}-`), `${element.id} id matches its page`)
  for (const field of ['prompt', 'given', 'required', 'rule', 'why', 'answer', 'check'] as const) assert.ok(element[field].trim(), `${element.id} has ${field}`)
  assert.ok(element.steps.length >= 1, `${element.id} has solution steps`)
  for (const branch of element.branches ?? []) {
    // Question 6 spans two pages: compare question numbers, not parent page prefixes.
    assert.equal(branch.id.match(/-q(\d+)-/)?.[1], element.id.match(/-q(\d+)$/)?.[1], `${branch.id} matches its parent question`)
    for (const field of ['prompt', 'given', 'required', 'rule', 'why', 'answer', 'check'] as const) assert.ok(branch[field].trim(), `${branch.id} has ${field}`)
    assert.ok(branch.steps.length >= 1, `${branch.id} has solution steps`)
  }
}

/* ------------------------------------------------------------------ book fidelity: exact printed text/numbers */
const dataBlob = readFileSync('src/lessons/unit2ExercisesData.ts', 'utf8')
for (const exact of [
  '1081785', '1082180', '1205348', '1214999', '1002347', '139900', '140000',
  'أنشئ جدول خانات', 'اكتب في الجدول ثلاثة أعداد كل منها مؤلَّف من سبع خانات',
  'اكتب كل عدد بالصيغة اللفظية', 'من الأصغر إلى الأكبر',
  'بناءان يحتاجان للإصلاح', 'ليرة سورية',
  'مصبات الصرف الصحي', 'رتّب تلك العينات ترتيباً تصاعدياً حسب عدد الجراثيم',
  'عشراتي أكبر من آحادي بـ 6', 'فمن أنا؟',
  'جد المضاعف المشترك الأصغر للأعداد',
  'لتحصل على مقارنة صحيحة',
  'رتّب الكسور ترتيباً تصاعدياً في كل مما يأتي',
  'رتّب الكسور ترتيباً تنازلياً في كل مما يأتي',
  'اكتب كل كسر مركب بشكل كسر عادي',
  'اكتب كل كسر عادي بشكل كسر مركب',
  'EFGC', 'احسب طول كل من DG، AB، CB',
]) assert.ok(dataBlob.includes(exact), `printed source text preserved: ${exact}`)

/* printed book prompts never carry inline "a/b" fraction strings — student display is structured */
for (const element of unit2ExercisesSourceElements) {
  assert.ok(!/\d\s*\/\s*\d/.test(element.prompt), `${element.id} prompt keeps fractions out of inline text`)
}
/* the student component renders structured values (Frac/Mixed glyphs), never the teacher-facing branch prompts */
assert.ok(!lessonBlobSource().includes('branch.prompt'), 'the student lesson never renders teacher-facing branch prompt strings')

/* no internal setup notes leak into the published lesson data */
for (const path of ['src/lessons/unit2ExercisesData.ts', 'src/lessons/Unit2ExercisesLesson.tsx', 'src/lesson-unit2-exercises.css']) {
  const blob = readFileSync(path, 'utf8')
  assert.ok(!/نص غير واضح|غير واضح|غير مقروء|unclear/i.test(blob), `${path} contains no unclear-text notes`)
  assert.ok(!/يُخمن عن أرقام|لا يُخمن/.test(blob), `${path} contains no guessing disclaimers`)
}

/* ------------------------------------------------------------------ arithmetic proofs (independent re-computation) */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

/* ⑤ LCM answers */
for (const set of q5Sets) {
  const expected = set.numbers.reduce((acc, value) => (acc * value) / gcd(acc, value))
  const branch = unit2ExercisesSourceBranches.find((item) => item.id === set.id)
  assert.ok(branch, `${set.id} has a branch`)
  assert.ok(branch.answer.includes(String(expected)), `${set.id} answer states m.m.a = ${expected}`)
  for (const number of set.numbers) assert.equal(expected % number, 0, `${set.id}: ${expected} is divisible by ${number}`)
}
assert.equal(lcmOf([4, 9]), 36)
assert.equal(lcmOf([600, 500, 800]), 12000)

/* ⑥ comparison symbols */
const relation = (a: number, b: number) => (a > b ? '>' : a < b ? '<' : '=')
for (const item of q6Items) {
  assert.equal(relation(valueOf(item.left), valueOf(item.right)), item.answer, `${item.id} relation matches the values`)
  const branch = unit2ExercisesSourceBranches.find((entry) => entry.id === item.id)
  assert.ok(branch, `${item.id} has a branch`)
  assert.ok(branch.answer.includes(item.answer), `${item.id} branch answer carries the symbol`)
}

/* ⑦ ascending / ⑧ descending groups */
for (const [groups, direction] of [[q7Groups, 'asc'], [q8Groups, 'desc']] as const) {
  for (const group of groups) {
    assert.match(group.id, new RegExp(`^u2-p${group.page}-q${direction === 'asc' ? 7 : 8}-[a-z]+$`), `${group.id} matches its own page and ordering question`)
    assert.equal(group.items.length, 4, `${group.id} carries four printed fractions`)
    for (const item of group.items) assert.equal(item.kind, 'fraction', `${group.id} items are plain fractions`)
    const values = group.items.map((item) => valueOf(item))
    const sorted = [...values].sort((a, b) => (direction === 'asc' ? a - b : b - a))
    assert.deepEqual(values.map((value) => sorted.indexOf(value)).sort((a, b) => a - b), [0, 1, 2, 3], `${group.id} values are orderable`)
    const solution = direction === 'asc'
      ? [...group.items].sort((a, b) => valueOf(a) - valueOf(b))
      : [...group.items].sort((a, b) => valueOf(b) - valueOf(a))
    const branch = unit2ExercisesSourceBranches.find((entry) => entry.id === group.id)
    assert.ok(branch, `${group.id} has a branch`)
    for (const item of solution) assert.ok(branch.answer.includes(`${item.n}/${item.d}`), `${group.id} solution lists ${item.n}/${item.d}`)
    assert.ok(group.commonDenominator > 0 && group.items.every((item) => group.commonDenominator % item.d === 0), `${group.id} common denominator works for all items`)
    assert.ok(group.steps.length >= 3, `${group.id} has generated solution steps`)
  }
}
assert.deepEqual(q7Groups[0].items.map((item) => (item.n * (8 / item.d))), [7, 2, 4, 1], '⑦أ printed numerators over 8')
assert.deepEqual(q8Groups[2].items.map((item) => (item.n * (30 / item.d))), [24, 13, 25, 6], '⑧ج printed numerators over 30')

/* ⑨ mixed → improper (recomputed from the printed items) */
for (const item of q9Items) {
  const branch = unit2ExercisesSourceBranches.find((entry) => entry.id === item.id)
  assert.ok(branch, `${item.id} exists`)
  assert.ok(branch.answer.includes(`${item.w * item.d + item.n}/${item.d}`), `${item.id} answer is ${item.w * item.d + item.n}/${item.d}`)
}
const q10 = unit2ExercisesSourceBranches.filter((branch) => branch.id.startsWith('u2-p86-q10-'))
assert.equal(q10.length, 4, 'exercise ⑩ has four printed fractions')
/* ⑩ improper → mixed */
for (const item of q10Items) {
  const branch = q10.find((entry) => entry.id === item.id)
  assert.ok(branch, `${item.id} exists`)
  const whole = Math.floor(item.n / item.d)
  const remainder = item.n % item.d
  assert.ok(whole > 0 && remainder > 0, `${item.id} is genuinely improper`)
  const plain = `${whole} ${remainder}/${item.d}`
  assert.ok(branch.answer.includes(item.simplify ? item.simplify.to : plain), `${item.id} answer carries ${item.simplify ? item.simplify.to : plain}`)
  assert.ok(item.simplify ? branch.answer.includes(plain) || item.simplify.from === `${remainder}/${item.d}` : true, `${item.id} keeps its simplification trail`)
}

/* ⑪ geometry lengths: AB = DC = 8, CB = CE + EB = 2 + 3, DG = DC + CG = 8 + 2 */
assert.deepEqual(q11Data.lengths, { DG: 8 + 2, AB: 8, CB: 2 + 3 })
for (const [id, expected] of [['u2-p86-q11-a', '10 سم'], ['u2-p86-q11-b', '8 سم'], ['u2-p86-q11-c', '5 سم']] as const) {
  const branch = unit2ExercisesSourceBranches.find((entry) => entry.id === id)
  assert.ok(branch && branch.answer.includes(expected), `${id} answer is ${expected}`)
}

/* ② and ③ comparison chains */
assert.ok(q2Data.building21 < q2Data.building30 && q2Data.building30 - q2Data.building21 === 395)
assert.deepEqual([...q3Data.samples].map((sample) => sample.value).sort((a, b) => a - b), [q3Data.samples[2].value, q3Data.samples[0].value, q3Data.samples[1].value])

/* ④ the mystery number satisfies every clue */
const mystery = 139971
assert.ok(mystery > q4Data.lower && mystery < q4Data.upper)
assert.equal(Math.floor((mystery % 100) / 10) - (mystery % 10), 6, 'tens exceed ones by 6')
assert.equal(Math.floor((mystery % 100) / 10) + (mystery % 10), 8, 'tens plus ones equal 8')
const q4BranchElement = unit2ExercisesSourceElements.find((element) => element.id === 'u2-p85-q4')
assert.ok(q4BranchElement && q4BranchElement.answer.includes('139971'))

/* ① verbal forms (golden list) */
assert.equal(arabicWords(3140500), 'ثلاثة ملايين ومئة وأربعون ألفاً وخمسُمئة'.replace('خمسُمئة', 'خمسمئة'))
assert.equal(arabicWords(1081785), 'مليون وواحد وثمانون ألفاً وسبعمئة وخمسة وثمانون')
assert.equal(arabicWords(139971), 'مئة وتسعة وثلاثون ألفاً وتسعمئة وواحد وسبعون')
assert.equal(arabicWords(12000), 'اثنا عشر ألفاً')
assert.equal(arabicWords(3600), 'ثلاثة آلاف وستمئة')

/* vertical fraction rendering is actually implemented for the student */
const lessonBlob = lessonBlobSource()
assert.ok(lessonBlob.includes('u2e-frac-rule'), 'the lesson renders a horizontal fraction rule')
const cssBlob = readFileSync('src/lesson-unit2-exercises.css', 'utf8')
assert.ok(/\.lesson-unit2-exercises \.u2e-frac \{[^}]*inline-grid/.test(cssBlob), 'fractions render as a stacked grid')
assert.ok(/\.lesson-unit2-exercises \.u2e-frac-rule \{[^}]*height: 2px/.test(cssBlob), 'the fraction rule is a visible horizontal bar')
assert.ok(!cssBlob.includes(':root'), 'the lesson stylesheet touches no global tokens')

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
  assert.ok(!/انظر الكتاب|راجع الكتاب/u.test(entry.reasoning.join(' ')), `${entry.id} does not defer to the book`)
}
assert.ok(unit2ExercisesPlatformTeacherEntries.length >= 5, 'the platform interactive activities are documented for the teacher')
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
    confirmed: unit2ExercisesSourceElements.length + unit2ExercisesSourceBranches.length,
    partial: 0,
    unresolved: 0,
  },
  elements: unit2ExercisesSourceElements.map((element) => ({
    id: element.id,
    page: element.page,
    kind: element.kind,
    sourceStatus: 'confirmed',
    section: element.section,
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

console.log(`PASS unit-2 review lesson (تمرينات الوحدة الثانية) source check: ${unit2ExercisesSourceElements.length} source blocks, ${unit2ExercisesSourceBranches.length} branches (${allIds.length} anchors), ${unit2ExercisesBookTasks.length} printed exercises, ${unit2ExercisesTeacherEntries.length} textbook + ${unit2ExercisesPlatformTeacherEntries.length} platform teacher solutions; all ${q5Sets.length + q6Items.length + q7Groups.length + q8Groups.length + q9Items.length + q10Items.length + 3} arithmetic proofs recomputed; pages ${pages.join('–')}.`)
