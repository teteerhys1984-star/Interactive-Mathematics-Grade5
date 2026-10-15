/**
 * Unit 2 Lesson 1 source-coverage audit, textbook pp. 44–47.
 *
 * The required IDs below are an independently transcribed inventory (not generated from the
 * ledger). The check mounts and navigates through the real Student Area, validates printed text
 * and reconstructed tables/response cards, validates each detailed Teacher Area solution, then
 * writes the item-by-item coverage report. A missing/partial item makes the command fail.
 */
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import {
  compareNaturalNumbersBookElements,
  compareNaturalNumbersBookTasks,
  compareNaturalNumbersQuestionGroups,
  compareNaturalNumbersSourcePages,
  compareNaturalNumbersTeachingElements,
  compareNaturalNumbersTestId,
  compareNaturalNumbersVisualInventory,
  type CompareNaturalNumbersBookElement,
} from '../src/lessons/compareNaturalNumbersData'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import {
  lessonNineBookTeacherEntries,
  lessonNineId,
  lessonNinePlatformTeacherEntries,
  lessonNineTeacherEntries,
} from '../src/teacher/lesson9'
import { getSolutionGroups } from '../src/tests/solutionGroups'
import definition from '../src/tests/definitions/lessons/compare-order-natural-numbers.test'
import { DIFFICULTIES } from '../src/tests/types'

const requiredIdsByPage: Readonly<Record<number, readonly string[]>> = {
  44: [
    'l9-p44-goals', 'l9-p44-less-than', 'l9-p44-greater-than', 'l9-p44-equality',
    'l9-p44-q1-a', 'l9-p44-q1-b', 'l9-p44-q1-c',
    'l9-p44-q2-a', 'l9-p44-q2-b', 'l9-p44-q2-c',
    'l9-p44-q3-a', 'l9-p44-q3-b', 'l9-p44-q4-main',
  ],
  45: [
    'l9-p45-purpose', 'l9-p45-digit-count-rule', 'l9-p45-digit-count-example',
    'l9-p45-same-length-rule', 'l9-p45-million-comparison-example', 'l9-p45-first-difference-example',
  ],
  46: [
    'l9-p46-first-difference-resolution', 'l9-p46-equality-rule', 'l9-p46-equality-example',
    'l9-p46-ordering-benefit-example', 'l9-p46-check-q1',
  ],
  47: [
    'l9-p47-check-q2', 'l9-p47-check-q3', 'l9-p47-oral-explain',
    'l9-p47-ex1-a', 'l9-p47-ex1-b', 'l9-p47-ex1-c', 'l9-p47-ex1-d',
    'l9-p47-ex2-a', 'l9-p47-ex2-b', 'l9-p47-ex2-c', 'l9-p47-ex2-d', 'l9-p47-ex2-e', 'l9-p47-ex2-f',
    'l9-p47-ex3-a', 'l9-p47-ex3-b', 'l9-p47-ex4-3120019', 'l9-p47-ex4-7546851',
    'l9-p47-ex5-1', 'l9-p47-ex5-2', 'l9-p47-ex5-3',
  ],
}
const expectedVisualIds = [
  'p45-digit-count-table',
  'p45-place-value-1254698-999999',
  'p45-place-value-5600368-2978561',
  'p46-place-value-2358936-2369487',
  'p46-place-value-equality-3897456',
  'p46-compare-response-cards',
  'p47-neighbor-table',
  'p47-province-area-table',
] as const
const REQUIRED_TEACHER_PARTS = ['المعطيات:', 'المطلوب:', 'القاعدة المستعملة:', 'لماذا تنطبق هنا:', 'الإجابة النهائية:', 'التحقّق:']

function fail(message: string): never {
  throw new Error(`Lesson 9 source coverage failed: ${message}`)
}
function normalizeDigits(value: string): string {
  return value
    .replace(/[٠-٩]/gu, digit => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/gu, digit => String(digit.charCodeAt(0) - 0x06f0))
}
function compact(value: string): string {
  return normalizeDigits(value)
    .normalize('NFKD')
    .replace(/[\u064b-\u065f\u0670\u0640\u200e\u200f\u2066-\u2069]/gu, '')
    .toLocaleLowerCase('ar')
    .replace(/[^\p{L}\p{N}]/gu, '')
}
function formatNumber(value: number): string { return value.toLocaleString('en-US') }
function taskVisibleText(element: CompareNaturalNumbersBookElement): string {
  if (element.response?.kind === 'neighbor') return formatNumber(element.response.previous + 1)
  return element.sourceText ?? element.title
}

