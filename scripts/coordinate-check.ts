import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { BidiText } from '../src/components/BidiText'
import { MathExpression } from '../src/components/MathExpression'
import {
  assertCoordinateConvention,
  classifyCoordinatePoint,
  isOriginPoint,
  isSameOrderedPair,
  parseCoordinateScalar,
  parseOrderedPair,
  pointOnHorizontalAxis,
  pointOnVerticalAxis,
  toSvgPoint,
} from '../src/components/lesson/coordinates'
import { finalAssessment, lessonOneRequiredSolutionIds, lessonOneTeacherEntries } from '../src/teacher/lesson1'
import { lessonTwoTeacherEntries } from '../src/teacher/lesson2'
import { lessonSixTeacherEntries } from '../src/teacher/lesson6'
import { lessonSevenTeacherEntries } from '../src/teacher/lesson7'
import { lessonEightTeacherEntries } from '../src/teacher/lesson8'
import { TeacherLessonView, type TeacherLessonData } from '../src/teacher/TeacherLessonView'
import { TeacherUnitExercisesView } from '../src/teacher/TeacherUnitExercisesView'
import { rectangleAllTeacherEntries } from '../src/lessons/rectangleData'
import { squareAllTeacherEntries } from '../src/lessons/squareData'
import { isLessonOneFinalAnswerCorrect } from '../src/lessons/CoordinatesLesson'

assertCoordinateConvention()

// 1. SVG coordinate mapping: first value -> horizontal X (rightward), second value -> vertical Y (upward)
const origin = { x: 48, y: 304 }
const cell = 42
const checks = [
  [{ x: 0, y: 0 }, { cx: 48, cy: 304 }],
  [{ x: 5, y: 9 }, { cx: 258, cy: -74 }],
  [{ x: 7, y: 1 }, { cx: 342, cy: 262 }],
  [{ x: 5, y: 0 }, { cx: 258, cy: 304 }],
  [{ x: 0, y: 4 }, { cx: 48, cy: 136 }],
] as const
for (const [point, expected] of checks) {
  const actual = toSvgPoint(point, origin, cell)
  assert.deepEqual(actual, expected, `Expected (${point.x},${point.y}) to map to horizontal x and vertical y`)
}

// 2. Exclusive coordinate classification: origin vs horizontal axis vs vertical axis vs plane
assert.equal(isOriginPoint({ x: 0, y: 0 }), true)
assert.equal(pointOnHorizontalAxis({ x: 0, y: 0 }), false, '(0,0) is origin, not a non-origin horizontal-axis point')
assert.equal(pointOnVerticalAxis({ x: 0, y: 0 }), false, '(0,0) is origin, not a non-origin vertical-axis point')
assert.equal(classifyCoordinatePoint({ x: 0, y: 0 }), 'origin')

for (const n of [1, 3, 5, 6]) {
  assert.equal(pointOnHorizontalAxis({ x: n, y: 0 }), true, `(${n},0) must be on horizontal X axis`)
  assert.equal(pointOnVerticalAxis({ x: n, y: 0 }), false, `(${n},0) must not be on vertical Y axis`)
  assert.equal(isOriginPoint({ x: n, y: 0 }), false)
  assert.equal(classifyCoordinatePoint({ x: n, y: 0 }), 'horizontal-axis')

  assert.equal(pointOnVerticalAxis({ x: 0, y: n }), true, `(0,${n}) must be on vertical Y axis`)
  assert.equal(pointOnHorizontalAxis({ x: 0, y: n }), false, `(0,${n}) must not be on horizontal X axis`)
  assert.equal(isOriginPoint({ x: 0, y: n }), false)
  assert.equal(classifyCoordinatePoint({ x: 0, y: n }), 'vertical-axis')
}

