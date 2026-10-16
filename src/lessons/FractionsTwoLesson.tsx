import { useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, Check, CircleAlert, Lightbulb, RotateCcw, Scissors, Sparkles, Target } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import {
  checkClassifyItems, checkToImproperItems, checkToMixedItems, classifyFraction, classifyItems, cakeShare,
  divideWithRemainder, exerciseThreeItems, exerciseTwoItems, formatFraction, isAcceptedFraction,
  isAcceptedMixed, parseFractionText, parseMixedText, samirClaim, toImproper, toMixed, type BookItem, type Fraction,
  type FractionKind, type MixedNumber,
} from './fractionsTwoData'

/* ───────────────────────── Shared, LTR-isolated notation ───────────────────────── */

/** Vertical fraction: numerator above a rule above the denominator, always LTR. */
export function Frac({ n, d, label }: { n: number | string; d: number | string; label?: string }) {
  return <span className="l25-frac" dir="ltr" role="img" aria-label={label ?? `${n} على ${d}`}>
    <span>{n}</span><span className="l25-frac-rule" aria-hidden="true" /><span>{d}</span>
  </span>
}

/** Mixed number: whole part followed by a vertical fraction, isolated LTR. */
export function Mixed({ w, n, d }: { w: number | string; n: number | string; d: number | string }) {
  return <span className="l25-mixed" dir="ltr" role="img" aria-label={`${w} و${n} على ${d}`}>
    <span className="l25-mixed-whole">{w}</span><Frac n={n} d={d} />
  </span>
}

function Eq({ children }: { children: ReactNode }) { return <MathExpression className="l25-eq">{children}</MathExpression> }

/** Prose that mixes Arabic with notation: each piece is its own isolated LTR island. */
function Prose({ children }: { children: ReactNode }) { return <span className="l25-prose" dir="rtl">{children}</span> }

const NOTATION_PATTERN = /(\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+)/gu

/** Plain learner-facing text: fractions inside it become vertical glyphs (mixed first, then ordinary). */
function Notation({ text }: { text: string }) {
  return <span dir="rtl">{text.split(NOTATION_PATTERN).map((piece, index) => {
    if (!piece) return null
    const mixed = /^\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/u.exec(piece)
    if (mixed) return <Mixed key={index} w={mixed[1]} n={mixed[2]} d={mixed[3]} />
    const plain = /^\s*(\d+)\s*\/\s*(\d+)\s*$/u.exec(piece)
    if (plain) return <Frac key={index} n={plain[1]} d={plain[2]} />
    return <BidiText key={index}>{piece}</BidiText>
  })}</span>
}

/* ───────────────────────── Teaching visuals ───────────────────────── */

/** Cake slices in groups of four: the picture that makes "one whole" and "one and a bit" visible. */
function CakeModel({ pieces }: { pieces: number }) {
  const cakes = Math.floor(pieces / 4)
  const rest = pieces % 4
  const total = Math.max(cakes + (rest > 0 ? 1 : 0), 1)
  return <div className="l25-cake-model" role="img" aria-label={`${pieces} قطعة من أصل ${total * 4} قطع، أي ${cakes} قالب كامل${rest ? ` و${rest} قطع` : ''}`}>
    {Array.from({ length: total }, (_, cakeIndex) => <div key={cakeIndex} className="l25-cake">
      {Array.from({ length: 4 }, (_, slice) => {
        const index = cakeIndex * 4 + slice
        return <span key={slice} className={`l25-slice ${index < pieces ? 'is-taken' : ''}`} />
      })}
    </div>)}
  </div>
}

function ImproperDivisionVisual({ numerator, denominator }: { numerator: number; denominator: number }) {
  const { quotient, remainder } = divideWithRemainder(numerator, denominator)
  return <div className="l25-division" dir="ltr" role="img" aria-label={`قسمة ${numerator} على ${denominator}: خارج القسمة ${quotient} والباقي ${remainder}`}>
    <div className="l25-division-head"><span className="l25-division-quotient">{quotient}</span></div>
    <div className="l25-division-body">
      <span className="l25-division-divisor">{denominator}</span>
      <span className="l25-division-dividend">{numerator}</span>
    </div>
    <div className="l25-division-rest">باقي = <strong>{remainder}</strong></div>
  </div>
}

/* ───────────────────────── Shared controls ───────────────────────── */

function parseNatural(value: string, max: number): number | undefined {
  const normalized = value.replace(/[٠-٩]/gu, (digit) => String(digit.charCodeAt(0) - 0x0660)).trim()
  if (!/^\d+$/u.test(normalized)) return undefined
  const number = Number(normalized)
  return Number.isSafeInteger(number) && number <= max ? number : undefined
}

function NumberField({ label, value, onChange, max }: { label: string; value: string; onChange: (value: string) => void; max: number }) {
  const parsed = parseNatural(value, max)
  return <label className="l25-number-field">
    <span>{label}</span>
    <input type="text" inputMode="numeric" autoComplete="off" dir="ltr" value={value} onChange={(event) => onChange(event.currentTarget.value)} aria-invalid={parsed === undefined && value !== ''} aria-label={label} />
  </label>
}

/* ───────────────────────── Interactive: the cake lab (step 1) ───────────────────────── */

