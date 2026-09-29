import { ArrowLeft, BookOpen, LockKeyhole } from 'lucide-react'
import type { UnitMeta } from '../types'

export function UnitCard({ unit }: { unit: UnitMeta }) {
  const ready = unit.lessons.some((lesson) => lesson.availability === 'available')
  return <article className={`unit-card unit-${unit.accent}`}>
    <div className="unit-icon" aria-hidden="true">{ready ? <BookOpen size={23} /> : <LockKeyhole size={21} />}</div>
    <div className="unit-copy"><span className="eyebrow">{ready ? 'متاح للتعلّم' : 'قريباً'}</span><h3>{unit.title}</h3>{unit.description && <p>{unit.description}</p>}</div>
    <button className="icon-button" aria-label={`فتح ${unit.title}`} disabled={!ready}><ArrowLeft size={19} /></button>
  </article>
}
