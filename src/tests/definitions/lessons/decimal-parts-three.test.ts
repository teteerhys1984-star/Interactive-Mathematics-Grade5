import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

const testId = 'lesson-decimal-parts-three-test'
const lessonId = 'decimal-parts-three'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, value: string) => ({ id, label: rich(math(value)) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })

type DraftInput = { n: number; difficulty: 'basic' | 'medium' | 'advanced' | 'thinking'; prompt: ReturnType<typeof rich>; options: string[]; answer: number; idea: string; steps: string[]; source: string; concept: string; skill: string; originality: string; thinking?: string; error?: string }
function choice(item: DraftInput): QuestionDefinition {
  const prefix = `q${String(item.n).padStart(2, '0')}`
  return q(item.n, {
    type: 'single-choice', difficulty: item.difficulty, prompt: item.prompt,
    concepts: [item.concept], skills: [item.skill], sourceConcepts: [item.source],
    ...(item.thinking ? { coverage: { thinking: [item.thinking] } } : {}),
    ...(item.error ? { coverage: { thinking: item.thinking ? [item.thinking] : [], commonErrors: [item.error] } } : {}),
    options: item.options.map((value, index) => option(`${prefix}-${String.fromCharCode(97 + index)}`, value)),
    answer: `${prefix}-${String.fromCharCode(97 + item.answer)}`,
    solution: { idea: rich(text(item.idea)), steps: item.steps.map((step) => rich(text(step))), finalAnswer: rich(math(item.options[item.answer])), commonError: rich(text('قارن قيمة المنزلة والمقام، ولا تكتفِ بالنظر إلى شكل الأرقام.')) },
    originalityNote: item.originality,
  })
}