function CakeLab() {
  const [pieces, setPieces] = useState(6)
  const cakes = Math.floor(pieces / 4)
  const rest = pieces % 4
  const fraction: Fraction = { numerator: pieces, denominator: 4 }
  const kind = classifyFraction(fraction)
  return <section className="l25-lab l25-cake-lab" aria-labelledby="l25-cake-lab-title" data-platform-activity="l25-cake-lab">
    <div className="l25-lab-topline"><span className="l25-tag"><Scissors size={15} aria-hidden="true" /> مختبر القالب · نشاط من إعداد المنصة</span></div>
    <h3 id="l25-cake-lab-title">كم قطعة أخذنا، وكم قالباً صار؟</h3>
    <p>كل قالب مقسّم إلى 4 قطع متساوية. حرّك المؤشر لتغيير عدد القطع المأخوذة، ولاحظ الكسر الذي يتكوّن.</p>
    <label className="l25-slider-label"><span>عدد القطع المأخوذة: <strong>{pieces}</strong></span>
      <input type="range" min={1} max={12} value={pieces} onChange={(event) => setPieces(Number(event.currentTarget.value))} aria-valuetext={`${pieces} قطعة`} />
    </label>
    <CakeModel pieces={pieces} />
    <div className="l25-readout">
      <div><span>كسر عادي</span><Frac n={pieces} d={4} /><small>{kind === 'proper' ? 'أصغر من 1' : kind === 'equal-one' ? 'يساوي 1' : kind === 'whole' ? 'يساوي عدداً صحيحاً' : 'أكبر من 1'}</small></div>
      <div><span>{rest === 0 ? (cakes === 0 ? 'لا عدد صحيح بعد' : 'عدد صحيح') : cakes === 0 ? 'أصغر من 1 (يبقى عادياً)' : 'كسر مركب'}</span>{rest === 0 ? <strong className="l25-whole-only">{cakes}</strong> : cakes === 0 ? <Frac n={rest} d={4} /> : <Mixed w={cakes} n={rest} d={4} />}<small>{cakes} قالب كامل {rest ? `و${rest} قطع` : ''}</small></div>
    </div>
    <p className="l25-lab-note">تذكّر: كل كسر عادي بسطه أصغر من مقامه أصغر من 1، وكل كسر بسطه أكبر من مقامه أكبر من 1، والكسر المركب يُفهم عدداً صحيحاً مع كسر أصغر من 1.</p>
  </section>
}

/* ───────────────────────── Interactive: classification lab (step 2) ───────────────────────── */

function ClassifyLab() {
  const [numeratorText, setNumeratorText] = useState('11')
  const [denominatorText, setDenominatorText] = useState('4')
  const numerator = parseNatural(numeratorText, 999)
  const denominator = parseNatural(denominatorText, 999)
  const valid = numerator !== undefined && denominator !== undefined && denominator > 0
  const kind: FractionKind | undefined = valid ? classifyFraction({ numerator, denominator }) : undefined
  const explanation: Record<FractionKind, string> = {
    proper: 'البسط أصغر من المقام: الكسر أصغر من 1، ويُسمّى كسراً عادياً.',
    'equal-one': 'البسط يساوي المقام: الكسر يساوي 1، وهو كسر عادي.',
    whole: 'البسط مضاعف للمقام: الكسر عدد صحيح، ويُكتب كسراً عادياً بمقام 1 عند الحاجة، وليس كسراً مركباً.',
    improper: 'البسط أكبر من المقام وليس مضاعفاً له: الكسر أكبر من 1، ويمكن كتابته مركباً.',
  }
  return <section className="l25-lab l25-classify-lab" aria-labelledby="l25-classify-title" data-platform-activity="l25-classify-lab">
    <div className="l25-lab-topline"><span className="l25-tag"><Sparkles size={15} aria-hidden="true" /> مصنّف الكسور · نشاط من إعداد المنصة</span></div>
    <h3 id="l25-classify-title">ضع بسطاً ومقاماً، واكتشف نوع الكسر</h3>
    <div className="l25-lab-inputs">
      <NumberField label="البسط" value={numeratorText} onChange={setNumeratorText} max={999} />
      <NumberField label="المقام" value={denominatorText} onChange={setDenominatorText} max={999} />
    </div>
    {!valid && <p className="l25-input-error" role="alert">أدخل بسطاً صحيحاً (0 فأكثر) ومقاماً أكبر من صفر.</p>}
    {valid && kind && <div className="l25-readout is-single" role="status">
      <Frac n={numerator} d={denominator} />
      <p><strong>{kind === 'improper' || kind === 'whole' ? 'كسر أكبر من أو يساوي 1' : kind === 'equal-one' ? 'يساوي 1' : 'كسر أصغر من 1'}</strong> — {explanation[kind]}</p>
    </div>}
  </section>
}

/* ───────────────────────── Book task rows ───────────────────────── */

function gradeClassify(item: BookItem, answer: 'ordinary' | 'mixed' | undefined): 'correct' | 'incorrect' | 'incomplete' {
  if (!answer) return 'incomplete'
  return answer === item.expected ? 'correct' : 'incorrect'
}

