import { useMemo, useState } from 'react'
import { ArrowLeft, Check, CircleAlert, Lightbulb, RotateCcw, Ruler, Sparkles, Target } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import {
  multiplyNaturalNumbersBookElements,
  multiplyNaturalNumbersBookTasks,
  multiplyNaturalNumbersQuestionGroups,
  multiplyNaturalNumbersTestId,
  type MultiplyBookResponse,
  type MultiplyNaturalNumbersBookElement,
} from './multiplyNaturalNumbersData'

const byId = new Map(multiplyNaturalNumbersBookElements.map(element => [element.id, element]))
const tasksByGroup = new Map<string, MultiplyNaturalNumbersBookElement[]>(multiplyNaturalNumbersQuestionGroups.map(group => [
  group.id,
  multiplyNaturalNumbersBookTasks.filter(task => task.groupId === group.id),
]))
const teachingById = (id: string) => byId.get(id)!
const fmt = (value: number) => value.toLocaleString('en-US')

function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/gu, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/u, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[۰-۹]/gu, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/\D/gu, '')
    .replace(/^0+(?=\d)/u, '')
}
function parseProductValue(value: string): number | undefined {
  const digits = normalizeDigits(value)
  if (!digits) return undefined
  return Number(digits)
}

/**
 * Maximal numeric run joined by math operators (× + = − -), parentheses allowed around numbers.
 * The printed book sets such runs left-to-right; isolating them keeps the on-screen order
 * identical to the page (a bare RTL paragraph would mirror runs containing × or =).
 */
const MATH_RUN_REGEX = /(\(?\d[\d,]*\)?(?:\s*[×+=−-]\s*\(?\d[\d,]*\)?)+)/gu

/** Lesson-10 bidi renderer: Arabic prose stays RTL while every printed math run keeps its LTR order. */
function L10Bidi({ text }: { text: string }) {
  const parts = text.split(MATH_RUN_REGEX)
  return <>{parts.map((part, index) => index % 2 === 1
    ? <MathExpression key={index}>{part}</MathExpression>
    : <BidiText key={index}>{part}</BidiText>)}</>
}

/* ------------------------------------------------------------------ source cards */

function SourceElementCard({ id }: { id: string }) {
  const element = teachingById(id)
  return <div className="l10-source-element" data-source-id={element.id}>
    <SourceCard label={`من الكتاب · ص ${element.page} · ${element.section}`}>
      <h3 className="l10-source-title">{element.title}</h3>
      <p className="l10-printed-text"><L10Bidi text={element.prompt} /></p>
      <SourceVisuals ids={element.visualAssetIds} />
      <div className="l10-platform-explanation">
        <p className="l10-platform-label"><Lightbulb size={16} aria-hidden="true" /> شرح المنصة</p>
        <ol>{element.reasoning.map((line, index) => <li key={`${element.id}-${index}`}><L10Bidi text={line} /></li>)}</ol>
        <p className="l10-result-line"><strong>الخلاصة:</strong> <L10Bidi text={element.answer} /></p>
        <p className="l10-check-line"><Check size={15} aria-hidden="true" /><span><strong>تحقّق:</strong> <L10Bidi text={element.verification} /></span></p>
        <p className="l10-pitfall"><CircleAlert size={15} aria-hidden="true" /><span><strong>انتبه:</strong> <L10Bidi text={element.pitfall} /></span></p>
      </div>
    </SourceCard>
  </div>
}

function SourceVisuals({ ids }: { ids: readonly string[] }) {
  return <>
    {ids.includes('p48-column-1320x3') && <ColumnFigure
      visualId="p48-column-1320x3"
      caption="الضرب العمودي المطبوع في ص 48: 1320 × 3"
      top="1320"
      multiplier="3"
      rows={['3960']}
    />}
    {ids.includes('p49-column-425x12-steps') && <ColumnStepsFigure />}
    {ids.includes('p49-patterns-135') && <PatternBox
      visualId="p49-patterns-135"
      caption="صندوق الأنماط الأول (ص 49)"
      lines={['135 × 10 = 1350', '135 × 100 = 13500', '135 × 1000 = 135000']}
      tone="green"
    />}
    {ids.includes('p49-patterns-231') && <PatternBox
      visualId="p49-patterns-231"
      caption="صندوق الأنماط الثاني (ص 49)"
      lines={['10 × 231 = 2310', '20 × 231 = 4620', '30 × 231 = 6930']}
      tone="yellow"
    />}
    {ids.includes('p49-zero-products') && <PatternBox
      visualId="p49-zero-products"
      caption="صندوق قاعدة الصفر (ص 49)"
      lines={['1236 × 0 = 0', '72689 × 0 = 0', '5256571 × 0 = 0']}
      tone="yellow"
    />}
    {ids.includes('p50-dist-add-table') && <DistTable
      visualId="p50-dist-add-table"
      title="توزيع عملية الضرب على عملية الجمع"
      lines={[
        [{ t: '2 × (', c: '' }, { t: '4 + 5', c: 'hot' }, { t: ') = (', c: '' }, { t: '2 × 4', c: 'cool' }, { t: ') + (', c: '' }, { t: '2 × 5', c: 'hot2' }, { t: ')', c: '' }],
        [{ t: '= ', c: '' }, { t: '8', c: 'cool' }, { t: ' + ', c: '' }, { t: '10', c: 'hot2' }],
        [{ t: '= 18', c: '' }],
      ]}
      tone="yellow"
    />}
    {ids.includes('p50-dist-sub-table') && <DistTable
      visualId="p50-dist-sub-table"
      title="توزيع عملية الضرب على عملية الطرح"
      lines={[
        [{ t: '3 × (', c: '' }, { t: '7 − 4', c: 'cool' }, { t: ') = (', c: '' }, { t: '3 × 7', c: 'cool' }, { t: ') − (', c: '' }, { t: '3 × 4', c: 'hot2' }, { t: ')', c: '' }],
        [{ t: '= ', c: '' }, { t: '21', c: 'cool' }, { t: ' − ', c: '' }, { t: '12', c: 'hot2' }],
        [{ t: '= 9', c: '' }],
      ]}
      tone="green"
    />}
    {ids.includes('p51-rectangle-abcd') && <RectangleFigure />}
    {ids.includes('p51-karim-bar-model') && <KarimModel />}
  </>
}

