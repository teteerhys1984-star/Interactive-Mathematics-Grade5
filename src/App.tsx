import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronDown, ClipboardList, Compass, LockKeyhole, Menu, Sparkles, Target, X } from 'lucide-react'
import { MathExpression } from './components/MathExpression'
import { UnitCard } from './components/UnitCard'
import { ComingSoon } from './components/ComingSoon'
import { InstructorAttribution } from './components/InstructorAttribution'
import { curriculumRegistry } from './content/registry'
import { lessonComponents } from './content/lessonComponents'
import { TeacherArea } from './teacher/TeacherArea'
import { TestArea } from './tests/TestArea'
import { parseTestAreaRoute } from './tests/routing'
import type { TestRegistrySnapshot } from './tests/registry'
import type { UnitMeta } from './types'

const LESSON_HASH = /^#lesson\/([\w-]+)$/
const TEACHER_HASH = /^#teacher(?:\/([\w-]+))?$/

function readRoute() {
  const hash = window.location.hash
  const lessonMatch = hash.match(LESSON_HASH)
  const teacherMatch = hash.match(TEACHER_HASH)
  const testRoute = parseTestAreaRoute(hash)
  return {
    lessonId: lessonMatch && lessonComponents[lessonMatch[1]] ? lessonMatch[1] : null,
    teacherOpen: Boolean(teacherMatch),
    teacherLessonId: teacherMatch?.[1] ?? null,
    testRoute,
  }
}

/** Arabic plural helpers for the registry summary chip (UI text only, not lesson content). */
function unitCountLabel(count: number) {
  if (count === 1) return 'وحدة واحدة'
  if (count === 2) return 'وحدتان'
  return `${count} وحدات`
}
function lessonCountLabel(count: number) {
  if (count === 1) return 'درس واحد'
  if (count === 2) return 'درسان'
  return `${count} دروس`
}

export interface AppProps {
  testRegistry?: TestRegistrySnapshot
  curriculum?: readonly UnitMeta[]
}

