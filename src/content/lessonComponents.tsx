import type { ComponentType } from 'react'
import { CoordinatesLesson } from '../lessons/CoordinatesLesson'
import { LineGraphsLesson } from '../lessons/LineGraphsLesson'
import { NaturalNumbersLesson } from '../lessons/NaturalNumbersLesson'
import { RoundingLesson } from '../lessons/RoundingLesson'
import { AdditionSubtractionLesson } from '../lessons/AdditionSubtractionLesson'
import { AnglesLesson } from '../lessons/AnglesLesson'
import { ParallelogramLesson } from '../lessons/ParallelogramLesson'
import { RhombusLesson } from '../lessons/RhombusLesson'
import { ComparingNaturalNumbersLesson } from '../lessons/ComparingNaturalNumbersLesson'
import { MultiplyNaturalNumbersLesson } from '../lessons/MultiplyNaturalNumbersLesson'
import { LeastCommonMultipleLesson } from '../lessons/LeastCommonMultipleLesson'
import { FractionsOneLesson } from '../lessons/FractionsOneLesson'
import { FractionsTwoLesson } from '../lessons/FractionsTwoLesson'
import { TenthsOneLesson } from '../lessons/TenthsOneLesson'

/**
 * Maps a lesson id from `curriculumRegistry` to the component that renders it.
 * Adding a new available lesson means adding one entry here — no routing changes elsewhere.
 */
export const lessonComponents: Record<string, ComponentType> = {
  coordinates: CoordinatesLesson,
  'line-graphs': LineGraphsLesson,
  'natural-numbers': NaturalNumbersLesson,
  'rounding-natural-numbers': RoundingLesson,
  'adding-subtracting-natural-numbers': AdditionSubtractionLesson,
  'angle-measurement': AnglesLesson,
  parallelogram: ParallelogramLesson,
  rhombus: RhombusLesson,
  'compare-order-natural-numbers': ComparingNaturalNumbersLesson,
  'multiply-natural-numbers': MultiplyNaturalNumbersLesson,
  'least-common-multiple': LeastCommonMultipleLesson,
  'fractions-one': FractionsOneLesson,
  'fractions-two': FractionsTwoLesson,
  'tenths-one': TenthsOneLesson,
}
