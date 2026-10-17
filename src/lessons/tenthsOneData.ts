export type TenthsExerciseItem = { id: string; label: string; numerator: number; denominator: 10 }
export type ComparisonExerciseItem = { id: string; label: string; left: string; right: string; relation: '<' | '=' | '>' }
export type CoverageBranch = { id: string; label: string; teacherEntryIds: string[] }
export type CoverageElement = {
  id: string
  page: number
  printedItem: string
  sourceStatus: 'confirmed' | 'partial'
  studentStep: string
  sourceSummary: string
  teacherEntryIds: string[]
  branches: CoverageBranch[]
}

export const lessonTitle = 'الأجزاء العشرية (1)'

export const p62GridItems: TenthsExerciseItem[] = [
  { id: 'l6-p62-ex1-a', label: 'أ', numerator: 3, denominator: 10 },
  { id: 'l6-p62-ex1-b', label: 'ب', numerator: 4, denominator: 10 },
  { id: 'l6-p62-ex1-c', label: 'ج', numerator: 10, denominator: 10 },
]

export const p62ComparisonItems: ComparisonExerciseItem[] = [
  { id: 'l6-p62-ex2-a', label: 'أ', left: '3/10', right: '1', relation: '<' },
  { id: 'l6-p62-ex2-b', label: 'ب', left: '10/10', right: '1', relation: '=' },
  { id: 'l6-p62-ex2-c', label: 'ج', left: '4/10', right: '3/10', relation: '>' },
]

export const p63ExampleItems: TenthsExerciseItem[] = [
  { id: 'l6-p63-example-1', label: 'واحد من عشرة', numerator: 1, denominator: 10 },
  { id: 'l6-p63-example-4', label: 'أربعة من عشرة', numerator: 4, denominator: 10 },
  { id: 'l6-p63-example-8', label: 'ثمانية من عشرة', numerator: 8, denominator: 10 },
]

export const p63CheckOneItems: TenthsExerciseItem[] = [
  { id: 'l6-p63-check1-body', label: 'من وزن الجسم', numerator: 6, denominator: 10 },
  { id: 'l6-p63-check1-earth', label: 'من سطح الأرض', numerator: 7, denominator: 10 },
]

export const p63CheckThreeItems: TenthsExerciseItem[] = [
  { id: 'l6-p63-check3-a', label: 'أ', numerator: 7, denominator: 10 },
  { id: 'l6-p63-check3-b', label: 'ب', numerator: 5, denominator: 10 },
]

export const p64ComparisonItems: ComparisonExerciseItem[] = [
  { id: 'l6-p64-ex1-a', label: 'أ', left: '0.1', right: '0.3', relation: '<' },
  { id: 'l6-p64-ex1-b', label: 'ب', left: '0.5', right: '0.6', relation: '<' },
  { id: 'l6-p64-ex1-c', label: 'ج', left: '0.8', right: '0.4', relation: '>' },
  { id: 'l6-p64-ex1-d', label: 'د', left: '0.5', right: '5/10', relation: '=' },
]

export const p64NumberLineValues = [0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9] as const

export const p64TableColumns = [
  { id: 'l6-p64-table-col1', printedFraction: '', printedDecimal: '0.7', answerFraction: '7/10', answerDecimal: '0.7' },
  { id: 'l6-p64-table-col2', printedFraction: '', printedDecimal: '0.1', answerFraction: '1/10', answerDecimal: '0.1' },
  { id: 'l6-p64-table-col3', printedFraction: '', printedDecimal: '0.5', answerFraction: '5/10', answerDecimal: '0.5' },
  { id: 'l6-p64-table-col4', printedFraction: '2/10', printedDecimal: '', answerFraction: '2/10', answerDecimal: '0.2' },
  { id: 'l6-p64-table-col5', printedFraction: '6/10', printedDecimal: '', answerFraction: '6/10', answerDecimal: '0.6' },
  { id: 'l6-p64-table-col6', printedFraction: '3/10', printedDecimal: '', answerFraction: '3/10', answerDecimal: '0.3' },
] as const

