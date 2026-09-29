import { useState, type ReactNode } from 'react'
import { AlertTriangle, Check, Lightbulb, LineChart as LineChartIcon, RotateCcw, Sparkles, TrendingUp } from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { BidiText } from '../components/BidiText'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import { LineChart } from '../components/lesson/LineChart'
import { damascusWeek, idealInfantHeight, studentCountByYear, libraryVisitorsWeek, infantHeightTableMonths, infantHeightTableHeaders, studentCountTableYears } from './lineGraphsData'
import { finalAssessment2 } from '../teacher/lesson2'

/** Renders the textbook's Damascus-temperature table exactly as printed (page 7). */
function TemperatureTable() {
  return <div className="book-table-wrap"><table className="book-table">
    <thead><tr><th className="row-label">اليوم</th>{damascusWeek.labels.map(day => <th key={day}>{day}</th>)}</tr></thead>
    <tbody><tr><td className="row-label">درجة الحرارة</td>{damascusWeek.values.map((value, index) => <td key={index}><MathExpression>{value}</MathExpression></td>)}</tr></tbody>
  </table></div>
}

function StepIntro() {
  return <div className="lesson-intro">
    <div className="lesson-hero-icon"><LineChartIcon size={30} /></div>
    <div className="lesson-goals"><strong>سنتعلّم</strong><span>✓ قراءة التمثيل البياني بالخطوط</span></div>
    <SourceCard>
      <p>هناك أشياء عديدة تتغيّر بمرور الزمن مثل عدد طلاب الصف الخامس مع مرور السنوات وكذلك درجة الحرارة مع مرور الساعات.</p>
      <p>أفضل تمثيل بياني يعبّر عن هذا التغيّر يسمّى التمثيل البياني بالخطوط، لنتعلّم كيفية رسمه وقراءته.</p>
    </SourceCard>
    <div className="support-tip"><Lightbulb size={20} /><span><strong>لماذا هذا الدرس مهم؟</strong><br />كل مرة تسمع فيها نشرة جوية تقول "درجات الحرارة اليوم أعلى من أمس"، أو ترى تقريراً مدرسياً عن تزايد عدد الطلاب، فإن وراء هذا الكلام غالباً تمثيل بياني بالخطوط ساعد على استنتاجه.</span></div>
  </div>
}

function GuidedAnswer({ id, prompt, checkAnswer, hint, success }: { id: string; prompt: ReactNode; checkAnswer: (value: string) => boolean; hint: string; success: string }) {
  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [checked, setChecked] = useState(false)
  const correct = checked && checkAnswer(value)
  return <label className="test-question" key={id}>
    <strong>{prompt}</strong>
    <div className="answer-row" style={{ justifyContent: 'flex-start' }}>
      <input aria-label={id} value={value} onChange={event => { setValue(event.target.value); setChecked(false) }} />
      <button type="button" onClick={() => { setChecked(true); setAttempts(a => a + 1) }}>تحقق</button>
    </div>
    {checked && (correct ? <p className="gentle-feedback good">{success}</p> : <p className="gentle-feedback">{attempts > 1 ? hint : 'ليست هذه القيمة بعد. راجع الجدول أو الرسم جيداً وحاول مرة أخرى.'}</p>)}
  </label>
}

function ActivityStep() {
  return <div className="grid-practice">
    <div className="step-banner"><Sparkles size={20} /><span>انطلاقة نشطة</span></div>
    <SourceCard label="من الكتاب — ص 7"><p>الجدول الآتي يمثّل درجات الحرارة خلال أسبوع في مدينة دمشق:</p><TemperatureTable /><p>أجب عن الأسئلة الآتية:</p></SourceCard>
    <div className="reading-tasks">
      <GuidedAnswer id="lg-p7-q1" prompt="1) ما درجة الحرارة في دمشق يوم الأربعاء؟" checkAnswer={v => v.trim() === '18'} hint="ابحث عن عمود «الأربعاء» في الجدول، ثم اقرأ الرقم الموجود أسفله مباشرة." success="أحسنت. درجة الحرارة يوم الأربعاء هي 18." />
      <GuidedAnswer id="lg-p7-q2" prompt="2) ما اليوم الذي كانت درجة الحرارة فيه الأكثر انخفاضاً؟" checkAnswer={v => v.trim() === 'الإثنين'} hint="قارن كل الأرقام السبعة في الجدول؛ ابحث عن أصغر رقم بينها." success="صحيح. أصغر قيمة في الجدول هي 14، وهي يوم الإثنين." />
      <GuidedAnswer id="lg-p7-q3" prompt="3) ما الأيام التي كانت درجة الحرارة فيها الأكثر ارتفاعاً؟" checkAnswer={v => v.includes('أربعاء') && v.includes('خميس')} hint="أكبر رقم في الجدول هو 18، وهو يتكرر في يومين وليس يوماً واحداً فقط." success="ممتاز. الأربعاء والخميس كلاهما 18، وهي أعلى قيمة." />
    </div>
  </div>
}

