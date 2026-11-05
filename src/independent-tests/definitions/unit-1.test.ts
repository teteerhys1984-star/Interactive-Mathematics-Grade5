import {
  choice,
  choiceText,
  defineIndependentTest,
  independentTable,
  math,
  rich,
  text,
} from '../authoring'

/**
 * الاختبار المستقل الأول — الوحدة الأولى كاملة.
 *
 * Scope: the eight assessed lessons of Unit 1, as registered in `src/content/registry.ts`.
 * Every question and every solution below was authored for this test only, from the lesson
 * content in the repository (not from the existing lesson/unit test question banks).
 *
 * Coverage (30 questions, two of them cross-lesson):
 *   شبكة الإحداثيات 3 · التمثيلات البيانية بالخطوط 3 · الأعداد الطبيعية 5 ·
 *   تقريب الأعداد الطبيعية 4 · جمع الأعداد الطبيعية وطرحها 5 · قياس الزوايا 4 ·
 *   متوازي الأضلاع 4 · المعيّن 3  (Q30 counts in both geometry lessons)
 *
 * Style spread: 7 اختيار من متعدد · 4 أكمل الفراغ · 5 مسائل متعددة الخطوات ·
 *   5 أوجد الناتج بالخطوات · 2 قراءة جدول · 2 اكتشف الخطأ · 2 مسألة لفظية ·
 *   1 مقارنة · 1 رسم · 1 تعليل.
 * Level spread: 10 أساسي · 12 متوسط · 8 متقدم.
 *
 * Authoring rules enforced by `defineIndependentTest`: 30 questions, questions numbered 1–30 in
 * order, every declared lesson covered, solutions structurally paired and never embedded in a
 * question. `scripts/independent-tests-check.ts` re-audits the answers and the UI check proves
 * that no solution text is mounted on the test page.
 */

const COORDINATES = 'coordinates'
const LINE_GRAPHS = 'line-graphs'
const NATURAL_NUMBERS = 'natural-numbers'
const ROUNDING = 'rounding-natural-numbers'
const ADD_SUBTRACT = 'adding-subtracting-natural-numbers'
const ANGLES = 'angle-measurement'
const PARALLELOGRAM = 'parallelogram'
const RHOMBUS = 'rhombus'

const temperatureTable = independentTable({
  caption: rich(text('درجات الحرارة في دمشق خلال أسبوع')),
  columns: [rich(text('اليوم')), rich(text('درجة الحرارة'))],
  rows: [
    [rich(text('الأحد')), rich(math('15'))],
    [rich(text('الإثنين')), rich(math('14'))],
    [rich(text('الثلاثاء')), rich(math('16'))],
    [rich(text('الأربعاء')), rich(math('18'))],
    [rich(text('الخميس')), rich(math('18'))],
    [rich(text('الجمعة')), rich(math('17'))],
    [rich(text('السبت')), rich(math('16'))],
  ],
})

const infantHeightTable = independentTable({
  caption: rich(text('الطول المثالي للطفل في عامه الأول')),
  columns: [rich(text('عمر الطفل بالأشهر')), rich(text('الطول المثالي (سم)'))],
  rows: [
    [rich(math('0')), rich(math('50'))],
    [rich(math('3')), rich(math('61'))],
    [rich(math('6')), rich(math('67'))],
    [rich(math('12')), rich(math('76'))],
  ],
})

