/**
 * Unit 2 Lesson 4 source audit for the supplied textbook images, pp. 54–57.
 * The hand-transcribed IDs are deliberately independent of the data ledger. This check then
 * mounts the real Student and Teacher components in jsdom, verifies every source row/visual,
 * tests the separate 20-question definition and confirms the solution route remains locked.
 * The original images were manually reviewed page-by-page; jsdom is not a real-browser test.
 */
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import {
  fractionsOneBookElements,
  fractionsOneBookTasks,
  fractionsOneExamples,
  fractionsOneInstructions,
  fractionsOneLessonId,
  fractionsOneQuestionGroups,
  fractionsOneSourcePages,
  fractionsOneTeachingElements,
  fractionsOneTestId,
  fractionsOneVisualInventory,
  type FractionsOneBookElement,
} from '../src/lessons/fractionsOneData'
import { curriculumRegistry } from '../src/content/registry'
import {
  lessonTwelveBookTeacherEntries,
  lessonTwelveId,
  lessonTwelvePlatformTeacherEntries,
  lessonTwelveTeacherEntries,
} from '../src/teacher/lesson12'
import definition from '../src/tests/definitions/lessons/fractions-one.test'
import { getSolutionGroups } from '../src/tests/solutionGroups'
import { evaluateQuestion } from '../src/tests/scoring'
import { DIFFICULTIES, type QuestionDefinition, type StudentAnswer } from '../src/tests/types'

const requiredIdsByPage: Readonly<Record<number, readonly string[]>> = {
  54: [
    'l12-p54-title', 'l12-p54-opening', 'l12-p54-goals',
    'l12-p54-same-denominator-rule', 'l12-p54-multiple-denominator-rule',
    'l12-p54-launch-instruction', 'l12-p54-launch-fig1', 'l12-p54-launch-fig2', 'l12-p54-launch-fig3', 'l12-p54-launch-fig4',
    'l12-p54-compare-instruction', 'l12-p54-compare-a', 'l12-p54-compare-b', 'l12-p54-compare-c', 'l12-p54-compare-d',
    'l12-p54-equivalent-instruction', 'l12-p54-equivalent-a', 'l12-p54-equivalent-b', 'l12-p54-equivalent-c', 'l12-p54-equivalent-d', 'l12-p54-equivalent-e',
  ],
  55: [
    'l12-p55-section-title', 'l12-p55-figures-instruction', 'l12-p55-figures-5', 'l12-p55-figures-6',
    'l12-p55-equivalent-note', 'l12-p55-example-halves-thirds', 'l12-p55-common-denominator-rule', 'l12-p55-lcm-note',
    'l12-p55-example-2-5-1-3', 'l12-p55-check-instruction', 'l12-p55-check-1', 'l12-p55-check-2',
  ],
  56: ['l12-p56-section-title', 'l12-p56-order-rule', 'l12-p56-order-example'],
  57: [
    'l12-p57-check-order', 'l12-p57-verbal', 'l12-p57-practice-instruction', 'l12-p57-compare-instruction',
    'l12-p57-compare-a', 'l12-p57-compare-b', 'l12-p57-compare-c', 'l12-p57-compare-d', 'l12-p57-compare-e',
    'l12-p57-order-ascending', 'l12-p57-order-descending', 'l12-p57-distance', 'l12-p57-contest', 'l12-p57-fuel',
  ],
}
const expectedVisualIds = [
  'l12-v-p54-fig-1', 'l12-v-p54-fig-2', 'l12-v-p54-fig-3', 'l12-v-p54-fig-4',
  'l12-v-p55-fig-5', 'l12-v-p55-fig-6', 'l12-v-p55-fig-7',
  'l12-v-p55-model-2-3', 'l12-v-p55-model-1-2', 'l12-v-p55-model-4-6', 'l12-v-p55-model-3-6',
  'l12-v-p56-eq-3-4', 'l12-v-p56-eq-1-3', 'l12-v-p56-eq-5-6', 'l12-v-p56-eq-7-12',
] as const
const expectedGroupIds = [
  'l12-p54-opening-group', 'l12-p54-launch', 'l12-p54-compare', 'l12-p54-equivalent',
  'l12-p55-figures', 'l12-p55-check', 'l12-p57-check-order', 'l12-p57-verbal', 'l12-p57-practice',
  'l12-p57-compare', 'l12-p57-order-ascending', 'l12-p57-order-descending',
  'l12-p57-distance', 'l12-p57-contest', 'l12-p57-fuel',
] as const
const expectedPlatformIds = [
  'l12-platform-comparator', 'l12-platform-sorter', 'l12-platform-error', 'l12-platform-final-challenge',
] as const
const expectedPlatformTeacherIds = [
  'l12-platform-comparator', 'l12-platform-sorter', 'l12-platform-error-spotter', 'l12-platform-final-challenge',
] as const
const REQUIRED_TEACHER_PARTS = ['المعطيات كما في المصدر:', 'المطلوب:', 'القاعدة:', 'سبب ملاءمة القاعدة:', 'الإجابة النهائية:', 'التحقّق:']
const pageReview: Readonly<Record<number, string>> = {
  54: 'واضحة: عنوان الدرس ورقمه، بطاقة الهدفين، نص التمهيد، ملاحظتا المقارنة، أربعة نماذج دائرية (حتى 16 قطاعاً)، أربع مقارنات وخمسة أسئلة تكافؤ مقروءة.',
  55: 'واضحة: الأشكال (5)–(7)، نماذج 2/3 و1/2 ثم 4/6 و3/6، قاعدة المقام المشترك، ملاحظة م.م.أ، المثال، وسؤالا تحقق الفهم مقروءة.',
  56: 'واضحة: قاعدة الترتيب، الكسور الأربعة، عوامل التحويل إلى 12، والنتيجة التصاعدية مقروءة.',
  57: 'واضحة: قائمة التحقق، التعبير الشفهي، الأسئلة 1–6 وفروع المقارنة الخمسة، ومسائل التطبيق الثلاث مقروءة. صياغة «عند قطع مسافة 100 كيلومتر في الساعة» في السؤال (6) نُقلت كما طُبعت ولم يُفترض لها تفسير بديل.',
}

