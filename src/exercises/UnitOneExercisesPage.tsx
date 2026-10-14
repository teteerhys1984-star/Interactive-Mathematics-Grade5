import { useState, type FormEvent } from 'react'
import { ArrowLeft, BookOpenCheck, Check, RotateCcw, Ruler } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import {
  columnAdditionExercises,
  coordinateMatchOptions,
  fuelProductionRows,
  libraryVisitorData,
  temperatureGraphData,
  unitOneBookExercises,
  type UnitOneBookExercise,
  type UnitOneExerciseTask,
} from './unitOneExercisesData'
import './unit-one-exercises.css'

const PAGE_LABELS = ['ص 40', 'ص 41', 'ص 42', 'ص 43'] as const
const toAsciiDigit = (digit: string) => String.fromCharCode(digit.charCodeAt(0) - 0x0660 + 0x0030)
const toAsciiPersianDigit = (digit: string) => String.fromCharCode(digit.charCodeAt(0) - 0x06f0 + 0x0030)

function normalizeAnswer(value: string): string {
  return value.normalize('NFKC')
    .replace(/[٠-٩]/gu, toAsciiDigit)
    .replace(/[۰-۹]/gu, toAsciiPersianDigit)
    .replace(/centimeters?|centimetres?|cm|سنتيمترات|سنتيمتر|سم|طن|أطنان|درجة|درجات|بالآلاف|ألف|آلاف/giu, '')
    .toLocaleLowerCase('ar')
    .replace(/[^\p{L}\p{N}+-]/gu, '')
}

function answersMatch(value: string, expected: string): boolean {
  return normalizeAnswer(value) === normalizeAnswer(expected)
}

function resultMessage(correct: boolean): string {
  return correct
    ? 'أحسنت، إجابتك صحيحة. انتقل إلى التمرين التالي أو راجع خطواتك.'
    : 'ليست مطابقة بعد. أعد قراءة المعطيات وجرّب مرة أخرى؛ لم نكشف الإجابة لتبقى فرصة التفكير لك.'
}

function BranchTag({ branch }: { branch?: string }) {
  if (!branch) return null
  return <span className="unit-exercise-branch" aria-label={`الفرع ${branch}`}>({branch})</span>
}

function StudentAnswerForm({
  task,
  label,
  placeholder,
  suffix,
  expectedAnswer = task.expectedAnswer,
}: {
  task: UnitOneExerciseTask
  label: string
  placeholder?: string
  suffix?: string
  expectedAnswer?: string
}) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = answersMatch(value, expectedAnswer)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setChecked(true)
  }
  return <form className="unit-exercise-answer-form" onSubmit={submit}>
    <label htmlFor={`answer-${task.id}`}><BranchTag branch={task.branch} />{label}</label>
    <div className="unit-exercise-answer-control">
      <input
        id={`answer-${task.id}`}
        type="text"
        inputMode="text"
        dir="ltr"
        autoComplete="off"
        value={value}
        placeholder={placeholder ?? 'اكتب إجابتك'}
        onChange={(event) => { setValue(event.target.value); setChecked(false) }}
        aria-describedby={checked ? `feedback-${task.id}` : undefined}
      />
      {suffix && <span className="unit-exercise-answer-suffix">{suffix}</span>}
      <button type="submit">تحقّق</button>
    </div>
    {checked && <p id={`feedback-${task.id}`} className={`unit-exercise-feedback ${correct ? 'is-correct' : 'is-retry'}`} role="status">{resultMessage(correct)}</p>}
  </form>
}

function ChoiceAnswer({
  task,
  choices,
}: {
  task: UnitOneExerciseTask
  choices: readonly string[]
}) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const correct = answersMatch(value, task.expectedAnswer)
  return <div className="unit-exercise-choice" id={`student-task-${task.id}`}>
    <p><BranchTag branch={task.branch} /> <BidiText>{task.sourceText}</BidiText></p>
    <div className="unit-exercise-choice-options" role="group" aria-label={`خيارات الإجابة ${task.branch ? `للفرع ${task.branch}` : ''}`}>
      {choices.map((choice) => <button key={choice} type="button" aria-pressed={value === choice} className={value === choice ? 'is-selected' : ''} onClick={() => { setValue(choice); setChecked(false) }}>{choice}</button>)}
    </div>
    <button type="button" className="unit-exercise-check-button" onClick={() => setChecked(true)}>تحقّق</button>
    {checked && <p className={`unit-exercise-feedback ${correct ? 'is-correct' : 'is-retry'}`} role="status">{resultMessage(correct)}</p>}
  </div>
}

function MatchingActivity({ question }: { question: UnitOneBookExercise }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const correct = question.tasks.every((task) => answersMatch(answers[task.id] ?? '', task.expectedAnswer))
  return <div className="unit-exercise-matching">
    <div className="matching-source-graph"><CoordinatePlane xMax={5} yMax={5} label="شبكة إحداثيات من مبدأ الإحداثيات حتى 5 وحدات على كل محور، كما في السؤال الأول." showArabicAxisLabels={false} /></div>
    <section className="matching-source-options" aria-label="خيارات العمود B المطبوعة">
      <h3>العمود (B)</h3>
      <ol>{coordinateMatchOptions.map((pair) => <li key={pair}><MathExpression>{pair}</MathExpression></li>)}</ol>
    </section>
    <div className="matching-source-rows">
      <h3>العمود (A)</h3>
      {question.tasks.map((task) => <div className="matching-source-row" id={`student-task-${task.id}`} key={task.id}>
        <label htmlFor={`match-${task.id}`}><BranchTag branch={task.branch} /><BidiText>{task.sourceText}</BidiText></label>
        <select id={`match-${task.id}`} value={answers[task.id] ?? ''} onChange={(event) => { setAnswers((previous) => ({ ...previous, [task.id]: event.target.value })); setChecked(false) }}>
          <option value="">اختر الثنائية</option>
          {coordinateMatchOptions.map((pair) => <option value={pair} key={pair}>{pair}</option>)}
        </select>
      </div>)}
    </div>
    <button type="button" className="unit-exercise-check-button" onClick={() => setChecked(true)}>تحقّق من المطابقة</button>
    {checked && <p className={`unit-exercise-feedback ${correct ? 'is-correct' : 'is-retry'}`} role="status">{correct ? 'أحسنت، طابقت العبارات الأربع بالثنائيات الصحيحة.' : 'راجع ترتيب (الأفقي، الشاقولي) في كل عبارة، ثم تحقّق من المطابقة مرة أخرى.'}</p>}
  </div>
}

