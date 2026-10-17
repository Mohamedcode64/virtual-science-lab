export interface Grade {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  experimentCount: number;
  color: string;
  gradient: string;
  icon: string;
  topics: string[];
}

export interface Experiment {
  id: string;
  slug: string;
  /** Arabic title used throughout the learning experience. */
  title: string;
  titleEn: string;
  titleAr: string;
  description: string;
  descriptionEn: string;
  descriptionAr: string;
  grade: number;
  gradeId: number;
  category: string;
  categoryAr: string;
  videoUrl?: string;
  implemented: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  status: 'implemented' | 'planned';
  thumbnail?: string;
  isMock: boolean;
  objective: string;
  learningOutcomes: string[];
  materials: string[];
  steps: string[];
  result: string;
}

export interface Student {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
}

export interface ProjectMetadata {
  university: string;
  universityAr: string;
  faculty: string;
  facultyAr: string;
  projectTitle: string;
  projectTitleAr: string;
  supervisor: string;
  supervisorAr: string;
  students: Student[];
  developer: string;
  developerAr: string;
  copyright: string;
  copyrightAr: string;
  year: number;
}

export interface NavItem {
  label: string;
  labelAr: string;
  href: string;
}

export interface FooterLink {
  label: string;
  labelAr: string;
  href: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}
