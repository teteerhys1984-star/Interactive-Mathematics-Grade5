import { useState, type ReactNode } from 'react'
import { ArrowLeft, Check, CircleAlert, Lightbulb, RotateCcw, Sparkles } from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import {
  compareRationalValues, decimalForHundredths, isAcceptedVerbalHundredths, isDecimalEquivalentToHundredths,
  isHundredthsFractionInput, isStrictlyBetweenDecimals, lessonTitle, p66ComparisonItems, p66GridItems,
  p66IntroFacts, p67Examples, p68CheckOne, p68CheckThree, p68CompareExamples, p69BetweenExamples, p69CheckOne,
  p70RulerOne, p70RulerTwo, p70TableColumns, p71BetweenItems, p71ComparisonItems, p71Ex4, p71MatchDecimals,
  p71MatchFractions, p71ShadeItems, rulerMarkValue, verbalForHundredths, type ComparisonItem,
} from './decimalPartsTwoData'

/* ─────────────────────────── isolated notation ─────────────────────────── */

function L7Fraction({ numerator, denominator }: { numerator: number | string; denominator: number | string }) {
  return <span className="l7-fraction" dir="ltr" role="img" aria-label={`${numerator} على ${denominator}`}>
    <span>{numerator}</span><span className="l7-fraction-rule" aria-hidden="true" /><span>{denominator}</span>
  </span>
}

function L7Decimal({ children }: { children: ReactNode }) {
  return <MathExpression className="l7-decimal">{children}</MathExpression>
}

function SourceMarker({ id, children }: { id: string; children: ReactNode }) {
  return <div className="l7-source-marker" data-source-id={id}>{children}</div>
}

type Result = 'correct' | 'incorrect' | 'incomplete' | undefined

function CheckFeedback({ result, success, incomplete = 'أكمل المطلوب أولاً.', failure = 'ليست الإجابة المطلوبة بعد؛ راجع المقارنة أو التحويل ثم حاول مرة أخرى.' }: {
  result: Result; success: string; incomplete?: string; failure?: string
}) {
  if (!result) return null
  const text = result === 'correct' ? success : result === 'incomplete' ? incomplete : failure
  return <p className={`l7-feedback is-${result}`} role={result === 'incorrect' ? 'alert' : 'status'}>
    {result === 'correct' ? <Check size={16} aria-hidden="true" /> : <CircleAlert size={16} aria-hidden="true" />}{text}
  </p>
}

/** Visual 10 × 10 hundreds grid; `shaded` cells are counted from the top-left, row by row. */
function HundredsGrid({ shaded, label }: { shaded: number; label: string }) {
  return <div className="l7-hundreds-grid" role="img" aria-label={label} dir="ltr">
    {Array.from({ length: 100 }, (_, index) => <span key={index} className={index < shaded ? 'is-shaded' : ''} />)}
  </div>
}

/* ─────────────────────────── generic answer tasks ─────────────────────────── */

type AnswerField = { label: string; inputMode?: 'text' | 'decimal' | 'numeric' }

function AnswerTask({ id, title, prompt, fields, check, success, help, incomplete }: {
  id: string; title: string; prompt: ReactNode; fields: readonly AnswerField[]
  check: (values: readonly string[]) => boolean; success: string; help?: string; incomplete?: string
}) {
  const [values, setValues] = useState<string[]>(() => fields.map(() => ''))
  const [result, setResult] = useState<Result>()
  const verify = () => {
    if (values.some((value) => !value.trim())) { setResult('incomplete'); return }
    setResult(check(values) ? 'correct' : 'incorrect')
  }
  return <article className="l7-answer-task" data-source-id={id}>
    <div className="l7-task-heading"><span className="l7-task-index">{title}</span><div className="l7-task-prompt">{prompt}</div></div>
    <div className={`l7-task-fields ${fields.length > 1 ? 'has-many' : ''}`}>
      {fields.map((field, index) => <label className="l7-answer-field" key={`${id}-${index}`}>
        <span>{field.label}</span>
        <input type="text" inputMode={field.inputMode ?? 'text'} autoComplete="off" dir={field.inputMode === 'text' ? 'rtl' : 'ltr'} maxLength={40}
          value={values[index]} aria-label={`${title}: ${field.label}`}
          onChange={(event) => { const next = [...values]; next[index] = event.currentTarget.value; setValues(next); setResult(undefined) }} />
      </label>)}
    </div>
    <div className="l7-task-actions"><button type="button" className="l7-check-button" onClick={verify}>تحقّق</button>{help && <span className="l7-task-hint">{help}</span>}</div>
    <CheckFeedback result={result} success={success} incomplete={incomplete} />
  </article>
}

