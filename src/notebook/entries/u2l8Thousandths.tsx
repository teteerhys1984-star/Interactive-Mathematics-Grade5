import { Cmp, Frac, NumberLineFigure, ThousandthsBlock, rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  lesson8SourceElements,
  p72Cubes,
  p72Comparisons,
  p73Examples,
  p73Fractions,
  p74Comparisons,
  p75Comparisons,
  p76Comparisons,
  p76Intervals,
  p76Matches,
  p76Ruler,
  p76Table,
  type SourceElement,
} from '../../lessons/decimalPartsThreeData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 8: الأجزاء العشرية (3) (الكتاب ص 72–76).
 *
 * Source of truth: `src/lessons/decimalPartsThreeData.ts`. Printed numbers come from its typed arrays;
 * the ruled reading/rule/verification sentences come from its coverage ledger `lesson8SourceElements`,
 * where every item carries the book's own `answer` and `reasoning[]`. The thousandths model is the
 * notebook's own static drawing of ten slabs of 10×10 cells.
 */
const element = (id: string): SourceElement => {
  const found = lesson8SourceElements.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing lesson 8 source element: ${id}`)
  return found
}

const prompt = (id: string): string => element(id).prompt
const answer = (id: string): string => element(id).answer
const reasoning = (id: string): readonly string[] => element(id).reasoning

/** A printed value: a fraction `a/b` becomes a stacked fraction, anything else stays as printed. */
const value = (printed: string, key: string) =>
  printed.includes('/')
    ? <Frac key={key} n={printed.split('/')[0]!} d={printed.split('/')[1]!} />
    : <span key={key} className="nb-math-run">{printed}</span>

const comparison = (left: string, relation: '<' | '=' | '>', right: string, key: string) => (
  <Cmp key={key} left={value(left, `${key}-l`)} op={relation} right={value(right, `${key}-r`)} />
)

/* ---------------------------------------------------------------- printed tables */

const compareRows = (items: ReadonlyArray<{ id: string; label: string; left: string; right: string; relation: '<' | '=' | '>' }>) =>
  items.map(item => [rich(item.label), comparison(item.left, item.relation, item.right, item.id)])

export function thousandthsNotebook(): NotebookDoc {
  return {
    lessonId: 'decimal-parts-three',
    lessonTitle: 'الأجزاء العشرية (3)',
    unit: 'الوحدة الثانية',
    pages: 'ص 72–76',
    theme: 'lesson-decimal-three',
    sections: [
      {
        id: 'u2l8-terms',
        purpose: 'record',
        title: 'الجزء من ألف: كيف نراه ونكتبه؟',
        blocks: [
          {
            kind: 'text', id: 'u2l8-text-goals',
            text: rich(answer('l8-p72-goals')),
          },
          {
            kind: 'definition', id: 'u2l8-def-thousandth',
            term: 'الجزء من ألف',
            text: rich(`${answer('l8-p72-opening')} ${reasoning('l8-p72-opening').join(' ')}`),
            source: 'الكتاب · ص 72 (انطلاقة نشطة)',
          },
          {
            kind: 'rule', id: 'u2l8-rule-place-value',
            title: 'ثلاث خانات بعد الفاصلة',
            text: rich(`${answer('l8-p73-place-value')} ${reasoning('l8-p73-place-value').join(' ')}`),
          },
          {
            kind: 'figure', id: 'u2l8-figure-block',
            title: 'النموذج: مكعب مقسّم إلى ألف جزء (عشر شرائح)',
            figure: <ThousandthsBlock shaded={213} label="مكعب مقسّم إلى عشر شرائح، كل شريحة مئة جزء، والمجموع ألف جزء؛ ثلاثة عشر ومئتا جزء من ألف ملوّنة" />,
            caption: rich('المكعب كله 1000 جزء. الملوّن هنا 213 جزءاً، أي شريحتان كاملتان (200) و13 جزءاً من الشريحة الثالثة؛ لذلك 213/1000 = 0.213.'),
            labels: [
              rich('كل شريحة = 100 جزء من ألف، وكل مكعب صغير = جزء واحد من ألف.'),
              rich('المقام 1000 يفرض ثلاث خانات بعد الفاصلة.'),
              rich('1000/1000 = 1 أي المكعب كاملاً.'),
            ],
          },
          {
            kind: 'table', id: 'u2l8-table-forms',
            title: 'جدول الأمثلة (ص 73): كسر ← عشري ← لفظ',
            headers: ['الكسر', 'الكتابة العشرية', 'القراءة اللفظية'],
            rows: p73Examples.map(item => [
              <Frac key={`${item.id}-f`} n={item.numerator} d={1000} />,
              rich(item.decimal),
              rich(item.verbal),
            ]),
            caption: rich(answer('l8-p73-examples')),
          },
          {
            kind: 'note', id: 'u2l8-note-zeros', tone: 'warning',
            text: rich('الأصفار تُضاف إلى يسار البسط بعد الفاصلة: 5/1000 = 0.005 و51/1000 = 0.051. وكتابة 0.5 أو 0.51 خطأ لأن الخانات لا تمثّل أجزاء الألف.'),
          },
        ],
      },
      {
        id: 'u2l8-compare',
        purpose: 'record',
        title: 'المقارنة والعلاقة بين الأعشار والأجزاء من مئة وألف',
        blocks: [
          {
            kind: 'rule', id: 'u2l8-rule-compare',
            title: 'قاعدة المقارنة',
            text: rich(`${answer('l8-p74-compare-rule')} ${reasoning('l8-p74-compare-rule').join(' ')}`),
          },
          {
            kind: 'rule', id: 'u2l8-rule-relation',
            title: 'السلّم العشري: كل منزلة عشرة أضعاف ما بعدها',
            text: rich(`${answer('l8-p74-relation')} ${reasoning('l8-p74-relation').join(' ')}`),
          },
          {
            kind: 'table', id: 'u2l8-table-relation',
            title: 'جدول العلاقات (أكتبه بيدي)',
            headers: ['القيمة', 'تساوي أيضاً', 'وأيضاً'],
            rows: [
              [rich('الجزء من عشرة'), rich('10 أجزاء من مئة'), rich('100 جزء من ألف')],
              [rich('الجزء من مئة'), rich('10 أجزاء من ألف'), rich('0.01 = 0.010')],
              [rich('الجزء من ألف'), rich('0.001'), rich('أصغر من 0.01')],
            ],
            caption: rich('لهذا فإن 1/10 = 10/100 = 100/1000، و1/100 = 10/1000.'),
          },
          {
            kind: 'steps', id: 'u2l8-steps-compare',
            title: 'خطوات المقارنة بين عددين عشريين حتى الأجزاء من ألف',
            steps: [
              rich('① اكتب العددين بثلاث خانات بعد الفاصلة (أضف أصفاراً إلى اليمين عند الحاجة).'),
              rich('② قارن الرقم الأول بعد الفاصلة، فإن تساوى فالثاني، ثم الثالث.'),
              rich('③ أو حوّل الطرفين إلى كسرين مقامهما 1000 وقارن البسطين.'),
              rich('④ تحقق بإعادة التحويل أو بمقارنة منازل الرقمين مرة أخرى.'),
            ],
          },
          {
            kind: 'table', id: 'u2l8-table-compare-examples',
            title: 'مثالا المقارنة (ص 74)',
            headers: ['المثال', 'المقارنة', 'الشرح'],
            rows: [
              [rich('مثال 1'), comparison('0.418', '<', '0.513', 'e1'), rich('418/1000 < 513/1000؛ 4 مئات من الألف أصغر من 5')],
              [rich('مثال 2'), comparison('0.325', '<', '0.42', 'e2'), rich('0.42 = 0.420 = 420/1000، و325 < 420')],
            ],
            caption: rich(answer('l8-p74-examples')),
          },
          {
            kind: 'figure', id: 'u2l8-figure-line',
            title: 'خط الأعداد المكبّر بين 0 و0.01',
            figure: <NumberLineFigure ticks={[{ label: '0' }, { label: '0.005' }, { label: '0.010' }]} marks={9} label="خط أعداد من 0 إلى 0.01 مقسّم إلى عشر خطوات، كل خطوة 0.001" />,
            caption: rich(answer('l8-p74-number-line')),
            labels: [...reasoning('l8-p74-number-line')],
          },
          {
            kind: 'note', id: 'u2l8-note-between', tone: 'tip',
            text: rich(`${answer('l8-p75-between-examples')} — وقاعدة الاختيار: اكتب الحدين بثلاث خانات ثم اختر قيمة داخلية لا تساوي أيّاً من الحدين.`),
          },
        ],
      },
      {
        id: 'u2l8-check',
        purpose: 'practice',
        title: 'تحقّق من فهمك (ص 72–76)',
        blocks: [
          {
            kind: 'table', id: 'u2l8-table-cubes',
            title: 'التمرين 1 (ص 72) · الكسر ذو المقام 1000',
            headers: ['الفرع', 'عدد الأجزاء الملوّنة', 'الكسر'],
            rows: p72Cubes.map(item => [
              rich(item.label),
              rich(String(item.numerator)),
              <Frac key={`${item.id}-f`} n={item.numerator} d={1000} />,
            ]),
            caption: rich(answer('l8-p72-ex1')),
          },
          {
            kind: 'table', id: 'u2l8-table-compare-72',
            title: 'التمرين 2 (ص 72) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة'],
            rows: compareRows(p72Comparisons),
            caption: rich(answer('l8-p72-ex2')),
          },
          {
            kind: 'table', id: 'u2l8-table-check1',
            title: 'تحقّق من فهمك 1 (ص 73) · اكتب كل كسر عشرياً ولفظياً',
            headers: ['الكسر', 'العشري', 'اللفظ'],
            rows: p73Fractions.map(item => [
              <Frac key={`${item.id}-f`} n={item.numerator} d={1000} />,
              rich(item.decimal),
              rich(item.verbal),
            ]),
            caption: rich(answer('l8-p73-check1')),
          },
          {
            kind: 'example', id: 'u2l8-ex-check2',
            title: 'تحقّق من فهمك 2 (ص 75) · العدد 0.999',
            question: rich(prompt('l8-p75-check2')),
            solution: [...reasoning('l8-p75-check2')],
            answer: rich(answer('l8-p75-check2')),
          },
          {
            kind: 'table', id: 'u2l8-table-compare-75',
            title: 'تحقّق من فهمك (ص 75) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة'],
            rows: compareRows(p75Comparisons),
            caption: rich(answer('l8-p75-check1')),
          },
        ],
      },
      {
        id: 'u2l8-practice',
        purpose: 'practice',
        title: 'حلول تدريبات ص 75–76',
        blocks: [
          {
            kind: 'table', id: 'u2l8-table-rulers',
            title: 'تدرّب 1 (ص 75–76) · أكمل تدريجات خطوط الأعداد',
            headers: ['الفرع', 'المجال', 'المطبوع', 'القيم الناقصة'],
            rows: [
              [rich('أ'), rich('من 0.020 إلى 0.030'), rich('0.027'), rich('0.021، 0.022، 0.023، 0.024، 0.025، 0.026، 0.028، 0.029')],
              [rich('ب'), rich('من 0.030 إلى 0.040'), rich('0.036'), rich('0.031، 0.032، 0.033، 0.034، 0.035، 0.037، 0.038، 0.039')],
              [rich('ث'), rich(`من 0.0${p76Ruler.from} إلى 0.0${p76Ruler.to}`), rich(`0.0${p76Ruler.printed}`), rich('0.041، 0.042، 0.043، 0.045، 0.046، 0.047، 0.048، 0.049')],
            ],
            caption: rich('الفارق بين طرفي كل خط 0.010، والخط مقسّم إلى عشر خطوات متساوية؛ قيمة كل خطوة 0.001.'),
          },
          {
            kind: 'table', id: 'u2l8-table-table',
            title: 'تدرّب 2 (ص 76) · جدول الكسر والكتابة العشرية',
            headers: ['العمود', 'المطبوع', 'المطلوب'],
            rows: p76Table.map((item, index) => {
              // The ledger is a union: a printed fraction has no `value`, a printed decimal has no fraction text.
              const printedText = 'value' in item ? item.value : `${item.numerator}/1000`
              const required = 'value' in item ? `${item.numerator}/1000` : `0.${String(item.numerator).padStart(3, '0')}`
              return [rich(`العمود ${index + 1}`), rich(printedText), rich(required)]
            }),
            caption: rich(answer('l8-p76-table')),
          },
          {
            kind: 'table', id: 'u2l8-table-match',
            title: 'تدرّب 5 (ص 76) · صل بالكسر المساوي',
            headers: ['العدد العشري', 'الكسر المساوي'],
            rows: p76Matches.map(item => [rich(item.decimal), value(item.fraction, item.id)]),
            caption: rich(answer('l8-p76-match')),
          },
          {
            kind: 'table', id: 'u2l8-table-compare-76',
            title: 'تدرّب 4 (ص 76) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة'],
            rows: compareRows(p76Comparisons),
            caption: rich(answer('l8-p76-check4')),
          },
          {
            kind: 'table', id: 'u2l8-table-intervals',
            title: 'تدرّب 6 (ص 76) · عدد يحقق المتباينة',
            headers: ['الفرع', 'المتباينة', 'مثال صالح'],
            rows: p76Intervals.map(item => [rich(item.label), rich(item.expression), rich(item.sample)]),
            caption: rich(answer('l8-p76-intervals')),
          },
          {
            kind: 'text', id: 'u2l8-text-between-76',
            text: rich(`${prompt('l8-p76-between')} ${answer('l8-p76-between')}`),
          },
        ],
      },
      {
        id: 'u2l8-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l8-note-mistake-1', tone: 'warning',
            text: rich('① كتابة 5/1000 في صورة 0.5 أو 0.05: الصواب 0.005 لأن ثلاث خانات بعد الفاصلة هي التي تمثّل الأجزاء من ألف.'),
          },
          {
            kind: 'note', id: 'u2l8-note-mistake-2', tone: 'warning',
            text: rich('② مقارنة 0.42 و0.325 بترتيب الأرقام دون توحيد الخانات: الصواب 0.42 = 0.420 ثم 420 > 325.'),
          },
          {
            kind: 'note', id: 'u2l8-note-mistake-3', tone: 'warning',
            text: rich('③ الخلط بين 0.1 و0.01 و0.001: كل واحدة أصغر من التي قبلها بعشرة أضعاف.'),
          },
          {
            kind: 'note', id: 'u2l8-note-mistake-4', tone: 'tip',
            text: rich('قاعدة تحقق سريعة: عدد مرات الأصفار في المقام (1000) هي عدد الخانات بعد الفاصلة (ثلاث). وكل صفر إضافي في المقام يزيح البسط خانة إلى اليمين بعد الفاصلة.'),
          },
        ],
      },
    ],
  }
}
