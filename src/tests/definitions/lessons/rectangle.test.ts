import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/**
 * الوحدة الثانية · الدرس 9 — المستطيل (الكتاب ص 77–80).
 * عشرون سؤالاً جديداً: 6 أساسي، 7 متوسط، 4 متقدّم، 3 تفكير. لا يعيد أيّ سؤال نصّ تمرين مطبوع
 * أو سؤالاً من منطقة المعلم؛ كلّ سؤال ينقل فكرة مدروسة (شرطا التعريف، الخواصّ، الرسم، الرأس الرابع،
 * الأطوال في الأشكال المركّبة، نسبة العلم) إلى موقف جديد بأحرف وأرقام مختلفة عن الكتاب.
 * لا تظهر أيّ إجابة أو حلّ قبل التسليم؛ منطقة الحلول تُفتح بعد المحاولة فقط.
 */

const testId = 'lesson-rectangle-test'
const lessonId = 'rectangle'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) => lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })
const CM_UNITS = ['cm', 'سم', 'centimeter', 'centimeters', 'سنتيمتر', 'سنتيمترات']
const DEGREE_UNITS = ['°', 'degree', 'degrees', 'درجة', 'درجات']

const questions: QuestionDefinition[] = [
  /* ------------------------------------------------------------ أساسي (6) */
  q(1, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ العبارات الآتية تصلح تعريفاً للمستطيل؟')),
    concepts: ['rectangle-two-conditions'], skills: ['state-rectangle-definition'], sourceConcepts: ['rectangle-definition'],
    options: [
      optionText('q01-b', 'شكل رباعي فيه زاوية قائمة'),
      optionText('q01-c', 'متوازي أضلاع أضلاعه الأربعة متساوية'),
      optionText('q01-a', 'متوازي أضلاع فيه زاوية قائمة'),
      optionText('q01-d', 'شكل رباعي فيه ضلعان متوازيان'),
    ],
    answer: 'q01-a',
    solution: {
      idea: rich(text('التعريف يجمع شرطين: متوازي أضلاع، وزاوية قائمة.')),
      rule: rich(text('المستطيل هو متوازي الأضلاع فيه زاوية قائمة.')),
      steps: [
        rich(text('«شكل رباعي فيه زاوية قائمة» ناقص: شبه المنحرف القائم يحقّقه وليس مستطيلاً.')),
        rich(text('«أضلاعه الأربعة متساوية» شرط المعيّن لا المستطيل.')),
        rich(text('«ضلعان متوازيان» لا يضمنان حتى متوازي أضلاع.')),
      ],
      finalAnswer: rich(text('متوازي أضلاع فيه زاوية قائمة.')),
      commonError: rich(text('اختيار العبارة التي تذكر الزاوية القائمة وحدها من دون شرط متوازي الأضلاع.')),
    },
    originalityNote: 'يضع التعريف بين ثلاثة بدائل ناقصة أو خاصّة بأشكال أخرى، بدل سؤال استظهار مباشر لنصّ ص 77.',
  }),
  q(2, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('إذا كانت في متوازي الأضلاع زاوية واحدة قائمة، فإنّ زواياه الأربع تكون قائمة.')),
    concepts: ['one-right-angle-implies-four'], skills: ['infer-four-right-angles'], sourceConcepts: ['rectangle-properties'],
    answer: true,
    solution: {
      idea: rich(text('زاوية قائمة واحدة تكفي لتحويل متوازي الأضلاع إلى مستطيل.')),
      steps: [
        rich(text('متوازي أضلاع فيه زاوية قائمة هو مستطيل بحسب التعريف.')),
        rich(text('ومن خواصّ المستطيل أنّ زواياه الأربع قائمة.')),
      ],
      finalAnswer: rich(text('صحيح.')),
    },
    originalityNote: 'عبارة صواب/خطأ تربط التعريف بالخاصّة المضافة في ص 78 بصياغة مستقلّة عن بطاقة الخواصّ.',
  }),
  q(3, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('في المستطيل '), math('KLMN'), text(' (الرؤوس بالترتيب) طول الضلع '), math('KL = 7 cm'), text('. ما طول الضلع '), math('MN'), text('؟')),
    concepts: ['opposite-sides-equal'], skills: ['transfer-length-to-opposite-side'], sourceConcepts: ['rectangle-properties'],
    answer: { expected: '7', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('الضلع المطلوب يقابل الضلع المعلوم.')),
      rule: rich(text('كلّ ضلعين متقابلين في المستطيل متساويان في الطول.')),
      steps: [
        rich(text('في الترتيب '), math('K → L → M → N'), text(' الضلع '), math('MN'), text(' لا يشترك مع '), math('KL'), text(' في أيّ رأس، فهو مقابله.')),
        rich(math('MN = KL = 7 cm')),
      ],
      finalAnswer: rich(math('7 cm')),
      commonError: rich(text('اختيار '), math('LM'), text(' ظنّاً أنه المقابل، وهو ضلع مجاور.')),
    },
    originalityNote: 'ينقل خاصّة الأضلاع المتقابلة إلى مستطيل بأحرف وطول جديدين، ولا يعيد فراغات تدرّب ① في ص 80.',
  }),
  q(4, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('في المستطيل '), math('PQRS'), text(' (الرؤوس بالترتيب)، أيّ قطعة توازي الضلع '), math('PQ'), text('؟')),
    concepts: ['opposite-sides-parallel'], skills: ['identify-opposite-side'], sourceConcepts: ['rectangle-properties'],
    options: [option('q04-a', math('QR')), option('q04-b', math('SR')), option('q04-c', math('PS')), option('q04-d', math('PR'))],
    answer: 'q04-b',
    solution: {
      idea: rich(text('الضلع الموازي هو الضلع المقابل.')),
      rule: rich(text('كلّ ضلعين متقابلين في المستطيل متوازيان.')),
      steps: [
        rich(math('QR'), text(' و'), math('PS'), text(' يجاوران '), math('PQ'), text(' ويعامدانه.')),
        rich(math('PR'), text(' قطر وليس ضلعاً.')),
        rich(text('يبقى '), math('SR'), text(' وهو الضلع المقابل.')),
      ],
      finalAnswer: rich(math('SR')),
      commonError: rich(text('اختيار ضلع مجاور لأنه يبدو «بجانب» الضلع المعطى.')),
    },
    originalityNote: 'يميّز الضلع المقابل من الضلعين المجاورين والقطر في مستطيل بأحرف جديدة.',
  }),
  q(5, {
    type: 'multi-select', difficulty: 'basic',
    prompt: rich(text('بحسب طريقة الرسم في الدرس، اختر كلّ أداة تُستعمل لرسم مستطيل بطول وعرض معلومين.')),
    concepts: ['construction-tools'], skills: ['select-construction-tools'], sourceConcepts: ['rectangle-construction'],
    options: [optionText('q05-d', 'الفرجار'), optionText('q05-a', 'المسطرة'), optionText('q05-e', 'الآلة الحاسبة'), optionText('q05-b', 'المنقلة'), optionText('q05-c', 'الكوس')],
    answer: ['q05-a', 'q05-b', 'q05-c'],
    solution: {
      idea: rich(text('نحتاج أداة قياس أطوال وأداة إقامة زاوية قائمة.')),
      steps: [
        rich(text('المسطرة ترسم الطول والعرض وتقيسهما.')),
        rich(text('المنقلة أو الكوس يقيمان العمود (الزاوية القائمة).')),
        rich(text('الفرجار والآلة الحاسبة لا دور لهما في الطريقة المطبوعة.')),
      ],
      finalAnswer: rich(text('المسطرة والمنقلة والكوس.')),
    },
    originalityNote: 'يستخرج الأدوات من عنوان فقرة الرسم في ص 79 ضمن قائمة فيها أداتان دخيلتان.',
  }),
  q(6, {
    type: 'matching', difficulty: 'basic',
    prompt: rich(text('طابق كلّ وصف مع اسم الشكل الذي يحقّقه.')),
    concepts: ['rectangle-square-parallelogram-family'], skills: ['match-description-to-shape-name'], sourceConcepts: ['rectangle-definition'],
    left: [
      optionText('q06-l1', 'متوازي أضلاع فيه زاوية قائمة وضلعاه المتجاوران مختلفان في الطول'),
      optionText('q06-l2', 'متوازي أضلاع فيه زاوية قائمة وأضلاعه الأربعة متساوية'),
      optionText('q06-l3', 'متوازي أضلاع ليس فيه أيّ زاوية قائمة'),
    ],
    right: [optionText('q06-r1', 'مربّع'), optionText('q06-r2', 'متوازي أضلاع ليس مستطيلاً'), optionText('q06-r3', 'مستطيل ليس مربّعاً')],
    answer: [
      { leftId: 'q06-l1', rightId: 'q06-r3' },
      { leftId: 'q06-l2', rightId: 'q06-r1' },
      { leftId: 'q06-l3', rightId: 'q06-r2' },
    ],
    solution: {
      idea: rich(text('الزاوية القائمة تعطي المستطيل، وتساوي الأضلاع يحوّله إلى مربّع.')),
      steps: [
        rich(text('زاوية قائمة مع ضلعين متجاورين مختلفين ⇐ مستطيل ليس مربّعاً.')),
        rich(text('زاوية قائمة مع أضلاع متساوية ⇐ مربّع.')),
        rich(text('لا زاوية قائمة ⇐ متوازي أضلاع ليس مستطيلاً.')),
      ],
      finalAnswer: rich(text('مستطيل ليس مربّعاً، ثمّ مربّع، ثمّ متوازي أضلاع ليس مستطيلاً.')),
    },
    originalityNote: 'يعيد تنظيم فرز انطلاقة ص 77 بأوصاف لفظية بدل أشكال مرسومة، مع إدراج حالة المربّع صراحةً.',
  }),

  /* ------------------------------------------------------------ متوسط (7) */
  q(7, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('مستطيل طوله '), math('9 cm'), text(' وعرضه '), math('5 cm'), text('. ما مجموع أطوال أضلاعه الأربعة؟')),
    concepts: ['opposite-sides-equal'], skills: ['sum-sides-from-two-dimensions'], sourceConcepts: ['rectangle-properties'],
    coverage: { applications: ['lengths-around-rectangles'] },
    answer: { expected: '28', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('الطول يظهر مرتين والعرض مرتين.')),
      rule: rich(text('كلّ ضلعين متقابلين في المستطيل متساويان.')),
      steps: [
        rich(text('الأضلاع: '), math('9، 5، 9، 5')),
        rich(math('9 + 5 + 9 + 5 = 28')),
      ],
      finalAnswer: rich(math('28 cm')),
      commonError: rich(text('جمع الطول والعرض مرة واحدة فينتج '), math('14 cm'), text('.')),
    },
    originalityNote: 'تطبيق على تساوي الأضلاع المتقابلة بأبعاد جديدة؛ الكتاب لا يطرح مجموع الأضلاع في هذا الدرس.',
  }),
  q(8, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('قال سامر: «هذا الشكل الرباعي فيه زاوية قائمة، إذن هو مستطيل». ما الشرط الذي نسيه سامر؟')),
    concepts: ['rectangle-two-conditions'], skills: ['detect-missing-condition'], sourceConcepts: ['rectangle-non-examples'],
    coverage: { commonErrors: ['right-angle-alone-suffices'] },
    options: [
      optionText('q08-a', 'أن يكون الشكل متوازي أضلاع'),
      optionText('q08-d', 'أن تكون فيه زاويتان قائمتان على الأقلّ'),
      optionText('q08-b', 'أن تكون أضلاعه الأربعة متساوية'),
      optionText('q08-c', 'أن يكون قطراه متعامدين'),
    ],
    answer: 'q08-a',
    solution: {
      idea: rich(text('الزاوية القائمة شرط ثانٍ يُضاف إلى شرط أوّل هو متوازي الأضلاع.')),
      rule: rich(text('المستطيل هو متوازي الأضلاع فيه زاوية قائمة.')),
      steps: [
        rich(text('شكل رباعي فيه زاوية قائمة قد يكون شبه منحرف قائم أو شكلاً بلا أضلاع متوازية.')),
        rich(text('الشرط الناقص هو أن يكون الشكل متوازي أضلاع أوّلاً.')),
      ],
      finalAnswer: rich(text('أن يكون الشكل متوازي أضلاع.')),
      commonError: rich(text('الظنّ أنّ زاويتين قائمتين تكفيان؛ الشكل الثالث في تحقّق ص 78 فيه زاويتان قائمتان وليس مستطيلاً.')),
    },
    originalityNote: 'يصوغ الأمثلة المضادّة في ص 78 على شكل حوار يكشف الشرط المنسيّ، من دون إعادة رسوم الجدول.',
  }),
  q(9, {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب خطوات رسم مستطيل طوله '), math('5 cm'), text(' وعرضه '), math('2 cm'), text(' بالمسطرة والكوس.')),
    concepts: ['construction-sequence'], skills: ['sequence-rectangle-construction'], sourceConcepts: ['rectangle-construction'],
    items: [
      optionText('q09-a', 'عيّن على العمود نقطة تبعد 2 cm عن الطرف'),
      optionText('q09-b', 'ارسم قطعة مستقيمة طولها 5 cm'),
      optionText('q09-c', 'أقم عموداً على القطعة من أحد طرفيها'),
      optionText('q09-d', 'صل النقطتين الجديدتين وتحقّق من الزوايا القائمة'),
      optionText('q09-e', 'أقم عموداً من الطرف الآخر وعيّن عليه نقطة تبعد 2 cm'),
    ],
    answer: ['q09-b', 'q09-c', 'q09-a', 'q09-e', 'q09-d'],
    solution: {
      idea: rich(text('الطول أوّلاً، ثمّ عمود وعرض عند كلّ طرف، ثمّ الوصل والتحقّق.')),
      steps: [
        rich(text('لا يمكن إقامة عمود قبل رسم القطعة.')),
        rich(text('العرض يُقاس على العمود بعد إقامته، عند الطرف الأوّل ثمّ الثاني.')),
        rich(text('الوصل آخر خطوة، والتحقّق بعده.')),
      ],
      finalAnswer: rich(text('قطعة 5 cm ← عمود ← نقطة على بعد 2 cm ← عمود ونقطة من الطرف الآخر ← وصل وتحقّق.')),
    },
    originalityNote: 'يعيد ترتيب منطق الرسم في ص 79 بأبعاد جديدة (5 cm و2 cm) وبصياغة عامّة من دون أحرف الكتاب.',
  }),
  q(10, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('في الشكل الرباعي '), math('ABCD'), text(': '), math('AB ∥ DC'), text(' و'), math('AD ∥ BC'), text(' و'), math('Â = 90°'), text('. ما قياس الزاوية '), math('Ĉ'), text('؟')),
    concepts: ['one-right-angle-implies-four'], skills: ['infer-four-right-angles'], sourceConcepts: ['rectangle-definition', 'rectangle-properties'],
    answer: { expected: '90', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: DEGREE_UNITS } },
    solution: {
      idea: rich(text('التوازيان يجعلان الشكل متوازي أضلاع، والزاوية القائمة تجعله مستطيلاً.')),
      rule: rich(text('زوايا المستطيل الأربع قائمة.')),
      steps: [
        rich(math('AB ∥ DC'), text(' و'), math('AD ∥ BC'), text(' ⇐ '), math('ABCD'), text(' متوازي أضلاع.')),
        rich(math('Â = 90°'), text(' ⇐ مستطيل، وزواياه كلّها قائمة.')),
        rich(math('Ĉ = 90°'), text(' (وهي أيضاً مقابلة لـ '), math('Â'), text(' فتساويها).')),
      ],
      finalAnswer: rich(math('90°')),
    },
    originalityNote: 'يعيد بناء استدلال مثال ص 78 بزاوية معطاة مختلفة (A بدل D) ويطلب زاوية مقابلة لها.',
  }),
  q(11, {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('في المستطيل '), math('EFGH'), text(' (الرؤوس بالترتيب)، اختر كلّ عبارة صحيحة دائماً.')),
    concepts: ['opposite-sides-equal', 'opposite-sides-parallel', 'one-right-angle-implies-four'], skills: ['identify-always-true-properties'], sourceConcepts: ['rectangle-properties'],
    coverage: { commonErrors: ['four-equal-sides-in-rectangle'] },
    options: [option('q11-a', math('EF = HG')), option('q11-d', math('EF = FG'), text(' دائماً')), option('q11-b', math('EF ∥ HG')), optionText('q11-c', 'زواياه الأربع قائمة')],
    answer: ['q11-a', 'q11-b', 'q11-c'],
    solution: {
      idea: rich(text('نفصل خواصّ المستطيل المضمونة عن خاصّة المربّع.')),
      steps: [
        rich(math('EF'), text(' و'), math('HG'), text(' متقابلان فهما متساويان ومتوازيان.')),
        rich(text('الزوايا الأربع قائمة في كلّ مستطيل.')),
        rich(math('EF = FG'), text(' يخصّ المربّع فقط لأنهما ضلعان متجاوران.')),
      ],
      finalAnswer: rich(text('العبارات الثلاث الأولى.')),
      commonError: rich(text('إضافة تساوي الضلعين المتجاورين إلى خواصّ المستطيل.')),
    },
    originalityNote: 'يفرز ثلاث خواصّ مضمونة من مغالطة «الأضلاع الأربعة متساوية» في مستطيل بأحرف جديدة.',
  }),
  q(12, {
    type: 'error-analysis', difficulty: 'medium',
    prompt: rich(text('طُلب من طالب تعيين الرأس الرابع '), math('W'), text(' للمستطيل '), math('XYZW'), text(' بعد أن رُسم '), math('[YX]'), text(' و'), math('[YZ]'), text(' متعامدين. اختر التشخيص والتصحيح لعمله.')),
    concepts: ['fourth-vertex-rectangle'], skills: ['diagnose-fourth-vertex-error'], sourceConcepts: ['rectangle-fourth-vertex'],
    coverage: { commonErrors: ['match-side-with-adjacent-instead-of-opposite'] },
    studentWork: rich(text('أقام من '), math('X'), text(' عموداً على '), math('[YX]'), text(' وعيّن عليه '), math('W'), text(' بحيث '), math('XW = XY')),
    diagnoses: [
      optionText('q12-d2', 'الخطأ في اتجاه العمود فقط، أمّا XW = XY فصحيح لأنّ أضلاع المستطيل متساوية'),
      optionText('q12-d1', 'الضلع XW يقابل YZ لا XY، فيجب أن يساوي YZ'),
    ],
    corrections: [option('q12-c2', math('XW = XY'), text(' على العمود من '), math('Z')), option('q12-c1', math('XW = YZ'), text(' على العمود من '), math('X'))],
    answer: { diagnosisId: 'q12-d1', correctionId: 'q12-c1' },
    solution: {
      idea: rich(text('الرأس الرابع يتحدّد بتساوي الضلعين المتقابلين لا المتجاورين.')),
      steps: [
        rich(text('في '), math('XYZW'), text(' الضلع '), math('[XW]'), text(' يقابل '), math('[YZ]'), text('.')),
        rich(text('العمود من '), math('X'), text(' صحيح، لكن الطول الصحيح عليه هو '), math('YZ'), text('.')),
      ],
      finalAnswer: rich(text('التشخيص: خلط الضلع المقابل بالمجاور؛ والتصحيح: '), math('XW = YZ'), text('.')),
      commonError: rich(text('افتراض أنّ أضلاع المستطيل كلّها متساوية.')),
    },
    originalityNote: 'يحلّل خطأً في طريقة تعيين الرأس الرابع (تدرّب ③ ص 80) بدل إعادة طلب التعيين نفسه.',
  }),
  q(13, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('وُضع مستطيل طوله '), math('6 cm'), text(' بجانب مستطيل طوله '), math('4 cm'), text(' على استقامة واحدة بحيث تلاصق عرضاهما المتساويان، فتكوّن مستطيل واحد. ما طول المستطيل الناتج؟')),
    concepts: ['composite-lengths'], skills: ['add-collinear-lengths'], sourceConcepts: ['rectangle-composite-lengths'],
    coverage: { applications: ['lengths-around-rectangles'] },
    answer: { expected: '10', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('الطولان على استقامة واحدة فيُجمعان.')),
      steps: [
        rich(text('الضلعان الملاصقان متساويان، فالشكل الناتج مستطيل طوله مجموع الطولين.')),
        rich(math('6 + 4 = 10')),
      ],
      finalAnswer: rich(math('10 cm')),
      commonError: rich(text('جمع العرض أيضاً إلى الطول.')),
    },
    originalityNote: 'يمهّد لمسائل الأشكال المركّبة (تدرّب ④ ص 80) بموقف لفظي بسيط وأرقام جديدة.',
  }),

  /* ------------------------------------------------------------ متقدّم (4) */
  q(14, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('في المستطيل '), math('ABCD'), text(': '), math('AB = 10 cm'), text(' و'), math('BC = 6 cm'), text('. النقطة '), math('E'), text(' على '), math('[AB]'), text(' والنقطة '), math('F'), text(' على '), math('[DC]'), text(' بحيث '), math('AEFD'), text(' مستطيل و'), math('AE = 4 cm'), text('. احسب '), math('EF + EB'), text('.')),
    concepts: ['composite-lengths', 'opposite-sides-equal'], skills: ['combine-opposite-side-and-subtraction'], sourceConcepts: ['rectangle-composite-lengths'],
    coverage: { applications: ['lengths-around-rectangles'], thinking: ['chain-two-rectangles'] },
    answer: { expected: '12', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('كلّ طول مجهول يُستبدل بضلع مقابل معلوم.')),
      rule: rich(text('كلّ ضلعين متقابلين في المستطيل متساويان.')),
      steps: [
        rich(text('في '), math('AEFD'), text(': '), math('EF = AD'), text('، وفي '), math('ABCD'), text(': '), math('AD = BC = 6 cm'), text('، إذن '), math('EF = 6 cm'), text('.')),
        rich(math('EB = AB − AE = 10 − 4 = 6 cm')),
        rich(math('EF + EB = 6 + 6 = 12 cm')),
      ],
      finalAnswer: rich(math('12 cm')),
      commonError: rich(text('اعتبار '), math('EF = AE = 4 cm'), text(' مع أنهما ضلعان متجاوران.')),
    },
    originalityNote: 'مسألة مركّبة جديدة (مستطيل داخل مستطيل) تختلف في بنيتها وأرقامها عن شكل تدرّب ④ في ص 80.',
  }),
  q(15, {
    type: 'single-choice', difficulty: 'advanced',
    prompt: rich(text('شكل رباعي فيه زاويتان قائمتان وليس فيه أيّ ضلعين متوازيين. أيّ حكم صحيح؟')),
    concepts: ['rectangle-two-conditions'], skills: ['judge-with-partial-evidence'], sourceConcepts: ['rectangle-non-examples'],
    coverage: { commonErrors: ['right-angle-alone-suffices'] },
    options: [
      optionText('q15-b', 'مستطيل لأنّ فيه زاوية قائمة'),
      optionText('q15-c', 'متوازي أضلاع لأنّ فيه زاويتين قائمتين'),
      optionText('q15-d', 'مربّع لأنّ فيه زاويتين قائمتين'),
      optionText('q15-a', 'ليس مستطيلاً لأنه ليس متوازي أضلاع'),
    ],
    answer: 'q15-a',
    solution: {
      idea: rich(text('من دون أضلاع متوازية لا يكون الشكل متوازي أضلاع، فلا يكون مستطيلاً.')),
      rule: rich(text('المستطيل هو متوازي الأضلاع فيه زاوية قائمة.')),
      steps: [
        rich(text('الشرط الأوّل (متوازي أضلاع) غير متحقّق لعدم وجود أضلاع متوازية.')),
        rich(text('الزاويتان القائمتان لا تعوّضان الشرط الأوّل.')),
      ],
      finalAnswer: rich(text('ليس مستطيلاً لأنه ليس متوازي أضلاع.')),
      commonError: rich(text('الحكم بأنه مستطيل بسبب الزوايا القائمة.')),
    },
    originalityNote: 'يحوّل الشكل الثالث من تحقّق ص 78 إلى وصف لفظي ويطلب الحكم المعلَّل بدل التعليل المفتوح.',
  }),
  q(16, {
    type: 'multi-select', difficulty: 'advanced',
    prompt: rich(text('اختر كلّ مجموعة شروط تضمن أنّ الشكل الرباعي مستطيل.')),
    concepts: ['rectangle-two-conditions', 'one-right-angle-implies-four'], skills: ['evaluate-sufficient-conditions'], sourceConcepts: ['rectangle-definition', 'rectangle-properties'],
    coverage: { thinking: ['evaluate-sufficiency'] },
    options: [
      optionText('q16-c', 'شكل رباعي فيه زاوية قائمة واحدة'),
      optionText('q16-a', 'متوازي أضلاع وفيه زاوية قائمة'),
      optionText('q16-d', 'متوازي أضلاع ضلعاه المتجاوران متساويان'),
      optionText('q16-b', 'شكل رباعي زواياه الأربع قائمة'),
    ],
    answer: ['q16-a', 'q16-b'],
    solution: {
      idea: rich(text('نبحث عن الشروط التي تعطي متوازي أضلاع وزاوية قائمة معاً.')),
      steps: [
        rich(text('«متوازي أضلاع وفيه زاوية قائمة» هو التعريف نفسه.')),
        rich(text('أربع زوايا قائمة تجعل كلّ ضلعين متقابلين عموديين على ضلع واحد فهما متوازيان، والشكل متوازي أضلاع فيه زاوية قائمة.')),
        rich(text('زاوية قائمة واحدة في شكل رباعي عامّ لا تكفي، وتساوي ضلعين متجاورين يعطي معيّناً.')),
      ],
      finalAnswer: rich(text('المجموعتان الأولى والثانية.')),
      commonError: rich(text('قبول «زاوية قائمة واحدة» من دون شرط متوازي الأضلاع.')),
    },
    originalityNote: 'يقوّم كفاية مجموعات شروط مختلفة، ومنها حالة الزوايا الأربع التي لا يطرحها الكتاب صراحةً.',
  }),
  q(17, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('في المستطيل '), math('ABCD'), text(' رُسم القطر '), math('[AC]'), text(' فقسم الزاوية '), math('Â'), text(' إلى زاويتين قياس إحداهما '), math('35°'), text('. ما قياس الزاوية الأخرى؟')),
    concepts: ['one-right-angle-implies-four'], skills: ['split-right-angle'], sourceConcepts: ['rectangle-properties'],
    coverage: { thinking: ['chain-two-rectangles'] },
    answer: { expected: '55', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: DEGREE_UNITS } },
    solution: {
      idea: rich(text('القطر يقسم زاوية قائمة إلى جزأين مجموعهما '), math('90°'), text('.')),
      rule: rich(text('زوايا المستطيل الأربع قائمة.')),
      steps: [
        rich(math('Â = 90°'), text(' لأنّ '), math('ABCD'), text(' مستطيل.')),
        rich(math('90° − 35° = 55°')),
      ],
      finalAnswer: rich(math('55°')),
      commonError: rich(text('الطرح من '), math('180°'), text(' بدل '), math('90°'), text('.')),
    },
    originalityNote: 'يستعمل خاصّة الزاوية القائمة في حساب جديد (قطر يقسم الزاوية) لا يرد في صفحات الدرس.',
  }),

  /* ------------------------------------------------------------ تفكير (3) */
  q(18, {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('اختر التشخيص والتصحيح لحكم الطالب الآتي.')),
    concepts: ['rectangle-square-parallelogram-family', 'rectangle-two-conditions'], skills: ['judge-inclusion-direction'], sourceConcepts: ['rectangle-non-examples', 'rectangle-definition'],
    coverage: { thinking: ['reason-about-inclusion'], commonErrors: ['reverse-inclusion-direction'] },
    studentWork: rich(text('كلّ متوازي أضلاع هو مستطيل، لأنّ ضلعيه المتقابلين متوازيان كما في المستطيل')),
    diagnoses: [
      optionText('q18-d1', 'التوازي شرط مشترك لا يكفي؛ المستطيل يحتاج زاوية قائمة أيضاً'),
      optionText('q18-d2', 'الحكم صحيح لأنّ المستطيل ومتوازي الأضلاع اسمان لشكل واحد'),
    ],
    corrections: [
      optionText('q18-c2', 'كلّ متوازي أضلاع مستطيل إذا تساوى ضلعاه المتقابلان'),
      optionText('q18-c1', 'كلّ مستطيل متوازي أضلاع، وليس كلّ متوازي أضلاع مستطيلاً'),
    ],
    answer: { diagnosisId: 'q18-d1', correctionId: 'q18-c1' },
    solution: {
      idea: rich(text('اتجاه الاحتواء من المستطيل إلى متوازي الأضلاع لا العكس.')),
      steps: [
        rich(text('توازي الضلعين المتقابلين متحقّق في كلّ متوازي أضلاع، فلا يميّز المستطيل.')),
        rich(text('متوازي أضلاع بلا زاوية قائمة مثال مضاد يكفي لنقض الحكم.')),
      ],
      finalAnswer: rich(text('التشخيص: خلط الشرط المشترك بالشرط المميّز؛ والتصحيح: كلّ مستطيل متوازي أضلاع وليس العكس.')),
      commonError: rich(text('عكس اتجاه العلاقة بين الشكلين.')),
    },
    originalityNote: 'يحلّل تبريراً خاطئاً لعبارة (ب) من تدرّب ② ص 80 بدل طلب الحكم صح/خطأ عليها.',
  }),
  q(19, {
    type: 'single-choice', difficulty: 'thinking',
    prompt: rich(text('أيّ عبارة تصف العلاقة بين المربّع والمستطيل وصفاً صحيحاً؟')),
    concepts: ['rectangle-square-parallelogram-family'], skills: ['judge-inclusion-direction'], sourceConcepts: ['rectangle-definition'],
    coverage: { thinking: ['reason-about-inclusion'], commonErrors: ['exclude-square-from-rectangles'] },
    options: [
      optionText('q19-c', 'لا يمكن أن يكون المربّع مستطيلاً'),
      optionText('q19-a', 'كلّ مربّع مستطيل، وليس كلّ مستطيل مربّعاً'),
      optionText('q19-d', 'المربّع مستطيل فقط إذا كان طوله ضعف عرضه'),
      optionText('q19-b', 'كلّ مستطيل مربّع، وليس كلّ مربّع مستطيلاً'),
    ],
    answer: 'q19-a',
    solution: {
      idea: rich(text('المربّع يحقّق تعريف المستطيل ويزيد عليه تساوي الأضلاع.')),
      steps: [
        rich(text('المربّع متوازي أضلاع فيه زاوية قائمة ⇐ مستطيل.')),
        rich(text('مستطيل طوله يخالف عرضه ليس مربّعاً.')),
      ],
      finalAnswer: rich(text('كلّ مربّع مستطيل، وليس كلّ مستطيل مربّعاً.')),
      commonError: rich(text('فصل المربّع عن عائلة المستطيلات.')),
    },
    originalityNote: 'يعمّم ملاحظة الشكل (4) في انطلاقة ص 77 إلى علاقة احتواء عامّة لا ينصّ عليها الكتاب حرفياً.',
  }),
  q(20, {
    type: 'numeric', difficulty: 'thinking',
    prompt: rich(text('علم مستطيل عرضه يساوي ثلثي طوله، وطوله '), math('120 cm'), text('. ما عرضه؟')),
    concepts: ['flag-ratio'], skills: ['apply-two-thirds-ratio'], sourceConcepts: ['rectangle-opening-flag'],
    coverage: { applications: ['flags-and-everyday-rectangles'], thinking: ['connect-fractions-to-geometry'] },
    answer: { expected: '80', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('ثلثا الطول = الطول ÷ 3 × 2.')),
      steps: [
        rich(math('120 ÷ 3 = 40'), text(' (الثلث).')),
        rich(math('40 × 2 = 80'), text(' (الثلثان).')),
      ],
      finalAnswer: rich(math('80 cm')),
      commonError: rich(text('حساب الثلث فقط فينتج '), math('40 cm'), text('.')),
    },
    originalityNote: 'يستثمر نسبة «العرض ثلثا الطول» من مدخل ص 77 بطول جديد، ويربط الدرس بالكسور المدروسة سابقاً.',
  }),
]