for (const interior of [{ x: 3, y: 3 }, { x: 5, y: 9 }, { x: 6, y: 2 }]) {
  assert.equal(classifyCoordinatePoint(interior), 'plane')
  assert.equal(pointOnHorizontalAxis(interior), false)
  assert.equal(pointOnVerticalAxis(interior), false)
  assert.equal(isOriginPoint(interior), false)
}

// 3. Unified ordered-pair parsing & answer validation
assert.deepEqual(parseOrderedPair('(3,5)'), { point: { x: 3, y: 5 } })
assert.deepEqual(parseOrderedPair(' ( 3 ، 5 ) '), { point: { x: 3, y: 5 } })
assert.deepEqual(parseOrderedPair('(٣, ٥)'), { point: { x: 3, y: 5 } })
assert.deepEqual(parseOrderedPair('0,4'), { point: { x: 0, y: 4 } })
assert.deepEqual(parseOrderedPair('D(3,3)'), { point: { x: 3, y: 3 }, label: 'D' })
assert.deepEqual(parseOrderedPair('d = (٣، ٣)'), { point: { x: 3, y: 3 }, label: 'D' })
assert.deepEqual(parseOrderedPair('O(0,0)'), { point: { x: 0, y: 0 }, label: 'O' })

for (const invalid of ['', '33', '40', '(33)', '(3 3)', '3 5', '(3,5', '3,5)', '(3,)', '(,5)', '(1,2,3)', 'D3,3']) {
  assert.equal(parseOrderedPair(invalid), null, `Ambiguous or malformed coordinate "${invalid}" must be rejected`)
}

assert.equal(isSameOrderedPair('(3,5)', '3,5'), true)
assert.equal(isSameOrderedPair('(3، 5)', '3,5'), true)
assert.equal(isSameOrderedPair('(٣, ٥)', { x: 3, y: 5 }), true)
assert.equal(isSameOrderedPair('D(3,3)', 'D(3,3)'), true)
assert.equal(isSameOrderedPair('(3,3)', 'D(3,3)'), true)
assert.equal(isSameOrderedPair('d = (3، 3)', 'D(3,3)'), true)
assert.equal(isSameOrderedPair('O(0,0)', '(0,0)'), true)

assert.equal(isSameOrderedPair('(5,3)', '3,5'), false, 'Swapped coordinates must be rejected')
assert.equal(isSameOrderedPair('(4,0)', '(0,4)'), false, 'Horizontal vs vertical axis points must never match')
assert.equal(isSameOrderedPair('(12,3)', '(1,23)'), false, 'Digit concatenation collisions must never match')
assert.equal(isSameOrderedPair('33', 'D(3,3)'), false, 'Unseparated digits must not match an ordered pair')
assert.equal(isSameOrderedPair('A(3,3)', 'D(3,3)'), false, 'Mismatched point label must be rejected')
assert.equal(isSameOrderedPair('O(3,5)', '3,5'), false, 'Origin label O on non-origin point must be rejected')

assert.equal(parseCoordinateScalar('4'), 4)
assert.equal(parseCoordinateScalar(' ٤ '), 4)
assert.equal(parseCoordinateScalar('8 وحدات'), 8)
assert.equal(parseCoordinateScalar('(8,2)'), null)

// 4. Actual DOM / Bidi rendering checks for Arabic & Latin ordered pairs
function renderDom(node: ReturnType<typeof createElement>): HTMLElement {
  const html = renderToStaticMarkup(node)
  const dom = new JSDOM(`<!doctype html><html lang="ar" dir="rtl"><body>${html}</body></html>`)
  return dom.window.document.body.firstElementChild as HTMLElement
}

function assertBalancedParens(text: string, context: string) {
  const opens = (text.match(/\(/g) ?? []).length
  const closes = (text.match(/\)/g) ?? []).length
  assert.equal(opens, closes, `Unbalanced parentheses in ${context}: ${JSON.stringify(text)}`)
}

