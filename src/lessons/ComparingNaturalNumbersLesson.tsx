import { useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowUp, Check, CircleAlert, Lightbulb, RotateCcw, Sparkles, Target } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import {
  compareNaturalNumbersBookElements,
  compareNaturalNumbersBookTasks,
  compareNaturalNumbersQuestionGroups,
  type CompareBookResponse,
  type CompareNaturalNumbersBookElement,
} from './compareNaturalNumbersData'

const byId = new Map(compareNaturalNumbersBookElements.map(element => [element.id, element]))
const tasksByGroup = new Map<string, CompareNaturalNumbersBookElement[]>(compareNaturalNumbersQuestionGroups.map(group => [
  group.id,
  compareNaturalNumbersBookTasks.filter(task => task.groupId === group.id),
]))
const teachingById = (id: string) => byId.get(id)!
const fmt = (value: number) => value.toLocaleString('en-US')

function SourceElementCard({ id }: { id: string }) {
  const element = teachingById(id)
  return <div className="l9-source-element" data-source-id={element.id}>
    <SourceCard label={`من الكتاب · ص ${element.page} · ${element.section}`}>
      <h3 className="l9-source-title">{element.title}</h3>
      <p className="l9-printed-text"><BidiText>{element.prompt}</BidiText></p>
      <SourceVisuals ids={element.visualAssetIds} />
      <div className="l9-platform-explanation">
        <p className="l9-platform-label"><Lightbulb size={16} aria-hidden="true" /> شرح المنصة</p>
        <ol>{element.reasoning.map((line, index) => <li key={`${element.id}-${index}`}><BidiText>{line}</BidiText></li>)}</ol>
        <p className="l9-result-line"><strong>الخلاصة:</strong> <BidiText>{element.answer}</BidiText></p>
        <p className="l9-check-line"><Check size={15} aria-hidden="true" /><span><strong>تحقّق:</strong> <BidiText>{element.verification}</BidiText></span></p>
        <p className="l9-pitfall"><CircleAlert size={15} aria-hidden="true" /><span><strong>انتبه:</strong> <BidiText>{element.pitfall}</BidiText></span></p>
      </div>
    </SourceCard>
  </div>
}

function SourceVisuals({ ids }: { ids: readonly string[] }) {
  return <>
    {ids.includes('p45-digit-count-table') && <DigitCountTable />}
    {ids.includes('p45-place-value-1254698-999999') && <PlaceValueTable
      visualId="p45-place-value-1254698-999999"
      caption="جدول الخانات لمقارنة 1,254,698 و999,999"
      numbers={[1254698, 999999]}
      focusPlace="millions"
    />}
    {ids.includes('p45-place-value-5600368-2978561') && <PlaceValueTable
      visualId="p45-place-value-5600368-2978561"
      caption="جدول الخانات لمقارنة 5,600,368 و2,978,561"
      numbers={[5600368, 2978561]}
      focusPlace="millions"
    />}
    {ids.includes('p46-place-value-2358936-2369487') && <PlaceValueTable
      visualId="p46-place-value-2358936-2369487"
      caption="جدول الخانات لمقارنة 2,358,936 و2,369,487"
      numbers={[2358936, 2369487]}
      focusPlace="ten-thousands"
    />}
    {ids.includes('p46-place-value-equality-3897456') && <PlaceValueTable
      visualId="p46-place-value-equality-3897456"
      caption="جدول الخانات للعددين المتساويين 3,897,456"
      numbers={[3897456, 3897456]}
    />}
  </>
}

const placeColumns = [
  { id: 'ones', label: 'الآحاد' },
  { id: 'tens', label: 'العشرات' },
  { id: 'hundreds', label: 'المئات' },
  { id: 'thousands', label: 'الألوف' },
  { id: 'ten-thousands', label: 'عشرات الألوف' },
  { id: 'hundred-thousands', label: 'مئات الألوف' },
  { id: 'millions', label: 'الملايين' },
] as const

function PlaceValueTable({
  visualId,
  caption,
  numbers,
  focusPlace,
}: {
  visualId: string
  caption: string
  numbers: readonly number[]
  focusPlace?: string
}) {
  return <div className="l9-table-wrap" role="region" tabIndex={0} aria-label={caption} data-source-visual={visualId}>
    <table className="l9-place-table" dir="rtl">
      <caption>{caption}</caption>
      <thead><tr><th scope="col">الخانة</th>{placeColumns.map(column => <th className={column.id === focusPlace ? 'is-focus' : ''} key={column.id} scope="col">{column.label}</th>)}</tr></thead>
      <tbody>{numbers.map((number, rowIndex) => {
        const digits = String(number).padStart(7, '0').split('').reverse()
        return <tr key={`${number}-${rowIndex}`}>
          <th scope="row"><MathExpression>{fmt(number)}</MathExpression></th>
          {placeColumns.map((column, index) => {
            const isEmptyLeadingMillion = column.id === 'millions' && String(number).length < 7
            return <td key={column.id} className={column.id === focusPlace ? 'is-focus' : ''} aria-label={isEmptyLeadingMillion ? `لا يوجد رقم في خانة الملايين للعدد ${fmt(number)}` : undefined}>
              {isEmptyLeadingMillion ? '' : <MathExpression>{digits[index]}</MathExpression>}
            </td>
          })}
        </tr>
      })}</tbody>
    </table>
    <p className="l9-table-hint"><strong>ملاحظة المنصة:</strong> اقرأ الأعمدة من اليمين إلى اليسار لتسمية الخانات، وابدأ المقارنة من عمود الملايين.</p>
  </div>
}

