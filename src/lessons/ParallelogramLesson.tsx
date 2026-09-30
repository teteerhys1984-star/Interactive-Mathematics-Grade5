import { useMemo, useState, type ReactNode } from 'react'
import {
  BookOpenCheck, Check, CircleAlert, Eye, EyeOff, Lightbulb, MoveRight, PencilRuler,
  RotateCcw, Scissors, Shapes, Sparkles, Target,
} from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { BidiText } from '../components/BidiText'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import { GeoFigure, FigureFrame, type Pt } from '../components/lesson/GeoFigure'
import type { LessonStep } from '../components/lesson/types'
import { finalAssessment7, lessonSevenBookElements } from './parallelogramData'

/* ------------------------------------------------------------------ ledger */

const byId = Object.fromEntries(lessonSevenBookElements.map(element => [element.id, element]))

/**
 * Renders one textbook element in the Student Area: the exact question, its figure, and a
 * progressive step-by-step explanation. Nothing from the book is "referenced only".
 */
function BookTask({ id, children, tone = 'default' }: { id: string; children?: ReactNode; tone?: 'default' | 'teach' }) {
  const element = byId[id]
  const [open, setOpen] = useState(false)
  if (!element) return null
  return (
    <article className={`l7-task ${tone === 'teach' ? 'is-teach' : ''}`} data-source-id={id}>
      <div className="l7-task-head">
        <span className="l7-task-tag">{element.section} · ص {element.page}</span>
        <h4>{element.title}</h4>
      </div>
      <p className="l7-task-prompt"><BidiText>{element.prompt}</BidiText></p>
      {children}
      <button type="button" className="l7-reveal" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? <EyeOff size={15} /> : <Eye size={15} />}
        {open ? 'إخفاء الشرح' : 'اكشف الحل خطوة بخطوة'}
      </button>
      {open && (
        <div className="l7-solution">
          <p className="l7-answer"><strong>الإجابة:</strong> <BidiText>{element.answer}</BidiText></p>
          <ol className="l7-steps">
            {element.reasoning.map((line, index) => <li key={index}><BidiText>{line}</BidiText></li>)}
          </ol>
          {element.pitfall && (
            <p className="l7-pitfall"><CircleAlert size={15} /> <span><strong>انتبه:</strong> <BidiText>{element.pitfall}</BidiText></span></p>
          )}
        </div>
      )}
    </article>
  )
}

