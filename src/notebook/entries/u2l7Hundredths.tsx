import { Cmp, Frac, HundredthsGrid, NumberLineFigure, rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  decimalForHundredths,
  p66ComparisonItems,
  p66GridItems,
  p66IntroFacts,
  p67Examples,
  p68CheckOne,
  p68CheckThree,
  p68CompareExamples,
  p69BetweenExamples,
  p69CheckOne,
  p70RulerOne,
  p70RulerTwo,
  p70TableColumns,
  p71BetweenItems,
  p71ComparisonItems,
  p71Ex4,
  p71MatchDecimals,
  p71ShadeItems,
  verbalForHundredths,
} from '../../lessons/decimalPartsTwoData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 7: الأجزاء العشرية (2) (الكتاب ص 66–71).
 *
 * Source of truth: `src/lessons/decimalPartsTwoData.ts`. Every printed value, comparison, ruler and
 * matching pair is read from that file, and the decimal/verbal spelling comes from its helpers
 * (`decimalForHundredths`, `verbalForHundredths`). The hundredths model is the notebook's own static
 * 10×10 square.
 */
const flat = (value: string): string => value.replace(/\s+/gu, '')

/** A fraction written from its printed form `a/b`, or the plain value when it has no bar. */
const value = (printed: string, key: string) =>
  flat(printed).includes('/')
    ? <Frac key={key} n={flat(printed).split('/')[0]!} d={flat(printed).split('/')[1]!} />
    : <span key={key} className="nb-math-run">{printed}</span>

const comparison = (left: string, relation: '<' | '=' | '>', right: string, key: string) => (
  <Cmp key={key} left={value(left, `${key}-l`)} op={relation} right={value(right, `${key}-r`)} />
)