function DigitCountTable() {
  return <div className="l9-table-wrap" role="region" tabIndex={0} aria-label="جدول العدد وعدد الخانات" data-source-visual="p45-digit-count-table">
    <table className="l9-book-table l9-digit-count-table" dir="rtl">
      <caption>عدد الخانات في المثال المطبوع (ص 45)</caption>
      <thead><tr><th scope="col">العدد</th><th scope="col">عدد الخانات</th></tr></thead>
      <tbody>
        <tr><th scope="row"><MathExpression>1,254,698</MathExpression></th><td><MathExpression>7</MathExpression></td></tr>
        <tr><th scope="row"><MathExpression>999,999</MathExpression></th><td><MathExpression>6</MathExpression></td></tr>
      </tbody>
    </table>
  </div>
}

function QuestionGroup({ groupId }: { groupId: string }) {
  const group = compareNaturalNumbersQuestionGroups.find(candidate => candidate.id === groupId)
  const tasks = tasksByGroup.get(groupId) ?? []
  if (!group || tasks.length === 0) return null
  if (tasks[0].response?.kind === 'neighbor') return <NeighborQuestionGroup group={group} tasks={tasks} />
  return <StandardQuestionGroup group={group} tasks={tasks} />
}

function StandardQuestionGroup({
  group,
  tasks,
}: {
  group: (typeof compareNaturalNumbersQuestionGroups)[number]
  tasks: CompareNaturalNumbersBookElement[]
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const isMarkGroup = tasks.every(task => task.response?.kind === 'mark-correct')
  const answerAll = () => setChecked(true)
  const update = (id: string, value: string) => {
    setAnswers(previous => ({ ...previous, [id]: value }))
    setChecked(false)
  }

  return <section className="l9-question-group" aria-labelledby={`${group.id}-title`} data-source-group={group.id}>
    <div className="l9-group-heading">
      <span className="l9-source-tag">من الكتاب · ص {group.page}</span>
      <h3 id={`${group.id}-title`}>{group.title}</h3>
    </div>
    <p className="l9-group-prompt"><BidiText>{tasks[0].prompt}</BidiText></p>
    {tasks.some(task => task.visualAssetIds.includes('p47-province-area-table')) && <ProvinceAreaTable />}
    <div className={isMarkGroup ? 'l9-task-list l9-mark-list' : 'l9-task-list'}>
      {tasks.map(task => <TaskRow
        key={task.id}
        task={task}
        value={answers[task.id] ?? ''}
        checked={checked}
        onChange={value => update(task.id, value)}
      />)}
    </div>
    {isMarkGroup && <p className="l9-hint-text"><strong>إرشاد المنصة:</strong> ضع علامة على كل عبارة تراها صحيحة، واترك غير الصحيحة بلا علامة.</p>}
    {tasks[0].response?.kind === 'order-numbers' && <p className="l9-hint-text"><strong>إرشاد المنصة:</strong> اكتب الأعداد مرتبةً وافصل بينها بعلامة الفاصلة المنقوطة (؛). يمكن كتابة الأرقام مع فواصل الآلاف أو من دونها.</p>}
    {(tasks[0].response?.kind === 'order-labels' || tasks[0].response?.kind === 'select-labels') && <p className="l9-hint-text"><strong>إرشاد المنصة:</strong> اكتب أسماء المحافظات وافصل بينها بعلامة (؛). في سؤال «أي المحافظات» لا يهم ترتيب الأسماء.</p>}
    <button type="button" className="l9-check-button" onClick={answerAll}>
      <Check size={17} aria-hidden="true" /> {isMarkGroup ? 'تحقّق من الاختيارات' : 'تحقّق من الإجابات'}
    </button>
    {checked && <p className="l9-group-feedback" role="status">
      {tasks.every(task => task.response?.kind === 'explain'
        ? Boolean(answers[task.id]?.trim())
        : evaluate(task, answers[task.id] ?? '') === true)
        ? tasks.every(task => task.response?.kind === 'explain')
          ? 'سُجّل تفسيرك. قارنه بمعايير الشرح والحل الكامل، ثم حسّنه إن لزم.'
          : 'أحسنت. راجع تعليل كل خطوة، لا الرمز أو الترتيب وحده.'
        : 'ظهرت ملاحظة واحدة أو أكثر؛ استخدم التغذية الراجعة تحت كل بند ثم جرّب من جديد.'}
    </p>}
  </section>
}

function TaskRow({
  task,
  value,
  checked,
  onChange,
}: {
  task: CompareNaturalNumbersBookElement
  value: string
  checked: boolean
  onChange: (value: string) => void
}) {
  const response = task.response!
  const result = checked ? evaluate(task, value) : undefined
  const labelId = `${task.id}-answer-label`

  return <article className="l9-task-row" data-source-id={task.id}>
    <div className="l9-task-source">
      <span className="l9-task-branch">{task.branch ?? '•'}</span>
      <span className="l9-task-source-text" id={`${task.id}-source`}><BidiText>{task.sourceText ?? task.title}</BidiText></span>
    </div>
    <div className="l9-task-response">
      {response.kind === 'relation' && <label className="l9-control-label" id={labelId}>
        اختر العلاقة
        <select aria-labelledby={`${task.id}-source ${labelId}`} value={value} onChange={event => onChange(event.currentTarget.value)}>
          <option value="">اختر الرمز</option>
          <option value="<">أصغر من (&lt;)</option>
          <option value="=">يساوي (=)</option>
          <option value=">">أكبر من (&gt;)</option>
        </select>
      </label>}
      {response.kind === 'order-numbers' && <label className="l9-control-label" htmlFor={`${task.id}-order`}>
        الترتيب الذي اخترته
        <input id={`${task.id}-order`} aria-label={`رتّب الأعداد في البند: ${task.sourceText}`} type="text" inputMode="text" dir="ltr" value={value} onChange={event => onChange(event.currentTarget.value)} placeholder="اكتب العدد؛ العدد؛ العدد" />
      </label>}
      {response.kind === 'choose-one' && <fieldset className="l9-choice-set" aria-labelledby={`${task.id}-source ${task.id}-choice-legend`} data-source-visual={task.visualAssetIds.includes('p46-compare-response-cards') ? 'p46-compare-response-cards' : undefined}>
        <legend id={`${task.id}-choice-legend`}>اختر الاسم الذي قارن بشكل صحيح</legend>
        {response.options.map(option => <label className="l9-choice-option" key={option.id}>
          <input type="radio" name={task.id} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} />
          <span><BidiText>{option.label}</BidiText></span>
        </label>)}
      </fieldset>}
      {response.kind === 'mark-correct' && <label className="l9-mark-option">
        <input type="checkbox" aria-label={`هل العبارة ${task.sourceText} صحيحة؟`} checked={value === 'yes'} onChange={event => onChange(event.currentTarget.checked ? 'yes' : 'no')} />
        <span>العبارة صحيحة</span>
      </label>}
      {response.kind === 'explain' && <label className="l9-control-label" htmlFor={`${task.id}-explain`}>
        اكتب تفسيرك
        <textarea id={`${task.id}-explain`} aria-label={`اكتب تفسيرك للسؤال: ${task.sourceText}`} dir="auto" rows={3} value={value} onChange={event => onChange(event.currentTarget.value)} placeholder="اذكر قيمة المنزلة وأول اختلاف…" />
      </label>}
      {(response.kind === 'order-labels' || response.kind === 'select-labels') && <label className="l9-control-label" htmlFor={`${task.id}-labels`}>
        أسماء المحافظات
        <input id={`${task.id}-labels`} aria-label={`أسماء المحافظات المطلوبة في البند: ${task.sourceText}`} type="text" dir="rtl" value={value} onChange={event => onChange(event.currentTarget.value)} placeholder="اكتب الأسماء وافصل بينها بـ ؛" />
      </label>}
    </div>
    {checked && <Feedback task={task} value={value} result={result} />}
    <SolutionDisclosure element={task} />
  </article>
}