const questions: QuestionDefinition[] = [
  // Basic · 6
  choice({ n: 1, difficulty: 'basic', prompt: rich(text('ما الكتابة العشرية للكسر '), math('24/1000'), text('؟')), options: ['0.024', '0.24', '0.204', '2.4'], answer: 0, idea: 'المقام 1000 يعني ثلاث خانات بعد الفاصلة.', steps: ['نضع أرقام البسط 24 في ثلاث خانات بعد الفاصلة.', 'نضيف صفراً إلى يسار 24: 024.', 'إذن 24/1000 = 0.024.'], source: 'thousandths-place', concept: 'thousandths-as-parts', skill: 'write-thousandths-decimal', originality: 'عدد جديد من خانتين يختبر موضع الصفر قبل الأجزاء من ألف.' }),
  choice({ n: 2, difficulty: 'basic', prompt: rich(text('أي عدد عشري يمثّل سبعة أجزاء من ألف؟')), options: ['0.7', '0.007', '0.07', '0.700'], answer: 1, idea: 'الأجزاء من ألف تقع في المنزلة الثالثة بعد الفاصلة.', steps: ['نحتاج ثلاث خانات عشرية.', 'نكتب 7 في خانة الألف ونضع صفراً في خانتي الأعشار والمئة.', 'الكتابة الصحيحة 0.007.'], source: 'thousandths-place', concept: 'thousandths-as-parts', skill: 'identify-decimal-place', originality: 'تمييز منزلة الألف بخيارات تحوي أصفاراً مضللة.' }),
  choice({ n: 3, difficulty: 'basic', prompt: rich(text('ما الكسر الذي يساوي '), math('0.042'), text(' ومقامه 1000؟')), options: ['42/1000', '42/100', '420/1000', '4/1000'], answer: 0, idea: 'الأرقام الثلاثة بعد الفاصلة هي البسط عند المقام 1000.', steps: ['الخانات هي 0 أعشار و4 أجزاء من مئة و2 جزء من ألف.', 'البسط 042 أي 42، والمقام 1000.', 'إذن الكسر 42/1000.'], source: 'thousandths-place', concept: 'thousandths-as-parts', skill: 'convert-decimal-to-fraction', originality: 'تحويل عكسي بقيمة غير واردة في أمثلة الكتاب.' }),
  choice({ n: 4, difficulty: 'basic', prompt: rich(text('ماذا تساوي '), math('1000/1000'), text('؟')), options: ['0.1', '0.01', '1', '1000'], answer: 2, idea: 'أخذ الأجزاء الألف كلها يعني أخذ الواحد كاملاً.', steps: ['المقام 1000 يصف كل الأجزاء المتساوية.', 'البسط 1000 يعني أخذ كل جزء من هذه الأجزاء.', 'إذن 1000/1000 = 1.'], source: 'thousandths-place', concept: 'whole-from-thousandths', skill: 'recognize-one-whole', originality: 'سؤال مفاهيمي مستقل عن نماذج الصور المباشرة.' }),
  choice({ n: 5, difficulty: 'basic', prompt: rich(text('أي عبارة تقرأ العدد '), math('0.036'), text(' قراءة صحيحة؟')), options: ['ستة وثلاثون جزءاً من مئة', 'ستة وثلاثون جزءاً من ألف', 'ثلاثة أجزاء من ألف', 'ثلاثمئة وستة أجزاء من ألف'], answer: 1, idea: 'ثلاث خانات بعد الفاصلة تمثل أجزاء من ألف.', steps: ['الأرقام بعد الفاصلة 036؛ أي 36 جزءاً من ألف.', 'لا نحذف الصفر من منزلة الأعشار عند الكتابة، لكنه لا يغيّر قيمة البسط.', 'القراءة: ستة وثلاثون جزءاً من ألف.'], source: 'thousandths-place', concept: 'verbal-thousandths', skill: 'read-thousandths', originality: 'تدريب لفظي جديد على وجود صفر في بداية الجزء العشري.' }),
  choice({ n: 6, difficulty: 'basic', prompt: rich(text('في مكعب مقسّم إلى '), math('10 × 10 × 10'), text(' أجزاء متساوية، ما مقام كسر كل مكعب صغير؟')), options: ['10', '100', '1000', '10000'], answer: 2, idea: 'نحسب عدد الوحدات الصغيرة في الأبعاد الثلاثة.', steps: ['هناك عشرة أقسام في كل بعد.', '10 × 10 × 10 = 1000 مكعب صغير.', 'إذن مقام الجزء الواحد 1000.'], source: 'thousandths-place', concept: 'thousandths-as-parts', skill: 'count-equal-parts', originality: 'سياق هندسي يربط حاصل ضرب أبعاد المجسم بمقام الكسر.' }),

  // Medium · 7
  choice({ n: 7, difficulty: 'medium', prompt: rich(text('حوّل '), math('305/1000'), text(' إلى عدد عشري.')), options: ['0.305', '0.035', '0.350', '3.05'], answer: 0, idea: 'نكتب البسط في ثلاث خانات بعد الفاصلة.', steps: ['البسط 305 مكوّن من ثلاث خانات.', 'نضعه بعد الفاصلة مباشرة.', 'إذن 305/1000 = 0.305.'], source: 'thousandths-place', concept: 'thousandths-as-parts', skill: 'write-thousandths-decimal', originality: 'عدد يتضمن صفراً وسطياً لاختبار الحفاظ على ترتيب الخانات.' }),
  choice({ n: 8, difficulty: 'medium', prompt: rich(text('أي مقارنة صحيحة بين '), math('0.6'), text(' و'), math('0.599'), text('؟')), options: ['0.6 < 0.599', '0.6 = 0.599', '0.6 > 0.599', 'لا يمكن المقارنة'], answer: 2, idea: 'نكتب العددين بعدد الخانات نفسه.', steps: ['0.6 = 0.600.', 'نقارن 600 و599 من الأجزاء من ألف.', '600 > 599، إذن 0.6 > 0.599.'], source: 'thousandths-compare', concept: 'compare-thousandths', skill: 'compare-aligned-decimals', originality: 'مقارنة ذات أطوال مختلفة، مع قيمة قريبة جداً من الحد.' }),
  choice({ n: 9, difficulty: 'medium', prompt: rich(text('أي كسر يساوي '), math('0.08'), text(' بعد تحويله إلى مقام 1000؟')), options: ['8/1000', '80/1000', '800/1000', '80/100'], answer: 1, idea: 'نوسّع 8/100 إلى مقام 1000 بضرب البسط والمقام في 10.', steps: ['0.08 = 8/100.', 'نضرب البسط والمقام في 10 فنحصل على 80/1000.', 'إذن الكسر المطلوب 80/1000.'], source: 'thousandths-compare', concept: 'equivalent-thousandths', skill: 'scale-fraction-to-thousandths', originality: 'يختبر توسيع كسر من مئة إلى ألف مع المحافظة على القيمة.' }),
  choice({ n: 10, difficulty: 'medium', prompt: rich(text('ما الترتيب من الأصغر إلى الأكبر؟')), options: ['0.072، 0.207، 0.27', '0.207، 0.072، 0.27', '0.27، 0.207، 0.072', '0.072، 0.27، 0.207'], answer: 0, idea: 'نقارن الأعداد بعد توحيد الخانات إلى ثلاثة.', steps: ['0.072 يبقى 0.072.', '0.207 يبقى 0.207، و0.27 = 0.270.', '72 < 207 < 270؛ فالترتيب هو الخيار الأول.'], source: 'thousandths-compare', concept: 'compare-thousandths', skill: 'order-decimal-values', originality: 'ترتيب ثلاثة أعداد مع تباين الخانات العشرية.' }),
  choice({ n: 11, difficulty: 'medium', prompt: rich(text('على خط يبدأ عند '), math('0.314'), text('، ما العدد عند العلامة التالية إذا كانت كل خطوة '), math('0.001'), text('؟')), options: ['0.315', '0.324', '0.304', '0.3141'], answer: 0, idea: 'العلامة التالية تزيد جزءاً واحداً من ألف.', steps: ['نضيف 0.001 إلى 0.314.', 'في منزلة الألف: 314 + 1 = 315.', 'القيمة التالية 0.315.'], source: 'thousandths-compare', concept: 'numberline-thousandths', skill: 'read-number-line', originality: 'سياق تدريجة جديد يطبق قيمة الزيادة على خط الأعداد.' }),
  choice({ n: 12, difficulty: 'medium', prompt: rich(text('اختر عدداً يقع بين '), math('0.24'), text(' و'), math('0.25'), text(' دون أن يساوي الطرفين.')), options: ['0.239', '0.245', '0.250', '0.254'], answer: 1, idea: 'المطلوب قيمة داخل الفترة المفتوحة.', steps: ['نكتب الطرفين بثلاث خانات: 0.240 و0.250.', '0.245 أكبر من 0.240 وأصغر من 0.250.', 'إذن 0.245 يقع بينهما.'], source: 'thousandths-between', concept: 'open-interval-thousandths', skill: 'choose-interior-value', originality: 'مجال جديد وخيارات تشمل الطرفين والقيم المجاورة خارج المجال.' }),
  choice({ n: 13, difficulty: 'medium', prompt: rich(text('أي كسر يساوي '), math('0.125'), text('؟')), options: ['125/1000', '125/100', '12/1000', '25/1000'], answer: 0, idea: 'ثلاث خانات بعد الفاصلة تعني أن البسط فوق 1000.', steps: ['تتكون الخانات من 1 و2 و5.', 'البسط 125 والمقام 1000.', 'إذن 0.125 = 125/1000.'], source: 'thousandths-place', concept: 'thousandths-as-parts', skill: 'convert-decimal-to-fraction', originality: 'تحويل جديد يجمع أرقاماً غير متكررة دون صفر.' }),

  // Advanced · 4
  choice({ n: 14, difficulty: 'advanced', prompt: rich(text('ما العلاقة الصحيحة بين '), math('0.507'), text(' و'), math('0.57'), text('؟')), options: ['0.507 > 0.57', '0.507 < 0.57', '0.507 = 0.57', 'لا يمكن المقارنة'], answer: 1, idea: 'نكمّل العدد ذي المنزلتين بصفر على اليمين.', steps: ['0.57 = 0.570.', 'نقارن 507 و570 من الأجزاء من ألف.', '507 < 570، إذن 0.507 < 0.57.'], source: 'thousandths-compare', concept: 'compare-thousandths', skill: 'compare-aligned-decimals', originality: 'مقارنة مع صفر داخلي تميز منزلة الأعشار عن الألف.' }),
  choice({ n: 15, difficulty: 'advanced', prompt: rich(text('ما الكسر ذو المقام 1000 المساوي لـ '), math('0.045'), text('؟')), options: ['45/1000', '45/100', '450/1000', '5/1000'], answer: 0, idea: 'الخانات الثلاث كلها تشكّل البسط على مقام 1000.', steps: ['نقرأ 0.045 بعدد 45 جزءاً من ألف.', 'المقام 1000، والبسط 45.', 'إذن 0.045 = 45/1000.'], source: 'thousandths-place', concept: 'equivalent-thousandths', skill: 'convert-decimal-to-fraction', originality: 'عدد بصفر في الأعشار يختبر اختيار البسط الصحيح بدقة.' }),
  choice({ n: 16, difficulty: 'advanced', prompt: rich(text('كم عدداً مكتوباً بثلاث خانات عشرية يقع بين '), math('0.420'), text(' و'), math('0.424'), text('؟')), options: ['2', '3', '4', '5'], answer: 1, idea: 'نعدّ الأعداد ذات الألف الواقعة بين الطرفين مع استبعاد الحدين.', steps: ['الأعداد هي 0.421 و0.422 و0.423.', 'لا نعدّ 0.420 ولا 0.424 لأن المطلوب بينهما.', 'إذن عدد القيم 3.'], source: 'thousandths-between', concept: 'open-interval-thousandths', skill: 'count-interior-values', originality: 'مسألة عدّ في مجال مفتوح تضيف استبعاد الطرفين صراحةً.' }),
  choice({ n: 17, difficulty: 'advanced', prompt: rich(text('أي عدد يساوي '), math('9/100'), text(' عند كتابته على مقام 1000؟')), options: ['9/1000', '90/1000', '900/1000', '90/100'], answer: 1, idea: 'للوصول من 100 إلى 1000 نضرب المقام في 10 ونفعل الشيء نفسه للبسط.', steps: ['100 × 10 = 1000.', 'نضرب البسط 9 في 10 فنحصل على 90.', 'إذن 9/100 = 90/1000.'], source: 'thousandths-compare', concept: 'equivalent-thousandths', skill: 'scale-fraction-to-thousandths', originality: 'تحويل مكافئ يختبر ضرب البسط والمقام بالعامل نفسه.' }),

  // Thinking · 3
  choice({ n: 18, difficulty: 'thinking', prompt: rich(text('لماذا '), math('0.4 = 0.400'), text('؟ اختر التفسير الأدق.')), options: ['لأن الصفرين في النهاية لا يغيّران القيمة؛ كلاهما 400/1000', 'لأن 0.400 أكبر بثلاث مرات', 'لأن الفاصلة تتحرك إلى اليسار', 'لأن 0.4 يساوي 4/1000'], answer: 0, idea: 'الأصفار المضافة إلى يمين الجزء العشري لا تغيّر قيمته.', steps: ['0.4 = 4/10.', 'نوسّع الكسر: 4/10 = 400/1000.', 'إذن 0.4 و0.400 تمثيلان للقيمة نفسها.'], source: 'thousandths-compare', concept: 'decimal-equivalence-reasoning', skill: 'justify-trailing-zero', originality: 'يتطلب تعليل التكافؤ بين عدد من منزلة واحدة وثلاث خانات.' , thinking: 'explain-equivalent-decimals' }),
  choice({ n: 19, difficulty: 'thinking', prompt: rich(text('قالت ليلى: «'), math('0.099 > 0.1'), text(' لأن 99 أكبر من 1». ما التصحيح الصحيح؟')), options: ['0.099 = 0.1', '0.099 < 0.100 = 0.1', '0.099 > 0.100', 'لا توجد علاقة'], answer: 1, idea: 'يجب مقارنة المنازل نفسها لا الأرقام بوصفها أعداداً صحيحة.', steps: ['نكتب 0.1 بثلاث خانات: 0.100.', 'نقارن 0.099 و0.100: 99 جزءاً من ألف أقل من 100 جزء من ألف.', 'إذن 0.099 < 0.1.'], source: 'thousandths-compare', concept: 'compare-thousandths', skill: 'diagnose-place-value-error', originality: 'تحليل خطأ شائع في مقارنة أجزاء الألف بالأعشار.' , thinking: 'diagnose-comparison' }),
  choice({ n: 20, difficulty: 'thinking', prompt: rich(text('أي قيمة تحقق المتباينة الصارمة '), math('0.075 < x < 0.080'), text('؟')), options: ['0.075', '0.080', '0.078', '0.081'], answer: 2, idea: 'يجب أن تكون القيمة أكبر من الحد الأول وأصغر من الحد الثاني.', steps: ['0.078 أكبر من 0.075.', '0.078 أصغر من 0.080.', 'إذن 0.078 يحقق المتباينة، والطرفان مستبعدان.'], source: 'thousandths-between', concept: 'open-interval-thousandths', skill: 'test-strict-inequality', originality: 'اختيار قيمة من مجال مغلق بالمقارنة الصارمة مع استبعاد الطرفين.', thinking: 'exclude-interval-boundaries', error: 'include-range-boundary' }),
]

