import { useMemo, useState } from 'react'
import { ArrowLeftRight, RotateCcw, SkipForward } from 'lucide-react'
import type { CalcItem, Operator } from '../../lessons/additionSubtractionData'
import { computeResult, fmt } from '../../lessons/additionSubtractionData'

/**
 * A place-value column for addition/subtraction — the visual motif of Lesson 5.
 * Everything is rendered LTR and bidi-isolated so digits and the operator keep their
 * mathematical order inside the Arabic (RTL) interface. When `interactive` is on, the
 * student builds the result one column at a time and watches the carry/borrow appear,
 * so the algorithm is understood, not just performed.
 */

interface Cell { text: string }

function columnsOf(value: number, width: number): string[] {
  const digits = Math.trunc(Math.abs(value)).toString()
  const cols: string[] = []
  for (let i = 0; i < width; i++) {
    const pos = digits.length - 1 - i
    cols.push(pos >= 0 ? digits[pos] : '')
  }
  return cols // cols[0] = units … cols[width-1] = leftmost place
}

interface Computed {
  width: number
  operandCols: string[][]
  result: string[]
  /** carry/borrow that FLOWS INTO column i (shown above column i). */
  markInto: number[]
}

function computeColumns(operands: number[], operator: Operator): Computed {
  const result = computeResult(operands, operator)
  const width = Math.max(...operands.map(o => Math.trunc(Math.abs(o)).toString().length), Math.trunc(Math.abs(result)).toString().length)
  const operandCols = operands.map(o => columnsOf(o, width))
  const resultCols = columnsOf(result, width)
  const markInto = new Array(width).fill(0)

  if (operator === '+') {
    let carry = 0
    for (let i = 0; i < width; i++) {
      let sum = carry
      for (const col of operandCols) if (col[i] !== '') sum += Number(col[i])
      carry = Math.floor(sum / 10)
      if (i + 1 < width && carry > 0) markInto[i + 1] = carry
    }
  } else {
    let borrow = 0
    for (let i = 0; i < width; i++) {
      let top = (operandCols[0][i] === '' ? 0 : Number(operandCols[0][i])) - borrow
      const bottom = operandCols[1] && operandCols[1][i] !== '' ? Number(operandCols[1][i]) : 0
      if (top < bottom) { top += 10; if (i + 1 < width) markInto[i + 1] = 1; borrow = 1 } else borrow = 0
    }
  }
  return { width, operandCols, result: resultCols, markInto }
}

export function ColumnOperation({ item, interactive = false }: { item: CalcItem; interactive?: boolean }) {
  const data = useMemo(() => computeColumns(item.operands, item.operator), [item])
  // How many result columns (from the right) are revealed. Non-interactive = all.
  const [revealed, setRevealed] = useState(interactive ? 0 : data.width)
  const done = revealed >= data.width
  const answer = computeResult(item.operands, item.operator)

  const colIndexes = Array.from({ length: data.width }, (_, i) => data.width - 1 - i) // render left→right
  const currentCol = interactive && !done ? revealed : -1

  const markVisible = (colFromRight: number) => (interactive ? colFromRight <= revealed : true) && data.markInto[colFromRight] > 0
  const resultVisible = (colFromRight: number) => (interactive ? colFromRight < revealed : true)

  return (
    <div className="column-op">
      <div className="col-op-grid" dir="ltr" style={{ unicodeBidi: 'isolate' }} role="img" aria-label={`${item.operands.join(item.operator === '+' ? ' زائد ' : ' ناقص ')} يساوي ${answer}`}>
        {/* carry / borrow row */}
        <div className="col-op-row col-marks">
          <span className="col-op-sign" />
          {colIndexes.map(c => (
            <span key={`m-${c}`} className={`col-cell col-mark ${item.operator === '-' ? 'is-borrow' : 'is-carry'} ${c === currentCol ? 'is-current' : ''}`}>
              {markVisible(c) ? data.markInto[c] : ''}
            </span>
          ))}
        </div>
        {/* operand rows */}
        {data.operandCols.map((cols, rowIndex) => (
          <div className="col-op-row" key={`op-${rowIndex}`}>
            <span className="col-op-sign">{rowIndex === data.operandCols.length - 1 ? (item.operator === '+' ? '+' : '−') : ''}</span>
            {colIndexes.map(c => (
              <span key={`d-${rowIndex}-${c}`} className={`col-cell ${c === currentCol ? 'is-current' : ''}`}>{cols[c]}</span>
            ))}
          </div>
        ))}
        <div className="col-op-rule" />
        {/* result row */}
        <div className="col-op-row col-result">
          <span className="col-op-sign" />
          {colIndexes.map(c => (
            <span key={`r-${c}`} className={`col-cell ${c === currentCol ? 'is-current' : ''}`}>{resultVisible(c) ? data.result[c] : ''}</span>
          ))}
        </div>
      </div>

      {interactive && (
        <div className="col-op-controls">
          {!done ? (
            <button className="reveal-button" onClick={() => setRevealed(r => Math.min(r + 1, data.width))}>
              <SkipForward size={16} /> اجمع الخانة التالية
            </button>
          ) : (
            <p className="gentle-feedback good col-op-answer">
              الناتج: <span className="math-expression" dir="ltr">{fmt(answer)}</span>
              {item.operator === '-' && <> — تحقّق: <span className="math-expression" dir="ltr">{fmt(item.operands[1])} + {fmt(answer)} = {fmt(item.operands[0])}</span> ✓</>}
            </p>
          )}
          <button className="col-op-reset" onClick={() => setRevealed(0)} aria-label="إعادة"><RotateCcw size={14} /> إعادة</button>
        </div>
      )}
      {!interactive && item.operator === '-' && (
        <p className="col-op-check"><ArrowLeftRight size={14} /> تحقّق بالجمع: <span className="math-expression" dir="ltr">{fmt(item.operands[1])} + {fmt(answer)} = {fmt(item.operands[0])}</span></p>
      )}
    </div>
  )
}
