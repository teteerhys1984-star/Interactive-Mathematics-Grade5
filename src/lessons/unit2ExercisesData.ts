import type { TeacherEntry } from '../teacher/types'

/**
 * الوحدة الثانية · درس «تمرينات الوحدة الثانية» (الكتاب ص 85–86).
 *
 * سجل المصدر الوحيد لدرس المراجعة الختامي: كل سؤال من الأسئلة الأحد عشر المطبوعة في
 * الصفتين 85 و86 منقول هنا بنصّه وأرقامه كما في الكتاب، مع حل كامل (معطيات/مطلوب/قاعدة/
 * خطوات/إجابة/تحقّق) تُبنى خطواته العددية حسابياً من المعطيات نفسها حتى لا ينحرف أي رقم.
 * الطالب يرى الأسئلة عبر مكوّن الدرس، ومنطقة المعلم تشتق حلاً لكل عنصر وفرع،
 * وفحص `scripts/lesson-unit2-exercises-check.ts` يعيد حساب كل الأجواب ويطابق هذا السجل.
 *
 * قواعد الكتابة:
 * - الكسور والأعداد المختلطة في بيانات الطالب قيم مهيكلة (MathVal) ولا تُكتب أبداً «a/b»
 *   داخل نص مطبوع من الكتاب؛ عرض الكسر العمودي مسؤولية مكوّن العرض.
 * - نصوص الأسئلة العربية منقولة من الصور الأصلية، مع تطبيع إملائي للألف المقصورة
 *   والهمزات فقط دون أي تغيير في المعطيات أو الأرقام.
 */

export const lessonTitle = 'تمرينات الوحدة الثانية'
export const lessonId = 'unit-2-exercises'
export const unit2ExercisesTextbookPages = [85, 86] as const
export type Unit2ExercisesPage = (typeof unit2ExercisesTextbookPages)[number]

/* ============================================================ قيم رياضية مهيكلة */

export type MathVal =
  | { kind: 'natural'; text: string }
  | { kind: 'decimal'; text: string }
  | { kind: 'fraction'; n: number; d: number }
  | { kind: 'mixed'; w: number; n: number; d: number }

export const natural = (text: string): MathVal => ({ kind: 'natural', text })
export const decimal = (text: string): MathVal => ({ kind: 'decimal', text })
export const frac = (n: number, d: number): MathVal => ({ kind: 'fraction', n, d })
export const mixed = (w: number, n: number, d: number): MathVal => ({ kind: 'mixed', w, n, d })

export type FractionVal = Extract<MathVal, { kind: 'fraction' }>

export function valueOf(value: MathVal): number {
  if (value.kind === 'natural' || value.kind === 'decimal') return Number(value.text)
  if (value.kind === 'fraction') return value.n / value.d
  return value.w + value.n / value.d
}

export function valueLabel(value: MathVal): string {
  if (value.kind === 'natural' || value.kind === 'decimal') return value.text
  if (value.kind === 'fraction') return `${value.n}/${value.d}`
  return `${value.w} ${value.n}/${value.d}`
}

/* ============================================================ الصيغة اللفظية */

const ONES = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة']
const TEENS = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر']
const TENS = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون']
const HUNDREDS = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة']

function twoDigitWords(value: number): string {
  if (value < 10) return ONES[value]
  if (value < 20) return TEENS[value - 10]
  const tens = Math.floor(value / 10)
  const ones = value % 10
  return ones === 0 ? TENS[tens] : `${ONES[ones]} و${TENS[tens]}`
}

function threeDigitWords(value: number): string {
  const hundreds = Math.floor(value / 100)
  const rest = value % 100
  if (hundreds === 0) return twoDigitWords(rest)
  return rest === 0 ? HUNDREDS[hundreds] : `${HUNDREDS[hundreds]} و${twoDigitWords(rest)}`
}

function scalePhrase(group: number, kind: 'thousand' | 'million'): string {
  const singular = kind === 'thousand' ? 'ألف' : 'مليون'
  const dual = kind === 'thousand' ? 'ألفان' : 'مليونان'
  const plural = kind === 'thousand' ? 'آلاف' : 'ملايين'
  const accusative = kind === 'thousand' ? 'ألفاً' : 'مليوناً'
  if (group === 1) return singular
  if (group === 2) return dual
  const last = group % 100
  if (group <= 10) return `${ONES[group]} ${plural}`
  if (last === 0 || last === 1) return `${threeDigitWords(group)} ${singular}`
  if (last <= 2) return `${threeDigitWords(group)} ${accusative}`
  if (last <= 10) return `${threeDigitWords(group)} ${plural}`
  return `${threeDigitWords(group)} ${accusative}`
}

/** الصيغة اللفظية لعدد طبيعي حتى 9999999 وفق قراءة الكتاب (الملايين ثم الآلاف ثم الباقي). */
export function arabicWords(value: number): string {
  const millions = Math.floor(value / 1_000_000)
  const thousands = Math.floor((value % 1_000_000) / 1000)
  const rest = value % 1000
  const parts: string[] = []
  if (millions > 0) parts.push(scalePhrase(millions, 'million'))
  if (thousands > 0) parts.push(scalePhrase(thousands, 'thousand'))
  if (rest > 0) parts.push(threeDigitWords(rest))
  return parts.length > 0 ? parts.join(' و') : 'صفر'
}

/* ============================================================ حسابات مساعدة */

function gcdPair(a: number, b: number): number {
  return b === 0 ? a : gcdPair(b, a % b)
}

function lcmPair(a: number, b: number): number {
  return (a * b) / gcdPair(a, b)
}

export function lcmOf(numbers: number[]): number {
  return numbers.reduce((acc, value) => lcmPair(acc, value))
}

/** مضاعفات الأساس بالترتيب حتى أول مضاعف يقبل القسمة على كل قواسم العدد. */
function multiplesUntil(base: number, divisors: number[]): number[] {
  const tried: number[] = []
  for (let index = 1; index <= 400; index += 1) {
    const candidate = base * index
    tried.push(candidate)
    if (divisors.every((value) => candidate % value === 0)) return tried
  }
  throw new Error(`no common multiple for base ${base} and ${divisors.join(', ')}`)
}

const multiplesListText = (values: number[]): string => values.map((value) => `${value}`).join('، ')

/* ============================================================ أنواع سجل المصدر */

export type SourceBranch = {
  id: string
  label: string
  prompt: string
  given: string
  required: string
  rule: string
  why: string
  steps: string[]
  answer: string
  check: string
  pitfall?: string
}

export type SourceElement = {
  id: string
  page: Unit2ExercisesPage
  section: string
  kind: 'content' | 'exercise'
  prompt: string
  given: string
  required: string
  rule: string
  why: string
  steps: string[]
  answer: string
  check: string
  pitfall?: string
  branches?: SourceBranch[]
}

/* ============================================================ بُنَى فروع الأسئلة */

/* ---------- التمرين ⑤ · المضاعف المشترك الأصغر ---------- */

const LCM_RULE = 'نكتب مضاعفات العدد الأكبر بالترتيب حتى نصل إلى أول مضاعف يقبل القسمة على بقية الأعداد؛ ذلك المضاعف هو المضاعف المشترك الأصغر.'

function lcmBranch(id: string, label: string, numbers: number[], why: string, pitfall?: string): SourceBranch {
  const lcm = lcmOf(numbers)
  const steps: string[] = []
  if (numbers.length === 2) {
    const big = Math.max(...numbers)
    const small = Math.min(...numbers)
    steps.push(`نكتب مضاعفات العدد الأكبر ${big}: ${multiplesListText(multiplesUntil(big, [small]))}.`)
    steps.push(`أول مضاعف منها يقبل القسمة على ${small} هو ${lcm}، لأن ${lcm} ÷ ${small} = ${lcm / small}.`)
  } else {
    const [a, b, c] = numbers
    const pairLcm = lcmOf([a, b])
    steps.push(`نوجد أولاً م.م.أ للعددين ${a} و ${b}: مضاعفات ${Math.max(a, b)} هي ${multiplesListText(multiplesUntil(Math.max(a, b), [Math.min(a, b)]))}، إذن م.م.أ = ${pairLcm}.`)
    steps.push(`نطابق الناتج مع العدد الثالث ${c}: مضاعفات ${pairLcm} هي ${multiplesListText(multiplesUntil(pairLcm, [c]))}.`)
    steps.push(`أول مضاعف يقبل القسمة على ${c} هو ${lcm}، لأن ${lcm} ÷ ${c} = ${lcm / c}.`)
  }
  steps.push(`إذن المضاعف المشترك الأصغر للأعداد ${numbers.join('، ')} هو ${lcm}.`)
  return {
    id,
    label,
    prompt: `جد المضاعف المشترك الأصغر للأعداد: ${numbers.join('، ')}.`,
    given: `الأعداد ${numbers.join('، ')}.`,
    required: `إيجاد المضاعف المشترك الأصغر للأعداد ${numbers.join('، ')}.`,
    rule: LCM_RULE,
    why,
    steps,
    answer: `المضاعف المشترك الأصغر هو ${lcm}.`,
    check: `نقسم ${lcm} على كل عدد من الأعداد ${numbers.join('، ')} فيكون خارج القسمة عدداً طبيعياً في كل مرة.`,
    pitfall,
  }
}

export const q5Sets: { id: string; label: string; numbers: number[]; why: string; pitfall?: string }[] = [
  { id: 'u2-p85-q5-a', label: 'أ', numbers: [4, 9], why: 'لا يوجد مضاعف مشترك لـ 4 و 9 أصغر من 36 لأن العددين لا يشتركان في أي عامل غير الواحد، فالمضاعف المشترك الأول هو حاصل ضربهما.', pitfall: 'الاكتفاء بمضاعفات العدد الأول فقط أو الخلط بين المضاعف المشترك الأصغر والقاسم المشترك الأكبر.' },
  { id: 'u2-p85-q5-b', label: 'ب', numbers: [6, 5, 8], why: 'نجد المضاعف المشترك الأصغر لعددين أولاً ثم نطابقه مع العدد الثالث، لأن أول مضاعف مشترك للثلاثة يجب أن يقبل القسمة على كل منها.', pitfall: 'إهمال العدد الثالث وأخذ م.م.أ للعددين الأولين فقط (30 بدلاً من 120).' },
  { id: 'u2-p85-q5-c', label: 'ج', numbers: [8, 3, 2], why: 'كل مضاعف للعدد 8 زوجي، فقبول القسمة على 2 مضمون، ويبقى إيجاد أول مضاعف مشترك للعددين 8 و 3.', pitfall: 'ضرب الأعداد الثلاثة (48) واعتباره الجواب دون البحث عن الأصغر.' },
  { id: 'u2-p85-q5-d', label: 'د', numbers: [40, 90], why: 'مضاعفات 90 متباعدة، لكن أول واحد منها يقبل القسمة على 40 هو 360، وهو أصغر من 40 × 90 = 3600 بكثير.', pitfall: 'اعتبار حاصل الضرب 3600 هو المضاعف المشترك الأصغر دائماً.' },
  { id: 'u2-p85-q5-e', label: 'هـ', numbers: [60, 50, 80], why: 'الأعداد الثلاثة تشترك في العامل 10، لذلك يكون المضاعف المشترك الأصغر أصغر بكثير من حاصل ضربها.', pitfall: 'البحث في مضاعفات الأعداد الصغيرة بدل البدء بالعدد الأكبر فيطول البحث ويقع فيه الخطأ.' },
  { id: 'u2-p85-q5-f', label: 'و', numbers: [80, 30, 20], why: 'العدد 80 هو الأكبر ومضاعفاته قليلة، وأولها الذي يقبل القسمة على 30 و 20 معاً هو 240.', pitfall: 'نسيان التحقق من العدد الثالث بعد إيجاد مضاعف مشترك لعددين.' },
  { id: 'u2-p85-q5-g', label: 'ز', numbers: [400, 900], why: 'أول مضاعف للعدد 900 يقبل القسمة على 400 هو 3600، لأن 3600 = 9 × 400 = 4 × 900.', pitfall: 'حساب 400 × 900 = 360000 واعتباره الجواب.' },
  { id: 'u2-p85-q5-h', label: 'ح', numbers: [600, 500, 800], why: 'نبدأ بالعددين 600 و 500 فينتج 3000، ثم نطابق مع 800 فينتج 12000.', pitfall: 'التوقف عند 3000 مع أنه لا يقبل القسمة على 800.' },
  { id: 'u2-p85-q5-t', label: 'ط', numbers: [200, 300, 800], why: 'مضاعف مشترك للأعداد 200 و 300 هو 600، وأول مضاعف له يقبل القسمة على 800 هو 2400.', pitfall: 'الاعتماد على 600 وهو لا يقبل القسمة على 800.' },
]

