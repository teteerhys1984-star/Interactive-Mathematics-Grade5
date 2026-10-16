import {
  checkClassifyItems, checkToImproperItems, checkToMixedItems, classifyItems, divideWithRemainder, exerciseThreeItems,
  exerciseTwoItems, formatFraction, toImproper, type BookItem, type MixedNumber,
} from '../lessons/fractionsTwoData'
import type { TeacherEntry } from './types'

/**
 * Teacher solutions for Unit 2 · Lesson 5 «الكسور (2)». Book items are generated from the same
 * integer helpers used by the student checks, so the printed answer key cannot drift from the lesson.
 */

const printedMixed = (printed: string): MixedNumber | undefined => {
  const match = /^\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/u.exec(printed)
  return match ? { whole: Number(match[1]), numerator: Number(match[2]), denominator: Number(match[3]) } : undefined
}

function classifyEntry(item: BookItem, title: string): TeacherEntry {
  const mixed = item.expected === 'mixed'
  return {
    id: `t-${item.id}`,
    title,
    prompt: `حدّد هل ${item.printed} كسر عادي أم كسر مركب.`,
    answer: item.expected === 'ambiguous' ? 'غير محسوم من النص المطبوع (ليس مركباً: لا يحتوي على جزء كسري)' : mixed ? 'كسر مركب' : 'كسر عادي',
    source: { type: 'textbook', page: item.page },
    reasoning: mixed
      ? [`${item.printed} فيها عدد صحيح قبل الكسر، لذلك هي كسر مركب.`]
      : item.expected === 'ambiguous'
        ? ['نص البند المطبوع هو العدد 5 دون خط كسر أو مقام.', 'رياضياً: 5 ليس كسراً مركباً لأنه لا يحتوي على جزء كسري.', 'الصفحة لا تحسم هل يُعد 5 «كسراً عادياً» (بمقام 1) أم لا؛ هذا التفسير الرياضي المحتمل وليس تصنيفاً منقولاً من الكتاب. لا تنسب إلى الكتاب تصنيفاً له، والبند غير محسوب في التغطية المكتملة.']
        : [`${item.printed} ليس فيها عدد صحيح قبل الكسر، لذلك هي كسر عادي.`],
  }
}

function toMixedEntry(item: BookItem, title: string): TeacherEntry {
  const [n, d] = item.printed.split('/').map(Number)
  const { quotient, remainder } = divideWithRemainder(n, d)
  return {
    id: `t-${item.id}`,
    title,
    prompt: `اكتب ${item.printed} بشكل كسر مركب.`,
    answer: item.expected,
    source: { type: 'textbook', page: item.page },
    reasoning: [
      `نقسم البسط ${n} على المقام ${d}: خارج القسمة ${quotient}، والباقي ${remainder}.`,
      `نكتب خارج القسمة عدداً صحيحاً، ثم الباقي فوق المقام ${d} دون تغييره: ${quotient} ${remainder}/${d}.`,
      `تحقّق: ${quotient} × ${d} + ${remainder} = ${n}.`,
    ],
    note: item.expected === '1 5/56' ? 'الخارج 1 لأن 56 تدخل في 61 مرة واحدة.' : undefined,
  }
}

function toImproperEntry(item: BookItem, title: string): TeacherEntry {
  const mixed = printedMixed(item.printed)!
  const improper = toImproper(mixed)
  return {
    id: `t-${item.id}`,
    title,
    prompt: `اكتب ${item.printed} بشكل كسر عادي.`,
    answer: formatFraction(improper),
    source: { type: 'textbook', page: item.page },
    reasoning: [
      `نضرب العدد الصحيح في المقام: ${mixed.whole} × ${mixed.denominator} = ${mixed.whole * mixed.denominator}.`,
      `نضيف البسط: ${mixed.whole * mixed.denominator} + ${mixed.numerator} = ${mixed.whole * mixed.denominator + mixed.numerator}.`,
      `نكتب الناتج فوق المقام ${mixed.denominator} دون تغييره: ${formatFraction(improper)}.`,
    ],
  }
}

