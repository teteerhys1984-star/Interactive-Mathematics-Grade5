import { MathExpression } from '../../components/MathExpression'
import { PlaceTable } from '../../lessons/NaturalNumbersLesson'
import type { NotebookDoc } from '../types'

/**
 * «دفتر الطالب» — الدرس الثالث: الأعداد الطبيعية (الكتاب ص 10–14).
 *
 * Sources: `src/lessons/NaturalNumbersLesson.tsx` — the printed «تعلّم» box (ص 10–11) with the
 * three forms, the exported `PlaceTable` (جدول الخانات), the worked example ص 11
 * (2,605,173), the zero-placeholder example ص 11–12 (1,206,079), the «تحقق من فهمك» items
 * ص 12, the «اكتشف الخطأ» item ص 14 (مراد) and the lesson recap.
 *
 * The place-value tables are the lesson's own `PlaceTable` component, so the notebook never
 * re-types the book's digits or place values.
 */
export function naturalNumbersNotebook(): NotebookDoc {
  return {
    lessonId: 'natural-numbers',
    lessonTitle: 'الأعداد الطبيعية',
    unit: 'الوحدة الأولى',
    pages: 'ص 10–14',
    sections: [
      {
        id: 'l3-terms',
        title: 'المفردات والتعريفات',
        blocks: [
          {
            kind: 'definition', id: 'l3-def-period', term: 'الحلقة (المجموعة)',
            text: 'نقرأ العدد بتجزئته إلى حلقات (مجموعات)، كل حلقة مؤلفة من ثلاث خانات، وكل خانة لها قيمة. وهذه الحلقات بدءاً من اليمين هي: حلقة الوحدات، ثم حلقة الألوف، ثم حلقة الملايين.',
            source: 'الكتاب · ص 10 و11 (صندوق «تعلّم»)',
          },
          {
            kind: 'definition', id: 'l3-def-standard', term: 'الصيغة القياسية (العددية)',
            text: <>كتابة العدد بالأرقام مع حفظ مواضع الخانات، مثل: <MathExpression>2,413,155</MathExpression>.</>,
            source: 'الكتاب · ص 10 و11',
          },
          {
            kind: 'definition', id: 'l3-def-word', term: 'الصيغة اللفظية',
            text: <>قراءة الحلقات من اليسار إلى اليمين بالكلمات؛ فالعدد <MathExpression>2,413,155</MathExpression> يُقرأ: مليونان وأربعمئة وثلاثة عشر ألفاً ومئة وخمسة وخمسون.</>,
            source: 'الكتاب · ص 10 و11',
          },
          {
            kind: 'definition', id: 'l3-def-expanded', term: 'الصيغة التفصيلية',
            text: <>كتابة العدد كمجموع لقيم منازله غير الصفرية: <MathExpression>2,413,155 = 2,000,000 + 400,000 + 10,000 + 3,000 + 100 + 50 + 5</MathExpression>.</>,
            source: 'الكتاب · ص 10 و11',
          },
          {
            kind: 'definition', id: 'l3-def-place-value', term: 'اسم المنزلة وقيمة الرقم',
            text: <>اسم المنزلة هو اسم الخانة التي يقع فيها الرقم (الآحاد، العشرات، المئات، آحاد الألوف، عشرات الألوف، مئات الألوف، الملايين)، أما قيمة الرقم فهي: قيمة الرقم = الرقم × قيمة منزلته. فالرقم <MathExpression>5</MathExpression> في الآحاد يساوي <MathExpression>5</MathExpression>، وفي العشرات يساوي <MathExpression>50</MathExpression>، وفي الملايين يساوي <MathExpression>5,000,000</MathExpression>.</>,
            source: 'الكتاب · ص 10',
          },
          {
            kind: 'definition', id: 'l3-def-zero', term: 'الصفر الحافظ للخانة',
            text: <>إذا وُجد الصفر في إحدى الخانات فإنّ قيمته تساوي صفراً، لكنه يحفظ موقع الخانة في الصيغة القياسية. ففي العدد <MathExpression>1,206,079</MathExpression> تقع الأصفار في خانتي عشرات الألوف والمئات.</>,
            source: 'الكتاب · ص 11 و12',
          },
        ],
      },
      {
        id: 'l3-tables',
        title: 'الجداول المطلوبة: جدول الخانات',
        blocks: [
          {
            kind: 'figure', id: 'l3-figure-place-table',
            title: <>جدول خانات العدد <MathExpression>2,413,155</MathExpression> (نمرة الورقة النقدية من فئة <MathExpression>500</MathExpression> ليرة سورية)</>,
            figure: <PlaceTable />,
            caption: 'يُنقل الجدول كما هو: حلقة الملايين خانة واحدة، وحلقة الألوف ثلاث خانات، وحلقة الوحدات ثلاث خانات.',
            labels: [
              <>أسماء الخانات من اليسار: الملايين، مئات الألوف، عشرات الألوف، آحاد الألوف، المئات، العشرات، الآحاد.</>,
              <>تجزئة العدد إلى حلقات من اليمين: <MathExpression>2 | 413 | 155</MathExpression>.</>,
            ],
          },
          {
            kind: 'figure', id: 'l3-figure-place-table-zeros',
            title: <>جدول خانات العدد <MathExpression>1,206,079</MathExpression> — مثال الصفر في خانة</>,
            figure: <PlaceTable digits={['1', '2', '0', '6', '0', '7', '9']} values={['1,000,000', '200,000', '0', '6,000', '0', '70', '9']} />,
            caption: 'لاحظ أنّ قيمة كل خانة فيها صفر تساوي صفراً، لذلك لا نكتبها حدّاً في الصيغة التفصيلية.',
            labels: [
              <>الصيغة التفصيلية: <MathExpression>1,206,079 = 1,000,000 + 200,000 + 6,000 + 70 + 9</MathExpression>.</>,
              'الصيغة اللفظية: مليون ومئتان وستة آلاف وتسعة وسبعون.',
            ],
          },
        ],
      },
      {
        id: 'l3-rules',
        title: 'القواعد والخواصّ',
        blocks: [
          {
            kind: 'rule', id: 'l3-rule-split', title: 'قاعدة تجزئة العدد',
            text: <>نجزّئ العدد من اليمين إلى حلقات، كل حلقة من ثلاث خانات. مثال: <MathExpression>2,413,155</MathExpression> يصبح <MathExpression>2 | 413 | 155</MathExpression>، أي <MathExpression>2</MathExpression> مليوناً و<MathExpression>413</MathExpression> ألفاً و<MathExpression>155</MathExpression> وحدة.</>,
          },
          {
            kind: 'rule', id: 'l3-rule-value', title: 'قاعدة قيمة الرقم',
            text: 'قيمة الرقم = الرقم × قيمة منزلته؛ لذلك تتغيّر قيمة الرقم بتغيّر الخانة التي يقع فيها، ولا تبقى ثابتة.',
          },
          {
            kind: 'rule', id: 'l3-rule-zero', title: 'قاعدة الصفر',
            text: 'الصفر يحفظ مكان الخانة في الصيغة القياسية فلا يجوز حذفه، ونستغني عنه فقط عند كتابة حدود الجمع في الصيغة التفصيلية لأنّ قيمته صفر.',
          },
          {
            kind: 'rule', id: 'l3-rule-check', title: 'قاعدة التحقّق',
            text: 'نتحقّق من الحل بمطابقة كل حلقة وإعادة جمع قيم المنازل؛ فالمجموع يجب أن يعيد العدد نفسه.',
          },
        ],
      },
      {
        id: 'l3-skills',
        title: 'المهارات بخطوات مرتّبة',
        blocks: [
          {
            kind: 'steps', id: 'l3-steps-read', title: 'مهارة ①: قراءة عدد بالصيغة اللفظية',
            steps: [
              'نجزّئ العدد من اليمين كل ثلاث خانات إلى حلقات.',
              'نقرأ من اليسار: حلقة الملايين أولاً، ثم حلقة الألوف، ثم حلقة الوحدات، ونذكر اسم كل حلقة بعد أرقامها.',
              'نقرأ أصفار الحلقة ضمنها؛ فالحلقة 002 تُقرأ «اثنان»، والحلقة 200 في الألوف تُقرأ «مئتا ألف».',
            ],
          },
          {
            kind: 'steps', id: 'l3-steps-write', title: 'مهارة ②: كتابة عدد بالصيغة القياسية من صيغته اللفظية',
            steps: [
              'نحدد كل حلقة من العبارة اللفظية: كم مليوناً؟ وكم ألفاً؟ وكم وحدة؟',
              'نضع كل رقم في خانته داخل جدول الخانات، ونضع صفراً في كل خانة فارغة لحفظ موضعها.',
              'نكتب الصيغة العددية (القياسية) بفواصل بين الحلقات.',
            ],
          },
          {
            kind: 'steps', id: 'l3-steps-expanded', title: 'مهارة ③: كتابة الصيغة التفصيلية',
            steps: [
              'نعيّن قيمة كل رقم بحسب خانته في جدول الخانات.',
              'نستغني عن الخانات الصفرية لأنّ قيمتها صفر.',
              'نكتب القيم حدوداً نجمعها فيما بينها بالترتيب من القيمة الأكبر إلى الأصغر.',
              'نتحقّق بإعادة جمع الحدود؛ فيجب أن نحصل على العدد نفسه.',
            ],
          },
          {
            kind: 'steps', id: 'l3-steps-digit-value', title: 'مهارة ④: إيجاد قيمة رقم معيّن في عدد',
            steps: [
              'نجزّئ العدد من اليمين إلى حلقات.',
              'نحدد اسم خانة الرقم المطلوب.',
              'نضرب: قيمة الرقم = الرقم × قيمة الخانة.',
            ],
          },
        ],
      },
      {
        id: 'l3-examples',
        title: 'أمثلة محلولة',
        blocks: [
          {
            kind: 'example', id: 'l3-ex-banknote', title: 'مثال ① — قراءة العدد وتفكيكه بالحلقات (ص 11)',
            question: <>العدد <MathExpression>2,413,155</MathExpression> يدل على نمرة الورقة النقدية وهو مكتوب بالصيغة العددية (القياسية). اقرؤه بالصيغة اللفظية واكتبه بالصيغة التفصيلية.</>,
            solution: [
              <>نجزّئ العدد من اليسار باستعمال الحلقات: <MathExpression>2 | 413 | 155</MathExpression>، أي <MathExpression>2</MathExpression> مليوناً و<MathExpression>413</MathExpression> ألفاً و<MathExpression>155</MathExpression>.</>,
              'نقرأ كل حلقة بالكلمات مع اسم الحلقة.',
              <>لكل رقم نكتب قيمة خانته: <MathExpression>2,000,000</MathExpression> و<MathExpression>400,000</MathExpression> و<MathExpression>10,000</MathExpression> و<MathExpression>3,000</MathExpression> و<MathExpression>100</MathExpression> و<MathExpression>50</MathExpression> و<MathExpression>5</MathExpression>.</>,
            ],
            answer: <>الصيغة اللفظية: مليونان وأربعمئة وثلاثة عشر ألفاً ومئة وخمسة وخمسون. الصيغة التفصيلية: <MathExpression>2,000,000 + 400,000 + 10,000 + 3,000 + 100 + 50 + 5</MathExpression>.</>,
            verification: 'نجمع حدود الصيغة التفصيلية من جديد فنحصل على 2,413,155 نفسه، وكل حلقة مطابقة لجدول الخانات.',
          },
          {
            kind: 'example', id: 'l3-ex-digit4', title: 'مثال ② — قيمة رقم في عدد (ص 10)',
            question: <>ما قيمة الرقم <MathExpression>4</MathExpression> في العدد <MathExpression>2,413,155</MathExpression>؟</>,
            solution: [
              <>نجزّئ العدد من اليمين: <MathExpression>155</MathExpression> (حلقة الوحدات)، <MathExpression>413</MathExpression> (حلقة الألوف)، <MathExpression>2</MathExpression> (حلقة الملايين).</>,
              <>الرقم <MathExpression>4</MathExpression> يقع في خانة مئات الألوف، وقيمة الخانة <MathExpression>100,000</MathExpression>.</>,
              <>إذن قيمة الرقم <MathExpression>4</MathExpression> هي: <MathExpression>4 × 100,000 = 400,000</MathExpression>.</>,
            ],
            answer: <><MathExpression>400,000</MathExpression></>,
            verification: 'الرقم 4 يقع داخل حلقة الألوف وأمامه خمس خانات، وهذا يوافق خانة مئات الألوف.',
          },
          {
            kind: 'example', id: 'l3-ex-wordform', title: 'مثال ③ — من الصيغة اللفظية إلى الصيغة العددية (ص 11)',
            question: 'اكتب العدد «مليونين وستمائة وخمسة آلاف ومئة وثلاث وسبعين» بالصيغة العددية.',
            solution: [
              <>نحدد كل حلقة من العبارة اللفظية: <MathExpression>2</MathExpression> مليوناً، و<MathExpression>605</MathExpression> آلاف، و<MathExpression>173</MathExpression> في الوحدات.</>,
              <>نضع كل رقم في خانته داخل جدول الخانات (مع الصفر في عشرات الألوف داخل <MathExpression>605</MathExpression>).</>,
              <>نكتب الصيغة العددية (القياسية): <MathExpression>2,605,173</MathExpression>.</>,
            ],
            answer: <><MathExpression>2,605,173</MathExpression></>,
            verification: <>نعيد التجزئة: <MathExpression>2 | 605 | 173</MathExpression> فتطابق العبارة اللفظية حلقة حلقة.</>,
          },
          {
            kind: 'example', id: 'l3-ex-zeros', title: 'مثال ④ — الصفر في خانة (ص 11 و12)',
            question: <>اكتب الصيغة التفصيلية والصيغة اللفظية للعدد <MathExpression>1,206,079</MathExpression>، وبيّن موضع الأصفار.</>,
            solution: [
              'نضع العدد في جدول الخانات: 1 في الملايين، 2 في مئات الألوف، 0 في عشرات الألوف، 6 في آحاد الألوف، 0 في المئات، 7 في العشرات، 9 في الآحاد.',
              'قيمة كل خانة فيها صفر تساوي صفراً، فلا نكتبها حدّاً في الصيغة التفصيلية.',
              'نقرأ الحلقات من اليسار: حلقة الملايين 1، وحلقة الألوف 206، وحلقة الوحدات 079.',
            ],
            answer: <>الصيغة التفصيلية: <MathExpression>1,206,079 = 1,000,000 + 200,000 + 6,000 + 70 + 9</MathExpression>. الصيغة اللفظية: مليون ومئتان وستة آلاف وتسعة وسبعون.</>,
            verification: 'مجموع الحدود يعيد 1,206,079، والأصفار محفوظة في الصيغة القياسية في عشرات الألوف والمئات.',
          },
          {
            kind: 'example', id: 'l3-ex-forms-drill', title: 'مثال ⑤ — التحويل بين الصيغ الثلاث (ص 10 · انطلاقة نشطة)',
            question: <>أ) ما الصيغة اللفظية للعدد <MathExpression>4,000</MathExpression>؟ ب) اكتب بالصيغة العددية: «ثلاثة آلاف وستمئة وخمسة وخمسون». ج) لأي عدد تصلح الصيغة التفصيلية <MathExpression>7,000 + 400 + 2</MathExpression>؟</>,
            solution: [
              <>أ) الرقم <MathExpression>4</MathExpression> يقع في خانة آحاد الألوف وأمامه ثلاثة أصفار، فيُقرأ «أربعة آلاف».</>,
              <>ب) نعين كل منزلة: <MathExpression>3</MathExpression> في الألوف، و<MathExpression>6</MathExpression> في المئات، و<MathExpression>5</MathExpression> في العشرات، و<MathExpression>5</MathExpression> في الآحاد.</>,
              <>ج) <MathExpression>7</MathExpression> في الألوف و<MathExpression>4</MathExpression> في المئات و<MathExpression>2</MathExpression> في الآحاد، مع غياب حد العشرات، فنضع صفراً في خانة العشرات لحفظ موضعها.</>,
            ],
            answer: <>أ) أربعة آلاف · ب) <MathExpression>3,655</MathExpression> · ج) <MathExpression>7,402</MathExpression>.</>,
            verification: 'عدد الأصفار على يمين الرقم يحدد خانته: ثلاثة أصفار تعني آحاد الألوف، وغياب حد في الصيغة التفصيلية يعني صفراً حافظاً في تلك الخانة.',
          },
          {
            kind: 'example', id: 'l3-ex-check1', title: 'مثال ⑥ — تحقّق من فهمك: الصيغة اللفظية الصحيحة (ص 12)',
            question: <>من الذي كتب الصيغة اللفظية للعدد <MathExpression>20,200,002</MathExpression> بشكل صحيح؟ لميس: «عشرون مليوناً ومئتان واثنان»، علاء: «عشرون مليونًا ومئتا ألف واثنان»، زيد: «20 مليوناً ومئتان واثنان».</>,
            solution: [
              <>نجزّئ العدد إلى حلقات: <MathExpression>20 | 200 | 002</MathExpression>.</>,
              'المجموعة الوسطى 200 تقع في حلقة الألوف، فلا يجوز إغفال كلمة «ألف».',
              'حلقة الوحدات 002 تُقرأ «اثنان» مع صفرين حافظين في المئات والعشرات.',
            ],
            answer: 'علاء: عشرون مليونًا ومئتا ألف واثنان.',
            verification: 'زيد كتب أرقاماً لا صيغة لفظية، ولميس حذفت كلمة «ألف» من الحلقة الوسطى؛ وحدها قراءة علاء تطابق الحلقات الثلاث.',
          },
          {
            kind: 'example', id: 'l3-ex-check2', title: 'مثال ⑦ — تحقّق من فهمك: الحد الناقص في الصيغة التفصيلية (ص 12)',
            question: <>ما العدد الناقص في الصيغة التفصيلية: <MathExpression>2,340,801 = 2,000,000 + \u2026 + 40,000 + 800 + 1</MathExpression>؟ أي ما قيمة الرقم <MathExpression>3</MathExpression> في العدد <MathExpression>2,340,801</MathExpression>؟</>,
            solution: [
              <>نقارن العدد بالحدود الموجودة: <MathExpression>2,000,000</MathExpression> (الملايين)، <MathExpression>40,000</MathExpression> (عشرات الألوف)، <MathExpression>800</MathExpression> (المئات)، <MathExpression>1</MathExpression> (الآحاد).</>,
              'الرقم الذي لم يُكتب حدّه هو 3 في خانة مئات الألوف.',
              <>قيمة الرقم <MathExpression>3</MathExpression> هي <MathExpression>3 × 100,000 = 300,000</MathExpression>.</>,
            ],
            answer: <>الحد الناقص هو <MathExpression>300,000</MathExpression>، فتصبح الصيغة الكاملة: <MathExpression>2,000,000 + 300,000 + 40,000 + 800 + 1</MathExpression>.</>,
            verification: 'بجمع الحدود من جديد نحصل على 2,340,801، وكل رقم في العدد صار له حد واحد فقط.',
          },
          {
            kind: 'example', id: 'l3-ex-check3', title: 'مثال ⑧ — تحقّق من فهمك: من اللفظي إلى القياسي والتفصيلي (ص 12)',
            question: 'اكتب العدد «سبعة ملايين وخمسمئة وسبعة وخمسون ألفاً واثنان» بالصيغة العددية، ثم بالصيغة التفصيلية.',
            solution: [
              'حلقة الملايين: 7.',
              'حلقة الألوف: 557 (خمسمئة وسبعة وخمسون ألفاً).',
              'حلقة الوحدات: 002 (اثنان في الآحاد وصفران حافظان في المئات والعشرات).',
              <>نكتب الصيغة العددية ثم نفكك كل رقم إلى قيمة خانته.</>,
            ],
            answer: <>الصيغة العددية: <MathExpression>7,557,002</MathExpression>، والصيغة التفصيلية: <MathExpression>7,000,000 + 500,000 + 50,000 + 7,000 + 2</MathExpression>.</>,
            verification: 'نملأ الخانات من اليمين (الآحاد، العشرات، المئات، آحاد الألوف، عشرات الألوف، مئات الألوف، الملايين) فنجد أن العدد نفسه يتكوّن من جديد.',
          },
          {
            kind: 'example', id: 'l3-ex-murad', title: 'مثال ⑨ — اكتشف الخطأ: قراءة مراد (ص 14 · التمرين 11)',
            question: <>كتب مراد في دفتر واجباته العدد <MathExpression>5,305,707</MathExpression> بالصيغة اللفظية: «خمسة ملايين وثلاثمئة وخمسة آلاف وسبعمئة». ما الخطأ الذي ارتكبه مراد؟</>,
            solution: [
              <>نقسم العدد إلى حلقات: <MathExpression>5 | 305 | 707</MathExpression>.</>,
              'نقارن آخر ثلاث خانات (707) بما كتبه مراد في نهاية العبارة.',
              'حلقة الوحدات 707 تُقرأ «سبعمئة وسبعة»، فقد أُهمل الرقم 7 في الآحاد.',
            ],
            answer: 'أُهمل رقم الآحاد 7 في حلقة الوحدات، والصواب: خمسة ملايين وثلاثمئة وخمسة آلاف وسبعمئة وسبعة.',
            verification: 'نعيد كتابة العدد من الصيغة اللفظية الصحيحة فنحصل على 5,305,707؛ أما قراءة مراد فتعطي 5,305,700 وهو عدد مختلف.',
          },
          {
            kind: 'example', id: 'l3-ex-zero-value', title: 'مثال ⑩ — اكتشف الخطأ: قيمة الرقم في حلقة الألوف',
            question: <>كتب طالب أن <MathExpression>4,008,050 = 4,000,000 + 80,000 + 50</MathExpression>. ما الخطأ الذي وقع فيه؟</>,
            solution: [
              <>ننظر إلى حلقة الألوف <MathExpression>008</MathExpression>: الصفران في مئات الألوف وعشرات الألوف يحفظان مكان الرقم <MathExpression>8</MathExpression> في آحاد الألوف.</>,
              <>إذن قيمة الرقم <MathExpression>8</MathExpression> هي <MathExpression>8,000</MathExpression> وليست <MathExpression>80,000</MathExpression>.</>,
            ],
            answer: <>التفصيل الصحيح هو <MathExpression>4,008,050 = 4,000,000 + 8,000 + 50</MathExpression>؛ فالخطأ هو وضع الرقم <MathExpression>8</MathExpression> في عشرات الألوف مع أنه في آحاد الألوف.</>,
            verification: 'بجمع الحدود الصحيحة نحصل على 4,008,050، بينما جمع حدود الطالب يعطي 4,080,050.',
          },
        ],
      },
      {
        id: 'l3-warnings',
        title: 'أخطاء شائعة وتنبيهات',
        blocks: [
          {
            kind: 'note', id: 'l3-warn-delete-zeros', tone: 'warning',
            text: <>لا تحذف الأصفار من وسط العدد: كتابة <MathExpression>1,206,079</MathExpression> على صورة <MathExpression>12,679</MathExpression> خطأ؛ فالصفر يحفظ موقع الخانة في الصيغة القياسية، ونستغني عنه فقط عند كتابة حدود الجمع في الصيغة التفصيلية.</>,
          },
          {
            kind: 'note', id: 'l3-warn-period-name', tone: 'warning',
            text: 'لا تُسقط اسم الحلقة الوسطى: إذا كانت الحلقة الوسطى 200 فيجب أن نقول «مئتا ألف» لا «مئتان» فقط؛ لأن إغفال كلمة «ألف» يغيّر قيمة العدد.',
          },
          {
            kind: 'note', id: 'l3-tip-method', tone: 'tip',
            text: 'طريقة تفكير ثابتة: ابدأ من اليمين لتقسيم العدد كل ثلاث خانات، ثم اقرأ من اليسار: الملايين أولاً، ثم الألوف، ثم الوحدات، وبعد التحليل اجمع القيم للتحقق.',
          },
        ],
      },
    ],
  }
}
