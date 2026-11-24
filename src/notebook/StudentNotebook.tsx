import type { ReactNode } from 'react'
import { Printer, NotebookPen, AlertTriangle, Lightbulb } from 'lucide-react'
import { BidiText } from '../components/BidiText'
import type { NotebookBlock, NotebookDoc, NotebookSection } from './types'

/**
 * Renders one authored `NotebookDoc` as the last step of a lesson: the page a student copies into
 * their school notebook. The notebook is a static reference — it never adds inputs, never grades,
 * and exposes exactly one control (print), so it cannot interfere with lesson activities or tests.
 *
 * Plain strings pass through `BidiText`, which keeps Arabic prose RTL while isolating Latin runs,
 * ordered pairs and geometric symbols (∠BAC, D̂, [AB], 130°) in their natural LTR order.
 */
/**
 * Routes authored content through `BidiText`: a plain string is split so Arabic prose stays RTL while
 * Latin runs, ordered pairs and geometric symbols (∠BAC, [AB), 130°) are isolated LTR. Arrays (the
 * `mixed(...)` helper) are mapped element by element, so a composed value keeps the same guarantee.
 */
function text(value: ReactNode): ReactNode {
  if (typeof value === 'string') return <BidiText>{value}</BidiText>
  if (Array.isArray(value)) return value.map((part, index) => <span key={index}>{text(part)}</span>)
  return value
}

function list(items: readonly ReactNode[] | undefined): ReactNode {
  if (!items || items.length === 0) return null
  return items.map((item, index) => <li key={index}>{text(item)}</li>)
}

function Block({ block }: { block: NotebookBlock }) {
  switch (block.kind) {
    case 'text':
      return <p className="nb-text" data-notebook-block={block.id}>{text(block.text)}</p>

    case 'definition':
      return (
        <div className="nb-block nb-definition" data-notebook-block={block.id}>
          <p className="nb-definition-line">
            <span className="nb-term">{text(block.term)}</span>
            <span className="nb-definition-text">{text(block.text)}</span>
          </p>
          {block.source ? <span className="nb-source">{text(block.source)}</span> : null}
        </div>
      )

    case 'rule':
      return (
        <div className="nb-block nb-rule" data-notebook-block={block.id}>
          <h4 className="nb-block-title">{text(block.title)}</h4>
          <div className="nb-rule-text">{text(block.text)}</div>
        </div>
      )

    case 'steps':
      return (
        <div className="nb-block nb-steps" data-notebook-block={block.id}>
          <h4 className="nb-block-title">{text(block.title)}</h4>
          <ol className="nb-ordered">{list(block.steps)}</ol>
        </div>
      )

    case 'example':
      return (
        <div className="nb-block nb-example" data-notebook-block={block.id}>
          <h4 className="nb-block-title">{text(block.title)}</h4>
          <p className="nb-question">{text(block.question)}</p>
          {block.figure ? <div className="nb-example-figure">{block.figure}</div> : null}
          <p className="nb-solution-label">الحلّ:</p>
          <ol className="nb-ordered nb-solution">{list(block.solution)}</ol>
          <p className="nb-answer"><span className="nb-answer-tag">الإجابة</span>{text(block.answer)}</p>
          {block.verification ? <p className="nb-verification"><span className="nb-verification-tag">التحقّق</span>{text(block.verification)}</p> : null}
        </div>
      )

    case 'figure':
      return (
        <figure className="nb-block nb-figure" data-notebook-block={block.id}>
          <div className="nb-figure-body">{block.figure}</div>
          {block.title || block.caption ? (
            <figcaption className="nb-figure-caption">
              {block.title ? <strong>{text(block.title)}</strong> : null}
              {block.caption ? <span>{text(block.caption)}</span> : null}
            </figcaption>
          ) : null}
          {block.labels && block.labels.length > 0 ? <ul className="nb-labels">{list(block.labels)}</ul> : null}
        </figure>
      )

    case 'table':
      return (
        <div className="nb-block nb-table-block" data-notebook-block={block.id}>
          {block.title ? <h4 className="nb-block-title">{text(block.title)}</h4> : null}
          <div className="nb-table-scroll">
            <table className="nb-table">
              <thead><tr>{block.headers.map((header, index) => <th key={index} scope="col">{text(header)}</th>)}</tr></thead>
              <tbody>{block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => cellIndex === 0
                    ? <th key={cellIndex} scope="row">{text(cell)}</th>
                    : <td key={cellIndex}>{text(cell)}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
          {block.caption ? <p className="nb-table-caption">{text(block.caption)}</p> : null}
        </div>
      )

    case 'note':
      return (
        <div className={`nb-block nb-note nb-note-${block.tone}`} data-notebook-block={block.id}>
          {block.tone === 'warning'
            ? <AlertTriangle size={18} aria-hidden="true" />
            : <Lightbulb size={18} aria-hidden="true" />}
          <p>{text(block.text)}</p>
        </div>
      )

    default:
      return null
  }
}

function Section({ section, index }: { section: NotebookSection; index: number }) {
  return (
    <li className="nb-section" data-notebook-section={section.id}>
      <h3 className="nb-section-title"><span className="nb-section-number" aria-hidden="true">{index + 1}</span>{text(section.title)}</h3>
      <div className="nb-section-body">{section.blocks.map(block => <Block key={block.id} block={block} />)}</div>
    </li>
  )
}

export function StudentNotebook({ doc }: { doc: NotebookDoc }) {
  return (
    <div className={`student-notebook${doc.theme ? ` ${doc.theme}` : ''}`} dir="rtl" data-notebook={doc.lessonId}>
      <header className="nb-head">
        <p className="nb-head-tag"><NotebookPen size={17} aria-hidden="true" /> دفتر الطالب</p>
        <h3 className="nb-title">{doc.lessonTitle}</h3>
        <p className="nb-meta">{doc.unit} · {doc.pages}</p>
        <p className="nb-instruction">
          انقل ما يأتي في دفترك كما هو: التعريفات والقواعد والخطوات والأمثلة المحلولة والرسوم.
          هذه الصفحة هي مرجعك للمراجعة، وتغنيك عن إعادة الدرس من البداية.
        </p>
        <button type="button" className="nb-print" onClick={() => { if (typeof window !== 'undefined' && typeof window.print === 'function') window.print() }}>
          <Printer size={17} aria-hidden="true" /> اطبع صفحة الدفتر
        </button>
      </header>
      <ol className="nb-sections">{doc.sections.map((section, index) => <Section key={section.id} section={section} index={index} />)}</ol>
    </div>
  )
}
