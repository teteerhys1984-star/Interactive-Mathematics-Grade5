import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/**
 * Unit 2, Lesson 1 test — exactly 20 new items (6 basic, 7 medium, 4 advanced, 3 thinking).
 * Every item changes the textbook's values, context, or response demand; none copies a printed
 * exercise or the Student/Teacher Area prompt. Solutions remain available only after submission.
 */
const testId = 'lesson-compare-order-natural-numbers-test'
const lessonId = 'compare-order-natural-numbers'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })

const questions: QuestionDefinition[] = [
  q(1, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('يُظهر عدّادان '), math('6,240,381'), text(' زيارة و'), math('6,204,381'), text(' زيارة. ما الرمز الذي يضع العلاقة الصحيحة مكان الفراغ؟ '), math('6,240,381  □  6,204,381')),
    concepts: ['natural-number-order', 'comparison-symbols', 'place-value'], skills: ['select-comparison-symbol', 'find-first-difference'], sourceConcepts: ['left-to-right-rule'],
    options: [option('q01-a', math('<')), option('q01-b', math('>')), option('q01-c', math('=')), optionText('q01-d', 'لا يمكن المقارنة')],
    answer: 'q01-b',
    solution: {
      idea: rich(text('العددان من سبع خانات وتبدأ منازلها الكبرى بالأرقام نفسها؛ نتابع حتى أول اختلاف.')),
      rule: rich(text('عند تساوي عدد الخانات، نقارن من اليسار إلى اليمين ونتوقف عند أول اختلاف.')),
      steps: [
        rich(text('الملايين: '), math('6=6'), text('، ومئات الألوف: '), math('2=2'), text('.')),
        rich(text('في عشرات الألوف يظهر '), math('4'), text(' في العدد الأول و'), math('0'), text(' في الثاني.')),
        rich(text('لأنّ '), math('4>0'), text(' فالعدد الأول أكبر، ولا تغيّر الخانات الأصغر هذه النتيجة.')),
      ],
      finalAnswer: rich(math('6,240,381 > 6,204,381')),
      commonError: rich(text('اختيار < لأنّ العين تتوقف على الرقم الأخير أو تقرأ الأرقام من جهة اليمين.')),
    },
    originalityNote: 'مسألة عدّادات جديدة بقيم مختلفة عن كل مثال مطبوع، تقيس اختيار الرمز بعد تعيين أول اختلاف لا تذكّر جواب من الكتاب.',
  }),
  q(2, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('كل عدد طبيعي مكوّن من سبع خانات أكبر من كل عدد طبيعي مكوّن من ست خانات.')),
    concepts: ['natural-number-order', 'digit-count'], skills: ['compare-digit-count'], sourceConcepts: ['digit-count-rule'],
    answer: true,
    solution: {
      idea: rich(text('تتحدد مجموعة الأعداد ذات عدد خانات معين بحدّين واضحين.')),
      steps: [
        rich(text('أكبر عدد من ست خانات هو '), math('999,999'), text('.')),
        rich(text('أصغر عدد من سبع خانات هو '), math('1,000,000'), text('.')),
        rich(math('1,000,000 > 999,999'), text('، لذلك تتحقق العبارة لكل عددين من هاتين المجموعتين.')),
      ],
      finalAnswer: rich(text('صحيح.')),
    },
    originalityNote: 'يختبر تعميماً بحدّي المجموعتين بدلاً من إعادة مثال واحد من أعداد ص 45.',
  }),
  q(3, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('كم خانة في العدد '), math('7,020,406'), text('؟')),
    concepts: ['digit-count', 'place-value'], skills: ['count-digits'], sourceConcepts: ['digit-count-rule'],
    answer: { expected: '7', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('الفاصلة تفصل مجموعات الآلاف ولا تُعدّ خانة رقمية.')),
      steps: [
        rich(text('نكتب الأرقام من دون الفاصلة: '), math('7020406'), text('.')),
        rich(text('نعدّها: 7، 0، 2، 0، 4، 0، 6 — أي سبعة أرقام.')),
      ],
      finalAnswer: rich(math('7')),
      commonError: rich(text('عدّ الفاصلة مع الأرقام أو إسقاط صفر من وسط العدد.')),
    },
    originalityNote: 'عدد جديد يحوي أصفاراً داخلية لتقويم عدّ الخانات بدقة، وليس العدد الوارد في جدول المصدر.',
  }),
  q(4, {
    type: 'matching', difficulty: 'basic',
    prompt: rich(text('طابق كل رمز مع العبارة التي يعبّر عنها.')),
    concepts: ['comparison-symbols'], skills: ['interpret-comparison-symbols'], sourceConcepts: ['comparison-symbols'],
    left: [option('q04-less', math('<')), option('q04-equal', math('=')), option('q04-greater', math('>'))],
    right: [optionText('q04-smaller', 'العدد في الطرف الأيسر أصغر'), optionText('q04-same', 'العددان متساويان'), optionText('q04-larger', 'العدد في الطرف الأيسر أكبر')],
    answer: [
      { leftId: 'q04-less', rightId: 'q04-smaller' },
      { leftId: 'q04-equal', rightId: 'q04-same' },
      { leftId: 'q04-greater', rightId: 'q04-larger' },
    ],
    solution: {
      idea: rich(text('الرمز يصف العلاقة بين قيمة الطرف الأيسر وقيمة الطرف الأيمن.')),
      steps: [
        rich(math('<'), text(' تعني «أصغر من»، لذا يكون الأيسر أصغر.')),
        rich(math('='), text(' تعني أن القيمتين متساويتان.')),
        rich(math('>'), text(' تعني «أكبر من»، لذا يكون الأيسر أكبر.')),
      ],
      finalAnswer: rich(text('<: أصغر؛ =: يساوي؛ >: أكبر.')),
      commonError: rich(text('قراءة العلامة من رأسها وحده من دون قراءة طرفي المقارنة بالترتيب.')),
    },
    originalityNote: 'صيغة مطابقة جديدة للمعنى الدقيق للرمز، وليست إعادة لفراغات النشاط المطبوع.',
  }),
  q(5, {
    type: 'ordering', difficulty: 'basic',
    prompt: rich(text('رتّب أرقام تذاكر الدخول من الأصغر إلى الأكبر:')),
    concepts: ['natural-number-order', 'ascending-descending'], skills: ['order-natural-numbers'], sourceConcepts: ['arranging-lists'],
    items: [
      option('q05-a', math('46,604')),
      option('q05-b', math('46,640')),
      option('q05-c', math('46,064')),
      option('q05-d', math('46,406')),
    ],
    answer: ['q05-c', 'q05-d', 'q05-a', 'q05-b'],
    solution: {
      idea: rich(text('الأعداد الأربعة من خمس خانات؛ تتساوى بدايتها، ثم تحسم المنازل التالية الترتيب.')),
      steps: [
        rich(text('الأصغر هو '), math('46,064'), text(' لأن مجموعة الآلاف فيه '), math('046'), text(' أصغر من '), math('406'), text(' و'), math('604'), text(' و'), math('640'), text('.')),
        rich(math('46,406 < 46,604'), text(' لأن خانة المئات '), math('4<6'), text('.')),
        rich(math('46,604 < 46,640'), text(' لأن المئات متساوية والعشرات '), math('0<4'), text('.')),
      ],
      finalAnswer: rich(text('46,064؛ 46,406؛ 46,604؛ 46,640.')),
    },
    originalityNote: 'موقف تذاكر بقيم جديدة واستجابة ترتيب، لا يعيد تمرين ترتيب الأعداد المطبوعة في الدرس.',
  }),
  q(6, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('عند مقارنة عددين لهما عدد الخانات نفسه، نبدأ دائماً بخانة الآحاد.')),
    concepts: ['place-value', 'comparison-symbols'], skills: ['choose-highest-place-first'], sourceConcepts: ['left-to-right-rule'],
    answer: false,
    solution: {
      idea: rich(text('المنازل ليست متساوية في القيمة؛ الخانة اليسرى هي الأعلى قيمة.')),
      steps: [
        rich(text('تساوي عدد الخانات لا يجعل الآحاد أهم من الملايين أو الألوف.')),
        rich(text('نبدأ بأعلى منزلة، أي أقصى اليسار، وننتقل يميناً فقط إذا تساوت الخانات السابقة.')),
      ],
      finalAnswer: rich(text('خطأ؛ نبدأ من أقصى اليسار، لا من الآحاد.')),
      commonError: rich(text('تطبيق طريقة قراءة آحاد العدد على مسألة مقارنة القيمة المكانية.')),
    },
    originalityNote: 'عبارة تشخيصية جديدة تستهدف خطأ البدء من اليمين، لا سؤالاً لفظياً من صفحات المصدر.',
  }),
  q(7, {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب أعداد أجهزة الاستشعار تصاعدياً:')),
    concepts: ['natural-number-order', 'ascending-descending', 'place-value'], skills: ['order-natural-numbers', 'find-first-difference'], sourceConcepts: ['arranging-lists', 'left-to-right-rule'],
    coverage: { applications: ['compare-measurement-data'] },
    items: [
      option('q07-a', math('3,746,210')),
      option('q07-b', math('3,764,012')),
      option('q07-c', math('3,746,201')),
      option('q07-d', math('3,746,120')),
    ],
    answer: ['q07-d', 'q07-c', 'q07-a', 'q07-b'],
    solution: {
      idea: rich(text('كل الأعداد تبدأ بـ3 ملايين؛ نحتاج إلى متابعة الخانات حتى يظهر اختلاف.')),
      steps: [
        rich(text('الثلاثة الأولى ذات البداية '), math('3,746'), text('، أما '), math('3,764,012'), text(' ففي عشرات الألوف '), math('6>4'), text('، لذا يأتي أخيراً.')),
        rich(math('3,746,120 < 3,746,201'), text(' لأن المئات '), math('1<2'), text('.')),
        rich(math('3,746,201 < 3,746,210'), text(' لأن المئات متساوية والعشرات '), math('0<1'), text('.')),
      ],
      finalAnswer: rich(text('3,746,120؛ 3,746,201؛ 3,746,210؛ 3,764,012.')),
      commonError: rich(text('التوقف بعد تساوي أول ثلاث خانات مع أن الأعداد لم تُرتّب بعد.')),
    },
    originalityNote: 'سياق أجهزة قياس وأربعة أعداد جديدة فيها تعادل جزئي يتطلب فحص المنازل المتتالية.',
  }),
  q(8, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('عند مقارنة '), math('8,317,540'), text(' و'), math('8,319,105'), text('، في أي منزلة يظهر أول اختلاف؟')),
    concepts: ['place-value', 'natural-number-order'], skills: ['find-first-difference', 'name-place-value'], sourceConcepts: ['left-to-right-rule'],
    options: [
      optionText('q08-a', 'عشرات الألوف'),
      optionText('q08-b', 'الألوف'),
      optionText('q08-c', 'المئات'),
      optionText('q08-d', 'الآحاد'),
    ],
    answer: 'q08-b',
    solution: {
      idea: rich(text('نسمّي الخانة التي تغيّر رقمها أولاً من جهة اليسار.')),
      steps: [
        rich(text('الملايين '), math('8=8'), text('، مئات الألوف '), math('3=3'), text('، وعشرات الألوف '), math('1=1'), text('.')),
        rich(text('في الألوف: الرقم '), math('7'), text(' في الأول و'), math('9'), text(' في الثاني؛ هنا يظهر أول اختلاف.')),
      ],
      finalAnswer: rich(text('منزلة الألوف؛ والعدد الثاني أكبر لأن 9 > 7 فيها.')),
    },
    originalityNote: 'يطلب اسم المنزلة الفاصلة في أعداد جديدة، بدلاً من سؤال «ما الرمز؟» على نفس الأعداد.',
  }),
  q(9, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('قارن '), math('4,183,009'), text(' و'), math('4,085,900'), text('. ما الرقم الموجود في منزلة مئات الألوف في العدد الأكبر؟')),
    concepts: ['place-value', 'natural-number-order'], skills: ['find-first-difference', 'name-place-value', 'read-place-value'], sourceConcepts: ['left-to-right-rule'],
    answer: { expected: '1', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('تساوي عدد الخانات؛ نبدأ من الملايين ثم ننتقل إلى مئات الألوف.')),
      steps: [
        rich(text('الملايين متساوية: '), math('4=4'), text('.')),
        rich(text('في مئات الألوف، الرقم في العدد الأول '), math('1'), text('، وفي الثاني '), math('0'), text('.')),
        rich(text('إذن '), math('4,183,009'), text(' هو الأكبر، ورقمه في مئات الألوف هو '), math('1'), text('.')),
      ],
      finalAnswer: rich(math('1')),
      commonError: rich(text('اختيار رقم من منزلة أخرى لأن قيمته تبدو أكبر، من دون قراءة عنوان المنزلة.')),
    },
    originalityNote: 'سؤال إدخال رقمي عن رقم المنزلة في العدد الفائز، بقيم جديدة وطلب مختلف عن تمارين اختيار الرمز.',
  }),
  q(10, {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('صِل كل زوج بالرمز الصحيح الذي يصف العلاقة من اليسار إلى اليمين.')),
    concepts: ['comparison-symbols', 'natural-number-order'], skills: ['select-comparison-symbol', 'find-first-difference', 'match-comparison-outcome'], sourceConcepts: ['comparison-symbols', 'left-to-right-rule'],
    left: [
      option('q10-a', math('1,407,006  □  1,470,006')),
      option('q10-b', math('2,080,080  □  2,080,008')),
      option('q10-c', math('6,999,000  □  6,999,000')),
    ],
    right: [option('q10-less', math('<')), option('q10-equal', math('=')), option('q10-greater', math('>'))],
    answer: [
      { leftId: 'q10-a', rightId: 'q10-less' },
      { leftId: 'q10-b', rightId: 'q10-greater' },
      { leftId: 'q10-c', rightId: 'q10-equal' },
    ],
    solution: {
      idea: rich(text('نفحص أول منزلة مختلفة في كل زوج، مع الانتباه إلى اتجاه الطرفين.')),
      steps: [
        rich(text('الأول: تتساوى الملايين ومئات الألوف؛ عند عشرات الألوف '), math('0<7'), text('، فيكون الطرف الأيسر أصغر.')),
        rich(text('الثاني: تتساوى الخانات حتى المئات؛ في العشرات '), math('8>0'), text('، فيكون الطرف الأيسر أكبر.')),
        rich(text('الثالث: الملايين '), math('6=6'), text('، ومئات الألوف '), math('9=9'), text('، وتستمر الخانات متساوية؛ فالعددان متساويان.')),
      ],
      finalAnswer: rich(text('الأول <؛ الثاني >؛ الثالث =.')),
      commonError: rich(text('وضع الرمز الذي يشير نحو الرقم الأصغر بدلاً من قراءة العلاقة بالترتيب المعطى.')),
    },
    originalityNote: 'مطابقة بين ثلاثة أزواج جديدة وثلاث علاقات، وتستلزم حلّ كل زوج لا استنساخ أسطر المصدر.',
  }),
  q(11, {
    type: 'error-analysis', difficulty: 'medium',
    prompt: rich(text('راجع عمل الطالب: اختر تشخيص الخطأ والتصحيح المناسب.')),
    concepts: ['place-value', 'natural-number-order'], skills: ['diagnose-place-value-error', 'find-first-difference'], sourceConcepts: ['left-to-right-rule'],
    studentWork: rich(text('قارن الطالب '), math('4,058,000 < 4,049,999'), text(' وكتب: «العبارة صحيحة؛ لأن 5 أصغر من 9».')),
    diagnoses: [
      optionText('q11-d1', 'قارن رقمين من منزلتين مختلفتين؛ لم يحاذِ المنازل قبل الحكم.'),
      optionText('q11-d2', 'عدّ الخانات فقط، وهذا كافٍ لإثبات أن العددين متساويان.'),
      optionText('q11-d3', 'قارن الآحاد، لكنه لم ينظر إلى أي رقم آخر.'),
    ],
    corrections: [
      optionText('q11-c1', 'الملايين ومئات الألوف متساوية؛ عند عشرات الألوف 5 > 4، لذا 4,058,000 > 4,049,999.'),
      optionText('q11-c2', 'العبارة صحيحة لأن 9 في المئات أكبر من 5 في عشرات الألوف.'),
      optionText('q11-c3', 'العددان متساويان لأنهما من سبع خانات.'),
    ],
    answer: { diagnosisId: 'q11-d1', correctionId: 'q11-c1' },
    solution: {
      idea: rich(text('قد يبدو الرقم 5 أصغر من 9، لكنهما هنا في منزلتين مختلفتين تماماً.')),
      steps: [
        rich(text('كلا العددين من سبع خانات؛ نبدأ بالملايين ثم مئات الألوف، وهما متساويان.')),
        rich(text('في عشرات الألوف، العدد الأول يحمل '), math('5'), text(' والثاني '), math('4'), text('. هذه أول منزلة مختلفة.')),
        rich(math('5>4'), text('، إذن '), math('4,058,000 > 4,049,999'), text('.')),
        rich(text('الخطأ هو مقارنة 5 في عشرات الألوف بـ9 في المئات كأنهما في المنزلة نفسها.')),
      ],
      finalAnswer: rich(text('التشخيص q11-d1 والتصحيح q11-c1.')),
      commonError: rich(text('مقارنة رقمين غير متناظرين، بدلاً من مقارنة الخانات التي تحمل الاسم نفسه.')),
    },
    originalityNote: 'تحليل خطأ جديد في محاذاة المنازل؛ القيم والتعليل مختلفان عن أمثلة المصدر وعن أسئلة الاختبار الأخرى.',
  }),
  q(12, {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر كل مقارنة صحيحة.')),
    concepts: ['natural-number-order', 'comparison-symbols', 'place-value'], skills: ['validate-comparison-statements', 'find-first-difference'], sourceConcepts: ['comparison-symbols', 'digit-count-rule', 'left-to-right-rule'],
    options: [
      option('q12-a', math('5,099,999 < 5,100,000')),
      option('q12-b', math('2,450,060 > 2,450,600')),
      option('q12-c', math('8,000,001 > 7,999,999')),
      option('q12-d', math('3,610,240 = 3,610,204')),
    ],
    answer: ['q12-a', 'q12-c'],
    solution: {
      idea: rich(text('تحقق من كل علاقة على حدة؛ لا يكفي أن تبدو الأرقام متقاربة.')),
      steps: [
        rich(math('5,099,999 < 5,100,000'), text(' صحيحة: عند الانتقال من 5,099,999 إلى 5,100,000 تتغير مجموعة الألوف بعد استلاف الوحدات.')),
        rich(text('ب: أول اختلاف في المئات، '), math('0<6'), text('، لذلك العدد الأيسر أصغر لا أكبر.')),
        rich(math('8,000,001 > 7,999,999'), text(' صحيحة: الملايين '), math('8>7'), text('.')),
        rich(text('د: أول اختلاف في العشرات والآحاد؛ العددان غير متساويين، والأيسر أكبر.')),
      ],
      finalAnswer: rich(text('المقارنتان الصحيحتان: أ، ج.')),
      commonError: rich(text('اختيار جميع العبارات التي تبدأ بالرقم نفسه أو تنتهي بأرقام متشابهة.')),
    },
    originalityNote: 'مجموعة تحقق متعددة الاختيار بأعداد ومواضع اختلاف جديدة، وليست العبارة المطبوعة «أشر إلى الصحيحة».',
  }),
  q(13, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('اختر القائمة المرتبة تنازلياً للأعداد '), math('4,208,090'), text(' و'), math('4,280,009'), text(' و'), math('4,200,890'), text('.')),
    concepts: ['natural-number-order', 'ascending-descending', 'place-value'], skills: ['order-natural-numbers', 'interpret-order-direction'], sourceConcepts: ['arranging-lists'],
    options: [
      option('q13-a', math('4,280,009; 4,208,090; 4,200,890')),
      option('q13-b', math('4,200,890; 4,208,090; 4,280,009')),
      option('q13-c', math('4,208,090; 4,280,009; 4,200,890')),
      option('q13-d', math('4,280,009; 4,200,890; 4,208,090')),
    ],
    answer: 'q13-a',
    solution: {
      idea: rich(text('تنازلياً يعني أن كل عدد يسبق عدداً أصغر منه.')),
      steps: [
        rich(text('الأعداد الثلاثة لها '), math('4'), text(' ملايين. في مئات الألوف، '), math('8>2'), text('، لذا '), math('4,280,009'), text(' هو الأكبر.')),
        rich(text('بين الباقيين تتساوى الملايين ومئات الألوف؛ في الآلاف '), math('8>0'), text('، لذا '), math('4,208,090'), text(' أكبر من '), math('4,200,890'), text('.')),
        rich(text('نكتب من الأكبر إلى الأصغر.')),
      ],
      finalAnswer: rich(math('4,280,009; 4,208,090; 4,200,890')),
      commonError: rich(text('عكس معنى «تنازلياً» أو مقارنة أرقام الآحاد قبل المنازل الأعلى.')),
    },
    originalityNote: 'اختيار اتجاه الترتيب في مجموعة جديدة، مع مشتتات تغيّر الاتجاه أو تبادل أعداد متقاربة.',
  }),
  q(14, {
    type: 'multi-select', difficulty: 'advanced',
    prompt: rich(text('لديك الأعداد '), math('7,405,909'), text(' و'), math('7,450,099'), text(' و'), math('7,405,990'), text('. اختر كل عبارة صحيحة.')),
    concepts: ['natural-number-order', 'place-value', 'ascending-descending'], skills: ['compare-three-natural-numbers', 'justify-first-difference'], sourceConcepts: ['left-to-right-rule', 'arranging-lists'],
    coverage: { thinking: ['justify-first-difference'] },
    options: [
      option('q14-a', math('7,405,909 < 7,405,990')),
      option('q14-b', math('7,450,099 < 7,405,990')),
      option('q14-c', math('7,405,909 < 7,405,990 < 7,450,099')),
      option('q14-d', math('7,405,990 > 7,450,099')),
    ],
    answer: ['q14-a', 'q14-c'],
    solution: {
      idea: rich(text('نقارن العددين المتقاربين حتى أصغر المنازل، ونفحص مجموعة الألوف عند مقارنة الثالث.')),
      steps: [
        rich(text('بين '), math('7,405,909'), text(' و'), math('7,405,990'), text(' تتساوى الخانات حتى المئات؛ عند العشرات '), math('0<9'), text('، لذا العبارة أ صحيحة.')),
        rich(text('العدد '), math('7,450,099'), text(' أكبر من الاثنين لأن عشرات الألوف '), math('5>0'), text(' بعد تساوي الملايين ومئات الألوف.')),
        rich(text('إذن الترتيب في ج صحيح، أما ب ود فيعكسان العلاقة.')),
      ],
      finalAnswer: rich(text('أ، ج.')),
      commonError: rich(text('التوقف عند تساوي البداية وعدم فحص الخانة التالية، أو قراءة ترتيب القائمة على أنه تنازلي.')),
    },
    originalityNote: 'يجمع مقارنة ثلاثة أعداد جديدة وطلب تحديد العبارات والعلاقة المتسلسلة، لا سؤال ترتيب من نص الكتاب.',
  }),
  q(15, {
    type: 'ordering', difficulty: 'advanced',
    prompt: rich(text('رتّب رموز الملفات الرقمية الآتية تصاعدياً من دون إهمال الأصفار:')),
    concepts: ['natural-number-order', 'place-value', 'ascending-descending'], skills: ['order-natural-numbers', 'compare-zero-filled-place-values'], sourceConcepts: ['left-to-right-rule', 'arranging-lists'],
    coverage: { applications: ['compare-measurement-data'] },
    items: [
      option('q15-a', math('2,009,909')),
      option('q15-b', math('2,090,099')),
      option('q15-c', math('2,009,099')),
      option('q15-d', math('1,999,999')),
      option('q15-e', math('2,090,009')),
    ],
    answer: ['q15-d', 'q15-c', 'q15-a', 'q15-e', 'q15-b'],
    solution: {
      idea: rich(text('تتطلب الأصفار الداخلية الحفاظ على المحاذاة بحسب المنازل، لا حذفها من الكتابة.')),
      steps: [
        rich(text('الأول هو '), math('1,999,999'), text(' لأن رقم الملايين '), math('1<2'), text(' في بقية الأعداد.')),
        rich(text('بين عددي '), math('2,009,099'), text(' و'), math('2,009,909'), text(' تتفق الخانات حتى المئات؛ '), math('0<9'), text('، فيأتي 2,009,099 أولاً.')),
        rich(text('بين '), math('2,090,009'), text(' و'), math('2,090,099'), text(' تتفق الخانات حتى العشرات؛ '), math('0<9'), text('، فيأتي الأول منهما قبل الثاني.')),
        rich(text('وبعد الأعداد ذات مجموعة الألوف '), math('009'), text(' تأتي الأعداد ذات المجموعة '), math('090'), text('.')),
      ],
      finalAnswer: rich(text('1,999,999؛ 2,009,099؛ 2,009,909؛ 2,090,009؛ 2,090,099.')),
      commonError: rich(text('حذف الصفر في مجموعة الألوف فيتغير العدد أو ترتيب المنازل.')),
    },
    originalityNote: 'ترتيب خمسة رموز ملفات جديدة ذات أصفار داخلية متقاربة، وهو تحدٍّ أعلى من أعداد الترتيب المطبوعة.',
  }),
  q(16, {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('شخّص طريقة المقارنة وصحّحها:')),
    concepts: ['natural-number-order', 'place-value'], skills: ['diagnose-right-to-left-error', 'find-first-difference'], sourceConcepts: ['left-to-right-rule'],
    coverage: { commonErrors: ['compare-from-right'] },
    studentWork: rich(text('قارن الطالب '), math('5,406,218'), text(' و'), math('5,406,281'), text('، وقال: «الأول أكبر لأن رقم الآحاد '), math('8'), text(' أكبر من '), math('1'), text('».')),
    diagnoses: [
      optionText('q16-d1', 'بدأ من اليمين، فقارن الآحاد قبل فحص العشرات.'),
      optionText('q16-d2', 'عدّ الخانات خطأً؛ العدد الأول أطول من الثاني.'),
      optionText('q16-d3', 'أجرى مقارنة صحيحة لأن رقم الآحاد يحسم كل مقارنة.'),
    ],
    corrections: [
      optionText('q16-c1', 'الملايين ومئات الألوف وعشرات الألوف والألوف والمئات متساوية؛ عند العشرات 1 < 8، لذا 5,406,218 < 5,406,281.'),
      optionText('q16-c2', 'الآحاد 8 أكبر؛ إذن 5,406,218 > 5,406,281.'),
      optionText('q16-c3', 'لا يمكن المقارنة لأن الأعداد متساوية في عدد الخانات.'),
    ],
    answer: { diagnosisId: 'q16-d1', correctionId: 'q16-c1' },
    solution: {
      idea: rich(text('وجود اختلاف في الآحاد لا يكفي إذا سبقه اختلاف في منزلة أعلى.')),
      steps: [
        rich(text('كلا العددين من سبع خانات، وتتساوى المنازل من الملايين حتى المئات.')),
        rich(text('في العشرات، الرقم الأول '), math('1'), text(' والثاني '), math('8'), text('. هذا أول اختلاف من اليسار.')),
        rich(math('1<8'), text('، لذا العدد الأول أصغر، مهما كان رقم الآحاد فيه أكبر.')),
      ],
      finalAnswer: rich(text('التشخيص q16-d1؛ والتصحيح q16-c1.')),
      commonError: rich(text('البدء من جهة اليمين والاعتقاد أن آخر رقم يقرر قيمة العدد كله.')),
    },
    originalityNote: 'حالة جديدة يتعارض فيها رقم الآحاد مع أول اختلاف أعلى منه؛ تقيس تشخيص ترتيب التفكير لا حفظ الناتج.',
  }),
  q(17, {
    type: 'matching', difficulty: 'advanced',
    prompt: rich(text('طابق كل زوج من الأعداد مع المنزلة التي يظهر فيها أول اختلاف.')),
    concepts: ['place-value', 'natural-number-order'], skills: ['find-first-difference', 'name-place-value'], sourceConcepts: ['left-to-right-rule'],
    left: [
      option('q17-a', math('7,032,800  و  7,042,800')),
      option('q17-b', math('4,510,020  و  4,510,002')),
      option('q17-c', math('3,999,999  و  4,000,000')),
    ],
    right: [optionText('q17-millions', 'الملايين'), optionText('q17-ten-thousands', 'عشرات الألوف'), optionText('q17-tens', 'العشرات')],
    answer: [
      { leftId: 'q17-a', rightId: 'q17-ten-thousands' },
      { leftId: 'q17-b', rightId: 'q17-tens' },
      { leftId: 'q17-c', rightId: 'q17-millions' },
    ],
    solution: {
      idea: rich(text('ابدأ من اليسار حتى تجد أول عمود غير متساوٍ، ثم سمِّ ذلك العمود.')),
      steps: [
        rich(text('في الزوج أ تتساوى الملايين ومئات الألوف؛ عند عشرات الألوف '), math('3≠4'), text('.')),
        rich(text('في الزوج ب تتساوى المنازل حتى العشرات؛ '), math('2≠0'), text(' فيها.')),
        rich(text('في الزوج ج تختلف الملايين مباشرةً: '), math('3≠4'), text('.')),
      ],
      finalAnswer: rich(text('أ: عشرات الألوف؛ ب: العشرات؛ ج: الملايين.')),
      commonError: rich(text('عدّ الخانات من الجهة الخطأ أو الخلط بين رقم المنزلة واسم المنزلة.')),
    },
    originalityNote: 'مطابقة ثلاث حالات جديدة ومتباعدة لأول اختلاف، بما فيها اختلاف الملايين، العشرات، وعشرات الألوف.',
  }),
  q(18, {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('نتيجة الطالب صحيحة، لكن هل حجته صحيحة؟ اختر التشخيص والتعليل البديل.')),
    concepts: ['digit-count', 'place-value', 'natural-number-order'], skills: ['evaluate-comparison-justification', 'justify-first-difference'], sourceConcepts: ['digit-count-rule', 'left-to-right-rule'],
    coverage: { thinking: ['evaluate-proof-not-only-answer'], commonErrors: ['misread-digit-count'] },
    studentWork: rich(text('كتب الطالب: '), math('3,999,999 < 4,000,000'), text(' «لأن العدد الثاني فيه خانة أكثر».')),
    diagnoses: [
      optionText('q18-d1', 'المقارنة صحيحة، لكن التعليل خطأ؛ كلا العددين من سبع خانات.'),
      optionText('q18-d2', 'المقارنة والتعليل صحيحان؛ 4,000,000 من ثماني خانات.'),
      optionText('q18-d3', 'المقارنة خاطئة لأن 9 أكبر من 0 في المنازل اليمنى.'),
    ],
    corrections: [
      optionText('q18-c1', 'كلاهما من سبع خانات؛ نقارن الملايين: 3 < 4، لذا 3,999,999 < 4,000,000.'),
      optionText('q18-c2', '3,999,999 أكبر لأن فيه أرقاماً غير صفرية أكثر.'),
      optionText('q18-c3', 'العددان متساويان لأن كليهما يقارب أربعة ملايين.'),
    ],
    answer: { diagnosisId: 'q18-d1', correctionId: 'q18-c1' },
    solution: {
      idea: rich(text('نفحص صحة الاستنتاج وصحة السبب كلّاً على حدة.')),
      steps: [
        rich(text('العددان كليهما من سبع خانات، لذلك تفسير «خانة أكثر» غير صحيح.')),
        rich(text('الملايين أول منزلة: '), math('3'), text(' في العدد الأول و'), math('4'), text(' في الثاني.')),
        rich(math('3<4'), text('، لذا النتيجة نفسها صحيحة بسبب قيمة الملايين لا بسبب عدد الخانات.')),
      ],
      finalAnswer: rich(text('التشخيص q18-d1 والتصحيح q18-c1.')),
      commonError: rich(text('قبول أي تفسير معقول ظاهرياً لمجرد أن النتيجة النهائية صحيحة.')),
    },
    originalityNote: 'يفصل بين صحة النتيجة وصحة البرهان في حالة حدّية جديدة؛ لا يكرر قاعدة المثال المطبوع بأعدادها.',
  }),
  q(19, {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('أدخل أصغر عدد طبيعي أكبر من '), math('5,788,999'), text(' وأقل من '), math('5,790,000'), text('، ويكون من سبع خانات.')),
    concepts: ['natural-number-order', 'place-value', 'ascending-descending'], skills: ['construct-number-between-bounds', 'use-successor'], sourceConcepts: ['left-to-right-rule', 'arranging-lists', 'neighbor-numbers'],
    coverage: { thinking: ['construct-minimum-between-bounds'] },
    answer: { expected: '5789000', format: 'integer', unitPolicy: { kind: 'none' } },
    solution: {
      idea: rich(text('نبحث عن الحدّ الأدنى الذي يتجاوز العدد الأول مباشرةً، ثم نتحقق من الحد الأعلى.')),
      steps: [
        rich(text('أصغر عدد طبيعي أكبر من '), math('5,788,999'), text(' هو العدد التالي له: '), math('5,789,000'), text('.')),
        rich(text('نقارن بالحد الأعلى: '), math('5,789,000 < 5,790,000'), text('، إذن يحقق الشرطين.')),
        rich(text('ويتكوّن من سبع خانات، لذا لا يوجد عدد أصغر يحقق المطلوب.')),
      ],
      finalAnswer: rich(math('5,789,000')),
      commonError: rich(text('تغيير مجموعة الآلاف إلى 790 بدلاً من 789، أو اختيار عدد صحيح أكبر لكنه ليس الأصغر.')),
    },
    originalityNote: 'مسألة حدّين جديدة تتطلب إنشاء أصغر عدد داخل مجال مفتوح والتحقق منه، لا سؤال «السابق واللاحق» المطبوع.',
  }),
  q(20, {
    type: 'multi-select', difficulty: 'thinking',
    prompt: rich(text('قارن '), math('6,381,240'), text(' و'), math('6,382,099'), text('، ثم اختر كل استنتاج تدعمه المقارنة.')),
    concepts: ['place-value', 'natural-number-order', 'comparison-symbols'], skills: ['justify-first-difference', 'evaluate-comparison-claims'], sourceConcepts: ['left-to-right-rule', 'comparison-symbols'],
    coverage: { thinking: ['evaluate-trailing-digit-claims'], commonErrors: ['infer-from-trailing-digit'] },
    options: [
      optionText('q20-a', 'العدد الأول أصغر من العدد الثاني.'),
      optionText('q20-b', 'أول اختلاف في منزلة الألوف: 1 مقابل 2.'),
      optionText('q20-c', 'العدد الأول أكبر لأن رقم الآحاد فيه 0 ورقم الآحاد في الثاني 9.'),
      optionText('q20-d', 'تساوي الملايين وحده يكفي للقول إن العددين متساويان.'),
    ],
    answer: ['q20-a', 'q20-b'],
    solution: {
      idea: rich(text('الاستنتاج الصحيح يجب أن يعتمد على أول اختلاف من اليسار لا على آخر رقم.')),
      steps: [
        rich(text('الملايين ومئات الألوف وعشرات الألوف متساوية: '), math('6=6'), text('، '), math('3=3'), text('، '), math('8=8'), text('.')),
        rich(text('في الألوف: '), math('1<2'), text('؛ إذن '), math('6,381,240 < 6,382,099'), text('.')),
        rich(text('الآحاد مختلفة أيضاً، لكنها تأتي بعد المنزلة التي حسمت المقارنة؛ والتساوي في الملايين وحده لا يعني تساوي العددين.')),
      ],
      finalAnswer: rich(text('الاستنتاجان الصحيحان: أ، ب.')),
      commonError: rich(text('إعطاء خانة الآحاد وزناً أكبر من أول اختلاف في منزلة أعلى.')),
    },
    originalityNote: 'سؤال تفكير يجمع استنتاج الرمز والمنزلة وتفنيد حجة مضللة عن الآحاد باستخدام زوج جديد.',
  }),
]