function Feedback({
  task,
  value,
  result,
}: {
  task: CompareNaturalNumbersBookElement
  value: string
  result: boolean | undefined
}) {
  const response = task.response!
  if (response.kind === 'explain') {
    const hasText = value.trim().length > 0
    return <div className="l9-task-feedback is-guidance" role="status">
      <Lightbulb size={16} aria-hidden="true" />
      <span>{hasText ? `قارن إجابتك بهذه النقاط: ${response.criteria.join('؛ ')}.` : 'ابدأ بذكر المنزلة الأعلى قيمةً، ثم وضّح ما الذي يحدث عند أول اختلاف.'}</span>
    </div>
  }
  if (result === undefined) return <p className="l9-task-feedback is-guidance" role="status">اختر إجابة أولاً، ثم تحقّق منها. {task.verification}</p>
  if (result) return <p className="l9-task-feedback is-correct" role="status"><Check size={15} aria-hidden="true" /> إجابة صحيحة. {task.verification}</p>
  return <p className="l9-task-feedback is-hint" role="status"><Lightbulb size={15} aria-hidden="true" /> تلميح: {task.pitfall} {task.response?.kind === 'relation' ? 'ارجع إلى عدد الخانات، ثم افحص المنازل من اليسار.' : 'قارن أولاً أكبر منزلة مختلفة، ثم أعد المحاولة.'}</p>
}

function SolutionDisclosure({ element }: { element: CompareNaturalNumbersBookElement }) {
  return <details className="l9-solution-disclosure">
    <summary>اكشف الحل الكامل خطوةً خطوة</summary>
    <div className="l9-solution-content">
      <dl className="l9-solution-frame">
        <div><dt>المعطيات</dt><dd><BidiText>{element.given}</BidiText></dd></div>
        <div><dt>المطلوب</dt><dd><BidiText>{element.required}</BidiText></dd></div>
        <div><dt>القاعدة</dt><dd><BidiText>{element.rule}</BidiText></dd></div>
        <div><dt>لماذا تنطبق؟</dt><dd><BidiText>{element.why}</BidiText></dd></div>
      </dl>
      <ol>{element.reasoning.map((line, index) => <li key={index}><BidiText>{line}</BidiText></li>)}</ol>
      <p className="l9-result-line"><strong>الإجابة النهائية:</strong> <BidiText>{element.answer}</BidiText></p>
      <p className="l9-check-line"><Check size={15} aria-hidden="true" /><span><strong>التحقّق:</strong> <BidiText>{element.verification}</BidiText></span></p>
      <p className="l9-pitfall"><CircleAlert size={15} aria-hidden="true" /><span><strong>خطأ شائع:</strong> <BidiText>{element.pitfall}</BidiText></span></p>
    </div>
  </details>
}

