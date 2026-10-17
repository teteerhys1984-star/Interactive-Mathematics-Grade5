import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/** Unit 2 · Lesson 7: 20 independently authored questions on hundredths; solutions stay locked until submission. */
const testId = 'lesson-decimal-parts-two-test'
const lessonId = 'decimal-parts-two'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })

const questions: QuestionDefinition[] = [
  // ─────────────── BASIC · 6 ───────────────
  q(1, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('في شبكة من مئة مربع صغير، لُوّنت 37 مربعاً. أي كسر يصف الجزء الملوّن؟')),
    concepts: ['hundredths-as-parts'], skills: ['count-hundredths'], sourceConcepts: ['hundredths-source'],
    options: [option('q01-a', math('37/100')), option('q01-b', math('37/10')), option('q01-c', math('63/100')), option('q01-d', math('3.7/100'))],
    answer: 'q01-a',
    solution: { idea: rich(text('المقام هو عدد الخانات كلها، والبسط هو عدد الخانات الملوّنة.')), steps: [rich(text('الشبكة فيها 100 مربع، فالمقام 100.')), rich(text('الملوّن 37 مربعاً، فالبسط 37.'))], finalAnswer: rich(math('37/100')), commonError: rich(text('اختيار 63/100 لأنه يصف الخانات غير الملوّنة، أو كتابة المقام 10 لأن العدد يبدو كبيراً.')) },
    originalityNote: 'شبكة مئة مربع بعدد ملوّن جديد، تختبر ربط البسط والمقام بالخانات دون نسخ أي تمرين من الكتاب.',
  }),
  q(2, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('اكتب سبعة أجزاء من مئة بالكتابة العشرية.')),
    concepts: ['decimal-two-places'], skills: ['write-hundredths-decimal'], sourceConcepts: ['decimal-notation-source'],
    answer: { expected: '0.07', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('الأجزاء من مئة تحتاج إلى خانتين بعد الفاصلة.')), steps: [rich(text('البسط 7 خانة واحدة، فنضع صفراً قبلها في خانة الأعشار.')), rich(math('7/100 = 0.07'))], finalAnswer: rich(math('0.07')), commonError: rich(text('كتابة 0.7، وهي سبعة أعشار لا سبعة أجزاء من مئة.')) },
    originalityNote: 'عدد جديد بخانة واحدة للبسط، يختبر قاعدة الصفر الذي يسبق الرقم بعد الفاصلة.',
  }),
  q(3, {
    type: 'fraction', difficulty: 'basic',
    prompt: rich(text('اكتب العدد '), math('0.45'), text(' كسراً مقامه 100.')),
    concepts: ['decimal-two-places', 'equivalent-hundredths'], skills: ['hundredths-to-fraction'], sourceConcepts: ['decimal-notation-source', 'equivalence-source'],
    answer: { numerator: '45', denominator: '100', equivalentForms: 'accept' },
    solution: { idea: rich(text('الخانتان بعد الفاصلة تمثلان الأجزاء من مئة.')), steps: [rich(text('الخانة الأولى 4 أعشار، والثانية 5 أجزاء من مئة.')), rich(math('0.45 = 45/100'))], finalAnswer: rich(math('45/100')), commonError: rich(text('كتابة 45/10، فيُجعل المقام عدد الخانات الأولى فقط.')) },
    originalityNote: 'تحويل عكسي لعدد جديد بخانتين، مع تحديد المقام المطلوب بوضوح.',
  }),
  q(4, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('صح أم خطأ: إذا لُوّنت المئة خانة كلها، فإن '), math('100/100 = 1'), text('.')),
    concepts: ['whole-hundredths'], skills: ['recognize-whole'], sourceConcepts: ['whole-hundredths-source'],
    answer: true,
    solution: { idea: rich(text('مئة جزء من مئة تكوّن الكل كله.')), steps: [rich(text('البسط يساوي المقام، فالكسر يساوي واحداً.')), rich(math('100/100 = 1'))], finalAnswer: rich(text('العبارة صحيحة.')), commonError: rich(text('الظن أن الكسر الذي بسطه 100 يجب أن يكون أكبر من 1.')) },
    originalityNote: 'حكم مفاهيمي عن الكل والجزء، لا يعيد عبارة المصدر التوضيحية نفسها.',
  }),
  q(5, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أي كتابة عشرية تعبّر عن «خمسة أجزاء من مئة»؟')),
    concepts: ['decimal-two-places'], skills: ['read-hundredths-words'], sourceConcepts: ['decimal-notation-source'],
    options: [option('q05-a', math('0.5')), option('q05-b', math('0.05')), option('q05-c', math('0.005')), option('q05-d', math('5.100'))],
    answer: 'q05-b',
    solution: { idea: rich(text('خمسة أجزاء من مئة تكتب بخانتين بعد الفاصلة.')), steps: [rich(text('الرقم 5 يوضع في خانة الأجزاء من مئة، أي الخانة الثانية بعد الفاصلة.')), rich(math('5/100 = 0.05'))], finalAnswer: rich(math('0.05')), commonError: rich(text('اختيار 0.5، وهي خمسة أعشار.')) },
    originalityNote: 'تمييز لفظي بين خانة الأعشار وخانة الأجزاء من مئة، بخيارات مختلفة عن أمثلة الكتاب.',
  }),
  q(6, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أي العددين أكبر: 0.3 أم 0.29؟')),
    concepts: ['compare-hundredths'], skills: ['compare-decimals'], sourceConcepts: ['comparison-source'],
    options: [option('q06-a', math('0.3')), option('q06-b', math('0.29'))],
    answer: 'q06-a',
    solution: { idea: rich(text('نكتب العددين بخانتين بعد الفاصلة ثم نقارن.')), steps: [rich(math('0.3 = 0.30')), rich(text('30 أكبر من 29، إذن 0.30 أكبر من 0.29.'))], finalAnswer: rich(math('0.3')), commonError: rich(text('تفضيل 0.29 لأن فيه خانتين، أو لأن 29 أكبر من 3.')) },
    originalityNote: 'مقارنة مباشرة تُحسم بعد توحيد عدد الخانات، وهي مختلفة عن أمثلة المقارنة المطبوعة.',
  }),

  // ─────────────── MEDIUM · 7 ───────────────
  q(7, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('اكتب '), math('30/100'), text(' بأبسط صورة عشرية.')),
    concepts: ['decimal-two-places', 'equivalent-hundredths'], skills: ['simplify-decimal'], sourceConcepts: ['decimal-notation-source', 'equivalence-source'],
    answer: { expected: '0.3', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('الصفر في آخر العدد العشري لا يغيّر القيمة.')), steps: [rich(math('30/100 = 0.30')), rich(text('نحذف الصفر الأخير فنحصل على 0.3.'))], finalAnswer: rich(math('0.3')), commonError: rich(text('كتابة 0.03 لأن الرقم 3 يبدو بعد الفاصلة في خانة ثانية.')) },
    originalityNote: 'تبسيط عدد عشري جديد من كسر بمقام 100، ويطلب صورة مختصرة بدل النسخ المباشر من الكتاب.',
  }),
  q(8, {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب الأعداد من الأصغر إلى الأكبر، وتخيّلها على خط الأعداد بين 0 و1.')),
    concepts: ['compare-hundredths', 'equivalent-hundredths'], skills: ['order-hundredths'], sourceConcepts: ['comparison-source', 'numberline-source'],
    items: [option('q08-a', math('0.5')), option('q08-b', math('0.45')), option('q08-c', math('0.54')), option('q08-d', math('0.4'))],
    answer: ['q08-d', 'q08-b', 'q08-a', 'q08-c'],
    solution: { idea: rich(text('نكتب كل عدد بخانتين بعد الفاصلة ثم نرتب الأجزاء من مئة.')), steps: [rich(text('0.4 = 0.40، و0.45، و0.5 = 0.50، و0.54.')), rich(text('الترتيب: 40 < 45 < 50 < 54.'))], finalAnswer: rich(math('0.4 < 0.45 < 0.5 < 0.54')), commonError: rich(text('مقارنة 0.5 و0.54 على أنهما متساويان لأن الرقم 5 مشترك.')) },
    originalityNote: 'ترتيب أربعة أعداد تختلف في عدد الخانات، مع فرق صغير بين اثنين منها.',
  }),
  q(9, {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابق كل عدد عشري مع الكسر المساوي له.')),
    concepts: ['equivalent-hundredths'], skills: ['match-equivalent-forms'], sourceConcepts: ['equivalence-source'],
    left: [option('q09-l1', math('0.25')), option('q09-l2', math('0.52')), option('q09-l3', math('0.06')), option('q09-l4', math('0.6'))],
    right: [option('q09-r1', math('25/100')), option('q09-r2', math('52/100')), option('q09-r3', math('6/100')), option('q09-r4', math('60/100'))],
    answer: [{ leftId: 'q09-l1', rightId: 'q09-r1' }, { leftId: 'q09-l2', rightId: 'q09-r2' }, { leftId: 'q09-l3', rightId: 'q09-r3' }, { leftId: 'q09-l4', rightId: 'q09-r4' }],
    solution: { idea: rich(text('كل عدد عشري يُقرأ بخانتين، ويُكتب كسره بمقام 100.')), steps: [rich(math('0.25 = 25/100')), rich(math('0.52 = 52/100')), rich(math('0.06 = 6/100')), rich(math('0.6 = 60/100'))], finalAnswer: rich(text('الأزواج: 0.25 مع 25/100، و0.52 مع 52/100، و0.06 مع 6/100، و0.6 مع 60/100.')), commonError: rich(text('ربط 0.06 بـ 60/100 لأن الرقم 6 مشترك بينهما.')) },
    originalityNote: 'أزواج جديدة تشمل صفراً في الخانة الأولى، لتختبر فهم القيمة لا مطابقة الأرقام المتشابهة.',
  }),
  q(10, {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر كل التمثيلات التي تساوي '), math('0.5'), text('.')),
    concepts: ['equivalent-hundredths'], skills: ['identify-equivalent-values'], sourceConcepts: ['equivalence-source'],
    options: [option('q10-a', math('0.50')), option('q10-b', math('50/100')), option('q10-c', math('0.05')), option('q10-d', math('5/10'))],
    answer: ['q10-a', 'q10-b', 'q10-d'],
    solution: { idea: rich(text('الصفر بعد الفاصلة لا يغيّر القيمة، والكسر المكافئ يحافظ عليها.')), steps: [rich(math('0.5 = 0.50 = 50/100 = 5/10')), rich(math('0.05 = 5/100'))], finalAnswer: rich(math('0.50'), text(' و'), math('50/100'), text(' و'), math('5/10')), commonError: rich(text('اختيار 0.05 لأن فيه الرقم 5 نفسه، مع تجاهل منزلته.')) },
    originalityNote: 'اختيار متعدد يجمع صيغاً متكافئة ومنزلة مختلفة، لا يعيد أي سؤال مطبوع.',
  }),
  q(11, {
    type: 'error-analysis', difficulty: 'medium',
    prompt: rich(text('قارن متعلم بين '), math('0.4'), text(' و'), math('0.45'), text(' فكتب: «0.4 أكبر لأن 4 أكبر من 45 مع إهمال الأصفار».'), text(' اختر التشخيص والتصحيح.')),
    concepts: ['compare-hundredths', 'diagnose-place-value'], skills: ['diagnose-decimal-comparison'], sourceConcepts: ['comparison-source'],
    coverage: { commonErrors: ['unaligned-decimal-places'] },
    studentWork: rich(text('المتعلم: «4 أكبر من 45 فإذن 0.4 أكبر».')),
    diagnoses: [optionText('q11-d1', 'قارن 4 مع 45 دون توحيد عدد الخانات بعد الفاصلة.'), optionText('q11-d2', 'حسب 0.4 جزءاً من عشرة، وهذا خطأ في المنزلة.'), optionText('q11-d3', 'ظن أن العدد الأكبر يكتب بخانة واحدة.'), optionText('q11-d4', 'لا يوجد خطأ؛ القيم متساوية.')],
    corrections: [option('q11-c1', math('0.40 < 0.45')), option('q11-c2', math('0.4 > 0.45')), option('q11-c3', math('0.4 = 0.45')), option('q11-c4', math('4 > 45'))],
    answer: { diagnosisId: 'q11-d1', correctionId: 'q11-c1' },
    solution: { idea: rich(text('نكتب العددين بالخانات نفسها ثم نقارن الأجزاء من مئة.')), steps: [rich(math('0.4 = 0.40')), rich(text('نقارن 40 و45: 40 أصغر، إذن 0.40 < 0.45.'))], finalAnswer: rich(text('التشخيص الأول، والتصحيح 0.40 < 0.45.')), commonError: rich(text('إهمال الصفر بعد الفاصلة ومقارنة الأرقام كأنها أعداد صحيحة.')) },
    originalityNote: 'خطأ جديد في محاذاة الخانات يشبه مقارنة الأعداد الصحيحة، مع تشخيص وتصحيح غير مطبوعين.',
  }),
  q(12, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('بدأنا من '), math('0.20'), text(' ثم أضفنا '), math('0.05'), text('. ما الناتج بالكتابة العشرية؟')),
    concepts: ['decimal-two-places'], skills: ['add-hundredths'], sourceConcepts: ['decimal-notation-source'],
    answer: { expected: '0.25', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('نجمع الأجزاء من مئة بعد توحيد الخانات.')), steps: [rich(text('20 جزءاً من مئة + 5 أجزاء من مئة = 25 جزءاً من مئة.')), rich(math('0.20 + 0.05 = 0.25'))], finalAnswer: rich(math('0.25')), commonError: rich(text('جمع 0.20 و0.05 كأنهما 20 و5 فيكون الناتج 25 ثم يُكتب 2.5 أو 0.7 بسبب الخلط بين الخانات.')) },
    originalityNote: 'جمع عددين بخانتين ينتج عدداً جديداً، ويعتمد على الفهم لا على حفظ قاعدة الفاصلة.',
  }),
  q(13, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('أي عدد يقع بين '), math('0.6'), text(' و'), math('0.7'), text(' دون أن يساوي أحدهما؟')),
    concepts: ['open-interval-hundredths'], skills: ['choose-between-values'], sourceConcepts: ['range-reasoning-source'],
    coverage: { commonErrors: ['include-range-boundary'] },
    options: [option('q13-a', math('0.7')), option('q13-b', math('0.65')), option('q13-c', math('0.6')), option('q13-d', math('0.07'))],
    answer: 'q13-b',
    solution: { idea: rich(text('العدد المطلوب يجب أن يكون أكبر من الطرف الأصغر وأصغر من الطرف الأكبر.')), steps: [rich(text('0.7 و0.6 طرفان مستبعدان.')), rich(text('0.65 يحقق 0.60 < 0.65 < 0.70.'))], finalAnswer: rich(math('0.65')), commonError: rich(text('اختيار 0.07 لأن العدد أصغر من 0.6 ظناً منه أنه يقع بين 0.6 و0.7.')) },
    originalityNote: 'مجال مفتوح بخيارات تشمل الطرفين وعدداً خارج المجال، ليتحقق الطالب من الاستبعاد.',
  }),

  // ─────────────── ADVANCED · 4 ───────────────
  q(14, {
    type: 'fraction', difficulty: 'advanced',
    prompt: rich(text('ما الكسر المساوي لـ '), math('0.4 + 0.07'), text(' بمقام 100؟')),
    concepts: ['equivalent-hundredths', 'decimal-two-places'], skills: ['combine-hundredths-representations'], sourceConcepts: ['equivalence-source', 'decimal-notation-source'],
    answer: { numerator: '47', denominator: '100', equivalentForms: 'accept' },
    solution: { idea: rich(text('نحوّل كل حد إلى أجزاء من مئة ثم نجمع البسطين.')), steps: [rich(math('0.4 = 40/100')), rich(math('0.07 = 7/100')), rich(text('40 + 7 = 47، إذن المجموع 47/100.'))], finalAnswer: rich(math('47/100')), commonError: rich(text('جمع 4 و7 فيُكتب 11/100 أو 0.11 لأن الرقمين يبدوان متشابهين.')) },
    originalityNote: 'يجمع عدداً عشرياً بكتابة مئوية في سؤال واحد، وهو غير مطروح في تدريبات الكتاب.',
  }),
  q(15, {
    type: 'single-choice', difficulty: 'advanced',
    prompt: rich(text('رتّب '), math('0.3'), text('، و'), math('0.25'), text('، و'), math('0.4'), text(' تنازلياً (من الأكبر إلى الأصغر).')),
    concepts: ['compare-hundredths'], skills: ['order-hundredths'], sourceConcepts: ['comparison-source'],
    options: [option('q15-a', math('0.25 > 0.3 > 0.4')), option('q15-b', math('0.4 > 0.3 > 0.25')), option('q15-c', math('0.3 > 0.4 > 0.25')), option('q15-d', math('0.4 > 0.25 > 0.3'))],
    answer: 'q15-b',
    solution: { idea: rich(text('نكتب الأعداد بخانتين ثم نرتبها من الأكبر إلى الأصغر.')), steps: [rich(math('0.3 = 0.30، و0.25، و0.40')), rich(text('الترتيب التنازلي: 40 > 30 > 25.'))], finalAnswer: rich(math('0.4 > 0.3 > 0.25')), commonError: rich(text('ترتيب 0.25 قبل 0.3 لأن 25 يبدو أكبر من 3.')) },
    originalityNote: 'ترتيب تنازلي لثلاثة أعداد يضم عدد خانات مختلفاً، بخيارات تجمع الأخطاء المتوقعة.',
  }),
  q(16, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('كم عدداً مكوّناً من خانتين بعد الفاصلة يقع بين '), math('0.20'), text(' و'), math('0.25'), text(' دون أن يساوي أحدهما؟')),
    concepts: ['open-interval-hundredths'], skills: ['count-hundredths-between'], sourceConcepts: ['range-reasoning-source'],
    answer: { expected: '4', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('نعدّ الأجزاء من مئة بين 20 و25 دون الطرفين.')), steps: [rich(text('الأعداد هي 0.21 و0.22 و0.23 و0.24.')), rich(text('الطرفان 0.20 و0.25 مستبعدان، فالجواب 4.'))], finalAnswer: rich(text('أربعة أعداد.')), commonError: rich(text('العدّ من 0.20 إلى 0.25 فيكون الجواب 5 أو 6 بإدخال الطرفين.')) },
    originalityNote: 'عدّ عناصر مجال مفتوح من الأجزاء من مئة، وهو تحقق من فهم الحدود وليس تمريناً مطبوعاً.',
  }),
  q(17, {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('كتب متعلم أن '), math('85/100 = 0.085'), text('. اختر التشخيص والتصحيح.')),
    concepts: ['decimal-two-places', 'diagnose-place-value'], skills: ['diagnose-decimal-place-error'], sourceConcepts: ['decimal-notation-source'],
    coverage: { commonErrors: ['extra-digit-in-hundredths'] },
    studentWork: rich(text('المتعلم: «الكسر 85/100 يكتب بثلاث خانات بعد الفاصلة، فيصبح 0.085».')),
    diagnoses: [optionText('q17-d1', 'أضاف خانة ثالثة بعد الفاصلة، والأجزاء من مئة تحتاج خانتين فقط.'), optionText('q17-d2', 'قسّم 85 على 100 بطريقة خاطئة في الحساب.'), optionText('q17-d3', 'حوّل 85 إلى كسر مقامه 1000.'), optionText('q17-d4', 'لا يوجد خطأ؛ 0.085 تساوي 85/100.')],
    corrections: [option('q17-c1', math('0.85')), option('q17-c2', math('0.085')), option('q17-c3', math('8.5')), option('q17-c4', math('0.0085'))],
    answer: { diagnosisId: 'q17-d1', correctionId: 'q17-c1' },
    solution: { idea: rich(text('الأجزاء من مئة تُكتب بخانتين بعد الفاصلة.')), steps: [rich(text('في 85/100 البسط خانتان، فنكتب 85 بعد الفاصلة.')), rich(math('85/100 = 0.85'))], finalAnswer: rich(text('التشخيص الأول، والتصحيح 0.85.')), commonError: rich(text('إضافة صفر قبل العدد أو زيادة الخانات دون فهم أن البسط هو الخانتان.')) },
    originalityNote: 'خطأ في عدد الخانات يخص بسطاً من خانتين، وهو مختلف عن أخطاء الأعشار في الاختبار السابق.',
  }),

  // ─────────────── THINKING · 3 ───────────────
  q(18, {
    type: 'single-choice', difficulty: 'thinking',
    prompt: rich(text('أي تبرير صحيح لكون '), math('0.7 = 0.70'), text('؟')),
    concepts: ['decimal-two-places', 'equivalent-hundredths'], skills: ['justify-equivalent-forms'], sourceConcepts: ['decimal-notation-source', 'equivalence-source'],
    coverage: { thinking: ['explain-decimal-place'] },
    options: [optionText('q18-a', 'إضافة صفر بعد آخر خانة بعد الفاصلة لا تغيّر عدد الأجزاء من مئة، فهما 70 من مئة.'), optionText('q18-b', 'الصفر يضرب العدد في عشرة فيصبح أكبر ثم يُقسم.'), optionText('q18-c', '0.70 أكبر من 0.7 لأن الكتابة أطول.'), optionText('q18-d', '0.7 تعني 7 من مئة، ولا علاقة لها بـ 0.70.')],
    answer: 'q18-a',
    solution: { idea: rich(text('القيمة تتحدد بالخانات، والصفر في آخر العدد لا يغيّر الأجزاء.')), steps: [rich(math('0.7 = 7/10 = 70/100')), rich(text('إذن 0.70 تعني 70 جزءاً من مئة، وهي القيمة نفسها.'))], finalAnswer: rich(text('الخيار الأول.')), commonError: rich(text('الظن أن الصفر يغيّر المنزلة أو يضاعف القيمة.')) },
    originalityNote: 'يطلب تبريراً لفظياً مبنياً على تكافؤ 7/10 و70/100، لا مجرد اختيار قاعدة حفظية.',
  }),
  q(19, {
    type: 'true-false', difficulty: 'thinking',
    prompt: rich(text('صح أم خطأ: إذا كان للعددين العشريين الخانات نفسها بعد الفاصلة، فإن الأكبر هو الذي بسطه أكبر.')),
    concepts: ['compare-hundredths'], skills: ['justify-comparison-rule'], sourceConcepts: ['comparison-source'],
    coverage: { thinking: ['justify-equivalence'] },
    answer: true,
    solution: { idea: rich(text('عندما تتساوى المقامات، تكون المقارنة بين البسطين.')), steps: [rich(text('الخانات نفسها تعني أن المقام واحد، مثل 100.')), rich(text('إذن الأكبر بسطاً هو الأكبر قيمة.'))], finalAnswer: rich(text('العبارة صحيحة.')), commonError: rich(text('الاعتقاد بأن عدد الخانات أو الصفر الأول يحدد الأكبر دائماً.')) },
    originalityNote: 'يطلب تعميم قاعدة المقارنة بعد توحيد المقام، ويقيس التبرير لا الحفظ.',
  }),
  q(20, {
    type: 'single-choice', difficulty: 'thinking',
    prompt: rich(text('أي عبارة صحيحة وتبررها المقارنة الصحيحة؟')),
    concepts: ['compare-hundredths', 'open-interval-hundredths'], skills: ['justify-decimal-comparison'], sourceConcepts: ['comparison-source', 'range-reasoning-source'],
    coverage: { commonErrors: ['include-range-boundary'] },
    options: [optionText('q20-a', '0.4 > 0.39 لأن 40 أكبر من 39 بعد توحيد الخانات.'), optionText('q20-b', '0.4 < 0.39 لأن 4 أصغر من 39.'), optionText('q20-c', '0.5 بين 0.45 و0.5 لأنه يساوي أحدهما.'), optionText('q20-d', '0.12 أكبر من 0.2 لأن فيه خانتين.')],
    answer: 'q20-a',
    solution: { idea: rich(text('نوحّد الخانات بعد الفاصلة، ثم نقارن الأجزاء من مئة.')), steps: [rich(math('0.4 = 0.40')), rich(text('40 أكبر من 39، فإن 0.40 > 0.39.'))], finalAnswer: rich(text('الخيار الأول.')), commonError: rich(text('مقارنة 4 مع 39 كعددين صحيحين دون محاذاة الخانات.')) },
    originalityNote: 'يجمع مقارنة بعد توحيد الخانات مع تمييز الطرف المستبعد، ويطلب تبرير الاختيار.',
  }),
]

