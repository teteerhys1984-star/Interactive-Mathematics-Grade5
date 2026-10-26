export interface Point {
  /** The first value in an ordered pair: horizontal X coordinate. */
  x: number
  /** The second value in an ordered pair: vertical Y coordinate. */
  y: number
}

export interface SvgPoint { cx: number; cy: number }

export type CoordinateLocation = 'origin' | 'horizontal-axis' | 'vertical-axis' | 'plane'

export interface ParsedOrderedPair {
  point: Point
  label?: string
}

const NAMED_OR_PAREN_PAIR_RE = /^(?:([A-Za-z])\s*(?:[:=]\s*)?)?\(\s*([+-]?\d+(?:\.\d+)?)\s*[,،]\s*([+-]?\d+(?:\.\d+)?)\s*\)$/u
const BARE_PAIR_RE = /^([+-]?\d+(?:\.\d+)?)\s*[,،]\s*([+-]?\d+(?:\.\d+)?)$/u

/** Converts mathematical coordinates to SVG pixels without swapping axes. */
export function toSvgPoint(point: Point, origin: { x: number; y: number }, cellSize: number): SvgPoint {
  return { cx: origin.x + point.x * cellSize, cy: origin.y - point.y * cellSize }
}

/** (0, 0) is the origin where both axes intersect. */
export function isOriginPoint(point: Point): boolean {
  return point.x === 0 && point.y === 0
}

/** (n, 0) lies on the horizontal X axis when n !== 0; (0, 0) is the origin. */
export function pointOnHorizontalAxis(point: Point): boolean {
  return point.x !== 0 && point.y === 0
}

/** (0, n) lies on the vertical Y axis when n !== 0; (0, 0) is the origin. */
export function pointOnVerticalAxis(point: Point): boolean {
  return point.x === 0 && point.y !== 0
}

export function classifyCoordinatePoint(point: Point): CoordinateLocation {
  if (isOriginPoint(point)) return 'origin'
  if (pointOnHorizontalAxis(point)) return 'horizontal-axis'
  if (pointOnVerticalAxis(point)) return 'vertical-axis'
  return 'plane'
}

export function normalizeCoordinateDigits(value: string): string {
  return value
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/gu, '')
    .normalize('NFKC')
    .replace(/[٠-٩]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0x0660 + 0x0030))
    .replace(/[۰-۹]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0x06f0 + 0x0030))
    .replace(/−/gu, '-')
}

/** Parses an ordered pair (x, y) while preserving (horizontal, vertical) order and rejecting ambiguous inputs. */
export function parseOrderedPair(raw: string): ParsedOrderedPair | null {
  const text = normalizeCoordinateDigits(raw).trim()
  if (!text) return null
  const parenMatch = text.match(NAMED_OR_PAREN_PAIR_RE)
  const bareMatch = parenMatch ? null : text.match(BARE_PAIR_RE)
  const xRaw = parenMatch ? parenMatch[2] : bareMatch?.[1]
  const yRaw = parenMatch ? parenMatch[3] : bareMatch?.[2]
  if (xRaw === undefined || yRaw === undefined) return null
  const xNum = Number(xRaw)
  const yNum = Number(yRaw)
  if (!Number.isFinite(xNum) || !Number.isFinite(yNum)) return null
  const point: Point = { x: xNum === 0 ? 0 : xNum, y: yNum === 0 ? 0 : yNum }
  const label = parenMatch?.[1]?.toUpperCase()
  return label ? { point, label } : { point }
}

/** Compares a student ordered-pair answer against an expected Point or pair string without formatting false negatives. */
export function isSameOrderedPair(studentInput: string, expected: Point | string): boolean {
  const actual = parseOrderedPair(studentInput)
  if (!actual) return false
  const expectedParsed = typeof expected === 'string' ? parseOrderedPair(expected) : { point: expected }
  if (!expectedParsed) return false
  if (actual.point.x !== expectedParsed.point.x || actual.point.y !== expectedParsed.point.y) return false
  if (expectedParsed.label) {
    return !actual.label || actual.label === expectedParsed.label
  }
  if (!actual.label) return true
  return isOriginPoint(expectedParsed.point) && actual.label === 'O'
}

/** Parses a single numeric coordinate or step count (accepting Arabic-Indic digits and optional unit words). */
export function parseCoordinateScalar(raw: string): number | null {
  const cleaned = normalizeCoordinateDigits(raw)
    .replace(/(?:وحدات|وحدة|وحدتين)/gu, '')
    .trim()
  if (!/^[+-]?\d+(?:\.\d+)?$/u.test(cleaned)) return null
  const value = Number(cleaned)
  if (!Number.isFinite(value)) return null
  return value === 0 ? 0 : value
}

/** Small, dependency-free guard for the project's coordinate convention. */
export function assertCoordinateConvention() {
  const origin = { x: 48, y: 304 }
  const cell = 42
  const cases: Array<[Point, SvgPoint]> = [
    [{ x: 0, y: 0 }, { cx: 48, cy: 304 }],
    [{ x: 5, y: 9 }, { cx: 258, cy: -74 }],
    [{ x: 7, y: 1 }, { cx: 342, cy: 262 }],
    [{ x: 5, y: 0 }, { cx: 258, cy: 304 }],
    [{ x: 0, y: 4 }, { cx: 48, cy: 136 }],
  ]
  for (const [point, expected] of cases) {
    const actual = toSvgPoint(point, origin, cell)
    if (actual.cx !== expected.cx || actual.cy !== expected.cy) throw new Error(`Coordinate mapping swapped for (${point.x},${point.y})`)
  }
  if (!isOriginPoint({ x: 0, y: 0 }) || classifyCoordinatePoint({ x: 0, y: 0 }) !== 'origin') {
    throw new Error('(0,0) must be classified as origin')
  }
  if (pointOnHorizontalAxis({ x: 0, y: 0 }) || pointOnVerticalAxis({ x: 0, y: 0 })) {
    throw new Error('(0,0) is the origin and must not be classified as a non-origin single-axis point')
  }
  if (!pointOnHorizontalAxis({ x: 5, y: 0 }) || pointOnVerticalAxis({ x: 5, y: 0 }) || classifyCoordinatePoint({ x: 5, y: 0 }) !== 'horizontal-axis') {
    throw new Error('(n,0) for n !== 0 must lie exclusively on the horizontal axis')
  }
  if (!pointOnVerticalAxis({ x: 0, y: 4 }) || pointOnHorizontalAxis({ x: 0, y: 4 }) || classifyCoordinatePoint({ x: 0, y: 4 }) !== 'vertical-axis') {
    throw new Error('(0,n) for n !== 0 must lie exclusively on the vertical axis')
  }
  if (classifyCoordinatePoint({ x: 5, y: 9 }) !== 'plane') {
    throw new Error('(5,9) must be classified as an interior plane point')
  }
}
