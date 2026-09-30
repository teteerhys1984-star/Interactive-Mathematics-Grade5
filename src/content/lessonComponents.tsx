import type { ComponentType } from 'react'
import { CoordinatesLesson } from '../lessons/CoordinatesLesson'
import { LineGraphsLesson } from '../lessons/LineGraphsLesson'
import { NaturalNumbersLesson } from '../lessons/NaturalNumbersLesson'
import { RoundingLesson } from '../lessons/RoundingLesson'
import { AdditionSubtractionLesson } from '../lessons/AdditionSubtractionLesson'
import { AnglesLesson } from '../lessons/AnglesLesson'

/**
 * Maps a lesson id from `curriculumRegistry` to the component that renders it.
 * Adding Lesson 3 later means adding one entry here — no routing changes elsewhere.
 */
export const lessonComponents: Record<string, ComponentType> = {
  coordinates: CoordinatesLesson,
  'line-graphs': LineGraphsLesson,
  'natural-numbers': NaturalNumbersLesson,
  'rounding-natural-numbers': RoundingLesson,
  'adding-subtracting-natural-numbers': AdditionSubtractionLesson,
  'angle-measurement': AnglesLesson,
}
