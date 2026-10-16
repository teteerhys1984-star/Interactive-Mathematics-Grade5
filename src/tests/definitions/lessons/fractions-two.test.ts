import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/** Unit 2, Lesson 5 «الكسور (2)»: 20 original questions (6 basic, 7 medium, 4 advanced, 3 thinking). Solutions stay locked until submission. */
const testId = 'lesson-fractions-two-test'
const lessonId = 'fractions-two'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })

const questions: QuestionDefinition[] = [
  // ─────────────── BASIC · 6 ───────────────
  q(1, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('العبارة صحيحة أم خاطئة: العدد '), math('3 1/2'), text(' كسر مركب.')),
    concepts: ['mixed-form'], skills: ['identify-mixed'], sourceConcepts: ['classify-source'],
    answer: true,
    solution: { idea: rich(text('الكسر المركب يبدأ بعدد صحيح يليه كسر عادي أصغر من 1.')), steps: [rich(text('قبل الكسر 1/2 يوجد العدد الصحيح 3.')), rich(text('إذن العدد مركب.'))], finalAnswer: rich(text('العبارة صحيحة.')), commonError: rich(text('الظن بأن كل كسر فيه عدد بالقرب من الفاصلة يُعد عادياً.')) },
    originalityNote: 'عبارة صحّ/خطأ بعدد مركب جديد (3 1/2) لا يرد بنص السؤال المطبوع.',
  }),
  q(2, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أي الكسور التالية أصغر من 1؟')),
    concepts: ['proper-improper'], skills: ['compare-with-one'], sourceConcepts: ['compare-one-source'],
    options: [option('q02-a', math('7/4')), option('q02-b', math('4/4')), option('q02-c', math('3/8')), option('q02-d', math('12/5'))],
    answer: 'q02-c',
    solution: { idea: rich(text('الكسر أصغر من 1 إذا كان بسطه أصغر من مقامه.')), steps: [rich(math('3 < 8')), rich(text('الكسرات الأخرى بسطها أكبر من أو يساوي مقامها.'))], finalAnswer: rich(math('3/8'), text(' أصغر من 1.')), commonError: rich(text('اختيار 4/4 لأن البسط والمقام عدد واحد يبدو كبيراً.')) },
    originalityNote: 'أرقام جديدة (3/8) وخيارات تتضمن كسراً مساوياً للواحد وكسراً أكبر منه.',
  }),
  q(3, {
    type: 'fraction', difficulty: 'basic',
    prompt: rich(text('حوّل العدد المركب '), math('2 1/4'), text(' إلى كسر عادي واحد.')),
    concepts: ['mixed-form', 'conversion'], skills: ['mixed-to-improper'], sourceConcepts: ['to-improper-source'],
    answer: { numerator: '9', denominator: '4', equivalentForms: 'accept' },
    solution: { idea: rich(text('نضرب العدد الصحيح في المقام ثم نضيف البسط.')), rule: rich(text('(w × d + n) ÷ d')), steps: [rich(math('2 × 4 + 1 = 9'))], finalAnswer: rich(math('9/4')), commonError: rich(text('كتابة 3/4 بجمع البسط والمقام أو بإهمال العدد الصحيح.')) },
    originalityNote: 'تحويل جديد (2 1/4) بقيم غير واردة في تدريبات الصفحة 60.',
  }),
  q(4, {
    type: 'fraction', difficulty: 'basic',
    prompt: rich(text('ما الكسر العادي الذي يكافئ '), math('3 2/5'), text('؟')),
    concepts: ['mixed-form', 'conversion'], skills: ['mixed-to-improper'], sourceConcepts: ['to-improper-source'],
    answer: { numerator: '17', denominator: '5', equivalentForms: 'accept' },
    solution: { idea: rich(text('المقام يبقى 5، والعدد الصحيح يُحوَّل إلى أجزاء من المقام نفسه.')), steps: [rich(math('3 × 5 = 15')), rich(math('15 + 2 = 17'))], finalAnswer: rich(math('17/5')), commonError: rich(text('كتابة 32/5 بلصق العدد الصحيح بجانب البسط.')) },
    originalityNote: 'عدد مركب جديد بمقام 5 (3 2/5)، ويُختبر فيه الضرب ثم الجمع.',
  }),
  q(5, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('العبارة صحيحة أم خاطئة: '), math('7/4 > 1'), text(' لأن بسط الكسر أكبر من مقامه.')),
    concepts: ['compare-to-one'], skills: ['compare-with-one'], sourceConcepts: ['compare-one-source'],
    answer: true,
    solution: { idea: rich(text('إذا كان البسط أكبر من المقام فإن الكسر أكبر من 1.')), steps: [rich(math('7 > 4')), rich(text('إذن الكسر أكبر من 1.'))], finalAnswer: rich(text('العبارة صحيحة.')), commonError: rich(text('مقارنة 7 بـ 1 وإهمال المقام.')) },
    originalityNote: 'عبارة صحّ/خطأ تربط تبرير المقارنة بالواحد بالبسط والمقام.',
  }),
  q(6, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أي الكسور التالية يساوي 1؟')),
    concepts: ['compare-to-one'], skills: ['compare-with-one'], sourceConcepts: ['compare-one-source'],
    options: [option('q06-a', math('5/6')), option('q06-b', math('6/5')), option('q06-c', math('13/13')), option('q06-d', math('13/12'))],
    answer: 'q06-c',
    solution: { idea: rich(text('الكسر يساوي 1 إذا كان بسطه مساوياً لمقامه.')), steps: [rich(math('13 = 13')), rich(text('الكسر الآخر بسطه ومقامه مختلفان.'))], finalAnswer: rich(math('13/13 = 1')), commonError: rich(text('اعتبار 13/12 مساوياً للواحد لأن الفرق صغير.')) },
    originalityNote: 'أرقام جديدة (13) بخيارات تختبر تساوي البسط والمقام لا قيمتهما الكبيرة.',
  }),

  // ─────────────── MEDIUM · 7 ───────────────
  q(7, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('أي كسر مركب يكافئ '), math('17/5'), text('؟')),
    concepts: ['conversion', 'division-remainder'], skills: ['improper-to-mixed'], sourceConcepts: ['to-mixed-source'],
    options: [option('q07-a', math('5 2/17')), option('q07-b', math('17 2/5')), option('q07-c', math('3 2/5')), option('q07-d', math('2 5/17'))],
    answer: 'q07-c',
    solution: { idea: rich(text('نقسم البسط على المقام: خارج القسمة هو العدد الصحيح، والباقي هو البسط.')), steps: [rich(math('17 ÷ 5 = 3')), rich(math('17 − 15 = 2')), rich(text('إذن الباقي 2 والكسر المركب 3 2/5.'))], finalAnswer: rich(math('17/5 = 3 2/5')), commonError: rich(text('عكس البسط والمقام، أو جعل المقام العدد الصحيح.')) },
    originalityNote: 'تحويل جديد (17/5) تُعرض فيه الخيارات عكساً وتبديلاً للقيم.',
  }),
  q(8, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('ما الشكل المركب للكسر '), math('61/56'), text('؟')),
    concepts: ['conversion', 'division-remainder'], skills: ['improper-to-mixed'], sourceConcepts: ['to-mixed-source'],
    options: [option('q08-a', math('6 1/56')), option('q08-b', math('1 5/56')), option('q08-c', math('5 1/56')), option('q08-d', math('1 56/5'))],
    answer: 'q08-b',
    solution: { idea: rich(text('خارج القسمة 1 لأن 56 مرة واحدة تقع في 61، والباقي 5.')), steps: [rich(math('61 ÷ 56 = 1')), rich(math('61 − 56 = 5')), rich(text('إذن الكسر المركب 1 5/56.'))], finalAnswer: rich(math('61/56 = 1 5/56')), commonError: rich(text('كتابة الباقي عدداً صحيحاً قبل الكسر بدل كونه البسط.')) },
    originalityNote: 'حالة قريبة من الواحد (61/56) تختبر أن خارج القسمة قد يكون 1.',
  }),
  q(9, {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب الأعداد من الأصغر إلى الأكبر (عادية ومركبة معاً).')),
    concepts: ['fraction-ordering', 'mixed-form'], skills: ['order-fractions'], sourceConcepts: ['to-improper-source'],
    items: [option('q09-a', math('2 1/4')), option('q09-b', math('7/4')), option('q09-c', math('3/4')), option('q09-d', math('3 1/2'))],
    answer: ['q09-c', 'q09-b', 'q09-a', 'q09-d'],
    solution: { idea: rich(text('نحوّل الكل إلى كسر عادي بالمقام نفسه، أو نقارن الأعداد الصحيحة أولاً.')), steps: [rich(math('3/4 < 7/4')), rich(math('7/4 = 1 3/4 < 2 1/4')), rich(math('2 1/4 < 3 1/2'))], finalAnswer: rich(math('3/4 < 7/4 < 2 1/4 < 3 1/2')), commonError: rich(text('ترتيب 7/4 قبل 3/4 لأن 7 أكبر من 3 وتجاهل المقامات.')) },
    originalityNote: 'مجموعة مختلطة جديدة تجمع كسراً عادياً وكسرين مركبين بقيم لا تكرر الكتاب.',
  }),
  q(10, {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابِق كل كسر عادي مع الكسر المركب المكافئ له.')),
    concepts: ['conversion'], skills: ['match-conversions'], sourceConcepts: ['to-mixed-source'],
    left: [option('q10-l1', math('11/4')), option('q10-l2', math('19/3')), option('q10-l3', math('13/6')), option('q10-l4', math('22/5'))],
    right: [option('q10-r1', math('2 3/4')), option('q10-r2', math('6 1/3')), option('q10-r3', math('2 1/6')), option('q10-r4', math('4 2/5'))],
    answer: [{ leftId: 'q10-l1', rightId: 'q10-r1' }, { leftId: 'q10-l2', rightId: 'q10-r2' }, { leftId: 'q10-l3', rightId: 'q10-r3' }, { leftId: 'q10-l4', rightId: 'q10-r4' }],
    solution: { idea: rich(text('كل كسر عادي يُقسم بسطه على مقامه، ثم نطابق الخارج والباقي.')), steps: [rich(math('11 = 4 × 2 + 3')), rich(math('19 = 3 × 6 + 1')), rich(math('13 = 6 × 2 + 1')), rich(math('22 = 5 × 4 + 2'))], finalAnswer: rich(text('الأزواج: 11/4 مع 2 3/4، و19/3 مع 6 1/3، و13/6 مع 2 1/6، و22/5 مع 4 2/5.')), commonError: rich(text('تغيير المقام عند التحويل، فيُكتب 2 3/4 بمقام 3 مثلاً.')) },
    originalityNote: 'أزواج مطابقة جديدة بمقامات 4 و3 و6 و5، غير موجودة في تحقق الصفحة 60.',
  }),
  q(11, {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر جميع الكسور المركبة التي تساوي '), math('5/2'), text('.')),
    concepts: ['conversion', 'mixed-form'], skills: ['match-conversions'], sourceConcepts: ['to-improper-source'],
    options: [option('q11-a', math('2 1/2')), option('q11-b', math('2 2/4')), option('q11-c', math('5 2/5')), option('q11-d', math('3 1/2'))],
    answer: ['q11-a', 'q11-b'],
    solution: { idea: rich(text('نحوّل كل مركب إلى كسر عادي ثم نقارنه بـ 5/2.')), steps: [rich(math('2 × 2 + 1 = 5 ⇒ 5/2')), rich(math('2 × 4 + 2 = 10 ⇒ 10/4 = 5/2')), rich(math('5 × 5 + 2 = 27 ⇒ 27/5 ≠ 5/2')), rich(math('3 × 2 + 1 = 7 ⇒ 7/2 ≠ 5/2'))], finalAnswer: rich(math('2 1/2'), text(' و'), math('2 2/4'), text(' يساويان 5/2.')), commonError: rich(text('اعتبار 2 2/4 غير مكافئ لأن مقامه ليس 2.')) },
    originalityNote: 'خيارات مكافئة بمقام غير مختصر (2 2/4) لتفادي حفظ الشكل المختصر فقط.',
  }),
  q(12, {
    type: 'error-analysis', difficulty: 'medium',
    prompt: rich(text('حوّل أحمد الكسر '), math('5/3'), text(' إلى كسر مركب، فكتب:')),
    concepts: ['conversion', 'division-remainder'], skills: ['diagnose-error'], sourceConcepts: ['to-mixed-source'],
    coverage: { thinking: ['diagnose'], commonErrors: ['subtract-not-divide'] },
    studentWork: rich(text('أحمد: «5 − 3 = 2، والباقي 1، إذن '), math('5/3 = 2 1/3'), text('».')),
    diagnoses: [
      optionText('q12-d1', 'طرح المقام من البسط بدلاً من قسمة البسط على المقام.'),
      optionText('q12-d2', 'نسي أن المقام يجب أن يكون أكبر من البسط.'),
      optionText('q12-d3', 'كتب الكسر بالمقام الخطأ عند التحويل.'),
      optionText('q12-d4', 'لم يبسّط الكسر النهائي.'),
    ],
    corrections: [option('q12-c1', math('1 2/3')), option('q12-c2', math('2 1/3')), option('q12-c3', math('1 3/5')), option('q12-c4', math('5 1/3'))],
    answer: { diagnosisId: 'q12-d1', correctionId: 'q12-c1' },
    solution: { idea: rich(text('الكسر المركب يأتي من القسمة مع الباقي، لا من الطرح.')), rule: rich(text('البسط ÷ المقام: خارج القسمة عدد صحيح، والباقي بسط جديد فوق المقام نفسه.')), steps: [rich(math('5 ÷ 3 = 1')), rich(math('5 − 3 = 2')), rich(text('الباقي من القسمة هو 2، إذن الكسر 1 2/3.'))], finalAnswer: rich(math('5/3 = 1 2/3')), commonError: rich(text('طرح المقام من البسط يعطي عدداً لا علاقة له بالقسمة.')) },
    originalityNote: 'خطأ جديد: طرح المقام من البسط بدل القسمة، بقيمة 5/3 غير واردة في المصدر.',
  }),
  q(13, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('عند تحويل '), math('61/56'), text(' إلى كسر مركب، ما الباقي من القسمة؟')),
    concepts: ['division-remainder'], skills: ['divide-remainder'], sourceConcepts: ['to-mixed-source'],
    answer: { expected: '5', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: { idea: rich(text('الباقي هو البسط الجديد في الكسر المركب.')), steps: [rich(math('61 − 56 = 5'))], finalAnswer: rich(text('الباقي 5.')), commonError: rich(text('الخلط بين الباقي وخارج القسمة، فيُكتب 1.')) },
    originalityNote: 'حساب باقٍ جديد بنفس الكسر المعروض في سؤال المصدر لكنه يسأل عن الباقي لا عن الشكل النهائي.',
  }),

  // ─────────────── ADVANCED · 4 ───────────────
  q(14, {
    type: 'true-false', difficulty: 'advanced',
    prompt: rich(text('العبارة صحيحة أم خاطئة: '), math('9/4 = 2 1/4'), text(' لأن '), math('9 ÷ 4 = 2'), text(' والباقي 1.')),
    concepts: ['conversion', 'division-remainder'], skills: ['improper-to-mixed'], sourceConcepts: ['to-mixed-source'],
    answer: true,
    solution: { idea: rich(text('القسمة مع الباقي تعطي الكسر المركب.')), steps: [rich(math('9 = 4 × 2 + 1')), rich(text('إذن الكسر المركب 2 1/4.'))], finalAnswer: rich(text('العبارة صحيحة.')), commonError: rich(text('الظن بأن الباقي يصبح المقام الجديد.')) },
    originalityNote: 'عبارة تبرير صحيحة تربط القسمة مع الباقي بالكسر المركب، وليست نسخة من المثال المطبوع.',
  }),
  q(15, {
    type: 'fraction', difficulty: 'advanced',
    prompt: rich(text('أي كسر عادي يمثل العدد المركب '), math('10 2/5'), text('؟')),
    concepts: ['mixed-form', 'conversion'], skills: ['mixed-to-improper'], sourceConcepts: ['to-improper-source'],
    answer: { numerator: '52', denominator: '5', equivalentForms: 'accept' },
    solution: { idea: rich(text('العدد الصحيح 10 يُكتب في أجزاء من 5، ثم نضيف الجزأين.')), steps: [rich(math('10 × 5 = 50')), rich(math('50 + 2 = 52'))], finalAnswer: rich(math('52/5')), commonError: rich(text('كتابة 102/5 بسبب لصق الصفر من 10 أو ضرب خاطئ.')) },
    originalityNote: 'عدد مركب بعدد صحيح من خانتين (10) يختبر ترتيب الضرب والجمع.',
  }),
  q(16, {
    type: 'single-choice', difficulty: 'advanced',
    prompt: rich(text('قالب حلوى مقسّم إلى 8 قطع متساوية، توزّعه أمّ على أولادها الثلاثة بالتساوي. ما نصيب الولد الواحد من القالب بالقطع؟ ')),
    concepts: ['division-remainder', 'conversion'], skills: ['improper-to-mixed'], sourceConcepts: ['applications-source'],
    coverage: { applications: ['cake-share'] },
    options: [option('q16-a', math('2 2/3')), option('q16-b', math('2 3/8')), option('q16-c', math('3 2/8')), option('q16-d', math('8 1/3'))],
    answer: 'q16-a',
    solution: { idea: rich(text('نقسم 8 قطع على 3 أولاد: خارج القسمة 2 والباقي 2.')), steps: [rich(math('8 ÷ 3 = 2')), rich(math('8 − 6 = 2')), rich(text('الباقي 2 يُوزَّع على 3 أجزاء، فيكون نصيب كل ولد 2 2/3 قطعة.'))], finalAnswer: rich(math('8/3 = 2 2/3'), text(' قطعة لكل ولد.')), commonError: rich(text('جعل المقام 8 (القطع الكلية) بدل عدد الأولاد 3.')) },
    originalityNote: 'مسألة توزيع جديدة بعدد قطع 8 وثلاثة أولاد، ولا تطابق تمرين الكتاب بالنص أو الأرقام.',
  }),
  q(17, {
    type: 'fraction', difficulty: 'advanced',
    prompt: rich(text('عبّر عن '), math('4 5/9'), text(' بكسر عادي واحد بمقام 9.')),
    concepts: ['mixed-form', 'conversion'], skills: ['mixed-to-improper'], sourceConcepts: ['to-improper-source'],
    answer: { numerator: '41', denominator: '9', equivalentForms: 'accept' },
    solution: { idea: rich(text('نضرب العدد الصحيح في المقام ثم نضيف البسط.')), steps: [rich(math('4 × 9 = 36')), rich(math('36 + 5 = 41'))], finalAnswer: rich(math('41/9')), commonError: rich(text('كتابة 20/9 بضرب 4 في 5 بدل ضرب 4 في 9.')) },
    originalityNote: 'تحويل جديد بمقام 9 يختبر ضرب العدد الصحيح في المقام لا في البسط.',
  }),

  // ─────────────── THINKING · 3 ───────────────
  q(18, {
    type: 'single-choice', difficulty: 'thinking',
    prompt: rich(text('برّر أيّ العبارات التالية صحيحاً: '), math('39/4 = 9 3/4'), text('.')),
    concepts: ['conversion', 'division-remainder'], skills: ['justify'], sourceConcepts: ['thinking-source'],
    coverage: { thinking: ['justify'] },
    options: [
      option('q18-a', math('39 = 9 × 4 + 3'), text('، فيكون الكسر '), math('9 3/4'), text('.')),
      option('q18-b', text('لأن 39 أكبر من 4، إذن العدد الصحيح 39.')),
      option('q18-c', text('لأن 9 + 4 = 13، إذن الكسر '), math('9 3/4'), text('.')),
      option('q18-d', text('لا يمكن التحقق لأن المقام لا يقسم البسط.')),
    ],
    answer: 'q18-a',
    solution: { idea: rich(text('التبرير الصحيح يعيد الكسر إلى صورة القسمة مع الباقي.')), steps: [rich(math('9 × 4 = 36')), rich(math('36 + 3 = 39')), rich(text('إذن 39/4 = 9 3/4.'))], finalAnswer: rich(text('التبرير الأول صحيح.')), commonError: rich(text('إعطاء تبرير لفظي لا يتحقق من الجمع.')) },
    originalityNote: 'سؤال تبرير يقيّم الربط بين القسمة والكسر المركب، لا مجرد استخراج الناتج.',
  }),
  q(19, {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('حوّلت ريم الكسر المركب '), math('3 2/5'), text(' إلى كسر عادي، فكتبت:')),
    concepts: ['mixed-form', 'conversion'], skills: ['diagnose-error'], sourceConcepts: ['thinking-source'],
    coverage: { thinking: ['diagnose'], commonErrors: ['concatenate-parts'] },
    studentWork: rich(text('ريم: «ألصقت العدد 3 بجانب البسط 2، فصار '), math('32/5'), text('».')),
    diagnoses: [
      optionText('q19-d1', 'لصقت العدد الصحيح بجانب البسط بدل ضربه في المقام ثم الجمع.'),
      optionText('q19-d2', 'ضربت البسط في المقام بدل إضافة العدد الصحيح.'),
      optionText('q19-d3', 'غيّرت المقام إلى العدد الصحيح.'),
      optionText('q19-d4', 'لا يوجد خطأ؛ الناتج صحيح.'),
    ],
    corrections: [option('q19-c1', math('17/5')), option('q19-c2', math('32/5')), option('q19-c3', math('15/5')), option('q19-c4', math('3/10'))],
    answer: { diagnosisId: 'q19-d1', correctionId: 'q19-c1' },
    solution: { idea: rich(text('العدد الصحيح يُحسب بالأجزاء من المقام نفسه قبل إضافة البسط.')), rule: rich(text('(w × d + n) ÷ d')), steps: [rich(math('3 × 5 = 15')), rich(math('15 + 2 = 17')), rich(text('إذن الكسر العادي هو 17/5.'))], finalAnswer: rich(math('3 2/5 = 17/5')), commonError: rich(text('ربط الأرقام كتابةً بدل إجراء العملية.')) },
    originalityNote: 'خطأ الصق-الأرقام في الكسر المركب (3 2/5) لم يرد كمثال في الكتاب.',
  }),
  q(20, {
    type: 'multi-select', difficulty: 'thinking',
    prompt: rich(text('اختر جميع العبارات الصحيحة.')),
    concepts: ['mixed-form', 'proper-improper'], skills: ['justify'], sourceConcepts: ['thinking-source'],
    coverage: { thinking: ['justify'] },
    options: [
      option('q20-a', text('كل عدد صحيح يمكن كتابته ككسر مقامه 1.')),
      option('q20-b', text('الكسر المركب أكبر من 1 دائماً.')),
      option('q20-c', text('كل كسر عادي أصغر من 1.')),
      option('q20-d', math('8/4'), text(' كسر مركب.')),
    ],
    answer: ['q20-a', 'q20-b'],
    solution: { idea: rich(text('نفحص كل عبارة بالتعريف: المركب فيه عدد صحيح موجب مع كسر موجب.')), steps: [rich(math('5 = 5/1')), rich(text('المركب يحوي عدداً صحيحاً على الأقل 1 مع كسر موجب، لذلك أكبر من 1.')), rich(math('8/4 = 2'), text(' وهو كسر عادي، والعبارة الثالثة خاطئة لأن '), math('7/4'), text(' أكبر من 1.'))], finalAnswer: rich(text('العبارتان الأولى والثانية صحيحتان.')), commonError: rich(text('اعتبار كل كسر عادي أصغر من 1، أو اعتبار 8/4 مركباً لأنه أكبر من 1.')) },
    originalityNote: 'عبارات تفكير تختبر التعريف (الكسر المركب، والكسر العادي، والعدد الصحيح) لا الحساب فقط.',
  }),
]

