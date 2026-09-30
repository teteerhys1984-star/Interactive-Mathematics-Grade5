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
  if (!screen.getByText('جمع الأعداد الطبيعيّة وطرحها')) fail('Lesson 5 title missing from Home')
  const startLinks = screen.getAllByText('ابدأ')
  if (startLinks.length !== 7) fail(`Expected 7 "ابدأ" lesson links on Home, found ${startLinks.length}`)
  if (!screen.getByText('متوازي الأضلاع')) fail('Lesson 7 title missing from Home')
  console.log('✅ Home lists Lessons 1–7 as available')

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

  // ---- Lesson 5: open, walk every step, exercise interactions ----
  goTo('#lesson/adding-subtracting-natural-numbers')
  if (!screen.getByRole('heading', { name: 'جمع الأعداد الطبيعيّة وطرحها' })) fail('Lesson 5 page did not open')
  // Step 1 intro: textbook areas present, isolated LTR math for the millions figure.
  if (!screen.getByText(/توجد في الكتاب خريطة توضيحية/)) fail('Lesson 5 intro figure note missing')
  // Step 2 warm-up: a book activity input works.
  fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
  const warmA = screen.getByLabelText('warmup-w-a')
  fireEvent.change(warmA, { target: { value: '300' } })
  if (!screen.getByText(/أجبت بشكل صحيح عن/)) fail('Lesson 5 warm-up grid missing progress')
  // Click through the remaining steps to the final test.
  let l5Next = screen.getByRole('button', { name: 'التالي' }) as HTMLButtonElement
  let guard = 0
  while (!l5Next.disabled && guard < 40) { fireEvent.click(l5Next); l5Next = screen.getByRole('button', { name: 'التالي' }) as HTMLButtonElement; guard++ }
  if (!screen.getByText(/اختبار ختامي جديد/)) fail('Lesson 5 final test step did not render')
  fireEvent.click(screen.getByText('عرض النتيجة'))
  if (!screen.getByText(/نتيجتك:/)) fail('Lesson 5 final test did not produce a score')
  console.log(`✅ Lesson 5 (جمع الأعداد الطبيعيّة وطرحها): all steps navigate and the new final test scores (${guard + 2} steps walked)`)

  // ---- Lesson 6: angles, protractor interaction, all steps, and final test ----
  goTo('#lesson/angle-measurement')
  if (!screen.getByRole('heading', { name: 'قياس الزوايا' })) fail('Lesson 6 page did not open')
  if (!screen.getByText(/بطليموس/)) fail('Lesson 6 textbook introduction missing')
  fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
  if (!screen.getByText(/نصف المستقيم هو جزء من المستقيم/)) fail('Lesson 6 ray/angle concept missing')
  fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
  fireEvent.click(screen.getByText('X داخل الزاوية'))
  if (!screen.getByText(/X داخل الفتحة/)) fail('Lesson 6 inside-angle interaction missing')
  fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
  if (!screen.getByText('حرّك الشعاع ثم اقرأ القياس')) fail('Interactive protractor missing')
  fireEvent.click(screen.getByRole('button', { name: /تكبير الرسم/ }))
  if (!screen.getByRole('button', { name: /تصغير/ })) fail('Lesson 6 protractor zoom toggle missing')
  fireEvent.click(screen.getByRole('button', { name: 'التالي' }))
  if (!screen.getAllByText(/35°/).length) fail('Lesson 6 35-degree worked example missing')
  // Walk the remaining sequential steps to the final test.
  let l6Next = screen.getByRole('button', { name: 'التالي' }) as HTMLButtonElement
  let l6Guard = 0
  while (!l6Next.disabled && l6Guard < 20) { fireEvent.click(l6Next); l6Next = screen.getByRole('button', { name: 'التالي' }) as HTMLButtonElement; l6Guard++ }
  if (!screen.getByText(/اختبار جديد/)) fail('Lesson 6 final test step did not render')
  fireEvent.click(screen.getByRole('button', { name: 'عرض النتيجة' }))
  if (!screen.getByText(/نتيجتك:/)) fail('Lesson 6 final test did not produce a score')
  console.log(`✅ Lesson 6 (قياس الزوايا): protractor interaction, zoom, sequential navigation, and final test passed (${l6Guard + 5} steps walked)`)


  // ---- Lesson 7: parallelograms — every step, figures, zoom, activities, final test ----
  goTo('#lesson/parallelogram')
  if (!screen.getByRole('heading', { name: 'متوازي الأضلاع' })) fail('Lesson 7 page did not open')
  if (!screen.getAllByText(/نرى في حياتنا اليوميّة متوازيات الأضلاع/).length) fail('Lesson 7 textbook introduction (ص 31) missing')
  // Step 1: the five انطلاقة نشطة figures are rebuilt as real SVG, and the sorter reacts.
  const l7Figures = document.querySelectorAll('svg.l7-geo')
  if (l7Figures.length < 5) fail(`Lesson 7 step 1 should rebuild the five textbook figures, found ${l7Figures.length}`)
  fireEvent.click(screen.getAllByRole('button', { name: /تكبير الرسم/ })[0])
  if (!screen.getAllByRole('button', { name: /تصغير الرسم/ }).length) fail('Lesson 7 figure zoom toggle does not work')
  // Every textbook task exposes a step-by-step explanation in the Student Area.
  const revealButtons = screen.getAllByRole('button', { name: /اكشف الحل خطوة بخطوة/ })
  if (revealButtons.length < 8) fail(`Lesson 7 step 1 should expose a reveal per textbook item, found ${revealButtons.length}`)
  fireEvent.click(revealButtons[2])
  if (!screen.getAllByText(/الإجابة:/).length) fail('Revealing a Lesson 7 textbook task did not show the worked answer')
  const sorter = screen.getAllByRole('button', { name: 'ليس متوازي أضلاع' })
  fireEvent.click(sorter[1])
  if (!screen.getAllByText(/لا يوجد فيه أي ضلعين متوازيين/).length) fail('Lesson 7 shape sorter feedback missing')
  console.log('✅ Lesson 7 step 1 (انطلاقة الدرس): five rebuilt figures, zoom, per-item explanations and the sorter all work')

  // Walk every sequential step, checking the key content of each phase on the way.
  const l7Next = () => screen.getByRole('button', { name: /التالي/ }) as HTMLButtonElement
  const expectedPhases: Array<[string, RegExp]> = [
    ['ما متوازي الأضلاع؟', /هو شكل رباعي فيه كلّ ضلعين متقابلين متوازيان/],
    ['قطر متوازي الأضلاع', /هو قطعة مستقيمة تصل بين رأسين غير متتاليين/],
    ['تحقّق: تمييز الأشكال', /علّل لماذا الشكل \(1\) ليس متوازي الأضلاع|أي العبارات خاطئة/],
    ['خاصة الأضلاع', /كل ضلعين متقابلين في متوازي الأضلاع متساويا الطول/],
    ['خاصة الزوايا', /كل زاويتين متقابلتين في متوازي الأضلاع متساويتا القياس/],
    ['تحقّق: تطبيق الخاصتين', /اكتب قياس كل من الزاويتين/],
    ['رسم متوازي الأضلاع', /شاهد الرسم يتكوّن خطوة خطوة/],
    ['تحقّق: ارسم ABCD', /ماذا نسمّي/],
    ['تدرّب ① و②', /املأ فراغات تدرّب/],
    ['تدرّب ③', /أين نضع الرأس D/],
    ['تدرّب ④', /ارسم متوازي الأضلاع/],
    ['تدرّب ⑤', /متوازيا الأضلاع فيهما/],
    ['الخلاصة', /خلاصة الدرس السابع/],
    ['الاختبار النهائي', /اختبار ختامي جديد من إعداد المنصة/],
  ]
  for (const [phase, pattern] of expectedPhases) {
    fireEvent.click(l7Next())
    if (!screen.getAllByText(pattern).length) fail(`Lesson 7 step "${phase}" did not render its expected content`)
    if (phase === 'خاصة الزوايا') {
      const slider = document.getElementById('lab-angle')!
      fireEvent.change(slider, { target: { value: '120' } })
      if (!screen.getAllByText(/120/).length) fail('Lesson 7 properties lab slider did not update the readout')
    }
    if (phase === 'رسم متوازي الأضلاع') {
      fireEvent.click(screen.getByRole('button', { name: 'الخطوة 5' }))
      if (!screen.getAllByText(/نصل بين النقطتين W و X/).length) fail('Lesson 7 construction player step 5 missing')
    }
    if (phase === 'تدرّب ① و②') {
      fireEvent.change(screen.getByLabelText('blank-a'), { target: { value: 'XY' } })
      fireEvent.click(screen.getByRole('button', { name: /تحقّق من الفراغات/ }))
      if (!screen.getAllByText(/✔ صحيح/).length) fail('Lesson 7 fill-in-the-blanks validation failed')
    }
    if (phase === 'تدرّب ③') {
      fireEvent.click(screen.getByRole('button', { name: 'الموضع 1' }))
      if (!screen.getAllByText(/ممتاز: هنا يكون/).length) fail('Lesson 7 fourth-vertex activity feedback missing')
    }
  }
  if (!l7Next().disabled) fail('Lesson 7 did not end on the final step')
  // Sequential navigation backwards + outline jump.
  fireEvent.click(screen.getByRole('button', { name: /السابق/ }))
  if (!screen.getAllByText(/خلاصة الدرس السابع/).length) fail('Lesson 7 "السابق" did not go back one step')
  fireEvent.click(screen.getByRole('button', { name: /انطلاقة الدرس/ }))
  if (!screen.getAllByText(/نرى في حياتنا اليوميّة/).length) fail('Lesson 7 outline jump did not work')
  if (!screen.getByText('الخطوة 1 من 15')) fail('Lesson 7 progress indicator missing or wrong')
  // Final test scores.
  for (const [phase] of expectedPhases) { void phase; fireEvent.click(l7Next()) }
  fireEvent.click(screen.getByRole('button', { name: /عرض النتيجة/ }))
  if (!screen.getByText(/نتيجتك:/)) fail('Lesson 7 final test did not produce a score')
  console.log(`✅ Lesson 7 (متوازي الأضلاع): ${expectedPhases.length + 1} sequential steps, outline + previous/next, lab, construction player, blanks, vertex activity and final test all pass`)

  // ---- Teacher Area: gate + all lessons + page metadata ----
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

  fireEvent.click(screen.getByRole('button', { name: 'جمع الأعداد الطبيعيّة وطرحها' }))
  if (!screen.getByText('دليل درس: جمع الأعداد الطبيعيّة وطرحها')) fail('Teacher tab did not switch to Lesson 5 guide')
  for (const page of [19, 20, 21, 22]) if (!screen.getAllByText(new RegExp(`المصدر: الكتاب — ص ${page}`)).length) fail(`Lesson 5 teacher guide missing page ${page} source metadata`)
  console.log('✅ Teacher Area: Lesson 5 guide shows real textbook page numbers (19/20/21/22)')

  fireEvent.click(screen.getByRole('button', { name: 'قياس الزوايا' }))
  if (!screen.getByText('دليل درس: قياس الزوايا')) fail('Teacher tab did not switch to Lesson 6 guide')
  for (const page of [23, 24, 25, 26, 27, 28, 29, 30]) if (!screen.getAllByText(new RegExp(`المصدر: الكتاب — ص ${page}`)).length) fail(`Lesson 6 teacher guide missing page ${page} source metadata`)
  if (screen.getAllByText('نشاط تفاعلي إضافي').length < 8) fail('Lesson 6 teacher guide missing final platform labels')
  console.log('✅ Teacher Area: Lesson 6 guide shows real textbook page numbers (23–30) and detailed platform solutions')

  fireEvent.click(screen.getByRole('button', { name: 'متوازي الأضلاع' }))
  if (!screen.getByText('دليل درس: متوازي الأضلاع')) fail('Teacher tab did not switch to Lesson 7 guide')
  for (const page of [31, 32, 33, 34, 35]) if (!screen.getAllByText(new RegExp(`المصدر: الكتاب — ص ${page}`)).length) fail(`Lesson 7 teacher guide missing page ${page} source metadata`)
  if (screen.getAllByText('نشاط تفاعلي إضافي').length < 10) fail('Lesson 7 teacher guide missing the ten new final-test solutions')
  console.log('✅ Teacher Area: Lesson 7 guide shows real textbook page numbers (31–35) and ten platform final-test solutions')

  console.log('\nAll browser-interaction smoke checks passed.')
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
