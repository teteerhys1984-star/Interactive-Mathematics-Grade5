import { math, rich, text, textOnly } from '../../lessonTestBuilder'
import { defineUnitTest, unitQuestion, type UnitQuestionDraft } from '../../unitTestBuilder'
import type { QuestionDefinition } from '../../types'

/**
 * Unit 2 test — الوحدة الثانية (الدروس 1–10، صفحات 44–84).
 *
 * Sixty brand-new questions written for this test only. Coverage (primary lesson):
 *   مقارنة الأعداد وترتيبها 6 · ضرب الأعداد الطبيعية 6 · المضاعف المشترك الأصغر 6 ·
 *   الكسور (1) 6 · الكسور (2) 6 · الأجزاء العشرية (1) 6 · الأجزاء العشرية (2) 6 ·
 *   الأجزاء العشرية (3) 6 · المستطيل 6 · المربّع 6
 * Each lesson owns six questions, so every lesson is covered at least four times.
 * Difficulty: 16 basic · 22 medium · 14 advanced · 8 thinking.
 *
 * The test only becomes visible to learners while unit-2 is explicitly marked complete; it lives
 * outside every lesson (its own route under #tests) and duplicates no lesson-test prompt.
 */

const testId = 'unit-unit-2-test'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, lessonIds: readonly string[], draft: UnitQuestionDraft) =>
  unitQuestion(testId, lessonIds, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })

const COMPARE = 'compare-order-natural-numbers'
const MULTIPLY = 'multiply-natural-numbers'
const LCM = 'least-common-multiple'
const FRACTIONS_ONE = 'fractions-one'
const FRACTIONS_TWO = 'fractions-two'
const TENTHS = 'tenths-one'
const HUNDREDTHS = 'decimal-parts-two'
const THOUSANDTHS = 'decimal-parts-three'
const RECTANGLE = 'rectangle'
const SQUARE = 'square'

const CM_UNITS = ['cm', 'سم', 'centimeter', 'centimeters', 'سنتيمتر', 'سنتيمترات']
const DEGREE_UNITS = ['°', 'degree', 'degrees', 'درجة', 'درجات']

