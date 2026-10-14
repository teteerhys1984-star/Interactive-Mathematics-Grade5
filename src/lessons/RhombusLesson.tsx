import { useMemo, useState, type ReactNode } from 'react'
import {
  BookOpenCheck, Check, CircleAlert, Diamond, Eye, EyeOff, Lightbulb, MoveRight,
  PencilRuler, RotateCcw, Ruler, Shapes, Sparkles, Target,
} from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { BidiText } from '../components/BidiText'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import { GeoFigure, FigureFrame, type Pt } from '../components/lesson/GeoFigure'
import type { LessonStep } from '../components/lesson/types'
import { finalAssessment8, lessonEightBookElements } from './rhombusData'

/* ------------------------------------------------------------------ ledger */

const byId = Object.fromEntries(lessonEightBookElements.map(element => [element.id, element]))

/**
 * Renders one textbook element in the Student Area: the printed question (or printed teaching
 * content), its rebuilt figure, and the full step-by-step explanation — given, required, rule,
 * why, steps, answer, verification and the specific pitfall. Nothing from صفحات 36–39 is
 * "referenced only".
 */
function BookTask({ id, children, tone = 'default' }: { id: string; children?: ReactNode; tone?: 'default' | 'teach' }) {
  const element = byId[id]
  const [open, setOpen] = useState(false)
  if (!element) return null
  return (
    <article className={`l8-task ${tone === 'teach' ? 'is-teach' : ''}`} data-source-id={id}>
      <div className="l8-task-head">
        <span className="l8-task-tag">{element.section} · ص {element.page}</span>
        <span className={`l8-kind ${element.kind === 'task' ? 'is-task' : 'is-content'}`}>
          {element.kind === 'task' ? 'سؤال من الكتاب' : 'محتوى من الكتاب'}
        </span>
        <h4>{element.title}</h4>
      </div>
      <p className="l8-task-prompt"><BidiText>{element.prompt}</BidiText></p>
      {children}
      {element.note && <p className="l8-editorial"><CircleAlert size={14} /> <span><BidiText>{element.note}</BidiText></span></p>}
      <button type="button" className="l8-reveal" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? <EyeOff size={15} /> : <Eye size={15} />}
        {open ? 'إخفاء الشرح' : 'اكشف الحل خطوة بخطوة'}
      </button>
      {open && (
        <div className="l8-solution">
          <dl className="l8-frame">
            <div><dt>المعطيات</dt><dd><BidiText>{element.given}</BidiText></dd></div>
            <div><dt>المطلوب</dt><dd><BidiText>{element.required}</BidiText></dd></div>
            <div><dt>القاعدة</dt><dd><BidiText>{element.rule}</BidiText></dd></div>
            <div><dt>لماذا تنطبق</dt><dd><BidiText>{element.why}</BidiText></dd></div>
          </dl>
          <ol className="l8-steps">
            {element.reasoning.map((line, index) => <li key={index}><BidiText>{line}</BidiText></li>)}
          </ol>
          <p className="l8-answer"><strong>الإجابة:</strong> <BidiText>{element.answer}</BidiText></p>
          <p className="l8-verify"><Check size={15} /> <span><strong>التحقّق:</strong> <BidiText>{element.verification}</BidiText></span></p>
          {element.pitfall && (
            <p className="l8-pitfall"><CircleAlert size={15} /> <span><strong>خطأ شائع:</strong> <BidiText>{element.pitfall}</BidiText></span></p>
          )}
        </div>
      )}
    </article>
  )
}

