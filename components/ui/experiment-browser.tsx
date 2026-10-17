'use client';

import { useState } from 'react';
import type { Experiment } from '@/types';
import { ExperimentCard } from '@/components/ui/experiment-card';
import { FilterTabs } from '@/components/ui/filter-tabs';

export function ExperimentBrowser({ experiments }: { experiments: Experiment[] }) {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const visibleExperiments = selectedGrade === null
    ? experiments
    : experiments.filter((experiment) => experiment.grade === selectedGrade);
  const availableCount = visibleExperiments.filter((experiment) => experiment.status === 'implemented').length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs selectedGrade={selectedGrade} onChange={setSelectedGrade} />
        <p className="text-sm text-neutral-600" aria-live="polite">
          <span className="font-semibold text-science-800">{availableCount} متاحة الآن</span>
          <span aria-hidden="true"> · </span>
          <span>في الصفوف الرابع والخامس والسادس</span>
        </p>
      </div>
      {visibleExperiments.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleExperiments.map((experiment) => <ExperimentCard key={experiment.slug} experiment={experiment} />)}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-600">
          لا توجد تجارب لهذا الصف حالياً.
        </p>
      )}
    </div>
  );
}
