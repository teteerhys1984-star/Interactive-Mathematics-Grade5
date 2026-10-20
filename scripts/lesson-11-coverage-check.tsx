/**
 * Unit 2 Lesson 3 source-coverage audit, textbook pp. 52–53 (المضاعف المشترك الأصغر).
 * Mounts the Student Area and walks every sequential step, confirms each printed element
 * and reconstructed visual appears, verifies the Teacher Area holds a detailed solution
 * per ledger row, and audits the independent 20-question test.
 */
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'

import {
  leastCommonMultipleBookElements,
  leastCommonMultipleBookTasks,
  leastCommonMultipleLessonId,
  leastCommonMultipleQuestionGroups,
  leastCommonMultipleSourcePages,
  leastCommonMultipleTeachingElements,
  leastCommonMultipleTestId,
  leastCommonMultipleVisualInventory,
  type LeastCommonMultipleBookElement,
} from '../src/lessons/leastCommonMultipleData'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import {
  lessonElevenBookTeacherEntries,
  lessonElevenId,
  lessonElevenPlatformTeacherEntries,
  lessonElevenTeacherEntries,
} from '../src/teacher/lesson11'
import { getSolutionGroups } from '../src/tests/solutionGroups'
import definition from '../src/tests/definitions/lessons/least-common-multiple.test'
import { DIFFICULTIES } from '../src/tests/types'

const requiredIdsByPage: Readonly<Record<number, readonly string[]>> = {
  52: [
    'l11-p52-goals',
    'l11-p52-launch-a', 'l11-p52-launch-b',
    'l11-p52-laser-setup', 'l11-p52-laser-a', 'l11-p52-laser-b',
    'l11-p52-definition',
    'l11-p52-example-3-5',
  ],
  53: [
    'l11-p53-example-4-6-8',
    'l11-p53-rule-pinned',
    'l11-p53-farmer',
    'l11-p53-verbal',
    'l11-p53-check',
    'l11-p53-drill-a', 'l11-p53-drill-b', 'l11-p53-drill-c',
    'l11-p53-drill-d', 'l11-p53-drill-e', 'l11-p53-drill-f',
    'l11-p53-drill-g', 'l11-p53-drill-h', 'l11-p53-drill-i',
  ],
}
const expectedVisualIds = [
  'p52-multiples-strip-2',
  'p52-multiples-strip-3',
  'p52-multiples-strips-3-4',
  'p52-multiples-strips-3-5',
  'p53-multiples-strips-4-6-8',
  'p53-multiples-strips-4-5',
  'p53-multiples-strips-8-5-4',
] as const
const REQUIRED_TEACHER_PARTS = ['المعطيات:', 'المطلوب:', 'القاعدة المستعملة:', 'لماذا تنطبق هنا:', 'الإجابة النهائية:', 'التحقّق:']

function fail(message: string): never {
  throw new Error(`Lesson 11 source coverage failed: ${message}`)
}
function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/gu, d => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/gu, d => String(d.charCodeAt(0) - 0x06f0))
}
function compact(value: string): string {
  return normalizeDigits(value)
    .normalize('NFKD')
    .replace(/[\u064b-\u065f\u0670\u0640\u200e\u200f\u2066-\u2069]/gu, '')
    .toLocaleLowerCase('ar')
    .replace(/[^\p{L}\p{N}]/gu, '')
}
function isInteractive(e: LeastCommonMultipleBookElement): boolean { return Boolean(e.response) }

