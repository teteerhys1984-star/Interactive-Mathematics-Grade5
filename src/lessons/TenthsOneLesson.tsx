import { useState, type ReactNode } from 'react'
import { ArrowLeft, Check, CircleAlert, Lightbulb, RotateCcw, Sparkles } from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import {
  compareRationalValues, decimalForTenths, fractionForTenths, isAcceptedVerbalTenths, isDecimalEquivalentToTenths,
  isEquivalentToTenths, isNaturalValue, isStrictlyBetweenTenths, isTenthsFractionInput, lessonTitle,
  normalizeNumericGlyphs, p62ComparisonItems, p62GridItems, p63CheckOneItems, p63CheckThreeItems,
  p63ExampleItems, p64ComparisonItems, p64NumberLineValues, p64TableColumns, p65ComparisonItems,
  p65MatchDecimals, p65MatchFractions, p65RulerItems, p65ShadingItems, p65VerbalItems,
} from './tenthsOneData'

/* ─────────────────────────── Isolated mathematical notation ─────────────────────────── */

function L6Fraction({ numerator, denominator, label }: { numerator: number | string; denominator: number | string; label?: string }) {
  return <span className="l6-fraction" dir="ltr" role="img" aria-label={label ?? `${numerator} على ${denominator}`}>
    <span>{numerator}</span><span className="l6-fraction-rule" aria-hidden="true" /><span>{denominator}</span>
  </span>
}

function L6Decimal({ children }: { children: ReactNode }) {
  return <MathExpression className="l6-decimal">{children}</MathExpression>
}

function L6Value({ value }: { value: string }) {
  const fraction = /^(\d+)\/(\d+)$/u.exec(value)
  return fraction
    ? <L6Fraction numerator={fraction[1]} denominator={fraction[2]} />
    : <L6Decimal>{value}</L6Decimal>
}

function SourceMarker({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return <div className={`l6-source-marker ${className}`} data-source-id={id}>{children}</div>
}

function CheckFeedback({ result, success, incomplete = 'أكمل المطلوب أولاً.', failure = 'ليست الإجابة المطلوبة بعد؛ أعد العد أو قارن القيم ثم حاول مرة أخرى.' }: {
  result: 'correct' | 'incorrect' | 'incomplete' | undefined
  success: string
  incomplete?: string
  failure?: string
}) {
  if (!result) return null
  const text = result === 'correct' ? success : result === 'incomplete' ? incomplete : failure
  return <p className={`l6-feedback is-${result}`} role={result === 'incorrect' ? 'alert' : 'status'}>
    {result === 'correct' ? <Check size={16} aria-hidden="true" /> : <CircleAlert size={16} aria-hidden="true" />}{text}
  </p>
}

type AnswerField = { label: string; placeholder?: string; inputMode?: 'text' | 'decimal' | 'numeric' }

function AnswerTask({ id, title, prompt, fields, check, success, help, className = '' }: {
  id: string
  title: string
  prompt: ReactNode
  fields: readonly AnswerField[]
  check: (values: readonly string[]) => boolean
  success: string
  help?: string
  className?: string
}) {
  const [values, setValues] = useState<string[]>(() => fields.map(() => ''))
  const [result, setResult] = useState<'correct' | 'incorrect' | 'incomplete'>()
  const verify = () => {
    if (values.some((value) => !value.trim())) { setResult('incomplete'); return }
    setResult(check(values) ? 'correct' : 'incorrect')
  }
  return <article className={`l6-answer-task ${className}`} data-source-id={id}>
    <div className="l6-task-heading"><span className="l6-task-index">{title}</span><div className="l6-task-prompt">{prompt}</div></div>
    <div className={`l6-task-fields ${fields.length > 1 ? 'has-many' : ''}`}>
      {fields.map((field, index) => <label className="l6-answer-field" key={`${id}-field-${index}`}>
        <span>{field.label}</span>
        <input type="text" inputMode={field.inputMode ?? 'text'} autoComplete="off" dir={field.inputMode === 'text' ? 'rtl' : 'ltr'} maxLength={36} value={values[index]}
          aria-label={`${title}: ${field.label}`} onChange={(event) => { const next = [...values]; next[index] = event.currentTarget.value; setValues(next); setResult(undefined) }} placeholder={field.placeholder} />
      </label>)}
    </div>
    <div className="l6-task-actions"><button type="button" className="l6-check-button" onClick={verify}>تحقّق</button>{help && <span className="l6-task-hint">{help}</span>}</div>
    <CheckFeedback result={result} success={success} />
  </article>
}

function OperatorTask({ id, label, left, right, relation }: { id: string; label: string; left: string; right: string; relation: '<' | '=' | '>' }) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<'correct' | 'incorrect' | 'incomplete'>()
  const verify = () => {
    if (!answer) { setResult('incomplete'); return }
    const actual = compareRationalValues(left, right)
    const expected: -1 | 0 | 1 = relation === '<' ? -1 : relation === '>' ? 1 : 0
    setResult(actual === expected && answer === relation ? 'correct' : 'incorrect')
  }
  return <article className="l6-operator-task" data-source-id={id}>
    <span className="l6-task-index">({label})</span>
    <div className="l6-comparison-expression" dir="ltr"><L6Value value={left} /><label className="l6-operator-select">
      <span className="visually-hidden">رمز المقارنة للبند {label}</span>
      <select value={answer} aria-label={`رمز المقارنة للبند ${label}`} onChange={(event) => { setAnswer(event.currentTarget.value); setResult(undefined) }}>
        <option value="">□</option><option value="&gt;">&gt;</option><option value="&lt;">&lt;</option><option value="=">=</option>
      </select>
    </label><L6Value value={right} /></div>
    <button type="button" className="l6-check-button is-compact" onClick={verify}>تحقّق</button>
    <CheckFeedback result={result} success="صحيح؛ الرمز يعبّر عن العلاقة بين القيمتين." incomplete="اختر الرمز أولاً." />
  </article>
}

