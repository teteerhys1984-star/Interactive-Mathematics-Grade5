import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import {
  evaluateFinalQuestion3,
  finalAssessment3,
  isLessonThreeAnswerCorrect,
  lessonThreeRequiredSolutionIds,
  lessonThreeTeacherEntries,
  normalizeLessonThreeDigits,
  normalizeLessonThreeNumberInput,
} from '../src/teacher/lesson3'

const fail = (message: string): never => {
  throw new Error(`Lesson 3 check failed: ${message}`)
}

async function main(): Promise<void> {
  // 1) Registration & Teacher Area coverage
  const lesson = curriculumRegistry.flatMap(u => u.lessons).find(l => l.id === 'natural-numbers')
  if (!lesson || lesson.availability !== 'available' || !lessonComponents['natural-numbers']) {
    fail('Lesson 3 is not registered')
  }

  const textbookPages = new Set(
    lessonThreeTeacherEntries
      .filter(e => e.source.type === 'textbook')
      .map(e => (e.source as { page: number }).page),
  )
  for (const page of [10, 11, 12, 13, 14]) {
    if (!textbookPages.has(page)) fail(`Lesson 3 missing textbook page ${page}`)
  }

  for (const id of lessonThreeRequiredSolutionIds) {
    if (!lessonThreeTeacherEntries.some(e => e.id === id)) fail(`Missing required teacher entry ${id}`)
  }

  for (const q of finalAssessment3) {
    const e = lessonThreeTeacherEntries.find(x => x.id === q.id)
    if (!e || e.source.type !== 'platform') fail(`Missing platform solution for ${q.id}`)
  }

  for (const e of lessonThreeTeacherEntries) {
    if (!e.id || !e.answer || !e.reasoning.length) fail(`Incomplete teacher entry ${e.id}`)
  }

  // 2) Verify source accuracy and absence of erroneous numbers/phrasings
  const lessonSource = readFileSync('src/lessons/NaturalNumbersLesson.tsx', 'utf8')
  const teacherSource = readFileSync('src/teacher/lesson3.ts', 'utf8')
  if (lessonSource.includes('ومئتان وألفان') || teacherSource.includes('ومئتان وألفان')) {
    fail('Erroneous verbal form «ومئتان وألفان» for 20,200,002 still exists')
  }
  if (
    !lessonSource.includes('عشرون مليونًا ومئتا ألف واثنان') ||
    !teacherSource.includes('عشرون مليونًا ومئتا ألف واثنان')
  ) {
    fail('Corrected verbal form «عشرون مليونًا ومئتا ألف واثنان» for 20,200,002 is missing')
  }
  if (lessonSource.includes('2,415,155') || teacherSource.includes('2,415,155')) {
    fail('Unverified number 2,415,155 must not be attributed to page 11')
  }
  if (!lessonSource.includes('2,413,155') || !lessonSource.includes('2,605,173')) {
    fail('Page 11 numbers 2,413,155 and 2,605,173 must be present')
  }
  const bankEntry = lessonThreeTeacherEntries.find(e => e.id === 'nn-p13-bank')!
  if (bankEntry.prompt.includes('الفرق') || bankEntry.answer.includes('6,308,000')) {
    fail('nn-p13-bank must match page 13 Exercises 3 & 4 without unverified difference prompt or 6,308,000 answer')
  }
  const zerosEntry = lessonThreeTeacherEntries.find(e => e.id === 'nn-p13-zeros')!
  if (!zerosEntry.prompt.includes('سبعين ألفاً') || !zerosEntry.prompt.includes('أربعمئة ألف')) {
    fail('nn-p13-zeros prompt must match page 13 Exercise 5 (سبعين ألفاً، ومليونين، وأربعمئة ألف)')
  }
  const patternEntry = lessonThreeTeacherEntries.find(e => e.id === 'nn-p14-pattern')!
  if (!patternEntry.prompt.includes('المنزلتين الأكبر قيمة')) {
    fail('nn-p14-pattern prompt must state «المنزلتين الأكبر قيمة» matching page 14 Exercise 13')
  }

  // 3) Verify nn-final-5 and nn-final-7 mathematical consistency
  const q5 = finalAssessment3.find(q => q.id === 'nn-final-5')
  if (!q5) fail('nn-final-5 is missing')
  assert.equal(q5.answer, 'أُهملت منزلة العشرات ووُضعت قيمة المئات مكانها')
  assert.ok(q5.options?.includes('أُهملت منزلة العشرات ووُضعت قيمة المئات مكانها'))
  assert.equal(
    q5.options?.some(opt => opt.includes('قيمة الآحاد')),
    false,
    'nn-final-5 must not misdescribe 700 as the ones place value',
  )

  const q7 = finalAssessment3.find(q => q.id === 'nn-final-7')
  if (!q7) fail('nn-final-7 is missing')
  assert.equal(q7.answer, '149992')
  assert.equal(q7.answer.length, 6, 'nn-final-7 answer 149992 has 6 digits')
  if (q7.text.includes('أربع خانات')) {
    fail('nn-final-7 still contradicts its 6-digit range (149,900..150,000) by claiming 4 digits')
  }
  if (!q7.text.includes('ست خانات')) {
    fail('nn-final-7 must state «ست خانات» matching the range 149,900..150,000 and answer 149992')
  }

  // 4) Earth radius exercise (6,380,000 accepted; 6,308,000 rejected)
  assert.equal(isLessonThreeAnswerCorrect('6380000', '6380000'), true)
  assert.equal(isLessonThreeAnswerCorrect('6,380,000', '6380000'), true)
  assert.equal(isLessonThreeAnswerCorrect('٦،٣٨٠،٠٠٠', '6380000'), true)
  assert.equal(isLessonThreeAnswerCorrect('6308000', '6380000'), false)
  assert.equal(isLessonThreeAnswerCorrect('6,308,000', '6380000'), false)

  // 5) Unit tests for numeric & Arabic input normalization (valid and malformed/invalid cases)
  assert.equal(normalizeLessonThreeDigits('٠١٢٣٤٥٦٧٨٩'), '0123456789')
  assert.equal(normalizeLessonThreeDigits('۷۰۰۰۰۰'), '700000')

  const valid700k = [
    '700000',
    '٧٠٠٠٠٠',
    '۷۰۰۰۰۰',
    '700,000',
    '700،000',
    '700 000',
    '٧٠٠,٠٠٠',
    '٧٠٠،٠٠٠',
    ' ٧٠٠ ٠٠٠ ',
    '700 , 000',
  ]
  for (const sample of valid700k) {
    assert.equal(
      normalizeLessonThreeNumberInput(sample),
      '700000',
      `Expected valid normalization for "${sample}"`,
    )
    assert.equal(
      isLessonThreeAnswerCorrect(sample, '700000'),
      true,
      `Expected "${sample}" to be accepted for 700000`,
    )
  }

  const invalid700k = [
    '',
    '   ',
    '70,00,00',
    '7,0,0,0,0,0',
    '700,,000',
    '700،،000',
    '7_00_000',
    '7000,00',
    '70000',
    '7000000',
    '0700000',
    '00',
    '0,000',
    ',700000',
    '700000,',
    '،٧٠٠٠٠٠',
    '700.000',
    '-700000',
    '+700000',
    '700000 ليرة',
    '700abc',
    ',,,',
  ]
  for (const sample of invalid700k) {
    assert.equal(
      isLessonThreeAnswerCorrect(sample, '700000'),
      false,
      `Expected invalid/malformed/wrong input "${sample}" to be rejected for 700000`,
    )
  }

  const q1 = finalAssessment3.find(q => q.id === 'nn-final-1')!
  const q2 = finalAssessment3.find(q => q.id === 'nn-final-2')!
  const q3 = finalAssessment3.find(q => q.id === 'nn-final-3')!
  const q4 = finalAssessment3.find(q => q.id === 'nn-final-4')!
  const q6 = finalAssessment3.find(q => q.id === 'nn-final-6')!
  assert.equal(evaluateFinalQuestion3(q1, 'أربعة ملايين وعشرون ألفاً وثلاثمئة وخمسة'), true)
  assert.equal(evaluateFinalQuestion3(q1, 'اربعه ملايين وعشرون الفا وثلاثمائة وخمسه'), true)
  assert.equal(evaluateFinalQuestion3(q1, 'أربعة ملايين وعشرون وخمسة'), false)
  assert.equal(evaluateFinalQuestion3(q2, '٧٠٠،٠٠٠'), true)
  assert.equal(evaluateFinalQuestion3(q2, '70,00,00'), false)
  assert.equal(evaluateFinalQuestion3(q3, '3,000,000 + 400,000 + 5,000 + 60'), true)
  assert.equal(evaluateFinalQuestion3(q4, '60,000'), true)
  assert.equal(evaluateFinalQuestion3(q5, 'أُهملت منزلة العشرات ووُضعت قيمة المئات مكانها'), true)
  assert.equal(evaluateFinalQuestion3(q5, 'لا يوجد خطأ'), false)
  assert.equal(evaluateFinalQuestion3(q6, '٥٠٠ ٠٠٠'), true)
  assert.equal(evaluateFinalQuestion3(q7, '١٤٩,٩٩٢'), true)
  assert.equal(evaluateFinalQuestion3(q7, '14992'), false)

  // 6) DOM interaction check in jsdom
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#lesson/natural-numbers',
    pretendToBeVisual: true,
  })
  const { window } = dom
  Object.assign(globalThis, {
    window,
    document: window.document,
    HTMLElement: window.HTMLElement,
    SVGElement: window.SVGElement,
    Node: window.Node,
    getComputedStyle: window.getComputedStyle,
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true

  const React = await import('react')
  const { render, screen, fireEvent, within } = await import('@testing-library/react')
  const { NaturalNumbersLesson } = await import('../src/lessons/NaturalNumbersLesson')

  const view = render(React.createElement(NaturalNumbersLesson))
  const nextButton = () => screen.getByRole('button', { name: /التالي/ }) as HTMLButtonElement

  // Step 5 (تحقق من فهمك): verify 20,200,002 choice task does not pre-reveal
  for (let i = 0; i < 4; i++) fireEvent.click(nextButton())
  assert.ok(screen.getByText(/من الذي كتب الصيغة اللفظية للعدد/))
  assert.equal(screen.queryByText(/أحسنت! إجابة علاء/), null, 'Answer explanation must not appear before student choice')
  fireEvent.click(screen.getByRole('button', { name: /علاء: عشرون مليونًا ومئتا ألف واثنان/ }))
  assert.ok(screen.getByText(/أحسنت! إجابة علاء/))

  // Step 6 (تمارين الكتاب): verify Guided requires non-empty attempt before revealing solution,
  // rejects 6308000 for Earth radius, accepts 6380000, and Exercise 5 prompt does not leak (2,000,000)
  fireEvent.click(nextButton())
  assert.ok(screen.getByText('كم صفراً في الكتابة القياسية للعدد مليونين؟'))
  assert.equal(screen.queryByText(/للعدد مليونين \(2,000,000\)/), null, 'Exercise 5 prompt must not leak (2,000,000)')

  const earthInput = screen.getByLabelText('nn-p13-ex4') as HTMLInputElement
  const earthCard = earthInput.closest('.self-check') as HTMLElement
  const earthCheckBtn = within(earthCard).getByRole('button', { name: 'تحقق' })
  const earthRevealBtn = within(earthCard).getByRole('button', { name: /إظهار خطوات الحل بعد المحاولة/ }) as HTMLButtonElement

  // Before any attempt, reveal button is disabled and clicking it does nothing
  assert.equal(earthRevealBtn.disabled, true, 'Guided reveal button must be disabled before attempt')
  fireEvent.click(earthRevealBtn)
  assert.equal(earthCard.querySelector('.explanation-box'), null, 'Solution must not appear before attempt')

  // Clicking تحقق with an empty input does not count as an attempt
  fireEvent.click(earthCheckBtn)
  assert.ok(within(earthCard).getByText('اكتب إجابتك أولاً ثم اضغط «تحقق».'))
  assert.equal(earthRevealBtn.disabled, true, 'Empty submission must not enable solution reveal')

  // Entering 6308000 and clicking تحقق rejects the wrong answer and enables solution reveal
  fireEvent.change(earthInput, { target: { value: '6308000' } })
  fireEvent.click(earthCheckBtn)
  assert.equal(within(earthCard).queryByText(/أحسنت! إجابة صحيحة/), null, '6308000 must be rejected for Earth radius')
  assert.ok(within(earthCard).getByText(/ضع 6 في الملايين، و380 في حلقة الألوف/))
  assert.equal(earthRevealBtn.disabled, false, 'Non-empty attempt must enable solution reveal')
  fireEvent.click(earthRevealBtn)
  assert.ok(earthCard.querySelector('.explanation-box'), 'Solution steps should appear after non-empty attempt')

  // Changing input to 6,380,000 and clicking تحقق marks it correct
  fireEvent.change(earthInput, { target: { value: '6,380,000' } })
  assert.equal(earthCard.querySelector('.explanation-box'), null, 'Editing input should hide stale solution box')
  fireEvent.click(earthCheckBtn)
  assert.ok(within(earthCard).getByText(/أحسنت! إجابة صحيحة/))

  // Step 7 (ابنِ العدد): verify platform label
  fireEvent.click(nextButton())
  assert.ok(screen.getByText('نشاط من إعداد المنصة'))

  // Step 9 (اكتشف الخطأ): verify Mistakes analysis button is disabled before selecting an option
  fireEvent.click(nextButton())
  fireEvent.click(nextButton())
  const muradRevealBtn = screen.getByRole('button', { name: /اكشف التحليل/ }) as HTMLButtonElement
  assert.equal(muradRevealBtn.disabled, true, 'Mistakes reveal button must be disabled before student selects an option')
  fireEvent.click(muradRevealBtn)
  assert.equal(screen.queryByText(/أُهمل الرقم/), null, 'Mistakes analysis must not appear before option selection')
  fireEvent.click(
    screen.getByRole('button', {
      name: /أهمل رقم الآحاد 7 في حلقة الوحدات/,
    }),
  )
  assert.equal(muradRevealBtn.disabled, false, 'Mistakes reveal button must enable after option selection')
  fireEvent.click(muradRevealBtn)
  assert.ok(screen.getByText(/أُهمل الرقم/))

  // Step 11 (الاختبار الختامي): verify malformed/wrong answers score 0 / 7 and all 7 correct answers score 7 / 7
  while (!nextButton().disabled) {
    fireEvent.click(nextButton())
  }
  const finalInputs = Array.from(document.querySelectorAll('.final-test .test-question input')) as HTMLInputElement[]
  assert.equal(finalInputs.length, 5, 'Final assessment must have 5 text/numeric inputs and 2 choice questions')

  // First submit wrong/malformed answers across all 7 questions
  fireEvent.change(finalInputs[0], { target: { value: 'أربعة ملايين وخمسة' } })
  fireEvent.change(finalInputs[1], { target: { value: '70,00,00' } })
  fireEvent.click(screen.getByRole('button', { name: '3,000,000 + 40,000 + 5,000 + 60' }))
  fireEvent.change(finalInputs[2], { target: { value: '60,,000' } })
  fireEvent.click(screen.getByRole('button', { name: 'لا يوجد خطأ' }))
  fireEvent.change(finalInputs[3], { target: { value: '5_00_000' } })
  fireEvent.change(finalInputs[4], { target: { value: '14992' } })
  fireEvent.click(screen.getByRole('button', { name: 'عرض النتيجة' }))
  assert.ok(screen.getByText('نتيجتك: 0 / 7'), 'Malformed and wrong answers must score 0 / 7')

  // Now submit all 7 correct answers (verbal q1, numeric q2/q4/q6/q7, choice q3/q5)
  fireEvent.change(finalInputs[0], { target: { value: 'أربعة ملايين وعشرون ألفاً وثلاثمئة وخمسة' } })
  fireEvent.change(finalInputs[1], { target: { value: '٧٠٠،٠٠٠' } })
  fireEvent.click(screen.getByRole('button', { name: '3,000,000 + 400,000 + 5,000 + 60' }))
  fireEvent.change(finalInputs[2], { target: { value: '60,000' } })
  fireEvent.click(screen.getByRole('button', { name: 'أُهملت منزلة العشرات ووُضعت قيمة المئات مكانها' }))
  fireEvent.change(finalInputs[3], { target: { value: '٥٠٠ ٠٠٠' } })
  fireEvent.change(finalInputs[4], { target: { value: '١٤٩،٩٩٢' } })
  fireEvent.click(screen.getByRole('button', { name: 'عرض النتيجة' }))
  assert.ok(screen.getByText('نتيجتك: 7 / 7'), 'All 7 valid answers in Final Assessment must score 7 / 7')

  view.unmount()
  console.log(
    `Lesson 3 check passed: ${lessonThreeTeacherEntries.length} teacher entries, pages 10–14, ${finalAssessment3.length} final questions (7/7 verified), strict 3-digit grouping & pre-attempt guards verified.`,
  )
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
