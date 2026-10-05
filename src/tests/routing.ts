export type TestListCategory = 'lessons' | 'units' | 'comprehensive'

export type TestAreaRoute =
  | { kind: 'home' }
  | { kind: 'list'; category: TestListCategory }
  | { kind: 'run'; testId: string }
  | { kind: 'solutions-list' }
  | { kind: 'solution-group'; testId: string; groupNumber: number }
  | { kind: 'not-found'; hash: string }

const TEST_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function decodeTestId(encodedId: string): string | undefined {
  try {
    const testId = decodeURIComponent(encodedId)
    return TEST_ID_PATTERN.test(testId) ? testId : undefined
  } catch {
    return undefined
  }
}

/** Hash-only routes keep GitHub Pages and the site's existing navigation model intact. */
export function parseTestAreaRoute(hash: string): TestAreaRoute | null {
  if (hash === '#tests' || hash === '#tests/') return { kind: 'home' }
  if (!hash.startsWith('#tests/')) return null

  const listMatch = /^#tests\/(lessons|units|comprehensive)$/.exec(hash)
  if (listMatch) return { kind: 'list', category: listMatch[1] as TestListCategory }

  if (hash === '#tests/solutions') return { kind: 'solutions-list' }

  const runMatch = /^#tests\/run\/([^/]+)$/.exec(hash)
  if (runMatch) {
    const testId = decodeTestId(runMatch[1])
    return testId ? { kind: 'run', testId } : { kind: 'not-found', hash }
  }

  const solutionMatch = /^#tests\/solutions\/([^/]+)\/(\d+)$/.exec(hash)
  if (solutionMatch) {
    const testId = decodeTestId(solutionMatch[1])
    const groupNumber = Number(solutionMatch[2])
    return testId && Number.isSafeInteger(groupNumber) && groupNumber > 0
      ? { kind: 'solution-group', testId, groupNumber }
      : { kind: 'not-found', hash }
  }

  return { kind: 'not-found', hash }
}

export function testListHref(category: TestListCategory): string {
  return `#tests/${category}`
}

export function testRunHref(testId: string): string {
  return `#tests/run/${encodeURIComponent(testId)}`
}

export function testSolutionsHref(testId: string, groupNumber = 1): string {
  return `#tests/solutions/${encodeURIComponent(testId)}/${groupNumber}`
}