export function hundredthsNotebook(): NotebookDoc {
  return {
    lessonId: 'decimal-parts-two',
    lessonTitle: 'الأجزاء العشرية (2)',
    unit: 'الوحدة الثانية',
    pages: 'ص 66–71',
    theme: 'l7-decimal-two',
    sections: [
      {
        id: 'u2l7-terms',
        purpose: 'record',
        title: 'الجزء من مئة: معنى الكسر ومعنى الخانة',
        blocks: [
          {
            kind: 'definition', id: 'u2l7-def-hundredth',
            term: 'الجزء من مئة',
            text: rich('الجزء من مئة كسر مقامه 100، وبسطه عدد الأجزاء المأخوذة بعد تقسيم الواحد إلى مئة جزء متساوٍ. والحصول على أجزاء من مئة يكون بتقسيم كل جزء من عشرة إلى عشرة أجزاء أصغر، لأن 10 × 10 = 100.'),
            source: 'الكتاب · ص 66',
          },
          {
            kind: 'definition', id: 'u2l7-def-decimal',
            term: 'الكتابتان العشريتان: خانة واحدة وخانتان',
            text: rich('الخانة الأولى بعد الفاصلة خانة الأعشار (مقامها 10)، والخانة الثانية خانة الأجزاء من مئة (مقامها 100). فعدد مثل 0.14 يعني 14 جزءاً من مئة، ولا يعني 1 و4 أعشار.'),
            source: 'الكتاب · ص 67',
          },
          {
            kind: 'figure', id: 'u2l7-figure-grids',
            title: 'النموذج: مربع مقسّم إلى مئة جزء',
            figure: (
              <>
                <HundredthsGrid shaded={14} label="مربع مقسّم إلى مئة خلية متساوية، أربع عشرة منها ملوّنة: أربعة عشر جزءاً من مئة" />
                <HundredthsGrid shaded={5} label="مربع مقسّم إلى مئة خلية، خمس منها ملوّنة: خمسة أجزاء من مئة" />
              </>
            ),
            caption: rich('الشكل الأول يمثّل 0.14 والشكل الثاني يمثّل 0.05؛ لاحظ أن 0.05 خمسة أجزاء فقط وليست خمسين.'),
            labels: [
              rich('المقام 100 يعني تقسيم المربع إلى 10 صفوف × 10 أعمدة.'),
              rich('البسط هو عدد الخلايا الملوّنة.'),
              rich('الصفر بعد الفاصلة يحفظ موضع خانة الأجزاء من مئة: 0.05 لا 0.5.'),
            ],
          },
          {
            kind: 'table', id: 'u2l7-table-forms',
            title: 'جدول الأمثلة (ص 67): كسر ← عشري ← لفظ',
            headers: ['العدد الأجزاء من مئة', 'الكتابة العشرية', 'القراءة اللفظية'],
            rows: p67Examples.map(item => [
              <Frac key={`${item.id}-f`} n={item.numerator} d={100} />,
              rich(item.decimal),
              rich(item.verbal),
            ]),
            caption: rich('كل عدد مكتوب بخانتين بعد الفاصلة يقابل كسراً مقامه 100، والبسط هو الرقمان معاً لا الرقم الثاني وحده.'),
          },
          {
            kind: 'example', id: 'u2l7-ex-fourteen',
            title: 'مثال مُدوَّن: أربعة عشر جزءاً من مئة',
            question: rich('اكتب الكسر 14/100 كتابةً عشرية، واقرأه لفظياً.'),
            solution: [
              rich('① المقام 100، فبعد الفاصلة خانتان: الأعشار ثم الأجزاء من مئة.'),
              rich('② البسط 14 يُكتب في الخانتين معاً: 0.14، لا 0.4 ولا 0.104.'),
              rich('③ نقرأ: «أربعة عشر جزءاً من مئة» أو «أربعة عشر بالمئة».'),
            ],
            answer: rich('14/100 = 0.14 ويُقرأ «أربعة عشر جزءاً من مئة».'),
            verification: rich('الرقمان بعد الفاصلة في 0.14 هما 14، وإذا حذفنا الفاصلة وكتبنا المقام 100 عدنا إلى 14/100.'),
          },
          {
            kind: 'rule', id: 'u2l7-rule-write',
            title: 'قاعدة الكتابة',
            text: rich('من الكسر إلى العشري: نكتب الصفر والفاصلة ثم البسط في خانتين، ونكمّله بصفر إلى اليسار إذا كان من خانة واحدة (5/100 = 0.05 و3/100 = 0.03). ومن العشري إلى الكسر: الرقمان بعد الفاصلة هما البسط، والمقام 100.'),
          },
          {
            kind: 'note', id: 'u2l7-note-zero-left', tone: 'warning',
            text: rich('الصفر يُضاف إلى يسار البسط بعد الفاصلة لا إلى يمينه: 5/100 = 0.05، ولا يصح أن نكتب 0.50 لأن ذلك يعني خمسين جزءاً من مئة.'),
          },
          {
            kind: 'text', id: 'u2l7-text-facts',
            text: rich(`${p66IntroFacts.earth.text} ${p66IntroFacts.ant.text} — وهذان مثالان على أجزاء من مئة في الحياة اليومية.`),
          },
        ],
      },
      {
        id: 'u2l7-compare',
        purpose: 'record',
        title: 'المقارنة وترتيب الأعداد العشرية حتى الأجزاء من مئة',
        blocks: [
          {
            kind: 'rule', id: 'u2l7-rule-compare',
            title: 'قاعدة المقارنة',
            text: rich('نقارن العددين بعد توحيد عدد الخانات بعد الفاصلة: نكتب 0.7 في صورة 0.70 عند المقارنة بـ0.14. بعد التوحيد نقارن الأجزاء من مئة (البسطين)، أو نحوّل الطرفين إلى كسرين مقامهما 100.'),
          },
          {
            kind: 'steps', id: 'u2l7-steps-compare',
            title: 'خطوات المقارنة بين عددين عشريين',
            steps: [
              rich('① اكتب العددين بخانتين بعد الفاصلة (أضف صفراً إلى اليمين عند الحاجة، والقيمة لا تتغيّر).'),
              rich('② تجاهل الفاصلة مؤقتاً وقارن العددين الناتجين كأعداد طبيعية: الأكبر هو الأكبر.'),
              rich('③ أو حوّل إلى كسرين مقامهما 100 وقارن البسطين.'),
              rich('④ إذا تساوى الرقمان فالقيمتان متساويتان، ونكتب =.'),
              rich('⑤ تحقق بتحويل الطرفين إلى أجزاء من مئة مرة أخرى.'),
            ],
          },
          {
            kind: 'figure', id: 'u2l7-figure-line',
            title: 'خط الأعداد: الانتقال من 0.3 إلى 0.4',
            figure: <NumberLineFigure ticks={[{ label: '0.30' }, { label: '0.35' }, { label: '0.40' }]} marks={9} label="خط أعداد من 0.30 إلى 0.40 مقسّم إلى عشر خطوات متساوية، كل خطوة 0.01، والعدد 0.38 هو العلامة الثامنة" />,
            caption: rich('بين 0.3 و0.4 تسع علامات داخلية؛ كل خطوة تساوي 0.01، والعدد 0.38 مطبوع في الكتاب.'),
            labels: [
              rich('0.3 = 0.30 و0.4 = 0.40، وبينهما 0.31 إلى 0.39.'),
              rich('الخطوة الواحدة 0.01 أي جزء واحد من مئة.'),
            ],
          },
          {
            kind: 'table', id: 'u2l7-table-compare-68',
            title: 'مقارنات أمثلة ص 68',
            headers: ['المثال', 'المقارنة', 'لماذا؟'],
            rows: p68CompareExamples.map((item, index) => [
              rich(item.label),
              comparison(item.left, item.relation, item.right, `c${index}`),
              rich(index === 2 ? '0.3 = 0.30 و0.13 أقل من 0.30 لأن 13 < 30' : 'نقارن الرقمين بعد الفاصلة كأجزاء من مئة'),
            ]),
            caption: rich('العدد الذي يبدو «أطول» ليس بالضرورة الأكبر: 0.13 أصغر من 0.3 لأن 0.3 = 0.30.'),
          },
          {
            kind: 'table', id: 'u2l7-table-between',
            title: 'عدد بين حدّين (ص 69)',
            headers: ['المثال', 'الحدان', 'العدد المطبوع', 'التحقق'],
            rows: p69BetweenExamples.map((item, index) => [
              rich(`المثال ${index + 1}`),
              comparison(item.lower, '<', item.upper, `b${index}`),
              rich(item.printedAnswer),
              rich(`${item.lower} < ${item.printedAnswer} < ${item.upper}`),
            ]),
          },
          {
            kind: 'note', id: 'u2l7-note-between', tone: 'tip',
            text: rich('طريقة اختيار عدد بين حدّين: اكتب الحدين بالخانات نفسها (0.35 = 0.35 و0.49 = 0.49)، ثم اختر قيمة داخلية لا تساوي أيّاً من الحدين، مثل 0.38 أو 0.42.'),
          },
        ],
      },
      {
        id: 'u2l7-check',
        purpose: 'practice',
        title: 'تحقّق من فهمك (ص 66–69)',
        blocks: [
          {
            kind: 'table', id: 'u2l7-table-grids',
            title: 'التمرين 1 (ص 66) · اكتب الكسر ذا المقام 100',
            headers: ['الفرع', 'عدد الخلايا الملوّنة', 'الكسر', 'الكتابة العشرية'],
            rows: p66GridItems.map(item => [
              rich(item.label),
              rich(String(item.numerator)),
              <Frac key={`${item.id}-f`} n={item.numerator} d={100} />,
              rich(item.numerator === 100 ? '1' : decimalForHundredths(item.numerator)),
            ]),
          },
          {
            kind: 'table', id: 'u2l7-table-compare-66',
            title: 'التمرين 2 (ص 66) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة'],
            rows: p66ComparisonItems.map(item => [rich(item.label), comparison(item.left, item.relation, item.right, item.id)]),
            caption: rich('في الفرع (د) يكون 4/10 = 40/100؛ فالتوسيع بالعامل 10 لا يغيّر القيمة.'),
          },
          {
            kind: 'table', id: 'u2l7-table-check1',
            title: 'تحقّق من فهمك 1 (ص 68) · من «هل تعلم» إلى العشري',
            headers: ['الحقيقة', 'الكسر', 'الكتابة العشرية'],
            rows: p68CheckOne.map(item => [
              rich(item.label),
              <Frac key={`${item.id}-f`} n={item.numerator} d={100} />,
              rich(decimalForHundredths(item.numerator)),
            ]),
          },
          {
            kind: 'table', id: 'u2l7-table-check3',
            title: 'تحقّق من فهمك 3 (ص 68) · اكتب الكسر عشرياً ولفظياً',
            headers: ['الفرع', 'الكسر', 'العشري', 'اللفظ'],
            rows: p68CheckThree.map(item => [
              rich(item.label),
              <Frac key={`${item.id}-f`} n={item.numerator} d={100} />,
              rich(decimalForHundredths(item.numerator)),
              rich(verbalForHundredths(item.numerator)),
            ]),
          },
          {
            kind: 'table', id: 'u2l7-table-check-69',
            title: 'تحقّق من فهمك (ص 69) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة'],
            rows: p69CheckOne.map(item => [rich(item.label), comparison(item.left, item.relation, item.right, item.id)]),
            caption: rich('في الفرع (و): 0.70 = 0.7 لأن الصفر الأخير لا يغيّر القيمة.'),
          },
        ],
      },
      {
        id: 'u2l7-practice',
        purpose: 'practice',
        title: 'حلول تدريبات ص 70–71',
        blocks: [
          {
            kind: 'table', id: 'u2l7-table-rulers',
            title: 'تدرّب 1 و2 (ص 70) · قراءة المساطر',
            headers: ['الفرع', 'المجال', 'العدد المطبوع'],
            rows: [
              [rich('①'), rich(`من ${(p70RulerOne.from / 100).toFixed(2)} إلى ${(p70RulerOne.to / 100).toFixed(2)}`), rich((p70RulerOne.printed / 100).toFixed(2))],
              ...p70RulerTwo.map(item => [rich(item.label), rich(`من ${(item.from / 100).toFixed(2)} إلى ${(item.to / 100).toFixed(2)}`), rich((item.printed / 100).toFixed(2))]),
            ],
            caption: rich('كل مسطرة مقسّمة إلى تسع علامات داخلية بين طرفيها، فكل خطوة 0.01؛ أكمل بقية العلامات بالتتابع.'),
          },
          {
            kind: 'table', id: 'u2l7-table-table70',
            title: 'تدرّب 3 (ص 70) · أكمل التحويل في الجدول',
            headers: ['العمود', 'المطبوع', 'المطلوب'],
            rows: p70TableColumns.map((column, index) => [
              rich(`العمود ${index + 1}`),
              rich(column.printed === 'decimal' ? `عشري: ${column.value}` : `بسط على 100: ${column.value}`),
              rich(column.printed === 'decimal' ? `${column.numerator}/100` : decimalForHundredths(column.numerator)),
            ]),
          },
          {
            kind: 'table', id: 'u2l7-table-shade',
            title: 'تدرّب 5 (ص 71) · كم خلية نلوّن؟',
            headers: ['الشكل', 'العدد المطلوب', 'عدد الخلايا من 100'],
            rows: p71ShadeItems.map(item => [rich(item.label), rich(item.decimal), rich(String(item.cells))]),
            caption: rich('0.15 يعني خمس عشرة خلية، و0.05 خمس خلايا فقط — الصفر بعد الفاصلة يحفظ الخانة.'),
          },
          {
            kind: 'table', id: 'u2l7-table-compare-71',
            title: 'تدرّب 6 (ص 71) · ضع الرمز المناسب',
            headers: ['الفرع', 'المقارنة'],
            rows: p71ComparisonItems.map(item => [rich(item.label), comparison(item.left, item.relation, item.right, item.id)]),
            caption: rich('في الفرع (هـ): 0.3 = 0.30 أكبر من 0.03 (ثلاثة أجزاء من مئة).'),
          },
          {
            kind: 'table', id: 'u2l7-table-match',
            title: 'تدرّب 7 (ص 71) · طابق العدد بالكسر المساوي',
            headers: ['العدد العشري', 'الكسر بمقام 100'],
            rows: p71MatchDecimals.map(item => [rich(item.value), value(item.answer, item.id)]),
            caption: rich('0.5 = 50/100 و0.6 = 60/100؛ فالأعداد التي بخانة واحدة يمكن كتابتها بمقام 100 بإضافة صفر.'),
          },
          {
            kind: 'table', id: 'u2l7-table-between-71',
            title: 'تدرّب 8 (ص 71) · عدد بين حدّين',
            headers: ['الفرع', 'الحدان', 'مثال صالح'],
            rows: p71BetweenItems.map((item, index) => [
              rich(item.label),
              comparison(item.lower, '<', item.upper, `bt${index}`),
              rich(index === 0 ? '0.15 أو 0.16' : index === 1 ? '0.31 أو 0.35' : '0.85 أو 0.88'),
            ]),
            caption: rich('الإجابة ليست وحيدة؛ المهم أن يقع العدد داخل المجال المفتوح لا على حدّيه.'),
          },
          {
            kind: 'text', id: 'u2l7-text-ex4',
            text: rich(`تدرّب ④ (ص 71): ${p71Ex4.decimal} يساوي ${p71Ex4.fraction}؛ والصفر الأخير لا يغيّر القيمة لأنه في نهاية الجزء العشري.`),
          },
        ],
      },
      {
        id: 'u2l7-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l7-note-mistake-1', tone: 'warning',
            text: rich('① اعتبار 0.13 أكبر من 0.3 لأن 13 أكبر من 3: الصواب توحيد الخانات أولاً (0.3 = 0.30) ثم المقارنة.'),
          },
          {
            kind: 'note', id: 'u2l7-note-mistake-2', tone: 'warning',
            text: rich('② كتابة 5/100 في صورة 0.5: الصواب 0.05 لأن خانتي ما بعد الفاصلة هما اللتان تحملان أجزاء المئة.'),
          },
          {
            kind: 'note', id: 'u2l7-note-mistake-3', tone: 'warning',
            text: rich('③ الاعتقاد أن إضافة صفر إلى يمين الجزء العشري تغيّر القيمة: 0.7 = 0.70 = 0.700؛ الزيادة في الصور لا في القيمة.'),
          },
          {
            kind: 'note', id: 'u2l7-note-mistake-4', tone: 'tip',
            text: rich('للتحقق: حوال العدد العشري إلى كسر مقامه 100، ثم بسّطه إن أمكن. فـ 0.6 = 60/100 = 6/10 = 0.6 بالصور المتكافئة.'),
          },
        ],
      },
    ],
  }
}