export const p65RulerItems = [
  { id: 'l6-p65-q3-a', label: 'أ', tenths: 9 },
  { id: 'l6-p65-q3-b', label: 'ب', tenths: 4 },
  { id: 'l6-p65-q3-c', label: 'ج', tenths: 7 },
  { id: 'l6-p65-q3-d', label: 'د', tenths: 5 },
] as const

/** The source figures have no printed letter labels; identify them by their left-to-right positions. */
export const p65ShadingItems = [
  { id: 'l6-p65-q4-left', position: 'الشكل الأيسر', decimal: '0.9', tenths: 9, orientation: 'vertical' },
  { id: 'l6-p65-q4-middle', position: 'الشكل الأوسط', decimal: '0.2', tenths: 2, orientation: 'horizontal' },
  { id: 'l6-p65-q4-right', position: 'الشكل الأيمن', decimal: '0.7', tenths: 7, orientation: 'horizontal' },
] as const

export const p65VerbalItems = [
  { id: 'l6-p65-q5-a', label: 'أ', numeral: 1, verbal: 'واحد بالعشرة' },
  { id: 'l6-p65-q5-b', label: 'ب', numeral: 5, verbal: 'خمسة بالعشرة' },
  { id: 'l6-p65-q5-c', label: 'ج', numeral: 2, verbal: 'اثنان بالعشرة' },
  { id: 'l6-p65-q5-d', label: 'د', numeral: 6, verbal: 'ستة بالعشرة' },
] as const

export const p65ComparisonItems: ComparisonExerciseItem[] = [
  { id: 'l6-p65-q6-a', label: 'أ', left: '0.4', right: '0.1', relation: '>' },
  { id: 'l6-p65-q6-b', label: 'ب', left: '0.2', right: '0.3', relation: '<' },
  { id: 'l6-p65-q6-c', label: 'ج', left: '0.5', right: '0.9', relation: '<' },
  { id: 'l6-p65-q6-d', label: 'د', left: '4/10', right: '0.4', relation: '=' },
  { id: 'l6-p65-q6-e', label: 'هـ', left: '0.3', right: '3/10', relation: '=' },
  { id: 'l6-p65-q6-f', label: 'و', left: '1', right: '0.2', relation: '>' },
]

export const p65MatchDecimals = [
  { id: 'l6-p65-q8-decimal-03', value: '0.3' },
  { id: 'l6-p65-q8-decimal-04', value: '0.4' },
  { id: 'l6-p65-q8-decimal-05', value: '0.5' },
  { id: 'l6-p65-q8-decimal-06', value: '0.6' },
] as const

export const p65MatchFractions = [
  { id: 'l6-p65-q8-fraction-5-10', value: '5/10' },
  { id: 'l6-p65-q8-fraction-3-5', value: '3/5' },
  { id: 'l6-p65-q8-fraction-9-30', value: '9/30' },
  { id: 'l6-p65-q8-fraction-16-40', value: '16/40' },
] as const

/**
 * Page-level source coverage: 25 audited blocks, with each printed branch/cell given its own stable ID.
 * UI anchors and teacher-entry mappings are asserted by scripts/lesson-tenths-one-check.ts.
 */
