import type { TeacherEntry } from './types'
import {
  additionChecks, applicationProblems, australiaCheck, computeResult, drillItems, fmt,
  invoiceExample, itemSolution, laptopExample, refineryExample, subtractionChecks,
  subtractionExample, threeAddendsExample, warmupItems, fillPuzzles, digitAt,
  type CalcItem,
} from '../lessons/additionSubtractionData'

export interface AddSubQuestion { id: string; type: 'input' | 'choice'; text: string; options?: string[]; answer: string }

/**
 * Final test — brand-new questions authored for the platform (NOT copied from the textbook).
 * They probe understanding, application, error-spotting, inverse thinking and transfer.
 */
export const finalAssessment5: AddSubQuestion[] = [
  { id: 'as-final-1', type: 'input', text: 'احسب: 3,450,120 + 2,309,875 = ؟', answer: '5759995' },
  { id: 'as-final-2', type: 'input', text: 'احسب: 6,000,000 − 2,486,300 = ؟', answer: '3513700' },
  { id: 'as-final-3', type: 'choice', text: 'لإيجاد «مقدار الزيادة» بين قيمتين نستعمل عملية:', options: ['الجمع', 'الطرح', 'الضرب'], answer: 'الطرح' },
  { id: 'as-final-4', type: 'choice', text: 'جمع طالبٌ 4,580 + 3,650 فكتب الناتج 7,130. ما الخطأ؟', options: ['نسي حمل 1 من العشرات إلى المئات، والناتج الصحيح 8,230', 'لا يوجد خطأ', 'العددان غير قابلين للجمع'], answer: 'نسي حمل 1 من العشرات إلى المئات، والناتج الصحيح 8,230' },
  { id: 'as-final-5', type: 'input', text: 'أنتجت مزرعة 1,250,600 كغ قمح في السنة الأولى و980,400 كغ في السنة الثانية. كم أنتجت في السنتين معاً؟', answer: '2231000' },
  { id: 'as-final-6', type: 'input', text: 'عددٌ إذا طرحنا منه 1,200,000 نحصل على 3,450,000. ما هو العدد؟', answer: '4650000' },
  { id: 'as-final-7', type: 'choice', text: 'ما ناتج 999,999 + 1 ؟', options: ['1,000,000', '999,000', '100,000'], answer: '1,000,000' },
  { id: 'as-final-8', type: 'input', text: 'احسب مع الاستلاف: 500,000 − 173,268 = ؟', answer: '326732' },
  { id: 'as-final-9', type: 'choice', text: 'أيّ المقدارين أكبر: (2,300,000 + 450,000) أم (5,000,000 − 2,300,000)؟', options: ['المقدار الأول (2,750,000)', 'المقدار الثاني (2,700,000)', 'متساويان'], answer: 'المقدار الأول (2,750,000)' },
]

const addColumnSteps = 'نرتّب خانات الأعداد المتقابلة تحت بعضها بدءاً من خانة الآحاد.'
const subColumnSteps = 'نرتّب خانات العددين المتقابلة (المطروح منه في الأعلى) بدءاً من خانة الآحاد.'

/** Summarizes a batch of sub-questions (label) → (solution) for the teacher answer field. */
function batchAnswer(items: CalcItem[]): string {
  return items.map(it => `${it.label}) ${itemSolution(it)}`).join('؛ ')
}

const finalReasoningById: Record<string, string[]> = {
  'as-final-1': [addColumnSteps, 'نجمع كل خانة ونحمل عند تجاوز 9: 0+5=5، 2+7=9، 1+8=9، 0+9=9، 5+0=5، 4+3=7، 3+2=5.', 'الناتج 5,759,995.'],
  'as-final-2': [subColumnSteps, 'الأصفار في المطروح منه تفرض سلسلة استلاف متتابعة حتى نصل إلى الرقم 6.', '6,000,000 − 2,486,300 = 3,513,700. نتحقّق: 2,486,300 + 3,513,700 = 6,000,000.'],
  'as-final-3': ['«مقدار الزيادة» يعني الفرق بين قيمتين.', 'الفرق يُوجد بالطرح، لذلك الإجابة: الطرح.'],
  'as-final-4': ['في خانة العشرات: 8 + 5 = 13، نكتب 3 ونحمل 1 إلى المئات.', 'الطالب أهمل الحمل فنقص الناتج 100.', 'الناتج الصحيح 4,580 + 3,650 = 8,230.'],
  'as-final-5': ['المطلوب المجموع الكلّي، فنجمع الكميّتين.', '1,250,600 + 980,400 = 2,231,000 كغ.'],
  'as-final-6': ['المطلوب المطروح منه؛ نعكس العملية بالجمع.', '3,450,000 + 1,200,000 = 4,650,000.', 'نتحقّق: 4,650,000 − 1,200,000 = 3,450,000.'],
  'as-final-7': ['999,999 + 1: كل خانة 9 تصبح 0 مع حمل 1 إلى ما بعدها.', 'يتسلسل الحمل حتى تظهر خانة مليون جديدة، فالناتج 1,000,000.'],
  'as-final-8': ['500,000 − 173,268: نستلف عبر الأصفار المتتالية.', 'الناتج 326,732. نتحقّق: 173,268 + 326,732 = 500,000.'],
  'as-final-9': ['المقدار الأول: 2,300,000 + 450,000 = 2,750,000.', 'المقدار الثاني: 5,000,000 − 2,300,000 = 2,700,000.', '2,750,000 > 2,700,000، فالمقدار الأول أكبر.'],
}