/* ------------------------------------------------------------------ rebuilt book visuals */

function ColumnFigure({
  visualId,
  caption,
  top,
  multiplier,
  rows,
}: {
  visualId: string
  caption: string
  top: string
  multiplier: string
  rows: readonly string[]
}) {
  const cols = Math.max(top.length, multiplier.length + 1, ...rows.map(row => row.length))
  const cells = (value: string) => value.padStart(cols).split('')
  return <div className="l10-table-wrap" role="region" tabIndex={0} aria-label={caption} data-source-visual={visualId}>
    <table className="l10-column-table" dir="ltr">
      <caption>{caption}</caption>
      <tbody>
        <tr>{cells(top).map((digit, index) => <td key={`top-${index}`}>{digit.trim() ? <MathExpression>{digit}</MathExpression> : ''}</td>)}</tr>
        <tr className="l10-column-multiplier"><td className="l10-column-sign" aria-hidden="true"><MathExpression>×</MathExpression></td>{multiplier.padStart(cols - 1).split('').map((digit, index) => <td key={`mul-${index}`}>{digit.trim() ? <MathExpression>{digit}</MathExpression> : ''}</td>)}</tr>
        <tr className="l10-column-rule" aria-hidden="true">{Array.from({ length: cols }, (_, index) => <td key={`rule-${index}`} />)}</tr>
        {rows.map((row, rowIndex) => <tr key={`${row}-${rowIndex}`} className={rowIndex === rows.length - 1 && rows.length > 1 ? 'l10-column-sum' : ''}>{cells(row).map((digit, index) => <td key={`${rowIndex}-${index}`}>{digit.trim() ? <MathExpression>{digit}</MathExpression> : ''}</td>)}</tr>)}
      </tbody>
    </table>
  </div>
}

function ColumnStepsFigure() {
  const [step, setStep] = useState(1)
  return <div className="l10-table-wrap" role="region" tabIndex={0} aria-label="جدول خطوات الضرب العمودي 425 × 12" data-source-visual="p49-column-425x12-steps">
    <div className="l10-step-tabs" role="group" aria-label="خطوات الحل العمودي المطبوعة">
      {[1, 2, 3].map(value => <button key={value} type="button" className={step === value ? 'is-selected' : ''} aria-pressed={step === value} onClick={() => setStep(value)}>الخطوة {['الأولى', 'الثانية', 'الثالثة'][value - 1]}</button>)}
    </div>
    <p className="l10-step-tab-note" role="status">
      {step === 1 && 'نكتب عملية الضرب بالشكل العمودي ونضرب 2 بالعدد 425 بدءاً من خانة الآحاد: 2 × 5 = 10 نكتب 0 ونحمل 1، ثم 2 × 2 = 4 ومع الحمل 5، ثم 2 × 4 = 8؛ الناتج الجزئي 850.'}
      {step === 2 && 'نضرب 1 (خانة العشرات) بالعدد 425 بدءاً من الآحاد، ونزيح الناتج منزلة واحدة: 425 وبجانبها صفر الإزاحة الأزرق فتصبح 4250.'}
      {step === 3 && 'نجمع: 850 + 4250 مع حملي الجمع (1 أحمر و1 أزرق) فيصبح المجموع 5100.'}
    </p>
    <table className="l10-column-table" dir="ltr">
      <caption>الضرب العمودي 425 × 12 كما في ص 49 (الخطوة {step} من 3)</caption>
      <tbody>
        <tr className="l10-column-carries" aria-hidden="true">
          <td /><td /><td />{step === 1 ? <td><span className="l10-carry is-blue">1</span></td> : <td />}<td />
        </tr>
        <tr><td /><td><MathExpression>4</MathExpression></td><td><MathExpression>2</MathExpression></td><td><MathExpression>5</MathExpression></td><td /></tr>
        <tr className="l10-column-multiplier"><td className="l10-column-sign" aria-hidden="true"><MathExpression>×</MathExpression></td><td /><td><MathExpression>1</MathExpression></td><td><MathExpression>2</MathExpression></td><td /></tr>
        <tr className="l10-column-rule" aria-hidden="true"><td /><td /><td /><td /><td /></tr>
        {step >= 3 && <tr className="l10-column-carries l10-column-carries-add" aria-hidden="true"><td /><td><span className="l10-carry is-red">1</span></td><td><span className="l10-carry is-blue">1</span></td><td /><td /></tr>}
        <tr><td /><td /><td><MathExpression>8</MathExpression></td><td><MathExpression>5</MathExpression></td><td><MathExpression>0</MathExpression></td></tr>
        {step >= 2 && <tr><td /><td><MathExpression>4</MathExpression></td><td><MathExpression>2</MathExpression></td><td><MathExpression>5</MathExpression></td><td><MathExpression className="is-shift-zero">0</MathExpression></td></tr>}
        {step >= 3 && <tr className="l10-column-sum"><td aria-hidden="true"><MathExpression>+</MathExpression></td><td><MathExpression>5</MathExpression></td><td><MathExpression>1</MathExpression></td><td><MathExpression>0</MathExpression></td><td><MathExpression>0</MathExpression></td></tr>}
      </tbody>
    </table>
    <p className="l10-table-hint"><strong>ملاحظة المنصة:</strong> صفر الإزاحة الأزرق يظهر لأننا ضربنا بخانة العشرات؛ وحملَا الجمع الأحمر والأزرق يظهران أثناء الجمع فقط.</p>
  </div>
}

function PatternBox({ visualId, caption, lines, tone }: { visualId: string; caption: string; lines: readonly string[]; tone: 'green' | 'yellow' }) {
  return <div className={`l10-pattern-box is-${tone}`} role="region" tabIndex={0} aria-label={caption} data-source-visual={visualId}>
    <p className="l10-pattern-caption">{caption}</p>
    <ul>{lines.map(line => <li key={line}><MathExpression>{line}</MathExpression></li>)}</ul>
  </div>
}

