import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/** Unit 2 · Lesson 6: 20 independently authored questions; solutions remain separate and locked until submission. */
const testId = 'lesson-tenths-one-test'
const lessonId = 'tenths-one'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })

const questions: QuestionDefinition[] = [
  // ─────────────── BASIC · 6 ───────────────
  q(1, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('في شبكة من عشرة مربعات، لُوّنت ستة مربعات. أي كسر يصف الجزء الملوّن؟')),
    concepts: ['tenths-as-parts'], skills: ['count-tenths'], sourceConcepts: ['tenths-source'],
    options: [option('q01-a', math('6/10')), option('q01-b', math('6/100')), option('q01-c', math('4/10')), option('q01-d', math('10/6'))],
    answer: 'q01-a',
    solution: { idea: rich(text('الكسر يكتب عدد الأجزاء المختارة فوق عدد أجزاء الكل.')), steps: [rich(text('المربعات الملوّنة ستة، فتكون هي البسط.')), rich(text('الشبكة كلها عشرة مربعات، فيكون المقام 10.'))], finalAnswer: rich(math('6/10')), commonError: rich(text('تبديل البسط والمقام، أو كتابة المقام 100 مع أن الشبكة فيها عشرة أجزاء فقط.')) },
    originalityNote: 'سياق شبكة جديد يختبر ربط عدد الخلايا بالبسط والمقام دون إعادة صياغة تمرين الرسم المطبوع.',
  }),
  q(2, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('اكتب ثلاثة أجزاء من عشرة بالصيغة العشرية.')),
    concepts: ['decimal-place-tenths'], skills: ['write-decimal'], sourceConcepts: ['decimal-notation-source'],
    answer: { expected: '0.3', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('الرقم في المنزلة الأولى بعد الفاصلة يعدّ الأجزاء من عشرة.')), steps: [rich(text('عدد الأجزاء هو 3.')), rich(text('نضع 3 في منزلة الأعشار بعد الصفر والفاصلة.'))], finalAnswer: rich(math('0.3')), commonError: rich(text('كتابة 0.03؛ فهذا يجعل الرقم في منزلة الأجزاء من مئة، لا الأعشار.')) },
    originalityNote: 'إجابة رقمية قصيرة على مقدار لفظي جديد، لا تنقل سؤالاً أو مثالاً من الصفحات.',
  }),
  q(3, {
    type: 'fraction', difficulty: 'basic',
    prompt: rich(text('اكتب العدد '), math('0.7'), text(' كسراً بسطه عدد الأجزاء من عشرة ومقامه عشرة.')),
    concepts: ['equivalent-tenths', 'decimal-place-tenths'], skills: ['decimal-to-tenths-fraction'], sourceConcepts: ['decimal-notation-source', 'equivalence-source'],
    answer: { numerator: '7', denominator: '10', equivalentForms: 'accept' },
    solution: { idea: rich(text('الرقم 7 بعد الفاصلة يمثل سبعة أجزاء من عشرة.')), steps: [rich(text('نقرأ الخانة الأولى بعد الفاصلة على أنها أعشار.')), rich(math('0.7 = 7/10'))], finalAnswer: rich(math('7/10')), commonError: rich(text('اعتبار المقام 100 لمجرد أن العدد مكتوب بصيغة عشرية.')) },
    originalityNote: 'تحويل بصياغة عكسية للتمثيل العشري وبقيمة جديدة، مع تحديد المقام المقصود.',
  }),
  q(4, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('صح أم خطأ: إذا اكتملت الأجزاء العشرة كلها، فإن '), math('10/10 = 1'), text('.')),
    concepts: ['tenths-as-parts'], skills: ['recognize-whole'], sourceConcepts: ['whole-tenths-source'],
    answer: true,
    solution: { idea: rich(text('عشرة أجزاء من عشرة تكوّن الكل كله.')), steps: [rich(text('عدد الأجزاء المأخوذة يساوي عدد أجزاء الكل.')), rich(math('10/10 = 1'))], finalAnswer: rich(text('العبارة صحيحة.')), commonError: rich(text('قراءة 10/10 على أنها أكبر من 1 لأن البسط يكتب بالعدد 10.')) },
    originalityNote: 'حكم مفاهيمي مع تبرير الجزء والكل، وليس نقلاً لعبارة المصدر التوضيحية.',
  }),
  q(5, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أي كتابة عشرية تعبّر عن ثلاثة أعشار؟')),
    concepts: ['decimal-place-tenths'], skills: ['read-decimal-words'], sourceConcepts: ['decimal-notation-source'],
    options: [option('q05-a', math('0.03')), option('q05-b', math('3.0')), option('q05-c', math('0.3')), option('q05-d', math('0.13'))],
    answer: 'q05-c',
    solution: { idea: rich(text('ثلاثة أعشار تعني ثلاثة أجزاء من عشرة.')), steps: [rich(text('نضع العدد 3 في أول منزلة بعد الفاصلة.')), rich(text('لا نضعه قبل الفاصلة، ولا في منزلة الأجزاء من مئة.'))], finalAnswer: rich(math('0.3')), commonError: rich(text('الخلط بين 0.3 و0.03، أو وضع العدد كله قبل الفاصلة.')) },
    originalityNote: 'تمييز لفظي بين قيمة الأعشار ومنزلة الجزء من مئة بخيارات صيغها مختلفة.',
  }),
  q(6, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أي العددين أكبر؟')),
    concepts: ['compare-tenths'], skills: ['compare-decimals'], sourceConcepts: ['comparison-source'],
    options: [option('q06-a', math('0.2')), option('q06-b', math('0.6'))],
    answer: 'q06-b',
    solution: { idea: rich(text('عند مقارنة الأجزاء من عشرة، نقارن عدد الأعشار.')), steps: [rich(text('العدد الأول يمثل عُشرين، والثاني ستة أعشار.')), rich(math('6 > 2'))], finalAnswer: rich(math('0.6')), commonError: rich(text('اختيار العدد ذي الأرقام الأقل أو الخلط بين ترتيب العددين.')) },
    originalityNote: 'مقارنة مباشرة بقيم غير مستخدمة في مثال المقارنة المطبوع.',
  }),

  // ─────────────── MEDIUM · 7 ───────────────
  q(7, {
    type: 'fraction', difficulty: 'medium',
    prompt: rich(text('حوّل '), math('0.9'), text(' إلى كسر مقامه 10، ثم اكتب البسط.')),
    concepts: ['decimal-place-tenths', 'equivalent-tenths'], skills: ['decimal-to-tenths-fraction'], sourceConcepts: ['decimal-notation-source', 'equivalence-source'],
    answer: { numerator: '9', denominator: '10', equivalentForms: 'accept' },
    solution: { idea: rich(text('الخانة الوحيدة بعد الفاصلة هي منزلة الأعشار.')), steps: [rich(text('الرقم فيها 9، لذا لدينا تسعة أجزاء من عشرة.')), rich(math('0.9 = 9/10'))], finalAnswer: rich(math('9/10')), commonError: rich(text('كتابة 9/100 رغم عدم وجود خانة ثانية بعد الفاصلة.')) },
    originalityNote: 'تحويل مستقل بقيمة جديدة، مع اشتراط تمثيلها بمقام عشرة.',
  }),
  q(8, {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب القيم من الأصغر إلى الأكبر.')),
    concepts: ['compare-tenths', 'equivalent-tenths'], skills: ['order-tenths'], sourceConcepts: ['comparison-source', 'equivalence-source'],
    items: [option('q08-a', math('0.2')), option('q08-b', math('5/10')), option('q08-c', math('0.6')), option('q08-d', math('8/10'))],
    answer: ['q08-a', 'q08-b', 'q08-c', 'q08-d'],
    solution: { idea: rich(text('نكتب القيم كلها على صورة أجزاء من عشرة ثم نقارن البسط.')), steps: [rich(math('0.2 = 2/10')), rich(text('القيم تمثل 2، 5، 6، 8 أجزاء من عشرة بالترتيب.'))], finalAnswer: rich(math('0.2 < 5/10 < 0.6 < 8/10')), commonError: rich(text('المقارنة بين شكلين مختلفين دون تحويل الكسر إلى قيمة عشرية أو كسر مكافئ.')) },
    originalityNote: 'مجموعة ترتيب مختلطة تجمع كسوراً وأعداداً عشرية جديدة بدلاً من نسخ خط الأعداد.',
  }),
  q(9, {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابق كل عدد عشري مع كسر يساويه.')),
    concepts: ['equivalent-tenths'], skills: ['match-equivalent-forms'], sourceConcepts: ['equivalence-source'],
    left: [option('q09-l1', math('0.2')), option('q09-l2', math('0.4')), option('q09-l3', math('0.6')), option('q09-l4', math('0.8'))],
    right: [option('q09-r1', math('2/10')), option('q09-r2', math('2/5')), option('q09-r3', math('6/10')), option('q09-r4', math('8/10'))],
    answer: [{ leftId: 'q09-l1', rightId: 'q09-r1' }, { leftId: 'q09-l2', rightId: 'q09-r2' }, { leftId: 'q09-l3', rightId: 'q09-r3' }, { leftId: 'q09-l4', rightId: 'q09-r4' }],
    solution: { idea: rich(text('كل عدد عشري من خانة واحدة يمثل أعشاراً، وقد يظهر كسره مكافئاً بمقام آخر.')), steps: [rich(math('0.2 = 2/10')), rich(math('0.4 = 4/10 = 2/5')), rich(math('0.6 = 6/10')), rich(math('0.8 = 8/10'))], finalAnswer: rich(text('الأزواج: 0.2 مع 2/10، و0.4 مع 2/5، و0.6 مع 6/10، و0.8 مع 8/10.')), commonError: rich(text('اعتقاد أن الكسر المكافئ يجب أن يبقى مقامه 10 فقط.')) },
    originalityNote: 'أزواج جديدة، وفيها كسر مكافئ مبسّط يختبر فهم تساوي القيمة لا مطابقة الشكل.',
  }),
  q(10, {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر كل التمثيلات التي تساوي '), math('0.6'), text('.')),
    concepts: ['equivalent-tenths'], skills: ['identify-equivalent-values'], sourceConcepts: ['equivalence-source'],
    options: [option('q10-a', math('6/10')), option('q10-b', math('3/5')), option('q10-c', math('6/100')), option('q10-d', math('0.06'))],
    answer: ['q10-a', 'q10-b'],
    solution: { idea: rich(text('قد تمثل القيمة نفسها بكسرين متكافئين، حتى إذا اختلف المقام.')), steps: [rich(math('0.6 = 6/10')), rich(math('6/10 ÷ 2/2 = 3/5')), rich(text('أما 6/100 و0.06 فهما ستة أجزاء من مئة، أي قيمة أصغر.'))], finalAnswer: rich(math('6/10'), text(' و'), math('3/5')), commonError: rich(text('التركيز على الرقم 6 وحده وتجاهل المقام أو منزلة الرقم.')) },
    originalityNote: 'اختيار متعدد يضم كسراً مكافئاً مبسطاً وتمثيلين أصغر، لا يعيد أزواج جدول المصدر.',
  }),
  q(11, {
    type: 'error-analysis', difficulty: 'medium',
    prompt: rich(text('كتب متعلم أن '), math('0.3 = 3/100'), text('. اختر سبب الخطأ والتصحيح المناسب.')),
    concepts: ['decimal-place-tenths', 'diagnose-place-value'], skills: ['diagnose-decimal-place-error'], sourceConcepts: ['decimal-notation-source'],
    coverage: { commonErrors: ['tenths-read-as-hundredths'] },
    studentWork: rich(text('المتعلم: «العدد 3 بعد العلامة يعطي كسر 3/100».')),
    diagnoses: [optionText('q11-d1', 'اعتبر الرقم في منزلة الأعشار جزءاً من مئة.'), optionText('q11-d2', 'استخدم بسطاً أكبر من المقام.'), optionText('q11-d3', 'حوّل العدد العشري إلى عدد صحيح.'), optionText('q11-d4', 'لا يوجد خطأ؛ التمثيلان متساويان.')],
    corrections: [option('q11-c1', math('3/10')), option('q11-c2', math('3/100')), option('q11-c3', math('30/10')), option('q11-c4', math('10/3'))],
    answer: { diagnosisId: 'q11-d1', correctionId: 'q11-c1' },
    solution: { idea: rich(text('منزلة الرقم تحدد المقام: الخانة الأولى بعد الفاصلة هي الأعشار.')), steps: [rich(text('في 0.3 يوجد رقم واحد بعد الفاصلة.')), rich(text('إذن المقام 10، لا 100.')), rich(math('0.3 = 3/10'))], finalAnswer: rich(text('التشخيص الأول، والتصحيح 3/10.')), commonError: rich(text('افتراض أن كل كتابة عشرية تحتاج إلى مقام 100.')) },
    originalityNote: 'خطأ جديد في تحديد المنزلة مع تشخيص وتصحيح، وليس سؤالاً منقولاً عن تدريب الكتاب.',
  }),
  q(12, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('تبدأ علامة من الصفر على خط مقسّم إلى أعشار. ما قيمة العلامة الخامسة بعد الصفر؟')),
    concepts: ['number-line-tenths'], skills: ['read-number-line'], sourceConcepts: ['numberline-source'],
    answer: { expected: '0.5', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('كل خطوة إلى اليمين تزيد القيمة بمقدار عُشر.')), steps: [rich(text('الخطوة الأولى 0.1، والثانية 0.2.')), rich(text('نواصل العد: 0.3، ثم 0.4، ثم 0.5.'))], finalAnswer: rich(math('0.5')), commonError: rich(text('البدء بالعد من 0 باعتبارها الخطوة الأولى.')) },
    originalityNote: 'قراءة خط أعداد بقيمة موضع جديدة وبصياغة سياقية مختلفة عن خانات الكتاب.',
  }),
  q(13, {
    type: 'true-false', difficulty: 'medium',
    prompt: rich(text('صح أم خطأ: '), math('0.8 < 7/10'), text('.')),
    concepts: ['compare-tenths', 'equivalent-tenths'], skills: ['compare-decimal-and-fraction'], sourceConcepts: ['comparison-source', 'equivalence-source'],
    answer: false,
    solution: { idea: rich(text('نحوّل الطرفين إلى أجزاء من عشرة قبل المقارنة.')), steps: [rich(math('0.8 = 8/10')), rich(text('نقارن 8/10 و7/10: البسط 8 أكبر من 7.'))], finalAnswer: rich(math('0.8 > 7/10'), text('؛ فالعبارة خاطئة.')), commonError: rich(text('قراءة علامة المقارنة دون توحيد شكل العددين.')) },
    originalityNote: 'حكم صح أو خطأ بتمثيلين مختلفين وقيمة مغايرة عن أمثلة المقارنة المطبوعة.',
  }),

  // ─────────────── ADVANCED · 4 ───────────────
  q(14, {
    type: 'fraction', difficulty: 'advanced',
    prompt: rich(text('اكتب '), math('18/30'), text(' على صورة كسر مكافئ مقامه 10.')),
    concepts: ['equivalent-tenths', 'simplify-equivalent-fraction'], skills: ['scale-fraction-to-tenths'], sourceConcepts: ['equivalence-source'],
    answer: { numerator: '6', denominator: '10', equivalentForms: 'accept' },
    solution: { idea: rich(text('نبحث عن عامل يحوّل المقام 30 إلى 10، ونقسم البسط عليه أيضاً.')), steps: [rich(math('30 ÷ 3 = 10')), rich(math('18 ÷ 3 = 6')), rich(math('18/30 = 6/10'))], finalAnswer: rich(math('6/10')), commonError: rich(text('تغيير المقام إلى 10 مع إبقاء البسط 18، فيتغير مقدار الكسر.')) },
    originalityNote: 'تحويل متقدم إلى مقام عشرة بعامل مشترك جديد، وليس المثال المطبوع 8/20.',
  }),
  q(15, {
    type: 'ordering', difficulty: 'advanced',
    prompt: rich(text('رتّب هذه القيم من الأكبر إلى الأصغر.')),
    concepts: ['compare-tenths', 'equivalent-tenths'], skills: ['order-mixed-representations'], sourceConcepts: ['comparison-source', 'equivalence-source'],
    items: [option('q15-a', math('0.4')), option('q15-b', math('8/10')), option('q15-c', math('0.6')), option('q15-d', math('5/10'))],
    answer: ['q15-b', 'q15-c', 'q15-d', 'q15-a'],
    solution: { idea: rich(text('حوّل الكسور إلى أعداد عشرية أو أجزاء من عشرة، ثم رتب البسوط.')), steps: [rich(math('8/10 = 0.8')), rich(math('5/10 = 0.5')), rich(text('تصبح القيم 0.8، 0.6، 0.5، 0.4 عند ترتيبها تنازلياً.'))], finalAnswer: rich(math('8/10 > 0.6 > 5/10 > 0.4')), commonError: rich(text('ترتيب القيم تصاعدياً مع أن المطلوب من الأكبر إلى الأصغر.')) },
    originalityNote: 'ترتيب تنازلي لأربع تمثيلات بقيم جديدة؛ يتطلب تحويل الكسرين قبل ترتيب المجموعة.',
  }),
  q(16, {
    type: 'multi-select', difficulty: 'advanced',
    prompt: rich(text('اختر كل الكسور التي تساوي '), math('0.6'), text('، ولو اختلف مقامها.')),
    concepts: ['equivalent-tenths', 'simplify-equivalent-fraction'], skills: ['verify-equivalent-fractions'], sourceConcepts: ['equivalence-source'],
    options: [option('q16-a', math('3/5')), option('q16-b', math('6/10')), option('q16-c', math('12/20')), option('q16-d', math('3/10'))],
    answer: ['q16-a', 'q16-b', 'q16-c'],
    solution: { idea: rich(text('نحوّل كل كسر إلى أعشار أو نبسّطه ونقارن بالقيمة 6/10.')), steps: [rich(math('3/5 = 6/10')), rich(math('6/10 = 0.6')), rich(math('12/20 = 6/10')), rich(text('أما 3/10 فيساوي 0.3، لا 0.6.'))], finalAnswer: rich(text('الكسور المكافئة هي 3/5 و6/10 و12/20.')), commonError: rich(text('اختيار كسر واحد فقط، أو نسيان أن التوسيع والاختصار يحافظان على القيمة.')) },
    originalityNote: 'توسيع واختصار متزامنان في مجموعة قيم جديدة، مع طلب جميع الإجابات المكافئة.',
  }),
  q(17, {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('بسّط طالب '), math('12/30'), text(' إلى '), math('12/10'), text(' لأنه غيّر المقام وحده. اختر التشخيص والتصحيح.')),
    concepts: ['equivalent-tenths', 'diagnose-equivalence-error'], skills: ['diagnose-unequal-scaling'], sourceConcepts: ['equivalence-source'],
    coverage: { commonErrors: ['change-one-term-only'] },
    studentWork: rich(text('الطالب: «حذفت الرقم 3 من 30، فصار المقام 10، وأبقيت البسط كما هو».')),
    diagnoses: [optionText('q17-d1', 'غيّر المقام دون أن يجري العملية نفسها على البسط.'), optionText('q17-d2', 'اختصر البسط والمقام بالعامل نفسه.'), optionText('q17-d3', 'حوّل الكسر إلى عدد عشري بصورة صحيحة.'), optionText('q17-d4', 'لم يتغير مقدار الكسر.')],
    corrections: [option('q17-c1', math('4/10')), option('q17-c2', math('8/10')), option('q17-c3', math('8/2')), option('q17-c4', math('2/10'))],
    answer: { diagnosisId: 'q17-d1', correctionId: 'q17-c1' },
    solution: { idea: rich(text('الكسر المكافئ ينتج من ضرب البسط والمقام أو قسمتهما على العامل نفسه.')), steps: [rich(text('لتحويل 30 إلى 10 نقسم المقام على 3.')), rich(text('نقسم البسط 12 على 3 أيضاً، فيصبح 4.')), rich(math('12/30 = 4/10 = 0.4'))], finalAnswer: rich(text('التشخيص الأول، والتصحيح 4/10.')), commonError: rich(text('إجراء عملية على المقام وحده؛ وهذا يغيّر قيمة الكسر.')) },
    originalityNote: 'تحليل خطأ تكافؤ باستخدام قيم جديدة يتطلب تطبيق العامل نفسه على البسط والمقام.'
  }),

  // ─────────────── THINKING · 3 ───────────────
  q(18, {
    type: 'single-choice', difficulty: 'thinking',
    prompt: rich(text('لوّنت ليلى 7 من 10 خلايا متساوية، ثم كتبت العدد العشري المقابل. أي تبرير يفسر كتابتها؟')),
    concepts: ['decimal-place-tenths', 'tenths-as-parts'], skills: ['justify-place-value'], sourceConcepts: ['tenths-source', 'decimal-notation-source'],
    coverage: { applications: ['represent-colored-part'], thinking: ['explain-decimal-place'] },
    options: [
      optionText('q18-a', 'وضعت 7 بعد الفاصلة لأن الخلايا السبعة تمثل أعشاراً من الكل.'),
      optionText('q18-b', 'كتبت 7 قبل الفاصلة لأن عدد الخلايا أكبر من واحد.'),
      optionText('q18-c', 'كتبت 7 في منزلة أجزاء المئة لأن الشبكة مرسومة في صفين.'),
      optionText('q18-d', 'وضعت 10 بعد الفاصلة لأن الشبكة تحتوي على عشر خلايا.'),
    ],
    answer: 'q18-a',
    solution: { idea: rich(text('الكتابة العشرية تحفظ معنى الكسر: عدد الأجزاء المختارة يظهر في منزلة الأعشار.')), steps: [rich(text('الكل مقسوم إلى عشرة أجزاء، والملون منها سبعة.')), rich(math('7/10 = 0.7')), rich(text('إذن تبرير الاختيار الأول هو الذي يربط البسط بمنزلة الأعشار.'))], finalAnswer: rich(math('0.7')), commonError: rich(text('الخلط بين عدد الخلايا الكلي 10 وعدد الخلايا المختارة 7.')) },
    originalityNote: 'سؤال تبرير تمثيل بصري بموقف واسم جديدين؛ لا يقتصر على حساب الناتج أو إعادة نص الرسم.',
  }),
  q(19, {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('قال سامي: «'), math('0.5'), text(' و'), math('5/10'), text(' لا يمكن أن يمثلا المقدار نفسه؛ فالأول عشري والثاني كسر». ما التشخيص والتصحيح؟')),
    concepts: ['equivalent-tenths', 'reason-about-equality'], skills: ['justify-equivalent-forms'], sourceConcepts: ['equivalence-source', 'comparison-source'],
    coverage: { thinking: ['justify-equivalence'], commonErrors: ['different-notation-different-value'] },
    studentWork: rich(text('سامي: «اختلاف شكل الكتابة يعني اختلاف القيمة».')),
    diagnoses: [optionText('q19-d1', 'خلط بين طريقة كتابة العدد وقيمته.'), optionText('q19-d2', 'حوّل خمسة أعشار إلى خمسة أجزاء من مئة.'), optionText('q19-d3', 'قارن بسطين لهما مقامان مختلفان.'), optionText('q19-d4', 'لم يكتب العدد 5 في منزلة الأعشار.')],
    corrections: [option('q19-c1', math('0.5 = 5/10')), option('q19-c2', math('0.5 < 5/10')), option('q19-c3', math('0.5 = 5/100')), option('q19-c4', math('0.5 = 10/5'))],
    answer: { diagnosisId: 'q19-d1', correctionId: 'q19-c1' },
    solution: { idea: rich(text('قد تختلف الرموز وتبقى الكمية نفسها إذا كان التمثيلان متكافئين.')), steps: [rich(math('0.5 = 5/10')), rich(text('كلاهما يعني خمسة أجزاء من عشرة.')), rich(text('الاختلاف في الصيغة، لا في القيمة.'))], finalAnswer: rich(text('التشخيص الأول والتصحيح الأول صحيحان.')), commonError: rich(text('اعتبار الكسر والعدد العشري كميتين مختلفتين لمجرد اختلاف طريقة الكتابة.')) },
    originalityNote: 'تحليل ادعاء يميّز القيمة عن التمثيل الكتابي، مع تشخيص وتصحيح مستقلين.',
  }),
  q(20, {
    type: 'multi-select', difficulty: 'thinking',
    prompt: rich(text('اختر كل القيم الواقعة بين ' ), math('0.3'), text(' و'), math('0.7'), text('؛ لا تختَر الحدّين نفسيهما.')),
    concepts: ['reason-about-range', 'compare-tenths'], skills: ['test-strict-inequality'], sourceConcepts: ['range-reasoning-source'],
    coverage: { thinking: ['exclude-open-interval-boundaries'], commonErrors: ['include-range-boundary'] },
    options: [option('q20-a', math('0.4')), option('q20-b', math('5/10')), option('q20-c', math('0.6')), option('q20-d', math('0.3')), option('q20-e', math('0.7'))],
    answer: ['q20-a', 'q20-b', 'q20-c'],
    solution: { idea: rich(text('كلمة «بين» هنا تعني أكبر من الحد الأدنى وأصغر من الحد الأعلى، دون مساواة أي منهما.')), steps: [rich(math('0.3 < 0.4 < 0.7')), rich(math('0.3 < 5/10 = 0.5 < 0.7')), rich(math('0.3 < 0.6 < 0.7')), rich(text('أما 0.3 و0.7 فهما الحدّان، ولذلك لا يدخلان ضمن الاختيارات.'))], finalAnswer: rich(text('القيم المقبولة: 0.4 و5/10 و0.6.')), commonError: rich(text('إدخال الحدّين لأنهما على طرفي الفترة، مع أن المطلوب قيم داخلية فقط.')) },
    originalityNote: 'تفكير في مجال مفتوح مع تمثيلات مختلطة واستبعاد صريح للحدين، لا ينسخ السؤال المفتوح في الكتاب.',
  }),
]

