import type { ComponentType } from 'react'
import { CoordinatesLesson } from '../lessons/CoordinatesLesson'
import { LineGraphsLesson } from '../lessons/LineGraphsLesson'
import { NaturalNumbersLesson } from '../lessons/NaturalNumbersLesson'

/**
 * Maps a lesson id from `curriculumRegistry` to the component that renders it.
 * Adding Lesson 3 later means adding one entry here — no routing changes elsewhere.
 */
export const lessonComponents: Record<string, ComponentType> = {
  coordinates: CoordinatesLesson,
  'line-graphs': LineGraphsLesson,
  'natural-numbers': NaturalNumbersLesson,
}