function TenthsGrid({ count, label }: { count: number; label: string }) {
  return <div className="l6-tenths-grid" role="img" aria-label={label} dir="ltr">
    {Array.from({ length: 10 }, (_, index) => <span key={index} className={index < count ? 'is-shaded' : ''} />)}
  </div>
}

function PlainCube({ label }: { label: string }) {
  return <svg className="l6-cube-svg" viewBox="0 0 120 108" role="img" aria-label={label}>
    <polygon points="15,32 39,12 96,12 72,32" className="l6-prism-top-base" />
    <polygon points="15,32 72,32 72,91 15,91" className="l6-prism-front" />
    <polygon points="72,32 96,12 96,71 72,91" className="l6-prism-side" />
  </svg>
}

function TenSlicePrism({ count, label }: { count: number; label: string }) {
  const x = 12
  const y = 27
  const cell = 9
  const depthX = 15
  const depthY = 14
  const height = 73
  const frontWidth = cell * 10
  return <svg className="l6-prism-svg" viewBox="0 0 132 113" role="img" aria-label={label}>
    <polygon points={`${x},${y} ${x + depthX},${y - depthY} ${x + frontWidth + depthX},${y - depthY} ${x + frontWidth},${y}`} className="l6-prism-top-base" />
    {Array.from({ length: 10 }, (_, index) => {
      const left = x + index * cell
      const shaded = index >= 10 - count
      return <polygon key={`top-${index}`} points={`${left},${y} ${left + depthX},${y - depthY} ${left + depthX + cell},${y - depthY} ${left + cell},${y}`} className={shaded ? 'l6-prism-top is-blue' : 'l6-prism-top'} />
    })}
    <polygon points={`${x + frontWidth},${y} ${x + frontWidth + depthX},${y - depthY} ${x + frontWidth + depthX},${y + height - depthY} ${x + frontWidth},${y + height}`} className="l6-prism-side" />
    {Array.from({ length: 10 }, (_, index) => <rect key={index} x={x + index * cell} y={y} width={cell} height={height} className={index >= 10 - count ? 'l6-prism-front is-blue' : 'l6-prism-front'} />)}
    <line x1={x} y1={y + height} x2={x + frontWidth} y2={y + height} className="l6-prism-outline" />
  </svg>
}

function MiniNumberLine({ numerator }: { numerator: number }) {
  const decimal = decimalForTenths(numerator)
  return <div className="l6-mini-numberline" role="img" dir="ltr" aria-label={`خط أعداد من 0 إلى 1، موضع ${decimal}`}>
    <div className="l6-mini-numberline-track">{Array.from({ length: 11 }, (_, index) => <span className={`l6-mini-numberline-point ${index === numerator ? 'is-current' : ''}`} key={index}>
      <b>{index === numerator ? decimal : ''}</b><i />
    </span>)}</div>
    <div className="l6-mini-numberline-ends"><span>0</span><span>1</span></div>
  </div>
}

function TenthsSliderLab() {
  const [tenths, setTenths] = useState(4)
  return <section className="l6-platform-lab" aria-labelledby="l6-slider-lab-title" data-platform-activity="l6-tenths-slider">
    <div className="l6-source-label is-platform"><Sparkles size={14} aria-hidden="true" /> مختبر تفاعلي · من إعداد المنصة</div>
    <h3 id="l6-slider-lab-title">حرّك المؤشر: كم عُشراً اخترت؟</h3>
    <p>كل خطوة من المؤشر تلوّن جزءاً واحداً من عشرة. لاحظ كيف يتغيّر الكسر والعدد العشري معاً.</p>
    <label className="l6-slider-label"><span>عدد الأجزاء الملوّنة: <strong>{tenths}</strong> من 10</span>
      <input type="range" min="0" max="10" step="1" value={tenths} onChange={(event) => setTenths(Number(event.currentTarget.value))} aria-valuetext={`${tenths} من عشرة`} />
    </label>
    <div className="l6-slider-readout"><TenthsGrid count={tenths} label={`${tenths} أجزاء ملوّنة من أصل عشرة`} />
      <div><L6Fraction numerator={tenths} denominator={10} /><span aria-hidden="true">=</span><L6Decimal>{decimalForTenths(tenths)}</L6Decimal></div>
    </div>
    <p className="l6-platform-note">عند تلوين الأجزاء العشرة كلها، نحصل على واحد كامل.</p>
  </section>
}

/* ───────────────────────────── Step 1 · discover tenths ───────────────────────────── */

