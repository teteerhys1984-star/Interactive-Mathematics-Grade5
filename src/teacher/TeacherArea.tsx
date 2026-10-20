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
import { lessonEightTeacherEntries } from './lesson8'
import { lessonNineTeacherEntries } from './lesson9'
import { lessonTenTeacherEntries } from './lesson10'
import { lessonElevenTeacherEntries } from './lesson11'
import { lessonTwelveTeacherEntries } from './lesson12'
import { unit2Lesson5PlatformEntries, unit2Lesson5TeacherEntries } from './unit2Lesson5'
import { unit2Lesson6PlatformEntries, unit2Lesson6TeacherEntries } from './unit2Lesson6'
import { unit2Lesson7AllEntries } from './unit2Lesson7'
import { lesson8TeacherEntries, lesson8PlatformTeacherEntries } from '../lessons/decimalPartsThreeData'
import { rectangleAllTeacherEntries } from '../lessons/rectangleData'
import { squareAllTeacherEntries } from '../lessons/squareData'
import { TeacherUnitExercisesView } from './TeacherUnitExercisesView'

/** Shared registry: future lessons add one TeacherLessonData object, not a new page architecture. */
const teacherLessons: TeacherLessonData[] = [
  { lessonId: 'coordinates', lessonTitle: 'شبكة الإحداثيات', entries: lessonOneTeacherEntries },
  { lessonId: 'line-graphs', lessonTitle: 'التمثيلات البيانية بالخطوط', entries: lessonTwoTeacherEntries },
  { lessonId: 'natural-numbers', lessonTitle: 'الأعداد الطبيعية', entries: lessonThreeTeacherEntries },
  { lessonId: 'rounding-natural-numbers', lessonTitle: 'تقريب الأعداد الطبيعية', entries: lessonFourTeacherEntries },
  { lessonId: 'adding-subtracting-natural-numbers', lessonTitle: 'جمع الأعداد الطبيعيّة وطرحها', entries: lessonFiveTeacherEntries },
  { lessonId: 'angle-measurement', lessonTitle: 'قياس الزوايا', entries: lessonSixTeacherEntries },
  { lessonId: 'parallelogram', lessonTitle: 'متوازي الأضلاع', entries: lessonSevenTeacherEntries },
  { lessonId: 'rhombus', lessonTitle: 'المعيّن', entries: lessonEightTeacherEntries },
  { lessonId: 'compare-order-natural-numbers', lessonTitle: 'مقارنة الأعداد الطبيعية وترتيبها', entries: lessonNineTeacherEntries },
  { lessonId: 'multiply-natural-numbers', lessonTitle: 'ضرب الأعداد الطبيعية', entries: lessonTenTeacherEntries },
  { lessonId: 'least-common-multiple', lessonTitle: 'المضاعف المشترك الأصغر', entries: lessonElevenTeacherEntries },
  { lessonId: 'fractions-one', lessonTitle: 'الكسور (1)', entries: lessonTwelveTeacherEntries, mathMode: 'fractions' },
  { lessonId: 'fractions-two', lessonTitle: 'الكسور (2)', entries: [...unit2Lesson5TeacherEntries, ...unit2Lesson5PlatformEntries], mathMode: 'fractions' },
  { lessonId: 'tenths-one', lessonTitle: 'الأجزاء العشرية (1)', entries: [...unit2Lesson6TeacherEntries, ...unit2Lesson6PlatformEntries], mathMode: 'fractions' },
  { lessonId: 'decimal-parts-two', lessonTitle: 'الأجزاء العشرية (2)', entries: unit2Lesson7AllEntries, mathMode: 'fractions' },
  { lessonId: 'decimal-parts-three', lessonTitle: 'الأجزاء العشرية (3)', entries: [...lesson8TeacherEntries, ...lesson8PlatformTeacherEntries], mathMode: 'fractions' },
  { lessonId: 'rectangle', lessonTitle: 'المستطيل', entries: rectangleAllTeacherEntries },
  { lessonId: 'square', lessonTitle: 'المربّع', entries: squareAllTeacherEntries },
]

export function TeacherArea({ initialLessonId }: { initialLessonId?: string | null }) {
  const initialIndex = Math.max(0, teacherLessons.findIndex(lesson => lesson.lessonId === initialLessonId))
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [activeUnitExercises, setActiveUnitExercises] = useState(initialLessonId === 'unit-exercises')
  return <TeacherPasswordGate>
    <nav className="teacher-lesson-tabs" aria-label="اختيار دليل المدرس">
      {teacherLessons.map((lesson, index) => <button key={lesson.lessonId} className={!activeUnitExercises && index === activeIndex ? 'is-active' : ''} aria-current={!activeUnitExercises && index === activeIndex ? 'page' : undefined} onClick={() => { setActiveIndex(index); setActiveUnitExercises(false) }}>{lesson.lessonTitle}</button>)}
      <button type="button" className={activeUnitExercises ? 'is-active' : ''} aria-current={activeUnitExercises ? 'page' : undefined} onClick={() => setActiveUnitExercises(true)}>تمارين الوحدة الأولى</button>
    </nav>
    {activeUnitExercises ? <TeacherUnitExercisesView /> : <TeacherLessonView lesson={teacherLessons[activeIndex]} />}
  </TeacherPasswordGate>
}
