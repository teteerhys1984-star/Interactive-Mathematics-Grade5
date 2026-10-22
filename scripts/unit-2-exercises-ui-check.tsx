/**
 * Student-facing proof for the rebuilt Unit 2 review lesson «تمرينات الوحدة الثانية».
 *
 * Renders the real App in jsdom and proves:
 *  - the lesson appears exactly once inside the Unit 2 card and opens from its own tile;
 *  - all thirteen steps render while walking the real outline, with no internal setup notes;
 *  - the printed book numbers are on screen (1081785, 1082180, 1205348, 139900, 0.317, ...);
 *  - fractions are displayed as stacked glyphs (numerator above a horizontal rule);
 *  - the interactions actually work (an LCM check and a mixed→improper check pass in the DOM);
 *  - the ten assessed lessons, the eighteen lesson tests and the 60-question unit test are untouched.
 * This is a DOM-behavior check, not a real-browser visual test.
 */
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import type { ComponentType } from 'react'
import { curriculumRegistry, unitLessons } from '../src/content/registry'
import { lessonId, lessonTitle, unit2ExercisesAllTeacherEntries } from '../src/lessons/unit2ExercisesData'
import type { TestRegistrySnapshot } from '../src/tests/registry'

const UNIT_TWO_LESSON_IDS = [
  'compare-order-natural-numbers',
  'multiply-natural-numbers',
  'least-common-multiple',
  'fractions-one',
  'fractions-two',
  'tenths-one',
  'decimal-parts-two',
  'decimal-parts-three',
  'rectangle',
  'square',
] as const

const STEP_IDS = [
  'u2e-intro', 'u2e-q1', 'u2e-q2', 'u2e-q3', 'u2e-q4', 'u2e-q5', 'u2e-q6',
  'u2e-q7', 'u2e-q8', 'u2e-q9', 'u2e-q10', 'u2e-q11', 'u2e-summary',
] as const

