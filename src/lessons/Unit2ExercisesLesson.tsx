import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  AlertTriangle, ArrowLeftRight, Check, CircleCheck, CircleX, ClipboardList, Compass, Grid3x3,
  Lightbulb, ListOrdered, PencilRuler, Play, RotateCcw, Sparkles, Table2, Target,
} from 'lucide-react'
import { MathExpression as SharedMathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import type { LessonStep } from '../components/lesson/types'
import {
  arabicWords, findUnit2ExercisesElement, lcmOf, lessonTitle, q10Data, q10Items, q11Data, q1Data, q2Data, q3Data,
  q4Data, q5Data, q5Sets, q6Data, q6Items, q7Data, q7Groups, q8Data, q8Groups, q9Data, q9Items,
  valueLabel, valueOf, type ComparisonItem, type MathVal, type OrderGroup, type SourceBranch, type SourceElement,
} from './unit2ExercisesData'

/* =============================================================================================
   الوحدة الثانية · درس «تمرينات الوحدة الثانية» (الكتاب ص 85–86)
   درس مراجعة ختامي مبني من الصفر: كل تمرين من التمارين الأحد عشر المطبوعة يُقدَّم بترتيب
   واحد: المفهوم من أساسه ← مثال محلول خطوة بخطوة ← أخطاء شائعة ← تدريب متدرج ← السؤال
   الأصلي من الكتاب بحلّه الكامل وتفاعله الخاص. كل الرموز الرياضية معزولة LTR، والكسور
   تُعرض عمودياً (بسط فوق خط فوق مقام) في كل مكان يراه الطالب.
   ============================================================================================= */

/* ------------------------------------------------------------------ أدوات العرض الرياضي */

const FRACTION_TOKEN = /(\d+)\s+(\d+)\s*\/\s*(\d+)|(\d+)\s*\/\s*(\d+)/gu
const MATH_RUN = /([0-9A-Za-z](?:[\dA-Za-z.,=<>+−×÷()[\]\s]*[\dA-Za-z%)\]])?)/g
function MathExpression({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return <SharedMathExpression className={className} label={label}>{children}</SharedMathExpression>
}

/** كسر عمودي: بسط فوق خط كسر أفقي فوق مقام — معزول LTR دائماً. */
export function Frac({ n, d, label }: { n: number | string; d: number | string; label?: string }) {
  return <span className="u2e-frac" dir="ltr" role="img" aria-label={label ?? `${n} على ${d}`}>
    <span className="u2e-frac-num">{n}</span>
    <span className="u2e-frac-rule" aria-hidden="true" />
    <span className="u2e-frac-den">{d}</span>
  </span>
}

/** عدد مختلط: جزء صحيح يليه كسر عمودي. */
export function MixedGlyph({ w, n, d, label }: { w: number | string; n: number | string; d: number | string; label?: string }) {
  return <span className="u2e-mixed" dir="ltr" role="img" aria-label={label ?? `${w} و${n} على ${d}`}>
    <span className="u2e-mixed-whole">{w}</span>
    <Frac n={n} d={d} />
  </span>
}

/** عرض قيمة مهيكلة من سجل البيانات بقيمتها الأصلية. */
function Val({ value }: { value: MathVal }) {
  if (value.kind === 'fraction') return <Frac n={value.n} d={value.d} />
  if (value.kind === 'mixed') return <MixedGlyph w={value.w} n={value.n} d={value.d} />
  return <MathExpression>{value.text}</MathExpression>
}

/** زوج مقارنة كما في الكتاب: القيمة الأولى، مربع الرمز، القيمة الثانية. */
function ComparePair({ left, right }: { left: MathVal; right: MathVal }) {
  return <span className="u2e-pair" dir="rtl">
    <Val value={left} />
    <span className="u2e-pair-box" aria-hidden="true" />
    <Val value={right} />
  </span>
}

/** نص عربي يحمل رموزاً رياضية: الكسور تصير أعمدة، والأرقام والمعادلات جزراً LTR معزولة. */
function renderPlain(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  for (const run of text.split(MATH_RUN)) {
    if (!run) continue
    if (/[0-9A-Za-z]/.test(run)) {
      nodes.push(<MathExpression key={`run-${keyPrefix}-${nodes.length}`} className="u2e-run">{run}</MathExpression>)
    } else {
      nodes.push(<span key={`txt-${keyPrefix}-${nodes.length}`}>{run}</span>)
    }
  }
  return nodes
}

function Notation({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  let cursor = 0
  for (const match of text.matchAll(FRACTION_TOKEN)) {
    const start = match.index ?? 0
    if (start > cursor) nodes.push(...renderPlain(text.slice(cursor, start), `pre${start}`))
    if (match[1] !== undefined) {
      nodes.push(<MixedGlyph key={`mix-${start}`} w={match[1]} n={match[2]} d={match[3]} />)
    } else {
      nodes.push(<Frac key={`fr-${start}`} n={match[4]} d={match[5]} />)
    }
    cursor = start + match[0].length
  }
  if (cursor < text.length) nodes.push(...renderPlain(text.slice(cursor), `tail${cursor}`))
  return <span className="u2e-notation">{nodes}</span>
}

/* ------------------------------------------------------------------ عناصر مشتركة */

function useChecked(): [boolean, (value: boolean) => void, number] {
  const [checked, setCheckedState] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const setChecked = useCallback((value: boolean) => {
    setCheckedState(value)
    if (value) setAttempts((count) => count + 1)
  }, [])
  return [checked, setChecked, attempts]
}

function toneClass(checked: boolean, selected: boolean, correct: boolean) {
  return checked ? (correct ? 'is-right' : selected ? 'is-wrong' : '') : selected ? 'is-selected' : ''
}

/** بطاقة المصدر: نص السؤال كما طُبع في الكتاب مع رقم الصفحة. */
function Sheet({ element, children, quote = true }: { element: SourceElement; children?: ReactNode; quote?: boolean }) {
  return <article className="u2e-sheet" data-source-id={element.id} data-source-page={element.page}>
    <div className="u2e-sheet-head">
      <span className="u2e-page-tag"><ClipboardList size={13} aria-hidden="true" /> الكتاب · ص {element.page}</span>
      <h3 className="u2e-section-name">{element.section}</h3>
    </div>
    {quote && <p className="u2e-quote"><Notation text={element.prompt} /></p>}
    {children && <div className="u2e-sheet-body">{children}</div>}
  </article>
}

function PlatformNote({ title = 'إضافة من المنصة', children }: { title?: string; children: ReactNode }) {
  return <aside className="u2e-note">
    <strong><Lightbulb size={15} aria-hidden="true" /> {title}</strong>
    {children}
  </aside>
}

function ConceptCard({ title = 'المفهوم من أساسه', children }: { title?: string; children: ReactNode }) {
  return <section className="u2e-card">
    <h3 className="u2e-card-title"><Compass size={16} aria-hidden="true" /> {title}</h3>
    {children}
  </section>
}

function Worked({ title = 'مثال محلول خطوة بخطوة', steps }: { title?: string; steps: ReactNode[] }) {
  return <section className="u2e-worked">
    <h3 className="u2e-card-title"><PencilRuler size={16} aria-hidden="true" /> {title}</h3>
    <ol className="u2e-worked-steps">
      {steps.map((step, index) => <li key={index}><Notation text={`${index + 1}.`} /> {step}</li>)}
    </ol>
  </section>
}

function Mistakes({ items }: { items: { wrong: string; right: string; why: string }[] }) {
  return <section className="u2e-mistakes">
    <h3 className="u2e-card-title"><AlertTriangle size={16} aria-hidden="true" /> أخطاء شائعة وانتبه لها</h3>
    {items.map((item, index) => <div className="u2e-mistake" key={index}>
      <p className="u2e-mistake-row is-wrong"><Notation text={item.wrong} /></p>
      <p className="u2e-mistake-row is-right"><Notation text={item.right} /></p>
      <p className="u2e-mistake-why"><Notation text={item.why} /></p>
    </div>)}
  </section>
}

function Feedback({ state, hint, attempts = 1, children }: { state: 'idle' | 'correct' | 'wrong'; hint?: string; attempts?: number; children: ReactNode }) {
  if (state === 'idle') return null
  const reveal = state === 'correct' || attempts >= 2
  return <div className={`u2e-feedback ${state === 'correct' ? 'is-correct' : 'is-wrong'}`} role="status">
    <span className="u2e-feedback-title">
      {state === 'correct' ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}
      {state === 'correct' ? 'إجابة صحيحة' : 'راجع الإجابة'}
    </span>
    {state === 'wrong' && hint && <p className="u2e-feedback-hint"><Lightbulb size={15} aria-hidden="true" /> تلميح: <Notation text={hint} /></p>}
    {reveal
      ? <div className="u2e-feedback-body">
          {state === 'wrong' && <p className="u2e-feedback-reveal">الحل الكامل بعد المحاولتين — قارن خطواتك به:</p>}
          {children}
        </div>
      : <p className="u2e-feedback-retry">عدّل إجابتك وتحقّق مرة أخرى؛ يظهر الحل الكامل بعد المحاولة الثانية.</p>}
  </div>
}

function TaskHead({ title, page, platform = false }: { title: string; page?: number; platform?: boolean }) {
  return <div className="u2e-task-head">
    <Target size={16} aria-hidden="true" />
    <strong>{title}</strong>
    {platform ? <span className="u2e-page-tag is-platform">نشاط من إعداد المنصة</span> : page ? <span className="u2e-page-tag">ص {page}</span> : null}
  </div>
}

const normalizeInput = (value: string) => value
  .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
  .replace(/٫/g, '.')
  .replace(/\s|(سم|cm)/g, '')
  .replace(/.$/, (last) => (last === '.' ? '' : last))

/* ------------------------------------------------------------------ الخطوة 1 · مدخل الدرس */

const LESSON_MAP: { exercise: string; title: string; lesson: string }[] = [
  { exercise: '①', title: 'جدول الخانات والصيغة اللفظية والترتيب', lesson: 'مقارنة الأعداد الطبيعية وترتيبها' },
  { exercise: '②', title: 'مقارنة عددين من سبع خانات', lesson: 'مقارنة الأعداد الطبيعية وترتيبها' },
  { exercise: '③', title: 'ترتيب ثلاثة أعداد تصاعدياً', lesson: 'مقارنة الأعداد الطبيعية وترتيبها' },
  { exercise: '④', title: 'لغز منزلي: العشرات والآحاد', lesson: 'مقارنة الأعداد الطبيعية وترتيبها' },
  { exercise: '⑤', title: 'المضاعف المشترك الأصغر (9 مجموعات)', lesson: 'المضاعف المشترك الأصغر' },
  { exercise: '⑥', title: 'مقارنة كسور وأعداد عشرية (9 فروع)', lesson: 'الكسور (1) والأجزاء العشرية (1-3)' },
  { exercise: '⑦', title: 'ترتيب كسور تصاعدياً', lesson: 'الكسور (1)' },
  { exercise: '⑧', title: 'ترتيب كسور تنازلياً', lesson: 'الكسور (1)' },
  { exercise: '⑨', title: 'من الكسر المركب إلى كسر عادي', lesson: 'الكسور (2)' },
  { exercise: '⑩', title: 'من كسر عادي إلى كسر مركب', lesson: 'الكسور (2)' },
  { exercise: '⑪', title: 'أطوال في شكل مستطيل ومربّع', lesson: 'المستطيل والمربّع' },
]

function StepIntro() {
  const element = findUnit2ExercisesElement('u2-p85-intro')
  return <div className="u2e-stack">
    <Sheet element={element} quote={false}>
      <p className="u2e-lead">هاتان الصفحتان هما محطة المراجعة الختامية للوحدة الثانية: أحد عشر تمريناً يجمع مهارات الوحدة كلها في مسائل قصيرة. في هذا الدرس تحل كل تمرين بنفسك أولاً، ثم تقارن بالحل الكامل خطوة بخطوة.</p>
      <PlatformNote title="كيف تدرس هذا الدرس؟">
        <ol className="u2e-inline-list">
          <li>اقرأ المفهوم والمثال المحلول قبل كل تمرين.</li>
          <li>نفّذ التدريب المتدرج حتى تضبط الطريقة.</li>
          <li>حل السؤال الأصلي من الكتاب داخل المنصة، وقارن خطواتك بالحل الكامل.</li>
          <li>إن تعثرت، اتبع الخريطة أدناه إلى درس المهارة وراجعه ثم عد.</li>
        </ol>
      </PlatformNote>
    </Sheet>
    <section className="u2e-card">
      <h3 className="u2e-card-title"><ListOrdered size={16} aria-hidden="true" /> خريطة التمارين إلى دروس الوحدة</h3>
      <div className="u2e-map" role="list">
        {LESSON_MAP.map((row) => <div className="u2e-map-row" role="listitem" key={row.exercise}>
          <span className="u2e-map-badge">{row.exercise}</span>
          <span className="u2e-map-title">{row.title}</span>
          <span className="u2e-map-lesson">{row.lesson}</span>
        </div>)}
      </div>
    </section>
  </div>
}

/* ------------------------------------------------------------------ أدوات الترتيب بالنقر */

type OrderCardSpec = { key: string; node: ReactNode; aria: string }

/** نشاط ترتيب عام: ينقر الطالب البطاقات بالترتيب المطلوب ثم يتحقق. */
function OrderByClick({ id, cards, solution, directionLabel, hint, solutionSteps }: {
  id: string
  cards: OrderCardSpec[]
  solution: string[]
  directionLabel: string
  hint: string
  solutionSteps: ReactNode
}) {
  const [picked, setPicked] = useState<string[]>([])
  const [checked, setChecked, attempts] = useChecked()
  const done = picked.length === cards.length
  const ok = done && picked.every((key, index) => key === solution[index])
  const pick = (key: string) => {
    setChecked(false)
    setPicked((previous) => previous.includes(key) ? previous.filter((item) => item !== key) : previous.length < cards.length ? [...previous, key] : previous)
  }
  return <div className="u2e-task" data-u2e-order={id}>
    <TaskHead title={directionLabel} />
    <div className="u2e-order-slots" aria-label="مواقع الترتيب">
      {cards.map((_, index) => {
        const key = picked[index]
        const card = key ? cards.find((item) => item.key === key) : undefined
        return <span key={index} className={`u2e-order-slot ${card ? 'is-filled' : ''} ${checked ? (ok ? 'is-right' : card && card.key === solution[index] ? 'is-right' : 'is-wrong') : ''}`}>
          <small>{index + 1}</small>
          {card ? card.node : <span className="u2e-order-empty" aria-hidden="true">؟</span>}
        </span>
      })}
    </div>
    <div className="u2e-order-cards" role="group" aria-label="البطاقات">
      {cards.map((card) => {
        const rank = picked.indexOf(card.key)
        return <button key={card.key} type="button" className={`u2e-order-card ${rank >= 0 ? 'is-placed' : ''}`} aria-pressed={rank >= 0} aria-label={card.aria} onClick={() => pick(card.key)}>
          {card.node}
          {rank >= 0 && <span className="u2e-order-rank">{rank + 1}</span>}
        </button>
      })}
    </div>
    <div className="u2e-actions">
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={!done}><Check size={15} aria-hidden="true" /> تحقّق</button>
      <button type="button" className="u2e-button is-ghost" onClick={() => { setPicked([]); setChecked(false) }}><RotateCcw size={14} aria-hidden="true" /> إعادة</button>
    </div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint={hint}>
      {solutionSteps}
    </Feedback>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 2 · التمرين ① */

const PLACE_VALUES = [1, 10, 100, 1000, 10000, 100000, 1000000]

/** مستكشف جدول الخانات: بناء ثلاثة أعداد من سبع خانات وقراؤها وترتيبها (نص التمرين ① نفسه). */
function PlaceValueBuilder() {
  const [rows, setRows] = useState<string[][]>([['', '', '', '', '', '', ''], ['', '', '', '', '', '', ''], ['', '', '', '', '', '', '']])
  const [picked, setPicked] = useState<number[]>([])
  const [checked, setChecked] = useState(false)

  const values = rows.map((row) => {
    if (row.some((digit) => digit === '')) return null
    const number = row.reduce((acc, digit, index) => acc + Number(digit) * PLACE_VALUES[index], 0)
    return row[6] === '0' ? null : number
  })
  const allValid = values.every((value) => value !== null)
  const pickedSortedCorrectly = useMemo(() => {
    if (!allValid) return false
    const sorted = [...picked].sort((a, b) => (values[a] ?? 0) - (values[b] ?? 0))
    return picked.length === 3 && sorted.every((rowIndex, index) => rowIndex === picked[index])
  }, [allValid, picked, values])

  const setDigit = (rowIndex: number, placeIndex: number, digit: string) => {
    setChecked(false)
    setRows((previous) => previous.map((row, index) => index === rowIndex ? row.map((cell, cellIndex) => cellIndex === placeIndex ? digit.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))) : cell) : row))
  }
  const togglePick = (rowIndex: number) => {
    setChecked(false)
    setPicked((previous) => previous.includes(rowIndex) ? previous.filter((item) => item !== rowIndex) : previous.length < 3 ? [...previous, rowIndex] : previous)
  }

  return <div className="u2e-task" data-u2e-order="pv-builder">
    <TaskHead title="أنشئ الجدول واكتب ثلاثة أعداد من سبع خانات (أ)، ثم اقرأها (ب)، ورتّبها (ج)" page={85} />
    <div className="u2e-pv-scroll">
      <table className="u2e-pv-table" dir="rtl">
        <thead>
          <tr>{q1Data.places.map((place) => <th key={place} scope="col">{place}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => <tr key={rowIndex}>
            {row.map((digit, placeIndex) => <td key={placeIndex}>
              <input
                className="u2e-pv-cell"
                data-u2e-input={`pv-${rowIndex}-${placeIndex}`}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                aria-label={`العدد ${rowIndex + 1}، خانة ${q1Data.places[placeIndex]}`}
                onChange={(event) => setDigit(rowIndex, placeIndex, event.target.value)}
              />
            </td>)}
            <td className="u2e-pv-result">
              {values[rowIndex] !== null
                ? <span className="u2e-pv-value"><MathExpression>{String(values[rowIndex])}</MathExpression></span>
                : <span className="u2e-pv-missing">أكمل الخانات السبع</span>}
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <ul className="u2e-pv-verbal">
      {values.map((value, index) => <li key={index}>
        {value !== null
          ? <>العدد {index + 1}: <MathExpression>{String(value)}</MathExpression> — الصيغة اللفظية: «{arabicWords(value)}».</>
          : <>العدد {index + 1}: بانتظار إكمال الخانات{rows[index][6] === '0' ? ' — خانة الملايين لا تقبل الصفر في عدد من سبع خانات.' : '.'}</>}
      </li>)}
    </ul>
    <div className="u2e-actions">
      {!allValid
        ? <p className="u2e-guidance">اكتب رقماً في كل خانة؛ ورقم الملايين من 1 إلى 9 حتى يكون العدد من سبع خانات.</p>
        : <p className="u2e-guidance">الآن (ج): انقر الأعداد الثلاثة من الأصغر إلى الأكبر.</p>}
    </div>
    {allValid && <div className="u2e-order-cards">
      {values.map((value, rowIndex) => {
        const rank = picked.indexOf(rowIndex)
        return <button key={rowIndex} type="button" className={`u2e-order-card is-wide ${rank >= 0 ? 'is-placed' : ''}`} aria-pressed={rank >= 0} onClick={() => togglePick(rowIndex)}>
          <MathExpression>{String(value)}</MathExpression>
          {rank >= 0 && <span className="u2e-order-rank">{rank + 1}</span>}
        </button>
      })}
    </div>}
    {picked.length === 3 && <div className="u2e-actions">
      <button type="button" className="u2e-button" onClick={() => setChecked(true)}><Check size={15} aria-hidden="true" /> تحقّق من الترتيب</button>
      <button type="button" className="u2e-button is-ghost" onClick={() => { setPicked([]); setChecked(false) }}><RotateCcw size={14} aria-hidden="true" /> إعادة الترتيب</button>
    </div>}
    {checked && (pickedSortedCorrectly
      ? <Feedback state="correct" attempts={1}>
          <p>الترتيب التصاعدي صحيح: {picked.map((rowIndex) => `${values[rowIndex]}`).join(' ثم ')} — من الأصغر إلى الأكبر ✓</p>
        </Feedback>
      : <Feedback state="wrong" attempts={2} hint="قارن عدد الخانات أولاً، فإن تساوت فقارن من خانة الملايين نحو اليمين حتى تجد فرقاً.">
          <p>الترتيب التصاعدي الصحيح للأعداد الثلاثة: {[...values].sort((a, b) => (a ?? 0) - (b ?? 0)).join(' ثم ')}.</p>
        </Feedback>)}
  </div>
}

function StepQ1() {
  const element = findUnit2ExercisesElement('u2-p85-q1')
  const worked = q1Data.worked
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text="العدد الطبيعي يُبنى من خانات: كل خانة تحمل قيمة تساوي 10 أضعاف الخانة التي على يمينها. جدول الخانات السبع يبدأ من خانة الوحدات وينتهي بخانة الملايين:" /></p>
      <div className="u2e-pv-places" dir="rtl">
        {q1Data.places.map((place, index) => <span key={place} className="u2e-pv-place">
          <strong>{place}</strong>
          <small><MathExpression>{String(PLACE_VALUES[index])}</MathExpression></small>
        </span>)}
      </div>
      <p><Notation text="لماذا؟ لأن نظام كتابة الأعداد عشري: عشر وحدات تصير عشرات، وعشر عشرات تصير مئات، وهكذا حتى الملايين. ومتى أردنا عدداً من سبع خانات كان أصغرها 1000000 وأكبرها 9999999." /></p>
      <PlatformNote>
        <p>متى نستعمل جدول الخانات؟ عند كتابة أعداد كبيرة أو قراءتها أو مقارنتها — وهو ما تطلبه أسئلة ① إلى ④ كلها.</p>
      </PlatformNote>
    </ConceptCard>
    <Worked steps={worked.steps.map((step) => <Notation text={step} />)} />
    <section className="u2e-worked" data-u2e-check="q1-words">
      <h3 className="u2e-card-title"><Table2 size={16} aria-hidden="true" /> جرّب: اقرأ العدد 2601450</h3>
      <ol className="u2e-worked-steps">
        <li>الملايين: 2 → مليونان.</li>
        <li>الآلاف: 601 → ستمئة وألف.</li>
        <li>الباقي: 450 → أربعمئة وخمسون.</li>
        <li>الصيغة اللفظية: <strong>مليونان وستمئة وألف وأربعمئة وخمسون</strong>.</li>
      </ol>
    </section>
    <Mistakes items={q1Data.mistakes} />
    <Sheet element={element}>
      <PlaceValueBuilder />
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 3 · التمرين ② */

/** مقارنة منزلة بمنزلة للكلفين: كشف تدريجي للمنازل من الملايين نحو اليمين. */
function ColumnCompare() {
  const digitsOf = (value: number) => String(value).split('')
  const left = digitsOf(q2Data.building21)
  const right = digitsOf(q2Data.building30)
  const places = ['الملايين', 'مئة الألف', 'عشرات الآلاف', 'الآلاف', 'المئات', 'العشرات', 'الوحدات']
  const [revealed, setRevealed] = useState(3)
  const [answer, setAnswer] = useState<'21' | '30' | null>(null)
  const [checked, setChecked, attempts] = useChecked()
  const diffIndex = 3 // منزلة الآلاف هي أول منزلة مختلفة
  const done = revealed >= 7
  const ok = answer === '21'
  return <div className="u2e-task" data-u2e-order="column-compare">
    <TaskHead title="قارن الكلفين منزلة بمنزلة" page={85} />
    <div className="u2e-pv-scroll">
      <table className="u2e-cols-table" dir="rtl">
        <thead>
          <tr>{places.map((place, index) => <th key={place} className={index === diffIndex && revealed > diffIndex ? 'is-diff-head' : ''}>{place}</th>)}</tr>
        </thead>
        <tbody>
          {[left, right].map((digits, rowIndex) => <tr key={rowIndex}>
            {digits.map((digit, index) => (
              <td key={index} className={`u2e-col-cell ${index >= revealed ? 'is-hidden' : ''} ${index === diffIndex && revealed > diffIndex ? 'is-diff' : ''}`}>{digit}</td>
            ))}
            <td className="u2e-pv-result">{rowIndex === 0 ? <MathExpression>{String(q2Data.building21)}</MathExpression> : <MathExpression>{String(q2Data.building30)}</MathExpression>}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <div className="u2e-actions">
      {!done
        ? <button type="button" className="u2e-button" onClick={() => setRevealed((count) => Math.min(count + 1, 7))}><Play size={15} aria-hidden="true" /> افحص المنزلة التالية من اليسار</button>
        : <p className="u2e-guidance">كل المنازل مكشوفة: أول ثلاث منازل متساوية (1، 0، 8) ومنزلة الآلاف تحسم المقارنة.</p>}
      {revealed > diffIndex && !done && <p className="u2e-guidance is-strong">الفرق ظهر في منزلة الآلاف: <MathExpression>1 &lt; 2</MathExpression> — لا داعي لفحص بقية المنازل.</p>}
    </div>
    <p className="u2e-question"><Notation text="أيهما كلفة إصلاحه أقل؟" /></p>
    <div className="u2e-choice-row">
      {(['21', '30'] as const).map((value) => <label key={value} className={`u2e-choice ${toneClass(checked, answer === value, ok)}`}>
        <input type="radio" name="u2e-q2-answer" checked={answer === value} onChange={() => { setChecked(false); setAnswer(value) }} />
        البناء ذو الرقم {value}
      </label>)}
    </div>
    <div className="u2e-actions">
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={answer === null}><Check size={15} aria-hidden="true" /> تحقّق</button>
    </div>
    <Feedback
      state={checked ? (ok ? 'correct' : 'wrong') : 'idle'}
      attempts={attempts}
      hint="العددان من سبع خانات؛ نقارن من خانة الملايين نحو اليمين: 1 = 1، ثم 0 = 0، ثم 8 = 8، ثم في منزلة الآلاف 1 مقابل 2."
    >
      <p><Notation text="المنازل الثلاث الأولى متساوية (1، 0، 8)؛ ومنزلة الآلاف: 1 في 1081785 مقابل 2 في 1082180، و 1 < 2، إذن 1081785 < 1082180." /></p>
      <p>إذن كلفة إصلاح البناء ذي الرقم <strong>21</strong> أقل.</p>
      <p className="u2e-check-line"><ArrowLeftRight size={14} aria-hidden="true" /> تحقّق بالطرح: <MathExpression>1082180 − 1081785 = 395</MathExpression> ليرة فرقاً بين الكلفين.</p>
    </Feedback>
  </div>
}

function CompareDrill({ name, left, right, answer, why }: { name: string; left: MathVal; right: MathVal; answer: '>' | '<' | '='; why: string }) {
  const [picked, setPicked] = useState<'>' | '<' | '=' | null>(null)
  const [checked, setChecked, attempts] = useChecked()
  const ok = picked === answer
  return <div className="u2e-subtask">
    <p className="u2e-question"><ComparePair left={left} right={right} /></p>
    <div className="u2e-choice-row">
      {(['>', '<', '='] as const).map((symbol) => <label key={symbol} className={`u2e-choice is-symbol ${toneClass(checked, picked === symbol, ok)}`}>
        <input type="radio" name={name} checked={picked === symbol} onChange={() => { setChecked(false); setPicked(symbol) }} />
        <span className="u2e-symbol">{symbol}</span>
      </label>)}
    </div>
    <div className="u2e-actions">
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={picked === null}><Check size={15} aria-hidden="true" /> تحقّق</button>
    </div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="ابدأ من أعلى منزلة واتجه يميناً حتى تجد أول منزلة مختلفة.">
      <p><Notation text={why} /></p>
    </Feedback>
  </div>
}

function StepQ2() {
  const element = findUnit2ExercisesElement('u2-p85-q2')
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text="لمقارنة عددين طبيعيين نبدأ من عدد الخانات: الأكثر خانات أكبر دائماً. فإن تساوت الخانات قارنّا منزلة بمنزلة بدءاً من أعلى منزلة (الملايين هنا) ونحرك يميناً حتى نجد أول منزلة مختلفة؛ صاحب الرقم الأكبر في تلك المنزلة هو الأكبر، ولا يهم ما بعدها." /></p>
      <PlatformNote title="لماذا نبدأ من أعلى منزلة؟">
        <p>لأن قيمة أي منزلة أدنى أصغر من مجموع كل المنازل فوقها؛ أول فرق من الأعلى هو الحاسم دائماً.</p>
      </PlatformNote>
    </ConceptCard>
    <Worked steps={q2Data.worked.steps.map((step) => <Notation text={step} />)} />
    <section className="u2e-card">
      <h3 className="u2e-card-title"><Target size={16} aria-hidden="true" /> تدريب متدرج: قارن بنفسك</h3>
      <div className="u2e-subtask-list">
        {q2Data.practice.map((item, index) => <CompareDrill key={index} name={`u2e-q2-drill-${index}`} left={item.left} right={item.right} answer={item.answer} why={item.why} />)}
      </div>
    </section>
    <Mistakes items={q2Data.mistakes} />
    <Sheet element={element}>
      <ColumnCompare />
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 4 · التمرين ③ */

function StepQ3() {
  const element = findUnit2ExercisesElement('u2-p85-q3')
  const [picked, setPicked] = useState<string[]>([])
  const [checked, setChecked, attempts] = useChecked()
  const solution = ['C', 'A', 'B']
  const done = picked.length === 3
  const ok = done && picked[0] === 'C' && picked[1] === 'A' && picked[2] === 'B'
  const pick = (key: string) => {
    setChecked(false)
    setPicked((previous) => previous.includes(key) ? previous.filter((item) => item !== key) : previous.length < 3 ? [...previous, key] : previous)
  }
  const practice = q3Data.practice
  const practiceSorted = [...practice].sort((a, b) => a - b)
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text="الترتيب التصاعدي يعني من الأصغر إلى الأكبر. القاعدة نفسها التي تدربت عليها في التمرين ②: عدد الخانات أولاً، فإن تساوت قارنّا من أعلى منزلة نزولاً. وعند ترتيب ثلاثة أعداد نحسم العلاقات زوجاً زوجاً ثم نكتب السلسلة." /></p>
    </ConceptCard>
    <Worked steps={q3Data.worked.steps.map((step) => <Notation text={step} />)} />
    <OrderByClick
      id="q3-practice"
      cards={practice.map((value) => ({ key: String(value), node: <MathExpression>{String(value)}</MathExpression>, aria: `ترتيب العدد ${value}` }))}
      solution={practiceSorted.map((value) => String(value))}
      directionLabel="تدريب: رتّب الأعداد الثلاثة تصاعدياً بالنقر عليها بالترتيب"
      hint="العددان الأولان يشتركان في 789؛ انظر إلى منزلة عشرات الآلاف ثم مئات الآلاف."
      solutionSteps={<p>الترتيب التصاعدي: {practiceSorted.join(' ثم ')} — قارنّا 789050 مع 789500 في منزلة المئات (0 &lt; 5)، ثم قارنّا 789500 مع 798500 في منزلة عشرات الآلاف (8 &lt; 9).</p>}
    />
    <Mistakes items={q3Data.mistakes} />
    <Sheet element={element}>
      <TaskHead title="رتّب العينات A و B و C ترتيباً تصاعدياً حسب عدد الجراثيم" page={85} />
      <div className="u2e-order-slots" aria-label="مواقع الترتيب">
        {solution.map((_, index) => {
          const key = picked[index]
          return <span key={index} className={`u2e-order-slot ${key ? 'is-filled' : ''} ${checked ? (ok ? 'is-right' : key === solution[index] ? 'is-right' : 'is-wrong') : ''}`}>
            <small>{index + 1}</small>
            {key
              ? <span className="u2e-sample-chip">
                  <strong>{key}</strong>
                  <MathExpression>{String(q3Data.samples.find((sample) => sample.key === key)?.value ?? '')}</MathExpression>
                </span>
              : <span className="u2e-order-empty" aria-hidden="true">؟</span>}
          </span>
        })}
      </div>
      <div className="u2e-order-cards">
        {q3Data.samples.map((sample) => {
          const rank = picked.indexOf(sample.key)
          return <button key={sample.key} type="button" className={`u2e-order-card is-wide ${rank >= 0 ? 'is-placed' : ''}`} aria-pressed={rank >= 0} aria-label={`العينة ${sample.key} عدد الجراثيم ${sample.value}`} onClick={() => pick(sample.key)}>
            <span className="u2e-sample-letter">{sample.key}</span>
            <MathExpression>{String(sample.value)}</MathExpression>
            {rank >= 0 && <span className="u2e-order-rank">{rank + 1}</span>}
          </button>
        })}
      </div>
      <div className="u2e-actions">
        <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={!done}><Check size={15} aria-hidden="true" /> تحقّق</button>
        <button type="button" className="u2e-button is-ghost" onClick={() => { setPicked([]); setChecked(false) }}><RotateCcw size={14} aria-hidden="true" /> إعادة</button>
      </div>
      <Feedback
        state={checked ? (ok ? 'correct' : 'wrong') : 'idle'}
        attempts={attempts}
        hint="الأعداد الثلاثة من سبع خانات. انظر إلى خانة مئة الألف: 0 في إحدى العينات و 2 في الأخريين؛ ثم افصل بين A و B في منزلة عشرات الآلاف."
      >
        <ol className="u2e-worked-steps">
          {element.steps.map((step, index) => <li key={index}><Notation text={step} /></li>)}
        </ol>
        <p><strong>الترتيب التصاعدي: C ثم A ثم B</strong> — أي <MathExpression>1002347 &lt; 1205348 &lt; 1214999</MathExpression>.</p>
      </Feedback>
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 5 · التمرين ④ */

/** حلّال لغز المنزلتين: تجريب أرقام العشرات والآحاد مع إضاءة الشرطين. */
function PuzzleSolver() {
  const [tens, setTens] = useState<number | null>(null)
  const [ones, setOnes] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const diffOk = tens !== null && ones !== null && tens - ones === 6
  const sumOk = tens !== null && ones !== null && tens + ones === 8
  const solved = diffOk && sumOk
  const ok = normalizeInput(answer) === '139971'
  return <div className="u2e-task" data-u2e-order="digit-detective">
    <TaskHead title="مختبر اللغز: جرّب أرقام العشرات والآحاد" platform />
    <div className="u2e-puzzle">
      <label className="u2e-field">
        <span>رقم العشرات (س)</span>
        <select className="u2e-input" value={tens ?? ''} onChange={(event) => { setChecked(false); setAnswer(''); setTens(event.target.value === '' ? null : Number(event.target.value)) }} aria-label="رقم العشرات">
          <option value="">—</option>
          {Array.from({ length: 10 }, (_, digit) => <option key={digit} value={digit}>{digit}</option>)}
        </select>
      </label>
      <label className="u2e-field">
        <span>رقم الآحاد (ص)</span>
        <select className="u2e-input" value={ones ?? ''} onChange={(event) => { setChecked(false); setAnswer(''); setOnes(event.target.value === '' ? null : Number(event.target.value)) }} aria-label="رقم الآحاد">
          <option value="">—</option>
          {Array.from({ length: 10 }, (_, digit) => <option key={digit} value={digit}>{digit}</option>)}
        </select>
      </label>
      <div className="u2e-badges">
        <span className={`u2e-badge ${diffOk ? 'is-on' : ''}`}><MathExpression>س − ص = 6</MathExpression> {diffOk ? '✓' : ''}</span>
        <span className={`u2e-badge ${sumOk ? 'is-on' : ''}`}><MathExpression>س + ص = 8</MathExpression> {sumOk ? '✓' : ''}</span>
      </div>
    </div>
    {solved && <PlatformNote title="تحقق الشرطان معاً!">
      <p><MathExpression>س = 7</MathExpression> و <MathExpression>ص = 1</MathExpression>. بقيت خطوة واحدة: ركّب العدد كاملاً — تذكّر أن العدد يقع بين <MathExpression>139900</MathExpression> و <MathExpression>140000</MathExpression>، فشكله <MathExpression>1399□□</MathExpression>.</p>
    </PlatformNote>}
    <div className="u2e-actions">
      <label className="u2e-field">
        <span>فمن أنا؟</span>
        <input className="u2e-input" data-u2e-input="q4-answer" inputMode="numeric" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label="العدد المجهول" />
      </label>
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button>
    </div>
    <Feedback
      state={checked ? (ok ? 'correct' : 'wrong') : 'idle'}
      attempts={attempts}
      hint="ابحث عن عددين مجموعهما 8 وفرقهما 6، ثم ضعهما في منزلتَي العشرات والآحاد داخل المجال المطلوب."
    >
      <ol className="u2e-worked-steps">
        {findUnit2ExercisesElement('u2-p85-q4').steps.map((step, index) => <li key={index}><Notation text={step} /></li>)}
      </ol>
      <p><strong>العدد هو 139971</strong> — <MathExpression>139900 + 70 + 1 = 139971</MathExpression>.</p>
      <p className="u2e-check-line"><ArrowLeftRight size={14} aria-hidden="true" /> الفحوص: <MathExpression>7 − 1 = 6</MathExpression> ✓، <MathExpression>7 + 1 = 8</MathExpression> ✓، <MathExpression>139900 &lt; 139971 &lt; 140000</MathExpression> ✓.</p>
    </Feedback>
  </div>
}

function StepQ4() {
  const element = findUnit2ExercisesElement('u2-p85-q4')
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text="المسائل اللفظية تُترجم إلى لغة الأرقام. «عشراتي» و«آحادي» منزلتان في العدد، فنفترض رقم العشرات س ورقم الآحاد ص، ونحوّل كل جملة إلى علاقة:" /></p>
      <ul className="u2e-rule-list">
        <li>«عشراتي أكبر من آحادي بـ <MathExpression>6</MathExpression>» تعني <MathExpression>س = ص + 6</MathExpression>.</li>
        <li>«مجموع عشراتي مع آحادي <MathExpression>8</MathExpression>» تعني <MathExpression>س + ص = 8</MathExpression>.</li>
      </ul>
      <p><Notation text="نحل العلاقتين معاً بالتعويض، ثم نستعمل قيد «بين 139900 و 140000» لتركيب العدد الكامل: فشكله 1399□□ حيث □□ عشراته وآحاده." /></p>
    </ConceptCard>
    <Worked title="مثال محلول بنفس الفكرة (بأرقام أخرى)" steps={q4Data.worked.steps.map((step) => <Notation text={step} />)} />
    <p className="u2e-quote-inline"><Notation text={q4Data.worked.text} /></p>
    <Mistakes items={q4Data.mistakes} />
    <Sheet element={element}>
      <PuzzleSolver />
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 6 · التمرين ⑤ */

/** مختبر المضاعفات: عددان يختارهما الطالب وقائمتا مضاعفاتهما وأول مشترك. */
function LcmLab() {
  const [first, setFirst] = useState('4')
  const [second, setSecond] = useState('6')
  const a = Math.min(12, Math.max(2, Number(first) || 4))
  const b = Math.min(12, Math.max(2, Number(second) || 6))
  const multiplesOf = (value: number) => Array.from({ length: 6 }, (_, index) => value * (index + 1))
  const listA = multiplesOf(a)
  const listB = multiplesOf(b)
  const commons = listA.filter((value) => listB.includes(value))
  return <div className="u2e-task" data-u2e-order="lcm-lab">
    <TaskHead title="مختبر المضاعفات: اكتب عددين وشاهد قائمتي مضاعفاتهما" platform />
    <div className="u2e-puzzle">
      <label className="u2e-field"><span>العدد الأول</span>
        <input className="u2e-input" data-u2e-input="lcm-lab-a" inputMode="numeric" value={first} onChange={(event) => setFirst(event.target.value)} aria-label="العدد الأول" />
      </label>
      <label className="u2e-field"><span>العدد الثاني</span>
        <input className="u2e-input" data-u2e-input="lcm-lab-b" inputMode="numeric" value={second} onChange={(event) => setSecond(event.target.value)} aria-label="العدد الثاني" />
      </label>
    </div>
    <div className="u2e-multiples">
      <div className="u2e-multiple-row"><strong>مضاعفات <MathExpression>{String(a)}</MathExpression>:</strong><span>{listA.map((value) => <span key={value} className={`u2e-multiple ${commons.includes(value) ? 'is-common' : ''}`}><MathExpression>{String(value)}</MathExpression></span>)}</span></div>
      <div className="u2e-multiple-row"><strong>مضاعفات <MathExpression>{String(b)}</MathExpression>:</strong><span>{listB.map((value) => <span key={value} className={`u2e-multiple ${commons.includes(value) ? 'is-common' : ''}`}><MathExpression>{String(value)}</MathExpression></span>)}</span></div>
    </div>
    <p className="u2e-guidance is-strong">
      {commons.length > 0
        ? <>المضاعفات المشتركة (المضيئة): {commons.join('، ')} — وأولها وأصغرها هو <strong><MathExpression>{String(commons[0])}</MathExpression></strong>، وهو المضاعف المشترك الأصغر.</>
        : 'اكتب عددين بين 2 و 12 لعرض المضاعفات.'}
      {' '}لاحظ: حاصل الضرب {a * b} مضاعف مشترك دائماً، لكنه ليس دائماً الأصغر.
    </p>
  </div>
}

function LcmTask({ seed }: { seed: (typeof q5Sets)[number] }) {
  const branch = findUnit2ExercisesElement('u2-p85-q5').branches?.find((item) => item.id === seed.id)
  const expected = String(lcmOf(seed.numbers))
  const [answer, setAnswer] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const ok = normalizeInput(answer) === expected
  return <div className="u2e-task" data-u2e-check={seed.id}>
    <TaskHead title={`الفرع (${seed.label})`} page={85} />
    <p className="u2e-question">م.م.أ ({seed.numbers.join('، ')}) = ؟</p>
    <div className="u2e-actions">
      <label className="u2e-field">
        <span>المضاعف المشترك الأصغر</span>
        <input className="u2e-input" data-u2e-input={seed.id} inputMode="numeric" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label={`مضاعف مشترك أصغر للفرع ${seed.label}`} />
      </label>
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button>
    </div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="اكتب مضاعفات العدد الأكبر بالترتيب، وتوقف عند أول مضاعف يقبل القسمة على بقية الأعداد.">
      {branch && <ol className="u2e-worked-steps">
        {branch.steps.map((step, index) => <li key={index}><Notation text={step} /></li>)}
      </ol>}
    </Feedback>
  </div>
}

function StepQ5() {
  const element = findUnit2ExercisesElement('u2-p85-q5')
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text={q5Data.concept} /></p>
      <p><Notation text={q5Data.when} /></p>
      <PlatformNote title="لماذا نحتاجه؟">
        <p>{q5Data.why}</p>
      </PlatformNote>
    </ConceptCard>
    <Worked steps={q5Data.worked.steps.map((step) => <Notation text={step} />)} />
    <LcmLab />
    <Mistakes items={q5Data.mistakes} />
    <Sheet element={element}>
      <p className="u2e-guidance">حل كل فرع بنفسك ثم تحقّق؛ الحل الكامل يظهر بعد المحاولة الثانية.</p>
      {q5Sets.map((set) => <LcmTask key={set.id} seed={set} />)}
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 7 · التمرين ⑥ */

function SymbolPicker({ item }: { item: ComparisonItem }) {
  const [picked, setPicked] = useState<'>' | '<' | '=' | null>(null)
  const [checked, setChecked, attempts] = useChecked()
  const ok = picked === item.answer
  return <div className="u2e-task" data-u2e-check={item.id}>
    <TaskHead title={`الفرع (${item.label})`} page={item.id.startsWith('u2-p86') ? 86 : 85} />
    <p className="u2e-question"><ComparePair left={item.left} right={item.right} /></p>
    <div className="u2e-choice-row">
      {(['>', '<', '='] as const).map((symbol) => <label key={symbol} className={`u2e-choice is-symbol ${toneClass(checked, picked === symbol, ok)}`}>
        <input type="radio" name={`u2e-q6-${item.id}`} data-u2e-symbol={symbol} checked={picked === symbol} onChange={() => { setChecked(false); setPicked(symbol) }} />
        <span className="u2e-symbol">{symbol}</span>
      </label>)}
    </div>
    <div className="u2e-actions">
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={picked === null}><Check size={15} aria-hidden="true" /> تحقّق</button>
    </div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint={item.strategy}>
      <ol className="u2e-worked-steps">
        {item.steps.map((step, index) => <li key={index}><Notation text={step} /></li>)}
      </ol>
      <p><strong>الرمز الصحيح: {item.answer}</strong></p>
    </Feedback>
  </div>
}

function StepQ6() {
  const element = findUnit2ExercisesElement('u2-p85-q6')
  return <div className="u2e-stack">
    <ConceptCard>
      <p>مقارنة كسرين أو عدد عشري بكسر تحتاج توحيد الصورتين أولاً. أربع استراتيجيات تغطي كل فروع التمرين:</p>
      <div className="u2e-strategies">
        {q6Data.strategies.map((strategy) => <div className="u2e-strategy" key={strategy.title}>
          <strong>{strategy.title}</strong>
          <p><Notation text={strategy.body} /></p>
        </div>)}
      </div>
    </ConceptCard>
    <Worked steps={q6Data.worked.steps.map((step) => <Notation text={step} />)} />
    <section className="u2e-card">
      <h3 className="u2e-card-title"><Target size={16} aria-hidden="true" /> تدريب متدرج: ثلاث حالات نموذجية</h3>
      <div className="u2e-subtask-list">
        {q6Data.practice.map((item, index) => <CompareDrill key={index} name={`u2e-q6-drill-${index}`} left={item.left} right={item.right} answer={item.answer} why={item.why} />)}
      </div>
    </section>
    <Mistakes items={q6Data.mistakes} />
    <Sheet element={element}>
      <p className="u2e-guidance">الفروع (أ) إلى (و) مطبوعة في أسفل ص 85، والفروع (ز) و (ح) و (ط) في أعلى ص 86.</p>
      <div className="u2e-subtask-list">
        {q6Items.map((item) => <SymbolPicker key={item.id} item={item} />)}
      </div>
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوتان 8 و 9 · التمرينان ⑦ و ⑧ */

function FractionGroupCards({ group, direction }: { group: OrderGroup; direction: 'asc' | 'desc' }) {
  const labels = group.items.map((item) => valueLabel(item))
  const sorted = [...group.items].sort((a, b) => direction === 'asc' ? valueOf(a) - valueOf(b) : valueOf(b) - valueOf(a))
  return <OrderByClick
    id={group.id}
    cards={group.items.map((item, index) => ({
      key: `f${index}`,
      node: item.kind === 'fraction' ? <Frac n={item.n} d={item.d} /> : <Val value={item} />,
      aria: `ترتيب الكسر ${labels[index]}`,
    }))}
    solution={sorted.map((item) => `f${group.items.indexOf(item)}`)}
    directionLabel={`الفرع (${group.label}) · ص ${group.page}`}
    hint="وحّد المقامات أولاً: حوّل كل كسر إلى كسر مكافئ بالمقام المشترك ثم قارن البسوط."
    solutionSteps={<ol className="u2e-worked-steps">{group.steps.map((step, index) => <li key={index}><Notation text={step} /></li>)}</ol>}
  />
}

function StepQ7() {
  const element = findUnit2ExercisesElement('u2-p86-q7')
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text={q7Data.concept} /></p>
      <p><Notation text={q7Data.when} /></p>
    </ConceptCard>
    <Worked steps={q7Data.worked.steps.map((step) => <Notation text={step} />)} />
    <OrderByClick
      id="q7-practice"
      cards={q7Data.practice.map((item, index) => ({ key: `p${index}`, node: <Frac n={item.n} d={item.d} />, aria: `ترتيب الكسر ${valueLabel(item)}` }))}
      solution={['p2', 'p0', 'p1', 'p3']}
      directionLabel="تدريب: المقامات هنا متساوية (8) — رتّب البسوط تصاعدياً بالنقر"
      hint="المقامات متساوية فالأجزاء من الحجم نفسه؛ الأصغر بسطاً هو الأصغر قيمة."
      solutionSteps={<p>الترتيب التصاعدي: 1/8 ثم 3/8 ثم 5/8 ثم 7/8 — بمقارنة البسوط مباشرة 1 &lt; 3 &lt; 5 &lt; 7.</p>}
    />
    <Mistakes items={q7Data.mistakes} />
    <Sheet element={element}>
      <p className="u2e-guidance">انقر الكسور بالترتيب التصاعدي في كل فرع، ثم تحقّق لتشاهد التوحيد كاملاً.</p>
      {q7Groups.map((group) => <FractionGroupCards key={group.id} group={group} direction="asc" />)}
    </Sheet>
  </div>
}

function StepQ8() {
  const element = findUnit2ExercisesElement('u2-p86-q8')
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text={q8Data.concept} /></p>
      <PlatformNote title="انتبه لحالة خاصة">
        <p>إذا تساوت البسوط فإن الحكم ينعكس: أكبر مقام يعني كسراً أصغر لأن الأجزاء تتقلص. هذا يظهر في التدريب أدناه.</p>
      </PlatformNote>
    </ConceptCard>
    <Worked steps={q8Data.worked.steps.map((step) => <Notation text={step} />)} />
    <OrderByClick
      id="q8-practice"
      cards={q8Data.practice.map((item, index) => ({ key: `p${index}`, node: <Frac n={item.n} d={item.d} />, aria: `ترتيب الكسر ${valueLabel(item)}` }))}
      solution={[0, 2, 1].map((index) => `p${index}`)}
      directionLabel="تدريب: البسوط متساوية (3) — رتّب تنازلياً بالنقر"
      hint="البسط واحد والأجزاء من أحجام مختلفة: المقام الأصغر يعني جزءاً أكبر."
      solutionSteps={<p>الترتيب التنازلي: 3/4 ثم 3/5 ثم 3/8 — الأرباع أكبر من الأخماس وأخماساً أكبر من الأثمان.</p>}
    />
    <Mistakes items={q8Data.mistakes} />
    <Sheet element={element}>
      <p className="u2e-guidance">انقر الكسور بالترتيب التنازلي (من الأكبر) في كل فرع، ثم تحقّق.</p>
      {q8Groups.map((group) => <FractionGroupCards key={group.id} group={group} direction="desc" />)}
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 10 · التمرين ⑨ */

function mixedToImproperSteps(w: number, n: number, d: number): string[] {
  const numerator = w * d + n
  return [
    `نحوّل العدد الصحيح ${w} إلى كسرات من المقام ${d}: ${w} × ${d} = ${w * d}.`,
    `نضيف بسط الكسر: ${w * d} + ${n} = ${numerator}.`,
    `إذن ${w} ${n}/${d} = ${numerator}/${d}.`,
  ]
}

function MixedToImproperTask({ seed }: { seed: (typeof q9Items)[number] }) {
  const numerator = seed.w * seed.d + seed.n
  const steps = mixedToImproperSteps(seed.w, seed.n, seed.d)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const ok = normalizeInput(answer) === String(numerator)
  return <div className="u2e-task" data-u2e-check={seed.id}>
    <TaskHead title={`الفرع (${seed.label})`} page={86} />
    <p className="u2e-question" aria-label={`حوّل ${seed.w} و${seed.n} على ${seed.d}`}>
      <MixedGlyph w={seed.w} n={seed.n} d={seed.d} /> <span className="u2e-eq">=</span>
      <span className="u2e-frac is-input" dir="ltr">
        <span className="u2e-frac-num">
          <input
            className="u2e-input is-bare"
            data-u2e-input={seed.id}
            inputMode="numeric"
            value={answer}
            placeholder="؟"
            aria-label={`بسط الكسر للفرع ${seed.label}`}
            onChange={(event) => { setChecked(false); setAnswer(event.target.value) }}
          />
        </span>
        <span className="u2e-frac-rule" aria-hidden="true" />
        <span className="u2e-frac-den">{seed.d}</span>
      </span>
    </p>
    <div className="u2e-actions">
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button>
    </div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="اضرب العدد الصحيح في المقام ثم أضف البسط؛ والمقام يبقى كما هو.">
      <ol className="u2e-worked-steps">
        {steps.map((step, index) => <li key={index}><Notation text={step} /></li>)}
      </ol>
    </Feedback>
  </div>
}

function StepQ9() {
  const element = findUnit2ExercisesElement('u2-p86-q9')
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text={q9Data.concept} /></p>
      <p><Notation text={q9Data.why} /></p>
      <PlatformNote title="الفكرة بالصورة">
        <p>العدد 2 1/3 يحمل ثلثين كاملين: كل واحد يساوي <MathExpression>3/3</MathExpression>، أي <MathExpression>2 × 3 = 6</MathExpression> أثلاثاً، نضيف إليها الثلث الباقي فنحصل على <MathExpression>7/3</MathExpression>.</p>
      </PlatformNote>
    </ConceptCard>
    <Worked steps={q9Data.worked.steps.map((step) => <Notation text={step} />)} />
    <section className="u2e-card">
      <h3 className="u2e-card-title"><Target size={16} aria-hidden="true" /> تدريب متدرج</h3>
      <div className="u2e-subtask-list">
        {q9Data.practice.map((item, index) => <MixedToImproperTask key={index} seed={{ ...item, id: `q9-practice-${index}`, label: `${index + 1}`, pitfall: undefined }} />)}
      </div>
    </section>
    <Mistakes items={q9Data.mistakes} />
    <Sheet element={element}>
      <div className="u2e-subtask-list">
        {q9Items.map((item) => <MixedToImproperTask key={item.id} seed={item} />)}
      </div>
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 11 · التمرين ⑩ */

function improperToMixedSteps(n: number, d: number): string[] {
  const whole = Math.floor(n / d)
  const remainder = n % d
  const steps = [
    `نقسم البسط على المقام: ${n} ÷ ${d} = ${whole} والباقي ${remainder}.`,
    `خارج القسمة ${whole} هو العدد الصحيح، والباقي ${remainder} بسط الكسر، والمقام يبقى ${d}.`,
    `إذن ${n}/${d} = ${whole} ${remainder}/${d}.`,
  ]
  if (n === 70 && d === 40) steps.push('نبسّط الكسر 30/40 بقسمة بسطه ومقامه على 10 فيصير 3/4، فيكون الجواب 1 3/4.')
  return steps
}

function ImproperToMixedTask({ seed }: { seed: (typeof q10Items)[number] }) {
  const whole = Math.floor(seed.n / seed.d)
  const remainder = seed.n % seed.d
  const steps = improperToMixedSteps(seed.n, seed.d)
  const [wholeText, setWholeText] = useState('')
  const [numText, setNumText] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const ok = normalizeInput(wholeText) === String(whole) && normalizeInput(numText) === String(remainder)
  return <div className="u2e-task" data-u2e-check={seed.id}>
    <TaskHead title={`الفرع (${seed.label})`} page={86} />
    <p className="u2e-question" aria-label={`حوّل ${seed.n} على ${seed.d}`}>
      <Frac n={seed.n} d={seed.d} /> <span className="u2e-eq">=</span>
      <input
        className="u2e-input is-bare is-whole"
        data-u2e-input={`${seed.id}-w`}
        inputMode="numeric"
        value={wholeText}
        placeholder="؟"
        aria-label={`العدد الصحيح للفرع ${seed.label}`}
        onChange={(event) => { setChecked(false); setWholeText(event.target.value) }}
      />
      <span className="u2e-frac is-input" dir="ltr">
        <span className="u2e-frac-num">
          <input
            className="u2e-input is-bare"
            data-u2e-input={`${seed.id}-n`}
            inputMode="numeric"
            value={numText}
            placeholder="؟"
            aria-label={`بسط الكسر للفرع ${seed.label}`}
            onChange={(event) => { setChecked(false); setNumText(event.target.value) }}
          />
        </span>
        <span className="u2e-frac-rule" aria-hidden="true" />
        <span className="u2e-frac-den">{seed.d}</span>
      </span>
    </p>
    <div className="u2e-actions">
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={!wholeText.trim() || !numText.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button>
    </div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint={`قسّم ${seed.n} على ${seed.d}: الخارج عدد صحيح والباقي بسط، والمقام يبقى ${seed.d}.`}>
      <ol className="u2e-worked-steps">
        {steps.map((step, index) => <li key={index}><Notation text={step} /></li>)}
      </ol>
    </Feedback>
  </div>
}

function StepQ10() {
  const element = findUnit2ExercisesElement('u2-p86-q10')
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text={q10Data.concept} /></p>
      <p><Notation text={q10Data.why} /></p>
    </ConceptCard>
    <Worked steps={q10Data.worked.steps.map((step) => <Notation text={step} />)} />
    <section className="u2e-card">
      <h3 className="u2e-card-title"><Target size={16} aria-hidden="true" /> تدريب متدرج</h3>
      <div className="u2e-subtask-list">
        {q10Data.practice.map((item, index) => <ImproperToMixedTask key={index} seed={{ ...item, id: `q10-practice-${index}`, label: `${index + 1}` }} />)}
      </div>
    </section>
    <Mistakes items={q10Data.mistakes} />
    <Sheet element={element}>
      <div className="u2e-subtask-list">
        {q10Items.map((item) => <ImproperToMixedTask key={item.id} seed={item} />)}
      </div>
      <PlatformNote title="لماذا نبدّل في الفرع (د)؟">
        <p>الكسر <MathExpression>70/40</MathExpression> يتحول إلى <MathExpression>1 30/40</MathExpression>، ويمكن تبسيط <MathExpression>30/40</MathExpression> بقسمة البسط والمقام على 10 فنحصل على <MathExpression>1 3/4</MathExpression> — وهي الصورة الأبسط للجواب.</p>
      </PlatformNote>
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 12 · التمرين ⑪ */

const FIG_SCALE = 40
const FIG = {
  A: { x: 40, y: 40 },
  B: { x: 40 + 8 * FIG_SCALE, y: 40 },
  C: { x: 40 + 8 * FIG_SCALE, y: 40 + 5 * FIG_SCALE },
  D: { x: 40, y: 40 + 5 * FIG_SCALE },
  E: { x: 40 + 8 * FIG_SCALE, y: 40 + 3 * FIG_SCALE },
  F: { x: 40 + 10 * FIG_SCALE, y: 40 + 3 * FIG_SCALE },
  G: { x: 40 + 10 * FIG_SCALE, y: 40 + 5 * FIG_SCALE },
}

/** رسم تفاعلي للشكل: النقر على القطعة يبرز تفكيكها ويرافق إدخال طولها. */
function FigureMeasure() {
  const [selected, setSelected] = useState<'DG' | 'AB' | 'CB' | null>(null)
  const branchFor = (key: 'DG' | 'AB' | 'CB') => findUnit2ExercisesElement('u2-p86-q11').branches?.find((item) => item.id === `u2-p86-q11-${key === 'DG' ? 'a' : key === 'AB' ? 'b' : 'c'}`)
  const lengthFor = (key: 'DG' | 'AB' | 'CB') => q11Data.lengths[key]
  return <div className="u2e-task" data-u2e-order="figure-measure">
    <TaskHead title="انقر كل قطعة لتشاهد تفكيكها، ثم أدخل طولها" page={86} />
    <div className="u2e-figure-wrap">
      <svg viewBox="0 0 460 284" className="u2e-figure" role="img" aria-label="مستطيل ABCD طوله السفلي 8 سم، ومربّع EFGC ضلعه 2 سم ملتصق به من اليمين، والنقطة E على الضلع BC و BE يساوي 3 سم" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
        {/* المستطيل ABCD */}
        <polygon points={`${FIG.A.x},${FIG.A.y} ${FIG.B.x},${FIG.B.y} ${FIG.C.x},${FIG.C.y} ${FIG.D.x},${FIG.D.y}`} className="u2e-fig-shape" />
        {/* المربّع EFGC */}
        <polygon points={`${FIG.E.x},${FIG.E.y} ${FIG.F.x},${FIG.F.y} ${FIG.G.x},${FIG.G.y} ${FIG.C.x},${FIG.C.y}`} className="u2e-fig-square" />
        {/* القطع القابلة للاختيار */}
        {([
          { key: 'DG' as const, points: `${FIG.D.x},${FIG.D.y} ${FIG.C.x},${FIG.C.y} ${FIG.G.x},${FIG.G.y}` },
          { key: 'AB' as const, points: `${FIG.A.x},${FIG.A.y} ${FIG.B.x},${FIG.B.y}` },
          { key: 'CB' as const, points: `${FIG.C.x},${FIG.C.y} ${FIG.E.x},${FIG.E.y} ${FIG.B.x},${FIG.B.y}` },
        ]).map((segment) => (
          <polyline
            key={segment.key}
            points={segment.points}
            className={`u2e-fig-seg ${selected === segment.key ? 'is-active' : ''}`}
            onClick={() => setSelected(segment.key)}
            role="button"
            aria-label={`قطعة ${segment.key}`}
          />
        ))}
        {/* تسميات النقاط */}
        {Object.entries(FIG).map(([letter, point]) => <g key={letter}>
          <circle cx={point.x} cy={point.y} r="3.2" className="u2e-fig-vertex" />
          <text x={letter === 'A' || letter === 'D' || letter === 'E' ? point.x - 14 : point.x + 14} y={point.y + (letter === 'A' || letter === 'B' ? -8 : 16)} textAnchor="middle" className="u2e-fig-letter">{letter}</text>
        </g>)}
        {/* القياسات كما في الكتاب */}
        <text x={(FIG.B.x + FIG.E.x) / 2 + 30} y={(FIG.B.y + FIG.E.y) / 2} textAnchor="middle" className="u2e-fig-measure">3cm</text>
        <text x={FIG.F.x + 8} y={(FIG.F.y + FIG.G.y) / 2 + 4} className="u2e-fig-measure">2cm</text>
        <text x={(FIG.D.x + FIG.C.x) / 2} y={FIG.D.y + 24} textAnchor="middle" className="u2e-fig-measure">8cm</text>
      </svg>
      <p className="u2e-figure-caption">ABCD مستطيل، EFGC مربّع — القياسات المكتوبة هي المعطيات نفسها في الكتاب.</p>
    </div>
    <div className="u2e-choice-row">
      {(['DG', 'AB', 'CB'] as const).map((key) => <button key={key} type="button" className={`u2e-choice is-button ${selected === key ? 'is-selected' : ''}`} onClick={() => setSelected(key)}>
        <MathExpression>{key}</MathExpression>
      </button>)}
    </div>
    {selected && <LengthInput key={selected} segment={selected} branch={branchFor(selected)} expected={lengthFor(selected)} />}
    {!selected && <p className="u2e-guidance">اختر قطعة من الأزرار أعلاه أو انقرها على الرسم مباشرة.</p>}
  </div>
}

function LengthInput({ segment, branch, expected }: { segment: 'DG' | 'AB' | 'CB'; branch?: SourceBranch; expected: number }) {
  const [answer, setAnswer] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const ok = normalizeInput(answer) === String(expected)
  return <div className="u2e-subtask" data-u2e-check={`q11-${segment}`}>
    <p className="u2e-question"><MathExpression>{`${segment} = ?`}</MathExpression> (بالسنتيمتر)</p>
    <div className="u2e-actions">
      <label className="u2e-field">
        <span>طول <MathExpression>{segment}</MathExpression></span>
        <input className="u2e-input" data-u2e-input={`q11-${segment}`} inputMode="numeric" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label={`طول القطعة ${segment} بالسنتيمتر`} />
      </label>
      <button type="button" className="u2e-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button>
    </div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="استعمل خواص المستطيل والمربّع: الأضلاع المتقابلة متساوية، وأضلاع المربّع متساوية، والقطعان على استقامة واحدة يُجمع طولهما.">
      {branch && <ol className="u2e-worked-steps">
        {branch.steps.map((step, index) => <li key={index}><Notation text={step} /></li>)}
      </ol>}
    </Feedback>
  </div>
}

function StepQ11() {
  const element = findUnit2ExercisesElement('u2-p86-q11')
  return <div className="u2e-stack">
    <ConceptCard>
      <p><Notation text={q11Data.concept} /></p>
      <PlatformNote title="لماذا لا نحتاج المسطرة؟">
        <p>{q11Data.why}</p>
      </PlatformNote>
      <p><Notation text="التفكيك الذي نحتاجه:" /></p>
      <ul className="u2e-rule-list">
        <li><MathExpression>CB = CE + EB</MathExpression> — والنقطة <MathExpression>E</MathExpression> على الضلع <MathExpression>BC</MathExpression>.</li>
        <li><MathExpression>AB = DC</MathExpression> — ضلعان متقابلان في المستطيل.</li>
        <li><MathExpression>DG = DC + CG</MathExpression> — والنقطة <MathExpression>C</MathExpression> على الاستقامة بين <MathExpression>D</MathExpression> و <MathExpression>G</MathExpression>.</li>
      </ul>
    </ConceptCard>
    <Worked title="مثال محلول: القطعة AB" steps={q11Data.worked.steps.map((step) => <Notation text={step} />)} />
    <Mistakes items={q11Data.mistakes} />
    <Sheet element={element}>
      <FigureMeasure />
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 13 · الخلاصة */

const SUMMARY_ROWS: { exercise: string; skill: string; rule: string }[] = [
  { exercise: '①', skill: 'جدول الخانات والصيغة اللفظية', rule: 'سبع خانات من الملايين إلى الوحدات، والقراءة من أعلى منزلة.' },
  { exercise: '②', skill: 'مقارنة عددين', rule: 'عدد الخانات ثم المقارنة من أعلى منزلة؛ أول فرق يحسم.' },
  { exercise: '③', skill: 'ترتيب تصاعدي', rule: 'القاعدة نفسها زوجاً زوجاً ثم نكتب السلسلة من الأصغر.' },
  { exercise: '④', skill: 'ترجمة لفظية إلى منازل', rule: 'علاقتان بين رقمين + قيد مجال ثم تركيب العدد.' },
  { exercise: '⑤', skill: 'م.م.أ', rule: 'مضاعفات العدد الأكبر حتى أول مضاعف يقبل القسمة على البقية.' },
  { exercise: '⑥', skill: 'رموز المقارنة', rule: 'وحّد الصورتين: مقام مشترك أو صورة عشرية أو تبسيط.' },
  { exercise: '⑦', skill: 'ترتيب كسور تصاعدياً', rule: 'توحيد المقامات ثم مقارنة البسوط من الأصغر.' },
  { exercise: '⑧', skill: 'ترتيب كسور تنازلياً', rule: 'الاستراتيجية نفسها والاتجاه معكوس.' },
  { exercise: '⑨', skill: 'مركب ← كسر عادي', rule: '(الصحيح × المقام) + البسط، على المقام نفسه.' },
  { exercise: '⑩', skill: 'كسر عادي ← مركب', rule: 'قسمة مع باقٍ: الخارج صحيح والباقي بسط، ثم التبسيط إن أمكن.' },
  { exercise: '⑪', skill: 'أطوال في شكل مركب', rule: 'خواص المستطيل والمربّع + جمع الأطوال على الاستقامة.' },
]

function StepSummary() {
  return <div className="u2e-stack">
    <section className="u2e-card">
      <h3 className="u2e-card-title"><Grid3x3 size={16} aria-hidden="true" /> خلاصة التمارين الأحد عشر</h3>
      <div className="u2e-summary-table" role="table" aria-label="خلاصة التمارين">
        {SUMMARY_ROWS.map((row) => <div className="u2e-summary-row" role="row" key={row.exercise}>
          <span className="u2e-map-badge" role="cell">{row.exercise}</span>
          <strong role="cell">{row.skill}</strong>
          <span role="cell"><Notation text={row.rule} /></span>
        </div>)}
      </div>
    </section>
    <section className="u2e-card">
      <h3 className="u2e-card-title"><Sparkles size={16} aria-hidden="true" /> جاهز لاختبار الوحدة؟</h3>
      <p>أتممت التمارين الأحد عشر من ص 85 و 86 بخطواتها. الخطوة الأخيرة قبل الدرس التالي: اختبار الوحدة الثانية بستين سؤالاً يغطي الدروس العشرة، ولا تظهر فيه أي إجابة أثناء المحاولة — النتيجة والحلول بعد التسليم.</p>
      <div className="u2e-actions">
        <a className="u2e-test-link" href="#tests/run/unit-unit-2-test"><ClipboardList size={17} aria-hidden="true" /> ابدأ اختبار الوحدة الثانية</a>
      </div>
    </section>
  </div>
}

/* =============================================================================================
   الدرس
   ============================================================================================= */

export function Unit2ExercisesLesson() {
  const [activeStep, setActiveStep] = useState(0)
  const steps: LessonStep[] = useMemo(() => [
    { id: 'u2e-intro', title: 'مدخل: خريطة المراجعة', content: <StepIntro /> },
    { id: 'u2e-q1', title: 'التمرين ① · جدول الخانات', content: <StepQ1 /> },
    { id: 'u2e-q2', title: 'التمرين ② · كلفة الإصلاح الأقل', content: <StepQ2 /> },
    { id: 'u2e-q3', title: 'التمرين ③ · ترتيب العينات', content: <StepQ3 /> },
    { id: 'u2e-q4', title: 'التمرين ④ · لغز العدد', content: <StepQ4 /> },
    { id: 'u2e-q5', title: 'التمرين ⑤ · م.م.أ', content: <StepQ5 /> },
    { id: 'u2e-q6', title: 'التمرين ⑥ · رموز المقارنة', content: <StepQ6 /> },
    { id: 'u2e-q7', title: 'التمرين ⑦ · ترتيب تصاعدي', content: <StepQ7 /> },
    { id: 'u2e-q8', title: 'التمرين ⑧ · ترتيب تنازلي', content: <StepQ8 /> },
    { id: 'u2e-q9', title: 'التمرين ⑨ · مركب إلى كسر عادي', content: <StepQ9 /> },
    { id: 'u2e-q10', title: 'التمرين ⑩ · كسر عادي إلى مركب', content: <StepQ10 /> },
    { id: 'u2e-q11', title: 'التمرين ⑪ · المستطيل والمربّع', content: <StepQ11 /> },
    { id: 'u2e-summary', title: 'الخلاصة والاختبار', content: <StepSummary /> },
  ], [])
  return <LessonShell title={lessonTitle} steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-unit2-exercises" />
}
