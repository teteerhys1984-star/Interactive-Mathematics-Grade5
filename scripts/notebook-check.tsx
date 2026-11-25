/**
 * «دفتر الطالب» audit — every lesson and review lesson registered in the curriculum.
 *
 * The authored plan is reconciled by (unit id, lesson id) against the live curriculum registry, so
 * adding a unit, lesson, or review without a notebook plan entry fails before the lesson audit runs.
 * For each registered notebook this check
 *  • proves the doc agrees with `curriculumRegistry` (lesson id, title, unit, textbook pages, theme);
 *  • proves every section and block id is unique, stable and lesson-prefixed, and that the whole
 *    document actually reached the DOM (`data-notebook-block` per authored block);
 *  • proves the notebook stayed a static reference: no form control, no lesson widget, exactly one
 *    button (print), no `data-source-id` marker that could collide with a lesson coverage ledger;
 *  • proves every section declares a purpose, that the purpose badge reached the DOM, and that no
 *    definition/rule/procedure is buried in a «حلول وتدرّبات» section (item 4 of the review);
 *  • proves a value read off a drawing says it is approximate, and that no year range runs backwards;
 *  • audits `src/lesson-notebook.css` for the phone, desktop and print contexts, since this sandbox
 *    has no browser to measure a real viewport (every `nb-*` class the renderer emits must be styled,
 *    the mobile breakpoint must re-pad the sheet, and print must hide the button and never split a
 *    block across pages);
 *  • proves the mixed Arabic/Latin text is bidi-isolated: a leaf holding Latin letters or a geometric
 *    symbol must live inside `BidiText`/`MathExpression`/an LTR-isolated SVG, never in bare RTL prose;
 *  • renders the REAL lesson and walks its outline to the last step, proving the notebook is wired as
 *    the final step, that the step before it still renders the lesson's own recap or assessment, and
 *    that the progress bar reports the new step count. Registered test hand-offs are resolved by
 *    lesson/review role and unit id, not by fixed lesson ids; existing interactive assessments remain
 *    checked when no test hand-off is declared.
 *
 * Run independently with `npm run notebook-check`; it is part of `quality-check` and therefore `build`.
 */
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import type { UnitMeta } from '../src/types'
import type { NotebookBlock, NotebookDoc } from '../src/notebook/types'

const fail = (message: string): never => { throw new Error(`Notebook check failed: ${message}`) }

interface NotebookTarget { id: string; unitId: string }

function targetKey(target: NotebookTarget): string {
  return `${target.unitId}\u0000${target.id}`
}

function assertNotebookPlanCoversCurriculum(
  units: readonly UnitMeta[],
  entries: readonly NotebookTarget[],
): void {
  const registered: NotebookTarget[] = units.flatMap(unit => [
    ...unit.lessons.map(lesson => ({ id: lesson.id, unitId: unit.id })),
    ...(unit.reviewLessons ?? []).map(lesson => ({ id: lesson.id, unitId: unit.id })),
  ])
  const registeredKeys = new Set(registered.map(targetKey))
  const plannedKeys = new Set<string>()

  for (const target of registered) {
    if (!target.id.trim()) fail(`${target.unitId}: the curriculum contains a lesson with an empty id`)
  }
  for (const entry of entries) {
    const key = targetKey(entry)
    if (plannedKeys.has(key)) fail(`duplicate notebook plan entry for lesson "${entry.id}" in unit "${entry.unitId}"`)
    plannedKeys.add(key)
  }

  const missing = registered.filter(target => !plannedKeys.has(targetKey(target)))
  if (missing.length) {
    fail(`registered lesson(s) have no notebook plan entry: ${missing.map(target => `${target.id} (${target.unitId})`).join(', ')}`)
  }

  const orphaned = entries.filter(target => !registeredKeys.has(targetKey(target)))
  if (orphaned.length) {
    fail(`notebook plan entry/entries do not match a registered lesson or review: ${orphaned.map(target => `${target.id} (${target.unitId})`).join(', ')}`)
  }
}

function assertNotebookDocMatchesLesson(expectedId: string, doc: NotebookDoc): void {
  if (doc.lessonId !== expectedId) {
    fail(`notebook for lesson "${expectedId}" is bound to the wrong lesson id "${doc.lessonId}"`)
  }
}

function assertNotebookIsLastStep(lessonId: string, stepLabels: readonly string[]): void {
  if (!stepLabels.at(-1)?.includes('دفتر الطالب')) {
    fail(`${lessonId}: the last lesson step is not «دفتر الطالب»`)
  }
}

function assertRenderedNotebookMatchesLesson(root: ParentNode, expectedId: string): HTMLElement {
  const notebooks = root.querySelectorAll<HTMLElement>('.student-notebook')
  if (notebooks.length !== 1) fail(`${expectedId}: expected one rendered student notebook, found ${notebooks.length}`)
  const actualId = notebooks[0]!.getAttribute('data-notebook')
  if (actualId !== expectedId) {
    fail(`${expectedId}: the lesson renders a notebook bound to "${actualId ?? ''}" instead`)
  }
  return notebooks[0]!
}