/** A hidden, machine-checkable index proving every ledger row reached the Student Area. */
function BookCoverageMarkers() {
  return (
    <div className="l7-coverage-markers" aria-label="فهرس عناصر صفحات الدرس 31–35">
      {lessonSevenBookElements.map(element => (
        <span key={element.id} data-source-id={element.id}>{element.title} — ص {element.page}</span>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- figures  */

const P = (x: number, y: number): Pt => ({ x, y })

/** صفحة 31 — الشكل (1): ABCD متوازي أضلاع. */
const Fig31One = () => (
  <GeoFigure
    ariaLabel="الشكل 1: متوازي الأضلاع ABCD، الضلعان AB و DC متوازيان والضلعان AD و BC متوازيان"
    width={280} height={205}
    pts={{ A: P(95, 60), B: P(225, 60), C: P(185, 155), D: P(55, 155) }}
    order={['A', 'B', 'C', 'D']}
    marks={[
      { side: ['B', 'A'], count: 1 }, { side: ['C', 'D'], count: 1 },
      { side: ['D', 'A'], count: 2, tone: 'red' }, { side: ['C', 'B'], count: 2, tone: 'red' },
    ]}
  />
)

/** صفحة 31 — الشكل (2): EFGH بلا توازٍ. */
const Fig31Two = () => (
  <GeoFigure
    ariaLabel="الشكل 2: الشكل الرباعي EFGH وليس فيه ضلعان متوازيان"
    width={280} height={205}
    pts={{ E: P(80, 35), F: P(220, 95), G: P(200, 165), H: P(60, 165) }}
    order={['E', 'F', 'G', 'H']}
  />
)

/** صفحة 31 — الشكل (3): شبه المنحرف MNKI. */
const Fig31Three = () => (
  <GeoFigure
    ariaLabel="الشكل 3: الشكل الرباعي MNKI وفيه NK يوازي MI فقط"
    width={280} height={205}
    pts={{ N: P(85, 65), K: P(195, 65), I: P(220, 155), M: P(45, 155) }}
    order={['N', 'K', 'I', 'M']}
    marks={[{ side: ['K', 'N'], count: 1 }, { side: ['I', 'M'], count: 1 }]}
  />
)

/** صفحة 31 — الشكل (4): المستطيل QROP. */
const Fig31Four = () => (
  <GeoFigure
    ariaLabel="الشكل 4: المستطيل QROP وفيه RO يوازي QP و RQ يوازي OP وزاوية قائمة عند O"
    width={280} height={205}
    pts={{ R: P(65, 60), O: P(225, 60), P: P(225, 155), Q: P(65, 155) }}
    order={['R', 'O', 'P', 'Q']}
    marks={[
      { side: ['O', 'R'], count: 1 }, { side: ['P', 'Q'], count: 1 },
      { side: ['Q', 'R'], count: 2, tone: 'red' }, { side: ['P', 'O'], count: 2, tone: 'red' },
    ]}
    right={[{ at: 'O', from: 'R', to: 'P' }]}
  />
)

/** صفحة 31 — الشكل (5): المعيّن SVUT. */
const Fig31Five = () => (
  <GeoFigure
    ariaLabel="الشكل 5: المعيّن SVUT وفيه VS يوازي UT و ST يوازي VU"
    width={280} height={205}
    pts={{ S: P(140, 35), T: P(220, 105), U: P(140, 175), V: P(60, 105) }}
    order={['S', 'T', 'U', 'V']}
    marks={[
      { side: ['V', 'S'], count: 2, tone: 'red' }, { side: ['U', 'T'], count: 2, tone: 'red' },
      { side: ['S', 'T'], count: 1 }, { side: ['V', 'U'], count: 1 },
    ]}
  />
)

/** صفحة 32 — متوازي الأضلاع ABCD (مع أو بدون القطرين). */
const Fig32Main = ({ diagonals = false }: { diagonals?: boolean }) => (
  <GeoFigure
    ariaLabel={diagonals ? 'متوازي الأضلاع ABCD مرسوم فيه القطران AC و BD' : 'متوازي الأضلاع ABCD'}
    width={290} height={200}
    pts={{ A: P(85, 50), B: P(230, 50), C: P(195, 150), D: P(50, 150) }}
    order={['A', 'B', 'C', 'D']}
    marks={[
      { side: ['B', 'A'], count: 1 }, { side: ['C', 'D'], count: 1 },
      { side: ['D', 'A'], count: 2, tone: 'red' }, { side: ['C', 'B'], count: 2, tone: 'red' },
    ]}
    diagonals={diagonals ? [['A', 'C'], ['B', 'D']] : []}
  />
)

/** صفحة 32 — تحقق ① الشكل (1). */
const Fig32Check1A = () => (
  <GeoFigure
    ariaLabel="الشكل 1: الرباعي BADC وفيه BA يوازي CD و BC يوازي AD"
    width={300} height={190}
    pts={{ B: P(70, 50), A: P(220, 50), D: P(250, 145), C: P(100, 145) }}
    order={['B', 'A', 'D', 'C']}
    marks={[
      { side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 },
      { side: ['C', 'B'], count: 2, tone: 'red' }, { side: ['D', 'A'], count: 2, tone: 'red' },
    ]}
  />
)

/** صفحة 32 — تحقق ① الشكل (2). */
const Fig32Check1B = () => (
  <GeoFigure
    ariaLabel="الشكل 2: المستطيل HEFG وفيه HE يوازي GF و HG يوازي EF"
    width={300} height={190}
    pts={{ H: P(70, 45), E: P(225, 45), F: P(225, 145), G: P(70, 145) }}
    order={['H', 'E', 'F', 'G']}
    marks={[
      { side: ['E', 'H'], count: 1 }, { side: ['F', 'G'], count: 1 },
      { side: ['G', 'H'], count: 2, tone: 'red' }, { side: ['F', 'E'], count: 2, tone: 'red' },
    ]}
  />
)

/** صفحة 32 — تحقق ② الشكل (1): مثلث. */
const Fig32Check2A = () => (
  <GeoFigure
    ariaLabel="الشكل 1: المثلث ABC"
    width={280} height={190}
    pts={{ A: P(160, 40), B: P(225, 150), C: P(60, 150) }}
    order={['A', 'B', 'C']}
  />
)

/** صفحة 32 — تحقق ② الشكل (2): شبه منحرف FEGH. */
const Fig32Check2B = () => (
  <GeoFigure
    ariaLabel="الشكل 2: شبه المنحرف FEHG وفيه FE يوازي GH فقط"
    width={280} height={190}
    pts={{ F: P(75, 50), E: P(185, 50), H: P(220, 150), G: P(40, 150) }}
    order={['F', 'E', 'H', 'G']}
    marks={[{ side: ['E', 'F'], count: 1 }, { side: ['H', 'G'], count: 1 }]}
  />
)

/** صفحة 32 — تحقق ② الشكل (3): رباعي MNKI بلا توازٍ. */
const Fig32Check2C = () => (
  <GeoFigure
    ariaLabel="الشكل 3: الرباعي NKIM وليس فيه ضلعان متوازيان"
    width={280} height={190}
    pts={{ N: P(110, 45), K: P(215, 80), I: P(190, 155), M: P(50, 150) }}
    order={['N', 'K', 'I', 'M']}
  />
)

/** صفحة 33 — بطاقة النموذج الملوّنة مع خط القص. */
const ModelCard = ({ stage }: { stage: 0 | 1 | 2 }) => {
  const pts = { A: P(95, 45), B: P(240, 45), C: P(200, 145), D: P(55, 145) }
  return (
    <GeoFigure
      ariaLabel="بطاقة على شكل متوازي أضلاع، الضلعان المتقابلان بالأحمر والضلعان الآخران بالأزرق وخط القص هو القطر AC"
      width={300} height={195}
      pts={pts}
      order={['A', 'B', 'C', 'D']}
      colored={stage >= 0 ? [
        { side: ['A', 'B'], tone: 'red' }, { side: ['D', 'C'], tone: 'red' },
        { side: ['A', 'D'], tone: 'blue' }, { side: ['B', 'C'], tone: 'blue' },
      ] : []}
    >
      {stage >= 1 && <line x1={pts.A.x} y1={pts.A.y} x2={pts.C.x} y2={pts.C.y} className="l7-cut-line" />}
      {stage >= 2 && (
        <>
          <path d={`M ${pts.A.x} ${pts.A.y} L ${pts.B.x} ${pts.B.y} L ${pts.C.x} ${pts.C.y} Z`} className="l7-triangle-a" />
          <path d={`M ${pts.A.x} ${pts.A.y} L ${pts.C.x} ${pts.C.y} L ${pts.D.x} ${pts.D.y} Z`} className="l7-triangle-b" />
        </>
      )}
    </GeoFigure>
  )
}

/** صفحة 33 — «لنعمل معاً»: الزاوية A تساوي 60°. */
const Fig33Together = () => (
  <GeoFigure
    ariaLabel="متوازي الأضلاع DABC وقياس الزاوية A هو 60 درجة"
    width={300} height={195}
    pts={{ D: P(95, 48), A: P(250, 48), B: P(194, 146), C: P(39, 146) }}
    order={['D', 'A', 'B', 'C']}
    angles={[{ at: 'A', from: 'D', to: 'B', label: '60°', tone: 'rose' }]}
  />
)

/** صفحة 33 — «تحقّق من فهمك»: ABCD بقياسات 3cm، 2cm، 70°، 110°. */
const Fig33Check = () => (
  <GeoFigure
    ariaLabel="متوازي الأضلاع ABCD، الضلع AB يساوي 3 سنتيمتر والضلع BC يساوي 2 سنتيمتر والزاوية A تساوي 70 درجة والزاوية B تساوي 110 درجة"
    width={310} height={200}
    pts={{ A: P(60, 50), B: P(215, 50), C: P(250, 150), D: P(95, 150) }}
    order={['A', 'B', 'C', 'D']}
    sides={[{ side: ['A', 'B'], label: '3cm' }, { side: ['B', 'C'], label: '2cm' }]}
    angles={[
      { at: 'A', from: 'D', to: 'B', label: '70°', tone: 'rose' },
      { at: 'B', from: 'A', to: 'C', label: '110°', tone: 'plum', radius: 30 },
    ]}
  />
)

/** منقلة مبسّطة تُظهر إنشاء زاوية 120° عند الرأس Y (خطوة الرسم 2، ص 34). */
function MiniProtractor({ degree = 120 }: { degree?: number }) {
  const cx = 160
  const cy = 150
  const r = 105
  const point = (a: number, radius = r) => ({ x: cx + radius * Math.cos((a * Math.PI) / 180), y: cy - radius * Math.sin((a * Math.PI) / 180) })
  const ray = point(degree, r * 1.02)
  const ticks = Array.from({ length: 19 }, (_, i) => i * 10)
  return (
    <svg className="l7-protractor" viewBox="0 0 320 185" role="img" aria-label={`منقلة موضوعة على الرأس Y لإنشاء زاوية ${degree} درجة`} direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} className="l7-protractor-shell" />
      {ticks.map(value => {
        const a = point(value)
        const b = point(value, value % 30 === 0 ? r - 15 : r - 8)
        return <line key={value} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={value % 30 === 0 ? 'l7-tick-major' : 'l7-tick'} />
      })}
      {[0, 30, 60, 90, 120, 150, 180].map(value => {
        const label = point(value, r - 30)
        return <text key={`n-${value}`} x={label.x} y={label.y + 4} textAnchor="middle" className="l7-protractor-number">{value}</text>
      })}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} className="l7-protractor-base" />
      <line x1={cx} y1={cy} x2={ray.x} y2={ray.y} className="l7-protractor-ray" />
      <circle cx={cx} cy={cy} r="5" className="l7-geo-vertex" />
      <text x={cx - 6} y={cy + 20} className="l7-geo-point">Y</text>
      <text x={cx + r + 6} y={cy + 18} className="l7-geo-point">X</text>
      <text x={ray.x - 14} y={ray.y - 6} className="l7-geo-angle-label is-rose">{degree}°</text>
    </svg>
  )
}

/** صفحة 34 — الأشكال المرافقة للخطوات الخمس. */
const constructionPts = { X: P(265, 152), Y: P(110, 152), Z: P(52, 51), W: P(207, 51) }

function ConstructionFigure({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  if (step === 2) return <MiniProtractor />
  if (step === 1) {
    return (
      <GeoFigure
        ariaLabel="القطعة المستقيمة YX طولها 4 سنتيمتر"
        width={300} height={120}
        pts={{ Y: P(70, 70), X: P(225, 70) }}
        order={['Y', 'X']}
        open
        sides={[{ side: ['Y', 'X'], label: '4cm' }]}
      />
    )
  }
  const order = step === 3 ? ['X', 'Y', 'Z'] : step === 4 ? ['X', 'Y', 'Z', 'W'] : ['X', 'Y', 'Z', 'W']
  return (
    <GeoFigure
      ariaLabel={step === 3 ? 'تعيين النقطة Z على بعد 3 سنتيمتر من Y بزاوية 120 درجة' : step === 4 ? 'رسم نصف مستقيم من Z يوازي YX وتعيين النقطة W' : 'متوازي الأضلاع XYZW مكتملاً'}
      width={300} height={190}
      pts={constructionPts}
      order={order}
      open={step !== 5}
      sides={
        step === 3
          ? [{ side: ['Y', 'X'], label: '4cm' }, { side: ['Y', 'Z'], label: '3cm' }]
          : step === 4
            ? [{ side: ['Y', 'X'], label: '4cm' }, { side: ['Y', 'Z'], label: '3cm' }, { side: ['Z', 'W'], label: '4cm' }]
            : [{ side: ['Y', 'X'], label: '4cm' }, { side: ['Y', 'Z'], label: '3cm' }, { side: ['Z', 'W'], label: '4cm' }, { side: ['X', 'W'], label: '3cm' }]
      }
      angles={[{ at: 'Y', from: 'X', to: 'Z', label: '120°', tone: 'rose' }]}
      marks={step === 5 ? [{ side: ['X', 'Y'], count: 1 }, { side: ['W', 'Z'], count: 1 }] : []}
    />
  )
}

/** صفحة 35 — تدرّب ①: متوازي الأضلاع WXYZ. */
const Fig35Ex1 = () => (
  <GeoFigure
    ariaLabel="متوازي الأضلاع WXYZ، الضلع WZ يساوي 5 سنتيمتر والضلع ZY يساوي 2 سنتيمتر والزاوية W تساوي 110 درجة والزاوية Z تساوي 70 درجة"
    width={320} height={195}
    pts={{ W: P(75, 45), Z: P(263, 74), Y: P(226, 141), X: P(38, 112) }}
    order={['W', 'Z', 'Y', 'X']}
    sides={[{ side: ['W', 'Z'], label: '5cm' }, { side: ['Z', 'Y'], label: '2cm' }]}
    angles={[
      { at: 'W', from: 'X', to: 'Z', label: '110°', tone: 'plum', radius: 30 },
      { at: 'Z', from: 'W', to: 'Y', label: '70°', tone: 'rose', radius: 20 },
    ]}
  />
)

/** صفحة 35 — تدرّب ⑤: متوازيا الأضلاع ABCD و DCFE. */
const Fig35Ex5 = () => {
  const p = { A: P(90, 38), B: P(250, 38), C: P(201, 96), D: P(41, 96), E: P(90, 154), F: P(250, 154) }
  const line = (a: Pt, b: Pt, cls = 'l7-geo-edge') => <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={cls} />
  const label = (name: string, at: Pt, dx: number, dy: number) => <text x={at.x + dx} y={at.y + dy} className="l7-geo-point" textAnchor="middle">{name}</text>
  return (
    <svg className="l7-geo" viewBox="0 0 300 200" role="img" aria-label="الشكل يحوي متوازي الأضلاع ABCD في الأعلى ومتوازي الأضلاع DCFE في الأسفل، وطول EF يساوي 8 والزاوية A تساوي 130 درجة والزاوية F تساوي 50 درجة" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      {line(p.A, p.B)}{line(p.B, p.C)}{line(p.C, p.D, 'l7-geo-edge is-shared')}{line(p.D, p.A)}
      {line(p.C, p.F, 'l7-geo-edge is-green')}{line(p.F, p.E, 'l7-geo-edge is-green')}{line(p.E, p.D, 'l7-geo-edge is-green')}
      <path d={`M ${p.A.x + 24} ${p.A.y + 8} A 26 26 0 0 1 ${p.A.x - 13} ${p.A.y + 20}`} className="l7-geo-arc is-rose" />
      <text x={p.A.x + 30} y={p.A.y + 34} className="l7-geo-angle-label is-rose">130°</text>
      <path d={`M ${p.F.x - 26} ${p.F.y} A 26 26 0 0 0 ${p.F.x - 17} ${p.F.y - 20}`} className="l7-geo-arc is-rose" />
      <text x={p.F.x - 38} y={p.F.y - 14} className="l7-geo-angle-label is-rose">50°</text>
      <text x={(p.E.x + p.F.x) / 2} y={p.F.y + 18} textAnchor="middle" className="l7-geo-side-label">8</text>
      {[['A', p.A, -6, -10], ['B', p.B, 10, -8], ['C', p.C, 12, 6], ['D', p.D, -12, 6], ['E', p.E, -12, 12], ['F', p.F, 12, 12]].map(
        ([name, at, dx, dy]) => <g key={name as string}>{label(name as string, at as Pt, dx as number, dy as number)}</g>,
      )}
      {[p.A, p.B, p.C, p.D, p.E, p.F].map((pt, i) => <circle key={i} cx={pt.x} cy={pt.y} r="3.4" className="l7-geo-vertex" />)}
    </svg>
  )
}

/* ------------------------------------------------------------- activities  */

/** نشاط ① — تصنيف الأشكال الخمسة في صفحة 31. */
function ShapeSorter() {
  const shapes = useMemo(() => ([
    { key: '1', node: <Fig31One />, isPara: true, why: 'مجموعتان متوازيتان: AB ∥ DC و AD ∥ BC.' },
    { key: '2', node: <Fig31Two />, isPara: false, why: 'لا يوجد فيه أي ضلعين متوازيين.' },
    { key: '3', node: <Fig31Three />, isPara: false, why: 'فيه مجموعة واحدة فقط: NK ∥ MI.' },
    { key: '4', node: <Fig31Four />, isPara: true, why: 'مستطيل، وفيه RO ∥ QP و RQ ∥ OP.' },
    { key: '5', node: <Fig31Five />, isPara: true, why: 'معيّن، وفيه VS ∥ UT و ST ∥ VU.' },
  ]), [])
  const [choice, setChoice] = useState<Record<string, boolean>>({})
  const done = Object.keys(choice).length
  const correct = shapes.filter(shape => choice[shape.key] === shape.isPara).length
  return (
    <div className="l7-panel">
      <div className="l7-panel-head">
        <span className="section-kicker">نشاط المنصة · فرز الأشكال</span>
        <h3>أيّ الأشكال متوازي أضلاع؟</h3>
        <p>انظر إلى الأسهم أولاً: كل سهم متطابق يعني ضلعين متوازيين. لا تحكم من «شكل» الرسم فقط.</p>
      </div>
      <div className="l7-shape-grid">
        {shapes.map(shape => (
          <div className="l7-shape-card" key={shape.key}>
            <span className="l7-shape-tag">الشّكل ({shape.key})</span>
            {shape.node}
            <div className="l7-choice-row">
              <button type="button" className={choice[shape.key] === true ? 'is-selected' : ''} onClick={() => setChoice({ ...choice, [shape.key]: true })}>متوازي أضلاع</button>
              <button type="button" className={choice[shape.key] === false ? 'is-selected' : ''} onClick={() => setChoice({ ...choice, [shape.key]: false })}>ليس متوازي أضلاع</button>
            </div>
            {shape.key in choice && (
              <p className={choice[shape.key] === shape.isPara ? 'l7-feedback is-good' : 'l7-feedback'}>
                {choice[shape.key] === shape.isPara ? '✔ ' : '✘ راجع الأسهم: '}<BidiText>{shape.why}</BidiText>
              </p>
            )}
          </div>
        ))}
      </div>
      {done === shapes.length && (
        <p className="l7-score-line">أجبت بشكل صحيح عن <MathExpression>{correct} / {shapes.length}</MathExpression> من الأشكال.</p>
      )}
    </div>
  )
}

/** نشاط ② — مختبر متوازي الأضلاع: تغيير الأضلاع والزاوية ورؤية الخاصتين حيّتين. */
function ParallelogramLab() {
  const [base, setBase] = useState(5)
  const [side, setSide] = useState(3)
  const [angle, setAngle] = useState(60)
  const s = 30
  const D = P(75, 195)
  const C = P(75 + base * s, 195)
  const rad = (angle * Math.PI) / 180
  const A = P(D.x + Math.cos(rad) * side * s, D.y - Math.sin(rad) * side * s)
  const B = P(A.x + base * s, A.y)
  const other = 180 - angle
  return (
    <div className="l7-panel l7-lab">
      <div className="l7-panel-head">
        <span className="section-kicker">نشاط المنصة · مختبر الخواص</span>
        <h3>حرّك المنزلقات وراقب الخاصتين</h3>
        <p>غيّر الطول والزاوية كما تشاء: ستبقى الأضلاع المتقابلة متساوية والزوايا المتقابلة متساوية دائماً. هذا معنى «خاصة».</p>
      </div>
      <GeoFigure
        ariaLabel={`متوازي أضلاع تفاعلي، القاعدة ${base} سنتيمتر والضلع الجانبي ${side} سنتيمتر وزاوية القاعدة ${angle} درجة`}
        width={360} height={230}
        pts={{ A, B, C, D }}
        order={['A', 'B', 'C', 'D']}
        sides={[{ side: ['A', 'B'], label: `${base}cm` }, { side: ['B', 'C'], label: `${side}cm` }, { side: ['D', 'C'], label: `${base}cm` }, { side: ['A', 'D'], label: `${side}cm` }]}
        angles={[
          { at: 'D', from: 'C', to: 'A', label: `${angle}°`, tone: 'rose', radius: 24 },
          { at: 'B', from: 'A', to: 'C', label: `${angle}°`, tone: 'rose', radius: 24 },
          { at: 'A', from: 'D', to: 'B', label: `${other}°`, tone: 'plum', radius: 24 },
          { at: 'C', from: 'B', to: 'D', label: `${other}°`, tone: 'plum', radius: 24 },
        ]}
        marks={[
          { side: ['B', 'A'], count: 1 }, { side: ['C', 'D'], count: 1 },
          { side: ['D', 'A'], count: 2, tone: 'red' }, { side: ['C', 'B'], count: 2, tone: 'red' },
        ]}
      />
      <div className="l7-lab-controls">
        <label htmlFor="lab-base">القاعدة <MathExpression>{base}cm</MathExpression></label>
        <input id="lab-base" type="range" min="3" max="7" step="1" value={base} onChange={event => setBase(Number(event.target.value))} />
        <label htmlFor="lab-side">الضلع الجانبي <MathExpression>{side}cm</MathExpression></label>
        <input id="lab-side" type="range" min="2" max="5" step="1" value={side} onChange={event => setSide(Number(event.target.value))} />
        <label htmlFor="lab-angle">زاوية القاعدة <MathExpression>{angle}°</MathExpression></label>
        <input id="lab-angle" type="range" min="35" max="145" step="5" value={angle} onChange={event => setAngle(Number(event.target.value))} />
      </div>
      <div className="l7-lab-readout">
        <span>AB = DC = <MathExpression>{base}cm</MathExpression></span>
        <span>AD = BC = <MathExpression>{side}cm</MathExpression></span>
        <span>∠D = ∠B = <MathExpression>{angle}°</MathExpression></span>
        <span>∠A = ∠C = <MathExpression>{other}°</MathExpression></span>
        <span className="is-extra">المحيط = <MathExpression>2 × ({base} + {side}) = {2 * (base + side)}cm</MathExpression></span>
      </div>
    </div>
  )
}

/** نشاط ③ — «اصنع نموذجاً»: لوّن، قصّ، طابق. */
function ModelCardActivity() {
  const [stage, setStage] = useState<0 | 1 | 2>(0)
  const captions = [
    'الخطوة ①: لوّنّا كل ضلعين متقابلين بلون واحد — الأحمر للضلعين AB و DC، والأزرق للضلعين AD و BC.',
    'الخطوة ②: نقصّ البطاقة حسب القطر [AC]، فنحصل على مثلثين.',
    'الخطوة ③: نطابق المثلثين فينطبقان تماماً: الضلع الأحمر على الأحمر، والأزرق على الأزرق.',
  ]
  return (
    <div className="l7-panel">
      <div className="l7-panel-head">
        <span className="section-kicker">نشاط المنصة · نموذج ورقي رقمي</span>
        <h3><Scissors size={18} /> لوّن ثم قصّ ثم طابق</h3>
        <p>نفّذ خطوات «اصنع نموذجاً» هنا قبل تنفيذها بالبطاقة والمقص في الصف.</p>
      </div>
      <ModelCard stage={stage} />
      <div className="l7-choice-row is-centered">
        {(['لوّن الأضلاع', 'قصّ حسب القطر', 'طابق المثلثين'] as const).map((label, index) => (
          <button type="button" key={label} className={stage === index ? 'is-selected' : ''} onClick={() => setStage(index as 0 | 1 | 2)}>{index + 1}. {label}</button>
        ))}
      </div>
      <p className="l7-stage-caption">{captions[stage]}</p>
      {stage === 2 && (
        <p className="l7-feedback is-good">الانطباق يثبت أن <MathExpression>AB = DC</MathExpression> و<MathExpression>AD = BC</MathExpression>: هذه هي الخاصة الأولى.</p>
      )}
    </div>
  )
}

/** نشاط ④ — مشغّل خطوات الرسم في صفحة 34. */
function ConstructionPlayer() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const texts: Record<number, string> = {
    1: 'نرسم بالمسطرة القطعة المستقيمة [XY] طولها 4cm.',
    2: 'نستعمل المنقلة لإنشاء الزاوية XYZ بقياس 120°.',
    3: 'نعيّن باستعمال المسطرة النقطة Z بحيث يكون YZ = 3cm.',
    4: 'نرسم من النقطة Z نصف مستقيم يوازي YX ونعيّن عليه النقطة W بحيث يكون YX = ZW.',
    5: 'نصل بين النقطتين W و X فيكون الشكل الناتج XYZW متوازي الأضلاع.',
  }
  return (
    <div className="l7-panel">
      <div className="l7-panel-head">
        <span className="section-kicker">نشاط المنصة · ورشة الرسم</span>
        <h3><PencilRuler size={18} /> شاهد الرسم يتكوّن خطوة خطوة</h3>
        <p>اضغط على أرقام الخطوات بالترتيب، وراقب ما يُضاف إلى الرسم في كل مرة.</p>
      </div>
      <div className="l7-step-dots">
        {[1, 2, 3, 4, 5].map(value => (
          <button type="button" key={value} className={step === value ? 'is-selected' : ''} onClick={() => setStep(value as 1 | 2 | 3 | 4 | 5)} aria-label={`الخطوة ${value}`}>{value}</button>
        ))}
      </div>
      <FigureFrame zoomable caption={texts[step]}>
        <ConstructionFigure step={step} />
      </FigureFrame>
      {step === 5 && <p className="l7-feedback is-good">تحقّق أخير: <MathExpression>XY = ZW = 4cm</MathExpression> و<MathExpression>YZ = XW = 3cm</MathExpression>، والضلعان المتقابلان متوازيان.</p>}
    </div>
  )
}

/** نشاط ⑤ — تعيين الرأس الرابع D (تدرّب ③). */
function FourthVertexActivity() {
  const B = P(70, 45)
  const A = P(240, 47)
  const C = P(105, 170)
  const candidates = [
    { key: 'ok', at: P(275, 172), ok: true, why: 'ممتاز: هنا يكون [CD] موازياً ومساوياً لـ [BA]، و[AD] موازياً ومساوياً لـ [BC].' },
    { key: 'w1', at: P(35, 168), ok: false, why: 'هنا اتجاه [CD] معاكس لـ [BA]، فينتج شكل مقاطع نفسه وليس متوازي أضلاع.' },
    { key: 'w2', at: P(170, 120), ok: false, why: 'هذه نقطة «بالنظر» فقط: [CD] لا يوازي [BA] ولا يساويه في الطول.' },
    { key: 'w3', at: P(290, 55), ok: false, why: 'هذا امتداد للضلع [BA]، والنقطة تقع على استقامة واحدة مع A و B فلا يتكوّن رباعي.' },
  ]
  const [picked, setPicked] = useState<string | null>(null)
  const chosen = candidates.find(candidate => candidate.key === picked)
  return (
    <div className="l7-panel">
      <div className="l7-panel-head">
        <span className="section-kicker">نشاط المنصة · تدرّب ③ تفاعلياً</span>
        <h3><Target size={18} /> أين نضع الرأس D؟</h3>
        <p>لديك [BA] و[BC]. اختر موضع D الذي يجعل ABCD متوازي أضلاع، ثم اقرأ التعليل.</p>
      </div>
      <svg className="l7-geo" viewBox="0 0 330 215" role="img" aria-label="الضلعان BA و BC ومواضع مقترحة للرأس الرابع D" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
        <line x1={B.x} y1={B.y} x2={A.x} y2={A.y} className="l7-geo-edge" />
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} className="l7-geo-edge" />
        {chosen?.ok && (
          <>
            <line x1={C.x} y1={C.y} x2={chosen.at.x} y2={chosen.at.y} className="l7-geo-edge is-green" />
            <line x1={A.x} y1={A.y} x2={chosen.at.x} y2={chosen.at.y} className="l7-geo-edge is-green" />
          </>
        )}
        {candidates.map(candidate => (
          <g key={candidate.key} onClick={() => setPicked(candidate.key)} className="l7-hit">
            <circle cx={candidate.at.x} cy={candidate.at.y} r="11" className={`l7-candidate ${picked === candidate.key ? 'is-picked' : ''}`} />
            <text x={candidate.at.x} y={candidate.at.y + 4} textAnchor="middle" className="l7-candidate-label">?</text>
          </g>
        ))}
        {[['B', B, -14, 0], ['A', A, 12, -4], ['C', C, -14, 8]].map(([name, at, dx, dy]) => (
          <g key={name as string}>
            <circle cx={(at as Pt).x} cy={(at as Pt).y} r="3.6" className="l7-geo-vertex" />
            <text x={(at as Pt).x + (dx as number)} y={(at as Pt).y + (dy as number)} textAnchor="middle" className="l7-geo-point">{name as string}</text>
          </g>
        ))}
      </svg>
      <div className="l7-choice-row is-centered">
        {candidates.map((candidate, index) => (
          <button type="button" key={candidate.key} className={picked === candidate.key ? 'is-selected' : ''} onClick={() => setPicked(candidate.key)}>الموضع {index + 1}</button>
        ))}
      </div>
      {chosen && <p className={chosen.ok ? 'l7-feedback is-good' : 'l7-feedback'}><BidiText>{chosen.why}</BidiText></p>}
    </div>
  )
}

/** نشاط ⑥ — ملء فراغات تدرّب ① مع تصحيح فوري. */
function FillBlanksActivity() {
  const blanks = [
    { id: 'a', label: 'أ) WZ ∥ ......', answer: 'XY', hint: 'الضلع المقابل لـ WZ.' },
    { id: 'b', label: 'ب) WX ∥ ......', answer: 'ZY', hint: 'الضلع المقابل لـ WX.' },
    { id: 'c', label: 'ج) WX = ...... = ......cm', answer: '2', hint: 'اكتب الطول بالأرقام فقط.' },
    { id: 'd', label: 'د) ∠WXY = ∠Z = ......', answer: '70', hint: 'اكتب القياس بالأرقام فقط.' },
    { id: 'e', label: 'هـ) XY = WZ = ......cm', answer: '5', hint: 'اكتب الطول بالأرقام فقط.' },
    { id: 'f', label: 'و) ∠XYZ = ∠W = ......', answer: '110', hint: 'اكتب القياس بالأرقام فقط.' },
  ]
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const clean = (value: string) => value.trim().replace(/[°\s[\]cm]/gi, '').toUpperCase()
  const correct = blanks.filter(blank => clean(values[blank.id] ?? '') === clean(blank.answer)).length
  return (
    <div className="l7-panel">
      <div className="l7-panel-head">
        <span className="section-kicker">نشاط المنصة · تصحيح فوري</span>
        <h3>املأ فراغات تدرّب ① ثم تحقّق</h3>
        <p>اكتب الأسماء بالحروف اللاتينية والأطوال والقياسات بالأرقام.</p>
      </div>
      <div className="l7-blank-grid">
        {blanks.map(blank => (
          <label key={blank.id} className="l7-blank">
            <span><BidiText>{blank.label}</BidiText></span>
            <input
              dir="ltr" aria-label={`blank-${blank.id}`} value={values[blank.id] ?? ''}
              onChange={event => { setValues({ ...values, [blank.id]: event.target.value }); setChecked(false) }}
            />
            {checked && (
              <small className={clean(values[blank.id] ?? '') === clean(blank.answer) ? 'is-good' : ''}>
                {clean(values[blank.id] ?? '') === clean(blank.answer) ? '✔ صحيح' : `✘ ${blank.hint} الإجابة: ${blank.answer}`}
              </small>
            )}
          </label>
        ))}
      </div>
      <button type="button" className="l7-submit" onClick={() => setChecked(true)}>تحقّق من الفراغات <Check size={15} /></button>
      {checked && <p className="l7-score-line">النتيجة: <MathExpression>{correct} / {blanks.length}</MathExpression></p>}
    </div>
  )
}

/** نشاط ⑦ — اكتشف الخطأ (نشاط منصة يقيس الفهم لا الحفظ). */
function ErrorHunt() {
  const claims = [
    { id: 'c1', text: 'في متوازي الأضلاع كل الأضلاع متساوية الطول.', wrong: true, why: 'الصحيح: كل ضلعين متقابلين متساويان. تساوي الأضلاع الأربعة يحدث في المعيّن والمربع فقط.' },
    { id: 'c2', text: 'قطر متوازي الأضلاع يصل بين رأسين غير متتاليين.', wrong: false, why: 'عبارة صحيحة، وهي تعريف القطر تماماً كما في صفحة 32.' },
    { id: 'c3', text: 'المستطيل ليس متوازي أضلاع لأن زواياه قائمة.', wrong: true, why: 'الصحيح: المستطيل متوازي أضلاع؛ الزوايا القائمة لا تلغي التوازي، بل تجعله حالة خاصة.' },
    { id: 'c4', text: 'كل زاويتين متقابلتين في متوازي الأضلاع متساويتا القياس.', wrong: false, why: 'عبارة صحيحة، وهي الخاصة الثانية في صفحة 33.' },
  ]
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  return (
    <div className="l7-panel">
      <div className="l7-panel-head">
        <span className="section-kicker">نشاط المنصة · تحدّي اكتشاف الخطأ</span>
        <h3><CircleAlert size={18} /> أي العبارات خاطئة؟</h3>
        <p>حدّد العبارات الخاطئة فقط، ثم اقرأ التصحيح.</p>
      </div>
      <div className="l7-claim-list">
        {claims.map(claim => (
          <div key={claim.id} className="l7-claim">
            <button type="button" className={flags[claim.id] ? 'is-selected' : ''} onClick={() => setFlags({ ...flags, [claim.id]: !flags[claim.id] })}>
              {flags[claim.id] ? 'عبارة خاطئة ✓' : 'حدّدها كخاطئة'}
            </button>
            <p><BidiText>{claim.text}</BidiText></p>
            {claim.id in flags && (
              <small className={flags[claim.id] === claim.wrong ? 'is-good' : ''}>
                {flags[claim.id] === claim.wrong ? '✔ ' : '✘ '}<BidiText>{claim.why}</BidiText>
              </small>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- steps */

function LaunchStep() {
  return (
    <div className="l7-step-content">
      <div className="l7-hero">
        <div className="l7-hero-badge"><Shapes size={42} /></div>
        <div>
          <span className="section-kicker">الدرس السابع · صفحات 31–35</span>
          <h3>متوازي الأضلاع: رباعي يحفظ التوازي مرّتين</h3>
          <p>سنتعرّف إلى متوازي الأضلاع وقطريه، ثم نكتشف خاصتيه بالنموذج والمنقلة، ثم نرسمه بالمسطرة والمنقلة، وننهي بتمارين الكتاب كاملة.</p>
        </div>
      </div>

      <div className="l7-goals">
        <strong>سنتعلّم</strong>
        <span>متوازي الأضلاع</span>
        <span>خواص متوازي الأضلاع</span>
        <span>رسم متوازي الأضلاع</span>
      </div>

      <SourceCard label="مدخل الدرس — ص 31">
        <p>نرى في حياتنا اليوميّة متوازيات الأضلاع في أماكن عديدة، لاحظ متوازي الأضلاع في الصّورة المجاورة.</p>
        <div className="l7-stairs" role="img" aria-label="رسم توضيحي لدرابزين درج تظهر فيه متوازيات أضلاع">
          <div className="l7-stairs-rail" />
          <div className="l7-stairs-rail is-second" />
          {[0, 1, 2, 3, 4, 5].map(index => <i key={index} style={{ left: `${8 + index * 15}%` }} />)}
          <span>كل قضيبين متتاليين مع الحافتين المائلتين يصنعان متوازي أضلاع</span>
        </div>
      </SourceCard>

      <BookTask id="l7-p31-intro" tone="teach" />
      <BookTask id="l7-p31-goals" tone="teach" />

      <div className="l7-banner"><Sparkles size={17} /> انطلاقة نشطة — ص 31: لاحظ الأشكال الآتية ثمّ أجب عن السّؤالين التّاليين.</div>

      <FigureFrame title="الأشكال الخمسة كما في الكتاب" zoomable caption="الأسهم المتطابقة على ضلعين تعني أن الضلعين متوازيان. عدد الأسهم يميّز مجموعة عن أخرى.">
        <div className="l7-gallery">
          {[['1', <Fig31One key="1" />], ['2', <Fig31Two key="2" />], ['3', <Fig31Three key="3" />], ['4', <Fig31Four key="4" />], ['5', <Fig31Five key="5" />]].map(([key, node]) => (
            <div className="l7-gallery-item" key={key as string}>
              {node as ReactNode}
              <span>الشّكل ({key as string})</span>
            </div>
          ))}
        </div>
      </FigureFrame>

      <p className="l7-question-lead">أ ) سمِّ كلّ ضلعين متوازيين في كلّ شكل رباعيّ إن وجدت.</p>
      <BookTask id="l7-p31-a-fig1"><Fig31One /></BookTask>
      <BookTask id="l7-p31-a-fig2"><Fig31Two /></BookTask>
      <BookTask id="l7-p31-a-fig3"><Fig31Three /></BookTask>
      <BookTask id="l7-p31-a-fig4"><Fig31Four /></BookTask>
      <BookTask id="l7-p31-a-fig5"><Fig31Five /></BookTask>

      <p className="l7-question-lead">ب) اذكر رقم كلّ شكل رباعيّ فيه كلّ ضلعين متقابلين متوازيان.</p>
      <BookTask id="l7-p31-b" />

      <ShapeSorter />
    </div>
  )
}

function DefinitionStep() {
  return (
    <div className="l7-step-content">
      <SourceCard label="تعلّم ① — ص 32">
        <p className="l7-definition"><strong>متوازي الأضلاع:</strong> هو شكل رباعي فيه كلّ ضلعين متقابلين متوازيان.</p>
        <p><strong>مثال:</strong> الشكل الرّباعي <MathExpression>ABCD</MathExpression> متوازي الأضلاع لأنّ <strong>كل</strong> ضلعين متقابلين متوازيان: <MathExpression>AB ∥ DC</MathExpression> ، <MathExpression>AD ∥ BC</MathExpression>.</p>
        <Fig32Main />
      </SourceCard>

      <div className="l7-explain">
        <h4><Lightbulb size={17} /> شرح موسّع: كيف نقرأ التعريف؟</h4>
        <div className="l7-explain-grid">
          <div><span>1</span><strong>ما الفكرة؟</strong><p>متوازي الأضلاع ليس «شكلاً مائلاً»، بل شكل رباعي تحقّق فيه شرط التوازي مرّتين: في مجموعة الأضلاع الأولى وفي المجموعة الثانية.</p></div>
          <div><span>2</span><strong>لماذا نستعمله؟</strong><p>لأنه يختصر العمل: بمجرد معرفة أن الشكل متوازي أضلاع نعرف مباشرة أطوال الأضلاع المقابلة وقياسات الزوايا المقابلة دون قياس جديد.</p></div>
          <div><span>3</span><strong>كيف نبدأ؟</strong><p>نعدّ الأضلاع: هل هي أربعة؟ ثم نحدّد الأزواج المتقابلة: الضلع الذي لا يشترك مع ضلعنا في أي رأس هو مقابله.</p></div>
          <div><span>4</span><strong>كيف نتحقق؟</strong><p>نبحث عن الأسهم في الرسم، أو نمدّ الضلعين بالمسطرة: إن التقيا فهما غير متوازيين.</p></div>
        </div>
        <p className="l7-mistake"><CircleAlert size={15} /> <span><strong>أشهر خطأ:</strong> الاكتفاء بزوج واحد من الأضلاع المتوازية. الشكل عندها شبه منحرف لا متوازي أضلاع.</span></p>
      </div>

      <BookTask id="l7-p32-definition" tone="teach" />
      <BookTask id="l7-p32-example" tone="teach"><Fig32Main /></BookTask>

      <div className="l7-compare">
        <div><strong>ضلعان متقابلان</strong><p><MathExpression>AB</MathExpression> و<MathExpression>DC</MathExpression> — لا يشتركان في أي رأس.</p></div>
        <div><strong>ضلعان متتاليان</strong><p><MathExpression>AB</MathExpression> و<MathExpression>BC</MathExpression> — يشتركان في الرأس <MathExpression>B</MathExpression>.</p></div>
        <div><strong>رأسان متقابلان</strong><p><MathExpression>A</MathExpression> و<MathExpression>C</MathExpression> — لا يجمعهما ضلع.</p></div>
      </div>
    </div>
  )
}

function DiagonalStep() {
  const [show, setShow] = useState(false)
  return (
    <div className="l7-step-content">
      <SourceCard label="تعلّم ① — ص 32">
        <p className="l7-definition"><strong>قطر متوازي الأضلاع:</strong> هو قطعة مستقيمة تصل بين رأسين غير متتاليين فيه.</p>
        <p>نسمّي <MathExpression>[AC]</MathExpression> ، <MathExpression>[BD]</MathExpression> قطري متوازي الأضلاع المرسوم جانباً.</p>
        <Fig32Main diagonals />
      </SourceCard>

      <BookTask id="l7-p32-diagonal" tone="teach" />
      <BookTask id="l7-p32-diagonal-name" tone="teach"><Fig32Main diagonals /></BookTask>

      <div className="l7-panel">
        <div className="l7-panel-head">
          <span className="section-kicker">نشاط المنصة · أظهر القطرين</span>
          <h3>الضلع أم القطر؟</h3>
          <p>اضغط الزر لإظهار القطرين، ولاحظ أنهما لا يمرّان على حافة الشكل بل يعبران داخله.</p>
        </div>
        <Fig32Main diagonals={show} />
        <div className="l7-choice-row is-centered">
          <button type="button" className={show ? 'is-selected' : ''} onClick={() => setShow(!show)}>{show ? 'أخفِ القطرين' : 'أظهر القطرين'}</button>
        </div>
        <p className="l7-stage-caption">
          لمتوازي الأضلاع أربعة أضلاع وقطران فقط: <MathExpression>[AC]</MathExpression> و<MathExpression>[BD]</MathExpression>. أما <MathExpression>[AB]</MathExpression> فهو ضلع لأن <MathExpression>A</MathExpression> و<MathExpression>B</MathExpression> رأسان متتاليان.
        </p>
      </div>
    </div>
  )
}

function RecognizeStep() {
  return (
    <div className="l7-step-content">
      <div className="l7-banner"><BookOpenCheck size={17} /> تحقّق من فهمك — ص 32: علّل إجابتك دائماً بالعودة إلى التعريف.</div>

      <p className="l7-question-lead">(1) علّل لماذا كلّ شكل من الشكلين الآتيين يمثّل متوازي الأضلاع:</p>
      <BookTask id="l7-p32-check1-fig1"><FigureFrame title="الشّكل (1)" zoomable><Fig32Check1A /></FigureFrame></BookTask>
      <BookTask id="l7-p32-check1-fig2"><FigureFrame title="الشّكل (2)" zoomable><Fig32Check1B /></FigureFrame></BookTask>

      <p className="l7-question-lead">(2) علّل لماذا كلّ شكل من الأشكال الآتية ليس متوازي الأضلاع:</p>
      <BookTask id="l7-p32-check2-fig1"><FigureFrame title="الشّكل (1)"><Fig32Check2A /></FigureFrame></BookTask>
      <BookTask id="l7-p32-check2-fig2"><FigureFrame title="الشّكل (2)" zoomable><Fig32Check2B /></FigureFrame></BookTask>
      <BookTask id="l7-p32-check2-fig3"><FigureFrame title="الشّكل (3)"><Fig32Check2C /></FigureFrame></BookTask>

      <div className="l7-explain">
        <h4><Lightbulb size={17} /> قائمة تحقّق من ثلاث خطوات</h4>
        <ol className="l7-checklist">
          <li>هل الشكل رباعي؟ (أربعة أضلاع وأربعة رؤوس) — إن كان مثلثاً توقّف هنا.</li>
          <li>هل المجموعة الأولى من الأضلاع المتقابلة متوازية؟</li>
          <li>هل المجموعة الثانية متوازية أيضاً؟ — إن فشلت هذه الخطوة فالشكل شبه منحرف.</li>
        </ol>
      </div>

      <ErrorHunt />
    </div>
  )
}

function SidesStep() {
  return (
    <div className="l7-step-content">
      <SourceCard label="خواص ② — اصنع نموذجاً — ص 33">
        <p>أحضر بطاقة على شكل متوازي الأضلاع ثم نفّذ الخطوات الآتية:</p>
        <ol className="l7-numbered">
          <li>لوّن كلّ ضلعين متقابلين بلون واحد كما في الشّكل.</li>
          <li>قصّ البطاقة بحسب أحد قطري متوازي الأضلاع.</li>
          <li>طابق بين المثلثين النّاتجين، ثمّ أجب:</li>
        </ol>
        <p className="l7-subquestion">1. هل الضّلعان الملوّنان باللّون الأحمر لهما الطّول نفسه؟</p>
        <p className="l7-subquestion">2. هل الضّلعان الملوّنان باللّون الأزرق لهما الطّول نفسه؟</p>
      </SourceCard>

      <ModelCardActivity />

      <BookTask id="l7-p33-model-steps"><ModelCard stage={1} /></BookTask>
      <BookTask id="l7-p33-model-q1" />
      <BookTask id="l7-p33-model-q2" />

      <div className="l7-property">
        <span>خاصة</span>
        <strong>كل ضلعين متقابلين في متوازي الأضلاع متساويا الطول.</strong>
      </div>
      <BookTask id="l7-p33-property-sides" tone="teach" />

      <div className="l7-explain">
        <h4><Lightbulb size={17} /> لماذا هذه الخاصة مفيدة؟</h4>
        <p>لأنها تختصر القياس إلى النصف: يكفي قياس ضلعين متجاورين لتعرف الأضلاع الأربعة، ومن هنا جاءت قاعدة المحيط <MathExpression>2 × (a + b)</MathExpression> بدل جمع أربعة أطوال.</p>
        <p className="l7-mistake"><CircleAlert size={15} /> <span><strong>انتبه:</strong> «متساويا الطول» تخصّ الضلعين المتقابلين فقط. الضلعان المتجاوران قد يختلفان تماماً.</span></p>
      </div>
    </div>
  )
}

function AnglesStep() {
  return (
    <div className="l7-step-content">
      <SourceCard label="خواص ② — لنعمل معاً — ص 33">
        <p>أحضر بطاقة على شكل متوازي الأضلاع ثم نفّذ الخطوات الآتية: في متوازي الأضلاع المجاور الزاوية <MathExpression>A</MathExpression> تقابل الزاوية <MathExpression>C</MathExpression>.</p>
        <Fig33Together />
        <p className="l7-subquestion">1. باستعمال المنقلة قِس الزاوية <MathExpression>C</MathExpression>، ماذا تلاحظ؟</p>
        <p className="l7-subquestion">2. ما هي الزاوية المقابلة للزاوية <MathExpression>B</MathExpression>؟</p>
        <p className="l7-subquestion">3. قِس كلاً من الزاويتين <MathExpression>B</MathExpression> و<MathExpression>D</MathExpression>، ماذا تلاحظ؟</p>
      </SourceCard>

      <BookTask id="l7-p33-together-q1"><Fig33Together /></BookTask>
      <BookTask id="l7-p33-together-q2" />
      <BookTask id="l7-p33-together-q3" />

      <div className="l7-property">
        <span>خاصة</span>
        <strong>كل زاويتين متقابلتين في متوازي الأضلاع متساويتا القياس.</strong>
      </div>
      <BookTask id="l7-p33-property-angles" tone="teach" />

      <ParallelogramLab />

      <div className="l7-oral">
        <strong>تعبير شفهي</strong>
        <p>تحدث عن خواص متوازي الأضلاع.</p>
      </div>
      <BookTask id="l7-p33-oral" tone="teach" />
    </div>
  )
}

function ApplyPropertiesStep() {
  return (
    <div className="l7-step-content">
      <div className="l7-banner"><BookOpenCheck size={17} /> تحقّق من فهمك — ص 33: تأمل متوازي الأضلاع المجاور ثم أجب عن السّؤالين الآتيين.</div>

      <FigureFrame title="متوازي الأضلاع ABCD" zoomable caption="المعطيات المطبوعة في الكتاب: AB = 3cm ، BC = 2cm ، ∠A = 70° ، ∠B = 110°.">
        <Fig33Check />
      </FigureFrame>

      <p className="l7-question-lead">(1) اكتب قياس كل من الزاويتين <MathExpression>C</MathExpression> ، <MathExpression>D</MathExpression> مع التّعليل.</p>
      <BookTask id="l7-p33-check-angle-c" />
      <BookTask id="l7-p33-check-angle-d" />

      <p className="l7-question-lead">(2) اكتب طول كلّ من <MathExpression>[AD]</MathExpression> ، <MathExpression>[DC]</MathExpression> مع التّعليل.</p>
      <BookTask id="l7-p33-check-side-ad" />
      <BookTask id="l7-p33-check-side-dc" />

      <div className="l7-explain">
        <h4><Lightbulb size={17} /> كيف أعرف أن حلّي صحيح؟</h4>
        <ul className="l7-checklist">
          <li>الزاويتان المتقابلتان يجب أن تتساويا: <MathExpression>70° = 70°</MathExpression> و<MathExpression>110° = 110°</MathExpression>.</li>
          <li>مجموع زوايا أي شكل رباعي <MathExpression>360°</MathExpression>: <MathExpression>70 + 110 + 70 + 110 = 360</MathExpression> ✔</li>
          <li>الضلعان المتقابلان متساويان: <MathExpression>AB = DC = 3cm</MathExpression> و<MathExpression>BC = AD = 2cm</MathExpression>.</li>
          <li>المحيط للتحقق: <MathExpression>2 × (3 + 2) = 10cm</MathExpression>.</li>
        </ul>
      </div>
    </div>
  )
}

function ConstructionStep() {
  return (
    <div className="l7-step-content">
      <SourceCard label="رسم ③ — ص 34">
        <p>لرسم متوازي الأضلاع <MathExpression>XYZW</MathExpression> فيه <MathExpression>∠XYZ = 120°</MathExpression> ، <MathExpression>XY = 4cm</MathExpression> ، <MathExpression>YZ = 3cm</MathExpression> نتّبع الخطوات الآتية:</p>
      </SourceCard>

      <ConstructionPlayer />

      <BookTask id="l7-p34-draw-step1"><ConstructionFigure step={1} /></BookTask>
      <BookTask id="l7-p34-draw-step2"><ConstructionFigure step={2} /></BookTask>
      <BookTask id="l7-p34-draw-step3"><ConstructionFigure step={3} /></BookTask>
      <BookTask id="l7-p34-draw-step4"><ConstructionFigure step={4} /></BookTask>
      <BookTask id="l7-p34-draw-step5"><FigureFrame zoomable title="الشكل النهائي XYZW"><ConstructionFigure step={5} /></FigureFrame></BookTask>

      <div className="l7-explain">
        <h4><Lightbulb size={17} /> قاعدة عامة لأي رسم</h4>
        <p>معطيات الرسم تأتي عادةً على شكل: <strong>ضلع + زاوية + ضلع</strong> يشتركان في الرأس نفسه. ابدأ دائماً بالضلع، ثم الزاوية عند رأسه، ثم الضلع الثاني، ثم أكمل بالتوازي.</p>
        <p className="l7-mistake"><CircleAlert size={15} /> <span><strong>خطأ شائع:</strong> إنشاء الزاوية عند الرأس الخطأ. في الرمز <MathExpression>∠XYZ</MathExpression> الرأس هو الحرف الأوسط <MathExpression>Y</MathExpression>.</span></p>
      </div>
    </div>
  )
}

function ConstructionCheckStep() {
  return (
    <div className="l7-step-content">
      <div className="l7-banner"><PencilRuler size={17} /> تحقّق من فهمك — ص 34</div>
      <SourceCard label="تحقّق من فهمك — ص 34">
        <p>ارسم متوازي الأضلاع <MathExpression>ABCD</MathExpression> فيه <MathExpression>AD = 2cm</MathExpression> ، <MathExpression>∠ADC = 125°</MathExpression> ، <MathExpression>DC = 4cm</MathExpression>. ماذا نسمّي <MathExpression>[BD]</MathExpression> ؟</p>
      </SourceCard>

      <BookTask id="l7-p34-check-draw">
        <FigureFrame title="الرسم المطلوب (مقياس مطابق للمعطيات)" zoomable caption="الزاوية 125° رأسها D بين الضلعين [DA] و[DC].">
          <GeoFigure
            ariaLabel="متوازي الأضلاع ABCD حيث DC يساوي 4 سنتيمتر و AD يساوي 2 سنتيمتر والزاوية ADC تساوي 125 درجة"
            width={320} height={190}
            pts={{ D: P(80, 150), C: P(224, 150), B: P(183, 91), A: P(39, 91) }}
            order={['A', 'B', 'C', 'D']}
            sides={[{ side: ['D', 'C'], label: '4cm' }, { side: ['A', 'D'], label: '2cm' }]}
            angles={[{ at: 'D', from: 'C', to: 'A', label: '125°', tone: 'rose', radius: 28 }]}
            marks={[{ side: ['C', 'D'], count: 1 }, { side: ['B', 'A'], count: 1 }]}
          />
        </FigureFrame>
      </BookTask>

      <BookTask id="l7-p34-check-bd">
        <GeoFigure
          ariaLabel="متوازي الأضلاع ABCD مرسوم فيه القطر BD"
          width={320} height={190}
          pts={{ D: P(80, 150), C: P(224, 150), B: P(183, 91), A: P(39, 91) }}
          order={['A', 'B', 'C', 'D']}
          diagonals={[['B', 'D']]}
        />
      </BookTask>
    </div>
  )
}

function Practice12Step() {
  return (
    <div className="l7-step-content">
      <div className="l7-banner"><Sparkles size={17} /> تدرّب — ص 35: كل فرع من فروع التمرين موجود هنا كاملاً.</div>

      <SourceCard label="تدرّب ① — ص 35">
        <p><MathExpression>WXYZ</MathExpression> متوازي الأضلاع، انسخ إلى دفترك ثمّ املأ الفراغات:</p>
        <FigureFrame title="الشكل المرافق للتمرين ①" zoomable caption="المعطيات: WZ = 5cm ، ZY = 2cm ، ∠W = 110° ، ∠Z = 70°.">
          <Fig35Ex1 />
        </FigureFrame>
      </SourceCard>

      <FillBlanksActivity />

      <BookTask id="l7-p35-ex1-a" />
      <BookTask id="l7-p35-ex1-b" />
      <BookTask id="l7-p35-ex1-c" />
      <BookTask id="l7-p35-ex1-d" />
      <BookTask id="l7-p35-ex1-e" />
      <BookTask id="l7-p35-ex1-f" />

      <SourceCard label="تدرّب ② — ص 35">
        <p>انسخ إلى دفترك ثمّ املأ الفراغات بعبارات مناسبة:</p>
        <p className="l7-subquestion">أ ) كل ضلعين متقابلين في متوازي الأضلاع ...... و......</p>
        <p className="l7-subquestion">ب) كل زاويتين متقابلتين في متوازي الأضلاع ......</p>
      </SourceCard>
      <BookTask id="l7-p35-ex2-a" />
      <BookTask id="l7-p35-ex2-b" />
    </div>
  )
}

function Practice3Step() {
  return (
    <div className="l7-step-content">
      <SourceCard label="تدرّب ③ — ص 35">
        <p>انسخ الشّكل المجاور إلى دفترك ثمّ:</p>
        <p className="l7-subquestion">أ ) عيّن الرّأس الرّابع <MathExpression>D</MathExpression> ليكون <MathExpression>ABCD</MathExpression> متوازي الأضلاع.</p>
        <p className="l7-subquestion">ب) اكتب الخاصّة أو الخواص الّتي اعتمدت عليها في تعيين الرّأس <MathExpression>D</MathExpression>.</p>
        <p className="l7-subquestion">ج) سجّل على الشّكل أطوال أضلاع <MathExpression>ABCD</MathExpression>.</p>
        <p className="l7-subquestion">د) احسب محيط متوازي الأضلاع <MathExpression>ABCD</MathExpression>.</p>
      </SourceCard>

      <FourthVertexActivity />

      <BookTask id="l7-p35-ex3-a" />
      <BookTask id="l7-p35-ex3-b" />
      <BookTask id="l7-p35-ex3-c">
        <FigureFrame title="الشكل بعد تعيين D وتسجيل الأطوال" zoomable caption="الكتاب لا يطبع أرقاماً على هذا الشكل؛ الطالب يقيس بالمسطرة. القياسات هنا مطابقة لمقياس الرسم المعروض.">
          <GeoFigure
            ariaLabel="متوازي الأضلاع ABCD بعد تعيين الرأس D، الضلع AB يساوي 4 سنتيمتر والضلع BC يساوي 3 سنتيمتر"
            width={330} height={215}
            pts={{ A: P(240, 47), B: P(70, 45), C: P(105, 170), D: P(275, 172) }}
            order={['A', 'B', 'C', 'D']}
            sides={[{ side: ['B', 'A'], label: '4cm' }, { side: ['B', 'C'], label: '3cm' }, { side: ['C', 'D'], label: '4cm' }, { side: ['A', 'D'], label: '3cm' }]}
            marks={[{ side: ['B', 'A'], count: 1 }, { side: ['C', 'D'], count: 1 }, { side: ['B', 'C'], count: 2, tone: 'red' }, { side: ['A', 'D'], count: 2, tone: 'red' }]}
          />
        </FigureFrame>
      </BookTask>
      <BookTask id="l7-p35-ex3-d" />

      <div className="l7-explain">
        <h4><Lightbulb size={17} /> محيط متوازي الأضلاع</h4>
        <p>المحيط <MathExpression>= AB + BC + CD + DA</MathExpression>، وبما أن <MathExpression>CD = AB</MathExpression> و<MathExpression>DA = BC</MathExpression> فإن المحيط <MathExpression>= 2 × (AB + BC)</MathExpression>.</p>
      </div>
    </div>
  )
}

const ex4Cases = {
  a: {
    pts: { A: P(108, 72), B: P(60, 155), C: P(220, 155), D: P(268, 72) } as Record<string, Pt>,
    sides: [{ side: ['B', 'C'] as [string, string], label: '5cm' }, { side: ['B', 'A'] as [string, string], label: '3cm' }],
    angle: { at: 'B', from: 'C', to: 'A', label: '60°' },
    note: 'المعطيات محددة تماماً: ضلع + زاوية + ضلع عند الرأس B، فالرسم وحيد.',
  },
  b: {
    pts: { A: P(125, 81), B: P(70, 160), C: P(198, 160), D: P(253, 81) } as Record<string, Pt>,
    sides: [{ side: ['B', 'C'] as [string, string], label: '4cm' }, { side: ['B', 'A'] as [string, string], label: '3cm' }],
    angle: undefined,
    note: 'لا توجد زاوية معطاة: هذا أحد حلول كثيرة ممكنة (رُسم هنا بزاوية 55°)، وكلها صحيحة.',
  },
  c: {
    pts: { A: P(103, 70), B: P(70, 160), C: P(198, 160), D: P(231, 70) } as Record<string, Pt>,
    sides: [{ side: ['B', 'C'] as [string, string], label: '4cm' }, { side: ['B', 'A'] as [string, string], label: '3cm' }],
    angle: { at: 'B', from: 'C', to: 'A', label: '70°' },
    note: 'الرسم وحيد: عرفنا ضلعين والزاوية المحصورة بينهما عند B.',
  },
  d: {
    pts: { A: P(50, 175), B: P(210, 175), C: P(265, 25), D: P(105, 25) } as Record<string, Pt>,
    sides: [{ side: ['A', 'B'] as [string, string], label: '5cm' }, { side: ['A', 'D'] as [string, string], label: '5cm' }],
    angle: { at: 'A', from: 'B', to: 'D', label: '70°' },
    note: 'الأضلاع الأربعة متساوية (5cm) فالشكل الناتج معيّن، وهو متوازي أضلاع خاص.',
  },
}

function Ex4Figure({ variant }: { variant: keyof typeof ex4Cases }) {
  const item = ex4Cases[variant]
  return (
    <FigureFrame caption={item.note} zoomable>
      <GeoFigure
        ariaLabel="رسم متوازي الأضلاع ABCD حسب معطيات الحالة"
        width={310} height={205}
        pts={item.pts}
        order={['A', 'B', 'C', 'D']}
        sides={item.sides}
        angles={item.angle ? [{ ...item.angle, tone: 'rose' as const, radius: 26 }] : []}
        marks={[
          { side: ['B', 'A'], count: 1 }, { side: ['C', 'D'], count: 1 },
          { side: ['C', 'B'], count: 2, tone: 'red' }, { side: ['D', 'A'], count: 2, tone: 'red' },
        ]}
      />
    </FigureFrame>
  )
}

function Practice4Step() {
  return (
    <div className="l7-step-content">
      <SourceCard label="تدرّب ④ — ص 35">
        <p>ارسم متوازي الأضلاع <MathExpression>ABCD</MathExpression> في كل من الحالات الآتية:</p>
        <div className="l7-cases">
          <span>أ ) <MathExpression>∠CBA = 60°</MathExpression> ، <MathExpression>BC = 5cm</MathExpression> ، <MathExpression>AB = 3cm</MathExpression></span>
          <span>ب) <MathExpression>BA = 3cm</MathExpression> ، <MathExpression>BC = 4cm</MathExpression></span>
          <span>ج) <MathExpression>BA = 3cm</MathExpression> ، <MathExpression>∠CBA = 70°</MathExpression> ، <MathExpression>BC = 4cm</MathExpression></span>
          <span>د) <MathExpression>AB = 5cm</MathExpression> ، <MathExpression>∠DAB = 70°</MathExpression> ، <MathExpression>AD = 5cm</MathExpression></span>
        </div>
      </SourceCard>

      <BookTask id="l7-p35-ex4-a"><Ex4Figure variant="a" /></BookTask>
      <BookTask id="l7-p35-ex4-b"><Ex4Figure variant="b" /></BookTask>
      <BookTask id="l7-p35-ex4-c"><Ex4Figure variant="c" /></BookTask>
      <BookTask id="l7-p35-ex4-d"><Ex4Figure variant="d" /></BookTask>

      <div className="l7-explain">
        <h4><Lightbulb size={17} /> متى يكون الرسم وحيداً؟</h4>
        <p>إذا أُعطيت <strong>زاوية بين ضلعين معلومين</strong> فالرسم وحيد (الحالات أ، ج، د). أما إذا أُعطيت الأطوال فقط (الحالة ب) فيمكن «ميلان» الشكل كما نشاء، فالحلول كثيرة — وهذه ليست مشكلة بل خاصية للمسألة.</p>
      </div>
    </div>
  )
}

