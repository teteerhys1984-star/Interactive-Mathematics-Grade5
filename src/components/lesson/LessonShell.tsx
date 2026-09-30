import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, CircleCheck } from 'lucide-react'
import { curriculumRegistry } from '../../content/registry'
import { InstructorAttribution } from '../InstructorAttribution'
import { LessonOutline } from './LessonOutline'
import type { LessonShellProps } from './types'

/**
 * Premium sequential lesson frame. The shell owns only lesson chrome: progress, wayfinding,
 * navigation, and the responsive outline. Individual lesson content stays untouched.
 */
export function LessonShell({ title, steps, activeStep, onStepChange, theme }: LessonShellProps) {
  const step = steps[activeStep]
  const unit = curriculumRegistry.find(candidate => candidate.lessons.some(lesson => lesson.title === title))
  const unitTitle = unit?.title ?? 'الوحدة التعليمية'
  const progress = Math.round(((activeStep + 1) / steps.length) * 100)

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
          <div className="lesson-title-meta"><span className="lesson-type-pill"><BookOpen size={15} aria-hidden="true" /> درس تفاعلي</span><span className="lesson-step-count">الخطوة {activeStep + 1} من {steps.length}</span></div>
          <h1 id="lesson-title">{title}</h1>
          <p>تعلّم بهدوء، خطوة بعد خطوة، ثم طبّق ما اكتشفته.</p>
          <InstructorAttribution className="lesson-attribution" />
        </div>
        <div className="lesson-progress-card" role="progressbar" aria-label="تقدّمك في الدرس" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={activeStep + 1} aria-valuetext={`الخطوة ${activeStep + 1} من ${steps.length}`}>
          <div className="lesson-progress-card-top"><span>تقدّم الدرس</span><strong>{progress}%</strong></div>
          <div className="lesson-progress-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
          <p><CircleCheck size={16} aria-hidden="true" /> أنجزت {activeStep} {activeStep === 0 ? 'خطوة' : 'خطوات'}، وأنت الآن في «{step.title}».</p>
        </div>
      </div>
    </header>

    <div className="lesson-experience-body">
      <LessonOutline steps={steps} activeStep={activeStep} onStepChange={onStepChange} />
      <div className="lesson-main">
        <section className="lesson-step-panel" key={step.id} aria-labelledby="lesson-section-title" data-step-id={step.id}>
          <header className="lesson-section-header"><span className="lesson-section-eyebrow">القسم الحالي</span><span className="lesson-section-number">{String(activeStep + 1).padStart(2, '0')}</span><h2 id="lesson-section-title">{step.title}</h2></header>
          <div className="lesson-content">{step.content}</div>
        </section>
        <nav className="lesson-navigation" aria-label="التنقل بين خطوات الدرس">
          <button type="button" className="lesson-nav-button is-previous" disabled={activeStep === 0} onClick={() => onStepChange?.(activeStep - 1)}><ArrowRight size={18} aria-hidden="true" /> السابق</button>
          <span className="lesson-navigation-status">{activeStep + 1} / {steps.length}</span>
          <button type="button" className="lesson-nav-button is-next" disabled={activeStep === steps.length - 1} onClick={() => onStepChange?.(activeStep + 1)}>التالي <ArrowLeft size={18} aria-hidden="true" /></button>
        </nav>
      </div>
    </div>
  </section>
}
