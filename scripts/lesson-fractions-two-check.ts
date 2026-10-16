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
  const expectedValue = exactValue(item.expected)
  const printedValue = exactValue(item.printed)
  assert.ok(sameExact(expectedValue, printedValue), `${item.id}: expected ${item.expected} must equal printed ${item.printed}`)
}

// 2. Classification keys match the printed structure (mixed iff a whole part is printed before the fraction).
for (const item of [...data.classifyItems, ...data.checkClassifyItems]) {
  const hasWhole = /^\s*\d+\s+\d+\s*\/\s*\d+\s*$/u.test(item.printed)
  assert.equal(item.expected === 'mixed', hasWhole, `${item.id}: classification ${item.printed}`)
}

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

// 6. Registry: lesson is listed in Unit 2 as available, after the four earlier Unit 2 lessons.
const unitTwo = curriculumRegistry.find((unit) => unit.id === 'unit-2')
assert.ok(unitTwo, 'unit-2 exists')
assert.equal(unitTwo!.status, 'in-progress', 'Unit 2 stays in progress')
assert.deepEqual(unitTwo!.lessons.map((lesson) => lesson.id).slice(-2), ['fractions-one', 'fractions-two'])
assert.equal(unitTwo!.lessons.find((lesson) => lesson.id === 'fractions-two')?.availability, 'available')

console.log(`PASS fractions-two: ${allItems.length} printed items verified, 20-question test (6/7/4/3), teacher coverage complete, registry wired.`)
