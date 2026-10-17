import Link from 'next/link';
import type { ReactNode } from 'react';
import { experiments } from '@/data/experiments';
import { getGradeById } from '@/data/grades';

const previewExperiments = experiments
  .filter((experiment) => experiment.status === 'implemented')
  .map((experiment) => ({
    ...experiment,
    gradeLabel: getGradeById(experiment.grade)?.nameAr.replace(' الابتدائي', '') ?? `الصف ${experiment.grade}`,
  }));


const categoryIcons: Record<string, ReactNode> = {
  الفيزياء: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  الأحياء: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  الكيمياء: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  'علوم الأرض': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9M9 9a9 9 0 000 18M9 9a9 9 0 010-18M9 9a9 9 0 0118 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

const categoryColors = {
  الفيزياء: { bg: 'bg-brand-100', text: 'text-brand-600' },
  الأحياء: { bg: 'bg-science-100', text: 'text-science-600' },
  الكيمياء: { bg: 'bg-accent-100', text: 'text-accent-600' },
  'علوم الأرض': { bg: 'bg-brand-100', text: 'text-brand-600' },
};

export function ExperimentsPreview() {
  return (
    <section className="section bg-neutral-50" dir="rtl" lang="ar" aria-labelledby="experiments-title">
      <div className="container">
        <header className="section-header">
          <span className="section-eyebrow">التعلم بالملاحظة والتجربة</span>
          <h2 id="experiments-title" data-page-heading className="section-title">منصة التجارب العلمية</h2>
          <p className="section-subtitle">
            تسع تجارب ثلاثية الأبعاد موزعة على الصفوف الرابع والخامس والسادس.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {previewExperiments.map((experiment) => {
            const categoryIcon = categoryIcons[experiment.categoryAr] || categoryIcons[experiment.category] || (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            );
            const catColors = categoryColors[experiment.categoryAr as keyof typeof categoryColors] || categoryColors[experiment.category as keyof typeof categoryColors] || { bg: 'bg-brand-100', text: 'text-brand-600' };

            return (
              <Link
                key={experiment.id}
                href={`/experiments/${experiment.slug}`}
                data-page-card
                className="card-interactive animated-border-card group flex h-full flex-col overflow-hidden p-5 lg:p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`animated-card-icon inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${catColors.bg} ${catColors.text}`}>
                    {categoryIcon}
                  </div>
                  <span className={experiment.status === 'implemented' ? 'badge badge-science' : 'badge bg-neutral-100 text-neutral-600'}>
                    {experiment.status === 'implemented' ? 'متاحة الآن' : 'ضمن الخطة'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-brand-700">{experiment.titleAr}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{experiment.descriptionAr}</p>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">{experiment.gradeLabel}</span>
                  <span className="text-sm font-medium text-brand-600 inline-flex items-center gap-1.5 transition-colors">
                    {experiment.status === 'implemented' ? 'شاهد التجربة' : 'عن موضوع التجربة'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/experiments"
            className="btn-secondary"
          >
            استكشف جميع موضوعات التجارب
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-3 text-sm text-neutral-500">
            {previewExperiments.length} تجارب تفاعلية متاحة الآن.
          </p>
        </div>
      </div>
    </section>
  );
}
