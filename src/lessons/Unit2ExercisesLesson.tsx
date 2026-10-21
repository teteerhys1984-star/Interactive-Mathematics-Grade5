import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Check, ChevronLeft, ChevronRight, CircleCheck, CircleX, ClipboardList, Lightbulb, PencilRuler, Sparkles } from 'lucide-react'
import { MathExpression as SharedMathExpression } from '../components/MathExpression'
import { LessonShell } from '../components/lesson/LessonShell'
import type { LessonStep } from '../components/lesson/types'
import {
  findUnit2ExercisesElement,
  flattenUnit2ExercisesCoverageIds,
  lessonTitle,
  lessonId,
  unit2ExercisesSourceElements,
  unit2ExercisesTextbookPages,
  type SourceBranch,
  type SourceElement,
} from './unit2ExercisesData'

/* =============================================================================================
   الوحدة الثانية · درس «تمرينات الوحدة الثانية» (الكتاب ص 85–86)
   درس مراجعة ختامي تفاعلي: يعرض كل تمرين من الكتاب مع معطياته ومطلوبه، ثم يحلّه خطوة بخطوة
   مع تلميحات تدريجية وتغذية راجعة تعليمية. كل صفحة معزولة LTR للرموز الرياضية.
   ============================================================================================= */

const MATH_RUN = /((?:\\[?[A-Za-z]\\u0302?\\]?|\d)(?:[A-Za-z\\u0302\d[\]\s=∥⟂+−×÷°.,/]*[A-Za-z\\u0302\d\]])?)/g
const HAT_LETTER = /([A-Za-z])\\\u0302/g
const PRECOMPOSED_HAT = /[ÂĈÊÎÔÛŴŶẐâĉêîôûŵŷẑ]/g
function withHats(text: string): ReactNode {
  const decomposed = text.replace(PRECOMPOSED_HAT, (char) => char.normalize('NFD'))
  if (!decomposed.includes('\u0302')) return text
  const nodes: ReactNode[] = []
  let cursor = 0
  for (const match of decomposed.matchAll(HAT_LETTER)) {
    const start = match.index ?? 0
    if (start > cursor) nodes.push(decomposed.slice(cursor, start))
    nodes.push(<span key={start} className="u2-hat">{match[1]}<span className="u2-hat-mark">\u0302</span></span>)
    cursor = start + match[0].length
  }
  if (cursor < decomposed.length) nodes.push(decomposed.slice(cursor))
  return <>{nodes}</>
}
function MathExpression({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return <SharedMathExpression className={className} label={label}>{typeof children === 'string' ? withHats(children) : children}</SharedMathExpression>
}
function Rich({ text }: { text: string }) {
  const parts = text.replace(PRECOMPOSED_HAT, (char) => char.normalize('NFD')).split(MATH_RUN)
  return <span className="u2-rich">{parts.map((part, index) => (index % 2 === 1 ? <MathExpression key={index}>{part}</MathExpression> : <span key={index}>{part}</span>))}</span>
}
function useChecked(): [boolean, (value: boolean) => void, number] {
  const [checked, setCheckedState] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const setChecked = useCallback((value: boolean) => { setCheckedState(value); if (value) setAttempts((count) => count + 1) }, [])
  return [checked, setChecked, attempts]
}
function toneClass(checked: boolean, selected: boolean, correct: boolean) {
  return checked ? (correct ? 'is-right' : selected ? 'is-wrong' : '') : selected ? 'is-selected' : ''
}

/* ------------------------------------------------------------------ بطاقات المصدر */
function Sheet({ element, children, quote = true }: { element: SourceElement; children?: ReactNode; quote?: boolean }) {
  return <article className="u2-sheet" data-source-id={element.id} data-source-page={element.page}>
    <span className="u2-corner" aria-hidden="true" />
    <div className="u2-sheet-head">
      <span className="u2-page-tag"><ClipboardList size={13} aria-hidden="true" /> الكتاب · ص {element.page}</span>
      <h3 className="u2-section-name">{element.section}</h3>
    </div>
    {quote && <p className="u2-quote"><Rich text={element.prompt} /></p>}
    {children && <div className="u2-sheet-body">{children}</div>}
  </article>
}
function PlatformNote({ title = 'إضافة من المنصة', children, id }: { title?: string; children: ReactNode; id?: string }) {
  return <aside className="u2-note" data-platform-id={id}>
    <strong><Lightbulb size={15} aria-hidden="true" /> {title}</strong>
    {children}
  </aside>
}
function Feedback({ state, hint, attempts = 1, children }: { state: 'idle' | 'correct' | 'wrong'; hint?: string; attempts?: number; children: ReactNode }) {
  if (state === 'idle') return null
  const revealSolution = state === 'correct' || attempts >= 1
  return <div className={`u2-feedback ${state === 'correct' ? 'is-correct' : 'is-wrong'}`} role="status">
    <span className="u2-feedback-title">{state === 'correct' ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}{state === 'correct' ? 'إجابة صحيحة' : 'راجع الإجابة'}</span>
    {state === 'wrong' && hint && <p className="u2-feedback-hint"><Lightbulb size={15} aria-hidden="true" /> تلميح: <Rich text={hint} /></p>}
    {revealSolution
      ? <div className="u2-feedback-body">{state === 'wrong' && <p className="u2-feedback-reveal">الشرح الكامل بعد المحاولة — قارن خطواتك به:</p>}{children}</div>
      : <p className="u2-feedback-retry">عدّل إجابتك وتحقّق مرة أخرى؛ يظهر الشرح الكامل بعد المحاولة.</p>}
  </div>
}
function TaskHead({ title, page, platform = false }: { title: string; page?: number; platform?: boolean }) {
  return <div className="u2-task-head">
    <ClipboardList size={17} aria-hidden="true" />
    <strong>{title}</strong>
    {platform ? <span className="u2-page-tag is-platform">نشاط من إعداد المنصة</span> : page ? <span className="u2-page-tag">ص {page}</span> : null}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 1 — المقدمة والأهداف */
function StepIntro() {
  const goals = findUnit2ExercisesElement('u2-p85-intro')
  return <div className="u2-stack">
    <Sheet element={goals}>
      <ul className="u2-goal-list">
        <li><span>①</span> مراجعة موضوعات الوحدة الثانية كلها.</li>
        <li><span>②</span> حل كل تمرين من الصفتين 85 و 86 خطوة بخطوة.</li>
        <li><span>③</span> فهم سبب الحل، وليس فقط حفظ الناتج.</li>
      </ul>
      <PlatformNote title="نص غير واضح · تنبيه من إعداد المنصة">
        <p>بعض نصوص الأسئلة ② و③ و④ و⑤ من ص 85 غير واضحة بالكامل في الصورة المرفقة. يركز الدرس على ما ظهر من معطيات وخيارات، ولا يُخمن عن أرقام غير مطبوعة.</p>
      </PlatformNote>
    </Sheet>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 2 — السؤال ① */
function StepQuestion1() {
  const element = findUnit2ExercisesElement('u2-p85-q1')
  return <div className="u2-stack">
    <Sheet element={element}>
      <PlatformNote title="نص غير واضح جزئياً · توضيح من المنصة">
        <p>نص السؤال ① غير واضح جزئياً في الصورة المرفقة. يعرض الدرس العبارات الواضحة ويوجه الطالب إلى مراجعة دروس الكسور العشرية في الوحدة.</p>
      </PlatformNote>
    </Sheet>
    {element.branches!.map((branch) => {
      const [answer, setAnswer] = useState<'correct' | 'wrong' | 'not-sure' | null>(null)
      const [checked, setChecked, attempts] = useChecked()
      const expected = branch.answer === 'صح' ? 'correct' : branch.answer === 'خطأ' ? 'wrong' : null
      const ok = answer === expected
      return <div key={branch.id} className="u2-task" data-source-id={branch.id}>
        <TaskHead title={branch.label} page={85} />
        <p className="u2-question"><Rich text={branch.prompt} /></p>
        <div className="u2-choice-row">
          {(['correct', 'wrong', 'not-sure'] as const).map((value) => <label key={value} className={`u2-choice ${toneClass(checked, answer === value, ok)}`}>
            <input type="radio" name={`u2-q1-${branch.id}`} checked={answer === value} onChange={() => { setChecked(false); setAnswer(value) }} />
            {value === 'correct' ? 'صح' : value === 'wrong' ? 'خطأ' : 'غير واضح'}
          </label>)}
        </div>
        <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={answer === null}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="يُسجل الجواب حسب ما يتعلمه الطالب في دروس الكسور العشرية؛ لا يُخمن عن أرقام غير مطبوعة.">
          <p>{branch.answer}.</p>
          <p>{branch.id === 'u2-p85-q1-a' ? 'كل عدد صحيح n يمكن كتابته ك n.0، إذن العبارة صحيحة.' : branch.id === 'u2-p85-q1-b' ? 'مثال مضاد: 0.5 كسر عشري وليس عدداً طبيعياً، إذن العبارة خاطئة.' : 'مثال: 7 = 7.0، إذن كل عدد طبيعي يمكن التعبير عنه ككسر عشري.'}</p>
        </Feedback>
      </div>
    })}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 3 — السؤال ② */
function StepQuestion2() {
  const element = findUnit2ExercisesElement('u2-p85-q2')
  return <div className="u2-stack">
    <Sheet element={element}>
      <PlatformNote title="نص غير واضح · توضيح من المنصة">
        <p>نص السؤال ② غير واضح بالكامل في الصورة المرفقة. يركز الدرس على ما ظهر من معطيات، ويوجه الطالب إلى مراجعة دروس مقارنة الأعداد الطبيعية في الوحدة.</p>
      </PlatformNote>
    </Sheet>
    <div className="u2-task" data-source-id={element.id}>
      <TaskHead title="فهم المطلوب" page={85} />
      <p className="u2-question"><Rich text={element.prompt} /></p>
      <p className="u2-guidance">يُقارن كل زوج من الأعداد باستخدام علامات المقارنة: أكبر من، أصغر من، أو يساوي.</p>
      <div className="u2-actions"><button type="button" className="u2-button" disabled><Check size={15} aria-hidden="true" /> تحقّق</button></div>
      <Feedback state="idle" hint="يُقارن كل عدد مع الآخر من أعلى منزل إلى أدنى منزل.">
        <p>يُسجل الجواب حسب الأعداد الواضحة في السؤال؛ لا يُخمن عن أرقام غير مطبوعة.</p>
      </Feedback>
    </div>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 4 — السؤال ③ */
function StepQuestion3() {
  const element = findUnit2ExercisesElement('u2-p85-q3')
  return <div className="u2-stack">
    <Sheet element={element}>
      <PlatformNote title="نص غير واضح · توضيح من المنصة">
        <p>نص السؤال ③ غير واضح بالكامل في الصورة المرفقة. يركز الدرس على ما ظهر من أحرف وأعداد، ويوجه الطالب إلى مراجعة دروس ترتيب الأعداد الطبيعية في الوحدة.</p>
      </PlatformNote>
    </Sheet>
    <div className="u2-task" data-source-id={element.id}>
      <TaskHead title="ترتيب الأعداد" page={85} />
      <p className="u2-question"><Rich text={element.prompt} /></p>
      <p className="u2-guidance">يُكتب العدد الأكبر في المكان المخصص للأكبر، والعدد الأصغر في المكان المخصص للأصغر.</p>
      <div className="u2-actions"><button type="button" className="u2-button" disabled><Check size={15} aria-hidden="true" /> تحقّق</button></div>
      <Feedback state="idle" hint="يُرتب الأعداد حسب القواعد المستفادة في دروس الوحدة.">
        <p>يُسجل الترتيب حسب ما ظهر بوضوح في السؤال؛ لا يُخمن عن أرقام غير مطبوعة.</p>
      </Feedback>
    </div>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 5 — السؤال ④ (فرق بين عددين) */
function StepQuestion4() {
  const element = findUnit2ExercisesElement('u2-p85-q4')
  const [answer, setAnswer] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const ok = answer.trim() === '100'
  return <div className="u2-stack">
    <Sheet element={element} />
    <div className="u2-task" data-source-id={element.id}>
      <TaskHead title="احسب الفرق بين العددين" page={85} />
      <p className="u2-question"><Rich text={element.prompt} /></p>
      <ul className="u2-given" aria-label="المعطيات">
        <li><MathExpression>140000</MathExpression> و<MathExpression>139900</MathExpression>.</li>
        <li>المطلوب: الفرق بين العددين.</li>
      </ul>
      <label className="u2-field">الفرق <input className="u2-input" inputMode="numeric" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label="الفرق بين العددين" /></label>
      <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
      <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="نطرح العدد الأصغر من الأكبر: 140000 − 139900.">
        <p><MathExpression>140000 − 139900 = 100</MathExpression>.</p>
        <p>التحقق: <MathExpression>139900 + 100 = 140000</MathExpression> ✔</p>
      </Feedback>
    </div>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 6 — السؤال ⑤ (الكسور العشرية) */
function DecimalBranch({ branch }: { branch: SourceBranch & { page?: number } }) {
  const [answer, setAnswer] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const expected = branch.answer
  const ok = answer.trim() === expected
  return <div className="u2-task" data-source-id={branch.id}>
    <TaskHead title={branch.label} page={85} />
    <p className="u2-question"><Rich text={branch.prompt} /></p>
    <label className="u2-field">العدد العشري <input className="u2-input" inputMode="decimal" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label={`العدد العشري للفرع ${branch.label}`} /></label>
    <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="نكتب الجزء الصحيح، ثم نقطة عشرية، ثم الجزء العشري من اليسار إلى اليمين.">
      <p>{expected}.</p>
      <p>التحقق: يُقرأ العدد من اليسار إلى اليمين ويطابق الأجزاء المطبوعة.</p>
    </Feedback>
  </div>
}
function StepQuestion5() {
  const element = findUnit2ExercisesElement('u2-p85-q5')
  return <div className="u2-stack">
    <Sheet element={element} />
    {element.branches!.slice(0, 9).map((branch) => <DecimalBranch key={branch.id} branch={branch} />)}
    <div className="u2-task" data-source-id="u2-p85-q5-l">
      <TaskHead title="الجزء (ل): مقارنة الأعداد" page={85} />
      <p className="u2-question"><Rich text={element.branches![9].prompt} /></p>
      {element.branches!.slice(10).map((sub) => {
        const [answer, setAnswer] = useState('')
        const [checked, setChecked, attempts] = useChecked()
        const ok = answer.trim() === sub.answer
        return <div key={sub.id} className="u2-subtask">
          <p className="u2-question"><Rich text={sub.prompt} /></p>
          <div className="u2-choice-row">
            {(['>', '<', '='] as const).map((value) => <label key={value} className={`u2-choice ${toneClass(checked, answer === value, value === sub.answer)}`}>
              <input type="radio" name={`u2-q5-l-${sub.id}`} checked={answer === value} onChange={() => { setChecked(false); setAnswer(value) }} />
              {value}
            </label>)}
          </div>
          <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
          <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="نحول الكسور إلى أعداد عشرية أو نستخدم التقليب العرضي، ثم نضع العلامة.">
            <p>{sub.answer}.</p>
            <p>{sub.id === 'u2-p85-q5-la' ? '7×7 = 49 و 6×8 = 48، ف 49 > 48.' : sub.id === 'u2-p85-q5-lb' ? '3/10 = 0.3 و 0.3 > 0.02.' : sub.id === 'u2-p85-q5-lc' ? '3/4 = 9/12 و 5 < 9، إذن 5/12 < 3/4.' : sub.id === 'u2-p85-q5-ld' ? '7 1/2 = 7.5 و 7.65 > 7.5.' : sub.id === 'u2-p85-q5-le' ? 'جزء العشر: 2 < 3، إذن 0.217 < 0.317.' : '4÷5 = 0.8، إذن 4/5 = 0.8.'}</p>
          </Feedback>
        </div>
      })}
    </div>
  </div>
}

/* ------------------------------------------------------------------ الخطوة 7 — السؤال ⑥ (مقارنة كسور/أعداد عشرية) */
function StepQuestion6() {
  const element = findUnit2ExercisesElement('u2-p85-q6')
  return <div className="u2-stack">
    <Sheet element={element} />
    {element.branches!.map((branch) => {
      const [answer, setAnswer] = useState('')
      const [checked, setChecked, attempts] = useChecked()
      const ok = answer.trim() === branch.answer
      return <div key={branch.id} className="u2-task" data-source-id={branch.id}>
        <TaskHead title={branch.label} page={85} />
        <p className="u2-question"><Rich text={branch.prompt} /></p>
        <div className="u2-choice-row">
          {(['>', '<', '='] as const).map((value) => <label key={value} className={`u2-choice ${toneClass(checked, answer === value, value === branch.answer)}`}>
            <input type="radio" name={`u2-q6-${branch.id}`} checked={answer === value} onChange={() => { setChecked(false); setAnswer(value) }} />
            {value}
          </label>)}
        </div>
        <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="نحول الكسور إلى أعداد عشرية أو نستخدم التقليب العرضي، ثم نضع العلامة.">
          <p>{branch.answer}.</p>
          <p>{branch.id === 'u2-p85-q6-a' ? '7×7 = 49 و 6×8 = 48، ف 49 > 48.' : branch.id === 'u2-p85-q6-b' ? '3/10 = 0.3 و 0.3 > 0.02.' : branch.id === 'u2-p85-q6-c' ? '3/4 = 9/12 و 5 < 9، إذن 5/12 < 3/4.' : branch.id === 'u2-p85-q6-d' ? '7 1/2 = 7.5 و 7.65 > 7.5.' : branch.id === 'u2-p85-q6-e' ? 'جزء العشر: 2 < 3، إذن 0.217 < 0.317.' : '4÷5 = 0.8، إذن 4/5 = 0.8.'}</p>
        </Feedback>
      </div>
    })}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 8 — السؤال ⑦ */
function StepQuestion7() {
  const element = findUnit2ExercisesElement('u2-p86-q7')
  return <div className="u2-stack">
    <Sheet element={element} />
    {element.branches!.map((branch) => {
      const [answer, setAnswer] = useState('')
      const [checked, setChecked, attempts] = useChecked()
      const ok = answer.trim() === branch.answer
      return <div key={branch.id} className="u2-task" data-source-id={branch.id}>
        <TaskHead title={branch.label} page={86} />
        <p className="u2-question"><Rich text={branch.prompt} /></p>
        <div className="u2-choice-row">
          {(['>', '<', '='] as const).map((value) => <label key={value} className={`u2-choice ${toneClass(checked, answer === value, value === branch.answer)}`}>
            <input type="radio" name={`u2-q7-${branch.id}`} checked={answer === value} onChange={() => { setChecked(false); setAnswer(value) }} />
            {value}
          </label>)}
        </div>
        <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="نقارن من اليسار إلى اليمين: جزء العشر، ثم جزء المئة، إلخ.">
          <p>{branch.answer}.</p>
          <p>{branch.id === 'u2-p86-q7-a' ? 'جزء المئة: 2 < 3، إذن 0.023 < 0.032.' : branch.id === 'u2-p86-q7-b' ? '2 3/4 = 2.75، إذن متساويان.' : '4/14 يُختزل إلى 2/7، إذن متساويان.'}</p>
        </Feedback>
      </div>
    })}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 9 — السؤال ⑧ */
function StepQuestion8() {
  const element = findUnit2ExercisesElement('u2-p86-q8')
  return <div className="u2-stack">
    <Sheet element={element} />
    {element.branches!.map((branch) => {
      const [answer, setAnswer] = useState('')
      const [checked, setChecked, attempts] = useChecked()
      const ok = answer.trim() === branch.answer
      return <div key={branch.id} className="u2-task" data-source-id={branch.id}>
        <TaskHead title={branch.label} page={86} />
        <p className="u2-question"><Rich text={branch.prompt} /></p>
        <label className="u2-field">الأعداد العشرية <input className="u2-input" inputMode="text" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label={`الأعداد العشرية للفرع ${branch.label}`} /></label>
        <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="نقسم البسط على المقام لكل كسر، ونكتب النتيجة كعدد عشري.">
          <p>{branch.answer}.</p>
          <p>التحقق: يُضرب العدد العشر في المقام ليعطي البسط.</p>
        </Feedback>
      </div>
    })}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 10 — السؤال ⑨ */
function StepQuestion9() {
  const element = findUnit2ExercisesElement('u2-p86-q9')
  return <div className="u2-stack">
    <Sheet element={element} />
    {element.branches!.map((branch) => {
      const [answer, setAnswer] = useState('')
      const [checked, setChecked, attempts] = useChecked()
      const ok = answer.trim() === branch.answer
      return <div key={branch.id} className="u2-task" data-source-id={branch.id}>
        <TaskHead title={branch.label} page={86} />
        <p className="u2-question"><Rich text={branch.prompt} /></p>
        <label className="u2-field">الكسور <input className="u2-input" inputMode="text" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label={`الكسور للفرع ${branch.label}`} /></label>
        <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="إذا كان البسط أصغر من المقام يظل الكسر عادياً؛ وإلا يُحول إلى عدد مختلط.">
          <p>{branch.answer}.</p>
          <p>جميع هذه الكسور فرعية (البسط أقل من المقام)، إذن تبقى كما هي.</p>
        </Feedback>
      </div>
    })}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 11 — السؤال ⑩ */
function StepQuestion10() {
  const element = findUnit2ExercisesElement('u2-p86-q10')
  return <div className="u2-stack">
    <Sheet element={element} />
    {element.branches!.map((branch) => {
      const [answer, setAnswer] = useState('')
      const [checked, setChecked, attempts] = useChecked()
      const ok = answer.trim() === branch.answer
      return <div key={branch.id} className="u2-task" data-source-id={branch.id}>
        <TaskHead title={branch.label} page={86} />
        <p className="u2-question"><Rich text={branch.prompt} /></p>
        <label className="u2-field">الكسر غير الفرعي <input className="u2-input" inputMode="text" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label={`الكسر غير الفرعي للفرع ${branch.label}`} /></label>
        <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
        <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="نضرب الجزء الصحيح في المقام ونضيف البسط، ونكتب النتيجة فوق المقام.">
          <p>{branch.answer}.</p>
          <p>التحقق: نقسم البسط على المقام ليعطينا العدد المختلط الأصلي.</p>
        </Feedback>
      </div>
    })}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 12 — السؤال ⑪ (الهندسة) */
function GeometryBranch({ branch }: { branch: SourceBranch & { page?: number } }) {
  const [answer, setAnswer] = useState('')
  const [checked, setChecked, attempts] = useChecked()
  const expected = branch.answer
  const ok = answer.trim() === expected
  return <div className="u2-task" data-source-id={branch.id}>
    <TaskHead title={branch.label} page={86} />
    <p className="u2-question"><Rich text={branch.prompt} /></p>
    <ul className="u2-given" aria-label="المعطيات">
      <li>مستطيل ABCD، ومستطيل EFGC داخله في الزاوية اليمنى السفلية.</li>
      <li><MathExpression>AD = 8cm</MathExpression> و<MathExpression>CG = 2cm</MathExpression> و<MathExpression>DC = 8cm</MathExpression>.</li>
    </ul>
    <label className="u2-field">الطول بالسنتيمتر <input className="u2-input" inputMode="decimal" value={answer} onChange={(event) => { setChecked(false); setAnswer(event.target.value) }} aria-label={`طول ${branch.label}`} /></label>
    <div className="u2-actions"><button type="button" className="u2-button" onClick={() => setChecked(true)} disabled={!answer.trim()}><Check size={15} aria-hidden="true" /> تحقّق</button></div>
    <Feedback state={checked ? (ok ? 'correct' : 'wrong') : 'idle'} attempts={attempts} hint="في المستطيل كل ضلعين متقابلين متساويان، والنقطة G على الضلع DC تعني DG + GC = DC.">
      <p>{expected}.</p>
      <p>التحقق: يُقاس كل ضلع بالمسطرة ويُقارن مع المحسوب.</p>
    </Feedback>
  </div>
}
function StepQuestion11() {
  const element = findUnit2ExercisesElement('u2-p86-q11')
  return <div className="u2-stack">
    <Sheet element={element}>
      <PlatformNote title="رسم توضيحي من المنصة">
        <p>المستطيل ABCD الكبير، وفي الزاوية اليمنى السفلية مستطيل أصغر EFGC. AD = 8cm (الضلع الرأسي الأيسر)، CG = 2cm (الجزء السفلي من الضلع DC)، DC = 8cm (الضلع السفلي).</p>
      </PlatformNote>
    </Sheet>
    {element.branches!.map((branch) => <GeometryBranch key={branch.id} branch={branch} />)}
  </div>
}

/* ------------------------------------------------------------------ الخطوة 13 — الخلاصة */
function StepSummary() {
  return <div className="u2-stack">
    <ul className="u2-summary" data-platform-id="u2-platform-summary">
      <li><strong>الكسور العشرية · ص 85–86</strong><span>يكتب الجزء الصحيح ثم نقطة ثم الجزء العشري، ويقارن من اليسار إلى اليمين.</span></li>
      <li><strong>المقارنة · ص 85</strong><span>نستخدم علامة أكبر من أو أصغر من أو تساوي بعد تحويل الكسور إلى أعداد عشرية أو بالتقليب العرضي.</span></li>
      <li><strong>الأعداد المختلطة · ص 86</strong><span>نحول إلى كسر غير فرعي بضرب الجزء الصحيح في المقام وإضافة البسط.</span></li>
      <li><strong>الأطوال المركبة · ص 86</strong><span>في المستطيل الضلعان المتقابلان متساويان، ونجمع أو نطرح على الاستقامة نفسها.</span></li>
    </ul>
    <PlatformNote title="ما الذي أضافته المنصة؟">
      <ul>
        <li>تلميحات تدريجية، وتحقيق تفاعلي لكل تمرين، وفصل واضح بين محتوى الكتاب وشرح المنصة.</li>
        <li>كل نص سؤال ورقم صفحة منقولة من الكتاب ص 85–86، مع ملاحظة عن النصوص غير الواضحة.</li>
      </ul>
    </PlatformNote>
    <div className="u2-task">
      <TaskHead title="اختبار الوحدة الثانية" platform />
      <p>عشرون سؤالاً جديداً متدرجة (6 أساسي · 7 متوسط · 4 متقدّم · 3 تفكير). لا تظهر أي إجابة أثناء المحاولة؛ تُعرض النتيجة والحلول بعد التسليم فقط.</p>
      <div className="u2-actions">
        <a className="u2-test-link" href="#tests/run/unit-unit-2-test"><Sparkles size={17} aria-hidden="true" /> ابدأ اختبار الوحدة الثانية</a>
      </div>
    </div>
  </div>
}

/* =============================================================================================
   الدرس
   ============================================================================================= */
export function Unit2ExercisesLesson() {
  const [activeStep, setActiveStep] = useState(0)
  const steps: LessonStep[] = useMemo(() => [
    { id: 'u2-intro', title: 'مقدمة: مراجعة الوحدة الثانية', content: <StepIntro /> },
    { id: 'u2-q1', title: 'السؤال ①: الأعداد الطبيعية والكسر العشري', content: <StepQuestion1 /> },
    { id: 'u2-q2', title: 'السؤال ②: مقارنة الأعداد الطبيعية', content: <StepQuestion2 /> },
    { id: 'u2-q3', title: 'السؤال ③: ترتيب الأعداد A, B, C', content: <StepQuestion3 /> },
    { id: 'u2-q4', title: 'السؤال ④: الفرق بين عددين', content: <StepQuestion4 /> },
    { id: 'u2-q5', title: 'السؤال ⑤: الكسور العشرية الناقصة', content: <StepQuestion5 /> },
    { id: 'u2-q6', title: 'السؤال ⑥: مقارنة الكسور العشرية', content: <StepQuestion6 /> },
    { id: 'u2-q7', title: 'السؤال ⑦: مقارنة الكسور العشرية الناقصة', content: <StepQuestion7 /> },
    { id: 'u2-q8', title: 'السؤال ⑧: تحويل الكسور العادية إلى أعداد عشرية', content: <StepQuestion8 /> },
    { id: 'u2-q9', title: 'السؤال ⑨: الكسور العادية إلى أعداد مختلطة', content: <StepQuestion9 /> },
    { id: 'u2-q10', title: 'السؤال ⑩: الأعداد المختلطة إلى كسور غير فرعية', content: <StepQuestion10 /> },
    { id: 'u2-q11', title: 'السؤال ⑪: الأطوال في شكل مركب', content: <StepQuestion11 /> },
    { id: 'u2-summary', title: 'الخلاصة والاختبار', content: <StepSummary /> },
  ], [])
  return <LessonShell title={lessonTitle} steps={steps} activeStep={activeStep} onStepChange={setActiveStep} theme="lesson-unit2-exercises" />
}

export const unit2ExercisesStepCount = 13
export const unit2ExercisesStepIds = ['u2-intro', 'u2-q1', 'u2-q2', 'u2-q3', 'u2-q4', 'u2-q5', 'u2-q6', 'u2-q7', 'u2-q8', 'u2-q9', 'u2-q10', 'u2-q11', 'u2-summary'] as const