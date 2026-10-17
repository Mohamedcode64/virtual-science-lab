import type { Experiment } from '@/types';

type ExperimentSeed = Omit<Experiment, 'slug' | 'titleEn' | 'descriptionEn' | 'grade' | 'implemented' | 'status' | 'objective' | 'learningOutcomes' | 'materials' | 'steps' | 'result'>;

const experimentSeeds: ExperimentSeed[] = [
  {
    id: 'ph-scale',
    title: 'pH Scale',
    titleAr: 'مقياس الرقم الهيدروجيني',
    description: 'Compare common solutions and observe how dilution changes pH.',
    descriptionAr: 'قارن بين محاليل مألوفة ولاحظ أثر إضافة الماء في الرقم الهيدروجيني.',
    gradeId: 6,
    category: 'Chemistry',
    categoryAr: 'الكيمياء',
    difficulty: 'easy',
    duration: 15,
    isMock: false,
  },
  {
    id: 'electric-circuit',
    title: 'Electric Circuits',
    titleAr: 'الدَوائر الكهربائية',
    description: 'Build a complete circuit and observe how a switch controls a bulb.',
    descriptionAr: 'أكمل دائرة كهربائية بالمفتاح ولاحظ كيف تضيء اللمبة عند مرور التيار.',
    gradeId: 6,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'easy',
    duration: 15,
    isMock: false,
  },
  {
    id: 'cell',
    title: 'Cell Structure',
    titleAr: 'الخلية',
    description: 'Explore the structures of plant and animal cells and the jobs of their organelles.',
    descriptionAr: 'استكشف أجزاء الخلية النباتية والحيوانية ووظائف عضياتها.',
    gradeId: 6,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'medium',
    duration: 20,
    videoUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
    isMock: false,
  },
  // Grade 4 experiments
  {
    id: 'states-of-matter',
    title: 'States of Matter',
    titleAr: 'حالات المادة',
    description: 'Explore how particles behave in solids, liquids, and gases.',
    descriptionAr: 'غيّر درجة الحرارة ولاحظ كيف تتغير حركة الجسيمات في الحالات الصلبة والسائلة والغازية.',
    gradeId: 4,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'easy',
    duration: 15,
    videoUrl: 'https://www.youtube.com/watch?v=aWaHM2IyxIs',
    isMock: false,
  },
  {
    id: 'exp-4-2',
    title: 'Plant Parts and Functions',
    titleAr: 'أجزاء النبات ووظائفها',
    description: 'Learn about roots, stems, leaves, and flowers',
    descriptionAr: 'تعرف على الجذور والسيقان والأوراق والأزهار',
    gradeId: 4,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'easy',
    duration: 20,
    isMock: true,
  },
  {
    id: 'exp-4-3',
    title: 'Magnetism Basics',
    titleAr: 'أساسيات المغناطيسية',
    description: 'Discover magnetic poles and attraction',
    descriptionAr: 'اكتشف الأقطاب المغناطيسية والجاذبية',
    gradeId: 4,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'easy',
    duration: 15,
    isMock: true,
  },
  {
    id: 'water-cycle',
    title: 'Water Cycle',
    titleAr: 'دورة الماء',
    description: 'Follow water as it evaporates, forms clouds, falls as rain, and gathers again.',
    descriptionAr: 'تابع رحلة الماء من التبخر وتكوّن السحب إلى الهطول والتجمع من جديد.',
    gradeId: 4,
    category: 'Earth Science',
    categoryAr: 'علوم الأرض',
    difficulty: 'medium',
    duration: 25,
    videoUrl: 'https://www.youtube.com/watch?v=2BLiwaQ3T6c',
    isMock: false,
  },
  {
    id: 'magnetism',
    title: 'Magnetism',
    titleAr: 'المغناطيس',
    description: 'Investigate magnetic attraction, repulsion, field patterns, and distance.',
    descriptionAr: 'اختبر تأثير المغناطيس في المواد، ولاحظ التجاذب والتنافر وأثر المسافة.',
    gradeId: 4,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'easy',
    duration: 15,
    videoUrl: 'https://youtu.be/S-XNaiwHWqQ?si=FwEDkrqaWi-XbFDB',
    isMock: false,
  },
  {
    id: 'exp-4-5',
    title: 'Light and Shadows',
    titleAr: 'الضوء والظلال',
    description: 'How light travels and creates shadows',
    descriptionAr: 'كيف ينتقل الضوء ويصنع الظلال',
    gradeId: 4,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'easy',
    duration: 20,
    isMock: true,
  },
  {
    id: 'exp-4-6',
    title: 'Sound Vibrations',
    titleAr: 'اهتزازات الصوت',
    description: 'Feel and see how sound travels',
    descriptionAr: 'اشعر وشاهد كيف ينتقل الصوت',
    gradeId: 4,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'medium',
    duration: 20,
    isMock: true,
  },
  {
    id: 'exp-4-7',
    title: 'Simple Machines',
    titleAr: 'الآلات البسيطة',
    description: 'Levers, pulleys, and inclined planes',
    descriptionAr: 'الروافع والبكرات والمسطحات المائلة',
    gradeId: 4,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'medium',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-4-8',
    title: 'Weather Observation',
    titleAr: 'رصد الطقس',
    description: 'Measure temperature, wind, and rainfall',
    descriptionAr: 'قس درجة الحرارة والرياح والأمطار',
    gradeId: 4,
    category: 'Earth Science',
    categoryAr: 'علوم الأرض',
    difficulty: 'easy',
    duration: 15,
    isMock: true,
  },

  // Grade 5 experiments
  {
    id: 'exp-5-1',
    title: 'Electric Circuits',
    titleAr: 'الدوائر الكهربائية',
    description: 'Build series and parallel circuits',
    descriptionAr: 'ابنِ الدوائر المتسلسلة والمتوازية',
    gradeId: 5,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'medium',
    duration: 30,
    isMock: true,
  },
  {
    id: 'food-chain',
    title: 'Food Chain',
    titleAr: 'السلسلة الغذائية',
    description: 'Connect a producer and consumers to follow the flow of energy in an ecosystem.',
    descriptionAr: 'رتب كائنات السلسلة الغذائية لتتبع انتقال الطاقة من الشمس إلى الكائنات الحية.',
    gradeId: 5,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'medium',
    duration: 25,
    videoUrl: 'https://www.youtube.com/watch?v=kiNBXHvXAhg',
    isMock: false,
  },
  {
    id: 'photosynthesis',
    title: 'Photosynthesis',
    titleAr: 'البناء الضوئي',
    description: 'Activate sunlight, water, and carbon dioxide to explore how a plant makes food.',
    descriptionAr: 'فعّل ضوء الشمس والماء وثاني أكسيد الكربون لتتعرف كيف يصنع النبات غذاءه.',
    gradeId: 5,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'medium',
    duration: 20,
    videoUrl: 'https://www.youtube.com/watch?v=45Glfu8nGHo',
    isMock: false,
  },
  {
    id: 'pollination',
    title: 'Pollination in Flowering Plants',
    titleAr: 'التلقيح في النبات',
    description: 'Follow pollen from anthers to a flower stigma with a visiting pollinator.',
    descriptionAr: 'تابع انتقال حبوب اللقاح من المتك إلى الميسم بمساعدة النحلة.',
    gradeId: 5,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'easy',
    duration: 15,
    videoUrl: 'https://youtu.be/DEF5GnVJGsA?si=xZqosDrIJ8YSocR',
    isMock: false,
  },
  {
    id: 'exp-5-3',
    title: 'Properties of Materials',
    titleAr: 'خصائص المواد',
    description: 'Conductors, insulators, and thermal properties',
    descriptionAr: 'الموصلات والعوازل والخصائص الحرارية',
    gradeId: 5,
    category: 'Chemistry',
    categoryAr: 'الكيمياء',
    difficulty: 'medium',
    duration: 25,
    isMock: true,
  },
  {
    id: 'exp-5-4',
    title: 'Solar System',
    titleAr: 'النظام الشمسي',
    description: 'Planets, orbits, and space exploration',
    descriptionAr: 'الكواكب والمدارات واستكشاف الفضاء',
    gradeId: 5,
    category: 'Earth Science',
    categoryAr: 'علوم الأرض',
    difficulty: 'medium',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-5-5',
    title: 'Chemical Reactions',
    titleAr: 'التفاعلات الكيميائية',
    description: 'Observe safe chemical changes',
    descriptionAr: 'راقب التغيرات الكيميائية الآمنة',
    gradeId: 5,
    category: 'Chemistry',
    categoryAr: 'الكيمياء',
    difficulty: 'medium',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-5-6',
    title: 'Human Body Systems',
    titleAr: 'أجهزة جسم الإنسان',
    description: 'Digestive, respiratory, and circulatory systems',
    descriptionAr: 'الهضمي والتنفسي والدوري',
    gradeId: 5,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'medium',
    duration: 25,
    isMock: true,
  },
  {
    id: 'exp-5-7',
    title: 'Forces and Motion',
    titleAr: 'القوى والحركة',
    description: 'Friction, gravity, and Newton\'s laws',
    descriptionAr: 'الاحتكاك والجاذبية وقوانين نيوتن',
    gradeId: 5,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'hard',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-5-8',
    title: 'Rocks and Minerals',
    titleAr: 'الصخور والمعادن',
    description: 'Identify rock types and mineral properties',
    descriptionAr: 'حدد أنواع الصخور وخصائص المعادن',
    gradeId: 5,
    category: 'Earth Science',
    categoryAr: 'علوم الأرض',
    difficulty: 'easy',
    duration: 20,
    isMock: true,
  },
  {
    id: 'exp-5-9',
    title: 'Heat Transfer',
    titleAr: 'انتقال الحرارة',
    description: 'Conduction, convection, and radiation',
    descriptionAr: 'التوصيل والحمل والإشعاع',
    gradeId: 5,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'medium',
    duration: 25,
    isMock: true,
  },
  {
    id: 'exp-5-10',
    title: 'Microorganisms',
    titleAr: 'الكائنات الدقيقة',
    description: 'Bacteria, fungi, and their roles',
    descriptionAr: 'البكتيريا والفطريات وأدوارها',
    gradeId: 5,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'medium',
    duration: 20,
    isMock: true,
  },

  // Grade 6 experiments
  {
    id: 'exp-6-1',
    title: 'Cell Structure',
    titleAr: 'بنية الخلية',
    description: 'Plant and animal cell organelles',
    descriptionAr: 'عضيات الخلية النباتية والحيوانية',
    gradeId: 6,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'medium',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-6-2',
    title: 'Acids and Bases',
    titleAr: 'الأحماض والقواعد',
    description: 'pH scale and neutralization reactions',
    descriptionAr: 'مقياس الأس الهيدروجيني وتفاعلات التعادل',
    gradeId: 6,
    category: 'Chemistry',
    categoryAr: 'الكيمياء',
    difficulty: 'medium',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-6-3',
    title: 'Energy Transformations',
    titleAr: 'تحويلات الطاقة',
    description: 'Potential, kinetic, and energy conservation',
    descriptionAr: 'الطاقة الكامنة والحركية وحفظ الطاقة',
    gradeId: 6,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'hard',
    duration: 35,
    isMock: true,
  },
  {
    id: 'exp-6-4',
    title: 'Genetics Basics',
    titleAr: 'أساسيات الوراثة',
    description: 'Traits, inheritance, and DNA introduction',
    descriptionAr: 'الصفات والوراثة ومقدمة عن الحمض النووي',
    gradeId: 6,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'hard',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-6-5',
    title: 'Atmosphere and Climate',
    titleAr: 'الغلاف الجوي والمناخ',
    description: 'Layers, greenhouse effect, climate change',
    descriptionAr: 'الطبقات وتأثير الاحتباس الحراري وتغير المناخ',
    gradeId: 6,
    category: 'Earth Science',
    categoryAr: 'علوم الأرض',
    difficulty: 'medium',
    duration: 25,
    isMock: true,
  },
  {
    id: 'exp-6-6',
    title: 'Wave Properties',
    titleAr: 'خصائص الموجات',
    description: 'Frequency, amplitude, wavelength',
    descriptionAr: 'التردد والسعة وطول الموجة',
    gradeId: 6,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'hard',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-6-7',
    title: 'Chemical Equations',
    titleAr: 'المعادلات الكيميائية',
    description: 'Balancing equations and reaction types',
    descriptionAr: 'الموازنة بين المعادلات وأنواع التفاعلات',
    gradeId: 6,
    category: 'Chemistry',
    categoryAr: 'الكيمياء',
    difficulty: 'hard',
    duration: 35,
    isMock: true,
  },
  {
    id: 'exp-6-8',
    title: 'Evolution and Adaptation',
    titleAr: 'التطور والتكيف',
    description: 'Natural selection and species adaptation',
    descriptionAr: 'الانتخاب الطبيعي وتكيف الأنواع',
    gradeId: 6,
    category: 'Biology',
    categoryAr: 'الأحياء',
    difficulty: 'medium',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-6-9',
    title: 'Electricity and Magnetism',
    titleAr: 'الكهرباء والمغناطيسية',
    description: 'Electromagnets and motors',
    descriptionAr: 'الكهرومغناطيس والمحركات',
    gradeId: 6,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'hard',
    duration: 35,
    isMock: true,
  },
  {
    id: 'exp-6-10',
    title: 'Earth\'s Resources',
    titleAr: 'موارد الأرض',
    description: 'Renewable vs non-renewable resources',
    descriptionAr: 'الموارد المتجددة وغير المتجددة',
    gradeId: 6,
    category: 'Earth Science',
    categoryAr: 'علوم الأرض',
    difficulty: 'medium',
    duration: 25,
    isMock: true,
  },
  {
    id: 'exp-6-11',
    title: 'Optical Instruments',
    titleAr: 'الأدوات البصرية',
    description: 'Lenses, microscopes, telescopes',
    descriptionAr: 'العدسات والمجاهر والمناظير',
    gradeId: 6,
    category: 'Physics',
    categoryAr: 'الفيزياء',
    difficulty: 'hard',
    duration: 30,
    isMock: true,
  },
  {
    id: 'exp-6-12',
    title: 'Environmental Science',
    titleAr: 'العلوم البيئية',
    description: 'Pollution, conservation, sustainability',
    descriptionAr: 'التلوث والحفاظ والاستدامة',
    gradeId: 6,
    category: 'Earth Science',
    categoryAr: 'علوم الأرض',
    difficulty: 'medium',
    duration: 30,
    isMock: true,
  },
];

