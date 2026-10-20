import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import {
  check1Reasons, flattenSquareCoverageIds, p81Shapes, p82Check1Shapes, p82WhyNotShapes, p84Ex1Statements, p84Ex2Grid,
  p84Ex3Cases, p84Ex4Lengths, squareAllTeacherEntries, squarePlatformTeacherEntries, squareTeacherEntries, squareTestTeacherEntries,
  whyNotReasons,
} from '../src/lessons/squareData'

/**
 * Unit 2 · Lesson 10 — المربّع. Drives the real App through every step in jsdom: each interactive
 * task is answered until it reports success, every ledger anchor must be mounted, and the teacher
 * guide and the protected lesson test are reached through their routes. The Unit 2 test exists now,
 * so this check also confirms that both tests stay separate.
 */
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
    navigate('#lesson/square')
    assert.ok(screen.getByRole('heading', { name: 'المربّع', level: 1 }), 'the lesson route resolves the Unit 2 lesson')
    assert.ok(within(screen.getByRole('navigation', { name: 'مسار الدرس' })).getByText('الوحدة الثانية'), 'shared shell identifies the correct unit')
    assert.ok(document.querySelector('.lesson-shell.lesson-square'), 'lesson mounts its own theme class')
    const panel = () => document.querySelector<HTMLElement>('.lesson-step-panel')!
    const next = () => fireEvent.click(document.querySelector<HTMLButtonElement>('.lesson-navigation .is-next')!)
    const previous = () => fireEvent.click(document.querySelector<HTMLButtonElement>('.lesson-navigation .is-previous')!)
    const anchor = (id: string) => {
      const nodes = panel().querySelectorAll<HTMLElement>(`[data-source-id="${id}"]`)
      assert.equal(nodes.length, 1, `${id} is rendered exactly once in the current step`)
      return nodes[0]!
    }
    const expectCorrect = (scope: HTMLElement, buttonName: string | RegExp, label: string) => {
      fireEvent.click(within(scope).getByRole('button', { name: buttonName }))
      const statuses = within(scope).getAllByRole('status')
      assert.ok(statuses.some((status) => status.textContent?.includes('إجابة صحيحة')), `${label} is graded as correct`)
    }
    const expectWrongThenCorrect = (scope: HTMLElement, buttonName: string | RegExp, label: string) => {
      fireEvent.click(within(scope).getByRole('button', { name: buttonName }))
      assert.ok(within(scope).getAllByRole('status').some((status) => status.textContent?.includes('راجع الإجابة')), `${label} gives corrective feedback on a wrong answer`)
    }
    const seen = new Set<string>()
    const platformSeen = new Set<string>()
    let sawIsolatedMath = false
    const stepCount = Number(document.querySelector('.lesson-progress-track')?.getAttribute('aria-valuemax'))
    assert.equal(stepCount, 14, 'lesson is divided into fourteen short navigable steps')
    const titles: string[] = []

    for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
      titles.push(document.querySelector('#lesson-section-title')?.textContent ?? '')
      panel().querySelectorAll<HTMLElement>('[data-source-id]').forEach((node) => seen.add(node.dataset.sourceId ?? ''))
      panel().querySelectorAll<HTMLElement>('[data-platform-id]').forEach((node) => platformSeen.add(node.dataset.platformId ?? ''))
      sawIsolatedMath ||= Boolean(panel().querySelector('.math-expression[dir="ltr"]'))
      assert.ok(panel().querySelectorAll('.sq-page-tag').length > 0 || stepIndex === stepCount - 1, `step ${stepIndex + 1} shows its textbook page tag`)
      assert.equal(panel().textContent?.includes('انظر الكتاب'), false, 'no step defers the learner to the book')

      if (stepIndex === 0) {
        assert.ok(anchor('sq-p81-goals').textContent?.includes('تعريف المربّع'), 'goals card lists the printed objectives')
        const lab = anchor('sq-p81-tile-entry').querySelector<HTMLElement>('[data-platform-id="sq-platform-tiling"]')!
        assert.ok(lab.textContent?.includes('البلاطات تغطي المستوي بلا فراغ'), 'tiling lab starts with square tiles that fill the plane')
        fireEvent.click(within(lab).getByRole('button', { name: 'معيّن' }))
        assert.ok(lab.textContent?.includes('يبقى فراغ عند كل نقطة التقاء'), 'rhombus tiles leave a gap at each junction')
        fireEvent.click(within(lab).getByRole('button', { name: 'مستطيل' }))
        assert.ok(lab.textContent?.includes('لا فراغ'), 'rectangular tiles still meet at 360°')
        assert.ok(lab.textContent?.includes('البلاطات تغطي المستوي بلا فراغ'), 'rectangles also tile the plane')
      }
      if (stepIndex === 1) {
        assert.ok(anchor('sq-p81-opening-figures').textContent?.includes('الشكل (7)'), 'all seven opening figures are announced')
        const q1 = anchor('sq-p81-opening-q1')
        for (const shape of p81Shapes) assert.ok(within(q1).getByLabelText(`الشكل (${shape.number})`), `${shape.id} is an answerable option`)
        assert.equal(q1.querySelectorAll('.sq-shape-card').length, 7, 'the first sorter shows seven numbered cards')
        fireEvent.click(within(q1).getByLabelText('الشكل (1)'))
        expectWrongThenCorrect(q1, 'تحقّق', 'opening question 1')
        assert.ok(q1.textContent?.includes('تلميح:') && !q1.textContent?.includes('زواياهما قائمة وأضلاعهما الأربعة متساوية'), 'first wrong attempt shows a hint, not the worked solution')
        fireEvent.click(within(q1).getByLabelText('الشكل (1)'))
        for (const n of [2, 5]) fireEvent.click(within(q1).getByLabelText(`الشكل (${n})`))
        expectCorrect(q1, 'تحقّق', 'opening question 1')
        for (const shape of p81Shapes) anchor(shape.id)
        const q2 = anchor('sq-p81-opening-q2')
        fireEvent.click(within(q2).getByLabelText('الشكل (6)'))
        expectWrongThenCorrect(q2, 'تحقّق', 'opening question 2')
        fireEvent.click(within(q2).getByLabelText('الشكل (6)'))
        for (const n of [2, 5]) fireEvent.click(within(q2).getByLabelText(`الشكل (${n})`))
        expectCorrect(q2, 'تحقّق', 'opening question 2')
        for (const shape of p81Shapes) anchor(`${shape.id}-right`)
        const q3 = anchor('sq-p81-opening-q3')
        fireEvent.click(within(q3).getByLabelText('لا، اختلفت الإجابة'))
        expectWrongThenCorrect(q3, 'تحقّق', 'opening question 3')
        fireEvent.click(within(q3).getByLabelText('نعم، الإجابة نفسها'))
        expectCorrect(q3, 'تحقّق', 'opening question 3')
      }
      if (stepIndex === 2) {
        assert.ok(anchor('sq-p81-definition').textContent?.includes('مستطيل تساوى بعداه'), 'the first half of the printed definition is quoted')
        const lab = panel().querySelector<HTMLElement>('[data-platform-id="sq-platform-definition-lab"]')!
        assert.ok(lab.textContent?.includes('جرّب أن تجعل الطول يساوي العرض'), 'definition lab starts with a non-square rectangle')
        fireEvent.change(within(lab).getByRole('slider', { name: 'قياس زاوية المعيّن' }), { target: { value: '90' } })
        fireEvent.change(within(lab).getByRole('slider', { name: 'طول المستطيل' }), { target: { value: '4' } })
        assert.ok(lab.textContent?.includes('التعريفان يقودان إلى الشكل نفسه'), 'both sliders reaching the conditions identify the same shape')
        assert.ok(lab.textContent?.includes('مربّع'), 'the lab names the resulting square')
      }
      if (stepIndex === 3) {
        const example = anchor('sq-p82-example')
        assert.ok(example.textContent?.includes('3cm'), 'worked example keeps the printed side length')
        assert.ok(example.textContent?.includes('AB = BC = 3cm'), 'example caption keeps the printed 3cm sides')
        assert.ok(example.querySelector('svg[aria-label*="زواياه الأربع قائمة"]'), 'example figure marks the four right angles')
        assert.ok(example.textContent?.includes('شرح إضافي من المنصة'), 'the extra justification is labelled as a platform addition')
        const task = panel().querySelector<HTMLElement>('.sq-task')!
        fireEvent.click(within(task).getByLabelText(/مستطيل تساوى بعداه/u))
        expectCorrect(task, 'تحقّق', 'which definition fits ABCD')
        assert.ok(task.textContent?.includes('CD = DA = 3cm'), 'the full reasoning derives the remaining sides')
      }
      if (stepIndex === 4) {
        for (const shape of p82Check1Shapes) {
          const task = anchor(shape.id)
          const wrong = check1Reasons.find((reason) => reason.id === (shape.id.endsWith('s1') ? 'diagonals-equal' : 'one-pair-parallel'))!
          fireEvent.click(within(task).getByLabelText(wrong.text))
          expectWrongThenCorrect(task, 'تحقّق', `${shape.id} justification`)
          fireEvent.click(within(task).getByLabelText(wrong.text))
          for (const answerId of shape.answers) {
            const reason = check1Reasons.find((candidate) => candidate.id === answerId)!
            fireEvent.click(within(task).getByLabelText(reason.text))
          }
          expectCorrect(task, 'تحقّق', `${shape.id} justification`)
        }
      }
      if (stepIndex === 5) {
        for (const shape of p82WhyNotShapes) {
          const task = anchor(shape.id)
          const wrong = whyNotReasons.find((reason) => reason.id !== shape.reason)!
          fireEvent.click(within(task).getByLabelText(wrong.text))
          expectWrongThenCorrect(task, 'تحقّق', `${shape.id} why-not`)
          fireEvent.click(within(task).getByLabelText(whyNotReasons.find((reason) => reason.id === shape.reason)!.text))
          expectCorrect(task, 'تحقّق', `${shape.id} why-not`)
        }
      }
      if (stepIndex === 6) {
        const properties = anchor('sq-p82-properties')
        assert.ok(properties.textContent?.includes('زواياه الأربع قائمة'), 'property card quotes the third property')
        const sorter = properties.querySelector<HTMLElement>('[data-platform-id="sq-platform-properties"]')!
        fireEvent.click(within(sorter).getByLabelText('قطراه متعامدان دائماً'))
        expectWrongThenCorrect(sorter, 'تحقّق', 'properties multi-select')
        fireEvent.click(within(sorter).getByLabelText('قطراه متعامدان دائماً'))
        for (const label of ['كل ضلعين متقابلين متوازيان', 'أضلاعه الأربعة متساوية الطول', 'زواياه الأربع قائمة']) fireEvent.click(within(sorter).getByLabelText(label))
        expectCorrect(sorter, 'تحقّق', 'properties multi-select')
        const oral = anchor('sq-p82-oral')
        const q1 = anchor('sq-p82-oral-q1')
        fireEvent.click(within(q1).getByLabelText('عندما تكون فيه زاوية قائمة'))
        expectWrongThenCorrect(q1, 'تحقّق', 'oral expression 1')
        fireEvent.click(within(q1).getByLabelText('عندما تتساوى أبعاده'))
        expectCorrect(q1, 'تحقّق', 'oral expression 1')
        const q2 = anchor('sq-p82-oral-q2')
        fireEvent.click(within(q2).getByLabelText('عندما تتساوى أضلاعه'))
        expectWrongThenCorrect(q2, 'تحقّق', 'oral expression 2')
        fireEvent.click(within(q2).getByLabelText('عندما تكون فيه زاوية قائمة'))
        expectCorrect(q2, 'تحقّق', 'oral expression 2')
        assert.ok(oral.textContent?.includes('تعبير شفهي'), 'oral section keeps its printed heading')
      }
      if (stepIndex === 7) {
        const construction = anchor('sq-p83-construction')
        for (const n of [2, 3, 4, 5]) {
          fireEvent.click(within(construction).getByRole('button', { name: 'الخطوة التالية' }))
          assert.ok(construction.querySelector(`svg[aria-label="رسم المربّع ABCD بعد الخطوة ${n}"]`), `construction board advances to step ${n}`)
        }
        assert.ok(construction.textContent?.includes('الخطوة 5 من 5'), 'construction counter reaches the fifth step')
        fireEvent.click(within(construction).getByRole('button', { name: 'الخطوة السابقة' }))
        assert.ok(construction.querySelector('svg[aria-label="رسم المربّع ABCD بعد الخطوة 4"]'), 'learner can step back through the construction')
        for (const index of [0, 1, 2, 3, 4]) assert.equal(construction.querySelectorAll('.sq-steps-list [data-source-id]')[index]?.getAttribute('data-source-id'), `sq-p83-step-${index + 1}`, `construction step ${index + 1} is anchored`)
        fireEvent.change(within(construction).getByRole('textbox', { name: 'طول DC بالسنتيمتر' }), { target: { value: '4' } })
        fireEvent.change(within(construction).getByRole('textbox', { name: 'قياس الزاوية D بالدرجات' }), { target: { value: '90' } })
        expectWrongThenCorrect(construction, 'تحقّق', 'construction check')
        assert.equal(construction.textContent?.includes('هكذا نتحقّق أن الرسم مربّع'), false, 'first wrong construction check does not reveal the full explanation')
        fireEvent.change(within(construction).getByRole('textbox', { name: 'طول DC بالسنتيمتر' }), { target: { value: '3' } })
        expectCorrect(construction, 'تحقّق', 'construction check')
        assert.ok(construction.textContent?.includes('هكذا نتحقّق أن الرسم مربّع'), 'correct check reveals the full verification')
      }
      if (stepIndex === 8) {
        const plan = anchor('sq-p84-check-draw')
        for (const side of ['AB', 'BC', 'CD', 'DA']) fireEvent.change(within(plan).getByRole('textbox', { name: `طول الضلع ${side} بالسنتيمتر` }), { target: { value: side === 'AB' ? '3' : '4' } })
        fireEvent.change(within(plan).getByRole('textbox', { name: 'عدد الزوايا القائمة' }), { target: { value: '4' } })
        expectWrongThenCorrect(plan, 'تحقّق من الخطة', 'drawing plan with one wrong side')
        assert.ok(plan.textContent?.includes('تلميح:'), 'first wrong planning attempt gets a hint')
        fireEvent.change(within(plan).getByRole('textbox', { name: 'طول الضلع AB بالسنتيمتر' }), { target: { value: '4' } })
        expectCorrect(plan, 'تحقّق من الخطة', 'drawing plan')
        assert.ok(anchor('sq-p84-check-draw-lengths').textContent?.includes('4cm'), 'the length branch keeps the printed 4cm answer')
        assert.ok(anchor('sq-p84-check-draw-tools').textContent?.includes('أربع خطوات'), 'the tools branch keeps the four-step plan')
        assert.ok(anchor('sq-p84-check-draw-angles').textContent?.includes('90°'), 'the angles branch keeps the four right angles')
      }
      if (stepIndex === 9) {
        const ex1 = anchor('sq-p84-ex1')
        for (const statement of p84Ex1Statements) {
          const item = anchor(statement.id)
          fireEvent.click(within(item).getByLabelText(statement.truth ? 'خطأ' : 'صح'))
        }
        expectWrongThenCorrect(ex1, 'تحقّق', 'true/false statements')
        for (const statement of p84Ex1Statements) {
          const item = anchor(statement.id)
          fireEvent.click(within(item).getByLabelText(statement.truth ? 'صح' : 'خطأ'))
        }
        expectCorrect(ex1, 'تحقّق', 'true/false statements')
      }
      if (stepIndex === 10) {
        const ex2 = anchor('sq-p84-ex2')
        const grid = ex2.querySelector<HTMLElement>('[data-platform-id="sq-platform-vertex"]')!
        assert.equal(grid.querySelectorAll('.sq-grid-node').length, (p84Ex2Grid.cols + 1) * (p84Ex2Grid.rows + 1), 'grid exposes every node as a button')
        fireEvent.click(within(grid).getByRole('button', { name: 'النقطة (2, 0)' }))
        fireEvent.click(within(grid).getByRole('button', { name: 'النقطة (2, 4)' }))
        expectWrongThenCorrect(grid, 'تحقّق من موقع W', 'wrong vertex placement')
        fireEvent.click(within(grid).getByRole('button', { name: `النقطة (${p84Ex2Grid.Z.c}, ${p84Ex2Grid.Z.r})` }))
        fireEvent.click(within(grid).getByRole('button', { name: `النقطة (${p84Ex2Grid.W.c}, ${p84Ex2Grid.W.r})` }))
        expectCorrect(grid, 'تحقّق من موقع W', 'fourth vertex W')
        for (const id of ['sq-p84-ex2-z', 'sq-p84-ex2-w']) assert.ok(anchor(id).textContent?.includes('العمود'), `${id} explains the perpendicular construction`)
      }
      if (stepIndex === 11) {
        for (const item of p84Ex3Cases) {
          const task = anchor(item.id)
          for (const name of item.names) assert.ok(within(task).getByLabelText(name), `${item.id} offers ${name}`)
          fireEvent.click(within(task).getByLabelText('شبه المنحرف'))
          fireEvent.click(within(task).getAllByRole('radio')[1]!)
          expectWrongThenCorrect(task, 'تحقّق', `${item.id} naming`)
          fireEvent.click(within(task).getByLabelText('شبه المنحرف'))
          for (const name of item.answer) fireEvent.click(within(task).getByLabelText(name))
          fireEvent.click(within(task).getAllByRole('radio')[0]!)
          expectCorrect(task, 'تحقّق', `${item.id} naming`)
        }
      }
      if (stepIndex === 12) {
        const ex4 = anchor('sq-p84-ex4')
        assert.ok(panel().querySelector('svg[aria-label*="WVUT"]'), 'composite figure carries the printed squares and rectangle')
        for (const item of p84Ex4Lengths) fireEvent.change(within(ex4).getByRole('textbox', { name: `طول ${item.label} بالسنتيمتر` }), { target: { value: String(item.answer + (item.label === 'RS' ? 1 : 0)) } })
        expectWrongThenCorrect(ex4, 'تحقّق', 'composite lengths with one wrong value')
        assert.ok(ex4.textContent?.includes('تلميح:'), 'first wrong composite attempt gets a hint')
        assert.equal(ex4.textContent?.includes('RS = WQ = XP = 2cm'), false, 'first wrong composite attempt does not reveal the worked solution')
        fireEvent.change(within(ex4).getByRole('textbox', { name: 'طول RS بالسنتيمتر' }), { target: { value: '2' } })
        expectCorrect(ex4, 'تحقّق', 'composite lengths')
        assert.ok(ex4.textContent?.includes('XS = XW + WS = 2 + 5 = 7cm'), 'the worked explanation reconstructs XS from its parts')
        for (const item of p84Ex4Lengths) anchor(item.id)
      }
      if (stepIndex === 13) {
        assert.ok(screen.getByRole('link', { name: /ابدأ اختبار الدرس/u }).getAttribute('href') === '#tests/run/lesson-square-test', 'student can discover the independent lesson test')
        assert.ok(screen.getByRole('link', { name: /اختبار الوحدة الثانية/u }).getAttribute('href') === '#tests/run/unit-unit-2-test', 'student can discover the Unit 2 test')
        assert.ok(panel().textContent?.includes('ما الذي أضافته المنصة'), 'summary separates platform additions from the book')
        assert.ok(panel().textContent?.includes('الرسم · ص 83'), 'summary keeps the printed page references')
      }
      if (stepIndex < stepCount - 1) next()
    }
    assert.equal(new Set(titles).size, stepCount, 'every step has a distinct title')
    const missingIds = flattenSquareCoverageIds().filter((id) => !seen.has(id))
    assert.deepEqual(missingIds, [], 'all 59 textbook source blocks and exercise branches are visible across the lesson steps')
    assert.equal(seen.size, flattenSquareCoverageIds().length, 'the lesson mounts no source anchors outside the ledger')
    for (const id of ['sq-platform-tiling', 'sq-platform-definition-lab', 'sq-platform-properties', 'sq-platform-vertex', 'sq-platform-summary']) assert.ok(platformSeen.has(id), `${id} platform activity is mounted`)
    assert.ok(sawIsolatedMath, 'geometry notation uses isolated LTR boundaries')
    previous()
    assert.equal(document.querySelector('.lesson-progress-track')?.getAttribute('aria-valuenow'), String(stepCount - 1), 'learner can navigate back a step')
    assert.ok(document.querySelector('.lesson-outline-mobile'), 'responsive lesson outline retains its mobile navigation')

    window.sessionStorage.setItem('teacher-area-unlocked', 'true')
    navigate('#teacher/square')
    assert.ok(screen.getByText('دليل درس: المربّع'), 'teacher direct route selects the new guide')
    const teacherCards = [...document.querySelectorAll<HTMLElement>('.teacher-entry')]
    assert.equal(teacherCards.length, squareAllTeacherEntries.length, 'teacher page renders every source solution, platform guide and test solution')
    assert.equal(teacherCards.length, squareTeacherEntries.length + squarePlatformTeacherEntries.length + squareTestTeacherEntries.length)
    const ids = teacherCards.map((card) => card.dataset.sourceId)
    assert.equal(new Set(ids).size, ids.length, 'teacher solution ids are unique')
    for (const page of [81, 82, 83, 84]) assert.ok(document.body.textContent?.includes(`المصدر: الكتاب — ص ${page}`), `teacher guide identifies source page ${page}`)
    assert.equal(screen.getAllByText('نشاط تفاعلي إضافي').length, squarePlatformTeacherEntries.length + squareTestTeacherEntries.length, 'platform and test solutions are labelled separately from the book')
    assert.ok(document.body.textContent?.includes('خطوات الحل والتفسير إضافات تعليمية'), 'teacher guide separates source from platform explanation')
    assert.ok(document.body.textContent?.includes('الرسم المطبوع قطعة واحدة'), 'teacher guide discloses the p. 84 drawing note')

    navigate('#tests/solutions/lesson-square-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول غير متاحة قبل التسليم' }), 'answer key is inaccessible before submission')
    assert.equal(screen.queryByRole('heading', { name: 'الإجابة النهائية' }), null)
    navigate('#tests/run/lesson-square-test')
    assert.ok(screen.getByRole('heading', { name: 'اختبار المربّع' }), 'independent lesson test route opens')
    assert.ok(screen.getByText(/تعريف صحيح للمربّع/u), 'test starts with a lesson-relevant question')
    assert.equal(document.body.textContent?.includes('الخطأ الشائع'), false, 'solution hints remain hidden in the student runner')
    assert.equal(document.body.textContent?.includes('«أضلاعه متساوية فقط» تصف المعيّن'), false, 'worked solution steps are not printed in the runner')
    const registryModule = await vite.ssrLoadModule('/src/tests/registry.ts') as { testRegistry: { lessonTests: readonly { id: string }[]; unitTests: readonly { unitId?: string }[] } }
    assert.ok(registryModule.testRegistry.lessonTests.some((test) => test.id === 'lesson-square-test'), 'strict test discovery registers the lesson test')
    assert.ok(registryModule.testRegistry.unitTests.some((test) => test.unitId === 'unit-2'), 'the separate Unit 2 test is registered')
    navigate('#tests/run/unit-unit-2-test')
    assert.ok(screen.getByRole('heading', { name: 'اختبار الوحدة الثانية' }), 'Unit 2 test runs from its own route')
    console.log(`PASS lesson 10 interaction: ${stepCount} steps, ${flattenSquareCoverageIds().length} ledger anchors, tiling/definitions/seven-figure sorters/justifications/properties/oral/construction/plan/true-false/grid/naming/composite, teacher guide (${teacherCards.length} entries), protected lesson quiz and a separate Unit 2 test.`)
  } finally { await vite.close() }
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
