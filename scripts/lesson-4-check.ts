import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { roundingBookTasks, type RoundingBookTask } from '../src/lessons/roundingData'
import {
  finalAssessment4,
  getRoundingBookAnswer,
  isFinalAssessment4AnswerCorrect,
  isRoundingBookAnswerCorrect,
  lessonFourTeacherEntries,
  normalizeRoundingDigits,
  normalizeRoundingNumberInput,
  roundToNearestPlace,
} from '../src/teacher/lesson4'

const requiredBookTaskIdsByPage: Readonly<Record<15 | 16 | 17 | 18, readonly string[]>> = {
  15: ['r4-p15-a1-580', 'r4-p15-a2-315', 'r4-p15-a3-1390', 'r4-p15-example-2137'],
  16: ['r4-p16-example-3482137'],
  17: [
    'r4-p17-example-3582137', 'r4-p17-check-a-moon', 'r4-p17-check-b-sahara', 'r4-p17-oral-rounding-steps',
    'r4-p17-practice-1-2957', 'r4-p17-practice-2-5856375', 'r4-p17-practice-3-a', 'r4-p17-practice-3-b',
    'r4-p17-practice-3-c', 'r4-p17-practice-3-d',
  ],
  18: [
    'r4-p18-practice-4-digit-code', 'r4-p18-practice-5-a', 'r4-p18-practice-5-b', 'r4-p18-practice-5-c',
    'r4-p18-practice-5-d', 'r4-p18-practice-5-e', 'r4-p18-practice-5-f', 'r4-p18-practice-6-a',
    'r4-p18-practice-6-b', 'r4-p18-practice-7-reason', 'r4-p18-practice-8-a', 'r4-p18-practice-8-b',
    'r4-p18-practice-8-c', 'r4-p18-practice-8-d', 'r4-p18-practice-8-e', 'r4-p18-practice-8-f',
    'r4-p18-practice-8-g', 'r4-p18-practice-8-h', 'r4-p18-practice-8-i', 'r4-p18-practice-9-sweden',
    'r4-p18-practice-10-eggs', 'r4-p18-practice-11-car', 'r4-p18-practice-12-earth',
    'r4-p18-practice-13-donation-million', 'r4-p18-practice-13-donation-hundred-thousand',
  ],
}

const requiredBookTaskIds = Object.values(requiredBookTaskIdsByPage).flat()
const numberLineTasks = roundingBookTasks.filter(task => task.lineLabels)
const numberLinePromptTasks = roundingBookTasks.filter(task => task.prompt.includes('مستقيم الأعداد'))

const expectedRoundingCalculations: readonly [id: string, input: number, place: number, output: number][] = [
  ['r4-p15-a1-580', 580, 100, 600], ['r4-p15-a2-315', 315, 100, 300], ['r4-p15-example-2137', 2137, 1000, 2000],
  ['r4-p16-example-3482137', 3482137, 100000, 3500000], ['r4-p17-example-3582137', 3582137, 1000000, 4000000],
  ['r4-p17-check-a-moon', 385920, 1000, 386000], ['r4-p17-check-b-sahara', 5628000, 1000000, 6000000],
  ['r4-p17-practice-1-2957', 2957, 1000, 3000], ['r4-p17-practice-2-5856375', 5856375, 1000, 5856000],
  ['r4-p17-practice-3-a', 1523099, 1000, 1523000], ['r4-p17-practice-3-b', 7932523, 1000, 7933000],
  ['r4-p17-practice-3-c', 2999700, 1000, 3000000], ['r4-p17-practice-3-d', 50500005, 1000, 50500000],
  ['r4-p18-practice-5-a', 254900, 100000, 300000], ['r4-p18-practice-5-b', 107306, 100000, 100000],
  ['r4-p18-practice-5-c', 445700, 10000, 450000], ['r4-p18-practice-5-d', 285008, 10000, 290000],
  ['r4-p18-practice-5-e', 1987549, 1000000, 2000000], ['r4-p18-practice-5-f', 705600, 1000000, 1000000],
  ['r4-p18-practice-8-a', 5326009, 1000000, 5000000], ['r4-p18-practice-8-b', 1500990, 1000000, 2000000],
  ['r4-p18-practice-8-c', 6998421, 1000000, 7000000], ['r4-p18-practice-8-d', 9236545, 10, 9236550],
  ['r4-p18-practice-8-e', 232698, 1, 232698], ['r4-p18-practice-8-f', 9215001, 1000, 9215000],
  ['r4-p18-practice-8-g', 235691, 1000, 236000], ['r4-p18-practice-8-h', 4231659, 100, 4231700],
  ['r4-p18-practice-8-i', 3199245, 100000, 3200000], ['r4-p18-practice-9-sweden', 185180, 10000, 190000],
  ['r4-p18-practice-10-eggs', 112880, 10000, 110000], ['r4-p18-practice-11-car', 1750000, 1000000, 2000000],
  ['r4-p18-practice-12-earth', 6373000, 1000000, 6000000], ['r4-p18-practice-13-donation-million', 7480000, 1000000, 7000000],
  ['r4-p18-practice-13-donation-hundred-thousand', 7480000, 100000, 7500000],
]

