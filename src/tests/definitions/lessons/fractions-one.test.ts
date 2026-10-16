import { defineLessonTest, lessonQuestion, ltr, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/** Lesson 4, Unit 2: 20 independent questions, solutions are stored by the test system and stay locked until submission. */
const testId = 'lesson-fractions-one-test'
const lessonId = 'fractions-one'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })

const conceptLabels: Record<string, string> = {
  'fraction-model': 'قراءة نموذج الأجزاء المتساوية',
  'equivalence': 'الكسور المتكافئة',
  'same-denominator': 'مقارنة كسور متساوية المقام',
  'common-denominator': 'توحيد المقامات والمقارنة',
  'fraction-ordering': 'ترتيب الكسور',
  'fraction-context': 'تفسير الكسر في موقف حياتي',
  'fraction-half': 'مقارنة الكسر بالنصف',
}
const skillLabels: Record<string, string> = {
  'read-model': 'تحديد البسط والمقام من نموذج',
  'generate-equivalent': 'تكوين كسر مكافئ',
  'compare-same': 'المقارنة عند تساوي المقامات',
  'compare-common': 'المقارنة بعد توحيد المقامات',
  'order-fractions': 'ترتيب مجموعة كسور',
  'match-equivalents': 'مطابقة صور الكسور المتكافئة',
  'interpret-ratio': 'تفسير النسبة في سياق',
  'diagnose-error': 'تشخيص خطوة غير صحيحة',
  'justify-comparison': 'تبرير المقارنة بالحساب',
  'compare-half': 'التمييز بين كسور أكبر أو أصغر من النصف',
}
const applicationLabels: Record<string, string> = {
  'ribbon-length': 'مقارنة طولين ممثلين بكسرين',
  'sports-accuracy': 'مقارنة نسب نجاح فريقين',
}
const thinkingLabels: Record<string, string> = {
  'justify': 'اختيار تبرير رياضي صالح',
  'diagnose': 'تحليل خطأ في تكوين كسر مكافئ',
  'benchmark-half': 'استخدام النصف مرجعاً للمقارنة',
}
const commonErrorLabels: Record<string, string> = {
  'compare-denominators': 'مقارنة المقامين وحدهما',
  'change-one-part': 'تغيير البسط أو المقام منفرداً',
  'reverse-relation': 'قلب رمز المقارنة',
  'reverse-order': 'الخلط بين التصاعدي والتنازلي',
  'compare-count-not-rate': 'مقارنة الأعداد دون مراعاة الكل',
}