function ConceptStep() {
  return <div className="concept-step">
    <SourceCard label="تعلّم — ص 7">
      <p>لتسهل قراءة بيانات متغيّرة بمرور الزمن نرسم شبكة إحداثية، ونضع عادةً المحور الأفقي للزمن والمحور الشاقولي للبيانات التي ندرسها، ثمّ نمثل النقاط في الشبكة، ونصل بينها، ونسمّي هذا التمثيل البياني بالخطوط.</p>
    </SourceCard>
    <div className="support-tip"><Lightbulb size={20} /><span><strong>كيف نبني هذا التمثيل خطوة بخطوة؟</strong>
      <ol className="numbered-explanation">
        <li>نرسم محورين متعامدين: الأفقي للزمن (الأيام، الأشهر، الأعوام…) والشاقولي للبيانات المدروسة (الحرارة، الطول، العدد…).</li>
        <li>نكتب عنواناً واضحاً لكل محور، وعنواناً عاماً للتمثيل نفسه.</li>
        <li>نستعمل الجدول لنضع نقطة فوق كل قيمة زمن، على ارتفاع يساوي البيانة المقابلة لها.</li>
        <li>نصل بين النقاط المتتالية بقطع مستقيمة، فنحصل على التمثيل البياني بالخطوط.</li>
      </ol>
    </span></div>
    <div className="common-mistakes"><h3>لماذا نحتاج هذا الشكل بالذات؟</h3><p>الجدول وحده يعطينا الأرقام، لكنه لا يُظهر بسهولة هل القيمة ترتفع أم تنخفض. الخط الواصل بين النقاط يجعل اتجاه التغيّر واضحاً للعين مباشرة: خط صاعد يعني تزايداً، وخط هابط يعني تناقصاً، وخط أفقي يعني ثباتاً.</p></div>
  </div>
}

function ExampleStep() {
  const fridayIndex = damascusWeek.labels.indexOf('الجمعة')
  return <div className="explain-step">
    <SourceCard label="مثال — ص 8"><p>يمكن تمثيل البيانات الواردة في الجدول السابق بيانياً بالخطوط كما يلي:</p></SourceCard>
    <LineChart series={damascusWeek} readExampleIndex={fridayIndex} ariaLabel="تمثيل بياني بالخطوط لدرجات الحرارة في دمشق خلال أسبوع" />
    <SourceCard label="القراءة من الرسم — ص 8">
      <p>مثلاً لتحديد درجة الحرارة في يوم الجمعة، نحدد على التمثيل البياني النقطة التي تأتي مباشرة فوق يوم الجمعة. تمثّل هذه النقطة الزوج المرتب <BidiText>(الجمعة، 17)</BidiText>، أي أنّ درجة الحرارة في يوم الجمعة هي <MathExpression>17</MathExpression>.</p>
      <p>ونلاحظ أيضاً انخفاض درجة الحرارة يوم الإثنين، ومن ثمّ ارتفاعها تدريجياً حتى يوم الأربعاء، وثبات درجة الحرارة يومي الأربعاء والخميس، وأخيراً بدء الانخفاض حتى يوم السبت.</p>
    </SourceCard>
    <div className="support-tip"><Lightbulb size={20} /><span><strong>كيف نتحقق من قراءتنا؟</strong><br />اسأل نفسك: هل وقفت أولاً فوق اليوم الصحيح على المحور الأفقي؟ هل صعدت شاقولياً حتى النقطة (وليس حتى خط عشوائي)؟ هل قرأت الرقم المقابل تماماً على المحور الشاقولي؟</span></div>
  </div>
}

