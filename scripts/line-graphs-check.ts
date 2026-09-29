import { assertLineChartConvention, xPixel, yPixel, type ChartLayout } from '../src/components/lesson/lineChart'
import { damascusWeek, idealInfantHeight, studentCountByYear, infantHeightTableMonths, studentCountTableYears } from '../src/lessons/lineGraphsData'
import { lessonTwoRequiredSolutionIds, lessonTwoTeacherEntries, finalAssessment2 } from '../src/teacher/lesson2'

assertLineChartConvention()

// Sanity-check every Lesson 2 series against the shared axis convention: index -> right, value -> up.
for (const series of [damascusWeek, idealInfantHeight, studentCountByYear]) {
  const layout: ChartLayout = { originX: 40, originY: 300, plotWidth: 480, plotHeight: 250, count: series.labels.length, yMin: series.yMin, yMax: series.yMax }
  if (series.labels.length !== series.values.length) throw new Error('Series labels and values must be the same length')
  for (const value of series.values) if (value < series.yMin || value > series.yMax) throw new Error(`Series value ${value} falls outside its own declared [yMin, yMax] range`)
  const firstX = xPixel(0, layout)
  const lastX = xPixel(series.labels.length - 1, layout)
  if (!(lastX > firstX)) throw new Error('Line chart categories must run left to right in time order')
  const highValueY = yPixel(series.yMax, layout)
  const lowValueY = yPixel(series.yMin, layout)
  if (!(highValueY < lowValueY)) throw new Error('Higher data values must sit above lower data values (never swapped with time)')
}

// The two "fill the table from the graph" activities must only reference months/years that exist in the source series.
for (const month of infantHeightTableMonths) if (!idealInfantHeight.labels.includes(String(month))) throw new Error(`Height table references month ${month} that is not on the chart`)
for (const year of studentCountTableYears) if (!studentCountByYear.labels.includes(String(year))) throw new Error(`Student table references year ${year} that is not on the chart`)

// Every required Lesson 2 solution id must exist, and the final test must be fully covered.
for (const id of lessonTwoRequiredSolutionIds) if (!lessonTwoTeacherEntries.some(entry => entry.id === id)) throw new Error(`Missing Lesson 2 teacher solution for ${id}`)
for (const question of finalAssessment2) if (!lessonTwoTeacherEntries.some(entry => entry.id === question.id)) throw new Error(`Missing Lesson 2 final-test solution for ${question.id}`)
if (finalAssessment2.length < 6) throw new Error('Lesson 2 final test should be a substantial, brand-new assessment (not a handful of copied questions)')

console.log('Line-chart convention checks passed: index increases rightward; value increases upward (Lesson 2).')