function expectFailure(label: string, action: () => void, expectedMessage: string): void {
  try {
    action()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!message.includes(expectedMessage)) {
      fail(`${label}: expected error containing ${JSON.stringify(expectedMessage)}, received ${JSON.stringify(message)}`)
    }
    console.log(`Notebook negative-case verified: ${label}`)
    return
  }
  fail(`${label}: invalid fixture was incorrectly accepted`)
}

/* ------------------------------------------------------- 1. authored data */
const { curriculumRegistry } = await import('../src/content/registry')
const { lessonComponents } = await import('../src/content/lessonComponents')
const { coordinatesNotebook } = await import('../src/notebook/entries/coordinates')
const { lineGraphsNotebook } = await import('../src/notebook/entries/lineGraphs')
const { naturalNumbersNotebook } = await import('../src/notebook/entries/naturalNumbers')
const { roundingNotebook } = await import('../src/notebook/entries/rounding')
const { additionSubtractionNotebook } = await import('../src/notebook/entries/additionSubtraction')
const { anglesNotebook } = await import('../src/notebook/entries/angles')
const { parallelogramNotebook } = await import('../src/notebook/entries/parallelogram')
const { rhombusNotebook } = await import('../src/notebook/entries/rhombus')
const { compareNotebook } = await import('../src/notebook/entries/u2l1Compare')
const { multiplyNotebook } = await import('../src/notebook/entries/u2l2Multiply')
const { lcmNotebook } = await import('../src/notebook/entries/u2l3Lcm')
const { fractionsOneNotebook } = await import('../src/notebook/entries/u2l4FractionsOne')
const { fractionsTwoNotebook } = await import('../src/notebook/entries/u2l5FractionsTwo')
const { tenthsNotebook } = await import('../src/notebook/entries/u2l6Tenths')
const { hundredthsNotebook } = await import('../src/notebook/entries/u2l7Hundredths')
const { thousandthsNotebook } = await import('../src/notebook/entries/u2l8Thousandths')
const { rectangleNotebook } = await import('../src/notebook/entries/u2l9Rectangle')
const { squareNotebook } = await import('../src/notebook/entries/u2l10Square')
const { unit2ExercisesNotebook } = await import('../src/notebook/entries/u2revExercises')

/**
 * Optional test hand-off declared by the authored plan. Lesson tests and the unit test for a review
 * are resolved against the live `testRegistry`; a review without an explicit href uses the registered
 * unit-test route derived from its actual unit id.
 */
const plan: Array<{
  id: string
  /** Any curriculum unit id is supported; review lessons are resolved from the live registry. */
  unitId: string
  prefix: string
  file: string
  steps: number
  theme?: string
  /** The registered standalone test this lesson's recap must link to. */
  testHref?: string
  make: () => NotebookDoc
}> = [
  { id: 'coordinates', unitId: 'unit-1', prefix: 'l1', file: 'src/lessons/CoordinatesLesson.tsx', steps: 10, make: coordinatesNotebook },
  { id: 'line-graphs', unitId: 'unit-1', prefix: 'l2', file: 'src/lessons/LineGraphsLesson.tsx', steps: 11, make: lineGraphsNotebook },
  { id: 'natural-numbers', unitId: 'unit-1', prefix: 'l3', file: 'src/lessons/NaturalNumbersLesson.tsx', steps: 12, make: naturalNumbersNotebook },
  { id: 'rounding-natural-numbers', unitId: 'unit-1', prefix: 'l4', file: 'src/lessons/RoundingLesson.tsx', steps: 6, theme: 'lesson-four', make: roundingNotebook },
  { id: 'adding-subtracting-natural-numbers', unitId: 'unit-1', prefix: 'l5', file: 'src/lessons/AdditionSubtractionLesson.tsx', steps: 15, theme: 'lesson-five', make: additionSubtractionNotebook },
  { id: 'angle-measurement', unitId: 'unit-1', prefix: 'l6', file: 'src/lessons/AnglesLesson.tsx', steps: 14, theme: 'lesson-six', make: anglesNotebook },
  { id: 'parallelogram', unitId: 'unit-1', prefix: 'l7', file: 'src/lessons/ParallelogramLesson.tsx', steps: 16, theme: 'lesson-seven', make: parallelogramNotebook },
  { id: 'rhombus', unitId: 'unit-1', prefix: 'l8', file: 'src/lessons/RhombusLesson.tsx', steps: 15, theme: 'lesson-eight', make: rhombusNotebook },
  { id: 'compare-order-natural-numbers', unitId: 'unit-2', prefix: 'u2l1', file: 'src/lessons/ComparingNaturalNumbersLesson.tsx', steps: 12, theme: 'lesson-nine', testHref: '#tests/run/lesson-compare-order-natural-numbers-test', make: compareNotebook },
  { id: 'multiply-natural-numbers', unitId: 'unit-2', prefix: 'u2l2', file: 'src/lessons/MultiplyNaturalNumbersLesson.tsx', steps: 13, theme: 'lesson-ten', testHref: '#tests/run/lesson-multiply-natural-numbers-test', make: multiplyNotebook },
  { id: 'least-common-multiple', unitId: 'unit-2', prefix: 'u2l3', file: 'src/lessons/LeastCommonMultipleLesson.tsx', steps: 11, theme: 'lesson-eleven', testHref: '#tests/run/lesson-least-common-multiple-test', make: lcmNotebook },
  { id: 'fractions-one', unitId: 'unit-2', prefix: 'u2l4', file: 'src/lessons/FractionsOneLesson.tsx', steps: 11, theme: 'lesson-twelve', testHref: '#tests/run/lesson-fractions-one-test', make: fractionsOneNotebook },
  { id: 'fractions-two', unitId: 'unit-2', prefix: 'u2l5', file: 'src/lessons/FractionsTwoLesson.tsx', steps: 9, theme: 'l25-lesson', testHref: '#tests/run/lesson-fractions-two-test', make: fractionsTwoNotebook },
  { id: 'tenths-one', unitId: 'unit-2', prefix: 'u2l6', file: 'src/lessons/TenthsOneLesson.tsx', steps: 8, theme: 'l6-tenths-one', testHref: '#tests/run/lesson-tenths-one-test', make: tenthsNotebook },
  { id: 'decimal-parts-two', unitId: 'unit-2', prefix: 'u2l7', file: 'src/lessons/DecimalPartsTwoLesson.tsx', steps: 10, theme: 'l7-decimal-two', testHref: '#tests/run/lesson-decimal-parts-two-test', make: hundredthsNotebook },
  { id: 'decimal-parts-three', unitId: 'unit-2', prefix: 'u2l8', file: 'src/lessons/DecimalPartsThreeLesson.tsx', steps: 9, theme: 'lesson-decimal-three', testHref: '#tests/run/lesson-decimal-parts-three-test', make: thousandthsNotebook },
  { id: 'rectangle', unitId: 'unit-2', prefix: 'u2l9', file: 'src/lessons/RectangleLesson.tsx', steps: 14, theme: 'lesson-rectangle', testHref: '#tests/run/lesson-rectangle-test', make: rectangleNotebook },
  { id: 'square', unitId: 'unit-2', prefix: 'u2l10', file: 'src/lessons/SquareLesson.tsx', steps: 15, theme: 'lesson-square', testHref: '#tests/run/lesson-square-test', make: squareNotebook },
  { id: 'unit-2-exercises', unitId: 'unit-2', prefix: 'u2rev', file: 'src/lessons/Unit2ExercisesLesson.tsx', steps: 14, theme: 'lesson-unit2-exercises', testHref: '#tests/run/unit-unit-2-test', make: unit2ExercisesNotebook },
]

