import { defineLessonTest, lessonQuestion, math, rich, text, textOnly, type LessonQuestionDraft } from '../../lessonTestBuilder'
import type { QuestionDefinition } from '../../types'

/**
 * Lesson 8 — المعيّن (الكتاب ص 36–39).
 * Twenty brand-new items: 6 basic, 7 medium, 4 advanced, 3 thinking. None of them reproduces a
 * printed textbook question or a Teacher Area / in-lesson final-test prompt; each one transfers
 * a taught idea (شرط التعريف، الخواصّ الثلاث، الرسم، تسمية الأشكال، الرأس الرابع) to a new situation.
 */

const testId = 'lesson-rhombus-test'
const lessonId = 'rhombus'
const qid = (number: number) => `${testId}-q${String(number).padStart(2, '0')}`
const q = (number: number, draft: LessonQuestionDraft) =>
  lessonQuestion(testId, lessonId, qid(number), draft)
const option = (id: string, ...runs: Parameters<typeof rich>) => ({ id, label: rich(...runs) })
const optionText = (id: string, value: string) => ({ id, label: textOnly(value) })
const CM_UNITS = ['cm', 'سم', 'centimeter', 'centimeters', 'سنتيمتر', 'سنتيمترات']
const DEGREE_UNITS = ['°', 'degree', 'degrees', 'درجة', 'درجات']

