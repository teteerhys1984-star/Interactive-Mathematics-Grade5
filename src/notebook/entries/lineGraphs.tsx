import { LineChart } from '../../components/lesson/LineChart'
import { MathExpression } from '../../components/MathExpression'
import {
  damascusWeek,
  idealInfantHeight,
  infantHeightTableHeaders,
  infantHeightTableMonths,
  studentCountByYear,
  studentCountTableYears,
} from '../../lessons/lineGraphsData'
import type { NotebookDoc } from '../types'

/**
 * «دفتر الطالب» — الدرس الثاني: التمثيلات البيانية بالخطوط (الكتاب ص 7–9).
 *
 * Sources: `src/lessons/LineGraphsLesson.tsx` (the printed «تعلّم» definition ص 7, the drawing
 * steps, the Friday reading example ص 8, the two «اكتشف الخطأ» cards, the recap) and
 * `src/teacher/lesson2.ts` (answer key + the documented note that ص 8–9 graphs are read
 * approximately because the book prints no side table for them).
 *
 * Every chart is the real `LineChart` component fed with the same series objects the lesson
 * uses, and every table value is computed from those series — so the notebook can never drift
 * from the lesson's numbers.
 */
const heightValues = infantHeightTableMonths.map(month => idealInfantHeight.values[idealInfantHeight.labels.indexOf(String(month))])
const studentValues = studentCountTableYears.map(year => studentCountByYear.values[studentCountByYear.labels.indexOf(String(year))])
const number = (value: number, key: string) => <MathExpression key={key}>{value}</MathExpression>

