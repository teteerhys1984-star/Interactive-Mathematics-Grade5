import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, BookOpen, Check, ChevronLeft, ChevronRight, CircleCheck, CircleX, ClipboardList, Lightbulb, PencilRuler, RotateCcw, Ruler, Sparkles, Square } from 'lucide-react'
import { MathExpression as SharedMathExpression } from '../components/MathExpression'
import { GeoFigure } from '../components/lesson/GeoFigure'
import { LessonShell } from '../components/lesson/LessonShell'
import type { LessonStep } from '../components/lesson/types'
import {
  check1Reasons, check2Reasons, findRectangleElement, lessonTitle, p77Shapes, p78Check1Shapes, p78Check2Shapes, p79Steps,
  p80Ex1Blanks, p80Ex2Statements, p80Ex3Grid, p80Ex3Properties, p80Ex4Lengths, type Check1Reason, type Check2Reason, type SourceElement,
} from './rectangleData'

/* =============================================================================================
   الوحدة الثانية · الدرس 9 — «المستطيل» (الكتاب ص 77–80)
   هوية بصرية خاصة: «ورشة الكوس والمسطرة» — أوراق رسم بشريط مسطرة، لوحات ورق ملّيمتري، وعلامة
   زاوية قائمة في ركن كل بطاقة. كل نص عربي RTL، وكل رمز هندسي أو عدد معزول في سياق LTR.
   ============================================================================================= */

/* ------------------------------------------------------------------ نص مختلط عربي/رياضي */
const MATH_RUN = /((?:\[?[A-Za-z]\u0302?\]?|\d)(?:[A-Za-z\u0302\d[\]\s=∥⟂+\-−×÷°.,/]*[A-Za-z\u0302\d°\]])?)/g
/* قبّعة الزاوية (D̂): خطوط Cairo/DM Mono لا تحوي علامة ^ المركّبة لكل الحروف، لذا نُبقي النص الحقيقي في DOM
   (للقراءة الآلية والفحوص) ونرسم القبّعة بـ CSS فوق الحرف بشكل ثابت في كل الأجهزة. */
const HAT_LETTER = /([A-Za-z])\u0302/g
const PRECOMPOSED_HAT = /[ÂĈÊÎÔÛŴŶẐâĉêîôûŵŷẑ]/g
function withHats(text: string): ReactNode {
  const decomposed = text.replace(PRECOMPOSED_HAT, (char) => char.normalize('NFD'))
  if (!decomposed.includes('\u0302')) return text
  const nodes: ReactNode[] = []
  let cursor = 0
  for (const match of decomposed.matchAll(HAT_LETTER)) {
    const start = match.index ?? 0
    if (start > cursor) nodes.push(decomposed.slice(cursor, start))
    nodes.push(<span key={start} className="rect-hat">{match[1]}<span className="rect-hat-mark">{'\u0302'}</span></span>)
    cursor = start + match[0].length
  }
  if (cursor < decomposed.length) nodes.push(decomposed.slice(cursor))
  return <>{nodes}</>
}
/** الغلاف المحلي للمكوّن المشترك MathExpression: الحدود LTR نفسها، مع رسم قبّعات الزوايا. */
function MathExpression({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return <SharedMathExpression className={className} label={label}>{typeof children === 'string' ? withHats(children) : children}</SharedMathExpression>
}
function Rich({ text }: { text: string }) {
  // الحروف ذات القبّعة المسبقة التركيب (Â، Ĉ) تُفكَّك أولاً حتى تبقى داخل المقطع الرياضي الواحد ولا تُقطَع عنه.
  const parts = text.replace(PRECOMPOSED_HAT, (char) => char.normalize('NFD')).split(MATH_RUN)
  return <span className="rect-rich">{parts.map((part, index) => (index % 2 === 1 ? <MathExpression key={index}>{part}</MathExpression> : <span key={index}>{part}</span>))}</span>
}
/** حالة «تحقّق» مع عدّاد المحاولات: التلميح أولاً، والشرح الكامل بعد الإجابة الصحيحة أو المحاولة الثانية. */
function useChecked(): [boolean, (value: boolean) => void, number] {
  const [checked, setCheckedState] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const setChecked = useCallback((value: boolean) => { setCheckedState(value); if (value) setAttempts((count) => count + 1) }, [])
  return [checked, setChecked, attempts]
}

/* ------------------------------------------------------------------ ورقة المصدر */
function Sheet({ element, children, quote = true }: { element: SourceElement; children?: ReactNode; quote?: boolean }) {
  return <article className="rect-sheet" data-source-id={element.id} data-source-page={element.page}>
    <div className="rect-sheet-head">
      <span className="rect-page-tag"><BookOpen size={14} aria-hidden="true" /> من الكتاب · ص {element.page}</span>
      <h3 className="rect-section-name">{element.section}</h3>
    </div>
    {quote && <p className="rect-quote"><Rich text={element.prompt} /></p>}
    {children && <div className="rect-sheet-body">{children}</div>}
  </article>
}
function PlatformNote({ title = 'شرح إضافي من المنصة', children, id }: { title?: string; children: ReactNode; id?: string }) {
  return <aside className="rect-note" data-platform-id={id}>
    <strong><Lightbulb size={15} aria-hidden="true" /> {title}</strong>
    {children}
  </aside>
}
function Board({ caption, children, tight = false, label }: { caption?: ReactNode; children: ReactNode; tight?: boolean; label?: string }) {
  return <figure className={`rect-board ${tight ? 'is-tight' : ''}`}>
    <div className="rect-board-body" aria-label={label}>{children}</div>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
}
function Feedback({ state, hint, attempts = 1, children }: { state: 'idle' | 'correct' | 'wrong'; hint?: string; attempts?: number; children: ReactNode }) {
  if (state === 'idle') return null
  const revealSolution = state === 'correct' || attempts >= 2
  return <div className={`rect-feedback ${state === 'correct' ? 'is-correct' : 'is-wrong'}`} role="status">
    <span className="rect-feedback-title">{state === 'correct' ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}{state === 'correct' ? 'إجابة صحيحة' : 'راجع الإجابة'}</span>
    {state === 'wrong' && hint && <p className="rect-feedback-hint"><Lightbulb size={15} aria-hidden="true" /> تلميح: <Rich text={hint} /></p>}
    {revealSolution
      ? <div className="rect-feedback-body">{state === 'wrong' && <p className="rect-feedback-reveal">الشرح الكامل بعد محاولتين — قارن خطواتك به:</p>}{children}</div>
      : <p className="rect-feedback-retry">عدّل إجابتك وتحقّق مرة أخرى؛ يظهر الشرح الكامل بعد المحاولة الثانية.</p>}
  </div>
}
function TaskHead({ title, page, platform = false }: { title: string; page?: number; platform?: boolean }) {
  return <div className="rect-task-head">
    <ClipboardList size={18} aria-hidden="true" />
    <strong>{title}</strong>
    {platform ? <span className="rect-page-tag is-platform">نشاط من إعداد المنصة</span> : page ? <span className="rect-page-tag">ص {page}</span> : null}
  </div>
}
const toneClass = (checked: boolean, selected: boolean, correct: boolean) => (checked ? (correct ? 'is-right' : selected ? 'is-wrong' : '') : selected ? 'is-selected' : '')
const parseNumber = (value: string) => {
  const match = /^\s*(\d+(?:[.,]\d+)?)\s*(cm|سم|°|درجة)?\s*$/u.exec(value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))))
  return match ? Number(match[1].replace(',', '.')) : null
}

/* =============================================================================================
   الخطوة 1 — المدخل والعلم
   ============================================================================================= */
