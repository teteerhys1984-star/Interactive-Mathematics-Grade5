import { useState, type ReactNode } from 'react'
import { ArrowLeft, BookOpenCheck, ClipboardList, FileQuestion, ListChecks, Menu, Sparkles, X } from 'lucide-react'
import { InstructorAttribution } from '../components/InstructorAttribution'
import { curriculumRegistry, unitLessons } from '../content/registry'
import { RichContentView } from '../tests/RichContentView'
import { independentTestsRegistry } from './registry'
import {
  independentLevelLabel,
  independentResponseKind,
  independentStyleLabel,
  type IndependentQuestion,
  type IndependentTable,
  type IndependentTest,
} from './types'
import {
  independentSolutionsHref,
  independentTestHref,
  independentTestsHref,
  type IndependentTestsRoute,
} from './routing'
import type { IndependentTestsRegistry } from './validation'
import type { UnitMeta } from '../types'
import './independent-tests.css'

export interface IndependentTestsAreaProps {
  route: IndependentTestsRoute
  registry?: IndependentTestsRegistry
  curriculum?: readonly UnitMeta[]
}

export function IndependentTestsArea({
  route,
  registry = independentTestsRegistry,
  curriculum = curriculumRegistry,
}: IndependentTestsAreaProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const selectedTest = route.kind === 'test'
    ? registry.getTestByNumber(route.testNumber)
    : undefined

  let content: ReactNode
  if (route.kind === 'test') {
    content = selectedTest
      ? <TestDetail test={selectedTest} curriculum={curriculum} />
      : <MissingTest />
  } else if (route.kind === 'solutions') {
    content = <SolutionsTab route={route} registry={registry} curriculum={curriculum} />
  } else if (route.kind === 'tests') {
    content = <TestsTab tests={registry.tests} issues={registry.issues} curriculum={curriculum} />
  } else {
    content = <MissingRoute />
  }

  return <div className="app-shell independent-tests-page">
    <header className="topbar independent-topbar">
      <a className="brand" href="#top" aria-label="العودة إلى الرئيسية" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark"><Sparkles size={18} aria-hidden="true" /></span><span>رياضياتي</span>
      </a>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="التنقل الرئيسي">
        <a className="active" href={independentTestsHref()} onClick={() => setMenuOpen(false)}>اختبارات مستقلة</a>
        <a href="#top" onClick={() => setMenuOpen(false)}>الرئيسية</a>
      </nav>
      <a className="teacher-access-link" href="#teacher"><span>مساحة المدرس</span></a>
      <div className="header-actions">
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>

    <main className="independent-main">
      <div className="independent-container">
        <nav className="independent-tabs" aria-label="تبويبات الاختبارات المستقلة">
          <a
            href={independentTestsHref()}
            className={route.kind === 'tests' || route.kind === 'test' ? 'is-active' : undefined}
            aria-current={route.kind === 'tests' || route.kind === 'test' ? 'page' : undefined}
          >
            <ClipboardList size={18} aria-hidden="true" /> الاختبارات
          </a>
          <a
            href={independentSolutionsHref()}
            className={route.kind === 'solutions' ? 'is-active' : undefined}
            aria-current={route.kind === 'solutions' ? 'page' : undefined}
          >
            <BookOpenCheck size={18} aria-hidden="true" /> حلول الاختبارات
          </a>
        </nav>
        {content}
      </div>
    </main>

    <footer>
      <div className="footer-inner">
        <div className="brand"><span className="brand-mark"><Sparkles size={16} aria-hidden="true" /></span><span>رياضياتي</span></div>
        <p>منصة الرياضيات التفاعلية · الصف الخامس</p>
        <InstructorAttribution />
        <span className="footer-note">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  </div>
}