const questions: QuestionDefinition[] = [
  q(1, {
    type: 'single-choice', difficulty: 'basic',
    prompt: rich(text('أيّ شرط إضافي يحوّل متوازي الأضلاع إلى معيّن؟')),
    concepts: ['rhombus-definition-condition'], skills: ['state-rhombus-condition'], sourceConcepts: ['rhombus-definition'],
    options: [
      optionText('q01-a', 'تساوي طولَي ضلعين متجاورين'),
      optionText('q01-b', 'تساوي طولَي ضلعين متقابلين'),
      optionText('q01-c', 'وجود زاوية قائمة واحدة على الأقلّ'),
      optionText('q01-d', 'تساوي قياسَي زاويتين متقابلتين'),
    ],
    answer: 'q01-a',
    solution: {
      idea: rich(text('المعيّن متوازي أضلاع أضيف إليه شرط واحد يخصّ الأطوال.')),
      rule: rich(text('إذا تساوى طولا ضلعين متجاورين في متوازي الأضلاع كان معيّناً.')),
      steps: [
        rich(text('تساوي الضلعين المتقابلين وتساوي الزاويتين المتقابلتين متحقّقان في كلّ متوازي أضلاع، فلا يميّزان المعيّن.')),
        rich(text('الزاوية القائمة تعطي مستطيلاً لا معيّناً.')),
        rich(text('يبقى الشرط المميّز: تساوي ضلعين متجاورين، وعندها تتساوى الأضلاع الأربعة.')),
      ],
      finalAnswer: rich(text('تساوي طولَي ضلعين متجاورين.')),
    },
    originalityNote: 'يقابل الشرط المميّز للمعيّن بثلاثة شروط متحقّقة أصلاً في كل متوازي أضلاع أو خاصّة بالمستطيل، ولا ينقل صياغة التعريف المطبوع في ص 36.',
  }),
  q(2, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('أضلاع المعيّن الأربعة متساوية في الطول.')),
    concepts: ['rhombus-equal-sides'], skills: ['identify-always-true-properties'], sourceConcepts: ['rhombus-properties'],
    answer: true,
    solution: {
      idea: rich(text('الخاصّة الثالثة للمعيّن تنصّ على تساوي الأضلاع الأربعة.')),
      steps: [
        rich(text('الضلعان المتجاوران متساويان بحسب التعريف.')),
        rich(text('وبخاصّة الأضلاع المتقابلة ينتقل الطول نفسه إلى الضلعين الباقيين.')),
      ],
      finalAnswer: rich(text('صحيح.')),
    },
    originalityNote: 'عبارة صواب/خطأ مباشرة عن الخاصّة الثالثة بصياغة مستقلّة عن بطاقة الخواصّ، وتُستعمل لاحقاً أساساً لأسئلة المحيط في هذا الاختبار.',
  }),
  q(3, {
    type: 'numeric', difficulty: 'basic',
    prompt: rich(text('لوحة إعلانية على شكل معيّن طول ضلعها '), math('9 cm'), text('. كم يساوي محيطها؟')),
    concepts: ['rhombus-perimeter', 'rhombus-equal-sides'], skills: ['compute-perimeter-from-equal-sides'], sourceConcepts: ['rhombus-properties'],
    coverage: { applications: ['frame-and-perimeter-problems'] },
    answer: { expected: '36', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('المحيط مجموع أطوال الأضلاع، وأضلاع المعيّن متساوية.')),
      rule: rich(text('محيط المعيّن '), math('= 4 × طول الضلع')),
      steps: [
        rich(text('الأضلاع الأربعة تساوي '), math('9 cm'), text(' لكلٍّ منها.')),
        rich(math('9 + 9 + 9 + 9 = 36'), text('، أو اختصاراً '), math('4 × 9 = 36'), text('.')),
      ],
      finalAnswer: rich(math('36 cm')),
      commonError: rich(text('جمع ضلعين فقط فينتج '), math('18 cm'), text('.')),
    },
    originalityNote: 'تطبيق واقعي على لوحة إعلانية بطول ضلع جديد، وصياغته تختلف عن سؤال المحيط في الاختبار الختامي داخل الدرس.',
  }),
  q(4, {
    type: 'matching', difficulty: 'basic',
    prompt: rich(text('طابق كلّ وصف مع الاسم الأدقّ للشكل الذي يحقّقه.')),
    concepts: ['quadrilateral-naming'], skills: ['match-description-to-shape-name'], sourceConcepts: ['naming-quadrilaterals'],
    left: [
      optionText('q04-l1', 'أضلاعه الأربعة متساوية وزواياه غير قائمة'),
      optionText('q04-l2', 'أضلاعه الأربعة متساوية وزواياه قائمة'),
      optionText('q04-l3', 'زواياه قائمة وضلعاه المتجاوران مختلفان في الطول'),
    ],
    right: [optionText('q04-r1', 'مستطيل غير مربّع'), optionText('q04-r2', 'معيّن غير مربّع'), optionText('q04-r3', 'مربّع')],
    answer: [
      { leftId: 'q04-l1', rightId: 'q04-r2' },
      { leftId: 'q04-l2', rightId: 'q04-r3' },
      { leftId: 'q04-l3', rightId: 'q04-r1' },
    ],
    solution: {
      idea: rich(text('الاسم يتحدّد باجتماع شرطين: الأطوال والزوايا.')),
      steps: [
        rich(text('أضلاع متساوية بلا زوايا قائمة ⇐ معيّن غير مربّع.')),
        rich(text('أضلاع متساوية مع زوايا قائمة ⇐ مربّع.')),
        rich(text('زوايا قائمة مع ضلعين متجاورين مختلفين ⇐ مستطيل غير مربّع.')),
      ],
      finalAnswer: rich(text('معيّن غير مربّع، ثمّ مربّع، ثمّ مستطيل غير مربّع.')),
    },
    originalityNote: 'يطابق أوصافاً لفظية بأسماء دقيقة تشمل حالتي «غير مربّع»، ولا يعيد تمرين كتابة الأسماء الستّة في ص 39.',
  }),
  q(5, {
    type: 'multi-select', difficulty: 'basic',
    prompt: rich(text('في المعيّن '), math('ABCD'), text('، اختر كلّ عبارة صحيحة دائماً.')),
    concepts: ['rhombus-equal-sides', 'rhombus-opposite-angles', 'rhombus-definition-condition'],
    skills: ['identify-always-true-properties'], sourceConcepts: ['rhombus-properties', 'rhombus-definition'],
    options: [
      option('q05-a', math('AB ∥ CD')),
      option('q05-b', math('AB = BC')),
      option('q05-c', math('Â = Ĉ')),
      option('q05-d', math('Â = B̂')),
      optionText('q05-e', 'زواياه الأربع قائمة'),
    ],
    answer: ['q05-a', 'q05-b', 'q05-c'],
    solution: {
      idea: rich(text('نفصل بين ما تضمنه خواصّ المعيّن وما لا تضمنه.')),
      steps: [
        rich(text('توازي الأضلاع المتقابلة وتساوي الأضلاع الأربعة وتساوي الزوايا المتقابلة: خواصّ مضمونة.')),
        rich(math('Â = B̂'), text(' غير مضمونة؛ الزاويتان متتاليتان ومجموعهما '), math('180°'), text('.')),
        rich(text('الزوايا القائمة ليست خاصّة للمعيّن إلّا إذا كان مربّعاً.')),
      ],
      finalAnswer: rich(text('العبارات الثلاث الأولى صحيحة.')),
      commonError: rich(text('اختيار «الزوايا قائمة» لأنّ الشكل يبدو منتظماً.')),
    },
    originalityNote: 'يفرز ثلاث خواصّ مضمونة من مغالطتين شائعتين (زاويتان متتاليتان، زوايا قائمة) في شكل مسمّى جديد.',
  }),
  q(6, {
    type: 'true-false', difficulty: 'basic',
    prompt: rich(text('إذا تأكّدنا أنّ الشكل متوازي أضلاع، فإنّ قياس ضلعين متجاورين فيه يكفي للحكم بأنه معيّن أو لا.')),
    concepts: ['rhombus-definition-condition'], skills: ['decide-with-two-measurements'],
    sourceConcepts: ['start-activity-classification', 'rhombus-definition'],
    answer: true,
    solution: {
      idea: rich(text('خاصّة الأضلاع المتقابلة تجعل قياسين كافيين.')),
      steps: [
        rich(text('في متوازي الأضلاع كلّ ضلع يساوي مقابله، فالأطوال الأربعة تتحدّد بقياسين متجاورين.')),
        rich(text('إذا تساوى القياسان فالأضلاع الأربعة متساوية ⇐ معيّن؛ وإذا اختلفا فليس معيّناً.')),
      ],
      finalAnswer: rich(text('صحيح.')),
    },
    originalityNote: 'يحوّل خطوة القياس في الانطلاقة النشطة إلى حكم عام عن كفاية قياسين، لا إلى تحديد أشكال مرقّمة بعينها.',
  }),
  q(7, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('في المعيّن '), math('PQRS'), text(' قياس الزاوية '), math('Q̂ = 115°'), text('. ما قياس الزاوية '), math('R̂'), text('؟')),
    concepts: ['consecutive-angles-sum'], skills: ['find-angle-from-consecutive-pair'], sourceConcepts: ['angle-properties-application'],
    answer: { expected: '65', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: DEGREE_UNITS } },
    solution: {
      idea: rich(text('الرأسان '), math('Q'), text(' و'), math('R'), text(' متتاليان، لا متقابلان.')),
      rule: rich(text('في متوازي الأضلاع (ومنه المعيّن) مجموع كلّ زاويتين متتاليتين '), math('180°'), text('.')),
      steps: [
        rich(text('نتتبّع الترتيب '), math('P → Q → R → S'), text('؛ '), math('Q'), text(' و'), math('R'), text(' متجاوران.')),
        rich(math('180° − 115° = 65°'), text('.')),
      ],
      finalAnswer: rich(math('65°')),
      commonError: rich(text('إعطاء '), math('115°'), text(' بالخلط بين الزاوية المتتالية والزاوية المتقابلة.')),
    },
    originalityNote: 'يستعمل ترتيب رؤوس جديداً وقيمة زاوية لم ترد في الكتاب، ويطلب الزاوية المتتالية لا المتقابلة.',
  }),
  q(8, {
    type: 'matching', difficulty: 'medium',
    prompt: rich(text('طابق كلّ معلومة مقروءة من الرسم مع الاستنتاج الذي تسمح به وحدها.')),
    concepts: ['quadrilateral-naming', 'rhombus-definition-condition'], skills: ['match-property-to-guaranteeing-shape'],
    sourceConcepts: ['naming-quadrilaterals', 'non-examples'],
    left: [
      optionText('q08-l1', 'زوج واحد فقط من الأضلاع المتوازية'),
      optionText('q08-l2', 'زوجان من الأضلاع المتوازية وضلعان متجاوران متساويان'),
      optionText('q08-l3', 'زوجان من الأضلاع المتوازية وضلعان متجاوران مختلفان'),
    ],
    right: [
      optionText('q08-r1', 'متوازي أضلاع وليس معيّناً'),
      optionText('q08-r2', 'شبه منحرف: ليس متوازي أضلاع ولا معيّناً'),
      optionText('q08-r3', 'معيّن'),
    ],
    answer: [
      { leftId: 'q08-l1', rightId: 'q08-r2' },
      { leftId: 'q08-l2', rightId: 'q08-r3' },
      { leftId: 'q08-l3', rightId: 'q08-r1' },
    ],
    solution: {
      idea: rich(text('نفحص شرط التوازي أوّلاً ثمّ شرط الأطوال.')),
      steps: [
        rich(text('زوج توازٍ واحد ⇐ شبه منحرف، فلا يمكن أن يكون معيّناً.')),
        rich(text('زوجا توازٍ + ضلعان متجاوران متساويان ⇐ تعريف المعيّن متحقّق.')),
        rich(text('زوجا توازٍ + ضلعان متجاوران مختلفان ⇐ متوازي أضلاع فقط.')),
      ],
      finalAnswer: rich(text('شبه منحرف، ثمّ معيّن، ثمّ متوازي أضلاع وليس معيّناً.')),
    },
    originalityNote: 'يربط ثلاث حالات وصفية بالاستنتاج المسموح به، بدل تعليل أشكال مرسومة بعينها كما في تحقّق ① و② ص 37.',
  }),
  q(9, {
    type: 'error-analysis', difficulty: 'medium',
    prompt: rich(text('في المعيّن '), math('ABCD'), text(' المعطى '), math('Â = 60°'), text('. اختر التشخيص والتصحيح لعمل الطالب.')),
    concepts: ['consecutive-angles-sum', 'rhombus-opposite-angles'], skills: ['diagnose-opposite-vs-consecutive-angle'],
    sourceConcepts: ['angle-properties-application'],
    coverage: { commonErrors: ['confuse-opposite-and-consecutive-angles'] },
    studentWork: rich(math('Â = 60°'), text(' إذن '), math('B̂ = 60°'), text(' لأنّ زوايا المعيّن متساوية')),
    diagnoses: [
      optionText('q09-d1', 'الزاويتان A وB متتاليتان لا متقابلتان، فلا يلزم تساويهما'),
      optionText('q09-d2', 'كلّ زوايا المعيّن متساوية فعلاً، والخطأ في القيمة فقط'),
    ],
    corrections: [option('q09-c1', math('B̂ = 180° − 60° = 120°')), option('q09-c2', math('B̂ = 60°'), text(' لأن '), math('Â'), text(' تقابلها'))],
    answer: { diagnosisId: 'q09-d1', correctionId: 'q09-c1' },
    solution: {
      idea: rich(text('تساوي الزوايا في المعيّن يخصّ المتقابلتين فقط.')),
      steps: [
        rich(text('في الترتيب '), math('A → B → C → D'), text(' تقابل '), math('Â'), text(' الزاوية '), math('Ĉ'), text('، أمّا '), math('B̂'), text(' فمتتالية معها.')),
        rich(text('الزاويتان المتتاليتان مجموعهما '), math('180°'), text('، إذن '), math('B̂ = 120°'), text('.')),
      ],
      finalAnswer: rich(text('التشخيص: خلط المتتالية بالمتقابلة؛ والتصحيح: '), math('B̂ = 120°'), text('.')),
      commonError: rich(text('تعميم «زوايا المعيّن متساوية» على الزوايا الأربع.')),
    },
    originalityNote: 'يعالج خطأ في نوع العلاقة بين زاويتين داخل معيّن، وليس خطأ قياس بالمنقلة كما في أسئلة درس الزوايا.',
  }),
  q(10, {
    type: 'multi-select', difficulty: 'medium',
    prompt: rich(text('اختر كلّ مجموعة معطيات تكفي وحدها لرسم معيّن وحيد.')),
    concepts: ['rhombus-construction-data'], skills: ['select-sufficient-construction-data'], sourceConcepts: ['rhombus-construction'],
    options: [
      option('q10-a', text('طول ضلع واحد وقياس إحدى الزوايا')),
      option('q10-b', text('طول ضلع واحد فقط')),
      option('q10-c', text('قياس إحدى الزوايا فقط')),
      option('q10-d', text('المحيط وقياس إحدى الزوايا')),
    ],
    answer: ['q10-a', 'q10-d'],
    solution: {
      idea: rich(text('الرسم يحتاج طولاً واحداً (لأن الأضلاع متساوية) وزاوية واحدة (لتحديد الميل).')),
      steps: [
        rich(text('طول الضلع وحده يترك الميل حرّاً ⇐ أشكال كثيرة.')),
        rich(text('الزاوية وحدها تترك الحجم حرّاً ⇐ أشكال كثيرة.')),
        rich(text('المحيط يعطي الضلع بالقسمة على '), math('4'), text('، فمع الزاوية تكفي المعطيات.')),
      ],
      finalAnswer: rich(text('المجموعتان: (طول ضلع + زاوية) و(المحيط + زاوية).')),
    },
    originalityNote: 'يقيس كفاية المعطيات بما فيها مدخل المحيط غير الوارد في الكتاب، بدل إعادة تنفيذ مثال الرسم ص 38.',
  }),
  q(11, {
    type: 'ordering', difficulty: 'medium',
    prompt: rich(text('رتّب أعمال رسم معيّن بالمسطرة والمنقلة إذا عُرف طول ضلعه وقياس إحدى زواياه.')),
    concepts: ['rhombus-construction-data'], skills: ['sequence-rhombus-construction'], sourceConcepts: ['rhombus-construction'],
    items: [
      optionText('q11-a', 'عيّن الرأس الثالث على الشعاع الجديد بالطول نفسه'),
      optionText('q11-b', 'ارسم الضلع الأوّل بالطول المعطى'),
      optionText('q11-c', 'أنشئ الزاوية المعطاة عند أحد طرفي الضلع الأوّل'),
      optionText('q11-d', 'ارسم من الرأس الثالث موازياً للضلع الأوّل وعيّن الرأس الرابع بالطول نفسه'),
      optionText('q11-e', 'أغلق الشكل بالضلع الأخير ثمّ تحقّق بالقياس من تساوي الأضلاع الأربعة'),
    ],
    answer: ['q11-b', 'q11-c', 'q11-a', 'q11-d', 'q11-e'],
    solution: {
      idea: rich(text('ترتيب الرسم يتبع منطق المعطيات: طول ثمّ زاوية ثمّ تكرار الطول نفسه.')),
      steps: [
        rich(text('نبدأ بالضلع الأوّل لأنه مرجع الأطوال كلّها.')),
        rich(text('الزاوية تحدّد اتجاه الضلع المجاور، ثمّ نضع عليه الطول نفسه.')),
        rich(text('التوازي يكمل الشكل، والقياس في النهاية هو خطوة التحقّق لا زينة.')),
      ],
      finalAnswer: rich(text('ضلع أوّل ← زاوية ← رأس ثالث ← موازٍ ورأس رابع ← إغلاق وتحقّق.')),
    },
    originalityNote: 'يصوغ الخطوات بعبارات عامّة من دون أرقام مثال الكتاب (3cm و45°)، ويضيف خطوة التحقّق بالقياس ضمن الترتيب.',
  }),
  q(12, {
    type: 'numeric', difficulty: 'medium',
    prompt: rich(text('أراد حدّاد صنع إطار على شكل معيّن محيطه '), math('52 cm'), text(' من قضيب واحد. كم يبلغ طول كلّ ضلع من أضلاع الإطار؟')),
    concepts: ['rhombus-perimeter'], skills: ['find-side-from-perimeter'], sourceConcepts: ['rhombus-properties'],
    coverage: { applications: ['frame-and-perimeter-problems'] },
    answer: { expected: '13', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('المحيط موزّع بالتساوي على أربعة أضلاع.')),
      rule: rich(text('طول الضلع '), math('= المحيط ÷ 4')),
      steps: [
        rich(math('52 ÷ 4 = 13'), text('.')),
        rich(text('التحقّق: '), math('13 + 13 + 13 + 13 = 52'), text('.')),
      ],
      finalAnswer: rich(math('13 cm')),
      commonError: rich(text('القسمة على '), math('2'), text(' كما في محيط المستطيل فينتج '), math('26 cm'), text('.')),
    },
    originalityNote: 'موقف مهني بقيمة محيط جديدة تُقسم على أربعة، وصياغته تختلف عن سؤال «المحيط ← الضلع» في الاختبار الختامي للدرس.',
  }),
  q(13, {
    type: 'single-choice', difficulty: 'medium',
    prompt: rich(text('أيّ عبارة تصف العلاقة بين المعيّن ومتوازي الأضلاع وصفاً دقيقاً؟')),
    concepts: ['rhombus-vs-parallelogram-family'], skills: ['relate-rhombus-to-parallelogram'],
    sourceConcepts: ['rhombus-definition', 'non-examples'],
    options: [
      optionText('q13-a', 'كلّ معيّن متوازي أضلاع، وليس كلّ متوازي أضلاع معيّناً'),
      optionText('q13-b', 'كلّ متوازي أضلاع معيّن، وليس كلّ معيّن متوازي أضلاع'),
      optionText('q13-c', 'الاسمان يدلّان على الشكل نفسه تماماً'),
      optionText('q13-d', 'لا يمكن أن يكون الشكل معيّناً ومتوازي أضلاع في آن واحد'),
    ],
    answer: 'q13-a',
    solution: {
      idea: rich(text('المعيّن حالة خاصّة داخل عائلة متوازيات الأضلاع.')),
      steps: [
        rich(text('تعريف المعيّن ينطلق من متوازي أضلاع، فكلّ معيّن متوازي أضلاع.')),
        rich(text('المستطيل غير المربّع متوازي أضلاع وليس معيّناً، فالعكس غير صحيح.')),
      ],
      finalAnswer: rich(text('كلّ معيّن متوازي أضلاع، وليس كلّ متوازي أضلاع معيّناً.')),
    },
    originalityNote: 'يختبر اتجاه الاحتواء بين العائلتين بمثال مضادّ ضمني (المستطيل)، ولا يعيد سؤال تسمية شكل مرسوم.',
  }),
  q(14, {
    type: 'numeric', difficulty: 'advanced',
    prompt: rich(text('معيّن ومستطيل لهما المحيط نفسه، وبُعدا المستطيل '), math('11 cm'), text(' و'), math('5 cm'), text('. ما طول ضلع المعيّن؟')),
    concepts: ['rhombus-perimeter', 'quadrilateral-naming'], skills: ['derive-side-from-equal-perimeters'],
    sourceConcepts: ['rhombus-properties'],
    coverage: { applications: ['frame-and-perimeter-problems'] },
    answer: { expected: '8', format: 'integer', unitPolicy: { kind: 'required', acceptedUnits: CM_UNITS } },
    solution: {
      idea: rich(text('نحسب محيط المستطيل أوّلاً ثمّ نوزّعه على أضلاع المعيّن الأربعة المتساوية.')),
      steps: [
        rich(text('محيط المستطيل '), math('2 × (11 + 5) = 32 cm'), text('.')),
        rich(text('المحيطان متساويان، إذن محيط المعيّن '), math('32 cm'), text('.')),
        rich(math('32 ÷ 4 = 8'), text('.')),
      ],
      finalAnswer: rich(math('8 cm')),
      commonError: rich(text('أخذ متوسط البعدين '), math('(11 + 5) ÷ 2 = 8'), text(' مصادفةً من دون المرور بالمحيط، وهي طريقة لا تصحّ عند تغيير الأبعاد.')),
    },
    originalityNote: 'يجمع محيط المستطيل من درس سابق مع خاصّة تساوي أضلاع المعيّن بأبعاد جديدة، وينبّه إلى صدفة عددية مضلّلة.',
  }),
  q(15, {
    type: 'error-analysis', difficulty: 'advanced',
    prompt: rich(text('قاس طالب ضلعين متقابلين في متوازي أضلاع فوجد كلّاً منهما '), math('6 cm'), text('، فحكم بأنّ الشكل معيّن. اختر التشخيص والتصحيح.')),
    concepts: ['rhombus-definition-condition'], skills: ['diagnose-opposite-sides-evidence'],
    sourceConcepts: ['non-examples', 'worked-example-equal-sides'],
    coverage: { commonErrors: ['accept-opposite-sides-as-rhombus-evidence'] },
    studentWork: rich(text('الضلعان المتقابلان '), math('6 cm'), text(' و'), math('6 cm'), text(' ⇐ الشكل معيّن')),
    diagnoses: [
      optionText('q15-d1', 'تساوي الضلعين المتقابلين متحقّق في كلّ متوازي أضلاع، فلا يثبت شيئاً إضافياً'),
      optionText('q15-d2', 'القياس غير دقيق، والخطأ في المسطرة لا في الاستنتاج'),
    ],
    corrections: [
      optionText('q15-c1', 'يقيس ضلعين متجاورين، فإن تساويا فالشكل معيّن'),
      optionText('q15-c2', 'يقيس الضلعين المتقابلين الآخرين للتأكّد'),
    ],
    answer: { diagnosisId: 'q15-d1', correctionId: 'q15-c1' },
    solution: {
      idea: rich(text('الدليل يجب أن يميّز المعيّن عن بقية متوازيات الأضلاع.')),
      steps: [
        rich(text('في كلّ متوازي أضلاع الضلعان المتقابلان متساويان، فالمستطيل أيضاً يحقّق ما قاسه الطالب.')),
        rich(text('الشرط المميّز هو تساوي ضلعين متجاورين، وهو ما لم يُقس.')),
        rich(text('التصحيح: قياس ضلعين متجاورين؛ فإن تساويا فالأضلاع الأربعة متساوية والشكل معيّن.')),
      ],
      finalAnswer: rich(text('التشخيص: دليل غير مميّز؛ والتصحيح: قياس ضلعين متجاورين.')),
      commonError: rich(text('الاكتفاء بدليل متحقّق في كلّ الحالات.')),
    },
    originalityNote: 'يحلّل كفاية الدليل لا صحّة الحساب، وهو موقف قياس جديد لا يرد في أمثلة ص 37 المضادّة.',
  }),
  q(16, {
    type: 'multi-select', difficulty: 'advanced',
    prompt: rich(text('معيّن قياس إحدى زواياه '), math('120°'), text('. اختر كلّ استنتاج صحيح.')),
    concepts: ['rhombus-opposite-angles', 'consecutive-angles-sum'], skills: ['infer-all-angles-from-one'],
    sourceConcepts: ['angle-properties-application', 'rhombus-properties'],
    options: [
      option('q16-a', text('الزاوية المقابلة لها '), math('120°')),
      option('q16-b', text('الزاويتان الأخريان '), math('60°'), text(' لكلٍّ منهما')),
      option('q16-c', text('مجموع زواياه الأربع '), math('360°')),
      optionText('q16-d', 'الشكل مستطيل'),
      optionText('q16-e', 'ضلعان متجاوران فيه مختلفان في الطول'),
    ],
    answer: ['q16-a', 'q16-b', 'q16-c'],
    solution: {
      idea: rich(text('زاوية واحدة تكفي لتحديد الزوايا الأربع في المعيّن.')),
      steps: [
        rich(text('الزاوية المقابلة تساويها: '), math('120°'), text('.')),
        rich(text('كلّ زاوية متتالية معها '), math('180° − 120° = 60°'), text('، وهما زاويتان.')),
        rich(math('120 + 60 + 120 + 60 = 360'), text('، وهو مجموع زوايا أي رباعي.')),
        rich(text('الزوايا ليست قائمة ⇐ ليس مستطيلاً، وأضلاع المعيّن متساوية دائماً.')),
      ],
      finalAnswer: rich(text('الاستنتاجات الثلاثة الأولى صحيحة.')),
    },
    originalityNote: 'يبني شبكة الزوايا الأربع من زاوية واحدة ويضيف مشتّتَين يخلطان بين عائلات الأشكال وخاصّة الأضلاع.',
  }),
  q(17, {
    type: 'single-choice', difficulty: 'advanced',
    prompt: rich(text('رُسمت ثلاثة رؤوس متتالية لمعيّن: '), math('M'), text(' ثمّ '), math('N'), text(' ثمّ '), math('P'), text('، وقيس فوُجد '), math('NM = NP'), text('. ما الطريقة الصحيحة لتعيين الرأس الرابع '), math('Q'), text('؟')),
    concepts: ['fourth-vertex-construction'], skills: ['locate-fourth-vertex-by-parallels'], sourceConcepts: ['fourth-vertex-and-composite'],
    options: [
      option('q17-a', text('من '), math('P'), text(' ارسم موازياً لـ'), math('[NM]'), text(' بطول '), math('NM'), text('، ومن '), math('M'), text(' موازياً لـ'), math('[NP]'), text(' بطول '), math('NP'), text('؛ تقاطعهما هو '), math('Q')),
      option('q17-b', text('ضع '), math('Q'), text(' في منتصف القطعة '), math('[MP]')),
      option('q17-c', text('ارسم من '), math('P'), text(' مستقيماً عمودياً على '), math('[NP]'), text(' وخذ عليه أيّ نقطة')),
      optionText('q17-d', 'اختر أيّ نقطة تجعل الخطّ مغلقاً'),
    ],
    answer: 'q17-a',
    solution: {
      idea: rich(text('الرأس الرابع يقابل '), math('N'), text('، ويتحدّد بتقاطع موازيين بطولين معلومين.')),
      rule: rich(text('في المعيّن كلّ ضلعين متقابلين متوازيان ومتساويان، والأضلاع الأربعة متساوية.')),
      steps: [
        rich(math('[PQ]'), text(' يقابل '), math('[NM]'), text('، إذن '), math('PQ ∥ NM'), text(' و'), math('PQ = NM'), text('.')),
        rich(math('[MQ]'), text(' يقابل '), math('[NP]'), text('، إذن '), math('MQ ∥ NP'), text(' و'), math('MQ = NP'), text('.')),
        rich(text('تقاطع الموازيين يعطي نقطة وحيدة هي '), math('Q'), text('، والأضلاع الأربعة تصبح متساوية لأنّ '), math('NM = NP'), text('.')),
      ],
      finalAnswer: rich(text('الخيار الأوّل: تقاطع الموازي لـ'), math('[NM]'), text(' من '), math('P'), text(' مع الموازي لـ'), math('[NP]'), text(' من '), math('M'), text('.')),
      commonError: rich(text('وضع '), math('Q'), text(' على منتصف '), math('[MP]'), text('، فينهار الشكل إلى قطعة.')),
    },
    originalityNote: 'ينقل بناء الرأس الرابع إلى تسمية رؤوس جديدة ويقابله بثلاث طرائق خاطئة، بدل إعادة سؤال الشكل المرسوم في تدرّب ② ص 39.',
  }),
  q(18, {
    type: 'single-choice', difficulty: 'thinking',
    prompt: rich(text('إطار من أربعة أعواد متساوية مثبّتة بمفاصل عند الرؤوس. دفعنا الإطار فتغيّرت فتحته من دون أن ينفكّ أيّ مفصل. ما الوصف الصحيح لما حدث؟')),
    concepts: ['rhombus-definition-condition', 'rhombus-equal-sides'], skills: ['reason-about-flexible-frame'],
    sourceConcepts: ['rhombus-definition', 'rhombus-properties'],
    coverage: { thinking: ['reason-about-invariants'], applications: ['frame-and-perimeter-problems'] },
    options: [
      optionText('q18-a', 'تغيّرت الزوايا وبقيت الأضلاع الأربعة متساوية، فبقي الشكل معيّناً'),
      optionText('q18-b', 'تغيّرت أطوال الأعواد وبقيت الزوايا كما هي'),
      optionText('q18-c', 'صار الإطار مستطيلاً لأنّ شكله تغيّر'),
      optionText('q18-d', 'لم يعد الإطار متوازي أضلاع بعد تغيّر الفتحة'),
    ],
    answer: 'q18-a',
    solution: {
      idea: rich(text('نفصل ما يتغيّر (الزوايا) عمّا لا يتغيّر (الأطوال).')),
      steps: [
        rich(text('الأعواد جامدة، فأطوال الأضلاع لا تتغيّر وتبقى متساوية.')),
        rich(text('شرط المعيّن يخصّ الأطوال لا الزوايا، فيبقى الشكل معيّناً مهما تغيّرت الفتحة.')),
        rich(text('يصير مربّعاً في وضع خاصّ واحد فقط: حين تصبح الزوايا قائمة.')),
      ],
      finalAnswer: rich(text('تغيّرت الزوايا وحدها، وبقي الشكل معيّناً.')),
      commonError: rich(text('الاعتقاد أنّ تغيّر المنظر يغيّر نوع الشكل.')),
    },
    originalityNote: 'موقف مادّي بالمفاصل يفصل الثوابت عن المتغيّرات، وهو نمط تفكير لا يرد في صفحات الدرس ولا في اختباره الختامي.',
  }),
  q(19, {
    type: 'multi-select', difficulty: 'thinking',
    prompt: rich(text('معيّن محيطه '), math('44 cm'), text(' وإحدى زواياه '), math('100°'), text('. اختر كلّ استنتاج تدعمه هذه المعطيات.')),
    concepts: ['rhombus-perimeter', 'rhombus-opposite-angles', 'consecutive-angles-sum'],
    skills: ['combine-perimeter-and-angle-facts'], sourceConcepts: ['rhombus-properties', 'angle-properties-application'],
    coverage: { thinking: ['combine-two-facts'] },
    options: [
      option('q19-a', text('طول ضلعه '), math('11 cm')),
      option('q19-b', text('زاويته المقابلة '), math('100°')),
      option('q19-c', text('زاويتاه الأخريان '), math('80°'), text(' لكلٍّ منهما')),
      optionText('q19-d', 'يمكن أن يكون مربّعاً'),
      optionText('q19-e', 'ضلعاه المتجاوران مختلفان في الطول'),
    ],
    answer: ['q19-a', 'q19-b', 'q19-c'],
    solution: {
      idea: rich(text('المعطيان مستقلّان: المحيط يعطي الأطوال، والزاوية تعطي الزوايا.')),
      steps: [
        rich(math('44 ÷ 4 = 11'), text('، إذن الضلع '), math('11 cm'), text('.')),
        rich(text('الزاوية المقابلة تساويها '), math('100°'), text('، والمتتاليتان '), math('180° − 100° = 80°'), text('.')),
        rich(text('وجود زاوية '), math('100°'), text(' ينفي أن يكون مربّعاً، وتساوي أضلاع المعيّن ينفي اختلاف المتجاورين.')),
      ],
      finalAnswer: rich(text('الاستنتاجات الثلاثة الأولى صحيحة فقط.')),
    },
    originalityNote: 'يدمج معطى محيط ومعطى زاوية في سؤال واحد ويطلب تمييز ما تدعمه المعطيات فعلاً عمّا يبدو معقولاً.',
  }),
  q(20, {
    type: 'error-analysis', difficulty: 'thinking',
    prompt: rich(text('شكل أضلاعه الأربعة متساوية وزواياه قائمة. اختر التشخيص والتصحيح لتسمية الطالب.')),
    concepts: ['quadrilateral-naming', 'rhombus-vs-parallelogram-family'], skills: ['name-shape-by-all-properties'],
    sourceConcepts: ['naming-quadrilaterals'],
    coverage: { thinking: ['judge-naming-completeness'], commonErrors: ['exclude-square-from-rhombus-family'] },
    studentWork: rich(text('هذا الشكل معيّن فقط، ولا يصحّ أن نسمّيه مربّعاً')),
    diagnoses: [
      optionText('q20-d1', 'التسمية ناقصة: الشكل يحقّق شروط المعيّن وشروط المربّع معاً'),
      optionText('q20-d2', 'التسمية صحيحة: المربّع لا يُعدّ معيّناً أبداً'),
    ],
    corrections: [
      optionText('q20-c1', 'يُسمّى مربّعاً، وهو في الوقت نفسه معيّن ومستطيل'),
      optionText('q20-c2', 'يُسمّى مستطيلاً فقط لأنّ زواياه قائمة'),
    ],
    answer: { diagnosisId: 'q20-d1', correctionId: 'q20-c1' },
    solution: {
      idea: rich(text('الاسم الأدقّ يجمع كلّ الخواصّ المتحقّقة، ولا يلغي الأسماء الأعمّ.')),
      steps: [
        rich(text('أضلاع متساوية ⇐ معيّن.')),
        rich(text('زوايا قائمة ⇐ مستطيل.')),
        rich(text('اجتماع الشرطين ⇐ مربّع؛ والمربّع يبقى معيّناً ومستطيلاً في الوقت نفسه.')),
      ],
      finalAnswer: rich(text('التشخيص: تسمية ناقصة؛ والتصحيح: مربّع، وهو معيّن ومستطيل أيضاً.')),
      commonError: rich(text('اعتبار الأسماء متنافية بدل كونها متداخلة.')),
    },
    originalityNote: 'يقوّم اكتمال التسمية لا صحّتها، ويعالج الاعتقاد بأن أسماء الأشكال الرباعية يستبعد بعضها بعضاً.',
  }),
]

