/** A single line-graph dataset: categorical/ordered x-axis, numeric y-axis. Reusable across lessons. */
export interface LineChartSeries {
  /** x-axis category labels, in left-to-right reading order (index 0 is leftmost/earliest). */
  labels: string[]
  /** y-values aligned by index with `labels`. */
  values: number[]
  yMin: number
  yMax: number
  yStep: number
  xAxisLabel: string
  yAxisLabel: string
}

export interface ChartLayout {
  originX: number
  originY: number
  plotWidth: number
  plotHeight: number
  count: number
  yMin: number
  yMax: number
}

/** Maps a category index to a horizontal pixel position. Index 0 is always the leftmost pixel. */
export function xPixel(index: number, layout: ChartLayout): number {
  if (layout.count <= 1) return layout.originX
  const step = layout.plotWidth / (layout.count - 1)
  return layout.originX + index * step
}

/** Maps a y-value to a vertical pixel position. Larger values always map to smaller (higher) pixel y. */
export function yPixel(value: number, layout: ChartLayout): number {
  const ratio = (value - layout.yMin) / (layout.yMax - layout.yMin)
  return layout.originY - ratio * layout.plotHeight
}

/** Dependency-free guard for the project's line-chart convention: never swap which axis carries time vs. data. */
export function assertLineChartConvention() {
  const layout: ChartLayout = { originX: 40, originY: 300, plotWidth: 300, plotHeight: 250, count: 5, yMin: 0, yMax: 100 }
  if (!(xPixel(4, layout) > xPixel(0, layout))) throw new Error('Line chart index must increase left to right')
  if (!(yPixel(100, layout) < yPixel(0, layout))) throw new Error('Line chart value must increase upward (never swapped with the x-axis)')
  if (xPixel(0, layout) !== layout.originX) throw new Error('First category must sit at the chart origin')
}
