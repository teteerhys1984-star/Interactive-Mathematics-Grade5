import { useState, type ReactNode } from 'react'
import { Calculator, Check, Lightbulb, Search, Sparkles, Target, TriangleAlert } from 'lucide-react'
import { MathExpression } from '../components/MathExpression'
import { BidiText } from '../components/BidiText'
import { LessonShell } from '../components/lesson/LessonShell'
import { SourceCard } from '../components/lesson/SourceCard'
import type { LessonStep } from '../components/lesson/types'
import {
  evaluateFinalQuestion3,
  finalAssessment3,
  isLessonThreeAnswerCorrect,
  normalizeLessonThreeDigits,
  normalizeLessonThreeNumberInput,
} from '../teacher/lesson3'

const PLACE_NAMES = [
  'الملايين',
  'مئات الألوف',
  'عشرات الألوف',
  'آحاد الألوف',
  'المئات',
  'العشرات',
  'الآحاد',
] as const

const fmt = (value: number): string => value.toLocaleString('en-US')

function Guided({
  id,
  prompt,
  answer,
  acceptedAnswers,
  hint,
  solutionSteps,
  placeholder = 'اكتب إجابتك هنا',
}: {
  id: string
  prompt: ReactNode
  answer: string
  acceptedAnswers?: readonly string[]
  hint: string
  solutionSteps?: readonly string[]
  placeholder?: string
}) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [emptyNotice, setEmptyNotice] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const targets = acceptedAnswers?.length ? acceptedAnswers : [answer]
  const ok = targets.some(target => isLessonThreeAnswerCorrect(value, target))

  return (
    <div className="self-check">
      <label className="test-question" style={{ borderTop: 0, paddingTop: 0 }}>
        <strong>{prompt}</strong>
        <div className="answer-row" style={{ justifyContent: 'flex-start', margin: '10px 0' }}>
          <input
            aria-label={id}
            value={value}
            placeholder={placeholder}
            style={{ width: 'min(100%, 240px)' }}
            onChange={e => {
              const nextValue = e.target.value
              setValue(nextValue)
              setChecked(false)
              setEmptyNotice(false)
              setShowSolution(false)
              if (!nextValue.trim()) {
                setHasAttempted(false)
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (!value.trim()) {
                setChecked(false)
                setEmptyNotice(true)
                return
              }
              setEmptyNotice(false)
              setChecked(true)
              setHasAttempted(true)
            }}
          >
            تحقق
          </button>
        </div>
      </label>
      {emptyNotice && <p className="gentle-feedback">اكتب إجابتك أولاً ثم اضغط «تحقق».</p>}
      {checked && (
        <p className={ok ? 'gentle-feedback good' : 'gentle-feedback'}>
          {ok ? 'أحسنت! إجابة صحيحة. راجع الخانات من اليمين وتأكد بالجمع العكسي.' : hint}
        </p>
      )}
      {solutionSteps && solutionSteps.length > 0 && (
        <>
          <button
            type="button"
            className="reveal-button"
            style={{ margin: '8px 0 0' }}
            disabled={!hasAttempted}
            onClick={() => {
              if (!hasAttempted) return
              setShowSolution(s => !s)
            }}
          >
            {hasAttempted && showSolution ? 'إخفاء خطوات الحل' : 'إظهار خطوات الحل بعد المحاولة'}
          </button>
          {hasAttempted && showSolution && (
            <div className="explanation-box" style={{ display: 'block', marginTop: 10 }}>
              <ol className="reveal-list" style={{ marginTop: 0 }}>
                {solutionSteps.map((stepText, idx) => (
                  <li key={idx}>
                    <BidiText>{stepText}</BidiText>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ChoiceTask({
  id,
  prompt,
  options,
  correctOption,
  correctExplanation,
  wrongHint,
  onSelectOption,
}: {
  id: string
  prompt: ReactNode
  options: readonly string[]
  correctOption: string
  correctExplanation: string
  wrongHint: string
  onSelectOption?: (option: string) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === correctOption

  return (
    <div className="reading-task" data-task-id={id} style={{ marginBottom: 12 }}>
      <strong>{prompt}</strong>
      <div className="choice-list" style={{ margin: '12px 0' }}>
        {options.map(option => (
          <button
            type="button"
            key={option}
            className={selected === option ? 'selected-choice' : ''}
            onClick={() => {
              setSelected(option)
              onSelectOption?.(option)
            }}
          >
            <BidiText>{option}</BidiText>
          </button>
        ))}
      </div>
      {selected && (
        <div className={isCorrect ? 'gentle-feedback good' : 'gentle-feedback'} style={{ marginTop: 8 }}>
          <BidiText>{isCorrect ? correctExplanation : wrongHint}</BidiText>
        </div>
      )}
    </div>
  )
}

function PlaceTable({
  digits = ['2', '4', '1', '3', '1', '5', '5'],
  values = ['2,000,000', '400,000', '10,000', '3,000', '100', '50', '5'],
}: {
  digits?: readonly string[]
  values?: readonly string[]
}) {
  return (
    <div className="book-table-wrap">
      <table className="book-table">
        <thead>
          <tr>
            <th className="row-label">الحلقة</th>
            <th>حلقة الملايين</th>
            <th colSpan={3}>حلقة الألوف</th>
            <th colSpan={3}>حلقة الوحدات</th>
          </tr>
          <tr>
            <th className="row-label">الخانة</th>
            {PLACE_NAMES.map(place => (
              <th key={place}>{place}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="row-label">الرقم</td>
            {digits.map((digit, i) => (
              <td key={i}>
                <MathExpression>{digit}</MathExpression>
              </td>
            ))}
          </tr>
          <tr>
            <td className="row-label">قيمة الرقم</td>
            {values.map((val, i) => (
              <td key={i}>
                <MathExpression>{val}</MathExpression>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function Intro() {
  return (
    <div className="lesson-intro">
      <div className="lesson-hero-icon">
        <Calculator size={30} />
      </div>
      <div className="lesson-goals">
        <strong>سنتعلّم</strong>
        <span>✓ قراءة وكتابة أعداد بالملايين بالصيغ القياسية واللفظية والتفصيلية</span>
        <span>✓ التمييز بين اسم المنزلة وقيمة الرقم في العدد</span>
        <span>✓ التعامل مع الصفر الحافظ للخانة</span>
      </div>
      <SourceCard label="من الكتاب — ص 10">
        <p>
          عند طباعة العملات الورقية يُعطى لكل ورقة نقدية نمرة (عدد) خاصة بها، وتلك النمرة لا تتكرر أبداً على أي ورقة
          نقدية أخرى. فعلى الورقة النقدية من فئة <MathExpression>500</MathExpression> ليرة سورية تظهر النمرة{' '}
          <MathExpression>2,413,155</MathExpression>.
        </p>
      </SourceCard>
      <div className="support-tip">
        <Lightbulb size={20} />
        <span>
          <strong>فكرة البداية:</strong> العدد ليس مجرد أرقام متجاورة؛ مكان الرقم هو الذي يحدد قيمته. فالرقم{' '}
          <MathExpression>5</MathExpression> في الآحاد يساوي <MathExpression>5</MathExpression>، وفي العشرات يساوي{' '}
          <MathExpression>50</MathExpression>، وفي الملايين يساوي <MathExpression>5,000,000</MathExpression>.
        </span>
      </div>
    </div>
  )
}

function Explore() {
  return (
    <div>
      <div className="step-banner">
        <Sparkles size={20} />
        <span>انطلاقة نشطة — جرّب قبل القاعدة</span>
      </div>
      <SourceCard label="من الكتاب — ص 10 · انطلاقة نشطة">
        <p>اختر الإجابة الصحيحة في كل مما يأتي:</p>
        <div className="reading-tasks">
          <ChoiceTask
            id="nn-p10-intro-a"
            prompt={
              <>
                أ) الصيغة اللفظية للعدد <MathExpression>4,000</MathExpression> هي:
              </>
            }
            options={['أربعة آلاف', 'أربعمئة', 'أربعون ألفاً']}
            correctOption="أربعة آلاف"
            correctExplanation="صحيح! الرقم 4 يقع في خانة آحاد الألوف وأمامه ثلاثة أصفار، فيُقرأ «أربعة آلاف»."
            wrongHint="انتبه إلى عدد الأصفار الثلاثة على يمين الرقم 4: ثلاثة أصفار تعني خانة آحاد الألوف."
          />
          <ChoiceTask
            id="nn-p10-intro-b"
            prompt="ب) الصيغة العددية للعدد «ثلاثة آلاف وستمئة وخمسة وخمسون» تُكتب:"
            options={['6,355', '5,563', '3,655']}
            correctOption="3,655"
            correctExplanation="صحيح! 3 في الألوف، و6 في المئات، و5 في العشرات، و5 في الآحاد تُعطي 3,655."
            wrongHint="ابدأ بتعيين كل منزلة: كم في الألوف؟ وكم في المئات؟ وكم في العشرات والآحاد؟"
          />
          <ChoiceTask
            id="nn-p10-intro-c"
            prompt={
              <>
                ج) الصيغة <MathExpression>7,000 + 400 + 2</MathExpression> هي صيغة تفصيلية للعدد:
              </>
            }
            options={['7,402', '742', '3,655']}
            correctOption="7,402"
            correctExplanation="صحيح! 7 في الألوف، و4 في المئات، و0 في العشرات لحفظ المنزلة، و2 في الآحاد = 7,402."
            wrongHint="لاحظ غياب حد العشرات بين 400 و2؛ يجب وضع صفر في خانة العشرات لحفظ موضعها."
          />
        </div>
      </SourceCard>
      <SourceCard label="من الكتاب — ص 10">
        <p>
          العدد <MathExpression>2,413,155</MathExpression> يُجزّأ إلى ثلاث حلقات من اليمين:{' '}
          <MathExpression>2 | 413 | 155</MathExpression>، ويُقرأ: مليونان وأربعمئة وثلاثة عشر ألفاً ومئة وخمسة وخمسون.
        </p>
        <Guided
          id="nn-p10-place"
          prompt="ما قيمة الرقم 4 في العدد 2,413,155؟"
          answer="400000"
          hint="الرقم 4 يقع في خانة مئات الألوف داخل حلقة الألوف (أمامه 5 خانات)."
          solutionSteps={[
            'نجزّئ العدد من اليمين: 155 (حلقة الوحدات)، 413 (حلقة الألوف)، 2 (حلقة الملايين).',
            'الرقم 4 يقع في خانة مئات الألوف، وقيمة الخانة 100,000.',
            'إذن قيمة الرقم 4 هي: 4 × 100,000 = 400,000.',
          ]}
        />
      </SourceCard>
    </div>
  )
}

function Concept() {
  return (
    <div>
      <SourceCard label="تعلّم — ص 10 و11">
        <p>
          يمكننا أن نقرأ العدد بتجزئته إلى <strong>حلقات (مجموعات)</strong>، كل حلقة مؤلفة من ثلاث خانات (كل خانة لها
          قيمة)، وهذه الحلقات بدءاً من اليمين هي: <strong>حلقة الوحدات</strong>، ثم <strong>حلقة الألوف</strong>، ثم{' '}
          <strong>حلقة الملايين</strong>.
        </p>
        <PlaceTable />
        <div className="concept-flow">
          <div className="concept-row">
            <span className="concept-q">الصيغة القياسية</span>
            <span className="concept-a">
              كتابة العدد بالأرقام مع حفظ مواضع الخانات: <MathExpression>2,413,155</MathExpression>.
            </span>
          </div>
          <div className="concept-row">
            <span className="concept-q">الصيغة اللفظية</span>
            <span className="concept-a">
              قراءة الحلقات من اليسار إلى اليمين بالكلمات: <strong>مليونان وأربعمئة وثلاثة عشر ألفاً ومئة وخمسة وخمسون</strong>.
            </span>
          </div>
          <div className="concept-row">
            <span className="concept-q">الصيغة التفصيلية</span>
            <span className="concept-a">
              كتابة العدد كمجموع لقيم منازله غير الصفرية:{' '}
              <MathExpression>2,000,000 + 400,000 + 10,000 + 3,000 + 100 + 50 + 5</MathExpression>.
            </span>
          </div>
        </div>
      </SourceCard>
      <div className="support-tip">
        <Target size={20} />
        <span>
          <strong>طريقة تفكير ثابتة:</strong> ابدأ من اليمين لتقسيم العدد كل ثلاث خانات، ثم اقرأ من اليسار: الملايين
          أولاً، ثم الألوف، ثم الوحدات، وبعد التحليل اجمع القيم للتحقق.
        </span>
      </div>
    </div>
  )
}

function Examples() {
  return (
    <div>
      <SourceCard label="قراءة العدد وتفكيكه بالحلقات — ص 11">
        <p>
          العدد <MathExpression>2,413,155</MathExpression> يدل على نمرة الورقة النقدية وهو مكتوب بالصيغة العددية
          (القياسية). نقرؤه من اليسار باستعمال الحلقات: <MathExpression>2 | 413 | 155</MathExpression> (أي{' '}
          <MathExpression>2</MathExpression> مليوناً و<MathExpression>413</MathExpression> ألفاً و
          <MathExpression>155</MathExpression>)، فيُقرأ بالصيغة اللفظية:{' '}
          <strong>مليونان وأربعمئة وثلاثة عشر ألفاً ومئة وخمسة وخمسون</strong>.
        </p>
        <p>
          ونكتبه بالصيغة التفصيلية:{' '}
          <MathExpression>2,000,000 + 400,000 + 10,000 + 3,000 + 100 + 50 + 5</MathExpression>.
        </p>
      </SourceCard>
      <SourceCard label="مثال محلول — ص 11">
        <p>
          <strong>المطلوب:</strong> اكتب العدد «مليونين وستمائة وخمسة آلاف ومئة وثلاث وسبعين» بالصيغة العددية.
        </p>
        <ol className="reveal-list">
          <li>
            نحدد كل حلقة من العبارة اللفظية: <MathExpression>2</MathExpression> مليوناً، و
            <MathExpression>605</MathExpression> آلاف، و<MathExpression>173</MathExpression> في الوحدات.
          </li>
          <li>
            نضع كل رقم في خانته داخل جدول الخانات (مع الصفر في عشرات الألوف داخل <MathExpression>605</MathExpression>).
          </li>
          <li>
            نكتب الصيغة العددية (القياسية): <MathExpression>2,605,173</MathExpression>.
          </li>
        </ol>
      </SourceCard>
      <SourceCard label="الصفر في خانة — ص 11 و12">
        <p>
          إذا وُجد الصفر في إحدى الخانات فإن قيمته تساوي صفراً؛ ففي العدد <MathExpression>1,206,079</MathExpression>{' '}
          تقع الأصفار في خانتي عشرات الألوف والمئات.
        </p>
        <PlaceTable
          digits={['1', '2', '0', '6', '0', '7', '9']}
          values={['1,000,000', '200,000', '0', '6,000', '0', '70', '9']}
        />
        <p>
          لذا لا نكتب قيمة الخانة الصفرية حداً في الصيغة التفصيلية:{' '}
          <MathExpression>1,206,079 = 1,000,000 + 200,000 + 6,000 + 70 + 9</MathExpression>، ويُقرأ بالصيغة اللفظية:{' '}
          <strong>مليون ومئتان وستة آلاف وتسعة وسبعون</strong>.
        </p>
      </SourceCard>
      <div className="common-mistakes">
        <h3>خطأ شائع</h3>
        <p>
          كتابة <MathExpression>1,206,079</MathExpression> على صورة <MathExpression>12,679</MathExpression> بحذف الصفرين
          من وسط العدد. الصفر يحفظ موقع الخانة في الصيغة القياسية، ونستغني عنه فقط عند كتابة حدود الجمع في الصيغة
          التفصيلية.
        </p>
      </div>
    </div>
  )
}

function Practice() {
  return (
    <div>
      <div className="step-banner">
        <Check size={20} />
        <span>تحقق من فهمك — ص 12</span>
      </div>
      <SourceCard label="السؤال 1 — ص 12">
        <ChoiceTask
          id="nn-p12-q1"
          prompt={
            <>
              من الذي كتب الصيغة اللفظية للعدد <MathExpression>20,200,002</MathExpression> بشكل صحيح؟
            </>
          }
          options={[
            'لميس: عشرون مليوناً ومئتان واثنان',
            'علاء: عشرون مليونًا ومئتا ألف واثنان',
            'زيد: 20 مليوناً ومئتان واثنان',
          ]}
          correctOption="علاء: عشرون مليونًا ومئتا ألف واثنان"
          correctExplanation="أحسنت! إجابة علاء «عشرون مليونًا ومئتا ألف واثنان» هي الصحيحة لأن 20 في حلقة الملايين، و200 في حلقة الألوف (مئتا ألف)، و002 في حلقة الوحدات (اثنان)."
          wrongHint="جزّئ العدد 20,200,002 إلى حلقات: 20 | 200 | 002. المجموعة الوسطى 200 تقع في حلقة الألوف، فلا يجوز إغفال كلمة «ألف»."
        />
      </SourceCard>
      <SourceCard label="السؤال 2 — ص 12">
        <Guided
          id="nn-p12-word"
          prompt={
            <>
              ما العدد الناقص في الصيغة التفصيلية:{' '}
              <MathExpression>2,340,801 = 2,000,000 + ..... + 40,000 + 800 + 1</MathExpression>؟ (ما قيمة الرقم 3 في
              العدد <MathExpression>2,340,801</MathExpression>؟)
            </>
          }
          answer="300000"
          hint="الرقم 3 يقع في خانة مئات الألوف، فقيمته 3 × 100,000."
          solutionSteps={[
            'نقارن العدد 2,340,801 بالحدود الموجودة: 2,000,000 (الملايين)، 40,000 (عشرات الألوف)، 800 (المئات)، 1 (الآحاد).',
            'الرقم الذي لم يُكتب حدّه هو 3 في خانة مئات الألوف.',
            'قيمة الرقم 3 هي 300,000، فتصبح الصيغة الكاملة: 2,000,000 + 300,000 + 40,000 + 800 + 1.',
          ]}
        />
      </SourceCard>
      <SourceCard label="السؤال 3 — ص 12">
        <p>
          حوّل العبارة اللفظية إلى عدد قياسي ثم أعد كتابتها باستعمال جدول الخانات والصيغة التفصيلية: املأ الخانات من
          اليمين (الآحاد، العشرات، المئات، آحاد الألوف، عشرات الألوف، مئات الألوف، الملايين).
        </p>
        <Guided
          id="nn-p12-q3-standard"
          prompt="أ) اكتب العدد (سبعة ملايين وخمسمئة وسبعة وخمسون ألفاً واثنان) بالصيغة العددية:"
          answer="7557002"
          hint="ضع 7 في الملايين، و557 في حلقة الألوف، و002 في حلقة الوحدات (احفظ خانتي المئات والعشرات بصفرين)."
          solutionSteps={[
            'حلقة الملايين: 7.',
            'حلقة الألوف: 557 (خمسمئة وسبعة وخمسون ألفاً).',
            'حلقة الوحدات: 002 (اثنان في الآحاد وصفران في المئات والعشرات).',
            'الصيغة العددية: 7,557,002، والصيغة التفصيلية: 7,000,000 + 500,000 + 50,000 + 7,000 + 2.',
          ]}
        />
      </SourceCard>
    </div>
  )
}

function Applications() {
  return (
    <div>
      <SourceCard label="تدرّب 1 و2 — ص 12">
        <p>تدرب على التحويل بين الصيغتين اللفظية والعددية مع الانتباه للأصفار الحافظة للخانات:</p>
        <ChoiceTask
          id="nn-p12-drill1-d"
          prompt={
            <>
              تدرّب (1-د): ما الصيغة اللفظية الصحيحة للعدد <MathExpression>5,500,005</MathExpression>؟
            </>
          }
          options={[
            'خمسة ملايين وخمسمئة ألف وخمسة',
            'خمسة ملايين وخمسمئة وخمسة',
            'خمسة وخمسون مليوناً وخمسة',
          ]}
          correctOption="خمسة ملايين وخمسمئة ألف وخمسة"
          correctExplanation="صحيح! 5 في الملايين، و500 في حلقة الألوف (خمسمئة ألف)، و005 في الوحدات (خمسة)."
          wrongHint="انظر إلى الحلقات الثلاث: 5 | 500 | 005؛ الحلقة الوسطى هي 500 في الألوف."
        />
        <Guided
          id="nn-p12-drill2-c"
          prompt="تدرّب (2-ج): اكتب العدد «خمسة ملايين وسبعة» بالصيغة العددية:"
          answer="5000007"
          hint="حلقة الألوف خالية بالكامل (000)، وفي حلقة الوحدات 7 في الآحاد مع صفرين في المئات والعشرات (007)."
          solutionSteps={[
            'نضع 5 في خانة الملايين.',
            'نحفظ حلقة الألوف بثلاثة أصفار (000).',
            'نكتب 007 في حلقة الوحدات، فنحصل على 5,000,007.',
          ]}
        />
      </SourceCard>
      <SourceCard label="التمارين 3 و4 — ص 13">
        <p>
          <strong>التمرين 3:</strong> أودع مازن في المصرف مبلغ <MathExpression>4,500,000</MathExpression> ليرة سورية،
          وأودع فؤاد مبلغ <MathExpression>3,569,700</MathExpression> ليرة سورية.
        </p>
        <ChoiceTask
          id="nn-p13-ex3"
          prompt="عبّر عن المبلغ الذي أودعه كلٌّ من مازن وفؤاد لفظياً:"
          options={[
            'مازن: أربعة ملايين وخمسمئة ألف ليرة؛ فؤاد: ثلاثة ملايين وخمسمئة وتسعة وستون ألفاً وسبعمئة ليرة',
            'مازن: أربعمئة وخمسون ألف ليرة؛ فؤاد: ثلاثة ملايين وسبعمئة ألف ليرة',
            'مازن: أربعة ملايين وخمسون ألف ليرة؛ فؤاد: خمسة وثلاثون مليوناً وسبعمئة ليرة',
          ]}
          correctOption="مازن: أربعة ملايين وخمسمئة ألف ليرة؛ فؤاد: ثلاثة ملايين وخمسمئة وتسعة وستون ألفاً وسبعمئة ليرة"
          correctExplanation="أحسنت! 4,500,000 هي أربعة ملايين وخمسمئة ألف ليرة سورية، و3,569,700 هي ثلاثة ملايين وخمسمئة وتسعة وستون ألفاً وسبعمئة ليرة سورية."
          wrongHint="جزّئ كل مبلغ إلى ثلاث حلقات: 4 | 500 | 000 لمازن، و3 | 569 | 700 لفؤاد."
        />
        <Guided
          id="nn-p13-ex4"
          prompt="التمرين 4: يبلغ نصف قطر الكرة الأرضية ستة ملايين وثلاثمئة وثمانين ألف متر تقريباً. اكتب هذا العدد بالصيغة القياسية:"
          answer="6380000"
          hint="ضع 6 في الملايين، و380 في حلقة الألوف، و000 في حلقة الوحدات."
          solutionSteps={[
            'حلقة الملايين: 6 (ستة ملايين).',
            'حلقة الألوف: 380 (ثلاثمئة وثمانون ألفاً) — وانتبه لعدم الخلط بينها وبين 308 (ثلاثمئة وثمانية آلاف = 6,308,000).',
            'حلقة الوحدات: 000، فيُكتب العدد قياسياً: 6,380,000 م.',
          ]}
        />
      </SourceCard>
      <SourceCard label="التمرين 5 — ص 13">
        <p>استعمل جدول الخانات لتحديد عدد الأصفار والكتابة القياسية:</p>
        <Guided
          id="nn-p13-ex5-millions"
          prompt="كم صفراً في الكتابة القياسية للعدد مليونين؟"
          answer="6"
          hint="المليون الواحد أمامه 6 أصفار (ثلاثة في حلقة الألوف وثلاثة في حلقة الوحدات)."
          solutionSteps={[
            '1) سبعون ألفاً = 70,000 وفيه 4 أصفار.',
            '2) مليونان = 2,000,000 وفيه 6 أصفار.',
            '3) أربعمئة ألف = 400,000 وفيه 5 أصفار.',
          ]}
        />
      </SourceCard>
      <SourceCard label="التمرين 6 — ص 13">
        <p>اكتب العدد الناقص في كل مما يأتي:</p>
        <Guided
          id="nn-p13-ex6-a"
          prompt={
            <>
              أ) <MathExpression>2,436,814 = 2,000,000 + ......... + 30,000 + 6,000 + 800 + 10 + 4</MathExpression>
            </>
          }
          answer="400000"
          hint="انظر إلى الرقم 4 في العدد 2,436,814: إنه في خانة مئات الألوف."
          solutionSteps={[
            'الرقم 4 في 2,436,814 يقع في خانة مئات الألوف.',
            'قيمته المكانية هي 400,000.',
          ]}
        />
        <Guided
          id="nn-p13-ex6-b"
          prompt={
            <>
              ب) <MathExpression>1,060,505 = ......... + 60,000 + 500 + 5</MathExpression>
            </>
          }
          answer="1000000"
          hint="انظر إلى الرقم الأول من اليسار في 1,060,505: إنه 1 في خانة الملايين."
          solutionSteps={[
            'الرقم 1 في 1,060,505 يقع في خانة الملايين.',
            'قيمته المكانية هي 1,000,000.',
          ]}
        />
      </SourceCard>
    </div>
  )
}

function Interactive() {
  const [n, setN] = useState('5345600')
  const padded = n.padStart(7, '0').slice(-7)
  const digits = padded.split('')
  const numericValue = Number(n || 0)
  const nonZeroTerms = digits
    .map((d, i) => Number(d) * 10 ** (6 - i))
    .filter(val => val > 0)
    .map(fmt)

  return (
    <div className="interaction-card">
      <span className="section-kicker">نشاط من إعداد المنصة</span>
      <h3>ابنِ العدد من خاناته</h3>
      <p>
        غيّر رقماً بالنقر على خانته أو اكتب عدداً حتى سبع خانات، ثم راقب الحلقات الثلاث وقيمة كل منزلة والصيغة
        التفصيلية.
      </p>
      <input
        aria-label="العدد التفاعلي"
        className="number-builder-input"
        value={n}
        onChange={e =>
          setN(
            normalizeLessonThreeDigits(e.target.value)
              .replace(/[^0-9]/g, '')
              .slice(0, 7),
          )
        }
      />
      <div className="digit-builder">
        {digits.map((d, i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              const next = digits.slice()
              next[i] = String((Number(next[i]) + 1) % 10)
              setN(next.join(''))
            }}
          >
            <small>{PLACE_NAMES[i]}</small>
            <strong>{d}</strong>
            <span>
              <MathExpression>{fmt(Number(d) * 10 ** (6 - i))}</MathExpression>
            </span>
          </button>
        ))}
      </div>
      <div className="explanation-box" style={{ display: 'block' }}>
        <p style={{ margin: '0 0 6px' }}>
          <Sparkles size={18} style={{ verticalAlign: 'middle', marginLeft: 6 }} />
          <strong>العدد القياسي بالحلقات:</strong>{' '}
          <MathExpression>{`${padded.slice(0, 1)} | ${padded.slice(1, 4)} | ${padded.slice(4, 7)}`}</MathExpression> (
          <MathExpression>{fmt(numericValue)}</MathExpression>)
        </p>
        <p style={{ margin: 0 }}>
          <strong>الصيغة التفصيلية:</strong>{' '}
          <MathExpression>{nonZeroTerms.length > 0 ? nonZeroTerms.join(' + ') : '0'}</MathExpression>
        </p>
      </div>
    </div>
  )
}

function MorePractice() {
  return (
    <div>
      <SourceCard label="التمارين 7–9 — ص 13">
        <p>
          <strong>التمرين 7:</strong> جزّئ ورقة إلى ثلاثة أجزاء متساوية واكتب على جزء منها العدد{' '}
          <MathExpression>5,345,600</MathExpression>، ثم اكتبه بطريقتين مختلفتين (اللفظية والتفصيلية).
        </p>
        <ChoiceTask
          id="nn-p13-ex7"
          prompt={
            <>
              أي عبارة تجمع الصيغتين اللفظية والتفصيلية الصحيحتين للعدد <MathExpression>5,345,600</MathExpression>؟
            </>
          }
          options={[
            'خمسة ملايين وثلاثمئة وخمسة وأربعون ألفاً وستمئة = 5,000,000 + 300,000 + 40,000 + 5,000 + 600',
            'خمسة ملايين وثلاثمئة وخمسة وأربعون وستمئة = 5,000,000 + 30,000 + 4,000 + 500 + 60',
            'ثلاثة وخمسون مليوناً وأربعمئة وخمسة وستون ألفاً = 50,000,000 + 3,000,000 + 400,000 + 5,000 + 600',
          ]}
          correctOption="خمسة ملايين وثلاثمئة وخمسة وأربعون ألفاً وستمئة = 5,000,000 + 300,000 + 40,000 + 5,000 + 600"
          correctExplanation="أحسنت! الحلقات هي 5 | 345 | 600، وتفصيلها 5,000,000 + 300,000 + 40,000 + 5,000 + 600."
          wrongHint="قسّم 5,345,600 إلى ثلاث حلقات: 5 في الملايين، و345 في الألوف، و600 في الوحدات."
        />
        <Guided
          id="nn-p13-ex8"
          prompt="التمرين 8: سحب دوري لليانصيب جائزته الكبرى ثلاثة ملايين ليرة سورية. اكتب العدد بالصيغة العددية:"
          answer="3000000"
          hint="ثلاثة في خانة الملايين وأمامها ستة أصفار لحفظ حلقتي الألوف والوحدات."
          solutionSteps={['نضع 3 في خانة الملايين و000 في الألوف و000 في الوحدات: 3,000,000.']}
        />
        <Guided
          id="nn-p13-ex9"
          prompt="التمرين 9: تبلغ المسافة بين كوكب الأرض والقمر ثلاثمئة وأربعة وثمانين ألف كيلومتر. اكتب العدد بالصيغة القياسية:"
          answer="384000"
          hint="ضع 384 في حلقة الألوف و000 في حلقة الوحدات."
          solutionSteps={['حلقة الألوف: 384، وحلقة الوحدات: 000، إذن المسافة = 384,000 كم.']}
        />
      </SourceCard>
      <SourceCard label="التمرينان 10 و12 — ص 14">
        <ChoiceTask
          id="nn-p14-ex10"
          prompt={
            <>
              التمرين 10: سعر السيارة <MathExpression>6,849,500</MathExpression> ليرة. ما صيغته اللفظية الصحيحة؟
            </>
          }
          options={[
            'ستة ملايين وثمانمئة وتسعة وأربعون ألفاً وخمسمئة',
            'ستة ملايين وثمانمئة وتسعة وأربعون وخمسمئة ألف',
            'ستون مليوناً وثمانمئة وتسعة وأربعون ألفاً وخمسون',
          ]}
          correctOption="ستة ملايين وثمانمئة وتسعة وأربعون ألفاً وخمسمئة"
          correctExplanation="صحيح! 6 في الملايين، و849 في حلقة الألوف، و500 في حلقة الوحدات."
          wrongHint="جزّئ العدد: 6 | 849 | 500، ثم اقرأ من اليسار إلى اليمين."
        />
        <ChoiceTask
          id="nn-p14-ex12"
          prompt={
            <>
              التمرين 12: اشترت عبير منزلاً وكتبت على الشيك <MathExpression>5,600,000</MathExpression> ليرة سورية بالأرقام
              فقط دون كتابة المبلغ بالحروف. ما الخطأ الذي ارتكبته عبير وما الصيغة اللفظية الواجب كتابتها؟
            </>
          }
          options={[
            'تركت الصيغة اللفظية فارغة؛ ويجب كتابة: خمسة ملايين وستمئة ألف ليرة سورية',
            'كتبت أصفاراً زائدة؛ والصواب 560,000 ليرة سورية',
            'لا يلزم كتابة الصيغة اللفظية على الشيك التجاري',
          ]}
          correctOption="تركت الصيغة اللفظية فارغة؛ ويجب كتابة: خمسة ملايين وستمئة ألف ليرة سورية"
          correctExplanation="أحسنت! يجب في الشيك مطابقة الصيغة العددية (5,600,000) بالصيغة اللفظية: خمسة ملايين وستمئة ألف ليرة سورية."
          wrongHint="تذكّر قاعدة الشيك في التمرين 12: يجب أن يُكتب المبلغ بالصيغة العددية والصيغة اللفظية معاً."
        />
      </SourceCard>
      <SourceCard label="التمارين 13–15 — ص 14">
        <Guided
          id="nn-p14-ex13"
          prompt="التمرين 13: عدد من أربع خانات يقع الرقم 2 في المنزلتين الأكبر قيمة، ومجموع خانتي العشرات والآحاد 14. اكتب أحد الأعداد الممكنة:"
          answer="2259"
          acceptedAnswers={['2259', '2268', '2277', '2286', '2295']}
          hint="المنزلتان الأكبر قيمة في عدد من 4 خانات هما الألوف والمئات (22xy)؛ اختر رقمين للعشرات والآحاد مجموعهما 14 مثل 5 و9 أو 6 و8."
          solutionSteps={[
            'العدد من أربع خانات، فالمنزلتان الأكبر قيمة هما آحاد الألوف والمئات، نضع فيهما 2 و2.',
            'نبحث عن رقمين للعشرات والآحاد مجموعهما 14: (5 و9) أو (6 و8) أو (7 و7) أو (8 و6) أو (9 و5).',
            'الأعداد الصحيحة الممكنة هي: 2259، 2268، 2277، 2286، 2295.',
          ]}
        />
        <Guided
          id="nn-p14-ex14"
          prompt="التمرين 14: في كل رزمة 100 ورقة نقدية من فئة 500 ليرة سورية. كم ليرة سورية في 10 رزم؟"
          answer="500000"
          hint="احسب أولاً قيمة الرزمة الواحدة: 100 × 500 = 50,000 ليرة، ثم اضرب في 10 رزم."
          solutionSteps={[
            'قيمة الرزمة الواحدة = 100 × 500 = 50,000 ليرة سورية.',
            'قيمة 10 رزم = 10 × 50,000 = 500,000 ليرة سورية (وبالمقابل فإن 500,000 ل.س تعادل 10 رزم).',
          ]}
        />
        <Guided
          id="nn-p14-ex15"
          prompt="التمرين 15: أنا عدد بين 149,900 و150,000، آحادي عدد زوجي أكبر من 1 وعشراتي يزيد على آحادي بمقدار 7. فمن أنا؟"
          answer="149992"
          hint="العدد يبدأ بـ 149,9__؛ جرب عدداً زوجياً للآحاد أكبر من 1 بحيث لا يتجاوز (الآحاد + 7) الرقم 9."
          solutionSteps={[
            'بما أن العدد بين 149,900 و150,000 فهو من ست خانات على الصورة 149,9xy.',
            'آحاده زوجي أكبر من 1، والعشرات = الآحاد + 7 ≤ 9، فلا يصلح للآحاد إلا 2، وللعشرات 2 + 7 = 9.',
            'إذن العدد هو 149,992.',
          ]}
        />
      </SourceCard>
    </div>
  )
}

function Mistakes() {
  const [attemptedMurad, setAttemptedMurad] = useState(false)
  const [shown, setShown] = useState(false)
  return (
    <div className="mistake-spot">
      <div className="step-banner">
        <TriangleAlert size={20} />
        <span>اكتشف الخطأ وفكّر</span>
      </div>
      <SourceCard label="التمرين 11 — ص 14">
        <div className="mistake-scenario">
          <p>
            كتب مراد في دفتر واجباته العدد <MathExpression>5,305,707</MathExpression> بالصيغة اللفظية كما يأتي:{' '}
            <strong>«خمسة ملايين وثلاثمئة وخمسة آلاف وسبعمئة»</strong>. ما الخطأ الذي ارتكبه مراد؟
          </p>
          <ChoiceTask
            id="nn-p14-ex11-choice"
            prompt="حدد الخطأ في كتابة مراد قبل كشف التحليل الكامل:"
            options={[
              'أهمل رقم الآحاد 7 في حلقة الوحدات (707)، فكتب «وسبعمئة» بدلاً من «وسبعمئة وسبعة»',
              'قرأ حلقة الملايين بدل حلقة الألوف',
              'كتابة مراد صحيحة ولا ينقصها شيء',
            ]}
            correctOption="أهمل رقم الآحاد 7 في حلقة الوحدات (707)، فكتب «وسبعمئة» بدلاً من «وسبعمئة وسبعة»"
            correctExplanation="صحيح! حلقة الوحدات هي 707 وتُقرأ «سبعمئة وسبعة»."
            wrongHint="قارن آخر ثلاث خانات في 5,305,707 (وهي 707) بما كتبه مراد في نهاية العبارة."
            onSelectOption={() => setAttemptedMurad(true)}
          />
          <button
            type="button"
            className="reveal-button"
            disabled={!attemptedMurad}
            onClick={() => {
              if (!attemptedMurad) return
              setShown(s => !s)
            }}
          >
            <Search size={17} /> {attemptedMurad && shown ? 'إخفاء التحليل' : 'اكشف التحليل'}
          </button>
          {attemptedMurad && shown && (
            <div className="explanation-box">
              <Check size={18} />
              <span>
                أُهمل الرقم <MathExpression>7</MathExpression> في الآحاد. نقسم العدد إلى{' '}
                <MathExpression>5 | 305 | 707</MathExpression>، لذلك يجب أن نقول:{' '}
                <strong>خمسة ملايين وثلاثمئة وخمسة آلاف وسبعمئة وسبعة</strong>.
              </span>
            </div>
          )}
        </div>
      </SourceCard>
      <div className="interaction-card">
        <span className="section-kicker">نشاط من إعداد المنصة</span>
        <ChoiceTask
          id="nn-platform-mistake-zero"
          prompt={
            <>
              كتب طالب أن <MathExpression>4,008,050 = 4,000,000 + 80,000 + 50</MathExpression>. ما الخطأ الذي وقع فيه؟
            </>
          }
          options={[
            'وضع الرقم 8 في عشرات الألوف (80,000) مع أنه في آحاد الألوف (8,000)',
            'حذف قيمة العشرات 50',
            'قيمة الملايين يجب أن تكون 400,000',
          ]}
          correctOption="وضع الرقم 8 في عشرات الألوف (80,000) مع أنه في آحاد الألوف (8,000)"
          correctExplanation="أحسنت! في حلقة الألوف (008) يقع الرقم 8 في خانة آحاد الألوف فقيمته 8,000، والتفصيل الصحيح هو 4,000,000 + 8,000 + 50."
          wrongHint="انظر إلى حلقة الألوف 008: الصفران في مئات الألوف وعشرات الألوف يحفظان مكان الرقم 8 في آحاد الألوف."
        />
      </div>
    </div>
  )
}

function Recap() {
  return (
    <div className="recap-step">
      <h3>خلاصة الأعداد الطبيعية</h3>
      <ul>
        <li>نجزّئ العدد من اليمين إلى حلقات من ثلاث خانات: حلقة الوحدات، حلقة الألوف، حلقة الملايين.</li>
        <li>قيمة الرقم = الرقم × قيمة منزلته؛ لذلك تتغير قيمة الرقم بتغير الخانة التي يقع فيها.</li>
        <li>الصيغة التفصيلية تكتب العدد كمجموع لقيم المنازل غير الصفرية.</li>
        <li>الصفر يحفظ مكان الخانة في الصيغة القياسية، ولا يظهر كحد في الصيغة التفصيلية لأن قيمته صفر.</li>
        <li>نتحقق من الحل بمطابقة كل حلقة وإعادة جمع قيم المنازل.</li>
      </ul>
    </div>
  )
}

function Final() {
  const [a, setA] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const score = finalAssessment3.filter(q => evaluateFinalQuestion3(q, a[q.id] || '')).length

  return (
    <div className="final-test">
      <div className="step-banner">
        <Check size={20} />
        <span>اختبار ختامي جديد</span>
      </div>
      <p>
        أسئلة جديدة تقيس القراءة، القيمة المكانية، التحليل، اكتشاف الخطأ والتطبيق. يمكنك كتابة الأعداد بالأرقام العربية
        أو الهندية، مع فواصل الآلاف أو من دونها.
      </p>
      {finalAssessment3.map((q, i) => {
        const userVal = a[q.id] || ''
        const isCorrect = done ? evaluateFinalQuestion3(q, userVal) : false
        const formattedExpected =
          normalizeLessonThreeNumberInput(q.answer) !== null ? fmt(Number(q.answer)) : q.answer
        const QuestionContainer = q.type === 'input' ? 'label' : 'div'
        return (
          <QuestionContainer className="test-question" key={q.id}>
            <strong>
              {i + 1}. {q.text}
            </strong>
            {q.type === 'input' ? (
              <input
                value={userVal}
                onChange={e => {
                  setA({ ...a, [q.id]: e.target.value })
                  setDone(false)
                }}
              />
            ) : (
              <div className="choice-list">
                {q.options?.map(o => (
                  <button
                    type="button"
                    key={o}
                    className={userVal === o ? 'selected-choice' : ''}
                    onClick={() => {
                      setA({ ...a, [q.id]: o })
                      setDone(false)
                    }}
                  >
                    <BidiText>{o}</BidiText>
                  </button>
                ))}
              </div>
            )}
            {done && (
              <span className={isCorrect ? 'gentle-feedback good' : 'gentle-feedback'}>
                {isCorrect ? (
                  '✓ إجابة صحيحة.'
                ) : (
                  <>
                    ✗ راجع الحل؛ الإجابة الصحيحة: <BidiText>{formattedExpected}</BidiText>
                  </>
                )}
              </span>
            )}
          </QuestionContainer>
        )
      })}
      <button type="button" className="primary-button submit-test" onClick={() => setDone(true)}>
        عرض النتيجة
      </button>
      {done && (
        <div className="test-result">
          <strong>
            نتيجتك: {score} / {finalAssessment3.length}
          </strong>
          <p>راجع كل خانة أخطأت فيها، ثم أعد بناء العدد من اليمين إلى اليسار.</p>
        </div>
      )}
    </div>
  )
}

export function NaturalNumbersLesson() {
  const steps: LessonStep[] = [
    { id: 'intro', title: 'انطلاقة الدرس', content: <Intro /> },
    { id: 'explore', title: 'انطلاقة نشطة', content: <Explore /> },
    { id: 'concept', title: 'الفكرة الأساسية', content: <Concept /> },
    { id: 'examples', title: 'أمثلة الكتاب', content: <Examples /> },
    { id: 'practice', title: 'تحقق من فهمك', content: <Practice /> },
    { id: 'applications', title: 'تمارين الكتاب', content: <Applications /> },
    { id: 'interactive', title: 'ابنِ العدد', content: <Interactive /> },
    { id: 'more', title: 'تطبيقات وتحديات', content: <MorePractice /> },
    { id: 'mistakes', title: 'اكتشف الخطأ', content: <Mistakes /> },
    { id: 'recap', title: 'الخلاصة', content: <Recap /> },
    { id: 'final', title: 'الاختبار الختامي', content: <Final /> },
  ]
  const [active, setActive] = useState(0)
  return <LessonShell title="الأعداد الطبيعية" steps={steps} activeStep={active} onStepChange={setActive} />
}
