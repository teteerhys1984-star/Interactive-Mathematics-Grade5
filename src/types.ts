export type Availability = 'available' | 'coming-soon'

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
  lessons: LessonMeta[]
}