export const unit2Lesson5TeacherEntries: TeacherEntry[] = [
  // ── Page 58: opening, comparison with one, cake model ──
  {
    id: 't-p58-opening', title: 'افتتاحية: 3 1/2 كيلوغرام',
    prompt: 'قال البائع لرغد إن كتلة السكر ثلاثة ونصف كيلوغرام، أي 3 1/2 kg. ماذا نسمّي هذا العدد؟',
    answer: 'كسر مركب: عدد صحيح (3) يليه كسر عادي أصغر من 1 (1/2).',
    source: { type: 'textbook', page: 58 },
    reasoning: ['العدد يتكوّن من عدد صحيح وكسر عادي معاً.', 'لذلك نسمّيه كسراً مركباً.'],
  },
  {
    id: 't-p58-act1', title: 'النشاط 1: قارن بسط الكسر ومقامه',
    prompt: 'قارن البسط والمقام في الكسور: 3/4، 4/4، 7/4.',
    answer: '3/4: البسط أصغر؛ 4/4: البسط يساوي المقام؛ 7/4: البسط أكبر.',
    source: { type: 'textbook', page: 58 },
    reasoning: ['في 3/4: 3 < 4.', 'في 4/4: 4 = 4.', 'في 7/4: 7 > 4.'],
  },
  {
    id: 't-p58-act2-a', title: 'النشاط 2 (أ): 7/4 و 1',
    prompt: 'أكمل بالرمز المناسب: 7/4 □ 1.',
    answer: '>',
    source: { type: 'textbook', page: 58 },
    reasoning: ['البسط 7 أكبر من المقام 4، إذن 7/4 أكبر من 1.'],
  },
  {
    id: 't-p58-act2-b', title: 'النشاط 2 (ب): 4/4 و 1',
    prompt: 'أكمل بالرمز المناسب: 4/4 □ 1.',
    answer: '=',
    source: { type: 'textbook', page: 58 },
    reasoning: ['البسط 4 يساوي المقام 4، إذن 4/4 = 1.'],
  },
  {
    id: 't-p58-act2-c', title: 'النشاط 2 (ج): 3/4 و 1',
    prompt: 'أكمل بالرمز المناسب: 3/4 □ 1.',
    answer: '<',
    source: { type: 'textbook', page: 58 },
    reasoning: ['البسط 3 أصغر من المقام 4، إذن 3/4 أصغر من 1.'],
  },
  {
    id: 't-p58-act3', title: 'النشاط 3: هل 1 3/4 و 7/4 الكمية نفسها؟',
    prompt: 'القالب الثالث يمثل 1 3/4، والقالب الرابع يمثل 7/4. هل يمثلان الكمية نفسها؟',
    answer: 'نعم.',
    source: { type: 'textbook', page: 58 },
    reasoning: ['القالب الكامل 4/4 = 1، ويُضاف إليه 3/4، فيكون المجموع 1 3/4.', 'التحويل: 1 3/4 = (1 × 4 + 3)/4 = 7/4، إذن الكميتان متساويتان.'],
  },
  {
    id: 't-p58-speak', title: 'تعبير شفهي: الكسر المركب والكسر العادي',
    prompt: 'كيف نميّز بين الكسر المركب والكسر العادي؟',
    answer: 'الكسر العادي كسر واحد بسطه ومقامه، والمركب يحوي عدداً صحيحاً قبل الكسر.',
    source: { type: 'textbook', page: 58 },
    reasoning: ['ننظر إلى ما قبل الكسر: إن وُجد عدد صحيح فهو مركب.', 'إن لم يوجد فهو عادي، مثل 3/4 أو 7/4.'],
  },

  // ── Page 59: rules, classification checkpoint, division example ──
  {
    id: 't-p59-rule-proper', title: 'قاعدة: البسط أصغر من المقام',
    prompt: 'اذكر الحكم في الكسر 1/2 بالنسبة إلى 1 وتصنيفه.',
    answer: '1/2 < 1 وهو كسر عادي.',
    source: { type: 'textbook', page: 59 },
    reasoning: ['البسط 1 أصغر من المقام 2.', 'إذن الكسر أصغر من 1، ويُسمّى كسراً عادياً.'],
  },
  {
    id: 't-p59-rule-equal', title: 'قاعدة: البسط يساوي المقام',
    prompt: 'اذكر الحكم في الكسر 13/13 بالنسبة إلى 1 وتصنيفه.',
    answer: '13/13 = 1 وهو كسر عادي.',
    source: { type: 'textbook', page: 59 },
    reasoning: ['البسط يساوي المقام، فالكسر يساوي 1.'],
  },
  {
    id: 't-p59-rule-improper', title: 'قاعدة: البسط أكبر من المقام',
    prompt: 'اذكر الحكم في الكسر 9/8 بالنسبة إلى 1 وتصنيفه.',
    answer: '9/8 > 1 وهو كسر عادي.',
    source: { type: 'textbook', page: 59 },
    reasoning: ['البسط 9 أكبر من المقام 8، فالكسر أكبر من 1.', 'يبقى كسراً عادياً إلى أن نكتبه مركباً.'],
  },
  {
    id: 't-p59-division', title: 'مثال: كتابة 9/4 بشكل مركب',
    prompt: 'اكتب 9/4 بشكل كسر مركب باستعمال القسمة.',
    answer: '2 1/4',
    source: { type: 'textbook', page: 59 },
    reasoning: ['نقسم 9 على 4: خارج القسمة 2، والباقي 1.', 'الباقي فوق المقام 4 يعطي 1/4.', 'إذن 9/4 = 2 1/4، وتحققه 4 × 2 + 1 = 9.'],
  },
  ...classifyItems.map((item, index) => classifyEntry(item, `تدريب ص 60 · بند ${['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'][index]}`)),
  ...checkClassifyItems.map((item, index) => classifyEntry(item, `تحقّق من فهمك ص 59 · بند ${['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'][index]}`)),
  ...checkToMixedItems.map((item, index) => toMixedEntry(item, `تحقّق من فهمك ص 60 · تحويل ${['أ', 'ب', 'ج', 'د'][index]}`)),
  ...checkToImproperItems.map((item, index) => toImproperEntry(item, `تحقّق من فهمك ص 60 · مركب إلى عادي ${['أ', 'ب', 'ج', 'د'][index]}`)),
  {
    id: 't-p60-example-2-1-4', title: 'مثال: كتابة 2 1/4 بشكل عادي',
    prompt: 'اكتب 2 1/4 بشكل كسر عادي بطريقتين.',
    answer: '9/4',
    source: { type: 'textbook', page: 60 },
    reasoning: ['الطريقة الأولى: 2 + 1/4 = 8/4 + 1/4 = 9/4.', 'الطريقة الثانية: (2 × 4 + 1) ÷ 4 = 9/4.'],
  },
  // ── Page 61: exercises 2–5 ──
  ...exerciseTwoItems.map((item, index) => toMixedEntry(item, `التدريب 2 ص 61 · بند ${['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'][index]}`)),
  ...exerciseThreeItems.map((item, index) => toImproperEntry(item, `التدريب 3 ص 61 · بند ${['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح'][index]}`)),
  {
    id: 't-p61-ex4-samir', title: 'التدريب 4: ادعاء سامر',
    prompt: 'قال سامر إن درجته 9 3/4، وقالت أمه إن درجته 39/4. هل ادّعاء سامر صحيح؟',
    answer: 'نعم، صحيح.',
    source: { type: 'textbook', page: 61 },
    reasoning: ['نحوّل 9 3/4 إلى كسر عادي: 9 × 4 + 3 = 39.', 'إذن 9 3/4 = 39/4، والادعاء صحيح.'],
  },
  {
    id: 't-p61-ex5-cake', title: 'التدريب 5: توزيع قالب الحلوى',
    prompt: 'قالب حلوى مقسّم إلى 8 قطع، تريد أمّ توزيعه على أولادها الثلاثة بالتساوي. كم ينال كل ولد من أولادها؟',
    answer: '2 2/3 قطعة لكل ولد (أو 8/3).',
    source: { type: 'textbook', page: 61 },
    reasoning: ['نقسم 8 قطع على 3 أولاد: 8 ÷ 3 = 2 والباقي 2.', 'يأخذ كل ولد 2 قطعة، ويبقى 2 قطعة تُقسّم على 3 أولاد فيأخذ كل ولد 2/3 منها.', 'إذن نصيب كل ولد 2 2/3 قطعة، أي 8/3، وتحقّق: 3 × 2 + 2 = 8.'],
    note: 'الكتاب لا يطبع إجابة هذا البند؛ الحل مشتق من القسمة مع الباقي.',
  },
]

