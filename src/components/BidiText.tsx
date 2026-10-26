import type { ReactNode } from 'react'
import { renderIsolatedOrderedPair } from './MathExpression'

const LTR_OR_PAIR_TOKEN_RE = /((?:[A-Za-z]+\s*)?\((?=(?:[^()\u0600-\u06FF]|\([^()\u0600-\u06FF]*\))*[A-Za-z0-9])(?:[^()\u0600-\u06FF]|\([^()\u0600-\u06FF]*\))+\)|\(\s*(?:[\u0621-\u064A]+\s*[,،]\s*[+-]?\d+(?:\.\d+)?|[+-]?\d+(?:\.\d+)?\s*[,،]\s*[\u0621-\u064A]+|الأفقي\s*[,،]\s*الشاقولي)\s*\)|[A-Za-z]+(?:\([^()\u0600-\u06FF]*\))?|\d+(?:[.,]\d+)*(?:\s*[,،]\s*\d+(?:[.,]\d+)*)*°?)/gu

/** Keeps mixed Arabic prose RTL while isolating Latin/math runs and ordered pairs in their natural LTR order. */
export function BidiText({ children }: { children: string }): ReactNode {
  const pieces = children.split(LTR_OR_PAIR_TOKEN_RE)
  return <span dir="rtl">{pieces.map((piece, index) => piece ? (index % 2 === 1 ? <span key={index} dir="ltr" style={{ unicodeBidi: 'isolate', display: 'inline-block' }}>{renderIsolatedOrderedPair(piece) ?? piece}</span> : <span key={index}>{piece}</span>) : null)}</span>
}
