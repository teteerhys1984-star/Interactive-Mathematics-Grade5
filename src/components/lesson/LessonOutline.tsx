import { useId, useState } from 'react'
import { Check, ChevronDown, Circle, CircleDot, ListChecks, X } from 'lucide-react'
import type { LessonStep } from './types'

interface LessonOutlineProps {
  steps: LessonStep[]
  activeStep: number
  onStepChange?: (index: number) => void
}

function StepStateIcon({ index, activeStep }: { index: number; activeStep: number }) {
  if (index < activeStep) return <Check size={15} strokeWidth={2.8} aria-hidden="true" />
  if (index === activeStep) return <CircleDot size={17} strokeWidth={2.4} aria-hidden="true" />
  return <Circle size={15} strokeWidth={2} aria-hidden="true" />
}

/**
 * A progress-aware lesson map. It is a full vertical timeline on desktop and a compact,
 * on-demand bottom sheet on small screens so the learning content remains the focus.
 */
export function LessonOutline({ steps, activeStep, onStepChange }: LessonOutlineProps) {
  const [isOpen, setIsOpen] = useState(false)
  const sheetId = useId()
  const currentStep = steps[activeStep]
  const completedCount = activeStep

  const selectStep = (index: number) => {
    onStepChange?.(index)
    setIsOpen(false)
  }

  const timeline = (variant: 'desktop' | 'mobile') => (
    <ol className={`lesson-outline-list is-${variant}`}>
      {steps.map((step, index) => {
        const state = index < activeStep ? 'is-complete' : index === activeStep ? 'is-current' : 'is-upcoming'
        return <li key={step.id} className={state}>
          <button
            type="button"
            className={index === activeStep ? 'is-current' : ''}
            aria-current={index === activeStep ? 'step' : undefined}
            onClick={() => selectStep(index)}
          >
            <span className="lesson-outline-marker"><StepStateIcon index={index} activeStep={activeStep} /></span>
            <span className="lesson-outline-copy"><span className="lesson-outline-number">الخطوة {index + 1}</span><strong>{step.title}</strong></span>
            {index < activeStep && <span className="lesson-outline-status">مكتملة</span>}
          </button>
        </li>
      })}
    </ol>
  )

  return <nav className={`lesson-outline ${isOpen ? 'is-open' : ''}`} aria-label="مخطط الدرس">
    <div className="lesson-outline-desktop">
      <div className="lesson-outline-heading"><span className="lesson-outline-heading-icon"><ListChecks size={17} aria-hidden="true" /></span><div><span>مسار الدرس</span><strong>{completedCount} من {steps.length} مكتملة</strong></div></div>
      <div className="lesson-outline-progress" aria-hidden="true"><span style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div>
      {timeline('desktop')}
    </div>

    <div className="lesson-outline-mobile">
      <button type="button" className="lesson-outline-trigger" aria-expanded={isOpen} aria-controls={sheetId} onClick={() => setIsOpen(true)}>
        <span className="lesson-outline-trigger-icon"><ListChecks size={18} aria-hidden="true" /></span>
        <span className="lesson-outline-trigger-copy"><small>مسار الدرس</small><strong>{currentStep?.title}</strong></span>
        <span className="lesson-outline-trigger-count">{activeStep + 1}/{steps.length}</span>
        <ChevronDown className="lesson-outline-trigger-chevron" size={18} aria-hidden="true" />
      </button>
      {isOpen && <>
        <button type="button" className="lesson-outline-backdrop" aria-label="إغلاق مخطط الدرس" onClick={() => setIsOpen(false)} />
        <section id={sheetId} className="lesson-outline-sheet" role="dialog" aria-modal="true" aria-labelledby={`${sheetId}-title`}>
          <div className="lesson-outline-sheet-handle" aria-hidden="true" />
          <header className="lesson-outline-sheet-header"><div><span>رحلتك في الدرس</span><h2 id={`${sheetId}-title`}>خطوات التعلّم</h2></div><button type="button" className="lesson-outline-close" aria-label="إغلاق مخطط الدرس" onClick={() => setIsOpen(false)}><X size={19} aria-hidden="true" /></button></header>
          <div className="lesson-outline-sheet-progress"><span style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div>
          {timeline('mobile')}
        </section>
      </>}
    </div>
  </nav>
}
