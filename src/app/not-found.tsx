import Link from 'next/link';
import { Layout } from '@/components/layout/layout';

export default function NotFound() {
  return (
    <Layout>
      <section className="container flex min-h-[65vh] flex-col items-center justify-center py-20 text-center" dir="rtl" lang="ar">
        <span className="mb-4 text-sm font-bold tracking-widest text-brand-700">404</span>
        <h1 className="mb-3 text-3xl font-bold text-neutral-900">لم نعثر على هذه التجربة</h1>
        <p className="mb-7 max-w-lg text-sm leading-7 text-neutral-600">قد يكون الرابط غير صحيح أو أن التجربة لم تعد متاحة. يمكنك استكشاف جميع التجارب من جديد.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/experiments" className="btn-primary">استكشف التجارب</Link>
          <Link href="/" className="btn-secondary">العودة للرئيسية</Link>
        </div>
      </section>
    </Layout>
  );
}
