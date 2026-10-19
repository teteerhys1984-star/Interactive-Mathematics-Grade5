import type { TeacherEntry } from '../teacher/types'

/** Unit 2 · Lesson 8 · source pages 72–76. Western digits are intentionally isolated by MathExpression. */
export const lessonTitle = 'الأجزاء العشرية (3)'
export const lessonId = 'decimal-parts-three'

export type Relation = '<' | '=' | '>'
export type CompareItem = { id: string; label: string; left: string; right: string; relation: Relation }
export type SourceBranch = { id: string; label: string; prompt: string; answer: string; reasoning: string[] }
export type SourceElement = {
  id: string; page: number; section: string; kind: 'content' | 'exercise'; prompt: string
  answer: string; reasoning: string[]; branches?: SourceBranch[]
}

export const p72Cubes = [
  { id: 'l8-p72-cube-a', label: 'أ', numerator: 2 },
  { id: 'l8-p72-cube-b', label: 'ب', numerator: 7 },
  { id: 'l8-p72-cube-c', label: 'ج', numerator: 1000 },
] as const

export const p72Comparisons: CompareItem[] = [
  { id: 'l8-p72-compare-a', label: 'أ', left: '3/1000', right: '1', relation: '<' },
  { id: 'l8-p72-compare-b', label: 'ب', left: '5/1000', right: '7/1000', relation: '<' },
  { id: 'l8-p72-compare-c', label: 'ج', left: '3/100', right: '4/1000', relation: '>' },
]

export const p73Examples = [
  { id: 'l8-p73-example-213', numerator: 213, decimal: '0.213', verbal: 'مئتان وثلاثة عشر جزءاً من ألف' },
  { id: 'l8-p73-example-51', numerator: 51, decimal: '0.051', verbal: 'واحد وخمسون جزءاً من ألف' },
  { id: 'l8-p73-example-5', numerator: 5, decimal: '0.005', verbal: 'خمسة أجزاء من ألف' },
] as const

export const p73Fractions = [415, 318, 81, 9].map((numerator) => ({
  id: `l8-p73-check1-${numerator}`, numerator,
  decimal: `0.${String(numerator).padStart(3, '0')}`,
  verbal: numerator === 415 ? 'أربعمئة وخمسة عشر جزءاً من ألف' : numerator === 318 ? 'ثلاثمئة وثمانية عشر جزءاً من ألف' : numerator === 81 ? 'واحد وثمانون جزءاً من ألف' : 'تسعة أجزاء من ألف',
}))

export const p74Comparisons: CompareItem[] = [
  { id: 'l8-p74-example-513-418', label: 'مثال 1', left: '0.418', right: '0.513', relation: '<' },
  { id: 'l8-p74-example-42-325', label: 'مثال 2', left: '0.325', right: '0.42', relation: '<' },
]
export const p75Comparisons: CompareItem[] = [
  { id: 'l8-p75-check-a', label: 'أ', left: '0.521', right: '0.125', relation: '>' },
  { id: 'l8-p75-check-b', label: 'ب', left: '0.153', right: '0.41', relation: '<' },
  { id: 'l8-p75-check-c', label: 'ج', left: '0.02', right: '0.002', relation: '>' },
  { id: 'l8-p75-check-d', label: 'د', left: '0.100', right: '0.1', relation: '=' },
]
export const p76Comparisons: CompareItem[] = [
  { id: 'l8-p76-check4-a', label: 'أ', left: '0.004', right: '0.001', relation: '>' },
  { id: 'l8-p76-check4-b', label: 'ب', left: '0.021', right: '0.031', relation: '<' },
  { id: 'l8-p76-check4-c', label: 'ج', left: '0.115', right: '0.109', relation: '>' },
  { id: 'l8-p76-check4-d', label: 'د', left: '4/1000', right: '0.004', relation: '=' },
  { id: 'l8-p76-check4-e', label: 'هـ', left: '0.007', right: '7/1000', relation: '=' },
  { id: 'l8-p76-check4-f', label: 'و', left: '1', right: '0.005', relation: '>' },
]

