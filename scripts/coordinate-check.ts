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
