/**
 * Unit 2 · Lesson 5 — «الكسور (2)» (textbook pages 58–61).
 *
 * Pure, exact, integer-only helpers and the printed book items with their answer keys.
 * Every answer is derived here from the integer rules, never typed by hand in the UI.
 * Printed text is copied from the book pages; platform-authored items are marked `source: 'platform'`.
 */

export interface Fraction { numerator: number; denominator: number }
export interface MixedNumber { whole: number; numerator: number; denominator: number }

export type FractionKind = 'proper' | 'equal-one' | 'improper' | 'whole'

/** Splits a positive integer ratio n/d into quotient and remainder (d > 0, n >= 0). */
export function divideWithRemainder(numerator: number, denominator: number): { quotient: number; remainder: number } {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new RangeError('divideWithRemainder expects a non-negative integer and a positive integer denominator')
  }
  return { quotient: Math.floor(numerator / denominator), remainder: numerator % denominator }
}

/** Converts an improper fraction n/d (n >= d) to a mixed number. Proper fractions return whole 0. */
export function toMixed(fraction: Fraction): MixedNumber {
  const { quotient, remainder } = divideWithRemainder(fraction.numerator, fraction.denominator)
  return { whole: quotient, numerator: remainder, denominator: fraction.denominator }
}

/** Converts a mixed number w n/d to an ordinary fraction (w·d + n)/d. */
export function toImproper(mixed: MixedNumber): Fraction {
  if (![mixed.whole, mixed.numerator, mixed.denominator].every(Number.isSafeInteger)) throw new RangeError('non-integer mixed number')
  if (mixed.whole < 0 || mixed.numerator < 0 || mixed.numerator >= mixed.denominator || mixed.denominator <= 0) {
    throw new RangeError('a mixed number needs 0 ≤ numerator < denominator and a positive denominator')
  }
  return { numerator: mixed.whole * mixed.denominator + mixed.numerator, denominator: mixed.denominator }
}

/** Classifies an ordinary fraction against 1 without floating-point comparison. */
export function classifyFraction(fraction: Fraction): FractionKind {
  if (fraction.numerator < fraction.denominator) return 'proper'
  if (fraction.numerator === fraction.denominator) return 'equal-one'
  return fraction.numerator % fraction.denominator === 0 ? 'whole' : 'improper'
}

export function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(left)
  let b = Math.abs(right)
  while (b !== 0) [a, b] = [b, a % b]
  return a
}

export function reduce(fraction: Fraction): Fraction {
  const divisor = greatestCommonDivisor(fraction.numerator, fraction.denominator) || 1
  return { numerator: fraction.numerator / divisor, denominator: fraction.denominator / divisor }
}

/** Exact equality of two ordinary fractions by cross multiplication (BigInt avoids overflow). */
export function sameValue(left: Fraction, right: Fraction): boolean {
  return BigInt(left.numerator) * BigInt(right.denominator) === BigInt(right.numerator) * BigInt(left.denominator)
}