const categoryLearningOutcomes: Record<string, string[]> = {
  الفيزياء: ['تفسير الظاهرة الفيزيائية وملاحظة أثر تغيّر العوامل.', 'مقارنة النتائج وتسجيل الملاحظات بدقة.'],
  الأحياء: ['التعرّف إلى أجزاء الكائنات الحية ووظائفها.', 'ربط التكيف أو التركيب بدوره في حياة الكائن.'],
  الكيمياء: ['ملاحظة خصائص المواد والتغيرات التي تطرأ عليها.', 'تصنيف المواد واستخلاص نتيجة من المشاهدة.'],
  'علوم الأرض': ['فهم علاقة الظاهرة بسطح الأرض أو بيئتها.', 'وصف التغيرات الطبيعية وأثرها في الموارد والكائنات.'],
};

const categoryMaterials: Record<string, string[]> = {
  الفيزياء: ['نماذج تعليمية للظاهرة', 'أدوات القياس أو الملاحظة', 'دفتر لتسجيل النتائج'],
  الأحياء: ['صور أو نماذج للكائنات الحية', 'بطاقات ملاحظة', 'دفتر لتسجيل النتائج'],
  الكيمياء: ['نماذج آمنة للمواد', 'بطاقات تصنيف', 'دفتر لتسجيل النتائج'],
  'علوم الأرض': ['خرائط أو صور تعليمية', 'نماذج للظاهرة الطبيعية', 'دفتر لتسجيل النتائج'],
};