export const q5Items: SourceBranch[] = q5Sets.map((set) => lcmBranch(set.id, set.label, set.numbers, set.why, set.pitfall))

/* ---------- التمرين ⑥ · رموز المقارنة ---------- */

export type ComparisonItem = {
  id: string
  label: string
  left: MathVal
  right: MathVal
  answer: '>' | '<' | '='
  strategy: string
  steps: string[]
  pitfall?: string
}

function relationOf(left: MathVal, right: MathVal): '>' | '<' | '=' {
  const a = valueOf(left)
  const b = valueOf(right)
  return a > b ? '>' : a < b ? '<' : '='
}

function cmpBranch(item: ComparisonItem): SourceBranch {
  const answer = relationOf(item.left, item.right)
  return {
    id: item.id,
    label: item.label,
    prompt: `ضع الرمز المناسب ( < أو > أو = ) للمقارنة: ${valueLabel(item.left)} □ ${valueLabel(item.right)}.`,
    given: `القيمتان ${valueLabel(item.left)} و ${valueLabel(item.right)}.`,
    required: 'اختيار الرمز الصحيح (< أو > أو =) بين القيمتين.',
    rule: 'نوحّد صورة الطرفين (مقاماً مشتركاً أو صورة عشرية) ثم نقارن القيمتين.',
    why: item.strategy,
    steps: item.steps,
    answer: `${valueLabel(item.left)} ${answer} ${valueLabel(item.right)}.`,
    check: 'نعيد تقييم القيمتين عددياً للتأكد من صحة الرمز.',
    pitfall: item.pitfall,
  }
}

export const q6Items: ComparisonItem[] = [
  {
    id: 'u2-p85-q6-a', label: 'أ', left: frac(3, 4), right: frac(5, 12), answer: '>',
    strategy: 'المقامان مختلفان، فنوحّدهما إلى 12 ثم نقارن البسطين.',
    steps: ['المقام المشترك للعددين 4 و 12 هو 12.', 'نحوّل الطرف الأول: 3/4 = 9/12.', 'نقارن البسطين: 9 > 5، إذن 3/4 > 5/12.'],
    pitfall: 'مقارنة البسطين مباشرة (3 مع 5) مع أن المقامين مختلفين.',
  },
  {
    id: 'u2-p85-q6-b', label: 'ب', left: frac(3, 10), right: decimal('0.02'), answer: '>',
    strategy: 'نحوّل الكسر إلى عدد عشري ليتشابه صورتا الطرفين.',
    steps: ['3/10 = 0.3.', 'نوحّد المنازل العشرية: 0.3 = 0.30 و 0.02.', 'نقارن جزء الأعشار: 3 > 0، إذن 0.3 > 0.02.'],
    pitfall: 'قراءة 0.02 على أنها أكبر لأن فيها رقماً أكبر في منزلة المئات دون النظر إلى الأعشار.',
  },
  {
    id: 'u2-p85-q6-c', label: 'ج', left: frac(6, 7), right: frac(7, 8), answer: '<',
    strategy: 'المقامان 7 و 8 متتاليان والبسط أقل من كل منهما، فالطرفان قريبان من 1 ونوحّد المقام إلى 56.',
    steps: ['المقام المشترك للعددين 7 و 8 هو 56.', '6/7 = 48/56 و 7/8 = 49/56.', 'نقارن البسطين: 48 < 49، إذن 6/7 < 7/8.'],
    pitfall: 'ظن أن 6/7 أكبر لأن بسطه أقرب إلى مقامه بنفس الفارق الظاهري دون توحيد المقام.',
  },
  {
    id: 'u2-p85-q6-d', label: 'د', left: frac(4, 5), right: decimal('0.8'), answer: '=',
    strategy: 'نحوّل الكسر إلى عدد عشري بموازاة المقام مع قوة العشر.',
    steps: ['نحوّل 4/5 إلى أجزاء من عشرة: 4/5 = 8/10.', '8/10 = 0.8.', 'القيمتان متساويتان، إذن الرمز =.'],
  },
  {
    id: 'u2-p85-q6-e', label: 'هـ', left: decimal('0.317'), right: decimal('0.217'), answer: '>',
    strategy: 'العددان من الأجزاء من ألف بنفس عدد المنازل، فنقارن منزلة بمنزلة من اليسار.',
    steps: ['جزء الأعشار: 3 في العدد الأول و 2 في الثاني.', 'لأن 3 > 2 نتوقف فوراً: 0.317 > 0.217.'],
    pitfall: 'البدء بالمقارنة من منزلة الأجزاء من ألف.',
  },
  {
    id: 'u2-p85-q6-f', label: 'و', left: mixed(7, 1, 2), right: decimal('7.65'), answer: '<',
    strategy: 'نحوّل العدد المختلط إلى عدد عشري بموازاة الكسر 1/2 مع قوة العشر.',
    steps: ['7 1/2 = 7.5 لأن 1/2 = 5/10 = 0.5.', 'نقارن جزء الأعشار: 5 < 6.', 'إذن 7.5 < 7.65، أي 7 1/2 < 7.65.'],
    pitfall: 'تجاهل الكسر 1/2 والمقارنة بالجزء الصحيح فقط فيُظن الطرفان متساويين.',
  },
  {
    id: 'u2-p86-q6-g', label: 'ز', left: frac(4, 14), right: frac(2, 7), answer: '=',
    strategy: 'نبسّط الكسر الأول بقسمة بسطه ومقامه على العدد نفسه.',
    steps: ['نقسم بسط ومقام 4/14 على 2: 4 ÷ 2 = 2 و 14 ÷ 2 = 7.', 'يصبح 4/14 = 2/7.', 'الكسران متكافئان، إذن الرمز =.'],
    pitfall: 'مقارنة البسطين 4 و 2 دون التبسيط.',
  },
  {
    id: 'u2-p86-q6-h', label: 'ح', left: mixed(2, 3, 4), right: decimal('2.75'), answer: '=',
    strategy: 'نحوّل الكسر 3/4 إلى عدد عشري معروف (رباعية الأعشار).',
    steps: ['3/4 = 75/100 = 0.75.', 'إذن 2 3/4 = 2.75.', 'القيمتان متساويتان، إذن الرمز =.'],
  },
  {
    id: 'u2-p86-q6-t', label: 'ط', left: decimal('0.032'), right: decimal('0.023'), answer: '>',
    strategy: 'العددان من الأجزاء من ألف، ونقارن من اليسار إلى اليمين.',
    steps: ['الأعشار متساوية (0) والمئات: 3 مقابل 2.', 'لأن 3 > 2 في منزلة المئات: 0.032 > 0.023.'],
    pitfall: 'المقارنة بعدد الأرقام أو بآخر منزلة قبل المنازل الأعلى.',
  },
]

/* ---------- التمرينان ⑦ و⑧ · ترتيب الكسور ---------- */

export type OrderGroup = {
  id: string
  label: string
  page: Unit2ExercisesPage
  items: MathVal[]
  commonDenominator: number
  steps: string[]
  pitfall?: string
}

function orderSteps(group: OrderGroup, direction: 'asc' | 'desc'): string[] {
  const converted = group.items
    .map((item) => {
      if (item.kind !== 'fraction') throw new Error('order groups use plain fractions')
      return `${item.n}/${item.d} = ${item.n * (group.commonDenominator / item.d)}/${group.commonDenominator}`
    })
    .join('، ')
  const numerators = group.items.map((item) => (item.kind === 'fraction' ? item.n * (group.commonDenominator / item.d) : 0))
  const sortedAsc = [...numerators].sort((a, b) => a - b)
  const ordered = direction === 'asc' ? sortedAsc : [...sortedAsc].reverse()
  const solutionLabels = ordered.map((numerator) => {
    const match = group.items.find((item) => item.kind === 'fraction' && item.n * (group.commonDenominator / item.d) === numerator)
    return match ? valueLabel(match) : ''
  })
  const directionText = direction === 'asc' ? 'تصاعدياً (من الأصغر إلى الأكبر)' : 'تنازلياً (من الأكبر إلى الأصغر)'
  return [
    `نوحّد مقامات الكسور إلى ${group.commonDenominator}: ${converted}.`,
    `نقارن البسوط بعد التوحيد: ${[...numerators].sort((a, b) => (direction === 'asc' ? a - b : b - a)).join(' < ')}.`,
    `الترتيب ${directionText}: ${solutionLabels.join('، ')}.`,
  ]
}

function orderBranch(group: OrderGroup, direction: 'asc' | 'desc', why: string, pitfall?: string): SourceBranch {
  const sorted = [...group.items].sort((a, b) => (direction === 'asc' ? valueOf(a) - valueOf(b) : valueOf(b) - valueOf(a)))
  const labels = sorted.map((item) => valueLabel(item))
  return {
    id: group.id,
    label: group.label,
    prompt: `رتّب الكسور ${direction === 'asc' ? 'ترتيباً تصاعدياً' : 'ترتيباً تنازلياً'}: ${group.items.map((item) => valueLabel(item)).join('، ')}.`,
    given: `الكسور ${group.items.map((item) => valueLabel(item)).join('، ')}.`,
    required: direction === 'asc' ? 'ترتيب الكسور من الأصغر إلى الأكبر.' : 'ترتيب الكسور من الأكبر إلى الأصغر.',
    rule: 'نوحّد المقامات ثم نقارن البسوط ونرتب حسب المطلوب.',
    why,
    steps: orderSteps(group, direction),
    answer: labels.join('، ') + '.',
    check: 'نطابق كل كسرين متجاورين في الترتيب فيبقى الفرق بينهما بالاتجاه المطلوب.',
    pitfall,
  }
}

const ORDER_ASC_WHY = 'الترتيب التصاعدي يبدأ بأصغر كسر؛ وتوحيد المقامات يجعل المقارنة مقارنة بسوط لا أكثر.'
const ORDER_DESC_WHY = 'الترتيب التنازلي يبدأ بأكبر كسر؛ بعد توحيد المقامات نرتب البسوط من الأكبر إلى الأصغر.'