export function formatMixed(mixed: MixedNumber): string {
  return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`
}
export function formatFraction(fraction: Fraction): string {
  return `${fraction.numerator}/${fraction.denominator}`
}

/* ────────────────────────── Textbook items ────────────────────────── */

export type ItemKind = 'classify' | 'to-mixed' | 'to-improper'
export interface BookItem {
  id: string
  page: number
  label: string
  kind: ItemKind
  /** ordinary: a/b as printed; mixed: w a/b as printed. */
  printed: string
  /** Expected answer, derived with the helpers above. */
  expected: string
  source: 'textbook' | 'platform'
}

const frac = (numerator: number, denominator: number): Fraction => ({ numerator, denominator })

/** Page 60 — «حدّد فيما إذا كان كل كسر ... عادياً أو مركباً» (printed exercise 1). */
export const classifyItems: BookItem[] = [
  { id: 'b60-1-a', page: 60, label: 'أ', kind: 'classify', printed: '8/79', expected: 'ordinary', source: 'textbook' },
  { id: 'b60-1-b', page: 60, label: 'ب', kind: 'classify', printed: '99/9999', expected: 'ordinary', source: 'textbook' },
  { id: 'b60-1-c', page: 60, label: 'ج', kind: 'classify', printed: '11 45/100', expected: 'mixed', source: 'textbook' },
  { id: 'b60-1-d', page: 60, label: 'د', kind: 'classify', printed: '1/5', expected: 'ordinary', source: 'textbook' },
  { id: 'b60-1-e', page: 60, label: 'هـ', kind: 'classify', printed: '4925 3/8', expected: 'mixed', source: 'textbook' },
  { id: 'b60-1-f', page: 60, label: 'و', kind: 'classify', printed: '11/9', expected: 'ordinary', source: 'textbook' },
  { id: 'b60-1-g', page: 60, label: 'ز', kind: 'classify', printed: '55/888', expected: 'ordinary', source: 'textbook' },
  { id: 'b60-1-h', page: 60, label: 'ح', kind: 'classify', printed: '5/1', expected: 'ordinary', source: 'textbook' },
  { id: 'b60-1-i', page: 60, label: 'ط', kind: 'classify', printed: '8/9', expected: 'ordinary', source: 'textbook' },
  { id: 'b60-1-j', page: 60, label: 'ي', kind: 'classify', printed: '547/548', expected: 'ordinary', source: 'textbook' },
]

/** Page 59 — «تحقق من فهمك» (classification of the ten printed items). */
export const checkClassifyItems: BookItem[] = [
  { id: 'b59-c-a', page: 59, label: 'أ', kind: 'classify', printed: '1/10', expected: 'ordinary', source: 'textbook' },
  { id: 'b59-c-b', page: 59, label: 'ب', kind: 'classify', printed: '11/4', expected: 'ordinary', source: 'textbook' },
  { id: 'b59-c-c', page: 59, label: 'ج', kind: 'classify', printed: '30 2/9', expected: 'mixed', source: 'textbook' },
  { id: 'b59-c-d', page: 59, label: 'د', kind: 'classify', printed: '55/5', expected: 'ordinary', source: 'textbook' },
  { id: 'b59-c-e', page: 59, label: 'هـ', kind: 'classify', printed: '0/5', expected: 'ordinary', source: 'textbook' },
  { id: 'b59-c-f', page: 59, label: 'و', kind: 'classify', printed: '10/5', expected: 'ordinary', source: 'textbook' },
  { id: 'b59-c-g', page: 59, label: 'ز', kind: 'classify', printed: '44/444', expected: 'ordinary', source: 'textbook' },
  // The printed item «5» is a whole number. It is written 5/1 as an ordinary fraction, so it is not a mixed fraction.
  { id: 'b59-c-h', page: 59, label: 'ح', kind: 'classify', printed: '5', expected: 'ordinary', source: 'textbook' },
  { id: 'b59-c-i', page: 59, label: 'ط', kind: 'classify', printed: '1/7', expected: 'ordinary', source: 'textbook' },
  { id: 'b59-c-j', page: 59, label: 'ي', kind: 'classify', printed: '42 8/11', expected: 'mixed', source: 'textbook' },
]

/** Page 60 — «تحقق من فهمك»: write each printed ordinary fraction as a mixed number. */
export const checkToMixedItems: BookItem[] = [
  { id: 'b60-m-a', page: 60, label: 'أ', kind: 'to-mixed', printed: '11/4', expected: '2 3/4', source: 'textbook' },
  { id: 'b60-m-b', page: 60, label: 'ب', kind: 'to-mixed', printed: '61/56', expected: '1 5/56', source: 'textbook' },
  { id: 'b60-m-c', page: 60, label: 'ج', kind: 'to-mixed', printed: '11/5', expected: '2 1/5', source: 'textbook' },
  { id: 'b60-m-d', page: 60, label: 'د', kind: 'to-mixed', printed: '19/3', expected: '6 1/3', source: 'textbook' },
]

/** Page 60 — «تحقق من فهمك»: write each printed mixed number as an ordinary fraction. */
export const checkToImproperItems: BookItem[] = [
  { id: 'b60-i-a', page: 60, label: 'أ', kind: 'to-improper', printed: '3 1/4', expected: '13/4', source: 'textbook' },
  { id: 'b60-i-b', page: 60, label: 'ب', kind: 'to-improper', printed: '8 2/5', expected: '42/5', source: 'textbook' },
  { id: 'b60-i-c', page: 60, label: 'ج', kind: 'to-improper', printed: '20 7/10', expected: '207/10', source: 'textbook' },
  { id: 'b60-i-d', page: 60, label: 'د', kind: 'to-improper', printed: '100 5/9', expected: '905/9', source: 'textbook' },
]

/** Page 61 — exercise 2: ordinary → mixed (printed order a…ي). */
export const exerciseTwoItems: BookItem[] = [
  { id: 'b61-2-a', page: 61, label: 'أ', kind: 'to-mixed', printed: '6/4', expected: '1 2/4', source: 'textbook' },
  { id: 'b61-2-b', page: 61, label: 'ب', kind: 'to-mixed', printed: '7/5', expected: '1 2/5', source: 'textbook' },
  { id: 'b61-2-c', page: 61, label: 'ج', kind: 'to-mixed', printed: '89/6', expected: '14 5/6', source: 'textbook' },
  { id: 'b61-2-d', page: 61, label: 'د', kind: 'to-mixed', printed: '100/3', expected: '33 1/3', source: 'textbook' },
  { id: 'b61-2-e', page: 61, label: 'هـ', kind: 'to-mixed', printed: '14/4', expected: '3 2/4', source: 'textbook' },
  { id: 'b61-2-f', page: 61, label: 'و', kind: 'to-mixed', printed: '48/7', expected: '6 6/7', source: 'textbook' },
  { id: 'b61-2-g', page: 61, label: 'ز', kind: 'to-mixed', printed: '33/8', expected: '4 1/8', source: 'textbook' },
  { id: 'b61-2-h', page: 61, label: 'ح', kind: 'to-mixed', printed: '890/100', expected: '8 90/100', source: 'textbook' },
  { id: 'b61-2-i', page: 61, label: 'ط', kind: 'to-mixed', printed: '10001/100', expected: '100 1/100', source: 'textbook' },
  { id: 'b61-2-j', page: 61, label: 'ي', kind: 'to-mixed', printed: '509/12', expected: '42 5/12', source: 'textbook' },
]

/** Page 61 — exercise 3: mixed → ordinary (printed order a…ح). */
export const exerciseThreeItems: BookItem[] = [
  { id: 'b61-3-a', page: 61, label: 'أ', kind: 'to-improper', printed: '8 2/4', expected: '34/4', source: 'textbook' },
  { id: 'b61-3-b', page: 61, label: 'ب', kind: 'to-improper', printed: '10 3/5', expected: '53/5', source: 'textbook' },
  { id: 'b61-3-c', page: 61, label: 'ج', kind: 'to-improper', printed: '155 4/10', expected: '1554/10', source: 'textbook' },
  { id: 'b61-3-d', page: 61, label: 'د', kind: 'to-improper', printed: '101 8/9', expected: '917/9', source: 'textbook' },
  { id: 'b61-3-e', page: 61, label: 'هـ', kind: 'to-improper', printed: '1 2/5', expected: '7/5', source: 'textbook' },
  { id: 'b61-3-f', page: 61, label: 'و', kind: 'to-improper', printed: '3 1/10', expected: '31/10', source: 'textbook' },
  { id: 'b61-3-g', page: 61, label: 'ز', kind: 'to-improper', printed: '100 44/45', expected: '4544/45', source: 'textbook' },
  { id: 'b61-3-h', page: 61, label: 'ح', kind: 'to-improper', printed: '45 78/100', expected: '4578/100', source: 'textbook' },
]

/** Page 61 — exercise 2 accepts an equivalent reduced mixed form (e.g. 6/4 = 1 2/4 = 1 1/2). Exercise 3 is checked by value (sameValue). */
export const reducedEquivalents: Record<string, string> = {
  'b61-2-a': '1 1/2',
  'b61-2-e': '3 1/2',
  'b61-2-h': '8 9/10',
}

/** Ordered book fractions as printed on page 58: 3/4, 4/4, 7/4 with the comparison to 1. */
export const pageFiftyEightFractions: Fraction[] = [frac(3, 4), frac(4, 4), frac(7, 4)]

/** Page 61 ex. 4: Samir's claim that 39/4 means 9 3/4. */
export const samirClaim = { improper: frac(39, 4), mixed: { whole: 9, numerator: 3, denominator: 4 } as MixedNumber }

/** Page 61 ex. 5: 8 pieces shared equally among 3 children. */
export const cakeShare = { pieces: 8, children: 3 }

export function classifyExpected(printed: string): 'ordinary' | 'mixed' {
  return /^\s*\d+\s+\d+\s*\/\s*\d+\s*$/u.test(printed) ? 'mixed' : 'ordinary'
}

/** Strict parser for learner text: "a/b" and "w a/b" (w ≥ 0, a < b, b ≥ 2). Returns undefined otherwise. */
export function parseMixedText(value: string): MixedNumber | undefined {
  const match = /^\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/u.exec(value)
  if (!match) return undefined
  const mixed = { whole: Number(match[1]), numerator: Number(match[2]), denominator: Number(match[3]) }
  return mixed.denominator > 1 && mixed.numerator > 0 && mixed.numerator < mixed.denominator && Number.isSafeInteger(mixed.whole) ? mixed : undefined
}
export function parseFractionText(value: string): Fraction | undefined {
  const match = /^\s*(\d+)\s*\/\s*(\d+)\s*$/u.exec(value)
  if (!match) return undefined
  const fraction = { numerator: Number(match[1]), denominator: Number(match[2]) }
  return fraction.denominator > 0 && Number.isSafeInteger(fraction.numerator) ? fraction : undefined
}

/** Checks a learner answer against the expected printed answer, accepting reduced equivalent forms. */
export function isAcceptedMixed(itemId: string, answer: MixedNumber, expected: string): boolean {
  const parsed = parseMixedText(expected)
  if (!parsed) return false
  if (answer.whole === parsed.whole && answer.numerator === parsed.numerator && answer.denominator === parsed.denominator) return true
  const alternative = reducedEquivalents[itemId]
  const alt = alternative ? parseMixedText(alternative) : undefined
  return Boolean(alt && answer.whole === alt.whole && answer.numerator === alt.numerator && answer.denominator === alt.denominator)
}

/** Ordinary-fraction answers are checked by exact value, so 34/4 and 17/2 are both accepted. */
export function isAcceptedFraction(answer: Fraction, expected: string): boolean {
  const parsed = parseFractionText(expected)
  return Boolean(parsed && sameValue(answer, parsed))
}