export const lesson6SourceCoverage: CoverageElement[] = [
  { id: 'l6-p62-title', page: 62, printedItem: 'عنوان الدرس وأهدافه', sourceStatus: 'confirmed', studentStep: 'الخطوة 1 · اكتشف الأجزاء من عشرة', sourceSummary: 'العنوان «الأجزاء العشرية (1)» وهدف الكتابة العشرية واللفظية والمقارنة.', teacherEntryIds: ['t-l6-p62-title'], branches: [] },
  { id: 'l6-p62-discover', page: 62, printedItem: 'هل تعلم', sourceStatus: 'confirmed', studentStep: 'الخطوة 1 · اكتشف الأجزاء من عشرة', sourceSummary: 'الماء يقارب 6/10 من وزن الجسم و7/10 من سطح الأرض.', teacherEntryIds: [], branches: [
    { id: 'l6-p62-fact-body', label: '6/10 من وزن الجسم', teacherEntryIds: ['t-l6-p62-fact-body'] },
    { id: 'l6-p62-fact-earth', label: '7/10 من سطح الأرض', teacherEntryIds: ['t-l6-p62-fact-earth'] },
  ] },
  { id: 'l6-p62-cube', page: 62, printedItem: 'انطلاقة نشطة · شكل المكعب', sourceStatus: 'confirmed', studentStep: 'الخطوة 1 · اكتشف الأجزاء من عشرة', sourceSummary: 'المجسم مقسّم إلى عشر شرائح متساوية.', teacherEntryIds: ['t-l6-p62-cube'], branches: [] },
  { id: 'l6-p62-ex1', page: 62, printedItem: 'التمرين 1 · شبكات الأجزاء الملوّنة', sourceStatus: 'confirmed', studentStep: 'الخطوة 4 · تحقّق من فهمك (ص62–63)', sourceSummary: 'المقام المطبوع 10؛ الرسوم (أ، ب، ج) تلوّن 3 و4 و10 شرائح زرقاء.', teacherEntryIds: [], branches: [
    { id: 'l6-p62-ex1-a', label: '(أ) ثلاث شرائح من عشر', teacherEntryIds: ['t-l6-p62-ex1-a'] },
    { id: 'l6-p62-ex1-b', label: '(ب) أربع شرائح من عشر', teacherEntryIds: ['t-l6-p62-ex1-b'] },
    { id: 'l6-p62-ex1-c', label: '(ج) عشر شرائح من عشر', teacherEntryIds: ['t-l6-p62-ex1-c'] },
  ] },
  { id: 'l6-p62-ex2', page: 62, printedItem: 'التمرين 2 · المقارنة', sourceStatus: 'confirmed', studentStep: 'الخطوة 4 · تحقّق من فهمك (ص62–63)', sourceSummary: 'ثلاث مقارنات مطبوعة ومربعاتها فارغة.', teacherEntryIds: [], branches: [
    { id: 'l6-p62-ex2-a', label: '(أ) 3/10 و1', teacherEntryIds: ['t-l6-p62-ex2-a'] },
    { id: 'l6-p62-ex2-b', label: '(ب) 10/10 و1', teacherEntryIds: ['t-l6-p62-ex2-b'] },
    { id: 'l6-p62-ex2-c', label: '(ج) 4/10 و3/10', teacherEntryIds: ['t-l6-p62-ex2-c'] },
  ] },
  { id: 'l6-p62-definition', page: 62, printedItem: 'تعريف الأجزاء من عشرة', sourceStatus: 'confirmed', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: 'كسر مقامه 10 وبسطه أحد الأعداد من 1 إلى 9.', teacherEntryIds: ['t-l6-p62-definition'], branches: [] },
  { id: 'l6-p63-decimal-model', page: 63, printedItem: 'تتمة التعريف ومخطط 0.□', sourceStatus: 'confirmed', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: 'الكتابة العشرية المبسطة؛ الصفر والفاصلة العشرية وخانة عدد الأجزاء من عشرة.', teacherEntryIds: ['t-l6-p63-decimal-model'], branches: [] },
  { id: 'l6-p63-examples', page: 63, printedItem: 'مثال الكسور والكتابة العشرية واللفظية والشبكات', sourceStatus: 'confirmed', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: '1/10 ↔ 0.1، 4/10 ↔ 0.4، 8/10 ↔ 0.8 مع العبارات اللفظية والشبكات وخطوط الأعداد الصغيرة.', teacherEntryIds: [], branches: [
    { id: 'l6-p63-example-1', label: '1/10 و0.1', teacherEntryIds: ['t-l6-p63-example-1'] },
    { id: 'l6-p63-example-4', label: '4/10 و0.4', teacherEntryIds: ['t-l6-p63-example-4'] },
    { id: 'l6-p63-example-8', label: '8/10 و0.8', teacherEntryIds: ['t-l6-p63-example-8'] },
  ] },
  { id: 'l6-p63-ten-tenths', page: 63, printedItem: 'رسم عشرة أجزاء من عشرة', sourceStatus: 'confirmed', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: 'كل عشرة أجزاء من عشرة تعادل واحداً كاملاً؛ الرسم يعرض شريطاً كاملاً وشبكة من عشرة أجزاء.', teacherEntryIds: ['t-l6-p63-ten-tenths'], branches: [] },
  { id: 'l6-p63-decimal-note', page: 63, printedItem: 'ملاحظة الفاصلة العشرية', sourceStatus: 'partial', studentStep: 'الخطوة 2 · من الكسر إلى الكتابة العشرية', sourceSummary: 'المعنى والأمثلة مؤكدان؛ هوية المحرف الطباعي الصغير داخل القوسين غير محسومة.', teacherEntryIds: ['t-l6-p63-decimal-note'], branches: [] },
  { id: 'l6-p63-check1', page: 63, printedItem: 'تحقّق من فهمك 1 · كتابة فقرة هل تعلم عشرية ولفظية', sourceStatus: 'confirmed', studentStep: 'الخطوة 4 · تحقّق من فهمك (ص62–63)', sourceSummary: 'العودة إلى مقدمة الدرس: 6/10 من وزن الجسم و7/10 من سطح الأرض.', teacherEntryIds: [], branches: [
    { id: 'l6-p63-check1-body', label: '6/10: الكتابة العشرية واللفظية', teacherEntryIds: ['t-l6-p63-check1-body'] },
    { id: 'l6-p63-check1-earth', label: '7/10: الكتابة العشرية واللفظية', teacherEntryIds: ['t-l6-p63-check1-earth'] },
  ] },
  { id: 'l6-p63-check2', page: 63, printedItem: 'تحقّق من فهمك 2 · العدد 0.9', sourceStatus: 'confirmed', studentStep: 'الخطوة 4 · تحقّق من فهمك (ص62–63)', sourceSummary: 'اكتب العدد 0.9 لفظياً ثم اكتب كسراً مكافئاً مقامه 10.', teacherEntryIds: [], branches: [
    { id: 'l6-p63-check2-verbal', label: 'تعبير 0.9 لفظياً', teacherEntryIds: ['t-l6-p63-check2'] },
    { id: 'l6-p63-check2-fraction', label: 'كسر مكافئ مقامه 10', teacherEntryIds: ['t-l6-p63-check2'] },
  ] },
  { id: 'l6-p63-check3', page: 63, printedItem: 'تحقّق من فهمك 3 · تحويل كسرين', sourceStatus: 'confirmed', studentStep: 'الخطوة 4 · تحقّق من فهمك (ص62–63)', sourceSummary: 'اكتب 7/10 و5/10 كتابة عشرية.', teacherEntryIds: [], branches: [
    { id: 'l6-p63-check3-a', label: '7/10', teacherEntryIds: ['t-l6-p63-check3-a'] },
    { id: 'l6-p63-check3-b', label: '5/10', teacherEntryIds: ['t-l6-p63-check3-b'] },
  ] },
  { id: 'l6-p64-example1', page: 64, printedItem: 'المثال الأول في المقارنة', sourceStatus: 'confirmed', studentStep: 'الخطوة 3 · قارن الأجزاء من عشرة', sourceSummary: 'المثال يقارن 0.8 و0.5، ويعرض 5/10 < 8/10 ثم 0.5 < 0.8.', teacherEntryIds: ['t-l6-p64-example1'], branches: [] },
  { id: 'l6-p64-rule', page: 64, printedItem: 'ملاحظة قاعدة المقارنة عند تساوي المقامين', sourceStatus: 'confirmed', studentStep: 'الخطوة 3 · قارن الأجزاء من عشرة', sourceSummary: 'عند تساوي المقامين نقارن البسطين.', teacherEntryIds: ['t-l6-p64-rule'], branches: [] },
  { id: 'l6-p64-example2', page: 64, printedItem: 'المثال الثاني في الكسور المكافئة', sourceStatus: 'confirmed', studentStep: 'الخطوة 3 · قارن الأجزاء من عشرة', sourceSummary: 'السلسلة المطبوعة 8/20 = 4/10 = 0.4 مع القسمة على 2 للبسط والمقام.', teacherEntryIds: ['t-l6-p64-example2'], branches: [] },
  { id: 'l6-p64-ex1', page: 64, printedItem: 'التمرين 1 · المقارنة (أ–د)', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تمارين المقارنة (ص64)', sourceSummary: '0.1□0.3، 0.5□0.6، 0.8□0.4، 0.5□5/10.', teacherEntryIds: [], branches: [
    { id: 'l6-p64-ex1-a', label: '(أ) 0.1 و0.3', teacherEntryIds: ['t-l6-p64-ex1-a'] },
    { id: 'l6-p64-ex1-b', label: '(ب) 0.5 و0.6', teacherEntryIds: ['t-l6-p64-ex1-b'] },
    { id: 'l6-p64-ex1-c', label: '(ج) 0.8 و0.4', teacherEntryIds: ['t-l6-p64-ex1-c'] },
    { id: 'l6-p64-ex1-d', label: '(د) 0.5 و5/10', teacherEntryIds: ['t-l6-p64-ex1-d'] },
  ] },
  { id: 'l6-p64-numberline', page: 64, printedItem: 'تمرين خط الأعداد من 0 إلى 1', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تمارين المقارنة (ص64)', sourceSummary: 'خطوات الأعشار، مع القيم المطبوعة 0 و0.1 و0.7 و1 وسبع خانات فارغة.', teacherEntryIds: ['t-l6-p64-numberline'], branches: [
    { id: 'l6-p64-numberline-02', label: 'الخانة عند 0.2', teacherEntryIds: ['t-l6-p64-numberline'] },
    { id: 'l6-p64-numberline-03', label: 'الخانة عند 0.3', teacherEntryIds: ['t-l6-p64-numberline'] },
    { id: 'l6-p64-numberline-04', label: 'الخانة عند 0.4', teacherEntryIds: ['t-l6-p64-numberline'] },
    { id: 'l6-p64-numberline-05', label: 'الخانة عند 0.5', teacherEntryIds: ['t-l6-p64-numberline'] },
    { id: 'l6-p64-numberline-06', label: 'الخانة عند 0.6', teacherEntryIds: ['t-l6-p64-numberline'] },
    { id: 'l6-p64-numberline-08', label: 'الخانة عند 0.8', teacherEntryIds: ['t-l6-p64-numberline'] },
    { id: 'l6-p64-numberline-09', label: 'الخانة عند 0.9', teacherEntryIds: ['t-l6-p64-numberline'] },
  ] },
  { id: 'l6-p64-table', page: 64, printedItem: 'تمرين جدول الكسر والكتابة العشرية', sourceStatus: 'confirmed', studentStep: 'الخطوة 5 · تمارين المقارنة (ص64)', sourceSummary: 'صف الكسر: فراغ، فراغ، فراغ، 2/10، 6/10، 3/10؛ الصف العشري: 0.7، 0.1، 0.5، فراغ، فراغ، فراغ.', teacherEntryIds: [], branches: [
    { id: 'l6-p64-table-col1', label: 'العمود 1: 0.7 ↔ فراغ', teacherEntryIds: ['t-l6-p64-table-col1'] },
    { id: 'l6-p64-table-col2', label: 'العمود 2: 0.1 ↔ فراغ', teacherEntryIds: ['t-l6-p64-table-col2'] },
    { id: 'l6-p64-table-col3', label: 'العمود 3: 0.5 ↔ فراغ', teacherEntryIds: ['t-l6-p64-table-col3'] },
    { id: 'l6-p64-table-col4', label: 'العمود 4: 2/10 ↔ فراغ', teacherEntryIds: ['t-l6-p64-table-col4'] },
    { id: 'l6-p64-table-col5', label: 'العمود 5: 6/10 ↔ فراغ', teacherEntryIds: ['t-l6-p64-table-col5'] },
    { id: 'l6-p64-table-col6', label: 'العمود 6: 3/10 ↔ فراغ', teacherEntryIds: ['t-l6-p64-table-col6'] },
  ] },
  { id: 'l6-p65-q3', page: 65, printedItem: 'السؤال 3 · أطوال الخطوط على المسطرة', sourceStatus: 'confirmed', studentStep: 'الخطوة 6 · تطبيقات ص65 (3–5)', sourceSummary: 'نهايات أ، ب، ج، د عند 0.9 و0.4 و0.7 و0.5 على الترتيب.', teacherEntryIds: [], branches: [
    { id: 'l6-p65-q3-a', label: '(أ) 0.9', teacherEntryIds: ['t-l6-p65-q3-a'] },
    { id: 'l6-p65-q3-b', label: '(ب) 0.4', teacherEntryIds: ['t-l6-p65-q3-b'] },
    { id: 'l6-p65-q3-c', label: '(ج) 0.7', teacherEntryIds: ['t-l6-p65-q3-c'] },
    { id: 'l6-p65-q3-d', label: '(د) 0.5', teacherEntryIds: ['t-l6-p65-q3-d'] },
  ] },
  { id: 'l6-p65-q4', page: 65, printedItem: 'السؤال 4 · تظليل ثلاثة أشكال', sourceStatus: 'confirmed', studentStep: 'الخطوة 6 · تطبيقات ص65 (3–5)', sourceSummary: 'الأيسر شبكة عمودية من 10 خلايا، والأوسط والأيمن شبكتان أفقيتان 2×5؛ الأعداد من اليسار 0.9 و0.2 و0.7.', teacherEntryIds: [], branches: [
    { id: 'l6-p65-q4-left', label: 'الشكل الأيسر · 0.9', teacherEntryIds: ['t-l6-p65-q4-left'] },
    { id: 'l6-p65-q4-middle', label: 'الشكل الأوسط · 0.2', teacherEntryIds: ['t-l6-p65-q4-middle'] },
    { id: 'l6-p65-q4-right', label: 'الشكل الأيمن · 0.7', teacherEntryIds: ['t-l6-p65-q4-right'] },
  ] },
  { id: 'l6-p65-q5', page: 65, printedItem: 'السؤال 5 · أعداد مكتوبة لفظياً', sourceStatus: 'confirmed', studentStep: 'الخطوة 6 · تطبيقات ص65 (3–5)', sourceSummary: 'واحد بالعشرة، خمسة بالعشرة، اثنان بالعشرة، ستة بالعشرة.', teacherEntryIds: [], branches: [
    { id: 'l6-p65-q5-a', label: '(أ) واحد بالعشرة', teacherEntryIds: ['t-l6-p65-q5-a'] },
    { id: 'l6-p65-q5-b', label: '(ب) خمسة بالعشرة', teacherEntryIds: ['t-l6-p65-q5-b'] },
    { id: 'l6-p65-q5-c', label: '(ج) اثنان بالعشرة', teacherEntryIds: ['t-l6-p65-q5-c'] },
    { id: 'l6-p65-q5-d', label: '(د) ستة بالعشرة', teacherEntryIds: ['t-l6-p65-q5-d'] },
  ] },
  { id: 'l6-p65-q6', page: 65, printedItem: 'السؤال 6 · المقارنات (أ–و)', sourceStatus: 'confirmed', studentStep: 'الخطوة 7 · تحدي الأعداد والمطابقة (ص65)', sourceSummary: 'ست مقارنات مطبوعة، وكل مربعاتها فارغة.', teacherEntryIds: [], branches: [
    { id: 'l6-p65-q6-a', label: '(أ) 0.4 و0.1', teacherEntryIds: ['t-l6-p65-q6-a'] },
    { id: 'l6-p65-q6-b', label: '(ب) 0.2 و0.3', teacherEntryIds: ['t-l6-p65-q6-b'] },
    { id: 'l6-p65-q6-c', label: '(ج) 0.5 و0.9', teacherEntryIds: ['t-l6-p65-q6-c'] },
    { id: 'l6-p65-q6-d', label: '(د) 4/10 و0.4', teacherEntryIds: ['t-l6-p65-q6-d'] },
    { id: 'l6-p65-q6-e', label: '(هـ) 0.3 و3/10', teacherEntryIds: ['t-l6-p65-q6-e'] },
    { id: 'l6-p65-q6-f', label: '(و) 1 و0.2', teacherEntryIds: ['t-l6-p65-q6-f'] },
  ] },
  { id: 'l6-p65-q7', page: 65, printedItem: 'السؤال 7 · أعط عدداً بين 0.3 و0.7', sourceStatus: 'confirmed', studentStep: 'الخطوة 7 · تحدي الأعداد والمطابقة (ص65)', sourceSummary: 'حدان مفتوحان 0.3 و0.7؛ لا يختار المصدر جواباً بعينه.', teacherEntryIds: ['t-l6-p65-q7'], branches: [] },
  { id: 'l6-p65-q8', page: 65, printedItem: 'السؤال 8 · جدول المطابقة', sourceStatus: 'confirmed', studentStep: 'الخطوة 7 · تحدي الأعداد والمطابقة (ص65)', sourceSummary: 'العمود (أ): 0.3، 0.4، 0.5، 0.6؛ العمود (ب): 5/10، 3/5، 9/30، 16/40. لا توجد وصلات مطبوعة.', teacherEntryIds: [], branches: [
    { id: 'l6-p65-q8-decimal-03', label: 'العمود (أ) · 0.3', teacherEntryIds: ['t-l6-p65-q8-03'] },
    { id: 'l6-p65-q8-decimal-04', label: 'العمود (أ) · 0.4', teacherEntryIds: ['t-l6-p65-q8-04'] },
    { id: 'l6-p65-q8-decimal-05', label: 'العمود (أ) · 0.5', teacherEntryIds: ['t-l6-p65-q8-05'] },
    { id: 'l6-p65-q8-decimal-06', label: 'العمود (أ) · 0.6', teacherEntryIds: ['t-l6-p65-q8-06'] },
    { id: 'l6-p65-q8-fraction-5-10', label: 'العمود (ب) · 5/10', teacherEntryIds: ['t-l6-p65-q8-05'] },
    { id: 'l6-p65-q8-fraction-3-5', label: 'العمود (ب) · 3/5', teacherEntryIds: ['t-l6-p65-q8-06'] },
    { id: 'l6-p65-q8-fraction-9-30', label: 'العمود (ب) · 9/30', teacherEntryIds: ['t-l6-p65-q8-03'] },
    { id: 'l6-p65-q8-fraction-16-40', label: 'العمود (ب) · 16/40', teacherEntryIds: ['t-l6-p65-q8-04'] },
  ] },
]