interface GridPoint { x: number; y: number }
type NamedPoint = 'A' | 'B' | 'C'

function CoordinatePlane({
  xMax,
  yMax,
  markers = {},
  activeName,
  onPointChoose,
  label,
  showArabicAxisLabels = true,
}: {
  xMax: number
  yMax: number
  markers?: Partial<Record<NamedPoint, GridPoint>>
  activeName?: NamedPoint
  onPointChoose?: (point: GridPoint) => void
  label: string
  showArabicAxisLabels?: boolean
}) {
  const cell = 42
  const left = 49
  const top = 22
  const bottom = 43
  const right = 34
  const width = left + xMax * cell + right
  const height = top + yMax * cell + bottom
  const originX = left
  const originY = top + yMax * cell
  const xPixel = (x: number) => originX + x * cell
  const yPixel = (y: number) => originY - y * cell
  const interactive = Boolean(onPointChoose && activeName)
  return <div className="unit-exercise-graph-scroll" dir="ltr">
    <svg className="unit-exercise-coordinate-plane" viewBox={`0 0 ${width} ${height}`} role={interactive ? 'group' : 'img'} aria-label={label} direction="ltr" style={{ unicodeBidi: 'isolate' }}>
      <defs>
        <marker id={`coord-arrow-${xMax}-${yMax}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#344c60" /></marker>
      </defs>
      <rect x={originX} y={top} width={xMax * cell} height={yMax * cell} fill="#fffdf8" />
      {Array.from({ length: xMax + 1 }, (_, x) => <line key={`v-${x}`} x1={xPixel(x)} y1={top} x2={xPixel(x)} y2={originY} stroke="#9e9890" strokeWidth="1" strokeDasharray="4 4" />)}
      {Array.from({ length: yMax + 1 }, (_, y) => <line key={`h-${y}`} x1={originX} y1={yPixel(y)} x2={xPixel(xMax)} y2={yPixel(y)} stroke="#9e9890" strokeWidth="1" strokeDasharray="4 4" />)}
      <line x1={originX} y1={originY} x2={xPixel(xMax) + 20} y2={originY} stroke="#222" strokeWidth="2" markerEnd={`url(#coord-arrow-${xMax}-${yMax})`} />
      <line x1={originX} y1={originY} x2={originX} y2={top - 10} stroke="#222" strokeWidth="2" markerEnd={`url(#coord-arrow-${xMax}-${yMax})`} />
      {Array.from({ length: xMax + 1 }, (_, x) => <text key={`xn-${x}`} x={xPixel(x)} y={originY + 18} textAnchor="middle" className="unit-exercise-svg-number" direction="ltr" unicodeBidi="isolate">{x === 0 ? '' : x}</text>)}
      {Array.from({ length: yMax + 1 }, (_, y) => <text key={`yn-${y}`} x={originX - 10} y={yPixel(y) + 4} textAnchor="end" className="unit-exercise-svg-number" direction="ltr" unicodeBidi="isolate">{y === 0 ? '' : y}</text>)}
      <text x={originX - 8} y={originY + 29} className="unit-exercise-svg-origin" direction="ltr" unicodeBidi="isolate">O(0,0)</text>
      {Array.from({ length: xMax + 1 }, (_, x) => Array.from({ length: yMax + 1 }, (_, y) => interactive ? <circle
        key={`hit-${x}-${y}`}
        cx={xPixel(x)} cy={yPixel(y)} r="13"
        className="unit-exercise-grid-hit"
        role="button" tabIndex={0}
        aria-label={`ضع النقطة ${activeName} عند (${x},${y})`}
        onClick={() => onPointChoose?.({ x, y })}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPointChoose?.({ x, y }) } }}
      /> : null))}
      {Object.entries(markers).map(([name, point]) => {
        if (!point) return null
        return <g key={name} className="unit-exercise-plotted-point" pointerEvents="none">
          <circle cx={xPixel(point.x)} cy={yPixel(point.y)} r="7" />
          <text x={xPixel(point.x) + 9} y={yPixel(point.y) - 9} direction="ltr" unicodeBidi="isolate">{name}</text>
        </g>
      })}
      {showArabicAxisLabels && <>
        <text x={width - 3} y={originY + 32} textAnchor="end" className="unit-exercise-axis-label" direction="rtl">المحور الأفقي</text>
        <text x={originX - 4} y={top - 12} textAnchor="end" className="unit-exercise-axis-label" direction="rtl">المحور الشاقولي</text>
      </>}
    </svg>
  </div>
}

