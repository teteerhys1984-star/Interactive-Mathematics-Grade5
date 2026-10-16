import { useState, type ReactNode } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowUp, Check, CircleAlert, Lightbulb, RotateCcw,
  Ruler, Sparkles, Target,
} from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import {
  fractionsOneBookElementById,
  fractionsOneQuestionGroups,
  fractionsOneVisualInventory,
  fractionsOneLessonId,
  type FractionsOneBookElement,
  type FractionsBookResponse,
  type FractionsVisual,
} from './fractionsOneData'

const elementById = fractionsOneBookElementById
const visualById = new Map(fractionsOneVisualInventory.map((visual) => [visual.id, visual]))
const groupById = new Map(fractionsOneQuestionGroups.map((group) => [group.id, group]))

export interface FractionPair { numerator: number; denominator: number }
export interface FractionComparison {
  commonDenominator: number
  left: FractionPair
  right: FractionPair
  relation: '<' | '>' | '='
}

/** Exact, integer-only comparison used by the student lab and independently exercised by the audit. */
export function compareFractionPairs(left: FractionPair, right: FractionPair): FractionComparison | undefined {
  if (![left.numerator, left.denominator, right.numerator, right.denominator].every(Number.isSafeInteger)) return undefined
  if (left.numerator < 0 || right.numerator < 0 || left.denominator <= 0 || right.denominator <= 0) return undefined
  const commonDenominator = leastCommonMultiple(left.denominator, right.denominator)
  if (!Number.isSafeInteger(commonDenominator) || commonDenominator <= 0) return undefined
  const leftNumerator = BigInt(left.numerator) * BigInt(commonDenominator / left.denominator)
  const rightNumerator = BigInt(right.numerator) * BigInt(commonDenominator / right.denominator)
  if (leftNumerator > BigInt(Number.MAX_SAFE_INTEGER) || rightNumerator > BigInt(Number.MAX_SAFE_INTEGER)) return undefined
  return {
    commonDenominator,
    left: { numerator: Number(leftNumerator), denominator: commonDenominator },
    right: { numerator: Number(rightNumerator), denominator: commonDenominator },
    relation: leftNumerator < rightNumerator ? '<' : leftNumerator > rightNumerator ? '>' : '=',
  }
}

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.abs(left)
  let b = Math.abs(right)
  while (b !== 0) [a, b] = [b, a % b]
  return a
}
function leastCommonMultiple(left: number, right: number): number {
  if (!Number.isSafeInteger(left) || !Number.isSafeInteger(right) || left <= 0 || right <= 0) return 0
  return (left / greatestCommonDivisor(left, right)) * right
}
function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/gu, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/gu, (digit) => String(digit.charCodeAt(0) - 0x06f0))
}
function parseSafeInteger(value: string, maximum = 1_000_000): number | undefined {
  const normalized = normalizeDigits(value).trim()
  if (!/^\d+$/u.test(normalized)) return undefined
  const number = Number(normalized)
  return Number.isSafeInteger(number) && number <= maximum ? number : undefined
}
function parseFractionText(value: string): FractionPair | undefined {
  const match = /^\s*([٠-٩۰-۹\d]+)\s*\/\s*([٠-٩۰-۹\d]+)\s*$/u.exec(value)
  if (!match) return undefined
  const numerator = parseSafeInteger(match[1])
  const denominator = parseSafeInteger(match[2])
  if (numerator === undefined || denominator === undefined || denominator === 0) return undefined
  return { numerator, denominator }
}
function formatFraction(value: FractionPair): string { return `${value.numerator}/${value.denominator}` }

const MATH_TEXT_PATTERN = /(\d+(?:\s*\/\s*\d+)?(?:\s*(?:[=<>×÷+−-])\s*\d+(?:\s*\/\s*\d+)?)*)/gu
const MATH_TEXT_ONLY_PATTERN = /^\d+(?:\s*\/\s*\d+)?(?:\s*(?:[=<>×÷+−-])\s*\d+(?:\s*\/\s*\d+)?)*$/u
const SINGLE_FRACTION_PATTERN = /^(\d+)\s*\/\s*(\d+)$/u

/** Arabic prose remains RTL; each fraction or linked calculation is isolated LTR. */
function FractionText({ text }: { text: string }) {
  const pieces = text.split(MATH_TEXT_PATTERN)
  return <span dir="rtl">{pieces.map((piece, index) => {
    if (!piece) return null
    if (MATH_TEXT_ONLY_PATTERN.test(piece)) {
      const fraction = SINGLE_FRACTION_PATTERN.exec(piece.trim())
      if (fraction) return <FractionGlyph key={index} numerator={fraction[1]} denominator={fraction[2]} />
      return <MathExpression key={index}>{piece}</MathExpression>
    }
    return <BidiText key={index}>{piece}</BidiText>
  })}</span>
}

function FractionGlyph({ numerator, denominator, label }: { numerator: string | number; denominator: string | number; label?: string }) {
  return <span className="l12-fraction-glyph" dir="ltr" role="img" aria-label={label ?? `${numerator} على ${denominator}`}>
    <span>{numerator}</span><span className="l12-fraction-rule" aria-hidden="true" /><span>{denominator}</span>
  </span>
}