function ReadPracticeStep() {
  const [selected, setSelected] = useState<number | null>(null)
  return <div className="grid-practice">
    <div className="interaction-card">
      <div><span className="section-kicker">تفاعل مع الرسم</span><h3>اقرأ الرسم بنفسك</h3><p>اضغط على أي نقطة على الخط لتقرأ اليوم ودرجة الحرارة المقابلة له.</p></div>
      <LineChart series={damascusWeek} interactive selectedIndex={selected} onSelect={setSelected} ariaLabel="تمثيل بياني تفاعلي لدرجات الحرارة، اضغط على نقطة لقراءتها" />
      {selected !== null && <div className="selection-result">اخترت يوم <BidiText>{damascusWeek.labels[selected]}</BidiText>، وقيمة درجة الحرارة عنده هي <MathExpression>{damascusWeek.values[selected]}</MathExpression>.</div>}
    </div>
    <div className="reading-tasks">
      <GuidedAnswer id="lg-read-tuesday" prompt="ما درجة الحرارة يوم الثلاثاء؟" checkAnswer={v => v.trim() === '16'} hint="حدد يوم الثلاثاء على المحور الأفقي، ثم اصعد إلى النقطة فوقه مباشرة." success="صحيح، درجة الحرارة يوم الثلاثاء هي 16." />
      <GuidedAnswer id="lg-read-repeat-16" prompt="ابحث عن يومين مختلفين سجّلا نفس درجة الحرارة 16. اكتب اسم أحدهما." checkAnswer={v => v.trim() === 'الأحد' || v.trim() === 'السبت'} hint="ابحث عن كل نقطة ترتفع إلى المستوى 16 بالضبط على المحور الشاقولي؛ ستجد أكثر من يوم." success="أحسنت. القيمة 16 تتكرر يومي الأحد والسبت." />
    </div>
  </div>
}

function TableFillRow({ headers, values, ids }: { headers: string[]; values: number[]; ids: string[] }) {
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const allCorrect = ids.every((id, index) => inputs[id]?.trim() === String(values[index]))
  return <div className="book-table-wrap">
    <table className="book-table">
      <thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead>
      <tbody><tr>{ids.map(id => <td key={id} className="fill-cell"><input aria-label={id} value={inputs[id] ?? ''} onChange={event => { setInputs({ ...inputs, [id]: event.target.value }); setChecked(false) }} /></td>)}</tr></tbody>
    </table>
    <div className="activity-actions"><button className="primary-button" type="button" onClick={() => setChecked(true)}>تحقق من الجدول</button></div>
    {checked && <p className={allCorrect ? 'gentle-feedback good' : 'gentle-feedback'}>{allCorrect ? 'ممتاز! كل القيم صحيحة بحسب الرسم البياني.' : 'بعض الخانات غير مطابقة بعد. راجع كل عمود على حدة: حدد نقطته على الرسم أولاً ثم اقرأ ارتفاعها.'}</p>}
  </div>
}

function HeightCheckpointStep() {
  return <div className="grid-practice">
    <div className="step-banner"><Check size={20} /><span>تحقق من فهمك</span></div>
    <SourceCard label="من الكتاب — ص 8"><p>لدى طبيب الأطفال التمثيل البياني الآتي الذي يوضّح الطول المثالي للطفل بالسنتيمتر في العام الأول:</p></SourceCard>
    <LineChart series={idealInfantHeight} ariaLabel="تمثيل بياني للطول المثالي للطفل خلال العام الأول بالأشهر" />
    <SourceCard label="من الكتاب — ص 9">
      <p>أ) املأ الجدول الآتي:</p>
      <TableFillRow headers={infantHeightTableHeaders} values={infantHeightTableMonths.map(month => idealInfantHeight.values[idealInfantHeight.labels.indexOf(String(month))])} ids={infantHeightTableMonths.map(month => `height-${month}`)} />
    </SourceCard>
    <div className="reading-tasks">
      <GuidedAnswer id="lg-p9-height-birth" prompt="ب) ما طول الطفل عند الولادة؟" checkAnswer={v => v.trim() === '50'} hint="عند الولادة يقابل الشهر صفر على المحور الأفقي؛ انظر أين تبدأ نقطة الرسم." success="صحيح، طول الطفل عند الولادة نحو 50 سم." />
    </div>
    <SourceCard label="من الكتاب — ص 9"><p>ج) إذا علمت أنّ طول طفل في عمر العام هو <MathExpression>72cm</MathExpression> فهل طول هذا الطفل قريب من الطول المثالي؟</p></SourceCard>
    <GuidedAnswer id="lg-p9-height-compare" prompt="اكتب الفرق بالسنتيمتر بين الطول المثالي عند عمر عام وبين 72، ثم قرر: هل هو قريب؟" checkAnswer={v => v.replace(/[^0-9]/g, '') === '4'} hint="الطول المثالي عند عمر عام هو نحو 76 سم. اطرح: 76 − 72." success="صحيح، الفرق 4 سم فقط، وهذا يعني أن طول 72 سم قريب جداً من الطول المثالي." />
  </div>
}

