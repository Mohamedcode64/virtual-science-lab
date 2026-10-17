import { Layout } from '@/components/layout/layout';

export default function Loading() {
  return (
    <Layout>
      <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center" dir="rtl" lang="ar" aria-live="polite">
        <span className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" aria-hidden="true" />
        <p className="font-semibold text-neutral-700">جارٍ تجهيز صفحة المعمل...</p>
      </section>
    </Layout>
  );
}
