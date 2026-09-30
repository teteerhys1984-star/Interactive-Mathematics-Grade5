/** Lesson 6 coverage audit — قياس الزوايا, textbook pages 23–30. */
import { readFileSync } from 'node:fs'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import { finalAssessment6, lessonSixBookElements, lessonSixBookElementIds, lessonSixBookPages } from '../src/lessons/anglesData'
import { lessonSixTeacherEntries } from '../src/teacher/lesson6'

const fail = (message: string): never => { throw new Error(`Lesson 6 check failed: ${message}`) }
const lessons = curriculumRegistry.flatMap(unit => unit.lessons)
const lesson = lessons.find(candidate => candidate.id === 'angle-measurement')
if (!lesson || lesson.availability !== 'available') fail('lesson is not registered as available')
if (!lessonComponents['angle-measurement']) fail('lesson has no routed component')

for (const page of lessonSixBookPages) {
  if (!lessonSixBookElements.some(element => element.page === page)) fail(`page ${page} has no coverage entry`)
  if (!lessonSixTeacherEntries.some(entry => entry.source.type === 'textbook' && entry.source.page === page)) fail(`page ${page} has no Teacher Area entry`)
}
if (lessonSixBookPages.length !== 8) fail('source page ledger must contain exactly the eight supplied pages')
if (new Set(lessonSixBookElementIds).size !== lessonSixBookElementIds.length) fail('duplicate textbook element id')

const studentSource = readFileSync('src/lessons/AnglesLesson.tsx', 'utf8')
if (!studentSource.includes('BookCoverageMarkers') || !studentSource.includes('data-source-id')) fail('Student Area has no source coverage markers')
for (const element of lessonSixBookElements) {
  if (!studentSource.includes(element.id)) fail(`Student Area does not reference textbook element ${element.id}`)
  const teacher = lessonSixTeacherEntries.find(entry => entry.id === element.id)
  if (!teacher) fail(`missing Teacher Area solution for ${element.id}`)
  if (teacher?.source.type !== 'textbook' || teacher.source.page !== element.page) fail(`wrong textbook page metadata for ${element.id}`)
  if (!teacher?.prompt || !teacher.answer || teacher.reasoning.length < 2) fail(`incomplete detailed solution for ${element.id}`)
}

for (const entry of lessonSixTeacherEntries) {
  if (!entry.reasoning.length) fail(`empty reasoning for ${entry.id}`)
  if (entry.source.type === 'platform' && 'page' in entry.source) fail(`platform entry has a fake page: ${entry.id}`)
  if (entry.source.type === 'textbook' && !lessonSixBookPages.includes(entry.source.page as (typeof lessonSixBookPages)[number])) fail(`invalid page on ${entry.id}`)
}

if (finalAssessment6.length < 8) fail('Final Test must contain at least eight new questions')
for (const question of finalAssessment6) {
  const entry = lessonSixTeacherEntries.find(candidate => candidate.id === question.id)
  if (!entry || entry.source.type !== 'platform') fail(`missing platform solution for final question ${question.id}`)
  if (!entry.reasoning.length) fail(`final question ${question.id} has no detailed reasoning`)
}

const svgSource = studentSource + readFileSync('src/lesson-six.css', 'utf8')
if (!svgSource.includes('direction: \'ltr\'') && !svgSource.includes('direction="ltr"')) fail('SVG/math LTR boundary missing')
if (!svgSource.includes('unicodeBidi') && !svgSource.includes('unicode-bidi')) fail('SVG/math isolation boundary missing')
if (!studentSource.includes('ZoomableProtractor') || !studentSource.includes('InteractiveProtractor')) fail('required protractor zoom/interaction missing')

const sections = new Set(lessonSixBookElements.map(element => element.section))
console.log(`Lesson 6 check passed: ${lessonSixTeacherEntries.length} Teacher entries, pages ${lessonSixBookPages.join('–')}, ${lessonSixBookElements.length} textbook elements, ${sections.size} source sections, ${finalAssessment6.length} new final questions, protractor zoom + interactive SVG present.`)
