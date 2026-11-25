import { Chain, Cmp, Frac, FracBar, FracCircle, rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  fractionsOneBookElementById,
  type FractionsOneBookElement,
} from '../../lessons/fractionsOneData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 4: الكسور (1) (الكتاب ص 54–57).
 *
 * Source of truth: `src/lessons/fractionsOneData.ts`. The three comparison rules, the equivalence
 * rule and every printed example/answer come from that ledger verbatim; the drawings are the
 * notebook's own static fraction circles and bars, because the lesson's drawings are interactive.
 * Fractions are printed stacked (numerator over denominator) exactly as the book prints them.
 */
const item = (id: string): FractionsOneBookElement => {
  const found = fractionsOneBookElementById.get(id)
  if (!found) throw new Error(`missing lesson 12 book element: ${id}`)
  return found
}

const prompt = (id: string): string => item(id).prompt
const answer = (id: string): string => item(id).answer
const rule = (id: string): string => item(id).rule
const why = (id: string): string => item(id).why
const pitfall = (id: string): string => item(id).pitfall
const verification = (id: string): string => item(id).verification
const reasoning = (id: string): readonly string[] => item(id).reasoning

export function fractionsOneNotebook(): NotebookDoc {
  return {
    lessonId: 'fractions-one',
    lessonTitle: 'الكسور (1)',
    unit: 'الوحدة الثانية',
    pages: 'ص 54–57',
    theme: 'lesson-twelve',
    sections: [
      {
        id: 'u2l4-terms',
        purpose: 'record',
        title: 'الكسر: بسط ومقام وماذا يعني كلٌّ منهما',
        blocks: [
          {
            kind: 'text', id: 'u2l4-text-goals',
            text: rich(`${answer('l12-p54-goals')} — ونبدأ بسؤال قالب الحلوى: ${prompt('l12-p54-opening')}`),
          },
          {
            kind: 'definition', id: 'u2l4-def-fraction',
            term: 'البسط والمقام',
            text: rich('الكسر يُكتب بالصورة: البسط فوق المقام. البسط هو عدد الأجزاء التي أخذناها أو لوّنّاها، والمقام هو عدد الأجزاء المتساوية التي قُسّم إليها الكل. فالمقام لا يساوي صفراً أبداً، وكلما كبر المقام صغر حجم الجزء الواحد.'),
            source: 'الكتاب · ص 54 (مدخل الدرس)',
          },
          {
            kind: 'figure', id: 'u2l4-figure-quarters',
            title: 'ثلاثة أرباع: البسط 3 والمقام 4',
            figure: (
              <>
                <FracCircle parts={4} shaded={3} label="دائرة مقسّمة إلى أربعة أجزاء متساوية، ثلاثة منها ملوّنة: ثلاثة أرباع" />
                <FracBar parts={4} shaded={3} label="شريط مقسّم إلى أربعة أجزاء متساوية، ثلاثة منها ملوّنة" />
              </>
            ),
            caption: rich('نقرأ الكسر: ثلاثة أرباع. أي 3 أجزاء من أصل 4 متساوية.'),
            labels: [
              rich('المقام 4 يعني أن الكل قُسّم إلى أربعة أجزاء متساوية الحجم.'),
              rich('البسط 3 يعني أننا أخذنا ثلاثة من هذه الأجزاء.'),
              rich('مع تساوي المقامين نقارن البسطين مباشرة.'),
            ],
          },
          {
            kind: 'figure', id: 'u2l4-figure-fifths',
            title: 'خُمسان: البسط 2 والمقام 5',
            figure: (
              <>
                <FracCircle parts={5} shaded={2} label="دائرة مقسّمة إلى خمسة أجزاء متساوية، جزءان منها ملوّنان: خُمسان" />
                <FracBar parts={5} shaded={2} label="شريط مقسّم إلى خمسة أجزاء متساوية، جزءان منهما ملوّنان" />
              </>
            ),
            caption: rich('نقرأ الكسر: خُمسان. جزءان من أصل خمسة.'),
            labels: [
              rich('الأجزاء هنا أصغر من الأرباع لأن الكل قُسّم إلى خمسة لا إلى أربعة.'),
              rich('لهذا لا يصح القول إن الخُمسين أكبر من الثلاثة أرباع لمجرد أن 5 أكبر من 4.'),
            ],
          },
          {
            kind: 'note', id: 'u2l4-note-opening', tone: 'tip',
            text: rich(`جواب سؤال الافتتاحية: ${answer('l12-p54-opening')} — وقاعدة الاختيار هي توحيد المقامين، لا مقارنة 4 و5.`),
          },
        ],
      },
      {
        id: 'u2l4-rules',
        purpose: 'record',
        title: 'قواعد المقارنة الثلاث (أكتبها بالترتيب)',
        blocks: [
          {
            kind: 'rule', id: 'u2l4-rule-same-den',
            title: '① المقامان متساويان',
            text: rich(`${rule('l12-p54-same-denominator-rule')} لماذا؟ ${why('l12-p54-same-denominator-rule')}`),
          },
          {
            kind: 'rule', id: 'u2l4-rule-multiple-den',
            title: '② مقام أحدهما مضاعف للآخر',
            text: rich(`${rule('l12-p54-multiple-denominator-rule')} ${verification('l12-p54-multiple-denominator-rule')}`),
          },
          {
            kind: 'rule', id: 'u2l4-rule-common-den',
            title: '③ المقامان مختلفان وليس أحدهما مضاعفاً للآخر',
            text: rich(`${prompt('l12-p55-common-denominator-rule')} ${why('l12-p55-common-denominator-rule')}`),
          },
          {
            kind: 'rule', id: 'u2l4-rule-equivalent',
            title: 'الكسر المكافئ: كيف أصنعه؟',
            text: rich(`${rule('l12-p55-equivalent-note')} ${why('l12-p55-equivalent-note')} ${pitfall('l12-p54-multiple-denominator-rule')}`),
          },
          {
            kind: 'note', id: 'u2l4-note-lcm', tone: 'tip',
            text: rich(`${prompt('l12-p55-lcm-note')} ${why('l12-p55-lcm-note')} ${pitfall('l12-p55-lcm-note')}`),
          },
          {
            kind: 'steps', id: 'u2l4-steps-compare',
            title: 'خطوات مقارنة كسرين',
            steps: [
              rich('① افحص المقامين: هل هما متساويان؟ إن كانا كذلك فانتقل مباشرة إلى مقارنة البسطين.'),
              rich('② هل أحد المقامين مضاعف للآخر؟ إن كان كذلك فوسّع الكسر ذا المقام الأصغر إلى المقام الأكبر فقط.'),
              rich('③ إن لم يتحقق ذلك، جد المضاعف المشترك الأصغر للمقامين واستعمله مقاماً مشتركاً.'),
              rich('④ اضرب بسط كل كسر ومقامه بالعامل نفسه لتصل إلى المقام المشترك (لا تغيّر البسط وحده).'),
              rich('⑤ قارن البسطين: الأكبر بسطاً هو الكسر الأكبر، وضع الرمز < أو > أو =.'),
              rich('⑥ تحقق بالتبسيط: أرجع الكسر المكافئ إلى أبسط صورة، يجب أن أحصل على الكسر الأصلي.'),
            ],
          },
          {
            kind: 'note', id: 'u2l4-note-rule-pitfall', tone: 'warning',
            text: rich(`${pitfall('l12-p54-same-denominator-rule')} ${pitfall('l12-p55-common-denominator-rule')}`),
          },
        ],
      },
      {
        id: 'u2l4-figures',
        purpose: 'record',
        title: 'التكافؤ في الرسوم: الشيء نفسه بقطع مختلفة',
        blocks: [
          {
            kind: 'figure', id: 'u2l4-figure-equivalence',
            title: 'ثلاثة أثمان = ستة أسداس عشر',
            figure: (
              <>
                <FracBar parts={8} shaded={3} label="شريط مقسّم إلى ثمانية أجزاء، ثلاثة منها ملوّنة: ثلاثة أثمان" />
                <FracBar parts={16} shaded={6} label="شريط مقسّم إلى ستة عشر جزءاً، ستة منها ملوّنة: ستة أسداس عشر" />
              </>
            ),
            caption: rich(answer('l12-p55-equivalent-note')),
            labels: [
              rich('المساحة الملوّنة متساوية في الشريطين، لكن عدد القطع وحجمها اختلفا.'),
              rich('قاعدة التكافؤ: نضرب البسط والمقام بالعدد نفسه، أو نقسمهما على العدد نفسه.'),
              rich('3 × 2 = 6 و8 × 2 = 16، لهذا ثلاثة أثمان = ستة أسداس عشر.'),
            ],
          },
          {
            kind: 'table', id: 'u2l4-table-equivalent',
            title: 'جدول الكسور المتكافئة المطبوعة (ص 54)',
            headers: ['المعطى في الكتاب', 'العامل المستعمل', 'الكسر المكافئ'],
            rows: [
              [rich('أ · 3/4 = … /8'), rich('نضرب في 2'), rich(answer('l12-p54-equivalent-a'))],
              [rich('ب · 5/8 = 10/…'), rich('نضرب في 2'), rich(answer('l12-p54-equivalent-b'))],
              [rich('ج · 2/5 = …/…'), rich('أي عامل صحيح'), rich(answer('l12-p54-equivalent-c'))],
              [rich('د · 2/10 = 1/…'), rich('نقسم على 2'), rich(answer('l12-p54-equivalent-d'))],
              [rich('هـ · 1/3 = 7/…'), rich('نضرب في 7'), rich(answer('l12-p54-equivalent-e'))],
            ],
            caption: rich('في الفرع (ج) لا توجد إجابة واحدة: كل كسر يُحصل عليه بضرب البسط والمقام في العدد نفسه هو إجابة صحيحة.'),
          },
        ],
      },
      {
        id: 'u2l4-examples',
        purpose: 'practice',
        title: 'أمثلة الكتاب المحلولة',
        blocks: [
          {
            kind: 'example', id: 'u2l4-ex-halves-thirds',
            title: <span>مثال ①: مقارنة <Frac n="2" d="3" /> و<Frac n="1" d="2" /> بالدائرتين</span>,
            question: rich(prompt('l12-p55-example-halves-thirds')),
            figure: (
              <>
                <FracCircle parts={3} shaded={2} label="دائرة إلى أثلاث، اثنان ملوّنان: ثلثان" />
                <FracCircle parts={2} shaded={1} label="دائرة إلى نصفين، واحد ملوّن: نصف" />
              </>
            ),
            solution: [...reasoning('l12-p55-example-halves-thirds')],
            answer: (
              <>
                <Cmp left={<Frac n="2" d="3" />} op=">" right={<Frac n="1" d="2" />} />
                {rich(' لأن 2/3 = 4/6 و1/2 = 3/6.')}
              </>
            ),
            verification: rich(verification('l12-p55-example-halves-thirds')),
          },
          {
            kind: 'example', id: 'u2l4-ex-2-5-1-3',
            title: <span>مثال ②: مقارنة <Frac n="2" d="5" /> و<Frac n="1" d="3" /> بمقام مشترك</span>,
            question: rich(prompt('l12-p55-example-2-5-1-3')),
            solution: [...reasoning('l12-p55-example-2-5-1-3')],
            answer: (
              <>
                <Cmp left={<Frac n="2" d="5" />} op=">" right={<Frac n="1" d="3" />} />
                {rich(' (أي 6/15 مقابل 5/15)')}
              </>
            ),
            verification: rich(verification('l12-p55-example-2-5-1-3')),
          },
          {
            kind: 'example', id: 'u2l4-ex-opening',
            title: 'تطبيق على الافتتاحية: قالب الحلوى',
            question: rich(prompt('l12-p54-opening')),
            solution: [...reasoning('l12-p54-opening')],
            answer: rich(answer('l12-p54-opening')),
            verification: rich(verification('l12-p54-opening')),
          },
          {
            kind: 'example', id: 'u2l4-ex-check-5-9',
            title: <span>تحقّق من فهمك (ص 55) ② · مقارنة <Frac n="5" d="9" /> و<Frac n="1" d="4" /></span>,
            question: rich(prompt('l12-p55-check-2')),
            solution: [...reasoning('l12-p55-check-2')],
            answer: (
              <>
                <Cmp left={<Frac n="5" d="9" />} op=">" right={<Frac n="1" d="4" />} />
                {rich(' لأن التوحيد إلى المقام 36 يعطي 20/36 مقابل 9/36.')}
              </>
            ),
            verification: rich(verification('l12-p55-check-2')),
          },
        ],
      },
      {
        id: 'u2l4-ordering',
        purpose: 'record',
        title: 'ترتيب الكسور',
        blocks: [
          {
            kind: 'rule', id: 'u2l4-rule-order',
            title: 'قاعدة الترتيب',
            text: rich(`${prompt('l12-p56-order-rule')} ${why('l12-p56-order-rule')}`),
          },
          {
            kind: 'steps', id: 'u2l4-steps-order',
            title: 'خطوات ترتيب كسور تصاعدياً أو تنازلياً',
            steps: [
              rich('① حدّد الاتجاه: تصاعدي (من الأصغر إلى الأكبر) أو تنازلي (من الأكبر إلى الأصغر).'),
              rich('② جد المضاعف المشترك الأصغر لكل المقامات — هو المقام المشترك.'),
              rich('③ حوّل كل كسر إلى كسر مكافئ بالمقام المشترك (اضرب البسط والمقام بالعامل نفسه).'),
              rich('④ رتّب البسوط بالاتجاه المطلوب.'),
              rich('⑤ اكتب الكسور الأصلية بالترتيب الموافق للبسوط المرتبة، وليس البسوط نفسها.'),
              rich('⑥ تحقق: أعد كتابة المقارنة بين كل كسرين متجاورين، ويجب أن تكون صحيحة.'),
            ],
          },
          {
            kind: 'example', id: 'u2l4-ex-order',
            title: <span>مثال الكتاب (ص 56): ترتيب <Frac n="3" d="4" /> و<Frac n="1" d="3" /> و<Frac n="5" d="6" /> و<Frac n="7" d="12" /> تصاعدياً</span>,
            question: rich(prompt('l12-p56-order-example')),
            solution: [...reasoning('l12-p56-order-example')],
            answer: <Chain parts={[<Frac key="a" n="1" d="3" />, <Frac key="b" n="7" d="12" />, <Frac key="c" n="3" d="4" />, <Frac key="d" n="5" d="6" />]} ops={['<', '<', '<']} />,
            verification: rich(verification('l12-p56-order-example')),
          },
          {
            kind: 'table', id: 'u2l4-table-order-12',
            title: 'جدول التوحيد إلى المقام 12 (أكتبه بيدي)',
            headers: ['الكسر الأصلي', 'العامل', 'الكسر بالمقام 12', 'البسط'],
            rows: [
              [rich('1/3'), rich('× 4'), rich('4/12'), rich('4')],
              [rich('7/12'), rich('× 1'), rich('7/12'), rich('7')],
              [rich('3/4'), rich('× 3'), rich('9/12'), rich('9')],
              [rich('5/6'), rich('× 2'), rich('10/12'), rich('10')],
            ],
            caption: rich('الترتيب التصاعدي للبسوط 4 < 7 < 9 < 10 يعطي الترتيب نفسه للكسور: 1/3 < 7/12 < 3/4 < 5/6.'),
          },
          {
            kind: 'text', id: 'u2l4-text-order-desc',
            text: rich(`${prompt('l12-p57-verbal')} ${answer('l12-p57-verbal')}`),
          },
        ],
      },
      {
        id: 'u2l4-practice',
        purpose: 'practice',
        title: 'حلول تدريبات الكتاب (ص 54 و57)',
        blocks: [
          {
            kind: 'table', id: 'u2l4-table-compare-54',
            title: 'انسخ وضع الرمز (ص 54)',
            headers: ['الفرع', 'المقارنة', 'الرمز والجواب'],
            rows: [
              ['أ', rich('2/7 و2/7'), rich(answer('l12-p54-compare-a'))],
              ['ب', rich('2/7 و5/7'), rich(answer('l12-p54-compare-b'))],
              ['ج', rich('4/9 و9/9'), rich(answer('l12-p54-compare-c'))],
              ['د', rich('3/4 و1/4'), rich(answer('l12-p54-compare-d'))],
            ],
          },
          {
            kind: 'table', id: 'u2l4-table-compare-57',
            title: 'تدرّب ① (ص 57) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة', 'الجواب'],
            rows: [
              ['أ', rich('3/8 و4/11'), rich(answer('l12-p57-compare-a'))],
              ['ب', rich('2/9 و1/2'), rich(answer('l12-p57-compare-b'))],
              ['ج', rich('5/7 و1/3'), rich(answer('l12-p57-compare-c'))],
              ['د', rich('6/7 و7/9'), rich(answer('l12-p57-compare-d'))],
              ['هـ', rich('5/6 و11/12'), rich(answer('l12-p57-compare-e'))],
            ],
          },
          {
            kind: 'example', id: 'u2l4-ex-ascending',
            title: 'تدرّب (ص 57) · ترتيب تصاعدي',
            question: rich(prompt('l12-p57-order-ascending')),
            solution: [...reasoning('l12-p57-order-ascending')],
            answer: <Chain parts={[<Frac key="a" n="7" d="12" />, <Frac key="b" n="5" d="8" />, <Frac key="c" n="17" d="24" />, <Frac key="d" n="3" d="4" />, <Frac key="e" n="8" d="8" />]} ops={['<', '<', '<', '<']} />,
            verification: rich(verification('l12-p57-order-ascending')),
          },
          {
            kind: 'example', id: 'u2l4-ex-descending',
            title: 'تدرّب (ص 57) · ترتيب تنازلي',
            question: rich(prompt('l12-p57-order-descending')),
            solution: [...reasoning('l12-p57-order-descending')],
            answer: <Chain parts={[<Frac key="a" n="11" d="12" />, <Frac key="b" n="5" d="6" />, <Frac key="c" n="2" d="3" />, <Frac key="d" n="1" d="4" />]} ops={['>', '>', '>']} />,
            verification: rich(verification('l12-p57-order-descending')),
          },
          {
            kind: 'example', id: 'u2l4-ex-check-order',
            title: <span>تحقّق من فهمك (ص 57) · ترتيب <Frac n="3" d="5" /> و<Frac n="11" d="15" /> و<Frac n="2" d="5" /> و<Frac n="1" d="3" /></span>,
            question: rich(prompt('l12-p57-check-order')),
            solution: [...reasoning('l12-p57-check-order')],
            answer: rich(answer('l12-p57-check-order')),
            verification: rich(verification('l12-p57-check-order')),
          },
        ],
      },
      {
        id: 'u2l4-applications',
        purpose: 'practice',
        title: 'تطبيقات حياتية من الكتاب (ص 57)',
        blocks: [
          {
            kind: 'example', id: 'u2l4-ex-distance',
            title: 'تطبيق ① · منزل رهام أقرب',
            question: rich(prompt('l12-p57-distance')),
            solution: [...reasoning('l12-p57-distance')],
            answer: rich(answer('l12-p57-distance')),
            verification: rich(verification('l12-p57-distance')),
          },
          {
            kind: 'example', id: 'u2l4-ex-contest',
            title: 'تطبيق ② · جولة المسابقة الأفضل',
            question: rich(prompt('l12-p57-contest')),
            solution: [...reasoning('l12-p57-contest')],
            answer: rich(answer('l12-p57-contest')),
            verification: rich(verification('l12-p57-contest')),
          },
          {
            kind: 'example', id: 'u2l4-ex-fuel',
            title: 'تطبيق ③ · الطراز الأكثر اقتصادية',
            question: rich(prompt('l12-p57-fuel')),
            solution: [...reasoning('l12-p57-fuel')],
            answer: rich(answer('l12-p57-fuel')),
            verification: rich(verification('l12-p57-fuel')),
          },
          {
            kind: 'note', id: 'u2l4-note-apps', tone: 'tip',
            text: rich('في المسائل الحياتية نكتب أولاً الكسر المقابل لكل حالة، ثم نقارن بالقواعد نفسها؛ ولا نغيّر وحدة القياس أثناء المقارنة (المسافة بالكيلومتر، والوقود بالليتر، والنتيجة بعدد الأسئلة).'),
          },
        ],
      },
      {
        id: 'u2l4-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l4-note-mistake-1', tone: 'warning',
            text: rich(`① ${pitfall('l12-p54-opening')}`),
          },
          {
            kind: 'note', id: 'u2l4-note-mistake-2', tone: 'warning',
            text: rich(`② ${pitfall('l12-p54-multiple-denominator-rule')}`),
          },
          {
            kind: 'note', id: 'u2l4-note-mistake-3', tone: 'warning',
            text: rich(`③ ${pitfall('l12-p56-order-rule')}`),
          },
          {
            kind: 'note', id: 'u2l4-note-mistake-4', tone: 'warning',
            text: rich(`④ ${pitfall('l12-p56-order-example')}`),
          },
          {
            kind: 'note', id: 'u2l4-note-mistake-5', tone: 'tip',
            text: rich('فكرة سريعة للتحقق: إذا كان البسط أصغر من المقام فالكسر أصغر من 1؛ وإذا تساوى البسط والمقام فالكسر = 1؛ وإذا كان البسط أكبر فالكسر أكبر من 1. هذه الفكرة تكشف الخطأ الفادح قبل أي حساب.'),
          },
        ],
      },
    ],
  }
}
