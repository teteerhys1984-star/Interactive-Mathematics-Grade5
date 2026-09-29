import { MessageCircle } from 'lucide-react'

interface InstructorAttributionProps {
  className?: string
}

/** Shared platform attribution used across the home, lesson, and footer experiences. */
export function InstructorAttribution({ className = '' }: InstructorAttributionProps) {
  return <p className={`instructor-attribution ${className}`.trim()}>
    <MessageCircle className="whatsapp-icon" size={14} aria-hidden="true" />
    <span>المهندس سومر شاهين: </span>
    <a href="https://wa.me/963930215022" target="_blank" rel="noreferrer" aria-label="التواصل مع المهندس سومر شاهين عبر واتساب">0930215022</a>
  </p>
}
