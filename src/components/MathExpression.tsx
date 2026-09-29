import type { CSSProperties, ReactNode } from 'react'

interface MathExpressionProps { children: ReactNode; className?: string; label?: string }

/** A single boundary for mathematical notation inside the Arabic interface. */
export function MathExpression({ children, className = '', label }: MathExpressionProps) {
  const style: CSSProperties = { direction: 'ltr', unicodeBidi: 'isolate', fontVariantNumeric: 'tabular-nums' }
  return <span className={`math-expression ${className}`} dir="ltr" style={style} aria-label={label}>{children}</span>
}
