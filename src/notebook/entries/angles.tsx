import type { ReactNode } from 'react'
import { MathExpression } from '../../components/MathExpression'
import {
  AngleDiagram,
  AngleWheel,
  GeometryFigures,
  InsideOutsideDiagram,
  ProtractorSvg,
  RayDiagram,
  SquareFigure,
  TriangleAndCircleFigures,
} from '../../lessons/AnglesLesson'
import { lessonSixBookElements, type AngleBookElement } from '../../lessons/anglesData'
import type { NotebookDoc, NotebookExampleBlock } from '../types'
import { mixed } from '../mixed'

/**
 * «دفتر الطالب» — الدرس السادس: قياس الزوايا (الكتاب ص 23–30).
 *
 * Source of truth: `src/lessons/anglesData.ts` — the coverage ledger `lessonSixBookElements`,
 * where every printed item carries its `prompt`, `answer` and `reasoning[]`. Every question,
 * answer and solution step below is read from that ledger (never retyped), and every figure is
 * the lesson's own drawing component (`RayDiagram`, `AngleWheel`, `SquareFigure`, …), so the
 * notebook shows exactly what the student saw in the lesson and in the book.
 */
const element = (id: string): AngleBookElement => {
  const found = lessonSixBookElements.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing lesson 6 book element: ${id}`)
  return found
}

/** The book answer of a printed item, verbatim. */
const answer = (id: string): string => element(id).answer
/** The book solution steps of a printed item, verbatim. */
const reasoning = (id: string): readonly string[] => element(id).reasoning
/** The degree measure inside a book answer, e.g. «∠AQC قياسها 120°.» → «120°». */
const measureOf = (id: string): string => {
  const match = answer(id).match(/\d+°/u)
  if (!match) throw new Error(`no degree measure in the answer of ${id}: ${answer(id)}`)
  return match[0]
}
/**
 * The same measure, keeping the book's own qualifier when the value is *read off a drawing*
 * («60° تقريباً كما تُقاس من الرسم»). Such a number must never look like exact printed data.
 */
/** The «القياس» column keeps the measure only — the type name already heads the row. */
const measureColumn = (id: string): string => {
  const term = element(id).title
  const printed = answer(id)
  const withoutLead = printed.startsWith('قياس ') ? printed.slice('قياس '.length) : printed
  return withoutLead.startsWith(term) ? withoutLead.slice(term.length).trim() : printed
}

const measuredLabel = (id: string): string => {
  const value = measureOf(id)
  const printed = answer(id)
  const approximate = printed.includes('تقريباً')
  const readOff = printed.includes('كما تُقاس من الرسم')
  if (approximate && readOff) return `${value} تقريباً (قراءة من الرسم)`
  if (approximate) return `${value} تقريباً`
  if (readOff) return `${value} (قراءة من الرسم)`
  return value
}
const degree = (value: string, key: string) => <MathExpression key={key}>{value}</MathExpression>
const angleName = (value: string, key: string) => <MathExpression key={key}>{value}</MathExpression>

/** Builds a worked example straight from a ledger item: prompt → question, reasoning → steps, answer → answer. */
const exampleFrom = (id: string, title: string, figure?: ReactNode, verification?: ReactNode): NotebookExampleBlock => ({
  kind: 'example',
  id: `l6-ex-${id}`,
  title,
  question: element(id).prompt,
  figure,
  solution: [...reasoning(id)],
  answer: answer(id),
  verification,
})

/** «الزاوية / القياس» rows for a group of printed drill items. */
const measureRows = (ids: readonly string[]) => ids.map(id => [element(id).title, degree(measuredLabel(id), `${id}-measure`)])

export function anglesNotebook(): NotebookDoc {
  return {
    lessonId: 'angle-measurement',
    lessonTitle: 'قياس الزوايا',
    unit: 'الوحدة الأولى',
    pages: 'ص 23–30',
    theme: 'lesson-six',
    sections: [
      {
        id: 'l6-terms',
        purpose: 'record',
        title: 'المفردات والتعريفات',
        blocks: [
          {
            kind: 'definition', id: 'l6-def-degree', term: 'الدرجة',
            text: answer('l6-p23-intro'),
            source: 'الكتاب · ص 23',
          },
          {
            kind: 'definition', id: 'l6-def-ray', term: 'نصف المستقيم',
            text: 'نصف المستقيم هو جزء من المستقيم يبدأ من نقطة ويمتد في اتجاه واحد. نكتبه بحرف نقطة البداية ثم حرف نقطة يمرّ بها، بين قوس مربع وقوس عادي: [AB).',
            source: 'الكتاب · ص 23 (صندوق «تعلّم»)',
          },
          {
            kind: 'figure', id: 'l6-figure-ray',
            title: 'الشكل: نصف المستقيم [AB) والزاوية بين نصفي مستقيمين',
            figure: <RayDiagram />,
            caption: answer('l6-p23-ray'),
            labels: [
              'النقطة A هي نقطة البداية (الطرف)، ويمتد نصف المستقيم بلا نهاية من جهة B.',
              <>نسمّي نصفي المستقيمين <MathExpression>[AB)</MathExpression> و<MathExpression>[AC)</MathExpression> ضلعي الزاوية.</>,
              <>نسمّي <MathExpression>A</MathExpression> رأس الزاوية؛ لأنه نقطة التقاء الضلعين.</>,
            ],
          },
          {
            kind: 'definition', id: 'l6-def-angle', term: 'الزاوية',
            text: answer('l6-p23-angle-formation'),
            source: 'الكتاب · ص 23 (صندوق «تعلّم»)',
          },
          {
            kind: 'definition', id: 'l6-def-vertex-sides', term: 'الرأس والضلعان',
            text: mixed(answer('l6-p24-sides'), ' ', answer('l6-p24-vertex')),
            source: 'الكتاب · ص 24',
          },
          {
            kind: 'definition', id: 'l6-def-notation', term: 'ترميز الزاوية وتسميتها',
            text: mixed(answer('l6-p24-notation'), ' ', <MathExpression key="notation">∠A = ∠BAC = ∠CAB</MathExpression>),
            source: 'الكتاب · ص 24',
          },
          {
            kind: 'definition', id: 'l6-def-inside-outside', term: 'داخل الزاوية وخارجها',
            text: <>في الشكل المجاور تقع النقطة <MathExpression>X</MathExpression> داخل الزاوية <MathExpression>Q</MathExpression>، والنقطة <MathExpression>B</MathExpression> تقع خارج الزاوية <MathExpression>Q</MathExpression>. ونقطة داخل زاوية تعني أنها في المنطقة المحصورة بين الضلعين، لا على الجهة الخارجية منهما.</>,
            source: 'الكتاب · ص 24',
          },
          {
            kind: 'figure', id: 'l6-figure-inside-outside',
            title: 'الشكل: نقطة داخل الزاوية ونقطة خارجها',
            figure: <InsideOutsideDiagram />,
            caption: answer('l6-p24-inside-outside'),
          },
          {
            kind: 'example', id: 'l6-ex-check24', title: 'مثال — تحقّق من فهمك: تسمية الزوايا وداخلها وخارجها (ص 24)',
            question: 'في الشكل ثلاث زوايا لها الرأس A: سمِّها، ثم أكمل «النقطة C تقع داخل الزاوية …» و«النقطة B تقع خارج الزاوية …».',
            figure: <RayDiagram />,
            solution: [
              reasoning('l6-p24-check-names').join(' '),
              reasoning('l6-p24-check-inside').join(' '),
              reasoning('l6-p24-check-outside').join(' '),
            ],
            answer: mixed('الزوايا الثلاث: ', answer('l6-p24-check-names'), ' · النقطة C: ', answer('l6-p24-check-inside'), ' · النقطة B: ', answer('l6-p24-check-outside')),
            verification: 'نعدّ الزوايا من الرأس نفسه: زاويتان صغيرتان (BAC وCAD) والزاوية الكبرى التي تضمهما معاً (BAD).',
          },
          {
            kind: 'definition', id: 'l6-def-protractor', term: 'المنقلة وتدريجاها',
            text: mixed('لقياس زاوية نستعمل المنقلة. ', answer('l6-p24-protractor')),
            source: 'الكتاب · ص 24',
          },
          {
            kind: 'figure', id: 'l6-figure-protractor',
            title: 'الشكل: أجزاء المنقلة وتدريجاها',
            figure: <ProtractorSvg degree={35} ariaLabel="منقلة تبيّن مركز المنقلة وخط الصفر والتدريجَين الخارجي والداخلي، مع شعاع يصنع زاوية قياسها 35 درجة" />,
            caption: 'التدريج الأحمر والتدريج الأسود: اختر الصفر الذي يطابق ضلع البداية.',
            labels: [
              'مركز المنقلة: نضعه عند رأس الزاوية.',
              'خط الصفر: نطابقه مع ضلع البداية.',
              'التدريج الخارجي والتدريج الداخلي: نستعمل التدريج الذي يبدأ من الصفر المطابق لضلع البداية.',
              <>في الشكل قياس الزاوية <MathExpression>35°</MathExpression>.</>,
            ],
          },
        ],
      },
      {
        id: 'l6-types',
        purpose: 'record',
        title: 'أنواع الزوايا',
        blocks: [
          {
            kind: 'figure', id: 'l6-figure-types',
            title: 'الأنواع الأربعة مرتّبة من الأصغر إلى الأكبر فتحة',
            figure: (
              <>
                <AngleDiagram kind="acute" label="حادة" ariaLabel="زاوية حادة قياسها أصغر من 90 درجة" />
                <AngleDiagram kind="right" label="قائمة" ariaLabel="زاوية قائمة قياسها 90 درجة" />
                <AngleDiagram kind="obtuse" label="منفرجة" ariaLabel="زاوية منفرجة قياسها بين 90 و180 درجة" />
                <AngleDiagram kind="straight" label="مستقيمة" ariaLabel="زاوية مستقيمة قياسها 180 درجة" />
              </>
            ),
          },
          {
            kind: 'table', id: 'l6-table-types', title: 'جدول تصنيف الزوايا (ص 27)',
            headers: ['النوع', 'القياس', 'كيف نعرفها؟', 'ملاحظة'],
            rows: ['l6-p27-acute-definition', 'l6-p27-right-definition', 'l6-p27-obtuse-definition', 'l6-p27-straight-definition']
              .map(id => [element(id).title, measureColumn(id), reasoning(id)[0], reasoning(id)[1]]),
            caption: 'الحدّان اللذان نقارن بهما دائماً هما 90° و180°.',
          },
          {
            kind: 'example', id: 'l6-ex-classify', title: 'مثال ① — تصنيف الزوايا (ص 23 · انطلاقة نشطة)',
            question: 'اكتب نوع كل زاوية من الزوايا (أ) و(ب) و(ج) و(د) في الرسوم.',
            figure: (
              <>
                <AngleDiagram kind="right" label="(أ)" ariaLabel="الزاوية أ قائمة" />
                <AngleDiagram kind="acute" label="(ب)" ariaLabel="الزاوية ب حادة" />
                <AngleDiagram kind="obtuse" label="(ج)" ariaLabel="الزاوية ج منفرجة" />
                <AngleDiagram kind="straight" label="(د)" ariaLabel="الزاوية د مستقيمة" />
              </>
            ),
            solution: [
              <>أ) {reasoning('l6-p23-class-a')[0]} {reasoning('l6-p23-class-a')[1]}</>,
              <>ب) {reasoning('l6-p23-class-b')[0]} {reasoning('l6-p23-class-b')[1]}</>,
              <>ج) {reasoning('l6-p23-class-c')[0]} {reasoning('l6-p23-class-c')[1]}</>,
              <>د) {reasoning('l6-p23-class-d')[0]} {reasoning('l6-p23-class-d')[1]}</>,
            ],
            answer: <>(أ) {answer('l6-p23-class-a')} (ب) {answer('l6-p23-class-b')} (ج) {answer('l6-p23-class-c')} (د) {answer('l6-p23-class-d')}</>,
            verification: 'نتحقق بمقارنة فتحة كل زاوية بفتحة الزاوية القائمة ثم بفتحة الزاوية المستقيمة.',
          },
        ],
      },
      {
        id: 'l6-rules',
        purpose: 'record',
        title: 'القواعد والخواصّ',
        blocks: [
          {
            kind: 'rule', id: 'l6-rule-middle-letter', title: 'قاعدة الحرف الأوسط في التسمية',
            text: <>إذا رأيت ثلاثة أحرف لزاوية فابحث عن الحرف الأوسط أولاً؛ هو الرأس. لذلك <MathExpression>BAC</MathExpression> و<MathExpression>CAB</MathExpression> صحيحان للزاوية نفسها، أما تغيير الحرف الأوسط فيغيّر الزاوية.</>,
          },
          {
            kind: 'rule', id: 'l6-rule-scale', title: 'قاعدة اختيار التدريج',
            text: 'إذا كان الضلع الأساسي إلى اليمين نبدأ من الصفر الموجود يميناً، وإذا كان إلى اليسار نبدأ من الصفر الموجود يساراً. وقراءة التدريج الآخر تعطي قياساً مكمّلاً إلى 180° وقد تكون خاطئة.',
          },
          {
            kind: 'rule', id: 'l6-rule-length', title: 'خاصة طول الضلعين: هل يتغيّر القياس إذا طال الضلعان؟',
            text: mixed('الجواب كما في الكتاب: ', answer('l6-p26-aerial')),
          },
          {
            kind: 'rule', id: 'l6-rule-adjacent', title: 'خاصة الزاويتين المتجاورتين',
            text: <>إذا كان شعاع داخل زاوية فإنه يقسمها إلى زاويتين متجاورتين، ومجموع قياسيهما يساوي قياس الزاوية الكبرى. مثال من الكتاب: <MathExpression>∠BMC = 60° + 30° = 90°</MathExpression>.</>,
          },
          {
            kind: 'rule', id: 'l6-rule-difference', title: 'خاصة الفرق بين زاويتين',
            text: <>إذا عرفنا زاوية كبرى وزاوية داخلها نجد الزاوية الباقية بالطرح. مثالان من الكتاب: <MathExpression>∠ZQX = 180° − 45° = 135°</MathExpression> و<MathExpression>∠XQB = 90° − 45° = 45°</MathExpression>.</>,
          },
          {
            kind: 'rule', id: 'l6-rule-square-diagonal', title: 'خاصة قطر المربّع',
            text: <>زاوية المربّع قياسها <MathExpression>90°</MathExpression>، وقطر المربّع يقسمها إلى زاويتين متساويتين: <MathExpression>90° ÷ 2 = 45°</MathExpression>.</>,
          },
        ],
      },
      {
        id: 'l6-skills',
        purpose: 'record',
        title: 'المهارات بخطوات مرتّبة',
        blocks: [
          {
            kind: 'steps', id: 'l6-steps-measure', title: 'مهارة ①: قياس زاوية بالمنقلة (ص 25)',
            steps: [
              <>ضع مركز المنقلة عند رأس الزاوية <MathExpression>A</MathExpression>.</>,
              <>طابق خط الصفر على أحد ضلعي الزاوية، وليكن <MathExpression>[AC)</MathExpression> مثلاً، والضلع الآخر <MathExpression>[AB)</MathExpression> في منطقة القياس.</>,
              <>اقرأ القياس على تدريج المنقلة الذي يحدده الضلع الآخر: ابدأ العدّ من التدريج <MathExpression>0°</MathExpression> المطابق لـ <MathExpression>[AC)</MathExpression> حتى تصل إلى التدريجة التي تقابل <MathExpression>[AB)</MathExpression>.</>,
              'تحقّق: قارن القياس بنوع الزاوية (حادة، قائمة، منفرجة، مستقيمة).',
            ],
          },
          {
            kind: 'note', id: 'l6-note-measure-summary', tone: 'tip',
            text: mixed('خلاصة الكتاب للخطوات نفسها: ', answer('l6-p25-measure-steps')),
          },
          {
            kind: 'steps', id: 'l6-steps-draw', title: 'مهارة ②: رسم زاوية معلومة القياس (ص 26)',
            steps: [...reasoning('l6-p26-draw-steps')],
          },
          {
            kind: 'note', id: 'l6-note-draw-summary', tone: 'tip',
            text: mixed('خلاصة الكتاب للخطوات نفسها: ', answer('l6-p26-draw-steps')),
          },
          {
            kind: 'text', id: 'l6-strip',
            text: 'شريط التذكير: ثبّت الرأس ← طابق الصفر ← اقرأ التدريج ← تحقّق بالنوع.',
          },
        ],
      },
      {
        id: 'l6-measure-examples',
        purpose: 'practice',
        title: 'أمثلة محلولة: القياس (ص 25 و26)',
        blocks: [
          exampleFrom('l6-p25-angle-35', 'مثال ② — قياس الزاوية A (ص 25)', (
            <>
              <AngleDiagram kind="acute" degree={35} label="35°" ariaLabel="زاوية حادة قياسها 35 درجة" />
              <ProtractorSvg degree={35} compact ariaLabel="منقلة تبيّن قراءة الزاوية 35 درجة" />
            </>
          ), 'نكتب القياس بالصورة Â = 35°، والزاوية حادة لأن قياسها أصغر من 90°.'),
          exampleFrom('l6-p25-example-straight', 'مثال ③ — الزاوية ŜQB (ص 25)', <AngleDiagram kind="straight" label="∠SQB" ariaLabel="زاوية مستقيمة اسمها SQB" />),
          exampleFrom('l6-p25-example-right', 'مثال ④ — الزاوية K̂LM في شكل ص 25 (قائمة)', <AngleDiagram kind="right" label="∠KLM" ariaLabel="زاوية قائمة اسمها KLM" />),
          exampleFrom('l6-p25-example-obtuse', 'مثال ⑤ — الزاوية F̂GK (ص 25)', <AngleDiagram kind="obtuse" degree={120} label="∠FGK" ariaLabel="زاوية منفرجة قياسها 120 درجة اسمها FGK" />),
          {
            kind: 'table', id: 'l6-table-checks', title: 'تحقّق من فهمك (ص 26): قياس خمس زوايا بالمنقلة',
            headers: ['الزاوية', 'القياس', 'النوع'],
            rows: [
              ['ĤIJ', degree(measureOf('l6-p26-check-hij'), 'c-hij'), 'قائمة (ضلعاها متعامدان)'],
              ['K̂LM', degree(measureOf('l6-p26-check-klm'), 'c-klm'), 'حادة (أصغر من 90°)'],
              ['NÂB', degree(measureOf('l6-p26-check-nab'), 'c-nab'), 'حادة (أصغر من 90°)'],
              ['L̂SU', degree(measureOf('l6-p26-check-lsu'), 'c-lsu'), 'مستقيمة (ضلعان متعاكسان)'],
              ['F̂DE', degree(measureOf('l6-p26-check-fde'), 'c-fde'), 'منفرجة (بين 90° و180°)'],
            ],
            caption: 'هذه الزوايا الخمس هي أشكال ص 26، وهي غير أشكال ص 25: فالاسم K̂LM يتكرّر في الصفحتين بقياسين مختلفين (90° في مثال ص 25 و50° في تحقّق ص 26) لأنّ لكلّ شكل رسمه الخاص. اقرأ الشكل المطلوب لا الاسم وحده. وفي كل زاوية: ابدأ من الصفر الذي يطابق ضلع البداية، ثم اقرأ التدريج الذي يحدده الضلع الآخر.',
          },
          {
            kind: 'figure', id: 'l6-figure-gallery',
            title: 'الرسوم المقابلة لقياسات «تحقّق من فهمك» (ص 26)',
            figure: (
              <>
                <AngleDiagram kind="right" degree={90} label="ĤIJ = 90°" ariaLabel="الزاوية HIJ قائمة قياسها 90 درجة" />
                <AngleDiagram kind="acute" degree={50} label="K̂LM = 50°" ariaLabel="الزاوية KLM حادة قياسها 50 درجة" />
                <AngleDiagram kind="acute" degree={60} label="NÂB = 60°" ariaLabel="الزاوية NAB حادة قياسها 60 درجة" />
                <AngleDiagram kind="straight" degree={180} label="L̂SU = 180°" ariaLabel="الزاوية LSU مستقيمة قياسها 180 درجة" />
                <AngleDiagram kind="obtuse" degree={120} label="F̂DE = 120°" ariaLabel="الزاوية FDE منفرجة قياسها 120 درجة" />
              </>
            ),
          },
        ],
      },
      {
        id: 'l6-draw-examples',
        purpose: 'practice',
        title: 'أمثلة محلولة: الرسم (ص 26 و27)',
        blocks: [
          exampleFrom('l6-p26-draw-example', 'مثال ⑥ — رسم زاوية قياسها 50° (ص 26)', (
            <AngleDiagram kind="acute" degree={50} label="50°" ariaLabel="زاوية حادة قياسها 50 درجة مرسومة باستعمال المنقلة" />
          ), 'نتحقق بوضع مركز المنقلة على الرأس ومطابقة الصفر مع الضلع الأول؛ فيجب أن يقع الضلع الثاني عند 50°.'),
          {
            kind: 'table', id: 'l6-table-draw', title: 'تحقّق من فهمك (ص 27): ارسم الزوايا الآتية',
            headers: ['المطلوب رسمه', 'القياس', 'النوع'],
            rows: [
              ['الزاوية YÔX', degree(measureOf('l6-p27-draw-90'), 'd-90'), 'قائمة'],
              ['الزاوية R̂TM', degree(measureOf('l6-p27-draw-160'), 'd-160'), 'منفرجة'],
              ['الزاوية Q̂FC', degree(measureOf('l6-p27-draw-180'), 'd-180'), 'مستقيمة'],
            ],
          },
          {
            kind: 'figure', id: 'l6-figure-draw',
            title: 'رسوم الزوايا الثلاث المطلوبة',
            figure: (
              <>
                <AngleDiagram kind="right" degree={90} label="YÔX = 90°" ariaLabel="الزاوية YOX قائمة" />
                <AngleDiagram kind="obtuse" degree={160} label="R̂TM = 160°" ariaLabel="الزاوية RTM منفرجة قياسها 160 درجة" />
                <AngleDiagram kind="straight" degree={180} label="Q̂FC = 180°" ariaLabel="الزاوية QFC مستقيمة" />
              </>
            ),
            labels: [
              reasoning('l6-p27-draw-90').join(' '),
              reasoning('l6-p27-draw-160').join(' '),
              reasoning('l6-p27-draw-180').join(' '),
            ],
          },
          {
            kind: 'example', id: 'l6-ex-aerial', title: 'مثال ⑦ — تطبيق: هوائي التلفاز (ص 26)',
            question: element('l6-p26-aerial').prompt,
            solution: [...reasoning('l6-p26-aerial')],
            answer: answer('l6-p26-aerial'),
          },
        ],
      },
      {
        id: 'l6-drills',
        purpose: 'practice',
        title: 'تدرّبات الكتاب المحلولة (ص 28–30)',
        blocks: [
          {
            kind: 'example', id: 'l6-ex-bmc', title: 'تدرّب ① — رسم ∠BMW = 60° ثم إيجاد ∠BMC (ص 28)',
            question: <>ارسم الزاوية <MathExpression>BMW</MathExpression> حيث <MathExpression>∠BMW = 60°</MathExpression>، ثم ارسم النقطة <MathExpression>C</MathExpression> خارجها بحيث <MathExpression>∠WMC = 30°</MathExpression>، واكتب قياس <MathExpression>∠BMC</MathExpression>.</>,
            figure: (
              <>
                <AngleDiagram kind="acute" degree={60} label="∠BMW = 60°" ariaLabel="الزاوية BMW قياسها 60 درجة" />
                <AngleDiagram kind="acute" degree={30} label="∠WMC = 30°" ariaLabel="الزاوية WMC قياسها 30 درجة" />
              </>
            ),
            solution: [
              reasoning('l6-p28-draw-60').join(' '),
              reasoning('l6-p28-add-c').join(' '),
              reasoning('l6-p28-angle-bmc').join(' '),
            ],
            answer: answer('l6-p28-angle-bmc'),
            verification: 'الزاوية BMC قائمة، وهذا يوافق أن مجموع 60° و30° يساوي 90°.',
          },
          {
            kind: 'figure', id: 'l6-figure-wheel',
            title: 'تدرّب ② — الشكل: أشعة الزوايا حول الرأس Q (ص 28 و29)',
            figure: <AngleWheel />,
            caption: 'الشعاع QA أفقي، والشعاع QB عمودي عليه، وباقي الأشعة (X وY وC وZ) مرسومة حول الرأس Q.',
          },
          {
            kind: 'table', id: 'l6-table-wheel', title: 'تدرّب ② — جدول قياسات الزوايا حول Q',
            headers: ['الزاوية', 'القياس', 'كيف وجدناها؟'],
            rows: [
              ['l6-p28-table-aqb', '∠AQB'], ['l6-p28-table-aqx', '∠AQX'], ['l6-p28-table-aqc', '∠AQC'],
              ['l6-p28-table-aqz', '∠AQZ'], ['l6-p28-table-zqx', '∠ZQX'], ['l6-p29-angle-xqb', '∠XQB'],
              ['l6-p29-angle-bqy', '∠BQY'], ['l6-p29-angle-zqy', '∠ZQY'], ['l6-p29-angle-bqc', '∠BQC'],
            ].map(([id, name]) => [angleName(name, `${id}-name`), degree(measureOf(id), `${id}-measure`), reasoning(id).join(' ')]),
          },
          {
            kind: 'text', id: 'l6-text-right-angles',
            text: mixed(element('l6-p29-right-discovery').prompt, ' ', answer('l6-p29-right-discovery'), ' — ', reasoning('l6-p29-right-discovery').join(' ')),
          },
          {
            kind: 'figure', id: 'l6-figure-colored',
            title: 'تدرّب ③ — الزوايا الملوّنة في مثلثين ومستطيل (ص 29)',
            figure: <GeometryFigures />,
            caption: 'الزاويتان الملوّنتان عند J وI في المثلث الأول، والزاوية الملوّنة عند F في المثلث الثاني، والزاوية عند D في المستطيل.',
          },
          {
            kind: 'table', id: 'l6-table-colored', title: 'تدرّب ③ — قياسات الزوايا الملوّنة',
            headers: ['الزاوية', 'القياس'],
            rows: measureRows(['l6-p29-colored-j', 'l6-p29-colored-i', 'l6-p29-colored-f', 'l6-p29-colored-d']),
          },
          {
            kind: 'figure', id: 'l6-figure-triangle-circle',
            title: 'تدرّب ④ و⑤ — المثلث القائم ABC ونصف الدائرة بقطرها BC (ص 29)',
            figure: <TriangleAndCircleFigures />,
            caption: 'في المثلث: ∠B = 90°، ∠CAB = 30°، ∠BCA = 60°. وفي نصف الدائرة: ∠BMC = 90°، ∠CNB = 90°، ∠BOC = 180°.',
          },
          {
            kind: 'table', id: 'l6-table-triangle', title: 'تدرّب ④ — زوايا المثلث القائم',
            headers: ['الزاوية', 'القياس'],
            rows: measureRows(['l6-p29-triangle-b', 'l6-p29-triangle-a', 'l6-p29-triangle-c']),
            caption: 'نتحقق: 90° + 30° + 60° = 180°، وهو مجموع زوايا المثلث.',
          },
          {
            kind: 'table', id: 'l6-table-circle', title: 'تدرّب ⑤ — زوايا نصف الدائرة',
            headers: ['الزاوية', 'القياس'],
            rows: measureRows(['l6-p29-circle-bmc', 'l6-p29-circle-cnb', 'l6-p29-circle-boc']),
            caption: reasoning('l6-p29-circle-bmc').join(' '),
          },
          {
            kind: 'figure', id: 'l6-figure-square',
            title: 'تدرّب ⑥ و⑦ — المربّع ABCD وقطره AC (ص 29 و30)',
            figure: (
              <>
                <SquareFigure />
                <SquareFigure colored />
              </>
            ),
            caption: 'الشكل الأيمن: المربّع وقطره. والشكل الأيسر: الزاويتان الملوّنتان اللتان يصنعهما القطر.',
          },
          {
            kind: 'table', id: 'l6-table-square', title: 'تدرّب ⑥ — زوايا المربّع',
            headers: ['الزاوية', 'القياس'],
            rows: measureRows(['l6-p29-square-a', 'l6-p29-square-b', 'l6-p29-square-c', 'l6-p29-square-d']),
            caption: 'كل زوايا المربّع الأربع متساوية وقائمة.',
          },
          exampleFrom('l6-p30-square-colors', 'تدرّب ⑦ — زاويتا قطر المربّع (ص 30)'),
          {
            kind: 'table', id: 'l6-table-applications', title: 'تطبيقات من الحياة (ص 30)',
            headers: ['التطبيق', 'الجواب'],
            rows: [
              ['انحراف الطائرة عن مسارها', degree(measuredLabel('l6-p30-plane'), 'ap-plane')],
              ['سرب الأوز المهاجرة', degree(measuredLabel('l6-p30-birds'), 'ap-birds')],
              ['الزاوية 1 في إطار الدراجة', answer('l6-p30-bike-1')],
              ['الزاوية 2 في إطار الدراجة', answer('l6-p30-bike-2')],
              ['الزاوية 3 في إطار الدراجة', answer('l6-p30-bike-3')],
              ['الزاوية 4 في إطار الدراجة', answer('l6-p30-bike-4')],
              ['عدد الزوايا الحادة في المثلث', answer('l6-p30-triangle-acute')],
              ['عدد الزوايا المنفرجة في المثلث', answer('l6-p30-triangle-obtuse')],
            ],
            caption: reasoning('l6-p30-triangle-obtuse').join(' '),
          },
          exampleFrom('l6-p27-hanger', 'مثال ⑧ — تطبيق: زوايا علاقة الملابس (ص 27)'),
          {
            kind: 'note', id: 'l6-note-approximate', tone: 'tip',
            text: 'كل قياس موسوم بـ«تقريباً» أو بـ«(قراءة من الرسم)» في جداول ص 29 و30 ليس رقماً مطبوعاً في الكتاب: الكتاب نفسه قيّده بعبارة «تقريباً كما تُقاس من الرسم». لذلك انقل القيد مع القياس في دفترك، وضع المنقلة على الرسم نفسه واقرأ التدريج الصحيح لتتأكّد منه.',
          },
        ],
      },
      {
        id: 'l6-warnings',
        purpose: 'record',
        title: 'أخطاء شائعة وتنبيهات',
        blocks: [
          {
            kind: 'note', id: 'l6-warn-scale', tone: 'warning',
            text: 'خطأ شائع: قراءة الرقم المقابل على التدريج الآخر. اسأل دائماً: أين يقع الصفر الذي لامس ضلع البداية؟ وابدأ العدّ منه.',
          },
          {
            kind: 'note', id: 'l6-warn-center', tone: 'warning',
            text: reasoning('l6-p25-measure-steps')[0] + ' فإذا وُضع مركز المنقلة بعيداً عن الرأس لن تكون القراءة موثوقة.',
          },
          {
            kind: 'note', id: 'l6-warn-name', tone: 'warning',
            text: <>لا تبدّل الحرف الأوسط عند تسمية الزاوية بثلاثة أحرف؛ فالحرف الأوسط هو الرأس، وتغييره يغيّر الزاوية نفسها. <MathExpression>∠BAC</MathExpression> و<MathExpression>∠CAB</MathExpression> الزاوية نفسها، أما <MathExpression>∠ABC</MathExpression> فزاوية أخرى رأسها <MathExpression>B</MathExpression>.</>,
          },
          {
            kind: 'note', id: 'l6-tip-length', tone: 'tip',
            text: 'الطول لا يغيّر قياس الزاوية؛ فالمهمّ اتجاه الضلعين والفتحة بينهما. لذلك إطالة ضلعي الزاوية تبقي القياس نفسه.',
          },
          {
            kind: 'note', id: 'l6-tip-verify', tone: 'tip',
            text: 'تحقّق دائماً من معقولية القراءة بالنوع: قراءة أقل من 90° تعني زاوية حادة، وقراءة بين 90° و180° تعني منفرجة؛ فإذا رأيت زاوية منفرجة وقرأت 40° فأنت قرأت التدريج الخطأ.',
          },
        ],
      },
    ],
  }
}