export const p75Rulers = [
  { id: 'l8-p75-ruler-a', label: 'أ', from: 20, to: 30, printed: 27 },
  { id: 'l8-p75-ruler-b', label: 'ب', from: 30, to: 40, printed: 36 },
] as const
export const p76Ruler = { id: 'l8-p76-ruler-th', label: 'ث', from: 40, to: 50, printed: 44 } as const

export const p76Table = [
  { id: 'l8-p76-table-1', printed: 'fraction' as const, numerator: 5 },
  { id: 'l8-p76-table-2', printed: 'fraction' as const, numerator: 13 },
  { id: 'l8-p76-table-3', printed: 'fraction' as const, numerator: 107 },
  { id: 'l8-p76-table-4', printed: 'decimal' as const, value: '0.725', numerator: 725 },
  { id: 'l8-p76-table-5', printed: 'decimal' as const, value: '0.006', numerator: 6 },
  { id: 'l8-p76-table-6', printed: 'decimal' as const, value: '0.018', numerator: 18 },
] as const
export const p76Matches = [
  { id: 'l8-p76-match-008', decimal: '0.008', fraction: '8/1000' },
  { id: 'l8-p76-match-04', decimal: '0.04', fraction: '4/100' },
  { id: 'l8-p76-match-004', decimal: '0.004', fraction: '4/1000' },
  { id: 'l8-p76-match-08', decimal: '0.08', fraction: '8/100' },
] as const
export const p76Intervals = [
  { id: 'l8-p76-interval-a', label: 'أ', lower: '0.154', upper: '0.158', expression: '0.154 < x < 0.158', sample: '0.156' },
  { id: 'l8-p76-interval-b', label: 'ب', lower: '0.31', upper: '0.404', expression: '0.31 < x < 0.404', sample: '0.35' },
  { id: 'l8-p76-interval-c', label: 'ج', lower: '0.081', upper: '0.19', expression: '0.081 < x < 0.19', sample: '0.1' },
  { id: 'l8-p76-interval-d', label: 'د', lower: '0.71', upper: '0.815', expression: '0.815 > x > 0.71', sample: '0.75' },
  { id: 'l8-p76-interval-e', label: 'هـ', lower: '0.516', upper: '0.58', expression: '0.58 > x > 0.516', sample: '0.55' },
  { id: 'l8-p76-interval-w', label: 'و', lower: '0.007', upper: '0.01', expression: '0.01 > x > 0.007', sample: '0.008' },
] as const

const b = (id: string, label: string, prompt: string, answer: string, reasoning: string[]): SourceBranch => ({ id, label, prompt, answer, reasoning })
const content = (id: string, page: number, section: string, prompt: string, answer: string, reasoning: string[]): SourceElement => ({ id, page, section, kind: 'content', prompt, answer, reasoning })
const exercise = (id: string, page: number, section: string, prompt: string, branches: SourceBranch[], answer = 'تُعرض كل الفروع في نشاط الدرس؛ الإجابات المفصّلة محفوظة في منطقة المعلم.'): SourceElement => ({
  id, page, section, kind: 'exercise', prompt, answer,
  reasoning: ['نحدّد المطلوب أولاً، ثم نختار تمثيل الأجزاء من ألف أو قاعدة المقارنة المناسبة.', 'بعد الحل نتحقق بتحويل الطرفين إلى أجزاء من ألف أو بمراجعة قيمة المنازل.'], branches,
})