function SourceElementCard({ id }: { id: string }) {
  const element = elementById.get(id)
  if (!element) return null
  return <div className="l12-book-element" data-source-id={element.id}>
    <SourceCard label={`من الكتاب · ص ${element.page} · ${element.section}`}>
      <h3 className="l12-book-title">{element.title}</h3>
      <p className="l12-book-prompt"><FractionText text={element.prompt} /></p>
      <SourceVisuals ids={element.visualAssetIds} />
      <div className="l12-platform-explanation">
        <p className="l12-platform-label"><Lightbulb size={16} aria-hidden="true" /> شرح المنصة — إضافة تعليمية</p>
        <ol>{element.reasoning.map((line, index) => <li key={`${element.id}-step-${index}`}><FractionText text={line} /></li>)}</ol>
        <p className="l12-answer-line"><strong>الخلاصة:</strong> <FractionText text={element.answer} /></p>
        <p className="l12-verify-line"><Check size={15} aria-hidden="true" /><span><strong>تحقّق:</strong> <FractionText text={element.verification} /></span></p>
        <p className="l12-pitfall-line"><CircleAlert size={15} aria-hidden="true" /><span><strong>انتبه:</strong> <FractionText text={element.pitfall} /></span></p>
      </div>
    </SourceCard>
  </div>
}

function SourceVisuals({ ids }: { ids: readonly string[] }) {
  if (!ids.length) return null
  const firstVisual = visualById.get(ids[0])
  const leftToRight = Boolean(firstVisual && (firstVisual.page === 56 || firstVisual.id.includes('-model-')))
  return <div className="l12-visual-rail" dir={leftToRight ? 'ltr' : 'rtl'}>{ids.map((id) => {
    const visual = visualById.get(id)
    if (!visual) return null
    return visual.kind === 'pie'
      ? <PieVisual key={visual.id} visual={visual} />
      : <EquivalenceVisual key={visual.id} visual={visual} />
  })}</div>
}

function polarPoint(angle: number, radius: number): [number, number] {
  const radians = (angle * Math.PI) / 180
  return [50 + radius * Math.cos(radians), 50 + radius * Math.sin(radians)]
}
function wedgePath(start: number, end: number, radius = 42): string {
  const [x1, y1] = polarPoint(start, radius)
  const [x2, y2] = polarPoint(end, radius)
  const largeArc = end - start > 180 ? 1 : 0
  return `M 50 50 L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`
}
function PieVisual({ visual }: { visual: Extract<FractionsVisual, { kind: 'pie' }> }) {
  const wedges = visual.unpartitioned
    ? [{ start: visual.startAngle, end: visual.startAngle + (360 * visual.numerator) / visual.denominator, shaded: true }]
    : Array.from({ length: visual.segments }, (_, index) => {
        const start = visual.startAngle + (360 * index) / visual.segments
        const end = visual.startAngle + (360 * (index + 1)) / visual.segments
        const offset = (index - visual.shadeStart + visual.segments) % visual.segments
        return { start, end, shaded: offset < visual.shadedSegments }
      })
  return <figure className="l12-visual-card l12-pie-card" data-source-visual={visual.id}>
    <svg className="l12-pie-svg" viewBox="0 0 100 100" role="img" aria-label={`${visual.title}: ${visual.description}`}>
      {wedges.map((wedge, index) => <path key={`wedge-${index}`} d={wedgePath(wedge.start, wedge.end)} className={wedge.shaded ? 'is-shaded' : 'is-clear'} />)}
      {!visual.unpartitioned && Array.from({ length: visual.segments }, (_, index) => {
        const [x, y] = polarPoint(visual.startAngle + (360 * index) / visual.segments, 42)
        return <line key={`spoke-${index}`} x1="50" y1="50" x2={x} y2={y} className="l12-pie-spoke" />
      })}
      <circle cx="50" cy="50" r="42" className="l12-pie-outline" />
    </svg>
    <figcaption dir="rtl"><strong>{visual.title}</strong><span><FractionGlyph numerator={visual.numerator} denominator={visual.denominator} /> <small>الأجزاء المظللة من الكل</small></span></figcaption>
  </figure>
}
function EquivalenceVisual({ visual }: { visual: Extract<FractionsVisual, { kind: 'equivalence' }> }) {
  const expandedNumerator = visual.numerator * visual.factor
  const expandedDenominator = visual.denominator * visual.factor
  return <figure className="l12-visual-card l12-equivalence-card" data-source-visual={visual.id}>
    <div className="l12-equivalence-formula" dir="ltr" aria-label={visual.description}>
      <FractionGlyph numerator={visual.numerator} denominator={visual.denominator} />
      <MathExpression>=</MathExpression>
      <span className="l12-product-fraction"><span>({visual.numerator} × {visual.factor})</span><span className="l12-fraction-rule" /><span>({visual.denominator} × {visual.factor})</span></span>
      <MathExpression>=</MathExpression>
      <FractionGlyph numerator={expandedNumerator} denominator={expandedDenominator} />
    </div>
    <figcaption dir="rtl"><strong>{visual.title}</strong><small>{visual.description}</small></figcaption>
  </figure>
}

