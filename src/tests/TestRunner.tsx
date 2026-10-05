import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { hasProvidedAnswer, scoreTest } from './scoring'
import { QuestionRenderer } from './QuestionRenderer'
import { RichContentView } from './RichContentView'
import { testListHref, testSolutionsHref } from './routing'
import type { TestDefinition, TestResult, StudentAnswer } from './types'

export type FractionInputMode = 'fraction' | 'decimal'

export type TestAttempt =
  | {
      testId: string
      status: 'in-progress'
      currentQuestionIndex: number
      answers: Readonly<Record<string, StudentAnswer | undefined>>
      fractionModes: Readonly<Record<string, FractionInputMode | undefined>>
    }
  | {
      testId: string
      status: 'submitted'
      currentQuestionIndex: number
      answers: Readonly<Record<string, StudentAnswer | undefined>>
      fractionModes: Readonly<Record<string, FractionInputMode | undefined>>
      result: TestResult
    }

export function createTestAttempt(testId: string): TestAttempt {
  return {
    testId,
    status: 'in-progress',
    currentQuestionIndex: 0,
    answers: {},
    fractionModes: {},
  }
}

interface TestRunnerProps {
  test: TestDefinition
  title: string
  context: string
  attempt: TestAttempt
  onAttemptChange: (attempt: TestAttempt) => void
}