function DiscoveryStep() {
  return <div className="l6-step-content">
    <div className="l6-step-intro"><span className="l6-step-number">01</span><div><p>العدد العشري لا يغيّر الكمية؛ إنه طريقة أخرى لكتابة أجزاء من الكل.</p><strong>في هذا الدرس نركّز على أجزاء مقامها عشرة.</strong></div></div>
    <SourceMarker id="l6-p62-title"><SourceCard label="من الكتاب · ص62 · عنوان الدرس وأهدافه">
      <h3 className="l6-source-title">الأجزاء العشرية (1)</h3>
      <p>نتعلّم كتابة الأجزاء من عشرة كتابة عشرية ولفظية، ثم مقارنتها.</p>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p62-discover" className="l6-fact-card"><SourceCard label="من الكتاب · ص62 · هل تعلم">
      <p>الماء يقارب <L6Fraction numerator={6} denominator={10} /> من وزن جسم الإنسان، ويغطي نحو <L6Fraction numerator={7} denominator={10} /> من سطح الأرض.</p>
      <div className="l6-fact-branches">
        <div data-source-id="l6-p62-fact-body"><span>من وزن الجسم</span><L6Fraction numerator={6} denominator={10} /></div>
        <div data-source-id="l6-p62-fact-earth"><span>من سطح الأرض</span><L6Fraction numerator={7} denominator={10} /></div>
      </div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p62-cube"><SourceCard label="من الكتاب · ص62 · انطلاقة نشطة">
      <p>قُسّم المكعّب في الرسم إلى عشر شرائح متساوية. كل شريحة واحدة من عشرة من المجسّم.</p>
      <div className="l6-cube-demo" dir="ltr"><PlainCube label="مكعب كامل قبل التقسيم" /><span aria-hidden="true">→</span><TenSlicePrism count={0} label="المكعب نفسه بعد تقسيمه إلى عشر شرائح متساوية" /></div>
    </SourceCard></SourceMarker>
    <TenthsSliderLab />
  </div>
}

/* ───────────────────────────── Step 2 · decimal notation ───────────────────────────── */

function NotationStep() {
  return <div className="l6-step-content">
    <div className="l6-step-intro"><span className="l6-step-number">02</span><div><p>المقام 10 يعني أن الكل قُسّم إلى عشرة أجزاء متساوية.</p><strong>في الكتابة العشرية، يبيّن الرقم بعد الفاصلة عدد الأجزاء من عشرة.</strong></div></div>
    <SourceMarker id="l6-p62-definition"><SourceCard label="من الكتاب · ص62 · التعريف">
      <p>الكسر الذي مقامه 10 وبسطه أحد الأعداد من 1 إلى 9 يمثّل أجزاءً من عشرة.</p>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p63-decimal-model"><SourceCard label="من الكتاب · ص63 · تتمة التعريف والمخطط">
      <p>الكتابة العشرية طريقة أبسط لتمثيل الكسر ذي المقام 10:</p>
      <div className="l6-place-value-model" dir="ltr"><span>0</span><span className="l6-decimal-point" aria-label="الفاصلة العشرية">.</span><span className="l6-digit-placeholder">□</span></div>
      <div className="l6-place-value-labels"><span>الصفر</span><span>الفاصلة العشرية · نكتبها هنا بالنقطة</span><span>عدد الأجزاء من عشرة</span></div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p63-examples"><SourceCard label="من الكتاب · ص63 · المثال والشبكات">
      <p>كل صف يربط الكسر والكتابة العشرية والتعبير اللفظي بالشبكة وخط الأعداد الصغير المطبوع تحتهما.</p>
      <div className="l6-example-table">
        {p63ExampleItems.map((item) => <div className="l6-example-row" key={item.id} data-source-id={item.id}>
          <span className="l6-example-word">{item.label}</span><L6Fraction numerator={item.numerator} denominator={item.denominator} />
          <span className="l6-equivalence" aria-hidden="true">=</span><L6Decimal>{decimalForTenths(item.numerator)}</L6Decimal>
          <TenthsGrid count={item.numerator} label={`${item.numerator} خلايا زرقاء من عشرة`} /><MiniNumberLine numerator={item.numerator} />
        </div>)}
      </div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p63-ten-tenths"><SourceCard label="من الكتاب · ص63 · الرسم التوضيحي">
      <div className="l6-whole-model">
        <div className="l6-whole-representations"><div className="l6-whole-bar" role="img" aria-label="شريط كامل أزرق يمثل الواحد" /><TenthsGrid count={10} label="عشر خلايا ملوّنة من عشرة، أي واحد كامل" /></div>
        <div className="l6-whole-equation"><L6Fraction numerator={10} denominator={10} /><span aria-hidden="true">=</span><L6Decimal>1</L6Decimal></div>
      </div>
      <p>كل عشرة أجزاء من عشرة تعادل واحداً كاملاً.</p>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p63-decimal-note"><SourceCard label="من الكتاب · ص63 · ملاحظة (المعنى المؤكد)">
      <p>توضح الملاحظة المطبوعة طريقة إظهار الفاصلة العشرية عند استعمال الأرقام العربية، وتورد أمثلة للأجزاء: 0.1 و0.4 و0.8.</p>
      <p className="l6-source-caveat">شكل المحرف الطباعي الصغير داخل القوسين غير محسوم في صورة المصدر؛ لذلك لا ننسخه حرفياً.</p>
    </SourceCard></SourceMarker>
    <aside className="l6-platform-note-box"><strong>توضيح من المنصة:</strong> في هذه الواجهة نعرض النقطة العشرية بهذا الشكل: <L6Decimal>0.1</L6Decimal>.</aside>
  </div>
}

/* ───────────────────────────── Step 3 · compare tenths ───────────────────────────── */

