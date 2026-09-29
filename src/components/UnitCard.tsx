import { ArrowLeft, BookOpen, LockKeyhole } from 'lucide-react'
import type { UnitMeta } from '../types'

export function UnitCard({ unit }: { unit: UnitMeta }) {
  const ready = unit.lessons.some((lesson) => lesson.availability === 'available')
  return <article className={`unit-card unit-${unit.accent}`}>
    <div className="unit-icon" aria-hidden="true">{ready ? <BookOpen size={23} /> : <LockKeyhole size={21} />}</div>
    <div className="unit-copy">
      <span className="eyebrow">{ready ? 'متاح للتعلّم' : 'قريباً'}</span>
      <h3>{unit.title}</h3>
      {unit.description && <p>{unit.description}</p>}
      <ol className="unit-lessons">
        {unit.lessons.map((lesson) => <li key={lesson.id} className="unit-lesson-row">
          <span>{lesson.title}</span>
          {lesson.availability === 'available'
            ? <a href={`#lesson/${lesson.id}`} aria-label={`فتح ${lesson.title}`}>ابدأ <ArrowLeft size={15} /></a>
            : <span className="lesson-status">قريباً</span>}
        </li>)}
      </ol>
    </div>
  </article>
}