type DistRun = { t: string; c: string }
function DistTable({ visualId, title, lines, tone }: { visualId: string; title: string; lines: readonly (readonly DistRun[])[]; tone: 'green' | 'yellow' }) {
  return <div className={`l10-dist-table is-${tone}`} role="region" tabIndex={0} aria-label={title} data-source-visual={visualId}>
    <p className="l10-dist-title">{title}</p>
    {lines.map((line, index) => <p className="l10-dist-line" key={index} dir="ltr">{line.map((run, runIndex) => <span key={runIndex} className={run.c ? `l10-dist-run is-${run.c}` : 'l10-dist-run'}><MathExpression>{run.t}</MathExpression></span>)}</p>)}
  </div>
}

function RectangleFigure() {
  return <div className="l10-figure-wrap" role="img" aria-label="المستطيل ABCD مقسوم بالقطعة EH إلى جزأين: 60 و140، وعرضه 82" data-source-visual="p51-rectangle-abcd">
    <svg viewBox="0 0 360 170" className="l10-rectangle-svg" style={{ direction: 'ltr' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="l10-rect-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bfe3f2" /><stop offset="1" stopColor="#8fc9e8" />
        </linearGradient>
      </defs>
      <rect x="40" y="30" width="280" height="100" fill="url(#l10-rect-fill)" stroke="#274b6d" strokeWidth="2" />
      <line x1="124" y1="30" x2="124" y2="130" stroke="#274b6d" strokeWidth="2" />
      <path d="M40 118 h12 v12 h-12 z" fill="none" stroke="#274b6d" strokeWidth="1.6" />
      <path d="M124 118 h12 v12 h-12 z" fill="none" stroke="#274b6d" strokeWidth="1.6" />
      <text x="30" y="24" className="l10-svg-letter">A</text>
      <text x="118" y="24" className="l10-svg-letter">E</text>
      <text x="322" y="24" className="l10-svg-letter">B</text>
      <text x="30" y="150" className="l10-svg-letter">D</text>
      <text x="118" y="150" className="l10-svg-letter">H</text>
      <text x="322" y="150" className="l10-svg-letter">C</text>
      <text x="76" y="52" className="l10-svg-num">60</text>
      <text x="212" y="52" className="l10-svg-num">140</text>
      <text x="12" y="86" className="l10-svg-num">82</text>
    </svg>
    <p className="l10-figure-caption">المستطيل <MathExpression>ABCD</MathExpression> من ص 51: <MathExpression>DH = 60</MathExpression>، <MathExpression>HC = 140</MathExpression>، <MathExpression>AD = 82</MathExpression>، والزاويتان القائمتان عند <MathExpression>D</MathExpression> و<MathExpression>H</MathExpression>.</p>
  </div>
}

function KarimModel() {
  const cell = (tone: 'green' | 'red', key: string) => <span key={key} className={`l10-bar-cell is-${tone}`} aria-hidden="true" />
  return <div className="l10-figure-wrap" role="img" aria-label="مخطط شرائط درجات كريم: شريط من 5 مربعات خضراء بدرجة 5 لكل سؤال وشريط من 6 مربعات حمراء بدرجة 6 لكل سؤال، ثم شبكة من 3 صفوف لكل مجموعة" data-source-visual="p51-karim-bar-model">
    <div className="l10-bar-strip" dir="ltr">
      <span className="l10-bar-group">{[0, 1, 2, 3, 4].map(index => cell('green', `g-${index}`))}<small>5 درجات</small></span>
      <span className="l10-bar-group">{[0, 1, 2, 3, 4, 5].map(index => cell('red', `r-${index}`))}<small>6 درجات</small></span>
    </div>
    <div className="l10-bar-grid-row" dir="ltr">
      <span className="l10-bar-rows-label">3 أسئلة</span>
      <span className="l10-bar-grid">{[0, 1, 2].map(row => <span className="l10-bar-grid-row-inner" key={row}>{[0, 1, 2, 3, 4].map(index => cell('green', `gg-${row}-${index}`))}</span>)}<small><MathExpression>5 × 3</MathExpression></small></span>
      <span className="l10-bar-grid">{[0, 1, 2].map(row => <span className="l10-bar-grid-row-inner" key={row}>{[0, 1, 2, 3, 4, 5].map(index => cell('red', `rr-${row}-${index}`))}</span>)}<small><MathExpression>6 × 3</MathExpression></small></span>
    </div>
    <p className="l10-figure-caption">مخطط ص 51: كل سؤال بدرجة 5 يعطي شريطاً من 5 مربعات، وكل سؤال بدرجة 6 يعطي شريطاً من 6 مربعات؛ وثلاثة أسئلة من كل نوع تصنع شبكتي <MathExpression>5 × 3</MathExpression> و<MathExpression>6 × 3</MathExpression>.</p>
  </div>
}

/* ------------------------------------------------------------------ book question groups */

function QuestionGroup({ groupId }: { groupId: string }) {
  const group = multiplyNaturalNumbersQuestionGroups.find(candidate => candidate.id === groupId)
  const tasks = tasksByGroup.get(groupId) ?? []
  if (!group || tasks.length === 0) return null
  return <section className="l10-question-group" aria-labelledby={`${group.id}-title`} data-source-group={group.id}>
    <div className="l10-group-heading">
      <span className="l10-source-tag">من الكتاب · ص {group.page}</span>
      <h3 id={`${group.id}-title`}>{group.title}</h3>
    </div>
    <p className="l10-group-prompt"><L10Bidi text={tasks[0].prompt} /></p>
    {tasks[0].visualAssetIds.includes('p51-rectangle-abcd') && <RectangleFigure />}
    {tasks[0].visualAssetIds.includes('p51-karim-bar-model') && <KarimModel />}
    <div className="l10-task-list">
      {tasks.map(task => <TaskRow key={task.id} task={task} />)}
    </div>
  </section>
}

function TaskRow({ task }: { task: MultiplyNaturalNumbersBookElement }) {
  const response = task.response!
  const [value, setValue] = useState('')
  const [second, setSecond] = useState('')
  const [third, setThird] = useState('')
  const [note, setNote] = useState('')
  const [checked, setChecked] = useState(false)
  const reset = () => setChecked(false)

  const result = useMemo(() => (checked ? evaluate(task, { value, second, third }) : undefined), [checked, task, value, second, third])

  return <article className="l10-task-row" data-source-id={task.id}>
    <div className="l10-task-source">
      <span className="l10-task-branch">{task.branch ?? '•'}</span>
      <span className="l10-task-source-text" id={`${task.id}-source`}><L10Bidi text={task.sourceText ?? task.title} /></span>
    </div>
    <div className="l10-task-response">
      {response.kind === 'product' && <label className="l10-control-label" htmlFor={`${task.id}-product`}>
        الناتج
        <input id={`${task.id}-product`} aria-label={`اكتب ناتج: ${task.sourceText}`} type="text" inputMode="numeric" dir="ltr" value={value} onChange={event => { setValue(event.currentTarget.value); reset() }} placeholder="اكتب العدد" />
        {response.acceptedUnits && <small>يمكن كتابة الوحدة ({response.acceptedUnits.join(' أو ')}) أو العدد وحده.</small>}
      </label>}
      {response.kind === 'column-parts' && <div className="l10-column-inputs" role="group" aria-label={`خطوات حل: ${task.title}`}>
        <label className="l10-control-label" htmlFor={`${task.id}-part1`}>الناتج الجزئي الأول (ضرب الآحاد)
          <input id={`${task.id}-part1`} type="text" inputMode="numeric" dir="ltr" value={value} onChange={event => { setValue(event.currentTarget.value); reset() }} placeholder="اكتب العدد" />
        </label>
        <label className="l10-control-label" htmlFor={`${task.id}-part2`}>الناتج الجزئي الثاني بعد الإزاحة (ضرب العشرات)
          <input id={`${task.id}-part2`} type="text" inputMode="numeric" dir="ltr" value={second} onChange={event => { setSecond(event.currentTarget.value); reset() }} placeholder="اكتب العدد" />
        </label>
        <label className="l10-control-label" htmlFor={`${task.id}-total`}>المجموع النهائي
          <input id={`${task.id}-total`} type="text" inputMode="numeric" dir="ltr" value={third} onChange={event => { setThird(event.currentTarget.value); reset() }} placeholder="اكتب العدد" />
        </label>
      </div>}
      {response.kind === 'choose-one' && <fieldset className="l10-choice-set" aria-labelledby={`${task.id}-source`}>
        <legend>اختر الطريقة</legend>
        {response.options.map(option => <label className="l10-choice-option" key={option.id}>
          <input type="radio" name={task.id} value={option.id} checked={value === option.id} onChange={() => { setValue(option.id); reset() }} />
          <span><MathExpression>{option.label}</MathExpression></span>
        </label>)}
      </fieldset>}
      {response.kind === 'classify-area-perimeter' && <fieldset className="l10-choice-set" aria-labelledby={`${task.id}-source`}>
        <legend>هذه العملية تحسب</legend>
        <label className="l10-choice-option">
          <input type="radio" name={task.id} value="area" checked={value === 'area'} onChange={() => { setValue('area'); reset() }} />
          <span>مساحة المستطيل</span>
        </label>
        <label className="l10-choice-option">
          <input type="radio" name={task.id} value="perimeter" checked={value === 'perimeter'} onChange={() => { setValue('perimeter'); reset() }} />
          <span>محيط المستطيل</span>
        </label>
      </fieldset>}
      {response.kind === 'pair-products' && <div className="l10-column-inputs" role="group" aria-label={`حسابا السؤال: ${task.title}`}>
        <label className="l10-control-label" htmlFor={`${task.id}-first`}>الناتج الأول
          <input id={`${task.id}-first`} type="text" inputMode="numeric" dir="ltr" value={value} onChange={event => { setValue(event.currentTarget.value); reset() }} placeholder="الناتج الأول" />
        </label>
        <label className="l10-control-label" htmlFor={`${task.id}-second`}>الناتج الثاني
          <input id={`${task.id}-second`} type="text" inputMode="numeric" dir="ltr" value={second} onChange={event => { setSecond(event.currentTarget.value); reset() }} placeholder="الناتج الثاني" />
        </label>
        <label className="l10-control-label" htmlFor={`${task.id}-note`}>ماذا تلاحظ؟
          <textarea id={`${task.id}-note`} dir="rtl" rows={2} value={note} onChange={event => { setNote(event.currentTarget.value); reset() }} placeholder="اكتب ملاحظتك عن العلاقة بين الناتجين" />
        </label>
      </div>}
    </div>
    <button type="button" className="l10-check-button" onClick={() => setChecked(true)}>
      <Check size={17} aria-hidden="true" /> تحقّق من الإجابة
    </button>
    {checked && <Feedback task={task} result={result} hasNote={note.trim().length > 0} />}
    <SolutionDisclosure element={task} />
  </article>
}

function evaluate(task: MultiplyNaturalNumbersBookElement, values: { value: string; second: string; third: string }): boolean | undefined {
  const response = task.response!
  switch (response.kind) {
    case 'product': {
      const parsed = parseProductValue(values.value)
      return parsed === undefined ? undefined : parsed === response.expected
    }
    case 'column-parts': {
      const first = parseProductValue(values.value)
      const second = parseProductValue(values.second)
      const total = parseProductValue(values.third)
      if (first === undefined || second === undefined || total === undefined) return undefined
      return first === response.first && second === response.second && total === response.total
    }
    case 'choose-one':
      return values.value ? values.value === response.expectedId : undefined
    case 'classify-area-perimeter':
      return values.value ? values.value === response.expected : undefined
    case 'pair-products': {
      const first = parseProductValue(values.value)
      const second = parseProductValue(values.second)
      if (first === undefined || second === undefined) return undefined
      return first === response.expected[0] && second === response.expected[1]
    }
  }
}

function Feedback({ task, result, hasNote }: { task: MultiplyNaturalNumbersBookElement; result: boolean | undefined; hasNote: boolean }) {
  const response = task.response as MultiplyBookResponse
  if (response.kind === 'pair-products') {
    if (result === undefined) return <p className="l10-task-feedback is-guidance" role="status">اكتب الناتجين أولاً، ثم دوّن ملاحظتك.</p>
    if (result) return <p className="l10-task-feedback is-correct" role="status"><Check size={15} aria-hidden="true" /> الناتجان صحيحان. {hasNote ? `قارن ملاحظتك بهذه النقاط: ${response.criteria.join('؛ ')}.` : `اكتب ملاحظتك الآن، ومنها: ${response.criteria[0]}.`}</p>
    return <p className="l10-task-feedback is-hint" role="status"><Lightbulb size={15} aria-hidden="true" /> تلميح: <L10Bidi text={task.pitfall} /></p>
  }
  if (result === undefined) return <p className="l10-task-feedback is-guidance" role="status">أدخل إجابة كاملة أولاً، ثم تحقّق منها. <L10Bidi text={task.verification} /></p>
  if (result) return <p className="l10-task-feedback is-correct" role="status"><Check size={15} aria-hidden="true" /> إجابة صحيحة. <L10Bidi text={task.verification} /></p>
  return <p className="l10-task-feedback is-hint" role="status"><Lightbulb size={15} aria-hidden="true" /> تلميح: <L10Bidi text={task.pitfall} /></p>
}

function SolutionDisclosure({ element }: { element: MultiplyNaturalNumbersBookElement }) {
  return <details className="l10-solution-disclosure">
    <summary>اكشف الحل الكامل خطوةً خطوة</summary>
    <div className="l10-solution-content">
      <SourceVisuals ids={element.visualAssetIds} />
      <dl className="l10-solution-frame">
        <div><dt>المعطيات</dt><dd><L10Bidi text={element.given} /></dd></div>
        <div><dt>المطلوب</dt><dd><L10Bidi text={element.required} /></dd></div>
        <div><dt>القاعدة</dt><dd><L10Bidi text={element.rule} /></dd></div>
        <div><dt>لماذا تنطبق؟</dt><dd><L10Bidi text={element.why} /></dd></div>
      </dl>
      <ol>{element.reasoning.map((line, index) => <li key={index}><L10Bidi text={line} /></li>)}</ol>
      <p className="l10-result-line"><strong>الإجابة النهائية:</strong> <L10Bidi text={element.answer} /></p>
      <p className="l10-check-line"><Check size={15} aria-hidden="true" /><span><strong>التحقّق:</strong> <L10Bidi text={element.verification} /></span></p>
      <p className="l10-pitfall"><CircleAlert size={15} aria-hidden="true" /><span><strong>خطأ شائع:</strong> <L10Bidi text={element.pitfall} /></span></p>
    </div>
  </details>
}

/* ------------------------------------------------------------------ platform interactions */

function DiscoveryChallenge() {
  const [choice, setChoice] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  return <div className="l10-discovery-card">
    <span className="l10-platform-badge"><Sparkles size={15} aria-hidden="true" /> سؤال استكشافي من إعداد المنصة</span>
    <h3>قبل القاعدة: أي التعبيرين أكبر؟</h3>
    <p>توقّع قبل أن تحسب: هل <MathExpression>365 + 365 + 365</MathExpression> أكبر أم <MathExpression>3 × 365</MathExpression> أم أنهما متساويان؟</p>
    <div className="l10-discovery-options" role="group" aria-label="اختر التعبير الأكبر أو التساوي">
      <button type="button" className={choice === 'sum' ? 'is-selected' : ''} aria-pressed={choice === 'sum'} onClick={() => { setChoice('sum'); setChecked(false) }}><span>الجمع المتكرر</span><MathExpression>365 + 365 + 365</MathExpression></button>
      <button type="button" className={choice === 'product' ? 'is-selected' : ''} aria-pressed={choice === 'product'} onClick={() => { setChoice('product'); setChecked(false) }}><span>الضرب</span><MathExpression>3 × 365</MathExpression></button>
      <button type="button" className={choice === 'equal' ? 'is-selected' : ''} aria-pressed={choice === 'equal'} onClick={() => { setChoice('equal'); setChecked(false) }}><span>متساويان</span><MathExpression>=</MathExpression></button>
    </div>
    <button type="button" className="l10-check-button" disabled={!choice} onClick={() => setChecked(true)}>تحقّق من توقّعك</button>
    {checked && <p className={choice === 'equal' ? 'l10-discovery-feedback is-correct' : 'l10-discovery-feedback is-hint'} role="status">
      {choice === 'equal'
        ? 'صحيح. الضرب جمع متكرر: 3 × 365 يعني ثلاثة مجموعات من 365، ومجموعها 1095 في الحالتين.'
        : 'تلميح: عُدّ عدد مرات ظهور 365 في كل تعبير؛ الجمع يكررها ثلاث مرات والضرب يكررها ثلاث مرات أيضاً.'}
    </p>}
  </div>
}

function PatternLab() {
  const [base, setBase] = useState('135')
  const [factor, setFactor] = useState<'0' | '10' | '100' | '1000'>('10')
  const normalizedBase = normalizeDigits(base).slice(0, 7)
  const baseValue = Number(normalizedBase || '0')
  const factorValue = Number(factor)
  const result = baseValue * factorValue
  const zeros = factor === '0' ? 0 : factor.length - 1
  return <div className="l10-interaction-card">
    <span className="l10-platform-badge"><Target size={15} aria-hidden="true" /> نشاط إثرائي · من إعداد المنصة</span>
    <h3>مختبر الأنماط: كم صفراً يُضاف؟</h3>
    <p>غيّر العدد الأساسي واختر العامل؛ راقب كيف تتحرك الأرقام إلى اليسار وكم صفراً يُضاف عند الضرب في 10 أو 100 أو 1000، وماذا يحدث عند الضرب في صفر.</p>
    <div className="l10-lab-controls">
      <label className="l10-control-label" htmlFor="l10-pattern-base">العدد الأساسي
        <input id="l10-pattern-base" type="text" inputMode="numeric" dir="ltr" value={normalizedBase} onChange={event => setBase(event.currentTarget.value)} />
      </label>
      <label className="l10-control-label" htmlFor="l10-pattern-factor">العامل
        <select id="l10-pattern-factor" value={factor} onChange={event => setFactor(event.currentTarget.value as typeof factor)}>
          <option value="0">0</option>
          <option value="10">10</option>
          <option value="100">100</option>
          <option value="1000">1000</option>
        </select>
      </label>
    </div>
    <p className="l10-live-result" aria-live="polite" data-testid="l10-pattern-result">
      <MathExpression>{fmt(baseValue)} × {factor} = {fmt(result)}</MathExpression>
    </p>
    <p className="l10-lab-note" role="status">
      {factor === '0'
        ? 'الضرب في صفر يعطي صفراً مهما كان العدد الأساسي؛ لا تُضاف أصفار هنا بل يختفي العدد كله.'
        : `أُضيف ${zeros === 1 ? 'صفر واحد' : zeros === 2 ? 'صفران' : 'ثلاثة أصفار'} إلى يمين العدد؛ لأن كل ضرب في 10 يرفع كل رقم منزلة واحدة.`}
    </p>
  </div>
}

function MultiplicationLab() {
  const [left, setLeft] = useState('425')
  const [right, setRight] = useState('12')
  const [shown, setShown] = useState(false)
  const a = Number(normalizeDigits(left).slice(0, 4) || '0')
  const b = Number(normalizeDigits(right).slice(0, 2) || '0')
  const onesDigit = b % 10
  const tensDigit = Math.floor(b / 10)
  const firstPart = a * onesDigit
  const secondPart = a * tensDigit * 10
  const total = a * b
  return <div className="l10-interaction-card">
    <span className="l10-platform-badge"><Target size={15} aria-hidden="true" /> نشاط إثرائي · من إعداد المنصة</span>
    <h3>مختبر الضرب العمودي: شاهد النواتج الجزئية</h3>
    <p>أدخل عدداً حتى أربع خانات وعاملاً حتى خانتين، ثم اعرض الحل العمودي. سيظهر الناتج الجزئي لضرب الآحاد، ثم الناتج المزاح لضرب العشرات، ثم المجموع مع الحمول.</p>
    <div className="l10-lab-controls">
      <label className="l10-control-label" htmlFor="l10-mult-a">العدد الأول
        <input id="l10-mult-a" type="text" inputMode="numeric" dir="ltr" value={normalizeDigits(left).slice(0, 4)} onChange={event => { setLeft(event.currentTarget.value); setShown(false) }} />
      </label>
      <label className="l10-control-label" htmlFor="l10-mult-b">العدد الثاني
        <input id="l10-mult-b" type="text" inputMode="numeric" dir="ltr" value={normalizeDigits(right).slice(0, 2)} onChange={event => { setRight(event.currentTarget.value); setShown(false) }} />
      </label>
    </div>
    <button type="button" className="l10-check-button" disabled={!a || !b} onClick={() => setShown(true)}>اعرض الحل العمودي</button>
    {shown && <div className="l10-live-result" aria-live="polite" data-testid="l10-mult-result">
      <ColumnFigure
        visualId="l10-platform-live-column"
        caption={`حل المختبر: ${fmt(a)} × ${fmt(b)}`}
        top={String(a)}
        multiplier={String(b)}
        rows={tensDigit ? [String(firstPart), String(secondPart), String(total)] : [String(total)]}
      />
      <p>الناتج الجزئي الأول <MathExpression>{fmt(firstPart)}</MathExpression> (ضرب خانة الآحاد {onesDigit})، والثاني <MathExpression>{fmt(secondPart)}</MathExpression> (ضرب خانة العشرات {tensDigit} مع الإزاحة)، والمجموع <MathExpression>{fmt(total)}</MathExpression>.</p>
    </div>}
  </div>
}

function DistributiveLab() {
  const [mode, setMode] = useState<'add' | 'sub'>('add')
  const [height, setHeight] = useState('2')
  const [partOne, setPartOne] = useState('4')
  const [partTwo, setPartTwo] = useState('5')
  const h = Math.min(Number(normalizeDigits(height).slice(0, 1) || '0'), 9)
  const x = Math.min(Number(normalizeDigits(partOne).slice(0, 1) || '0'), 9)
  const yRaw = Math.min(Number(normalizeDigits(partTwo).slice(0, 1) || '0'), 9)
  const y = mode === 'sub' ? Math.min(yRaw, x) : yRaw
  const inner = mode === 'add' ? x + y : x - y
  const distributed = mode === 'add' ? h * x + h * y : h * x - h * y
  const widthTotal = mode === 'add' ? x + y : x
  const scale = 26
  return <div className="l10-interaction-card">
    <span className="l10-platform-badge"><Ruler size={15} aria-hidden="true" /> نشاط إثرائي · من إعداد المنصة</span>
    <h3>مختبر التوزيع: المساحة لا تتغير</h3>
    <p>غيّر الارتفاع والجزأين وراقب النموذج المساحي: توزيع الضرب على الجمع أو الطرح يعطي الناتج نفسه لأن المنطقة الملونة لا تتغير.</p>
    <div className="l10-lab-controls">
      <label className="l10-control-label" htmlFor="l10-dist-mode">العملية داخل القوس
        <select id="l10-dist-mode" value={mode} onChange={event => setMode(event.currentTarget.value as 'add' | 'sub')}>
          <option value="add">جمع: a × (b + c)</option>
          <option value="sub">طرح: a × (b − c)</option>
        </select>
      </label>
      <label className="l10-control-label" htmlFor="l10-dist-h">الارتفاع a
        <input id="l10-dist-h" type="text" inputMode="numeric" dir="ltr" value={String(h)} onChange={event => setHeight(event.currentTarget.value)} />
      </label>
      <label className="l10-control-label" htmlFor="l10-dist-x">{mode === 'add' ? 'الجزء b' : 'الكل b'}
        <input id="l10-dist-x" type="text" inputMode="numeric" dir="ltr" value={String(x)} onChange={event => setPartOne(event.currentTarget.value)} />
      </label>
      <label className="l10-control-label" htmlFor="l10-dist-y">{mode === 'add' ? 'الجزء c' : 'المطروح c'}
        <input id="l10-dist-y" type="text" inputMode="numeric" dir="ltr" value={String(y)} onChange={event => setPartTwo(event.currentTarget.value)} />
      </label>
    </div>
    <div className="l10-area-model" role="img" aria-label={`نموذج مساحي للارتفاع ${h} مع الجزأين ${x} و${y}`}>
      <svg viewBox={`0 0 ${Math.max(widthTotal, 1) * scale + 8} ${Math.max(h, 1) * scale + 8}`} className="l10-area-svg" aria-hidden="true" focusable="false">
        {mode === 'add'
          ? <>
            <rect x="2" y="2" width={x * scale} height={h * scale} fill="#f2c94c" stroke="#8a6d1d" />
            <rect x={x * scale + 2} y="2" width={y * scale} height={h * scale} fill="#eb8f8f" stroke="#8f3a3a" />
          </>
          : <>
            <rect x="2" y="2" width={x * scale} height={h * scale} fill="#f2c94c" stroke="#8a6d1d" />
            <rect x={(x - y) * scale + 2} y="2" width={y * scale} height={h * scale} fill="#ffffff" stroke="#8f3a3a" strokeDasharray="4 3" />
          </>}
      </svg>
    </div>
    <p className="l10-live-result" aria-live="polite" data-testid="l10-dist-result">
      <MathExpression>{h} × ({x} {mode === 'add' ? '+' : '−'} {y}) = {h} × {inner} = {h * inner}</MathExpression>
      {' '}<MathExpression>= ({h} × {x}) {mode === 'add' ? '+' : '−'} ({h} × {y}) = {h * x} {mode === 'add' ? '+' : '−'} {h * y} = {distributed}</MathExpression>
    </p>
    <p className="l10-lab-note" role="status">{h * inner === distributed ? 'الطرفان متساويان دائماً: هذه خاصة التوزيع تعمل أمام عينيك.' : 'تحقّق من القيم المدخلة.'}</p>
  </div>
}

/* ------------------------------------------------------------------ steps */

function StudentOpening() {
  const intro = teachingById('l10-p48-intro')
  const goals = teachingById('l10-p48-goals')
  return <div className="l10-step-content">
    <div className="l10-hero-panel">
      <div className="l10-hero-mark" aria-hidden="true"><span>×</span><small>اضرب<br />وبسّط</small></div>
      <div>
        <p className="l10-eyebrow">الوحدة الثانية · الدرس الثاني · ص 48–51</p>
        <span className="l10-platform-badge"><Sparkles size={15} aria-hidden="true" /> سؤال تمهيدي من إعداد المنصة</span>
        <h3>الجمع المتكرر… أليس له طريق أقصر؟</h3>
        <p>إذا جمعنا <MathExpression>365 + 365 + 365</MathExpression> فكم مرة كررنا العدد نفسه؟ الضرب هو الطريق الأقصر لكتابة هذا التكرار، وفي هذا الدرس نتقنه مع خواص تجعل الحساب ذهنياً.</p>
      </div>
    </div>
    <SourceElementCard id={intro.id} />
    <SourceElementCard id={goals.id} />
    <div className="l10-goal-and-why">
      <article><span className="l10-platform-badge">تطبيق من إعداد المنصة</span><Target size={20} aria-hidden="true" /><h3>لماذا نتعلّم هذا؟</h3><p>لأن الأسعار والمساحات والكميات اليومية تُحسب بالضرب: من ثمن أمتار القماش إلى مصروف سنة كاملة، والخواص توفر وقتنا وتقلل أخطاءنا.</p></article>
      <article><span className="l10-platform-badge">أهداف التعلّم بصياغة المنصة</span><Check size={20} aria-hidden="true" /><h3>في نهاية الدرس ستستطيع</h3><ul><li>الضرب العمودي لعدد حتى أربع خانات في عدد حتى خانتين مع الحمل.</li><li>تطبيق أنماط الضرب في 10 و100 و1000 وقاعدة الضرب بالصفر.</li><li>استعمال الخواص التبديلية والتجميعية والتوزيعية لتبسيط الحساب وتعليل ذلك.</li></ul></article>
    </div>
    <DiscoveryChallenge />
    <p className="l10-source-note">السؤال الاستكشافي والتعبيران 365+365+365 و3×365 من إعداد المنصة؛ مقدمة الكالسيوم والأهداف من الكتاب ص 48.</p>
  </div>
}

function LaunchStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>شرح المنصة:</strong> نبدأ بما تتذكره من الصف الرابع: الضرب جمع متكرر، والعمود يبدأ من الآحاد. جرّب الفروع الأربعة المطبوعة ثم اقرأ قاعدة الحمل.</p>
    <SourceElementCard id="l10-p48-carry" />
    <QuestionGroup groupId="l10-launch" />
  </div>
}

function ExampleOneStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>شرح المنصة:</strong> المثال الأول من الكتاب: سعر المتر يتكرر ثلاث مرات. احسب الناتج بنفسك أولاً، ثم اكشف الحل العمودي المطبوع من داخل البند.</p>
    <QuestionGroup groupId="l10-example1" />
    <div className="l10-why-box"><Lightbulb size={19} aria-hidden="true" /><p><strong>شرح المنصة · لماذا لا يوجد حمل هنا؟</strong> كل نواتج ضرب المنازل في 3 أقل من عشرة: <MathExpression>3 × 0 = 0</MathExpression>، <MathExpression>3 × 2 = 6</MathExpression>، <MathExpression>3 × 3 = 9</MathExpression>، <MathExpression>3 × 1 = 3</MathExpression>؛ لذلك كُتب الناتج 3960 مباشرة دون حمل.</p></div>
  </div>
}

function ExampleTwoStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>شرح المنصة:</strong> هنا العامل 12 بخانتين، فيظهر ناتجان جزئيان. املأ خطوات الكتاب الثلاث بنفسك، ثم اكشف جدول الخطوات المطبوع من داخل البند.</p>
    <QuestionGroup groupId="l10-example2" />
    <div className="l10-why-box"><Lightbulb size={19} aria-hidden="true" /><p><strong>شرح المنصة · لماذا نُزيح الناتج الثاني؟</strong> الرقم 1 في العدد 12 يقع في خانة العشرات، أي إنه يمثل 10؛ وضرب 425 في 10 يعطي 4250 لا 425. الإزاحة منزلة واحدة (أو كتابة صفر الإزاحة الأزرق) تحفظ هذه القيمة.</p></div>
  </div>
}

function PatternsStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>شرح المنصة:</strong> قبل الحساب العمودي الطويل، اسأل: هل يمكن اختصار العملية؟ الأنماط المطبوعة تعطيك ثلاث اختصارات فورية.</p>
    <SourceElementCard id="l10-p49-patterns-135" />
    <SourceElementCard id="l10-p49-patterns-231" />
    <SourceElementCard id="l10-p49-zero" />
    <PatternLab />
  </div>
}

function PropertiesStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>شرح المنصة:</strong> الخواص الثلاث ليست للحفظ؛ كل خاصية تجيب عن سؤال عملي: أبدّل؟ أجمّع؟ أوزّع؟</p>
    <SourceElementCard id="l10-p50-commutative" />
    <SourceElementCard id="l10-p50-props-note" />
    <SourceElementCard id="l10-p50-associative" />
    <QuestionGroup groupId="l10-p50-assoc" />
    <SourceElementCard id="l10-p50-distributive" />
    <div className="l10-dist-pair">
      <SourceElementCard id="l10-p50-dist-add" />
      <SourceElementCard id="l10-p50-dist-sub" />
    </div>
  </div>
}

function CheckUnderstandingStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>إرشاد المنصة:</strong> طبّق ما تعلمته على أسئلة الكتاب: كمية الأسبوع من مقدمة الدرس، ثم أربعة نواتج، ثم سؤالَا «ماذا تلاحظ؟».</p>
    <QuestionGroup groupId="l10-check1" />
    <QuestionGroup groupId="l10-check2" />
    <QuestionGroup groupId="l10-p50-check" />
  </div>
}

function PracticeDrillStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>إرشاد المنصة:</strong> ثمانية نواتج من الكتاب: أربعة بضرب عامل بخانة، وأربعة بعامل بخانتين أو بعشرات. رتّب أعمدة ذهنياً قبل الكتابة، وراجع الحمول بعد كل منزلة.</p>
    <QuestionGroup groupId="l10-practice-ex1" />
    <QuestionGroup groupId="l10-practice-ex2" />
  </div>
}

function PracticePropertiesStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>إرشاد المنصة:</strong> في تدرّب 3 لا تضرب بالترتيب المكتوب مباشرة؛ ابحث أولاً عن عاملين يصنعان 10 أو 100 أو 1000.</p>
    <QuestionGroup groupId="l10-practice-ex3" />
  </div>
}

function PracticeShapesStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead"><strong>شرح المنصة:</strong> الضرب يقيس المساحات أيضاً: المستطيل المقسوم يربط التوزيع بالهندسة، ومخطط الشرائط يربط الضرب بجمع المجموعات.</p>
    <QuestionGroup groupId="l10-practice-ex4" />
    <QuestionGroup groupId="l10-practice-ex5" />
    <div className="l10-why-box"><Lightbulb size={19} aria-hidden="true" /><p><strong>شرح المنصة · لماذا الفرعان (أ) و(ب) كلاهما مساحة؟</strong> لأن <MathExpression>82 × (60 + 140)</MathExpression> و<MathExpression>(82 × 60) + (82 × 140)</MathExpression> صورتان للعملية نفسها بخاصة التوزيع على الجمع؛ أما <MathExpression>(82 + 60 + 140) × 2</MathExpression> فتجمع ضلعين متجاورين ثم تضاعفهما، وهذا تعريف المحيط.</p></div>
  </div>
}

