import { GeoFigure } from '../../components/lesson/GeoFigure'
import { DotGrid, rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  check1Reasons,
  findSquareElement,
  p82Check1Shapes,
  p82OralQuestions,
  p82Properties,
  p82WhyNotShapes,
  p83Steps,
  p84Ex1Statements,
  p84Ex3Cases,
  p84Ex4Lengths,
  whyNotReasons,
} from '../../lessons/squareData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 10: المربّع (الكتاب ص 81–84).
 *
 * Source of truth: `src/lessons/squareData.ts`. The two equivalent definitions, the three properties,
 * the five construction steps, the «لماذا ليس مربّعاً؟» reasons and every exercise answer come from
 * that ledger. The drawings use the shared `GeoFigure` renderer (equal-side ticks, right-angle
 * squares) and the notebook's static dot grid for تدرّب ②.
 */
const prompt = (id: string): string => findSquareElement(id).prompt
const answer = (id: string): string => findSquareElement(id).answer
const rule = (id: string): string => findSquareElement(id).rule
const why = (id: string): string => findSquareElement(id).why
const pitfall = (id: string): string => findSquareElement(id).pitfall ?? ''
const check = (id: string): string => findSquareElement(id).check

/** A square ABCD drawn with four equal-side ticks and four right angles. */
function SquareFigure({ side = '3cm', name = 'ABCD' }: { side?: string; name?: string }) {
  const [a, b, c, d] = name.split('') as [string, string, string, string]
  return (
    <GeoFigure
      pts={{ [a]: { x: 50, y: 160 }, [b]: { x: 210, y: 160 }, [c]: { x: 210, y: 40 }, [d]: { x: 50, y: 40 } }}
      order={[a, b, c, d]}
      width={260}
      height={200}
      ticks={[{ side: [a, b], count: 1 }, { side: [b, c], count: 1 }, { side: [c, d], count: 1 }, { side: [d, a], count: 1 }]}
      right={[{ at: a, from: d, to: b }, { at: b, from: a, to: c }, { at: c, from: b, to: d }, { at: d, from: a, to: c }]}
      sides={[{ side: [a, b], label: side }, { side: [b, c], label: side }]}
      ariaLabel={`مربّع ${name} طول ضلعه ${side}، أضلاعه الأربعة متساوية (شرطة واحدة على كل ضلع) وزواياه الأربع قائمة`}
    />
  )
}

