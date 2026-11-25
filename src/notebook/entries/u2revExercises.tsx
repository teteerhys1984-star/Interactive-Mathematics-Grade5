import { Chain, Cmp, Frac, MixedNum, rich } from '../figures'
import type { ReactNode } from 'react'
import type { NotebookDoc } from '../types'
import {
  findUnit2ExercisesElement,
  q10Data,
  q11Data,
  q1Data,
  q2Data,
  q3Data,
  q4Data,
  q5Data,
  q6Data,
  q7Data,
  q8Data,
  q9Data,
  q6Items,
  q7Groups,
  q8Groups,
  q9Items,
  q10Items,
  q5Sets,
  unit2ExercisesSourceBranches,
  valueLabel,
  valueOf,
  type MathVal,
} from '../../lessons/unit2ExercisesData'

/**
 * «دفتر الطالب» — الوحدة الثانية، درس المراجعة: تمرينات الوحدة الثانية (الكتاب ص 85–86).
 *
 * Source of truth: `src/lessons/unit2ExercisesData.ts`. The first sections are the unit's *skill map*:
 * the rules and procedures of the ten taught lessons gathered on one revision sheet. The rest are the
 * book's eleven exercises solved from the ledger's own branches (`prompt`, `steps`, `answer`, `check`,
 * `pitfall`) — nothing is retyped, fractions are printed stacked, and ordering steps come from the
 * ledger's generated `orderSteps`.
 */
