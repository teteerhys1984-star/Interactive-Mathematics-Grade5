/**
 * Unit 2 · Lesson 7 jsdom integration check using the real App, LessonShell, teacher area,
 * and Test Area. This is NOT a visual-browser review; it checks DOM structure, anchors and interaction only.
 */
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { flattenLesson7CoverageIds, p66ComparisonItems, p69CheckOne, p71ComparisonItems } from '../src/lessons/decimalPartsTwoData'
import { unit2Lesson7AllEntries } from '../src/teacher/unit2Lesson7'

async function main() {
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#top', pretendToBeVisual: true,
  })
  const { window } = dom
  Object.assign(globalThis, {
    window, document: window.document, sessionStorage: window.sessionStorage, localStorage: window.localStorage,
    HTMLElement: window.HTMLElement, SVGElement: window.SVGElement, Node: window.Node,
    getComputedStyle: window.getComputedStyle,
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

  const React = await import('react')
  const { act } = React
  const { render, screen, fireEvent, within } = await import('@testing-library/react')
  const vite = await createServer({ configFile: 'vite.config.ts', server: { middlewareMode: true }, appType: 'custom' })
  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
    const navigate = (hash: string) => act(() => {
      window.location.hash = hash
      window.dispatchEvent(new window.Event('hashchange'))
    })
    render(<App />)
    navigate('#lesson/decimal-parts-two')
    assert.ok(screen.getByRole('heading', { name: 'الأجزاء العشرية (2)', level: 1 }), 'lesson route renders')
    const breadcrumbs = screen.getByRole('navigation', { name: 'مسار الدرس' })
    assert.ok(within(breadcrumbs).getByText('الوحدة الثانية'), 'unit title resolves from the curriculum registry')
    const progress = screen.getByRole('progressbar', { name: 'موقعك في الدرس' })
    const stepCount = Number(progress.getAttribute('aria-valuemax'))
    assert.equal(stepCount, 9, 'lesson has nine ordered steps')

    const panel = () => document.querySelector('.lesson-step-panel') as HTMLElement
    const next = () => fireEvent.click(screen.getByRole('button', { name: /التالي/ }))
    const seenAnchors = new Set<string>()
    const operatorCheck = (id: string, symbol: '<' | '=' | '>') => {
      const task = panel().querySelector<HTMLElement>(`[data-source-id="${id}"]`)
      assert.ok(task, `${id} comparison branch renders`)
      fireEvent.change(within(task!).getByRole('combobox'), { target: { value: symbol } })
      fireEvent.click(within(task!).getByRole('button', { name: 'تحقّق' }))
      assert.ok(within(task!).getByRole('status').textContent?.includes('صحيح'), `${id} comparison grades correctly`)
    }

    for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
      assert.ok(panel(), `step ${stepIndex + 1} panel exists`)
      panel().querySelectorAll<HTMLElement>('[data-source-id]').forEach((node) => seenAnchors.add(node.getAttribute('data-source-id') ?? ''))
      // Comparison branches are graded through the real controls on whichever step renders them.
      for (const item of [...p66ComparisonItems, ...p69CheckOne, ...p71ComparisonItems]) {
        if (panel().querySelector(`[data-source-id="${item.id}"]`)) operatorCheck(item.id, item.relation)
      }
      if (stepIndex < stepCount - 1) next()
    }

    // Every ledger element and branch is present somewhere in the rendered lesson.
    const missing = flattenLesson7CoverageIds().filter((id) => !seenAnchors.has(id))
    assert.deepEqual(missing, [], 'every ledger ID has a rendered anchor (data-source-id)')

    // Teacher guide renders every teacher entry for this lesson.
    window.sessionStorage.setItem('teacher-area-unlocked', 'true')
    navigate('#teacher/decimal-parts-two')
    assert.ok(screen.getByText('دليل درس: الأجزاء العشرية (2)'), 'teacher lesson route selects the matching teacher guide')
    assert.equal(document.querySelectorAll('.teacher-entry').length, unit2Lesson7AllEntries.length, 'teacher guide shows every entry')

    // Test Area: the lesson test loads, and its first question prompt is visible before any solution.
    navigate('#tests/run/lesson-decimal-parts-two-test')
    assert.ok(screen.getByText(/في شبكة من مئة مربع صغير/), 'lesson test renders its first question')
    assert.equal(document.body.textContent?.includes('الحل النموذجي'), false, 'test solutions stay hidden before submission')

    console.log(`PASS decimal-parts-two interaction: ${stepCount} steps, ${seenAnchors.size} anchors rendered, comparisons graded, teacher guide and test route render.`)
  } finally {
    await vite.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
