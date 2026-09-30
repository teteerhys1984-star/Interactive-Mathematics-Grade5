import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown, Circle, CircleDot, ListChecks, X } from 'lucide-react'
import type { LessonStep } from './types'

interface LessonOutlineProps {
  steps: LessonStep[]
  activeStep: number
  /** Steps the learner actually opened. Absent = nothing is assumed to be done. */
  visitedSteps?: ReadonlySet<number>
  onStepChange?: (index: number) => void
}

type StepState = 'is-complete' | 'is-current' | 'is-upcoming'

/** Elements that can hold focus inside the bottom sheet (no layout query: must work headless too). */
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function StepStateIcon({ state }: { state: StepState }) {
  if (state === 'is-complete') return <Check size={15} strokeWidth={2.8} aria-hidden="true" />
  if (state === 'is-current') return <CircleDot size={17} strokeWidth={2.4} aria-hidden="true" />
  return <Circle size={15} strokeWidth={2} aria-hidden="true" />
}

/**
 * A position-aware lesson map. It is a full vertical timeline on desktop and a compact,
 * on-demand bottom sheet on small screens so the learning content remains the focus.
 *
 * The mobile sheet is a real modal dialog: focus moves into it on open, Tab/Shift+Tab stay
 * trapped inside it, Escape closes it, and focus always returns to the trigger afterwards.
 */
export function LessonOutline({ steps, activeStep, visitedSteps, onStepChange }: LessonOutlineProps) {
  const [isOpen, setIsOpen] = useState(false)
  const sheetId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const currentStep = steps[activeStep]

  // Only a step that was visited and then left is «مكتملة» — skipping ahead completes nothing.
  const stateOf = (index: number): StepState =>
    index === activeStep ? 'is-current' : visitedSteps?.has(index) ? 'is-complete' : 'is-upcoming'

  const selectStep = (index: number) => {
    onStepChange?.(index)
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return
    const sheet = sheetRef.current
    const doc = sheet?.ownerDocument ?? document
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        setIsOpen(false)
        return
      }
      if (event.key !== 'Tab' || !sheet) return
      const focusables = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (focusables.length === 0) { event.preventDefault(); return }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = doc.activeElement
      const outside = !active || !sheet.contains(active)
      if (event.shiftKey ? outside || active === first : outside || active === last) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      }
    }

    doc.addEventListener('keydown', handleKeyDown, true)
    return () => {
      doc.removeEventListener('keydown', handleKeyDown, true)
      // Closing, picking a step, or unmounting all hand focus back to the trigger.
      triggerRef.current?.focus()
    }
  }, [isOpen])

  const timeline = (variant: 'desktop' | 'mobile') => (
    <ol className={`lesson-outline-list is-${variant}`}>
      {steps.map((step, index) => {
        const state = stateOf(index)
        return <li key={step.id} className={state}>
          <button
            type="button"
            className={state === 'is-current' ? 'is-current' : ''}
            aria-current={state === 'is-current' ? 'step' : undefined}
            onClick={() => selectStep(index)}
          >
            <span className="lesson-outline-marker"><StepStateIcon state={state} /></span>
            <span className="lesson-outline-copy"><span className="lesson-outline-number">الخطوة {index + 1}</span><strong>{step.title}</strong></span>
            {state === 'is-complete' && <span className="lesson-outline-status">مكتملة</span>}
          </button>
        </li>
      })}
    </ol>
  )

  return <nav className={`lesson-outline ${isOpen ? 'is-open' : ''}`} aria-label="مخطط الدرس">
    <div className="lesson-outline-desktop">
      <div className="lesson-outline-heading"><span className="lesson-outline-heading-icon"><ListChecks size={17} aria-hidden="true" /></span><div><span>مسار الدرس</span><strong>موقعك: الخطوة {activeStep + 1} من {steps.length}</strong></div></div>
      <div className="lesson-outline-progress" aria-hidden="true"><span style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div>
      {timeline('desktop')}
    </div>

    <div className="lesson-outline-mobile">
      <button ref={triggerRef} type="button" className="lesson-outline-trigger" aria-expanded={isOpen} aria-controls={sheetId} aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        <span className="lesson-outline-trigger-icon"><ListChecks size={18} aria-hidden="true" /></span>
        <span className="lesson-outline-trigger-copy"><small>مسار الدرس</small><strong>{currentStep?.title}</strong></span>
        <span className="lesson-outline-trigger-count">{activeStep + 1}/{steps.length}</span>
        <ChevronDown className="lesson-outline-trigger-chevron" size={18} aria-hidden="true" />
      </button>
      {isOpen && <>
        <button type="button" className="lesson-outline-backdrop" tabIndex={-1} aria-hidden="true" onClick={() => setIsOpen(false)} />
        <section ref={sheetRef} id={sheetId} className="lesson-outline-sheet" role="dialog" aria-modal="true" aria-labelledby={`${sheetId}-title`} tabIndex={-1}>
          <div className="lesson-outline-sheet-handle" aria-hidden="true" />
          <header className="lesson-outline-sheet-header"><div><span>رحلتك في الدرس</span><h2 id={`${sheetId}-title`}>خطوات التعلّم</h2></div><button ref={closeRef} type="button" className="lesson-outline-close" aria-label="إغلاق مخطط الدرس" onClick={() => setIsOpen(false)}><X size={19} aria-hidden="true" /></button></header>
          <div className="lesson-outline-sheet-progress" aria-hidden="true"><span style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div>
          {timeline('mobile')}
        </section>
      </>}
    </div>
  </nav>
}
