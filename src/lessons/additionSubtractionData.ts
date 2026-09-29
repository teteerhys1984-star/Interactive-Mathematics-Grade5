/**
 * Lesson 5 — «جمع الأعداد الطبيعيّة وطرحها» (textbook pages 19–22).
 *
 * Every number that appears in the student experience lives here so that the lesson component,
 * the teacher guide, and the coverage check all read from ONE source of truth. Answers are never
 * hand-typed next to a problem in the UI: they are derived from `computeResult`, so a wrong operand
 * can never silently ship a wrong answer.
 */

export type Operator = '+' | '-'

/** A single arithmetic item (a book sub-question or a worked example). */
export interface CalcItem {
  id: string
  label: string
  operands: number[]
  operator: Operator
  /** Optional real-world framing kept verbatim from the textbook. */
  context?: string
}

/** Adds all addends (for '+') or subtracts the second operand from the first (for '-'). */
export function computeResult(operands: number[], operator: Operator): number {
  return operator === '+'
    ? operands.reduce((total, value) => total + value, 0)
    : operands.reduce((total, value, index) => (index === 0 ? value : total - value))
}

/** Western thousands grouping so large numbers stay readable (rendered inside <MathExpression>). */
export function fmt(value: number): string {
  return value.toLocaleString('en-US')
}

/** Renders an item as an inline expression string, e.g. "203,565 + 789,321". */
export function itemExpression(item: CalcItem): string {
  const symbol = item.operator === '+' ? ' + ' : ' − '
  return item.operands.map(fmt).join(symbol)
}

/** Full "expression = answer" string used in the teacher guide. */
export function itemSolution(item: CalcItem): string {
  return `${itemExpression(item)} = ${fmt(computeResult(item.operands, item.operator))}`
}

// ────────────────────────────────────────────────────────────────────────────
// Page 19 — انطلاقة نشطة (mental-math warm-up): احسب ناتج كلّ ممّا يأتي.
// ────────────────────────────────────────────────────────────────────────────
export const warmupItems: CalcItem[] = [
  { id: 'w-a', label: 'أ', operands: [210, 90], operator: '+' },
  { id: 'w-b', label: 'ب', operands: [10, 8], operator: '+' },
  { id: 'w-c', label: 'ج', operands: [80, 50], operator: '-' },
  { id: 'w-d', label: 'د', operands: [100, 45], operator: '+' },
  { id: 'w-e', label: 'هـ', operands: [5, 3], operator: '+' },
  { id: 'w-w', label: 'و', operands: [75, 50], operator: '-' },
  { id: 'w-z', label: 'ز', operands: [25, 75], operator: '+' },
  { id: 'w-h', label: 'ح', operands: [100, 25], operator: '-' },
  { id: 'w-t', label: 'ط', operands: [300, 290], operator: '-' },
  { id: 'w-k', label: 'ك', operands: [20, 30], operator: '+' },
  { id: 'w-l', label: 'ل', operands: [11, 6], operator: '-' },
  { id: 'w-m', label: 'م', operands: [7, 2], operator: '-' },
]

// ────────────────────────────────────────────────────────────────────────────
// Worked examples from the "تعلّم" boxes (pages 19–21).
// ────────────────────────────────────────────────────────────────────────────
export const invoiceExample: CalcItem = {
  id: 'ex-invoice', label: 'فاتورة البناء', operands: [203565, 789321], operator: '+',
  context: 'الفاتورة تبيّن سعر شراء كميّات من المواد اللّازمة لإكمال البناء: إسمنت 203,565 ل.س، وحديد 789,321 ل.س. ما قيمة الفاتورة؟',
}
export const refineryExample: CalcItem = {
  id: 'ex-refinery', label: 'مصفاة حمص', operands: [1220219, 1344826], operator: '+',
  context: 'إنتاج البنزين الممتاز في مصفاة حمص في عام 2007 كان 1,220,219 طن، وفي عام 2006 كان 1,344,826 طن. كم كان إنتاج المصفاة في العامين معاً؟',
}
export const threeAddendsExample: CalcItem = {
  id: 'ex-three', label: 'جمع ثلاثة أعداد', operands: [1328748, 3014578, 78371], operator: '+',
  context: 'ما ناتج: 1,328,748 + 3,014,578 + 78,371 ؟',
}
export const laptopExample: CalcItem = {
  id: 'ex-laptop', label: 'سعر الحاسب المحمول', operands: [120580, 118365], operator: '-',
  context: 'سعر حاسب محمول اليوم 120,580 ليرة سورية، وكان سعره الشهر الماضي 118,365 ليرة سورية. ما مقدار الزيادة في سعره؟',
}
export const subtractionExample: CalcItem = {
  id: 'ex-sub', label: 'طرح ضمن الملايين', operands: [3221991, 2154231], operator: '-',
  context: 'ما ناتج: 3,221,991 − 2,154,231 ؟',
}

export const additionExamples = [invoiceExample, refineryExample, threeAddendsExample]
export const subtractionExamples = [laptopExample, subtractionExample]