async function main() {
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#top',
    pretendToBeVisual: true,
  })
  const { window } = dom
  Object.assign(globalThis, {
    window,
    document: window.document,
    sessionStorage: window.sessionStorage,
    localStorage: window.localStorage,
    HTMLElement: window.HTMLElement,
    SVGElement: window.SVGElement,
    Node: window.Node,
    getComputedStyle: window.getComputedStyle,
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

  const React = await import('react')
  const { act } = React
  const { render, screen, fireEvent, within } = await import('@testing-library/react')
  const vite = await createServer({ configFile: 'vite.config.ts', server: { middlewareMode: true }, appType: 'custom' })
  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.tsx') as { default: ComponentType }
    const { testRegistry } = await vite.ssrLoadModule('/src/tests/registry.ts') as { testRegistry: TestRegistrySnapshot }
    const { lessonComponents } = await vite.ssrLoadModule('/src/content/lessonComponents.tsx') as { lessonComponents: Record<string, ComponentType> }

    const goTo = (hash: string) => act(() => {
      window.location.hash = hash
      window.dispatchEvent(new window.Event('hashchange'))
    })

    const view = render(<App />)
    const { container } = view

    /* ---------------------------------------------- the Unit 2 card lists the review lesson once */
    const unitTwoCard = screen.getByRole('heading', { name: 'الوحدة الثانية' }).closest('.unit-card') as HTMLElement | null
    assert.ok(unitTwoCard, 'the Unit 2 card is rendered on the student home page')
    const unitTwoTiles = Array.from(unitTwoCard.querySelectorAll('li.lesson-tile'))
    assert.equal(unitTwoTiles.length, 11, 'Unit 2 exposes the ten assessed lessons plus exactly one review lesson')
    assert.deepEqual(
      unitTwoTiles.map((tile) => tile.querySelector('a.lesson-start')?.getAttribute('href')),
      [...UNIT_TWO_LESSON_IDS.map((id) => `#lesson/${id}`), `#lesson/${lessonId}`],
      'the review lesson follows the ten original lessons, and no original lesson moved',
    )
    assert.equal(within(unitTwoCard).getAllByText(lessonTitle).length, 1, 'the review title appears exactly once inside the Unit 2 list')

    const reviewTile = unitTwoTiles[unitTwoTiles.length - 1]
    assert.equal(reviewTile.querySelector('h4')?.textContent, lessonTitle)
    assert.ok(reviewTile.classList.contains('is-available'), 'the review lesson is available to the student')
    const reviewLink = within(reviewTile as HTMLElement).getByRole('link', { name: `فتح ${lessonTitle}` })
    assert.equal(reviewLink.getAttribute('href'), `#lesson/${lessonId}`)

    /* ---------------------------------------------- opening it from that card reaches the lesson */
    act(() => {
      fireEvent.click(reviewLink)
      if (window.location.hash !== `#lesson/${lessonId}`) window.location.hash = `#lesson/${lessonId}`
      window.dispatchEvent(new window.Event('hashchange'))
    })
    assert.ok(screen.getByRole('heading', { name: lessonTitle, level: 1 }), 'the real review lesson component opens')
    assert.equal(container.querySelectorAll('.lesson-shell.lesson-unit2-exercises').length, 1, 'the Unit 2 review lesson theme is active')
    assert.equal(screen.getByRole('progressbar', { name: 'موقعك في الدرس' }).getAttribute('aria-valuemax'), '13', 'the opened lesson is the 13-step review lesson')
    const breadcrumbs = container.querySelector('.lesson-breadcrumbs')
    assert.ok(breadcrumbs, 'the lesson renders its breadcrumb')
    assert.ok(within(breadcrumbs as HTMLElement).getByText('الوحدة الثانية'), 'the review lesson keeps its Unit 2 context')
    console.log('PASS Student card: the review lesson appears once in the Unit 2 list and opens from its own tile.')

    /* ---------------------------------------------- walk all thirteen steps through the outline */
    const outlineButtons = () => Array.from(container.querySelectorAll<HTMLElement>('.lesson-outline-list.is-desktop button'))
    assert.equal(outlineButtons().length, 13, 'the outline lists all thirteen steps')

    const expectVisible = (text: string, stepId: string) => {
      assert.ok(document.body.textContent?.includes(text), `step ${stepId} shows the printed text «${text}»`)
    }

    for (const [index, stepId] of STEP_IDS.entries()) {
      act(() => { fireEvent.click(outlineButtons()[index]) })
      const panel = container.querySelector(`[data-step-id="${stepId}"]`)
      assert.ok(panel, `step ${index + 1} (${stepId}) renders its panel`)
      assert.ok(screen.getByRole('heading', { name: lessonTitle, level: 1 }), `the lesson shell stays mounted on step ${stepId}`)
      const text = document.body.textContent ?? ''
      assert.ok(!text.includes('نص غير واضح'), `step ${stepId} shows no internal unclear-text note`)
      assert.ok(!text.includes('غير واضح'), `step ${stepId} shows no unclear wording at all`)
    }

    act(() => { fireEvent.click(outlineButtons()[1]) })
    expectVisible('أنشئ جدول خانات', 'u2e-q1')
    expectVisible('مئات الآلاف', 'u2e-q1')

    act(() => { fireEvent.click(outlineButtons()[2]) })
    expectVisible('1081785', 'u2e-q2')
    expectVisible('1082180', 'u2e-q2')
    expectVisible('بناءان يحتاجان للإصلاح', 'u2e-q2')

    act(() => { fireEvent.click(outlineButtons()[3]) })
    expectVisible('1205348', 'u2e-q3')
    expectVisible('1002347', 'u2e-q3')

    act(() => { fireEvent.click(outlineButtons()[4]) })
    expectVisible('139900', 'u2e-q4')
    expectVisible('140000', 'u2e-q4')

    act(() => { fireEvent.click(outlineButtons()[5]) })
    expectVisible('المضاعف المشترك الأصغر', 'u2e-q5')

    act(() => { fireEvent.click(outlineButtons()[6]) })
    expectVisible('0.317', 'u2e-q6')
    expectVisible('0.032', 'u2e-q6')
    const q6Fractions = container.querySelectorAll('.u2e-frac')
    assert.ok(q6Fractions.length >= 9, `exercise ⑥ shows stacked fractions (${q6Fractions.length} glyphs)`)
    assert.ok(container.querySelector('.u2e-frac-rule'), 'the fraction rule (horizontal bar) renders on ⑥')

    act(() => { fireEvent.click(outlineButtons()[7]) })
    assert.ok(container.querySelectorAll('.u2e-frac').length >= 4, 'exercise ⑦ shows stacked fraction cards')

    act(() => { fireEvent.click(outlineButtons()[9]) })
    expectVisible('بشكل كسر عادي', 'u2e-q9')

    act(() => { fireEvent.click(outlineButtons()[10]) })
    expectVisible('بشكل كسر مركب', 'u2e-q10')

    act(() => { fireEvent.click(outlineButtons()[11]) })
    expectVisible('احسب طول كل من DG، AB، CB', 'u2e-q11')
    assert.ok(container.querySelector('.u2e-figure'), 'exercise ⑪ renders the composite figure')

    act(() => { fireEvent.click(outlineButtons()[12]) })
    expectVisible('اختبار الوحدة الثانية', 'u2e-summary')
    const testLink = container.querySelector<HTMLAnchorElement>('a.u2e-test-link')
    assert.ok(testLink && testLink.getAttribute('href') === '#tests/run/unit-unit-2-test', 'the summary links to the untouched 60-question unit test')
    console.log('PASS Step walk: all 13 steps render; book numbers, stacked fractions and the figure are on screen; no internal notes anywhere.')

    /* ---------------------------------------------- interaction proof 1: LCM task ⑤ (أ) */
    act(() => { fireEvent.click(outlineButtons()[5]) })
    const lcmTask = container.querySelector('[data-u2e-check="u2-p85-q5-a"]')
    assert.ok(lcmTask, 'exercise ⑤ فرع (أ) task is present')
    const lcmInput = lcmTask.querySelector<HTMLInputElement>('input[data-u2e-input="u2-p85-q5-a"]')
    assert.ok(lcmInput, 'the LCM input exists')
    act(() => { fireEvent.change(lcmInput, { target: { value: '36' } }) })
    const lcmButton = Array.from(lcmTask.querySelectorAll('button')).find((button) => button.textContent?.includes('تحقّق'))
    assert.ok(lcmButton, 'the LCM check button exists')
    act(() => { fireEvent.click(lcmButton) })
    assert.ok(document.body.textContent?.includes('إجابة صحيحة'), 'typing 36 for 4 و 9 passes the LCM check')

    /* wrong answer first: hint appears, and the full solution opens after the second attempt */
    act(() => { fireEvent.change(lcmInput, { target: { value: '17' } }) })
    act(() => { fireEvent.click(lcmButton) })
    assert.ok(document.body.textContent?.includes('راجع الإجابة'), 'a wrong LCM answer is rejected')
    act(() => { fireEvent.click(lcmButton) })
    assert.ok(document.body.textContent?.includes('الحل الكامل بعد المحاولتين'), 'the full LCM solution opens after the second attempt')
    console.log('PASS Interaction ⑤: the LCM task validates 36, rejects wrong answers, and reveals the worked solution.')

    /* ---------------------------------------------- interaction proof 2: mixed → improper ⑨ (أ) */
    act(() => { fireEvent.click(outlineButtons()[9]) })
    const q9Task = container.querySelector('[data-u2e-check="u2-p86-q9-a"]')
    assert.ok(q9Task, 'exercise ⑨ فرع (أ) task is present')
    const q9Input = q9Task.querySelector<HTMLInputElement>('input[data-u2e-input="u2-p86-q9-a"]')
    assert.ok(q9Input, 'the improper-numerator input exists')
    act(() => { fireEvent.change(q9Input, { target: { value: '91' } }) })
    const q9Button = Array.from(q9Task.querySelectorAll('button')).find((button) => button.textContent?.includes('تحقّق'))
    assert.ok(q9Button, 'the ⑨ check button exists')
    act(() => { fireEvent.click(q9Button) })
    assert.ok(document.body.textContent?.includes('إجابة صحيحة'), 'typing 91 for 15 1/6 passes the conversion check')
    console.log('PASS Interaction ⑨: 15 1/6 = 91/6 validates inside the stacked fraction input.')

    /* ---------------------------------------------- interaction proof 3: comparison symbol ⑥ (د) */
    act(() => { fireEvent.click(outlineButtons()[6]) })
    const q6Task = container.querySelector('[data-u2e-check="u2-p85-q6-d"]')
    assert.ok(q6Task, 'exercise ⑥ فرع (د) task is present')
    const equalsRadio = q6Task.querySelector<HTMLInputElement>('input[data-u2e-symbol="="]')
    assert.ok(equalsRadio, 'the = symbol radio exists')
    act(() => { fireEvent.click(equalsRadio) })
    const q6Button = Array.from(q6Task.querySelectorAll('button')).find((button) => button.textContent?.includes('تحقّق'))
    assert.ok(q6Button, 'the ⑥ check button exists')
    act(() => { fireEvent.click(q6Button) })
    assert.ok(document.body.textContent?.includes('إجابة صحيحة'), '4/5 = 0.8 validates with the = symbol')
    console.log('PASS Interaction ⑥: the comparison symbol picker validates 4/5 = 0.8.')

    /* ---------------------------------------------- Unit 1 stays untouched */
    goTo('#top')
    const unitOneCard = screen.getByRole('heading', { name: 'الوحدة الأولى' }).closest('.unit-card') as HTMLElement | null
    assert.ok(unitOneCard)
    assert.equal(unitOneCard.querySelectorAll('li.lesson-tile').length, 8, 'Unit 1 still lists its original eight lessons')
    assert.equal(within(unitOneCard).getByRole('link', { name: /افتح التمارين/ }).getAttribute('href'), '#unit-exercises/unit-1', 'the Unit 1 exercises entry is unchanged')

    /* ---------------------------------------------- registry + test contract stay intact */
    const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
    assert.ok(unitTwo)
    assert.deepEqual(unitTwo.lessons.map((lesson) => lesson.id), [...UNIT_TWO_LESSON_IDS], 'the ten assessed Unit 2 lessons are unchanged')
    assert.deepEqual(unitTwo.reviewLessons?.map((lesson) => lesson.id), [lessonId], 'the review lesson is registered separately and is not duplicated')
    assert.equal(unitTwo.reviewLessons?.[0]?.title, lessonTitle)
    assert.equal(unitTwo.reviewLessons?.[0]?.availability, 'available')
    assert.equal(unitLessons(unitTwo).length, 11)
    assert.ok(lessonComponents[lessonId], 'the review lesson keeps its routed component')
    assert.ok(unit2ExercisesAllTeacherEntries.length >= 57, 'the review lesson keeps its full Teacher Area solutions (50 textbook + 7 platform)')

    assert.equal(testRegistry.getTestById(lessonId), undefined, 'the review lesson is a lesson page, not a test definition')
    assert.equal(testRegistry.lessonTests.length, 18, 'the eighteen lesson tests are unaffected')
    assert.equal(testRegistry.unitTests.length, 2, 'both unit tests are still eligible')
    assert.equal(testRegistry.discoveredDefinitionCount, 20, 'no duplicate test definition was introduced')
    const unitTwoTest = testRegistry.getTestById('unit-unit-2-test')
    assert.ok(unitTwoTest, 'the Unit 2 test is still discovered')
    assert.equal(unitTwoTest.questions.length, 60, 'the Unit 2 test keeps its 60 questions')
    assert.deepEqual(
      unitTwoTest.blueprint.coverage.lessons.map((entry) => entry.id),
      [...UNIT_TWO_LESSON_IDS],
      'the Unit 2 test blueprint still covers exactly the ten assessed lessons',
    )
    console.log('PASS Regression: ten assessed Unit 2 lessons, eighteen lesson tests, and the 60-question Unit 2 test are unchanged.')

    /* ---------------------------------------------- direct link still works */
    goTo(`#lesson/${lessonId}`)
    assert.ok(screen.getByRole('heading', { name: lessonTitle, level: 1 }), 'the direct link still opens the review lesson')
    console.log('PASS Direct link: #lesson/unit-2-exercises still opens the review lesson.')
    view.unmount()
  } finally {
    await vite.close()
    dom.window.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