// 4a. MathExpression mixed Arabic/numeric pairs: (عدد ، 0) vs (0 ، عدد)
const horizontalRuleEl = renderDom(createElement(MathExpression, null, '(عدد ، 0)'))
const verticalRuleEl = renderDom(createElement(MathExpression, null, '(0 ، عدد)'))
assert.equal(horizontalRuleEl.getAttribute('dir'), 'ltr')
assert.equal(verticalRuleEl.getAttribute('dir'), 'ltr')
assert.notEqual(horizontalRuleEl.innerHTML, verticalRuleEl.innerHTML, '(عدد, 0) and (0, عدد) must not render identically')
const horizBdi = Array.from(horizontalRuleEl.querySelectorAll('bdi')).map((el) => el.textContent)
const vertBdi = Array.from(verticalRuleEl.querySelectorAll('bdi')).map((el) => el.textContent)
assert.deepEqual(horizBdi, ['عدد', '0'], 'Horizontal axis form (عدد, 0) must isolate first="عدد" then second="0" in LTR order')
assert.deepEqual(vertBdi, ['0', 'عدد'], 'Vertical axis form (0, عدد) must isolate first="0" then second="عدد" in LTR order')

// Pure ASCII math expressions remain untouched
const pureMathEl = renderDom(createElement(MathExpression, null, '(5,0)'))
assert.equal(pureMathEl.textContent, '(5,0)')
assert.equal(pureMathEl.querySelectorAll('bdi').length, 0)

// 4b. BidiText mixed & Latin ordered pairs and parenthetical balance
const fridayPairEl = renderDom(createElement(BidiText, null, 'تمثّل هذه النقطة الزوج المرتب (الجمعة، 17)، أي 17 درجة.'))
assert.equal(fridayPairEl.getAttribute('dir'), 'rtl')
const fridayLtrSpans = Array.from(fridayPairEl.querySelectorAll('span[dir="ltr"]'))
for (const span of fridayLtrSpans) assertBalancedParens(span.textContent ?? '', 'BidiText (الجمعة، 17) LTR span')
const fridayBdi = Array.from(fridayPairEl.querySelectorAll('bdi')).map((el) => el.textContent)
assert.deepEqual(fridayBdi, ['الجمعة', '17'], 'BidiText must isolate (الجمعة, 17) in left-to-right (time, data) order without splitting parentheses')

const symbolicPairEl = renderDom(createElement(BidiText, null, 'في الزوج المرتب (x,y)، يمثّل العدد الأول الحركة الأفقية.'))
const symbolicLtr = Array.from(symbolicPairEl.querySelectorAll('span[dir="ltr"]')).map((el) => el.textContent)
assert.ok(symbolicLtr.includes('(x,y)'), `Expected BidiText to keep "(x,y)" intact in a single LTR span, got ${JSON.stringify(symbolicLtr)}`)

const calcPairsEl = renderDom(createElement(BidiText, null, 'O(0,0) → (0 + 5, 0 + 2) = (5,2) ومنتصف AD = ((2 + 3)/2, (1 + 3)/2) = (2.5,2).'))
const calcLtr = Array.from(calcPairsEl.querySelectorAll('span[dir="ltr"]')).map((el) => el.textContent ?? '')
for (const token of calcLtr) assertBalancedParens(token, 'BidiText coordinate calculation')
for (const expectedToken of ['O(0,0)', '(0 + 5, 0 + 2)', '(5,2)', '((2 + 3)/2, (1 + 3)/2)', '(2.5,2)']) {
  assert.ok(calcLtr.includes(expectedToken), `Expected BidiText LTR spans to include ${expectedToken}, got ${JSON.stringify(calcLtr)}`)
}