function reasoningFor(item: BookItem): string[] {
  if (item.kind === 'classify') {
    return item.expected === 'mixed'
      ? [`الكسر المركب يتكوّن من عدد صحيح ثم كسر عادي أصغر من 1: ${item.printed}.`, 'وجود عدد صحيح قبل الكسر يجعله مركباً.']
      : item.printed === '5'
        ? ['العدد 5 ليس كسراً مركباً، لأنه لا يحتوي على جزء كسري.', 'الكتاب لا يطبع له مقاماً، لذلك تصنيفه بين «عادي» وغيره قيد الحسم؛ الإجابة المعروضة هنا تفسير منطقي وليست منقولة من الكتاب.']
        : [`${item.printed} لا يحتوي على عدد صحيح قبل الكسر، فهو كسر عادي.`]
  }
  if (item.kind === 'to-mixed') {
    const [n, d] = item.printed.split('/').map(Number)
    const { quotient, remainder } = divideWithRemainder(n, d)
    return [`نقسم البسط ${n} على المقام ${d}: خارج القسمة ${quotient} والباقي ${remainder}.`, `فيكون الكسر ${quotient} ${remainder}/${d}.`, `تحقق: ${quotient} × ${d} + ${remainder} = ${n}.`]
  }
  const mixed = parseMixedFromPrinted(item.printed)
  return mixed ? [`نضرب العدد الصحيح في المقام: ${mixed.whole} × ${mixed.denominator} = ${mixed.whole * mixed.denominator}.`, `نضيف البسط: ${mixed.whole * mixed.denominator} + ${mixed.numerator} = ${mixed.whole * mixed.denominator + mixed.numerator}.`, `النتيجة على المقام نفسه: ${formatFraction(toImproper(mixed))}.`] : []
}

function parseMixedFromPrinted(printed: string): MixedNumber | undefined {
  const match = /^\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/u.exec(printed)
  return match ? { whole: Number(match[1]), numerator: Number(match[2]), denominator: Number(match[3]) } : undefined
}

function ClassifyTask({ item }: { item: BookItem }) {
  const [answer, setAnswer] = useState<'ordinary' | 'mixed'>()
  const [checked, setChecked] = useState(false)
  const outcome = checked ? gradeClassify(item, answer) : undefined
  return <article className="l25-task" data-source-id={item.id}>
    <div className="l25-task-head"><span className="l25-task-label">{item.label}</span><span className="l25-task-printed"><Notation text={item.printed} /></span></div>
    <div className="l25-choice-row" role="group" aria-label={`نوع الكسر ${item.label}`}>
      <button type="button" className={answer === 'ordinary' ? 'is-picked' : ''} aria-pressed={answer === 'ordinary'} onClick={() => { setAnswer('ordinary'); setChecked(false) }}>كسر عادي</button>
      <button type="button" className={answer === 'mixed' ? 'is-picked' : ''} aria-pressed={answer === 'mixed'} onClick={() => { setAnswer('mixed'); setChecked(false) }}>كسر مركب</button>
    </div>
    <button type="button" className="l25-check" onClick={() => setChecked(true)}><Check size={15} aria-hidden="true" /> تحقّق</button>
    {outcome && <TaskFeedback outcome={outcome} reasoning={reasoningFor(item)} />}
  </article>
}

function MixedTask({ item }: { item: BookItem }) {
  const [whole, setWhole] = useState('')
  const [numerator, setNumerator] = useState('')
  const [denominator, setDenominator] = useState('')
  const [checked, setChecked] = useState(false)
  const w = parseNatural(whole, 9999)
  const n = parseNatural(numerator, 9999)
  const d = parseNatural(denominator, 9999)
  const complete = w !== undefined && n !== undefined && d !== undefined && d > 1 && n > 0 && n < d
  const outcome = checked ? (!complete ? 'incomplete' : isAcceptedMixed(item.id, { whole: w!, numerator: n!, denominator: d! }, item.expected) ? 'correct' : 'incorrect') : undefined
  return <article className="l25-task" data-source-id={item.id}>
    <div className="l25-task-head"><span className="l25-task-label">{item.label}</span><span className="l25-task-printed"><Notation text={item.printed} /></span></div>
    <div className="l25-mixed-input" dir="ltr" role="group" aria-label={`اكتب ${item.printed} بشكل كسر مركب`}>
      <NumberField label="العدد الصحيح" value={whole} onChange={(v) => { setWhole(v); setChecked(false) }} max={9999} />
      <NumberField label="البسط" value={numerator} onChange={(v) => { setNumerator(v); setChecked(false) }} max={9999} />
      <NumberField label="المقام" value={denominator} onChange={(v) => { setDenominator(v); setChecked(false) }} max={9999} />
    </div>
    <button type="button" className="l25-check" onClick={() => setChecked(true)}><Check size={15} aria-hidden="true" /> تحقّق</button>
    {outcome && <TaskFeedback outcome={outcome} reasoning={reasoningFor(item)} answerLabel={item.expected} />}
  </article>
}

