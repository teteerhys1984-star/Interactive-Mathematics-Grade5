import { useState, type ReactNode } from 'react'
import { ArrowLeft, BookOpenCheck, ClipboardList, FileQuestion, GraduationCap, Menu, Sparkles, X } from 'lucide-react'
import { InstructorAttribution } from '../components/InstructorAttribution'
import { curriculumRegistry } from '../content/registry'
import { getEligibleTestCatalog, getTestDisplayMetadata, categoryForTestType, isTestCatalogBlocked } from './catalog'
import { SolutionsArea } from './SolutionsArea'
import { RichContentView } from './RichContentView'
import { TestRunner, createTestAttempt, type TestAttempt } from './TestRunner'
import { testListHref, testRunHref } from './routing'
import type { TestAreaRoute, TestListCategory } from './routing'
import type { TestRegistrySnapshot } from './registry'
import { testRegistry } from './registry'
import type { UnitMeta } from '../types'
import type { TestDefinition, TestType } from './types'
import './test-area.css'

export interface TestAreaProps {
  route: TestAreaRoute
  registry?: TestRegistrySnapshot
  curriculum?: readonly UnitMeta[]
}

const CATEGORY_COPY: Readonly<Record<TestListCategory, { title: string; description: string }>> = {
  lessons: {
    title: 'اختبارات الدروس',
    description: 'اختبارات مستقلة لا تُعرض إلا عندما تكون مؤهلة في سجل الاختبارات.',
  },
  units: {
    title: 'اختبارات الوحدات',
    description: 'اختبارات الوحدات المكتملة صراحةً في بيانات المنهج فقط.',
  },
  comprehensive: {
    title: 'الاختبارات الشاملة',
    description: 'اختبارات تُعرض وفق نطاقها الصريح المسجل في تعريف الاختبار.',
  },
}

const CATEGORY_ICONS: Readonly<Record<TestListCategory, typeof FileQuestion>> = {
  lessons: FileQuestion,
  units: GraduationCap,
  comprehensive: ClipboardList,
}

export function TestArea({ route, registry = testRegistry, curriculum = curriculumRegistry }: TestAreaProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [attempts, setAttempts] = useState<Readonly<Record<string, TestAttempt>>>({})
  const catalogBlocked = isTestCatalogBlocked(registry)
  const catalog = getEligibleTestCatalog(registry, curriculum)
  const allTests = [...catalog.lessonTests, ...catalog.unitTests, ...catalog.comprehensiveTests]
  const activeAttempts = Object.values(attempts).filter(
    (attempt): attempt is Extract<TestAttempt, { status: 'in-progress' }> => attempt.status === 'in-progress',
  )
  const submittedTestIds = new Set(Object.values(attempts)
    .filter((attempt): attempt is Extract<TestAttempt, { status: 'submitted' }> => attempt.status === 'submitted')
    .map((attempt) => attempt.testId))
  const submittedTests = allTests.filter((test) => submittedTestIds.has(test.id))
  const selectedTest = (route.kind === 'run' || route.kind === 'solution-group') && !catalogBlocked
    ? registry.getTestById(route.testId)
    : undefined
  const selectedMetadata = selectedTest ? getTestDisplayMetadata(selectedTest, curriculum) : undefined

  let content: ReactNode
  if (route.kind === 'home') {
    content = <TestAreaHome registryBlocked={catalogBlocked} registryHasErrors={!registry.report.valid} catalog={catalog} />
  } else if (route.kind === 'list') {
    const tests = route.category === 'lessons'
      ? catalog.lessonTests
      : route.category === 'units'
        ? catalog.unitTests
        : catalog.comprehensiveTests
    content = <TestListing category={route.category} tests={tests} curriculum={curriculum} registryBlocked={catalogBlocked} />
  } else if (route.kind === 'run') {
    content = selectedTest
      ? <TestRunner
          test={selectedTest}
          title={selectedMetadata?.title ?? ''}
          context={selectedMetadata?.context ?? ''}
          attempt={attempts[selectedTest.id] ?? createTestAttempt(selectedTest.id)}
          onAttemptChange={(attempt) => setAttempts((previous) => ({ ...previous, [selectedTest.id]: attempt }))}
        />
      : <UnavailableTest />
  } else if (route.kind === 'solutions-list' || route.kind === 'solution-group') {
    if (activeAttempts.length > 0) {
      content = <ActiveAttemptSolutionsLock attempts={activeAttempts} registry={registry} />
    } else if (route.kind === 'solutions-list' && submittedTests.length === 0 && !catalogBlocked) {
      content = <NoSubmittedSolutions />
    } else if (route.kind === 'solution-group' && selectedTest && !submittedTestIds.has(selectedTest.id) && !catalogBlocked) {
      content = <UnsubmittedSolutions test={selectedTest} curriculum={curriculum} />
    } else {
      content = <SolutionsArea
        route={route}
        catalogBlocked={catalogBlocked}
        curriculum={curriculum}
        tests={submittedTests}
        selectedTest={selectedTest && submittedTestIds.has(selectedTest.id) ? selectedTest : undefined}
      />
    }
  } else {
    content = <InvalidTestRoute />
  }

  return <div className="app-shell tests-page">
    <header className="topbar tests-topbar">
      <a className="brand" href="#top" aria-label="العودة إلى الرئيسية" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark"><Sparkles size={18} aria-hidden="true" /></span><span>رياضياتي</span>
      </a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="التنقل الرئيسي">
        <a className={route.kind === 'home' || route.kind === 'list' || route.kind === 'run' ? 'active' : undefined} href="#tests" onClick={() => setMenuOpen(false)}>منطقة الاختبارات</a>
        <a className={route.kind === 'solutions-list' || route.kind === 'solution-group' ? 'active' : undefined} href="#tests/solutions" onClick={() => setMenuOpen(false)}>الحلول</a>
        <a href="#top" onClick={() => setMenuOpen(false)}>الرئيسية</a>
      </nav>
      <a className="teacher-access-link" href="#teacher"><span>مساحة المدرس</span></a>
      <div className="header-actions">
        <button className="menu-button" type="button" aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
    <main className="test-area-main">
      <div className="test-area-container">{content}</div>
    </main>
    <footer><div className="footer-inner"><div className="brand"><span className="brand-mark"><Sparkles size={16} aria-hidden="true" /></span><span>رياضياتي</span></div><p>منصة الرياضيات التفاعلية · الصف الخامس</p><InstructorAttribution /><span className="footer-note">© {new Date().getFullYear()}</span></div></footer>
  </div>
}

