import { useState } from 'react'
import { Check, Lightbulb, Sparkles } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import { SourceCard } from '../components/lesson/SourceCard'
import { LessonShell } from '../components/lesson/LessonShell'
import type { LessonStep } from '../components/lesson/types'
import { roundingBookFacts, roundingBookTasks, type RoundingBookTask } from './roundingData'
import {
  finalAssessment4,
  isFinalAssessment4AnswerCorrect,
  isRoundingBookAnswerCorrect,
} from '../teacher/lesson4'

type Feedback = { kind: 'correct' | 'incorrect' | 'empty'; message: string }

function ProportionalNumberLine({ task }: { task: RoundingBookTask }) {
  const labels = task.lineLabels
  const lineRange = task.lineRange
  const targetValue = Number(task.lineTargetValue)
  if (!labels || labels.length < 2 || !lineRange || !task.lineTargetValue) return null

  const values = labels.map(Number)
  const [minimum, maximum] = lineRange
  const range = maximum - minimum
  if (!Number.isFinite(range) || range <= 0 || !Number.isFinite(targetValue)) return null

  const padding = Math.max(16, Math.ceil(Math.max(...labels.map(label => label.length)) * 3.6))
  const position = (value: number) => `${Number((((value - minimum) / range) * 100).toFixed(6))}%`
  const tickStep = task.lineTickStep
  const regularTicks = tickStep && Number.isSafeInteger(tickStep) && tickStep > 0 && range % tickStep === 0
    ? Array.from({ length: range / tickStep + 1 }, (_, index) => minimum + index * tickStep)
    : []
  const ticks = regularTicks
  const isMajorTick = (tick: number) => task.lineMajorTickStep
    ? (tick - minimum) % task.lineMajorTickStep === 0
    : values.includes(tick)

  return (
    <div
      role="group"
      aria-label={`خط أعداد من ${minimum} إلى ${maximum}. العلامات المسمّاة: ${labels.join('، ')}. القيمة المطلوب تمثيلها: ${task.lineTargetValue}.`}
      data-numberline-min={minimum}
      data-numberline-max={maximum}
      data-numberline-tick-step={tickStep}
      data-numberline-major-tick-step={task.lineMajorTickStep}
      data-numberline-target-value={task.lineTargetValue}
      data-numberline-target-position={position(targetValue)}
      className="rounding-number-line"
      style={{ position: 'relative', width: '100%', height: 58, margin: '12px auto', boxSizing: 'border-box', direction: 'ltr' }}
    >
      <div style={{ position: 'absolute', left: padding, right: padding, top: 12, height: 1, background: 'currentColor' }} aria-hidden="true">
        {ticks.map(tick => (
          <span
            key={tick}
            aria-hidden="true"
            data-numberline-tick={tick}
            style={{ position: 'absolute', left: position(tick), top: 0, height: isMajorTick(tick) ? 12 : 7, borderLeft: '1px solid currentColor' }}
          />
        ))}
      </div>
      <div style={{ position: 'absolute', left: padding, right: padding, top: 25, height: 30 }}>
        {labels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            data-numberline-value={label}
            style={{ position: 'absolute', left: position(values[index]), transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: 'clamp(0.625rem, 2.6vw, 0.875rem)' }}
          >
            <MathExpression>{label}</MathExpression>
          </span>
        ))}
      </div>
    </div>
  )
}

function RoundingTask({ task }: { task: RoundingBookTask }) {
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const labelId = `${task.id}-prompt`
  const feedbackId = `${task.id}-feedback`

  const check = () => {
    if (!value.trim()) {
      setFeedback({ kind: 'empty', message: 'أدخل إجابتك أولاً ثم اضغط «تحقّق».' })
      return
    }
    const correct = isRoundingBookAnswerCorrect(task.id, value)
    setFeedback({
      kind: correct ? 'correct' : 'incorrect',
      message: correct
        ? 'إجابة صحيحة. أحسنت!'
        : task.kind === 'explanation'
          ? 'راجع الفكرة: اذكر المنزلة المطلوبة، والرقم المجاور لها، وسبب الزيادة أو الإبقاء.'
          : 'ليست صحيحة بعد. راجع المنزلة المطلوبة والرقم الذي يليها مباشرة، ثم حاول ثانية.',
    })
  }

  return (
    <section className="interaction-card" data-source-id={task.id} aria-labelledby={labelId}>
      <span className="source-label">الكتاب · ص {task.page} · <BidiText>{task.section}</BidiText></span>
      <h3 id={labelId}><BidiText>{task.prompt}</BidiText></h3>
      {task.lineLabels && <ProportionalNumberLine task={task} />}
      {task.kind === 'choice' ? (
        <fieldset style={{ border: 0, padding: 0, margin: '12px 0' }}>
          <legend>اختر إجابة واحدة</legend>
          <div role="group" aria-labelledby={labelId}>
            {task.choices?.map((choice, index) => (
              <label key={choice} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginInlineEnd: 14, padding: '7px 4px' }}>
                <input
                  type="radio"
                  name={task.id}
                  value={choice}
                  checked={value === choice}
                  aria-label={choice}
                  onChange={() => { setValue(choice); setFeedback(null) }}
                />
                {/^\d/u.test(choice) ? <MathExpression>{choice}</MathExpression> : <span>{choice}</span>}
              </label>
            ))}
          </div>
        </fieldset>
      ) : task.kind === 'explanation' ? (
        <label className="test-question">
          <span>اكتب تفسيرك</span>
          <textarea
            aria-label={`${task.section}: اكتب تفسيرك`}
            value={value}
            rows={3}
            onChange={event => { setValue(event.target.value); setFeedback(null) }}
          />
        </label>
      ) : (
        <label className="test-question">
          <span>الإجابة العددية</span>
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            aria-label={`${task.section}: الإجابة العددية`}
            value={value}
            onChange={event => { setValue(event.target.value); setFeedback(null) }}
          />
        </label>
      )}
      <button type="button" className="primary-button" onClick={check}>تحقّق</button>
      {feedback && (
        <p id={feedbackId} role={feedback.kind === 'empty' ? 'alert' : 'status'} aria-live={feedback.kind === 'empty' ? 'assertive' : 'polite'} className={feedback.kind === 'correct' ? 'gentle-feedback good' : 'gentle-feedback'}>
          {feedback.message}
        </p>
      )}
    </section>
  )
}

