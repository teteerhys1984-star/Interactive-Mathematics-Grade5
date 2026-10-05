/**
 * jsdom interaction checks for the generic runner/Solutions experience and production
 * discovery, attempt lifecycle, submit-only scoring, and submitted-only Solutions access. Synthetic
 * definitions stay under scripts/ and outside the Vite glob.
 */
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import type { ComponentType } from 'react'
import type { AppProps } from '../src/App'
import { curriculumRegistry } from '../src/content/registry'
import type { UnitMeta } from '../src/types'
import { DIFFICULTIES, QUESTION_TYPES, type ChoiceOption, type Difficulty, type QuestionDefinition, type QuestionType, type RichContent, type TestBlueprint, type TestDefinition } from '../src/tests/types'
import type { TestRegistrySnapshot } from '../src/tests/registry'
import { parseTestAreaRoute } from '../src/tests/routing'

const fixtureUnit: UnitMeta = {
  id: 'ui-fixture-unit',
  title: 'وحدة اصطناعية للاختبار',
  description: 'بيانات اختبار واجهة فقط.',
  accent: 'blue',
  status: 'complete',
  lessons: [{ id: 'ui-fixture-lesson', title: 'درس اصطناعي للواجهة', availability: 'available' }],
}

const lessonTest = makeTestQuestions('lesson-ui-fixture-lesson-test', 'lesson', 20)
const unitTest = makeTestQuestions('unit-ui-fixture-unit-test', 'unit', 50)
const comprehensiveTest = makeTestQuestions('comprehensive-ui-fixture-test', 'comprehensive', 8)
const fixtureDefinitions: readonly TestDefinition[] = [unitTest, comprehensiveTest, lessonTest]

function rich(text: string): RichContent {
  return [{ kind: 'text', text }]
}

function option(id: string, label: string): ChoiceOption {
  return { id, label: rich(label) }
}

