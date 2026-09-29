import { useId } from 'react'
import { xPixel, yPixel, type ChartLayout, type LineChartSeries } from './lineChart'

interface LineChartProps {
  series: LineChartSeries
  /** Index to visually highlight with the book-style "read the value" guide arrows. */
  readExampleIndex?: number
  interactive?: boolean
  selectedIndex?: number | null
  onSelect?: (index: number) => void
  ariaLabel: string
}

const isNumericLabel = (label: string) => /^-?\d+(\.\d+)?$/.test(label)

/** Renders a single numeric label isolated from RTL reordering, matching the MathExpression convention. */
function AxisNumber({ x, y, anchor, children }: { x: number; y: number; anchor: 'start' | 'middle' | 'end'; children: string }) {
  return <text x={x} y={y} textAnchor={anchor} className="grid-number" direction="ltr" unicodeBidi="isolate">{children}</text>
}

/** Reusable line-graph (تمثيل بياني بالخطوط) used across every "time vs. data" activity in this lesson. */
export function LineChart({ series, readExampleIndex, interactive = false, selectedIndex, onSelect, ariaLabel }: LineChartProps) {
  const uid = useId().replace(/[:]/g, '')
  const { labels, values, yMin, yMax, yStep, xAxisLabel, yAxisLabel } = series
  const width = 560
  const height = 320
  const margin = { top: 20, right: 26, bottom: 46, left: 46 }
  const layout: ChartLayout = { originX: margin.left, originY: height - margin.bottom, plotWidth: width - margin.left - margin.right, plotHeight: height - margin.top - margin.bottom, count: labels.length, yMin, yMax }
  const ySteps: number[] = []
  for (let v = yMin; v <= yMax + 1e-9; v += yStep) ySteps.push(Math.round(v * 100) / 100)
  const points = values.map((value, index) => ({ x: xPixel(index, layout), y: yPixel(value, layout), value, label: labels[index], index }))
  const path = points.map(p => `${p.x},${p.y}`).join(' ')
  const readPoint = readExampleIndex !== undefined ? points[readExampleIndex] : undefined
  return <div className="line-chart-wrap">
    <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} direction="ltr" style={{ unicodeBidi: 'isolate' }}>
      <defs>
        <marker id={`lc-arrow-${uid}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#29465d" /></marker>
        <marker id={`lc-guide-${uid}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="var(--coral)" /></marker>
      </defs>
      {ySteps.map(step => <line key={`grid-${step}`} x1={layout.originX} x2={layout.originX + layout.plotWidth} y1={yPixel(step, layout)} y2={yPixel(step, layout)} stroke="#e3ebf1" strokeWidth="1" />)}
      <line x1={layout.originX} y1={layout.originY} x2={layout.originX + layout.plotWidth + 14} y2={layout.originY} stroke="#29465d" strokeWidth="2" markerEnd={`url(#lc-arrow-${uid})`} />
      <line x1={layout.originX} y1={layout.originY} x2={layout.originX} y2={margin.top - 10} stroke="#29465d" strokeWidth="2" markerEnd={`url(#lc-arrow-${uid})`} />
      {ySteps.map(step => <AxisNumber key={`y-${step}`} x={layout.originX - 10} y={yPixel(step, layout) + 4} anchor="end">{String(step)}</AxisNumber>)}
      {labels.map((label, index) => isNumericLabel(label)
        ? <AxisNumber key={`x-${label}-${index}`} x={xPixel(index, layout)} y={layout.originY + 20} anchor="middle">{label}</AxisNumber>
        : <text key={`x-${label}-${index}`} x={xPixel(index, layout)} y={layout.originY + 20} textAnchor="middle" className="grid-number">{label}</text>)}
      <text x={layout.originX + layout.plotWidth} y={layout.originY + 40} textAnchor="end" className="axis-label">{xAxisLabel}</text>
      <text x={layout.originX - 8} y={margin.top - 12} textAnchor="start" className="axis-label">{yAxisLabel}</text>
      {readPoint && <g className="line-chart-guide">
        <line x1={readPoint.x} y1={layout.originY} x2={readPoint.x} y2={readPoint.y + 10} stroke="var(--coral)" strokeWidth="2" strokeDasharray="5 4" markerEnd={`url(#lc-guide-${uid})`} />
        <line x1={readPoint.x - 10} y1={readPoint.y} x2={layout.originX} y2={readPoint.y} stroke="var(--coral)" strokeWidth="2" strokeDasharray="5 4" markerEnd={`url(#lc-guide-${uid})`} />
      </g>}
      <polyline points={path} fill="none" stroke="var(--graph)" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map(p => <g key={p.index}>
        <circle cx={p.x} cy={p.y} r={selectedIndex === p.index ? 8 : 5.5} fill={selectedIndex === p.index ? 'var(--blue)' : (readExampleIndex === p.index ? 'var(--coral)' : 'var(--graph)')} stroke="#fff" strokeWidth="2" />
        {interactive && <circle cx={p.x} cy={p.y} r="15" className="grid-hit" onClick={() => onSelect?.(p.index)} />}
      </g>)}
    </svg>
  </div>
}
