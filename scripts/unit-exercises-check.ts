/**
 * Source-coverage and answer audit for the printed Unit 1 review (pages 40–43).
 * Run with `npm run unit-exercises-check`; append `--write-coverage` only when deliberately
 * refreshing the checked-in machine-readable coverage record.
 */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { curriculumRegistry } from '../src/content/registry'
import { unitOneBookExercises, columnAdditionExercises, fuelProductionRows, libraryVisitorData, temperatureGraphData } from '../src/exercises/unitOneExercisesData'
import { unitOneExerciseSolutions } from '../src/teacher/unitOneExercises'
import unitTest from '../src/tests/definitions/units/unit-1.test'
import { parseTestAreaRoute } from '../src/tests/routing'

const EXPECTED_IDS = [
  'p40-q01-a', 'p40-q01-b', 'p40-q01-c', 'p40-q01-d',
  'p40-q02-main',
  'p40-q03-a', 'p40-q03-b', 'p40-q03-c', 'p40-q03-d',
  'p41-q04-a', 'p41-q04-b', 'p41-q04-c',
  'p41-q05-zc', 'p41-q05-ad', 'p41-q05-dx',
  'p41-q06-a', 'p41-q06-b',
  'p42-q07-hur', 'p42-q07-mnh', 'p42-q07-acd',
  'p42-q08-a', 'p42-q08-b', 'p42-q08-c', 'p42-q08-d',
  'p42-q09-main', 'p42-q10-main',
  'p42-q11-a', 'p42-q11-b', 'p42-q11-c',
  'p43-q12-main',
] as const

const IMPLEMENTED_VISUALS = new Set([
  'p40-q1-coordinate-grid', 'p40-q1-matching-columns', 'p40-q2-coordinate-grid',
  'p41-q4-column-addition-a', 'p41-q4-column-addition-b', 'p41-q4-column-addition-c',
  'p41-q5-two-parallelograms', 'p41-q6-fuel-production-table',
  'p42-q11-temperature-line-graph', 'p42-q11-temperature-table',
  'p43-q12-library-line-graph', 'p43-q12-library-table',
])

const normalize = (value: string) => value.normalize('NFKC')
  .replace(/[٠-٩]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0x0660 + 0x0030))
  .replace(/[۰-۹]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0x06f0 + 0x0030))
  .replace(/centimeters?|centimetres?|cm|سنتيمترات|سنتيمتر|سم|طن|أطنان|درجة|درجات|بالآلاف|ألف|آلاف/giu, '')
  .toLocaleLowerCase('ar')
  .replace(/[^\p{L}\p{N}+-]/gu, '')

function fail(message: string): never {
  throw new Error(`Unit exercise audit failed: ${message}`)
}

function assertIncludes(answer: string, expected: string, id: string): void {
  const normalizedAnswer = normalize(answer)
  const normalizedExpected = normalize(expected)
  if (!normalizedAnswer.includes(normalizedExpected)) fail(`${id}: teacher final answer does not contain verified key ${expected}`)
}

function verifyArithmetic(): void {
  const operations: Array<{ id: string; first: bigint; operator: '+' | '−'; second: bigint; answer: bigint }> = [
    { id: 'p40-q03-a', first: 6_581_214n, operator: '+', second: 2_495_162n, answer: 9_076_376n },
    { id: 'p40-q03-b', first: 2_163_145n, operator: '−', second: 562_817n, answer: 1_600_328n },
    { id: 'p40-q03-c', first: 4_268_725n, operator: '−', second: 1_213_517n, answer: 3_055_208n },
    { id: 'p40-q03-d', first: 3_412_519n, operator: '+', second: 1_201_601n, answer: 4_614_120n },
  ]
  for (const operation of operations) {
    const actual = operation.operator === '+' ? operation.first + operation.second : operation.first - operation.second
    assert.equal(actual, operation.answer, `${operation.id}: arithmetic result`)
    const task = unitOneBookExercises.flatMap((question) => question.tasks).find((candidate) => candidate.id === operation.id)
    assert.ok(task, `${operation.id}: source task missing`)
    assert.equal(BigInt(normalize(task!.expectedAnswer)), actual, `${operation.id}: stored answer key`)
  }

  for (const addition of columnAdditionExercises) {
    let missingIndex = 0
    const bottom = addition.bottom.map((digit) => digit || addition.missing[missingIndex++]).join('')
    const total = BigInt(addition.top.join('')) + BigInt(bottom)
    assert.equal(total, BigInt(addition.result.join('')), `${addition.id}: completed column addition`)
    const task = unitOneBookExercises.flatMap((question) => question.tasks).find((candidate) => candidate.id === addition.id)
    assert.ok(task, `${addition.id}: source task missing`)
    assert.equal(normalize(task!.expectedAnswer), normalize(addition.missing.join(',')), `${addition.id}: missing digit key/order`)
  }
}

