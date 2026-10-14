export interface UnitOneExerciseTask {
  /** Stable ID shared by the student task, teacher solution, and coverage audit. */
  id: string
  /** A label printed in the source (for example: أ, ب, ج, د). */
  branch?: string
  /** An unlettered printed item or requested quantity, when applicable. */
  referenceLabel?: string
  /** The original source wording or mathematical item, preserved without replacing it with a paraphrase. */
  sourceText: string
  /** Verified answer or construction criterion used by checks and the audit. */
  expectedAnswer: string
}

export interface UnitOneBookExercise {
  id: string
  number: number
  page: 40 | 41 | 42 | 43
  originalPrompt: string
  /** A printed contextual sentence or caption that accompanies the question. */
  sourceContext?: string
  /** Additional learning support, always displayed as «شرح المنصة». */
  platformExplanation: string
  /** Exact source figures/tables/layouts rebuilt in the student area. */
  visualAssetIds: readonly string[]
  tasks: readonly UnitOneExerciseTask[]
}

export const unitOneBookExercises = [
  {
    id: 'p40-q01', number: 1, page: 40,
    originalPrompt: 'صِل كل عبارة من العمود (A) بالثنائية المناسبة في العمود (B) فيما يأتي:',
    platformExplanation: 'في الزوج المرتب (x,y)، يمثّل العدد الأول الحركة الأفقية من مبدأ الإحداثيات، ويمثّل العدد الثاني الحركة الشاقولية. اليمين ثم الأعلى يطابقان اتجاهي المحورين الموجبين في الشبكة.',
    visualAssetIds: ['p40-q1-coordinate-grid', 'p40-q1-matching-columns'],
    tasks: [
      { id: 'p40-q01-a', branch: 'أ', sourceText: 'نتحرك من مبدأ الإحداثيات 5 وحدات إلى اليمين ووحدتان للأعلى', expectedAnswer: '(5,2)' },
      { id: 'p40-q01-b', branch: 'ب', sourceText: 'نتحرك من مبدأ الإحداثيات وحدتان إلى اليمين و5 وحدات للأعلى', expectedAnswer: '(2,5)' },
      { id: 'p40-q01-c', branch: 'ج', sourceText: 'نتحرك من مبدأ الإحداثيات 4 وحدات إلى اليمين', expectedAnswer: '(4,0)' },
      { id: 'p40-q01-d', branch: 'د', sourceText: 'نتحرك من مبدأ الإحداثيات 4 وحدات للأعلى', expectedAnswer: '(0,4)' },
    ],
  },
  {
    id: 'p40-q02', number: 2, page: 40,
    originalPrompt: 'مثّل على شبكة الإحداثيات المجاورة كلا من النقاط A(2,1)، B(4,1)، C(1,3)، ثم حدّد النقطة D التي تجعل الرباعي ABDC متوازي الأضلاع.',
    platformExplanation: 'ضع العدد الأول من كل زوج على المحور الأفقي، ثم العدد الثاني على المحور الشاقولي. انتبه إلى ترتيب رؤوس متوازي الأضلاع في السؤال: A ثم B ثم D ثم C؛ لذلك لا نبدّل D وC.',
    visualAssetIds: ['p40-q2-coordinate-grid'],
    tasks: [
      { id: 'p40-q02-main', referenceLabel: 'تمثيل النقاط وإيجاد D للرباعي ABDC', sourceText: 'A(2,1)، B(4,1)، C(1,3)، والرباعي ABDC', expectedAnswer: 'D(3,3)' },
    ],
  },
  {
    id: 'p40-q03', number: 3, page: 40,
    originalPrompt: 'أوجد ناتج كل مما يأتي:',
    platformExplanation: 'رتّب المنازل بحيث تكون الآحاد تحت الآحاد والملايين تحت الملايين. في الطرح، إذا كان رقم المنزلة العلوية أصغر فاستلف من أول منزلة غير صفرية إلى يساره، وسجّل أثر الاستلاف على كل منزلة.',
    visualAssetIds: [],
    tasks: [
      { id: 'p40-q03-a', branch: 'أ', sourceText: '6 581 214 + 2 495 162', expectedAnswer: '9 076 376' },
      { id: 'p40-q03-b', branch: 'ب', sourceText: '2 163 145 − 562 817', expectedAnswer: '1 600 328' },
      { id: 'p40-q03-c', branch: 'ج', sourceText: '4 268 725 − 1 213 517', expectedAnswer: '3 055 208' },
      { id: 'p40-q03-d', branch: 'د', sourceText: '3 412 519 + 1 201 601', expectedAnswer: '4 614 120' },
    ],
  },
  {
    id: 'p41-q04', number: 4, page: 41,
    originalPrompt: 'انسخ إلى دفترك وضع العدد المناسب في □:',
    platformExplanation: 'ابدأ من منزلة الآحاد إلى اليسار. في كل عمود، استخدم رقم الناتج لتجد الرقم المفقود، ولا تنسَ كتابة أي حمل في العمود التالي.',
    visualAssetIds: ['p41-q4-column-addition-a', 'p41-q4-column-addition-b', 'p41-q4-column-addition-c'],
    tasks: [
      { id: 'p41-q04-a', branch: 'أ', sourceText: '4 3 2 4 4 1 5 + 2 1 3 □ 5 3 □ = 6 4 5 5 9 4 8', expectedAnswer: '1,3' },
      { id: 'p41-q04-b', branch: 'ب', sourceText: '1 7 5 4 0 3 2 + 2 1 □ 9 1 2 □ = 3 8 8 3 1 5 3', expectedAnswer: '2,1' },
      { id: 'p41-q04-c', branch: 'ج', sourceText: '5 3 2 1 4 1 7 + □ 1 4 □ 3 2 1 = 7 4 7 0 7 3 8', expectedAnswer: '2,9' },
    ],
  },
  {
    id: 'p41-q05', number: 5, page: 41,
    originalPrompt: 'في الشكل المجاور: ABCD وXYZD متوازيا الأضلاع فيهما: AB = 7cm وBC = 2cm، وXY = 3cm وYZ = 4cm. أوجد طول كل من [ZC] و[AD] و[DX].',
    platformExplanation: 'استعمل خواص متوازي الأضلاع لإيجاد الأضلاع المقابلة أولاً. على القطعة [DC] تقع النقاط بالترتيب D ثم Z ثم C، لذلك يمكن إيجاد [ZC] بطرح [DZ] من [DC]. لا تستنتج الأطوال من ميل الرسم أو مظهره.',
    visualAssetIds: ['p41-q5-two-parallelograms'],
    tasks: [
      { id: 'p41-q05-zc', referenceLabel: '[ZC]', sourceText: '[ZC]', expectedAnswer: '4 cm' },
      { id: 'p41-q05-ad', referenceLabel: '[AD]', sourceText: '[AD]', expectedAnswer: '2 cm' },
      { id: 'p41-q05-dx', referenceLabel: '[DX]', sourceText: '[DX]', expectedAnswer: '4 cm' },
    ],
  },
  {
    id: 'p41-q06', number: 6, page: 41,
    originalPrompt: 'في الاقتصاد:',
    sourceContext: 'أول مصفاة لتكرير النفط في سورية أنشئت في حمص عام 1959.',
    platformExplanation: 'عند التقريب إلى أقرب مليون، قارن العدد بمنتصف المسافة بين مليون ومليونيْن، أي 1,500,000. وللترتيب التصاعدي قارن قيم الإنتاج نفسها، لا ترتيب السنوات.',
    visualAssetIds: ['p41-q6-fuel-production-table'],
    tasks: [
      { id: 'p41-q06-a', branch: 'أ', sourceText: 'قرّب إلى أقرب مليون إنتاج البنزين سنة 2004', expectedAnswer: '1 000 000 طن' },
      { id: 'p41-q06-b', branch: 'ب', sourceText: 'رتّب إنتاج المصفاة خلال هذه الأعوام الأربعة تصاعدياً.', expectedAnswer: '2005، 2007، 2004، 2006' },
    ],
  },
  {
    id: 'p42-q07', number: 7, page: 42,
    originalPrompt: 'ارسم كل زاوية واكتب اسمها على الرسم حسب ما يأتي:',
    platformExplanation: 'رأس الزاوية هو الحرف الأوسط في اسمها. ضع مركز المنقلة على هذا الرأس، واجعل خط الصفر منطبقاً على أحد الضلعين، ثم علّم القياس وارسم الضلع الآخر واكتب الحروف بالترتيب الصحيح.',
    visualAssetIds: [],
    tasks: [
      { id: 'p42-q07-hur', referenceLabel: '∠HUR', sourceText: '∠HUR = 93°', expectedAnswer: '93°' },
      { id: 'p42-q07-mnh', referenceLabel: '∠MNH', sourceText: '∠MNH = 48°', expectedAnswer: '48°' },
      { id: 'p42-q07-acd', referenceLabel: '∠ACD', sourceText: '∠ACD = 175°', expectedAnswer: '175°' },
    ],
  },
  {
    id: 'p42-q08', number: 8, page: 42,
    originalPrompt: 'ضع (صح) أو (خطأ) أمام كل عبارة مما يأتي:',
    platformExplanation: 'افحص كل جملة وحدها. ميّز بين خاصية صحيحة لكل متوازي أضلاع وبين خاصية لا تتحقق إلا في بعض متوازيات الأضلاع، مثل المعيّن أو المربع.',
    visualAssetIds: [],
    tasks: [
      { id: 'p42-q08-a', branch: 'أ', sourceText: 'إذا تساوت أطوال أضلاع رباعي فإنه يكون متوازي الأضلاع.', expectedAnswer: 'صح' },
      { id: 'p42-q08-b', branch: 'ب', sourceText: 'في متوازي الأضلاع كل زاويتين متقابلتين لهما القياس نفسه.', expectedAnswer: 'صح' },
      { id: 'p42-q08-c', branch: 'ج', sourceText: 'زوايا المعين لها القياس نفسه.', expectedAnswer: 'خطأ' },
      { id: 'p42-q08-d', branch: 'د', sourceText: 'متوازي الأضلاع هو معين.', expectedAnswer: 'خطأ' },
    ],
  },
  {
    id: 'p42-q09', number: 9, page: 42,
    originalPrompt: 'ارسم معيناً ABCD طول ضلعه 4cm وفيه B̂ = 60°.',
    platformExplanation: 'ابدأ بزاوية B والضلعين المتجاورين AB وBC، ثم أكمل متوازي أضلاع برسم أضلاع موازية. تساوي ضلعين متجاورين في متوازي الأضلاع يجعل الأضلاع الأربعة متساوية، وهو شرط المعيّن.',
    visualAssetIds: [],
    tasks: [
      { id: 'p42-q09-main', referenceLabel: 'إنشاء المعين ABCD', sourceText: 'ABCD، طول الضلع 4cm، وB̂ = 60°', expectedAnswer: 'AB = BC = CD = DA = 4cm، و∠B = 60°' },
    ],
  },
  {
    id: 'p42-q10', number: 10, page: 42,
    originalPrompt: 'ارسم متوازي الأضلاع XYZW فيه: Ŵ = 100°، XW = 5cm، XY = 4cm.',
    platformExplanation: 'في الشكل XYZW تكون الرؤوس متتالية بهذا الترتيب. ارسم أولاً الضلع XW، ثم الزاوية عند W والضلع WZ؛ بعد ذلك أكمل الشكل باستعمال مستقيمين متوازيين. في متوازي الأضلاع يتساوى كل ضلعين متقابلين.',
    visualAssetIds: [],
    tasks: [
      { id: 'p42-q10-main', referenceLabel: 'إنشاء متوازي الأضلاع XYZW', sourceText: 'XYZW، Ŵ = 100°، XW = 5cm، XY = 4cm', expectedAnswer: 'WX = YZ = 5cm، وXY = WZ = 4cm، و∠W = 100°.' },
    ],
  },
  {
    id: 'p42-q11', number: 11, page: 42,
    originalPrompt: 'التمثيل البياني الآتي يبين العلاقة بين تغيرات درجة الحرارة والارتفاع عن سطح البحر:',
    platformExplanation: 'لقراءة قيمة من الخط، حدّد الارتفاع على المحور الأفقي، واصعد إلى الخط، ثم اقرأ درجة الحرارة من المحور الشاقولي. وحدة الارتفاع غير مذكورة في الرسم المطبوع، لذلك نستخدم أعداد التدريج فقط من دون افتراض وحدة.',
    visualAssetIds: ['p42-q11-temperature-line-graph', 'p42-q11-temperature-table'],
    tasks: [
      { id: 'p42-q11-a', branch: 'أ', sourceText: 'املأ الجدول الآتي الموافق للتمثيل البياني السابق:', expectedAnswer: '800↦10°، 400↦30°، 300↦40°' },
      { id: 'p42-q11-b', branch: 'ب', sourceText: 'هل درجة الحرارة تزداد أم تتناقص كلما ارتفعنا عن سطح البحر؟', expectedAnswer: 'تتناقص' },
      { id: 'p42-q11-c', branch: 'ج', sourceText: 'ما الارتفاع الذي تكون فيه درجة الحرارة 25° تقريباً؟', expectedAnswer: '500' },
    ],
  },
  {
    id: 'p43-q12', number: 12, page: 43,
    originalPrompt: 'المخطط الآتي يبين عدد زوار المكتبة خلال الأعوام 2011 حتى 2016:',
    platformExplanation: 'اقرأ قيمة الخط عند كل سنة على المحور الأفقي، ثم انقل السنوات والقيم إلى صفّي الجدول. المحور الشاقولي يقيس عدد الزوار بالآلاف، لذلك قيمة 10 تعني 10 آلاف زائر.',
    visualAssetIds: ['p43-q12-library-line-graph', 'p43-q12-library-table'],
    tasks: [
      { id: 'p43-q12-main', referenceLabel: 'إكمال جدول الأعوام وعدد الزوار بالآلاف', sourceText: 'املأ الجدول الآتي الموافق للتمثيل البياني السابق:', expectedAnswer: '2011:10، 2012:5، 2013:15، 2014:20، 2015:15، 2016:20 ألف زائر' },
    ],
  },
] as const satisfies readonly UnitOneBookExercise[]

