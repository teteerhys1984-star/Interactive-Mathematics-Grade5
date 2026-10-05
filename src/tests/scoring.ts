import type {
  AnswerStatus,
  ErrorAnalysisAnswerKey,
  FractionAnswerKey,
  MatchPair,
  NumericAnswerKey,
  NumericUnitPolicy,
  QuestionDefinition,
  QuestionResult,
  StudentAnswer,
  TestDefinition,
  TestResult,
} from './types'

export interface ExactRational {
  numerator: bigint
  denominator: bigint
}

const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'
const EASTERN_ARABIC_DIGITS = '۰۱۲۳۴۵۶۷۸۹'

/** Convert Arabic/Persian digits and mathematical punctuation without consulting locale. */
export function normalizeNumericGlyphs(value: string): string {
  let normalized = value.normalize('NFKC')
  let result = ''

  for (const character of normalized) {
    const arabicIndex = ARABIC_INDIC_DIGITS.indexOf(character)
    const easternIndex = EASTERN_ARABIC_DIGITS.indexOf(character)

    if (arabicIndex >= 0) {
      result += String(arabicIndex)
    } else if (easternIndex >= 0) {
      result += String(easternIndex)
    } else if (character === '٫') {
      result += '.'
    } else if (character === '٬' || character === '،') {
      result += ','
    } else if (character === '−' || character === '﹣' || character === '－') {
      result += '-'
    } else if (character === '⁄' || character === '∕') {
      result += '/'
    } else {
      result += character
    }
  }

  normalized = result
  return normalized
}

function absolute(value: bigint): bigint {
  return value < 0n ? -value : value
}

function greatestCommonDivisor(left: bigint, right: bigint): bigint {
  let a = absolute(left)
  let b = absolute(right)

  while (b !== 0n) {
    const remainder = a % b
    a = b
    b = remainder
  }

  return a === 0n ? 1n : a
}

function reduceRational(numerator: bigint, denominator: bigint): ExactRational | undefined {
  if (denominator === 0n) return undefined
  let adjustedNumerator = numerator
  let adjustedDenominator = denominator

  if (adjustedDenominator < 0n) {
    adjustedNumerator = -adjustedNumerator
    adjustedDenominator = -adjustedDenominator
  }

  const divisor = greatestCommonDivisor(adjustedNumerator, adjustedDenominator)
  return {
    numerator: adjustedNumerator / divisor,
    denominator: adjustedDenominator / divisor,
  }
}

/** Parse plain decimal text exactly; no binary floating-point conversion is used. */
export function parseDecimal(value: string): ExactRational | undefined {
  let text = normalizeNumericGlyphs(value).trim()
  if (text.length === 0 || text.length > 512) return undefined

  const hasWhitespaceGrouping = /[\s\u00a0\u202f]/u.test(text)
  const hasCommaGrouping = text.includes(',')

  if (hasWhitespaceGrouping && hasCommaGrouping) return undefined

  if (hasWhitespaceGrouping) {
    const groupedPattern = /^[+-]?\d{1,3}(?:[\s\u00a0\u202f]\d{3})+(?:\.\d+)?$/u
    if (!groupedPattern.test(text)) return undefined
    text = text.replace(/[\s\u00a0\u202f]/gu, '')
  } else if (hasCommaGrouping) {
    const groupedPattern = /^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/u
    if (!groupedPattern.test(text)) return undefined
    text = text.replace(/,/gu, '')
  }

  const match = /^([+-]?)(?:(\d+)(?:\.(\d+))?|\.(\d+))$/u.exec(text)
  if (!match) return undefined

  const sign = match[1] === '-' ? -1n : 1n
  const whole = match[2] ?? '0'
  const fraction = match[3] ?? match[4] ?? ''
  const digits = `${whole}${fraction}`
  const denominator = 10n ** BigInt(fraction.length)

  try {
    return reduceRational(sign * BigInt(digits), denominator)
  } catch {
    return undefined
  }
}

function normalizeUnit(value: string): string {
  return normalizeNumericGlyphs(value).normalize('NFKC').trim().toLowerCase()
}

