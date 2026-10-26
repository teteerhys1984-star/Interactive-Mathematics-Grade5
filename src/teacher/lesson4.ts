import type { TeacherEntry } from './types'
import { roundingAdditionalTasks, roundingBookFacts, roundingBookTasks } from '../lessons/roundingData'

export type FinalAssessment4Question =
  | { id: 'round-final-1' | 'round-final-2' | 'round-final-3' | 'round-final-5'; text: string; kind: 'number'; answer: string }
  | { id: 'round-final-4'; text: string; kind: 'explanation'; answer: string }

const finalAssessmentAnswers: Record<(typeof roundingAdditionalTasks)[number]['id'], string> = {
  'round-final-1': '5000000',
  'round-final-2': '6000',
  'round-final-3': '7000000',
  'round-final-4': 'رقم الآلاف 8، فنزيد خانة عشرات الآلاف من 6 إلى 7، ونجعل الخانات الواقعة إلى يمينها أصفاراً، فيكون الناتج 4770000.',
  'round-final-5': '8000000',
}

export const finalAssessment4: readonly FinalAssessment4Question[] = roundingAdditionalTasks.map(question => ({
  id: question.id,
  text: question.text,
  kind: question.kind,
  answer: finalAssessmentAnswers[question.id],
})) as readonly FinalAssessment4Question[]

const roundingAnswerKey: Readonly<Record<string, string | readonly string[]>> = {
  'r4-p15-a1-580': '600',
  'r4-p15-a2-315': '300',
  'r4-p15-a3-1390': '1400',
  'r4-p15-example-2137': '2000',
  'r4-p16-example-3482137': '3500000',
  'r4-p17-example-3582137': '4000000',
  'r4-p17-check-a-moon': '386000',
  'r4-p17-check-b-sahara': '6000000',
  'r4-p17-oral-rounding-steps': 'نحدد المنزلة المطلوبة ونفحص الرقم الواقع مباشرة على يمينها. إذا كان 5 أو أكبر نرفع المنزلة واحداً، وإذا كان أقل من 5 نبقيها كما هي، ثم نجعل الخانات الأصغر إلى يمينها أصفاراً.',
  'r4-p17-practice-1-2957': '3000',
  'r4-p17-practice-2-5856375': '5856000',
  'r4-p17-practice-3-a': '1523000',
  'r4-p17-practice-3-b': '7933000',
  'r4-p17-practice-3-c': '3000000',
  'r4-p17-practice-3-d': '50500000',
  'r4-p18-practice-4-digit-code': ['5167', '5176'],
  'r4-p18-practice-5-a': '300000',
  'r4-p18-practice-5-b': '100000',
  'r4-p18-practice-5-c': '450000',
  'r4-p18-practice-5-d': '290000',
  'r4-p18-practice-5-e': '2000000',
  'r4-p18-practice-5-f': '1000000',
  'r4-p18-practice-6-a': 'صح',
  'r4-p18-practice-6-b': 'خطأ',
  'r4-p18-practice-7-reason': 'نعم، لأن منزلة التقريب تختلف؛ نحدد الرقم المجاور لكل منزلة مطلوبة، لذلك قد تختلف النتيجة.',
  'r4-p18-practice-8-a': '5000000',
  'r4-p18-practice-8-b': '2000000',
  'r4-p18-practice-8-c': '7000000',
  'r4-p18-practice-8-d': '9236550',
  'r4-p18-practice-8-e': '232698',
  'r4-p18-practice-8-f': '9215000',
  'r4-p18-practice-8-g': '236000',
  'r4-p18-practice-8-h': '4231700',
  'r4-p18-practice-8-i': '3200000',
  'r4-p18-practice-9-sweden': '190000',
  'r4-p18-practice-10-eggs': '110000',
  'r4-p18-practice-11-car': '2000000',
  'r4-p18-practice-12-earth': '6000000',
  'r4-p18-practice-13-donation-million': '7000000',
  'r4-p18-practice-13-donation-hundred-thousand': '7500000',
}