assertNotebookPlanCoversCurriculum(curriculumRegistry, plan)

// Keep regression fixtures for the inventory guard in this same checker: these use the production
// comparison function and prove that new lessons/reviews in any unit and orphan notebook entries fail.
const firstUnit = curriculumRegistry[0]!
const fixtureLesson = { id: 'notebook-fixture-new-lesson', title: 'درس اختبار تغطية الدفتر', availability: 'available' as const }
const curriculumWithNewLesson = curriculumRegistry.map(unit => unit.id === firstUnit.id
  ? { ...unit, lessons: [...unit.lessons, fixtureLesson] }
  : unit)
expectFailure(
  'registered lesson without a notebook',
  () => assertNotebookPlanCoversCurriculum(curriculumWithNewLesson, plan),
  'registered lesson(s) have no notebook plan entry',
)

const fixtureReviewUnit: UnitMeta = {
  id: 'notebook-fixture-new-unit',
  title: 'وحدة اختبار تغطية الدفتر',
  accent: 'blue',
  status: 'in-progress',
  lessons: [],
  reviewLessons: [{ id: 'notebook-fixture-new-review', title: 'مراجعة اختبار تغطية الدفتر', availability: 'available' }],
}
expectFailure(
  'review lesson in a new unit without a notebook',
  () => assertNotebookPlanCoversCurriculum([...curriculumRegistry, fixtureReviewUnit], plan),
  'registered lesson(s) have no notebook plan entry',
)
expectFailure(
  'notebook plan entry not tied to a registered lesson',
  () => assertNotebookPlanCoversCurriculum(curriculumRegistry, [...plan, { ...plan[0]!, id: 'notebook-fixture-orphan' }]),
  'do not match a registered lesson or review',
)

const unitById = new Map(curriculumRegistry.map(unit => [unit.id, unit]))
const unitOf = (entry: { unitId: string }) => {
  const unit = unitById.get(entry.unitId)
  if (!unit) fail(`${entry.unitId} is missing from the curriculum registry`)
  return unit
}
/** The lesson (taught or review) a notebook belongs to, inside its own unit. */
const lessonOf = (entry: { id: string; unitId: string }) => {
  const unit = unitOf(entry)
  return [...unit.lessons, ...(unit.reviewLessons ?? [])].find(candidate => candidate.id === entry.id)
}

const docs = plan.map(entry => ({ entry, doc: entry.make() }))

/* ------------------------------------------- 2. static shape of every doc */
let blockCount = 0
let sectionCount = 0
let recordSections = 0
let practiceSections = 0
const kindTotals = new Map<string, number>()

/** Block kinds that carry curriculum content the student must write down, never a solved exercise. */
const COPYABLE_KINDS = new Set(['definition', 'rule', 'steps'])

/**
 * Blocks whose numbers are *read off a drawing* instead of being printed in the book. Each one must
 * say so in the rendered page, so an approximate reading never looks like exact printed data.
 */
