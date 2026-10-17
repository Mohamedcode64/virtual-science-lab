'use client';

import dynamic from 'next/dynamic';

const MagnetismExperience = dynamic(
  () => import('./magnetism-experience').then((module) => module.MagnetismExperience),
  { ssr: false, loading: () => <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-neutral-200 bg-white px-6 text-center text-sm text-neutral-600" role="status">جاري تجهيز تجربة المغناطيس...</div> },
);

export function MagnetismLoader() {
  return <MagnetismExperience />;
}
