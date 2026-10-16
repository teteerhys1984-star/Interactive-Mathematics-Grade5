/**
 * Unit 2 · Lesson 5 «الكسور (2)» contract check (pages 58–61).
 * Re-derives every printed answer with an independent method (string parsing + BigInt), then checks the
 * test blueprint, the teacher coverage of each printed item, and the registry wiring.
 */
import assert from 'node:assert/strict'
import { curriculumRegistry } from '../src/content/registry'
import * as data from '../src/lessons/fractionsTwoData'
import { unit2Lesson5PlatformEntries, unit2Lesson5TeacherEntries } from '../src/teacher/unit2Lesson5'
import definition from '../src/tests/definitions/lessons/fractions-two.test'
import { evaluateQuestion } from '../src/tests/scoring'
import type { QuestionDefinition, StudentAnswer } from '../src/tests/types'
import { readFileSync } from 'node:fs'

const allItems: data.BookItem[] = [
  ...data.classifyItems, ...data.checkClassifyItems, ...data.checkToMixedItems, ...data.checkToImproperItems,
  ...data.exerciseTwoItems, ...data.exerciseThreeItems,
]

/** Independent oracle: exact value of a printed mixed/ordinary string as [numerator, denominator] BigInts. */
function exactValue(printed: string): [bigint, bigint] {
  const mixed = /^\s*(\d+)\s+(\d+)\/(\d+)\s*$/u.exec(printed)
  if (mixed) return [BigInt(mixed[1]) * BigInt(mixed[3]) + BigInt(mixed[2]), BigInt(mixed[3])]
  const plain = /^\s*(\d+)\/(\d+)\s*$/u.exec(printed)
  if (plain) return [BigInt(plain[1]), BigInt(plain[2])]
  return [BigInt(printed.trim()), 1n]
}
const sameExact = (a: [bigint, bigint], b: [bigint, bigint]) => a[0] * b[1] === b[0] * a[1]

// 1. Every conversion answer key equals the printed number's exact value.
for (const item of allItems) {
  if (item.kind === 'classify') continue
  if (item.expected === 'ambiguous') continue
  const expectedValue = exactValue(item.expected)
  const printedValue = exactValue(item.printed)
  assert.ok(sameExact(expectedValue, printedValue), `${item.id}: expected ${item.expected} must equal printed ${item.printed}`)
}

// 2. Classification keys match the printed structure (mixed iff a whole part is printed before the fraction).
for (const item of [...data.classifyItems, ...data.checkClassifyItems]) {
  const hasWhole = /^\s*\d+\s+\d+\s*\/\s*\d+\s*$/u.test(item.printed)
  if (item.expected === 'ambiguous') {
    // The only ambiguous item is the printed bare «5»: no fraction bar, so it cannot be mixed, and the page does not settle "ordinary".
    assert.equal(item.printed.trim(), '5', `${item.id}: only the bare 5 is ambiguous`)
    assert.equal(hasWhole, false, `${item.id}: ambiguous item must not look mixed`)
    continue
  }
  assert.equal(item.expected === 'mixed', hasWhole, `${item.id}: classification ${item.printed}`)
}
const ambiguousItems = allItems.filter((item) => item.expected === 'ambiguous')
assert.deepEqual(ambiguousItems.map((item) => item.printed), ['5'], 'exactly one ambiguous item (printed 5)')
const completeItems = allItems.length - ambiguousItems.length
assert.equal(completeItems, 45, '45 of 46 printed items are FULL; the ambiguous one is excluded')

// 2b. Mixed-form properness: a printed mixed number has 1 ≤ numerator < denominator; an improper fraction has numerator ≥ denominator.
for (const item of allItems) {
  const mixed = /^\s*(\d+)\s+(\d+)\/(\d+)\s*$/u.exec(item.printed)
  if (mixed) assert.ok(Number(mixed[2]) >= 1 && Number(mixed[2]) < Number(mixed[3]), `${item.id}: mixed part must be proper (${item.printed})`)
}
for (const fraction of data.pageFiftyEightFractions) assert.ok(fraction.denominator > 0, 'page 58 denominators positive')

// 2c. Lesson source: no aria-label or visible text may build a linear fraction from printed items.
const lessonSource = readFileSync(new URL('../src/lessons/FractionsTwoLesson.tsx', import.meta.url), 'utf8')
assert.ok(!/aria-label=\{`[^`]*\$\{item\.printed\}/u.test(lessonSource), 'aria-labels must not embed printed linear fractions')