const sourceConcepts = [
  { id: 'thousandths-place', label: 'كتابة الأجزاء من ألف وتمثيلها وقراءتها', pages: [72, 73] },
  { id: 'thousandths-compare', label: 'مقارنة الأجزاء من ألف والعلاقة بين المنازل وخط الأعداد', pages: [74, 75, 76] },
  { id: 'thousandths-between', label: 'اختيار قيمة داخل مجال عشري مفتوح', pages: [75, 76] },
]
const conceptLabels = {
  'thousandths-as-parts': 'الأجزاء من ألف بوصفها أجزاء من كل',
  'whole-from-thousandths': 'الألف من الألف يساوي واحداً كاملاً',
  'verbal-thousandths': 'قراءة العدد العشري لفظياً',
  'identify-decimal-place': 'تمييز منزلة الرقم بعد الفاصلة',
  'convert-decimal-to-fraction': 'التحويل من عدد عشري إلى كسر مقامه 1000',
  'compare-thousandths': 'مقارنة الأعداد العشرية بعد توحيد الخانات',
  'equivalent-thousandths': 'الكسور المتكافئة ذات المقام 1000',
  'numberline-thousandths': 'قراءة تدريجات خط الأعداد من أجزاء الألف',
  'open-interval-thousandths': 'تحديد القيم داخل مجال مفتوح',
  'decimal-equivalence-reasoning': 'تفسير تكافؤ الكتابات العشرية',
}
const skillLabels = {
  'write-thousandths-decimal': 'كتابة كسر مقامه 1000 كتابة عشرية',
  'identify-decimal-place': 'تحديد المنزلة العشرية المناسبة',
  'convert-decimal-to-fraction': 'تحويل العدد العشري إلى كسر',
  'recognize-one-whole': 'تمييز الواحد الكامل من الأجزاء كلها',
  'read-thousandths': 'التعبير عن أجزاء الألف لفظياً',
  'count-equal-parts': 'حساب عدد الأجزاء المتساوية في مجسم',
  'compare-aligned-decimals': 'مقارنة القيم بعد محاذاة الخانات',
  'scale-fraction-to-thousandths': 'توسيع كسر إلى مقام 1000',
  'order-decimal-values': 'ترتيب الأعداد العشرية',
  'read-number-line': 'قراءة القيمة على خط الأعداد',
  'choose-interior-value': 'اختيار قيمة داخل فترة مفتوحة',
  'count-interior-values': 'عدّ القيم الداخلية بين حدين',
  'justify-trailing-zero': 'تبرير أثر الأصفار النهائية',
  'diagnose-place-value-error': 'تشخيص خطأ في مقارنة المنازل',
  'test-strict-inequality': 'اختبار متباينة صارمة',
}
const thinkingLabels = {
  'explain-equivalent-decimals': 'تفسير تساوي كتابتين عشريتين مختلفتي الطول',
  'diagnose-comparison': 'تشخيص مقارنة خاطئة لقيم المنازل',
  'exclude-interval-boundaries': 'استبعاد طرفي المجال المفتوح',
}
const commonErrorLabels = { 'include-range-boundary': 'إدخال أحد الطرفين في المجال المفتوح' }

export default defineLessonTest({
  id: testId, lessonId, title: 'اختبار الدرس · الأجزاء العشرية (3)',
  description: rich(text('اختبار مستقل على أجزاء الألف والكتابة العشرية والمقارنة وخط الأعداد.')),
  instructions: rich(text('أجب عن الأسئلة العشرين. سؤال الاختبار منفصل عن أسئلة الكتاب، وتبقى الحلول مخفية حتى تسليم المحاولة.')),
  questions, sourceConcepts, conceptLabels, skillLabels, thinkingLabels, commonErrorLabels,
})