export const lesson8SourceElements: SourceElement[] = [
  content('l8-p72-goals', 72, 'سنتعلّم', 'ما أهداف الدرس المطبوعة؟', 'كتابة الأجزاء من ألف كتابة عشرية؛ والتعبير اللفظي عنها؛ ومقارنة الأجزاء من ألف.', ['هذا نقل مباشر لأهداف الإطار المطبوع، وليس نشاطاً إضافياً.']),
  content('l8-p72-opening', 72, 'انطلاقة نشطة', 'كيف يقسم المكعب إلى ألف جزء متساوٍ؟', 'شبكة 10 × 10 × 10 تحتوي 1000 مكعب صغير؛ كل مكعب صغير جزء واحد من ألف.', ['كل واحد من الأبعاد الثلاثة مقسوم إلى عشرة أجزاء.', '10 × 10 × 10 = 1000 جزء متساوٍ؛ لذلك جزء واحد يساوي 1/1000 من المكعب الكامل.']),
  exercise('l8-p72-ex1', 72, 'السؤال 1 · أجزاء المكعب الملوّنة', 'أكمل الكسر ذي المقام 1000 الذي يعبّر عن الجزء الملوّن في كل مكعب.', p72Cubes.map((item) => b(item.id, item.label, `كم جزءاً ملوّناً من أصل 1000 في الشكل (${item.label})؟`, `${item.numerator}/1000`, [`المقام 1000 لأن النموذج مقسّم إلى ألف جزء متساوٍ.`, `نعدّ الأجزاء الملوّنة: ${item.numerator}.`, `إذن الكسر ${item.numerator}/1000.`])), 'أ: 2/1000؛ ب: 7/1000؛ ج: 1000/1000.'),
  exercise('l8-p72-ex2', 72, 'السؤال 2 · مقارنة الكسور', 'ضع الرمز (< أو > أو =) في كل مربع لتحصل على مقارنة صحيحة.', p72Comparisons.map((item) => b(item.id, item.label, `قارن ${item.left} و${item.right}.`, `${item.left} ${item.relation} ${item.right}`, [`نحوّل الطرفين إلى أجزاء من ألف: ${item.left} و${item.right}.`, `نقارن القيم: ${item.relation === '<' ? 'الطرف الأيسر أصغر.' : item.relation === '>' ? 'الطرف الأيسر أكبر.' : 'القيمتان متساويتان.'}`, `إذن ${item.left} ${item.relation} ${item.right}.`])), 'أ: 3/1000 < 1؛ ب: 5/1000 < 7/1000؛ ج: 3/100 > 4/1000.'),
  content('l8-p73-place-value', 73, 'الأجزاء من ألف', 'ما الكتابة العشرية للكسر الذي مقامه 1000؟', 'نكتب ثلاثة أرقام بعد الفاصلة؛ البسط يمثل عدد الأجزاء من ألف، ونضيف صفراً إلى يسار بسط من خانة أو خانتين عند الحاجة.', ['الألف يساوي 1000 جزء متساوٍ، لذلك نحتاج ثلاث منازل بعد الفاصلة.', 'نضع الفاصلة بعد الصفر الصحيح، ثم نكتب البسط في ثلاث خانات: 5/1000 = 0.005 و51/1000 = 0.051.', 'نضيف الأصفار إلى يسار البسط بعد الفاصلة، لا إلى يمينه؛ فذلك يحفظ قيمة المنزلة.']),
  content('l8-p73-examples', 73, 'أمثلة محلولة · ثلاث خانات', 'حوّل 213/1000 و51/1000 و5/1000 إلى صيغة عشرية ولفظية.', '213/1000 = 0.213 (مئتان وثلاثة عشر جزءاً من ألف)؛ 51/1000 = 0.051 (واحد وخمسون جزءاً من ألف)؛ 5/1000 = 0.005 (خمسة أجزاء من ألف).', ['المقام 1000 يفرض ثلاث خانات بعد الفاصلة.', '213 من ثلاث خانات فيكتب 0.213؛ و51 نكمله إلى 051 فيكتب 0.051؛ و5 نكمله إلى 005 فيكتب 0.005.', 'نقرأ البسط في كل حالة على أنه عدد أجزاء من ألف.']),
  content('l8-p73-whole', 73, 'كل ألف جزء من ألف', 'إلى ماذا يعادل 1000 جزء من ألف؟', '1000/1000 = 1، أي الواحد الكامل.', ['عند أخذ الألف جزء كلها نكون قد أخذنا المكعب أو الواحد كاملاً.', 'لذلك 1000/1000 = 1.']),
  exercise('l8-p73-check1', 73, 'تحقّق من فهمك · السؤال 1', 'اكتب كل كسر كتابة عشرية ثم لفظية: 415/1000، 318/1000، 81/1000، 9/1000.', p73Fractions.map((item) => b(item.id, `${item.numerator}/1000`, `اكتب ${item.numerator}/1000 عشرياً ولفظياً.`, `${item.decimal}؛ ${item.verbal}.`, [`المقام 1000، لذا نكتب البسط في ثلاث خانات بعد الفاصلة.`, `البسط ${item.numerator} يكتب ${item.decimal} بعد إضافة الأصفار اليسارية اللازمة.`, `لفظياً: ${item.verbal}.`])), '415/1000 = 0.415؛ 318/1000 = 0.318؛ 81/1000 = 0.081؛ 9/1000 = 0.009، وتُقرأ جميعها «… جزءاً من ألف».'),
  exercise('l8-p75-check2', 75, 'تحقّق من فهمك · السؤال 2', 'اكتب التعبير اللفظي عن 0.999 ثم اكتب الكسر المساوي له ومقامه 1000.', [b('l8-p75-check2-a', 'أ', 'عبّر لفظياً عن 0.999.', 'تسعمئة وتسعة وتسعون جزءاً من ألف.', ['ثلاث خانات بعد الفاصلة تعني أجزاء من ألف.', 'الأرقام 999 تمثل 999 جزءاً من ألف؛ لذلك نقرأ «تسعمئة وتسعة وتسعون جزءاً من ألف».']), b('l8-p75-check2-b', 'ب', 'اكتب 0.999 كسراً مقامه 1000.', '999/1000.', ['الأرقام الثلاثة بعد الفاصلة هي البسط 999.', 'المقام 1000 لأن العدد إلى ثلاثة أرقام عشرية.', 'إذن 0.999 = 999/1000.'])], 'لفظياً: تسعمئة وتسعة وتسعون جزءاً من ألف؛ والكسر 999/1000.'),
  content('l8-p74-compare-rule', 74, 'المقارنة بين الأجزاء من ألف', 'ما طريقة مقارنة عددين عشريين حتى منزلة الألف؟', 'نوحّد عدد الخانات بعد الفاصلة إلى ثلاث، أو نحوّل إلى كسور مقامها 1000، ثم نقارن البسطين.', ['كل عدد عشري ذي ثلاث خانات يساوي كسراً مقامه 1000.', 'عند توحيد المقام تصبح مقارنة الكسور مقارنة للبسطين فقط.', 'إذا اختلف عدد الخانات نضيف أصفاراً إلى يمين العدد العشري من دون تغيير قيمته.']),
  exercise('l8-p74-examples', 74, 'مثالا المقارنة', 'اقرأ المقارنتين المحلولتين في الكتاب واشرح سبب النتيجة.', p74Comparisons.map((item) => b(item.id, item.label, `قارن ${item.left} و${item.right}.`, `${item.left} ${item.relation} ${item.right}.`, item.label === 'مثال 1' ? ['نحوّل 0.513 إلى 513/1000 و0.418 إلى 418/1000.', '513 > 418 لأن 5 مئات من الألف أكبر من 4 مئات من الألف.', 'إذن 0.418 < 0.513.'] : ['نكتب 0.42 = 0.420، ثم 0.420 = 420/1000 و0.325 = 325/1000.', '420 > 325، أي إن 420 جزءاً من ألف أكبر من 325 جزءاً من ألف.', 'إذن 0.325 < 0.42.'])), '0.418 < 0.513؛ و0.325 < 0.420 = 0.42.'),
  content('l8-p74-relation', 74, 'العلاقة بين الأعشار والأجزاء من مئة وألف', 'ما العلاقة بين الجزء من عشرة والجزء من مئة والجزء من ألف؟', '1/10 = 10/100 = 100/1000، و1/100 = 10/1000، و1/1000 جزء واحد من ألف.', ['الوجه المقسّم إلى 10 × 10 يبيّن 100 جزء من مئة؛ الصف الواحد عشرة أجزاء من مئة يساوي جزءاً من عشرة.', 'عند تقسيم كل جزء من مئة إلى عشرة أجزاء أصغر نحصل على 1000 جزء من ألف.', 'لذلك كل 10 أجزاء من ألف = جزء واحد من مئة، وكل 100 جزء من ألف = جزء واحد من عشرة.']),
  content('l8-p74-number-line', 74, 'خط الأعداد المكبّر', 'ماذا يبيّن تكبير المسافة بين 0 و0.1؟', 'كل خطوة صغيرة تساوي 0.001؛ والعدد 0.01 نفسه يكتب 0.010 عند استخدام ثلاث خانات.', ['المسافة من 0 إلى 0.1 مقسمة إلى أجزاء متساوية من مئة، ثم تكبير جزء من المئة يقسمه إلى عشرة أجزاء من ألف.', '0.01 = 0.010؛ إضافة صفر إلى يمين الجزء العشري لا تغيّر القيمة.', 'علامات 0.001 إلى 0.009 تقع بين 0 و0.01.']),
  exercise('l8-p75-between-examples', 75, 'مثالا إيجاد عدد بين عددين', 'اقرأ طريقتي اختيار عدد بين حدّين عشريين.', [b('l8-p75-between-a', 'أ', 'أعطِ عدداً عشرياً بين 0.01 و0.02.', 'مثال: 0.015، وتُقبل أي قيمة تحقق 0.01 < العدد < 0.02.', ['نكتب الحدين بثلاث خانات: 0.010 و0.020.', 'نختار قيمة داخلية مثل 0.015.', 'نتحقق: 0.010 < 0.015 < 0.020.']), b('l8-p75-between-b', 'ب', 'أعطِ عدداً يقع بين 0.175 و0.2.', 'الكتاب يختار 0.181؛ إذ 0.175 < 0.181 < 0.200.', ['نكتب 0.2 بثلاث خانات: 0.200.', 'نختار 0.181 كما في المثال المطبوع.', 'نقارن الأجزاء من ألف: 175 < 181 < 200.'])], 'للمثال الأول توجد اختيارات كثيرة مثل 0.015؛ والمثال الثاني في الكتاب 0.181.'),
  exercise('l8-p75-check1', 75, 'تحقّق من فهمك · السؤال 1', 'ضع الرمز المناسب (< أو > أو =) في كل مربع.', p75Comparisons.map((item) => b(item.id, item.label, `قارن ${item.left} و${item.right}.`, `${item.left} ${item.relation} ${item.right}.`, [`نوحّد الخانات إلى ثلاث: ${item.left} و${item.right}.`, `نقارن الأجزاء من ألف، فتكون العلاقة ${item.relation}.`, `الإجابة: ${item.left} ${item.relation} ${item.right}.`])), 'أ: 0.521 > 0.125؛ ب: 0.153 < 0.41؛ ج: 0.02 > 0.002؛ د: 0.100 = 0.1.'),
  exercise('l8-p75-practice1', 75, 'تدرّب · السؤال 1 (أ، ب)', 'أكمل تدريجات خطّي الأعداد، مع المحافظة على مقدار الزيادة بين العلامات.', p75Rulers.map((item) => {
    const values = Array.from({ length: 9 }, (_, i) => `${(item.from + i + 1) / 1000}`)
    return b(item.id, item.label, `أكمل خط الأعداد من 0.${String(item.from).padStart(2, '0')} إلى 0.${String(item.to).padStart(2, '0')}؛ المطبوع 0.${String(item.printed).padStart(3, '0')}.`, `0.${values.map((value) => value.split('.')[1].padStart(3, '0')).join('، 0.')}`, ['الفارق بين الطرفين 0.01، والخط مقسم إلى عشر خطوات متساوية.', 'قيمة كل تدريجة تزيد 0.001 عن سابقتها.', `نملأ المواضع من ${item.from + 1} إلى ${item.to - 1} من الألف، مع إبقاء العدد المطبوع في مكانه.`])
  }), 'أ: 0.021، 0.022، 0.023، 0.024، 0.025، 0.026، 0.027، 0.028، 0.029؛ ب: 0.031 إلى 0.039 بالتتابع.'),
  exercise('l8-p76-practice1-th', 76, 'تدرّب · السؤال 1 (ث)', 'أكمل خط الأعداد من 0.04 إلى 0.05؛ العدد 0.044 مطبوع.', [b(p76Ruler.id, 'ث', 'أكمل القيم على خط الأعداد من 0.04 إلى 0.05.', '0.041، 0.042، 0.043، 0.044، 0.045، 0.046، 0.047، 0.048، 0.049.', ['الطرفان 0.040 و0.050 يفصل بينهما 0.010.', 'نقسم الفارق إلى عشر خطوات؛ كل خطوة 0.001.', 'نكتب القيم الداخلية بالتتابع، مع تثبيت 0.044 المطبوع.'])], '0.041 إلى 0.049؛ و0.044 مطبوع ضمن الترتيب.'),
  exercise('l8-p76-table', 76, 'تدرّب · السؤال 2 (الجدول)', 'أكمل التحويل بين الكسر ذي المقام 1000 والكتابة العشرية.', p76Table.map((item, index) => b(item.id, `العمود ${index + 1}`, item.printed === 'fraction' ? `حوّل ${item.numerator}/1000 إلى كتابة عشرية.` : `حوّل ${item.value} إلى كسر مقامه 1000.`, item.printed === 'fraction' ? `0.${String(item.numerator).padStart(3, '0')}` : `${item.numerator}/1000`, [`المقام 1000 يعني ثلاث خانات بعد الفاصلة.`, item.printed === 'fraction' ? `نكتب ${item.numerator} في ثلاث خانات: 0.${String(item.numerator).padStart(3, '0')}.` : `الأرقام بعد الفاصلة هي البسط ${item.numerator}، فالكسر ${item.numerator}/1000.`])), '5/1000 = 0.005؛ 13/1000 = 0.013؛ 107/1000 = 0.107؛ 0.725 = 725/1000؛ 0.006 = 6/1000؛ 0.018 = 18/1000.'),
  exercise('l8-p76-between', 76, 'تدرّب · السؤال 3', 'أعطِ عدداً يقع بين 0.32 و0.33.', [b('l8-p76-check3', 'أ', 'اختر عدداً يقع بين 0.32 و0.33.', 'مثال: 0.325؛ وتُقبل جميع الأعداد التي تحقق 0.32 < العدد < 0.33.', ['نكتب الحدين بثلاث خانات: 0.320 و0.330.', 'نختار عدداً أكبر من 0.320 وأصغر من 0.330، مثل 0.325.', 'نتحقق: 0.320 < 0.325 < 0.330.'])], 'مثال 0.325؛ توجد إجابات أخرى صحيحة داخل الفترة المفتوحة.'),
  exercise('l8-p76-check4', 76, 'تدرّب · السؤال 4', 'ضع الرمز (< أو > أو =) في كل مربع لتحصل على مقارنة صحيحة.', p76Comparisons.map((item) => b(item.id, item.label, `قارن ${item.left} و${item.right}.`, `${item.left} ${item.relation} ${item.right}.`, [`نكتب الطرفين بالأجزاء من ألف: ${item.left} و${item.right}.`, `نقارن البسطين أو القيم المنزلية لتحديد الرمز ${item.relation}.`, `إذن ${item.left} ${item.relation} ${item.right}.`])), 'أ: >؛ ب: <؛ ج: >؛ د: =؛ هـ: =؛ و: >.'),
  exercise('l8-p76-match', 76, 'تدرّب · السؤال 5', 'صل العدد من العمود (أ) بالكسر المساوي له من العمود (ب).', p76Matches.map((item) => b(item.id, item.decimal, `اختر الكسر المساوي لـ ${item.decimal}.`, `${item.decimal} = ${item.fraction}.`, [`نكتب العدد العشري على صورة كسر مقامه 1000 أو مقام مناسب.`, `نختزل/نوسّع عند الحاجة: ${item.decimal} = ${item.fraction}.`, 'نطابق القيم المتساوية لا شكل الأرقام فقط.'])), '0.008 ↔ 8/1000؛ 0.04 ↔ 4/100؛ 0.004 ↔ 4/1000؛ 0.08 ↔ 8/100.'),
  exercise('l8-p76-intervals', 76, 'تدرّب · السؤال 6', 'ضع عدداً مناسباً من اختيارك في المربع ليحقق كل متباينة.', p76Intervals.map((item) => b(item.id, item.label, `ضع عدداً مناسباً بحيث ${item.expression}.`, `مثال: ${item.sample}.`, [`نحدد الحد الأصغر والحد الأكبر ونستبعد الطرفين لأن المتباينة صارمة.`, `نختار قيمة بينهما: ${item.sample}.`, `نتحقق بالتعويض: ${item.lower} < ${item.sample} < ${item.upper}.`])), 'أ: 0.156؛ ب: 0.35؛ ج: 0.1؛ د: 0.75؛ هـ: 0.55؛ و: 0.008 أمثلة صحيحة.'),
]

