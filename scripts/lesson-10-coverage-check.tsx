/**
 * Unit 2 Lesson 2 source-coverage audit, textbook pp. 48–51.
 *
 * The required IDs below are an independently transcribed inventory (not generated from the
 * ledger). The check mounts and navigates through the real Student Area, validates printed text
 * and reconstructed tables/figures/response cards, validates each detailed Teacher Area solution,
 * then writes the item-by-item coverage report. A missing/partial item makes the command fail.
 */
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'

/** Same shape as the lesson's printed math-run pattern: digits joined by × + = − - operators. */
const MATH_RUN_GUARD = /\(?\d[\d,]*\)?(?:\s*[×+=−-]\s*\(?\d[\d,]*\)?)+/gu
import {
  multiplyNaturalNumbersBookElements,
  multiplyNaturalNumbersBookTasks,
  multiplyNaturalNumbersQuestionGroups,
  multiplyNaturalNumbersSourcePages,
  multiplyNaturalNumbersTeachingElements,
  multiplyNaturalNumbersTestId,
  multiplyNaturalNumbersVisualInventory,
  type MultiplyNaturalNumbersBookElement,
} from '../src/lessons/multiplyNaturalNumbersData'
import { curriculumRegistry } from '../src/content/registry'
import { lessonComponents } from '../src/content/lessonComponents'
import {
  lessonTenBookTeacherEntries,
  lessonTenId,
  lessonTenPlatformTeacherEntries,
  lessonTenTeacherEntries,
} from '../src/teacher/lesson10'
import { getSolutionGroups } from '../src/tests/solutionGroups'
import definition from '../src/tests/definitions/lessons/multiply-natural-numbers.test'
import { DIFFICULTIES } from '../src/tests/types'

const requiredIdsByPage: Readonly<Record<number, readonly string[]>> = {
  48: [
    'l10-p48-intro', 'l10-p48-goals',
    'l10-p48-launch-a', 'l10-p48-launch-b', 'l10-p48-launch-c', 'l10-p48-launch-d',
    'l10-p48-carry', 'l10-p48-example1',
  ],
  49: [
    'l10-p49-example2',
    'l10-p49-patterns-135', 'l10-p49-patterns-231', 'l10-p49-zero',
    'l10-p49-check1', 'l10-p49-check2-a', 'l10-p49-check2-b', 'l10-p49-check2-c', 'l10-p49-check2-d',
  ],
  50: [
    'l10-p50-commutative', 'l10-p50-props-note', 'l10-p50-associative', 'l10-p50-assoc-easiest',
    'l10-p50-distributive', 'l10-p50-dist-add', 'l10-p50-dist-sub',
    'l10-p50-check1', 'l10-p50-check2',
  ],
  51: [
    'l10-p51-ex1-a', 'l10-p51-ex1-b', 'l10-p51-ex1-c', 'l10-p51-ex1-d',
    'l10-p51-ex2-a', 'l10-p51-ex2-b', 'l10-p51-ex2-c', 'l10-p51-ex2-d',
    'l10-p51-ex3-a', 'l10-p51-ex3-b', 'l10-p51-ex3-c', 'l10-p51-ex3-d',
    'l10-p51-ex4-a', 'l10-p51-ex4-b', 'l10-p51-ex4-c',
    'l10-p51-ex5',
  ],
}
const expectedVisualIds = [
  'p48-column-1320x3',
  'p49-column-425x12-steps',
  'p49-patterns-135',
  'p49-patterns-231',
  'p49-zero-products',
  'p50-dist-add-table',
  'p50-dist-sub-table',
  'p51-rectangle-abcd',
  'p51-karim-bar-model',
] as const
const REQUIRED_TEACHER_PARTS = ['المعطيات:', 'المطلوب:', 'القاعدة المستعملة:', 'لماذا تنطبق هنا:', 'الإجابة النهائية:', 'التحقّق:']