const questions: QuestionDefinition[] = [
  // ─────────────── BASIC · 6 ───────────────
  q(1, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('قُسّم شريط إلى 11 جزءاً متساوياً، وظُلّل منها 4 أجزاء. ما الكسر الذي يمثّل الجزء المظلّل؟')),
    concepts: ['fraction-model'], skills: ['read-model'], sourceConcepts: ['models'],
    options: [option('q01-a', math('4/11')), option('q01-b', math('11/4')), option('q01-c', math('4/7')), option('q01-d', math('7/11'))],
    answer: 'q01-a',
    solution: { idea: rich(text('البسط يعدّ الأجزاء المظللة، والمقام يعدّ الأجزاء المتساوية كلها.')), rule: rich(text('الكسر الممثل للجزء المحدد = عدد الأجزاء المحددة على عدد الأجزاء الكلي.')), steps: [rich(text('عدد الأجزاء المتساوية كلها 11.')), rich(text('عدد الأجزاء المظللة 4.')), rich(text('نكتب المظلّل في البسط والكلي في المقام.'))], finalAnswer: rich(math('4/11')), commonError: rich(text('عكس البسط والمقام أو طرح 4 من 11 ثم كتابة 4/7.')) },
    originalityNote: 'نموذج شريطي جديد من 11 جزءاً وأربعة أجزاء مظللة؛ لا ينسخ دوائر الأشكال المطبوعة.',
  }),
  q(2, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('أكمل البسط لتحصل على كسر مكافئ: '), math('3/8 = □/40'), text('.')),
    concepts: ['equivalence'], skills: ['generate-equivalent'], sourceConcepts: ['equivalence-source'],
    answer: { expected: '15', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('المقام 8 ضُرب في 5 ليصبح 40.')), rule: rich(text('نضرب البسط والمقام بالعامل نفسه.')), steps: [rich(math('40 ÷ 8 = 5')), rich(math('3 × 5 = 15')), rich(text('إذن البسط الناقص 15.'))], finalAnswer: rich(math('3/8 = 15/40')), commonError: rich(text('كتابة 3/40 بتغيير المقام وحده.')) },
    originalityNote: 'المقام 40 والبسط 3 يختلفان عن جميع قيم تمرين تكوين الكسور المكافئة في الكتاب.',
  }),
  q(3, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('العبارة صحيحة: '), math('7/19 < 12/19'), text(' لأن المقامين متساويان ونقارن البسطين.')),
    concepts: ['same-denominator'], skills: ['compare-same'], sourceConcepts: ['same-denominator-source'],
    answer: true,
    solution: { idea: rich(text('الكسران لهما المقام نفسه، فالأجزاء متساوية الحجم.')), rule: rich(text('عند تساوي المقامين، الكسر ذو البسط الأكبر هو الأكبر.')), steps: [rich(text('المقامات كلاهما 19.')), rich(math('7 < 12')), rich(text('لذلك العبارة صحيحة.'))], finalAnswer: rich(text('صحيحة: '), math('7/19 < 12/19'), text('.')), commonError: rich(text('الخلط بين ترتيب رمز < واتجاه النظر إلى الكسر الأكبر.')) },
    originalityNote: 'اختبار مباشر للقاعدة باستخدام مقام 19 وبسطين جديدين غير واردين في تمارين المصدر.',
  }),
  q(4, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أي مساواة تبيّن كسرين متكافئين؟')),
    concepts: ['equivalence'], skills: ['generate-equivalent'], sourceConcepts: ['equivalence-source'],
    options: [option('q04-a', math('8/13 = 16/26')), option('q04-b', math('8/13 = 8/26')), option('q04-c', math('8/13 = 16/13')), option('q04-d', math('8/13 = 13/8'))],
    answer: 'q04-a',
    solution: { idea: rich(text('نختبر هل ضُرب البسط والمقام بالعامل نفسه.')), rule: rich(text('ضرب البسط والمقام في العدد نفسه غير الصفري يحافظ على قيمة الكسر.')), steps: [rich(text('في الخيار الأول ضُرب 8 و13 في 2.')), rich(math('8/13 = 16/26')), rich(text('أما الخيارات الأخرى فتغيّر فيها جزء واحد أو انقلب الكسر.'))], finalAnswer: rich(math('8/13 = 16/26')), commonError: rich(text('اعتبار أن أي تغيير في أرقام الكسر ينتج كسراً مكافئاً.')) },
    originalityNote: 'اختيار متعدد بقيم 8 و13 و26، غير مستعمل في أمثلة التكافؤ المطبوعة.',
  }),
  q(5, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('اختر رمز المقارنة الصحيح: '), math('8/17 □ 11/17'), text('.')),
    concepts: ['same-denominator'], skills: ['compare-same'], sourceConcepts: ['same-denominator-source'],
    options: [option('q05-a', math('<')), option('q05-b', math('>')), option('q05-c', math('=')), optionText('q05-d', 'لا يمكن المقارنة')],
    answer: 'q05-a',
    solution: { idea: rich(text('المقامات متساوية، لذا تكفي مقارنة البسطين.')), steps: [rich(math('8 < 11')), rich(text('الكسر الأول يحوي أجزاء أقل من أجزاء الكسر الثاني.'))], finalAnswer: rich(math('8/17 < 11/17')), commonError: rich(text('إهمال تساوي المقامين واختيار «لا يمكن المقارنة».')) },
    originalityNote: 'زوج مقارنة جديد بالمقام 17، وليس أحد الأزواج الأربعة في تدريب الصفحة 54.',
  }),
  q(6, {
    type: 'ordering', difficulty: 'basic',
    prompt: rich(text('رتّب الكسور من الأصغر إلى الأكبر: جميعها مقسّمة إلى أجزاء متساوية الحجم.')),
    concepts: ['fraction-ordering', 'same-denominator'], skills: ['order-fractions'], sourceConcepts: ['ordering-source'],
    items: [option('q06-a', math('6/13')), option('q06-b', math('2/13')), option('q06-c', math('9/13'))],
    answer: ['q06-b', 'q06-a', 'q06-c'],
    solution: { idea: rich(text('لأن المقامات متساوية، نرتب البسوط تصاعدياً.')), steps: [rich(math('2 < 6 < 9')), rich(text('نكتب الكسور الأصلية بالترتيب المقابل.'))], finalAnswer: rich(math('2/13 < 6/13 < 9/13')), commonError: rich(text('ترتيب البسط والمقام كلٍّ على حدة بدلاً من مقارنة قيم الكسور.')) },
    originalityNote: 'مجموعة ترتيب قصيرة جديدة كلها من ثلاثة عشر جزءاً، وليست قائمة ترتيب مطبوعة.',
  }),

  // ─────────────── MEDIUM · 7 ───────────────
  q(7, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('ما العلاقة الصحيحة بين '), math('7/12'), text(' و'), math('5/8'), text('؟')),
    concepts: ['common-denominator'], skills: ['compare-common'], sourceConcepts: ['common-denominator-source'],
    options: [option('q07-a', math('7/12 > 5/8')), option('q07-b', math('7/12 < 5/8')), option('q07-c', math('7/12 = 5/8')), optionText('q07-d', 'المقامات المختلفة تمنع المقارنة')],
    answer: 'q07-b',
    solution: { idea: rich(text('نوحّد المقامين إلى 24 قبل المقارنة.')), rule: rich(text('بعد كتابة كسرين مكافئين بالمقام نفسه نقارن البسطين.')), steps: [rich(math('7/12 = 14/24')), rich(math('5/8 = 15/24')), rich(math('14 < 15'))], finalAnswer: rich(math('7/12 < 5/8')), commonError: rich(text('القول إن 7/12 أكبر لأن بسطه أكبر من بسط 5/8 دون توحيد المقام.')) },
    originalityNote: 'زوج جديد 7/12 و5/8؛ يختبر توحيد المقامات في مقام مشترك غير قائمة التمارين.',
  }),
  q(8, {
    type: 'fraction', difficulty: 'medium',
    prompt: rich(text('اكتب كسراً مكافئاً لـ'), math('4/9'), text(' مقامه 63.')),
    concepts: ['equivalence'], skills: ['generate-equivalent'], sourceConcepts: ['equivalence-source'],
    answer: { numerator: '28', denominator: '63', equivalentForms: 'accept' },
    solution: { idea: rich(text('المقام 9 ضُرب في 7 ليصبح 63.')), rule: rich(text('نستعمل العامل نفسه في البسط والمقام.')), steps: [rich(math('63 ÷ 9 = 7')), rich(math('4 × 7 = 28')), rich(text('نكتب البسط الجديد فوق المقام 63.'))], finalAnswer: rich(math('4/9 = 28/63')), commonError: rich(text('إضافة 54 إلى البسط بدلاً من تكبيره بالعامل 7.')) },
    originalityNote: 'قيمة 4/9 ومقام 63 لم ترد في سؤال التكافؤ المطبوع؛ الحل يقبل كل صيغة مكافئة صحيحة.',
  }),
  q(9, {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابق كل كسر مع صورة مكافئة له.')),
    concepts: ['equivalence'], skills: ['match-equivalents'], sourceConcepts: ['equivalence-source'],
    left: [option('q09-l1', math('2/7')), option('q09-l2', math('5/12')), option('q09-l3', math('3/8'))],
    right: [option('q09-r1', math('15/36')), option('q09-r2', math('12/32')), option('q09-r3', math('10/35'))],
    answer: [{ leftId: 'q09-l1', rightId: 'q09-r3' }, { leftId: 'q09-l2', rightId: 'q09-r1' }, { leftId: 'q09-l3', rightId: 'q09-r2' }],
    solution: { idea: rich(text('يمكن تبسيط الكسر في الطرف المقابل أو توسيع الطرف الأيسر.')), steps: [rich(math('2/7 = 10/35')), rich(math('5/12 = 15/36')), rich(math('3/8 = 12/32'))], finalAnswer: rich(text('الأزواج: 2/7 مع 10/35، و5/12 مع 15/36، و3/8 مع 12/32.')), commonError: rich(text('مطابقة الكسور لمجرد تشابه أحد الأعداد دون اختبار النسبة.')) },
    originalityNote: 'نشاط مطابقة جديد بثلاث قيم أساس وصور موسعة لا تظهر في فروع الكتاب.',
  }),
  q(10, {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب الكسور الآتية تصاعدياً بعد توحيد المقامات.')),
    concepts: ['fraction-ordering', 'common-denominator'], skills: ['order-fractions', 'compare-common'], sourceConcepts: ['ordering-source'],
    items: [option('q10-a', math('3/14')), option('q10-b', math('5/7')), option('q10-c', math('2/5')), option('q10-d', math('7/10'))],
    answer: ['q10-a', 'q10-c', 'q10-d', 'q10-b'],
    solution: { idea: rich(text('المقام المشترك الأصغر للمقامات 14 و7 و5 و10 هو 70.')), steps: [rich(math('3/14 = 15/70')), rich(math('2/5 = 28/70')), rich(math('7/10 = 49/70')), rich(math('5/7 = 50/70'))], finalAnswer: rich(math('3/14 < 2/5 < 7/10 < 5/7')), commonError: rich(text('الخلط بين 7/10 و5/7؛ فهما متقاربان لكن 49/70 < 50/70.')) },
    originalityNote: 'قائمة جديدة من أربعة كسور، بمقامات 14 و7 و5 و10، وتحتاج مقاما مشتركاً مختلفاً عن أمثلة المصدر.',
  }),
  q(11, {
    type: 'true-false', difficulty: 'medium',
    prompt: rich(text('هل العبارة صحيحة؟ '), math('9/16 > 5/8'), text('.')),
    concepts: ['common-denominator'], skills: ['compare-common'], sourceConcepts: ['common-denominator-source'],
    coverage: { commonErrors: ['reverse-relation'] }, answer: false,
    solution: { idea: rich(text('نحوّل الكسرين إلى مقام 16.')), steps: [rich(math('5/8 = 10/16')), rich(math('9/16 < 10/16'))], finalAnswer: rich(text('العبارة غير صحيحة؛ الصحيح '), math('9/16 < 5/8'), text('.')), commonError: rich(text('نسيان مضاعفة بسط 5/8 عند مضاعفة مقامه.')) },
    originalityNote: 'عبارة تحقق جديدة تستخدم المقامين 16 و8 وتستهدف قلب إشارة العلاقة بعد التحويل.',
  }),
  q(12, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('لدى ريم شريطان من الطول نفسه. استعملت من الشريط الأول '), math('5/9'), text('، ومن الثاني '), math('7/12'), text('. أي الشريطين استُعمل منه طول أكبر؟')),
    concepts: ['fraction-context', 'common-denominator'], skills: ['compare-common', 'interpret-ratio'], sourceConcepts: ['applications-source'],
    coverage: { applications: ['ribbon-length'] },
    options: [optionText('q12-a', 'الأول'), optionText('q12-b', 'الثاني'), optionText('q12-c', 'استُعمل الطول نفسه'), optionText('q12-d', 'لا تكفي المعطيات')],
    answer: 'q12-b',
    solution: { idea: rich(text('الطول الأكبر يقابله كسر أكبر من الشريطين المتساويين.')), rule: rich(text('نحوّل إلى مقام مشترك ثم نقارن البسطين.')), steps: [rich(math('5/9 = 20/36')), rich(math('7/12 = 21/36')), rich(text('21 جزءاً من 36 أكبر من 20 جزءاً.'))], finalAnswer: rich(text('الشريط الثاني؛ استُعمل منه طول أكبر.')), commonError: rich(text('اختيار الأول بسبب كبر البسط 5 مقارنةً بمقامه 9 دون تحويل الكسر الآخر.')) },
    originalityNote: 'سياق شريطين جديد بقيم 5/9 و7/12، مختلف عن مسائل المسافة والمسابقات المطبوعة.',
  }),
  q(13, {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر جميع الكسور المكافئة لـ'), math('4/15'), text('.')),
    concepts: ['equivalence'], skills: ['generate-equivalent'], sourceConcepts: ['equivalence-source'],
    options: [option('q13-a', math('8/30')), option('q13-b', math('12/45')), option('q13-c', math('16/60')), option('q13-d', math('4/30')), option('q13-e', math('8/45'))],
    answer: ['q13-a', 'q13-b', 'q13-c'],
    solution: { idea: rich(text('نبحث عن اختيارات تضرب البسط والمقام بالعامل نفسه.')), steps: [rich(math('4/15 × 2/2 = 8/30')), rich(math('4/15 × 3/3 = 12/45')), rich(math('4/15 × 4/4 = 16/60')), rich(text('في 4/30 و8/45 لم يتغير البسط والمقام بالعامل نفسه.'))], finalAnswer: rich(text('الاختيارات الصحيحة: 8/30 و12/45 و16/60.')), commonError: rich(text('اختيار كسر يشارك 4/15 في بسط أو مقام واحد فقط.')) },
    originalityNote: 'مجموعة خيارات متعددة جديدة حول 4/15، ولا تستخدم أي مربع أو مثال من الصفحة 54.',
  }),

  // ─────────────── ADVANCED · 4 ───────────────
  q(14, {
    type: 'single-choice', difficulty: 'advanced',
    prompt: rich(text('أي مقارنة صحيحة للكسرين المتقاربين '), math('13/24'), text(' و'), math('7/13'), text('؟')),
    concepts: ['common-denominator'], skills: ['compare-common'], sourceConcepts: ['common-denominator-source'],
    coverage: { commonErrors: ['compare-denominators'] },
    options: [option('q14-a', math('13/24 > 7/13')), option('q14-b', math('13/24 < 7/13')), option('q14-c', math('13/24 = 7/13')), optionText('q14-d', 'لا يمكن المقارنة')],
    answer: 'q14-a',
    solution: { idea: rich(text('المقام المشترك 312 يجعل الفرق الصغير واضحاً.')), rule: rich(text('نكتب كسرين مكافئين ثم نقارن البسطين بدقة.')), steps: [rich(math('13/24 = 169/312')), rich(math('7/13 = 168/312')), rich(math('169 > 168'))], finalAnswer: rich(math('13/24 > 7/13')), commonError: rich(text('الحكم من المقامين أو تقريب الكسور ذهنياً؛ الفرق بينهما صغير ويحتاج مقارنة دقيقة.')) },
    originalityNote: 'زوج جديد متقارب القيمة صُمم ليمنع التخمين بالتقريب ويختبر اختيار المقام 312.',
  }),
  q(15, {
    type: 'ordering', difficulty: 'advanced',
    prompt: rich(text('رتّب الكسور الخمسة من الأصغر إلى الأكبر.')),
    concepts: ['fraction-ordering', 'common-denominator'], skills: ['order-fractions', 'compare-common'], sourceConcepts: ['ordering-source'],
    items: [option('q15-a', math('5/6')), option('q15-b', math('2/9')), option('q15-c', math('3/4')), option('q15-d', math('5/12')), option('q15-e', math('7/18'))],
    answer: ['q15-b', 'q15-e', 'q15-d', 'q15-c', 'q15-a'],
    solution: { idea: rich(text('المقام المشترك الأصغر للمقامات 6 و9 و4 و12 و18 هو 36.')), steps: [rich(math('2/9 = 8/36')), rich(math('7/18 = 14/36')), rich(math('5/12 = 15/36')), rich(math('3/4 = 27/36')), rich(math('5/6 = 30/36'))], finalAnswer: rich(math('2/9 < 7/18 < 5/12 < 3/4 < 5/6')), commonError: rich(text('ترتيب بعض الكسور المتقاربة قبل تحويل المجموعة كلها إلى وحدات مشتركة.')) },
    originalityNote: 'ترتيب متقدم لخمس كسور جديدة يجمع مقامات متعددة، ولا يعيد قائمة الكتاب ذات المقام 24 أو 12.',
  }),
  q(16, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('أكمل البسط في المساواة: '), math('7/20 = □/100'), text('.')),
    concepts: ['equivalence'], skills: ['generate-equivalent'], sourceConcepts: ['equivalence-source'],
    answer: { expected: '35', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('المقام 20 ضُرب في 5 ليصبح 100.')), rule: rich(text('نضرب البسط والمقام بالعامل نفسه.')), steps: [rich(math('100 ÷ 20 = 5')), rich(math('7 × 5 = 35')), rich(text('نحافظ على قيمة الكسر بتطبيق العامل نفسه على البسط.'))], finalAnswer: rich(math('7/20 = 35/100')), commonError: rich(text('إلحاق صفر بالبسط من دون تبرير العامل أو تحويل المقام بطريقة مختلفة.')) },
    originalityNote: 'تحويل عددي جديد من مقام 20 إلى 100 لا يكرر أياً من مساويات التمرين المطبوع.',
  }),
  q(17, {
    type: 'single-choice', difficulty: 'advanced',
    prompt: rich(text('في يوم رياضي، سجّل الفريق الأخضر 17 إصابة من 24 محاولة، وسجّل الفريق البرتقالي 8 إصابات من 11 محاولة. أيهما حقق نسبة إصابة أكبر؟')),
    concepts: ['fraction-context', 'common-denominator'], skills: ['interpret-ratio', 'compare-common'], sourceConcepts: ['applications-source'],
    coverage: { applications: ['sports-accuracy'], commonErrors: ['compare-count-not-rate'] },
    options: [optionText('q17-a', 'الفريق الأخضر'), optionText('q17-b', 'الفريق البرتقالي'), optionText('q17-c', 'النسبتان متساويتان'), optionText('q17-d', 'لا يمكن المقارنة لاختلاف عدد المحاولات')],
    answer: 'q17-b',
    solution: { idea: rich(text('نقارن نسبة الإصابات من إجمالي المحاولات، لا عدد الإصابات وحده.')), rule: rich(text('المقام المشترك الأصغر لـ24 و11 هو 264.')), steps: [rich(math('17/24 = 187/264')), rich(math('8/11 = 192/264')), rich(math('192 > 187'))], finalAnswer: rich(text('الفريق البرتقالي حقق النسبة الأكبر.')), commonError: rich(text('مقارنة 17 و8 فقط وإهمال اختلاف عدد المحاولات الكلي.')) },
    originalityNote: 'مسألة رياضية بسياق تسجيل محاولات جديد وبقيم لم ترد في أمثلة المدرسة أو تدريبات الكتاب.',
  }),

  // ─────────────── THINKING · 3 ───────────────
  q(18, {
    type: 'single-choice', difficulty: 'thinking',
    prompt: rich(text('أراد تلميذ تبرير أي الكسرين أكبر: '), math('11/20'), text(' أم '), math('4/7'), text('. أي تبرير كامل وصحيح؟')),
    concepts: ['common-denominator'], skills: ['justify-comparison'], sourceConcepts: ['common-denominator-source'],
    coverage: { thinking: ['justify'] },
    options: [
      option('q18-a', math('11/20 = 77/140 ، 4/7 = 80/140'), text('؛ إذن 4/7 أكبر.')),
      option('q18-b', text('20 أكبر من 7، إذن '), math('11/20'), text(' أكبر.')),
      option('q18-c', text('11 أكبر من 4، إذن '), math('11/20'), text(' أكبر.')),
      option('q18-d', text('المقامات مختلفة؛ لا توجد طريقة للمقارنة.')),
    ],
    answer: 'q18-a',
    solution: { idea: rich(text('التبرير السليم يبيّن التكافؤ والمقام المشترك ثم يستنتج العلاقة.')), rule: rich(text('المضاعف المشترك الأصغر لـ20 و7 هو 140.')), steps: [rich(math('11/20 = 77/140')), rich(math('4/7 = 80/140')), rich(text('بما أن 80 > 77، فإن 4/7 هو الأكبر.'))], finalAnswer: rich(text('التبرير الأول صحيح؛ '), math('4/7 > 11/20'), text('.')), commonError: rich(text('التعليل بالمقام أو البسط الأصلي وحده لا يثبت المقارنة عند اختلاف المقامين.')) },
    originalityNote: 'سؤال تفكير يطلب تقويم تبرير بين قيمتين جديدتين، لا مجرد استخراج رمز مقارنة.',
  }),
  q(19, {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('حلّت ليلى مسألة تكافؤ، فكتبت: '), math('4/7 = 4/21'), text('. شخّص الخطأ واختر التصحيح.')),
    concepts: ['equivalence'], skills: ['diagnose-error'], sourceConcepts: ['equivalence-source'],
    coverage: { thinking: ['diagnose'], commonErrors: ['change-one-part'] },
    studentWork: rich(text('ليلى: «ضربت المقام 7 في 3، فصار 21؛ إذن أبقي البسط 4 كما هو».')),
    diagnoses: [optionText('q19-d1', 'غيّرت المقام وحده ولم تضرب البسط بالعامل نفسه.'), optionText('q19-d2', 'اختارت مقاما غير مشترك.'), optionText('q19-d3', 'عكست ترتيب البسط والمقام.'), optionText('q19-d4', 'لم تكتب العامل 3 في صورة كسر.')],
    corrections: [option('q19-c1', math('12/21')), option('q19-c2', math('7/21')), option('q19-c3', math('4/14')), option('q19-c4', math('4/10'))],
    answer: { diagnosisId: 'q19-d1', correctionId: 'q19-c1' },
    solution: { idea: rich(text('يجب الحفاظ على قيمة الكسر عند توسيعه.')), rule: rich(text('نضرب البسط والمقام بالعامل نفسه.')), steps: [rich(text('تحول المقام من 7 إلى 21 بالعامل 3.')), rich(math('4 × 3 = 12')), rich(text('إذن البسط الصحيح 12، والكسر المكافئ 12/21.'))], finalAnswer: rich(text('التشخيص الأول والتصحيح '), math('12/21'), text('.')), commonError: rich(text('تغيير المقام وحده يغيّر قيمة الكسر ولا ينتج كسرًا مكافئًا.')) },
    originalityNote: 'تحليل خطأ جديد في التوسيع بمعامل 3، صيغ ليختبر فهم الحفاظ على القيمة لا الحساب فقط.',
  }),
  q(20, {
    type: 'multi-select', difficulty: 'thinking',
    prompt: rich(text('اختر جميع الكسور الأكبر من النصف '), math('1/2'), text('.')),
    concepts: ['fraction-half'], skills: ['compare-half'], sourceConcepts: ['common-denominator-source'],
    coverage: { thinking: ['benchmark-half'] },
    options: [option('q20-a', math('5/9')), option('q20-b', math('4/7')), option('q20-c', math('7/15')), option('q20-d', math('3/5'))],
    answer: ['q20-a', 'q20-b', 'q20-d'],
    solution: { idea: rich(text('نقارن كل كسر بالنصف؛ يمكن توحيد المقامين أو مقارنة البسط بنصف المقام.')), rule: rich(text('لكسر موجب a/b، يكون أكبر من 1/2 عندما يكون 2a أكبر من b.')), steps: [rich(math('5/9: 10 > 9')), rich(math('4/7: 8 > 7')), rich(math('7/15: 14 < 15')), rich(math('3/5: 6 > 5'))], finalAnswer: rich(text('الكسور الأكبر من النصف هي 5/9 و4/7 و3/5.')), commonError: rich(text('اعتبار كل كسر بسطه أصغر من مقامه أقل من النصف؛ قارن البسط بنصف المقام.')) },
    originalityNote: 'مسألة تفكير متعددة الاختيارات تستخدم النصف مرجعاً وتجمع مقامات فردية مختلفة، غير مكررة في المصدر.',
  }),
]

