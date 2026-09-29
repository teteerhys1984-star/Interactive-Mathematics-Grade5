import { readFileSync } from 'node:fs'
import { lessonOneRequiredSolutionIds, lessonOneTeacherEntries } from '../src/teacher/lesson1'

const mathExpression = readFileSync('src/components/MathExpression.tsx', 'utf8')
const gate = readFileSync('src/teacher/TeacherPasswordGate.tsx', 'utf8')
const bidiText = readFileSync('src/components/BidiText.tsx', 'utf8')
const grid = readFileSync('src/components/lesson/CoordinatesGrid.tsx', 'utf8')
const app = readFileSync('src/App.tsx', 'utf8')
if (!mathExpression.includes("direction: 'ltr'") || !mathExpression.includes("unicodeBidi: 'isolate'")) throw new Error('MathExpression must isolate LTR math')
if (!grid.includes('direction="ltr"') || !grid.includes('unicodeBidi="isolate"')) throw new Error('SVG math labels must be isolated LTR')
if (!gate.includes("'somer173'")) throw new Error('Teacher password gate is not configured')
if (!bidiText.includes('unicodeBidi') || !bidiText.includes('dir="rtl"')) throw new Error('Mixed Arabic/math text boundary is not configured')
if (!app.includes('teacher-access-link') || !app.includes('href="#teacher/coordinates"')) throw new Error('Teacher Area is not linked from Home')
for (const id of lessonOneRequiredSolutionIds) if (!lessonOneTeacherEntries.some(entry => entry.id === id)) throw new Error(`Missing solution: ${id}`)
for (const entry of lessonOneTeacherEntries) {
  if (entry.source.type === 'textbook' && ![3, 4].includes(entry.source.page)) throw new Error(`Invalid textbook page for ${entry.id}`)
  if (entry.source.type === 'platform' && 'page' in entry.source) throw new Error(`Platform activity has fake page metadata: ${entry.id}`)
}
if (!lessonOneTeacherEntries.some(entry => entry.source.type === 'textbook' && entry.source.page === 3)) throw new Error('No page 3 source entry')
if (!lessonOneTeacherEntries.some(entry => entry.source.type === 'textbook' && entry.source.page === 4)) throw new Error('No page 4 source entry')
console.log('Content and RTL/LTR boundary checks passed.')
