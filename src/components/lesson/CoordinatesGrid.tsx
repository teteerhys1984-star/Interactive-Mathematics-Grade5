import { toSvgPoint, type Point } from './coordinates'

interface CoordinatesGridProps { interactive?: boolean; selected?: Point | null; onSelect?: (point: Point) => void }

const origin = { x: 48, y: 304 }
const cell = 42
const xMax = 6
const yMax = 6
const sourcePoints: Array<[string, Point]> = [
  ['A', { x: 1, y: 0 }], ['B', { x: 3, y: 0 }], ['C', { x: 5, y: 1 }],
  ['D', { x: 0, y: 4 }], ['E', { x: 3, y: 3 }],
]

export function CoordinatesGrid({ interactive = false, selected, onSelect }: CoordinatesGridProps) {
  const width = 400; const height = 360
  const svg = (point: Point) => toSvgPoint(point, origin, cell)
  return <div className="coordinate-grid-wrap"><svg className="coordinate-grid" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="شبكة إحداثيات بمحور أفقي X ومحور شاقولي Y">
    <defs><pattern id="grid-lines" width={cell} height={cell} patternUnits="userSpaceOnUse"><path d={`M ${cell} 0 L 0 0 0 ${cell}`} fill="none" stroke="#b9c7d4" strokeWidth="1" strokeDasharray="4 4" /></pattern><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#29465d" /></marker></defs>
    <rect x={origin.x} y={origin.y - yMax * cell} width={xMax * cell} height={yMax * cell} fill="url(#grid-lines)" rx="3" />
    <line x1={origin.x} y1={origin.y} x2={origin.x + xMax * cell + 16} y2={origin.y} stroke="#29465d" strokeWidth="2" markerEnd="url(#arrowhead)" /><line x1={origin.x} y1={origin.y} x2={origin.x} y2={origin.y - yMax * cell - 16} stroke="#29465d" strokeWidth="2" markerEnd="url(#arrowhead)" />
    {Array.from({ length: xMax + 1 }, (_, x) => <text key={`x-${x}`} x={origin.x + x * cell} y={origin.y + 22} textAnchor="middle" className="grid-number">{x}</text>)}
    {Array.from({ length: yMax + 1 }, (_, y) => <text key={`y-${y}`} x={origin.x - 16} y={origin.y - y * cell + 5} textAnchor="middle" className="grid-number">{y}</text>)}
    <text x={origin.x + xMax * cell + 9} y={origin.y + 35} className="axis-label">المحور الأفقي X</text><text x={origin.x - 7} y={origin.y - yMax * cell - 20} textAnchor="end" className="axis-label">المحور الشاقولي Y</text><text x={origin.x - 8} y={origin.y + 20} className="origin-label">O(0,0)</text>
    {sourcePoints.map(([label, point]) => { const { cx, cy } = svg(point); return <g key={label} className="source-point"><circle cx={cx} cy={cy} r="7" /><text x={cx + 10} y={cy - 10}>{label}</text></g> })}
    {selected && (() => { const { cx, cy } = svg(selected); return <g className="selected-point"><circle cx={cx} cy={cy} r="10" /><text x={cx + 12} y={cy + 5} className="selected-label">({selected.x},{selected.y})</text></g> })()}
    {interactive && Array.from({ length: xMax + 1 }, (_, x) => Array.from({ length: yMax + 1 }, (_, y) => { const point: Point = { x, y }; const { cx, cy } = svg(point); return <circle key={`${x}-${y}`} className="grid-hit" cx={cx} cy={cy} r="15" onClick={() => onSelect?.(point)} /> }))}
  </svg></div>
}
