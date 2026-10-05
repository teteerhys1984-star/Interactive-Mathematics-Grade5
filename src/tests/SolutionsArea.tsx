import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, BookOpenCheck, ChevronLeft } from 'lucide-react'
import { getTestDisplayMetadata } from './catalog'
import { getSolutionGroups } from './solutionGroups'
import { testRunHref, testSolutionsHref } from './routing'
import { RichContentView } from './RichContentView'
import type { TestAreaRoute } from './routing'
import type { UnitMeta } from '../types'
import type { TestDefinition } from './types'

interface SolutionsAreaProps {
  route: Extract<TestAreaRoute, { kind: 'solutions-list' | 'solution-group' }>
  catalogBlocked: boolean
  curriculum: readonly UnitMeta[]
  tests: readonly TestDefinition[]
  selectedTest?: TestDefinition
}

export function SolutionsArea({ route, catalogBlocked, curriculum, tests, selectedTest }: SolutionsAreaProps) {
  if (route.kind === 'solutions-list') {
    return <section className="test-area-section" aria-labelledby="solutions-heading">
      <PageEyebrow>مستقلة عن مساحة المدرّس</PageEyebrow>
      <h1 id="solutions-heading" className="test-area-title">حلول الاختبارات</h1>
      <p className="test-area-lead">اعرض الحلول التعليمية المرتبطة بتعريف كل اختبار، مرتبةً بأرقام أسئلته الفعلية.</p>
      {tests.length === 0
        ? <EmptySolutionsState catalogBlocked={catalogBlocked} />
        : <ol className="test-card-list">
            {tests.map((test) => {
              const metadata = getTestDisplayMetadata(test, curriculum)
              return <li key={test.id}>
                <article className="test-list-card">
                  <div className="test-list-card-copy">
                    <span className="test-card-context">{metadata.context}</span>
                    <h2>{metadata.title}</h2>
                    <p className="test-card-scope">{metadata.scope}</p>
                    <p className="test-card-count">{test.questions.length} سؤالاً مع حلول مرتبطة به</p>
                  </div>
                  <a className="test-primary-button" href={testSolutionsHref(test.id, 1)}>عرض الحلول <ArrowLeft size={17} aria-hidden="true" /></a>
                </article>
              </li>
            })}
          </ol>}
    </section>
  }

  if (!selectedTest || catalogBlocked) {
    return <UnavailableSolutionsState />
  }

  const groups = getSolutionGroups(selectedTest)
  const group = groups.find((candidate) => candidate.groupNumber === route.groupNumber)
  if (!group) return <UnavailableSolutionsState />

  const metadata = getTestDisplayMetadata(selectedTest, curriculum)
  const groupCount = groups.length
  const progress = Math.round((group.groupNumber / groupCount) * 100)

  return <section className="solution-reader" aria-labelledby="solution-reader-title">
    <nav className="test-breadcrumbs" aria-label="مسار الحلول">
      <a href="#tests">منطقة الاختبارات</a><ChevronLeft size={15} aria-hidden="true" />
      <a href="#tests/solutions">حلول الاختبارات</a><ChevronLeft size={15} aria-hidden="true" />
      <span aria-current="page">{metadata.title}</span>
    </nav>
    <header className="solution-reader-heading">
      <a className="test-back-link" href="#tests/solutions"><ArrowRight size={17} aria-hidden="true" /> قائمة الحلول</a>
      <span className="test-card-context">{metadata.context}</span>
      <h1 id="solution-reader-title">{metadata.title}</h1>
      <p>{metadata.scope}</p>
      {groupCount > 1 && <div className="solution-progress">
        <div className="solution-progress-label"><span>المجموعة {group.groupNumber} من {groupCount}</span><span>الأسئلة {group.firstQuestionNumber}–{group.lastQuestionNumber}</span></div>
        <div role="progressbar" aria-label="التقدم بين مجموعات الحلول" aria-valuemin={1} aria-valuemax={groupCount} aria-valuenow={group.groupNumber} aria-valuetext={`المجموعة ${group.groupNumber} من ${groupCount}`}><span style={{ width: `${progress}%` }} /></div>
      </div>}
    </header>

    <div className="solution-question-list">
      {group.questions.map(({ question, questionNumber }) => <article className="solution-question-card" key={question.id} aria-labelledby={`solution-question-${question.id}`}>
        <div className="solution-question-number">السؤال {questionNumber}</div>
        <h2 id={`solution-question-${question.id}`} className="solution-question-prompt"><RichContentView content={question.prompt} /></h2>
        <div className="solution-body">
          {question.solution.idea.length > 0 && <section><h3>الفكرة</h3><p><RichContentView content={question.solution.idea} /></p></section>}
          {question.solution.rule && question.solution.rule.length > 0 && <section><h3>القاعدة</h3><p><RichContentView content={question.solution.rule} /></p></section>}
          {question.solution.steps.length > 0 && <section>
            <h3>خطوات الحل</h3>
            <ol>{question.solution.steps.map((step, index) => <li key={`${question.id}-step-${index}`}><RichContentView content={step} /></li>)}</ol>
          </section>}
          {question.solution.finalAnswer.length > 0 && <section className="solution-final-answer"><h3>الإجابة النهائية</h3><p><RichContentView content={question.solution.finalAnswer} /></p></section>}
          {question.solution.commonError && question.solution.commonError.length > 0 && <section className="solution-common-error"><h3>تنبيه من خطأ شائع</h3><p><RichContentView content={question.solution.commonError} /></p></section>}
        </div>
      </article>)}
    </div>

    <nav className="solution-group-navigation" aria-label="التنقل بين مجموعات الحلول">
      {groupCount > 1
        ? group.groupNumber === 1
          ? <button type="button" className="test-secondary-button" disabled><ArrowRight size={17} aria-hidden="true" /> المجموعة السابقة</button>
          : <a className="test-secondary-button" href={testSolutionsHref(selectedTest.id, group.groupNumber - 1)}><ArrowRight size={17} aria-hidden="true" /> المجموعة السابقة</a>
        : <span className="solution-single-group"><BookOpenCheck size={17} aria-hidden="true" /> مجموعة واحدة</span>}
      <span className="solution-navigation-status">الأسئلة {group.firstQuestionNumber}–{group.lastQuestionNumber} من {selectedTest.questions.length}</span>
      {groupCount > 1 && (group.groupNumber === groupCount
        ? <button type="button" className="test-primary-button" disabled>المجموعة التالية <ArrowLeft size={17} aria-hidden="true" /></button>
        : <a className="test-primary-button" href={testSolutionsHref(selectedTest.id, group.groupNumber + 1)}>المجموعة التالية <ArrowLeft size={17} aria-hidden="true" /></a>)}
    </nav>
    <div className="solution-return-links">
      <a className="test-text-link" href={testRunHref(selectedTest.id)}>فتح الاختبار</a>
      <a className="test-text-link" href="#tests">العودة إلى منطقة الاختبارات</a>
    </div>
  </section>
}

