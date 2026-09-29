import { useState, type FormEvent, type ReactNode } from 'react'
import { LockKeyhole, ShieldCheck } from 'lucide-react'

interface TeacherPasswordGateProps { children: ReactNode }

/** A deliberately small client-side boundary for the static GitHub Pages deployment. */
export function TeacherPasswordGate({ children }: TeacherPasswordGateProps) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('teacher-area-unlocked') === 'true')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const expectedCode = import.meta.env.VITE_TEACHER_ACCESS_CODE || 'somer173'
  const unlock = (event: FormEvent) => {
    event.preventDefault()
    if (code === expectedCode) { sessionStorage.setItem('teacher-area-unlocked', 'true'); setUnlocked(true) }
    else setMessage('رمز الوصول غير صحيح. حاول مرة أخرى.')
  }
  if (unlocked) return <>{children}</>
  return <section className="teacher-gate"><div className="teacher-gate-icon"><LockKeyhole size={26} /></div><span className="section-kicker">منطقة خاصة بالمدرس</span><h1>دخول Teacher Area</h1><p>هذه المنطقة منفصلة عن تجربة الطالب وتحتوي على الحلول التفصيلية وملاحظات التدريس.</p><form onSubmit={unlock}><label htmlFor="teacher-code">كلمة مرور المدرس</label><input id="teacher-code" type="password" value={code} onChange={event => { setCode(event.target.value); setMessage('') }} autoComplete="off" /><button className="primary-button" type="submit">دخول <ShieldCheck size={17} /></button></form>{message && <p className="teacher-error" role="alert">{message}</p>}<small>هذه بوابة client-side مناسبة للنشر الثابت فقط. يمكن ربطها لاحقاً بمزود هوية خارجي دون تغيير بيانات الدروس.</small></section>
}