/** Comparison with a printed relation box: the learner selects <, >, or =. */
function OperatorTask({ item }: { item: ComparisonItem }) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<Result>()
  const verify = () => {
    if (!answer) { setResult('incomplete'); return }
    const actual = compareRationalValues(item.left, item.right)
    const expected = item.relation === '<' ? -1 : item.relation === '>' ? 1 : 0
    setResult(actual === expected && answer === item.relation ? 'correct' : 'incorrect')
  }
  return <article className="l7-operator-task" data-source-id={item.id}>
    <span className="l7-task-index">({item.label})</span>
    <div className="l7-comparison-expression" dir="ltr">
      <MathExpression>{item.left}</MathExpression>
      <label className="l7-operator-select"><span className="visually-hidden">رمز المقارنة للبند {item.label}</span>
        <select value={answer} aria-label={`رمز المقارنة للبند ${item.label}`} onChange={(event) => { setAnswer(event.currentTarget.value); setResult(undefined) }}>
          <option value="">□</option><option value="&lt;">&lt;</option><option value="&gt;">&gt;</option><option value="=">=</option>
        </select>
      </label>
      <MathExpression>{item.right}</MathExpression>
    </div>
    <button type="button" className="l7-check-button is-compact" onClick={verify}>تحقّق</button>
    <CheckFeedback result={result} success="صحيح؛ الرمز يعبّر عن العلاقة بين القيمتين." incomplete="اختر الرمز أولاً." />
  </article>
}

/** Ruler exercise: one printed mark, every other interior mark is an input (0.01 spacing). */
function RulerTask({ id, title, from, to, printed }: { id: string; title: string; from: number; to: number; printed: number }) {
  const marks = Array.from({ length: to - from - 1 }, (_, index) => from + index + 1)
  const blanks = marks.filter((mark) => mark !== printed)
  const [values, setValues] = useState<Record<number, string>>({})
  const [result, setResult] = useState<Result>()
  const verify = () => {
    if (blanks.some((mark) => !values[mark]?.trim())) { setResult('incomplete'); return }
    setResult(blanks.every((mark) => isDecimalEquivalentToHundredths(values[mark], mark)) ? 'correct' : 'incorrect')
  }
  return <article className="l7-ruler-task" data-source-id={id}>
    <span className="l7-task-index">{title}</span>
    <div className="l7-ruler" dir="ltr" aria-label={`خط أعداد من ${rulerMarkValue(from)} إلى ${rulerMarkValue(to)}`}>
      <span className="l7-ruler-end"><MathExpression>{rulerMarkValue(from)}</MathExpression></span>
      {marks.map((mark) => <span className="l7-ruler-mark" key={mark}>
        {mark === printed ? <b><MathExpression>{rulerMarkValue(mark)}</MathExpression></b>
          : <label><span className="visually-hidden">قيمة التدريجة {rulerMarkValue(mark)}</span>
            <input type="text" inputMode="decimal" dir="ltr" value={values[mark] ?? ''} aria-label={`قيمة التدريجة عند ${rulerMarkValue(mark)}`}
              onChange={(event) => { const v = event.currentTarget.value; setValues((current) => ({ ...current, [mark]: v })); setResult(undefined) }} /></label>}
        <i aria-hidden="true" />
      </span>)}
      <span className="l7-ruler-end"><MathExpression>{rulerMarkValue(to)}</MathExpression></span>
    </div>
    <div className="l7-task-actions"><button type="button" className="l7-check-button is-compact" onClick={verify}>تحقّق من الخط</button></div>
    <CheckFeedback result={result} success="صحيح؛ كل خطوة تساوي 0.01، أي جزءاً من مئة." incomplete="أكمل كل التدريجات الفارغة أولاً." failure="تحقّق من أن كل تدريجة تزيد 0.01 عن السابقة." />
  </article>
}

/** Table exercise ③: each column pairs a printed decimal with a fraction, one side blank. */
function TableTask() {
  const [values, setValues] = useState<string[]>(() => p70TableColumns.map(() => ''))
  const [result, setResult] = useState<Result>()
  const verify = () => {
    if (values.some((value) => !value.trim())) { setResult('incomplete'); return }
    const ok = p70TableColumns.every((column, index) => column.printed === 'decimal'
      ? isHundredthsFractionInput(values[index], column.numerator)
      : isDecimalEquivalentToHundredths(values[index], column.numerator))
    setResult(ok ? 'correct' : 'incorrect')
  }
  return <div className="l7-table-task" data-source-id="l7-p70-table">
    <div className="l7-table-scroll" dir="ltr"><table>
      <thead><tr>{p70TableColumns.map((column, index) => <th key={column.id} data-source-id={column.id}>{index + 1}</th>)}<th className="l7-table-rowhead">الجدول</th></tr></thead>
      <tbody>
        <tr><td>{p70TableColumns.map((column) => column.printed === 'fraction' ? <span key={column.id} className="l7-cell-printed"><L7Fraction numerator={column.numerator} denominator={100} /></span> : <input key={column.id} aria-label={`الكسر في العمود ${p70TableColumns.indexOf(column) + 1}`} dir="ltr" inputMode="numeric" value={values[p70TableColumns.indexOf(column)]} onChange={(event) => { const next = [...values]; next[p70TableColumns.indexOf(column)] = event.currentTarget.value; setValues(next); setResult(undefined) }} />)}</td><th className="l7-table-rowhead">الكسر</th></tr>
        <tr><td>{p70TableColumns.map((column) => column.printed === 'decimal' ? <span key={column.id} className="l7-cell-printed"><L7Decimal>{column.value}</L7Decimal></span> : <input key={column.id} aria-label={`الكتابة العشرية في العمود ${p70TableColumns.indexOf(column) + 1}`} dir="ltr" inputMode="decimal" value={values[p70TableColumns.indexOf(column)]} onChange={(event) => { const next = [...values]; next[p70TableColumns.indexOf(column)] = event.currentTarget.value; setValues(next); setResult(undefined) }} />)}</td><th className="l7-table-rowhead">الكتابة العشرية</th></tr>
      </tbody>
    </table></div>
    <button type="button" className="l7-check-button" onClick={verify}>تحقّق من الجدول</button>
    <CheckFeedback result={result} success="صحيح؛ كل عمود يربط الكسر بكتابته العشرية." incomplete="أكمل الخانات الفارغة كلها أولاً." />
  </div>
}

