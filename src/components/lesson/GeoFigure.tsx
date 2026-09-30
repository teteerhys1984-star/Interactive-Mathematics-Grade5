import { useState, type ReactNode } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

/**
 * A small declarative geometry renderer used by Lesson 7 (متوازي الأضلاع) to rebuild the
 * textbook figures exactly: vertices with letters, parallel-arrow marks (single/double),
 * side lengths, angle arcs with degree labels, right-angle squares and diagonals.
 *
 * Every piece of text inside the SVG is Latin/numeric, so the whole drawing is rendered in an
 * isolated LTR context (`direction: ltr` + `unicode-bidi: isolate`) and keeps its reading order
 * inside the RTL Arabic page.
 */

export type Pt = { x: number; y: number }
export type SidePair = [string, string]

export interface GeoFigureProps {
  /** Vertex coordinates in SVG user units (y grows downwards). */
  pts: Record<string, Pt>
  /** Closed polygon path, in order around the shape. */
  order: string[]
  width?: number
  height?: number
  /** Parallel marks: `count` chevrons drawn at the middle of the side. */
  marks?: Array<{ side: SidePair; count: number; tone?: 'blue' | 'red' }>
  /** Side length captions such as `4cm`. */
  sides?: Array<{ side: SidePair; label: string; gap?: number }>
  /** Angle arcs. `at` is the vertex, `from`/`to` are the two neighbouring vertices. */
  angles?: Array<{ at: string; from: string; to: string; label?: string; radius?: number; tone?: 'plum' | 'rose' | 'amber' }>
  /** Small square marking a right angle. */
  right?: Array<{ at: string; from: string; to: string }>
  diagonals?: Array<SidePair>
  /** Colour a specific side (used by the "اصنع نموذجاً" card model). */
  colored?: Array<{ side: SidePair; tone: 'red' | 'blue' }>
  /** Draw only these vertex letters (default: all). */
  showLabels?: boolean
  /** Extra SVG children rendered on top. */
  children?: ReactNode
  ariaLabel: string
  className?: string
  /** Render the polygon as an open path (used for تدرّب ③ where D is missing). */
  open?: boolean
  dashed?: Array<SidePair>
}

const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y })
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y })
const scale = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k })
const len = (a: Pt) => Math.hypot(a.x, a.y) || 1
const norm = (a: Pt): Pt => scale(a, 1 / len(a))
const midpoint = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

