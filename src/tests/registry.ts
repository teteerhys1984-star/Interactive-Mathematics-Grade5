import { curriculumRegistry } from '../content/registry'
import { analyzeTestCatalog, type CoverageMode, type ValidationIssue, type ValidationReport } from './validation'
import type { TestDefinition } from './types'

export interface TestRegistrySnapshot {
  discoveredDefinitionCount: number
  allTests: readonly TestDefinition[]
  lessonTests: readonly TestDefinition[]
  unitTests: readonly TestDefinition[]
  comprehensiveTests: readonly TestDefinition[]
  issues: readonly ValidationIssue[]
  report: ValidationReport
  getTestById(id: string): TestDefinition | undefined
}

/**
 * Pure registry builder. Definitions are supplied by Vite discovery in production and by
 * synthetic fixtures in infrastructure tests; no filesystem access is used here.
 */
export function createTestRegistry(
  units: Parameters<typeof analyzeTestCatalog>[0],
  rawDefinitions: readonly unknown[],
  options: { coverageMode: CoverageMode },
): TestRegistrySnapshot {
  const analysis = analyzeTestCatalog(units, rawDefinitions, options)
  const eligible = analysis.eligibleDefinitions

  return {
    discoveredDefinitionCount: rawDefinitions.length,
    allTests: eligible,
    lessonTests: eligible.filter((definition) => definition.type === 'lesson'),
    unitTests: eligible.filter((definition) => definition.type === 'unit'),
    comprehensiveTests: eligible.filter((definition) => definition.type === 'comprehensive'),
    issues: analysis.report.issues,
    report: analysis.report,
    getTestById: (id) => eligible.find((definition) => definition.id === id),
  }
}

/** Vite resolves this glob at build time. Legacy Teacher Area/Final Tests are not under this path. */
const definitionModules = import.meta.glob<unknown>('./definitions/**/*.test.ts', {
  eager: true,
  import: 'default',
})

export const discoveredTestDefinitions: readonly unknown[] = Object.values(definitionModules)

// Production discovery is always audited with strict curriculum coverage. Infrastructure-only
// remains available to fixture callers through createTestRegistry, but never gates production.
export const testRegistry = createTestRegistry(curriculumRegistry, discoveredTestDefinitions, {
  coverageMode: 'strict',
})

export const getAllTests = (): readonly TestDefinition[] => testRegistry.allTests
export const getLessonTests = (): readonly TestDefinition[] => testRegistry.lessonTests
export const getUnitTests = (): readonly TestDefinition[] => testRegistry.unitTests
export const getComprehensiveTests = (): readonly TestDefinition[] => testRegistry.comprehensiveTests
export const getTestById = (id: string): TestDefinition | undefined => testRegistry.getTestById(id)
export const getTestRegistryIssues = (): readonly ValidationIssue[] => testRegistry.issues
