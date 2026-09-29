import type { LineChartSeries } from '../components/lesson/lineChart'

/**
 * All numeric series used by Lesson 2 (التمثيلات البيانية بالخطوط), kept apart from the
 * presentation components so a future Lesson 3 can add its own data file the same way.
 */

/** Textbook page 7: temperatures in Damascus across one week. */
export const damascusWeek: LineChartSeries = {
  labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  values: [15, 14, 16, 18, 18, 17, 16],
  yMin: 10,
  yMax: 19,
  yStep: 1,
  xAxisLabel: 'اليوم',
  yAxisLabel: 'درجة الحرارة',
}

/**
 * Textbook page 8–9: the pediatrician's "ideal height" line graph for a child's first year.
 * The book gives no side table for this graph (it is a read-the-graph activity), so these
 * values are a careful visual reading of the plotted curve, not a printed table. They are
 * used consistently for both the chart and its answer key; see the teacher note in lesson2.ts.
 */
export const idealInfantHeight: LineChartSeries = {
  labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  values: [50, 54, 58, 61, 63, 65, 67, 68, 70, 71, 73, 74, 76],
  yMin: 45,
  yMax: 80,
  yStep: 5,
  xAxisLabel: 'عمر الرضيع بالأشهر',
  yAxisLabel: 'الطول',
}

/**
 * Textbook page 9: growth in the number of Grade 5 students at a school, 2006–2015.
 * As with the height graph, the book supplies only the line graph (no side table), so these
 * are a careful visual reading of the plotted curve used consistently for chart + answer key.
 */
export const studentCountByYear: LineChartSeries = {
  labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'],
  values: [60, 70, 85, 88, 98, 101, 102, 108, 113, 120],
  yMin: 50,
  yMax: 125,
  yStep: 5,
  xAxisLabel: 'العام',
  yAxisLabel: 'عدد الطلاب',
}

/** Platform-authored (not in the textbook): a brand-new context for the final test's transfer questions. */
export const libraryVisitorsWeek: LineChartSeries = {
  labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
  values: [40, 55, 50, 70, 65],
  yMin: 30,
  yMax: 75,
  yStep: 5,
  xAxisLabel: 'اليوم',
  yAxisLabel: 'عدد الزوار',
}

/** Infant-height table cells the book asks the student to fill from the graph (page 9, part أ). */
export const infantHeightTableMonths = [0, 1, 2, 3, 5, 7, 12]
export const infantHeightTableHeaders = ['عند الولادة', 'الشهر الأول', 'الشهر الثاني', 'الشهر الثالث', 'الشهر الخامس', 'الشهر السابع', 'عام']

/** Student-count table cells the book asks the student to fill from the graph (page 9, part أ). */
export const studentCountTableYears = [2015, 2012, 2009, 2007, 2006]
