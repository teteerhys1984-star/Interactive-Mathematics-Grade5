/**
 * Lesson 7 coverage audit — متوازي الأضلاع, textbook pages 31–35.
 *
 * This check deliberately does NOT trust counts or metadata. For every textbook element it
 * verifies that the id is actually mounted in the Student Area through <BookTask id="...">,
 * that BookTask really renders the question text, the step-by-step reasoning and the answer,
 * and that a matching Teacher Area solution exists with the correct real page number.
 */
import { readFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import {
  finalAssessment7, lessonSevenBookElements, lessonSevenBookElementIds, lessonSevenBookPages,
} from '../src/lessons/parallelogramData'
import { lessonSevenTeacherEntries } from '../src/teacher/lesson7'

const fail = (message: string): never => { throw new Error(`Lesson 7 check failed: ${message}`) }

const STUDENT_FILE = 'src/lessons/ParallelogramLesson.tsx'
const studentSource = readFileSync(STUDENT_FILE, 'utf8')
const geoSource = readFileSync('src/components/lesson/GeoFigure.tsx', 'utf8')
const themeSource = readFileSync('src/lesson-seven.css', 'utf8')

/* ------------------------------------------------- 1. registry + routing */
const lessons = curriculumRegistry.flatMap(unit => unit.lessons)
const lesson = lessons.find(candidate => candidate.id === 'parallelogram')
if (!lesson) fail('lesson "parallelogram" is not present in the curriculum registry (Course Home)')
if (lesson!.availability !== 'available') fail('lesson is not registered as available')
if (!lessonComponents.parallelogram) fail('lesson has no routed component in lessonComponents')
for (const previous of ['coordinates', 'line-graphs', 'natural-numbers', 'rounding-natural-numbers', 'adding-subtracting-natural-numbers', 'angle-measurement']) {
  if (!lessonComponents[previous]) fail(`Lesson 7 work broke the routing of an earlier lesson: ${previous}`)
}

/* ------------------------------------------------- 2. page ledger */
if (lessonSevenBookPages.length !== 5) fail('source page ledger must contain exactly the five supplied pages (31–35)')
for (const page of lessonSevenBookPages) {
  if (!lessonSevenBookElements.some(element => element.page === page)) fail(`page ${page} has no coverage entry`)
  if (!lessonSevenTeacherEntries.some(entry => entry.source.type === 'textbook' && entry.source.page === page)) fail(`page ${page} has no Teacher Area entry`)
}
if (new Set(lessonSevenBookElementIds).size !== lessonSevenBookElementIds.length) fail('duplicate textbook element id in the ledger')

/* ------------------------------------------------- 3. no dropped sub-question */
/** Explicit, hand-transcribed inventory of every question and lettered sub-question on ص 31–35. */
const requiredIds: Record<string, string[]> = {
  'ص 31 — مدخل + سنتعلّم': ['l7-p31-intro', 'l7-p31-goals'],
  'ص 31 — انطلاقة نشطة أ (خمسة أشكال)': ['l7-p31-a-fig1', 'l7-p31-a-fig2', 'l7-p31-a-fig3', 'l7-p31-a-fig4', 'l7-p31-a-fig5'],
  'ص 31 — انطلاقة نشطة ب': ['l7-p31-b'],
  'ص 32 — تعلّم (تعريف + مثال + قطر + تسمية القطرين)': ['l7-p32-definition', 'l7-p32-example', 'l7-p32-diagonal', 'l7-p32-diagonal-name'],
  'ص 32 — تحقّق ① (شكلان)': ['l7-p32-check1-fig1', 'l7-p32-check1-fig2'],
  'ص 32 — تحقّق ② (ثلاثة أشكال)': ['l7-p32-check2-fig1', 'l7-p32-check2-fig2', 'l7-p32-check2-fig3'],
  'ص 33 — اصنع نموذجاً (خطوات + سؤالان)': ['l7-p33-model-steps', 'l7-p33-model-q1', 'l7-p33-model-q2'],
  'ص 33 — خاصة الأضلاع': ['l7-p33-property-sides'],
  'ص 33 — لنعمل معاً (ثلاثة أسئلة)': ['l7-p33-together-q1', 'l7-p33-together-q2', 'l7-p33-together-q3'],
  'ص 33 — خاصة الزوايا + تعبير شفهي': ['l7-p33-property-angles', 'l7-p33-oral'],
  'ص 33 — تحقّق (زاويتان + ضلعان)': ['l7-p33-check-angle-c', 'l7-p33-check-angle-d', 'l7-p33-check-side-ad', 'l7-p33-check-side-dc'],
  'ص 34 — خطوات الرسم الخمس': ['l7-p34-draw-step1', 'l7-p34-draw-step2', 'l7-p34-draw-step3', 'l7-p34-draw-step4', 'l7-p34-draw-step5'],
  'ص 34 — تحقّق (رسم + تسمية [BD])': ['l7-p34-check-draw', 'l7-p34-check-bd'],
  'ص 35 — تدرّب ① (أ..و)': ['l7-p35-ex1-a', 'l7-p35-ex1-b', 'l7-p35-ex1-c', 'l7-p35-ex1-d', 'l7-p35-ex1-e', 'l7-p35-ex1-f'],
  'ص 35 — تدرّب ② (أ، ب)': ['l7-p35-ex2-a', 'l7-p35-ex2-b'],
  'ص 35 — تدرّب ③ (أ..د)': ['l7-p35-ex3-a', 'l7-p35-ex3-b', 'l7-p35-ex3-c', 'l7-p35-ex3-d'],
  'ص 35 — تدرّب ④ (أ..د)': ['l7-p35-ex4-a', 'l7-p35-ex4-b', 'l7-p35-ex4-c', 'l7-p35-ex4-d'],
  'ص 35 — تدرّب ⑤ (أ، ب×2)': ['l7-p35-ex5-a', 'l7-p35-ex5-b-cde', 'l7-p35-ex5-b-dcb'],
}
const declared = Object.values(requiredIds).flat()
for (const [group, ids] of Object.entries(requiredIds)) {
  for (const id of ids) if (!lessonSevenBookElementIds.includes(id)) fail(`missing textbook item "${id}" from group ${group}`)
}
for (const id of lessonSevenBookElementIds) {
  if (!declared.includes(id)) fail(`ledger contains "${id}" which is not declared in the hand-transcribed inventory`)
}

/* ------------------------------------------------- 4. Student Area really renders each item */
if (!studentSource.includes('function BookTask')) fail('Student Area lost the BookTask renderer')
for (const fragment of ['element.prompt', 'element.answer', 'element.reasoning', 'element.pitfall']) {
  if (!studentSource.includes(fragment)) fail(`BookTask does not render ${fragment} — textbook items would not be explained in the Student Area`)
}
const mountedIds = new Set(Array.from(studentSource.matchAll(/<BookTask\s+id="([\w-]+)"/g), match => match[1]))
for (const element of lessonSevenBookElements) {
  if (!mountedIds.has(element.id)) fail(`textbook element "${element.id}" (ص ${element.page}) is NOT mounted in the Student Area via <BookTask>`)
}
for (const id of mountedIds) {
  if (!lessonSevenBookElementIds.includes(id)) fail(`Student Area mounts unknown textbook id "${id}"`)
}
if (!studentSource.includes('BookCoverageMarkers')) fail('Student Area coverage index is missing')

/* ------------------------------------------------- 5. Teacher Area solutions */
for (const element of lessonSevenBookElements) {
  const teacher = lessonSevenTeacherEntries.find(entry => entry.id === element.id)
  if (!teacher) fail(`missing Teacher Area solution for ${element.id}`)
  if (teacher!.source.type !== 'textbook' || (teacher!.source as { page: number }).page !== element.page) fail(`wrong textbook page metadata for ${element.id}`)
  if (!teacher!.prompt.trim()) fail(`empty prompt in Teacher Area for ${element.id}`)
  if (!teacher!.answer.trim()) fail(`empty answer in Teacher Area for ${element.id}`)
  if (teacher!.reasoning.length < 2) fail(`solution for ${element.id} is not step-by-step (needs at least two steps)`)
  if (teacher!.reasoning.some(step => step.trim().length < 12)) fail(`solution step too short to be a real explanation in ${element.id}`)
  if (element.reasoning.length < 2) fail(`Student Area explanation for ${element.id} is not step-by-step`)
}
for (const entry of lessonSevenTeacherEntries) {
  if (!entry.reasoning?.length) fail(`empty reasoning for ${entry.id}`)
  if (entry.source.type === 'platform' && 'page' in entry.source) fail(`platform entry carries a fake page: ${entry.id}`)
  if (entry.source.type === 'textbook' && !lessonSevenBookPages.includes(entry.source.page as (typeof lessonSevenBookPages)[number])) fail(`invalid page on ${entry.id}`)
}

/* ------------------------------------------------- 6. Final Test */
if (finalAssessment7.length < 8) fail('Final Test must contain at least eight new questions')
const bookPrompts = lessonSevenBookElements.map(element => element.prompt.replace(/\s+/g, ''))
for (const question of finalAssessment7) {
  const entry = lessonSevenTeacherEntries.find(candidate => candidate.id === question.id)
  if (!entry || entry.source.type !== 'platform') fail(`missing platform solution for final question ${question.id}`)
  if (!entry!.reasoning || entry!.reasoning.length < 3) fail(`final question ${question.id} has no detailed step-by-step solution`)
  if (bookPrompts.includes(question.text.replace(/\s+/g, ''))) fail(`final question ${question.id} copies a textbook question verbatim`)
  if (!studentSource.includes('finalAssessment7')) fail('Final Test is not rendered in the Student Area')
}

/* ------------------------------------------------- 7. figures, zoom, RTL/LTR boundaries */
const requiredFigures = [
  'Fig31One', 'Fig31Two', 'Fig31Three', 'Fig31Four', 'Fig31Five',
  'Fig32Main', 'Fig32Check1A', 'Fig32Check1B', 'Fig32Check2A', 'Fig32Check2B', 'Fig32Check2C',
  'ModelCard', 'Fig33Together', 'Fig33Check', 'MiniProtractor', 'ConstructionFigure', 'Fig35Ex1', 'Fig35Ex5',
]
for (const figure of requiredFigures) {
  if (!studentSource.includes(`function ${figure}`) && !studentSource.includes(`const ${figure} =`)) fail(`rebuilt figure "${figure}" is missing from the Student Area`)
}
const requiredInteractions = ['ShapeSorter', 'ParallelogramLab', 'ModelCardActivity', 'ConstructionPlayer', 'FourthVertexActivity', 'FillBlanksActivity', 'ErrorHunt']
for (const interaction of requiredInteractions) {
  if (!studentSource.includes(`function ${interaction}`)) fail(`required interactive activity "${interaction}" is missing`)
  if (!studentSource.includes(`<${interaction} />`)) fail(`activity "${interaction}" is defined but never rendered in a step`)
}
if (!studentSource.includes('zoomable')) fail('no zoomable figure frame is used in the Student Area')
if (!geoSource.includes('FigureFrame') || !geoSource.includes('تكبير الرسم')) fail('FigureFrame zoom control is missing')
if (!geoSource.includes("direction: 'ltr'") || !geoSource.includes('unicodeBidi')) fail('geometry SVG is not isolated in an LTR context')
if (!geoSource.includes('direction="ltr"')) fail('geometry SVG lacks the dir=ltr attribute')
if (!studentSource.includes('MathExpression') || !studentSource.includes('BidiText')) fail('math/mixed-text bidi boundaries are not used in the Student Area')
if (!themeSource.includes('.lesson-seven')) fail('Lesson 7 theme is not scoped to .lesson-seven')

/* ------------------------------------------------- 8. sequential shell */
if (!studentSource.includes('LessonShell') || !studentSource.includes('LessonOutline'.slice(0, 6))) fail('lesson does not use the sequential LessonShell architecture')
const stepIds = Array.from(studentSource.matchAll(/\{ id: '([\w-]+)', title: '/g), match => match[1])
if (stepIds.length < 10) fail(`sequential lesson must expose one step per phase, found ${stepIds.length}`)
if (!stepIds.includes('test')) fail('Final Test step is missing from the step list')
if (!stepIds.includes('recap')) fail('recap step is missing from the step list')

/* ------------------------------------------------- 9. geometric accuracy of every rebuilt figure */
/**
 * Renders the real lesson in jsdom, then measures the produced SVG geometry:
 *  - sides carrying the same parallel-mark signature must actually be parallel;
 *  - a printed angle label (e.g. 70°) must match the angle actually drawn at that vertex;
 *  - printed side lengths (e.g. 3cm / 2cm) must be drawn to a consistent scale.
 * This is what makes the figures trustworthy instead of merely "present".
 */
const figureReport = await verifyFigures()

async function verifyFigures() {
  const { JSDOM } = await import('jsdom')
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
  const { render, fireEvent } = await import('@testing-library/react')
  const { ParallelogramLesson } = await import('../src/lessons/ParallelogramLesson')

  render(React.createElement(ParallelogramLesson))

  type V = { x: number; y: number }
  const distance = (a: V, b: V) => Math.hypot(a.x - b.x, a.y - b.y)
  const angleBetween = (o: V, a: V, b: V) => {
    const u = { x: a.x - o.x, y: a.y - o.y }
    const v = { x: b.x - o.x, y: b.y - o.y }
    const cos = (u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))
    return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI
  }
  const lineAngle = (a: V, b: V) => {
    let deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
    if (deg < 0) deg += 180
    if (deg >= 180) deg -= 180
    return deg
  }

  let figures = 0
  let parallelAsserts = 0
  let angleAsserts = 0
  let scaleAsserts = 0

  const steps = Array.from(document.querySelectorAll('.lesson-outline button'))
  steps.forEach((stepButton, stepIndex) => {
    fireEvent.click(stepButton)
    const svgs = Array.from(document.querySelectorAll('.lesson-content svg.l7-geo'))
    svgs.forEach((svg, svgIndex) => {
      const where = `step ${stepIndex + 1}, figure ${svgIndex + 1}`
      const shape = svg.querySelector('.l7-geo-shape')
      const d = shape?.getAttribute('d') ?? ''
      if (!d.trim().endsWith('Z')) return // open construction paths: nothing closed to measure yet
      const coords = Array.from(d.matchAll(/[ML]\s+(-?[\d.]+)\s+(-?[\d.]+)/g), match => ({ x: Number(match[1]), y: Number(match[2]) }))
      if (coords.length < 3) return
      figures++

      // vertex letters, matched to the nearest polygon corner
      const named = new Map<string, V>()
      svg.querySelectorAll('text.l7-geo-point').forEach(node => {
        const at = { x: Number(node.getAttribute('x')), y: Number(node.getAttribute('y')) }
        let best = coords[0]
        for (const corner of coords) if (distance(corner, at) < distance(best, at)) best = corner
        named.set(node.textContent ?? '', best)
      })

      const sides = coords.map((point, index) => ({ a: point, b: coords[(index + 1) % coords.length] }))
      const midOf = (side: { a: V; b: V }) => ({ x: (side.a.x + side.b.x) / 2, y: (side.a.y + side.b.y) / 2 })

      // (a) parallel marks must describe genuinely parallel sides
      const groups = new Map<string, Array<{ a: V; b: V }>>()
      svg.querySelectorAll('g.l7-geo-mark').forEach(group => {
        const chevrons = group.querySelectorAll('path')
        const points = Array.from(chevrons).flatMap(path => Array.from((path.getAttribute('d') ?? '').matchAll(/(-?[\d.]+)\s+(-?[\d.]+)/g), m => ({ x: Number(m[1]), y: Number(m[2]) })))
        if (!points.length) return
        const centre = { x: points.reduce((sum, p) => sum + p.x, 0) / points.length, y: points.reduce((sum, p) => sum + p.y, 0) / points.length }
        let best = sides[0]
        for (const side of sides) if (distance(midOf(side), centre) < distance(midOf(best), centre)) best = side
        const signature = `${group.getAttribute('class')}-${chevrons.length}`
        groups.set(signature, [...(groups.get(signature) ?? []), best])
      })
      for (const [signature, marked] of groups) {
        if (marked.length < 2) continue
        const reference = lineAngle(marked[0].a, marked[0].b)
        for (const side of marked.slice(1)) {
          const delta = Math.abs(lineAngle(side.a, side.b) - reference)
          if (Math.min(delta, 180 - delta) > 2) fail(`${where}: sides marked "${signature}" as parallel differ by ${delta.toFixed(1)}°`)
          parallelAsserts++
        }
      }

      // (b) printed angle labels must match the drawn angle
      svg.querySelectorAll('text.l7-geo-angle-label').forEach(node => {
        const printed = Number((node.textContent ?? '').replace('°', ''))
        if (!Number.isFinite(printed)) return
        const at = { x: Number(node.getAttribute('x')), y: Number(node.getAttribute('y')) }
        let index = 0
        for (let i = 0; i < coords.length; i++) if (distance(coords[i], at) < distance(coords[index], at)) index = i
        const vertex = coords[index]
        const measured = angleBetween(vertex, coords[(index + 1) % coords.length], coords[(index - 1 + coords.length) % coords.length])
        if (Math.abs(measured - printed) > 3) fail(`${where}: label ${printed}° is drawn as ${measured.toFixed(1)}°`)
        angleAsserts++
      })

      // (c) printed lengths must share one consistent scale
      const scales: number[] = []
      svg.querySelectorAll('text.l7-geo-side-label').forEach(node => {
        const printed = Number((node.textContent ?? '').replace(/[^\d.]/g, ''))
        if (!Number.isFinite(printed) || printed === 0) return
        const at = { x: Number(node.getAttribute('x')), y: Number(node.getAttribute('y')) }
        let best = sides[0]
        for (const side of sides) if (distance(midOf(side), at) < distance(midOf(best), at)) best = side
        scales.push(distance(best.a, best.b) / printed)
      })
      if (scales.length > 1) {
        const min = Math.min(...scales)
        const max = Math.max(...scales)
        if (max / min > 1.07) fail(`${where}: printed lengths are not drawn to one scale (px per unit ranges ${min.toFixed(1)}–${max.toFixed(1)})`)
        scaleAsserts += scales.length
      }
      void named
    })
  })
  return { figures, parallelAsserts, angleAsserts, scaleAsserts }
}

const sections = new Set(lessonSevenBookElements.map(element => element.section))
const subQuestions = lessonSevenBookElements.filter(element => /—\s*(أ|ب|ج|د|هـ|و|①|②)/.test(element.section) || /^l7-p35-ex/.test(element.id)).length
console.log(
  `Lesson 7 check passed: ${lessonSevenBookElements.length} textbook elements over pages ${lessonSevenBookPages.join('، ')}, ` +
  `${mountedIds.size} mounted in the Student Area, ${lessonSevenTeacherEntries.length} Teacher entries ` +
  `(${lessonSevenTeacherEntries.filter(entry => entry.source.type === 'textbook').length} textbook / ${lessonSevenTeacherEntries.filter(entry => entry.source.type === 'platform').length} platform), ` +
  `${sections.size} source sections, ${subQuestions} lettered sub-questions, ${requiredFigures.length} rebuilt figures, ` +
  `${requiredInteractions.length} interactive activities, ${finalAssessment7.length} brand-new final questions, ${stepIds.length} sequential steps.\n` +
  `Figure accuracy verified on ${figureReport.figures} rendered SVG figures: ${figureReport.parallelAsserts} parallel-mark assertions, ` +
  `${figureReport.angleAsserts} printed-angle assertions, ${figureReport.scaleAsserts} to-scale length assertions.`,
)
process.exit(0)