/** Platform-authored activities. Marked `source.type: 'platform'` so they are never presented as textbook content. */
export const unit2Lesson5PlatformEntries: TeacherEntry[] = [
  {
    id: 'pl-cake-lab', title: 'نشاط إثرائي: مختبر القالب',
    prompt: 'حرّك عدد القطع المأخوذة من 1 إلى 12، وسجّل الكسر العادي والكسر المركب المكافئ لكل حالة.',
    answer: 'مثال: 6 قطع = 6/4 = 1 2/4 (أو 1 1/2).',
    source: { type: 'platform' },
    reasoning: ['كل قالب فيه 4 قطع، لذلك نقسم عدد القطع على 4.', 'خارج القسمة عدد القوالب الكاملة، والباقي عدد القطع الإضافية.'],
    note: 'نشاط من إعداد المنصة، وليس من الكتاب.',
  },
  {
    id: 'pl-classify-lab', title: 'نشاط إثرائي: مصنّف الكسور',
    prompt: 'أدخل بسطاً ومقاماً مختلفين، وصنّف الكسر بالنسبة إلى 1.',
    answer: 'البسط أصغر من المقام: أصغر من 1. مساوٍ: يساوي 1. أكبر وغير مضاعف: أكبر من 1 ويُكتب مركباً. مضاعف: عدد صحيح.',
    source: { type: 'platform' },
    reasoning: ['المقارنة تكون بالبسط والمقام قبل أي حساب.'],
    note: 'نشاط من إعداد المنصة.',
  },
  {
    id: 'pl-division-lab', title: 'نشاط إثرائي: مختبر القسمة',
    prompt: 'أدخل بسطاً ومقاماً، واكتب الكسر المركب باستعمال القسمة مع الباقي.',
    answer: 'مثال: 11/4 = 2 3/4 لأن 11 = 4 × 2 + 3.',
    source: { type: 'platform' },
    reasoning: ['خارج القسمة هو العدد الصحيح، والباقي هو البسط الجديد فوق المقام نفسه.'],
    note: 'نشاط من إعداد المنصة.',
  },
  {
    id: 'pl-build-lab', title: 'نشاط إثرائي: مختبر التحويل',
    prompt: 'أدخل كسراً مركباً، واكتب الكسر العادي المكافئ مع خطوات الضرب والجمع.',
    answer: 'مثال: 2 1/4 = (2 × 4 + 1)/4 = 9/4.',
    source: { type: 'platform' },
    reasoning: ['نضرب العدد الصحيح في المقام، ثم نضيف البسط، ونُبقي المقام كما هو.'],
    note: 'نشاط من إعداد المنصة.',
  },
  {
    id: 'pl-challenge', title: 'تحدٍّ ختامي: أيهما أكبر؟',
    prompt: 'قارن بين 2 3/5 و13/5 بالتحويل إلى كسر عادي بالمقام نفسه.',
    answer: 'متساويان: 2 3/5 = 13/5، لأن 2 × 5 + 3 = 13.',
    source: { type: 'platform' },
    reasoning: ['نحوّل المركب إلى عادي بالمقام 5، فنحصل على 13/5.', 'الكسران متساويان، ولا يوجد أكبر منهما.'],
    note: 'تحدٍّ من إعداد المنصة.',
  },
]
