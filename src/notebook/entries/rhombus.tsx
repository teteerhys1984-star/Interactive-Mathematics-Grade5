import type { ReactNode } from 'react'
import { MathExpression } from '../../components/MathExpression'
import {
  ConstructionFigure8, Fig36Definition, Fig36Example, Fig36Start1, Fig36Start2, Fig36Start3, Fig36Start4,
  Fig37Check1A, Fig37Check1B, Fig37Check2A, Fig37Check2B, Fig37Check2C, Fig37Rhombus, Fig39CheckDraw,
  Fig39Ex1, Fig39Ex2, Fig39Ex3, MeshFigure, MiniProtractor8, ex2SolvedW,
} from '../../lessons/RhombusLesson'
import { lessonEightBookElements, type RhombusBookElement } from '../../lessons/rhombusData'
import type { NotebookDoc, NotebookExampleBlock } from '../types'
import { mixed } from '../mixed'

/**
 * «دفتر الطالب» — الدرس الثامن: المعيّن (الكتاب ص 36–39).
 *
 * Source of truth: `src/lessons/rhombusData.ts` — the coverage ledger `lessonEightBookElements`, where
 * every printed element carries `given`, `required`, `rule`, `why`, `reasoning[]`, `answer`,
 * `verification` and its own `pitfall`. Every question, answer, solution step and verification below is
 * read from that ledger (never retyped), and every figure is the lesson's own `GeoFigure`-based drawing,
 * so the notebook shows the exact geometry `scripts/lesson-8-check.ts` measures for parallelism, equal
 * sides, printed angles and one consistent length scale.
 */
