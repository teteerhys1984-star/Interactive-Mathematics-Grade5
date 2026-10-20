import type { UnitMeta } from '../types'

export const curriculumRegistry: UnitMeta[] = [
  {
    id: 'unit-1',
    title: 'الوحدة الأولى',
    description: 'شبكة الإحداثيات والتمثيلات البيانية والأعداد الطبيعية',
    accent: 'blue',
    // Unit 1 is explicitly complete: all eight textbook lessons (صفحات 3–39) are shipped,
    // available, and each one has its own validated lesson test. This flag is authored data,
    // never inferred at runtime from whatever happens to be registered.
    status: 'complete',
    lessons: [
      { id: 'coordinates', title: 'شبكة الإحداثيات', description: 'التعرّف إلى شبكة الإحداثيات وقراءة مواقع النقاط.', availability: 'available' },
      { id: 'line-graphs', title: 'التمثيلات البيانية بالخطوط', description: 'قراءة التمثيل البياني بالخطوط وتفسير تغيّر البيانات مع مرور الزمن.', availability: 'available' },
      { id: 'natural-numbers', title: 'الأعداد الطبيعية', description: 'قراءة الأعداد الطبيعية وكتابتها وتحليلها إلى قيم منازل.', availability: 'available' },
      { id: 'rounding-natural-numbers', title: 'تقريب الأعداد الطبيعية', description: 'تعلّم تقريب الأعداد الطبيعية إلى أقرب مئة وألف ومليون.', availability: 'available' },
      { id: 'adding-subtracting-natural-numbers', title: 'جمع الأعداد الطبيعيّة وطرحها', description: 'الجمع والطرح ضمن الملايين بالأعمدة، مع الحمل والاستلاف والتطبيقات الواقعية.', availability: 'available' },
      { id: 'angle-measurement', title: 'قياس الزوايا', description: 'تسمية الزوايا وقياسها بالمنقلة ورسمها وتصنيفها في مواقف تفاعلية.', availability: 'available' },
      { id: 'parallelogram', title: 'متوازي الأضلاع', description: 'تعريف متوازي الأضلاع وقطراه، خاصتا الأضلاع والزوايا، ورسمه بالمسطرة والمنقلة.', availability: 'available' },
      { id: 'rhombus', title: 'المعيّن', description: 'تعريف المعيّن وخواصّه الثلاث ورسمه بالمسطرة والمنقلة، مع تمييزه عن متوازي الأضلاع والمستطيل.', availability: 'available' }
    ],
  },
  {
    id: 'unit-2',
    title: 'الوحدة الثانية',
    description: 'مقارنة الأعداد الطبيعية وضربها، والمضاعف المشترك الأصغر، والكسور، والأجزاء العشرية حتى الألف.',
    accent: 'mint',
    // The unit remains in progress: only the explicitly authored curriculum status controls completion.
    status: 'in-progress',
    lessons: [
      { id: 'compare-order-natural-numbers', title: 'مقارنة الأعداد الطبيعية وترتيبها', description: 'مقارنة الأعداد الطبيعية حتى الملايين وترتيبها تصاعدياً وتنازلياً.', availability: 'available' },
      { id: 'multiply-natural-numbers', title: 'ضرب الأعداد الطبيعية', description: 'الضرب العمودي مع الحمل، أنماط العشرات والصفر، والخواص التبديلية والتجميعية والتوزيعية.', availability: 'available' },
      { id: 'least-common-multiple', title: 'المضاعف المشترك الأصغر', description: 'إيجاد المضاعف المشترك الأصغر لعددين أو ثلاثة أعداد وتطبيقاته الحياتية.', availability: 'available' },
      { id: 'fractions-one', title: 'الكسور (1)', description: 'مقارنة الكسور وترتيبها باستعمال الكسور المكافئة والمقام المشترك.', availability: 'available' },
      { id: 'fractions-two', title: 'الكسور (2)', description: 'الكسر العادي والكسر المركب، والتحويل بينهما بالقسمة مع الباقي والضرب والجمع.', availability: 'available' },
      { id: 'tenths-one', title: 'الأجزاء العشرية (1)', description: 'تمثيل الأجزاء من عشرة كتابةً ولفظاً، وقراءتها ومقارنتها على النماذج وخط الأعداد.', availability: 'available' },
      { id: 'decimal-parts-two', title: 'الأجزاء العشرية (2)', description: 'تمثيل الأجزاء من مئة كتابةً عشرية ولفظاً، والتحويل بينها وبين الكسور، ومقارنتها على الشبكات وخط الأعداد.', availability: 'available' },
      { id: 'decimal-parts-three', title: 'الأجزاء العشرية (3)', description: 'كتابة الأجزاء من ألف وقراءتها، وربطها بالأجزاء من عشرة ومئة، ومقارنتها على خط الأعداد.', availability: 'available' },
      { id: 'rectangle', title: 'المستطيل', description: 'تعريف المستطيل بوصفه متوازي أضلاع فيه زاوية قائمة، وخواصه، ورسمه بالمسطرة والمنقلة أو الكوس.', availability: 'available' },
    ],
  },
]