const APPROXIMATE_BLOCKS: Record<string, readonly string[]> = {
  coordinates: ['l1-table-gates'],
  'line-graphs': ['l2-table-height', 'l2-table-students', 'l2-ex-height-table', 'l2-note-approximate'],
  'angle-measurement': ['l6-table-colored', 'l6-table-triangle', 'l6-table-applications', 'l6-note-approximate'],
  parallelogram: ['l7-table-ex3', 'l7-ex-l7-p35-ex3-d'],
}
const APPROXIMATE_MARK = /تقريب|قراءة من الرسم/u

for (const { entry, doc } of docs) {
  const lesson = lessonOf(entry)
  const unit = unitOf(entry)
  if (!lesson) fail(`no registry lesson for notebook "${entry.id}"`)
  assertNotebookDocMatchesLesson(entry.id, doc)
  if (doc.lessonTitle !== lesson!.title) fail(`${entry.id}: doc.lessonTitle "${doc.lessonTitle}" ≠ registry title "${lesson!.title}"`)
  if (doc.unit !== unit.title) fail(`${entry.id}: doc.unit "${doc.unit}" ≠ registry unit "${unit.title}"`)
  if (!/^ص \d+–\d+$/u.test(doc.pages)) fail(`${entry.id}: doc.pages "${doc.pages}" is not a «ص N–M» textbook range`)
  if (doc.theme !== entry.theme) fail(`${entry.id}: doc.theme "${doc.theme ?? ''}" ≠ lesson shell theme "${entry.theme ?? ''}"`)
  if (doc.sections.length < 5) fail(`${entry.id}: a notebook needs at least 5 sections, found ${doc.sections.length}`)

  const ids = new Set<string>()
  const kinds = new Set<string>()
  for (const section of doc.sections) {
    if (ids.has(section.id)) fail(`${entry.id}: duplicate section id "${section.id}"`)
    if (!section.id.startsWith(`${entry.prefix}-`)) fail(`${entry.id}: section id "${section.id}" must start with "${entry.prefix}-"`)
    ids.add(section.id)
    if (section.blocks.length === 0) fail(`${entry.id}: section "${section.id}" has no blocks`)
    if (section.purpose !== 'record' && section.purpose !== 'practice') {
      fail(`${entry.id}: section "${section.id}" must declare purpose "record" or "practice" (found "${String(section.purpose)}")`)
    }
    if (section.purpose === 'record') recordSections += 1
    else practiceSections += 1
    // A curriculum definition, rule or procedure is what the student writes down; it may never be
    // filed under the solved-exercise badge, where a student would skip it.
    if (section.purpose === 'practice') {
      for (const block of section.blocks as NotebookBlock[]) {
        if (COPYABLE_KINDS.has(block.kind)) {
          fail(`${entry.id}: "${block.id}" is a ${block.kind} but sits in the practice section "${section.id}" — move it to a «يُدوَّن في الدفتر» section`)
        }
      }
    }
    for (const block of section.blocks as NotebookBlock[]) {
      if (ids.has(block.id)) fail(`${entry.id}: duplicate block id "${block.id}"`)
      if (!block.id.startsWith(`${entry.prefix}-`)) fail(`${entry.id}: block id "${block.id}" must start with "${entry.prefix}-"`)
      ids.add(block.id)
      kinds.add(block.kind)
      kindTotals.set(block.kind, (kindTotals.get(block.kind) ?? 0) + 1)
      blockCount += 1
    }
  }
  sectionCount += doc.sections.length

  // A notebook the student copies must carry definitions, rules, procedures, worked examples and cautions.
  for (const required of ['definition', 'rule', 'steps', 'example', 'note']) {
    if (!kinds.has(required)) fail(`${entry.id}: no "${required}" block — the notebook is missing a copyable ${required}`)
  }
  if (!kinds.has('table') && !kinds.has('figure')) fail(`${entry.id}: no table and no figure — nothing to copy as a drawing or a table`)

  // The lesson file must wire the notebook as its own final step, with the shared renderer.
  const source = readFileSync(entry.file, 'utf8')
  if (!source.includes(`{ id: 'notebook', title: 'دفتر الطالب', content: <StudentNotebook doc={`)) {
    fail(`${entry.file} does not wire the notebook step through <StudentNotebook doc={...} />`)
  }
  if (!source.includes(`from '../notebook/entries/`)) fail(`${entry.file} does not import its notebook document`)
}

/* ------------------------------------------------------- 3. jsdom harness */
const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', { url: 'http://localhost/#top', pretendToBeVisual: true })
const { window } = dom
Object.assign(globalThis, {
  window, document: window.document, sessionStorage: window.sessionStorage, localStorage: window.localStorage,
  HTMLElement: window.HTMLElement, SVGElement: window.SVGElement, Node: window.Node,
  getComputedStyle: window.getComputedStyle, requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0),
})
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const React = await import('react')
const { render, fireEvent, cleanup } = await import('@testing-library/react')
const { StudentNotebook } = await import('../src/notebook/StudentNotebook')

