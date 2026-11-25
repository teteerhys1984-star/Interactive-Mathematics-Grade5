import { CoordinatesGrid } from '../../components/lesson/CoordinatesGrid'
import { MathExpression } from '../../components/MathExpression'
import type { NotebookDoc } from '../types'

/**
 * «دفتر الطالب» — الدرس الأول: شبكة الإحداثيات (الكتاب ص 3–4).
 *
 * Sources (nothing here is invented):
 *  • `src/lessons/CoordinatesLesson.tsx` — the textbook «تعلّم» box (ص 3), the extended
 *    explanation «كيف نقرأ الزوج المرتب؟», the «اكتشف الخطأ» card and the lesson recap.
 *  • `src/teacher/lesson1.ts` — the answer key: `source-map` (الجامع الأموي (3,4)، باب كيسان
 *    (5,0)، باب الجابية (0,4)), `source-points` (A–E), `guided-4-2`, `mini-challenge`.
 *  • the A–E grid figure is the real `CoordinatesGrid` component (its default points are the
 *    book's points), so the student copies exactly what the platform drew.
 */
export function coordinatesNotebook(): NotebookDoc {
  return {
    lessonId: 'coordinates',
    lessonTitle: 'شبكة الإحداثيات',
    unit: 'الوحدة الأولى',
    pages: 'ص 3–4',
    sections: [
      {
        id: 'l1-terms',
        purpose: 'record',
        title: 'المفردات والتعريفات',
        blocks: [
          {
            kind: 'definition', id: 'l1-def-origin', term: 'مبدأ الإحداثيات',
            text: <>نقطة تقاطع المحورين الأفقي والشاقولي هي النقطة <MathExpression>O(0,0)</MathExpression> ونسمّيها مبدأ الإحداثيات.</>,
            source: 'الكتاب · ص 3 (صندوق «تعلّم»)',
          },
          {
            kind: 'definition', id: 'l1-def-axes', term: 'المحور الأفقي والمحور الشاقولي',
            text: <>المحور الأفقي هو المحور <MathExpression>X</MathExpression> ونقرأ عليه الحركة إلى اليمين، والمحور الشاقولي هو المحور <MathExpression>Y</MathExpression> ونقرأ عليه الحركة إلى الأعلى.</>,
            source: 'الكتاب · ص 3 (شبكة الإحداثيات)',
          },
          {
            kind: 'definition', id: 'l1-def-pair', term: 'الثنائية (الزوج المرتب)',
            text: <>تُكتب إحداثيات النقطة على صورة ثنائية مرتبة <MathExpression>(x,y)</MathExpression>: العدد الأول أفقي دائماً، والعدد الثاني شاقولي دائماً. مثال: <MathExpression>(7,3)</MathExpression> تعني <MathExpression>7</MathExpression> وحدات إلى اليمين و<MathExpression>3</MathExpression> وحدات إلى الأعلى.</>,
            source: 'الكتاب · ص 3',
          },
          {
            kind: 'definition', id: 'l1-def-coordinates', term: 'إحداثيات النقطة',
            text: <>هي الثنائية التي تحدّد موقع النقطة بالنسبة إلى مبدأ الإحداثيات، ونكتبها بجوار اسم النقطة هكذا: <MathExpression>A(5,9)</MathExpression>.</>,
            source: 'الكتاب · ص 3',
          },
        ],
      },
      {
        id: 'l1-rules',
        purpose: 'record',
        title: 'القواعد',
        blocks: [
          {
            kind: 'rule', id: 'l1-rule-move', title: 'قاعدة الانتقال إلى نقطة',
            text: <>للوصول إلى النقطة <MathExpression>(x,y)</MathExpression> نتحرّك <MathExpression>x</MathExpression> وحدات أفقياً (إلى اليمين) ثم <MathExpression>y</MathExpression> وحدات إلى الأعلى، انطلاقاً من مبدأ الإحداثيات دائماً.</>,
          },
          {
            kind: 'rule', id: 'l1-rule-horizontal', title: 'النقطة على المحور الأفقي',
            text: <>أي نقطة تقع على المحور الأفقي تمثّل ثنائية من الشكل <MathExpression>(عدد, 0)</MathExpression>؛ لأنّها لا ترتفع عن خط الأصل، أي إنّ إحداثيها الشاقولي <MathExpression>y = 0</MathExpression>. مثال: <MathExpression>(5,0)</MathExpression> و<MathExpression>(6,0)</MathExpression>.</>,
          },
          {
            kind: 'rule', id: 'l1-rule-vertical', title: 'النقطة على المحور الشاقولي',
            text: <>أي نقطة تقع على المحور الشاقولي تمثّل ثنائية من الشكل <MathExpression>(0, عدد)</MathExpression>؛ لأنّها لا تتحرك إلى اليمين، أي إنّ إحداثيها الأفقي <MathExpression>x = 0</MathExpression>. مثال: <MathExpression>(0,4)</MathExpression> و<MathExpression>(0,6)</MathExpression>.</>,
          },
          {
            kind: 'note', id: 'l1-note-order', tone: 'tip',
            text: 'شرط استعمال القاعدتين: نقرأ الثنائية بالترتيب نفسه دائماً، نتحرّك أولاً على المحور الأفقي ثم نتحرّك إلى الأعلى على المحور الشاقولي.',
          },
        ],
      },
      {
        id: 'l1-read-steps',
        purpose: 'record',
        title: 'المهارات بخطوات مرتّبة',
        blocks: [
          {
            kind: 'steps', id: 'l1-steps-read', title: 'مهارة ①: قراءة إحداثيات نقطة ممثّلة على الشبكة',
            steps: [
              <>ننطلق من النقطة المرسومة نفسها، لا من مبدأ الإحداثيات <MathExpression>O(0,0)</MathExpression>.</>,
              <>نقرأ العدد الأفقي أولاً من التدريج السفلي للمحور <MathExpression>X</MathExpression>: إنه الإحداثي الأول.</>,
              <>نقرأ العدد الشاقولي من التدريج الجانبي للمحور <MathExpression>Y</MathExpression>: إنه الإحداثي الثاني.</>,
              <>نكتب الثنائية بالترتيب <MathExpression>(x,y)</MathExpression> بجانب اسم النقطة؛ فمثلاً النقطة <MathExpression>C</MathExpression> الواقعة عند <MathExpression>5</MathExpression> وحدات أفقياً ووحدة واحدة شاقولياً تُكتب <MathExpression>C(5,1)</MathExpression>.</>,
            ],
          },
          {
            kind: 'steps', id: 'l1-steps-plot', title: 'مهارة ②: تمثيل نقطة من ثنائيتها على الشبكة',
            steps: [
              <>نبدأ من مبدأ الإحداثيات <MathExpression>O(0,0)</MathExpression> دائماً.</>,
              <>نقرأ العدد الأول؛ إنه الإحداثي <MathExpression>X</MathExpression>، فنتحرك بعدد الوحدات المساوي له على المحور الأفقي (إلى اليمين).</>,
              <>نقرأ العدد الثاني؛ إنه الإحداثي <MathExpression>Y</MathExpression>، فنتحرك بعدد الوحدات المساوي له على المحور الشاقولي (إلى الأعلى).</>,
              <>نضع النقطة عند التقاطع الذي وصلنا إليه، ونكتب اسمها أو ثنائيتها بجانبها. فمثلاً <MathExpression>A(5,9)</MathExpression> تعني <MathExpression>5</MathExpression> وحدات أفقياً ثم <MathExpression>9</MathExpression> وحدات شاقولياً.</>,
            ],
          },
        ],
      },
      {
        id: 'l1-map',
        purpose: 'record',
        title: 'جدول مواقع من خريطة دمشق القديمة',
        blocks: [
          {
            kind: 'table', id: 'l1-table-gates',
            title: 'مواقع تُقرأ من خريطة الكتاب (ص 3)',
            headers: ['الموقع', 'الثنائية', <>كيف نصل إليه من <MathExpression key="h3">O(0,0)</MathExpression></>],
            rows: [
              ['باب توما', <MathExpression key="v1">(7,3)</MathExpression>, '7 وحدات إلى اليمين ثم 3 وحدات إلى الأعلى'],
              ['باب شرقي', <MathExpression key="v2">(7,1)</MathExpression>, '7 وحدات إلى اليمين ثم وحدة واحدة إلى الأعلى'],
              ['باب كيسان', <MathExpression key="v3">(5,0)</MathExpression>, '5 وحدات إلى اليمين دون حركة إلى الأعلى (على المحور الأفقي)'],
              ['باب الجابية', <MathExpression key="v4">(0,4)</MathExpression>, 'لا نتحرك إلى اليمين، بل 4 وحدات إلى الأعلى (على المحور الشاقولي)'],
              ['الجامع الأموي', <MathExpression key="v5">(3,4)</MathExpression>, '3 وحدات إلى اليمين ثم 4 وحدات إلى الأعلى'],
            ],
            caption: 'خريطة الأبواب السبعة مطبوعة في الكتاب ص 3 ولم يُعَد رسمُها في المنصّة. الثنائيات (7,3) و(7,1) و(5,0) و(0,4) مكتوبة في نصّ الكتاب نفسه، أمّا إحداثيا الجامع الأموي (3,4) فقراءة تقريبية من خريطة الكتاب؛ لذلك اعتمد الرسم الورقي عند مراجعة هذه المواقع.',
          },
        ],
      },
      {
        id: 'l1-examples',
        purpose: 'practice',
        title: 'أمثلة محلولة',
        blocks: [
          {
            kind: 'example', id: 'l1-ex-map', title: 'مثال ① — نشاط الخريطة (الكتاب ص 3)',
            question: <>توجد في دمشق القديمة سبعة أبواب موضّحة في شبكة الإحداثيات، وإنّ إحداثيات النقطة التي يقع عندها باب شرقي هي <MathExpression>(7,1)</MathExpression>. ما إحداثيات النقطة التي يقع عندها الجامع الأموي؟ وإذا كان السائح في الموقع <MathExpression>O(0,0)</MathExpression>: أ) كم وحدة يتحرك نحو اليمين حتى يصل إلى باب كيسان؟ ب) كم وحدة يتحرك نحو الأعلى حتى يصل إلى باب الجابية؟</>,
            solution: [
              <>نقرأ العدد الأول من الثنائية على المحور الأفقي <MathExpression>X</MathExpression>، والعدد الثاني على المحور الشاقولي <MathExpression>Y</MathExpression>.</>,
              <>من خريطة الكتاب: الجامع الأموي يقع عند <MathExpression>3</MathExpression> وحدات أفقياً و<MathExpression>4</MathExpression> وحدات شاقولياً، أي <MathExpression>(3,4)</MathExpression>.</>,
              <>باب كيسان يقع على المحور الأفقي، لذلك إحداثيه الشاقولي يساوي صفراً: <MathExpression>(5,0)</MathExpression>؛ أي يتحرك السائح <MathExpression>5</MathExpression> وحدات نحو اليمين.</>,
              <>باب الجابية يقع على المحور الشاقولي، لذلك إحداثيه الأفقي يساوي صفراً: <MathExpression>(0,4)</MathExpression>؛ أي يتحرك السائح <MathExpression>4</MathExpression> وحدات نحو الأعلى.</>,
            ],
            answer: <>الجامع الأموي <MathExpression>(3,4)</MathExpression> · أ) <MathExpression>5</MathExpression> وحدات نحو اليمين · ب) <MathExpression>4</MathExpression> وحدات نحو الأعلى.</>,
            verification: <>كل نقطة على المحور الأفقي عددها الثاني صفر، وكل نقطة على المحور الشاقولي عددها الأول صفر؛ فالحركة الأفقية وحدها تعطي <MathExpression>(5,0)</MathExpression> والحركة الشاقولية وحدها تعطي <MathExpression>(0,4)</MathExpression>.</>,
          },
          {
            kind: 'example', id: 'l1-ex-points', title: 'مثال ② — تحقّق من فهمك (الكتاب ص 4)',
            question: 'اكتب إحداثيات النقاط A وB وC وD وE الممثلة على شبكة الإحداثيات الآتية:',
            figure: <CoordinatesGrid ariaLabel="شبكة إحداثيات عليها النقاط A وB وC وD وE المطلوب قراءة إحداثياتها" />,
            solution: [
              'نقرأ العدد الأفقي أولاً من التدريج السفلي للمحور X، ثم نقرأ العدد الشاقولي من التدريج الجانبي للمحور Y.',
              <>النقطة <MathExpression>A</MathExpression> على المحور الأفقي عند <MathExpression>1</MathExpression>، فإحداثياتها <MathExpression>A(1,0)</MathExpression>؛ والنقطة <MathExpression>B</MathExpression> على المحور الأفقي عند <MathExpression>3</MathExpression>، فإحداثياتها <MathExpression>B(3,0)</MathExpression>.</>,
              <>النقطة <MathExpression>C</MathExpression> عند <MathExpression>5</MathExpression> وحدات أفقياً ووحدة واحدة شاقولياً، فإحداثياتها <MathExpression>C(5,1)</MathExpression>.</>,
              <>النقطة <MathExpression>D</MathExpression> على المحور الشاقولي عند <MathExpression>4</MathExpression>، فإحداثياتها <MathExpression>D(0,4)</MathExpression>؛ والنقطة <MathExpression>E</MathExpression> عند <MathExpression>3</MathExpression> أفقياً و<MathExpression>3</MathExpression> شاقولياً، فإحداثياتها <MathExpression>E(3,3)</MathExpression>.</>,
            ],
            answer: <><MathExpression>A(1,0)</MathExpression>، <MathExpression>B(3,0)</MathExpression>، <MathExpression>C(5,1)</MathExpression>، <MathExpression>D(0,4)</MathExpression>، <MathExpression>E(3,3)</MathExpression>.</>,
            verification: <>النقطتان <MathExpression>A</MathExpression> و<MathExpression>B</MathExpression> على المحور الأفقي لأنّ <MathExpression>y = 0</MathExpression>، والنقطة <MathExpression>D</MathExpression> على المحور الشاقولي لأنّ <MathExpression>x = 0</MathExpression>، وهذا يوافق قاعدة المحاور.</>,
          },
          {
            kind: 'example', id: 'l1-ex-build', title: 'مثال ③ — بناء الإحداثيات من الحركة',
            question: <>إذا تحركنا <MathExpression>4</MathExpression> وحدات إلى اليمين ثم وحدتين إلى الأعلى انطلاقاً من <MathExpression>O(0,0)</MathExpression>، فما الإحداثيات؟</>,
            solution: [
              <>نبدأ من <MathExpression>O(0,0)</MathExpression>.</>,
              <>الحركة الأفقية تصف العدد الأول: <MathExpression>x = 4</MathExpression>.</>,
              <>الحركة الشاقولية تصف العدد الثاني: <MathExpression>y = 2</MathExpression>.</>,
              <>إذن النقطة هي <MathExpression>(4,2)</MathExpression>.</>,
            ],
            answer: <><MathExpression>(4,2)</MathExpression></>,
            figure: <CoordinatesGrid points={[]} selected={{ x: 4, y: 2 }} ariaLabel="شبكة إحداثيات تُمثّل عليها النقطة (4,2) بأربع وحدات أفقياً ووحدتين شاقولياً" />,
          },
          {
            kind: 'example', id: 'l1-ex-plot', title: 'مثال ④ — تمثيل نقطة معطاة',
            question: <>مثّل النقطة <MathExpression>(4,3)</MathExpression> على شبكة الإحداثيات.</>,
            solution: [
              <>نتحرك <MathExpression>4</MathExpression> وحدات على المحور الأفقي <MathExpression>X</MathExpression>.</>,
              <>ثم نتحرك <MathExpression>3</MathExpression> وحدات على المحور الشاقولي <MathExpression>Y</MathExpression>.</>,
              'نضع النقطة عند تقاطع العمود 4 مع الصف 3.',
            ],
            answer: <>موضع النقطة <MathExpression>(4,3)</MathExpression> هو تقاطع العمود <MathExpression>4</MathExpression> مع الصف <MathExpression>3</MathExpression>.</>,
            figure: <CoordinatesGrid points={[]} selected={{ x: 4, y: 3 }} ariaLabel="شبكة إحداثيات تُمثّل عليها النقطة (4,3) عند تقاطع العمود الرابع مع الصف الثالث" />,
          },
          {
            kind: 'example', id: 'l1-ex-challenge', title: 'مثال ⑤ — تحدٍّ إضافي: عدد الوحدات',
            question: <>ما عدد الوحدات التي نتحركها من <MathExpression>O(0,0)</MathExpression> إلى النقطة <MathExpression>(0,4)</MathExpression>؟</>,
            solution: [
              <>العدد الأول في <MathExpression>(0,4)</MathExpression> يساوي صفراً، لذلك لا توجد حركة أفقية.</>,
              <>العدد الثاني يساوي <MathExpression>4</MathExpression>، لذلك نتحرك <MathExpression>4</MathExpression> وحدات شاقولياً إلى الأعلى.</>,
            ],
            answer: '4 وحدات إلى الأعلى، دون أي حركة أفقية.',
          },
        ],
      },
      {
        id: 'l1-warnings',
        purpose: 'record',
        title: 'تنبيهات وأخطاء شائعة',
        blocks: [
          {
            kind: 'note', id: 'l1-warn-swap', tone: 'warning',
            text: <>لا تبدّل العددين: العدد الأول أفقي دائماً والثاني شاقولي دائماً. إذا أردنا تمثيل <MathExpression>(5,9)</MathExpression> فلا نضعها عند <MathExpression>(9,5)</MathExpression>؛ فوضع <MathExpression>9</MathExpression> أفقياً و<MathExpression>5</MathExpression> شاقولياً يعني أننا عكسنا <MathExpression>X</MathExpression> و<MathExpression>Y</MathExpression> ومثّلنا زوجاً مختلفاً.</>,
          },
          {
            kind: 'note', id: 'l1-warn-checklist', tone: 'tip',
            text: <>قبل كتابة الإجابة اسأل نفسك: هل بدأت من <MathExpression>O(0,0)</MathExpression>؟ هل قرأت <MathExpression>X</MathExpression> قبل <MathExpression>Y</MathExpression>؟ هل عددت المربعات حتى التقاطع الصحيح؟</>,
          },
        ],
      },
    ],
  }
}