/** Shading exercise ⑤: learners click cells of a 10 × 10 grid; the count must equal the printed hundredths. */
function ShadeTask({ id, title, decimal, cells }: { id: string; title: string; decimal: string; cells: number }) {
  const [shaded, setShaded] = useState<ReadonlySet<number>>(() => new Set())
  const [result, setResult] = useState<Result>()
  const toggle = (index: number) => {
    setShaded((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next })
    setResult(undefined)
  }
  const verify = () => setResult(shaded.size === 0 ? 'incomplete' : shaded.size === cells ? 'correct' : 'incorrect')
  return <article className="l7-shade-task" data-source-id={id}>
    <span className="l7-task-index">{title}</span>
    <p>ظلّل من الشبكة عدداً من الخانات يعبّر عن <L7Decimal>{decimal}</L7Decimal>.</p>
    <div className="l7-shade-grid" dir="ltr" role="group" aria-label={`شبكة ${decimal}`}>
      {Array.from({ length: 100 }, (_, index) => <button key={index} type="button" className={shaded.has(index) ? 'is-shaded' : ''} aria-pressed={shaded.has(index)} aria-label={`خانة ${index + 1}`} onClick={() => toggle(index)} />)}
    </div>
    <p className="l7-shade-count" aria-live="polite">الخانات المظللة: <strong>{shaded.size}</strong> من 100</p>
    <div className="l7-task-actions"><button type="button" className="l7-check-button is-compact" onClick={verify}>تحقّق من التظليل</button></div>
    <CheckFeedback result={result} success={`صحيح: ${cells} خانة من 100 تساوي ${decimal}.`} incomplete="ظلّل خانة واحدة على الأقل أولاً." failure="عدد الخانات المظللة لا يساوي البسط المطلوب؛ عُدّ من 100." />
  </article>
}

/** Matching exercise ⑦: the decimal in column أ, a fraction (denominator 100) in column ب. */
function MatchTask() {
  const [choice, setChoice] = useState<Record<string, string>>({})
  const [result, setResult] = useState<Result>()
  const verify = () => {
    if (p71MatchDecimals.some((item) => !choice[item.id])) { setResult('incomplete'); return }
    setResult(p71MatchDecimals.every((item) => choice[item.id] === item.answer) ? 'correct' : 'incorrect')
  }
  return <div className="l7-match-task" data-source-id="l7-p71-ex7">
    {p71MatchDecimals.map((item) => <fieldset className="l7-match-row" key={item.id} data-source-id={item.id}>
      <legend><L7Decimal>{item.value}</L7Decimal> ↔ اختر الكسر المساوي</legend>
      <select aria-label={`الكسر المساوي للعدد ${item.value}`} value={choice[item.id] ?? ''} onChange={(event) => { setChoice((current) => ({ ...current, [item.id]: event.currentTarget.value })); setResult(undefined) }}>
        <option value="">اختر</option>
        {p71MatchFractions.map((fraction) => <option key={fraction} value={fraction}>{fraction}</option>)}
      </select>
    </fieldset>)}
    <button type="button" className="l7-check-button" onClick={verify}>تحقّق من المطابقة</button>
    <CheckFeedback result={result} success="كل المطابقات صحيحة. هذه الأزواج حُسبت بالقيمة، ولم تكن مرسومة في المصدر." incomplete="اختر كسراً لكل عدد عشري." failure="راجع القيمة: 0.5 تساوي 50/100، و0.07 تساوي 7/100." />
  </div>
}