export function TestRunner({ test, title, context, attempt, onAttemptChange }: TestRunnerProps) {
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const totalQuestions = test.questions.length

  if (test.id !== attempt.testId || totalQuestions === 0) {
    return <section className="test-runner-error" role="alert">
      <h1>تعذّر بدء هذا الاختبار</h1>
      <p>تعريف الاختبار غير مكتمل، لذلك لن يبدأ مشغّل الأسئلة.</p>
      <a className="test-secondary-button" href={testListHref(test.type === 'lesson' ? 'lessons' : test.type === 'unit' ? 'units' : 'comprehensive')}>العودة إلى الاختبارات</a>
    </section>
  }

  if (attempt.status === 'submitted') {
    return <TestResults test={test} title={title} context={context} result={attempt.result} onRestart={() => onAttemptChange(createTestAttempt(test.id))} />
  }

  const currentIndex = Math.min(Math.max(attempt.currentQuestionIndex, 0), totalQuestions - 1)
  const currentQuestion = test.questions[currentIndex]
  if (!currentQuestion) {
    return <section className="test-runner-error" role="alert"><h1>تعذّر فتح السؤال</h1><p>لم يُعثر على السؤال المحدد في تعريف هذا الاختبار.</p><a href="#tests">العودة إلى الاختبارات</a></section>
  }

  const answeredCount = test.questions.filter((question) => hasProvidedAnswer(question, attempt.answers[question.id])).length
  const unansweredCount = totalQuestions - answeredCount
  const position = currentIndex + 1
  const positionPercent = Math.round((position / totalQuestions) * 100)
  const updateAnswer = (answer: StudentAnswer | undefined) => onAttemptChange({
    ...attempt,
    answers: { ...attempt.answers, [currentQuestion.id]: answer },
  })
  const moveToQuestion = (index: number) => onAttemptChange({ ...attempt, currentQuestionIndex: index })

  const submit = () => {
    setSubmitError(false)
    try {
      // Scoring is intentionally invoked only after the learner explicitly confirms submission.
      const result = scoreTest(test, attempt.answers)
      onAttemptChange({ ...attempt, status: 'submitted', result })
      setConfirmationOpen(false)
    } catch {
      setSubmitError(true)
      setConfirmationOpen(false)
    }
  }

  return <section className="test-runner" aria-labelledby="test-runner-title">
    <div className="test-runner-heading">
      <a className="test-back-link" href={testListHref(test.type === 'lesson' ? 'lessons' : test.type === 'unit' ? 'units' : 'comprehensive')}><ArrowRight size={17} aria-hidden="true" /> قائمة الاختبارات</a>
      <p className="test-context">{context}</p>
      <h1 id="test-runner-title">{title}</h1>
      {test.instructions.length > 0 && <div className="test-instructions"><RichContentView content={test.instructions} /></div>}
    </div>

    <div className="test-progress-card">
      <div className="test-progress-card-heading">
        <span>السؤال {position} من {totalQuestions}</span>
        <strong>{answeredCount} مجاب عنها</strong>
      </div>
      <div
        className="test-position-progress"
        role="progressbar"
        aria-label="موضعك في الاختبار"
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-valuenow={position}
        aria-valuetext={`السؤال ${position} من ${totalQuestions}`}
      ><span style={{ width: `${positionPercent}%` }} /></div>
    </div>

    <div className="test-runner-layout">
      <div className="test-question-column">
        <article className="test-question-card" aria-labelledby={`prompt-${currentQuestion.id}`}>
          <div className="test-question-kicker"><span>السؤال {position}</span><span>{answeredCount} من {totalQuestions} مجاب عنها</span></div>
          <h2 id={`prompt-${currentQuestion.id}`} className="test-question-prompt"><RichContentView content={currentQuestion.prompt} /></h2>
          <QuestionRenderer
            key={currentQuestion.id}
            question={currentQuestion}
            answer={attempt.answers[currentQuestion.id]}
            fractionMode={attempt.fractionModes[currentQuestion.id] ?? 'fraction'}
            onAnswerChange={updateAnswer}
            onFractionModeChange={(mode) => onAttemptChange({
              ...attempt,
              answers: { ...attempt.answers, [currentQuestion.id]: undefined },
              fractionModes: { ...attempt.fractionModes, [currentQuestion.id]: mode },
            })}
          />
        </article>

        <nav className="test-question-navigation" aria-label="التنقل بين أسئلة الاختبار">
          <button type="button" className="test-secondary-button" disabled={currentIndex === 0} onClick={() => moveToQuestion(currentIndex - 1)}><ArrowRight size={17} aria-hidden="true" /> السابق</button>
          <span aria-live="polite">السؤال {position} من {totalQuestions}</span>
          {currentIndex < totalQuestions - 1
            ? <button type="button" className="test-primary-button" onClick={() => moveToQuestion(currentIndex + 1)}>التالي <ArrowLeft size={17} aria-hidden="true" /></button>
            : <button type="button" className="test-primary-button" onClick={() => setConfirmationOpen(true)}>تسليم الاختبار</button>}
        </nav>
      </div>

      <aside className="test-question-sidebar">
        <details className="test-question-map">
          <summary>قائمة الأسئلة <span>{answeredCount}/{totalQuestions}</span></summary>
          <p className="test-question-map-hint">اختر رقماً للانتقال إلى السؤال. العلامة تشير إلى وجود إجابة فقط.</p>
          <nav aria-label="اختيار سؤال">
            <ol>
              {test.questions.map((question, index) => {
                const answered = hasProvidedAnswer(question, attempt.answers[question.id])
                return <li key={question.id}>
                  <button
                    type="button"
                    className="test-question-map-item"
                    data-answered={answered || undefined}
                    aria-current={index === currentIndex ? 'step' : undefined}
                    aria-label={`السؤال ${index + 1}${answered ? '، تمت الإجابة' : '، بلا إجابة'}`}
                    onClick={() => moveToQuestion(index)}
                  >{index + 1}</button>
                </li>
              })}
            </ol>
          </nav>
        </details>
        <div className="test-answer-status" aria-live="polite">
          <span className="test-answer-status-mark" aria-hidden="true"><Check size={15} /></span>
          <p><strong>{answeredCount}</strong> مجاب عنها · <strong>{unansweredCount}</strong> بلا إجابة</p>
        </div>
        <button type="button" className="test-submit-secondary" onClick={() => setConfirmationOpen(true)}>مراجعة وتسليم الاختبار</button>
      </aside>
    </div>

    {confirmationOpen && <SubmissionDialog
      answeredCount={answeredCount}
      unansweredCount={unansweredCount}
      totalQuestions={totalQuestions}
      onContinue={() => setConfirmationOpen(false)}
      onReview={() => {
        const firstUnanswered = test.questions.findIndex((question) => !hasProvidedAnswer(question, attempt.answers[question.id]))
        if (firstUnanswered >= 0) moveToQuestion(firstUnanswered)
        setConfirmationOpen(false)
      }}
      onSubmit={submit}
    />}
    {submitError && <p className="test-inline-error" role="alert">تعذّر تسليم الاختبار. لم تُعرض نتيجة، ويمكنك المحاولة مرة أخرى.</p>}
  </section>
}