function evaluate(task: CompareNaturalNumbersBookElement, value: string): boolean | undefined {
  const response = task.response!
  switch (response.kind) {
    case 'relation':
      return value ? value === response.expected : undefined
    case 'order-numbers': {
      const actual = parseNumberList(value)
      return actual.length ? sameArray(actual, response.expected) : undefined
    }
    case 'choose-one':
      return value ? value === response.expectedId : undefined
    case 'mark-correct':
      return (value === 'yes') === response.expectedCorrect
    case 'explain':
      return undefined
    case 'order-labels': {
      const actual = parseLabelList(value)
      return actual.length ? sameLabels(actual, response.expected, true) : undefined
    }
    case 'select-labels': {
      const actual = parseLabelList(value)
      return actual.length ? sameLabels(actual, response.expected, response.orderMatters ?? false) : undefined
    }
    case 'neighbor':
      return undefined
  }
}

function parseNumberList(value: string): number[] {
  return value.split(/[;؛|\n]+/u).map(part => Number(part.replace(/[٠-٩]/gu, digit => String(digit.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/gu, digit => String(digit.charCodeAt(0) - 0x06f0)).replace(/[\s,،٬]/gu, ''))).filter(Number.isFinite)
}
function parseLabelList(value: string): string[] {
  return value.split(/[;؛|\n]+/u).map(normalizeArabicLabel).filter(Boolean)
}
function normalizeArabicLabel(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase('ar').replace(/[\u064b-\u065f\u0670\u0640]/gu, '').replace(/[أإآ]/gu, 'ا').replace(/ى/gu, 'ي').replace(/[^\p{L}\p{N}]/gu, '')
}
function sameArray(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index])
}
function sameLabels(left: readonly string[], right: readonly string[], orderMatters: boolean): boolean {
  if (left.length !== right.length) return false
  const expected = right.map(normalizeArabicLabel)
  return orderMatters
    ? left.every((value, index) => value === expected[index])
    : [...left].sort().every((value, index) => value === [...expected].sort()[index])
}

function NeighborQuestionGroup({
  group,
  tasks,
}: {
  group: (typeof compareNaturalNumbersQuestionGroups)[number]
  tasks: CompareNaturalNumbersBookElement[]
}) {
  const [answers, setAnswers] = useState<Record<string, { previous: string; next: string }>>({})
  const [checked, setChecked] = useState(false)
  const update = (id: string, key: 'previous' | 'next', value: string) => {
    setAnswers(previous => ({ ...previous, [id]: { previous: previous[id]?.previous ?? '', next: previous[id]?.next ?? '', [key]: value } }))
    setChecked(false)
  }

  return <section className="l9-question-group" aria-labelledby={`${group.id}-title`} data-source-group={group.id}>
    <div className="l9-group-heading"><span className="l9-source-tag">من الكتاب · ص {group.page}</span><h3 id={`${group.id}-title`}>{group.title}</h3></div>
    <p className="l9-group-prompt"><BidiText>{tasks[0].prompt}</BidiText></p>
    <NeighborTable tasks={tasks} answers={answers} checked={checked} update={update} />
    <button type="button" className="l9-check-button" onClick={() => setChecked(true)}><Check size={17} aria-hidden="true" /> تحقّق من الجدول</button>
    {checked && <p className="l9-group-feedback" role="status">افحص كل صف: السابق أقل بواحد، واللاحق أكبر بواحد من العدد الأوسط.</p>}
    {tasks.map(task => <SolutionDisclosure key={task.id} element={task} />)}
  </section>
}

function NeighborTable({
  tasks,
  answers,
  checked,
  update,
}: {
  tasks: CompareNaturalNumbersBookElement[]
  answers: Record<string, { previous: string; next: string }>
  checked: boolean
  update: (id: string, key: 'previous' | 'next', value: string) => void
}) {
  return <div className="l9-table-wrap" role="region" tabIndex={0} aria-label="جدول الأعداد السابقة واللاحقة" data-source-visual="p47-neighbor-table">
    <table className="l9-book-table l9-neighbor-table" dir="rtl">
      <caption>جدول الأعداد المتتالية: السابق، العدد، اللاحق (ص 47)</caption>
      <thead><tr><th scope="col">العدد السابق</th><th scope="col">العدد</th><th scope="col">العدد اللاحق</th></tr></thead>
      <tbody>
        {tasks.map(task => {
          const response = task.response as Extract<CompareBookResponse, { kind: 'neighbor' }>
          const value = answers[task.id] ?? { previous: '', next: '' }
          const previousCorrect = normalizeDigits(value.previous).replace(/[\s,]/g, '') === String(response.previous)
          const nextCorrect = normalizeDigits(value.next).replace(/[\s,]/g, '') === String(response.next)
          return <tr key={task.id} data-source-id={task.id}>
            <td><label className="l9-table-input-label" htmlFor={`${task.id}-previous`}>السابق للعدد {fmt(response.previous + 1)}
              <input id={`${task.id}-previous`} inputMode="numeric" dir="ltr" value={value.previous} onChange={event => update(task.id, 'previous', event.currentTarget.value)} />
              {checked && <small className={previousCorrect ? 'is-correct' : 'is-hint'}>{previousCorrect ? 'صحيح' : 'تذكّر: اطرح 1.'}</small>}
            </label></td>
            <th scope="row"><MathExpression>{fmt(response.previous + 1)}</MathExpression></th>
            <td><label className="l9-table-input-label" htmlFor={`${task.id}-next`}>اللاحق للعدد {fmt(response.previous + 1)}
              <input id={`${task.id}-next`} inputMode="numeric" dir="ltr" value={value.next} onChange={event => update(task.id, 'next', event.currentTarget.value)} />
              {checked && <small className={nextCorrect ? 'is-correct' : 'is-hint'}>{nextCorrect ? 'صحيح' : 'تذكّر: أضف 1.'}</small>}
            </label></td>
          </tr>
        })}
      </tbody>
    </table>
  </div>
}

