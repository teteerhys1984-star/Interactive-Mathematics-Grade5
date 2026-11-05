import { curriculumRegistry } from '../content/registry'
import { createIndependentTestsRegistry } from './validation'
import type { IndependentTestsRegistry } from './validation'

/**
 * Vite resolves this glob at build time. Every file under `definitions/` default-exports one
 * `defineIndependentTest(...)` result, so adding a new test is a data-only change.
 */
const definitionModules = import.meta.glob<unknown>('./definitions/**/*.test.ts', {
  eager: true,
  import: 'default',
})

export const discoveredIndependentTestDefinitions: readonly unknown[] = Object.values(definitionModules)

export const independentTestsRegistry: IndependentTestsRegistry = createIndependentTestsRegistry(
  curriculumRegistry,
  discoveredIndependentTestDefinitions,
)

export const getIndependentTests = (): IndependentTestsRegistry['tests'] => independentTestsRegistry.tests
export const getIndependentTestByNumber = (number: number) => independentTestsRegistry.getTestByNumber(number)
export const getIndependentTestIssues = (): IndependentTestsRegistry['issues'] => independentTestsRegistry.issues
