/* Unit 2 · Lesson 7 · «الأجزاء العشرية (2)» — textbook pages 66–71.
 * Printed values below were read from the attached page images (image-1 … image-6 = pp. 66–71).
 * Every value here is either printed on the page or derived arithmetically from a printed value;
 * nothing is guessed from an unreadable figure. Unresolved items are recorded in the coverage ledger. */

export type HundredthsItem = { id: string; label: string; numerator: number }
export type ComparisonItem = { id: string; label: string; left: string; right: string; relation: '<' | '=' | '>' }
export type RulerItem = { id: string; label: string; from: number; to: number; printed: number }
export type CoverageBranch = { id: string; label: string; teacherEntryIds: string[] }
export type CoverageElement = {
  id: string
  page: number
  printedItem: string
  sourceStatus: 'confirmed' | 'partial'
  studentStep: string
  sourceSummary: string
  teacherEntryIds: string[]
  branches: CoverageBranch[]
}

export const lessonTitle = 'الأجزاء العشرية (2)'

/* ───────────── page 66 ───────────── */
export const p66IntroFacts = {
  earth: { id: 'l7-p66-earth', numerator: 24, text: 'مساحة الأرض الصحراوية والجبلية تمثّل تقريباً 24/100 من مساحة سطح الأرض.' },
  ant: { id: 'l7-p66-ant', numerator: 1, text: 'كتلة دماغ النملة تعادل تقريباً 1/100 غرام.' },
} as const

/** Exercise (1): the printed cubes; the blue slices were checked on a 7× zoom of the top row (5 / 10 / 100). */
export const p66GridItems: HundredthsItem[] = [
  { id: 'l7-p66-ex1-a', label: 'أ', numerator: 5 },
  { id: 'l7-p66-ex1-b', label: 'ب', numerator: 10 },
  { id: 'l7-p66-ex1-c', label: 'ج', numerator: 100 },
]

/** Exercise (2) as printed, read right-to-left: (أ) 100/100 □ 1 … (د) 4/10 □ 40/100. */
export const p66ComparisonItems: ComparisonItem[] = [
  { id: 'l7-p66-ex2-a', label: 'أ', left: '100/100', right: '1', relation: '=' },
  { id: 'l7-p66-ex2-b', label: 'ب', left: '5/100', right: '1', relation: '<' },
  { id: 'l7-p66-ex2-c', label: 'ج', left: '60/100', right: '70/100', relation: '<' },
  { id: 'l7-p66-ex2-d', label: 'د', left: '4/10', right: '40/100', relation: '=' },
]

/* ───────────── page 67 ───────────── */
export const p67Examples: { id: string; numerator: number; decimal: string; verbal: string }[] = [
  { id: 'l7-p67-ex-14', numerator: 14, decimal: '0.14', verbal: 'أربعة عشر جزءاً من مئة (أربعة عشر بالمئة)' },
  { id: 'l7-p67-ex-5', numerator: 5, decimal: '0.05', verbal: 'خمسة أجزاء من مئة (خمسة بالمئة)' },
  { id: 'l7-p67-ex-3', numerator: 3, decimal: '0.03', verbal: 'ثلاثة أجزاء من مئة (ثلاثة بالمئة)' },
]

/* ───────────── page 68 ───────────── */
export const p68CheckOne: HundredthsItem[] = [
  { id: 'l7-p68-check1-earth', label: 'مساحة اليابسة الصحراوية والجبلية', numerator: 24 },
  { id: 'l7-p68-check1-ant', label: 'كتلة دماغ النملة', numerator: 1 },
]
export const p68CheckThree: HundredthsItem[] = [
  { id: 'l7-p68-check3-a', label: 'أ', numerator: 85 },
  { id: 'l7-p68-check3-b', label: 'ب', numerator: 7 },
]
/** Printed comparisons of the page-68 examples, written with their printed result. */
export const p68CompareExamples: ComparisonItem[] = [
  { id: 'l7-p68-cmp-a', label: 'المثال الأول', left: '0.14', right: '0.19', relation: '<' },
  { id: 'l7-p68-cmp-b', label: 'المثال الثاني', left: '0.03', right: '0.04', relation: '<' },
  { id: 'l7-p68-cmp-c', label: 'المثال الثالث', left: '0.13', right: '0.3', relation: '<' },
]