// Verify the same association and ordering guards used below against deliberately invalid fixtures.
const fixtureEntry = plan[0]!
const wrongDoc = { ...fixtureEntry.make(), lessonId: 'notebook-fixture-wrong-lesson' }
expectFailure(
  'notebook document bound to the wrong lesson',
  () => assertNotebookDocMatchesLesson(fixtureEntry.id, wrongDoc),
  'bound to the wrong lesson id',
)
const wrongNotebookRender = render(React.createElement(StudentNotebook, { doc: wrongDoc }))
expectFailure(
  'lesson renders a notebook belonging to another lesson',
  () => assertRenderedNotebookMatchesLesson(wrongNotebookRender.container, fixtureEntry.id),
  'renders a notebook bound to',
)
cleanup()
expectFailure(
  'notebook appears before the final lesson step',
  () => assertNotebookIsLastStep('notebook-fixture-order', ['دفتر الطالب', 'الاختبار الختامي']),
  'last lesson step is not «دفتر الطالب»',
)

/** Markup that would turn the static notebook back into an activity, or collide with a lesson ledger. */
const FORBIDDEN = ['.grid-hit', '.final-test', '.test-question', '.l8-blanks', '[data-source-id]', '.lesson-outline', '.l7-reveal', '.l7-task', 'form'] as const
/** A leaf holding Latin letters or a geometric symbol must sit in an isolated LTR context. */
const NEEDS_ISOLATION = /[A-Za-z∠]/u
const ISOLATED_CONTEXT = '.math-expression, [dir="ltr"], svg, bdi' as const

let printButtons = 0
let figures = 0
let tables = 0
const notebookClasses = new Set<string>()

for (const { entry, doc } of docs) {
  const { container } = render(React.createElement(StudentNotebook, { doc }))
  const root = container.querySelector<HTMLElement>('.student-notebook')
  if (!root) fail(`${entry.id}: <StudentNotebook> rendered no .student-notebook root`)
  if (root!.getAttribute('data-notebook') !== entry.id) fail(`${entry.id}: notebook root is not labelled with its lesson id`)
  if (root!.getAttribute('dir') !== 'rtl') fail(`${entry.id}: notebook root must be dir="rtl"`)
  if (entry.theme && !root!.classList.contains(entry.theme)) fail(`${entry.id}: notebook root must repeat the "${entry.theme}" theme class`)

  const rendered = root!.querySelectorAll('[data-notebook-block]')
  const authored = doc.sections.reduce((sum, section) => sum + section.blocks.length, 0)
  if (rendered.length !== authored) fail(`${entry.id}: rendered ${rendered.length} blocks but ${authored} were authored`)
  if (root!.querySelectorAll('[data-notebook-section]').length !== doc.sections.length) fail(`${entry.id}: a section did not reach the DOM`)

  const controls = root!.querySelectorAll('input, select, textarea, [contenteditable]')
  if (controls.length !== 0) fail(`${entry.id}: the notebook must stay a static reference, found ${controls.length} form control(s)`)
  const buttons = root!.querySelectorAll('button')
  if (buttons.length !== 1) fail(`${entry.id}: expected exactly one button (print), found ${buttons.length}`)
  if (!buttons[0]!.classList.contains('nb-print')) fail(`${entry.id}: the only notebook button must be the print control`)
  printButtons += 1

  for (const selector of FORBIDDEN) {
    const found = root!.querySelectorAll(selector)
    if (found.length !== 0) fail(`${entry.id}: forbidden lesson markup "${selector}" (${found.length}) inside the notebook`)
  }

  const empty = Array.from(rendered).filter(node => (node.textContent ?? '').trim().length === 0)
  if (empty.length) fail(`${entry.id}: ${empty.length} block(s) rendered empty: ${empty.map(node => node.getAttribute('data-notebook-block')).join(', ')}`)

  // Every figure must be described for assistive technology, and no drawing may be interactive.
  for (const svg of Array.from(root!.querySelectorAll('svg'))) {
    if (svg.getAttribute('aria-hidden') === 'true') continue // decorative icons (lucide) are hidden on purpose
    figures += 1
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      fail(`${entry.id}: a drawn figure has no accessible name (aria-label): ${svg.getAttribute('class') ?? svg.outerHTML.slice(0, 80)}`)
    }
    if (svg.closest('button, a, label')) fail(`${entry.id}: a figure is wrapped in an interactive element`)
  }
  const renderedTables = root!.querySelectorAll('table.nb-table')
  tables += renderedTables.length
  for (const table of Array.from(renderedTables)) {
    if (!table.parentElement?.classList.contains('nb-table-scroll')) {
      fail(`${entry.id}: a copyable table is not inside .nb-table-scroll, so it would overflow a phone`)
    }
    // A row label is written once in its own column. A cell that restates it and then adds to it
    // («الزاوية الحادة» → «الزاوية الحادة أصغر من 90°») reads as a copy error, so it is rejected.
    // A cell that merely EQUALS the label is left alone: rounding 232698 to the ones place really
    // does return 232698, and that row carries a caption saying so.
    for (const row of Array.from(table.querySelectorAll('tbody tr'))) {
      const cells = Array.from(row.querySelectorAll('th, td'))
        .map(cell => (cell.textContent ?? '').replace(/\s+/g, ' ').trim())
      const [label, ...rest] = cells
      for (const cell of rest) {
        if (label && cell.length > label.length && cell.startsWith(label)) {
          fail(`${entry.id}: table row «${label}» is restated by its own cell «${cell.slice(0, 50)}»`)
        }
      }
    }
  }
  for (const figure of Array.from(root!.querySelectorAll('figure.nb-figure'))) {
    if (!figure.querySelector(':scope > .nb-figure-body')) {
      fail(`${entry.id}: a figure block is not inside .nb-figure-body, so it cannot scroll on a phone`)
    }
  }

  // Bidi: every TEXT NODE carrying Latin letters or ∠ must be isolated, otherwise RTL prose reorders
  // it. Text nodes (not elements) are walked, so a <li> holding both prose and a <MathExpression> is
  // still audited for its bare prose part.
  const walker = window.document.createTreeWalker(root!, 4 /* NodeFilter.SHOW_TEXT */)
  const loose: string[] = []
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const value = node.textContent ?? ''
    if (!NEEDS_ISOLATION.test(value)) continue
    const parent = node.parentElement
    if (!parent || parent.closest(ISOLATED_CONTEXT)) continue
    const block = parent.closest('[data-notebook-block]')?.getAttribute('data-notebook-block')
      ?? parent.closest('[data-notebook-section]')?.getAttribute('data-notebook-section') ?? '?'
    loose.push(`    ${block} <${parent.tagName.toLowerCase()}${parent.className ? `.${parent.className}` : ''}> ${JSON.stringify(value.trim().slice(0, 90))}`)
  }
  if (loose.length) {
    fail(`${entry.id}: ${loose.length} text node(s) carry Latin or geometric characters outside an isolated LTR context — route them through BidiText/MathExpression (use mixed()):\n${loose.slice(0, 12).join('\n')}`)
  }

  // No placeholder or untranslated leftovers.
  const prose = (root!.textContent ?? '')
  for (const banned of ['TODO', 'FIXME', 'lorem', 'undefined', '[object Object]', 'NaN']) {
    if (prose.includes(banned)) fail(`${entry.id}: notebook prose contains "${banned}"`)
  }

  // The purpose badge must reach the DOM with the wording a student reads on the sheet.
  for (const section of doc.sections) {
    const node = root!.querySelector<HTMLElement>(`[data-notebook-section="${section.id}"]`)
    if (node?.getAttribute('data-notebook-purpose') !== section.purpose) {
      fail(`${entry.id}: section "${section.id}" did not render its purpose attribute`)
    }
    const badge = node?.querySelector('.nb-purpose')
    const expected = section.purpose === 'record' ? 'يُدوَّن في الدفتر' : 'حلول وتدرّبات'
    if (badge?.textContent?.trim() !== expected) {
      fail(`${entry.id}: section "${section.id}" badge reads "${badge?.textContent?.trim() ?? ''}", expected "${expected}"`)
    }
  }

  // A period written backwards («2015 – 2006») is a transcription error, not a convention.
  for (const [, from, to] of prose.matchAll(/(\d{4})\s*[–-]\s*(\d{4})/gu)) {
    if (Number(from) > Number(to)) fail(`${entry.id}: the year range ${from}–${to} runs backwards`)
  }

  // Approximate readings must be labelled as approximate where they are printed.
  for (const id of APPROXIMATE_BLOCKS[entry.id] ?? []) {
    const block = root!.querySelector<HTMLElement>(`[data-notebook-block="${id}"]`)
    if (!block) fail(`${entry.id}: expected approximate-reading block "${id}" is missing`)
    if (!APPROXIMATE_MARK.test(block!.textContent ?? '')) {
      fail(`${entry.id}: "${id}" carries values read off a drawing but never says they are approximate`)
    }
  }

  // Every class of the notebook's own vocabulary must be styled somewhere in lesson-notebook.css.
  for (const element of Array.from(root!.querySelectorAll<HTMLElement>('[class]'))) {
    // getAttribute, not .className: an SVG element's className is an SVGAnimatedString
    for (const token of (element.getAttribute('class') ?? '').split(/\s+/u)) {
      if (token.startsWith('nb-') || token === 'student-notebook') notebookClasses.add(token)
    }
  }

  cleanup()
}