export const q7Groups: OrderGroup[] = [
  { id: 'u2-p86-q7-a', label: 'أ', page: 86, items: [frac(7, 8), frac(1, 4), frac(1, 2), frac(1, 8)], commonDenominator: 8, steps: [], pitfall: 'ترتيب الكسور حسب المقام (أكبر مقام يظن أصغر) قبل التوحيد.' },
  { id: 'u2-p86-q7-b', label: 'ب', page: 86, items: [frac(5, 6), frac(1, 3), frac(7, 12), frac(3, 4)], commonDenominator: 12, steps: [] },
  { id: 'u2-p86-q7-c', label: 'ج', page: 86, items: [frac(1, 5), frac(3, 4), frac(7, 10), frac(1, 20)], commonDenominator: 20, steps: [] },
]
export const q8Groups: OrderGroup[] = [
  { id: 'u2-p86-q8-a', label: 'أ', page: 86, items: [frac(3, 7), frac(1, 14), frac(1, 2), frac(2, 7)], commonDenominator: 14, steps: [] },
  { id: 'u2-p86-q8-b', label: 'ب', page: 86, items: [frac(1, 2), frac(7, 9), frac(1, 18), frac(5, 9)], commonDenominator: 18, steps: [] },
  { id: 'u2-p86-q8-c', label: 'ج', page: 86, items: [frac(4, 5), frac(13, 30), frac(5, 6), frac(1, 5)], commonDenominator: 30, steps: [] },
]

/* ---------- التمرين ⑨ · من الكسر المركب إلى كسر عادي ---------- */

export type MixedToImproperItem = {
  id: string
  label: string
  w: number
  n: number
  d: number
  pitfall?: string
}

function toImproperBranch(item: MixedToImproperItem): SourceBranch {
  const numerator = item.w * item.d + item.n
  return {
    id: item.id,
    label: item.label,
    prompt: `اكتب الكسر المركب ${item.w} ${item.n}/${item.d} بشكل كسر عادي.`,
    given: `الكسر المركب ${item.w} ${item.n}/${item.d}.`,
    required: 'كتابة الكسر المركب كسراً عادياً بسط واحد ومقام واحد.',
    rule: 'نضرب العدد الصحيح في مقام الكسر ونضيف إليه البسط، ويبقى المقام كما هو.',
    why: 'كل وحدة من العدد الصحيح تعادل عدداً من أجزاء المقام كاملاً، فيتحول الصحيح كله إلى كسرات من المقام نفسه يضاف إليها كسر الباقي.',
    steps: [
      `نحوّل العدد الصحيح ${item.w} إلى كسرات من المقام ${item.d}: ${item.w} × ${item.d} = ${item.w * item.d}.`,
      `نضيف بسط الكسر: ${item.w * item.d} + ${item.n} = ${numerator}.`,
      `إذن ${item.w} ${item.n}/${item.d} = ${numerator}/${item.d}.`,
    ],
    answer: `${numerator}/${item.d}.`,
    check: `نقسم ${numerator} على ${item.d}: الخارج ${item.w} والباقي ${item.n}، أي نعود إلى الكسر المركب الأصلي.`,
    pitfall: item.pitfall,
  }
}

export const q9Items: MixedToImproperItem[] = [
  { id: 'u2-p86-q9-a', label: 'أ', w: 15, n: 1, d: 6, pitfall: 'نسيان إضافة البسط بعد ضرب الصحيح في المقام فيُكتب 90/6 بدل 91/6.' },
  { id: 'u2-p86-q9-b', label: 'ب', w: 10, n: 2, d: 3, pitfall: 'ضرب العدد الصحيح في البسط (10 × 2) بدل ضربه في المقام.' },
  { id: 'u2-p86-q9-c', label: 'ج', w: 5, n: 1, d: 4, pitfall: 'تغيير المقام بعد التحويل.' },
  { id: 'u2-p86-q9-d', label: 'د', w: 30, n: 2, d: 7, pitfall: 'خطأ في ضرب 30 × 7 فيتعطل جمع البسط.' },
]

/* ---------- التمرين ⑩ · من كسر عادي إلى كسر مركب ---------- */

export type ImproperToMixedItem = {
  id: string
  label: string
  n: number
  d: number
  simplify?: { from: string; to: string; how: string }
  pitfall?: string
}

function toMixedBranch(item: ImproperToMixedItem): SourceBranch {
  const whole = Math.floor(item.n / item.d)
  const remainder = item.n % item.d
  const steps = [
    `نقسم البسط على المقام: ${item.n} ÷ ${item.d} = ${whole} والباقي ${remainder}.`,
    `خارج القسمة ${whole} هو العدد الصحيح، والباقي ${remainder} بسط الكسر، والمقام يبقى ${item.d}.`,
    `إذن ${item.n}/${item.d} = ${whole} ${remainder}/${item.d}.`,
  ]
  let answer = `${whole} ${remainder}/${item.d}.`
  if (item.simplify) {
    steps.push(item.simplify.how)
    answer = `${whole} ${item.simplify.to}.`
  }
  return {
    id: item.id,
    label: item.label,
    prompt: `اكتب الكسر ${item.n}/${item.d} بشكل كسر مركب.`,
    given: `الكسر ${item.n}/${item.d}.`,
    required: 'كتابة الكسر على صورة عدد صحيح يليه كسر عادي أصغر من الواحد.',
    rule: 'نقسم البسط على المقام قسمة مع باقٍ: الخارج عدد صحيح، والباقي بسط، والمقام كما هو.',
    why: 'البسط يحوي عدداً كاملاً من مجموعات المقام؛ كل مجموعة مقامات تعادل وحدة واحدة، وما بقي بعد إزالة المجموعات الكاملة هو الكسر.',
    steps,
    answer,
    check: `نعيد التحويل: ${whole} × ${item.d} + ${remainder} = ${item.n}.`,
    pitfall: item.pitfall,
  }
}

export const q10Items: ImproperToMixedItem[] = [
  { id: 'u2-p86-q10-a', label: 'أ', n: 140, d: 9, pitfall: 'خطأ في جدول الضرب 9 عند إيجاد أكبر مضاعف لـ 9 أقل من 140.' },
  { id: 'u2-p86-q10-b', label: 'ب', n: 50, d: 49, pitfall: 'ظن الكسر فرعياً لأن الفرق صغير، مع أن البسط أكبر من المقام.' },
  { id: 'u2-p86-q10-c', label: 'ج', n: 20, d: 7, pitfall: 'كتابة الباقي على 10 بدل المقام 7.' },
  {
    id: 'u2-p86-q10-d', label: 'د', n: 70, d: 40,
    simplify: { from: '30/40', to: '3/4', how: 'نبسّط الكسر 30/40 بقسمة بسطه ومقامه على 10 فيصير 3/4، فيكون الجواب 1 3/4.' },
    pitfall: 'التوقف عند 1 30/40 دون التبسيط، أو قسمة 70 على 40 قسمة عشرية بدل قسمة مع باقٍ.',
  },
]

/* ============================================================ أنشطة مفاهيم الخطوات */

export const q1Data = {
  places: ['الوحدات', 'العشرات', 'المئات', 'الآلاف', 'عشرات الآلاف', 'مئات الآلاف', 'الملايين'],
  worked: {
    number: 3140500,
    digitsUnitsToMillions: [0, 0, 5, 0, 4, 1, 3],
    steps: [
      'نوزّع أرقام العدد على الخانات السبع بدءاً من الوحدات: 0 وحدات، 0 عشرات، 5 مئات، 0 آلاف، 4 عشرات الآلاف، 1 مئة ألف، 3 ملايين.',
      'نقرأ من أعلى منزلة: 3 ملايين، ثم 140 ألفاً، ثم 500.',
      'الصيغة اللفظية: ثلاثة ملايين ومئة وأربعون ألفاً وخمسون.',
    ],
  },
  mistakes: [
    {
      wrong: 'إهمال الخانة الفارغة فتنزاح المنازل: كتابة 31405 بدل 3140500.',
      right: 'نضع صفراً في كل خانة فارغة لتبقى القيم في منازلها: 3140500.',
      why: 'الصفر يحفظ مكان المنزلة؛ بدونه تهبط كل القيم وتتغير قيمة العدد كلياً.',
    },
    {
      wrong: 'وضع صفر في خانة الملايين (مثل 0765430) وعدّه عدداً من سبع خانات.',
      right: 'أصغر عدد من سبع خانات هو 1000000؛ رقم الملايين من 1 إلى 9.',
      why: 'الصفر في أقصى يسار العدد لا يُكتب في الأعداد الطبيعية، فيسقط العدد إلى ست خانات.',
    },
  ],
}

export const q2Data = {
  building21: 1081785,
  building30: 1082180,
  worked: {
    left: 45210,
    right: 45102,
    steps: [
      'العددان من خمس خانات كلاهما، إذن نقارن من أعلى منزلة.',
      'عشرات الآلاف: 4 = 4، والآلاف: 5 = 5.',
      'منزلة المئات تحسم: 2 في العدد الأول مقابل 1 في الثاني.',
      'إذن 45210 > 45102.',
    ],
  },
  practice: [
    { left: natural('76543'), right: natural('76453'), answer: '>' as const, why: 'المنازل متساوية حتى الآلاف؛ في منزلة المئات: 5 > 4 إذن 76543 أكبر.' },
    { left: natural('900999'), right: natural('901000'), answer: '<' as const, why: 'في منزلة مئة الألف: 0 < 1، إذن 901000 أكبر ولو كانت بدايته 90.' },
  ],
  mistakes: [
    {
      wrong: 'بدء المقارنة من منزلة الوحدات.',
      right: 'نبدأ دائماً من أعلى منزلة (الملايين هنا) وننزل حتى نجد فرقاً.',
      why: 'قيمة أي منزلة أدنى أصغر من مجموع كل ما فوقها، فالفرق الأول من الأعلى هو الحاسم.',
    },
    {
      wrong: 'الحكم على الأكبر من أول رقم أو من طول العدد وحده عندما تتساوى المنازل.',
      right: 'تساوي أولى المنازل لا يعني تساوي العددين؛ نكمل المقارنة منزلة بعد منزلة.',
      why: 'العددان 1081785 و 1082180 يبدآن بالأرقام نفسها 108، والفرق كله في منزلة الآلاف.',
    },
  ],
}

export const q3Data = {
  samples: [
    { key: 'A', value: 1205348 },
    { key: 'B', value: 1214999 },
    { key: 'C', value: 1002347 },
  ],
  worked: {
    numbers: [45320, 543200, 54320],
    solution: [45320, 54320, 543200],
    steps: [
      'نقارن عدد المنازل أولاً: 543200 من ست خانات فهو الأكبر مهما كانت أرقامه.',
      'العددان 45320 و 54320 من خمس خانات؛ منزلة عشرات الآلاف تحسم: 4 < 5.',
      'الترتيب التصاعدي: 45320 ثم 54320 ثم 543200.',
    ],
  },
  practice: [789500, 798500, 789050],
  mistakes: [
    {
      wrong: 'ترتيب الأعداد حسب أول رقم فقط: اعتبار 999999 أكبر من 1000000 لأنه يبدأ بـ 9.',
      right: 'عدد المنازل أولاً: 1000000 من سبع خانات فهو الأكبر.',
      why: 'كل منزلة جديدة تساوي عشرة أضعاف مجموع ما قبلها.',
    },
    {
      wrong: 'مقارنة A مع B من منزلة المئات (5 مقابل 9) مباشرة.',
      right: 'A و B متساويان في مئة الألف (2 = 2)؛ منزلة عشرات الآلاف هي الحاسمة: 0 < 1.',
      why: 'المقارنة الصحيحة تنطلق من أعلى منزلة ولا تقفز إلى منزلة أدنى قبلها.',
    },
  ],
}