async function main() {
  const ledgerIds = leastCommonMultipleBookElements.map(e => e.id)
  const independent = Object.values(requiredIdsByPage).flat()
  assert.equal(new Set(ledgerIds).size, ledgerIds.length, 'ledger IDs must be unique')
  assert.equal(new Set(independent).size, independent.length, 'independent IDs must be unique')
  assert.deepEqual([...ledgerIds].sort(), [...independent].sort(), 'ledger vs hand-transcribed page inventory must match exactly')
  assert.deepEqual([...leastCommonMultipleSourcePages], [52, 53])
  assert.equal(leastCommonMultipleTeachingElements.length, 4)
  // Interactive printed items (tasks + worked examples): 2 launch + 2 laser + 3 examples (3-5,4-6-8,farmer) + 1 verbal + 1 check + 9 drills = 18
  // Total ledger: 4 teaching + 18 interactive = 22 (matching requiredIdsByPage: 8 + 14 = 22)
  assert.equal(leastCommonMultipleBookTasks.length, 18)
  assert.equal(leastCommonMultipleBookElements.length, 22)
  assert.equal(leastCommonMultipleQuestionGroups.length, 8)
  assert.deepEqual(leastCommonMultipleVisualInventory.map(v => v.id), [...expectedVisualIds])
  for (const page of leastCommonMultipleSourcePages) {
    const els = leastCommonMultipleBookElements.filter(e => e.page === page)
    assert.equal(els.length, requiredIdsByPage[page].length, `page ${page} source-row count`)
    assert.ok(els.every(e => e.prompt.trim() && e.given.trim() && e.required.trim() && e.rule.trim() && e.why.trim() && e.answer.trim() && e.verification.trim() && e.pitfall.trim()), `page ${page} ledger completeness`)
  }
  assert.ok(leastCommonMultipleBookTasks.every(t => t.groupId && t.response), 'each task belongs to a group')
  assert.ok(leastCommonMultipleBookTasks.every(t => leastCommonMultipleQuestionGroups.some(g => g.id === t.groupId)))
  assert.ok(lessonComponents[leastCommonMultipleLessonId], 'lesson route registered')

  // Unit 2 still in progress
  const unitTwo = curriculumRegistry.find(u => u.id === 'unit-2')!
  assert.equal(unitTwo.status, 'in-progress')
  assert.equal(unitTwo.lessons.length, 9)
  assert.equal(unitTwo.lessons[7]?.id, 'decimal-parts-three', 'Unit 2 Lesson 8 is appended without moving existing lessons')
  assert.ok(unitTwo.lessons.find(l => l.id === leastCommonMultipleLessonId && l.availability === 'available'))
  const unitOne = curriculumRegistry.find(u => u.id === 'unit-1')!
  assert.equal(unitOne.lessons.length, 8, 'Unit 1 must stay at 8 lessons')

  // Teacher area
  const teacherById = new Map(lessonElevenBookTeacherEntries.map(e => [e.id, e]))
  assert.equal(teacherById.size, leastCommonMultipleBookElements.length, 'one teacher solution per ledger row')
  for (const el of leastCommonMultipleBookElements) {
    const t = teacherById.get(el.id)
    if (!t) fail(`no teacher solution for ${el.id}`)
    assert.equal(t.source.type, 'textbook')
    assert.equal((t.source as {type:'textbook';page:number}).page, el.page, `teacher page for ${el.id}`)
    assert.ok(t.prompt.trim() && t.answer.trim(), `teacher prompt/answer for ${el.id}`)
    assert.ok(t.reasoning.length >= 10, `teacher reasoning frame for ${el.id}`)
    for (const part of REQUIRED_TEACHER_PARTS) assert.ok(t.reasoning.some(l => l.startsWith(part)), `${el.id} lacks ${part}`)
    assert.ok(t.reasoning.some(l => l.startsWith('خطأ شائع يجب تجنّبه:')), `${el.id} lacks common error`)
    assert.ok(t.note?.includes(`القسم: ${el.section}`), `${el.id} note keeps section`)
  }
  assert.equal(lessonElevenTeacherEntries.length, leastCommonMultipleBookElements.length + lessonElevenPlatformTeacherEntries.length)
  assert.equal(lessonElevenPlatformTeacherEntries.length, 3)
  assert.ok(lessonElevenPlatformTeacherEntries.every(e => e.source.type === 'platform'))

  // Independent test
  assert.equal(definition.id, leastCommonMultipleTestId)
  assert.equal(definition.type, 'lesson')
  assert.equal((definition.type === 'lesson' ? definition.lessonId : ''), leastCommonMultipleLessonId)
  assert.equal(definition.questions.length, 20, 'must be exactly 20 questions')
  assert.deepEqual(definition.blueprint.difficultyDistribution, { basic: 6, medium: 7, advanced: 4, thinking: 3 })
  const actualDifficulty = Object.fromEntries(DIFFICULTIES.map(lv => [lv, definition.questions.filter(q => q.difficulty === lv).length]))
  assert.deepEqual(actualDifficulty, definition.blueprint.difficultyDistribution)
  assert.equal(getSolutionGroups(definition).length, 4, 'four groups of five')
  assert.ok(definition.questions.every(q => q.solution.steps.length >= 2 && q.originalityNote.trim().length >= 30), 'each question needs real solution and originality note')
  assert.ok(definition.questions.every(q => q.coverage.lessonIds.includes(leastCommonMultipleLessonId)))
  assert.ok(!curriculumRegistry.some(u => u.id === 'unit-2' && u.status === 'complete'))

  // Mount the lesson in jsdom and walk every step.
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#lesson/least-common-multiple',
    pretendToBeVisual: true,
  })
  const { window } = dom
  Object.assign(globalThis, {
    window, document: window.document, sessionStorage: window.sessionStorage, localStorage: window.localStorage,
    HTMLElement: window.HTMLElement, SVGElement: window.SVGElement, Node: window.Node,
    getComputedStyle: window.getComputedStyle,
    requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0),
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  const React = await import('react')
  const { render, screen, fireEvent } = await import('@testing-library/react')
  const { LeastCommonMultipleLesson } = await import('../src/lessons/LeastCommonMultipleLesson')
  const view = render(React.createElement(LeastCommonMultipleLesson))
  const studentRecords = new Map<string, { rendered: boolean; promptRendered: boolean; text: string }>()
  const renderedVisualIds = new Set<string>()
  const renderedGroupIds = new Set<string>()
  const renderedStepIds: string[] = []
  const stepCount = 10

  for (let i = 0; i < stepCount; i += 1) {
    const panel = view.container.querySelector('.lesson-step-panel')
    assert.ok(panel, `lesson panel ${i + 1} exists`)
    const stepId = panel!.getAttribute('data-step-id')
    assert.ok(stepId)
    renderedStepIds.push(stepId!)

    for (const v of view.container.querySelectorAll<HTMLElement>('[data-source-visual]')) {
      if (v.dataset.sourceVisual) renderedVisualIds.add(v.dataset.sourceVisual)
    }
    for (const g of view.container.querySelectorAll<HTMLElement>('[data-source-group]')) {
      if (g.dataset.sourceGroup) renderedGroupIds.add(g.dataset.sourceGroup)
    }
    for (const el of leastCommonMultipleBookElements) {
      const nodes = Array.from(view.container.querySelectorAll<HTMLElement>('[data-source-id]')).filter(n => n.dataset.sourceId === el.id)
      if (!nodes.length) continue
      const needle = compact(isInteractive(el) ? (el.sourceText ?? el.title) : el.prompt)
      const matchingNode = nodes.find(n => compact(n.textContent ?? '').includes(needle))
      const taskGroup = el.groupId ? view.container.querySelector<HTMLElement>(`[data-source-group="${el.groupId}"]`) : null
      const promptRendered = isInteractive(el)
        ? Boolean(taskGroup && compact(taskGroup.textContent ?? '').includes(needle))
        : Boolean(matchingNode && compact(matchingNode.textContent ?? '').includes(compact(el.prompt)))
      studentRecords.set(el.id, {
        rendered: Boolean(matchingNode),
        promptRendered,
        text: matchingNode?.textContent?.trim().slice(0, 500) ?? '',
      })
    }
    if (i < stepCount - 1) fireEvent.click(screen.getByRole('button', { name: /التالي/ }))
  }

  assert.equal(new Set(renderedStepIds).size, stepCount, 'all steps reachable')
  assert.equal(renderedGroupIds.size, leastCommonMultipleQuestionGroups.length, 'all groups rendered')
  assert.deepEqual([...renderedGroupIds].sort(), leastCommonMultipleQuestionGroups.map(g => g.id).sort())
  const expectedRenderedVisuals = [...expectedVisualIds, 'l11-explorer-strips'] // explorer lab also renders a strip visual
  for (const vid of expectedVisualIds) assert.ok(renderedVisualIds.has(vid), `visual ${vid} must render`)

  const reportItems = leastCommonMultipleBookElements.map(el => {
    const s = studentRecords.get(el.id)
    const t = teacherById.get(el.id)
    const studentFull = Boolean(s?.rendered && s.promptRendered)
    const teacherFull = Boolean(t && t.source.type === 'textbook' && (t.source as {type:'textbook';page:number}).page === el.page && t.reasoning.length >= 10)
    const status = studentFull && teacherFull ? 'FULL' : studentFull || teacherFull ? 'PARTIAL' : 'MISSING'
    return {
      id: el.id, page: el.page, section: el.section, kind: el.kind, title: el.title,
      studentArea: { status: studentFull ? 'FULL' : 'MISSING' },
      teacherArea: { status: teacherFull ? 'FULL' : 'MISSING' },
      status,
    }
  })
  const summary = {
    total: reportItems.length,
    FULL: reportItems.filter(i => i.status === 'FULL').length,
    PARTIAL: reportItems.filter(i => i.status === 'PARTIAL').length,
    MISSING: reportItems.filter(i => i.status === 'MISSING').length,
    percent: 0,
  }
  summary.percent = Math.round((summary.FULL / summary.total) * 100)
  const report = {
    title: 'المضاعف المشترك الأصغر', lessonId: leastCommonMultipleLessonId,
    sourcePages: [...leastCommonMultipleSourcePages],
    audit: 'Student Area: real component mounted across 10 steps; Teacher Area: structured solutions with page metadata.',
    target: { FULL: '100%', PARTIAL: 0, MISSING: 0 },
    summary,
    totals: {
      teachingElements: leastCommonMultipleTeachingElements.length,
      printedQuestionBranches: leastCommonMultipleBookTasks.length,
      questionGroups: leastCommonMultipleQuestionGroups.length,
      rebuiltVisuals: expectedVisualIds.length,
    },
    independentTest: {
      id: definition.id, questionCount: definition.questions.length,
      difficultyDistribution: actualDifficulty,
      solutionGroups: getSolutionGroups(definition).map(g => ({ group: g.groupNumber, firstQuestion: g.firstQuestionNumber, lastQuestion: g.lastQuestionNumber })),
      unitTwoStatus: unitTwo.status, unitTwoTestCreated: false,
    },
    items: reportItems,
  }
  mkdirSync('docs', { recursive: true })
  writeFileSync('docs/least-common-multiple-coverage.json', `${JSON.stringify(report, null, 2)}\n`)
  assert.deepEqual(summary, { total: leastCommonMultipleBookElements.length, FULL: leastCommonMultipleBookElements.length, PARTIAL: 0, MISSING: 0, percent: 100 })
  view.unmount()
  dom.window.close()
  console.log(`PASS Unit 2 Lesson 3 coverage: ${summary.FULL}/${summary.total} source rows FULL (100%); PARTIAL=0; MISSING=0.`)
  const exampleCount = leastCommonMultipleBookTasks.filter(t => t.kind === 'example').length
  const plainTaskCount = leastCommonMultipleBookTasks.length - exampleCount
  console.log(`PASS Source inventory: ${leastCommonMultipleTeachingElements.length} teaching elements, ${exampleCount} worked examples, ${plainTaskCount} printed task branches across pages 52–53, and all ${expectedVisualIds.length} reconstructed multiples-strip visuals rendered.`)
  console.log('PASS Teacher Area: every textbook entry has full frame (given/goal/rule/why/steps/answer/check/error).')
  console.log('PASS Independent test: exactly 20 questions, 6/7/4/3 difficulty split, four solution groups; Unit 2 remains in progress.')
  console.log('Wrote docs/least-common-multiple-coverage.json')
}
main().catch(error => { console.error(error); process.exitCode = 1 })
