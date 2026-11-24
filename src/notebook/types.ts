import type { ReactNode } from 'react'

/**
 * «دفتر الطالب» — the student notebook schema.
 *
 * The notebook is the content a student copies into their school notebook after finishing a
 * lesson, so they can review later without re-watching the whole explanation. It is authored
 * data (one `NotebookDoc` per lesson in `src/notebook/entries/`), rendered by the shared
 * `StudentNotebook` component, and audited by `scripts/notebook-check.tsx`.
 *
 * Design rules for authors:
 *  • Every block carries a stable `id` (rendered as `data-notebook-block`) so checks can prove
 *    the whole document reached the DOM, and so future units extend the system without changes.
 *  • Content comes from the textbook via the lesson's own data/teacher modules; figures reuse
 *    the platform's existing components (CoordinatesGrid, LineChart, GeoFigure, ColumnOperation…)
 *    instead of a parallel drawing system.
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

export interface NotebookSection {
  id: string
  title: ReactNode
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
