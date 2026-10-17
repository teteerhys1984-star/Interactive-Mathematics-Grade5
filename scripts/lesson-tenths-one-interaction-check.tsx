/**
 * Unit 2 · Lesson 6 jsdom integration check using the real App, LessonShell, teacher area,
 * Test Area, source anchors, and learner controls. This is not a visual-browser review.
 */
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import {
  flattenCoverageIds, p62ComparisonItems, p62GridItems, p63CheckOneItems, p63CheckThreeItems,
  p64ComparisonItems, p64NumberLineValues, p65ComparisonItems, p65RulerItems, p65ShadingItems,
  p65VerbalItems,
} from '../src/lessons/tenthsOneData'

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
    navigate('#lesson/tenths-one')
    assert.ok(screen.getByRole('heading', { name: 'الأجزاء العشرية (1)', level: 1 }), 'lesson route renders')
    const breadcrumbs = screen.getByRole('navigation', { name: 'مسار الدرس' })
    assert.ok(within(breadcrumbs).getByText('الوحدة الثانية'), 'unit title resolves from the curriculum registry')
    assert.equal(screen.getByRole('progressbar', { name: 'موقعك في الدرس' }).getAttribute('aria-valuemax'), '7')

    const seenAnchors = new Set<string>()
    const observedSteps: string[] = []
    const next = () => fireEvent.click(screen.getByRole('button', { name: /التالي/ }))
    const panel = () => document.querySelector('.lesson-step-panel') as HTMLElement
    const operatorCheck = (id: string, symbol: '<' | '=' | '>') => {
      const task = panel().querySelector<HTMLElement>(`[data-source-id="${id}"]`)
      assert.ok(task, `${id} comparison branch renders`)
      fireEvent.change(within(task!).getByRole('combobox'), { target: { value: symbol } })
      fireEvent.click(within(task!).getByRole('button', { name: 'تحقّق' }))
      assert.ok(within(task!).getByRole('status').textContent?.includes('صحيح'), `${id} comparison grades correctly`)
    }

    for (let stepIndex = 0; stepIndex < 7; stepIndex += 1) {
      const current = panel()
      assert.ok(current, `step ${stepIndex + 1} panel exists`)
      observedSteps.push(current.getAttribute('data-step-id') ?? '')
      for (const node of current.querySelectorAll<HTMLElement>('[data-source-id]')) {
        const id = node.dataset.sourceId
        if (id) seenAnchors.add(id)
      }

      if (stepIndex === 0) {
        const slider = screen.getByRole('slider') as HTMLInputElement
        fireEvent.change(slider, { target: { value: '10' } })
        assert.ok(panel().querySelector('.l6-slider-readout')?.textContent?.includes('1'), 'slider updates to the whole 10/10 representation')
        assert.ok(panel().querySelector('[data-source-id="l6-p62-title"]'), 'page 62 title anchor is visible')
        assert.ok(panel().querySelector('[data-source-id="l6-p62-fact-body"]'), '6/10 body-water branch is anchored')
        assert.ok(panel().querySelector('[data-source-id="l6-p62-fact-earth"]'), '7/10 earth-surface branch is anchored')
      }
      if (stepIndex === 1) {
        assert.ok(panel().querySelector('[data-source-id="l6-p63-examples"]'), 'page 63 worked table is present')
        assert.equal(panel().querySelectorAll('.l6-mini-numberline').length, 3, 'the three page 63 examples retain their printed mini number lines')
        assert.ok(panel().querySelector('[data-source-id="l6-p63-ten-tenths"] .l6-whole-bar'), 'the page 63 whole model includes the printed complete bar')
        assert.ok(panel().querySelector('[data-source-id="l6-p63-decimal-note"]')?.textContent?.includes('غير محسوم'), 'source punctuation uncertainty remains visible and carefully qualified')
        assert.ok(panel().querySelector('.l6-platform-note-box')?.textContent?.includes('0.1'), 'platform decimal notation is explicitly separated')
      }
      if (stepIndex === 2) {
        const printedComparison = panel().querySelector('[data-source-id="l6-p64-example1"]')?.textContent ?? ''
        assert.ok(printedComparison.includes('0.5 < 0.8'), 'page 64 result is transcribed in the printed 0.5 < 0.8 direction')
      }
      if (stepIndex === 3) {
        const firstGrid = panel().querySelector<HTMLElement>(`[data-source-id="${p62GridItems[0].id}"]`)
        assert.ok(firstGrid)
        fireEvent.change(within(firstGrid!).getByRole('textbox', { name: 'بسط المجسم أ' }), { target: { value: '3' } })
        fireEvent.click(within(firstGrid!).getByRole('button', { name: 'تحقّق' }))
        assert.ok(within(firstGrid!).getByRole('status').textContent?.includes('البسط 3'), 'visual slice count is checked')
        for (const item of p62ComparisonItems) operatorCheck(item.id, item.relation)

        const bodyFact = panel().querySelector<HTMLElement>(`[data-source-id="${p63CheckOneItems[0].id}"]`)
        assert.ok(bodyFact)
        const bodyInputs = within(bodyFact!).getAllByRole('textbox') as HTMLInputElement[]
        fireEvent.change(bodyInputs[0], { target: { value: '0.6' } })
        fireEvent.change(bodyInputs[1], { target: { value: 'ستة أجزاء من عشرة' } })
        fireEvent.click(within(bodyFact!).getByRole('button', { name: 'تحقّق' }))
        assert.ok(within(bodyFact!).getByRole('status').textContent?.includes('أحسنت'), 'decimal and verbal conversion accept correct Arabic input')

        const p63Fraction = panel().querySelector<HTMLElement>('[data-source-id="l6-p63-check2-fraction"]')
        assert.ok(p63Fraction)
        fireEvent.change(within(p63Fraction!).getByRole('textbox'), { target: { value: '9/10' } })
        fireEvent.click(within(p63Fraction!).getByRole('button', { name: 'تحقّق' }))
        assert.ok(within(p63Fraction!).getByRole('status').textContent?.includes('صحيح'), 'p. 63 denominator-ten answer is checked')

        const checkThree = panel().querySelector<HTMLElement>(`[data-source-id="${p63CheckThreeItems[0].id}"]`)
        assert.ok(checkThree)
        fireEvent.change(within(checkThree!).getByRole('textbox'), { target: { value: '0.7' } })
        fireEvent.click(within(checkThree!).getByRole('button', { name: 'تحقّق' }))
        assert.ok(within(checkThree!).getByRole('status').textContent?.includes('صحيح'), 'p. 63 fraction-to-decimal activity grades correctly')
      }
      if (stepIndex === 4) {
        for (const item of p64ComparisonItems) operatorCheck(item.id, item.relation)
        const numberLine = panel().querySelector<HTMLElement>('.l6-numberline-activity')
        assert.ok(numberLine)
        for (const value of p64NumberLineValues) {
          const input = within(numberLine!).getByRole('textbox', { name: `قيمة التدريجة عند 0.${Math.round(value * 10)}` })
          fireEvent.change(input, { target: { value: value.toFixed(1) } })
        }
        fireEvent.click(within(numberLine!).getByRole('button', { name: 'تحقّق من الخط' }))
        assert.ok(within(numberLine!).getByRole('status').textContent?.includes('أحسنت'), 'all seven number-line blanks are graded in order')

        const table = panel().querySelector<HTMLElement>('.l6-table-activity')
        assert.ok(table)
        const tableInputs = Array.from(table!.querySelectorAll('input'))
        assert.equal(tableInputs.length, 6, 'the source table exposes exactly its six missing cells')
        assert.deepEqual(Array.from(table!.querySelectorAll('[role="row"]')).map((row) => row.querySelector('[role="rowheader"]')?.textContent), ['الكسر', 'الكتابة العشرية'], 'the source table preserves its two labeled rows')
        const tableAnswers: readonly (readonly [string, string])[] = [
          ['الكسر في العمود 1', '7/10'], ['الكسر في العمود 2', '1/10'], ['الكسر في العمود 3', '5/10'],
          ['الكتابة العشرية في العمود 4', '0.2'], ['الكتابة العشرية في العمود 5', '0.6'], ['الكتابة العشرية في العمود 6', '0.3'],
        ]
        for (const [label, value] of tableAnswers) fireEvent.change(within(table!).getByRole('textbox', { name: label }), { target: { value } })
        fireEvent.click(within(table!).getByRole('button', { name: 'تحقّق من الجدول' }))
        assert.ok(within(table!).getByRole('status').textContent?.includes('كل القيم'), 'the p. 64 table accepts all six equivalent forms')
      }
      if (stepIndex === 5) {
        for (const item of p65RulerItems) {
          const task = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)
          assert.ok(task)
          fireEvent.change(within(task!).getByRole('textbox', { name: new RegExp('طول الخط') }), { target: { value: `0.${item.tenths}` } })
          fireEvent.click(within(task!).getByRole('button', { name: 'تحقّق' }))
          assert.ok(within(task!).getByRole('status').textContent?.includes('صحيح'), `${item.id} ruler readout is correct`)
        }
        const shadingSource = panel().querySelector<HTMLElement>('[data-source-id="l6-p65-q4"]')
        assert.ok(shadingSource?.querySelector('.l6-click-grid.is-vertical'), 'the left p. 65 source model remains a vertical ten-cell strip')
        assert.equal(shadingSource?.querySelectorAll('.l6-click-grid.is-horizontal').length, 2, 'the middle and right p. 65 source models remain 2×5 grids')
        for (const item of p65ShadingItems) {
          const task = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)
          assert.ok(task)
          const cells = within(task!).getAllByRole('button', { name: /الخلية/u })
          for (let index = 0; index < item.tenths; index += 1) fireEvent.click(cells[index])
          fireEvent.click(within(task!).getByRole('button', { name: 'تحقّق من التظليل' }))
          assert.ok(within(task!).getByRole('status').textContent?.includes('صحيح'), `${item.id} shading count is correct`)
        }
        for (const item of p65VerbalItems) {
          const task = panel().querySelector<HTMLElement>(`[data-source-id="${item.id}"]`)
          assert.ok(task)
          const inputs = within(task!).getAllByRole('textbox') as HTMLInputElement[]
          fireEvent.change(inputs[0], { target: { value: `${item.numeral}/10` } })
          fireEvent.change(inputs[1], { target: { value: `0.${item.numeral}` } })
          fireEvent.click(within(task!).getByRole('button', { name: 'تحقّق' }))
          assert.ok(within(task!).getByRole('status').textContent?.includes('صحيح'), `${item.id} fraction/decimal conversion is correct`)
        }
      }
      if (stepIndex === 6) {
        for (const item of p65ComparisonItems) operatorCheck(item.id, item.relation)
        const interval = panel().querySelector<HTMLElement>('[data-source-id="l6-p65-q7"]')
        assert.ok(interval)
        fireEvent.change(within(interval!).getByRole('textbox', { name: /العدد الذي اخترته/u }), { target: { value: '0.4' } })
        fireEvent.click(within(interval!).getByRole('button', { name: 'تحقّق' }))
        assert.ok(within(interval!).getByRole('status').textContent?.includes('لا يحدد الكتاب جواباً واحداً'), 'p. 65 question 7 accepts a valid interior example without claiming uniqueness')
        const intervalInput = within(interval!).getByRole('textbox', { name: /العدد الذي اخترته/u })
        fireEvent.change(intervalInput, { target: { value: '0.3' } })
        fireEvent.click(within(interval!).getByRole('button', { name: 'تحقّق' }))
        assert.ok(within(interval!).getByRole('alert').textContent?.includes('ليست الإجابة'), 'the open interval excludes its printed endpoint')
        fireEvent.change(intervalInput, { target: { value: '0.32' } })
        fireEvent.click(within(interval!).getByRole('button', { name: 'تحقّق' }))
        assert.ok(within(interval!).getByRole('status').textContent?.includes('صحيح'), 'a non-tenth decimal strictly inside the range is also accepted')

        const matching = panel().querySelector<HTMLElement>('.l6-match-activity')
        assert.ok(matching)
        assert.equal(matching!.querySelectorAll('input[type="radio"]:checked').length, 0, 'the source match table is not pre-solved')
        const expectedPairs: Record<string, string> = {
          'l6-p65-q8-decimal-03': 'l6-p65-q8-fraction-9-30',
          'l6-p65-q8-decimal-04': 'l6-p65-q8-fraction-16-40',
          'l6-p65-q8-decimal-05': 'l6-p65-q8-fraction-5-10',
          'l6-p65-q8-decimal-06': 'l6-p65-q8-fraction-3-5',
        }
        for (const [decimalId, fractionId] of Object.entries(expectedPairs)) {
          const row = matching!.querySelector<HTMLElement>(`.l6-match-row:nth-child(${Object.keys(expectedPairs).indexOf(decimalId) + 1})`)
          assert.ok(row, `${decimalId} match row renders`)
          const radio = row!.querySelector<HTMLInputElement>(`input[value="${fractionId}"]`)
          assert.ok(radio, `${fractionId} is a selectable option`)
          fireEvent.click(radio!)
        }
        fireEvent.click(within(matching!).getByRole('button', { name: 'تحقّق من المطابقة' }))
        const matchFeedback = within(matching!).getByRole('status').textContent ?? ''
        assert.ok(matchFeedback.includes('لم تكن مرسومة في المصدر'), 'computed matches are labelled as mathematical inference')
      }

      if (stepIndex < 6) next()
    }

    assert.equal(new Set(observedSteps).size, 7, 'all seven lesson steps are reachable')
    const requiredIds = flattenCoverageIds()
    const missingIds = requiredIds.filter((id) => !seenAnchors.has(id))
    assert.deepEqual(missingIds, [], 'each source block and branch has a visible source anchor in the real lesson')
    assert.equal(panel().querySelectorAll('.l6-fraction[dir="ltr"]').length > 0, true, 'lesson fractions are visually separated and LTR')
    assert.equal(panel().querySelectorAll('.math-expression[dir="ltr"]').length > 0, true, 'decimal notation is isolated from Arabic RTL prose')
    console.log(`✅ Student lesson: all 7 steps, ${requiredIds.length} source/branch anchors, number line/table, shading, comparisons, and matching checked.`)

    navigate('#tests/solutions/lesson-tenths-one-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول غير متاحة قبل التسليم' }), 'test solutions remain locked before submission')
    assert.equal(screen.queryByRole('heading', { name: 'الفكرة' }), null)
    assert.equal(screen.queryByRole('heading', { name: 'الإجابة النهائية' }), null)
    navigate('#tests/run/lesson-tenths-one-test')
    assert.ok(screen.getByRole('heading', { name: 'اختبار الدرس · الأجزاء العشرية (1)' }), 'independent test opens from its registered route')
    assert.equal(screen.getByRole('progressbar', { name: 'موضعك في الاختبار' }).getAttribute('aria-valuemax'), '20')
    assert.equal(screen.queryByRole('heading', { name: 'الإجابة النهائية' }), null, 'answer key is not exposed in the student runner')
    console.log('✅ Independent test: direct 20-question route works; solutions remain locked before submission.')

    window.sessionStorage.setItem('teacher-area-unlocked', 'true')
    navigate('#teacher/tenths-one')
    assert.ok(screen.getByText('دليل درس: الأجزاء العشرية (1)'), 'teacher lesson route selects the matching teacher guide')
    const teacherCards = document.querySelectorAll('.teacher-entry')
    assert.equal(teacherCards.length, 61)
    for (const page of [62, 63, 64, 65]) assert.ok(document.body.textContent?.includes(`المصدر: الكتاب — ص ${page}`), `teacher guide includes source page ${page}`)
    assert.ok(document.querySelector('.teacher-area')?.textContent?.includes('المصدر لا يرسم خطوط وصل'), 'teacher q8 notes the inferred pairs')
    assert.ok(document.querySelector('.teacher-area')?.textContent?.includes('غير واضح بما يكفي'), 'teacher guide preserves the p. 63 character uncertainty')
    const teacherIds = Array.from(document.querySelectorAll<HTMLElement>('.teacher-entry')).map((entry) => entry.dataset.sourceId)
    assert.equal(new Set(teacherIds).size, 61, 'teacher IDs are unique and all entries render')
    console.log('✅ Teacher Area: all pages, branch solutions, platform labels, and both source caveats render.')

    const registryModule = await vite.ssrLoadModule('/src/tests/registry.ts') as { testRegistry: { lessonTests: readonly { id: string }[]; unitTests: readonly { unitId?: string }[] } }
    assert.ok(registryModule.testRegistry.lessonTests.some((test) => test.id === 'lesson-tenths-one-test'), 'new lesson test is discovered')
    assert.equal(registryModule.testRegistry.unitTests.some((test) => test.unitId === 'unit-2'), false, 'no Unit 2 test is created')
    assert.equal(document.querySelector('.teacher-area') !== null, true)
    console.log('✅ Registration: lesson is available, Unit 2 remains in-progress with no unit test.')
  } finally {
    await vite.close()
    dom.window.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
