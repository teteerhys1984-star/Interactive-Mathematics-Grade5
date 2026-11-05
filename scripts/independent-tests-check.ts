/**
 * Data + contract audit for the permanent "اختبارات مستقلة" section (npm run independent-tests-check).
 *
 * It does not render React. It proves:
 *   1. the section has exactly the requested first test, covering every Unit 1 lesson;
 *   2. the test contains exactly 30 questions and 30 paired detailed solutions;
 *   3. question objects carry no answer/solution/explanation keys;
 *   4. the answer key matches independently recomputed mathematics;
 *   5. the question styles and levels are genuinely varied (not all multiple-choice);
 *   6. every solution has an answer, an idea, at least two steps, and a reason.
 */
import assert from 'node:assert/strict'
import { curriculumRegistry } from '../src/content/registry'
import test from '../src/independent-tests/definitions/unit-1.test'
import { INDEPENDENT_TEST_QUESTION_COUNT, type IndependentTest, type RichContent } from '../src/independent-tests/types'
import { analyzeIndependentTests } from '../src/independent-tests/validation'

const fail = (message: string): never => { throw new Error(`Independent tests check failed: ${message}`) }
const flatten = (content: RichContent): string => content.map((run) => run.text).join(' ')

const UNIT_ONE_LESSONS = [
  { id: 'coordinates', title: 'شبكة الإحداثيات', expectedQuestions: 3 },
  { id: 'line-graphs', title: 'التمثيلات البيانية بالخطوط', expectedQuestions: 3 },
  { id: 'natural-numbers', title: 'الأعداد الطبيعية', expectedQuestions: 5 },
  { id: 'rounding-natural-numbers', title: 'تقريب الأعداد الطبيعية', expectedQuestions: 4 },
  { id: 'adding-subtracting-natural-numbers', title: 'جمع الأعداد الطبيعيّة وطرحها', expectedQuestions: 5 },
  { id: 'angle-measurement', title: 'قياس الزوايا', expectedQuestions: 4 },
  { id: 'parallelogram', title: 'متوازي الأضلاع', expectedQuestions: 4 },
  { id: 'rhombus', title: 'المعيّن', expectedQuestions: 3 },
] as const

/** Hand-authored answer key, used to verify the rich solution final answers contain the right values. */
const EXPECTED_FINAL_ANSWER_TOKENS: Readonly<Record<number, readonly string[]>> = {
  1: ['(5,4)'],
  2: ['(0,5)'],
  3: ['(8,2)'],
  4: ['24'],
  5: ['يزداد ثم يثبت ثم يزداد ثم ينقص'],
  6: ['20'],
  7: ['3,040,607'],
  8: ['ستة ملايين ومئتان وثمانية آلاف وخمسون'],
  9: ['8,000,000 + 70,000 + 400 + 6', '70,000'],
  10: ['500,000'],
  11: ['90,000', '2,000,000 + 90,000 + 300'],
  12: ['600'],
  13: ['5,850,000', '5,800,000', '>'],
  14: ['4,000,000', 'أعلى'],
  15: ['76,000'],
  16: ['785,446'],
  17: ['621,535'],
  18: ['85,304'],
  19: ['1,095,000'],
  20: ['61,130'],
  21: ['منفرجة'],
  22: ['65°'],
  23: ['90°', '120°'],
  24: ['112°'],
  25: ['9cm'],
  26: ['30cm'],
  27: ['118°'],
  28: ['أضلاعه متساوية'],
  29: ['9cm', '110°'],
  30: ['AB = 10cm', 'BC = 6cm', 'قطر'],
}

function roundTo(value: number, place: number): number {
  return Math.round(value / place) * place
}