/** A true/false statement: the learner decides, and the counterexample is shown after the verdict. */
function StatementTask() {
  const [answer, setAnswer] = useState<'true' | 'false' | ''>('')
  const [result, setResult] = useState<Result>()
  const verify = () => {
    if (!answer) { setResult('incomplete'); return }
    setResult(answer === 'false' ? 'correct' : 'incorrect')
  }
  return <article className="l7-statement-task" data-source-id="l7-p69-check2">
    <p>«عند مقارنة الأجزاء العشرية، فإن العدد الذي فيه خانتان إلى يمين الفاصلة يكون أكبر من العدد الذي فيه خانة واحدة إلى يمين الفاصلة.»</p>
    <div className="l7-truth-options" role="radiogroup" aria-label="حكم العبارة">
      {(['true', 'false'] as const).map((value) => <label key={value} className={answer === value ? 'is-selected' : ''}>
        <input type="radio" name="l7-statement" value={value} checked={answer === value} onChange={() => { setAnswer(value); setResult(undefined) }} />
        {value === 'true' ? 'صحيحة' : 'غير صحيحة'}
      </label>)}
    </div>
    <button type="button" className="l7-check-button" onClick={verify}>تحقّق</button>
    <CheckFeedback result={result} success="صحيح: العبارة غير صحيحة. مثال مضاد: 0.5 أكبر من 0.12، مع أن 0.12 فيه خانتان بعد الفاصلة." incomplete="اختر حكماً أولاً." failure="فكّر في مثال: هل قيمة العدد تعتمد على عدد الخانات أم على قيمتها؟" />
  </article>
}

/* ─────────────────────────── platform labs ─────────────────────────── */

function HundredsLab() {
  const [count, setCount] = useState(14)
  const verbal = count === 0 ? 'صفر' : count === 100 ? 'مئة جزء من مئة' : `${verbalForHundredths(count)} جزءاً من مئة`
  return <section className="l7-platform-lab" aria-labelledby="l7-lab-title" data-platform-activity="l7-hundreds-slider">
    <div className="l7-source-label is-platform"><Sparkles size={14} aria-hidden="true" /> مختبر تفاعلي · من إعداد المنصة</div>
    <h3 id="l7-lab-title">حرّك المؤشر: كم جزءاً من مئة اخترت؟</h3>
    <p>كل خطوة تلوّن خانة واحدة من الشبكة. لاحظ الكسر والكتابة العشرية واللفظ يتغيّرون معاً.</p>
    <label className="l7-slider-label"><span>عدد الخانات المظللة: <strong>{count}</strong> من 100</span>
      <input type="range" min="0" max="100" step="1" value={count} onChange={(event) => setCount(Number(event.currentTarget.value))} aria-valuetext={`${count} من مئة`} />
    </label>
    <div className="l7-lab-readout">
      <HundredsGrid shaded={count} label={`${count} خانة مظللة من 100`} />
      <div className="l7-lab-values">
        <div><L7Fraction numerator={count} denominator={100} /><span aria-hidden="true">=</span><L7Decimal>{decimalForHundredths(count)}</L7Decimal></div>
        <p>اللفظ: {verbal}.</p>
      </div>
    </div>
  </section>
}

/* ─────────────────────────── step 1 · start with hundredths ─────────────────────────── */

function StartStep() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">01</span><div><p>الأجزاء من مئة تظهر حولنا: الأرض، والمكعبات، وحتى دماغ النملة.</p><strong>المقام 100 يعني أن الكل مقسوم إلى مئة جزء متساوٍ.</strong></div></div>
    <SourceMarker id="l7-p66-title"><SourceCard label="من الكتاب · ص66 · سنتعلّم">
      <p>الأهداف المطبوعة: كتابة الأجزاء من مئة كتابة عشرية، والتعبير اللفظي عنها، ومقارنة الأجزاء من مئة.</p>
    </SourceCard></SourceMarker>
    <SourceMarker id={p66IntroFacts.earth.id}><SourceCard label="من الكتاب · ص66 · المقدمة">
      <p>{p66IntroFacts.earth.text}</p>
      <div className="l7-fact-row"><L7Fraction numerator={24} denominator={100} /><span>من سطح الأرض</span></div>
    </SourceCard></SourceMarker>
    <SourceMarker id={p66IntroFacts.ant.id}><SourceCard label="من الكتاب · ص66 · المقدمة">
      <p>{p66IntroFacts.ant.text} لو قسّمنا الغرام إلى مئة قسم متساوٍ، فإن دماغ النملة قسم واحد منها.</p>
      <div className="l7-fact-row"><L7Fraction numerator={1} denominator={100} /><span>من الغرام</span></div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p66-cube"><SourceCard label="من الكتاب · ص66 · انطلاقة نشطة">
      <p>يمكن تقسيم المكعب المجاور إلى مئة شريحة متساوية على شكل شبكة 10 × 10.</p>
      <HundredsGrid shaded={0} label="شبكة 10 × 10 تمثل مئة شريحة متساوية" />
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p66-definition"><SourceCard label="من الكتاب · ص66 · تعلّم ①">
      <p>عندما يكون مقام الكسر العدد 100 وبسطه أحد الأعداد من 1 إلى 99، فيمكن التعبير عنه بكتابة عشرية.</p>
    </SourceCard></SourceMarker>
    <aside className="l7-platform-note-box"><strong>توضيح من المنصة:</strong> إذا كانت الشبكة 10 × 10 مظللة بعدد n من الخانات، فإن قيمتها n/100.</aside>
  </div>
}

/* ─────────────────────────── step 2 · fraction to decimal ─────────────────────────── */

