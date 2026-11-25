import type { ReactNode } from 'react'
import { rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  multiplyNaturalNumbersBookElements,
  type MultiplyNaturalNumbersBookElement,
} from '../../lessons/multiplyNaturalNumbersData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 2: ضرب الأعداد الطبيعية (الكتاب ص 48–51).
 *
 * Source of truth: `src/lessons/multiplyNaturalNumbersData.ts`. The multiplicative properties are
 * written down verbatim from the book's own wording (`rule`/`answer`), the column procedure is the
 * one the worked examples follow step by step, and the drills keep the book's answers so a student
 * can compare their own work. The notebook never re-types a number the ledger already holds.
 */
const element = (id: string): MultiplyNaturalNumbersBookElement => {
  const found = multiplyNaturalNumbersBookElements.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing lesson 10 book element: ${id}`)
  return found
}

const prompt = (id: string): string => element(id).prompt
const answer = (id: string): string => element(id).answer
const rule = (id: string): string => element(id).rule
const why = (id: string): string => element(id).why
const pitfall = (id: string): string => element(id).pitfall
const verification = (id: string): string => element(id).verification
const reasoning = (id: string): readonly string[] => element(id).reasoning
/** The printed operation of a drill branch («4 × 921»), kept apart from the group instruction. */
const printed = (id: string): string => element(id).sourceText ?? prompt(id)
/** The numeric product of a drill branch, read from its ledger answer. */
const productOf = (id: string): string => {
  const match = answer(id).match(/\d[\d,]*/u)
  if (!match) throw new Error(`no product in the answer of ${id}: ${answer(id)}`)
  return match[0]
}

/** A drill branch as one table row: the printed operation and its product. */
const drillRow = (id: string, branch: string): ReactNode[] => [rich(branch), rich(printed(id)), rich(`${productOf(id)} — ${answer(id)}`)]

export function multiplyNotebook(): NotebookDoc {
  return {
    lessonId: 'multiply-natural-numbers',
    lessonTitle: 'ضرب الأعداد الطبيعية',
    unit: 'الوحدة الثانية',
    pages: 'ص 48–51',
    theme: 'lesson-ten',
    sections: [
      {
        id: 'u2l2-terms',
        purpose: 'record',
        title: 'ماذا نضرب ولماذا؟',
        blocks: [
          {
            kind: 'text', id: 'u2l2-text-goals',
            text: rich(`${answer('l10-p48-goals')} — ${why('l10-p48-goals')}`),
          },
          {
            kind: 'rule', id: 'u2l2-rule-meaning',
            title: 'معنى الضرب: جمع مختصر',
            text: rich(reasoning('l10-p48-intro').join(' ') + ' ' + answer('l10-p48-intro')),
          },
          {
            kind: 'definition', id: 'u2l2-def-terms',
            term: 'العاملان والناتج',
            text: rich('في العملية 3 × 1320 = 3960 يُسمّى العددان 3 و1320 عاملين، ويُسمّى 3960 ناتج الضرب أو حاصل الضرب. والضرب يُجمع فيه العدد نفسه عدداً من المرات: 3 × 1320 يعني 1320 + 1320 + 1320.'),
            source: 'الكتاب · ص 48',
          },
          {
            kind: 'note', id: 'u2l2-note-carry-habit', tone: 'tip',
            text: rich(`الحمل ليس خطأ بل هو الطريقة الصحيحة: ${why('l10-p48-carry')}`),
          },
        ],
      },
      {
        id: 'u2l2-column',
        purpose: 'record',
        title: 'الضرب العمودي: كيف أرتب الكتابة؟',
        blocks: [
          {
            kind: 'steps', id: 'u2l2-steps-column',
            title: 'خطوات الضرب العمودي عندما يكون العامل الثاني رقماً واحداً',
            steps: [
              rich('أكتب العدد الكبير أولاً، والعامل الصغير تحته، وأحاذي الآحاد تحت الآحاد.'),
              rich('أضرب الآحاد: العامل × رقم الآحاد، وأكتب الناتج في خانة الآحاد وأحمل عشراته.'),
              rich('أنتقل إلى العشرات: العامل × رقم العشرات، وأضيف الحمل إلى الناتج.'),
              rich('أتابع المنازل من اليمين إلى اليسار حتى آخر رقم في العدد.'),
              rich('أكتب الحمل الأخير كما هو لأنه لا منزلة بعده.'),
              rich('أتحقق بالجمع المتكرر أو بالقسمة على أحد العاملين.'),
            ],
          },
          {
            kind: 'steps', id: 'u2l2-steps-two-digits',
            title: 'خطوات الضرب عندما يكون العامل الثاني من خانتين',
            steps: [
              rich('أضرب العدد في رقم الآحاد، وأكتب الناتج الجزئي الأول.'),
              rich('أضرب العدد في رقم العشرات، وأكتب الناتج الجزئي الثاني مُزاحاً منزلة واحدة إلى اليسار (أبدأ الكتابة تحت خانة العشرات).'),
              rich('أجمع الناتجين الجزئيين مع حمل الجمع عند اللزوم.'),
              rich('أتحقق: 425 × 12 = 425 × 10 + 425 × 2 = 4250 + 850 = 5100.'),
            ],
          },
          {
            kind: 'note', id: 'u2l2-note-two-digits', tone: 'warning',
            text: rich(`أشهر خطأ عند العامل ذي الخانتين: ${pitfall('l10-p49-example2')}`),
          },
          {
            kind: 'example', id: 'u2l2-ex-cloth',
            title: 'مثال الكتاب ① (ص 48): ثمن القماش',
            question: rich(prompt('l10-p48-example1')),
            solution: [...reasoning('l10-p48-example1')],
            answer: rich(answer('l10-p48-example1')),
            verification: rich(verification('l10-p48-example1')),
          },
          {
            kind: 'example', id: 'u2l2-ex-yearly',
            title: 'مثال الكتاب ② (ص 49): المصروف السنوي',
            question: rich(prompt('l10-p49-example2')),
            solution: [...reasoning('l10-p49-example2')],
            answer: rich(answer('l10-p49-example2')),
            verification: rich(verification('l10-p49-example2')),
          },
        ],
      },
      {
        id: 'u2l2-patterns',
        purpose: 'record',
        title: 'أنماط تختصر الحساب: العشرة والمئة والألف والصفر',
        blocks: [
          {
            kind: 'rule', id: 'u2l2-rule-powers-ten',
            title: 'الضرب في 10 أو 100 أو 1000',
            text: rich(`${rule('l10-p49-patterns-135')} ${answer('l10-p49-patterns-135')} مثال الكتاب: ${prompt('l10-p49-patterns-135')}`),
          },
          {
            kind: 'rule', id: 'u2l2-rule-tens',
            title: 'الضرب في مضاعفات العشرة (20، 30، …)',
            text: rich(`${rule('l10-p49-patterns-231')} ${why('l10-p49-patterns-231')} مثال الكتاب: ${prompt('l10-p49-patterns-231')}`),
          },
          {
            kind: 'rule', id: 'u2l2-rule-zero',
            title: 'الضرب في الصفر',
            text: rich(`${rule('l10-p49-zero')} ${why('l10-p49-zero')} أمثلة الكتاب: ${prompt('l10-p49-zero')}`),
          },
          {
            kind: 'note', id: 'u2l2-note-zero-vs-add', tone: 'warning',
            text: rich(`${pitfall('l10-p49-zero')} وتذكّر الفرق: 987 + 0 = 987 أما 987 × 0 = 0.`),
          },
          {
            kind: 'table', id: 'u2l2-table-patterns',
            title: 'جدول الأنماط (أملؤه ثم أحفظه)',
            headers: ['العملية', 'كيف أحسبها دون ضرب عمودي؟', 'الناتج'],
            rows: [
              [rich('256 × 10'), rich('أضيف صفراً واحداً'), rich('2560')],
              [rich('135 × 100'), rich('أضيف صفرين'), rich('13500')],
              [rich('135 × 1000'), rich('أضيف ثلاثة أصفار'), rich('135000')],
              [rich('30 × 231'), rich('3 × 231 = 693 ثم أضيف صفراً'), rich('6930')],
              [rich('0 × 987'), rich('الضرب في صفر = صفر'), rich('0')],
            ],
            caption: rich('عدد الأصفار التي أضيفها يساوي عدد أصفار العامل الثاني، ولا أضيف صفراً إذا لم يكن في العامل الثاني أصفار.'),
          },
        ],
      },
      {
        id: 'u2l2-properties',
        purpose: 'record',
        title: 'خواص الضرب الثلاث: أدوات تبسيط لا قواعد حفظ',
        blocks: [
          {
            kind: 'definition', id: 'u2l2-def-commutative',
            term: 'الخاصة التبديلية',
            text: rich(`لأي عددين طبيعيين a وb: a × b = b × a. ${answer('l10-p50-commutative')} مثال الكتاب: ${prompt('l10-p50-commutative')}`),
            source: 'الكتاب · ص 50',
          },
          {
            kind: 'definition', id: 'u2l2-def-associative',
            term: 'الخاصة التجميعية',
            text: rich(`لأي ثلاثة أعداد a وb وc: (a × b) × c = a × (b × c). ${reasoning('l10-p50-associative').join(' ')}`),
            source: 'الكتاب · ص 50',
          },
          {
            kind: 'definition', id: 'u2l2-def-distributive',
            term: 'خاصة التوزيع',
            text: rich(`على الجمع: a × (b + c) = (a × b) + (a × c). وعلى الطرح: a × (b − c) = (a × b) − (a × c). ${answer('l10-p50-distributive')}`),
            source: 'الكتاب · ص 50',
          },
          {
            kind: 'table', id: 'u2l2-table-properties',
            title: 'الخواص الثلاث في جدول واحد',
            headers: ['الخاصية', 'الصيغة', 'ماذا تسمح لي أن أفعل؟'],
            rows: [
              [rich('التبديلية'), rich('a × b = b × a'), rich('أضع العامل الأسهل أولاً؛ فـ 5 × 2000 = 2000 × 5 = 10000')],
              [rich('التجميعية'), rich('(a × b) × c = a × (b × c)'), rich('أختار أي عاملين أضربهما أولاً لأصنع عدداً سهلاً مثل 10')],
              [rich('التوزيع على الجمع'), rich('a × (b + c) = (a × b) + (a × c)'), rich('أفكّك العدد الصعب إلى مجموع سهل: 12 × 101 = 12 × 100 + 12 × 1')],
              [rich('التوزيع على الطرح'), rich('a × (b − c) = (a × b) − (a × c)'), rich('أستعمل العدد السهل القريب: 12 × 99 = 12 × 100 − 12 × 1')],
            ],
            caption: rich(answer('l10-p50-props-note')),
          },
          {
            kind: 'example', id: 'u2l2-ex-associative',
            title: 'أي تجميع أسهل؟ (سؤال الكتاب ص 50)',
            question: rich(prompt('l10-p50-assoc-easiest')),
            solution: [...reasoning('l10-p50-assoc-easiest')],
            answer: rich(answer('l10-p50-assoc-easiest')),
            verification: rich(verification('l10-p50-assoc-easiest')),
          },
          {
            kind: 'note', id: 'u2l2-note-props-pitfall', tone: 'warning',
            text: rich(`${pitfall('l10-p50-associative')} ${pitfall('l10-p50-distributive')}`),
          },
        ],
      },
      {
        id: 'u2l2-examples',
        purpose: 'practice',
        title: 'أمثلة وتحقّق من فهمك — محلولة خطوة بخطوة',
        blocks: [
          {
            kind: 'example', id: 'u2l2-ex-launch-c',
            title: 'تحقّق من فهمك (ص 49) ① · كالسيوم الأسبوع',
            question: rich(prompt('l10-p49-check1')),
            solution: [...reasoning('l10-p49-check1')],
            answer: rich(answer('l10-p49-check1')),
            verification: rich(verification('l10-p49-check1')),
          },
          {
            kind: 'example', id: 'u2l2-ex-check-921',
            title: 'تحقّق من فهمك (ص 49) ② أ · 4 × 921',
            question: rich(printed('l10-p49-check2-a')),
            solution: [...reasoning('l10-p49-check2-a')],
            answer: rich(answer('l10-p49-check2-a')),
            verification: rich(verification('l10-p49-check2-a')),
          },
          {
            kind: 'example', id: 'u2l2-ex-check-217',
            title: 'تحقّق من فهمك (ص 49) ② ب · 14 × 217',
            question: rich(printed('l10-p49-check2-b')),
            solution: [...reasoning('l10-p49-check2-b')],
            answer: rich(answer('l10-p49-check2-b')),
            verification: rich(verification('l10-p49-check2-b')),
          },
          {
            kind: 'example', id: 'u2l2-ex-check-101',
            title: 'تحقّق من فهمك (ص 50) · 12 × 101 ثم 12 × (100 + 1)',
            question: rich(prompt('l10-p50-check1')),
            solution: [...reasoning('l10-p50-check1')],
            answer: rich(answer('l10-p50-check1')),
            verification: rich(verification('l10-p50-check1')),
          },
          {
            kind: 'example', id: 'u2l2-ex-check-99',
            title: 'تحقّق من فهمك (ص 50) · 5 × 99 ثم 5 × (100 − 1)',
            question: rich(prompt('l10-p50-check2')),
            solution: [...reasoning('l10-p50-check2')],
            answer: rich(answer('l10-p50-check2')),
            verification: rich(verification('l10-p50-check2')),
          },
        ],
      },
      {
        id: 'u2l2-practice',
        purpose: 'practice',
        title: 'حلول تدرّبات الكتاب (ص 51)',
        blocks: [
          {
            kind: 'table', id: 'u2l2-table-ex1',
            title: 'تدرّب ① · الضرب العمودي',
            headers: ['الفرع', 'العملية', 'الناتج'],
            rows: [
              drillRow('l10-p51-ex1-a', 'أ'),
              drillRow('l10-p51-ex1-b', 'ب'),
              drillRow('l10-p51-ex1-c', 'ج'),
              drillRow('l10-p51-ex1-d', 'د'),
            ],
            caption: rich('راجع الناتج الجزئي الأول قبل الانتقال: الخطأ الأغلب في هذه التمارين هو نسيان الحمل.'),
          },
          {
            kind: 'table', id: 'u2l2-table-ex2',
            title: 'تدرّب ② · عامل من خانتين أو ثلاثة',
            headers: ['الفرع', 'العملية', 'الناتج'],
            rows: [
              drillRow('l10-p51-ex2-a', 'أ'),
              drillRow('l10-p51-ex2-b', 'ب'),
              drillRow('l10-p51-ex2-c', 'ج'),
              drillRow('l10-p51-ex2-d', 'د'),
            ],
            caption: rich('في الفرع (د) استُعملت خاصية التوزيع على الطرح: 99 = 100 − 1.'),
          },
          {
            kind: 'table', id: 'u2l2-table-ex3',
            title: 'تدرّب ③ · التجميع الأسهل',
            headers: ['الفرع', 'الطريق المختصر', 'الناتج'],
            rows: [
              ['أ', rich(rule('l10-p51-ex3-a')), rich(productOf('l10-p51-ex3-a'))],
              ['ب', rich(rule('l10-p51-ex3-b')), rich(productOf('l10-p51-ex3-b'))],
              ['ج', rich(rule('l10-p51-ex3-c')), rich(productOf('l10-p51-ex3-c'))],
              ['د', rich(rule('l10-p51-ex3-d')), rich(productOf('l10-p51-ex3-d'))],
            ],
          },
          {
            kind: 'table', id: 'u2l2-table-ex4',
            title: 'تدرّب ④ · مساحة ومحيط',
            headers: ['الفرع', 'المطلوب', 'القاعدة'],
            rows: [
              ['أ', rich(answer('l10-p51-ex4-a')), rich(rule('l10-p51-ex4-a'))],
              ['ب', rich(answer('l10-p51-ex4-b')), rich(rule('l10-p51-ex4-b'))],
              ['ج', rich(answer('l10-p51-ex4-c')), rich(rule('l10-p51-ex4-c'))],
            ],
            caption: rich('المساحة = الطول × العرض؛ المحيط = (الطول + العرض) × 2. والفرعان (أ) و(ب) يعطيان المساحة نفسها لأن مساحة الكل = مجموع مساحتي الجزأين.'),
          },
          {
            kind: 'example', id: 'u2l2-ex-ex5',
            title: 'تدرّب ⑤ · نتيجة كريم',
            question: rich(prompt('l10-p51-ex5')),
            solution: [...reasoning('l10-p51-ex5')],
            answer: rich(answer('l10-p51-ex5')),
            verification: rich(verification('l10-p51-ex5')),
          },
        ],
      },
      {
        id: 'u2l2-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l2-note-mistake-1', tone: 'warning',
            text: rich(`① ${pitfall('l10-p48-carry')}`),
          },
          {
            kind: 'note', id: 'u2l2-note-mistake-2', tone: 'warning',
            text: rich(`② ${pitfall('l10-p48-launch-d')} فالضرب تكرار متساوٍ، والجمع ليس كذلك.`),
          },
          {
            kind: 'note', id: 'u2l2-note-mistake-3', tone: 'warning',
            text: rich(`③ ${pitfall('l10-p49-patterns-135')}`),
          },
          {
            kind: 'note', id: 'u2l2-note-mistake-4', tone: 'tip',
            text: rich('للتحقق السريع من أي ناتج: اقسمه على أحد العاملين؛ إن لم تحصل على العامل الآخر فالحساب يحتاج مراجعة.'),
          },
        ],
      },
    ],
  }
}