function TestAreaHome({ registryBlocked, registryHasErrors, catalog }: {
  registryBlocked: boolean
  registryHasErrors: boolean
  catalog: ReturnType<typeof getEligibleTestCatalog>
}) {
  const sections: readonly { category: TestListCategory; tests: readonly TestDefinition[] }[] = [
    { category: 'lessons', tests: catalog.lessonTests },
    { category: 'units', tests: catalog.unitTests },
    { category: 'comprehensive', tests: catalog.comprehensiveTests },
  ]
  const totalTestCount = sections.reduce((total, section) => total + section.tests.length, 0)

  return <section className="test-area-section" aria-labelledby="test-area-home-title">
    <p className="test-area-eyebrow">تقييم مستقل · إجاباتك لا تغيّر محتوى الدروس</p>
    <div className="test-area-hero">
      <div>
        <h1 id="test-area-home-title" className="test-area-title">منطقة الاختبارات</h1>
        <p className="test-area-lead">اختر اختباراً مؤهلاً، أجب عن أسئلته ثم سلّمه لعرض نتيجتك. الحلول في مساحة منفصلة وتبقى مخفية إلى أن تنتهي المحاولة.</p>
      </div>
      <div className="test-area-hero-mark" aria-hidden="true"><ClipboardList size={34} /></div>
    </div>

    {registryBlocked && <div className="test-catalog-warning" role="status">
      سياسة السجل الحالية تمنع عرض الاختبارات المكتشفة في هذا الوضع المؤقت؛ لم يبدأ أي اختبار.
    </div>}
    {!registryBlocked && registryHasErrors && <div className="test-catalog-warning" role="status">
      تعرض هذه المساحة الاختبارات التي اجتازت التحقق والأهلية فقط؛ لا تظهر التعريفات الأخرى للطالب.
    </div>}

    <div className="test-category-grid" aria-label="أقسام الاختبارات">
      {sections.map(({ category, tests }) => {
        const copy = CATEGORY_COPY[category]
        const Icon = CATEGORY_ICONS[category]
        return <article className="test-category-card" key={category}>
          <span className="test-category-icon"><Icon size={22} aria-hidden="true" /></span>
          <div className="test-category-copy">
            <h2>{copy.title}</h2>
            <p>{copy.description}</p>
            <p className={tests.length ? 'test-category-count' : 'test-category-empty'}>
              {registryBlocked ? 'السجل غير متاح' : tests.length ? formatTestCount(tests.length) : 'لا توجد اختبارات مؤهلة حالياً'}
            </p>
          </div>
          <a className="test-category-link" href={testListHref(category)} aria-label={`${tests.length ? 'عرض' : 'فتح'} ${copy.title}`}>
            {tests.length ? 'عرض الاختبارات' : 'فتح القسم'} <ArrowLeft size={17} aria-hidden="true" />
          </a>
        </article>
      })}
    </div>

    <article className="test-solutions-entry">
      <div className="test-solutions-entry-copy">
        <span className="test-category-icon"><BookOpenCheck size={22} aria-hidden="true" /></span>
        <div><h2>حلول تعليمية مستقلة</h2><p>تُحفظ مع تعريفات الاختبارات نفسها، ولا تُفتح إلا بعد تسليم الاختبار؛ وتُعرض ضمن مجموعات مرقمة بحسب الأسئلة الفعلية.</p>
          <p className={!registryBlocked && totalTestCount > 0 ? 'test-category-count' : 'test-category-empty'}>
            {registryBlocked ? 'السجل غير متاح' : totalTestCount > 0 ? `${formatTestCount(totalTestCount)} لها حلول مرتبطة` : 'لا توجد حلول اختبارات متاحة حالياً'}
          </p>
        </div>
      </div>
      <a className="test-secondary-button" href="#tests/solutions">قائمة الحلول <ArrowLeft size={17} aria-hidden="true" /></a>
    </article>
  </section>
}