async function main() {
  const ledgerIds = compareNaturalNumbersBookElements.map(element => element.id)
  const independentlyDeclaredIds = Object.values(requiredIdsByPage).flat()
  assert.equal(new Set(ledgerIds).size, ledgerIds.length, 'ledger IDs must be unique')
  assert.equal(new Set(independentlyDeclaredIds).size, independentlyDeclaredIds.length, 'independent inventory IDs must be unique')
  assert.deepEqual([...ledgerIds].sort(), [...independentlyDeclaredIds].sort(), 'the ledger and the hand-transcribed page inventory must match exactly')
  assert.deepEqual([...compareNaturalNumbersSourcePages], [44, 45, 46, 47])
  assert.equal(compareNaturalNumbersTeachingElements.length, 14)
  assert.equal(compareNaturalNumbersBookTasks.length, 30)
  assert.equal(compareNaturalNumbersBookElements.length, 44)
  assert.equal(compareNaturalNumbersQuestionGroups.length, 13)
  assert.deepEqual(compareNaturalNumbersVisualInventory.map(item => item.id), expectedVisualIds)
  for (const page of compareNaturalNumbersSourcePages) {
    const pageElements = compareNaturalNumbersBookElements.filter(element => element.page === page)
    assert.equal(pageElements.length, requiredIdsByPage[page].length, `page ${page} source-row count`)
    assert.ok(pageElements.every(element => element.prompt.trim() && element.given.trim() && element.required.trim() && element.rule.trim() && element.why.trim() && element.answer.trim() && element.verification.trim() && element.pitfall.trim()), `page ${page} ledger completeness`)
  }
  assert.ok(compareNaturalNumbersBookTasks.every(task => task.groupId && task.response), 'each printed question branch must belong to a group and have an interaction/response record')
  assert.ok(compareNaturalNumbersBookTasks.every(task => compareNaturalNumbersQuestionGroups.some(group => group.id === task.groupId)), 'every branch group must be declared')
  assert.ok(lessonComponents[lessonNineId], 'the lesson route is registered')

  const unitOne = curriculumRegistry.find(unit => unit.id === 'unit-1')
  const unitTwo = curriculumRegistry.find(unit => unit.id === 'unit-2')
  assert.ok(unitOne)
  assert.equal(unitOne!.lessons.length, 8, 'Unit 1 remains at its original eight-lesson boundary')
  assert.equal(unitTwo?.status, 'in-progress')
  assert.deepEqual(unitTwo?.lessons.map(lesson => lesson.id), [lessonNineId, 'multiply-natural-numbers', 'least-common-multiple'])
  assert.ok(unitTwo?.lessons.every(lesson => lesson.availability === 'available'))

  const teacherById = new Map(lessonNineBookTeacherEntries.map(entry => [entry.id, entry]))
  assert.equal(teacherById.size, 44, 'one detailed Teacher Area solution per textbook ledger row')
  for (const element of compareNaturalNumbersBookElements) {
    const teacher = teacherById.get(element.id)
    if (!teacher) fail(`no Teacher Area solution for ${element.id} (p. ${element.page})`)
    assert.equal(teacher!.source.type, 'textbook')
    assert.equal(teacher!.source.type === 'textbook' ? teacher!.source.page : -1, element.page, `Teacher Area page for ${element.id}`)
    assert.ok(teacher!.prompt.trim() && teacher!.answer.trim(), `Teacher prompt/answer for ${element.id}`)
    assert.ok(teacher!.reasoning.length >= 10, `Teacher solution for ${element.id} needs a detailed frame and steps`)
    for (const part of REQUIRED_TEACHER_PARTS) assert.ok(teacher!.reasoning.some(line => line.startsWith(part)), `${element.id} lacks ${part}`)
    assert.ok(teacher!.reasoning.some(line => line.startsWith('خطأ شائع يجب تجنّبه:')), `${element.id} lacks its common-error guidance`)
    assert.ok(teacher!.note?.includes(`القسم: ${element.section}`), `${element.id} note must retain its source section`)
  }
  assert.equal(lessonNineTeacherEntries.length, 46)
  assert.equal(lessonNinePlatformTeacherEntries.length, 2)
  assert.ok(lessonNinePlatformTeacherEntries.every(entry => entry.source.type === 'platform'), 'added activities must be distinguished from textbook material')

  assert.equal(definition.id, compareNaturalNumbersTestId)
  assert.equal(definition.type, 'lesson')
  assert.equal(definition.type === 'lesson' ? definition.lessonId : '', lessonNineId)
  assert.equal(definition.questions.length, 20, 'the independent lesson test must contain exactly 20 questions')
  assert.deepEqual(definition.blueprint.difficultyDistribution, { basic: 6, medium: 7, advanced: 4, thinking: 3 })
  const actualDifficulty = Object.fromEntries(DIFFICULTIES.map(level => [level, definition.questions.filter(question => question.difficulty === level).length]))
  assert.deepEqual(actualDifficulty, definition.blueprint.difficultyDistribution)
  assert.equal(getSolutionGroups(definition).length, 4, '20 test solutions must retain the existing four groups of five')
  assert.ok(definition.questions.every(question => question.solution.steps.length >= 2 && question.originalityNote.trim().length >= 35), 'each independent-test question needs a real solution and a specific originality note')
  assert.ok(definition.questions.every(question => question.coverage.lessonIds.includes(lessonNineId)))
  assert.ok(!curriculumRegistry.some(unit => unit.id === 'unit-2' && unit.status === 'complete'))

  // Mount the actual lesson and visit every sequential step; the audit does not accept a ledger-only claim.
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#lesson/compare-order-natural-numbers',
    pretendToBeVisual: true,
  })
  const { window } = dom
  Object.assign(globalThis, {
    window,
    document: window.document,
    sessionStorage: window.sessionStorage,
    localStorage: window.localStorage,
    HTMLElement: window.HTMLElement,
    SVGElement: window.SVGElement,
    Node: window.Node,
    getComputedStyle: window.getComputedStyle,
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  const React = await import('react')
  const { render, screen, fireEvent } = await import('@testing-library/react')
  const { ComparingNaturalNumbersLesson } = await import('../src/lessons/ComparingNaturalNumbersLesson')
  const view = render(React.createElement(ComparingNaturalNumbersLesson))
  const studentRecords = new Map<string, { rendered: boolean; promptRendered: boolean; branchRendered: boolean; text: string }>()
  const renderedVisualIds = new Set<string>()
  const renderedGroupIds = new Set<string>()
  const renderedStepIds: string[] = []
  const stepCount = 11

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    const panel = view.container.querySelector('.lesson-step-panel')
    assert.ok(panel, `lesson panel ${stepIndex + 1} exists`)
    const stepId = panel!.getAttribute('data-step-id')
    assert.ok(stepId, `lesson panel ${stepIndex + 1} has a stable ID`)
    renderedStepIds.push(stepId!)

    for (const visual of view.container.querySelectorAll<HTMLElement>('[data-source-visual]')) {
      const id = visual.dataset.sourceVisual
      if (id) renderedVisualIds.add(id)
    }
    for (const group of view.container.querySelectorAll<HTMLElement>('[data-source-group]')) {
      if (group.dataset.sourceGroup) renderedGroupIds.add(group.dataset.sourceGroup)
    }
    for (const element of compareNaturalNumbersBookElements) {
      const nodes = Array.from(view.container.querySelectorAll<HTMLElement>('[data-source-id]')).filter(node => node.dataset.sourceId === element.id)
      if (!nodes.length) continue
      const matchingNode = nodes.find(node => {
        const candidateText = compact(node.textContent ?? '')
        const sourceNeedle = compact(element.kind === 'task' ? taskVisibleText(element) : element.prompt)
        return sourceNeedle.length > 0 && candidateText.includes(sourceNeedle)
      })
      const taskGroup = element.groupId
        ? view.container.querySelector<HTMLElement>(`[data-source-group="${element.groupId}"]`)
        : null
      const promptRendered = element.kind === 'task'
        ? Boolean(taskGroup && compact(taskGroup.textContent ?? '').includes(compact(element.prompt)))
        : Boolean(matchingNode && compact(matchingNode.textContent ?? '').includes(compact(element.prompt)))
      studentRecords.set(element.id, {
        rendered: Boolean(matchingNode),
        promptRendered,
        branchRendered: element.kind !== 'task' || Boolean(matchingNode),
        text: matchingNode?.textContent?.trim().slice(0, 500) ?? '',
      })
    }

    if (stepIndex < stepCount - 1) fireEvent.click(screen.getByRole('button', { name: /التالي/ }))
  }

  assert.equal(new Set(renderedStepIds).size, stepCount, 'all lesson steps must be reachable')
  assert.equal(renderedGroupIds.size, compareNaturalNumbersQuestionGroups.length, 'all 13 printed task groups must be rendered')
  assert.deepEqual([...renderedGroupIds].sort(), compareNaturalNumbersQuestionGroups.map(group => group.id).sort())
  assert.deepEqual([...renderedVisualIds].sort(), [...expectedVisualIds].sort(), 'every textbook table/response-card visual must be rebuilt and rendered')

  const reportItems = compareNaturalNumbersBookElements.map(element => {
    const student = studentRecords.get(element.id)
    const teacher = teacherById.get(element.id)
    const studentFull = Boolean(student?.rendered && student.promptRendered && student.branchRendered)
    const teacherFull = Boolean(teacher && teacher.source.type === 'textbook' && teacher.source.page === element.page && teacher.reasoning.length >= 10)
    const status = studentFull && teacherFull ? 'FULL' : studentFull || teacherFull ? 'PARTIAL' : 'MISSING'
    return {
      id: element.id,
      page: element.page,
      section: element.section,
      kind: element.kind,
      title: element.title,
      printedPrompt: element.prompt,
      printedBranch: element.sourceText ?? null,
      groupId: element.groupId ?? null,
      responseKind: element.response?.kind ?? null,
      visualAssetIds: [...element.visualAssetIds],
      studentArea: { status: studentFull ? 'FULL' : 'MISSING', renderedText: student?.text ?? '' },
      teacherArea: { status: teacherFull ? 'FULL' : 'MISSING', page: teacher?.source.type === 'textbook' ? teacher.source.page : null, solutionSteps: teacher?.reasoning.length ?? 0 },
      status,
    }
  })
  const coverageSummary = {
    total: reportItems.length,
    FULL: reportItems.filter(item => item.status === 'FULL').length,
    PARTIAL: reportItems.filter(item => item.status === 'PARTIAL').length,
    MISSING: reportItems.filter(item => item.status === 'MISSING').length,
    percent: Math.round((reportItems.filter(item => item.status === 'FULL').length / reportItems.length) * 100),
  }
  const visualReport = compareNaturalNumbersVisualInventory.map(visual => ({
    ...visual,
    status: renderedVisualIds.has(visual.id) ? 'FULL' : 'MISSING',
  }))
  const report = {
    title: 'مقارنة الأعداد الطبيعية وترتيبها',
    lessonId: lessonNineId,
    sourcePages: [...compareNaturalNumbersSourcePages],
    audit: 'Student Area: real component mounted and all 11 steps visited; Teacher Area: source ledger, page metadata and structured worked solution checked.',
    target: { FULL: '100%', PARTIAL: 0, MISSING: 0 },
    summary: coverageSummary,
    totals: { teachingElements: compareNaturalNumbersTeachingElements.length, printedQuestionBranches: compareNaturalNumbersBookTasks.length, questionGroups: compareNaturalNumbersQuestionGroups.length, rebuiltVisuals: visualReport.length },
    visualInventory: visualReport,
    items: reportItems,
    independentTest: {
      id: definition.id,
      questionCount: definition.questions.length,
      difficultyDistribution: actualDifficulty,
      solutionGroups: getSolutionGroups(definition).map(group => ({ group: group.groupNumber, firstQuestion: group.firstQuestionNumber, lastQuestion: group.lastQuestionNumber })),
      unitTwoStatus: unitTwo?.status,
      unitTwoTestCreated: false,
    },
  }
  mkdirSync('docs', { recursive: true })
  writeFileSync('docs/compare-natural-numbers-coverage.json', `${JSON.stringify(report, null, 2)}\n`)

  assert.deepEqual(coverageSummary, { total: 44, FULL: 44, PARTIAL: 0, MISSING: 0, percent: 100 }, 'all textbook rows must be fully covered in both areas')
  assert.ok(visualReport.every(item => item.status === 'FULL'), 'all reconstructed source visuals must render')
  assert.equal(lessonNinePlatformTeacherEntries.length, 2)
  view.unmount()
  dom.window.close()
  console.log('PASS Unit 2 Lesson 1 coverage: 44/44 source rows FULL (100%); PARTIAL=0; MISSING=0.')
  console.log('PASS Source inventory: 14 teaching/example elements, 30 printed task branches across pages 44–47, and all 8 visuals rendered.')
  console.log('PASS Teacher Area: 44 textbook solutions have real page metadata, full reasoning, answer, verification, and common-error guidance.')
  console.log('PASS Independent test: exactly 20 questions, 6/7/4/3 difficulty split, and four five-question solution groups; Unit 2 remains in progress without a unit test.')
  console.log('Wrote docs/compare-natural-numbers-coverage.json')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