export const q4Data = {
  lower: 139900,
  upper: 140000,
  clues: [
    'عشراتي أكبر من آحادي بـ 6.',
    'مجموع عشراتي مع آحادي 8.',
  ],
  worked: {
    text: 'أنا عدد بين 70 و 80. عشراتي أكبر من آحادي بـ 4، ومجموع عشراتي مع آحادي 10. فمن أنا؟',
    steps: [
      'العدد بين 70 و 80 فيكون رقم عشراته 7.',
      'نطبق الشرط الأول: 7 = آحاد + 4، إذن الآحاد = 3.',
      'نتحقق من الشرط الثاني: 7 + 3 = 10 ✓.',
      'العدد هو 73.',
    ],
  },
  mistakes: [
    {
      wrong: 'حل الشرطين بأي عددين مجموعهما 8 دون فرق 6، مثل 5 و 3.',
      right: 'الشرطان معاً: 7 − 1 = 6 و 7 + 1 = 8، فالرقمان 7 و 1.',
      why: 'كل شرط يقلص الاحتمالات، والعدد الصحيح يحقق الاثنين معاً لا واحداً منهما.',
    },
    {
      wrong: 'نسيان قيد «بين 139900 و 140000» فتُقبل إجابة مثل 71.',
      right: 'العدد المطلوب من سبع خانات شكله 1399□□، فنجيب 139971.',
      why: 'قيد المجال جزء من المعطيات وليس تفصيلاً زائداً.',
    },
  ],
}

export const q5Data = {
  concept: 'المضاعفات للعدد هي نواتج ضربه في 1 و 2 و 3...؛ المضاعف المشترك لعددين أو أكثر هو ما يظهر في قوائم مضاعفاتها كلها، وأصغرها (عدا الصفر) هو المضاعف المشترك الأصغر.',
  why: 'نحتاج المضاعف المشترك الأصغر عند توحيد المقامات، ومزامنة الأحداث المكررة، وأي مسألة تجتمع فيها دورات مختلفة.',
  when: 'متى طُلب منك «أصغر عدد يقبل القسمة على كل الأعداد المعطاة» فالمطلوب م.م.أ مباشرة.',
  worked: {
    numbers: [4, 6],
    lcm: 12,
    steps: [
      'نكتب مضاعفات العدد الأكبر 6: 6، 12، 18، 24، ...',
      'نفحص بالترتيب: 6 ÷ 4 لا يكون عدداً طبيعياً، أما 12 ÷ 4 = 3 ✓.',
      'إذن المضاعف المشترك الأصغر للعددين 4 و 6 هو 12، وهو أصغر من 4 × 6 = 24.',
    ],
  },
  mistakes: [
    {
      wrong: 'أخذ حاصل ضرب الأعداد دائماً: 4 × 9 = 36 صحيح هنا بالصدفة، لكن 4 × 6 = 24 ليس أصغر مضاعف مشترك.',
      right: 'نبحث عن أول مضاعف مشترك؛ حاصل الضرب مضاعف مشترك لكنه ليس دائماً الأصغر.',
      why: 'حين يشترك العددان في عامل (مثل 4 و 6 في العامل 2) يصغر المضاعف المشترك.',
    },
    {
      wrong: 'الخلط بين م.م.أ والقاسم المشترك الأكبر.',
      right: 'م.م.أ عدد يقبل القسمة على الأعداد، والقاسم المشترك الأكبر عدد يقسمها.',
      why: 'الأول تكبر قيمته مع الأعداد والثاني يصغر.',
    },
  ],
}

export const q6Data = {
  strategies: [
    { title: 'مقامان متساويان', body: 'نقارن البسطين مباشرة: 5/12 و 7/12 فالبسط الأكبر يعني كسراً أكبر لأن الأجزاء من الحجم نفسه.' },
    { title: 'بسطان متساويان', body: 'نقارن المقامين بالمقلوب: 2/5 أكبر من 2/9 لأن تقسيم القطعة نفسها إلى 5 يعطي أجزاء أكبر من تقسيمها إلى 9.' },
    { title: 'كسر مع عدد عشري', body: 'نوحّد الصورتين: إما نحوّل الكسر إلى عدد عشري (بموازاة المقام مع 10 أو 100 أو 1000) أو نحوّل العدد العشري إلى كسر.' },
    { title: 'عدد مختلط مع عدد عشري', body: 'نحوّل الجزء الكسري إلى عشري (1/2 = 0.5، 3/4 = 0.75) ثم نقارن الجزء الصحيح أولاً ثم الجزء العشري.' },
  ],
  worked: {
    left: frac(3, 4),
    right: frac(5, 12),
    steps: [
      'المقامان 4 و 12 مختلفان، فنبحث عن مقام مشترك: 12 يقبل القسمة على 4.',
      'نحوّل: 3/4 = 9/12 (نضرب البسط والمقام في 3).',
      'نقارن البسطين: 9 > 5 إذن 3/4 > 5/12.',
    ],
  },
  practice: [
    { left: frac(2, 5), right: frac(2, 9), answer: '>' as const, why: 'البسطتان متساويتان (2 = 2)، فالمقام الأصغر يعني أجزاء أكبر: 2/5 > 2/9.' },
    { left: decimal('0.5'), right: frac(7, 10), answer: '<' as const, why: '0.5 = 5/10 و 5 < 7، إذن 0.5 < 7/10.' },
    { left: frac(9, 8), right: natural('1'), answer: '>' as const, why: '9/8 أكبر من الواحد لأن البسط أكبر من المقام، و 1 = 8/8.' },
  ],
  mistakes: [
    {
      wrong: 'مقارنة البسطين عند اختلاف المقامين: 3/4 □ 5/12 بمقارنة 3 مع 5.',
      right: 'المقامان مختلفان فيجب التوحيد أولاً: 3/4 = 9/12 ثم نقارن 9 مع 5.',
      why: 'البسط وحده لا يدل على الحجم إلا ضمن أجزاء من الحجم نفسه.',
    },
    {
      wrong: 'قراءة 0.02 أكبر من 0.3 لأن 2 أكبر من 3 ناقصاً أو لأن رقمها في منزلة أدنى.',
      right: 'نوحّد المنازل: 0.30 و 0.02، فجزء الأعشار يحسم: 3 > 0.',
      why: 'المقارنة العشرية تنطلق من أعلى منزلة عشرية (الأعشار).',
    },
  ],
}

export const q7Data = {
  concept: 'الترتيب التصاعدي يرتّب القيم من الأصغر إلى الأكبر. للمقارنة بين كسور مقاماتها مختلفة نوحّد المقامات: نحوّل كل كسر إلى كسر مكافئ بالمقام المشترك، ثم يصبح الترتيب مقارنة بسوط فقط.',
  when: 'نستعمل التوحيد عندما تختلف المقامات؛ وإذا تساوت المقامات نرتب البسوط مباشرة.',
  worked: {
    items: [frac(2, 3), frac(5, 6), frac(1, 2)],
    commonDenominator: 6,
    steps: [
      'نوحّد المقامات إلى 6: 2/3 = 4/6، و 5/6 يبقى كما هو، و 1/2 = 3/6.',
      'نقارن البسوط: 3 < 4 < 5.',
      'الترتيب التصاعدي: 1/2 ثم 2/3 ثم 5/6.',
    ],
  },
  practice: [frac(3, 8), frac(5, 8), frac(1, 8), frac(7, 8)] as FractionVal[],
  mistakes: [
    {
      wrong: 'ترتيب الكسور حسب المقام: ظن أن 1/8 أصغر من 1/2 لأن مقامه أكبر.',
      right: 'المقام الأكبر يعني أجزاء أصغر: 1/8 = 1/8 أما 1/2 = 4/8 فهي أكبر.',
      why: 'وحدة الكسر تتقلص كلما كبر المقام.',
    },
    {
      wrong: 'ترتيب الكسور حسب البسط فقط عندما تختلف المقامات.',
      right: 'نوحّد المقامات أولاً ثم نقارن البسوط.',
      why: 'البسوط لا تُقارن إلا ضمن أجزاء من الحجم نفسه.',
    },
  ],
}

export const q8Data = {
  concept: 'الترتيب التنازلي يرتّب القيم من الأكبر إلى الأصغر، وهو عكس الاتجاه التصاعدي بنفس خطوات التوحيد: مقام مشترك ثم مقارنة بسوط ثم عكس الترتيب.',
  when: 'نستعمله حين يُطلب «من الأكبر إلى الأصغر» كما في التمرين ⑧.',
  worked: {
    items: [frac(2, 5), frac(7, 10), frac(1, 2)],
    commonDenominator: 10,
    steps: [
      'نوحّد المقامات إلى 10: 2/5 = 4/10، و 7/10 يبقى، و 1/2 = 5/10.',
      'نقارن البسوط من الأكبر: 7 > 5 > 4.',
      'الترتيب التنازلي: 7/10 ثم 1/2 ثم 2/5.',
    ],
  },
  practice: [frac(3, 4), frac(3, 8), frac(3, 5)] as FractionVal[],
  mistakes: [
    {
      wrong: 'تنفيذ الترتيب التصاعدي معكوساً دون توحيد المقامات.',
      right: 'نوحّد المقامات أولاً ثم نرتب البسوط تنازلياً.',
      why: 'عكس قائمة غير مرتبة لا ينتج ترتيباً صحيحاً.',
    },
    {
      wrong: 'في الكسور ذات البسط نفسه الترتيب حسب المقام تصاعدياً كالعادة.',
      right: 'مع البسط نفسه ينعكس الحكم: أكبر مقام يعني كسراً أصغر.',
      why: 'تقسيم الكل إلى أجزاء أكثر يصغّر حجم الجزء.',
    },
  ],
}

export const q9Data = {
  concept: 'الكسر المركب عدد صحيح يليه كسر عادي أصغر من الواحد، مثل 2 1/3. لتحويله إلى كسر عادي نحوّل العدد الصحيح كله إلى كسرات من المقام نفسه: كل وحدة تساوي مقاماً كاملاً من الأجزاء.',
  why: 'هذا التحويل يوحّد صورة العدد فيصبح جاهزاً للجمع والطرح والمقارنة مع الكسور مباشرة.',
  worked: {
    w: 2, n: 1, d: 3,
    steps: [
      'نحوّل العدد الصحيح 2 إلى أثلاث: 2 × 3 = 6، أي 6/3.',
      'نضيف كسر الباقي: 6/3 + 1/3 = 7/3.',
      'إذن 2 1/3 = 7/3، وهذا هو قاعدة (الصحيح × المقام + البسط) على المقام.',
    ],
  },
  practice: [
    { w: 1, n: 1, d: 2 },
    { w: 3, n: 2, d: 5 },
  ],
  mistakes: [
    {
      wrong: 'نسيان إضافة البسط: 2 1/3 تصبح 6/3 بدل 7/3.',
      right: 'بعد ضرب الصحيح في المقام نجمع البسط دائماً: 6 + 1 = 7.',
      why: 'الكسر المرفق جزء أصلي من العدد لا يُهمَل.',
    },
    {
      wrong: 'ضرب العدد الصحيح في البسط بدل المقام.',
      right: 'المضروب في الصحيح هو المقام لأنه عدد أجزاء الوحدة.',
      why: 'الصحيح يتحول إلى وحدات كاملة من المقام لا إلى بسوط.',
    },
  ],
}

