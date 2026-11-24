/**
 * «دفتر الطالب» audit — the notebook step of every shipped Unit 1 lesson.
 *
 * This check does not trust the authored documents. For each of the eight notebooks it
 *  • proves the doc agrees with `curriculumRegistry` (lesson id, title, unit, textbook pages, theme);
 *  • proves every section and block id is unique, stable and lesson-prefixed, and that the whole
 *    document actually reached the DOM (`data-notebook-block` per authored block);
 *  • proves the notebook stayed a static reference: no form control, no lesson widget, exactly one
 *    button (print), no `data-source-id` marker that could collide with a lesson coverage ledger;
 *  • proves the mixed Arabic/Latin text is bidi-isolated: a leaf holding Latin letters or a geometric
 *    symbol must live inside `BidiText`/`MathExpression`/an LTR-isolated SVG, never in bare RTL prose;
 *  • renders the REAL lesson and walks its outline to the last step, proving the notebook is wired as
 *    the final step, that the step before it is still the lesson's own assessment, and that the
 *    progress bar reports the new step count.
 *
 * Run independently with `npm run notebook-check`; it is part of `quality-check` and therefore `build`.
 */
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'

const fail = (message: string): never => { throw new Error(`Notebook check failed: ${message}`) }

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

import type { NotebookBlock, NotebookDoc } from '../src/notebook/types'

/** lesson id → its notebook factory, the lesson file that must wire it, and the expected step count. */
const plan: Array<{
  id: string
  prefix: string
  file: string
  steps: number
  theme?: string
  make: () => NotebookDoc
}> = [
  { id: 'coordinates', prefix: 'l1', file: 'src/lessons/CoordinatesLesson.tsx', steps: 10, make: coordinatesNotebook },
  { id: 'line-graphs', prefix: 'l2', file: 'src/lessons/LineGraphsLesson.tsx', steps: 11, make: lineGraphsNotebook },
  { id: 'natural-numbers', prefix: 'l3', file: 'src/lessons/NaturalNumbersLesson.tsx', steps: 12, make: naturalNumbersNotebook },
  { id: 'rounding-natural-numbers', prefix: 'l4', file: 'src/lessons/RoundingLesson.tsx', steps: 6, theme: 'lesson-four', make: roundingNotebook },
  { id: 'adding-subtracting-natural-numbers', prefix: 'l5', file: 'src/lessons/AdditionSubtractionLesson.tsx', steps: 15, theme: 'lesson-five', make: additionSubtractionNotebook },
  { id: 'angle-measurement', prefix: 'l6', file: 'src/lessons/AnglesLesson.tsx', steps: 14, theme: 'lesson-six', make: anglesNotebook },
  { id: 'parallelogram', prefix: 'l7', file: 'src/lessons/ParallelogramLesson.tsx', steps: 16, theme: 'lesson-seven', make: parallelogramNotebook },
  { id: 'rhombus', prefix: 'l8', file: 'src/lessons/RhombusLesson.tsx', steps: 15, theme: 'lesson-eight', make: rhombusNotebook },
]

const unitOne = curriculumRegistry.find(unit => unit.id === 'unit-1')
if (!unitOne) fail('unit-1 is missing from the curriculum registry')
if (unitOne!.lessons.length !== plan.length) fail(`expected ${plan.length} Unit 1 lessons, found ${unitOne!.lessons.length}`)

const docs = plan.map(entry => ({ entry, doc: entry.make() }))

/* ------------------------------------------- 2. static shape of every doc */
let blockCount = 0
let sectionCount = 0
const kindTotals = new Map<string, number>()

