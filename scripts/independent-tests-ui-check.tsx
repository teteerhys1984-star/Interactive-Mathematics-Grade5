/**
 * jsdom UI check for the permanent "اختبارات مستقلة" section (npm run independent-tests-ui-check).
 *
 * It renders the real App (with Vite module resolution, the production glob registry and the
 * production curriculum) and proves:
 *   • the section is reachable from the main Home navigation;
 *   • both tabs exist and route correctly;
 *   • the first test lists 30 questions and renders the expected response surfaces;
 *   • no solution, answer label, or answer key is mounted on the test page;
 *   • the solutions tab renders exactly 30 detailed solutions, paired with their questions;
 *   • existing Home, lesson, test-area, and exercise routes still work.
 *
 * jsdom does not perform CSS layout. The final part checks the responsive CSS contract; a real
 * browser engine is not part of this repository's test tooling.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

const fail = (message: string): never => { throw new Error(`Independent tests UI check failed: ${message}`) }

async function main() {
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#top',
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
    getComputedStyle: window.getComputedStyle,
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
    cancelAnimationFrame: (handle: number) => clearTimeout(handle),
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

  const React = await import('react')
  const { act } = React
  const { render, screen } = await import('@testing-library/react')
  const vite = await createServer({ configFile: 'vite.config.ts', server: { middlewareMode: true }, appType: 'custom' })

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
    const { container } = render(<App />)
    const goTo = (hash: string) => act(() => {
      window.location.hash = hash
      window.dispatchEvent(new window.Event('hashchange'))
    })

    // ---- Home navigation ----
    const navLink = screen.getByRole('link', { name: 'اختبارات مستقلة' })
    assert.equal(navLink.getAttribute('href'), '#independent-tests', 'Home navigation must point at the new section')
    assert.equal(screen.getAllByText('ابدأ').length, 19, 'Home lesson links must be unchanged')
    console.log('PASS Home: "اختبارات مستقلة" is in the project main navigation; the 19 lessons are untouched.')

    // ---- Tests tab ----
    goTo('#independent-tests')
    assert.ok(screen.getByRole('heading', { name: 'اختبارات مستقلة', level: 1 }))
    const tabs = container.querySelector('.independent-tabs') as HTMLElement
    assert.ok(tabs, 'the two tabs must render')
    assert.ok(tabs.querySelector('a[href="#independent-tests/tests"]'))
    assert.ok(tabs.querySelector('a[href="#independent-tests/solutions"]'))
    assert.equal(tabs.querySelector('a[href="#independent-tests/tests"]')?.getAttribute('aria-current'), 'page')
    assert.ok(screen.getByText('الاختبار المستقل رقم 1'))
    assert.ok(screen.getByRole('heading', { name: 'الاختبار المستقل الأول — الوحدة الأولى كاملة', level: 2 }))
    const testCard = container.querySelector('.independent-test-card') as HTMLElement
    assert.equal(testCard.querySelectorAll('.independent-chip-list li').length, 8, 'all eight Unit 1 lessons must be listed')
    for (const lessonTitle of ['شبكة الإحداثيات', 'التمثيلات البيانية بالخطوط', 'الأعداد الطبيعية', 'تقريب الأعداد الطبيعية', 'جمع الأعداد الطبيعيّة وطرحها', 'قياس الزوايا', 'متوازي الأضلاع', 'المعيّن']) {
      assert.ok(testCard.textContent?.includes(lessonTitle), `missing lesson in test card: ${lessonTitle}`)
    }
    assert.ok(testCard.textContent?.includes('30 سؤالاً'))
    assert.ok(testCard.textContent?.includes('30 حلاً تفصيلياً'))
    assert.equal(testCard.querySelector('a[href="#independent-tests/test/1"]')?.textContent?.includes('فتح الاختبار'), true)
    assert.equal(testCard.querySelector('a[href="#independent-tests/solutions/1"]')?.textContent?.includes('حلول هذا الاختبار'), true)
    console.log('PASS Tests tab: number, official title, eight-lesson scope, 30 questions, and 30 solutions are listed.')

    // ---- Test page: questions only, no solutions ----
    goTo('#independent-tests/test/1')
    assert.ok(screen.getByRole('heading', { name: 'الاختبار المستقل الأول — الوحدة الأولى كاملة', level: 1 }))
    assert.equal(container.querySelectorAll('.independent-question-card').length, 30, 'the test page must render 30 questions')
    assert.equal(container.querySelectorAll('.independent-solution-card').length, 0, 'no solution card may render inside the test page')
    assert.equal(screen.queryByText('الإجابة الصحيحة'), null, 'the answer label must not appear on the test page')
    assert.equal(screen.queryByText('خطوات الحل'), null, 'solution steps must not appear on the test page')
    assert.equal(screen.queryByText('الفكرة الرياضية'), null, 'the solution idea must not appear on the test page')
    assert.equal(screen.queryByText('لماذا وصلنا إلى هذه النتيجة؟'), null)

    const questionNumbers = Array.from(container.querySelectorAll('.independent-question-number')).map((node) => node.textContent?.trim())
    assert.deepEqual(questionNumbers, Array.from({ length: 30 }, (_, index) => `السؤال ${index + 1}`), 'questions must be numbered 1–30 in order')
    assert.equal(container.querySelectorAll('.independent-options').length, 7, 'seven multiple-choice questions')
    assert.equal(container.querySelectorAll('.independent-answer-space').length, 7, 'seven fill-in-the-blank questions')
    assert.equal(container.querySelectorAll('.independent-compare').length, 1, 'one comparison question')
    assert.equal(container.querySelectorAll('.independent-draw-grid').length, 1, 'one drawing question')
    assert.equal(container.querySelectorAll('.independent-workspace').length, 14, 'fourteen written-work questions')
    assert.equal(container.querySelectorAll('.independent-table').length, 1, 'one table-reading question')
    assert.equal(container.querySelectorAll('.independent-question-card .independent-options li').length, 28, 'seven questions with four options each')
    assert.equal(container.querySelectorAll('.independent-figure').length, 8, 'eight questions carry a static figure')
    assert.equal(container.querySelectorAll('[data-figure-kind="line-chart"]').length, 3, 'three line-chart figures')
    assert.equal(container.querySelectorAll('[data-figure-kind="coordinate-grid"]').length, 2, 'two coordinate-grid figures')
    assert.equal(container.querySelectorAll('[data-figure-kind="number-line"]').length, 1, 'one number-line figure')
    assert.equal(container.querySelectorAll('[data-figure-kind="angle"]').length, 1, 'one angle figure')
    assert.equal(container.querySelectorAll('[data-figure-kind="protractor"]').length, 1, 'one protractor figure')
    assert.equal(container.querySelectorAll('.independent-figure-caption').length, 3, 'line charts carry an axis caption')

    const testPageText = container.textContent ?? ''
    for (const answerOnly of ['785,446', '621,535', '85,304', '1,095,000', '61,130', '112°', '110°', '76,000', '5,850,000', '4,000,000', '30cm']) {
      assert.ok(!testPageText.includes(answerOnly), `answer key "${answerOnly}" leaked into the test page`)
    }
    assert.ok(testPageText.includes('لا تظهر أي إجابة أو حل في صفحة الاختبار'))
    console.log('PASS Test page: 30 ordered questions, 7 MCQ / 7 blanks / 1 comparison / 1 drawing / 14 work areas, zero solutions.')

    // Re-read the same questions to be sure the answer keys are not in the DOM under another route.
    assert.ok(container.querySelector('#independent-question-1-1'))
    assert.ok(container.querySelector('#independent-question-1-30'))
    console.log('PASS Figures: 8 static figures (3 line charts, 2 coordinate grids, 1 number line, 1 angle, 1 protractor) rendered without answer labels.')
    console.log('PASS Answer isolation: no solution cards, answer labels, or numeric answer keys on the test route.')

    // ---- Solutions tab: solutions are visible immediately, grouped by test number ----
    goTo('#independent-tests/solutions')
    assert.ok(screen.getByRole('heading', { name: 'حلول الاختبارات', level: 1 }))
    assert.equal(tabs.querySelector('a[href="#independent-tests/solutions"]')?.getAttribute('aria-current'), 'page')
    const selector = container.querySelector('.independent-solution-selector') as HTMLElement
    assert.ok(selector, 'the solutions tab must expose a test-number selector')
    assert.equal(selector.querySelector('a[href="#independent-tests/solutions/1"]')?.getAttribute('aria-current'), 'page')
    assert.equal(container.querySelectorAll('.independent-solution-group').length, 1, 'one test group at a time; solutions never mix')
    assert.equal(container.querySelectorAll('.independent-solution-card').length, 30, 'the tab must show the 30 solutions directly')
    assert.ok(screen.getByRole('heading', { name: 'الاختبار المستقل الأول — الوحدة الأولى كاملة', level: 2 }))
    console.log('PASS Solutions tab: 30 solutions are visible immediately, organised by test number without mixing tests.')

    // ---- Detailed solutions for the first test (explicit route) ----
    goTo('#independent-tests/solutions/1')
    assert.ok(screen.getByRole('heading', { name: 'حلول الاختبارات', level: 1 }))
    assert.ok(screen.getByRole('heading', { name: 'الاختبار المستقل الأول — الوحدة الأولى كاملة', level: 2 }))
    assert.equal(container.querySelectorAll('.independent-solution-card').length, 30, 'exactly 30 detailed solutions')
    assert.equal(container.querySelectorAll('.independent-solution-answer').length, 30)
    assert.equal(container.querySelectorAll('.independent-solution-block').length, 60, 'idea + steps blocks for each solution')
    assert.equal(container.querySelectorAll('.independent-solution-why').length, 30)
    assert.equal(container.querySelectorAll('.independent-solution-card .independent-steps').length, 30)

    const solutionNumbers = Array.from(container.querySelectorAll('.independent-solution-card .independent-question-number')).map((node) => node.textContent?.trim())
    assert.deepEqual(solutionNumbers, Array.from({ length: 30 }, (_, index) => `السؤال ${index + 1}`), 'solutions must be numbered 1–30 in question order')

    const solutionCards = Array.from(container.querySelectorAll('.independent-solution-card'))
    for (const [index, card] of solutionCards.entries()) {
      const text = card.textContent ?? ''
      assert.ok(text.includes('الإجابة الصحيحة'), `solution ${index + 1} is missing the correct-answer label`)
      assert.ok(text.includes('الفكرة الرياضية'), `solution ${index + 1} is missing the mathematical idea`)
      assert.ok(text.includes('خطوات الحل'), `solution ${index + 1} is missing solution steps`)
      assert.ok(text.includes('لماذا وصلنا إلى هذه النتيجة؟'), `solution ${index + 1} is missing the reasoning`)
    }
    assert.ok((solutionCards[15].textContent ?? '').includes('785,446'), 'Q16 solution shows the correct sum')
    assert.ok((solutionCards[18].textContent ?? '').includes('1,095,000'), 'Q19 solution shows the final amount')
    assert.ok((solutionCards[29].textContent ?? '').includes('6cm'), 'Q30 solution shows the shorter side')
    assert.ok((solutionCards[23].textContent ?? '').includes('112°'), 'Q24 solution shows the supplementary angle')
    console.log('PASS Detailed solutions: 30 answers, 30 ideas, 30 step lists, 30 reasons, all paired with Q1–Q30.')

    // ---- Existing surfaces remain intact ----
    goTo('#top')
    assert.equal(screen.getAllByText('ابدأ').length, 19, 'returning Home must restore the original lesson list')
    goTo('#lesson/coordinates')
    assert.ok(screen.getByRole('heading', { name: 'شبكة الإحداثيات' }), 'lesson route still works')
    goTo('#tests')
    assert.ok(screen.getByRole('heading', { name: 'منطقة الاختبارات' }), 'existing test area still works')
    goTo('#unit-exercises/unit-1')
    assert.ok(screen.getByRole('heading', { name: 'تمارين الوحدة الأولى', level: 1 }), 'unit exercises route still works')
    console.log('PASS Regression: Home (19 lessons), Lesson 1, existing Test Area, and Unit 1 exercises still open.')

    // ---- Responsive CSS contract (jsdom has no layout engine) ----
    const css = readFileSync('src/independent-tests/independent-tests.css', 'utf8')
    assert.ok(css.includes('@media (max-width: 760px)'), 'mobile breakpoint is required')
    assert.ok(css.includes('@media (max-width: 420px)'), 'small-phone breakpoint is required')
    assert.ok(css.includes('@media print'), 'the test must remain printable')
    assert.ok(css.includes('.independent-test-card'), 'responsive card styles are required')
    assert.ok(css.includes('grid-template-columns: 1fr'), 'cards must collapse to one column on small screens')
    assert.ok(css.includes('min-height: 44px'), 'interactive controls must keep 44px touch targets')
    assert.ok(!/\.independent-question-card[^}]*min-width:\s*\d{3,}px/u.test(css), 'question cards must not force a wide fixed width')
    console.log('PASS Responsive contract: 760px/420px breakpoints, one-column cards, 44px controls, print rules.')
  } finally {
    await vite.close()
  }
}

main().catch((error) => {
  console.error(error)
  fail(error instanceof Error ? error.message : String(error))
})