function PointPlotActivity({ task }: { task: UnitOneExerciseTask }) {
  const [markers, setMarkers] = useState<Partial<Record<NamedPoint, GridPoint>>>({})
  const [activeName, setActiveName] = useState<NamedPoint>('A')
  const [checked, setChecked] = useState(false)
  const names: NamedPoint[] = ['A', 'B', 'C']
  const allCorrect = markers.A?.x === 2 && markers.A?.y === 1
    && markers.B?.x === 4 && markers.B?.y === 1
    && markers.C?.x === 1 && markers.C?.y === 3
  const plot = (point: GridPoint) => {
    setMarkers((previous) => ({ ...previous, [activeName]: point }))
    setChecked(false)
    const next = names.find((name) => !markers[name] && name !== activeName) ?? names.find((name) => name !== activeName)
    if (next) setActiveName(next)
  }
  return <div className="unit-exercise-plot-activity" id={`student-task-${task.id}`}>
    <p className="unit-exercise-task-source"><BidiText>{task.sourceText}</BidiText></p>
    <p className="unit-exercise-instruction">اختَر اسم النقطة، ثم انقر تقاطع الشبكة لوضعها. يمكنك اختيار الاسم مجدداً لتعديل موضعها.</p>
    <div className="unit-exercise-point-picker" role="group" aria-label="اختر اسم النقطة المراد تمثيلها">
      {names.map((name) => <button key={name} type="button" aria-pressed={activeName === name} className={activeName === name ? 'is-selected' : ''} onClick={() => setActiveName(name)}>{name}{markers[name] ? <Check size={15} aria-hidden="true" /> : null}</button>)}
    </div>
    <CoordinatePlane xMax={6} yMax={5} markers={markers} activeName={activeName} onPointChoose={plot} label="شبكة إحداثيات من الأصل حتى 6 أفقياً و5 شاقولياً؛ انقر تقاطعاً لتمثيل النقطة المختارة." />
    <div className="unit-exercise-d-coordinate"><StudentAnswerForm task={task} label="إحداثيا D للرباعي ABDC" placeholder="مثال: (3,3)" expectedAnswer="(3,3)" /></div>
    <button type="button" className="unit-exercise-check-button" onClick={() => setChecked(true)}>تحقّق من تمثيل A وB وC</button>
    {checked && <p className={`unit-exercise-feedback ${allCorrect ? 'is-correct' : 'is-retry'}`} role="status">{allCorrect ? 'النقاط الثلاث في مواضعها الصحيحة.' : 'تأكّد من أن ترتيب الزوج (x,y) أفقي ثم شاقولي، وأن كل نقطة على تقاطعها المطلوب.'}</p>}
  </div>
}

function NumericExercise({ question }: { question: UnitOneBookExercise }) {
  return <div className="unit-exercise-task-list">
    {question.tasks.map((task) => <div className="unit-exercise-task-row" id={`student-task-${task.id}`} key={task.id}>
      <p className="unit-exercise-task-source"><BranchTag branch={task.branch} /><MathExpression>{task.sourceText}</MathExpression></p>
      <StudentAnswerForm task={task} label="الناتج" placeholder="اكتب العدد" />
    </div>)}
  </div>
}

function ColumnAdditionTask({
  addition,
  task,
}: {
  addition: (typeof columnAdditionExercises)[number]
  task: UnitOneExerciseTask
}) {
  const blankPositions = addition.bottom.map((digit, index) => digit === '' ? index : -1).filter((index) => index >= 0)
  const [values, setValues] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const isCorrect = blankPositions.every((position, index) => values[position] === addition.missing[index])
  const submit = (event: FormEvent) => { event.preventDefault(); setChecked(true) }
  return <form className="unit-exercise-column-task" id={`student-task-${task.id}`} onSubmit={submit}>
    <p className="column-addition-branch"><BranchTag branch={addition.branch} /></p>
    <div className="column-addition-source" dir="ltr" aria-label={`تمرين الجمع العمودي الفرع ${addition.branch}`}>
      <div className="column-addition-row"><span className="column-addition-operator" /><div className="column-addition-digits">{addition.top.map((digit, index) => <span key={`t-${index}`}>{digit}</span>)}</div></div>
      <div className="column-addition-row"><span className="column-addition-operator">+</span><div className="column-addition-digits">{addition.bottom.map((digit, index) => digit === ''
        ? <input key={`b-${index}`} type="text" inputMode="numeric" maxLength={1} value={values[index] ?? ''} aria-label={`التمرين 4، الفرع ${addition.branch}، المربع ${blankPositions.indexOf(index) + 1}`} onChange={(event) => { setValues((previous) => ({ ...previous, [index]: event.target.value.replace(/[^0-9٠-٩۰-۹]/gu, '').slice(-1) })); setChecked(false) }} />
        : <span key={`b-${index}`}>{digit}</span>)}</div></div>
      <div className="column-addition-rule" />
      <div className="column-addition-row"><span className="column-addition-operator" /><div className="column-addition-digits">{addition.result.map((digit, index) => <span key={`r-${index}`}>{digit}</span>)}</div></div>
    </div>
    <p className="column-addition-source-text"><BidiText>{task.sourceText}</BidiText></p>
    <button type="submit" className="unit-exercise-check-button">تحقّق من الرقمين</button>
    {checked && <p className={`unit-exercise-feedback ${isCorrect ? 'is-correct' : 'is-retry'}`} role="status">{isCorrect ? 'الرقمان صحيحان؛ تحقق أيضاً من جميع أعمدة الجمع.' : 'راجع عمود الآحاد أولاً، ثم اتبع أثر الحمل قبل ملء المربع الآخر.'}</p>}
  </form>
}

function ColumnAdditionActivity({ question }: { question: UnitOneBookExercise }) {
  return <div className="unit-exercise-column-list">
    {columnAdditionExercises.map((addition) => {
      const task = question.tasks.find((candidate) => candidate.id === addition.id)
      return task ? <ColumnAdditionTask key={addition.id} addition={addition} task={task} /> : null
    })}
  </div>
}

