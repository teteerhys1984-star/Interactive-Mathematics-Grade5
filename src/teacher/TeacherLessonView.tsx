import { BookOpenCheck } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import type { TeacherEntry } from './types'

export interface TeacherLessonData { lessonId: string; lessonTitle: string; entries: TeacherEntry[] }

export function TeacherLessonView({ lesson }: { lesson: TeacherLessonData }) {
  return <section className="teacher-area"><div className="teacher-heading"><BookOpenCheck size={28} /><div><span className="section-kicker">منطقة المدرس · {lesson.lessonId}</span><h1>دليل درس: {lesson.lessonTitle}</h1><p>حلول المصدر والأنشطة والاختبار النهائي.</p></div></div><div className="teacher-entries">{lesson.entries.map(entry => <article className="teacher-entry" key={entry.id}><span className="source-label">{entry.id}</span><h2>{entry.title}</h2><p><strong>السؤال:</strong> <BidiText>{entry.prompt}</BidiText></p><p><strong>الإجابة:</strong> <BidiText>{entry.answer}</BidiText></p><ol>{entry.reasoning.map(reason => <li key={reason}>{reason}</li>)}</ol>{entry.note && <div className="teacher-note"><strong>ملاحظة للمدرس:</strong> {entry.note}</div>}</article>)}</div></section>
}