function App({ testRegistry: injectedTestRegistry, curriculum = curriculumRegistry }: AppProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const allLessons = useMemo(() => curriculum.flatMap(unit => unit.lessons), [curriculum])
  const unitCount = curriculum.length
  const lessonCount = allLessons.length
  const activeLesson = route.lessonId ? allLessons.find(lesson => lesson.id === route.lessonId) : undefined
  const ActiveLessonComponent = route.lessonId ? lessonComponents[route.lessonId] : undefined

  if (route.testRoute) return <TestArea route={route.testRoute} registry={injectedTestRegistry} curriculum={curriculum} />

  if (route.teacherOpen) return <div className="app-shell lesson-page teacher-page">
    <header className="topbar"><a className="brand" href="#top" aria-label="العودة إلى الرئيسية"><span className="brand-mark"><Sparkles size={18} /></span><span>رياضياتي</span></a><nav className="main-nav" aria-label="التنقل الرئيسي"><a className="active" href="#teacher">منطقة المدرس</a><a href="#top">الرئيسية</a></nav><InstructorAttribution className="header-attribution" /></header>
    <main><TeacherArea initialLessonId={route.teacherLessonId} /></main>
    <footer><div className="footer-inner"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>رياضياتي</span></div><p>منصة الرياضيات التفاعلية · الصف الخامس</p><InstructorAttribution /><span className="footer-note">© {new Date().getFullYear()}</span></div></footer>
  </div>

  if (activeLesson && ActiveLessonComponent) return <div className="app-shell lesson-page">
    <header className="topbar"><a className="brand" href="#top" aria-label="العودة إلى الرئيسية"><span className="brand-mark"><Sparkles size={18} /></span><span>رياضياتي</span></a><nav className="main-nav" aria-label="التنقل الرئيسي"><a className="active" href={`#lesson/${activeLesson.id}`}>{activeLesson.title}</a><a href="#top">الرئيسية</a></nav><InstructorAttribution className="header-attribution" /></header>
    <main><ActiveLessonComponent /></main>
    <footer><div className="footer-inner"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>رياضياتي</span></div><p>منصة الرياضيات التفاعلية · الصف الخامس</p><InstructorAttribution /><span className="footer-note">© {new Date().getFullYear()}</span></div></footer>
  </div>

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="العودة إلى الرئيسية"><span className="brand-mark"><Sparkles size={18} /></span><span>رياضياتي</span></a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="التنقل الرئيسي">
        <a className="active" href="#top" onClick={() => setMenuOpen(false)}>الرئيسية</a><a href="#units" onClick={() => setMenuOpen(false)}>الوحدات</a><a href="#tests" onClick={() => setMenuOpen(false)}>الاختبارات</a><a href="#about" onClick={() => setMenuOpen(false)}>عن المنصة</a>
      </nav>
      <InstructorAttribution className="header-attribution" /><a className="teacher-access-link" href="#teacher"><LockKeyhole size={15} /> مساحة المدرس</a><div className="header-actions"><button className="menu-button" aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
    </header>
    <main id="top">
      <section className="hero container">
        <div className="hero-copy"><div className="welcome-pill"><span className="pulse-dot" /> مساحة تعلّم آمنة وممتعة</div><h1>الرياضيات تصبح<br /><em>أوضح</em> مع كل خطوة.</h1><p>منصة تفاعلية تساعد طلاب الصف الخامس على بناء فهم عميق للرياضيات، خطوةً خطوة، وبأسلوب يراعي فضولهم.</p><div className="hero-actions"><a className="primary-button" href="#units">استكشف المنصة <ArrowLeft size={18} /></a><a className="text-button" href="#about">كيف تعمل؟ <ChevronDown size={16} /></a></div></div>
        <div className="hero-visual" aria-label="أمثلة على الرموز الرياضية" role="img"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-core"><MathExpression>∞</MathExpression><small>اكتشف<br />وفكّر</small></div><div className="equation-card card-one"><MathExpression>3 × 4 = 12</MathExpression></div><div className="equation-card card-two"><MathExpression>1/2 + 1/2 = 1</MathExpression></div><div className="shape shape-circle" /><div className="shape shape-square" /><span className="hero-plus plus-a" aria-hidden="true">+</span><span className="hero-plus plus-b" aria-hidden="true">+</span><span className="hero-dot" aria-hidden="true" /></div>
      </section>
      <section className="quick-stats container home-quick-stats" aria-label="ملخص المنصة"><div><Target /><span><strong>تعلّم هادف</strong><small>أنشطة لها معنى</small></span></div><div><Compass /><span><strong>تقدّم واضح</strong><small>خطوات مرتبة</small></span></div><div><Sparkles /><span><strong>مصمم للطلاب</strong><small>بسيط وممتع</small></span></div></section>
      <section className="home-tests-entry container" aria-labelledby="home-tests-title"><div className="home-tests-entry-copy"><span className="test-category-icon"><ClipboardList size={22} aria-hidden="true" /></span><div><span className="section-kicker">تقييم مستقل</span><h2 id="home-tests-title">هل أنت مستعد لاختبار فهمك؟</h2><p>افتح منطقة الاختبارات المستقلة، حيث تُعرض الاختبارات المؤهلة فقط وتبقى الحلول في مساحة منفصلة.</p></div></div><a className="test-primary-button" href="#tests">منطقة الاختبارات <ArrowLeft size={17} aria-hidden="true" /></a></section>
      <section className="units-section container" id="units"><div className="section-heading"><div><span className="section-kicker">مساحة التعلّم</span><h2>رحلتك في الرياضيات</h2><p>محتوى المنهج منظّم هنا في وحدات ودروس تفاعلية متسلسلة.</p></div><span className="registry-count">{unitCountLabel(unitCount)} · {lessonCountLabel(lessonCount)}</span></div>{curriculum.length ? <div className="unit-grid">{curriculum.map(unit => <UnitCard key={unit.id} unit={unit} />)}</div> : <ComingSoon />}</section>
      <section className="about-section container" id="about"><div className="about-panel"><div className="about-decoration"><MathExpression>x + 5 = 12</MathExpression><MathExpression>25 ÷ 5 = 5</MathExpression><MathExpression>a + b = b + a</MathExpression></div><div><span className="section-kicker">نبني الأساس أولاً</span><h2>تجربة تعلّم، لا مجرد صفحات.</h2><p>كل درس في المنصة مبنيّ من الكتاب المدرسي نفسه: نصوصه وأنشطته وأسئلته تُقدَّم في رحلة خطوة بخطوة تجمع بين الشرح الواضح والتفكير والتطبيق، مع حلول كاملة لكل عنصر في منطقة المدرّس.</p><a className="outline-button" href="#units">تعرّف على المساحة <ArrowLeft size={17} /></a></div></div></section>
    </main>
    <footer><div className="footer-inner"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>رياضياتي</span></div><p>منصة الرياضيات التفاعلية · الصف الخامس</p><InstructorAttribution /><span className="footer-note">© {new Date().getFullYear()}</span></div></footer>
  </div>
}
export default App