function checkSourceLedger() {
  assert.equal(roundingBookTasks.length, 40, 'all printed examples and exercise branches on pp. 15–18 are catalogued')
  assert.deepEqual([...roundingBookTasks.map(task => task.id)].sort(), [...requiredBookTaskIds].sort())
  assert.equal(new Set(roundingBookTasks.map(task => task.id)).size, roundingBookTasks.length, 'book task ids are unique')
  assert.equal(numberLineTasks.length, 5, 'every printed number-line task has line metadata')
  assert.deepEqual(numberLineTasks.map(task => task.id).sort(), numberLinePromptTasks.map(task => task.id).sort(), 'every task that asks for a number line has explicit line geometry')
  for (const task of numberLineTasks) {
    const labels = task.lineLabels!
    const lineRange = task.lineRange
    const tickStep = task.lineTickStep
    assert.ok(lineRange && task.lineTargetValue && tickStep, `${task.id} defines its range, target value, and source tick interval`)
    const [minimum, maximum] = lineRange!
    const values = labels.map(Number)
    const target = Number(task.lineTargetValue)
    assert.ok(Number.isSafeInteger(minimum) && Number.isSafeInteger(maximum) && maximum > minimum, `${task.id} has a valid numeric domain`)
    assert.ok(Number.isSafeInteger(tickStep) && tickStep! > 0 && (maximum - minimum) % tickStep! === 0, `${task.id} domain is divisible by its tick interval`)
    const majorTickStep = task.lineMajorTickStep ?? tickStep!
    assert.ok(Number.isSafeInteger(majorTickStep) && majorTickStep > 0 && majorTickStep % tickStep! === 0 && (maximum - minimum) % majorTickStep === 0, `${task.id} major marks are aligned to the minor tick grid`)
    assert.ok(values.every(Number.isSafeInteger), `${task.id} number-line labels are integer values`)
    assert.ok(values.every((value, index) => index === 0 || value > values[index - 1]), `${task.id} number-line labels are strictly increasing`)
    assert.equal(values[0], minimum, `${task.id} labels the left endpoint`)
    assert.equal(values[values.length - 1], maximum, `${task.id} labels the right endpoint`)
    assert.ok(values.every(value => value >= minimum && value <= maximum), `${task.id} labels stay within the declared domain`)
    const regularTicks = Array.from({ length: (maximum - minimum) / tickStep! + 1 }, (_, index) => minimum + index * tickStep!)
    assert.ok(regularTicks.every(tick => tick >= minimum && tick <= maximum && (tick - minimum) % tickStep! === 0), `${task.id} generated ticks follow the declared interval within the domain`)
    assert.ok(Number.isSafeInteger(target) && target >= minimum && target <= maximum, `${task.id} target lies within the number-line domain`)
    assert.ok(task.prompt.includes(task.lineTargetValue!), `${task.id} number to represent appears in its prompt and line data`)
    assert.ok(values.every(value => (value - minimum) % tickStep! === 0 || value === target), `${task.id} labeled ticks follow the source interval; only a labeled target can fall between ticks`)
    const targetPosition = ((target - minimum) / (maximum - minimum)) * 100
    assert.ok(targetPosition >= 0 && targetPosition <= 100, `${task.id} target has a proportional position within the line`)
  }
  const source315Line = numberLineTasks.find(task => task.id === 'r4-p15-a2-315')!
  assert.deepEqual(source315Line.lineRange, [300, 400], 'source p. 15 number line spans 300–400')
  assert.deepEqual(source315Line.lineLabels, ['300', '310', '355', '400'], 'source p. 15 printed labels are preserved')
  assert.equal(source315Line.lineTickStep, 5, 'source p. 15 minor marks are spaced by five')
  assert.equal(source315Line.lineMajorTickStep, 10, 'source p. 15 longer marks are spaced by ten')
  assert.equal(source315Line.lineTargetValue, '315', '315 is explicitly stored as the value to represent')
  assert.equal((Number(source315Line.lineTargetValue) - source315Line.lineRange![0]) / (source315Line.lineRange![1] - source315Line.lineRange![0]), 0.15, '315 belongs at 15% of the 300–400 interval')
  assert.equal(requiredBookTaskIds.length, 40, 'independent page roster contains exactly 40 source branches')
  assert.deepEqual(
    Object.fromEntries(Object.entries(requiredBookTaskIdsByPage).map(([page, ids]) => [page, ids.length])),
    { 15: 4, 16: 1, 17: 10, 18: 25 },
    'independent source page totals match the printed page distribution',
  )
  for (const page of [15, 16, 17, 18] as const) {
    const pageTasks = roundingBookTasks.filter(task => task.page === page)
    assert.equal(pageTasks.length, requiredBookTaskIdsByPage[page].length, `page ${page} has the independently expected number of source branches`)
    assert.deepEqual(
      [...pageTasks.map(task => task.id)].sort(),
      [...requiredBookTaskIdsByPage[page]].sort(),
      `page ${page} contains the independently specified printed branch ids`,
    )
    for (const task of pageTasks) {
      assert.ok(task.prompt.trim() && task.section.trim(), `${task.id} has a prompt and printed section`)
      assert.notEqual(getRoundingBookAnswer(task.id), null, `${task.id} has a teacher answer`)
      const entry = lessonFourTeacherEntries.find(candidate => candidate.id === task.id)
      assert.ok(entry, `${task.id} has a teacher entry`)
      assert.deepEqual(entry.source, { type: 'textbook', page }, `${task.id} is attributed to its printed page`)
      assert.ok(entry.answer.trim() && entry.reasoning.length >= 2, `${task.id} has a worked teacher solution`)
    }
  }
  const secretCode = roundingBookTasks.find(task => task.id === 'r4-p18-practice-4-digit-code')!
  assert.equal(secretCode.page, 18)
  assert.equal(secretCode.prompt, 'اكتب عدداً من أربع خانات يمكن تقريبه إلى 5000 لأقرب ألف، مستعملاً الأرقام 7 و6 و5 و1 مرة واحدة.')
  const intro = lessonFourTeacherEntries.find(entry => entry.id === 'r4-p15-intro-facts')!
  assert.deepEqual(intro.source, { type: 'textbook', page: 15 })
  assert.match(intro.answer, /لا يطلب الكتاب.*تقريبهما/u, 'p. 15 facts are not falsely attributed as a rounding question')
  const sweden = lessonFourTeacherEntries.find(entry => entry.id === 'r4-p18-practice-9-sweden')!
  assert.match(sweden.prompt, /185180 كم²/u)
  assert.match(sweden.answer, /190000/u)
  assert.deepEqual(sweden.source, { type: 'textbook', page: 18 })
  assert.equal(finalAssessment4.length, 5)
  assert.ok(finalAssessment4.every(question => lessonFourTeacherEntries.some(entry => entry.id === question.id && entry.source.type === 'platform')))
  assert.ok(finalAssessment4.every(question => lessonFourTeacherEntries.find(entry => entry.id === question.id)?.title.includes('إضافي من إعداد المنصة')))
  const explanatory = finalAssessment4.find(question => question.id === 'round-final-4')!
  assert.equal(explanatory.kind, 'explanation')
  assert.match(explanatory.text, /4768210/u)
  assert.match(explanatory.answer, /4770000/u)
  assert.doesNotMatch(finalAssessment4.find(question => question.id === 'round-final-2')!.text, /2957/u, 'platform assessment does not relabel a printed p. 17 exercise as new')
  assert.doesNotMatch(finalAssessment4.find(question => question.id === 'round-final-3')!.text, /6998421/u, 'platform assessment avoids reusing a printed p. 18 number')
  assert.doesNotMatch(finalAssessment4.find(question => question.id === 'round-final-5')!.text, /7480000/u, 'platform assessment avoids reusing a printed p. 18 number')
}