/* ───────────── page 69 ───────────── */
export const p69BetweenExamples = [
  { id: 'l7-p69-between-a', lower: '0.35', upper: '0.49', printedAnswer: '0.38' },
  { id: 'l7-p69-between-b', lower: '0.4', upper: '0.5', printedAnswer: '0.42' },
  { id: 'l7-p69-between-c', lower: '0.12', upper: '0.2', printedAnswer: '0.15' },
] as const
export const p69CheckOne: ComparisonItem[] = [
  { id: 'l7-p69-check1-a', label: 'أ', left: '0.2', right: '0.02', relation: '>' },
  { id: 'l7-p69-check1-b', label: 'ب', left: '0.51', right: '0.15', relation: '>' },
  { id: 'l7-p69-check1-c', label: 'ج', left: '0.53', right: '0.4', relation: '>' },
  { id: 'l7-p69-check1-d', label: 'د', left: '0.1', right: '0.31', relation: '<' },
  { id: 'l7-p69-check1-e', label: 'هـ', left: '0.4', right: '0.12', relation: '>' },
  { id: 'l7-p69-check1-f', label: 'و', left: '0.70', right: '0.7', relation: '=' },
]

/* ───────────── page 70 ───────────── */
/** Exercise ① ruler from 0.3 to 0.4: nine internal marks 0.31–0.39; 0.38 is printed, eight are blank. */
export const p70RulerOne = { id: 'l7-p70-practice1', from: 30, to: 40, printed: 38 } as const
/** Exercise ② rulers: each has nine internal marks with one printed value. */
export const p70RulerTwo: RulerItem[] = [
  { id: 'l7-p70-ruler2-a', label: 'أ', from: 10, to: 20, printed: 16 },
  { id: 'l7-p70-ruler2-b', label: 'ب', from: 20, to: 30, printed: 26 },
  { id: 'l7-p70-ruler2-c', label: 'ث', from: 30, to: 40, printed: 34 },
]
/** Exercise ③ table: printed cells as read left-to-right; the blank cell of each column is the answer. */
export const p70TableColumns = [
  { id: 'l7-p70-table-1', printed: 'decimal' as const, value: '0.06', numerator: 6 },
  { id: 'l7-p70-table-2', printed: 'decimal' as const, value: '0.01', numerator: 1 },
  { id: 'l7-p70-table-3', printed: 'decimal' as const, value: '0.85', numerator: 85 },
  { id: 'l7-p70-table-4', printed: 'fraction' as const, value: '17', numerator: 17 },
  { id: 'l7-p70-table-5', printed: 'fraction' as const, value: '4', numerator: 4 },
  { id: 'l7-p70-table-6', printed: 'fraction' as const, value: '7', numerator: 7 },
]

/* ───────────── page 71 ───────────── */
export const p71Ex4 = { id: 'l7-p71-ex4', decimal: '0.70', fraction: '70/100' } as const
/** Exercise ⑤ targets; figures are read left-to-right as (ج) 0.5, (ب) 0.05, (أ) 0.15. */
export const p71ShadeItems = [
  { id: 'l7-p71-ex5-a', label: 'أ', decimal: '0.15', cells: 15 },
  { id: 'l7-p71-ex5-b', label: 'ب', decimal: '0.05', cells: 5 },
  { id: 'l7-p71-ex5-c', label: 'ج', decimal: '0.5', cells: 50 },
] as const
export const p71ComparisonItems: ComparisonItem[] = [
  { id: 'l7-p71-ex6-a', label: 'أ', left: '0.04', right: '0.01', relation: '>' },
  { id: 'l7-p71-ex6-b', label: 'ب', left: '0.21', right: '0.31', relation: '<' },
  { id: 'l7-p71-ex6-c', label: 'ج', left: '0.53', right: '0.92', relation: '<' },
  { id: 'l7-p71-ex6-d', label: 'د', left: '4/100', right: '0.04', relation: '=' },
  { id: 'l7-p71-ex6-e', label: 'هـ', left: '0.3', right: '3/100', relation: '>' },
  { id: 'l7-p71-ex6-f', label: 'و', left: '1', right: '0.25', relation: '>' },
]
/** Exercise ⑦ pairs: decimal (column أ) ↔ fraction with denominator 100 (column ب). */
export const p71MatchDecimals = [
  { id: 'l7-p71-ex7-07', value: '0.07', answer: '7/100' },
  { id: 'l7-p71-ex7-04', value: '0.04', answer: '4/100' },
  { id: 'l7-p71-ex7-05', value: '0.5', answer: '50/100' },
  { id: 'l7-p71-ex7-06', value: '0.6', answer: '60/100' },
] as const
export const p71MatchFractions = ['50/100', '60/100', '7/100', '4/100'] as const
export const p71BetweenItems = [
  { id: 'l7-p71-ex8-a', label: 'أ', lower: '0.14', upper: '0.18' },
  { id: 'l7-p71-ex8-b', label: 'ب', lower: '0.3', upper: '0.4' },
  { id: 'l7-p71-ex8-c', label: 'ج', lower: '0.81', upper: '0.9' },
] as const

