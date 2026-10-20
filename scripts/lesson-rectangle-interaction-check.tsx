import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import {
  flattenRectangleCoverageIds, p77Shapes, p78Check1Shapes, p78Check2Shapes, p79Steps, p80Ex2Statements, p80Ex3Grid, p80Ex4Lengths,
  rectangleAllTeacherEntries, rectanglePlatformTeacherEntries, rectangleTeacherEntries, rectangleTestTeacherEntries,
} from '../src/lessons/rectangleData'

/**
 * Unit 2 · Lesson 9 — المستطيل. Drives the real App through every step in jsdom: each interactive
 * task is answered until it reports success, every ledger anchor must be mounted, and the teacher
 * guide and the protected lesson test are reached through their routes.
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
    navigate('#lesson/rectangle')
    assert.ok(screen.getByRole('heading', { name: 'المستطيل', level: 1 }), 'the lesson route resolves the Unit 2 lesson')
    assert.ok(within(screen.getByRole('navigation', { name: 'مسار الدرس' })).getByText('الوحدة الثانية'), 'shared shell identifies the correct unit')
    assert.ok(document.querySelector('.lesson-shell.lesson-rectangle'), 'lesson mounts its own theme class')
    const panel = () => document.querySelector<HTMLElement>('.lesson-step-panel')!
    const next = () => fireEvent.click(document.querySelector<HTMLButtonElement>('.lesson-navigation .is-next')!)
    const previous = () => fireEvent.click(document.querySelector<HTMLButtonElement>('.lesson-navigation .is-previous')!)
    const anchor = (id: string) => {
      const node = panel().querySelector<HTMLElement>(`[data-source-id="${id}"]`)
      assert.ok(node, `${id} is rendered in the current step`)
      return node!
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
    assert.equal(stepCount, 13, 'lesson is divided into thirteen short navigable steps')
    const titles: string[] = []

    for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
      titles.push(document.querySelector('#lesson-section-title')?.textContent ?? '')
      panel().querySelectorAll<HTMLElement>('[data-source-id]').forEach((node) => seen.add(node.dataset.sourceId ?? ''))
      panel().querySelectorAll<HTMLElement>('[data-platform-id]').forEach((node) => platformSeen.add(node.dataset.platformId ?? ''))
      sawIsolatedMath ||= Boolean(panel().querySelector('.math-expression[dir="ltr"]'))
      assert.ok(panel().querySelectorAll('.rect-page-tag').length > 0 || stepIndex === stepCount - 1, `step ${stepIndex + 1} shows its textbook page tag`)
      assert.equal(panel().textContent?.includes('انظر الكتاب'), false, 'no step defers the learner to the book')

      if (stepIndex === 0) {
        assert.ok(anchor('rect-p77-goals').textContent?.includes('تعريف المستطيل'), 'goals card lists the printed objectives')
        const flag = anchor('rect-p77-flag')
        assert.ok(flag.textContent?.includes('ثلثي طوله'), 'flag text is quoted verbatim')
        assert.ok(flag.textContent?.includes('ملاحظة من المنصة'), 'text/image discrepancy is disclosed as a platform note')
        assert.ok(flag.querySelector('svg[aria-label*="ثلاث نجوم"]'), 'flag figure follows the printed picture')
        const ratio = flag.querySelector<HTMLElement>('[data-platform-id="rect-platform-flag-ratio"]')!
        fireEvent.change(within(ratio).getByRole('textbox', { name: 'عرض العلم بالسنتيمتر' }), { target: { value: '30' } })
        expectWrongThenCorrect(ratio, 'تحقّق', 'flag ratio')
        assert.equal(ratio.textContent?.includes('30 × 2 = 60'), false, 'first wrong attempt shows a hint, not the answer')
        fireEvent.change(within(ratio).getByRole('textbox', { name: 'عرض العلم بالسنتيمتر' }), { target: { value: '45' } })
        expectWrongThenCorrect(ratio, 'تحقّق', 'flag ratio (second attempt)')
        assert.ok(ratio.textContent?.includes('الشرح الكامل بعد محاولتين') && ratio.textContent?.includes('30 × 2 = 60'), 'second wrong attempt reveals the full explanation')
        fireEvent.change(within(ratio).getByRole('textbox', { name: 'عرض العلم بالسنتيمتر' }), { target: { value: '60' } })
        expectCorrect(ratio, 'تحقّق', 'flag ratio')
      }
      if (stepIndex === 1) {
        assert.equal(panel().querySelectorAll('.rect-shape-card svg').length, 4, 'all four opening figures render')
        const q1 = anchor('rect-p77-opening-q1')
        for (const shape of p77Shapes) assert.ok(within(q1).getByLabelText(`الشكل (${shape.number})`), `${shape.id} is an answerable option`)
        fireEvent.click(within(q1).getByLabelText('الشكل (2)'))
        expectWrongThenCorrect(q1, 'تحقّق', 'opening question 1')
        fireEvent.click(within(q1).getByLabelText('الشكل (2)'))
        fireEvent.click(within(q1).getByLabelText('الشكل (1)'))
        fireEvent.click(within(q1).getByLabelText('الشكل (4)'))
        expectCorrect(q1, 'تحقّق', 'opening question 1')
        const q2 = anchor('rect-p77-opening-q2')
        fireEvent.change(within(q2).getByLabelText('الشكل (1)'), { target: { value: 'مستطيل' } })
        fireEvent.change(within(q2).getByLabelText('الشكل (4)'), { target: { value: 'مربع' } })
        expectCorrect(q2, 'تحقّق', 'opening question 2')
      }
      if (stepIndex === 2) {
        assert.ok(anchor('rect-p77-definition').textContent?.includes('هو متوازي الأضلاع فيه زاوية قائمة'), 'definition is quoted')
        const lab = panel().querySelector<HTMLElement>('[data-platform-id="rect-platform-angle-lab"]')!
        assert.ok(lab.textContent?.includes('ما زال متوازي أضلاع فقط'), 'angle lab starts as a non-rectangle')
        fireEvent.change(within(lab).getByRole('slider', { name: 'قياس الزاوية D بالدرجات' }), { target: { value: '90' } })
        assert.ok(lab.textContent?.includes('زاوية قائمة واحدة كفت'), 'angle lab recognises the rectangle at 90°')
        assert.equal([...lab.querySelectorAll('.rect-lab-readout div')].filter((node) => node.textContent?.includes('90°')).length, 4, 'all four angles read 90°')
        fireEvent.change(within(lab).getByRole('slider', { name: 'قياس الزاوية D بالدرجات' }), { target: { value: '60' } })
        fireEvent.click(within(lab).getByRole('button', { name: /اجعل الزاوية قائمة/u }))
        assert.ok(lab.textContent?.includes('زاوية قائمة واحدة كفت'), 'the shortcut button snaps to 90°')
      }
      if (stepIndex === 3) {
        const example = anchor('rect-p78-example')
        const exampleText = example.textContent?.normalize('NFD') ?? ''
        assert.ok(exampleText.includes('AD ∥ BC') && exampleText.includes('Â = B̂ = Ĉ = D̂ = 90°'.normalize('NFD')), 'worked example keeps the printed reasoning (angle hats stay in the DOM text)')
        assert.ok(example.querySelectorAll('.rect-hat').length >= 4, 'angle hats are drawn with the font-independent CSS hat')
        assert.ok(example.textContent?.includes('شرح إضافي من المنصة'), 'the extra justification is labelled as a platform addition')
      }
      if (stepIndex === 4) {
        for (const shape of p78Check1Shapes) {
          const task = anchor(shape.id)
          fireEvent.click(within(task).getByLabelText('أضلاعه الأربعة متساوية في الطول'))
          expectWrongThenCorrect(task, 'تحقّق', `${shape.id} justification`)
          fireEvent.click(within(task).getByLabelText('أضلاعه الأربعة متساوية في الطول'))
          fireEvent.click(within(task).getByLabelText('كل ضلعين متقابلين فيه متوازيان، فهو متوازي أضلاع'))
          fireEvent.click(within(task).getByLabelText('فيه زاوية قائمة معلّمة'))
          expectCorrect(task, 'تحقّق', `${shape.id} justification`)
        }
      }
      if (stepIndex === 5) {
        const reasons: Record<string, string> = {
          'no-right': 'هو متوازي أضلاع، لكن لا توجد فيه زاوية قائمة',
          'not-parallelogram-one-pair': 'فيه زاوية قائمة، لكن فيه زوجاً واحداً فقط من الأضلاع المتوازية فليس متوازي أضلاع',
          'no-parallel': 'فيه زاويتان قائمتان، لكن لا يوجد فيه أي ضلعين متوازيين فليس متوازي أضلاع',
        }
        for (const shape of p78Check2Shapes) {
          const task = anchor(shape.id)
          fireEvent.click(within(task).getByLabelText('هو مستطيل فعلاً'))
          expectWrongThenCorrect(task, 'تحقّق', `${shape.id} why-not`)
          fireEvent.click(within(task).getByLabelText(reasons[shape.reason]))
          expectCorrect(task, 'تحقّق', `${shape.id} why-not`)
        }
      }
      if (stepIndex === 6) {
        const properties = anchor('rect-p78-properties')
        assert.ok(properties.textContent?.includes('زوايا المستطيل الأربع قائمة'), 'property card quotes the added property')
        const task = properties.querySelector<HTMLElement>('[data-platform-id="rect-platform-properties"]')!
        for (const label of ['كل ضلعين متقابلين متوازيان', 'كل ضلعين متقابلين متساويان في الطول', 'كل زاويتين متقابلتين متساويتان', 'زواياه الأربع قائمة']) fireEvent.click(within(task).getByLabelText(label))
        expectCorrect(task, 'تحقّق', 'properties multi-select')
        const oral = anchor('rect-p78-oral')
        fireEvent.click(within(oral).getByLabelText('عندما يتساوى ضلعان متجاوران'))
        expectWrongThenCorrect(oral, 'تحقّق', 'oral expression')
        fireEvent.click(within(oral).getByLabelText('عندما تكون فيه زاوية قائمة'))
        expectCorrect(oral, 'تحقّق', 'oral expression')
      }
      if (stepIndex === 7) {
        const construction = anchor('rect-p79-construction')
        for (const step of p79Steps) assert.ok(anchor(step.id).textContent?.includes(step.text.slice(0, 20)), `${step.id} text is printed`)
        for (const n of [2, 3, 4, 5]) {
          fireEvent.click(within(construction).getByRole('button', { name: `الخطوة ${n}` }))
          assert.ok(construction.querySelector(`svg[aria-label="رسم المستطيل ABCD بعد الخطوة ${n}"]`), `construction board advances to step ${n}`)
        }
        assert.ok(construction.textContent?.normalize('NFD').includes('D̂ = Ĉ = 90°'.normalize('NFD')), 'final construction step shows the protractor check')
        fireEvent.click(within(construction).getByRole('button', { name: /الخطوة السابقة/u }))
        assert.ok(construction.querySelector('svg[aria-label="رسم المستطيل ABCD بعد الخطوة 4"]'), 'learner can step back through the construction')
      }
      if (stepIndex === 8) {
        const order = panel().querySelector<HTMLElement>('[data-platform-id="rect-platform-step-order"]')!
        expectWrongThenCorrect(order, 'تحقّق من الترتيب', 'shuffled construction steps')
        const currentOrder = () => [...order.querySelectorAll('.rect-order-list li')].map((item) => p79Steps.findIndex((step) => item.textContent?.includes(step.text.slice(0, 24))) + 1)
        for (let target = 0; target < p79Steps.length; target += 1) {
          let position = currentOrder().indexOf(target + 1)
          while (position > target) {
            const item = order.querySelectorAll('.rect-order-list li')[position]
            fireEvent.click(within(item as HTMLElement).getByRole('button', { name: /إلى الأعلى/u }))
            position = currentOrder().indexOf(target + 1)
          }
        }
        assert.deepEqual(currentOrder(), [1, 2, 3, 4, 5], 'move buttons reorder the steps')
        expectCorrect(order, 'تحقّق من الترتيب', 'ordered construction steps')
        const plan = anchor('rect-p80-check-draw')
        for (const [side, value] of [['XY', '4'], ['YZ', '3'], ['ZW', '4'], ['WX', '3']]) fireEvent.change(within(plan).getByRole('textbox', { name: `طول الضلع ${side} بالسنتيمتر` }), { target: { value } })
        fireEvent.click(within(plan).getByLabelText('عند إقامة العمودين على [XY] من X ومن Y'))
        fireEvent.change(within(plan).getByRole('textbox', { name: 'عدد الزوايا القائمة' }), { target: { value: '4' } })
        expectCorrect(plan, 'تحقّق من الخطة', 'XYZW drawing plan')
        for (const id of ['rect-p80-check-draw-lengths', 'rect-p80-check-draw-tools', 'rect-p80-check-draw-angles']) anchor(id)
      }
      if (stepIndex === 9) {
        const ex1 = anchor('rect-p80-ex1')
        assert.ok(ex1.querySelector('svg[aria-label*="CB يساوي 2cm"]'), 'تدرّب ① figure keeps the printed measurements')
        fireEvent.change(within(ex1).getByLabelText('الفراغ أ'), { target: { value: 'DC' } })
        fireEvent.change(within(ex1).getByLabelText('الفراغ ب'), { target: { value: 'AD' } })
        fireEvent.change(within(ex1).getByLabelText('الفراغ ت بالسنتيمتر'), { target: { value: '4' } })
        fireEvent.change(within(ex1).getByLabelText('الفراغ ث: الضلع'), { target: { value: 'BC' } })
        fireEvent.change(within(ex1).getByLabelText('الفراغ ث بالسنتيمتر'), { target: { value: '2' } })
        fireEvent.change(within(ex1).getByLabelText('الفراغ ج: الزاوية الأولى'), { target: { value: 'D̂' } })
        fireEvent.change(within(ex1).getByLabelText('الفراغ ج: الزاوية الثانية'), { target: { value: 'Ĉ' } })
        fireEvent.change(within(ex1).getByLabelText('قياس الزاوية بالدرجات'), { target: { value: '90' } })
        expectCorrect(ex1, 'تحقّق', 'تدرّب ① blanks (order-insensitive angle pair)')
        const ex2 = anchor('rect-p80-ex2')
        for (const statement of p80Ex2Statements) fireEvent.click(within(anchor(statement.id)).getByLabelText(statement.truth ? 'صح' : 'خطأ'))
        expectCorrect(ex2, 'تحقّق', 'تدرّب ② true/false')
      }
      if (stepIndex === 10) {
        const partA = anchor('rect-p80-ex3-a')
        assert.ok(partA.querySelectorAll('.rect-grid-node').length === (p80Ex3Grid.cols + 1) * (p80Ex3Grid.rows + 1), 'grid exposes every node as a button')
        fireEvent.click(within(partA).getByRole('button', { name: `النقطة (${p80Ex3Grid.X.c}, ${p80Ex3Grid.Z.r + 1})` }))
        expectWrongThenCorrect(partA, 'تحقّق من موقع W', 'wrong fourth vertex')
        fireEvent.click(within(partA).getByRole('button', { name: `النقطة (${p80Ex3Grid.W.c}, ${p80Ex3Grid.W.r})` }))
        expectCorrect(partA, 'تحقّق من موقع W', 'fourth vertex W')
        const partB = anchor('rect-p80-ex3-b')
        fireEvent.click(within(partB).getByRole('button', { name: /أقم العمود من X/u }))
        fireEvent.click(within(partB).getByRole('button', { name: /صل Z بـ W/u }))
        assert.ok(partB.textContent?.includes('اكتمل المستطيل XYZW'), 'completing the drawing closes the rectangle')
        const partT = anchor('rect-p80-ex3-t')
        fireEvent.click(within(partT).getByLabelText(/زوايا المستطيل قائمة/u))
        fireEvent.click(within(partT).getByLabelText(/كل ضلعين متقابلين متوازيان ومتساويان/u))
        expectCorrect(partT, 'تحقّق', 'properties used for W')
      }
      if (stepIndex === 11) {
        const ex4 = anchor('rect-p80-ex4')
        for (const item of p80Ex4Lengths) fireEvent.change(within(ex4).getByRole('textbox', { name: `طول ${item.label} بالسنتيمتر` }), { target: { value: String(item.answer + (item.label === 'FE' ? 1 : 0)) } })
        expectWrongThenCorrect(ex4, 'تحقّق', 'composite lengths with one wrong value')
        assert.ok(ex4.textContent?.includes('تلميح:'), 'first wrong attempt gets a hint')
        assert.equal(ex4.textContent?.includes('FE = FB − EB'), false, 'first wrong attempt does not reveal the worked solution')
        fireEvent.change(within(ex4).getByRole('textbox', { name: 'طول FE بالسنتيمتر' }), { target: { value: '3' } })
        expectCorrect(ex4, 'تحقّق', 'composite lengths')
        assert.ok(ex4.textContent?.includes('FE = FB − EB'), 'correct answer reveals the full explanation')
        for (const item of p80Ex4Lengths) anchor(item.id)
      }
      if (stepIndex === 12) {
        assert.ok(screen.getByRole('link', { name: /ابدأ اختبار الدرس/u }).getAttribute('href') === '#tests/run/lesson-rectangle-test', 'student can discover the independent lesson test')
        assert.ok(panel().textContent?.includes('ما الذي أضافته المنصة'), 'summary separates platform additions from the book')
      }
      if (stepIndex < stepCount - 1) next()
    }
    assert.equal(new Set(titles).size, stepCount, 'every step has a distinct title')
    const missingIds = flattenRectangleCoverageIds().filter((id) => !seen.has(id))
    assert.deepEqual(missingIds, [], 'all 50 textbook source blocks and exercise branches are visible across the lesson steps')
    for (const id of ['rect-platform-flag-ratio', 'rect-platform-angle-lab', 'rect-platform-properties', 'rect-platform-step-order', 'rect-platform-summary']) assert.ok(platformSeen.has(id), `${id} platform activity is mounted`)
    assert.ok(sawIsolatedMath, 'geometry notation uses isolated LTR boundaries')
    previous()
    assert.equal(document.querySelector('.lesson-progress-track')?.getAttribute('aria-valuenow'), String(stepCount - 1), 'learner can navigate back a step')
    assert.ok(document.querySelector('.lesson-outline-mobile'), 'responsive lesson outline retains its mobile navigation')

    window.sessionStorage.setItem('teacher-area-unlocked', 'true')
    navigate('#teacher/rectangle')
    assert.ok(screen.getByText('دليل درس: المستطيل'), 'teacher direct route selects the new guide')
    const teacherCards = [...document.querySelectorAll<HTMLElement>('.teacher-entry')]
    assert.equal(teacherCards.length, rectangleAllTeacherEntries.length, 'teacher page renders every source solution, platform guide and test solution')
    assert.equal(teacherCards.length, rectangleTeacherEntries.length + rectanglePlatformTeacherEntries.length + rectangleTestTeacherEntries.length)
    const ids = teacherCards.map((card) => card.dataset.sourceId)
    assert.equal(new Set(ids).size, ids.length, 'teacher solution ids are unique')
    for (const page of [77, 78, 79, 80]) assert.ok(document.body.textContent?.includes(`المصدر: الكتاب — ص ${page}`), `teacher guide identifies source page ${page}`)
    assert.equal(screen.getAllByText('نشاط تفاعلي إضافي').length, rectanglePlatformTeacherEntries.length + rectangleTestTeacherEntries.length, 'platform and test solutions are labelled separately from the book')
    assert.ok(document.body.textContent?.includes('خطوات الحل والتفسير إضافات تعليمية'), 'teacher guide separates source from platform explanation')
    assert.ok(document.body.textContent?.includes('صورة العلم المطبوعة'), 'teacher guide discloses the p. 77 flag discrepancy')

    navigate('#tests/solutions/lesson-rectangle-test/1')
    assert.ok(screen.getByRole('heading', { name: 'الحلول غير متاحة قبل التسليم' }), 'answer key is inaccessible before submission')
    assert.equal(screen.queryByRole('heading', { name: 'الإجابة النهائية' }), null)
    navigate('#tests/run/lesson-rectangle-test')
    assert.ok(screen.getByRole('heading', { name: 'اختبار المستطيل' }), 'independent lesson test route opens')
    assert.ok(screen.getByText(/تصلح تعريفاً للمستطيل/u), 'test starts with a lesson-relevant question')
    assert.equal(document.body.textContent?.includes('الخطأ الشائع'), false, 'solution hints remain hidden in the student runner')
    assert.equal(document.body.textContent?.includes('متوازي أضلاع فيه زاوية قائمة.'), false, 'final answers are not printed in the runner')
    const registryModule = await vite.ssrLoadModule('/src/tests/registry.ts') as { testRegistry: { lessonTests: readonly { id: string }[]; unitTests: readonly { unitId?: string }[] } }
    assert.ok(registryModule.testRegistry.lessonTests.some((test) => test.id === 'lesson-rectangle-test'), 'strict test discovery registers the lesson test')
    assert.ok(registryModule.testRegistry.unitTests.some((test) => test.unitId === 'unit-2'), 'the separate Unit 2 test is registered now that Unit 2 is complete')
    console.log(`PASS lesson 9 interaction: ${stepCount} steps, ${flattenRectangleCoverageIds().length} ledger anchors, flag ratio/sorter/angle lab/justifications/properties/construction/ordering/plan/blanks/true-false/grid/composite, teacher guide (${teacherCards.length} entries) and protected lesson quiz.`)
  } finally { await vite.close() }
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