function StudentsPracticeStep() {
  const [trendChoice, setTrendChoice] = useState<string | null>(null)
  return <div className="grid-practice">
    <div className="step-banner"><TrendingUp size={20} /><span>تدرّب</span></div>
    <SourceCard label="من الكتاب — ص 9"><p>يبيّن التمثيل البياني الآتي تطوّر عدد طلاب الصف الخامس في إحدى المدارس خلال الفترة <MathExpression>2015 – 2006</MathExpression>:</p></SourceCard>
    <LineChart series={studentCountByYear} ariaLabel="تمثيل بياني لعدد طلاب الصف الخامس بين عامي 2006 و2015" />
    <SourceCard label="من الكتاب — ص 9">
      <p>والمطلوب:</p>
      <p>أ) املأ الجدول الآتي الموافق للتمثيل البياني السابق:</p>
      <TableFillRow headers={studentCountTableYears.map(String)} values={studentCountTableYears.map(year => studentCountByYear.values[studentCountByYear.labels.indexOf(String(year))])} ids={studentCountTableYears.map(year => `students-${year}`)} />
    </SourceCard>
    <div className="practice-step" style={{ padding: 0, border: 0, boxShadow: 'none' }}>
      <p>ب) هل عدد الطلاب يزداد أم يتناقص؟</p>
      <div className="choice-list">{['يزداد', 'يتناقص', 'يبقى ثابتاً'].map(option => <button key={option} className={trendChoice === option ? 'selected-choice' : ''} onClick={() => setTrendChoice(option)}>{option}</button>)}</div>
      {trendChoice && <div className="explanation-box"><Lightbulb size={18} />{trendChoice === 'يزداد' ? 'صحيح. المنحنى يتجه إلى الأعلى بشكل عام من 2006 إلى 2015.' : 'راجع اتجاه الخط: هل ينتهي أعلى من حيث بدأ أم أدنى؟ القيمة عام 2015 أكبر بكثير من قيمة عام 2006.'}</div>}
    </div>
    <GuidedAnswer id="lg-p9-students-year70" prompt="ج) في أي عام دراسي كان عدد الطلاب 70؟" checkAnswer={v => v.trim() === '2007'} hint="ابحث على المحور الشاقولي عن القيمة 70، ثم انزل منها إلى العام المقابل تحت النقطة." success="صحيح، كان عدد الطلاب 70 في عام 2007." />
  </div>
}

function MistakeCard({ id, scenario, options, correctIndex, explanation }: { id: string; scenario: string; options: string[]; correctIndex: number; explanation: string }) {
  const [choice, setChoice] = useState<number | null>(null)
  return <div className="mistake-scenario" key={id}>
    <p>{scenario}</p>
    <div className="choice-list">{options.map((option, index) => <button key={option} className={choice === index ? 'selected-choice' : ''} onClick={() => setChoice(index)}>{option}</button>)}</div>
    {choice !== null && <div className="explanation-box"><AlertTriangle size={18} />{choice === correctIndex ? explanation : 'ليس هذا بالضبط. فكّر أولاً: هل المشكلة في اختيار اليوم على المحور الأفقي، أم في قراءة الرقم على المحور الشاقولي؟'}</div>}
  </div>
}

function MistakesStep() {
  return <div className="mistake-spot">
    <div className="step-banner"><AlertTriangle size={20} /><span>اكتشف الخطأ</span></div>
    <MistakeCard id="lg-mistake-axis" scenario="أراد طالب معرفة درجة الحرارة يوم الخميس، فنظر إلى ترتيب الأيام على المحور الأفقي وقال إن الإجابة هي رقم ترتيب يوم الخميس بين الأيام. أين الخطأ؟" options={['قرأ رقم ترتيب اليوم من المحور الأفقي بدلاً من الصعود لقراءة القيمة من المحور الشاقولي', 'جمع كل الأرقام في الجدول بالخطأ', 'استعمل يوماً غير موجود في الجدول']} correctIndex={0} explanation="صحيح. المحور الأفقي يمثل الزمن فقط، والقيمة المطلوبة (درجة الحرارة) تُقرأ دائماً من المحور الشاقولي عند النقطة المقابلة لليوم." />
    <MistakeCard id="lg-mistake-interpolate" scenario="قال طالب إن درجة الحرارة «بين» يوم الثلاثاء ويوم الأربعاء كانت 17 لأن هذا الرقم يقع في المنتصف تقريباً على الرسم. أين الخطأ؟" options={['لا يوجد يوم فعلي بين الثلاثاء والأربعاء في الجدول؛ الخط بينهما يوضّح الاتجاه فقط ولا يمثل بيانات حقيقية', 'الرقم 17 غير موجود إطلاقاً في الجدول', 'يجب أن تكون كل درجات الحرارة أعداداً زوجية']} correctIndex={0} explanation="صحيح. القطعة المستقيمة بين نقطتين تساعدنا على تخيّل اتجاه التغيّر فقط، فالبيانات هنا مسجّلة ليوم كامل وليست مستمرة بين الأيام." />
  </div>
}

