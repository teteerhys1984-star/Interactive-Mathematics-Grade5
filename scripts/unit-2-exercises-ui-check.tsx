/**
 * Student-facing proof for the existing Unit 2 review lesson «تمرينات الوحدة الثانية».
 *
 * Renders the real App in jsdom and proves the lesson is reachable from the Unit 2 card itself:
 * it appears exactly once inside the Unit 2 lesson list, its tile opens the real lesson route,
 * the ten assessed Unit 2 lessons stay in place, and the 60-question Unit 2 test is untouched.
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
    assert.equal(screen.getAllByRole('link', { name: `فتح ${lessonTitle}` }).length, 1, 'the review lesson has exactly one student entry on Home')

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
    assert.ok(unit2ExercisesAllTeacherEntries.length > 0, 'the review lesson keeps its Teacher Area solutions')

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