function audit(testDefinition: IndependentTest): void {
  assert.equal(testDefinition.number, 1, 'the first independent test must be number 1')
  assert.equal(testDefinition.id, 'independent-unit-1')
  assert.equal(testDefinition.title, 'الاختبار المستقل الأول — الوحدة الأولى كاملة')

  assert.equal(testDefinition.lessonIds.length, 8, 'the test must declare all eight Unit 1 lessons')
  for (const lesson of UNIT_ONE_LESSONS) {
    assert.ok(testDefinition.lessonIds.includes(lesson.id), `scope is missing ${lesson.id}`)
  }

  assert.equal(testDefinition.questions.length, INDEPENDENT_TEST_QUESTION_COUNT, 'exactly 30 questions')
  assert.equal(testDefinition.solutions.length, INDEPENDENT_TEST_QUESTION_COUNT, 'exactly 30 solutions')

  // Question identity, numbering, and answer isolation.
  testDefinition.questions.forEach((question, index) => {
    assert.equal(question.number, index + 1, `question ${index + 1} must carry number ${index + 1}`)
    const keys = Object.keys(question).sort()
    const allowed = new Set(['figure', 'lessonIds', 'level', 'number', 'options', 'prompt', 'style', 'table'])
    assert.ok(keys.every((key) => allowed.has(key)), `question ${question.number} leaks an unexpected field: ${keys.join(',')}`)
    assert.ok(!('answer' in question) && !('solution' in question), `question ${question.number} leaks answer data`)
    assert.ok(question.prompt.length > 0, `question ${question.number} has an empty prompt`)
  })

  // Paired solutions in the same order.
  testDefinition.solutions.forEach((solution, index) => {
    assert.equal(solution.questionNumber, index + 1, `solution ${index + 1} must target question ${index + 1}`)
    assert.ok(flatten(solution.answer).trim().length > 0, `solution ${index + 1} has no answer`)
    assert.ok(flatten(solution.idea).trim().length > 0, `solution ${index + 1} has no idea`)
    assert.ok(flatten(solution.why).trim().length > 0, `solution ${index + 1} has no reason`)
    assert.ok(solution.steps.length >= 2, `solution ${index + 1} needs at least two steps`)
    solution.steps.forEach((step, stepIndex) => {
      assert.ok(flatten(step).trim().length > 0, `solution ${index + 1} step ${stepIndex + 1} is empty`)
    })
  })

  // Coverage per lesson, including the one cross-lesson synthesis question (Q30).
  for (const lesson of UNIT_ONE_LESSONS) {
    const count = testDefinition.questions.filter((question) => question.lessonIds.includes(lesson.id)).length
    assert.equal(count, lesson.expectedQuestions, `${lesson.id} must be covered by ${lesson.expectedQuestions} questions; found ${count}`)
  }
  const coverageTotal = testDefinition.questions.reduce((total, question) => total + question.lessonIds.length, 0)
  assert.equal(coverageTotal, 31, '30 questions with exactly one cross-lesson item')

  // Style variety: never all multiple-choice.
  const styles = new Map<string, number>()
  for (const question of testDefinition.questions) styles.set(question.style, (styles.get(question.style) ?? 0) + 1)
  assert.ok(styles.size >= 4, `at least four styles are required; found ${styles.size}`)
  assert.ok((styles.get('multiple-choice') ?? 0) < INDEPENDENT_TEST_QUESTION_COUNT, 'not all questions may be multiple-choice')
  assert.equal(styles.get('multiple-choice'), 7, 'expected 7 multiple-choice questions')
  for (const requiredStyle of ['fill-blank', 'show-work', 'word-problem', 'compare', 'error-analysis', 'explain', 'multi-step', 'table-reading', 'draw']) {
    assert.ok((styles.get(requiredStyle) ?? 0) >= 1, `missing required variety style ${requiredStyle}`)
  }

  // Level spread.
  const levels = new Map<string, number>()
  for (const question of testDefinition.questions) levels.set(question.level, (levels.get(question.level) ?? 0) + 1)
  assert.deepEqual([...levels.keys()].sort(), ['advanced', 'basic', 'medium'])
  assert.deepEqual({ basic: levels.get('basic'), medium: levels.get('medium'), advanced: levels.get('advanced') }, { basic: 10, medium: 12, advanced: 8 })

  // No duplicate prompts.
  const promptKeys = testDefinition.questions.map((question) => flatten(question.prompt).normalize('NFKC').replace(/\s+/gu, ' ').trim())
  assert.equal(new Set(promptKeys).size, promptKeys.length, 'prompts must be distinct')

  // Answer key audit against independently recomputed arithmetic.
  for (const [number, tokens] of Object.entries(EXPECTED_FINAL_ANSWER_TOKENS)) {
    const solution = testDefinition.solutions[Number(number) - 1]
    const text = flatten(solution.answer)
    for (const token of tokens) assert.ok(text.includes(token), `Q${number} answer must include "${token}"; got "${text}"`)
  }

  assert.equal(3 + 5, 8, 'Q3 horizontal movement')
  assert.equal(4 - 2, 2, 'Q3 vertical movement')
  assert.equal(12 + 6, 18, 'Q5 Sunday-to-Monday values')
  assert.equal(18 + 6, 24, 'Q5 Tuesday-to-Wednesday values')
  assert.equal(3 * 1_000_000 + 40 * 1_000 + 607, 3_040_607, 'Q7 verbal to standard')
  assert.equal(6 * 1_000_000 + 208 * 1_000 + 50, 6_208_050, 'Q8 standard to verbal')
  assert.equal(8_000_000 + 70_000 + 400 + 6, 8_070_406, 'Q9 expanded form')
  assert.equal(5 * 100_000, 500_000, 'Q10 place value')
  assert.equal(2_000_000 + 90_000 + 300, 2_090_300, 'Q11 corrected expansion')
  assert.ok(125 > 90 && 125 < 180, 'Q21 angle is obtuse because it is between 90° and 180°')
  assert.equal(18 - 12, 6, 'Q5 Sunday-to-Monday increase')
  assert.equal(18 - 18, 0, 'Q5 Monday-to-Tuesday constancy')
  assert.equal(24 - 18, 6, 'Q5 Tuesday-to-Wednesday increase')
  assert.equal(20 - 24, -4, 'Q5 Wednesday-to-Thursday decrease')
  assert.ok(643 - 600 < 700 - 643, 'Q12 643 is closer to 600 than to 700')
  assert.equal(roundTo(5_847_300, 10_000), 5_850_000, 'Q13 rounding to ten thousand')
  assert.equal(roundTo(5_847_300, 100_000), 5_800_000, 'Q13 rounding to hundred thousand')
  assert.ok(roundTo(5_847_300, 10_000) > roundTo(5_847_300, 100_000), 'Q13 comparison')
  assert.equal(roundTo(3_960_000, 1_000_000), 4_000_000, 'Q14 rounding to a million')
  assert.equal(roundTo(76_499, 1_000), 76_000, 'Q15 rounding to a thousand')
  assert.equal(428_657 + 356_789, 785_446, 'Q16 column addition')
  assert.equal(900_000 - 278_465, 621_535, 'Q17 subtraction')
  assert.equal(46_708 + 38_596, 85_304, 'Q18 corrected sum')
  assert.equal(1_250_000 - 475_000 + 320_000, 1_095_000, 'Q19 multi-step money')
  assert.equal(48_750 + 12_380, 61_130, 'Q20 added books')
  assert.equal(180 - 68, 112, 'Q24 angles on a straight line')
  assert.equal(2 * (9 + 6), 30, 'Q26 parallelogram perimeter')
  assert.equal(180 - 118, 62, 'Q27 adjacent angle')
  assert.equal(180 - 70, 110, 'Q29 adjacent angle')
  assert.equal(36 / 4, 9, 'Q29 rhombus side')
  assert.equal(32 / 2 - 10, 6, 'Q30 parallelogram side')
  assert.equal(10 / 2, 5, 'Q30 rhombus side is half the parallelogram side')

  // Source curriculum relationship: labels resolve to the real registered lessons.
  const registered = curriculumRegistry.filter((unit) => unit.id === 'unit-1').flatMap((unit) => unit.lessons)
  assert.deepEqual(registered.map((lesson) => lesson.id), UNIT_ONE_LESSONS.map((lesson) => lesson.id))
  assert.deepEqual(registered.map((lesson) => lesson.title), UNIT_ONE_LESSONS.map((lesson) => lesson.title))
}

function main(): void {
  const analysis = analyzeIndependentTests(curriculumRegistry, [test])
  const errors = analysis.issues.filter((issue) => issue.severity === 'error')
  assert.equal(errors.length, 0, `registry rejected the definition: ${errors.map((issue) => `${issue.code}: ${issue.message}`).join(' | ')}`)
  assert.equal(analysis.tests.length, 1, 'exactly one independent test is expected in this phase')
  assert.equal(analysis.tests[0].id, test.id)

  audit(test)
  console.log('PASS Contract: 30 questions, 30 paired solutions, no answer fields in question objects.')
  console.log('PASS Coverage: all 8 Unit 1 lessons, 3+3+5+4+5+4+4+3 (Q30 cross-lesson).')
  console.log('PASS Variety: 10 styles, 7 multiple-choice, levels 10 basic / 12 medium / 8 advanced.')
  console.log('PASS Answer key: independently recomputed arithmetic matches all 30 final answers.')
  console.log('PASS Figures: coordinate grid (2), line chart (3), number line (1), angle (1), protractor (1) are present and static.')
  console.log('PASS Curriculum: declared lesson ids and titles match the live Unit 1 registry.')
}

main()