function DecimalFormStep() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">02</span><div><p>الكتابة العشرية أبسط للأجزاء من مئة.</p><strong>الخانتان بعد الفاصلة تمثلان البسط من 100.</strong></div></div>
    <SourceMarker id="l7-p67-decimal-form"><SourceCard label="من الكتاب · ص67 · أبسط الكتابة العشرية">
      <p>الكتابة العشرية 0.□□: الصفر قبل الفاصلة، ثم الفاصلة، ثم خانتان تعبّران عن عدد الأجزاء من مئة؛ أي إن الخانتين هما البسط.</p>
      <div className="l7-decimal-diagram" dir="ltr"><span>0</span><span className="l7-dot">.</span><span className="l7-digit">□</span><span className="l7-digit">□</span></div>
    </SourceCard></SourceMarker>
    <div className="l7-example-grid" data-source-id="l7-p67-examples">
      {p67Examples.map((item) => <SourceMarker id={item.id} key={item.id}><SourceCard label={`من الكتاب · ص67 · ${item.numerator}/100`}>
        <div className="l7-example-visual"><HundredsGrid shaded={item.numerator} label={`${item.numerator} خانة من 100`} /></div>
        <p className="l7-example-line"><L7Fraction numerator={item.numerator} denominator={100} /> = <L7Decimal>{item.decimal}</L7Decimal></p>
        <p>لفظياً: {item.verbal}.</p>
      </SourceCard></SourceMarker>)}
    </div>
    <aside className="l7-rule-card"><strong>قاعدة من الكتاب:</strong> عندما يكون البسط عدداً من خانة واحدة، نضع صفراً إلى يساره حتى نعبّر عنه بالأجزاء من مئة عشرياً.<p className="l7-rule-example"><L7Fraction numerator={5} denominator={100} /> = <L7Decimal>0.05</L7Decimal></p></aside>
    <SourceMarker id="l7-p67-hundred-one"><SourceCard label="من الكتاب · ص67 · كل مئة تعادل 1">
      <p>كل مئة جزء من مئة تعادل الواحد الكامل.</p>
      <div className="l7-equation-chain" dir="ltr"><L7Fraction numerator={100} denominator={100} /><span>=</span><L7Decimal>1</L7Decimal></div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p67-trailing-zeros"><SourceCard label="من الكتاب · ص67 · الأصفار إلى اليمين">
      <p>يمكن الاستغناء عن الأصفار الواقعة إلى يمين الأجزاء العشرية دون أن تتأثر قيمة العدد.</p>
      <div className="l7-equation-chain" dir="ltr"><L7Fraction numerator={3} denominator={10} /><span>=</span><L7Decimal>0.3</L7Decimal></div>
      <div className="l7-equation-chain" dir="ltr"><L7Fraction numerator={30} denominator={100} /><span>=</span><L7Decimal>0.30</L7Decimal></div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p68-equal-examples"><SourceCard label="من الكتاب · ص68 · مثال">
      <p>مثال مطبوع: <L7Decimal>0.4 = 0.40</L7Decimal> و<L7Decimal>0.5 = 0.50</L7Decimal>.</p>
    </SourceCard></SourceMarker>
    <HundredsLab />
  </div>
}

/* ─────────────────────────── step 3 · compare hundredths ─────────────────────────── */

function CompareStep() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">03</span><div><p>قارن الأجزاء من مئة كما تقارن الأعداد التي لها الخانات نفسها.</p><strong>إذا تساوت المقامات، نقارن البسطين؛ وإذا اختلفت، نوحّدها أولاً.</strong></div></div>
    <div data-source-id="l7-p68-compare-examples">{p68CompareExamples.map((item, index) => <SourceMarker id={item.id} key={item.id}><SourceCard label={`من الكتاب · ص68 · المثال ${index + 1}`}>
      <p>قارن <L7Decimal>{item.left}</L7Decimal> و<L7Decimal>{item.right}</L7Decimal>.</p>
      <div className="l7-compare-visual">
        <div><L7Fraction numerator={Math.round(Number(item.left) * 100)} denominator={100} /><span>{Math.round(Number(item.left) * 100)} بالمئة</span></div>
        <span aria-hidden="true" className="l7-compare-relation">{item.relation}</span>
        <div><L7Fraction numerator={Math.round(Number(item.right) * 100)} denominator={100} /><span>{Math.round(Number(item.right) * 100)} بالمئة</span></div>
      </div>
      <p>النتيجة المطبوعة: <L7Decimal>{`${item.left} ${item.relation} ${item.right}`}</L7Decimal>.</p>
    </SourceCard></SourceMarker>)}</div>
    <SourceMarker id="l7-p68-compare-rule"><SourceCard label="من الكتاب · ص68 · ملاحظة المقامين المختلفين">
      <p>عند مقارنة كسرين لهما مقامان مختلفان، نوحّد المقامين أولاً، ثم نجعل عدد الخانات بعد الفاصلة هو نفسه في العددين.</p>
      <div className="l7-table-compact" dir="ltr"><div><span>0.13</span><span>0.3</span></div><div><span>0.13</span><span>0.30</span></div></div>
      <p>نقارن الأجزاء فنجد أن <L7Decimal>0.13 &lt; 0.30</L7Decimal> لأن <L7Decimal>13 &lt; 30</L7Decimal>.</p>
    </SourceCard></SourceMarker>
    <section className="l7-platform-lab l7-compare-lab"><div className="l7-source-label is-platform"><Lightbulb size={14} aria-hidden="true" /> طريقة سريعة من إعداد المنصة</div>
      <h3>ثلاث خطوات للمقارنة</h3>
      <ol><li>اكتب كل عدد بخانتين بعد الفاصلة.</li><li>قارن الخانتين بعد الفاصلة كعددين صحيحين.</li><li>تذكّر أن <L7Decimal>0.3 = 0.30</L7Decimal> دون تغيير القيمة.</li></ol>
    </section>
  </div>
}

