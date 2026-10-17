import type { Metadata } from 'next';
import { Layout } from '@/components/layout/layout';
import { AboutPageMotion } from '@/components/about/about-page-motion';
import { BrandingLogos } from '@/components/shared/logo';
import { projectMetadata } from '@/data/project-metadata';

export const metadata: Metadata = { title: 'عن المعمل' };

export default function AboutPage() {
  const { universityAr, facultyAr, projectTitleAr, supervisorAr, students, developer } = projectMetadata;

  return (
    <Layout>
      <AboutPageMotion>
      <section className="bg-neutral-50 pb-16 pt-28 sm:pb-20" dir="rtl" lang="ar">
        <div className="container">
          <header className="mx-auto mb-10 max-w-3xl text-center">
            <span className="section-eyebrow">جامعة الوادي الجديد · كلية التربية</span>
            <h1 className="section-title" data-about-title>عن المعمل</h1>
            <p className="section-subtitle">
              يتيح المعمل الافتراضي لطلاب المرحلة الابتدائية استكشاف مفاهيم العلوم بالتجربة والملاحظة، ضمن بيئة تعليمية آمنة ومبسطة تدعم الفضول والتعلم النشط.
            </p>
          </header>

          <div className="mx-auto max-w-4xl space-y-6">
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-9" data-about-reveal>
              <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <BrandingLogos className="shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900">{universityAr}</p>
                  <p className="mt-1 text-sm text-neutral-600">{facultyAr}</p>
                </div>
              </div>
              <p className="mb-2 text-sm font-semibold text-brand-700">المشروع</p>
              <h2 className="mb-5 text-2xl font-bold leading-relaxed text-neutral-900">{projectTitleAr}</h2>
              <div className="grid gap-4 text-sm text-neutral-600 sm:grid-cols-2">
                <div className="rounded-xl bg-neutral-50 p-4"><span className="mb-1 block text-xs text-neutral-500">الجامعة</span><strong className="text-neutral-800">{universityAr}</strong></div>
                <div className="rounded-xl bg-neutral-50 p-4"><span className="mb-1 block text-xs text-neutral-500">الكلية</span><strong className="text-neutral-800">{facultyAr}</strong></div>
              </div>
            </section>

            <section className="grid gap-5 sm:grid-cols-2" data-about-reveal>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" data-about-supervisor>
                <p className="mb-2 text-sm text-neutral-500">تحت إشراف</p>
                <h2 className="text-xl font-bold text-neutral-900">{supervisorAr}</h2>
                <p className="mt-2 text-sm text-neutral-600">كلية التربية · جامعة الوادي الجديد</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" data-about-developer>
                <p className="mb-2 text-sm text-neutral-500">البرمجة والتطوير</p>
                <h2 className="text-xl font-bold text-neutral-900" dir="ltr">{developer}</h2>
                <p className="mt-2 text-sm text-neutral-600">تطوير وبناء المنصة التعليمية</p>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="students-title" data-about-reveal>
              <div className="mb-6">
                <p className="mb-1 text-sm font-semibold text-brand-700">إعداد</p>
                <h2 id="students-title" className="text-2xl font-bold text-neutral-900">طلاب الفرقة الرابعة تربية أساسي علوم</h2>
              </div>
              <ul data-about-students className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {students.map((student) => (
                  <li key={student.id} data-about-student className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800" aria-hidden="true">{student.nameAr.charAt(0)}</span>
                    <span className="text-sm font-semibold text-neutral-800">{student.nameAr}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
        </section>
      </AboutPageMotion>
    </Layout>
  );
}
