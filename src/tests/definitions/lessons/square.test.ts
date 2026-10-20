import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/**
 * الوحدة الثانية · الدرس 10 — المربّع (الكتاب ص 81–84).
 *
 * عشرون سؤالاً جديداً: 6 أساسي، 7 متوسط، 4 متقدّم، 3 تفكير. لا يعيد أي سؤال نصّ تمرين مطبوع
 * ولا سؤالاً من منطقة المعلم؛ كل سؤال ينقل فكرةً مدروسة (تكافؤ التعريفين، الخواصّ الثلاث،
 * الشرط الناقص، الرسم، الرأس الرابع على قطعة رأسية، الأطوال في الأشكال المركّبة، واتجاه
 * الاحتواء بين العائلات) إلى موقف جديد بأحرف وأرقام مختلفة عن الكتاب.
 *
 * موازنة مواضع الإجابة الصحيحة: الخيارات مكتوبة بترتيب ثابت في المحرّك، لذلك دُوّرت مواضع
 * الصحيح يدوياً: في أسئلة الاختيار الفردي الخمسة يقع الصحيح في الموضع 3 ثم 1 ثم 4 ثم 2 ثم 3،
 * وفي السؤال الثاني عشر (اختيار متعدد) الصحيحان في الموضعين 2 و4، وقد تحقق الفحص الآلي
 * (`lesson-square-check`) من أن كل مفتاح يُصحَّح «صحيحاً» بعد هذا الترتيب.
 *
 * لا تظهر أي إجابة أو حلّ قبل التسليم؛ منطقة الحلول تُفتح بعد المحاولة فقط.
 */

const testId = 'lesson-square-test'
const lessonId = 'square'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })
const CM_UNITS = ['cm', 'سم', 'centimeter', 'centimeters', 'سنتيمتر', 'سنتيمترات']
const DEGREE_UNITS = ['°', 'degree', 'degrees', 'درجة', 'درجات']