function TestsTab({ tests, issues, curriculum }: {
  tests: IndependentTestsRegistry['tests']
  issues: IndependentTestsRegistry['issues']
  curriculum: readonly UnitMeta[]
}) {
  const errorCount = issues.filter((issue) => issue.severity === 'error').length

  return <section className="independent-section" aria-labelledby="independent-tests-title">
    <div className="independent-hero">
      <div>
        <p className="independent-eyebrow">قسم دائم · تقييم شامل مستقل</p>
        <h1 id="independent-tests-title" className="independent-title">اختبارات مستقلة</h1>
        <p className="independent-lead">
          اختبارات شاملة من ثلاثين سؤالاً لكل اختبار، تغطّي الدروس المحددة لها بالتساوي.
          تُعرض الأسئلة في تبويب الاختبارات، وتبقى الحلول التفصيلية في تبويب مستقل لا يختلط بغيره.
        </p>
      </div>
      <div className="independent-hero-mark" aria-hidden="true"><ClipboardList size={34} /></div>
    </div>

    <div className="independent-stats" aria-label="ملخص الاختبارات المستقلة">
      <div><strong>{tests.length}</strong><span>اختباراً متاحاً</span></div>
      <div><strong>30</strong><span>سؤالاً في كل اختبار</span></div>
      <div><strong>30</strong><span>حلاً تفصيلياً لكل اختبار</span></div>
    </div>

    {errorCount > 0 && <div className="independent-warning" role="status">
      تعذّر عرض {errorCount} تعريف اختبار بسبب خلل في بنيته أو في نطاق دروسه. تظهر الاختبارات السليمة فقط.
    </div>}

    {tests.length === 0
      ? <div className="independent-empty" role="status">
          <span className="independent-empty-icon"><FileQuestion size={24} aria-hidden="true" /></span>
          <div>
            <h2>لا توجد اختبارات مستقلة متاحة حالياً</h2>
            <p>سيظهر الاختبار هنا بعد إضافة تعريفه في <span dir="ltr">src/independent-tests/definitions</span> واجتيازه فحص البنية.</p>
          </div>
        </div>
      : <ol className="independent-test-list">
          {tests.map((test) => <TestCard key={test.id} test={test} curriculum={curriculum} />)}
        </ol>}
  </section>
}

function TestCard({ test, curriculum }: { test: IndependentTest; curriculum: readonly UnitMeta[] }) {
  const lessonTitles = getLessonTitles(test.lessonIds, curriculum)
  const styleCount = new Set(test.questions.map((question) => question.style)).size

  return <li>
    <article className="independent-test-card">
      <div className="independent-test-number" aria-hidden="true">{test.number}</div>
      <div className="independent-test-copy">
        <p className="independent-eyebrow">الاختبار المستقل رقم {test.number}</p>
        <h2>{test.title}</h2>
        <div className="independent-test-scope">
          <span className="independent-scope-label">الدروس المشمولة ({lessonTitles.length})</span>
          <ul className="independent-chip-list">
            {lessonTitles.map((title) => <li key={title}>{title}</li>)}
          </ul>
        </div>
        <p className="independent-test-meta">
          <span>{test.questions.length} سؤالاً</span>
          <span>{test.solutions.length} حلاً تفصيلياً</span>
          <span>{styleCount} أنماط أسئلة</span>
        </p>
      </div>
      <div className="independent-test-actions">
        <a className="independent-primary-button" href={independentTestHref(test.number)}>
          فتح الاختبار <ArrowLeft size={17} aria-hidden="true" />
        </a>
        <a className="independent-secondary-button" href={independentSolutionsHref(test.number)}>
          حلول هذا الاختبار
        </a>
      </div>
    </article>
  </li>
}

