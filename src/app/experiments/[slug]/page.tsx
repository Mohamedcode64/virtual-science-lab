import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/layout/layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { PageEntranceMotion } from '@/components/ui/page-entrance-motion';
import { PhScaleLoader } from '@/components/experiments/ph-scale/ph-scale-loader';
import { ElectricCircuitLoader } from '@/components/experiments/electric-circuit/electric-circuit-loader';
import { WaterCycleLoader } from '@/components/experiments/water-cycle/water-cycle-loader';
import { StatesOfMatterLoader } from '@/components/experiments/states-of-matter/states-of-matter-loader';
import { FoodChainLoader } from '@/components/experiments/food-chain/food-chain-loader';
import { PhotosynthesisLoader } from '@/components/experiments/photosynthesis/photosynthesis-loader';
import { MagnetismLoader } from '@/components/experiments/magnetism/magnetism-loader';
import { PollinationLoader } from '@/components/experiments/pollination/pollination-loader';
import { CellLoader } from '@/components/experiments/cell/cell-loader';
import { ExperimentStageAutofocus } from '@/components/experiments/shared/experiment-stage-autofocus';
import { getExperimentBySlug, getAllExperiments } from '@/data/experiments';
import { getGradeById } from '@/data/grades';
import type { Experiment } from '@/types';

type ExperimentPageProps = PageProps<'/experiments/[slug]'>;

export const metadata: Metadata = { title: 'التجربة العلمية' };

export function generateStaticParams() {
  return getAllExperiments().map((experiment) => ({ slug: experiment.slug }));
}

export default function ExperimentDetailPage({ params }: ExperimentPageProps) {
  return (
    <Layout>
      <Suspense fallback={<ExperimentPageLoading />}>
        <ExperimentDetailContent params={params} />
      </Suspense>
    </Layout>
  );
}

async function ExperimentDetailContent({ params }: Pick<ExperimentPageProps, 'params'>) {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);
  if (!experiment) notFound();

  const grade = getGradeById(experiment.grade);
  const difficulty = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'متقدم',
  }[experiment.difficulty];

  return (
    <PageEntranceMotion>
    <article className="bg-neutral-50 pb-16 pt-28 sm:pb-20" dir="rtl" lang="ar">
      <div className="container">
        <Breadcrumb items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'التجارب العلمية', href: '/experiments' },
          { label: experiment.titleAr, href: `/experiments/${experiment.slug}`, isCurrent: true },
        ]} />

        <header data-page-reveal className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Link href={`/grades/${experiment.grade}`} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800 hover:bg-brand-100">
              {grade?.nameAr ?? `الصف ${experiment.grade}`}
            </Link>
            <span className="rounded-full bg-white px-3 py-1 text-sm text-neutral-600 ring-1 ring-neutral-200">{experiment.categoryAr}</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm text-neutral-600 ring-1 ring-neutral-200">مستوى {difficulty}</span>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${experiment.status === 'implemented' ? 'bg-science-50 text-science-800' : 'bg-neutral-100 text-neutral-600'}`}>
              {experiment.status === 'implemented' ? 'تجربة تفاعلية متاحة' : 'ضمن خطة التطوير'}
            </span>
          </div>
          <h1 data-page-heading className="mb-3 text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">{experiment.titleAr}</h1>
          <p className="max-w-3xl text-base leading-8 text-neutral-600">{experiment.descriptionAr}</p>
          {experiment.status === 'implemented' && <p className="mt-2 max-w-3xl text-sm leading-7 text-neutral-700"><span className="font-semibold">هدف التجربة: </span>{experiment.objective}</p>}
        </header>

        {experiment.status === 'implemented' ? (
          <div data-experiment-content={experiment.slug}>
            <ExperimentStageAutofocus slug={experiment.slug} />
            <ImplementedExperimentContent experiment={experiment} />
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)]">
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="planned-title">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600" aria-hidden="true">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-5 0v5.2L5.5 18a2 2 0 001.7 3h9.6a2 2 0 001.7-3L14 8.2V3M8 15h8" /></svg>
              </div>
              <p className="mb-2 text-xs font-semibold text-neutral-500">موضوع مخطط للمعمل</p>
              <h2 id="planned-title" className="mb-3 text-xl font-bold text-neutral-900">هذه التجربة ضمن خطة التطوير</h2>
              <p className="max-w-xl text-sm leading-7 text-neutral-600">لم تُضف المحاكاة التفاعلية لهذا الموضوع بعد. صفحة التجربة ستُحدّث عند تجهيز النموذج العلمي وخطواته.</p>
            </section>

            <aside className="space-y-5">
              <InfoSection title="الفكرة التعليمية المخططة">
                <p className="text-sm leading-7 text-neutral-700">{experiment.objective}</p>
              </InfoSection>
              <InfoSection title="ماذا ستتناول التجربة؟">
                <ul className="list-inside list-disc space-y-2 text-sm leading-7 text-neutral-700">
                  {experiment.learningOutcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                </ul>
              </InfoSection>
              <Link href={`/grades/${experiment.grade}`} className="btn-secondary w-full">
                العودة إلى تجارب {grade?.nameAr ?? `الصف ${experiment.grade}`}
              </Link>
            </aside>
          </div>
        )}
      </div>
    </article>
    </PageEntranceMotion>
  );
}

function ImplementedExperimentContent({ experiment }: { experiment: Experiment }) {
  switch (experiment.slug) {
    case 'electric-circuit': return <ElectricCircuitLoader />;
    case 'water-cycle': return <WaterCycleLoader videoUrl={experiment.videoUrl ?? ''} />;
    case 'states-of-matter': return <StatesOfMatterLoader videoUrl={experiment.videoUrl ?? ''} />;
    case 'food-chain': return <FoodChainLoader videoUrl={experiment.videoUrl ?? ''} />;
    case 'photosynthesis': return <PhotosynthesisLoader videoUrl={experiment.videoUrl ?? ''} />;
    case 'magnetism': return <MagnetismLoader />;
    case 'pollination': return <PollinationLoader />;
    case 'cell': return <CellLoader />;
    case 'ph-scale': return <PhScaleLoader />;
    default: return notFound();
  }
}

function ExperimentPageLoading() {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center" dir="rtl" lang="ar" aria-live="polite">
      <span className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" aria-hidden="true" />
      <p className="font-semibold text-neutral-700">جارٍ تجهيز مساحة التجربة...</p>
    </section>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm" aria-label={title}>
      <h2 className="mb-3 text-lg font-bold text-neutral-900">{title}</h2>
      {children}
    </section>
  );
}
