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
  /**
   * Supplementary review lessons shown to students after the assessed lesson sequence.
   * They are routable lesson pages but stay outside `lessons` because they are not part of the
   * taught sequence and therefore have no standalone lesson test.
   */
  reviewLessons?: LessonMeta[]
}
