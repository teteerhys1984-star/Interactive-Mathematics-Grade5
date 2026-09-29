import type { ReactNode } from 'react'

/** Shared wrapper marking content that is quoted/adapted directly from the textbook or a "تعلم" box. Reused by every lesson. */
export function SourceCard({ children, label = 'من المصدر' }: { children: ReactNode; label?: string }) {
  return <article className="source-card"><span className="source-label">{label}</span>{children}</article>
}
