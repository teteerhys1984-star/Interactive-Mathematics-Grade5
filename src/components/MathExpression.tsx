import type { CSSProperties, ReactNode } from 'react'

interface MathExpressionProps { children: ReactNode; className?: string; label?: string }

const ARABIC_CHAR_RE = /[\u0600-\u06FF]/u
const MIXED_ORDERED_PAIR_RE = /^([A-Za-z]?\s*\()\s*([^(),،]+?)\s*([,،])\s*([^(),،]+?)\s*(\))$/u

/** Isolates each component of an ordered pair containing Arabic text so LTR (first, second) order never reverses under UAX #9. */
export function renderIsolatedOrderedPair(value: string): ReactNode | null {
  if (!ARABIC_CHAR_RE.test(value)) return null
  const match = value.trim().match(MIXED_ORDERED_PAIR_RE)
  if (!match) return null
  const [, open, first, sep, second, close] = match
  return <>{open}<bdi style={{ unicodeBidi: 'isolate' }}>{first}</bdi>{`${sep} `}<bdi style={{ unicodeBidi: 'isolate' }}>{second}</bdi>{close}</>
}

/** A single boundary for mathematical notation inside the Arabic interface. */
export function MathExpression({ children, className = '', label }: MathExpressionProps) {
  const style: CSSProperties = { direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block', fontVariantNumeric: 'tabular-nums' }
  const content = typeof children === 'string' ? (renderIsolatedOrderedPair(children) ?? children) : children
  return <span className={`math-expression ${className}`} dir="ltr" style={style} aria-label={label}>{content}</span>
}