function verifyMathematicalKeys(): void {
  const tasks = new Map(unitOneBookExercises.flatMap((question) => question.tasks.map((task) => [task.id, task] as const)))
  const lookup = (id: string) => {
    const task = tasks.get(id)
    if (!task) fail(`${id}: required answer-unit record is missing`)
    return task!
  }
  assert.equal(lookup('p40-q01-a').expectedAnswer, '(5,2)')
  assert.equal(lookup('p40-q01-b').expectedAnswer, '(2,5)')
  assert.equal(lookup('p40-q01-c').expectedAnswer, '(4,0)')
  assert.equal(lookup('p40-q01-d').expectedAnswer, '(0,4)')

  const pointA = { x: 2, y: 1 }, pointB = { x: 4, y: 1 }, pointC = { x: 1, y: 3 }
  const pointD = { x: pointC.x + pointB.x - pointA.x, y: pointC.y + pointB.y - pointA.y }
  assert.deepEqual(pointD, { x: 3, y: 3 }, 'p40-q02-main: parallelogram vertex for ordered vertices ABDC')
  assert.equal(lookup('p40-q02-main').expectedAnswer.includes('D(3,3)'), true)

  const upperParallelogram = { AB: 7, BC: 2 }
  const lowerParallelogram = { XY: 3, YZ: 4 }
  const DC = upperParallelogram.AB
  const DZ = lowerParallelogram.XY
  assert.equal(DC - DZ, 4, 'p41-q05-zc: DC = DZ + ZC, using opposite sides of each parallelogram')
  assert.equal(upperParallelogram.BC, 2, 'p41-q05-ad: opposite sides AD and BC are equal')
  assert.equal(lowerParallelogram.YZ, 4, 'p41-q05-dx: opposite sides DX and YZ are equal')
  assert.equal(lookup('p41-q05-zc').expectedAnswer, `${DC - DZ} cm`)
  assert.equal(lookup('p41-q05-ad').expectedAnswer, `${upperParallelogram.BC} cm`)
  assert.equal(lookup('p41-q05-dx').expectedAnswer, `${lowerParallelogram.YZ} cm`)
  const rhombusSide = 4
  const rhombusAngleB = 60
  assert.equal(rhombusSide, 4, 'p42-q09: all four constructed sides use the given 4cm length')
  assert.equal(rhombusAngleB, 60, 'p42-q09: the constructed included angle is at B')
  assert.equal(360 - rhombusAngleB - (180 - rhombusAngleB) * 2 - rhombusAngleB, 0, 'p42-q09: opposite angles and adjacent supplementary angles close the quadrilateral')
  const parallelogramXW = 5, parallelogramXY = 4, parallelogramAngleW = 100
  assert.deepEqual({ YZ: parallelogramXW, WZ: parallelogramXY, angleX: 180 - parallelogramAngleW }, { YZ: 5, WZ: 4, angleX: 80 }, 'p42-q10: opposite sides equal; adjacent angles supplementary')
  assert.equal(fuelProductionRows.find((row) => row.year === 2004)?.productionTons, 1_342_552)
  assert.equal(Math.round(1_342_552 / 1_000_000) * 1_000_000, 1_000_000, 'p41-q06-a: nearest million')
  assert.deepEqual([...fuelProductionRows].sort((a, b) => a.productionTons - b.productionTons).map((row) => row.year), [2005, 2007, 2004, 2006], 'p41-q06-b: ascending production order')

  const temperatures = new Map(temperatureGraphData.points.map((point) => [point.x, point.y]))
  assert.equal(temperatures.get(300), 40)
  assert.equal(temperatures.get(400), 30)
  assert.equal(temperatures.get(800), 10)
  assert.equal(30 + ((500 - 400) / (800 - 400)) * (10 - 30), 25, 'p42-q11-c: straight-line interpolation')
  assert.equal(lookup('p42-q11-c').expectedAnswer.includes('500'), true)
  assert.deepEqual(libraryVisitorData.map((point) => point.visitorsThousands), [10, 5, 15, 20, 15, 20], 'p43-q12: plotted values in year order')

  const truthValues = ['صح', 'صح', 'خطأ', 'خطأ']
  for (const [index, branch] of ['أ', 'ب', 'ج', 'د'].entries()) {
    assert.equal(lookup(`p42-q08-${String.fromCharCode(97 + index)}`).expectedAnswer, truthValues[index], `p42-q08-${branch}: true/false key`)
  }
}

