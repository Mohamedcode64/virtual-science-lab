import type { Metadata } from 'next';
import { Layout } from '@/components/layout/layout';
import { GradeCard } from '@/components/ui/grade-card';
import { PageEntranceMotion } from '@/components/ui/page-entrance-motion';
import { getAllGrades } from '@/data/grades';

export const metadata: Metadata = { title: 'الصفوف الدراسية' };

export default function GradesPage() {
  const grades = getAllGrades();

  return (
    <Layout>
      <PageEntranceMotion>
      <section className="min-h-[70vh] bg-gradient-to-b from-brand-50/70 to-white pb-16 pt-28 sm:pb-20" dir="rtl" lang="ar">
        <div className="container">
          <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <span className="section-eyebrow">مسارات التعلّم</span>
            <h1 data-page-heading className="section-title">الصفوف الدراسية</h1>
            <p className="section-subtitle">اختر الصف الدراسي لاستكشاف تجارب العلوم</p>
          </header>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {grades.map((grade) => <GradeCard key={grade.id} grade={grade} />)}
          </div>
        </div>
      </section>
      </PageEntranceMotion>
    </Layout>
  );
}
