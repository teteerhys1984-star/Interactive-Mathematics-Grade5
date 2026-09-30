import type { UnitMeta } from '../types'

export const curriculumRegistry: UnitMeta[] = [
  {
    id: 'unit-1',
    title: 'الوحدة الأولى',
    description: 'شبكة الإحداثيات والتمثيلات البيانية والأعداد الطبيعية',
    accent: 'blue',
    lessons: [
      { id: 'coordinates', title: 'شبكة الإحداثيات', description: 'التعرّف إلى شبكة الإحداثيات وقراءة مواقع النقاط.', availability: 'available' },
      { id: 'line-graphs', title: 'التمثيلات البيانية بالخطوط', description: 'قراءة التمثيل البياني بالخطوط وتفسير تغيّر البيانات مع مرور الزمن.', availability: 'available' },
      { id: 'natural-numbers', title: 'الأعداد الطبيعية', description: 'قراءة الأعداد الطبيعية وكتابتها وتحليلها إلى قيم منازل.', availability: 'available' },
      { id: 'rounding-natural-numbers', title: 'تقريب الأعداد الطبيعية', description: 'تعلّم تقريب الأعداد الطبيعية إلى أقرب مئة وألف ومليون.', availability: 'available' },
      { id: 'adding-subtracting-natural-numbers', title: 'جمع الأعداد الطبيعيّة وطرحها', description: 'الجمع والطرح ضمن الملايين بالأعمدة، مع الحمل والاستلاف والتطبيقات الواقعية.', availability: 'available' },
      { id: 'angle-measurement', title: 'قياس الزوايا', description: 'تسمية الزوايا وقياسها بالمنقلة ورسمها وتصنيفها في مواقف تفاعلية.', availability: 'available' }
    ],
  },
]
