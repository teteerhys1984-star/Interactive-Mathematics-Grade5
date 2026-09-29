import type { ReactNode } from 'react'

/** Keeps mixed Arabic prose RTL while isolating Latin/math runs in their natural LTR order. */
export function BidiText({ children }: { children: string }): ReactNode {
  const pieces = children.split(/([A-Za-z]+(?:\([^)]*\))?|\(?\d+(?:\s*[,،]\s*\d+)*\)?)/g)
  return <span dir="rtl">{pieces.map((piece, index) => piece && /^[A-Za-z0-9(]/.test(piece) ? <span key={index} dir="ltr" style={{ unicodeBidi: 'isolate', display: 'inline-block' }}>{piece}</span> : <span key={index}>{piece}</span>)}</span>
}
