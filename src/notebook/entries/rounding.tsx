import { MathExpression } from '../../components/MathExpression'
import { ProportionalNumberLine } from '../../lessons/RoundingLesson'
import { roundingBookFacts, roundingBookTasks, type RoundingBookTask } from '../../lessons/roundingData'
import { getRoundingBookAnswer } from '../../teacher/lesson4'
import type { NotebookDoc } from '../types'

/**
 * «دفتر الطالب» — الدرس الرابع: تقريب الأعداد الطبيعية (الكتاب ص 15–18).
 *
 * Sources: `src/lessons/RoundingLesson.tsx` (the printed «قاعدة التقريب» box ص 15 and the
 * three-step worked solution for 2137 ص 16), `src/lessons/roundingData.ts` (every printed task
 * with its number-line geometry) and `src/teacher/lesson4.ts` (`getRoundingBookAnswer`, the book
 * answer key). Prompts, number lines and answers are read from those modules, never retyped, so
 * the notebook cannot drift from the book.
 */
const task = (id: string): RoundingBookTask => {
  const found = roundingBookTasks.find(candidate => candidate.id === id)
  if (!found) throw new Error(`missing rounding task: ${id}`)
  return found
}

/** The book answer for a task, exactly as the answer key stores it. */
const key = (id: string): string => {
  const value = getRoundingBookAnswer(id)
  if (!value) throw new Error(`missing lesson 4 answer key entry: ${id}`)
  return typeof value === 'string' ? value : value.join(' أو ')
}

const num = (value: string, cellKey: string) => <MathExpression key={cellKey}>{value}</MathExpression>

/** A drill row: the number as printed in the book, the required place, and the keyed answer. */
const drillRow = (id: string, operand: string, place: string) => [num(operand, `${id}-operand`), place, num(key(id), `${id}-answer`)]