function TestListing({ category, tests, curriculum, registryBlocked }: {
  category: TestListCategory
  tests: readonly TestDefinition[]
  curriculum: readonly UnitMeta[]
  registryBlocked: boolean
}) {
  const copy = CATEGORY_COPY[category]
  const Icon = CATEGORY_ICONS[category]
  return <section className="test-area-section" aria-labelledby="test-listing-title">
    <a className="test-back-link" href="#tests"><ArrowRightIcon /> منطقة الاختبارات</a>
    <p className="test-area-eyebrow">اختبارات مبنية من السجل المؤهل فقط</p>
    <div className="test-listing-heading">
      <span className="test-category-icon"><Icon size={22} aria-hidden="true" /></span>
      <div><h1 id="test-listing-title" className="test-area-title">{copy.title}</h1><p className="test-area-lead">{copy.description}</p></div>
    </div>
    {tests.length === 0
      ? <div className="test-empty-state" role="status">
          <span className="test-empty-icon"><FileQuestion size={24} aria-hidden="true" /></span>
          <div>
            <h2>{registryBlocked ? 'تعذّر اعتماد سجل الاختبارات' : `لا توجد ${category === 'lessons' ? 'اختبارات دروس' : category === 'units' ? 'اختبارات وحدات' : 'اختبارات شاملة'} مؤهلة حالياً`}</h2>
            <p>{!registryBlocked
              ? category === 'units'
                ? 'لا تظهر هنا إلا اختبارات الوحدات التي حالتها «مكتملة» صراحةً في بيانات المنهج.'
                : 'ستظهر الاختبارات هنا بعد تسجيل تعريف صالح واجتيازه التحقق والأهلية.'
              : 'لم نعرض أي اختبار لأن صلاحية السجل لم تُعتمد.'}</p>
          </div>
        </div>
      : <ol className="test-card-list">
          {tests.map((test) => <TestListItem key={test.id} test={test} curriculum={curriculum} />)}
        </ol>}
  </section>
}

function TestListItem({ test, curriculum }: { test: TestDefinition; curriculum: readonly UnitMeta[] }) {
  const metadata = getTestDisplayMetadata(test, curriculum)
  const category = categoryForTestType(test.type)
  return <li>
    <article className="test-list-card">
      <div className="test-list-card-copy">
        <span className="test-card-context">{metadata.context}</span>
        <h2>{metadata.title}</h2>
        <p className="test-card-scope">{metadata.scope}</p>
        {test.description.length > 0 && <p className="test-card-description"><RichContentView content={test.description} /></p>}
        <p className="test-card-count">{test.questions.length} سؤالاً</p>
      </div>
      <a className="test-primary-button" href={testRunHref(test.id)}>ابدأ الاختبار <ArrowLeft size={17} aria-hidden="true" /></a>
      <a className="test-card-solutions-link" href="#tests/solutions">الحلول مستقلة <BookOpenCheck size={15} aria-hidden="true" /></a>
      <span className="test-card-type" data-type={test.type}>{testTypeLabel(test.type)}</span>
      <span className="test-card-category" aria-hidden="true">{category}</span>
    </article>
  </li>
}

