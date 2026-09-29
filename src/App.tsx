import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronDown, CircleHelp, Compass, Menu, Moon, Sparkles, Target, X } from 'lucide-react'
import { MathExpression } from './components/MathExpression'
import { UnitCard } from './components/UnitCard'
import { ComingSoon } from './components/ComingSoon'
import { InstructorAttribution } from './components/InstructorAttribution'
import { curriculumRegistry } from './content/registry'
import { CoordinatesLesson } from './lessons/CoordinatesLesson'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lessonOpen, setLessonOpen] = useState(() => window.location.hash === '#lesson/coordinates')
  useEffect(() => {
    const onHashChange = () => setLessonOpen(window.location.hash === '#lesson/coordinates')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const unitCount = curriculumRegistry.length
  const lessonCount = curriculumRegistry.reduce((total, unit) => total + unit.lessons.length, 0)
  if (lessonOpen) return <div className="app-shell lesson-page">
    <header className="topbar"><a className="brand" href="#top" aria-label="العودة إلى الرئيسية"><span className="brand-mark"><Sparkles size={18} /></span><span>رياضياتي</span></a><nav className="main-nav" aria-label="التنقل الرئيسي"><a className="active" href="#lesson/coordinates">الدرس الأول</a><a href="#top">الرئيسية</a></nav><InstructorAttribution className="header-attribution" /><div className="header-actions"><button className="round-button" aria-label="المساعدة"><CircleHelp size={19} /></button><button className="round-button" aria-label="تبديل المظهر"><Moon size={18} /></button></div></header>
    <main><CoordinatesLesson /></main>
    <footer><div className="footer-inner"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>رياضياتي</span></div><p>منصة الرياضيات التفاعلية · الصف الخامس</p><InstructorAttribution /><span className="footer-note">© {new Date().getFullYear()}</span></div></footer>
  </div>
  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="العودة إلى الرئيسية"><span className="brand-mark"><Sparkles size={18} /></span><span>رياضياتي</span></a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="التنقل الرئيسي">
        <a className="active" href="#top" onClick={() => setMenuOpen(false)}>الرئيسية</a><a href="#units" onClick={() => setMenuOpen(false)}>الوحدات</a><a href="#about" onClick={() => setMenuOpen(false)}>عن المنصة</a>
      </nav>
      <InstructorAttribution className="header-attribution" /><div className="header-actions"><button className="round-button" aria-label="المساعدة"><CircleHelp size={19} /></button><button className="round-button" aria-label="تبديل المظهر"><Moon size={18} /></button><button className="menu-button" aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
    </header>
    <main id="top">
      <section className="hero container">
        <div className="hero-copy"><div className="welcome-pill"><span className="pulse-dot" /> مساحة تعلّم آمنة وممتعة</div><h1>الرياضيات تصبح<br /><em>أوضح</em> مع كل خطوة.</h1><p>منصة تفاعلية تساعد طلاب الصف الخامس على بناء فهم عميق للرياضيات، خطوةً خطوة، وبأسلوب يراعي فضولهم.</p><div className="hero-actions"><a className="primary-button" href="#units">استكشف المنصة <ArrowLeft size={18} /></a><a className="text-button" href="#about">كيف تعمل؟ <ChevronDown size={16} /></a></div></div>
        <div className="hero-visual" aria-label="أمثلة على الرموز الرياضية" role="img"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="equation-card card-one"><MathExpression>3 × 4 = 12</MathExpression></div><div className="equation-card card-two"><MathExpression>1/2 + 1/2 = 1</MathExpression></div><div className="shape shape-circle" /><div className="shape shape-square" /><div className="hero-core"><span>∞</span><small>اكتشف<br />وفكّر</small></div><div className="spark spark-a">✦</div><div className="spark spark-b">✦</div></div>
      </section>
      <section className="quick-stats container" aria-label="ملخص المنصة"><div><Target /><span><strong>تعلّم هادف</strong><small>أنشطة لها معنى</small></span></div><div><Compass /><span><strong>تقدّم واضح</strong><small>خطوات مرتبة</small></span></div><div><Sparkles /><span><strong>مصمم للطلاب</strong><small>بسيط وممتع</small></span></div></section>
      <section className="units-section container" id="units"><div className="section-heading"><div><span className="section-kicker">مساحة التعلّم</span><h2>رحلتك في الرياضيات</h2><p>سيظهر محتوى المنهج هنا منظماً في وحدات ودروس تفاعلية.</p></div><span className="registry-count">{unitCount} وحدات · {lessonCount} دروس</span></div>{curriculumRegistry.length ? <div className="unit-grid">{curriculumRegistry.map(unit => <UnitCard key={unit.id} unit={unit} />)}</div> : <ComingSoon />}</section>
      <section className="about-section container" id="about"><div className="about-panel"><div className="about-decoration"><MathExpression>x + 5 = 12</MathExpression><MathExpression>25 ÷ 5 = 5</MathExpression><MathExpression>a + b = b + a</MathExpression></div><div><span className="section-kicker">نبني الأساس أولاً</span><h2>تجربة تعلّم، لا مجرد صفحات.</h2><p>هذه هي الصفحة الأولى من منصة رياضياتي. صُممت البنية لتستقبل دروس المنهج الأصلية لاحقاً، وتحولها إلى تجارب متدرجة تجمع بين الشرح والتفكير والتطبيق.</p><a className="outline-button" href="#units">تعرّف على المساحة <ArrowLeft size={17} /></a></div></div></section>
    </main>
    <footer><div className="footer-inner"><div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>رياضياتي</span></div><p>منصة الرياضيات التفاعلية · الصف الخامس</p><InstructorAttribution /><span className="footer-note">© {new Date().getFullYear()}</span></div></footer>
  </div>
}
export default App