export const lesson6CoverageTotals = {
  sourceBlocks: lesson6SourceCoverage.length,
  confirmed: lesson6SourceCoverage.filter((element) => element.sourceStatus === 'confirmed').length,
  partial: lesson6SourceCoverage.filter((element) => element.sourceStatus === 'partial').length,
  unresolved: 0,
} as const

export function normalizeNumericGlyphs(value: string): string {
  return value
    .replace(/[٠-٩]/gu, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/gu, (digit) => String(digit.charCodeAt(0) - 0x06f0))
}

export type RationalValue = { numerator: bigint; denominator: bigint }

/** Exact parser for non-negative integer, decimal, or fraction input; avoids floating-point grading. */
export function parseRationalInput(value: string): RationalValue | undefined {
  const normalized = normalizeNumericGlyphs(value).trim().replace(/\u2212/gu, '-')
  const fraction = /^(\d+)\s*\/\s*(\d+)$/u.exec(normalized)
  if (fraction) {
    const numerator = BigInt(fraction[1])
    const denominator = BigInt(fraction[2])
    return denominator > 0n ? { numerator, denominator } : undefined
  }
  const decimal = /^(\d+)(?:[.٫,](\d+))?$/u.exec(normalized)
  if (!decimal) return undefined
  const places = decimal[2]?.length ?? 0
  const denominator = 10n ** BigInt(places)
  const whole = BigInt(decimal[1])
  const fractional = decimal[2] ? BigInt(decimal[2]) : 0n
  return { numerator: whole * denominator + fractional, denominator }
}