export function GeoFigure({
  pts, order, width = 300, height = 200, marks = [], sides = [], angles = [], right = [],
  diagonals = [], colored = [], showLabels = true, children, ariaLabel, className = '', open = false, dashed = [],
}: GeoFigureProps) {
  const poly = order.map(name => pts[name])
  const centroid = poly.reduce((acc, p) => ({ x: acc.x + p.x / poly.length, y: acc.y + p.y / poly.length }), { x: 0, y: 0 })
  const path = poly.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + (open ? '' : ' Z')

  return (
    <svg
      className={`l7-geo ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      direction="ltr"
      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
    >
      <path d={path} className="l7-geo-shape" />

      {dashed.map(([a, b]) => (
        <line key={`dash-${a}${b}`} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} className="l7-geo-dashed" />
      ))}

      {colored.map(({ side: [a, b], tone }) => (
        <line key={`col-${a}${b}`} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} className={`l7-geo-colored is-${tone}`} />
      ))}

      {diagonals.map(([a, b]) => (
        <line key={`diag-${a}${b}`} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} className="l7-geo-diagonal" />
      ))}

      {angles.map(({ at, from, to, label, radius = 26, tone = 'plum' }) => {
        const v = pts[at]
        const u1 = norm(sub(pts[from], v))
        const u2 = norm(sub(pts[to], v))
        const p1 = add(v, scale(u1, radius))
        const p2 = add(v, scale(u2, radius))
        const cross = u1.x * u2.y - u1.y * u2.x
        const sweep = cross > 0 ? 1 : 0
        const bis = norm(add(u1, u2))
        const lp = add(v, scale(bis, radius + 17))
        return (
          <g key={`ang-${at}${from}${to}`}>
            <path d={`M ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 ${sweep} ${p2.x} ${p2.y}`} className={`l7-geo-arc is-${tone}`} />
            {label && <text x={lp.x} y={lp.y + 4} textAnchor="middle" className={`l7-geo-angle-label is-${tone}`}>{label}</text>}
          </g>
        )
      })}

      {right.map(({ at, from, to }) => {
        const v = pts[at]
        const s = 15
        const u1 = scale(norm(sub(pts[from], v)), s)
        const u2 = scale(norm(sub(pts[to], v)), s)
        const a = add(v, u1)
        const b = add(add(v, u1), u2)
        const c = add(v, u2)
        return <path key={`rt-${at}`} d={`M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`} className="l7-geo-right" />
      })}

      {marks.map(({ side: [a, b], count, tone = 'blue' }) => {
        const pa = pts[a]
        const pb = pts[b]
        const u = norm(sub(pb, pa))
        const n = { x: -u.y, y: u.x }
        const m = midpoint(pa, pb)
        return (
          <g key={`mark-${a}${b}`} className={`l7-geo-mark is-${tone}`}>
            {Array.from({ length: count }, (_, i) => {
              const c = add(m, scale(u, (i - (count - 1) / 2) * 7))
              const tip = add(c, scale(u, 3.5))
              const w1 = add(add(c, scale(u, -3.5)), scale(n, 4.5))
              const w2 = add(add(c, scale(u, -3.5)), scale(n, -4.5))
              return <path key={i} d={`M ${w1.x} ${w1.y} L ${tip.x} ${tip.y} L ${w2.x} ${w2.y}`} />
            })}
          </g>
        )
      })}

      {sides.map(({ side: [a, b], label, gap = 16 }) => {
        const pa = pts[a]
        const pb = pts[b]
        const m = midpoint(pa, pb)
        const u = norm(sub(pb, pa))
        let n = { x: -u.y, y: u.x }
        // push the caption to the outside of the polygon
        if ((m.x + n.x - centroid.x) ** 2 + (m.y + n.y - centroid.y) ** 2 < (m.x - centroid.x) ** 2 + (m.y - centroid.y) ** 2) n = scale(n, -1)
        const lp = add(m, scale(n, gap))
        return <text key={`side-${a}${b}`} x={lp.x} y={lp.y + 4} textAnchor="middle" className="l7-geo-side-label">{label}</text>
      })}

      {showLabels && order.map(name => {
        const p = pts[name]
        const away = norm(sub(p, centroid))
        const lp = add(p, scale(away, 17))
        return (
          <g key={`v-${name}`}>
            <circle cx={p.x} cy={p.y} r="3.4" className="l7-geo-vertex" />
            <text x={lp.x} y={lp.y + 5} textAnchor="middle" className="l7-geo-point">{name}</text>
          </g>
        )
      })}

      {children}
    </svg>
  )
}

/**
 * Wraps a figure with a caption and an on-demand enlarge control. Only used where the drawing
 * carries small details (arrow marks, degree labels, two shapes side by side) that a fifth
 * grader may not be able to resolve at the default size.
 */
export function FigureFrame({ title, caption, zoomable = false, children }: { title?: string; caption?: string; zoomable?: boolean; children: ReactNode }) {
  const [zoomed, setZoomed] = useState(false)
  return (
    <figure className={`l7-figure ${zoomed ? 'is-zoomed' : ''}`}>
      {(title || zoomable) && (
        <div className="l7-figure-bar">
          {title && <strong>{title}</strong>}
          {zoomable && (
            <button type="button" className="l7-zoom-button" onClick={() => setZoomed(!zoomed)} aria-pressed={zoomed}>
              {zoomed ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              {zoomed ? 'تصغير الرسم' : 'تكبير الرسم'}
            </button>
          )}
        </div>
      )}
      <div className="l7-figure-body">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
