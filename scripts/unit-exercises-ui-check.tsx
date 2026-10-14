/**
 * Focused jsdom interaction test for the standalone student review and its separate teacher tab.
 * This verifies DOM behavior only; it is not a real-browser or visual-layout test.
 */
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import { unitOneBookExercises } from '../src/exercises/unitOneExercisesData'

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
    const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
    const { container } = render(<App />)
    const goTo = (hash: string) => act(() => {
      window.location.hash = hash
      window.dispatchEvent(new window.Event('hashchange'))
    })

    const homeExercisesLink = screen.getByRole('link', { name: /افتح التمارين/ })
    assert.equal(homeExercisesLink.getAttribute('href'), '#unit-exercises/unit-1')
    assert.equal(container.querySelectorAll('.lesson-start').length, 8, 'exercise entry must not create a ninth lesson link')
    console.log('PASS Home: distinct exercise entry exists; exactly eight lesson-start links remain.')

    goTo('#unit-exercises/unit-1')
    assert.ok(screen.getByRole('heading', { name: 'تمارين الوحدة الأولى', level: 1 }))
    assert.ok(screen.getByText(/ليست درساً تاسعاً/))
    assert.ok(screen.getByText(/لا تحلّ محل اختبار الوحدة الأولى/))
    assert.equal(container.querySelectorAll('.unit-exercise-card').length, 12)
    assert.equal(container.querySelectorAll('.unit-exercise-coordinate-plane').length, 2)
    assert.equal(container.querySelectorAll('.unit-exercise-line-graph').length, 2)
    assert.equal(container.querySelectorAll('.unit-exercise-geometry-figure').length, 1)
    assert.equal(container.querySelectorAll('.unit-exercise-table').length, 3)
    assert.equal(unitOneBookExercises.reduce((count, exercise) => count + exercise.tasks.length, 0), 30)
    const compact = (value: string) => value.normalize('NFKC').replace(/\s+/gu, '')
    for (const exercise of unitOneBookExercises) {
      const cardText = compact(container.querySelector(`#unit-exercise-${exercise.number}`)?.textContent ?? '')
      for (const task of exercise.tasks) {
        const taskAnchor = container.querySelector(`#student-task-${task.id}`)
        assert.ok(taskAnchor, `${task.id}: direct student coverage anchor is rendered`)
        assert.ok(cardText.includes(compact(task.sourceText)), `${task.id}: printed source item is rendered for the student`)
      }
    }
    console.log('PASS Student route: all 30 original branch/item strings render across the 12 source questions, with both coordinate grids, the geometry figure, both line graphs, and all three data tables.')
    assert.equal(container.querySelector('.unit-exercise-index a[href="#unit-exercise-5"]')?.textContent?.replace(/\s+/gu, ''), '5ص41')
    goTo('#unit-exercise-5')
    assert.ok(screen.getByRole('heading', { name: 'تمارين الوحدة الأولى', level: 1 }), 'question-index anchors must not route back to Home')
    assert.ok(container.querySelector('#unit-exercise-5'))
    goTo('#unit-exercises/unit-1')
    console.log('PASS Student index: question/page anchors preserve the standalone exercise route.')

    // Q1 matching: all four original branches are represented and validated in order.
    const matches = [
      ['p40-q01-a', '(5,2)'], ['p40-q01-b', '(2,5)'],
      ['p40-q01-c', '(4,0)'], ['p40-q01-d', '(0,4)'],
    ] as const
    // The selects are labelled by the full source sentence, so address them by stable IDs.
    for (const [id, value] of matches) fireEvent.change(container.querySelector(`#match-${id}`)!, { target: { value } })
    const q1 = container.querySelector('#unit-exercise-1')!
    fireEvent.click(within(q1).getByRole('button', { name: 'تحقّق من المطابقة' }))
    assert.ok(within(q1).getByText(/طابقت العبارات الأربع/))
    console.log('PASS Q1 matching interaction checks all four coordinate pairs.')

    // Q2: click to place A, B and C on the exact lattice points, then enter D.
    for (const [name, x, y] of [['A', 2, 1], ['B', 4, 1], ['C', 1, 3]] as const) {
      const target = container.querySelector(`[aria-label="ضع النقطة ${name} عند (${x},${y})"]`)
      assert.ok(target, `coordinate target for ${name}(${x},${y}) exists`)
      fireEvent.click(target!)
    }
    const dInput = screen.getByLabelText('إحداثيا D للرباعي ABDC')
    fireEvent.change(dInput, { target: { value: '(3,3)' } })
    const dForm = dInput.closest('form')!
    fireEvent.click(within(dForm).getByRole('button', { name: 'تحقّق' }))
    const q2 = container.querySelector('#unit-exercise-2')!
    fireEvent.click(within(q2).getByRole('button', { name: 'تحقّق من تمثيل A وB وC' }))
    assert.ok(within(q2).getByText(/النقاط الثلاث في مواضعها الصحيحة/))
    assert.ok(within(dForm).getByText(/إجابتك صحيحة/))
    console.log('PASS Q2 coordinate plotting, ordered vertices ABDC, and D(3,3) answer check.')

    // Q3 and Q4: numeric entry and all six missing column-addition digits.
    const arithmeticAnswers = [
      ['p40-q03-a', '9,076,376'], ['p40-q03-b', '1,600,328'],
      ['p40-q03-c', '3,055,208'], ['p40-q03-d', '4,614,120'],
    ] as const
    for (const [id, value] of arithmeticAnswers) {
      const input = container.querySelector(`#answer-${id}`) as HTMLInputElement
      fireEvent.change(input, { target: { value } })
      const form = input.closest('form')!
      fireEvent.click(within(form).getByRole('button', { name: 'تحقّق' }))
      assert.ok(within(form).getByText(/إجابتك صحيحة/), `${id}: arithmetic answer`)
    }
    const q4Values = [
      ['أ', 1, 3], ['ب', 2, 1], ['ج', 2, 9],
    ] as const
    for (const [branch, first, second] of q4Values) {
      fireEvent.change(screen.getByLabelText(`التمرين 4، الفرع ${branch}، المربع 1`), { target: { value: String(first) } })
      fireEvent.change(screen.getByLabelText(`التمرين 4، الفرع ${branch}، المربع 2`), { target: { value: String(second) } })
      const form = screen.getByLabelText(`التمرين 4، الفرع ${branch}، المربع 1`).closest('form')!
      fireEvent.click(within(form).getByRole('button', { name: 'تحقّق من الرقمين' }))
      assert.ok(within(form).getByText(/الرقمان صحيحان/), `Q4 ${branch} digit check`)
    }
    const segmentAnswers = [['p41-q05-zc', '4'], ['p41-q05-ad', '2'], ['p41-q05-dx', '4']] as const
    for (const [id, value] of segmentAnswers) {
      const input = container.querySelector(`#answer-${id}`) as HTMLInputElement
      fireEvent.change(input, { target: { value } })
      const form = input.closest('form')!
      fireEvent.click(within(form).getByRole('button', { name: 'تحقّق' }))
      assert.ok(within(form).getByText(/إجابتك صحيحة/), `${id}: parallelogram length`)
    }
    console.log('PASS Q3 all four arithmetic items, Q4 all three vertical-addition puzzles, and Q5 all three segment lengths.')

    // Q6/Q7/Q8 and drawing tools: the interactive controls remain usable without moving tasks into tests.
    const roundedInput = container.querySelector('#answer-p41-q06-a')!
    fireEvent.change(roundedInput, { target: { value: '1,000,000' } })
    fireEvent.click(within(roundedInput.closest('form')!).getByRole('button', { name: 'تحقّق' }))
    assert.ok(within(roundedInput.closest('form')!).getByText(/إجابتك صحيحة/))
    const q6Sort = container.querySelector('#answer-p41-q06-b')!
    fireEvent.change(q6Sort, { target: { value: '2005، 2007، 2004، 2006' } })
    fireEvent.click(within(q6Sort.closest('form')!).getByRole('button', { name: 'تحقّق' }))
    assert.ok(within(q6Sort.closest('form')!).getByText(/إجابتك صحيحة/))
    const q8Answers = [['p42-q08-a', 'صح'], ['p42-q08-b', 'صح'], ['p42-q08-c', 'خطأ'], ['p42-q08-d', 'خطأ']] as const
    for (const [id, answer] of q8Answers) {
      const row = container.querySelector(`#student-task-${id}`)!
      fireEvent.click(within(row).getByRole('button', { name: answer }))
      fireEvent.click(within(row).getByRole('button', { name: 'تحقّق' }))
      assert.ok(within(row).getByText(/أحسنت، إجابتك صحيحة/), `${id}: true/false answer`)
    }
    for (const [id, degrees] of [['p42-q07-hur', 93], ['p42-q07-mnh', 48], ['p42-q07-acd', 175]] as const) {
      const task = container.querySelector(`#student-task-${id}`)!
      fireEvent.change(task.querySelector('input[type="range"]')!, { target: { value: String(degrees) } })
      fireEvent.click(within(task).getByRole('button', { name: 'تحقّق من بناء الزاوية' }))
      assert.ok(within(task).getByText(/القياس مضبوط/), `${id}: angle construction control`)
    }
    assert.equal(container.querySelectorAll('.unit-exercise-angle-task').length, 3)
    for (const id of ['p42-q09-main', 'p42-q10-main']) {
      const task = container.querySelector(`#student-task-${id}`)!
      for (const checkbox of task.querySelectorAll('fieldset input[type="checkbox"]')) fireEvent.click(checkbox)
      fireEvent.click(task.querySelector('.unit-exercise-done-check input')!)
      assert.ok(within(task).getByText(/اكتملت خطوات الإنشاء/), `${id}: all construction checklist steps`)
    }
    assert.equal(container.querySelectorAll('.unit-exercise-construction-steps label').length, 10)
    console.log('PASS Q6 rounding/order, all Q7 angle controls, Q8 truth values, and Q9–Q10 construction checklists.')

    // Q11/Q12 tables are fillable and chart labels stay available to assistive technology.
    for (const [height, value] of [['300', '40'], ['400', '30'], ['800', '10']] as const) {
      fireEvent.change(screen.getByLabelText(`درجة الحرارة عند الارتفاع ${height}`), { target: { value } })
    }
    const temperatureTable = container.querySelector('.unit-exercise-temperature-table')!
    fireEvent.click(within(temperatureTable).getByRole('button', { name: 'تحقّق من الجدول' }))
    assert.ok(within(temperatureTable).getByText(/قيم الجدول صحيحة/))
    const trendTask = container.querySelector('#student-task-p42-q11-b')!
    fireEvent.click(within(trendTask).getByRole('button', { name: 'تتناقص' }))
    fireEvent.click(within(trendTask).getByRole('button', { name: 'تحقّق' }))
    assert.ok(within(trendTask).getByText(/أحسنت، إجابتك صحيحة/))
    const heightInput = container.querySelector('#answer-p42-q11-c')!
    fireEvent.change(heightInput, { target: { value: '500' } })
    fireEvent.click(within(heightInput.closest('form')!).getByRole('button', { name: 'تحقّق' }))
    assert.ok(within(heightInput.closest('form')!).getByText(/إجابتك صحيحة/))
    const libraryAnswers = [
      ['السنة في الخانة الفارغة الأولى', '2014'], ['السنة في الخانة الفارغة الثانية', '2015'], ['السنة في الخانة الفارغة الثالثة', '2016'],
      ['عدد الزوار بالآلاف في عام 2011', '10'], ['عدد الزوار بالآلاف في عام 2012', '5'], ['عدد الزوار بالآلاف في عام 2013', '15'],
    ] as const
    for (const [label, value] of libraryAnswers) fireEvent.change(screen.getByLabelText(label), { target: { value } })
    const libraryTable = container.querySelector('.unit-exercise-library-table')!
    fireEvent.click(within(libraryTable).getByRole('button', { name: 'تحقّق من الجدول' }))
    assert.ok(within(libraryTable).getByText(/أكملت السنوات والقيم/))
    assert.ok(screen.getByRole('img', { name: /مخطط عدد زوار المكتبة بالآلاف/ }))
    console.log('PASS Q11/Q12 graph reading tables and accessible chart descriptions.')

    // Teacher answers are a separate gated tab, linked to the same 30 source records.
    goTo('#teacher')
    fireEvent.change(screen.getByLabelText('كلمة مرور المدرس'), { target: { value: 'somer173' } })
    fireEvent.click(screen.getByRole('button', { name: 'دخول' }))
    fireEvent.click(screen.getByRole('button', { name: 'تمارين الوحدة الأولى' }))
    assert.ok(screen.getByRole('heading', { name: 'حلول تمارين الوحدة الأولى' }))
    assert.equal(container.querySelectorAll('.teacher-exercise-solution').length, 30)
    for (const exercise of unitOneBookExercises) for (const task of exercise.tasks) assert.ok(container.querySelector(`#teacher-solution-${task.id}`), `${task.id}: direct teacher-guide anchor is rendered`)
    assert.ok(screen.getAllByText(/المصدر: الكتاب — ص 40/).length >= 1)
    assert.ok(screen.getAllByText(/المصدر: الكتاب — ص 43/).length >= 1)
    assert.ok(screen.getAllByText(/الحسابات أو الإنشاء كاملاً/).length === 30)
    console.log('PASS Teacher Area: separate gated review tab displays all 30 step-by-step solutions with printed page references.')

    // The existing test area remains an independent route and its unit test is untouched.
    goTo('#tests/units')
    assert.ok(screen.getByRole('heading', { name: 'اختبارات الوحدات' }))
    assert.ok(screen.getByRole('heading', { name: 'اختبار الوحدة الأولى' }))
    console.log('PASS Test Area route remains separate and still displays the existing Unit 1 test.')
  } finally {
    await vite.close()
    dom.window.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
