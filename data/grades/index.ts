import { Grade } from '@/types';

export const grades: Grade[] = [
  {
    id: 4,
    name: 'Grade 4',
    nameAr: 'الصف الرابع الابتدائي',
    description: 'Basic scientific concepts and simple experiments',
    descriptionAr: 'مفاهيم علمية أساسية وتجارب بسيطة',
    experimentCount: 8,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-700',
    icon: 'flask',
    topics: ['حالات المادة', 'النبات', 'المغناطيسية', 'دورة الماء', 'الضوء والظلال', 'الصوت', 'الآلات البسيطة', 'الطقس'],
  },
  {
    id: 5,
    name: 'Grade 5',
    nameAr: 'الصف الخامس الابتدائي',
    description: 'Intermediate experiments and scientific method',
    descriptionAr: 'تجارب متوسطة والمنهج العلمي',
    experimentCount: 10,
    color: '#10B981',
    gradient: 'from-emerald-500 to-emerald-700',
    icon: 'molecule',
    topics: ['الدوائر الكهربائية', 'الأنظمة البيئية', 'خصائص المواد', 'النظام الشمسي', 'التفاعلات الكيميائية', 'أجهزة الجسم', 'القوى والحركة', 'الصخور والمعادن', 'انتقال الحرارة', 'الكائنات الدقيقة'],
  },
  {
    id: 6,
    name: 'Grade 6',
    nameAr: 'الصف السادس الابتدائي',
    description: 'Advanced concepts and complex experiments',
    descriptionAr: 'مفاهيم متقدمة وتجارب معقدة',
    experimentCount: 13,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-700',
    icon: 'chemistry',
    topics: ['بنية الخلية', 'الأحماض والقواعد', 'تحويلات الطاقة', 'أساسيات الوراثة', 'الغلاف الجوي', 'خصائص الموجات', 'المعادلات الكيميائية', 'التطور والتكيف', 'الكهرباء والمغناطيسية', 'موارد الأرض', 'الأدوات البصرية', 'العلوم البيئية'],
  },
];

export function getGradeById(id: number): Grade | undefined {
  return grades.find((grade) => grade.id === id);
}

export function getAllGrades(): Grade[] {
  return grades;
}