function ActiveAttemptSolutionsLock({ attempts, registry }: {
  attempts: readonly TestAttempt[]
  registry: TestRegistrySnapshot
}) {
  return <section className="test-area-section" aria-labelledby="active-solutions-locked-title">
    <div className="test-empty-state" role="status">
      <span className="test-empty-icon"><BookOpenCheck size={24} aria-hidden="true" /></span>
      <div>
        <p className="test-area-eyebrow">المحاولة قيد التقدم</p>
        <h1 id="active-solutions-locked-title">الحلول مخفية حتى تسليم المحاولة</h1>
        <p>تبقى الحلول المستقلة مغلقة ما دامت هناك محاولة غير مسلّمة. عُد إلى الاختبار وأكمله أو سلّمه أولاً.</p>
        <div className="test-result-actions">
          {attempts.map((attempt) => {
            const test = registry.getTestById(attempt.testId)
            return <a key={attempt.testId} className="test-primary-button" href={testRunHref(attempt.testId)}>
              متابعة: {test?.title ?? `الاختبار ${attempt.testId}`}
            </a>
          })}
        </div>
      </div>
    </div>
  </section>
}

function NoSubmittedSolutions() {
  return <section className="test-area-section" aria-labelledby="solutions-heading">
    <p className="test-area-eyebrow">حلول مستقلة مرتبطة بمحاولاتك</p>
    <h1 id="solutions-heading" className="test-area-title">حلول الاختبارات</h1>
    <div className="test-empty-state" role="status">
      <span className="test-empty-icon"><BookOpenCheck size={24} aria-hidden="true" /></span>
      <div>
        <h2>تظهر الحلول بعد تسليم الاختبار</h2>
        <p>لم تُسلّم أي اختبار بعد. أكمل اختباراً مؤهلاً وسلّمه أولاً لفتح حلوله التعليمية.</p>
        <a className="test-primary-button" href="#tests/lessons">استعراض اختبارات الدروس</a>
      </div>
    </div>
  </section>
}

function UnsubmittedSolutions({ test, curriculum }: { test: TestDefinition; curriculum: readonly UnitMeta[] }) {
  const metadata = getTestDisplayMetadata(test, curriculum)
  return <section className="test-area-section" aria-labelledby="unsubmitted-solutions-title">
    <a className="test-back-link" href="#tests/solutions"><ArrowRightIcon /> قائمة الحلول</a>
    <div className="test-empty-state" role="status">
      <span className="test-empty-icon"><BookOpenCheck size={24} aria-hidden="true" /></span>
      <div>
        <p className="test-area-eyebrow">{metadata.context}</p>
        <h1 id="unsubmitted-solutions-title">الحلول غير متاحة قبل التسليم</h1>
        <p>أكمل «{metadata.title}» وسلّمه أولاً لفتح الحلول المرتبطة بأسئلته.</p>
        <div className="test-result-actions">
          <a className="test-primary-button" href={testRunHref(test.id)}>فتح الاختبار</a>
          <a className="test-secondary-button" href="#tests/lessons">قائمة اختبارات الدروس</a>
        </div>
      </div>
    </div>
  </section>
}

function UnavailableTest() {
  return <div className="test-empty-state" role="status">
    <span className="test-empty-icon"><FileQuestion size={24} aria-hidden="true" /></span>
    <div>
      <h1>الاختبار غير موجود أو غير مؤهل</h1>
      <p>لم يُعثر على تعريف صالح ومؤهل لهذا المسار، لذلك لم يبدأ الاختبار.</p>
      <a className="test-text-link" href="#tests">العودة إلى منطقة الاختبارات</a>
    </div>
  </div>
}

function InvalidTestRoute() {
  return <div className="test-empty-state" role="status">
    <span className="test-empty-icon"><FileQuestion size={24} aria-hidden="true" /></span>
    <div>
      <h1>هذا المسار غير صالح</h1>
      <p>تعذّر تحديد قسم أو اختبار أو مجموعة حلول لهذا الرابط.</p>
      <a className="test-text-link" href="#tests">العودة إلى منطقة الاختبارات</a>
    </div>
  </div>
}

function formatTestCount(count: number): string {
  if (count === 1) return 'اختبار واحد متاح'
  if (count === 2) return 'اختباران متاحان'
  return `${count} اختبارات متاحة`
}

function testTypeLabel(type: TestType): string {
  switch (type) {
    case 'lesson': return 'اختبار درس'
    case 'unit': return 'اختبار وحدة'
    case 'comprehensive': return 'اختبار شامل'
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}

function ArrowRightIcon() {
  return <span aria-hidden="true" className="test-inline-arrow">←</span>
}