function ProvinceAreaTable() {
  return <div className="l9-table-wrap" role="region" tabIndex={0} aria-label="جدول مساحات المحافظات" data-source-visual="p47-province-area-table">
    <table className="l9-book-table l9-province-table" dir="rtl">
      <caption>مساحات المحافظات بالكيلومتر المربع (ص 47)</caption>
      <thead><tr><th scope="col">المحافظة</th><th scope="col">المساحة (كيلومتر مربع)</th><th scope="col">المحافظة</th><th scope="col">المساحة (كيلومتر مربع)</th></tr></thead>
      <tbody>
        <tr><th scope="row">حمص</th><td><MathExpression>8,880</MathExpression></td><th scope="row">القنيطرة</th><td><MathExpression>1,860</MathExpression></td></tr>
        <tr><th scope="row">درعا</th><td><MathExpression>2,730</MathExpression></td><th scope="row">الحسكة</th><td><MathExpression>23,330</MathExpression></td></tr>
        <tr><th scope="row">إدلب</th><td><MathExpression>6,100</MathExpression></td><th scope="row">السويداء</th><td><MathExpression>5,550</MathExpression></td></tr>
      </tbody>
    </table>
    <p className="l9-table-hint"><strong>ملاحظة المنصة:</strong> الوحدة ثابتة في جميع الخانات: كيلومتر مربع؛ لذلك نقارن القيم العددية مباشرة.</p>
  </div>
}

function DiscoveryChallenge() {
  const [choice, setChoice] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const correct = choice === 'second'
  return <div className="l9-discovery-card">
    <span className="l9-platform-badge"><Sparkles size={15} aria-hidden="true" /> سؤال استكشافي من إعداد المنصة</span>
    <h3>قبل القاعدة: أي مكتبة سجّلت عدداً أكبر من الزيارات؟</h3>
    <p>المكتبة الأولى سجّلت <MathExpression>2,406,018</MathExpression> زيارة، والثانية <MathExpression>2,460,018</MathExpression>. توقّع قبل أن تحسب.</p>
    <div className="l9-discovery-options" role="group" aria-label="اختر المكتبة ذات الزيارات الأكثر">
      <button type="button" className={choice === 'first' ? 'is-selected' : ''} aria-pressed={choice === 'first'} onClick={() => { setChoice('first'); setChecked(false) }}><span>الأولى</span><MathExpression>2,406,018</MathExpression></button>
      <button type="button" className={choice === 'second' ? 'is-selected' : ''} aria-pressed={choice === 'second'} onClick={() => { setChoice('second'); setChecked(false) }}><span>الثانية</span><MathExpression>2,460,018</MathExpression></button>
    </div>
    <button type="button" className="l9-check-button" disabled={!choice} onClick={() => setChecked(true)}>تحقّق من توقّعك</button>
    {checked && <p className={correct ? 'l9-discovery-feedback is-correct' : 'l9-discovery-feedback is-hint'} role="status">
      {correct
        ? 'صحيح. الملايين ومئات الألوف متساوية، لكن في عشرات الألوف 6 أكبر من 0؛ لذلك الثانية أكبر.'
        : 'تلميح: لا تتوقف عند تساوي أول خانتين؛ افحص أول منزلة مختلفة من اليسار.'}
    </p>}
  </div>
}

function CompareWorkbench() {
  const [left, setLeft] = useState('4083720')
  const [right, setRight] = useState('4038999')
  const [result, setResult] = useState<ReturnType<typeof analyzePair> | null>(null)
  const normalizedLeft = normalizeDigits(left).slice(0, 7)
  const normalizedRight = normalizeDigits(right).slice(0, 7)
  const updateLeft = (value: string) => { setLeft(normalizeDigits(value).slice(0, 7)); setResult(null) }
  const updateRight = (value: string) => { setRight(normalizeDigits(value).slice(0, 7)); setResult(null) }
  return <div className="l9-interaction-card">
    <span className="l9-platform-badge"><Target size={15} aria-hidden="true" /> نشاط إثرائي · من إعداد المنصة</span>
    <h3>مختبر المقارنة: أين يظهر أول اختلاف؟</h3>
    <p>غيّر أحد العددين أو كليهما (حتى سبع خانات)، ثم اطلب التحليل. ستظهر لك الخانة التي حسمت المقارنة وسبب اختيار الرمز.</p>
    <div className="l9-number-inputs">
      <label htmlFor="l9-left-number">العدد الأول<input id="l9-left-number" type="text" inputMode="numeric" dir="ltr" value={normalizedLeft} onChange={event => updateLeft(event.currentTarget.value)} /></label>
      <span className="l9-versus" aria-hidden="true">؟</span>
      <label htmlFor="l9-right-number">العدد الثاني<input id="l9-right-number" type="text" inputMode="numeric" dir="ltr" value={normalizedRight} onChange={event => updateRight(event.currentTarget.value)} /></label>
    </div>
    <button type="button" className="l9-check-button" disabled={!normalizedLeft || !normalizedRight} onClick={() => setResult(analyzePair(normalizedLeft, normalizedRight))}>حلّل المقارنة</button>
    {result && <div className="l9-live-result" aria-live="polite" data-testid="l9-compare-result">
      <p className="l9-relation-line"><MathExpression>{fmt(result.left)}</MathExpression> <strong>{result.relation}</strong> <MathExpression>{fmt(result.right)}</MathExpression></p>
      <p>{result.explanation}</p>
      <PlaceValueTable visualId="l9-platform-live-place-table" caption="جدول المختبر: الخانات المتناظرة" numbers={[result.left, result.right]} focusPlace={result.placeId} />
    </div>}
  </div>
}