function splitNumericUnit(value: string, policy: NumericUnitPolicy): { numberText: string; unit?: string } | undefined {
  const normalized = normalizeNumericGlyphs(value).trim()
  if (policy.kind === 'none') return { numberText: normalized }

  const acceptedUnits = policy.acceptedUnits
    .map((unit) => normalizeUnit(unit))
    .filter((unit) => unit.length > 0)
    .sort((left, right) => right.length - left.length)

  if (acceptedUnits.length === 0) return undefined

  const normalizedAnswer = normalizeUnit(normalized)
  const matchingUnit = acceptedUnits.find((unit) => normalizedAnswer.endsWith(unit))

  if (matchingUnit) {
    const numberText = normalized.slice(0, normalized.length - matchingUnit.length).trim()
    return numberText.length > 0 ? { numberText, unit: matchingUnit } : undefined
  }

  if (policy.kind === 'required') return undefined
  return { numberText: normalized }
}

function parseNumericResponse(value: string, policy: NumericUnitPolicy): ExactRational | undefined {
  const split = splitNumericUnit(value, policy)
  if (!split) return undefined

  if (policy.kind !== 'none') {
    const acceptedUnits = policy.acceptedUnits.map(normalizeUnit)
    if (split.unit && !acceptedUnits.includes(split.unit)) return undefined
  }

  return parseDecimal(split.numberText)
}

function compareAbsoluteDifferenceWithinTolerance(
  actual: ExactRational,
  expected: ExactRational,
  tolerance: ExactRational,
): boolean {
  const differenceNumerator = absolute(
    actual.numerator * expected.denominator - expected.numerator * actual.denominator,
  )
  const differenceDenominator = actual.denominator * expected.denominator
  return differenceNumerator * tolerance.denominator <= tolerance.numerator * differenceDenominator
}

function parseFraction(value: string): { rational: ExactRational; isReduced: boolean } | undefined {
  const text = normalizeNumericGlyphs(value).trim()
  if (text.length === 0 || text.length > 512) return undefined
  const match = /^([+-]?\d+)\s*\/\s*([+-]?\d+)$/u.exec(text)
  if (!match) return undefined

  try {
    const numerator = BigInt(match[1])
    const denominator = BigInt(match[2])
    if (denominator === 0n) return undefined
    const isReduced = greatestCommonDivisor(numerator, denominator) === 1n
    const rational = reduceRational(numerator, denominator)
    return rational ? { rational, isReduced } : undefined
  } catch {
    return undefined
  }
}

function parseFractionKey(answer: FractionAnswerKey): ExactRational | undefined {
  if (!/^[+-]?\d+$/u.test(answer.numerator) || !/^[+-]?\d+$/u.test(answer.denominator)) return undefined
  try {
    const numerator = BigInt(answer.numerator)
    const denominator = BigInt(answer.denominator)
    if (denominator <= 0n) return undefined
    return reduceRational(numerator, denominator)
  } catch {
    return undefined
  }
}

function sameRational(left: ExactRational, right: ExactRational): boolean {
  return left.numerator === right.numerator && left.denominator === right.denominator
}

function isUnanswered(question: QuestionDefinition, answer: StudentAnswer | undefined): boolean {
  if (!answer) return true
  if (answer.type !== question.type) return false

  switch (answer.type) {
    case 'single-choice':
    case 'numeric':
    case 'fraction':
      return answer.value.trim().length === 0
    case 'multi-select':
    case 'ordering':
    case 'matching':
      return answer.value.length === 0
    case 'true-false':
      return false
    case 'error-analysis':
      return answer.value.diagnosisId.trim().length === 0 && (answer.value.correctionId?.trim().length ?? 0) === 0
  }
}

/** Response-presence check shared with the runner's progress UI; it never evaluates correctness. */
export function hasProvidedAnswer(question: QuestionDefinition, answer: StudentAnswer | undefined): boolean {
  return !isUnanswered(question, answer)
}

function sameStringSet(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  if (leftSet.size !== left.length || rightSet.size !== right.length) return false
  return [...leftSet].every((value) => rightSet.has(value))
}

