import type { ReactNode } from 'react'

/**
 * «دفتر الطالب» — the student notebook schema.
 *
 * The notebook is the student's own written record of a lesson: everything they are expected to
 * put down in their school notebook after the lesson has been explained, plus the book's solved
 * exercises to compare their work against. It does not replace the lesson or the teacher's
 * explanation — it records what the student learned. It is authored data (one `NotebookDoc` per
 * lesson in `src/notebook/entries/`), rendered by the shared `StudentNotebook` component, and
 * audited by `scripts/notebook-check.tsx`.
 *
 * Design rules for authors:
 *  • Every block carries a stable `id` (rendered as `data-notebook-block`) so checks can prove
 *    the whole document reached the DOM, and so future units extend the system without changes.
 *  • Every section declares its `purpose`: `record` for what the student writes down (a
 *    definition, a rule, a procedure, a figure or table to copy) and `practice` for solved book
 *    exercises and extra worked examples. Definitions, rules and procedures must never sit in a
 *    `practice` section — the check enforces that no curriculum item is buried among solutions.
 *  • Content comes from the textbook via the lesson's own data/teacher modules; figures reuse
 *    the platform's existing components (CoordinatesGrid, LineChart, GeoFigure, ColumnOperation…)
 *    instead of a parallel drawing system.
 *  • Any value that is *read off a drawing* rather than printed in the book must say so
 *    («قراءة تقريبية من الرسم»), so it never looks like exact printed data.
 *  • The notebook is a static reference: no inputs, no grading, and exactly one button (print).
 */

/** A paragraph of notebook prose. May embed `MathExpression` for numbers/symbols. */
export interface NotebookTextBlock { kind: 'text'; id: string; text: ReactNode }

/** A term with its exact definition. `source` cites the textbook page, e.g. «الكتاب · ص 32». */
export interface NotebookDefinitionBlock { kind: 'definition'; id: string; term: ReactNode; text: ReactNode; source?: string }

/** A mathematical rule or property with the conditions of its use. */
export interface NotebookRuleBlock { kind: 'rule'; id: string; title: ReactNode; text: ReactNode }

/** An ordered procedure (how to read, draw, round, compute…). */
export interface NotebookStepsBlock { kind: 'steps'; id: string; title: ReactNode; steps: ReactNode[] }

/**
 * A worked example the student should record: the question, ordered solution steps, the final
 * answer, and an optional verification line and figure.
 */
export interface NotebookExampleBlock {
  kind: 'example'
  id: string
  title: ReactNode
  question: ReactNode
  figure?: ReactNode
  solution: ReactNode[]
  answer: ReactNode
  /** How to check the answer (inverse operation, angle sum, re-adding periods…). */
  verification?: ReactNode
}

/** A figure to copy into the notebook, with its labels/data listed underneath. */
export interface NotebookFigureBlock {
  kind: 'figure'
  id: string
  title?: ReactNode
  figure: ReactNode
  caption?: ReactNode
  /** Names, coordinates, measures and data attached to the figure. */
  labels?: ReactNode[]
}

/** A table to copy (place-value table, printed data table, answers table…). */
export interface NotebookTableBlock {
  kind: 'table'
  id: string
  title?: ReactNode
  headers: ReactNode[]
  rows: ReactNode[][]
  caption?: ReactNode
}

/** An important caution (`warning`) or a helpful reminder (`tip`). */
export interface NotebookNoteBlock { kind: 'note'; id: string; tone: 'warning' | 'tip'; text: ReactNode }

export type NotebookBlock =
  | NotebookTextBlock
  | NotebookDefinitionBlock
  | NotebookRuleBlock
  | NotebookStepsBlock
  | NotebookExampleBlock
  | NotebookFigureBlock
  | NotebookTableBlock
  | NotebookNoteBlock

/**
 * Why a section exists in the notebook.
 *  • `record`  — «يُدوَّن في الدفتر»: the student copies it verbatim (definition, rule, procedure,
 *    figure, table, caution). Every curriculum definition/rule/skill lives in a `record` section.
 *  • `practice` — «حلول وتدرّبات»: the book's solved exercises and extra worked examples, kept for
 *    comparing with the student's own attempt; the teacher decides what is copied from it.
 */
export type NotebookSectionPurpose = 'record' | 'practice'

export interface NotebookSection {
  id: string
  title: ReactNode
  /** Defaults to `record`; declared explicitly in every Unit 1 section. */
  purpose?: NotebookSectionPurpose
  blocks: NotebookBlock[]
}

export interface NotebookDoc {
  /** Must equal the lesson id in `src/content/registry.ts`. */
  lessonId: string
  /** Must equal the lesson title in `src/content/registry.ts` (checked, never drifted). */
  lessonTitle: string
  /** Unit label shown in the notebook header, e.g. «الوحدة الأولى». */
  unit: string
  /** Textbook pages of the lesson, e.g. «ص 31–35». */
  pages: string
  /**
   * The lesson shell theme class (`lesson-four`…`lesson-eight`). Repeated on the notebook root so
   * reused figure components resolve the exact same CSS variables they use inside the lesson.
   */
  theme?: string
  sections: NotebookSection[]
}