function ImproperTask({ item }: { item: BookItem }) {
  const [numerator, setNumerator] = useState('')
  const [denominator, setDenominator] = useState('')
  const [checked, setChecked] = useState(false)
  const n = parseNatural(numerator, 99999)
  const d = parseNatural(denominator, 99999)
  const complete = n !== undefined && d !== undefined && d > 0
  const outcome = checked ? (!complete ? 'incomplete' : isAcceptedFraction({ numerator: n!, denominator: d! }, item.expected) ? 'correct' : 'incorrect') : undefined
  return <article className="l25-task" data-source-id={item.id}>
    <div className="l25-task-head"><span className="l25-task-label">{item.label}</span><span className="l25-task-printed"><Notation text={item.printed} /></span></div>
    <div className="l25-fraction-input" dir="ltr" role="group" aria-label={`اكتب ${item.printed} ككسر عادي`}>
      <NumberField label="البسط" value={numerator} onChange={(v) => { setNumerator(v); setChecked(false) }} max={99999} />
      <span className="l25-input-rule" aria-hidden="true" />
      <NumberField label="المقام" value={denominator} onChange={(v) => { setDenominator(v); setChecked(false) }} max={99999} />
    </div>
    <button type="button" className="l25-check" onClick={() => setChecked(true)}><Check size={15} aria-hidden="true" /> تحقّق</button>
    {outcome && <TaskFeedback outcome={outcome} reasoning={reasoningFor(item)} answerLabel={item.expected} />}
  </article>
}

function TaskFeedback({ outcome, reasoning, answerLabel }: { outcome: 'correct' | 'incorrect' | 'incomplete'; reasoning: string[]; answerLabel?: string }) {
  return <div className={`l25-feedback ${outcome === 'correct' ? 'is-correct' : 'is-hint'}`} role="status">
    <p>{outcome === 'correct' && <><Check size={15} aria-hidden="true" /> إجابة صحيحة.</>}
      {outcome === 'incorrect' && <><CircleAlert size={15} aria-hidden="true" /> ليست صحيحة بعد. راجع الطريقة أدناه.</>}
      {outcome === 'incomplete' && <><Lightbulb size={15} aria-hidden="true" /> أكمل المدخلات أولاً (المقام أكبر من 1 للكسر المركب).</>}</p>
    {outcome !== 'incomplete' && <details className="l25-solution">
      <summary>طريقة الحل</summary>
      <ol>{reasoning.map((line, index) => <li key={index}><Notation text={line} /></li>)}</ol>
      {answerLabel && <p><strong>الإجابة:</strong> <Notation text={answerLabel} /></p>}
    </details>}
  </div>
}

function TaskGroup({ title, page, children }: { title: string; page: number; children: ReactNode }) {
  return <section className="l25-group" aria-label={title}>
    <header className="l25-group-head"><span className="l25-source-tag">الكتاب · ص {page}</span><h3>{title}</h3></header>
    <div className="l25-task-grid">{children}</div>
  </section>
}

/* ───────────────────────── Interactive: relation vs one (step 3) ───────────────────────── */

function RelationTask({ fraction, correct }: { fraction: Fraction; correct: '<' | '=' | '>' }) {
  const [picked, setPicked] = useState<'<' | '=' | '>'>()
  const [checked, setChecked] = useState(false)
  const outcome = checked && picked ? (picked === correct ? 'correct' : 'incorrect') : undefined
  return <article className="l25-task">
    <div className="l25-relation-row" dir="ltr">
      <Frac n={fraction.numerator} d={fraction.denominator} /><span className="l25-relation-box" aria-label="اختر رمز المقارنة">{picked ?? '□'}</span><span>1</span>
    </div>
    <div className="l25-choice-row" role="group" aria-label="اختر رمز المقارنة">
      {(['<', '=', '>'] as const).map((symbol) => <button key={symbol} type="button" className={picked === symbol ? 'is-picked' : ''} aria-pressed={picked === symbol} onClick={() => { setPicked(symbol); setChecked(false) }}><span dir="ltr">{symbol}</span></button>)}
    </div>
    <button type="button" className="l25-check" disabled={!picked} onClick={() => setChecked(true)}><Check size={15} aria-hidden="true" /> تحقّق</button>
    {outcome && <div className={`l25-feedback ${outcome === 'correct' ? 'is-correct' : 'is-hint'}`} role="status">
      <p>{outcome === 'correct' ? 'صحيح.' : 'ليس بعد.'} <Prose>الكسر <Frac n={fraction.numerator} d={fraction.denominator} /> {correct === '<' ? 'أصغر' : correct === '>' ? 'أكبر' : 'يساوي'} من 1 لأن البسط {correct === '<' ? 'أصغر' : correct === '>' ? 'أكبر' : 'يساوي'} المقام.</Prose></p>
    </div>}
  </article>
}

/* ───────────────────────── Interactive: the 9/4 division lab (step 4) ───────────────────────── */

