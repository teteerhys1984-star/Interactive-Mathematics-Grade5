import { TeacherPasswordGate } from './TeacherPasswordGate'
import { TeacherLessonView, type TeacherLessonData } from './TeacherLessonView'
import { lessonOneTeacherEntries } from './lesson1'

/** Shared registry: future lessons add one TeacherLessonData object, not a new page architecture. */
const teacherLessons: TeacherLessonData[] = [{ lessonId: 'lesson-1', lessonTitle: 'شبكة الإحداثيات', entries: lessonOneTeacherEntries }]

export function TeacherArea() {
  return <TeacherPasswordGate><TeacherLessonView lesson={teacherLessons[0]} /></TeacherPasswordGate>
}