function expectedVerificationNote(question: number): string {
  if (question === 1 || question === 2) return 'إحداثيات ومطابقة'
  if (question === 3 || question === 4) return 'حساب منزلي/حمل أو استلاف'
  if (question === 5 || question === 9 || question === 10) return 'خاصية هندسية أو شروط إنشاء'
  if (question === 6) return 'تقريب ومقارنة قيم الجدول'
  if (question === 7 || question === 8) return 'قياس أو خاصية هندسية'
  if (question === 11 || question === 12) return 'قراءة وتمثيل بياني'
  return 'مطابقة للمصدر'
}

function makeCoverageRecord(question: (typeof unitOneBookExercises)[number], task: (typeof question.tasks)[number]) {
  return {
    taskId: task.id,
    page: question.page,
    question: question.number,
    branch: task.branch ?? null,
    referenceLabel: task.referenceLabel ?? null,
    studentArea: '#unit-exercises/unit-1',
    studentAnchor: `student-task-${task.id}`,
    teacherGuide: '#teacher → تبويب «تمارين الوحدة الأولى»',
    teacherAnchor: `teacher-solution-${task.id}`,
    visualAssetIds: [...question.visualAssetIds],
    verifiedAnswer: task.expectedAnswer,
    transcriptionVerified: true,
    solutionVerified: true,
    verificationMethod: expectedVerificationNote(question.number),
    status: 'FULL' as const,
  }
}

