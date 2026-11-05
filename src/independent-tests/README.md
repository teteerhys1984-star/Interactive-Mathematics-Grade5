# الاختبارات المستقلة — دليل الإضافة

قسم دائم مستقل عن «منطقة الاختبارات» في `src/tests`، لأن هذا الأخير يفرض 20 سؤالاً لاختبار الدرس
و50–60 لاختبار الوحدة، ولا يعرض الحلول قبل تسليم المحاولة. كل اختبار هنا يتكوّن من **30 سؤالاً**
وحلوله متاحة دائماً في تبويب مستقل.

## إضافة اختبار جديد

1. أنشئ ملفاً جديداً باسم ينتهي بـ `.test.ts` داخل `src/independent-tests/definitions/`، مثلاً
   `unit-2.test.ts` أو `lesson-coordinates.test.ts`.
2. صدّر تعريفاً واحداً عبر `defineIndependentTest`:

```ts
import { defineIndependentTest, math, rich, text, choiceText } from '../authoring'

export default defineIndependentTest({
  id: 'independent-unit-2',            // يجب أن يطابق independent-<slug>
  number: 2,                            // رقم مستقل وفريد
  title: 'الاختبار المستقل الثاني — الوحدة الثانية كاملة',
  description: rich(text('...')),
  lessonIds: ['compare-order-natural-numbers', 'multiply-natural-numbers'], // نطاق صريح فقط
  questions: [
    {
      number: 1,
      lessonIds: ['compare-order-natural-numbers'], // درس أو أكثر لهذا السؤال
      style: 'multiple-choice',
      level: 'basic',
      prompt: rich(text('...'), math('...'), text('...')),
      options: [choiceText('q01-a', '...'), choiceText('q01-b', '...'), choiceText('q01-c', '...')],
      solution: {
        answer: rich(text('...')),
        idea: rich(text('...')),
        steps: [rich(text('...')), rich(text('...'))],
        why: rich(text('...')),
      },
    },
    // ... 29 سؤالاً آخر بالترتيب
  ],
})
```

3. شغّل `npm run independent-tests-check` و`npm run independent-tests-ui-check`.
4. لا تحتاج إلى تعديل التنقل أو الصفحات: `src/independent-tests/registry.ts` يكتشف كل ملفات
   `definitions/**/*.test.ts` عبر `import.meta.glob`، ويظهر الاختبار في قائمة الاختبارات وفي تبويب
   الحلول تلقائياً بالرقم الذي حددته. تبويب الحلول يعرض اختباراً واحداً في كل مرة
   (`#independent-tests/solutions/<الرقم>`) مع محدّد للانتقال بين الاختبارات.

## القيود التي يفرضها البناء والتحقق

- **30 سؤالاً بالضبط**، وأرقامها 1–30 بالترتيب.
- **30 حلاً**، مرتبطة أرقامها بأسئلة الاختبار نفسها. الحلول تُبنى من `solution` في كل سؤال،
  ولا تُنسخ إلى كائن السؤال؛ لذلك لا يمكن أن تتسرّب الإجابة إلى صفحة الاختبار.
- كل درس معلن في `lessonIds` يجب أن يغطيه سؤال واحد على الأقل، ولا يجوز لسؤال أن يغطي درساً خارج
  النطاق. يتحقق من وجود الدروس في سجل المنهج وأنها `available`.
- كل سؤال له `style` و`level`، و`prompt` غير فارغ. الاختيار من متعدد يتطلب 3–5 خيارات، ولا يجوز
  وضع `options` في نمط آخر.
- تنوّع إلزامي: **4 أنماط مختلفة على الأقل**، ولا يجوز أن يكون الاختبار كله اختياراً من متعدد،
  ويجب أن يمتد على مستويين على الأقل من `basic` / `medium` / `advanced`.
- كل حل يحتوي: `answer` و`idea` و`steps` (خطوتان على الأقل) و`why`، وكلها نصوص غير فارغة.
- النطاق مؤلَّف صراحةً: اختبار درس واحد، أو مجموعة دروس، أو وحدة، أو عدة وحدات. لا يُستنتج من
  محتوى المنهج في وقت التشغيل.

## الأنماط المتاحة

`multiple-choice` · `fill-blank` · `show-work` · `word-problem` · `compare` ·
`error-analysis` · `explain` · `multi-step` · `table-reading` · `draw`

تُشتق مساحة الإجابة المعروضة من النمط: خيارات، فراغ، مساحة حل مسطّرة، مقارنة، أو شبكة رسم.
الجدول الاختياري `table` يُعرض في صفحة الاختبار وفي مرجع الحل معاً.
