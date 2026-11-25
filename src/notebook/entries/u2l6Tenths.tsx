import { Cmp, Frac, NumberLineFigure, TenthsGrid, rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  decimalForTenths,
  fractionForTenths,
  p62ComparisonItems,
  p62GridItems,
  p63CheckOneItems,
  p63CheckThreeItems,
  p63ExampleItems,
  p64ComparisonItems,
  p64NumberLineValues,
  p64TableColumns,
  p65ComparisonItems,
  p65MatchDecimals,
  p65MatchFractions,
  p65RulerItems,
  p65ShadingItems,
  p65VerbalItems,
} from '../../lessons/tenthsOneData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 6: الأجزاء العشرية (1) (الكتاب ص 62–65).
 *
 * Source of truth: `src/lessons/tenthsOneData.ts`. Every printed number, comparison, ruler reading,
 * shading target and matching pair is read from that file, and the decimal/fraction spelling comes
 * from its own helpers (`decimalForTenths`, `fractionForTenths`) rather than being typed by hand.
 * The models here are the notebook's own static drawings: the lesson's grids are interactive.
 */
const tenths = (value: string): string => value.replace(/\s+/gu, '')

/** The printed comparison of a pair, e.g. `0.1 < 0.3`. */
const comparison = (left: string, relation: '<' | '=' | '>', right: string) => (
  <Cmp
    key={`${left}${relation}${right}`}
    left={tenths(left).includes('/') ? <Frac n={tenths(left).split('/')[0]!} d={tenths(left).split('/')[1]!} /> : left}
    op={relation}
    right={tenths(right).includes('/') ? <Frac n={tenths(right).split('/')[0]!} d={tenths(right).split('/')[1]!} /> : right}
  />
)

