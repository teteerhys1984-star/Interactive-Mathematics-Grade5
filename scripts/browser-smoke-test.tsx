/**
 * A jsdom + Testing Library interaction smoke test used ONLY for local verification in this
 * sandbox (no real Chromium is reachable here). It renders the real App component tree, clicks
 * through every lesson step exactly like a student would, unlocks Teacher Area, and checks the
 * RTL/LTR boundaries in the actual rendered DOM. Not part of `npm run build`; run manually with
 * `npx tsx scripts/browser-smoke-test.tsx`. jsdom/@testing-library are dev-only, not committed.
 */
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

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
  const vite = await createServer({ configFile: 'vite.config.ts', server: { middlewareMode: true }, appType: 'custom' })
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')

  const goTo = (hash: string) => { act(() => { window.location.hash = hash; window.dispatchEvent(new window.Event('hashchange')) }) }

  render(<App />)
  console.log('✅ App mounted at Home (#top)')

  // ---- Course Home navigation integrates the registry-backed Test Area without replacing lessons ----
  const testAreaNavLink = screen.getByRole('link', { name: 'الاختبارات' })
  if (testAreaNavLink.getAttribute('href') !== '#tests') fail('Course Home Test Area navigation does not use the expected hash route')
  goTo('#tests')
  if (!screen.getByRole('heading', { name: 'منطقة الاختبارات' })) fail('Course Home navigation did not open the Test Area')
  if (!screen.getByText('7 اختبارات متاحة')) fail('Test Area did not show the seven eligible lesson tests')
  if (screen.getByRole('link', { name: 'مساحة المدرس' }).getAttribute('href') !== '#teacher') fail('Test Area lost the Teacher Area navigation')
  if (!screen.getByText('المهندس سومر شاهين:')) fail('Instructor attribution is missing from the Test Area')
  goTo('#top')
  if (!screen.getByText('شبكة الإحداثيات')) fail('Returning from Test Area did not restore Course Home')
  console.log('✅ Course Home Test Area entry opens the registry-backed catalog and returns to the normal lesson home')

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
  const lessonBreadcrumbs = screen.getByRole('navigation', { name: 'مسار الدرس' })
  if (!within(lessonBreadcrumbs).getByText('الوحدة الأولى') || !within(lessonBreadcrumbs).getByText('انطلاقة الدرس')) fail('Premium lesson breadcrumbs are incomplete')
  const lessonProgress = screen.getByRole('progressbar', { name: 'موقعك في الدرس' })
  if (lessonProgress.getAttribute('aria-valuenow') !== '1' || lessonProgress.getAttribute('aria-valuemax') !== '9') fail('Premium lesson position indicator has incorrect values')
  const outlineTrigger = screen.getByRole('button', { name: /مسار الدرس.*انطلاقة الدرس/ })
  fireEvent.click(outlineTrigger)
  const outlineDialog = screen.getByRole('dialog', { name: 'خطوات التعلّم' })
  if (!within(outlineDialog).getByText('الخطوة 1')) fail('Mobile lesson outline does not include the step timeline')
  fireEvent.click(within(outlineDialog).getByRole('button', { name: /انطلاقة الدرس/ }))
  if (screen.queryByRole('dialog', { name: 'خطوات التعلّم' })) fail('Mobile lesson outline did not close after selecting a step')
  console.log('✅ Premium lesson chrome: breadcrumbs, accessible progress, desktop timeline and mobile bottom sheet work')
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

  // ---- Lesson 3: legacy final test still renders its questions and scores a correct response ----
  goTo('#lesson/natural-numbers')
  if (!screen.getByRole('heading', { name: 'الأعداد الطبيعية' })) fail('Lesson 3 route did not open')
  let l3Next = screen.getByRole('button', { name: 'التالي' }) as HTMLButtonElement
  let l3Guard = 0
  while (!l3Next.disabled && l3Guard < 30) { fireEvent.click(l3Next); l3Next = screen.getByRole('button', { name: 'التالي' }) as HTMLButtonElement; l3Guard++ }
  if (!screen.getByText(/اختبار ختامي جديد/)) fail('Lesson 3 existing final test did not render')
  if (document.querySelectorAll('.final-test .test-question').length !== 7) fail('Lesson 3 existing final-test question count changed')
  const l3CorrectInput = screen.getByText(/ما قيمة الرقم 7 في العدد 5,728,041/).closest('label')?.querySelector('input')
  if (!l3CorrectInput) fail('Lesson 3 final-test numeric response is missing')
  fireEvent.change(l3CorrectInput, { target: { value: '700000' } })
  fireEvent.click(screen.getByText('عرض النتيجة'))
  if (!screen.getByText(/نتيجتك: 1 \/ 7/)) fail('Lesson 3 existing final-test scoring did not preserve a correct answer')
  console.log('✅ Lesson 3 existing final test renders seven questions and scores a correct answer')

  // ---- Lesson 4: legacy final test still renders its questions and scores a correct response ----
  goTo('#lesson/rounding-natural-numbers')
  if (!screen.getByRole('heading', { name: 'تقريب الأعداد الطبيعية', level: 1 })) fail('Lesson 4 route did not open')
  let l4Next = screen.getByRole('button', { name: 'التالي' }) as HTMLButtonElement
  let l4Guard = 0
  while (!l4Next.disabled && l4Guard < 20) { fireEvent.click(l4Next); l4Next = screen.getByRole('button', { name: 'التالي' }) as HTMLButtonElement; l4Guard++ }
  if (!screen.getByText(/اختبار شامل جديد/)) fail('Lesson 4 existing final test did not render')
  if (document.querySelectorAll('.final-test .test-question').length !== 5) fail('Lesson 4 existing final-test question count changed')
  const l4CorrectInput = screen.getByText(/قرّب 4,682,137 إلى أقرب مليون/).closest('label')?.querySelector('input')
  if (!l4CorrectInput) fail('Lesson 4 final-test numeric response is missing')
  fireEvent.change(l4CorrectInput, { target: { value: '5,000,000' } })
  fireEvent.click(screen.getByText('عرض النتيجة'))
  if (!screen.getByText(/نتيجتك: 1 \/ 5/)) fail('Lesson 4 existing final-test scoring did not preserve a correct answer')
  console.log('✅ Lesson 4 existing final test renders five questions and scores a correct answer')

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

  // ---- PR3 regression across Lessons 1–7: position vs completion + accessible outline dialog ----
  // Two things are guarded here for every lesson:
  //   1. jumping ahead only moves «موقعك في الدرس»; skipped steps are never marked «مكتملة»,
  //   2. the mobile outline bottom sheet behaves like a real modal (focus in, trap, Escape, focus back).
  const lessonRoutes: Array<[string, string]> = [
    ['coordinates', 'شبكة الإحداثيات'],
    ['line-graphs', 'التمثيلات البيانية بالخطوط'],
    ['natural-numbers', 'الأعداد الطبيعية'],
    ['rounding-natural-numbers', 'تقريب الأعداد الطبيعية'],
    ['adding-subtracting-natural-numbers', 'جمع الأعداد الطبيعيّة وطرحها'],
    ['angle-measurement', 'قياس الزوايا'],
    ['parallelogram', 'متوازي الأضلاع'],
  ]
  const completedBadges = (variant: 'desktop' | 'mobile') => document.querySelectorAll(`.lesson-outline-list.is-${variant} .lesson-outline-status`).length
  const focusablesIn = (root: Element) => Array.from(root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')) as HTMLElement[]

  for (const [lessonId, lessonTitle] of lessonRoutes) {
    goTo(`#lesson/${lessonId}`)
    if (!screen.getByRole('heading', { name: lessonTitle, level: 1 })) fail(`${lessonTitle}: lesson page did not open`)

    // --- 1) a freshly opened lesson has a position but zero completed steps ---
    const bar = screen.getByRole('progressbar', { name: 'موقعك في الدرس' })
    const total = Number(bar.getAttribute('aria-valuemax'))
    if (!Number.isFinite(total) || total < 2) fail(`${lessonTitle}: lesson position bar is missing its step count`)
    if (bar.getAttribute('aria-valuenow') !== '1') fail(`${lessonTitle}: a freshly opened lesson must start at position 1`)
    if (bar.getAttribute('aria-valuetext') !== `الخطوة 1 من ${total}`) fail(`${lessonTitle}: position bar must announce «الخطوة 1 من ${total}»`)
    if (completedBadges('desktop') !== 0) fail(`${lessonTitle}: nothing may be «مكتملة» before the learner visits anything`)
    if (!screen.getByText(/لم تُنهِ أي خطوة بعد/)) fail(`${lessonTitle}: the progress card must say no step is finished yet`)

    // --- 2) the outline sheet is a real dialog: focus, trap, Escape, focus restore ---
    const trigger = screen.getByRole('button', { name: /^مسار الدرس/ })
    fireEvent.click(trigger)
    const sheet = screen.getByRole('dialog', { name: 'خطوات التعلّم' })
    if (sheet.getAttribute('aria-modal') !== 'true') fail(`${lessonTitle}: the outline sheet must stay aria-modal`)
    const closeButton = within(sheet).getByRole('button', { name: 'إغلاق مخطط الدرس' })
    if (document.activeElement !== closeButton) fail(`${lessonTitle}: opening the outline sheet must move focus to its close button`)
    if (completedBadges('mobile') !== 0) fail(`${lessonTitle}: the sheet timeline must not pre-mark any step as «مكتملة»`)
    const trapped = focusablesIn(sheet)
    if (trapped.length < 2) fail(`${lessonTitle}: the outline sheet should expose focusable steps`)
    fireEvent.keyDown(document.activeElement!, { key: 'Tab', shiftKey: true })
    if (document.activeElement !== trapped[trapped.length - 1]) fail(`${lessonTitle}: Shift+Tab on the first item must wrap to the last item inside the sheet`)
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
    if (document.activeElement !== trapped[0]) fail(`${lessonTitle}: Tab on the last item must wrap back to the first item inside the sheet`)
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    if (screen.queryByRole('dialog', { name: 'خطوات التعلّم' })) fail(`${lessonTitle}: Escape must close the outline sheet`)
    if (document.activeElement !== trigger) fail(`${lessonTitle}: closing with Escape must return focus to the trigger`)

    // --- 3) jumping to the last step moves the position without completing the skipped steps ---
    fireEvent.click(trigger)
    const reopened = screen.getByRole('dialog', { name: 'خطوات التعلّم' })
    const stepButtons = Array.from(reopened.querySelectorAll('.lesson-outline-list.is-mobile button')) as HTMLElement[]
    if (stepButtons.length !== total) fail(`${lessonTitle}: the sheet timeline should list all ${total} steps, found ${stepButtons.length}`)
    fireEvent.click(stepButtons[total - 1])
    if (screen.queryByRole('dialog', { name: 'خطوات التعلّم' })) fail(`${lessonTitle}: picking a step must close the sheet`)
    if (document.activeElement !== trigger) fail(`${lessonTitle}: picking a step must return focus to the trigger`)
    const jumped = screen.getByRole('progressbar', { name: 'موقعك في الدرس' })
    if (jumped.getAttribute('aria-valuenow') !== String(total)) fail(`${lessonTitle}: the position must follow the jump to step ${total}`)
    if (completedBadges('desktop') !== 1) fail(`${lessonTitle}: only the visited first step may be «مكتملة» after jumping ahead, found ${completedBadges('desktop')}`)
    if (!screen.getByText(new RegExp(`أنهيت 1 من ${total} خطوة`))) fail(`${lessonTitle}: the progress card must report exactly one finished step after the jump`)
    // the same honest state is mirrored inside the bottom sheet
    fireEvent.click(trigger)
    if (completedBadges('mobile') !== 1) fail(`${lessonTitle}: the sheet timeline must mirror the single completed step, found ${completedBadges('mobile')}`)
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })

    // --- 4) stepping back one by one marks the steps that were really visited ---
    fireEvent.click(screen.getByRole('button', { name: /السابق/ }))
    if (completedBadges('desktop') !== 2) fail(`${lessonTitle}: going back must keep the two visited steps marked as «مكتملة»`)
  }
  console.log(`✅ PR3 regression on Lessons 1–7: position stays separate from completion, and the outline dialog traps focus, closes on Escape and restores focus (${lessonRoutes.length} lessons checked)`)

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

  console.log('\nAll jsdom interaction smoke checks passed.')
  await vite.close()
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