function TestResults({ test, title, context, result, onRestart }: {
  test: TestDefinition
  title: string
  context: string
  result: TestResult
  onRestart: () => void
}) {
  return <section className="test-result-page" aria-labelledby="test-result-title">
    <a className="test-back-link" href={testListHref(test.type === 'lesson' ? 'lessons' : test.type === 'unit' ? 'units' : 'comprehensive')}><ArrowRight size={17} aria-hidden="true" /> قائمة الاختبارات</a>
    <p className="test-context">{context}</p>
    <div className="test-result-card">
      <span className="test-result-kicker">اكتملت المحاولة</span>
      <h1 id="test-result-title">نتيجة الاختبار</h1>
      <p className="test-result-test-title">{title}</p>
      <div className="test-score-display"><strong>{result.score}</strong><span>من</span><strong>{result.maxScore}</strong></div>
      <p className="test-percentage">{result.percentage}%</p>
      <dl className="test-result-breakdown">
        <div><dt>إجابات صحيحة</dt><dd>{result.correctCount}</dd></div>
        <div><dt>إجابات غير صحيحة</dt><dd>{result.incorrectCount}</dd></div>
        <div><dt>بلا إجابة</dt><dd>{result.unansweredCount}</dd></div>
      </dl>
      <div className="test-result-actions">
        <a className="test-primary-button" href={testSolutionsHref(test.id, 1)}>عرض الحلول</a>
        <button type="button" className="test-secondary-button" onClick={onRestart}><RotateCcw size={17} aria-hidden="true" /> إعادة الاختبار</button>
        <a className="test-text-link" href={testListHref(test.type === 'lesson' ? 'lessons' : test.type === 'unit' ? 'units' : 'comprehensive')}>العودة إلى قائمة الاختبارات</a>
      </div>
    </div>
  </section>
}

function SubmissionDialog({ answeredCount, unansweredCount, totalQuestions, onContinue, onReview, onSubmit }: {
  answeredCount: number
  unansweredCount: number
  totalQuestions: number
  onContinue: () => void
  onReview: () => void
  onSubmit: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const onContinueRef = useRef(onContinue)
  onContinueRef.current = onContinue

  useEffect(() => {
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ))
    const first = focusable()[0]
    first?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onContinueRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusable()
      if (items.length > 0 && !dialog.contains(document.activeElement)) {
        event.preventDefault()
        items[0]?.focus()
        return
      }
      if (items.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault()
        lastItem?.focus()
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault()
        firstItem?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused.current?.isConnected) previouslyFocused.current.focus()
    }
  }, [])

  return createPortal(<div className="test-dialog-backdrop" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onContinueRef.current()
  }}>
    <div className="test-confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="test-submit-title" aria-describedby="test-submit-summary" tabIndex={-1} ref={dialogRef}>
      <p className="test-dialog-eyebrow">مراجعة قبل التسليم</p>
      <h2 id="test-submit-title">هل تريد تسليم الاختبار؟</h2>
      <div id="test-submit-summary" className="test-submit-summary">
        <p>أجبت عن <strong>{answeredCount}</strong> من <strong>{totalQuestions}</strong> سؤالاً.</p>
        {unansweredCount > 0
          ? <p>ما زال هناك <strong>{unansweredCount}</strong> بلا إجابة. يمكنك مراجعتها أو المتابعة إلى التسليم.</p>
          : <p>لا توجد أسئلة بلا إجابة.</p>}
      </div>
      {unansweredCount > 0 && <button type="button" className="test-secondary-button" onClick={onReview}>مراجعة الأسئلة غير المجابة</button>}
      <div className="test-dialog-actions">
        <button type="button" className="test-text-link" onClick={onContinue}>متابعة الاختبار</button>
        <button type="button" className="test-primary-button" onClick={onSubmit}>تسليم الاختبار</button>
      </div>
    </div>
  </div>, document.body)
}