/* ───────────── value helpers (shared by the lesson UI, the checks, and the tests) ───────────── */

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩'
const TASHKEEL = /[\u0610-\u061A\u064B-\u065F\u0670]/gu

/** Converts Arabic-Indic digits and the Arabic decimal separator to their Western forms. */
export function normalizeNumericGlyphs(value: string): string {
  return value.replace(/[٠-٩]/gu, (digit) => String(ARABIC_INDIC.indexOf(digit))).replace(/[٫,]/gu, '.').replace(/\s+/gu, '')
}

/** Parses a decimal (`0.14`, `.5`, `٠٫٣`) or a fraction (`14/100`) to a number; returns undefined when neither form matches. */
export function parseRational(value: string): number | undefined {
  const normalized = normalizeNumericGlyphs(value.trim())
  const fraction = /^(\d+)\/(\d+)$/u.exec(normalized)
  if (fraction) {
    const denominator = Number(fraction[2])
    return denominator === 0 ? undefined : Number(fraction[1]) / denominator
  }
  return /^\d*\.?\d+$/u.test(normalized) ? Number(normalized) : undefined
}

export function compareRationalValues(left: string, right: string): -1 | 0 | 1 {
  const a = parseRational(left)
  const b = parseRational(right)
  if (a === undefined || b === undefined) throw new Error(`cannot compare ${left} and ${right}`)
  const epsilon = 1e-9
  if (Math.abs(a - b) < epsilon) return 0
  return a < b ? -1 : 1
}

/** Strict open-interval test: lower < value < upper. */
export function isStrictlyBetween(value: string, lower: string, upper: string): boolean {
  const v = parseRational(value)
  const lo = parseRational(lower)
  const hi = parseRational(upper)
  return v !== undefined && lo !== undefined && hi !== undefined && v > lo && v < hi
}

/** Decimal equivalent to n/100 written with two decimal places (or one where it is exact, e.g. 0.7 or 0.70). */
export function decimalForHundredths(numerator: number): string {
  if (numerator === 100) return '1'
  return `0.${String(numerator).padStart(2, '0')}`
}

export function isDecimalEquivalentToHundredths(input: string, numerator: number): boolean {
  const parsed = parseRational(input)
  return parsed !== undefined && Math.abs(parsed - numerator / 100) < 1e-9
}

export function isHundredthsFractionInput(input: string, numerator: number): boolean {
  const normalized = normalizeNumericGlyphs(input.trim())
  const match = /^(\d+)\/(\d+)$/u.exec(normalized)
  if (!match) return false
  const n = Number(match[1])
  const d = Number(match[2])
  return d > 0 && Math.abs(n / d - numerator / 100) < 1e-9
}

const UNIT_WORDS = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'] as const
const TEEN_WORDS = ['أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'] as const
const TENS_WORDS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'] as const

/** Feminine Arabic counting words for 1–99 (used with «أجزاء»). */
export function verbalForHundredths(numerator: number): string {
  if (numerator < 10) return UNIT_WORDS[numerator]
  if (numerator === 10) return 'عشرة'
  if (numerator < 20) return TEEN_WORDS[numerator - 11]
  const tens = Math.floor(numerator / 10)
  const units = numerator % 10
  if (units === 0) return TENS_WORDS[tens]
  return `${UNIT_WORDS[units]} و${TENS_WORDS[tens]}`
}

/** Full printed-style phrase «… جزءاً من مئة» with correct singular/dual/plural forms for 1, 2, 3–10 and 11–99. */
export function hundredthsPhrase(numerator: number): string {
  if (numerator === 1) return 'جزء واحد من مئة'
  if (numerator === 2) return 'جزءان من مئة'
  if (numerator <= 10) return `${verbalForHundredths(numerator)} أجزاء من مئة`
  return `${verbalForHundredths(numerator)} جزءاً من مئة`
}

const STOP_TOKENS = new Set(['جزء', 'اجزاء', 'جزءا', 'من', 'مئه', 'المئه', 'بالمئه', 'مائه', 'المائه', 'بالمائه'])

function normalizeVerbal(value: string): string {
  const cleaned = value.replace(TASHKEEL, '').replace(/[أإآ]/gu, 'ا').replace(/ة/gu, 'ه').replace(/ى/gu, 'ي').replace(/[()،,.]/gu, ' ')
  return cleaned.split(/\s+/u).filter((token) => token && !STOP_TOKENS.has(token)).join('')
}

