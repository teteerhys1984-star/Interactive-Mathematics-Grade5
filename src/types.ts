export type Availability = 'available' | 'coming-soon'

/** Curriculum completion is editorial metadata; it is never inferred from lesson counts or availability. */
export type UnitStatus = 'unknown' | 'in-progress' | 'complete'

export interface LessonMeta {
  id: string
  title: string
  description?: string
  availability: Availability
}

export interface UnitMeta {
  id: string
  title: string
  description?: string
  accent: 'blue' | 'coral' | 'mint'
  status: UnitStatus
  lessons: LessonMeta[]
}