export const q10Data = {
  concept: 'التحويل العكسي: كسر بسطه أكبر من مقامه يحمل وحدات كاملة مخبأة داخله. نقسم البسط على المقام: خارج القسمة هو العدد الصحيح، والباقي بسط الكسر، والمقام يبقى كما هو.',
  why: 'الصورة المركبة تخبرنا مباشرة كم وحدة كاملة يملك العدد وأي جزء زائد، لذلك تُفضَّل عند القراءة والقياس.',
  worked: {
    n: 7, d: 3,
    steps: [
      'نقسم: 7 ÷ 3 = 2 والباقي 1.',
      'العدد الصحيح 2، والباقي 1 بسط، والمقام 3.',
      'إذن 7/3 = 2 1/3، ونتحقق: 2 × 3 + 1 = 7 ✓.',
    ],
  },
  practice: [
    { n: 9, d: 4 },
    { n: 17, d: 5 },
  ],
  mistakes: [
    {
      wrong: 'كتابة الباقي على 10 أو على عدد آخر بدل المقام الأصلي.',
      right: 'المقام لا يتغير: الباقي دائماً على المقام نفسه.',
      why: 'أجزاء الكسر هي أجزاء من المقام الأصلي لا من عدد جديد.',
    },
    {
      wrong: 'إهمال الباقي: 20/7 = 2 فقط.',
      right: 'القسمة مع باقٍ: 20 ÷ 7 = 2 والباقي 6، فالجواب 2 6/7.',
      why: 'الباقي يمثل كسراً حقيقياً من الوحدة لا يُهمل.',
    },
  ],
}

export const q11Data = {
  rectangle: { DC: 8, BE: 3 },
  squareSide: 2,
  concept: 'في المستطيل كل ضلعين متقابلين متساويان، وفي المربّع الأضلاع الأربعة كلها متساوية. وعندما تلتقي قطعان على استقامة واحدة يكون طولهما معاً مجموع طولهما.',
  why: 'خواص الأشكال تحل محل القياس: بدل قياس كل ضلع بالمسطرة نستنتج طوله من الأضلاع المعطية.',
  lengths: { DG: 10, AB: 8, CB: 5 },
  worked: {
    target: 'AB',
    steps: [
      'AB ضلع أفقي علوي في المستطيل ABCD، وهو يقابل الضلع DC.',
      'في المستطيل الضلعان المتقابلان متساويان، وطول DC معطى في الشكل: 8 سم.',
      'إذن AB = DC = 8 سم.',
    ],
  },
  mistakes: [
    {
      wrong: 'أخذ CB = 3 سم اعتماداً على قياس BE المكتوب فقط.',
      right: 'CB = CE + EB، و CE ضلع في المربّع فيساوي 2 سم، إذن CB = 2 + 3 = 5 سم.',
      why: 'النقطة E تقسم الضلع BC إلى جزأين على استقامة واحدة.',
    },
    {
      wrong: 'حساب DG = DC = 8 سم ونسيان CG.',
      right: 'DG = DC + CG = 8 + 2 = 10 سم.',
      why: 'النقطة C تقع بين D و G على الاستقامة نفسها.',
    },
  ],
}

/* ============================================================ سجل المصدر */

const element: SourceElement = {
  id: 'u2-p85-intro',
  page: 85,
  section: 'عنوان صفحتَي التمرينات',
  kind: 'content',
  prompt: 'تمرينات الوحدة الثانية',
  given: 'صفحتا التمرينات الختاميتان للوحدة الثانية: ص 85 و ص 86، وأحد عشر تمريناً مرقّمة ① إلى ⑪.',
  required: 'مراجعة مهارات الوحدة الثانية كلها بحل التمارين الأحد عشر.',
  rule: 'كل تمرين يراجع مهارة من مهارات الوحدة: الأعداد حتى الملايين ومقارنتها وترتيبها، والمضاعف المشترك الأصغر، ومقارنة الكسور وترتيبها، والتحويل بين الكسر المركب والكسر العادي، والأجزاء العشرية، وخواص المستطيل والمربّع.',
  why: 'التمرينات الختامية تجمع مهارات الوحدة في مسائل قصيرة متنوعة فتكشف ما أتقنه الطالب وما يحتاج إلى إعادة نظر قبل اختبار الوحدة.',
  steps: [
    'نقرأ عنوان الصفحتين: تمرينات الوحدة الثانية.',
    'نحدد مهارة كل تمرين قبل حلّه لنعرف القاعدة التي نستعملها.',
    'نحل كل تمرين بأنفسنا أولاً ثم نقارن بالحل الكامل في المنصة.',
  ],
  answer: 'إتقان المهارات الأحد عشر المراجَعة عبر التمارين ① إلى ⑪ استعداداً لاختبار الوحدة.',
  check: 'يستطيع الطالب بعد الدرس حل كل تمرين من الصفتين 85 و 86 دون الرجوع إلى الكتاب.',
}

const q1: SourceElement = {
  ...element,
  id: 'u2-p85-q1',
  section: 'السؤال ① · جدول الخانات والصيغة اللفظية',
  kind: 'exercise',
  prompt: 'أنشئ جدول خانات مؤلَّف من الحاقات (الوحدات، الآلاف، الملايين):',
  given: 'جدول خانات حقوله (الوحدات، الآلاف، الملايين) وهو يغطي المنازل السبع حتى الملايين.',
  required: 'كتابة ثلاثة أعداد من سبع خانات، وقراءتها بالصيغة اللفظية، وترتيبها تصاعدياً.',
  rule: 'العدد من سبع خانات يبدأ بخانة الملايين (رقم من 1 إلى 9) وينتهي بخانة الوحدات، وتُقرأ قيمته من أعلى منزلة إلى أدناها.',
  why: 'جدول المنازل يربط كتابة العدد بقراءته وترتيبه، وهو أساس المقارنة والتحليل في كل تمارين الأعداد.',
  steps: [
    'نرسم الجدول بسبع خانات من الوحدات إلى الملايين.',
    'نكتب ثلاثة أعداد نختارها بشط رقم رقم، مع رقم غير صفري في خانة الملايين.',
    'نقرأ كل عدداً من أعلى منزلة: ملايين، آلاف، مئات وعشرات وآحاد.',
    'نرتّب الأعداد الثلاثة تصاعدياً بعد مقارنتها.',
  ],
  answer: 'مثال: 3140500 و 2601450 و 1081785؛ صيغة 3140500 اللفظية «ثلاثة ملايين ومئة وأربعون ألفاً وخمسون»؛ والترتيب التصاعدي: 1081785 ثم 2601450 ثم 3140500.',
  check: 'كل عدد يقع بين 1000000 و 9999999، وقراءته اللفظية تعيد توليد أرقامه عند تحليلها.',
  pitfall: 'ترك خانة فارغة دون صفر أو بدء خانة الملايين بصفر.',
  branches: [
    {
      id: 'u2-p85-q1-a',
      label: 'أ',
      prompt: 'اكتب في الجدول ثلاثة أعداد كل منها مؤلَّف من سبع خانات.',
      given: 'جدول الخانات السبع (الوحدات إلى الملايين).',
      required: 'كتابة ثلاثة أعداد مختلفة كل منها من سبع خانات.',
      rule: 'رقم خانة الملايين من 1 إلى 9، وبقية الخانات من 0 إلى 9.',
      why: 'العدد من سبع خانات قيمته من 1000000 إلى 9999999، ولا يبدأ بصفر وإلا سقطت منزلته العليا.',
      steps: [
        'نختار رقماً من 1 إلى 9 لخانة الملايين.',
        'نوزّع الأرقام على خانات مئة الألف حتى الوحدات ويجوز فيها الصفر.',
        'نكرر ذلك لثلاثة أعداد مختلفة.',
      ],
      answer: 'أي ثلاثة أعداد من سبع خانات تصلح، مثل: 3140500 و 2601450 و 1081785.',
      check: 'نعدّ خانات كل عدد: سبع خانات تعني قيمة بين 1000000 و 9999999.',
      pitfall: 'كتابة عدد من ست خانات معتقداً أنه من سبع.',
    },
    {
      id: 'u2-p85-q1-b',
      label: 'ب',
      prompt: 'اكتب كل عدد بالصيغة اللفظية.',
      given: 'الأعداد الثلاثة المكتوبة في الجدول.',
      required: 'قراءة كل عدد قراءة لفظية كاملة.',
      rule: 'نقرأ من الملايين: عدد الملايين ثم «مليون/ملايين»، ثم مجموعة الآلاف، ثم المئات والعشرات والآحاد، ونصل الأجزاء بواو العطف.',
      why: 'الصيغة اللفظية تكشف تحليل العدد إلى منزله فيثبت فهم القيمة المنزلية.',
      steps: [
        'نحدد مجموعة الملايين ونقرأها: 3 → ثلاثة ملايين.',
        'نقرأ مجموعة الآلاف: 140 → مئة وأربعون ألفاً.',
        'نقرأ المجموعة الأخيرة: 500 → خمسُمئة.',
        'نصل الأجزاء: ثلاثة ملايين ومئة وأربعون ألفاً وخمسون.',
      ],
      answer: 'مثال: 3140500 = ثلاثة ملايين ومئة وأربعون ألفاً وخمسون.',
      check: 'نعيد تحليل القراءة اللفظية إلى أرقام فنحصل على العدد نفسه.',
    },
    {
      id: 'u2-p85-q1-c',
      label: 'ج',
      prompt: 'رتّب تلك الأعداد تصاعديًّا (من الأصغر إلى الأكبر).',
      given: 'الأعداد الثلاثة المكتوبة.',
      required: 'ترتيب الأعداد الثلاثة من الأصغر إلى الأكبر.',
      rule: 'نقارن عدد الخانات أولاً، فإن تساوت قارنّا من أعلى منزلة إلى أدناها.',
      why: 'الترتيب التصاعدي تطبيق مباشر لقاعدة المقارنة، وهو مهارة الوحدة الأولى في هذا الدرس.',
      steps: [
        'نتأكد أن الأعداد الثلاثة من سبع خانات.',
        'نقارن زوجاً زوجاً من خانة الملايين حتى نجد فرقاً.',
        'نكتب الترتيب من الأصغر إلى الأكبر.',
      ],
      answer: 'مثال: 1081785 ثم 2601450 ثم 3140500.',
      check: 'نطابق كل عددين متجاورين في الترتيب: الأول أصغر من الثاني في كل زوج.',
    },
  ],
}

