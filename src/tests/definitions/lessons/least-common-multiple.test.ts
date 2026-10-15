import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/**
 * Unit 2, Lesson 3 test — exactly 20 items (6 basic, 7 medium, 4 advanced, 3 thinking).
 * Difficulty balance matches existing lessons; all items use NEW contexts and values so none
 * copies a printed exercise from pp. 52–53. Solutions are revealed only after submission.
 */
const testId = 'lesson-least-common-multiple-test'
const lessonId = 'least-common-multiple'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })

// Concepts/skills labels
const conceptLabels: Record<string, string> = {
  'multiples-list': 'كتابة المضاعفات',
  'lcm-two': 'م.م.أ لعددين',
  'lcm-three': 'م.م.أ لثلاثة أعداد',
  'lcm-zero': 'استبعاد الصفر',
  'lcm-patterns': 'أنماط الأصفار في م.م.أ',
  'lcm-word-problems': 'مسائل حياتية دورية',
  'lcm-vs-gcd': 'التمييز بين م.م.أ وق.م.أ',
}
const skillLabels: Record<string, string> = {
  'list-multiples': 'تعداد المضاعفات',
  'find-common': 'إيجاد المضاعفات المشتركة',
  'compute-lcm': 'حساب المضاعف المشترك الأصغر',
  'solve-word': 'حل مسألة كلامية',
  'distinguish': 'التمييز بين مفاهيم',
}
const applicationLabels: Record<string, string> = {
  'lasers-sync': 'تزامن أجهزة/إشارات',
  'schedule': 'المواعيد والجداول',
  'farming': 'الريّ والمبيدات',
  'transport': 'مواعيد الحافلات',
}
const thinkingLabels: Record<string, string> = {
  'verify': 'التحقق بالقسمة',
  'generalize': 'تعميم نمط الأصفار',
  'why-smallest': 'تفسير سبب كونه الأصغر',
}
const commonErrorLabels: Record<string, string> = {
  'include-zero': 'إدراج الصفر خطأ',
  'gcd-confusion': 'الخلط مع ق.م.أ',
  'two-only': 'الاقتصار على قائمتين (مع 3 أعداد)',
  'multiply-directly': 'ضرب الأعداد مباشرة',
}

// Helper: compute LCM via GCD for answer integrity
const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b))
const lcm2 = (a: number, b: number) => (a * b) / g(a, b)
const lcm3 = (a: number, b: number, c: number) => lcm2(lcm2(a, b), c)