function starPoints(cx: number, cy: number, outer: number, inner: number) {
  return Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner
    const angle = -Math.PI / 2 + (index * Math.PI) / 5
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`
  }).join(' ')
}
function FlagFigure() {
  return <div className="rect-flag">
    <svg viewBox="0 0 300 200" role="img" aria-label="علم مستطيل مقسوم إلى ثلاثة مستطيلات أفقية متساوية: أخضر وأبيض وأسود، وفي المستطيل الأبيض ثلاث نجوم حمراء" style={{ direction: 'ltr' }}>
      <rect x="0" y="0" width="300" height="66.7" fill="#0b7a3b" />
      <rect x="0" y="66.7" width="300" height="66.6" fill="#ffffff" />
      <rect x="0" y="133.3" width="300" height="66.7" fill="#1b1b1b" />
      {[75, 150, 225].map((cx) => <polygon key={cx} points={starPoints(cx, 100, 15, 6)} fill="#c8102e" />)}
      <rect x="1" y="1" width="298" height="198" fill="none" stroke="#1f5fbf" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="0" y1="66.7" x2="300" y2="66.7" stroke="#1f5fbf" strokeWidth="1.5" strokeDasharray="6 4" />
      <line x1="0" y1="133.3" x2="300" y2="133.3" stroke="#1f5fbf" strokeWidth="1.5" strokeDasharray="6 4" />
    </svg>
  </div>
}
function HeroArt() {
  return <div className="rect-hero-art" aria-hidden="true">
    <svg viewBox="0 0 260 200" style={{ direction: 'ltr' }}>
      <rect x="20" y="30" width="190" height="120" fill="#fff" stroke="#1f5fbf" strokeWidth="3" />
      <path d="M 20 48 L 38 48 L 38 30" fill="none" stroke="#b3261e" strokeWidth="2.5" />
      <path d="M 210 48 L 192 48 L 192 30" fill="none" stroke="#b3261e" strokeWidth="2.5" />
      <path d="M 20 132 L 38 132 L 38 150" fill="none" stroke="#b3261e" strokeWidth="2.5" />
      <path d="M 210 132 L 192 132 L 192 150" fill="none" stroke="#b3261e" strokeWidth="2.5" />
      <polygon points="120,180 250,180 250,70" fill="#f5b700" stroke="#c99600" strokeWidth="2" opacity=".95" />
      <polygon points="150,168 232,168 232,98" fill="#fffdf7" stroke="#c99600" strokeWidth="1.5" />
      <rect x="0" y="160" width="130" height="26" fill="#fffdf7" stroke="#22303f" strokeWidth="2" />
      {Array.from({ length: 13 }, (_, index) => <line key={index} x1={6 + index * 10} y1="160" x2={6 + index * 10} y2={index % 5 === 0 ? 174 : 168} stroke="#22303f" strokeWidth="1.5" />)}
    </svg>
  </div>
}
function FlagRatioTask() {
  const [value, setValue] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const correct = parseNumber(value) === 60
  return <div className="rect-task" data-platform-id="rect-platform-flag-ratio">
    <TaskHead title="جرّب: عرض العلم من طوله" platform />
    <p>يقول الكتاب إنّ عرض العلم يساوي ثلثي طوله. إذا كان طول علم <MathExpression>90cm</MathExpression> فما عرضه؟</p>
    <div className="rect-fields">
      <label className="rect-field"><span>العرض بالسنتيمتر</span><input className={`rect-input ${checked ? (correct ? 'is-right' : 'is-wrong') : ''}`} inputMode="numeric" value={value} onChange={(event) => { setValue(event.target.value); setChecked(false) }} aria-label="عرض العلم بالسنتيمتر" /></label>
    </div>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)} disabled={!value.trim()}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="الثلث = الطول ÷ 3، والثلثان = الثلث × 2.">
      <p>الثلث: <MathExpression>90 ÷ 3 = 30</MathExpression>، والثلثان: <MathExpression>30 × 2 = 60</MathExpression>؛ فالعرض <MathExpression>60cm</MathExpression>. لاحظ أنّ العرض أصغر من الطول دائماً في هذا العلم.</p>
    </Feedback>
  </div>
}
function StepIntro() {
  const goals = findRectangleElement('rect-p77-goals')
  const flag = findRectangleElement('rect-p77-flag')
  return <div className="rect-stack">
    <section className="rect-hero" data-source-id={goals.id} data-source-page={goals.page}>
      <div>
        <p className="rect-eyebrow">الوحدة الثانية · الدرس 9 · ص 77–80</p>
        <h3>ورشة الكوس والمسطرة: نتعرّف المستطيل ونرسمه</h3>
        <p>النوافذ والأبواب والدفاتر والأعلام… كلّها مستطيلات. في هذا الدرس نكتشف الشرط الذي يجعل متوازي الأضلاع مستطيلاً، ثم نرسمه بأدوات الهندسة.</p>
        <ul className="rect-goals" aria-label="سنتعلّم (من الكتاب ص 77)">
          <li><span>1</span> تعريف المستطيل</li>
          <li><span>2</span> خواص المستطيل</li>
          <li><span>3</span> رسم المستطيل</li>
        </ul>
      </div>
      <HeroArt />
    </section>
    <Sheet element={flag}>
      <div className="rect-two">
        <FlagFigure />
        <div className="rect-stack">
          <p>انظر إلى العلم: هو نفسه مستطيل كبير، وبداخله <strong>ثلاثة مستطيلات</strong> متساوية مرتّبة من الأعلى إلى الأسفل، بينها خطّان يوازيان الطول. وعرض العلم كلّه يساوي <strong>ثلثي</strong> طوله.</p>
          <PlatformNote title="ملاحظة من المنصة عن صفحة 77">
            <p>النص المطبوع يصف ألوان العلم بالأحمر والأبيض والأسود مع نجمتين خضراوين، بينما صورة العلم المطبوعة في الصفحة نفسها تُظهر الأخضر والأبيض والأسود مع ثلاث نجوم حمراء. نقلنا النص كما طُبع ورسمنا العلم كما في صورة الكتاب؛ والفكرة الرياضية واحدة: ثلاثة مستطيلات، وعرض يساوي ثلثي الطول.</p>
          </PlatformNote>
        </div>
      </div>
      <FlagRatioTask />
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 2 — انطلاقة نشطة
   ============================================================================================= */
type ShapeSpec = { pts: Record<string, { x: number; y: number }>; order: string[]; marks?: Array<{ side: [string, string]; count: number; tone?: 'blue' | 'red' }>; right?: Array<{ at: string; from: string; to: string }> }
const openingSpecs: Record<number, ShapeSpec> = {
  1: { pts: { A: { x: 60, y: 25 }, B: { x: 140, y: 25 }, C: { x: 140, y: 175 }, D: { x: 60, y: 175 } }, order: ['A', 'B', 'C', 'D'], marks: [{ side: ['A', 'B'], count: 2, tone: 'red' }, { side: ['D', 'C'], count: 2, tone: 'red' }, { side: ['A', 'D'], count: 1 }, { side: ['B', 'C'], count: 1 }], right: [{ at: 'A', from: 'B', to: 'D' }] },
  2: { pts: { P: { x: 70, y: 40 }, Q: { x: 190, y: 40 }, R: { x: 130, y: 160 }, S: { x: 10, y: 160 } }, order: ['P', 'Q', 'R', 'S'], marks: [{ side: ['P', 'Q'], count: 1 }, { side: ['S', 'R'], count: 1 }, { side: ['P', 'S'], count: 2, tone: 'red' }, { side: ['Q', 'R'], count: 2, tone: 'red' }] },
  3: { pts: { T: { x: 100, y: 15 }, U: { x: 160, y: 100 }, V: { x: 100, y: 185 }, W: { x: 40, y: 100 } }, order: ['T', 'U', 'V', 'W'], marks: [{ side: ['T', 'U'], count: 2, tone: 'red' }, { side: ['W', 'V'], count: 2, tone: 'red' }, { side: ['U', 'V'], count: 1 }, { side: ['T', 'W'], count: 1 }] },
  4: { pts: { K: { x: 100, y: 20 }, L: { x: 180, y: 100 }, M: { x: 100, y: 180 }, N: { x: 20, y: 100 } }, order: ['K', 'L', 'M', 'N'], marks: [{ side: ['K', 'L'], count: 2, tone: 'red' }, { side: ['N', 'M'], count: 2, tone: 'red' }, { side: ['L', 'M'], count: 1 }, { side: ['K', 'N'], count: 1 }], right: [{ at: 'L', from: 'K', to: 'M' }] },
}
function ShapeCard({ number, spec, label }: { number: number; spec: ShapeSpec; label: string }) {
  return <div className="rect-shape-card">
    <span className="rect-shape-number" aria-hidden="true">{number}</span>
    <Board tight caption={<span>الشكل ({number})</span>}>
      <GeoFigure pts={spec.pts} order={spec.order} width={200} height={200} marks={spec.marks} right={spec.right} showLabels={false} ariaLabel={label} />
    </Board>
  </div>
}
function StepOpening() {
  const figures = findRectangleElement('rect-p77-opening-figures')
  const q1 = findRectangleElement('rect-p77-opening-q1')
  const q2 = findRectangleElement('rect-p77-opening-q2')
  const [picked, setPicked] = useState<number[]>([])
  const [checked1, setChecked1, attempts1] = useChecked()
  const [names, setNames] = useState<Record<number, string>>({})
  const [checked2, setChecked2, attempts2] = useChecked()
  const q1Correct = [1, 2, 3, 4].every((number) => picked.includes(number) === p77Shapes[number - 1].rightAngle)
  const q2Answers: Record<number, string> = { 1: 'مستطيل', 4: 'مربع' }
  const q2Correct = names[1] === q2Answers[1] && names[4] === q2Answers[4]
  return <div className="rect-stack">
    <Sheet element={figures}>
      <p>اقرأ العلامات قبل أن تحكم: <strong>السهمان المتشابهان</strong> على ضلعين يعنيان أنهما متوازيان، و<strong>المربع الصغير</strong> في الرأس يعني زاوية قائمة.</p>
      <div className="rect-four">
        {p77Shapes.map((shape) => <ShapeCard key={shape.number} number={shape.number} spec={openingSpecs[shape.number]} label={`الشكل (${shape.number}): ${shape.marks}`} />)}
      </div>
    </Sheet>
    <Sheet element={q1}>
      <div className="rect-task">
        <TaskHead title="اختر كلّ شكل هو متوازي أضلاع وفيه زاوية قائمة" page={77} />
        <ul className="rect-choices is-inline">
          {p77Shapes.map((shape) => {
            const selected = picked.includes(shape.number)
            return <li key={shape.number} data-source-id={shape.id}>
              <label className={`rect-choice ${toneClass(checked1, selected, shape.rightAngle)}`}>
                <input type="checkbox" checked={selected} onChange={() => { setChecked1(false); setPicked((previous) => (selected ? previous.filter((item) => item !== shape.number) : [...previous, shape.number])) }} />
                الشكل ({shape.number})
              </label>
            </li>
          })}
        </ul>
        <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked1(true)}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked1 ? (q1Correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts1} hint="افحص كل شكل بشرطين معاً: هل على كل ضلعين متقابلين أسهم التوازي؟ وهل المربع الصغير (الزاوية القائمة) موجود؟">
          <ul>
            {p77Shapes.map((shape) => <li key={shape.number}>الشكل ({shape.number}): {shape.rightAngle ? 'متوازي أضلاع وفيه زاوية قائمة معلّمة ← يُذكر.' : 'متوازي أضلاع لكن لا زاوية قائمة فيه ← لا يُذكر.'}</li>)}
          </ul>
          <p>الجواب: الشكلان (1) و(4).</p>
        </Feedback>
      </div>
    </Sheet>
    <Sheet element={q2}>
      <div className="rect-task">
        <TaskHead title="الشكلان اللذان فيهما زاوية قائمة: مربع أم مستطيل؟" page={77} />
        <div className="rect-fields">
          {[1, 4].map((number) => <label key={number} className="rect-field" data-source-id={`rect-p77-opening-q2-s${number}`}>
            <span>الشكل ({number})</span>
            <select className={`rect-select ${checked2 ? (names[number] === q2Answers[number] ? 'is-right' : 'is-wrong') : ''}`} value={names[number] ?? ''} onChange={(event) => { setChecked2(false); setNames((previous) => ({ ...previous, [number]: event.target.value })) }}>
              <option value="">اختر…</option>
              <option value="مستطيل">مستطيل</option>
              <option value="مربع">مربع</option>
            </select>
          </label>)}
        </div>
        <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked2(true)} disabled={!names[1] || !names[4]}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked2 ? (q2Correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts2} hint="قارن طولَي ضلعين متجاورين في كل شكل: إذا تساويا مع زاوية قائمة فهو مربع، وإلا فهو مستطيل.">
          <p>الشكل (1) <strong>مستطيل</strong>: ضلعاه المتجاوران مختلفان في الطول. الشكل (4) <strong>مربع</strong>: أضلاعه الأربعة متساوية مع زاوية قائمة، والمربع مستطيل خاص.</p>
        </Feedback>
      </div>
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 3 — التعريف + مختبر الزاوية
   ============================================================================================= */
function AngleLab() {
  const [theta, setTheta] = useState(60)
  const rad = (theta * Math.PI) / 180
  const D = { x: 100, y: 190 }
  const C = { x: 300, y: 190 }
  const A = { x: D.x + 100 * Math.cos(rad), y: D.y - 100 * Math.sin(rad) }
  const B = { x: A.x + 200, y: A.y }
  const isRectangle = theta === 90
  const square = (v: { x: number; y: number }, u1: { x: number; y: number }, u2: { x: number; y: number }) => {
    const s = 14
    const n1 = Math.hypot(u1.x, u1.y); const n2 = Math.hypot(u2.x, u2.y)
    const a = { x: v.x + (u1.x / n1) * s, y: v.y + (u1.y / n1) * s }
    const c = { x: v.x + (u2.x / n2) * s, y: v.y + (u2.y / n2) * s }
    return `M ${a.x} ${a.y} L ${a.x + c.x - v.x} ${a.y + c.y - v.y} L ${c.x} ${c.y}`
  }
  const readouts = [{ name: 'Â', value: 180 - theta }, { name: 'B̂', value: theta }, { name: 'Ĉ', value: 180 - theta }, { name: 'D̂', value: theta }]
  return <PlatformNote id="rect-platform-angle-lab" title="مختبر الزاوية — شرح إضافي من المنصة">
    <div className="rect-lab">
      <p>حرّك الزاوية <MathExpression>D̂</MathExpression> في متوازي أضلاع أضلاعه ثابتة، وراقب الزوايا الأربع. متى يصبح الشكل مستطيلاً؟</p>
      <Board tight>
        <svg className="rect-svg" viewBox="0 0 400 215" role="img" aria-label={`متوازي أضلاع قياس زاويته D يساوي ${theta} درجة`} style={{ direction: 'ltr' }}>
          <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`} fill={isRectangle ? '#e4f5ea' : '#fffdf7'} stroke="#1f5fbf" strokeWidth="3" strokeLinejoin="round" />
          {isRectangle && [[D, A, C], [A, D, B], [B, A, C], [C, B, D]].map(([v, p, q], index) => <path key={index} d={square(v, { x: p.x - v.x, y: p.y - v.y }, { x: q.x - v.x, y: q.y - v.y })} fill="none" stroke="#b3261e" strokeWidth="2.2" />)}
          <text x={A.x - 6} y={A.y - 10} fontFamily="DM Mono, monospace" fontWeight="700" fontSize="16" fill="#22303f">A</text>
          <text x={B.x - 2} y={B.y - 10} fontFamily="DM Mono, monospace" fontWeight="700" fontSize="16" fill="#22303f">B</text>
          <text x={C.x + 6} y={C.y + 8} fontFamily="DM Mono, monospace" fontWeight="700" fontSize="16" fill="#22303f">C</text>
          <text x={D.x - 20} y={D.y + 8} fontFamily="DM Mono, monospace" fontWeight="700" fontSize="16" fill="#22303f">D</text>
          <text x={D.x + 30} y={D.y - 8} fontFamily="DM Mono, monospace" fontWeight="700" fontSize="13" fill="#b3261e">{theta}°</text>
        </svg>
      </Board>
      <label className="rect-field">
        <span>قياس الزاوية <MathExpression>D̂</MathExpression>: <MathExpression>{`${theta}°`}</MathExpression></span>
        <input className="rect-range" type="range" min={40} max={140} step={5} value={theta} onChange={(event) => setTheta(Number(event.target.value))} aria-label="قياس الزاوية D بالدرجات" />
      </label>
      <div className="rect-lab-readout" aria-live="polite">
        {readouts.map((item) => <div key={item.name} className={item.value === 90 ? 'is-right' : ''}><MathExpression>{`${item.name} = ${item.value}°`}</MathExpression></div>)}
      </div>
      <div className="rect-actions">
        <button type="button" className="rect-button is-gold" onClick={() => setTheta(90)}><Square size={16} aria-hidden="true" /> اجعل الزاوية قائمة</button>
        <p className={`rect-lab-status ${isRectangle ? 'is-rectangle' : ''}`}>{isRectangle ? 'زاوية قائمة واحدة كفت: الزوايا الأربع صارت قائمة، والشكل مستطيل.' : 'ما زال متوازي أضلاع فقط: لا زاوية قائمة فيه.'}</p>
      </div>
    </div>
  </PlatformNote>
}
function StepDefinition() {
  const definition = findRectangleElement('rect-p77-definition')
  return <div className="rect-stack">
    <Sheet element={definition} quote={false}>
      <div className="rect-rule"><span className="rect-rule-badge" aria-hidden="true"><Square size={28} /></span><span>المستطيل: هو متوازي الأضلاع فيه زاوية قائمة.</span></div>
      <div className="rect-two">
        <Board caption={<><b>رسم الكتاب</b><span>أسهم التوازي + زاوية قائمة واحدة</span></>}>
          <GeoFigure pts={{ A: { x: 40, y: 30 }, B: { x: 260, y: 30 }, C: { x: 260, y: 150 }, D: { x: 40, y: 150 } }} order={['A', 'B', 'C', 'D']} width={300} height={180}
            marks={[{ side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 }, { side: ['A', 'D'], count: 2, tone: 'red' }, { side: ['B', 'C'], count: 2, tone: 'red' }]}
            right={[{ at: 'B', from: 'A', to: 'C' }]} showLabels={false} ariaLabel="مستطيل بسهم مفرد على الضلعين الأفقيين وسهمين على الرأسيين وزاوية قائمة في الركن العلوي الأيمن" />
        </Board>
        <ol className="rect-condition-list" aria-label="شرطا التعريف">
          <li><strong>متوازي أضلاع:</strong> كل ضلعين متقابلين متوازيان (زوجان من الأسهم).</li>
          <li><strong>فيه زاوية قائمة:</strong> زاوية واحدة قياسها <MathExpression>90°</MathExpression> تكفي.</li>
        </ol>
      </div>
      <PlatformNote>
        <p>الشرطان معاً! شكل فيه زاوية قائمة لكنه ليس متوازي أضلاع ليس مستطيلاً، ومتوازي أضلاع بلا زاوية قائمة ليس مستطيلاً أيضاً. سترى أمثلة على الحالتين في خطوة «لماذا ليس مستطيلاً؟».</p>
      </PlatformNote>
    </Sheet>
    <AngleLab />
  </div>
}