export function isEquivalentToTenths(value: string, numerator: number): boolean {
  const parsed = parseRationalInput(value)
  return Boolean(parsed && parsed.numerator * 10n === BigInt(numerator) * parsed.denominator)
}

export function isDecimalEquivalentToTenths(value: string, numerator: number): boolean {
  const normalized = normalizeNumericGlyphs(value).trim()
  return /[.٫,]/u.test(normalized) && isEquivalentToTenths(normalized, numerator)
}

export function isTenthsFractionInput(value: string, numerator: number): boolean {
  const normalized = normalizeNumericGlyphs(value).trim()
  const fraction = /^(\d+)\s*\/\s*(\d+)$/u.exec(normalized)
  return Boolean(fraction && Number(fraction[1]) === numerator && Number(fraction[2]) === 10)
}

export function compareRationalValues(left: string, right: string): -1 | 0 | 1 | undefined {
  const leftValue = parseRationalInput(left)
  const rightValue = parseRationalInput(right)
  if (!leftValue || !rightValue) return undefined
  const difference = leftValue.numerator * rightValue.denominator - rightValue.numerator * leftValue.denominator
  return difference < 0n ? -1 : difference > 0n ? 1 : 0
}

export function isStrictlyBetweenTenths(value: string, lowerTenths: number, upperTenths: number): boolean {
  const parsed = parseRationalInput(value)
  if (!parsed) return false
  return parsed.numerator * 10n > BigInt(lowerTenths) * parsed.denominator
    && parsed.numerator * 10n < BigInt(upperTenths) * parsed.denominator
}