const questions: QuestionDefinition[] = [
  // ====== BASIC (6) ======
  q(1, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('ما المضاعف المشترك الأصغر للعددين 2 و5؟')),
    concepts: ['lcm-two'], skills: ['compute-lcm'], sourceConcepts: ['two-numbers'],
    answer: { expected: String(lcm2(2, 5)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نكتب مضاعفات كل عدد ثم نبحث عن أول مشترك > 0.')),
      rule: rich(text('م.م.أ هو أصغر مضاعف مشترك أكبر من الصفر.')),
      steps: [
        rich(text('مضاعفات 2: 2، 4، 6، 8، 10، ...')),
        rich(text('مضاعفات 5: 5، 10، 15، ...')),
        rich(text('أول مشترك هو 10.')),
      ],
      finalAnswer: rich(math(String(lcm2(2, 5)))),
      commonError: rich(text('اختيار 1 (هو ق.م.أ لا م.م.أ) أو 20 (ضرب العددين بعد إيجاد الأصغر).')),
    },
    originalityNote: 'زوج بسيط (2،5) لا يطابق أي مثال مطبوع (المطبوع 3&4، 3&5، 4&6&8، 4&5، 8&5&4).',
  }),
  q(2, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('العبارة التالية صحيحة: المضاعف المشترك الأصغر للعددين 6 و9 هو 54.'), math('54'), text('.')),
    concepts: ['lcm-two', 'lcm-vs-gcd'], skills: ['compute-lcm', 'distinguish'], sourceConcepts: ['two-numbers'],
    coverage: { commonErrors: ['multiply-directly'] },
    answer: false,
    solution: {
      idea: rich(text('لا نضرب العددين دائماً؛ 54 = 6×9 لكنه ليس الأصغر.'),),
      steps: [
        rich(text('مضاعفات 6: 6، 12، 18، 24، ...')),
        rich(text('مضاعفات 9: 9، 18، 27، ...')),
        rich(text('أول مشترك هو 18 لا 54.')),
      ],
      finalAnswer: rich(text('العبارة خاطئة؛ الصواب '), math(String(lcm2(6, 9))), text('.')),
      commonError: rich(text('ضرب العددين مباشرة دون النظر إلى العوامل المشتركة.')),
    },
    originalityNote: 'عبارة خطأ مقصود (6،9) لا ترد في التمارين المطبوعة.',
  }),
  q(3, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('إذا انطلق حافلان من المحطة معاً، الأول كل 8 دقائق والثاني كل 12 دقيقة، فبعد كم دقيقة يلتقيان معاً من جديد؟')),
    concepts: ['lcm-two', 'lcm-word-problems'], skills: ['solve-word', 'compute-lcm'], sourceConcepts: ['two-numbers', 'word-problems'],
    coverage: { applications: ['transport'], commonErrors: ['gcd-confusion'] },
    options: [optionText('q03-a', '4 دقائق'), option('q03-b', math('24'), text(' دقيقة')), optionText('q03-c', '96 دقيقة'), optionText('q03-d', '20 دقيقة')],
    answer: 'q03-b',
    solution: {
      idea: rich(text('مطلوب م.م.أ (8، 12).')),
      rule: rich(text('الحافلات تلتقي عند مضاعفات مشتركة؛ الأصغر هو الجواب.')),
      steps: [
        rich(text('مضاعفات 8: 8، 16، 24، 32، ...')),
        rich(text('مضاعفات 12: 12، 24، 36، ...')),
        rich(text('أول مشترك هو 24.')),
      ],
      finalAnswer: rich(math(String(lcm2(8, 12))), text(' دقيقة.')),
      commonError: rich(text('اختيار 4 (هو ق.م.أ = فارق الدقائق بين مرور الأول والثاني، لا موعد اللقاء).')),
    },
    originalityNote: 'سياق حافلات جديد بزوج (8،12) غير مذكور في الكتاب.',
  }),
  q(4, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('أصغر عدد طبيعي أكبر من الصفر يقبل القسمة على العددين 7 و3 معاً هو:')),
    concepts: ['lcm-two'], skills: ['compute-lcm'], sourceConcepts: ['two-numbers'],
    answer: { expected: String(lcm2(7, 3)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('7 و3 أوليان نسبياً؛ م.م.أ = حاصل ضربهما.')),
      steps: [
        rich(text('لا قاسم مشترك أكبر من 1 بين 7 و3.')),
        rich(math(`7 × 3 = ${lcm2(7, 3)}`), text(' وهو أول مشترك.')),
      ],
      finalAnswer: rich(math(String(lcm2(7, 3)))),
      commonError: rich(text('اختيار 1 (ق.م.أ) أو 10 (الجمع).')),
    },
    originalityNote: 'زوج أعداد أولية جديد لم يرد في تمارين الكتاب.',
  }),
  q(5, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('الصفر من المضاعفات المشتركة لأي عددين، لكنه لا يُعتبر المضاعف المشترك الأصغر في المسائل التي تسأل «متى يحدث من جديد؟».')),
    concepts: ['lcm-zero'], skills: ['distinguish'], sourceConcepts: ['exclude-zero'],
    answer: true,
    solution: {
      idea: rich(text('0 مضاعف لأي عدد لكنه يرمز للحظة البداية، ونحن نبحث عما بعدها.')),
      steps: [
        rich(text('0 يقبل القسمة على أي عدد.')),
        rich(text('لكنه لا يمثل زمناً جديداً بعد البداية.')),
        rich(text('لذلك نطلب أول مشترك > 0.')),
      ],
      finalAnswer: rich(text('العبارة صحيحة.')),
      commonError: rich(text('إعطاء 0 كجواب لمسائل «بعد البداية».')),
    },
    originalityNote: 'سؤال مفاهيمي مباشر عن استبعاد الصفر، غير مطبوع نصاً.',
  }),
  q(6, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أي من الأعداد الآتية هو مضاعف مشترك للعددين 6 و9؟')),
    concepts: ['lcm-two'], skills: ['find-common'], sourceConcepts: ['two-numbers'],
    options: [option('q06-a', math('18')), option('q06-b', math('3')), option('q06-c', math('15')), option('q06-d', math('54'))],
    answer: 'q06-a',
    solution: {
      idea: rich(text('نبحث عن عدد يقبل القسمة على 6 و9 معاً وهو الأصغر بين الخيارات.')),
      steps: [
        rich(text('18 ÷ 6 = 3 و18 ÷ 9 = 2، إذن 18 مشترك.')),
        rich(text('3 أصغر من كليهما؛ 15 لا يقبل القسمة على 6 أو 9؛ 54 مشترك لكنه ليس الأصغر المطلوب هنا إذا أردنا الأول.')),
        rich(text('ملاحظة: السؤال طلب مشتركاً فقط، و18 هو الأصغر بين الخيارات المشتركة.')),
      ],
      finalAnswer: rich(math('18')),
      commonError: rich(text('اختيار 3 لأنه يقسم العددين، لكنه قاسم لا مضاعف.')),
    },
    originalityNote: 'اختيار متعدد يتطلب تمييز «مشترك» وليس «الأصغر»، مع خيار ق.م.أ كمشتت.',
  }),

  // ====== MEDIUM (7) ======
  q(7, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('تضيء إشارتان مروريتان معاً الآن. الأولى تضيء كل 9 ثوان، والثانية كل 12 ثانية. بعد كم ثانية ستضيئان معاً للمرة الأولى بعد الآن؟')),
    concepts: ['lcm-two', 'lcm-word-problems'], skills: ['solve-word', 'compute-lcm'], sourceConcepts: ['two-numbers', 'word-problems'],
    coverage: { applications: ['lasers-sync'] },
    answer: { expected: String(lcm2(9, 12)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('م.م.أ (9، 12) يعطي أول موعد تزامن.')),
      steps: [
        rich(text('مضاعفات 9: 9، 18، 27، 36، ...')),
        rich(text('مضاعفات 12: 12، 24، 36، ...')),
        rich(text('أول مشترك هو 36.')),
      ],
      finalAnswer: rich(text('بعد '), math(String(lcm2(9, 12))), text(' ثانية.')),
      commonError: rich(text('اختيار 108 = 9×12 (تجاهل القاسم المشترك 3).')),
    },
    originalityNote: 'سياق إشارات مرور بزوج (9،12) غير موجود في الكتاب.',
  }),
  q(8, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('ما المضاعف المشترك الأصغر للأعداد 6 و8 و12؟')),
    concepts: ['lcm-three'], skills: ['compute-lcm'], sourceConcepts: ['three-numbers'],
    coverage: { commonErrors: ['two-only'] },
    answer: { expected: String(lcm3(6, 8, 12)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نبحث عن أول مشترك بين القوائم الثلاث.'),),
      steps: [
        rich(text('مضاعفات 6: 6، 12، 18، 24، ...')),
        rich(text('مضاعفات 8: 8، 16، 24، ...')),
        rich(text('مضاعفات 12: 12، 24، ...')),
        rich(text('أول مشترك بين الثلاثة هو 24.')),
      ],
      finalAnswer: rich(math(String(lcm3(6, 8, 12)))),
      commonError: rich(text('اختيار 12 لأنه مشترك بين 6 و12 لكنه لا يقبل القسمة على 8.')),
    },
    originalityNote: 'ثلاثية أعداد جديدة (6،8،12) غير مذكورة في تمارين الكتاب (الكتاب يعرض 4،6،8 و8،5،4).',
  }),
  q(9, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('وجد بائع أنه يبيع شوكولاتة كل 6 أيام، وبيتي فور كل 8 أيام، وكيكاً كل 12 يوماً. إذا باع الثلاثة اليوم، فبعد كم يوماً سيبيع الثلاثة معاً؟')),
    concepts: ['lcm-three', 'lcm-word-problems'], skills: ['solve-word', 'compute-lcm'], sourceConcepts: ['three-numbers', 'word-problems'],
    coverage: { applications: ['schedule'] },
    answer: { expected: String(lcm3(6, 8, 12)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نحسب م.م.أ للدورات الثلاث: 6، 8، 12.')),
      steps: [
        rich(text('مضاعفات كل دورة حتى اللقاء المشترك.')),
        rich(text('أول مشترك بينها هو 24.')),
      ],
      finalAnswer: rich(text('بعد '), math(String(lcm3(6, 8, 12))), text(' يوماً.')),
      commonError: rich(text('الاقتصار على مشترك بين اثنين كـ 24 صحيح هنا لكن الطالب قد يختار 12 خطأً (لا يقبل القسمة على 8).')),
    },
    originalityNote: 'سياق حلويات بائع بثلاث دورات جديدة غير المطبوع (فلاح/مبيدات 4 و5 وثنائي).',
  }),
  q(10, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('أي الأزواج الآتية له مضاعف مشترك أصغر مساوٍ لحاصل ضربهما؟')),
    concepts: ['lcm-two', 'lcm-vs-gcd'], skills: ['distinguish'], sourceConcepts: ['two-numbers'],
    options: [option('q10-a', math('4 و 6')), option('q10-b', math('5 و 7')), option('q10-c', math('8 و 12')), option('q10-d', math('9 و 15'))],
    answer: 'q10-b',
    solution: {
      idea: rich(text('عندما يكون قاسم مشترك أكبر من 1، يكون م.م.أ أصغر من حاصل الضرب؛ وفي العددين الأوليين نسبياً يتساوىان.')),
      steps: [
        rich(text('5 و7 عددان أوليان نسبياً (ق.م.أ = 1).')),
        rich(math('م.م.أ (5،7) = 5 × 7 = 35')),
        rich(text('في بقية الأزواج يوجد قاسم مشترك > 1، فم.م.أ أصغر من حاصل الضرب.')),
      ],
      finalAnswer: rich(math('5 و 7')),
      commonError: rich(text('اختيار زوج يضرب لتوهم أنّ 4×6=24 هو المضاعف الأصغر (الصواب 12).')),
    },
    originalityNote: 'سؤال تصنيفي بين 4 أزواج، وهو غير موجود في التمارين.',
  }),
  q(11, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('أوجد أصغر عدد طبيعي يُمكن قسمته على 10 وعلى 15 من دون باقٍ.')),
    concepts: ['lcm-two'], skills: ['compute-lcm'], sourceConcepts: ['two-numbers'],
    answer: { expected: String(lcm2(10, 15)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('مضاعفات 10: 10، 20، 30، ...؛ مضاعفات 15: 15، 30، 45، ...؛ أول مشترك هو 30.')),
      steps: [
        rich(text('مضاعفات 10: 10، 20، 30، ...')),
        rich(text('مضاعفات 15: 15، 30، ...')),
        rich(text('أول مشترك هو 30.')),
      ],
      finalAnswer: rich(math(String(lcm2(10, 15)))),
      commonError: rich(text('اختيار 5 (ق.م.أ) أو 150 (ضرب مباشر).')),
    },
    originalityNote: 'زوج جديد (10،15) لا يطابق تمارين الكتاب.',
  }),
  q(12, {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابق كل زوج أعداد مع مضاعفه المشترك الأصغر.')),
    concepts: ['lcm-two'], skills: ['compute-lcm'], sourceConcepts: ['two-numbers'],
    left: [optionText('q12-l1', '(3 ، 7)'), optionText('q12-l2', '(6 ، 9)'), optionText('q12-l3', '(4 ، 10)'), optionText('q12-l4', '(12 ، 18)')],
    right: [option('q12-r1', math('18')), option('q12-r2', math('20')), option('q12-r3', math('21')), option('q12-r4', math('36'))],
    answer: [
      { leftId: 'q12-l1', rightId: 'q12-r3' },
      { leftId: 'q12-l2', rightId: 'q12-r1' },
      { leftId: 'q12-l3', rightId: 'q12-r2' },
      { leftId: 'q12-l4', rightId: 'q12-r4' },
    ],
    solution: {
      idea: rich(text('احسب م.م.أ لكل زوج على حدة.')),
      steps: [
        rich(math('م.م.أ (3،7) = 21')),
        rich(math('م.م.أ (6،9) = 18')),
        rich(math('م.م.أ (4،10) = 20')),
        rich(math('م.م.أ (12،18) = 36')),
      ],
      finalAnswer: rich(text('(3،7)→21؛ (6،9)→18؛ (4،10)→20؛ (12،18)→36.')),
      commonError: rich(text('ضرب كل زوج دون مراعاة القواسم المشتركة.')),
    },
    originalityNote: 'مطابقة بأربعة أزواج جديدة بقيم غير مذكورة.',
  }),
  q(13, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('تدور ثلاثة عجلات: الأول كل 4 أقلام، الثاني كل 6 أقلام، الثالث كل 10 أقلام. إذا كانت النقاط على العجلات متطابقة الآن، فبعد كم قلم تتطابق من جديد؟')),
    concepts: ['lcm-three', 'lcm-word-problems'], skills: ['solve-word', 'compute-lcm'], sourceConcepts: ['three-numbers', 'word-problems'],
    coverage: { applications: ['schedule'] },
    answer: { expected: String(lcm3(4, 6, 10)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('م.م.أ (4،6،10) يعطي أول تطابق.')),
      steps: [
        rich(text('مضاعفات 4: 4،8،12،16،20،24،28،32،36،40،44،48،52،56،60،...')),
        rich(text('مضاعفات 6: 6،12،18،24،30،36،42،48،54،60،...')),
        rich(text('مضاعفات 10: 10،20،30،40،50،60،...')),
        rich(text('أول مشترك هو 60.')),
      ],
      finalAnswer: rich(text('بعد '), math(String(lcm3(4, 6, 10))), text(' قلماً.')),
      commonError: rich(text('اختيار 30 أو 20 لأنهما مشتركان بين اثنتين فقط.')),
    },
    originalityNote: 'سياق عجلات/أقلام بثلاثية (4،6،10) جديد.',
  }),

  // ====== ADVANCED (4) ======
  q(14, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('ما المضاعف المشترك الأصغر للأعداد 3 و6 و9 و12؟')),
    concepts: ['lcm-three'], skills: ['compute-lcm'], sourceConcepts: ['three-numbers'],
    coverage: { commonErrors: ['two-only'], thinking: ['verify'] },
    answer: { expected: String(lcm3(lcm2(3, 6), 9, 12)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نبحث عن أول مشترك بين القوائم الأربع؛ يمكن الاستناد إلى أكبر عدد (12) والبحث في مضاعفاته.')),
      steps: [
        rich(text('مضاعفات 12: 12، 24، 36، ...')),
        rich(text('12: لا تقبل القسمة على 9.')),
        rich(text('24: لا تقبل القسمة على 9.')),
        rich(text('36: 36 ÷ 3 =12، 36 ÷ 6=6، 36 ÷ 9=4، 36 ÷ 12=3. إذن 36 هو م.م.أ.')),
      ],
      finalAnswer: rich(math(String(lcm3(lcm2(3, 6), 9, 12)))),
      commonError: rich(text('الاقتصار على أكبر عدد (12) دون التحقق من قابليته للقسمة على 9.')),
    },
    originalityNote: 'أربعة أعداد (لا ثلاثة) بتجمع جديد، يفوق مطبوع الكتاب.',
  }),
  q(15, {
    type: 'single-choice', difficulty: 'advanced',
    prompt: rich(text('يعلن جهاز إنذار صوتاً كل 15 ثانية، ووميضاً كل 20 ثانية، واهتزازاً كل 30 ثانية. إذا حدث الثلاثة معاً الآن، فبعد كم ثانية سيحدث الثلاثة مجدداً؟')),
    concepts: ['lcm-three', 'lcm-word-problems'], skills: ['solve-word', 'compute-lcm'], sourceConcepts: ['three-numbers', 'word-problems'],
    coverage: { applications: ['lasers-sync'] },
    options: [optionText('q15-a', '30'), optionText('q15-b', '60'), optionText('q15-c', '90'), option('q15-d', math('9000'))],
    answer: 'q15-b',
    solution: {
      idea: rich(text('م.م.أ (15، 20، 30).')),
      steps: [
        rich(text('مضاعفات 15: 15،30،45،60،...')),
        rich(text('مضاعفات 20: 20،40،60،...')),
        rich(text('مضاعفات 30: 30،60،90،...')),
        rich(text('أول مشترك بين الثلاثة هو 60.')),
      ],
      finalAnswer: rich(math('60'), text(' ثانية.')),
      commonError: rich(text('اختيار 30 (لا يقبل القسمة على 20) أو ضرب الأعداد جميعاً (9000).')),
    },
    originalityNote: 'سياق إنذار بثلاث خواص (صوت/وميض/اهتزاز) غير موجود مطبوعاً.',
  }),
  q(16, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('باستعمال الأنماط التي لاحظتها، ما المضاعف المشترك الأصغر للعددين 50 و75؟')),
    concepts: ['lcm-two', 'lcm-patterns'], skills: ['compute-lcm'], sourceConcepts: ['two-numbers'],
    coverage: { thinking: ['generalize'], commonErrors: ['multiply-directly'] },
    answer: { expected: String(lcm2(50, 75)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('إذا أخذنا (5،7) =35، فم.م.أ (50،75) يتناسب بمضاعفة مشتركة. نحسب مباشرة.')),
      steps: [
        rich(text('50 = 25 × 2؛ 75 = 25 × 3.')),
        rich(text('م.م.أ = 25 × 2 × 3 = 150.')),
        rich(text('نتحقق: 150 ÷ 50 =3، 150 ÷ 75=2.')),
      ],
      finalAnswer: rich(math(String(lcm2(50, 75)))),
      commonError: rich(text('ضرب العددين 50×75=3750 (تجاهل العامل المشترك 25).')),
    },
    originalityNote: 'زوج بأصفار داخلية (50،75) لاختبار تعميم نمط الأصفار، لا يطابق أي تمرين مطبوع.',
  }),
  q(17, {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('سُئل طالب عن م.م.أ (6،10) فأجاب بـ 60. ما الخطأ في إجابته؟')),
    concepts: ['lcm-two', 'lcm-vs-gcd'], skills: ['distinguish'], sourceConcepts: ['two-numbers'],
    coverage: { commonErrors: ['multiply-directly'], thinking: ['why-smallest'] },
    studentWork: rich(text('الطالب: «بما أن 6 × 10 = 60 فإن المضاعف المشترك الأصغر هو 60».')),
    diagnoses: [
      optionText('q17-d1', 'أجاب بحاصل ضرب العددين متجاهلاً العامل المشترك 2.'),
      optionText('q17-d2', 'أجاب بالقاسم المشترك الأكبر.'),
      optionText('q17-d3', 'استعمل الصفر في القائمة.'),
      optionText('q17-d4', 'ارتكب خطأ حسابياً في 6×10.'),
    ],
    corrections: [
      option('q17-c1', math('30')),
      option('q17-c2', math('2')),
      option('q17-c3', math('60')),
      option('q17-c4', math('6')),
    ],
    answer: { diagnosisId: 'q17-d1', correctionId: 'q17-c1' },
    solution: {
      idea: rich(text('م.م.أ (6،10) = 30، وليس 60.')),
      steps: [
        rich(text('مضاعفات 6: 6، 12، 18، 24، 30، ...')),
        rich(text('مضاعفات 10: 10، 20، 30، ...')),
        rich(text('أول مشترك هو 30.')),
      ],
      finalAnswer: rich(text('الخطأ هو ضرب العددين مباشرة، والصواب '), math(String(lcm2(6, 10))), text('.')),
      commonError: rich(text('الخلط بين م.م.أ وحاصل الضرب عندما يوجد قاسم مشترك.')),
    },
    originalityNote: 'تحليل خطأ جديد (الضرب المباشر) بقيم غير واردة في الكتاب.',
  }),

  // ====== THINKING (3) ======
  q(18, {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('يعود ثلاثة أصدقاء لزيارة المكتبة على التوالي: كل 4 أيام، وكل 6 أيام، وكل 9 أيام. إذا التقوا اليوم، فبعد كم يوماً يتقابلون مجدداً؟')),
    concepts: ['lcm-three', 'lcm-word-problems'], skills: ['solve-word', 'compute-lcm'], sourceConcepts: ['three-numbers', 'word-problems'],
    coverage: { applications: ['schedule'], thinking: ['verify'] },
    answer: { expected: String(lcm3(4, 6, 9)), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('م.م.أ (4،6،9) يحتاج تفكيراً: العوامل الأولية: 4=2²، 6=2×3، 9=3²؛ م.م.أ = 2² × 3² = 36.')),
      steps: [
        rich(text('نكتب المضاعفات أو نستعمل العوامل: 4→2²، 6→2×3، 9→3².')),
        rich(text('نأخذ أعلى أس لكل عامل: 2²=4، 3²=9.')),
        rich(math('4 × 9 = 36'), text('. نتحقق: 36 ÷ 4=9، 36 ÷6=6، 36 ÷9=4.')),
      ],
      finalAnswer: rich(text('بعد '), math(String(lcm3(4, 6, 9))), text(' يوماً.')),
      commonError: rich(text('اختيار 18 (لا يقبل القسمة على 4) أو 24 (لا يقبل القسمة على 9).')),
    },
    originalityNote: 'مسألة تفكير بأعداد تُضلّل عبر مشتركين جزئيين (18 و24)، وهي جديدة بالكامل.',
  }),
  q(19, {
    type: 'single-choice', difficulty: 'thinking',
    prompt: rich(text('إذا علمت أن م.م.أ (a، b) = 24، فأي زوج من الأعداد لا يمكن أن يكون a وb؟')),
    concepts: ['lcm-two'], skills: ['distinguish', 'compute-lcm'], sourceConcepts: ['two-numbers'],
    coverage: { thinking: ['why-smallest'] },
    options: [option('q19-a', math('3 و 8')), option('q19-b', math('6 و 8')), option('q19-c', math('12 و 24')), option('q19-d', math('4 و 12'))],
    answer: 'q19-d',
    solution: {
      idea: rich(text('نحسب م.م.أ لكل زوج. م.م.أ (4،12) =12، لا 24، إذن هو الزوج المستحيل.')),
      steps: [
        rich(math('م.م.أ (3،8)=24')),
        rich(math('م.م.أ (6،8)=24')),
        rich(math('م.م.أ (12،24)=24')),
        rich(math('م.م.أ (4،12)=12 ≠ 24'), text('.')),
      ],
      finalAnswer: rich(math('4 و 12')),
      commonError: rich(text('اختيار (12،24) ظناً أنهما لا يمكنان م.م.أ=24، مع أن 24 مضاعف 12.')),
    },
    originalityNote: 'سؤال استدلال عكسي غير تقليدي يتضمن البحث عن الزوج المستحيل، غير مسبوق في الكتاب.',
  }),
  q(20, {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('يُرش بستان نوعين من السماد كل 12 يوماً و18 يوماً على الترتيب، ونوعاً ثالثاً كل 24 يوماً. إذا استُعملت الأنواع الثلاثة اليوم، فبعد كم يوماً يُستعمل الثلاثة معاً للمرة الثانية بعد اليوم؟')),
    concepts: ['lcm-three', 'lcm-word-problems'], skills: ['solve-word', 'compute-lcm'], sourceConcepts: ['three-numbers', 'word-problems'],
    coverage: { applications: ['farming'], thinking: ['verify'], commonErrors: ['include-zero'] },
    answer: { expected: String(lcm3(12, 18, 24) * 2), format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('أولاً نحسب م.م.أ، ثم المرة الثانية بعد اليوم هي 2×م.م.أ.')),
      steps: [
        rich(text('العوامل: 12=2²×3، 18=2×3²، 24=2³×3.')),
        rich(text('م.م.أ = 2³ × 3² = 8 × 9 = 72.')),
        rich(text('المرة الأولى: بعد 72 يوماً؛ الثانية: بعد 144 يوماً.'))
      ],
      finalAnswer: rich(text('بعد '), math(String(lcm3(12, 18, 24) * 2)), text(' يوماً.')),
      commonError: rich(text('إعطاء 72 (المرة الأولى) بدل 144 (الثانية)، أو نسيان استبعاد «اليوم».')),
    },
    originalityNote: 'مسألة ذات خطوتين (المرة الثانية) في سياق بستان/سماد، وهي غير موجودة حرفياً.',
  }),
]

// Source concepts referenced on pp. 52–53
const sourceConcepts = [
  { id: 'two-numbers', label: 'م.م.أ لعددين', pages: [52] as const },
  { id: 'three-numbers', label: 'م.م.أ لثلاثة أعداد', pages: [53] as const },
  { id: 'exclude-zero', label: 'استبعاد الصفر وإيجاد الأول بعد البداية', pages: [52] as const },
  { id: 'word-problems', label: 'تطبيقات حياتية دورية (ليزر/فلاح)', pages: [52, 53] as const },
]

export default defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار المضاعف المشترك الأصغر',
  description: rich(text('عشرون سؤالاً على المضاعفات المشتركة والمضاعف المشترك الأصغر لعددين وثلاثة أعداد، مع مسائل حياتية وتحليل أخطاء.')),
  instructions: rich(text('اقرأ كل سؤال بعناية، ولا تتعجّل بضرب العددين قبل التفكير في العوامل المشتركة. في الأسئلة الرقمية اكتب العدد فقط دون وحدات.')),
  questions,
  sourceConcepts,
  conceptLabels,
  skillLabels,
  applicationLabels,
  thinkingLabels,
  commonErrorLabels,
})
