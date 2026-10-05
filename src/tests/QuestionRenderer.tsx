import { useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import { normalizeNumericGlyphs } from './scoring'
import { RichContentView } from './RichContentView'
import type { QuestionDefinition, StudentAnswer } from './types'

type FractionInputMode = 'fraction' | 'decimal'

interface QuestionRendererProps {
  question: QuestionDefinition
  answer: StudentAnswer | undefined
  fractionMode: FractionInputMode
  onAnswerChange: (answer: StudentAnswer | undefined) => void
  onFractionModeChange: (mode: FractionInputMode) => void
}

export function QuestionRenderer({
  question,
  answer,
  fractionMode,
  onAnswerChange,
  onFractionModeChange,
}: QuestionRendererProps) {
  const [denominatorError, setDenominatorError] = useState(false)
  const idPrefix = `test-question-${question.id}`

  switch (question.type) {
    case 'single-choice': {
      const selectedId = answer?.type === 'single-choice' ? answer.value : ''
      return <fieldset className="test-answer-fieldset">
        <legend className="test-answer-legend">اختر إجابة واحدة</legend>
        <div className="test-choice-list">
          {question.options.map((option) => <label className="test-choice" data-selected={selectedId === option.id || undefined} key={option.id}>
            <input
              type="radio"
              name={idPrefix}
              value={option.id}
              checked={selectedId === option.id}
              onChange={() => onAnswerChange({ type: 'single-choice', value: option.id })}
            />
            <RichContentView content={option.label} />
          </label>)}
        </div>
      </fieldset>
    }
    case 'true-false': {
      const selectedValue = answer?.type === 'true-false' ? answer.value : undefined
      return <fieldset className="test-answer-fieldset">
        <legend className="test-answer-legend">اختر أحد الخيارين</legend>
        <div className="test-choice-list test-choice-list--compact">
          {([true, false] as const).map((value) => <label className="test-choice" data-selected={selectedValue === value || undefined} key={String(value)}>
            <input
              type="radio"
              name={idPrefix}
              value={String(value)}
              checked={selectedValue === value}
              onChange={() => onAnswerChange({ type: 'true-false', value })}
            />
            <span>{value ? 'صحيح' : 'خطأ'}</span>
          </label>)}
        </div>
      </fieldset>
    }
    case 'multi-select': {
      const selectedIds = answer?.type === 'multi-select' ? answer.value : []
      return <fieldset className="test-answer-fieldset">
        <legend className="test-answer-legend">يمكنك اختيار أكثر من إجابة</legend>
        <div className="test-choice-list">
          {question.options.map((option) => {
            const checked = selectedIds.includes(option.id)
            return <label className="test-choice" data-selected={checked || undefined} key={option.id}>
              <input
                type="checkbox"
                name={idPrefix}
                value={option.id}
                checked={checked}
                onChange={() => {
                  const nextIds = checked
                    ? selectedIds.filter((id) => id !== option.id)
                    : [...selectedIds, option.id]
                  onAnswerChange(nextIds.length ? { type: 'multi-select', value: nextIds } : undefined)
                }}
              />
              <RichContentView content={option.label} />
            </label>
          })}
        </div>
      </fieldset>
    }
    case 'numeric': {
      const value = answer?.type === 'numeric' ? answer.value : ''
      const hasUnits = question.answer.unitPolicy.kind !== 'none'
      const acceptedUnits = question.answer.unitPolicy.kind === 'none' ? [] : question.answer.unitPolicy.acceptedUnits
      return <div className="test-answer-fieldset">
        <label className="test-answer-legend" htmlFor={`${idPrefix}-numeric`}>اكتب القيمة{hasUnits ? ' والوحدة عند طلبها' : ''}</label>
        <input
          id={`${idPrefix}-numeric`}
          className="test-text-input test-numeric-input"
          type="text"
          inputMode={hasUnits ? 'text' : 'decimal'}
          autoComplete="off"
          dir="auto"
          value={value}
          onChange={(event) => onAnswerChange(event.currentTarget.value.length
            ? { type: 'numeric', value: event.currentTarget.value }
            : undefined)}
          aria-describedby={`${idPrefix}-numeric-hint`}
        />
        <p className="test-field-hint" id={`${idPrefix}-numeric-hint`}>
          {question.answer.unitPolicy.kind === 'required'
            ? 'أدخل القيمة وألحق بها وحدة قياس مقبولة.'
            : question.answer.unitPolicy.kind === 'optional'
              ? 'يمكن كتابة وحدة القياس إذا كانت مناسبة.'
              : 'أدخل العدد فقط.'}
        </p>
        {acceptedUnits.length > 0 && <p className="test-field-hint">الوحدات المقبولة: {acceptedUnits.map((unit, index) => <span key={`${unit}-${index}`}><BidiText>{unit}</BidiText>{index < acceptedUnits.length - 1 ? '، ' : ''}</span>)}</p>}
      </div>
    }
    case 'fraction': {
      const value = answer?.type === 'fraction' ? answer.value : ''
      const allowsDecimal = question.answer.allowDecimalEquivalent === true
      const parts = value.split('/')
      const numerator = parts.length === 2 ? parts[0] : value
      const denominator = parts.length === 2 ? parts[1] : ''

      const updateFraction = (nextNumerator: string, nextDenominator: string) => {
        const hasInput = nextNumerator.length > 0 || nextDenominator.length > 0
        if (!hasInput) {
          onAnswerChange(undefined)
          return
        }
        onAnswerChange({ type: 'fraction', value: `${nextNumerator}/${nextDenominator}` })
      }

      return <div className="test-answer-fieldset">
        <span className="test-answer-legend">اكتب إجابتك على صورة كسر</span>
        {allowsDecimal && <fieldset className="test-fraction-mode">
          <legend className="test-field-hint">طريقة كتابة الإجابة</legend>
          <label><input type="radio" name={`${idPrefix}-mode`} checked={fractionMode === 'fraction'} onChange={() => {
            onFractionModeChange('fraction')
            setDenominatorError(false)
          }} /> كسر</label>
          <label><input type="radio" name={`${idPrefix}-mode`} checked={fractionMode === 'decimal'} onChange={() => {
            onFractionModeChange('decimal')
            setDenominatorError(false)
          }} /> عدد عشري</label>
        </fieldset>}
        {allowsDecimal && fractionMode === 'decimal'
          ? <label className="test-field-label" htmlFor={`${idPrefix}-decimal`}>العدد العشري
              <input
                id={`${idPrefix}-decimal`}
                className="test-text-input test-numeric-input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                dir="ltr"
                value={value.includes('/') ? '' : value}
                onChange={(event) => onAnswerChange(event.currentTarget.value.length
                  ? { type: 'fraction', value: event.currentTarget.value }
                  : undefined)}
              />
            </label>
          : <div className="test-fraction-inputs" dir="ltr">
              <label htmlFor={`${idPrefix}-numerator`}>البسط
                <input
                  id={`${idPrefix}-numerator`}
                  className="test-text-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={numerator}
                  onChange={(event) => updateFraction(event.currentTarget.value, denominator)}
                  aria-describedby={`${idPrefix}-fraction-hint`}
                />
              </label>
              <span className="test-fraction-bar" aria-hidden="true">/</span>
              <label htmlFor={`${idPrefix}-denominator`}>المقام
                <input
                  id={`${idPrefix}-denominator`}
                  className="test-text-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={denominator}
                  onChange={(event) => {
                    const next = normalizeNumericGlyphs(event.currentTarget.value).trim()
                    if (/^[+-]?0+(?:\.0+)?$/u.test(next)) {
                      setDenominatorError(true)
                      return
                    }
                    setDenominatorError(false)
                    updateFraction(numerator, event.currentTarget.value)
                  }}
                  aria-invalid={denominatorError || undefined}
                  aria-describedby={`${idPrefix}-fraction-hint`}
                />
              </label>
            </div>}
        <p className="test-field-hint" id={`${idPrefix}-fraction-hint`}>
          {denominatorError
            ? 'لا يمكن أن يكون المقام صفراً.'
            : allowsDecimal
              ? 'اكتب البسط والمقام، أو اختر الصيغة العشرية إذا كانت مناسبة لهذا السؤال.'
              : 'أدخل البسط والمقام في الحقلين.'}
        </p>
      </div>
    }
    case 'ordering': {
      const initialOrder = question.items.map((item) => item.id)
      const selectedOrder = answer?.type === 'ordering' ? answer.value : undefined
      const displayedOrder = selectedOrder ?? initialOrder
      const itemById = new Map(question.items.map((item) => [item.id, item]))
      const moveItem = (index: number, offset: -1 | 1) => {
        const nextIndex = index + offset
        if (nextIndex < 0 || nextIndex >= displayedOrder.length) return
        const nextOrder = [...displayedOrder]
        ;[nextOrder[index], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[index]]
        onAnswerChange({ type: 'ordering', value: nextOrder })
      }
      return <div className="test-answer-fieldset">
        <p className="test-answer-legend">رتّب العناصر ثم اعتمد الترتيب</p>
        <ol className="test-order-list">
          {displayedOrder.map((itemId, index) => {
            const item = itemById.get(itemId)
            if (!item) return null
            return <li key={itemId}>
              <span className="test-order-position" aria-hidden="true">{index + 1}</span>
              <RichContentView content={item.label} />
              <div className="test-order-controls">
                <button type="button" className="test-icon-button" aria-label={`رفع العنصر ${index + 1}`} disabled={index === 0} onClick={() => moveItem(index, -1)}><ArrowUp size={17} aria-hidden="true" /></button>
                <button type="button" className="test-icon-button" aria-label={`خفض العنصر ${index + 1}`} disabled={index === displayedOrder.length - 1} onClick={() => moveItem(index, 1)}><ArrowDown size={17} aria-hidden="true" /></button>
              </div>
            </li>
          })}
        </ol>
        <button type="button" className="test-secondary-button test-order-accept" onClick={() => onAnswerChange({ type: 'ordering', value: displayedOrder })}>اعتماد الترتيب الحالي</button>
      </div>
    }
    case 'matching': {
      const currentPairs = answer?.type === 'matching' ? answer.value : []
      const selectedByLeft = new Map(currentPairs.map((pair) => [pair.leftId, pair.rightId]))
      const selectedRightIds = new Set(currentPairs.map((pair) => pair.rightId))
      return <fieldset className="test-answer-fieldset">
        <legend className="test-answer-legend">اختر العنصر المقابل لكل بند</legend>
        <div className="test-matching-list">
          {question.left.map((leftItem) => {
            const selectedRightId = selectedByLeft.get(leftItem.id) ?? ''
            return <fieldset className="test-match-row" key={leftItem.id}>
              <legend className="test-match-left"><RichContentView content={leftItem.label} /></legend>
              <div className="test-match-options">
                {question.right.map((rightItem) => <label className="test-choice" data-selected={selectedRightId === rightItem.id || undefined} key={rightItem.id}>
                  <input
                    type="radio"
                    name={`${idPrefix}-match-${leftItem.id}`}
                    value={rightItem.id}
                    checked={selectedRightId === rightItem.id}
                    disabled={rightItem.id !== selectedRightId && selectedRightIds.has(rightItem.id)}
                    onChange={() => {
                      const nextPairs = currentPairs.filter((pair) => pair.leftId !== leftItem.id && pair.rightId !== rightItem.id)
                      nextPairs.push({ leftId: leftItem.id, rightId: rightItem.id })
                      onAnswerChange({ type: 'matching', value: nextPairs })
                    }}
                  />
                  <RichContentView content={rightItem.label} />
                </label>)}
              </div>
            </fieldset>
          })}
        </div>
      </fieldset>
    }
    case 'error-analysis': {
      const currentValue = answer?.type === 'error-analysis' ? answer.value : undefined
      return <div className="test-answer-fieldset">
        <p className="test-answer-legend">اقرأ عمل الطالب واختر التشخيص</p>
        <blockquote className="test-student-work"><RichContentView content={question.studentWork} /></blockquote>
        <fieldset className="test-answer-fieldset">
          <legend className="test-answer-legend">التشخيص</legend>
          <div className="test-choice-list">
            {question.diagnoses.map((diagnosis) => <label className="test-choice" data-selected={currentValue?.diagnosisId === diagnosis.id || undefined} key={diagnosis.id}>
              <input
                type="radio"
                name={`${idPrefix}-diagnosis`}
                value={diagnosis.id}
                checked={currentValue?.diagnosisId === diagnosis.id}
                onChange={() => onAnswerChange({
                  type: 'error-analysis',
                  value: { diagnosisId: diagnosis.id, ...(currentValue?.correctionId ? { correctionId: currentValue.correctionId } : {}) },
                })}
              />
              <RichContentView content={diagnosis.label} />
            </label>)}
          </div>
        </fieldset>
        {question.corrections && question.corrections.length > 0 && <fieldset className="test-answer-fieldset test-error-corrections">
          <legend className="test-answer-legend">التصحيح</legend>
          <div className="test-choice-list">
            {question.corrections.map((correction) => <label className="test-choice" data-selected={currentValue?.correctionId === correction.id || undefined} key={correction.id}>
              <input
                type="radio"
                name={`${idPrefix}-correction`}
                value={correction.id}
                checked={currentValue?.correctionId === correction.id}
                onChange={() => onAnswerChange({
                  type: 'error-analysis',
                  value: { diagnosisId: currentValue?.diagnosisId ?? '', correctionId: correction.id },
                })}
              />
              <RichContentView content={correction.label} />
            </label>)}
          </div>
        </fieldset>}
      </div>
    }
    default: {
      const unsupportedType: never = question
      return <div role="alert" className="test-runner-error">
        لا يدعم مشغّل الاختبارات هذا النوع من الأسئلة؛ لن يمكن تسليم الاختبار بأمان.
        <span className="test-sr-only">{String(unsupportedType)}</span>
      </div>
    }
  }
}
