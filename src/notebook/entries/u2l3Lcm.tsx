import { rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  leastCommonMultipleBookElements,
  type LeastCommonMultipleBookElement,
} from '../../lessons/leastCommonMultipleData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 3: المضاعف المشترك الأصغر (الكتاب ص 52–53).
 *
 * Source of truth: `src/lessons/leastCommonMultipleData.ts`. The definition and the pinned rule are
 * copied from the book's own wording, the three printed examples keep their step-by-step reasoning,
 * and the nine «تدرّب» branches keep their answers. The notebook adds the one thing the printed page
 * leaves implicit: a table that shows *why* a wrong answer (12 for 4، 6، 8) fails the third list.
 */
const element = (id: string): LeastCommonMultipleBookElement => {
  const found = leastCommonMultipleBookElements.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing lesson 11 book element: ${id}`)
  return found
}

const prompt = (id: string): string => element(id).prompt
const answer = (id: string): string => element(id).answer
const rule = (id: string): string => element(id).rule
const why = (id: string): string => element(id).why
const pitfall = (id: string): string => element(id).pitfall
const verification = (id: string): string => element(id).verification
const reasoning = (id: string): readonly string[] => element(id).reasoning
/** The values of one printed drill branch, e.g. «م.م.أ (20 ، 30) = 60.». */
const drillRow = (id: string, branch: string) => [rich(`الفرع (${branch})`), rich(prompt(id)), rich(answer(id))]

/** The nine printed drill branches of ص 53, in printed order. */
const drillBranches: ReadonlyArray<{ id: string; branch: string }> = [
  { id: 'l11-p53-drill-a', branch: 'أ' },
  { id: 'l11-p53-drill-b', branch: 'ب' },
  { id: 'l11-p53-drill-c', branch: 'ج' },
  { id: 'l11-p53-drill-d', branch: 'د' },
  { id: 'l11-p53-drill-e', branch: 'هـ' },
  { id: 'l11-p53-drill-f', branch: 'و' },
  { id: 'l11-p53-drill-g', branch: 'ز' },
  { id: 'l11-p53-drill-h', branch: 'ح' },
  { id: 'l11-p53-drill-i', branch: 'ط' },
]

export function lcmNotebook(): NotebookDoc {
  return {
    lessonId: 'least-common-multiple',
    lessonTitle: 'المضاعف المشترك الأصغر',
    unit: 'الوحدة الثانية',
    pages: 'ص 52–53',
    theme: 'lesson-eleven',
    sections: [
      {
        id: 'u2l3-terms',
        purpose: 'record',
        title: 'المضاعف والمضاعف المشترك',
        blocks: [
          {
            kind: 'text', id: 'u2l3-text-goals',
            text: rich(answer('l11-p52-goals')),
          },
          {
            kind: 'definition', id: 'u2l3-def-multiple',
            term: 'مضاعفات عدد',
            text: rich(`${rule('l11-p52-launch-a')} ${why('l11-p52-launch-a')} فمضاعفات العدد 2 هي: 2، 4، 6، 8، 10، 12، … ومضاعفات العدد 3 هي: 3، 6، 9، 12، 15، 18، …`),
            source: 'الكتاب · ص 52 (انطلاقة نشطة)',
          },
          {
            kind: 'definition', id: 'u2l3-def-lcm',
            term: 'المضاعف المشترك الأصغر (م.م.أ)',
            text: rich(prompt('l11-p52-definition')),
            source: 'الكتاب · ص 52 (تعلّم)',
          },
          {
            kind: 'rule', id: 'u2l3-rule-why-zero',
            title: 'لماذا نستبعد الصفر دائماً؟',
            text: rich(why('l11-p52-definition')),
          },
          {
            kind: 'note', id: 'u2l3-note-zero', tone: 'warning',
            text: rich(`${pitfall('l11-p52-definition')} فالصفر موجود في قائمة مضاعفات كل عدد، لكنه لا يُعدّ جواباً لأن المطلوب أصغر مضاعف مشترك أكبر تماماً من الصفر.`),
          },
        ],
      },
      {
        id: 'u2l3-method',
        purpose: 'record',
        title: 'طريقة الحل: ثلاث قوائم حتى أول لقاء',
        blocks: [
          {
            kind: 'rule', id: 'u2l3-rule-pinned',
            title: 'القاعدة المثبّتة (ص 53)',
            text: rich(prompt('l11-p53-rule-pinned')),
          },
          {
            kind: 'steps', id: 'u2l3-steps-lcm',
            title: 'خطوات إيجاد م.م.أ لعددين أو أكثر',
            steps: [
              rich('أكتب مضاعفات كل عدد بالترتيب التصاعدي، بدءاً من العدد نفسه (ضربه في 1) لا من الصفر.'),
              rich('أستمر في القائمة حتى أجد عدداً ظهر في كل القوائم؛ أحياناً أحتاج إلى عشرة مضاعفات أو أكثر.'),
              rich('أول عدد مشترك بين جميع القوائم هو المضاعف المشترك الأصغر.'),
              rich('أتحقق: هل يقبل العدد القسمة على كل عدد من الأعداد المعطاة بلا باقٍ؟'),
              rich('أتحقق مرة ثانية: هل يوجد عدد أصغر منه يقبل القسمة على الأعداد نفسها؟ إن وجدت فجوابي ليس الأصغر.'),
            ],
          },
          {
            kind: 'note', id: 'u2l3-note-quicker', tone: 'tip',
            text: rich('طريق مختصر للتحقق: ابدأ بمضاعفات العدد الأكبر وافحصها في الأعداد الأخرى؛ فأول مضاعف للعدد الأكبر يقبل القسمة على البقية هو م.م.أ. فمثلاً 4 و6: مضاعفات 6 هي 6، 12 — و12 يقبل القسمة على 4، إذن م.م.أ = 12.'),
          },
          {
            kind: 'table', id: 'u2l3-table-3-4',
            title: 'لماذا 12 وليس 24؟ (مثال الليزر)',
            headers: ['اللحظة (ثانية)', 'مضاعفات الجهاز الأول (كل 3)', 'مضاعفات الجهاز الثاني (كل 4)', 'الحكم'],
            rows: [
              ['0', '0', '0', rich('لحظة البداية المشتركة، لا تُحسب جواباً')],
              ['3', '3', '—', rich('الجهاز الأول فقط')],
              ['4', '—', '4', rich('الجهاز الثاني فقط')],
              ['6', '6', '—', rich('الجهاز الأول فقط')],
              ['8', '—', '8', rich('الجهاز الثاني فقط')],
              ['9', '9', '—', rich('الجهاز الأول فقط')],
              ['12', '12', '12', rich('أول لقاء بعد الصفر ← م.م.أ = 12')],
            ],
            caption: rich(`${answer('l11-p52-laser-a')} ثم يتكرر اللقاء كل 12 ثانية: 12، 24، 36، …`),
          },
          {
            kind: 'table', id: 'u2l3-table-4-6-8',
            title: 'ثلاثة أعداد: كلمة «جميعاً» هي المفتاح',
            headers: ['العدد', 'مضاعفاته الأولى', 'هل يقبل 12 القسمة عليه؟'],
            rows: [
              [rich('العدد 4'), rich('4، 8، 12، 16، 20، 24، …'), rich('نعم: 12 ÷ 4 = 3')],
              [rich('العدد 6'), rich('6، 12، 18، 24، …'), rich('نعم: 12 ÷ 6 = 2')],
              [rich('العدد 8'), rich('8، 16، 24، 32، …'), rich('لا: 12 ÷ 8 يبقى 4')],
              ['الحكم', rich('24 هو أول عدد يظهر في القوائم الثلاث'), rich('م.م.أ (4، 6، 8) = 24')],
            ],
            caption: rich(`لهذا لا يصح الجواب 12: ${pitfall('l11-p53-example-4-6-8')}`),
          },
        ],
      },
      {
        id: 'u2l3-examples',
        purpose: 'record',
        title: 'أمثلة الكتاب المحلولة',
        blocks: [
          {
            kind: 'example', id: 'u2l3-ex-laser',
            title: 'مثال ①: الليزران (ص 52)',
            question: rich(prompt('l11-p52-laser-setup') + ' ' + prompt('l11-p52-laser-b')),
            solution: [...reasoning('l11-p52-laser-setup'), ...reasoning('l11-p52-laser-b')],
            answer: rich(`${answer('l11-p52-laser-a')} — وأول لقاء بعد 12 ثانية.`),
            verification: rich(verification('l11-p52-laser-b')),
          },
          {
            kind: 'example', id: 'u2l3-ex-3-5',
            title: 'مثال ②: م.م.أ للعددين 3 و5',
            question: rich(prompt('l11-p52-example-3-5')),
            solution: [...reasoning('l11-p52-example-3-5')],
            answer: rich(answer('l11-p52-example-3-5')),
            verification: rich(verification('l11-p52-example-3-5')),
          },
          {
            kind: 'example', id: 'u2l3-ex-4-6-8',
            title: 'مثال ③: م.م.أ للأعداد 4 و6 و8',
            question: rich(prompt('l11-p53-example-4-6-8')),
            solution: [...reasoning('l11-p53-example-4-6-8')],
            answer: rich(answer('l11-p53-example-4-6-8')),
            verification: rich(verification('l11-p53-example-4-6-8')),
          },
          {
            kind: 'example', id: 'u2l3-ex-farmer',
            title: 'مثال ④: الفلاح والمبيدان (تطبيق حياتي)',
            question: rich(prompt('l11-p53-farmer')),
            solution: [...reasoning('l11-p53-farmer')],
            answer: rich(answer('l11-p53-farmer')),
            verification: rich(verification('l11-p53-farmer')),
          },
        ],
      },
      {
        id: 'u2l3-verbal',
        purpose: 'record',
        title: 'التعبير الشفهي: أشرح طريقتي بكلماتي',
        blocks: [
          {
            kind: 'steps', id: 'u2l3-steps-explain',
            title: 'كيف أشرح إيجاد م.م.أ في الإجابة الشفهية؟',
            steps: [
              rich('أذكر التعريف: أصغر مضاعف مشترك أكبر تماماً من الصفر.'),
              rich('أذكر أنني أكتب مضاعفات كل عدد بترتيب تصاعدي، بدءاً من العدد نفسه.'),
              rich('أذكر أنني أبحث عن أول عدد يظهر في جميع القوائم، لا في قائمة واحدة.'),
              rich('أنهي بالتحقق: العدد المختار يقبل القسمة على كل الأعداد، ولا يوجد عدد أصغر منه يفعل ذلك.'),
            ],
          },
          {
            kind: 'text', id: 'u2l3-text-verbal',
            text: rich(`سؤال الكتاب: ${prompt('l11-p53-verbal')} — الجواب النموذجي: ${answer('l11-p53-verbal')}`),
          },
          {
            kind: 'note', id: 'u2l3-note-verbal', tone: 'warning',
            text: rich(`${pitfall('l11-p53-verbal')} وتذكّر: م.م.أ ليس حاصل ضرب الأعداد بالضرورة (20 و30 م.م.أ = 60 لا 600).`),
          },
          {
            kind: 'note', id: 'u2l3-note-difference', tone: 'tip',
            text: rich('لا تخلط بين القاسم المشترك الأكبر والمضاعف المشترك الأصغر: ق.م.أ (20، 30) = 10 أما م.م.أ (20، 30) = 60. القاسم يقسم العددين، والمضاعف يقبل القسمة عليهما.'),
          },
        ],
      },
      {
        id: 'u2l3-check',
        purpose: 'practice',
        title: 'تحقّق من فهمك (ص 53)',
        blocks: [
          {
            kind: 'example', id: 'u2l3-ex-check',
            title: 'تحقّق من فهمك: م.م.أ (8، 5، 4)',
            question: rich(prompt('l11-p53-check')),
            solution: [...reasoning('l11-p53-check')],
            answer: rich(answer('l11-p53-check')),
            verification: rich(verification('l11-p53-check')),
          },
        ],
      },
      {
        id: 'u2l3-drills',
        purpose: 'practice',
        title: 'تدرّب (ص 53): تسعة فروع محلولة',
        blocks: [
          {
            kind: 'table', id: 'u2l3-table-drills',
            title: 'أوجد المضاعف المشترك الأصغر',
            headers: ['الفرع', 'الأعداد', 'المضاعف المشترك الأصغر'],
            rows: drillBranches.map(item => drillRow(item.id, item.branch)),
            caption: rich(`لاحظ النمط: م.م.أ (20، 30) = 60، ثم 120، ثم 240 — كلما ضربنا الأعداد في 10 ضُرب الجواب في 10. ${pitfall('l11-p53-drill-a')}`),
          },
          {
            kind: 'note', id: 'u2l3-note-drill-check', tone: 'tip',
            text: rich('للفرع (ط) 4000 و6000 و8000: الجواب 24000 لأن 24000 ÷ 4000 = 6 و÷ 6000 = 4 و÷ 8000 = 3، ولا يوجد أصغر يقبل القسمة على الثلاثة.'),
          },
        ],
      },
      {
        id: 'u2l3-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة وأمثلة استخدام',
        blocks: [
          {
            kind: 'note', id: 'u2l3-note-mistake-1', tone: 'warning',
            text: rich('① البدء من الصفر: الصفر مشترك دائماً لكنه ليس جواباً.'),
          },
          {
            kind: 'note', id: 'u2l3-note-mistake-2', tone: 'warning',
            text: rich(`② الاكتفاء بمشترك بين قائمتين عند وجود ثلاثة أعداد. ${pitfall('l11-p53-example-4-6-8')}`),
          },
          {
            kind: 'note', id: 'u2l3-note-mistake-3', tone: 'warning',
            text: rich(`③ استخدام الجمع بدل المضاعفات في المسائل الحياتية: ${pitfall('l11-p53-farmer')}`),
          },
          {
            kind: 'note', id: 'u2l3-note-mistake-4', tone: 'warning',
            text: rich('④ اختيار مضاعف مشترك كبير قبل التأكد من عدم وجود أصغر منه؛ فالقاعدة تطلب الأصغر لا أي مشترك.'),
          },
          {
            kind: 'text', id: 'u2l3-text-uses',
            text: rich('أين نستعمل م.م.أ؟ عند توحيد مقامات الكسور (وهو ما سنستعمله في درس الكسور)، وعند مزامنة حدثين يتكرران بفترتين مختلفتين، وعند تقسيم أشياء إلى مجموعات متساوية من دون بقايا.'),
          },
          {
            kind: 'text', id: 'u2l3-text-rule-check',
            text: rich(`قاعدة التحقق التي أكتبها في دفترى: ${rule('l11-p53-check')} ${verification('l11-p53-check')}`),
          },
        ],
      },
    ],
  }
}