/** Accepts the printed verbal form with or without the trailing «من مئة / بالمئة» phrase and tolerates spacing and diacritics. */
export function isAcceptedVerbalHundredths(input: string, numerator: number): boolean {
  return normalizeVerbal(input) === normalizeVerbal(verbalForHundredths(numerator))
}

/** Exercise ⑧ open interval: a value strictly between two decimals, with decimals only. */
export function isStrictlyBetweenDecimals(input: string, lower: string, upper: string): boolean {
  return /^\d*\.?\d+$/u.test(normalizeNumericGlyphs(input.trim())) && isStrictlyBetween(input, lower, upper)
}

/** Exact decimal (tenths or hundredths) for a ruler mark n/100 with printed-or-blank value. */
export function rulerMarkValue(hundredths: number): string {
  return `0.${String(hundredths).padStart(2, '0')}`
}

/**
 * Page-level source coverage. 30 audited blocks across pages 66–71, with 81 block and branch anchors.
 * UI anchors (`data-source-id`) and teacher-entry mappings are asserted by scripts/lesson-decimal-parts-two-check.ts.
 */
export const lesson7SourceCoverage: CoverageElement[] = [
  { id: 'l7-p66-title', page: 66, printedItem: 'العنوان «الأجزاء العشرية (2)» ورقم الدرس 7 وإطار «سنتعلّم»', sourceStatus: 'confirmed', studentStep: 'الخطوة 1 · ابدأ بالأجزاء من مئة', sourceSummary: 'العنوان والترويسة 7، وثلاثة أهداف: الكتابة العشرية للأجزاء من مئة، والتعبير اللفظي عنها، ومقارنتها.', teacherEntryIds: ['t-l7-p66-title'], branches: [] },
  { id: 'l7-p66-earth', page: 66, printedItem: 'مساحة الأرض الصحراوية والجبلية 24/100', sourceStatus: 'confirmed', studentStep: 'الخطوة 1 · ابدأ بالأجزاء من مئة', sourceSummary: 'تمثّل تقريباً 24/100 من مساحة سطح الأرض.', teacherEntryIds: ['t-l7-p66-earth'], branches: [] },
  { id: 'l7-p66-ant', page: 66, printedItem: 'كتلة دماغ النملة 1/100 غرام', sourceStatus: 'confirmed', studentStep: 'الخطوة 1 · ابدأ بالأجزاء من مئة', sourceSummary: 'كتلة دماغ النملة تعادل تقريباً 1/100 غرام، وهي جزء من مئة من الغرام.', teacherEntryIds: ['t-l7-p66-ant'], branches: [] },
  { id: 'l7-p66-cube', page: 66, printedItem: 'انطلاقة نشطة · المكعب المقسّم إلى مئة شريحة', sourceStatus: 'confirmed', studentStep: 'الخطوة 1 · ابدأ بالأجزاء من مئة', sourceSummary: 'المكعب المجاور مقسّم إلى مئة شريحة متساوية على شكل شبكة 10 × 10.', teacherEntryIds: ['t-l7-p66-cube'], branches: [] },
  { id: 'l7-p66-definition', page: 66, printedItem: 'تعلّم ① · تعريف الأجزاء من مئة', sourceStatus: 'confirmed', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: 'مقام الكسر 100 وبسطه أحد الأعداد من 1 إلى 99.', teacherEntryIds: ['t-l7-p66-definition'], branches: [] },
  { id: 'l7-p66-ex1', page: 66, printedItem: 'التمرين 1 · المكعبات الثلاثة (أ، ب، ج)', sourceStatus: 'confirmed', studentStep: 'الخطوة 1 · ابدأ بالأجزاء من مئة', sourceSummary: 'المقام المطبوع 100؛ الشرائح الزرقاء: (أ) 5 (ب) 10 (ج) 100 — وعُدّت في الصف الأعلى من القصاصة المكبّرة.', teacherEntryIds: [], branches: [
    { id: 'l7-p66-ex1-a', label: '(أ) 5/100', teacherEntryIds: ['t-l7-p66-ex1-a'] },
    { id: 'l7-p66-ex1-b', label: '(ب) 10/100', teacherEntryIds: ['t-l7-p66-ex1-b'] },
    { id: 'l7-p66-ex1-c', label: '(ج) 100/100', teacherEntryIds: ['t-l7-p66-ex1-c'] },
  ] },
  { id: 'l7-p66-ex2', page: 66, printedItem: 'التمرين 2 · المقارنات الأربع', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تحقّق من فهمك', sourceSummary: 'مربعات فارغة: (أ) 100/100 □ 1، (ب) 5/100 □ 1، (ج) 60/100 □ 70/100، (د) 4/10 □ 40/100.', teacherEntryIds: [], branches: [
    { id: 'l7-p66-ex2-a', label: '(أ) 100/100 و1', teacherEntryIds: ['t-l7-p66-ex2-a'] },
    { id: 'l7-p66-ex2-b', label: '(ب) 5/100 و1', teacherEntryIds: ['t-l7-p66-ex2-b'] },
    { id: 'l7-p66-ex2-c', label: '(ج) 60/100 و70/100', teacherEntryIds: ['t-l7-p66-ex2-c'] },
    { id: 'l7-p66-ex2-d', label: '(د) 4/10 و40/100', teacherEntryIds: ['t-l7-p66-ex2-d'] },
  ] },
  { id: 'l7-p67-decimal-form', page: 67, printedItem: 'أبسط الكتابة العشرية · المخطط 0.□□', sourceStatus: 'confirmed', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: 'العدد المكوّن من خانتين بعد الفاصلة يدل على البسط؛ الصفر قبل الفاصلة والفاصلة العشرية موضّحان في المخطط.', teacherEntryIds: ['t-l7-p67-decimal-form'], branches: [] },
  { id: 'l7-p67-examples', page: 67, printedItem: 'مثال: 14/100 و5/100 و3/100 مع التعبير اللفظي', sourceStatus: 'confirmed', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: 'الكسور المطبوعة وكتابتها العشرية ولفظها، وقاعدة الصفر على اليسار عندما يكون البسط خانة واحدة.', teacherEntryIds: [], branches: [
    { id: 'l7-p67-ex-14', label: '14/100 و0.14', teacherEntryIds: ['t-l7-p67-ex-14'] },
    { id: 'l7-p67-ex-5', label: '5/100 و0.05', teacherEntryIds: ['t-l7-p67-ex-5'] },
    { id: 'l7-p67-ex-3', label: '3/100 و0.03', teacherEntryIds: ['t-l7-p67-ex-3'] },
  ] },
  { id: 'l7-p67-hundred-one', page: 67, printedItem: 'كل مئة جزء من مئة تعادل (1)', sourceStatus: 'confirmed', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: 'الشكل الكامل 100/100 يعادل الواحد الكامل.', teacherEntryIds: ['t-l7-p67-hundred-one'], branches: [] },
  { id: 'l7-p67-trailing-zeros', page: 67, printedItem: 'الاستغناء عن الأصفار إلى يمين الفاصلة · 3/10 = 0.3 و30/100 = 0.30', sourceStatus: 'confirmed', studentStep: 'الخطوة 3 · قارن الأجزاء من مئة', sourceSummary: 'الصفر الأخير بعد الفاصلة لا يغيّر قيمة العدد: 30/100 = 3/10 و0.30 = 0.3.', teacherEntryIds: ['t-l7-p67-trailing-zeros'], branches: [] },
  { id: 'l7-p68-equal-examples', page: 68, printedItem: 'مثال: 0.4 = 0.40 و0.5 = 0.50', sourceStatus: 'confirmed', studentStep: 'الخطوة 3 · قارن الأجزاء من مئة', sourceSummary: 'إضافة صفر إلى يمين الأعشار لا تغيّر قيمة العدد.', teacherEntryIds: ['t-l7-p68-equal-examples'], branches: [] },
  { id: 'l7-p68-check1', page: 68, printedItem: 'تحقّق من فهمك (1) · الكسران من مقدمة الدرس', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تحقّق من فهمك', sourceSummary: 'ارجع إلى مقدمة الدرس واكتب 24/100 و1/100 كتابة عشرية ثم لفظية.', teacherEntryIds: [], branches: [
    { id: 'l7-p68-check1-earth', label: '24/100: العشري واللفظي', teacherEntryIds: ['t-l7-p68-check1-earth'] },
    { id: 'l7-p68-check1-ant', label: '1/100: العشري واللفظي', teacherEntryIds: ['t-l7-p68-check1-ant'] },
  ] },
  { id: 'l7-p68-check2', page: 68, printedItem: 'تحقّق من فهمك (2) · العدد 0.07', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تحقّق من فهمك', sourceSummary: 'اكتب التعبير اللفظي عن 0.07 ثم الكسر المساوي له مقامه 100.', teacherEntryIds: ['t-l7-p68-check2'], branches: [] },
  { id: 'l7-p68-check3', page: 68, printedItem: 'تحقّق من فهمك (3) · الكسران 85/100 و7/100', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تحقّق من فهمك', sourceSummary: 'اكتب 85/100 و7/100 كتابة عشرية.', teacherEntryIds: [], branches: [
    { id: 'l7-p68-check3-a', label: '85/100', teacherEntryIds: ['t-l7-p68-check3-a'] },
    { id: 'l7-p68-check3-b', label: '7/100', teacherEntryIds: ['t-l7-p68-check3-b'] },
  ] },
  { id: 'l7-p68-compare-examples', page: 68, printedItem: 'ثلاثة أمثلة مقارنة: 0.14 و0.19، و0.03 و0.04، و0.13 و0.3', sourceStatus: 'confirmed', studentStep: 'الخطوة 3 · قارن الأجزاء من مئة', sourceSummary: 'النتائج المطبوعة: 0.14 < 0.19، و0.03 < 0.04، و0.13 < 0.3 (ثلاثون بالمئة أكبر من ثلاثة عشر بالمئة).', teacherEntryIds: [], branches: [
    { id: 'l7-p68-cmp-a', label: '0.14 و0.19', teacherEntryIds: ['t-l7-p68-cmp-a'] },
    { id: 'l7-p68-cmp-b', label: '0.03 و0.04', teacherEntryIds: ['t-l7-p68-cmp-b'] },
    { id: 'l7-p68-cmp-c', label: '0.13 و0.3', teacherEntryIds: ['t-l7-p68-cmp-c'] },
  ] },
  { id: 'l7-p68-compare-rule', page: 68, printedItem: 'ملاحظة المقامين المختلفين · توحيد الخانات بعد الفاصلة', sourceStatus: 'confirmed', studentStep: 'الخطوة 3 · قارن الأجزاء من مئة', sourceSummary: 'عند مقارنة كسرين مقاماهما مختلفان نوحّد المقامين أولاً؛ ونجعل عدد الخانات بعد الفاصلة واحداً في العددين.', teacherEntryIds: ['t-l7-p68-compare-rule'], branches: [] },
  { id: 'l7-p69-relation', page: 69, printedItem: 'لاحظ · كل عشرة أجزاء من مئة تعادل جزءاً من عشرة', sourceStatus: 'confirmed', studentStep: 'الخطوة 4 · العشرة والمئة على خط الأعداد', sourceSummary: 'الشبكة 10 × 10 تبيّن أن 10/100 تعادل 1/10 (جزء واحد من عشرة).', teacherEntryIds: ['t-l7-p69-relation'], branches: [] },
  { id: 'l7-p69-numberline', page: 69, printedItem: 'خط الأعداد من 0 إلى 1 مع تكبير بين 0 و0.1', sourceStatus: 'confirmed', studentStep: 'الخطوة 4 · العشرة والمئة على خط الأعداد', sourceSummary: 'التدرجات 0.1 … 0.9 على الخط الأساسي، وتكبيره بين 0 و0.1 يُظهر 0.01 … 0.09.', teacherEntryIds: ['t-l7-p69-numberline'], branches: [] },
  { id: 'l7-p69-between', page: 69, printedItem: 'أمثلة إيجاد عدد بين عددين', sourceStatus: 'confirmed', studentStep: 'الخطوة 4 · العشرة والمئة على خط الأعداد', sourceSummary: 'أمثلة مطبوعة: بين 0.35 و0.49 (مثل 0.38)، وبين 0.4 و0.5 (مثل 0.42)، وبين 0.12 و0.2 (مثل 0.15).', teacherEntryIds: [], branches: [
    { id: 'l7-p69-between-a', label: 'بين 0.35 و0.49', teacherEntryIds: ['t-l7-p69-between-a'] },
    { id: 'l7-p69-between-b', label: 'بين 0.4 و0.5', teacherEntryIds: ['t-l7-p69-between-b'] },
    { id: 'l7-p69-between-c', label: 'بين 0.12 و0.2', teacherEntryIds: ['t-l7-p69-between-c'] },
  ] },
  { id: 'l7-p69-check1', page: 69, printedItem: 'تحقّق من فهمك (1) · المقارنات الستّ', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تحقّق من فهمك', sourceSummary: 'ضع الرمز المناسب بين: 0.2 و0.02، 0.51 و0.15، 0.53 و0.4، 0.1 و0.31، 0.4 و0.12، 0.70 و0.7.', teacherEntryIds: [], branches: [
    { id: 'l7-p69-check1-a', label: '(أ) 0.2 و0.02', teacherEntryIds: ['t-l7-p69-check1-a'] },
    { id: 'l7-p69-check1-b', label: '(ب) 0.51 و0.15', teacherEntryIds: ['t-l7-p69-check1-b'] },
    { id: 'l7-p69-check1-c', label: '(ج) 0.53 و0.4', teacherEntryIds: ['t-l7-p69-check1-c'] },
    { id: 'l7-p69-check1-d', label: '(د) 0.1 و0.31', teacherEntryIds: ['t-l7-p69-check1-d'] },
    { id: 'l7-p69-check1-e', label: '(هـ) 0.4 و0.12', teacherEntryIds: ['t-l7-p69-check1-e'] },
    { id: 'l7-p69-check1-f', label: '(و) 0.70 و0.7', teacherEntryIds: ['t-l7-p69-check1-f'] },
  ] },
  { id: 'l7-p69-check2', page: 70, printedItem: 'تحقّق من فهمك (2) · صحة عبارة عن الخانات بعد الفاصلة (تبدأ أعلى ص70)', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تحقّق من فهمك', sourceSummary: 'اقرأ العبارة وناقش صحتها: العدد الذي فيه خانتان بعد الفاصلة أكبر دائماً من الذي فيه خانة واحدة. (تمتد العبارة إلى أعلى ص70.)', teacherEntryIds: ['t-l7-p69-check2'], branches: [] },
  { id: 'l7-p70-practice1', page: 70, printedItem: 'تدرّب ① · خط الأعداد بين 0.3 و0.4', sourceStatus: 'confirmed', studentStep: 'الخطوة 6 · تدرّب ① و②', sourceSummary: 'ثماني خانات فارغة بين 0.3 و0.4 مع العدد المطبوع 0.38.', teacherEntryIds: ['t-l7-p70-practice1'], branches: [] },
  { id: 'l7-p70-practice2', page: 70, printedItem: 'تدرّب ② · ثلاثة خطوط أعداد (أ، ب، ث)', sourceStatus: 'confirmed', studentStep: 'الخطوة 6 · تدرّب ① و②', sourceSummary: 'بين 0.1 و0.2 (المطبوع 0.16)، وبين 0.2 و0.3 (المطبوع 0.26)، وبين 0.3 و0.4 (المطبوع 0.34).', teacherEntryIds: [], branches: [
    { id: 'l7-p70-ruler2-a', label: '(أ) بين 0.1 و0.2', teacherEntryIds: ['t-l7-p70-ruler2-a'] },
    { id: 'l7-p70-ruler2-b', label: '(ب) بين 0.2 و0.3', teacherEntryIds: ['t-l7-p70-ruler2-b'] },
    { id: 'l7-p70-ruler2-c', label: '(ث) بين 0.3 و0.4', teacherEntryIds: ['t-l7-p70-ruler2-c'] },
  ] },
  { id: 'l7-p70-table', page: 70, printedItem: 'تدرّب ③ · جدول الكسور والكتابة العشرية', sourceStatus: 'confirmed', studentStep: 'الخطوة 7 · تدرّب ③ و④ و⑤', sourceSummary: 'ستة أعمدة: ثلاثة بكتابة عشرية مطبوعة (0.06 و0.01 و0.85)، وثلاثة بكسر مطبوع (17/100 و4/100 و7/100).', teacherEntryIds: [], branches: [
    { id: 'l7-p70-table-1', label: 'العمود 1 · 0.06', teacherEntryIds: ['t-l7-p70-table-1'] },
    { id: 'l7-p70-table-2', label: 'العمود 2 · 0.01', teacherEntryIds: ['t-l7-p70-table-2'] },
    { id: 'l7-p70-table-3', label: 'العمود 3 · 0.85', teacherEntryIds: ['t-l7-p70-table-3'] },
    { id: 'l7-p70-table-4', label: 'العمود 4 · 17/100', teacherEntryIds: ['t-l7-p70-table-4'] },
    { id: 'l7-p70-table-5', label: 'العمود 5 · 4/100', teacherEntryIds: ['t-l7-p70-table-5'] },
    { id: 'l7-p70-table-6', label: 'العمود 6 · 7/100', teacherEntryIds: ['t-l7-p70-table-6'] },
  ] },
  { id: 'l7-p71-ex4', page: 71, printedItem: 'تدرّب ④ · حوالي 70 بالمئة من سطح الأرض مغطى بالمياه', sourceStatus: 'confirmed', studentStep: 'الخطوة 7 · تدرّب ③ و④ و⑤', sourceSummary: 'اكتب العدد المعنون (70 بالمئة) عشرياً ثم كسراً.', teacherEntryIds: ['t-l7-p71-ex4'], branches: [] },
  { id: 'l7-p71-ex5', page: 71, printedItem: 'تدرّب ⑤ · تظليل شبكة 10 × 10 لتمثيل 0.15 و0.05 و0.5', sourceStatus: 'confirmed', studentStep: 'الخطوة 7 · تدرّب ③ و④ و⑤', sourceSummary: 'ثلاث شبكات بالمئة مربع؛ (ج) 0.5 ويكتب تحتها 0.5، (ب) 0.05، (أ) 0.15.', teacherEntryIds: [], branches: [
    { id: 'l7-p71-ex5-a', label: '(أ) 0.15', teacherEntryIds: ['t-l7-p71-ex5-a'] },
    { id: 'l7-p71-ex5-b', label: '(ب) 0.05', teacherEntryIds: ['t-l7-p71-ex5-b'] },
    { id: 'l7-p71-ex5-c', label: '(ج) 0.5', teacherEntryIds: ['t-l7-p71-ex5-c'] },
  ] },
  { id: 'l7-p71-ex6', page: 71, printedItem: 'تدرّب ⑥ · ستّ مقارنات بالرموز', sourceStatus: 'confirmed', studentStep: 'الخطوة 8 · تدرّب ⑥ و⑦ و⑧', sourceSummary: 'ضع <، >، أو = في ستة بنود مطبوعة، ومربعاتها فارغة.', teacherEntryIds: [], branches: [
    { id: 'l7-p71-ex6-a', label: '(أ) 0.04 و0.01', teacherEntryIds: ['t-l7-p71-ex6-a'] },
    { id: 'l7-p71-ex6-b', label: '(ب) 0.21 و0.31', teacherEntryIds: ['t-l7-p71-ex6-b'] },
    { id: 'l7-p71-ex6-c', label: '(ج) 0.53 و0.92', teacherEntryIds: ['t-l7-p71-ex6-c'] },
    { id: 'l7-p71-ex6-d', label: '(د) 4/100 و0.04', teacherEntryIds: ['t-l7-p71-ex6-d'] },
    { id: 'l7-p71-ex6-e', label: '(هـ) 0.3 و3/100', teacherEntryIds: ['t-l7-p71-ex6-e'] },
    { id: 'l7-p71-ex6-f', label: '(و) 1 و0.25', teacherEntryIds: ['t-l7-p71-ex6-f'] },
  ] },
  { id: 'l7-p71-ex7', page: 71, printedItem: 'تدرّب ⑦ · وصل العدد العشري بالكسر المساوي له', sourceStatus: 'confirmed', studentStep: 'الخطوة 8 · تدرّب ⑥ و⑦ و⑧', sourceSummary: 'العمود (أ): 0.07 و0.04 و0.5 و0.6؛ العمود (ب): 50/100 و60/100 و7/100 و4/100. لا توجد خطوط وصل مرسومة.', teacherEntryIds: [], branches: [
    { id: 'l7-p71-ex7-07', label: '0.07 ↔ 7/100', teacherEntryIds: ['t-l7-p71-ex7-07'] },
    { id: 'l7-p71-ex7-04', label: '0.04 ↔ 4/100', teacherEntryIds: ['t-l7-p71-ex7-04'] },
    { id: 'l7-p71-ex7-05', label: '0.5 ↔ 50/100', teacherEntryIds: ['t-l7-p71-ex7-05'] },
    { id: 'l7-p71-ex7-06', label: '0.6 ↔ 60/100', teacherEntryIds: ['t-l7-p71-ex7-06'] },
  ] },
  { id: 'l7-p71-ex8', page: 71, printedItem: 'تدرّب ⑧ · ضع عدداً مناسباً بين قيمتين', sourceStatus: 'confirmed', studentStep: 'الخطوة 8 · تدرّب ⑥ و⑦ و⑧', sourceSummary: 'المجالات المفتوحة: 0.14 < □ < 0.18، و0.3 < □ < 0.4، و0.81 < □ < 0.9.', teacherEntryIds: [], branches: [
    { id: 'l7-p71-ex8-a', label: '(أ) بين 0.14 و0.18', teacherEntryIds: ['t-l7-p71-ex8-a'] },
    { id: 'l7-p71-ex8-b', label: '(ب) بين 0.3 و0.4', teacherEntryIds: ['t-l7-p71-ex8-b'] },
    { id: 'l7-p71-ex8-c', label: '(ج) بين 0.81 و0.9', teacherEntryIds: ['t-l7-p71-ex8-c'] },
  ] },
]

export const lesson7CoverageTotals = lesson7SourceCoverage.reduce(
  (totals, element) => ({
    sourceBlocks: totals.sourceBlocks + 1,
    confirmed: totals.confirmed + (element.sourceStatus === 'confirmed' ? 1 : 0),
    partial: totals.partial + (element.sourceStatus === 'partial' ? 1 : 0),
    unresolved: 0,
  }),
  { sourceBlocks: 0, confirmed: 0, partial: 0, unresolved: 0 },
)

export function flattenLesson7CoverageIds(): string[] {
  return lesson7SourceCoverage.flatMap((element) => [element.id, ...element.branches.map((branch) => branch.id)])
}