function ParallelogramsFigure() {
  return <figure className="unit-exercise-figure">
    <div className="unit-exercise-graph-scroll" dir="ltr">
      <svg className="unit-exercise-geometry-figure" viewBox="0 0 430 310" role="img" aria-label="متوازيا الأضلاع ABCD وXYZD، مع الأسهم التي تبيّن الأضلاع المتوازية والقياسات المعطاة">
        <defs>
          <marker id="parallel-blue-arrow" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#176bc0" /></marker>
          <marker id="parallel-red-arrow" markerWidth="8" markerHeight="8" refX="4" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#dc4f4f" /></marker>
        </defs>
        <path d="M76 48 L337 48 L307 126 L46 126 Z" fill="#fff" stroke="#176bc0" strokeWidth="2.4" />
        <path d="M46 126 L206 126 L174 271 L12 271 Z" fill="#fff" stroke="#176bc0" strokeWidth="2.4" />
        <line x1="186" y1="48" x2="132" y2="48" stroke="#176bc0" strokeWidth="1.7" markerEnd="url(#parallel-blue-arrow)" />
        <line x1="154" y1="126" x2="100" y2="126" stroke="#176bc0" strokeWidth="1.7" markerEnd="url(#parallel-blue-arrow)" />
        <line x1="120" y1="271" x2="68" y2="271" stroke="#176bc0" strokeWidth="1.7" markerEnd="url(#parallel-blue-arrow)" />
        <line x1="61" y1="91" x2="54" y2="108" stroke="#dc4f4f" strokeWidth="2" markerEnd="url(#parallel-red-arrow)" />
        <line x1="320" y1="91" x2="313" y2="108" stroke="#dc4f4f" strokeWidth="2" markerEnd="url(#parallel-red-arrow)" />
        <line x1="193" y1="190" x2="186" y2="222" stroke="#dc4f4f" strokeWidth="2" markerEnd="url(#parallel-red-arrow)" />
        <line x1="25" y1="222" x2="32" y2="190" stroke="#dc4f4f" strokeWidth="2" markerEnd="url(#parallel-red-arrow)" />
        <path d="M72 35 L337 35 M72 31 L72 39 M337 31 L337 39" fill="none" stroke="#555" strokeWidth="1" />
        <text x="204" y="26" textAnchor="middle" className="unit-exercise-svg-measure">7cm</text>
        <text x="348" y="92" className="unit-exercise-svg-measure">2cm</text>
        <text x="93" y="296" textAnchor="middle" className="unit-exercise-svg-measure">3cm</text>
        <text x="193" y="225" className="unit-exercise-svg-measure">4cm</text>
        <g className="unit-exercise-vertex-labels">
          <text x="61" y="45">A</text><text x="344" y="45">B</text><text x="312" y="145">C</text><text x="31" y="145">D</text>
          <text x="0" y="291">X</text><text x="169" y="291">Y</text><text x="211" y="143">Z</text>
        </g>
      </svg>
    </div>
    <figcaption>إعادة رسم المنصة للشكل المطبوع؛ الأسهم تحفظ علاقات التوازي واتجاهاتها، ولا يُستنتج طول من مظهر الرسم.</figcaption>
  </figure>
}

function SegmentLengthsActivity({ question }: { question: UnitOneBookExercise }) {
  return <div className="unit-exercise-task-list">
    <ParallelogramsFigure />
    {question.tasks.map((task) => <div className="unit-exercise-task-row" id={`student-task-${task.id}`} key={task.id}>
      <p className="unit-exercise-task-source"><MathExpression>{task.referenceLabel ?? task.sourceText}</MathExpression></p>
      <StudentAnswerForm task={task} label={`طول ${task.referenceLabel ?? 'القطعة'}`} suffix="cm" placeholder="الطول" />
    </div>)}
  </div>
}

function FuelProductionTable() {
  return <div className="unit-exercise-table-wrap">
    <table className="unit-exercise-table" dir="rtl">
      <caption>إنتاج البنزين الممتاز في محافظة حمص</caption>
      <thead><tr><th scope="col">السنة</th><th scope="col">الإنتاج (طن)</th></tr></thead>
      <tbody>{fuelProductionRows.map((row) => <tr key={row.year}><th scope="row"><MathExpression>{String(row.year)}</MathExpression></th><td><MathExpression>{String(row.productionTons)}</MathExpression></td></tr>)}</tbody>
    </table>
  </div>
}

function EconomyActivity({ question }: { question: UnitOneBookExercise }) {
  return <div className="unit-exercise-economy">
    <p className="unit-exercise-context"><BidiText>{question.sourceContext ?? ''}</BidiText></p>
    <FuelProductionTable />
    {question.tasks.map((task) => task.branch === 'أ'
      ? <div className="unit-exercise-task-row" id={`student-task-${task.id}`} key={task.id}><p className="unit-exercise-task-source"><BranchTag branch={task.branch} /><BidiText>{task.sourceText}</BidiText></p><StudentAnswerForm task={task} label="الإنتاج بعد التقريب إلى أقرب مليون (طن)" placeholder="مثال: 1 000 000" /></div>
      : <div className="unit-exercise-task-row" id={`student-task-${task.id}`} key={task.id}><p className="unit-exercise-task-source"><BranchTag branch={task.branch} /><BidiText>{task.sourceText}</BidiText></p><StudentAnswerForm task={task} label="اكتب السنوات من الأقل إنتاجاً إلى الأعلى، مفصولة بفواصل" placeholder="مثال: 2005، 2007، ..." /></div>)}
  </div>
}

const angleTasks = [
  { id: 'p42-q07-hur', name: 'HUR', vertex: 'U', firstRay: 'UR', secondRay: 'UH', degrees: 93 },
  { id: 'p42-q07-mnh', name: 'MNH', vertex: 'N', firstRay: 'NH', secondRay: 'NM', degrees: 48 },
  { id: 'p42-q07-acd', name: 'ACD', vertex: 'C', firstRay: 'CD', secondRay: 'CA', degrees: 175 },
] as const

