import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, CircleAlert, Lightbulb, Play, RotateCcw, Sparkles, Target, Timer, Waves } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import {
  leastCommonMultipleBookElements,
  leastCommonMultipleBookTasks,
  leastCommonMultipleQuestionGroups,
  type LcmBookResponse,
  type LeastCommonMultipleBookElement,
} from './leastCommonMultipleData'

const byId = new Map(leastCommonMultipleBookElements.map(element => [element.id, element]))
const tasksByGroup = new Map<string, LeastCommonMultipleBookElement[]>(
  leastCommonMultipleQuestionGroups.map(group => [
    group.id,
    leastCommonMultipleBookTasks.filter(task => task.groupId === group.id),
  ]),
)
const teachingById = (id: string) => byId.get(id)!

/* ------------- helpers ------------- */

function parseNumber(value: string): number[] {
  return value
    .replace(/[٠-٩]/gu, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/gu, digit => String(digit.charCodeAt(0) - 0x06f0))
    .split(/[\s,،٬;؛|\n]+/u)
    .map(part => Number(part.replace(/\D/gu, '')))
    .filter(n => Number.isFinite(n))
}
function samePrefix(list: number[], expectedPrefix: readonly number[]): boolean {
  if (list.length < expectedPrefix.length) return false
  return expectedPrefix.every((value, index) => list[index] === value)
}

/* ------------- visual: multiples strips (rebuilt from the textbook) ------------- */

function MultiplesStrip({
  visualId,
  title,
  sequences,
  highlight,
  maxCells = 12,
}: {
  visualId: string
  title: string
  sequences: ReadonlyArray<{ label: string; color: 'indigo' | 'amber' | 'teal' | 'violet'; start: number; step: number }>
  highlight?: ReadonlySet<number>
  maxCells?: number
}) {
  // Build cells up to maxCells for each sequence.
  const rows = sequences.map(seq => ({
    ...seq,
    cells: Array.from({ length: maxCells }, (_, i) => seq.start + seq.step * i),
  }))
  // find a common maximum to display
  const maxVal = Math.max(...rows.flatMap(r => r.cells))
  return <div className="l11-strip-wrap" data-source-visual={visualId} role="region" aria-label={title}>
    <p className="l11-strip-caption"><Timer size={15} aria-hidden="true" /> {title}</p>
    <div className="l11-strip-stack" dir="ltr">
      {rows.map(row => <div key={row.label} className={`l11-strip-row is-${row.color}`} aria-label={`مضاعفات ${row.step} بدءاً من ${row.start}`}>
        <span className="l11-strip-label">×{row.step}</span>
        <div className="l11-strip-cells">
          {row.cells.map((value, index) => {
            const isCommon = highlight?.has(value)
            return <span key={`${row.label}-${index}`} className={`l11-cell ${isCommon ? 'is-common' : ''}`}>
              <MathExpression>{value}</MathExpression>
            </span>
          })}
          <span className="l11-cell is-ellipsis" aria-hidden="true">…</span>
        </div>
      </div>)}
    </div>
    <p className="l11-strip-note">
      <Lightbulb size={14} aria-hidden="true" />
      <span>الخانات المضيئة (الذهبية) تمثل الأعداد المشتركة في القوائم المعروضة. الأكبر قيمة معروضة حتى <MathExpression>{maxVal}</MathExpression>.</span>
    </p>
  </div>
}

function SourceVisuals({ ids }: { ids: readonly string[] }) {
  if (ids.includes('p52-multiples-strip-2')) return <MultiplesStrip
    visualId="p52-multiples-strip-2"
    title="ستة مضاعفات متتالية للعدد 2 بدءاً من المضاعف الأول"
    sequences={[{ label: '2', color: 'indigo', start: 2, step: 2 }]}
    maxCells={6}
  />
  if (ids.includes('p52-multiples-strip-3')) return <MultiplesStrip
    visualId="p52-multiples-strip-3"
    title="ستة مضاعفات متتالية للعدد 3 بدءاً من المضاعف الأول"
    sequences={[{ label: '3', color: 'indigo', start: 3, step: 3 }]}
    maxCells={6}
  />
  if (ids.includes('p52-multiples-strips-3-4')) return <MultiplesStrip
    visualId="p52-multiples-strips-3-4"
    title="مضاعفات 3 و4 مع إبراز اللحظات المشتركة"
    sequences={[
      { label: '3', color: 'indigo', start: 0, step: 3 },
      { label: '4', color: 'teal', start: 0, step: 4 },
    ]}
    highlight={new Set([0, 12, 24, 36])}
    maxCells={13}
  />
  if (ids.includes('p52-multiples-strips-3-5')) return <MultiplesStrip
    visualId="p52-multiples-strips-3-5"
    title="مضاعفات 3 و5 وأول مشترك أكبر من الصفر"
    sequences={[
      { label: '3', color: 'indigo', start: 3, step: 3 },
      { label: '5', color: 'amber', start: 5, step: 5 },
    ]}
    highlight={new Set([15])}
    maxCells={8}
  />
  if (ids.includes('p53-multiples-strips-4-6-8')) return <MultiplesStrip
    visualId="p53-multiples-strips-4-6-8"
    title="مضاعفات 4 و6 و8 — أول مشترك بين الثلاثة هو 24"
    sequences={[
      { label: '4', color: 'indigo', start: 4, step: 4 },
      { label: '6', color: 'violet', start: 6, step: 6 },
      { label: '8', color: 'teal', start: 8, step: 8 },
    ]}
    highlight={new Set([24, 48])}
    maxCells={12}
  />
  if (ids.includes('p53-multiples-strips-4-5')) return <MultiplesStrip
    visualId="p53-multiples-strips-4-5"
    title="مضاعفات 4 و5 (أسابيع رش المبيدات) — أول تطابق بعد الصفر"
    sequences={[
      { label: '4', color: 'teal', start: 4, step: 4 },
      { label: '5', color: 'amber', start: 5, step: 5 },
    ]}
    highlight={new Set([20])}
    maxCells={8}
  />
  if (ids.includes('p53-multiples-strips-8-5-4')) return <MultiplesStrip
    visualId="p53-multiples-strips-8-5-4"
    title="مضاعفات 8 و5 و4 — أول مشترك بين الثلاثة هو 40"
    sequences={[
      { label: '8', color: 'indigo', start: 8, step: 8 },
      { label: '5', color: 'amber', start: 5, step: 5 },
      { label: '4', color: 'teal', start: 4, step: 4 },
    ]}
    highlight={new Set([40])}
    maxCells={11}
  />
  return null
}