function QuestionGroup({ groupId }: { groupId: string }) {
  const group = groupById.get(groupId)
  if (!group) return null
  const instruction = group.instructionId ? elementById.get(group.instructionId) : undefined
  const tasks = group.taskIds.map((id) => elementById.get(id)).filter((task): task is FractionsOneBookElement => Boolean(task))
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [checked, setChecked] = useState(false)
  const update = (id: string, value: string | string[]) => {
    setAnswers((previous) => ({ ...previous, [id]: value }))
    setChecked(false)
  }
  const outcomes = checked ? tasks.map((task) => getTaskOutcome(task, answers[task.id])) : []
  const complete = checked && outcomes.every((outcome) => outcome === 'correct' || outcome === 'open')

  return <section className="l12-question-group" data-source-group={group.id} aria-labelledby={`${group.id}-heading`}>
    <div className="l12-question-heading"><span className="l12-source-tag">الكتاب · ص {group.page}</span><h3 id={`${group.id}-heading`}>{group.title}</h3></div>
    {instruction && <p className="l12-group-prompt" data-source-id={instruction.id}><FractionText text={instruction.prompt} /></p>}
    {tasks.map((task) => <BookTaskRow key={task.id} task={task} checked={checked} value={answers[task.id]} onChange={(value) => update(task.id, value)} />)}
    {tasks.length > 0 && <>
      <button type="button" className="l12-check-button" onClick={() => setChecked(true)}><Check size={17} aria-hidden="true" /> تحقّق من إجابات هذه المجموعة</button>
      {checked && <p className={`l12-group-feedback ${complete ? 'is-correct' : 'is-hint'}`} role="status">
        {complete
          ? 'تمت مراجعة إجاباتك. افتح «طريقة الحل» تحت أي بند لمراجعة خطواته كاملة.'
          : 'لم تكتمل المجموعة بعد؛ راجع الملاحظة أسفل كل بند، وتأكد من المقام المشترك أو عدد الأجزاء.'}
      </p>}
    </>}
  </section>
}

function BookTaskRow({ task, checked, value, onChange }: {
  task: FractionsOneBookElement
  checked: boolean
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
}) {
  const response = task.response
  const outcome = checked ? getTaskOutcome(task, value) : undefined
  const stringValue = typeof value === 'string' ? value : ''
  const parts = stringValue.split('/')
  const invalidZeroDenominator = response?.kind === 'fraction' && parts.length === 2 && parseSafeInteger(parts[1]) === 0
  const renderedPrompt = task.sourceText ? `${task.prompt} ${task.sourceText}` : task.prompt
  return <article className="l12-task-row" data-source-id={task.id}>
    <div className="l12-task-source">
      {task.branch && <span className="l12-task-branch">{task.branch}</span>}
      <div><strong>{task.title}</strong><p><FractionText text={renderedPrompt} /></p></div>
    </div>
    <SourceVisuals ids={task.visualAssetIds} />
    <div className="l12-task-control">{response ? renderResponseControl(task, response, value, onChange) : <p>راجع التعليمات المطبوعة أعلى المجموعة.</p>}</div>
    {invalidZeroDenominator && <p className="l12-input-error" role="alert">لا يمكن أن يكون المقام صفراً؛ أدخل مقاماً موجباً.</p>}
    {checked && outcome && <>
      <p className={`l12-task-feedback ${outcome === 'correct' || outcome === 'open' ? 'is-correct' : 'is-hint'}`} role="status">
        {outcome === 'correct' && <><Check size={15} aria-hidden="true" /> إجابة صحيحة. {task.verification}</>}
        {outcome === 'incorrect' && <><CircleAlert size={15} aria-hidden="true" /> راجع الطريقة: {task.rule}</>}
        {outcome === 'incomplete' && <><Lightbulb size={15} aria-hidden="true" /> أكمل المدخلات أولاً؛ {response?.kind === 'fraction' ? 'اكتب البسط والمقام، واجعل المقام موجباً.' : 'أدخل إجابة قبل التحقق.'}</>}
        {outcome === 'open' && <><Lightbulb size={15} aria-hidden="true" /> سُجّل تفسيرك؛ قارنه بمعايير الإجابة الكاملة في «طريقة الحل».</>}
      </p>
      <details className="l12-solution-disclosure">
        <summary>بعد المحاولة: اكشف طريقة الحل</summary>
        <div className="l12-solution-content"><ol>{task.reasoning.map((line, index) => <li key={`${task.id}-solution-${index}`}><FractionText text={line} /></li>)}</ol><p><strong>الإجابة:</strong> <FractionText text={task.answer} /></p></div>
      </details>
    </>}
  </article>
}

function renderResponseControl(
  task: FractionsOneBookElement,
  response: FractionsBookResponse,
  value: string | string[] | undefined,
  onChange: (value: string | string[]) => void,
): ReactNode {
  const answerId = `${task.id}-answer`
  if (response.kind === 'relation') return <label className="l12-control-label" htmlFor={answerId}>
    اختر رمز المقارنة
    <select id={answerId} value={typeof value === 'string' ? value : ''} onChange={(event) => onChange(event.currentTarget.value)}>
      <option value="">اختر الرمز</option><option value={'>'}>&gt;</option><option value={'<'}>&lt;</option><option value="=">=</option>
    </select>
  </label>
  if (response.kind === 'integer') return <label className="l12-control-label" htmlFor={answerId}>
    اكتب العدد الناقص
    <input id={answerId} type="text" inputMode="numeric" dir="ltr" autoComplete="off" value={typeof value === 'string' ? value : ''} onChange={(event) => onChange(event.currentTarget.value)} aria-label={`${task.title}: العدد الناقص`} />
  </label>
  if (response.kind === 'fraction') {
    const [numerator = '', denominator = ''] = (typeof value === 'string' ? value : '').split('/')
    const updateNumerator = (nextNumerator: string) => onChange(`${nextNumerator}/${denominator}`)
    const updateDenominator = (nextDenominator: string) => onChange(`${numerator}/${nextDenominator}`)
    return <fieldset className="l12-fraction-answer" dir="ltr">
      <legend>اكتب البسط والمقام</legend>
      <label>البسط<input type="text" inputMode="numeric" dir="ltr" autoComplete="off" value={numerator} onChange={(event) => updateNumerator(event.currentTarget.value)} aria-label={`${task.title}: البسط`} /></label>
      <span className="l12-input-fraction-bar" aria-hidden="true" />
      <label>المقام<input type="text" inputMode="numeric" dir="ltr" autoComplete="off" value={denominator} onChange={(event) => updateDenominator(event.currentTarget.value)} aria-label={`${task.title}: المقام`} /></label>
    </fieldset>
  }
  if (response.kind === 'ordering') {
    const initial = task.initialOrder ?? [...response.expected]
    const current = Array.isArray(value) ? value : initial
    return <FractionOrderControl taskId={task.id} items={current} onChange={onChange} />
  }
  return <label className="l12-control-label" htmlFor={answerId}>
    اكتب تفسيرك
    <textarea id={answerId} value={typeof value === 'string' ? value : ''} rows={3} onChange={(event) => onChange(event.currentTarget.value)} aria-label={`${task.title}: اكتب تفسيرك`} />
  </label>
}