export function lineGraphsNotebook(): NotebookDoc {
  return {
    lessonId: 'line-graphs',
    lessonTitle: 'التمثيلات البيانية بالخطوط',
    unit: 'الوحدة الأولى',
    pages: 'ص 7–9',
    sections: [
      {
        id: 'l2-terms',
        purpose: 'record',
        title: 'المفردات والتعريفات',
        blocks: [
          {
            kind: 'definition', id: 'l2-def-linegraph', term: 'التمثيل البياني بالخطوط',
            text: 'لتسهل قراءة بيانات متغيّرة بمرور الزمن نرسم شبكة إحداثية، ونضع عادةً المحور الأفقي للزمن والمحور الشاقولي للبيانات التي ندرسها، ثمّ نمثل النقاط في الشبكة، ونصل بينها، ونسمّي هذا التمثيل البياني بالخطوط.',
            source: 'الكتاب · ص 7 (صندوق «تعلّم») — يُحفظ كما هو',
          },
          {
            kind: 'definition', id: 'l2-def-axes', term: 'المحور الأفقي والمحور الشاقولي',
            text: <>المحور الأفقي للزمن (الأيام، الأشهر، الأعوام)، والمحور الشاقولي للبيانات التي ندرسها (درجة الحرارة، الطول، عدد الطلاب). لا يُقرأ أيّ رقم بيانات من المحور الأفقي؛ فيه الزمن فقط.</>,
            source: 'الكتاب · ص 7',
          },
          {
            kind: 'definition', id: 'l2-def-point', term: 'النقطة على التمثيل البياني',
            text: <>كل نقطة على الرسم تمثّل زوجاً مرتباً: القيمة الأولى زمن على المحور الأفقي، والثانية قيمة البيانات المدروسة على المحور الشاقولي. مثال من الكتاب: النقطة فوق يوم الجمعة تمثّل الزوج المرتّب <MathExpression>(الجمعة، 17)</MathExpression>، أي إنّ درجة الحرارة يوم الجمعة هي <MathExpression>17</MathExpression>.</>,
            source: 'الكتاب · ص 8',
          },
          {
            kind: 'text', id: 'l2-why',
            text: 'لماذا نستعمل هذا الشكل بالذات؟ الجدول وحده يعطينا الأرقام، لكنه لا يُظهر بسهولة هل القيمة ترتفع أم تنخفض. الخط الواصل بين النقاط يجعل اتجاه التغيّر واضحاً للعين مباشرة.',
          },
        ],
      },
      {
        id: 'l2-rules',
        purpose: 'record',
        title: 'قواعد قراءة اتجاه التغيّر',
        blocks: [
          {
            kind: 'rule', id: 'l2-rule-direction', title: 'اتجاه الخط ومعناه',
            text: 'خط صاعد يعني تزايداً، وخط هابط يعني تناقصاً، وخط أفقي يعني ثباتاً. نقرأ الاتجاه دائماً ونحن نتحرك على المحور الأفقي من الزمن الأقدم إلى الزمن الأحدث.',
          },
          {
            kind: 'rule', id: 'l2-rule-repeat', title: 'تكرار القيمة الواحدة',
            text: <>قد تشترك أكثر من فترة زمنية في القيمة نفسها. في تمثيل درجات الحرارة تتكرر القيمة <MathExpression>16</MathExpression> يومي الثلاثاء والسبت، وتتكرر القيمة <MathExpression>18</MathExpression> يومي الأربعاء والخميس؛ فالخط الأفقي عند قيمة واحدة يمكن أن يقطع الرسم في أكثر من نقطة.</>,
          },
          {
            kind: 'rule', id: 'l2-rule-between', title: 'ما بين النقطتين',
            text: 'القطعة المستقيمة بين نقطتين تساعدنا على تخيّل اتجاه التغيّر فقط، ولا تمثّل بيانات حقيقية؛ لأنّ البيانات هنا منفصلة (أيام أو أشهر أو أعوام محدّدة) وليست مستمرة بينها.',
          },
        ],
      },
      {
        id: 'l2-skills',
        purpose: 'record',
        title: 'المهارات بخطوات مرتّبة',
        blocks: [
          {
            kind: 'steps', id: 'l2-steps-draw', title: 'مهارة ①: رسم التمثيل البياني بالخطوط',
            steps: [
              'نرسم محورين متعامدين: الأفقي للزمن (الأيام، الأشهر، الأعوام…) والشاقولي للبيانات المدروسة (الحرارة، الطول، العدد…).',
              'نكتب عنواناً واضحاً لكل محور، وعنواناً عاماً للتمثيل نفسه.',
              'نستعمل الجدول لنضع نقطة فوق كل قيمة زمن، على ارتفاع يساوي قيمة البيانات المقابلة لها.',
              'نصل بين النقاط المتتالية بقطع مستقيمة، فنحصل على التمثيل البياني بالخطوط.',
            ],
          },
          {
            kind: 'steps', id: 'l2-steps-read', title: 'مهارة ②: قراءة قيمة من التمثيل (من الزمن إلى البيانات)',
            steps: [
              'نقف على الزمن المطلوب (اليوم أو الشهر أو العام) على المحور الأفقي.',
              'نصعد شاقولياً حتى النقطة الواقعة فوقه مباشرة، وليس حتى أي خط آخر.',
              'نقرأ القيمة المقابلة تماماً على المحور الشاقولي.',
              <>نكتب النتيجة زوجاً مرتباً (زمن، قيمة البيانات)، مثل <MathExpression>(الجمعة، 17)</MathExpression>.</>,
            ],
          },
          {
            kind: 'steps', id: 'l2-steps-find-time', title: 'مهارة ③: إيجاد الزمن المقابل لقيمة معطاة (من البيانات إلى الزمن)',
            steps: [
              'نبحث على المحور الشاقولي عن القيمة المعطاة.',
              'نتحرك منها أفقياً حتى نلتقي بنقطة الرسم.',
              'نقرأ الزمن المقابل تحت هذه النقطة على المحور الأفقي.',
            ],
          },
        ],
      },
      {
        id: 'l2-damascus',
        purpose: 'record',
        title: 'مثال الكتاب ①: درجات الحرارة في دمشق (ص 7–8)',
        blocks: [
          {
            kind: 'table', id: 'l2-table-damascus', title: 'الجدول: درجات الحرارة خلال أسبوع في مدينة دمشق',
            headers: ['اليوم', ...damascusWeek.labels],
            rows: [['درجة الحرارة', ...damascusWeek.values.map((value, index) => number(value, `t2-${index}`))]],
          },
          {
            kind: 'figure', id: 'l2-figure-damascus',
            title: 'التمثيل البياني بالخطوط للجدول السابق',
            figure: <LineChart series={damascusWeek} readExampleIndex={damascusWeek.labels.indexOf('الجمعة')} ariaLabel="تمثيل بياني بالخطوط لدرجات الحرارة في دمشق خلال أسبوع، مع سهمَي قراءة يحدّدان النقطة فوق يوم الجمعة" />,
            caption: <>النقطة الملوّنة مع السهمين هي نقطة يوم الجمعة، وتقرأ <MathExpression>(الجمعة، 17)</MathExpression>.</>,
            labels: [
              <>المحور الأفقي: اليوم — والمحور الشاقولي: درجة الحرارة.</>,
              <>أعلى قيمة <MathExpression>18</MathExpression> يومي الأربعاء والخميس، وأدنى قيمة <MathExpression>14</MathExpression> يوم الإثنين.</>,
              <>القيمة <MathExpression>16</MathExpression> تتكرر يومي الثلاثاء والسبت، والقيمة <MathExpression>17</MathExpression> يوم الجمعة.</>,
            ],
          },
          {
            kind: 'example', id: 'l2-ex-friday', title: 'مثال محلول — قراءة درجة الحرارة يوم الجمعة (ص 8)',
            question: 'حدّد من التمثيل البياني درجة الحرارة في يوم الجمعة.',
            solution: [
              'نحدد يوم الجمعة على المحور الأفقي.',
              'نصعد شاقولياً حتى نلتقي بالنقطة الواقعة فوقه مباشرة.',
              <>نقرأ القيمة المقابلة لها على المحور الشاقولي: <MathExpression>17</MathExpression>.</>,
            ],
            answer: <>تمثّل هذه النقطة الزوج المرتب <MathExpression>(الجمعة، 17)</MathExpression>، أي إنّ درجة الحرارة في يوم الجمعة هي <MathExpression>17</MathExpression>.</>,
            verification: 'نتحقق بالجدول: عمود الجمعة في جدول ص 7 يحمل الرقم 17 نفسه، فالرسم والجدول متوافقان.',
          },
          {
            kind: 'example', id: 'l2-ex-week-questions', title: 'مثال محلول — أسئلة الجدول (ص 7)',
            question: 'أ) ما درجة الحرارة في دمشق يوم الأربعاء؟ ب) ما اليوم الذي كانت درجة الحرارة فيه الأكثر انخفاضاً؟ ج) ما الأيام التي كانت درجة الحرارة فيها الأكثر ارتفاعاً؟',
            solution: [
              <>أ) نبحث عن عمود «الأربعاء» في الجدول، فنجد أسفله العدد <MathExpression>18</MathExpression>.</>,
              <>ب) نقارن كل قيم الجدول: <MathExpression>15, 14, 16, 18, 18, 17, 16</MathExpression>؛ أصغر قيمة هي <MathExpression>14</MathExpression> وتقابل يوم الإثنين.</>,
              <>ج) أكبر قيمة في الجدول هي <MathExpression>18</MathExpression>، وهي تتكرر في عمودي الأربعاء والخميس معاً.</>,
            ],
            answer: 'أ) 18 · ب) الإثنين · ج) الأربعاء والخميس.',
            verification: '«الأكثر انخفاضاً» تعني أصغر قيمة في الجدول كله، وليست أول رقم فيه؛ و«الأكثر ارتفاعاً» قد تشمل أكثر من يوم إذا تكررت القيمة الكبرى.',
          },
          {
            kind: 'text', id: 'l2-trend-week',
            text: <>اتجاه التغيّر خلال الأسبوع كما لاحظه الكتاب: انخفاض يوم الإثنين، ومن ثمّ ارتفاع تدريجي حتى يوم الأربعاء، وثبات درجة الحرارة يومي الأربعاء والخميس، وأخيراً بدء الانخفاض حتى يوم السبت.</>,
          },
        ],
      },
      {
        id: 'l2-height',
        purpose: 'practice',
        title: 'مثال الكتاب ②: الطول المثالي للطفل في العام الأول (ص 8–9)',
        blocks: [
          {
            kind: 'figure', id: 'l2-figure-height',
            title: 'الطول المثالي للطفل بالسنتيمتر في العام الأول',
            figure: <LineChart series={idealInfantHeight} ariaLabel="تمثيل بياني بالخطوط للطول المثالي للطفل خلال أشهر العام الأول من عمره" />,
            caption: 'الرسم المعروض لدى طبيب الأطفال في الكتاب (ص 8)، والمطلوب قراءة الأطوال منه قراءة تقريبية وإكمال الجدول.',
            labels: [
              'المحور الأفقي: عمر الرضيع بالأشهر (من 0 إلى 12) — والمحور الشاقولي: الطول بالسنتيمتر.',
              <>المنحنى صاعد طوال العام، أي إنّ الطول يزداد مع تقدّم العمر.</>,
            ],
          },
          {
            kind: 'example', id: 'l2-ex-height-table', title: 'أ) إكمال جدول الطول المثالي (ص 9)',
            question: 'املأ الجدول الآتي بحسب التمثيل البياني: الطول عند الولادة، وفي الشهر الأول والثاني والثالث والخامس والسابع، وعند عمر عام.',
            solution: [
              'لكل شهر مطلوب نحدده على المحور الأفقي.',
              'نصعد شاقولياً حتى نقطة الرسم، ثم نقرأ الطول المقابل على المحور الشاقولي.',
              'نكتب القيمة في خانة الشهر نفسه من الجدول، وننتقل إلى الشهر التالي حتى تكتمل الخانات السبع.',
            ],
            answer: 'القيم السبع مرتّبة في الجدول الآتي، من الولادة حتى عمر عام، وكلّها قراءة تقريبية من الرسم.',
            verification: 'نتحقق بترتيب القيم: يجب أن تزداد تدريجياً من الولادة حتى عمر عام، لأنّ المنحنى صاعد.',
          },
          {
            kind: 'table', id: 'l2-table-height', title: 'الجدول المكتمل — الطول بالسنتيمتر (قيم تقريبية)',
            headers: infantHeightTableHeaders,
            rows: [['الطول تقريباً', ...heightValues.map((value, index) => number(value, `h-${index}`))]],
            caption: 'لا يطبع الكتاب جدولاً لهذا الرسم: كل قيمة هنا قراءة تقريبية من منحنى ص 8–9، وليست رقماً مطبوعاً في الكتاب.',
          },
          {
            kind: 'example', id: 'l2-ex-height-birth', title: 'ب) طول الطفل عند الولادة (ص 9)',
            question: 'ما طول الطفل عند الولادة؟',
            solution: [
              'عند الولادة يقابل الشهر صفر على المحور الأفقي.',
              'النقطة عند الشهر صفر تقع عند بداية المنحنى.',
              'نقرأ ارتفاعها على المحور الشاقولي.',
            ],
            answer: <>طول الطفل عند الولادة نحو <MathExpression>50</MathExpression> سم.</>,
          },
          {
            kind: 'example', id: 'l2-ex-height-compare', title: 'ج) مقارنة طول طفل حقيقي بالطول المثالي (ص 9)',
            question: <>إذا علمت أنّ طول طفل في عمر العام هو <MathExpression>72cm</MathExpression> فهل طول هذا الطفل قريب من الطول المثالي؟</>,
            solution: [
              <>نقرأ الطول المثالي عند عمر عام من الرسم: نحو <MathExpression>76</MathExpression> سم.</>,
              <>نطرح: <MathExpression>76 − 72 = 4</MathExpression> سم.</>,
              <>فرق صغير مثل <MathExpression>4</MathExpression> سم من أصل <MathExpression>76</MathExpression> سم يُعدّ قريباً وليس بعيداً عن المعدل الطبيعي.</>,
            ],
            answer: <>نعم، الفرق نحو <MathExpression>4</MathExpression> سم فقط، لذلك طول <MathExpression>72cm</MathExpression> قريب جداً من الطول المثالي.</>,
            verification: <>نتحقق من اتجاه الرسم: المنحنى صاعد، وطول <MathExpression>72</MathExpression> سم يقع أسفل النقطة الأخيرة بقليل، فهو في المدى نفسه.</>,
          },
          {
            kind: 'note', id: 'l2-note-approximate', tone: 'warning',
            text: 'تنبيه على كل القيم الآتية من الرسم: الرسمان البيانيان في ص 8–9 (الطول المثالي، وعدد طلاب الصف الخامس) لا يرافقهما جدول أرقام مطبوع في الكتاب. لذلك كل عدد في جدوليهما وفي حلّيهما قراءة تقريبية من مسار الخط نفسه، وليست بياناً مطبوعاً في الكتاب، وهي تُستعمل بثبات في الرسم وفي الإجابة معاً. دوّن في دفترك أنّها تقريبية، وطابقها مع نسخة الكتاب الورقية عند المراجعة الصفّية.',
          },
        ],
      },
      {
        id: 'l2-students',
        purpose: 'practice',
        title: 'مثال الكتاب ③: عدد طلاب الصف الخامس (ص 9)',
        blocks: [
          {
            kind: 'figure', id: 'l2-figure-students',
            title: <>تطوّر عدد طلاب الصف الخامس في إحدى المدارس خلال الفترة <MathExpression>2006 – 2015</MathExpression></>,
            figure: <LineChart series={studentCountByYear} readExampleIndex={studentCountByYear.labels.indexOf('2007')} ariaLabel="تمثيل بياني بالخطوط لعدد طلاب الصف الخامس بين عامي 2006 و2015، مع سهمَي قراءة يحدّدان عام 2007" />,
            caption: 'السهمان يبيّنان طريقة إيجاد العام الذي كان فيه عدد الطلاب 70.',
            labels: [
              'المحور الأفقي: العام (2006–2015) — والمحور الشاقولي: عدد الطلاب.',
              <>المنحنى يتجه إلى الأعلى بشكل عام، مع فترة شبه ثابتة حول <MathExpression>2011 – 2012</MathExpression>.</>,
            ],
          },
          {
            kind: 'table', id: 'l2-table-students', title: 'أ) الجدول المكتمل الموافق للتمثيل البياني (قيم تقريبية)',
            headers: ['العام', ...studentCountTableYears.map(String)],
            rows: [['عدد الطلاب', ...studentValues.map((value, index) => number(value, `s-${index}`))]],
            caption: 'أعمدة الجدول مرتّبة كما وردت في الكتاب (من 2015 إلى 2006) لا ترتيباً زمنياً؛ فراجع كل عام على المحور الأفقي على حدة. وكل القيم تقريبية مقروءة من الرسم البياني (انظر التنبيه في القسم السابق).',
          },
          {
            kind: 'example', id: 'l2-ex-students-trend', title: 'ب) هل عدد الطلاب يزداد أم يتناقص؟ (ص 9)',
            question: 'بحسب التمثيل البياني، هل عدد طلاب الصف الخامس يزداد أم يتناقص خلال الفترة المذكورة؟',
            solution: [
              'ننظر إلى اتجاه الخط من عام 2006 نحو عام 2015.',
              'المنحنى يتجه إلى الأعلى كلما تقدّم الزمن.',
              <>القيمة النهائية عام <MathExpression>2015</MathExpression> أكبر بكثير من القيمة الأولى عام <MathExpression>2006</MathExpression>.</>,
            ],
            answer: 'عدد الطلاب يزداد بشكل عام طوال الفترة.',
          },
          {
            kind: 'example', id: 'l2-ex-students-year70', title: 'ج) في أي عام كان عدد الطلاب 70؟ (ص 9)',
            question: 'في أي عام دراسي كان عدد الطلاب 70؟',
            solution: [
              'نبحث على المحور الشاقولي عن القيمة 70.',
              'ننزل منها أفقياً حتى نلتقي بنقطة الرسم.',
              <>نقرأ العام المقابل تحتها: <MathExpression>2007</MathExpression>.</>,
            ],
            answer: <>كان عدد الطلاب <MathExpression>70</MathExpression> في عام <MathExpression>2007</MathExpression>.</>,
            verification: 'نتحقق من الجدول المكتمل: خانة عام 2007 تحمل العدد 70 نفسه.',
          },
        ],
      },
      {
        id: 'l2-mistakes',
        purpose: 'record',
        title: 'أخطاء شائعة وتنبيهات',
        blocks: [
          {
            kind: 'note', id: 'l2-warn-axis', tone: 'warning',
            text: <>لا تقرأ رقم ترتيب الفترة من المحور الأفقي. إذا أردنا درجة الحرارة يوم الخميس فليست الإجابة رقم ترتيب اليوم بين الأيام؛ المحور الأفقي يمثّل الزمن فقط، والقيمة المطلوبة تُقرأ دائماً من المحور الشاقولي عند النقطة المقابلة (يوم الخميس = <MathExpression>18</MathExpression>).</>,
          },
          {
            kind: 'note', id: 'l2-warn-between', tone: 'warning',
            text: 'لا تخترع قيمة لفترة غير مسجّلة. لا يوجد يوم فعلي بين الثلاثاء والأربعاء في الجدول، والخط بينهما يوضّح الاتجاه فقط ولا يمثّل بيانات حقيقية؛ فلا نقول إنّ درجة الحرارة «بين» اليومين كانت 17.',
          },
          {
            kind: 'note', id: 'l2-tip-checklist', tone: 'tip',
            text: 'تحقّق من قراءتك بثلاثة أسئلة: هل وقفت أولاً فوق الزمن الصحيح على المحور الأفقي؟ هل صعدت شاقولياً حتى النقطة (وليس حتى خط عشوائي)؟ هل قرأت الرقم المقابل تماماً على المحور الشاقولي؟',
          },
        ],
      },
    ],
  }
}