const reasoningFor = (id: string, answer: string): string[] => {
  if (id === 'r4-p18-practice-9-sweden') {
    return ['المطلوب التقريب إلى أقرب عشرة آلاف، لذا نفحص رقم الآلاف في 185180 وهو 5.', 'نزيد رقم عشرات الآلاف 8 إلى 9، وتصبح الخانات الأصغر أصفاراً.', 'الناتج 190000 كم².']
  }
  if (id === 'r4-p17-oral-rounding-steps' || id === 'r4-p18-practice-7-reason') {
    return ['نحدد المنزلة التي نريد التقريب إليها.', 'نفحص الرقم الواقع مباشرة إلى يمينها، لا رقماً أبعد.', 'نزيد المنزلة عند 5 أو أكثر، ونبقيها عند أقل من 5، ثم نصفر الخانات الأصغر.']
  }
  return ['حدد المنزلة المطلوبة في السؤال.', 'افحص الرقم الواقع مباشرة إلى يمينها: 5 أو أكثر يعني الزيادة، وأقل من 5 يعني الإبقاء.', `اكتب الناتج بعد جعل الخانات الأصغر أصفاراً: ${answer}.`]
}

const readableAnswer = (answer: string | readonly string[]): string => Array.isArray(answer) ? answer.join(' أو ') : answer as string

export const lessonFourTeacherEntries: TeacherEntry[] = [
  {
    id: 'r4-p15-intro-facts', title: 'معلومات الانطلاقة: القمر والصحراء الكبرى',
    prompt: `يذكر الكتاب أن بُعد القمر نحو ${roundingBookFacts.moonDistance} كم، ومساحة الصحراء الكبرى ${roundingBookFacts.saharaArea} كم².`,
    answer: 'معلومتان تمهيديتان مطبوعتان؛ لا يطلب الكتاب في هذا الموضع تقريبهما.',
    source: { type: 'textbook', page: 15 },
    reasoning: ['هذا مدخل معلوماتي كما في ص 15، وليس تمرين تقريب مطبوعاً.', 'تظهر أسئلة تقريب هذين العددين لاحقاً في «تحقّق من فهمك» ص 17.'],
  },
  ...roundingBookTasks.map((task): TeacherEntry => {
    const answer = roundingAnswerKey[task.id]
    if (answer === undefined) throw new Error(`Missing lesson 4 answer key: ${task.id}`)
    return {
      id: task.id,
      title: `${task.section} · ص ${task.page}`,
      prompt: task.prompt,
      answer: readableAnswer(answer),
      source: { type: 'textbook', page: task.page },
      reasoning: reasoningFor(task.id, readableAnswer(answer)),
    }
  }),
  ...finalAssessment4.map((question): TeacherEntry => ({
    id: question.id,
    title: `سؤال إضافي من إعداد المنصة: ${question.id}`,
    prompt: question.text,
    answer: question.answer,
    source: { type: 'platform' },
    reasoning: question.id === 'round-final-4'
      ? ['نفحص رقم الآلاف في 4768210 وهو 8.', 'لأن 8 أكبر من أو يساوي 5 نزيد خانة عشرات الآلاف من 6 إلى 7.', 'نصفر الخانات إلى يمينها، فيكون الناتج 4770000.']
      : ['حدد المنزلة المطلوبة أولاً.', 'افحص الرقم المجاور لها مباشرة، ثم ارفع المنزلة أو أبقها.', `اكتب الناتج بعد تصفير الخانات الأصغر: ${question.answer}.`],
  })),
]

export function normalizeRoundingDigits(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/gu, '')
    .replace(/[٠-٩]/gu, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/gu, digit => String(digit.charCodeAt(0) - 0x06f0))
}

