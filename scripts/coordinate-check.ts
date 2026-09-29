import { assertCoordinateConvention, pointOnHorizontalAxis, pointOnVerticalAxis, toSvgPoint } from '../src/components/lesson/coordinates'
import { finalAssessment, lessonOneTeacherEntries } from '../src/teacher/lesson1'

assertCoordinateConvention()
const origin = { x: 48, y: 304 }
const cell = 42
const checks = [
  [{ x: 5, y: 9 }, { cx: 258, cy: -74 }],
  [{ x: 7, y: 1 }, { cx: 342, cy: 262 }],
  [{ x: 5, y: 0 }, { cx: 258, cy: 304 }],
  [{ x: 0, y: 4 }, { cx: 48, cy: 136 }],
] as const
for (const [point, expected] of checks) {
  const actual = toSvgPoint(point, origin, cell)
  if (actual.cx !== expected.cx || actual.cy !== expected.cy) throw new Error(`Expected (${point.x},${point.y}) to map to horizontal x and vertical y`)
}
if (!pointOnHorizontalAxis({ x: 5, y: 0 })) throw new Error('(5,0) must be on horizontal X axis')
if (!pointOnVerticalAxis({ x: 0, y: 4 })) throw new Error('(0,4) must be on vertical Y axis')
for (const question of finalAssessment) if (!lessonOneTeacherEntries.some(entry => entry.id === question.id)) throw new Error(`Missing teacher solution for ${question.id}`)
console.log('Coordinate convention checks passed: first value is horizontal X; second value is vertical Y.')