export function normalizeArabicAnswer(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/[\u064b-\u065f\u0670\u0640]/gu, '')
    .replace(/[أإآٱ]/gu, 'ا')
    .replace(/ؤ/gu, 'و')
    .replace(/ئ/gu, 'ي')
    .replace(/ة/gu, 'ه')
    .replace(/[ًٌٍَُِّْـ]/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/gu, ' ')
}

const verbalForms: Readonly<Record<number, readonly string[]>> = {
  1: ['جزء واحد من عشرة', 'واحد من عشرة', 'واحد بالعشرة', 'واحد من العشرة', 'عشر واحد'],
  2: ['جزآن من عشرة', 'جزئين من عشرة', 'اثنان من عشرة', 'اثنين من عشرة', 'اثنان بالعشرة', 'اثنان من العشرة', 'عشران'],
  3: ['ثلاثة أجزاء من عشرة', 'ثلاثة من عشرة', 'ثلاثة بالعشرة', 'ثلاثة من العشرة', 'ثلاثة أعشار', 'ثلاث اعشار'],
  4: ['أربعة أجزاء من عشرة', 'أربعة من عشرة', 'أربعة بالعشرة', 'أربعة من العشرة', 'أربعة أعشار', 'اربع اعشار'],
  5: ['خمسة أجزاء من عشرة', 'خمسة من عشرة', 'خمسة بالعشرة', 'خمسة من العشرة', 'خمسة أعشار', 'خمس اعشار'],
  6: ['ستة أجزاء من عشرة', 'ستة من عشرة', 'ستة بالعشرة', 'ستة من العشرة', 'ستة أعشار', 'ست اعشار'],
  7: ['سبعة أجزاء من عشرة', 'سبعة من عشرة', 'سبعة بالعشرة', 'سبعة من العشرة', 'سبعة أعشار', 'سبع اعشار'],
  8: ['ثمانية أجزاء من عشرة', 'ثمانية من عشرة', 'ثمانية بالعشرة', 'ثمانية من العشرة', 'ثمانية أعشار', 'ثمان اعشار'],
  9: ['تسعة أجزاء من عشرة', 'تسعة من عشرة', 'تسعة بالعشرة', 'تسعة من العشرة', 'تسعة أعشار', 'تسع اعشار'],
}

export function isAcceptedVerbalTenths(value: string, numerator: number): boolean {
  const answer = normalizeArabicAnswer(value)
  return (verbalForms[numerator] ?? []).some((form) => normalizeArabicAnswer(form) === answer)
}

export function isNaturalValue(value: string, expected: number): boolean {
  const normalized = normalizeNumericGlyphs(value).trim()
  return /^\d+$/u.test(normalized) && Number(normalized) === expected
}

export function decimalForTenths(numerator: number): string {
  return numerator === 10 ? '1' : `0.${numerator}`
}

export function fractionForTenths(numerator: number): string {
  return `${numerator}/10`
}

export function flattenCoverageIds(elements: readonly CoverageElement[] = lesson6SourceCoverage): string[] {
  return elements.flatMap((element) => [element.id, ...element.branches.map((branch) => branch.id)])
}