for (const { entry, doc } of docs) {
  const lesson = unitOne!.lessons.find(candidate => candidate.id === entry.id)
  if (!lesson) fail(`no registry lesson for notebook "${entry.id}"`)
  if (doc.lessonId !== entry.id) fail(`${entry.id}: doc.lessonId is "${doc.lessonId}"`)
  if (doc.lessonTitle !== lesson!.title) fail(`${entry.id}: doc.lessonTitle "${doc.lessonTitle}" ≠ registry title "${lesson!.title}"`)
  if (doc.unit !== unitOne!.title) fail(`${entry.id}: doc.unit "${doc.unit}" ≠ registry unit "${unitOne!.title}"`)
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

/** Markup that would turn the static notebook back into an activity, or collide with a lesson ledger. */
const FORBIDDEN = ['.grid-hit', '.final-test', '.test-question', '.l8-blanks', '[data-source-id]', '.lesson-outline', '.l7-reveal', '.l7-task', 'form'] as const
/** A leaf holding Latin letters or a geometric symbol must sit in an isolated LTR context. */
const NEEDS_ISOLATION = /[A-Za-z∠]/u
const ISOLATED_CONTEXT = '.math-expression, [dir="ltr"], svg, bdi' as const

let printButtons = 0
let figures = 0
let tables = 0

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
  tables += root!.querySelectorAll('table.nb-table').length

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

  cleanup()
}

/* --------------------------------- 4. the notebook is the lesson's last step */
const stepCounts: string[] = []
for (const { entry } of docs) {
  const Lesson = lessonComponents[entry.id]
  if (!Lesson) fail(`${entry.id}: no routed lesson component in lessonComponents`)
  const { container } = render(React.createElement(Lesson))
  // The desktop timeline holds exactly one button per step; the mobile trigger is not a step.
  const outline = Array.from(container.querySelectorAll<HTMLButtonElement>('.lesson-outline-list.is-desktop > li > button'))
  if (outline.length !== entry.steps) fail(`${entry.id}: expected ${entry.steps} lesson steps (including «دفتر الطالب»), found ${outline.length}`)
  if (!outline[outline.length - 1]!.textContent!.includes('دفتر الطالب')) fail(`${entry.id}: the last lesson step is not «دفتر الطالب»`)
  if (!outline[outline.length - 1]!.textContent!.includes(`الخطوة ${entry.steps}`)) fail(`${entry.id}: the notebook is not numbered as step ${entry.steps} in the outline`)

  const progress = container.querySelector('[role="progressbar"]')
  if (progress?.getAttribute('aria-valuemax') !== String(entry.steps)) fail(`${entry.id}: progress bar reports ${progress?.getAttribute('aria-valuemax')} steps, expected ${entry.steps}`)

  // The assessment must survive: it stays the step immediately before the notebook.
  fireEvent.click(outline[outline.length - 2]!)
  const assessment = container.querySelector('.lesson-content')
  if (!assessment || assessment.querySelectorAll('input, button').length === 0) {
    fail(`${entry.id}: the step before the notebook no longer looks like the lesson assessment (no controls rendered)`)
  }

  fireEvent.click(outline[outline.length - 1]!)
  const notebookRoot = container.querySelector<HTMLElement>(`.student-notebook[data-notebook="${entry.id}"]`)
  if (!notebookRoot) fail(`${entry.id}: clicking the last step did not render the notebook for this lesson`)
  if (container.querySelectorAll('.student-notebook').length !== 1) fail(`${entry.id}: more than one notebook rendered inside the lesson`)
  const stepId = container.querySelector('[data-step-id]')?.getAttribute('data-step-id')
  if (stepId !== 'notebook') fail(`${entry.id}: the lesson shell is not on the "notebook" step (found "${stepId}")`)
  stepCounts.push(`${entry.prefix}=${outline.length}`)
  cleanup()
}

dom.window.close()

console.log(
  `Notebook check passed: ${docs.length} lesson notebooks («دفتر الطالب») wired as the final step of every Unit 1 lesson, ` +
  `${sectionCount} sections and ${blockCount} copyable blocks (${[...kindTotals.entries()].map(([kind, count]) => `${kind} ${count}`).join(', ')}), ` +
  `${figures} accessible figures, ${tables} copyable tables, ${printButtons} print controls and no form control.\n` +
  `Step counts now: ${stepCounts.join('، ')}.`,
)
process.exit(0)
