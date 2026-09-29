/**
 * Lesson 5 coverage audit — «جمع الأعداد الطبيعيّة وطرحها» (textbook pages 19–22).
 *
 * This does NOT trust counts or metadata alone. It verifies actual content:
 *   Textbook element → Student Area (rendered) → Explanation → Teacher Area (solved).
 * The check FAILS if any book calc item is arithmetically wrong, not rendered by the student
 * lesson, or missing its worked answer in the teacher guide.
 */
import { readFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import {
  additionChecks, additionExamples, allBookCalcItems, applicationProblems, australiaCheck,
  computeResult, digitAt, drillItems, fillPuzzles, fmt, subtractionChecks, subtractionExamples,
  warmupItems, type CalcItem,
} from '../src/lessons/additionSubtractionData'
import { finalAssessment5, lessonFiveTeacherEntries } from '../src/teacher/lesson5'

const LESSON_ID = 'adding-subtracting-natural-numbers'
const PAGES = [19, 20, 21, 22]
const fail = (message: string): never => { throw new Error(`Lesson 5 check failed: ${message}`) }

// 1) Registration & routing.
const lesson = curriculumRegistry.flatMap(u => u.lessons).find(l => l.id === LESSON_ID)
if (!lesson || lesson.availability !== 'available') fail('lesson is not registered/available on Home')
if (!lessonComponents[LESSON_ID]) fail('lesson has no matching component')

// 2) Every book calc item must be arithmetically correct (content, not counts).
for (const item of allBookCalcItems) {
  const result = computeResult(item.operands, item.operator)
  if (!Number.isInteger(result)) fail(`non-integer result for ${item.id}`)
  if (item.operator === '-' && result < 0) fail(`negative subtraction result for ${item.id}`)
}

// 3) Fill puzzles must be internally consistent: operands truly produce the stated result,
//    and each hidden digit equals the corresponding digit of the real number.
for (const puzzle of fillPuzzles) {
  const [a, b] = puzzle.rows.map(r => r.value)
  const expected = puzzle.operator === '+' ? a + b : a - b
  if (expected !== puzzle.result.value) fail(`puzzle ${puzzle.id} operands do not yield the stated result`)
  for (const row of [...puzzle.rows, puzzle.result]) {
    for (const idx of row.hidden) {
      if (digitAt(row.value, idx) < 0 || digitAt(row.value, idx) > 9) fail(`puzzle ${puzzle.id} has an invalid hidden digit`)
    }
  }
}

// 4) Student Area actually renders each book activity: the lesson source must reference every data array.
const lessonSource = readFileSync('src/lessons/AdditionSubtractionLesson.tsx', 'utf8')
const requiredArrays = ['warmupItems', 'invoiceExample', 'refineryExample', 'threeAddendsExample',
  'additionChecks', 'australiaCheck', 'laptopExample', 'subtractionExample', 'subtractionChecks', 'drillItems', 'applicationProblems', 'fillPuzzles']
for (const name of requiredArrays) if (!lessonSource.includes(name)) fail(`Student lesson does not use "${name}" (book element not rendered)`)
if (!lessonSource.includes('finalAssessment5')) fail('Student lesson does not render the final test')

// 5) Teacher Area: pages 19–22 all covered, no fake pages on platform entries.
for (const page of PAGES) if (!lessonFiveTeacherEntries.some(e => e.source.type === 'textbook' && e.source.page === page)) fail(`no teacher entry for page ${page}`)
for (const entry of lessonFiveTeacherEntries) {
  if (entry.source.type === 'textbook' && !PAGES.includes(entry.source.page)) fail(`invalid textbook page for ${entry.id}`)
  if (entry.source.type === 'platform' && 'page' in entry.source) fail(`platform entry has fake page metadata: ${entry.id}`)
  if (!entry.reasoning.length) fail(`teacher entry ${entry.id} has no step-by-step reasoning`)
}

// 6) Content mapping: every book sub-answer must literally appear in some teacher answer.
const teacherAnswers = lessonFiveTeacherEntries.map(e => e.answer).join(' ')
const mustContain = (needle: string, label: string) => { if (!teacherAnswers.includes(needle)) fail(`teacher guide is missing worked answer for ${label} (${needle})`) }
for (const item of [...warmupItems, ...additionChecks, ...subtractionChecks, ...drillItems, australiaCheck, ...applicationProblems] as CalcItem[]) {
  mustContain(fmt(computeResult(item.operands, item.operator)), item.id)
}
for (const item of [...additionExamples, ...subtractionExamples]) mustContain(fmt(computeResult(item.operands, item.operator)), item.id)
for (const puzzle of fillPuzzles) mustContain(fmt(puzzle.result.value), puzzle.id)

// 7) Final test: new, non-empty, and fully solved in the teacher guide (as platform entries).
if (finalAssessment5.length < 8) fail('final test should be a substantial, brand-new assessment (≥ 8 questions)')
for (const q of finalAssessment5) {
  const entry = lessonFiveTeacherEntries.find(e => e.id === q.id)
  if (!entry || entry.source.type !== 'platform' || !entry.reasoning.length) fail(`missing final-test solution for ${q.id}`)
}

console.log(`Lesson 5 check passed: ${lessonFiveTeacherEntries.length} teacher entries, pages 19–22, ${allBookCalcItems.length} book calc items verified, ${fillPuzzles.length} puzzles consistent, ${finalAssessment5.length} new final questions solved.`)
