import { readFileSync } from 'node:fs'
import { lessonOneRequiredSolutionIds, lessonOneTeacherEntries } from '../src/teacher/lesson1'

const mathExpression = readFileSync('src/components/MathExpression.tsx', 'utf8')
const gate = readFileSync('src/teacher/TeacherPasswordGate.tsx', 'utf8')
const grid = readFileSync('src/components/lesson/CoordinatesGrid.tsx', 'utf8')
if (!mathExpression.includes("direction: 'ltr'") || !mathExpression.includes("unicodeBidi: 'isolate'")) throw new Error('MathExpression must isolate LTR math')
if (!grid.includes('direction="ltr"') || !grid.includes('unicodeBidi="isolate"')) throw new Error('SVG math labels must be isolated LTR')
if (!gate.includes("'somer173'")) throw new Error('Teacher password gate is not configured')
for (const id of lessonOneRequiredSolutionIds) if (!lessonOneTeacherEntries.some(entry => entry.id === id)) throw new Error(`Missing solution: ${id}`)
console.log('Content and RTL/LTR boundary checks passed.')