const sourceConcepts = [
  { id: 'classify-source', label: 'تمييز الكسر العادي من الكسر المركب', pages: [59, 60] as const },
  { id: 'compare-one-source', label: 'مقارنة الكسر بالواحد من بسطه ومقامه', pages: [58, 59] as const },
  { id: 'to-mixed-source', label: 'كتابة الكسر العادي الأكبر من 1 بشكل مركب بالقسمة', pages: [59, 60] as const },
  { id: 'to-improper-source', label: 'كتابة الكسر المركب بشكل عادي', pages: [60, 61] as const },
  { id: 'applications-source', label: 'تطبيقات الكسور المركبة في مسائل لفظية', pages: [61] as const },
  { id: 'thinking-source', label: 'تبرير التحويل وتحليل أخطائه', pages: [59, 61] as const },
]

const conceptLabels: Record<string, string> = {
  'mixed-form': 'تركيب العدد الكسري المركب',
  'proper-improper': 'الكسر الأصغر من 1 والأكبر من 1',
  'compare-to-one': 'مقارنة الكسر بالواحد',
  'fraction-ordering': 'ترتيب الكسور العادية والمركبة',
  conversion: 'التحويل بين الكسر العادي والمركب',
  'division-remainder': 'القسمة مع الباقي لكتابة المركب',
}
const skillLabels: Record<string, string> = {
  'identify-mixed': 'التعرّف إلى الكسر المركب',
  'compare-with-one': 'تبرير المقارنة بالواحد',
  'mixed-to-improper': 'كتابة المركب ككسر عادي',
  'improper-to-mixed': 'كتابة العادي كمركب',
  'order-fractions': 'ترتيب كسور عادية ومركبة',
  'match-conversions': 'مطابقة التحويلات الصحيحة',
  'diagnose-error': 'تحليل خطأ في التحويل',
  'divide-remainder': 'استخراج الباقي من القسمة',
  justify: 'تبرير العبارات الرياضية',
}
const applicationLabels: Record<string, string> = {
  'cake-share': 'توزيع قالب حلوى على أولاد بالتساوي',
}
const thinkingLabels: Record<string, string> = {
  justify: 'اختيار تبرير رياضي صالح',
  diagnose: 'تحليل خطأ في تحويل كسر',
}
const commonErrorLabels: Record<string, string> = {
  'subtract-not-divide': 'طرح المقام من البسط بدل القسمة',
  'concatenate-parts': 'لصق العدد الصحيح بالبسط بدل الجمع بعد الضرب',
}

export default defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار الكسور (2)',
  description: rich(text('اختبار مستقل من 20 سؤالاً في التمييز بين الكسر العادي والمركب، وتحويل كل منهما إلى الآخر، والمقارنة بالواحد، وتحليل الأخطاء.')),
  instructions: rich(text('أجب عن الأسئلة العشرين ثم سلّم المحاولة لعرض النتيجة. لا تظهر حلول الأسئلة أو الإجابات النهائية قبل التسليم. عند كتابة الكسر المركب، اجعل الباقي بسطاً فوق المقام نفسه.')),
  questions,
  sourceConcepts,
  conceptLabels,
  skillLabels,
  applicationLabels,
  thinkingLabels,
  commonErrorLabels,
})
