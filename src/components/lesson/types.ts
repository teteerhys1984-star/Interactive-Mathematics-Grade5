import type { ReactNode } from 'react'

export interface LessonStep { id: string; title: string; content: ReactNode }
export interface LessonShellProps { title: string; steps: LessonStep[]; activeStep: number; onStepChange?: (index: number) => void; theme?: string }
