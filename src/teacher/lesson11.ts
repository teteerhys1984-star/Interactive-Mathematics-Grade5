import type { TeacherEntry } from './types'
import {
  leastCommonMultipleBookElements,
  leastCommonMultipleLessonId,
} from '../lessons/leastCommonMultipleData'

/**
 * Teacher Area companion for Unit 2, Lesson 3 — المضاعف المشترك الأصغر (pp. 52–53).
 * One detailed worked solution per printed source element. Platform activities are listed
 * separately so they are clearly not counted as textbook material.
 */
export const lessonElevenBookTeacherEntries: TeacherEntry[] = leastCommonMultipleBookElements.map(element => ({
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
    'طريقة البدء: اكتب مضاعفات كل عدد (بدون الصفر إلا إذا ذُكرت لحظة البداية صراحة) ثم ابحث عن أول مشترك.',
    ...element.reasoning.map((step, index) => `الخطوة ${index + 1}: ${step}`),
    `الإجابة النهائية: ${element.answer}`,
    `التحقّق: ${element.verification}`,
    `خطأ شائع يجب تجنّبه: ${element.pitfall}`,
  ],
  source: { type: 'textbook', page: element.page },
  note: [
    `القسم: ${element.section}.`,
    element.branch ? `موضع العنصر: الفرع ${element.branch}.` : '',
    element.visualAssetIds.length ? `الشريط/الرسم المعاد بناؤه: ${element.visualAssetIds.join('، ')}.` : '',
    'الحل يلتزم بنص الكتاب وبياناته، ويضيف شرح المنصة والتعليل في قسم مستقل.',
  ].filter(Boolean).join(' '),
}))

export const lessonElevenPlatformTeacherEntries: TeacherEntry[] = [
  {
    id: 'l11-platform-metronome',
    title: 'مختبر مترونوم النبضات',
    prompt: 'يضبط الطالب دورتَيْ نبض بين 2 و9، ويشغّل المترونوم ليرى وميضاً ذهبياً عند أول تطابق.',
    answer: 'أول زمن بعد الصفر يقبل القسمة على الدورتين معاً هو م.م.أ للعددين، ويحسب عبر القاسم المشترك الأكبر: م.م.أ(أ،ب) = أ×ب ÷ ق.م.أ.',
    reasoning: [
      'المعطيات: دورتان أ، ب يختارهما الطالب (2–9).',
      'المطلوب: تحديد أول زمن > 0 يومض فيه النبضان معاً.',
      'القاعدة المستعملة: مضاعفات كل دورة تتكرر، وأول تقاطع هو المضاعف المشترك الأصغر.',
      'لماذا تنطبق هنا: السنون تضيء عند مضاعفات الدورة، لذا يتحقق التزامن عند أول مشترك.',
      'طريقة البدء: اضبط الديالين ثم اضغط «تشغيل».',
      'الخطوة 1: شغّل المترونوم ولاحظ الومضات المنفردة.',
      'الخطوة 2: راقب الخانات الذهبية على الخط الزمني — هذه لحظات التزامن.',
      'الخطوة 3: أول خانة ذهبية بعد الصفر هو المضاعف المشترك الأصغر.',
      'الإجابة النهائية: القيمة المعروضة تحت المترونوم محسوبة برمجياً من الدورتين.',
      'التحقّق: عند التبديل بين (3،4) يجب أن يكون الناتج 12، وعند (4،6) يكون 12، وعند (4،5) يكون 20.',
      'خطأ شائع يجب تجنّبه: الخلط بين أول وميض مشترك بعد الصفر والوميض عند الصفر.',
    ],
    source: { type: 'platform' },
    note: 'نشاط حي من إعداد المنصة لتجربة فكرة المضاعف المشترك الأصغر بصرياً وحركياً، وليس سؤالاً مطبوعاً.',
  },
  {
    id: 'l11-platform-explorer',
    title: 'مختبر المضاعفات (ثلاثة أعداد)',
    prompt: 'يدخل الطالب ثلاثة أعداد بين 2 و15 فتُرسم شرائط مضاعفاتها ويبرز أول مشترك بين الثلاثة.',
    answer: 'القيمة التي يبرزها الشريط الذهبي الأول هو م.م.أ للأعداد الثلاثة.',
    reasoning: [
      'المعطيات: ثلاثة أعداد (افتراضية 4، 6، 8).',
      'المطلوب: إيجاد أول مشترك حقيقي بين قوائم المضاعفات الثلاث.',
      'القاعدة المستعملة: نفس قاعدة العددين، مع التحقق من الوجود في جميع القوائم.',
      'لماذا تنطبق هنا: الوجود في قائمتين فقط لا يكفي.',
      'طريقة البدء: غيّر الأعداد، وراقب الشريط الذهبي.',
      'الخطوة 1: تولّد الخانات حتى العدد 300.',
      'الخطوة 2: تُختبر القسمة على كل عدد.',
      'الخطوة 3: يُعرض أول ناتج كم.م.أ.',
      'الإجابة النهائية: معروضة تحت الشرائط مع المقارنة بين م.م.أ لعددين وم.م.أ لثلاثة.',
      'التحقّق: عند الأعداد 4،6،8 الناتج 24، وعند 8،5،4 الناتج 40.',
      'خطأ شائع يجب تجنّبه: الاكتفاء بالمشترك بين قائمتين ونسيان الثالثة.',
    ],
    source: { type: 'platform' },
    note: 'مختبر استكشافي جديد، لا يُحتسب ضمن عناصر الكتاب.',
  },
  {
    id: 'l11-platform-sort',
    title: 'نشاط فرز البطاقات (6 و8)',
    prompt: 'يفرز الطالب 8 بطاقات إلى «مشترك» و«ليس مشتركاً» للعددين 6 و8.',
    answer: 'البطاقات المشتركة هي 24، 48؛ بقية البطاقات (8، 12، 16، 32، 36، 60) غير مشتركة.',
    reasoning: [
      'المعطيات: مجموعة أعداد مختلطة.',
      'المطلوب: تصنيفها وفق القسمة على 6 و8 معاً.',
      'القاعدة المستعملة: العدد مشترك إذا كان يقبل القسمة على العددين كلاهما دون باقٍ.',
      'لماذا تنطبق هنا: المضاعف المشترك يقبل القسمة على العددين، والعكس صحيح.',
      'طريقة البدء: اضغط البطاقة، وتابع التغذية الراجعة.',
      'الخطوة 1: افحص قابلية القسمة على 6.',
      'الخطوة 2: افحص قابلية القسمة على 8.',
      'الخطوة 3: ضع الناتج في العمود المناسب.',
      'الإجابة النهائية: فرز صحيح يضع 24 و48 في عمود «مشترك».',
      'التحقّق: 24 = م.م.أ (6،8)، و48 هو ثاني مضاعف مشترك.',
      'خطأ شائع يجب تجنّبه: اعتبار أن وجود العدد في إحدى القائمتين يكفي.',
    ],
    source: { type: 'platform' },
    note: 'لعبة تصنيف جديدة، ولا تستبدل أي تمرين مطبوع.',
  },
]

export const lessonElevenTeacherEntries: TeacherEntry[] = [
  ...lessonElevenBookTeacherEntries,
  ...lessonElevenPlatformTeacherEntries,
]

export const lessonElevenRequiredSolutionIds = leastCommonMultipleBookElements.map(element => element.id)
export const lessonElevenId = leastCommonMultipleLessonId
