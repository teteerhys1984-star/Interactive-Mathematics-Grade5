import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, CircleCheck } from 'lucide-react'
import { curriculumRegistry } from '../../content/registry'
import { InstructorAttribution } from '../InstructorAttribution'
import { LessonOutline } from './LessonOutline'
import type { LessonShellProps } from './types'

/**
 * Premium sequential lesson frame. The shell owns only lesson chrome: position, wayfinding,
 * navigation, and the responsive outline. Individual lesson content stays untouched.
 *
 * Progress semantics (deliberately two separate ideas):
 *   • «موقعك في الدرس» — the current position (activeStep). This is what the bar shows.
 *   • «الخطوات المنجزة» — steps the learner actually visited and then left.
 * Jumping straight to a later step moves the position only; the steps that were skipped are
 * never silently marked as completed.
 */
export function LessonShell({ title, steps, activeStep, onStepChange, theme }: LessonShellProps) {
  const step = steps[activeStep]
  const unit = curriculumRegistry.find(candidate => candidate.lessons.some(lesson => lesson.title === title))
  const unitTitle = unit?.title ?? 'الوحدة التعليمية'
  const position = activeStep + 1
  const positionPercent = Math.round((position / steps.length) * 100)

  // Visited steps are tracked by the shell itself, so no lesson has to change to get honest progress.
  const [visitedSteps, setVisitedSteps] = useState<ReadonlySet<number>>(() => new Set([activeStep]))
  const lessonKey = useRef(title)
  useEffect(() => {
    if (lessonKey.current !== title) {
      lessonKey.current = title
      setVisitedSteps(new Set([activeStep]))
      return
    }
    setVisitedSteps(previous => (previous.has(activeStep) ? previous : new Set(previous).add(activeStep)))
  }, [title, activeStep])

  // A step counts as done once it has been visited and left — never merely because it comes earlier.
  const completedCount = Array.from(visitedSteps).filter(index => index !== activeStep && index >= 0 && index < steps.length).length

  if (!step) return null

  return <section className={`lesson-shell ${theme ?? ''}`} aria-labelledby="lesson-title">
    <header className="lesson-journey-header">
      <nav className="lesson-breadcrumbs" aria-label="مسار الدرس">
        <span>{unitTitle}</span><ChevronLeft size={15} aria-hidden="true" />
        <span>{title}</span><ChevronLeft size={15} aria-hidden="true" />
        <strong aria-current="page">{step.title}</strong>
      </nav>
      <div className="lesson-journey-grid">
        <div className="lesson-title-block">
          <div className="lesson-title-meta"><span className="lesson-type-pill"><BookOpen size={15} aria-hidden="true" /> درس تفاعلي</span><span className="lesson-step-count">الخطوة {position} من {steps.length}</span></div>
          <h1 id="lesson-title">{title}</h1>
          <p>تعلّم بهدوء، خطوة بعد خطوة، ثم طبّق ما اكتشفته.</p>
          <InstructorAttribution className="lesson-attribution" />
        </div>
        <div className="lesson-progress-card">
          <div className="lesson-progress-card-top"><span>موقعك في الدرس</span><strong>{position} / {steps.length}</strong></div>
          <div className="lesson-progress-track" role="progressbar" aria-label="موقعك في الدرس" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={position} aria-valuetext={`الخطوة ${position} من ${steps.length}`}><span style={{ width: `${positionPercent}%` }} /></div>
          <p><CircleCheck size={16} aria-hidden="true" /> {completedCount === 0 ? 'لم تُنهِ أي خطوة بعد' : `أنهيت ${completedCount} من ${steps.length} خطوة`}، وأنت الآن في «{step.title}».</p>
        </div>
      </div>
    </header>

    <div className="lesson-experience-body">
      <LessonOutline steps={steps} activeStep={activeStep} visitedSteps={visitedSteps} onStepChange={onStepChange} />
      <div className="lesson-main">
        <section className="lesson-step-panel" key={step.id} aria-labelledby="lesson-section-title" data-step-id={step.id}>
          <header className="lesson-section-header"><span className="lesson-section-eyebrow">القسم الحالي</span><span className="lesson-section-number">{String(position).padStart(2, '0')}</span><h2 id="lesson-section-title">{step.title}</h2></header>
          <div className="lesson-content">{step.content}</div>
        </section>
        <nav className="lesson-navigation" aria-label="التنقل بين خطوات الدرس">
          <button type="button" className="lesson-nav-button is-previous" disabled={activeStep === 0} onClick={() => onStepChange?.(activeStep - 1)}><ArrowRight size={18} aria-hidden="true" /> السابق</button>
          <span className="lesson-navigation-status">{position} / {steps.length}</span>
          <button type="button" className="lesson-nav-button is-next" disabled={activeStep === steps.length - 1} onClick={() => onStepChange?.(activeStep + 1)}>التالي <ArrowLeft size={18} aria-hidden="true" /></button>
        </nav>
      </div>
    </div>
  </section>
}
