import type { TeacherEntry } from './types'
import {
  fractionsOneBookElements,
  fractionsOneLessonId,
  fractionsOneVisualInventory,
} from '../lessons/fractionsOneData'

const visualById = new Map(fractionsOneVisualInventory.map((visual) => [visual.id, visual]))

/** Every inventoried textbook element, including instructions and each labelled branch, has its own solution. */
export const lessonTwelveBookTeacherEntries: TeacherEntry[] = fractionsOneBookElements.map((element) => ({
  id: element.id,
  title: element.title,
  prompt: element.kind === 'task'
    ? `${element.prompt}${element.branch ? ` ${element.branch}` : ''}${element.sourceText ? ` ${element.sourceText}` : ''}`.trim()
    : element.prompt,
  answer: element.answer,
  reasoning: [
    `المعطيات كما في المصدر: ${element.given}`,
    `المطلوب: ${element.required}`,
    `القاعدة: ${element.rule}`,
    `سبب ملاءمة القاعدة: ${element.why}`,
    ...element.reasoning.map((step, index) => `الخطوة ${index + 1}: ${step}`),
    ...element.visualAssetIds.map((id) => {
      const visual = visualById.get(id)
      return visual ? `مرجع الرسم ${id}: ${visual.description}` : `معرّف الرسم الموثق: ${id}.`
    }),
    `الإجابة النهائية: ${element.answer}`,
    `التحقّق: ${element.verification}`,
    `خطأ شائع يُتجنب: ${element.pitfall}`,
  ],
  source: { type: 'textbook', page: element.page },
  note: [
    `القسم المطبوع: ${element.section}.`,
    element.branch ? `الفرع المطبوع: ${element.branch}.` : '',
    element.visualAssetIds.length ? `الرسم/الرسوم المعاد بناؤها: ${element.visualAssetIds.join('، ')}.` : '',
    'سجل هذا الحل بوصفه نصاً/تمريناً من الكتاب؛ التوسيع الحسابي والتعليل من إعداد المنصة.',
  ].filter(Boolean).join(' '),
}))