function sameStringSequence(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

function canonicalPairs(pairs: readonly MatchPair[]): string[] {
  return pairs.map(({ leftId, rightId }) => `${leftId}\u0000${rightId}`).sort()
}

function samePairs(left: readonly MatchPair[], right: readonly MatchPair[]): boolean {
  if (left.length !== right.length) return false
  const leftCanonical = canonicalPairs(left)
  const rightCanonical = canonicalPairs(right)
  return leftCanonical.every((value, index) => value === rightCanonical[index])
}

function sameErrorAnalysis(
  actual: ErrorAnalysisAnswerKey,
  expected: ErrorAnalysisAnswerKey,
): boolean {
  return actual.diagnosisId === expected.diagnosisId && actual.correctionId === expected.correctionId
}

function evaluateAnsweredQuestion(question: QuestionDefinition, answer: StudentAnswer): boolean {
  if (answer.type !== question.type) return false

  switch (question.type) {
    case 'single-choice':
      return answer.type === 'single-choice' && answer.value === question.answer

    case 'true-false':
      return answer.type === 'true-false' && answer.value === question.answer

    case 'multi-select':
      return answer.type === 'multi-select' && sameStringSet(answer.value, question.answer)

    case 'numeric': {
      if (answer.type !== 'numeric') return false
      const actual = parseNumericResponse(answer.value, question.answer.unitPolicy)
      const expected = parseDecimal(question.answer.expected)
      const tolerance = question.answer.tolerance === undefined ? { numerator: 0n, denominator: 1n } : parseDecimal(question.answer.tolerance)
      if (!actual || !expected || !tolerance || tolerance.numerator < 0n) return false
      if (question.answer.format === 'integer' && (actual.denominator !== 1n || expected.denominator !== 1n)) return false
      return compareAbsoluteDifferenceWithinTolerance(actual, expected, tolerance)
    }

    case 'fraction': {
      if (answer.type !== 'fraction') return false
      const expected = parseFractionKey(question.answer)
      if (!expected) return false

      const actualFraction = parseFraction(answer.value)
      if (actualFraction) {
        return sameRational(actualFraction.rational, expected)
          && (question.answer.equivalentForms === 'accept' || actualFraction.isReduced)
      }

      if (!question.answer.allowDecimalEquivalent) return false
      const actualDecimal = parseDecimal(answer.value)
      return actualDecimal !== undefined && sameRational(actualDecimal, expected)
    }

    case 'ordering':
      return answer.type === 'ordering' && sameStringSequence(answer.value, question.answer)

    case 'matching':
      return answer.type === 'matching' && samePairs(answer.value, question.answer)

    case 'error-analysis':
      return answer.type === 'error-analysis' && sameErrorAnalysis(answer.value, question.answer)
  }
}

export function evaluateQuestion(
  question: QuestionDefinition,
  answer: StudentAnswer | undefined,
): QuestionResult {
  if (!hasProvidedAnswer(question, answer)) {
    return { questionId: question.id, status: 'unanswered', earnedPoints: 0, possiblePoints: 1 }
  }

  const status: AnswerStatus = answer && evaluateAnsweredQuestion(question, answer) ? 'correct' : 'incorrect'
  return {
    questionId: question.id,
    status,
    earnedPoints: status === 'correct' ? 1 : 0,
    possiblePoints: 1,
  }
}

export function scoreTest(
  test: TestDefinition,
  answers: Readonly<Record<string, StudentAnswer | undefined>>,
): TestResult {
  const questionResults = test.questions.map((question) => evaluateQuestion(question, answers[question.id]))
  const correctCount = questionResults.filter((result) => result.status === 'correct').length
  const incorrectCount = questionResults.filter((result) => result.status === 'incorrect').length
  const unansweredCount = questionResults.filter((result) => result.status === 'unanswered').length
  const maxScore = questionResults.reduce((total, result) => total + result.possiblePoints, 0)
  const score = questionResults.reduce((total, result) => total + result.earnedPoints, 0)

  return {
    testId: test.id,
    correctCount,
    incorrectCount,
    unansweredCount,
    score,
    maxScore,
    percentage: maxScore === 0 ? 0 : Math.round((score / maxScore) * 100),
    questionResults,
  }
}