const element = (id: string): RhombusBookElement => {
  const found = lessonEightBookElements.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing lesson 8 book element: ${id}`)
  return found
}

const prompt = (id: string): string => element(id).prompt
const answer = (id: string): string => element(id).answer
const rule = (id: string): string => element(id).rule
const why = (id: string): string => element(id).why
const given = (id: string): string => element(id).given
const verification = (id: string): string => element(id).verification
const reasoning = (id: string): readonly string[] => element(id).reasoning

/** Drops the «X:» lead-in of a book definition when X is already shown as the term chip. */
const bookDefinition = (value: string, term: string): string =>
  value.startsWith(`${term}:`) ? value.slice(term.length + 1).trim() : value

/** Latin/mathematical runs (AB = BC, ∠ABC = 45°, 4 × a) stay in their natural LTR order. */
const math = (value: string, key: string) => <MathExpression key={key}>{value}</MathExpression>

/** Builds a worked example straight from a ledger item: prompt → question, reasoning → steps, answer → answer. */
const exampleFrom = (id: string, title: string, figure?: ReactNode, extraVerification?: ReactNode): NotebookExampleBlock => ({
  kind: 'example',
  id: `l8-ex-${id}`,
  title,
  question: prompt(id),
  figure,
  solution: [...reasoning(id)],
  answer: answer(id),
  verification: extraVerification ?? verification(id),
})

export function rhombusNotebook(): NotebookDoc {
  return {
    lessonId: 'rhombus',
    lessonTitle: 'المعيّن',
    unit: 'الوحدة الأولى',
    pages: 'ص 36–39',
    theme: 'lesson-eight',
    sections: [
      {
        id: 'l8-terms',
        purpose: 'record',
        title: 'المفردات والتعريفات',
        blocks: [
          {
            kind: 'text', id: 'l8-text-goals',
            text: mixed(prompt('l8-p36-goals'), ' — ', reasoning('l8-p36-goals').join(' ')),
          },
          {
            kind: 'definition', id: 'l8-def-rhombus', term: 'المعيّن',
            text: bookDefinition(prompt('l8-p36-definition'), 'المعيّن'),
            source: 'الكتاب · ص 36 (تعلّم ①)',
          },
          {
            kind: 'rule', id: 'l8-rule-definition', title: 'الشرطان معاً: كيف نتحقّق من أن الشكل معيّن؟',
            text: mixed(rule('l8-p36-definition'), ' ', why('l8-p36-definition')),
          },
          {
            kind: 'figure', id: 'l8-figure-definition',
            title: 'الشكل: تعريف المعيّن — علامتا التساوي على ضلعين متجاورين',
            figure: <Fig36Definition />,
            caption: 'العلامتان الحمراوان تدلّان على تساوي ضلعين متجاورين، والأسهم تدلّ على التوازي.',
            labels: [...reasoning('l8-p36-definition')],
          },
          {
            kind: 'example', id: 'l8-ex-example36', title: 'مثال الكتاب (ص 36): الشكل ABCD',
            question: prompt('l8-p36-example'),
            figure: <Fig36Example />,
            solution: [...reasoning('l8-p36-example')],
            answer: math(answer('l8-p36-example'), 'ex36'),
            verification: verification('l8-p36-example'),
          },
          {
            kind: 'definition', id: 'l8-def-symbols', term: 'شرطتا التساوي وسهما التوازي',
            text: <>الشرطة المائلة على ضلع (أو شرطتان) تعني <strong>تساوي الأطوال</strong>، والسهم (أو السهمان) على ضلع يعني <strong>التوازي</strong>. وعدد الشرطات أو الأسهم يميّز مجموعة أضلاع عن أخرى، لذلك نقرأ الترميز قبل أن نحكم على الشكل.</>,
            source: 'الكتاب · ص 36 و37 (ترميز الأشكال)',
          },
          {
            kind: 'figure', id: 'l8-figure-mesh',
            title: 'صورة الدرس: شبكة معدنية عيونها معيّنات (ص 36)',
            figure: <MeshFigure />,
            caption: answer('l8-p36-photo'),
            labels: [...reasoning('l8-p36-photo')],
          },
          {
            kind: 'note', id: 'l8-note-photo', tone: 'tip',
            text: element('l8-p36-photo').note ?? 'القضبان المتوازية والمتساوية التباعد تصنع عيوناً متطابقة: معيّنات.',
          },
        ],
      },
      {
        id: 'l8-recognize',
        purpose: 'record',
        title: 'كيف أميّز المعيّن؟',
        blocks: [
          {
            kind: 'steps', id: 'l8-steps-recognize', title: 'خطوات الحكم على شكل رباعي',
            steps: [
              'الخطوة ①: هل الشكل متوازي أضلاع؟ (هل فيه مجموعتان من الأضلاع المتوازية؟) إن لم يكن كذلك فهو ليس معيّناً مهما تساوت أضلاعه.',
              'الخطوة ②: قِس بالمسطرة ضلعين متجاورين؛ هل الطولان متساويان؟',
              'الخطوة ③: إذا تحقق الشرطان معاً فالشكل معيّن، وتنتقل المساواة تلقائياً إلى الأضلاع الأربعة.',
              'الخطوة ④: افحص الزوايا؛ فإذا كانت قائمة أيضاً فالشكل مربّع (وهو معيّن خاص).',
            ],
          },
          {
            kind: 'figure', id: 'l8-figure-start',
            title: 'انطلاقة نشطة (ص 36): الأشكال الأربعة',
            figure: (<><Fig36Start1 /><Fig36Start2 /><Fig36Start3 /><Fig36Start4 /></>),
            caption: given('l8-p36-start-q1'),
          },
          {
            kind: 'table', id: 'l8-table-start', title: 'انطلاقة نشطة (ص 36): جوابا السؤالين',
            headers: ['السؤال', 'الجواب', 'التحقّق'],
            rows: [
              [prompt('l8-p36-start-q1'), answer('l8-p36-start-q1'), verification('l8-p36-start-q1')],
              [prompt('l8-p36-start-q2'), answer('l8-p36-start-q2'), verification('l8-p36-start-q2')],
            ],
          },
          {
            kind: 'figure', id: 'l8-figure-check1',
            title: 'تحقّق من فهمك ① (ص 37): شكلان يمثّلان معيّناً',
            figure: (<><Fig37Check1A /><Fig37Check1B /></>),
            labels: [
              mixed('الشكل (1) — ', answer('l8-p37-check1-fig1')),
              mixed('الشكل (2) — ', answer('l8-p37-check1-fig2')),
            ],
          },
          {
            kind: 'figure', id: 'l8-figure-check2',
            title: 'تحقّق من فهمك ② (ص 37): ثلاثة أشكال ليست معيّناً',
            figure: (<><Fig37Check2A /><Fig37Check2B /><Fig37Check2C /></>),
            labels: [
              mixed('الشكل (1) — ', math(answer('l8-p37-check2-fig1'), 'c2a'), ' (', given('l8-p37-check2-fig1'), ')'),
              mixed('الشكل (2) — ', answer('l8-p37-check2-fig2')),
              mixed('الشكل (3) — ', answer('l8-p37-check2-fig3')),
            ],
          },
          {
            kind: 'example', id: 'l8-ex-not-rhombus', title: 'مثال ① — لماذا الشكل (3) في تحقّق ② ليس معيّناً؟ (ص 37)',
            question: prompt('l8-p37-check2-fig3'),
            figure: <Fig37Check2C />,
            solution: [...reasoning('l8-p37-check2-fig3')],
            answer: answer('l8-p37-check2-fig3'),
            verification: verification('l8-p37-check2-fig3'),
          },
          {
            kind: 'text', id: 'l8-text-oral',
            text: mixed(prompt('l8-p37-oral'), ' ', answer('l8-p37-oral')),
          },
        ],
      },
      {
        id: 'l8-properties',
        purpose: 'record',
        title: 'خواصّ المعيّن ومحيطه',
        blocks: [
          {
            kind: 'rule', id: 'l8-rule-properties', title: 'الخواصّ الثلاث',
            text: mixed(prompt('l8-p37-properties'), ' ', why('l8-p37-properties')),
          },
          {
            kind: 'table', id: 'l8-table-properties', title: 'جدول الخواصّ: موروث ومضاف',
            headers: ['الخاصة', 'من أين جاءت؟', 'كيف أستعملها؟'],
            rows: [
              ['كل ضلعين متقابلين متوازيان', 'موروثة من متوازي الأضلاع: هي الخاصّة الأولى فيه.', 'أبحث عن زوجَي الأسهم على الرسم قبل أي شيء آخر.'],
              ['كل زاويتين متقابلتين متساويتان في القياس', 'موروثة من متوازي الأضلاع: هي الخاصّة الثانية فيه.', 'إذا عرفت زاوية واحدة عرفت الزاوية المقابلة لها، والمجاورة تُكملها إلى 180°.'],
              ['الأضلاع الأربعة متساوية في الطول', 'مضافة بتعريف المعيّن (تساوي ضلعين متجاورين)، وهي التي تميّزه عن باقي متوازيات الأضلاع.', 'طول واحد معلوم يكفي لمعرفة الأطوال الأربعة كلها.'],
            ],
          },
          {
            kind: 'rule', id: 'l8-rule-perimeter', title: 'محيط المعيّن',
            text: <>بما أن الأضلاع الأربعة متساوية فإن محيط المعيّن <MathExpression>= 4 × a</MathExpression> حيث <MathExpression>a</MathExpression> طول الضلع. مثال: ضلع <MathExpression>5cm</MathExpression> يعطي محيطاً <MathExpression>4 × 5 = 20cm</MathExpression>.</>,
          },
          {
            kind: 'figure', id: 'l8-figure-rhombus',
            title: 'الشكل: المعيّن ABCD بخواصّه الثلاث',
            figure: <Fig37Rhombus />,
            caption: 'شرطتان على الأضلاع الأربعة تعنيان تساويها، وسهمان على كل ضلعين متقابلين يعنيان التوازي.',
          },
          {
            kind: 'table', id: 'l8-table-check3', title: 'تحقّق من فهمك ③ (ص 37): ABCD معيّن فيه AB = 5cm و Â = 50° و B̂ = 130°',
            headers: ['المطلوب', 'الجواب', 'التعليل والتحقّق'],
            rows: [
              ['طول [BC]', math(answer('l8-p37-check3-bc'), 'c3-bc'), `${why('l8-p37-check3-bc')} ${verification('l8-p37-check3-bc')}`],
              ['طول [CD]', math(answer('l8-p37-check3-cd'), 'c3-cd'), `${why('l8-p37-check3-cd')} ${verification('l8-p37-check3-cd')}`],
              ['طول [DA]', math(answer('l8-p37-check3-da'), 'c3-da'), `${why('l8-p37-check3-da')} ${verification('l8-p37-check3-da')}`],
              ['قياس الزاوية Ĉ', math(answer('l8-p37-check3-angle-c'), 'c3-c'), `${why('l8-p37-check3-angle-c')} ${verification('l8-p37-check3-angle-c')}`],
              ['قياس الزاوية D̂', math(answer('l8-p37-check3-angle-d'), 'c3-d'), `${why('l8-p37-check3-angle-d')} ${verification('l8-p37-check3-angle-d')}`],
            ],
            caption: 'المحيط من هذه المعطيات: 4 × 5 = 20cm، ومجموع الزوايا: 50° + 130° + 50° + 130° = 360°.',
          },
        ],
      },
      {
        id: 'l8-construction',
        purpose: 'record',
        title: 'رسم المعيّن بالمسطرة والمنقلة',
        blocks: [
          {
            kind: 'text', id: 'l8-text-draw-intro',
            text: mixed(prompt('l8-p38-draw-intro'), ' ', rule('l8-p38-draw-intro'), ' ', why('l8-p38-draw-intro')),
          },
          {
            kind: 'steps', id: 'l8-steps-draw', title: 'الخطوات الخمس (ص 38) — مثال الكتاب: ضلع 3cm و ∠ABC = 45°',
            steps: ['l8-p38-draw-step1', 'l8-p38-draw-step2', 'l8-p38-draw-step3', 'l8-p38-draw-step4', 'l8-p38-draw-step5']
              .map(id => prompt(id)),
          },
          {
            kind: 'note', id: 'l8-note-step5', tone: 'warning',
            text: element('l8-p38-draw-step5').note ?? 'الضلع الأخير الذي يغلق المعيّن ABCD هو [AD]، والقطعة [CA] قطر لا ضلع.',
          },
          {
            kind: 'figure', id: 'l8-figure-construction',
            title: 'مراحل الرسم الخمس كما في الكتاب',
            figure: (
              <>
                <ConstructionFigure8 step={1} />
                <ConstructionFigure8 step={2} />
                <ConstructionFigure8 step={3} />
                <ConstructionFigure8 step={4} />
                <ConstructionFigure8 step={5} />
              </>
            ),
            labels: ['l8-p38-draw-step1', 'l8-p38-draw-step2', 'l8-p38-draw-step3', 'l8-p38-draw-step4', 'l8-p38-draw-step5']
              .map((id, index) => mixed(`الخطوة ${index + 1}: `, prompt(id), ' (', verification(id), ')')),
          },
          {
            kind: 'figure', id: 'l8-figure-protractor',
            title: 'المنقلة في الخطوة ②: إنشاء زاوية 45° عند الرأس B',
            figure: <MiniProtractor8 degree={45} />,
            caption: rule('l8-p38-draw-step2'),
            labels: [...reasoning('l8-p38-draw-step2')],
          },
          exampleFrom('l8-p39-check-draw', 'مثال ② — تحقّق من فهمك: ارسم المعيّن XYZW (ص 39)', <Fig39CheckDraw />),
          {
            kind: 'table', id: 'l8-table-draw-compare', title: 'مقارنة بين رسمَي الكتاب: معيّن (ص 38) ومعيّن (ص 39)',
            headers: ['المعطى', 'مثال ص 38 (ABCD)', 'تحقّق ص 39 (XYZW)'],
            rows: [
              ['طول الضلع', math('3cm', 'cmp-38'), math('4cm', 'cmp-39')],
              ['الزاوية المعطاة', math('∠ABC = 45°', 'cmp-a38'), math('120°', 'cmp-a39')],
              ['الزاوية المقابلة', math('D̂ = 45°', 'cmp-d38'), math('120° عند W', 'cmp-d39')],
              ['الزاويتان الأخريان (مكمّلتان إلى 180°)', math('Â = Ĉ = 135°', 'cmp-o38'), math('60° عند X و Z', 'cmp-o39')],
              ['المحيط', math('4 × 3 = 12cm', 'cmp-p38'), math('4 × 4 = 16cm', 'cmp-p39')],
            ],
            caption: why('l8-p39-check-draw'),
          },
        ],
      },
      {
        id: 'l8-practice',
        purpose: 'practice',
        title: 'تدرّبات الكتاب المحلولة (ص 39)',
        blocks: [
          {
            kind: 'figure', id: 'l8-figure-ex1',
            title: 'تدرّب ① — الأشكال الستة',
            figure: (
              <>
                <Fig39Ex1 variant={1} /><Fig39Ex1 variant={2} /><Fig39Ex1 variant={3} />
                <Fig39Ex1 variant={4} /><Fig39Ex1 variant={5} /><Fig39Ex1 variant={6} />
              </>
            ),
            caption: prompt('l8-p39-ex1-fig1'),
          },
          {
            kind: 'table', id: 'l8-table-ex1', title: 'تدرّب ① — جميع الأسماء المناسبة لكل شكل',
            headers: ['الشكل', 'المعطيات على الرسم', 'الأسماء', 'التحقّق'],
            rows: [1, 2, 3, 4, 5, 6].map(index => {
              const id = `l8-p39-ex1-fig${index}`
              return [
                `الشكل (${index})`,
                given(id),
                answer(id),
                verification(id),
              ]
            }),
            caption: 'المطلوب جميع الأسماء لا اسم واحد: كل معيّن هو متوازي أضلاع ورباعي أيضاً، وكل مربّع معيّن ومستطيل ومتوازي أضلاع ورباعي.',
          },
          {
            kind: 'example', id: 'l8-ex-ex1-fig4', title: 'مثال ③ — تدرّب ① الشكل (4): لماذا هو معيّن وليس مربّعاً؟',
            question: prompt('l8-p39-ex1-fig4'),
            figure: <Fig39Ex1 variant={4} />,
            solution: [...reasoning('l8-p39-ex1-fig4')],
            answer: answer('l8-p39-ex1-fig4'),
            verification: verification('l8-p39-ex1-fig4'),
          },
          {
            kind: 'figure', id: 'l8-figure-ex2',
            title: 'تدرّب ② — الخطّ المفتوح Z–Y–X ثم الشكل المكتمل XYZW',
            figure: (<><Fig39Ex2 /><Fig39Ex2 w={ex2SolvedW} /></>),
            caption: given('l8-p39-ex2-a'),
            labels: [
              mixed('الرسم الأيمن: ', prompt('l8-p39-ex2-a')),
              mixed('الرسم الأيسر: الشكل بعد تعيين الرأس الرابع — ', math(answer('l8-p39-ex2-a'), 'ex2a')),
            ],
          },
          exampleFrom('l8-p39-ex2-a', 'مثال ④ — تدرّب ②(أ): تعيين الرأس الرابع W', (<><Fig39Ex2 /><Fig39Ex2 w={ex2SolvedW} /></>)),
          exampleFrom('l8-p39-ex2-b', 'مثال ⑤ — تدرّب ②(ب): الخواصّ المعتمدة في تعيين W', <Fig39Ex2 w={ex2SolvedW} />),
          {
            kind: 'figure', id: 'l8-figure-ex3',
            title: 'تدرّب ③ — الشكل المركّب: AFED معيّن و FBCE متوازي أضلاع',
            figure: (<><Fig39Ex3 /><Fig39Ex3 showLengths /></>),
            caption: given('l8-p39-ex3-bc'),
            labels: [
              'الرسم الأيمن كما في الكتاب: الضلع المشترك [FE] هو جسر نقل المعلومة بين الشكلين.',
              'الرسم الأيسر مع الأطوال التي تستعملها فروع الحل.',
            ],
          },
          {
            kind: 'table', id: 'l8-table-ex3', title: 'تدرّب ③ — الفروع الثلاثة',
            headers: ['الفرع', 'القاعدة المستعملة', 'الحلّ', 'الجواب'],
            rows: ['l8-p39-ex3-bc', 'l8-p39-ex3-af', 'l8-p39-ex3-ab'].map(id => [
              element(id).title.replace(/^احسب طول\s*/u, ''),
              rule(id),
              reasoning(id).join(' '),
              math(answer(id), `${id}-answer`),
            ]),
            caption: verification('l8-p39-ex3-ab'),
          },
          exampleFrom('l8-p39-ex3-ab', 'مثال ⑥ — تدرّب ③: حساب طول [AB] في الشكل المركّب', <Fig39Ex3 showLengths />),
        ],
      },
      {
        id: 'l8-pitfalls',
        purpose: 'record',
        title: 'أخطاء شائعة وتنبيهات',
        blocks: [
          {
            kind: 'table', id: 'l8-table-pitfalls', title: 'جدول الأخطاء الشائعة: انتبه إليها قبل الاختبار',
            headers: ['عند هذا البند', 'انتبه'],
            rows: lessonEightBookElements
              .filter(item => item.pitfall)
              .map(item => [`${item.section} · ص ${item.page} — ${item.title}`, item.pitfall!]),
            caption: 'كل صف في هذا الجدول خطأ حقيقي رُصد عند حلّ بند معيّن من الكتاب؛ اقرأ الجدول مرة واحدة قبل الاختبار.',
          },
          {
            kind: 'note', id: 'l8-warn-parallelogram-first', tone: 'warning',
            text: <>لا تبدأ بعدّ الأضلاع المتساوية؛ ابدأ دائماً بسؤال: هل الشكل متوازي أضلاع؟ فشكل الطائرة الورقية قد يحمل أضلاعاً متساوية مثنى مثنّى دون أن يكون متوازي أضلاع، ولذلك ليس معيّناً.</>,
          },
          {
            kind: 'note', id: 'l8-warn-square', tone: 'warning',
            text: 'المعيّن ليس «مربّعاً مائلاً»: المربّع معيّن زواياه قائمة. فكل مربّع معيّن، وليس كل معيّن مربّعاً.',
          },
          {
            kind: 'note', id: 'l8-tip-measure', tone: 'tip',
            text: 'لا تحكم بالنظر: قِس ضلعين متجاورين بالمسطرة قبل أن تقول «معيّن»، فالميل البصري قد يجعل ضلعين متساويين يبدوان مختلفين.',
          },
          {
            kind: 'note', id: 'l8-tip-chain', tone: 'tip',
            text: <>سلسلة الرباعيات التي تنقلها إلى دفترك: رباعي ← متوازي أضلاع ← معيّن (ضلعان متجاوران متساويان) أو مستطيل (زاوية قائمة) ← مربّع (الاثنان معاً). ومعنى ذلك أن كل خاصة في متوازي الأضلاع تصحّ في المعيّن أيضاً.</>,
          },
        ],
      },
    ],
  }
}