function DivisionLab() {
  const [numeratorText, setNumeratorText] = useState('9')
  const [denominatorText, setDenominatorText] = useState('4')
  const numerator = parseNatural(numeratorText, 999)
  const denominator = parseNatural(denominatorText, 999)
  const valid = numerator !== undefined && denominator !== undefined && denominator > 0
  const result = useMemo(() => valid ? divideWithRemainder(numerator!, denominator!) : undefined, [valid, numerator, denominator])
  const mixed = valid && result ? toMixed({ numerator: numerator!, denominator: denominator! }) : undefined
  return <section className="l25-lab l25-division-lab" aria-labelledby="l25-division-title" data-platform-activity="l25-division-lab">
    <div className="l25-lab-topline"><span className="l25-tag"><Sparkles size={15} aria-hidden="true" /> مختبر القسمة · نشاط من إعداد المنصة</span></div>
    <h3 id="l25-division-title">من البسط إلى المركب بالقسمة</h3>
    <div className="l25-lab-inputs">
      <NumberField label="البسط" value={numeratorText} onChange={setNumeratorText} max={999} />
      <NumberField label="المقام" value={denominatorText} onChange={setDenominatorText} max={999} />
    </div>
    {!valid && <p className="l25-input-error" role="alert">أدخل بسطاً (0 فأكثر) ومقاماً أكبر من صفر.</p>}
    {valid && result && mixed && <>
      <ImproperDivisionVisual numerator={numerator!} denominator={denominator!} />
      <div className="l25-readout is-single" role="status">
        {result.quotient === 0 && <p><Prose>البسط أصغر من المقام، فالكسر <Frac n={numerator!} d={denominator!} /> أصغر من 1 ولا يُكتب مركباً؛ يبقى كسراً عادياً.</Prose></p>}
        {result.quotient > 0 && result.remainder === 0 && <p><Prose><Frac n={numerator!} d={denominator!} /> <Eq>=</Eq> <strong>{result.quotient}</strong> والباقي صفر، فالناتج عدد صحيح.</Prose></p>}
        {result.quotient > 0 && result.remainder > 0 && <p><Prose>
          <Frac n={numerator!} d={denominator!} /> <Eq>=</Eq> <Mixed w={mixed.whole} n={mixed.numerator} d={mixed.denominator} />
        </Prose></p>}
        <p>التحقق: <MathExpression>{`${result.quotient} × ${denominator} + ${result.remainder} = ${numerator}`}</MathExpression></p>
      </div>
    </>}
  </section>
}

/* ───────────────────────── Interactive: the 2 + 1/4 bridge lab (step 5) ───────────────────────── */

function BuildLab() {
  const [whole, setWhole] = useState('2')
  const [numerator, setNumerator] = useState('1')
  const [denominator, setDenominator] = useState('4')
  const w = parseNatural(whole, 999)
  const n = parseNatural(numerator, 999)
  const d = parseNatural(denominator, 999)
  const valid = w !== undefined && w >= 1 && n !== undefined && d !== undefined && d > 1 && n >= 1 && n < d
  const product = valid ? w! * d! : undefined
  const improper = valid ? toImproper({ whole: w!, numerator: n!, denominator: d! }) : undefined
  return <section className="l25-lab l25-build-lab" aria-labelledby="l25-build-title" data-platform-activity="l25-build-lab">
    <div className="l25-lab-topline"><span className="l25-tag"><Target size={15} aria-hidden="true" /> مختبر التحويل · نشاط من إعداد المنصة</span></div>
    <h3 id="l25-build-title">اكتب الكسر المركب على صورة كسر عادي</h3>
    <div className="l25-mixed-input" dir="ltr">
      <NumberField label="العدد الصحيح" value={whole} onChange={setWhole} max={999} />
      <NumberField label="البسط" value={numerator} onChange={setNumerator} max={999} />
      <NumberField label="المقام" value={denominator} onChange={setDenominator} max={999} />
    </div>
    {!valid && <p className="l25-input-error" role="alert">لكي يكون الكسر مركباً: العدد الصحيح 1 فأكثر، والبسط من 1 إلى أقل من المقام، والمقام أكبر من 1.</p>}
    {valid && improper && <div className="l25-build-steps" role="status">
      <p><Prose>نضرب العدد الصحيح في المقام: <MathExpression>{`${w} × ${d} = ${product}`}</MathExpression></Prose></p>
      <p><Prose>نضيف البسط: <MathExpression>{`${product} + ${n} = ${product! + n!}`}</MathExpression></Prose></p>
      <p><Prose>نحتفظ بالمقام نفسه: <Mixed w={w!} n={n!} d={d!} /> <Eq>=</Eq> <Frac n={improper.numerator} d={improper.denominator} /></Prose></p>
    </div>}
  </section>
}

/* ───────────────────────── Step content ───────────────────────── */

function OpeningStep() {
  return <div className="l25-step-content">
    <header className="l25-hero">
      <div className="l25-hero-copy">
        <span className="l25-tag"><Sparkles size={15} aria-hidden="true" /> مطبخ الكسور · الوحدة الثانية · الدرس الخامس</span>
        <h2>قالب وربع… كيف نكتبه؟</h2>
        <p><Prose>قال البائع لرغد إن كتلة السكر ثلاثة ونصف كيلوغرام، أي <Mixed w={3} n={1} d={2} /> kg. ترى ماذا نُسمّي هذا العدد؟</Prose></p>
      </div>
      <div className="l25-hero-art" aria-hidden="true">
        <div className="l25-hero-cake"><span /><span /><span /><span /></div>
        <div className="l25-hero-cake is-half"><span /><span /></div>
      </div>
    </header>
    <SourceCard label="من الكتاب · ص 58 · سؤال الافتتاحية">
      <p>نُسمّي العدد <strong>كسراً مركّباً</strong> لأنه مكوَّن من عدد صحيح وكسر عادي معاً.</p>
    </SourceCard>
    <div className="l25-goals">
      <span className="l25-tag"><Target size={15} aria-hidden="true" /> أهداف الدرس</span>
      <ul>
        <li>أميّز الكسر العادي من الكسر المركب.</li>
        <li>أحوّل الكسر العادي الأكبر من 1 إلى كسر مركب بالقسمة.</li>
        <li>أحوّل الكسر المركب إلى كسر عادي بالضرب والجمع.</li>
        <li>أستعمل الكسور المركبة في مسائل حياتية، وأتحقق من الإجابة.</li>
      </ul>
    </div>
    <CakeLab />
  </div>
}