const sourceConcepts = [
  { id: 'hundredths-source', label: 'تمثيل الكل بمئة جزء وقراءة الأجزاء الملوّنة', pages: [66, 67] as const },
  { id: 'decimal-notation-source', label: 'كتابة الأجزاء من مئة بالكتابة العشرية واللفظية', pages: [67, 68] as const },
  { id: 'whole-hundredths-source', label: 'مئة جزء من مئة تساوي واحداً كاملاً', pages: [67] as const },
  { id: 'equivalence-source', label: 'تكافؤ الصيغ: الصفر بعد الفاصلة والكسر ذو المقام 100', pages: [67, 68, 71] as const },
  { id: 'comparison-source', label: 'مقارنة الأجزاء من مئة بعد توحيد عدد الخانات', pages: [68, 69, 71] as const },
  { id: 'numberline-source', label: 'ترتيب القيم على خط الأعداد بخطوة 0.01', pages: [69, 70] as const },
  { id: 'range-reasoning-source', label: 'تحديد عدد داخل مجال مفتوح بين قيمتين', pages: [69, 71] as const },
]

const conceptLabels: Record<string, string> = {
  'hundredths-as-parts': 'الأجزاء من مئة بوصفها أجزاء من كل',
  'decimal-two-places': 'خانتان بعد الفاصلة للأجزاء من مئة',
  'whole-hundredths': 'مئة جزء من مئة تساوي الواحد',
  'equivalent-hundredths': 'تكافؤ العدد العشري والكسر ذي المقام 100',
  'compare-hundredths': 'مقارنة الأعداد العشرية بعد توحيد الخانات',
  'open-interval-hundredths': 'الأعداد داخل مجال مفتوح',
  'diagnose-place-value': 'تحليل خطأ في القيمة المنزلية للأرقام',
}
const skillLabels: Record<string, string> = {
  'count-hundredths': 'عدّ الأجزاء من مئة في الشبكة',
  'write-hundredths-decimal': 'كتابة الأجزاء من مئة كتابة عشرية',
  'hundredths-to-fraction': 'تحويل العدد العشري إلى كسر مقامه 100',
  'recognize-whole': 'التعرف إلى الواحد الكامل',
  'read-hundredths-words': 'ربط التعبير اللفظي بالعدد العشري',
  'compare-decimals': 'مقارنة عددين عشريين',
  'simplify-decimal': 'تبسيط الكتابة العشرية بحذف الصفر الأخير',
  'order-hundredths': 'ترتيب أعداد مكتوبة بصيغ مختلفة',
  'match-equivalent-forms': 'مطابقة الصيغ المتكافئة',
  'identify-equivalent-values': 'اختيار كل التمثيلات المكافئة',
  'diagnose-decimal-comparison': 'تشخيص خطأ في مقارنة الأعداد العشرية',
  'diagnose-decimal-place-error': 'تشخيص خطأ في عدد الخانات بعد الفاصلة',
  'add-hundredths': 'جمع الأجزاء من مئة',
  'choose-between-values': 'اختيار عدد داخل مجال مفتوح',
  'combine-hundredths-representations': 'جمع تمثيل عشري وتمثيل مئوي',
  'count-hundredths-between': 'عدّ الأعداد المئوية داخل مجال مفتوح',
  'justify-equivalent-forms': 'تبرير تساوي صيغتين عدديتين',
  'justify-comparison-rule': 'تبرير قاعدة المقارنة بعد توحيد المقام',
  'justify-decimal-comparison': 'تبرير نتيجة مقارنة عشرية',
}
const applicationLabels: Record<string, string> = {}
const thinkingLabels: Record<string, string> = {
  'explain-decimal-place': 'تفسير سبب بقاء القيمة عند إضافة صفر',
  'justify-equivalence': 'تبرير تساوي تمثيلين مختلفين',
}
const commonErrorLabels: Record<string, string> = {
  'unaligned-decimal-places': 'مقارنة الأرقام دون توحيد عدد الخانات بعد الفاصلة',
  'extra-digit-in-hundredths': 'إضافة خانة زائدة إلى الجزء من مئة',
  'include-range-boundary': 'إدخال أحد طرفي المجال المفتوح في المطلوب',
}

export default defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار الدرس · الأجزاء العشرية (2)',
  description: rich(text('اختبار مستقل للأجزاء من مئة: كتابتها عشرياً ولفظياً، وتحويلها إلى كسور، ومقارنتها وترتيبها.')),
  instructions: rich(text('أجب عن الأسئلة العشرين. لكل سؤال نقطة واحدة. تبقى الحلول مخفية إلى أن تنهي المحاولة وتسلمها وفق آلية المنصة.')),
  questions,
  sourceConcepts,
  conceptLabels,
  skillLabels,
  applicationLabels,
  thinkingLabels,
  commonErrorLabels,
})
