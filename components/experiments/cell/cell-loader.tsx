'use client';

import dynamic from 'next/dynamic';

const CellExperience = dynamic(
  () => import('./cell-experience').then((module) => module.CellExperience),
  { ssr: false, loading: () => <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-neutral-200 bg-white px-6 text-center text-sm text-neutral-600" role="status">جاري تجهيز نموذج الخلية...</div> },
);

export function CellLoader() {
  return <CellExperience />;
}
