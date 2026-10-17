'use client';

const filters = [
  { label: 'الكل', value: null },
  { label: 'الصف الرابع', value: 4 },
  { label: 'الصف الخامس', value: 5 },
  { label: 'الصف السادس', value: 6 },
] as const;

interface FilterTabsProps {
  selectedGrade: number | null;
  onChange: (grade: number | null) => void;
}

export function FilterTabs({ selectedGrade, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="تصفية التجارب حسب الصف">
      {filters.map((filter) => {
        const active = selectedGrade === filter.value;
        return (
          <button
            key={filter.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(filter.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-brand-600 ${active ? 'border-brand-700 bg-brand-700 text-white shadow-sm' : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:text-brand-700'}`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
