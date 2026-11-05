import { CoordinatesGrid } from '../components/lesson/CoordinatesGrid'
import { LineChart } from '../components/lesson/LineChart'
import { AngleDiagram, ProtractorSvg } from '../lessons/AnglesLesson'
import type { IndependentFigure } from './types'

/** Static figures shared by the question list and the solutions tab. */
export function IndependentFigureView({ figure }: { figure: IndependentFigure }) {
  switch (figure.kind) {
    case 'line-chart':
      return <div className="independent-figure" data-figure-kind="line-chart">
        <LineChart
          series={figure.series}
          readExampleIndex={figure.readExampleIndex}
          ariaLabel={figure.ariaLabel}
          compact
        />
        <p className="independent-figure-caption">
          المحور الأفقي: {figure.series.xAxisLabel} · المحور الشاقولي: {figure.series.yAxisLabel}
        </p>
      </div>
    case 'coordinate-grid':
      return <div className="independent-figure" data-figure-kind="coordinate-grid">
        <CoordinatesGrid points={figure.points} ariaLabel={figure.ariaLabel} />
      </div>
    case 'angle':
      return <div className="independent-figure" data-figure-kind="angle">
        <AngleDiagram kind={figure.shape} degree={figure.degree} label={figure.label} ariaLabel={figure.ariaLabel} />
      </div>
    case 'protractor':
      return <div className="independent-figure" data-figure-kind="protractor">
        <ProtractorSvg degree={figure.degree} compact singleScale ariaLabel={figure.ariaLabel} />
      </div>
    case 'number-line':
      return <div className="independent-figure" data-figure-kind="number-line">
        <IndependentNumberLine figure={figure} />
      </div>
    default: {
      const exhaustive: never = figure
      return exhaustive
    }
  }
}

function IndependentNumberLine({ figure }: { figure: Extract<IndependentFigure, { kind: 'number-line' }> }) {
  const { min, max, step, midpoint, target, ariaLabel } = figure
  const width = 520
  const height = 112
  const pad = 36
  const baseline = 68
  const x = (value: number) => pad + ((value - min) / (max - min)) * (width - pad * 2)
  const ticks: number[] = []
  for (let value = min; value <= max + step / 1000; value += step) ticks.push(Math.round(value * 1000) / 1000)
  const labelled = new Set([min, max, ...(midpoint === undefined ? [] : [midpoint])])
  return <svg className="independent-number-line" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} direction="ltr" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
    <line x1={pad - 12} y1={baseline} x2={width - pad + 12} y2={baseline} className="independent-number-line-axis" />
    <path d={`M ${width - pad + 12} ${baseline} l -9 -5 v 10 z`} className="independent-number-line-arrow" />
    {ticks.map((value) => {
      const major = labelled.has(value)
      return <g key={value}>
        <line x1={x(value)} y1={baseline - (major ? 9 : 5)} x2={x(value)} y2={baseline + (major ? 9 : 5)} className={major ? 'independent-number-line-tick is-major' : 'independent-number-line-tick'} />
        {major && <text x={x(value)} y={baseline + 28} textAnchor="middle" className="independent-number-line-label" direction="ltr" unicodeBidi="isolate">{value.toLocaleString('en-US')}</text>}
      </g>
    })}
    <circle cx={x(target)} cy={baseline} r="7" className="independent-number-line-target" />
    <text x={x(target)} y={baseline - 18} textAnchor="middle" className="independent-number-line-target-label" direction="ltr" unicodeBidi="isolate">{target.toLocaleString('en-US')}</text>
  </svg>
}
