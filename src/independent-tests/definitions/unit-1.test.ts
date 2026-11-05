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
 * Coverage (30 questions; Q30 is the single cross-lesson synthesis item):
 *   شبكة الإحداثيات 3 · التمثيلات البيانية بالخطوط 3 · الأعداد الطبيعية 5 ·
 *   تقريب الأعداد الطبيعية 4 · جمع الأعداد الطبيعية وطرحها 5 · قياس الزوايا 4 ·
 *   متوازي الأضلاع 4 · المعيّن 3  (Q30 counts in both geometry lessons)
 *
 * Style spread: 7 اختيار من متعدد · 7 أكمل الفراغ · 4 مسائل متعددة الخطوات ·
 *   3 أوجد الناتج بالخطوات · 3 اكتشف الخطأ · 2 مسألة لفظية · 1 قراءة جدول ·
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

const coordinatePoints = [
  { label: 'A', point: { x: 5, y: 4 } },
  { label: 'B', point: { x: 0, y: 5 } },
  { label: 'C', point: { x: 6, y: 0 } },
]

const librarySeries = {
  labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
  values: [12, 18, 18, 24, 20],
  yMin: 0,
  yMax: 30,
  yStep: 5,
  xAxisLabel: 'اليوم',
  yAxisLabel: 'عدد الكتب',
}