function Practice5Step() {
  return (
    <div className="l7-step-content">
      <SourceCard label="تدرّب ⑤ — ص 35">
        <p>في الشّكل المجاور <MathExpression>ABCD</MathExpression> ، <MathExpression>DCFE</MathExpression> متوازيا الأضلاع فيهما: <MathExpression>EF = 8</MathExpression> ، <MathExpression>∠A = 130°</MathExpression> ، <MathExpression>∠F = 50°</MathExpression></p>
        <FigureFrame title="الشكل المرافق للتمرين ⑤" zoomable caption="الضلع [DC] مشترك بين الشكلين، وهو مفتاح الحل.">
          <Fig35Ex5 />
        </FigureFrame>
        <p className="l7-subquestion">أ ) احسب طول <MathExpression>[AB]</MathExpression></p>
        <p className="l7-subquestion">ب) احسب قياس كل من الزوايا <MathExpression>∠CDE</MathExpression> و<MathExpression>∠DCB</MathExpression>.</p>
      </SourceCard>

      <BookTask id="l7-p35-ex5-a"><Fig35Ex5 /></BookTask>
      <BookTask id="l7-p35-ex5-b-cde" />
      <BookTask id="l7-p35-ex5-b-dcb" />

      <div className="l7-explain">
        <h4><Lightbulb size={17} /> استراتيجية الشكلين المتجاورين</h4>
        <ol className="l7-checklist">
          <li>حدّد الضلع المشترك بين الشكلين: هنا <MathExpression>[DC]</MathExpression>.</li>
          <li>انقل المعلومة من الشكل الأول إلى الضلع المشترك.</li>
          <li>ثم انقلها من الضلع المشترك إلى الشكل الثاني.</li>
          <li>للزوايا: اسأل أولاً «في أي متوازي أضلاع تقع هذه الزاوية؟» قبل البحث عن مقابلتها.</li>
        </ol>
      </div>
    </div>
  )
}