const test = defineIndependentTest({
  id: 'independent-unit-1',
  number: 1,
  title: 'الاختبار المستقل الأول — الوحدة الأولى كاملة',
  description: rich(
    text('اختبار شامل من ثلاثين سؤالاً يغطّي دروس الوحدة الأولى الثمانية: شبكة الإحداثيات، والتمثيلات البيانية بالخطوط، والأعداد الطبيعية، وتقريبها، وجمعها وطرحها، وقياس الزوايا، ومتوازي الأضلاع، والمعيّن.'),
  ),
  lessonIds: [
    COORDINATES,
    LINE_GRAPHS,
    NATURAL_NUMBERS,
    ROUNDING,
    ADD_SUBTRACT,
    ANGLES,
    PARALLELOGRAM,
    RHOMBUS,
  ],
  questions: [
    /* ───────────────────────────── الدرس 1: شبكة الإحداثيات ───────────────────────────── */
    {
      number: 1,
      lessonIds: [COORDINATES],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(
        text('نقطة إحداثيها الأفقي '), math('6'), text(' وإحداثيها الشاقولي '), math('2'),
        text('. أيّ زوج مرتّب يمثّل موقعها؟'),
      ),
      options: [
        choice('q01-a', math('(6,2)')),
        choice('q01-b', math('(2,6)')),
        choice('q01-c', math('6 + 2')),
        choice('q01-d', math('(0,6)')),
      ],
      solution: {
        answer: rich(math('(6,2)')),
        idea: rich(text('الزوج المرتّب يُكتب بالإحداثي الأفقي أولاً ثم الإحداثي الشاقولي.')),
        steps: [
          rich(text('الإحداثي الأفقي هو '), math('6'), text('، فيكون العدد الأول في الزوج.')),
          rich(text('الإحداثي الشاقولي هو '), math('2'), text('، فيكون العدد الثاني.')),
          rich(text('إذن الزوج المرتّب هو '), math('(6,2)'), text('.')),
        ],
        why: rich(
          text('كتابة '), math('(2,6)'), text(' تعني '), math('2'), text(' وحدات أفقياً و'), math('6'),
          text(' وحدات شاقولياً، وهو موقع مختلف؛ لذلك ترتيب العددين جزء من معنى الزوج وليس شكلاً في الكتابة.'),
        ),
      },
    },
    {
      number: 2,
      lessonIds: [COORDINATES],
      style: 'fill-blank',
      level: 'basic',
      prompt: rich(text('النقطة '), math('(0,5)'), text(' تقع على المحور ______ .')),
      solution: {
        answer: rich(text('المحور الشاقولي '), math('Y')),
        idea: rich(text('إذا كان الإحداثي الأفقي صفراً فلا حركة إلى اليمين، وتبقى النقطة على المحور الشاقولي.')),
        steps: [
          rich(text('في الزوج '), math('(0,5)'), text(' الإحداثي الأفقي هو '), math('0'), text('.')),
          rich(text('لا نتحرك أفقياً، ثم نتحرك '), math('5'), text(' وحدات إلى الأعلى.')),
          rich(text('لذلك تقع النقطة على المحور الشاقولي، لا على المحور الأفقي.')),
        ],
        why: rich(
          text('كل نقطة على المحور الشاقولي لها الشكل '), math('(0, y)'), text('، وكل نقطة على المحور الأفقي لها الشكل '),
          math('(x, 0)'), text('. وجود الصفر في الخانة الأولى هو ما يحدّد المحور هنا.'),
        ),
      },
    },
    {
      number: 3,
      lessonIds: [COORDINATES],
      style: 'multi-step',
      level: 'medium',
      prompt: rich(
        text('بدأت نقطة من مبدأ الإحداثيات '), math('O(0,0)'),
        text('، ثم تحركت '), math('4'), text(' وحدات إلى اليمين، و'), math('2'), text(' وحدتين إلى الأعلى، ثم '),
        math('3'), text(' وحدات إلى اليمين، ثم وحدة واحدة إلى الأعلى. ما إحداثيات موقعها النهائي؟'),
      ),
      solution: {
        answer: rich(math('(7,3)')),
        idea: rich(text('كل حركة أفقية تغيّر الإحداثي الأفقي، وكل حركة شاقولية تغيّر الإحداثي الشاقولي.')),
        steps: [
          rich(text('بعد الحركة الأولى: '), math('(0 + 4, 0 + 2) = (4,2)'), text('.')),
          rich(text('بعد الحركة الثانية: '), math('(4 + 3, 2 + 1) = (7,3)'), text('.')),
          rich(text('إذن الموقع النهائي هو '), math('(7,3)'), text('.')),
        ],
        why: rich(
          text('نجمع الحركات في الاتجاه نفسه: '), math('4 + 3 = 7'), text(' أفقياً، و'), math('2 + 1 = 3'),
          text(' شاقولياً. ولا نبدّل الإحداثيين عند الجمع؛ كل حركة تُضاف إلى مركّبتها فقط.'),
        ),
      },
    },

    /* ────────────────────────── الدرس 2: التمثيلات البيانية بالخطوط ────────────────────────── */
    {
      number: 4,
      lessonIds: [LINE_GRAPHS],
      style: 'table-reading',
      level: 'medium',
      prompt: rich(text('يمثّل الجدول الآتي درجات الحرارة في مدينة دمشق خلال أسبوع. ما الفرق بين أعلى درجة وأدنى درجة؟')),
      table: temperatureTable,
      solution: {
        answer: rich(text('الفرق '), math('4'), text(' درجات')),
        idea: rich(text('نقرأ من الجدول القيمة العظمى والقيمة الصغرى، ثم نطرح الأصغر من الأكبر.')),
        steps: [
          rich(text('أعلى درجة هي '), math('18'), text('، وتظهر يومي الأربعاء والخميس.')),
          rich(text('أدنى درجة هي '), math('14'), text('، وتظهر يوم الإثنين.')),
          rich(math('18 - 14 = 4'), text(' درجات.')),
        ],
        why: rich(
          text('الفرق يقيس مدى التغيّر خلال الأسبوع. نطرح القيمة الصغرى من العظمى لا العكس، لأن الفرق يجب أن يكون موجباً، ولأن الطرح العكسي يعطي '),
          math('-4'), text(' وهو لا يعبّر عن مقدار التغيّر.'),
        ),
      },
    },
    {
      number: 5,
      lessonIds: [LINE_GRAPHS],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('في تمثيل بياني بالخطوط، كان الخط بين يومي الثلاثاء والأربعاء صاعداً. ماذا يعني ذلك عن القيم؟')),
      options: [
        choiceText('q05-a', 'تزداد القيم'),
        choiceText('q05-b', 'تنقص القيم'),
        choiceText('q05-c', 'تبقى القيم ثابتة'),
        choiceText('q05-d', 'لا يمكن معرفة شيء من اتجاه الخط'),
      ],
      solution: {
        answer: rich(text('تزداد القيم.')),
        idea: rich(text('اتجاه الخط بين نقطتين يبيّن هل زادت القيمة أم نقصت.')),
        steps: [
          rich(text('الخط الصاعد يعني أن النقطة اللاحقة أعلى من النقطة السابقة.')),
          rich(text('ارتفاع النقطة يعني زيادة القيمة على المحور الشاقولي.')),
          rich(text('إذن القيم تزداد بين الثلاثاء والأربعاء.')),
        ],
        why: rich(text('لو كان الخط هابطاً لكانت القيم تتناقص، ولو كان أفقياً لكانت ثابتة؛ أما الصعود فيدل على التزايد.')),
      },
    },
    {
      number: 6,
      lessonIds: [LINE_GRAPHS],
      style: 'table-reading',
      level: 'medium',
      prompt: rich(text('يوضّح الجدول الطول المثالي للطفل بالسنتيمتر في عامه الأول. ما مقدار الزيادة في الطول بين الشهر الثالث والشهر الثاني عشر؟')),
      table: infantHeightTable,
      solution: {
        answer: rich(math('15'), text(' سم')),
        idea: rich(text('نقرأ القيمتين المطلوبتين من الجدول، ثم نحسب الفرق بينهما.')),
        steps: [
          rich(text('الطول عند الشهر الثالث هو '), math('61'), text(' سم.')),
          rich(text('الطول عند الشهر الثاني عشر هو '), math('76'), text(' سم.')),
          rich(math('76 - 61 = 15'), text(' سم.')),
        ],
        why: rich(text('الزيادة هي الفرق بين القيمة اللاحقة والقيمة السابقة، وليست مجموعهما؛ فالمجموع '), math('76 + 61'), text(' لا معنى له في سياق مقدار النمو.')),
      },
    },

    /* ──────────────────────────── الدرس 3: الأعداد الطبيعية ──────────────────────────── */
    {
      number: 7,
      lessonIds: [NATURAL_NUMBERS],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('ما قيمة الرقم '), math('7'), text(' في العدد '), math('5,728,041'), text('؟')),
      options: [
        choice('q07-a', math('7')),
        choice('q07-b', math('7,000')),
        choice('q07-c', math('700,000')),
        choice('q07-d', math('7,000,000')),
      ],
      solution: {
        answer: rich(math('700,000')),
        idea: rich(text('قيمة الرقم تعتمد على منزلته في العدد، لا على الرقم نفسه فقط.')),
        steps: [
          rich(text('نحلّل العدد إلى حلقات: '), math('5 | 728 | 041'), text('.')),
          rich(text('الرقم '), math('7'), text(' يقع في منزلة مئات الألوف داخل حلقة الألوف.')),
          rich(text('قيمته: '), math('7 × 100,000 = 700,000'), text('.')),
        ],
        why: rich(
          text('لو كان الرقم '), math('7'), text(' في منزلة عشرات الألوف لكانت قيمته '), math('70,000'),
          text('، ولو كان في منزلة الملايين لكانت قيمته '), math('7,000,000'), text('؛ الموقع هو الذي يحدّد القيمة.'),
        ),
      },
    },
    {
      number: 8,
      lessonIds: [NATURAL_NUMBERS],
      style: 'fill-blank',
      level: 'medium',
      prompt: rich(text('اكتب العدد '), math('4,020,305'), text(' بالصيغة اللفظية: ____________________')),
      solution: {
        answer: rich(text('أربعة ملايين وعشرون ألفاً وثلاثمئة وخمسة')),
        idea: rich(text('نجزّئ العدد إلى حلقات من اليمين: الوحدات ثم الألوف ثم الملايين.')),
        steps: [
          rich(math('4,020,305 = 4 | 020 | 305'), text('.')),
          rich(text('حلقة الملايين '), math('4'), text(' تُقرأ «أربعة ملايين»، وحلقة الألوف '), math('020'), text(' تُقرأ «عشرون ألفاً»، وحلقة الوحدات '), math('305'), text(' تُقرأ «ثلاثمئة وخمسة».')),
          rich(text('نصل الحلقات: أربعة ملايين وعشرون ألفاً وثلاثمئة وخمسة.')),
        ],
        why: rich(
          text('القراءة اللفظية تعتمد على الحلقات الثلاث: حلقة الألوف '), math('020'),
          text(' تُقرأ «عشرين ألفاً» لأن الصفر يشغل منزلة المئات داخلها، ثم تُضاف حلقة الوحدات '),
          math('305'), text(' كاملة. إغفال حلقة أو خلط منازلها يغيّر العدد.'),
        ),
      },
    },
    {
      number: 9,
      lessonIds: [NATURAL_NUMBERS],
      style: 'show-work',
      level: 'medium',
      prompt: rich(text('اكتب العدد '), math('3,405,060'), text(' بالصيغة التفصيلية، ثم بيّن المنازل التي وقع فيها الصفر ولماذا لا تظهر حدودها.')),
      solution: {
        answer: rich(
          math('3,000,000 + 400,000 + 5,000 + 60'),
          text('، والصفر في منازل عشرات الألوف والمئات والآحاد قيمته صفر.'),
        ),
        idea: rich(text('نحلّل العدد إلى منازله، ثم نكتب حدود المنازل غير الصفرية فقط.')),
        steps: [
          rich(
            text('منازل العدد: '), math('3'), text(' ملايين، '), math('4'), text(' مئات ألوف، '), math('0'),
            text(' عشرات ألوف، '), math('5'), text(' آحاد ألوف، '), math('0'), text(' مئات، '), math('6'),
            text(' عشرات، '), math('0'), text(' آحاد.'),
          ),
          rich(text('نكتب حدود المنازل غير الصفرية: '), math('3,000,000 + 400,000 + 5,000 + 60'), text('.')),
          rich(text('الصفر في عشرات الألوف وفي المئات وفي الآحاد لا يضيف قيمة، لذلك لا يُكتب حدّاً في الصيغة التفصيلية.')),
        ],
        why: rich(
          text('لكن الصفر يبقى في الصيغة القياسية '), math('3,405,060'),
          text(' لأنه يحفظ منزلة الأرقام التي بعده؛ فلو حذفناه لانتقلت الأرقام إلى منازل أدنى، ولتغيّرت قيمة العدد كلياً.'),
        ),
      },
    },
    {
      number: 10,
      lessonIds: [NATURAL_NUMBERS],
      style: 'error-analysis',
      level: 'advanced',
      prompt: rich(
        text('كتب مراد العدد '), math('5,305,707'),
        text(' بالصيغة اللفظية: «خمسة ملايين وثلاثمئة وخمسة آلاف وسبعمئة». اكتشف الخطأ وصحّحه.'),
      ),
      solution: {
        answer: rich(text('أهمل الرقم '), math('7'), text(' في خانة الآحاد. الصواب: خمسة ملايين وثلاثمئة وخمسة آلاف وسبعمئة وسبعة.')),
        idea: rich(text('نقارن كل حلقة في العدد بما كتبه مراد، ونتحقق من آخر خانة.')),
        steps: [
          rich(text('نجزّئ العدد: '), math('5 | 305 | 707'), text('.')),
          rich(text('حلقة الوحدات '), math('707'), text(' تُقرأ «سبعمئة وسبعة»، وقد كتبها مراد «سبعمئة» فقط.')),
          rich(text('الصواب: خمسة ملايين وثلاثمئة وخمسة آلاف وسبعمئة وسبعة.')),
        ],
        why: rich(
          text('حذف كلمة «وسبعة» يغيّر العدد إلى '), math('5,305,700'), text('، أي ينقص '), math('7'),
          text(' وحدات كاملة. القراءة اللفظية يجب أن تمثّل كل خانة غير صفرية.'),
        ),
      },
    },
    {
      number: 11,
      lessonIds: [NATURAL_NUMBERS],
      style: 'multi-step',
      level: 'advanced',
      prompt: rich(
        text('استعمل الأرقام '), math('3، 0، 8، 5، 0، 1، 7'), text(' مرة واحدة لكل رقم لتكوين أصغر عدد من سبع خانات. اكتب العدد بالصيغة القياسية ثم بالصيغة اللفظية.'),
      ),
      solution: {
        answer: rich(
          math('1,003,578'), text(' = مليون وثلاثة آلاف وخمسمئة وثمانية وسبعون.'),
        ),
        idea: rich(text('لتصغير العدد نضع أصغر رقم غير صفري في أكبر منزلة، ثم نرتّب بقية الأرقام تصاعدياً.')),
        steps: [
          rich(text('لا يمكن أن يبدأ العدد بالصفر وإلا أصبح من ست خانات؛ أصغر رقم غير صفري هو '), math('1'), text('.')),
          rich(text('نرتّب بقية الأرقام تصاعدياً بعد الأولى: '), math('0، 0، 3، 5، 7، 8'), text('.')),
          rich(text('العدد: '), math('1,003,578'), text('.')),
          rich(text('قراءته: مليون وثلاثة آلاف وخمسمئة وثمانية وسبعون.')),
        ],
        why: rich(
          text('وضع أصغر رقم غير صفري أولاً يحفظ عدد الخانات، ثم يكون كل رقم أصغر في منزلة أكبر، فينتج أصغر عدد ممكن. لو بدأنا بـ'),
          math('3'), text(' لكان العدد أكبر من أي عدد يبدأ بـ'), math('1'), text('.'),
        ),
      },
    },

    /* ─────────────────────────── الدرس 4: تقريب الأعداد الطبيعية ─────────────────────────── */
    {
      number: 12,
      lessonIds: [ROUNDING],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('قرّب العدد '), math('4,682,137'), text(' إلى أقرب مليون.')),
      options: [
        choice('q12-a', math('4,000,000')),
        choice('q12-b', math('5,000,000')),
        choice('q12-c', math('4,700,000')),
        choice('q12-d', math('4,600,000')),
      ],
      solution: {
        answer: rich(math('5,000,000')),
        idea: rich(text('نفحص الرقم الذي على يمين منزلة الملايين مباشرة، وهو رقم مئات الألوف.')),
        steps: [
          rich(text('منزلة الملايين فيها '), math('4'), text('، والرقم التالي في مئات الألوف هو '), math('6'), text('.')),
          rich(text('بما أن '), math('6 ≥ 5'), text(' نزيد منزلة الملايين واحداً: '), math('4 + 1 = 5'), text('.')),
          rich(text('نجعل الخانات إلى اليمين أصفاراً: '), math('5,000,000'), text('.')),
        ],
        why: rich(
          text('لا يكفي حذف الأرقام بعد منزلة الملايين؛ يجب أولاً فحص الرقم التالي لتقرير الزيادة أو البقاء. هنا '),
          math('6'), text(' أكبر من '), math('5'), text('، لذلك ارتفع التقريب إلى '), math('5,000,000'), text('.'),
        ),
      },
    },
    {
      number: 13,
      lessonIds: [ROUNDING],
      style: 'fill-blank',
      level: 'basic',
      prompt: rich(text('قرّب العدد '), math('6,432'), text(' إلى أقرب ألف: ______')),
      solution: {
        answer: rich(math('6,000')),
        idea: rich(text('نفحص رقم المئات لأنه على يمين منزلة الألوف.')),
        steps: [
          rich(text('منزلة الألوف فيها '), math('6'), text('، ورقم المئات هو '), math('4'), text('.')),
          rich(text('بما أن '), math('4 < 5'), text(' نُبقي منزلة الألوف كما هي.')),
          rich(text('نجعل الخانات إلى اليمين أصفاراً: '), math('6,000'), text('.')),
        ],
        why: rich(
          text('رقم المئات '), math('4'), text(' أقل من '), math('5'), text('، لذلك لا نرفع منزلة الألوف. لو كان '),
          math('5'), text(' أو أكبر لكان التقريب '), math('7,000'), text('.'),
        ),
      },
    },
    {
      number: 14,
      lessonIds: [ROUNDING],
      style: 'word-problem',
      level: 'medium',
      prompt: rich(text('أنتج أحد الأفران '), math('112,880'), text(' رغيفاً في شهر. قرّب هذا العدد إلى أقرب عشرة آلاف، وبيّن الرقم الذي فحصته.')),
      solution: {
        answer: rich(math('110,000'), text(' رغيف؛ فحصنا رقم الألوف وهو '), math('2'), text('.')),
        idea: rich(text('نحدّد منزلة عشرة الآلاف، ثم نفحص الرقم الذي على يمينها مباشرة.')),
        steps: [
          rich(text('في العدد '), math('112,880'), text(' رقم عشرة الآلاف هو '), math('1'), text('، ورقم الألوف هو '), math('2'), text('.')),
          rich(text('بما أن '), math('2 < 5'), text(' نُبقي رقم عشرة الآلاف.')),
          rich(text('نجعل الخانات إلى اليمين أصفاراً: '), math('110,000'), text('.')),
        ],
        why: rich(
          text('التقريب إلى عشرة الآلاف لا يعني حذف كل الأرقام، بل تثبيت منزلة عشرة الآلاف وجعل ما بعدها أصفاراً. الناتج '),
          math('110,000'), text(' لا '), math('100,000'), text('، لأن رقم عشرة الآلاف بقي '), math('1'), text('.'),
        ),
      },
    },
    {
      number: 15,
      lessonIds: [ROUNDING],
      style: 'compare',
      level: 'advanced',
      prompt: rich(
        text('ضع الرمز المناسب '), math('<'), text(' أو '), math('>'), text(' أو '), math('='),
        text(' بين المقدارين: العدد '), math('4,768,210'), text(' مقرّباً إلى أقرب عشرة آلاف، والعدد نفسه مقرّباً إلى أقرب ألف.'),
      ),
      solution: {
        answer: rich(
          math('4,770,000 > 4,768,000'), text('، فالرمز هو '), math('>'), text('.'),
        ),
        idea: rich(text('نقرّب العدد مرتين إلى منزلتين مختلفتين، ثم نقارن الناتجين.')),
        steps: [
          rich(text('إلى أقرب عشرة آلاف: رقم عشرة الآلاف '), math('6'), text('، ورقم الألوف '), math('8'), text('، لذلك نزيد: '), math('4,770,000'), text('.')),
          rich(text('إلى أقرب ألف: رقم الألوف '), math('8'), text('، ورقم المئات '), math('2'), text('، لذلك نُبقي: '), math('4,768,000'), text('.')),
          rich(text('بما أن '), math('4,770,000'), text(' أكبر من '), math('4,768,000'), text('، فالرمز '), math('>'), text('.')),
        ],
        why: rich(
          text('التقريب إلى عشرة الآلاف يغيّر رقماً في منزلة أكبر، لذلك قد ينتج عدد أكبر من التقريب إلى ألف. المقارنة تبدأ من المنزلة الكبرى، وهنا الملايين ومئات الألوف متساوية، ثم يختلف رقم عشرة الآلاف.'),
        ),
      },
    },

    /* ───────────────────── الدرس 5: جمع الأعداد الطبيعية وطرحها ───────────────────── */
    {
      number: 16,
      lessonIds: [ADD_SUBTRACT],
      style: 'show-work',
      level: 'medium',
      prompt: rich(text('أوجد ناتج '), math('203,565 + 789,321'), text(' مع كتابة خطوات الحل بالأعمدة.')),
      solution: {
        answer: rich(math('992,886')),
        idea: rich(text('نرتّب الخانات المتقابلة، ونجمع من الآحاد إلى اليسار، ونحمل عندما يتجاوز ناتج الخانة '), math('9'), text('.')),
        steps: [
          rich(text('الآحاد: '), math('5 + 1 = 6'), text('.')),
          rich(text('العشرات: '), math('6 + 2 = 8'), text('، والمئات: '), math('5 + 3 = 8'), text('.')),
          rich(text('الألوف: '), math('3 + 9 = 12'), text('، نكتب '), math('2'), text(' ونحمل '), math('1'), text(' إلى عشرات الألوف.')),
          rich(text('عشرات الألوف: '), math('0 + 8 + 1 = 9'), text('، ومئات الألوف: '), math('2 + 7 = 9'), text('.')),
          rich(text('إذن الناتج '), math('992,886'), text('.')),
        ],
        why: rich(text('البدء من الآحاد يضمن إضافة كل حمل إلى الخانة التالية. لو جمعنا من اليسار لأضفنا الحمل إلى خانة انتهينا منها بالفعل، فيفسد الناتج.')),
      },
    },
    {
      number: 17,
      lessonIds: [ADD_SUBTRACT],
      style: 'show-work',
      level: 'medium',
      prompt: rich(text('أوجد ناتج '), math('3,221,991 - 2,154,231'), text(' مع كتابة خطوات الحل بالأعمدة.')),
      solution: {
        answer: rich(math('1,067,760')),
        idea: rich(text('نطرح خانةً خانة من الآحاد، ونستلف من الخانة المجاورة على اليسار عندما يكون الرقم الأعلى أصغر.')),
        steps: [
          rich(text('الآحاد: '), math('1 - 1 = 0'), text('، والعشرات: '), math('9 - 3 = 6'), text('، والمئات: '), math('9 - 2 = 7'), text('.')),
          rich(text('الألوف: '), math('1 < 4'), text('، نستلف '), math('10'), text(' من عشرات الألوف: '), math('11 - 4 = 7'), text('.')),
          rich(text('عشرات الألوف بعد الاستلاف '), math('1'), text('، و'), math('1 < 5'), text('، نستلف من مئات الألوف: '), math('11 - 5 = 6'), text('.')),
          rich(text('مئات الألوف بعد الاستلاف '), math('1'), text('، و'), math('1 - 1 = 0'), text('، والملايين: '), math('3 - 2 = 1'), text('.')),
          rich(text('الناتج: '), math('1,067,760'), text('.')),
        ],
        why: rich(
          text('كل استلاف ينقص الخانة المجاورة بمقدار '), math('1'), text('. التحقق بالجمع: '),
          math('1,067,760 + 2,154,231 = 3,221,991'), text('، وهو المطروح منه.'),
        ),
      },
    },
    {
      number: 18,
      lessonIds: [ADD_SUBTRACT],
      style: 'word-problem',
      level: 'medium',
      prompt: rich(
        text('طبعت مؤسسة سياحية '), math('230,569'), text(' منشوراً دعائياً لقلعة دمشق، و'), math('654,289'),
        text(' منشوراً لآثار تدمر. ما عدد المنشورات التي طبعتها المؤسسة؟'),
      ),
      solution: {
        answer: rich(math('884,858'), text(' منشوراً')),
        idea: rich(text('المطلوب عدد المنشورات معاً، لذلك نستعمل الجمع.')),
        steps: [
          rich(text('المعطيات: '), math('230,569'), text(' منشوراً، و'), math('654,289'), text(' منشوراً.')),
          rich(text('نجمع: '), math('230,569 + 654,289 = 884,858'), text('.')),
          rich(text('إذن العدد الكلي '), math('884,858'), text(' منشوراً.')),
        ],
        why: rich(
          text('كلمة «معاً» تدل على الجمع لا الطرح. نتحقق بالطرح: '), math('884,858 - 654,289 = 230,569'),
          text('، فيعود أحد المعطيين كما هو.'),
        ),
      },
    },
    {
      number: 19,
      lessonIds: [ADD_SUBTRACT],
      style: 'error-analysis',
      level: 'advanced',
      prompt: rich(
        text('حلّ أحد الطلاب العملية '), math('4,580 + 3,650'), text(' فكتب الناتج '), math('8,130'),
        text('. اكتشف الخطأ وصحّحه.'),
      ),
      solution: {
        answer: rich(text('نسي حمل '), math('1'), text(' من خانة العشرات إلى المئات؛ الناتج الصحيح '), math('8,230'), text('.')),
        idea: rich(text('نعيد الجمع خانةً خانة من الآحاد ونتتبّع الحمل.')),
        steps: [
          rich(text('الآحاد: '), math('0 + 0 = 0'), text('.')),
          rich(text('العشرات: '), math('8 + 5 = 13'), text('، نكتب '), math('3'), text(' ونحمل '), math('1'), text(' إلى المئات.')),
          rich(text('المئات: '), math('5 + 6 + 1 = 12'), text('، نكتب '), math('2'), text(' ونحمل '), math('1'), text(' إلى الألوف.')),
          rich(text('الألوف: '), math('4 + 3 + 1 = 8'), text('، فالناتج '), math('8,230'), text('.')),
        ],
        why: rich(
          text('إهمال الحمل في العشرات جعل ناتج المئات '), math('11'), text(' بدل '), math('12'), text('، فنقص الناتج بمقدار '),
          math('100'), text(': ظهر '), math('8,130'), text(' بدل '), math('8,230'), text('.'),
        ),
      },
    },
    {
      number: 20,
      lessonIds: [ADD_SUBTRACT],
      style: 'multi-step',
      level: 'advanced',
      prompt: rich(
        text('حقّقت مكتبة مبيعات يوم السبت '), math('1,250,000'), text(' ليرة سورية، ويوم الأحد '), math('980,500'),
        text(' ليرة سورية، ودفعت مصاريف بمقدار '), math('450,000'), text(' ليرة سورية. ما صافي المبيعات؟'),
      ),
      solution: {
        answer: rich(math('1,780,500'), text(' ليرة سورية')),
        idea: rich(text('نجمع المبيعات أولاً للحصول على الإجمالي، ثم نطرح المصاريف لحساب الصافي.')),
        steps: [
          rich(text('إجمالي المبيعات: '), math('1,250,000 + 980,500 = 2,230,500'), text('.')),
          rich(text('نطرح المصاريف: '), math('2,230,500 - 450,000 = 1,780,500'), text('.')),
          rich(text('إذن صافي المبيعات '), math('1,780,500'), text(' ليرة سورية.')),
        ],
        why: rich(text('لا يصح طرح المصاريف من يوم واحد فقط؛ المصاريف تخص العمل كله، لذلك نجمع الدخل أولاً ثم نخصم. ولو طرحنا '), math('450,000'), text(' من '), math('980,500'), text(' فقط لتجاهلنا مبيعات السبت.')),
      },
    },

    /* ───────────────────────────── الدرس 6: قياس الزوايا ───────────────────────────── */
    {
      number: 21,
      lessonIds: [ANGLES],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('ما نوع الزاوية التي قياسها '), math('120°'), text('؟')),
      options: [
        choiceText('q21-a', 'حادة'),
        choiceText('q21-b', 'قائمة'),
        choiceText('q21-c', 'منفرجة'),
        choiceText('q21-d', 'مستقيمة'),
      ],
      solution: {
        answer: rich(text('زاوية منفرجة.')),
        idea: rich(text('نقارن القياس بالزاوية القائمة '), math('90°'), text(' والزاوية المستقيمة '), math('180°'), text('.')),
        steps: [
          rich(math('120° > 90°'), text('، إذن ليست حادة ولا قائمة.')),
          rich(math('120° < 180°'), text('، إذن ليست مستقيمة.')),
          rich(text('هي بين '), math('90°'), text(' و'), math('180°'), text('، فهي منفرجة.')),
        ],
        why: rich(text('الزاوية المنفرجة هي التي قياسها أكبر من '), math('90°'), text(' وأصغر من '), math('180°'), text('. تصنيف الزاوية يعتمد على المقارنة بالزاويتين القائمة والمستقيمة.')),
      },
    },
    {
      number: 22,
      lessonIds: [ANGLES],
      style: 'fill-blank',
      level: 'basic',
      prompt: rich(text('أكمل: قياس الزاوية القائمة ______، وقياس الزاوية المستقيمة ______.')),
      solution: {
        answer: rich(math('90°'), text(' و'), math('180°')),
        idea: rich(text('لكل نوع من الزوايا قياس مميز نتعرف به عليه.')),
        steps: [
          rich(text('الزاوية القائمة يتعامد ضلعاها، وقياسها '), math('90°'), text('.')),
          rich(text('الزاوية المستقيمة يتجه ضلعاها في اتجاهين متعاكسين على استقامة واحدة، وقياسها '), math('180°'), text('.')),
          rich(text('أما الحادة فأصغر من '), math('90°'), text('، والمنفرجة بين '), math('90°'), text(' و'), math('180°'), text('.')),
        ],
        why: rich(text('القياسان '), math('90°'), text(' و'), math('180°'), text(' حدّان يفصلان أنواع الزوايا؛ لذلك يجب حفظهما كمرجع للمقارنة، لا كرقمين منفصلين عن الشكل.')),
      },
    },
    {
      number: 23,
      lessonIds: [ANGLES],
      style: 'draw',
      level: 'medium',
      prompt: rich(
        text('ارسم الزاوية '), math('∠CBA'), text(' التي قياسها '), math('50°'),
        text(' باستعمال المسطرة والمنقلة، ثم اذكر نوعها وسمِّ رأسها.'),
      ),
      solution: {
        answer: rich(text('زاوية حادة رأسها '), math('B'), text(' وقياسها '), math('50°'), text('.')),
        idea: rich(text('نرسم ضلعاً، ثم نضع مركز المنقلة على الرأس ونطابق خط الصفر مع الضلع، ثم نعين القياس.')),
        steps: [
          rich(text('نرسم نصف المستقيم '), math('[BC)'), text(' ونعين الرأس '), math('B'), text('.')),
          rich(text('نضع مركز المنقلة على '), math('B'), text(' ونطابق خط الصفر مع '), math('[BC)'), text('.')),
          rich(text('نعين النقطة '), math('A'), text(' عند التدريج '), math('50°'), text(' الذي يبدأ من الصفر نفسه.')),
          rich(text('نصل '), math('B'), text(' بـ'), math('A'), text('، فتصبح '), math('∠CBA = 50°'), text('.')),
          rich(text('النوع: زاوية حادة، لأن '), math('50° < 90°'), text('.')),
        ],
        why: rich(
          text('الرأس هو الحرف الأوسط في اسم الزاوية، لذلك '), math('∠CBA'), text(' رأسها '), math('B'),
          text(' وليس '), math('C'), text(' أو '), math('A'), text('. ومطابقة خط الصفر مع الضلع تمنع قراءة التدريج الخطأ على المنقلة.'),
        ),
      },
    },
    {
      number: 24,
      lessonIds: [ANGLES],
      style: 'multi-step',
      level: 'advanced',
      prompt: rich(
        text('إذا كان '), math('∠BMW = 60°'), text(' و'), math('∠WMC = 30°'), text('، وكان الشعاع '), math('[MW)'),
        text(' يقع بين '), math('[MB)'), text(' و'), math('[MC)'), text('، فما قياس '), math('∠BMC'), text('؟ وما نوعها؟'),
      ),
      solution: {
        answer: rich(math('∠BMC = 90°'), text('، وهي زاوية قائمة.')),
        idea: rich(text('عندما يقع شعاع بين ضلعي زاوية، يكون قياس الزاوية الكبرى مجموع قياسي الزاويتين المتجاورتين.')),
        steps: [
          rich(text('الزاويتان '), math('∠BMW'), text(' و'), math('∠WMC'), text(' متجاورتان تشتركان في الشعاع '), math('[MW)'), text('.')),
          rich(math('∠BMC = 60° + 30° = 90°'), text('.')),
          rich(text('وبما أن القياس '), math('90°'), text('، فالزاوية قائمة.')),
        ],
        why: rich(text('الجمع صحيح لأن الشعاع المشترك يقع بين الضلعين، فلا فراغ بين الزاويتين ولا تداخل. ولو كان الشعاع خارج الزاوية لما صح جمع القياسين.')),
      },
    },

    /* ─────────────────────────── الدرس 7: متوازي الأضلاع ─────────────────────────── */
    {
      number: 25,
      lessonIds: [PARALLELOGRAM],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('أي العبارات الآتية صحيحة عن متوازي الأضلاع؟')),
      options: [
        choiceText('q25-a', 'كل ضلعين متقابلين فيه متوازيان ومتساويان.'),
        choiceText('q25-b', 'كل ضلعين متجاورين فيه متساويان دائماً.'),
        choiceText('q25-c', 'له ثلاثة أقطار.'),
        choiceText('q25-d', 'قطراه هما ضلعان من أضلاعه.'),
      ],
      solution: {
        answer: rich(text('كل ضلعين متقابلين فيه متوازيان ومتساويان.')),
        idea: rich(text('نرجع إلى تعريف متوازي الأضلاع وخصائصه.')),
        steps: [
          rich(text('التعريف يشترط أن يكون كل ضلعين متقابلين متوازيين.')),
          rich(text('من خصائصه أن كل ضلعين متقابلين متساويان أيضاً.')),
          rich(text('أما الضلعان المتجاوران فقد يختلفان، والقطران قطعتان تصلان رأسين غير متتاليين، وعددهما قطعتان فقط.')),
        ],
        why: rich(text('العبارة الأولى تجمع شرط التعريف وخاصية الأضلاع معاً. العبارة الثانية خاطئة لأن المتجاورين ليسا متساويين بالضرورة، والثالثة تخالف عدد الأقطار، والرابعة تخلط بين الضلع والقطر.')),
      },
    },
    {
      number: 26,
      lessonIds: [PARALLELOGRAM],
      style: 'show-work',
      level: 'medium',
      prompt: rich(text('متوازي أضلاع طولا ضلعين متجاورين فيه '), math('7cm'), text(' و'), math('4cm'), text('. احسب محيطه.')),
      solution: {
        answer: rich(math('22cm')),
        idea: rich(text('الأضلاع المتقابلة متساوية، لذلك يكفي جمع طولي ضلعين متجاورين وضربهما في '), math('2'), text('.')),
        steps: [
          rich(math('7 + 4 = 11'), text(' سم، وهو نصف المحيط.')),
          rich(math('2 × 11 = 22'), text(' سم.')),
          rich(text('أو بالجمع المباشر للأضلاع الأربعة: '), math('7 + 4 + 7 + 4 = 22'), text(' سم.')),
        ],
        why: rich(
          text('لا نجمع '), math('7 + 4'), text(' فقط لأنهما ضلعان فقط، والمحيط يشمل الأضلاع الأربعة. وبخاصية تساوي المتقابلين يصبح المحيط '),
          math('2 × (7 + 4)'), text('.'),
        ),
      },
    },
    {
      number: 27,
      lessonIds: [PARALLELOGRAM],
      style: 'explain',
      level: 'advanced',
      prompt: rich(text('شكل رباعي فيه زوج واحد فقط من الأضلاع المتوازية. هل يمكن أن يكون متوازي أضلاع؟ علّل إجابتك.')),
      solution: {
        answer: rich(text('لا؛ لأن متوازي الأضلاع يشترط أن يكون كل ضلعين متقابلين متوازيين، لا زوجاً واحداً فقط.')),
        idea: rich(text('التعريف شرط لازم وكافٍ، فإذا اختل أحد شقّيه لا يكون الشكل متوازي أضلاع.')),
        steps: [
          rich(text('تعريف متوازي الأضلاع: شكل رباعي فيه كل ضلعين متقابلين متوازيان.')),
          rich(text('وجود زوج واحد فقط من الأضلاع المتوازية يعني أن الزوج المقابل غير متوازٍ.')),
          rich(text('إذن الشرط غير محقق، والشكل شبه منحرف وليس متوازي أضلاع.')),
        ],
        why: rich(text('كلمة «كل» في التعريف أساسية. بدونها يدخل شبه المنحرف خطأً في تعريف متوازي الأضلاع، ولذلك نفحص مجموعتي الأضلاع المتقابلة لا مجموعة واحدة.')),
      },
    },

    /* ─────────────────────────────── الدرس 8: المعيّن ─────────────────────────────── */
    {
      number: 28,
      lessonIds: [RHOMBUS],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('ما الشرط الإضافي الذي يحوّل متوازي الأضلاع إلى معيّن؟')),
      options: [
        choiceText('q28-a', 'تساوي طولي ضلعين متجاورين.'),
        choiceText('q28-b', 'تساوي طولي ضلعين متقابلين.'),
        choiceText('q28-c', 'وجود زاوية قائمة.'),
        choiceText('q28-d', 'تساوي القطرين.'),
      ],
      solution: {
        answer: rich(text('تساوي طولي ضلعين متجاورين.')),
        idea: rich(text('المعيّن متوازي أضلاع أضلاعه الأربعة متساوية، ويكفي لتحقيق ذلك تساوي ضلعين متجاورين.')),
        steps: [
          rich(text('في متوازي الأضلاع الضلعان المتقابلان متساويان أصلاً، فتساويهما لا يضيف شرطاً جديداً.')),
          rich(text('إذا تساوى ضلعان متجاوران صار كل ضلع مساوياً للآخر، لأن كل ضلع يساوي مقابله.')),
          rich(text('إذن تصبح الأضلاع الأربعة متساوية، والشكل معيّن.')),
        ],
        why: rich(text('تساوي ضلعين متقابلين متحقق في كل متوازي أضلاع، أما تساوي ضلعين متجاورين فهو الشرط المميز للمعيّن. الزاوية القائمة أو تساوي القطرين لا تعطي أضلاعاً متساوية بالضرورة.')),
      },
    },
    {
      number: 29,
      lessonIds: [RHOMBUS],
      style: 'show-work',
      level: 'medium',
      prompt: rich(
        text('معيّن '), math('ABCD'), text(' فيه '), math('AB = 6cm'), text(' و'), math('∠A = 65°'),
        text('. احسب محيطه، وقياس كل من '), math('∠B'), text(' و'), math('∠C'), text('.'),
      ),
      solution: {
        answer: rich(text('المحيط '), math('24cm'), text('، و'), math('∠B = 115°'), text('، و'), math('∠C = 65°'), text('.')),
        idea: rich(text('في المعيّن كل الأضلاع متساوية، والزوايا المتقابلة متساوية، والزوايا المتتالية مجموعها '), math('180°'), text('.')),
        steps: [
          rich(math('AB = BC = CD = DA = 6cm'), text('، فالمحيط '), math('4 × 6 = 24cm'), text('.')),
          rich(text('الزاويتان '), math('A'), text(' و'), math('B'), text(' متتاليتان، إذن '), math('∠A + ∠B = 180°'), text('، ومنه '), math('∠B = 180° - 65° = 115°'), text('.')),
          rich(text('الزاويتان '), math('A'), text(' و'), math('C'), text(' متقابلتان، إذن '), math('∠C = ∠A = 65°'), text('.')),
        ],
        why: rich(
          text('استعملنا خاصيتين مختلفتين: تساوي الأضلاع للمحيط، وتساوي الزوايا المتقابلة مع تكامل الزوايا المتتالية للزوايا. ولا يصح افتراض أن كل الزوايا '),
          math('65°'), text('، لأن الزاويتين المتتاليتين لا تكونان متساويتين إلا إذا كانتا قائمتين.'),
        ),
      },
    },
    {
      number: 30,
      lessonIds: [RHOMBUS, PARALLELOGRAM],
      style: 'multi-step',
      level: 'advanced',
      prompt: rich(
        text('يتكوّن شكل مركّب من معيّن '), math('AFED'), text(' على اليسار ومتوازي أضلاع '), math('FBCE'),
        text(' على اليمين، ويشتركان في الضلع '), math('[FE]'), text('. النقاط '), math('A'), text(' و'), math('F'),
        text(' و'), math('B'), text(' على استقامة واحدة، والمعطى: '), math('AD = 3cm'), text(' و'), math('FB = 5cm'),
        text('. احسب أطوال '), math('[AF]'), text(' و'), math('[BC]'), text(' و'), math('[AB]'), text('.'),
      ),
      solution: {
        answer: rich(math('AF = 3cm'), text('، و'), math('BC = 3cm'), text('، و'), math('AB = 8cm'), text('.')),
        idea: rich(text('ننقل الأطوال بين الشكلين عبر الضلع المشترك، ثم نجمع القطعتين المتتاليتين.')),
        steps: [
          rich(text('في المعيّن '), math('AFED'), text(' الأضلاع الأربعة متساوية، وبما أن '), math('AD = 3cm'), text(' فإن '), math('AF = FE = ED = 3cm'), text('.')),
          rich(text('في متوازي الأضلاع '), math('FBCE'), text(' الضلعان المتقابلان '), math('[FE]'), text(' و'), math('[BC]'), text(' متساويان، إذن '), math('BC = FE = 3cm'), text('.')),
          rich(text('النقطة '), math('F'), text(' تقع بين '), math('A'), text(' و'), math('B'), text('، لذا '), math('AB = AF + FB = 3 + 5 = 8cm'), text('.')),
        ],
        why: rich(
          text('الضلع '), math('[FE]'), text(' هو الجسر بين الشكلين: طوله معروف من المعيّن، وينتقل إلى الضلع المقابل في متوازي الأضلاع. ثم نجمع '),
          math('AF'), text(' و'), math('FB'), text(' لأن القطعتين متتاليتان على استقامة واحدة، لا نطرحهما ولا نضربهما.'),
        ),
      },
    },
  ],
})

export default test
