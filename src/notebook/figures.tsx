import type { ReactNode } from 'react'

/**
 * Static drawings and number shapes used by the Unit 2 «دفتر الطالب» pages.
 *
 * Unit 1 notebooks reused the lessons' own figure components because those lessons export them.
 * The Unit 2 lessons keep their drawings module-local (TenthsGrid, HundredsGrid, MiniNumberLine…),
 * and those components are interactive or carry lesson-only classes, so the notebook — which must
 * stay a static reference with no gradeable control — gets its own small, purely presentational set:
 * stacked fractions, fraction bars, tenths / hundredths / thousandths models, number lines, and the
 * two geometry helpers that wrap the shared `GeoFigure` renderer (see `RectFigure`, `SquareFigure`).
 *
 * Every drawing carries an Arabic `aria-label`, prints in one colour, and holds no text a reader has
 * to interact with. Fractions are stacked (not `3/4`) exactly as the textbook prints them, and every
 * numeral lives inside an LTR context so an RTL paragraph can never reorder it.
 */

/* ------------------------------------------------------------------ fractions */

/** A fraction printed the way the book prints it: numerator above a bar above the denominator. */
export function Frac({ n, d, label }: { n: ReactNode; d: ReactNode; label?: string }) {
  return (
    <span className="nb-frac" dir="ltr" aria-label={label ?? `${n} على ${d}`}>
      <span className="nb-frac-num">{n}</span>
      <span className="nb-frac-den">{d}</span>
    </span>
  )
}

/** A mixed number: the whole part, then the fraction, e.g. 2 1/3. */
export function MixedNum({ w, n, d, label }: { w: ReactNode; n: ReactNode; d: ReactNode; label?: string }) {
  return (
    <span className="nb-mixed" dir="ltr" aria-label={label ?? `${w} و${n} على ${d}`}>
      <span className="nb-mixed-whole">{w}</span>
      <Frac n={n} d={d} label={label ?? `${n} على ${d}`} />
    </span>
  )
}

/** A comparison written left-to-right so the symbol keeps its printed direction. */
export function Cmp({ left, op, right }: { left: ReactNode; op: '<' | '>' | '='; right: ReactNode }) {
  return (
    <span className="nb-cmp" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <span>{left}</span>
      <span className="nb-cmp-op">{op}</span>
      <span>{right}</span>
    </span>
  )
}