function ComparisonStep() {
  return <div className="l6-step-content">
    <div className="l6-step-intro"><span className="l6-step-number">03</span><div><p>إذا كان المقامان متساويين، نقارن البسطين.</p><strong>في الأجزاء من عشرة، الأكبر بسطاً يعني قيمة أكبر.</strong></div></div>
    <SourceMarker id="l6-p64-example1"><SourceCard label="من الكتاب · ص64 · المثال الأول">
      <p>يقارن المثال بين <L6Decimal>0.8</L6Decimal> و<L6Decimal>0.5</L6Decimal>، أي بين <L6Fraction numerator={8} denominator={10} /> و<L6Fraction numerator={5} denominator={10} />.</p>
      <div className="l6-visual-comparison"><div><TenthsGrid count={5} label="خمسة أعشار مظللة" /><L6Decimal>0.5</L6Decimal></div><span aria-hidden="true">&lt;</span><div><TenthsGrid count={8} label="ثمانية أعشار مظللة" /><L6Decimal>0.8</L6Decimal></div></div>
      <p>النتيجة المطبوعة: <L6Decimal>0.5 &lt; 0.8</L6Decimal>، أي <L6Fraction numerator={5} denominator={10} /> &lt; <L6Fraction numerator={8} denominator={10} />.</p>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p64-rule"><SourceCard label="من الكتاب · ص64 · قاعدة المقارنة">
      <p>عندما يتساوى مقام الكسرين، نقارن البسطين لمعرفة أيّهما أكبر.</p>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p64-example2"><SourceCard label="من الكتاب · ص64 · المثال الثاني">
      <p>يعرض المثال تحويل الكسر ذي المقام 20 إلى أجزاء من عشرة، ثم إلى كتابة عشرية:</p>
      <div className="l6-equation-chain" dir="ltr"><L6Fraction numerator={8} denominator={20} /><span>=</span><L6Fraction numerator={4} denominator={10} /><span>=</span><L6Decimal>0.4</L6Decimal></div>
      <p>في التحويل نقسم البسط والمقام على 2؛ وتبقى قيمة الكسر كما هي.</p>
    </SourceCard></SourceMarker>
    <section className="l6-platform-lab l6-compare-lab" data-platform-activity="l6-compare-tenths">
      <div className="l6-source-label is-platform"><Lightbulb size={14} aria-hidden="true" /> شرح من إعداد المنصة</div>
      <h3>طريقة سريعة للمقارنة</h3>
      <ol><li>حوّل الكسر إلى مقام 10 إذا لزم ذلك.</li><li>قارن عدد الأجزاء من عشرة، أو قارن البسطين إذا كان المقامان متساويين.</li><li>تذكّر أن <L6Fraction numerator={10} denominator={10} /> يساوي 1 كاملاً.</li></ol>
    </section>
  </div>
}

/* ───────────────────────────── Step 4 · pages 62–63 tasks ───────────────────────────── */

function BookGridTask({ item }: { item: typeof p62GridItems[number] }) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<'correct' | 'incorrect' | 'incomplete'>()
  const verify = () => setResult(!answer.trim() ? 'incomplete' : isNaturalValue(answer, item.numerator) ? 'correct' : 'incorrect')
  return <article className="l6-book-grid-task" data-source-id={item.id}>
    <div className="l6-book-grid-visual"><span className="l6-task-index">({item.label})</span><TenSlicePrism count={item.numerator} label={`المجسم ${item.label}: عشر شرائح، والشرائح الزرقاء ظاهرة`} /></div>
    <div className="l6-book-grid-answer"><p>اكتب البسط الذي يعبّر عن الشرائح الزرقاء، والمقام المطبوع هو 10.</p><label className="l6-answer-field"><span>البسط</span><input type="text" inputMode="numeric" dir="ltr" value={answer} aria-label={`بسط المجسم ${item.label}`} onChange={(event) => { setAnswer(event.currentTarget.value); setResult(undefined) }} /></label><button type="button" className="l6-check-button is-compact" onClick={verify}>تحقّق</button>
      <CheckFeedback result={result} success={`صحيح: البسط ${item.numerator}، والمقام 10.`} incomplete="أدخل عدد الأجزاء الزرقاء." /></div>
  </article>
}