export function roundingNotebook(): NotebookDoc {
  return {
    lessonId: 'rounding-natural-numbers',
    lessonTitle: 'تقريب الأعداد الطبيعية',
    unit: 'الوحدة الأولى',
    pages: 'ص 15–18',
    theme: 'lesson-four',
    sections: [
      {
        id: 'l4-rule',
        title: 'المفردات والقاعدة',
        blocks: [
          {
            kind: 'definition', id: 'l4-def-rounding', term: 'تقريب عدد',
            text: <>أن نستبدل بالعدد عدداً آخر قريباً منه يسهل استعماله والتعبير عنه، وهو مضاعف للمنزلة المطلوبة: فأقرب مئة يعني <MathExpression>100، 200، 300، …</MathExpression> وأقرب ألف يعني <MathExpression>1000، 2000، 3000، …</MathExpression> وأقرب مليون يعني <MathExpression>1000000، 2000000، …</MathExpression></>,
            source: 'الكتاب · ص 15',
          },
          {
            kind: 'definition', id: 'l4-def-place', term: 'منزلة التقريب (المنزلة المطلوبة)',
            text: <>هي المنزلة التي نقرّب إليها. في «تقريب <MathExpression>2137</MathExpression> إلى أقرب ألف» منزلة التقريب هي آحاد الألوف، وفي «التقريب إلى أقرب مئة ألف» منزلة التقريب هي مئات الألوف.</>,
            source: 'الكتاب · ص 16 (خطوات تقريب 2137)',
          },
          {
            kind: 'definition', id: 'l4-def-neighbour', term: 'الرقم المجاور (الرقم الذي على يمين المنزلة المطلوبة)',
            text: <>هو الرقم الذي نفحصه لنقرر: إذا كان <MathExpression>5</MathExpression> أو أكبر نزيد المنزلة المطلوبة واحداً، وإذا كان أقل من <MathExpression>5</MathExpression> نبقيها كما هي.</>,
            source: 'الكتاب · ص 15 (قاعدة التقريب)',
          },
          {
            kind: 'definition', id: 'l4-def-zeroing', term: 'التصفير',
            text: <>أن نجعل كل الخانات إلى يمين منزلة التقريب أصفاراً. فبعد تقريب <MathExpression>2137</MathExpression> إلى أقرب ألف نصفر المئات والعشرات والآحاد، فيكون الناتج <MathExpression>2000</MathExpression>.</>,
            source: 'الكتاب · ص 16',
          },
          {
            kind: 'rule', id: 'l4-rule-rounding', title: 'قاعدة التقريب',
            text: 'نحدد المنزلة المطلوبة، ثم نفحص الرقم الذي على يمينها مباشرة. إذا كان 5 أو أكبر نزيد المنزلة واحداً، وإذا كان أقل من 5 نبقيها، ثم نجعل الخانات إلى يمينها أصفاراً.',
          },
          {
            kind: 'rule', id: 'l4-rule-meaning', title: 'معنى «إلى أقرب مئة» و«إلى أقرب ألف» و«إلى أقرب مليون»',
            text: <>نعني اختيار العدد المضاعف للمنزلة المطلوبة والأقرب إلى العدد المعطى. فمثلاً تقريب <MathExpression>580</MathExpression> إلى أقرب مئة يعني أن نختار على مستقيم الأعداد الأقرب من <MathExpression>500</MathExpression> أو <MathExpression>600</MathExpression>، وتقريب <MathExpression>2137</MathExpression> إلى أقرب ألف يعني أن نختار الأقرب من <MathExpression>2000</MathExpression> أو <MathExpression>3000</MathExpression>.</>,
          },
          {
            kind: 'text', id: 'l4-facts',
            text: <>معلومتان من ص 15 تُستعملان في تمارين التقريب: بُعد القمر عن الأرض نحو <MathExpression>{roundingBookFacts.moonDistance}</MathExpression> كم، ومساحة الصحراء الكبرى <MathExpression>{roundingBookFacts.saharaArea}</MathExpression> كم². وسؤالا تقريبهما مطبوعان في «تحقّق من فهمك» ص 17.</>,
          },
        ],
      },
      {
        id: 'l4-skills',
        title: 'المهارات بخطوات مرتّبة',
        blocks: [
          {
            kind: 'steps', id: 'l4-steps-rule', title: 'مهارة ①: تقريب عدد إلى منزلة محدّدة (جواب «التعبير الشفهي» ص 17)',
            steps: [
              'نحدد المنزلة المطلوبة ونفحص الرقم الواقع مباشرة على يمينها.',
              'إذا كان 5 أو أكبر نرفع المنزلة واحداً.',
              'وإذا كان أقل من 5 نبقيها كما هي.',
              'ثم نجعل الخانات الأصغر إلى يمينها أصفاراً، ونكتب الناتج.',
            ],
          },
          {
            kind: 'steps', id: 'l4-steps-line', title: 'مهارة ②: التقريب باستعمال مستقيم الأعداد',
            steps: [
              'نمثّل العدد المطلوب على مستقيم الأعداد بين تدريجين متتاليين للمنزلة المطلوبة.',
              'ننظر أيّ التدريجين أقرب إلى نقطة العدد.',
              'نكتب العدد الأقرب؛ وهو الناتج نفسه الذي تعطيه قاعدة التقريب.',
            ],
          },
          {
            kind: 'steps', id: 'l4-steps-2137', title: 'مهارة ③: مثال الخطوات كما طبعها الكتاب (ص 16) — تقريب 2137 إلى أقرب ألف',
            steps: [
              'منزلة التقريب هي آحاد الألوف.',
              <>رقم المئات إلى يمينها هو <MathExpression>1</MathExpression>، وهو أصغر من <MathExpression>5</MathExpression>؛ لذلك نبقي <MathExpression>2</MathExpression> في الألوف.</>,
              <>نصفر المئات والعشرات والآحاد، فيكون الناتج <MathExpression>2000</MathExpression>.</>,
            ],
          },
        ],
      },
      {
        id: 'l4-examples',
        title: 'أمثلة محلولة من الكتاب (ص 15)',
        blocks: [
          {
            kind: 'example', id: 'l4-ex-2137', title: 'مثال ① — مثال محلول: استعمال مستقيم الأعداد',
            question: task('r4-p15-example-2137').prompt,
            figure: <ProportionalNumberLine task={task('r4-p15-example-2137')} />,
            solution: [
              <>منزلة التقريب هي آحاد الألوف، والعدد يقع على المستقيم بين <MathExpression>2000</MathExpression> و<MathExpression>3000</MathExpression>.</>,
              <>رقم المئات إلى يمينها هو <MathExpression>1</MathExpression>، وهو أصغر من <MathExpression>5</MathExpression>؛ لذلك نبقي <MathExpression>2</MathExpression> في الألوف.</>,
              'نصفر المئات والعشرات والآحاد.',
            ],
            answer: <>تقريب <MathExpression>2137</MathExpression> إلى أقرب ألف هو <MathExpression>{key('r4-p15-example-2137')}</MathExpression>.</>,
            verification: <>على المستقيم، النقطة <MathExpression>2137</MathExpression> أقرب إلى <MathExpression>2000</MathExpression> منها إلى <MathExpression>3000</MathExpression>، وهو ما توافق مع القاعدة.</>,
          },
          {
            kind: 'example', id: 'l4-ex-580', title: 'مثال ② — انطلاقة نشطة 1',
            question: task('r4-p15-a1-580').prompt,
            figure: <ProportionalNumberLine task={task('r4-p15-a1-580')} />,
            solution: [
              <>نمثّل <MathExpression>580</MathExpression> على المستقيم بين <MathExpression>500</MathExpression> و<MathExpression>600</MathExpression>.</>,
              <>منزلة التقريب هي المئات، والرقم على يمينها مباشرة هو رقم العشرات <MathExpression>8</MathExpression>.</>,
              <>لأنّ <MathExpression>8</MathExpression> أكبر من أو يساوي <MathExpression>5</MathExpression> نزيد خانة المئات واحداً: <MathExpression>5</MathExpression> تصبح <MathExpression>6</MathExpression>، ثم نصفر العشرات والآحاد.</>,
            ],
            answer: <>تقريب <MathExpression>580</MathExpression> إلى أقرب مئة هو <MathExpression>{key('r4-p15-a1-580')}</MathExpression>.</>,
            verification: <>على المستقيم، <MathExpression>580</MathExpression> أقرب إلى <MathExpression>600</MathExpression> منها إلى <MathExpression>500</MathExpression>.</>,
          },
          {
            kind: 'example', id: 'l4-ex-315', title: 'مثال ③ — انطلاقة نشطة 2',
            question: task('r4-p15-a2-315').prompt,
            figure: <ProportionalNumberLine task={task('r4-p15-a2-315')} />,
            solution: [
              <>نمثّل <MathExpression>315</MathExpression> على المستقيم بين <MathExpression>300</MathExpression> و<MathExpression>400</MathExpression>، وهو يقع بعد العلامة <MathExpression>310</MathExpression> بقليل.</>,
              <>رقم العشرات (المجاور مباشرة لخانة المئات) هو <MathExpression>1</MathExpression>، وهو أقل من <MathExpression>5</MathExpression>.</>,
              'نبقي خانة المئات كما هي ونصفر العشرات والآحاد.',
            ],
            answer: <>تقريب <MathExpression>315</MathExpression> إلى أقرب مئة هو <MathExpression>{key('r4-p15-a2-315')}</MathExpression>.</>,
            verification: <>على المستقيم، <MathExpression>315</MathExpression> أقرب إلى <MathExpression>300</MathExpression> منها إلى <MathExpression>400</MathExpression>.</>,
          },
          {
            kind: 'example', id: 'l4-ex-1390', title: 'مثال ④ — انطلاقة نشطة 3 (اختيار)',
            question: <>{task('r4-p15-a3-1390').prompt} {task('r4-p15-a3-1390').choices?.map((choice, index) => <span key={choice}>{index > 0 ? ' / ' : ''}<MathExpression>{choice}</MathExpression></span>)}</>,
            solution: [
              <>منزلة التقريب هي المئات، والرقم المجاور لها مباشرة هو رقم العشرات <MathExpression>9</MathExpression>.</>,
              <>لأنّ <MathExpression>9</MathExpression> أكبر من أو يساوي <MathExpression>5</MathExpression> نزيد خانة المئات: <MathExpression>3</MathExpression> تصبح <MathExpression>4</MathExpression>.</>,
              'نصفر العشرات والآحاد، فلا يبقى العدد كما هو ولا ينقص.',
            ],
            answer: <><MathExpression>{key('r4-p15-a3-1390')}</MathExpression></>,
            verification: <>التقريب يعطي دائماً عدداً من مضاعفات المنزلة المطلوبة؛ فـ<MathExpression>1399</MathExpression> ليس من مضاعفات المئة، و<MathExpression>1300</MathExpression> ينقص العدد بدل تقريبه.</>,
          },
        ],
      },
      {
        id: 'l4-worked',
        title: 'أمثلة محلولة (ص 16 و17)',
        blocks: [
          {
            kind: 'example', id: 'l4-ex-3482137', title: 'مثال ⑤ — مثال محلول ص 16',
            question: task('r4-p16-example-3482137').prompt,
            solution: [
              'منزلة التقريب هي مئات الألوف.',
              <>الرقم المجاور لها مباشرة هو رقم عشرات الألوف <MathExpression>8</MathExpression>، وهو أكبر من أو يساوي <MathExpression>5</MathExpression>، فنزيد مئات الألوف: <MathExpression>4</MathExpression> تصبح <MathExpression>5</MathExpression>.</>,
              'نجعل الخانات الأصغر (عشرات الألوف، الآلاف، المئات، العشرات، الآحاد) أصفاراً.',
            ],
            answer: <>تقريب <MathExpression>3482137</MathExpression> إلى أقرب مئة ألف هو <MathExpression>{key('r4-p16-example-3482137')}</MathExpression>.</>,
            verification: 'الناتج ينتهي بخمسة أصفار، فهو من مضاعفات المئة ألف كما تتطلب المنزلة.',
          },
          {
            kind: 'example', id: 'l4-ex-3582137', title: 'مثال ⑥ — مثال محلول ص 17',
            question: task('r4-p17-example-3582137').prompt,
            solution: [
              'منزلة التقريب هي الملايين.',
              <>الرقم المجاور لها مباشرة هو رقم مئات الألوف <MathExpression>5</MathExpression>، وهو يساوي <MathExpression>5</MathExpression>، فنزيد الملايين: <MathExpression>3</MathExpression> تصبح <MathExpression>4</MathExpression>.</>,
              'نجعل الخانات الأصغر أصفاراً.',
            ],
            answer: <>تقريب <MathExpression>3582137</MathExpression> إلى أقرب مليون هو <MathExpression>{key('r4-p17-example-3582137')}</MathExpression>.</>,
            verification: <>عند الرقم <MathExpression>5</MathExpression> بالضبط نزيد ولا نبقي؛ فمئات الألوف <MathExpression>5</MathExpression> رفعت الملايين من <MathExpression>3</MathExpression> إلى <MathExpression>4</MathExpression>.</>,
          },
          {
            kind: 'example', id: 'l4-ex-moon', title: 'مثال ⑦ — تحقّق من فهمك أ (ص 17)',
            question: task('r4-p17-check-a-moon').prompt,
            solution: [
              'منزلة التقريب هي آحاد الألوف.',
              <>الرقم المجاور لها مباشرة هو رقم المئات <MathExpression>9</MathExpression>، وهو أكبر من أو يساوي <MathExpression>5</MathExpression>، فنزيد الآلاف: <MathExpression>5</MathExpression> تصبح <MathExpression>6</MathExpression>.</>,
              'نصفر المئات والعشرات والآحاد.',
            ],
            answer: <>تقريب بُعد القمر <MathExpression>385920</MathExpression> كم إلى أقرب ألف هو <MathExpression>{key('r4-p17-check-a-moon')}</MathExpression> كم.</>,
            verification: 'الناتج ينتهي بثلاثة أصفار، فهو من مضاعفات الألف.',
          },
          {
            kind: 'example', id: 'l4-ex-sahara', title: 'مثال ⑧ — تحقّق من فهمك ب (ص 17)',
            question: task('r4-p17-check-b-sahara').prompt,
            solution: [
              'منزلة التقريب هي الملايين.',
              <>الرقم المجاور لها مباشرة هو رقم مئات الألوف <MathExpression>6</MathExpression>، وهو أكبر من أو يساوي <MathExpression>5</MathExpression>، فنزيد الملايين: <MathExpression>5</MathExpression> تصبح <MathExpression>6</MathExpression>.</>,
              'نصفر الخانات الأصغر كلها.',
            ],
            answer: <>تقريب مساحة الصحراء الكبرى <MathExpression>5628000</MathExpression> كم² إلى أقرب مليون هو <MathExpression>{key('r4-p17-check-b-sahara')}</MathExpression> كم².</>,
            verification: 'الناتج ينتهي بستة أصفار، فهو من مضاعفات المليون.',
          },
        ],
      },
      {
        id: 'l4-drills',
        title: 'تدرّبات الكتاب مع نواتجها (ص 17 و18)',
        blocks: [
          {
            kind: 'figure', id: 'l4-figure-2957',
            title: 'تدرّب 1 — مستقيم الأعداد',
            figure: <ProportionalNumberLine task={task('r4-p17-practice-1-2957')} />,
            caption: task('r4-p17-practice-1-2957').prompt,
            labels: [
              <>العدد <MathExpression>2957</MathExpression> يقع بين <MathExpression>2000</MathExpression> و<MathExpression>3000</MathExpression>، وهو أقرب إلى <MathExpression>3000</MathExpression>.</>,
              <>الناتج: تقريب <MathExpression>2957</MathExpression> إلى أقرب ألف هو <MathExpression>{key('r4-p17-practice-1-2957')}</MathExpression>، لأنّ رقم المئات <MathExpression>9</MathExpression> أكبر من أو يساوي <MathExpression>5</MathExpression>.</>,
            ],
          },
          {
            kind: 'figure', id: 'l4-figure-5856375',
            title: 'تدرّب 2 — مستقيم الأعداد',
            figure: <ProportionalNumberLine task={task('r4-p17-practice-2-5856375')} />,
            caption: task('r4-p17-practice-2-5856375').prompt,
            labels: [
              <>العدد <MathExpression>5856375</MathExpression> يقع بين <MathExpression>5856000</MathExpression> و<MathExpression>5857000</MathExpression>، وهو أقرب إلى <MathExpression>5856000</MathExpression>.</>,
              <>الناتج: <MathExpression>{key('r4-p17-practice-2-5856375')}</MathExpression> إلى أقرب ألف، لأنّ رقم المئات <MathExpression>3</MathExpression> أقل من <MathExpression>5</MathExpression>.</>,
            ],
          },
          {
            kind: 'table', id: 'l4-table-drill3', title: 'تدرّب 3 — التقريب إلى أقرب ألف (ص 17)',
            headers: ['العدد', 'التقريب إلى أقرب ألف', 'الرقم الفاصل (المئات)'],
            rows: [
              [num('1523099', 'd3a-n'), num(key('r4-p17-practice-3-a'), 'd3a-a'), '0 (أقل من 5) → نبقي'],
              [num('7932523', 'd3b-n'), num(key('r4-p17-practice-3-b'), 'd3b-a'), '5 (تساوي 5) → نزيد'],
              [num('2999700', 'd3c-n'), num(key('r4-p17-practice-3-c'), 'd3c-a'), '7 (أكبر من 5) → نزيد، فتحمل الألوف بدورها'],
              [num('50500005', 'd3d-n'), num(key('r4-p17-practice-3-d'), 'd3d-a'), '0 (أقل من 5) → نبقي'],
            ],
          },
          {
            kind: 'table', id: 'l4-table-drill5', title: 'تدرّب 5 — منازل مختلفة (ص 18)',
            headers: ['العدد', 'المنزلة المطلوبة', 'الناتج'],
            rows: [
              drillRow('r4-p18-practice-5-a', '254900', 'أقرب مئة ألف'),
              drillRow('r4-p18-practice-5-b', '107306', 'أقرب مئة ألف'),
              drillRow('r4-p18-practice-5-c', '445700', 'أقرب عشرة آلاف'),
              drillRow('r4-p18-practice-5-d', '285008', 'أقرب عشرة آلاف'),
              drillRow('r4-p18-practice-5-e', '1987549', 'أقرب مليون'),
              drillRow('r4-p18-practice-5-f', '705600', 'أقرب مليون'),
            ],
          },
          {
            kind: 'table', id: 'l4-table-drill8', title: 'تدرّب 8 — الخانة المعلّمة بالأحمر (ص 18)',
            headers: ['العدد', 'الخانة المعلّمة بالأحمر', 'الناتج'],
            rows: [
              drillRow('r4-p18-practice-8-a', '5326009', 'الملايين'),
              drillRow('r4-p18-practice-8-b', '1500990', 'الملايين'),
              drillRow('r4-p18-practice-8-c', '6998421', 'الملايين'),
              drillRow('r4-p18-practice-8-d', '9236545', 'العشرات'),
              drillRow('r4-p18-practice-8-e', '232698', 'الآحاد'),
              drillRow('r4-p18-practice-8-f', '9215001', 'آحاد الألوف'),
              drillRow('r4-p18-practice-8-g', '235691', 'آحاد الألوف'),
              drillRow('r4-p18-practice-8-h', '4231659', 'المئات'),
              drillRow('r4-p18-practice-8-i', '3199245', 'مئات الألوف'),
            ],
          },
          {
            kind: 'example', id: 'l4-ex-sweden', title: 'تدرّب 9 · الجغرافية — مثال تطبيقي محلول (ص 18)',
            question: task('r4-p18-practice-9-sweden').prompt,
            solution: [
              <>المطلوب التقريب إلى أقرب عشرة آلاف، لذا نفحص رقم الآلاف في <MathExpression>185180</MathExpression> وهو <MathExpression>5</MathExpression>.</>,
              <>نزيد رقم عشرات الآلاف <MathExpression>8</MathExpression> إلى <MathExpression>9</MathExpression>، وتصبح الخانات الأصغر أصفاراً.</>,
            ],
            answer: <>الناتج <MathExpression>{key('r4-p18-practice-9-sweden')}</MathExpression> كم².</>,
            verification: <>عند الرقم <MathExpression>5</MathExpression> بالضبط نزيد؛ ولو كان رقم الآلاف <MathExpression>4</MathExpression> أو أقل لبقي الناتج <MathExpression>180000</MathExpression>.</>,
          },
          {
            kind: 'table', id: 'l4-table-applications', title: 'التطبيقات 10–13 (ص 18)',
            headers: ['المسألة', 'العدد', 'المنزلة المطلوبة', 'الناتج'],
            rows: [
              ['تدرّب 10 · إنتاج فرن من الأرغفة في شهر', num('112880', 'ap10-n'), 'أقرب عشرة آلاف', num(key('r4-p18-practice-10-eggs'), 'ap10-a')],
              ['تدرّب 11 · ثمن سيارة طارق بالليرات السورية', num('1750000', 'ap11-n'), 'أقرب مليون', num(key('r4-p18-practice-11-car'), 'ap11-a')],
              ['تدرّب 12 · نصف قطر الكرة الأرضية بالأمتار', num('6373000', 'ap12-n'), 'أقرب مليون', num(key('r4-p18-practice-12-earth'), 'ap12-a')],
              ['تدرّب 13 أ · مبلغ التبرّع بالليرات السورية', num('7480000', 'ap13a-n'), 'أقرب مليون', num(key('r4-p18-practice-13-donation-million'), 'ap13a-a')],
              ['تدرّب 13 ب · مبلغ التبرّع نفسه', num('7480000', 'ap13b-n'), 'أقرب مئة ألف', num(key('r4-p18-practice-13-donation-hundred-thousand'), 'ap13b-a')],
            ],
            caption: <>لاحظ في تدرّب 13 أنّ العدد نفسه يُقرَّب إلى نتيجتين مختلفتين لأنّ المنزلة المطلوبة مختلفة.</>,
          },
          {
            kind: 'example', id: 'l4-ex-secret', title: 'الرقم السري 4 — مثال تفكير (ص 18)',
            question: task('r4-p18-practice-4-digit-code').prompt,
            solution: [
              <>لكي يقرَّب العدد إلى <MathExpression>5000</MathExpression> يجب أن يبدأ بالرقم <MathExpression>5</MathExpression> في خانة الألوف.</>,
              <>ويجب أن يكون رقم المئات أقل من <MathExpression>5</MathExpression> حتى نبقي الألوف كما هي؛ فالرقمان المتاحان لذلك هما <MathExpression>1</MathExpression> فقط.</>,
              <>نضع <MathExpression>1</MathExpression> في المئات، ثم نرتب <MathExpression>6</MathExpression> و<MathExpression>7</MathExpression> في العشرات والآحاد بحريتين.</>,
            ],
            answer: <><MathExpression>{key('r4-p18-practice-4-digit-code')}</MathExpression> (كلاهما صحيح).</>,
            verification: <>نتحقق بالقاعدة: في <MathExpression>5167</MathExpression> و<MathExpression>5176</MathExpression> رقم المئات <MathExpression>1</MathExpression> أقل من <MathExpression>5</MathExpression>، فنُبقي <MathExpression>5</MathExpression> في الألوف ونصفر ما بعدها.</>,
          },
          {
            kind: 'example', id: 'l4-ex-compare', title: 'تدرّب 6 — صح أم خطأ؟ (ص 18)',
            question: 'أ) 4315000 < 4382000 · ب) 530019 > 610710',
            solution: [
              <>أ) يتفق العددان في خانتي الملايين ومئات الألوف، ثم يختلفان في عشرات الألوف: <MathExpression>1</MathExpression> مقابل <MathExpression>8</MathExpression>، و<MathExpression>1</MathExpression> أصغر.</>,
              <>ب) نبدأ من أكبر منزلة: <MathExpression>5</MathExpression> في مئات الألوف مقابل <MathExpression>6</MathExpression>، و<MathExpression>5</MathExpression> أصغر؛ فالعدد الأول أقل من الثاني.</>,
            ],
            answer: <><MathExpression>أ)</MathExpression> صح · <MathExpression>ب)</MathExpression> خطأ.</>,
            verification: 'نعيد المقارنة منزلة منزلة من اليسار؛ فأول منزلة تختلف هي التي تحدد العدد الأكبر.',
          },
          {
            kind: 'example', id: 'l4-ex-reason', title: 'تدرّب 7 — سؤال التعليل (ص 18)',
            question: task('r4-p18-practice-7-reason').prompt,
            solution: [
              'نتذكر أنّ القاعدة تبدأ بتحديد المنزلة المطلوبة، ثم تفحص الرقم المجاور لها مباشرة.',
              'الرقم المجاور يختلف باختلاف المنزلة: للتقريب إلى الملايين نفحص مئات الألوف، وللتقريب إلى آحاد الألوف نفحص المئات.',
            ],
            answer: key('r4-p18-practice-7-reason'),
          },
        ],
      },
      {
        id: 'l4-warnings',
        title: 'تنبيهات وأخطاء شائعة',
        blocks: [
          {
            kind: 'note', id: 'l4-warn-adjacent', tone: 'warning',
            text: 'افحص الرقم الواقع مباشرة إلى يمين المنزلة المطلوبة، لا رقماً أبعد منها؛ فالتقريب إلى أقرب مئة ألف يفحص عشرات الألوف، والتقريب إلى أقرب ألف يفحص المئات.',
          },
          {
            kind: 'note', id: 'l4-warn-five', tone: 'warning',
            text: <>عند الرقم <MathExpression>5</MathExpression> بالضبط نزيد المنزلة ولا نبقيها. مثال: <MathExpression>445700</MathExpression> إلى أقرب عشرة آلاف يصبح <MathExpression>450000</MathExpression>، و<MathExpression>254900</MathExpression> إلى أقرب مئة ألف يصبح <MathExpression>300000</MathExpression>.</>,
          },
          {
            kind: 'note', id: 'l4-warn-zero-not-delete', tone: 'warning',
            text: <>نصفر الخانات الأصغر ولا نحذفها؛ فعدد خانات الناتج لا يتغير. مثال: <MathExpression>9236545</MathExpression> إلى أقرب عشرة يصبح <MathExpression>9236550</MathExpression> (سبع خانات أيضاً).</>,
          },
          {
            kind: 'note', id: 'l4-warn-carry', tone: 'warning',
            text: <>قد تنتقل الزيادة إلى أكثر من خانة: <MathExpression>2999700</MathExpression> إلى أقرب ألف يصبح <MathExpression>3000000</MathExpression>؛ لأنّ زيادة <MathExpression>999</MathExpression> ألفاً تحمل إلى خانة الملايين.</>,
          },
          {
            kind: 'note', id: 'l4-note-ones', tone: 'tip',
            text: <>إذا كانت المنزلة المطلوبة هي الآحاد فالعدد يبقى كما هو؛ فمثلاً <MathExpression>232698</MathExpression> إلى أقرب آحاد يبقى <MathExpression>232698</MathExpression>، لأنه لا توجد خانات أصغر منه لنصفرها.</>,
          },
          {
            kind: 'note', id: 'l4-tip-check', tone: 'tip',
            text: 'تحقّق من جوابك بشرطين: أن يكون الناتج من مضاعفات المنزلة المطلوبة (ينتهي بعدد الأصفار المناسب)، وأن يكون الفرق بينه وبين العدد الأصلي أقل من نصف قيمة تلك المنزلة.',
          },
        ],
      },
    ],
  }
}