const sourceConcepts = [
  { id: 'models', label: 'قراءة النماذج الدائرية وكتابة الكسر الممثل', pages: [54, 55] as const },
  { id: 'equivalence-source', label: 'تكوين كسور مكافئة والحفاظ على القيمة', pages: [54, 55] as const },
  { id: 'same-denominator-source', label: 'مقارنة الكسور المتساوية المقام', pages: [54, 57] as const },
  { id: 'common-denominator-source', label: 'مقارنة الكسور بعد توحيد المقامات', pages: [55, 57] as const },
  { id: 'ordering-source', label: 'ترتيب الكسور تصاعدياً وتنازلياً', pages: [56, 57] as const },
  { id: 'applications-source', label: 'تطبيق المقارنة في مسائل لفظية', pages: [57] as const },
]

export default defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار الكسور (1)',
  description: rich(text('اختبار مستقل من 20 سؤالاً في قراءة الكسور وتكافؤها ومقارنتها وترتيبها، مع تطبيقات وتفكير وتحليل أخطاء.')),
  instructions: rich(text('أجب عن الأسئلة العشرين ثم سلّم المحاولة لعرض النتيجة. لا تظهر حلول الأسئلة أو الإجابات النهائية قبل التسليم. في المقارنة رتّب طرفي المسألة كما وردا، واستخدم المقام المشترك عندما يختلف المقامان.')),
  questions,
  sourceConcepts,
  conceptLabels,
  skillLabels,
  applicationLabels,
  thinkingLabels,
  commonErrorLabels,
})