export const lessonTwelvePlatformTeacherEntries: TeacherEntry[] = [
  {
    id: 'l12-platform-comparator',
    title: 'مختبر مقام مشترك تفاعلي',
    prompt: 'نشاط إثرائي من إعداد المنصة: يختار الطالب بسطين ومقامين صحيحين (المقام 2–12)، ويرى مساري الأجزاء قبل طلب المقارنة.',
    answer: 'تُحوّل المدخلات إلى المضاعف المشترك الأصغر للمقامين. مع القيم الابتدائية 3/4 و1/5 يكون المقام 20، والناتجان 15/20 و4/20؛ لذا 3/4 > 1/5.',
    reasoning: [
      'المعطيات: كسور يختارها الطالب؛ يقبل المختبر بسطاً من 1 إلى المقام ومقاماً من 2 إلى 12.',
      'المطلوب: تحويل الكسرين إلى وحدات متساوية ثم عرض رمز المقارنة.',
      'نحسب المضاعف المشترك الأصغر للمقامين بخوارزمية القاسم المشترك الأكبر، من دون حساب عشري تقريبي.',
      'نضرب بسط كل كسر ومقامه بالعامل نفسه؛ ونقارن البسطين الناتجين باستخدام أعداد صحيحة دقيقة.',
      'في القيم الابتدائية: م.م.أ (4،5)=20؛ 3/4=15/20، و1/5=4/20.',
      '15 > 4، لذلك الناتج 3/4 > 1/5. عند تساوي الكسرين يظهر الرمز =.',
      'التحقق: المقام المشترك يقبل القسمة على المقامين، والضرب يحافظ على قيمة كل كسر.',
      'ملاحظة سلامة: الخانات الفارغة أو الصفر أو القيم خارج الحدود تُرفض مع رسالة عربية واضحة؛ لا يعرض النشاط NaN.',
    ],
    source: { type: 'platform' },
    note: 'مختبر أصلي من إعداد المنصة؛ ليس سؤالاً أو رسماً من صفحات الكتاب.',
  },
  {
    id: 'l12-platform-sorter',
    title: 'مسطرة ترتيب الكسور التفاعلية',
    prompt: 'نشاط إثرائي من إعداد المنصة: يبدل الطالب الكسور بأسهم رفع وخفض ويختار الترتيب التصاعدي أو التنازلي.',
    answer: 'للمجموعة 2/5، 7/18، 1/3، 5/12: المقام المشترك الأصغر 180، والقيم 72/180، 70/180، 60/180، 75/180. الترتيب التصاعدي 1/3 < 7/18 < 2/5 < 5/12، والتنازلي عكسه.',
    reasoning: [
      'المعطيات: مجموعة ثابتة إضافية لا تستبدل تدريبات الكتاب.',
      'المطلوب: ترتيب العناصر باستخدام الأزرار المتاحة للوحة المفاتيح واللمس.',
      'م.م.أ للمقامات 5 و18 و3 و12 هو 180، لا 360؛ لذلك التحويل الأدق هو 2/5=72/180، 7/18=70/180، 1/3=60/180، 5/12=75/180.',
      'إذن الترتيب التصاعدي: 1/3 < 7/18 < 2/5 < 5/12، والتنازلي: 5/12 > 2/5 > 7/18 > 1/3.',
      'التحقق: 60 < 70 < 72 < 75 على المقام المشترك 180.',
    ],
    source: { type: 'platform' },
    note: 'نشاط إثرائي مستقل؛ لا يُحتسب ضمن عناصر الكتاب. يمكن التحقق من ترتيب الطالب بالقيم المكافئة على المقام المشترك 180.',
  },
  {
    id: 'l12-platform-error-spotter',
    title: 'صيد خطأ المقام في كلام سارة',
    prompt: 'نشاط إثرائي من إعداد المنصة: تدّعي سارة أن 5/6 أصغر من 5/8 لأن 8 أكبر من 6. اختر التصحيح.',
    answer: 'الاختيار الصحيح هو توحيد المقامين: 5/6=20/24 و5/8=15/24؛ لذلك 5/6 > 5/8.',
    reasoning: [
      'الخطأ في الاستدلال هو مقارنة المقامين وحدهما مع أن البسطين متساويان والمقامين مختلفان.',
      'نختار مقاماً مشتركاً، وهو 24.',
      '5/6=20/24 لأن البسط والمقام ضُربا في 4.',
      '5/8=15/24 لأن البسط والمقام ضُربا في 3.',
      '20>15؛ إذن 5/6 أكبر من 5/8، والادعاء معكوس.',
    ],
    source: { type: 'platform' },
    note: 'سياق وخيارات تصحيح من إنشاء المنصة، غير موجودة ضمن بنود الصفحات 54–57.',
  },
  {
    id: 'l12-platform-final-challenge',
    title: 'التحدي الختامي: 5/8 و2/3',
    prompt: 'نشاط إثرائي من إعداد المنصة: اختر العلاقة بين 5/8 و2/3، مع تلميح اختياري لا يكشف الحل.',
    answer: '5/8 < 2/3؛ لأن 5/8=15/24 و2/3=16/24.',
    reasoning: [
      'المقامان 8 و3، وأصغر مقام مشترك هو 24.',
      'نحوّل 5/8 بضرب البسط والمقام في 3 فنحصل على 15/24.',
      'نحوّل 2/3 بضرب البسط والمقام في 8 فنحصل على 16/24.',
      '15<16، إذن 5/8<2/3.',
    ],
    source: { type: 'platform' },
    note: 'تحدٍّ إضافي من إعداد المنصة. التلميح المعروض قبل التحقق يطلب إيجاد مقام يقبل القسمة على 8 و3 ولا يكشف العلاقة.',
  },
]

export const lessonTwelveTeacherEntries: TeacherEntry[] = [
  ...lessonTwelveBookTeacherEntries,
  ...lessonTwelvePlatformTeacherEntries,
]

export const lessonTwelveRequiredSolutionIds = fractionsOneBookElements.map((element) => element.id)
export const lessonTwelveId = fractionsOneLessonId
