import type { Metadata } from 'next';
import { Layout } from '@/components/layout/layout';
import { ExperimentBrowser } from '@/components/ui/experiment-browser';
import { PageEntranceMotion } from '@/components/ui/page-entrance-motion';
import { experiments } from '@/data/experiments';

export const metadata: Metadata = { title: 'التجارب العلمية' };

export default function ExperimentsPage() {
  return (
    <Layout>
      <PageEntranceMotion>
      <section className="min-h-[70vh] bg-neutral-50 pb-16 pt-28 sm:pb-20" dir="rtl" lang="ar">
        <div className="container">
          <header data-page-reveal className="mb-9 max-w-2xl">
            <span className="section-eyebrow">مختبر المعرفة</span>
            <h1 data-page-heading className="section-title">التجارب العلمية</h1>
            <p className="section-subtitle !mx-0 !text-right">
              اختر تجربة ثلاثية الأبعاد من تجارب الصفوف الرابع والخامس والسادس.
            </p>
          </header>
          <ExperimentBrowser experiments={experiments} />
        </div>
      </section>
      </PageEntranceMotion>
    </Layout>
  );
}
