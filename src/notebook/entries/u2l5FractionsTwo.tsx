import type { ReactNode } from 'react'
import { Frac, MixedNum, rich } from '../figures'
import type { NotebookDoc } from '../types'
import {
  cakeShare,
  checkToImproperItems,
  checkToMixedItems,
  classifyItems,
  divideWithRemainder,
  exerciseThreeItems,
  exerciseTwoItems,
  reducedEquivalents,
  samirClaim,
  toImproper,
  toMixed,
  type BookItem,
  type MixedNumber,
} from '../../lessons/fractionsTwoData'

/**
 * «دفتر الطالب» — الوحدة الثانية، الدرس 5: الكسور (2) (الكتاب ص 58–61).
 *
 * Source of truth: `src/lessons/fractionsTwoData.ts`. The two definitions and the three rules that
 * compare a fraction with 1 are the book's (ص 58–59). Every drill answer is derived here with the
 * lesson's own integer helpers (`toMixed`, `toImproper`, `divideWithRemainder`) instead of being
 * retyped, and the reduced forms come from the lesson's `reducedEquivalents` map, so the notebook
 * cannot disagree with the lesson or with the mark scheme.
 */
const stored = (value: MixedNumber): string => `${value.whole} ${value.numerator}/${value.denominator}`

/** The Arabic name of a classification the ledger stores in English, so no English reaches the sheet. */
const classifyName = (expected: string): string =>
  expected === 'ordinary' ? 'كسر عادي' : expected === 'mixed' ? 'كسر مركب' : 'لا يحسمه النص المطبوع'

/** A printed item of the book: the fraction exactly as printed, and its answer as printed. */
const row = (item: BookItem, answer: (item: BookItem) => string): ReactNode[] => [
  rich(item.label),
  rich(item.printed),
  rich(answer(item)),
]

/** A drill of «تدرّب 2» (عادي ← مركب), showing the division that produces the mixed number. */
const toMixedRow = (item: BookItem): ReactNode[] => {
  const printed = item.printed.split('/').map(part => Number(part.trim()))
  const { quotient, remainder } = divideWithRemainder(printed[0]!, printed[1]!)
  const reduced = reducedEquivalents[item.id]
  return [
    rich(item.label),
    <Frac key={`${item.id}-p`} n={printed[0]} d={printed[1]} />,
    rich(`${printed[0]} ÷ ${printed[1]} = ${quotient} والباقي ${remainder}`),
    <MixedNum key={`${item.id}-a`} w={quotient} n={remainder} d={printed[1]} />,
    reduced
      ? <MixedNum key={`${item.id}-r`} w={Number(reduced.split(' ')[0])} n={Number(reduced.split(' ')[1]!.split('/')[0])} d={Number(reduced.split(' ')[1]!.split('/')[1])} />
      : rich('لا تبسيط'),
  ]
}

/** A drill of «تدرّب 3» (مركب ← عادي), computed from the printed mixed number. */
const toImproperRow = (item: BookItem): ReactNode[] => {
  const [whole, fraction] = item.printed.split(' ')
  const [numerator, denominator] = fraction!.split('/').map(part => Number(part.trim()))
  const result = toImproper({ whole: Number(whole), numerator: numerator!, denominator: denominator! })
  return [
    rich(item.label),
    <MixedNum key={`${item.id}-p`} w={whole!} n={numerator!} d={denominator!} />,
    rich(`${whole} × ${denominator} + ${numerator} = ${result.numerator}`),
    <Frac key={`${item.id}-a`} n={result.numerator} d={result.denominator} />,
  ]
}