const questions: QuestionDefinition[] = [
  /* ------------------------------------------------------------ أساسي (6) */
  q(1, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ العبارات الآتية تعريف صحيح للمربّع؟')),
    concepts: ['square-two-definitions'], skills: ['state-square-definition'], sourceConcepts: ['square-definition'],
    options: [
      optionText('q01-a', 'شكل رباعي أضلاعه الأربعة متساوية فقط'),
      optionText('q01-b', 'مستطيل طوله أكبر من عرضه'),
      optionText('q01-c', 'مستطيل تساوى بعداه'),
      optionText('q01-d', 'متوازي أضلاع فيه ضلعان متجاوران متساويان فقط'),
    ],
    answer: 'q01-c',
    solution: {
      idea: rich(text('التعريف يجمع شرطين: أن يكون الشكل مستطيلاً، وأن يتساوى بعداه.')),
      rule: rich(text('المربّع هو مستطيل تساوى بعداه، أو معيّن فيه زاوية قائمة.')),
      steps: [
        rich(text('«أضلاعه متساوية فقط» تصف المعيّن، وقد لا تكون فيه زاوية قائمة.')),
        rich(text('«طوله أكبر من عرضه» نقيض المطلوب تماماً.')),
        rich(text('«متوازي أضلاع فيه ضلعان متجاوران متساويان» يصف المعيّن لا المربّع.')),
        rich(text('«مستطيل تساوى بعداه» يجمع الشرطين معاً، وهو التعريف المطبوع.')),
      ],
      finalAnswer: rich(text('مستطيل تساوى بعداه.')),
      commonError: rich(text('اختيار الوصف الذي يذكر تساوي الأضلاع وحدها.')),
    },
    originalityNote: 'يعيد صياغة تعريف ص 81 ضمن أربعة أوصاف متقاربة، ثلاثة منها ناقصة أو تصف المعيّن، بدل طلب استظهار التعريف.',
  }),
  q(2, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('كلّ مربّع هو معيّن.')),
    concepts: ['square-relations'], skills: ['judge-inclusion-direction'], sourceConcepts: ['square-definition'],
    answer: true,
    solution: {
      idea: rich(text('المربّع يحقق شرط المعيّن زيادةً على شرط الزاوية القائمة.')),
      rule: rich(text('المعيّن هو متوازي أضلاع أضلاعه الأربعة متساوية؛ والمربّع كذلك.')),
      steps: [
        rich(text('أضلاع المربّع الأربعة متساوية، فهذا يحقق شرط المعيّن.')),
        rich(text('لذلك يُعدّ المربّع حالة خاصة من المعيّن، وليس العكس.')),
      ],
      finalAnswer: rich(text('صحيح.')),
      commonError: rich(text('عكس الاتجاه: اعتبار كل معيّن مربّعاً.')),
    },
    originalityNote: 'يفصل اتجاه الاحتواء بين المربّع والمعيّن في عبارة واحدة، بينما يعرض الكتاب ذلك داخل جدول صح/خطأ من أربع عبارات.',
  }),
  q(3, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('مربّع '), math('KLMN'), text(' (الرؤوس بالترتيب) طول ضلعه '), math('KL = 6 cm'), text('. ما طول الضلع '), math('MN'), text('؟')),
    concepts: ['square-equal-sides'], skills: ['transfer-length-to-opposite-side'], sourceConcepts: ['square-equal-sides'],
    answer: { expected: '6', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('أضلاع المربّع الأربعة متساوية، فلا حاجة إلى عملية حسابية.')),
      rule: rich(text('أضلاع المربّع الأربعة متساوية الطول.')),
      steps: [
        rich(text('الضلع '), math('MN'), text(' أحد أضلاع المربّع الأربعة.')),
        rich(math('MN = KL = 6 cm')),
      ],
      finalAnswer: rich(math('6 cm')),
      commonError: rich(text('محاولة استعمال الطول والعرض كما في المستطيل، بينما الطولان هنا متساويان.')),
    },
    originalityNote: 'ينقل خاصّة تساوي أضلاع ص 82 إلى مربّع بأحرف وطول جديدين (6 cm بدل 3 cm في مثال الكتاب).',
  }),
  q(4, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ شكل ممّا يأتي ليس مربّعاً؟')),
    concepts: ['square-non-examples'], skills: ['identify-missing-condition'], sourceConcepts: ['square-why-not'],
    options: [
      optionText('q04-a', 'معيّن فيه زاوية قائمة'),
      optionText('q04-b', 'مستطيل أضلاعه الأربعة متساوية'),
      optionText('q04-c', 'مربّع مرسوم بميل على الورقة'),
      optionText('q04-d', 'معيّن أضلاعه متساوية ولا زاوية فيه قائمة'),
    ],
    answer: 'q04-d',
    solution: {
      idea: rich(text('نبحث عن الشكل الذي تنقصه إحدى الخاصّتين: تساوي الأضلاع أو الزاوية القائمة.')),
      rule: rich(text('المربّع يحتاج إلى الشرطين معاً.')),
      steps: [
        rich(text('«معيّن فيه زاوية قائمة» هو التعريف الثاني للمربّع.')),
        rich(text('«مستطيل أضلاعه متساوية» هو التعريف الأول.')),
        rich(text('الميل على الورقة لا يغيّر القياسات، فالشكل المائل قد يكون مربّعاً.')),
        rich(text('المعيّن بلا زاوية قائمة يفقد أحد الشرطين، فهو ليس مربّعاً.')),
      ],
      finalAnswer: rich(text('المعيّن الذي لا زاوية قائمة فيه.')),
      commonError: rich(text('استبعاد المربّع المائل لأنه لا يبدو أفقياً.')),
    },
    originalityNote: 'يحوّل جدول «ليس مربّعاً» في ص 82 إلى اختيار من أربع حالات إحداها فقط تنقصها الزاوية القائمة.',
  }),
  q(5, {
    type: 'multi-select', difficulty: 'basic',
    prompt: rich(text('اختر كلّ خاصّية تتحقق في كلّ مربّع.')),
    concepts: ['square-properties'], skills: ['identify-guaranteed-properties'], sourceConcepts: ['square-properties'],
    options: [
      optionText('q05-a', 'قطراه متعامدان ومتساويان معاً في كلّ الحالات'),
      optionText('q05-b', 'كلّ ضلعين متقابلين متوازيان'),
      optionText('q05-c', 'أضلاعه الأربعة متساوية'),
      optionText('q05-d', 'ضلعان متجاوران مختلفان في الطول'),
      optionText('q05-e', 'زواياه الأربع قائمة'),
    ],
    answer: ['q05-b', 'q05-c', 'q05-e'],
    solution: {
      idea: rich(text('الخواص الثلاث المطبوعة في ص 82 هي المرجع.')),
      rule: rich(text('كلّ ضلعين متقابلين متوازيان، والأضلاع الأربعة متساوية، والزوايا الأربع قائمة.')),
      steps: [
        rich(text('التوازي خاصّة موروثة من متوازي الأضلاع.')),
        rich(text('تساوي الأضلاع موروث من المعيّن، وقائمية الزوايا موروثة من المستطيل.')),
        rich(text('اختلاف الضلعين المتجاورين نقيض المربّع، والخاصّة القطرية لم تُدرَس في هذا الدرس.')),
      ],
      finalAnswer: rich(text('التوازي، وتساوي الأضلاع، وقائمية الزوايا.')),
    },
    originalityNote: 'يختبر الخواصّ الثلاث من ص 82 بترتيب جديد مع بديلين: نقيض تساوي الأضلاع، وخاصّة قطرية خارج نطاق الدرس.',
  }),
  q(6, {
    type: 'matching', difficulty: 'basic',
    prompt: rich(text('طابق كلّ وصف مع اسم الشكل الذي ينطبق عليه تماماً.')),
    concepts: ['square-relations', 'square-non-examples'], skills: ['match-description-to-shape-name'], sourceConcepts: ['square-opening-sort', 'square-why-not'],
    left: [
      optionText('q06-l1', 'مستطيل بعداه متساويان'),
      optionText('q06-l2', 'مستطيل طوله 8 cm وعرضه 3 cm'),
      optionText('q06-l3', 'معيّن أضلاعه متساوية ولا زاوية فيه قائمة'),
      optionText('q06-l4', 'متوازي أضلاع لا زاوية قائمة فيه وأضلاعه غير متساوية'),
    ],
    right: [
      optionText('q06-r1', 'مربّع'),
      optionText('q06-r2', 'مستطيل ليس مربّعاً'),
      optionText('q06-r3', 'معيّن ليس مربّعاً'),
      optionText('q06-r4', 'متوازي أضلاع ليس مستطيلاً ولا معيّناً'),
    ],
    answer: [
      { leftId: 'q06-l1', rightId: 'q06-r1' },
      { leftId: 'q06-l2', rightId: 'q06-r2' },
      { leftId: 'q06-l3', rightId: 'q06-r3' },
      { leftId: 'q06-l4', rightId: 'q06-r4' },
    ],
    solution: {
      idea: rich(text('كلّما أضفنا شرطاً ضاقت العائلة: متوازي الأضلاع ثم المستطيل أو المعيّن ثم المربّع.')),
      steps: [
        rich(text('المستطيل المتساوي البعدين يفي بالتعريف الأول للمربّع.')),
        rich(text('المستطيل 8 cm × 3 cm زواياه قائمة لكن بعداه مختلفان.')),
        rich(text('المعيّن بلا زاوية قائمة يفقد شرط المربّع الثاني.')),
        rich(text('متوازي الأضلاع العام لا زاوية قائمة فيه ولا تساوي أضلاع.')),
      ],
      finalAnswer: rich(text('مربّع، ثم مستطيل ليس مربّعاً، ثم معيّن ليس مربّعاً، ثم متوازي أضلاع ليس مستطيلاً ولا معيّناً.')),
      commonError: rich(text('مطابقة المعيّن بالمربّع لأن أضلاعه متساوية.')),
    },
    originalityNote: 'يعيد فرز عائلة الأشكال الرباعية في ص 81–82 بأوصاف لفظية بأبعاد جديدة، بدل الأشكال المرسومة أو جدول الصح والخطأ.',
  }),

  /* ------------------------------------------------------------ متوسط (7) */
  q(7, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('رُسم مربّع طول ضلعه '), math('5 cm'), text('. ما مجموع أطوال أضلاعه الأربعة؟')),
    concepts: ['square-perimeter'], skills: ['compute-perimeter'], sourceConcepts: ['square-perimeter'],
    coverage: { applications: ['lengths-around-squares'] },
    answer: { expected: '20', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('الأضلاع الأربعة متساوية، فيُضاعف الطول أربع مرات.')),
      rule: rich(text('محيط المربّع = طول الضلع × 4.')),
      steps: [
        rich(text('الأضلاع الأربعة كلّها '), math('5 cm'), text('.')),
        rich(math('5 + 5 + 5 + 5 = 20')),
      ],
      finalAnswer: rich(math('20 cm')),
      commonError: rich(text('جمع الطول مرّتين فقط كما في المستطيل.')),
    },
    originalityNote: 'يستعمل تساوي أضلاع ص 82 في حساب محيط مربّع بضلع 5 cm، وليس في الكتاب تمرين محيط بهذا الشكل.',
  }),
  q(8, {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب خطوات رسم مربّع طول ضلعه '), math('4 cm'), text(' بالمسطرة والكوس.')),
    concepts: ['square-construction'], skills: ['sequence-square-construction'], sourceConcepts: ['square-construction'],
    items: [
      optionText('q08-a', 'نصل بين النقطتين الجديدتين فيُغلق الشكل'),
      optionText('q08-b', 'نرسم قطعة مستقيمة طولها 4 cm ونسمّي طرفيها'),
      optionText('q08-c', 'نعيّن على العمود نقطة تبعد 4 cm عن الطرف'),
      optionText('q08-d', 'نقيم عموداً على القطعة من الطرف الأوّل'),
      optionText('q08-e', 'نقيم عموداً من الطرف الآخر ونعيّن عليه نقطة تبعد 4 cm'),
    ],
    answer: ['q08-b', 'q08-d', 'q08-c', 'q08-e', 'q08-a'],
    solution: {
      idea: rich(text('الضلع أولاً، ثم عمود وطول عند كلّ طرف، ثم الوصل.')),
      steps: [
        rich(text('لا يمكن إقامة عمود قبل رسم القطعة.')),
        rich(text('العمود يُقام ثم تُعيَّن النقطة عليه بالطول نفسه في كلّ طرف.')),
        rich(text('الوصل آخر خطوة، وبعدها يمكن التحقق من الطول الرابع والزوايا.')),
      ],
      finalAnswer: rich(text('قطعة 4 cm ← عمود من الطرف الأول ← نقطة 4 cm ← عمود من الطرف الآخر ونقطة 4 cm ← وصل.')),
      commonError: rich(text('تعيين النقطة على العمود بطول مختلف عن الضلع الأول.')),
    },
    originalityNote: 'يعيد ترتيب خطوات ص 83 بعد خلطها وبتغيير الطول إلى 4 cm، بدل قراءتها مرقّمة كما هي.',
  }),
  q(9, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('في المربّع '), math('ABCD'), text('، ما مجموع قياسي الزاويتين المتجاورتين '), math('Â'), text(' و'), math('B̂'), text('؟')),
    concepts: ['square-angles'], skills: ['sum-adjacent-angles'], sourceConcepts: ['square-properties'],
    answer: { expected: '180', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: DEGREE_UNITS } },
    solution: {
      idea: rich(text('كلّ زاوية من زوايا المربّع قائمة.')),
      rule: rich(text('زوايا المربّع الأربع قائمة، قياس كلّ منها 90°.')),
      steps: [
        rich(text('الزاويتان المتجاورتان في المربّع قائمتان.')),
        rich(math('90 + 90 = 180')),
      ],
      finalAnswer: rich(math('180°')),
      commonError: rich(text('استعمال 360° مع أنه مجموع الزوايا الأربع لا زاويتين.')),
    },
    originalityNote: 'يحوّل خاصّة الزوايا القائمة في ص 82 إلى سؤال جمع زاويتين متجاورتين، وهو استنتاج غير مطبوع كتمرين.',
  }),
  q(10, {
    type: 'error-analysis', difficulty: 'medium',
    prompt: rich(text('قال طالب: «شكل رباعي أضلاعه الأربعة متساوية، إذن هو مربّع». اختر التشخيص والتصحيح لاستدلاله.')),
    concepts: ['square-non-examples'], skills: ['detect-missing-condition'], sourceConcepts: ['square-why-not'],
    coverage: { commonErrors: ['equal-sides-are-enough'] },
    studentWork: rich(text('أضلاعه الأربعة متساوية ⇐ مربّع')),
    diagnoses: [
      optionText('q10-d1', 'الاستدلال صحيح تماماً، وتساوي الأضلاع وحده يكفي'),
      optionText('q10-d2', 'تنقصه خاصّة الزاوية القائمة، فقد يكون الشكل معيّناً فقط'),
    ],
    corrections: [
      option('q10-c1', text('نضيف شرط الزاوية القائمة إلى تساوي الأضلاع')),
      option('q10-c2', text('لا تصحيح مطلوب')),
    ],
    answer: { diagnosisId: 'q10-d2', correctionId: 'q10-c1' },
    solution: {
      idea: rich(text('تساوي الأضلاع نصف التعريف فقط.')),
      rule: rich(text('المربّع معيّن فيه زاوية قائمة، والشرطان معاً لا شرط واحد.')),
      steps: [
        rich(text('الأضلاع المتساوية تعطي معيّناً، وقد تكون زواياه 60° و120°.')),
        rich(text('لتحويل المعيّن إلى مربّع يجب أن تكون فيه زاوية قائمة.')),
      ],
      finalAnswer: rich(text('التشخيص: الشرط الناقص هو الزاوية القائمة؛ والتصحيح: نضيفه.')),
      commonError: rich(text('اعتبار تساوي الأضلاع شرطاً كافياً.')),
    },
    originalityNote: 'يحلّل خطأً منطقياً في استدلال (الشرط الناقص) بدل إعادة صياغة سؤال «علّل لماذا ليس مربّعاً» المطبوع.',
  }),
  q(11, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('مربّعان متلاصقان يشتركان في ضلع، طول ضلع كلّ منهما '), math('5 cm'), text('. ما مجموع أطوال أضلاع الشكل الناتج (محيطه)؟')),
    concepts: ['composite-lengths'], skills: ['add-collinear-lengths'], sourceConcepts: ['square-composite-lengths'],
    coverage: { thinking: ['chain-two-squares'] },
    answer: { expected: '30', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('الشكل الناتج مستطيل طوله ضعف الضلع وعرضه ضلع واحد.')),
      rule: rich(text('محيط المستطيل = 2 × (الطول + العرض).')),
      steps: [
        rich(text('الضلعان المتلاصقان يتجادلان داخل الشكل ولا يدخلان في المحيط.')),
        rich(text('الطول الناتج '), math('5 + 5 = 10 cm'), text(' والعرض '), math('5 cm'), text('.')),
        rich(math('2 × (10 + 5) = 30')),
      ],
      finalAnswer: rich(math('30 cm')),
      commonError: rich(text('جمع محيطي المربّعين (40) من دون حذف الضلع المشترك مرّتين.')),
    },
    originalityNote: 'يبني على فكرة الأشكال المركّبة في تدرّب ④ ص 84 لكن بتراكب مربّعين متلاصقين وحساب المحيط، وهو موقف غير مطبوع.',
  }),
  q(12, {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر كلّ عبارة صحيحة.')),
    concepts: ['square-relations'], skills: ['judge-inclusion-direction'], sourceConcepts: ['square-true-false'],
    options: [
      optionText('q12-a', 'كلّ معيّن هو مربّع'),
      optionText('q12-b', 'كلّ مربّع هو مستطيل'),
      optionText('q12-c', 'يوجد مستطيل ليس مربّعاً'),
      optionText('q12-d', 'كلّ مربّع هو متوازي أضلاع'),
      optionText('q12-e', 'يوجد مربّع ليس معيّناً'),
    ],
    answer: ['q12-b', 'q12-c', 'q12-d'],
    solution: {
      idea: rich(text('المربّع أضيق العائلات، فهو داخل المستطيل وداخل المعيّن وداخل متوازي الأضلاع.')),
      steps: [
        rich(text('«كلّ معيّن مربّع» خاطئة: المعيّن قد لا يحوي زاوية قائمة.')),
        rich(text('«كلّ مربّع مستطيل» صحيحة، و«كلّ مربّع متوازي أضلاع» صحيحة.')),
        rich(text('يوجد مستطيل 8 × 3 ليس مربّعاً، بينما لا يوجد مربّع ليس معيّناً.')),
      ],
      finalAnswer: rich(text('كلّ مربّع مستطيل، وكلّ مربّع متوازي أضلاع، ويوجد مستطيل ليس مربّعاً.')),
      commonError: rich(text('عكس اتجاه الاحتواء في العبارتين الأولى والخامسة.')),
    },
    originalityNote: 'يوسّع جدول صح/خطأ في ص 84 إلى خمس عبارات باختيار متعدد، ويضيف الاتجاه العكسي والوجود بالفعل.',
  }),
  q(13, {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابق كلّ شكل مع سبب كونه ليس مربّعاً.')),
    concepts: ['square-non-examples'], skills: ['diagnose-why-not-square'], sourceConcepts: ['square-why-not'],
    left: [
      optionText('q13-l1', 'مستطيل 9 cm × 4 cm'),
      optionText('q13-l2', 'معيّن زاويته 70°'),
      optionText('q13-l3', 'متوازي أضلاع لا زاوية قائمة فيه وضلعاه المتجاوران مختلفان'),
    ],
    right: [
      optionText('q13-r1', 'زواياه قائمة ولكن بعداه غير متساويين'),
      optionText('q13-r2', 'أضلاعه متساوية ولكن لا زاوية قائمة فيه'),
      optionText('q13-r3', 'ينقصه الشرطان معاً'),
    ],
    answer: [
      { leftId: 'q13-l1', rightId: 'q13-r1' },
      { leftId: 'q13-l2', rightId: 'q13-r2' },
      { leftId: 'q13-l3', rightId: 'q13-r3' },
    ],
    solution: {
      idea: rich(text('لكلّ شكل نبحث عن الشرط الناقص تحديداً.')),
      steps: [
        rich(text('المستطيل يحقق الزوايا القائمة فقط.')),
        rich(text('المعيّن يحقق تساوي الأضلاع فقط.')),
        rich(text('متوازي الأضلاع العام لا يحقق أياً من شرطي المربّع.')),
      ],
      finalAnswer: rich(text('بعدان غير متساويين، ثم لا زاوية قائمة، ثم الشرطان ناقصان.')),
      commonError: rich(text('إعطاء السبب نفسه لكلّ الأشكال.')),
    },
    originalityNote: 'يحوّل الجدول المطبوع «علّل لماذا ليس مربّعاً» في ص 82 إلى مطابقة سبب محدّد لكلّ شكل بأبعاد جديدة.',
  }),

  /* ------------------------------------------------------------ متقدّم (4) */
  q(14, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('مربّع '), math('XWQP'), text(' طول ضلعه '), math('3 cm'), text(' ملاصق من جهة اليمين لمستطيل '), math('WSRQ'), text(' فيه '), math('QR = 8 cm'), text('، والنقاط '), math('X, W, S'), text(' على استقامة واحدة. ما طول '), math('XS'), text('؟')),
    concepts: ['composite-lengths'], skills: ['combine-collinear-segments'], sourceConcepts: ['square-composite-lengths'],
    coverage: { applications: ['lengths-around-squares'], thinking: ['chain-two-squares'] },
    answer: { expected: '11', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('XS مجموع قطعتين على الخط نفسه: ضلع المربّع وضلع المستطيل.')),
      rule: rich(text('أضلاع المربّع متساوية، وفي المستطيل كلّ ضلعين متقابلين متساويان.')),
      steps: [
        rich(math('XW = 3 cm'), text(' لأن '), math('XWQP'), text(' مربّع.')),
        rich(math('WS = QR = 8 cm'), text(' لأن '), math('WSRQ'), text(' مستطيل.')),
        rich(math('XS = 3 + 8 = 11')),
      ],
      finalAnswer: rich(math('11 cm')),
      commonError: rich(text('استعمال 8 cm طولاً كاملاً ونسيان ضلع المربّع.')),
    },
    originalityNote: 'يستعمل بنية الشكل المركّب في تدرّب ④ ص 84 بأرقام جديدة (3 cm و8 cm) وطول مطلوب مختلف (XS بدل RS).',
  }),
  q(15, {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('طُلب إكمال القطعة الرأسية '), math('XY'), text(' (النقطة '), math('X'), text(' أعلى) إلى مربّع '), math('XYZW'), text('. عيّن طالب '), math('Z'), text(' على العمود من '), math('X'), text(' و'), math('W'), text(' على العمود من '), math('Y'), text('. اختر التشخيص والتصحيح.')),
    concepts: ['square-fourth-vertex'], skills: ['diagnose-fourth-vertex-error'], sourceConcepts: ['square-fourth-vertex'],
    coverage: { commonErrors: ['break-vertex-order'] },
    studentWork: rich(text('Z فوق X، و W تحت Y، بترتيب X → Y → Z → W')),
    diagnoses: [
      optionText('q15-d1', 'الخطأ في الأطوال فقط، أمّا مواضع الرؤوس فصحيحة'),
      optionText('q15-d2', 'الخطأ في الترتيب: Z يجب أن يلي Y، وW يلي Z، فلا يصح عكس الجهتين'),
    ],
    corrections: [
      option('q15-c1', text('نضع Z و W على العمودين في الجهة نفسها من XY')),
      option('q15-c2', text('نضاعف طول XY عند التعيين')),
    ],
    answer: { diagnosisId: 'q15-d2', correctionId: 'q15-c1' },
    solution: {
      idea: rich(text('التسمية تتتبع المحيط، فالقطعة الأولى [XY] ضلع، وما يليها يجب أن يكون متجاوراً.')),
      rule: rich(text('في المربّع كلّ ضلعين متجاورين متعامدان ومتساويان.')),
      steps: [
        rich(text('Z يلي Y، فيجب أن تُقام [YZ] عمودياً على [XY] من Y.')),
        rich(text('W يلي Z ويسبق X، فيكون XW عمودياً على XY من X وفي الجهة نفسها.')),
        rich(text('وضع Z و W في جهتين مختلفتين يجعل الشكل متقاطعاً لا مربّعاً.')),
      ],
      finalAnswer: rich(text('التشخيص: عكس ترتيب الرؤوس؛ والتصحيح: Z و W في الجهة نفسها.')),
      commonError: rich(text('الاكتفاء بتساوي الأطوال وإهمال الترتيب.')),
    },
    originalityNote: 'يشخّص خطأ ترتيب الرؤوس في تدرّب ② ص 84 (بدل تنفيذ التعيين نفسه)، ويستعمل قطعة رأسية كما في الكتاب.',
  }),
  q(16, {
    type: 'single-choice', difficulty: 'advanced',
    prompt: rich(text('أيّ مجموعة شروط تكفي وحدها لضمان أن شكل رباعي مستوٍ مربّع؟')),
    concepts: ['square-two-definitions'], skills: ['evaluate-sufficient-conditions'], sourceConcepts: ['square-definition'],
    coverage: { thinking: ['evaluate-sufficiency'] },
    options: [
      optionText('q16-a', 'أربعة أضلاع متساوية'),
      optionText('q16-b', 'أربع زوايا قائمة'),
      optionText('q16-c', 'زاويتان قائمتان متجاورتان وضلعان متجاوران متساويان'),
      optionText('q16-d', 'أربعة أضلاع متساوية وزاوية واحدة قائمة'),
    ],
    answer: 'q16-d',
    solution: {
      idea: rich(text('الشرط الكافي يجب أن يضمن تساوي الأضلاع وقائمية الزوايا معاً.')),
      rule: rich(text('المربّع = معيّن + زاوية قائمة، أو مستطيل + بعدان متساويان.')),
      steps: [
        rich(text('أربعة أضلاع متساوية تعطي معيّناً قد لا يحوي زاوية قائمة.')),
        rich(text('أربع زوايا قائمة تعطي مستطيلاً قد لا تتساوى أبعاده.')),
        rich(text('زاويتان متجاورتان قائمتان لا تضمنان تعامد الضلعين الآخرين.')),
        rich(text('معيّن فيه زاوية قائمة ← الزوايا الأربع قائمة ← المربّع.')),
      ],
      finalAnswer: rich(text('أربعة أضلاع متساوية وزاوية واحدة قائمة.')),
      commonError: rich(text('الاكتفاء بأربع زوايا قائمة لأن المستطيل قريب من المربّع.')),
    },
    originalityNote: 'يحوّل تكافؤ التعريفين في ص 81 إلى تقويم كفاية شروط، ويضمّ شروطاً ناقصة غير مطبوعة في الكتاب.',
  }),
  q(17, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('محيط مربّع '), math('24 cm'), text('. ما طول ضلعه؟')),
    concepts: ['square-perimeter'], skills: ['divide-perimeter-by-four'], sourceConcepts: ['square-perimeter'],
    coverage: { applications: ['lengths-around-squares'], thinking: ['reverse-perimeter'] },
    answer: { expected: '6', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('الأضلاع الأربعة متساوية، فالمحيط أربعة أمثال الضلع.')),
      rule: rich(text('محيط المربّع = 4 × طول الضلع.')),
      steps: [
        rich(text('ليكن طول الضلع '), math('s'), text('، فيكون '), math('4 × s = 24'), text('.')),
        rich(math('s = 24 ÷ 4 = 6')),
      ],
      finalAnswer: rich(math('6 cm')),
      commonError: rich(text('القسمة على 2 كما لو كان مستطيلاً بمعلومية الطول والعرض.')),
    },
    originalityNote: 'يعكس علاقة المحيط بالضلع في مربّع محيطه 24 cm، وهو عكس لم يرد في تمارين ص 84.',
  }),

  /* ------------------------------------------------------------ تفكير (3) */
  q(18, {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('قال طالب: «المربّع مستطيل، لذلك كلّ مستطيل مربّع». اختر التشخيص والتصحيح.')),
    concepts: ['square-relations'], skills: ['judge-inclusion-direction'], sourceConcepts: ['square-true-false'],
    coverage: { commonErrors: ['reverse-inclusion-direction'], thinking: ['reason-about-inclusion'] },
    studentWork: rich(text('المربّع مستطيل ⇐ كلّ مستطيل مربّع')),
    diagnoses: [
      optionText('q18-d1', 'الاستدلال معكوس: الاحتواء من المربّع إلى المستطيل وليس العكس'),
      optionText('q18-d2', 'الاستدلال صحيح لأنّ كليهما متوازي أضلاع'),
    ],
    corrections: [
      optionText('q18-c1', 'كلّ مربّع مستطيل، ويوجد مستطيلات ليست مربّعات'),
      optionText('q18-c2', 'كلّ مستطيل مربّع لأن الزوايا قائمة'),
    ],
    answer: { diagnosisId: 'q18-d1', correctionId: 'q18-c1' },
    solution: {
      idea: rich(text('الحالة الخاصة تنتمي إلى العامة، ولا تنتمي العامة إليها.')),
      rule: rich(text('المربّع مستطيل تساوى بعداه، فالمستطيل أعمّ منه.')),
      steps: [
        rich(text('كلّ مربّع مستطيل: صحيح.')),
        rich(text('مستطيل 6 × 2 ليس مربّعاً: مثال مضاد ينسف العكس.')),
        rich(text('إذن الاتجاه الوحيد الصحيح هو من المربّع إلى المستطيل.')),
      ],
      finalAnswer: rich(text('التشخيص: عكس اتجاه الاحتواء؛ والتصحيح: كلّ مربّع مستطيل ويوجد مستطيلات ليست مربّعات.')),
      commonError: rich(text('الخلط بين اللازم والكافي.')),
    },
    originalityNote: 'يشخّص خطأ عكس الاحتواء في عبارة من ص 84 بدل الحكم عليها بالصح أو الخطأ، ويطلب التصحيح اللغوي للمنطق.',
  }),
  q(19, {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('مربّع '), math('ABCD'), text(' طول ضلعه '), math('7 cm'), text('. مدّدنا الضلع '), math('BC'), text(' من جهة '), math('C'), text(' بمقدار '), math('4 cm'), text(' إلى نقطة '), math('F'), text('، ثم أتممنا الشكل بحيث يصبح '), math('ABFD'), text(' مستطيلاً. ما طول '), math('DF'), text('؟')),
    concepts: ['composite-lengths'], skills: ['combine-collinear-segments'], sourceConcepts: ['square-composite-lengths'],
    coverage: { thinking: ['chain-two-squares'], applications: ['lengths-around-squares'] },
    answer: { expected: '11', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('DF يقابل AF في المستطيل، وAF مجموع على استقامة واحدة.')),
      rule: rich(text('في المستطيل كلّ ضلعين متقابلين متساويان، وأضلاع المربّع متساوية.')),
      steps: [
        rich(math('BC = 7 cm'), text(' لأن '), math('ABCD'), text(' مربّع.')),
        rich(math('CF = 4 cm'), text(' بالتمديد.')),
        rich(math('AF = AB + BF'), text(' لكن الأسهل أن '), math('DF'), text(' يقابل '), math('AF'), text('، و'), math('AF = 7 + 4 = 11 cm'), text('.')),
        rich(text('إذن '), math('DF = 11 cm'), text('.')),
      ],
      finalAnswer: rich(math('11 cm')),
      commonError: rich(text('إعطاء 7 cm لأنها ضلع المربّع، مع أن DF يقابل الضلع الممدّد كاملاً.')),
    },
    originalityNote: 'يمهّد لمسألة الأطوال المركّبة في ص 84 بتمديد ضلع وحساب الضلع المقابل في المستطيل الناتج، بأرقام وأحرف جديدة.',
  }),
  q(20, {
    type: 'true-false', difficulty: 'thinking',
    prompt: rich(text('إذا تساوى في شكل رباعي بعداه وكانت الزاويتان المتقابلتان فيه متساويتين، فإنّه يكون مربّعاً.')),
    concepts: ['square-two-definitions'], skills: ['evaluate-sufficient-conditions'], sourceConcepts: ['square-definition'],
    coverage: { thinking: ['evaluate-sufficiency'], commonErrors: ['insufficient-shape-evidence'] },
    answer: false,
    solution: {
      idea: rich(text('تساوي الأبعاد وتساوي زاويتين متقابلتين لا يضمن أن الزوايا قائمة.')),
      rule: rich(text('المربّع يحتاج زوايا قائمة صراحةً، لا مجرّد تساوي زاويتين متقابلتين.')),
      steps: [
        rich(text('خذ معيّناً زاويته 80°: الضلعان المتجاوران متساويان، والزاويتان المتقابلتان متساويتان.')),
        rich(text('لكن الزوايا ليست قائمة، فلا يكون الشكل مربّعاً.')),
        rich(text('إذن الشرطان المذكوران غير كافيين، والعبارة خاطئة.')),
      ],
      finalAnswer: rich(text('خطأ.')),
      commonError: rich(text('الخلط بين تساوي زاويتين متقابلتين وكون الزوايا قائمة.')),
    },
    originalityNote: 'يختبر كفاية مجموعة شروط تبدو قريبة من التعريفين المطبوعين، بمثال مضاد معيّن بزاوية 80°.',
  }),
]

