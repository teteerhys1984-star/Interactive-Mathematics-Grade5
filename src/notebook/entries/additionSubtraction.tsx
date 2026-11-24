import { ColumnOperation } from '../../components/lesson/ColumnOperation'
import { MathExpression } from '../../components/MathExpression'
import {
  additionChecks,
  applicationProblems,
  australiaCheck,
  computeResult,
  drillItems,
  fillPuzzles,
  fmt,
  invoiceExample,
  itemExpression,
  laptopExample,
  laptopPrintedAnswer,
  refineryExample,
  subtractionChecks,
  subtractionExample,
  threeAddendsExample,
  digitAt,
  type CalcItem,
  type PuzzleRow,
} from '../../lessons/additionSubtractionData'
import type { NotebookDoc } from '../types'

/**
 * «دفتر الطالب» — الدرس الخامس: جمع الأعداد الطبيعيّة وطرحها (الكتاب ص 19–22).
 *
 * Sources: `src/lessons/AdditionSubtractionLesson.tsx` (the two printed «قاعدة … بالأعمدة» boxes,
 * the vocabulary chips, the «الفكرة كاملة» rows, the «اكتشف الخطأ» case, the recap) and
 * `src/lessons/additionSubtractionData.ts` — the single source of truth for every operand.
 *
 * Nothing here is re-typed: each column figure is the real `ColumnOperation` for the book item,
 * and every printed result is computed with `computeResult`, so a notebook answer can never
 * disagree with the lesson or with the book's operands.
 */
const result = (item: CalcItem) => fmt(computeResult(item.operands, item.operator))

/** The two-digit demos the lesson uses to show one carry and one borrow. */
const carryDemo: CalcItem = { id: 'nb-demo-add', label: 'مثال مصغّر على الحمل', operands: [47, 38], operator: '+' }
const borrowDemo: CalcItem = { id: 'nb-demo-sub', label: 'مثال مصغّر على الاستلاف', operands: [52, 27], operator: '-' }
const mistakeWork: CalcItem = { id: 'nb-mistake', label: 'اكتشف الخطأ', operands: [4580, 3650], operator: '+' }

/** Rebuilds the book's skeleton (□ in the hidden places) from the puzzle data. */
const skeleton = (row: PuzzleRow, width: number) =>
  Array.from({ length: width }, (_, index) => width - 1 - index)
    .map(position => (row.hidden.includes(position) ? '□' : String(digitAt(row.value, position))))
    .join('')

const hiddenDigits = (row: PuzzleRow) =>
  row.hidden.slice().sort((a, b) => b - a).map(position => `${digitAt(row.value, position)}`).join('، ')

const itemRow = (item: CalcItem) => [
  <MathExpression key={`${item.id}-expression`}>{itemExpression(item)}</MathExpression>,
  <MathExpression key={`${item.id}-result`}>{result(item)}</MathExpression>,
]