export const lesson8TextbookPageNumbers = [72, 73, 74, 75, 76] as const
export const lesson8BookTasks = lesson8SourceElements.filter((item) => item.kind === 'exercise')
export const lesson8SourceBranches = lesson8SourceElements.flatMap((item) => item.branches ?? [])
export const lesson8TeacherEntries: TeacherEntry[] = lesson8SourceElements.flatMap((item) => {
  const toEntry = (id: string, title: string, prompt: string, answer: string, reasoning: string[]): TeacherEntry => ({
    id: `t-${id}`, title, prompt, answer, source: { type: 'textbook', page: item.page }, reasoning: [
      `المعطيات: ${prompt}`,
      `المطلوب: تحديد الإجابة الصحيحة مع توضيح التمثيل الرياضي الملائم.`,
      `القاعدة المستعملة: ${reasoning[0] ?? item.reasoning[0]}`,
      `لماذا تنطبق هنا: لأن المقام 1000 يحدد أجزاء الألف، وتساوي المنازل يتيح المقارنة المباشرة.`,
      `الخطوة 1: ${reasoning[0] ?? item.reasoning[0]}`,
      ...reasoning.slice(1).map((step, index) => `الخطوة ${index + 2}: ${step}`),
      `الإجابة النهائية: ${answer}`,
      `التحقّق: ${answer.includes('<') || answer.includes('>') || answer.includes('=') ? 'نحوّل الطرفين إلى أجزاء من ألف ونتأكد من صحة العلاقة.' : 'نعيد التعويض أو التحويل إلى الكسر ذي المقام 1000 للتحقق.'}`,
    ],
    note: `القسم: ${item.section}. المصدر: الكتاب، ص ${item.page}. خطوات الحل والتفسير إضافات تعليمية من المنصة، وليست مطبوعة كحل في الكتاب.`,
  })
  if (!item.branches?.length) return [toEntry(item.id, item.section, item.prompt, item.answer, item.reasoning)]
  return item.branches.map((branch) => toEntry(branch.id, `${item.section} · ${branch.label}`, branch.prompt, branch.answer, branch.reasoning))
})