function TestDetail({ test, curriculum }: { test: IndependentTest; curriculum: readonly UnitMeta[] }) {
  const lessonTitles = getLessonTitles(test.lessonIds, curriculum)

  return <section className="independent-section" aria-labelledby="independent-test-title">
    <a className="independent-back-link" href={independentTestsHref()}>
      <span aria-hidden="true">←</span> كل الاختبارات
    </a>

    <header className="independent-test-header">
      <p className="independent-eyebrow">الاختبار المستقل رقم {test.number}</p>
      <h1 id="independent-test-title" className="independent-title">{test.title}</h1>
      <p className="independent-lead"><RichContentView content={test.description} /></p>
      <div className="independent-test-meta independent-test-meta--header">
        <span>{test.questions.length} سؤالاً</span>
        <span>{lessonTitles.length} دروس</span>
        <span>الحلول في تبويب مستقل</span>
      </div>
      <ul className="independent-chip-list independent-chip-list--header">
        {lessonTitles.map((title) => <li key={title}>{title}</li>)}
      </ul>
    </header>

    <div className="independent-notice" role="note">
      <BookOpenCheck size={20} aria-hidden="true" />
      <p>
        لا تظهر أي إجابة أو حل في صفحة الاختبار. بعد إنهاء المحاولة، انتقل إلى
        {' '}<a href={independentSolutionsHref(test.number)}>حلول هذا الاختبار</a>{' '}
        لمراجعة الإجابات وخطوات الحل بالتفصيل.
      </p>
    </div>

    <ol className="independent-question-list">
      {test.questions.map((question) => (
        <QuestionCard key={question.number} question={question} testNumber={test.number} />
      ))}
    </ol>

    <div className="independent-end-note">
      <p>انتهت أسئلة الاختبار. راجع حلولك في المساحة المستقلة.</p>
      <a className="independent-secondary-button" href={independentSolutionsHref(test.number)}>
        عرض الحلول التفصيلية
      </a>
    </div>
  </section>
}

function QuestionCard({ question, testNumber }: { question: IndependentQuestion; testNumber: number }) {
  const responseKind = independentResponseKind(question.style)

  return <li>
    <article className="independent-question-card" id={`independent-question-${testNumber}-${question.number}`}>
      <header className="independent-question-head">
        <span className="independent-question-number">السؤال {question.number}</span>
        <span className="independent-question-style">{independentStyleLabel(question.style)}</span>
      </header>
      <div className="independent-question-prompt"><RichContentView content={question.prompt} /></div>
      {question.table && <IndependentTableView table={question.table} />}
      {question.options
        ? <OptionList options={question.options} />
        : <ResponseArea kind={responseKind} />}
    </article>
  </li>
}

const OPTION_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ'] as const

function OptionList({ options }: { options: NonNullable<IndependentQuestion['options']> }) {
  return <ol className="independent-options" aria-label="خيارات الإجابة">
    {options.map((option, index) => <li key={option.id}>
      <span className="independent-option-letter" aria-hidden="true">{OPTION_LETTERS[index] ?? index + 1}</span>
      <span className="independent-option-label"><RichContentView content={option.label} /></span>
    </li>)}
  </ol>
}