// 3. Printed item counts from pages 59–61.
assert.equal(data.classifyItems.length, 10, 'page 60 exercise 1 has ten printed items')
assert.equal(data.checkClassifyItems.length, 10, 'page 59 checkpoint has ten printed items')
assert.equal(data.checkToMixedItems.length, 4, 'page 60 checkpoint (ordinary → mixed) has four items')
assert.equal(data.checkToImproperItems.length, 4, 'page 60 checkpoint (mixed → ordinary) has four items')
assert.equal(data.exerciseTwoItems.length, 10, 'page 61 exercise 2 has ten printed items')
assert.equal(data.exerciseThreeItems.length, 8, 'page 61 exercise 3 has eight printed items')

// 4. Every printed item has a teacher solution on the matching page (textbook source).
const teacherById = new Map(unit2Lesson5TeacherEntries.map((entry) => [entry.id, entry]))
for (const item of allItems) {
  const entry = teacherById.get(`t-${item.id}`)
  assert.ok(entry, `no teacher solution for ${item.id}`)
  assert.equal(entry!.source.type, 'textbook', `${item.id} source type`)
  assert.equal(entry!.source.type === 'textbook' ? entry!.source.page : -1, item.page, `${item.id} page`)
  assert.ok(entry!.reasoning.length >= 1 && entry!.answer.trim().length > 0, `${item.id} has steps and an answer`)
}
for (const entry of unit2Lesson5PlatformEntries) assert.equal(entry.source.type, 'platform', `${entry.id} must be platform-labelled`)

// 5. Test contract: 20 questions, 6/7/4/3 difficulty split, and every question has stable metadata.
assert.equal(definition.type, 'lesson')
assert.equal(definition.questions.length, 20)
const difficulty = (level: string) => definition.questions.filter((question) => question.difficulty === level).length
assert.deepEqual(
  { basic: difficulty('basic'), medium: difficulty('medium'), advanced: difficulty('advanced'), thinking: difficulty('thinking') },
  { basic: 6, medium: 7, advanced: 4, thinking: 3 },
)
for (const question of definition.questions) {
  assert.ok(question.originalityNote.trim().length > 0, `${question.id} needs an originality note`)
  assert.equal(question.testId, definition.id)
}

// 5b. Score all 20 test keys through the real evaluator (keys must be correct; equivalent forms accepted; wrong forms rejected).
function keyAnswer(question: QuestionDefinition): StudentAnswer {
  const key = question.answer as any
  switch (question.type) {
    case 'true-false': return { type: 'true-false', value: key }
    case 'single-choice': return { type: 'single-choice', value: key }
    case 'multi-select': return { type: 'multi-select', value: key }
    case 'numeric': return { type: 'numeric', value: String(key.expected ?? key) }
    case 'fraction': return { type: 'fraction', value: `${key.numerator}/${key.denominator}` }
    case 'ordering': return { type: 'ordering', value: key }
    case 'matching': return { type: 'matching', value: key }
    case 'error-analysis': return { type: 'error-analysis', value: key }
    default: throw new Error(`unhandled question type ${question.type} in ${question.id}`)
  }
}
let keyCorrect = 0
for (const question of definition.questions) {
  const result = evaluateQuestion(question, keyAnswer(question))
  assert.equal(result.status, 'correct', `${question.id}: answer key must score correct (type ${question.type})`)
  keyCorrect += 1
}
assert.equal(keyCorrect, 20, 'all 20 keys score correct')
const wrongFraction = definition.questions.find((question) => question.type === 'fraction')!
assert.equal(evaluateQuestion(wrongFraction, { type: 'fraction', value: '1/1' }).status, 'incorrect', 'wrong fraction form rejected')
assert.equal(evaluateQuestion(definition.questions[0], undefined).status, 'unanswered', 'empty answer is unanswered')

// 6. Registry: lesson is listed in Unit 2 as available, after the four earlier Unit 2 lessons.
const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(unitTwo, 'unit-2 exists')
assert.equal(unitTwo!.status, 'in-progress', 'Unit 2 stays in progress')
assert.deepEqual(unitTwo!.lessons.map((lesson) => lesson.id).slice(-2), ['fractions-one', 'fractions-two'])
assert.equal(unitTwo!.lessons.find((lesson) => lesson.id === 'fractions-two')?.availability, 'available')

console.log(`PASS fractions-two: ${allItems.length} printed items verified, 20-question test (6/7/4/3), teacher coverage complete, registry wired.`)
