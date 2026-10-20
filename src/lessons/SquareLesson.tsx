import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Check, ChevronLeft, ChevronRight, CircleCheck, CircleX, ClipboardList, Compass, Grid3x3, Layers, Lightbulb, PencilRuler, RotateCcw, Ruler, Sparkles } from 'lucide-react'
import { MathExpression as SharedMathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import type { LessonStep } from '../components/lesson/types'
import {
  check1Reasons, findSquareElement, lessonTitle, p81Shapes, p82Check1Shapes, p82OralQuestions, p82Properties, p82WhyNotShapes,
  p83Steps, p84Ex1Statements, p84Ex2Grid, p84Ex3Cases, p84Ex4Lengths, whyNotReasons, type SourceElement,
} from './squareData'

/* =============================================================================================
   الوحدة الثانية · الدرس 10 — «المربّع» (الكتاب ص 81–84)
   هوية بصرية مستقلة عن درس المستطيل: «مختبر التربيع» — ورق رسم هندسي بميلاد أخضر فاتح،
   شبكة نقاط دقيقة، شرائط قياس على الحواف، وعلامة «زاوية قائمة» تُرسم في ركن كل بطاقة بمربع
   صغير (الرمز نفسه المستعمل في الكتاب). كل عربية RTL وكل رمز هندسي معزول LTR.
   ============================================================================================= */

const MATH_RUN = /((?:\[?[A-Za-z]\u0302?\]?|\d)(?:[A-Za-z\u0302\d[\]\s=∥⟂+\-−×÷°.,/]*[A-Za-z\u0302\d°\]])?)/g
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
    nodes.push(<span key={start} className="sq-hat">{match[1]}<span className="sq-hat-mark">{'\u0302'}</span></span>)
    cursor = start + match[0].length
  }
  if (cursor < decomposed.length) nodes.push(decomposed.slice(cursor))
  return <>{nodes}</>
}
function MathExpression({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return <SharedMathExpression className={className} label={label}>{typeof children === 'string' ? withHats(children) : children}</SharedMathExpression>
}
function Rich({ text }: { text: string }) {
  const parts = text.replace(PRECOMPOSED_HAT, (char) => char.normalize('NFD')).split(MATH_RUN)
  return <span className="sq-rich">{parts.map((part, index) => (index % 2 === 1 ? <MathExpression key={index}>{part}</MathExpression> : <span key={index}>{part}</span>))}</span>
}
function useChecked(): [boolean, (value: boolean) => void, number] {
  const [checked, setCheckedState] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const setChecked = useCallback((value: boolean) => { setCheckedState(value); if (value) setAttempts((count) => count + 1) }, [])
  return [checked, setChecked, attempts]
}

/* ------------------------------------------------------------------ بطاقات المصدر */
function Sheet({ element, children, quote = true }: { element: SourceElement; children?: ReactNode; quote?: boolean }) {
  return <article className="sq-sheet" data-source-id={element.id} data-source-page={element.page}>
    <span className="sq-corner" aria-hidden="true" />
    <div className="sq-sheet-head">
      <span className="sq-page-tag"><Layers size={13} aria-hidden="true" /> الكتاب · ص {element.page}</span>
      <h3 className="sq-section-name">{element.section}</h3>
    </div>
    {quote && <p className="sq-quote"><Rich text={element.prompt} /></p>}
    {children && <div className="sq-sheet-body">{children}</div>}
  </article>
}
function PlatformNote({ title = 'إضافة من المنصة', children, id }: { title?: string; children: ReactNode; id?: string }) {
  return <aside className="sq-note" data-platform-id={id}>
    <strong><Lightbulb size={15} aria-hidden="true" /> {title}</strong>
    {children}
  </aside>
}
function Board({ caption, children, label }: { caption?: ReactNode; children: ReactNode; label?: string }) {
  return <figure className="sq-board">
    <div className="sq-board-body" aria-label={label}>{children}</div>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
}
function Feedback({ state, hint, attempts = 1, children }: { state: 'idle' | 'correct' | 'wrong'; hint?: string; attempts?: number; children: ReactNode }) {
  if (state === 'idle') return null
  const revealSolution = state === 'correct' || attempts >= 2
  return <div className={`sq-feedback ${state === 'correct' ? 'is-correct' : 'is-wrong'}`} role="status">
    <span className="sq-feedback-title">{state === 'correct' ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}{state === 'correct' ? 'إجابة صحيحة' : 'راجع الإجابة'}</span>
    {state === 'wrong' && hint && <p className="sq-feedback-hint"><Lightbulb size={15} aria-hidden="true" /> تلميح: <Rich text={hint} /></p>}
    {revealSolution
      ? <div className="sq-feedback-body">{state === 'wrong' && <p className="sq-feedback-reveal">الشرح الكامل بعد محاولتين — قارن خطواتك به:</p>}{children}</div>
      : <p className="sq-feedback-retry">عدّل إجابتك وتحقّق مرة أخرى؛ يظهر الشرح الكامل بعد المحاولة الثانية.</p>}
  </div>
}
function TaskHead({ title, page, platform = false }: { title: string; page?: number; platform?: boolean }) {
  return <div className="sq-task-head">
    <ClipboardList size={17} aria-hidden="true" />
    <strong>{title}</strong>
    {platform ? <span className="sq-page-tag is-platform">نشاط من إعداد المنصة</span> : page ? <span className="sq-page-tag">ص {page}</span> : null}
  </div>
}
const toneClass = (checked: boolean, selected: boolean, correct: boolean) => (checked ? (correct ? 'is-right' : selected ? 'is-wrong' : '') : selected ? 'is-selected' : '')
const parseNumber = (value: string) => {
  const normalized = value.replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace('٫', '.')
  const match = /^\s*(\d+(?:[.,]\d+)?)\s*(cm|سم|°|درجة)?\s*$/u.exec(normalized)
  return match ? Number(match[1].replace(',', '.')) : null
}
const sameSet = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((value) => b.includes(value))

/* ------------------------------------------------------------------ أشكال ص 81 */
type ShapeGeometry = { points: string; width: number; height: number }
const shapeGeometry: Record<number, ShapeGeometry> = {
  1: { points: '18,18 98,18 70,86 8,86', width: 106, height: 104 },
  2: { points: '46,12 96,46 52,92 2,58', width: 98, height: 104 },
  3: { points: '30,8 78,8 78,96 30,96', width: 108, height: 104 },
  4: { points: '14,20 96,20 76,84 2,84', width: 106, height: 104 },
  5: { points: '16,16 84,16 84,84 16,84', width: 100, height: 100 },
  6: { points: '10,30 100,30 100,82 10,82', width: 110, height: 112 },
  7: { points: '22,16 100,16 66,88 0,88', width: 106, height: 104 },
}
function ShapeFigure({ shape }: { shape: (typeof p81Shapes)[number] }) {
  const geometry = shapeGeometry[shape.number]
  const isRightAngled = shape.kind === 'square' || shape.kind === 'rectangle'
  return <svg viewBox={`0 0 ${geometry.width + 6} ${geometry.height + 6}`} className="sq-shape" role="img" aria-label={`الشكل (${shape.number}): ${shape.marks}`} style={{ direction: 'ltr' }}>
    <polygon points={geometry.points} fill="rgba(47,191,166,.10)" stroke="#0f6f74" strokeWidth="2.4" strokeLinejoin="round" />
    {isRightAngled && <polygon points={geometry.points.split(' ').slice(0, 3).join(' ')} fill="none" stroke="none" />}
    <text x="4" y="16" fontSize="13" className="sq-shape-number">{shape.number}</text>
  </svg>
}

/* ------------------------------------------------------------------ الخطوة 1 — المدخل والهدف */
function TilingLab() {
  const [tile, setTile] = useState<'square' | 'rectangle' | 'rhombus'>('square')
  const corner = tile === 'square' ? 90 : tile === 'rectangle' ? 90 : 70
  const gap = 360 - 4 * corner
  const fits = gap === 0
  return <div className="sq-lab" data-platform-id="sq-platform-tiling">
    <div className="sq-lab-tabs" role="group" aria-label="نوع البلاط">
      {([['square', 'مربّع'], ['rectangle', 'مستطيل'], ['rhombus', 'معيّن']] as const).map(([value, label]) => <button key={value} type="button" className={tile === value ? 'is-active' : ''} onClick={() => setTile(value)}>{label}</button>)}
    </div>
    <svg viewBox="40 0 180 160" className="sq-tiling" role="img" aria-label={`أربع بلاطات ${tile === 'square' ? 'مربّعة' : tile === 'rectangle' ? 'مستطيلة' : 'معيّنية'} تلتقي عند نقطة واحدة`} style={{ direction: 'ltr' }}>
      {tile === 'rhombus'
        ? [0, 1, 2, 3].map((index) => {
            const base = (index * Math.PI) / 2
            const ux = Math.cos(base); const uy = Math.sin(base)
            const vx = Math.cos(base + (corner * Math.PI) / 180); const vy = Math.sin(base + (corner * Math.PI) / 180)
            const L = 72
            const points = [[130, 80], [130 + ux * L, 80 + uy * L], [130 + ux * L + vx * L, 80 + uy * L + vy * L], [130 + vx * L, 80 + vy * L]].map(([x, y]) => `${x},${y}`).join(' ')
            return <polygon key={index} points={points} fill={index % 2 === 0 ? 'rgba(47,191,166,.30)' : 'rgba(242,179,61,.32)'} stroke="#0f6f74" strokeWidth="1.8" />
          })
        : (() => {
            const w = 68; const h = tile === 'square' ? 68 : 42
            return [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], index) => (
              <rect key={index} x={sx > 0 ? 130 : 130 - w} y={sy > 0 ? 80 : 80 - h} width={w} height={h} fill={index % 2 === 0 ? 'rgba(47,191,166,.30)' : 'rgba(242,179,61,.32)'} stroke="#0f6f74" strokeWidth="1.8" />
            ))
          })()}
      <circle cx="130" cy="80" r="3.5" fill="#b3261e" />
    </svg>
    <dl className="sq-lab-readout">
      <div><dt>زاوية البلاطة</dt><dd>{corner}°</dd></div>
      <div><dt>مجموع أربع زوايا</dt><dd>{4 * corner}°</dd></div>
      <div data-state={fits ? 'fits' : 'gap'}><dt>الفراغ عند النقطة</dt><dd>{fits ? 'لا فراغ' : `${gap}°`}</dd></div>
    </dl>
    <p className="sq-lab-verdict">{fits ? 'البلاطات تغطي المستوي بلا فراغ لأن مجموع الزوايا 360°.' : 'يبقى فراغ عند كل نقطة التقاء لأن مجموع الزوايا أقل من 360°.'}</p>
  </div>
}
function StepIntro() {
  const goals = findSquareElement('sq-p81-goals')
  const entry = findSquareElement('sq-p81-tile-entry')
  return <div className="sq-stack">
    <Sheet element={goals}>
      <ul className="sq-goal-list">
        <li><span>①</span> تعريف المربّع</li>
        <li><span>②</span> خواصّ المربّع</li>
        <li><span>③</span> رسم المربّع</li>
      </ul>
    </Sheet>
    <Sheet element={entry}>
      <PlatformNote title="شرح إضافي من المنصة — لماذا يغطي البلاط المربّع السطح؟">
        <p>هذه الصورة ليست سؤالاً مطبوعاً؛ نستعملها لتوضيح خاصّة الزوايا القائمة. غيّر نوع البلاطة ولاحظ مجموع الزوايا عند نقطة الالتقاء.</p>
      </PlatformNote>
      <TilingLab />
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 2 — انطلاقة نشطة */
function ShapeSorter({ questionId, matches, title, page }: { questionId: string; matches: (shape: (typeof p81Shapes)[number]) => boolean; title: string; page: number }) {
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked, attempts] = useChecked()
  const expected = p81Shapes.filter(matches).map((shape) => shape.id)
  const ok = sameSet(selected, expected)
  const label = questionId === 'sq-p81-opening-q1' ? 'مستطيلاً تساوى بعداه' : 'معيّناً فيه زاوية قائمة'
  return <div className="sq-task" data-source-id={questionId}>
    <TaskHead title={title} page={page} />
    <ul className="sq-shape-grid">
      {p81Shapes.map((shape) => {
        const isSelected = selected.includes(shape.id)
        const branchId = questionId === 'sq-p81-opening-q1' ? shape.id : `${shape.id}-right`
        return <li key={shape.id} className={`sq-shape-card ${toneClass(checked, isSelected, matches(shape))}`} data-source-id={branchId}>
          <label>
            <input type="checkbox" checked={isSelected} aria-label={`الشكل (${shape.number})`} onChange={() => {
              setChecked(false)
              setSelected((previous) => (isSelected ? previous.filter((id) => id !== shape.id) : [...previous, shape.id]))
            }} />
            <ShapeFigure shape={shape} />
            <span className="sq-shape-caption">الشكل ({shape.number})</span>
          </label>
          <p className="sq-shape-marks">{shape.marks}</p>
          <p className="sq-shape-measure">نسبة الضلعين: <MathExpression>{shape.adjacentRatio}</MathExpression></p>
        </li>
      })}
    </ul>
    <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={selected.length === 0}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint={`ابحث عن الأشكال التي تحقق شرط «${label}» من القياسات المطبوعة تحت كل شكل، لا من ميل الرسم.`}>
      <p>الشكلان <MathExpression>2</MathExpression> و<MathExpression>5</MathExpression> هما الوحيدان اللذان تنطبق عليهما الصفة: زواياهما قائمة وأضلاعهما الأربعة متساوية.</p>
      <ul>{p81Shapes.map((shape) => <li key={shape.id}>{matches(shape) ? '✔' : '✘'} الشكل ({shape.number}): {shape.kind === 'square' ? 'ينطبق' : shape.kind === 'rectangle' ? 'مستطيل غير متساوي البعدين' : shape.kind === 'rhombus' ? 'معيّن بلا زاوية قائمة' : 'لا زاوية قائمة ولا تساوي أضلاع'}</li>)}</ul>
    </Feedback>
  </div>
}
function StepOpening() {
  const figures = findSquareElement('sq-p81-opening-figures')
  const q1 = findSquareElement('sq-p81-opening-q1')
  const q2 = findSquareElement('sq-p81-opening-q2')
  const q3 = findSquareElement('sq-p81-opening-q3')
  const [sameAnswer, setSameAnswer] = useState<'yes' | 'no' | ''>('')
  const [checked, setChecked, attempts] = useChecked()
  return <div className="sq-stack">
    <Sheet element={figures}>
      <p className="sq-inline-hint">الأشكال السبعة مرسومة بأبعادها الحقيقية المقاسة من الصفحة؛ العلامات أسفل كل شكل تصف علامات الرسم المطبوعة.</p>
    </Sheet>
    <ShapeSorter questionId={q1.id} title="السؤال 1: مستطيل تساوى بعداه" page={81} matches={(shape) => shape.kind === 'square'} />
    <ShapeSorter questionId={q2.id} title="السؤال 2: معيّن فيه زاوية قائمة" page={81} matches={(shape) => shape.kind === 'square'} />
    <div className="sq-task" data-source-id={q3.id}>
      <TaskHead title="السؤال 3: هل كانت الإجابة نفسها؟" page={81} />
      <p className="sq-question"><Rich text={q3.prompt} /></p>
      <div className="sq-choice-row">
        {([['yes', 'نعم، الإجابة نفسها'], ['no', 'لا، اختلفت الإجابة']] as const).map(([value, label]) => <label key={value} className={`sq-choice ${toneClass(checked, sameAnswer === value, value === 'yes')}`}>
          <input type="radio" name="sq-opening-q3" checked={sameAnswer === value} onChange={() => { setChecked(false); setSameAnswer(value) }} />
          {label}
        </label>)}
      </div>
      <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={!sameAnswer}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
      <Feedback state={checked ? (sameAnswer === 'yes' ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="الوصفان يعرّفان الشكل نفسه من جهتين: من جهة المستطيل ومن جهة المعيّن.">
        <p>نعم، الإجابة نفسها: الشكلان <MathExpression>(2)</MathExpression> و<MathExpression>(5)</MathExpression>. الوصفان — «مستطيل تساوى بعداه» و«معيّن فيه زاوية قائمة» — تعريفان متكافئان للمربّع.</p>
      </Feedback>
    </div>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 3 — التعريف */
function DefinitionLab() {
  const [width, setWidth] = useState(7)
  const [height, setHeight] = useState(4)
  const [angle, setAngle] = useState(65)
  const rectangleIsSquare = width === height
  const rhombusIsSquare = angle === 90
  const unit = 16
  const w = width * unit; const h = height * unit
  return <div className="sq-lab" data-platform-id="sq-platform-definition-lab">
    <div className="sq-lab-columns">
      <section className="sq-lab-panel">
        <h4><span className="sq-chip">التعريف 1</span> مستطيل تساوى بعداه</h4>
        <label className="sq-slider">الطول <input type="range" min={2} max={8} value={width} onChange={(event) => setWidth(Number(event.target.value))} aria-label="طول المستطيل" /> <output>{width}</output></label>
        <label className="sq-slider">العرض <input type="range" min={2} max={8} value={height} onChange={(event) => setHeight(Number(event.target.value))} aria-label="عرض المستطيل" /> <output>{height}</output></label>
        <svg viewBox="0 0 150 150" className="sq-lab-svg" role="img" aria-label={`مستطيل طوله ${width} وعرضه ${height}`} style={{ direction: 'ltr' }}>
          <rect x={(150 - w) / 2} y={(150 - h) / 2} width={w} height={h} fill={rectangleIsSquare ? 'rgba(47,191,166,.28)' : 'rgba(15,111,116,.12)'} stroke="#0f6f74" strokeWidth="2.4" />
          <text x="75" y="145" textAnchor="middle" fontSize="11" className="sq-lab-text">{rectangleIsSquare ? 'أبعاده متساوية ← مربّع' : 'بعداه مختلفان ← مستطيل فقط'}</text>
        </svg>
      </section>
      <section className="sq-lab-panel">
        <h4><span className="sq-chip">التعريف 2</span> معيّن فيه زاوية قائمة</h4>
        <label className="sq-slider">قياس الزاوية <input type="range" min={45} max={135} step={5} value={angle} onChange={(event) => setAngle(Number(event.target.value))} aria-label="قياس زاوية المعيّن" /> <output>{angle}°</output></label>
        <svg viewBox="0 0 150 150" className="sq-lab-svg" role="img" aria-label={`معيّن زاويته ${angle} درجة`} style={{ direction: 'ltr' }}>
          <polygon points={rhombusPoints(angle)} fill={rhombusIsSquare ? 'rgba(47,191,166,.28)' : 'rgba(242,179,61,.22)'} stroke="#0f6f74" strokeWidth="2.4" />
          <text x="75" y="145" textAnchor="middle" fontSize="11" className="sq-lab-text">{rhombusIsSquare ? 'زاوية قائمة ← مربّع' : 'لا زاوية قائمة ← معيّن فقط'}</text>
        </svg>
      </section>
    </div>
    <p className="sq-lab-verdict">{rectangleIsSquare && rhombusIsSquare ? 'التعريفان يقودان إلى الشكل نفسه: أربعة أضلاع متساوية وأربع زوايا قائمة.' : 'جرّب أن تجعل الطول يساوي العرض، وأن تجعل الزاوية 90°.'}</p>
  </div>
}
function rhombusPoints(angle: number) {
  const rad = (angle / 2) * (Math.PI / 180)
  const side = 52
  const cx = 75; const cy = 66
  const halfW = side * Math.cos(rad)
  const halfH = side * Math.sin(rad)
  return `${cx},${cy - halfH * 1.6} ${cx + halfW * 1.5},${cy} ${cx},${cy + halfH * 1.6} ${cx - halfW * 1.5},${cy}`
}
function StepDefinition() {
  const definition = findSquareElement('sq-p81-definition')
  return <div className="sq-stack">
    <Sheet element={definition}>
      <BlockquoteBlock element={definition} />
      <PlatformNote title="مختبر التعريفين — نشاط من إعداد المنصة">
        <p>حرّك المؤشّرين: متى يتحول المستطيل إلى مربّع؟ ومتى يتحوّل المعيّن إلى مربّع؟ الشرطان ليسا طريقين مختلفين، بل وصفان للشكل الواحد.</p>
      </PlatformNote>
      <DefinitionLab />
    </Sheet>
  </div>
}
function BlockquoteBlock({ element }: { element: SourceElement }) {
  return <ul className="sq-definition-parts">
    <li><span className="sq-chip">أ</span> مستطيل (أربع زوايا قائمة) <strong>+</strong> تساوي البعدين.</li>
    <li><span className="sq-chip">ب</span> معيّن (أربعة أضلاع متساوية) <strong>+</strong> زاوية قائمة واحدة.</li>
    <li className="is-equal"><Compass size={16} aria-hidden="true" /> النتيجة المشتركة: {element.answer}</li>
  </ul>
}

/* ------------------------------------------------------------------ الخطوة 4 — مثال الكتاب */
function StepExample() {
  const example = findSquareElement('sq-p82-example')
  const [definition, setDefinition] = useState<'one' | 'two' | ''>('')
  const [checked, setChecked, attempts] = useChecked()
  return <div className="sq-stack">
    <Sheet element={example}>
      <div className="sq-two">
        <Board label="المربّع ABCD بضلعه 3cm" caption={<><b>ABCD</b> مربّع · <MathExpression>AB = BC = 3cm</MathExpression></>}>
          <svg viewBox="0 0 220 200" className="sq-svg" role="img" aria-label="المربّع ABCD وضلعه AB يساوي 3cm و BC يساوي 3cm وزواياه الأربع قائمة" style={{ direction: 'ltr' }}>
            <rect x="40" y="30" width="120" height="120" fill="rgba(47,191,166,.12)" stroke="#0f6f74" strokeWidth="3" />
            <path d="M40 44 L54 44 L54 30" fill="none" stroke="#b3261e" strokeWidth="2" />
            <path d="M160 44 L146 44 L146 30" fill="none" stroke="#b3261e" strokeWidth="2" />
            <path d="M40 136 L54 136 L54 150" fill="none" stroke="#b3261e" strokeWidth="2" />
            <path d="M160 136 L146 136 L146 150" fill="none" stroke="#b3261e" strokeWidth="2" />
            <text x="100" y="22" textAnchor="middle" fontSize="13" className="sq-lab-text">3cm</text>
            <text x="176" y="96" textAnchor="middle" fontSize="13" className="sq-lab-text">3cm</text>
            <text x="26" y="26" fontSize="15" fill="#b3261e">A</text>
            <text x="168" y="26" fontSize="15" fill="#b3261e">B</text>
            <text x="168" y="166" fontSize="15" fill="#b3261e">C</text>
            <text x="26" y="166" fontSize="15" fill="#b3261e">D</text>
          </svg>
        </Board>
        <div className="sq-stack">
          <ul className="sq-given" aria-label="المعطيات">
            <li><MathExpression>AB = 3cm</MathExpression> و<MathExpression>BC = 3cm</MathExpression></li>
            <li>الزوايا الأربع معلّمة قائمة.</li>
            <li>المطلوب: تبرير أنّه مربّع، وإيجاد <MathExpression>CD</MathExpression> و<MathExpression>DA</MathExpression>.</li>
          </ul>
          <PlatformNote title="شرح إضافي من المنصة">
            <p>التعريفان يعملان معاً: الزوايا القائمة تجعله مستطيلاً، وتساوي الضلعين المتجاورين يجعل بعديه متساويين. ويمكن بدلاً من ذلك أن نرى فيه معيّناً فيه زاوية قائمة.</p>
          </PlatformNote>
        </div>
      </div>
    </Sheet>
    <div className="sq-task">
      <TaskHead title="أيّ تعريف ينطبق على ABCD؟" page={82} />
      <div className="sq-choice-row">
        {([['one', 'مستطيل تساوى بعداه، لأنه مستطيل (زواياه قائمة) وضلعاه المتجاوران 3cm و3cm'], ['two', 'معيّن فيه زاوية قائمة، لأنه متوازي أضلاع أضلاعه متساوية وفيه زاوية قائمة']] as const).map(([value, label]) => <label key={value} className={`sq-choice sq-choice--wide ${toneClass(checked, definition === value, Boolean(definition))}`}>
          <input type="radio" name="sq-example-def" checked={definition === value} onChange={() => { setChecked(false); setDefinition(value) }} />
          <Rich text={label} />
        </label>)}
      </div>
      <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={!definition}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
      <Feedback state={checked ? (definition ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="الشكل يحقق الشرطين معاً؛ كل تعريف صحيح، والسؤال يطلب ربط القياسات بالتعريف.">
        <p>التعريفان يصلحان، لأن الشكل يجمع شرطيهما: <MathExpression>CD = DA = 3cm</MathExpression> أيضاً، والزوايا الأربع قائمة.</p>
        <p>التبرير الكامل: الزوايا القائمة ← مستطيل، و<MathExpression>AB = BC</MathExpression> ← بعداه متساويان ← مربّع. أو: الأضلاع متساوية ← معيّن فيه زاوية قائمة ← مربّع.</p>
      </Feedback>
    </div>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 5 — تحقّق ① */
function Check1Task({ shape }: { shape: (typeof p82Check1Shapes)[number] }) {
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked, attempts] = useChecked()
  const availableIds = shape.id.endsWith('s1')
    ? ['all-sides-equal', 'both-pairs-parallel', 'right-angle', 'one-pair-parallel', 'diagonals-equal']
    : ['two-adjacent-equal', 'four-right-angles', 'one-pair-parallel', 'diagonals-equal']
  const available = availableIds.map((id) => check1Reasons.find((reason) => reason.id === id)!)
  const ok = sameSet(selected, shape.answers)
  return <div className="sq-task" data-source-id={shape.id}>
    <TaskHead title={`${shape.label}: لماذا يمثّل مربّعاً؟`} page={82} />
    <p className="sq-description">{shape.description}</p>
    <ul className="sq-check-list">
      {available.map((reason) => {
        const isSelected = selected.includes(reason.id)
        return <li key={reason.id}><label className={`sq-choice sq-choice--wide ${toneClass(checked, isSelected, shape.answers.includes(reason.id))}`}>
          <input type="checkbox" checked={isSelected} aria-label={reason.text} onChange={() => {
            setChecked(false)
            setSelected((previous) => (isSelected ? previous.filter((id) => id !== reason.id) : [...previous, reason.id]))
          }} />
          <Rich text={reason.text} />
        </label></li>
      })}
    </ul>
    <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={selected.length === 0}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="نحتاج الشرطين معاً: تساوي الأضلاع (أو البعدين) وزاوية قائمة. كل علامة في الرسم تحمل معنى واحداً.">
      <p>{shape.id.endsWith('s1')
        ? 'الشكل (1) معيّن لأن أضلاعه الأربعة متساوية ومتقابلها متوازٍ، وفيه زاوية قائمة؛ إذن يتحقق تعريف «معيّن فيه زاوية قائمة».'
        : 'الشكل (2) مستطيل لأن زواياه الأربع 90°، وبعداه 2.5cm و2.5cm متساويان؛ إذن يتحقق تعريف «مستطيل تساوى بعداه».'}</p>
    </Feedback>
  </div>
}
function StepCheck1() {
  const check = findSquareElement('sq-p82-check1')
  return <div className="sq-stack">
    <Sheet element={check}>
      <div className="sq-two">
        <Board label="الشكل (1): معيّن فيه زاوية قائمة" caption={<>الشكل (1) · معيّن فيه زاوية قائمة</>}>
          <svg viewBox="0 0 180 160" className="sq-svg" role="img" aria-label="معيّن مائل عليه علامات تساوٍ وأسهم توازٍ وزاوية قائمة" style={{ direction: 'ltr' }}>
            <polygon points="90,14 158,66 90,140 22,66" fill="rgba(47,191,166,.14)" stroke="#0f6f74" strokeWidth="2.6" />
            <path d="M74 118 L88 106 L102 118" fill="none" stroke="#b3261e" strokeWidth="2" />
            <line x1="87" y1="30" x2="95" y2="24" stroke="#c07a12" strokeWidth="2" /><line x1="158" y1="58" x2="150" y2="52" stroke="#c07a12" strokeWidth="2" />
            <line x1="84" y1="126" x2="76" y2="120" stroke="#c07a12" strokeWidth="2" /><line x1="60" y1="80" x2="68" y2="74" stroke="#c07a12" strokeWidth="2" />
            <path d="M104 30 l10 0" stroke="#2a6fdc" strokeWidth="2" /><path d="M126 30 l-6 -3 M126 30 l-6 3" stroke="#2a6fdc" strokeWidth="2" />
            <path d="M60 128 l10 0" stroke="#2a6fdc" strokeWidth="2" /><path d="M60 128 l6 -3 M60 128 l6 3" stroke="#2a6fdc" strokeWidth="2" />
          </svg>
        </Board>
        <Board label="الشكل (2): مربّع 2.5cm" caption={<>الشكل (2) · <MathExpression>2.5cm</MathExpression> في كلّ ضلع</>}>
          <svg viewBox="0 0 180 160" className="sq-svg" role="img" aria-label="مربّع طول ضلعه 2.5cm وثلاث زوايا 90 درجة" style={{ direction: 'ltr' }}>
            <rect x="30" y="18" width="110" height="110" fill="rgba(47,191,166,.14)" stroke="#0f6f74" strokeWidth="2.6" />
            <text x="85" y="12" textAnchor="middle" fontSize="12" className="sq-lab-text">2.5cm</text>
            <text x="152" y="78" textAnchor="middle" fontSize="12" className="sq-lab-text">2.5cm</text>
            <text x="44" y="40" fontSize="11" className="sq-lab-text">90°</text>
            <text x="112" y="40" fontSize="11" className="sq-lab-text">90°</text>
            <text x="44" y="122" fontSize="11" className="sq-lab-text">90°</text>
            <path d="M140 128 L128 128 L128 140" fill="none" stroke="#b3261e" strokeWidth="2" />
          </svg>
        </Board>
      </div>
    </Sheet>
    {p82Check1Shapes.map((shape) => <Check1Task key={shape.id} shape={shape} />)}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 6 — تحقّق ② */
function WhyNotTask({ shape }: { shape: (typeof p82WhyNotShapes)[number] }) {
  const [choice, setChoice] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  return <div className="sq-task" data-source-id={shape.id}>
    <TaskHead title={`${shape.label}: لماذا ليس مربّعاً؟`} page={82} />
    <p className="sq-description">{shape.description}</p>
    <div className="sq-choice-col">
      {whyNotReasons.map((reason) => <label key={reason.id} className={`sq-choice ${toneClass(checked, choice === reason.id, reason.id === shape.reason)}`}>
        <input type="radio" name={`why-not-${shape.id}`} checked={choice === reason.id} onChange={() => { setChecked(false); setChoice(reason.id) }} />
        {reason.text}
      </label>)}
    </div>
    <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={!choice}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (choice === shape.reason ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="يكفي أن ينقص شرط واحد من شرطي المربّع. حدّد الشرط الناقص فقط.">
      <p>{whyNotReasons.find((reason) => reason.id === shape.reason)?.text}</p>
    </Feedback>
  </div>
}
function StepCheck2() {
  const check = findSquareElement('sq-p82-check2')
  return <div className="sq-stack">
    <Sheet element={check}>
      <p className="sq-inline-hint">الجدول المطبوع يقارن الشكل بالتعليل. اختر لكل شكل سبباً واحداً يحدّد الشرط الناقص.</p>
    </Sheet>
    {p82WhyNotShapes.map((shape) => <WhyNotTask key={shape.id} shape={shape} />)}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 7 — الخواص */
const PROPERTY_POOL = [
  { id: 'p-opposite-parallel', text: 'كل ضلعين متقابلين متوازيان', inSquare: true },
  { id: 'p-four-sides', text: 'أضلاعه الأربعة متساوية الطول', inSquare: true },
  { id: 'p-four-right', text: 'زواياه الأربع قائمة', inSquare: true },
  { id: 'p-diagonals-perp', text: 'قطراه متعامدان دائماً', inSquare: false },
  { id: 'p-one-pair', text: 'فيه زوج واحد فقط من الأضلاع المتوازية', inSquare: false },
  { id: 'p-two-adjacent', text: 'ضلعان متجاوران فقط متساويان', inSquare: false },
] as const
function PropertiesSorter() {
  const [selection, setSelection] = useState<string[]>([])
  const [checked, setChecked, attempts] = useChecked()
  const expected = PROPERTY_POOL.filter((property) => property.inSquare).map((property) => property.id)
  const ok = sameSet(selection, expected)
  return <div className="sq-task" data-platform-id="sq-platform-properties">
    <TaskHead title="اختر الخواصّ الثلاث المطبوعة للمربّع فقط" page={82} platform />
    <ul className="sq-check-list">
      {PROPERTY_POOL.map((property) => {
        const isSelected = selection.includes(property.id)
        return <li key={property.id}><label className={`sq-choice sq-choice--wide ${toneClass(checked, isSelected, property.inSquare)}`}>
          <input type="checkbox" checked={isSelected} aria-label={property.text} onChange={() => {
            setChecked(false)
            setSelection((previous) => (isSelected ? previous.filter((id) => id !== property.id) : [...previous, property.id]))
          }} />
          {property.text}
        </label></li>
      })}
    </ul>
    <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={selection.length === 0}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="بطاقة ص 82 تعدّ ثلاث خواص فقط، موروثة من متوازي الأضلاع ومن المعيّن ومن المستطيل.">
      <p>الخواصّ الثلاث المطبوعة: توازي المتقابلين، تساوي الأضلاع الأربعة، قائمية الزوايا الأربع. تعامد القطرين خاصّة صحيحة للمربّع لكنها ليست في بطاقة الدرس.</p>
    </Feedback>
  </div>
}
function StepProperties() {
  const properties = findSquareElement('sq-p82-properties')
  return <div className="sq-stack">
    <Sheet element={properties}>
      <ul className="sq-property-list">{p82Properties.map((property) => <li key={property}><span className="sq-prop-mark" aria-hidden="true" /> <Rich text={property} /></li>)}</ul>
      <PlatformNote title="من أين جاءت الخواصّ؟ — شرح إضافي من المنصة">
        <p>التوازي من متوازي الأضلاع، وتساوي الأضلاع من المعيّن، والزوايا القائمة من المستطيل. المربّع يرث الثلاث معاً في وقت واحد.</p>
      </PlatformNote>
      <PropertiesSorter />
    </Sheet>
    <div className="sq-task" data-source-id="sq-p82-oral">
      <TaskHead title="تعبير شفهي: متى يصبح الشكل مربّعاً؟" page={82} />
      <OralTask question={p82OralQuestions[0]} />
      <OralTask question={p82OralQuestions[1]} />
    </div>
  </div>
}
function OralTask({ question }: { question: (typeof p82OralQuestions)[number] }) {
  const options = question.id === 'sq-p82-oral-q1'
    ? ['عندما تتساوى أبعاده', 'عندما تكون فيه زاوية قائمة', 'عندما تتساوى أقطاره']
    : ['عندما تكون فيه زاوية قائمة', 'عندما تتساوى أضلاعه', 'عندما تتساوى أقطاره']
  const [choice, setChoice] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const correct = options[0]
  return <div className="sq-subtask" data-source-id={question.id}>
    <p className="sq-question"><strong>{question.label}:</strong> <Rich text={question.prompt} /></p>
    <div className="sq-choice-col">
      {options.map((option) => <label key={option} className={`sq-choice ${toneClass(checked, choice === option, option === correct)}`}>
        <input type="radio" name={question.id} checked={choice === option} onChange={() => { setChecked(false); setChoice(option) }} />
        {option}
      </label>)}
    </div>
    <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={!choice}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (choice === correct ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="المستطيل يملك الزوايا القائمة مسبقاً، والمعيّن يملك الأضلاع المتساوية مسبقاً؛ أضف الشرط الناقص وحده.">
      <p>{question.answer}</p>
    </Feedback>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 8 — الرسم */
function ConstructionBoard() {
  const [step, setStep] = useState(0)
  const [dc, setDc] = useState('')
  const [angle, setAngle] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const s = 88
  const A = { x: 50, y: 52 }; const B = { x: 50 + s, y: 52 }
  const C = { x: 50 + s, y: 52 + s }; const D = { x: 50, y: 52 + s }
  const ok = parseNumber(dc) === 3 && parseNumber(angle) === 90
  return <div className="sq-task">
    <TaskHead title="رسم المربّع ABCD بالمسطرة والمنقلة أو الكوس" page={83} />
    <div className="sq-construction">
      <div className="sq-construction-board">
        <svg viewBox="0 0 190 170" className="sq-svg" role="img" aria-label={`رسم المربّع ABCD بعد الخطوة ${step + 1}`} style={{ direction: 'ltr' }}>
          {step >= 0 && <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#0f6f74" strokeWidth="3.2" />}
          {step >= 1 && <line x1={B.x} y1={B.y} x2={B.x} y2={B.y + 90} stroke="#2a6fdc" strokeWidth="1.6" strokeDasharray="5 4" />}
          {step >= 2 && <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="#0f6f74" strokeWidth="3.2" />}
          {step >= 3 && <line x1={A.x} y1={A.y} x2={A.x} y2={A.y - 26} stroke="#2a6fdc" strokeWidth="1.6" strokeDasharray="5 4" />}
          {step >= 3 && <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke="#0f6f74" strokeWidth="3.2" />}
          {step >= 4 && <line x1={D.x} y1={D.y} x2={C.x} y2={C.y} stroke="#0f6f74" strokeWidth="3.2" />}
          {step >= 4 && <>
            <path d={`M${D.x} ${D.y - 14} L${D.x + 14} ${D.y - 14} L${D.x + 14} ${D.y}`} fill="none" stroke="#b3261e" strokeWidth="2" />
            <path d={`M${C.x} ${C.y - 14} L${C.x - 14} ${C.y - 14} L${C.x - 14} ${C.y}`} fill="none" stroke="#b3261e" strokeWidth="2" />
          </>}
          {(step === 0 || step >= 4) && <text x={(A.x + B.x) / 2} y={A.y - 8} textAnchor="middle" fontSize="12" className="sq-lab-text">3cm</text>}
          {step >= 2 && step < 4 && <text x={B.x + 8} y={(B.y + C.y) / 2} fontSize="12" className="sq-lab-text">3cm</text>}
          <text x={A.x - 16} y={A.y - 4} fontSize="14" fill="#b3261e">A</text>
          <text x={B.x + 6} y={B.y - 6} fontSize="14" fill="#b3261e">B</text>
          <text x={C.x + 6} y={C.y + 16} fontSize="14" fill="#b3261e">C</text>
          <text x={D.x - 16} y={D.y + 16} fontSize="14" fill="#b3261e">D</text>
        </svg>
        <div className="sq-construction-controls">
          <button type="button" className="sq-icon-button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} aria-label="الخطوة السابقة"><ChevronRight size={16} aria-hidden="true" /></button>
          <span>الخطوة {step + 1} من 5</span>
          <button type="button" className="sq-icon-button" onClick={() => setStep((value) => Math.min(4, value + 1))} disabled={step === 4} aria-label="الخطوة التالية"><ChevronLeft size={16} aria-hidden="true" /></button>
        </div>
      </div>
      <ol className="sq-steps-list">
        {p83Steps.map((item, index) => <li key={item.id} data-source-id={item.id} data-active={index === step || undefined}>
          <button type="button" onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}>
            <span className="sq-step-number">{item.n}</span>
            <span>{item.text}</span>
          </button>
        </li>)}
      </ol>
    </div>
    <div className="sq-verify">
      <p><strong>التحقّق بعد الخطوة الخامسة:</strong> قس بالمسطرة والمنقلة ثم اكتب القيمتين.</p>
      <label>طول <MathExpression>DC</MathExpression> بالسنتيمتر <input className={`sq-input ${checked ? (parseNumber(dc) === 3 ? 'is-right' : 'is-wrong') : ''}`} inputMode="decimal" value={dc} onChange={(event) => { setChecked(false); setDc(event.target.value) }} aria-label="طول DC بالسنتيمتر" /></label>
      <label>قياس الزاوية <MathExpression>D̂</MathExpression> بالدرجات <input className={`sq-input ${checked ? (parseNumber(angle) === 90 ? 'is-right' : 'is-wrong') : ''}`} inputMode="numeric" value={angle} onChange={(event) => { setChecked(false); setAngle(event.target.value) }} aria-label="قياس الزاوية D بالدرجات" /></label>
      <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={!dc.trim() || !angle.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
      <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="في المربّع كل الأضلاع 3cm وكل الزوايا 90°؛ ما كتبه الرسم يُقاس لا يُفترض.">
        <p><MathExpression>DC = DA = AB = BC = 3cm</MathExpression> و <MathExpression>D̂ = Ĉ = B̂ = Â = 90°</MathExpression>. هكذا نتحقّق أن الرسم مربّع فعلاً لا مستطيلاً فقط.</p>
      </Feedback>
    </div>
  </div>
}
function StepConstruction() {
  return <div className="sq-stack">
    <Sheet element={findSquareElement('sq-p83-construction')} quote={false}>
      <p className="sq-quote"><Rich text={findSquareElement('sq-p83-construction').prompt} /></p>
      <PlatformNote title="أداة الرسم خطوة بخطوة — من إعداد المنصة">
        <p>نصوص الخطوات الخمس منقولة من الكتاب. التنقّل بينها ومشاهدة الرسم يُبنى تدريجياً وسيلة عرض من المنصة لتقليل الحمل البصري.</p>
      </PlatformNote>
      <ConstructionBoard />
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 9 — رسم 4cm */
function StepDrawPractice() {
  const element = findSquareElement('sq-p84-check-draw')
  const [values, setValues] = useState<Record<string, string>>({})
  const [rightAngles, setRightAngles] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const sides = ['AB', 'BC', 'CD', 'DA']
  const sidesOk = sides.every((side) => parseNumber(values[side] ?? '') === 4)
  const ok = sidesOk && parseNumber(rightAngles) === 4
  return <div className="sq-stack">
    <Sheet element={element}>
      <PlatformNote title="الرسم على الورق أولاً — من إعداد المنصة">
        <p>ارسم المربّع على دفترك بالأدوات، ثم استعمل هذه البطاقة لتدقيق القياسات. القيم المطلوبة هنا هي الأطوال وعدد الزوايا القائمة، لا الرسم نفسه.</p>
      </PlatformNote>
      <div className="sq-task">
        <TaskHead title="دقّق خطة الرسم: ضلع 4cm واسم ABCD" page={84} />
        <div className="sq-fields">
          {sides.map((side) => <label key={side} className="sq-field"><span><MathExpression>{`${side} =`}</MathExpression></span><input className={`sq-input ${checked ? (parseNumber(values[side] ?? '') === 4 ? 'is-right' : 'is-wrong') : ''}`} inputMode="decimal" value={values[side] ?? ''} onChange={(event) => { setChecked(false); setValues((previous) => ({ ...previous, [side]: event.target.value })) }} aria-label={`طول الضلع ${side} بالسنتيمتر`} /></label>)}
          <label className="sq-field"><span>عدد الزوايا القائمة</span><input className={`sq-input ${checked ? (parseNumber(rightAngles) === 4 ? 'is-right' : 'is-wrong') : ''}`} inputMode="numeric" value={rightAngles} onChange={(event) => { setChecked(false); setRightAngles(event.target.value) }} aria-label="عدد الزوايا القائمة" /></label>
        </div>
        <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={sides.some((side) => !(values[side] ?? '').trim()) || !rightAngles.trim()}><Check size={15} aria-hidden="true" /> تحقّق من الخطة</button></div>
        <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="المربّع ضلعه 4cm، فأضلاعه الأربعة 4cm والزوايا الأربع 90° تساوي أربع زوايا قائمة.">
          <p><MathExpression>AB = BC = CD = DA = 4cm</MathExpression> و <MathExpression>Â = B̂ = Ĉ = D̂ = 90°</MathExpression>؛ أربع زوايا قائمة، والمحيط <MathExpression>4 × 4 = 16cm</MathExpression>.</p>
        </Feedback>
      </div>
      {element.branches?.map((branchItem) => <div className="sq-branch" key={branchItem.id} data-source-id={branchItem.id}>
        <h4>{branchItem.label}</h4>
        <p><Rich text={branchItem.answer} /></p>
        <ul>{branchItem.steps.map((stepText) => <li key={stepText}><Rich text={stepText} /></li>)}</ul>
      </div>)}
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 10 — تدرّب ① */
function StepTrueFalse() {
  const element = findSquareElement('sq-p84-ex1')
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>({})
  const [checked, setChecked, attempts] = useChecked()
  const ok = p84Ex1Statements.every((statement) => answers[statement.id] === statement.truth)
  return <div className="sq-stack">
    <Sheet element={element}>
      <div className="sq-task">
        <TaskHead title="صح أم خطأ؟" page={84} />
        <ul className="sq-tf-list">
          {p84Ex1Statements.map((statement) => <li key={statement.id} data-source-id={statement.id}>
            <p className="sq-question"><strong>{statement.label})</strong> <Rich text={statement.text} /></p>
            <div className="sq-choice-row">
              {([true, false] as const).map((value) => <label key={String(value)} className={`sq-choice ${toneClass(checked, answers[statement.id] === value, value === statement.truth)}`}>
                <input type="radio" name={`sq-tf-${statement.id}`} checked={answers[statement.id] === value} onChange={() => { setChecked(false); setAnswers((previous) => ({ ...previous, [statement.id]: value })) }} />
                {value ? 'صح' : 'خطأ'}
              </label>)}
            </div>
          </li>)}
        </ul>
        <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={p84Ex1Statements.some((statement) => answers[statement.id] === undefined)}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="العلاقة بين المربّع والمستطيل والمعيّن علاقة احتواء في اتجاه واحد: المربّع داخل العائلتين، وليس العكس.">
          <ul>{p84Ex1Statements.map((statement) => <li key={statement.id}>{statement.truth ? '✔ صح' : '✘ خطأ'} — {statement.label}) {statement.text} {statement.truth ? '' : 'المعيّن قد لا يحوي زاوية قائمة.'}</li>)}</ul>
        </Feedback>
      </div>
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 11 — تدرّب ② */
function VertexGrid() {
  const grid = p84Ex2Grid
  const [placed, setPlaced] = useState<{ Z?: { c: number; r: number }; W?: { c: number; r: number } }>({})
  const [checked, setChecked, attempts] = useChecked()
  const ok = placed.Z?.c === grid.Z.c && placed.Z?.r === grid.Z.r && placed.W?.c === grid.W.c && placed.W?.r === grid.W.r
  const points: Array<{ c: number; r: number }> = []
  for (let r = 0; r <= grid.rows; r += 1) for (let c = 0; c <= grid.cols; c += 1) points.push({ c, r })
  const setPoint = (point: { c: number; r: number }) => {
    setChecked(false)
    const takenByZ = placed.Z && placed.Z.c === point.c && placed.Z.r === point.r
    const takenByW = placed.W && placed.W.c === point.c && placed.W.r === point.r
    if (takenByZ) { setPlaced((previous) => ({ ...previous, Z: undefined })); return }
    if (takenByW) { setPlaced((previous) => ({ ...previous, W: undefined })); return }
    if (!placed.Z) setPlaced((previous) => ({ ...previous, Z: point }))
    else if (!placed.W) setPlaced((previous) => ({ ...previous, W: point }))
    else setPlaced({ Z: point })
  }
  const px = (c: number) => 26 + c * 34
  const py = (r: number) => 22 + r * 34
  return <div className="sq-task" data-platform-id="sq-platform-vertex">
    <TaskHead title="عيّن الرأسين Z و W على شبكة النقاط" page={84} platform />
    <p className="sq-inline-hint">انقر أولاً موضع <MathExpression>Z</MathExpression> ثم موضع <MathExpression>W</MathExpression>. <MathExpression>X</MathExpression> أعلى و<MathExpression>Y</MathExpression> أسفل على العمود نفسه.</p>
    <div className="sq-grid-wrap">
      <svg viewBox="0 0 260 190" className="sq-grid-lines" aria-hidden="true" style={{ direction: 'ltr' }}>
        {Array.from({ length: grid.cols + 1 }, (_, c) => <line key={`v-${c}`} x1={px(c)} y1={py(0)} x2={px(c)} y2={py(grid.rows)} stroke="rgba(15,111,116,.10)" strokeWidth="1" />)}
        {Array.from({ length: grid.rows + 1 }, (_, r) => <line key={`h-${r}`} x1={px(0)} y1={py(r)} x2={px(grid.cols)} y2={py(r)} stroke="rgba(15,111,116,.10)" strokeWidth="1" />)}
        <line x1={px(grid.X.c)} y1={py(grid.X.r)} x2={px(grid.Y.c)} y2={py(grid.Y.r)} stroke="#2fbfa6" strokeWidth="4" />
        {placed.Z && placed.W && Math.abs(placed.Z.c - grid.X.c) === Math.abs(placed.W.c - grid.X.c)
          ? <polygon points={`${px(grid.X.c)},${py(grid.X.r)} ${px(grid.Y.c)},${py(grid.Y.r)} ${px(placed.Z.c)},${py(placed.Z.r)} ${px(placed.W.c)},${py(placed.W.r)}`} fill="rgba(47,191,166,.18)" stroke="#2fbfa6" strokeWidth="2" />
          : null}
      </svg>
      {points.map((point) => {
        const isX = point.c === grid.X.c && point.r === grid.X.r
        const isY = point.c === grid.Y.c && point.r === grid.Y.r
        const z = placed.Z?.c === point.c && placed.Z?.r === point.r
        const w = placed.W?.c === point.c && placed.W?.r === point.r
        return <button
          key={`${point.c}-${point.r}`}
          type="button"
          className={`sq-grid-node ${z ? 'is-z' : ''} ${w ? 'is-w' : ''} ${isX || isY ? 'is-fixed' : ''}`}
          style={{ insetInlineStart: `${((px(point.c) - 12) / 260) * 100}%`, top: `${((py(point.r) - 12) / 190) * 100}%` }}
          onClick={() => setPoint(point)}
          disabled={isX || isY}
          aria-label={`النقطة (${point.c}, ${point.r})`}
        >{z ? 'Z' : w ? 'W' : isX ? 'X' : isY ? 'Y' : ''}</button>
      })}
    </div>
    <div className="sq-actions">
      <button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={!placed.Z || !placed.W}><Check size={15} aria-hidden="true" /> تحقّق من موقع W</button>
      <button type="button" className="sq-button is-ghost" onClick={() => { setPlaced({}); setChecked(false) }}><RotateCcw size={15} aria-hidden="true" /> أعد المحاولة</button>
    </div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="الترتيب X ← Y ← Z ← W: [YZ] عمودي على [XY] ويساويه، و[WX] عمودي عليه من X ويساويه أيضاً. النقطتان في الجهة نفسها من [XY].">
      <p><MathExpression>Z</MathExpression> على العمود من <MathExpression>Y</MathExpression> و<MathExpression>W</MathExpression> على العمود من <MathExpression>X</MathExpression>، في الجهة نفسها، بالطول <MathExpression>XY</MathExpression> نفسه. عندها <MathExpression>XY = YZ = ZW = WX</MathExpression> والزوايا الأربع قائمة.</p>
    </Feedback>
  </div>
}
function StepFourthVertex() {
  const element = findSquareElement('sq-p84-ex2')
  return <div className="sq-stack">
    <Sheet element={element}>
      <PlatformNote title="ملاحظة على الرسم المطبوع">
        <p>{element.note}</p>
      </PlatformNote>
      <VertexGrid />
      {element.branches?.map((branchItem) => <div className="sq-branch" key={branchItem.id} data-source-id={branchItem.id}>
        <h4>{branchItem.label}</h4>
        <p><Rich text={branchItem.answer} /></p>
      </div>)}
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 12 — تدرّب ③ */
function NamingCase({ item }: { item: (typeof p84Ex3Cases)[number] }) {
  const [names, setNames] = useState<string[]>([])
  const [feature, setFeature] = useState('')
  const [checked, setCheckedFlex, attempts] = useChecked()
  const features = [
    { id: 'f-square', text: item.feature },
    { id: 'f-generic', text: 'صفة مميزة مقترحة: الشكل له أربعة أضلاع فقط.' },
  ]
  const ok = sameSet(names, item.answer) && feature === 'f-square'
  return <div className="sq-task" data-source-id={item.id}>
    <TaskHead title={`الحالة ${item.label}: ${item.prompt}`} page={84} />
    <ul className="sq-check-list">
      {item.names.map((name) => {
        const isSelected = names.includes(name)
        return <li key={name}><label className={`sq-choice ${toneClass(checked, isSelected, item.answer.includes(name))}`}>
          <input type="checkbox" checked={isSelected} aria-label={name} onChange={() => {
            setCheckedFlex(false)
            setNames((previous) => (isSelected ? previous.filter((value) => value !== name) : [...previous, name]))
          }} />
          {name}
        </label></li>
      })}
    </ul>
    <p className="sq-inline-hint">أضف صفة تميّز أحد الأشكال التي اخترتها:</p>
    <div className="sq-choice-col">
      {features.map((option) => <label key={option.id} className={`sq-choice sq-choice--wide ${toneClass(checked, feature === option.id, option.id === 'f-square')}`}>
        <input type="radio" name={`feature-${item.id}`} checked={feature === option.id} onChange={() => { setCheckedFlex(false); setFeature(option.id) }} />
        <Rich text={option.text} />
      </label>)}
    </div>
    <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setCheckedFlex(true)} disabled={names.length === 0 || !feature}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="ابحث عن كل أفراد العائلة التي تحقق الصفة، ثم اختر صفة تفرّد أحدها عمّا بقي.">
      <p>{item.answer.join('، ')}.</p>
      <p>{item.feature}</p>
    </Feedback>
  </div>
}
function StepNaming() {
  const element = findSquareElement('sq-p84-ex3')
  return <div className="sq-stack">
    <Sheet element={element}>
      <p className="sq-inline-hint">الصفات الثلاث المطبوعة تصف أكثر من شكل. اختر كل الأسماء المطابقة، ثم أضف صفة تميّز أحدها.</p>
    </Sheet>
    {p84Ex3Cases.map((item) => <NamingCase key={item.id} item={item} />)}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 13 — تدرّب ④ */
function CompositeSquareFigure() {
  const s = 26
  const X = { x: 44, y: 108 }; const W = { x: 44 + 2 * s, y: 108 }; const S = { x: 44 + 7 * s, y: 108 }
  const P = { x: 44, y: 108 + 2 * s }; const Q = { x: 44 + 2 * s, y: 108 + 2 * s }; const R = { x: 44 + 7 * s, y: 108 + 2 * s }
  const V = { x: W.x, y: 108 - 3 * s }; const U = { x: W.x + 3 * s, y: 108 - 3 * s }; const T = { x: W.x + 3 * s, y: 108 }
  const right = (point: { x: number; y: number }, dx: number, dy: number) => `M ${point.x + dx} ${point.y} L ${point.x + dx} ${point.y + dy} L ${point.x} ${point.y + dy}`
  return <svg viewBox="0 0 262 190" className="sq-svg" role="img" aria-label="مربّع WVUT أعلى، وتحته مربّع XWQP ضلعه 2cm ومستطيل WSRQ عرضه QR يساوي 5cm وWT يساوي 3cm" style={{ direction: 'ltr' }}>
    <polygon points={`${X.x},${X.y} ${W.x},${W.y} ${Q.x},${Q.y} ${P.x},${P.y}`} fill="rgba(47,191,166,.16)" stroke="#0f6f74" strokeWidth="2.4" />
    <polygon points={`${W.x},${W.y} ${S.x},${S.y} ${R.x},${R.y} ${Q.x},${Q.y}`} fill="rgba(42,111,220,.10)" stroke="#0f6f74" strokeWidth="2.4" />
    <polygon points={`${W.x},${W.y} ${V.x},${V.y} ${U.x},${U.y} ${T.x},${T.y}`} fill="rgba(242,179,61,.16)" stroke="#0f6f74" strokeWidth="2.4" />
    <path d={right(W, 12, 12)} fill="none" stroke="#b3261e" strokeWidth="1.8" />
    <path d={right(S, -12, 12)} fill="none" stroke="#b3261e" strokeWidth="1.8" />
    <path d={right(V, 12, 12)} fill="none" stroke="#b3261e" strokeWidth="1.8" />
    <path d={right(U, -12, 12)} fill="none" stroke="#b3261e" strokeWidth="1.8" />
    <text x={X.x - 14} y={X.y + 5} fontSize="13" fill="#b3261e">X</text>
    <text x={W.x - 16} y={W.y - 6} fontSize="13" fill="#b3261e">W</text>
    <text x={S.x + 5} y={S.y - 6} fontSize="13" fill="#b3261e">S</text>
    <text x={P.x - 14} y={P.y + 5} fontSize="13" fill="#b3261e">P</text>
    <text x={Q.x - 4} y={Q.y + 16} fontSize="13" fill="#b3261e">Q</text>
    <text x={R.x + 4} y={R.y + 16} fontSize="13" fill="#b3261e">R</text>
    <text x={V.x - 14} y={V.y + 5} fontSize="13" fill="#b3261e">V</text>
    <text x={U.x + 5} y={U.y + 5} fontSize="13" fill="#b3261e">U</text>
    <text x={T.x + 5} y={T.y + 18} fontSize="13" fill="#b3261e">T</text>
    <text x={X.x - 8} y={X.y + s} fontSize="11" textAnchor="end" className="sq-lab-text">2cm</text>
    <text x={W.x + (5 * s) / 2} y={R.y + 18} fontSize="11" textAnchor="middle" className="sq-lab-text">QR = 5cm</text>
    <text x={W.x + (3 * s) / 2} y={W.y - 12} fontSize="11" textAnchor="middle" className="sq-lab-text">WT = 3cm</text>
  </svg>
}
function CompositeSquareTask() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked, attempts] = useChecked()
  const results = p84Ex4Lengths.map((item) => ({ ...item, ok: parseNumber(values[item.id] ?? '') === item.answer }))
  const ok = results.every((item) => item.ok)
  const explanations: Record<string, ReactNode> = {
    'sq-p84-ex4-rs': <><MathExpression>RS = WQ = XP = 2cm</MathExpression> لأن أضلاع المربّع <MathExpression>XWQP</MathExpression> متساوية و<MathExpression>RS</MathExpression> يقابل <MathExpression>WQ</MathExpression>.</>,
    'sq-p84-ex4-ts': <><MathExpression>WS = QR = 5cm</MathExpression>، و<MathExpression>TS = WS − WT = 5 − 3 = 2cm</MathExpression>.</>,
    'sq-p84-ex4-xs': <><MathExpression>XS = XW + WS = 2 + 5 = 7cm</MathExpression> لأن <MathExpression>X</MathExpression> و<MathExpression>W</MathExpression> و<MathExpression>S</MathExpression> على استقامة واحدة.</>,
  }
  return <div className="sq-task">
    <TaskHead title="احسب الأطوال الثلاثة بالسنتيمتر" page={84} />
    <div className="sq-fields">
      {results.map((item) => <label key={item.id} className="sq-field" data-source-id={item.id}><span><MathExpression>{`${item.label} =`}</MathExpression></span><input className={`sq-input ${checked ? (item.ok ? 'is-right' : 'is-wrong') : ''}`} inputMode="decimal" value={values[item.id] ?? ''} onChange={(event) => { setChecked(false); setValues((previous) => ({ ...previous, [item.id]: event.target.value })) }} aria-label={`طول ${item.label} بالسنتيمتر`} /></label>)}
    </div>
    <div className="sq-actions"><button type="button" className="sq-button" onClick={() => setChecked(true)} disabled={results.some((item) => !(values[item.id] ?? '').trim())}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="استبدل كل طول مجهول بالضلع المقابل له في الشكل نفسه، ثم اجمع أو اطرح على الخط الأفقي.">
      <ul>{results.map((item) => <li key={item.id}>{item.ok ? '✔' : '✘'} <MathExpression>{item.label}</MathExpression>: {explanations[item.id]}</li>)}</ul>
      <p>تحقق: <MathExpression>TS + WT = 2 + 3 = 5 = WS</MathExpression> ✔ و <MathExpression>XS − XW = 7 − 2 = 5 = WS</MathExpression> ✔</p>
    </Feedback>
  </div>
}
function StepComposite() {
  const element = findSquareElement('sq-p84-ex4')
  return <div className="sq-stack">
    <Sheet element={element}>
      <div className="sq-two">
        <Board caption={<><b>WVUT</b> مربّع · <b>XWQP</b> مربّع · <b>WSRQ</b> مستطيل</>} label="الشكل المركّب من مربّعين ومستطيل">
          <CompositeSquareFigure />
        </Board>
        <div className="sq-stack">
          <ul className="sq-given" aria-label="المعطيات">
            <li><MathExpression>XP = 2cm</MathExpression></li>
            <li><MathExpression>QR = 5cm</MathExpression></li>
            <li><MathExpression>WT = 3cm</MathExpression></li>
          </ul>
          <PlatformNote title="طريقة التفكير — شرح إضافي من المنصة">
            <p>كل طول مجهول نستبدله بالضلع المقابل في شكله: مربّع <MathExpression>XWQP</MathExpression> يعطي <MathExpression>XW = WQ = 2cm</MathExpression>، ومستطيل <MathExpression>WSRQ</MathExpression> يعطي <MathExpression>WS = QR = 5cm</MathExpression> و<MathExpression>RS = WQ</MathExpression>.</p>
          </PlatformNote>
        </div>
      </div>
      <CompositeSquareTask />
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 14 — الخلاصة */
function StepSummary() {
  return <div className="sq-stack">
    <ul className="sq-summary" data-platform-id="sq-platform-summary">
      <li><strong>التعريف · ص 81</strong><span>مستطيل تساوى بعداه، أو معيّن فيه زاوية قائمة. تعريفان متكافئان.</span></li>
      <li><strong>الخواصّ · ص 82</strong><span>توازي المتقابلين، وتساوي الأضلاع الأربعة، وقائمية الزوايا الأربع.</span></li>
      <li><strong>الرسم · ص 83</strong><span>الضلع بالمسطرة ← عمودان بالمنقلة أو الكوس ← الطول نفسه على العمودين ← وصل وتحقق.</span></li>
      <li><strong>التطبيق · ص 84</strong><span>رسم 4cm، صح/خطأ، الرأسان <MathExpression>Z</MathExpression> و<MathExpression>W</MathExpression>، ثلاثة أوصاف، وأطوال في شكل مركّب.</span></li>
    </ul>
    <PlatformNote title="ما الذي أضافته المنصة؟">
      <ul>
        <li>مبلّط البلاط، مختبر التعريفين، فرز الخواصّ، أداة الرسم التدريجية، وشبكة <MathExpression>Z</MathExpression> و<MathExpression>W</MathExpression>: أنشطة من إعداد المنصة ومعلّمة بشارة خاصّة.</li>
        <li>كل نصوص الأسئلة والأمثلة وخطوات الرسم منقولة من الكتاب ص 81–84، ورقم الصفحة على كل بطاقة.</li>
      </ul>
    </PlatformNote>
    <div className="sq-task">
      <TaskHead title="اختبار الدرس المستقل" platform />
      <p>عشرون سؤالاً جديداً متدرّجة (6 أساسي · 7 متوسط · 4 متقدّم · 3 تفكير). لا تظهر أي إجابة أثناء المحاولة؛ تُعرض النتيجة والحلول بعد التسليم فقط.</p>
      <div className="sq-actions">
        <a className="sq-test-link" href="#tests/run/lesson-square-test"><Sparkles size={17} aria-hidden="true" /> ابدأ اختبار الدرس</a>
        <a className="sq-test-link is-secondary" href="#tests/run/unit-unit-2-test"><Grid3x3 size={17} aria-hidden="true" /> اختبار الوحدة الثانية</a>
      </div>
    </div>
    <div className="sq-task" data-platform-id="sq-platform-test-note">
      <TaskHead title="كيف يُصحَّح اختبار الدرس؟" platform />
      <ul className="sq-summary-list">
        <li><CircleCheck size={15} aria-hidden="true" /> الإجابة الصحيحة تُحتسب نقطة كاملة، والخطأ لا يُخصم منه شيء.</li>
        <li><CircleX size={15} aria-hidden="true" /> السؤال المتروك يُحتسب «غير مجاب» في النتيجة النهائية، لا خطأ.</li>
        <li><Ruler size={15} aria-hidden="true" /> النسبة المئوية = عدد الإجابات الصحيحة ÷ 20 × 100، والحلول تظهر بعد التسليم فقط.</li>
        <li><PencilRuler size={15} aria-hidden="true" /> يمكنك إعادة المحاولة من صفحة النتيجة لتحسين مستواك.</li>
      </ul>
    </div>
  </div>
}

/* =============================================================================================
   الدرس
   ============================================================================================= */
export function SquareLesson() {
  const [activeStep, setActiveStep] = useState(0)
  const steps: LessonStep[] = useMemo(() => [
    { id: 'sq-intro', title: 'المربّع: لماذا هذا الشكل؟', content: <StepIntro /> },
    { id: 'sq-opening', title: 'انطلاقة نشطة: سبعة أشكال', content: <StepOpening /> },
    { id: 'sq-definition', title: 'تعريف المربّع', content: <StepDefinition /> },
    { id: 'sq-example', title: 'مثال الكتاب: ABCD', content: <StepExample /> },
    { id: 'sq-check1', title: 'لماذا هو مربّع؟', content: <StepCheck1 /> },
    { id: 'sq-check2', title: 'لماذا ليس مربّعاً؟', content: <StepCheck2 /> },
    { id: 'sq-properties', title: 'خواصّ المربّع', content: <StepProperties /> },
    { id: 'sq-construction', title: 'رسم مربّع ضلعه 3cm', content: <StepConstruction /> },
    { id: 'sq-draw-practice', title: 'ارسم مربّعاً ضلعه 4cm', content: <StepDrawPractice /> },
    { id: 'sq-true-false', title: 'تدرّب ①: صح أم خطأ', content: <StepTrueFalse /> },
    { id: 'sq-fourth-vertex', title: 'تدرّب ②: الرأسان Z و W', content: <StepFourthVertex /> },
    { id: 'sq-naming', title: 'تدرّب ③: أسماء الأشكال', content: <StepNaming /> },
    { id: 'sq-composite', title: 'تدرّب ④: أطوال مركّبة', content: <StepComposite /> },
    { id: 'sq-summary', title: 'الخلاصة والاختبار', content: <StepSummary /> },
  ], [])
  return <LessonShell title={lessonTitle} steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-square" />
}

export const squareStepCount = 14
export const squareStepIds = ['sq-intro', 'sq-opening', 'sq-definition', 'sq-example', 'sq-check1', 'sq-check2', 'sq-properties', 'sq-construction', 'sq-draw-practice', 'sq-true-false', 'sq-fourth-vertex', 'sq-naming', 'sq-composite', 'sq-summary'] as const
