import type { ReactNode } from 'react'
import { BidiText } from '../components/BidiText'

/**
 * Composes notebook content out of plain textbook strings and already-formatted nodes.
 *
 * A bare string inside JSX (`<p>نص {answer}</p>`) never reaches `BidiText`, so a geometric run like
 * «[AB)» or «∠ABC = 45°» would be laid out by the RTL paragraph algorithm and come out reordered.
 * `mixed` removes that trap: every string it receives is isolated through `BidiText`, and anything
 * else (a `MathExpression`, an SVG figure, an element) passes through untouched.
 */
export function mixed(...parts: ReadonlyArray<string | ReactNode>): ReactNode {
  return parts.map((part, index) => (typeof part === 'string' ? <BidiText key={index}>{part}</BidiText> : part))
}