function PlatformLabStep() {
  return <div className="l10-step-content">
    <p className="l10-step-lead">الأنشطة التالية جديدة من إعداد المنصة؛ ليست أسئلة مطبوعة ولا تدخل في سجل تمارين الكتاب.</p>
    <MultiplicationLab />
    <DistributiveLab />
  </div>
}

function LessonRecap() {
  return <div className="l10-step-content">
    <div className="l10-recap-card">
      <span className="l10-platform-badge"><Sparkles size={15} aria-hidden="true" /> خلاصة المنصة</span>
      <h3>خريطة الضرب في خمس محطات</h3>
      <ol>
        <li><strong>ابدأ من الآحاد:</strong> اضرب كل منزلة واحمل عشرات الناتج إلى المنزلة الأعلى.</li>
        <li><strong>عامل بخانتين؟</strong> ناتجان جزئيان، والثاني يُزاح منزلة واحدة ثم نجمع.</li>
        <li><strong>أنماط فورية:</strong> الضرب في 10 أو 100 أو 1000 يضيف أصفاراً، والضرب في صفر يعطي صفراً.</li>
        <li><strong>بدّل وجمّع:</strong> اصنع عاملين مثل 2 و5 أو 50 و2 لتحصل على 10 أو 100 واحسب ذهنياً.</li>
        <li><strong>وزّع:</strong> فتّت العدد الصعب إلى مجموع أو فرق: <MathExpression>99 = 100 − 1</MathExpression> صديقك الدائم.</li>
      </ol>
    </div>
    <div className="l10-final-thought"><CircleAlert size={19} aria-hidden="true" /><p><strong>تذكير المنصة · اختبار ذاتي:</strong> هل تستطيع تعليل كل خطوة في حل 425 × 12 دون نظر؟ إذا نعم، فأنت جاهز لاختبار الدرس المستقل.</p></div>
    <a className="l10-independent-test-link" href={`#tests/run/${multiplyNaturalNumbersTestId}`}>انتقل إلى اختبار الدرس المستقل · 20 سؤالاً <ArrowLeft size={18} aria-hidden="true" /></a>
    <p className="l10-source-note">الاختبار مستقل عن هذا الدرس، وحلوله لا تظهر إلا بعد تسليم المحاولة وفق نظام المنصة.</p>
  </div>
}