const questions: QuestionDefinition[] = [
  /* ============================================================ الدرس 1: المقارنة والترتيب */
  q(1, [COMPARE], {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ الزوجين فيه العدد الأيمن أصغر من العدد الأيسر؟')),
    concepts: ['compare-by-place-value'], skills: ['compare-multi-digit'], sourceConcepts: ['u2-compare-place-value'],
    coverage: { commonErrors: ['compare-by-digits-count-only'] },
    options: [
      optionText('q01-a', '4,780,000 و 4,708,000'),
      optionText('q01-b', '5,009,000 و 5,090,000'),
      optionText('q01-c', '3,420,000 و 3,402,000'),
      optionText('q01-d', '6,300,000 و 6,030,000'),
    ],
    answer: 'q01-b',
    solution: {
      idea: rich(text('نقارن الأعداد العاديّة المجاورة من أرقامها ابتداءً من اليسار.')),
      rule: rich(text('عند تساوي عدد المنازل نقارن قيمة كلّ منزلة من اليسار إلى اليمين.')),
      steps: [
        rich(text('في الخيار ب: '), math('5,009,000'), text(' و'), math('5,090,000'), text(' متساويان في أوّل ثلاث منازل.')),
        rich(text('المنزلة التالية عشرات الألوف: صفر في الأوّل مقابل 9 في الثاني، فالأول أصغر.')),
        rich(text('بقية الخيارات فيها الأيمن أكبر.')),
      ],
      finalAnswer: rich(math('5,009,000 < 5,090,000')),
      commonError: rich(text('مقارنة عدد الأرقام بدل قيم المنازل.')),
    },
    originalityNote: 'يقدّم أربعة أزواج متقاربة جداً في المنازل بدل سؤال مقارنة مباشر، وموضع الصحيح هو الثاني بعد دوران المواضع.',
  }),
  q(2, [COMPARE], {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('العدد '), math('7,099,999'), text(' أصغر من العدد '), math('7,100,000'), text('.')),
    concepts: ['compare-by-place-value'], skills: ['compare-multi-digit'], sourceConcepts: ['u2-compare-place-value'],
    coverage: { commonErrors: ['compare-by-digits-count-only'] },
    answer: true,
    solution: {
      idea: rich(text('مقارنة منزلة الملايين ثم العشرات الآلاف.')),
      rule: rich(text('تساوي منزلة الملايين يوجب الانتقال إلى المنزلة التالية.')),
      steps: [
        rich(text('العددان متساويان في منزلة الملايين (7).')),
        rich(text('في العشرات الآلاف: صفر مقابل 1، إذن الأول أصغر.')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('الحكم بأن العدد ذا الأرقام الأكثر (أو الأقل) هو الأصغر دون مقارنة المنازل.')),
    },
    originalityNote: 'يختار عدداً على حدّ الانتقال بين مليون واثنين (7,099,999 و7,100,000) بدل الأمثلة المستديرة المطبوعة.',
  }),
  q(3, [COMPARE], {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب الأعداد الآتية تصاعدياً (من الأصغر إلى الأكبر).')),
    concepts: ['order-ascending-descending'], skills: ['order-three-numbers'], sourceConcepts: ['u2-compare-order'],
    items: [
      optionText('q03-a', '2,305,000'),
      optionText('q03-b', '2,350,000'),
      optionText('q03-c', '2,035,000'),
    ],
    answer: ['q03-c', 'q03-a', 'q03-b'],
    solution: {
      idea: rich(text('الأعداد الثلاثة متساوية في عدد المنازل، فنقارن منزلة منزلة.')),
      steps: [
        rich(text('منزلة مئات الألوف: 0 في '), math('2,035,000'), text('، و3 في الآخرين.')),
        rich(text('بين '), math('2,305,000'), text(' و'), math('2,350,000'), text(' منزلة عشرات الألوف: 0 مقابل 5.')),
      ],
      finalAnswer: rich(math('2,035,000 < 2,305,000 < 2,350,000')),
      commonError: rich(text('الترتيب بقراءة الأرقام كلمة واحدة دون احترام قيمة المنزلة.')),
    },
    originalityNote: 'يستعمل ثلاثة أعداد متقاربة في المنازل الداخلية بدل الأعداد المتباعدة، ويطلب الترتيب لا المقارنة.',
  }),
  q(4, [COMPARE], {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر كلّ عددٍ أكبر من '), math('3,450,000'), text('.')),
    concepts: ['compare-by-place-value'], skills: ['compare-multi-digit'], sourceConcepts: ['u2-compare-place-value'],
    options: [
      optionText('q04-a', '3,405,000'),
      optionText('q04-b', '3,504,000'),
      optionText('q04-c', '3,455,000'),
      optionText('q04-d', '3,449,999'),
    ],
    answer: ['q04-b', 'q04-c'],
    solution: {
      idea: rich(text('نبحث عن الأعداد التي تزيد في منزلة من المنازل الداخلية.')),
      steps: [
        rich(text('منزلة عشرات الألوف في الأصل 5؛ '), math('3,405,000'), text(' فيه 0 و'), math('3,455,000'), text(' فيه 5 مع زيادة في المئات.')),
        rich(math('3,504,000'), text(' أكبر لأن مئات الألوف 5، و'), math('3,449,999'), text(' أصغر.' )),
      ],
      finalAnswer: rich(math('3,504,000'), text(' و'), math('3,455,000')),
      commonError: rich(text('اعتبار العدد الأقرب شكلاً هو الأكبر.')),
    },
    originalityNote: 'يقيس المقارنة عند حدود المنزلة نفسها بأربعة أعداد شديدة التقارب، وهو ما لا تطلبه تمارين ص 44–47 مباشرة.',
  }),
  q(5, [COMPARE], {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('قال طالب: «العدد '), math('985,000'), text(' أكبر من '), math('1,020,000'), text(' لأن أرقامه أكبر». اختر التشخيص والتصحيح.')),
    concepts: ['compare-by-place-value'], skills: ['diagnose-comparison-error'], sourceConcepts: ['u2-compare-place-value'],
    coverage: { commonErrors: ['compare-by-digits-count-only'], thinking: ['evaluate-comparison-reasoning'] },
    studentWork: rich(text('985,000 > 1,020,000'), text(' لأن 985 أكبر من 1,020')),
    diagnoses: [
      optionText('q05-d1', 'قارن الرقمين بلا اعتبار عدد المنازل، والعدد ذو المنازل الأكثر هو الأكبر'),
      optionText('q05-d2', 'الخطأ في الترتيب التنازلي فقط، والمقارنة صحيحة'),
    ],
    corrections: [
      optionText('q05-c1', '1,020,000 > 985,000 لأن له منزلة ملايين'),
      optionText('q05-c2', '985,000 > 1,020,000 لأن 985 له ثلاثة أرقام'),
    ],
    answer: { diagnosisId: 'q05-d1', correctionId: 'q05-c1' },
    solution: {
      idea: rich(text('عدد المنازل شرط أوّلي قبل مقارنة الأرقام.')),
      rule: rich(text('العدد ذو المنازل الأكثر أكبر، وعند التساوي نقارن المنازل من اليسار.')),
      steps: [
        rich(text('العدد '), math('1,020,000'), text(' يتكوّن من سبع منازل، و'), math('985,000'), text(' من ستّ.')),
        rich(text('إذن الأكبر هو '), math('1,020,000'), text(' رغم أن 985 أكبر من 1,020 كعدد مجرّد.')),
      ],
      finalAnswer: rich(text('التشخيص: إهمال عدد المنازل؛ والتصحيح: '), math('1,020,000 > 985,000'), text('.')),
      commonError: rich(text('مقارنة الأرقام بوصفها أعداداً مستقلّة.')),
    },
    originalityNote: 'يحلّل خطأ المقارنة عند اختلاف عدد المنازل، وهو خطأ لم يُشخَّص في تمارين الكتاب بهذه الصيغة.',
  }),
  q(6, [COMPARE], {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('باستعمال الأرقام '), math('3, 0, 7, 9'), text(' مرة واحدة لكلّ رقم، ما أكبر عدد يمكن تكوينه من أربع منازل؟')),
    concepts: ['order-ascending-descending'], skills: ['build-largest-number'], sourceConcepts: ['u2-compare-order'],
    coverage: { thinking: ['reason-about-place-value'] },
    answer: { expected: '9730', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نضع أكبر رقم في أكبر منزلة، ثم الذي يليه، وهكذا.')),
      rule: rich(text('قيمة الرقم تتحدّد بمنزلته؛ فالمنزلة الأكبر تأخذ الرقم الأكبر.')),
      steps: [
        rich(text('الأرقام مرتّبة تنازلياً: '), math('9, 7, 3, 0'), text('.')),
        rich(text('نوزّعها على منازل الآلاف ثم المئات ثم العشرات ثم الآحاد.')),
      ],
      finalAnswer: rich(math('9730')),
      commonError: rich(text('وضع الصفر في منزلة الآلاف فيصبح العدد ثلاثي المنازل.')),
    },
    originalityNote: 'يحوّل مفهوم قيمة المنزلة إلى بناء أكبر عدد ممكن من أربعة أرقام، وهو تطبيق عكسي غير مطبوع في ص 44–47.',
  }),

  /* ============================================================ الدرس 2: الضرب */
  q(7, [MULTIPLY], {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('ما ناتج ضرب '), math('24'), text(' في '), math('300'), text('؟')),
    concepts: ['multiply-patterns'], skills: ['multiply-by-tens'], sourceConcepts: ['u2-multiply-patterns'],
    answer: { expected: '7200', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نضرب في 3 ثم نضيف صفري المئة.')),
      rule: rich(text('الضرب في 10 أو 100 أو 1000 يضيف أصفاراً بعد الناتج.')),
      steps: [
        rich(math('24 × 3 = 72')),
        rich(math('72 × 100 = 7200')),
      ],
      finalAnswer: rich(math('7200')),
      commonError: rich(text('إضافة صفر واحد فقط لأن أحد العاملين فيه صفر واحد ظاهر.')),
    },
    originalityNote: 'يستعمل نمط الضرب في المئة بضربين متتاليين (24 × 300) بدل الأمثلة المطبوعة المستديرة.',
  }),
  q(8, [MULTIPLY], {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('ناتج '), math('45 × 20'), text(' يساوي ناتج '), math('450 × 2'), text('.')),
    concepts: ['multiply-patterns'], skills: ['apply-multiplication-property'], sourceConcepts: ['u2-multiply-patterns'],
    answer: true,
    solution: {
      idea: rich(text('ننقل صفراً من عامل إلى آخر فيبقى الناتج ثابتاً.')),
      rule: rich(text('الضرب في 10 مع القسمة على 10 في العامل الآخر لا يغيّر الناتج.')),
      steps: [
        rich(math('45 × 20 = 900')),
        rich(math('450 × 2 = 900')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('الظن أن زيادة صفر في عامل تضاعف الناتج عشر مرات دائماً.')),
    },
    originalityNote: 'يختبر ثبات الناتج عند تحريك الصفر بين العاملين، وهو استنتاج غير مطبوع كسؤال في ص 48–51.',
  }),
  q(9, [MULTIPLY], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('اضرب العمود: '), math('37 × 24'), text('، ثم اكتب الناتج.')),
    concepts: ['multiplication-algorithm'], skills: ['multiply-two-digit'], sourceConcepts: ['u2-multiply-algorithm'],
    coverage: { commonErrors: ['forget-carry'] },
    answer: { expected: '888', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نضرب في الآحاد ثم في العشرات ونجمع الجزئيين.')),
      rule: rich(text('الضرب العمودي: ناتج الآحاد ثم ناتج العشرات مع إزاحة منزلة.')),
      steps: [
        rich(math('37 × 4 = 148')),
        rich(math('37 × 20 = 740')),
        rich(math('148 + 740 = 888')),
      ],
      finalAnswer: rich(math('888')),
      commonError: rich(text('نسيان الحمل عند ضرب الآحاد (28 يكتب 8 بلا حمل 2).')),
    },
    originalityNote: 'يستعمل ضرباً من رقمين برقمين بحمل صريح في الجزئيين، بأرقام ليست من أمثلة الكتاب.',
  }),
  q(10, [MULTIPLY], {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('أيّ تعبير يساوي '), math('8 × 102'), text(' بالاستعمال القانون التوزيعي؟')),
    concepts: ['multiplication-properties'], skills: ['apply-distributive'], sourceConcepts: ['u2-multiply-algorithm'],
    options: [
      optionText('q10-a', '8 × 100 + 8 × 2'),
      optionText('q10-b', '8 × 100 + 2'),
      optionText('q10-c', '8 × 100 × 2'),
      optionText('q10-d', '8 + 100 × 2'),
    ],
    answer: 'q10-a',
    solution: {
      idea: rich(text('نفكّك 102 إلى 100 + 2 ثم نوزّع الضرب على الجمع.')),
      rule: rich(text('a × (b + c) = a × b + a × c')),
      steps: [
        rich(math('102 = 100 + 2')),
        rich(math('8 × 102 = 8 × 100 + 8 × 2 = 800 + 16')),
      ],
      finalAnswer: rich(math('8 × 100 + 8 × 2 = 816')),
      commonError: rich(text('توزيع الضرب على الحدّ الأول فقط.')),
    },
    originalityNote: 'يطلب صيغة التوزيع صريحةً بدل حساب الناتج، ويضع موضع الصحيح أوّلاً في هذا السؤال بعد دوران المواضع.',
  }),
  q(11, [MULTIPLY], {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابق كلّ ضرب مع ناتجه.')),
    concepts: ['multiply-patterns'], skills: ['match-pattern'], sourceConcepts: ['u2-multiply-patterns'],
    left: [
      optionText('q11-l1', '7 × 10'),
      optionText('q11-l2', '7 × 100'),
      optionText('q11-l3', '7 × 1000'),
    ],
    right: [
      optionText('q11-r1', '700'),
      optionText('q11-r2', '70'),
      optionText('q11-r3', '7000'),
    ],
    answer: [
      { leftId: 'q11-l1', rightId: 'q11-r2' },
      { leftId: 'q11-l2', rightId: 'q11-r1' },
      { leftId: 'q11-l3', rightId: 'q11-r3' },
    ],
    solution: {
      idea: rich(text('عدد الأصفار المضافة يساوي عدد أصفار العامل.')),
      steps: [
        rich(text('×10 يضيف صفراً: '), math('70'), text('.')),
        rich(text('×100 يضيف صفرين: '), math('700'), text('.')),
        rich(text('×1000 يضيف ثلاثة أصفار: '), math('7000'), text('.')),
      ],
      finalAnswer: rich(text('70 ثم 700 ثم 7000.')),
      commonError: rich(text('عدّ الأصفار في العدد نفسه بالإضافة إلى أصفار العامل.')),
    },
    originalityNote: 'يحوّل جدول الأنماط المطبوع إلى مطابقة مبعثرة الترتيب بدل قراءة الصفوف جاهزة.',
  }),
  q(12, [MULTIPLY], {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('ضرب طالب '), math('46 × 23'), text(' فكتب '), math('828'), text('. اختر التشخيص والتصحيح.')),
    concepts: ['multiplication-algorithm'], skills: ['diagnose-carry-error'], sourceConcepts: ['u2-multiply-algorithm'],
    coverage: { commonErrors: ['forget-carry'] },
    studentWork: rich(text('46 × 3 = 128'), text(' ثم '), math('46 × 20 = 920'), text(' والجمع '), math('1048')),
    diagnoses: [
      optionText('q12-d1', 'نسي إزاحة منزلة العشرات، فجمع 138 + 92 بدل 138 + 920'),
      optionText('q12-d2', 'الخطأ في ضرب الآحاد فقط، أمّا الإزاحة فصحيحة'),
    ],
    corrections: [
      optionText('q12-c1', '46 × 23 = 1,058 بإزاحة ناتج العشرات منزلة واحدة'),
      optionText('q12-c2', '46 × 23 = 828 كما كتب الطالب'),
    ],
    answer: { diagnosisId: 'q12-d1', correctionId: 'q12-c1' },
    solution: {
      idea: rich(text('ناتج الضرب في العشرات لا يُكتب تحت الآحاد.')),
      rule: rich(text('نُزيح صفّ العشرات منزلة واحدة إلى اليسار قبل الجمع.')),
      steps: [
        rich(math('46 × 3 = 138')),
        rich(math('46 × 20 = 920')),
        rich(math('138 + 920 = 1,058')),
      ],
      finalAnswer: rich(text('التشخيص: إهمال إزاحة العشرات؛ والتصحيح: '), math('1,058'), text('.')),
      commonError: rich(text('جمع الجزئيين بلا إزاحة فتظهر منزلة ناقصة.')),
    },
    originalityNote: 'يشخّص خطأ الإزاحة في الضرب العمودي بأرقام جديدة، بدل تنفيذ الضرب المطبوع نفسه.',
  }),

  /* ============================================================ الدرس 3: المضاعف المشترك الأصغر */
  q(13, [LCM], {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('ما المضاعف المشترك الأصغر للعددين '), math('4'), text(' و'), math('6'), text('؟')),
    concepts: ['multiples-and-lcm'], skills: ['find-lcm-two'], sourceConcepts: ['u2-lcm'],
    answer: { expected: '12', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نكتب مضاعفات كلّ عدد حتّى أوّل مشترك.')),
      rule: rich(text('المضاعف المشترك الأصغر هو أصغر عدد يقبل القسمة على العددين.')),
      steps: [
        rich(text('مضاعفات 4: '), math('4, 8, 12, 16…')),
        rich(text('مضاعفات 6: '), math('6, 12, 18…')),
        rich(text('أوّل مشترك هو 12.')),
      ],
      finalAnswer: rich(math('12')),
      commonError: rich(text('ضرب العددين مباشرةً (24) بدل أصغر مشترك.')),
    },
    originalityNote: 'يستعمل زوجاً (4، 6) غير الوارد في أمثلة ص 52، ويطلب المضاعف نفسه لا أحد مضاعفاته.',
  }),
  q(14, [LCM], {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر كلّ عددٍ يقبل القسمة على '), math('3'), text('.')),
    concepts: ['multiples-and-lcm'], skills: ['identify-multiples'], sourceConcepts: ['u2-lcm'],
    options: [
      optionText('q14-a', '123'),
      optionText('q14-b', '124'),
      optionText('q14-c', '207'),
      optionText('q14-d', '212'),
    ],
    answer: ['q14-a', 'q14-c'],
    solution: {
      idea: rich(text('نفحص مجموع الأرقام لأن القسمة على 3 تعتمد عليه.')),
      rule: rich(text('العدد يقبل القسمة على 3 إذا كان مجموع أرقامه من مضاعفات 3.')),
      steps: [
        rich(math('1 + 2 + 3 = 6'), text(' ← يقبل القسمة.')),
        rich(math('2 + 0 + 7 = 9'), text(' ← يقبل القسمة.')),
        rich(math('1 + 2 + 4 = 7'), text(' و'), math('2 + 1 + 2 = 5'), text(' لا يقبلان.')),
      ],
      finalAnswer: rich(math('123'), text(' و'), math('207')),
      commonError: rich(text('الحكم من الرقم الأخير وحده.')),
    },
    originalityNote: 'يفحص مفهوم المضاعف عبر مجموع الأرقام بأعداد ثلاثة منازل، وهي صيغة استدلال لا ترد في تمارين ص 52–53.',
  }),
  q(15, [LCM], {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('أوجد أصغر عددٍ يقبل القسمة على '), math('6'), text(' وعلى '), math('8'), text(' معاً.')),
    concepts: ['multiples-and-lcm'], skills: ['find-lcm-two'], sourceConcepts: ['u2-lcm'],
    answer: { expected: '24', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نبحث في مضاعفات العدد الأكبر حتّى نجد مشتركاً.')),
      rule: rich(text('المضاعف المشترك الأصغر يقبل القسمة على العددين معاً.')),
      steps: [
        rich(text('مضاعفات 8: '), math('8, 16, 24, 32…')),
        rich(text('24 يقبل القسمة على 6 أيضاً.')),
      ],
      finalAnswer: rich(math('24')),
      commonError: rich(text('التوقّف عند 48 لأنه حاصل الضرب.')),
    },
    originalityNote: 'يطلب مضاعفاً مشتركاً أصغر لا يساوي حاصل ضرب العددين، فيكشف من يعتمد على الضرب المباشر.',
  }),
  q(16, [LCM], {
    type: 'true-false', difficulty: 'medium',
    prompt: rich(text('المضاعف المشترك الأصغر للعددين '), math('5'), text(' و'), math('10'), text(' هو '), math('10'), text('.')),
    concepts: ['multiples-and-lcm'], skills: ['find-lcm-two'], sourceConcepts: ['u2-lcm'],
    answer: true,
    solution: {
      idea: rich(text('إذا كان أحد العددين مضاعفاً للآخر فالآخر هو الأصغر مشترك.')),
      rule: rich(text('المضاعف المشترك الأصغر لا يقلّ عن أكبر العددين.')),
      steps: [
        rich(text('10 من مضاعفات 5.')),
        rich(text('لا يوجد مشترك أصغر من 10 لأن 10 هو أكبر العددين.')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('القول 50 بحساب حاصل الضرب.')),
    },
    originalityNote: 'يختبر حالة كون أحد العددين مضاعفاً للآخر، وهي الحالة التي تكشف التسرّع إلى الضرب.',
  }),
  q(17, [LCM], {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('ما المضاعف المشترك الأصغر للأعداد '), math('4'), text(' و'), math('6'), text(' و'), math('9'), text('؟')),
    concepts: ['multiples-and-lcm'], skills: ['find-lcm-three'], sourceConcepts: ['u2-lcm'],
    coverage: { thinking: ['combine-three-constraints'] },
    answer: { expected: '36', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نجد أصغر عدد يقبل القسمة على الثلاثة معاً.')),
      rule: rich(text('المضاعف المشترك الأصغر لعدّة أعداد هو أصغر عدد يقبل القسمة عليها جميعاً.')),
      steps: [
        rich(text('من مضاعفات 9: '), math('9, 18, 27, 36…')),
        rich(text('36 يقبل القسمة على 4 و6 أيضاً.')),
        rich(text('9 و18 لا يقبلان القسمة على 6 معاً بالشروط المطلوبة: 18 يقبل لكنه لا يقبل على 4.')),
      ],
      finalAnswer: rich(math('36')),
      commonError: rich(text('أخذ مضاعف اثنين فقط ثم إغفال الثالث.')),
    },
    originalityNote: 'يوسّع حساب المضاعف من عددين إلى ثلاثة أعداد بشرطين متزامنين، وهو امتداد منطقي لما في ص 53.',
  }),
  q(18, [LCM], {
    type: 'matching', difficulty: 'thinking',
    prompt: rich(text('طابق كلّ موقف مع العدد الذي يبحث عنه.')),
    concepts: ['multiples-and-lcm'], skills: ['match-lcm-situation'], sourceConcepts: ['u2-lcm'],
    coverage: { thinking: ['interpret-lcm-in-context'] },
    left: [
      optionText('q18-l1', 'مصباحان يومضان كلّ 4 و6 ثوانٍ؛ متى يومضان معاً أول مرة؟'),
      optionText('q18-l2', 'توزيع 12 قلماً و18 دفتراً على مجموعات متساوية بأكبر عدد ممكن'),
    ],
    right: [
      optionText('q18-r1', 'المضاعف المشترك الأصغر (12)'),
      optionText('q18-r2', 'قاسم مشترك أكبر وليس مضاعفاً'),
    ],
    answer: [
      { leftId: 'q18-l1', rightId: 'q18-r1' },
      { leftId: 'q18-l2', rightId: 'q18-r2' },
    ],
    solution: {
      idea: rich(text('التزامن يطلب المضاعف، والتوزيع المتساوي الأكبر يطلب القاسم.')),
      rule: rich(text('«أوّل مرة معاً» = المضاعف المشترك الأصغر؛ «أكبر تقسيم متساوٍ» = القاسم المشترك الأكبر.')),
      steps: [
        rich(text('المصباحان يلتقيان عند مضاعف مشترك للعددين 4 و6، وأوّله 12.')),
        rich(text('توزيع 12 و18 على أكبر عدد من المجموعات المتساوية يطلب قاسماً مشتركاً، لا مضاعفاً.')),
      ],
      finalAnswer: rich(text('الموقف الأول ← 12 (مضاعف مشترك)، والثاني ← قاسم مشترك أكبر.')),
      commonError: rich(text('استعمال المضاعف في مسائل التوزيع المتساوي.')),
    },
    originalityNote: 'يفرّق بين المضاعف والقاسم داخل موقفين حياتيين، وهو تمييز مفهومي لا يرد في تمارين ص 52–53.',
  }),

  /* ============================================================ الدرس 4: الكسور (1) */
  q(19, [FRACTIONS_ONE], {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ كسر أكبر: '), math('3/8'), text(' أم '), math('5/8'), text('؟')),
    concepts: ['fraction-comparison'], skills: ['compare-fractions'], sourceConcepts: ['u2-fractions-compare'],
    options: [
      optionText('q19-a', '5/8'),
      optionText('q19-b', '3/8'),
      optionText('q19-c', 'متساويان'),
      optionText('q19-d', 'لا يمكن المقارنة'),
    ],
    answer: 'q19-a',
    solution: {
      idea: rich(text('المقامان متساويان، فالمقارنة بالأسطار.')),
      rule: rich(text('عند تساوي المقامات، الكسر ذو البسط الأكبر هو الأكبر.')),
      steps: [
        rich(text('الكسران يمثّلان أجزاءً من ثمانية أجزاء متساوية.')),
        rich(text('خمسة أجزاء أكبر من ثلاثة.')),
      ],
      finalAnswer: rich(math('5/8 > 3/8')),
      commonError: rich(text('اختيار الكسر ذي المقام الأكبر ظنّاً أن المقام يزيد القيمة.')),
    },
    originalityNote: 'يقارن كسرين بالمقام نفسه بأرقام جديدة، ويضع الصحيح في الموضع الأول بعد دوران المواضع.',
  }),
  q(20, [FRACTIONS_ONE], {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('الكسر '), math('4/6'), text(' يكافئ الكسر '), math('2/3'), text('.')),
    concepts: ['equivalent-fractions'], skills: ['recognize-equivalent-fractions'], sourceConcepts: ['u2-fractions-compare'],
    answer: true,
    solution: {
      idea: rich(text('نقسم البسط والمقام على العامل نفسه.')),
      rule: rich(text('ضرب البسط والمقام في العدد نفسه أو قسمتهما عليه لا يغيّر قيمة الكسر.')),
      steps: [
        rich(math('4 ÷ 2 = 2'), text(' و'), math('6 ÷ 2 = 3')),
        rich(text('إذن الكسران يمثّلان المقدار نفسه.')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('الاكتفاء بمقارنة البسطين أو المقامين منفردين.')),
    },
    originalityNote: 'يختبر التكافؤ بالاختزال بدل توليد كسور مكافئة كما في تمارين ص 54–57.',
  }),
  q(21, [FRACTIONS_ONE], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('ما أصغر مقام مشترك يمكن استعماله لمقارنة الكسرين '), math('3/4'), text(' و'), math('5/6'), text('؟')),
    concepts: ['equivalent-fractions'], skills: ['find-common-denominator'], sourceConcepts: ['u2-fractions-compare'],
    answer: { expected: '12', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('أصغر مقام مشترك هو المضاعف المشترك الأصغر للمقامين.')),
      rule: rich(text('نستعمل المضاعف المشترك الأصغر للمقامين مقاماً مشتركاً.')),
      steps: [
        rich(text('مضاعفات 4: 4، 8، 12… ومضاعفات 6: 6، 12…')),
        rich(text('أصغر مشترك هو 12.')),
      ],
      finalAnswer: rich(math('12')),
      commonError: rich(text('ضرب المقامين دائماً (24) فيصبح الحساب أصعب.')),
    },
    originalityNote: 'يقطع خطوة المقارنة بطلب المقام المشترك الأصغر نفسه، ويربط الدرس بدرس المضاعف المشترك الأصغر.',
  }),
  q(22, [FRACTIONS_ONE], {
    type: 'ordering', difficulty: 'advanced',
    prompt: rich(text('أعد ترتيب الكسور الثلاثة من الأصغر إلى الأكبر بعد توحيد مقاماتها.')),
    concepts: ['fraction-comparison'], skills: ['order-fractions'], sourceConcepts: ['u2-fractions-compare'],
    items: [
      optionText('q22-a', '1/2'),
      optionText('q22-b', '2/3'),
      optionText('q22-c', '3/4'),
    ],
    answer: ['q22-a', 'q22-b', 'q22-c'],
    solution: {
      idea: rich(text('نوحّد المقامات إلى 12 ثم نقارن الأسطار.')),
      rule: rich(text('توحيد المقامات يحوّل المقارنة إلى مقارنة أعداد صحيحة.')),
      steps: [
        rich(math('1/2 = 6/12'), text(' و'), math('2/3 = 8/12'), text(' و'), math('3/4 = 9/12')),
        rich(text('إذن الترتيب التصاعدي هو '), math('6/12 < 8/12 < 9/12'), text('.')),
      ],
      finalAnswer: rich(math('1/2 < 2/3 < 3/4')),
      commonError: rich(text('ترتيبها بمقارنة البسط والمقام كلّ على حدة.')),
    },
    originalityNote: 'يطلب ترتيب ثلاثة كسور بعد توحيد المقامات، بدل المقارنة الثنائية المطبوعة في ص 55–57.',
  }),
  q(23, [FRACTIONS_ONE], {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('قال طالب: «'), math('2/5'), text(' أكبر من '), math('3/8'), text(' لأن 5 أكبر من 8». اختر التشخيص والتصحيح.')),
    concepts: ['fraction-comparison'], skills: ['diagnose-fraction-comparison'], sourceConcepts: ['u2-fractions-compare'],
    coverage: { commonErrors: ['compare-denominators-only'] },
    studentWork: rich(text('2/5 > 3/8'), text(' بحجّة 5 > 8')),
    diagnoses: [
      optionText('q23-d1', 'قارن المقامين فقط، والمقام الأكبر لا يعني الكسر الأكبر'),
      optionText('q23-d2', 'المقارنة صحيحة لأن 5 و8 عددان صحيحان'),
    ],
    corrections: [
      optionText('q23-c1', 'نوحّد المقامات: 16/40 و15/40، إذن 2/5 أكبر'),
      optionText('q23-c2', 'نقارن البسطين: 3 > 2 إذن 3/8 أكبر'),
    ],
    answer: { diagnosisId: 'q23-d1', correctionId: 'q23-c1' },
    solution: {
      idea: rich(text('لا تُقارن الكسور بمقاماتها أو بسطها منفردة.')),
      rule: rich(text('نوحّد المقامات ثم نقارن الأسطار.')),
      steps: [
        rich(math('2/5 = 16/40'), text(' و'), math('3/8 = 15/40')),
        rich(text('بما أن 16 > 15 فإن '), math('2/5 > 3/8'), text(' فعلاً، لكن السبب الذي ذكره الطالب خاطئ.')),
      ],
      finalAnswer: rich(text('النتيجة صحيحة والاستدلال خاطئ؛ والتصحيح بتوحيد المقامات.')),
      commonError: rich(text('الحكم بالنتيجة الصحيحة من دون فحص الاستدلال.')),
    },
    originalityNote: 'يقدّم استدلالاً خاطئاً يؤدي إلى نتيجة صحيحة، فيختبر فحص التعليل لا الناتج فقط.',
  }),
  q(24, [FRACTIONS_ONE], {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('ما العدد الذي يجب وضعه في الفراغ ليكافئ الكسر '), math('3/4'), text(': '), math('؟/20'), text('؟')),
    concepts: ['equivalent-fractions'], skills: ['find-missing-numerator'], sourceConcepts: ['u2-fractions-compare'],
    coverage: { thinking: ['reason-about-equivalence'] },
    answer: { expected: '15', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نبحث عن العامل الذي ضُرب به المقام ثم نضرب البسط به.')),
      rule: rich(text('البسط والمقام يُضربان في العدد نفسه للحفاظ على قيمة الكسر.')),
      steps: [
        rich(math('20 ÷ 4 = 5')),
        rich(math('3 × 5 = 15')),
      ],
      finalAnswer: rich(math('15/20')),
      commonError: rich(text('إضافة العدد 16 إلى البسط بدل ضربه بالعامل.')),
    },
    originalityNote: 'يعكس توليد الكسور المكافئة في ص 54–57 بطلب البسط الناقص، ويستعمل 20 بدل المقامات المطبوعة.',
  }),

  /* ============================================================ الدرس 5: الكسور (2) */
  q(25, [FRACTIONS_TWO], {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ كتابة تمثّل الكسر '), math('9/4'), text(' بالعدد الكسري؟')),
    concepts: ['mixed-numbers', 'improper-fractions'], skills: ['convert-improper-to-mixed'], sourceConcepts: ['u2-fractions-convert'],
    options: [
      optionText('q25-a', '2 و1/4'),
      optionText('q25-b', '4 و1/9'),
      optionText('q25-c', '9 و1/4'),
      optionText('q25-d', '2 و1/9'),
    ],
    answer: 'q25-a',
    solution: {
      idea: rich(text('نقسم البسط على المقام: الخارج صحيح والباقي بسط.')),
      rule: rich(text('الكسر المركّب = عدد صحيح + كسر بسطه الباقي ومقامه المقام نفسه.')),
      steps: [
        rich(math('9 ÷ 4 = 2'), text(' والباقي '), math('1')),
        rich(math('9/4 = 2 + 1/4')),
      ],
      finalAnswer: rich(text('2 و1/4.')),
      commonError: rich(text('وضع الخارج في المقام والباقي في الصحيح.')),
    },
    originalityNote: 'يقدّم أربع كتابات متقاربة للكسر المركّب، ويضع الصحيح أوّلاً بعد دوران المواضع.',
  }),
  q(26, [FRACTIONS_TWO], {
    type: 'fraction', difficulty: 'medium',
    prompt: rich(text('اكتب العدد الكسري '), math('2 1/4'), text(' في صورة كسر مركّب.')),
    concepts: ['mixed-numbers', 'improper-fractions'], skills: ['convert-mixed-to-improper'], sourceConcepts: ['u2-fractions-convert'],
    answer: { numerator: '9', denominator: '4', equivalentForms: 'accept' },
    solution: {
      idea: rich(text('نضرب الصحيح في المقام ثم نضيف البسط.')),
      rule: rich(text('العدد الكسري a b/c = (a × c + b)/c.')),
      steps: [
        rich(math('2 × 4 = 8')),
        rich(math('8 + 1 = 9'), text('، والمقام يبقى 4.')),
      ],
      finalAnswer: rich(math('9/4')),
      commonError: rich(text('ضرب الصحيح في البسط بدل المقام.')),
    },
    originalityNote: 'يعكس اتجاه التحويل (من مختلط إلى مركّب) بكسر مختلف عن أمثلة ص 58–61.',
  }),
  q(27, [FRACTIONS_TWO], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('ما باقي قسمة '), math('23'), text(' على '), math('5'), text(' عند كتابة '), math('23/5'), text(' عدداً كسرياً؟')),
    concepts: ['mixed-numbers'], skills: ['find-remainder'], sourceConcepts: ['u2-fractions-convert'],
    answer: { expected: '3', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('الباقي هو بسط الكسر في العدد الكسري.')),
      rule: rich(text('23 ÷ 5 = 4 والباقي 3، إذن 23/5 = 4 و3/5.')),
      steps: [
        rich(math('5 × 4 = 20')),
        rich(math('23 − 20 = 3')),
      ],
      finalAnswer: rich(math('3')),
      commonError: rich(text('اعتبار الخارج هو الباقي.')),
    },
    originalityNote: 'يفصل مفهوم الباقي في التحويل عن كتابة العدد الكسري كاملاً، وهو تفكيك غير مطبوع للسؤال.',
  }),
  q(28, [FRACTIONS_TWO], {
    type: 'fraction', difficulty: 'medium',
    prompt: rich(text('اكتب '), math('3 2/5'), text(' في صورة كسر مركّب.')),
    concepts: ['mixed-numbers', 'improper-fractions'], skills: ['convert-mixed-to-improper'], sourceConcepts: ['u2-fractions-convert'],
    answer: { numerator: '17', denominator: '5', equivalentForms: 'accept' },
    solution: {
      idea: rich(text('نضرب 3 في 5 ونضيف 2.')),
      rule: rich(text('a b/c = (a × c + b)/c.')),
      steps: [
        rich(math('3 × 5 = 15')),
        rich(math('15 + 2 = 17'), text('، والمقام 5.')),
      ],
      finalAnswer: rich(math('17/5')),
      commonError: rich(text('كتابة 15/5 وإسقاط البسط.')),
    },
    originalityNote: 'يحوّل عدداً كسرياً بسيطاً آخر إلى كسر مركّب، ويطلب الكتابة الكسرية مباشرةً في حقل الكسر.',
  }),
  q(29, [FRACTIONS_TWO], {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('ما بسط الكسر المركّب المكافئ للعدد الكسري '), math('4 3/8'), text('؟')),
    concepts: ['mixed-numbers', 'improper-fractions'], skills: ['convert-mixed-to-improper'], sourceConcepts: ['u2-fractions-convert'],
    answer: { expected: '35', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('البسط = الصحيح × المقام + البسط الأصلي.')),
      rule: rich(text('a b/c = (a × c + b)/c.')),
      steps: [
        rich(math('4 × 8 = 32')),
        rich(math('32 + 3 = 35')),
      ],
      finalAnswer: rich(math('35/8')),
      commonError: rich(text('جمع الصحيح إلى البسط (7) بدل ضربه في المقام.')),
    },
    originalityNote: 'يفصل البسط عن الكسر كاملاً ويستعمل 4 و3 و8، فيكشف من يجمع بدل أن يضرب.',
  }),
  q(30, [FRACTIONS_TWO], {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('كتب طالب '), math('5 2/3 = 17/3'), text(' ثم قال إن الكسر يساوي '), math('5 3/2'), text('. اختر التشخيص والتصحيح.')),
    concepts: ['mixed-numbers', 'improper-fractions'], skills: ['diagnose-conversion'], sourceConcepts: ['u2-fractions-convert'],
    coverage: { commonErrors: ['swap-whole-and-remainder'] },
    studentWork: rich(text('5 2/3 ← 17/3 صحيح، ثم كتب 5 3/2 بدل 5 2/3')),
    diagnoses: [
      optionText('q30-d1', 'بدّل موضع الصحيح والبسط بعد التحويل، والكتابتان لا تمثّلان المقدار نفسه'),
      optionText('q30-d2', 'الكتابتان متكافئتان لأن 17/3 تساويهما'),
    ],
    corrections: [
      optionText('q30-c1', 'التحويل الصحيح وحده: 5 2/3 = 17/3'),
      optionText('q30-c2', 'التحويل الصحيح هو 5 3/2 = 17/3'),
    ],
    answer: { diagnosisId: 'q30-d1', correctionId: 'q30-c1' },
    solution: {
      idea: rich(text('ترتيب الصحيح والبسط في العدد الكسري جزء من معناه.')),
      rule: rich(text('العدد الكسري يُكتب صحيحاً ثم بسطاً ثم مقاماً، والتبديل يغيّر القيمة.')),
      steps: [
        rich(math('5 2/3 = 17/3'), text(' و'), math('5 3/2 = 13/2'), text(' وهما مختلفان.')),
        rich(text('إذن الكتابة الثانية ليست تحويلاً للكسر الأول.')),
      ],
      finalAnswer: rich(text('التشخيص: تبديل موضع البسط؛ والتصحيح: '), math('5 2/3 = 17/3'), text('.')),
      commonError: rich(text('الاكتفاء بصحّة الجزء الأول من العمل وتجاهل الجزء الثاني.')),
    },
    originalityNote: 'يقدّم تحويلاً صحيحاً يتبعه تبديل خاطئ للمواضع، فيطلب تشخيص موضع الخطأ لا مجرّد إعادة التحويل.',
  }),

  /* ============================================================ الدرس 6: الأجزاء العشرية (1) */
  q(31, [TENTHS], {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('كيف نقرأ العدد '), math('0.7'), text('؟')),
    concepts: ['tenths'], skills: ['read-tenths'], sourceConcepts: ['u2-tenths'],
    options: [
      optionText('q31-a', 'سبعة أعشار'),
      optionText('q31-b', 'سبع مئات'),
      optionText('q31-c', 'سبعة وسبعون'),
      optionText('q31-d', 'سبعة أجزاء من ألف'),
    ],
    answer: 'q31-a',
    solution: {
      idea: rich(text('الرقم بعد الفاصلة الأولى يمثّل الأعشار.')),
      rule: rich(text('المنزلة الأولى بعد الفاصلة هي منزلة الأعشار.')),
      steps: [
        rich(text('الرقم 7 في منزلة الأعشار.')),
        rich(text('نقرأه «سبعة أعشار».')),
      ],
      finalAnswer: rich(text('سبعة أعشار.')),
      commonError: rich(text('قراءته «سبعة» فقط أو نسبةً إلى المئات.')),
    },
    originalityNote: 'يسأل عن القراءة اللفظية للعدد 0.7 ببدائل تشمل المنازل المجاورة، لا عن كتابته.',
  }),
  q(32, [TENTHS], {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('العدد '), math('0.5'), text(' أكبر من العدد '), math('0.35'), text('.')),
    concepts: ['tenths', 'hundredths'], skills: ['compare-tenths'], sourceConcepts: ['u2-tenths'],
    answer: true,
    solution: {
      idea: rich(text('نكتب العددين بالأعشار أو نقارن المنازل من اليسار.')),
      rule: rich(text('نقارن الأجزاء العشرية منزلةً منزلةً بعد الفاصلة.')),
      steps: [
        rich(text('في منزلة الأعشار: 5 مقابل 3.')),
        rich(text('5 > 3، إذن '), math('0.5 > 0.35'), text('.')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('مقارنة عدد الأرقام بعد الفاصلة بدل قيم المنازل.')),
    },
    originalityNote: 'يقارن عشراً بمئات (0.5 و0.35) وهي حالة تكشف الوهم بأن عدداً أطول بعد الفاصلة أكبر.',
  }),
  q(33, [TENTHS], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('ثلاثة أعشار تُكتب عشراً؛ أيّ عدد عشري يساوي '), math('3/10'), text('؟')),
    concepts: ['tenths'], skills: ['convert-tenths'], sourceConcepts: ['u2-tenths'],
    answer: { expected: '0.3', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('المقام 10 يعني منزلة أعشار واحدة.')),
      rule: rich(text('الكسر الذي مقامه 10 يُكتب بعدد عشري بمنزلة واحدة بعد الفاصلة.')),
      steps: [
        rich(math('3/10 = 0 + 3/10')),
        rich(text('نكتب 3 في منزلة الأعشار: '), math('0.3'), text('.')),
      ],
      finalAnswer: rich(math('0.3')),
      commonError: rich(text('كتابة 3.0 بجعل 3 صحيحاً.')),
    },
    originalityNote: 'يعكس التمثيل الكتابي المطبوع (من العدد إلى الكسر) بطلب تحويل كسر عشري بأرقام جديدة.',
  }),
  q(34, [TENTHS], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('ما ناتج جمع '), math('0.4'), text(' و'), math('0.5'), text('؟')),
    concepts: ['tenths'], skills: ['add-tenths'], sourceConcepts: ['u2-tenths'],
    answer: { expected: '0.9', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نجمع الأعشار كما نجمع الآحاد.')),
      rule: rich(text('4 أعشار + 5 أعشار = 9 أعشار.')),
      steps: [
        rich(math('4 + 5 = 9')),
        rich(text('يبقى في منزلة الأعشار: '), math('0.9'), text('.')),
      ],
      finalAnswer: rich(math('0.9')),
      commonError: rich(text('كتابة 9 بدل 0.9 بإغفال المنزلة.')),
    },
    originalityNote: 'يجمع عشرين بلا حمل، بخلاف الأمثلة المطبوعة التي تعتمد النماذج المصوّرة فقط.',
  }),
  q(35, [TENTHS], {
    type: 'ordering', difficulty: 'advanced',
    prompt: rich(text('رتّب الأعداد العشرية الآتية تصاعدياً.')),
    concepts: ['tenths', 'hundredths'], skills: ['order-decimals'], sourceConcepts: ['u2-tenths'],
    items: [
      optionText('q35-a', '0.3'),
      optionText('q35-b', '0.13'),
      optionText('q35-c', '0.31'),
    ],
    answer: ['q35-b', 'q35-a', 'q35-c'],
    solution: {
      idea: rich(text('نوحّد عدد المنازل بعد الفاصلة ثم نقارن.')),
      rule: rich(text('كتابة الأعداد بالمنزلة نفسها تكشف الترتيب مباشرةً.')),
      steps: [
        rich(math('0.30'), text(' و'), math('0.13'), text(' و'), math('0.31')),
        rich(text('الترتيب التصاعدي: '), math('0.13 < 0.30 < 0.31'), text('.')),
      ],
      finalAnswer: rich(math('0.13 < 0.3 < 0.31')),
      commonError: rich(text('وضع 0.13 بعد 0.3 لأن 13 > 3.')),
    },
    originalityNote: 'يستعمل ثلاثة أعداد متقاربة تختلف في مئات الأعشار، وهو ترتيب لم يرد في تمارين ص 62–65.',
  }),
  q(36, [TENTHS], {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابق كلّ كسر مع العدد العشري المكافئ.')),
    concepts: ['tenths'], skills: ['match-fraction-decimal'], sourceConcepts: ['u2-tenths'],
    left: [
      optionText('q36-l1', '1/10'),
      optionText('q36-l2', '7/10'),
      optionText('q36-l3', '10/10'),
    ],
    right: [
      optionText('q36-r1', '1'),
      optionText('q36-r2', '0.1'),
      optionText('q36-r3', '0.7'),
    ],
    answer: [
      { leftId: 'q36-l1', rightId: 'q36-r2' },
      { leftId: 'q36-l2', rightId: 'q36-r3' },
      { leftId: 'q36-l3', rightId: 'q36-r1' },
    ],
    solution: {
      idea: rich(text('عشر أعشار تساوي واحداً صحيحاً.')),
      steps: [
        rich(math('1/10 = 0.1')),
        rich(math('7/10 = 0.7')),
        rich(math('10/10 = 1')),
      ],
      finalAnswer: rich(text('0.1 ثم 0.7 ثم 1.')),
      commonError: rich(text('كتابة 10/10 = 0.10 بدل 1.')),
    },
    originalityNote: 'يضمّ الكسر الذي يساوي واحداً صحيحاً وهو حالة حدّية لم تُعرض في أمثلة ص 62.',
  }),

  /* ============================================================ الدرس 7: الأجزاء العشرية (2) */
  q(37, [HUNDREDTHS], {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('اكتب الكسر '), math('25/100'), text(' في صورة عدد عشري.')),
    concepts: ['hundredths'], skills: ['convert-hundredths'], sourceConcepts: ['u2-hundredths'],
    answer: { expected: '0.25', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('المقام 100 يعني منزلتين بعد الفاصلة.')),
      rule: rich(text('الكسر الذي مقامه 100 يُكتب بمنزلتين عشريتين.')),
      steps: [
        rich(math('25/100 = 0.25')),
        rich(text('2 في الأعشار و5 في المئات.')),
      ],
      finalAnswer: rich(math('0.25')),
      commonError: rich(text('كتابة 0.025 بإضافة صفر زائد.')),
    },
    originalityNote: 'يحوّل كسراً من مئة إلى صيغة عشرية بالكتابة المباشرة، بأرقام ليست من أمثلة ص 66–71.',
  }),
  q(38, [HUNDREDTHS], {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('هل القيمة '), math('0.60'), text(' تساوي القيمة '), math('0.6'), text('؟')),
    concepts: ['hundredths', 'tenths'], skills: ['compare-hundredths'], sourceConcepts: ['u2-hundredths'],
    answer: true,
    solution: {
      idea: rich(text('الصفر في منزلة المئات لا يغيّر القيمة.')),
      rule: rich(text('إضافة أصفار إلى يمين العدد العشري لا تغيّر قيمته.')),
      steps: [
        rich(math('0.6 = 6/10 = 60/100')),
        rich(math('60/100 = 0.60')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('اعتبار 0.60 أكبر لأن فيه رقمين.')),
    },
    originalityNote: 'يختبر تكافؤ 0.6 و0.60، وهي نقطة تخلط كثيراً بين عدد الأرقام وقيمة العدد.',
  }),
  q(39, [HUNDREDTHS], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('كم يساوي '), math('0.07'), text(' مضافاً إليه '), math('0.08'), text('؟')),
    concepts: ['hundredths'], skills: ['add-hundredths'], sourceConcepts: ['u2-hundredths'],
    coverage: { commonErrors: ['forget-carry'] },
    answer: { expected: '0.15', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('7 مئات + 8 مئات = 15 مئة، أي عشر واحد و5 مئات.')),
      rule: rich(text('عشر مئات تساوي عشراً واحداً، فنحمل إلى منزلة الأعشار.')),
      steps: [
        rich(math('7 + 8 = 15')),
        rich(math('0.15'), text(' بعد الحمل.')),
      ],
      finalAnswer: rich(math('0.15')),
      commonError: rich(text('كتابة 0.015 بإضافة منزلة بدل الحمل.')),
    },
    originalityNote: 'يجمع مئات بأصفار في الأعشار ويستلزم حملاً صريحاً، وهو ما لا تظهره الأمثلة المطبوعة.',
  }),
  q(40, [HUNDREDTHS], {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('أيّ عدد يمثّل سبعة أجزاء من مئة؟')),
    concepts: ['hundredths'], skills: ['identify-hundredths-digit'], sourceConcepts: ['u2-hundredths'],
    options: [
      optionText('q40-a', '0.7'),
      optionText('q40-b', '0.07'),
      optionText('q40-c', '7.00'),
      optionText('q40-d', '0.007'),
    ],
    answer: 'q40-b',
    solution: {
      idea: rich(text('«من مئة» تعني أن الرقم في منزلة المئات.')),
      rule: rich(text('منزلة المئات هي الثانية بعد الفاصلة.')),
      steps: [
        rich(text('نضع صفراً في الأعشار و7 في المئات.')),
        rich(math('0.07')),
      ],
      finalAnswer: rich(math('0.07')),
      commonError: rich(text('الخلط بين 0.7 و0.07.')),
    },
    originalityNote: 'يفرّق بين 0.7 و0.07 بقراءة لفظية، ويضع الصحيح في الموضع الثاني بعد دوران المواضع.',
  }),
  q(41, [HUNDREDTHS], {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('أكمل الجمع: '), math('0.45 + 0.38'), text(' = ؟')),
    concepts: ['hundredths'], skills: ['add-hundredths'], sourceConcepts: ['u2-hundredths'],
    coverage: { commonErrors: ['forget-carry'] },
    answer: { expected: '0.83', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نجمع المئات أولاً ثم نحمل إلى الأعشار.')),
      rule: rich(text('كلّ 10 أجزاء من مئة تساوي جزءاً واحداً من عشرة.')),
      steps: [
        rich(math('5 + 8 = 13'), text(' مئة ← 3 مئات وحمل 1.')),
        rich(math('4 + 3 + 1 = 8'), text(' أعشار.')),
      ],
      finalAnswer: rich(math('0.83')),
      commonError: rich(text('كتابة 0.73 بنسيان الحمل.')),
    },
    originalityNote: 'يجمع عددين بمئات متفاوتة يستلزم حملين متتاليين، بدرجة أعلى من أمثلة الكتاب.',
  }),
  q(42, [HUNDREDTHS], {
    type: 'multi-select', difficulty: 'advanced',
    prompt: rich(text('اختر كلّ تعبير يساوي '), math('0.5'), text('.')),
    concepts: ['hundredths', 'tenths'], skills: ['select-equal-decimals'], sourceConcepts: ['u2-hundredths'],
    options: [
      optionText('q42-a', '0.05'),
      optionText('q42-b', '50/100'),
      optionText('q42-c', '0.50'),
      optionText('q42-d', '5/100'),
    ],
    answer: ['q42-b', 'q42-c'],
    solution: {
      idea: rich(text('نحوّل كلّ تعبير إلى الكسر نفسه ثم نقارن.')),
      rule: rich(text('0.5 = 5/10 = 50/100.')),
      steps: [
        rich(math('50/100 = 0.50 = 0.5')),
        rich(math('0.05 = 5/100'), text(' و'), math('5/100'), text(' أصغر بكثير.')),
      ],
      finalAnswer: rich(math('50/100'), text(' و'), math('0.50')),
      commonError: rich(text('اعتبار 0.05 مساوياً لأن فيه الرقم 5.')),
    },
    originalityNote: 'يجمع تمثيلات كسرية وعشرية للمقدار نفسه ويضع بديلين بخانة خاطئة، لتقويم فهم المنزلة.',
  }),

  /* ============================================================ الدرس 8: الأجزاء العشرية (3) */
  q(43, [THOUSANDTHS], {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('عبّر عن الكسر '), math('345/1000'), text(' بعددٍ عشري.')),
    concepts: ['thousandths'], skills: ['convert-thousandths'], sourceConcepts: ['u2-thousandths'],
    answer: { expected: '0.345', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('مقام 1000 يعني ثلاث منازل بعد الفاصلة.')),
      rule: rich(text('الكسر الذي مقامه 1000 يُكتب بثلاث منازل عشرية.')),
      steps: [
        rich(text('3 أعشار، 4 مئات، 5 أجزاء من ألف.')),
        rich(math('0.345')),
      ],
      finalAnswer: rich(math('0.345')),
      commonError: rich(text('كتابة 0.3450 أو 34.5.')),
    },
    originalityNote: 'يحوّل كسراً من ألف بثلاث منازل غير صفرية، بدل الأمثلة التي تنتهي بأصفار.',
  }),
  q(44, [THOUSANDTHS], {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('هل '), math('0.300'), text(' تساوي '), math('0.3'), text('؟')),
    concepts: ['thousandths'], skills: ['compare-thousandths'], sourceConcepts: ['u2-thousandths'],
    answer: true,
    solution: {
      idea: rich(text('الأصفار بعد آخر رقم غير صفري لا تغيّر القيمة.')),
      rule: rich(text('إضافة أصفار إلى يمين العدد العشري لا تغيّر قيمته.')),
      steps: [
        rich(math('0.3 = 300/1000')),
        rich(math('300/1000 = 0.300')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('الاعتقاد أن 0.300 أكبر لطول كتابته.')),
    },
    originalityNote: 'يوسّع تكافؤ الأصفار إلى منزلة الألف، ويطلب الحكم على معادلة لا على ترتيب.',
  }),
  q(45, [THOUSANDTHS], {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('ما مجموع '), math('0.125'), text(' و'), math('0.275'), text('؟')),
    concepts: ['thousandths'], skills: ['add-thousandths'], sourceConcepts: ['u2-thousandths'],
    coverage: { thinking: ['carry-across-three-places'] },
    answer: { expected: '0.4', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نجمع من اليمين: أجزاء الألف ثم المئات ثم الأعشار.')),
      rule: rich(text('كلّ 10 أجزاء من ألف جزء من مئة، وكلّ 10 من مئة جزء من عشرة.')),
      steps: [
        rich(math('5 + 5 = 10'), text(' أجزاء من ألف ← 0 وحمل 1 مئة.')),
        rich(math('2 + 7 + 1 = 10'), text(' مئات ← 0 وحمل 1 عشر.')),
        rich(math('1 + 2 + 1 = 4'), text(' أعشار.')),
      ],
      finalAnswer: rich(math('0.400 = 0.4')),
      commonError: rich(text('كتابة 0.310 أو إغفال أحد الحملين.')),
    },
    originalityNote: 'يجمع عددين بحملين متتاليين ينتهيان إلى 0.4 تماماً، وهو موقف حسابي غير مطبوع.',
  }),
  q(46, [THOUSANDTHS], {
    type: 'ordering', difficulty: 'advanced',
    prompt: rich(text('رتّب الأعداد الآتية تصاعدياً.')),
    concepts: ['thousandths'], skills: ['order-thousandths'], sourceConcepts: ['u2-thousandths'],
    items: [
      optionText('q46-a', '0.4'),
      optionText('q46-b', '0.045'),
      optionText('q46-c', '0.45'),
    ],
    answer: ['q46-b', 'q46-a', 'q46-c'],
    solution: {
      idea: rich(text('نوحّد المنازل إلى ثلاث منازل ثم نقارن.')),
      rule: rich(text('0.4 = 0.400 و0.045 = 0.045 و0.45 = 0.450.')),
      steps: [
        rich(math('0.045 < 0.400 < 0.450')),
        rich(text('الفرق واضح بعد توحيد عدد المنازل.')),
      ],
      finalAnswer: rich(math('0.045 < 0.4 < 0.45')),
      commonError: rich(text('ترتيب 0.045 في الوسط لأن 45 أكبر من 4.')),
    },
    originalityNote: 'يضع 0.045 مقابل 0.4 و0.45 ليختبر توحيد المنازل لا عدد الأرقام، وهو ترتيب غير مطبوع.',
  }),
  q(47, [THOUSANDTHS], {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('قرأ طالب '), math('0.045'), text(' «خمسة وأربعون من مئة». اختر التشخيص والتصحيح.')),
    concepts: ['thousandths'], skills: ['diagnose-decimal-reading'], sourceConcepts: ['u2-thousandths'],
    coverage: { commonErrors: ['misread-place-value'] },
    studentWork: rich(text('0.045 = 45/100')),
    diagnoses: [
      optionText('q47-d1', 'أغفل الصفر في منزلة الأعشار فقرأ الرقمين في منزلتين خاطئتين'),
      optionText('q47-d2', 'القراءة صحيحة لأن الرقمين 45'),
    ],
    corrections: [
      optionText('q47-c1', '0.045 = 45/1000 أي خمسة وأربعون من ألف'),
      optionText('q47-c2', '0.045 = 45/10'),
    ],
    answer: { diagnosisId: 'q47-d1', correctionId: 'q47-c1' },
    solution: {
      idea: rich(text('عدد المنازل بعد الفاصلة يحدّد المقام.')),
      rule: rich(text('ثلاث منازل بعد الفاصلة تعني الأجزاء من ألف.')),
      steps: [
        rich(text('0.045 فيه ثلاث منازل: 0 أعشار، 4 مئات، 5 أجزاء من ألف.')),
        rich(math('0.045 = 45/1000'), text('.')),
      ],
      finalAnswer: rich(text('التشخيص: إسقاط منزلة؛ والتصحيح: خمسة وأربعون من ألف.')),
      commonError: rich(text('عدّ الأرقام بعد الفاصلة من اليمين بدل المنازل.')),
    },
    originalityNote: 'يستهدف قراءة عدد فيه صفر في الأعشار، وهي الحالة التي تُنتج الخطأ الشائع في ص 72–76.',
  }),
  q(48, [THOUSANDTHS], {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('أضف '), math('0.035'), text(' إلى '), math('0.7'), text('. ما الناتج؟')),
    concepts: ['thousandths', 'tenths'], skills: ['add-thousandths'], sourceConcepts: ['u2-thousandths'],
    coverage: { thinking: ['align-place-values'] },
    answer: { expected: '0.735', format: 'decimal', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نكتب 0.7 بالمنازل نفسها: 0.700.')),
      rule: rich(text('لا نجمع أرقاماً في منازل مختلفة؛ نوحّد المنازل أولاً.')),
      steps: [
        rich(math('0.7 = 0.700')),
        rich(math('0.700 + 0.035 = 0.735')),
      ],
      finalAnswer: rich(math('0.735')),
      commonError: rich(text('جمع 7 و35 لإنتاج 0.105 أو 0.42.')),
    },
    originalityNote: 'يجمع عشراً واحداً مع أجزاء من ألف ليكشف خطأ محاذاة المنازل، وهو تطبيق غير مطبوع.',
  }),

  /* ============================================================ الدرس 9: المستطيل */
  q(49, [RECTANGLE], {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ وصف يجمع شرطي المستطيل معاً؟')),
    concepts: ['rectangle-definition'], skills: ['state-rectangle-definition'], sourceConcepts: ['u2-rectangle'],
    options: [
      optionText('q49-a', 'شكل رباعي زواياه الأربع قائمة'),
      optionText('q49-b', 'متوازي أضلاع فيه زاوية قائمة'),
      optionText('q49-c', 'شكل رباعي فيه ضلعان متقابلان متساويان'),
      optionText('q49-d', 'متوازي أضلاع أضلاعه الأربعة متساوية'),
    ],
    answer: 'q49-b',
    solution: {
      idea: rich(text('التعريف يحتاج توازي الأضلاع مع زاوية قائمة.')),
      rule: rich(text('المستطيل هو متوازي الأضلاع فيه زاوية قائمة.')),
      steps: [
        rich(text('«زواياه قائمة» وحدها لا تضمن التوازي صراحةً.')),
        rich(text('«متوازي أضلاع فيه زاوية قائمة» هو التعريف المطبوعة.')),
        rich(text('«أضلاعه متساوية» يصف المعيّن.')),
      ],
      finalAnswer: rich(text('متوازي أضلاع فيه زاوية قائمة.')),
      commonError: rich(text('الاكتفاء بذكر الزوايا القائمة.')),
    },
    originalityNote: 'يعيد تعريف المستطيل في ص 77 بترتيب بدائل جديد وموضع صحيح ثانٍ، ويختلف عن سؤال اختبار الدرس 9.',
  }),
  q(50, [RECTANGLE], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('في المستطيل '), math('ABCD'), text(' طول '), math('AB = 11 cm'), text('. ما طول '), math('CD'), text('؟')),
    concepts: ['rectangle-properties'], skills: ['use-opposite-sides'], sourceConcepts: ['u2-rectangle'],
    answer: { expected: '11', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('CD يقابل AB في المستطيل.')),
      rule: rich(text('كلّ ضلعين متقابلين في المستطيل متساويان.')),
      steps: [
        rich(text('بالترتيب A → B → C → D، الضلع CD يقابل AB.')),
        rich(math('CD = AB = 11 cm')),
      ],
      finalAnswer: rich(math('11 cm')),
      commonError: rich(text('استعمال قياس الضلع المجاور.')),
    },
    originalityNote: 'ينقل خاصّة الأضلاع المتقابلة إلى مستطيل بطول 11 cm بدل الأبعاد المطبوعة في ص 78–80.',
  }),
  q(51, [RECTANGLE], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('مستطيل طوله '), math('7 cm'), text(' وعرضه '), math('3 cm'), text('. ما محيطه؟')),
    concepts: ['rectangle-properties'], skills: ['compute-perimeter'], sourceConcepts: ['u2-rectangle'],
    coverage: { applications: ['perimeters'] },
    answer: { expected: '20', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('الطول يتكرّر مرّتين والعرض مرّتين.')),
      rule: rich(text('محيط المستطيل = 2 × (الطول + العرض).')),
      steps: [
        rich(math('7 + 3 = 10')),
        rich(math('2 × 10 = 20')),
      ],
      finalAnswer: rich(math('20 cm')),
      commonError: rich(text('جمع الطول والعرض مرّة واحدة (10).')),
    },
    originalityNote: 'يطلب المحيط من بعدين بسيطين بدل مجموع الأضلاع المطبوع، ويستعمل 7 و3 لا أبعاد الكتاب.',
  }),
  q(52, [RECTANGLE], {
    type: 'true-false', difficulty: 'medium',
    prompt: rich(text('كلّ مربّع مستطيل، وليس كلّ مستطيل مربّعاً.')),
    concepts: ['rectangle-definition'], skills: ['judge-inclusion'], sourceConcepts: ['u2-rectangle'],
    coverage: { commonErrors: ['reverse-inclusion-direction'] },
    answer: true,
    solution: {
      idea: rich(text('المربّع يحقق تعريف المستطيل مع شرط إضافي.')),
      rule: rich(text('المربّع مستطيل تساوى بعداه؛ فالشرط الإضافي يجعله أضيق.')),
      steps: [
        rich(text('كلّ مربّع زواياه قائمة وأضلاعه المتقابلة متوازية ← مستطيل.')),
        rich(text('مستطيل 5 × 2 ليس مربّعاً ← العكس غير صحيح.')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('الظن أن العلاقة متبادلة بين الشكلين.')),
    },
    originalityNote: 'يجمع الاتجاهين في عبارة واحدة بدل عبارتين منفصلتين كما في جدول ص 84.',
  }),
  q(53, [RECTANGLE], {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('أراد طالب تعيين الرأس '), math('N'), text(' للمستطيل '), math('KLMN'), text(' بعد رسم '), math('KL'), text(' و'), math('LM'), text(' متعامدين، فأقام عموداً من '), math('L'), text(' وعيّن '), math('N'), text(' عليه بحيث '), math('LN = KL'), text('. اختر التشخيص والتصحيح.')),
    concepts: ['rectangle-definition'], skills: ['diagnose-fourth-vertex'], sourceConcepts: ['u2-rectangle'],
    coverage: { commonErrors: ['confuse-adjacent-opposite'] },
    studentWork: rich(text('LN = KL'), text(' بدل '), math('LN = LM')),
    diagnoses: [
      optionText('q53-d1', 'العمود من L صحيح، لكن الطول المطلوب هو LM لأن LN يقابله'),
      optionText('q53-d2', 'يجب إقامة العمود من K لا من L'),
    ],
    corrections: [
      optionText('q53-c1', 'نعيّن N على العمود من L بحيث LN = LM'),
      optionText('q53-c2', 'نعيّن N على العمود من K بحيث KN = KL'),
    ],
    answer: { diagnosisId: 'q53-d1', correctionId: 'q53-c1' },
    solution: {
      idea: rich(text('الرأس الرابع يُحدَّد بتساوي الضلعين المتقابلين.')),
      rule: rich(text('في KLMN: KN يقابل LM، وMN يقابل KL.')),
      steps: [
        rich(text('العمود من L صحيح لأنه يحدّد جهة الضلع MN.')),
        rich(text('الضلع LN في المسألة يقابل LM، فيجب أن يساويه.')),
        rich(text('بما أن LM ≠ KL عموماً، فاستعمال KL خطأ.')),
      ],
      finalAnswer: rich(text('التشخيص: خلط الضلع المقابل بالمجاور؛ والتصحيح: '), math('LN = LM'), text('.')),
      commonError: rich(text('افتراض تساوي أضلاع المستطيل الأربعة.')),
    },
    originalityNote: 'يشخّص خطأ تعيين الرأس الرابع في مستطيل بأحرف جديدة، ويختلف عن خطأ اختبار درس المستطيل في موضع العمود.',
  }),
  q(54, [RECTANGLE], {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('مستطيلان متلاصقان على استقامة واحدة: أوّلهما طوله '), math('6 cm'), text(' والثاني طوله '), math('4 cm'), text('، وعرضهما المشترك '), math('3 cm'), text('. ما محيط الشكل الناتج؟')),
    concepts: ['rectangle-properties'], skills: ['compute-perimeter'], sourceConcepts: ['u2-rectangle'],
    coverage: { applications: ['perimeters'] },
    answer: { expected: '26', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('الشكل الناتج مستطيل طوله مجموع الطولين.')),
      rule: rich(text('الضلعان المتلاصقان يختفيان داخل الشكل فلا يُحسبان في المحيط.')),
      steps: [
        rich(math('6 + 4 = 10 cm'), text(' طولاً.')),
        rich(math('2 × (10 + 3) = 26')),
      ],
      finalAnswer: rich(math('26 cm')),
      commonError: rich(text('جمع محيطي المستطيلين (18 + 14 = 32) من دون حذف الضلع المشترك.')),
    },
    originalityNote: 'يجمع مستطيلين ويطلب المحيط الناتج، وهو تطبيق على الشكل المركّب بأبعاد جديدة كلياً.',
  }),

  /* ============================================================ الدرس 10: المربّع */
  q(55, [SQUARE], {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ وصف يجمع شرطي المربّع معاً؟')),
    concepts: ['square-definition'], skills: ['state-square-definition'], sourceConcepts: ['u2-square'],
    options: [
      optionText('q55-a', 'شكل رباعي أضلاعه متساوية'),
      optionText('q55-b', 'مستطيل طوله أكبر من عرضه'),
      optionText('q55-c', 'مستطيل تساوى بعداه'),
      optionText('q55-d', 'متوازي أضلاع فيه زاوية حادّة'),
    ],
    answer: 'q55-c',
    solution: {
      idea: rich(text('لا بدّ من شرط الزوايا القائمة وشرط تساوي الأبعاد معاً.')),
      rule: rich(text('المربّع مستطيل تساوى بعداه، أو معيّن فيه زاوية قائمة.')),
      steps: [
        rich(text('الأضلاع المتساوية وحدها تعطي معيّناً قد لا يحوي زاوية قائمة.')),
        rich(text('«مستطيل تساوى بعداه» يجمع الزوايا القائمة مع تساوي الأبعاد.')),
        rich(text('الزاوية الحادّة نقيض المطلوب.')),
      ],
      finalAnswer: rich(text('مستطيل تساوى بعداه.')),
      commonError: rich(text('الاكتفاء بتساوي الأضلاع.')),
    },
    originalityNote: 'يصوغ تعريف ص 81 ببدائل مختلفة عن سؤال اختبار الدرس وعن نصّ الكتاب، ويضع الصحيح في الموضع الثالث.',
  }),
  q(56, [SQUARE], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('مربّع '), math('PQRS'), text(' طول ضلعه '), math('8 cm'), text('. ما طول '), math('RS'), text('؟')),
    concepts: ['square-properties'], skills: ['use-equal-sides'], sourceConcepts: ['u2-square'],
    answer: { expected: '8', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('أضلاع المربّع الأربعة متساوية.')),
      rule: rich(text('كلّ ضلع في المربّع يساوي الضلع المعطى.')),
      steps: [
        rich(text('RS أحد الأضلاع الأربعة.')),
        rich(math('RS = PQ = 8 cm')),
      ],
      finalAnswer: rich(math('8 cm')),
      commonError: rich(text('استعمال ضلع مجاور بطول آخر كما في المستطيل.')),
    },
    originalityNote: 'ينقل خاصّة تساوي الأضلاع إلى مربّع بأحرف جديدة وطول 8 cm بدل 3 cm في مثال الكتاب.',
  }),
  q(57, [SQUARE], {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('مربّع محيطه '), math('32 cm'), text('؛ ما قياس ضلعه الواحد؟')),
    concepts: ['square-properties'], skills: ['compute-square-perimeter'], sourceConcepts: ['u2-square'],
    coverage: { applications: ['perimeters'] },
    answer: { expected: '8', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('المحيط أربعة أمثال الضلع.')),
      rule: rich(text('محيط المربّع = 4 × طول الضلع.')),
      steps: [
        rich(math('4 × s = 32')),
        rich(math('s = 8')),
      ],
      finalAnswer: rich(math('8 cm')),
      commonError: rich(text('القسمة على 2 كما في المستطيل.')),
    },
    originalityNote: 'يعكس علاقة المحيط بالضلع في المربّع، ويستعمل 32 بدل مضاعفات صغيرة.',
  }),
  q(58, [SQUARE], {
    type: 'true-false', difficulty: 'medium',
    prompt: rich(text('كلّ معيّن هو مربّع.')),
    concepts: ['square-definition'], skills: ['judge-inclusion-direction'], sourceConcepts: ['u2-square'],
    coverage: { commonErrors: ['reverse-inclusion-direction'] },
    answer: false,
    solution: {
      idea: rich(text('المعيّن لا يشترط زاوية قائمة.')),
      rule: rich(text('المربّع معيّن فيه زاوية قائمة؛ فالشرط الإضافي يجعله أضيق.')),
      steps: [
        rich(text('خذ معيّناً بزوايا 70° و110°.')),
        rich(text('أضلاعه متساوية لكن زواياه ليست قائمة، فهو ليس مربّعاً.')),
      ],
      finalAnswer: rich(text('خطأ.')),
      commonError: rich(text('عكس اتجاه العلاقة بين المعيّن والمربّع.')),
    },
    originalityNote: 'يستعمل العبارة التي وردت في جدول ص 84 لكن بطلب الحكم عليها منفردةً مع تفسير، بعد دوران أنماط الأسئلة.',
  }),
  q(59, [SQUARE], {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('مربّع '), math('XWQP'), text(' ضلعه '), math('4 cm'), text(' ملاصق من يمينه مستطيل '), math('WSRQ'), text(' وفيه '), math('QR = 9 cm'), text('، والنقاط '), math('X'), text(' و'), math('W'), text(' و'), math('S'), text(' على استقامة واحدة. أوجد '), math('XS'), text('.')),
    concepts: ['square-properties'], skills: ['combine-collinear-segments'], sourceConcepts: ['u2-square'],
    coverage: { applications: ['perimeters'] },
    answer: { expected: '13', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('XS مجموع ضلع المربّع وضلع المستطيل على الخط نفسه.')),
      rule: rich(text('أضلاع المربّع متساوية، وضلعا المستطيل المتقابلان متساويان.')),
      steps: [
        rich(math('XW = 4 cm')),
        rich(math('WS = QR = 9 cm')),
        rich(math('XS = 4 + 9 = 13 cm')),
      ],
      finalAnswer: rich(math('13 cm')),
      commonError: rich(text('طرح بدل جمع، أو إسقاط ضلع المربّع.')),
    },
    originalityNote: 'يعيد بناء الشكل المركّب في تدرّب ④ ص 84 بأرقام جديدة (4 و9) وطول مطلوب مختلف.',
  }),
  q(60, [SQUARE], {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('قال طالب: «المربّع معيّن، لذلك المعيّن مربّع أيضاً». اختر التشخيص والتصحيح.')),
    concepts: ['square-definition'], skills: ['diagnose-inclusion'], sourceConcepts: ['u2-square'],
    coverage: { thinking: ['reason-about-inclusion'], commonErrors: ['reverse-inclusion-direction'] },
    studentWork: rich(text('المربّع معيّن ⇐ المعيّن مربّع')),
    diagnoses: [
      optionText('q60-d1', 'العلاقة في اتجاه واحد: كلّ مربّع معيّن، وليس كلّ معيّن مربّعاً'),
      optionText('q60-d2', 'العبارة صحيحة لأن كلّاً منهما متوازي أضلاع'),
    ],
    corrections: [
      optionText('q60-c1', 'المعيّن يحتاج زاوية قائمة ليكون مربّعاً'),
      optionText('q60-c2', 'كلّ معيّن مربّع بلا شرط إضافي'),
    ],
    answer: { diagnosisId: 'q60-d1', correctionId: 'q60-c1' },
    solution: {
      idea: rich(text('المربّع أضيق من المعيّن، فالعكس يحتاج شرطاً.')),
      rule: rich(text('الاحتواء من المربّع إلى المعيّن لا العكس.')),
      steps: [
        rich(text('كلّ مربّع معيّن لأن أضلاعه الأربعة متساوية.')),
        rich(text('معيّن بزاوية 70° ليس مربّعاً ← العكس خاطئ.')),
        rich(text('الشرط الناقص في العكس هو وجود زاوية قائمة.')),
      ],
      finalAnswer: rich(text('التشخيص: عكس اتجاه الاحتواء؛ والتصحيح: المعيّن يحتاج زاوية قائمة.')),
      commonError: rich(text('الخلط بين الشرط اللازم والشرط الكافي.')),
    },
    originalityNote: 'يشخّص عكس الاحتواء بين المربّع والمعيّن كمثال على الاستدلال الخاطئ، لا مجرّد الحكم على عبارة.',
  }),
]