function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/gu, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/gu, digit => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/\D/gu, '')
    .replace(/^0+(?=\d)/u, '')
}

const placesFromLeft = ['الملايين', 'مئات الألوف', 'عشرات الألوف', 'الألوف', 'المئات', 'العشرات', 'الآحاد']
const placeIdByLabel: Record<string, string> = {
  الملايين: 'millions', 'مئات الألوف': 'hundred-thousands', 'عشرات الألوف': 'ten-thousands', الألوف: 'thousands', المئات: 'hundreds', العشرات: 'tens', الآحاد: 'ones',
}
function analyzePair(leftText: string, rightText: string) {
  const left = Number(leftText)
  const right = Number(rightText)
  const relation = left < right ? '<' : left > right ? '>' : '='
  if (leftText.length !== rightText.length) {
    return {
      left, right, relation, placeId: undefined,
      explanation: `${fmt(left)} فيه ${leftText.length} خانات و${fmt(right)} فيه ${rightText.length} خانات؛ لذلك العدد ذو الخانات الأكثر هو الأكبر.`,
    }
  }
  let firstIndex = -1
  for (let index = 0; index < leftText.length; index += 1) if (leftText[index] !== rightText[index]) { firstIndex = index; break }
  if (firstIndex < 0) return { left, right, relation, placeId: undefined, explanation: 'تطابقت الأرقام في كل الخانات؛ إذن العددان متساويان.' }
  const placeLabel = placesFromLeft[7 - leftText.length + firstIndex] ?? 'الخانة'
  const leftDigit = leftText[firstIndex]
  const rightDigit = rightText[firstIndex]
  return {
    left, right, relation, placeId: placeIdByLabel[placeLabel],
    explanation: `من اليسار تساوت الخانات السابقة؛ أول اختلاف في ${placeLabel}: ${leftDigit} مقابل ${rightDigit}. الأكبر في هذه الخانة يحدد العدد الأكبر.`,
  }
}

function SortWorkbench() {
  const initial = [4028050, 4200000, 3999999, 4025800]
  const [values, setValues] = useState(initial)
  const [direction, setDirection] = useState<'ascending' | 'descending'>('ascending')
  const [checked, setChecked] = useState(false)
  const sorted = useMemo(() => [...values].sort((a, b) => direction === 'ascending' ? a - b : b - a), [values, direction])
  const correct = values.every((value, index) => value === sorted[index])
  const move = (index: number, delta: -1 | 1) => {
    const nextIndex = index + delta
    if (nextIndex < 0 || nextIndex >= values.length) return
    setValues(previous => {
      const copy = [...previous]
      ;[copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]]
      return copy
    })
    setChecked(false)
  }
  const reset = () => { setValues(initial); setChecked(false) }
  return <div className="l9-interaction-card">
    <span className="l9-platform-badge"><Target size={15} aria-hidden="true" /> نشاط إثرائي · من إعداد المنصة</span>
    <h3>مختبر ترتيب البطاقات</h3>
    <p>اختر اتجاه الترتيب، ثم حرّك الأعداد بأزرار الأعلى والأسفل. يمكن تشغيل كل زر بلوحة المفاتيح أيضاً.</p>
    <label className="l9-direction-select" htmlFor="l9-sort-direction">اتجاه الترتيب
      <select id="l9-sort-direction" value={direction} onChange={event => { setDirection(event.currentTarget.value as 'ascending' | 'descending'); setChecked(false) }}>
        <option value="ascending">تصاعدي · من الأصغر إلى الأكبر</option>
        <option value="descending">تنازلي · من الأكبر إلى الأصغر</option>
      </select>
    </label>
    <ol className="l9-sort-list" dir="ltr" aria-label="بطاقات الأعداد المرتبة حالياً">
      {values.map((value, index) => <li key={value}>
        <span className="l9-sort-position">{index + 1}</span>
        <MathExpression>{fmt(value)}</MathExpression>
        <div className="l9-sort-controls">
          <button type="button" aria-label={`قدّم ${fmt(value)} إلى موضع أعلى`} title="قدّم للأعلى" disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={17} aria-hidden="true" /></button>
          <button type="button" aria-label={`أخّر ${fmt(value)} إلى موضع أدنى`} title="أخّر للأسفل" disabled={index === values.length - 1} onClick={() => move(index, 1)}><ArrowDown size={17} aria-hidden="true" /></button>
        </div>
      </li>)}
    </ol>
    <div className="l9-sort-actions">
      <button type="button" className="l9-check-button" onClick={() => setChecked(true)}><Check size={16} aria-hidden="true" /> تحقّق من الترتيب</button>
      <button type="button" className="l9-reset-button" onClick={reset}><RotateCcw size={16} aria-hidden="true" /> أعد البطاقات</button>
    </div>
    {checked && <p className={correct ? 'l9-task-feedback is-correct' : 'l9-task-feedback is-hint'} role="status">
      {correct
        ? `ترتيب صحيح. ${direction === 'ascending' ? 'كل بطاقة أصغر من التي تليها.' : 'كل بطاقة أكبر من التي تليها.'}`
        : 'ليس بعد؛ افحص الأعداد المتجاورة من أعلى منزلة، وتأكد من اتجاه الترتيب الذي اخترته.'}
    </p>}
  </div>
}

