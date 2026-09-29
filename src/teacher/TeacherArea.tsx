import { useState } from 'react'
import { TeacherPasswordGate } from './TeacherPasswordGate'
import { TeacherLessonView, type TeacherLessonData } from './TeacherLessonView'
import { lessonOneTeacherEntries } from './lesson1'
import { lessonTwoTeacherEntries } from './lesson2'
import { lessonThreeTeacherEntries } from './lesson3'
import { lessonFourTeacherEntries } from './lesson4'

/** Shared registry: future lessons add one TeacherLessonData object, not a new page architecture. */
const teacherLessons: TeacherLessonData[] = [
  { lessonId: 'coordinates', lessonTitle: 'شبكة الإحداثيات', entries: lessonOneTeacherEntries },
  { lessonId: 'line-graphs', lessonTitle: 'التمثيلات البيانية بالخطوط', entries: lessonTwoTeacherEntries },
  { lessonId: 'natural-numbers', lessonTitle: 'الأعداد الطبيعية', entries: lessonThreeTeacherEntries },
  { lessonId: 'rounding-natural-numbers', lessonTitle: 'تقريب الأعداد الطبيعية', entries: lessonFourTeacherEntries },
]

export function TeacherArea({ initialLessonId }: { initialLessonId?: string | null }) {
  const initialIndex = Math.max(0, teacherLessons.findIndex(lesson => lesson.lessonId === initialLessonId))
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  return <TeacherPasswordGate>
    <nav className="teacher-lesson-tabs" aria-label="اختيار دليل الدرس">
      {teacherLessons.map((lesson, index) => <button key={lesson.lessonId} className={index === activeIndex ? 'is-active' : ''} aria-current={index === activeIndex ? 'true' : undefined} onClick={() => setActiveIndex(index)}>{lesson.lessonTitle}</button>)}
    </nav>
    <TeacherLessonView lesson={teacherLessons[activeIndex]} />
  </TeacherPasswordGate>
}