function AngleDiagram({ degrees, name, vertex, firstRay, secondRay }: {
  degrees: number; name: string; vertex: string; firstRay: string; secondRay: string
}) {
  const ox = 55, oy = 132, length = 105
  const radians = degrees * Math.PI / 180
  const endX = ox + length * Math.cos(radians)
  const endY = oy - length * Math.sin(radians)
  const arcRadius = 24
  const arcX = ox + arcRadius * Math.cos(radians)
  const arcY = oy - arcRadius * Math.sin(radians)
  const largeArc = degrees > 180 ? 1 : 0
  return <svg className="unit-exercise-angle-svg" viewBox="0 0 220 165" role="img" aria-label={`تمثيل زاوية ${name} عند ${vertex} بقياس ${degrees} درجة`} direction="ltr" style={{ unicodeBidi: 'isolate' }}>
    <line x1={ox} y1={oy} x2={ox + length} y2={oy} stroke="#275d87" strokeWidth="3" />
    <line x1={ox} y1={oy} x2={endX} y2={endY} stroke="#b14462" strokeWidth="3" />
    <path d={`M ${ox + arcRadius} ${oy} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcX} ${arcY}`} fill="none" stroke="#c19943" strokeWidth="2" />
    <circle cx={ox} cy={oy} r="4" fill="#1f3a5f" />
    <text x={ox - 5} y={oy + 20} textAnchor="middle" className="unit-exercise-svg-measure">{vertex}</text>
    <text x={ox + length + 4} y={oy + 5} className="unit-exercise-svg-measure">{firstRay.slice(-1)}</text>
    <text x={endX + (degrees < 100 ? 6 : -14)} y={endY - 6} className="unit-exercise-svg-measure">{secondRay.slice(-1)}</text>
    <text x={degrees < 100 ? ox + 34 : ox + 30} y={degrees < 100 ? oy - 14 : oy - 20} className="unit-exercise-svg-measure">{degrees}°</text>
    <title>{`∠${name}, رأسها ${vertex}; الشعاعان ${firstRay} و${secondRay}`}</title>
  </svg>
}

function AngleDrawingTask({
  task,
  angle,
}: {
  task: UnitOneExerciseTask
  angle: (typeof angleTasks)[number]
}) {
  const [degrees, setDegrees] = useState(90)
  const [checked, setChecked] = useState(false)
  const [copied, setCopied] = useState(false)
  const correct = degrees === angle.degrees
  return <section className="unit-exercise-angle-task" id={`student-task-${task.id}`}>
    <p className="unit-exercise-task-source"><MathExpression>{task.sourceText}</MathExpression></p>
    <AngleDiagram degrees={degrees} name={angle.name} vertex={angle.vertex} firstRay={angle.firstRay} secondRay={angle.secondRay} />
    <label className="unit-exercise-range-label" htmlFor={`angle-range-${task.id}`}>حرّك الشعاع إلى القياس المعطى: <MathExpression>{angle.degrees}°</MathExpression></label>
    <input id={`angle-range-${task.id}`} className="unit-exercise-angle-range" type="range" min="0" max="180" step="1" value={degrees} onChange={(event) => { setDegrees(Number(event.target.value)); setChecked(false) }} aria-valuetext={`${degrees} درجة`} />
    <p className="unit-exercise-angle-readout">قياس الشعاع الحالي: <MathExpression>{degrees}°</MathExpression></p>
    <button type="button" className="unit-exercise-check-button" onClick={() => setChecked(true)}>تحقّق من بناء الزاوية</button>
    {checked && <p className={`unit-exercise-feedback ${correct ? 'is-correct' : 'is-retry'}`} role="status">{correct ? 'القياس مضبوط. انقل الرسم إلى دفترك واكتب اسم الزاوية بحيث يكون الحرف الأوسط هو الرأس.' : 'أعد تحريك الشعاع إلى التدريج المطلوب، ثم قِس الزاوية من الرأس.'}</p>}
    <label className="unit-exercise-done-check"><input type="checkbox" checked={copied} onChange={(event) => setCopied(event.target.checked)} /> رسمت الزاوية وكتبت اسمها في دفتري.</label>
    {copied && <p className="unit-exercise-small-status" role="status">أحسنت؛ لا تنسَ وضع حرف الرأس في منتصف اسم الزاوية.</p>}
  </section>
}

function AngleActivity({ question }: { question: UnitOneBookExercise }) {
  return <div className="unit-exercise-angle-list">
    {angleTasks.map((angle) => {
      const task = question.tasks.find((candidate) => candidate.id === angle.id)
      return task ? <AngleDrawingTask key={angle.id} task={task} angle={angle} /> : null
    })}
  </div>
}

function TrueFalseActivity({ question }: { question: UnitOneBookExercise }) {
  return <div className="unit-exercise-task-list">
    {question.tasks.map((task) => <ChoiceAnswer key={task.id} task={task} choices={['صح', 'خطأ']} />)}
  </div>
}

function ConstructionModel({ type }: { type: 'rhombus' | 'parallelogram' }) {
  if (type === 'rhombus') return <svg className="unit-exercise-construction-model" viewBox="0 0 300 220" role="img" aria-label="نموذج توضيحي لمعين ABCD طول ضلعه 4 سنتيمترات وزاويته B ستّون درجة" direction="ltr" style={{ unicodeBidi: 'isolate' }}>
    <path d="M65 38 L175 38 L120 133 L10 133 Z" fill="#fff" stroke="#176bc0" strokeWidth="3" />
    <text x="54" y="34">A</text><text x="178" y="34">B</text><text x="123" y="140">C</text><text x="0" y="151">D</text>
    <text x="105" y="27">4cm</text><text x="151" y="88">4cm</text><text x="60" y="154">4cm</text><text x="43" y="90">4cm</text>
    <text x="153" y="59">60°</text><title>نموذج منصة إضافي، وليس رسماً مطبوعاً في الكتاب</title>
  </svg>
  return <svg className="unit-exercise-construction-model" viewBox="0 0 320 210" role="img" aria-label="نموذج توضيحي لمتوازي الأضلاع XYZW" direction="ltr" style={{ unicodeBidi: 'isolate' }}>
    <path d="M99 124 L171 124 L187 35 L115 35 Z" fill="#fff" stroke="#176bc0" strokeWidth="3" />
    <text x="84" y="140">X</text><text x="173" y="142">Y</text><text x="191" y="34">Z</text><text x="102" y="29">W</text>
    <text x="127" y="146">4cm</text><text x="79" y="82">5cm</text><text x="145" y="29">4cm</text><text x="190" y="82">5cm</text>
    <text x="123" y="56">100°</text><title>نموذج منصة إضافي، وليس رسماً مطبوعاً في الكتاب</title>
  </svg>
}