function FractionOrderControl({ taskId, items, onChange }: { taskId: string; items: readonly string[]; onChange: (value: string[]) => void }) {
  const move = (index: number, offset: -1 | 1) => {
    const destination = index + offset
    if (destination < 0 || destination >= items.length) return
    const next = [...items]
    ;[next[index], next[destination]] = [next[destination], next[index]]
    onChange(next)
  }
  return <div className="l12-order-control" aria-label="أعد ترتيب الكسور باستعمال زري الرفع والخفض">
    <p className="l12-control-hint">استخدم السهمين بجوار كل كسر، أو ركّز الزر بلوحة المفاتيح ثم اضغط Enter.</p>
    <ol>{items.map((item, index) => <li key={`${taskId}-${item}`}>
      <span className="l12-order-position" aria-hidden="true">{index + 1}</span><MathExpression>{item}</MathExpression>
      <span className="l12-order-buttons">
        <button type="button" aria-label={`ارفع الكسر ${item}`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={16} aria-hidden="true" /></button>
        <button type="button" aria-label={`اخفض الكسر ${item}`} disabled={index === items.length - 1} onClick={() => move(index, 1)}><ArrowDown size={16} aria-hidden="true" /></button>
      </span>
    </li>)}</ol>
  </div>
}

function getTaskOutcome(task: FractionsOneBookElement, answer: string | string[] | undefined): 'correct' | 'incorrect' | 'incomplete' | 'open' {
  const response = task.response
  if (!response) return 'incomplete'
  if (response.kind === 'open') {
    return typeof answer === 'string' && answer.trim().length >= response.minimumCharacters ? 'open' : 'incomplete'
  }
  if (response.kind === 'ordering') {
    if (!Array.isArray(answer) || answer.length === 0) return 'incomplete'
    return answer.length === response.expected.length && response.expected.every((item, index) => answer[index] === item) ? 'correct' : 'incorrect'
  }
  if (typeof answer !== 'string' || answer.trim().length === 0) return 'incomplete'
  if (response.kind === 'relation') {
    const relation = normalizeDigits(answer).trim()
    return relation === response.expected || (response.expected === '>' && relation === 'أكبر') || (response.expected === '<' && relation === 'أصغر') || (response.expected === '=' && relation === 'يساوي') ? 'correct' : 'incorrect'
  }
  if (response.kind === 'integer') {
    const integer = parseSafeInteger(answer)
    return integer === undefined ? 'incorrect' : integer === response.expected ? 'correct' : 'incorrect'
  }
  const fraction = parseFractionText(answer)
  if (!fraction) return 'incorrect'
  if (!response.acceptEquivalent) return fraction.numerator === response.numerator && fraction.denominator === response.denominator ? 'correct' : 'incorrect'
  return BigInt(fraction.numerator) * BigInt(response.denominator) === BigInt(response.numerator) * BigInt(fraction.denominator) ? 'correct' : 'incorrect'
}

function SourceExplanation({ children, kind = 'note' }: { children: ReactNode; kind?: 'note' | 'warning' }) {
  return <aside className={`l12-explanation ${kind === 'warning' ? 'is-warning' : ''}`}><Lightbulb size={18} aria-hidden="true" /><div>{children}</div></aside>
}

/* ─────────────── Opening: the wide alignment-table identity, not a conventional icon hero ─────────────── */
function OpeningStep() {
  return <div className="l12-step-content">
    <header className="l12-studio-opening">
      <div className="l12-opening-overline"><span>الوحدة الثانية · الدرس الرابع · ص 54–57</span><span className="l12-opening-stamp">استوديو الكسور <strong>04</strong></span></div>
      <div className="l12-opening-layout">
        <div className="l12-opening-copy">
          <span className="l12-platform-tag"><Sparkles size={15} aria-hidden="true" /> محطة اكتشاف</span>
          <h3>وحّد وحدة القياس… ثم قارن.</h3>
          <p>الكسور مثل قطع مقاسة بأحجام مختلفة. حاذِ المقامات أولاً، ثم دع البسط يبيّن أي الكميتين أكبر.</p>
          <div className="l12-opening-chips" dir="ltr"><span><FractionGlyph numerator="3" denominator="4" /></span><i>↔</i><span><FractionGlyph numerator="2" denominator="5" /></span></div>
        </div>
        <div className="l12-alignment-art" role="img" aria-label="شريطان كسريان بأجزاء مختلفة، ومحاذاة وحداتهما على مقياس مشترك">
          <span className="l12-art-caption">من المقامات المختلفة</span>
          <div className="l12-art-row"><b>4</b><div className="l12-art-cells is-four"><i /><i /><i /><i /></div></div>
          <div className="l12-art-row"><b>5</b><div className="l12-art-cells is-five"><i /><i /><i /><i /><i /></div></div>
          <div className="l12-art-align"><Ruler size={17} aria-hidden="true" /><span>إلى أجزاء متساوية</span><strong>20</strong></div>
        </div>
      </div>
    </header>
    <SourceElementCard id="l12-p54-title" />
    <SourceElementCard id="l12-p54-goals" />
    <div className="l12-platform-goals">
      <span className="l12-platform-tag"><Target size={15} aria-hidden="true" /> أهداف التعلّم بصياغة المنصة</span>
      <ul><li>أقرأ نموذجاً دائرياً وأكتب الكسر الملوّن.</li><li>أكوّن كسوراً مكافئة بتغيير البسط والمقام بالعامل نفسه.</li><li>أقارن كسوراً متساوية المقام أو مختلفة المقام.</li><li>أرتب الكسور تصاعدياً وتنازلياً، وأبرر اختياري.</li></ul>
    </div>
    <QuestionGroup groupId="l12-p54-opening-group" />
    <p className="l12-source-note">سؤال الحلوى وبطاقة الأهداف أعلاه من الكتاب. «استوديو محاذاة الكسور» وأهداف الصياغة التفصيلية إضافة من إعداد المنصة.</p>
  </div>
}

function ModelAndEquivalenceStep() {
  return <div className="l12-step-content">
    <div className="l12-step-intro"><span className="l12-step-index">01</span><div><p>ابدأ من معنى الرسم: البسط يعدّ الملوّن، والمقام يعدّ كل الأجزاء المتساوية.</p><strong>اقرأ الدائرة قبل أن تقارن.</strong></div></div>
    <div className="l12-note-grid"><SourceElementCard id="l12-p54-same-denominator-rule" /><SourceElementCard id="l12-p54-multiple-denominator-rule" /></div>
    <QuestionGroup groupId="l12-p54-launch" />
    <QuestionGroup groupId="l12-p54-compare" />
    <QuestionGroup groupId="l12-p54-equivalent" />
    <SourceExplanation><strong>تذكّر:</strong> إذا لم تتساوَ المقامات، لا تحكم من المقامين وحدهما؛ ابحث عن كسرين مكافئين لهما أجزاء متساوية.</SourceExplanation>
  </div>
}

function EquivalentPicturesStep() {
  return <div className="l12-step-content">
    <div className="l12-step-intro"><span className="l12-step-index">02</span><div><p>المساحة المظللة قد تبقى نفسها حتى لو تغيّر عدد القطاعات.</p><strong>التقسيم يتغيّر، أما قيمة الكسر فلا تتغيّر.</strong></div></div>
    <SourceElementCard id="l12-p55-section-title" />
    <QuestionGroup groupId="l12-p55-figures" />
    <SourceElementCard id="l12-p55-equivalent-note" />
    <SourceExplanation><strong>كيف نتحقق؟</strong> نقسم 6/16 على 2 في البسط والمقام، فنعود إلى 3/8. لذلك يتطابق الجزء الملوّن في الشكل (7).</SourceExplanation>
  </div>
}

function CompareMethodStep() {
  return <div className="l12-step-content">
    <div className="l12-step-intro"><span className="l12-step-index">03</span><div><p>هذه هي آلة المقارنة: اختر مقاماً مشتركاً، كبّر البسط والمقام بالعامل نفسه، ثم قارن.</p><strong>كل خانة في مسار التحويل تمثل جزءاً متساوي الحجم.</strong></div></div>
    <SourceElementCard id="l12-p55-common-denominator-rule" />
    <SourceElementCard id="l12-p55-lcm-note" />
    <SourceElementCard id="l12-p55-example-halves-thirds" />
    <SourceElementCard id="l12-p55-example-2-5-1-3" />
    <QuestionGroup groupId="l12-p55-check" />
  </div>
}

function SortingMethodStep() {
  return <div className="l12-step-content">
    <div className="l12-step-intro"><span className="l12-step-index">04</span><div><p>لترتيب مجموعة، نستخدم مقاماً مشتركاً واحداً لكل الكسور، لا مقاماً مختلفاً لكل زوج.</p><strong>رتّب البسوط، ثم أعد كتابة الكسور الأصلية.</strong></div></div>
    <SourceElementCard id="l12-p56-section-title" />
    <SourceElementCard id="l12-p56-order-rule" />
    <SourceElementCard id="l12-p56-order-example" />
  </div>
}

function VerificationStep() {
  return <div className="l12-step-content">
    <div className="l12-step-intro"><span className="l12-step-index">05</span><div><p>تأكد من اتجاه الترتيب في نص السؤال قبل أن تبدأ.</p><strong>«تصاعدياً» يبدأ بالأصغر، و«تنازلياً» يبدأ بالأكبر.</strong></div></div>
    <QuestionGroup groupId="l12-p57-check-order" />
    <QuestionGroup groupId="l12-p57-verbal" />
  </div>
}

function PrintedPracticeStep() {
  return <div className="l12-step-content">
    <div className="l12-step-intro"><span className="l12-step-index">06</span><div><p>جميع البنود التالية من تدريبات الكتاب، مع تمييز كل فرع ومرجع صفحته.</p><strong>حلّ أولاً، ثم تحقّق من طريقة الحل.</strong></div></div>
    <QuestionGroup groupId="l12-p57-practice" />
    <QuestionGroup groupId="l12-p57-compare" />
    <QuestionGroup groupId="l12-p57-order-ascending" />
    <QuestionGroup groupId="l12-p57-order-descending" />
  </div>
}

function ApplicationsStep() {
  return <div className="l12-step-content">
    <div className="l12-step-intro"><span className="l12-step-index">07</span><div><p>في المسألة الحياتية، افهم معنى الكسر أولاً: مسافة، أو نسبة إجابات صحيحة، أو كمية مستهلكة.</p><strong>الأكبر ليس دائماً الأفضل؛ اقرأ ما يمثله الكسر.</strong></div></div>
    <QuestionGroup groupId="l12-p57-distance" />
    <QuestionGroup groupId="l12-p57-contest" />
    <QuestionGroup groupId="l12-p57-fuel" />
  </div>
}

function ProperFractionEditor({ title, value, onChange }: { title: string; value: { numerator: string; denominator: string }; onChange: (value: { numerator: string; denominator: string }) => void }) {
  return <fieldset className="l12-editor" dir="rtl">
    <legend>{title}</legend>
    <div className="l12-editor-fields" dir="ltr">
      <label>البسط<input type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={value.numerator} onChange={(event) => onChange({ ...value, numerator: event.currentTarget.value })} /></label>
      <span className="l12-editor-fraction-line" aria-hidden="true" />
      <label>المقام<input type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={value.denominator} onChange={(event) => onChange({ ...value, denominator: event.currentTarget.value })} /></label>
    </div>
  </fieldset>
}
function parseProperFraction(value: { numerator: string; denominator: string }): FractionPair | undefined {
  const numerator = parseSafeInteger(value.numerator, 12)
  const denominator = parseSafeInteger(value.denominator, 12)
  if (numerator === undefined || denominator === undefined || denominator < 2 || numerator < 1 || numerator > denominator) return undefined
  return { numerator, denominator }
}
function FractionTrack({ label, value }: { label: string; value: FractionPair | undefined }) {
  if (!value) return <div className="l12-track-placeholder" role="img" aria-label={`${label}: أدخل كسراً صحيحاً لعرض النموذج`}><span>أدخل كسرًا صالحًا لإظهار أجزائه</span></div>
  return <div className="l12-track-block">
    <div className="l12-track-caption"><strong>{label}</strong><FractionGlyph numerator={value.numerator} denominator={value.denominator} /></div>
    <div className="l12-fraction-track" dir="ltr" role="img" aria-label={`${label}: ${value.numerator} من ${value.denominator} جزءاً مظللاً`} style={{ gridTemplateColumns: `repeat(${value.denominator}, minmax(8px, 1fr))` }}>
      {Array.from({ length: value.denominator }, (_, index) => <span key={index} className={index < value.numerator ? 'is-filled' : ''} />)}
    </div>
    <p>عدد الوحدات المتساوية: <MathExpression>{value.denominator}</MathExpression></p>
  </div>
}

function FractionComparatorLab() {
  const [leftInput, setLeftInput] = useState({ numerator: '3', denominator: '4' })
  const [rightInput, setRightInput] = useState({ numerator: '1', denominator: '5' })
  const [attempted, setAttempted] = useState(false)
  const left = parseProperFraction(leftInput)
  const right = parseProperFraction(rightInput)
  const result = attempted && left && right ? compareFractionPairs(left, right) : undefined
  const leftValid = Boolean(left)
  const rightValid = Boolean(right)
  const onReset = () => { setLeftInput({ numerator: '3', denominator: '4' }); setRightInput({ numerator: '1', denominator: '5' }); setAttempted(false) }
  return <section className="l12-platform-lab l12-comparator-lab" aria-labelledby="l12-comparator-title" data-platform-activity="l12-platform-comparator">
    <div className="l12-lab-topline"><span className="l12-platform-tag"><Ruler size={15} aria-hidden="true" /> نشاط إثرائي من إعداد المنصة</span><span>محطة 1 · المحاذاة</span></div>
    <h3 id="l12-comparator-title">اضبط الكسرين، ثم وحّد وحدتهما</h3>
    <p>اكتب بسطاً من 1 إلى 12 ومقاماً من 2 إلى 12، على ألا يتجاوز البسط المقام. لا تظهر نتيجة المقارنة حتى تضغط «قارن».</p>
    <div className="l12-comparator-editors">
      <ProperFractionEditor title="الكسر الأول" value={leftInput} onChange={(value) => { setLeftInput(value); setAttempted(false) }} />
      <span className="l12-comparator-versus" aria-hidden="true">مقابل</span>
      <ProperFractionEditor title="الكسر الثاني" value={rightInput} onChange={(value) => { setRightInput(value); setAttempted(false) }} />
    </div>
    <div className="l12-tracks-board"><FractionTrack label="المسار الأول" value={left} /><span className="l12-track-divider" aria-hidden="true">↔</span><FractionTrack label="المسار الثاني" value={right} /></div>
    <div className="l12-lab-actions"><button type="button" className="l12-check-button" onClick={() => setAttempted(true)}>قارن بالمقام المشترك</button><button type="button" className="l12-reset-button" onClick={onReset}><RotateCcw size={15} aria-hidden="true" /> إعادة الضبط</button></div>
    {attempted && (!leftValid || !rightValid) && <p className="l12-lab-feedback is-hint" role="alert">تحقق من المدخلات: المقام بين 2 و12، والبسط موجب ولا يزيد على المقام. لا تُقبل الخانات الفارغة أو المقام صفرًا.</p>}
    {attempted && leftValid && rightValid && !result && <p className="l12-lab-feedback is-hint" role="alert">تعذر إجراء المقارنة بهذه القيم؛ أدخل أعداداً صحيحة ضمن الحدود المعروضة.</p>}
    {result && <div className="l12-comparator-result" role="status">
      <span>المقام المشترك الأصغر: <MathExpression>{result.commonDenominator}</MathExpression></span>
      <p><FractionGlyph numerator={result.left.numerator} denominator={result.left.denominator} /> <MathExpression>{result.relation}</MathExpression> <FractionGlyph numerator={result.right.numerator} denominator={result.right.denominator} /></p>
      <small>إذن <MathExpression>{formatFraction(left!)} {result.relation} {formatFraction(right!)}</MathExpression>. ضُرب بسط كل كسر ومقامه بالعامل نفسه.</small>
    </div>}
  </section>
}

const SORT_LAB_ITEMS = ['2/5', '7/18', '1/3', '5/12'] as const
function compareFractionText(left: string, right: string): number {
  const a = parseFractionText(left)
  const b = parseFractionText(right)
  if (!a || !b) return 0
  const lhs = BigInt(a.numerator) * BigInt(b.denominator)
  const rhs = BigInt(b.numerator) * BigInt(a.denominator)
  return lhs < rhs ? -1 : lhs > rhs ? 1 : 0
}
function FractionSortLab() {
  const [items, setItems] = useState<string[]>([...SORT_LAB_ITEMS])
  const [direction, setDirection] = useState<'ascending' | 'descending'>('ascending')
  const [checked, setChecked] = useState(false)
  const expected = [...SORT_LAB_ITEMS].sort((left, right) => compareFractionText(left, right) * (direction === 'ascending' ? 1 : -1))
  const move = (index: number, offset: -1 | 1) => {
    const destination = index + offset
    if (destination < 0 || destination >= items.length) return
    const next = [...items]
    ;[next[index], next[destination]] = [next[destination], next[index]]
    setItems(next)
    setChecked(false)
  }
  const isCorrect = items.every((item, index) => item === expected[index])
  return <section className="l12-platform-lab" aria-labelledby="l12-sort-lab-title" data-platform-activity="l12-platform-sorter">
    <div className="l12-lab-topline"><span className="l12-platform-tag"><ArrowUp size={15} aria-hidden="true" /> نشاط إثرائي من إعداد المنصة</span><span>محطة 2 · الترتيب</span></div>
    <h3 id="l12-sort-lab-title">رتّب الكسور على مسطرة واحدة</h3>
    <p>غيّر الاتجاه، ثم حرّك كل كسر بالسهمين حتى يصبح الترتيب صحيحاً. تعمل الأزرار باللمس ولوحة المفاتيح.</p>
    <fieldset className="l12-direction-picker"><legend>اتجاه الترتيب</legend>
      <label><input type="radio" name="l12-sort-direction" checked={direction === 'ascending'} onChange={() => { setDirection('ascending'); setChecked(false) }} /> تصاعدي: الأصغر أولاً</label>
      <label><input type="radio" name="l12-sort-direction" checked={direction === 'descending'} onChange={() => { setDirection('descending'); setChecked(false) }} /> تنازلي: الأكبر أولاً</label>
    </fieldset>
    <FractionOrderControl taskId="l12-platform-sort" items={items} onChange={(next) => { setItems(next); setChecked(false) }} />
    <button type="button" className="l12-check-button" onClick={() => setChecked(true)}>تحقّق من الترتيب</button>
    {checked && <p className={`l12-lab-feedback ${isCorrect ? 'is-correct' : 'is-hint'}`} role="status">
      {isCorrect ? 'ترتيب صحيح. حوّل القيم إلى المقام المشترك الأصغر 180: 2/5=72/180، 1/3=60/180، 7/18=70/180، 5/12=75/180.' : `راجع المقامات، ثم قارن بعد تحويل الكسور. الترتيب المطلوب هو: ${expected.join(' < ')}.`}
    </p>}
  </section>
}

function FractionErrorLab() {
  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = selected === 'common-denominator'
  return <section className="l12-platform-lab l12-error-lab" aria-labelledby="l12-error-title" data-platform-activity="l12-platform-error">
    <div className="l12-lab-topline"><span className="l12-platform-tag"><CircleAlert size={15} aria-hidden="true" /> نشاط إثرائي من إعداد المنصة</span><span>محطة 3 · صيد الخطأ</span></div>
    <h3 id="l12-error-title">اكتشف موضع الخطأ في حجة سارة</h3>
    <blockquote>«5/6 أصغر من 5/8، لأن 8 أكبر من 6.»</blockquote>
    <fieldset className="l12-error-options"><legend>أي طريقة تصحّح الحجة؟</legend>
      <label><input type="radio" name="l12-error-choice" value="denominator" checked={selected === 'denominator'} onChange={() => { setSelected('denominator'); setChecked(false) }} /> نقارن المقامين مباشرة ونبقي النتيجة كما هي.</label>
      <label><input type="radio" name="l12-error-choice" value="common-denominator" checked={selected === 'common-denominator'} onChange={() => { setSelected('common-denominator'); setChecked(false) }} /> نوحّد المقامين: 5/6 = 20/24 و5/8 = 15/24.</label>
    </fieldset>
    <button type="button" className="l12-check-button" onClick={() => setChecked(true)}>تحقّق من التصحيح</button>
    {checked && <p className={`l12-lab-feedback ${correct ? 'is-correct' : 'is-hint'}`} role="status">
      {correct ? 'أحسنت. 20/24 أكبر من 15/24، لذلك 5/6 > 5/8.' : selected ? 'المقامات وحدها لا تكفي؛ حوّل الكسرين إلى أجزاء متساوية الحجم أولاً.' : 'اختر طريقة تصحيح قبل التحقق.'}
    </p>}
  </section>
}

function PlatformLabsStep() {
  return <div className="l12-step-content">
    <div className="l12-platform-intro"><span className="l12-platform-tag"><Sparkles size={15} aria-hidden="true" /> أنشطة إضافية من إعداد المنصة</span><h3>جرّب، بدّل، ثم فسّر.</h3><p>هذه المختبرات توسّع التدريب ولا تُنسب إلى الكتاب، ولا تستبدل أي تمرين مطبوع.</p></div>
    <FractionComparatorLab />
    <FractionSortLab />
    <FractionErrorLab />
  </div>
}

function FinalChallenge() {
  const [relation, setRelation] = useState('')
  const [checked, setChecked] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  return <section className="l12-final-challenge" data-platform-activity="l12-platform-final-challenge" aria-labelledby="l12-final-challenge-title">
    <div><span className="l12-platform-tag"><Target size={15} aria-hidden="true" /> تحدٍّ ختامي من إعداد المنصة</span><h3 id="l12-final-challenge-title">أيهما أكبر: 5/8 أم 2/3؟</h3><p>اختر العلاقة أولاً. إذا احتجت مساعدة، اطلب تلميحاً قبل كشف النتيجة.</p></div>
    <label className="l12-control-label" htmlFor="l12-final-relation">رمز المقارنة
      <select id="l12-final-relation" value={relation} onChange={(event) => { setRelation(event.currentTarget.value); setChecked(false) }}><option value="">اختر الرمز</option><option value={'>'}>&gt;</option><option value={'<'}>&lt;</option><option value="=">=</option></select>
    </label>
    <div className="l12-challenge-actions"><button type="button" className="l12-check-button" onClick={() => setChecked(true)}>تحقّق</button><button type="button" className="l12-hint-button" onClick={() => setHintOpen(true)}>أحتاج تلميحاً</button></div>
    {hintOpen && <p className="l12-hint-panel" role="note">ابحث عن مقام مشترك يقبل القسمة على 8 و3، ثم حوّل الكسرين بالعامل نفسه في البسط والمقام.</p>}
    {checked && <p className={`l12-lab-feedback ${relation === '<' ? 'is-correct' : 'is-hint'}`} role="status">{relation === '<' ? 'صحيح: 5/8 = 15/24 و2/3 = 16/24، لذا 5/8 < 2/3.' : relation ? 'ليست هذه العلاقة؛ استخدم المقام المشترك 24 وقارن 15 و16.' : 'اختر رمزاً قبل التحقق.'}</p>}
  </section>
}

function RecapStep() {
  return <div className="l12-step-content">
    <div className="l12-recap-workbench">
      <div className="l12-recap-heading"><span className="l12-platform-tag"><Check size={15} aria-hidden="true" /> خلاصة مرئية</span><h3>أربع محطات من الرسم إلى الترتيب</h3></div>
      <ol>
        <li><strong>اقرأ النموذج:</strong> البسط عدد الأجزاء الملوّنة، والمقام عدد الأجزاء المتساوية كلها.</li>
        <li><strong>كوّن كسراً مكافئاً:</strong> اضرب البسط والمقام بالعامل نفسه.</li>
        <li><strong>قارن:</strong> وحّد المقامات، ثم قارن البسطين؛ الأكبر بسطاً هو الأكبر كسراً.</li>
        <li><strong>رتّب:</strong> بعد توحيد المقامات، رتّب البسوط بالاتجاه المطلوب.</li>
      </ol>
      <div className="l12-recap-equation" dir="ltr"><MathExpression>3/8 = 6/16</MathExpression><span>؛</span><MathExpression>2/3 &gt; 1/2</MathExpression><span>؛</span><MathExpression>4/12 &lt; 7/12 &lt; 9/12</MathExpression></div>
    </div>
    <SourceExplanation kind="warning"><strong>خطأ شائع:</strong> لا تقارن مقامَي كسرين مختلفين وحدهما، ولا تغيّر المقام من دون البسط. وحين تسأل المسألة عن القرب أو الاقتصاد، حدّد أولاً هل المطلوب أكبر كمية أم أقل مسافة أو استهلاك.</SourceExplanation>
    <FinalChallenge />
    <a className="l12-independent-test-link" href="#tests/run/lesson-fractions-one-test">انتقل إلى اختبار الدرس المستقل · 20 سؤالاً <ArrowLeft size={17} aria-hidden="true" /></a>
    <p className="l12-source-note">الاختبار منفصل عن محتوى الدرس، وحلوله لا تظهر إلا بعد تسليم المحاولة في منطقة الاختبارات.</p>
  </div>
}

export function FractionsOneLesson() {
  const steps: LessonStep[] = [
    { id: 'opening', title: 'مدخل الدرس: قالب الحلوى', content: <OpeningStep /> },
    { id: 'models', title: 'اقرأ النماذج وقارن', content: <ModelAndEquivalenceStep /> },
    { id: 'equivalence', title: 'كسور متكافئة في الرسوم', content: <EquivalentPicturesStep /> },
    { id: 'compare-method', title: 'طريقة المقام المشترك', content: <CompareMethodStep /> },
    { id: 'sorting', title: 'ترتيب الكسور', content: <SortingMethodStep /> },
    { id: 'check', title: 'تحقق من فهمك والتعبير الشفهي', content: <VerificationStep /> },
    { id: 'practice', title: 'تدريبات المقارنة والترتيب', content: <PrintedPracticeStep /> },
    { id: 'applications', title: 'تطبيقات المسافة والنتائج والوقود', content: <ApplicationsStep /> },
    { id: 'labs', title: 'مختبر المحاذاة', content: <PlatformLabsStep /> },
    { id: 'recap', title: 'الخلاصة والتحدي الختامي', content: <RecapStep /> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title="الكسور (1)" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-twelve" />
}