const libraryTable = independentTable({
  caption: rich(text('عدد الكتب المستعارة خلال خمسة أيام')),
  columns: [rich(text('اليوم')), rich(text('عدد الكتب'))],
  rows: [
    [rich(text('الأحد')), rich(math('12'))],
    [rich(text('الإثنين')), rich(math('18'))],
    [rich(text('الثلاثاء')), rich(math('18'))],
    [rich(text('الأربعاء')), rich(math('24'))],
    [rich(text('الخميس')), rich(text('؟'))],
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
      prompt: rich(text('في الشكل المجاور، ما الزوج المرتّب الذي يمثّل موقع النقطة '), math('A'), text('؟')),
      figure: {
        kind: 'coordinate-grid',
        points: coordinatePoints,
        ariaLabel: 'شبكة إحداثيات عليها ثلاث نقاط موسومة A وB وC',
      },
      options: [
        choice('q01-a', math('(5,4)')),
        choice('q01-b', math('(4,5)')),
        choice('q01-c', math('(5,0)')),
        choice('q01-d', math('(0,4)')),
      ],
      solution: {
        answer: rich(math('(5,4)')),
        idea: rich(text('نقرأ الإحداثي الأفقي أولاً من المحور '), math('X'), text('، ثم الإحداثي الشاقولي من المحور '), math('Y'), text('.')),
        steps: [
          rich(text('من النقطة '), math('A'), text(' ننزل عمودياً إلى المحور الأفقي فنجد '), math('5'), text('.')),
          rich(text('من النقطة نفسها نتحرك أفقياً إلى المحور الشاقولي فنجد '), math('4'), text('.')),
          rich(text('لذلك الزوج المرتّب هو '), math('(5,4)'), text('.')),
        ],
        why: rich(
          text('الزوج '), math('(4,5)'), text(' يعني '), math('4'), text(' وحدات أفقياً و'), math('5'),
          text(' وحدات شاقولياً، وهو موقع آخر. ترتيب العددين ليس شكلاً كتابياً، بل يحدّد المحور الذي تقيس عليه كل قيمة.'),
        ),
      },
    },
    {
      number: 2,
      lessonIds: [COORDINATES],
      style: 'fill-blank',
      level: 'basic',
      prompt: rich(text('في الشكل المجاور، ما الزوج المرتّب الذي يمثّل موقع النقطة '), math('B'), text('؟')),
      figure: {
        kind: 'coordinate-grid',
        points: coordinatePoints,
        ariaLabel: 'شبكة إحداثيات عليها ثلاث نقاط موسومة A وB وC',
      },
      solution: {
        answer: rich(math('(0,5)')),
        idea: rich(text('النقطة '), math('B'), text(' تقع على المحور الشاقولي، لذلك إحداثيها الأفقي '), math('0'), text('.')),
        steps: [
          rich(text('إحداثي '), math('B'), text(' الأفقي هو '), math('0'), text('، لأنها تقع على المحور الشاقولي ولا تبتعد عنه يميناً.')),
          rich(text('إحداثيها الشاقولي هو '), math('5'), text('، لأنها ترتفع '), math('5'), text(' وحدات.')),
          rich(text('إذن الزوج المرتّب هو '), math('(0,5)'), text('.')),
        ],
        why: rich(
          text('الزوج '), math('(5,0)'), text(' يعني '), math('5'), text(' وحدات أفقياً وصفراً شاقولياً، فيقع على المحور الأفقي. أما '),
          math('B'), text(' فإحداثيها الأفقي صفر، لذلك تبقى على المحور الشاقولي.'),
        ),
      },
    },
    {
      number: 3,
      lessonIds: [COORDINATES],
      style: 'multi-step',
      level: 'advanced',
      prompt: rich(
        text('بدأت نقطة من مبدأ الإحداثيات '), math('O(0,0)'),
        text('، ثم تحركت '), math('3'), text(' وحدات إلى اليمين، و'), math('4'), text(' وحدات إلى الأعلى، ثم '),
        math('5'), text(' وحدات أخرى إلى اليمين، ثم وحدتين إلى الأسفل. ما إحداثيات موقعها النهائي؟'),
      ),
      solution: {
        answer: rich(math('(8,2)')),
        idea: rich(text('كل حركة أفقية تغيّر الإحداثي الأفقي، وكل حركة شاقولية تغيّر الإحداثي الشاقولي، والاتجاه يحدّد الجمع أو الطرح.')),
        steps: [
          rich(text('الحركات الأفقية: '), math('0 + 3 + 5 = 8'), text('، فالإحداثي الأفقي '), math('8'), text('.')),
          rich(text('الحركات الشاقولية: '), math('0 + 4 - 2 = 2'), text('، فالإحداثي الشاقولي '), math('2'), text('.')),
          rich(text('إذن الموقع النهائي هو '), math('(8,2)'), text('.')),
        ],
        why: rich(
          text('لا نخلط بين الاتجاهين: اليمين يزيد الإحداثي الأفقي، والأعلى يزيد الإحداثي الشاقولي، والأسفل ينقصه. لو جمعنا الحركات كلها في عدد واحد لما عبّر الناتج عن موقع في المستوى.'),
        ),
      },
    },

    /* ────────────────────────── الدرس 2: التمثيلات البيانية بالخطوط ────────────────────────── */
    {
      number: 4,
      lessonIds: [LINE_GRAPHS],
      style: 'fill-blank',
      level: 'basic',
      prompt: rich(text('يمثّل الخط البياني عدد الكتب التي استعارها الطلاب من مكتبة المدرسة خلال خمسة أيام. ما عدد الكتب المستعارة يوم الأربعاء؟')),
      figure: {
        kind: 'line-chart',
        series: librarySeries,
        ariaLabel: 'تمثيل بياني بالخطوط لعدد الكتب المستعارة خلال خمسة أيام',
      },
      solution: {
        answer: rich(math('24'), text(' كتاباً')),
        idea: rich(text('نحدّد يوم الأربعاء على المحور الأفقي، ثم نصعد إلى النقطة المقابلة ونقرأ قيمتها على المحور الشاقولي.')),
        steps: [
          rich(text('نجد كلمة «الأربعاء» على المحور الأفقي، وهي العمود الرابع.')),
          rich(text('نصعد من اليوم نفسه إلى نقطة الخط، ثم ننظر أفقياً إلى المحور الشاقولي.')),
          rich(text('القيمة المقابلة هي '), math('24'), text('، أي '), math('24'), text(' كتاباً.')),
        ],
        why: rich(
          text('النقطة على الخط تمثّل زوجاً من اليوم وعدد الكتب. لا نقرأ اليوم نفسه كإجابة، ولا نأخذ أعلى قيمة في الرسم إلا إذا طُلب ذلك صراحةً.'),
        ),
      },
    },
    {
      number: 5,
      lessonIds: [LINE_GRAPHS],
      style: 'multiple-choice',
      level: 'medium',
      prompt: rich(text('في التمثيل البياني المجاور، أيّ وصف يطابق تغيّر عدد الكتب المستعارة من الأحد إلى الخميس؟')),
      figure: {
        kind: 'line-chart',
        series: librarySeries,
        ariaLabel: 'تمثيل بياني بالخطوط لعدد الكتب المستعارة خلال خمسة أيام',
      },
      options: [
        choiceText('q05-a', 'يزداد ثم يثبت ثم يزداد ثم ينقص'),
        choiceText('q05-b', 'يزداد ثم ينقص ثم يثبت ثم يزداد'),
        choiceText('q05-c', 'يثبت ثم يزداد ثم ينقص ثم يثبت'),
        choiceText('q05-d', 'ينقص ثم يزداد ثم يثبت ثم ينقص'),
      ],
      solution: {
        answer: rich(text('يزداد ثم يثبت ثم يزداد ثم ينقص')),
        idea: rich(text('نقارن كل قيمتين متتاليتين: صعود الخط زيادة، وأفقيّه ثبات، ونزوله نقصان.')),
        steps: [
          rich(text('الأحد ← الإثنين: '), math('12 → 18'), text(' زيادة.')),
          rich(text('الإثنين ← الثلاثاء: '), math('18 → 18'), text(' ثبات؛ الثلاثاء ← الأربعاء: '), math('18 → 24'), text(' زيادة.')),
          rich(text('الأربعاء ← الخميس: '), math('24 → 20'), text(' نقصان، فيكون الوصف: يزداد ثم يثبت ثم يزداد ثم ينقص.')),
        ],
        why: rich(
          text('المقطع الأفقي يعني أن القيمة لم تتغيّر، وليس أنها صفر. والمقطع الهابط يعني نقصاناً، أما الصاعد فيعني زيادة، بغض النظر عن مقدار الميل.'),
        ),
      },
    },
    {
      number: 6,
      lessonIds: [LINE_GRAPHS],
      style: 'table-reading',
      level: 'medium',
      prompt: rich(text('أكمل الجدول الآتي اعتماداً على التمثيل البياني نفسه: ما عدد الكتب المستعارة يوم الخميس؟')),
      figure: {
        kind: 'line-chart',
        series: librarySeries,
        ariaLabel: 'تمثيل بياني بالخطوط لعدد الكتب المستعارة خلال خمسة أيام',
      },
      table: libraryTable,
      solution: {
        answer: rich(math('20'), text(' كتاباً')),
        idea: rich(text('الجدول والتمثيل البياني يعرضان البيانات نفسها؛ القيمة الناقصة هي ارتفاع نقطة يوم الخميس.')),
        steps: [
          rich(text('من التمثيل نجد نقطة يوم الخميس في العمود الخامس.')),
          rich(text('نقرأ ارتفاعها على المحور الشاقولي فنجد '), math('20'), text('.')),
          rich(text('إذن الخانة الناقصة في الجدول تساوي '), math('20'), text('.')),
        ],
        why: rich(
          text('الجدول لا يغيّر البيانات، بل يعيد ترتيبها. إذا اختلفت قيمة الجدول عن ارتفاع النقطة فذلك خطأ في القراءة، لا اختلاف في البيانات.'),
        ),
      },
    },

    /* ───────────────────────────── الدرس 3: الأعداد الطبيعية ───────────────────────────── */
    {
      number: 7,
      lessonIds: [NATURAL_NUMBERS],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('أي الأعداد الآتية يُقرأ: «ثلاثة ملايين وأربعون ألفاً وستمئة وسبعة»؟')),
      options: [
        choice('q07-a', math('3,040,607')),
        choice('q07-b', math('3,400,607')),
        choice('q07-c', math('3,040,670')),
        choice('q07-d', math('3,004,607')),
      ],
      solution: {
        answer: rich(math('3,040,607')),
        idea: rich(text('نوزّع العدد على المجموعات: الملايين، ثم الآلاف، ثم الوحدات.')),
        steps: [
          rich(text('«ثلاثة ملايين» تعني '), math('3,000,000'), text('.')),
          rich(text('«وأربعون ألفاً» تعني '), math('40,000'), text('، فتصبح '), math('3,040,000'), text('.')),
          rich(text('«وستماية وسبعة» تعني '), math('607'), text('، فيكون العدد '), math('3,040,607'), text('.')),
        ],
        why: rich(
          text('الخيار '), math('3,400,607'), text(' يعني أربعمئة ألف لا أربعين ألفاً، والخيار '), math('3,004,607'),
          text(' يعني أربعة آلاف. موضع كل مجموعة هو الذي يحدّد قيمتها، لا عدد الأرقام وحده.'),
        ),
      },
    },
    {
      number: 8,
      lessonIds: [NATURAL_NUMBERS],
      style: 'fill-blank',
      level: 'medium',
      prompt: rich(text('اكتب العدد '), math('6,208,050'), text(' بالصيغة اللفظية.')),
      solution: {
        answer: rich(text('ستة ملايين ومئتان وثمانية آلاف وخمسون')),
        idea: rich(text('نقرأ العدد مجموعةً مجموعة من اليمين: الآلاف ثم الملايين، مع مراعاة الأصفار داخل المجموعة.')),
        steps: [
          rich(text('مجموعة الملايين: '), math('6'), text(' ← ستة ملايين.')),
          rich(text('مجموعة الآلاف: '), math('208'), text(' ← مئتان وثمانية آلاف.')),
          rich(text('مجموعة الوحدات: '), math('050'), text(' ← خمسون، فيصبح العدد: ستة ملايين ومئتان وثمانية آلاف وخمسون.')),
        ],
        why: rich(
          text('الصفر في خانة المئات داخل مجموعة الآلاف لا يُقرأ «صفر مئة»، لكنه يمنع أن تصبح المجموعة ثمانية وعشرين ألفاً. الصيغة اللفظية تحفظ مواضع المجموعات.'),
        ),
      },
    },
    {
      number: 9,
      lessonIds: [NATURAL_NUMBERS],
      style: 'show-work',
      level: 'medium',
      prompt: rich(text('اكتب العدد '), math('8,070,406'), text(' بالصيغة الموسّعة، ثم اذكر قيمة الرقم '), math('7'), text(' فيه.')),
      solution: {
        answer: rich(math('8,000,000 + 70,000 + 400 + 6'), text('، وقيمة '), math('7'), text(' هي '), math('70,000')),
        idea: rich(text('نحوّل كل رقم إلى قيمته المنزلية، ونهمل الأصفار لأن قيمتها صفر.')),
        steps: [
          rich(text('الرقم '), math('8'), text(' في خانة الملايين قيمته '), math('8,000,000'), text('.')),
          rich(text('الرقم '), math('7'), text(' في خانة عشرات الآلاف قيمته '), math('70,000'), text('، والرقم '), math('4'), text(' في خانة المئات قيمته '), math('400'), text('، والرقم '), math('6'), text(' قيمته '), math('6'), text('.')),
          rich(text('إذن الصيغة الموسّعة هي '), math('8,000,000 + 70,000 + 400 + 6'), text('.')),
        ],
        why: rich(
          text('لا تكتب '), math('700,000'), text(' لأن الرقم '), math('7'), text(' ليس في خانة مئات الآلاف. موقع الرقم بالنسبة إلى الفاصلة هو ما يحدّد قيمته المنزلية.'),
        ),
      },
    },
    {
      number: 10,
      lessonIds: [NATURAL_NUMBERS],
      style: 'fill-blank',
      level: 'basic',
      prompt: rich(text('في العدد '), math('4,506,270'), text('، ما القيمة المنزلية للرقم '), math('5'), text('؟')),
      solution: {
        answer: rich(math('500,000')),
        idea: rich(text('نحدّد اسم الخانة التي يقع فيها الرقم، ثم نكتب قيمتها.')),
        steps: [
          rich(text('نرتّب الخانات من اليمين: آحاد، عشرات، مئات، آلاف، عشرات آلاف، مئات آلاف، ملايين.')),
          rich(text('الرقم '), math('5'), text(' يقع في خانة مئات الآلاف.')),
          rich(text('قيمة مئات الآلاف هي '), math('500,000'), text('.')),
        ],
        why: rich(
          text('القيمة المنزلية ليست الرقم نفسه. الرقم '), math('5'), text(' هنا يساوي '), math('500,000'), text('، بينما الرقم '), math('5'), text(' في خانة عشرات الآلاف كان يساوي '), math('50,000'), text('.'),
        ),
      },
    },
    {
      number: 11,
      lessonIds: [NATURAL_NUMBERS],
      style: 'error-analysis',
      level: 'medium',
      prompt: rich(
        text('قال طالب إن الصيغة الموسّعة للعدد '), math('2,090,300'), text(' هي: '),
        math('2,000,000 + 900,000 + 300'), text('. اكتشف الخطأ وصحّحه.'),
      ),
      solution: {
        answer: rich(text('الخطأ أن '), math('900,000'), text(' بدل '), math('90,000'), text('؛ الصيغة الصحيحة: '), math('2,000,000 + 90,000 + 300')),
        idea: rich(text('نفحص خانة الرقم '), math('9'), text(' داخل العدد قبل تحويله إلى قيمة منزلية.')),
        steps: [
          rich(text('في العدد '), math('2,090,300'), text(' الرقم '), math('9'), text(' يقع في خانة عشرات الآلاف.')),
          rich(text('قيمته إذن '), math('90,000'), text('، وليست '), math('900,000'), text('.')),
          rich(text('الصيغة الصحيحة: '), math('2,000,000 + 90,000 + 300'), text('، ومجموعها '), math('2,090,300'), text('.')),
        ],
        why: rich(
          text('لو كانت القيمة '), math('900,000'), text(' لصار العدد '), math('2,900,300'), text('. الخطأ ناتج عن قراءة خانة الرقم خطأً، لا عن خطأ في الجمع.'),
        ),
      },
    },

    /* ─────────────────────────── الدرس 4: تقريب الأعداد الطبيعية ─────────────────────────── */
    {
      number: 12,
      lessonIds: [ROUNDING],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('يمثّل المستقيم الآتي موقع العدد '), math('643'), text(' بين '), math('600'), text(' و'), math('700'), text('. إلى أي مئة يُقرّب العدد '), math('643'), text('؟')),
      figure: {
        kind: 'number-line',
        min: 600,
        max: 700,
        step: 10,
        midpoint: 650,
        target: 643,
        ariaLabel: 'مستقيم أعداد من 600 إلى 700، والنقطة عند 643',
      },
      options: [
        choice('q12-a', math('600')),
        choice('q12-b', math('640')),
        choice('q12-c', math('650')),
        choice('q12-d', math('700')),
      ],
      solution: {
        answer: rich(math('600')),
        idea: rich(text('نقارن العدد '), math('643'), text(' بمنتصف المسافة بين المئتين، وهو '), math('650'), text('.')),
        steps: [
          rich(text('المئتان المتجاورتان هما '), math('600'), text(' و'), math('700'), text('، والمنتصف '), math('650'), text('.')),
          rich(text('العدد '), math('643'), text(' أصغر من '), math('650'), text('، فهو أقرب إلى '), math('600'), text('.')),
          rich(text('المسافة إلى '), math('600'), text(' هي '), math('43'), text('، وإلى '), math('700'), text(' هي '), math('57'), text('.')),
        ],
        why: rich(
          text('التقريب إلى أقرب مئة لا يعني حذف بقية الأرقام دائماً. ننظر إلى رقم العشرات: '), math('4'),
          text(' أقل من '), math('5'), text('، فنُبقي رقم المئات كما هو ونضع أصفاراً بعده.'),
        ),
      },
    },
    {
      number: 13,
      lessonIds: [ROUNDING],
      style: 'compare',
      level: 'medium',
      prompt: rich(
        text('قارن بين تقريب العدد '), math('5,847,300'), text(' إلى أقرب عشرة آلاف، وتقريبه إلى أقرب مئة ألف، مستخدماً أحد الرموز: '),
        math('>'), text('، '), math('<'), text('، '), math('='), text('.'),
      ),
      solution: {
        answer: rich(math('5,850,000 > 5,800,000')),
        idea: rich(text('نقرّب العدد مرتين إلى مكانين مختلفين، ثم نقارن الناتجين.')),
        steps: [
          rich(text('إلى أقرب عشرة آلاف: رقم العشرة آلاف '), math('4'), text('، والرقم الذي بعده '), math('7'), text('، فنرفع '), math('4'), text(' إلى '), math('5'), text(' ← '), math('5,850,000'), text('.')),
          rich(text('إلى أقرب مئة ألف: رقم المئة ألف '), math('8'), text('، والرقم الذي بعده '), math('4'), text('، فنبقي '), math('8'), text(' ← '), math('5,800,000'), text('.')),
          rich(text('بما أن '), math('5,850,000'), text(' أكبر من '), math('5,800,000'), text('، فالعلاقة '), math('>'), text('.')),
        ],
        why: rich(
          text('التقريب إلى مكان أكبر قد يمحو معلومات أكثر. الناتجان مختلفان لأن كلاً منهما يجيب عن سؤال مختلف عن دقة التقريب، وليس لأن أحد الحسابين خطأ.'),
        ),
      },
    },
    {
      number: 14,
      lessonIds: [ROUNDING],
      style: 'show-work',
      level: 'medium',
      prompt: rich(text('قرّب العدد '), math('3,960,000'), text(' إلى أقرب مليون، وبيّن هل كان التقريب إلى أعلى أم إلى أسفل.')),
      solution: {
        answer: rich(math('4,000,000'), text('، تقريب إلى أعلى')),
        idea: rich(text('ننظر إلى الرقم الذي يلي خانة الملايين؛ إذا كان '), math('5'), text(' أو أكبر نرفع، وإلا نُبقي.')),
        steps: [
          rich(text('رقم الملايين هو '), math('3'), text('، والرقم الذي يليه في خانة مئات الآلاف هو '), math('9'), text('.')),
          rich(text('بما أن '), math('9'), text(' أكبر من أو يساوي '), math('5'), text('، نرفع رقم الملايين إلى '), math('4'), text('.')),
          rich(text('نضع أصفاراً في الخانات الباقية، فيكون الناتج '), math('4,000,000'), text('، وهو أكبر من العدد الأصلي فالتقريب إلى أعلى.')),
        ],
        why: rich(
          text('لا ننظر إلى الرقم '), math('9'), text(' وحده كأنه قيمة كاملة؛ هو مجرد مؤشر على الاتجاه. القيمة النهائية تأتي من رفع رقم الملايين ثم تصفير ما بعده.'),
        ),
      },
    },
    {
      number: 15,
      lessonIds: [ROUNDING],
      style: 'error-analysis',
      level: 'advanced',
      prompt: rich(text('قال طالب: «'), math('76,499'), text(' مقرّباً إلى أقرب ألف يساوي '), math('77,000'), text('». اكتشف الخطأ وصحّحه.')),
      solution: {
        answer: rich(text('التقريب الصحيح '), math('76,000'), text('، لأن رقم المئات '), math('4'), text(' أقل من '), math('5')),
        idea: rich(text('في التقريب إلى أقرب ألف، الرقم الحاسم هو رقم المئات، لا مجرد وجود أرقام غير صفرية بعد الألف.')),
        steps: [
          rich(text('نحدّد رقم الآلاف: '), math('6'), text('، والرقم الذي يليه في خانة المئات: '), math('4'), text('.')),
          rich(text('بما أن '), math('4'), text(' أصغر من '), math('5'), text('، نُبقي رقم الآلاف كما هو.')),
          rich(text('نضع أصفاراً في خانات المئات والعشرات والآحاد، فيكون الناتج '), math('76,000'), text('.')),
        ],
        why: rich(
          text('الطالب رأى أن العدد '), math('76,499'), text(' قريب من '), math('77,000'), text(' فرفع. لكن التقريب يحكمه الرقم الحاسم فقط؛ '), math('499'), text(' أقل من نصف ألف، لذلك يبقى '), math('76,000'), text('.'),
        ),
      },
    },

    /* ──────────────────── الدرس 5: جمع الأعداد الطبيعية وطرحها ──────────────────── */
    {
      number: 16,
      lessonIds: [ADD_SUBTRACT],
      style: 'show-work',
      level: 'medium',
      prompt: rich(text('أوجد ناتج '), math('428,657 + 356,789'), text(' مع كتابة الخطوات.')),
      solution: {
        answer: rich(math('785,446')),
        idea: rich(text('نرتب العددين عمودياً بحسب الخانات، ونجمع من الآحاد إلى اليسار مع الحمل عند الحاجة.')),
        steps: [
          rich(text('الآحاد: '), math('7 + 9 = 16'), text('، نكتب '), math('6'), text(' ونحمل '), math('1'), text('.')),
          rich(text('العشرات: '), math('5 + 8 + 1 = 14'), text('، نكتب '), math('4'), text(' ونحمل '), math('1'), text('؛ والمئات: '), math('6 + 7 + 1 = 14'), text('، نكتب '), math('4'), text(' ونحمل '), math('1'), text('.')),
          rich(text('الآلاف: '), math('8 + 6 + 1 = 15'), text('، نكتب '), math('5'), text(' ونحمل '), math('1'), text('؛ ثم '), math('2 + 5 + 1 = 8'), text(' و'), math('4 + 3 = 7'), text('.')),
          rich(text('الناتج: '), math('785,446'), text('.')),
        ],
        why: rich(
          text('الحمل ليس رقماً إضافياً يُكتب في الناتج، بل ينتقل إلى الخانة التالية. إغفاله هو السبب الشائع للحصول على ناتج أصغر من الصحيح.'),
        ),
      },
    },
    {
      number: 17,
      lessonIds: [ADD_SUBTRACT],
      style: 'word-problem',
      level: 'medium',
      prompt: rich(text('في مخزن '), math('900,000'), text(' قلم، بيع منه '), math('278,465'), text(' قلماً. كم قلماً بقي في المخزن؟')),
      solution: {
        answer: rich(math('621,535'), text(' قلماً')),
        idea: rich(text('الباقي يساوي الكمية الأصلية ناقص الكمية المبيعة، مع الاستلاف عند الحاجة.')),
        steps: [
          rich(text('نكتب الطرح: '), math('900,000 - 278,465'), text('.')),
          rich(text('نسترجع من الخانات الأعلى تدريجياً لأن خانات الآحاد والعشرات والمئات أصفار.')),
          rich(text('بعد الاستلاف: '), math('900,000 - 278,465 = 621,535'), text('.')),
        ],
        why: rich(
          text('لا نطرح '), math('278,465'), text(' من '), math('900,000'), text(' بتجاهل الأصفار. الاستلاف يعيد توزيع القيمة بين الخانات من دون أن يغيّر قيمة العدد الأصلي.'),
        ),
      },
    },
    {
      number: 18,
      lessonIds: [ADD_SUBTRACT],
      style: 'error-analysis',
      level: 'advanced',
      prompt: rich(text('أجرى طالب العملية '), math('46,708 + 38,596'), text(' فحصل على '), math('84,304'), text('. اكتشف الخطأ وصحّحه.')),
      solution: {
        answer: rich(text('الناتج الصحيح '), math('85,304'), text('؛ فقد سقط حمل من خانة الآلاف')),
        idea: rich(text('نعيد الجمع خانةً خانة ونراقب الحمل عند تجاوز المجموع '), math('9'), text('.')),
        steps: [
          rich(text('الآحاد: '), math('8 + 6 = 14'), text('، نكتب '), math('4'), text(' ونحمل '), math('1'), text('.')),
          rich(text('العشرات: '), math('0 + 9 + 1 = 10'), text('، نكتب '), math('0'), text(' ونحمل '), math('1'), text('؛ والمئات: '), math('7 + 5 + 1 = 13'), text('، نكتب '), math('3'), text(' ونحمل '), math('1'), text('.')),
          rich(text('الآلاف: '), math('6 + 8 + 1 = 15'), text('، نكتب '), math('5'), text(' ونحمل '), math('1'), text('؛ ثم '), math('4 + 3 + 1 = 8'), text('، فيكون الناتج '), math('85,304'), text('.')),
        ],
        why: rich(
          text('ناتج الطالب '), math('84,304'), text(' يقل بألف عن الصحيح، وهذا يتفق مع إسقاط حمل الآلاف. عند الجمع، كل حمل يجب أن يظهر في الخانة التالية.'),
        ),
      },
    },
    {
      number: 19,
      lessonIds: [ADD_SUBTRACT],
      style: 'multi-step',
      level: 'advanced',
      prompt: rich(
        text('بدأت مدرسة بمبلغ '), math('1,250,000'), text(' ل.س. صرفت '), math('475,000'), text(' ل.س على الكتب، ثم استلمت تبرعاً بمبلغ '),
        math('320,000'), text(' ل.س. ما المبلغ المتبقي لديها؟'),
      ),
      solution: {
        answer: rich(math('1,095,000'), text(' ل.س')),
        idea: rich(text('نطرح المصروف أولاً، ثم نضيف التبرع إلى الباقي، لأن العمليتين تحدثان بالترتيب.')),
        steps: [
          rich(text('بعد شراء الكتب: '), math('1,250,000 - 475,000 = 775,000'), text(' ل.س.')),
          rich(text('بعد استلام التبرع: '), math('775,000 + 320,000 = 1,095,000'), text(' ل.س.')),
          rich(text('إذن المبلغ المتبقي '), math('1,095,000'), text(' ل.س.')),
        ],
        why: rich(
          text('الترتيب لا يغيّر الناتج هنا: '), math('1,250,000 - 475,000 + 320,000 = 1,095,000'), text('. لكن لو طرحنا التبرع بدل إضافته لكان الناتج '), math('455,000'), text('، وهو خطأ في قراءة معنى «استلمت».'),
        ),
      },
    },
    {
      number: 20,
      lessonIds: [ADD_SUBTRACT],
      style: 'word-problem',
      level: 'medium',
      prompt: rich(
        text('في مكتبة '), math('48,750'), text(' كتاباً، ثم أضيف إليها '), math('12,380'), text(' كتاباً. كم كتاباً صار في المكتبة؟'),
      ),
      solution: {
        answer: rich(math('61,130'), text(' كتاباً')),
        idea: rich(text('كلمة «أضيف» تعني أن العدد زاد، فنستخدم الجمع.')),
        steps: [
          rich(text('نكتب العملية: '), math('48,750 + 12,380'), text('.')),
          rich(text('الآحاد: '), math('0 + 0 = 0'), text('؛ العشرات: '), math('5 + 8 = 13'), text('، نكتب '), math('3'), text(' ونحمل '), math('1'), text('.')),
          rich(text('بعد إكمال الجمع: '), math('48,750 + 12,380 = 61,130'), text(' كتاباً.')),
        ],
        why: rich(
          text('لو طرحنا '), math('12,380'), text(' بدل جمعها لكان الناتج '), math('36,370'), text('، وهو خطأ في قراءة اتجاه العملية.'),
        ),
      },
    },

    /* ───────────────────────────── الدرس 6: قياس الزوايا ───────────────────────────── */
    {
      number: 21,
      lessonIds: [ANGLES],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('في الشكل المجاور زاوية محدّدة بضلعين. ما نوع هذه الزاوية؟')),
      figure: {
        kind: 'angle',
        shape: 'obtuse',
        degree: 125,
        label: '∠ABC',
        ariaLabel: 'زاوية واحدة محددة بضلعين ورأس موسوم',
      },
      options: [
        choiceText('q21-a', 'حادة'),
        choiceText('q21-b', 'قائمة'),
        choiceText('q21-c', 'منفرجة'),
        choiceText('q21-d', 'مستقيمة'),
      ],
      solution: {
        answer: rich(text('منفرجة')),
        idea: rich(text('نقارن فتحة الزاوية بالزاوية القائمة: الحادة أصغر، والمنفرجة أكبر، والمستقيمة تساوي ضلعين متعاكسين.')),
        steps: [
          rich(text('الزاوية القائمة قياسها '), math('90°'), text('، والزاوية المستقيمة '), math('180°'), text('.')),
          rich(text('فتحة الزاوية في الشكل أكبر من الزاوية القائمة وأصغر من المستقيمة.')),
          rich(text('إذن هي زاوية منفرجة، وقياسها يقع بين '), math('90°'), text(' و'), math('180°'), text('.')),
        ],
        why: rich(
          text('الشكل يبيّن الفتحة لا رقم القياس. لا نسمّيها قائمة لأن ضلعيها ليسا متعامدين، ولا مستقيمة لأنهما لا يشكّلان خطاً واحداً.'),
        ),
      },
    },
    {
      number: 22,
      lessonIds: [ANGLES],
      style: 'fill-blank',
      level: 'basic',
      prompt: rich(text('اقرأ قياس الزاوية الموضحة على المنقلة في الشكل المجاور.')),
      figure: {
        kind: 'protractor',
        degree: 65,
        ariaLabel: 'منقلة عليها زاوية، اقرأ قياسها',
      },
      solution: {
        answer: rich(math('65°')),
        idea: rich(text('نطابق ضلع البداية مع خط الصفر، ثم نقرأ التدريج الذي يمرّ به الضلع الآخر.')),
        steps: [
          rich(text('ضلع البداية منطبق على خط الصفر الأفقي للمنقلة.')),
          rich(text('الضلع الآخر يقع بعد التدريج '), math('60'), text(' بخمس درجات، أي عند '), math('65'), text(' (بين '), math('60'), text(' و'), math('90'), text(').')),
          rich(text('إذن قياس الزاوية '), math('65°'), text('.')),
        ],
        why: rich(
          text('للمنقلة تدريجان متعاكسان. نختار التدريج الذي يبدأ من الصفر عند ضلع البداية، وإلا قرأنا القياس المتمّم '), math('115°'), text(' بدلاً من '), math('65°'), text('.'),
        ),
      },
    },
    {
      number: 23,
      lessonIds: [ANGLES],
      style: 'draw',
      level: 'medium',
      prompt: rich(text('ارسم زاوية قائمة، ثم ارسم زاوية مقدارها '), math('120°'), text('، وسمّ رأس كل زاوية.')),
      solution: {
        answer: rich(text('زاوية قائمة '), math('90°'), text(' وزاوية '), math('120°'), text('، مع تسمية الرأسين')),
        idea: rich(text('نبدأ بضلع أفقي، ثم نضع مركز المنقلة على الرأس ونحدّد الشعاع الآخر عند القياس المطلوب.')),
        steps: [
          rich(text('للزاوية القائمة: نرسم ضلعاً أفقياً، ونقيم من رأسها ضلعاً عمودياً عليه؛ قياسها '), math('90°'), text('.')),
          rich(text('للزاوية '), math('120°'), text(': نطابق الصفر مع الضلع الأفقي، ونعلّم نقطة عند '), math('120°'), text(' ثم نصلها بالرأس.')),
          rich(text('نسمّي رأس كل زاوية بحرف، مثل '), math('B'), text('، ونكتب القياس بجانب القوس.')),
        ],
        why: rich(
          text('الزاوية القائمة لا تُرسم «بالعين» فقط؛ نتحقق من التعامد. والزاوية '), math('120°'), text(' منفرجة، لذا يجب أن يكون ضلعها الثاني أبعد من العمودي، لا بين الضلع الأفقي والعمودي.'),
        ),
      },
    },
    {
      number: 24,
      lessonIds: [ANGLES],
      style: 'explain',
      level: 'advanced',
      prompt: rich(text('زاويتان متجاورتان على مستقيم، وقياس إحداهما '), math('68°'), text('. ما قياس الزاوية الأخرى؟ علّل إجابتك.')),
      solution: {
        answer: rich(math('112°')),
        idea: rich(text('الزاويتان المتجاورتان على مستقيم تكوّنان معاً زاوية مستقيمة قياسها '), math('180°'), text('.')),
        steps: [
          rich(text('مجموع قياسي الزاويتين على المستقيم يساوي '), math('180°'), text('.')),
          rich(text('نطرح القياس المعلوم: '), math('180° - 68° = 112°'), text('.')),
          rich(text('إذن الزاوية الأخرى '), math('112°'), text('، وهي منفرجة لأنها أكبر من '), math('90°'), text('.')),
        ],
        why: rich(
          text('التجاور وحده لا يكفي؛ الشرط أن تكون الزاويتان على مستقيم، فيكون مجموعاهما '), math('180°'), text('. لو كانتا تدوران حول نقطة كاملة لكان المجموع '), math('360°'), text('، وهذا ليس الحال هنا.'),
        ),
      },
    },

    /* ───────────────────────────── الدرس 7: متوازي الأضلاع ───────────────────────────── */
    {
      number: 25,
      lessonIds: [PARALLELOGRAM],
      style: 'fill-blank',
      level: 'basic',
      prompt: rich(text('في متوازي الأضلاع '), math('ABCD'), text('، طول '), math('AB = 9cm'), text(' وطول '), math('BC = 6cm'), text('. ما طول الضلع '), math('CD'), text('؟')),
      solution: {
        answer: rich(math('9cm')),
        idea: rich(text('في متوازي الأضلاع كل ضلعين متقابلين متوازيان ومتساويان في الطول.')),
        steps: [
          rich(text('الضلع '), math('CD'), text(' يقابل الضلع '), math('AB'), text('.')),
          rich(text('الضلعان المتقابلان متساويان، لذلك '), math('CD = AB'), text('.')),
          rich(text('بما أن '), math('AB = 9cm'), text(' فإن '), math('CD = 9cm'), text('.')),
        ],
        why: rich(
          text('الضلع '), math('BC'), text(' مجاور لـ '), math('AB'), text(' وليس مقابلاً له، لذلك لا نستخدم طوله هنا. الخلط بين المجاور والمقابل يغيّر الإجابة.'),
        ),
      },
    },
    {
      number: 26,
      lessonIds: [PARALLELOGRAM],
      style: 'fill-blank',
      level: 'medium',
      prompt: rich(text('متوازي أضلاع طولا ضلعين متجاورين فيه '), math('9cm'), text(' و'), math('6cm'), text('. ما محيطه؟')),
      solution: {
        answer: rich(math('30cm')),
        idea: rich(text('المحيط مجموع أطوال الأضلاع الأربعة، وفي متوازي الأضلاع كل ضلعين متقابلين متساويان.')),
        steps: [
          rich(text('الأضلاع الأربعة هي '), math('9 + 6 + 9 + 6'), text('.')),
          rich(text('أو باستخدام القانون: '), math('2 × (9 + 6) = 2 × 15 = 30'), text('.')),
          rich(text('إذن المحيط '), math('30cm'), text('.')),
        ],
        why: rich(
          text('الناتج '), math('15cm'), text(' هو مجموع ضلعين متجاورين فقط، وليس المحيط كاملاً. والناتج '), math('54'), text(' ناتج ضرب الضلعين، وهو لا يمثّل محيطاً.'),
        ),
      },
    },
    {
      number: 27,
      lessonIds: [PARALLELOGRAM],
      style: 'multiple-choice',
      level: 'advanced',
      prompt: rich(text('في متوازي الأضلاع '), math('ABCD'), text('، قياس '), math('∠A = 118°'), text('. ما قياس '), math('∠C'), text('؟')),
      options: [
        choice('q27-a', math('62°')),
        choice('q27-b', math('118°')),
        choice('q27-c', math('236°')),
        choice('q27-d', math('298°')),
      ],
      solution: {
        answer: rich(math('118°')),
        idea: rich(text('الزاويتان المتقابلتان في متوازي الأضلاع متساويتان، أما الزاويتان المتجاورتان فمجموعهما '), math('180°'), text('.')),
        steps: [
          rich(text('الزاوية '), math('C'), text(' تقابل الزاوية '), math('A'), text('، لأن الرأسين '), math('A'), text(' و'), math('C'), text(' غير متجاورين.')),
          rich(text('إذن '), math('∠C = ∠A = 118°'), text('.')),
          rich(text('للتحقق: الزاوية المجاورة '), math('∠B = 180° - 118° = 62°'), text('، وهي ليست المطلوبة.')),
        ],
        why: rich(
          text('القياس '), math('62°'), text(' هو للزاوية المجاورة لا المقابلة. والقياس '), math('236°'), text(' ناتج جمع زاويتين متقابلتين، وليس قياس زاوية واحدة.'),
        ),
      },
    },
    {
      number: 28,
      lessonIds: [RHOMBUS],
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('أيّ العبارات الآتية صحيحة دائماً عن المعيّن؟')),
      options: [
        choiceText('q28-a', 'جميع أضلاعه متساوية في الطول'),
        choiceText('q28-b', 'جميع زواياه قائمة'),
        choiceText('q28-c', 'قطراه متساويان في الطول'),
        choiceText('q28-d', 'له ضلعان متوازيان فقط'),
      ],
      solution: {
        answer: rich(text('جميع أضلاعه متساوية في الطول')),
        idea: rich(text('تعريف المعيّن يبدأ من تساوي الأضلاع الأربعة؛ أما تساوي الزوايا أو الأقطار فليس شرطاً.')),
        steps: [
          rich(text('المعيّن متوازي أضلاع، وجميع أضلاعه الأربعة متساوية.')),
          rich(text('زواياه المتقابلة متساوية، لكنها ليست كلها قائمة بالضرورة؛ فالمربع حالة خاصة فقط.')),
          rich(text('أما القطران فليس شرطاً أن يكونا متساويين في الطول؛ تساويهما خاصية إضافية لا تنطبق على كل معيّن.')),
        ],
        why: rich(
          text('العبارة «جميع زواياه قائمة» تصف المربع لا كل معيّن. والعبارة «له ضلعان متوازيان فقط» تناقض كونه متوازي أضلاع، حيث كل ضلعين متقابلين متوازيان.'),
        ),
      },
    },

    /* ─────────────────────────────── الدرس 8: المعيّن ─────────────────────────────── */
    {
      number: 29,
      lessonIds: [RHOMBUS],
      style: 'multi-step',
      level: 'advanced',
      prompt: rich(text('معيّن محيطه '), math('36cm'), text('. ما طول ضلعه؟ وما قياس الزاوية المجاورة لزاوية قياسها '), math('70°'), text('؟')),
      solution: {
        answer: rich(text('طول الضلع '), math('9cm'), text('، وقياس الزاوية المجاورة '), math('110°')),
        idea: rich(text('أضلاع المعيّن الأربعة متساوية، والزاويتان المتجاورتان في متوازي الأضلاع مجموعاهما '), math('180°'), text('.')),
        steps: [
          rich(text('طول الضلع: '), math('36 ÷ 4 = 9'), text('، أي '), math('9cm'), text('.')),
          rich(text('الزاويتان المتجاورتان متكاملتان: '), math('180° - 70° = 110°'), text('.')),
          rich(text('إذن الضلع '), math('9cm'), text(' والزاوية المجاورة '), math('110°'), text('.')),
        ],
        why: rich(
          text('لا نقسم المحيط على العدد '), math('2'), text(' لأن للمعيّن أربعة أضلاع متساوية. ولا نجعل الزاويتين المتجاورتين متساويتين؛ تساويهما يحدث في المربع فقط، لا في كل معيّن.'),
        ),
      },
    },
    {
      number: 30,
      lessonIds: [PARALLELOGRAM, RHOMBUS],
      style: 'multi-step',
      level: 'advanced',
      prompt: rich(
        text('في الشكل الرباعي '), math('ABCD'), text(' متوازي أضلاع، والنقطة '), math('E'), text(' منتصف '), math('AB'), text('، والنقطة '),
        math('F'), text(' منتصف '), math('CD'), text('. إذا كان '), math('AECF'), text(' معيّناً طول ضلعه '), math('5cm'),
        text('، وكان محيط '), math('ABCD'), text(' يساوي '), math('32cm'), text('، فما طول '), math('AB'), text(' وطول '), math('BC'), text('؟ وما اسم القطعة المستقيمة '), math('AC'), text(' في متوازي الأضلاع '), math('ABCD'), text('؟'),
      ),
      solution: {
        answer: rich(math('AB = 10cm'), text(' و'), math('BC = 6cm'), text('، والقطعة '), math('AC'), text(' قطر')),
        idea: rich(text('ضلع المعيّن '), math('AE'), text(' هو نصف '), math('AB'), text('، ثم نستخدم قانون محيط متوازي الأضلاع لإيجاد '), math('BC'), text('.')),
        steps: [
          rich(text('بما أن '), math('AECF'), text(' معيّن فكل أضلاعه متساوية، ومنها '), math('AE = 5cm'), text('.')),
          rich(text('النقطة '), math('E'), text(' منتصف '), math('AB'), text('، إذن '), math('AB = 2 × 5 = 10cm'), text('.')),
          rich(text('محيط '), math('ABCD'), text(': '), math('2(AB + BC) = 32'), text('، ومنه '), math('AB + BC = 16'), text('، فـ '), math('BC = 16 - 10 = 6cm'), text('.')),
          rich(text('القطعة '), math('AC'), text(' تصل بين الرأسين غير المتجاورين '), math('A'), text(' و'), math('C'), text('، لذلك هي قطر في متوازي الأضلاع.')),
        ],
        why: rich(
          text('المعيّن هنا لا يغيّر كون '), math('ABCD'), text(' متوازي أضلاع؛ استخدمنا خاصية المعيّن لإيجاد '), math('AE'), text(' فقط، ثم عُدنا إلى محيط متوازي الأضلاع. الخلط بين '), math('AE'), text(' و'), math('AB'), text(' يعطي ضعف الطول الصحيح.'),
        ),
      },
    },
  ],
})

export default test