const q2: SourceElement = {
  ...element,
  id: 'u2-p85-q2',
  section: 'السؤال ② · مقارنة كلفة إصلاح بناءين',
  kind: 'exercise',
  prompt: 'بناءان يحتاجان للإصلاح: الأول ذو الرقم 21 كلفة إصلاحه 1081785 ليرة سورية، والبناء ذو الرقم 30 كلفة إصلاحه 1082180 ليرة سورية. أيهما كلفة إصلاحه أقل؟',
  given: 'كلفة إصلاح البناء ذي الرقم 21: 1081785 ليرة سورية؛ وكلفة إصلاح البناء ذي الرقم 30: 1082180 ليرة سورية.',
  required: 'تحديد البناء الذي كلفة إصلاحه أقل.',
  rule: 'نقارن العددين الطبيعيين منزلة بمنزلة بدءاً من أعلى منزلة؛ العدد الذي يظهر فيه رقم أصغر أولاً هو الأصغر.',
  why: 'المقارنة من أعلى منزلة تحسم الأكبر بأسرع فرق منزلي، والمنازل الأدنى لا تغيّر الحكم بعد أن يظهر الفرق.',
  steps: [
    'العددان من سبع خانات كلاهما، إذن نقارن منزلة بمنزلة من اليسار (الملايين) إلى اليمين.',
    'المنازل الثلاث الأولى متساوية: 1 و 0 و 8 في العددين.',
    'منزلة الآلاف تحسم المقارنة: 1 في العدد 1081785 مقابل 2 في العدد 1082180.',
    'لأن 1 < 2 فإن 1081785 < 1082180.',
  ],
  answer: 'كلفة إصلاح البناء ذي الرقم 21 أقل، لأن 1081785 < 1082180.',
  check: 'الفرق بين الكلفين: 1082180 − 1081785 = 395 ليرة، و 1081785 + 395 = 1082180 ✓.',
  pitfall: 'البدء بالمقارنة من منزلة الوحدات أو الحكم من أول الأرقام المتشابهة (108) دون إكمال المقارنة.',
}

const q3: SourceElement = {
  ...element,
  id: 'u2-p85-q3',
  section: 'السؤال ③ · ترتيب عينات الجراثيم (من العلوم)',
  kind: 'exercise',
  prompt: 'من العلوم: في إحدى مصبات الصرف الصحي تمَّ أخذ العينات A، B، C لتحليلها، ونتيجة التحليل بلغ عدد الجراثيم في العينة A: 1205348 جرثومة تقريباً، وفي العينة B: 1214999 جرثومة تقريباً، أما في العينة C: 1002347 جرثومة تقريباً. رتّب تلك العينات ترتيباً تصاعدياً حسب عدد الجراثيم في كل منها.',
  given: 'عدد الجراثيم تقريباً: في العينة A: 1205348، وفي العينة B: 1214999، وفي العينة C: 1002347.',
  required: 'ترتيب العينات الثلاث تصاعدياً حسب عدد الجراثيم.',
  rule: 'الترتيب التصاعدي من الأصغر إلى الأكبر بقاعدة المقارنة من أعلى منزلة.',
  why: 'ترتيب قيم مقارنة يعطي قراءة علمية سريعة للنتائج: أي عينة هي الأنظف وأيها الأعلى تلوثاً.',
  steps: [
    'الأعداد الثلاثة من سبع خانات، فنبدأ المقارنة من خانة الملايين: 1 = 1 = 1.',
    'خانة مئة الألف تحسم مقارنة C مع A و B: 0 في C مقابل 2 في كل منهما، إذن C أصغر العينات.',
    'نقارن A مع B: مئة الألف متساوية (2 = 2)، ومنزلة عشرات الآلاف تحسم: 0 في A مقابل 1 في B.',
    'إذن A < B، والترتيب التصاعدي: C ثم A ثم B.',
  ],
  answer: 'الترتيب التصاعدي: C (1002347) ثم A (1205348) ثم B (1214999).',
  check: 'نقارن المتتالية زوجاً زوجاً: 1002347 < 1205348 < 1214999 ✓.',
  pitfall: 'مقارنة A مع B من منزلة المئات (5 مقابل 9) قبل حسم منزلة عشرات الآلاف.',
}

const q4: SourceElement = {
  ...element,
  id: 'u2-p85-q4',
  section: 'السؤال ④ · لغز العدد المجهول',
  kind: 'exercise',
  prompt: 'أنا عدد بين 139900 و 140000، عشراتي أكبر من آحادي بـ 6، ومجموع عشراتي مع آحادي 8. فمن أنا؟',
  given: 'عدد بين 139900 و 140000؛ رقم عشراته أكبر من رقم آحاده بـ 6؛ ومجموع الرقمين 8.',
  required: 'إيجاد العدد.',
  rule: 'نترجم كل شرح لفظي إلى علاقة بين رقمي العشرات والآحاد، نحل العلاقتين معاً، ثم نتحقق من قيد المجال.',
  why: 'الترجمة من لغة الكلام إلى لغة الأرقام هي جوهر حل المسائل اللفظية، وقيد «بين» يربط الرقمين بالعدد الكامل.',
  steps: [
    'نرمز لرقم العشرات بـ س ولرقم الآحاد بـ ص.',
    '«عشراتي أكبر من آحادي بـ 6»: س = ص + 6.',
    '«مجموع عشراتي مع آحادي 8»: س + ص = 8.',
    'نعوّض: ص + 6 + ص = 8 إذن 2 × ص = 2 إذن ص = 1، ومنه س = 7.',
    'العدد بين 139900 و 140000 فشكله 1399□□، ونضع العشرات 7 والآحاد 1 فيصير العدد 139971.',
  ],
  answer: 'العدد هو 139971.',
  check: '7 − 1 = 6 ✓ و 7 + 1 = 8 ✓ و 139900 < 139971 < 140000 ✓.',
  pitfall: 'حل الشرطين بشكل منفصل أو نسيان قيد المجال فتُقبل إجابات مثل 71.',
}

const q5: SourceElement = {
  ...element,
  id: 'u2-p85-q5',
  section: 'السؤال ⑤ · المضاعف المشترك الأصغر',
  kind: 'exercise',
  prompt: 'جد المضاعف المشترك الأصغر للأعداد:',
  given: 'تسع مجموعات من الأعداد: (أ) 4 و 9؛ (ب) 6 و 5 و 8؛ (ج) 8 و 3 و 2؛ (د) 40 و 90؛ (هـ) 60 و 50 و 80؛ (و) 80 و 30 و 20؛ (ز) 400 و 900؛ (ح) 600 و 500 و 800؛ (ط) 200 و 300 و 800.',
  required: 'إيجاد المضاعف المشترك الأصغر لكل مجموعة.',
  rule: LCM_RULE,
  why: 'التدريب يتدرج من عددين صغيرين إلى أعداد كبيرة وثلاثية لتثبيت طريقة قوائم المضاعفات على كل الأشكال.',
  steps: [
    'نحدد العدد الأكبر في المجموعة.',
    'نكتب مضاعفاته بالترتيب حتى يظهر أول مضاعف يقبل القسمة على بقية الأعداد.',
    'نكتب م.م.أ ونتحقق بالقسمة على كل عدد.',
  ],
  answer: 'أ: 36؛ ب: 120؛ ج: 24؛ د: 360؛ هـ: 1200؛ و: 240؛ ز: 3600؛ ح: 12000؛ ط: 2400.',
  check: 'كل جواب يقبل القسمة على أعداد مجموعته، ولا يوجد مضاعف مشترك أصغر منه.',
  pitfall: 'اعتبار حاصل ضرب الأعداد هو الجواب دائماً.',
  branches: q5Items,
}

const q6: SourceElement = {
  ...element,
  id: 'u2-p85-q6',
  section: 'السؤال ⑥ · رموز المقارنة (يمتد من ص 85 إلى ص 86)',
  kind: 'exercise',
  prompt: 'ضع ( < أو > أو = ) في المربع لتحصل على مقارنة صحيحة:',
  given: 'تسع مقارنات: (أ) 3/4 □ 5/12؛ (ب) 3/10 □ 0.02؛ (ج) 6/7 □ 7/8؛ (د) 4/5 □ 0.8؛ (هـ) 0.317 □ 0.217؛ (و) 7 1/2 □ 7.65؛ (ز) 4/14 □ 2/7؛ (ح) 2 3/4 □ 2.75؛ (ط) 0.032 □ 0.023.',
  required: 'وضع الرمز الصحيح (< أو > أو =) في كل مقارنة.',
  rule: 'نوحّد صورة الطرفين (مقام مشترك أو صورة عشرية) ثم نقارن القيمتين.',
  why: 'المقارنات تجمع الحالات كلها: كسران بمقامين مختلفين، كسر مع عدد عشري، عدد مختلط مع عدد عشري، وعددان عشريان، لتثبيت استراتيجيات التوحيد.',
  steps: [
    'نقرأ الطرفين ونحدد صورتيهما.',
    'نختار الاستراتيجية: توحيد المقام، أو التحويل إلى عدد عشري، أو التبسيط.',
    'نقارن بعد التوحيد ونكتب الرمز.',
  ],
  answer: 'أ: >؛ ب: >؛ ج: <؛ د: =؛ هـ: >؛ و: <؛ ز: =؛ ح: =؛ ط: >.',
  check: 'إعادة تقييم كل طرف عددياً تؤكد الرمز المختار.',
  pitfall: 'مقارنة البسطين أو منازل عشرية مختلفة دون توحيد.',
  branches: q6Items.map((item) => cmpBranch(item)),
}

const q7: SourceElement = {
  ...element,
  id: 'u2-p86-q7',
  page: 86,
  section: 'السؤال ⑦ · ترتيب الكسور تصاعدياً',
  kind: 'exercise',
  prompt: 'رتّب الكسور ترتيباً تصاعدياً في كل مما يأتي:',
  given: 'ثلاث مجموعات: (أ) 7/8، 1/4، 1/2، 1/8؛ (ب) 5/6، 1/3، 7/12، 3/4؛ (ج) 1/5، 3/4، 7/10، 1/20.',
  required: 'ترتيب كسور كل مجموعة من الأصغر إلى الأكبر.',
  rule: 'نوحّد المقامات بكسور مكافئة ثم نقارن البسوط وترتب.',
  why: 'التمرين يدرّب الاستراتيجية الأساسية للمقارنة على مجموعات مقاماتها 8 و 12 و 20.',
  steps: [
    'نحدد مقاماً مشتركاً لكل مجموعة.',
    'نحوّل كل كسر إلى كسر مكافئ بالمقام المشترك.',
    'نرتب البسوط تصاعدياً ونكتب الكسور الأصلية بالترتيب.',
  ],
  answer: 'أ: 1/8، 1/4، 1/2، 7/8؛ ب: 1/3، 7/12، 3/4، 5/6؛ ج: 1/20، 1/5، 7/10، 3/4.',
  check: 'كل كسرين متجاورين في الترتيب يظل الفرق بينهما بالاتجاه التصاعدي بعد التوحيد.',
  pitfall: 'الترتيب حسب المقام أو حسب البسط قبل التوحيد.',
  branches: q7Groups.map((group) => orderBranch(group, 'asc', ORDER_ASC_WHY, group.pitfall)),
}

const q8: SourceElement = {
  ...element,
  id: 'u2-p86-q8',
  page: 86,
  section: 'السؤال ⑧ · ترتيب الكسور تنازلياً',
  kind: 'exercise',
  prompt: 'رتّب الكسور ترتيباً تنازلياً في كل مما يأتي:',
  given: 'ثلاث مجموعات: (أ) 3/7، 1/14، 1/2، 2/7؛ (ب) 1/2، 7/9، 1/18، 5/9؛ (ج) 4/5، 13/30، 5/6، 1/5.',
  required: 'ترتيب كسور كل مجموعة من الأكبر إلى الأصغر.',
  rule: 'نوحّد المقامات ثم نقارن البسوط من الأكبر إلى الأصغر.',
  why: 'التمرين يعكس اتجاه التمرين السابق فيثبت أن الاستراتيجية واحدة والاتجاه هو الذي يتغير.',
  steps: [
    'نحدد مقاماً مشتركاً لكل مجموعة.',
    'نحوّل كل كسر إلى كسر مكافئ بالمقام المشترك.',
    'نرتب البسوط تنازلياً ونكتب الكسور الأصلية بالترتيب.',
  ],
  answer: 'أ: 1/2، 3/7، 2/7، 1/14؛ ب: 7/9، 5/9، 1/2، 1/18؛ ج: 5/6، 4/5، 13/30، 1/5.',
  check: 'كل كسرين متجاورين في الترتيب يظل الفرق بينهما بالاتجاه التنازلي بعد التوحيد.',
  pitfall: 'تنفيذ الترتيب التصاعدي ثم عكسه دون توحيد المقامات.',
  branches: q8Groups.map((group) => orderBranch(group, 'desc', ORDER_DESC_WHY)),
}

