'use client';

import dynamic from 'next/dynamic';

const WaterCycleExperience = dynamic(
  () => import('./water-cycle-experience').then((module) => module.WaterCycleExperience),
  { ssr: false, loading: () => <LoadingState /> },
);

export function WaterCycleLoader({ videoUrl }: { videoUrl: string }) {
  return <WaterCycleExperience videoUrl={videoUrl} />;
}

function LoadingState() {
  return <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-neutral-200 bg-white px-6 text-center" role="status" aria-live="polite"><div><span className="mx-auto mb-4 block h-9 w-9 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-700" aria-hidden="true" /><p className="font-semibold text-neutral-700">جاري تجهيز تجربة دورة الماء...</p></div></div>;
}
