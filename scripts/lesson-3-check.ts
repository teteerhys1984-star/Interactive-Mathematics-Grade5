import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import { lessonThreeTeacherEntries, finalAssessment3 } from '../src/teacher/lesson3'
const lesson = curriculumRegistry.flatMap(u=>u.lessons).find(l=>l.id==='natural-numbers')
if (!lesson || lesson.availability !== 'available' || !lessonComponents['natural-numbers']) throw new Error('Lesson 3 is not registered')
const textbookPages = new Set(lessonThreeTeacherEntries.filter(e=>e.source.type==='textbook').map(e=>(e.source as {page:number}).page))
for (const page of [10,11,12,13,14]) if (!textbookPages.has(page)) throw new Error(`Lesson 3 missing textbook page ${page}`)
for (const q of finalAssessment3) { const e=lessonThreeTeacherEntries.find(x=>x.id===q.id); if(!e || e.source.type!=='platform') throw new Error(`Missing platform solution for ${q.id}`) }
for (const e of lessonThreeTeacherEntries) if (!e.id || !e.answer || !e.reasoning.length) throw new Error(`Incomplete teacher entry ${e.id}`)
console.log(`Lesson 3 check passed: ${lessonThreeTeacherEntries.length} teacher entries, pages 10–14, ${finalAssessment3.length} final questions.`)