function PageEyebrow({ children }: { children: ReactNode }) {
  return <p className="test-area-eyebrow">{children}</p>
}

function EmptySolutionsState({ catalogBlocked }: { catalogBlocked: boolean }) {
  return <div className="test-empty-state">
    <span className="test-empty-icon"><BookOpenCheck size={24} aria-hidden="true" /></span>
    <div>
      <h2>{catalogBlocked ? 'لا يمكن عرض الحلول حالياً' : 'لا توجد حلول اختبارات متاحة حالياً'}</h2>
      <p>{catalogBlocked
        ? 'سياسة السجل الحالية تمنع عرض تعريفات الاختبارات المكتشفة في هذا الوضع.'
        : 'ستظهر الحلول هنا عندما تتوفر اختبارات مؤهلة في السجل.'}</p>
    </div>
  </div>
}

function UnavailableSolutionsState() {
  return <div className="test-empty-state" role="status">
    <span className="test-empty-icon"><BookOpenCheck size={24} aria-hidden="true" /></span>
    <div>
      <h1>الحلول غير متاحة</h1>
      <p>لم يُعثر على اختبار مؤهل أو مجموعة حلول صالحة لهذا المسار.</p>
      <a className="test-text-link" href="#tests/solutions">العودة إلى قائمة الحلول</a>
    </div>
  </div>
}
