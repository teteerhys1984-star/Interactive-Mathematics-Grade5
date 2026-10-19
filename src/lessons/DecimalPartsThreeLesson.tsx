import { useState, type ReactNode } from 'react'
import { Check, CircleAlert, Compass, Cuboid, Lightbulb, RotateCcw, Sparkles } from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import type { LessonStep } from '../components/lesson/types'
import {
  lesson8SourceElements, lessonTitle, p72Comparisons, p72Cubes, p73Examples, p73Fractions, p74Comparisons,
  p75Comparisons, p75Rulers, p76Comparisons, p76Intervals, p76Matches, p76Ruler, p76Table,
  type CompareItem, type SourceElement, type SourceBranch,
} from './decimalPartsThreeData'

function Fraction({ value }: { value: string }) {
  const match = /^(\d+)\/(\d+)$/u.exec(value)
  return match ? <span className="l8-fraction" dir="ltr" aria-label={`${match[1]} على ${match[2]}`}><span>{match[1]}</span><i /><span>{match[2]}</span></span> : <MathExpression>{value}</MathExpression>
}
function SourceCard({ element, children }: { element: SourceElement; children?: ReactNode }) {
  return <article className="l8-source-card" data-source-id={element.id}>
    <div className="l8-card-meta"><span className="l8-book-tag">من الكتاب · ص {element.page}</span><span>{element.section}</span></div>
    <h3>{element.prompt}</h3>
    {children ?? <p className="l8-source-answer">{element.answer}</p>}
  </article>
}
function Explanation({ title = 'فكرة الدرس', children }: { title?: string; children: ReactNode }) {
  return <aside className="l8-explanation"><span><Lightbulb size={17} aria-hidden="true" /> شرح المنصة · {title}</span><div>{children}</div></aside>
}
function relationOf(left: string, right: string): -1 | 0 | 1 {
  const parse = (value: string) => {
    const fraction = /^(\d+)\/(\d+)$/u.exec(value)
    if (fraction) return Number(fraction[1]) / Number(fraction[2])
    return Number(value)
  }
  const a = parse(left), b = parse(right)
  return Math.abs(a - b) < 1e-12 ? 0 : a < b ? -1 : 1
}
function Feedback({ result, success = 'صحيح! راجعت قيمة المنازل بنجاح.', error = 'ليست صحيحة بعد؛ أعد توحيد المنازل وحاول ثانية.' }: { result?: boolean | null; success?: string; error?: string }) {
  if (result == null) return null
  return <p className={`l8-feedback ${result ? 'is-correct' : 'is-incorrect'}`} role={result ? 'status' : 'alert'}>{result ? <Check size={17} /> : <CircleAlert size={17} />}{result ? success : error}</p>
}
function CompareTask({ item }: { item: CompareItem }) {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const verify = () => setResult(answer ? answer === (relationOf(item.left, item.right) < 0 ? '<' : relationOf(item.left, item.right) > 0 ? '>' : '=') : null)
  return <div className="l8-compare" data-source-id={item.id}>
    <span className="l8-item-letter">({item.label})</span>
    <div className="l8-equation" dir="ltr"><Fraction value={item.left} /><label><span className="visually-hidden">اختر رمز المقارنة للبند {item.label}</span><select aria-label={`رمز المقارنة للبند ${item.label}`} value={answer} onChange={(event) => { setAnswer(event.target.value); setResult(null) }}><option value="">□</option><option value="&lt;">&lt;</option><option value="=">=</option><option value="&gt;">&gt;</option></select></label><Fraction value={item.right} /></div>
    <button type="button" className="l8-check" onClick={verify}>تحقّق</button><Feedback result={result} success="صحيح؛ قارنّا القيمة نفسها بعد توحيد الخانات." />
  </div>
}
function CubeModel({ numerator, label }: { numerator: number; label: string }) {
  return <div className="l8-cube-model" role="img" aria-label={`نموذج من ألف جزء، يوضح ${numerator} جزءاً ملوّناً`}>
    <div className="l8-cube-layers" aria-hidden="true">{Array.from({ length: 10 }, (_, layer) => <div className="l8-cube-layer" key={layer}>{Array.from({ length: 100 }, (_, cell) => <i className={layer * 100 + cell < numerator ? 'is-shaded' : ''} key={cell} />)}</div>)}</div>
    <strong>{label}: <MathExpression>{numerator}/1000</MathExpression></strong>
  </div>
}
function CubeTask({ item }: { item: (typeof p72Cubes)[number] }) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  return <div className="l8-cube-task" data-source-id={item.id}><CubeModel numerator={item.numerator} label={`الشكل (${item.label})`} />
    <label>اكتب الجزء الملوّن كسراً مقامه 1000 <input inputMode="numeric" dir="ltr" aria-label={`كسر الشكل ${item.label}`} value={value} onChange={(event) => { setValue(event.target.value); setResult(null) }} /></label>
    <button className="l8-check" type="button" onClick={() => setResult(value.replace(/\s/gu, '') === `${item.numerator}/1000`)}>تحقّق</button><Feedback result={result} />
  </div>
}
const cleanArabic = (value: string) => value.toLocaleLowerCase('ar').replace(/[\u064B-\u065F\u0670\s،.]/gu, '')
function ConversionTask({ id, numerator, decimal, verbal }: { id: string; numerator: number; decimal: string; verbal: string }) {
  const [decimalValue, setDecimalValue] = useState('')
  const [verbalValue, setVerbalValue] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const check = () => {
    const accepted = cleanArabic(verbalValue)
    const expected = cleanArabic(verbal)
    setResult(Number(decimalValue.replace(',', '.')) === Number(decimal) && (accepted === expected || accepted.includes(expected.replace('جزءاً', 'جزء'))))
  }
  return <div className="l8-conversion" data-source-id={id}>
    <span><Fraction value={`${numerator}/1000`} /></span>
    <label>الكتابة العشرية<input dir="ltr" inputMode="decimal" value={decimalValue} onChange={(e) => { setDecimalValue(e.target.value); setResult(null) }} /></label>
    <label>التعبير اللفظي<input dir="rtl" value={verbalValue} onChange={(e) => { setVerbalValue(e.target.value); setResult(null) }} /></label>
    <button type="button" className="l8-check" onClick={check}>تحقّق</button><Feedback result={result} success="ممتاز؛ الخانات والقراءة اللفظية متطابقتان." />
  </div>
}
function Q2Task() {
  const [verbal, setVerbal] = useState('')
  const [fraction, setFraction] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const verify = () => setResult(cleanArabic(verbal) === cleanArabic('تسعمئة وتسعة وتسعون جزءاً من ألف') && fraction.replace(/\s/gu, '') === '999/1000')
  return <div className="l8-q2-task" data-source-id="l8-p75-check2">
    <div data-source-id="l8-p75-check2-a"><label>التعبير اللفظي عن <MathExpression>0.999</MathExpression><input value={verbal} onChange={(e) => { setVerbal(e.target.value); setResult(null) }} /></label></div>
    <div data-source-id="l8-p75-check2-b"><label>الكسر المساوي، مقامه 1000<input dir="ltr" value={fraction} onChange={(e) => { setFraction(e.target.value); setResult(null) }} /></label></div>
    <button type="button" className="l8-check" onClick={verify}>تحقّق من الإجابتين</button><Feedback result={result} success="أحسنت؛ 0.999 تساوي تسعمئة وتسعة وتسعين جزءاً من ألف و999/1000." />
  </div>
}
function RulerTask({ id, label, from, to, printed }: { id: string; label: string; from: number; to: number; printed: number }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<boolean | null>(null)
  const marks = Array.from({ length: 9 }, (_, index) => from + index + 1)
  const blankMarks = marks.filter((mark) => mark !== printed)
  const verify = () => setResult(blankMarks.every((mark) => Number(answers[mark]?.replace(',', '.')) === mark / 1000))
  const endpoint = (value: number) => `0.${String(value / 10).padStart(2, '0')}`
  return <div className="l8-ruler-card" data-source-id={id}>
    <div className="l8-ruler-title">خط الأعداد ({label}) <span>كل خطوة = 0.001</span></div>
    <div className="l8-ruler" dir="ltr"><span className="l8-ruler-end">{endpoint(from)}</span>{marks.map((mark) => <label className="l8-ruler-mark" key={mark}>
      {mark === printed ? <strong>{`0.${String(mark).padStart(3, '0')}`}</strong> : <input aria-label={`قيمة التدريجة 0.${String(mark).padStart(3, '0')}`} inputMode="decimal" value={answers[mark] ?? ''} onChange={(e) => { setAnswers((old) => ({ ...old, [mark]: e.target.value })); setResult(null) }} />}
      <i aria-hidden="true" />
    </label>)}<span className="l8-ruler-end">{endpoint(to)}</span></div>
    <button type="button" className="l8-check" onClick={verify}>تحقّق من الخط</button><Feedback result={result} success="أحسنت؛ تزداد التدريجات بمقدار جزء واحد من ألف." error="تأكد من إكمال كل تدريجة وإضافة 0.001 كل مرة." />
  </div>
}
function TableTask() {
  const [answers, setAnswers] = useState<string[]>(Array(6).fill(''))
  const [result, setResult] = useState<boolean | null>(null)
  const change = (index: number, value: string) => { setAnswers((old) => old.map((entry, i) => i === index ? value : entry)); setResult(null) }
  const expected = p76Table.map((item) => item.printed === 'fraction' ? `0.${String(item.numerator).padStart(3, '0')}` : `${item.numerator}/1000`)
  const verify = () => setResult(answers.every((value, i) => {
    if (p76Table[i].printed === 'fraction') return Number(value.replace(',', '.')) === Number(expected[i])
    return value.replace(/\s/gu, '') === expected[i]
  }))
  return <div className="l8-table-wrap" data-source-id="l8-p76-table"><table className="l8-table" dir="rtl"><tbody>
    <tr><th>الكسر</th>{p76Table.map((cell, i) => <td key={cell.id} data-source-id={cell.id}>{cell.printed === 'fraction' ? <Fraction value={`${cell.numerator}/1000`} /> : <input aria-label={`الكسر في العمود ${i + 1}`} dir="ltr" value={answers[i]} onChange={(e) => change(i, e.target.value)} />}</td>)}</tr>
    <tr><th>الكتابة العشرية</th>{p76Table.map((cell, i) => <td key={`${cell.id}-decimal`} data-source-id={`${cell.id}-decimal`}>{cell.printed === 'decimal' ? <MathExpression>{cell.value}</MathExpression> : <input aria-label={`الكتابة العشرية في العمود ${i + 1}`} inputMode="decimal" dir="ltr" value={answers[i]} onChange={(e) => change(i, e.target.value)} />}</td>)}</tr>
  </tbody></table>
    <p className="l8-instruction">اكتب في كل خانة الناقص من الزوج المتكافئ؛ ترتيب الخانات يطابق الجدول المطبوع.</p><button type="button" className="l8-check" onClick={verify}>تحقّق من الجدول</button><Feedback result={result} success="أكملت الأزواج الستة بصورة صحيحة." />
  </div>
}
function MatchingTask() {
  const [answers, setAnswers] = useState<string[]>(Array(4).fill(''))
  const [result, setResult] = useState<boolean | null>(null)
  const choices = p76Matches.map((item) => item.fraction)
  return <div className="l8-matching" data-source-id="l8-p76-match">{p76Matches.map((item, index) => <label className="l8-match-row" data-source-id={item.id} key={item.id}><strong><MathExpression>{item.decimal}</MathExpression></strong><span aria-hidden="true">↔</span><select aria-label={`الكسر المساوي لـ ${item.decimal}`} value={answers[index]} onChange={(e) => { setAnswers((old) => old.map((entry, i) => i === index ? e.target.value : entry)); setResult(null) }}><option value="">اختر كسراً</option>{choices.map((choice) => <option key={choice}>{choice}</option>)}</select></label>)}
    <button type="button" className="l8-check" onClick={() => setResult(answers.every((value, index) => value && Number(value.split('/')[0]) / Number(value.split('/')[1]) === Number(p76Matches[index].decimal)))}>تحقّق من المطابقة</button><Feedback result={result} success="أحسنت؛ كل عدد عشري طابق الكسر المكافئ." />
  </div>
}
function IntervalTask({ id, label, lower, upper, expression }: { id: string; label: string; lower: string; upper: string; expression: string; sample?: string }) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const lo = Number(lower), hi = Number(upper)
  const verify = () => { const n = Number(value.replace(',', '.')); setResult(Boolean(value.trim()) && Number.isFinite(n) && n > lo && n < hi) }
  return <div className="l8-interval" data-source-id={id}><span>({label})</span><MathExpression>{expression}</MathExpression><label><span className="visually-hidden">عدد مناسب بين {lower} و{upper}</span><input aria-label={`عدد بين ${lower} و${upper}`} inputMode="decimal" dir="ltr" value={value} onChange={(e) => { setValue(e.target.value); setResult(null) }} /></label><button type="button" className="l8-check" onClick={verify}>تحقّق</button><Feedback result={result} success={`صحيح؛ ${value} يقع بين الحدين دون أن يساويهما.`} /></div>
}
function BetweenTask({ id, lower, upper, sample, printed = false }: { id: string; lower: string; upper: string; sample: string; printed?: boolean }) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const verify = () => { const n = Number(value.replace(',', '.')); setResult(Boolean(value.trim()) && n > Number(lower) && n < Number(upper)) }
  return <div className="l8-between" data-source-id={id}><MathExpression>{lower} &lt; x &lt; {upper}</MathExpression>{printed && <span className="l8-book-tag">المثال المطبوع: {sample}</span>}<label><span className="visually-hidden">اكتب عدداً بين {lower} و{upper}</span><input inputMode="decimal" dir="ltr" value={value} onChange={(e) => { setValue(e.target.value); setResult(null) }} /></label><button type="button" className="l8-check" onClick={verify}>تحقّق</button><Feedback result={result} success="صحيح، العدد يقع في الفترة المفتوحة." />
  </div>
}
function TaskGroup({ element, children }: { element: SourceElement; children: ReactNode }) {
  return <SourceCard element={element}><div className="l8-task-stack">{children}</div></SourceCard>
}
function find(id: string) { const item = lesson8SourceElements.find((entry) => entry.id === id); if (!item) throw new Error(`Unknown lesson source id: ${id}`); return item }
function BranchIntro({ branch }: { branch: SourceBranch }) { return <div className="l8-branch-prompt" data-source-id={`${branch.id}-prompt`}><span>({branch.label})</span><p>{branch.prompt}</p></div> }
function CubeSection() { const element = find('l8-p72-ex1'); return <TaskGroup element={element}>{p72Cubes.map((item) => <CubeTask item={item} key={item.id} />)}</TaskGroup> }
function CompareSection({ elementId, items }: { elementId: string; items: CompareItem[] }) { const element = find(elementId); return <TaskGroup element={element}>{items.map((item) => <CompareTask item={item} key={item.id} />)}</TaskGroup> }