const q9: SourceElement = {
  ...element,
  id: 'u2-p86-q9',
  page: 86,
  section: 'السؤال ⑨ · من الكسر المركب إلى كسر عادي',
  kind: 'exercise',
  prompt: 'اكتب كل كسر مركب بشكل كسر عادي:',
  given: 'أربعة أعداد مركبة: (أ) 15 1/6؛ (ب) 10 2/3؛ (ج) 5 1/4؛ (د) 30 2/7.',
  required: 'كتابة كل عدد مركب كسراً عادياً بسط واحد ومقام واحد.',
  rule: 'نضرب العدد الصحيح في مقام الكسر ونضيف البسط، والمقام يبقى كما هو.',
  why: 'أعداد التمرين كبيرة عمداً لتتقن القاعدة مع الجدول (15 × 6، 10 × 3، 5 × 4، 30 × 7).',
  steps: [
    'نحسب حاصل ضرب العدد الصحيح في المقام.',
    'نجمع إليه بسط الكسر.',
    'نكتب الناتج على المقام نفسه.',
  ],
  answer: 'أ: 91/6؛ ب: 32/3؛ ج: 21/4؛ د: 212/7.',
  check: 'القسمة مع باقٍ تعيد كل كسر إلى عدد المركب الأصلي.',
  pitfall: 'نسيان إضافة البسط بعد الضرب.',
  branches: q9Items.map((item) => toImproperBranch(item)),
}

const q10: SourceElement = {
  ...element,
  id: 'u2-p86-q10',
  page: 86,
  section: 'السؤال ⑩ · من كسر عادي إلى كسر مركب',
  kind: 'exercise',
  prompt: 'اكتب كل كسر عادي بشكل كسر مركب:',
  given: 'أربعة كسور: (أ) 140/9؛ (ب) 50/49؛ (ج) 20/7؛ (د) 70/40.',
  required: 'كتابة كل كسر على صورة عدد صحيح يليه كسر عادي.',
  rule: 'نقسم البسط على المقام قسمة مع باقٍ: الخارج عدد صحيح والباقي بسط والمقام يبقى.',
  why: 'الكسر 50/49 يعلّم الحذر (البسط أكبر من المقام بقليل)، والكسر 70/40 يضيف مهارة التبسيط بعد التحويل.',
  steps: [
    'نجد أكبر مضاعف للمقام لا يتجاوز البسط.',
    'نطرح لنجد الباقي.',
    'نكتب العدد المركب، ونبسّط كسره إذا أمكن.',
  ],
  answer: 'أ: 15 5/9؛ ب: 1 1/49؛ ج: 2 6/7؛ د: 1 3/4.',
  check: 'إعادة التحويل (الصحيح × المقام + البسط) تعيد الكسر الأصلي.',
  pitfall: 'كتابة الباقي على مقام آخر أو إهمال التبسيط في (د).',
  branches: q10Items.map((item) => toMixedBranch(item)),
}

const q11: SourceElement = {
  ...element,
  id: 'u2-p86-q11',
  page: 86,
  section: 'السؤال ⑪ · المستطيل والمربّع: حساب الأطوال',
  kind: 'exercise',
  prompt: 'في الشكل المجاور: ABCD مستطيل، EFGC مربّع. احسب طول كل من DG، AB، CB.',
  given: 'مستطيل ABCD طوله السفلي DC = 8 سم، ومربّع EFGC ملتصق بالضلع BC من جهة اليمين، وضلعه 2 سم (FG = 2 سم)، والنقطة E على الضلع BC و BE = 3 سم.',
  required: 'حساب طول كل من DG و AB و CB.',
  rule: 'في المستطيل الضلعان المتقابلان متساويان؛ وفي المربّع الأضلاع الأربعة متساوية؛ والقطعان على الاستقامة الواحدة يُجمع طولهما.',
  why: 'الشكل المركب يجمع خواص الشكلين مع فكرة الأطوال على استقامة واحدة، وهي خلاصة درسَي المستطيل والمربّع.',
  steps: [
    'أضلاع المربّع EFGC متساوية: EC = CG = GF = FE = 2 سم.',
    'النقطة E على الضلع BC: CB = CE + EB = 2 + 3 = 5 سم.',
    'AB و DC ضلعان متقابلان في المستطيل: AB = DC = 8 سم.',
    'النقاط D و C و G على استقامة واحدة: DG = DC + CG = 8 + 2 = 10 سم.',
  ],
  answer: 'DG = 10 سم، AB = 8 سم، CB = 5 سم.',
  check: 'CB = 5 سم يقابل AD؛ و DG = 10 سم يتكوّن من 8 سم و 2 سم على الاستقامة نفسها.',
  pitfall: 'أخذ CB = 3 سم أو DG = 8 سم بإهمال أضلاع المربّع.',
  branches: [
    {
      id: 'u2-p86-q11-a',
      label: 'DG',
      prompt: 'احسب طول DG.',
      given: 'DC = 8 سم، و CG ضلع في المربّع EFGC فيساوي 2 سم، والنقطة C بين D و G.',
      required: 'إيجاد طول القطعة DG.',
      rule: 'القطعان على الاستقامة الواحدة يُجمع طولهما.',
      why: 'G تقع امتداداً للضلع DC بعد الضلع CG، فالمسار من D إلى G يمر بـ C.',
      steps: [
        'CG ضلع في المربّع فيساوي 2 سم.',
        'النقاط D و C و G على استقامة واحدة: DG = DC + CG.',
        'DG = 8 + 2 = 10 سم.',
      ],
      answer: 'DG = 10 سم.',
      check: 'DG أكبر من DC بمقدار CG بالضبط: 8 + 2 = 10 ✓.',
      pitfall: 'اعتبار DG = DC = 8 سم.',
    },
    {
      id: 'u2-p86-q11-b',
      label: 'AB',
      prompt: 'احسب طول AB.',
      given: 'ABCD مستطيل، وطول الضلع DC = 8 سم.',
      required: 'إيجاد طول الضلع AB.',
      rule: 'في المستطيل الضلعان المتقابلان متساويان.',
      why: 'AB يقابل DC ولا نحتاج أي قياس إضافي.',
      steps: [
        'AB و DC ضلعان متقابلان في المستطيل ABCD.',
        'الضلعان المتقابلان متساويان، و DC = 8 سم.',
        'إذن AB = 8 سم.',
      ],
      answer: 'AB = 8 سم.',
      check: 'AB يوازي DC ولا يلتقي معه، والزاوية قائمة عند الأركان الأربعة، فالاستنتاج سليم.',
    },
    {
      id: 'u2-p86-q11-c',
      label: 'CB',
      prompt: 'احسب طول CB.',
      given: 'النقطة E على الضلع BC، و BE = 3 سم، و EC ضلع في المربّع EFGC.',
      required: 'إيجاد طول القطعة CB.',
      rule: 'أضلاع المربّع متساوية، والقطعان CE و EB على الاستقامة الواحدة يُجمع طولهما.',
      why: 'E تقسم الضلع BC إلى جزأين: جزء في المستطيل وجزء حدّ مشترك مع المربّع.',
      steps: [
        'EC ضلع في المربّع EFGC فيساوي 2 سم.',
        'BE معلوم من الشكل: 3 سم.',
        'CB = CE + EB = 2 + 3 = 5 سم.',
      ],
      answer: 'CB = 5 سم.',
      check: 'CB يقابل AD، وكلاهما يساوي مجموع 2 سم و 3 سم.',
      pitfall: 'أخذ CB = 3 سم (طول EB فقط).',
    },
  ],
}

/** عناصر المصدر بترتيب الكتاب: عنوان الصفحتين ثم التمارين ① إلى ⑪. */
export const unit2ExercisesSourceElements: SourceElement[] = [
  element,
  q1,
  q2,
  q3,
  q4,
  q5,
  q6,
  q7,
  q8,
  q9,
  q10,
  q11,
]

/* تطبيق خطوات الترتيب المولدة على مجموعات ⑦ و⑧ بعد تعريفها */
for (const group of q7Groups) group.steps = orderSteps(group, 'asc')
for (const group of q8Groups) group.steps = orderSteps(group, 'desc')

/* ============================================================ فهرسة السجل */

export const unit2ExercisesBookTasks: SourceElement[] = unit2ExercisesSourceElements.filter((item) => item.kind === 'exercise')

export const unit2ExercisesSourceBranches: SourceBranch[] = unit2ExercisesSourceElements.flatMap((item) => item.branches ?? [])

export function flattenUnit2ExercisesCoverageIds(): string[] {
  return unit2ExercisesSourceElements.flatMap((item) => [item.id, ...(item.branches ?? []).map((branch) => branch.id)])
}

export function findUnit2ExercisesElement(id: string): SourceElement {
  const found = unit2ExercisesSourceElements.find((item) => item.id === id)
  if (!found) throw new Error(`unknown unit-2-exercises source element: ${id}`)
  return found
}

/* ============================================================ منطقة المعلم */

const solutionReasoning = (item: { given: string; required: string; rule: string; why: string; steps: string[]; answer: string; check: string }): string[] => [
  `المعطيات: ${item.given}`,
  `المطلوب: ${item.required}`,
  `القاعدة المستعملة: ${item.rule}`,
  `لماذا تنطبق هنا: ${item.why}`,
  ...item.steps.map((step, index) => `الخطوة ${index + 1}: ${step}`),
  `الإجابة النهائية: ${item.answer}`,
  `التحقّق: ${item.check}`,
]

const teacherSafe = (text: string) => text

const sourceNote = (item: { pitfall?: string }, element: SourceElement) =>
  `القسم: ${element.section}. المصدر: الكتاب، ص ${element.page}. الخطوات والشرح والتحقّق إضافات تعليمية من المنصة، وليست مطبوعة كحل في الكتاب.${item.pitfall ? ` خطأ شائع يجب التنبيه إليه: ${item.pitfall}` : ''}`

export const unit2ExercisesTeacherEntries: TeacherEntry[] = unit2ExercisesSourceElements.flatMap((item) => {
  const overview: TeacherEntry = {
    id: `t-${item.id}`,
    title: item.section,
    prompt: teacherSafe(item.prompt),
    answer: teacherSafe(item.answer),
    source: { type: 'textbook', page: item.page },
    reasoning: solutionReasoning(item),
    note: sourceNote(item, item),
  }
  if (!item.branches?.length) return [overview]
  return [
    overview,
    ...item.branches.map((branch): TeacherEntry => ({
      id: `t-${branch.id}`,
      title: `${item.section} · الفرع (${branch.label})`,
      prompt: teacherSafe(branch.prompt),
      answer: teacherSafe(branch.answer),
      source: { type: 'textbook', page: item.page },
      reasoning: solutionReasoning(branch),
      note: sourceNote(branch, item),
    })),
  ]
})