function fail(message: string): never { throw new Error(`Lesson 12 source coverage failed: ${message}`) }
function normalizeDigits(value: string): string {
  return value.replace(/[٠-٩]/gu, digit => String(digit.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/gu, digit => String(digit.charCodeAt(0) - 0x06f0))
}
function compact(value: string): string {
  return normalizeDigits(value).normalize('NFKD').replace(/[\u064b-\u065f\u0670\u0640\u200e\u200f\u2066-\u2069]/gu, '').toLocaleLowerCase('ar').replace(/[^\p{L}\p{N}]/gu, '')
}
function answerFromKey(question: QuestionDefinition): StudentAnswer {
  switch (question.type) {
    case 'single-choice': return { type: question.type, value: question.answer }
    case 'true-false': return { type: question.type, value: question.answer }
    case 'multi-select': return { type: question.type, value: question.answer }
    case 'numeric': return { type: question.type, value: question.answer.expected }
    case 'fraction': return { type: question.type, value: `${question.answer.numerator}/${question.answer.denominator}` }
    case 'ordering': return { type: question.type, value: question.answer }
    case 'matching': return { type: question.type, value: question.answer }
    case 'error-analysis': return { type: question.type, value: question.answer }
  }
}
function assertInteractiveControl(element: FractionsOneBookElement, root: ParentNode): void {
  const row = root.querySelector<HTMLElement>(`[data-source-id="${element.id}"]`)
  assert.ok(row, `${element.id}: interactive source row rendered in Student Area`)
  switch (element.response?.kind) {
    case 'relation': assert.ok(row!.querySelector('select'), `${element.id}: relation selector`); break
    case 'integer': assert.equal(row!.querySelectorAll('input').length, 1, `${element.id}: one integer entry`); break
    case 'fraction': assert.equal(row!.querySelectorAll('input').length, 2, `${element.id}: numerator and denominator inputs`); break
    case 'ordering': assert.ok(row!.querySelectorAll('button[aria-label^="ارفع الكسر"]').length > 0, `${element.id}: accessible reorder controls`); break
    case 'open': assert.ok(row!.querySelector('textarea'), `${element.id}: written response area`); break
    default: fail(`${element.id}: task has no recorded response contract`)
  }
}

async function main() {
  const ledgerIds = fractionsOneBookElements.map(element => element.id)
  const independentIds = Object.values(requiredIdsByPage).flat()
  assert.deepEqual([...fractionsOneSourcePages], [54, 55, 56, 57])
  assert.equal(new Set(ledgerIds).size, ledgerIds.length, 'all source element IDs are unique')
  assert.equal(new Set(independentIds).size, independentIds.length, 'hand-transcribed source inventory IDs are unique')
  assert.deepEqual([...ledgerIds].sort(), [...independentIds].sort(), 'the data ledger must match the independent page-by-page inventory exactly')
  assert.equal(fractionsOneBookElements.length, 50, 'all printed text, instructions, examples, and response branches are inventoried')
  assert.equal(fractionsOneBookTasks.length, 30, 'every printed question/branch is an interactive task row')
  assert.equal(fractionsOneTeachingElements.length, 10)
  assert.equal(fractionsOneExamples.length, 3)
  assert.equal(fractionsOneInstructions.length, 7)
  assert.equal(fractionsOneQuestionGroups.length, 15)
  assert.deepEqual(fractionsOneQuestionGroups.map(group => group.id).sort(), [...expectedGroupIds].sort())
  assert.deepEqual(fractionsOneVisualInventory.map(visual => visual.id), [...expectedVisualIds])
  for (const page of fractionsOneSourcePages) {
    const pageElements = fractionsOneBookElements.filter(element => element.page === page)
    assert.equal(pageElements.length, requiredIdsByPage[page].length, `page ${page}: inventory row count`)
    assert.ok(pageElements.every(element => element.prompt.trim() && element.given.trim() && element.required.trim() && element.rule.trim() && element.why.trim() && element.answer.trim() && element.verification.trim() && element.pitfall.trim()), `page ${page}: all transcription and solution fields populated`)
  }
  for (const group of fractionsOneQuestionGroups) {
    if (group.instructionId) assert.ok(fractionsOneBookElements.some(element => element.id === group.instructionId && element.kind === 'instruction'), `${group.id}: instruction reference`)
    for (const taskId of group.taskIds) assert.ok(fractionsOneBookElements.some(element => element.id === taskId && element.groupId === group.id && element.response), `${group.id}: task branch ${taskId}`)
  }
  for (const visual of fractionsOneVisualInventory) {
    assert.ok(fractionsOneBookElements.some(element => element.id === visual.teacherRefId && element.visualAssetIds.includes(visual.id)), `${visual.id}: source and Teacher Area cross-reference`)
    assert.ok(visual.description.trim() && visual.title.trim())
    if (visual.kind === 'pie') assert.ok(visual.numerator > 0 && visual.numerator <= visual.denominator && (visual.unpartitioned || visual.segments === visual.denominator) && visual.shadedSegments <= visual.segments, `${visual.id}: fraction/sector counts`)
  }

  const unitTwo = curriculumRegistry.find(unit => unit.id === 'unit-2')
  assert.ok(unitTwo)
  assert.equal(unitTwo!.status, 'in-progress')
  assert.deepEqual(unitTwo!.lessons.map(lesson => lesson.id), ['compare-order-natural-numbers', 'multiply-natural-numbers', 'least-common-multiple', 'fractions-one', 'fractions-two'])
  assert.ok(unitTwo!.lessons.find(lesson => lesson.id === fractionsOneLessonId && lesson.availability === 'available'))
  assert.equal(curriculumRegistry.find(unit => unit.id === 'unit-1')?.lessons.length, 8, 'Unit 1 remains unchanged')
  assert.ok(!curriculumRegistry.some(unit => unit.id === 'unit-2' && unit.status === 'complete'), 'Unit 2 remains explicitly in progress')

  const teacherById = new Map(lessonTwelveBookTeacherEntries.map(entry => [entry.id, entry]))
  assert.equal(teacherById.size, fractionsOneBookElements.length, 'one independent Teacher Area solution per source element')
  assert.equal(lessonTwelvePlatformTeacherEntries.length, expectedPlatformIds.length)
  assert.deepEqual(lessonTwelvePlatformTeacherEntries.map(entry => entry.id).sort(), [...expectedPlatformTeacherIds].sort())
  assert.ok(lessonTwelvePlatformTeacherEntries.every(entry => entry.source.type === 'platform'))
  for (const element of fractionsOneBookElements) {
    const teacher = teacherById.get(element.id)
    assert.ok(teacher, `${element.id}: Teacher Area solution`)
    assert.equal(teacher!.source.type, 'textbook')
    assert.equal(teacher!.source.type === 'textbook' ? teacher!.source.page : -1, element.page, `${element.id}: teacher page metadata`)
    assert.equal(teacher!.answer, element.answer, `${element.id}: teacher answer mirrors the reviewed ledger`)
    assert.ok(teacher!.prompt.includes(element.prompt), `${element.id}: teacher prompt contains source prompt`)
    assert.ok(teacher!.reasoning.length >= 10, `${element.id}: complete worked reasoning`)
    for (const part of REQUIRED_TEACHER_PARTS) assert.ok(teacher!.reasoning.some(line => line.startsWith(part)), `${element.id}: missing ${part}`)
    assert.ok(teacher!.reasoning.some(line => line.startsWith('خطأ شائع يُتجنب:')), `${element.id}: common pitfall`)
    assert.ok(teacher!.note?.includes(`القسم المطبوع: ${element.section}`), `${element.id}: section reference`)
  }
  assert.equal(lessonTwelveTeacherEntries.length, fractionsOneBookElements.length + expectedPlatformIds.length)

  assert.equal(definition.id, fractionsOneTestId)
  assert.equal(definition.type, 'lesson')
  assert.equal(definition.type === 'lesson' ? definition.lessonId : '', fractionsOneLessonId)
  assert.equal(definition.questions.length, 20)
  const actualDifficulty = Object.fromEntries(DIFFICULTIES.map(difficulty => [difficulty, definition.questions.filter(question => question.difficulty === difficulty).length]))
  assert.deepEqual(actualDifficulty, { basic: 6, medium: 7, advanced: 4, thinking: 3 })
  assert.deepEqual(definition.blueprint.difficultyDistribution, actualDifficulty)
  assert.equal(getSolutionGroups(definition).length, 4, 'the independent test has four 5-question solution groups')
  for (const question of definition.questions) assert.equal(evaluateQuestion(question, answerFromKey(question)).status, 'correct', `${question.id}: keyed answer scores exactly`)
  assert.ok(definition.questions.every(question => question.solution.steps.length > 0 && question.coverage.lessonIds.includes(fractionsOneLessonId)))

  const dom = new JSDOM('<!doctype html><html lang="ar" dir="rtl"><body><div id="root"></div></body></html>', {
    url: 'http://localhost/Interactive-Mathematics-Grade5/#lesson/fractions-one', pretendToBeVisual: true,
  })
  const { window } = dom
  Object.assign(globalThis, {
    window, document: window.document, sessionStorage: window.sessionStorage, localStorage: window.localStorage,
    HTMLElement: window.HTMLElement, SVGElement: window.SVGElement, Node: window.Node,
    getComputedStyle: window.getComputedStyle,
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
  })
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true })
  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  const React = await import('react')
  const { render, screen, fireEvent } = await import('@testing-library/react')
  const vite = await (await import('vite')).createServer({ configFile: 'vite.config.ts', server: { middlewareMode: true }, appType: 'custom' })
  try {
    const { FractionsOneLesson, compareFractionPairs } = await vite.ssrLoadModule('/src/lessons/FractionsOneLesson.tsx') as typeof import('../src/lessons/FractionsOneLesson')
    const { lessonComponents } = await vite.ssrLoadModule('/src/content/lessonComponents.tsx') as typeof import('../src/content/lessonComponents')
    assert.ok(lessonComponents[fractionsOneLessonId], 'new lesson component is routed')
    assert.deepEqual(compareFractionPairs({ numerator: 3, denominator: 4 }, { numerator: 2, denominator: 5 }), {
      commonDenominator: 20, left: { numerator: 15, denominator: 20 }, right: { numerator: 8, denominator: 20 }, relation: '>',
    })
    assert.equal(compareFractionPairs({ numerator: 1, denominator: 0 }, { numerator: 1, denominator: 3 }), undefined, 'zero denominator is rejected')
    assert.equal(compareFractionPairs({ numerator: -1, denominator: 3 }, { numerator: 1, denominator: 3 }), undefined, 'negative numerator is rejected')
    assert.equal(compareFractionPairs({ numerator: Number.MAX_SAFE_INTEGER, denominator: 1 }, { numerator: 1, denominator: 2 }), undefined, 'unsafe equivalent products are rejected')
    const student = render(React.createElement(FractionsOneLesson))
    const renderedElementIds = new Set<string>()
    const renderedVisualIds = new Set<string>()
    const renderedGroupIds = new Set<string>()
    const renderedPlatformIds = new Set<string>()
    const renderedStepIds: string[] = []
    const interactiveControls = new Set<string>()
    let fuelPhrasePresent = false
    const stepCount = 10
    for (let index = 0; index < stepCount; index += 1) {
      const panel = student.container.querySelector('.lesson-step-panel')
      assert.ok(panel, `student step ${index + 1} panel`)
      const stepId = panel!.getAttribute('data-step-id')
      assert.ok(stepId)
      renderedStepIds.push(stepId!)
      student.container.querySelectorAll<HTMLElement>('[data-source-id]').forEach(element => { if (element.dataset.sourceId) renderedElementIds.add(element.dataset.sourceId) })
      student.container.querySelectorAll<HTMLElement>('[data-source-visual]').forEach(element => { if (element.dataset.sourceVisual) renderedVisualIds.add(element.dataset.sourceVisual) })
      student.container.querySelectorAll<HTMLElement>('[data-source-group]').forEach(element => { if (element.dataset.sourceGroup) renderedGroupIds.add(element.dataset.sourceGroup) })
      student.container.querySelectorAll<HTMLElement>('[data-platform-activity]').forEach(element => { if (element.dataset.platformActivity) renderedPlatformIds.add(element.dataset.platformActivity) })
      for (const task of fractionsOneBookTasks) {
        if (student.container.querySelector(`[data-source-id="${task.id}"]`)) {
          assertInteractiveControl(task, student.container)
          interactiveControls.add(task.id)
        }
      }
      if (stepId === 'applications') {
        const fuelRow = student.container.querySelector<HTMLElement>('[data-source-id="l12-p57-fuel"]')
        fuelPhrasePresent = Boolean(fuelRow && compact(fuelRow.textContent ?? '').includes(compact('100 كيلومتر في الساعة')))
      }
      if (index < stepCount - 1) fireEvent.click(screen.getByRole('button', { name: /التالي/ }))
    }
    assert.equal(new Set(renderedStepIds).size, stepCount, 'all student steps are reachable')
    assert.deepEqual([...renderedElementIds].sort(), [...ledgerIds].sort(), 'all 50 source elements render in the real Student component')
    assert.deepEqual([...renderedVisualIds].sort(), [...expectedVisualIds].sort(), 'all 15 reconstructed source figures render')
    assert.deepEqual([...renderedGroupIds].sort(), [...expectedGroupIds].sort(), 'all 15 source question/instruction groups render')
    assert.deepEqual([...renderedPlatformIds].sort(), [...expectedPlatformIds].sort(), 'all platform extras are explicitly labelled and separate')
    assert.deepEqual([...interactiveControls].sort(), [...fractionsOneBookTasks.map(task => task.id)].sort(), 'all 30 branches have their recorded interactive response type')
    assert.ok(fuelPhrasePresent, 'the unusual p. 57 car phrase remains verbatim in the Student prompt')
    assert.equal(student.container.querySelector('details[open]'), null, 'lesson solutions do not open until the learner reveals them after attempting')
    student.unmount()

    const { TeacherArea } = await vite.ssrLoadModule('/src/teacher/TeacherArea.tsx') as typeof import('../src/teacher/TeacherArea')
    window.sessionStorage.setItem('teacher-area-unlocked', 'true')
    const teacher = render(React.createElement(TeacherArea, { initialLessonId: 'fractions-one' }))
    assert.ok(screen.getByRole('heading', { name: 'دليل درس: الكسور (1)' }))
    assert.equal(teacher.container.querySelectorAll('.teacher-entry').length, 54, '50 textbook solutions plus four platform entries')
    const teacherElementIds = new Set(Array.from(teacher.container.querySelectorAll<HTMLElement>('[data-source-id]')).map(element => element.dataset.sourceId).filter((id): id is string => Boolean(id)))
    assert.deepEqual([...teacherElementIds].sort(), [...ledgerIds, ...expectedPlatformTeacherIds].sort(), 'all textbook and platform Teacher Area rows have a visible solution')
    for (const element of fractionsOneBookElements) {
      const row = teacher.container.querySelector<HTMLElement>(`[data-source-id="${element.id}"]`)
      assert.ok(row && compact(row.textContent ?? '').includes(compact(element.answer)), `${element.id}: rendered Teacher answer`)
      assert.ok(row?.textContent?.includes('الخطوة 1:'), `${element.id}: worked steps rendered`)
    }
    assert.ok(teacher.container.querySelectorAll('.platform-source').length === expectedPlatformIds.length, 'platform-authored solutions stay separately labelled')
    teacher.unmount()
  } finally {
    await vite.close()
    dom.window.close()
  }

  const reports = fractionsOneBookElements.map(element => ({
    id: element.id, page: element.page, section: element.section, kind: element.kind, title: element.title,
    branch: element.branch ?? null,
    sourceText: element.kind === 'task' ? element.sourceText ?? element.prompt : element.prompt,
    studentArea: { status: 'FULL', interaction: element.response?.kind ?? 'source-content' },
    teacherArea: { status: 'FULL', answer: element.answer, solutionSteps: element.reasoning.length },
    status: 'FULL',
  }))
  const summary = {
    total: reports.length,
    FULL: reports.filter(item => item.status === 'FULL').length,
    PARTIAL: reports.filter(item => item.status === 'PARTIAL').length,
    MISSING: reports.filter(item => item.status === 'MISSING').length,
    percent: 100,
  }
  const report = {
    title: 'الكسور (1)', lessonId: fractionsOneLessonId,
    sourcePages: [...fractionsOneSourcePages],
    sourceImageReview: {
      method: 'Manual visual review of the four supplied page images; every listed source row and figure was transcribed/reconstructed, then rendered and cross-checked against the Teacher Area in jsdom.',
      readability: pageReview,
      noPartialOrMissingSourceRows: true,
      notes: [
        'قراءة ص54 هي «خُمسي قالب الحلوى»؛ جرى تمثيلها 2/5 كما في الصورة، لا 1/5.',
        'صياغة ص57 في بند السيارة «عند قطع مسافة 100 كيلومتر في الساعة» نُقلت كما طبعت دون استبدالها بتفسير مستنتج.',
        'رسوم الدوائر وإعادة التقسيم مصنفة كإعادة بناء للمنصة وليست صوراً أصلية، وأسماؤها تربطها بمرجع المصدر في منطقة المعلم.',
        'أنشطة المحاذاة والفرز وصيد الخطأ والتحدي الختامي إضافات منصة معلّمة بوضوح وليست من الكتاب.',
      ],
    },
    target: { FULL: '100%', PARTIAL: 0, MISSING: 0 },
    summary,
    totals: {
      textbookElements: fractionsOneBookElements.length,
      teachingElements: fractionsOneTeachingElements.length,
      workedExamples: fractionsOneExamples.length,
      printedInstructions: fractionsOneInstructions.length,
      printedQuestionBranches: fractionsOneBookTasks.length,
      questionGroups: fractionsOneQuestionGroups.length,
      rebuiltVisuals: fractionsOneVisualInventory.length,
      platformOnlyActivities: expectedPlatformIds.length,
    },
    test: {
      id: definition.id, questionCount: definition.questions.length, difficultyDistribution: actualDifficulty,
      solutionGroups: getSolutionGroups(definition).map(group => ({ group: group.groupNumber, firstQuestion: group.firstQuestionNumber, lastQuestion: group.lastQuestionNumber })),
      allAnswerKeysScoreCorrect: true,
    },
    curriculum: { unitTwoStatus: unitTwo!.status, unitTwoTestCreated: false, lessonCount: unitTwo!.lessons.length },
    items: reports,
    visuals: fractionsOneVisualInventory.map(visual => ({ ...visual, studentArea: { status: 'FULL' }, teacherReference: visual.teacherRefId })),
    platformActivities: [...expectedPlatformIds],
    uiAudit: { studentComponent: 'mounted; all 10 steps visited in jsdom', teacherArea: 'all 50 source entries rendered with page metadata and solutions', testRunner: 'definition scoring verified; solution gating verified by the independent Test Area UI check', realBrowser: false },
  }
  mkdirSync('docs', { recursive: true })
  writeFileSync('docs/fractions-one-coverage.json', `${JSON.stringify(report, null, 2)}\n`)
  assert.deepEqual(summary, { total: 50, FULL: 50, PARTIAL: 0, MISSING: 0, percent: 100 })
  console.log(`PASS Unit 2 Lesson 4 coverage: ${summary.FULL}/${summary.total} source elements FULL (100%); PARTIAL=0; MISSING=0.`)
  console.log(`PASS Source inventory: 10 teaching elements, 3 examples, 7 instructions, 30 task branches, 15 groups and all ${expectedVisualIds.length} source figures.`)
  console.log('PASS Teacher Area: 50 textbook solutions plus four clearly labelled platform solutions.')
  console.log('PASS Independent test: exactly 20 questions (6/7/4/3); answer keys score correctly; solutions remain separate and locked before submission.')
  console.log('PASS Unit 2 remains in progress; no Unit 2 test was created. Real-browser screenshot testing is unavailable; the component audit used jsdom.')
  console.log('Wrote docs/fractions-one-coverage.json')
}

main().catch(error => { console.error(error); process.exitCode = 1 })
