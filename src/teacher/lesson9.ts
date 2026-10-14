import type { TeacherEntry } from './types'
import {
  compareNaturalNumbersBookElements,
  compareNaturalNumbersLessonId,
} from '../lessons/compareNaturalNumbersData'

/**
 * Complete Teacher Area companion for every printed item on pp. 44–47.
 * The source ledger is authoritative for page, wording, answer, and working; this adapter makes
 * the teacher's givens/goal/rule/reasoning/check/error explicit in the existing shared view.
 */
export const lessonNineBookTeacherEntries: TeacherEntry[] = compareNaturalNumbersBookElements.map(element => ({
  id: element.id,
  title: element.title,
  prompt: element.kind === 'task'
    ? `${element.prompt}${element.branch ? ` (${element.branch})` : ''} ${element.sourceText ?? ''}`.trim()
    : element.prompt,
  answer: element.answer,
  reasoning: [
    `المعطيات: ${element.given}`,
    `المطلوب: ${element.required}`,
    `القاعدة المستعملة: ${element.rule}`,
    `لماذا تنطبق هنا: ${element.why}`,
    'طريقة البدء: حدّد عدد الخانات أولاً؛ وإن تساوى العدد، ابدأ من المنزلة الأعلى قيمةً على اليسار.',
    ...element.reasoning.map((step, index) => `الخطوة ${index + 1}: ${step}`),
    `الإجابة النهائية: ${element.answer}`,
    `التحقّق: ${element.verification}`,
    `خطأ شائع يجب تجنّبه: ${element.pitfall}`,
  ],
  source: { type: 'textbook', page: element.page },
  note: [
    `القسم: ${element.section}.`,
    element.branch ? `موضع العنصر: الفرع ${element.branch}.` : '',
    element.visualAssetIds.length ? `الرسم/الجدول المعاد بناؤه: ${element.visualAssetIds.join('، ')}.` : '',
    'تميّز هذه الإجابة بين نص الكتاب وشرح المنصة؛ لا تُنسب الإضافة التفسيرية إلى المصدر.',
  ].filter(Boolean).join(' '),
}))

export const lessonNinePlatformTeacherEntries: TeacherEntry[] = [
  {
    id: 'l9-platform-compare-lab',
    title: 'مختبر المقارنة: خانات العدد وأول اختلاف',
    prompt: 'يختار الطالب عددين طبيعيين حتى الملايين ويشرح البرنامج طريقة المقارنة بعد الضغط على «حلّل المقارنة».',
    answer: 'إذا اختلف عدد الخانات فالأكثر خانات هو الأكبر؛ وإذا تساوت، فأول اختلاف من اليسار يحسم العلاقة؛ وإذا لم يختلفا فهما متساويان.',
    reasoning: [
      'المعطيات: عددان يدخلهما الطالب في حقلي المختبر، بحد أقصى سبع خانات لكل عدد.',
      'المطلوب: مقارنة العددين وتحديد منزلة أول اختلاف أو بيان التساوي.',
      'القاعدة المستعملة: عدد الخانات أولاً، ثم القيمة المكانية من اليسار إلى اليمين.',
      'لماذا تنطبق هنا: المدخلات أعداد طبيعية، وترتيب الخانات فيها يحدد مقدار العدد.',
      'طريقة البدء: تحقّق من أن المدخلين غير فارغين، ثم احذف فواصل التنسيق لأغراض الحساب فقط.',
      'الخطوة 1: احسب طول كل كتابة رقمية؛ إذا اختلف الطول فالأطول أكبر.',
      'الخطوة 2: إذا تساوى الطول فقارن الخانات المتناظرة من اليسار وتوقف عند أول اختلاف.',
      'الخطوة 3: اعرض الرمز < أو > أو = مع اسم المنزلة التي حسمت المقارنة.',
      'الإجابة النهائية: النتيجة المحسوبة من العددين المدخلين، لا من مثال ثابت.',
      'التحقّق: أعد إدخال العددين مع تبديل موضعيهما؛ يجب أن تنعكس < و> ويبقى = كما هو.',
      'خطأ شائع يجب تجنّبه: مقارنة السلاسل النصية أو البدء من الآحاد بدلاً من مقارنة القيمة العددية.',
    ],
    source: { type: 'platform' },
    note: 'نشاط إثرائي جديد من إعداد المنصة؛ لا يُعدّ سؤالاً مطبوعاً ولا يدخل في عدّ تغطية الكتاب.',
  },
  {
    id: 'l9-platform-sort-lab',
    title: 'مختبر ترتيب البطاقات',
    prompt: 'يرتّب الطالب أربع بطاقات أعداد باستخدام أزرار النقل لأعلى/لأسفل ثم يتحقق من اتجاه الترتيب المختار.',
    answer: 'ترتيب صحيح بحسب الخيار: تصاعدي من الأصغر إلى الأكبر، أو تنازلي من الأكبر إلى الأصغر.',
    reasoning: [
      'المعطيات: أربع بطاقات أعداد طبيعية، واتجاه ترتيب يختاره الطالب.',
      'المطلوب: تنظيم كل البطاقات مع المحافظة على كل عدد مرة واحدة.',
      'القاعدة المستعملة: ترتيب زوجي متجاور بعد مقارنة كل عددين بحسب عدد الخانات وأول اختلاف.',
      'لماذا تنطبق هنا: إذا كان كل زوج متجاور بالاتجاه المطلوب، كانت القائمة كلها مرتبة.',
      'طريقة البدء: انقل أصغر بطاقة إلى البداية في التصاعدي، أو أكبر بطاقة في التنازلي.',
      'الخطوة 1: استخدم «قدّم» و«أخّر» لنقل البطاقة المختارة، لا السحب وحده، ليبقى التفاعل صالحاً بلوحة المفاتيح.',
      'الخطوة 2: افحص كل زوج متجاور ابتداءً من اليسار.',
      'الخطوة 3: اضغط تحقق؛ عند الخطأ يعاد الطالب إلى المقارنة من المنزلة الأعلى.',
      'الإجابة النهائية: القائمة المحدّثة التي تحقق الاتجاه المختار.',
      'التحقّق: في التصاعدي يكون كل عنصر أصغر من التالي؛ وفي التنازلي يكون كل عنصر أكبر من التالي.',
      'خطأ شائع يجب تجنّبه: قلب معنى التصاعدي والتنازلي أو إسقاط بطاقة أثناء النقل.',
    ],
    source: { type: 'platform' },
    note: 'نشاط إثرائي جديد من إعداد المنصة؛ لا ينوب عن أي سؤال مطبوع في الصفحات 44–47.',
  },
]

export const lessonNineTeacherEntries: TeacherEntry[] = [
  ...lessonNineBookTeacherEntries,
  ...lessonNinePlatformTeacherEntries,
]

export const lessonNineRequiredSolutionIds = compareNaturalNumbersBookElements.map(element => element.id)
export const lessonNineId = compareNaturalNumbersLessonId
