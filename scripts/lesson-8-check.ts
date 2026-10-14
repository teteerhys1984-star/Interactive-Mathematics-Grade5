/**
 * Lesson 8 coverage audit — المعيّن, textbook pages 36–39.
 *
 * This check deliberately does NOT trust counts or metadata. For every textbook element it
 * verifies that the id is actually mounted in the Student Area through <BookTask id="...">,
 * that BookTask really renders the prompt, the structured solution and the verification, and
 * that a matching Teacher Area solution exists with the correct real page number.
 * Finally it renders the real lesson in jsdom and measures the produced SVG geometry so the
 * rebuilt figures are trustworthy and not merely "present".
 */
import { readFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import {
  finalAssessment8, lessonEightBookElements, lessonEightBookElementIds, lessonEightBookPages,
  lessonEightBookTasks, lessonEightBookContent,
} from '../src/lessons/rhombusData'
import { lessonEightTeacherEntries } from '../src/teacher/lesson8'

const fail = (message: string): never => { throw new Error(`Lesson 8 check failed: ${message}`) }

const STUDENT_FILE = 'src/lessons/RhombusLesson.tsx'
const studentSource = readFileSync(STUDENT_FILE, 'utf8')
const geoSource = readFileSync('src/components/lesson/GeoFigure.tsx', 'utf8')
const themeSource = readFileSync('src/lesson-eight.css', 'utf8')

/* ------------------------------------------------- 1. registry + routing */
const lessons = curriculumRegistry.flatMap(unit => unit.lessons)
const lesson = lessons.find(candidate => candidate.id === 'rhombus')
if (!lesson) fail('lesson "rhombus" is not present in the curriculum registry (Course Home)')
if (lesson!.availability !== 'available') fail('lesson is not registered as available')
if (lesson!.title !== 'المعيّن') fail('registry title must match the LessonShell title "المعيّن"')
if (!lessonComponents.rhombus) fail('lesson has no routed component in lessonComponents')
for (const previous of ['coordinates', 'line-graphs', 'natural-numbers', 'rounding-natural-numbers', 'adding-subtracting-natural-numbers', 'angle-measurement', 'parallelogram']) {
  if (!lessonComponents[previous]) fail(`Lesson 8 work broke the routing of an earlier lesson: ${previous}`)
}
const unitOne = curriculumRegistry.find(unit => unit.id === 'unit-1')
if (!unitOne) fail('unit-1 is missing from the curriculum registry')
if (unitOne!.lessons.length !== 8) fail(`unit-1 must list the eight shipped lessons, found ${unitOne!.lessons.length}`)
if (unitOne!.lessons.some(entry => entry.availability !== 'available')) fail('a unit-1 lesson is not available while the unit is marked complete')
if (unitOne!.status !== 'complete') fail('unit-1 must be explicitly marked complete once all eight lessons ship')

/* ------------------------------------------------- 2. page ledger */
if (lessonEightBookPages.length !== 4) fail('source page ledger must contain exactly the four supplied pages (36–39)')
for (const page of lessonEightBookPages) {
  if (!lessonEightBookElements.some(element => element.page === page)) fail(`page ${page} has no coverage entry`)
  if (!lessonEightTeacherEntries.some(entry => entry.source.type === 'textbook' && entry.source.page === page)) fail(`page ${page} has no Teacher Area entry`)
}
if (new Set(lessonEightBookElementIds).size !== lessonEightBookElementIds.length) fail('duplicate textbook element id in the ledger')
if (lessonEightBookTasks.length + lessonEightBookContent.length !== lessonEightBookElements.length) fail('every ledger row must be classified as task or content')

/* ------------------------------------------------- 3. no dropped sub-question */
/** Explicit, hand-transcribed inventory of every printed element on ص 36–39. */
const requiredIds: Record<string, string[]> = {
  'ص 36 — سنتعلّم + صورة المدخل': ['l8-p36-goals', 'l8-p36-photo'],
  'ص 36 — انطلاقة نشطة (سؤالان)': ['l8-p36-start-q1', 'l8-p36-start-q2'],
  'ص 36 — تعلّم ① (تعريف + مثال)': ['l8-p36-definition', 'l8-p36-example'],
  'ص 37 — تحقّق ① (شكلان)': ['l8-p37-check1-fig1', 'l8-p37-check1-fig2'],
  'ص 37 — تحقّق ② (ثلاثة أشكال)': ['l8-p37-check2-fig1', 'l8-p37-check2-fig2', 'l8-p37-check2-fig3'],
  'ص 37 — تعبير شفهي': ['l8-p37-oral'],
  'ص 37 — تعلّم ② (خواصّ المعيّن)': ['l8-p37-properties'],
  'ص 37 — تحقّق ③ (ثلاثة أطوال وزاويتان)': ['l8-p37-check3-bc', 'l8-p37-check3-cd', 'l8-p37-check3-da', 'l8-p37-check3-angle-c', 'l8-p37-check3-angle-d'],
  'ص 38 — تعلّم ③ (معطيات + خمس خطوات)': ['l8-p38-draw-intro', 'l8-p38-draw-step1', 'l8-p38-draw-step2', 'l8-p38-draw-step3', 'l8-p38-draw-step4', 'l8-p38-draw-step5'],
  'ص 39 — تحقّق من فهمك (رسم XYZW)': ['l8-p39-check-draw'],
  'ص 39 — تدرّب ① (ستّة أشكال)': ['l8-p39-ex1-fig1', 'l8-p39-ex1-fig2', 'l8-p39-ex1-fig3', 'l8-p39-ex1-fig4', 'l8-p39-ex1-fig5', 'l8-p39-ex1-fig6'],
  'ص 39 — تدرّب ② (أ، ب)': ['l8-p39-ex2-a', 'l8-p39-ex2-b'],
  'ص 39 — تدرّب ③ (ثلاثة أطوال)': ['l8-p39-ex3-bc', 'l8-p39-ex3-af', 'l8-p39-ex3-ab'],
}
const declared = Object.values(requiredIds).flat()
for (const [group, ids] of Object.entries(requiredIds)) {
  for (const id of ids) if (!lessonEightBookElementIds.includes(id)) fail(`missing textbook item "${id}" from group ${group}`)
}
for (const id of lessonEightBookElementIds) {
  if (!declared.includes(id)) fail(`ledger contains "${id}" which is not declared in the hand-transcribed inventory`)
}
if (lessonEightBookTasks.length !== 25) fail(`the printed student tasks on ص 36–39 are 25 (including every sub-part); found ${lessonEightBookTasks.length}`)
if (lessonEightBookContent.length !== 11) fail(`the printed teaching elements on ص 36–39 are 11; found ${lessonEightBookContent.length}`)

/* ------------------------------------------------- 4. Student Area really renders each item */
if (!studentSource.includes('function BookTask')) fail('Student Area lost the BookTask renderer')
for (const fragment of ['element.prompt', 'element.given', 'element.required', 'element.rule', 'element.why', 'element.reasoning', 'element.answer', 'element.verification', 'element.pitfall', 'element.note']) {
  if (!studentSource.includes(fragment)) fail(`BookTask does not render ${fragment} — textbook items would not be fully explained in the Student Area`)
}
const mountedIds = new Set(Array.from(studentSource.matchAll(/<BookTask\s+id="([\w-]+)"/g), match => match[1]))
for (const element of lessonEightBookElements) {
  if (!mountedIds.has(element.id)) fail(`textbook element "${element.id}" (ص ${element.page}) is NOT mounted in the Student Area via <BookTask>`)
}
for (const id of mountedIds) {
  if (!lessonEightBookElementIds.includes(id)) fail(`Student Area mounts unknown textbook id "${id}"`)
}
if (!studentSource.includes('BookCoverageMarkers')) fail('Student Area coverage index is missing')

/* ------------------------------------------------- 5. Teacher Area solutions */
for (const element of lessonEightBookElements) {
  const teacher = lessonEightTeacherEntries.find(entry => entry.id === element.id)
  if (!teacher) fail(`missing Teacher Area solution for ${element.id}`)
  if (teacher!.source.type !== 'textbook' || (teacher!.source as { page: number }).page !== element.page) fail(`wrong textbook page metadata for ${element.id}`)
  if (!teacher!.prompt.trim()) fail(`empty prompt in Teacher Area for ${element.id}`)
  if (!teacher!.answer.trim()) fail(`empty answer in Teacher Area for ${element.id}`)
  if (teacher!.reasoning.length < 7) fail(`solution for ${element.id} is not a full solution (needs معطيات/مطلوب/قاعدة/لماذا/خطوات/إجابة/تحقّق)`)
  if (teacher!.reasoning.some(step => step.trim().length < 12)) fail(`solution step too short to be a real explanation in ${element.id}`)
  for (const required of ['المعطيات:', 'المطلوب:', 'القاعدة المستعملة:', 'لماذا تنطبق هنا:', 'الإجابة النهائية:', 'التحقّق:']) {
    if (!teacher!.reasoning.some(step => step.startsWith(required))) fail(`Teacher solution for ${element.id} is missing the "${required}" part`)
  }
  if (!teacher!.note || !teacher!.note.includes('القسم:')) fail(`Teacher note for ${element.id} must record the printed section`)
  if (element.reasoning.length < 2) fail(`Student Area explanation for ${element.id} is not step-by-step`)
  if (!element.verification.trim()) fail(`missing verification strategy for ${element.id}`)
  if (!element.given.trim() || !element.required.trim() || !element.rule.trim() || !element.why.trim()) fail(`incomplete solution frame for ${element.id}`)
}
for (const entry of lessonEightTeacherEntries) {
  if (!entry.reasoning?.length) fail(`empty reasoning for ${entry.id}`)
  if (entry.source.type === 'platform' && 'page' in entry.source) fail(`platform entry carries a fake page: ${entry.id}`)
  if (entry.source.type === 'textbook' && !lessonEightBookPages.includes(entry.source.page as (typeof lessonEightBookPages)[number])) fail(`invalid page on ${entry.id}`)
}

/* ------------------------------------------------- 6. Final Test */
if (finalAssessment8.length < 8) fail('Final Test must contain at least eight new questions')
const bookPrompts = lessonEightBookElements.map(element => element.prompt.replace(/\s+/g, ''))
for (const question of finalAssessment8) {
  const entry = lessonEightTeacherEntries.find(candidate => candidate.id === question.id)
  if (!entry || entry.source.type !== 'platform') fail(`missing platform solution for final question ${question.id}`)
  if (!entry!.reasoning || entry!.reasoning.length < 3) fail(`final question ${question.id} has no detailed step-by-step solution`)
  if (bookPrompts.includes(question.text.replace(/\s+/g, ''))) fail(`final question ${question.id} copies a textbook question verbatim`)
}
if (!studentSource.includes('finalAssessment8')) fail('Final Test is not rendered in the Student Area')

/* ------------------------------------------------- 7. figures, zoom, RTL/LTR boundaries */
const requiredFigures = [
  'MeshFigure', 'Fig36Start1', 'Fig36Start2', 'Fig36Start3', 'Fig36Start4', 'Fig36Definition', 'Fig36Example',
  'Fig37Check1A', 'Fig37Check1B', 'Fig37Check2A', 'Fig37Check2B', 'Fig37Check2C', 'Fig37Rhombus',
  'MiniProtractor8', 'ConstructionFigure8', 'Fig39CheckDraw', 'Fig39Ex1', 'Fig39Ex2', 'Fig39Ex3',
]
for (const figure of requiredFigures) {
  if (!studentSource.includes(`function ${figure}`) && !studentSource.includes(`const ${figure} =`)) fail(`rebuilt figure "${figure}" is missing from the Student Area`)
}
const requiredInteractions = [
  'ShapeSorter8', 'RhombusLab', 'RhombusDetector', 'PropertyLab', 'FillBlanks8',
  'ConstructionPlayer8', 'AnglePlanner', 'NameTheShape', 'FourthVertexActivity8', 'CompositeSolver', 'ErrorHunt8',
]
for (const interaction of requiredInteractions) {
  if (!studentSource.includes(`function ${interaction}`)) fail(`required interactive activity "${interaction}" is missing`)
  if (!studentSource.includes(`<${interaction} />`)) fail(`activity "${interaction}" is defined but never rendered in a step`)
}
if (!studentSource.includes('zoomable')) fail('no zoomable figure frame is used in the Student Area')
if (!geoSource.includes('FigureFrame') || !geoSource.includes('تكبير الرسم')) fail('FigureFrame zoom control is missing')
if (!geoSource.includes("direction: 'ltr'") || !geoSource.includes('unicodeBidi')) fail('geometry SVG is not isolated in an LTR context')
if (!geoSource.includes('direction="ltr"')) fail('geometry SVG lacks the dir=ltr attribute')
if (!studentSource.includes('MathExpression') || !studentSource.includes('BidiText')) fail('math/mixed-text bidi boundaries are not used in the Student Area')
if (!studentSource.includes("direction: 'ltr'") || !studentSource.includes('unicodeBidi')) fail('lesson-specific SVGs are not LTR isolated')
if (!themeSource.includes('.lesson-eight')) fail('Lesson 8 theme is not scoped to .lesson-eight')
if (!readFileSync('src/main.tsx', 'utf8').includes('lesson-eight.css')) fail('Lesson 8 theme is never loaded')

/* ------------------------------------------------- 8. sequential shell */
if (!studentSource.includes('LessonShell')) fail('lesson does not use the sequential LessonShell architecture')
if (!studentSource.includes('theme="lesson-eight"')) fail('lesson does not apply its scoped theme')
const stepIds = Array.from(studentSource.matchAll(/\{ id: '([\w-]+)', title: '/g), match => match[1])
if (stepIds.length < 10) fail(`sequential lesson must expose one step per phase, found ${stepIds.length}`)
for (const needed of ['launch', 'definition', 'properties', 'construction', 'recap', 'test']) {
  if (!stepIds.includes(needed)) fail(`step "${needed}" is missing from the step list`)
}

/* ------------------------------------------------- 9. geometric accuracy of every rebuilt figure */
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
  const { RhombusLesson } = await import('../src/lessons/RhombusLesson')

  render(React.createElement(RhombusLesson))

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
  let tickAsserts = 0
  let angleAsserts = 0
  let scaleAsserts = 0

  const steps = Array.from(document.querySelectorAll('.lesson-outline button'))
  if (steps.length === 0) fail('the lesson outline rendered no steps in jsdom')
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

      const sides = coords.map((point, index) => ({ a: point, b: coords[(index + 1) % coords.length] }))
      const midOf = (side: { a: V; b: V }) => ({ x: (side.a.x + side.b.x) / 2, y: (side.a.y + side.b.y) / 2 })
      const nearestSide = (at: V) => {
        let best = sides[0]
        for (const side of sides) if (distance(midOf(side), at) < distance(midOf(best), at)) best = side
        return best
      }
      const groupCentre = (group: Element) => {
        const paths = group.querySelectorAll('path')
        const points = Array.from(paths).flatMap(path => Array.from((path.getAttribute('d') ?? '').matchAll(/(-?[\d.]+)\s+(-?[\d.]+)/g), m => ({ x: Number(m[1]), y: Number(m[2]) })))
        if (!points.length) return undefined
        return {
          centre: { x: points.reduce((sum, p) => sum + p.x, 0) / points.length, y: points.reduce((sum, p) => sum + p.y, 0) / points.length },
          count: paths.length,
        }
      }

      // (a) parallel marks must describe genuinely parallel sides
      const parallelGroups = new Map<string, Array<{ a: V; b: V }>>()
      svg.querySelectorAll('g.l7-geo-mark').forEach(group => {
        const info = groupCentre(group)
        if (!info) return
        const signature = `${group.getAttribute('class')}-${info.count}`
        parallelGroups.set(signature, [...(parallelGroups.get(signature) ?? []), nearestSide(info.centre)])
      })
      for (const [signature, marked] of parallelGroups) {
        if (marked.length < 2) continue
        const reference = lineAngle(marked[0].a, marked[0].b)
        for (const side of marked.slice(1)) {
          const delta = Math.abs(lineAngle(side.a, side.b) - reference)
          if (Math.min(delta, 180 - delta) > 2) fail(`${where}: sides marked "${signature}" as parallel differ by ${delta.toFixed(1)}°`)
          parallelAsserts++
        }
      }

      // (b) equal-length tick marks must sit on genuinely equal sides
      const tickGroups = new Map<string, Array<{ a: V; b: V }>>()
      svg.querySelectorAll('g.l7-geo-tick').forEach(group => {
        const info = groupCentre(group)
        if (!info) return
        const signature = `${group.getAttribute('class')}-${info.count}`
        tickGroups.set(signature, [...(tickGroups.get(signature) ?? []), nearestSide(info.centre)])
      })
      for (const [signature, marked] of tickGroups) {
        if (marked.length < 2) continue
        const reference = distance(marked[0].a, marked[0].b)
        for (const side of marked.slice(1)) {
          const measured = distance(side.a, side.b)
          if (Math.abs(measured - reference) / reference > 0.02) {
            fail(`${where}: sides marked "${signature}" as equal are drawn ${reference.toFixed(1)}px vs ${measured.toFixed(1)}px`)
          }
          tickAsserts++
        }
      }

      // (c) printed angle labels must match the drawn angle.
      // The vertex is resolved from the arc that sits in the same <g> as the label (its two
      // endpoints are exactly `radius` away from the vertex), never from label proximity.
      svg.querySelectorAll('text.l7-geo-angle-label').forEach(node => {
        const printed = Number((node.textContent ?? '').replace('°', ''))
        if (!Number.isFinite(printed)) return
        const arc = node.parentElement?.querySelector('path.l7-geo-arc')
        const arcPath = arc?.getAttribute('d') ?? ''
        const arcMatch = /M\s+(-?[\d.]+)\s+(-?[\d.]+)\s+A\s+(-?[\d.]+)\s+(-?[\d.]+)\s+0\s+0\s+[01]\s+(-?[\d.]+)\s+(-?[\d.]+)/.exec(arcPath)
        if (!arcMatch) fail(`${where}: angle label ${printed}° has no matching arc to locate its vertex`)
        const p1 = { x: Number(arcMatch![1]), y: Number(arcMatch![2]) }
        const radius = Number(arcMatch![3])
        const p2 = { x: Number(arcMatch![5]), y: Number(arcMatch![6]) }
        let index = 0
        const errorAt = (corner: V) => Math.abs(distance(corner, p1) - radius) + Math.abs(distance(corner, p2) - radius)
        for (let i = 0; i < coords.length; i++) if (errorAt(coords[i]) < errorAt(coords[index])) index = i
        if (errorAt(coords[index]) > 1.5) fail(`${where}: angle label ${printed}° does not sit on any polygon vertex`)
        const vertex = coords[index]
        const measured = angleBetween(vertex, coords[(index + 1) % coords.length], coords[(index - 1 + coords.length) % coords.length])
        if (Math.abs(measured - printed) > 3) fail(`${where}: label ${printed}° is drawn as ${measured.toFixed(1)}°`)
        angleAsserts++
      })

      // (d) printed lengths must share one consistent scale
      const scales: number[] = []
      svg.querySelectorAll('text.l7-geo-side-label').forEach(node => {
        const printed = Number((node.textContent ?? '').replace(/[^\d.]/g, ''))
        if (!Number.isFinite(printed) || printed === 0) return
        const at = { x: Number(node.getAttribute('x')), y: Number(node.getAttribute('y')) }
        const best = nearestSide(at)
        scales.push(distance(best.a, best.b) / printed)
      })
      if (scales.length > 1) {
        const min = Math.min(...scales)
        const max = Math.max(...scales)
        if (max / min > 1.07) fail(`${where}: printed lengths are not drawn to one scale (px per unit ranges ${min.toFixed(1)}–${max.toFixed(1)})`)
        scaleAsserts += scales.length
      }
    })
  })

  // every ledger id must also be present in the rendered DOM, not only in the source file
  const renderedIds = new Set(Array.from(document.querySelectorAll('[data-source-id]'), node => node.getAttribute('data-source-id')))
  for (const element of lessonEightBookElements) {
    if (!renderedIds.has(element.id)) fail(`textbook element "${element.id}" never rendered a data-source-id marker in the DOM`)
  }

  return { figures, parallelAsserts, tickAsserts, angleAsserts, scaleAsserts }
}

const sections = new Set(lessonEightBookElements.map(element => element.section))
console.log(
  `Lesson 8 check passed: ${lessonEightBookElements.length} textbook elements over pages ${lessonEightBookPages.join('، ')} ` +
  `(${lessonEightBookTasks.length} printed tasks + ${lessonEightBookContent.length} printed teaching elements), ` +
  `${mountedIds.size} mounted in the Student Area, ${lessonEightTeacherEntries.length} Teacher entries ` +
  `(${lessonEightTeacherEntries.filter(entry => entry.source.type === 'textbook').length} textbook / ${lessonEightTeacherEntries.filter(entry => entry.source.type === 'platform').length} platform), ` +
  `${sections.size} source sections, ${requiredFigures.length} rebuilt figures, ${requiredInteractions.length} interactive activities, ` +
  `${finalAssessment8.length} brand-new final questions, ${stepIds.length} sequential steps.\n` +
  `Figure accuracy verified on ${figureReport.figures} rendered SVG figures: ${figureReport.parallelAsserts} parallel-mark assertions, ` +
  `${figureReport.tickAsserts} equal-side assertions, ${figureReport.angleAsserts} printed-angle assertions, ${figureReport.scaleAsserts} to-scale length assertions.`,
)
process.exit(0)