function StudentOpening() {
  const goals = teachingById('l9-p44-goals')
  return <div className="l9-step-content">
    <div className="l9-hero-panel">
      <div className="l9-hero-mark" aria-hidden="true"><span>≶</span><small>قارن<br />ثم رتّب</small></div>
      <div><p className="l9-eyebrow">الوحدة الثانية · الدرس الأول · ص 44–47</p><span className="l9-platform-badge"><Sparkles size={15} aria-hidden="true" /> سؤال تمهيدي من إعداد المنصة</span><h3>الرقم نفسه… هل تكون قيمته دائماً هي نفسها؟</h3><p>في العددين <MathExpression>2,406,018</MathExpression> و<MathExpression>2,460,018</MathExpression> تتكرر أرقام كثيرة. أيهما أكبر؟ اكتشف كيف تحسم المنزلة المناسبة المقارنة.</p></div>
    </div>
    <SourceElementCard id={goals.id} />
    <div className="l9-goal-and-why">
      <article><span className="l9-platform-badge">تطبيق من إعداد المنصة</span><Target size={20} aria-hidden="true" /><h3>لماذا نتعلّم هذا؟</h3><p>حتى نقرأ الأعداد الكبيرة بثقة، نعرف الأكبر والأصغر أو التساوي، ونرتّب بيانات جديدة من دون التخمين.</p></article>
      <article><span className="l9-platform-badge">أهداف التعلّم بصياغة المنصة</span><Check size={20} aria-hidden="true" /><h3>في نهاية الدرس ستستطيع</h3><ul><li>اختيار الرمز الصحيح: &lt; أو &gt; أو =.</li><li>المقارنة بعدد الخانات ثم بالقيمة المكانية.</li><li>ترتيب أعداد تصاعدياً أو تنازلياً وتفسير السبب.</li></ul></article>
    </div>
    <DiscoveryChallenge />
    <p className="l9-source-note">السؤال الاستكشافي والزيارات أُنشئا للمنصة؛ ليسا سؤالاً مطبوعاً في الكتاب. أهداف الدرس أعلاه من الكتاب، ص 44.</p>
  </div>
}

function SymbolStep() {
  return <div className="l9-step-content">
    <p className="l9-step-lead"><strong>شرح المنصة:</strong> قبل أن نقارن أعداداً كبيرة، نتأكد من معنى العلامة: هل تصف الأصغر، الأكبر، أم التساوي؟</p>
    <SourceElementCard id="l9-p44-less-than" />
    <SourceElementCard id="l9-p44-greater-than" />
    <SourceElementCard id="l9-p44-equality" />
    <QuestionGroup groupId="l9-p44-q1" />
    <QuestionGroup groupId="l9-p44-q2" />
  </div>
}

function DigitCountStep() {
  return <div className="l9-step-content">
    <p className="l9-step-lead"><strong>شرح المنصة:</strong> قد يبدو أن 9 أكبر من 1، لكننا لا نقارن أول رقم وحده عندما يختلف طول العددين.</p>
    <SourceElementCard id="l9-p45-purpose" />
    <SourceElementCard id="l9-p45-digit-count-rule" />
    <SourceElementCard id="l9-p45-digit-count-example" />
    <div className="l9-why-box"><Lightbulb size={19} aria-hidden="true" /><p><strong>شرح المنصة · لماذا تنجح قاعدة عدد الخانات؟</strong> ست خانات لا تتجاوز <MathExpression>999,999</MathExpression>؛ أما أول عدد من سبع خانات فهو <MathExpression>1,000,000</MathExpression>. لذلك لا يمكن لعدد من ست خانات أن يتغلب على عدد من سبع خانات.</p></div>
  </div>
}

function SameLengthStep() {
  return <div className="l9-step-content">
    <p className="l9-step-lead"><strong>شرح المنصة:</strong> إذا تساوى عدد الخانات، ابدأ من المكان الأعلى قيمةً. لا تقفز إلى خانة الآحاد.</p>
    <SourceElementCard id="l9-p45-same-length-rule" />
    <SourceElementCard id="l9-p45-million-comparison-example" />
    <SourceElementCard id="l9-p45-first-difference-example" />
    <SourceElementCard id="l9-p46-first-difference-resolution" />
    <div className="l9-why-box"><Lightbulb size={19} aria-hidden="true" /><p><strong>شرح إضافي من المنصة · لماذا يحسم أول اختلاف؟</strong> عند مقارنة <MathExpression>6,300</MathExpression> و<MathExpression>5,999</MathExpression>، تكفي مئات الألوف: حتى لو كانت الخانات الأصغر في العدد الأول صفراً وفي الثاني أكبر ما يمكن، فإن قيمة مئة ألف واحدة تتجاوز كل ما دونها. هذه ملاحظة تفسيرية تساعد على فهم قاعدة الكتاب.</p></div>
  </div>
}

function EqualityAndOrderingStep() {
  return <div className="l9-step-content">
    <SourceElementCard id="l9-p46-equality-rule" />
    <SourceElementCard id="l9-p46-equality-example" />
    <SourceElementCard id="l9-p46-ordering-benefit-example" />
    <QuestionGroup groupId="l9-p44-q3" />
    <QuestionGroup groupId="l9-p44-q4" />
    <div className="l9-contrast-note"><strong>ملاحظة المنصة:</strong><span><b>فرق صغير في الكلام، كبير في النتيجة:</b> تصاعدي = من الأصغر إلى الأكبر. تنازلي = من الأكبر إلى الأصغر.</span></div>
  </div>
}