function checkNumericalAndExplanatoryValidation() {
  assert.equal(normalizeRoundingDigits('٠١٢٣٤٥٦٧٨٩'), '0123456789')
  assert.equal(normalizeRoundingDigits('۰۱۲۳۴۵۶۷۸۹'), '0123456789')
  assert.equal(normalizeRoundingDigits('0123456789'), '0123456789')

  for (const valid of ['700000', '700,000', '700،000', '٧٠٠٬٠٠٠', '۷۰۰,۰۰۰', '700 000', ' ٧٠٠ ٠٠٠ ']) {
    assert.equal(normalizeRoundingNumberInput(valid), '700000', `accept valid localized integer ${valid}`)
  }
  for (const invalid of [
    '', '   ', '70,00,00', '7,0,0,0,0,0', '700,,000', '700،،000', '700,000 000',
    '700 00', '7000,00', '0700000', '0,000', ',700000', '700000,', '700.000',
    '-700000', '+700000', '700000 words', '7_00_000',
  ]) {
    assert.equal(normalizeRoundingNumberInput(invalid), null, `reject malformed or non-integer input ${JSON.stringify(invalid)}`)
  }

  assert.equal(roundToNearestPlace(580, 100), 600)
  assert.equal(roundToNearestPlace(315, 100), 300)
  assert.equal(roundToNearestPlace(185180, 10000), 190000)
  assert.equal(roundToNearestPlace(184999, 10000), 180000, 'just below the midpoint rounds down')
  assert.equal(roundToNearestPlace(185000, 10000), 190000, 'the exact midpoint rounds up per the lesson rule')
  assert.equal(roundToNearestPlace(185001, 10000), 190000, 'just above the midpoint rounds up')
  assert.equal(roundToNearestPlace(1.5, 1), null, 'non-integer natural-number inputs are rejected')
  for (const [id, input, place, output] of expectedRoundingCalculations) {
    const task = roundingBookTasks.find(item => item.id === id)
    assert.ok(task?.prompt.includes(String(input)), `${id} prompt retains the independently catalogued printed operand ${input}`)
    assert.equal(roundToNearestPlace(input, place), output, `${id} independent rounding calculation`)
    assert.equal(isRoundingBookAnswerCorrect(id, String(output)), true, `${id} accepts its independently calculated result`)
  }
  for (const validCode of ['5167', '5176']) {
    assert.equal(roundToNearestPlace(Number(validCode), 1000), 5000, `${validCode} is a valid four-digit secret code rounding to 5000`)
    assert.equal(isRoundingBookAnswerCorrect('r4-p18-practice-4-digit-code', validCode), true)
  }
  assert.equal(isRoundingBookAnswerCorrect('r4-p18-practice-4-digit-code', '5671'), false)

  assert.equal(isRoundingBookAnswerCorrect('r4-p15-a1-580', '٦٠٠'), true)
  assert.equal(isRoundingBookAnswerCorrect('r4-p15-a1-580', '۶۰۰'), true)
  assert.equal(isRoundingBookAnswerCorrect('r4-p15-a1-580', '6,0,0'), false)
  assert.equal(isRoundingBookAnswerCorrect('r4-p15-a1-580', '500'), false)
  assert.equal(isRoundingBookAnswerCorrect('r4-p15-a1-580', ''), false)
  assert.equal(isRoundingBookAnswerCorrect('r4-p15-a2-315', '۳۰۰'), true)
  assert.equal(isRoundingBookAnswerCorrect('r4-p15-a3-1390', '1400'), true)
  assert.equal(isRoundingBookAnswerCorrect('r4-p15-a3-1390', '1399'), false)
  assert.equal(isRoundingBookAnswerCorrect('r4-p18-practice-6-a', 'صح'), true)
  assert.equal(isRoundingBookAnswerCorrect('r4-p18-practice-6-b', 'صح'), false)

  const oral = 'نحدد المنزلة المطلوبة، ثم نفحص الرقم الذي يليها مباشرة. إذا كان 5 أو أكبر نرفع المنزلة، وإذا كان أقل من 5 نبقيها كما هي، ثم نصفر الخانات التي على يمينها.'
  assert.equal(isRoundingBookAnswerCorrect('r4-p17-oral-rounding-steps', oral), true)
  assert.equal(isRoundingBookAnswerCorrect('r4-p17-oral-rounding-steps', String(getRoundingBookAnswer('r4-p17-oral-rounding-steps'))), true, 'the teacher answer key satisfies its own explanation rubric')
  const oralAlternative = 'نختار المنزلة التي نريد التقريب إليها وننظر إلى الرقم على يمينها. خمسة فأكثر يعني زيادة المنزلة، وأربعة أو أقل يعني إبقاءها؛ ونحوّل الخانات الأقل على يمينها إلى أصفار.'
  assert.equal(isRoundingBookAnswerCorrect('r4-p17-oral-rounding-steps', oralAlternative), true, 'a valid paraphrase with explicit high and low cases is accepted')
  assert.equal(isRoundingBookAnswerCorrect('r4-p17-oral-rounding-steps', 'نحدد المنزلة ونفحص الرقم على يمينها. إذا كان 5 أو أكثر نزيدها، ثم نصفر الخانات إلى يمينها.'), false, 'an answer that omits the below-five case is incomplete')
  assert.equal(isRoundingBookAnswerCorrect('r4-p17-oral-rounding-steps', 'نختار المنزلة التي نريد التقريب إليها ونفحص الرقم التالي. إذا كان أقل من 5 نزيد المنزلة، وإذا كان 5 أو أكثر نبقيها؛ ثم نصفر ما على يمينها.'), false, 'reversed rounding branches are rejected')
  assert.equal(isRoundingBookAnswerCorrect('r4-p17-oral-rounding-steps', 'نحدد المنزلة، وإذا كان 5 أو أكثر نزيدها، وإذا كان أقل من 5 نبقيها.'), false, 'an answer that omits the adjacent digit and zeroing rule is incomplete')
  assert.equal(isRoundingBookAnswerCorrect('r4-p17-oral-rounding-steps', 'نحدد المنزلة المطلوبة ونفحص الرقم المجاور؛ إذا كان خمسة أو أكثر نزيدها، وإذا كان أقل من خمسة نتركها، ثم نحوّل الخانات إلى يمينها إلى أصفار.'), true, 'another grammatically varied complete explanation is accepted')
  assert.equal(isRoundingBookAnswerCorrect('r4-p18-practice-7-reason', 'نعم، تختلف النتيجة لأن منزلة التقريب للملايين تختلف عن آحاد الألوف، والرقم المجاور يتغير.'), true)
  assert.equal(isRoundingBookAnswerCorrect('r4-p18-practice-7-reason', 'لا يختلف التقريب للملايين عن آحاد الألوف.'), false)

  const finalNumeric = finalAssessment4.find(question => question.id === 'round-final-1')!
  assert.equal(isFinalAssessment4AnswerCorrect(finalNumeric, '٥٬٠٠٠٬٠٠٠'), true)
  assert.equal(isFinalAssessment4AnswerCorrect(finalNumeric, '50,00,000'), false)
  assert.equal(isFinalAssessment4AnswerCorrect(finalNumeric, ''), false)
  const finalTwo = finalAssessment4.find(question => question.id === 'round-final-2')!
  const finalThree = finalAssessment4.find(question => question.id === 'round-final-3')!
  const finalFive = finalAssessment4.find(question => question.id === 'round-final-5')!
  assert.equal(roundToNearestPlace(6432, 1000), 6000)
  assert.equal(roundToNearestPlace(6958421, 1000000), 7000000)
  assert.equal(roundToNearestPlace(8347000, 1000000), 8000000)
  assert.equal(isFinalAssessment4AnswerCorrect(finalTwo, '٦٬٠٠٠'), true)
  assert.equal(isFinalAssessment4AnswerCorrect(finalThree, '7,000,000'), true)
  assert.equal(isFinalAssessment4AnswerCorrect(finalFive, '8,000,000'), true)
  const finalExplanation = finalAssessment4.find(question => question.id === 'round-final-4')!
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, finalExplanation.answer), true, 'the platform teacher answer satisfies its own explanation rubric')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٨، لذلك نزيد عشرات الآلاف من ٦ إلى ٧، ونصفر الخانات التي على يمينها، والناتج ٤٬٧٧٠٬٠٠٠.'), true)
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف 8 أكبر من 5، لذلك نرفع عشرات الآلاف من 6 إلى 7؛ وتصبح المنازل الأصغر على يمينها أصفاراً، فيكون الناتج 4 770 000.'), true, 'alternative explanation explicitly links the adjacent digit, increment, zeroing, and result')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٣، لذلك نبقي العدد عند ٤٬٧٦٠٬٠٠٠.'), false)
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٨، الزيادة من ٦ إلى ٧ غير صحيحة. نرفع عشرات الآلاف من ٦ إلى ٧، ونصفر الخانات إلى يمينها، والناتج ٤٧٧٠٠٠٠.'), false, 'a stated negation of the 6-to-7 increase contradicts the later claim')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٨، لا نرفع عشرات الآلاف من ٦ إلى ٧، ومع ذلك نذكر الرفع ونصفر الخانات إلى يمينها، والناتج ٤٧٧٠٠٠٠.'), false, 'a direct negation of the increase is contradictory')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٨، نرفع عشرات الآلاف من ٦ إلى ٧، لكن هذه الزيادة غير صحيحة. ونصفر الخانات إلى يمينها، والناتج ٤٧٧٠٠٠٠.'), false, 'a later explicit rejection of the increase is contradictory')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٨، نرفع عشرات الآلاف من ٦ إلى ٧، ونصفر الخانات إلى يمينها، لكن تصفيرها غير صحيح، والناتج ٤٧٧٠٠٠٠.'), false, 'a stated negation of zeroing is contradictory')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٨، نرفع عشرات الآلاف من ٦ إلى ٧، ونصفر الخانات إلى يمينها، والناتج ٤٧٧٠٠٠٠ غير صحيح.'), false, 'a stated rejection of the computed result is contradictory')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٨، نرفع عشرات الآلاف من ٦ إلى ٧، ونصفر الخانات التي على يمينها، والناتج ٤٧٧٠٠٠٠؛ أما إذا كان الرقم أقل من ٥ فلا نرفع المنزلة ونبقيها كما هي.'), true, 'a correct conditional statement about numbers below five does not negate this answer')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, 'رقم الآلاف ٨، لذلك نرفع عشرات الآلاف من ٦ إلى ٧، فيكون الناتج ٤٬٧٧٠٬٠٠٠.'), false, 'the explanation must mention zeros in lower places')
  assert.equal(isFinalAssessment4AnswerCorrect(finalExplanation, ''), false)
}