/* ------------- Source element card ------------- */

function SourceElementCard({ id }: { id: string }) {
  const element = teachingById(id)
  return <div className="l11-source-element" data-source-id={element.id}>
    <SourceCard label={`من الكتاب · ص ${element.page} · ${element.section}`}>
      <h3 className="l11-source-title">{element.title}</h3>
      <p className="l11-printed-text"><BidiText>{element.prompt}</BidiText></p>
      <SourceVisuals ids={element.visualAssetIds} />
      <div className="l11-platform-explanation">
        <p className="l11-platform-label"><Lightbulb size={16} aria-hidden="true" /> شرح المنصة</p>
        <ol>{element.reasoning.map((line, index) => <li key={`${element.id}-r${index}`}><BidiText>{line}</BidiText></li>)}</ol>
        <p className="l11-result-line"><strong>الخلاصة:</strong> <BidiText>{element.answer}</BidiText></p>
        <p className="l11-check-line"><Check size={15} aria-hidden="true" /><span><strong>تحقّق:</strong> <BidiText>{element.verification}</BidiText></span></p>
        <p className="l11-pitfall"><CircleAlert size={15} aria-hidden="true" /><span><strong>انتبه:</strong> <BidiText>{element.pitfall}</BidiText></span></p>
      </div>
    </SourceCard>
  </div>
}

/* ------------- Question group / task rows ------------- */

function QuestionGroup({ groupId }: { groupId: string }) {
  const group = leastCommonMultipleQuestionGroups.find(candidate => candidate.id === groupId)
  const tasks = tasksByGroup.get(groupId) ?? []
  if (!group || tasks.length === 0) return null
  if (groupId === 'l11-p52-launch') return <LaunchGroup group={group} tasks={tasks} />
  if (groupId === 'l11-p52-laser') return <LaserGroup group={group} tasks={tasks} />
  return <StandardGroup group={group} tasks={tasks} />
}

