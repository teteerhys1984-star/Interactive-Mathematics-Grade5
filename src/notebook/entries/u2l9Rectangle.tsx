import { GeoFigure } from '../../components/lesson/GeoFigure'
import { rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  findRectangleElement,
  p77RightAngleShapes,
  p77Shapes,
  p79Steps,
  p80Ex1Blanks,
  p80Ex2Statements,
  p80Ex4Lengths,
} from '../../lessons/rectangleData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 9: المستطيل (الكتاب ص 77–80).
 *
 * Source of truth: `src/lessons/rectangleData.ts`. Definitions, properties, the five construction
 * steps and every printed exercise come from that ledger (`prompt`, `answer`, `rule`, `why`, `steps`).
 * The drawings are built with the shared `GeoFigure` renderer the geometry lessons already use, so the
 * notebook shows the same marks (parallel arrows, right-angle squares, side lengths) as the lesson.
 */
const prompt = (id: string): string => findRectangleElement(id).prompt
const answer = (id: string): string => findRectangleElement(id).answer
const rule = (id: string): string => findRectangleElement(id).rule
const why = (id: string): string => findRectangleElement(id).why
const pitfall = (id: string): string => findRectangleElement(id).pitfall ?? ''
const steps = (id: string): readonly string[] => findRectangleElement(id).steps

/** A rectangle ABCD drawn at 4cm × 3cm scale, with parallel marks and right angles. */
function RectangleFigure({ length = '4cm', width = '3cm', name = 'ABCD' }: { length?: string; width?: string; name?: string }) {
  const [a, b, c, d] = name.split('') as [string, string, string, string]
  return (
    <GeoFigure
      pts={{ [a!]: { x: 40, y: 150 }, [b!]: { x: 240, y: 150 }, [c!]: { x: 240, y: 60 }, [d!]: { x: 40, y: 60 } }}
      order={[a!, b!, c!, d!]}
      width={280}
      height={190}
      marks={[{ side: [a!, b!], count: 1 }, { side: [d!, c!], count: 1 }, { side: [b!, c!], count: 2 }, { side: [a!, d!], count: 2 }]}
      right={[{ at: a!, from: d!, to: b! }, { at: b!, from: a!, to: c! }, { at: c!, from: b!, to: d! }, { at: d!, from: a!, to: c! }]}
      sides={[{ side: [a!, b!], label: length }, { side: [b!, c!], label: width }]}
      ariaLabel={`مستطيل ${name} طوله ${length} وعرضه ${width}، ضلعاه المتقابلان متوازيان ومتساويان وزواياه الأربع قائمة`}
    />
  )
}

/** The composite figure of تدرّب ④: ABFG (6cm × 3cm) with BCDE (3cm × 2cm) attached at B. */
function CompositeFigure() {
  return (
    <GeoFigure
      pts={{ A: { x: 40, y: 200 }, B: { x: 130, y: 200 }, C: { x: 220, y: 200 }, G: { x: 40, y: 50 }, F: { x: 130, y: 50 }, E: { x: 130, y: 125 }, D: { x: 220, y: 125 } }}
      order={['A', 'C', 'D', 'E', 'F', 'G']}
      width={280}
      height={240}
      right={[{ at: 'A', from: 'G', to: 'C' }, { at: 'G', from: 'A', to: 'F' }, { at: 'C', from: 'A', to: 'D' }, { at: 'D', from: 'C', to: 'E' }]}
      dashed={[['B', 'E']]}
      sides={[{ side: ['A', 'G'], label: '6cm' }, { side: ['G', 'F'], label: '3cm' }, { side: ['E', 'D'], label: '2cm' }, { side: ['C', 'D'], label: '3cm' }]}
      ariaLabel="مستطيل كبير ABFG طوله 6cm وعرضه 3cm، ومستطيل صغير BCDE ملتصق به عرضه 3cm وطوله 2cm"
    />
  )
}

