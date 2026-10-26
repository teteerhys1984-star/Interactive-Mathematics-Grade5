export type RoundingResponseKind = 'number' | 'choice' | 'explanation'

export interface RoundingBookTask {
  id: string
  page: 15 | 16 | 17 | 18
  section: string
  prompt: string
  kind: RoundingResponseKind
  choices?: readonly string[]
  lineLabels?: readonly string[]
  /** Endpoints of the printed number line's numeric domain. */
  lineRange?: readonly [minimum: number, maximum: number]
  /** The operand students are asked to represent on this line. */
  lineTargetValue?: string
  /** Minor tick spacing copied from the printed number line. */
  lineTickStep?: number
  /** Major tick spacing when the source distinguishes major and minor marks. */
  lineMajorTickStep?: number
}

/** Page 15 facts as printed; the book does not ask learners to round these here. */
export const roundingBookFacts = {
  moonDistance: '385920',
  saharaArea: '5628000',
} as const

/**
 * Student-facing ledger of every printed worked example, check question and exercise branch on
 * textbook pages 15–18. Keys are stable source anchors; answer keys remain in teacher/lesson4.ts.
 */
export const roundingBookTasks: readonly RoundingBookTask[] = [
  { id: 'r4-p15-a1-580', page: 15, section: 'انطلاقة نشطة 1', prompt: 'استعمل مستقيم الأعداد لتمثيل 580، ثم قرّبه لأقرب مئة.', kind: 'number', lineLabels: ['500', '510', '520', '600'], lineRange: [500, 600], lineTargetValue: '580', lineTickStep: 10 },
  // Source crop, p. 15: range 300–400, major marks every 10 and minor marks halfway every 5; labels include 300، 310، 355، 400.
  { id: 'r4-p15-a2-315', page: 15, section: 'انطلاقة نشطة 2', prompt: 'استعمل مستقيم الأعداد لتمثيل 315، ثم قرّبه لأقرب مئة.', kind: 'number', lineLabels: ['300', '310', '355', '400'], lineRange: [300, 400], lineTargetValue: '315', lineTickStep: 5, lineMajorTickStep: 10 },
  { id: 'r4-p15-a3-1390', page: 15, section: 'انطلاقة نشطة 3', prompt: 'العدد 1390 مقرّباً لأقرب مئة هو:', kind: 'choice', choices: ['1400', '1399', '1300'] },
  { id: 'r4-p15-example-2137', page: 15, section: 'مثال محلول', prompt: 'استعمل مستقيم الأعداد لتقريب 2137 لأقرب ألف.', kind: 'number', lineLabels: ['2000', '2137', '3000'], lineRange: [2000, 3000], lineTargetValue: '2137', lineTickStep: 100 },

  { id: 'r4-p16-example-3482137', page: 16, section: 'مثال محلول', prompt: 'قرّب 3482137 إلى أقرب مئة ألف.', kind: 'number' },

  { id: 'r4-p17-example-3582137', page: 17, section: 'مثال محلول', prompt: 'قرّب 3582137 إلى أقرب مليون.', kind: 'number' },
  { id: 'r4-p17-check-a-moon', page: 17, section: 'تحقّق من فهمك أ', prompt: 'قرّب بُعد القمر عن الأرض، 385920 كيلومتراً، إلى أقرب ألف.', kind: 'number' },
  { id: 'r4-p17-check-b-sahara', page: 17, section: 'تحقّق من فهمك ب', prompt: 'قرّب مساحة الصحراء الكبرى، 5628000 كم²، إلى أقرب مليون.', kind: 'number' },
  { id: 'r4-p17-oral-rounding-steps', page: 17, section: 'تعبير شفهي', prompt: 'اشرح الخطوات التي نتبعها لتقريب عدد إلى منزلة محددة.', kind: 'explanation' },
  { id: 'r4-p17-practice-1-2957', page: 17, section: 'تدرّب 1', prompt: 'استعمل مستقيم الأعداد لتقريب 2957 إلى أقرب ألف.', kind: 'number', lineLabels: ['2000', '2600', '3000'], lineRange: [2000, 3000], lineTargetValue: '2957', lineTickStep: 100 },
  { id: 'r4-p17-practice-2-5856375', page: 17, section: 'تدرّب 2', prompt: 'استعمل مستقيم الأعداد لتقريب 5856375 إلى أقرب ألف.', kind: 'number', lineLabels: ['5856000', '5856400', '5857000'], lineRange: [5856000, 5857000], lineTargetValue: '5856375', lineTickStep: 100 },
  { id: 'r4-p17-practice-3-a', page: 17, section: 'تدرّب 3 أ', prompt: 'قرّب 1523099 إلى أقرب ألف.', kind: 'number' },
  { id: 'r4-p17-practice-3-b', page: 17, section: 'تدرّب 3 ب', prompt: 'قرّب 7932523 إلى أقرب ألف.', kind: 'number' },
  { id: 'r4-p17-practice-3-c', page: 17, section: 'تدرّب 3 ج', prompt: 'قرّب 2999700 إلى أقرب ألف.', kind: 'number' },
  { id: 'r4-p17-practice-3-d', page: 17, section: 'تدرّب 3 د', prompt: 'قرّب 50500005 إلى أقرب ألف.', kind: 'number' },
  { id: 'r4-p18-practice-4-digit-code', page: 18, section: 'الرقم السري 4', prompt: 'اكتب عدداً من أربع خانات يمكن تقريبه إلى 5000 لأقرب ألف، مستعملاً الأرقام 7 و6 و5 و1 مرة واحدة.', kind: 'number' },

  { id: 'r4-p18-practice-5-a', page: 18, section: 'تدرّب 5 أ', prompt: 'قرّب 254900 إلى أقرب مئة ألف.', kind: 'number' },
  { id: 'r4-p18-practice-5-b', page: 18, section: 'تدرّب 5 ب', prompt: 'قرّب 107306 إلى أقرب مئة ألف.', kind: 'number' },
  { id: 'r4-p18-practice-5-c', page: 18, section: 'تدرّب 5 ج', prompt: 'قرّب 445700 إلى أقرب عشرة آلاف.', kind: 'number' },
  { id: 'r4-p18-practice-5-d', page: 18, section: 'تدرّب 5 د', prompt: 'قرّب 285008 إلى أقرب عشرة آلاف.', kind: 'number' },
  { id: 'r4-p18-practice-5-e', page: 18, section: 'تدرّب 5 هـ', prompt: 'قرّب 1987549 إلى أقرب مليون.', kind: 'number' },
  { id: 'r4-p18-practice-5-f', page: 18, section: 'تدرّب 5 و', prompt: 'قرّب 705600 إلى أقرب مليون.', kind: 'number' },
  { id: 'r4-p18-practice-6-a', page: 18, section: 'تدرّب 6 أ', prompt: 'اكتب صح أو خطأ: 4315000 < 4382000.', kind: 'choice', choices: ['صح', 'خطأ'] },
  { id: 'r4-p18-practice-6-b', page: 18, section: 'تدرّب 6 ب', prompt: 'اكتب صح أو خطأ: 530019 > 610710.', kind: 'choice', choices: ['صح', 'خطأ'] },
  { id: 'r4-p18-practice-7-reason', page: 18, section: 'تدرّب 7', prompt: 'هل يختلف التقريب إلى خانة الملايين عن التقريب إلى خانة آحاد الألوف؟ اشرح لماذا.', kind: 'explanation' },
  { id: 'r4-p18-practice-8-a', page: 18, section: 'تدرّب 8 أ', prompt: 'قرّب 5326009 إلى الخانة المعلّمة بالأحمر (الملايين).', kind: 'number' },
  { id: 'r4-p18-practice-8-b', page: 18, section: 'تدرّب 8 ب', prompt: 'قرّب 1500990 إلى الخانة المعلّمة بالأحمر (الملايين).', kind: 'number' },
  { id: 'r4-p18-practice-8-c', page: 18, section: 'تدرّب 8 ج', prompt: 'قرّب 6998421 إلى الخانة المعلّمة بالأحمر (الملايين).', kind: 'number' },
  { id: 'r4-p18-practice-8-d', page: 18, section: 'تدرّب 8 د', prompt: 'قرّب 9236545 إلى الخانة المعلّمة بالأحمر (العشرات).', kind: 'number' },
  { id: 'r4-p18-practice-8-e', page: 18, section: 'تدرّب 8 هـ', prompt: 'قرّب 232698 إلى الخانة المعلّمة بالأحمر (الآحاد).', kind: 'number' },
  { id: 'r4-p18-practice-8-f', page: 18, section: 'تدرّب 8 و', prompt: 'قرّب 9215001 إلى الخانة المعلّمة بالأحمر (آحاد الألوف).', kind: 'number' },
  { id: 'r4-p18-practice-8-g', page: 18, section: 'تدرّب 8 ز', prompt: 'قرّب 235691 إلى الخانة المعلّمة بالأحمر (آحاد الألوف).', kind: 'number' },
  { id: 'r4-p18-practice-8-h', page: 18, section: 'تدرّب 8 ح', prompt: 'قرّب 4231659 إلى الخانة المعلّمة بالأحمر (المئات).', kind: 'number' },
  { id: 'r4-p18-practice-8-i', page: 18, section: 'تدرّب 8 ط', prompt: 'قرّب 3199245 إلى الخانة المعلّمة بالأحمر (مئات الألوف).', kind: 'number' },
  { id: 'r4-p18-practice-9-sweden', page: 18, section: 'تدرّب 9 · الجغرافية', prompt: 'تبلغ مساحة السويد 185180 كم². قرّب هذا العدد إلى أقرب عشرة آلاف.', kind: 'number' },
  { id: 'r4-p18-practice-10-eggs', page: 18, section: 'تدرّب 10', prompt: 'أنتج أحد الأفران 112880 رغيفاً في شهر. قرّب العدد إلى أقرب عشرة آلاف.', kind: 'number' },
  { id: 'r4-p18-practice-11-car', page: 18, section: 'تدرّب 11', prompt: 'اشترى طارق سيارة بمبلغ 1750000 ليرة سورية. قرّب المبلغ إلى أقرب مليون.', kind: 'number' },
  { id: 'r4-p18-practice-12-earth', page: 18, section: 'تدرّب 12', prompt: 'يبلغ نصف قطر الكرة الأرضية حوالي 6373000 متراً. قرّب العدد إلى أقرب مليون.', kind: 'number' },
  { id: 'r4-p18-practice-13-donation-million', page: 18, section: 'تدرّب 13 أ', prompt: 'تبرّع شخص بمبلغ 7480000 ليرة سورية. قرّب المبلغ إلى أقرب مليون.', kind: 'number' },
  { id: 'r4-p18-practice-13-donation-hundred-thousand', page: 18, section: 'تدرّب 13 ب', prompt: 'تبرّع شخص بمبلغ 7480000 ليرة سورية. قرّب المبلغ إلى أقرب مئة ألف.', kind: 'number' },
]

export const roundingAdditionalTasks = [
  { id: 'round-final-1', text: 'قرّب 4,682,137 إلى أقرب مليون.', kind: 'number' },
  { id: 'round-final-2', text: 'قرّب 6432 إلى أقرب ألف.', kind: 'number' },
  { id: 'round-final-3', text: 'صحّح: 6958421 إلى أقرب مليون = 6000000.', kind: 'number' },
  { id: 'round-final-4', text: 'اشرح لماذا يُقرّب 4768210 إلى أقرب عشرة آلاف إلى 4770000.', kind: 'explanation' },
  { id: 'round-final-5', text: 'قرّب 8347000 إلى أقرب مليون.', kind: 'number' },
] as const