/* ─────────────────────────── step 4 · tenths, hundredths and the number line ─────────────────────────── */

function NumberLineStep() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">04</span><div><p>العشرة والمئة متصلتان على خط الأعداد.</p><strong>كل عشرة أجزاء من مئة تعادل جزءاً واحداً من عشرة.</strong></div></div>
    <SourceMarker id="l7-p69-relation"><SourceCard label="من الكتاب · ص69 · لاحظ">
      <p>كل عشرة أجزاء من مئة تعادل جزءاً واحداً من عشرة.</p>
      <div className="l7-equation-chain" dir="ltr"><L7Fraction numerator={10} denominator={100} /><span>=</span><L7Fraction numerator={1} denominator={10} /></div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p69-numberline"><SourceCard label="من الكتاب · ص69 · خط الأعداد">
      <p>التدرجات الكبيرة من 0 إلى 1 تقابل الأعشار، والتكبير بين 0 و0.1 يبيّن المئات.</p>
      <div className="l7-numberline" dir="ltr" aria-label="خط أعداد من 0 إلى 1 مع الأعشار">
        {Array.from({ length: 11 }, (_, index) => <span key={index} className="l7-numberline-mark"><b>{index / 10}</b></span>)}
      </div>
    </SourceCard></SourceMarker>
    <div data-source-id="l7-p69-between">{p69BetweenExamples.map((item) => <SourceMarker id={item.id} key={item.id}><SourceCard label={`من الكتاب · ص69 · بين ${item.lower} و${item.upper}`}>
      <p>مثال مطبوع: أعطِ عدداً يقع بين <L7Decimal>{item.lower}</L7Decimal> و<L7Decimal>{item.upper}</L7Decimal>، مثل <L7Decimal>{item.printedAnswer}</L7Decimal>.</p>
      <p>نكتب الأعداد بخانتين بعد الفاصلة، فنرى أن <L7Decimal>{`${item.lower} < ${item.printedAnswer} < ${item.upper}`}</L7Decimal>.</p>
    </SourceCard></SourceMarker>)}</div>
  </div>
}

/* ─────────────────────────── step 5 · checks (pp. 66–68) ─────────────────────────── */