function NumberLineIllustration() {
  return <div className="l8-numberline-demo" dir="ltr" aria-label="خط الأعداد من صفر إلى 0.1، وتكبير الأجزاء من 0.010 إلى 0.020" role="group" tabIndex={0}>
    <div className="l8-numberline-major"><span className="l8-line-end">0</span>{Array.from({ length: 9 }, (_, i) => <span className="l8-line-point" key={i}><i />0.{String(i + 1).padStart(2, '0')}</span>)}<span className="l8-line-end">0.1</span></div>
    <div className="l8-numberline-zoom"><span className="l8-line-end">0.010</span>{Array.from({ length: 9 }, (_, i) => <span className="l8-line-point" key={i}><i />0.{String(i + 11).padStart(3, '0')}</span>)}<span className="l8-line-end">0.020</span></div>
    <p dir="rtl"><MathExpression>0.01 = 0.010</MathExpression> · كل خطوة صغيرة تساوي <MathExpression>0.001</MathExpression></p>
  </div>
}
function ThousandCubeDiagram() {
  return <div className="l8-cube-diagram" role="img" aria-label="مكعب مقسّم إلى عشرة في عشرة في عشرة أجزاء متساوية"><div className="l8-big-cube-top">{Array.from({ length: 100 }, (_, i) => <i key={i} />)}</div><div className="l8-big-cube-front">{Array.from({ length: 100 }, (_, i) => <i key={i} />)}</div><div className="l8-big-cube-side">{Array.from({ length: 100 }, (_, i) => <i key={i} />)}</div><span><MathExpression>10 × 10 × 10 = 1000</MathExpression> جزء متساوٍ</span></div>
}