export function squareNotebook(): NotebookDoc {
  return {
    lessonId: 'square',
    lessonTitle: 'المربّع',
    unit: 'الوحدة الثانية',
    pages: 'ص 81–84',
    theme: 'lesson-square',
    sections: [
      {
        id: 'u2l10-terms',
        purpose: 'record',
        title: 'تعريفا المربّع: طريقان إلى الشيء نفسه',
        blocks: [
          {
            kind: 'text', id: 'u2l10-text-goals',
            text: rich(`${prompt('sq-p81-goals')} — ${why('sq-p81-goals')}`),
          },
          {
            kind: 'definition', id: 'u2l10-def-rectangle-way',
            term: 'التعريف الأول: مستطيل تساوى بعداه',
            text: rich('المربّع هو مستطيل تساوى بعداه، أي إن أضلاعه الأربعة متساوية وهو في الوقت نفسه مستطيل. فكل مربّع مستطيل، وليس كل مستطيل مربّعاً.'),
            source: 'الكتاب · ص 81',
          },
          {
            kind: 'definition', id: 'u2l10-def-rhombus-way',
            term: 'التعريف الثاني: معيّن فيه زاوية قائمة',
            text: rich('أو هو معيّن فيه زاوية قائمة، أي متوازي أضلاع أضلاعه متساوية وفيه زاوية قائمة. فكل مربّع معيّن، وليس كل معيّن مربّعاً.'),
            source: 'الكتاب · ص 81',
          },
          {
            kind: 'rule', id: 'u2l10-rule-family',
            title: 'موقع المربّع في عائلة الأشكال',
            text: rich('المربّع يجمع خاصّتي المستطيل والمعيّن معاً: هو مستطيل تساوى بعداه، ومعيّن فيه زاوية قائمة. لذلك كل مربّع هو متوازي أضلاع ومستطيل ومعيّن في الوقت نفسه، وليس كل واحد منها مربّعاً.'),
          },
          {
            kind: 'table', id: 'u2l10-table-family',
            title: 'جدول العائلة: من يحقق ماذا؟',
            headers: ['الشكل', 'متوازي أضلاع', 'زوايا قائمة', 'أضلاع أربعة متساوية', 'هل هو مربّع؟'],
            rows: [
              [rich('متوازي أضلاع عام'), rich('نعم'), rich('لا بالضرورة'), rich('لا بالضرورة'), rich('لا')],
              [rich('مستطيل'), rich('نعم'), rich('نعم'), rich('لا بالضرورة'), rich('فقط إذا تساوت أبعاده')],
              [rich('معيّن'), rich('نعم'), rich('لا بالضرورة'), rich('نعم'), rich('فقط إذا فيه زاوية قائمة')],
              [rich('مربّع'), rich('نعم'), rich('نعم'), rich('نعم'), rich('نعم')],
            ],
            caption: rich('الشرطان معاً (تساوي الأضلاع + الزاوية القائمة) هما ما يجعل الشكل مربّعاً بلا لبس.'),
          },
          {
            kind: 'figure', id: 'u2l10-figure-square',
            title: 'الشكل: المربّع ABCD',
            figure: <SquareFigure name="ABCD" />,
            caption: rich(answer('sq-p81-definition')),
            labels: [
              rich('الشرطة الواحدة على كل ضلع تعني أن الأضلاع الأربعة متساوية الطول.'),
              rich('المربع الصغير في كل رأس يعني زاوية قائمة قياسها 90°.'),
              rich('المربّع يجمع علامتي التساوي والتوازي معاً.'),
            ],
          },
          {
            kind: 'note', id: 'u2l10-note-tiles', tone: 'tip',
            text: rich(`${prompt('sq-p81-tile-entry')} ${answer('sq-p81-tile-entry')}`),
          },
        ],
      },
      {
        id: 'u2l10-properties',
        purpose: 'record',
        title: 'خواصّ المربّع الثلاث',
        blocks: [
          {
            kind: 'rule', id: 'u2l10-rule-properties',
            title: 'الخواص الثلاث',
            text: rich(`${prompt('sq-p82-properties')} ${why('sq-p82-properties')}`),
          },
          {
            kind: 'steps', id: 'u2l10-steps-properties',
            title: 'الخواص الثلاث كما أكتبها في الدفتر',
            steps: p82Properties.map(property => rich(property)),
          },
          {
            kind: 'table', id: 'u2l10-table-properties',
            title: 'ما يصح وما لا يصح في المربّع',
            headers: ['العبارة', 'هل تصح لكل مربّع؟', 'التعليل'],
            rows: [
              [rich('كل ضلعين متقابلين متوازيان'), rich('نعم'), rich('خاصية متوازي الأضلاع')],
              [rich('أضلاعه الأربعة متساوية الطول'), rich('نعم'), rich('شرط «تساوى البعدين» في التعريف')],
              [rich('زواياه الأربع قائمة'), rich('نعم'), rich('شرط الزاوية القائمة في التعريف')],
              [rich('قطراه متعامدان دائماً'), rich('لا يُدرَّس في هذا الدرس'), rich('لا نستعمله في الصف الخامس')],
              [rich('فيه زوج واحد فقط من الأضلاع المتوازية'), rich('لا'), rich('المربّع متوازي أضلاع فيه زوجان')],
              [rich('ضلعان متجاوران فقط متساويان'), rich('لا'), rich('الأربعة متساوية')],
            ],
            caption: rich('كل خاصية تنفي شرطاً من شرطي التعريف تُخرج الشكل من عائلة المربّع.'),
          },
          {
            kind: 'table', id: 'u2l10-table-oral',
            title: 'التعبير الشفهي (ص 82)',
            headers: ['السؤال', 'الجواب'],
            rows: p82OralQuestions.map(question => [rich(question.prompt), rich(question.answer)]),
          },
        ],
      },
      {
        id: 'u2l10-recognise',
        purpose: 'record',
        title: 'كيف أحكم: مربّع أم لا؟',
        blocks: [
          {
            kind: 'steps', id: 'u2l10-steps-recognise',
            title: 'خطوات الحكم على شكل رباعي',
            steps: [
              rich('① افحص التوازي: هل كل ضلعين متقابلين متوازيان؟ إن لم يكن فالشكل ليس مربّعاً.'),
              rich('② افحص الأطوال: هل الأضلاع الأربعة متساوية؟ اقرأ علامات الشرطات على الرسم.'),
              rich('③ افحص الزاوية: هل فيه زاوية قائمة معلّمة؟'),
              rich('④ إذا تحققت الشروط الثلاثة فالشكل مربّع؛ وإذا تحقق شرطان فقط فراجع نوع الشكل (مستطيل أم معيّن أم متوازي أضلاع).'),
            ],
          },
          {
            kind: 'table', id: 'u2l10-table-opening',
            title: 'انطلاقة نشطة (ص 81): الأشكال السبعة',
            headers: ['السؤال', 'الجواب'],
            rows: [
              [rich(prompt('sq-p81-opening-q1')), rich(answer('sq-p81-opening-q1'))],
              [rich(prompt('sq-p81-opening-q3')), rich(answer('sq-p81-opening-q3'))],
            ],
            caption: rich('الشكلان (2) و(5) يحققان تعريفَي المربّع معاً؛ لذلك تتفق الإجابتان مهما بدأنا من التعريف الأول أو الثاني.'),
          },
          {
            kind: 'table', id: 'u2l10-table-check1',
            title: 'تحقّق من فهمك (ص 82) · لماذا هو مربّع؟',
            headers: ['الشكل', 'الوصف', 'التعليل'],
            rows: p82Check1Shapes.map(shape => [rich(shape.label), rich(shape.description), rich(shape.answers.map(id => check1Reasons.find(reason => reason.id === id)?.text ?? id).join('، '))]),
            caption: rich(answer('sq-p82-check1')),
          },
          {
            kind: 'table', id: 'u2l10-table-whynot',
            title: 'تحقّق من فهمك (ص 82) · لماذا ليس مربّعاً؟',
            headers: ['الشكل', 'السبب', 'التعليل'],
            rows: p82WhyNotShapes.map(shape => [
              rich(shape.label),
              rich(whyNotReasons.find(reason => reason.id === shape.reason)?.text ?? shape.reason),
              rich(shape.description),
            ]),
            caption: rich(answer('sq-p82-check2')),
          },
          {
            kind: 'note', id: 'u2l10-note-whynot', tone: 'warning',
            text: rich(pitfall('sq-p82-check2')),
          },
        ],
      },
      {
        id: 'u2l10-construction',
        purpose: 'record',
        title: 'رسم المربّع (ص 83)',
        blocks: [
          {
            kind: 'steps', id: 'u2l10-steps-construction',
            title: 'خطوات رسم مربّع طول ضلعه 3cm',
            steps: p83Steps.map(step => rich(step.text)),
          },
          {
            kind: 'figure', id: 'u2l10-figure-construction',
            title: 'الناتج: المربّع ABCD طول ضلعه 3cm',
            figure: <SquareFigure name="ABCD" />,
            caption: rich(answer('sq-p83-construction')),
            labels: [
              rich('نبدأ بالضلع [AB] بطول 3cm، ثم نقيم عمودين متقابلين من A ومن B.'),
              rich('نعيّن النقطتين C وD على العمودين بالطول نفسه 3cm.'),
              rich('نتحقق بالمسطرة من DC = 3cm وبالمنقلة من D̂ = Ĉ = 90°.'),
            ],
          },
          {
            kind: 'figure', id: 'u2l10-figure-draw',
            title: 'تدرّب على الرسم (ص 84): مربّع ضلعه 4cm',
            figure: <SquareFigure name="ABCD" side="4cm" />,
            caption: rich(answer('sq-p84-check-draw')),
          },
          {
            kind: 'note', id: 'u2l10-note-construction', tone: 'warning',
            text: rich(pitfall('sq-p83-construction')),
          },
        ],
      },
      {
        id: 'u2l10-practice',
        purpose: 'practice',
        title: 'حلول تدرّبات ص 84',
        blocks: [
          {
            kind: 'table', id: 'u2l10-table-ex1',
            title: 'تدرّب ① · صح أم خطأ',
            headers: ['الفرع', 'العبارة', 'الحكم'],
            rows: p84Ex1Statements.map(statement => [rich(statement.label), rich(statement.text), rich(statement.truth ? 'صح' : 'خطأ')]),
            caption: rich(`${answer('sq-p84-ex1')} — العلاقة باتجاه واحد: كل مربّع معيّن ومستطيل ومتوازي أضلاع، والعكس غير صحيح.`),
          },
          {
            kind: 'figure', id: 'u2l10-figure-ex2',
            title: 'تدرّب ② · الرأسان Z و W',
            figure: <DotGrid cols={6} rows={4} points={[{ x: 1, y: 0, name: 'X' }, { x: 1, y: 3, name: 'Y' }]} segments={[{ from: [1, 0], to: [1, 3] }]} label="شبكة نقاط: النقطتان X أعلى و Y أسفل على العمود نفسه؛ المطلوب تعيين Z و W لإكمال المربّع" />,
            caption: rich(prompt('sq-p84-ex2')),
            labels: [
              rich(answer('sq-p84-ex2')),
              rich('الترتيب المتتالي للرؤوس X ثم Y ثم Z ثم W هو ما يجعل الاسم يدل على الشكل.'),
              rich(pitfall('sq-p84-ex2')),
            ],
          },
          {
            kind: 'table', id: 'u2l10-table-ex3',
            title: 'تدرّب ③ · أسماء الأشكال التي تحقق الصفة',
            headers: ['الفرع', 'الصفة', 'الأشكال الصحيحة', 'صفة تميّز المربّع'],
            rows: p84Ex3Cases.map(item => [rich(item.label), rich(item.prompt), rich(item.answer.join('، ')), rich(item.feature)]),
            caption: rich(answer('sq-p84-ex3')),
          },
          {
            kind: 'table', id: 'u2l10-table-ex4',
            title: 'تدرّب ④ · أطوال في شكل مركّب',
            headers: ['المطلوب', 'الطول'],
            rows: p84Ex4Lengths.map(item => [rich(item.label), rich(`${item.answer} ${item.unit}`)]),
            caption: rich(`${answer('sq-p84-ex4')} — ${rule('sq-p84-ex4')}`),
          },
          {
            kind: 'example', id: 'u2l10-ex-composite',
            title: 'تدرّب ④ بالتفصيل: كيف نصل إلى الأطوال؟',
            question: rich(prompt('sq-p84-ex4')),
            solution: [...findSquareElement('sq-p84-ex4').steps],
            answer: rich(answer('sq-p84-ex4')),
            verification: rich(check('sq-p84-ex4')),
          },
        ],
      },
      {
        id: 'u2l10-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l10-note-mistake-1', tone: 'warning',
            text: rich('① الظن أن كل معيّن مربّع: المعيّن تصح فيه الأضلاع المتساوية، لكنه يحتاج زاوية قائمة ليكون مربّعاً.'),
          },
          {
            kind: 'note', id: 'u2l10-note-mistake-2', tone: 'warning',
            text: rich('② الظن أن كل مستطيل مربّع: المستطيل يحتاج أن تتساوى أبعاده ليصبح مربّعاً.'),
          },
          {
            kind: 'note', id: 'u2l10-note-mistake-3', tone: 'warning',
            text: rich('③ الحكم على الشكل بالعين دون قراءة العلامات: الشرطات تعني التساوي، والأسهم تعني التوازي، والمربع الصغير يعني الزاوية القائمة.'),
          },
          {
            kind: 'note', id: 'u2l10-note-mistake-4', tone: 'tip',
            text: rich('قاعدة الربط: المربّع = مستطيل + أضلاع متساوية = معيّن + زاوية قائمة. إذا نسيت أحد التعريفين تذكر الآخر.'),
          },
          {
            kind: 'text', id: 'u2l10-text-summary',
            text: rich(`خلاصةٌ أكتبها في نهاية الصفحة: ${answer('sq-p81-definition')} وخواصه: ${answer('sq-p82-properties')}`),
          },
        ],
      },
    ],
  }
}
