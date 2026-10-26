import { BookOpenCheck } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import type { TeacherEntry } from './types'

export interface TeacherLessonData { lessonId: string; lessonTitle: string; entries: TeacherEntry[]; mathMode?: 'fractions' }

const FRACTION_MATH_RUN = /(\d+(?:\s*\/\s*\d+)?(?:\s*(?:[=<>×÷+−-])\s*\d+(?:\s*\/\s*\d+)?)*)/gu
const FRACTION_MATH_ONLY = /^\d+(?:\s*\/\s*\d+)?(?:\s*(?:[=<>×÷+−-])\s*\d+(?:\s*\/\s*\d+)?)*$/u
function TeacherFractionText({ text }: { text: string }) {
  return <span dir="rtl" className="teacher-fraction-text">{text.split(FRACTION_MATH_RUN).map((part, index) => FRACTION_MATH_ONLY.test(part)
    ? <MathExpression key={index}>{part}</MathExpression>
    : <BidiText key={index}>{part}</BidiText>)}</span>
}

export function TeacherLessonView({ lesson }: { lesson: TeacherLessonData }) {
  const Text = lesson.mathMode === 'fractions' ? TeacherFractionText : null
  return <section className="teacher-area"><div className="teacher-heading"><BookOpenCheck size={28} /><div><span className="section-kicker">منطقة المدرس · {lesson.lessonId}</span><h1>دليل درس: {lesson.lessonTitle}</h1><p>حلول المصدر والأنشطة والاختبار النهائي.</p></div></div><div className="teacher-entries">{lesson.entries.map(entry => <article className="teacher-entry" key={entry.id} data-source-id={entry.id}><div className="teacher-entry-meta"><span className="source-label">{entry.id}</span>{entry.source.type === 'textbook' ? <span className="book-source"><span aria-hidden="true">📖</span> المصدر: الكتاب — ص {entry.source.page}</span> : <span className="platform-source">نشاط تفاعلي إضافي</span>}</div><h2>{entry.title}</h2><p><strong>السؤال:</strong> {Text ? <Text text={entry.prompt} /> : <BidiText>{entry.prompt}</BidiText>}</p><p><strong>الإجابة:</strong> {Text ? <Text text={entry.answer} /> : <BidiText>{entry.answer}</BidiText>}</p><ol>{entry.reasoning.map((reason, index) => <li key={`${entry.id}-${index}`}>{Text ? <Text text={reason} /> : <BidiText>{reason}</BidiText>}</li>)}</ol>{entry.note && <div className="teacher-note"><strong>ملاحظة للمدرس:</strong> <BidiText>{entry.note}</BidiText></div>}</article>)}</div></section>
}
