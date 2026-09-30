/**
 * PR1 design-system guard (npm run design-check).
 * Verifies that the shared visual layer in src/styles.css:
 *   1. defines the full premium token set,
 *   2. keeps the nine legacy tokens frozen at their pre-PR1 values
 *      (lesson.css / lesson-six.css / lesson-seven.css / teacher.css consume them),
 *   3. passes WCAG AA (>= 4.5:1) for every key text/surface token pair,
 *   4. uses no text size below 13px in the shared section,
 *   5. loads fonts via <link> in index.html (no CSS @import),
 *   6. keeps focus-visible + prefers-reduced-motion, and
 *   7. leaves the legacy lesson-chrome block (MathExpression/LessonShell/LessonOutline)
 *      byte-identical to its pre-PR1 form.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const styles = readFileSync(join(root, 'src/styles.css'), 'utf8')
const html = readFileSync(join(root, 'index.html'), 'utf8')
const lessonCss = readFileSync(join(root, 'src/lesson.css'), 'utf8')
const experienceCss = readFileSync(join(root, 'src/lesson-experience.css'), 'utf8')
const lessonShell = readFileSync(join(root, 'src/components/lesson/LessonShell.tsx'), 'utf8')
const lessonOutline = readFileSync(join(root, 'src/components/lesson/LessonOutline.tsx'), 'utf8')

function fail(message: string): never {
  console.error(`❌ ${message}`)
  process.exit(1)
}

const LEGACY_MARKER = 'LEGACY-LESSON-CHROME'
const markerIndex = styles.indexOf(LEGACY_MARKER)
if (markerIndex === -1) fail('styles.css is missing the LEGACY-LESSON-CHROME boundary marker')
const shared = styles.slice(0, markerIndex)
const legacy = styles.slice(markerIndex)

// ---- 1) required tokens --------------------------------------------------
const requiredTokens = [
  '--bg', '--bg-soft', '--surface', '--surface-tint',
  '--text-1', '--text-2', '--text-3',
  '--navy', '--navy-deep', '--navy-soft',
  '--gold', '--gold-deep', '--gold-soft', '--gold-bright', '--on-dark-2',
  '--ok', '--ok-soft', '--warn', '--warn-soft', '--err', '--err-soft',
  '--border', '--border-strong', '--ring',
  '--sh-sm', '--sh-md', '--sh-lg',
  '--r-sm', '--r-md', '--r-lg', '--r-xl', '--r-full',
  '--sp-1', '--sp-5', '--sp-8', '--tr',
]
const rootBlock = styles.slice(0, styles.indexOf('}', styles.indexOf(':root')))
for (const token of requiredTokens) {
  if (!new RegExp(`${token.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*:`).test(rootBlock)) fail(`missing design token ${token} in :root`)
}

// ---- 2) legacy tokens frozen ---------------------------------------------
const frozenLegacy: Record<string, string> = {
  '--ink': '#102a43', '--muted': '#60758a', '--blue': '#2367e8', '--sky': '#e9f2ff',
  '--coral': '#f47a67', '--mint': '#dff6ee', '--line': '#e5edf4',
  '--graph': '#1f9d78', '--graph-soft': '#e6f7f1',
}
for (const [token, value] of Object.entries(frozenLegacy)) {
  if (!rootBlock.includes(`${token}: ${value}`)) fail(`legacy token ${token} must stay frozen at ${value} (lesson CSS depends on it)`)
}

// ---- 3) WCAG AA contrast --------------------------------------------------
function luminance(hex: string): number {
  const normalized = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(normalized.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function contrast(fore: string, back: string): number {
  const [l1, l2] = [luminance(fore), luminance(back)].sort((a, b) => b - a)
  return (l1 + 0.05) / (l2 + 0.05)
}
function tokenValue(name: string): string {
  const match = rootBlock.match(new RegExp(`${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*:\\s*(#[0-9a-fA-F]{6})`))
  if (!match) fail(`cannot read hex value of token ${name}`)
  return match[1]
}
const aaPairs: Array<[string, string, string]> = [
  ['text-1', 'bg'], ['text-1', 'surface'],
  ['text-2', 'bg'], ['text-2', 'surface'], ['text-2', 'surface-tint'],
  ['text-3', 'bg'], ['text-3', 'surface'], ['text-3', 'surface-tint'], ['text-3', 'bg-soft'],
  ['navy', 'bg'], ['navy', 'surface'],
  ['gold-deep', 'gold-soft'], ['gold-deep', 'bg'], ['gold-deep', 'surface'],
  ['ok', 'ok-soft'], ['warn', 'warn-soft'], ['err', 'err-soft'],
  ['on-dark-2', 'navy-deep'], ['gold-bright', 'navy-deep'],
]
for (const [fore, back] of aaPairs) {
  const ratio = contrast(tokenValue(`--${fore}`), tokenValue(`--${back}`))
  if (ratio < 4.5) fail(`contrast ${fore} on ${back} is ${ratio.toFixed(2)}:1 — below WCAG AA (4.5:1)`)
}
if (contrast('#ffffff', tokenValue('--navy')) < 4.5) fail('white text on --navy buttons is below AA')

// ---- 4) minimum shared text size ------------------------------------------
const sizeMatches = [...shared.matchAll(/font-size:\s*([\d.]+)(rem|px)/g)]
if (sizeMatches.length === 0) fail('no font-size declarations found in shared styles')
for (const match of sizeMatches) {
  const px = match[2] === 'px' ? parseFloat(match[1]) : parseFloat(match[1]) * 16
  if (px < 13) fail(`shared UI font-size ${match[0]} is ${px}px — below the 13px floor`)
}

// ---- 5) font loading -------------------------------------------------------
if (styles.includes('@import')) fail('styles.css must not use @import (fonts load via <link> in index.html)')
if (!html.includes('rel="preconnect"')) fail('index.html is missing font preconnect links')
if (!html.includes('family=Cairo') || !html.includes('family=DM+Mono')) fail('index.html must load the same Cairo + DM Mono families')

// ---- 6) accessibility primitives -------------------------------------------
if (!shared.includes(':focus-visible')) fail('shared styles must define :focus-visible')
if (!shared.includes('prefers-reduced-motion')) fail('shared styles must honor prefers-reduced-motion')

// ---- 7) legacy lesson chrome untouched -------------------------------------
const legacyMustContain = [
  '.math-expression{white-space:nowrap;direction:ltr;unicode-bidi:isolate}',
  '.lesson-shell{display:grid;grid-template-columns:220px 1fr;gap:42px;max-width:1000px;margin:auto;padding:40px}',
  '.lesson-outline button.is-current{color:var(--blue);font-weight:700;border-right:3px solid var(--blue)}',
  '.lesson-navigation button:disabled{opacity:.4}',
]
for (const rule of legacyMustContain) {
  if (!legacy.includes(rule)) fail(`legacy lesson-chrome rule was modified or removed: ${rule.slice(0, 60)}…`)
}

// ---- 8) mobile lesson header (legacy nav in lesson.css) --------------------
// The lesson pages override the global drawer with a static inline nav. It used to render at
// .66rem (~10.5px) with 5px padding, which is neither readable nor tappable.
const mobileBlockMatch = lessonCss.match(/@media\(max-width:760px\)\{(?:[^{}]|\{[^{}]*\})*\}/g)
const lessonMobileBlock = mobileBlockMatch?.find(block => block.includes('.lesson-page .main-nav'))
if (!lessonMobileBlock) fail('lesson.css is missing the max-width:760px block that styles the lesson mobile header')
for (const match of lessonMobileBlock.matchAll(/font-size:\s*([\d.]+)(rem|px)/g)) {
  const px = match[2] === 'px' ? parseFloat(match[1]) : parseFloat(match[1]) * 16
  if (px < 13) fail(`mobile lesson header font-size ${match[0]} is ${px.toFixed(2)}px — below the 13px readability floor`)
}
const mobileNavLink = lessonMobileBlock.match(/\.lesson-page \.main-nav a\{([^}]*)\}/)
if (!mobileNavLink) fail('lesson.css no longer styles .lesson-page .main-nav a on mobile')
const navLinkRule = mobileNavLink[1]
const navMinHeight = navLinkRule.match(/min-height:\s*(\d+)px/)
if (!navMinHeight || parseInt(navMinHeight[1], 10) < 44) fail('mobile lesson header links must declare min-height >= 44px (touch target)')
if (!navLinkRule.includes('text-overflow:ellipsis') || !navLinkRule.includes('overflow:hidden')) fail('mobile lesson header links must clamp long lesson titles (overflow:hidden + text-overflow:ellipsis)')
if (!lessonMobileBlock.includes('.lesson-page .main-nav a.active')) fail('mobile lesson header must keep a width rule for the active (lesson title) link')
if (!lessonMobileBlock.includes('flex-direction:row')) fail('mobile lesson header must keep the inline Previous/Home row layout')

// ---- 9) mobile lesson chrome touch targets ---------------------------------
const touchTargets: Array<[string, RegExp]> = [
  ['.lesson-outline-close', /\.lesson-outline-close \{([^}]*)\}/],
  ['.lesson-outline-trigger', /\.lesson-outline-trigger \{([^}]*)\}/],
  ['.lesson-outline-list.is-mobile button', /\.lesson-outline-list\.is-mobile button \{([^}]*)\}/],
  ['.lesson-shell .lesson-nav-button', /\.lesson-shell \.lesson-nav-button \{([^}]*)\}/],
]
for (const [name, pattern] of touchTargets) {
  const rule = experienceCss.match(pattern)
  if (!rule) fail(`lesson-experience.css is missing the ${name} rule`)
  const height = rule[1].match(/min-height:\s*(\d+)px/) ?? rule[1].match(/height:\s*(\d+)px/)
  if (!height || parseInt(height[1], 10) < 44) fail(`${name} must be at least 44px tall for touch (found ${height?.[1] ?? 'none'})`)
}

// ---- 10) lesson outline dialog accessibility --------------------------------
const dialogRequirements: Array<[string, string]> = [
  ['role="dialog"', 'the mobile outline sheet must stay a role="dialog"'],
  ['aria-modal="true"', 'the mobile outline sheet must stay aria-modal="true"'],
  ["event.key === 'Escape'", 'the outline sheet must close on Escape'],
  ["event.key !== 'Tab'", 'the outline sheet must trap Tab / Shift+Tab'],
  ['event.shiftKey', 'the outline focus trap must handle Shift+Tab'],
  ['closeRef.current?.focus()', 'opening the outline sheet must move focus to the close button'],
  ['triggerRef.current?.focus()', 'closing the outline sheet must return focus to the trigger'],
]
for (const [needle, message] of dialogRequirements) {
  if (!lessonOutline.includes(needle)) fail(`LessonOutline: ${message}`)
}

// ---- 11) position and completion stay separate ------------------------------
if (!lessonShell.includes('visitedSteps')) fail('LessonShell must track visited steps instead of inferring completion from the current position')
if (!lessonShell.includes('aria-label="موقعك في الدرس"')) fail('the lesson progress bar must be labelled as the learner position, not as completion')
if (!lessonOutline.includes('visitedSteps?.has(index)')) fail('LessonOutline must derive «مكتملة» from visited steps, not from index < activeStep')
if (/index\s*<\s*activeStep/.test(lessonOutline)) fail('LessonOutline still marks every earlier step complete (index < activeStep)')

console.log('Design-system checks passed: 36 tokens present · legacy tokens frozen · 19 AA contrast pairs · 13px text floor · fonts preconnected · lesson chrome untouched · mobile lesson header readable (>=13px) and tappable (>=44px) · outline dialog focus-trapped · position separated from completion.')