function ResponseArea({ kind }: { kind: ReturnType<typeof independentResponseKind> }) {
  switch (kind) {
    case 'blank':
      return <div className="independent-answer-space">
        <span className="independent-answer-space-label">الإجابة</span>
        <span className="independent-answer-rule" aria-hidden="true" />
      </div>
    case 'compare':
      return <div className="independent-compare" aria-label="مساحة المقارنة">
        <span className="independent-workspace-label">ضع الرمز المناسب:</span>
        <div className="independent-compare-boxes" aria-hidden="true">
          <span>&lt;</span><span>=</span><span>&gt;</span>
        </div>
      </div>
    case 'draw':
      return <div className="independent-draw-area">
        <span className="independent-workspace-label">ارسم هنا</span>
        <div className="independent-draw-grid" aria-hidden="true" />
      </div>
    case 'work':
      return <div className="independent-workspace">
        <span className="independent-workspace-label">مساحة الحل</span>
        <div className="independent-ruled-lines" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
    case 'choices':
      return null
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}

function SolutionsTab({ route, registry, curriculum }: {
  route: Extract<IndependentTestsRoute, { kind: 'solutions' }>
  registry: IndependentTestsRegistry
  curriculum: readonly UnitMeta[]
}) {
  const selectedTest = route.testNumber === undefined
    ? registry.tests[0]
    : registry.getTestByNumber(route.testNumber)

  return <section className="independent-section" aria-labelledby="independent-solutions-title">
    <div className="independent-hero independent-hero--solutions">
      <div>
        <p className="independent-eyebrow">حلول مستقلة · منظّمة حسب رقم الاختبار</p>
        <h1 id="independent-solutions-title" className="independent-title">حلول الاختبارات</h1>
        <p className="independent-lead">
          لكل اختبار مجموعة حلول منفصلة، مرتّبة بترتيب أسئلته. يظهر في كل حل رقم السؤال ونصّه،
          والإجابة الصحيحة، وخطوات الحل، والفكرة الرياضية، وسبب الوصول إلى النتيجة.
        </p>
      </div>
      <div className="independent-hero-mark" aria-hidden="true"><BookOpenCheck size={34} /></div>
    </div>

    {registry.tests.length === 0
      ? <div className="independent-empty" role="status">
          <span className="independent-empty-icon"><FileQuestion size={24} aria-hidden="true" /></span>
          <div><h2>لا توجد حلول متاحة حالياً</h2><p>تظهر الحلول تلقائياً مع كل اختبار مستقل صالح.</p></div>
        </div>
      : <>
          <nav className="independent-solution-selector" aria-label="اختيار الاختبار لعرض حلوله">
            <span className="independent-scope-label">الاختبارات المتاحة</span>
            <div>
              {registry.tests.map((test) => <a
                key={test.id}
                href={independentSolutionsHref(test.number)}
                className={selectedTest?.id === test.id ? 'is-active' : undefined}
                aria-current={selectedTest?.id === test.id ? 'page' : undefined}
              >
                الاختبار {test.number}
              </a>)}
            </div>
          </nav>
          {selectedTest
            ? <SolutionsDetail test={selectedTest} curriculum={curriculum} />
            : <MissingTest level={2} />}
        </>}
  </section>
}

function SolutionsDetail({ test, curriculum }: { test: IndependentTest; curriculum: readonly UnitMeta[] }) {
  const lessonTitles = getLessonTitles(test.lessonIds, curriculum)

  return <section className="independent-solution-group" aria-labelledby={`independent-solutions-test-${test.number}`}>
    <header className="independent-test-header">
      <p className="independent-eyebrow">حلول الاختبار المستقل رقم {test.number}</p>
      <h2 id={`independent-solutions-test-${test.number}`} className="independent-title independent-title--sub">{test.title}</h2>
      <p className="independent-lead">
        مجموعة الحلول هذه تخصّ هذا الاختبار وحده، ولا تختلط بحلول أي اختبار آخر. الأسئلة مرتّبة من السؤال 1 إلى السؤال {test.questions.length}.
      </p>
      <div className="independent-test-meta independent-test-meta--header">
        <span>{test.solutions.length} حلاً تفصيلياً</span>
        <span>{lessonTitles.length} دروس</span>
      </div>
      <ul className="independent-chip-list independent-chip-list--header">
        {lessonTitles.map((title) => <li key={title}>{title}</li>)}
      </ul>
    </header>

    <details className="independent-solutions-index">
      <summary><ListChecks size={18} aria-hidden="true" /> فهرس الأسئلة <span>{test.questions.length}</span></summary>
      <ol>
        {test.questions.map((question) => <li key={question.number}>
          <button
            type="button"
            aria-label={`الانتقال إلى حل السؤال ${question.number}`}
            onClick={() => document.getElementById(`independent-solution-${test.number}-${question.number}`)?.scrollIntoView?.({ block: 'start' })}
          >
            {question.number}
          </button>
        </li>)}
      </ol>
    </details>

    <ol className="independent-solution-list">
      {test.solutions.map((solution) => {
        const question = test.questions[solution.questionNumber - 1]
        return <li key={solution.questionNumber}>
          <article className="independent-solution-card" id={`independent-solution-${test.number}-${solution.questionNumber}`}>
            <header className="independent-solution-head">
              <span className="independent-question-number">السؤال {solution.questionNumber}</span>
              <span className="independent-question-style">{independentStyleLabel(question.style)}</span>
              <span className="independent-level-chip">{independentLevelLabel(question.level)}</span>
            </header>

            <div className="independent-solution-question">
              <span className="independent-solution-label">نص السؤال / مرجعه</span>
              <div className="independent-question-prompt"><RichContentView content={question.prompt} /></div>
              {question.table && <IndependentTableView table={question.table} />}
              {question.options && <OptionList options={question.options} />}
              <ul className="independent-chip-list independent-chip-list--small">
                {question.lessonIds.map((lessonId) => <li key={lessonId}>{getLessonTitles([lessonId], curriculum)[0] ?? lessonId}</li>)}
              </ul>
            </div>

            <div className="independent-solution-answer">
              <span className="independent-solution-label">الإجابة الصحيحة</span>
              <div className="independent-answer-value"><RichContentView content={solution.answer} /></div>
            </div>

            <div className="independent-solution-block">
              <h3>الفكرة الرياضية</h3>
              <p><RichContentView content={solution.idea} /></p>
            </div>

            <div className="independent-solution-block">
              <h3>خطوات الحل</h3>
              <ol className="independent-steps">
                {solution.steps.map((step, index) => <li key={index}><RichContentView content={step} /></li>)}
              </ol>
            </div>

            <div className="independent-solution-why">
              <h3>لماذا وصلنا إلى هذه النتيجة؟</h3>
              <p><RichContentView content={solution.why} /></p>
            </div>
          </article>
        </li>
      })}
    </ol>

    <div className="independent-end-note">
      <p>هذه كل حلول الاختبار رقم {test.number}. يمكنك الانتقال إلى الاختبار أو إلى قائمة الاختبارات.</p>
      <div className="independent-end-actions">
        <a className="independent-secondary-button" href={independentTestHref(test.number)}>فتح أسئلة الاختبار</a>
        <a className="independent-secondary-button" href={independentTestsHref()}>كل الاختبارات</a>
      </div>
    </div>
  </section>
}

function IndependentTableView({ table }: { table: IndependentTable }) {
  return <div className="independent-table-wrap">
    <table className="independent-table">
      {table.caption && <caption><RichContentView content={table.caption} /></caption>}
      <thead>
        <tr>{table.columns.map((column, index) => <th scope="col" key={index}><RichContentView content={column} /></th>)}</tr>
      </thead>
      <tbody>
        {table.rows.map((row, rowIndex) => <tr key={rowIndex}>
          {row.map((cell, cellIndex) => cellIndex === 0
            ? <th scope="row" key={cellIndex}><RichContentView content={cell} /></th>
            : <td key={cellIndex}><RichContentView content={cell} /></td>)}
        </tr>)}
      </tbody>
    </table>
  </div>
}

function MissingTest({ level = 1 }: { level?: 1 | 2 }) {
  const Heading = level === 1 ? 'h1' : 'h2'
  return <section className="independent-section" aria-labelledby="independent-missing-test">
    <div className="independent-empty" role="status">
      <span className="independent-empty-icon"><FileQuestion size={24} aria-hidden="true" /></span>
      <div>
        <Heading id="independent-missing-test">هذا الاختبار غير موجود</Heading>
        <p>لم يُعثر على اختبار مستقل بهذا الرقم. قد يكون الرابط قديماً أو غير صالح.</p>
        <a className="independent-primary-button" href={independentTestsHref()}>العودة إلى الاختبارات</a>
      </div>
    </div>
  </section>
}

function MissingRoute() {
  return <section className="independent-section" aria-labelledby="independent-missing-route">
    <div className="independent-empty" role="status">
      <span className="independent-empty-icon"><FileQuestion size={24} aria-hidden="true" /></span>
      <div>
        <h1 id="independent-missing-route">هذا المسار غير صالح</h1>
        <p>تعذّر تحديد تبويب أو اختبار لهذا الرابط.</p>
        <a className="independent-primary-button" href={independentTestsHref()}>العودة إلى قسم الاختبارات</a>
      </div>
    </div>
  </section>
}

function getLessonTitles(lessonIds: readonly string[], curriculum: readonly UnitMeta[]): string[] {
  const titles = new Map<string, string>()
  for (const unit of curriculum) {
    for (const lesson of unitLessons(unit)) titles.set(lesson.id, lesson.title)
  }
  return lessonIds.map((lessonId) => titles.get(lessonId) ?? lessonId)
}