const arabicProseParensEl = renderDom(createElement(BidiText, null, '(المطروح منه) في الأعلى، وتنخفض تدريجياً (18 إلى 17 إلى 16).'))
for (const span of Array.from(arabicProseParensEl.querySelectorAll('span[dir="ltr"]'))) {
  assertBalancedParens(span.textContent ?? '', 'BidiText Arabic prose parenthetical')
  assert.ok(!/[\u0600-\u06FF]/u.test(span.textContent ?? ''), 'Pure Arabic parenthetical must not be marked dir="ltr"')
}

// 4c. TeacherLessonView & TeacherUnitExercisesView regression: combining hats (\u0302), rays/segments ([BC), [AB]), and ordered pairs
function assertNoSplitCombiningOrGeometryInDom(root: HTMLElement, context: string) {
  const doc = root.ownerDocument
  const walker = doc.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */)
  let current = walker.nextNode()
  while (current) {
    const val = current.nodeValue ?? ''
    assert.ok(!/^[\u0300-\u036f]/u.test(val), `Detached leading combining mark in ${context} text node: ${JSON.stringify(val)}`)
    const hatCount = (val.match(/\u0302/gu) ?? []).length
    const attachedHatCount = (val.match(/[A-Za-z]\u0302/gu) ?? []).length
    assert.equal(hatCount, attachedHatCount, `Unattached U+0302 in ${context} text node: ${JSON.stringify(val)}`)
    current = walker.nextNode()
  }
  for (const span of Array.from(root.querySelectorAll('span[dir="ltr"]'))) {
    const txt = span.textContent ?? ''
    const opens = (txt.match(/[\[(]/g) ?? []).length
    const closes = (txt.match(/[\])]/g) ?? []).length
    assert.equal(opens, closes, `Unbalanced bracket/paren delimiter in ${context} LTR span: ${JSON.stringify(txt)}`)
  }
  for (const bidiRoot of Array.from(root.querySelectorAll('span[dir="rtl"]'))) {
    const children = Array.from(bidiRoot.children) as HTMLElement[]
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.getAttribute('dir') === 'ltr') continue
      const txt = child.textContent ?? ''
      const next = children[i + 1]
      const prev = children[i - 1]
      if (next?.getAttribute('dir') === 'ltr' && /^[A-Za-zÂĈÊÎÔÛŴŶẐâĉêîôûŵŷẑ]/u.test(next.textContent ?? '')) {
        assert.ok(!txt.endsWith('['), `Split opening "[" before LTR vertex run "${next.textContent}" in ${context}: ${bidiRoot.textContent}`)
      }
      if (prev?.getAttribute('dir') === 'ltr' && /[A-Za-zÂĈÊÎÔÛŴŶẐâĉêîôûŵŷẑ][\u0300-\u036f]*$/u.test(prev.textContent ?? '')) {
        assert.ok(!txt.startsWith(']'), `Split closing "]" after LTR vertex run "${prev.textContent}" in ${context}: ${bidiRoot.textContent}`)
      }
    }
  }
}

const auditedTeacherLessons: TeacherLessonData[] = [
  { lessonId: 'coordinates', lessonTitle: 'شبكة الإحداثيات', entries: lessonOneTeacherEntries },
  { lessonId: 'line-graphs', lessonTitle: 'التمثيلات البيانية بالخطوط', entries: lessonTwoTeacherEntries },
  { lessonId: 'angle-measurement', lessonTitle: 'قياس الزوايا', entries: lessonSixTeacherEntries },
  { lessonId: 'parallelogram', lessonTitle: 'متوازي الأضلاع', entries: lessonSevenTeacherEntries },
  { lessonId: 'rhombus', lessonTitle: 'المعيّن', entries: lessonEightTeacherEntries },
  { lessonId: 'rectangle', lessonTitle: 'المستطيل', entries: rectangleAllTeacherEntries },
  { lessonId: 'square', lessonTitle: 'المربّع', entries: squareAllTeacherEntries },
]

