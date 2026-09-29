import { useMemo, useState, type ReactNode } from 'react'
import { AlertTriangle, Award, Check, Compass, Flag, Lightbulb, ListChecks, Sparkles, Target } from 'lucide-react'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import { ColumnOperation } from '../components/lesson/ColumnOperation'
import { MathExpression } from '../components/MathExpression'
import { BidiText } from '../components/BidiText'
import type { LessonStep } from '../components/lesson/types'
import {
  additionChecks, applicationProblems, australiaCheck, computeResult,
  digitAt, drillItems, fillPuzzles, fmt, invoiceExample, itemExpression, laptopExample, laptopPrintedAnswer,
  refineryExample, subtractionChecks, subtractionExample, threeAddendsExample, warmupItems,
  type CalcItem, type FillPuzzle,
} from './additionSubtractionData'
import { finalAssessment5 } from '../teacher/lesson5'

const norm = (value: string) => value.replace(/[\s,،_]/g, '')

// ── Small reusable interaction: try it yourself, then reveal the column solution ──
function SelfCheck({ item, prompt }: { item: CalcItem; prompt?: string }) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [showColumns, setShowColumns] = useState(false)
  const answer = computeResult(item.operands, item.operator)
  const correct = norm(value) === String(answer)
  return (
    <div className="self-check">
      <p className="self-check-prompt">{prompt ?? 'احسب:'} <span className="math-expression" dir="ltr">{itemExpression(item)} =</span></p>
      <div className="answer-row">
        <input inputMode="numeric" dir="ltr" value={value} aria-label={`answer-${item.id}`} placeholder="؟"
          onChange={e => { setValue(e.target.value); setChecked(false) }} />
        <button className="primary-button" onClick={() => setChecked(true)}>تحقّق</button>
      </div>
      {checked && value !== '' && (
        <p className={correct ? 'gentle-feedback good' : 'gentle-feedback'}>
          {correct ? `أحسنت! الناتج ${fmt(answer)}.` : 'لم يضبط بعد — رتّب الخانات وابدأ من الآحاد، وانتبه للحمل أو الاستلاف.'}
        </p>
      )}
      <button className="reveal-button" onClick={() => setShowColumns(s => !s)}>
        {showColumns ? 'إخفاء الحل بالأعمدة' : 'أظهر الحل بالأعمدة خطوة بخطوة'}
      </button>
      {showColumns && <ColumnOperation item={item} interactive />}
    </div>
  )
}

