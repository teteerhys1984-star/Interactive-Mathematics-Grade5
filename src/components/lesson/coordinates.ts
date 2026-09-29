export interface Point {
  /** The first value in an ordered pair: horizontal X coordinate. */
  x: number
  /** The second value in an ordered pair: vertical Y coordinate. */
  y: number
}

export interface SvgPoint { cx: number; cy: number }

/** Converts mathematical coordinates to SVG pixels without swapping axes. */
export function toSvgPoint(point: Point, origin: { x: number; y: number }, cellSize: number): SvgPoint {
  return { cx: origin.x + point.x * cellSize, cy: origin.y - point.y * cellSize }
}

export function pointOnHorizontalAxis(point: Point) { return point.y === 0 }
export function pointOnVerticalAxis(point: Point) { return point.x === 0 }

/** Small, dependency-free guard for the project's coordinate convention. */
export function assertCoordinateConvention() {
  const origin = { x: 48, y: 304 }
  const cell = 42
  const cases: Array<[Point, SvgPoint]> = [
    [{ x: 5, y: 9 }, { cx: 258, cy: -74 }],
    [{ x: 7, y: 1 }, { cx: 342, cy: 262 }],
    [{ x: 5, y: 0 }, { cx: 258, cy: 304 }],
    [{ x: 0, y: 4 }, { cx: 48, cy: 136 }],
  ]
  for (const [point, expected] of cases) {
    const actual = toSvgPoint(point, origin, cell)
    if (actual.cx !== expected.cx || actual.cy !== expected.cy) throw new Error(`Coordinate mapping swapped for (${point.x},${point.y})`)
  }
  if (!pointOnHorizontalAxis({ x: 5, y: 0 }) || !pointOnVerticalAxis({ x: 0, y: 4 })) throw new Error('Axis convention is invalid')
}