/* --------------------------------- 4. the notebook is the lesson's last step */

/**
 * The lesson's own standalone test must be *registered*, not just named in an href. Vite resolves the
 * `import.meta.glob` in `src/tests/registry.ts`, so the ids are read from the real registry instead of
 * being trusted from the plan: a link to a test that does not exist (or a typo in an id) is caught here.
 */
const registeredTestIds = await (async () => {
  const server = await createServer({ configFile: 'vite.config.ts', appType: 'custom', server: { middlewareMode: true } })
  try {
    const module = await server.ssrLoadModule('/src/tests/registry.ts') as {
      testRegistry: { getTestById(id: string): { id: string; type: 'lesson' | 'unit' | 'comprehensive' } | undefined }
    }
    return (id: string) => module.testRegistry.getTestById(id)
  } finally {
    await server.close()
  }
})()

/** `#tests/run/<id>` → `<id>`, so a link is compared by its route, never by a loose substring. */
const TEST_RUN_ROUTE = /^#tests\/run\/([^/?#]+)$/u

const stepCounts: string[] = []
for (const { entry } of docs) {
  const Lesson = lessonComponents[entry.id]
  if (!Lesson) fail(`${entry.id}: no routed lesson component in lessonComponents`)
  const { container } = render(React.createElement(Lesson))
  // The desktop timeline holds exactly one button per step; the mobile trigger is not a step.
  const outline = Array.from(container.querySelectorAll<HTMLButtonElement>('.lesson-outline-list.is-desktop > li > button'))
  if (outline.length !== entry.steps) fail(`${entry.id}: expected ${entry.steps} lesson steps (including «دفتر الطالب»), found ${outline.length}`)
  const stepLabels = outline.map(button => button.textContent ?? '')
  assertNotebookIsLastStep(entry.id, stepLabels)
  if (!stepLabels.at(-1)?.includes(`الخطوة ${entry.steps}`)) fail(`${entry.id}: the notebook is not numbered as step ${entry.steps} in the outline`)

  const progress = container.querySelector('[role="progressbar"]')
  if (progress?.getAttribute('aria-valuemax') !== String(entry.steps)) fail(`${entry.id}: progress bar reports ${progress?.getAttribute('aria-valuemax')} steps, expected ${entry.steps}`)

  // Preserve the pre-notebook hand-off without hard-coding unit ids: lessons can declare their own
  // registered lesson test, while a review lesson defaults to its unit's registered unit test.
  const unit = unitOf(entry)
  const isReviewLesson = (unit.reviewLessons ?? []).some(lesson => lesson.id === entry.id)
  const expectedTestHref = entry.testHref ?? (isReviewLesson ? `#tests/run/unit-${unit.id}-test` : undefined)
  fireEvent.click(outline[outline.length - 2]!)
  const assessment = container.querySelector('.lesson-content')
  if (!assessment || (assessment.textContent ?? '').trim().length === 0) {
    fail(`${entry.id}: the step before the notebook renders no lesson content`)
  }

  if (expectedTestHref) {
    const expected = TEST_RUN_ROUTE.exec(expectedTestHref)
    if (!expected) fail(`${entry.id}: the planned test route "${expectedTestHref}" is not a «#tests/run/<id>» route`)
    const testId = decodeURIComponent(expected![1]!)
    const registered = registeredTestIds(testId)
    if (!registered) fail(`${entry.id}: the planned test "${testId}" is not registered in the test area`)
    const expectedType = isReviewLesson ? 'unit' : 'lesson'
    if (registered!.type !== expectedType) {
      fail(`${entry.id}: "${testId}" is registered as a ${registered!.type} test, expected a ${expectedType} test`)
    }

    // The hand-off must be a real, labelled anchor. Every test link shown in the recap is checked,
    // and exactly one must point at this lesson's test (or the unit test for a review lesson).
    const links = Array.from(assessment.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .map(link => ({ link, href: link.getAttribute('href') ?? '' }))
      .filter(candidate => TEST_RUN_ROUTE.test(candidate.href))
    if (links.length === 0) {
      fail(`${entry.id}: the step before the notebook has no real link to its registered test (expected <a href="${expectedTestHref}">)`)
    }
    for (const { link, href } of links) {
      const id = decodeURIComponent(TEST_RUN_ROUTE.exec(href)![1]!)
      if (!registeredTestIds(id)) fail(`${entry.id}: the recap step links to "${href}", which is not a registered test`)
      if ((link.textContent ?? '').trim().length === 0) fail(`${entry.id}: the test link "${href}" has no readable label`)
      if (link.closest('button, label')) fail(`${entry.id}: the test link "${href}" is nested inside another interactive element`)
    }
    const own = links.filter(candidate => candidate.href === expectedTestHref)
    if (own.length === 0) {
      fail(`${entry.id}: the recap step never links to its expected registered test "${expectedTestHref}" (found: ${links.map(candidate => candidate.href).join(', ')})`)
    }
    if (own.length > 1) fail(`${entry.id}: the recap step links to "${expectedTestHref}" ${own.length} times`)
  } else if (!isReviewLesson && assessment.querySelectorAll('input, button').length === 0) {
    // Keep the existing interactive-assessment contract for lessons whose plan has no test hand-off.
    fail(`${entry.id}: the step before the notebook no longer looks like an interactive assessment (no controls rendered)`)
  }

  fireEvent.click(outline[outline.length - 1]!)
  assertRenderedNotebookMatchesLesson(container, entry.id)
  const stepId = container.querySelector('[data-step-id]')?.getAttribute('data-step-id')
  if (stepId !== 'notebook') fail(`${entry.id}: the lesson shell is not on the "notebook" step (found "${stepId}")`)
  stepCounts.push(`${entry.prefix}=${outline.length}`)
  cleanup()
}

/* ------------------------- 5. phone, desktop and print CSS -------------------------
 * No browser exists in this sandbox (no Chromium/Firefox binary and the Playwright/Puppeteer
 * download hosts are unreachable), so the three viewing contexts are audited statically instead:
 * the stylesheet must style every class the renderer emits, re-pad the sheet on a phone, and
 * print the sheet alone without splitting a block across pages. This is a static audit, not a
 * measured layout pass — see the report that ships with this change.
 */
const css = readFileSync('src/lesson-notebook.css', 'utf8')

/** Splits the stylesheet into its base rules and the rules inside each @media block. */
function mediaBlocks(source: string): Array<{ query: string; body: string }> {
  const blocks: Array<{ query: string; body: string }> = []
  const pattern = /@media([^{]+)\{/gu
  for (const match of source.matchAll(pattern)) {
    let depth = 1
    let index = match.index! + match[0].length
    while (index < source.length && depth > 0) {
      if (source[index] === '{') depth += 1
      else if (source[index] === '}') depth -= 1
      index += 1
    }
    blocks.push({ query: match[1]!.trim(), body: source.slice(match.index! + match[0].length, index - 1) })
  }
  return blocks
}
const media = mediaBlocks(css)
const base = css.replace(/@media[^{]+\{/gu, '@media {').split('@media {')[0]!
const mobile = media.filter(block => /max-width:\s*760px/u.test(block.query)).map(block => block.body).join('\n')
const tablet = media.filter(block => /max-width:\s*900px/u.test(block.query)).map(block => block.body).join('\n')
const print = media.filter(block => /\bprint\b/u.test(block.query)).map(block => block.body).join('\n')
if (!mobile) fail('lesson-notebook.css has no @media (max-width: 760px) phone block for the notebook')
if (!tablet) fail('lesson-notebook.css has no @media (max-width: 900px) tablet block for the notebook')
if (!print) fail('lesson-notebook.css has no @media print block for the notebook')

const unstyled = [...notebookClasses].filter(name => !css.includes(`.${name}`))
if (unstyled.length) fail(`notebook classes are rendered but never styled: ${unstyled.join(', ')}`)

for (const [context, body] of [['phone', mobile], ['tablet', tablet], ['print', print]] as const) {
  if (!body.includes('.student-notebook')) fail(`the ${context} context does not restyle the notebook sheet itself`)
}
for (const selector of ['.nb-print', '.nb-section-title', '.nb-purpose', '.nb-table th, .nb-table td']) {
  if (!mobile.includes(selector)) fail(`the phone block does not adapt ${selector}`)
}
if (!/\.nb-print\s*\{[^}]*width:\s*100%/u.test(mobile)) fail('the print control must span the phone width (a 44px-high full-width target)')
if (!/\.nb-print\s*\{[^}]*min-height:\s*44px/u.test(base)) fail('the print control must keep a 44px touch target')
// A reused lesson figure keeps its lesson min-width unless the notebook cancels it explicitly.
if (!/min-width:\s*0/u.test(css)) fail('reused lesson figures need a min-width: 0 override inside the notebook sheet')
for (const container of ['.nb-figure-body', '.nb-table-scroll', '.nb-example-figure']) {
  if (!new RegExp(`${container.replace('.', '\\.')}\\s*\\{[^}]*overflow-x:\\s*auto`, 'u').test(css)) {
    fail(`${container} must scroll horizontally on a phone (overflow-x: auto)`)
  }
}
if (!/\.nb-table-scroll/u.test(css)) fail('copyable tables need their own scroll container on a phone')

if (!/\.nb-print\s*\{[^}]*display:\s*none/u.test(print)) fail('print must hide the print button')
if (!/break-inside:\s*avoid/u.test(print) || !/page-break-inside:\s*avoid/u.test(print)) {
  fail('print must keep a block on one page (break-inside and page-break-inside)')
}
for (const block of ['.nb-definition', '.nb-rule', '.nb-steps', '.nb-example', '.nb-figure', '.nb-table-block', '.nb-note']) {
  const rule = print.match(new RegExp(`${block.replace(/[.]/gu, '\\.')}(?=[^{]*\\{[^}]*break-inside)`, 'u'))
  if (!rule && !print.includes(block)) fail(`print rules do not cover ${block}`)
}
if (!/:has\(\.student-notebook\)/u.test(print)) fail('print must drop the lesson chrome around the notebook sheet')
if (!/overflow:\s*visible/u.test(print)) fail('print must release the scroll containers so figures are not clipped')

// The 13px floor of the design system also holds on a phone; print sizes are in points on purpose.
for (const [context, body] of [['base', base], ['phone', mobile], ['tablet', tablet]] as const) {
  for (const declaration of body.matchAll(/font-size:\s*([^;}]+)/gu)) {
    const sizes = [...declaration[1]!.matchAll(/(\d*\.?\d+)(rem|px)/gu)]
      .map(match => Number(match[1]) * (match[2] === 'rem' ? 16 : 1))
    if (sizes.length && Math.min(...sizes) < 13) {
      fail(`the ${context} notebook CSS sets a font below the 13px floor: font-size: ${declaration[1]!.trim()}`)
    }
  }
}

dom.window.close()

console.log(
  `Notebook check passed: ${docs.length} notebooks wired as the final step of every registered lesson and review across ${curriculumRegistry.length} unit(s), ` +
  `${sectionCount} sections and ${blockCount} copyable blocks (${[...kindTotals.entries()].map(([kind, count]) => `${kind} ${count}`).join(', ')}), ` +
  `${figures} accessible figures, ${tables} copyable tables, ${printButtons} print controls and no form control.\n` +
  `Section purposes: ${recordSections} «يُدوَّن في الدفتر» and ${practiceSections} «حلول وتدرّبات», with every definition/rule/procedure in a record section.\n` +
  `Layout: ${notebookClasses.size} notebook classes styled for desktop, tablet (≤900px), phone (≤760px) and print; no screen font below 13px.\n` +
  `Step counts now: ${stepCounts.join('، ')}.\n` +
  `Hand-offs: registered lesson/unit tests are validated for lessons/reviews with a test route; interactive assessments remain required when no test route is declared.`,
)
process.exit(0)
