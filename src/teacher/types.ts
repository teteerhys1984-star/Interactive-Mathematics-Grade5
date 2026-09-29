export type SourceMetadata =
  | { type: 'textbook'; page: number }
  | { type: 'platform' }

export interface TeacherEntry {
  id: string
  title: string
  prompt: string
  answer: string
  reasoning: string[]
  source: SourceMetadata
  note?: string
}
