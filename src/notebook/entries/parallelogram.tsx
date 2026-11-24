import type { ReactNode } from 'react'
import { MathExpression } from '../../components/MathExpression'
import {
  ConstructionFigure, Ex4Geo, Fig31Five, Fig31Four, Fig31One, Fig31Three, Fig31Two,
  Fig32Check1A, Fig32Check1B, Fig32Check2A, Fig32Check2B, Fig32Check2C, Fig32Main,
  Fig33Check, Fig33Together, Fig34CheckBD, Fig34CheckDraw, Fig35Ex1, Fig35Ex3, Fig35Ex5,
  ModelCard, ex4Cases,
} from '../../lessons/ParallelogramLesson'
import { lessonSevenBookElements, type ParallelogramBookElement } from '../../lessons/parallelogramData'
import { mixed } from '../mixed'
import type { NotebookDoc, NotebookExampleBlock } from '../types'

/**
 * «دفتر الطالب» — الدرس السابع: متوازي الأضلاع (الكتاب ص 31–35).
 *
 * Source of truth: `src/lessons/parallelogramData.ts` — the coverage ledger `lessonSevenBookElements`,
 * where every printed item carries its `prompt`, `answer`, `reasoning[]` and its own `pitfall`.
 * Every question, answer and solution step below is read from that ledger (never retyped), and every
 * figure is the lesson's own `GeoFigure`-based drawing, so the notebook shows the exact geometry the
 * student saw — the same geometry `scripts/lesson-7-check.ts` measures for parallelism, printed angles
 * and one consistent length scale.
 */