export function fractionsTwoNotebook(): NotebookDoc {
  return {
    lessonId: 'fractions-two',
    lessonTitle: 'الكسور (2)',
    unit: 'الوحدة الثانية',
    pages: 'ص 58–61',
    theme: 'l25-lesson',
    sections: [
      {
        id: 'u2l5-terms',
        purpose: 'record',
        title: 'الكسر العادي والكسر المركب',
        blocks: [
          {
            kind: 'definition', id: 'u2l5-def-ordinary',
            term: 'الكسر العادي',
            text: rich('الكسر الذي يُكتب على صورة بسط فوق مقام يُسمّى كسراً عادياً؛ فالبسط هو العدد الأعلى والمقام هو العدد الأسفل. وقد يكون البسط أصغر من المقام أو مساوياً له أو أكبر منه، فالكسر العادي ليس شرطاً أن يكون أصغر من 1.'),
            source: 'الكتاب · ص 58–59',
          },
          {
            kind: 'definition', id: 'u2l5-def-mixed',
            term: 'الكسر المركب',
            text: rich('الكسر المركب عدد صحيح يليه كسر عادي أصغر من الواحد، مثل 3 و1/2 (ثلاثة ونصف). ويُقرأ: ثلاثة صحيحة ونصف. المقام في الجزء الكسري يبقى كما هو ولا يتغيّر عند التحويل.'),
            source: 'الكتاب · ص 59',
          },
          {
            kind: 'rule', id: 'u2l5-rule-vs-one',
            title: 'قارن البسط بالمقام تعرف موقع الكسر من الواحد',
            text: rich('إذا كان البسط أصغر من المقام فالكسر أصغر من 1؛ وإذا كان البسط مساوياً للمقام فالكسر = 1؛ وإذا كان البسط أكبر من المقام فالكسر أكبر من 1.'),
          },
          {
            kind: 'table', id: 'u2l5-table-vs-one',
            title: 'جدول المقارنة بالواحد (أكتبه بيدي)',
            headers: ['الكسر', 'البسط مقابل المقام', 'النتيجة بالنسبة إلى 1', 'هل هو مركب؟'],
            rows: [
              [<Frac key="a" n="3" d="4" />, rich('3 < 4'), rich('أصغر من 1'), rich('لا، عادي')],
              [<Frac key="b" n="4" d="4" />, rich('4 = 4'), rich('يساوي 1'), rich('لا، عادي')],
              [<Frac key="c" n="7" d="4" />, rich('7 > 4'), rich('أكبر من 1'), rich(`يمكن كتابته 1 و3/4: ${stored(toMixed({ numerator: 7, denominator: 4 }))}`)],
              [<Frac key="d" n="13" d="13" />, rich('13 = 13'), rich('يساوي 1'), rich('لا، عادي')],
              [<Frac key="e" n="9" d="8" />, rich('9 > 8'), rich('أكبر من 1'), rich(`يمكن كتابته ${stored(toMixed({ numerator: 9, denominator: 8 }))}`)],
            ],
            caption: rich('الكسر المركب لا يكون إلا حين يزيد البسط على المقام، أي حين يكون الكسر أكبر من 1.'),
          },
          {
            kind: 'note', id: 'u2l5-note-classify', tone: 'tip',
            text: rich('كيف أميّز بسرعة؟ إذا كان قبل الكسر عدد صحيح فهو مركب؛ وإذا لم يكن قبله عدد صحيح فهو عادي، سواء كان أصغر من 1 أو أكبر منه أو مساوياً له.'),
          },
        ],
      },
      {
        id: 'u2l5-to-mixed',
        purpose: 'record',
        title: 'من كسر عادي إلى كسر مركب (القسمة مع الباقي)',
        blocks: [
          {
            kind: 'rule', id: 'u2l5-rule-to-mixed',
            title: 'القاعدة',
            text: rich('نقسم البسط على المقام: خارج القسمة هو العدد الصحيح، والباقي يصبح البسط الجديد، والمقام يبقى كما هو. فمثلاً 9 ÷ 4 = 2 والباقي 1، لذلك 9/4 = 2 و1/4.'),
          },
          {
            kind: 'steps', id: 'u2l5-steps-to-mixed',
            title: 'خطوات التحويل من عادي إلى مركب',
            steps: [
              rich('① تأكد أولاً أن البسط أكبر من المقام؛ فإن كان أصغر فالكسر أصغر من 1 ولا يُكتب مركباً.'),
              rich('② اقسم البسط على المقام قسمة تامة: أكتب خارج القسمة والباقي.'),
              rich('③ العدد الصحيح في الكسر المركب هو خارج القسمة.'),
              rich('④ البسط الجديد هو الباقي، والمقام يبقى المقام الأصلي دون تغيير.'),
              rich('⑤ تحقق بالعكس: العدد الصحيح × المقام + الباقي = البسط الأصلي.'),
            ],
          },
          {
            kind: 'example', id: 'u2l5-ex-nine-quarters',
            title: <span>مثال الكتاب (ص 59): من <Frac n="9" d="4" /> إلى <MixedNum w="2" n="1" d="4" /></span>,
            question: rich('اكتب الكسر 9/4 على شكل كسر مركب.'),
            solution: [
              rich('البسط 9 أكبر من المقام 4، لذلك الكسر أكبر من 1 ويمكن كتابته مركباً.'),
              rich('نقسم: 9 ÷ 4 = 2 والباقي 1.'),
              rich('العدد الصحيح 2، والباقي 1 هو البسط الجديد، والمقام 4 يبقى كما هو.'),
              rich('كتابة القسمة: 9 = 4 × 2 + 1.'),
            ],
            answer: <MixedNum w="2" n="1" d="4" />,
            verification: rich('2 × 4 + 1 = 9 ✓ فالمقام لم يتغيّر والبسط الأصلي استُعيد.'),
          },
          {
            kind: 'note', id: 'u2l5-note-denominator', tone: 'warning',
            text: rich('لا نكتب الباقي على مقام جديد: المقام هو حجم القطعة ولا يتغيّر بالقسمة. فـ 11/4 = 2 و3/4 لأن 11 = 4 × 2 + 3، وليس 2 و3/1 أو 2 و3/11.'),
          },
        ],
      },
      {
        id: 'u2l5-to-improper',
        purpose: 'record',
        title: 'من كسر مركب إلى كسر عادي (الضرب والجمع)',
        blocks: [
          {
            kind: 'rule', id: 'u2l5-rule-to-improper',
            title: 'القاعدة',
            text: rich('نحوّل العدد الصحيح إلى أجزاء من المقام نفسه: العدد الصحيح × المقام + البسط، والناتج يوضع فوق المقام نفسه. فمثلاً 2 و1/4 = (2 × 4 + 1) ÷ 4 = 9/4.'),
          },
          {
            kind: 'steps', id: 'u2l5-steps-to-improper',
            title: 'خطوات التحويل من مركب إلى عادي',
            steps: [
              rich('① اضرب العدد الصحيح في المقام — كل وحدة صحيحة تساوي مقاماً كاملاً من الأجزاء.'),
              rich('② أضف البسط إلى ناتج الضرب.'),
              rich('③ ضع الناتج فوق المقام نفسه؛ لا تغيّر المقام.'),
              rich('④ تحقق بالقسمة: اقسم البسط الجديد على المقام، يجب أن تحصل على العدد الصحيح والباقي الأصليين.'),
            ],
          },
          {
            kind: 'example', id: 'u2l5-ex-two-quarters',
            title: <span>مثال الكتاب (ص 60): من <MixedNum w="2" n="1" d="4" /> إلى <Frac n="9" d="4" /></span>,
            question: <span>اكتب الكسر المركب <MixedNum w="2" n="1" d="4" /> على شكل كسر عادي.</span>,
            solution: [
              rich('نحوّل الوحدتين إلى أرباع: 2 × 4 = 8، أي 8/4.'),
              rich('نضيف الجزء الكسري: 8/4 + 1/4 = 9/4.'),
              rich('أو مباشرة بالقاعدة: (2 × 4 + 1) ÷ 4 = 9/4.'),
            ],
            answer: <Frac n="9" d="4" />,
            verification: rich('9 ÷ 4 = 2 والباقي 1، فنعود إلى 2 و1/4 ✓.'),
          },
          {
            kind: 'note', id: 'u2l5-note-multiply-whole', tone: 'warning',
            text: rich('أضرب العدد الصحيح في المقام لا في البسط: العدد الصحيح يمثّل وحدات كاملة، وكل وحدة تساوي مقاماً من الأجزاء.'),
          },
          {
            kind: 'table', id: 'u2l5-table-both-ways',
            title: 'التحويل في الاتجاهين: جدول مرجعي',
            headers: ['الاتجاه', 'العملية', 'مثال', 'التحقق'],
            rows: [
              [rich('عادي ← مركب'), rich('البسط ÷ المقام: خارج القسمة صحيح والباقي بسط'), <span key="a"><Frac n="11" d="4" /> = <MixedNum w="2" n="3" d="4" /></span>, rich('2 × 4 + 3 = 11')],
              [rich('مركب ← عادي'), rich('الصحيح × المقام + البسط، فوق المقام'), <span key="b"><MixedNum w="3" n="2" d="5" /> = <Frac n="17" d="5" /></span>, rich('17 ÷ 5 = 3 والباقي 2')],
            ],
            caption: rich('المقام ثابت في الاتجاهين؛ الذي يتغيّر هو البسط أو العدد الصحيح.'),
          },
        ],
      },
      {
        id: 'u2l5-examples',
        purpose: 'practice',
        title: 'حلول ص 58–59: المقارنة والتصنيف',
        blocks: [
          {
            kind: 'table', id: 'u2l5-table-compare-58',
            title: 'النشاط 1 و2 (ص 58) · أكمل بالرمز المناسب',
            headers: ['الكسر', 'البسط مقابل المقام', 'الرمز بالنسبة إلى 1'],
            rows: [
              [<Frac key="a" n="7" d="4" />, rich('7 > 4'), rich('>')],
              [<Frac key="b" n="4" d="4" />, rich('4 = 4'), rich('=')],
              [<Frac key="c" n="3" d="4" />, rich('3 < 4'), rich('<')],
            ],
            caption: rich('القالب الأول كامل (يساوي 1)، والثاني أقل من قالب، والثالث أكثر من قالب واحد؛ و1 و3/4 = 7/4 تمثّل الكمية نفسها.'),
          },
          {
            kind: 'table', id: 'u2l5-table-classify-60',
            title: 'التدريب 1 (ص 60) · عادي أم مركب؟',
            headers: ['الفرع', 'المطبوع', 'التصنيف'],
            rows: classifyItems.map(item => row(item, candidate => classifyName(candidate.expected))),
            caption: rich('العلامة الفاصلة: وجود عدد صحيح قبل الكسر هو ما يجعل الكسر مركباً.'),
          },
          {
            kind: 'table', id: 'u2l5-table-to-mixed-60',
            title: 'تحقّق من فهمك (ص 60) · عادي ← مركب',
            headers: ['الفرع', 'الكسر المطبوع', 'المركب'],
            rows: checkToMixedItems.map(item => row(item, candidate => candidate.expected)),
          },
          {
            kind: 'table', id: 'u2l5-table-to-improper-60',
            title: 'تحقّق من فهمك (ص 60) · مركب ← عادي',
            headers: ['الفرع', 'المركب المطبوع', 'الكسر العادي'],
            rows: checkToImproperItems.map(item => row(item, candidate => candidate.expected)),
          },
        ],
      },
      {
        id: 'u2l5-practice',
        purpose: 'practice',
        title: 'حلول تدريبات ص 61 مع خطوات القسمة',
        blocks: [
          {
            kind: 'table', id: 'u2l5-table-ex2',
            title: 'التدريب 2 (ص 61) · اكتب كل كسر عادي بشكل مركب',
            headers: ['الفرع', 'الكسر', 'القسمة', 'المركب', 'أبسط صورة'],
            rows: exerciseTwoItems.map(item => toMixedRow(item)),
            caption: rich('قد يُكتب الناتج في أبسط صورة إذا أمكن: فـ 6/4 = 1 و2/4 = 1 و1/2، والقيمتان متساويتان.'),
          },
          {
            kind: 'table', id: 'u2l5-table-ex3',
            title: 'التدريب 3 (ص 61) · اكتب كل كسر مركب بشكل عادي',
            headers: ['الفرع', 'المركب', 'الصحيح × المقام + البسط', 'الكسر العادي'],
            rows: exerciseThreeItems.map(item => toImproperRow(item)),
          },
          {
            kind: 'example', id: 'u2l5-ex-samir',
            title: 'التدريب 4 (ص 61) · هل ادّعاء سامر صحيح؟',
            question: <span>قال سامر إن درجته <MixedNum w={samirClaim.mixed.whole} n={samirClaim.mixed.numerator} d={samirClaim.mixed.denominator} />، وقالت المدرّسة إنها <Frac n={samirClaim.improper.numerator} d={samirClaim.improper.denominator} />. هل ادّعاء سامر صحيح؟</span>,
            solution: [
              rich(`نحوّل الكسر المركب إلى عادي: ${samirClaim.mixed.whole} × ${samirClaim.mixed.denominator} + ${samirClaim.mixed.numerator} = ${samirClaim.mixed.whole * samirClaim.mixed.denominator + samirClaim.mixed.numerator}.`),
              rich(`إذن ${stored(samirClaim.mixed)} = ${samirClaim.improper.numerator}/${samirClaim.improper.denominator}.`),
              rich('القيمتان متساويتان، فالادّعاء صحيح؛ الاختلاف في الصورة لا في القيمة.'),
            ],
            answer: rich(`نعم صحيح: ${samirClaim.improper.numerator}/${samirClaim.improper.denominator} = ${stored(samirClaim.mixed)}.`),
            verification: rich(`${samirClaim.improper.numerator} ÷ ${samirClaim.improper.denominator} = ${samirClaim.mixed.whole} والباقي ${samirClaim.mixed.numerator} ✓`),
          },
          {
            kind: 'example', id: 'u2l5-ex-cake',
            title: 'التدريب 5 (ص 61) · توزيع قالب الحلوى',
            question: rich(`قالب حلوى مقسّم إلى ${cakeShare.pieces} قطع، تريد أمّ توزيعه على أولادها الثلاثة بالتساوي. كم ينال كل ولد؟`),
            solution: [
              rich(`نقسم ${cakeShare.pieces} قطع على ${cakeShare.children} أولاد: ${cakeShare.pieces} ÷ ${cakeShare.children} = 2 والباقي 2.`),
              rich('إذن ينال كل ولد قطعتين كاملتين، والباقي قطعتان توزّعان على ثلاثة، أي 2/3 من قطعة.'),
              rich(`الناتج مركّباً 2 و2/3، وعادياً ${cakeShare.pieces}/3.`),
            ],
            answer: <MixedNum w="2" n="2" d="3" />,
            verification: rich('3 × 2 + 2 = 8، وهو عدد القطع الأصلي ✓.'),
          },
          {
            kind: 'note', id: 'u2l5-note-both-forms', tone: 'tip',
            text: rich('في المسائل الحياتية يُفضَّل الكسر المركب لأنه يخبرك مباشرة بعدد الوحدات الكاملة والجزء الزائد؛ أما في الحساب فيُفضَّل الكسر العادي لأنه يوحّد الصورة.'),
          },
        ],
      },
      {
        id: 'u2l5-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة أتجنّبها',
        blocks: [
          {
            kind: 'note', id: 'u2l5-note-mistake-1', tone: 'warning',
            text: rich('① نسيان البسط عند التحويل إلى عادي: 2 و1/3 ليست 6/3 بل 7/3 لأن 6 + 1 = 7.'),
          },
          {
            kind: 'note', id: 'u2l5-note-mistake-2', tone: 'warning',
            text: rich('② ضرب العدد الصحيح في البسط بدل المقام: المضروب في الصحيح هو المقام لأنه عدد الأجزاء في الوحدة.'),
          },
          {
            kind: 'note', id: 'u2l5-note-mistake-3', tone: 'warning',
            text: rich('③ تغيير المقام عند التحويل إلى مركب: الباقي يوضع فوق المقام الأصلي نفسه، مثل 20/7 = 2 و6/7 لا 2 و6/10.'),
          },
          {
            kind: 'note', id: 'u2l5-note-mistake-4', tone: 'warning',
            text: rich('④ إهمال الباقي: 20 ÷ 7 = 2 والباقي 6، فالجواب 2 و6/7 لا 2 فقط.'),
          },
          {
            kind: 'note', id: 'u2l5-note-check', tone: 'tip',
            text: rich('قاعدة التحقق الدائم: بسط الكسر العادي = الصحيح × المقام + البسط. إذا لم تتحقق هذه المساواة فالحل خاطئ.'),
          },
        ],
      },
    ],
  }
}
