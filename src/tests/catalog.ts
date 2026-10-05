import type { UnitMeta } from '../types'
import type { TestRegistrySnapshot } from './registry'
import type { TestDefinition, TestType } from './types'

export interface TestCatalog {
  lessonTests: readonly TestDefinition[]
  unitTests: readonly TestDefinition[]
  comprehensiveTests: readonly TestDefinition[]
}

/** Only the Registry's eligible selectors are exposed; an infrastructure-only policy violation blocks them. */
export function isTestCatalogBlocked(registry: TestRegistrySnapshot): boolean {
  return registry.issues.some((entry) => entry.code === 'INFRASTRUCTURE_ONLY_POLICY_HAS_PRODUCTION_DEFINITIONS')
}

export function getEligibleTestCatalog(registry: TestRegistrySnapshot, curriculum: readonly UnitMeta[]): TestCatalog {
  if (isTestCatalogBlocked(registry)) return { lessonTests: [], unitTests: [], comprehensiveTests: [] }

  const lessonOrder = new Map<string, number>()
  let position = 0
  for (const unit of curriculum) {
    for (const lesson of unit.lessons) lessonOrder.set(lesson.id, position++)
  }
  const unitOrder = new Map(curriculum.map((unit, index) => [unit.id, index]))

  const lessonTests = registry.lessonTests.slice().sort((left, right) =>
    (lessonOrder.get(left.type === 'lesson' ? left.lessonId : '') ?? Number.MAX_SAFE_INTEGER)
    - (lessonOrder.get(right.type === 'lesson' ? right.lessonId : '') ?? Number.MAX_SAFE_INTEGER),
  )
  const unitTests = registry.unitTests.slice().sort((left, right) =>
    (unitOrder.get(left.type === 'unit' ? left.unitId : '') ?? Number.MAX_SAFE_INTEGER)
    - (unitOrder.get(right.type === 'unit' ? right.unitId : '') ?? Number.MAX_SAFE_INTEGER),
  )

  return { lessonTests, unitTests, comprehensiveTests: registry.comprehensiveTests }
}

export interface TestDisplayMetadata {
  title: string
  context: string
  scope: string
}

export function getTestDisplayMetadata(test: TestDefinition, curriculum: readonly UnitMeta[]): TestDisplayMetadata {
  const lessonLocations = curriculum.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })))

  switch (test.type) {
    case 'lesson': {
      const location = lessonLocations.find((entry) => entry.lesson.id === test.lessonId)
      const lessonTitle = location?.lesson.title
      const unitTitle = location?.unit.title
      return {
        title: test.title ?? (lessonTitle ? `اختبار ${lessonTitle}` : 'اختبار الدرس'),
        context: lessonTitle ? `اختبار درس · ${lessonTitle}` : 'اختبار درس',
        scope: unitTitle && lessonTitle ? `${unitTitle} · ${lessonTitle}` : lessonTitle ?? 'درس',
      }
    }
    case 'unit': {
      const unit = curriculum.find((candidate) => candidate.id === test.unitId)
      return {
        title: test.title ?? (unit ? `اختبار ${unit.title}` : 'اختبار الوحدة'),
        context: unit ? `اختبار وحدة · ${unit.title}` : 'اختبار وحدة',
        scope: unit?.title ?? 'وحدة',
      }
    }
    case 'comprehensive': {
      const unitTitles = test.scope.unitIds
        .map((unitId) => curriculum.find((unit) => unit.id === unitId)?.title)
        .filter((title): title is string => Boolean(title))
      const lessonTitles = test.scope.lessonIds
        .map((lessonId) => lessonLocations.find((entry) => entry.lesson.id === lessonId)?.lesson.title)
        .filter((title): title is string => Boolean(title))
      const scope = [...unitTitles, ...lessonTitles].filter((title, index, values) => values.indexOf(title) === index)
      return {
        title: test.title,
        context: 'اختبار شامل',
        scope: scope.length ? scope.join(' · ') : 'نطاق الاختبار المسجّل',
      }
    }
    default: {
      const exhaustive: never = test
      return { title: String(exhaustive), context: '', scope: '' }
    }
  }
}

export function categoryForTestType(type: TestType): 'lessons' | 'units' | 'comprehensive' {
  switch (type) {
    case 'lesson': return 'lessons'
    case 'unit': return 'units'
    case 'comprehensive': return 'comprehensive'
    default: {
      const exhaustive: never = type
      return exhaustive
    }
  }
}
