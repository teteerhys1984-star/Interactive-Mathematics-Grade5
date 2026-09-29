import { useState, type FormEvent } from 'react'
import { BookOpenCheck, LockKeyhole, ShieldCheck } from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { lessonOneTeacherEntries } from './lesson1'

/** Reusable static-hosting boundary. Real authorization can be injected later without exposing teacher data in student navigation. */
export function TeacherArea() {
  const [unlocked, setUnlocked] = useState(false)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const expectedCode = import.meta.env.VITE_TEACHER_ACCESS_CODE || 'teacher'
  const unlock = (event: FormEvent) => { event.preventDefault(); if (code === expectedCode) { setUnlocked(true); sessionStorage.setItem('teacher-area-unlocked', 'true') } else setMessage('رمز الوصول غير صحيح.') }
  if (!unlocked) return <section className="teacher-gate"><div className="teacher-gate-icon"><LockKeyhole size={26} /></div><span className="section-kicker">منطقة خاصة بالمدرس</span><h1>مراجعة درس شبكة الإحداثيات</h1><p>هذه المنطقة منفصلة عن تجربة الطالب وتحتوي على الحلول التفصيلية وملاحظات التدريس.</p><form onSubmit={unlock}><label htmlFor="teacher-code">رمز وصول المعلم</label><input id="teacher-code" type="password" value={code} onChange={event => { setCode(event.target.value); setMessage('') }} autoComplete="off" /><button className="primary-button" type="submit">دخول <ShieldCheck size={17} /></button></form>{message && <p className="teacher-error" role="alert">{message}</p>}<small>في استضافة GitHub Pages الثابتة، يجب تزويد `VITE_TEACHER_ACCESS_CODE` عبر طبقة وصول خارجية عند النشر الحقيقي. الرمز الافتراضي مخصص للمعاينة فقط.</small></section>
  return <section className="teacher-area"><div className="teacher-heading"><BookOpenCheck size={28} /><div><span className="section-kicker">منطقة المدرس</span><h1>دليل درس: شبكة الإحداثيات</h1><p>حلول المصدر والأنشطة والاختبار النهائي.</p></div></div><div className="teacher-entries">{lessonOneTeacherEntries.map(entry => <article className="teacher-entry" key={entry.id}><span className="source-label">{entry.id}</span><h2>{entry.title}</h2><p><strong>السؤال:</strong> {entry.prompt}</p><p><strong>الإجابة:</strong> <MathExpression>{entry.answer}</MathExpression></p><ol>{entry.reasoning.map(reason => <li key={reason}>{reason}</li>)}</ol>{entry.note && <div className="teacher-note"><strong>ملاحظة للمدرس:</strong> {entry.note}</div>}</article>)}</div></section>
}