function DefinitionsStep() {
  return <div className="l25-step-content">
    <div className="l25-step-intro"><span className="l25-step-index">01</span><div><p>الكسر الذي يُكتب بالشكل <Frac n="A" d="B" /> يُسمّى كسراً عادياً، حيث A البسط وB المقام.</p><strong>العدد الصحيح + كسر أصغر من 1 = كسر مركب.</strong></div></div>
    <SourceCard label="من الكتاب · ص 59 · قواعد الكسر العادي">
      <ul className="l25-rule-list">
        <li>إذا كان البسط أصغر من المقام، فإن الكسر العادي أصغر من 1. مثال: <Frac n={1} d={2} /> أصغر من 1.</li>
        <li>إذا كان البسط يساوي المقام، فإن الكسر يساوي 1. مثال: <Frac n={13} d={13} /> = 1.</li>
        <li>إذا كان البسط أكبر من المقام، فإن الكسر أكبر من 1. مثال: <Frac n={9} d={8} /> أكبر من 1.</li>
        <li>يُكتب الكسر المركب على شكل عدد صحيح يليه كسر عادي، مثل <Mixed w={3} n={1} d={2} />.</li>
      </ul>
    </SourceCard>
    <ClassifyLab />
    <TaskGroup title="حدّد: كسر عادي أم كسر مركب؟" page={60}>
      {classifyItems.map((item) => <ClassifyTask key={item.id} item={item} />)}
    </TaskGroup>
    <SourceCard label="من الكتاب · ص 59 · تحقّق من فهمك">
      <p>البنود التالية من تمرين «تحقّق من فهمك» في الصفحة 59. انتبه إلى البند «5»: هو عدد صحيح بلا جزء كسري، فليس كسراً مركباً، والكتاب لا يطبع له مقاماً، فتصنيفه بين «عادي» وغيره قيد الحسم.</p>
    </SourceCard>
    <TaskGroup title="تحقّق من فهمك: عادي أم مركب؟" page={59}>
      {checkClassifyItems.map((item) => <ClassifyTask key={item.id} item={item} />)}
    </TaskGroup>
    <p className="l25-source-note">المحتوى المطبوع من الكتاب. «مصنّف الكسور» و«مختبر القالب» نشاطان إضافيان من إعداد المنصة.</p>
  </div>
}

function ComparisonStep() {
  return <div className="l25-step-content">
    <div className="l25-step-intro"><span className="l25-step-index">02</span><div><p>قارن بسط الكسر ومقامه قبل أي حساب: البسط أصغر أم أكبر أم يساوي المقام؟</p><strong>المقام هو حجم القطعة، والبسط هو عدد القطع المأخوذة.</strong></div></div>
    <SourceCard label="من الكتاب · ص 58 · النشاط 1 و2">
      <div className="l25-compare-table" dir="ltr" role="table" aria-label="مقارنة البسط بالمقام">
        <div role="row"><span role="columnheader">الكسر</span><span role="columnheader">البسط مقابل المقام</span><span role="columnheader">النتيجة بالنسبة إلى 1</span></div>
        <div role="row"><span role="cell"><Frac n={3} d={4} /></span><span role="cell">3 &lt; 4</span><span role="cell">أصغر من 1</span></div>
        <div role="row"><span role="cell"><Frac n={4} d={4} /></span><span role="cell">4 = 4</span><span role="cell">يساوي 1</span></div>
        <div role="row"><span role="cell"><Frac n={7} d={4} /></span><span role="cell">7 &gt; 4</span><span role="cell">أكبر من 1</span></div>
      </div>
    </SourceCard>
    <TaskGroup title="أكمل بالرمز المناسب: <، =، أو >" page={58}>
      <RelationTask fraction={{ numerator: 7, denominator: 4 }} correct=">" />
      <RelationTask fraction={{ numerator: 4, denominator: 4 }} correct="=" />
      <RelationTask fraction={{ numerator: 3, denominator: 4 }} correct="<" />
    </TaskGroup>
    <SourceCard label="من الكتاب · ص 58 · النشاط 3">
      <p>في الجدول المطبوع: القالب الأول <Frac n={4} d={4} />، والثاني <Frac n={3} d={4} />، والرابع يُكتب <Mixed w={1} n={3} d={4} /> أو <Frac n={7} d={4} />. هل يمثّل <Mixed w={1} n={3} d={4} /> و<Frac n={7} d={4} /> الكمية نفسها؟ نعم، لأن <Mixed w={1} n={3} d={4} /> = <Frac n={7} d={4} />.</p>
    </SourceCard>
    <SourceCard label="من الكتاب · ص 58 · تعبير شفهي">
      <p>كيف نميّز بين الكسر المركب والكسر العادي؟ العادي كسر واحد بسطه ومقامه، والمركب يحوي عدداً صحيحاً قبل الكسر.</p>
    </SourceCard>
  </div>
}