const renderedTeacherById = new Map<string, HTMLElement>()
for (const lesson of auditedTeacherLessons) {
  const el = renderDom(createElement(TeacherLessonView, { lesson }))
  assertNoSplitCombiningOrGeometryInDom(el, `TeacherLessonView(${lesson.lessonId})`)
  renderedTeacherById.set(lesson.lessonId, el)
}
const unitExTeacherEl = renderDom(createElement(TeacherUnitExercisesView))
assertNoSplitCombiningOrGeometryInDom(unitExTeacherEl, 'TeacherUnitExercisesView')

function ltrTokensIn(container: Element | null): string[] {
  assert.ok(container, 'Expected TeacherLessonView section container to exist')
  return Array.from(container.querySelectorAll('span[dir="ltr"]')).map((el) => el.textContent ?? '')
}

// Explicit check of D̂ = 130°, B̂, M̂, P̂, K̂, Ŷ, [BC), [AB], ŜQB, Â, Ĉ in TeacherLessonView reasoning & note
const rhombusView = renderedTeacherById.get('rhombus')!
const angleDCard = rhombusView.querySelector('[data-source-id="l8-p37-check3-angle-d"]')!
const angleDReasoningFinalLi = Array.from(angleDCard.querySelectorAll('ol li')).find((li) => (li.textContent ?? '').includes('D\u0302 = 130°'))
assert.ok(angleDReasoningFinalLi, 'Expected rhombus l8-p37-check3-angle-d reasoning to include "D̂ = 130°"')
const angleDFinalLtrSpans = Array.from(angleDReasoningFinalLi.querySelectorAll('span[dir="ltr"]'))
const dHatSpan = angleDFinalLtrSpans.find((el) => el.textContent === 'D\u0302')
assert.ok(dHatSpan, 'Expected "D̂" in "D̂ = 130°" to be isolated intact inside a single LTR span')
assert.equal(dHatSpan.childNodes.length, 1, 'Expected "D̂" span to hold a single text node keeping D and U+0302 attached')
assert.equal(dHatSpan.firstChild?.nodeValue, 'D\u0302')
assert.ok(angleDFinalLtrSpans.some((el) => el.textContent === '130°'), 'Expected "130°" in "D̂ = 130°" to be isolated intact')
assert.ok(ltrTokensIn(angleDCard.querySelector('ol')).includes('B\u0302'), 'Expected rhombus reasoning to keep B̂ intact')
for (const expectedNoteSym of ['D\u0302', 'B\u0302', 'Â']) {
  assert.ok(ltrTokensIn(angleDCard.querySelector('.teacher-note')).includes(expectedNoteSym), `Expected rhombus note to keep ${expectedNoteSym} intact`)
}

const rhombusFinal3Ltr = ltrTokensIn(rhombusView.querySelector('[data-source-id="l8-final-3"] ol'))
assert.ok(rhombusFinal3Ltr.includes('M\u0302') && rhombusFinal3Ltr.includes('P\u0302'), 'Expected rhombus l8-final-3 reasoning to keep M̂ and P̂ intact')
const rhombusFinal4Ltr = ltrTokensIn(rhombusView.querySelector('[data-source-id="l8-final-4"] ol'))
assert.ok(rhombusFinal4Ltr.includes('K\u0302') && rhombusFinal4Ltr.includes('M\u0302'), 'Expected rhombus l8-final-4 reasoning to keep K̂ and M̂ intact')

const squareView = renderedTeacherById.get('square')!
assert.ok(ltrTokensIn(squareView.querySelector('[data-source-id="t-sq-p84-ex2-z"] ol')).includes('Y\u0302'), 'Expected square reasoning to keep Ŷ intact')
const sqStep5NoteLtr = ltrTokensIn(squareView.querySelector('[data-source-id="t-sq-p83-step-5"] .teacher-note'))
for (const sym of ['[AB]', '[AD]', 'D\u0302', 'Ĉ']) {
  assert.ok(sqStep5NoteLtr.includes(sym), `Expected square note to keep ${sym} intact`)
}