const implementedExperimentIds = new Set([
  'ph-scale',
  'electric-circuit',
  'water-cycle',
  'states-of-matter',
  'food-chain',
  'photosynthesis',
  'magnetism',
  'pollination',
  'cell',
]);

export const experiments: Experiment[] = experimentSeeds
  .filter((seed) => implementedExperimentIds.has(seed.id))
  .sort((left, right) => left.gradeId - right.gradeId)
  .map((seed) => ({
  ...seed,
  slug: seed.id === 'ph-scale' ? 'ph-scale' : seed.id,
  title: seed.titleAr,
  titleEn: seed.title,
  description: seed.descriptionAr,
  descriptionEn: seed.description,
  grade: seed.gradeId,
  implemented: implementedExperimentIds.has(seed.id),
  status: implementedExperimentIds.has(seed.id) ? 'implemented' : 'planned',
  isMock: !implementedExperimentIds.has(seed.id),
  objective: seed.id === 'ph-scale'
    ? 'التعرف على الرقم الهيدروجيني وتمييز المحاليل الحمضية والقاعدية والمتعادلة وملاحظة أثر التخفيف.'
    : seed.id === 'electric-circuit'
      ? 'التعرّف على أجزاء الدائرة الكهربائية وملاحظة أن إغلاق المفتاح يكمل مسار التيار فيضيء المصباح.'
      : seed.id === 'water-cycle'
        ? 'تتبّع انتقال الماء بين سطح الأرض والهواء من خلال التبخر والتكاثف والهطول والتجمع.'
        : seed.id === 'states-of-matter'
          ? 'مقارنة ترتيب الجسيمات وحركتها في الحالات الصلبة والسائلة والغازية عند تغيير الحرارة.'
          : seed.id === 'food-chain'
            ? 'ترتيب المنتج والمستهلكين لتوضيح انتقال الطاقة من الشمس عبر السلسلة الغذائية.'
            : seed.id === 'photosynthesis'
              ? 'توضيح كيف تستخدم أوراق النبات الضوء والماء وثاني أكسيد الكربون لصنع الغذاء وإطلاق الأكسجين.'
              : seed.id === 'magnetism'
                ? 'مقارنة تأثير المغناطيس في الحديد والبلاستيك، وملاحظة أثر الأقطاب والمسافة في قوة التجاذب أو التنافر.'
                : seed.id === 'pollination'
                  ? 'تتبّع انتقال حبوب اللقاح من المتك إلى الميسم ودور النحلة في إتمام التلقيح.'
                  : seed.id === 'cell'
                    ? 'استكشاف أجزاء الخلية النباتية والحيوانية وربط كل عضية بوظيفتها.'
                    : `استكشاف ${seed.titleAr} وفهم الفكرة العلمية المخطط أن تعرضها التجربة: ${seed.descriptionAr}.`,
  learningOutcomes: seed.id === 'ph-scale'
    ? ['تصنيف المحلول باستخدام مقياس الرقم الهيدروجيني.', 'ملاحظة كيف يقترب الرقم الهيدروجيني من التعادل عند تخفيف المحلول بالماء.']
    : seed.id === 'electric-circuit'
      ? ['تسمية البطارية والأسلاك والمفتاح والمصباح في نموذج الدائرة.', 'مقارنة الدائرة المفتوحة بالمغلقة وشرح أثر المفتاح في إضاءة المصباح.']
      : seed.id === 'water-cycle'
        ? ['ترتيب مراحل دورة الماء: التبخر والتكاثف والهطول والتجمع.', 'شرح دور الشمس والسحب والمياه السطحية في استمرار الدورة.']
        : seed.id === 'states-of-matter'
          ? ['وصف ترتيب الجسيمات وحركتها في كل حالة.', 'التعرف على الانصهار والتبخر والتكاثف والتجمد كتغيرات تقريبية في الحالة.']
          : seed.id === 'food-chain'
            ? ['تمييز المنتج عن المستهلك والحيوان العاشب والمفترس.', 'توضيح اتجاه انتقال الطاقة في مثال لسلسلة غذائية.']
            : seed.id === 'photosynthesis'
              ? ['تحديد الضوء والماء وثاني أكسيد الكربون كمدخلات للعملية.', 'شرح أن الغذاء والأكسجين من نواتج البناء الضوئي.']
              : seed.id === 'magnetism'
                ? ['تمييز المواد التي يجذبها المغناطيس عن المواد غير المغناطيسية.', 'مقارنة التجاذب والتنافر وملاحظة أثر المسافة بين الأقطاب.']
                : seed.id === 'pollination'
                  ? ['تحديد المتك والميسم في الزهرة.', 'شرح كيف تنقل النحلة حبوب اللقاح لإتمام التلقيح.']
                  : seed.id === 'cell'
                    ? ['تسمية العضيات الرئيسة في الخلية.', 'ربط شكل كل عضية بوظيفتها داخل الخلية.']
                    : [
                      ...(categoryLearningOutcomes[seed.categoryAr] ?? []),
                      `شرح المفهوم المرتبط بموضوع ${seed.titleAr} بكلمات واضحة.`,
                    ],
  materials: seed.id === 'ph-scale'
    ? ['كأس المحلول', 'مسبار قياس الرقم الهيدروجيني', 'ماء للتخفيف']
    : seed.id === 'electric-circuit'
      ? ['بطارية تعليمية', 'أسلاك توصيل', 'مفتاح كهربائي', 'مصباح صغير']
      : seed.id === 'magnetism'
        ? ['مغناطيس قضيب', 'عينة حديدية', 'جسم بلاستيكي', 'مغناطيس اختبار']
        : seed.id === 'pollination'
          ? ['زهرتان نموذجيتان', 'متك يحمل حبوب اللقاح', 'ميسم', 'نحلة ملقحة']
          : seed.id === 'cell'
            ? ['نموذج ثلاثي الأبعاد لخلية نباتية أو حيوانية', 'أجزاء الخلية وعضياتها']
            : categoryMaterials[seed.categoryAr] ?? ['نماذج تعليمية', 'بطاقات ملاحظة', 'دفتر لتسجيل النتائج'],
  steps: seed.id === 'ph-scale'
    ? ['اختر محلولاً مألوفاً وأضف كمية إلى الكأس.', 'حرّك المسبار داخل المحلول واقرأ قيمة الرقم الهيدروجيني.', 'أضف الماء ولاحظ كيف تتغير القراءة والتصنيف.']
    : seed.id === 'electric-circuit'
      ? ['لاحظ أن المفتاح مفتوح والمصباح مطفأ.', 'أغلق المفتاح وراقب مسار التيار التوضيحي وإضاءة المصباح.', 'افتح المفتاح مرة أخرى ولاحظ توقف التيار وانطفاء المصباح.']
      : seed.id === 'water-cycle'
        ? ['شغّل الدورة ولاحظ ارتفاع بخار الماء.', 'تابع تكوّن السحب عند تبرد البخار.', 'راقب سقوط المطر وعودة الماء إلى البحيرة.']
        : seed.id === 'states-of-matter'
          ? ['ابدأ بالجسيمات المتقاربة في الحالة الصلبة.', 'ارفع الحرارة تدريجياً ولاحظ الانصهار ثم التبخر.', 'اخفضها ولاحظ التكاثف ثم التجمد.']
          : seed.id === 'food-chain'
            ? ['اختر الشمس بوصفها مصدر الطاقة.', 'أضف النبات المنتج ثم الحيوان العاشب.', 'أكمل السلسلة بالحيوان المفترس ولاحظ مسار الطاقة.']
            : seed.id === 'photosynthesis'
              ? ['فعّل ضوء الشمس والماء وثاني أكسيد الكربون.', 'تابع وصول المواد إلى الأوراق.', 'لاحظ ظهور الغذاء وخروج الأكسجين.']
              : seed.id === 'magnetism'
                ? ['اختر جسماً حديدياً أو غير مغناطيسي.', 'غيّر المسافة بينه وبين المغناطيس.', 'اختبر قطبي مغناطيس آخر ولاحظ التجاذب أو التنافر.']
                : seed.id === 'pollination'
                  ? ['لاحظ حبوب اللقاح على متك الزهرة الأولى.', 'ابدأ زيارة النحلة للزهرة.', 'تابع وصول حبوب اللقاح إلى ميسم الزهرة الثانية.']
                  : seed.id === 'cell'
                    ? ['اختر خلية نباتية أو حيوانية.', 'حدد عضية من القائمة أو من النموذج.', 'اقرأ اسم العضية ووظيفتها ثم أعد العرض.']
                    : [],
  result: seed.id === 'ph-scale'
    ? 'تُظهر القراءة ما إذا كان المحلول حمضياً أو قاعدياً أو متعادلاً، وتقترب من 7 عند تخفيف المحلول بالماء.'
    : seed.id === 'electric-circuit'
      ? 'تضيء اللمبة عندما يغلق المفتاح مسار الدائرة، وتنطفئ عند فتحه. حركة التيار المعروضة نموذج تعليمي مبسط.'
      : seed.id === 'water-cycle'
        ? 'يتحرك الماء في دورة متواصلة بين سطح الأرض والهواء عبر التبخر والتكاثف والهطول والتجمع.'
        : seed.id === 'states-of-matter'
          ? 'يساعد التسخين والتبريد على تغيير حركة الجسيمات وحالة المادة في هذا النموذج التعليمي التقريبي.'
          : seed.id === 'food-chain'
            ? 'في هذا المثال تنتقل الطاقة من الشمس إلى النبات ثم إلى الحيوان العاشب فالحيوان المفترس.'
            : seed.id === 'photosynthesis'
              ? 'تستخدم النباتات الضوء والماء وثاني أكسيد الكربون لصنع الغذاء، وتطلق الأكسجين.'
              : seed.id === 'magnetism'
                ? 'يجذب المغناطيس الحديد، وتجذب الأقطاب المختلفة بعضها بينما تتنافر الأقطاب المتشابهة. يضعف التأثير كلما زادت المسافة.'
                : seed.id === 'pollination'
                  ? 'ينقل الملقّح حبوب اللقاح من المتك إلى الميسم، فتبدأ عملية التلقيح التي تساعد النبات على تكوين البذور.'
                  : seed.id === 'cell'
                    ? 'تعمل عضيات الخلية معاً؛ فالنواة تنظم أنشطة الخلية، والميتوكوندريا تطلق الطاقة، والغشاء ينظم مرور المواد.'
                    : `ستُضاف محاكاة تعليمية وخطوات مخصصة لموضوع ${seed.titleAr} عند تطوير هذه التجربة.`,
}));

export function getExperimentsByGrade(gradeId: number): Experiment[] {
  return experiments.filter((exp) => exp.gradeId === gradeId);
}

export function getExperimentById(id: string): Experiment | undefined {
  return experiments.find((exp) => exp.id === id || exp.slug === id);
}

export function getExperimentBySlug(slug: string): Experiment | undefined {
  return experiments.find((exp) => exp.slug === slug);
}

export function getAllExperiments(): Experiment[] {
  return experiments;
}