async function checkRealInteractions() {
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/#lesson/rounding-natural-numbers',
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
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

  const React = await import('react')
  const { render, screen, fireEvent, within } = await import('@testing-library/react')
  const { RoundingLesson } = await import('../src/lessons/RoundingLesson')
  render(React.createElement(RoundingLesson))

  const pageTask = (id: string) => {
    const element = document.querySelector<HTMLElement>(`[data-source-id="${id}"]`)
    assert.ok(element, `${id} is present in the student lesson`)
    return element!
  }
  const next = () => fireEvent.click(screen.getByRole('button', { name: /التالي/u }))
  const inputFor = (scope: HTMLElement) => within(scope).getByRole('textbox') as HTMLInputElement
  const check = (scope: HTMLElement) => fireEvent.click(within(scope).getByRole('button', { name: 'تحقّق' }))
  const renderedNumberLineIds = new Set<string>()
  const verifyRenderedNumberLine = (taskId: string, scope: HTMLElement) => {
    const task = roundingBookTasks.find(candidate => candidate.id === taskId)
    assert.ok(task?.lineLabels && task.lineRange && task.lineTargetValue && task.lineTickStep, `${taskId} has full line data`)
    const line = within(scope).getByRole('group')
    const [minimum, maximum] = task.lineRange!
    const range = maximum - minimum
    const tickStep = task.lineTickStep!
    const majorTickStep = task.lineMajorTickStep ?? tickStep
    const expectedPosition = (value: number) => `${Number((((value - minimum) / range) * 100).toFixed(6))}%`
    assert.equal(Number(line.getAttribute('data-numberline-min')), minimum)
    assert.equal(Number(line.getAttribute('data-numberline-max')), maximum)
    assert.equal(line.getAttribute('data-numberline-tick-step'), String(tickStep))
    assert.equal(
      line.getAttribute('data-numberline-major-tick-step'),
      task.lineMajorTickStep === undefined ? null : String(task.lineMajorTickStep),
      `${taskId} reports only an explicitly defined major interval`,
    )
    assert.equal(line.getAttribute('data-numberline-target-value'), task.lineTargetValue)
    assert.equal(line.getAttribute('data-numberline-target-position'), expectedPosition(Number(task.lineTargetValue)))
    const tickNodes = [...line.querySelectorAll<HTMLElement>('[data-numberline-tick]')]
    const expectedTickValues = Array.from({ length: range / tickStep + 1 }, (_, index) => minimum + index * tickStep)
    assert.deepEqual(tickNodes.map(node => Number(node.dataset.numberlineTick)), expectedTickValues, `${taskId} renders every—and only—tick in its source interval`)
    for (const tickNode of tickNodes) {
      const tickValue = Number(tickNode.dataset.numberlineTick)
      assert.ok(tickValue >= minimum && tickValue <= maximum, `${taskId} tick ${tickValue} is within range`)
      assert.equal((tickValue - minimum) % tickStep, 0, `${taskId} tick ${tickValue} follows the declared minor interval`)
      assert.equal(tickNode.style.left, expectedPosition(tickValue), `${taskId} tick ${tickValue} is proportionally placed`)
      const expectedHeight = task.lineMajorTickStep
        ? (tickValue - minimum) % majorTickStep === 0 ? '12px' : '7px'
        : task.lineLabels!.includes(String(tickValue)) ? '12px' : '7px'
      assert.equal(tickNode.style.height, expectedHeight, `${taskId} tick ${tickValue} uses the configured mark length`)
    }
    for (const label of task.lineLabels!) {
      const value = Number(label)
      const labelNode = line.querySelector<HTMLElement>(`[data-numberline-value="${label}"]`)
      assert.ok(labelNode, `${taskId} displays source label ${label}`)
      assert.equal(labelNode.style.left, expectedPosition(value), `${taskId} label ${label} is proportionally placed`)
    }
    const target = Number(task.lineTargetValue)
    if ((target - minimum) % tickStep === 0) {
      assert.ok(line.querySelector(`[data-numberline-tick="${target}"]`), `${taskId} target ${target} lies on a printed tick`)
    }
    renderedNumberLineIds.add(taskId)
    return line
  }

  assert.ok(screen.getByText(/معلومات تمهيدية في الصفحة/u), 'the book introduction is not presented as a printed rounding exercise')
  const hundreds = pageTask('r4-p15-a1-580')
  const p15Line = verifyRenderedNumberLine('r4-p15-a1-580', hundreds)
  for (const [value, expectedPosition] of [['500', '0%'], ['510', '10%'], ['520', '20%'], ['600', '100%']] as const) {
    assert.equal(p15Line.querySelector<HTMLElement>(`[data-numberline-value="${value}"]`)?.style.left, expectedPosition, `p. 15 label ${value} is positioned proportionally`)
  }
  assert.equal(p15Line.querySelectorAll('span[aria-hidden="true"]').length, 11, 'p. 15 line renders the printed 10-unit minor tick scale')
  assert.equal(p15Line.style.direction, 'ltr', 'number-line labels keep numeric left-to-right order inside the RTL lesson')
  assert.equal(p15Line.getAttribute('aria-label')?.includes('500، 510، 520، 600'), true, 'the scaled line has an accessible Arabic description')
  assert.equal(p15Line.getAttribute('style')?.includes('width: 100%'), true, 'the plotted line remains responsive to its container')
  const secondHundreds = pageTask('r4-p15-a2-315')
  const p15Line315 = verifyRenderedNumberLine('r4-p15-a2-315', secondHundreds)
  assert.equal(p15Line315.getAttribute('aria-label')?.includes('300، 310، 355، 400'), true, 'p. 15 printed labels match the source crop')
  assert.equal(p15Line315.getAttribute('data-numberline-target-position'), '15%', '315 is proportionally located 15% from 300 on a 300–400 line')
  assert.equal(p15Line315.querySelector<HTMLElement>('[data-numberline-value="355"]')?.style.left, '55%', 'the printed 355 label is 55% across the source interval')
  assert.equal(p15Line315.querySelector<HTMLElement>('[data-numberline-tick="315"]')?.style.height, '7px', '315 lies on the minor tick halfway between the major 310 and 320 marks')
  assert.equal(p15Line315.querySelector<HTMLElement>('[data-numberline-tick="310"]')?.style.height, '12px')
  assert.equal(p15Line315.querySelector<HTMLElement>('[data-numberline-tick="320"]')?.style.height, '12px')
  verifyRenderedNumberLine('r4-p15-example-2137', pageTask('r4-p15-example-2137'))
  const hundredsInput = inputFor(hundreds)
  check(hundreds)
  assert.ok(within(hundreds).getByRole('alert').textContent?.includes('أدخل إجابتك'), 'blank input asks for an answer')
  fireEvent.change(hundredsInput, { target: { value: '500' } })
  check(hundreds)
  assert.ok(within(hundreds).getByRole('status').textContent?.includes('ليست صحيحة'), 'wrong numeric answer is not marked correct')
  assert.equal(within(hundreds).getByRole('status').className.includes('good'), false)
  fireEvent.change(hundredsInput, { target: { value: '٦٠٠' } })
  check(hundreds)
  assert.ok(within(hundreds).getByRole('status').textContent?.includes('إجابة صحيحة'), 'Arabic-Indic correct answer is accepted')
  fireEvent.change(hundredsInput, { target: { value: '6,0,0' } })
  check(hundreds)
  assert.ok(within(hundreds).getByRole('status').textContent?.includes('ليست صحيحة'), 'malformed grouping is rejected in the actual UI')

  fireEvent.change(inputFor(secondHundreds), { target: { value: '۳۰۰' } })
  check(secondHundreds)
  assert.ok(within(secondHundreds).getByRole('status').textContent?.includes('إجابة صحيحة'), 'Persian/extended Arabic-Indic digits are accepted')
  const choice = pageTask('r4-p15-a3-1390')
  const wrongChoice = within(choice).getByRole('radio', { name: '1399' })
  fireEvent.click(wrongChoice)
  assert.equal((wrongChoice as HTMLInputElement).checked, true, 'choice state is exposed through native radio semantics')
  check(choice)
  assert.ok(within(choice).getByRole('status').textContent?.includes('ليست صحيحة'), 'wrong choice receives corrective feedback')
  fireEvent.click(within(choice).getByRole('radio', { name: '1400' }))
  check(choice)
  assert.ok(within(choice).getByRole('status').textContent?.includes('إجابة صحيحة'), 'correct choice receives positive feedback after checking')

  next()
  next()
  const p17FirstLine = verifyRenderedNumberLine('r4-p17-practice-1-2957', pageTask('r4-p17-practice-1-2957'))
  assert.equal(p17FirstLine.querySelector<HTMLElement>('[data-numberline-value="2600"]')?.style.left, '60%', 'p. 17 value 2600 is at 60% of the 2000–3000 range, not the visual midpoint')
  const p17SecondLine = verifyRenderedNumberLine('r4-p17-practice-2-5856375', pageTask('r4-p17-practice-2-5856375'))
  assert.equal(p17SecondLine.querySelector<HTMLElement>('[data-numberline-value="5856400"]')?.style.left, '40%', 'p. 17 value 5856400 is at 40% of the numeric range')
  assert.deepEqual([...renderedNumberLineIds].sort(), numberLineTasks.map(task => task.id).sort(), 'rendered proportional geometry is checked for every number line')
  const oralTask = pageTask('r4-p17-oral-rounding-steps')
  const oralInput = inputFor(oralTask)
  fireEvent.change(oralInput, { target: { value: 'نذكر قاعدة فقط من دون تحديد الرقم المجاور.' } })
  check(oralTask)
  assert.ok(within(oralTask).getByRole('status').textContent?.includes('راجع الفكرة'), 'incomplete explanation is rejected')
  fireEvent.change(oralInput, { target: { value: 'نحدد المنزلة التي نريد تقريبها، ونفحص الرقم المجاور. إذا كان 5 أو أكبر نرفعها، وإذا كان أقل من 5 نبقيها، ثم نصفر الخانات إلى يمينها.' } })
  check(oralTask)
  assert.ok(within(oralTask).getByRole('status').textContent?.includes('إجابة صحيحة'), 'explanation is evaluated by required concepts rather than literal text')

  next()
  const sweden = pageTask('r4-p18-practice-9-sweden')
  fireEvent.change(inputFor(sweden), { target: { value: '٢٠٠٬٠٠٠' } })
  check(sweden)
  assert.ok(within(sweden).getByRole('status').textContent?.includes('ليست صحيحة'), 'old incorrect Sweden result is rejected')
  fireEvent.change(inputFor(sweden), { target: { value: '١٩٠٬٠٠٠' } })
  check(sweden)
  assert.ok(within(sweden).getByRole('status').textContent?.includes('إجابة صحيحة'), 'book answer 190,000 is accepted')
  const trueFalse = pageTask('r4-p18-practice-6-a')
  fireEvent.click(within(trueFalse).getByRole('radio', { name: 'صح' }))
  check(trueFalse)
  assert.ok(within(trueFalse).getByRole('status').textContent?.includes('إجابة صحيحة'), 'true/false branch is interactive and graded')

  next()
  const finalNumber = screen.getByRole('textbox', { name: 'round-final-1: إجابة عددية' })
  fireEvent.change(finalNumber, { target: { value: '50,00,000' } })
  fireEvent.change(screen.getByRole('textbox', { name: 'round-final-4: إجابة تفسيرية' }), {
    target: { value: 'رقم الآلاف 8، فنزيد عشرات الآلاف من 6 إلى 7، ونصفر الخانات إلى يمينها، والناتج 4770000.' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'عرض النتيجة' }))
  assert.ok(screen.getByText(/نتيجتك: 1 \/ 5/u), 'final score counts accepted explanation but rejects malformed numeric input')
  assert.ok(screen.getAllByRole('status').some(status => status.textContent?.includes('راجع المنزلة المطلوبة')), 'per-question feedback is announced after submission')
  assert.ok(screen.getAllByText(/اختبار إضافي من إعداد المنصة/u).length > 0, 'platform-authored items are visibly distinguished from textbook tasks')

  dom.window.close()
}

async function main() {
  checkSourceLedger()
  checkNumericalAndExplanatoryValidation()
  await checkRealInteractions()
  console.log('Lesson 4 checks passed: all 40 textbook task branches (pp. 15–18), answer keys, strict localized input, edge cases, accessibility semantics, and jsdom interactions.')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
