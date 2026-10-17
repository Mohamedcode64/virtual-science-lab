import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/layout/layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ExperimentCard } from '@/components/ui/experiment-card';
import { PageEntranceMotion } from '@/components/ui/page-entrance-motion';
import { getExperimentsByGrade } from '@/data/experiments';
import { getAllGrades, getGradeById } from '@/data/grades';

type GradePageProps = PageProps<'/grades/[grade]'>;

export const metadata: Metadata = { title: 'الصف الدراسي' };

export function generateStaticParams() {
  return getAllGrades().map((grade) => ({ grade: String(grade.id) }));
}

export default function GradeDetailPage({ params }: GradePageProps) {
  return (
    <Layout>
      <Suspense fallback={<GradePageLoading />}>
        <GradeDetailContent params={params} />
      </Suspense>
    </Layout>
  );
}

async function GradeDetailContent({ params }: Pick<GradePageProps, 'params'>) {
  const { grade: gradeParam } = await params;
  const grade = getGradeById(Number(gradeParam));
  if (!grade || !/^\d+$/.test(gradeParam)) notFound();

  const gradeExperiments = getExperimentsByGrade(grade.id);
  const availableExperiments = gradeExperiments.filter((experiment) => experiment.status === 'implemented');
  const plannedExperiments = gradeExperiments.length - availableExperiments.length;
  const categories = [...new Set(gradeExperiments.map((experiment) => experiment.categoryAr))];

  return (
    <PageEntranceMotion>
    <section className="bg-neutral-50 pb-16 pt-28 sm:pb-20" dir="rtl" lang="ar">
      <div className="container">
        <Breadcrumb items={[
          { label: 'الرئيسية', href: '/' },
          { label: 'الصفوف الدراسية', href: '/grades' },
          { label: grade.nameAr, href: `/grades/${grade.id}`, isCurrent: true },
        ]} />
        <header data-page-reveal className="mb-9 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="section-eyebrow">مسار الصف {grade.id}</span>
              <h1 data-page-heading className="mb-3 text-3xl font-bold text-neutral-900 sm:text-4xl">{grade.nameAr}</h1>
              <p className="text-base leading-8 text-neutral-600">استكشف موضوعات خطة العلوم الخاصة بـ{grade.nameAr}، وابدأ بالمحاكاة التفاعلية المتاحة لهذا الصف.</p>
            </div>
            <div className="shrink-0 rounded-2xl bg-brand-50 px-5 py-4 text-center text-brand-800">
              <strong className="block text-2xl">{availableExperiments.length} متاحة</strong>
              <span className="text-xs">{plannedExperiments} ضمن الخطة</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="تصنيفات التجارب">
            {categories.map((category) => <span key={category} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600">{category}</span>)}
          </div>
        </header>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 data-page-heading className="text-2xl font-bold text-neutral-900">تجارب هذا الصف</h2>
            <p className="mt-1 text-sm text-neutral-600">التجارب المتاحة تفتح محاكاة تفاعلية، والموضوعات الأخرى موضحة بأنها مخططة.</p>
          </div>
          {availableExperiments[0] && <Link href={`/experiments/${availableExperiments[0].slug}`} className="btn-primary px-4 py-2 text-sm">ابدأ المحاكاة المتاحة</Link>}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gradeExperiments.map((experiment) => <ExperimentCard key={experiment.slug} experiment={experiment} />)}
        </div>
      </div>
    </section>
    </PageEntranceMotion>
  );
}

function GradePageLoading() {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center" dir="rtl" lang="ar" aria-live="polite">
      <span className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" aria-hidden="true" />
      <p className="font-semibold text-neutral-700">جارٍ تجهيز تجارب الصف...</p>
    </section>
  );
}