// ── Warm-up (mental math) grid ──
function WarmupGrid() {
  const [values, setValues] = useState<Record<string, string>>({})
  const solved = warmupItems.filter(it => norm(values[it.id] ?? '') === String(computeResult(it.operands, it.operator))).length
  return (
    <div className="calc-panel">
      <div className="calc-progress"><Target size={15} /> أجبت بشكل صحيح عن <strong>{solved}</strong> من <strong>{warmupItems.length}</strong></div>
      <div className="calc-grid warmup-grid">
        {warmupItems.map(item => {
          const answer = computeResult(item.operands, item.operator)
          const raw = values[item.id] ?? ''
          const ok = norm(raw) === String(answer)
          return (
            <div key={item.id} className={`calc-item ${raw !== '' ? (ok ? 'is-ok' : 'is-off') : ''}`}>
              <span className="calc-label">{item.label}</span>
              <span className="math-expression calc-expr" dir="ltr">{itemExpression(item)} =</span>
              <input inputMode="numeric" dir="ltr" className="calc-input" aria-label={`warmup-${item.id}`} value={raw}
                onChange={e => setValues(v => ({ ...v, [item.id]: e.target.value }))} placeholder="؟" />
              {raw !== '' && (ok ? <Check size={16} className="calc-tick" /> : <span className="calc-x">✕</span>)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── تدرّب ① — mixed drill with add/subtract filter, per-item check and column reveal ──
function DrillGrid() {
  const [filter, setFilter] = useState<'all' | '+' | '-'>('all')
  const [values, setValues] = useState<Record<string, string>>({})
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const shown = drillItems.filter(it => filter === 'all' || it.operator === filter)
  const solved = drillItems.filter(it => norm(values[it.id] ?? '') === String(computeResult(it.operands, it.operator))).length
  return (
    <div className="calc-panel">
      <div className="drill-toolbar">
        <div className="drill-tabs" role="tablist" aria-label="تصنيف العمليات">
          {([['all', 'الكل'], ['+', 'الجمع'], ['-', 'الطرح']] as const).map(([key, label]) => (
            <button key={key} role="tab" aria-selected={filter === key} className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
        <span className="calc-progress"><ListChecks size={15} /> <strong>{solved}</strong>/<strong>{drillItems.length}</strong></span>
      </div>
      <div className="calc-grid drill-grid">
        {shown.map(item => {
          const answer = computeResult(item.operands, item.operator)
          const raw = values[item.id] ?? ''
          const ok = norm(raw) === String(answer)
          return (
            <div key={item.id} className={`calc-item drill-item ${item.operator === '+' ? 'op-add' : 'op-sub'} ${raw !== '' ? (ok ? 'is-ok' : 'is-off') : ''}`}>
              <div className="drill-head">
                <span className="calc-label">{item.label}</span>
                <span className={`op-chip ${item.operator === '+' ? 'add' : 'sub'}`}>{item.operator === '+' ? 'جمع' : 'طرح'}</span>
              </div>
              <span className="math-expression calc-expr" dir="ltr">{itemExpression(item)} =</span>
              <div className="drill-answer">
                <input inputMode="numeric" dir="ltr" className="calc-input" aria-label={`drill-${item.id}`} value={raw}
                  onChange={e => setValues(v => ({ ...v, [item.id]: e.target.value }))} placeholder="؟" />
                {raw !== '' && (ok ? <Check size={16} className="calc-tick" /> : <span className="calc-x">✕</span>)}
              </div>
              <button className="drill-reveal" onClick={() => setOpen(o => ({ ...o, [item.id]: !o[item.id] }))}>
                {open[item.id] ? 'إخفاء' : 'الحل بالأعمدة'}
              </button>
              {open[item.id] && <ColumnOperation item={item} interactive />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── تدرّب ④ — fill the missing digits ──
function FillPuzzleWidget({ puzzle }: { puzzle: FillPuzzle }) {
  const [entries, setEntries] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const cols = Array.from({ length: puzzle.width }, (_, i) => puzzle.width - 1 - i)
  const cellId = (rowKey: string, c: number) => `${puzzle.id}-${rowKey}-${c}`

  const rowsToRender = [...puzzle.rows.map((r, i) => ({ key: `r${i}`, row: r, sign: i === puzzle.rows.length - 1 ? (puzzle.operator === '+' ? '+' : '−') : '' }))]
  const allCells: { rowKey: string; c: number; expected: number }[] = []
  puzzle.rows.forEach((r, i) => r.hidden.forEach(c => allCells.push({ rowKey: `r${i}`, c, expected: digitAt(r.value, c) })))
  puzzle.result.hidden.forEach(c => allCells.push({ rowKey: 'res', c, expected: digitAt(puzzle.result.value, c) }))
  const allCorrect = allCells.every(cell => entries[cellId(cell.rowKey, cell.c)] === String(cell.expected))

  const renderCell = (rowKey: string, row: { value: number; hidden: number[] }, c: number) => {
    const digit = String(digitAt(row.value, c))
    const isBlankLead = Math.trunc(Math.abs(row.value)).toString().length <= c
    if (row.hidden.includes(c)) {
      const id = cellId(rowKey, c)
      const val = entries[id] ?? ''
      const ok = val === digit
      return <input key={c} inputMode="numeric" dir="ltr" maxLength={1} aria-label={id}
        className={`fill-box ${checked && val !== '' ? (ok ? 'is-ok' : 'is-off') : ''}`} value={val}
        onChange={e => { setEntries(x => ({ ...x, [id]: e.target.value.replace(/\D/g, '').slice(-1) })); setChecked(false) }} />
    }
    return <span key={c} className="col-cell fill-fixed">{isBlankLead ? '' : digit}</span>
  }

  return (
    <div className="fill-puzzle">
      <div className="col-op-grid fill-grid" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
        {rowsToRender.map(({ key, row, sign }) => (
          <div className="col-op-row" key={key}>
            <span className="col-op-sign">{sign}</span>
            {cols.map(c => renderCell(key, row, c))}
          </div>
        ))}
        <div className="col-op-rule" />
        <div className="col-op-row col-result">
          <span className="col-op-sign" />
          {cols.map(c => renderCell('res', puzzle.result, c))}
        </div>
      </div>
      <div className="col-op-controls">
        <button className="primary-button" onClick={() => setChecked(true)}>تحقّق من الفراغات</button>
      </div>
      {checked && (
        <p className={allCorrect ? 'gentle-feedback good' : 'gentle-feedback'}>
          {allCorrect
            ? `ممتاز! العملية الكاملة: ${itemExpression({ id: puzzle.id, label: puzzle.label, operator: puzzle.operator, operands: [puzzle.rows[0].value, puzzle.rows[1].value] })} = ${fmt(puzzle.result.value)}.`
            : 'راجع خانة بخانة بدءاً من الآحاد: كل خانة في الناتج تأتي من جمع/طرح الخانة نفسها مع الحمل أو الاستلاف.'}
        </p>
      )}
    </div>
  )
}

// ── اكتشف الخطأ (platform challenge) ──
const mistakeCase = {
  work: '4,580 + 3,650 = 7,130',
  options: [
    { id: 'm1', text: 'نسي حمل 1 من خانة العشرات إلى المئات؛ الناتج الصحيح 8,230.', correct: true },
    { id: 'm2', text: 'رتّب الخانات بشكل خاطئ.', correct: false },
    { id: 'm3', text: 'لا يوجد خطأ، الناتج صحيح.', correct: false },
  ],
}
function MistakeSpotter() {
  const [pick, setPick] = useState('')
  return (
    <div className="mistake-spot">
      <h4><AlertTriangle size={17} /> اكتشف الخطأ</h4>
      <p>حلّ أحد الطلاب هذه العملية هكذا: <span className="math-expression" dir="ltr">{mistakeCase.work}</span></p>
      <div className="choice-list">
        {mistakeCase.options.map(o => (
          <button key={o.id} className={pick === o.id ? 'selected-choice' : ''} onClick={() => setPick(o.id)}>{o.text}</button>
        ))}
      </div>
      {pick && (
        <p className={mistakeCase.options.find(o => o.id === pick)?.correct ? 'gentle-feedback good' : 'gentle-feedback'}>
          {mistakeCase.options.find(o => o.id === pick)?.correct
            ? 'صحيح! في خانة العشرات: 8 + 5 = 13، نكتب 3 ونحمل 1. لأنه أهمل الحمل نقص الناتج 100، فظهر 7,130 بدل 8,230.'
            : 'ليس هذا السبب. راجع خانة العشرات: 8 + 5 = 13، فهل حُمِل الـ1 إلى المئات؟'}
        </p>
      )}
    </div>
  )
}

function ConceptFlow({ steps }: { steps: { q: string; a: ReactNode }[] }) {
  return (
    <div className="concept-flow">
      {steps.map((s, i) => (
        <div className="concept-row" key={i}>
          <span className="concept-q">{s.q}</span>
          <span className="concept-a">{s.a}</span>
        </div>
      ))}
    </div>
  )
}

// ── Steps ──
function IntroStep() {
  return (
    <div className="lesson-intro">
      <div className="lesson-hero-icon"><Flag size={26} /></div>
      <div className="lesson-goals">
        <strong>سنتعلّم في هذا الدرس:</strong>
        <span>• جمع أعداد ضمن الملايين.</span>
        <span>• طرح عدد من عدد آخر.</span>
      </div>
      <SourceCard label="الكتاب · ص 19">
        <h3>أعداد كبيرة من حولنا</h3>
        <p>تبلغ مساحة الصّحراء الكبرى <MathExpression>{fmt(5628000)}</MathExpression> كيلومتراً مربعاً، وتنقص مساحة صحراء أستراليا عن مساحة الصّحراء الكبرى بمقدار <MathExpression>{fmt(3264240)}</MathExpression> كيلومتراً مربعاً.</p>
        <p className="figure-note">🗺️ توجد في الكتاب خريطة توضيحية لموقع الصحراءين؛ ما يهمّنا هنا هو العددان أعلاه.</p>
      </SourceCard>
      <div className="support-tip"><Compass size={20} /><span>احتفظ بهذين العددين في ذهنك: في منتصف الدرس سنعود لنحسب مساحة صحراء أستراليا بأنفسنا باستخدام الطرح.</span></div>
    </div>
  )
}

function WarmupStep() {
  return (
    <div>
      <SourceCard label="الكتاب · ص 19 · انطلاقة نشطة">
        <h3>احسب ناتج كلّ ممّا يأتي</h3>
        <p>هذه عمليات ذهنية سريعة على أعداد صغيرة. أتقانها يجعل الجمع والطرح ضمن الملايين أسهل، لأن الفكرة نفسها تتكرّر خانةً خانة.</p>
      </SourceCard>
      <WarmupGrid />
      <div className="support-tip"><Lightbulb size={20} /><span>لاحظ: <MathExpression>25 + 75 = 100</MathExpression> و<MathExpression>100 − 25 = 75</MathExpression> — الجمع والطرح عمليتان عكسيتان، وهذه العلاقة ستساعدنا على التحقق من إجاباتنا.</span></div>
    </div>
  )
}

function AdditionConceptStep() {
  return (
    <div>
      <div className="definition-box">
        <strong>قاعدة الجمع بالأعمدة</strong>
        <p>نرتّب خانات الأعداد المتقابلة تحت بعضها بدءاً من خانة الآحاد، ثم نجمع كل خانة. وإذا تجاوز ناتج خانةٍ الرقم 9 نكتب رقم الآحاد ونحمل ما تبقّى إلى الخانة التي على يسارها.</p>
      </div>
      <div className="interaction-card">
        <h3>الفكرة كاملة</h3>
        <ConceptFlow steps={[
          { q: 'ما الفكرة؟', a: 'الجمع يعني ضمّ مقدارين أو أكثر في مقدار واحد. مع الأعداد الكبيرة نجمعها منزلةً منزلة: آحاد مع آحاد، عشرات مع عشرات، وهكذا.' },
          { q: 'لماذا نستخدمه؟', a: 'لإيجاد المجموع الكلّي: قيمة فاتورة، إنتاج عامين، عدد منشورات… أي موقف نضمّ فيه كميّات.' },
          { q: 'كيف أبدأ؟', a: <>أحاذي الأعداد على اليمين لتتقابل المنازل، ثم أبدأ من خانة الآحاد وأتحرّك يساراً.</> },
          { q: 'ما الخطوات؟', a: 'اجمع كل خانة على حدة، اكتب رقم الآحاد للناتج، واحمل العشرة إلى الخانة التالية إن وُجدت.' },
          { q: 'لماذا نحمل؟', a: <>لأن كل خانة تتّسع لرقم واحد فقط. إذا صار الناتج <MathExpression>13</MathExpression> فهو <MathExpression>3</MathExpression> آحاد و<MathExpression>1</MathExpression> عشرة، والعشرة تنتقل لخانة العشرات.</> },
          { q: 'كيف أتحقق؟', a: 'الجمع تبديلي: أعد الجمع من الأعلى إلى الأسفل، أو غيّر ترتيب الأعداد؛ يجب أن يبقى المجموع نفسه.' },
        ]} />
        <div className="common-mistakes"><AlertTriangle size={16} /><span><strong>خطأ شائع:</strong> نسيان الحمل، أو محاذاة الأعداد على اليسار بدل اليمين فتختلط المنازل.</span></div>
      </div>
      <p className="mini-lead">مثال مصغّر على الحمل:</p>
      <ColumnOperation item={{ id: 'demo-add', label: 'تجربة', operands: [47, 38], operator: '+' }} interactive />
    </div>
  )
}

function InvoiceStep() {
  return (
    <div>
      <SourceCard label="الكتاب · ص 19 · مثال">
        <h3>ما قيمة الفاتورة؟</h3>
        <p>الفاتورة المجاورة تبيّن سعر شراء كميّات من المواد اللّازمة لإكمال البناء. ما قيمة الفاتورة؟</p>
        <div className="book-table-wrap">
          <table className="book-table">
            <thead><tr><th>المادّة</th><th>السّعر</th></tr></thead>
            <tbody>
              <tr><td>إسمنت</td><td><MathExpression>{fmt(203565)}</MathExpression> ل.س</td></tr>
              <tr><td>حديد</td><td><MathExpression>{fmt(789321)}</MathExpression> ل.س</td></tr>
            </tbody>
          </table>
        </div>
        <p>الحل: قيمة الفاتورة هي ناتج جمع العددين <MathExpression>{fmt(203565)} + {fmt(789321)}</MathExpression>. نرتّب الخانات المتقابلة ونجمع بدءاً من الآحاد:</p>
      </SourceCard>
      <div className="interaction-card">
        <h3>ابنِ الحل خانةً خانة</h3>
        <ColumnOperation item={invoiceExample} interactive />
        <p className="result-line">قيمة الفاتورة <MathExpression>{fmt(computeResult(invoiceExample.operands, invoiceExample.operator))}</MathExpression> ليرة سوريّة.</p>
      </div>
    </div>
  )
}

function AdditionExamplesStep() {
  return (
    <div>
      <SourceCard label="الكتاب · ص 20 · مثال">
        <h3>إنتاج مصفاة حمص في عامين</h3>
        <p>إنتاج البنزين الممتاز في مصفاة حمص في عام <MathExpression>2007</MathExpression> كان <MathExpression>{fmt(1220219)}</MathExpression> طن، وفي عام <MathExpression>2006</MathExpression> كان <MathExpression>{fmt(1344826)}</MathExpression> طن. كم كان إنتاج المصفاة في العامين معاً؟</p>
        <ColumnOperation item={refineryExample} interactive />
        <p className="result-line">إنتاج المصفاة في العامين <MathExpression>{fmt(computeResult(refineryExample.operands, refineryExample.operator))}</MathExpression> طنّاً.</p>
      </SourceCard>
      <SourceCard label="الكتاب · ص 20 · مثال">
        <h3>جمع ثلاثة أعداد</h3>
        <p>ما ناتج: <MathExpression>{fmt(1328748)} + {fmt(3014578)} + {fmt(78371)}</MathExpression> ؟ نرتّب الخانات المتقابلة ونجمع بدءاً من الآحاد.</p>
        <ColumnOperation item={threeAddendsExample} interactive />
        <p className="result-line">الناتج <MathExpression>{fmt(computeResult(threeAddendsExample.operands, threeAddendsExample.operator))}</MathExpression>.</p>
      </SourceCard>
      <div className="support-tip"><Lightbulb size={20} /><span>عند جمع الأعداد المختلفة الطول (مثل <MathExpression>{fmt(78371)}</MathExpression>)، حاذِها على اليمين واترك الخانات العليا فارغة؛ الفراغ يعني صفراً.</span></div>
    </div>
  )
}

function AdditionCheckStep() {
  return (
    <div>
      <SourceCard label="الكتاب · ص 21 · تحقّق من فهمك">
        <h3>احسب ناتج كل من</h3>
        <p>جرّب بنفسك أولاً، ثم افتح الحل بالأعمدة لتقارن خطواتك.</p>
      </SourceCard>
      {additionChecks.map(item => <SelfCheck key={item.id} item={item} prompt={`${item.label}) احسب:`} />)}
    </div>
  )
}

function SubtractionConceptStep() {
  return (
    <div>
      <div className="vocab-chips">
        <span className="vocab-chip minuend">المطروح منه<small>العدد الأكبر في الأعلى</small></span>
        <span className="vocab-chip subtrahend">المطروح<small>ما ننقصه</small></span>
        <span className="vocab-chip diff">الفرق (الناتج)<small>ما يتبقّى</small></span>
      </div>
      <div className="definition-box">
        <strong>قاعدة الطرح بالأعمدة</strong>
        <p>نرتّب خانات العددين المتقابلة تحت بعضها بدءاً من خانة الآحاد، ثم نطرح كل خانة. وإذا كان الرقم في الأعلى أصغر من الذي تحته نستلف <MathExpression>10</MathExpression> من الخانة المجاورة على اليسار.</p>
      </div>
      <div className="interaction-card">
        <h3>الفكرة كاملة</h3>
        <ConceptFlow steps={[
          { q: 'ما الفكرة؟', a: 'الطرح يعني إيجاد الفرق بين عددين: كم يزيد أحدهما عن الآخر، أو ماذا يتبقّى بعد إنقاص مقدار.' },
          { q: 'لماذا نستخدمه؟', a: 'لإيجاد مقدار الزيادة أو النقص أو الباقي: فرق سعر، فرق كتلة، مساحة أصغر…' },
          { q: 'كيف أبدأ؟', a: <>أضع العدد الأكبر (المطروح منه) في الأعلى، والعدد الأصغر (المطروح) تحته محاذياً على اليمين.</> },
          { q: 'ما الخطوات؟', a: 'ابدأ من الآحاد. اطرح الرقم السفلي من العلوي. إن لم يكفِ العلوي، استلف 10 من الخانة المجاورة.' },
          { q: 'لماذا نستلف؟', a: <>لأننا لا نطرح رقماً أكبر من رقم أصغر مباشرة. نأخذ عشرة من الخانة اليسرى (تنقص 1) ونضيفها للخانة الحالية (تزيد 10).</> },
          { q: 'كيف أتحقق؟', a: <>بالجمع العكسي: <MathExpression>المطروح + الفرق = المطروح منه</MathExpression>. إن صحّ الجمع فالطرح صحيح.</> },
        ]} />
        <div className="common-mistakes"><AlertTriangle size={16} /><span><strong>خطأ شائع:</strong> طرح الرقم الأصغر من الأكبر داخل الخانة الواحدة (مثل قول <MathExpression>3 − 8 = 5</MathExpression>) بدل الاستلاف.</span></div>
      </div>
      <p className="mini-lead">مثال مصغّر على الاستلاف:</p>
      <ColumnOperation item={{ id: 'demo-sub', label: 'تجربة', operands: [52, 27], operator: '-' }} interactive />
    </div>
  )
}

function SubtractionExamplesStep() {
  return (
    <div>
      <SourceCard label="الكتاب · ص 21 · مثال">
        <h3>مقدار الزيادة في سعر الحاسب المحمول</h3>
        <p>سعر حاسب محمول اليوم <MathExpression>{fmt(120580)}</MathExpression> ليرة سورية، وكان سعره الشهر الماضي <MathExpression>{fmt(118365)}</MathExpression> ليرة سورية. ما مقدار الزيادة في سعره؟</p>
        <p>مقدار الزيادة هو <MathExpression>{fmt(120580)} − {fmt(118365)}</MathExpression>؛ العدد الأكبر <BidiText>(المطروح منه) في الأعلى، والأصغر (المطروح) تحته</BidiText>.</p>
        <ColumnOperation item={laptopExample} interactive />
        <p className="source-quote">نصّ الكتاب في الخلاصة: «مقدار الزيادة في سعر الحاسب المحمول <MathExpression>{fmt(laptopPrintedAnswer)}</MathExpression> ليرة سوريّة».</p>
        <div className="common-mistakes">
          <AlertTriangle size={16} />
          <span>
            <strong>لننتبه ونتحقّق:</strong> العمل بالأعمدة أعلاه يعطي <MathExpression>{fmt(computeResult(laptopExample.operands, laptopExample.operator))}</MathExpression>، ونتأكّد بالجمع العكسي:
            {' '}<MathExpression>{fmt(118365)} + {fmt(2215)} = {fmt(120580)}</MathExpression> ✓. إذن القيمة الموافقة لمعطيات الكتاب هي <MathExpression>{fmt(computeResult(laptopExample.operands, laptopExample.operator))}</MathExpression> ليرة، وتختلف عن الرقم المطبوع في جملة الخلاصة بمقدار <MathExpression>1</MathExpression> فقط. هذا يعلّمنا أن نتحقّق دائماً من الطرح بالجمع.
          </span>
        </div>
      </SourceCard>
      <SourceCard label="الكتاب · ص 21 · مثال">
        <h3>طرح ضمن الملايين</h3>
        <p>ما ناتج: <MathExpression>{fmt(3221991)} − {fmt(2154231)}</MathExpression> ؟ نرتّب الخانات المتقابلة ونطرح بدءاً من الآحاد.</p>
        <ColumnOperation item={subtractionExample} interactive />
        <p className="result-line">الناتج <MathExpression>{fmt(computeResult(subtractionExample.operands, subtractionExample.operator))}</MathExpression>.</p>
      </SourceCard>
    </div>
  )
}

function SubtractionCheckStep() {
  return (
    <div>
      <SourceCard label="الكتاب · ص 21 · تحقّق من فهمك (1)">
        <h3>عُد إلى مقدمة الدرس</h3>
        <p>{australiaCheck.context} هذه هي المسألة التي وعدناك بها في البداية!</p>
      </SourceCard>
      <SelfCheck item={australiaCheck} prompt="مساحة صحراء أستراليا =" />
      <SourceCard label="الكتاب · ص 22 · تحقّق من فهمك (2)">
        <h3>احسب ناتج</h3>
        <p>عمليتا طرح ضمن الملايين. انتبه إلى مواضع الاستلاف.</p>
      </SourceCard>
      {subtractionChecks.map(item => <SelfCheck key={item.id} item={item} prompt={`${item.label}) احسب:`} />)}
    </div>
  )
}

function DrillStep() {
  return (
    <div>
      <SourceCard label="الكتاب · ص 22 · تدرّب ①">
        <h3>احسب ناتج كلّ ممّا يأتي</h3>
        <p>اثنتا عشرة عملية بين جمعٍ وطرح. صنّفها بالأزرار، أدخل ناتجك، وافتح الحل بالأعمدة عند الحاجة.</p>
      </SourceCard>
      <DrillGrid />
    </div>
  )
}

function ApplicationsStep() {
  return (
    <div>
      <p className="step-lead">في المسائل اللفظية نسأل أنفسنا: ما المعطيات؟ ما المطلوب؟ أي عملية تناسبه؟</p>
      {applicationProblems.map(problem => {
        const answer = computeResult(problem.operands, problem.operator)
        return (
          <SourceCard key={problem.id} label={`الكتاب · ص 22 · تدرّب ${problem.label} · ${problem.title}`}>
            <h3>{problem.title}</h3>
            <p>{problem.question}</p>
            <div className="plan-note">
              <span><strong>المطلوب:</strong> {problem.operator === '+' ? 'المجموع الكلّي.' : 'مقدار الزيادة (الفرق).'}</span>
              <span><strong>العملية:</strong> {problem.operator === '+' ? 'جمع العددين.' : 'طرح العدد الأصغر من الأكبر.'}</span>
            </div>
            <SelfCheck item={problem} prompt="الحل:" />
            <p className="result-line">{problem.operator === '+' ? `عدد المنشورات ${fmt(answer)} منشوراً.` : `مقدار الزيادة في الكتلة ${fmt(answer)} طنّاً.`}</p>
          </SourceCard>
        )
      })}
    </div>
  )
}

function PuzzleStep() {
  return (
    <div>
      <SourceCard label="الكتاب · ص 22 · تدرّب ④">
        <h3>ضع الأعداد المناسبة في □</h3>
        <p>انسخ العملية ثم أوجد الأرقام المفقودة. ابدأ دائماً من خانة الآحاد، واستعمل الحمل أو الاستلاف لتكتشف بقيّة الأرقام.</p>
      </SourceCard>
      {fillPuzzles.map(puzzle => (
        <div className="interaction-card" key={puzzle.id}>
          <h3>{puzzle.label}) {puzzle.operator === '+' ? 'جمع' : 'طرح'} ناقص الأرقام</h3>
          <FillPuzzleWidget puzzle={puzzle} />
        </div>
      ))}
      <div className="mini-challenge"><MistakeSpotter /></div>
    </div>
  )
}

function RecapStep() {
  return (
    <div className="recap-step">
      <div className="recap-icon"><Sparkles size={24} /></div>
      <h3>خلاصة الدرس: الجمع والطرح ضمن الملايين</h3>
      <ul>
        <li>نحاذي الأعداد على اليمين لتتقابل المنازل، ونبدأ العمل من خانة الآحاد.</li>
        <li>في الجمع: إذا تجاوز ناتج الخانة <MathExpression>9</MathExpression> نكتب الآحاد ونحمل العشرة إلى اليسار.</li>
        <li>في الطرح: إذا كان الرقم العلوي أصغر نستلف <MathExpression>10</MathExpression> من الخانة المجاورة.</li>
        <li>الطرح يُستخدم لإيجاد الفرق أو مقدار الزيادة أو النقص أو الباقي.</li>
        <li>نتحقّق دائماً: <MathExpression>المطروح + الفرق = المطروح منه</MathExpression>، والجمع نراجعه بإعادته بترتيبٍ آخر.</li>
      </ul>
    </div>
  )
}

function FinalTestStep() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const score = finalAssessment5.filter(q => (q.type === 'choice' ? answers[q.id] === q.answer : norm(answers[q.id] ?? '') === norm(q.answer))).length
  return (
    <div className="final-test">
      <div className="step-banner"><Award size={20} /> اختبار ختامي جديد</div>
      <p>هذا اختبار جديد يقيس فهمك وتطبيقك وتفكيرك — وليس نقلاً لتمارين الكتاب. أجب ثم اعرض نتيجتك.</p>
      {finalAssessment5.map((q, i) => (
        <div className="test-question" key={q.id}>
          <strong>{i + 1}) <BidiText>{q.text}</BidiText></strong>
          {q.type === 'choice'
            ? <div className="choice-list">{q.options!.map(opt => (
                <button key={opt} className={answers[q.id] === opt ? 'selected-choice' : ''} onClick={() => { setAnswers(a => ({ ...a, [q.id]: opt })); setDone(false) }}><BidiText>{opt}</BidiText></button>
              ))}</div>
            : <input inputMode="numeric" dir="ltr" aria-label={q.id} value={answers[q.id] ?? ''} onChange={e => { setAnswers(a => ({ ...a, [q.id]: e.target.value })); setDone(false) }} placeholder="اكتب إجابتك" />}
        </div>
      ))}
      <button className="submit-test primary-button" onClick={() => setDone(true)}>عرض النتيجة <Check size={16} /></button>
      {done && <div className="test-result"><strong>نتيجتك: {score} / {finalAssessment5.length}</strong><p>{score === finalAssessment5.length ? 'إتقان رائع! أنت جاهز للجمع والطرح ضمن الملايين.' : 'راجع الخطوات: محاذاة الخانات، الحمل، الاستلاف، والتحقق بالجمع العكسي.'}</p></div>}
    </div>
  )
}

export function AdditionSubtractionLesson() {
  const steps: LessonStep[] = useMemo(() => [
    { id: 'intro', title: 'انطلاقة الدرس', content: <IntroStep /> },
    { id: 'warmup', title: 'انطلاقة نشطة', content: <WarmupStep /> },
    { id: 'add-concept', title: 'فكرة الجمع', content: <AdditionConceptStep /> },
    { id: 'invoice', title: 'مثال موجّه: الفاتورة', content: <InvoiceStep /> },
    { id: 'add-examples', title: 'أمثلة الجمع', content: <AdditionExamplesStep /> },
    { id: 'add-check', title: 'تحقّق من فهمك (جمع)', content: <AdditionCheckStep /> },
    { id: 'sub-concept', title: 'فكرة الطرح', content: <SubtractionConceptStep /> },
    { id: 'sub-examples', title: 'أمثلة الطرح', content: <SubtractionExamplesStep /> },
    { id: 'sub-check', title: 'تحقّق من فهمك (طرح)', content: <SubtractionCheckStep /> },
    { id: 'drill', title: 'تدرّب: حسابات متنوّعة', content: <DrillStep /> },
    { id: 'applications', title: 'تطبيقات واقعية', content: <ApplicationsStep /> },
    { id: 'puzzles', title: 'تحدٍّ: ألغاز الأرقام', content: <PuzzleStep /> },
    { id: 'recap', title: 'الخلاصة', content: <RecapStep /> },
    { id: 'final', title: 'الاختبار الختامي', content: <FinalTestStep /> },
  ], [])
  const [active, setActive] = useState(0)
  return <LessonShell title="جمع الأعداد الطبيعيّة وطرحها" steps={steps} activeStep={active} onStepChange={setActive} theme="lesson-five" />
}
