import { useState, type ReactNode } from 'react'
import { Check, Compass, Expand, Lightbulb, MousePointer2, RotateCcw, Sparkles, Target, ZoomIn, ZoomOut } from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import { finalAssessment6, lessonSixBookElements } from './anglesData'

const BookElement = ({ id, page, children, label = 'من الكتاب' }: { id: string; page: number; children: ReactNode; label?: string }) => <div className="l6-book-element" data-source-id={id}><SourceCard label={`${label} — ص ${page}`}>{children}</SourceCard></div>

function BookCoverageMarkers() {
  return <div className="l6-coverage-markers" aria-label="فهرس عناصر صفحات الدرس">{lessonSixBookElements.map(element => <span key={element.id} data-source-id={element.id}>{element.title}</span>)}</div>
}

function AngleDiagram({ kind, degree, label }: { kind: 'acute' | 'right' | 'obtuse' | 'straight'; degree?: number; label?: string }) {
  const d = degree ?? (kind === 'acute' ? 40 : kind === 'right' ? 90 : kind === 'obtuse' ? 125 : 180)
  const cx = 84; const cy = 78; const r = 57
  const end = (angle: number) => ({ x: cx + r * Math.cos(-angle * Math.PI / 180), y: cy + r * Math.sin(-angle * Math.PI / 180) })
  const p = end(d)
  const large = d > 180 ? 1 : 0
  const path = kind === 'straight' ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}` : `M ${cx + r} ${cy} A ${r} ${r} 0 ${large} 0 ${p.x} ${p.y}`
  return <svg className="l6-angle-svg" viewBox="0 0 168 112" role="img" aria-label={label ?? `زاوية ${kind}`} direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
    <line x1={cx} y1={cy} x2={cx + r} y2={cy} className="l6-ray l6-ray-base" />
    <line x1={cx} y1={cy} x2={kind === 'straight' ? cx - r : p.x} y2={kind === 'straight' ? cy : p.y} className="l6-ray" />
    <path d={path} className="l6-angle-arc" />
    <circle cx={cx} cy={cy} r="3" className="l6-vertex-dot" />
    {label && <text x="84" y="104" textAnchor="middle" className="l6-svg-label">{label}</text>}
  </svg>
}

function RayDiagram() {
  return <svg className="l6-concept-svg" viewBox="0 0 420 165" role="img" aria-label="نصف المستقيم AB وزاوية بين نصفَي مستقيمين" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
    <line x1="78" y1="122" x2="218" y2="42" className="l6-concept-ray" />
    <line x1="78" y1="122" x2="330" y2="122" className="l6-concept-ray l6-concept-ray-second" />
    <circle cx="78" cy="122" r="5" className="l6-concept-point" /><circle cx="170" cy="70" r="5" className="l6-concept-point" /><circle cx="232" cy="122" r="5" className="l6-concept-point" />
    <text x="64" y="150" className="l6-svg-point">A</text><text x="168" y="60" className="l6-svg-point">B</text><text x="236" y="145" className="l6-svg-point">C</text>
    <path d="M 102 122 A 25 25 0 0 0 99 106" className="l6-angle-arc" />
    <text x="271" y="38" className="l6-svg-label">ضلعا الزاوية</text>
  </svg>
}

function InsideOutsideDiagram() {
  return <svg className="l6-concept-svg" viewBox="0 0 500 210" role="img" aria-label="نقطة داخل زاوية ونقطة خارجها" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
    <path d="M 86 158 L 250 42 L 428 158 Z" className="l6-wedge" />
    <path d="M 86 158 L 428 158" className="l6-angle-base" />
    <path d="M 86 158 L 250 42" className="l6-angle-side" /><path d="M 250 42 L 428 158" className="l6-angle-side" />
    <path d="M 86 158 L 250 42 L 428 158" className="l6-angle-highlight" />
    <circle cx="265" cy="104" r="6" className="l6-inside-point" /><text x="278" y="108" className="l6-svg-point">X</text>
    <circle cx="82" cy="92" r="6" className="l6-outside-point" /><text x="63" y="87" className="l6-svg-point">B</text>
    <text x="70" y="182" className="l6-svg-point">Q</text>
  </svg>
}

function ProtractorSvg({ degree = 35, compact = false }: { degree?: number; compact?: boolean }) {
  const width = compact ? 360 : 620; const height = compact ? 180 : 300; const cx = width / 2; const cy = height - 30; const radius = Math.min(width * .43, height - 55)
  const point = (angle: number, r = radius) => ({ x: cx + r * Math.cos(angle * Math.PI / 180), y: cy - r * Math.sin(angle * Math.PI / 180) })
  const ray = point(degree, radius * .96)
  const ticks = Array.from({ length: 19 }, (_, i) => i * 10)
  return <svg className={`l6-protractor-svg ${compact ? 'is-compact' : ''}`} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`منقلة تفاعلية، القياس ${degree} درجة`} direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
    <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} className="l6-protractor-shell" />
    <path d={`M ${cx - radius * .72} ${cy} A ${radius * .72} ${radius * .72} 0 0 1 ${cx + radius * .72} ${cy}`} className="l6-protractor-inner" />
    {ticks.map(value => { const a = point(value, radius); const b = point(value, value % 30 === 0 ? radius - 16 : radius - 9); return <line key={value} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={value % 30 === 0 ? 'l6-protractor-major' : 'l6-protractor-tick'} /> })}
    {ticks.filter(value => value % 30 === 0).map(value => { const outer = point(value, radius - 30); const inner = point(180 - value, radius - 47); return <g key={`labels-${value}`} className="l6-protractor-labels"><text x={outer.x} y={outer.y} textAnchor="middle" className="l6-protractor-outer-number">{value}</text><text x={inner.x} y={inner.y} textAnchor="middle" className="l6-protractor-inner-number">{value}</text></g> })}
    <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} className="l6-protractor-baseline" />
    <line x1={cx} y1={cy} x2={ray.x} y2={ray.y} className="l6-protractor-ray" />
    <path d={`M ${cx + radius * .26} ${cy} A ${radius * .26} ${radius * .26} 0 0 0 ${point(degree, radius * .26).x} ${point(degree, radius * .26).y}`} className="l6-protractor-angle" />
    <circle cx={cx} cy={cy} r="6" className="l6-protractor-center" /><text x={cx} y={cy + 23} textAnchor="middle" className="l6-protractor-center-label">مركز المنقلة</text><text x={cx + radius + 4} y={cy + 18} className="l6-protractor-zero-label">خط الصفر</text>
  </svg>
}

function ZoomableProtractor({ degree = 35, title = 'منقلة واضحة للتكبير' }: { degree?: number; title?: string }) {
  const [zoom, setZoom] = useState(false)
  return <div className={`l6-protractor-frame ${zoom ? 'is-zoomed' : ''}`}><div className="l6-figure-toolbar"><strong>{title}</strong><button type="button" className="l6-zoom-button" onClick={() => setZoom(!zoom)}>{zoom ? <ZoomOut size={16} /> : <ZoomIn size={16} />}{zoom ? 'تصغير' : 'تكبير الرسم'}</button></div><ProtractorSvg degree={degree} /><p className="l6-figure-caption">التدريج الأحمر والتدريج الأسود: اختر الصفر الذي يطابق ضلع البداية.</p></div>
}

function InteractiveProtractor() {
  const [degree, setDegree] = useState(35)
  const [target, setTarget] = useState(35)
  return <div className="l6-interactive-protractor"><div className="l6-interactive-head"><div><span className="section-kicker">مختبر المنقلة</span><h3>حرّك الشعاع ثم اقرأ القياس</h3><p>اسحب المنزلق. قبل النظر إلى الرقم، قدّر: هل الزاوية حادة أم قائمة أم منفرجة؟</p></div><span className="l6-degree-readout"><MathExpression>{degree}°</MathExpression></span></div><ProtractorSvg degree={degree} /><label className="l6-slider-label" htmlFor="angle-slider">تدوير الشعاع <MathExpression>0°–180°</MathExpression></label><input id="angle-slider" className="l6-angle-slider" type="range" min="0" max="180" step="1" value={degree} onChange={event => setDegree(Number(event.target.value))} /><div className="l6-interactive-actions"><button type="button" className="l6-preset" onClick={() => setTarget(35)}>تحدي 35°</button><button type="button" className="l6-preset" onClick={() => setTarget(90)}>تحدي 90°</button><button type="button" className="l6-preset" onClick={() => setTarget(120)}>تحدي 120°</button><button type="button" className="l6-check" onClick={() => setDegree(target)}>اعرض القياس المستهدف</button></div><p className="l6-lab-note">التحدي الحالي: اضبط الشعاع على <MathExpression>{target}°</MathExpression>، ثم اضغط زر العرض للتحقق.</p></div>
}

function ClassificationActivity() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const items = [
    ['a', 'أ', 'right', 'قائمة'], ['b', 'ب', 'acute', 'حادة'], ['c', 'ج', 'obtuse', 'منفرجة'], ['d', 'د', 'straight', 'مستقيمة'],
  ] as const
  return <div className="l6-classification-grid">{items.map(([id, label, kind, answer]) => <div className="l6-classification-card" key={id}><AngleDiagram kind={kind} label={`(${label})`} /><strong>الزاوية ({label})</strong><div className="l6-choice-row">{['حادة', 'قائمة', 'منفرجة', 'مستقيمة'].map(option => <button type="button" key={option} className={answers[id] === option ? 'is-selected' : ''} onClick={() => setAnswers({ ...answers, [id]: option })}>{option}</button>)}</div>{answers[id] && <p className={answers[id] === answer ? 'l6-feedback is-good' : 'l6-feedback'}>{answers[id] === answer ? `أحسنت: الزاوية ${answer}.` : 'أعد مقارنة فتحة الزاوية بالقائمة والمستقيمة.'}</p>}</div>)}</div>
}

function InsideOutsideActivity() {
  const [selected, setSelected] = useState<string | null>(null)
  return <div className="l6-interaction-panel"><InsideOutsideDiagram /><div className="l6-choice-row"><button type="button" className={selected === 'x' ? 'is-selected' : ''} onClick={() => setSelected('x')}>X داخل الزاوية</button><button type="button" className={selected === 'b' ? 'is-selected' : ''} onClick={() => setSelected('b')}>B خارج الزاوية</button></div>{selected && <div className="l6-feedback is-good">صحيح. النقطة {selected === 'x' ? 'X داخل الفتحة بين الضلعين.' : 'B خارج الفتحة بين الضلعين.'}</div>}</div>
}

function MeasurementGallery() {
  const items = [
    ['l6-p26-check-hij', 'ĤIJ', 90], ['l6-p26-check-klm', 'K̂LM', 50], ['l6-p26-check-nab', 'NÂB', 60], ['l6-p26-check-lsu', 'L̂SU', 180], ['l6-p26-check-fde', 'F̂DE', 120],
  ] as const
  return <div className="l6-measure-gallery">{items.map(([id, name, value]) => <div className="l6-measure-card" key={id} data-source-id={id}><AngleDiagram kind={value === 90 ? 'right' : value === 180 ? 'straight' : value > 90 ? 'obtuse' : 'acute'} degree={value} /><strong><MathExpression>{name}</MathExpression></strong><span className="l6-measure-answer"><MathExpression>{value}°</MathExpression></span><small>ابدأ من الصفر الذي يطابق ضلع البداية.</small></div>)}</div>
}

function DrawAngleActivity() {
  const [selected, setSelected] = useState(50)
  return <div className="l6-draw-layout"><div className="l6-draw-board"><svg viewBox="0 0 290 190" role="img" aria-label="رسم زاوية ABC مقدارها 50 درجة" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}><line x1="55" y1="150" x2="260" y2="150" className="l6-draw-base" /><line x1="55" y1="150" x2={55 + 150 * Math.cos(-selected * Math.PI / 180)} y2={150 + 150 * Math.sin(-selected * Math.PI / 180)} className="l6-draw-ray" /><path d={`M 93 150 A 38 38 0 0 0 ${55 + 38 * Math.cos(-selected * Math.PI / 180)} ${150 + 38 * Math.sin(-selected * Math.PI / 180)}`} className="l6-angle-arc" /><text x="42" y="170" className="l6-svg-point">B</text><text x="263" y="170" className="l6-svg-point">C</text><text x={55 + 160 * Math.cos(-selected * Math.PI / 180)} y={150 + 160 * Math.sin(-selected * Math.PI / 180)} className="l6-svg-point">A</text></svg></div><div className="l6-draw-controls"><strong>حدّد موضع A على <MathExpression>{selected}°</MathExpression></strong><input aria-label="زاوية الرسم" type="range" min="10" max="170" value={selected} onChange={event => setSelected(Number(event.target.value))} /><p>الخطوات: ارسم BC، ضع المركز عند B، طابق الصفر مع BC، عيّن A عند 50°، ثم صل B وA.</p></div></div>
}

function AngleWheel() {
  const rays = [0, 45, 90, 120, 135, 180]
  return <svg className="l6-wheel-svg" viewBox="0 0 500 255" role="img" aria-label="أشعة الزوايا حول الرأس Q" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}><line x1="45" y1="210" x2="455" y2="210" className="l6-wheel-base" />{rays.map((angle, index) => { const x = 250 + 165 * Math.cos(-angle * Math.PI / 180); const y = 210 + 165 * Math.sin(-angle * Math.PI / 180); const names = ['A', 'X', 'B', 'C', 'Y', 'Z']; return <g key={angle}><line x1="250" y1="210" x2={x} y2={y} className="l6-wheel-ray" /><text x={x + (x > 260 ? 7 : -18)} y={y + (y > 195 ? 16 : 0)} className="l6-svg-point">{names[index]}</text></g> })}<circle cx="250" cy="210" r="6" className="l6-vertex-dot" /><text x="241" y="236" className="l6-svg-point">Q</text><path d="M 250 210 A 75 75 0 0 0 250 135" className="l6-right-mark" /><text x="275" y="148" className="l6-protractor-inner-number">90°</text></svg>
}

function GeometryFigures() {
  return <div className="l6-geometry-grid">
    <div className="l6-geo-card"><svg viewBox="0 0 180 125" role="img" aria-label="مثلث بزاويتين ملونتين" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}><path d="M 20 100 L 90 32 L 160 100 Z" className="l6-geo-line" /><path d="M 20 100 L 45 100 A 25 25 0 0 0 40.5 85.5 Z" className="l6-geo-blue" /><path d="M 160 100 L 135 100 A 25 25 0 0 1 139.5 85.5 Z" className="l6-geo-green" /><text x="12" y="116" className="l6-svg-point">J</text><text x="155" y="116" className="l6-svg-point">I</text><text x="88" y="25" className="l6-svg-point">H</text></svg><span>∠J = 35° ، ∠I = 35°</span></div>
    <div className="l6-geo-card"><svg viewBox="0 0 180 160" role="img" aria-label="مثلث بزاوية ملونة عند F" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}><path d="M 25 135 L 90 22 L 158 135 Z" className="l6-geo-line" /><path d="M 25 135 L 53 135 A 28 28 0 0 0 39 111 Z" className="l6-geo-blue" /><text x="18" y="151" className="l6-svg-point">F</text><text x="153" y="151" className="l6-svg-point">G</text><text x="87" y="19" className="l6-svg-point">E</text></svg><span>∠F = 60°</span></div>
    <div className="l6-geo-card"><svg viewBox="0 0 180 125" role="img" aria-label="زاوية قائمة في مستطيل" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}><rect x="35" y="20" width="110" height="80" className="l6-geo-line" /><path d="M 35 100 L 35 74 A 26 26 0 0 1 61 100 Z" className="l6-geo-blue" /><text x="28" y="116" className="l6-svg-point">D</text><text x="28" y="17" className="l6-svg-point">A</text><text x="141" y="17" className="l6-svg-point">B</text><text x="141" y="116" className="l6-svg-point">C</text></svg><span>∠D = 90°</span></div>
  </div>
}

function TriangleAndCircleFigures() {
  return <div className="l6-figure-pair"><div className="l6-triangle-figure"><svg viewBox="0 0 250 190" role="img" aria-label="مثلث ABC قائم عند B" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}><path d="M 55 25 L 55 160 L 133 160 Z" className="l6-geo-line" /><rect x="55" y="142" width="18" height="18" className="l6-right-square" /><text x="45" y="20" className="l6-svg-point">A</text><text x="40" y="178" className="l6-svg-point">B</text><text x="136" y="178" className="l6-svg-point">C</text></svg><p>∠B = 90°، ∠CAB = 30°، ∠BCA = 60°</p></div><div className="l6-circle-figure"><svg viewBox="0 0 300 185" role="img" aria-label="نصف دائرة قطرها BC ونقطتا M وN" direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}><path d="M 35 145 A 115 115 0 0 1 265 145" className="l6-arc" /><line x1="35" y1="145" x2="265" y2="145" className="l6-geo-line" /><line x1="35" y1="145" x2="178" y2="75" className="l6-chord red" /><line x1="178" y1="75" x2="265" y2="145" className="l6-chord red" /><line x1="35" y1="145" x2="218" y2="65" className="l6-chord green" /><line x1="218" y1="65" x2="265" y2="145" className="l6-chord green" /><circle cx="150" cy="145" r="5" className="l6-vertex-dot" /><text x="26" y="166" className="l6-svg-point">B</text><text x="264" y="166" className="l6-svg-point">C</text><text x="145" y="166" className="l6-svg-point">O</text><text x="171" y="68" className="l6-svg-point">N</text><text x="208" y="60" className="l6-svg-point">M</text></svg><p>∠BMC = 90°، ∠CNB = 90°، ∠BOC = 180°</p></div></div>
}

function SquareFigure({ colored = false }: { colored?: boolean }) {
  return <svg className="l6-square-svg" viewBox="0 0 250 190" role="img" aria-label={colored ? 'مربع ABCD وقطره AC وزاويتان ملونتان' : 'مربع ABCD'} direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}><rect x="58" y="25" width="130" height="130" className="l6-geo-line" /><text x="50" y="19" className="l6-svg-point">A</text><text x="190" y="19" className="l6-svg-point">B</text><text x="190" y="174" className="l6-svg-point">C</text><text x="50" y="174" className="l6-svg-point">D</text><path d="M 58 25 L 188 155" className="l6-diagonal" />{colored && <><path d="M 58 25 L 58 55 A 30 30 0 0 1 79 46 Z" className="l6-geo-blue" /><path d="M 188 155 L 188 125 A 30 30 0 0 0 167 134 Z" className="l6-geo-green" /></>}<path d="M 58 155 L 75 155 L 75 138" className="l6-right-square" /></svg>
}

function BikeAngleCards() {
  const [choice, setChoice] = useState<Record<number, string>>({})
  const items = [[1, 'حادة'], [2, 'منفرجة'], [3, 'حادة'], [4, 'منفرجة']] as const
  return <div className="l6-bike-activity"><div className="l6-bike-illustration"><div className="l6-wheel" /><div className="l6-wheel second" /><div className="l6-bike-frame"><i /><i /><i /><i /></div><span className="bike-tag tag-1">1</span><span className="bike-tag tag-2">2</span><span className="bike-tag tag-3">3</span><span className="bike-tag tag-4">4</span></div><div className="l6-bike-choices">{items.map(([number, answer]) => <div key={number}><strong>الزاوية {number}</strong><div className="l6-choice-row">{['حادة', 'قائمة', 'منفرجة', 'مستقيمة'].map(option => <button key={option} type="button" className={choice[number] === option ? 'is-selected' : ''} onClick={() => setChoice({ ...choice, [number]: option })}>{option}</button>)}</div>{choice[number] && <small className={choice[number] === answer ? 'l6-feedback is-good' : 'l6-feedback'}>{choice[number] === answer ? 'صحيح.' : 'قارن الفتحة بـ90° و180°.'}</small>}</div>)}</div></div>
}

function IntroStep() {
  return <div className="l6-step-content"><div className="l6-hero-card"><div className="l6-hero-orbit"><Compass size={46} /></div><div><span className="section-kicker">الدرس السادس · صفحات 23–30</span><h3>الزاوية تخبرنا عن الاتجاه والفتحة</h3><p>في هذا الدرس سنتعلّم كيف نسمّي الزوايا ونقيسها بالمنقلة ونرسمها، ثم نصنّفها ونستعملها في مواقف من الحياة.</p></div></div><BookElement id="l6-p23-intro" page={23}><p>عالم الفلك بطليموس في رصده للنظام الشمسي استعمل وحدة قياس حصل عليها بتجزئة المسافة حول الدائرة المحيطة بـ <MathExpression>360</MathExpression> جزء، سُمّي كل جزء لاحقاً الدرجة. وفي هذا الدرس سنستعمل قياس الزوايا بالدرجات.</p></BookElement><div className="l6-learning-goals"><strong>خريطة الرحلة</strong><span>تعريف الزاوية ورأسها وضلعَيها</span><span>قراءة المنقلة واختيار التدريج الصحيح</span><span>قياس الزاوية ورسم زاوية معلومة</span><span>تصنيف الزوايا وحل تطبيقات الكتاب</span></div><BookElement id="l6-p23-class-a" page={23} label="انطلاقة نشطة"><p>اكتب نوع الزاوية (أ) من الرسم:</p><AngleDiagram kind="right" label="(أ)" /></BookElement><BookElement id="l6-p23-class-b" page={23} label="انطلاقة نشطة"><p>اكتب نوع الزاوية (ب) من الرسم:</p><AngleDiagram kind="acute" label="(ب)" /></BookElement><BookElement id="l6-p23-class-c" page={23} label="انطلاقة نشطة"><p>اكتب نوع الزاوية (ج) من الرسم:</p><AngleDiagram kind="obtuse" label="(ج)" /></BookElement><BookElement id="l6-p23-class-d" page={23} label="انطلاقة نشطة"><p>اكتب نوع الزاوية (د) من الرسم:</p><AngleDiagram kind="straight" label="(د)" /></BookElement><ClassificationActivity /></div>
}

function ConceptStep() {
  return <div className="l6-step-content"><BookElement id="l6-p23-ray" page={23} label="تعلّم"><p>تعلّم أن نصف المستقيم هو جزء من المستقيم يبدأ من نقطة ويمتد في اتجاه واحد كما في الشكل.</p><RayDiagram /></BookElement><BookElement id="l6-p23-angle-formation" page={23} label="تعلّم"><p>الزاوية تتشكل من التقاء نصفي مستقيمين لهما نقطة بداية مشتركة.</p><div className="l6-definition-strip"><strong>الرأس</strong><span>نقطة البداية المشتركة</span><strong>الضلعان</strong><span>نصفا المستقيمين الخارجان من الرأس</span></div></BookElement><BookElement id="l6-p24-sides" page={24}><p>نسمي نصفي المستقيمين <MathExpression>[AB)</MathExpression> و<MathExpression>[AC)</MathExpression> ضلعي الزاوية.</p><RayDiagram /></BookElement><BookElement id="l6-p24-vertex" page={24}><p>نسمي <MathExpression>A</MathExpression> رأس الزاوية؛ لأنه نقطة التقاء الضلعين.</p></BookElement><BookElement id="l6-p24-notation" page={24}><p>نستعمل الترميز الآتي: نسمي الزاوية <MathExpression>Â</MathExpression> أو <MathExpression>BAC</MathExpression> أو <MathExpression>CAB</MathExpression>، ونكتب رأس الزاوية في الوسط عند استعمال ثلاثة أحرف.</p><div className="l6-notation-card"><MathExpression>∠A = ∠BAC = ∠CAB</MathExpression></div></BookElement><div className="l6-support-callout"><Lightbulb size={20} /><span><strong>قاعدة سريعة:</strong> إذا رأيت ثلاثة أحرف لزاوية، ابحث عن الحرف الأوسط أولاً؛ هو الرأس.</span></div></div>
}

function InsideOutsideStep() {
  return <div className="l6-step-content"><BookElement id="l6-p24-inside-outside" page={24}><p>في الشكل الآتي تقع النقطة <MathExpression>X</MathExpression> داخل الزاوية <MathExpression>Q</MathExpression>، والنقطة <MathExpression>B</MathExpression> تقع خارج الزاوية <MathExpression>Q</MathExpression>.</p><InsideOutsideDiagram /></BookElement><InsideOutsideActivity /><BookElement id="l6-p24-check-names" page={24} label="تحقق من فهمك"><p>في الشكل المجاور لدينا ثلاث زوايا لها نفس الرأس <MathExpression>A</MathExpression>. سمِّ تلك الزوايا.</p><div className="l6-answer-reveal"><MathExpression>∠BAC ، ∠CAD ، ∠BAD</MathExpression></div></BookElement><BookElement id="l6-p24-check-inside" page={24} label="تحقق من فهمك"><p>النقطة <MathExpression>C</MathExpression> تقع داخل الزاوية ....</p><div className="l6-fill-answer">الزاوية <MathExpression>BAD</MathExpression></div></BookElement><BookElement id="l6-p24-check-outside" page={24} label="تحقق من فهمك"><p>النقطة <MathExpression>B</MathExpression> تقع خارج الزاوية ....</p><div className="l6-fill-answer">الزاوية <MathExpression>CAD</MathExpression></div></BookElement><div className="l6-support-callout"><Target size={20} /><span>نقطة داخل زاوية تعني أنها في المنطقة المحصورة بين الضلعين، لا على الجهة الخارجية منهما.</span></div></div>
}

function ProtractorStep() {
  return <div className="l6-step-content"><BookElement id="l6-p24-protractor" page={24} label="قياس الزاوية"><p>لقياس زاوية نستعمل المنقلة. لاحظ أن المنقلة مدرجة مرتين؛ نختار التدريج الملائم عند قياس زاوية أو رسمها.</p><ZoomableProtractor degree={35} title="أجزاء المنقلة وتدريجاها" /></BookElement><InteractiveProtractor /><div className="l6-two-column"><div className="l6-rule-card"><span>1</span><strong>المركز</strong><p>ضع مركز المنقلة عند رأس الزاوية.</p></div><div className="l6-rule-card"><span>2</span><strong>خط الصفر</strong><p>طابق خط الصفر مع ضلع البداية.</p></div><div className="l6-rule-card"><span>3</span><strong>التدريج</strong><p>ابدأ العد من الصفر الصحيح.</p></div><div className="l6-rule-card"><span>4</span><strong>التحقق</strong><p>قارن القياس بنوع الزاوية.</p></div></div></div>
}

function MeasureStep() {
  return <div className="l6-step-content"><BookElement id="l6-p25-measure-steps" page={25} label="قياس زاوية"><p>لقياس زاوية اتبع الخطوات الآتية:</p><ol className="l6-numbered"><li>ضع مركز المنقلة عند رأس الزاوية <MathExpression>A</MathExpression>.</li><li>طابق خط الصفر على أحد ضلعي الزاوية، وليكن <MathExpression>[AC)</MathExpression> مثلاً، والضلع الآخر <MathExpression>[AB)</MathExpression> في منطقة القياس.</li><li>اقرأ القياس على تدريج المنقلة الذي تحدده الضلع الآخر: ابدأ العد من التدريج <MathExpression>0°</MathExpression> المطابق لـ <MathExpression>[AC)</MathExpression> حتى تصل إلى التدريجة التي تقابل <MathExpression>[AB)</MathExpression>.</li></ol></BookElement><BookElement id="l6-p25-angle-35" page={25} label="مثال"><p>في المثال نجد أن قياس الزاوية <MathExpression>A</MathExpression> هو <MathExpression>35°</MathExpression>، ونكتب: <MathExpression>Â = 35°</MathExpression>.</p><div className="l6-angle-example"><AngleDiagram kind="acute" degree={35} label="35°" /><ProtractorSvg degree={35} compact /></div></BookElement><div className="l6-mistake-callout"><MousePointer2 size={19} /><span>خطأ شائع: قراءة الرقم المقابل على التدريج الآخر. اسأل: أين يقع الصفر الذي لامس ضلع البداية؟</span></div><div className="l6-steps-strip"><span>ضع المركز</span><b>←</b><span>طابق الصفر</span><b>←</b><span>اقرأ التدريج</span><b>←</b><span>تحقق بالنوع</span></div></div>
}

function ExamplesStep() {
  return <div className="l6-step-content"><BookElement id="l6-p25-example-straight" page={25} label="مثال"><div className="l6-example-row"><AngleDiagram kind="straight" label="∠SQB" /><div><MathExpression>∠SQB = 180°</MathExpression><p>ضلعان متعاكسان؛ زاوية مستقيمة.</p></div></div></BookElement><BookElement id="l6-p25-example-right" page={25} label="مثال"><div className="l6-example-row"><AngleDiagram kind="right" label="∠KLM" /><div><MathExpression>∠KLM = 90°</MathExpression><p>ضلعان متعامدان؛ زاوية قائمة.</p></div></div></BookElement><BookElement id="l6-p25-example-obtuse" page={25} label="مثال"><div className="l6-example-row"><AngleDiagram kind="obtuse" degree={120} label="∠FGK" /><div><MathExpression>∠FGK = 120°</MathExpression><p>بين 90° و180°؛ زاوية منفرجة.</p></div></div></BookElement><BookElement id="l6-p26-check-hij" page={26} label="تحقق من فهمك"><p>استعمل المنقلة وقس الزاوية <MathExpression>HÎJ</MathExpression>.</p><strong className="l6-answer-pill"><MathExpression>90°</MathExpression></strong></BookElement><BookElement id="l6-p26-check-klm" page={26} label="تحقق من فهمك"><p>استعمل المنقلة وقس الزاوية <MathExpression>K̂LM</MathExpression>.</p><strong className="l6-answer-pill"><MathExpression>50°</MathExpression></strong></BookElement><BookElement id="l6-p26-check-nab" page={26} label="تحقق من فهمك"><p>استعمل المنقلة وقس الزاوية <MathExpression>NÂB</MathExpression>.</p><strong className="l6-answer-pill"><MathExpression>60°</MathExpression></strong></BookElement><BookElement id="l6-p26-check-lsu" page={26} label="تحقق من فهمك"><p>استعمل المنقلة وقس الزاوية <MathExpression>L̂SU</MathExpression>.</p><strong className="l6-answer-pill"><MathExpression>180°</MathExpression></strong></BookElement><BookElement id="l6-p26-check-fde" page={26} label="تحقق من فهمك"><p>استعمل المنقلة وقس الزاوية <MathExpression>F̂DE</MathExpression>.</p><strong className="l6-answer-pill"><MathExpression>120°</MathExpression></strong></BookElement><MeasurementGallery /></div>
}

function DrawStep() {
  return <div className="l6-step-content"><BookElement id="l6-p26-aerial" page={26} label="تطبيق"><p>للتلفاز هوائي داخلي كما في الشكل. هل يختلف قياس الزاوية إذا ازداد طول الهوائي؟ اشرح.</p><div className="l6-aerial"><div /><div /></div><p className="l6-answer-text">لا يختلف القياس؛ لأن الاتجاه والفتحة بين الضلعين لم يتغيرا.</p></BookElement><BookElement id="l6-p26-draw-steps" page={26} label="رسم زاوية معلومة القياس"><p>لرسم زاوية معلومة القياس: ارسم الضلع، عيّن الرأس، طابق مركز المنقلة وخط الصفر، عيّن النقطة عند القياس، ثم صلّ الرأس بالنقطة.</p><ol className="l6-numbered"><li>ارسم الضلع <MathExpression>[BC)</MathExpression> وعيّن الرأس <MathExpression>B</MathExpression>.</li><li>ضع مركز المنقلة عند <MathExpression>B</MathExpression> وطابق خط الصفر مع <MathExpression>[BC)</MathExpression>.</li><li>ابدأ من <MathExpression>0°</MathExpression> وعيّن النقطة <MathExpression>A</MathExpression> عند <MathExpression>50°</MathExpression>.</li><li>صل بين <MathExpression>B</MathExpression> و<MathExpression>A</MathExpression>.</li></ol></BookElement><BookElement id="l6-p26-draw-example" page={26} label="مثال"><p>رسمنا بذلك الزاوية <MathExpression>CBA</MathExpression> التي قياسها <MathExpression>50°</MathExpression>.</p><DrawAngleActivity /></BookElement><BookElement id="l6-p27-draw-90" page={27} label="تحقق من فهمك"><p>ارسم الزاوية <MathExpression>YÔX = 90°</MathExpression>.</p><div className="l6-drawn-answer"><AngleDiagram kind="right" degree={90} label="90°" /></div></BookElement><BookElement id="l6-p27-draw-160" page={27} label="تحقق من فهمك"><p>ارسم الزاوية <MathExpression>R̂TM = 160°</MathExpression>.</p><div className="l6-drawn-answer"><AngleDiagram kind="obtuse" degree={160} label="160°" /></div></BookElement><BookElement id="l6-p27-draw-180" page={27} label="تحقق من فهمك"><p>ارسم الزاوية <MathExpression>Q̂FC = 180°</MathExpression>.</p><div className="l6-drawn-answer"><AngleDiagram kind="straight" degree={180} label="180°" /></div></BookElement></div>
}

function ClassificationStep() {
  return <div className="l6-step-content"><BookElement id="l6-p27-right-definition" page={27} label="تصنيف الزوايا"><div className="l6-type-row"><AngleDiagram kind="right" /><div><h3>الزاوية القائمة</h3><MathExpression>A = 90°</MathExpression><p>يرمز لها غالباً بمربع صغير.</p></div></div></BookElement><BookElement id="l6-p27-acute-definition" page={27} label="تصنيف الزوايا"><div className="l6-type-row"><AngleDiagram kind="acute" /><div><h3>الزاوية الحادة</h3><p>قياسها أصغر من <MathExpression>90°</MathExpression>.</p></div></div></BookElement><BookElement id="l6-p27-straight-definition" page={27} label="تصنيف الزوايا"><div className="l6-type-row"><AngleDiagram kind="straight" /><div><h3>الزاوية المستقيمة</h3><MathExpression>C = 180°</MathExpression></div></div></BookElement><BookElement id="l6-p27-obtuse-definition" page={27} label="تصنيف الزوايا"><div className="l6-type-row"><AngleDiagram kind="obtuse" /><div><h3>الزاوية المنفرجة</h3><p>قياسها بين <MathExpression>90°</MathExpression> و <MathExpression>180°</MathExpression>.</p></div></div></BookElement><BookElement id="l6-p27-hanger" page={27} label="تحقق من فهمك"><p>ما نوع كل من الزوايا التي تراها في صورة علاقة الملابس؟</p><div className="l6-hanger"><div className="l6-hanger-shape" /></div><p className="l6-answer-text">زاويتا القاعدة حادتان، والزاوية عند الرأس منفرجة.</p></BookElement><div className="l6-type-guide"><span className="acute">حادة &lt; 90°</span><span className="right">قائمة = 90°</span><span className="obtuse">منفرجة بين 90° و180°</span><span className="straight">مستقيمة = 180°</span></div></div>
}

function PracticeStep() {
  const [bmc, setBmc] = useState('')
  const [tableChoice, setTableChoice] = useState<string | null>(null)
  return <div className="l6-step-content"><BookElement id="l6-p28-draw-60" page={28} label="تدرّب ①"><p>استعمل المنقلة وارسم الزاوية <MathExpression>BMW</MathExpression> حيث <MathExpression>∠BMW = 60°</MathExpression>.</p><AngleDiagram kind="acute" degree={60} label="60°" /></BookElement><BookElement id="l6-p28-add-c" page={28} label="تدرّب ①"><p>ارسم النقطة <MathExpression>C</MathExpression> خارج <MathExpression>∠BMW</MathExpression> حيث <MathExpression>∠WMC = 30°</MathExpression> على الشكل نفسه.</p><div className="l6-supplemental-angle"><AngleDiagram kind="acute" degree={60} label="60°" /><span>+</span><AngleDiagram kind="acute" degree={30} label="30°" /></div></BookElement><BookElement id="l6-p28-angle-bmc" page={28} label="تدرّب ①"><p>استعمل المنقلة واكتب قياس <MathExpression>∠BMC</MathExpression>.</p><div className="l6-answer-input"><input aria-label="قياس BMC" value={bmc} onChange={event => setBmc(event.target.value)} placeholder="؟" /><button type="button" onClick={() => setBmc('90')}>تحقق</button></div>{bmc && <p className={bmc === '90' ? 'l6-feedback is-good' : 'l6-feedback'}>{bmc === '90' ? 'أحسنت: 60° + 30° = 90°.' : 'اجمع الزاويتين المتجاورتين.'}</p>}</BookElement><BookElement id="l6-p28-table-aqb" page={28} label="تدرّب ②"><p>أكمل الجدول: <MathExpression>∠AQB = 90°</MathExpression> (معطاة).</p><AngleWheel /><strong className="l6-answer-pill"><MathExpression>∠AQB = 90°</MathExpression></strong></BookElement><BookElement id="l6-p28-table-aqz" page={28} label="تدرّب ②"><p>قياس <MathExpression>∠AQZ</MathExpression> = <MathExpression>180°</MathExpression>.</p></BookElement><BookElement id="l6-p28-table-aqx" page={28} label="تدرّب ②"><p>قياس <MathExpression>∠AQX</MathExpression> = <MathExpression>45°</MathExpression>.</p></BookElement><BookElement id="l6-p28-table-zqx" page={28} label="تدرّب ②"><p>قياس <MathExpression>∠ZQX</MathExpression> = <MathExpression>135°</MathExpression>.</p></BookElement><BookElement id="l6-p28-table-aqc" page={28} label="تدرّب ②"><p>الزاوية التي قياسها <MathExpression>120°</MathExpression> هي <MathExpression>∠AQC</MathExpression>.</p><div className="l6-answer-table"><span>∠AQB</span><b>90°</b><span>∠AQX</span><b>45°</b><span>∠AQZ</span><b>180°</b><span>∠ZQX</span><b>135°</b><span>∠AQC</span><b>120°</b></div></BookElement><div className="l6-quick-check"><strong>جرّب قبل كشف الحل</strong><div className="l6-choice-row">{['45°', '90°', '120°'].map(option => <button type="button" key={option} className={tableChoice === option ? 'is-selected' : ''} onClick={() => setTableChoice(option)}>{option}</button>)}</div>{tableChoice && <p className="l6-feedback">تذكّر: ∠AQX تقرأ من الشعاع A إلى X، والجواب الصحيح 45°.</p>}</div></div>
}

function BookExercisesStep() {
  return <div className="l6-step-content"><div className="l6-exercise-banner"><Sparkles size={18} /> كل فرع من فروع التمرين محفوظ هنا، لا تكتفِ بإجابة واحدة.</div><BookElement id="l6-p29-angle-xqb" page={29} label="تدرّب ②"><p><MathExpression>∠XQB = 45°</MathExpression></p></BookElement><BookElement id="l6-p29-angle-bqy" page={29} label="تدرّب ②"><p><MathExpression>∠BQY = 45°</MathExpression></p></BookElement><BookElement id="l6-p29-angle-zqy" page={29} label="تدرّب ②"><p><MathExpression>∠ZQY = 45°</MathExpression></p></BookElement><BookElement id="l6-p29-angle-bqc" page={29} label="تدرّب ②"><p><MathExpression>∠BQC = 30°</MathExpression></p></BookElement><BookElement id="l6-p29-right-discovery" page={29} label="تدرّب ②"><p>الزاويتان القائمتان الأخريان هما <MathExpression>∠BQZ</MathExpression> و <MathExpression>∠XQY</MathExpression>.</p></BookElement><AngleWheel /><BookElement id="l6-p29-colored-j" page={29} label="تدرّب ③"><p>الزاوية الملونة عند <MathExpression>J</MathExpression> قياسها <MathExpression>35°</MathExpression>.</p></BookElement><BookElement id="l6-p29-colored-i" page={29} label="تدرّب ③"><p>الزاوية الملونة عند <MathExpression>I</MathExpression> قياسها <MathExpression>35°</MathExpression>.</p></BookElement><BookElement id="l6-p29-colored-f" page={29} label="تدرّب ③"><p>الزاوية الملونة عند <MathExpression>F</MathExpression> قياسها <MathExpression>60°</MathExpression> تقريباً.</p></BookElement><BookElement id="l6-p29-colored-d" page={29} label="تدرّب ③"><p>الزاوية الملونة عند <MathExpression>D</MathExpression> قياسها <MathExpression>90°</MathExpression>.</p></BookElement><GeometryFigures /><BookElement id="l6-p29-triangle-b" page={29} label="تدرّب ④"><p><MathExpression>∠B = 90°</MathExpression>.</p></BookElement><BookElement id="l6-p29-triangle-a" page={29} label="تدرّب ④"><p><MathExpression>∠CAB = 30°</MathExpression> تقريباً.</p></BookElement><BookElement id="l6-p29-triangle-c" page={29} label="تدرّب ④"><p><MathExpression>∠BCA = 60°</MathExpression> تقريباً.</p></BookElement><BookElement id="l6-p29-circle-bmc" page={29} label="تدرّب ⑤"><p><MathExpression>∠BMC = 90°</MathExpression>.</p></BookElement><BookElement id="l6-p29-circle-cnb" page={29} label="تدرّب ⑤"><p><MathExpression>∠CNB = 90°</MathExpression>.</p></BookElement><BookElement id="l6-p29-circle-boc" page={29} label="تدرّب ⑤"><p><MathExpression>∠BOC = 180°</MathExpression>.</p></BookElement><TriangleAndCircleFigures /><BookElement id="l6-p29-square-a" page={29} label="تدرّب ⑥"><p><MathExpression>A = 90°</MathExpression>.</p></BookElement><BookElement id="l6-p29-square-b" page={29} label="تدرّب ⑥"><p><MathExpression>B = 90°</MathExpression>.</p></BookElement><BookElement id="l6-p29-square-c" page={29} label="تدرّب ⑥"><p><MathExpression>C = 90°</MathExpression>.</p></BookElement><BookElement id="l6-p29-square-d" page={29} label="تدرّب ⑥"><p><MathExpression>D = 90°</MathExpression>.</p></BookElement><SquareFigure /></div>
}

function ApplicationsStep() {
  return <div className="l6-step-content"><BookElement id="l6-p30-square-colors" page={30} label="تدرّب ⑦"><p>في المربع، الزاويتان الملونتان هما <MathExpression>∠DAC</MathExpression> و <MathExpression>∠ACB</MathExpression>، وقياس كل منهما <MathExpression>45°</MathExpression>.</p><SquareFigure colored /></BookElement><BookElement id="l6-p30-plane" page={30} label="طيران"><p>انحرفت الطائرة المجاورة عن مسارها؛ ما مقدار زاوية الانحراف؟</p><div className="l6-plane-figure"><div className="l6-plane-path old" /><div className="l6-plane-path new" /><span>30°</span></div><p className="l6-answer-text">زاوية الانحراف 30°.</p></BookElement><BookElement id="l6-p30-birds" page={30} label="من الطبيعة"><p>عندما تشاهد أسراب الأوز المهاجرة باتجاه أماكن أكثر دفئاً، ما قياس الزاوية في الشكل؟</p><div className="l6-birds-figure"><span>• • •</span><b>⌞</b></div><p className="l6-answer-text">قياس الزاوية نحو 120°.</p></BookElement><BookElement id="l6-p30-bike-1" page={30} label="تطبيق الدراجة"><p>الزاوية 1: حادة.</p></BookElement><BookElement id="l6-p30-bike-2" page={30} label="تطبيق الدراجة"><p>الزاوية 2: منفرجة.</p></BookElement><BookElement id="l6-p30-bike-3" page={30} label="تطبيق الدراجة"><p>الزاوية 3: حادة.</p></BookElement><BookElement id="l6-p30-bike-4" page={30} label="تطبيق الدراجة"><p>الزاوية 4: منفرجة.</p></BookElement><BikeAngleCards /><BookElement id="l6-p30-triangle-acute" page={30} label="تدرّب ⑪"><p>عدد الزوايا الحادة في المثلث: <strong>2</strong>.</p></BookElement><BookElement id="l6-p30-triangle-obtuse" page={30} label="تدرّب ⑪"><p>عدد الزوايا المنفرجة في المثلث: <strong>1</strong>.</p></BookElement><div className="l6-final-application"><strong>فكّر كخبير قياس:</strong><span>القياس ليس حفظ رقم؛ ثبّت الرأس، اختر الصفر، اقرأ التدريج، ثم صنّف الزاوية وتحقق من معقولية النتيجة.</span></div></div>
}

function RecapStep() {
  return <div className="l6-recap"><div className="l6-recap-icon"><RotateCcw size={26} /></div><h3>خلاصة قياس الزوايا</h3><ul><li>الزاوية تتشكل من التقاء نصفي مستقيمين لهما رأس مشترك.</li><li>اسم الزاوية بثلاثة أحرف يكتب الرأس في الوسط.</li><li>ضع مركز المنقلة على الرأس، وطابق خط الصفر مع ضلع البداية.</li><li>ابدأ من التدريج الذي يحمل <MathExpression>0°</MathExpression> عند ضلع البداية، لا من الرقم الأقرب عشوائياً.</li><li>حادة أصغر من <MathExpression>90°</MathExpression>، قائمة تساوي <MathExpression>90°</MathExpression>، منفرجة بين <MathExpression>90°</MathExpression> و<MathExpression>180°</MathExpression>، مستقيمة تساوي <MathExpression>180°</MathExpression>.</li><li>الطول لا يغيّر قياس الزاوية؛ اتجاه الضلعين والفتحة هما المهمان.</li></ul><div className="l6-recap-chips"><span>ثبّت الرأس</span><span>طابق الصفر</span><span>اقرأ التدريج</span><span>تحقق بالنوع</span></div></div>
}

function FinalTest() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const normalize = (value: string) => value.trim().replace(/[°،,\s]/g, '')
  const score = finalAssessment6.filter(question => normalize(answers[question.id] ?? '') === normalize(question.answer)).length
  return <div className="l6-final-test"><div className="l6-exercise-banner"><Check size={18} /> اختبار جديد: طبّق الفكرة في مواقف غير منقولة حرفياً من الكتاب.</div><p>اقرأ كل سؤال ببطء. في أسئلة الاختيار، ابحث عن السبب لا عن التخمين.</p><InteractiveProtractor />{finalAssessment6.map((question, index) => <label className="l6-test-question" key={question.id}><strong>{index + 1}. {question.text}</strong>{question.type === 'input' ? <input dir="ltr" value={answers[question.id] ?? ''} onChange={event => setAnswers({ ...answers, [question.id]: event.target.value })} placeholder="اكتب الإجابة" /> : <div className="l6-choice-row">{question.options?.map(option => <button type="button" key={option} className={answers[question.id] === option ? 'is-selected' : ''} onClick={() => setAnswers({ ...answers, [question.id]: option })}>{option}</button>)}</div>}</label>)}<button type="button" className="l6-submit" onClick={() => setSubmitted(true)}>عرض النتيجة <Check size={16} /></button>{submitted && <div className="l6-result"><strong>نتيجتك: <MathExpression>{score} / {finalAssessment6.length}</MathExpression></strong><p>{score === finalAssessment6.length ? 'إتقان رائع! أصبحت تقيس الزوايا وتتحقق من قراءتك.' : 'أعد مشاهدة خطوات القياس، ثم صحح الأخطاء واحدةً واحدة.'}</p></div>}</div>
}

export function AnglesLesson() {
  const steps: LessonStep[] = [
    { id: 'launch', title: 'انطلاقة الدرس', content: <IntroStep /> },
    { id: 'concept', title: 'ما الزاوية؟', content: <ConceptStep /> },
    { id: 'inside-outside', title: 'داخل الزاوية وخارجها', content: <InsideOutsideStep /> },
    { id: 'protractor', title: 'تعرّف إلى المنقلة', content: <ProtractorStep /> },
    { id: 'measure', title: 'كيف نقيس زاوية؟', content: <MeasureStep /> },
    { id: 'examples', title: 'أمثلة القياس', content: <ExamplesStep /> },
    { id: 'draw', title: 'رسم زاوية معلومة', content: <DrawStep /> },
    { id: 'classify', title: 'تصنيف الزوايا', content: <ClassificationStep /> },
    { id: 'practice', title: 'تدرّب ① و②', content: <PracticeStep /> },
    { id: 'book-exercises', title: 'تمارين الكتاب ③–⑥', content: <BookExercisesStep /> },
    { id: 'applications', title: 'تطبيقات الدرس', content: <ApplicationsStep /> },
    { id: 'recap', title: 'الخلاصة', content: <RecapStep /> },
    { id: 'test', title: 'الاختبار النهائي', content: <FinalTest /> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return <><LessonShell title="قياس الزوايا" steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-six" /><BookCoverageMarkers /></>
}