function makeQuestion(testId: string, ordinal: number, type: QuestionType, difficultyOverride?: Difficulty): QuestionDefinition {
  const questionId = `${testId}-q-${String(ordinal).padStart(2, '0')}`
  const common = {
    id: questionId,
    testId,
    prompt: ordinal === 1
      ? [{ kind: 'text', text: 'ما ناتج ' }, { kind: 'math', text: '3 × 4' }, { kind: 'text', text: '؟' }] as const
      : rich(`سؤال اصطناعي ${ordinal}`),
    difficulty: difficultyOverride ?? DIFFICULTIES[(ordinal - 1) % DIFFICULTIES.length] as Difficulty,
    concepts: ['ui-fixture-concept'],
    skills: ['ui-fixture-skill'],
    sourceConcepts: ['ui-fixture-source'],
    coverage: { lessonIds: ['ui-fixture-lesson'], applications: [], thinking: [], commonErrors: [] },
    solution: {
      idea: rich(`فكرة حل اصطناعية للسؤال ${ordinal}.`),
      ...(ordinal === 1 ? { rule: rich('قاعدة اختبارية اصطناعية.') } : {}),
      steps: [rich(`خطوة اصطناعية للسؤال ${ordinal}.`)],
      finalAnswer: rich(`إجابة اصطناعية للسؤال ${ordinal}.`),
      ...(ordinal === 8 ? { commonError: rich('خطأ اصطناعي شائع لأغراض اختبار العرض.') } : {}),
    },
    originalityNote: 'Synthetic UI fixture only; not curriculum content.',
  }

  switch (type) {
    case 'single-choice':
      return { ...common, type, options: [option('choice-a', 'الاختيار أ'), option('choice-b', 'الاختيار ب'), option('choice-c', 'الاختيار ج')], answer: 'choice-b' }
    case 'true-false':
      return { ...common, type, answer: false }
    case 'multi-select':
      return { ...common, type, options: [option('multi-a', 'خيار أ'), option('multi-b', 'خيار ب'), option('multi-c', 'خيار ج')], answer: ['multi-a', 'multi-c'] }
    case 'numeric':
      return { ...common, type, answer: { expected: '12.05', tolerance: '0.05', format: 'decimal', unitPolicy: { kind: 'required', acceptedUnits: ['cm', 'سم'] } } }
    case 'fraction':
      return { ...common, type, answer: { numerator: '1', denominator: '2', equivalentForms: 'accept', allowDecimalEquivalent: true } }
    case 'ordering':
      return { ...common, type, items: [option('order-a', 'الترتيب أ'), option('order-b', 'الترتيب ب'), option('order-c', 'الترتيب ج')], answer: ['order-b', 'order-a', 'order-c'] }
    case 'matching':
      return {
        ...common,
        type,
        left: [option('left-a', 'البند أ'), option('left-b', 'البند ب')],
        right: [option('right-a', 'مطابقة أ'), option('right-b', 'مطابقة ب')],
        answer: [{ leftId: 'left-a', rightId: 'right-b' }, { leftId: 'left-b', rightId: 'right-a' }],
      }
    case 'error-analysis':
      return {
        ...common,
        type,
        studentWork: rich('عمل اصطناعي معروض للطالب.'),
        diagnoses: [option('diagnosis-a', 'تشخيص أ'), option('diagnosis-b', 'تشخيص ب')],
        corrections: [option('correction-a', 'تصحيح أ'), option('correction-b', 'تصحيح ب')],
        answer: { diagnosisId: 'diagnosis-b', correctionId: 'correction-b' },
      }
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}

function makeTestQuestions(testId: string, type: TestDefinition['type'], count: number): TestDefinition {
  const lessonDifficulty = (ordinal: number): Difficulty => ordinal <= 6
    ? 'basic'
    : ordinal <= 13
      ? 'medium'
      : ordinal <= 17
        ? 'advanced'
        : 'thinking'
  const questions = Array.from({ length: count }, (_, index) => makeQuestion(
    testId,
    index + 1,
    index < QUESTION_TYPES.length ? QUESTION_TYPES[index] : 'true-false',
    type === 'lesson' ? lessonDifficulty(index + 1) : undefined,
  ))
  const blueprint = makeBlueprint(questions)
  const base = {
    id: testId,
    description: rich('تعريف اصطناعي لأغراض فحوص الواجهة فقط.'),
    instructions: rich('تعليمات اصطناعية لفحص مشغّل الاختبار.'),
    title: type === 'comprehensive' ? 'اختبار شامل اصطناعي' : type === 'unit' ? 'اختبار وحدة اصطناعي' : 'اختبار واجهة اصطناعي',
    questions,
    blueprint,
  }
  if (type === 'lesson') return { ...base, type, lessonId: 'ui-fixture-lesson' }
  if (type === 'unit') return { ...base, type, unitId: 'ui-fixture-unit' }
  return { ...base, type, title: 'اختبار شامل اصطناعي', scope: { unitIds: ['ui-fixture-unit'], lessonIds: [] } }
}

function makeBlueprint(questions: readonly QuestionDefinition[]): TestBlueprint {
  const difficultyDistribution = Object.fromEntries(DIFFICULTIES.map((difficulty) => [
    difficulty,
    questions.filter((question) => question.difficulty === difficulty).length,
  ])) as Record<Difficulty, number>
  const questionTypeDistribution = Object.fromEntries(QUESTION_TYPES.map((questionType) => [
    questionType,
    questions.filter((question) => question.type === questionType).length,
  ])) as Record<QuestionType, number>
  const questionIds = questions.map((question) => question.id)
  return {
    targetQuestionCount: questions.length,
    difficultyDistribution,
    questionTypeDistribution,
    sourceConceptInventory: [{
      id: 'ui-fixture-source',
      label: rich('مصدر اصطناعي لفحص الواجهة.'),
      references: [{ kind: 'lesson-content', lessonId: 'ui-fixture-lesson', reference: 'Synthetic fixture reference.' }],
    }],
    coverage: {
      concepts: [{ id: 'ui-fixture-concept', label: rich('مفهوم اصطناعي.'), questionIds }],
      skills: [{ id: 'ui-fixture-skill', label: rich('مهارة اصطناعية.'), questionIds }],
      applications: [],
      thinking: [],
      commonErrors: [],
      lessons: [{ id: 'ui-fixture-lesson', label: rich('درس اصطناعي.'), questionIds }],
    },
  }
}

function fail(message: string): never {
  throw new Error(`Test-area UI check failed: ${message}`)
}

async function main() {
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#tests',
    pretendToBeVisual: true,
  })
  const { window } = dom
  Object.assign(globalThis, {
    window,
    document: window.document,
    localStorage: window.localStorage,
    sessionStorage: window.sessionStorage,
    HTMLElement: window.HTMLElement,
    SVGElement: window.SVGElement,
    Node: window.Node,
    Event: window.Event,
    MouseEvent: window.MouseEvent,
    getComputedStyle: window.getComputedStyle,
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
    IS_REACT_ACT_ENVIRONMENT: true,
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })

  const vite = await createServer({ configFile: 'vite.config.ts', server: { middlewareMode: true }, appType: 'custom' })
  try {
    interface RegistryModule {
      createTestRegistry(units: readonly UnitMeta[], definitions: readonly unknown[], options: { coverageMode: 'strict' | 'infrastructure-only' }): TestRegistrySnapshot
      testRegistry: TestRegistrySnapshot
    }
    const registryModule = await vite.ssrLoadModule('/src/tests/registry.ts') as RegistryModule
    const registry = registryModule.createTestRegistry([fixtureUnit], fixtureDefinitions, { coverageMode: 'strict' })
    assert.equal(registry.report.valid, true, `Synthetic strict registry should pass: ${registry.issues.filter((issue) => issue.severity === 'error').map((issue) => issue.code).join(', ')}`)
    assert.equal(registry.lessonTests.length, 1)
    assert.equal(registry.unitTests.length, 1)
    assert.equal(registry.comprehensiveTests.length, 1)

    const React = await import('react')
    const { act } = React
    const { fireEvent, render, screen, within } = await import('@testing-library/react')
    const appModule = await vite.ssrLoadModule('/src/App.tsx') as { default: ComponentType<AppProps> }
    const App = appModule.default
    const navigate = (hash: string) => act(() => {
      window.location.hash = hash
      window.dispatchEvent(new window.Event('hashchange'))
    })

    let view = render(React.createElement(App, { testRegistry: registry, curriculum: [fixtureUnit] }))
    assert.ok(screen.getByRole('heading', { name: 'منطقة الاختبارات' }))
    assert.equal(screen.getAllByText('اختبار واحد متاح').length, 3)
    assert.ok(screen.getByText('حلول تعليمية مستقلة'))
    assert.ok(screen.getByRole('link', { name: /اختبارات الدروس/ }))
    console.log('✅ Synthetic registry appears dynamically in the three test categories and independent solutions entry.')

    navigate('#tests/lessons')
    assert.ok(screen.getByRole('heading', { name: 'اختبارات الدروس' }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار واجهة اصطناعي' }))
    assert.ok(screen.getByText('20 سؤالاً'))
    navigate('#tests/units')
    assert.ok(screen.getByRole('heading', { name: 'اختبارات الوحدات' }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار وحدة اصطناعي' }))
    assert.ok(screen.getByText('50 سؤالاً'))
    navigate('#tests/comprehensive')
    assert.ok(screen.getByRole('heading', { name: 'الاختبارات الشاملة' }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار شامل اصطناعي' }))
    navigate('#tests/run/not-a-registered-test')
    assert.ok(screen.getByRole('heading', { name: 'الاختبار غير موجود أو غير مؤهل' }))
    assert.equal(screen.queryByRole('progressbar', { name: 'موضعك في الاختبار' }), null)
    console.log('✅ Dynamic lesson/unit/comprehensive listings and safe not-found runner route pass.')

    // Production discovery is strict and covers exactly the seven available lesson tests.
    // Unit 1 remains unknown; no Unit Test or Comprehensive Test is inferred or rendered.
    const productionRegistry = registryModule.testRegistry
    assert.equal(productionRegistry.report.coverageMode, 'strict')
    assert.equal(productionRegistry.report.valid, true, JSON.stringify(productionRegistry.issues, null, 2))
    assert.equal(productionRegistry.lessonTests.length, 7)
    assert.equal(productionRegistry.unitTests.length, 0)
    assert.equal(productionRegistry.comprehensiveTests.length, 0)
    assert.equal(productionRegistry.discoveredDefinitionCount, 7)
    assert.equal(curriculumRegistry.find((unit) => unit.id === 'unit-1')?.status, 'unknown')
    assert.equal(productionRegistry.getTestById('unit-unit-1-test'), undefined)
    assert.equal(productionRegistry.getTestById('comprehensive-unit-1-test'), undefined)

    view.unmount()
    navigate('#tests')
    view = render(React.createElement(App, { testRegistry: productionRegistry, curriculum: curriculumRegistry }))
    assert.ok(screen.getByRole('heading', { name: 'منطقة الاختبارات' }))
    assert.ok(screen.getByText('7 اختبارات متاحة'))
    assert.equal(screen.getAllByText('لا توجد اختبارات مؤهلة حالياً').length, 2)

    navigate('#tests/lessons')
    assert.ok(screen.getByRole('heading', { name: 'اختبارات الدروس' }))
    assert.equal(screen.getAllByText('20 سؤالاً').length, 7)
    for (const test of productionRegistry.lessonTests) {
      assert.ok(screen.getByRole('heading', { name: test.title }), `Production lesson test was not listed: ${test.id}`)
    }
    assert.equal(screen.getAllByRole('link', { name: 'ابدأ الاختبار' }).length, 7)

    navigate('#tests/units')
    assert.ok(screen.getByRole('heading', { name: 'اختبارات الوحدات' }))
    assert.ok(screen.getByRole('heading', { name: 'لا توجد اختبارات وحدات مؤهلة حالياً' }))
    assert.equal(screen.queryByRole('link', { name: /ابدأ الاختبار/ }), null)
    navigate('#tests/comprehensive')
    assert.ok(screen.getByRole('heading', { name: 'الاختبارات الشاملة' }))
    assert.ok(screen.getByRole('heading', { name: 'لا توجد اختبارات شاملة مؤهلة حالياً' }))
    assert.equal(screen.queryByRole('link', { name: /ابدأ الاختبار/ }), null)

    // Fresh-session Solutions routes must not expose any production answer key before a submit.
    navigate('#tests/solutions')
    assert.ok(screen.getByRole('heading', { name: 'حلول الاختبارات' }))
    assert.ok(screen.getByRole('heading', { name: 'تظهر الحلول بعد تسليم الاختبار' }))
    assert.equal(screen.queryByRole('heading', { name: 'الفكرة' }), null)
    assert.equal(screen.queryByRole('heading', { name: 'الإجابة النهائية' }), null)
    navigate('#tests/solutions/lesson-coordinates-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول غير متاحة قبل التسليم' }))
    assert.ok(screen.getByRole('link', { name: 'فتح الاختبار' }))
    assert.equal(screen.queryByRole('heading', { name: 'الفكرة' }), null)

    // Every real lesson definition opens directly through the same generic route and 20-question runner.
    for (const test of productionRegistry.lessonTests) {
      assert.equal(test.type, 'lesson')
      const lesson = curriculumRegistry.flatMap((unit) => unit.lessons).find((candidate) => candidate.id === test.lessonId)
      const expectedTitle = test.title ?? (lesson ? `اختبار ${lesson.title}` : 'اختبار الدرس')
      navigate(`#tests/run/${test.id}`)
      assert.ok(screen.getByRole('heading', { name: expectedTitle }), `Wrong runner title for ${test.id}`)
      const progress = screen.getByRole('progressbar', { name: 'موضعك في الاختبار' })
      assert.equal(progress.getAttribute('aria-valuemax'), '20', `${test.id} runner must open all 20 questions`)
      assert.equal(progress.getAttribute('aria-valuenow'), '1', `${test.id} must start at question one`)
      assert.equal(screen.queryByRole('heading', { name: 'نتيجة الاختبار' }), null)
    }
    navigate('#tests/run/unregistered-production-test')
    assert.ok(screen.getByRole('heading', { name: 'الاختبار غير موجود أو غير مؤهل' }))
    assert.equal(screen.queryByRole('progressbar', { name: 'موضعك في الاختبار' }), null)
    console.log('✅ Strict production Registry lists all seven real lesson tests; Unit 1 stays unknown, with no Unit or Comprehensive Test.')
    console.log('✅ Fresh Solutions are gated, all seven test IDs open the generic 20-question Runner directly, and an invalid ID is safe.')

    // Exercise an actual discovered production definition through the generic runner.
    const productionLesson = productionRegistry.getTestById('lesson-coordinates-test')
    assert.ok(productionLesson)
    assert.equal(productionLesson.questions.length, 20)
    navigate('#tests/run/lesson-coordinates-test')
    view.unmount()
    view = render(React.createElement(App, { testRegistry: productionRegistry, curriculum: curriculumRegistry }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار الإحداثيات والزوج المرتب' }))
    assert.equal(screen.getByRole('progressbar', { name: 'موضعك في الاختبار' }).getAttribute('aria-valuemax'), '20')
    assert.ok(screen.getByText(/تُسجّل بطاقة الشبكة/))
    fireEvent.click(screen.getByRole('radio', { name: '(2,5)' }))
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    assert.ok(screen.getByText(/إذا كان للنقطتين/))
    fireEvent.click(screen.getByRole('radio', { name: 'صحيح' }))
    assert.equal(screen.queryByRole('heading', { name: 'نتيجة الاختبار' }), null)

    // Both independently routed Solutions pages stay locked during the real production attempt.
    navigate('#tests/solutions')
    assert.ok(screen.getByRole('heading', { name: 'الحلول مخفية حتى تسليم المحاولة' }))
    assert.equal(screen.queryByRole('heading', { name: 'حلول الاختبارات' }), null)
    const returnToProductionAttempt = screen.getByRole('link', { name: /متابعة: اختبار الإحداثيات والزوج المرتب/ })
    assert.equal(returnToProductionAttempt.getAttribute('href'), '#tests/run/lesson-coordinates-test')
    navigate('#tests/solutions/lesson-coordinates-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول مخفية حتى تسليم المحاولة' }))
    assert.equal(screen.queryByRole('heading', { name: 'الإجابة النهائية' }), null)
    assert.ok(screen.getByRole('link', { name: /متابعة: اختبار الإحداثيات والزوج المرتب/ }))
    navigate('#tests/run/lesson-coordinates-test')
    assert.equal((screen.getByRole('radio', { name: 'صحيح' }) as HTMLInputElement).checked, true)
    assert.equal(screen.queryByRole('heading', { name: 'نتيجة الاختبار' }), null)

    // Submit this real definition only after confirmation; the two saved answers score correctly.
    fireEvent.click(screen.getByText(/قائمة الأسئلة/))
    fireEvent.click(screen.getByRole('button', { name: 'السؤال 20، بلا إجابة' }))
    const productionNavigation = screen.getByRole('navigation', { name: 'التنقل بين أسئلة الاختبار' })
    fireEvent.click(within(productionNavigation).getByRole('button', { name: 'تسليم الاختبار' }))
    const productionDialog = screen.getByRole('dialog', { name: 'هل تريد تسليم الاختبار؟' })
    assert.ok(Array.from(productionDialog.querySelectorAll('.test-submit-summary p')).some((paragraph) => paragraph.textContent?.includes('18 بلا إجابة')))
    assert.equal(screen.queryByRole('heading', { name: 'نتيجة الاختبار' }), null)
    fireEvent.click(within(productionDialog).getByRole('button', { name: 'تسليم الاختبار' }))
    assert.ok(screen.getByRole('heading', { name: 'نتيجة الاختبار' }))
    assert.deepEqual(Array.from(document.querySelectorAll('.test-score-display strong')).map((node) => node.textContent), ['2', '20'])
    assert.deepEqual(Array.from(document.querySelectorAll('.test-result-breakdown dd')).map((node) => node.textContent), ['2', '0', '18'])

    // After submit, the independently routed Solutions listing and real answer groups are available.
    navigate('#tests/solutions')
    assert.ok(screen.getByRole('heading', { name: 'حلول الاختبارات' }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار الإحداثيات والزوج المرتب' }))
    for (const test of productionRegistry.lessonTests.filter((candidate) => candidate.id !== productionLesson.id)) {
      assert.equal(screen.queryByRole('heading', { name: test.title }), null, `Unsubmitted test ${test.id} leaked into the Solutions listing`)
    }
    navigate('#tests/solutions/lesson-natural-numbers-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول غير متاحة قبل التسليم' }))
    assert.equal(screen.queryByRole('heading', { name: 'الفكرة' }), null)
    assert.ok(screen.getByRole('link', { name: 'فتح الاختبار' }))
    navigate('#tests/solutions/lesson-coordinates-test/1')
    assert.ok(screen.getByText('الأسئلة 1–5 من 20'))
    assert.ok(screen.getByRole('heading', { name: /تُسجّل بطاقة الشبكة/ }))
    assert.equal(screen.getAllByRole('heading', { name: 'الفكرة' }).length, 5)
    assert.equal(screen.getAllByRole('heading', { name: 'خطوات الحل' }).length, 5)
    assert.equal(screen.getAllByRole('heading', { name: 'الإجابة النهائية' }).length, 5)
    assert.ok(screen.getByText(/الزوج المرتب يكتب قيمة المحور الأفقي/))
    navigate('#tests/solutions/lesson-coordinates-test/2')
    assert.ok(screen.getByText('الأسئلة 6–10 من 20'))

    // Restart clears the real attempt and restores the pre-submit Solutions lock.
    navigate('#tests/run/lesson-coordinates-test')
    assert.ok(screen.getByRole('heading', { name: 'نتيجة الاختبار' }))
    fireEvent.click(screen.getByRole('button', { name: 'إعادة الاختبار' }))
    assert.equal(screen.getByText('0 مجاب عنها').textContent, '0 مجاب عنها')
    assert.equal((screen.getByRole('radio', { name: '(2,5)' }) as HTMLInputElement).checked, false)
    navigate('#tests/solutions/lesson-coordinates-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول مخفية حتى تسليم المحاولة' }))
    navigate('#tests/run/lesson-coordinates-test')
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    assert.equal((screen.getByRole('radio', { name: 'صحيح' }) as HTMLInputElement).checked, false)
    console.log('✅ Real production Runner preserves answers, withholds Solutions until confirmed submission, scores correctly, shows post-submit Solutions, and resets on restart.')

    // Direct hash routing: malformed test paths are handled without exceptions.
    assert.deepEqual(parseTestAreaRoute('#tests/run/%E0%A4%A'), { kind: 'not-found', hash: '#tests/run/%E0%A4%A' })
    assert.deepEqual(parseTestAreaRoute('#tests/solutions/comprehensive-ui-fixture-test/0'), { kind: 'not-found', hash: '#tests/solutions/comprehensive-ui-fixture-test/0' })
    assert.deepEqual(parseTestAreaRoute('#tests/solutions/comprehensive-ui-fixture-test/999'), { kind: 'solution-group', testId: 'comprehensive-ui-fixture-test', groupNumber: 999 })
    console.log('✅ Hash parser handles malformed IDs and numeric solution groups safely.')

    // Mount the synthetic runner directly at its hash route and exercise each discriminated type.
    navigate('#tests/run/lesson-ui-fixture-lesson-test')
    view.unmount()
    view = render(React.createElement(App, { testRegistry: registry, curriculum: [fixtureUnit] }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار واجهة اصطناعي' }))
    const progress = screen.getByRole('progressbar', { name: 'موضعك في الاختبار' })
    assert.equal(progress.getAttribute('aria-valuemax'), '20')
    assert.ok(document.querySelector('.test-question-prompt .math-expression[dir="ltr"]'))
    assert.ok(screen.getByRole('radio', { name: 'الاختيار أ' }))
    assert.equal(screen.queryByRole('heading', { name: 'نتيجة الاختبار' }), null)
    assert.equal(screen.queryByRole('heading', { name: 'الإجابة النهائية' }), null)

    fireEvent.click(screen.getByRole('radio', { name: 'الاختيار ب' }))
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    fireEvent.click(screen.getByRole('radio', { name: 'خطأ' }))
    fireEvent.click(screen.getByRole('button', { name: 'السابق' }))
    assert.equal((screen.getByRole('radio', { name: 'الاختيار ب' }) as HTMLInputElement).checked, true)
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))

    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'خيار أ' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'خيار ج' }))
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    const numericInput = screen.getByLabelText('اكتب القيمة والوحدة عند طلبها')
    fireEvent.change(numericInput, { target: { value: '12.05 cm' } })
    assert.equal((numericInput as HTMLInputElement).value, '12.05 cm')
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))

    fireEvent.click(screen.getByRole('radio', { name: 'عدد عشري' }))
    const decimalInput = screen.getByLabelText('العدد العشري')
    fireEvent.change(decimalInput, { target: { value: '0.5' } })
    fireEvent.click(screen.getByRole('radio', { name: 'كسر' }))
    fireEvent.change(screen.getByLabelText('البسط'), { target: { value: '1' } })
    const denominator = screen.getByLabelText('المقام')
    fireEvent.change(denominator, { target: { value: '0' } })
    assert.equal((denominator as HTMLInputElement).value, '')
    assert.ok(screen.getByText('لا يمكن أن يكون المقام صفراً.'))
    fireEvent.change(denominator, { target: { value: '2' } })
    assert.equal((denominator as HTMLInputElement).value, '2')
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))

    fireEvent.click(screen.getByRole('button', { name: 'رفع العنصر 2' }))
    assert.equal(screen.getByText('الترتيب ب').closest('li')?.querySelector('.test-order-position')?.textContent, '1')
    fireEvent.click(screen.getByRole('button', { name: 'اعتماد الترتيب الحالي' }))
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    const matchingRows = document.querySelectorAll('.test-match-row')
    fireEvent.click(within(matchingRows[0]).getByRole('radio', { name: 'مطابقة ب' }))
    fireEvent.click(within(matchingRows[1]).getByRole('radio', { name: 'مطابقة أ' }))
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
    fireEvent.click(screen.getByRole('radio', { name: 'تشخيص ب' }))
    fireEvent.click(screen.getByRole('radio', { name: 'تصحيح ب' }))

    const questionMapSummary = screen.getByText(/قائمة الأسئلة/)
    fireEvent.click(questionMapSummary)
    fireEvent.click(screen.getByRole('button', { name: 'السؤال 20، بلا إجابة' }))
    assert.equal(screen.queryByRole('heading', { name: 'نتيجة الاختبار' }), null)
    const questionNav = screen.getByRole('navigation', { name: 'التنقل بين أسئلة الاختبار' })
    const submitButton = within(questionNav).getByRole('button', { name: 'تسليم الاختبار' })
    submitButton.focus()
    fireEvent.click(submitButton)
    const submitDialog = screen.getByRole('dialog', { name: 'هل تريد تسليم الاختبار؟' })
    assert.ok(Array.from(submitDialog.querySelectorAll('.test-submit-summary p')).some((paragraph) => paragraph.textContent?.includes('ما زال هناك 12 بلا إجابة')))
    const dialogButtons = within(submitDialog).getAllByRole('button')
    assert.equal(document.activeElement, dialogButtons[0])
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab', shiftKey: true })
    assert.equal(document.activeElement, dialogButtons[dialogButtons.length - 1])
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' })
    assert.equal(screen.queryByRole('dialog', { name: 'هل تريد تسليم الاختبار؟' }), null)
    assert.equal(document.activeElement, submitButton)

    fireEvent.click(submitButton)
    fireEvent.click(within(screen.getByRole('dialog', { name: 'هل تريد تسليم الاختبار؟' })).getByRole('button', { name: 'مراجعة الأسئلة غير المجابة' }))
    assert.ok(screen.getByRole('heading', { name: /سؤال اصطناعي 9/ }))
    fireEvent.click(screen.getByRole('button', { name: 'السؤال 20، بلا إجابة' }))
    fireEvent.click(within(screen.getByRole('navigation', { name: 'التنقل بين أسئلة الاختبار' })).getByRole('button', { name: 'تسليم الاختبار' }))
    fireEvent.click(within(screen.getByRole('dialog', { name: 'هل تريد تسليم الاختبار؟' })).getByRole('button', { name: 'تسليم الاختبار' }))

    assert.ok(screen.getByRole('heading', { name: 'نتيجة الاختبار' }))
    assert.equal(screen.getByText('8', { selector: '.test-result-breakdown dd' }).textContent, '8')
    assert.equal(screen.getByText('12', { selector: '.test-result-breakdown dd' }).textContent, '12')
    assert.ok(screen.getByRole('link', { name: 'عرض الحلول' }))
    console.log('✅ Runner supports all 8 question types, preserves draft answers, blocks zero denominators, confirms incomplete submission, and scores only on confirmation.')

    // Solutions are defined by each test, split by one stable size rule, and use actual question numbers.
    navigate('#tests/solutions')
    assert.ok(screen.getByRole('heading', { name: 'حلول الاختبارات' }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار واجهة اصطناعي' }))
    assert.equal(screen.queryByRole('heading', { name: 'اختبار وحدة اصطناعي' }), null)
    assert.equal(screen.queryByRole('heading', { name: 'اختبار شامل اصطناعي' }), null)
    navigate('#tests/solutions/lesson-ui-fixture-lesson-test/1')
    assert.ok(screen.getByText('الأسئلة 1–5 من 20'))
    assert.ok(screen.getByRole('button', { name: /المجموعة السابقة/ }).hasAttribute('disabled'))
    assert.equal(screen.queryByRole('heading', { name: /السؤال 6/ }), null)
    navigate('#tests/solutions/lesson-ui-fixture-lesson-test/2')
    assert.ok(screen.getByText('الأسئلة 6–10 من 20'))
    assert.ok(screen.getByRole('heading', { name: 'سؤال اصطناعي 6' }))
    assert.equal(screen.getAllByRole('heading', { name: 'الفكرة' }).length, 5)
    assert.equal(screen.queryByRole('heading', { name: 'القاعدة' }), null)
    assert.equal(screen.getAllByRole('heading', { name: 'خطوات الحل' }).length, 5)
    assert.equal(screen.getAllByRole('heading', { name: 'الإجابة النهائية' }).length, 5)
    assert.ok(screen.getByRole('heading', { name: 'تنبيه من خطأ شائع' }))
    navigate('#tests/solutions/lesson-ui-fixture-lesson-test/4')
    assert.ok(screen.getByText('الأسئلة 16–20 من 20'))
    assert.ok(screen.getByRole('button', { name: /المجموعة التالية/ }).hasAttribute('disabled'))
    navigate('#tests/solutions/comprehensive-ui-fixture-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول غير متاحة قبل التسليم' }))
    assert.equal(screen.queryByRole('navigation', { name: 'التنقل بين مجموعات الحلول' }), null)
    navigate('#tests/solutions/lesson-ui-fixture-lesson-test/999')
    assert.ok(screen.getByRole('heading', { name: 'الحلول غير متاحة' }))

    // Attempt memory survives the independent Solutions route; returning restores the submitted result.
    navigate('#tests/run/lesson-ui-fixture-lesson-test')
    assert.ok(screen.getByRole('heading', { name: 'نتيجة الاختبار' }))
    fireEvent.click(screen.getByRole('button', { name: 'إعادة الاختبار' }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار واجهة اصطناعي' }))
    assert.equal(screen.getByText('0 مجاب عنها').textContent, '0 مجاب عنها')
    assert.equal((screen.getByRole('radio', { name: 'الاختيار ب' }) as HTMLInputElement).checked, false)
    assert.equal(screen.queryByRole('heading', { name: 'نتيجة الاختبار' }), null)
    console.log('✅ Independent solutions listing/group routes, real question numbering, valid boundary navigation, result return, and restart clearing all pass.')

    view.unmount()
    console.log('\nAll Test Area jsdom checks passed, including Phase 3G integration and submitted-only Solutions access.')
  } catch (error) {
    console.error('Phase 3C/3D UI check hit an error before cleanup:', error)
    throw error
  } finally {
    await vite.close()
    dom.window.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