const rectView = renderedTeacherById.get('rectangle')!
const rectAngleLabCard = rectView.querySelector('[data-source-id="t-rect-platform-angle-lab"]')!
for (const sym of ['D\u0302', 'B\u0302', 'Â', 'Ĉ']) {
  assert.ok(ltrTokensIn(rectAngleLabCard.querySelector('ol')).includes(sym), `Expected rectangle reasoning to keep ${sym} intact`)
  assert.ok(ltrTokensIn(rectAngleLabCard.querySelector('.teacher-note')).includes(sym), `Expected rectangle note to keep ${sym} intact`)
}
for (const sym of ['[AB]', '[DC]']) {
  assert.ok(ltrTokensIn(rectView.querySelector('[data-source-id="t-rect-p79-construction-step2"] .teacher-note')).includes(sym), `Expected rectangle note to keep ${sym} intact`)
}

const anglesView = renderedTeacherById.get('angle-measurement')!
assert.ok(ltrTokensIn(anglesView.querySelector('[data-source-id="l6-p26-draw-steps"] ol')).includes('[BC)'), 'Expected angles reasoning to keep ray [BC) intact in a single LTR span')
assert.ok(ltrTokensIn(anglesView.querySelector('[data-source-id="l6-p26-draw-example"] ol')).includes('[BC)'), 'Expected angles example reasoning to keep ray [BC) intact')
const allAnglesLtr = ltrTokensIn(anglesView)
for (const sym of ['[AB)', '[AC)', 'S\u0302QB', 'K\u0302LM', '∠BAC']) {
  assert.ok(allAnglesLtr.includes(sym), `Expected angle-measurement TeacherLessonView to keep ${sym} intact`)
}

// Re-verify ordered pairs inside TeacherLessonView (both real lessons and combined geometry + mixed ordered pairs in reasoning/note)
const coordsView = renderedTeacherById.get('coordinates')!
for (const pairToken of ['O(0,0)', '(5,0)', '(0,4)', '(x,y)', '(9,5)', '(5,9)']) {
  assert.ok(ltrTokensIn(coordsView.querySelector('[data-source-id="source-map"] ol, .teacher-entries')).length > 0)
  assert.ok(ltrTokensIn(coordsView).includes(pairToken), `Expected coordinates TeacherLessonView to keep ${pairToken} intact`)
}
const lineGraphsFridayBdi = Array.from(
  renderedTeacherById.get('line-graphs')!.querySelectorAll('[data-source-id="lg-p8-example"] span[dir="ltr"] bdi'),
).map((el) => el.textContent)
assert.deepEqual(lineGraphsFridayBdi, ['الجمعة', '17'], 'Expected line-graphs TeacherLessonView to keep (الجمعة، 17) isolated in LTR order')

