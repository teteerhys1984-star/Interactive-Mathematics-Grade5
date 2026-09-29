interface CoordinatesGridProps { interactive?: boolean; selected?: [number, number] | null; onSelect?: (point: [number, number]) => void }

export function CoordinatesGrid({ interactive = false, selected, onSelect }: CoordinatesGridProps) {
  const width = 400; const height = 360; const left = 48; const bottom = 304; const cell = 42; const xMax = 6; const yMax = 6
  const point = (x: number, y: number) => `${left + x * cell},${bottom - y * cell}`
  return <div className="coordinate-grid-wrap"><svg className="coordinate-grid" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="شبكة إحداثيات بمحور أفقي ومحور شاقولي">
    <defs><pattern id="grid-lines" width={cell} height={cell} patternUnits="userSpaceOnUse"><path d={`M ${cell} 0 L 0 0 0 ${cell}`} fill="none" stroke="#b9c7d4" strokeWidth="1" strokeDasharray="4 4" /></pattern><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#29465d" /></marker></defs>
    <rect x={left} y={bottom - yMax * cell} width={xMax * cell} height={yMax * cell} fill="url(#grid-lines)" rx="3" />
    <line x1={left} y1={bottom} x2={left + xMax * cell + 16} y2={bottom} stroke="#29465d" strokeWidth="2" markerEnd="url(#arrowhead)" /><line x1={left} y1={bottom} x2={left} y2={bottom - yMax * cell - 16} stroke="#29465d" strokeWidth="2" markerEnd="url(#arrowhead)" />
    {Array.from({ length: xMax + 1 }, (_, x) => <g key={`x-${x}`}><text x={left + x * cell} y={bottom + 22} textAnchor="middle" className="grid-number">{x}</text></g>)}
    {Array.from({ length: yMax + 1 }, (_, y) => <text key={`y-${y}`} x={left - 16} y={bottom - y * cell + 5} textAnchor="middle" className="grid-number">{y}</text>)}
    <text x={left + xMax * cell + 9} y={bottom + 35} className="axis-label">المحور الأفقي</text><text x={left - 7} y={bottom - yMax * cell - 20} textAnchor="end" className="axis-label">المحور الشاقولي</text><text x={left - 8} y={bottom + 20} className="origin-label">O(0,0)</text>
    {[['A',1,0],['B',3,0],['C',5,1],['D',0,4],['E',3,3]].map(([label,x,y]) => <g key={label as string} className="source-point"><circle cx={left + (x as number) * cell} cy={bottom - (y as number) * cell} r="7" /><text x={left + (x as number) * cell + 10} y={bottom - (y as number) * cell - 10}>{label as string}</text></g>)}
    {selected && <g className="selected-point"><circle cx={left + selected[0] * cell} cy={bottom - selected[1] * cell} r="10" /><text x={left + selected[0] * cell + 12} y={bottom - selected[1] * cell + 5} className="selected-label">({selected[0]},{selected[1]})</text></g>}
    {interactive && Array.from({ length: xMax + 1 }, (_, x) => Array.from({ length: yMax + 1 }, (_, y) => <circle key={`${x}-${y}`} className="grid-hit" cx={left + x * cell} cy={bottom - y * cell} r="15" onClick={() => onSelect?.([x, y])} />))}
  </svg></div>
}
