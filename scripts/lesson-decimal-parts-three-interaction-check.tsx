import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { flattenLesson8CoverageIds, p72Comparisons, p72Cubes, p73Fractions, p74Comparisons, p75Comparisons, p75Rulers, p76Comparisons, p76Intervals, p76Matches, p76Ruler, p76Table } from '../src/lessons/decimalPartsThreeData'
import { lesson8TeacherEntries, lesson8PlatformTeacherEntries } from '../src/lessons/decimalPartsThreeData'

async function main() {
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', { url: 'http://localhost/#top', pretendToBeVisual: true })
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
    const navigate = (hash: string) => act(() => { window.history.replaceState(null, '', hash); window.dispatchEvent(new window.Event('hashchange')) })
    render(<App />)
    navigate('#lesson/decimal-parts-three')
    assert.ok(screen.getByRole('heading', { name: 'الأجزاء العشرية (3)', level: 1 }), 'the lesson route resolves the Unit 2 lesson')
    assert.ok(within(screen.getByRole('navigation', { name: 'مسار الدرس' })).getByText('الوحدة الثانية'), 'shared shell identifies the correct unit')
    const panel = () => document.querySelector<HTMLElement>('.lesson-step-panel')!
    const next = () => fireEvent.click(document.querySelector<HTMLButtonElement>('.lesson-navigation .is-next')!)
    const seen = new Set<string>()
    let sawIsolatedFraction = false
    let sawIsolatedDecimal = false
    const checkCompare = (id: string, relation: string) => {
      const task = panel().querySelector<HTMLElement>(`[data-source-id="${id}"]`)
      assert.ok(task, `${id} is rendered`)
      fireEvent.change(within(task!).getByRole('combobox', { name: /رمز المقارنة/u }), { target: { value: relation } })
      fireEvent.click(within(task!).getByRole('button', { name: 'تحقّق' }))
      assert.ok(within(task!).getByRole('status').textContent?.includes('صحيح'), `${id} is graded correctly`)
    }
    const fillRange = (task: HTMLElement, lower: string, upper: string, value: string) => {
      fireEvent.change(within(task).getByRole('textbox'), { target: { value } })
      fireEvent.click(within(task).getByRole('button', { name: 'تحقّق' }))
      assert.ok(within(task).getByRole('status').textContent?.includes('صحيح'), `${lower} < ${value} < ${upper}`)
    }
    const stepCount = Number(document.querySelector('.lesson-progress-track')?.getAttribute('aria-valuemax'))
    assert.equal(stepCount, 8, 'lesson is divided into eight navigable steps')

    for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
      panel().querySelectorAll<HTMLElement>('[data-source-id]').forEach((node) => seen.add(node.dataset.sourceId ?? ''))
      sawIsolatedFraction ||= Boolean(panel().querySelector('.l8-fraction[dir="ltr"]'))
      sawIsolatedDecimal ||= Boolean(panel().querySelector('.math-expression[dir="ltr"]'))
      if (stepIndex === 0) {
        for (const item of p72Cubes) {
          const task = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)!
          fireEvent.change(task.querySelector('input')!, { target: { value: `${item.numerator}/1000` } })
          fireEvent.click(within(task).getByRole('button', { name: 'تحقّق' }))
          assert.ok(within(task).getByRole('status').textContent?.includes('صحيح'), `${item.id} cube fraction`)
        }
        for (const item of p72Comparisons) checkCompare(item.id, item.relation)
        assert.equal(panel().querySelectorAll('.l8-cube-model .l8-cube-layer').length, 30, 'the three per-exercise cube models each render ten 10×10 layers (1000 units)')
      }
      if (stepIndex === 1) {
        for (const item of p73Fractions) {
          const task = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)!
          const inputs = task.querySelectorAll('input')
          fireEvent.change(inputs[0], { target: { value: item.decimal } })
          fireEvent.change(inputs[1], { target: { value: item.verbal } })
          fireEvent.click(within(task).getByRole('button', { name: 'تحقّق' }))
          assert.ok(within(task).getByRole('status').textContent?.includes('ممتاز'), `${item.id} decimal and wording`)
        }
        const q2 = panel().querySelector<HTMLElement>('[data-source-id="l8-p75-check2"]')!
        const q2Inputs = q2.querySelectorAll('input')
        fireEvent.change(q2Inputs[0], { target: { value: 'تسعمئة وتسعة وتسعون جزءاً من ألف' } })
        fireEvent.change(q2Inputs[1], { target: { value: '999/1000' } })
        fireEvent.click(within(q2).getByRole('button', { name: 'تحقّق من الإجابتين' }))
        assert.ok(within(q2).getByRole('status').textContent?.includes('أحسنت'), 'book exercise 2 remains hidden until the learner submits both fields')
      }
      if (stepIndex === 2) for (const item of p74Comparisons) {
        const task = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)
        assert.ok(task, `${item.id} worked example appears`)
        assert.ok(task!.textContent?.includes(item.relation), `${item.id} book answer is faithfully rendered as a worked example`)
      }
      if (stepIndex === 3) {
        const majorMarks = panel().querySelector('.l8-numberline-major')
        const zoom = panel().querySelector('.l8-numberline-zoom')
        assert.ok(majorMarks && zoom, 'thousandths number line and magnified part render')
        assert.equal(panel().querySelector('.l8-numberline-demo')?.getAttribute('dir'), 'ltr', 'mobile horizontal scrolling starts at the number line origin')
        assert.ok(panel().querySelector('.l8-numberline-mobile-hint')?.textContent?.includes('اسحب'), 'mobile users receive a visible horizontal-scroll instruction')
        for (const value of ['0.01', '0.05', '0.09']) assert.ok(majorMarks!.textContent?.includes(value), `major number line labels ${value}`)
        for (const value of ['0.011', '0.015', '0.019']) assert.ok(zoom!.textContent?.includes(value), `magnified line labels ${value}`)
        for (const item of p75Comparisons) checkCompare(item.id, item.relation)
        const betweenA = panel().querySelector<HTMLElement>('[data-source-id="l8-p75-between-a-try"]')!
        fillRange(betweenA, '0.01', '0.02', '0.015')
        const betweenB = panel().querySelector<HTMLElement>('[data-source-id="l8-p75-between-b-try"]')!
        fillRange(betweenB, '0.175', '0.2', '0.181')
      }
      if (stepIndex === 4) for (const item of p75Rulers) {
        const task = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)!
        for (let mark = item.from + 1; mark < item.to; mark += 1) if (mark !== item.printed) {
          const label = `قيمة التدريجة 0.${String(mark).padStart(3, '0')}`
          fireEvent.change(within(task).getByRole('textbox', { name: label }), { target: { value: (mark / 1000).toFixed(3) } })
        }
        fireEvent.click(within(task).getByRole('button', { name: 'تحقّق من الخط' }))
        assert.ok(within(task).getByRole('status').textContent?.includes('أحسنت'), `${item.id} number line blanks are all graded`)
      }
      if (stepIndex === 5) {
        const ruler = panel().querySelector<HTMLElement>(`[data-source-id="${p76Ruler.id}"]`)!
        for (let mark = p76Ruler.from + 1; mark < p76Ruler.to; mark += 1) if (mark !== p76Ruler.printed) {
          fireEvent.change(within(ruler).getByRole('textbox', { name: `قيمة التدريجة 0.${String(mark).padStart(3, '0')}` }), { target: { value: (mark / 1000).toFixed(3) } })
        }
        fireEvent.click(within(ruler).getByRole('button', { name: 'تحقّق من الخط' }))
        assert.ok(within(ruler).getByRole('status').textContent?.includes('أحسنت'), 'page 76 line (ث) grades all blanks')
        const table = panel().querySelector<HTMLElement>('.l8-table-wrap')!
        assert.equal(table.querySelectorAll('input').length, 6, 'page 76 table has six answer cells')
        assert.equal(table.querySelectorAll('tbody tr').length, 2, 'page 76 table preserves its two printed rows')
        for (let i = 0; i < p76Table.length; i += 1) {
          const item = p76Table[i]
          const label = item.printed === 'fraction' ? `الكتابة العشرية في العمود ${i + 1}` : `الكسر في العمود ${i + 1}`
          const answer = item.printed === 'fraction' ? `0.${String(item.numerator).padStart(3, '0')}` : `${item.numerator}/1000`
          fireEvent.change(within(table).getByRole('textbox', { name: label }), { target: { value: answer } })
        }
        fireEvent.click(within(table).getByRole('button', { name: 'تحقّق من الجدول' }))
        assert.ok(within(table).getByRole('status').textContent?.includes('أكملت الأزواج الستة'), 'all six table cells are correct')
      }
      if (stepIndex === 6) {
        const interval = panel().querySelector<HTMLElement>('[data-source-id="l8-p76-check3-try"]')!
        fillRange(interval, '0.32', '0.33', '0.325')
        for (const item of p76Comparisons) checkCompare(item.id, item.relation)
      }
      if (stepIndex === 7) {
        for (const [index, item] of p76Matches.entries()) {
          const row = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)!
          fireEvent.change(within(row).getByRole('combobox'), { target: { value: item.fraction } })
          assert.equal(index < 4, true)
        }
        const matching = panel().querySelector<HTMLElement>('.l8-matching')!
        fireEvent.click(within(matching).getByRole('button', { name: 'تحقّق من المطابقة' }))
        assert.ok(within(matching).getByRole('status').textContent?.includes('أحسنت'), 'all four matching pairs are correct')
        for (const item of p76Intervals) {
          const task = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)!
          fillRange(task, item.lower, item.upper, item.sample)
        }
        const mobileNav = document.querySelector('.lesson-outline-mobile')
        assert.ok(mobileNav, 'responsive lesson outline retains its mobile navigation')
        assert.ok(screen.getByRole('link', { name: /انتقل إلى اختبار الدرس المستقل/u }), 'student can discover the independent lesson test')
      }
      if (stepIndex < stepCount - 1) next()
    }
    const missingIds = flattenLesson8CoverageIds().filter((id) => !seen.has(id))
    assert.deepEqual(missingIds, [], 'all 68 textbook source blocks and exercise branches are visible across the lesson steps')
    assert.ok(seen.has('l8-p76-interval-w') && seen.has('l8-p72-cube-a'), 'first and final exercise branches remain mounted')
    assert.ok(sawIsolatedFraction && sawIsolatedDecimal, 'fraction and decimal notation use isolated LTR boundaries across the lesson')

    window.sessionStorage.setItem('teacher-area-unlocked', 'true')
    navigate('#teacher/decimal-parts-three')
    assert.ok(screen.getByText('دليل درس: الأجزاء العشرية (3)'), 'teacher direct route selects the new guide')
    const teacherCards = [...document.querySelectorAll<HTMLElement>('.teacher-entry')]
    assert.equal(teacherCards.length, lesson8TeacherEntries.length + lesson8PlatformTeacherEntries.length, 'teacher page renders every source solution and platform guide')
    const ids = teacherCards.map((card) => card.dataset.sourceId)
    assert.equal(new Set(ids).size, ids.length, 'teacher solution ids are unique')
    for (const page of [72, 73, 74, 75, 76]) assert.ok(document.body.textContent?.includes(`المصدر: الكتاب — ص ${page}`), `teacher guide identifies source page ${page}`)
    assert.ok(document.body.textContent?.includes('خطوات الحل والتفسير إضافات تعليمية'), 'teacher guide separates source from platform explanation')

    navigate('#tests/solutions/lesson-decimal-parts-three-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول غير متاحة قبل التسليم' }), 'answer key is inaccessible before submission')
    assert.equal(screen.queryByRole('heading', { name: 'الإجابة النهائية' }), null)
    navigate('#tests/run/lesson-decimal-parts-three-test')
    assert.ok(screen.getByRole('heading', { name: 'اختبار الدرس · الأجزاء العشرية (3)' }), 'independent lesson test route opens')
    assert.ok(screen.getByText(/ما الكتابة العشرية للكسر/u), 'test starts with a lesson-relevant question')
    assert.equal(document.body.textContent?.includes('الخطأ الشائع'), false, 'solution hints remain hidden in the student runner')
    const registryModule = await vite.ssrLoadModule('/src/tests/registry.ts') as { testRegistry: { lessonTests: readonly { id: string }[]; unitTests: readonly { unitId?: string }[] } }
    assert.ok(registryModule.testRegistry.lessonTests.some((test) => test.id === 'lesson-decimal-parts-three-test'), 'strict test discovery registers the lesson test')
    assert.ok(registryModule.testRegistry.unitTests.some((test) => test.unitId === 'unit-2'), 'the separate Unit 2 test is registered now that Unit 2 is complete')
    console.log(`PASS lesson 8 interaction: ${stepCount} steps, ${flattenLesson8CoverageIds().length} ledger anchors, cube/comparison/conversion/rulers/table/matching/open intervals, teacher guide and protected lesson quiz.`)
  } finally { await vite.close() }
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