export type UnitOneExerciseId = (typeof unitOneBookExercises)[number]['id']
export type UnitOneExerciseTaskId = (typeof unitOneBookExercises)[number]['tasks'][number]['id']

export const coordinateMatchOptions = ['(4,0)', '(5,2)', '(0,4)', '(2,5)'] as const

export const fuelProductionRows = [
  { year: 2004, productionTons: 1_342_552 },
  { year: 2005, productionTons: 1_214_244 },
  { year: 2006, productionTons: 1_344_826 },
  { year: 2007, productionTons: 1_220_219 },
] as const

export const columnAdditionExercises = [
  { id: 'p41-q04-a', branch: 'أ', top: ['4', '3', '2', '4', '4', '1', '5'], bottom: ['2', '1', '3', '', '5', '3', ''], result: ['6', '4', '5', '5', '9', '4', '8'], missing: ['1', '3'] },
  { id: 'p41-q04-b', branch: 'ب', top: ['1', '7', '5', '4', '0', '3', '2'], bottom: ['2', '1', '', '9', '1', '2', ''], result: ['3', '8', '8', '3', '1', '5', '3'], missing: ['2', '1'] },
  { id: 'p41-q04-c', branch: 'ج', top: ['5', '3', '2', '1', '4', '1', '7'], bottom: ['', '1', '4', '', '3', '2', '1'], result: ['7', '4', '7', '0', '7', '3', '8'], missing: ['2', '9'] },
] as const

export const temperatureGraphData = {
  xMinimum: 200,
  xMaximum: 800,
  xTicks: [300, 400, 500, 600, 700, 800],
  yMinimum: 0,
  yMaximum: 50,
  yStep: 10,
  points: [{ x: 300, y: 40 }, { x: 400, y: 30 }, { x: 800, y: 10 }],
} as const

export const libraryVisitorData = [
  { year: 2011, visitorsThousands: 10 },
  { year: 2012, visitorsThousands: 5 },
  { year: 2013, visitorsThousands: 15 },
  { year: 2014, visitorsThousands: 20 },
  { year: 2015, visitorsThousands: 15 },
  { year: 2016, visitorsThousands: 20 },
] as const
