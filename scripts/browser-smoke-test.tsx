/**
 * A jsdom + Testing Library interaction smoke test used ONLY for local verification in this
 * sandbox (no real Chromium is reachable here). It renders the real App component tree, clicks
 * through every lesson step exactly like a student would, unlocks Teacher Area, and checks the
 * RTL/LTR boundaries in the actual rendered DOM. Not part of `npm run build`; run manually with
 * `npx tsx scripts/browser-smoke-test.tsx`. jsdom/@testing-library are dev-only, not committed.
 */
import { JSDOM } from 'jsdom'

function fail(message: string): never {
  console.error(`❌ ${message}`)
  process.exit(1)
}

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
  const { default: App } = await import('../src/App')

  const goTo = (hash: string) => { act(() => { window.location.hash = hash; window.dispatchEvent(new window.Event('hashchange')) }) }

  render(<App />)
  console.log('✅ App mounted at Home (#top)')

  // ---- Home: both lessons listed and available ----
  if (!screen.getByText('شبكة الإحداثيات')) fail('Lesson 1 title missing from Home')
  if (!screen.getByText('التمثيلات البيانية بالخطوط')) fail('Lesson 2 title missing from Home')
  const startLinks = screen.getAllByText('ابدأ')
  if (startLinks.length !== 2) fail(`Expected 2 "ابدأ" lesson links on Home, found ${startLinks.length}`)
  console.log('✅ Home lists both Lesson 1 and Lesson 2 as available')

  // ---- Lesson 1 still works end-to-end ----
  goTo('#lesson/coordinates')
  if (!screen.getByRole('heading', { name: 'شبكة الإحداثيات' })) fail('Lesson 1 page did not open')
  let nextBtn = screen.getByRole('button', { name: /التالي/ })
  for (let i = 0; i < 8; i++) { fireEvent.click(nextBtn); nextBtn = screen.getByRole('button', { name: /التالي/ }) }
  if (!screen.getByText('اختبار ختامي')) fail('Lesson 1 final test step did not render')
  console.log('✅ Lesson 1 (شبكة الإحداثيات) steps navigate end-to-end and Lesson 1 is unaffected')

  // ---- Lesson 2: open and verify every step ----
  goTo('#lesson/line-graphs')
  if (!screen.getByRole('heading', { name: 'التمثيلات البيانية بالخطوط' })) fail('Lesson 2 page did not open')

  // Step 1: انطلاقة الدرس
  if (!screen.getByText(/أفضل تمثيل بياني يعبّر عن هذا التغيّر/)) fail('Lesson 2 intro textbook quote missing')
  const clickNext = () => fireEvent.click(screen.getByRole('button', { name: /التالي/ }))

  // Step 2: انطلاقة نشطة (table + guided questions)
  clickNext()
  if (!screen.getByText('الجدول الآتي يمثّل درجات الحرارة خلال أسبوع في مدينة دمشق:')) fail('Damascus temperature activity text missing')
  const wedCells = screen.getAllByText('18')
  if (wedCells.length < 2) fail('Temperature table does not show the value 18 for Wed/Thu')
  const q1Input = screen.getByLabelText('lg-p7-q1')
  fireEvent.change(q1Input, { target: { value: '18' } })
  fireEvent.click(within(q1Input.closest('label')!).getByText('تحقق'))
  if (!within(q1Input.closest('label')!).getByText(/درجة الحرارة يوم الأربعاء هي 18/)) fail('Guided feedback for p7-q1 missing')
  console.log('✅ Step 2 (انطلاقة نشطة): table renders and guided feedback works')

  // Step 3: concept box
  clickNext()
  if (!screen.getByText(/نضع عادةً المحور الأفقي للزمن والمحور الشاقولي للبيانات/)) fail('Concept "تعلّم" box missing exact textbook text')
  console.log('✅ Step 3 (الفكرة الأساسية): exact textbook definition present')

  // Step 4: worked example with read-arrows
  clickNext()
  const friday17 = screen.getAllByText('17')
  if (friday17.length === 0) fail('Friday=17 worked example value missing')
  console.log('✅ Step 4 (مثال من الكتاب): worked example renders with the value 17')

  // ---- RTL/LTR spot-check right here: this step mixes Arabic prose with MathExpression numbers ----
  const mathSpans = document.querySelectorAll('.math-expression[dir="ltr"]')
  if (mathSpans.length === 0) fail('No isolated LTR math spans found on the worked-example step')
  const badMath = Array.from(mathSpans).find(node => (node as HTMLElement).style.direction !== 'ltr')
  if (badMath) fail('A math-expression span is missing direction:ltr inline style')
  console.log(`✅ Bidi check: ${mathSpans.length} isolated LTR math-expression spans found, each with direction:ltr`)

  // Step 5: interactive chart reading
  clickNext()
  const chartHit = document.querySelectorAll('.grid-hit')
  if (chartHit.length === 0) fail('Interactive chart has no clickable points')
  fireEvent.click(chartHit[2] as Element)
  if (!screen.getByText(/اخترت يوم/)) fail('Selecting a chart point did not show the ordered pair')
  console.log('✅ Step 5 (اقرأ الرسم بنفسك): clicking a point reveals the ordered pair')

  // Step 6: infant height checkpoint + fill table
  clickNext()
  if (!screen.getByText(/الطول المثالي للطفل بالسنتيمتر في العام الأول/)) fail('Infant height source text missing')
  const heightInputs = ['height-0', 'height-1', 'height-2', 'height-3', 'height-5', 'height-7', 'height-12'].map(id => screen.getByLabelText(id))
  const heightAnswers = ['50', '54', '58', '61', '65', '68', '76']
  heightInputs.forEach((input, index) => fireEvent.change(input, { target: { value: heightAnswers[index] } }))
  fireEvent.click(screen.getByText('تحقق من الجدول'))
  if (!screen.getByText(/كل القيم صحيحة بحسب الرسم البياني/)) fail('Height table validation did not confirm correct values')
  console.log('✅ Step 6 (تحقق من فهمك): infant height chart + fill-in table validate correctly')

  // Step 7: student-count practice + trend MCQ
  clickNext()
  fireEvent.click(screen.getByText('يزداد'))
  if (!screen.getByText(/المنحنى يتجه إلى الأعلى بشكل عام/)) fail('Trend MCQ feedback missing')
  console.log('✅ Step 7 (تدرّب): student-count chart + trend multiple-choice works')

  // Step 8: mistake spotting
  clickNext()
  const mistakeButtons = screen.getAllByText('قرأ رقم ترتيب اليوم من المحور الأفقي بدلاً من الصعود لقراءة القيمة من المحور الشاقولي')
  fireEvent.click(mistakeButtons[0])
  if (!screen.getByText(/المحور الأفقي يمثل الزمن فقط/)) fail('Mistake-spotting explanation missing')
  console.log('✅ Step 8 (اكتشف الخطأ): mistake cards reveal a teaching explanation, not just right/wrong')

  // Step 9: recap
  clickNext()
  if (!screen.getByText(/خلاصة التمثيل البياني بالخطوط/)) fail('Recap heading missing')

  // Step 10: brand-new final test
  clickNext()
  if (!screen.getByText(/هذا اختبار جديد يقيس فهمك/)) fail('Final test intro missing')
  const submit = screen.getByText('عرض النتيجة')
  fireEvent.click(submit)
  if (!screen.getByText(/نتيجتك:/)) fail('Final test result did not render after submit')
  console.log('✅ Step 10 (الاختبار الختامي): new final test submits and shows a score')

  // ---- Teacher Area: gate + both lessons + page metadata ----
  goTo('#teacher')
  if (!screen.getByText('دخول Teacher Area')) fail('Teacher password gate did not render')
  fireEvent.change(screen.getByLabelText('كلمة مرور المدرس'), { target: { value: 'wrong' } })
  fireEvent.click(screen.getByText('دخول'))
  if (!screen.getByText('رمز الوصول غير صحيح. حاول مرة أخرى.')) fail('Wrong password did not show an error')
  fireEvent.change(screen.getByLabelText('كلمة مرور المدرس'), { target: { value: 'somer173' } })
  fireEvent.click(screen.getByText('دخول'))
  if (!screen.getByText('دليل درس: شبكة الإحداثيات')) fail('Teacher Area did not unlock into Lesson 1 guide')
  console.log('✅ Teacher Area: password gate rejects wrong code and accepts somer173')

  fireEvent.click(screen.getByRole('button', { name: 'التمثيلات البيانية بالخطوط' }))
  if (!screen.getByText('دليل درس: التمثيلات البيانية بالخطوط')) fail('Teacher tab did not switch to Lesson 2 guide')
  if (!screen.getAllByText(/المصدر: الكتاب — ص 7/).length) fail('Lesson 2 teacher guide missing page 7 source metadata')
  if (!screen.getAllByText(/المصدر: الكتاب — ص 8/).length) fail('Lesson 2 teacher guide missing page 8 source metadata')
  if (!screen.getAllByText(/المصدر: الكتاب — ص 9/).length) fail('Lesson 2 teacher guide missing page 9 source metadata')
  if (!screen.getAllByText('نشاط تفاعلي إضافي').length) fail('Lesson 2 teacher guide missing platform-activity labels')
  console.log('✅ Teacher Area: Lesson 2 guide shows real textbook page numbers (7/8/9) and platform labels')

  console.log('\nAll browser-interaction smoke checks passed.')
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