function ConstructionActivity({
  task,
  steps,
  model,
}: {
  task: UnitOneExerciseTask
  steps: readonly string[]
  model: 'rhombus' | 'parallelogram'
}) {
  const [completed, setCompleted] = useState<ReadonlySet<number>>(new Set())
  const [finishedDrawing, setFinishedDrawing] = useState(false)
  const allDone = completed.size === steps.length && finishedDrawing
  return <div className="unit-exercise-construction" id={`student-task-${task.id}`}>
    <p className="unit-exercise-task-source"><BidiText>{task.sourceText}</BidiText></p>
    <div className="unit-exercise-tool-note"><Ruler size={18} aria-hidden="true" /><span>أدوات مناسبة: مسطرة ومنقلة؛ واستعن بمسطرة مثلثية لإنشاء المستقيمات المتوازية.</span></div>
    <fieldset className="unit-exercise-construction-steps">
      <legend>علّم الخطوات التي أنجزتها في رسمك</legend>
      {steps.map((step, index) => <label key={step}><input type="checkbox" checked={completed.has(index)} onChange={(event) => {
        setCompleted((previous) => {
          const next = new Set(previous)
          if (event.target.checked) next.add(index)
          else next.delete(index)
          return next
        })
      }} /><span><b>{index + 1}.</b> {step}</span></label>)}
    </fieldset>
    <label className="unit-exercise-done-check"><input type="checkbox" checked={finishedDrawing} onChange={(event) => setFinishedDrawing(event.target.checked)} /> أكملت الرسم في دفتري وكتبت أسماء الرؤوس بالترتيب.</label>
    {allDone && <p className="unit-exercise-feedback is-correct" role="status">اكتملت خطوات الإنشاء. قِس الأضلاع والزاوية مرة أخرى للتحقق من المعطيات.</p>}
    <details className="unit-exercise-model-details">
      <summary>مخطط توضيحي من المنصة بعد المحاولة (ليس رسماً مطبوعاً في الكتاب)</summary>
      <ConstructionModel type={model} />
      <p>هذا مخطط علاقات تقريبي للمراجعة، وليس مقياساً للأطوال. اعتمد المسطرة والمنقلة في رسمك الفعلي.</p>
    </details>
  </div>
}

function TemperatureGraph() {
  const data = temperatureGraphData
  const width = 460, height = 300
  const left = 53, top = 24, bottom = 49, right = 25
  const plotWidth = width - left - right, plotHeight = height - top - bottom
  const x = (value: number) => left + ((value - data.xMinimum) / (data.xMaximum - data.xMinimum)) * plotWidth
  const y = (value: number) => top + ((data.yMaximum - value) / (data.yMaximum - data.yMinimum)) * plotHeight
  return <figure className="unit-exercise-figure">
    <div className="unit-exercise-graph-scroll" dir="ltr">
      <svg className="unit-exercise-line-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="مخطط درجة الحرارة مقابل الارتفاع عن سطح البحر؛ يمر الخط بالنقاط 300 و40، و400 و30، و800 و10" direction="ltr" style={{ unicodeBidi: 'isolate' }}>
        <defs><marker id="temp-axis-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#222" /></marker></defs>
        {Array.from({ length: 6 }, (_, index) => {
          const value = index * 10
          return <g key={`ty-${value}`}><line x1={left} x2={left + plotWidth} y1={y(value)} y2={y(value)} stroke="#aaa19a" strokeDasharray="5 5" /><text x={left - 10} y={y(value) + 4} textAnchor="end" className="unit-exercise-svg-number" direction="ltr">{value || ''}</text></g>
        })}
        {data.xTicks.map((value) => <g key={`tx-${value}`}><line x1={x(value)} x2={x(value)} y1={top} y2={height - bottom} stroke="#aaa19a" strokeDasharray="5 5" /><text x={x(value)} y={height - bottom + 18} textAnchor="middle" className="unit-exercise-svg-number" direction="ltr">{value}</text></g>)}
        <line x1={left} y1={height - bottom} x2={width - 10} y2={height - bottom} stroke="#222" strokeWidth="2" markerEnd="url(#temp-axis-arrow)" />
        <line x1={left} y1={height - bottom} x2={left} y2={top - 9} stroke="#222" strokeWidth="2" markerEnd="url(#temp-axis-arrow)" />
        <polyline points={data.points.map((point) => `${x(point.x)},${y(point.y)}`).join(' ')} fill="none" stroke="#42477d" strokeWidth="2.5" />
        <text x={width - 8} y={height - 7} textAnchor="end" className="unit-exercise-svg-axis-label" direction="rtl">الارتفاع عن سطح البحر</text>
        <text x={left - 2} y={top - 9} className="unit-exercise-svg-axis-label" direction="rtl">درجة الحرارة</text>
        <title>الرسم معاد بناؤه من الصفحة 42. لا تذكر الصفحة وحدة قياس الارتفاع.</title>
      </svg>
    </div>
    <figcaption>إعادة رسم مخطط الكتاب — صفحة المصدر لا تطبع وحدةً للارتفاع.</figcaption>
  </figure>
}

function TemperatureTableTask({ task }: { task: UnitOneExerciseTask }) {
  const expectedByHeight = { '300': '40', '400': '30', '800': '10' }
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const correct = Object.entries(expectedByHeight).every(([height, answer]) => answersMatch(values[height] ?? '', answer))
  return <div className="unit-exercise-temperature-table" id={`student-task-${task.id}`}>
    <p className="unit-exercise-task-source"><BranchTag branch={task.branch} /><BidiText>{task.sourceText}</BidiText></p>
    <div className="unit-exercise-table-wrap">
      <table className="unit-exercise-table" dir="rtl">
        <tbody>
          <tr><th scope="row">الارتفاع عن سطح البحر</th>{['300', '400', '800'].map((height) => <th scope="col" key={height}><MathExpression>{height}</MathExpression></th>)}</tr>
          <tr><th scope="row">درجة الحرارة</th>{['300', '400', '800'].map((height) => <td key={height}><label className="unit-exercise-cell-input"><span className="unit-exercise-sr-only">درجة الحرارة عند الارتفاع {height}</span><input type="text" inputMode="numeric" dir="ltr" value={values[height] ?? ''} onChange={(event) => { setValues((previous) => ({ ...previous, [height]: event.target.value })); setChecked(false) }} /></label></td>)}</tr>
        </tbody>
      </table>
    </div>
    <button type="button" className="unit-exercise-check-button" onClick={() => setChecked(true)}>تحقّق من الجدول</button>
    {checked && <p className={`unit-exercise-feedback ${correct ? 'is-correct' : 'is-retry'}`} role="status">{correct ? 'قيم الجدول صحيحة.' : 'تتبّع كل ارتفاع إلى النقطة الموافقة على الخط، ثم اقرأ درجة الحرارة.'}</p>}
  </div>
}