export function additionSubtractionNotebook(): NotebookDoc {
  return {
    lessonId: 'adding-subtracting-natural-numbers',
    lessonTitle: 'جمع الأعداد الطبيعيّة وطرحها',
    unit: 'الوحدة الأولى',
    pages: 'ص 19–22',
    theme: 'lesson-five',
    sections: [
      {
        id: 'l5-terms',
        title: 'المفردات والتعريفات',
        blocks: [
          {
            kind: 'definition', id: 'l5-def-addition', term: 'الجمع',
            text: 'ضمّ مقدارين أو أكثر في مقدار واحد. مع الأعداد الكبيرة نجمعها منزلةً منزلة: آحاد مع آحاد، عشرات مع عشرات، وهكذا.',
            source: 'الكتاب · ص 19 و20',
          },
          {
            kind: 'definition', id: 'l5-def-subtraction', term: 'الطرح',
            text: 'إيجاد الفرق بين عددين: كم يزيد أحدهما عن الآخر، أو ماذا يتبقّى بعد إنقاص مقدار.',
            source: 'الكتاب · ص 21',
          },
          {
            kind: 'definition', id: 'l5-def-parts', term: 'أجزاء عملية الطرح',
            text: 'المطروح منه: العدد الأكبر في الأعلى. المطروح: ما ننقصه. الفرق (الناتج): ما يتبقّى.',
            source: 'الكتاب · ص 21',
          },
          {
            kind: 'definition', id: 'l5-def-carry', term: 'الحمل',
            text: <>كل خانة تتّسع لرقم واحد فقط؛ فإذا صار ناتج الخانة <MathExpression>13</MathExpression> فهو <MathExpression>3</MathExpression> آحاد و<MathExpression>1</MathExpression> عشرة، والعشرة تنتقل إلى الخانة التي على اليسار.</>,
            source: 'الكتاب · ص 19 و20',
          },
          {
            kind: 'definition', id: 'l5-def-borrow', term: 'الاستلاف',
            text: 'نأخذ عشرة من الخانة اليسرى (فتنقص 1) ونضيفها إلى الخانة الحالية (فتزيد 10)؛ لأننا لا نطرح رقماً أكبر من رقم أصغر مباشرة.',
            source: 'الكتاب · ص 21',
          },
          {
            kind: 'definition', id: 'l5-def-inverse', term: 'الجمع والطرح عمليتان عكسيتان',
            text: <><MathExpression>25 + 75 = 100</MathExpression> و<MathExpression>100 − 25 = 75</MathExpression>؛ وهذه العلاقة هي التي نستعملها للتحقّق من إجاباتنا.</>,
            source: 'الكتاب · ص 19',
          },
        ],
      },
      {
        id: 'l5-rules',
        title: 'القواعد',
        blocks: [
          {
            kind: 'rule', id: 'l5-rule-addition', title: 'قاعدة الجمع بالأعمدة',
            text: 'نرتّب خانات الأعداد المتقابلة تحت بعضها بدءاً من خانة الآحاد، ثم نجمع كل خانة. وإذا تجاوز ناتج خانةٍ الرقم 9 نكتب رقم الآحاد ونحمل ما تبقّى إلى الخانة التي على يسارها.',
          },
          {
            kind: 'rule', id: 'l5-rule-subtraction', title: 'قاعدة الطرح بالأعمدة',
            text: <>نرتّب خانات العددين المتقابلة تحت بعضها بدءاً من خانة الآحاد، ثم نطرح كل خانة. وإذا كان الرقم في الأعلى أصغر من الذي تحته نستلف <MathExpression>10</MathExpression> من الخانة المجاورة على اليسار.</>,
          },
          {
            kind: 'rule', id: 'l5-rule-check', title: 'قاعدة التحقّق',
            text: <>الجمع تبديلي: أعد الجمع من الأعلى إلى الأسفل، أو غيّر ترتيب الأعداد؛ يجب أن يبقى المجموع نفسه. والطرح نتحقّق منه بالجمع العكسي: المطروح + الفرق = المطروح منه.</>,
          },
          {
            kind: 'rule', id: 'l5-rule-choose', title: 'متى نجمع ومتى نطرح؟',
            text: 'نستعمل الجمع لإيجاد المجموع الكلّي: قيمة فاتورة، إنتاج عامين، عدد منشورات، أي موقف نضمّ فيه كميّات. ونستعمل الطرح لإيجاد مقدار الزيادة أو النقص أو الباقي: فرق سعر، فرق كتلة، مساحة أصغر.',
          },
        ],
      },
      {
        id: 'l5-skills',
        title: 'المهارات بخطوات مرتّبة',
        blocks: [
          {
            kind: 'steps', id: 'l5-steps-addition', title: 'مهارة ①: الجمع بالأعمدة',
            steps: [
              'أحاذي الأعداد على اليمين لتتقابل المنازل.',
              'أبدأ من خانة الآحاد وأتحرّك يساراً.',
              'أجمع كل خانة على حدة وأكتب رقم الآحاد للناتج.',
              'أحمل العشرة إلى الخانة التالية إن وُجدت.',
              'أتحقّق بإعادة الجمع من الأعلى إلى الأسفل أو بتغيير ترتيب الأعداد.',
            ],
          },
          {
            kind: 'steps', id: 'l5-steps-subtraction', title: 'مهارة ②: الطرح بالأعمدة',
            steps: [
              'أضع العدد الأكبر (المطروح منه) في الأعلى، والعدد الأصغر (المطروح) تحته محاذياً على اليمين.',
              'أبدأ من الآحاد وأطرح الرقم السفلي من العلوي.',
              <>إن لم يكفِ العلوي أستلف <MathExpression>10</MathExpression> من الخانة المجاورة على اليسار، فتنقص تلك الخانة واحداً.</>,
              'أكتب الأرقام الباقية وأقرأ الفرق.',
              'أتحقّق بالجمع العكسي: المطروح + الفرق = المطروح منه.',
            ],
          },
          {
            kind: 'steps', id: 'l5-steps-word', title: 'مهارة ③: حلّ مسألة من الواقع',
            steps: [
              'أقرأ المعطيات وأحدد المطلوب بالضبط.',
              'أقرر العملية: ضمّ كميّات يعني جمعاً، وإيجاد زيادة أو نقص أو باقٍ يعني طرحاً.',
              'أكتب العملية بالأعمدة مع محاذاة الخانات على اليمين.',
              'أحلّ ثم أتحقّق (بإعادة الجمع أو بالجمع العكسي).',
              'أكتب الجواب بجملة كاملة مع وحدة القياس المطلوبة (ليرة، طن، كم²…).',
            ],
          },
        ],
      },
      {
        id: 'l5-demos',
        title: 'مثالان مصغّران: الحمل والاستلاف',
        blocks: [
          {
            kind: 'example', id: 'l5-ex-carry', title: 'مثال ① — الحمل في الجمع',
            question: <><MathExpression>{itemExpression(carryDemo)}</MathExpression> — مثال مصغّر على الحمل.</>,
            figure: <ColumnOperation item={carryDemo} />,
            solution: [
              <>في الآحاد: <MathExpression>7 + 8 = 15</MathExpression>، نكتب <MathExpression>5</MathExpression> ونحمل <MathExpression>1</MathExpression> إلى العشرات.</>,
              <>في العشرات: <MathExpression>4 + 3 = 7</MathExpression>، ومع الحمل <MathExpression>1</MathExpression> تصبح <MathExpression>8</MathExpression>.</>,
            ],
            answer: <>الناتج <MathExpression>{result(carryDemo)}</MathExpression>.</>,
            verification: <>نعيد الجمع بترتيب آخر: <MathExpression>38 + 47 = {result(carryDemo)}</MathExpression>، فالمجموع لم يتغيّر.</>,
          },
          {
            kind: 'example', id: 'l5-ex-borrow', title: 'مثال ② — الاستلاف في الطرح',
            question: <><MathExpression>{itemExpression(borrowDemo)}</MathExpression> — مثال مصغّر على الاستلاف.</>,
            figure: <ColumnOperation item={borrowDemo} />,
            solution: [
              <>في الآحاد: <MathExpression>2</MathExpression> أصغر من <MathExpression>7</MathExpression>، فنستلف <MathExpression>10</MathExpression> من العشرات: <MathExpression>12 − 7 = 5</MathExpression>.</>,
              <>في العشرات: صارت <MathExpression>5</MathExpression> بعد الاستلاف <MathExpression>4</MathExpression>، و<MathExpression>4 − 2 = 2</MathExpression>.</>,
            ],
            answer: <>الفرق <MathExpression>{result(borrowDemo)}</MathExpression>.</>,
            verification: <><MathExpression>27 + {result(borrowDemo)} = 52</MathExpression>؛ فالجمع العكسي يؤكّد الطرح.</>,
          },
        ],
      },
      {
        id: 'l5-book-examples',
        title: 'أمثلة الكتاب المحلولة (ص 19–21)',
        blocks: [
          {
            kind: 'example', id: 'l5-ex-invoice', title: 'مثال ③ — قيمة الفاتورة (ص 19)',
            question: invoiceExample.context ?? 'الفاتورة تبيّن سعر شراء كميّات من المواد اللازمة لإكمال البناء: إسمنت وحديد. ما قيمة الفاتورة؟',
            solution: [
              'قيمة الفاتورة هي ناتج جمع العددين؛ فالمطلوب ضمّ كميتين.',
              'نرتّب الخانات المتقابلة على اليمين ونجمع بدءاً من الآحاد، ونحمل كلما تجاوز ناتج الخانة 9.',
              'نكتب الجواب بجملة كاملة مع الوحدة (ليرة سورية).',
            ],
            figure: <ColumnOperation item={invoiceExample} />,
            answer: <>قيمة الفاتورة <MathExpression>{result(invoiceExample)}</MathExpression> ليرة سوريّة.</>,
            verification: <>نعيد الجمع بتبديل الترتيب: <MathExpression>789,321 + 203,565 = {result(invoiceExample)}</MathExpression>.</>,
          },
          {
            kind: 'table', id: 'l5-table-invoice', title: 'جدول الفاتورة كما ورد في الكتاب',
            headers: ['المادّة', 'السّعر'],
            rows: [
              ['إسمنت', <MathExpression key="cement">{fmt(203565)}</MathExpression>],
              ['حديد', <MathExpression key="iron">{fmt(789321)}</MathExpression>],
            ],
            caption: 'الأسعار بالليرات السورية، ومجموعها هو قيمة الفاتورة.',
          },
          {
            kind: 'example', id: 'l5-ex-refinery', title: 'مثال ④ — إنتاج مصفاة حمص في عامين (ص 20)',
            question: refineryExample.context ?? 'كم كان إنتاج المصفاة في العامين معاً؟',
            figure: <ColumnOperation item={refineryExample} />,
            solution: [
              'المطلوب إنتاج العامين معاً، أي ضمّ كميتين، فالعملية جمع.',
              'نحاذي العددين على اليمين لأنّ لهما عدد الخانات نفسه، ونجمع خانة خانة من اليمين.',
              'نحمل إلى الخانة التالية كلما تجاوز المجموع 9.',
            ],
            answer: <>إنتاج المصفاة في العامين <MathExpression>{result(refineryExample)}</MathExpression> طنّاً.</>,
            verification: <>بإعادة الجمع بترتيب معكوس نحصل على المجموع نفسه: <MathExpression>{result(refineryExample)}</MathExpression>.</>,
          },
          {
            kind: 'example', id: 'l5-ex-three', title: 'مثال ⑤ — جمع ثلاثة أعداد (ص 20)',
            question: threeAddendsExample.context ?? 'ما ناتج جمع الأعداد الثلاثة؟',
            figure: <ColumnOperation item={threeAddendsExample} />,
            solution: [
              'نرتّب الخانات المتقابلة ونجمع بدءاً من الآحاد.',
              'العدد الثالث أقصر من الآخرين، فنحاذيه على اليمين ونترك الخانات العليا فارغة؛ والفراغ يعني صفراً.',
              'قد يصير الحمل في بعض الخانات 2 لأننا نجمع ثلاثة أعداد.',
            ],
            answer: <>الناتج <MathExpression>{result(threeAddendsExample)}</MathExpression>.</>,
            verification: 'نعيد الجمع من الأعلى إلى الأسفل؛ فيجب أن يبقى المجموع نفسه لأنّ الجمع تبديلي.',
          },
          {
            kind: 'example', id: 'l5-ex-laptop', title: 'مثال ⑥ — مقدار الزيادة في سعر الحاسب المحمول (ص 21)',
            question: laptopExample.context ?? 'ما مقدار الزيادة في سعر الحاسب المحمول؟',
            figure: <ColumnOperation item={laptopExample} />,
            solution: [
              'مقدار الزيادة يعني الفرق بين السعرين، فالعملية طرح.',
              'نضع العدد الأكبر (المطروح منه) في الأعلى والأصغر (المطروح) تحته محاذيين على اليمين.',
              'نبدأ من الآحاد ونستلف 10 من الخانة المجاورة كلما كان الرقم العلوي أصغر.',
            ],
            answer: <>مقدار الزيادة <MathExpression>{result(laptopExample)}</MathExpression> ليرة سوريّة.</>,
            verification: <><MathExpression>{fmt(118365)} + {result(laptopExample)} = {fmt(120580)}</MathExpression> ✓ فالجمع العكسي يؤكّد الطرح.</>,
          },
          {
            kind: 'note', id: 'l5-note-printed', tone: 'warning',
            text: <>لننتبه ونتحقّق: جملة الخلاصة المطبوعة في الكتاب ص 21 تقول إنّ مقدار الزيادة <MathExpression>{fmt(laptopPrintedAnswer)}</MathExpression> ليرة سوريّة، بينما العمل بالأعمدة على المعطيات المطبوعة نفسها (<MathExpression>{fmt(120580)} − {fmt(118365)}</MathExpression>) يعطي <MathExpression>{result(laptopExample)}</MathExpression>، ويؤكّده الجمع العكسي. الفرق بينهما <MathExpression>1</MathExpression> فقط، والقيمة الموافقة للمعطيات هي <MathExpression>{result(laptopExample)}</MathExpression>. العبرة: نتحقّق دائماً من الطرح بالجمع.</>,
          },
          {
            kind: 'example', id: 'l5-ex-millions', title: 'مثال ⑦ — طرح ضمن الملايين (ص 21)',
            question: subtractionExample.context ?? 'ما ناتج عملية الطرح ضمن الملايين؟',
            figure: <ColumnOperation item={subtractionExample} />,
            solution: [
              'نرتّب الخانات المتقابلة ونطرح بدءاً من الآحاد.',
              'نستلف من الخانة المجاورة على اليسار عند الحاجة، وننقص تلك الخانة واحداً.',
              'نتابع حتى خانة الملايين.',
            ],
            answer: <>الناتج <MathExpression>{result(subtractionExample)}</MathExpression>.</>,
            verification: <><MathExpression>{fmt(2154231)} + {result(subtractionExample)} = {fmt(3221991)}</MathExpression> ✓</>,
          },
        ],
      },
      {
        id: 'l5-checks',
        title: 'تحقّق من فهمك (ص 21 و22)',
        blocks: [
          {
            kind: 'table', id: 'l5-table-checks', title: 'نواتج عمليات «تحقّق من فهمك»',
            headers: ['الفرع', 'العملية', 'الناتج'],
            rows: [
              ...additionChecks.map(item => [`جمع ${item.label})`, <MathExpression key={`${item.id}-e`}>{itemExpression(item)}</MathExpression>, <MathExpression key={`${item.id}-r`}>{result(item)}</MathExpression>]),
              ...subtractionChecks.map(item => [`طرح ${item.label})`, <MathExpression key={`${item.id}-e`}>{itemExpression(item)}</MathExpression>, <MathExpression key={`${item.id}-r`}>{result(item)}</MathExpression>]),
            ],
            caption: 'فرعا الجمع من ص 21، وفرعا الطرح من ص 22.',
          },
          {
            kind: 'example', id: 'l5-ex-australia', title: 'تحقّق من فهمك (1) — مساحة صحراء أستراليا (ص 21)',
            question: australiaCheck.context ?? 'احسب مساحة صحراء أستراليا.',
            figure: <ColumnOperation item={australiaCheck} />,
            solution: [
              'المعطيات: مساحة الصحراء الكبرى، ومقدار نقص مساحة صحراء أستراليا عنها؛ فالمطلوب إيجاد مقدار أقل، أي عملية طرح.',
              'نضع مساحة الصحراء الكبرى (المطروح منه) في الأعلى ومقدار النقص (المطروح) تحته.',
              'نطرح خانة خانة من اليمين مع الاستلاف عند الحاجة.',
            ],
            answer: <>مساحة صحراء أستراليا <MathExpression>{result(australiaCheck)}</MathExpression> كم².</>,
            verification: <><MathExpression>{fmt(3264240)} + {result(australiaCheck)} = {fmt(5628000)}</MathExpression> ✓</>,
          },
        ],
      },
      {
        id: 'l5-drills',
        title: 'تدرّب ① (ص 22): اثنتا عشرة عملية',
        blocks: [
          {
            kind: 'table', id: 'l5-table-drills', title: 'احسب ناتج كلّ ممّا يأتي',
            headers: ['الفرع', 'العملية', 'الناتج'],
            rows: drillItems.map(item => [item.label, <MathExpression key={`${item.id}-e`}>{itemExpression(item)}</MathExpression>, <MathExpression key={`${item.id}-r`}>{result(item)}</MathExpression>]),
            caption: 'الرمز − يعني الطرح، والرمز + يعني الجمع. راجع في كل فرع مواضع الحمل أو الاستلاف.',
          },
        ],
      },
      {
        id: 'l5-applications',
        title: 'تطبيقات واقعية (ص 22 · تدرّب ②③)',
        blocks: applicationProblems.flatMap(problem => [
          {
            kind: 'example' as const,
            id: `l5-ex-${problem.id}`,
            title: `${problem.title} — تدرّب ${problem.label}`,
            question: problem.question,
            figure: <ColumnOperation item={problem} />,
            solution: problem.operator === '+'
              ? [
                'المطلوب عدد المنشورات كلها، أي ضمّ كميتين، فالعملية جمع.',
                'نحاذي العددين على اليمين ونجمع خانة خانة من الآحاد مع الحمل عند الحاجة.',
                'نكتب الجواب بجملة كاملة.',
              ]
              : [
                'المطلوب مقدار الزيادة، أي الفرق بين كتلتين، فالعملية طرح.',
                'نضع الكتلة الأكبر (المطروح منه) في الأعلى والأصغر (المطروح) تحته.',
                'نطرح من الآحاد مع الاستلاف عند الحاجة، ثم نتحقّق بالجمع العكسي.',
              ],
            answer: <>{problem.operator === '+' ? 'عدد المنشورات التي طبعتها المؤسّسة' : 'مقدار الزيادة في الكتلة'} <MathExpression>{result(problem)}</MathExpression> {problem.operator === '+' ? 'منشوراً.' : 'طنّاً.'}.</>,
            verification: problem.operator === '+'
              ? <>بإعادة الجمع بترتيب آخر يبقى المجموع <MathExpression>{result(problem)}</MathExpression>.</>
              : <><MathExpression>{fmt(problem.operands[1])} + {result(problem)} = {fmt(problem.operands[0])}</MathExpression> ✓</>,
          },
        ]),
      },
      {
        id: 'l5-puzzles',
        title: 'تدرّب ④ (ص 22): ضع الأعداد المناسبة في □',
        blocks: fillPuzzles.flatMap(puzzle => {
          const item: CalcItem = { id: `nb-${puzzle.id}`, label: puzzle.label, operands: puzzle.rows.map(row => row.value), operator: puzzle.operator }
          return [
            {
              kind: 'example' as const,
              id: `l5-ex-${puzzle.id}`,
              title: `${puzzle.label}) ${puzzle.operator === '+' ? 'جمع' : 'طرح'} ناقص الأرقام`,
              question: (
                <>
                  انسخ العملية ثم أوجد الأرقام المفقودة:
                  <span className="nb-column-skeleton" dir="ltr">
                    {puzzle.rows.map((row, index) => (
                      <span key={row.value}>
                        {index === puzzle.rows.length - 1 ? (puzzle.operator === '+' ? '+' : '\u00A0') : '\u00A0'}
                        {skeleton(row, puzzle.width)}
                        <br />
                      </span>
                    ))}
                    {'\u00A0'}{skeleton(puzzle.result, puzzle.width)}
                  </span>
                </>
              ),
              figure: <ColumnOperation item={item} />,
              solution: [
                'نبدأ دائماً من خانة الآحاد، ونستعمل الحمل أو الاستلاف لاكتشاف بقيّة الأرقام.',
                <>الأرقام المفقودة في الصفوف هي: {puzzle.rows.map((row, index) => row.hidden.length ? <span key={row.value}>{index > 0 ? 'و' : ''}<MathExpression>{hiddenDigits(row)}</MathExpression></span> : null)}.</>,
                <>الأرقام المفقودة في الناتج هي: <MathExpression>{hiddenDigits(puzzle.result)}</MathExpression>.</>,
                <>العملية الكاملة: <MathExpression>{itemExpression(item)} = {result(item)}</MathExpression>.</>,
              ],
              answer: <><MathExpression>{itemExpression(item)} = {result(item)}</MathExpression></>,
              verification: puzzle.operator === '+'
                ? 'نجمع الأرقام التي وضعناها في كل خانة من جديد؛ فيجب أن تعطي خانة الناتج نفسها مع الحمل.'
                : <>نجمع المطروح مع الفرق: <MathExpression>{fmt(puzzle.rows[1].value)} + {fmt(puzzle.result.value)} = {fmt(puzzle.rows[0].value)}</MathExpression> ✓</>,
            },
          ]
        }),
      },
      {
        id: 'l5-mistake',
        title: 'اكتشف الخطأ',
        blocks: [
          {
            kind: 'example', id: 'l5-ex-mistake', title: 'عملية حلّها أحد الطلاب خطأ',
            question: <><MathExpression>{itemExpression(mistakeWork)}</MathExpression> كتبها طالب هكذا: <MathExpression>4,580 + 3,650 = 7,130</MathExpression>. أين الخطأ؟</>,
            figure: <ColumnOperation item={mistakeWork} />,
            solution: [
              <>في خانة العشرات: <MathExpression>8 + 5 = 13</MathExpression>، نكتب <MathExpression>3</MathExpression> ونحمل <MathExpression>1</MathExpression> إلى المئات.</>,
              <>الطالب أهمل الحمل، فنقص الناتج <MathExpression>100</MathExpression>، فظهر <MathExpression>7,130</MathExpression> بدل الناتج الصحيح.</>,
              <>في المئات: <MathExpression>5 + 6 = 11</MathExpression> ومع الحمل <MathExpression>1</MathExpression> تصبح <MathExpression>12</MathExpression>، نكتب <MathExpression>2</MathExpression> ونحمل <MathExpression>1</MathExpression> إلى الألوف.</>,
              <>في الألوف: <MathExpression>4 + 3 = 7</MathExpression> ومع الحمل <MathExpression>1</MathExpression> تصبح <MathExpression>8</MathExpression>.</>,
            ],
            answer: <>الخطأ هو نسيان حمل <MathExpression>1</MathExpression> من خانة العشرات إلى المئات، والناتج الصحيح <MathExpression>{result(mistakeWork)}</MathExpression>.</>,
            verification: <>بإعادة الجمع من الأعلى إلى الأسفل نحصل على <MathExpression>{result(mistakeWork)}</MathExpression> أيضاً.</>,
          },
        ],
      },
      {
        id: 'l5-warnings',
        title: 'تنبيهات وأخطاء شائعة',
        blocks: [
          {
            kind: 'note', id: 'l5-warn-carry', tone: 'warning',
            text: 'في الجمع: لا تنسَ الحمل، ولا تحاذِ الأعداد على اليسار بدل اليمين فتختلط المنازل.',
          },
          {
            kind: 'note', id: 'l5-warn-borrow', tone: 'warning',
            text: <>في الطرح: لا تطرح الرقم الأصغر من الأكبر داخل الخانة الواحدة (مثل قول <MathExpression>3 − 8 = 5</MathExpression>)؛ الصواب أن نستلف <MathExpression>10</MathExpression> من الخانة المجاورة.</>,
          },
          {
            kind: 'note', id: 'l5-tip-length', tone: 'tip',
            text: <>عند جمع أعداد مختلفة الطول (مثل <MathExpression>78,371</MathExpression> مع عدد من سبع خانات) حاذِها على اليمين واترك الخانات العليا فارغة؛ الفراغ يعني صفراً.</>,
          },
          {
            kind: 'note', id: 'l5-tip-borrow-mark', tone: 'tip',
            text: 'عند الاستلاف المتتالي، علّم كل خانة استلفت منها وانقصها واحداً قبل أن تنتقل إلى الخانة التالية؛ فهذا يمنع نسيان الاستلاف.',
          },
        ],
      },
    ],
  }
}
