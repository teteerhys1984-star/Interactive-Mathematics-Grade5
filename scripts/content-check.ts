import { readFileSync } from 'node:fs'
import { lessonOneRequiredSolutionIds, lessonOneTeacherEntries } from '../src/teacher/lesson1'
import { lessonTwoRequiredSolutionIds, lessonTwoTeacherEntries, finalAssessment2 } from '../src/teacher/lesson2'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'

const mathExpression = readFileSync('src/components/MathExpression.tsx', 'utf8')
const gate = readFileSync('src/teacher/TeacherPasswordGate.tsx', 'utf8')
const bidiText = readFileSync('src/components/BidiText.tsx', 'utf8')
const grid = readFileSync('src/components/lesson/CoordinatesGrid.tsx', 'utf8')
const lineChart = readFileSync('src/components/lesson/LineChart.tsx', 'utf8')
const app = readFileSync('src/App.tsx', 'utf8')
if (!mathExpression.includes("direction: 'ltr'") || !mathExpression.includes("unicodeBidi: 'isolate'")) throw new Error('MathExpression must isolate LTR math')
if (!grid.includes('direction="ltr"') || !grid.includes('unicodeBidi="isolate"')) throw new Error('Coordinate grid SVG labels must be isolated LTR')
if (!lineChart.includes('direction="ltr"') || !lineChart.includes("unicodeBidi: 'isolate'")) throw new Error('Line chart SVG must be isolated LTR')
if (!gate.includes("'somer173'")) throw new Error('Teacher password gate is not configured')
if (!bidiText.includes('unicodeBidi') || !bidiText.includes('dir="rtl"')) throw new Error('Mixed Arabic/math text boundary is not configured')
if (!app.includes('teacher-access-link') || !app.includes('href="#teacher"')) throw new Error('Teacher Area is not linked from Home')

// Every lesson referenced by the content registry must resolve to a real component (routing stays registry-driven).
const registryLessons = curriculumRegistry.flatMap(unit => unit.lessons)
for (const lesson of registryLessons) if (lesson.availability === 'available' && !lessonComponents[lesson.id]) throw new Error(`Registry lesson "${lesson.id}" has no matching lesson component`)
if (!registryLessons.some(lesson => lesson.id === 'line-graphs' && lesson.availability === 'available')) throw new Error('Lesson 2 (line-graphs) must be registered and available on the Home page')

// Lesson 1 — shipped with textbook pages 3–4.
for (const id of lessonOneRequiredSolutionIds) if (!lessonOneTeacherEntries.some(entry => entry.id === id)) throw new Error(`Missing solution: ${id}`)
for (const entry of lessonOneTeacherEntries) {
  if (entry.source.type === 'textbook' && ![3, 4].includes(entry.source.page)) throw new Error(`Invalid textbook page for ${entry.id}`)
  if (entry.source.type === 'platform' && 'page' in entry.source) throw new Error(`Platform activity has fake page metadata: ${entry.id}`)
}
if (!lessonOneTeacherEntries.some(entry => entry.source.type === 'textbook' && entry.source.page === 3)) throw new Error('No page 3 source entry')
if (!lessonOneTeacherEntries.some(entry => entry.source.type === 'textbook' && entry.source.page === 4)) throw new Error('No page 4 source entry')

// Lesson 2 — shipped with textbook pages 7–9.
for (const id of lessonTwoRequiredSolutionIds) if (!lessonTwoTeacherEntries.some(entry => entry.id === id)) throw new Error(`Missing Lesson 2 solution: ${id}`)
for (const entry of lessonTwoTeacherEntries) {
  if (entry.source.type === 'textbook' && ![7, 8, 9].includes(entry.source.page)) throw new Error(`Invalid textbook page for ${entry.id}`)
  if (entry.source.type === 'platform' && 'page' in entry.source) throw new Error(`Platform activity has fake page metadata: ${entry.id}`)
}
for (const page of [7, 8, 9]) if (!lessonTwoTeacherEntries.some(entry => entry.source.type === 'textbook' && entry.source.page === page)) throw new Error(`No page ${page} source entry in Lesson 2`)
for (const question of finalAssessment2) if (!lessonTwoTeacherEntries.some(entry => entry.id === question.id)) throw new Error(`Missing Lesson 2 final-test solution for ${question.id}`)

console.log('Content and RTL/LTR boundary checks passed (Lesson 1 + Lesson 2).')
