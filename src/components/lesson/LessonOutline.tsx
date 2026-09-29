import { Check } from 'lucide-react'
import type { LessonStep } from './types'

export function LessonOutline({ steps, activeStep, onStepChange }: { steps: LessonStep[]; activeStep: number; onStepChange?: (index: number) => void }) {
  return <nav className="lesson-outline" aria-label="مخطط الدرس"><ol>{steps.map((step, index) => <li key={step.id}><button className={index === activeStep ? 'is-current' : ''} aria-current={index === activeStep ? 'step' : undefined} onClick={() => onStepChange?.(index)}><span>{index < activeStep ? <Check size={14} /> : index + 1}</span>{step.title}</button></li>)}</ol></nav>
}
