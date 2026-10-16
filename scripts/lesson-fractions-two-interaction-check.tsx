/**
 * Unit 2 · Lesson 5 interaction check (jsdom + Testing Library, real App tree).
 * Clicks through the lesson like a student: division lab (empty/invalid, zero remainder, proper fraction),
 * build lab (whole part must be ≥ 1), cake lab (whole-number readout), and the ambiguous printed «5».
 * Run manually: `npx tsx scripts/lesson-fractions-two-interaction-check.tsx`.
 */
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

function fail(message: string): never {
  console.error(`❌ ${message}`)
  process.exit(1)
}
const assert = (condition: unknown, message: string): void => { if (!condition) fail(message) }

async function main() {
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', { url: 'http://localhost/Interactive-Mathematics-Grade5/#top', pretendToBeVisual: true })
  const { window } = dom
  Object.assign(globalThis, {
    window, document: window.document,
    sessionStorage: window.sessionStorage, localStorage: window.localStorage,
    HTMLElement: window.HTMLElement, SVGElement: window.SVGElement, Node: window.Node,
    getComputedStyle: window.getComputedStyle, requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0),
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

  const React = await import('react')
  const { act } = React
  const { render, screen, fireEvent, within } = await import('@testing-library/react')
  const vite = await createServer({ configFile: 'vite.config.ts', server: { middlewareMode: true }, appType: 'custom' })
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')

  const goTo = (hash: string) => { act(() => { window.location.hash = hash; window.dispatchEvent(new window.Event('hashchange')) }) }
  render(<App />)
  goTo('#lesson/fractions-two')
  const panel = () => document.querySelector('.lesson-step-panel') as HTMLElement
  assert(panel(), 'lesson panel renders')
  assert(panel().textContent?.includes('الكسور (2)') || document.body.textContent?.includes('الكسور (2)'), 'lesson title present')

  const clickNext = () => fireEvent.click(screen.getByRole('button', { name: /التالي/ }))
  const stepHas = (selector: string) => document.querySelector(selector) !== null
  // Visit every step once; remember the step that hosts each lab.
  const stepOf: Record<string, number> = {}
  for (let step = 0; step < 8; step++) {
    for (const selector of ['.l25-cake-lab', '.l25-classify-lab', '.l25-division-lab', '.l25-build-lab']) {
      if (stepHas(selector)) stepOf[selector] = step
    }
    if (step < 7) clickNext()
  }
  for (const selector of ['.l25-cake-lab', '.l25-classify-lab', '.l25-division-lab', '.l25-build-lab']) {
    assert(stepOf[selector] !== undefined, `${selector} is reachable in the lesson`)
  }
  console.log('✅ labs reachable:', JSON.stringify(stepOf))

  const goToStep = (index: number) => {
    // Lesson shell has no direct step buttons in the nav; go back to step 0 and step forward.
    for (let i = 0; i < 10; i++) fireEvent.click(screen.getByRole('button', { name: /السابق/ }))
    for (let i = 0; i < index; i++) clickNext()
  }

  // ---- Division lab: empty/invalid input, zero remainder, proper fraction, whole-number and improper results ----
  goToStep(stepOf['.l25-division-lab'])
  const divLab = document.querySelector('.l25-division-lab') as HTMLElement
  const divInputs = within(divLab).getAllByRole('textbox') as HTMLInputElement[]
  const [numInput, denInput] = divInputs
  const setDiv = (n: string, d: string) => { fireEvent.change(numInput, { target: { value: n } }); fireEvent.change(denInput, { target: { value: d } }) }
  const labText = () => divLab.textContent ?? ''
  const noLinear = (text: string) => !/\d\s*\/\s*\d/u.test(text)

  setDiv('', '4')
  assert(labText().includes('أدخل بسطاً'), 'empty numerator shows the input error')
  assert(divLab.querySelector('[role="alert"]'), 'empty numerator sets role=alert')
  setDiv('3', '0')
  assert(labText().includes('مقاماً أكبر من صفر'), 'zero denominator is rejected')
  setDiv('3', '4')
  assert(!divLab.querySelector('[role="alert"]'), 'valid input clears the error')
  assert(labText().includes('أصغر من 1') && labText().includes('يبقى كسراً عادياً'), 'proper fraction 3/4 stays an ordinary fraction')
  assert(!/و0/u.test(labText()), 'proper fraction is never written as 0 and a fraction')
  setDiv('8', '4')
  assert(labText().includes('والباقي صفر') && labText().includes('فالناتج عدد صحيح'), '8/4 gives whole number with zero remainder')
  setDiv('5', '1')
  assert(labText().includes('والباقي صفر'), '5/1 gives zero remainder')
  setDiv('9', '4')
  assert(divLab.querySelector('[role="img"][aria-label="2 و1 على 4"]'), '9/4 reads as 2 and 1/4 in the mixed readout')
  assert(noLinear(labText()), 'division lab text never shows a linear a/b')
  console.log('✅ division lab: empty/invalid, zero remainder, proper, mixed results')

  // ---- Build lab: whole part must be ≥ 1 ----
  goToStep(stepOf['.l25-build-lab'])
  const buildLab = document.querySelector('.l25-build-lab') as HTMLElement
  const [wInput, bn, bd] = within(buildLab).getAllByRole('textbox') as HTMLInputElement[]
  fireEvent.change(wInput, { target: { value: '0' } })
  fireEvent.change(bn, { target: { value: '3' } }); fireEvent.change(bd, { target: { value: '4' } })
  assert(buildLab.textContent?.includes('العدد الصحيح 1 فأكثر'), 'whole part 0 is rejected with a message')
  fireEvent.change(wInput, { target: { value: '2' } })
  fireEvent.change(bn, { target: { value: '1' } }); fireEvent.change(bd, { target: { value: '4' } })
  assert(buildLab.querySelector('[role="status"] [role="img"][aria-label="9 على 4"]'), '2 1/4 becomes 9/4 in the build lab')
  assert(noLinear(buildLab.textContent ?? ''), 'build lab text never shows a linear a/b')
  console.log('✅ build lab: whole part ≥ 1 enforced, 2 1/4 = 9/4')

  // ---- Cake lab: whole-number readout ----
  goToStep(stepOf['.l25-cake-lab'])
  const cakeLab = document.querySelector('.l25-cake-lab') as HTMLElement
  const slider = within(cakeLab).getByRole('slider') as HTMLInputElement
  fireEvent.change(slider, { target: { value: '8' } })
  const cakeModel = cakeLab.querySelector('.l25-cake-model') as HTMLElement
  assert(cakeModel && /قالب كامل/u.test(cakeModel.getAttribute('aria-label') ?? ''), 'cake with 8 pieces names whole cakes')
  assert(!/و0 قطع/u.test(cakeModel.getAttribute('aria-label') ?? ''), 'cake readout never says "and 0 pieces"')
  console.log('✅ cake lab: whole-number readout clean')

  // ---- Ambiguous printed item «ح» (bare 5) ----
  goToStep(stepOf['.l25-classify-lab'])
  const amb = document.querySelector('article[data-source-id="b59-c-h"]') as HTMLElement
  assert(amb, 'ambiguous item article exists in the classify lab')
  const group = within(amb).getByRole('group', { name: /نوع الكسر/u })
  within(group).getByRole('button', { name: 'لا يمكن الحسم من النص المطبوع' })
  fireEvent.click(within(group).getByRole('button', { name: 'لا يمكن الحسم من النص المطبوع' }))
  fireEvent.click(within(amb).getByRole('button', { name: /تحقّق/u }))
  const feedback = amb.querySelector('[role="status"]') as HTMLElement
  assert(feedback && feedback.textContent?.includes('لا يُحسب هذا البند'), 'ambiguous item shows neutral feedback')
  assert(!feedback.textContent?.includes('إجابة صحيحة') && !feedback.textContent?.includes('ليست صحيحة'), 'ambiguous item is never marked correct or incorrect')
  // A student choosing "ordinary" also gets neutral feedback (no penalty).
  fireEvent.click(within(group).getByRole('button', { name: 'كسر عادي' }))
  fireEvent.click(within(amb).getByRole('button', { name: /تحقّق/u }))
  assert(!(amb.querySelector('[role="status"]')?.textContent ?? '').includes('ليست صحيحة'), 'choosing ordinary on the ambiguous item is not marked wrong')
  console.log('✅ ambiguous item «ح»: neutral, never scored correct/incorrect')

  // ---- Linear-fraction guard across the whole lesson ----
  for (let i = 0; i < 8; i++) {
    goToStep(i)
    const body = document.querySelector('.lesson-step-panel')?.textContent ?? ''
    assert(!/\d\/\d/u.test(body), `step ${i} shows no linear a/b fraction in visible text`)
  }
  console.log('✅ no linear a/b in any lesson step text')

  console.log('PASS fractions-two interaction check')
  process.exit(0)
}

main().catch((error) => fail(String(error?.stack ?? error)))
