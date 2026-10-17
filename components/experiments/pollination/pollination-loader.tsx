'use client';

import dynamic from 'next/dynamic';

const PollinationExperience = dynamic(
  () => import('./pollination-experience').then((module) => module.PollinationExperience),
  { ssr: false, loading: () => <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-neutral-200 bg-white px-6 text-center text-sm text-neutral-600" role="status">جاري تجهيز تجربة التلقيح...</div> },
);

export function PollinationLoader() {
  return <PollinationExperience />;
}