const element = (id: string) => findUnit2ExercisesElement(id)
const sourceBranch = (id: string) => {
  const found = unit2ExercisesSourceBranches.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing unit-2 exercise branch: ${id}`)
  return found
}

/** Renders a printed value: an ordinary fraction, a mixed number, or a plain number. */
const mv = (value: MathVal, key: string): ReactNode => {
  if (value.kind === 'fraction') return <Frac key={key} n={value.n} d={value.d} />
  if (value.kind === 'mixed') return <MixedNum key={key} w={value.w} n={value.n} d={value.d} />
  return rich(valueLabel(value))
}

/** A comparison cell: the two printed sides with the ledger's own relation sign. */
const cmpCell = (left: MathVal, op: '<' | '>' | '=', right: MathVal, key: string): ReactNode => (
  <Cmp key={key} left={mv(left, `${key}-l`)} op={op} right={mv(right, `${key}-r`)} />
)

/** An ordering cell: the group's fractions in the requested direction. */
const chainCell = (items: MathVal[], ops: Array<'<' | '>'>, key: string): ReactNode => {
  const sorted = [...items].sort((left, right) => (ops[0] === '<' ? valueOf(left) - valueOf(right) : valueOf(right) - valueOf(left)))
  return <Chain key={key} parts={sorted.map((item, index) => mv(item, `${key}-${index}`))} ops={ops} />
}

export function unit2ExercisesNotebook(): NotebookDoc {
  return {
    lessonId: 'unit-2-exercises',
    lessonTitle: 'تمرينات الوحدة الثانية',
    unit: 'الوحدة الثانية',
    pages: 'ص 85–86',
    theme: 'lesson-unit2-exercises',
    sections: [
      {
        id: 'u2rev-map',
        purpose: 'record',
        title: 'خريطة الوحدة: المهارة وقاعدتها',
        blocks: [
          {
            kind: 'text', id: 'u2rev-text-intro',
            text: rich(`${element('u2-p85-intro').given} ${element('u2-p85-intro').rule}`),
          },
          {
            kind: 'table', id: 'u2rev-table-map',
            title: 'مهارات الوحدة الثانية في جدول واحد',
            headers: ['المهارة', 'القاعدة التي أستعملها', 'الدرس'],
            rows: [
              [rich('قراءة الأعداد حتى الملايين'), rich('أوزّع الأرقام على الخانات من الوحدات، وأقرأ من أعلى منزلة، وأضع صفراً في كل خانة فارغة'), rich('الأعداد حتى الملايين')],
              [rich('مقارنة عددين'), rich('عدد الخانات أولاً؛ وعند التساوي أبدأ من اليسار وأتوقف عند أول اختلاف'), rich('مقارنة الأعداد الطبيعية وترتيبها')],
              [rich('ترتيب أعداد'), rich('أقارنها ثم أكتبها بالاتجاه المطلوب وأفحص كل زوج متجاور'), rich('مقارنة الأعداد الطبيعية وترتيبها')],
              [rich('لغز العدد'), rich('أطبّق كل شرط على حدة، ثم أتحقق أن العدد يحقق الشرطين معاً وداخل المجال'), rich('مقارنة الأعداد الطبيعية وترتيبها')],
              [rich('المضاعف المشترك الأصغر'), rich('أكتب مضاعفات الأعداد وأختار أصغر عدد مشترك أكبر من الصفر'), rich('المضاعف المشترك الأصغر')],
              [rich('مقارنة كسرين'), rich('أوحّد المقامات بكسور مكافئة ثم أقارن البسطين'), rich('الكسور (1)')],
              [rich('مقارنة كسر بعدد عشري'), rich('أحوّل الطرفين إلى الصورة نفسها: الكسر إلى عشري، أو العشري إلى كسر'), rich('الكسور (1) والأجزاء العشرية')],
              [rich('ترتيب كسور'), rich('أوحّد المقامات ثم أرتب البسوط وليس المقامات'), rich('الكسور (1)')],
              [rich('من مركب إلى عادي'), rich('الصحيح × المقام + البسط، والناتج فوق المقام نفسه'), rich('الكسور (2)')],
              [rich('من عادي إلى مركب'), rich('أقسم البسط على المقام: الخارج صحيح والباقي بسط والمقام يبقى'), rich('الكسور (2)')],
              [rich('أطوال في شكل مركّب'), rich('أستعمل تساوي الأضلاع المتقابلة والتوازي، وأجمع أو أطرح على الاستقامة الواحدة'), rich('المستطيل والمربّع')],
            ],
            caption: rich('كل صف مهارة واحدة وقاعدة واحدة؛ هذا الجدول هو ما أراجعه قبل الاختبار.'),
          },
          {
            kind: 'steps', id: 'u2rev-steps-strategy',
            title: 'خطواتي قبل حل أي تمرين',
            steps: [
              rich('① أقرأ المطلوب أولاً: مقارنة؟ ترتيب؟ تحويل؟ حساب طول؟'),
              rich('② أحدّد الصور المعطاة: أعداد طبيعية، كسور، أعداد مركبة، أعداد عشرية، أو شكل هندسي.'),
              rich('③ أختار قاعدة التوحيد المناسبة: توحيد المقامات، أو توحيد عدد الخانات العشرية، أو استعمال خواص الشكل.'),
              rich('④ أحلّ، ثم أتحقق بخطوة عكسية: التحويل العكسي، أو القسمة، أو إعادة المقارنة.'),
              rich('⑤ أكتب الإجابة بالصورة التي يطلبها السؤال، لا بالصورة التي وصلت إليها فقط.'),
            ],
          },
          {
            kind: 'definition', id: 'u2rev-def-fraction-forms',
            term: 'الكسر العادي والكسر المركب',
            text: rich('الكسر العادي كسر بسطه ومقامه عددان طبيعيان، ويكون بسطه أصغر من مقامه إذا كان أقل من الواحد. والكسر المركب عدد صحيح يليه كسر عادي أصغر من الواحد، مثل 2 1/3، وهو صورة أخرى للكسر العادي نفسه.'),
            source: 'الكتاب · ص 85–86',
          },
          {
            kind: 'definition', id: 'u2rev-def-decimal-parts',
            term: 'الأجزاء العشرية',
            text: rich('الجزء من عشرة كسر مقامه 10، والجزء من مئة كسر مقامه 100، والجزء من ألف كسر مقامه 1000. وعدد الخانات بعد الفاصلة هو عدد أصفار المقام: خانة للأعشار، وخانتان للأجزاء من مئة، وثلاث للأجزاء من ألف.'),
            source: 'الكتاب · ص 85–86',
          },
          {
            kind: 'rule', id: 'u2rev-rule-lcm',
            title: 'تذكير: المضاعف المشترك الأصغر',
            text: rich(`${q5Data.concept} ${q5Data.when}`),
          },
          {
            kind: 'rule', id: 'u2rev-rule-compare',
            title: 'استراتيجيات المقارنة الأربع',
            text: rich(q6Data.strategies.map(strategy => `${strategy.title}: ${strategy.body}`).join(' ')),
          },
          {
            kind: 'rule', id: 'u2rev-rule-order',
            title: 'تذكير: الترتيب التصاعدي والتنازلي',
            text: rich(`${q7Data.concept} ${q8Data.concept}`),
          },
          {
            kind: 'rule', id: 'u2rev-rule-convert',
            title: 'تذكير: التحويل بين الكسرين العادي والمركب',
            text: rich(`${q9Data.concept} ${q10Data.concept}`),
          },
          {
            kind: 'rule', id: 'u2rev-rule-geometry',
            title: 'تذكير: خواص المستطيل والمربّع',
            text: rich(q11Data.concept),
          },
        ],
      },
      {
        id: 'u2rev-mistakes',
        purpose: 'record',
        title: 'أخطاء الوحدة التي أتذكّرها قبل الاختبار',
        blocks: [
          {
            kind: 'note', id: 'u2rev-note-m1', tone: 'warning',
            text: rich(`في جدول الخانات: ${q1Data.mistakes[0]!.wrong} الصواب: ${q1Data.mistakes[0]!.right}`),
          },
          {
            kind: 'note', id: 'u2rev-note-m2', tone: 'warning',
            text: rich(`في المقارنة: ${q3Data.mistakes[0]!.wrong} الصواب: ${q3Data.mistakes[0]!.right}`),
          },
          {
            kind: 'note', id: 'u2rev-note-m3', tone: 'warning',
            text: rich(`في لغز العدد: ${q4Data.mistakes[1]!.wrong} الصواب: ${q4Data.mistakes[1]!.right}`),
          },
          {
            kind: 'note', id: 'u2rev-note-m4', tone: 'warning',
            text: rich(`في ترتيب الكسور: ${q7Data.mistakes[0]!.wrong} الصواب: ${q7Data.mistakes[0]!.right}`),
          },
          {
            kind: 'note', id: 'u2rev-note-m5', tone: 'warning',
            text: rich(`في التحويل إلى كسر عادي: ${q9Data.mistakes[0]!.wrong} الصواب: ${q9Data.mistakes[0]!.right}`),
          },
          {
            kind: 'note', id: 'u2rev-note-m6', tone: 'tip',
            text: rich('قبل تسليم أي إجابة: أعد قراءة الصورة المطلوبة (كسر؟ عشري؟ مركب؟)، وتحقّق بخطوة عكسية، وأعد مقارنة الطرفين بعد التوحيد.'),
          },
        ],
      },
      {
        id: 'u2rev-q1toq4',
        purpose: 'practice',
        title: 'حلول التمرينات ① إلى ④',
        blocks: [
          {
            kind: 'example', id: 'u2rev-ex-q1',
            title: 'التمرين ① · جدول الخانات والصيغة اللفظية',
            question: rich(element('u2-p85-q1').prompt),
            solution: [...q1Data.worked.steps],
            answer: rich(element('u2-p85-q1').answer),
            verification: rich(element('u2-p85-q1').check),
          },
          {
            kind: 'example', id: 'u2rev-ex-q2',
            title: 'التمرين ② · أي البنائين كلفة إصلاحه أقل؟',
            question: rich(element('u2-p85-q2').prompt),
            solution: [...q2Data.worked.steps],
            answer: rich(element('u2-p85-q2').answer),
            verification: rich(element('u2-p85-q2').check),
          },
          {
            kind: 'example', id: 'u2rev-ex-q3',
            title: 'التمرين ③ · ترتيب العينات تصاعدياً',
            question: rich(element('u2-p85-q3').prompt),
            solution: [...q3Data.worked.steps],
            answer: rich(element('u2-p85-q3').answer),
            verification: rich(element('u2-p85-q3').check),
          },
          {
            kind: 'example', id: 'u2rev-ex-q4',
            title: 'التمرين ④ · لغز العدد',
            question: rich(element('u2-p85-q4').prompt),
            solution: [...q4Data.worked.steps],
            answer: rich(element('u2-p85-q4').answer),
            verification: rich(element('u2-p85-q4').check),
          },
        ],
      },
      {
        id: 'u2rev-q5',
        purpose: 'practice',
        title: 'التمرين ⑤ · المضاعف المشترك الأصغر (تسعة فروع)',
        blocks: [
          {
            kind: 'table', id: 'u2rev-table-q5',
            title: 'جد المضاعف المشترك الأصغر',
            headers: ['الفرع', 'الأعداد', 'الإجابة'],
            rows: q5Sets.map(set => [
              rich(set.label),
              rich(set.numbers.join(' و ')),
              rich(sourceBranch(set.id).answer),
            ]),
            caption: rich(`${element('u2-p85-q5').check} ${element('u2-p85-q5').pitfall ?? ''}`),
          },
          {
            kind: 'example', id: 'u2rev-ex-q5-b',
            title: 'الفرع (ب) بالتفصيل: 6 و 5 و 8',
            question: rich(sourceBranch('u2-p85-q5-b').prompt),
            solution: [...sourceBranch('u2-p85-q5-b').steps],
            answer: rich(sourceBranch('u2-p85-q5-b').answer),
            verification: rich(`${sourceBranch('u2-p85-q5-b').check} ${sourceBranch('u2-p85-q5-b').why}`),
          },
          {
            kind: 'example', id: 'u2rev-ex-q5-h',
            title: 'الفرع (ح) بالتفصيل: الأعداد الثلاثة الكبيرة',
            question: rich(sourceBranch('u2-p85-q5-h').prompt),
            solution: [...sourceBranch('u2-p85-q5-h').steps],
            answer: rich(sourceBranch('u2-p85-q5-h').answer),
            verification: rich(sourceBranch('u2-p85-q5-h').check),
          },
          {
            kind: 'note', id: 'u2rev-note-q5', tone: 'warning',
            text: rich(q5Data.mistakes[0]!.wrong),
          },
        ],
      },
      {
        id: 'u2rev-q6',
        purpose: 'practice',
        title: 'التمرين ⑥ · رموز المقارنة (تسعة فروع)',
        blocks: [
          {
            kind: 'table', id: 'u2rev-table-q6',
            title: 'ضع الرمز المناسب في كل مقارنة',
            headers: ['الفرع', 'المقارنة', 'الرمز'],
            rows: q6Items.map(item => [
              rich(item.label),
              cmpCell(item.left, item.answer, item.right, item.id),
              rich(item.answer),
            ]),
            caption: rich(element('u2-p85-q6').pitfall ?? ''),
          },
          {
            kind: 'example', id: 'u2rev-ex-q6-a',
            title: 'الفرع (أ) بالتفصيل: كسران بمقامين مختلفين',
            question: rich(sourceBranch('u2-p85-q6-a').prompt),
            solution: [...sourceBranch('u2-p85-q6-a').steps],
            answer: rich(sourceBranch('u2-p85-q6-a').answer),
            verification: rich(sourceBranch('u2-p85-q6-a').why),
          },
          {
            kind: 'example', id: 'u2rev-ex-q6-b',
            title: 'الفرع (ب) بالتفصيل: كسر مع عدد عشري',
            question: rich(sourceBranch('u2-p85-q6-b').prompt),
            solution: [...sourceBranch('u2-p85-q6-b').steps],
            answer: rich(sourceBranch('u2-p85-q6-b').answer),
            verification: rich(sourceBranch('u2-p85-q6-b').why),
          },
        ],
      },
      {
        id: 'u2rev-q7q8',
        purpose: 'practice',
        title: 'التمرينان ⑦ و⑧ · ترتيب الكسور',
        blocks: [
          {
            kind: 'table', id: 'u2rev-table-q7',
            title: '⑦ ترتيب تصاعدي (من الأصغر إلى الأكبر)',
            headers: ['الفرع', 'المقام المشترك', 'الترتيب'],
            rows: q7Groups.map(group => [
              rich(group.label),
              rich(String(group.commonDenominator)),
              chainCell([...group.items], ['<', '<', '<'], group.id),
            ]),
            caption: rich(`${element('u2-p86-q7').rule} ${element('u2-p86-q7').pitfall ?? ''}`),
          },
          {
            kind: 'example', id: 'u2rev-ex-q7-b',
            title: 'الفرع ⑦(ب) بالتفصيل',
            question: rich(sourceBranch('u2-p86-q7-b').prompt),
            solution: [...sourceBranch('u2-p86-q7-b').steps],
            answer: rich(sourceBranch('u2-p86-q7-b').answer),
            verification: rich(sourceBranch('u2-p86-q7-b').check),
          },
          {
            kind: 'table', id: 'u2rev-table-q8',
            title: '⑧ ترتيب تنازلي (من الأكبر إلى الأصغر)',
            headers: ['الفرع', 'المقام المشترك', 'الترتيب'],
            rows: q8Groups.map(group => [
              rich(group.label),
              rich(String(group.commonDenominator)),
              chainCell([...group.items], ['>', '>', '>'], group.id),
            ]),
            caption: rich(`${element('u2-p86-q8').rule} ${element('u2-p86-q8').pitfall ?? ''}`),
          },
          {
            kind: 'example', id: 'u2rev-ex-q8-c',
            title: 'الفرع ⑧(ج) بالتفصيل',
            question: rich(sourceBranch('u2-p86-q8-c').prompt),
            solution: [...sourceBranch('u2-p86-q8-c').steps],
            answer: rich(sourceBranch('u2-p86-q8-c').answer),
            verification: rich(sourceBranch('u2-p86-q8-c').check),
          },
          {
            kind: 'note', id: 'u2rev-note-order', tone: 'tip',
            text: rich('الترتيب التصاعدي والتنازلي يستعملان الخطوات نفسها؛ الاتجاه وحده يتغيّر. لذلك أوحّد المقامات أولاً ثم أقرر الاتجاه.'),
          },
        ],
      },
      {
        id: 'u2rev-q9q10',
        purpose: 'practice',
        title: 'التمرينان ⑨ و⑩ · التحويل بين الكسرين',
        blocks: [
          {
            kind: 'table', id: 'u2rev-table-q9',
            title: '⑨ من الكسر المركب إلى الكسر العادي',
            headers: ['الفرع', 'المطبوع', 'الخطوة', 'الكسر العادي'],
            rows: q9Items.map(item => [
              rich(item.label),
              <MixedNum key={`${item.id}-m`} w={item.w} n={item.n} d={item.d} />,
              rich(`${item.w} × ${item.d} + ${item.n} = ${item.w * item.d + item.n}`),
              <Frac key={`${item.id}-f`} n={item.w * item.d + item.n} d={item.d} />,
            ]),
            caption: rich(element('u2-p86-q9').pitfall ?? ''),
          },
          {
            kind: 'table', id: 'u2rev-table-q10',
            title: '⑩ من الكسر العادي إلى الكسر المركب',
            headers: ['الفرع', 'الكسر', 'القسمة', 'المركب'],
            rows: q10Items.map(item => [
              rich(item.label),
              <Frac key={`${item.id}-f`} n={item.n} d={item.d} />,
              rich(`${item.n} ÷ ${item.d} = ${Math.floor(item.n / item.d)} والباقي ${item.n % item.d}`),
              <MixedNum key={`${item.id}-m`} w={Math.floor(item.n / item.d)} n={item.n % item.d} d={item.d} />,
            ]),
            caption: rich(element('u2-p86-q10').pitfall ?? ''),
          },
          {
            kind: 'example', id: 'u2rev-ex-q10-d',
            title: 'الفرع ⑩(د) بالتفصيل: التبسيط بعد التحويل',
            question: rich(sourceBranch('u2-p86-q10-d').prompt),
            solution: [...sourceBranch('u2-p86-q10-d').steps],
            answer: rich(sourceBranch('u2-p86-q10-d').answer),
            verification: rich(sourceBranch('u2-p86-q10-d').check),
          },
          {
            kind: 'note', id: 'u2rev-note-convert', tone: 'warning',
            text: rich('في الاتجاهين المقام لا يتغيّر: عند التحويل إلى مركب يبقى المقام الأصلي، وعند التحويل إلى عادي يبقى المقام نفسه أيضاً.'),
          },
        ],
      },
      {
        id: 'u2rev-q11',
        purpose: 'practice',
        title: 'التمرين ⑪ · المستطيل والمربّع: أطوال في شكل مركّب',
        blocks: [
          {
            kind: 'example', id: 'u2rev-ex-q11',
            title: 'التمرين ⑪ كاملاً',
            question: rich(element('u2-p86-q11').prompt),
            solution: [...element('u2-p86-q11').steps],
            answer: rich(element('u2-p86-q11').answer),
            verification: rich(element('u2-p86-q11').check),
          },
          {
            kind: 'table', id: 'u2rev-table-q11',
            title: 'الطول المطلوب واستدلاله',
            headers: ['المطلوب', 'الاستدلال', 'الطول'],
            rows: [
              [rich('القطعة DG'), rich('DC + CG، والنقطة C بين D و G على استقامة واحدة'), rich('10 سم')],
              [rich('القطعة AB'), rich('يقابل DC في المستطيل، والضلعان المتقابلان متساويان'), rich('8 سم')],
              [rich('القطعة CB'), rich('CE + EB، و CE ضلع في المربّع يساوي 2 سم'), rich('5 سم')],
            ],
            caption: rich(q11Data.mistakes.map(mistake => `${mistake.wrong} الصواب: ${mistake.right}`).join(' ')),
          },
          {
            kind: 'note', id: 'u2rev-note-q11', tone: 'tip',
            text: rich(`${q11Data.why} في الشكل المركّب لا أقيس بالمسطرة، بل أستنتج كل طول من خواص الشكل المعطاة.`),
          },
        ],
      },
      {
        id: 'u2rev-checklist',
        purpose: 'record',
        title: 'قائمة تحقق قبل اختبار الوحدة',
        blocks: [
          {
            kind: 'steps', id: 'u2rev-steps-checklist',
            title: 'أسئلة أسألها لنفسي',
            steps: [
              rich('هل أستطيع قراءة عدد حتى سبع خانات وكتابته بالصيغة اللفظية دون أن تُزاح منازله؟'),
              rich('هل أقارن عددين بالقاعدتين (عدد الخانات ثم أول اختلاف) دون النظر إلى الرقم الأول فقط؟'),
              rich('هل أستطيع إيجاد م.م.أ لثلاثة أعداد والتحقق منه بالقسمة؟'),
              rich('هل أوحّد المقامات قبل مقارنة كسرين أو ترتيبهما؟'),
              rich('هل أفرّق بين الكسر العادي والمركب وأحوّل في الاتجاهين دون تغيير المقام؟'),
              rich('هل أكتب عدداً عشرياً حتى ثلاثة أرقام بعد الفاصلة، وأقارن بعد توحيد الخانات؟'),
              rich('هل أستعمل خواص المستطيل والمربّع لحساب أطوال بدل القياس؟'),
            ],
          },
          {
            kind: 'text', id: 'u2rev-text-closing',
            text: rich(element('u2-p85-intro').answer),
          },
          {
            kind: 'table', id: 'u2rev-table-forms',
            title: 'التحويلات الأربعة التي يجب ألا أنساها',
            headers: ['من', 'إلى', 'القاعدة', 'مثال'],
            rows: [
              [rich('كسر عادي'), rich('كسر مركب'), rich('البسط ÷ المقام: الخارج صحيح والباقي بسط'), <Cmp key="forms-a" left={<Frac key="fa" n={20} d={7} />} op="=" right={<MixedNum key="fb" w={2} n={6} d={7} />} />],
              [rich('كسر مركب'), rich('كسر عادي'), rich('الصحيح × المقام + البسط فوق المقام'), <Cmp key="forms-b" left={<MixedNum key="fc" w={15} n={1} d={6} />} op="=" right={<Frac key="fd" n={91} d={6} />} />],
              [rich('كسر مقامه 100'), rich('عدد عشري'), rich('البسط يُكتب في خانتين بعد الفاصلة'), rich('0.14 = 14/100')],
              [rich('عدد عشري'), rich('كسر مقامه 1000'), rich('الأرقام الثلاثة بعد الفاصلة هي البسط'), rich('0.213 = 213/1000')],
            ],
          },
        ],
      },
    ],
  }
}
