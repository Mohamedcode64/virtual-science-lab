import Link from 'next/link';
import type { Grade } from '@/types';
import { cn } from '@/lib/utils';
import { getExperimentsByGrade } from '@/data/experiments';

interface GradeCardProps {
  grade: Grade;
  className?: string;
}

export function GradeCard({ grade, className }: GradeCardProps) {
  const gradeExperiments = getExperimentsByGrade(grade.id);
  const availableCount = gradeExperiments.filter((experiment) => experiment.status === 'implemented').length;
  const plannedCount = gradeExperiments.length - availableCount;

  return (
    <Link
      href={`/grades/${grade.id}`}
      data-page-card
      className={cn(
        'group animated-border-card flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm focus-visible:outline-brand-600',
        className,
      )}
      aria-label={`استكشف تجارب ${grade.nameAr}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className={`animated-card-icon inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${grade.gradient} text-white`} aria-hidden="true">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 3h6m-5 0v5.2L5.5 18a2 2 0 001.7 3h9.6a2 2 0 001.7-3L14 8.2V3M8 15h8" />
            <path d="M7.2 18h9.6" />
          </svg>
        </span>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-600" aria-label={`${availableCount} تجارب متاحة و${plannedCount} موضوعاً مخططاً`}>
          {availableCount} متاحة · {plannedCount} مخططة
        </span>
      </div>
      <h2 className="mb-2 text-xl font-bold text-neutral-900 group-hover:text-brand-700">{grade.nameAr}</h2>
      <p className="mb-6 flex-1 text-sm leading-7 text-neutral-600">{grade.descriptionAr}</p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
        استكشف موضوعات الصف
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </Link>
  );
}