/** Accepts plain non-negative integers or correctly grouped thousands; rejects malformed separators. */
export function normalizeRoundingNumberInput(value: string): string | null {
  const normalized = normalizeRoundingDigits(value).trim()
  if (!normalized) return null
  if (/^(?:0|[1-9][0-9]*)$/u.test(normalized)) return normalized

  const punctuation = [...normalized.matchAll(/[,،٬]/gu)].map(match => match[0])
  if (punctuation.length) {
    if (new Set(punctuation).size !== 1) return null
    const compact = normalized.replace(/[ \t]*[,،٬][ \t]*/gu, ',')
    if (!/^[1-9][0-9]{0,2}(?:,[0-9]{3})+$/u.test(compact)) return null
    return compact.replace(/,/gu, '')
  }

  if (!/^[1-9][0-9]{0,2}(?:[ \t]+[0-9]{3})+$/u.test(normalized)) return null
  return normalized.replace(/[ \t]/gu, '')
}

function normalizeArabicText(value: string): string {
  return normalizeRoundingDigits(value)
    .normalize('NFKC')
    .replace(/[\u064b-\u065f\u0670\u0640]/gu, '')
    .replace(/[أإآ]/gu, 'ا')
    .replace(/ة/gu, 'ه')
    .replace(/ى/gu, 'ي')
    .replace(/[.,،٬؛:!?؟"'()[\]]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
}

function conditionHasAction(
  text: string,
  condition: RegExp,
  action: RegExp,
  allowNegatedAction = false,
): boolean {
  const globalPattern = (pattern: RegExp) => new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`)
  for (const match of text.matchAll(globalPattern(condition))) {
    const start = match.index ?? 0
    const from = Math.max(0, start - 24)
    const to = Math.min(text.length, start + match[0].length + 55)
    const context = text.slice(from, to)
    for (const actionMatch of context.matchAll(globalPattern(action))) {
      const actionStart = (actionMatch.index ?? 0) + from
      const preceding = text.slice(Math.max(from, actionStart - 8), actionStart)
      if (allowNegatedAction || !/(?:^|\s)(?:لا|لم|لن|ما)\s*$/u.test(preceding)) return true
    }
  }
  return false
}

const atLeastFive = /(?:5|خمسه|خمس)\s+(?:او اكثر|او اكبر|فاكثر|فما فوق|او فوق)/gu
const belowFive = /(?:اقل من (?:5|خمسه|خمس)|دون (?:5|خمسه|خمس)|(?:4|اربعه) (?:او اقل|فما دون))/gu
const raisesPlace = /(?:نزيد|نرفع|نضيف|ارفع|زد|اضف|تزيد|يزيد|يرتفع|ترتفع|زياده)/gu
const keepsPlace = /(?:نبقي|ابق|نترك|اترك|يترك|تترك|تبقي|تبقى|يبقى|نثبت|تثبت|تظل|يظل|دون تغيير)/gu
const doesNotRaise = /لا (?:نزيد|نرفع|نغير|تزيد|ترفع)/gu

function conditionFollowedByAction(text: string, condition: RegExp, otherCondition: RegExp, action: RegExp): boolean {
  const targetMatches = [...text.matchAll(new RegExp(condition.source, `${condition.flags.replace('g', '')}g`))]
  const allConditions = [
    ...targetMatches,
    ...text.matchAll(new RegExp(otherCondition.source, `${otherCondition.flags.replace('g', '')}g`)),
  ].sort((left, right) => (left.index ?? 0) - (right.index ?? 0))

  return targetMatches.some(match => {
    const start = (match.index ?? 0) + match[0].length
    const nextCondition = allConditions.find(candidate => (candidate.index ?? 0) >= start)
    const end = Math.min(text.length, nextCondition?.index ?? start + 55)
    const branch = text.slice(start, end)
    return [...branch.matchAll(new RegExp(action.source, `${action.flags.replace('g', '')}g`))].some(actionMatch => {
      const actionStart = actionMatch.index ?? 0
      const preceding = branch.slice(Math.max(0, actionStart - 8), actionStart)
      return !/(?:^|\s)(?:لا|لم|لن|ما)\s*$/u.test(preceding)
    })
  })
}

function hasRuleForBothThresholds(text: string): boolean {
  const raisesAtFiveOrMore = conditionFollowedByAction(text, atLeastFive, belowFive, raisesPlace)
  const keepsBelowFive = conditionFollowedByAction(text, belowFive, atLeastFive, keepsPlace)
    || conditionFollowedByAction(text, belowFive, atLeastFive, doesNotRaise)
  return raisesAtFiveOrMore && keepsBelowFive
}

function turnsLowerPlacesToZero(text: string): boolean {
  const zeros = /(?:اصفار|صفرا|صفر)/u
  const lowerPlaces = /(?:يمين|الخانات الاصغر|المنازل الاصغر|الخانات الباقيه|المنازل الباقيه)/u
  return conditionHasAction(text, zeros, lowerPlaces, true)
    || conditionHasAction(text, lowerPlaces, zeros, true)
}

/** Rejects explicit negations tied to the answer's rounding-up, zeroing, or result claims. */
function hasContradictoryFinalRoundingClaim(value: string): boolean {
  const clauses = normalizeRoundingDigits(value)
    .split(/[.!؟?،,؛:]+|\s+(?:لكن|بل|ولكن|أما|مع ذلك|غير أن)\s+/u)
    .map(normalizeArabicText)
    .filter(Boolean)

  const deniesIncrease = [
    /(?:لا|لم|لن)\s*(?:نزيد|نرفع|نضيف).{0,40}(?:عشرات الالاف|من 6 الي 7|6.{0,8}7)/u,
    /(?:لا ينبغي|لا يجب|لا يجوز|لا يصح).{0,40}(?:نزيد|نرفع|نضيف|زياده|رفع|عشرات الالاف).{0,35}(?:عشرات الالاف|من 6 الي 7|6.{0,8}7)/u,
    /(?:الزياده|زياده|الرفع|رفع|نزيد|نرفع|عشرات الالاف|من 6 الي 7|6.{0,8}7).{0,40}(?:غير صحيح|غير صحيحه|ليس صحيحا|ليست صحيحه|خطا|خاطئه|خاطئ)/u,
    /(?:غير صحيح|غير صحيحه|ليس صحيحا|ليست صحيحه|خطا|خاطئه|خاطئ).{0,40}(?:الزياده|زياده|الرفع|رفع|نزيد|نرفع|عشرات الالاف|من 6 الي 7|6.{0,8}7)/u,
  ]
  const deniesZeroing = [
    /(?:لا|لم|لن)\s*(?:نصفر|نحول|نجعل|نضع).{0,40}(?:الخانات|المنازل|يمين|اصفار|صفر)/u,
    /(?:الخانات|المنازل|يمينها).{0,35}(?:لا تصبح|لا تكون|ليست|غير|لن تصبح|لن تكون).{0,15}(?:اصفار|صفر)/u,
    /(?:لا|لم|لن).{0,20}(?:تتحول|تصبح|تكون).{0,25}(?:اصفار|صفر)/u,
    /(?:اصفار|صفر|تصفير).{0,35}(?:غير صحيح|غير صحيحه|ليس صحيحا|خطا|خاطئه)/u,
  ]
  const deniesResult = [
    /(?:4770000|4\s?770\s?000).{0,24}(?:ليس|لا يكون|غير صحيح|غير صحيحه|خطا|خاطئ)/u,
    /(?:الناتج|النتيجه).{0,24}(?:ليس|لا يكون|غير صحيح|غير صحيحه|خطا|خاطئ).{0,24}(?:4770000|4\s?770\s?000)/u,
  ]

  return clauses.some(clause => deniesIncrease.some(pattern => pattern.test(clause))
    || deniesZeroing.some(pattern => pattern.test(clause)))
    || deniesResult.some(pattern => pattern.test(normalizeArabicText(value)))
}

function explanationIsCorrect(id: string, value: string): boolean {
  const text = normalizeArabicText(value)
  if (!text) return false

  if (id === 'round-final-4') {
    const identifiesEight = /(?:رقم الالاف|الالاف).{0,32}(?:8|ثمانيه)/u.test(text)
    const raisesTenThousands = /(?:نزيد|يزيد|نرفع|يرتفع|زياده|رفع).{0,45}(?:عشرات الالاف|خانة عشرات الالاف|المنزله).{0,35}(?:6.{0,8}7|من 6 الي 7|الي 7)/u.test(text)
      || /(?:عشرات الالاف).{0,32}(?:من 6 الي 7|6.{0,8}7).{0,20}(?:نزيد|نرفع)/u.test(text)
    const zerosRight = turnsLowerPlacesToZero(text)
    const correctResult = /(?:4770000|4\s?770\s?000|اربعه ملايين و?سبعمئه و?سبعون الف)/u.test(text)
    return identifiesEight && raisesTenThousands && zerosRight && correctResult
      && !hasContradictoryFinalRoundingClaim(value)
  }

  if (id === 'r4-p17-oral-rounding-steps') {
    const selectsPlace = /(?:نحدد|نختار|نعين|نعرف|حدد|اختر).{0,40}(?:المنزله|منزله|الخانة|خانه|المكان|مكان)/u.test(text)
      || /(?:المنزله المطلوبه|الخانة المطلوبه|منزله التقريب|خانة التقريب|المنزله التي نريد)/u.test(text)
    const inspectsAdjacentDigit = /(?:الرقم|الخانة).{0,36}(?:يمين|التالي|الذي يلي|المجاور|المباشر)|(?:يمين المنزله|يمينها)/u.test(text)
    return selectsPlace && inspectsAdjacentDigit && hasRuleForBothThresholds(text) && turnsLowerPlacesToZero(text)
  }

  if (id === 'r4-p18-practice-7-reason') {
    const assertsPossibleDifference = /(?:يختلف|تختلف|قد تختلف|تتغير|تفاوت)/u.test(text) && !/(?:لا يختلف|لا تختلف|لا تتغير)/u.test(text)
    const namesBothPlaces = /(?:ملايين|مليون)/u.test(text) && /(?:آحاد الالوف|احاد الالوف|احد الالوف|الالوف)/u.test(text)
    const linksDifferenceToPlace = /(?:لان|بسبب|لاختلاف|تختلف المنزله|تختلف الخانه|المنزله مختلفه|الخانة مختلفه)/u.test(text)
    return assertsPossibleDifference && namesBothPlaces && linksDifferenceToPlace
  }

  return false
}

export function isRoundingBookAnswerCorrect(id: string, response: string): boolean {
  const expected = roundingAnswerKey[id]
  if (expected === undefined || !response.trim()) return false
  const task = roundingBookTasks.find(item => item.id === id)
  if (task?.kind === 'explanation') return explanationIsCorrect(id, response)
  if (task?.kind === 'choice') return normalizeArabicText(response) === normalizeArabicText(String(expected))
  const actual = normalizeRoundingNumberInput(response)
  if (actual === null) return false
  const accepted = Array.isArray(expected) ? expected : [expected]
  return accepted.some(answer => actual === normalizeRoundingNumberInput(String(answer)))
}

export function isFinalAssessment4AnswerCorrect(question: FinalAssessment4Question, response: string): boolean {
  if (!response.trim()) return false
  if (question.kind === 'number') {
    return normalizeRoundingNumberInput(response) === normalizeRoundingNumberInput(question.answer)
  }
  return explanationIsCorrect(question.id, response)
}

export function getRoundingBookAnswer(id: string): string | readonly string[] | null {
  return roundingAnswerKey[id] ?? null
}

/** Integer-only half-up rounding used by the lesson rule (the only supported places are powers of ten). */
export function roundToNearestPlace(value: number, placeValue: number): number | null {
  if (!Number.isSafeInteger(value) || value < 0 || !Number.isSafeInteger(placeValue) || placeValue < 1) return null
  if (!/^10*$/.test(String(placeValue))) return null
  const lower = Math.floor(value / placeValue) * placeValue
  return value - lower >= placeValue / 2 ? lower + placeValue : lower
}