function StandardGroup({
  group,
  tasks,
}: {
  group: (typeof leastCommonMultipleQuestionGroups)[number]
  tasks: LeastCommonMultipleBookElement[]
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const update = (id: string, value: string) => { setAnswers(prev => ({ ...prev, [id]: value })); setChecked(false) }
  const isVerbal = tasks[0].response?.kind === 'verbal-answer' || tasks[0].response?.kind === 'explain'
  return <section className="l11-question-group" data-source-group={group.id} aria-labelledby={`${group.id}-title`}>
    <div className="l11-group-heading">
      <span className="l11-source-tag">من الكتاب · ص {group.page}</span>
      <h3 id={`${group.id}-title`}>{group.title}</h3>
    </div>
    <p className="l11-group-prompt"><BidiText>{tasks[0].prompt}</BidiText></p>
    <div className="l11-task-list">
      {tasks.map(task => <TaskRow key={task.id} task={task} value={answers[task.id] ?? ''} checked={checked} onChange={value => update(task.id, value)} />)}
    </div>
    {isVerbal && <p className="l11-hint-text"><strong>إرشاد المنصة:</strong> اكتب شرحك بكلماتك، ثم قارنه بخطوات الحل الكامل بعد الضغط على «تحقّق».</p>}
    <button type="button" className="l11-check-button" onClick={() => setChecked(true)}>
      <Check size={17} aria-hidden="true" /> تحقّق من الإجابات
    </button>
    {checked && <p className="l11-group-feedback" role="status">
      {tasks.every(task => {
        const res = task.response!
        if (res.kind === 'verbal-answer' || res.kind === 'explain') return (answers[task.id] ?? '').trim().length > 5
        if (res.kind === 'lcm') return Number(answers[task.id]?.replace(/\D/gu, '')) === res.expected
        if (res.kind === 'common-times') {
          const vals = parseNumber(answers[task.id] ?? '')
          return vals.length >= 3 && vals.slice(0, 3).every((v, i) => v === res.expected[i])
        }
        if (res.kind === 'list-multiples') return samePrefix(parseNumber(answers[task.id] ?? ''), res.expectedStart)
        return false
      })
        ? 'أحسنت. راجع خطوات الحل الكاملة لتتأكد من سبب اختيار العدد، لا من مطابقة الناتج فقط.'
        : 'ظهرت ملاحظة؛ استخدم التلميحات تحت كل بند وراجع شرح المنصة ثم أعد المحاولة.'}
    </p>}
  </section>
}

function LaunchGroup({ group, tasks }: { group: (typeof leastCommonMultipleQuestionGroups)[number]; tasks: LeastCommonMultipleBookElement[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  return <section className="l11-question-group is-launch" data-source-group={group.id} aria-labelledby={`${group.id}-title`}>
    <div className="l11-group-heading"><span className="l11-source-tag">من الكتاب · ص {group.page}</span><h3 id={`${group.id}-title`}>{group.title}</h3></div>
    <p className="l11-group-prompt"><BidiText>{tasks[0].prompt}</BidiText></p>
    <div className="l11-task-list">
      {tasks.map(task => <TaskRow key={task.id} task={task} value={answers[task.id] ?? ''} checked={checked} onChange={value => { setAnswers(prev => ({ ...prev, [task.id]: value })); setChecked(false) }} />)}
    </div>
    <button type="button" className="l11-check-button" onClick={() => setChecked(true)}><Check size={17} aria-hidden="true" /> تحقّق من المضاعفات</button>
    {checked && <p className="l11-group-feedback" role="status">المضاعفات تبدأ بالعدد نفسه (ضرب العدد في 1)، ثم يضاف العدد في كل مرة. راجع الشريط الملوّن.</p>}
  </section>
}

function LaserGroup({ group, tasks }: { group: (typeof leastCommonMultipleQuestionGroups)[number]; tasks: LeastCommonMultipleBookElement[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({ [tasks[0].id]: '' })
  const [checked, setChecked] = useState(false)
  return <section className="l11-question-group is-laser" data-source-group={group.id} aria-labelledby={`${group.id}-title`}>
    <div className="l11-group-heading"><span className="l11-source-tag">من الكتاب · ص {group.page}</span><h3 id={`${group.id}-title`}>{group.title}</h3></div>
    <p className="l11-group-prompt"><BidiText>{tasks[0].prompt}</BidiText></p>
    <SourceVisuals ids={['p52-multiples-strips-3-4']} />
    <div className="l11-task-list">
      {tasks.map(task => <TaskRow key={task.id} task={task} value={answers[task.id] ?? ''} checked={checked} onChange={value => { setAnswers(prev => ({ ...prev, [task.id]: value })); setChecked(false) }} />)}
    </div>
    <button type="button" className="l11-check-button" onClick={() => setChecked(true)}><Check size={17} aria-hidden="true" /> تحقّق من إجابات الليزر</button>
    {checked && <p className="l11-group-feedback" role="status">تذكّر: الصفر (اللحظة 0) مشترك دائماً لكنه لا يُعدّ في الجواب النهائي لأنه لحظة البداية.</p>}
    {tasks.map(task => <SolutionDisclosure key={`sol-${task.id}`} element={task} />)}
  </section>
}

function TaskRow({
  task, value, checked, onChange,
}: {
  task: LeastCommonMultipleBookElement; value: string; checked: boolean; onChange: (v: string) => void
}) {
  const response = task.response!
  const result = checked ? evaluate(task, value) : undefined
  return <article className="l11-task-row" data-source-id={task.id}>
    <div className="l11-task-source">
      <span className="l11-task-branch">{task.branch ?? '•'}</span>
      <span className="l11-task-source-text"><BidiText>{task.sourceText ?? task.title}</BidiText></span>
    </div>
    {task.visualAssetIds.length > 0 && <SourceVisuals ids={task.visualAssetIds} />}
    <div className="l11-task-response">
      {(response.kind === 'lcm' || response.kind === 'list-multiples' || response.kind === 'common-times') && <label className="l11-control-label" htmlFor={`${task.id}-input`}>
        {response.kind === 'lcm' ? 'المضاعف المشترك الأصغر' : response.kind === 'common-times' ? 'ثلاثة أزمنة مشتركة (افصل بينها بفاصلة)' : 'المضاعفات الستة (افصل بينها بفاصلة)'}
        <input id={`${task.id}-input`} type="text" inputMode={response.kind === 'lcm' ? 'numeric' : 'text'} dir="ltr" value={value} onChange={e => onChange(e.currentTarget.value)}
          placeholder={response.kind === 'lcm' ? 'أدخل عدداً' : 'مثال: 12 ، 24 ، 36'} />
      </label>}
      {response.kind === 'verbal-answer' && <label className="l11-control-label" htmlFor={`${task.id}-explain`}>
        إجابتك الشفهية (اكتبها هنا)
        <textarea id={`${task.id}-explain`} dir="rtl" rows={2} value={value} onChange={e => onChange(e.currentTarget.value)} placeholder="ماذا نكتب؟ بماذا نبدأ؟ كيف نختار من بين القوائم؟" />
      </label>}
    </div>
    {checked && <Feedback task={task} value={value} result={result} />}
    <SolutionDisclosure element={task} />
  </article>
}

function Feedback({ task, value, result }: { task: LeastCommonMultipleBookElement; value: string; result: boolean | undefined | 'verbal' }) {
  if (task.response?.kind === 'verbal-answer') {
    const hasText = value.trim().length > 5
    return <p className="l11-task-feedback is-guidance" role="status"><Lightbulb size={15} aria-hidden="true" /><span>{hasText ? 'قارن إجابتك بخطوات الحل الكامل أدناه؛ الأهم: ثلاث قوائم، أول مشترك بينها جميعاً.' : 'ابدأ بوصف القاعدة، ثم اذكر كيف تختلف الحالة عندما نزيد عدد الأعداد من اثنين إلى ثلاثة.'}</span></p>
  }
  if (result === undefined) return <p className="l11-task-feedback is-guidance" role="status">اكتب إجابتك ثم اضغط «تحقّق». {task.verification}</p>
  if (result === true) return <p className="l11-task-feedback is-correct" role="status"><Check size={15} aria-hidden="true" /> إجابة صحيحة. {task.verification}</p>
  return <p className="l11-task-feedback is-hint" role="status"><CircleAlert size={15} aria-hidden="true" /> تلميح: {task.pitfall}</p>
}

function SolutionDisclosure({ element }: { element: LeastCommonMultipleBookElement }) {
  return <details className="l11-solution-disclosure">
    <summary>اكشف الحل الكامل خطوةً خطوة</summary>
    <div className="l11-solution-content">
      <dl className="l11-solution-frame">
        <div><dt>المعطيات</dt><dd><BidiText>{element.given}</BidiText></dd></div>
        <div><dt>المطلوب</dt><dd><BidiText>{element.required}</BidiText></dd></div>
        <div><dt>القاعدة</dt><dd><BidiText>{element.rule}</BidiText></dd></div>
        <div><dt>لماذا تنطبق؟</dt><dd><BidiText>{element.why}</BidiText></dd></div>
      </dl>
      <ol>{element.reasoning.map((line, index) => <li key={`${element.id}-sl${index}`}><BidiText>{line}</BidiText></li>)}</ol>
      <p className="l11-result-line"><strong>الإجابة النهائية:</strong> <BidiText>{element.answer}</BidiText></p>
      <p className="l11-check-line"><Check size={15} aria-hidden="true" /><span><strong>التحقّق:</strong> <BidiText>{element.verification}</BidiText></span></p>
      <p className="l11-pitfall"><CircleAlert size={15} aria-hidden="true" /><span><strong>خطأ شائع:</strong> <BidiText>{element.pitfall}</BidiText></span></p>
    </div>
  </details>
}

function evaluate(task: LeastCommonMultipleBookElement, value: string): boolean | undefined | 'verbal' {
  const response = task.response
  if (!response) return undefined
  if (response.kind === 'verbal-answer') return 'verbal'
  if (response.kind === 'lcm') {
    const n = Number(value.replace(/[٠-٩]/gu, d => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/gu, d => String(d.charCodeAt(0) - 0x06f0)).replace(/\D/gu, ''))
    return Number.isFinite(n) ? n === response.expected : undefined
  }
  if (response.kind === 'list-multiples') return samePrefix(parseNumber(value), response.expectedStart)
  if (response.kind === 'common-times') {
    const vals = parseNumber(value)
    if (vals.length < 3) return undefined
    return response.expected.every((v, i) => vals[i] === v)
  }
  return undefined
}

/* ------------- Interactive labs ------------- */

function PulseMetronome() {
  /** Two pulse trains that the learner can tune; highlights the beats where both flash together. */
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [running, setRunning] = useState(false)
  const [tick, setTick] = useState(0)
  const timerRef = useRef<number | null>(null)
  const seconds = Math.min(tick, a * b * 2)
  const flashA = seconds % a === 0
  const flashB = seconds % b === 0
  const lcmVal = useMemo(() => {
    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y))
    return (a * b) / gcd(a, b)
  }, [a, b])
  useEffect(() => {
    if (!running) return
    timerRef.current = window.setInterval(() => setTick(t => t + 1), 700)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [running])
  const reset = () => { setRunning(false); setTick(0) }
  return <div className="l11-interaction-card">
    <span className="l11-platform-badge"><Waves size={15} aria-hidden="true" /> مختبر النبضات · من إعداد المنصة</span>
    <h3>مترونوم النبضات: متى يومض النبضان معاً؟</h3>
    <p>اضبط دورتَي النبض (بين 2 و9)، ثم شغّل المترونوم. سترى وميضاً ذهبياً عندما يتطابق الزمنان.</p>
    <div className="l11-metro-controls">
      <label className="l11-dial">الدورة الأولى (ثواني)
        <input type="number" min={2} max={9} value={a} onChange={e => { reset(); setA(Number(e.currentTarget.value) || 2) }} />
      </label>
      <label className="l11-dial">الدورة الثانية (ثواني)
        <input type="number" min={2} max={9} value={b} onChange={e => { reset(); setB(Number(e.currentTarget.value) || 2) }} />
      </label>
      <div className="l11-metro-actions">
        <button type="button" className="l11-check-button" onClick={() => setRunning(r => !r)}>{running ? 'إيقاف' : 'تشغيل'} <Play size={15} aria-hidden="true" /></button>
        <button type="button" className="l11-reset-button" onClick={reset}><RotateCcw size={15} aria-hidden="true" /> إعادة</button>
      </div>
    </div>
    <div className="l11-metro-stage" dir="ltr" aria-live="polite">
      <div className={`l11-beacon is-indigo ${flashA ? 'is-flash' : ''}`} aria-label={flashA ? 'النبض الأول يومض الآن' : 'النبض الأول لا يومض'}><span>النبض أ</span><strong>كل {a} ث</strong></div>
      <div className="l11-metro-timeline" aria-hidden="true">
        {Array.from({ length: lcmVal * 2 + 1 }, (_, i) => {
          const isA = i % a === 0
          const isB = i % b === 0
          return <span key={i} className={`l11-tick ${isA ? 'is-a' : ''} ${isB ? 'is-b' : ''} ${isA && isB ? 'is-both' : ''} ${i === seconds ? 'is-now' : ''}`}>{i}</span>
        })}
      </div>
      <div className={`l11-beacon is-teal ${flashB ? 'is-flash' : ''}`} aria-label={flashB ? 'النبض الثاني يومض الآن' : 'النبض الثاني لا يومض'}><span>النبض ب</span><strong>كل {b} ث</strong></div>
    </div>
    <p className="l11-lab-note">المضاعف المشترك الأصغر للعددين {a} و{b} هو <strong><MathExpression>{lcmVal}</MathExpression></strong>، وهذا هو أول زمن (بعد الصفر) يومض فيه النبضان معاً.</p>
  </div>
}

function MultiplesExplorer() {
  /** Learner types up to three numbers and gets live multiples strips with common values highlighted. */
  const [aStr, setAStr] = useState('4')
  const [bStr, setBStr] = useState('6')
  const [cStr, setCStr] = useState('8')
  const clamp = (v: string) => Math.max(2, Math.min(15, Number(v.replace(/\D/gu, '')) || 2))
  const a = clamp(aStr); const b = clamp(bStr); const c = clamp(cStr)
  const triples = useMemo(() => {
    const out: number[] = []
    for (let n = 1; n <= 300; n += 1) if (n % a === 0 && n % b === 0 && n % c === 0) out.push(n)
    return out
  }, [a, b, c])
  const lcm3 = triples[0]
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y))
  const lcm2 = (x: number, y: number) => (x * y) / gcd(x, y)
  return <div className="l11-interaction-card">
    <span className="l11-platform-badge"><Target size={15} aria-hidden="true" /> مختبر المضاعفات · من إعداد المنصة</span>
    <h3>جرّب أعدادك: المضاعفات تمتد… وأول لقاء؟</h3>
    <p>اختر ثلاثة أعداد بين 2 و15، وشاهد شرائط المضاعفات تتمدد أمامك مع إبراز أول مشترك بينها.</p>
    <div className="l11-explorer-inputs">
      <label>العدد الأول
        <input type="number" min={2} max={15} dir="ltr" value={aStr} onChange={e => setAStr(e.currentTarget.value)} />
      </label>
      <label>العدد الثاني
        <input type="number" min={2} max={15} dir="ltr" value={bStr} onChange={e => setBStr(e.currentTarget.value)} />
      </label>
      <label>العدد الثالث
        <input type="number" min={2} max={15} dir="ltr" value={cStr} onChange={e => setCStr(e.currentTarget.value)} />
      </label>
    </div>
    <MultiplesStrip
      visualId="l11-explorer-strips"
      title={`مضاعفات ${a} و${b} و${c} — أول مشترك بين الثلاثة`}
      sequences={[
        { label: String(a), color: 'indigo', start: a, step: a },
        { label: String(b), color: 'violet', start: b, step: b },
        { label: String(c), color: 'teal', start: c, step: c },
      ]}
      highlight={new Set(triples.slice(0, 3))}
      maxCells={15}
    />
    <p className="l11-lab-note">م.م.أ (<MathExpression>{a}</MathExpression>، <MathExpression>{b}</MathExpression>، <MathExpression>{c}</MathExpression>) = <strong><MathExpression>{lcm3}</MathExpression></strong>. للمقارنة: م.م.أ(<MathExpression>{a}</MathExpression>،<MathExpression>{b}</MathExpression>) = <MathExpression>{lcm2(a,b)}</MathExpression>.</p>
  </div>
}

function CommonMultipleSort() {
  /** Given two numbers, sort candidate values into "مشترك" vs "ليس مشتركاً". */
  const pool = useMemo(() => {
    // fixed problem: LCM(6, 8) = 24
    const items = [8, 12, 16, 24, 32, 36, 48, 60]
    return items.map((v, i) => ({ id: `p${i}`, value: v, isCommon: v % 6 === 0 && v % 8 === 0 })).sort(() => Math.random() - 0.5)
  }, [])
  const [chosen, setChosen] = useState<Record<string, 'common' | 'not' | null>>({})
  const [checked, setChecked] = useState(false)
  const assign = (id: string, col: 'common' | 'not') => { setChosen(prev => ({ ...prev, [id]: col })); setChecked(false) }
  const correct = pool.every(p => chosen[p.id] === (p.isCommon ? 'common' : 'not'))
  return <div className="l11-interaction-card">
    <span className="l11-platform-badge"><Sparkles size={15} aria-hidden="true" /> فرز المضاعفات · من إعداد المنصة</span>
    <h3>أيها مضاعف مشترك للعددين 6 و8؟</h3>
    <p>انقل كل بطاقة إلى عمود «مشترك» إذا كانت تقبل القسمة على 6 و8 معاً، أو إلى «ليس مشتركاً» إن لم تحقق الشرط.</p>
    <div className="l11-sort-board" dir="ltr">
      <div className="l11-sort-col is-pool" aria-label="البطاقات غير المصنفة">
        <p className="l11-sort-col-title">البطاقات</p>
        <div className="l11-sort-cards">
          {pool.filter(p => !chosen[p.id]).map(p => <button type="button" key={p.id} className="l11-sort-card" onClick={() => assign(p.id, 'common')}><MathExpression>{p.value}</MathExpression></button>)}
        </div>
      </div>
      <div className="l11-sort-col is-common" aria-label="مشترك">
        <p className="l11-sort-col-title">مشترك</p>
        <div className="l11-sort-cards">
          {pool.filter(p => chosen[p.id] === 'common').map(p => <button type="button" key={p.id} className={`l11-sort-card ${checked && !p.isCommon ? 'is-wrong' : checked && p.isCommon ? 'is-right' : ''}`} onClick={() => assign(p.id, 'not')}><MathExpression>{p.value}</MathExpression></button>)}
        </div>
      </div>
      <div className="l11-sort-col is-not" aria-label="ليس مشتركاً">
        <p className="l11-sort-col-title">ليس مشتركاً</p>
        <div className="l11-sort-cards">
          {pool.filter(p => chosen[p.id] === 'not').map(p => <button type="button" key={p.id} className={`l11-sort-card ${checked && p.isCommon ? 'is-wrong' : checked && !p.isCommon ? 'is-right' : ''}`} onClick={() => assign(p.id, 'common')}><MathExpression>{p.value}</MathExpression></button>)}
        </div>
      </div>
    </div>
    <div className="l11-sort-actions">
      <button type="button" className="l11-check-button" disabled={Object.keys(chosen).length !== pool.length} onClick={() => setChecked(true)}><Check size={16} aria-hidden="true" /> تحقّق من الفرز</button>
      <button type="button" className="l11-reset-button" onClick={() => { setChosen({}); setChecked(false) }}><RotateCcw size={16} aria-hidden="true" /> إعادة</button>
    </div>
    {checked && <p className={correct ? 'l11-task-feedback is-correct' : 'l11-task-feedback is-hint'} role="status">
      {correct ? 'أحسنت. لاحظ أن 24 هو الأصغر بين البطاقات المشتركة — وهذا هو م.م.أ (6 ، 8).' : 'راجع البطاقات الحمراء: العدد المشترك يقبل القسمة على 6 و8 معاً دون باقٍ.'}
    </p>}
  </div>
}

/* ------------- Steps ------------- */

function StudentOpening() {
  const goals = teachingById('l11-p52-goals')
  return <div className="l11-step-content">
    <div className="l11-hero-panel">
      <div className="l11-hero-mark" aria-hidden="true"><span className="l11-pulse-glyph">⌁</span><small>نبضتان<br />تلتقيان</small></div>
      <div>
        <p className="l11-eyebrow">الوحدة الثانية · الدرس الثالث · ص 52–53</p>
        <span className="l11-platform-badge"><Sparkles size={15} aria-hidden="true" /> سؤال تمهيدي من إعداد المنصة</span>
        <h3>إذا التقت نبضتان… فمتى يعود اللقاء؟</h3>
        <p>في هذا الدرس نتابع إيقاعات الأعداد ونكتشف كيف «تتزامن» مضاعفات الأعداد المختلفة. عندما تضرب الساعة دقّاتها، أو يضيء ليزران معاً، أو يعود رشّ المبيدات — نحن في الواقع نبحث عن <strong>المضاعف المشترك الأصغر</strong>.</p>
      </div>
    </div>
    <SourceElementCard id={goals.id} />
    <div className="l11-goal-and-why">
      <article><span className="l11-platform-badge">تطبيق من إعداد المنصة</span><Timer size={20} aria-hidden="true" /><h3>لماذا هذا الدرس؟</h3><p>لنقرر متى تتكرر الأحداث الدورية (إضاءة، مواعيد، رش، إشارات) معاً، وليكون أساساً لجمع وطرح الكسور في الدروس القادمة.</p></article>
      <article><span className="l11-platform-badge">أهداف التعلّم بصياغة المنصة</span><Check size={20} aria-hidden="true" /><h3>في نهاية الدرس ستستطيع</h3><ul><li>كتابة مضاعفات أي عدد طبيعي حتى المضاعف المطلوب.</li><li>إيجاد المضاعفات المشتركة بين عددين أو ثلاثة.</li><li>تحديد المضاعف المشترك الأصغر (م.م.أ) من القوائم.</li><li>حل مسائل حياتية دورية باستعمال م.م.أ.</li></ul></article>
    </div>
    <div className="l11-discovery-card">
      <span className="l11-platform-badge"><Sparkles size={15} aria-hidden="true" /> قبل القاعدة: توقّع</span>
      <h3>نبض كل 3 ثوانٍ وآخر كل 4 ثوانٍ… متى يلتقيان من جديد؟</h3>
      <p>يضيء المصباح «أ» كل 3 ثوانٍ، والمصباح «ب» كل 4 ثوان. إذا أضاءا معاً الآن، فبعد كم ثانية سيضيئان معاً مرة أخرى؟ لا تحسب بعد، خمّن، ثم سنكتشف الجواب في الخطوة التالية.</p>
      <div className="l11-discovery-options" role="group" aria-label="توقّع أول زمن لقاء">
        {[6, 12, 24, 7].map(n => <PredictionButton key={n} n={n} answer={12} />)}
      </div>
    </div>
    <p className="l11-source-note">السؤال التمهيدي وبطاقة «توقّع» من إعداد المنصة، وليسا مأخوذين من الكتاب.</p>
  </div>
}
function PredictionButton({ n, answer }: { n: number; answer: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const isSel = selected === n
  const show = selected !== null
  return <button type="button" className={isSel ? 'is-selected' : ''} aria-pressed={isSel} onClick={() => setSelected(n)}>
    <MathExpression>{n}</MathExpression><span>{show ? (n === answer ? 'توقّع صحيح' : 'ليس بعد — تابع الشرح') : 'ثانية'}</span>
  </button>
}

function LaunchStep() {
  return <div className="l11-step-content">
    <p className="l11-step-lead"><strong>شرح المنصة:</strong> قبل أن نوجد «المشترك»، نحتاج إتقان كتابة المضاعفات. المضاعف الأول هو العدد نفسه، ثم نضيفه في كل مرة.</p>
    <QuestionGroup groupId="l11-p52-launch" />
    <div className="l11-why-box"><Lightbulb size={19} aria-hidden="true" /><p><strong>تذكير المنصة:</strong> المضاعف الأول دائماً هو العدد نفسه (ضربه في 1)، وليس الصفر — إلا عندما تطلب المسألة إدراج اللحظة 0 كما في مثال الليزر.</p></div>
  </div>
}

function LaserStep() {
  return <div className="l11-step-content">
    <p className="l11-step-lead"><strong>شرح المنصة:</strong> نكتب المضاعفات ثم نبحث عن أول لقاء. هذه هي التجربة التي ستولّد لنا القاعدة.</p>
    <SourceElementCard id="l11-p52-laser-setup" />
    <QuestionGroup groupId="l11-p52-laser" />
  </div>
}

function DefinitionStep() {
  return <div className="l11-step-content">
    <SourceElementCard id="l11-p52-definition" />
    <div className="l11-why-box"><Lightbulb size={19} aria-hidden="true" /><p><strong>لماذا نستبعد الصفر؟</strong> الصفر مضاعف مشترك لأي عددين، لكنه يمثل لحظة البداية فقط، والسؤال عادةً «متى يحدث اللقاء من جديد؟» لذلك نطلب أول لقاء بعد الصفر.</p></div>
    <QuestionGroup groupId="l11-p52-ex3-5" />
  </div>
}

function ThreeNumbersStep() {
  return <div className="l11-step-content">
    <p className="l11-step-lead"><strong>شرح المنصة:</strong> نفس الطريقة تعمل مع أكثر من عددين — نزيد قائمة واحدة ونبحث عن مشترك بينها جميعاً.</p>
    <QuestionGroup groupId="l11-p53-ex4-6-8" />
    <SourceElementCard id="l11-p53-rule-pinned" />
  </div>
}

function RealLifeStep() {
  return <div className="l11-step-content">
    <p className="l11-step-lead"><strong>شرح المنصة:</strong> المضاعف المشترك الأصغر يحل مسائل حقيقية: دورات مبيدات، ومواعيد حافلات، وإشارات مرور، وجدول حصص.</p>
    <QuestionGroup groupId="l11-p53-farmer" />
  </div>
}

function VerbalCheckStep() {
  return <div className="l11-step-content">
    <p className="l11-step-lead"><strong>إرشاد المنصة:</strong> عبّر بكلماتك كيف ستتصرّف عند وجود ثلاثة أعداد، ثم تحقق من فهمك بمثال.</p>
    <QuestionGroup groupId="l11-p53-verbal-grp" />
    <QuestionGroup groupId="l11-p53-check-grp" />
  </div>
}

function DrillStep() {
  return <div className="l11-step-content">
    <p className="l11-step-lead"><strong>إرشاد المنصة:</strong> في الأسطر التسعة، ستلاحظ نمطاً: نحن نضرب م.م.أ للأعداد الصغيرة في 10 أو 100 عندما نكبر الأعداد بمنزلة. هذا ليس صدفة!</p>
    <QuestionGroup groupId="l11-p53-drill" />
    <div className="l11-pattern-note"><strong>ملاحظة نمط:</strong><span>لاحظ التسلسل: م.م.أ(20,30)=60؛ م.م.أ(200,300)=600؛ م.م.أ(2000,3000)=6000. إضافة صفر إلى كل عدد تضيف صفراً إلى الناتج لأن الوحدة الكبرى تصبح أكبر بعشر مرات.</span></div>
  </div>
}

function PlatformLabsStep() {
  return <div className="l11-step-content">
    <p className="l11-step-lead">الأنشطة التالية جديدة من إعداد المنصة؛ ليست أسئلة مطبوعة ولا تدخل في سجل تمارين الكتاب.</p>
    <PulseMetronome />
    <MultiplesExplorer />
    <CommonMultipleSort />
  </div>
}

function RecapStep() {
  return <div className="l11-step-content">
    <div className="l11-recap-card">
      <span className="l11-platform-badge"><Sparkles size={15} aria-hidden="true" /> خلاصة المنصة</span>
      <h3>خريطة المضاعف المشترك الأصغر في 4 خطوات</h3>
      <ol>
        <li><strong>اكتب المضاعفات:</strong> ابدأ من العدد نفسه (أو من 0 إذا كانت المسألة تذكر لحظة بداية مشتركة).</li>
        <li><strong>ابحث عن المشترك:</strong> دوّن الأعداد التي تقع في جميع القوائم.</li>
        <li><strong>استبعد الصفر:</strong> ما لم يُطلب غير ذلك، نريد أول تطابق بعد البداية.</li>
        <li><strong>تحقّق:</strong> اقسم الناتج على كل عدد من الأعداد المعطاة؛ يجب أن ينتج عدداً صحيحاً دون باقٍ.</li>
      </ol>
    </div>
    <div className="l11-final-thought"><CircleAlert size={19} aria-hidden="true" /><p><strong>اختبار ذاتي:</strong> إذا أعطاك زميلك ثلاثة أعداد، هل تستطيع أن تعد المضاعفات ذهنياً لتصل إلى أول لقاء؟ هل تتحقق من أن العدد يقبل القسمة على الثلاثة؟ إذا نعم، أنت جاهز لاختبار الدرس.</p></div>
    <a className="l11-independent-test-link" href="#tests/run/lesson-least-common-multiple-test">انتقل إلى اختبار الدرس المستقل · 20 سؤالاً <span className="l11-link-arrow" aria-hidden="true">←</span></a>
    <p className="l11-source-note">الاختبار مستقل عن هذا الدرس، وحلوله لا تظهر إلا بعد تسليم المحاولة وفق نظام المنصة.</p>
  </div>
}

export function LeastCommonMultipleLesson() {
  const steps: LessonStep[] = [
    { id: 'opening', title: 'نبضتان تلتقيان', content: <StudentOpening /> },
    { id: 'launch', title: 'انطلاقة نشطة: المضاعفات', content: <LaunchStep /> },
    { id: 'laser', title: 'مثال الليزر', content: <LaserStep /> },
    { id: 'definition', title: 'تعريف م.م.أ ومثال الأعداد 3 و5', content: <DefinitionStep /> },
    { id: 'three-numbers', title: 'م.م.أ لثلاثة أعداد', content: <ThreeNumbersStep /> },
    { id: 'real-life', title: 'تطبيق: رش المبيدات', content: <RealLifeStep /> },
    { id: 'verbal-check', title: 'تعبير شفهي وتحقق من فهمك', content: <VerbalCheckStep /> },
    { id: 'drill', title: 'تدرّب: تسعة فروع', content: <DrillStep /> },
    { id: 'labs', title: 'مختبرات المنصة', content: <PlatformLabsStep /> },
    { id: 'recap', title: 'الخلاصة والاستعداد', content: <RecapStep /> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title="المضاعف المشترك الأصغر" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-eleven" />
}