export function rectangleNotebook(): NotebookDoc {
  return {
    lessonId: 'rectangle',
    lessonTitle: 'المستطيل',
    unit: 'الوحدة الثانية',
    pages: 'ص 77–80',
    theme: 'lesson-rectangle',
    sections: [
      {
        id: 'u2l9-terms',
        purpose: 'record',
        title: 'تعريف المستطيل: شرطان لا واحد',
        blocks: [
          {
            kind: 'text', id: 'u2l9-text-goals',
            text: rich(`${prompt('rect-p77-goals')} — ${why('rect-p77-goals')}`),
          },
          {
            kind: 'definition', id: 'u2l9-def-rectangle',
            term: 'المستطيل',
            text: rich(prompt('rect-p77-definition')),
            source: 'الكتاب · ص 77',
          },
          {
            kind: 'rule', id: 'u2l9-rule-two-conditions',
            title: 'لماذا لا يكفي شرط واحد؟',
            text: rich(`${why('rect-p77-definition')} ${pitfall('rect-p77-definition')}`),
          },
          {
            kind: 'figure', id: 'u2l9-figure-rectangle',
            title: 'الشكل: المستطيل ABCD',
            figure: <RectangleFigure name="ABCD" />,
            caption: rich(answer('rect-p78-example')),
            labels: [
              rich('السهم المفرد على الضلعين [AB] و[DC] يعني توازيهما، والسهم المزدوج يعني توازي [AD] و[BC].'),
              rich('المربع الصغير في كل رأس يعني زاوية قائمة قياسها 90°.'),
              rich('الضلع الأطول هو الطول، والأقصر هو العرض، أياً كان اتجاه الرسم.'),
            ],
          },
          {
            kind: 'definition', id: 'u2l9-def-length-width',
            term: 'الطول والعرض',
            text: rich(`${answer('rect-p78-example')} ${pitfall('rect-p78-example')}`),
            source: 'الكتاب · ص 78',
          },
          {
            kind: 'note', id: 'u2l9-note-flag', tone: 'tip',
            text: rich(`${prompt('rect-p77-flag')} — ${rule('rect-p77-flag')}`),
          },
        ],
      },
      {
        id: 'u2l9-properties',
        purpose: 'record',
        title: 'خواص المستطيل',
        blocks: [
          {
            kind: 'rule', id: 'u2l9-rule-properties',
            title: 'الخواص الأربع',
            text: rich(`${prompt('rect-p78-properties')} ${why('rect-p78-properties')}`),
          },
          {
            kind: 'table', id: 'u2l9-table-properties',
            title: 'جدول الخواص: ما يصح وما لا يصح',
            headers: ['الخاصية', 'هل تصح لكل مستطيل؟', 'التعليل'],
            rows: [
              [rich('كل ضلعين متقابلين متوازيان'), rich('نعم'), rich('لأن المستطيل متوازي أضلاع فيرث خواصه')],
              [rich('كل ضلعين متقابلين متساويان في الطول'), rich('نعم'), rich('خاصية متوازي الأضلاع نفسها')],
              [rich('كل زاويتين متقابلتين متساويتان'), rich('نعم'), rich('خاصية متوازي الأضلاع، وهنا كلها 90°')],
              [rich('الزوايا الأربع قائمة'), rich('نعم'), rich('هذه هي الزاوية القائمة التي تُميّزه')],
              [rich('الأضلاع الأربعة متساوية'), rich('لا'), rich('هذه خاصية المعيّن والمربّع لا المستطيل عموماً')],
            ],
            caption: rich(pitfall('rect-p78-properties')),
          },
          {
            kind: 'example', id: 'u2l9-ex-example78',
            title: 'مثال الكتاب (ص 78): لماذا ABCD مستطيل؟',
            question: rich(prompt('rect-p78-example')),
            figure: <RectangleFigure name="ABCD" />,
            solution: [...steps('rect-p78-example'), why('rect-p78-example')],
            answer: rich(answer('rect-p78-example')),
            verification: rich(findRectangleElement('rect-p78-example').check),
          },
          {
            kind: 'table', id: 'u2l9-table-oral',
            title: 'التعبير الشفهي (ص 78)',
            headers: ['السؤال', 'الجواب', 'تحذير'],
            rows: [
              [rich(prompt('rect-p78-oral')), rich(answer('rect-p78-oral')), rich(pitfall('rect-p78-oral'))],
            ],
          },
        ],
      },
      {
        id: 'u2l9-recognise',
        purpose: 'record',
        title: 'كيف أحكم على شكل: مستطيل أم لا؟',
        blocks: [
          {
            kind: 'steps', id: 'u2l9-steps-recognise',
            title: 'خطوات الحكم على شكل رباعي',
            steps: [
              rich('① افحص التوازي: هل كل ضلعين متقابلين متوازيان؟ إن لم يكن فهو ليس متوازي أضلاع، وبالتالي ليس مستطيلاً.'),
              rich('② افحص الزاوية: هل فيه زاوية قائمة واحدة على الأقل؟ علّم الزوايا القائمة بالمربع الصغير.'),
              rich('③ إذا تحقق الشرطان معاً فالشكل مستطيل، وتصبح الزوايا الأربع قائمة تلقائياً.'),
              rich('④ افحص الأطوال: إذا كانت الأضلاع الأربعة متساوية أيضاً فالشكل مربّع، وهو مستطيل خاص.'),
            ],
          },
          {
            kind: 'table', id: 'u2l9-table-opening',
            title: 'انطلاقة نشطة (ص 77): الأشكال الأربعة',
            headers: ['السؤال', 'الجواب', 'التعليل'],
            rows: [
              [rich(prompt('rect-p77-opening-q1')), rich(answer('rect-p77-opening-q1')), rich(p77RightAngleShapes.map(number => `الشكل (${number})`).join(' و') + ' فيه زاوية قائمة معلّمة')],
              [rich(prompt('rect-p77-opening-q2')), rich(answer('rect-p77-opening-q2')), rich('المربّع مستطيل تساوت أضلاعه؛ والآخر مستطيل أضلاعه غير متساوية')],
            ],
            caption: rich(`${p77Shapes.length} أشكال كلها متوازيات أضلاع؛ ما يميّز المستطيل هو علامة الزاوية القائمة. ${pitfall('rect-p77-opening-q1')}`),
          },
          {
            kind: 'table', id: 'u2l9-table-check1',
            title: 'تحقّق من فهمك (ص 78) · لماذا هو مستطيل؟',
            headers: ['السؤال', 'الجواب'],
            rows: [[rich(prompt('rect-p78-check1')), rich(answer('rect-p78-check1'))]],
          },
          {
            kind: 'table', id: 'u2l9-table-check2',
            title: 'تحقّق من فهمك (ص 78) · لماذا ليس مستطيلاً؟',
            headers: ['السؤال', 'الجواب'],
            rows: [[rich(prompt('rect-p78-check2')), rich(answer('rect-p78-check2'))]],
          },
          {
            kind: 'note', id: 'u2l9-note-check2', tone: 'warning',
            text: rich(pitfall('rect-p78-check2')),
          },
        ],
      },
      {
        id: 'u2l9-construction',
        purpose: 'record',
        title: 'رسم المستطيل بالمسطرة والمنقلة أو الكوس',
        blocks: [
          {
            kind: 'steps', id: 'u2l9-steps-construction',
            title: 'خطوات رسم مستطيل طوله 3cm وعرضه 2cm (ص 79)',
            steps: p79Steps.map(step => rich(`${step.text} — ${step.why}`)),
          },
          {
            kind: 'figure', id: 'u2l9-figure-construction',
            title: 'الناتج: المستطيل ABCD بطول 3cm وعرض 2cm',
            figure: <RectangleFigure name="ABCD" length="3cm" width="2cm" />,
            caption: rich(answer('rect-p79-construction')),
            labels: [
              rich('نبدأ بالطول [AB] لأنه المرجع الذي تُقام عليه الأعمدة.'),
              rich('نقيم عمودين متقابلين من A ومن B بالطول نفسه.'),
              rich('نتحقق في النهاية بالمنقلة من الزاويتين Ĉ وD̂ وبالمسطرة من DC.'),
            ],
          },
          {
            kind: 'note', id: 'u2l9-note-construction', tone: 'warning',
            text: rich(pitfall('rect-p79-construction')),
          },
          {
            kind: 'example', id: 'u2l9-ex-draw',
            title: 'تدرّب على الرسم (ص 80): مستطيل 4cm × 3cm',
            question: rich(prompt('rect-p80-check-draw')),
            figure: <RectangleFigure name="XYZW" length="4cm" width="3cm" />,
            solution: [...steps('rect-p80-check-draw')],
            answer: rich(answer('rect-p80-check-draw')),
            verification: rich(findRectangleElement('rect-p80-check-draw').check),
          },
          {
            kind: 'note', id: 'u2l9-note-naming', tone: 'tip',
            text: rich(pitfall('rect-p80-check-draw')),
          },
        ],
      },
      {
        id: 'u2l9-practice',
        purpose: 'practice',
        title: 'حلول تدرّبات ص 80',
        blocks: [
          {
            kind: 'table', id: 'u2l9-table-ex1',
            title: 'تدرّب ① · املأ الفراغات في المستطيل ABCD',
            headers: ['الفرع', 'الفراغ كما في الكتاب', 'الجواب'],
            rows: p80Ex1Blanks.map(blank => [rich(blank.label), rich(blank.prompt), rich(blank.answer)]),
            caption: rich(answer('rect-p80-ex1')),
          },
          {
            kind: 'table', id: 'u2l9-table-ex2',
            title: 'تدرّب ② · صح أم خطأ',
            headers: ['الفرع', 'العبارة', 'الحكم'],
            rows: p80Ex2Statements.map(statement => [rich(statement.label), rich(statement.text), rich(statement.truth ? 'صح' : 'خطأ')]),
            caption: rich(`${answer('rect-p80-ex2')} — ${why('rect-p80-ex2')}`),
          },
          {
            kind: 'figure', id: 'u2l9-figure-ex3',
            title: 'تدرّب ③ · الرأس الرابع W',
            figure: (
              <GeoFigure
                pts={{ Y: { x: 60, y: 150 }, X: { x: 220, y: 150 }, Z: { x: 60, y: 50 } }}
                order={['Y', 'X', 'Z']}
                width={280}
                height={200}
                open
                right={[{ at: 'Y', from: 'X', to: 'Z' }]}
                dashed={[['X', 'Z']]}
                showLabels
                ariaLabel="الرأس Y في الزاوية، YX قطعة أفقية إلى اليمين وYZ قطعة رأسية إلى الأعلى، وهما متعامدتان؛ الرأس W مطلوب ليكمل المستطيل"
              />
            ),
            caption: rich(answer('rect-p80-ex3')),
            labels: [
              rich('W هو الرأس المقابل لـ Y، ويُعيّن بعمود من X يساوي YZ، أو بعمود من Z يساوي YX.'),
              rich(pitfall('rect-p80-ex3')),
            ],
          },
          {
            kind: 'figure', id: 'u2l9-figure-ex4',
            title: 'تدرّب ④ · مستطيلان ملتصقان',
            figure: <CompositeFigure />,
            caption: rich(prompt('rect-p80-ex4')),
            labels: [
              rich('ABFG مستطيل: AG = BF = 6cm و GF = AB = 3cm.'),
              rich('BCDE مستطيل: BC = ED = 2cm و CD = BE = 3cm.'),
              rich('النقاط A وB وC على استقامة واحدة (في القاعدة)، والنقطة E تقع على الضلع [BF].'),
            ],
          },
          {
            kind: 'table', id: 'u2l9-table-ex4',
            title: 'تدرّب ④ · الأطوال المطلوبة',
            headers: ['المطلوب', 'الاستدلال', 'الطول'],
            rows: [
              [rich('القطعة AC'), rich('AB + BC = 3 + 2 على الاستقامة الواحدة'), rich(`${p80Ex4Lengths[0]!.answer}cm`)],
              [rich('القطعة EB'), rich('تقابل CD في المستطيل BCDE، وCD = 3cm'), rich(`${p80Ex4Lengths[1]!.answer}cm`)],
              [rich('القطعة FE'), rich('FB − EB = 6 − 3، لأن E تقع على FB'), rich(`${p80Ex4Lengths[2]!.answer}cm`)],
            ],
            caption: rich(`${answer('rect-p80-ex4')} — ${pitfall('rect-p80-ex4')}`),
          },
        ],
      },
      {
        id: 'u2l9-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l9-note-mistake-1', tone: 'warning',
            text: rich('① الاكتفاء بالزاوية القائمة وحدها: شبه المنحرف القائم فيه زاوية قائمة وليس مستطيلاً.'),
          },
          {
            kind: 'note', id: 'u2l9-note-mistake-2', tone: 'warning',
            text: rich('② إضافة «الأضلاع الأربعة متساوية» إلى خواص المستطيل: هذه خاصة المعيّن والمربّع.'),
          },
          {
            kind: 'note', id: 'u2l9-note-mistake-3', tone: 'warning',
            text: rich('③ اعتبار المربّع ليس مستطيلاً: المربّع يحقق تعريف المستطيل ويزيد عليه تساوي الأضلاع.'),
          },
          {
            kind: 'note', id: 'u2l9-note-mistake-4', tone: 'tip',
            text: rich('للتحقق من أي زاوية قائمة على الورق: قسها بالمنقلة أو طابقها بزاوية الكوس، ولا تحكم بالنظر إلى الرسم.'),
          },
          {
            kind: 'text', id: 'u2l9-text-summary',
            text: rich(`خلاصة الدرس في سطر: ${answer('rect-p77-definition')} وتُضاف إليه الخواص: ${rule('rect-p78-properties')}`),
          },
        ],
      },
    ],
  }
}
