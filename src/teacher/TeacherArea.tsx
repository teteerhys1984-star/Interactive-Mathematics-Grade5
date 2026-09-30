import { useState } from 'react'
import { TeacherPasswordGate } from './TeacherPasswordGate'
import { TeacherLessonView, type TeacherLessonData } from './TeacherLessonView'
import { lessonOneTeacherEntries } from './lesson1'
import { lessonTwoTeacherEntries } from './lesson2'
import { lessonThreeTeacherEntries } from './lesson3'
import { lessonFourTeacherEntries } from './lesson4'
import { lessonFiveTeacherEntries } from './lesson5'
import { lessonSixTeacherEntries } from './lesson6'
import { lessonSevenTeacherEntries } from './lesson7'

/** Shared registry: future lessons add one TeacherLessonData object, not a new page architecture. */
const teacherLessons: TeacherLessonData[] = [
  { lessonId: 'coordinates', lessonTitle: 'شبكة الإحداثيات', entries: lessonOneTeacherEntries },
  { lessonId: 'line-graphs', lessonTitle: 'التمثيلات البيانية بالخطوط', entries: lessonTwoTeacherEntries },
  { lessonId: 'natural-numbers', lessonTitle: 'الأعداد الطبيعية', entries: lessonThreeTeacherEntries },
  { lessonId: 'rounding-natural-numbers', lessonTitle: 'تقريب الأعداد الطبيعية', entries: lessonFourTeacherEntries },
  { lessonId: 'adding-subtracting-natural-numbers', lessonTitle: 'جمع الأعداد الطبيعيّة وطرحها', entries: lessonFiveTeacherEntries },
  { lessonId: 'angle-measurement', lessonTitle: 'قياس الزوايا', entries: lessonSixTeacherEntries },
  { lessonId: 'parallelogram', lessonTitle: 'متوازي الأضلاع', entries: lessonSevenTeacherEntries },
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