function CheckStepPages66to68() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">05</span><div><p>طبّق الكسور والكتابة العشرية على ما قرأته في المقدمة والتمارين.</p><strong>المقام المطبوع 100 يحدد الخانتين بعد الفاصلة.</strong></div></div>
    <SourceMarker id="l7-p66-ex1"><SourceCard label="من الكتاب · ص66 · التمرين 1">
      <p>أكمل الفراغات لتعبّر عن عدد الأجزاء الملوّنة من 100.</p>
      <div className="l7-answer-list">{p66GridItems.map((item) => <AnswerTask key={item.id} id={item.id} title={`(${item.label}) المكعب`}
        prompt={<span>عدد الشرائح الزرقاء من أصل 100.</span>} fields={[{ label: 'البسط', inputMode: 'numeric' }]}
        check={(values) => Number(values[0]) === item.numerator} success={`صحيح: ${item.numerator}/100.`} incomplete="أدخل عدد الشرائح الزرقاء." />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p66-ex2"><SourceCard label="من الكتاب · ص66 · التمرين 2">
      <p>ضع الرمز المناسب في كل مربع.</p>
      <div className="l7-operator-list">{p66ComparisonItems.map((item) => <OperatorTask key={item.id} item={item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p68-check1"><SourceCard label="من الكتاب · ص68 · تحقّق من فهمك ①">
      <p>عد إلى مقدمة الدرس واكتب الكسرين الواردين فيها كتابة عشرية ثم لفظية.</p>
      <div className="l7-answer-list">{p68CheckOne.map((item) => <AnswerTask key={item.id} id={item.id} title={item.label}
        prompt={<span>الكسر <L7Fraction numerator={item.numerator} denominator={100} /></span>}
        fields={[{ label: 'الكتابة العشرية', inputMode: 'decimal' }, { label: 'بالكلمات' }]}
        check={(values) => isDecimalEquivalentToHundredths(values[0], item.numerator) && isAcceptedVerbalHundredths(values[1], item.numerator)}
        success={`أحسنت: ${decimalForHundredths(item.numerator)}، ${verbalForHundredths(item.numerator)} جزءاً من مئة.`} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p68-check2"><SourceCard label="من الكتاب · ص68 · تحقّق من فهمك ②">
      <p>اكتب التعبير اللفظي عن <L7Decimal>0.07</L7Decimal>، ثم الكسر المساوي له الذي مقامه 100.</p>
      <AnswerTask id="l7-p68-check2" title="0.07" prompt={<L7Decimal>0.07</L7Decimal>}
        fields={[{ label: 'التعبير اللفظي' }, { label: 'الكسر', inputMode: 'numeric' }]}
        check={(values) => isAcceptedVerbalHundredths(values[0], 7) && isHundredthsFractionInput(values[1], 7)}
        success="صحيح: سبعة أجزاء من مئة، والكسر 7/100." />
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p68-check3"><SourceCard label="من الكتاب · ص68 · تحقّق من فهمك ③">
      <p>اكتب بالكتابة العشرية كلاً من الكسرين.</p>
      <div className="l7-answer-list">{p68CheckThree.map((item) => <AnswerTask key={item.id} id={item.id} title={`البند ${item.label}`}
        prompt={<L7Fraction numerator={item.numerator} denominator={100} />} fields={[{ label: 'الكتابة العشرية', inputMode: 'decimal' }]}
        check={(values) => isDecimalEquivalentToHundredths(values[0], item.numerator)} success={`صحيح: ${decimalForHundredths(item.numerator)}.`} />)}</div>
    </SourceCard></SourceMarker>
  </div>
}

/* ─────────────────────────── step 6 · checks (p. 69) ─────────────────────────── */

function CheckStepPage69() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">06</span><div><p>قارن الأعداد العشرية التي تختلف في عدد الخانات بعد الفاصلة.</p><strong>قارن القيمة، لا عدد الخانات وحده.</strong></div></div>
    <SourceMarker id="l7-p69-check1"><SourceCard label="من الكتاب · ص69 · تحقّق من فهمك ①">
      <p>ضع الرمز المناسب (&lt; أو &gt; أو =) في كل مربع.</p>
      <div className="l7-operator-list is-six">{p69CheckOne.map((item) => <OperatorTask key={item.id} item={item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p69-check2"><SourceCard label="من الكتاب · ص70 · تحقّق من فهمك ②">
      <p>اقرأ العبارة الآتية ثم ناقش هل هي صحيحة أم لا.</p>
      <StatementTask />
    </SourceCard></SourceMarker>
  </div>
}

/* ─────────────────────────── step 7 · practice ① ② (p. 70) ─────────────────────────── */

function PracticeStepOne() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">07</span><div><p>أكمل خطوط الأعداد بالخطوة 0.01.</p><strong>كل تدريجة بعد الأخرى تزيد جزءاً واحداً من مئة.</strong></div></div>
    <SourceMarker id={p70RulerOne.id}><SourceCard label="من الكتاب · ص70 · تدرّب ①">
      <p>ضع العدد المناسب في الخانات بالكتابة العشرية بين 0.3 و0.4.</p>
      <RulerTask id={p70RulerOne.id} title="بين 0.3 و0.4" from={p70RulerOne.from} to={p70RulerOne.to} printed={p70RulerOne.printed} />
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p70-practice2"><SourceCard label="من الكتاب · ص70 · تدرّب ②">
      <p>ضع العدد المناسب في الخانات بالكتابة العشرية.</p>
      {p70RulerTwo.map((item) => <RulerTask key={item.id} id={item.id} title={`(${item.label})`} from={item.from} to={item.to} printed={item.printed} />)}
    </SourceCard></SourceMarker>
  </div>
}

/* ─────────────────────────── step 8 · practice ③ ④ ⑤ ─────────────────────────── */

function PracticeStepTwo() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">08</span><div><p>حوّل بين الكسر والكتابة العشرية، واستعمل الشبكة للتحقق.</p><strong>الخانتان بعد الفاصلة تقابلان مقام 100.</strong></div></div>
    <SourceMarker id="l7-p70-table"><SourceCard label="من الكتاب · ص70 · تدرّب ③">
      <p>أكمل الجدول الآتي.</p>
      <TableTask />
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p71-ex4"><SourceCard label="من الكتاب · ص71 · تدرّب ④">
      <p>اكتب العدد الذي تحته خط في الجملة الآتية كتابة عشرية ثم على شكل كسر: حوالي 70 بالمئة من سطح الأرض مغطى بالمياه.</p>
      <AnswerTask id={p71Ex4.id} title="70 بالمئة" prompt={<span>حوالي 70 بالمئة من سطح الأرض مغطى بالمياه.</span>}
        fields={[{ label: 'الكتابة العشرية', inputMode: 'decimal' }, { label: 'الكسر', inputMode: 'numeric' }]}
        check={(values) => isDecimalEquivalentToHundredths(values[0], 70) && isHundredthsFractionInput(values[1], 70)}
        success="صحيح: 0.70 (أو 0.7) و70/100، والكسر المبسّط 7/10." />
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p71-ex5"><SourceCard label="من الكتاب · ص71 · تدرّب ⑤">
      <p>ظلّل جزءاً مناسباً من الشكل لتعبّر عن العدد العشري المرافق في كل مما يأتي.</p>
      <div className="l7-shade-list">{p71ShadeItems.map((item) => <ShadeTask key={item.id} id={item.id} title={`(${item.label})`} decimal={item.decimal} cells={item.cells} />)}</div>
    </SourceCard></SourceMarker>
  </div>
}

/* ─────────────────────────── step 9 · practice ⑥ ⑦ ⑧ and summary ─────────────────────────── */

function PracticeStepThree() {
  return <div className="l7-step-content">
    <div className="l7-step-intro"><span className="l7-step-number">09</span><div><p>قارن، وطابق، ثم اختر عدداً بين حدّين.</p><strong>الحد المطبوع في المجال المفتوح لا يُحسب ضمن الإجابة.</strong></div></div>
    <SourceMarker id="l7-p71-ex6"><SourceCard label="من الكتاب · ص71 · تدرّب ⑥">
      <p>ضع الرمز المناسب (&lt; أو &gt; أو =) في كل مربع.</p>
      <div className="l7-operator-list is-six">{p71ComparisonItems.map((item) => <OperatorTask key={item.id} item={item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p71-ex7"><SourceCard label="من الكتاب · ص71 · تدرّب ⑦">
      <p>صل العدد من العمود (أ) بالكسر المساوي له من العمود (ب). المصدر لا يرسم خطوط وصل.</p>
      <MatchTask />
    </SourceCard></SourceMarker>
    <SourceMarker id="l7-p71-ex8"><SourceCard label="من الكتاب · ص71 · تدرّب ⑧">
      <p>ضع عدداً مناسباً من اختيارك في المربع.</p>
      <div className="l7-answer-list">{p71BetweenItems.map((item) => <AnswerTask key={item.id} id={item.id} title={`(${item.label})`}
        prompt={<span><L7Decimal>{item.lower}</L7Decimal> &lt; □ &lt; <L7Decimal>{item.upper}</L7Decimal></span>}
        fields={[{ label: 'العدد الذي اخترته', inputMode: 'decimal' }]}
        check={(values) => isStrictlyBetweenDecimals(values[0], item.lower, item.upper)}
        success={`صحيح؛ اختيارك يقع بين ${item.lower} و${item.upper}. لا يوجد جواب واحد.`} />)}</div>
    </SourceCard></SourceMarker>
    <section className="l7-summary-card" data-platform-activity="l7-summary">
      <div className="l7-source-label is-platform"><Sparkles size={14} aria-hidden="true" /> خلاصة من إعداد المنصة</div>
      <h3>ثلاث أفكار تتذكّرها</h3>
      <ul>
        <li><L7Fraction numerator={7} denominator={100} /> تُكتب <L7Decimal>0.07</L7Decimal>، وتُقرأ «سبعة أجزاء من مئة».</li>
        <li>قارن بعد توحيد عدد الخانات بعد الفاصلة.</li>
        <li><L7Fraction numerator={10} denominator={100} /> = <L7Fraction numerator={1} denominator={10} />، و<L7Fraction numerator={100} denominator={100} /> = 1.</li>
      </ul>
      <a className="l7-test-link" href="#tests/run/lesson-decimal-parts-two-test">انتقل إلى اختبار الدرس المستقل · 20 سؤالاً <ArrowLeft size={17} aria-hidden="true" /></a>
      <p className="l7-platform-note"><RotateCcw size={14} aria-hidden="true" /> أعد الخطوات أو الأنشطة متى شئت؛ إجابات الأنشطة لا تُسجَّل في الاختبار المستقل.</p>
    </section>
  </div>
}

const steps: LessonStep[] = [
  { id: 'start-hundredths', title: 'ابدأ بالأجزاء من مئة', content: <StartStep /> },
  { id: 'decimal-hundredths', title: 'من الكسر إلى الكتابة العشرية', content: <DecimalFormStep /> },
  { id: 'compare-hundredths', title: 'قارن الأجزاء من مئة', content: <CompareStep /> },
  { id: 'number-line', title: 'العشرة والمئة على خط الأعداد', content: <NumberLineStep /> },
  { id: 'checks-66-68', title: 'تحقّق من فهمك · ص66–68', content: <CheckStepPages66to68 /> },
  { id: 'checks-69', title: 'تحقّق من فهمك · ص69', content: <CheckStepPage69 /> },
  { id: 'practice-p70-a', title: 'تدرّب ① و② · ص70', content: <PracticeStepOne /> },
  { id: 'practice-p70-b', title: 'تدرّب ③ و④ و⑤ · ص70–71', content: <PracticeStepTwo /> },
  { id: 'practice-p71', title: 'تدرّب ⑥ و⑦ و⑧ · ص71', content: <PracticeStepThree /> },
]

export function DecimalPartsTwoLesson() {
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title={lessonTitle} steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="l7-decimal-two" />
}
