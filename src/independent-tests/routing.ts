export type IndependentTestsRoute =
  | { kind: 'tests' }
  | { kind: 'test'; testNumber: number }
  | { kind: 'solutions'; testNumber?: number }
  | { kind: 'not-found'; hash: string }

const ROUTE_PREFIX = '#independent-tests'
const TEST_NUMBER_PATTERN = /^[1-9]\d*$/u

function parseNumber(value: string): number | undefined {
  if (!TEST_NUMBER_PATTERN.test(value)) return undefined
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

/** Hash-only routes preserve the project's GitHub Pages navigation model. */
export function parseIndependentTestsRoute(hash: string): IndependentTestsRoute | null {
  if (hash === ROUTE_PREFIX || hash === `${ROUTE_PREFIX}/` || hash === `${ROUTE_PREFIX}/tests`) {
    return { kind: 'tests' }
  }
  if (!hash.startsWith(`${ROUTE_PREFIX}/`)) return null

  const runMatch = /^#independent-tests\/test\/([^/]+)$/u.exec(hash)
  if (runMatch) {
    const testNumber = parseNumber(runMatch[1])
    return testNumber ? { kind: 'test', testNumber } : { kind: 'not-found', hash }
  }

  if (hash === `${ROUTE_PREFIX}/solutions`) return { kind: 'solutions' }

  const solutionsMatch = /^#independent-tests\/solutions\/([^/]+)$/u.exec(hash)
  if (solutionsMatch) {
    const testNumber = parseNumber(solutionsMatch[1])
    return testNumber ? { kind: 'solutions', testNumber } : { kind: 'not-found', hash }
  }

  return { kind: 'not-found', hash }
}

export function independentTestsHref(): string {
  return `${ROUTE_PREFIX}/tests`
}

export function independentTestHref(testNumber: number): string {
  return `${ROUTE_PREFIX}/test/${testNumber}`
}

export function independentSolutionsHref(testNumber?: number): string {
  return testNumber === undefined ? `${ROUTE_PREFIX}/solutions` : `${ROUTE_PREFIX}/solutions/${testNumber}`
}