function RecapStep() {
  return <div className="recap-step">
    <div className="recap-icon"><RotateCcw size={24} /></div>
    <h3>خلاصة التمثيل البياني بالخطوط</h3>
    <ul>
      <li>نستعمله لعرض بيانات تتغيّر بمرور الزمن: المحور الأفقي للزمن، والمحور الشاقولي للبيانات.</li>
      <li>كل نقطة على الرسم تمثّل زوجاً مرتباً مثل <BidiText>(الجمعة، 17)</BidiText>: القيمة الأولى زمن، والثانية بيانة.</li>
      <li>نصل بين النقاط المتتالية بخطوط مستقيمة لنرى بوضوح اتجاه التغيّر: تزايد، تناقص، أو ثبات.</li>
      <li>لقراءة قيمة يوم معيّن: نقف عليه على المحور الأفقي، نصعد إلى النقطة، ثم نقرأ القيمة من المحور الشاقولي.</li>
      <li>الخط بين نقطتين يوضّح الاتجاه فقط، ولا يعني وجود بيانات حقيقية بين القيمتين.</li>
    </ul>
  </div>
}

function FinalTest() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const normalize = (value: string) => value.trim().replace(/\s+/g, ' ')
  const score = finalAssessment2.filter(question => normalize(answers[question.id] ?? '') === question.answer).length
  return <div className="final-test">
    <div className="step-banner"><Check size={20} /><span>اختبار ختامي</span></div>
    <p>هذا اختبار جديد يقيس فهمك للتمثيل البياني بالخطوط في مواقف لم ترها من قبل في الكتاب.</p>
    <LineChart series={libraryVisitorsWeek} ariaLabel="تمثيل بياني جديد لعدد زوار مكتبة المدرسة خلال خمسة أيام" />
    {finalAssessment2.map((question, index) => <label className="test-question" key={question.id}>
      <strong>{index + 1}. {question.text}</strong>
      {question.type === 'input'
        ? <input value={answers[question.id] ?? ''} onChange={event => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder="اكتب إجابتك هنا" />
        : <div className="choice-list">{question.options?.map(option => <button key={option} className={answers[question.id] === option ? 'selected-choice' : ''} onClick={() => setAnswers({ ...answers, [question.id]: option })}>{option}</button>)}</div>}
    </label>)}
    <button className="primary-button submit-test" onClick={() => setSubmitted(true)}>عرض النتيجة <Check size={17} /></button>
    {submitted && <div className="test-result"><strong>نتيجتك: {score} / {finalAssessment2.length}</strong><p>{score === finalAssessment2.length ? 'ممتاز! أصبحت تقرأ التمثيلات البيانية بالخطوط بثقة تامة.' : 'راجع الخلاصة، ثم عد إلى الأسئلة التي أخطأت فيها وحاول التفكير فيها خطوة بخطوة.'}</p></div>}
  </div>
}

export function LineGraphsLesson() {
  const steps: LessonStep[] = [
    { id: 'start', title: 'انطلاقة الدرس', content: <StepIntro /> },
    { id: 'activity', title: 'انطلاقة نشطة', content: <ActivityStep /> },
    { id: 'concept', title: 'الفكرة الأساسية', content: <ConceptStep /> },
    { id: 'example', title: 'مثال من الكتاب', content: <ExampleStep /> },
    { id: 'read-practice', title: 'اقرأ الرسم بنفسك', content: <ReadPracticeStep /> },
    { id: 'height-check', title: 'تحقق من فهمك', content: <HeightCheckpointStep /> },
    { id: 'students-practice', title: 'تدرّب', content: <StudentsPracticeStep /> },
    { id: 'mistakes', title: 'اكتشف الخطأ', content: <MistakesStep /> },
    { id: 'recap', title: 'الخلاصة', content: <RecapStep /> },
    { id: 'test', title: 'الاختبار الختامي', content: <FinalTest /> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title="التمثيلات البيانية بالخطوط" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} />
}