/** A hidden, machine-checkable index proving every ledger row reached the Student Area. */
function BookCoverageMarkers() {
  return (
    <div className="l8-coverage-markers" aria-label="فهرس عناصر صفحات الدرس 36–39">
      {lessonEightBookElements.map(element => (
        <span key={element.id} data-source-id={element.id}>{element.title} — ص {element.page}</span>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- figures  */

const P = (x: number, y: number): Pt => ({ x, y })

/** مدخل الدرس — إعادة بناء مبسّطة لشبكة الصورة: عيون معيّنة متكرّرة. */
function MeshFigure() {
  const cells: Array<{ cx: number; cy: number }> = [
    { cx: 80, cy: 95 }, { cx: 160, cy: 95 }, { cx: 240, cy: 95 },
    { cx: 120, cy: 155 }, { cx: 200, cy: 155 },
  ]
  const hx = 40
  const vy = 30
  return (
    <svg className="l8-mesh" viewBox="0 0 320 210" role="img" aria-label="شبكة معدنية عيونها على شكل معيّنات متساوية" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      {cells.map(({ cx, cy }, index) => (
        <path
          key={index}
          d={`M ${cx - hx} ${cy} L ${cx} ${cy - vy} L ${cx + hx} ${cy} L ${cx} ${cy + vy} Z`}
          className={index === 1 ? 'l8-mesh-cell is-focus' : 'l8-mesh-cell'}
        />
      ))}
    </svg>
  )
}

/** صفحة 36 — انطلاقة نشطة، الشكل (1): شبه منحرف. */
const Fig36Start1 = () => (
  <GeoFigure
    ariaLabel="الشكل 1: شبه منحرف، الضلعان العلوي والسفلي متوازيان فقط"
    width={290} height={200}
    pts={{ A: P(60, 55), B: P(230, 55), C: P(205, 145), D: P(85, 145) }}
    order={['A', 'B', 'C', 'D']}
    showLabels={false}
    marks={[{ side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 }]}
  />
)

/** صفحة 36 — انطلاقة نشطة، الشكل (2): معيّن مرتفع. */
const Fig36Start2 = () => (
  <GeoFigure
    ariaLabel="الشكل 2: شكل رباعي كل ضلعين متقابلين فيه متوازيان وأضلاعه متساوية"
    width={290} height={200}
    pts={{ T: P(145, 45), R: P(180, 100), B: P(145, 155), L: P(110, 100) }}
    order={['T', 'R', 'B', 'L']}
    showLabels={false}
    marks={[
      { side: ['L', 'T'], count: 2, tone: 'red' }, { side: ['B', 'R'], count: 2, tone: 'red' },
      { side: ['T', 'R'], count: 1 }, { side: ['L', 'B'], count: 1 },
    ]}
  />
)

/** صفحة 36 — انطلاقة نشطة، الشكل (3): مستطيل. */
const Fig36Start3 = () => (
  <GeoFigure
    ariaLabel="الشكل 3: مستطيل، الضلعان العلوي والسفلي متوازيان والضلعان الجانبيان متوازيان"
    width={290} height={200}
    pts={{ A: P(60, 55), B: P(230, 55), C: P(230, 145), D: P(60, 145) }}
    order={['A', 'B', 'C', 'D']}
    showLabels={false}
    marks={[
      { side: ['A', 'B'], count: 2, tone: 'red' }, { side: ['D', 'C'], count: 2, tone: 'red' },
      { side: ['B', 'C'], count: 1 }, { side: ['A', 'D'], count: 1 },
    ]}
  />
)

/** صفحة 36 — انطلاقة نشطة، الشكل (4): معيّن عريض. */
const Fig36Start4 = () => (
  <GeoFigure
    ariaLabel="الشكل 4: شكل رباعي عريض كل ضلعين متقابلين فيه متوازيان وأضلاعه متساوية"
    width={290} height={200}
    pts={{ T: P(145, 52), R: P(211, 100), B: P(145, 148), L: P(79, 100) }}
    order={['T', 'R', 'B', 'L']}
    showLabels={false}
    marks={[
      { side: ['L', 'T'], count: 2, tone: 'red' }, { side: ['B', 'R'], count: 2, tone: 'red' },
      { side: ['T', 'R'], count: 1 }, { side: ['L', 'B'], count: 1 },
    ]}
  />
)

/** صفحة 36 — رسم بطاقة التعريف: معيّن بعلامتَي تساوٍ على ضلعين متجاورين. */
const Fig36Definition = () => (
  <GeoFigure
    ariaLabel="معيّن عليه علامتا تساوٍ على ضلعين متجاورين"
    width={260} height={210}
    pts={{ T: P(130, 40), R: P(175, 105), B: P(130, 170), L: P(85, 105) }}
    order={['T', 'R', 'B', 'L']}
    showLabels={false}
    ticks={[{ side: ['T', 'L'], count: 1 }, { side: ['T', 'R'], count: 1 }]}
    marks={[
      { side: ['L', 'T'], count: 2, tone: 'blue' }, { side: ['B', 'R'], count: 2, tone: 'blue' },
      { side: ['T', 'R'], count: 1 }, { side: ['L', 'B'], count: 1 },
    ]}
  />
)

/** صفحة 36 — مثال الكتاب: ABCD مع AB = BC = 3cm. */
const Fig36Example = () => (
  <GeoFigure
    ariaLabel="متوازي الأضلاع ABCD، الضلع AB يساوي 3 سنتيمتر والضلع BC يساوي 3 سنتيمتر"
    width={290} height={215}
    pts={{ A: P(95, 60), B: P(215, 60), C: P(183.9, 175.9), D: P(63.9, 175.9) }}
    order={['A', 'B', 'C', 'D']}
    sides={[{ side: ['A', 'B'], label: '3cm' }, { side: ['B', 'C'], label: '3cm' }]}
    marks={[
      { side: ['A', 'B'], count: 2, tone: 'red' }, { side: ['D', 'C'], count: 2, tone: 'red' },
      { side: ['A', 'D'], count: 1 }, { side: ['B', 'C'], count: 1 },
    ]}
  />
)

/** صفحة 37 — تحقّق ①، الشكل (1): معيّن بأسهم توازٍ. */
const Fig37Check1A = () => (
  <GeoFigure
    ariaLabel="شكل رباعي كل ضلعين متقابلين فيه متوازيان، والقياس يبيّن تساوي أضلاعه"
    width={270} height={210}
    pts={{ T: P(130, 40), R: P(180, 105), B: P(130, 170), L: P(80, 105) }}
    order={['T', 'R', 'B', 'L']}
    showLabels={false}
    marks={[
      { side: ['L', 'T'], count: 2, tone: 'red' }, { side: ['B', 'R'], count: 2, tone: 'red' },
      { side: ['T', 'R'], count: 1 }, { side: ['L', 'B'], count: 1 },
    ]}
  />
)

/** صفحة 37 — تحقّق ①، الشكل (2): مربّع. */
const Fig37Check1B = () => (
  <GeoFigure
    ariaLabel="مربّع: أضلاعه الأربعة متساوية وزواياه قائمة"
    width={270} height={210}
    pts={{ A: P(80, 45), B: P(200, 45), C: P(200, 165), D: P(80, 165) }}
    order={['A', 'B', 'C', 'D']}
    showLabels={false}
    right={[{ at: 'A', from: 'B', to: 'D' }]}
  />
)

/** صفحة 37 — تحقّق ②، الشكل (1): متوازي أضلاع 3cm و2cm. */
const Fig37Check2A = () => (
  <GeoFigure
    ariaLabel="متوازي أضلاع ضلعه العلوي 3 سنتيمتر وضلعه الجانبي 2 سنتيمتر"
    width={270} height={185}
    pts={{ A: P(75, 50), B: P(195, 50), C: P(174.3, 127.3), D: P(54.3, 127.3) }}
    order={['A', 'B', 'C', 'D']}
    showLabels={false}
    sides={[{ side: ['A', 'B'], label: '3cm' }, { side: ['B', 'C'], label: '2cm' }]}
    marks={[
      { side: ['A', 'B'], count: 2, tone: 'red' }, { side: ['D', 'C'], count: 2, tone: 'red' },
      { side: ['B', 'C'], count: 1 }, { side: ['A', 'D'], count: 1 },
    ]}
  />
)

/** صفحة 37 — تحقّق ②، الشكل (2): شبه منحرف 2cm و2cm. */
const Fig37Check2B = () => (
  <GeoFigure
    ariaLabel="شبه منحرف ضلعه العلوي 2 سنتيمتر وضلعه الجانبي 2 سنتيمتر، وفيه زوج واحد من الأضلاع المتوازية"
    width={270} height={190}
    pts={{ A: P(95, 55), B: P(175, 55), C: P(175, 135), D: P(55, 135) }}
    order={['A', 'B', 'C', 'D']}
    showLabels={false}
    sides={[{ side: ['A', 'B'], label: '2cm' }, { side: ['B', 'C'], label: '2cm' }]}
    marks={[{ side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 }]}
  />
)

/** صفحة 37 — تحقّق ②، الشكل (3): دالية بعلامات تساوٍ. */
const Fig37Check2C = () => (
  <GeoFigure
    ariaLabel="شكل رباعي فيه ضلعان متجاوران طويلان متساويان وضلعان متجاوران قصيران متساويان، ولا يوجد فيه ضلعان متوازيان"
    width={300} height={200}
    pts={{ L: P(35, 105), T: P(170, 60), R: P(255, 105), B: P(170, 150) }}
    order={['L', 'T', 'R', 'B']}
    showLabels={false}
    ticks={[
      { side: ['L', 'T'], count: 2 }, { side: ['L', 'B'], count: 2 },
      { side: ['T', 'R'], count: 1 }, { side: ['B', 'R'], count: 1 },
    ]}
  />
)

/** صفحة 37 — تحقّق ③: المعيّن ABCD مع AB = 5cm والزاويتان 50° و130°. */
const Fig37Rhombus = () => (
  <GeoFigure
    ariaLabel="المعيّن ABCD، الضلع AB يساوي 5 سنتيمتر، الزاوية A تساوي 50 درجة والزاوية B تساوي 130 درجة"
    width={300} height={200}
    pts={{ A: P(55, 55), B: P(175, 55), C: P(252.1, 146.9), D: P(132.1, 146.9) }}
    order={['A', 'B', 'C', 'D']}
    sides={[{ side: ['A', 'B'], label: '5cm' }]}
    angles={[
      { at: 'A', from: 'B', to: 'D', label: '50°', tone: 'rose', radius: 30 },
      { at: 'B', from: 'A', to: 'C', label: '130°', tone: 'plum', radius: 24 },
    ]}
    marks={[
      { side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 },
      { side: ['A', 'D'], count: 2, tone: 'red' }, { side: ['B', 'C'], count: 2, tone: 'red' },
    ]}
  />
)

/** صفحة 38 — منقلة مصغّرة لإنشاء الزاوية 45° عند الرأس B. */
function MiniProtractor8({ degree = 45 }: { degree?: number }) {
  const cx = 160
  const cy = 150
  const r = 105
  const point = (a: number, radius = r) => ({ x: cx + radius * Math.cos((a * Math.PI) / 180), y: cy - radius * Math.sin((a * Math.PI) / 180) })
  // The known side [BA] points to the left, so the inner scale (0 on the left) is the one to read.
  const ray = point(180 - degree, r * 1.02)
  const ticks = Array.from({ length: 19 }, (_, i) => i * 10)
  return (
    <svg className="l8-protractor" viewBox="0 0 320 185" role="img" aria-label={`منقلة موضوعة على الرأس B لإنشاء زاوية ${degree} درجة مع الضلع BA`} direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} className="l8-protractor-shell" />
      {ticks.map(value => {
        const a = point(value)
        const b = point(value, value % 30 === 0 ? r - 15 : r - 8)
        return <line key={value} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={value % 30 === 0 ? 'l8-tick-major' : 'l8-tick'} />
      })}
      {[0, 30, 60, 90, 120, 150, 180].map(value => {
        const outer = point(value, r - 30)
        const inner = point(value, r - 54)
        return (
          <g key={`n-${value}`}>
            <text x={outer.x} y={outer.y + 4} textAnchor="middle" className="l8-protractor-number">{value}</text>
            <text x={inner.x} y={inner.y + 4} textAnchor="middle" className="l8-protractor-number is-inner">{180 - value}</text>
          </g>
        )
      })}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} className="l8-protractor-base" />
      <line x1={cx} y1={cy} x2={ray.x} y2={ray.y} className="l8-protractor-ray" />
      <circle cx={cx} cy={cy} r="5" className="l7-geo-vertex" />
      <text x={cx - 4} y={cy + 20} className="l7-geo-point">B</text>
      <text x={cx - r - 10} y={cy + 18} className="l7-geo-point">A</text>
      <text x={ray.x + 2} y={ray.y - 8} className="l7-geo-angle-label is-rose">{degree}°</text>
    </svg>
  )
}

/** صفحة 38 — رؤوس المعيّن المرسوم: ضلع 3cm وزاوية 45° عند B. */
const drawPts = { A: P(140, 185), B: P(290, 185), C: P(183.9, 78.9), D: P(33.9, 78.9) }

function ConstructionFigure8({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  if (step === 2) return <MiniProtractor8 />
  if (step === 1) {
    return (
      <GeoFigure
        ariaLabel="القطعة المستقيمة AB طولها 3 سنتيمتر"
        width={330} height={120}
        pts={{ A: P(140, 70), B: P(290, 70) }}
        order={['A', 'B']}
        open
        sides={[{ side: ['A', 'B'], label: '3cm' }]}
      />
    )
  }
  const order = step === 3 ? ['A', 'B', 'C'] : step === 4 ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D']
  const sides: Array<{ side: [string, string]; label: string }> = step === 3
    ? [{ side: ['A', 'B'], label: '3cm' }, { side: ['B', 'C'], label: '3cm' }]
    : step === 4
      ? [{ side: ['A', 'B'], label: '3cm' }, { side: ['B', 'C'], label: '3cm' }, { side: ['C', 'D'], label: '3cm' }]
      : [{ side: ['A', 'B'], label: '3cm' }, { side: ['B', 'C'], label: '3cm' }, { side: ['C', 'D'], label: '3cm' }, { side: ['D', 'A'], label: '3cm' }]
  return (
    <GeoFigure
      ariaLabel={step === 3 ? 'تعيين النقطة C على بعد 3 سنتيمتر من B بزاوية 45 درجة' : step === 4 ? 'رسم نصف مستقيم من C يوازي AB وتعيين النقطة D' : 'المعيّن ABCD مكتملاً، أضلاعه 3 سنتيمتر والزاوية عند B تساوي 45 درجة'}
      width={330} height={215}
      pts={drawPts}
      order={order}
      open={step !== 5}
      sides={sides}
      angles={[{ at: 'B', from: 'A', to: 'C', label: '45°', tone: 'rose', radius: 34 }]}
      marks={step === 5 ? [{ side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 }] : []}
      ticks={step === 5 ? [
        { side: ['A', 'B'], count: 1 }, { side: ['B', 'C'], count: 1 },
        { side: ['C', 'D'], count: 1 }, { side: ['D', 'A'], count: 1 },
      ] : []}
    />
  )
}

/** صفحة 39 — تحقّق من فهمك: المعيّن XYZW بضلع 4cm وزاوية 120° عند Y. */
const Fig39CheckDraw = () => (
  <GeoFigure
    ariaLabel="المعيّن XYZW، أضلاعه 4 سنتيمتر والزاوية عند Y تساوي 120 درجة"
    width={320} height={205}
    pts={{ X: P(245, 160), Y: P(125, 160), Z: P(65, 56.1), W: P(185, 56.1) }}
    order={['X', 'Y', 'Z', 'W']}
    sides={[
      { side: ['Y', 'X'], label: '4cm' }, { side: ['Y', 'Z'], label: '4cm' },
      { side: ['Z', 'W'], label: '4cm' }, { side: ['X', 'W'], label: '4cm' },
    ]}
    angles={[{ at: 'Y', from: 'X', to: 'Z', label: '120°', tone: 'rose', radius: 30 }]}
    marks={[{ side: ['Y', 'X'], count: 1 }, { side: ['Z', 'W'], count: 1 }]}
    ticks={[
      { side: ['Y', 'X'], count: 1 }, { side: ['Y', 'Z'], count: 1 },
      { side: ['Z', 'W'], count: 1 }, { side: ['X', 'W'], count: 1 },
    ]}
  />
)

/** صفحة 39 — تدرّب ①: الأشكال الستّة. */
const ex1Shapes = {
  1: {
    aria: 'الشكل 1: مستطيل عريض زواياه قائمة',
    pts: { A: P(55, 65), B: P(255, 65), C: P(255, 150), D: P(55, 150) },
    order: ['A', 'B', 'C', 'D'],
    right: [{ at: 'A', from: 'B', to: 'D' }],
    marks: [
      { side: ['A', 'B'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['D', 'C'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['B', 'C'] as [string, string], count: 1 },
      { side: ['A', 'D'] as [string, string], count: 1 },
    ],
    ticks: [] as Array<{ side: [string, string]; count: number }>,
    names: ['رباعي', 'متوازي أضلاع', 'مستطيل'],
  },
  2: {
    aria: 'الشكل 2: متوازي أضلاع مائل',
    pts: { A: P(110, 55), B: P(270, 55), C: P(220, 150), D: P(60, 150) },
    order: ['A', 'B', 'C', 'D'],
    right: [],
    marks: [
      { side: ['A', 'B'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['D', 'C'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['B', 'C'] as [string, string], count: 1 },
      { side: ['A', 'D'] as [string, string], count: 1 },
    ],
    ticks: [] as Array<{ side: [string, string]; count: number }>,
    names: ['رباعي', 'متوازي أضلاع'],
  },
  3: {
    aria: 'الشكل 3: مستطيل شاقولي ضيّق زواياه قائمة',
    pts: { A: P(115, 35), B: P(205, 35), C: P(205, 175), D: P(115, 175) },
    order: ['A', 'B', 'C', 'D'],
    right: [{ at: 'A', from: 'B', to: 'D' }],
    marks: [
      { side: ['B', 'C'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['A', 'D'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['A', 'B'] as [string, string], count: 1 },
      { side: ['D', 'C'] as [string, string], count: 1 },
    ],
    ticks: [] as Array<{ side: [string, string]; count: number }>,
    names: ['رباعي', 'متوازي أضلاع', 'مستطيل'],
  },
  4: {
    aria: 'الشكل 4: معيّن أضلاعه الأربعة متساوية وعليها علامة تساوٍ',
    pts: { T: P(155, 35), R: P(210, 105), B: P(155, 175), L: P(100, 105) },
    order: ['T', 'R', 'B', 'L'],
    right: [],
    marks: [
      { side: ['L', 'T'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['B', 'R'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['T', 'R'] as [string, string], count: 1 },
      { side: ['L', 'B'] as [string, string], count: 1 },
    ],
    ticks: [
      { side: ['T', 'L'] as [string, string], count: 1 }, { side: ['T', 'R'] as [string, string], count: 1 },
      { side: ['B', 'L'] as [string, string], count: 1 }, { side: ['B', 'R'] as [string, string], count: 1 },
    ],
    names: ['رباعي', 'متوازي أضلاع', 'معيّن'],
  },
  5: {
    aria: 'الشكل 5: متوازي أضلاع منبسط عريض',
    pts: { A: P(95, 70), B: P(275, 70), C: P(225, 140), D: P(45, 140) },
    order: ['A', 'B', 'C', 'D'],
    right: [],
    marks: [
      { side: ['A', 'B'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['D', 'C'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['B', 'C'] as [string, string], count: 1 },
      { side: ['A', 'D'] as [string, string], count: 1 },
    ],
    ticks: [] as Array<{ side: [string, string]; count: number }>,
    names: ['رباعي', 'متوازي أضلاع'],
  },
  6: {
    aria: 'الشكل 6: متوازي أضلاع مائل وممتدّ، ضلعاه المتجاوران مختلفان بوضوح',
    pts: { A: P(45, 175), B: P(120, 70), C: P(275, 30), D: P(200, 135) },
    order: ['A', 'B', 'C', 'D'],
    right: [],
    marks: [
      { side: ['B', 'C'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['A', 'D'] as [string, string], count: 2, tone: 'red' as const },
      { side: ['A', 'B'] as [string, string], count: 1 },
      { side: ['D', 'C'] as [string, string], count: 1 },
    ],
    ticks: [] as Array<{ side: [string, string]; count: number }>,
    names: ['رباعي', 'متوازي أضلاع'],
  },
} as const

function Fig39Ex1({ variant }: { variant: keyof typeof ex1Shapes }) {
  const shape = ex1Shapes[variant]
  return (
    <GeoFigure
      ariaLabel={shape.aria}
      width={320} height={205}
      pts={shape.pts}
      order={[...shape.order]}
      showLabels={false}
      marks={shape.marks.map(mark => ({ ...mark }))}
      ticks={shape.ticks.map(tick => ({ ...tick }))}
      right={shape.right.map(entry => ({ ...entry }))}
    />
  )
}

/** صفحة 39 — تدرّب ②: الخطّ المفتوح Z–Y–X مع إمكان إظهار الرأس W. */
function Fig39Ex2({ w }: { w?: Pt }) {
  const pts: Record<string, Pt> = { Z: P(160, 35), Y: P(70, 120), X: P(160, 205) }
  if (w) pts.W = w
  return (
    <GeoFigure
      ariaLabel={w ? 'الشكل XYZW بعد تعيين الرأس الرابع W' : 'الخطّ المفتوح: النقاط Z ثم Y ثم X، والضلعان YZ و YX متساويان'}
      width={300} height={240}
      pts={pts}
      order={w ? ['X', 'Y', 'Z', 'W'] : ['Z', 'Y', 'X']}
      open={!w}
      ticks={[{ side: ['Y', 'X'], count: 1 }, { side: ['Y', 'Z'], count: 1 }, ...(w ? [
        { side: ['Z', 'W'] as [string, string], count: 1 },
        { side: ['X', 'W'] as [string, string], count: 1 },
      ] : [])]}
      marks={w ? [
        { side: ['Y', 'X'], count: 1 }, { side: ['Z', 'W'], count: 1 },
        { side: ['Y', 'Z'], count: 2, tone: 'red' }, { side: ['X', 'W'], count: 2, tone: 'red' },
      ] : []}
    />
  )
}

/** صفحة 39 — تدرّب ③: الشكل المركّب AFED (معيّن) و FBCE (متوازي أضلاع). */
function Fig39Ex3({ showLengths = false }: { showLengths?: boolean }) {
  const p = { A: P(70, 50), F: P(148, 50), B: P(278, 50), D: P(45.4, 124), E: P(123.4, 124), C: P(253.4, 124) }
  const line = (a: Pt, b: Pt, cls = 'l7-geo-edge') => <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={cls} />
  return (
    <svg className="l8-composite" viewBox="0 0 330 185" role="img" aria-label="الشكل المركّب: المعيّن AFED إلى اليسار ومتوازي الأضلاع FBCE إلى اليمين، والضلع FE مشترك بينهما" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <path d={`M ${p.A.x} ${p.A.y} L ${p.F.x} ${p.F.y} L ${p.E.x} ${p.E.y} L ${p.D.x} ${p.D.y} Z`} className="l8-region is-rhombus" />
      <path d={`M ${p.F.x} ${p.F.y} L ${p.B.x} ${p.B.y} L ${p.C.x} ${p.C.y} L ${p.E.x} ${p.E.y} Z`} className="l8-region is-para" />
      {line(p.A, p.F)}{line(p.F, p.B)}{line(p.D, p.E)}{line(p.E, p.C)}
      {line(p.A, p.D)}{line(p.F, p.E, 'l7-geo-edge is-shared')}{line(p.B, p.C)}
      {showLengths && <>
        <text x={(p.A.x + p.F.x) / 2} y={p.A.y - 10} textAnchor="middle" className="l7-geo-side-label">3cm</text>
        <text x={(p.F.x + p.B.x) / 2} y={p.F.y - 10} textAnchor="middle" className="l7-geo-side-label">5cm</text>
        <text x={(p.A.x + p.D.x) / 2 - 18} y={(p.A.y + p.D.y) / 2 + 4} textAnchor="middle" className="l7-geo-side-label">3cm</text>
        <text x={(p.B.x + p.C.x) / 2 + 20} y={(p.B.y + p.C.y) / 2 + 4} textAnchor="middle" className="l7-geo-side-label">3cm</text>
      </>}
      {([['A', p.A, -6, -12], ['F', p.F, 2, -12], ['B', p.B, 10, -10], ['D', p.D, -12, 16], ['E', p.E, 0, 18], ['C', p.C, 12, 16]] as Array<[string, Pt, number, number]>).map(
        ([name, at, dx, dy]) => <text key={name} x={at.x + dx} y={at.y + dy} textAnchor="middle" className="l7-geo-point">{name}</text>,
      )}
      {[p.A, p.F, p.B, p.D, p.E, p.C].map((pt, index) => <circle key={index} cx={pt.x} cy={pt.y} r="3.4" className="l7-geo-vertex" />)}
    </svg>
  )
}

/* ------------------------------------------------------------- activities  */

/** نشاط ① — فرز أشكال الانطلاقة النشطة في خطوتين: توازٍ ثم تساوي الأضلاع. */
function ShapeSorter8() {
  const shapes = useMemo(() => ([
    { key: '1', node: <Fig36Start1 />, isPara: false, equal: false, why: 'سهم مفرد على الضلعين العلوي والسفلي فقط: مجموعة توازٍ واحدة، فهو شبه منحرف.' },
    { key: '2', node: <Fig36Start2 />, isPara: true, equal: true, why: 'نوعان من الأسهم ⇐ متوازي أضلاع، والقياس يعطي أضلاعاً متساوية ⇐ معيّن.' },
    { key: '3', node: <Fig36Start3 />, isPara: true, equal: false, why: 'متوازي أضلاع (مستطيل)، لكن الضلع العلوي أطول من الجانبي ⇐ ليس معيّناً.' },
    { key: '4', node: <Fig36Start4 />, isPara: true, equal: true, why: 'نوعان من الأسهم ⇐ متوازي أضلاع، والأضلاع الأربعة متساوية ⇐ معيّن.' },
  ]), [])
  const [stage, setStage] = useState<'para' | 'equal'>('para')
  const [choice, setChoice] = useState<Record<string, boolean>>({})
  const current = shapes.filter(shape => stage === 'para' || shape.isPara)
  const correct = current.filter(shape => choice[`${stage}-${shape.key}`] === (stage === 'para' ? shape.isPara : shape.equal)).length
  const answered = current.filter(shape => choice[`${stage}-${shape.key}`] !== undefined).length

  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · فرز الأشكال</span>
        <h4><Shapes size={17} /> {stage === 'para' ? 'الخطوة 1: أيّها متوازي أضلاع؟' : 'الخطوة 2: أيّها تساوت أضلاعه؟'}</h4>
      </div>
      <p className="l8-panel-hint">
        {stage === 'para'
          ? 'اقرأ الأسهم أوّلاً: إذا حمل الشكل نوعين مختلفين من الأسهم فهو متوازي أضلاع.'
          : 'بقيت متوازيات الأضلاع فقط. استعمل «المسطرة» الذهنية: هل الضلعان المتجاوران متساويان؟'}
      </p>
      <div className="l8-sorter-grid">
        {current.map(shape => {
          const key = `${stage}-${shape.key}`
          const picked = choice[key]
          const expected = stage === 'para' ? shape.isPara : shape.equal
          return (
            <div className={`l8-shape-card ${picked === undefined ? '' : picked === expected ? 'is-right' : 'is-wrong'}`} key={key}>
              <span className="l8-shape-index">الشكل ({shape.key})</span>
              {shape.node}
              <div className="l8-shape-buttons">
                <button type="button" aria-pressed={picked === true} onClick={() => setChoice({ ...choice, [key]: true })}>نعم</button>
                <button type="button" aria-pressed={picked === false} onClick={() => setChoice({ ...choice, [key]: false })}>لا</button>
              </div>
              {picked !== undefined && <p className="l8-shape-why"><BidiText>{shape.why}</BidiText></p>}
            </div>
          )
        })}
      </div>
      <div className="l8-panel-foot">
        <span>أجبت عن <MathExpression>{answered}</MathExpression> من <MathExpression>{current.length}</MathExpression> — الصحيح: <MathExpression>{correct}</MathExpression></span>
        <div className="l8-panel-actions">
          {stage === 'para'
            ? <button type="button" onClick={() => setStage('equal')}>انتقل إلى الخطوة 2 <MoveRight size={14} /></button>
            : <button type="button" onClick={() => setStage('para')}><RotateCcw size={14} /> عُد إلى الخطوة 1</button>}
          <button type="button" onClick={() => setChoice({})}><RotateCcw size={14} /> إعادة</button>
        </div>
      </div>
    </div>
  )
}

/** نشاط ② — مختبر المعيّن: غيّر طول الضلع المجاور والزاوية وراقب متى يصير الشكل معيّناً. */
function RhombusLab() {
  const [side, setSide] = useState(2)
  const [angle, setAngle] = useState(70)
  const unit = 32
  const a = 3
  const rad = ((180 - angle) * Math.PI) / 180
  const raw = {
    A: P(0, 0),
    B: P(a * unit, 0),
    C: P(a * unit + side * unit * Math.cos(rad), -side * unit * Math.sin(rad)),
    D: P(side * unit * Math.cos(rad), -side * unit * Math.sin(rad)),
  }
  const xs = Object.values(raw).map(point => point.x)
  const ys = Object.values(raw).map(point => point.y)
  const dx = 55 - Math.min(...xs)
  const dy = 45 - Math.min(...ys)
  const pts = Object.fromEntries(Object.entries(raw).map(([name, point]) => [name, P(point.x + dx, point.y + dy)]))
  const isRhombus = Math.abs(side - a) < 0.001
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · مختبر المعيّن</span>
        <h4><Diamond size={17} /> متى يصير متوازي الأضلاع معيّناً؟</h4>
      </div>
      <p className="l8-panel-hint">الضلع <MathExpression>AB = 3cm</MathExpression> ثابت. حرّك الضلع المجاور <MathExpression>BC</MathExpression> والزاوية، ولاحظ متى تظهر بطاقة «معيّن».</p>
      <div className="l8-lab">
        <div className="l8-lab-controls">
          <label>
            <span>طول الضلع المجاور <MathExpression>BC</MathExpression>: <MathExpression>{side.toFixed(1)}cm</MathExpression></span>
            <input type="range" min={1.5} max={4.5} step={0.5} value={side} onChange={event => setSide(Number(event.target.value))} aria-label="طول الضلع المجاور بالسنتيمتر" />
          </label>
          <label>
            <span>قياس الزاوية عند <MathExpression>B</MathExpression>: <MathExpression>{angle}°</MathExpression></span>
            <input type="range" min={40} max={140} step={5} value={angle} onChange={event => setAngle(Number(event.target.value))} aria-label="قياس الزاوية عند الرأس B بالدرجات" />
          </label>
          <button type="button" className="l8-lab-shortcut" onClick={() => setSide(3)}>اجعل <MathExpression>BC = 3cm</MathExpression></button>
        </div>
        <div className="l8-lab-stage">
          <GeoFigure
            ariaLabel={`متوازي أضلاع ضلعاه 3 سنتيمتر و${side} سنتيمتر وزاويته ${angle} درجة`}
            width={320} height={220}
            pts={pts}
            order={['A', 'B', 'C', 'D']}
            sides={[{ side: ['A', 'B'], label: '3cm' }, { side: ['B', 'C'], label: `${side.toFixed(1)}cm` }]}
            angles={[{ at: 'B', from: 'A', to: 'C', label: `${angle}°`, tone: 'rose', radius: 28 }]}
            marks={[
              { side: ['A', 'B'], count: 1 }, { side: ['D', 'C'], count: 1 },
              { side: ['A', 'D'], count: 2, tone: 'red' }, { side: ['B', 'C'], count: 2, tone: 'red' },
            ]}
          />
          <p className={`l8-verdict ${isRhombus ? 'is-yes' : 'is-no'}`}>
            {isRhombus
              ? <><Check size={16} /> ضلعان متجاوران متساويان (<MathExpression>3cm = 3cm</MathExpression>) ⇐ الشكل معيّن، وأضلاعه الأربعة <MathExpression>3cm</MathExpression>.</>
              : <><CircleAlert size={16} /> الضلعان المتجاوران مختلفان (<MathExpression>{`3cm ≠ ${side.toFixed(1)}cm`}</MathExpression>) ⇐ متوازي أضلاع فقط، وليس معيّناً.</>}
          </p>
          <p className="l8-lab-note">لاحظ أنّ تغيير <strong>الزاوية</strong> وحده لا يجعل الشكل معيّناً أبداً؛ المعيار هو <strong>الأطوال</strong>.</p>
        </div>
      </div>
    </div>
  )
}

/** نشاط ③ — كاشف المعيّن: سؤالان بالترتيب لكل شكل من أشكال صفحة 37. */
function RhombusDetector() {
  const cases = useMemo(() => ([
    { key: 'a', node: <Fig37Check1A />, para: true, equal: true, verdict: 'معيّن', why: 'متوازي أضلاع + ضلعان متجاوران متساويان ⇐ معيّن.' },
    { key: 'b', node: <Fig37Check1B />, para: true, equal: true, verdict: 'معيّن', why: 'المربّع متوازي أضلاع وأضلاعه متساوية ⇐ معيّن زواياه قائمة.' },
    { key: 'c', node: <Fig37Check2A />, para: true, equal: false, verdict: 'ليس معيّناً', why: 'متوازي أضلاع لكن 3cm ≠ 2cm ⇐ ليس معيّناً.' },
    { key: 'd', node: <Fig37Check2B />, para: false, equal: true, verdict: 'ليس معيّناً', why: 'زوج توازٍ واحد فقط ⇐ ليس متوازي أضلاع أصلاً، فلا يكون معيّناً.' },
    { key: 'e', node: <Fig37Check2C />, para: false, equal: false, verdict: 'ليس معيّناً', why: 'لا يوجد توازٍ، والتساوي بين ضلعين متجاورين في كل زوج بقيمتين مختلفتين.' },
  ]), [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const item = cases[index]
  const paraKey = `${item.key}-para`
  const equalKey = `${item.key}-equal`
  const paraAnswered = answers[paraKey] !== undefined
  const bothAnswered = paraAnswered && answers[equalKey] !== undefined
  const allRight = answers[paraKey] === item.para && answers[equalKey] === item.equal

  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · كاشف المعيّن</span>
        <h4><Target size={17} /> سؤالان فقط يكفيان للحكم</h4>
      </div>
      <p className="l8-panel-hint">الشكل <MathExpression>{index + 1}</MathExpression> من <MathExpression>{cases.length}</MathExpression>: أجب عن السؤالين بالترتيب، ثم اقرأ الحكم.</p>
      <div className="l8-detector">
        <div className="l8-detector-figure">{item.node}</div>
        <div className="l8-detector-questions">
          <div className="l8-detector-q">
            <strong>1) هل كلّ ضلعين متقابلين متوازيان؟</strong>
            <div className="l8-shape-buttons">
              <button type="button" aria-pressed={answers[paraKey] === true} onClick={() => setAnswers({ ...answers, [paraKey]: true })}>نعم</button>
              <button type="button" aria-pressed={answers[paraKey] === false} onClick={() => setAnswers({ ...answers, [paraKey]: false })}>لا</button>
            </div>
          </div>
          <div className={`l8-detector-q ${paraAnswered ? '' : 'is-locked'}`}>
            <strong>2) هل الضلعان المتجاوران متساويان في الطول؟</strong>
            <div className="l8-shape-buttons">
              <button type="button" disabled={!paraAnswered} aria-pressed={answers[equalKey] === true} onClick={() => setAnswers({ ...answers, [equalKey]: true })}>نعم</button>
              <button type="button" disabled={!paraAnswered} aria-pressed={answers[equalKey] === false} onClick={() => setAnswers({ ...answers, [equalKey]: false })}>لا</button>
            </div>
          </div>
          {bothAnswered && (
            <div className={`l8-detector-verdict ${allRight ? 'is-right' : 'is-wrong'}`}>
              <strong>الحكم الصحيح: {item.verdict}</strong>
              <p><BidiText>{item.why}</BidiText></p>
              {!allRight && <p className="l8-detector-fix">راجع إجابتك: الصواب أن الجواب عن السؤال الأوّل «{item.para ? 'نعم' : 'لا'}» وعن الثاني «{item.equal ? 'نعم' : 'لا'}».</p>}
            </div>
          )}
        </div>
      </div>
      <div className="l8-panel-foot">
        <div className="l8-panel-actions">
          <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>الشكل السابق</button>
          <button type="button" disabled={index === cases.length - 1} onClick={() => setIndex(index + 1)}>الشكل التالي <MoveRight size={14} /></button>
          <button type="button" onClick={() => setAnswers({})}><RotateCcw size={14} /> إعادة</button>
        </div>
      </div>
    </div>
  )
}

/** نشاط ④ — مختبر الخواصّ: زاوية متحرّكة تُظهر ثبات الأضلاع وتساوي الزوايا المتقابلة. */
function PropertyLab() {
  const [angle, setAngle] = useState(60)
  const unit = 28
  const s = 4
  const rad = (angle * Math.PI) / 180
  const raw = {
    A: P(0, 0),
    B: P(s * unit, 0),
    C: P(s * unit + s * unit * Math.cos(rad), -s * unit * Math.sin(rad)),
    D: P(s * unit * Math.cos(rad), -s * unit * Math.sin(rad)),
  }
  const xs = Object.values(raw).map(point => point.x)
  const ys = Object.values(raw).map(point => point.y)
  const dx = 55 - Math.min(...xs)
  const dy = 50 - Math.min(...ys)
  const pts = Object.fromEntries(Object.entries(raw).map(([name, point]) => [name, P(point.x + dx, point.y + dy)]))
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · مختبر الخواصّ</span>
        <h4><Sparkles size={17} /> ما الذي يتغيّر وما الذي يبقى؟</h4>
      </div>
      <p className="l8-panel-hint">حرّك الزاوية ولاحظ: الأضلاع الأربعة تبقى <MathExpression>4cm</MathExpression> دائماً، والزاويتان المتقابلتان تبقيان متساويتين.</p>
      <div className="l8-lab">
        <div className="l8-lab-controls">
          <label>
            <span>قياس الزاوية <MathExpression>{'Â'}</MathExpression>: <MathExpression>{angle}°</MathExpression></span>
            <input type="range" min={30} max={150} step={10} value={angle} onChange={event => setAngle(Number(event.target.value))} aria-label="قياس الزاوية A بالدرجات" />
          </label>
          <ul className="l8-lab-readout">
            <li>الأضلاع: <MathExpression>AB = BC = CD = DA = 4cm</MathExpression></li>
            <li>الزاويتان المتقابلتان: <MathExpression>{`Â = Ĉ = ${angle}°`}</MathExpression></li>
            <li>الزاويتان المتقابلتان الأخريان: <MathExpression>{`B̂ = D̂ = ${180 - angle}°`}</MathExpression></li>
            <li>المحيط: <MathExpression>4 × 4 = 16cm</MathExpression> (لا يتغيّر)</li>
          </ul>
        </div>
        <div className="l8-lab-stage">
          <GeoFigure
            ariaLabel={`معيّن ضلعه 4 سنتيمتر وزاويته ${angle} درجة`}
            width={330} height={240}
            pts={pts}
            order={['A', 'B', 'C', 'D']}
            sides={[
              { side: ['A', 'B'], label: '4cm' }, { side: ['B', 'C'], label: '4cm' },
              { side: ['C', 'D'], label: '4cm' }, { side: ['D', 'A'], label: '4cm' },
            ]}
            angles={[
              { at: 'A', from: 'B', to: 'D', label: `${angle}°`, tone: 'rose', radius: 26 },
              { at: 'C', from: 'D', to: 'B', label: `${angle}°`, tone: 'rose', radius: 26 },
            ]}
            ticks={[
              { side: ['A', 'B'], count: 1 }, { side: ['B', 'C'], count: 1 },
              { side: ['C', 'D'], count: 1 }, { side: ['D', 'A'], count: 1 },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

/** نشاط ⑤ — إكمال فراغات تحقّق ③ في صفحة 37. */
function FillBlanks8() {
  const blanks = useMemo(() => ([
    { id: 'bc', label: 'BC =', answer: '5', unit: 'cm' },
    { id: 'cd', label: 'CD =', answer: '5', unit: 'cm' },
    { id: 'da', label: 'DA =', answer: '5', unit: 'cm' },
    { id: 'angle-c', label: 'Ĉ =', answer: '50', unit: '°' },
    { id: 'angle-d', label: 'D̂ =', answer: '130', unit: '°' },
  ]), [])
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const normalize = (value: string) => value.replace(/[^\d]/g, '')
  const correct = blanks.filter(blank => normalize(values[blank.id] ?? '') === blank.answer).length
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · أكمل بنفسك</span>
        <h4><PencilRuler size={17} /> طبّق الخواصّ الثلاث على المعيّن <MathExpression>ABCD</MathExpression></h4>
      </div>
      <p className="l8-panel-hint">اكتب العدد فقط. استعمل خاصّة الأضلاع للأطوال، وخاصّة الزوايا المتقابلة للقياسات.</p>
      <div className="l8-blanks">
        {blanks.map(blank => {
          const ok = normalize(values[blank.id] ?? '') === blank.answer
          return (
            <label key={blank.id} className={checked ? (ok ? 'is-right' : 'is-wrong') : ''}>
              <span className="l8-blank-label"><MathExpression>{blank.label}</MathExpression></span>
              <input
                dir="ltr"
                inputMode="numeric"
                aria-label={`القيمة المطلوبة: ${blank.label}`}
                value={values[blank.id] ?? ''}
                onChange={event => setValues({ ...values, [blank.id]: event.target.value })}
              />
              <span className="l8-blank-unit"><MathExpression>{blank.unit}</MathExpression></span>
            </label>
          )
        })}
      </div>
      <div className="l8-panel-foot">
        <div className="l8-panel-actions">
          <button type="button" onClick={() => setChecked(true)}>تحقّق <Check size={14} /></button>
          <button type="button" onClick={() => { setValues({}); setChecked(false) }}><RotateCcw size={14} /> إعادة</button>
        </div>
        {checked && <span className="l8-score">صحيح: <MathExpression>{correct} / {blanks.length}</MathExpression></span>}
      </div>
      {checked && correct < blanks.length && (
        <p className="l8-panel-help">تذكّر: الأضلاع الأربعة تساوي <MathExpression>AB = 5cm</MathExpression>؛ و<MathExpression>{'Ĉ'}</MathExpression> تقابل <MathExpression>{'Â'}</MathExpression> و<MathExpression>{'D̂'}</MathExpression> تقابل <MathExpression>{'B̂'}</MathExpression>.</p>
      )}
    </div>
  )
}

/** نشاط ⑥ — مشغّل خطوات الرسم الخمس في صفحة 38. */
function ConstructionPlayer8() {
  const steps = [
    { step: 1 as const, title: 'نرسم [AB] طولها 3cm', detail: 'ضع التدريج 0 عند A وعلّم B عند 3cm.' },
    { step: 2 as const, title: 'ننشئ زاوية 45° عند B', detail: 'مركز المنقلة على B، وخط الصفر على [BA]، ثم علّم 45° على التدريج الذي يبدأ من الصفر نفسه.' },
    { step: 3 as const, title: 'نعيّن C بحيث BC = 3cm', detail: 'الضلعان المتجاوران متساويان؛ هنا يولد المعيّن.' },
    { step: 4 as const, title: 'من C نرسم موازياً لـ AB ونعيّن D بحيث CD = 3cm', detail: 'الضلع المقابل يوازي الأوّل ويساويه.' },
    { step: 5 as const, title: 'نغلق الشكل ونتحقّق أنّ AD = 3cm', detail: 'الضلع الأخير يصل D بـ A، والقياس يثبت أنّ الشكل معيّن.' },
  ]
  const [active, setActive] = useState(0)
  const current = steps[active]
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · مشغّل الرسم</span>
        <h4><Ruler size={17} /> نفّذ الخطوات الخمس خطوة خطوة</h4>
      </div>
      <ol className="l8-player-track">
        {steps.map((entry, index) => (
          <li key={entry.step}>
            <button type="button" className={index === active ? 'is-active' : index < active ? 'is-done' : ''} aria-current={index === active ? 'step' : undefined} onClick={() => setActive(index)}>
              <span>{entry.step}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="l8-player-stage">
        <ConstructionFigure8 step={current.step} />
        <div className="l8-player-copy">
          <strong><BidiText>{current.title}</BidiText></strong>
          <p><BidiText>{current.detail}</BidiText></p>
        </div>
      </div>
      <div className="l8-panel-foot">
        <div className="l8-panel-actions">
          <button type="button" disabled={active === 0} onClick={() => setActive(active - 1)}>السابقة</button>
          <button type="button" disabled={active === steps.length - 1} onClick={() => setActive(active + 1)}>التالية <MoveRight size={14} /></button>
        </div>
        <span className="l8-score">الخطوة <MathExpression>{active + 1} / {steps.length}</MathExpression></span>
      </div>
    </div>
  )
}

/** نشاط ⑦ — مخطّط الزوايا: من زاوية معطاة إلى زوايا المعيّن الأربع. */
function AnglePlanner() {
  const [given, setGiven] = useState(120)
  const other = 180 - given
  const [guess, setGuess] = useState('')
  const [checked, setChecked] = useState(false)
  const ok = guess.replace(/[^\d]/g, '') === String(other)
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · مخطّط الزوايا</span>
        <h4><Target size={17} /> زاوية واحدة تكفي لمعرفة الزوايا الأربع</h4>
      </div>
      <p className="l8-panel-hint">اختر قياس الزاوية المعطاة عند <MathExpression>Y</MathExpression>، ثم احسب الزاوية المجاورة لها عند <MathExpression>X</MathExpression>.</p>
      <div className="l8-lab">
        <div className="l8-lab-controls">
          <label>
            <span>الزاوية المعطاة عند <MathExpression>Y</MathExpression>: <MathExpression>{given}°</MathExpression></span>
            <input type="range" min={60} max={140} step={10} value={given} onChange={event => { setGiven(Number(event.target.value)); setChecked(false) }} aria-label="قياس الزاوية المعطاة بالدرجات" />
          </label>
          <label className={`l8-guess ${checked ? (ok ? 'is-right' : 'is-wrong') : ''}`}>
            <span>الزاوية المجاورة عند <MathExpression>X</MathExpression> تساوي:</span>
            <input dir="ltr" inputMode="numeric" aria-label="قياس الزاوية المجاورة بالدرجات" value={guess} onChange={event => { setGuess(event.target.value); setChecked(false) }} />
          </label>
          <button type="button" onClick={() => setChecked(true)}>تحقّق <Check size={14} /></button>
          {checked && (
            <p className="l8-panel-help">
              {ok
                ? <>أحسنت: الزاويتان المتتاليتان مجموعهما <MathExpression>180°</MathExpression>، إذن <MathExpression>{`${given}° + ${other}° = 180°`}</MathExpression>.</>
                : <>راجع: الزاويتان المتتاليتان في المعيّن مجموعهما <MathExpression>180°</MathExpression>، إذن الجواب <MathExpression>{`${other}°`}</MathExpression>.</>}
            </p>
          )}
        </div>
        <div className="l8-lab-stage">
          <ul className="l8-lab-readout">
            <li>الزاويتان المتقابلتان: <MathExpression>{`Ŷ = Ŵ = ${given}°`}</MathExpression></li>
            <li>الزاويتان المتقابلتان الأخريان: <MathExpression>{`X̂ = Ẑ = ${other}°`}</MathExpression></li>
            <li>المجموع: <MathExpression>{`2 × ${given}° + 2 × ${other}° = 360°`}</MathExpression></li>
          </ul>
          <Fig39CheckDraw />
        </div>
      </div>
    </div>
  )
}

/** نشاط ⑧ — سمِّ الشكل: كل الأسماء المناسبة لأشكال تدرّب ①. */
function NameTheShape() {
  const names = ['رباعي', 'متوازي أضلاع', 'مستطيل', 'معيّن']
  const order: Array<keyof typeof ex1Shapes> = [1, 2, 3, 4, 5, 6]
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<Record<string, string[]>>({})
  const [checked, setChecked] = useState(false)
  const variant = order[index]
  const key = String(variant)
  const expected = [...ex1Shapes[variant].names]
  const selection = picked[key] ?? []
  const toggle = (name: string) => {
    const next = selection.includes(name) ? selection.filter(entry => entry !== name) : [...selection, name]
    setPicked({ ...picked, [key]: next })
    setChecked(false)
  }
  const isRight = expected.length === selection.length && expected.every(name => selection.includes(name))
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · سمِّ الشكل</span>
        <h4><BookOpenCheck size={17} /> اكتب كلّ الأسماء التي تناسب الشكل</h4>
      </div>
      <p className="l8-panel-hint">الشكل <MathExpression>{index + 1}</MathExpression> من <MathExpression>6</MathExpression> — الأسماء متداخلة: كل مستطيل متوازي أضلاع، وكل متوازي أضلاع رباعي.</p>
      <div className="l8-detector">
        <div className="l8-detector-figure"><Fig39Ex1 variant={variant} /></div>
        <div className="l8-detector-questions">
          <div className="l8-name-grid">
            {names.map(name => (
              <button key={name} type="button" aria-pressed={selection.includes(name)} className={selection.includes(name) ? 'is-selected' : ''} onClick={() => toggle(name)}>{name}</button>
            ))}
          </div>
          <div className="l8-panel-actions">
            <button type="button" onClick={() => setChecked(true)}>تحقّق <Check size={14} /></button>
            <button type="button" onClick={() => { setPicked({ ...picked, [key]: [] }); setChecked(false) }}><RotateCcw size={14} /> مسح</button>
          </div>
          {checked && (
            <div className={`l8-detector-verdict ${isRight ? 'is-right' : 'is-wrong'}`}>
              <strong>{isRight ? 'إجابة صحيحة' : 'راجع إجابتك'}</strong>
              <p>الأسماء الصحيحة: <BidiText>{expected.join(' ، ')}</BidiText>.</p>
            </div>
          )}
        </div>
      </div>
      <div className="l8-panel-foot">
        <div className="l8-panel-actions">
          <button type="button" disabled={index === 0} onClick={() => { setIndex(index - 1); setChecked(false) }}>الشكل السابق</button>
          <button type="button" disabled={index === order.length - 1} onClick={() => { setIndex(index + 1); setChecked(false) }}>الشكل التالي <MoveRight size={14} /></button>
        </div>
      </div>
    </div>
  )
}

/** نشاط ⑨ — تعيين الرأس الرابع W في تدرّب ②. */
function FourthVertexActivity8() {
  const options = useMemo(() => ([
    { id: 'a', point: P(250, 120), right: true, why: 'هذه هي النقطة الصحيحة: ZW ∥ YX و ZW = YX، و XW ∥ YZ و XW = YZ، فالأضلاع الأربعة متساوية.' },
    { id: 'b', point: P(230, 75), right: false, why: 'هنا ZW أقصر من YX، فالشكل الناتج ليس معيّناً (ولا متوازي أضلاع).' },
    { id: 'c', point: P(115, 120), right: false, why: 'هذه النقطة تقع بين الضلعين، فينتج شكل متقاطع لا رباعي بسيط.' },
  ]), [])
  const [choice, setChoice] = useState<string | null>(null)
  const picked = options.find(option => option.id === choice)
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · الرأس الرابع</span>
        <h4><Diamond size={17} /> أين تقع النقطة <MathExpression>W</MathExpression>؟</h4>
      </div>
      <p className="l8-panel-hint">اختر موضع <MathExpression>W</MathExpression> ثم شاهد الشكل الناتج واقرأ التعليل.</p>
      <div className="l8-detector">
        <div className="l8-detector-figure"><Fig39Ex2 w={picked?.point} /></div>
        <div className="l8-detector-questions">
          <div className="l8-name-grid">
            {options.map((option, index) => (
              <button key={option.id} type="button" aria-pressed={choice === option.id} className={choice === option.id ? 'is-selected' : ''} onClick={() => setChoice(option.id)}>
                الاحتمال {index + 1}
              </button>
            ))}
          </div>
          {picked && (
            <div className={`l8-detector-verdict ${picked.right ? 'is-right' : 'is-wrong'}`}>
              <strong>{picked.right ? 'اختيار صحيح' : 'اختيار غير صحيح'}</strong>
              <p><BidiText>{picked.why}</BidiText></p>
            </div>
          )}
          <p className="l8-panel-help">القاعدة: <MathExpression>W</MathExpression> هي الرأس المقابل لـ<MathExpression>Y</MathExpression>؛ نصل إليها بموازٍ لـ<MathExpression>[YX]</MathExpression> من <MathExpression>Z</MathExpression> وموازٍ لـ<MathExpression>[YZ]</MathExpression> من <MathExpression>X</MathExpression>.</p>
        </div>
      </div>
    </div>
  )
}

/** نشاط ⑩ — حلّ الشكل المركّب في تدرّب ③ بالتتابع. */
function CompositeSolver() {
  const questions = useMemo(() => ([
    { id: 'bc', text: 'طول [BC] بالسنتيمتر', answer: '3', why: 'FE ضلع في المعيّن ⇐ FE = 3cm، و[BC] يقابل [FE] في متوازي الأضلاع ⇐ BC = 3cm.' },
    { id: 'af', text: 'طول [AF] بالسنتيمتر', answer: '3', why: 'AFED معيّن ⇐ أضلاعه الأربعة متساوية ⇐ AF = AD = 3cm.' },
    { id: 'ab', text: 'طول [AB] بالسنتيمتر', answer: '8', why: 'النقطة F بين A و B ⇐ AB = AF + FB = 3 + 5 = 8cm.' },
  ]), [])
  const [values, setValues] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · الشكلان المتجاوران</span>
        <h4><Lightbulb size={17} /> تتبّع الضلع المشترك <MathExpression>[FE]</MathExpression></h4>
      </div>
      <Fig39Ex3 showLengths />
      <div className="l8-composite-questions">
        {questions.map((question, index) => {
          const value = (values[question.id] ?? '').replace(/[^\d]/g, '')
          const ok = value === question.answer
          return (
            <div className={`l8-composite-q ${revealed[question.id] ? (ok ? 'is-right' : 'is-wrong') : ''}`} key={question.id}>
              <label>
                <span>{index + 1}) <BidiText>{question.text}</BidiText></span>
                <input dir="ltr" inputMode="numeric" aria-label={question.text} value={values[question.id] ?? ''} onChange={event => setValues({ ...values, [question.id]: event.target.value })} />
              </label>
              <button type="button" onClick={() => setRevealed({ ...revealed, [question.id]: true })}>تحقّق</button>
              {revealed[question.id] && (
                <p className="l8-composite-why">
                  {ok ? <Check size={14} /> : <CircleAlert size={14} />} <BidiText>{question.why}</BidiText>
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** نشاط ⑪ — صيد الأخطاء: عبارات شائعة عن المعيّن. */
function ErrorHunt8() {
  const claims = useMemo(() => ([
    { id: 'c1', text: 'كل معيّن مستطيل.', correct: false, why: 'المعيّن يشترط تساوي الأضلاع، والمستطيل يشترط الزوايا القائمة؛ ولا يجتمعان إلّا في المربّع.' },
    { id: 'c2', text: 'كل مربّع معيّن.', correct: true, why: 'المربّع متوازي أضلاع وأضلاعه الأربعة متساوية، فينطبق عليه تعريف المعيّن تماماً.' },
    { id: 'c3', text: 'كل شكل رباعي فيه ضلعان متجاوران متساويان هو معيّن.', correct: false, why: 'لا بدّ أن يكون متوازي أضلاع أوّلاً؛ شبه المنحرف والدالية في صفحة 37 مثالان مضادّان.' },
    { id: 'c4', text: 'في المعيّن تكفي معرفة طول ضلع واحد لحساب المحيط.', correct: true, why: 'الأضلاع الأربعة متساوية، إذن المحيط = 4 × الضلع.' },
  ]), [])
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  return (
    <div className="l8-panel">
      <div className="l8-panel-head">
        <span className="section-kicker">نشاط المنصّة · صيد الأخطاء</span>
        <h4><CircleAlert size={17} /> صحيحة أم خاطئة؟</h4>
      </div>
      <ul className="l8-claims">
        {claims.map(claim => {
          const picked = answers[claim.id]
          return (
            <li key={claim.id} className={picked === undefined ? '' : picked === claim.correct ? 'is-right' : 'is-wrong'}>
              <p><BidiText>{claim.text}</BidiText></p>
              <div className="l8-shape-buttons">
                <button type="button" aria-pressed={picked === true} onClick={() => setAnswers({ ...answers, [claim.id]: true })}>صحيحة</button>
                <button type="button" aria-pressed={picked === false} onClick={() => setAnswers({ ...answers, [claim.id]: false })}>خاطئة</button>
              </div>
              {picked !== undefined && (
                <p className="l8-claim-why">
                  <strong>{claim.correct ? 'العبارة صحيحة.' : 'العبارة خاطئة.'}</strong> <BidiText>{claim.why}</BidiText>
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ steps  */

function LaunchStep() {
  return (
    <div className="l8-step-content">
      <div className="l8-hero">
        <div className="l8-hero-badge" aria-hidden="true"><Diamond size={34} /></div>
        <div>
          <span className="section-kicker">الدرس الثامن · الوحدة الأولى</span>
          <h3>المعيّن: متوازي أضلاع ارتدى حُلّة التساوي</h3>
          <p>انظر إلى عيون الشبكة المعدنية في صورة الكتاب: كلّها أشكال مائلة متشابهة تماماً. لماذا تتكرّر بهذا الانتظام؟ لأنّ كلّ عين فيها معيّن — متوازي أضلاع تساوت أضلاعه الأربعة.</p>
        </div>
      </div>

      <div className="l8-two-col">
        <FigureFrame title="إعادة بناء شبكة الصورة" caption="القضبان المتوازية والمتساوية التباعد تصنع عيوناً متطابقة: معيّنات." zoomable>
          <MeshFigure />
        </FigureFrame>
        <div className="l8-goals">
          <h4><Target size={17} /> سنتعلّم في هذا الدرس</h4>
          <ol>
            <li>تعريف المعيّن.</li>
            <li>خواصّ المعيّن.</li>
            <li>رسم المعيّن.</li>
          </ol>
          <p className="l8-goals-note">الدرس الأخير في الوحدة الأولى، ويبني مباشرة على درس متوازي الأضلاع.</p>
        </div>
      </div>

      <div className="l8-prereq">
        <h4><BookOpenCheck size={17} /> قبل أن نبدأ: ثلاث معلومات من الدرس السابق</h4>
        <ul>
          <li><strong>متوازي الأضلاع:</strong> شكل رباعي فيه كلّ ضلعين متقابلين متوازيان.</li>
          <li><strong>خاصّة الأضلاع:</strong> كلّ ضلعين متقابلين متساويان في الطول.</li>
          <li><strong>خاصّة الزوايا:</strong> كلّ زاويتين متقابلتين متساويتان في القياس.</li>
        </ul>
        <p>سؤال الدرس كلّه: <strong>ما الشرط الإضافي الذي يحوّل متوازي الأضلاع إلى معيّن؟</strong></p>
      </div>

      <BookTask id="l8-p36-goals" tone="teach" />
      <BookTask id="l8-p36-photo" tone="teach"><MeshFigure /></BookTask>
    </div>
  )
}

function ActivityStep() {
  return (
    <div className="l8-step-content">
      <SourceCard label="انطلاقة نشطة — ص 36">
        <p>لاحظ الأشكال الآتية ثمّ أجب عن الأسئلة الآتية:</p>
        <FigureFrame title="أشكال الانطلاقة النشطة" zoomable caption="اقرأ الأسهم: السهم المفرد والسهم المزدوج يدلّان على زوجَي الأضلاع المتوازية.">
          <div className="l8-gallery">
            {[{ key: '1', node: <Fig36Start1 /> }, { key: '2', node: <Fig36Start2 /> }, { key: '3', node: <Fig36Start3 /> }, { key: '4', node: <Fig36Start4 /> }].map(shape => (
              <figure className="l8-gallery-item" key={shape.key}>
                {shape.node}
                <figcaption>الشكل ({shape.key})</figcaption>
              </figure>
            ))}
          </div>
        </FigureFrame>
        <p className="l8-subquestion">① أيّ الأشكال السابقة تمثّل متوازي الأضلاع؟</p>
        <p className="l8-subquestion">② أيّ من الأشكال التي حدّدتها تساوت أطوال أضلاعه؟ (استعمل المسطرة السنتيمترية)</p>
      </SourceCard>

      <ShapeSorter8 />

      <BookTask id="l8-p36-start-q1" />
      <BookTask id="l8-p36-start-q2" />

      <div className="l8-explain">
        <h4><Lightbulb size={17} /> لماذا سؤالان لا سؤال واحد؟</h4>
        <p>لأنّ المعيّن يُبنى على شرطين متتابعين: أوّلاً <strong>التوازي</strong> (وهو ما يفحصه السؤال الأوّل)، ثمّ <strong>تساوي الأطوال</strong> (وهو ما يفحصه السؤال الثاني). من يقفز إلى الشرط الثاني وحده يقع في فخّ الأشكال التي تساوت أضلاعها دون توازٍ.</p>
      </div>
    </div>
  )
}

function DefinitionStep() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تعلّم ① — ص 36">
        <p className="l8-definition"><strong>المعيّن:</strong> إذا تساوى طولا ضلعين متجاورين في متوازي الأضلاع كان معيّناً.</p>
        <FigureFrame caption="العلامتان الحمراوان تدلّان على تساوي ضلعين متجاورين، والأسهم تدلّ على التوازي." zoomable>
          <Fig36Definition />
        </FigureFrame>
      </SourceCard>

      <BookTask id="l8-p36-definition" tone="teach"><Fig36Definition /></BookTask>

      <div className="l8-explain">
        <h4><Lightbulb size={17} /> الفكرة الكامنة: لماذا يكفي ضلعان متجاوران؟</h4>
        <ol className="l8-checklist">
          <li>في متوازي الأضلاع: <MathExpression>AB = CD</MathExpression> و <MathExpression>AD = BC</MathExpression> (الأضلاع المتقابلة متساوية).</li>
          <li>نضيف الشرط الجديد: <MathExpression>AB = BC</MathExpression> (ضلعان متجاوران).</li>
          <li>نربط: <MathExpression>AB = BC = CD = DA</MathExpression> ⇐ الأضلاع الأربعة متساوية.</li>
        </ol>
        <p>إذن قياس ضلعين فقط يكفي للحكم؛ وهذا ما يجعل التعريف عملياً جداً بالمسطرة.</p>
      </div>

      <RhombusLab />

      <div className="l8-misconception">
        <h4><CircleAlert size={17} /> تصحيح فكرة شائعة</h4>
        <p><strong>الخطأ:</strong> «تساوي الضلعين المتقابلين يجعل الشكل معيّناً».</p>
        <p><strong>الصواب:</strong> تساوي الضلعين المتقابلين متحقّق في <em>كل</em> متوازي أضلاع (حتى المستطيل)، فلا يميّز المعيّن. المميِّز هو تساوي ضلعين <strong>متجاورين</strong>.</p>
      </div>

      <SourceCard label="مثال — ص 36">
        <p>الشكل <MathExpression>ABCD</MathExpression> متوازي أضلاع لأنّ <MathExpression>AB ∥ DC</MathExpression> و <MathExpression>AD ∥ BC</MathExpression>، وفيه <MathExpression>AB = BC = 3cm</MathExpression> فالشكل معيّن ونجد أنّ: <MathExpression>AB = BC = CD = DA = 3cm</MathExpression>.</p>
        <FigureFrame zoomable caption="الطولان المكتوبان على ضلعين متجاورين هما مفتاح الحكم.">
          <Fig36Example />
        </FigureFrame>
      </SourceCard>

      <BookTask id="l8-p36-example" tone="teach"><Fig36Example /></BookTask>
    </div>
  )
}

function RecognizeStep() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تحقّق ① — ص 37">
        <p>علّل لماذا كلّ شكل من الأشكال الآتية يمثّل معيّناً، استعمل المسطرة السنتيمترية لقياس الأطوال:</p>
        <FigureFrame zoomable caption="قِس بالمسطرة ضلعين متجاورين في كلّ شكل قبل أن تحكم.">
          <div className="l8-gallery">
            <figure className="l8-gallery-item"><Fig37Check1A /><figcaption>الشكل (1)</figcaption></figure>
            <figure className="l8-gallery-item"><Fig37Check1B /><figcaption>الشكل (2)</figcaption></figure>
          </div>
        </FigureFrame>
      </SourceCard>
      <BookTask id="l8-p37-check1-fig1"><Fig37Check1A /></BookTask>
      <BookTask id="l8-p37-check1-fig2"><Fig37Check1B /></BookTask>

      <SourceCard label="تحقّق ② — ص 37">
        <p>علّل لماذا كلّ شكل من الأشكال الآتية لا يمثّل معيّناً:</p>
        <FigureFrame zoomable caption="لكلّ شكل سبب مختلف: ضلعان متجاوران مختلفان، أو غياب التوازي أصلاً.">
          <div className="l8-gallery">
            <figure className="l8-gallery-item"><Fig37Check2A /><figcaption>الشكل (1)</figcaption></figure>
            <figure className="l8-gallery-item"><Fig37Check2B /><figcaption>الشكل (2)</figcaption></figure>
            <figure className="l8-gallery-item"><Fig37Check2C /><figcaption>الشكل (3)</figcaption></figure>
          </div>
        </FigureFrame>
      </SourceCard>
      <BookTask id="l8-p37-check2-fig1"><Fig37Check2A /></BookTask>
      <BookTask id="l8-p37-check2-fig2"><Fig37Check2B /></BookTask>
      <BookTask id="l8-p37-check2-fig3"><Fig37Check2C /></BookTask>

      <RhombusDetector />

      <div className="l8-explain">
        <h4><Lightbulb size={17} /> خريطة القرار</h4>
        <ol className="l8-checklist">
          <li>هل الشكل رباعي؟ إن لا ⇐ توقّف.</li>
          <li>هل كلّ ضلعين متقابلين متوازيان؟ إن لا ⇐ ليس معيّناً (مهما تساوت أضلاعه).</li>
          <li>هل ضلعان متجاوران متساويان؟ إن نعم ⇐ <strong>معيّن</strong>. إن لا ⇐ متوازي أضلاع فقط.</li>
        </ol>
      </div>
    </div>
  )
}

function PropertiesStep() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تعلّم ② — خواصّ المعيّن — ص 37">
        <p>بما أنّ المعيّن متوازي أضلاع فإنّ له جميع خواصّ متوازي الأضلاع:</p>
        <ol className="l8-properties">
          <li><strong>1)</strong> كلّ ضلعين متقابلين متوازيان.</li>
          <li><strong>2)</strong> كلّ زاويتين متقابلتين متساويتان في القياس.</li>
          <li className="is-new"><strong>3)</strong> أضلاعه الأربعة متساوية في الطول.</li>
        </ol>
      </SourceCard>

      <BookTask id="l8-p37-properties" tone="teach" />

      <PropertyLab />

      <SourceCard label="تعبير شفهي — ص 37">
        <p>متى يكون متوازي الأضلاع معيّناً.</p>
      </SourceCard>
      <BookTask id="l8-p37-oral" />

      <div className="l8-explain">
        <h4><Lightbulb size={17} /> كيف تقول الجواب بصوتٍ واضح؟</h4>
        <p>ابدأ بما هو معلوم، ثم أضف الشرط، ثم اذكر النتيجة: «الشكل متوازي أضلاع… وإذا تساوى فيه طولا ضلعين متجاورين… صارت أضلاعه الأربعة متساوية فهو معيّن».</p>
      </div>
    </div>
  )
}

function ApplyStep() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تحقّق ③ — ص 37">
        <p>الشكل <MathExpression>ABCD</MathExpression> معيّن، <MathExpression>AB = 5cm</MathExpression> و<MathExpression>{'Â = 50°'}</MathExpression> و<MathExpression>{'B̂ = 130°'}</MathExpression>. اكتب طول كلٍّ من <MathExpression>[BC]</MathExpression> و<MathExpression>[CD]</MathExpression> و<MathExpression>[DA]</MathExpression>، وقياس كلٍّ من <MathExpression>{'Ĉ'}</MathExpression> و<MathExpression>{'D̂'}</MathExpression>.</p>
        <FigureFrame zoomable caption="معطى واحد للطول ومعطى واحد لكل زاوية؛ والباقي يُستنتج بالخواصّ.">
          <Fig37Rhombus />
        </FigureFrame>
      </SourceCard>

      <FillBlanks8 />

      <BookTask id="l8-p37-check3-bc" />
      <BookTask id="l8-p37-check3-cd" />
      <BookTask id="l8-p37-check3-da" />
      <BookTask id="l8-p37-check3-angle-c" />
      <BookTask id="l8-p37-check3-angle-d" />

      <div className="l8-explain">
        <h4><Lightbulb size={17} /> استراتيجية التحقّق</h4>
        <ol className="l8-checklist">
          <li>الأطوال: هل الأضلاع الأربعة متساوية؟ (<MathExpression>4 × 5 = 20cm</MathExpression> محيطاً)</li>
          <li>الزوايا المتقابلة: هل تساوت؟ (<MathExpression>50°</MathExpression> مع <MathExpression>50°</MathExpression> و<MathExpression>130°</MathExpression> مع <MathExpression>130°</MathExpression>)</li>
          <li>الزوايا المتتالية: هل مجموعها <MathExpression>180°</MathExpression>؟</li>
          <li>مجموع زوايا الرباعي: <MathExpression>50 + 130 + 50 + 130 = 360°</MathExpression> ✔</li>
        </ol>
      </div>
    </div>
  )
}

function ConstructionStep() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تعلّم ③ — رسم المعيّن — ص 38">
        <p>مثال: لرسم معيّن <MathExpression>ABCD</MathExpression> طول ضلعه <MathExpression>3cm</MathExpression> وقياس <MathExpression>∠ABC = 45°</MathExpression> نتبع الخطوات الآتية:</p>
        <ol className="l8-draw-steps">
          <li>نرسم بالمسطرة <MathExpression>[AB]</MathExpression> طولها <MathExpression>3cm</MathExpression>.</li>
          <li>نستعمل المنقلة لإنشاء زاوية <MathExpression>45°</MathExpression> أحد ضلعيها <MathExpression>AB</MathExpression> ورأسها <MathExpression>B</MathExpression>.</li>
          <li>نعيّن النقطة <MathExpression>C</MathExpression> بحيث <MathExpression>BC = 3cm</MathExpression>.</li>
          <li>نرسم من <MathExpression>C</MathExpression> نصف مستقيم يوازي <MathExpression>AB</MathExpression> ونعيّن عليه <MathExpression>D</MathExpression> بحيث <MathExpression>CD = 3cm</MathExpression>.</li>
          <li>نصل بين النقطتين <MathExpression>C</MathExpression> ، <MathExpression>A</MathExpression> فيكون الشكل <MathExpression>ABCD</MathExpression> معيّناً ونتحقّق باستعمال المسطرة السنتيمترية أنّ <MathExpression>AD = 3cm</MathExpression>.</li>
        </ol>
      </SourceCard>

      <ConstructionPlayer8 />

      <BookTask id="l8-p38-draw-intro" tone="teach" />
      <BookTask id="l8-p38-draw-step1" tone="teach"><ConstructionFigure8 step={1} /></BookTask>
      <BookTask id="l8-p38-draw-step2" tone="teach"><ConstructionFigure8 step={2} /></BookTask>
      <BookTask id="l8-p38-draw-step3" tone="teach"><ConstructionFigure8 step={3} /></BookTask>
      <BookTask id="l8-p38-draw-step4" tone="teach"><ConstructionFigure8 step={4} /></BookTask>
      <BookTask id="l8-p38-draw-step5" tone="teach"><ConstructionFigure8 step={5} /></BookTask>

      <div className="l8-explain">
        <h4><Lightbulb size={17} /> لماذا يكفي ضلع واحد وزاوية واحدة؟</h4>
        <p>في متوازي الأضلاع نحتاج طولين وزاوية. أمّا في المعيّن فالأضلاع الأربعة متساوية، فالطول الواحد يغني عن الثاني؛ والزاوية الواحدة تحدّد الميل، وبقية الزوايا تُحسب لأنّ المتقابلتين متساويتان والمتتاليتين مجموعهما <MathExpression>180°</MathExpression>.</p>
      </div>
    </div>
  )
}

function ConstructionCheckStep() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تحقّق من فهمك — ص 39">
        <p>ارسم معيّناً طول ضلعه <MathExpression>4cm</MathExpression> وإحدى زواياه قياسها <MathExpression>120°</MathExpression> مستعملاً الأدوات الهندسية وسمّه <MathExpression>XYZW</MathExpression>.</p>
      </SourceCard>

      <BookTask id="l8-p39-check-draw">
        <FigureFrame zoomable title="الشكل الناتج بعد تنفيذ الخطوات" caption="أضلاع متساوية 4cm، وزاوية 120° عند Y، والزاويتان الأخريان 60°.">
          <Fig39CheckDraw />
        </FigureFrame>
      </BookTask>

      <AnglePlanner />

      <div className="l8-explain">
        <h4><Lightbulb size={17} /> تحقّق قبل أن تسلّم رسمك</h4>
        <ol className="l8-checklist">
          <li>قِس الأضلاع الأربعة: يجب أن تكون <MathExpression>4cm</MathExpression> جميعها.</li>
          <li>قِس الزاوية عند <MathExpression>Y</MathExpression>: يجب أن تكون <MathExpression>120°</MathExpression>.</li>
          <li>قِس الزاوية المقابلة عند <MathExpression>W</MathExpression>: يجب أن تساويها.</li>
          <li>اقرأ التسمية بالدوران: <MathExpression>X → Y → Z → W</MathExpression> من دون تقاطع.</li>
        </ol>
      </div>
    </div>
  )
}

function Practice1Step() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تدرّب ① — ص 39">
        <p>اكتب لكلّ شكل هندسي جميع الأسماء التي تناسبه (رباعي، متوازي أضلاع، مستطيل، معيّن):</p>
        <FigureFrame title="أشكال تدرّب ①" zoomable caption="انتبه إلى إشارة الزاوية القائمة وإلى علامات تساوي الأضلاع.">
          <div className="l8-gallery">
            {([1, 2, 3, 4, 5, 6] as Array<keyof typeof ex1Shapes>).map(variant => (
              <figure className="l8-gallery-item" key={variant}>
                <Fig39Ex1 variant={variant} />
                <figcaption>الشكل ({variant})</figcaption>
              </figure>
            ))}
          </div>
        </FigureFrame>
      </SourceCard>

      <NameTheShape />

      <BookTask id="l8-p39-ex1-fig1"><Fig39Ex1 variant={1} /></BookTask>
      <BookTask id="l8-p39-ex1-fig2"><Fig39Ex1 variant={2} /></BookTask>
      <BookTask id="l8-p39-ex1-fig3"><Fig39Ex1 variant={3} /></BookTask>
      <BookTask id="l8-p39-ex1-fig4"><Fig39Ex1 variant={4} /></BookTask>
      <BookTask id="l8-p39-ex1-fig5"><Fig39Ex1 variant={5} /></BookTask>
      <BookTask id="l8-p39-ex1-fig6"><Fig39Ex1 variant={6} /></BookTask>
    </div>
  )
}

function Practice2Step() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تدرّب ② — ص 39">
        <p>في الشكل المجاور:</p>
        <FigureFrame zoomable caption="الضلعان [YX] و[YZ] متجاوران ومتساويان؛ ينقص الرأس الرابع فقط.">
          <Fig39Ex2 />
        </FigureFrame>
        <p className="l8-subquestion">أ ) عيّن الرأس الرابع <MathExpression>W</MathExpression> ليكون <MathExpression>XYZW</MathExpression> معيّناً.</p>
        <p className="l8-subquestion">ب) ما هي الخواصّ التي اعتمدت عليها في تعيين الرأس <MathExpression>W</MathExpression>؟</p>
      </SourceCard>

      <FourthVertexActivity8 />

      <BookTask id="l8-p39-ex2-a"><Fig39Ex2 w={P(250, 120)} /></BookTask>
      <BookTask id="l8-p39-ex2-b" />
    </div>
  )
}

function Practice3Step() {
  return (
    <div className="l8-step-content">
      <SourceCard label="تدرّب ③ — ص 39">
        <p>في الشكل المجاور <MathExpression>AFED</MathExpression> معيّن، <MathExpression>FBCE</MathExpression> متوازي أضلاع، <MathExpression>AD = 3cm</MathExpression> و<MathExpression>FB = 5cm</MathExpression>. احسب طول كلٍّ من <MathExpression>[BC]</MathExpression> و<MathExpression>[AF]</MathExpression> و<MathExpression>[AB]</MathExpression>.</p>
        <FigureFrame zoomable caption="الضلع [FE] مشترك بين الشكلين، وهو جسر نقل المعلومة.">
          <Fig39Ex3 />
        </FigureFrame>
      </SourceCard>

      <CompositeSolver />

      <BookTask id="l8-p39-ex3-bc"><Fig39Ex3 showLengths /></BookTask>
      <BookTask id="l8-p39-ex3-af" />
      <BookTask id="l8-p39-ex3-ab" />

      <div className="l8-explain">
        <h4><Lightbulb size={17} /> استراتيجية الشكلين المتجاورين</h4>
        <ol className="l8-checklist">
          <li>حدّد الضلع المشترك: هنا <MathExpression>[FE]</MathExpression>.</li>
          <li>انقل المعلومة من الشكل الأوّل (المعيّن) إلى الضلع المشترك.</li>
          <li>انقلها من الضلع المشترك إلى الشكل الثاني (متوازي الأضلاع).</li>
          <li>للأطوال على استقامة واحدة: اجمع القطعتين المتتاليتين.</li>
        </ol>
      </div>
    </div>
  )
}

function MistakesStep() {
  return (
    <div className="l8-step-content">
      <div className="l8-explain">
        <h4><CircleAlert size={17} /> أربعة أخطاء تُفقد العلامات</h4>
        <ol className="l8-checklist">
          <li>الحكم بالشكل الظاهري بدل فحص الشرطين (توازٍ + تساوي متجاورين).</li>
          <li>الخلط بين الضلعين المتجاورين والضلعين المتقابلين.</li>
          <li>الخلط بين الزاوية المتقابلة والزاوية المتتالية (المجاورة).</li>
          <li>قراءة علامة التساوي (الشرطة) على أنها علامة توازٍ (السهم).</li>
        </ol>
      </div>

      <ErrorHunt8 />

      <div className="l8-explain">
        <h4><Check size={17} /> استراتيجية التحقّق العامّة في هذا الدرس</h4>
        <ol className="l8-checklist">
          <li><strong>القياس:</strong> المسطرة للأضلاع، المنقلة للزوايا.</li>
          <li><strong>الاتّساق:</strong> الزاويتان المتتاليتان مجموعهما <MathExpression>180°</MathExpression>، ومجموع زوايا الرباعي <MathExpression>360°</MathExpression>.</li>
          <li><strong>الطريق الثاني:</strong> احسب الناتج بطريقة أخرى (مثلاً المحيط <MathExpression>4 × a</MathExpression> ثمّ <MathExpression>a + a + a + a</MathExpression>).</li>
          <li><strong>المعقولية:</strong> هل الطول الناتج يناسب الرسم؟ هل الزاوية حادّة فعلاً إن كانت أقلّ من <MathExpression>90°</MathExpression>؟</li>
        </ol>
      </div>
    </div>
  )
}

function RecapStep() {
  return (
    <div className="l8-step-content l8-recap">
      <div className="l8-recap-icon"><RotateCcw size={24} /></div>
      <h3>خلاصة الدرس الثامن</h3>
      <ul>
        <li><strong>التعريف:</strong> إذا تساوى طولا ضلعين متجاورين في متوازي الأضلاع كان معيّناً.</li>
        <li><strong>الخاصّة 1:</strong> كلّ ضلعين متقابلين متوازيان.</li>
        <li><strong>الخاصّة 2:</strong> كلّ زاويتين متقابلتين متساويتان في القياس.</li>
        <li><strong>الخاصّة 3:</strong> الأضلاع الأربعة متساوية في الطول.</li>
        <li><strong>المحيط:</strong> <MathExpression>4 × a</MathExpression> حيث <MathExpression>a</MathExpression> طول الضلع.</li>
        <li><strong>الرسم:</strong> ضلع ← زاوية عند رأسه ← ضلع مساوٍ ← موازٍ مساوٍ ← إغلاق وتحقّق.</li>
        <li><strong>العائلة:</strong> المربّع معيّن زواياه قائمة؛ والمستطيل ليس معيّناً إلّا إذا كان مربّعاً.</li>
      </ul>
      <div className="l8-family">
        <span>رباعي</span><MoveRight size={14} /><span>متوازي أضلاع</span><MoveRight size={14} /><span>معيّن (أضلاع متساوية)</span><MoveRight size={14} /><span>مربّع (أضلاع متساوية + زوايا قائمة)</span>
      </div>
      <p className="l8-recap-note">بهذا تكتمل الوحدة الأولى: من الإحداثيات والأعداد إلى الزوايا ومتوازي الأضلاع والمعيّن.</p>
    </div>
  )
}

function FinalTest() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const normalize = (value: string) => value.trim().replace(/[°\s,،cm]/gi, '')
  const score = finalAssessment8.filter(question => normalize(answers[question.id] ?? '') === normalize(question.answer)).length
  return (
    <div className="l8-step-content l8-final-test">
      <div className="l8-banner"><Check size={17} /> اختبار ختامي جديد من إعداد المنصّة — ليس منقولاً من الكتاب، ويقيس الفهم والنقل إلى مواقف جديدة.</div>
      <p>اقرأ كل سؤال بتمهّل. في أسئلة الاختيار ابحث عن السبب، وفي أسئلة الكتابة اكتب الأرقام فقط دون وحدات.</p>
      {finalAssessment8.map((question, index) => (
        <label className="l8-test-question" key={question.id}>
          <strong>{index + 1}. <BidiText>{question.text}</BidiText></strong>
          {question.type === 'input' ? (
            <input dir="ltr" aria-label={question.id} value={answers[question.id] ?? ''} onChange={event => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder="اكتب الإجابة" />
          ) : (
            <div className="l8-choice-row">
              {question.options?.map(option => (
                <button type="button" key={option} className={answers[question.id] === option ? 'is-selected' : ''} onClick={() => setAnswers({ ...answers, [question.id]: option })}>
                  <BidiText>{option}</BidiText>
                </button>
              ))}
            </div>
          )}
          {question.hint && <small className="l8-hint">تلميح: <BidiText>{question.hint}</BidiText></small>}
        </label>
      ))}
      <button type="button" className="l8-submit" onClick={() => setSubmitted(true)}>عرض النتيجة <Check size={16} /></button>
      {submitted && (
        <div className="l8-result">
          <strong>نتيجتك: <MathExpression>{score} / {finalAssessment8.length}</MathExpression></strong>
          <p>{score === finalAssessment8.length ? 'إتقان كامل! صرت تميّز المعيّن وتستعمل خواصّه الثلاث بثقة.' : 'راجع ما أخطأت فيه: ابدأ من التعريف (توازٍ + تساوي متجاورين)، ثمّ الخواصّ الثلاث، ثمّ أعد المحاولة.'}</p>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ lesson */

export function RhombusLesson() {
  const steps: LessonStep[] = [
    { id: 'launch', title: 'انطلاقة الدرس', content: <LaunchStep /> },
    { id: 'activity', title: 'انطلاقة نشطة', content: <ActivityStep /> },
    { id: 'definition', title: 'ما المعيّن؟', content: <DefinitionStep /> },
    { id: 'recognize', title: 'تحقّق: معيّن أم لا؟', content: <RecognizeStep /> },
    { id: 'properties', title: 'خواصّ المعيّن', content: <PropertiesStep /> },
    { id: 'apply', title: 'تحقّق: تطبيق الخواصّ', content: <ApplyStep /> },
    { id: 'construction', title: 'رسم المعيّن', content: <ConstructionStep /> },
    { id: 'construction-check', title: 'تحقّق: ارسم XYZW', content: <ConstructionCheckStep /> },
    { id: 'practice-1', title: 'تدرّب ①', content: <Practice1Step /> },
    { id: 'practice-2', title: 'تدرّب ②', content: <Practice2Step /> },
    { id: 'practice-3', title: 'تدرّب ③', content: <Practice3Step /> },
    { id: 'mistakes', title: 'أخطاء وتحقّق', content: <MistakesStep /> },
    { id: 'recap', title: 'الخلاصة', content: <RecapStep /> },
    { id: 'test', title: 'الاختبار النهائي', content: <FinalTest /> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return (
    <>
      <LessonShell title="المعيّن" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-eight" />
      <BookCoverageMarkers />
    </>
  )
}