const definition = defineUnitTest({
  id: testId,
  unitId: 'unit-2',
  title: 'اختبار الوحدة الثانية',
  description: rich(text('اختبار الوحدة الثانية الشامل: ستون سؤالاً تغطّي الدروس العشرة كلّها، من مقارنة الأعداد الطبيعية إلى المربّع، وكلّ درس منها بستة أسئلة مستقلّة.')),
  instructions: rich(text('أجب عن الأسئلة الستين ثمّ سلّم المحاولة لتظهر النتيجة، ثمّ راجع الحلول المفصّلة لكلّ سؤال. لا يظهر أيّ حلّ قبل التسليم، ويمكنك إعادة المحاولة.')),
  lessonIds: [COMPARE, MULTIPLY, LCM, FRACTIONS_ONE, FRACTIONS_TWO, TENTHS, HUNDREDTHS, THOUSANDTHS, RECTANGLE, SQUARE],
  lessonLabels: {
    [COMPARE]: 'مقارنة الأعداد الطبيعية وترتيبها',
    [MULTIPLY]: 'ضرب الأعداد الطبيعية',
    [LCM]: 'المضاعف المشترك الأصغر',
    [FRACTIONS_ONE]: 'الكسور (1)',
    [FRACTIONS_TWO]: 'الكسور (2)',
    [TENTHS]: 'الأجزاء العشرية (1)',
    [HUNDREDTHS]: 'الأجزاء العشرية (2)',
    [THOUSANDTHS]: 'الأجزاء العشرية (3)',
    [RECTANGLE]: 'المستطيل',
    [SQUARE]: 'المربّع',
  },
  questions,
  sourceConcepts: [
    { id: 'u2-compare-place-value', label: 'مقارنة الأعداد الطبيعية بقيمة المنزلة', lessonId: COMPARE, pages: [44, 45, 46] },
    { id: 'u2-compare-order', label: 'ترتيب الأعداد تصاعدياً وتنازلياً', lessonId: COMPARE, pages: [45, 46, 47] },
    { id: 'u2-multiply-algorithm', label: 'الضرب العمودي والحمل والإزاحة', lessonId: MULTIPLY, pages: [48, 49] },
    { id: 'u2-multiply-patterns', label: 'أنماط الضرب في العشرات والمئات والألوف', lessonId: MULTIPLY, pages: [49, 50, 51] },
    { id: 'u2-lcm', label: 'المضاعف المشترك الأصغر لعددين أو ثلاثة', lessonId: LCM, pages: [52, 53] },
    { id: 'u2-fractions-compare', label: 'مقارنة الكسور وترتيبها وتوحيد المقامات', lessonId: FRACTIONS_ONE, pages: [54, 55, 56, 57] },
    { id: 'u2-fractions-convert', label: 'تحويل الكسر المركّب والعدد الكسري', lessonId: FRACTIONS_TWO, pages: [58, 59, 60, 61] },
    { id: 'u2-tenths', label: 'الأجزاء من عشرة كتابةً وقراءةً ومقارنةً', lessonId: TENTHS, pages: [62, 63, 64, 65] },
    { id: 'u2-hundredths', label: 'الأجزاء من مئة والتحويل والمقارنة', lessonId: HUNDREDTHS, pages: [66, 67, 68, 69, 70, 71] },
    { id: 'u2-thousandths', label: 'الأجزاء من ألف والتحويل والجمع والترتيب', lessonId: THOUSANDTHS, pages: [72, 73, 74, 75, 76] },
    { id: 'u2-rectangle', label: 'تعريف المستطيل وخواصّه ورسمه', lessonId: RECTANGLE, pages: [77, 78, 79, 80] },
    { id: 'u2-square', label: 'تعريف المربّع وخواصّه والأطوال المركّبة', lessonId: SQUARE, pages: [81, 82, 83, 84] },
  ],
  conceptLabels: {
    'compare-by-place-value': 'المقارنة بقيمة المنزلة',
    'order-ascending-descending': 'الترتيب التصاعدي والتنازلي',
    'multiply-patterns': 'أنماط الضرب في قوى العشرة',
    'multiplication-algorithm': 'خوارزمية الضرب العمودي',
    'multiplication-properties': 'خواصّ الضرب والتوزيع',
    'multiples-and-lcm': 'المضاعفات والمضاعف المشترك الأصغر',
    'fraction-comparison': 'مقارنة الكسور',
    'equivalent-fractions': 'الكسور المكافئة وتوحيد المقامات',
    'mixed-numbers': 'الأعداد الكسرية',
    'improper-fractions': 'الكسور المركّبة',
    'tenths': 'الأعشار',
    'hundredths': 'أجزاء المئة',
    'thousandths': 'أجزاء الألف',
    'rectangle-definition': 'تعريف المستطيل',
    'rectangle-properties': 'خواصّ المستطيل وأطواله',
    'square-definition': 'تعريف المربّع',
    'square-properties': 'خواصّ المربّع وأطواله',
  },
  skillLabels: {
    'compare-multi-digit': 'مقارنة أعداد متعدّدة المنازل',
    'order-three-numbers': 'ترتيب ثلاثة أعداد',
    'diagnose-comparison-error': 'تشخيص خطأ في المقارنة',
    'build-largest-number': 'تكوين أكبر عدد من أرقام معطاة',
    'multiply-by-tens': 'الضرب في العشرات والمئات',
    'apply-multiplication-property': 'استعمال خواصّ الضرب',
    'multiply-two-digit': 'الضرب العمودي من رقمين',
    'apply-distributive': 'تطبيق القانون التوزيعي',
    'match-pattern': 'مطابقة نواتج أنماط الضرب',
    'diagnose-carry-error': 'تشخيص خطأ الحمل أو الإزاحة',
    'find-lcm-two': 'إيجاد مضاعف مشترك أصغر لعددين',
    'find-lcm-three': 'إيجاد مضاعف مشترك أصغر لثلاثة أعداد',
    'identify-multiples': 'تمييز مضاعفات عدد',
    'match-lcm-situation': 'مطابقة موقف حياتي بالمفهوم المناسب',
    'compare-fractions': 'مقارنة كسرين',
    'recognize-equivalent-fractions': 'تمييز الكسور المكافئة',
    'find-common-denominator': 'إيجاد مقام مشترك',
    'order-fractions': 'ترتيب الكسور',
    'diagnose-fraction-comparison': 'تشخيص خطأ في مقارنة الكسور',
    'find-missing-numerator': 'إيجاد البسط الناقص',
    'convert-improper-to-mixed': 'تحويل كسر مركّب إلى عدد كسري',
    'convert-mixed-to-improper': 'تحويل عدد كسري إلى كسر مركّب',
    'find-remainder': 'إيجاد الباقي في التحويل',
    'diagnose-conversion': 'تشخيص خطأ في التحويل',
    'read-tenths': 'قراءة الأعشار لفظاً',
    'compare-tenths': 'مقارنة أعداد عشرية',
    'convert-tenths': 'تحويل الأعشار بين الكتابتين',
    'add-tenths': 'جمع الأعشار',
    'order-decimals': 'ترتيب الأعداد العشرية',
    'match-fraction-decimal': 'مطابقة الكسر بعدله العشري',
    'convert-hundredths': 'تحويل أجزاء المئة',
    'compare-hundredths': 'مقارنة أجزاء المئة',
    'add-hundredths': 'جمع أجزاء المئة',
    'identify-hundredths-digit': 'تحديد منزلة المئة',
    'select-equal-decimals': 'اختيار التمثيلات المتكافئة',
    'convert-thousandths': 'تحويل أجزاء الألف',
    'compare-thousandths': 'مقارنة أجزاء الألف',
    'add-thousandths': 'جمع أجزاء الألف مع الحمل',
    'order-thousandths': 'ترتيب أجزاء الألف',
    'diagnose-decimal-reading': 'تشخيص قراءة عشرية خاطئة',
    'state-rectangle-definition': 'ذكر تعريف المستطيل',
    'use-opposite-sides': 'استعمال تساوي الأضلاع المتقابلة',
    'compute-perimeter': 'حساب محيط شكل مركّب',
    'diagnose-fourth-vertex': 'تشخيص خطأ تعيين الرأس الرابع',
    'judge-inclusion': 'الحكم على علاقة الاحتواء',
    'state-square-definition': 'ذكر تعريف المربّع',
    'use-equal-sides': 'استعمال تساوي أضلاع المربّع',
    'compute-square-perimeter': 'حساب محيط المربّع والعكس',
    'judge-inclusion-direction': 'تحديد اتجاه الاحتواء',
    'combine-collinear-segments': 'جمع قطع على استقامة واحدة',
    'diagnose-inclusion': 'تشخيص استدلال احتواء خاطئ',
  },
  applicationLabels: {
    perimeters: 'أطوال ومحيطات في أشكال مركّبة',
  },
  thinkingLabels: {
    'evaluate-comparison-reasoning': 'تقويم تعليل مقارنة',
    'reason-about-place-value': 'التفكير بقيمة المنزلة عكسياً',
    'combine-three-constraints': 'الجمع بين ثلاثة شروط عددية',
    'interpret-lcm-in-context': 'تفسير المضاعف في موقف حياتي',
    'reason-about-equivalence': 'التفكير العكسي في تكافؤ الكسور',
    'carry-across-three-places': 'الحمل عبر ثلاث منازل عشرية',
    'align-place-values': 'محاذاة المنازل قبل الجمع',
    'reason-about-inclusion': 'التفكير في علاقات الاحتواء',
  },
  commonErrorLabels: {
    'compare-by-digits-count-only': 'المقارنة بعدد الأرقام أو بلا احترام المنازل',
    'forget-carry': 'إهمال الحمل في العمليات',
    'compare-denominators-only': 'مقارنة المقامات منفردة',
    'swap-whole-and-remainder': 'تبديل موضع الصحيح والبسط',
    'confuse-adjacent-opposite': 'خلط الضلع المجاور بالمقابل',
    'reverse-inclusion-direction': 'عكس اتجاه الاحتواء بين الأشكال',
    'misread-place-value': 'قراءة المنزلة العشرية خطأً',
  },
})

export default definition