function fail(message: string): never {
  throw new Error(`Lesson 10 source coverage failed: ${message}`)
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
function isInteractive(element: MultiplyNaturalNumbersBookElement): boolean {
  return Boolean(element.response)
}
function taskVisibleText(element: MultiplyNaturalNumbersBookElement): string {
  return element.sourceText ?? element.title
}

async function main() {
  const ledgerIds = multiplyNaturalNumbersBookElements.map(element => element.id)
  const independentlyDeclaredIds = Object.values(requiredIdsByPage).flat()
  assert.equal(new Set(ledgerIds).size, ledgerIds.length, 'ledger IDs must be unique')
  assert.equal(new Set(independentlyDeclaredIds).size, independentlyDeclaredIds.length, 'independent inventory IDs must be unique')
  assert.deepEqual([...ledgerIds].sort(), [...independentlyDeclaredIds].sort(), 'the ledger and the hand-transcribed page inventory must match exactly')
  assert.deepEqual([...multiplyNaturalNumbersSourcePages], [48, 49, 50, 51])
  assert.equal(multiplyNaturalNumbersTeachingElements.length, 12)
  assert.equal(multiplyNaturalNumbersBookTasks.length, 30)
  assert.equal(multiplyNaturalNumbersBookElements.length, 42)
  assert.equal(multiplyNaturalNumbersQuestionGroups.length, 12)
  assert.deepEqual(multiplyNaturalNumbersVisualInventory.map(item => item.id), expectedVisualIds)
  for (const page of multiplyNaturalNumbersSourcePages) {
    const pageElements = multiplyNaturalNumbersBookElements.filter(element => element.page === page)
    assert.equal(pageElements.length, requiredIdsByPage[page].length, `page ${page} source-row count`)
    assert.ok(pageElements.every(element => element.prompt.trim() && element.given.trim() && element.required.trim() && element.rule.trim() && element.why.trim() && element.answer.trim() && element.verification.trim() && element.pitfall.trim()), `page ${page} ledger completeness`)
  }
  assert.ok(multiplyNaturalNumbersBookTasks.every(task => task.groupId && task.response), 'each printed question branch must belong to a group and have an interaction/response record')
  assert.equal(multiplyNaturalNumbersBookTasks.filter(task => task.kind === 'example').length, 2, 'the two worked examples are interactive tasks flagged as examples')
  assert.ok(multiplyNaturalNumbersBookTasks.every(task => multiplyNaturalNumbersQuestionGroups.some(group => group.id === task.groupId)), 'every branch group must be declared')
  assert.ok(lessonComponents[lessonTenId], 'the lesson route is registered')

  const unitOne = curriculumRegistry.find(unit => unit.id === 'unit-1')
  const unitTwo = curriculumRegistry.find(unit => unit.id === 'unit-2')
  assert.ok(unitOne)
  assert.equal(unitOne!.lessons.length, 8, 'Unit 1 remains at its original eight-lesson boundary')
  assert.equal(unitTwo?.status, 'in-progress')
  assert.deepEqual(unitTwo?.lessons.map(lesson => lesson.id), ['compare-order-natural-numbers', lessonTenId, 'least-common-multiple', 'fractions-one', 'fractions-two', 'tenths-one', 'decimal-parts-two', 'decimal-parts-three'])
  assert.equal(unitTwo?.lessons[1].availability, 'available')
  assert.equal(unitTwo?.lessons[2].availability, 'available')

  const teacherById = new Map(lessonTenBookTeacherEntries.map(entry => [entry.id, entry]))
  assert.equal(teacherById.size, 42, 'one detailed Teacher Area solution per textbook ledger row')
  for (const element of multiplyNaturalNumbersBookElements) {
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
  assert.equal(lessonTenTeacherEntries.length, 46)
  assert.equal(lessonTenPlatformTeacherEntries.length, 4)
  assert.ok(lessonTenPlatformTeacherEntries.every(entry => entry.source.type === 'platform'), 'added activities must be distinguished from textbook material')

  assert.equal(definition.id, multiplyNaturalNumbersTestId)
  assert.equal(definition.type, 'lesson')
  assert.equal(definition.type === 'lesson' ? definition.lessonId : '', lessonTenId)
  assert.equal(definition.questions.length, 20, 'the independent lesson test must contain exactly 20 questions')
  assert.deepEqual(definition.blueprint.difficultyDistribution, { basic: 6, medium: 7, advanced: 4, thinking: 3 })
  const actualDifficulty = Object.fromEntries(DIFFICULTIES.map(level => [level, definition.questions.filter(question => question.difficulty === level).length]))
  assert.deepEqual(actualDifficulty, definition.blueprint.difficultyDistribution)
  assert.equal(getSolutionGroups(definition).length, 4, '20 test solutions must retain the existing four groups of five')
  assert.ok(definition.questions.every(question => question.solution.steps.length >= 2 && question.originalityNote.trim().length >= 35), 'each independent-test question needs a real solution and a specific originality note')
  assert.ok(definition.questions.every(question => question.coverage.lessonIds.includes(lessonTenId)))
  assert.ok(!curriculumRegistry.some(unit => unit.id === 'unit-2' && unit.status === 'complete'))

  // Mount the actual lesson and visit every sequential step; the audit does not accept a ledger-only claim.
  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#lesson/multiply-natural-numbers',
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
  const { render, screen, fireEvent, within } = await import('@testing-library/react')
  const { MultiplyNaturalNumbersLesson } = await import('../src/lessons/MultiplyNaturalNumbersLesson')
  const view = render(React.createElement(MultiplyNaturalNumbersLesson))
  const studentRecords = new Map<string, { rendered: boolean; promptRendered: boolean; branchRendered: boolean; text: string }>()
  const renderedVisualIds = new Set<string>()
  const renderedGroupIds = new Set<string>()
  const renderedStepIds: string[] = []
  const stepCount = 12

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
    for (const element of multiplyNaturalNumbersBookElements) {
      const nodes = Array.from(view.container.querySelectorAll<HTMLElement>('[data-source-id]')).filter(node => node.dataset.sourceId === element.id)
      if (!nodes.length) continue
      const matchingNode = nodes.find(node => {
        const candidateText = compact(node.textContent ?? '')
        const sourceNeedle = compact(isInteractive(element) ? taskVisibleText(element) : element.prompt)
        return sourceNeedle.length > 0 && candidateText.includes(sourceNeedle)
      })
      const taskGroup = element.groupId
        ? view.container.querySelector<HTMLElement>(`[data-source-group="${element.groupId}"]`)
        : null
      const promptRendered = isInteractive(element)
        ? Boolean(taskGroup && compact(taskGroup.textContent ?? '').includes(compact(element.prompt)))
        : Boolean(matchingNode && compact(matchingNode.textContent ?? '').includes(compact(element.prompt)))
      studentRecords.set(element.id, {
        rendered: Boolean(matchingNode),
        promptRendered,
        branchRendered: !isInteractive(element) || Boolean(matchingNode),
        text: matchingNode?.textContent?.trim().slice(0, 500) ?? '',
      })
    }

    // Bidi/figure regression guards (added after the 2026-10-15 real-browser visual audit):
    // printed math runs must stay isolated LTR, and the p51 figures must keep the printed orientation.
    for (const source of view.container.querySelectorAll<HTMLElement>('.l10-task-source-text')) {
      const text = source.textContent ?? ''
      for (const run of text.match(MATH_RUN_GUARD) ?? []) {
        const isolated = Array.from(source.querySelectorAll<HTMLElement>('.math-expression'))
          .some(node => (node.textContent ?? '') === run && node.getAttribute('dir') === 'ltr')
        assert.ok(isolated, `math run "${run}" inside "${text}" must render in one LTR-isolated math-expression`)
      }
    }
    const karim = view.container.querySelector<HTMLElement>('[data-source-visual="p51-karim-bar-model"]')
    if (karim) {
      for (const selector of ['.l10-bar-strip', '.l10-bar-grid-row']) {
        assert.equal(karim.querySelector(selector)?.getAttribute('dir'), 'ltr', `${selector} must lay out left-to-right like the printed figure`)
      }
      const groups = karim.querySelectorAll<HTMLElement>('.l10-bar-strip .l10-bar-group')
      assert.ok(groups[0]?.querySelector('.l10-bar-cell')?.classList.contains('is-green'), 'karim strip must start with the green five-square bar (left on the printed page)')
      assert.ok(groups[1]?.querySelector('.l10-bar-cell')?.classList.contains('is-red'), 'karim strip must follow with the red six-square bar (right on the printed page)')
      assert.ok(karim.querySelector('.l10-bar-grid-row')?.firstElementChild?.classList.contains('l10-bar-rows-label'), 'the «3 أسئلة» label must sit left of the grids like the printed page')
    }
    const rectSvg = view.container.querySelector<HTMLElement>('.l10-rectangle-svg')
    if (rectSvg) assert.equal(rectSvg.style.direction, 'ltr', 'rectangle svg must keep LTR glyph anchoring so the 82 label never clips')

    const columnSteps = view.container.querySelector<HTMLElement>('[data-source-visual="p49-column-425x12-steps"]')
    if (columnSteps) {
      // printed page 49: multiplication carry box sits above the tens column (step 1), and the two
      // addition carries sit BELOW the rule over the thousands/hundreds columns (step 3).
      fireEvent.click(within(columnSteps).getByRole('button', { name: 'الخطوة الأولى' }))
      const topCarries = columnSteps.querySelector('tr.l10-column-carries')
      assert.ok(topCarries?.children[3]?.querySelector('.l10-carry'), 'step 1 must show the multiplication carry above the tens column like page 49')
      fireEvent.click(within(columnSteps).getByRole('button', { name: 'الخطوة الثالثة' }))
      const addCarries = columnSteps.querySelector('tr.l10-column-carries-add')
      assert.ok(addCarries, 'step 3 must render the two addition carries')
      assert.ok(addCarries?.previousElementSibling?.classList.contains('l10-column-rule'), 'addition carries must sit directly below the rule like page 49')
      assert.ok(addCarries?.children[1]?.querySelector('.l10-carry.is-red'), 'red addition carry must sit over the thousands column')
      assert.ok(addCarries?.children[2]?.querySelector('.l10-carry.is-blue'), 'blue addition carry must sit over the hundreds column')
    }

    if (stepIndex < stepCount - 1) fireEvent.click(screen.getByRole('button', { name: /التالي/ }))
  }

  assert.equal(new Set(renderedStepIds).size, stepCount, 'all lesson steps must be reachable')
  assert.equal(renderedGroupIds.size, multiplyNaturalNumbersQuestionGroups.length, 'all 12 printed task groups must be rendered')
  assert.deepEqual([...renderedGroupIds].sort(), multiplyNaturalNumbersQuestionGroups.map(group => group.id).sort())
  assert.deepEqual([...renderedVisualIds].sort(), [...expectedVisualIds].sort(), 'every textbook table/figure visual must be rebuilt and rendered')

  const reportItems = multiplyNaturalNumbersBookElements.map(element => {
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
  const visualReport = multiplyNaturalNumbersVisualInventory.map(visual => ({
    ...visual,
    status: renderedVisualIds.has(visual.id) ? 'FULL' : 'MISSING',
  }))
  const report = {
    title: 'ضرب الأعداد الطبيعية',
    lessonId: lessonTenId,
    sourcePages: [...multiplyNaturalNumbersSourcePages],
    audit: 'Student Area: real component mounted and all 12 steps visited; Teacher Area: source ledger, page metadata and structured worked solution checked.',
    target: { FULL: '100%', PARTIAL: 0, MISSING: 0 },
    summary: coverageSummary,
    totals: { teachingElements: multiplyNaturalNumbersTeachingElements.length, printedQuestionBranches: multiplyNaturalNumbersBookTasks.length, questionGroups: multiplyNaturalNumbersQuestionGroups.length, rebuiltVisuals: visualReport.length },
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
  writeFileSync('docs/multiply-natural-numbers-coverage.json', `${JSON.stringify(report, null, 2)}\n`)

  assert.deepEqual(coverageSummary, { total: 42, FULL: 42, PARTIAL: 0, MISSING: 0, percent: 100 }, 'all textbook rows must be fully covered in both areas')
  assert.ok(visualReport.every(item => item.status === 'FULL'), 'all reconstructed source visuals must render')
  view.unmount()
  dom.window.close()
  console.log('PASS Unit 2 Lesson 2 coverage: 42/42 source rows FULL (100%); PARTIAL=0; MISSING=0.')
  console.log('PASS Source inventory: 12 teaching/example elements, 30 printed task branches across pages 48–51, and all 9 visuals rendered.')
  console.log('PASS Teacher Area: 42 textbook solutions have real page metadata, full reasoning, answer, verification, and common-error guidance.')
  console.log('PASS Independent test: exactly 20 questions, 6/7/4/3 difficulty split, and four five-question solution groups; Unit 2 remains in progress without a unit test.')
  console.log('Wrote docs/multiply-natural-numbers-coverage.json')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