export const lesson8PlatformTeacherEntries: TeacherEntry[] = [
  { id: 't-l8-platform-visual', title: 'مكعب الألف التفاعلي · من إعداد المنصة', prompt: 'كيف يؤثر تغيير البسط في حجم الجزء الملوّن؟', answer: 'كل مكعب صغير يساوي 1/1000، ويتغير الجزء الملوّن بعدد الوحدات المختارة.', source: { type: 'platform' }, reasoning: ['نموذج 10 × 10 × 10 يضم 1000 وحدة متساوية.', 'نلوّن n وحدة، فيكون المقدار n/1000.', 'إذا لُوّنت الوحدات كلها فالقيمة 1000/1000 = 1.'] },
  { id: 't-l8-platform-summary', title: 'خلاصة الدرس · من إعداد المنصة', prompt: 'ما القواعد الثلاث التي تلخّص الدرس؟', answer: 'المقام 1000 ↔ ثلاث خانات؛ المقارنة بعد توحيد الخانات؛ وإيجاد عدد بين حدين يتطلب قيمة داخلية لا تساوي الطرفين.', source: { type: 'platform' }, reasoning: ['المقام 1000 يحدد أجزاء الألف ويظهر بثلاث خانات بعد الفاصلة.', 'عند مقارنة قيمتين نضيف أصفاراً يمين العدد الأقصر ثم نقارن.', 'في المتباينة الصارمة يجب أن يقع العدد بين الحدين، لا أن يساوي أحدهما.'] },
]

export function flattenLesson8CoverageIds(): string[] {
  return lesson8SourceElements.flatMap((item) => [item.id, ...(item.branches ?? []).map((branch) => branch.id)])
}