export function MultiplyNaturalNumbersLesson() {
  const steps: LessonStep[] = [
    { id: 'opening', title: 'سؤال يفتح الفكرة', content: <StudentOpening /> },
    { id: 'launch', title: 'انطلاقة نشطة', content: <LaunchStep /> },
    { id: 'example-one', title: 'مثال 1: ثمن القماش', content: <ExampleOneStep /> },
    { id: 'example-two', title: 'مثال 2: المصروف السنوي', content: <ExampleTwoStep /> },
    { id: 'patterns', title: 'أنماط تختصر الحساب', content: <PatternsStep /> },
    { id: 'properties', title: 'خواص الضرب الثلاث', content: <PropertiesStep /> },
    { id: 'understanding', title: 'تحقّق من فهمك', content: <CheckUnderstandingStep /> },
    { id: 'practice-drill', title: 'تدرّب: الضرب العمودي', content: <PracticeDrillStep /> },
    { id: 'practice-properties', title: 'تدرّب: التجميعية', content: <PracticePropertiesStep /> },
    { id: 'practice-shapes', title: 'تدرّب: مساحة ومحيط', content: <PracticeShapesStep /> },
    { id: 'platform-lab', title: 'مختبر المنصة', content: <PlatformLabStep /> },
    { id: 'recap', title: 'الخلاصة والاستعداد', content: <LessonRecap /> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title="ضرب الأعداد الطبيعية" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-ten" />
}