function RecapStep() {
  return (
    <div className="l7-step-content l7-recap">
      <div className="l7-recap-icon"><RotateCcw size={24} /></div>
      <h3>خلاصة الدرس السابع</h3>
      <ul>
        <li><strong>التعريف:</strong> متوازي الأضلاع شكل رباعي فيه كلّ ضلعين متقابلين متوازيان.</li>
        <li><strong>القطر:</strong> قطعة مستقيمة تصل بين رأسين غير متتاليين؛ ولمتوازي الأضلاع قطران.</li>
        <li><strong>الخاصة الأولى:</strong> كل ضلعين متقابلين متساويا الطول.</li>
        <li><strong>الخاصة الثانية:</strong> كل زاويتين متقابلتين متساويتا القياس.</li>
        <li><strong>المحيط:</strong> <MathExpression>2 × (a + b)</MathExpression> حيث <MathExpression>a</MathExpression> و<MathExpression>b</MathExpression> ضلعان متجاوران.</li>
        <li><strong>الرسم:</strong> ضلع ← زاوية عند رأسه ← ضلع ثانٍ ← إكمال بالتوازي ← إغلاق الشكل.</li>
        <li><strong>حالات خاصة:</strong> المستطيل والمعيّن والمربع كلها متوازيات أضلاع.</li>
      </ul>
      <div className="l7-recap-chips">
        <span>رباعي</span><MoveRight size={14} /><span>توازٍ مرّتين</span><MoveRight size={14} /><span>أضلاع متقابلة متساوية</span><MoveRight size={14} /><span>زوايا متقابلة متساوية</span>
      </div>
    </div>
  )
}