function TemperatureActivity({ question }: { question: UnitOneBookExercise }) {
  const tableTask = question.tasks.find((task) => task.branch === 'أ')!
  const trendTask = question.tasks.find((task) => task.branch === 'ب')!
  const heightTask = question.tasks.find((task) => task.branch === 'ج')!
  return <div className="unit-exercise-temperature">
    <TemperatureGraph />
    <TemperatureTableTask task={tableTask} />
    <ChoiceAnswer task={trendTask} choices={['تزداد', 'تتناقص']} />
    <div className="unit-exercise-task-row" id={`student-task-${heightTask.id}`}><p className="unit-exercise-task-source"><BranchTag branch={heightTask.branch} /><BidiText>{heightTask.sourceText}</BidiText></p><StudentAnswerForm task={heightTask} label="الارتفاع على التدريج" placeholder="اكتب القيمة فقط؛ الوحدة غير مذكورة" suffix="على التدريج" expectedAnswer="500" /></div>
  </div>
}

function LibraryGraph() {
  const width = 470, height = 310
  const left = 52, top = 23, bottom = 70, right = 23
  const plotWidth = width - left - right, plotHeight = height - top - bottom
  const x = (index: number) => left + (index / (libraryVisitorData.length - 1)) * plotWidth
  const y = (value: number) => top + ((25 - value) / 25) * plotHeight
  return <figure className="unit-exercise-figure">
    <div className="unit-exercise-graph-scroll" dir="ltr">
      <svg className="unit-exercise-line-graph unit-exercise-library-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="مخطط عدد زوار المكتبة بالآلاف بين 2011 و2016: 10، 5، 15، 20، 15، 20" direction="ltr" style={{ unicodeBidi: 'isolate' }}>
        <defs><marker id="library-axis-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#222" /></marker></defs>
        {[5, 10, 15, 20, 25].map((value) => <g key={`ly-${value}`}><line x1={left} x2={left + plotWidth} y1={y(value)} y2={y(value)} stroke="#aaa19a" strokeDasharray="5 5" /><text x={left - 10} y={y(value) + 4} textAnchor="end" className="unit-exercise-svg-number" direction="ltr">{value}</text></g>)}
        {libraryVisitorData.map((point, index) => <g key={`lx-${point.year}`}><line x1={x(index)} x2={x(index)} y1={top} y2={height - bottom} stroke="#aaa19a" strokeDasharray="5 5" /><text transform={`translate(${x(index) - 2} ${height - bottom + 25}) rotate(-55)`} textAnchor="end" className="unit-exercise-svg-number" direction="ltr">{point.year}</text></g>)}
        <line x1={left} y1={height - bottom} x2={width - 8} y2={height - bottom} stroke="#222" strokeWidth="2" markerEnd="url(#library-axis-arrow)" />
        <line x1={left} y1={height - bottom} x2={left} y2={top - 9} stroke="#222" strokeWidth="2" markerEnd="url(#library-axis-arrow)" />
        <polyline points={libraryVisitorData.map((point, index) => `${x(index)},${y(point.visitorsThousands)}`).join(' ')} fill="none" stroke="#42477d" strokeWidth="2.5" />
        <text x={width - 8} y={height - 8} textAnchor="end" className="unit-exercise-svg-axis-label" direction="rtl">العام</text>
        <text x={left - 2} y={top - 8} className="unit-exercise-svg-axis-label" direction="rtl">عدد الزوار بالآلاف</text>
        <title>إعادة رسم مخطط زوار المكتبة للسنوات 2011–2016 من الصفحة 43</title>
      </svg>
    </div>
    <figcaption>إعادة رسم مخطط الكتاب؛ القيم على المحور الرأسي بالآلاف.</figcaption>
  </figure>
}

function LibraryTableTask({ task }: { task: UnitOneExerciseTask }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const expected = { year2014: '2014', year2015: '2015', year2016: '2016', visitors2011: '10', visitors2012: '5', visitors2013: '15' }
  const correct = Object.entries(expected).every(([key, answer]) => answersMatch(values[key] ?? '', answer))
  const cell = (key: string, label: string) => <label className="unit-exercise-cell-input"><span className="unit-exercise-sr-only">{label}</span><input type="text" inputMode="numeric" dir="ltr" value={values[key] ?? ''} onChange={(event) => { setValues((previous) => ({ ...previous, [key]: event.target.value })); setChecked(false) }} /></label>
  return <div className="unit-exercise-library-table" id={`student-task-${task.id}`}>
    <p className="unit-exercise-task-source"><BidiText>{task.sourceText}</BidiText></p>
    <div className="unit-exercise-table-wrap">
      <table className="unit-exercise-table unit-exercise-library-data-table" dir="rtl">
        <tbody>
          <tr><th scope="row">العام</th><td><MathExpression>2011</MathExpression></td><td><MathExpression>2012</MathExpression></td><td><MathExpression>2013</MathExpression></td><td>{cell('year2014', 'السنة في الخانة الفارغة الأولى')}</td><td>{cell('year2015', 'السنة في الخانة الفارغة الثانية')}</td><td>{cell('year2016', 'السنة في الخانة الفارغة الثالثة')}</td></tr>
          <tr><th scope="row">عدد الزوار بالآلاف</th><td>{cell('visitors2011', 'عدد الزوار بالآلاف في عام 2011')}</td><td>{cell('visitors2012', 'عدد الزوار بالآلاف في عام 2012')}</td><td>{cell('visitors2013', 'عدد الزوار بالآلاف في عام 2013')}</td><td><MathExpression>20</MathExpression></td><td><MathExpression>15</MathExpression></td><td><MathExpression>20</MathExpression></td></tr>
        </tbody>
      </table>
    </div>
    <button type="button" className="unit-exercise-check-button" onClick={() => setChecked(true)}>تحقّق من الجدول</button>
    {checked && <p className={`unit-exercise-feedback ${correct ? 'is-correct' : 'is-retry'}`} role="status">{correct ? 'أكملت السنوات والقيم في مواضعها الصحيحة.' : 'طابق كل سنة مع نقطة الخط المقابلة، وراجع أن العدد معبّر عنه بالآلاف.'}</p>}
  </div>
}