const definition = defineLessonTest({
  id: testId,
  lessonId,
  title: 'اختبار المعيّن',
  description: textOnly('عشرون سؤالاً جديداً على درس المعيّن: التعريف، الخواصّ الثلاث، الرسم، تسمية الأشكال، وتعيين الرأس الرابع.'),
  instructions: textOnly('أجب عن الأسئلة العشرين. لا تظهر أيّ نتيجة أثناء المحاولة؛ تُعرض النتيجة والحلول بعد التسليم في منطقة الحلول.'),
  questions,
  sourceConcepts: [
    { id: 'rhombus-definition', label: 'تعريف المعيّن: متوازي أضلاع تساوى فيه طولا ضلعين متجاورين', pages: [36] },
    { id: 'start-activity-classification', label: 'فرز الأشكال: التوازي أوّلاً ثمّ قياس الأضلاع بالمسطرة', pages: [36] },
    { id: 'worked-example-equal-sides', label: 'مثال الكتاب: من تساوي ضلعين متجاورين إلى تساوي الأضلاع الأربعة', pages: [36] },
    { id: 'non-examples', label: 'أمثلة مضادّة: متوازي أضلاع غير معيّن، شبه منحرف، شكل بلا توازٍ', pages: [37] },
    { id: 'rhombus-properties', label: 'خواصّ المعيّن الثلاث، ومنها تساوي الأضلاع الأربعة', pages: [37] },
    { id: 'angle-properties-application', label: 'تطبيق تساوي الزوايا المتقابلة ومجموع المتتاليتين على المعيّن', pages: [37] },
    { id: 'rhombus-construction', label: 'رسم المعيّن من طول ضلع وقياس زاوية بالمسطرة والمنقلة', pages: [38, 39] },
    { id: 'naming-quadrilaterals', label: 'كتابة جميع الأسماء المناسبة للشكل: رباعي، متوازي أضلاع، مستطيل، معيّن', pages: [39] },
    { id: 'fourth-vertex-and-composite', label: 'تعيين الرأس الرابع بالتوازي والتساوي في شكل ناقص', pages: [39] },
  ],
  conceptLabels: {
    'rhombus-definition-condition': 'شرط التعريف: تساوي ضلعين متجاورين في متوازي أضلاع',
    'rhombus-equal-sides': 'تساوي أضلاع المعيّن الأربعة',
    'rhombus-opposite-angles': 'تساوي الزاويتين المتقابلتين في المعيّن',
    'consecutive-angles-sum': 'مجموع الزاويتين المتتاليتين يساوي 180°',
    'rhombus-vs-parallelogram-family': 'موقع المعيّن داخل عائلة متوازيات الأضلاع',
    'rhombus-perimeter': 'محيط المعيّن من طول ضلع واحد',
    'rhombus-construction-data': 'المعطيات الكافية لرسم معيّن وحيد',
    'quadrilateral-naming': 'تسمية الأشكال الرباعية بكلّ الأسماء المناسبة',
    'fourth-vertex-construction': 'تعيين الرأس الرابع بالتوازي والتساوي',
  },
  skillLabels: {
    'state-rhombus-condition': 'ذكر الشرط المميّز للمعيّن بدقّة',
    'identify-always-true-properties': 'تمييز الخواصّ المضمونة من غير المضمونة',
    'compute-perimeter-from-equal-sides': 'حساب المحيط من تساوي الأضلاع',
    'match-description-to-shape-name': 'مطابقة وصف الخواصّ بالاسم الأدقّ',
    'decide-with-two-measurements': 'الحكم على الشكل بقياسين فقط',
    'find-angle-from-consecutive-pair': 'إيجاد زاوية متتالية من زاوية معلومة',
    'match-property-to-guaranteeing-shape': 'ربط المعلومة المقروءة بالاستنتاج المسموح به',
    'diagnose-opposite-vs-consecutive-angle': 'كشف الخلط بين الزاوية المتقابلة والمتتالية',
    'select-sufficient-construction-data': 'تقدير كفاية معطيات الرسم',
    'sequence-rhombus-construction': 'ترتيب خطوات رسم المعيّن والتحقّق منه',
    'find-side-from-perimeter': 'إيجاد الضلع من المحيط بالقسمة على أربعة',
    'relate-rhombus-to-parallelogram': 'تحديد اتجاه الاحتواء بين المعيّن ومتوازي الأضلاع',
    'derive-side-from-equal-perimeters': 'استنتاج ضلع المعيّن من محيط شكل آخر يساويه',
    'diagnose-opposite-sides-evidence': 'الحكم على كفاية الدليل المستعمل',
    'infer-all-angles-from-one': 'استنتاج الزوايا الأربع من زاوية واحدة',
    'locate-fourth-vertex-by-parallels': 'تعيين الرأس الرابع بتقاطع موازيين',
    'reason-about-flexible-frame': 'تمييز الثوابت عن المتغيّرات في إطار مفصلي',
    'combine-perimeter-and-angle-facts': 'دمج معطى المحيط مع معطى الزاوية',
    'name-shape-by-all-properties': 'تسمية الشكل بكلّ خواصّه المتحقّقة',
  },
  applicationLabels: {
    'frame-and-perimeter-problems': 'مسائل الأطر والمحيط في الحياة اليومية',
  },
  thinkingLabels: {
    'reason-about-invariants': 'تمييز ما يبقى ثابتاً عند تغيّر الشكل',
    'combine-two-facts': 'دمج معطيين مستقلّين في استنتاج واحد',
    'judge-naming-completeness': 'تقويم اكتمال التسمية لا صحّتها فقط',
  },
  commonErrorLabels: {
    'confuse-opposite-and-consecutive-angles': 'الخلط بين الزاويتين المتقابلتين والمتتاليتين',
    'accept-opposite-sides-as-rhombus-evidence': 'قبول تساوي الضلعين المتقابلين دليلاً على المعيّن',
    'exclude-square-from-rhombus-family': 'استبعاد المربّع من عائلة المعيّنات',
  },
})

export default definition
