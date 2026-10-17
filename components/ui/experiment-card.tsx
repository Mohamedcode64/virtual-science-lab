import Link from 'next/link';
import type { Experiment } from '@/types';
import { getGradeById } from '@/data/grades';
import { cn } from '@/lib/utils';

interface ExperimentCardProps {
  experiment: Experiment;
  className?: string;
}

const categoryIcons: Record<string, string> = {
  الفيزياء: 'M12 3v18m-9-9h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4',
  الأحياء: 'M20 4c-8 0-14 4-14 11a5 5 0 005 5c7 0 11-6 11-14V4h-2zM4 20c2-4 5-7 10-10',
  الكيمياء: 'M9 3h6m-5 0v5.2L5.5 18a2 2 0 001.7 3h9.6a2 2 0 001.7-3L14 8.2V3M8 15h8',
  'علوم الأرض': 'M21 12a9 9 0 01-9 9m-3-1.5a7.5 7.5 0 010-15M12 3a9 9 0 000 18m-8-9h16',
};

export function ExperimentCard({ experiment, className }: ExperimentCardProps) {
  const gradeLabel = getGradeById(experiment.grade)?.nameAr.replace(' الابتدائي', '') ?? `الصف ${experiment.grade}`;

  return (
    <Link
      href={`/experiments/${experiment.slug}`}
      data-page-card
      className={cn(
        'group animated-border-card flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm focus-visible:outline-brand-600',
        className,
      )}
      aria-label={`افتح تجربة ${experiment.titleAr}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600">
          <svg className="animated-card-icon h-4 w-4 text-science-700" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d={categoryIcons[experiment.categoryAr] ?? categoryIcons['علوم الأرض']} />
          </svg>
          {experiment.categoryAr}
        </span>
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', experiment.status === 'implemented' ? 'bg-teal-50 text-teal-800' : 'bg-neutral-100 text-neutral-600')}>
          {experiment.status === 'implemented' ? 'متاحة الآن' : 'مخططة'}
        </span>
      </div>
      <h2 className="mb-2 text-lg font-bold leading-snug text-neutral-900 group-hover:text-brand-700">
        {experiment.titleAr}
      </h2>
      <p className="mb-5 flex-1 text-sm leading-7 text-neutral-600 line-clamp-2">{experiment.descriptionAr}</p>
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
        <span>{gradeLabel}</span>
        <span className={cn('inline-flex items-center gap-1.5 font-semibold', experiment.status === 'implemented' ? 'text-brand-700' : 'text-neutral-600')}>
          {experiment.status === 'implemented' ? 'شاهد التجربة' : 'عن موضوع التجربة'}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
