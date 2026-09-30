import type { TeacherEntry } from './types'
import { finalAssessment6, lessonSixBookElements } from '../lessons/anglesData'

const finalReasoning: Record<string, string[]> = {
  'angle-final-1': ['الضلع الأساسي يشير إلى اليمين، لذلك نبدأ من تدريج 0° جهة اليمين.', 'الشعاع الآخر يقطع التدريج عند 72°.', 'إذن قياس الزاوية 72°.'],
  'angle-final-2': ['المنقلة لها تدريجان لأن الضلع الأساسي قد يتجه يميناً أو يساراً.', 'نختار دائماً التدريج الذي يبدأ من 0° عند الضلع الذي طابقناه بخط الصفر.', 'بما أن الضلع إلى اليمين فالصحيح هو تدريج الصفر من اليمين.'],
  'angle-final-3': ['مركز المنقلة هو نقطة تقاطع خطي الصفر ونصف الدائرة.', 'يجب وضعه تماماً فوق رأس الزاوية؛ وإلا لن تمر تدريجات المنقلة عبر الضلعين الحقيقيين.', 'لذلك لا تكون القراءة موثوقة إذا كان المركز بعيداً عن الرأس.'],
  'angle-final-4': ['نقارن 120° بحدّي التصنيف: هو أكبر من 90° وأصغر من 180°.', 'إذن الزاوية منفرجة.'],
  'angle-final-5': ['الشعاع MW يقسم الزاوية BMC إلى زاويتين متجاورتين.', 'نجمع القياسين: 60° + 30° = 90°.', 'إذن ∠BMC قائمة وقياسها 90°.'],
  'angle-final-6': ['مجموع زوايا المثلث 180°.', 'الزاوية القائمة 90°، والزاوية المعطاة 30°.', 'الزاوية الثالثة = 180° − 90° − 30° = 60°.'],
  'angle-final-7': ['زاوية المربع قائمة وقياسها 90°.', 'القطر يقسمها إلى قسمين متساويين.', 'كل قسم = 90° ÷ 2 = 45°.'],
  'angle-final-8': ['نراجع أولاً موضع المركز وخط الصفر.', 'نقرأ من الصفر الصحيح، ثم نتحقق من معقولية الناتج: 135° بين 90° و180° فهي منفرجة.', 'بهذه المراجعة نتجنب قراءة التدريج الآخر أو البدء من الطرف الخطأ.'],
}

export const lessonSixTeacherEntries: TeacherEntry[] = [
  ...lessonSixBookElements.map(element => ({
    id: element.id,
    title: element.title,
    prompt: element.prompt,
    answer: element.answer,
    reasoning: element.reasoning,
    source: { type: 'textbook' as const, page: element.page },
    note: `القسم: ${element.section}. اربط الإجابة بالرسم الموجود في الكتاب، ثم اطلب من الطالب تفسيرها لا حفظها فقط.`,
  })),
  ...finalAssessment6.map(question => ({
    id: question.id,
    title: `الاختبار الختامي: ${question.text}`,
    prompt: question.text + (question.options ? ` — الخيارات: ${question.options.join(' / ')}` : ''),
    answer: question.answer,
    reasoning: finalReasoning[question.id],
    source: { type: 'platform' as const },
    note: 'سؤال جديد من إعداد المنصة يقيس الفهم والنقل إلى موقف غير منقول من صفحات الكتاب.',
  })),
]

export const lessonSixRequiredSolutionIds = lessonSixTeacherEntries.map(entry => entry.id)