const definition = defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار المربّع',
  description: rich(text('اختبار مستقلّ من عشرين سؤالاً يقيس درس المربّع (ص 81–84): التعريفان، والخواصّ، والشرط الناقص، والرسم، والرأس الرابع، والأطوال المركّبة، وعلاقات الاحتواء.')),
  instructions: rich(text('أجب عن الأسئلة العشرين ثمّ سلّم المحاولة لتظهر النتيجة، ثمّ راجع الحلول المفصّلة. لا يظهر أيّ حلّ قبل التسليم.')),
  questions,
  sourceConcepts: [
    { id: 'square-definition', label: 'تعريفا المربّع المتكافئان (ص 81)', pages: [81] },
    { id: 'square-opening-sort', label: 'فرز الأشكال السبعة في انطلاقة الدرس (ص 81)', pages: [81] },
    { id: 'square-properties', label: 'خواصّ المربّع الثلاث (ص 82)', pages: [82] },
    { id: 'square-equal-sides', label: 'تساوي الأضلاع الأربعة وتطبيقه على الأطوال (ص 82)', pages: [82] },
    { id: 'square-why-not', label: 'تعليل كون الشكل ليس مربّعاً (ص 82)', pages: [82] },
    { id: 'square-construction', label: 'خطوات رسم المربّع بالأدوات (ص 83)', pages: [83] },
    { id: 'square-true-false', label: 'علاقات المربّع بالمستطيل والمعيّن ومتوازي الأضلاع (ص 84)', pages: [84] },
    { id: 'square-fourth-vertex', label: 'تعيين الرأسين الثالث والرابع على قطعة رأسية (ص 84)', pages: [84] },
    { id: 'square-composite-lengths', label: 'الأطوال في الأشكال المركّبة من مربّع ومستطيل (ص 84)', pages: [84] },
    { id: 'square-perimeter', label: 'محيط المربّع بوصفه تطبيقاً على تساوي الأضلاع (ص 82)', pages: [82] },
  ],
  conceptLabels: {
    'square-two-definitions': 'تكافؤ تعريفي المربّع',
    'square-relations': 'علاقة المربّع بعائلات الأشكال الرباعية',
    'square-equal-sides': 'تساوي أضلاع المربّع',
    'square-non-examples': 'أمثلة الأشكال التي ليست مربّعات',
    'square-properties': 'الخواصّ الثلاث للمربّع',
    'square-angles': 'قائمية زوايا المربّع',
    'square-construction': 'بناء المربّع بالأدوات',
    'square-composite-lengths': 'أطوال في أشكال مركّبة',
    'square-fourth-vertex': 'تعيين الرؤوس المتبقية',
    'square-perimeter': 'محيط المربّع',
    'composite-lengths': 'أطوال في شكل مركّب من مربّع ومستطيل',
  },
  skillLabels: {
    'state-square-definition': 'تمييز تعريف المربّع من البدائل الناقصة',
    'judge-inclusion-direction': 'تحديد اتجاه العلاقة بين المربّع وبقية الأشكال',
    'transfer-length-to-opposite-side': 'نقل الطول بين أضلاع متساوية',
    'identify-missing-condition': 'كشف الشرط الناقص في الحكم على الشكل',
    'identify-guaranteed-properties': 'تمييز الخواصّ المضمونة في كلّ مربّع',
    'match-description-to-shape-name': 'مطابقة وصف الخواصّ باسم الشكل',
    'compute-perimeter': 'حساب محيط المربّع من طول ضلعه',
    'sequence-square-construction': 'ترتيب خطوات رسم المربّع',
    'sum-adjacent-angles': 'جمع قياسي زاويتين متجاورتين',
    'detect-missing-condition': 'كشف الشرط الناقص في استدلال',
    'add-collinear-lengths': 'جمع أطوال على استقامة واحدة',
    'diagnose-why-not-square': 'تشخيص سبب عدم كون الشكل مربّعاً',
    'combine-collinear-segments': 'ربط قطعتين على استقامة واحدة',
    'diagnose-fourth-vertex-error': 'تشخيص خطأ في تعيين الرأس الرابع',
    'evaluate-sufficient-conditions': 'تقويم كفاية مجموعة شروط',
    'divide-perimeter-by-four': 'استخراج طول الضلع من المحيط',
  },
  applicationLabels: {
    'lengths-around-squares': 'أطوال وأبعاد في أشكال من مربّعات ومستطيلات',
  },
  thinkingLabels: {
    'chain-two-squares': 'ربط معلومات من شكلين أو أكثر في استنتاج واحد',
    'evaluate-sufficiency': 'التمييز بين الشرط اللازم والشرط الكافي',
    'reverse-perimeter': 'التفكير العكسي من المحيط إلى الضلع',
    'reason-about-inclusion': 'التفكير في علاقات الاحتواء بين الأشكال',
  },
  commonErrorLabels: {
    'equal-sides-are-enough': 'الاكتفاء بتساوي الأضلاع للحكم بأن الشكل مربّع',
    'break-vertex-order': 'إهمال ترتيب الرؤوس عند تعيين الرأس الرابع',
    'reverse-inclusion-direction': 'عكس اتجاه الاحتواء بين المربّع والمستطيل',
    'insufficient-shape-evidence': 'الحكم على الشكل من معطيات غير كافية',
  },
})

export default definition
