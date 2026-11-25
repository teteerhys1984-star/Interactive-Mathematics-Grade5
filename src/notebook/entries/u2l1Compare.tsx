import { Frac, rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  compareNaturalNumbersBookElements,
  type CompareNaturalNumbersBookElement,
} from '../../lessons/compareNaturalNumbersData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 1: مقارنة الأعداد الطبيعية وترتيبها (الكتاب ص 44–47).
 *
 * Source of truth: `src/lessons/compareNaturalNumbersData.ts`. Every printed question, answer and
 * solution step below is read from that ledger (`prompt`, `answer`, `reasoning`, `rule`, `why`,
 * `pitfall`, `verification`) instead of being retyped, so the notebook and the lesson can never
 * drift apart. The notebook keeps the two jobs of the sheet apart: what the student writes down
 * (symbols, the two comparison rules, the ordering procedure, the place-value table) and the book's
 * solved exercises kept for comparing the student's own attempt.
 */
const element = (id: string): CompareNaturalNumbersBookElement => {
  const found = compareNaturalNumbersBookElements.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing lesson 9 book element: ${id}`)
  return found
}

const prompt = (id: string): string => element(id).prompt
const answer = (id: string): string => element(id).answer
const rule = (id: string): string => element(id).rule
const why = (id: string): string => element(id).why
const pitfall = (id: string): string => element(id).pitfall
const verification = (id: string): string => element(id).verification
const reasoning = (id: string): readonly string[] => element(id).reasoning

/** The printed branch data of a task («3 ........ 8»), which the ledger keeps apart from its prompt. */
const printed = (id: string): string => element(id).sourceText ?? prompt(id)

/** The comparison symbol inside a printed answer, e.g. «1,304,987 < 1,895,829.» → «<». */
const relationOf = (id: string): string => {
  const match = answer(id).match(/[<>=]/u)
  if (!match) throw new Error(`no comparison symbol in the answer of ${id}: ${answer(id)}`)
  return match[0]
}

export function compareNotebook(): NotebookDoc {
  return {
    lessonId: 'compare-order-natural-numbers',
    lessonTitle: 'مقارنة الأعداد الطبيعية وترتيبها',
    unit: 'الوحدة الثانية',
    pages: 'ص 44–47',
    theme: 'lesson-nine',
    sections: [
      {
        id: 'u2l1-symbols',
        purpose: 'record',
        title: 'الرموز الثلاثة: ماذا نكتب ومتى؟',
        blocks: [
          {
            kind: 'text', id: 'u2l1-text-goals',
            text: rich(answer('l9-p44-goals')),
          },
          {
            kind: 'definition', id: 'u2l1-def-less',
            term: 'أصغر من',
            text: rich(`${rule('l9-p44-less-than')} ${answer('l9-p44-less-than')}`),
            source: 'الكتاب · ص 44',
          },
          {
            kind: 'definition', id: 'u2l1-def-greater',
            term: 'أكبر من',
            text: rich(`${rule('l9-p44-greater-than')} ${answer('l9-p44-greater-than')}`),
            source: 'الكتاب · ص 44',
          },
          {
            kind: 'definition', id: 'u2l1-def-equal',
            term: 'يساوي',
            text: rich(rule('l9-p44-equality')),
            source: 'الكتاب · ص 44',
          },
          {
            kind: 'rule', id: 'u2l1-rule-direction',
            title: 'قاعدة ذهبية: الرمز يقرأ من قيمته الصغيرة إلى الكبيرة',
            text: rich(
              'الرمز يُقرأ دائماً من الطرف الأصغر إلى الطرف الأكبر: الفتحة الواسعة تلتصق بالعدد الأكبر، والطرف المدبّب يشير إلى العدد الأصغر. ' +
              'فإذا كان العدد الأيسر أصغر كتبنا الرمز <، وإذا كان أكبر كتبنا >، وإذا تساوى الطرفان كتبنا =. ' +
              why('l9-p44-equality'),
            ),
          },
          {
            kind: 'note', id: 'u2l1-note-symbols', tone: 'warning',
            text: rich(`${pitfall('l9-p44-less-than')} ${pitfall('l9-p44-greater-than')}`),
          },
        ],
      },
      {
        id: 'u2l1-rules',
        purpose: 'record',
        title: 'القاعدتان اللتان تحسمان كل مقارنة',
        blocks: [
          {
            kind: 'rule', id: 'u2l1-rule-digit-count',
            title: '① إذا اختلف عدد الخانات',
            text: rich(`${rule('l9-p45-digit-count-rule')} لماذا؟ ${why('l9-p45-digit-count-rule')}`),
          },
          {
            kind: 'rule', id: 'u2l1-rule-same-length',
            title: '② إذا تساوى عدد الخانات',
            text: rich(`${rule('l9-p45-same-length-rule')} لماذا؟ ${why('l9-p45-same-length-rule')}`),
          },
          {
            kind: 'rule', id: 'u2l1-rule-equality',
            title: '③ متى يكون العددان متساويين؟',
            text: rich(`${rule('l9-p46-equality-rule')} ${answer('l9-p46-equality-rule')}`),
          },
          {
            kind: 'steps', id: 'u2l1-steps-compare',
            title: 'خطوات المقارنة بين عددين (أكتبها بالترتيب)',
            steps: [
              rich('الخطوة ①: أعدّ خانات العددين بعد إهمال الفواصل.'),
              rich('الخطوة ②: إذا اختلف عدد الخانات، فالعدد ذو الخانات الأكثر هو الأكبر — ولا حاجة لفحص الأرقام.'),
              rich('الخطوة ③: إذا تساوى عدد الخانات، ابدأ من المنزلة الأعلى (أقصى اليسار).'),
              rich('الخطوة ④: تجاوز المنازل المتساوية، وتوقف عند أول منزلة مختلفة؛ الرقم الأكبر فيها يجعل العدد كله أكبر.'),
              rich('الخطوة ⑤: إذا تساوت كل المنازل فالعددان متساويان، ونكتب =.'),
              rich('الخطوة ⑥: اقرأ الجملة بعد كتابتها للتأكد من أن الرمز يصف العلاقة فعلاً.'),
            ],
          },
          {
            kind: 'steps', id: 'u2l1-steps-order',
            title: 'خطوات ترتيب مجموعة أعداد',
            steps: [
              rich('حدّد الاتجاه المطلوب: تصاعدي (من الأصغر إلى الأكبر) أم تنازلي (من الأكبر إلى الأصغر).'),
              rich('قارن الأعداد زوجاً زوجاً بالقاعدتين السابقتين.'),
              rich('اكتب القائمة بالاتجاه المطلوب، ثم افحص كلّ زوج متجاور: يجب أن يكون كل عدد أصغر من الذي يليه في الترتيب التصاعدي.'),
              rich('إذا كان في القائمة أعداد بأعداد خانات مختلفة، ابدأ بمجموعة الخانات الأكثر لأنها كلها أكبر.'),
            ],
          },
          {
            kind: 'note', id: 'u2l1-note-rules', tone: 'warning',
            text: rich(`${pitfall('l9-p45-digit-count-rule')} ${pitfall('l9-p45-same-length-rule')}`),
          },
          {
            kind: 'note', id: 'u2l1-note-purpose', tone: 'tip',
            text: rich(answer('l9-p45-purpose')),
          },
        ],
      },
      {
        id: 'u2l1-table',
        purpose: 'record',
        title: 'جدول المنازل: أرسمه وأملؤه عند كل مقارنة',
        blocks: [
          {
            kind: 'table', id: 'u2l1-table-places',
            title: 'منازل عدد من سبع خانات',
            headers: ['الملايين', 'مئات الألوف', 'عشرات الألوف', 'الآلاف', 'المئات', 'العشرات', 'الآحاد'],
            rows: [
              [rich('1,254,698'), rich('1'), rich('2'), rich('5'), rich('4'), rich('6'), rich('9'), rich('8')],
              [rich('999,999'), rich('—'), rich('9'), rich('9'), rich('9'), rich('9'), rich('9'), rich('9')],
            ],
            caption: rich('العدد 1,254,698 يمتد إلى خانة الملايين فتكون له سبع خانات، أما 999,999 فله ست خانات فقط؛ لذلك هو الأصغر مهما كانت أرقامه تسعات.'),
          },
          {
            kind: 'table', id: 'u2l1-table-difference',
            title: 'أول اختلاف يحسم: 2,358,936 و2,369,487',
            headers: ['المنزلة', '2,358,936', '2,369,487', 'الحكم'],
            rows: [
              ['الملايين', rich('2'), rich('2'), 'متساويتان ← نتابع'],
              ['مئات الألوف', rich('3'), rich('3'), 'متساويتان ← نتابع'],
              ['عشرات الألوف', rich('5'), rich('6'), rich('5 < 6 ← العدد الأول أصغر')],
              ['الآلاف وما بعدها', rich('8'), rich('9'), 'لا نفحصها: المقارنة حُسمت'],
            ],
            caption: rich(answer('l9-p46-first-difference-resolution')),
          },
          {
            kind: 'note', id: 'u2l1-note-table', tone: 'tip',
            text: rich('عند ملء الجدول اكتب في كل عمود رقماً واحداً فقط، وضع الصفر حيث لا يوجد رقم؛ فالخانة الفارغة ليست صفراً في الكتابة وإنما تُكتب صفراً في الجدول.'),
          },
        ],
      },
      {
        id: 'u2l1-examples',
        purpose: 'practice',
        title: 'أمثلة الكتاب المحلولة خطوة بخطوة',
        blocks: [
          {
            kind: 'example', id: 'u2l1-ex-digit-count',
            title: 'مثال ①: مقارنة عددين مختلفَي عدد الخانات',
            question: rich(prompt('l9-p45-digit-count-example')),
            solution: [...reasoning('l9-p45-digit-count-example')],
            answer: rich(answer('l9-p45-digit-count-example')),
            verification: rich(verification('l9-p45-digit-count-example')),
          },
          {
            kind: 'example', id: 'u2l1-ex-million',
            title: 'مثال ②: مقارنة عددين متساويَي الخانات',
            question: rich(prompt('l9-p45-million-comparison-example')),
            solution: [...reasoning('l9-p45-million-comparison-example')],
            answer: rich(answer('l9-p45-million-comparison-example')),
            verification: rich(verification('l9-p45-million-comparison-example')),
          },
          {
            kind: 'example', id: 'u2l1-ex-first-difference',
            title: 'مثال ③: المتابعة حتى أول منزلة مختلفة',
            question: rich(prompt('l9-p46-first-difference-resolution')),
            solution: [...reasoning('l9-p46-first-difference-resolution')],
            answer: rich(answer('l9-p46-first-difference-resolution')),
            verification: rich(verification('l9-p46-first-difference-resolution')),
          },
          {
            kind: 'example', id: 'u2l1-ex-equality',
            title: 'مثال ④: عددان متساويان',
            question: rich(prompt('l9-p46-equality-example')),
            solution: [...reasoning('l9-p46-equality-example')],
            answer: rich(answer('l9-p46-equality-example')),
          },
          {
            kind: 'example', id: 'u2l1-ex-order',
            title: 'مثال ⑤: من المقارنة إلى الترتيب التصاعدي',
            question: rich(prompt('l9-p46-ordering-benefit-example')),
            solution: [...reasoning('l9-p46-ordering-benefit-example')],
            answer: rich(answer('l9-p46-ordering-benefit-example')),
            verification: rich(verification('l9-p46-ordering-benefit-example')),
          },
        ],
      },
      {
        id: 'u2l1-practice',
        purpose: 'practice',
        title: 'حلول تدريبات الكتاب (للمقارنة مع حلّك)',
        blocks: [
          {
            kind: 'table', id: 'u2l1-table-compare',
            title: 'تدرّب ② · استعمل أحد الرموز (=، >، <)',
            headers: ['الفرع', 'المقارنة المطبوعة', 'الرمز الصحيح'],
            rows: [
              ['أ', rich(printed('l9-p47-ex2-a')), rich(`${relationOf('l9-p47-ex2-a')} — ${answer('l9-p47-ex2-a')}`)],
              ['ب', rich(printed('l9-p47-ex2-b')), rich(`${relationOf('l9-p47-ex2-b')} — ${answer('l9-p47-ex2-b')}`)],
              ['ج', rich(printed('l9-p47-ex2-c')), rich(`${relationOf('l9-p47-ex2-c')} — ${answer('l9-p47-ex2-c')}`)],
              ['د', rich(printed('l9-p47-ex2-d')), rich(`${relationOf('l9-p47-ex2-d')} — ${answer('l9-p47-ex2-d')}`)],
              ['هـ', rich(printed('l9-p47-ex2-e')), rich(`${relationOf('l9-p47-ex2-e')} — ${answer('l9-p47-ex2-e')}`)],
              ['و', rich(printed('l9-p47-ex2-f')), rich(`${relationOf('l9-p47-ex2-f')} — ${answer('l9-p47-ex2-f')}`)],
            ],
            caption: rich('الرمز في كل صف هو ما يثبت المقارنة؛ والإجابة الكاملة لكل فرع في الكتاب تُقرأ بالجملة: «العدد … أصغر من …».'),
          },
          {
            kind: 'table', id: 'u2l1-table-statements',
            title: 'تدرّب ① · أشر إلى العبارات الصحيحة',
            headers: ['الفرع', 'الحكم', 'لماذا'],
            rows: [
              ['أ', rich(answer('l9-p47-ex1-a')), rich(rule('l9-p47-ex1-a'))],
              ['ب', rich(answer('l9-p47-ex1-b')), rich(rule('l9-p47-ex1-b'))],
              ['ج', rich(answer('l9-p47-ex1-c')), rich(rule('l9-p47-ex1-c'))],
              ['د', rich(answer('l9-p47-ex1-d')), rich(rule('l9-p47-ex1-d'))],
            ],
          },
          {
            kind: 'example', id: 'u2l1-ex-order-asc',
            title: 'تدرّب ③ (أ) و(ب): ترتيب تصاعدي',
            question: rich('رتّب الأعداد الآتية تصاعدياً (من الأصغر إلى الأكبر): 2,359,000 و2,377,000 و3,356,000، ثم: 2,006,000 و2,009,000 و2,037,000 و2,040,000.'),
            solution: [
              rich(reasoning('l9-p47-ex3-a').join(' ')),
              rich(reasoning('l9-p47-ex3-b').join(' ')),
            ],
            answer: rich(`${answer('l9-p47-ex3-a')} — ثم — ${answer('l9-p47-ex3-b')}`),
            verification: rich(verification('l9-p47-ex3-b')),
          },
          {
            kind: 'table', id: 'u2l1-table-neighbour',
            title: 'تدرّب ④ · السابق واللاحق',
            headers: ['العدد', 'السابق', 'اللاحق'],
            rows: [
              [rich('3,120,019'), rich('3,120,018'), rich('3,120,020')],
              [rich('7,546,851'), rich('7,546,850'), rich('7,546,852')],
            ],
            caption: rich(answer('l9-p47-ex4-3120019')),
          },
          {
            kind: 'table', id: 'u2l1-table-provinces',
            title: 'تدرّب ⑤ · مساحات المحافظات',
            headers: ['السؤال', 'الجواب'],
            rows: [
              [rich('رتّب المحافظات من الأكبر مساحة إلى الأصغر'), rich(answer('l9-p47-ex5-1'))],
              [rich('أي المحافظات مساحتها أكبر من مساحة حمص؟'), rich(answer('l9-p47-ex5-2'))],
              [rich('أي المحافظات مساحتها أقل من 6,000 كم²؟'), rich(answer('l9-p47-ex5-3'))],
            ],
            caption: rich('ترتيب المساحات نفسه: 23,330 > 8,880 > 6,100 > 5,550 > 2,730 > 1,860.'),
          },
          {
            kind: 'example', id: 'u2l1-ex-check-q1',
            title: 'تحقّق من فهمك ① · من قارن بشكل صحيح؟',
            question: rich(prompt('l9-p46-check-q1')),
            solution: [...reasoning('l9-p46-check-q1')],
            answer: rich(answer('l9-p46-check-q1')),
            verification: rich(verification('l9-p46-check-q1')),
          },
        ],
      },
      {
        id: 'u2l1-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l1-note-mistake-1', tone: 'warning',
            text: rich('خطأ: الحكم على عددين مختلفَي عدد الخانات من رقمهما الأول. مثال: القول إن 999,999 أكبر من 1,254,698 لأن 9 أكبر من 1. الصواب: 999,999 < 1,254,698 لأن عدد الخانات يحسم أولاً.'),
          },
          {
            kind: 'note', id: 'u2l1-note-mistake-2', tone: 'warning',
            text: rich('خطأ: البدء من خانة الآحاد أو من اليمين. الصواب: نبدأ من أعلى منزلة، لأن منزلة واحدة إلى اليسار تساوي عشرة أضعاف التي تليها.'),
          },
          {
            kind: 'note', id: 'u2l1-note-mistake-3', tone: 'warning',
            text: rich('خطأ: الاستمرار في المقارنة بعد أول اختلاف، أو إعلان التساوي لمجرد تساوي أول رقمين. الصواب: أول اختلاف يحسم، والتساوي لا يُعلن إلا بعد فحص كل المنازل.'),
          },
          {
            kind: 'note', id: 'u2l1-note-mistake-4', tone: 'tip',
            text: rich('للتحقق من ترتيب: أعد قراءة القائمة بصوت مرتفع مع كلمة «أصغر من» بين كل عددين متجاورين؛ إن سمعت جملة خاطئة فراجع موضعها.'),
          },
          {
            kind: 'text', id: 'u2l1-text-fraction-habit',
            text: (
              <>
                {rich('ملاحظة عن كتابة الكسور في هذا الدفتر: نكتب الكسر بالصورة المطبوعة نفسها، أي البسط فوق المقام، مثل ')}
                <Frac n="3" d="4" />
                {rich(' وليس 3/4.')}
              </>
            ),
          },
        ],
      },
    ],
  }
}