function FinalTest() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const normalize = (value: string) => value.trim().replace(/[°\s,،cm]/gi, '')
  const score = finalAssessment7.filter(question => normalize(answers[question.id] ?? '') === normalize(question.answer)).length
  return (
    <div className="l7-step-content l7-final-test">
      <div className="l7-banner"><Check size={17} /> اختبار ختامي جديد من إعداد المنصة — ليس منقولاً من الكتاب، ويقيس الفهم والنقل إلى مواقف جديدة.</div>
      <p>اقرأ كل سؤال بتمهّل. في أسئلة الاختيار ابحث عن السبب، وفي أسئلة الكتابة اكتب الأرقام فقط دون وحدات.</p>
      {finalAssessment7.map((question, index) => (
        <label className="l7-test-question" key={question.id}>
          <strong>{index + 1}. <BidiText>{question.text}</BidiText></strong>
          {question.type === 'input' ? (
            <input dir="ltr" aria-label={question.id} value={answers[question.id] ?? ''} onChange={event => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder="اكتب الإجابة" />
          ) : (
            <div className="l7-choice-row">
              {question.options?.map(option => (
                <button type="button" key={option} className={answers[question.id] === option ? 'is-selected' : ''} onClick={() => setAnswers({ ...answers, [question.id]: option })}>
                  <BidiText>{option}</BidiText>
                </button>
              ))}
            </div>
          )}
          {question.hint && <small className="l7-hint">تلميح: <BidiText>{question.hint}</BidiText></small>}
        </label>
      ))}
      <button type="button" className="l7-submit" onClick={() => setSubmitted(true)}>عرض النتيجة <Check size={16} /></button>
      {submitted && (
        <div className="l7-result">
          <strong>نتيجتك: <MathExpression>{score} / {finalAssessment7.length}</MathExpression></strong>
          <p>{score === finalAssessment7.length ? 'إتقان كامل! أصبحت تميّز متوازي الأضلاع وتستعمل خاصتيه بثقة.' : 'راجع الخطوات التي أخطأت فيها: ارجع إلى التعريف أولاً، ثم إلى الخاصتين، ثم أعد المحاولة.'}</p>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ lesson */

export function ParallelogramLesson() {
  const steps: LessonStep[] = [
    { id: 'launch', title: 'انطلاقة الدرس', content: <LaunchStep /> },
    { id: 'definition', title: 'ما متوازي الأضلاع؟', content: <DefinitionStep /> },
    { id: 'diagonal', title: 'قطر متوازي الأضلاع', content: <DiagonalStep /> },
    { id: 'recognize', title: 'تحقّق: تمييز الأشكال', content: <RecognizeStep /> },
    { id: 'sides', title: 'خاصة الأضلاع', content: <SidesStep /> },
    { id: 'angles', title: 'خاصة الزوايا', content: <AnglesStep /> },
    { id: 'apply', title: 'تحقّق: تطبيق الخاصتين', content: <ApplyPropertiesStep /> },
    { id: 'construction', title: 'رسم متوازي الأضلاع', content: <ConstructionStep /> },
    { id: 'construction-check', title: 'تحقّق: ارسم ABCD', content: <ConstructionCheckStep /> },
    { id: 'practice-1-2', title: 'تدرّب ① و②', content: <Practice12Step /> },
    { id: 'practice-3', title: 'تدرّب ③', content: <Practice3Step /> },
    { id: 'practice-4', title: 'تدرّب ④', content: <Practice4Step /> },
    { id: 'practice-5', title: 'تدرّب ⑤', content: <Practice5Step /> },
    { id: 'recap', title: 'الخلاصة', content: <RecapStep /> },
    { id: 'test', title: 'الاختبار النهائي', content: <FinalTest /> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return (
    <>
      <LessonShell title="متوازي الأضلاع" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-seven" />
      <BookCoverageMarkers />
    </>
  )
}