export function DecimalPartsThreeLesson() {
  const steps: LessonStep[] = [
    { id: 'discover-thousand', title: 'اكتشف مكعب الألف', content: <div className="l8-step-content">
      <div className="l8-hero"><div><span className="l8-eyebrow"><Sparkles size={15} /> الوحدة الثانية · الدرس الثامن</span><h2>الأجزاء العشرية <em>(3)</em></h2><p>من كلٍّ واحد إلى ألف جزء صغير؛ اكتشف كيف نقرأها ونقارن بينها.</p></div><div className="l8-hero-icon"><Cuboid size={70} strokeWidth={1.3} /><span>1000 جزء</span></div></div>
      <SourceCard element={find('l8-p72-goals')} /><SourceCard element={find('l8-p72-opening')}><ThousandCubeDiagram /><Explanation>نقسّم كل بُعد إلى عشرة: <MathExpression>10 × 10 × 10 = 1000</MathExpression>. لذلك كل مكعب صغير هو <Fraction value="1/1000" /> من المكعب الكامل.</Explanation></SourceCard>
      <CubeSection />
      <CompareSection elementId="l8-p72-ex2" items={p72Comparisons} />
    </div> },
    { id: 'read-thousandths', title: 'اقرأ واكتب أجزاء الألف', content: <div className="l8-step-content">
      <SourceCard element={find('l8-p73-place-value')}><div className="l8-place-value"><span>العدد العشري</span><div dir="ltr"><b>0</b><i>.</i><strong>2</strong><strong>1</strong><strong>3</strong></div><div className="l8-place-labels" dir="ltr"><span>آحاد</span><span>أعشار</span><span>أجزاء من مئة</span><span>أجزاء من ألف</span></div></div><Explanation>ثلاث خانات بعد الفاصلة تعني أجزاء من ألف. عند البسط <MathExpression>5</MathExpression> نكتب <MathExpression>0.005</MathExpression> لا <MathExpression>0.5</MathExpression>.</Explanation></SourceCard>
      <SourceCard element={find('l8-p73-examples')}><div className="l8-example-cards">{p73Examples.map((item) => <article className="l8-example-card" key={item.id}><Fraction value={`${item.numerator}/1000`} /><MathExpression>{item.decimal}</MathExpression><span>{item.verbal}</span></article>)}</div></SourceCard>
      <SourceCard element={find('l8-p73-whole')}><div className="l8-whole-equation"><Fraction value="1000/1000" /><span>=</span><MathExpression>1</MathExpression></div></SourceCard>
      <TaskGroup element={find('l8-p73-check1')}>{p73Fractions.map((item) => <ConversionTask key={item.id} {...item} />)}</TaskGroup>
      <TaskGroup element={find('l8-p75-check2')}><Q2Task /></TaskGroup>
    </div> },
    { id: 'compare-thousandths', title: 'قارن بعد توحيد الخانات', content: <div className="l8-step-content">
      <SourceCard element={find('l8-p74-compare-rule')}><Explanation>رتّب الخانات من الأكبر قيمة إلى الأصغر: الأعشار، ثم الأجزاء من مئة، ثم الأجزاء من ألف. لا تقارن شكل العدد؛ قارن قيمته.</Explanation></SourceCard>
      <TaskGroup element={find('l8-p74-examples')}>{p74Comparisons.map((item) => <div className="l8-worked-example" key={item.id} data-source-id={item.id}><span className="l8-worked-tag">مثال الكتاب · ص 74</span><MathExpression>{item.left} {item.relation} {item.right}</MathExpression><p>{item.label === 'مثال 1' ? '513 جزءاً من ألف أكبر من 418 جزءاً من ألف.' : 'نكتب 0.42 على صورة 0.420؛ ثم 325 < 420، لذا 0.325 < 0.420.'}</p></div>)}</TaskGroup>
      <Explanation title="لماذا نضيف صفراً؟">لأن <MathExpression>0.42</MathExpression> و <MathExpression>0.420</MathExpression> لهما القيمة نفسها؛ الصفر في نهاية العدد لا يغيّر المقدار، لكنه يسهل مقارنة الخانات.</Explanation>
    </div> },
    { id: 'relationships-and-open-intervals', title: 'منزلة الألف وخط الأعداد', content: <div className="l8-step-content">
      <SourceCard element={find('l8-p74-relation')}><div className="l8-place-equivalences"><div><Fraction value="1/10" /><span>=</span><Fraction value="10/100" /><span>=</span><Fraction value="100/1000" /></div><div><Fraction value="1/100" /><span>=</span><Fraction value="10/1000" /></div><div><Fraction value="1/1000" /><span>=</span><MathExpression>0.001</MathExpression></div></div><ThousandCubeDiagram /></SourceCard>
      <SourceCard element={find('l8-p74-number-line')}><p className="l8-numberline-mobile-hint">إرشاد للمنصة على الهاتف: اسحب مخطط خط الأعداد أفقياً لرؤية جميع التدريجات.</p><NumberLineIllustration /></SourceCard>
      <TaskGroup element={find('l8-p75-between-examples')}>{find('l8-p75-between-examples').branches!.map((branch) => <div key={branch.id} data-source-id={branch.id}><BranchIntro branch={branch} /><BetweenTask id={`${branch.id}-try`} lower={branch.id.endsWith('a') ? '0.01' : '0.175'} upper={branch.id.endsWith('a') ? '0.02' : '0.2'} sample={branch.id.endsWith('a') ? '0.015' : '0.181'} printed={branch.id.endsWith('b')} /></div>)}</TaskGroup>
      <CompareSection elementId="l8-p75-check1" items={p75Comparisons} />
    </div> },
    { id: 'number-lines-ab', title: 'تدرّج الألف على خط الأعداد', content: <div className="l8-step-content">
      <SourceCard element={find('l8-p75-practice1')}><p className="l8-source-answer">كل خط مقسوم إلى عشر خطوات بين طرفين يفصل بينهما جزء واحد من مئة. العدد المطبوع يبقى مرجعاً، ونكمل القيم الناقصة.</p></SourceCard>
      {p75Rulers.map((item) => <RulerTask key={item.id} {...item} />)}
      <Explanation>اكتب القيم من اليسار إلى اليمين؛ كل خطوة واحدة إلى اليمين تزيد <MathExpression>0.001</MathExpression>.</Explanation>
    </div> },
    { id: 'table-and-third-line', title: 'أكمل الجدول والخط الثالث', content: <div className="l8-step-content">
      <SourceCard element={find('l8-p76-practice1-th')}><RulerTask {...p76Ruler} /></SourceCard>
      <TaskGroup element={find('l8-p76-table')}><TableTask /></TaskGroup>
      <Explanation>مع مقام <MathExpression>1000</MathExpression> نكتب ثلاث خانات دائماً: مثلاً <MathExpression>5/1000 = 0.005</MathExpression>، بينما <MathExpression>0.725 = 725/1000</MathExpression>.</Explanation>
    </div> },
    { id: 'compare-and-between', title: 'قارن واختر عدداً بين حدّين', content: <div className="l8-step-content">
      <TaskGroup element={find('l8-p76-between')}>{find('l8-p76-between').branches!.map((branch) => <div key={branch.id} data-source-id={branch.id}><BranchIntro branch={branch} /><BetweenTask id={`${branch.id}-try`} lower="0.32" upper="0.33" sample="0.325" /></div>)}</TaskGroup>
      <CompareSection elementId="l8-p76-check4" items={p76Comparisons} />
    </div> },
    { id: 'match-and-review', title: 'طابق واختبر فهمك', content: <div className="l8-step-content">
      <TaskGroup element={find('l8-p76-match')}><MatchingTask /></TaskGroup>
      <TaskGroup element={find('l8-p76-intervals')}>{p76Intervals.map((item) => <IntervalTask key={item.id} {...item} />)}</TaskGroup>
      <div className="l8-summary"><span><Compass size={18} /> خلاصة الرحلة</span><h3>ثلاثة مفاتيح للأجزاء من ألف</h3><ol><li>المقام 1000 يقابله ثلاث خانات بعد الفاصلة.</li><li>وحّد عدد الخانات قبل المقارنة، وأضف صفراً إلى اليمين إذا احتجت.</li><li>في «عدد يقع بين» اختر قيمة داخلية لا تساوي الحدين.</li></ol><a href="#tests/run/lesson-decimal-parts-three-test">انتقل إلى اختبار الدرس المستقل ←</a></div>
    </div> },
  ]
  const [activeStep, setActiveStep] = useState(0)
  return <LessonShell title={lessonTitle} steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-decimal-three" />
}