function ToMixedStep() {
  return <div className="l25-step-content">
    <div className="l25-step-intro"><span className="l25-step-index">03</span><div><p>الكسر الأكبر من 1 يخبرنا بعدد القالبات الكاملة، وبالباقي من القطع.</p><strong>البسط ÷ المقام: خارج القسمة هو العدد الصحيح، والباقي هو البسط الجديد.</strong></div></div>
    <SourceCard label="من الكتاب · ص 59 · كتابة الكسر العادي بشكل مركب">
      <p>الكسر <Frac n={9} d={4} /> بسطه أكبر من مقامه، لذلك يمكن كتابته مركباً:</p>
      <div className="l25-worked-example" dir="ltr">
        <span className="l25-worked-line">9 ÷ 4 = 2 والباقي 1</span>
        <span className="l25-worked-line">القسمة: 9 = 4 × 2 + 1</span>
        <span className="l25-worked-line"><Frac n={9} d={4} /> = <Mixed w={2} n={1} d={4} /></span>
      </div>
    </SourceCard>
    <DivisionLab />
    <TaskGroup title="تحقّق من فهمك: اكتب الكسر العادي بشكل مركب" page={60}>
      {checkToMixedItems.map((item) => <MixedTask key={item.id} item={item} />)}
    </TaskGroup>
    <SourceCard label="لماذا لا نكتب الباقي مقاماً جديداً؟">
      <p>المقام يحدد حجم القطعة، ولا يتغيّر عند القسمة. لذلك يبقى المقام كما هو، ويصبح البسط هو الباقي. مثال: <Frac n={11} d={4} /> = <Mixed w={2} n={3} d={4} /> لأن 11 = 4 × 2 + 3.</p>
    </SourceCard>
  </div>
}

function ToImproperStep() {
  return <div className="l25-step-content">
    <div className="l25-step-intro"><span className="l25-step-index">04</span><div><p>العدد الصحيح يحوي أقساماً كاملة. اجعل كل وحدة صحيحة قطعاً بالمقام نفسه، ثم أضف الكسر.</p><strong>w ⋅ d + n فوق المقام d.</strong></div></div>
    <SourceCard label="من الكتاب · ص 60 · كتابة الكسر المركب بشكل كسر عادي">
      <p>لنكتب <Mixed w={2} n={1} d={4} /> بشكل كسر عادي:</p>
      <div className="l25-worked-example" dir="ltr">
        <span className="l25-worked-line"><Mixed w={2} n={1} d={4} /> = 2 + <Frac n={1} d={4} /></span>
        <span className="l25-worked-line">= <Frac n={8} d={4} /> + <Frac n={1} d={4} /> = <Frac n={9} d={4} /></span>
        <span className="l25-worked-line">أو: (2 × 4 + 1) ÷ 4 = <Frac n={9} d={4} /></span>
      </div>
    </SourceCard>
    <BuildLab />
    <TaskGroup title="تحقّق من فهمك: اكتب الكسر المركب بشكل كسر عادي" page={60}>
      {checkToImproperItems.map((item) => <ImproperTask key={item.id} item={item} />)}
    </TaskGroup>
  </div>
}

function PracticeStep() {
  return <div className="l25-step-content">
    <div className="l25-step-intro"><span className="l25-step-index">05</span><div><p>جميع البنود التالية من تدريبات الكتاب في الصفحتين 60 و61. حلّ أولاً، ثم افتح طريقة الحل.</p><strong>لا تكتب الكسر المركب بمقام آخر؛ المقام يبقى كما هو.</strong></div></div>
    <TaskGroup title="التدريب 2: اكتب كل كسر عادي بشكل مركب" page={61}>
      {exerciseTwoItems.map((item) => <MixedTask key={item.id} item={item} />)}
    </TaskGroup>
    <TaskGroup title="التدريب 3: اكتب كل كسر مركب بشكل عادي" page={61}>
      {exerciseThreeItems.map((item) => <ImproperTask key={item.id} item={item} />)}
    </TaskGroup>
  </div>
}