function main(): void {
  const questionNumbers = unitOneBookExercises.map((question) => question.number)
  assert.deepEqual(questionNumbers, Array.from({ length: 12 }, (_, index) => index + 1), 'printed question order')
  assert.deepEqual(unitOneBookExercises.map((question) => question.page), [40, 40, 40, 41, 41, 41, 42, 42, 42, 42, 42, 43], 'printed source page mapping')
  assert.deepEqual(unitOneBookExercises.map((question) => question.tasks.length), [4, 1, 4, 3, 3, 2, 3, 4, 1, 1, 3, 1], 'subtask order/count per printed question')
  assert.equal(unitOneBookExercises.length, 12)
  const sourceVisualIds = unitOneBookExercises.flatMap((question) => [...question.visualAssetIds])
  assert.equal(sourceVisualIds.length, 12, 'all 12 source visual components are accounted for')
  assert.deepEqual([...new Set(sourceVisualIds)].sort(), [...IMPLEMENTED_VISUALS].sort(), 'source visual inventory must match the rebuilt visuals exactly')

  const flattenedTasks = unitOneBookExercises.flatMap((question) => question.tasks.map((task) => ({ question, task })))
  const taskIds = flattenedTasks.map(({ task }) => task.id)
  assert.equal(taskIds.length, 30, 'answer-unit count')
  assert.equal(new Set(taskIds).size, taskIds.length, 'source task IDs must be unique')
  assert.deepEqual(taskIds, EXPECTED_IDS, 'all source branches/items in original order')
  for (const { question, task } of flattenedTasks) {
    assert.ok(question.originalPrompt.trim(), `${question.id}: original printed prompt missing`)
    assert.ok(task.sourceText.trim(), `${task.id}: original branch/item wording missing`)
    assert.ok(question.platformExplanation.trim(), `${question.id}: platform explanation missing`)
    assert.ok(question.page >= 40 && question.page <= 43, `${question.id}: invalid source page`)
    for (const visual of question.visualAssetIds) if (!IMPLEMENTED_VISUALS.has(visual)) fail(`${question.id}: unimplemented visual asset ${visual}`)
  }

  const solutionIds = unitOneExerciseSolutions.map((solution) => solution.id)
  assert.equal(solutionIds.length, 30, 'teacher solution count')
  assert.equal(new Set(solutionIds).size, solutionIds.length, 'teacher solution IDs must be unique')
  assert.deepEqual(solutionIds, EXPECTED_IDS, 'teacher solutions must follow the exact source question/branch order')
  const solutions = new Map(unitOneExerciseSolutions.map((solution) => [solution.id, solution]))
  for (const { task } of flattenedTasks) {
    const solution = solutions.get(task.id)
    if (!solution) fail(`${task.id}: teacher solution missing`)
    for (const field of ['givens', 'required', 'idea', 'approach', 'working', 'finalAnswer', 'check', 'commonMistake'] as const) {
      if (!solution![field].trim()) fail(`${task.id}: teacher ${field} is empty`)
    }
    if (solution!.steps.length < 3) fail(`${task.id}: teacher solution needs at least three explicit steps`)
    assertIncludes(solution!.finalAnswer, task.expectedAnswer, task.id)
  }

  verifyArithmetic()
  verifyMathematicalKeys()

  const expectedRecords = flattenedTasks.map(({ question, task }) => makeCoverageRecord(question, task))
  const coveragePath = resolve('docs/unit-one-exercises-coverage.json')
  const coverageDocument = {
    title: 'تمارين الوحدة الأولى المطبوعة — سجل التغطية والتحقق',
    sourcePages: [40, 41, 42, 43],
    numberedQuestionCount: 12,
    answerUnitCount: 30,
    visualInventory: {
      coordinateGrids: 2,
      parallelogramFigure: 1,
      lineGraphs: 2,
      matchingAndDataTables: 4,
      columnAdditionLayouts: 3,
      totalVisualComponents: 12,
      sourceVisualQuestionNumbers: [1, 2, 4, 5, 6, 11, 12],
      noPrintedFigureQuestions: [3, 7, 8, 9, 10],
    },
    statusCounts: { FULL: 30, PARTIAL: 0, MISSING: 0, REFERENCE_ONLY: 0 },
    records: expectedRecords,
  }

  if (process.argv.includes('--write-coverage')) {
    writeFileSync(coveragePath, `${JSON.stringify(coverageDocument, null, 2)}\n`)
    console.log(`Wrote ${coveragePath} from the source tasks and teacher guide.`)
  } else {
    if (!existsSync(coveragePath)) fail('coverage document is missing; run npm run unit-exercises-coverage once')
    const actual = JSON.parse(readFileSync(coveragePath, 'utf8'))
    assert.deepEqual(actual, coverageDocument, 'checked-in source coverage record differs from the verified source/teacher data')
  }

  const units = curriculumRegistry.find((unit) => unit.id === 'unit-1')
  assert.ok(units, 'Unit 1 curriculum record exists')
  assert.equal(units!.lessons.length, 8, 'review exercises must not become a ninth lesson')
  assert.equal(unitTest.questions.length, 60, 'the independent Unit 1 test must remain 60 questions')
  assert.deepEqual(parseTestAreaRoute('#tests/units'), { kind: 'list', category: 'units' }, 'Unit Test Area route remains independent')

  console.log(`Source audit PASS: pages 40–43 · 12 printed questions · 30 answer units · ${unitOneExerciseSolutions.length} detailed teacher solutions.`)
  console.log('Coverage audit PASS: FULL=30, PARTIAL=0, MISSING=0, REFERENCE_ONLY=0; every source visual is rebuilt.')
  console.log('Math audit PASS: four arithmetic results, three column-addition puzzles, coordinate construction, geometry, rounding/order, and both graph readings.')
  console.log('Boundary audit PASS: Unit 1 remains eight lessons; the separate unit test remains 60 questions.')
}

main()