export const lessonFiveTeacherEntries: TeacherEntry[] = [
  // ── Page 19 ──
  {
    id: 't5-p19-intro', title: 'مقدمة الدرس: الصحراء الكبرى وصحراء أستراليا',
    prompt: 'تبلغ مساحة الصحراء الكبرى 5,628,000 كم²، وتنقص مساحة صحراء أستراليا عنها بمقدار 3,264,240 كم².',
    answer: 'هذان العددان معطيان في المقدمة، ويُستعملان في تحقّق (1) صفحة 21 لإيجاد مساحة صحراء أستراليا = 2,363,760 كم².',
    source: { type: 'textbook', page: 19 },
    reasoning: ['المقدمة تقدّم موقفاً واقعياً لأعداد ضمن الملايين.', 'العددان لا يُحسبان هنا مباشرة؛ يُطلب لاحقاً طرحهما.', 'مساحة أستراليا = 5,628,000 − 3,264,240 = 2,363,760 كم².'],
    note: 'اربط المقدمة بنشاط تحقّق (1) لاحقاً؛ هذا يعطي الطالب هدفاً واضحاً منذ البداية.',
  },
  {
    id: 't5-p19-warmup', title: 'انطلاقة نشطة: احسب ناتج كلّ ممّا يأتي (12 فرعاً)',
    prompt: 'أ) 210+90، ب) 10+8، ج) 80−50، د) 100+45، هـ) 5+3، و) 75−50، ز) 25+75، ح) 100−25، ط) 300−290، ك) 20+30، ل) 11−6، م) 7−2.',
    answer: batchAnswer(warmupItems),
    source: { type: 'textbook', page: 19 },
    reasoning: ['عمليات ذهنية على أعداد صغيرة تُحل مباشرة دون أعمدة.', 'تُبرز العلاقة العكسية: 25+75=100 و100−25=75.', 'الهدف تهيئة الطالب لفكرة الجمع والطرح خانةً خانة.'],
    note: 'جميع الفروع الاثني عشر ممثّلة في منطقة الطالب كشبكة تفاعلية بتصحيح فوري.',
  },
  {
    id: 't5-p19-concept-add', title: 'الفكرة الأساسية: جمع الأعداد الطبيعية',
    prompt: 'كيف نجمع الأعداد الكبيرة ضمن الملايين؟',
    answer: 'نرتّب الخانات المتقابلة بدءاً من الآحاد ثم نجمع، ونحمل العشرة إلى الخانة التالية عند تجاوز 9.',
    source: { type: 'textbook', page: 19 },
    reasoning: ['كل خانة تتّسع لرقم واحد فقط، لذلك ننقل الفائض (الحمل).', 'المحاذاة على اليمين تضمن تقابل المنازل: آحاد مع آحاد…', 'الجمع تبديلي، فنراجع بإعادة الجمع بترتيب مختلف.'],
    note: 'الخطأ الشائع: محاذاة على اليسار، أو نسيان الحمل.',
  },
  {
    id: 't5-p19-invoice', title: 'مثال: قيمة فاتورة البناء',
    prompt: invoiceExample.context!,
    answer: `${itemSolution(invoiceExample)} — قيمة الفاتورة ${fmt(computeResult(invoiceExample.operands, invoiceExample.operator))} ل.س.`,
    source: { type: 'textbook', page: 19 },
    reasoning: [addColumnSteps, 'الآحاد: 5+1=6، العشرات: 6+2=8، المئات: 5+3=8، الألوف: 3+9=12 نكتب 2 ونحمل 1، عشرات الألوف: 0+8+1=9، مئات الألوف: 2+7=9.', 'قيمة الفاتورة 203,565 + 789,321 = 992,886 ل.س.'],
  },
  // ── Page 20 ──
  {
    id: 't5-p20-refinery', title: 'مثال: إنتاج مصفاة حمص في عامين',
    prompt: refineryExample.context!,
    answer: `${itemSolution(refineryExample)} — الإنتاج في العامين ${fmt(computeResult(refineryExample.operands, refineryExample.operator))} طنّاً.`,
    source: { type: 'textbook', page: 20 },
    reasoning: [addColumnSteps, 'نجمع خانةً خانة مع الحمل: يظهر حملٌ عند خانتي المئات والألوف.', '1,220,219 + 1,344,826 = 2,565,045 طن.'],
  },
  {
    id: 't5-p20-three', title: 'مثال: جمع ثلاثة أعداد',
    prompt: threeAddendsExample.context!,
    answer: itemSolution(threeAddendsExample),
    source: { type: 'textbook', page: 20 },
    reasoning: [addColumnSteps, 'العدد 78,371 أقصر، فنحاذيه على اليمين ونعامل الخانات العليا الفارغة كأصفار.', 'نجمع الأعداد الثلاثة في كل خانة مع الحمل: 1,328,748 + 3,014,578 + 78,371 = 4,421,697.'],
    note: 'عند جمع أكثر من عددين نجمع أرقام الخانة كلها ثم نحمل.',
  },
  // ── Page 21 ──
  {
    id: 't5-p21-check-add', title: 'تحقّق من فهمك: احسب ناتج كل من (جمع)',
    prompt: 'أ) 1,569,201 + 6,521,950، ب) 1,245,000 + 259,631 + 999.',
    answer: batchAnswer(additionChecks),
    source: { type: 'textbook', page: 21 },
    reasoning: [addColumnSteps, 'أ) 1,569,201 + 6,521,950 = 8,091,151.', 'ب) نجمع ثلاثة أعداد: 1,245,000 + 259,631 + 999 = 1,505,630.'],
    note: 'كلا الفرعين ممثّل في منطقة الطالب كتفاعل «جرّب ثم اكشف الحل».',
  },
  {
    id: 't5-p21-concept-sub', title: 'الفكرة الأساسية: طرح عدد من عدد آخر',
    prompt: 'كيف نطرح عدداً من عدد آخر ضمن الملايين؟ وما مصطلحات الطرح؟',
    answer: 'المطروح منه (العدد الأكبر في الأعلى)، المطروح (ما ننقصه)، الفرق (الناتج). نطرح خانةً خانة بدءاً من الآحاد ونستلف عند الحاجة.',
    source: { type: 'textbook', page: 21 },
    reasoning: ['إذا كان الرقم العلوي أصغر من السفلي نستلف 10 من الخانة المجاورة (تنقص 1).', 'الطرح يُستعمل لإيجاد الفرق أو مقدار الزيادة/النقص أو الباقي.', 'نتحقّق دائماً: المطروح + الفرق = المطروح منه.'],
    note: 'الخطأ الشائع: طرح الأصغر من الأكبر داخل الخانة الواحدة بدل الاستلاف.',
  },
  {
    id: 't5-p21-laptop', title: 'مثال: مقدار الزيادة في سعر الحاسب المحمول',
    prompt: laptopExample.context!,
    answer: `${itemSolution(laptopExample)} — مقدار الزيادة ${fmt(computeResult(laptopExample.operands, laptopExample.operator))} ل.س.`,
    source: { type: 'textbook', page: 21 },
    reasoning: [subColumnSteps, 'الآحاد: 0−5 لا يكفي، نستلف: 10−5=5. العشرات: 7−6=1. المئات: 5−3=2. الألوف: 0−8 نستلف: 10−8=2. عشرات الألوف: 1−1=0. مئات الألوف: 1−1=0.', '120,580 − 118,365 = 2,215 ل.س.'],
    note: 'ناتج الأعمدة رقماً رقماً هو 2,215 (نتحقّق: 118,365 + 2,215 = 120,580). إن ظهر في نسخة الكتاب المطبوعة رقم مختلف بخانة الآحاد فهو خطأ طباعي؛ اعتمد 2,215 لأنه ما يعطيه العمل العمودي والتحقق بالجمع.',
  },
  {
    id: 't5-p21-sub-example', title: 'مثال: طرح ضمن الملايين',
    prompt: subtractionExample.context!,
    answer: itemSolution(subtractionExample),
    source: { type: 'textbook', page: 21 },
    reasoning: [subColumnSteps, 'نطرح خانةً خانة مع الاستلاف حيث يلزم.', '3,221,991 − 2,154,231 = 1,067,760. نتحقّق: 2,154,231 + 1,067,760 = 3,221,991.'],
  },
  {
    id: 't5-p21-australia', title: 'تحقّق من فهمك (1): مساحة صحراء أستراليا',
    prompt: australiaCheck.context!,
    answer: `${itemSolution(australiaCheck)} — مساحة صحراء أستراليا ${fmt(computeResult(australiaCheck.operands, australiaCheck.operator))} كم².`,
    source: { type: 'textbook', page: 21 },
    reasoning: ['نعود إلى مقدمة الدرس: المساحة الأكبر 5,628,000، والنقص 3,264,240.', 'مساحة أستراليا = المساحة الكبرى − مقدار النقص.', '5,628,000 − 3,264,240 = 2,363,760 كم².'],
    note: 'يربط هذا النشاط الطرح بموقف المقدمة الواقعي.',
  },
  // ── Page 22 ──
  {
    id: 't5-p22-check-sub', title: 'تحقّق من فهمك (2): احسب ناتج (طرح)',
    prompt: 'أ) 982,419 − 121,900، ب) 9,457,236 − 7,256,209.',
    answer: batchAnswer(subtractionChecks),
    source: { type: 'textbook', page: 22 },
    reasoning: [subColumnSteps, 'أ) 982,419 − 121,900 = 860,519.', 'ب) 9,457,236 − 7,256,209 = 2,201,027.'],
  },
  {
    id: 't5-p22-drill', title: 'تدرّب ①: احسب ناتج كلّ ممّا يأتي (12 فرعاً)',
    prompt: 'أ) 1,194,768+3,819,300، ب) 5,420,569+5,913,304، ت) 1,234,587+5,419,201، ث) 5,825,100−128,872، ج) 8,000,000−4,117,500، ح) 7,230,158−5,122,041، خ) 2,351,039+1,847,005، د) 1,156,502+3,472,415، ذ) 2,135,577+4,724,201، ر) 8,952,100−3,126,051، ز) 9,000,900−7,026,221، س) 7,963,182−816,053.',
    answer: batchAnswer(drillItems),
    source: { type: 'textbook', page: 22 },
    reasoning: ['فروع الجمع (أ، ب، ت، خ، د، ذ): نجمع بالأعمدة مع الحمل.', 'فروع الطرح (ث، ج، ح، ر، ز، س): نطرح بالأعمدة مع الاستلاف، وانتبه للأصفار في ج) و ز).', 'جميع النواتج مذكورة في حقل الإجابة أعلاه، ويمكن للطالب كشف الحل العمودي لكل فرع في المنصة.'],
    note: 'الفروع الاثنا عشر جميعها ممثّلة في منطقة الطالب مع تصفية جمع/طرح وكشف عمودي.',
  },
  {
    id: 't5-p22-tourism', title: 'تدرّب ② (سياحة)',
    prompt: applicationProblems[0].question,
    answer: `${itemSolution(applicationProblems[0])} — عدد المنشورات ${fmt(computeResult(applicationProblems[0].operands, applicationProblems[0].operator))} منشوراً.`,
    source: { type: 'textbook', page: 22 },
    reasoning: ['المطلوب العدد الكلّي للمنشورات، فنجمع.', '230,569 + 654,289 = 884,858 منشوراً.'],
  },
  {
    id: 't5-p22-transport', title: 'تدرّب ③ (نقل)',
    prompt: applicationProblems[1].question,
    answer: `${itemSolution(applicationProblems[1])} — مقدار الزيادة ${fmt(computeResult(applicationProblems[1].operands, applicationProblems[1].operator))} طنّاً.`,
    source: { type: 'textbook', page: 22 },
    reasoning: ['المطلوب مقدار الزيادة، أي الفرق بين الكتلتين، فنطرح.', '2,356,154 − 2,102,389 = 253,765 طنّاً.'],
  },
  {
    id: 't5-p22-puzzle-a', title: 'تدرّب ④ أ: ضع الأعداد المناسبة في □ (جمع)',
    prompt: 'العدد الأول 214,053، والعدد الثاني □ 3 □ 9 7 □، والناتج 5 □ 6 □ □ 8.',
    answer: `العملية الكاملة: 214,053 + 331,975 = 546,028. الأرقام المفقودة — في العدد الثاني: خانة مئات الألوف ${digitAt(331975, 5)}، خانة الألوف ${digitAt(331975, 3)}، خانة الآحاد ${digitAt(331975, 0)}؛ وفي الناتج: عشرات الألوف ${digitAt(546028, 4)}، المئات ${digitAt(546028, 2)}، العشرات ${digitAt(546028, 1)}.`,
    source: { type: 'textbook', page: 22 },
    reasoning: [
      'نبدأ من الآحاد: 3 + □ = 8 ⟵ □ = 5.',
      'العشرات: 5 + 7 = 12، نكتب 2 (خانة الناتج) ونحمل 1.',
      'المئات: 0 + 9 + 1(حمل) = 10، نكتب 0 (خانة الناتج) ونحمل 1.',
      'الألوف: 4 + □ + 1(حمل) = 6 ⟵ □ = 1.',
      'عشرات الألوف: 1 + 3 = 4 (خانة الناتج).',
      'مئات الألوف: 2 + □ = 5 ⟵ □ = 3.',
      'التحقّق: 214,053 + 331,975 = 546,028.',
    ],
    note: 'مسألة ملء فراغات ذات حلّ وحيد؛ يُستنتج كل رقم مفقود من عمود واحد مع الحمل.',
  },
  {
    id: 't5-p22-puzzle-b', title: 'تدرّب ④ ب: ضع الأعداد المناسبة في □ (طرح)',
    prompt: 'المطروح منه 8,317,689، والمطروح □ □ 5 6 7 □ □، والناتج 1 0 □ □ □ 8 0.',
    answer: `العملية الكاملة: 8,317,689 − 7,256,709 = 1,060,980. الأرقام المفقودة — في المطروح: خانة الملايين ${digitAt(7256709, 6)}، مئات الألوف ${digitAt(7256709, 5)}، العشرات ${digitAt(7256709, 1)}، الآحاد ${digitAt(7256709, 0)}؛ وفي الناتج: عشرات الألوف ${digitAt(1060980, 4)}، الألوف ${digitAt(1060980, 3)}، المئات ${digitAt(1060980, 2)}.`,
    source: { type: 'textbook', page: 22 },
    reasoning: [
      'الآحاد: 9 − □ = 0 ⟵ □ = 9.',
      'العشرات: 8 − □ = 8 ⟵ □ = 0.',
      'المئات: 6 − 7 لا يكفي، نستلف: 16 − 7 = 9 (خانة الناتج)، وتنقص خانة الألوف 1.',
      'الألوف: (7−1) − 6 = 0 (خانة الناتج).',
      'عشرات الألوف: 1 − 5 لا يكفي، نستلف: 11 − 5 = 6 (خانة الناتج)، وتنقص مئات الألوف 1.',
      'مئات الألوف: (3−1) − □ = 0 ⟵ □ = 2.',
      'الملايين: 8 − □ = 1 ⟵ □ = 7.',
      'التحقّق: 7,256,709 + 1,060,980 = 8,317,689.',
    ],
    note: 'مسألة ملء فراغات ذات حلّ وحيد؛ يُستنتج كل رقم من عمود واحد مع الاستلاف.',
  },
  // ── Platform challenge shown in the puzzles step ──
  {
    id: 't5-mistake-spot', title: 'نشاط منصة: اكتشف الخطأ في الجمع',
    prompt: 'حلّ طالبٌ: 4,580 + 3,650 = 7,130. أين الخطأ؟',
    answer: 'نسي حمل 1 من خانة العشرات إلى المئات؛ الناتج الصحيح 8,230.',
    source: { type: 'platform' },
    reasoning: ['خانة العشرات: 8 + 5 = 13، نكتب 3 ونحمل 1.', 'الطالب لم يحمل 1 إلى المئات فنقص الناتج 100.', 'الناتج الصحيح: 4,580 + 3,650 = 8,230.'],
    note: 'نشاط تفاعلي إضافي لتعزيز مفهوم الحمل عبر اكتشاف الخطأ.',
  },
  // ── Final test solutions (platform-authored) ──
  ...finalAssessment5.map((q): TeacherEntry => ({
    id: q.id,
    title: `الاختبار الختامي: ${q.text}`,
    prompt: q.text + (q.type === 'choice' ? ` — الخيارات: ${q.options!.join(' / ')}` : ''),
    answer: q.answer,
    source: { type: 'platform' },
    reasoning: finalReasoningById[q.id] ?? ['طبّق قاعدة الجمع أو الطرح بالأعمدة، ثم تحقّق بالعملية العكسية.'],
  })),
]

export const lessonFiveRequiredSolutionIds = lessonFiveTeacherEntries.map(entry => entry.id)
