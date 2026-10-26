import type { ReactNode } from 'react'
import { renderIsolatedOrderedPair } from './MathExpression'

const LATIN_GRAPHEME_RUN = '(?:[A-Za-zÂĈÊÎÔÛŴŶẐâĉêîôûŵŷẑ][\\u0300-\\u036f]*)+'
const LATIN_OR_DIGIT_LOOKAHEAD = '[A-Za-z0-9ÂĈÊÎÔÛŴŶẐâĉêîôûŵŷẑ]'
const PAREN_MATH_OR_TUPLE = `(?:${LATIN_GRAPHEME_RUN}\\s*)?\\((?=(?:[^()\\u0600-\\u06FF]|\\([^()\\u0600-\\u06FF]*\\))*${LATIN_OR_DIGIT_LOOKAHEAD})(?:[^()\\u0600-\\u06FF]|\\([^()\\u0600-\\u06FF]*\\))+\\)`
const MIXED_ORDERED_PAIR = '\\(\\s*(?:[\\u0621-\\u064A]+\\s*[,،]\\s*[+-]?\\d+(?:\\.\\d+)?|[+-]?\\d+(?:\\.\\d+)?\\s*[,،]\\s*[\\u0621-\\u064A]+|الأفقي\\s*[,،]\\s*الشاقولي)\\s*\\)'
const GEOMETRY_BRACKET_TOKEN = `[\\[(]${LATIN_GRAPHEME_RUN}[\\])]`
const SYMBOL_OR_WORD_TOKEN = `(?:∠\\s*)?${LATIN_GRAPHEME_RUN}(?:\\([^()\\u0600-\\u06FF]*\\))?`
const NUMBER_RUN_TOKEN = '\\d+(?:[.,]\\d+)*(?:\\s*[,،]\\s*\\d+(?:[.,]\\d+)*)*°?'

const LTR_OR_PAIR_TOKEN_RE = new RegExp(
  `(${PAREN_MATH_OR_TUPLE}|${MIXED_ORDERED_PAIR}|${GEOMETRY_BRACKET_TOKEN}|${SYMBOL_OR_WORD_TOKEN}|${NUMBER_RUN_TOKEN})`,
  'gu',
)

/** Keeps mixed Arabic prose RTL while isolating Latin/math runs, geometric symbols, and ordered pairs in their natural LTR order. */
export function BidiText({ children }: { children: string }): ReactNode {
  const pieces = children.split(LTR_OR_PAIR_TOKEN_RE)
  return <span dir="rtl">{pieces.map((piece, index) => piece ? (index % 2 === 1 ? <span key={index} dir="ltr" style={{ unicodeBidi: 'isolate', display: 'inline-block' }}>{renderIsolatedOrderedPair(piece) ?? piece}</span> : <span key={index}>{piece}</span>) : null)}</span>
}