const definition = defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار المستطيل',
  description: textOnly('عشرون سؤالاً جديداً على درس المستطيل: شرطا التعريف، الخواصّ، الرسم بالأدوات، الرأس الرابع، والأطوال في الأشكال المركّبة.'),
  instructions: textOnly('أجب عن الأسئلة العشرين. لا تظهر أيّ نتيجة أثناء المحاولة؛ تُعرض النتيجة والحلول بعد التسليم في منطقة الحلول.'),
  questions,
  sourceConcepts: [
    { id: 'rectangle-opening-flag', label: 'مدخل الدرس: مستطيلات العلم وعرضه ثلثا طوله', pages: [77] },
    { id: 'rectangle-definition', label: 'تعريف المستطيل: متوازي أضلاع فيه زاوية قائمة، وفرز الأشكال', pages: [77, 78] },
    { id: 'rectangle-non-examples', label: 'أمثلة مضادّة: متوازي أضلاع بلا زاوية قائمة، وأشكال بزوايا قائمة ليست متوازيات أضلاع', pages: [78] },
    { id: 'rectangle-properties', label: 'خواصّ المستطيل: خواصّ متوازي الأضلاع مع أربع زوايا قائمة', pages: [78, 80] },
    { id: 'rectangle-construction', label: 'رسم المستطيل بالمسطرة والمنقلة أو الكوس', pages: [79, 80] },
    { id: 'rectangle-fourth-vertex', label: 'تعيين الرأس الرابع للمستطيل والخواصّ المستعملة', pages: [80] },
    { id: 'rectangle-composite-lengths', label: 'حساب أطوال في شكل مركّب من مستطيلين', pages: [80] },
  ],
  conceptLabels: {
    'rectangle-two-conditions': 'شرطا تعريف المستطيل: متوازي أضلاع وزاوية قائمة',
    'one-right-angle-implies-four': 'زاوية قائمة واحدة تجعل الزوايا الأربع قائمة',
    'opposite-sides-equal': 'تساوي الضلعين المتقابلين في المستطيل',
    'opposite-sides-parallel': 'توازي الضلعين المتقابلين في المستطيل',
    'construction-tools': 'أدوات رسم المستطيل',
    'construction-sequence': 'ترتيب خطوات رسم المستطيل',
    'rectangle-square-parallelogram-family': 'موقع المستطيل بين متوازي الأضلاع والمربّع',
    'fourth-vertex-rectangle': 'تعيين الرأس الرابع للمستطيل',
    'composite-lengths': 'أطوال على استقامة واحدة في أشكال مركّبة',
    'flag-ratio': 'نسبة عرض العلم إلى طوله',
  },
  skillLabels: {
    'state-rectangle-definition': 'تمييز التعريف الصحيح من البدائل الناقصة',
    'infer-four-right-angles': 'استنتاج الزوايا الأربع من زاوية قائمة واحدة',
    'transfer-length-to-opposite-side': 'نقل الطول إلى الضلع المقابل',
    'identify-opposite-side': 'تحديد الضلع المقابل بالترتيب الحرفي',
    'select-construction-tools': 'اختيار أدوات الرسم المناسبة',
    'match-description-to-shape-name': 'مطابقة وصف الخواصّ باسم الشكل',
    'sum-sides-from-two-dimensions': 'حساب مجموع الأضلاع من الطول والعرض',
    'detect-missing-condition': 'كشف الشرط الناقص في استدلال',
    'sequence-rectangle-construction': 'ترتيب خطوات الرسم ترتيباً منطقياً',
    'identify-always-true-properties': 'تمييز الخواصّ المضمونة من غير المضمونة',
    'diagnose-fourth-vertex-error': 'تشخيص خطأ في تعيين الرأس الرابع',
    'add-collinear-lengths': 'جمع أطوال على استقامة واحدة',
    'combine-opposite-side-and-subtraction': 'دمج تساوي الأضلاع المتقابلة مع الطرح',
    'judge-with-partial-evidence': 'الحكم على الشكل من معطيات ناقصة',
    'evaluate-sufficient-conditions': 'تقويم كفاية مجموعة شروط',
    'split-right-angle': 'تجزئة الزاوية القائمة بقطر',
    'judge-inclusion-direction': 'تحديد اتجاه الاحتواء بين الأشكال',
    'apply-two-thirds-ratio': 'تطبيق نسبة الثلثين على طول',
  },
  applicationLabels: {
    'lengths-around-rectangles': 'أطوال وأبعاد في مواقف واقعية ومركّبة',
    'flags-and-everyday-rectangles': 'المستطيلات في الأعلام والأشياء اليومية',
  },
  thinkingLabels: {
    'chain-two-rectangles': 'ربط معلومات من مستطيلين أو أكثر في استنتاج واحد',
    'evaluate-sufficiency': 'التمييز بين الشرط اللازم والشرط الكافي',
    'reason-about-inclusion': 'التفكير في علاقات الاحتواء بين الأشكال',
    'connect-fractions-to-geometry': 'ربط الكسور بالأبعاد الهندسية',
  },
  commonErrorLabels: {
    'right-angle-alone-suffices': 'الاكتفاء بالزاوية القائمة من دون شرط متوازي الأضلاع',
    'four-equal-sides-in-rectangle': 'نسبة تساوي الأضلاع الأربعة إلى المستطيل',
    'match-side-with-adjacent-instead-of-opposite': 'مساواة الضلع بالمجاور بدل المقابل',
    'reverse-inclusion-direction': 'عكس اتجاه العلاقة بين المستطيل ومتوازي الأضلاع',
    'exclude-square-from-rectangles': 'استبعاد المربّع من عائلة المستطيلات',
  },
})

export default definition
