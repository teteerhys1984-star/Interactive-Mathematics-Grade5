import { BidiText } from '../components/BidiText'
import { MathExpression } from '../components/MathExpression'
import type { RichContent } from './types'

export function RichContentView({ content, className }: { content: RichContent; className?: string }) {
  return <span className={['test-rich-content', className].filter(Boolean).join(' ')} dir="rtl">
    {content.map((run, index) => {
      const key = `${run.kind}-${index}`
      if (run.kind === 'text') return <BidiText key={key}>{run.text}</BidiText>
      if (run.kind === 'math') return <MathExpression key={key}>{run.text}</MathExpression>
      return <span key={key} className="test-ltr-run" dir="ltr" style={{ unicodeBidi: 'isolate' }}>{run.text}</span>
    })}
  </span>
}