/** أنشطة المنصة التفاعلية الموثقة للمعلم (ليست من الكتاب). */
export const unit2ExercisesPlatformTeacherEntries: TeacherEntry[] = [
  {
    id: 't-u2e-platform-builder',
    title: 'مستكشف جدول الخانات · نشاط من إعداد المنصة',
    prompt: 'ما الذي يتدرب عليه الطالب في «مستكشف جدول الخانات» ضمن التمرين ①؟',
    answer: 'يبني الطالب ثلاثة أعداد من سبع خانات خانة خانة، ويرى العدد وتحليله المنزلي وصيغته اللفظية لحظياً، ثم يرتب الأعداد الثلاثة تصاعدياً بالنقر عليها بالترتيب.',
    source: { type: 'platform' },
    reasoning: [
      'المعطيات: جدول بسبع خانات من الوحدات إلى الملايين وثلاثة صفوف للأعداد.',
      'المطلوب: تدريب كتابة العدد السبعي وقراءته لفظياً وترتيبه.',
      'القاعدة المستعملة: كل خانة تحمل قيمة منزلية، والصيغة اللفظية تُقرأ من أعلى منزلة.',
      'لماذا تنطبق هنا: التمرين ① من الكتاب يطلب الجدول والصيغة اللفظية والترتيب معاً.',
      'الخطوة 1: يكتب الطالب رقماً في كل خانة.',
      'الخطوة 2: تظهر قيمة العدد وصيغته اللفظية مباشرة للمقارنة مع قراءته الخاصة.',
      'الخطوة 3: يرتب الأعداد الثلاثة بالنقر من الأصغر إلى الأكبر ويتلقى تغذية راجعة.',
      'التحقق: لا يُقبل ترتيب إلا بعد بناء الأعداد الثلاثة كاملة بصيغة سبع خانات.',
    ],
    note: 'نشاط من إعداد المنصة يحيك التمرين ① من الكتاب دون استبدال نصه.',
  },
  {
    id: 't-u2e-platform-compare-columns',
    title: 'المقارنة منزلة بمنزلة · نشاط من إعداد المنصة',
    prompt: 'كيف يعرض النشاط مقارنة الكلفين 1081785 و 1082180 للتمرين ②؟',
    answer: 'يصفّ العددين في جدول منازل ويكشف المنازل تدريجياً من الملايين نحو اليمين حتى تبرز منزلة الآلاف المختلفة (1 مقابل 2) فيُحسم أن كلفة البناء ذي الرقم 21 أقل.',
    source: { type: 'platform' },
    reasoning: [
      'المعطيات: العددان 1081785 و 1082180 وليرة سورية وحدة للكلفة.',
      'المطلوب: إظهار آلية المقارنة المنزلية لا الناتج فقط.',
      'القاعدة المستعملة: المقارنة من أعلى منزلة وأول فرق يحسم.',
      'لماذا تنطبق هنا: العددان متقاربان ويشتركان في أول ثلاثة أرقام فالمنزلة الحاسمة واحدة.',
      'الخطوة 1: يطابق الطالب المنازل المتساوية (1، 0، 8).',
      'الخطوة 2: تكشف منزلة الآلاف الفرق 1 < 2.',
      'الخطوة 3: يستنتج الطالب أن 1081785 < 1082180 ويختار البناء ذي الرقم 21.',
      'التحقق: الفرق 395 ليرة يؤكد النتيجة.',
    ],
    note: 'نشاط من إعداد المنصة يصوّر خطوات حل التمرين ② خطوة خطوة.',
  },
  {
    id: 't-u2e-platform-order-lab',
    title: 'بطاقات الترتيب · نشاط من إعداد المنصة',
    prompt: 'كيف يعمل نشاط «بطاقات الترتيب» في التمارين ③ و ⑦ و ⑧؟',
    answer: 'ينقر الطالب البطاقات بالترتيب المطلوب (تصاعدي أو تنازلي) فتحتل كل بطاقة موقعها، ثم يتحقق فيتلقى تلميحاً أو الحل الكامل مع التوحيد المنزلي أو المقامي.',
    source: { type: 'platform' },
    reasoning: [
      'المعطيات: بطاقات تحمل أعداداً طبيعية أو كسوراً معروضة عمودياً.',
      'المطلوب: ترتيبها تصاعدياً أو تنازلياً حسب التمرين.',
      'القاعدة المستعملة: المقارنة من أعلى منزلة، أو توحيد المقامات ثم مقارنة البسوط.',
      'لماذا تنطبق هنا: التمارين ③ و ⑦ و ⑧ من الكتاب كلها تمارين ترتيب.',
      'الخطوة 1: ينقر الطالب ما يظنه الأصغر (أو الأكبر في التنازلي).',
      'الخطوة 2: يتكرر النقر حتى اكتمال المواقع الأربعة أو الثلاثة.',
      'الخطوة 3: عند التحقق الخاطئ يظهر تلميح متدرج ثم الحل بخطواته.',
      'التحقق: يطابق النشاط ترتيب الطالب مع الحل المحسوب آلياً من بيانات السجل.',
    ],
    note: 'نشاط من إعداد المنصة، وحلوله مشتقة من بيانات التمارين نفسها.',
  },
  {
    id: 't-u2e-platform-digit-detective',
    title: 'حلّال لغز المنزلتين · نشاط من إعداد المنصة',
    prompt: 'ما فائدة نشاط «حلّال لغز المنزلتين» في التمرين ④؟',
    answer: 'يجرّب الطالب أزواجاً من أرقام العشرات والآحاد فيرى فوراً هل تحقق شرطا الفرق 6 والمجموع 8، ثم يركّب العدد الكامل 139971 ويتأكد من قيد المجال بين 139900 و 140000.',
    source: { type: 'platform' },
    reasoning: [
      'المعطيات: شرطا اللغز وقيد المجال 139900 إلى 140000.',
      'المطلوب: تجسيد الترجمة من لغة الكلام إلى علاقتين عددیتين.',
      'القاعدة المستعملة: س = ص + 6 و س + ص = 8.',
      'لماذا تنطبق هنا: التمرين ④ لغز منزلي يحتاج تجريب منظّم لا تخميناً عشوائياً.',
      'الخطوة 1: يختار الطالب رقمين للعشرات والآحاد.',
      'الخطوة 2: يضيء كل شرط يتحقق ويبقى الآخر مطفأً.',
      'الخطوة 3: عند تحقق الشرطين يظهر تركيب العدد 139971.',
      'التحقق: ثلاثة فحوص نهائية: الفرق 6، المجموع 8، والمجال.',
    ],
    note: 'نشاط من إعداد المنصة يحوّل اللغز إلى مختبر علاقات.',
  },
  {
    id: 't-u2e-platform-lcm-lab',
    title: 'مختبر المضاعفات · نشاط من إعداد المنصة',
    prompt: 'كيف يساعد «مختبر المضاعفات» الطالب في التمرين ⑤؟',
    answer: 'يدخل الطالب عددين صغيرين فيرى قائمتي مضاعفاتهما جنباً إلى جنب مع إبراز المضاعفات المشتركة وأولها، فيفهم معنى م.م.أ قبل تطبيقه على مجموعات الكتاب التسع.',
    source: { type: 'platform' },
    reasoning: [
      'المعطيات: عددين يختارهما الطالب من 2 إلى 12.',
      'المطلوب: إظهار قائمتي المضاعفات وأول مضاعف مشترك.',
      'القاعدة المستعملة: مضاعفات العدد الأكبر تُفحص بالترتيب حتى يقبل أحدها القسمة على الآخر.',
      'لماذا تنطبق هنا: هذه هي طريقة الوحدة نفسها في درس المضاعف المشترك الأصغر.',
      'الخطوة 1: يكتب الطالب العددين فيولّد النشاط قائمتي المضاعفات.',
      'الخطوة 2: تُبرز المضاعفات المشتركة ويعرض أولها.',
      'الخطوة 3: يربط الطالب الملاحظة بحل مجموعات الكتاب التسع.',
      'التحقق: يقارن الطالب الناتج بحاصل ضرب العددين ليميز متى يتساويان ومتى يصغر م.م.أ.',
    ],
    note: 'نشاط من إعداد المنصة يمهد للتمرين ⑤ ولا يستبدل نصه.',
  },
  {
    id: 't-u2e-platform-figure-measure',
    title: 'مستكشف أطوال الشكل المركب · نشاط من إعداد المنصة',
    prompt: 'ما دوره في التمرين ⑪؟',
    answer: 'ينقر الطالب القطع DG و AB و CB على رسم الشكل فيبرز تفكيك كل قطعة إلى أجزائها (DC + CG، و AB = DC، و CE + EB) مع الأسباب قبل إدخال الأطوال.',
    source: { type: 'platform' },
    reasoning: [
      'المعطيات: رسم تفاعلي للمستطيل ABCD والمربّع EFGC بالقياسات 8 سم و 3 سم و 2 سم.',
      'المطلوب: استنتاج الأطوال من الخواص لا من القياس.',
      'القاعدة المستعملة: تساوي الأضلاع المتقابلة في المستطيل، وتساوي أضلاع المربّع، وجمع الأطوال على الاستقامة.',
      'لماذا تنطبق هنا: التمرين ⑪ يطلب DG و AB و CB وكلها تستنتج لا تُقاس.',
      'الخطوة 1: ينقر الطالب القطعة فيبرز النشاط أجزاءها المكونة.',
      'الخطوة 2: يظهر تعليل كل جزء (ضلع مربّع، ضلع مقابل، استقامة واحدة).',
      'الخطوة 3: يُدخل الطالب الطول ويتحقق مع الشرح.',
      'التحقق: الأطوال 10 و 8 و 5 سم تتفق مع القياسات المعطاة في الشكل.',
    ],
    note: 'نشاط من إعداد المنصة يرافق التمرين ⑪.',
  },
  {
    id: 't-u2e-platform-summary',
    title: 'الخلاصة وخريطة الوحدة · نشاط من إعداد المنصة',
    prompt: 'كيف يلخّص الدرس علاقة التمارين بدروس الوحدة واختبارها؟',
    answer: 'يعرض الدرس خريطة تربط كل تمرين بدرسه الأصلي في الوحدة الثانية، ويلخص قواعد الحل الإحدى عشرة، ثم يفتح رابط اختبار الوحدة ذي الستين سؤالاً.',
    source: { type: 'platform' },
    reasoning: [
      'المعطيات: التمارين الأحد عشر ودروس الوحدة العشرة واختبار الوحدة.',
      'المطلوب: تنظيم المراجعة قبل الاختبار.',
      'القاعدة المستعملة: كل تمرين يراجع مهارة درس محدد.',
      'لماذا تنطبق هنا: التمرينات الختامية تلخص الوحدة كلها.',
      'الخطوة 1: يستعرض الطالب خريطة الربط في مقدمة الدرس.',
      'الخطوة 2: يعود إلى درس المهارة الضعيفة من الخريطة عند الحاجة.',
      'الخطوة 3: ينتقل إلى اختبار الوحدة بعد إتمام التمارين.',
      'التحقق: اختبار الوحدة يبقى كما هو بستين سؤالاً دون أي تغيير.',
    ],
    note: 'نشاط من إعداد المنصة للتنظيم والمراجعة.',
  },
]

export const unit2ExercisesAllTeacherEntries: TeacherEntry[] = [
  ...unit2ExercisesTeacherEntries,
  ...unit2ExercisesPlatformTeacherEntries,
]