function CheckUnderstandingStep() {
  return <div className="l9-step-content">
    <p className="l9-step-lead"><strong>إرشاد المنصة:</strong> الآن طبّق القاعدة على بطاقات المصدر، ثم فسّر لماذا تبدأ المقارنة من جهة اليسار.</p>
    <QuestionGroup groupId="l9-check-q1" />
    <QuestionGroup groupId="l9-check-q2" />
    <QuestionGroup groupId="l9-check-q3" />
    <QuestionGroup groupId="l9-oral-explain" />
  </div>
}

function PracticeCompareStep() {
  return <div className="l9-step-content">
    <p className="l9-step-lead"><strong>إرشاد المنصة:</strong> هذه عبارات الكتاب كما هي. لا تكتفِ بتحديد الرمز؛ حدّد الخانة التي جعلت العبارة صحيحة أو خاطئة.</p>
    <QuestionGroup groupId="l9-practice-ex1" />
    <QuestionGroup groupId="l9-practice-ex2" />
  </div>
}

function PracticeOrderStep() {
  return <div className="l9-step-content">
    <p className="l9-step-lead"><strong>إرشاد المنصة:</strong> في الترتيب، قارن كل زوج من الأعداد المتقاربة، ثم تحقّق من أن القائمة كلها تسير بالاتجاه المطلوب.</p>
    <QuestionGroup groupId="l9-practice-ex3" />
    <QuestionGroup groupId="l9-practice-ex4" />
  </div>
}

function PracticeAreasStep() {
  return <div className="l9-step-content">
    <p className="l9-step-lead"><strong>شرح المنصة:</strong> نفس فكرة المقارنة تعمل مع بيانات حقيقية: المساحات هنا بوحدة واحدة، لذلك يمكن مقارنة القيم العددية مباشرة.</p>
    <QuestionGroup groupId="l9-practice-ex5" />
  </div>
}

function PlatformLabStep() {
  return <div className="l9-step-content">
    <p className="l9-step-lead">الأنشطة التالية جديدة من إعداد المنصة؛ ليست أسئلة مطبوعة ولا تدخل في سجل تمارين الكتاب.</p>
    <CompareWorkbench />
    <SortWorkbench />
  </div>
}

function LessonRecap() {
  return <div className="l9-step-content">
    <div className="l9-recap-card">
      <span className="l9-platform-badge"><Sparkles size={15} aria-hidden="true" /> خلاصة المنصة</span>
      <h3>خريطة المقارنة في أربع خطوات</h3>
      <ol>
        <li><strong>عدّ الخانات:</strong> إذا اختلف عددها، فالأكثر خانات هو الأكبر.</li>
        <li><strong>ابدأ من اليسار:</strong> إذا تساوى العدد، افحص الملايين ثم المنازل التالية.</li>
        <li><strong>توقف عند أول اختلاف:</strong> الرقم الأكبر في تلك المنزلة يجعل العدد كله أكبر.</li>
        <li><strong>إذا لم يظهر اختلاف:</strong> العددان متساويان. بعد ذلك رتّب القائمة تصاعدياً أو تنازلياً حسب المطلوب.</li>
      </ol>
      <div className="l9-memory-line"><span><MathExpression>&lt;</MathExpression> أصغر من</span><span><MathExpression>&gt;</MathExpression> أكبر من</span><span><MathExpression>=</MathExpression> يساوي</span></div>
    </div>
    <div className="l9-final-thought"><CircleAlert size={19} aria-hidden="true" /><p><strong>تذكير المنصة · اختبار ذاتي:</strong> هل تستطيع شرح سبب صحة الرمز من دون النظر إلى آخر رقم فقط؟ إذا نعم، فأنت جاهز لاختبار الدرس المستقل.</p></div>
    <a className="l9-independent-test-link" href="#tests/run/lesson-compare-order-natural-numbers-test">انتقل إلى اختبار الدرس المستقل · 20 سؤالاً <ArrowLeft size={18} aria-hidden="true" /></a>
    <p className="l9-source-note">الاختبار مستقل عن هذا الدرس، وحلوله لا تظهر إلا بعد تسليم المحاولة وفق نظام المنصة.</p>
  </div>
}

export function ComparingNaturalNumbersLesson() {
  const steps: LessonStep[] = [
    { id: 'opening', title: 'سؤال يفتح الفكرة', content: <StudentOpening /> },
    { id: 'symbols', title: 'معنى الرموز الثلاثة', content: <SymbolStep /> },
    { id: 'digit-count', title: 'ابدأ بعدد الخانات', content: <DigitCountStep /> },
    { id: 'same-length', title: 'أول اختلاف يحسم', content: <SameLengthStep /> },
    { id: 'equality-order', title: 'التساوي ثم الترتيب', content: <EqualityAndOrderingStep /> },
    { id: 'understanding', title: 'تحقّق من فهمك', content: <CheckUnderstandingStep /> },
    { id: 'practice-compare', title: 'تدرّب: المقارنة', content: <PracticeCompareStep /> },
    { id: 'practice-order', title: 'تدرّب: الترتيب والخانات', content: <PracticeOrderStep /> },
    { id: 'practice-areas', title: 'تطبيق: مساحات المحافظات', content: <PracticeAreasStep /> },
    { id: 'platform-lab', title: 'مختبر المنصة', content: <PlatformLabStep /> },
    { id: 'recap', title: 'الخلاصة والاستعداد', content: <LessonRecap /> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title="مقارنة الأعداد الطبيعية وترتيبها" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-nine" />
}
