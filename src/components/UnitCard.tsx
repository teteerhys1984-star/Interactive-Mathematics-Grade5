import { ArrowLeft, BookOpen, Check, Clock, LockKeyhole } from 'lucide-react'
import type { UnitMeta } from '../types'

export function UnitCard({ unit }: { unit: UnitMeta }) {
  const availableCount = unit.lessons.filter((lesson) => lesson.availability === 'available').length
  const ready = availableCount > 0
  return <article className={`unit-card unit-${unit.accent}`}>
    <header className="unit-head">
      <div className="unit-medallion" aria-hidden="true">{ready ? <BookOpen size={23} /> : <LockKeyhole size={21} />}</div>
      <div className="unit-title-block">
        <span className="eyebrow">{ready ? 'متاح للتعلّم' : 'قريباً'}</span>
        <h3>{unit.title}</h3>
        {unit.description && <p className="unit-description">{unit.description}</p>}
        <div className="unit-meta">
          <span className="unit-meta-chip is-total">{lessonCountChip(unit.lessons.length)}</span>
          <span className="unit-meta-chip">{ready ? `${availableCount} متاحة الآن` : 'قيد الإعداد'}</span>
        </div>
      </div>
    </header>
    <ol className="unit-lesson-grid">
      {unit.lessons.map((lesson, index) => {
        const available = lesson.availability === 'available'
        return <li key={lesson.id} className={`lesson-tile ${available ? 'is-available' : 'is-coming'}`}>
          <span className="lesson-index" aria-hidden="true">{index + 1}</span>
          <div className="lesson-copy">
            <h4>{lesson.title}</h4>
            {lesson.description && <p>{lesson.description}</p>}
          </div>
          <div className="lesson-side">
            {available
              ? <span className="lesson-flag is-open"><Check size={13} aria-hidden="true" />متاح</span>
              : <span className="lesson-flag is-soon"><Clock size={13} aria-hidden="true" />قريباً</span>}
            {available && <a className="lesson-start" href={`#lesson/${lesson.id}`} aria-label={`فتح ${lesson.title}`}>ابدأ <ArrowLeft size={15} aria-hidden="true" /></a>}
          </div>
        </li>
      })}
    </ol>
  </article>
}

function lessonCountChip(count: number) {
  if (count === 1) return 'درس واحد'
  if (count === 2) return 'درسان'
  return `${count} دروس`
}