const combinedLessonView = renderDom(
  createElement(TeacherLessonView, {
    lesson: {
      lessonId: 'combined-regression',
      lessonTitle: 'اختبار تكاملي',
      entries: [
        {
          id: 'combo-1',
          title: 'رموز هندسية مع أزواج مرتبة مختلطة',
          prompt: 'قارن [BC) مع الزوج (الجمعة، 17).',
          answer: 'D̂ = 130° عند (عدد, 0).',
          source: { type: 'platform' },
          reasoning: [
            'الإجابة النهائية: D̂ = 130°، مع B̂ وM̂ وP̂ وK̂ وŶ على الشعاع [BC) والقطعة [AB] والزاوية ∠HUR.',
            'المحور الأفقي (عدد, 0) والمحور الشاقولي (0, عدد) والزوج (الجمعة، 17) والقالب (الأفقي، الشاقولي) والرمز (x,y).',
          ],
          note: 'ملاحظة: في D̂ = 130° وشعاع [BC) والقطعة [AB] يبقى الزوج (الجمعة، 17) والزوج (0, عدد) معزولين دون كسر القبعة.',
        },
      ],
    },
  }),
)
assertNoSplitCombiningOrGeometryInDom(combinedLessonView, 'TeacherLessonView(combined-regression)')
const comboReasoningLtr = ltrTokensIn(combinedLessonView.querySelector('ol'))
for (const sym of ['D\u0302', '130°', 'B\u0302', 'M\u0302', 'P\u0302', 'K\u0302', 'Y\u0302', '[BC)', '[AB]', '∠HUR', '(x,y)']) {
  assert.ok(comboReasoningLtr.includes(sym), `Combined reasoning must keep ${sym} intact`)
}
const comboReasoningBdi = Array.from(combinedLessonView.querySelectorAll('ol span[dir="ltr"] bdi')).map((el) => el.textContent)
assert.deepEqual(comboReasoningBdi, ['عدد', '0', '0', 'عدد', 'الجمعة', '17', 'الأفقي', 'الشاقولي'])
const comboNoteLtr = ltrTokensIn(combinedLessonView.querySelector('.teacher-note'))
for (const sym of ['D\u0302', '130°', '[BC)', '[AB]']) {
  assert.ok(comboNoteLtr.includes(sym), `Combined note must keep ${sym} intact`)
}
const comboNoteBdi = Array.from(combinedLessonView.querySelectorAll('.teacher-note span[dir="ltr"] bdi')).map((el) => el.textContent)
assert.deepEqual(comboNoteBdi, ['الجمعة', '17', '0', 'عدد'])

// 5. Lesson 1 FinalTest answer checker & teacher solution coverage
assert.equal(isLessonOneFinalAnswerCorrect('final-1', '(3,5)', '3,5'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-1', '(3، 5)', '3,5'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-1', '(٣, ٥)', '3,5'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-1', '(5,3)', '3,5'), false)
assert.equal(isLessonOneFinalAnswerCorrect('final-1', '35', '3,5'), false)

assert.equal(isLessonOneFinalAnswerCorrect('final-2', '(0,4)', '0,4'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-2', '(0، 6)', '0,4'), true, 'Any non-origin vertical-axis point (0, n) with n > 0 must be accepted')
assert.equal(isLessonOneFinalAnswerCorrect('final-2', '(٠, ١)', '0,4'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-2', '(0,0)', '0,4'), false, 'Origin (0,0) must not be accepted as a non-origin vertical-axis point')
assert.equal(isLessonOneFinalAnswerCorrect('final-2', 'O(0,0)', '0,4'), false)
assert.equal(isLessonOneFinalAnswerCorrect('final-2', '(4,0)', '0,4'), false, 'Horizontal-axis point (4,0) must be rejected when vertical axis is requested')
assert.equal(isLessonOneFinalAnswerCorrect('final-2', '04', '0,4'), false)

assert.equal(isLessonOneFinalAnswerCorrect('final-3', '8', '8'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-3', '٨ وحدات', '8'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-3', '2', '8'), false)

assert.equal(isLessonOneFinalAnswerCorrect('final-4', 'أفقي ثم شاقولي', 'أفقي ثم شاقولي'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-4', 'المحور الأفقي أولاً ثم المحور الشاقولي', 'أفقي ثم شاقولي'), true)
assert.equal(isLessonOneFinalAnswerCorrect('final-4', 'شاقولي ثم أفقي', 'أفقي ثم شاقولي'), false)

for (const id of lessonOneRequiredSolutionIds) {
  if (!lessonOneTeacherEntries.some((entry) => entry.id === id)) throw new Error(`Missing teacher solution for ${id}`)
}
for (const question of finalAssessment) {
  if (!lessonOneTeacherEntries.some((entry) => entry.id === question.id)) throw new Error(`Missing final-test solution for ${question.id}`)
}

console.log('Coordinate convention, axis classification, answer parsing, and Bidi ordered-pair DOM checks passed.')