function PracticePages6263Step() {
  return <div className="l6-step-content">
    <div className="l6-step-intro"><span className="l6-step-number">04</span><div><p>طبّق الفكرة على رسوم وأسئلة الكتاب.</p><strong>انظر إلى المقام أو عدد الخلايا أولاً، ثم اكتب الإجابة.</strong></div></div>
    <SourceMarker id="l6-p62-ex1"><SourceCard label="من الكتاب · ص62 · التمرين 1">
      <p>أكمل الفراغات في الكسور لتعبر عن عدد الأجزاء الملوّنة. المقام المطبوع في الرسوم هو 10.</p>
      <div className="l6-book-grid-list">{p62GridItems.map((item) => <BookGridTask key={item.id} item={item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p62-ex2"><SourceCard label="من الكتاب · ص62 · التمرين 2">
      <p>ضع الرمز المناسب في كل مربع.</p>
      <div className="l6-operator-list">{p62ComparisonItems.map((item) => <OperatorTask key={item.id} {...item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p63-check1"><SourceCard label="من الكتاب · ص63 · تحقّق من فهمك 1">
      <p>ارجع إلى فقرة «هل تعلم» في مقدمة الدرس، واكتب الكسرين كتابة عشرية ثم لفظية.</p>
      <div className="l6-answer-list">{p63CheckOneItems.map((item) => <AnswerTask key={item.id} id={item.id} title={item.label}
        prompt={<span>المقدار هو <L6Fraction numerator={item.numerator} denominator={10} /> {item.label}.</span>}
        fields={[{ label: 'الكتابة العشرية', inputMode: 'decimal' }, { label: 'بالكلمات', inputMode: 'text' }]}
        check={(values) => isDecimalEquivalentToTenths(values[0], item.numerator) && isAcceptedVerbalTenths(values[1], item.numerator)}
        success={`أحسنت: ${decimalForTenths(item.numerator)}، ${item.numerator === 6 ? 'ستة' : 'سبعة'} أجزاء من عشرة.`} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p63-check2"><SourceCard label="من الكتاب · ص63 · تحقّق من فهمك 2">
      <p>عبّر عن العدد <L6Decimal>0.9</L6Decimal> لفظياً، ثم اكتب كسراً مكافئاً مقامه 10.</p>
      <AnswerTask id="l6-p63-check2-verbal" title="0.9 لفظياً" prompt={<L6Decimal>0.9</L6Decimal>}
        fields={[{ label: 'التعبير اللفظي', inputMode: 'text' }]} check={(values) => isAcceptedVerbalTenths(values[0], 9)}
        success="صحيح: تسعة أجزاء من عشرة (تسعة بالعشرة)." />
      <AnswerTask id="l6-p63-check2-fraction" title="كسر مقامه 10" prompt={<span>اكتب كسراً يساوي <L6Decimal>0.9</L6Decimal>.</span>}
        fields={[{ label: 'الكسر', inputMode: 'numeric' }]} check={(values) => isTenthsFractionInput(values[0], 9)}
        success="صحيح؛ تسعة أجزاء من عشرة تساوي 0.9." />
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p63-check3"><SourceCard label="من الكتاب · ص63 · تحقّق من فهمك 3">
      <p>اكتب الكسرين <L6Fraction numerator={7} denominator={10} /> و<L6Fraction numerator={5} denominator={10} /> كتابة عشرية.</p>
      <div className="l6-answer-list">{p63CheckThreeItems.map((item) => <AnswerTask key={item.id} id={item.id} title={`البند ${item.label}`}
        prompt={<L6Fraction numerator={item.numerator} denominator={10} />}
        fields={[{ label: 'الكتابة العشرية', inputMode: 'decimal' }]}
        check={(values) => isDecimalEquivalentToTenths(values[0], item.numerator)}
        success={`صحيح: ${decimalForTenths(item.numerator)}.`} />)}</div>
    </SourceCard></SourceMarker>
  </div>
}

/* ───────────────────────────── Step 5 · page 64 practice ───────────────────────────── */

const numberLineSourceLabels: Readonly<Record<number, string>> = { 0: '0', 1: '0.1', 7: '0.7', 10: '1' }
const numberLineBlankIds: Readonly<Record<number, string>> = {
  2: 'l6-p64-numberline-02', 3: 'l6-p64-numberline-03', 4: 'l6-p64-numberline-04',
  5: 'l6-p64-numberline-05', 6: 'l6-p64-numberline-06', 8: 'l6-p64-numberline-08', 9: 'l6-p64-numberline-09',
}

function NumberLineActivity() {
  const [values, setValues] = useState<Record<number, string>>({})
  const [result, setResult] = useState<'correct' | 'incorrect' | 'incomplete'>()
  const verify = () => {
    if (p64NumberLineValues.some((value) => !values[Math.round(value * 10)]?.trim())) { setResult('incomplete'); return }
    setResult(p64NumberLineValues.every((value) => isDecimalEquivalentToTenths(values[Math.round(value * 10)], Math.round(value * 10))) ? 'correct' : 'incorrect')
  }
  return <div className="l6-numberline-activity" data-source-id="l6-p64-numberline">
    <div className="l6-numberline-track" dir="ltr" aria-label="خط أعداد من صفر إلى واحد مقسّم إلى أعشار">
      {Array.from({ length: 11 }, (_, index) => <div className="l6-numberline-point" key={index} data-source-id={numberLineBlankIds[index]}>
        {numberLineSourceLabels[index] !== undefined ? <span className="l6-numberline-label"><L6Decimal>{numberLineSourceLabels[index]}</L6Decimal></span>
          : <label className="l6-numberline-input"><span className="visually-hidden">قيمة التدريجة {decimalForTenths(index)}</span><input type="text" inputMode="decimal" dir="ltr" aria-label={`قيمة التدريجة عند ${decimalForTenths(index)}`} value={values[index] ?? ''} onChange={(event) => { const value = event.currentTarget.value; setValues((current) => ({ ...current, [index]: value })); setResult(undefined) }} /></label>}
        <span className="l6-numberline-tick" aria-hidden="true" />
      </div>)}
    </div>
    <div className="l6-numberline-actions"><button type="button" className="l6-check-button" onClick={verify}>تحقّق من الخط</button><CheckFeedback result={result} success="أحسنت؛ أكملت التدريجات السبعة بترتيبها من 0.2 إلى 0.9." incomplete="أكمل الخانات السبع أولاً." failure="تحقّق من ترتيب الأعشار على خط الأعداد." /></div>
  </div>
}

function Page64TableActivity() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [result, setResult] = useState<'correct' | 'incorrect' | 'incomplete'>()
  const sourceOrderFromRight = [...p64TableColumns].reverse()
  const changeValue = (columnId: string, value: string) => {
    setValues((current) => ({ ...current, [columnId]: value }))
    setResult(undefined)
  }
  const verify = () => {
    if (p64TableColumns.some((column) => !values[column.id]?.trim())) { setResult('incomplete'); return }
    const valid = p64TableColumns.every((column, index) => index < 3
      ? isTenthsFractionInput(values[column.id], Number(column.answerFraction.split('/')[0]))
      : isDecimalEquivalentToTenths(values[column.id], Number(column.answerFraction.split('/')[0])))
    setResult(valid ? 'correct' : 'incorrect')
  }
  return <div className="l6-table-activity">
    <div className="l6-decimal-table" dir="rtl" role="table" aria-label="جدول الكسر والكتابة العشرية من الكتاب">
      <div className="l6-table-values" role="rowgroup">
        <div className="l6-table-row" role="row">
          <span className="l6-table-row-heading" role="rowheader">الكسر</span>
          {sourceOrderFromRight.map((column) => {
            const index = p64TableColumns.indexOf(column)
            const printed = column.printedFraction ? <L6Fraction numerator={column.printedFraction.split('/')[0]} denominator={column.printedFraction.split('/')[1]} /> : null
            return <span className="l6-table-cell" key={`fraction-${column.id}`} data-source-id={column.id} role="cell">
              {printed ?? <input type="text" inputMode="text" dir="ltr" aria-label={`الكسر في العمود ${index + 1}`} value={values[column.id] ?? ''} onChange={(event) => changeValue(column.id, event.currentTarget.value)} />}
            </span>
          })}
        </div>
        <div className="l6-table-row" role="row">
          <span className="l6-table-row-heading" role="rowheader">الكتابة العشرية</span>
          {sourceOrderFromRight.map((column) => {
            const index = p64TableColumns.indexOf(column)
            const printed = column.printedDecimal ? <L6Decimal>{column.printedDecimal}</L6Decimal> : null
            return <span className="l6-table-cell" key={`decimal-${column.id}`} data-source-id={column.id} role="cell">
              {printed ?? <input type="text" inputMode="decimal" dir="ltr" aria-label={`الكتابة العشرية في العمود ${index + 1}`} value={values[column.id] ?? ''} onChange={(event) => changeValue(column.id, event.currentTarget.value)} />}
            </span>
          })}
        </div>
      </div>
    </div>
    <button type="button" className="l6-check-button" onClick={verify}>تحقّق من الجدول</button>
    <CheckFeedback result={result} success="كل القيم المكافئة في الجدول صحيحة." incomplete="أكمل الخانات الست." failure="راجع كل عمود: الكسر والعدد العشري يجب أن يمثّلا القيمة نفسها." />
  </div>
}

function PracticePage64Step() {
  return <div className="l6-step-content">
    <div className="l6-step-intro"><span className="l6-step-number">05</span><div><p>تدرّب على المقارنة، ثم رتّب الأعداد على خط الأعداد وأكمل الجدول.</p><strong>القيم متساوية مهما اختلف شكل كتابتها.</strong></div></div>
    <SourceMarker id="l6-p64-ex1"><SourceCard label="من الكتاب · ص64 · التمرين 1">
      <p>ضع الرمز المناسب <MathExpression>&gt; أو &lt; أو =</MathExpression> في كل مربع.</p>
      <div className="l6-operator-list">{p64ComparisonItems.map((item) => <OperatorTask key={item.id} {...item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p64-numberline"><SourceCard label="من الكتاب · ص64 · تدريب خط الأعداد">
      <p>اكتب الأعداد المناسبة في الخانات الفارغة بين 0 و1. من العلامات المطبوعة: <L6Decimal>0.1</L6Decimal> و<L6Decimal>0.7</L6Decimal>.</p>
      <NumberLineActivity />
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p64-table"><SourceCard label="من الكتاب · ص64 · تدريب الجدول">
      <p>أكمل صف الكسر وصف الكتابة العشرية بحيث يعبّران عن القيم نفسها.</p>
      <Page64TableActivity />
    </SourceCard></SourceMarker>
  </div>
}

/* ───────────────────────────── Step 6 · page 65 questions 3–5 ───────────────────────────── */

function RulerGraphic({ label, tenths }: { label: string; tenths: number }) {
  const start = 18
  const spacing = 20
  const end = start + 10 * spacing
  const finish = start + tenths * spacing
  return <svg className="l6-ruler-svg" viewBox="0 0 242 64" role="img" aria-label={`مسطرة من صفر إلى واحد، عليها خط أزرق للبند ${label}`}>
    <line x1={start} y1="45" x2={end} y2="45" className="l6-ruler-baseline" />
    <line x1={start} y1="26" x2={finish} y2="26" className="l6-ruler-blue-line" />
    {Array.from({ length: 11 }, (_, index) => <line key={index} x1={start + index * spacing} y1={index === 0 || index === 10 ? 33 : 37} x2={start + index * spacing} y2="51" className="l6-ruler-tick" />)}
    <text x={start} y="62" textAnchor="middle" className="l6-ruler-end-label">0</text><text x={end} y="62" textAnchor="middle" className="l6-ruler-end-label">1</text>
  </svg>
}

function RulerTask({ item }: { item: typeof p65RulerItems[number] }) {
  return <AnswerTask id={item.id} title={`(${item.label})`} prompt={<RulerGraphic label={item.label} tenths={item.tenths} />}
    fields={[{ label: 'طول الخط بالكتابة العشرية', inputMode: 'decimal' }]}
    check={(values) => isDecimalEquivalentToTenths(values[0], item.tenths)}
    success={`صحيح: طول الخط ${decimalForTenths(item.tenths)} من الوحدة.`} />
}

function ShadingTask({ item }: { item: typeof p65ShadingItems[number] }) {
  const [selected, setSelected] = useState<ReadonlySet<number>>(() => new Set())
  const [result, setResult] = useState<'correct' | 'incorrect' | 'incomplete'>()
  const toggle = (index: number) => {
    const next = new Set(selected)
    next.has(index) ? next.delete(index) : next.add(index)
    setSelected(next)
    setResult(undefined)
  }
  const verify = () => setResult(selected.size === 0 ? 'incomplete' : selected.size === item.tenths ? 'correct' : 'incorrect')
  return <article className="l6-shading-task" data-source-id={item.id}>
    <div className="l6-shading-title"><span>{item.position}</span><L6Decimal>{item.decimal}</L6Decimal></div>
    <div className={`l6-click-grid ${item.orientation === 'vertical' ? 'is-vertical' : 'is-horizontal'}`} role="group" aria-label={`ظلّل ${item.position} لتمثيل ${item.decimal}`} dir="ltr">
      {Array.from({ length: 10 }, (_, index) => <button type="button" key={index} className={selected.has(index) ? 'is-selected' : ''} aria-label={`الخلية ${index + 1} من 10`} aria-pressed={selected.has(index)} onClick={() => toggle(index)} />)}
    </div>
    <button type="button" className="l6-check-button is-compact" onClick={verify}>تحقّق من التظليل</button>
    <CheckFeedback result={result} success={`صحيح؛ ظلّلت ${item.tenths} أجزاء من عشرة.`} incomplete="اختر خلية واحدة على الأقل." failure="عدد الخلايا المظلّلة لا يمثّل العدد العشري المطلوب؛ أعد الاختيار." />
  </article>
}

function VerbalTask({ item }: { item: typeof p65VerbalItems[number] }) {
  return <AnswerTask id={item.id} title={`(${item.label})`} prompt={<span>{item.verbal}</span>}
    fields={[{ label: 'الكسر', inputMode: 'numeric' }, { label: 'الكتابة العشرية', inputMode: 'decimal' }]}
    check={(values) => isTenthsFractionInput(values[0], item.numeral) && isDecimalEquivalentToTenths(values[1], item.numeral)}
    success={`صحيح؛ الكسر والكتابة العشرية ${decimalForTenths(item.numeral)} متكافئان.`} />
}

function PracticePage65FirstStep() {
  return <div className="l6-step-content">
    <div className="l6-step-intro"><span className="l6-step-number">06</span><div><p>تظهر في الصفحة تدريبات مرقّمة 3 و4 و5.</p><strong>اقرأ التدريجة، ثم مثّل العدد العشري بالكسر والتظليل.</strong></div></div>
    <SourceMarker id="l6-p65-q3"><SourceCard label="من الكتاب · ص65 · السؤال 3">
      <p>اقرأ طول كل خط أزرق على المسطرة واكتبه كتابة عشرية.</p>
      <div className="l6-ruler-list">{p65RulerItems.map((item) => <RulerTask key={item.id} item={item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p65-q4"><SourceCard label="من الكتاب · ص65 · السؤال 4">
      <p>ظلّل جزءاً مناسباً من كل شكل لتعبر عن العدد العشري المرافق له. ترتيب الأشكال هنا كما في الصورة: من اليسار إلى اليمين.</p>
      <div className="l6-shading-list" dir="ltr">{p65ShadingItems.map((item) => <ShadingTask key={item.id} item={item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p65-q5"><SourceCard label="من الكتاب · ص65 · السؤال 5">
      <p>اكتب كل عدد على شكل كسر، ثم عبّر عنه بالصيغة العشرية.</p>
      <div className="l6-answer-list">{p65VerbalItems.map((item) => <VerbalTask key={item.id} item={item} />)}</div>
    </SourceCard></SourceMarker>
  </div>
}

/* ───────────────────────────── Step 7 · page 65 questions 6–8 ───────────────────────────── */

function MatchActivity() {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [result, setResult] = useState<'correct' | 'incorrect' | 'incomplete'>()
  const verify = () => {
    if (p65MatchDecimals.some((item) => !matches[item.id])) { setResult('incomplete'); return }
    const values = p65MatchDecimals.map((item) => matches[item.id])
    if (new Set(values).size !== p65MatchFractions.length) { setResult('incorrect'); return }
    const correct = p65MatchDecimals.every((decimal) => {
      const selectedFraction = p65MatchFractions.find((fraction) => fraction.id === matches[decimal.id])
      return selectedFraction !== undefined && compareRationalValues(decimal.value, selectedFraction.value) === 0
    })
    setResult(correct ? 'correct' : 'incorrect')
  }
  return <div className="l6-match-activity" data-platform-activity="l6-page65-matching">
    <div className="l6-match-source-columns">
      <div className="l6-match-source-column"><strong>العمود (أ)</strong>{p65MatchDecimals.map((item) => <span key={item.id} data-source-id={item.id}><L6Decimal>{item.value}</L6Decimal></span>)}</div>
      <div className="l6-match-source-column"><strong>العمود (ب)</strong>{p65MatchFractions.map((item) => <span key={item.id} data-source-id={item.id}><L6Fraction numerator={item.value.split('/')[0]} denominator={item.value.split('/')[1]} /></span>)}</div>
    </div>
    <p className="l6-source-caveat">القيم أعلاه منقولة بترتيبها المطبوع. لا تظهر في المصدر وصلات أو أزواج؛ طابِقها بنفسك.</p>
    <div className="l6-match-rows">
      {p65MatchDecimals.map((decimal) => <fieldset className="l6-match-row" key={decimal.id}>
        <legend><L6Decimal>{decimal.value}</L6Decimal><span className="l6-match-arrow" aria-hidden="true">↔</span> اختر الكسر المساوي</legend>
        <div className="l6-match-options" role="radiogroup" aria-label={`الكسور المقترحة للعدد ${decimal.value}`}>
          {p65MatchFractions.map((fraction) => <label className={matches[decimal.id] === fraction.id ? 'is-selected' : ''} key={fraction.id}>
            <input type="radio" name={`match-${decimal.id}`} value={fraction.id} checked={matches[decimal.id] === fraction.id}
              onChange={() => { setMatches((current) => ({ ...current, [decimal.id]: fraction.id })); setResult(undefined) }} />
            <L6Fraction numerator={fraction.value.split('/')[0]} denominator={fraction.value.split('/')[1]} />
          </label>)}
        </div>
      </fieldset>)}
    </div>
    <button type="button" className="l6-check-button" onClick={verify}>تحقّق من المطابقة</button>
    <CheckFeedback result={result} success="كل المطابقات صحيحة. هذه الوصلات حُسبت من تساوي القيم، ولم تكن مرسومة في المصدر." incomplete="اختر كسراً لكل عدد عشري." failure="استخدم كل كسر مرة واحدة، ثم راجع تساوي القيم." />
  </div>
}

function PracticePage65LastStep() {
  return <div className="l6-step-content">
    <div className="l6-step-intro"><span className="l6-step-number">07</span><div><p>أكمل المقارنات، واختر عدداً بين حدّين، ثم طابق القيم المتساوية.</p><strong>سؤال المطابقة يعرض القيم فقط؛ الأزواج تُستنتج بالحساب.</strong></div></div>
    <SourceMarker id="l6-p65-q6"><SourceCard label="من الكتاب · ص65 · السؤال 6">
      <p>ضع الرمز المناسب <MathExpression>&gt; أو &lt; أو =</MathExpression> في المربع.</p>
      <div className="l6-operator-list is-six">{p65ComparisonItems.map((item) => <OperatorTask key={item.id} {...item} />)}</div>
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p65-q7"><SourceCard label="من الكتاب · ص65 · السؤال 7">
      <p>أعطِ عدداً يقع بين <L6Decimal>0.3</L6Decimal> و<L6Decimal>0.7</L6Decimal>.</p>
      <AnswerTask id="l6-p65-q7" title="اختر عدداً" prompt={<span><L6Decimal>0.3</L6Decimal> &lt; العدد &lt; <L6Decimal>0.7</L6Decimal></span>}
        fields={[{ label: 'العدد الذي اخترته', inputMode: 'decimal' }]}
        check={(values) => isStrictlyBetweenTenths(values[0], 3, 7)}
        success="صحيح؛ اختيارك أكبر من 0.3 وأصغر من 0.7. لا يحدد الكتاب جواباً واحداً." />
    </SourceCard></SourceMarker>
    <SourceMarker id="l6-p65-q8"><SourceCard label="من الكتاب · ص65 · السؤال 8">
      <p>طابق العدد العشري من العمود (أ) مع الكسر المساوي له من العمود (ب).</p>
      <MatchActivity />
    </SourceCard></SourceMarker>
    <section className="l6-summary-card" data-platform-activity="l6-summary">
      <div className="l6-source-label is-platform"><Sparkles size={14} aria-hidden="true" /> خلاصة من إعداد المنصة</div>
      <h3>ثلاث أفكار تذكّرها</h3>
      <ul><li>مثلاً: <L6Fraction numerator={4} denominator={10} /> تُكتب <L6Decimal>0.4</L6Decimal>.</li><li><L6Fraction numerator={10} denominator={10} /> تساوي 1.</li><li>يمكن مقارنة الأجزاء من عشرة أو تحويلها إلى كسور مكافئة بالمقام 10.</li></ul>
      <a className="l6-test-link" href="#tests/run/lesson-tenths-one-test">انتقل إلى اختبار الدرس المستقل · 20 سؤالاً <ArrowLeft size={17} aria-hidden="true" /></a>
      <p className="l6-platform-note"><RotateCcw size={14} aria-hidden="true" /> أعد الخطوات أو الأنشطة متى شئت؛ إجابات الأنشطة لا تُسجّل في الاختبار المستقل.</p>
    </section>
  </div>
}

const steps: LessonStep[] = [
  { id: 'discover-tenths', title: 'اكتشف الأجزاء من عشرة', content: <DiscoveryStep /> },
  { id: 'decimal-notation', title: 'من الكسر إلى الكتابة العشرية', content: <NotationStep /> },
  { id: 'compare-tenths', title: 'قارن الأجزاء من عشرة', content: <ComparisonStep /> },
  { id: 'practice-p62-p63', title: 'تحقّق من فهمك · ص62–63', content: <PracticePages6263Step /> },
  { id: 'practice-p64', title: 'تمارين المقارنة · ص64', content: <PracticePage64Step /> },
  { id: 'practice-p65-3-5', title: 'تطبيقات · ص65 (3–5)', content: <PracticePage65FirstStep /> },
  { id: 'practice-p65-6-8', title: 'تحدي الأعداد والمطابقة · ص65 (6–8)', content: <PracticePage65LastStep /> },
]

export function TenthsOneLesson() {
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title={lessonTitle} steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="l6-tenths-one" />
}
