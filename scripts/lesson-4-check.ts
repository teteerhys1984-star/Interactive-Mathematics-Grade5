import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import { lessonFourTeacherEntries, finalAssessment4 } from '../src/teacher/lesson4'
const lesson=curriculumRegistry.flatMap(u=>u.lessons).find(l=>l.id==='rounding-natural-numbers')
if(!lesson||!lessonComponents['rounding-natural-numbers']) throw new Error('Lesson 4 is not registered')
for(const page of [15,16,17,18]) if(!lessonFourTeacherEntries.some(e=>e.source.type==='textbook'&&e.source.page===page)) throw new Error(`Missing page ${page}`)
for(const q of finalAssessment4){const e=lessonFourTeacherEntries.find(x=>x.id===q.id);if(!e||e.source.type!=='platform'||!e.reasoning.length)throw new Error(`Missing final solution ${q.id}`)}
if(lessonFourTeacherEntries.some(e=>e.source.type==='platform'&&'page' in e.source))throw new Error('Platform entry has page')
console.log(`Lesson 4 check passed: ${lessonFourTeacherEntries.length} entries, pages 15–18, ${finalAssessment4.length} final questions.`)