const definition = defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار مقارنة الأعداد الطبيعية وترتيبها',
  description: textOnly('اختبار مستقل من 20 سؤالاً جديداً في المقارنة بعدد الخانات والقيمة المكانية، واختيار الرموز وترتيب الأعداد، مع أسئلة تطبيق وتفكير.'),
  instructions: textOnly('أجب عن الأسئلة العشرين ثم سلّم المحاولة. لا تظهر الإجابات أو الحلول أثناء الإجابة؛ تُتاح النتيجة والحلول بعد التسليم في مساحة الحلول.'),
  questions,
  sourceConcepts: [
    { id: 'comparison-symbols', label: 'معاني الرموز < و> و= واستعمالها في المقارنة', pages: [44, 46] },
    { id: 'digit-count-rule', label: 'مقارنة عدد الخانات والحدّ الفاصل بين ست وسبع خانات', pages: [45] },
    { id: 'left-to-right-rule', label: 'قيمة المنازل وأول اختلاف عند المقارنة من اليسار إلى اليمين', pages: [45, 46] },
    { id: 'arranging-lists', label: 'ترتيب الأعداد تصاعدياً وتنازلياً بالاستناد إلى المقارنة', pages: [44, 46] },
    { id: 'neighbor-numbers', label: 'العلاقة بين العدد السابق والعدد والعدد اللاحق', pages: [47] },
  ],
  conceptLabels: {
    'natural-number-order': 'ترتيب الأعداد الطبيعية ومقارنة قيمها',
    'comparison-symbols': 'معاني رموز أصغر من وأكبر من ويساوي',
    'digit-count': 'تحديد عدد الخانات وعلاقته بحجم العدد',
    'place-value': 'قيمة المنازل ومحاذاة الأرقام المتناظرة',
    'ascending-descending': 'الترتيب التصاعدي والتنازلي',
  },
  skillLabels: {
    'select-comparison-symbol': 'اختيار رمز العلاقة الصحيح بين عددين',
    'find-first-difference': 'تحديد أول منزلة مختلفة من اليسار',
    'compare-digit-count': 'مقارنة عدد الخانات قبل مقارنة الأرقام',
    'count-digits': 'عدّ الأرقام مع تجاهل فواصل المجموعات',
    'interpret-comparison-symbols': 'قراءة الرمز بحسب طرفي المقارنة',
    'order-natural-numbers': 'ترتيب مجموعة أعداد حسب قيمها',
    'choose-highest-place-first': 'بدء المقارنة من أعلى منزلة قيمةً',
    'name-place-value': 'تسمية منزلة أول اختلاف',
    'read-place-value': 'قراءة الرقم في منزلة مسماة',
    'match-comparison-outcome': 'مطابقة زوج عددي بالعلاقة المناسبة',
    'diagnose-place-value-error': 'تشخيص مقارنة رقمين من منزلتين غير متناظرتين',
    'validate-comparison-statements': 'التحقق من صحة عبارات المقارنة',
    'interpret-order-direction': 'التمييز بين اتجاهي الترتيب',
    'compare-three-natural-numbers': 'مقارنة أكثر من عدد واحد باستخدام أول اختلاف',
    'justify-first-difference': 'تبرير العلاقة بقيمة أول منزلة مختلفة',
    'compare-zero-filled-place-values': 'المحافظة على الأصفار ومحاذاة المنازل',
    'diagnose-right-to-left-error': 'كشف خطأ البدء من جهة اليمين',
    'evaluate-comparison-justification': 'تقويم التعليل مستقلاً عن صحة النتيجة',
    'construct-number-between-bounds': 'إنشاء أصغر عدد يحقق حدّين عدديين',
    'use-successor': 'استعمال العدد التالي للتحقق من حدّ أصغر مفتوح',
    'evaluate-comparison-claims': 'اختبار الاستنتاجات المدعومة وغير المدعومة',
  },
  applicationLabels: {
    'compare-measurement-data': 'مقارنة بيانات رقمية في سياق عدّادات وأجهزة قياس',
  },
  thinkingLabels: {
    'justify-first-difference': 'تبرير كيف يحسم أول اختلاف نتيجة المقارنة',
    'evaluate-proof-not-only-answer': 'فصل صحة النتيجة عن صحة التعليل',
    'construct-minimum-between-bounds': 'إنشاء أصغر عدد داخل مجال عددي محدد',
    'evaluate-trailing-digit-claims': 'تقييم حجة تعتمد على الآحاد بعد اختلاف منزلة أعلى',
  },
  commonErrorLabels: {
    'compare-from-right': 'البدء من الآحاد بدلاً من أعلى منزلة',
    'misread-digit-count': 'عدّ الخانات أو تحديد حدّ المليون بطريقة غير صحيحة',
    'infer-from-trailing-digit': 'استنتاج العلاقة من رقم الآحاد وحده',
  },
})

export default definition