function SourcePage({ page }: { page: 15 | 16 | 17 | 18 }) {
  const tasks = roundingBookTasks.filter(task => task.page === page)
  return (
    <div>
      {page === 15 && (
        <>
          <SourceCard label="الكتاب · ص 15">
            <h3>تقريب الأعداد الطبيعية</h3>
            <p>يذكر الكتاب أن بُعد القمر عن الأرض نحو <MathExpression>{roundingBookFacts.moonDistance}</MathExpression> كم، وأن مساحة الصحراء الكبرى <MathExpression>{roundingBookFacts.saharaArea}</MathExpression> كم².</p>
            <p>هذه معلومات تمهيدية في الصفحة؛ أسئلة تقريب العددين مطبوعة لاحقاً في «تحقّق من فهمك» ص 17.</p>
          </SourceCard>
          <div className="definition-box"><strong>قاعدة التقريب</strong><p>نحدد المنزلة المطلوبة، ثم نفحص الرقم الذي على يمينها مباشرة. إذا كان 5 أو أكبر نزيد المنزلة واحداً، وإذا كان أقل من 5 نبقيها، ثم نجعل الخانات إلى يمينها أصفاراً.</p></div>
        </>
      )}
      {page === 16 && (
        <SourceCard label="الكتاب · ص 16 · استكمال المثال المحلول">
          <h3>خطوات تقريب 2137 إلى أقرب ألف</h3>
          <ol>
            <li>منزلة التقريب هي آحاد الألوف.</li>
            <li>رقم المئات إلى يمينها هو 1، وهو أصغر من 5؛ لذلك نبقي 2 في الألوف.</li>
            <li>نصفر المئات والعشرات والآحاد، فيكون الناتج <MathExpression>2000</MathExpression>.</li>
          </ol>
        </SourceCard>
      )}
      {tasks.map(task => <RoundingTask key={task.id} task={task} />)}
    </div>
  )
}

function AdditionalAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const correctCount = finalAssessment4.filter(question => isFinalAssessment4AnswerCorrect(question, answers[question.id] ?? '')).length

  return (
    <div className="final-test" data-platform-id="rounding-final-assessment">
      <div className="step-banner"><Sparkles size={20} aria-hidden="true" />اختبار شامل جديد — إضافي من إعداد المنصة، وليس منقولاً من الكتاب</div>
      {finalAssessment4.map(question => {
        const value = answers[question.id] ?? ''
        const correct = isFinalAssessment4AnswerCorrect(question, value)
        return (
          <label className="test-question" key={question.id}>
            <strong>{question.text}</strong>
            {question.kind === 'explanation' ? (
              <textarea
                aria-label={`${question.id}: إجابة تفسيرية`}
                rows={3}
                value={value}
                onChange={event => { setAnswers(previous => ({ ...previous, [question.id]: event.target.value })); setSubmitted(false) }}
              />
            ) : (
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                aria-label={`${question.id}: إجابة عددية`}
                value={value}
                onChange={event => { setAnswers(previous => ({ ...previous, [question.id]: event.target.value })); setSubmitted(false) }}
              />
            )}
            {submitted && <span role="status" aria-live="polite" className={correct ? 'gentle-feedback good' : 'gentle-feedback'}>{correct ? 'إجابة صحيحة.' : value.trim() ? 'راجع المنزلة المطلوبة والرقم المجاور أو معيار التفسير.' : 'لم تُجب عن هذا السؤال.'}</span>}
          </label>
        )
      })}
      <button type="button" className="primary-button" onClick={() => setSubmitted(true)}>عرض النتيجة <Check size={16} aria-hidden="true" /></button>
      {submitted && <p className="test-result" role="status" aria-live="polite">نتيجتك: {correctCount} / {finalAssessment4.length}.</p>}
    </div>
  )
}

export function RoundingLesson() {
  const pages: readonly (15 | 16 | 17 | 18)[] = [15, 16, 17, 18]
  const steps: LessonStep[] = [
    ...pages.map(page => ({ id: `rounding-page-${page}`, title: `محتوى الكتاب · ص ${page}`, content: <SourcePage page={page} /> })),
    { id: 'rounding-platform-assessment', title: 'اختبار إضافي من إعداد المنصة', content: <AdditionalAssessment /> },
  ]
  const [active, setActive] = useState(0)
  return <LessonShell title="تقريب الأعداد الطبيعية" steps={steps} activeStep={active} onStepChange={setActive} theme="lesson-four" />
}