const element = (id: string): ParallelogramBookElement => {
  const found = lessonSevenBookElements.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing lesson 7 book element: ${id}`)
  return found
}

const prompt = (id: string): string => element(id).prompt
const answer = (id: string): string => element(id).answer
const reasoning = (id: string): readonly string[] => element(id).reasoning

/** Latin/mathematical runs (AB ∥ DC, ∠A = 70°, 2 × (a + b)) stay in their natural LTR order. */
const math = (value: string, key: string) => <MathExpression key={key}>{value}</MathExpression>

/** Builds a worked example straight from a ledger item: prompt → question, reasoning → steps, answer → answer. */
const exampleFrom = (id: string, title: string, figure?: ReactNode, verification?: ReactNode): NotebookExampleBlock => ({
  kind: 'example',
  id: `l7-ex-${id}`,
  title,
  question: prompt(id),
  figure,
  solution: [...reasoning(id)],
  answer: answer(id),
  verification,
})

/** One «تدرّب ①» blank as a table row: the printed blank and the book answer. */
const blankRow = (id: string): ReactNode[] => [math(prompt(id).replace(/^.*?:\s*/u, ''), `${id}-blank`), math(answer(id), `${id}-answer`)]

export function parallelogramNotebook(): NotebookDoc {
  return {
    lessonId: 'parallelogram',
    lessonTitle: 'متوازي الأضلاع',
    unit: 'الوحدة الأولى',
    pages: 'ص 31–35',
    theme: 'lesson-seven',
    sections: [
      {
        id: 'l7-terms',
        title: 'المفردات والتعريفات',
        blocks: [
          {
            kind: 'text', id: 'l7-text-goals',
            text: <>في هذا الدرس نتعلّم ثلاثة أمور: {answer('l7-p31-goals')}</>,
          },
          {
            kind: 'definition', id: 'l7-def-parallelogram', term: 'متوازي الأضلاع',
            text: answer('l7-p32-definition'),
            source: 'الكتاب · ص 32 (تعلّم ①)',
          },
          {
            kind: 'figure', id: 'l7-figure-main',
            title: 'الشكل: متوازي الأضلاع ABCD',
            figure: <Fig32Main />,
            caption: answer('l7-p32-example'),
            labels: [
              <>الضلعان المتقابلان: <MathExpression>AB</MathExpression> و<MathExpression>DC</MathExpression> (سهم مفرد)، و<MathExpression>AD</MathExpression> و<MathExpression>BC</MathExpression> (سهم مزدوج).</>,
              'الأسهم المتطابقة على ضلعين تعني أن الضلعين متوازيان، وعدد الأسهم يميّز مجموعة عن أخرى.',
              <>الضلعان المتجاوران: ضلعان يشتركان في رأس، مثل <MathExpression>AB</MathExpression> و<MathExpression>BC</MathExpression>.</>,
            ],
          },
          {
            kind: 'example', id: 'l7-ex-example32', title: 'مثال الكتاب (ص 32): لماذا ABCD متوازي أضلاع؟',
            question: prompt('l7-p32-example'),
            figure: <Fig32Main />,
            solution: [...reasoning('l7-p32-example')],
            answer: math(answer('l7-p32-example'), 'ex32'),
          },
          {
            kind: 'definition', id: 'l7-def-diagonal', term: 'قطر متوازي الأضلاع',
            text: answer('l7-p32-diagonal'),
            source: 'الكتاب · ص 32 (تعلّم ①)',
          },
          {
            kind: 'figure', id: 'l7-figure-diagonals',
            title: 'الشكل: قطرا متوازي الأضلاع ABCD',
            figure: <Fig32Main diagonals />,
            caption: answer('l7-p32-diagonal-name'),
            labels: [...reasoning('l7-p32-diagonal-name')],
          },
          {
            kind: 'rule', id: 'l7-rule-notation', title: 'رموز يجب أن تنقلها كما هي',
            text: <>الرمز <MathExpression>∥</MathExpression> يعني «يوازي»، فنكتب <MathExpression>AB ∥ DC</MathExpression>. والرمز <MathExpression>∠A</MathExpression> يعني الزاوية التي رأسها <MathExpression>A</MathExpression>؛ وإذا كُتبت بثلاثة أحرف مثل <MathExpression>∠CBA</MathExpression> فالحرف الأوسط هو الرأس.</>,
          },
        ],
      },
      {
        id: 'l7-recognize',
        title: 'كيف أميّز متوازي الأضلاع؟',
        blocks: [
          {
            kind: 'steps', id: 'l7-steps-recognize', title: 'خطوات الحكم على شكل رباعي',
            steps: [
              'الخطوة ①: هل الشكل رباعي (له أربعة أضلاع وأربعة رؤوس)؟ إن لم يكن رباعياً فهو ليس متوازي أضلاع.',
              'الخطوة ②: هل فيه مجموعتان من الأضلاع المتوازية (كل ضلعين متقابلين متوازيان)؟ مجموعة واحدة لا تكفي.',
              <>الخطوة ③: وضعية الشكل لا تغيّر نوعه؛ فالشكل المائل أو الموضوع على أحد رؤوسه أو المستطيل كلها قد تكون متوازي أضلاع.</>,
            ],
          },
          {
            kind: 'figure', id: 'l7-figure-five-shapes',
            title: 'الأشكال الخمسة كما في الكتاب (ص 31)',
            figure: (
              <>
                <Fig31One /><Fig31Two /><Fig31Three /><Fig31Four /><Fig31Five />
              </>
            ),
            caption: 'انطلاقة نشطة — أ: سمِّ كل ضلعين متوازيين في كل شكل إن وجدا.',
          },
          {
            kind: 'table', id: 'l7-table-five-shapes', title: 'انطلاقة نشطة (ص 31): الأضلاع المتوازية في الأشكال الخمسة',
            headers: ['الشكل', 'الأضلاع المتوازية', 'متوازي أضلاع؟'],
            rows: [
              ['(1) ABCD', math(answer('l7-p31-a-fig1'), 'f1'), 'نعم — مجموعتان'],
              ['(2) EFGH', answer('l7-p31-a-fig2'), 'لا — لا يوجد توازٍ'],
              ['(3) MNKI', math(answer('l7-p31-a-fig3'), 'f3'), 'لا — مجموعة واحدة فقط'],
              ['(4) QROP', math(answer('l7-p31-a-fig4'), 'f4'), 'نعم — المستطيل حالة خاصة'],
              ['(5) SVUT', math(answer('l7-p31-a-fig5'), 'f5'), 'نعم — المعيّن حالة خاصة'],
            ],
            caption: answer('l7-p31-b'),
          },
          {
            kind: 'example', id: 'l7-ex-launch-b', title: 'مثال ① — انطلاقة نشطة (ب) (ص 31)',
            question: prompt('l7-p31-b'),
            solution: [...reasoning('l7-p31-b')],
            answer: answer('l7-p31-b'),
            verification: 'عد المجموعات المتوازية في كل شكل: مطلوب مجموعتان لا واحدة.',
          },
          {
            kind: 'figure', id: 'l7-figure-check1',
            title: 'تحقّق من فهمك ① (ص 32): شكلان يمثّلان متوازي أضلاع',
            figure: (<><Fig32Check1A /><Fig32Check1B /></>),
            labels: [
              mixed('الشكل (1): ', math(answer('l7-p32-check1-fig1'), 'c1a')),
              mixed('الشكل (2): ', math(answer('l7-p32-check1-fig2'), 'c1b')),
            ],
          },
          {
            kind: 'figure', id: 'l7-figure-check2',
            title: 'تحقّق من فهمك ② (ص 32): ثلاثة أشكال ليست متوازي أضلاع',
            figure: (<><Fig32Check2A /><Fig32Check2B /><Fig32Check2C /></>),
            labels: [
              mixed('الشكل (1) — ', answer('l7-p32-check2-fig1')),
              mixed('الشكل (2) — ', math(answer('l7-p32-check2-fig2'), 'c2b')),
              mixed('الشكل (3) — ', answer('l7-p32-check2-fig3')),
            ],
          },
          {
            kind: 'text', id: 'l7-text-life',
            text: mixed(prompt('l7-p31-intro'), ' ', answer('l7-p31-intro')),
          },
        ],
      },
      {
        id: 'l7-properties',
        title: 'خاصتا متوازي الأضلاع',
        blocks: [
          {
            kind: 'steps', id: 'l7-steps-model', title: 'نشاط «اصنع نموذجاً» (ص 33): كيف نكتشف الخاصة الأولى؟',
            steps: [...reasoning('l7-p33-model-steps')],
          },
          {
            kind: 'text', id: 'l7-text-model',
            text: mixed('نصّ النشاط كما في الكتاب: ', prompt('l7-p33-model-steps'), ' النتيجة: ', answer('l7-p33-model-steps')),
          },
          {
            kind: 'figure', id: 'l7-figure-model',
            title: 'بطاقة النموذج: التلوين ثم القص حسب القطر ثم المطابقة',
            figure: (<><ModelCard stage={0} /><ModelCard stage={1} /><ModelCard stage={2} /></>),
            caption: answer('l7-p33-model-steps'),
            labels: [
              mixed('السؤال ①: ', prompt('l7-p33-model-q1'), ' — ', answer('l7-p33-model-q1'), ' (', math('AB = DC', 'model-q1'), ')'),
              mixed('السؤال ②: ', prompt('l7-p33-model-q2'), ' — ', answer('l7-p33-model-q2'), ' (', math('AD = BC', 'model-q2'), ')'),
            ],
          },
          {
            kind: 'rule', id: 'l7-rule-sides', title: 'الخاصة الأولى (الأضلاع)',
            text: mixed(answer('l7-p33-property-sides'), ' ', math('AB = DC و AD = BC', 'rule-sides')),
          },
          {
            kind: 'rule', id: 'l7-rule-angles', title: 'الخاصة الثانية (الزوايا)',
            text: mixed(answer('l7-p33-property-angles'), ' ', math('∠A = ∠C و ∠B = ∠D', 'rule-angles')),
          },
          {
            kind: 'note', id: 'l7-note-adjacent', tone: 'tip',
            text: <>نتيجة مفيدة: الزاويتان المتجاورتان في متوازي الأضلاع متكاملتان، أي مجموعهما <MathExpression>180°</MathExpression>. في شكل الكتاب: <MathExpression>70° + 110° = 180°</MathExpression> و<MathExpression>60° + 120° = 180°</MathExpression>.</>,
          },
          {
            kind: 'figure', id: 'l7-figure-together',
            title: '«لنعمل معاً» (ص 33): الزاوية A قياسها 60°',
            figure: <Fig33Together />,
            caption: 'قِس بالمنقلة ثم قارن الزوايا المتقابلة.',
            labels: [
              mixed('① ', prompt('l7-p33-together-q1'), ' — ', math(answer('l7-p33-together-q1'), 'tq1')),
              mixed('② ', prompt('l7-p33-together-q2'), ' — ', answer('l7-p33-together-q2')),
              mixed('③ ', prompt('l7-p33-together-q3'), ' — ', answer('l7-p33-together-q3')),
            ],
          },
          {
            kind: 'figure', id: 'l7-figure-check33',
            title: 'تحقّق من فهمك (ص 33): ABCD فيه AB = 3cm و BC = 2cm و ∠A = 70° و ∠B = 110°',
            figure: <Fig33Check />,
            caption: 'المعطيات المطبوعة في الكتاب: ضلعان متجاوران وزاويتان متجاورتان، والباقي يُستنتج بالخاصتين.',
          },
          {
            kind: 'table', id: 'l7-table-check33', title: 'تحقّق من فهمك (ص 33): الأجوبة مع التعليل',
            headers: ['المطلوب', 'الجواب', 'التعليل'],
            rows: [
              ['قياس الزاوية C', math('70°', 'a-c'), reasoning('l7-p33-check-angle-c').join(' ')],
              ['قياس الزاوية D', math('110°', 'a-d'), reasoning('l7-p33-check-angle-d').join(' ')],
              ['طول [AD]', math('2cm', 'ad'), reasoning('l7-p33-check-side-ad').join(' ')],
              ['طول [DC]', math('3cm', 'dc'), reasoning('l7-p33-check-side-dc').join(' ')],
            ],
            caption: 'اسأل دائماً: ما الضلع (أو الزاوية) المقابل للمعطى؟ فالمقابل هو الذي يساويه.',
          },
          {
            kind: 'text', id: 'l7-text-oral',
            text: mixed(prompt('l7-p33-oral'), ' ', answer('l7-p33-oral')),
          },
        ],
      },
      {
        id: 'l7-construction',
        title: 'رسم متوازي الأضلاع بالمسطرة والمنقلة',
        blocks: [
          {
            kind: 'steps', id: 'l7-steps-draw', title: 'الخطوات الخمس (ص 34) — مثال الكتاب XYZW',
            steps: [
              mixed('معطيات مثال الكتاب: ', `${prompt('l7-p34-draw-step1').split(':')[0]}.`),
              answer('l7-p34-draw-step1'),
              answer('l7-p34-draw-step2'),
              answer('l7-p34-draw-step3'),
              answer('l7-p34-draw-step4'),
              answer('l7-p34-draw-step5'),
            ],
          },
          {
            kind: 'figure', id: 'l7-figure-construction',
            title: 'مراحل الرسم الخمس كما في الكتاب',
            figure: (
              <>
                <ConstructionFigure step={1} />
                <ConstructionFigure step={2} />
                <ConstructionFigure step={3} />
                <ConstructionFigure step={4} />
                <ConstructionFigure step={5} />
              </>
            ),
            labels: [
              mixed('الخطوة ①: ', answer('l7-p34-draw-step1')),
              mixed('الخطوة ②: ', answer('l7-p34-draw-step2')),
              mixed('الخطوة ③: ', answer('l7-p34-draw-step3')),
              mixed('الخطوة ④: ', answer('l7-p34-draw-step4')),
              mixed('الخطوة ⑤: ', answer('l7-p34-draw-step5')),
            ],
          },
          exampleFrom('l7-p34-check-draw', 'مثال ② — تحقّق من فهمك: ارسم ABCD (ص 34)', <Fig34CheckDraw />,
            'نتحقق من الرسم بقياس الأضلاع الأربعة: يجب أن نجد 4cm و2cm و4cm و2cm، وأن تكون الزاوية عند D مقدارها 125°.'),
          exampleFrom('l7-p34-check-bd', 'مثال ③ — ماذا نسمّي [BD]؟ (ص 34)', <Fig34CheckBD />,
            'الرأسان B وD غير متتاليين (لا يجمعهما ضلع)، فالقطعة الواصلة بينهما قطر.'),
        ],
      },
      {
        id: 'l7-perimeter',
        title: 'محيط متوازي الأضلاع وسلسلة الرباعيات',
        blocks: [
          {
            kind: 'rule', id: 'l7-rule-perimeter', title: 'قانون المحيط',
            text: <>المحيط <MathExpression>= AB + BC + CD + DA</MathExpression>، وبما أن <MathExpression>CD = AB</MathExpression> و<MathExpression>DA = BC</MathExpression> فإن المحيط <MathExpression>= 2 × (AB + BC)</MathExpression>؛ أي ضعف مجموع ضلعين متجاورين.</>,
          },
          exampleFrom('l7-p35-ex3-d', 'مثال ④ — حساب المحيط (ص 35 · تدرّب ③ د)', <Fig35Ex3 />,
            'نتحقق بجمع الأطوال الأربعة واحداً واحداً: 4 + 3 + 4 + 3 = 14cm، وهي النتيجة نفسها التي يعطيها القانون.'),
          {
            kind: 'figure', id: 'l7-figure-chain',
            title: 'سلسلة الرباعيات: من العام إلى الخاص',
            figure: (<><Fig31Three /><Fig31One /><Fig31Four /><Fig31Five /></>),
            caption: 'شبه المنحرف (مجموعة واحدة) ← متوازي الأضلاع (مجموعتان) ← المستطيل (زاوية قائمة) أو المعيّن (ضلعان متجاوران متساويان) ← المربع (الاثنان معاً).',
            labels: [
              'كل مستطيل متوازي أضلاع، لكن ليس كل متوازي أضلاع مستطيلاً.',
              'كل معيّن متوازي أضلاع، لكن ليس كل متوازي أضلاع معيّناً.',
              'كل مربع مستطيل ومعيّن ومتوازي أضلاع في الوقت نفسه.',
            ],
          },
        ],
      },
      {
        id: 'l7-practice',
        title: 'تدرّبات الكتاب المحلولة (ص 35)',
        blocks: [
          {
            kind: 'figure', id: 'l7-figure-ex1',
            title: 'تدرّب ① — الشكل المرافق: WXYZ فيه WZ = 5cm و ZY = 2cm و ∠W = 110° و ∠Z = 70°',
            figure: <Fig35Ex1 />,
            caption: 'انسخ الشكل إلى دفترك ثم املأ الفراغات بالاعتماد على التعريف والخاصتين.',
          },
          {
            kind: 'table', id: 'l7-table-ex1', title: 'تدرّب ① — الفراغات الستة',
            headers: ['الفراغ كما هو مطبوع', 'الجواب'],
            rows: ['l7-p35-ex1-a', 'l7-p35-ex1-b', 'l7-p35-ex1-c', 'l7-p35-ex1-d', 'l7-p35-ex1-e', 'l7-p35-ex1-f'].map(blankRow),
          },
          {
            kind: 'table', id: 'l7-table-ex2', title: 'تدرّب ② — أكمل بعبارات مناسبة',
            headers: ['الفراغ كما هو مطبوع', 'الجواب'],
            rows: ['l7-p35-ex2-a', 'l7-p35-ex2-b'].map(blankRow),
            caption: 'الفرع (أ) يحتاج إلى المعلومتين معاً: التوازي وتساوي الطول.',
          },
          exampleFrom('l7-p35-ex3-a', 'مثال ⑤ — تدرّب ③: تعيين الرأس الرابع D (ص 35)', <Fig35Ex3 />),
          {
            kind: 'table', id: 'l7-table-ex3', title: 'تدرّب ③ — فروع الحل الأربعة',
            headers: ['الفرع', 'المطلوب', 'الجواب'],
            rows: [
              ['أ', prompt('l7-p35-ex3-a'), answer('l7-p35-ex3-a')],
              ['ب', prompt('l7-p35-ex3-b'), answer('l7-p35-ex3-b')],
              ['ج', prompt('l7-p35-ex3-c'), math(answer('l7-p35-ex3-c'), 'ex3c')],
              ['د', prompt('l7-p35-ex3-d'), math(answer('l7-p35-ex3-d'), 'ex3d')],
            ],
            caption: reasoning('l7-p35-ex3-c').join(' '),
          },
          {
            kind: 'figure', id: 'l7-figure-ex4',
            title: 'تدرّب ④ — حالات الرسم الأربع',
            figure: (
              <>
                <Ex4Geo variant="a" />
                <Ex4Geo variant="b" />
                <Ex4Geo variant="c" />
                <Ex4Geo variant="d" />
              </>
            ),
            caption: 'متى يكون الرسم وحيداً؟ إذا أُعطيت زاوية بين ضلعين معلومين فالرسم وحيد (أ، ج، د)، أما إذا أُعطيت الأطوال فقط (ب) فالحلول كثيرة.',
            labels: ([['a', 'أ'], ['b', 'ب'], ['c', 'ج'], ['d', 'د']] as const).map(
              ([variant, letter]) => mixed(`الحالة (${letter}): `, ex4Cases[variant].note),
            ),
          },
          {
            kind: 'table', id: 'l7-table-ex4', title: 'تدرّب ④ — ارسم ABCD في كل حالة',
            headers: ['الفرع', 'المعطيات', 'الحلّ'],
            rows: ([['l7-p35-ex4-a', 'أ'], ['l7-p35-ex4-b', 'ب'], ['l7-p35-ex4-c', 'ج'], ['l7-p35-ex4-d', 'د']] as const).map(
              ([id, branch]) => [branch, math(element(id).title.replace(/^رسم ABCD حيث\s*/u, ''), `${id}-given`), answer(id)],
            ),
          },
          exampleFrom('l7-p35-ex5-a', 'مثال ⑥ — تدرّب ⑤(أ): طول [AB] في شكلين متجاورين (ص 35)', <Fig35Ex5 />,
            'الطول ينتقل عبر الضلع المشترك: AB = DC = EF = 8.'),
          {
            kind: 'table', id: 'l7-table-ex5', title: 'تدرّب ⑤ — الفرع (ب): قياس الزاويتين',
            headers: ['الزاوية', 'القياس', 'التعليل'],
            rows: [
              ['∠CDE', math(answer('l7-p35-ex5-b-cde'), 'ex5-cde'), reasoning('l7-p35-ex5-b-cde').join(' ')],
              ['∠DCB', math(answer('l7-p35-ex5-b-dcb'), 'ex5-dcb'), reasoning('l7-p35-ex5-b-dcb').join(' ')],
            ],
            caption: 'استراتيجية الشكلين المتجاورين: حدّد الضلع المشترك ← انقل المعلومة إليه ← ثم انقلها إلى الشكل الثاني. وللزوايا اسأل أولاً: في أي متوازي أضلاع تقع هذه الزاوية؟',
          },
        ],
      },
      {
        id: 'l7-pitfalls',
        title: 'أخطاء شائعة (من الكتاب ومن حلّ كل بند)',
        blocks: [
          {
            kind: 'table', id: 'l7-table-pitfalls', title: 'جدول الأخطاء الشائعة: انتبه إليها قبل الاختبار',
            headers: ['عند هذا البند', 'انتبه'],
            rows: lessonSevenBookElements
              .filter(item => item.pitfall)
              .map(item => [`${item.section} · ص ${item.page} — ${item.title}`, item.pitfall!]),
            caption: 'كل صف في هذا الجدول خطأ حقيقي رُصد عند حلّ بند معيّن من الكتاب؛ اقرأ الجدول مرة واحدة قبل الاختبار.',
          },
          {
            kind: 'note', id: 'l7-warn-definition', tone: 'warning',
            text: <>لا تحذف كلمة «كلّ» من التعريف؛ فمتوازي الأضلاع هو شكل رباعي فيه <strong>كلّ</strong> ضلعين متقابلين متوازيان. وبحذفها يصبح شبه المنحرف متوازي أضلاع خطأً.</>,
          },
          {
            kind: 'note', id: 'l7-warn-opposite', tone: 'warning',
            text: 'لا تخلط بين الضلعين المتقابلين والضلعين المتجاورين: الخاصة الأولى والزوايا المتقابلة تتحدث عن المتقابلين فقط، أما المحيط فيستعمل ضلعين متجاورين.',
          },
          {
            kind: 'note', id: 'l7-tip-verify', tone: 'tip',
            text: <>طريقة تحقّق سريعة من أي رسم: قِس الضلعين المتقابلين (يجب أن يتساويا) وقِس زاويتين متجاورتين (يجب أن يكون مجموعهما <MathExpression>180°</MathExpression>).</>,
          },
        ],
      },
    ],
  }
}