const sourceConcepts = [
  { id: 'tenths-source', label: 'تمثيل الكل بعشرة أجزاء وقراءة الأجزاء المظللة', pages: [62, 63] as const },
  { id: 'decimal-notation-source', label: 'كتابة أجزاء العشرة بالصيغة العشرية واللفظية', pages: [63] as const },
  { id: 'whole-tenths-source', label: 'عشرة أجزاء من عشرة تساوي واحداً كاملاً', pages: [63] as const },
  { id: 'comparison-source', label: 'مقارنة الأجزاء العشرية ذات المقام نفسه', pages: [64, 65] as const },
  { id: 'equivalence-source', label: 'تكوين كسور مكافئة مقامها عشرة ومقارنتها', pages: [64, 65] as const },
  { id: 'numberline-source', label: 'قراءة الأعشار وترتيبها على خط الأعداد', pages: [64, 65] as const },
  { id: 'range-reasoning-source', label: 'تحديد عدد داخل مجال مفتوح بين قيمتين عشريتين', pages: [65] as const },
]

const conceptLabels: Record<string, string> = {
  'tenths-as-parts': 'الأجزاء من عشرة بوصفها أجزاء من كل',
  'decimal-place-tenths': 'منزلة الأعشار في الكتابة العشرية',
  'equivalent-tenths': 'تكافؤ العدد العشري والكسر',
  'compare-tenths': 'مقارنة الأعداد العشرية ذات المنزلة الواحدة',
  'number-line-tenths': 'مواقع الأعشار على خط الأعداد',
  'diagnose-place-value': 'تحليل خطأ في القيمة المنزلية',
  'simplify-equivalent-fraction': 'تبسيط أو توسيع كسر مكافئ',
  'diagnose-equivalence-error': 'تحليل خطأ تغيير قيمة الكسر',
  'reason-about-equality': 'التعليل بتكافؤ صورتين عدديتين',
  'reason-about-range': 'الاستدلال على قيم داخل مجال مفتوح',
}
const skillLabels: Record<string, string> = {
  'count-tenths': 'عدّ الأجزاء وتحديد البسط والمقام',
  'write-decimal': 'كتابة الكسر العشري بالصيغة العشرية',
  'decimal-to-tenths-fraction': 'تحويل العدد العشري إلى كسر مقامه عشرة',
  'recognize-whole': 'إدراك أن عشرة أعشار تكوّن واحداً',
  'read-decimal-words': 'الربط بين التعبير اللفظي والعدد العشري',
  'compare-decimals': 'مقارنة عددين عشريين',
  'order-tenths': 'ترتيب تمثيلات الأجزاء من عشرة',
  'match-equivalent-forms': 'مطابقة الصور العددية المتكافئة',
  'identify-equivalent-values': 'اختيار كل التمثيلات المكافئة',
  'diagnose-decimal-place-error': 'تشخيص خطأ في منزلة الأعشار',
  'read-number-line': 'قراءة قيمة تدريجة على خط الأعداد',
  'compare-decimal-and-fraction': 'مقارنة عدد عشري بكسر مكافئ',
  'scale-fraction-to-tenths': 'تحويل كسر إلى مقام عشرة بعامل مشترك',
  'order-mixed-representations': 'ترتيب أعداد مكتوبة بصيغ مختلفة',
  'verify-equivalent-fractions': 'التحقق من تكافؤ الكسور',
  'diagnose-unequal-scaling': 'تشخيص تغيير حد واحد من الكسر',
  'justify-place-value': 'تبرير منزلة الرقم من النموذج',
  'justify-equivalent-forms': 'تبرير تساوي صيغ عددية مختلفة',
  'test-strict-inequality': 'التحقق من حدود مجال مفتوح',
}
const applicationLabels: Record<string, string> = {
  'represent-colored-part': 'ربط تلوين نموذج بعدد عشري',
}
const thinkingLabels: Record<string, string> = {
  'explain-decimal-place': 'تفسير سبب وضع الرقم في منزلة الأعشار',
  'justify-equivalence': 'تبرير تساوي تمثيلين مختلفين',
  'exclude-open-interval-boundaries': 'استبعاد طرفي المجال المفتوح',
}
const commonErrorLabels: Record<string, string> = {
  'tenths-read-as-hundredths': 'اعتبار الأعشار أجزاءً من مئة',
  'change-one-term-only': 'تغيير المقام دون البسط في الكسر',
  'different-notation-different-value': 'الاعتقاد بأن اختلاف الصيغة يعني اختلاف القيمة',
  'include-range-boundary': 'إدخال أحد طرفي المجال في المطلوب الواقع بينهما',
}

export default defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار الدرس · الأجزاء العشرية (1)',
  description: rich(text('اختبار مستقل لتمثيل أجزاء العشرة وقراءتها وكتابتها ومقارنتها، مع مواقف جديدة وتحليل للأخطاء.')),
  instructions: rich(text('أجب عن الأسئلة العشرين. لكل سؤال نقطة واحدة. تبقى الحلول مخفية إلى أن تنهي المحاولة وتسلمها وفق آلية المنصة.')),
  questions,
  sourceConcepts,
  conceptLabels,
  skillLabels,
  applicationLabels,
  thinkingLabels,
  commonErrorLabels,
})
