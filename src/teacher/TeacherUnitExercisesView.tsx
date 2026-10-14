import { BookOpenCheck } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { unitOneBookExercises, type UnitOneBookExercise, type UnitOneExerciseTask } from '../exercises/unitOneExercisesData'
import { unitOneExerciseSolutions, type DetailedTeacherExerciseSolution } from './unitOneExercises'

const solutionById = new Map<string, DetailedTeacherExerciseSolution>(unitOneExerciseSolutions.map((solution) => [solution.id, solution]))

function TeacherSolutionCard({
  question,
  task,
  solution,
}: {
  question: UnitOneBookExercise
  task: UnitOneExerciseTask
  solution: DetailedTeacherExerciseSolution
}) {
  const sourceItem = task.branch
    ? `السؤال ${question.number} · الفرع (${task.branch})`
    : `السؤال ${question.number} · ${task.referenceLabel ?? task.sourceText}`
  return <article className="teacher-entry teacher-exercise-solution" id={`teacher-solution-${task.id}`}>
    <div className="teacher-entry-meta">
      <span className="source-label">{sourceItem}</span>
      <span className="book-source"><span aria-hidden="true">📖</span> المصدر: الكتاب — ص {question.page}</span>
      <span className="platform-source">حل نموذجي تفصيلي</span>
    </div>
    <h2>{sourceItem}</h2>
    <p><strong>نص السؤال المطبوع:</strong> <BidiText>{question.originalPrompt}</BidiText></p>
    {question.sourceContext && <p><strong>السياق المطبوع:</strong> <BidiText>{question.sourceContext}</BidiText></p>}
    <p><strong>الفرع أو العنصر المرتبط:</strong> <BidiText>{task.sourceText}</BidiText></p>
    <div className="teacher-exercise-solution-field"><h3>المعطيات</h3><p><BidiText>{solution.givens}</BidiText></p></div>
    <div className="teacher-exercise-solution-field"><h3>المطلوب</h3><p><BidiText>{solution.required}</BidiText></p></div>
    <div className="teacher-exercise-solution-field"><h3>الفكرة الرياضية ولماذا تنطبق</h3><p><BidiText>{solution.idea}</BidiText></p></div>
    <div className="teacher-exercise-solution-field"><h3>كيف نبدأ التفكير؟</h3><p><BidiText>{solution.approach}</BidiText></p></div>
    <div className="teacher-exercise-solution-field"><h3>الحل خطوةً خطوةً مع التعليل</h3><ol>{solution.steps.map((step, index) => <li key={`${task.id}-step-${index}`}><BidiText>{step}</BidiText></li>)}</ol></div>
    <div className="teacher-exercise-calculation"><h3>الحسابات أو الإنشاء كاملاً</h3><p><BidiText>{solution.working}</BidiText></p></div>
    <div className="teacher-exercise-final-answer"><h3>الإجابة النهائية</h3><p><BidiText>{solution.finalAnswer}</BidiText></p></div>
    <div className="teacher-exercise-solution-field"><h3>التحقق</h3><p><BidiText>{solution.check}</BidiText></p></div>
    <aside className="teacher-note"><strong>خطأ شائع وكيف نتجنبه:</strong> <BidiText>{solution.commonMistake}</BidiText></aside>
  </article>
}

export function TeacherUnitExercisesView() {
  const answerUnits = unitOneBookExercises.reduce((total, question) => total + question.tasks.length, 0)
  return <section className="teacher-area teacher-unit-exercises-area" aria-labelledby="teacher-unit-exercises-title">
    <div className="teacher-heading">
      <BookOpenCheck size={28} aria-hidden="true" />
      <div>
        <span className="section-kicker">منطقة المدرّس · دليل مستقل</span>
        <h1 id="teacher-unit-exercises-title">حلول تمارين الوحدة الأولى</h1>
        <p>دليل حلول منفصل لتمارين الكتاب في الصفحات 40–43؛ {answerUnits} وحدة إجابة، مرتبة بحسب السؤال والفرع الأصلي.</p>
      </div>
    </div>
    <aside className="teacher-unit-exercises-note"><strong>حدود القسم:</strong> هذا الدليل خاص بمراجعة تمارين الكتاب، ولا يدمج أسئلتها أو حلولها في اختبار الوحدة أو منطقة حلول الاختبارات.</aside>
    <div className="teacher-entries">
      {unitOneBookExercises.flatMap((question) => question.tasks.map((task) => {
        const solution = solutionById.get(task.id)
        return solution ? <TeacherSolutionCard key={task.id} question={question} task={task} solution={solution} /> : null
      }))}
    </div>
  </section>
}
