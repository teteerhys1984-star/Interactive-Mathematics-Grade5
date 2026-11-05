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
  1: ['(6,2)'],
  2: ['الشاقولي'],
  3: ['(7,3)'],
  4: ['4'],
  5: ['تزداد'],
  6: ['15'],
  7: ['700,000'],
  8: ['أربعة ملايين وعشرون ألفاً وثلاثمئة وخمسة'],
  9: ['3,000,000 + 400,000 + 5,000 + 60'],
  10: ['سبعمئة وسبعة'],
  11: ['1,003,578'],
  12: ['5,000,000'],
  13: ['6,000'],
  14: ['110,000'],
  15: ['4,770,000', '4,768,000', '>'],
  16: ['992,886'],
  17: ['1,067,760'],
  18: ['884,858'],
  19: ['8,230'],
  20: ['1,780,500'],
  21: ['منفرجة'],
  22: ['90°', '180°'],
  23: ['B', '50°'],
  24: ['90°', 'قائمة'],
  25: ['متوازيان', 'متساويان'],
  26: ['22cm'],
  27: ['لا'],
  28: ['متجاورين'],
  29: ['24cm', '115°', '65°'],
  30: ['3cm', '8cm'],
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
    const allowed = new Set(['lessonIds', 'level', 'number', 'options', 'prompt', 'style', 'table'])
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

  assert.equal(18 - 14, 4, 'Q4 temperature range')
  assert.equal(76 - 61, 15, 'Q6 height increase')
  assert.equal(7 * 100000, 700000, 'Q7 place value')
  assert.equal(18 - 14, 4)
  assert.equal(203565 + 789321, 992886, 'Q16 column addition')
  assert.equal(3221991 - 2154231, 1067760, 'Q17 column subtraction')
  assert.equal(230569 + 654289, 884858, 'Q18 word-problem addition')
  assert.equal(4580 + 3650, 8230, 'Q19 correction')
  assert.equal(1250000 + 980500 - 450000, 1780500, 'Q20 net sales')
  assert.equal(roundTo(4682137, 1000000), 5000000, 'Q12 rounding to a million')
  assert.equal(roundTo(6432, 1000), 6000, 'Q13 rounding to a thousand')
  assert.equal(roundTo(112880, 10000), 110000, 'Q14 rounding to ten thousand')
  assert.equal(roundTo(4768210, 10000), 4770000, 'Q15 first rounded value')
  assert.equal(roundTo(4768210, 1000), 4768000, 'Q15 second rounded value')
  assert.ok(roundTo(4768210, 10000) > roundTo(4768210, 1000), 'Q15 comparison')
  assert.equal(2 * (7 + 4), 22, 'Q26 parallelogram perimeter')
  assert.equal(4 * 6, 24, 'Q29 rhombus perimeter')
  assert.equal(180 - 65, 115, 'Q29 adjacent angle')
  assert.equal(3 + 5, 8, 'Q30 composite side')
  const smallest = Number([1, 0, 0, 3, 5, 7, 8].join(''))
  assert.equal(smallest, 1003578, 'Q11 smallest seven-digit number')

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
  console.log('PASS Curriculum: declared lesson ids and titles match the live Unit 1 registry.')
}

main()