/* =============================================================================================
   الخطوة 4 — مثال الكتاب
   ============================================================================================= */
function StepExample() {
  const example = findRectangleElement('rect-p78-example')
  return <div className="rect-stack">
    <Sheet element={example}>
      <div className="rect-two">
        <Board caption={<><b>ABCD</b><span>الطول بالأحمر، العرض بالأزرق</span></>}>
          <GeoFigure pts={{ A: { x: 50, y: 40 }, B: { x: 250, y: 40 }, C: { x: 250, y: 160 }, D: { x: 50, y: 160 } }} order={['A', 'B', 'C', 'D']} width={300} height={200}
            colored={[{ side: ['A', 'B'], tone: 'red' }, { side: ['A', 'D'], tone: 'blue' }]} right={[{ at: 'D', from: 'A', to: 'C' }]}
            marks={[{ side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 }, { side: ['A', 'D'], count: 2, tone: 'red' }, { side: ['B', 'C'], count: 2, tone: 'red' }]}
            ariaLabel="المستطيل ABCD: A أعلى اليسار، B أعلى اليمين، C أسفل اليمين، D أسفل اليسار، وزاوية قائمة عند D" />
        </Board>
        <div className="rect-stack">
          <ul className="rect-legend" aria-label="دليل الألوان"><li><i className="is-red" />الطول <MathExpression>[AB]</MathExpression></li><li><i className="is-blue" />العرض <MathExpression>[AD]</MathExpression></li></ul>
          <ol className="rect-condition-list" aria-label="خطوات الاستدلال">
            <li><MathExpression>AD ∥ BC</MathExpression> و <MathExpression>AB ∥ DC</MathExpression> ← الشكل متوازي أضلاع.</li>
            <li><MathExpression>D̂ = 90°</MathExpression> ← متوازي أضلاع فيه زاوية قائمة ← <strong>مستطيل</strong>.</li>
            <li>النتيجة: <MathExpression>Â = B̂ = Ĉ = D̂ = 90°</MathExpression>.</li>
          </ol>
        </div>
      </div>
      <PlatformNote title="لماذا تصبح الزوايا الأربع قائمة؟ — شرح إضافي من المنصة">
        <ul>
          <li>في متوازي الأضلاع كل زاويتين متقابلتين متساويتان (درس متوازي الأضلاع)؛ فإذا كانت <MathExpression>D̂ = 90°</MathExpression> كانت <MathExpression>B̂ = 90°</MathExpression>.</li>
          <li>الضلع <MathExpression>[AD]</MathExpression> عمودي على <MathExpression>[DC]</MathExpression>، و<MathExpression>[AB]</MathExpression> يوازي <MathExpression>[DC]</MathExpression>؛ فالعمود على أحد المستقيمين المتوازيين عمود على الآخر، إذن <MathExpression>Â = 90°</MathExpression>، وبالمثل <MathExpression>Ĉ = 90°</MathExpression>.</li>
          <li>تحقّق سريع: <MathExpression>4 × 90° = 360°</MathExpression> وهو مجموع زوايا أي شكل رباعي.</li>
        </ul>
      </PlatformNote>
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 5 — تحقّق ①: لماذا هو مستطيل؟
   ============================================================================================= */
const check1Specs: ShapeSpec[] = [
  { pts: { A: { x: 30, y: 30 }, B: { x: 170, y: 30 }, C: { x: 170, y: 130 }, D: { x: 30, y: 130 } }, order: ['A', 'B', 'C', 'D'], marks: [{ side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 }, { side: ['A', 'D'], count: 2, tone: 'red' }, { side: ['B', 'C'], count: 2, tone: 'red' }], right: [{ at: 'B', from: 'A', to: 'C' }] },
  { pts: { A: { x: 30, y: 50 }, B: { x: 170, y: 50 }, C: { x: 170, y: 110 }, D: { x: 30, y: 110 } }, order: ['A', 'B', 'C', 'D'], marks: [{ side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 }, { side: ['A', 'D'], count: 2, tone: 'red' }, { side: ['B', 'C'], count: 2, tone: 'red' }], right: [{ at: 'B', from: 'A', to: 'C' }] },
]
function JustifyShape({ shape, spec }: { shape: (typeof p78Check1Shapes)[number]; spec: ShapeSpec }) {
  const [selected, setSelected] = useState<Check1Reason[]>([])
  const [checked, setChecked, attempts] = useChecked()
  const correct = check1Reasons.every((reason) => selected.includes(reason.id) === reason.correct)
  return <div className="rect-task" data-source-id={shape.id}>
    <TaskHead title={`${shape.label}: لماذا هو مستطيل؟`} page={78} />
    <Board tight caption={<span>{shape.label}</span>}>
      <GeoFigure pts={spec.pts} order={spec.order} width={200} height={160} marks={spec.marks} right={spec.right} showLabels={false} ariaLabel={shape.description} />
    </Board>
    <p>اختر <strong>كل</strong> سبب يظهر في الرسم ويلزم للتعليل:</p>
    <ul className="rect-choices">
      {check1Reasons.map((reason) => {
        const isSelected = selected.includes(reason.id)
        return <li key={reason.id}><label className={`rect-choice ${toneClass(checked, isSelected, reason.correct)}`}>
          <input type="checkbox" checked={isSelected} onChange={() => { setChecked(false); setSelected((previous) => (isSelected ? previous.filter((item) => item !== reason.id) : [...previous, reason.id])) }} />
          {reason.text}
        </label></li>
      })}
    </ul>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)} disabled={selected.length === 0}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="التعليل يعتمد على ما هو معلّم في الرسم فقط: علامات التوازي وعلامة الزاوية القائمة. لا تختر ما لا تراه معلّماً.">
      <p>التعليل الكامل: كل ضلعين متقابلين متوازيان (الأسهم) فهو <strong>متوازي أضلاع</strong>، وفيه <strong>زاوية قائمة</strong> معلّمة؛ إذن هو مستطيل بحسب التعريف. تساوي الأضلاع الأربعة أو تعامد القطرين ليسا من التعريف ولا يظهران في الرسم.</p>
    </Feedback>
  </div>
}
function StepCheck1() {
  const check1 = findRectangleElement('rect-p78-check1')
  return <div className="rect-stack">
    <Sheet element={check1}>
      <div className="rect-two">
        {p78Check1Shapes.map((shape, index) => <JustifyShape key={shape.id} shape={shape} spec={check1Specs[index]} />)}
      </div>
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 6 — تحقّق ②: لماذا ليس مستطيلاً؟
   ============================================================================================= */
const check2Specs: ShapeSpec[] = [
  { pts: { P: { x: 60, y: 40 }, Q: { x: 190, y: 40 }, R: { x: 140, y: 150 }, S: { x: 10, y: 150 } }, order: ['P', 'Q', 'R', 'S'], marks: [{ side: ['P', 'Q'], count: 1 }, { side: ['S', 'R'], count: 1 }, { side: ['P', 'S'], count: 2, tone: 'red' }, { side: ['Q', 'R'], count: 2, tone: 'red' }] },
  { pts: { P: { x: 70, y: 40 }, Q: { x: 170, y: 40 }, R: { x: 170, y: 150 }, S: { x: 20, y: 150 } }, order: ['P', 'Q', 'R', 'S'], marks: [{ side: ['P', 'Q'], count: 1, tone: 'red' }, { side: ['S', 'R'], count: 1, tone: 'red' }], right: [{ at: 'R', from: 'Q', to: 'S' }] },
  { pts: { P: { x: 22, y: 77 }, Q: { x: 154, y: 33 }, R: { x: 172, y: 86 }, S: { x: 122, y: 152 } }, order: ['P', 'Q', 'R', 'S'], right: [{ at: 'Q', from: 'P', to: 'R' }, { at: 'S', from: 'R', to: 'P' }] },
]
function WhyNotShape({ shape, spec }: { shape: (typeof p78Check2Shapes)[number]; spec: ShapeSpec }) {
  const [selected, setSelected] = useState<Check2Reason | null>(null)
  const [checked, setChecked, attempts] = useChecked()
  const correct = selected === shape.reason
  return <div className="rect-task" data-source-id={shape.id}>
    <TaskHead title={shape.label} page={78} />
    <div className="rect-split">
      <Board tight caption={<span>{shape.label}</span>}>
        <GeoFigure pts={spec.pts} order={spec.order} width={200} height={180} marks={spec.marks} right={spec.right} showLabels={false} ariaLabel={shape.description} />
      </Board>
      <div className="rect-stack is-tight">
        <p>التعليل:</p>
        <ul className="rect-choices">
          {check2Reasons.map((reason) => <li key={reason.id}><label className={`rect-choice ${toneClass(checked, selected === reason.id, reason.id === shape.reason)}`}>
            <input type="radio" name={`why-${shape.id}`} checked={selected === reason.id} onChange={() => { setChecked(false); setSelected(reason.id) }} />
            {reason.text}
          </label></li>)}
        </ul>
      </div>
    </div>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)} disabled={!selected}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="اسأل سؤالين بالترتيب: هل هو متوازي أضلاع (كل ضلعين متقابلين متوازيان)؟ ثم هل فيه زاوية قائمة؟ هذا الشكل يخفق في أحدهما.">
      <p>{check2Reasons.find((reason) => reason.id === shape.reason)?.text}. {shape.reason === 'no-right' ? 'الشرط الأول متحقق والثاني ناقص.' : 'الشرط الأول (متوازي أضلاع) ناقص، ولا تعوّضه الزاوية القائمة.'}</p>
    </Feedback>
  </div>
}
function StepCheck2() {
  const check2 = findRectangleElement('rect-p78-check2')
  return <div className="rect-stack">
    <Sheet element={check2}>
      <p>في الكتاب جدول من صفين: «الشكل» و«التعليل». لكل شكل اختر التعليل المناسب.</p>
      <div className="rect-stack">
        {p78Check2Shapes.map((shape, index) => <WhyNotShape key={shape.id} shape={shape} spec={check2Specs[index]} />)}
      </div>
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 7 — الخواص + تعبير شفهي
   ============================================================================================= */
const propertyOptions = [
  { id: 'parallel', text: 'كل ضلعين متقابلين متوازيان', correct: true },
  { id: 'equal', text: 'كل ضلعين متقابلين متساويان في الطول', correct: true },
  { id: 'opp-angles', text: 'كل زاويتين متقابلتين متساويتان', correct: true },
  { id: 'right', text: 'زواياه الأربع قائمة', correct: true },
  { id: 'four-equal', text: 'أضلاعه الأربعة متساوية دائماً', correct: false },
]
const oralOptions = [
  { id: 'right', text: 'عندما تكون فيه زاوية قائمة', correct: true },
  { id: 'adjacent', text: 'عندما يتساوى ضلعان متجاوران', correct: false },
  { id: 'parallel', text: 'عندما يكون ضلعاه المتقابلان متوازيين', correct: false },
  { id: 'opp', text: 'عندما تتساوى زاويتان متقابلتان', correct: false },
]
function PropertiesTask() {
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked, attempts] = useChecked()
  const correct = propertyOptions.every((option) => selected.includes(option.id) === option.correct)
  return <div className="rect-task" data-platform-id="rect-platform-properties">
    <TaskHead title="اختر كل خاصة صحيحة للمستطيل" platform />
    <ul className="rect-choices">
      {propertyOptions.map((option) => {
        const isSelected = selected.includes(option.id)
        return <li key={option.id}><label className={`rect-choice ${toneClass(checked, isSelected, option.correct)}`}>
          <input type="checkbox" checked={isSelected} onChange={() => { setChecked(false); setSelected((previous) => (isSelected ? previous.filter((item) => item !== option.id) : [...previous, option.id])) }} />
          {option.text}
        </label></li>
      })}
    </ul>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)} disabled={selected.length === 0}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="ثلاث خواص موروثة من متوازي الأضلاع وخاصة واحدة يضيفها المستطيل. فكّر: هل يجب أن تتساوى أضلاع كل مستطيل الأربعة؟">
      <p>الخواص الأربع الأولى صحيحة: ثلاث موروثة من متوازي الأضلاع، والرابعة خاصة المستطيل. أما «الأضلاع الأربعة متساوية» فخاصة المعيّن والمربع، وليست صحيحة لكل مستطيل.</p>
    </Feedback>
  </div>
}
function OralTask({ element }: { element: SourceElement }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked, attempts] = useChecked()
  const correct = selected === 'right'
  return <div className="rect-task">
    <TaskHead title="عبّر شفهياً ثم اختر الصياغة الصحيحة" page={element.page} />
    <ul className="rect-choices">
      {oralOptions.map((option) => <li key={option.id}><label className={`rect-choice ${toneClass(checked, selected === option.id, option.correct)}`}>
        <input type="radio" name="oral" checked={selected === option.id} onChange={() => { setChecked(false); setSelected(option.id) }} />
        {option.text}
      </label></li>)}
    </ul>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)} disabled={!selected}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="عد إلى التعريف في ص 77: المستطيل هو متوازي الأضلاع فيه …">
      <p>يكون متوازي الأضلاع مستطيلاً <strong>عندما تكون فيه زاوية قائمة</strong>، وعندها تصبح زواياه الأربع قائمة. تساوي ضلعين متجاورين يعطي معيّناً، أما توازي المتقابلين وتساوي الزاويتين المتقابلتين فمتحققان في كل متوازي أضلاع.</p>
    </Feedback>
  </div>
}
function StepProperties() {
  const properties = findRectangleElement('rect-p78-properties')
  const oral = findRectangleElement('rect-p78-oral')
  return <div className="rect-stack">
    <Sheet element={properties}>
      <div className="rect-two">
        <Board caption={<><b>رسم الكتاب</b><span>أربع زوايا قائمة</span></>}>
          <GeoFigure pts={{ A: { x: 40, y: 30 }, B: { x: 260, y: 30 }, C: { x: 260, y: 150 }, D: { x: 40, y: 150 } }} order={['A', 'B', 'C', 'D']} width={300} height={180}
            right={[{ at: 'A', from: 'B', to: 'D' }, { at: 'B', from: 'A', to: 'C' }, { at: 'C', from: 'B', to: 'D' }, { at: 'D', from: 'A', to: 'C' }]} showLabels={false} ariaLabel="مستطيل معلّم بأربع زوايا قائمة" />
        </Board>
        <ul className="rect-property-grid" aria-label="خواص المستطيل">
          <li>كل ضلعين متقابلين متوازيان<small>من خواص متوازي الأضلاع</small></li>
          <li>كل ضلعين متقابلين متساويان في الطول<small>من خواص متوازي الأضلاع</small></li>
          <li>كل زاويتين متقابلتين متساويتان في القياس<small>من خواص متوازي الأضلاع</small></li>
          <li className="is-new">زوايا المستطيل الأربع قائمة<small>الخاصة المضافة في المستطيل</small></li>
        </ul>
      </div>
      <PropertiesTask />
    </Sheet>
    <Sheet element={oral}>
      <OralTask element={oral} />
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 8 — رسم المستطيل خطوة بخطوة (ص 79)
   ============================================================================================= */
const CM = 60
const CB = { x: 90, y: 200 }
const CA = { x: 90 + 3 * CM, y: 200 }
const CC = { x: 90, y: 200 - 2 * CM }
const CD = { x: 90 + 3 * CM, y: 200 - 2 * CM }
const mono = { fontFamily: 'DM Mono, monospace', fontWeight: 700 } as const
function ConstructionFigure({ stage }: { stage: number }) {
  const rightMark = (v: { x: number; y: number }, dx: number, dy: number) => `M ${v.x + dx} ${v.y} L ${v.x + dx} ${v.y + dy} L ${v.x} ${v.y + dy}`
  return <svg className="rect-svg" viewBox="0 0 360 262" role="img" aria-label={`رسم المستطيل ABCD بعد الخطوة ${stage}`} style={{ direction: 'ltr' }}>
    {stage === 1 && <g>
      <rect x={CB.x - 12} y={CB.y + 10} width={3 * CM + 44} height={30} fill="#fffdf7" stroke="#22303f" strokeWidth="1.5" />
      {Array.from({ length: 19 }, (_, index) => <line key={index} x1={CB.x + index * 10} y1={CB.y + 10} x2={CB.x + index * 10} y2={CB.y + (index % 10 === 0 ? 24 : index % 5 === 0 ? 20 : 16)} stroke="#22303f" strokeWidth="1.2" />)}
      {[0, 1, 2, 3].map((n) => <text key={n} x={CB.x + n * CM} y={CB.y + 36} textAnchor="middle" fontSize="11" style={mono} fill="#22303f">{n}</text>)}
    </g>}
    {stage === 2 && <g>
      <path d={`M ${CB.x - 70} ${CB.y} A 70 70 0 0 1 ${CB.x + 70} ${CB.y}`} fill="rgba(245,183,0,.18)" stroke="#c99600" strokeWidth="2" />
      <line x1={CB.x} y1={CB.y} x2={CB.x} y2={CB.y - 70} stroke="#c99600" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={CB.x + 4} y={CB.y - 74} fontSize="11" style={mono} fill="#5a4300">90°</text>
      <polygon points={`${CB.x + 100},${CB.y} ${CB.x + 160},${CB.y} ${CB.x + 100},${CB.y - 60}`} fill="rgba(245,183,0,.35)" stroke="#c99600" strokeWidth="1.5" />
    </g>}
    {stage >= 2 && <line x1={CB.x} y1={CB.y} x2={CB.x} y2={CB.y - 2 * CM - 30} stroke="#8da4cf" strokeWidth="2" strokeDasharray="6 5" />}
    {stage >= 4 && <line x1={CA.x} y1={CA.y} x2={CA.x} y2={CA.y - 2 * CM - 30} stroke="#8da4cf" strokeWidth="2" strokeDasharray="6 5" />}
    <line x1={CB.x} y1={CB.y} x2={CA.x} y2={CA.y} stroke="#1f5fbf" strokeWidth="3" strokeLinecap="round" />
    {stage >= 3 && <line x1={CB.x} y1={CB.y} x2={CC.x} y2={CC.y} stroke="#1f5fbf" strokeWidth="3" strokeLinecap="round" />}
    {stage >= 4 && <line x1={CA.x} y1={CA.y} x2={CD.x} y2={CD.y} stroke="#1f5fbf" strokeWidth="3" strokeLinecap="round" />}
    {stage >= 5 && <line x1={CC.x} y1={CC.y} x2={CD.x} y2={CD.y} stroke="#1f5fbf" strokeWidth="3" strokeLinecap="round" />}
    {stage >= 3 && <path d={rightMark(CB, 14, -14)} fill="none" stroke="#b3261e" strokeWidth="2" />}
    {stage >= 4 && <path d={rightMark(CA, -14, -14)} fill="none" stroke="#b3261e" strokeWidth="2" />}
    {stage >= 5 && <path d={rightMark(CC, 14, 14)} fill="none" stroke="#b3261e" strokeWidth="2" />}
    {stage >= 5 && <path d={rightMark(CD, -14, 14)} fill="none" stroke="#b3261e" strokeWidth="2" />}
    <text x={CB.x + 1.5 * CM} y={CB.y + (stage === 1 ? 56 : 22)} textAnchor="middle" fontSize="13" style={mono} fill="#1d7a4a">3cm</text>
    {stage >= 3 && <text x={CB.x - 24} y={CB.y - CM + 4} textAnchor="middle" fontSize="13" style={mono} fill="#1d7a4a">2cm</text>}
    {stage >= 4 && <text x={CA.x + 24} y={CA.y - CM + 4} textAnchor="middle" fontSize="13" style={mono} fill="#1d7a4a">2cm</text>}
    <circle cx={CB.x} cy={CB.y} r="4" fill="#b3261e" /><text x={CB.x - 18} y={CB.y + 6} fontSize="16" style={mono} fill="#22303f">B</text>
    <circle cx={CA.x} cy={CA.y} r="4" fill="#b3261e" /><text x={CA.x + 10} y={CA.y + 6} fontSize="16" style={mono} fill="#22303f">A</text>
    {stage >= 3 && <><circle cx={CC.x} cy={CC.y} r="4" fill="#b3261e" /><text x={CC.x - 18} y={CC.y + 6} fontSize="16" style={mono} fill="#22303f">C</text></>}
    {stage >= 4 && <><circle cx={CD.x} cy={CD.y} r="4" fill="#b3261e" /><text x={CD.x + 10} y={CD.y + 6} fontSize="16" style={mono} fill="#22303f">D</text></>}
    {stage >= 5 && <text x={CB.x + 1.5 * CM} y={CC.y - 18} textAnchor="middle" fontSize="13" style={mono} fill="#b3261e">D̂ = Ĉ = 90°</text>}
  </svg>
}
function StepConstruction() {
  const construction = findRectangleElement('rect-p79-construction')
  const [stage, setStage] = useState(1)
  const current = p79Steps[stage - 1]
  return <div className="rect-stack">
    <Sheet element={construction}>
      <div className="rect-two">
        <div className="rect-stack">
          <ul className="rect-stage-tabs" aria-label="خطوات الرسم">
            {p79Steps.map((step) => <li key={step.n}><button type="button" className={`rect-stage-tab ${step.n < stage ? 'is-done' : ''}`} aria-pressed={step.n === stage} onClick={() => setStage(step.n)} aria-label={`الخطوة ${step.n}`}>{step.n}</button></li>)}
          </ul>
          <Board caption={<><b>الخطوة {stage} من 5</b><span>{stage === 1 ? 'المسطرة' : stage === 2 ? 'المنقلة أو الكوس' : stage === 5 ? 'التحقق بالمنقلة' : 'المسطرة'}</span></>}>
            <ConstructionFigure stage={stage} />
          </Board>
          <div className="rect-actions">
            <button type="button" className="rect-button is-ghost" onClick={() => setStage((value) => Math.max(1, value - 1))} disabled={stage === 1}><ChevronRight size={16} aria-hidden="true" /> الخطوة السابقة</button>
            <button type="button" className="rect-button" onClick={() => setStage((value) => Math.min(5, value + 1))} disabled={stage === 5}>الخطوة التالية <ChevronLeft size={16} aria-hidden="true" /></button>
          </div>
        </div>
        <ol className="rect-condition-list" aria-label="نص خطوات الكتاب">
          {p79Steps.map((step) => <li key={step.id} data-source-id={step.id} style={step.n === stage ? { borderColor: 'var(--rect-cobalt)', boxShadow: 'inset 0 0 0 1.5px var(--rect-cobalt)' } : undefined}>
            <Rich text={step.text} />
            {step.n === stage && <p className="rect-stage-why">لماذا؟ {current.why}</p>}
          </li>)}
        </ol>
      </div>
      <PlatformNote title="كيف نقيم العمود؟ — شرح إضافي من المنصة">
        <ul>
          <li><strong>بالمنقلة:</strong> ضع مركز المنقلة على <MathExpression>B</MathExpression> وصفرها على <MathExpression>[AB]</MathExpression>، علّم عند <MathExpression>90°</MathExpression>، ثم ارسم من <MathExpression>B</MathExpression> عبر العلامة.</li>
          <li><strong>بالكوس:</strong> أسند ضلعه القائم على <MathExpression>[AB]</MathExpression> ورأسه القائم عند <MathExpression>B</MathExpression>، وارسم على ضلعه الآخر.</li>
          <li>التحقق في الخطوة 5 ليس زينة: قياس <MathExpression>D̂</MathExpression> و<MathExpression>Ĉ</MathExpression> بالمنقلة يؤكد أنّ <MathExpression>[DC]</MathExpression> يوازي <MathExpression>[AB]</MathExpression> فعلاً.</li>
        </ul>
      </PlatformNote>
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 9 — تدرّب على الرسم: ترتيب الخطوات + XYZW
   ============================================================================================= */
const shuffledOrder = [3, 1, 5, 2, 4]
function StepOrderTask() {
  const [order, setOrder] = useState<number[]>(shuffledOrder)
  const [checked, setChecked, attempts] = useChecked()
  const correct = order.every((n, index) => n === index + 1)
  const move = (index: number, direction: -1 | 1) => {
    setChecked(false)
    setOrder((previous) => {
      const next = [...previous]
      const target = index + direction
      if (target < 0 || target >= next.length) return previous
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }
  return <div className="rect-task" data-platform-id="rect-platform-step-order">
    <TaskHead title="رتّب خطوات الرسم (خُلطت خطوات الكتاب)" platform />
    <ol className="rect-order-list" aria-label="الخطوات بترتيبك">
      {order.map((n, index) => {
        const step = p79Steps[n - 1]
        return <li key={n} className={checked ? (n === index + 1 ? 'is-right' : 'is-wrong') : ''}>
          <span><span className="rect-order-index" aria-hidden="true">{index + 1}</span><Rich text={step.text} /></span>
          <span className="rect-order-buttons">
            <button type="button" className="rect-order-button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`انقل الخطوة «${step.text.slice(0, 24)}» إلى الأعلى`}><ArrowUp size={18} aria-hidden="true" /></button>
            <button type="button" className="rect-order-button" onClick={() => move(index, 1)} disabled={index === order.length - 1} aria-label={`انقل الخطوة «${step.text.slice(0, 24)}» إلى الأسفل`}><ArrowDown size={18} aria-hidden="true" /></button>
          </span>
        </li>
      })}
    </ol>
    <div className="rect-actions">
      <button type="button" className="rect-button" onClick={() => setChecked(true)}><Check size={16} aria-hidden="true" /> تحقّق من الترتيب</button>
      <button type="button" className="rect-button is-ghost" onClick={() => { setOrder(shuffledOrder); setChecked(false) }}><RotateCcw size={16} aria-hidden="true" /> إعادة الخلط</button>
    </div>
    <Feedback state={checked ? (correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="ابدأ بما يُرسم أولاً بالمسطرة، وانتهِ بالوصل والتحقق بالمنقلة. راجع بطاقات الخطوات في الخطوة السابقة.">
      <p>الترتيب الصحيح: الطول <MathExpression>[AB]</MathExpression> ← العمود من <MathExpression>B</MathExpression> ← تعيين <MathExpression>C</MathExpression> ← العمود من <MathExpression>A</MathExpression> وتعيين <MathExpression>D</MathExpression> ← وصل <MathExpression>D</MathExpression> بـ <MathExpression>C</MathExpression> والتحقق. كل خطوة تستعمل ناتج التي قبلها.</p>
    </Feedback>
  </div>
}
function DrawPlanTask({ element }: { element: SourceElement }) {
  const [lengths, setLengths] = useState({ XY: '', YZ: '', ZW: '', WX: '' })
  const [tool, setTool] = useState<string | null>(null)
  const [angles, setAngles] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const nums = { XY: parseNumber(lengths.XY), YZ: parseNumber(lengths.YZ), ZW: parseNumber(lengths.ZW), WX: parseNumber(lengths.WX) }
  const lengthsOk = nums.XY !== null && nums.YZ !== null && nums.XY === nums.ZW && nums.YZ === nums.WX && ((nums.XY === 4 && nums.YZ === 3) || (nums.XY === 3 && nums.YZ === 4))
  const toolOk = tool === 'perpendiculars'
  const anglesOk = parseNumber(angles) === 4
  const all = lengthsOk && toolOk && anglesOk
  const sides: Array<keyof typeof lengths> = ['XY', 'YZ', 'ZW', 'WX']
  return <div className="rect-task">
    <TaskHead title="خطّط للرسم قبل أن تمسك المسطرة" page={element.page} />
    <div className="rect-stack" data-source-id="rect-p80-check-draw-lengths">
      <p><strong>(1) الأطوال:</strong> اكتب طول كل ضلع من أضلاع <MathExpression>XYZW</MathExpression> بالسنتيمتر (الطول <MathExpression>4cm</MathExpression> والعرض <MathExpression>3cm</MathExpression>).</p>
      <div className="rect-fields is-quad">
        {sides.map((side) => <label key={side} className="rect-field"><span><MathExpression>{side}</MathExpression></span><input className={`rect-input ${checked ? (lengthsOk ? 'is-right' : 'is-wrong') : ''}`} inputMode="numeric" value={lengths[side]} onChange={(event) => { setChecked(false); setLengths((previous) => ({ ...previous, [side]: event.target.value })) }} aria-label={`طول الضلع ${side} بالسنتيمتر`} /></label>)}
      </div>
    </div>
    <div className="rect-stack" data-source-id="rect-p80-check-draw-tools">
      <p><strong>(2) الأدوات:</strong> في أي خطوة نستعمل المنقلة أو الكوس؟</p>
      <ul className="rect-choices">
        {[{ id: 'segment', text: 'عند رسم القطعة [XY] بطول 4cm', correct: false }, { id: 'perpendiculars', text: 'عند إقامة العمودين على [XY] من X ومن Y', correct: true }, { id: 'join', text: 'عند وصل Z بـ W', correct: false }].map((option) => <li key={option.id}><label className={`rect-choice ${toneClass(checked, tool === option.id, option.correct)}`}>
          <input type="radio" name="draw-tool" checked={tool === option.id} onChange={() => { setChecked(false); setTool(option.id) }} />
          <Rich text={option.text} />
        </label></li>)}
      </ul>
    </div>
    <div className="rect-stack" data-source-id="rect-p80-check-draw-angles">
      <p><strong>(3) الزوايا القائمة:</strong> كم زاوية قائمة ستحدّد على <MathExpression>XYZW</MathExpression>؟</p>
      <div className="rect-fields"><label className="rect-field"><span>العدد</span><input className={`rect-input ${checked ? (anglesOk ? 'is-right' : 'is-wrong') : ''}`} inputMode="numeric" value={angles} onChange={(event) => { setChecked(false); setAngles(event.target.value) }} aria-label="عدد الزوايا القائمة" /></label></div>
    </div>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)}><Check size={16} aria-hidden="true" /> تحقّق من الخطة</button></div>
    <Feedback state={checked ? (all ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="كل ضلعين متقابلين في المستطيل متساويان؛ المنقلة أو الكوس تلزم عند إقامة العمود؛ وتذكّر كم زاوية قائمة في المستطيل.">
      <ul>
        <li>الأطوال: <MathExpression>XY = ZW = 4cm</MathExpression> و <MathExpression>YZ = WX = 3cm</MathExpression> (أو بالعكس)، لأن كل ضلعين متقابلين متساويان.</li>
        <li>المنقلة أو الكوس تُستعمل عند إقامة العمودين من <MathExpression>X</MathExpression> و<MathExpression>Y</MathExpression>؛ المسطرة للأطوال والوصل.</li>
        <li>أربع زوايا قائمة: <MathExpression>X̂ = Ŷ = Ẑ = Ŵ = 90°</MathExpression>؛ نعلّمها بالمربع الصغير ونتحقق بالمنقلة.</li>
      </ul>
    </Feedback>
  </div>
}
function StepDrawPractice() {
  const checkDraw = findRectangleElement('rect-p80-check-draw')
  return <div className="rect-stack">
    <StepOrderTask />
    <Sheet element={checkDraw}>
      <PlatformNote title="تنفيذ الرسم في الدفتر">
        <p>هذا التمرين يُرسم في الدفتر بالأدوات الحقيقية. هنا نخطّط له فقط: الأطوال، ومتى نستعمل كل أداة، وما الزوايا التي نعلّمها. بعد التخطيط ارسم <MathExpression>XYZW</MathExpression> في دفترك وتحقق من <MathExpression>ZW = 4cm</MathExpression> بالمسطرة.</p>
      </PlatformNote>
      <DrawPlanTask element={checkDraw} />
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 10 — تدرّب ① و②
   ============================================================================================= */
function FillBlanksTask() {
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [t, setT] = useState('')
  const [thSide, setThSide] = useState(''); const [thValue, setThValue] = useState('')
  const [j1, setJ1] = useState(''); const [j2, setJ2] = useState(''); const [jValue, setJValue] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const ok = {
    a: a === 'DC', b: b === 'AD', t: parseNumber(t) === 4, th: thSide === 'BC' && parseNumber(thValue) === 2,
    j: new Set([j1, j2]).size === 2 && [j1, j2].every((item) => item === 'Ĉ' || item === 'D̂') && parseNumber(jValue) === 90,
  }
  const all = Object.values(ok).every(Boolean)
  const cls = (good: boolean) => (checked ? (good ? 'is-right' : 'is-wrong') : '')
  const sideSelect = (value: string, onChange: (value: string) => void, options: string[], good: boolean, label: string) => <select className={`rect-select ${cls(good)}`} value={value} onChange={(event) => { setChecked(false); onChange(event.target.value) }} aria-label={label}>
    <option value="">……</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}
  </select>
  return <div className="rect-task">
    <TaskHead title="املأ الفراغات" page={80} />
    <div className="rect-stack">
      <div className="rect-fields" data-source-id="rect-p80-ex1-a"><label className="rect-field"><span>(أ) <MathExpression>AB ∥ ……</MathExpression></span>{sideSelect(a, setA, ['DC', 'BC', 'AD', 'AC'], ok.a, 'الفراغ أ')}</label></div>
      <div className="rect-fields" data-source-id="rect-p80-ex1-b"><label className="rect-field"><span>(ب) <MathExpression>BC ∥ ……</MathExpression></span>{sideSelect(b, setB, ['AD', 'DC', 'AB', 'BD'], ok.b, 'الفراغ ب')}</label></div>
      <div className="rect-fields" data-source-id="rect-p80-ex1-t"><label className="rect-field"><span>(ت) <MathExpression>AB = DC = ……</MathExpression> (بالسنتيمتر)</span><input className={`rect-input ${cls(ok.t)}`} inputMode="numeric" value={t} onChange={(event) => { setChecked(false); setT(event.target.value) }} aria-label="الفراغ ت بالسنتيمتر" /></label></div>
      <div className="rect-fields" data-source-id="rect-p80-ex1-th">
        <label className="rect-field"><span>(ث) <MathExpression>AD = ……</MathExpression></span>{sideSelect(thSide, setThSide, ['BC', 'DC', 'AB', 'AC'], ok.th, 'الفراغ ث: الضلع')}</label>
        <label className="rect-field"><span><MathExpression>= ……</MathExpression> (بالسنتيمتر)</span><input className={`rect-input ${cls(ok.th)}`} inputMode="numeric" value={thValue} onChange={(event) => { setChecked(false); setThValue(event.target.value) }} aria-label="الفراغ ث بالسنتيمتر" /></label>
      </div>
      <div className="rect-fields" data-source-id="rect-p80-ex1-j">
        <label className="rect-field"><span>(ج) <MathExpression>Â = B̂ = ……</MathExpression></span>{sideSelect(j1, setJ1, ['Ĉ', 'D̂', 'Â', 'B̂'], ok.j, 'الفراغ ج: الزاوية الأولى')}</label>
        <label className="rect-field"><span><MathExpression>= ……</MathExpression></span>{sideSelect(j2, setJ2, ['Ĉ', 'D̂', 'Â', 'B̂'], ok.j, 'الفراغ ج: الزاوية الثانية')}</label>
        <label className="rect-field"><span>وقياس كل منها (بالدرجات)</span><input className={`rect-input ${cls(ok.j)}`} inputMode="numeric" value={jValue} onChange={(event) => { setChecked(false); setJValue(event.target.value) }} aria-label="قياس الزاوية بالدرجات" /></label>
      </div>
    </div>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (all ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="الضلع المقابل لضلع ما لا يشترك معه في أي رأس، والضلعان المتقابلان متساويان، وزوايا المستطيل كلها قائمة. الحقول الخاطئة معلّمة بالأحمر.">
      <ul>
        <li>(أ) <MathExpression>AB ∥ DC</MathExpression>: الضلع المقابل لـ <MathExpression>AB</MathExpression> هو <MathExpression>DC</MathExpression>.</li>
        <li>(ب) <MathExpression>BC ∥ AD</MathExpression>.</li>
        <li>(ت) <MathExpression>AB = DC = 4cm</MathExpression> (من الرسم).</li>
        <li>(ث) <MathExpression>AD = BC = 2cm</MathExpression>.</li>
        <li>(ج) <MathExpression>Â = B̂ = Ĉ = D̂ = 90°</MathExpression>: زوايا المستطيل الأربع قائمة.</li>
      </ul>
    </Feedback>
  </div>
}
function TrueFalseTask() {
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>({})
  const [checked, setChecked, attempts] = useChecked()
  const all = p80Ex2Statements.every((statement) => answers[statement.id] === statement.truth)
  const explanations: Record<string, string> = {
    'rect-p80-ex2-a': 'صح: التعريف يبدأ بـ «متوازي الأضلاع»، فكل مستطيل متوازي أضلاع.',
    'rect-p80-ex2-b': 'خطأ: متوازي أضلاع بلا زاوية قائمة (مثل الشكل (2) في الانطلاقة) ليس مستطيلاً.',
    'rect-p80-ex2-t': 'صح: خاصة موروثة من متوازي الأضلاع.',
  }
  return <div className="rect-task">
    <TaskHead title="صح أم خطأ؟" page={80} />
    <div className="rect-stack">
      {p80Ex2Statements.map((statement) => <div key={statement.id} data-source-id={statement.id} className="rect-stack" style={{ gap: 8 }}>
        <p><strong>({statement.label})</strong> {statement.text}</p>
        <ul className="rect-choices is-inline">
          {[true, false].map((value) => <li key={String(value)}><label className={`rect-choice ${toneClass(checked, answers[statement.id] === value, value === statement.truth)}`}>
            <input type="radio" name={statement.id} checked={answers[statement.id] === value} onChange={() => { setChecked(false); setAnswers((previous) => ({ ...previous, [statement.id]: value })) }} />
            {value ? 'صح' : 'خطأ'}
          </label></li>)}
        </ul>
      </div>)}
    </div>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)} disabled={p80Ex2Statements.some((statement) => answers[statement.id] === undefined)}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (all ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="اسأل عن كل عبارة: هل تنطبق على كل الأشكال من هذا النوع؟ مثال مضاد واحد يكفي لتكون خطأ.">
      <ul>{p80Ex2Statements.map((statement) => <li key={statement.id}>({statement.label}) {explanations[statement.id]}</li>)}</ul>
    </Feedback>
  </div>
}
function StepPractice12() {
  const ex1 = findRectangleElement('rect-p80-ex1')
  const ex2 = findRectangleElement('rect-p80-ex2')
  return <div className="rect-stack">
    <Sheet element={ex1}>
      <div className="rect-two">
        <Board caption={<><b>ABCD</b><span>CB = 2cm · BA = 4cm</span></>}>
          <GeoFigure pts={{ C: { x: 50, y: 40 }, D: { x: 250, y: 40 }, A: { x: 250, y: 160 }, B: { x: 50, y: 160 } }} order={['C', 'D', 'A', 'B']} width={300} height={200}
            sides={[{ side: ['C', 'B'], label: '2cm' }, { side: ['B', 'A'], label: '4cm' }]} right={[{ at: 'B', from: 'C', to: 'A' }]}
            ariaLabel="المستطيل ABCD: C أعلى اليسار، D أعلى اليمين، B أسفل اليسار، A أسفل اليمين، CB يساوي 2cm و BA يساوي 4cm وزاوية قائمة عند B" />
        </Board>
        <ul className="rect-given" aria-label="المعطيات من الرسم"><li><MathExpression>CB = 2cm</MathExpression></li><li><MathExpression>BA = 4cm</MathExpression></li><li>زاوية قائمة عند <MathExpression>B</MathExpression></li></ul>
      </div>
      <FillBlanksTask />
    </Sheet>
    <Sheet element={ex2}>
      <TrueFalseTask />
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 11 — تدرّب ③: الرأس الرابع W
   ============================================================================================= */
const GRID_STEP = 36
const gridXY = (c: number, r: number) => ({ x: 18 + c * GRID_STEP, y: 18 + r * GRID_STEP })
function FourthVertexBoard() {
  const [chosen, setChosen] = useState<{ c: number; r: number } | null>(null)
  const [checked, setChecked, attempts] = useChecked()
  const [drawn, setDrawn] = useState(0)
  const [props, setProps] = useState<string[]>([])
  const [propsChecked, setPropsChecked, propsAttempts] = useChecked()
  const { Y, X, Z, W } = p80Ex3Grid
  const correct = chosen?.c === W.c && chosen?.r === W.r
  const propsOk = p80Ex3Properties.every((option) => props.includes(option.id) === option.correct)
  const fixed = [{ name: 'Y', ...Y }, { name: 'X', ...X }, { name: 'Z', ...Z }]
  const pY = gridXY(Y.c, Y.r); const pX = gridXY(X.c, X.r); const pZ = gridXY(Z.c, Z.r); const pW = gridXY(W.c, W.r)
  const nodes: Array<{ c: number; r: number }> = []
  for (let r = 0; r <= p80Ex3Grid.rows; r += 1) for (let c = 0; c <= p80Ex3Grid.cols; c += 1) nodes.push({ c, r })
  return <div className="rect-stack">
    <div className="rect-task" data-source-id="rect-p80-ex3-a">
      <TaskHead title="(أ) انقر على موقع الرأس الرابع W" page={80} />
      <p>الزاوية عند <MathExpression>Y</MathExpression> قائمة. أين يجب أن يقع <MathExpression>W</MathExpression> حتى يكون <MathExpression>XYZW</MathExpression> مستطيلاً؟</p>
      <div className="rect-grid-wrap">
        <div className="rect-grid" role="group" aria-label="شبكة نقاط لتعيين الرأس W">
          <svg viewBox="0 0 324 252" aria-hidden="true">
            {Array.from({ length: p80Ex3Grid.rows + 1 }, (_, r) => <line key={`h${r}`} x1={18} y1={18 + r * GRID_STEP} x2={18 + p80Ex3Grid.cols * GRID_STEP} y2={18 + r * GRID_STEP} stroke="rgba(31,95,191,.18)" />)}
            {Array.from({ length: p80Ex3Grid.cols + 1 }, (_, c) => <line key={`v${c}`} x1={18 + c * GRID_STEP} y1={18} x2={18 + c * GRID_STEP} y2={18 + p80Ex3Grid.rows * GRID_STEP} stroke="rgba(31,95,191,.18)" />)}
            <line x1={pY.x} y1={pY.y} x2={pX.x} y2={pX.y} stroke="#1f5fbf" strokeWidth="3.5" strokeLinecap="round" />
            <line x1={pY.x} y1={pY.y} x2={pZ.x} y2={pZ.y} stroke="#1d7a4a" strokeWidth="3.5" strokeLinecap="round" />
            <path d={`M ${pY.x + 14} ${pY.y} L ${pY.x + 14} ${pY.y + 14} L ${pY.x} ${pY.y + 14}`} fill="none" stroke="#b3261e" strokeWidth="2" />
            {checked && correct && drawn >= 1 && <line x1={pX.x} y1={pX.y} x2={pW.x} y2={pW.y} stroke="#1d7a4a" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={drawn >= 1 ? undefined : '6 5'} />}
            {checked && correct && drawn >= 2 && <line x1={pZ.x} y1={pZ.y} x2={pW.x} y2={pW.y} stroke="#1f5fbf" strokeWidth="3.5" strokeLinecap="round" />}
            {checked && correct && drawn >= 2 && <>
              <path d={`M ${pX.x - 14} ${pX.y} L ${pX.x - 14} ${pX.y + 14} L ${pX.x} ${pX.y + 14}`} fill="none" stroke="#b3261e" strokeWidth="2" />
              <path d={`M ${pZ.x + 14} ${pZ.y} L ${pZ.x + 14} ${pZ.y - 14} L ${pZ.x} ${pZ.y - 14}`} fill="none" stroke="#b3261e" strokeWidth="2" />
              <path d={`M ${pW.x - 14} ${pW.y} L ${pW.x - 14} ${pW.y - 14} L ${pW.x} ${pW.y - 14}`} fill="none" stroke="#b3261e" strokeWidth="2" />
            </>}
            {fixed.map((point) => { const p = gridXY(point.c, point.r); return <g key={point.name}><circle cx={p.x} cy={p.y} r="5" fill="#b3261e" /><text x={p.x + (point.name === 'X' ? 8 : -18)} y={p.y + (point.name === 'Z' ? 18 : -8)} fontSize="15" style={mono} fill="#22303f">{point.name}</text></g> })}
            {chosen && <text x={gridXY(chosen.c, chosen.r).x + 8} y={gridXY(chosen.c, chosen.r).y + 18} fontSize="15" style={mono} fill={checked ? (correct ? '#1d7a4a' : '#b3261e') : '#5a4300'}>W</text>}
          </svg>
          {nodes.map((node) => {
            const isFixed = fixed.some((point) => point.c === node.c && point.r === node.r)
            const isChosen = chosen?.c === node.c && chosen?.r === node.r
            const p = gridXY(node.c, node.r)
            return <button key={`${node.c}-${node.r}`} type="button" className={`rect-grid-node ${isFixed ? 'is-fixed' : ''} ${isChosen ? (checked ? (correct ? 'is-right' : 'is-wrong') : 'is-chosen') : ''}`} style={{ left: p.x, top: p.y }} disabled={isFixed} aria-pressed={isChosen} aria-label={`النقطة (${node.c}, ${node.r})`} onClick={() => { setChecked(false); setDrawn(0); setChosen(node) }} />
          })}
        </div>
      </div>
      <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)} disabled={!chosen}><Check size={16} aria-hidden="true" /> تحقّق من موقع W</button></div>
      <Feedback state={checked ? (correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="الزاوية عند X يجب أن تكون قائمة أيضاً، والضلع المقابل لـ YZ يساويه طولاً. عدّ الفواصل بين النقاط.">
        <p><MathExpression>W</MathExpression> هو النقطة التي تقع أسفل <MathExpression>X</MathExpression> تماماً وعلى يمين <MathExpression>Z</MathExpression> تماماً، بحيث <MathExpression>XW = YZ</MathExpression> و <MathExpression>ZW = YX</MathExpression>. {correct ? 'أحسنت! أكمل الرسم في الجزء (ب).' : 'عدّ المربعات: من X انزل بعدد مربعات YZ.'}</p>
      </Feedback>
    </div>
    <div className="rect-task" data-source-id="rect-p80-ex3-b">
      <TaskHead title="(ب) أكمل الرسم بالأدوات الهندسية" page={80} />
      <p>بعد تعيين <MathExpression>W</MathExpression>: نقيم من <MathExpression>X</MathExpression> عموداً على <MathExpression>[YX]</MathExpression> بالمنقلة أو الكوس ونعيّن عليه <MathExpression>W</MathExpression> بحيث <MathExpression>XW = YZ</MathExpression>، ثم نصل <MathExpression>Z</MathExpression> بـ <MathExpression>W</MathExpression> بالمسطرة.</p>
      <div className="rect-actions">
        <button type="button" className="rect-button is-ghost" onClick={() => setDrawn(1)} disabled={!(checked && correct) || drawn >= 1}><PencilRuler size={16} aria-hidden="true" /> 1) أقم العمود من X وعيّن W</button>
        <button type="button" className="rect-button is-ghost" onClick={() => setDrawn(2)} disabled={drawn < 1 || drawn >= 2}><Ruler size={16} aria-hidden="true" /> 2) صل Z بـ W</button>
      </div>
      {drawn >= 2 && <div className="rect-feedback is-correct" role="status"><span className="rect-feedback-title"><CircleCheck size={18} aria-hidden="true" /> اكتمل المستطيل XYZW</span><p>تحقق في دفترك: <MathExpression>ZW = YX</MathExpression> بالمسطرة، و<MathExpression>Ŵ = 90°</MathExpression> بالمنقلة.</p></div>}
      {!(checked && correct) && <p className="rect-stage-why">عيّن <MathExpression>W</MathExpression> في الجزء (أ) أولاً حتى تُفتح أزرار الرسم.</p>}
    </div>
    <div className="rect-task" data-source-id="rect-p80-ex3-t">
      <TaskHead title="(ت) ما الخواص التي اعتمدت عليها؟" page={80} />
      <ul className="rect-choices">
        {p80Ex3Properties.map((option) => {
          const isSelected = props.includes(option.id)
          return <li key={option.id}><label className={`rect-choice ${toneClass(propsChecked, isSelected, option.correct)}`}>
            <input type="checkbox" checked={isSelected} onChange={() => { setPropsChecked(false); setProps((previous) => (isSelected ? previous.filter((item) => item !== option.id) : [...previous, option.id])) }} />
            <Rich text={option.text} />
          </label></li>
        })}
      </ul>
      <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setPropsChecked(true)} disabled={props.length === 0}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
      <Feedback state={propsChecked ? (propsOk ? 'correct' : 'wrong') : 'idle'} attempts={propsAttempts} hint="استعملنا خاصتين فقط: واحدة عن الزوايا وواحدة عن الأضلاع المتقابلة. تساوي الأضلاع الأربعة وتعامد القطرين ليسا من خواص كل مستطيل.">
        <p>اعتمدنا على خاصتين: <strong>زوايا المستطيل قائمة</strong> (العمود من <MathExpression>X</MathExpression>)، و<strong>كل ضلعين متقابلين متوازيان ومتساويان</strong> (<MathExpression>XW = YZ</MathExpression> و <MathExpression>ZW = YX</MathExpression>). تساوي الأضلاع الأربعة وتعامد القطرين ليسا من خواص المستطيل.</p>
      </Feedback>
    </div>
  </div>
}
function StepPractice3() {
  const ex3 = findRectangleElement('rect-p80-ex3')
  return <div className="rect-stack">
    <Sheet element={ex3}>
      <PlatformNote title="الشبكة وسيلة عرض من المنصة">
        <p>رسم الكتاب يُظهر <MathExpression>Y</MathExpression> و<MathExpression>X</MathExpression> و<MathExpression>Z</MathExpression> فقط. وضعناه على شبكة نقاط حتى تستطيع النقر على موقع <MathExpression>W</MathExpression> والتحقق فوراً؛ السؤال وفروعه الثلاثة من الكتاب كما هي.</p>
      </PlatformNote>
      <FourthVertexBoard />
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 12 — تدرّب ④: أطوال في شكل مركّب
   ============================================================================================= */
function CompositeFigure() {
  const s = 30
  const A = { x: 40, y: 230 }; const B = { x: 40 + 3 * s, y: 230 }; const C = { x: 40 + 5 * s, y: 230 }
  const G = { x: 40, y: 230 - 6 * s }; const F = { x: 40 + 3 * s, y: 230 - 6 * s }; const E = { x: 40 + 3 * s, y: 230 - 3 * s }; const D = { x: 40 + 5 * s, y: 230 - 3 * s }
  const rm = (v: { x: number; y: number }, dx: number, dy: number) => `M ${v.x + dx} ${v.y} L ${v.x + dx} ${v.y + dy} L ${v.x} ${v.y + dy}`
  const label = (p: { x: number; y: number }, name: string, dx: number, dy: number) => <g key={name}><circle cx={p.x} cy={p.y} r="4" fill="#b3261e" /><text x={p.x + dx} y={p.y + dy} fontSize="16" style={mono} fill="#22303f">{name}</text></g>
  return <svg className="rect-svg" viewBox="0 0 250 262" role="img" aria-label="مستطيل كبير ABFG ومستطيل صغير BCDE ملاصق له من اليمين؛ AG يساوي 6cm و GF يساوي 3cm و ED يساوي 2cm و CD يساوي 3cm" style={{ direction: 'ltr' }}>
    <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${F.x},${F.y} ${G.x},${G.y}`} fill="rgba(31,95,191,.08)" stroke="#1f5fbf" strokeWidth="3" strokeLinejoin="round" />
    <polygon points={`${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y} ${E.x},${E.y}`} fill="rgba(245,183,0,.18)" stroke="#1f5fbf" strokeWidth="3" strokeLinejoin="round" />
    <path d={rm(G, 14, 14)} fill="none" stroke="#b3261e" strokeWidth="2" /><path d={rm(A, 14, -14)} fill="none" stroke="#b3261e" strokeWidth="2" />
    <path d={rm(C, -14, -14)} fill="none" stroke="#b3261e" strokeWidth="2" /><path d={rm(D, -14, 14)} fill="none" stroke="#b3261e" strokeWidth="2" />
    <text x={(G.x + F.x) / 2} y={G.y - 10} textAnchor="middle" fontSize="13" style={mono} fill="#1d7a4a">3cm</text>
    <text x={A.x - 22} y={(A.y + G.y) / 2 + 4} textAnchor="middle" fontSize="13" style={mono} fill="#1d7a4a">6cm</text>
    <text x={(E.x + D.x) / 2} y={E.y - 10} textAnchor="middle" fontSize="13" style={mono} fill="#1d7a4a">2cm</text>
    <text x={C.x + 24} y={(C.y + D.y) / 2 + 4} textAnchor="middle" fontSize="13" style={mono} fill="#1d7a4a">3cm</text>
    {label(A, 'A', -18, 18)}{label(B, 'B', -6, 20)}{label(C, 'C', 8, 18)}{label(G, 'G', -18, -6)}{label(F, 'F', 8, -6)}{label(E, 'E', -20, 6)}{label(D, 'D', 10, 4)}
  </svg>
}
function CompositeTask() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked, attempts] = useChecked()
  const results = p80Ex4Lengths.map((item) => ({ ...item, ok: parseNumber(values[item.id] ?? '') === item.answer }))
  const all = results.every((item) => item.ok)
  const explanations: Record<string, ReactNode> = {
    'rect-p80-ex4-ac': <><MathExpression>AB = GF = 3cm</MathExpression> و <MathExpression>BC = ED = 2cm</MathExpression> ← <MathExpression>AC = 3 + 2 = 5cm</MathExpression>.</>,
    'rect-p80-ex4-eb': <><MathExpression>EB</MathExpression> يقابل <MathExpression>CD</MathExpression> في المستطيل <MathExpression>BCDE</MathExpression> ← <MathExpression>EB = 3cm</MathExpression>.</>,
    'rect-p80-ex4-fe': <><MathExpression>FB = AG = 6cm</MathExpression> ← <MathExpression>FE = FB − EB = 6 − 3 = 3cm</MathExpression>.</>,
  }
  return <div className="rect-task">
    <TaskHead title="احسب الأطوال الثلاثة بالسنتيمتر" page={80} />
    <div className="rect-fields">
      {results.map((item) => <label key={item.id} className="rect-field" data-source-id={item.id}><span><MathExpression>{`${item.label} =`}</MathExpression></span><input className={`rect-input ${checked ? (item.ok ? 'is-right' : 'is-wrong') : ''}`} inputMode="numeric" value={values[item.id] ?? ''} onChange={(event) => { setChecked(false); setValues((previous) => ({ ...previous, [item.id]: event.target.value })) }} aria-label={`طول ${item.label} بالسنتيمتر`} /></label>)}
    </div>
    <div className="rect-actions"><button type="button" className="rect-button" onClick={() => setChecked(true)} disabled={results.some((item) => !(values[item.id] ?? '').trim())}><Check size={16} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (all ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="استبدل كل طول مجهول بالضلع المقابل له في المستطيل نفسه، ثم اجمع أو اطرح على الخط الواحد. القيم الخاطئة معلّمة بالأحمر.">
      <ul>{results.map((item) => <li key={item.id}>{item.ok ? '✔' : '✘'} <MathExpression>{item.label}</MathExpression>: {explanations[item.id]}</li>)}</ul>
      <p>تحقق: <MathExpression>FE + EB = 3 + 3 = 6 = FB</MathExpression> ✔</p>
    </Feedback>
  </div>
}
function StepPractice4() {
  const ex4 = findRectangleElement('rect-p80-ex4')
  return <div className="rect-stack">
    <Sheet element={ex4}>
      <div className="rect-two">
        <Board caption={<><b>ABFG</b> و <b>BCDE</b><span>مستطيلان</span></>}><CompositeFigure /></Board>
        <div className="rect-stack">
          <ul className="rect-given" aria-label="المعطيات"><li><MathExpression>AG = 6cm</MathExpression></li><li><MathExpression>GF = 3cm</MathExpression></li><li><MathExpression>ED = 2cm</MathExpression></li><li><MathExpression>CD = 3cm</MathExpression></li></ul>
          <PlatformNote title="طريقة التفكير — شرح إضافي من المنصة">
            <p>كل طول مجهول نستبدله بطول <strong>الضلع المقابل له</strong> في مستطيله، ثم نجمع أو نطرح على الخط نفسه: <MathExpression>A</MathExpression> و<MathExpression>B</MathExpression> و<MathExpression>C</MathExpression> على استقامة واحدة، و<MathExpression>E</MathExpression> على <MathExpression>[FB]</MathExpression>.</p>
          </PlatformNote>
        </div>
      </div>
      <CompositeTask />
    </Sheet>
  </div>
}

/* =============================================================================================
   الخطوة 13 — الخلاصة والاختبار
   ============================================================================================= */
function StepSummary() {
  return <div className="rect-stack">
    <ul className="rect-summary" data-platform-id="rect-platform-summary">
      <li><strong>التعريف (ص 77)</strong><span>المستطيل هو متوازي الأضلاع فيه زاوية قائمة: شرطان معاً.</span></li>
      <li><strong>الخواص (ص 78)</strong><span>خواص متوازي الأضلاع نفسها، ويُضاف إليها: زوايا المستطيل الأربع قائمة.</span></li>
      <li><strong>الرسم (ص 79)</strong><span>الطول بالمسطرة ← عمودان بالمنقلة أو الكوس ← العرض عليهما ← وصل وتحقق.</span></li>
      <li><strong>التطبيق (ص 80)</strong><span>فراغات، صح/خطأ، تعيين الرأس الرابع، وأطوال في شكل مركّب.</span></li>
    </ul>
    <PlatformNote title="ما الذي أضافته المنصة؟">
      <ul>
        <li>مختبر الزاوية، نشاط نسبة العلم، اختيار خواص المستطيل، ترتيب خطوات الرسم، وشبكة تعيين <MathExpression>W</MathExpression>: كلها أنشطة من إعداد المنصة ومعلّمة بشارة «نشاط من إعداد المنصة».</li>
        <li>كل نصوص الأسئلة والأمثلة والخطوات منقولة من الكتاب ص 77–80 مع رقم الصفحة على كل بطاقة.</li>
      </ul>
    </PlatformNote>
    <div className="rect-task">
      <TaskHead title="اختبار الدرس المستقل" platform />
      <p>عشرون سؤالاً جديداً متدرّجة الصعوبة (أساسي، متوسط، متقدّم، تفكير). لا تظهر أي إجابة أثناء المحاولة؛ تُعرض النتيجة والحلول بعد التسليم فقط.</p>
      <div className="rect-actions">
        <a className="rect-test-link" href="#tests/run/lesson-rectangle-test"><Sparkles size={18} aria-hidden="true" /> ابدأ اختبار الدرس</a>
      </div>
    </div>
  </div>
}

/* =============================================================================================
   الدرس
   ============================================================================================= */
export function RectangleLesson() {
  const [activeStep, setActiveStep] = useState(0)
  const steps: LessonStep[] = useMemo(() => [
    { id: 'rect-intro', title: 'المستطيل من حولنا', content: <StepIntro /> },
    { id: 'rect-opening', title: 'انطلاقة نشطة: فرز الأشكال', content: <StepOpening /> },
    { id: 'rect-definition', title: 'تعريف المستطيل', content: <StepDefinition /> },
    { id: 'rect-example', title: 'مثال الكتاب: لماذا ABCD مستطيل؟', content: <StepExample /> },
    { id: 'rect-check1', title: 'تحقّق: لماذا هو مستطيل؟', content: <StepCheck1 /> },
    { id: 'rect-check2', title: 'تحقّق: لماذا ليس مستطيلاً؟', content: <StepCheck2 /> },
    { id: 'rect-properties', title: 'خواص المستطيل', content: <StepProperties /> },
    { id: 'rect-construction', title: 'رسم المستطيل خطوة بخطوة', content: <StepConstruction /> },
    { id: 'rect-draw-practice', title: 'تدرّب على الرسم', content: <StepDrawPractice /> },
    { id: 'rect-practice-1-2', title: 'تدرّب ① و②', content: <StepPractice12 /> },
    { id: 'rect-practice-3', title: 'تدرّب ③: الرأس الرابع', content: <StepPractice3 /> },
    { id: 'rect-practice-4', title: 'تدرّب ④: شكل مركّب', content: <StepPractice4 /> },
    { id: 'rect-summary', title: 'الخلاصة والاختبار', content: <StepSummary /> },
  ], [])
  return <LessonShell title={lessonTitle} steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-rectangle" />
}

export const rectangleStepCount = 13
export const rectangleStepIds = ['rect-intro', 'rect-opening', 'rect-definition', 'rect-example', 'rect-check1', 'rect-check2', 'rect-properties', 'rect-construction', 'rect-draw-practice', 'rect-practice-1-2', 'rect-practice-3', 'rect-practice-4', 'rect-summary'] as const