function QuestionActivity({ question }: { question: UnitOneBookExercise }) {
  switch (question.number) {
    case 1: return <MatchingActivity question={question} />
    case 2: return <PointPlotActivity task={question.tasks[0]} />
    case 3: return <NumericExercise question={question} />
    case 4: return <ColumnAdditionActivity question={question} />
    case 5: return <SegmentLengthsActivity question={question} />
    case 6: return <EconomyActivity question={question} />
    case 7: return <AngleActivity question={question} />
    case 8: return <TrueFalseActivity question={question} />
    case 9: return <ConstructionActivity task={question.tasks[0]} model="rhombus" steps={[
      'ارسم BA بطول 4cm، واجعل B أحد طرفي القطعة.',
      'أنشئ عند B زاوية مقدارها 60° وارسم الشعاع BC.',
      'قِس 4cm على الشعاع BC لتحديد النقطة C.',
      'من A ارسم موازياً لـBC، ومن C ارسم موازياً لـAB؛ سمِّ نقطة التقاطع D.',
      'اكتب الرؤوس بالترتيب A–B–C–D، ثم قِس الأضلاع والزاوية للتحقق.',
    ]} />
    case 10: return <ConstructionActivity task={question.tasks[0]} model="parallelogram" steps={[
      'ارسم WX بطول 5cm.',
      'أنشئ عند W زاوية مقدارها 100° يكون أحد ضلعيها WX.',
      'على الشعاع الثاني عيّن Z بحيث WZ = 4cm.',
      'من X ارسم موازياً لـWZ، ومن Z ارسم موازياً لـWX؛ سمِّ نقطة التقاطع Y.',
      'رتّب الرؤوس X–Y–Z–W وتحقق من الأطوال والزاوية.',
    ]} />
    case 11: return <TemperatureActivity question={question} />
    case 12: return <><LibraryGraph /><LibraryTableTask task={question.tasks[0]} /></>
    default: return null
  }
}

function ExerciseCard({ question }: { question: UnitOneBookExercise }) {
  return <article id={`unit-exercise-${question.number}`} tabIndex={-1} className="unit-exercise-card" aria-labelledby={`unit-exercise-title-${question.number}`}>
    <header className="unit-exercise-card-heading">
      <div className="unit-exercise-source-meta"><span>تمرين الكتاب {question.number}</span><span>{PAGE_LABELS[question.page - 40]}</span></div>
      <h2 id={`unit-exercise-title-${question.number}`}>السؤال {question.number}</h2>
      <p className="unit-exercise-original-prompt"><BidiText>{question.originalPrompt}</BidiText></p>
      {question.sourceContext && <p className="unit-exercise-context"><BidiText>{question.sourceContext}</BidiText></p>}
    </header>
    <div className="unit-exercise-platform-explanation"><strong>شرح المنصة:</strong> <BidiText>{question.platformExplanation}</BidiText></div>
    <div className="unit-exercise-activity"><QuestionActivity question={question} /></div>
    <footer className="unit-exercise-card-footer"><BookOpenCheck size={16} aria-hidden="true" /> مرجع المصدر: الكتاب المدرسي، صفحة {question.page}، السؤال {question.number}.</footer>
  </article>
}

export function UnitOneExercisesPage() {
  return <section className="unit-exercises-page" aria-labelledby="unit-exercises-title">
    <header className="unit-exercises-hero">
      <div className="unit-exercises-eyebrow"><BookOpenCheck size={17} aria-hidden="true" /> مراجعة شاملة من الكتاب المدرسي</div>
      <h1 id="unit-exercises-title">تمارين الوحدة الأولى</h1>
      <p>حلّ التمارين المطبوعة في صفحات 40–43 لمراجعة موضوعات الوحدة الأولى كلها، واستخدم التحقق الذاتي بهدوء بعد كل إجابة.</p>
      <div className="unit-exercises-boundary-note">
        <strong>قسم مستقل للمراجعة</strong>
        <span>هذه تمارين الكتاب وليست درساً تاسعاً، ولا تحلّ محل اختبار الوحدة الأولى في منطقة الاختبارات.</span>
      </div>
      <div className="unit-exercises-page-actions">
        <a href="#tests/units">اختبار الوحدة الأولى المستقل <ArrowLeft size={16} aria-hidden="true" /></a>
        <a href="#top">العودة إلى الوحدة <ArrowLeft size={16} aria-hidden="true" /></a>
      </div>
    </header>
    <nav className="unit-exercise-index" aria-label="فهرس تمارين الكتاب">
      <h2>انتقل إلى السؤال</h2>
      <ol>{unitOneBookExercises.map((question) => <li key={question.id}><a href={`#unit-exercise-${question.number}`}><span>{question.number}</span><small>ص {question.page}</small></a></li>)}</ol>
    </nav>
    <div className="unit-exercise-content">
      {unitOneBookExercises.map((question) => <ExerciseCard key={question.id} question={question} />)}
    </div>
    <footer className="unit-exercises-footer-note">أُعيد بناء الرسوم والجداول المرتبطة بالأسئلة من الصفحات الأصلية؛ الرسوم التوضيحية الإضافية موسومة بأنها من المنصة.</footer>
  </section>
}