function ApplicationsStep() {
  const [samirAnswer, setSamirAnswer] = useState<'yes' | 'no'>()
  const [childAnswer, setChildAnswer] = useState('')
  const [childChecked, setChildChecked] = useState(false)
  const childParsedMixed = parseMixedText(childAnswer)
  const childParsedFraction = parseFractionText(childAnswer)
  const childMixedOk = childChecked && (
    (childParsedMixed !== undefined && childParsedMixed.whole === 2 && childParsedMixed.numerator === 2 && childParsedMixed.denominator === 3) ||
    (childParsedFraction !== undefined && childParsedFraction.numerator === 8 && childParsedFraction.denominator === 3))
  return <div className="l25-step-content">
    <div className="l25-step-intro"><span className="l25-step-index">06</span><div><p>المسألة اللفظية تطلب تفسير الكسر أولاً، ثم اختيار الشكل المناسب له.</p><strong>اقرأ ما يعنيه العدد قبل أن تكتب شكله.</strong></div></div>
    <SourceCard label="من الكتاب · ص 61 · التدريب 4">
      <p><Prose>قال سامر لوالدته إن درجته في الاختبار هي <Mixed w={9} n={3} d={4} />، فسألته المدرّسة فقالت لها إن درجته <Frac n={39} d={4} />. هل ادّعاء سامر صحيح؟</Prose></p>
      <div className="l25-choice-row" role="group" aria-label="هل ادعاء سامر صحيح؟">
        <button type="button" className={samirAnswer === 'yes' ? 'is-picked' : ''} aria-pressed={samirAnswer === 'yes'} onClick={() => setSamirAnswer('yes')}>نعم، صحيح</button>
        <button type="button" className={samirAnswer === 'no' ? 'is-picked' : ''} aria-pressed={samirAnswer === 'no'} onClick={() => setSamirAnswer('no')}>لا، غير صحيح</button>
      </div>
      {samirAnswer && <div className={`l25-feedback ${samirAnswer === 'yes' ? 'is-correct' : 'is-hint'}`} role="status">
        <p>{samirAnswer === 'yes' ? 'صحيح.' : 'ليس صحيحاً.'} <Prose>لأن 9 × 4 + 3 = {samirClaim.improper.numerator}، فإن <Mixed w={9} n={3} d={4} /> = <Frac n={39} d={4} />.</Prose></p>
      </div>}
    </SourceCard>
    <SourceCard label="من الكتاب · ص 61 · التدريب 5">
      <p>قالب حلوى مقسّم إلى {cakeShare.pieces} قطع، تريد أمّ توزيعه على أولادها الثلاثة بالتساوي. كم ينال كل ولد من أولادها؟</p>
      <div className="l25-mixed-input" dir="ltr">
        <label className="l25-number-field"><span>اكتب الناتج كعدد مركب أو كسر عادي</span><input type="text" dir="ltr" autoComplete="off" value={childAnswer} onChange={(event) => { setChildAnswer(event.currentTarget.value); setChildChecked(false) }} aria-label="نصيب الولد الواحد" /></label>
      </div>
      <button type="button" className="l25-check" onClick={() => setChildChecked(true)}><Check size={15} aria-hidden="true" /> تحقّق</button>
      {childChecked && <div className={`l25-feedback ${childMixedOk ? 'is-correct' : 'is-hint'}`} role="status">
        <p>{childMixedOk ? 'صحيح.' : 'راجع الحساب.'}</p>
        <details className="l25-solution"><summary>طريقة الحل</summary><ol>
          <li>نقسم 8 قطع على 3 أولاد: 8 ÷ 3 = 2 والباقي 2.</li>
          <li>إذن نصيب كل ولد 2 قطعة ونصف القطعة المتبقية موزعة على 3 أجزاء، أي <Mixed w={2} n={2} d={3} />.</li>
          <li>نتحقّق: 3 × 2 + 2 = 8 ✓. ويمكن كتابة النتيجة أيضاً <Frac n={8} d={3} />.</li>
        </ol></details>
      </div>}
    </SourceCard>
  </div>
}

function SummaryStep() {
  return <div className="l25-step-content">
    <div className="l25-step-intro"><span className="l25-step-index">07</span><div><p>راجع القواعد الأساسية، ثم اختبر نفسك بالقيم التي تحتاج إلى قرار.</p><strong>المقام يبقى ثابتاً عند التحويل بين الشكلين.</strong></div></div>
    <div className="l25-summary-board">
      <article><h3>الكسر العادي</h3><p>A/B، والبسط أقل من المقام أو مساوٍ له أو أكبر منه.</p><Frac n="A" d="B" /></article>
      <article><h3>من مركب إلى عادي</h3><p>(w × d + n) ÷ d</p><Frac n="w × d + n" d="d" /></article>
      <article><h3>من عادي إلى مركب</h3><p>البسط ÷ المقام: خارج القسمة عدد صحيح، والباقي بسط جديد فوق المقام نفسه.</p><Mixed w="q" n="r" d="d" /></article>
      <article><h3>ميّز بسرعة</h3><p>إذا كان قبل الكسر عدد صحيح فهو مركب. إذا لم يكن كذلك فهو عادي.</p></article>
    </div>
    <div className="l25-challenge">
      <span className="l25-tag"><Lightbulb size={15} aria-hidden="true" /> تحدٍّ ختامي · من إعداد المنصة</span>
      <p><Prose>أيهما أكبر: <Mixed w={2} n={3} d={5} /> أم <Frac n={13} d={5} />؟ برّر إجابتك بالتحويل إلى كسر عادي بالمقام نفسه.</Prose></p>
      <details className="l25-solution"><summary>طريقة الحل</summary><ol>
        <li><Mixed w={2} n={3} d={5} /> = <Frac n={13} d={5} />، لأن 2 × 5 + 3 = 13.</li>
        <li>إذن الكسران متساويان؛ لا يوجد أكبر منهما.</li>
      </ol></details>
    </div>
    <div className="l25-next-cta"><ArrowLeft size={16} aria-hidden="true" /> انتقل إلى اختبار الدرس لتثبيت المهارات.</div>
    <p className="l25-undo-line"><RotateCcw size={13} aria-hidden="true" /> يمكنك إعادة أي نشاط بإعادة تحميل الصفحة.</p>
  </div>
}

const steps: LessonStep[] = [
  { id: 'opening', title: 'الافتتاحية', content: <OpeningStep /> },
  { id: 'definitions', title: 'الكسر العادي والكسر المركب', content: <DefinitionsStep /> },
  { id: 'comparison', title: 'المقارنة بالواحد', content: <ComparisonStep /> },
  { id: 'to-mixed', title: 'من عادي إلى مركب', content: <ToMixedStep /> },
  { id: 'to-improper', title: 'من مركب إلى عادي', content: <ToImproperStep /> },
  { id: 'practice', title: 'تدريبات الكتاب', content: <PracticeStep /> },
  { id: 'applications', title: 'تطبيقات وتفكير', content: <ApplicationsStep /> },
  { id: 'summary', title: 'الملخص والتحدي', content: <SummaryStep /> },
]

export function FractionsTwoLesson() {
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title="الكسور (2)" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="l25-lesson" />
}