export function tenthsNotebook(): NotebookDoc {
  return {
    lessonId: 'tenths-one',
    lessonTitle: 'الأجزاء العشرية (1)',
    unit: 'الوحدة الثانية',
    pages: 'ص 62–65',
    theme: 'l6-tenths-one',
    sections: [
      {
        id: 'u2l6-terms',
        purpose: 'record',
        title: 'الجزء من عشرة: الكسر والكتابة العشرية واللفظ',
        blocks: [
          {
            kind: 'definition', id: 'u2l6-def-tenth',
            term: 'الجزء من عشرة',
            text: rich('الجزء من عشرة كسر مقامه 10، وبسطه عدد الأجزاء المأخوذة من الواحد بعد تقسيمه إلى عشرة أجزاء متساوية. فإذا كانت أجزاؤه من 1 إلى 9 فالعدد أصغر من 1، وإذا كانت 10 فالكسر يساوي 1.'),
            source: 'الكتاب · ص 62',
          },
          {
            kind: 'definition', id: 'u2l6-def-decimal',
            term: 'الكتابة العشرية 0.□',
            text: rich('نكتب الصفر (لا آحاد كاملة)، ثم الفاصلة العشرية، ثم خانة واحدة تمثّل عدد الأجزاء من عشرة. فالخانة التي تلي الفاصلة مباشرة هي خانة الأعشار.'),
            source: 'الكتاب · ص 63',
          },
          {
            kind: 'table', id: 'u2l6-table-three-forms',
            title: 'ثلاث صور للعدد نفسه: كسر ← عشري ← لفظ',
            headers: ['الكسر', 'الكتابة العشرية', 'القراءة اللفظية'],
            rows: p63ExampleItems.map(item => [
              <Frac key={`${item.id}-f`} n={item.numerator} d={10} />,
              rich(decimalForTenths(item.numerator)),
              rich(item.label),
            ]),
            caption: rich('الكسر والعدد العشري والقراءة اللفظية ثلاث صور لقيمة واحدة؛ فـ 4/10 = 0.4 تُقرأ «أربعة أجزاء من عشرة» أو «أربعة بالعشرة».'),
          },
          {
            kind: 'figure', id: 'u2l6-figure-shading',
            title: 'النموذج: الشبكة مقسّمة إلى عشرة أجزاء',
            figure: (
              <>
                <TenthsGrid shaded={3} label="شريط مقسّم إلى عشرة أجزاء متساوية، ثلاثة منها ملوّنة: ثلاثة أعشار" />
                <TenthsGrid shaded={10} label="شريط مقسّم إلى عشرة أجزاء، جميعها ملوّنة: عشرة أعشار" />
              </>
            ),
            caption: rich('الشريط الأول يمثّل 3/10 = 0.3، والشريط الثاني يمثّل 10/10 = 1.'),
            labels: [
              rich('عدد الأجزاء الملوّنة هو البسط؛ وعدد الأجزاء كلها هو المقام 10.'),
              rich('عندما تُلوّن الأجزاء العشرة كلها يكون الكسر 10/10 ويساوي 1.'),
            ],
          },
          {
            kind: 'example', id: 'u2l6-ex-one-tenth',
            title: 'مثال مُدوَّن: من الكسر إلى الكتابة العشرية واللفظ',
            question: rich('اكتب الكسر 1/10 كتابةً عشرية، واقرأه لفظياً.'),
            solution: [
              rich('① المقام 10، فبعد الفاصلة خانة واحدة فقط (خانة الأعشار).'),
              rich('② البسط 1 هو رقم خانة الأعشار: 0.1.'),
              rich('③ نقرأ: «واحد من عشرة» أو «واحد بالعشرة».'),
            ],
            answer: rich('1/10 = 0.1 ويُقرأ «واحد من عشرة».'),
            verification: rich('بالعودة: 0.1 يعني جزءاً واحداً من عشرة، أي الكسر 1/10 نفسه.'),
          },
          {
            kind: 'rule', id: 'u2l6-rule-forms',
            title: 'قاعدة التحويل بين الصورتين',
            text: rich('من الكسر إلى العشري: نكتب الصفر ثم الفاصلة ثم بسط الأجزاء من عشرة مباشرة. ومن العشري إلى الكسر: الرقم الذي بعد الفاصلة هو البسط، والمقام 10 دائماً (لأن بعد الفاصلة خانة واحدة فقط).'),
          },
          {
            kind: 'note', id: 'u2l6-note-ten-tenths', tone: 'tip',
            text: rich('10/10 = 1 و0.9 أصغر من 1: الرقم بعد الفاصلة لا يتجاوز 9 في خانة واحدة؛ فإذا بلغت الأجزاء عشرة كاملة صارت واحداً صحيحاً.'),
          },
        ],
      },
      {
        id: 'u2l6-compare',
        purpose: 'record',
        title: 'مقارنة الأعداد العشرية وترتيبها',
        blocks: [
          {
            kind: 'rule', id: 'u2l6-rule-compare',
            title: 'قاعدة المقارنة',
            text: rich('لمقارنة عددين عشريين بخانة واحدة بعد الفاصلة نقارن الرقمين اللذين بعد الفاصلة، لأن الأجزاء من الحجم نفسه (أعشار). الأكبر رقماً هو الأكبر قيمة، ويمكن أيضاً تحويلهما إلى كسرين مقامهما 10 ثم مقارنة البسطين.'),
          },
          {
            kind: 'steps', id: 'u2l6-steps-compare',
            title: 'خطوات المقارنة بين عددين عشريين',
            steps: [
              rich('① تأكد أن العددين مكتوبان بالصورة العشرية، وأن عدد الخانات بعد الفاصلة واحد في كليهما.'),
              rich('② إذا كان أحدهما كسراً، حوّله إلى عشري: البسط بعد الفاصلة والمقام 10.'),
              rich('③ قارن الرقمين بعد الفاصلة؛ الأكبر هو الأكبر.'),
              rich('④ إذا تساوى الرقمان فالقيمتان متساويتان، ونكتب =.'),
              rich('⑤ تحقق: حوّل الطرفين إلى كسرين مقامهما 10 وتأكد من صحة العلاقة.'),
            ],
          },
          {
            kind: 'figure', id: 'u2l6-figure-line',
            title: 'خط الأعداد من 0 إلى 1 بأجزاء من عشرة',
            figure: <NumberLineFigure ticks={[{ label: '0' }, ...p64NumberLineValues.map(value => ({ label: String(value) })), { label: '1' }]} marks={0} label="خط أعداد من 0 إلى 1، كل تدريجة تزيد عُشراً واحداً" highlight="0.7" />,
            caption: rich('كل تدريجة تزيد 0.1؛ والعدد 0.7 مطبوع في الكتاب في موضعه.'),
            labels: [
              rich('الأعداد بين 0 و1 على هذا الخط كلها أجزاء من عشرة.'),
              rich('الانتقال من تدريجة إلى التي تليها يعني إضافة 0.1.'),
            ],
          },
          {
            kind: 'table', id: 'u2l6-table-compare',
            title: 'جدول المقارنة (ص 64)',
            headers: ['الفرع', 'المقارنة', 'لماذا؟'],
            rows: [
              [rich('أ'), comparison('0.1', '<', '0.3'), rich('0.1 = 1/10 و0.3 = 3/10؛ و1 < 3')],
              [rich('ب'), comparison('0.5', '<', '0.6'), rich('0.5 = 5/10 و0.6 = 6/10؛ و5 < 6')],
              [rich('ج'), comparison('0.8', '>', '0.4'), rich('0.8 = 8/10 و0.4 = 4/10؛ و8 > 4')],
              [rich('د'), comparison('0.5', '=', '5/10'), rich('خمسة أعشار تساوي الكسر خمسة على عشرة')],
            ],
            caption: rich('المقارنة تصح دائماً عندما نُعيد الطرفين إلى أجزاء من عشرة.'),
          },
          {
            kind: 'text', id: 'u2l6-text-line',
            text: rich('الأعداد المطبوعة على خط الأعداد في ص 64 هي 0.2 و0.3 و0.4 و0.5 و0.6 و0.8 و0.9، ويبقى العدد 0.7 في موضعه؛ وترتيبها تصاعدياً هو نفسه ترتيب ظهورها على الخط من اليسار إلى اليمين.'),
          },
        ],
      },
      {
        id: 'u2l6-check',
        purpose: 'practice',
        title: 'تحقّق من فهمك (ص 62–63)',
        blocks: [
          {
            kind: 'table', id: 'u2l6-table-grids',
            title: 'التمرين 1 (ص 62) · اكتب الكسر الدال على الجزء الملوّن',
            headers: ['الفرع', 'عدد الأجزاء الملوّنة', 'الكسر', 'الكتابة العشرية'],
            rows: p62GridItems.map(item => [
              rich(item.label),
              rich(String(item.numerator)),
              <Frac key={`${item.id}-f`} n={item.numerator} d={10} />,
              rich(item.numerator === 10 ? '1' : decimalForTenths(item.numerator)),
            ]),
          },
          {
            kind: 'table', id: 'u2l6-table-compare-62',
            title: 'التمرين 2 (ص 62) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة'],
            rows: p62ComparisonItems.map(item => [rich(item.label), comparison(item.left, item.relation, item.right)]),
            caption: rich('في الفرع (ب) يساوي الكسر 10/10 الواحد الصحيح، أما في الفرع (ج) فالمقامان متساويان ونقارن البسطين.'),
          },
          {
            kind: 'table', id: 'u2l6-table-facts',
            title: 'تحقّق من فهمك 1 (ص 63) · فقرة «هل تعلم»',
            headers: ['الحقيقة المطبوعة', 'الكتابة العشرية', 'القراءة اللفظية'],
            rows: [
              [rich(p63CheckOneItems[0]!.label), rich(decimalForTenths(p63CheckOneItems[0]!.numerator)), rich(`${p63CheckOneItems[0]!.numerator} أجزاء من عشرة`)],
              [rich(p63CheckOneItems[1]!.label), rich(decimalForTenths(p63CheckOneItems[1]!.numerator)), rich(`${p63CheckOneItems[1]!.numerator} أجزاء من عشرة`)],
            ],
          },
          {
            kind: 'table', id: 'u2l6-table-check3',
            title: 'تحقّق من فهمك 3 (ص 63) · اكتب الكسر كتابة عشرية',
            headers: ['الفرع', 'الكسر', 'الكتابة العشرية'],
            rows: p63CheckThreeItems.map(item => [
              rich(item.label),
              <Frac key={`${item.id}-f`} n={item.numerator} d={10} />,
              rich(decimalForTenths(item.numerator)),
            ]),
          },
          {
            kind: 'text', id: 'u2l6-text-nine-tenths',
            text: rich('مثال آخر من صفحة 63: العدد 0.9 يُعبَّر عنه لفظياً «تسعة أجزاء من عشرة»، والكسر المكافئ له بمقام 10 هو 9/10؛ وتحقق: 9/10 = 0.9.'),
          },
          {
            kind: 'table', id: 'u2l6-table-table64',
            title: 'جدول ص 64 · أكمل الكسر أو الكتابة العشرية',
            headers: ['العمود', 'الكسر', 'الكتابة العشرية'],
            rows: p64TableColumns.map((column, index) => [
              rich(`العمود ${index + 1}`),
              <Frac key={`${column.id}-f`} n={column.answerFraction.split('/')[0]!} d={10} />,
              rich(column.answerDecimal),
            ]),
            caption: rich('الخانة الفارغة في كل عمود هي المطلوب، والقيمة الأخرى مطبوعة في الكتاب.'),
          },
        ],
      },
      {
        id: 'u2l6-practice',
        purpose: 'practice',
        title: 'حلول تدريبات ص 64–65',
        blocks: [
          {
            kind: 'table', id: 'u2l6-table-compare-64',
            title: 'تمارين المقارنة (ص 64)',
            headers: ['الفرع', 'المقارنة'],
            rows: p64ComparisonItems.map(item => [rich(item.label), comparison(item.left, item.relation, item.right)]),
          },
          {
            kind: 'table', id: 'u2l6-table-rulers',
            title: 'السؤال 3 (ص 65) · قراءة المسطرة',
            headers: ['الفرع', 'عدد الأعشار', 'الكتابة العشرية'],
            rows: p65RulerItems.map(item => [rich(item.label), rich(String(item.tenths)), rich(decimalForTenths(item.tenths))]),
            caption: rich('المسطرة مقسّمة إلى عشرة أجزاء متساوية بين 0 و1؛ عدد التدريجات المقطوعة هو عدد الأعشار.'),
          },
          {
            kind: 'table', id: 'u2l6-table-shading',
            title: 'السؤال 4 (ص 65) · كم خلية نلوّن؟',
            headers: ['الشكل', 'العدد المطلوب', 'عدد الخلايا'],
            rows: p65ShadingItems.map(item => [rich(item.position), rich(item.decimal), rich(`${item.tenths} من 10`)]),
          },
          {
            kind: 'table', id: 'u2l6-table-verbal',
            title: 'السؤال 5 (ص 65) · من العبارة اللفظية إلى الكسر والعشري',
            headers: ['الفرع', 'العبارة', 'الكسر', 'العشري'],
            rows: p65VerbalItems.map(item => [
              rich(item.label),
              rich(item.verbal),
              <Frac key={`${item.id}-f`} n={item.numeral} d={10} />,
              rich(decimalForTenths(item.numeral)),
            ]),
          },
          {
            kind: 'table', id: 'u2l6-table-compare-65',
            title: 'السؤال 6 (ص 65) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة'],
            rows: p65ComparisonItems.map(item => [rich(item.label), comparison(item.left, item.relation, item.right)]),
            caption: rich('لاحظ الفرع (و): العدد 1 يساوي 10/10 أي عشرة أعشار، فهو أكبر من 0.2.'),
          },
          {
            kind: 'table', id: 'u2l6-table-match',
            title: 'السؤال 8 (ص 65) · طابق العدد العشري بالكسر المساوي',
            headers: ['العدد العشري', 'الكسر المساوي', 'لماذا؟'],
            rows: [
              [rich(p65MatchDecimals[0]!.value), <Frac key="m1" n={p65MatchFractions[2]!.value.split('/')[0]!} d={p65MatchFractions[2]!.value.split('/')[1]!} />, rich('9/30 نقسم على 3 فنحصل على 3/10')],
              [rich(p65MatchDecimals[1]!.value), <Frac key="m2" n={p65MatchFractions[3]!.value.split('/')[0]!} d={p65MatchFractions[3]!.value.split('/')[1]!} />, rich('16/40 نقسم على 4 فنحصل على 4/10')],
              [rich(p65MatchDecimals[2]!.value), <Frac key="m3" n={p65MatchFractions[0]!.value.split('/')[0]!} d={p65MatchFractions[0]!.value.split('/')[1]!} />, rich('5/10 خمسة أعشار')],
              [rich(p65MatchDecimals[3]!.value), <Frac key="m4" n={p65MatchFractions[1]!.value.split('/')[0]!} d={p65MatchFractions[1]!.value.split('/')[1]!} />, rich('3/5 نضرب البسط والمقام في 2 فنحصل على 6/10')],
            ],
          },
          {
            kind: 'text', id: 'u2l6-text-between',
            text: rich('السؤال 7 (ص 65) يطلب عدداً بين 0.3 و0.7: أي عدد أكبر تماماً من 0.3 وأصغر تماماً من 0.7 صالح، مثل 0.4 أو 0.5 أو 0.6، والإجابة ليست وحيدة.'),
          },
        ],
      },
      {
        id: 'u2l6-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l6-note-mistake-1', tone: 'warning',
            text: rich('① مقارنة الأعداد العشرية بعدد الخانات أو بطول الكتابة: 0.9 أكبر من 0.10 لو كتبنا عشرة أعشار بخطأ؛ الصواب أن نقارن قيمة الرقم في خانة الأعشار.'),
          },
          {
            kind: 'note', id: 'u2l6-note-mistake-2', tone: 'warning',
            text: rich('② الخلط بين 10/10 والعدد 0.10: عشرة أعشار تساوي 1، لأن البسط يساوي المقام.'),
          },
          {
            kind: 'note', id: 'u2l6-note-mistake-3', tone: 'warning',
            text: rich('③ كتابة البسط في خانة الآحاد بدل خانة الأعشار: 0.4 ليس 4 بل أربعة أعشار؛ والصفر قبل الفاصلة ضروري لأنه لا توجد آحاد كاملة.'),
          },
          {
            kind: 'note', id: 'u2l6-note-mistake-4', tone: 'tip',
            text: rich('للتحقق من أي عدد عشري بخانة واحدة: اضرب ما بعد الفاصلة في 1/10؛ فـ 0.7 = 7 × 1/10 = 7/10.'),
          },
          {
            kind: 'text', id: 'u2l6-text-forms',
            text: rich(`ملخص الصور الثلاث: البسط ${fractionForTenths(7).split('/')[0]} والمقام 10 يعطيان 0.7، وتُقرأ «سبعة أجزاء من عشرة». وهذه الصور الثلاث تُستعمل بالتبادل في التمارين.`),
          },
        ],
      },
    ],
  }
}
