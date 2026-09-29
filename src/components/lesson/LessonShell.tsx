import { ArrowRight, ArrowLeft } from 'lucide-react'
import { LessonOutline } from './LessonOutline'
import { InstructorAttribution } from '../InstructorAttribution'
import type { LessonShellProps } from './types'

/** Sequential lesson frame; content remains data-driven and only the current step is shown. */
export function LessonShell({ title, steps, activeStep, onStepChange, theme }: LessonShellProps) {
  const step = steps[activeStep]
  if (!step) return null
  return <section className={`lesson-shell ${theme ?? ''}`} aria-labelledby="lesson-title"><LessonOutline steps={steps} activeStep={activeStep} onStepChange={onStepChange} /><div className="lesson-main"><span className="section-kicker">الخطوة {activeStep + 1} من {steps.length}</span><h1 id="lesson-title">{title}</h1><InstructorAttribution className="lesson-attribution" /><h2>{step.title}</h2><div className="lesson-content">{step.content}</div><div className="lesson-navigation"><button disabled={activeStep === 0} onClick={() => onStepChange?.(activeStep - 1)}><ArrowRight size={17} /> السابق</button><button disabled={activeStep === steps.length - 1} onClick={() => onStepChange?.(activeStep + 1)}>التالي <ArrowLeft size={17} /></button></div></div></section>
}