// ────────────────────────────────────────────────────────────────────────────
// تحقق من فهمك — checkpoints.
// ────────────────────────────────────────────────────────────────────────────
// Page 21 (after addition): احسب ناتج كل من.
export const additionChecks: CalcItem[] = [
  { id: 'chk-add-a', label: 'أ', operands: [1569201, 6521950], operator: '+' },
  { id: 'chk-add-b', label: 'ب', operands: [1245000, 259631, 999], operator: '+' },
]
// Page 21 تحقق (1): عُد إلى مقدمة الدرس واحسب مساحة صحراء أستراليا.
// مساحة الصحراء الكبرى 5,628,000 كم²، وتنقص عنها صحراء أستراليا بمقدار 3,264,240 كم².
export const australiaCheck: CalcItem = {
  id: 'chk-australia', label: 'مساحة صحراء أستراليا', operands: [5628000, 3264240], operator: '-',
  context: 'مساحة الصحراء الكبرى 5,628,000 كم²، وتنقص مساحة صحراء أستراليا عنها بمقدار 3,264,240 كم². احسب مساحة صحراء أستراليا.',
}
// Page 22 (after subtraction): احسب ناتج.
export const subtractionChecks: CalcItem[] = [
  { id: 'chk-sub-a', label: 'أ', operands: [982419, 121900], operator: '-' },
  { id: 'chk-sub-b', label: 'ب', operands: [9457236, 7256209], operator: '-' },
]

// ────────────────────────────────────────────────────────────────────────────
// تدرّب ① — احسب ناتج كلّ ممّا يأتي (page 22).
// ────────────────────────────────────────────────────────────────────────────
export const drillItems: CalcItem[] = [
  { id: 'd-a', label: 'أ', operands: [1194768, 3819300], operator: '+' },
  { id: 'd-b', label: 'ب', operands: [5420569, 5913304], operator: '+' },
  { id: 'd-t', label: 'ت', operands: [1234587, 5419201], operator: '+' },
  { id: 'd-th', label: 'ث', operands: [5825100, 128872], operator: '-' },
  { id: 'd-j', label: 'ج', operands: [8000000, 4117500], operator: '-' },
  { id: 'd-h', label: 'ح', operands: [7230158, 5122041], operator: '-' },
  { id: 'd-kh', label: 'خ', operands: [2351039, 1847005], operator: '+' },
  { id: 'd-d', label: 'د', operands: [1156502, 3472415], operator: '+' },
  { id: 'd-dh', label: 'ذ', operands: [2135577, 4724201], operator: '+' },
  { id: 'd-r', label: 'ر', operands: [8952100, 3126051], operator: '-' },
  { id: 'd-z', label: 'ز', operands: [9000900, 7026221], operator: '-' },
  { id: 'd-s', label: 'س', operands: [7963182, 816053], operator: '-' },
]

// ────────────────────────────────────────────────────────────────────────────
// تدرّب ②③ — real-world word problems (page 22).
// ────────────────────────────────────────────────────────────────────────────
export const applicationProblems: (CalcItem & { title: string; question: string })[] = [
  {
    id: 'app-tourism', label: '②', title: 'سياحة', operands: [230569, 654289], operator: '+',
    question: 'طبعت مؤسّسة سياحيّة 230,569 منشوراً دعائيّاً لقلعة دمشق، و654,289 منشوراً دعائيّاً لآثار تدمر. ما عدد المنشورات التي طبعتها تلك المؤسّسة؟',
  },
  {
    id: 'app-transport', label: '③', title: 'نقل', operands: [2356154, 2102389], operator: '-',
    question: 'بلغت كتلة ما نقلته شركة نقل البضائع حول العالم حتّى نهاية العام 2,356,154 طنّاً، علماً أنّها نقلت خلال نفس الفترة من العام الماضي 2,102,389 طنّاً. ما مقدار الزيادة في الكتلة؟',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// تدرّب ④ — ضع الأعداد المناسبة في □ (fill-in-the-box puzzles, page 22).
// hidden = digit positions counted FROM THE RIGHT (0 = units, 1 = tens, …).
// ────────────────────────────────────────────────────────────────────────────
export interface PuzzleRow { value: number; hidden: number[] }
export interface FillPuzzle {
  id: string
  label: string
  operator: Operator
  width: number
  rows: PuzzleRow[]
  result: PuzzleRow
}

export const fillPuzzles: FillPuzzle[] = [
  {
    id: 'puzzle-a', label: 'أ', operator: '+', width: 6,
    rows: [
      { value: 214053, hidden: [] },
      { value: 331975, hidden: [5, 3, 0] }, // □3□97□  → مئات الألوف والألوف والآحاد مجهولة
    ],
    result: { value: 546028, hidden: [4, 2, 1] }, // 5□6□□8
  },
  {
    id: 'puzzle-b', label: 'ب', operator: '-', width: 7,
    rows: [
      { value: 8317689, hidden: [] },
      { value: 7256709, hidden: [6, 5, 1, 0] }, // □□567□□
    ],
    result: { value: 1060980, hidden: [4, 3, 2] }, // 10□□□80
  },
]

/** The single digit that belongs in a hidden position (index counted from the right). */
export function digitAt(value: number, indexFromRight: number): number {
  return Math.floor(Math.abs(value) / 10 ** indexFromRight) % 10
}

/** Every book calc item, for the coverage audit. */
export const allBookCalcItems: CalcItem[] = [
  ...warmupItems,
  ...additionExamples,
  ...subtractionExamples,
  ...additionChecks,
  australiaCheck,
  ...subtractionChecks,
  ...drillItems,
  ...applicationProblems,
]