/** A chain of values in one order, e.g. 1/3 < 7/12 < 3/4. */
export function Chain({ parts, ops }: { parts: ReactNode[]; ops: Array<'<' | '>'> }) {
  return (
    <span className="nb-cmp" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      {parts.map((part, index) => (
        <span key={index} className="nb-chain-item">
          <span>{part}</span>
          {index < ops.length ? <span className="nb-cmp-op">{ops[index]}</span> : null}
        </span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ models */

const BLUE = 'var(--nb-accent, #24405f)'
const FILL = '#dce8f5'
const LINE = 'var(--nb-gold, #8a6a1f)'

/** A horizontal bar cut into `parts` equal pieces, the first `shaded` of them coloured. */
export function FracBar({ parts, shaded, label }: { parts: number; shaded: number; label: string }) {
  const width = 300
  const height = 44
  const step = width / parts
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <title>{label}</title>
      <rect x="0" y="0" width={width} height={height} fill="#fff" stroke={BLUE} strokeWidth="2" />
      {Array.from({ length: shaded }, (_, index) => (
        <rect key={`s-${index}`} x={index * step} y="0" width={step} height={height} fill={FILL} stroke={BLUE} strokeWidth="1" />
      ))}
      {Array.from({ length: parts - 1 }, (_, index) => (
        <line key={`l-${index}`} x1={(index + 1) * step} y1="0" x2={(index + 1) * step} y2={height} stroke={BLUE} strokeWidth="1.4" />
      ))}
    </svg>
  )
}

/** A circle cut into `parts` equal sectors, the first `shaded` of them coloured (Counter-clockwise from the top). */
export function FracCircle({ parts, shaded, label }: { parts: number; shaded: number; label: string }) {
  const size = 132
  const cx = size / 2
  const cy = size / 2
  const r = 54
  const point = (angle: number) => {
    const rad = (angle * Math.PI) / 180
    return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={label} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <title>{label}</title>
      {Array.from({ length: parts }, (_, index) => {
        const start = (index * 360) / parts - 90
        const end = ((index + 1) * 360) / parts - 90
        const large = end - start > 180 ? 1 : 0
        return (
          <path
            key={index}
            d={`M ${cx} ${cy} L ${point(start)} A ${r} ${r} 0 ${large} 1 ${point(end)} Z`}
            fill={index < shaded ? FILL : '#fff'}
            stroke={BLUE}
            strokeWidth="1.3"
          />
        )
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={BLUE} strokeWidth="2" />
    </svg>
  )
}

/** Ten equal cells in one row, the first `shaded` coloured — the tenths model of the lesson. */
export function TenthsGrid({ shaded, label }: { shaded: number; label: string }) {
  const cell = 28
  const width = cell * 10
  return (
    <svg viewBox={`0 0 ${width} ${cell}`} width={width} height={cell} role="img" aria-label={label} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <title>{label}</title>
      <rect x="0" y="0" width={width} height={cell} fill="#fff" stroke={BLUE} strokeWidth="2" />
      {Array.from({ length: shaded }, (_, index) => (
        <rect key={index} x={index * cell} y="0" width={cell} height={cell} fill={FILL} />
      ))}
      {Array.from({ length: 9 }, (_, index) => (
        <line key={index} x1={(index + 1) * cell} y1="0" x2={(index + 1) * cell} y2={cell} stroke={BLUE} strokeWidth="1.2" />
      ))}
    </svg>
  )
}

/** A 10×10 square: 100 equal cells, the first `shaded` coloured — the hundredths model. */
export function HundredthsGrid({ shaded, label }: { shaded: number; label: string }) {
  const cell = 20
  const size = cell * 10
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={label} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <title>{label}</title>
      <rect x="0" y="0" width={size} height={size} fill="#fff" stroke={BLUE} strokeWidth="2" />
      {Array.from({ length: shaded }, (_, index) => (
        <rect key={index} x={(index % 10) * cell} y={Math.floor(index / 10) * cell} width={cell} height={cell} fill={FILL} />
      ))}
      {Array.from({ length: 9 }, (_, index) => (
        <g key={index}>
          <line x1={(index + 1) * cell} y1="0" x2={(index + 1) * cell} y2={size} stroke={BLUE} strokeWidth="1" />
          <line x1="0" y1={(index + 1) * cell} x2={size} y2={(index + 1) * cell} stroke={BLUE} strokeWidth="1" />
        </g>
      ))}
    </svg>
  )
}

/**
 * The thousandths model: ten slabs of 10×10 cells, i.e. 1000 equal parts. The first `shaded`
 * cells (read slab by slab) are coloured, so 213 of them are visibly 2 slabs + 13 cells.
 */
export function ThousandthsBlock({ shaded, label }: { shaded: number; label: string }) {
  const cell = 5
  const slab = cell * 10
  const gap = 12
  const width = 5 * slab + 4 * gap
  const height = 2 * slab + gap
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <title>{label}</title>
      {Array.from({ length: 10 }, (_, index) => {
        const col = index % 5
        const row = Math.floor(index / 5)
        const x = col * (slab + gap)
        const y = row * (slab + gap)
        const before = index * 100
        const filled = Math.max(0, Math.min(100, shaded - before))
        return (
          <g key={index}>
            <rect x={x} y={y} width={slab} height={slab} fill="#fff" stroke={BLUE} strokeWidth="1.6" />
            {Array.from({ length: filled }, (_, cellIndex) => (
              <rect
                key={cellIndex}
                x={x + (cellIndex % 10) * cell}
                y={y + Math.floor(cellIndex / 10) * cell}
                width={cell}
                height={cell}
                fill={FILL}
              />
            ))}
            {Array.from({ length: 9 }, (_, lineIndex) => (
              <g key={lineIndex} stroke="rgba(36,64,95,.45)" strokeWidth=".7">
                <line x1={x + (lineIndex + 1) * cell} y1={y} x2={x + (lineIndex + 1) * cell} y2={y + slab} />
                <line x1={x} y1={y + (lineIndex + 1) * cell} x2={x + slab} y2={y + (lineIndex + 1) * cell} />
              </g>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

/**
 * A number line with the labelled ticks the student must copy. `ticks` are given in drawing order
 * (left to right); `marks` are the small unlabelled ticks of a ruler-style line.
 */
export function NumberLineFigure({
  ticks,
  marks = 0,
  label,
  highlight,
}: {
  ticks: Array<{ label: string }>
  marks?: number
  label: string
  highlight?: string
}) {
  const padding = 26
  const width = 340
  const height = 62
  const span = width - padding * 2
  const step = span / Math.max(ticks.length - 1, 1)
  const y = 30
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <title>{label}</title>
      <line x1={padding} y1={y} x2={width - padding} y2={y} stroke={BLUE} strokeWidth="2" />
      <line x1={padding} y1={y - 7} x2={padding} y2={y + 7} stroke={BLUE} strokeWidth="2" />
      <line x1={width - padding} y1={y - 7} x2={width - padding} y2={y + 7} stroke={BLUE} strokeWidth="2" />
      {Array.from({ length: marks }, (_, index) => {
        const x = padding + (span / (marks + 1)) * (index + 1)
        return <line key={index} x1={x} y1={y - 4} x2={x} y2={y + 4} stroke={BLUE} strokeWidth="1.2" />
      })}
      {ticks.map((tick, index) => {
        const x = padding + step * index
        const active = highlight !== undefined && tick.label === highlight
        return (
          <g key={index}>
            <line x1={x} y1={y - 7} x2={x} y2={y + 7} stroke={active ? LINE : BLUE} strokeWidth={active ? 3 : 1.6} />
            <text
              x={x}
              y={y + 24}
              textAnchor="middle"
              style={{ font: "600 12px 'DM Mono', monospace", fill: active ? LINE : BLUE }}
            >
              {tick.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/**
 * A grid the student completes: the printed letters stay, the vertices the exercise asks for appear
 * as open circles, so the drawing in the notebook is the *question*, never the solved answer.
 */
export function DotGrid({
  cols,
  rows,
  points,
  segments = [],
  side = 34,
  label,
}: {
  cols: number
  rows: number
  points: Array<{ x: number; y: number; name?: string }>
  segments?: Array<{ from: [number, number]; to: [number, number]; dashed?: boolean }>
  side?: number
  label: string
}) {
  const width = cols * side + 20
  const height = rows * side + 20
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      <title>{label}</title>
      {Array.from({ length: rows + 1 }, (_, row) =>
        Array.from({ length: cols + 1 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={10 + col * side} cy={10 + row * side} r="2" fill={LINE} />
        )),
      )}
      {segments.map((segment, index) => (
        <line
          key={index}
          x1={10 + segment.from[0] * side}
          y1={10 + segment.from[1] * side}
          x2={10 + segment.to[0] * side}
          y2={10 + segment.to[1] * side}
          stroke={BLUE}
          strokeWidth="2.2"
          strokeDasharray={segment.dashed ? '6 5' : undefined}
        />
      ))}
      {points.map((point, index) => (
        <g key={index}>
          <circle cx={10 + point.x * side} cy={10 + point.y * side} r="5" fill={BLUE} />
          {point.name ? (
            <text
              x={10 + point.x * side + 9}
              y={10 + point.y * side - 7}
              style={{ font: "700 14px 'DM Mono', monospace", fill: BLUE }}
            >
              {point.name}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ rich text */

const ARABIC_RUN = /([\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+)/gu
const FRACTION_TOKEN = /(\d+\s*\/\s*\d+)/gu

/** Stacks every `a/b` inside a mathematical run, leaving decimal numbers flat. */
function mathRun(value: string, key: string): ReactNode {
  const pieces = value.split(FRACTION_TOKEN)
  return (
    <span key={key} className="nb-math-run" dir="ltr">
      {pieces.map((piece, index) => {
        if (index % 2 === 1) {
          const [n, d] = piece.split('/').map(part => part.trim())
          return <Frac key={index} n={n!} d={d!} />
        }
        return <span key={index}>{piece}</span>
      })}
    </span>
  )
}

/**
 * Renders a textbook sentence that mixes Arabic prose with numbers, fractions and symbols.
 *
 * Arabic words stay in the right-to-left flow of the sheet, while every run of non-Arabic text that
 * carries a digit or a Latin letter — `3/4 = 15/20`, `0.325 < 0.42`, `4,829,386`, `km` — is lifted
 * into one isolated left-to-right box and has its fractions stacked. That keeps the printed order of
 * `a/b = c/d` intact inside an Arabic sentence instead of letting the paragraph algorithm reverse it.
 */
export function rich(text: string): ReactNode {
  const pieces = text.split(ARABIC_RUN)
  return pieces.map((piece, index) => {
    if (!piece) return null
    if (index % 2 === 1) return piece
    if (!/[A-Za-z0-9]/u.test(piece)) return piece
    return mathRun(piece, String(index))
  })
}

/** A whole sentence that is Arabic prose only; numeric runs are isolated like `rich`. */
export function prose(text: string): ReactNode {
  return rich(text)
}
