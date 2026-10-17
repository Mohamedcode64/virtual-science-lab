import Link from 'next/link';
import { projectMetadata } from '@/data/project-metadata';
import { BrandingLogos } from '@/components/shared/logo';
import { FooterSupervisor } from './footer-supervisor';

export function Footer() {
  const { universityAr, facultyAr, projectTitleAr, supervisorAr, students, developerAr, copyrightAr } = projectMetadata;
  const footerLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'الصفوف الدراسية', href: '/grades' },
    { label: 'التجارب', href: '/experiments' },
    { label: 'عن المعمل', href: '/about' },
  ];

  return (
    <footer className="academic-footer bg-neutral-950 text-neutral-300" dir="rtl" lang="ar" role="contentinfo">
      <div className="container py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 xl:grid-cols-[1.1fr_0.7fr_1.15fr_1fr] xl:gap-10">
          <section aria-labelledby="footer-brand-title">
            <div className="mb-5 flex items-center gap-3"><BrandingLogos className="gap-2.5" /></div>
            <h2 id="footer-brand-title" className="max-w-xs text-base font-bold leading-7 text-white">{projectTitleAr}</h2>
            <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-400">{universityAr} — {facultyAr}</p>
          </section>

          <nav aria-label="روابط سريعة">
            <h2 className="mb-4 text-sm font-bold text-white">روابط سريعة</h2>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="footer-link text-sm text-neutral-400">{link.label}</Link></li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-students-title">
            <h2 id="footer-students-title" className="mb-4 text-sm font-bold text-white">إعداد طلاب الفرقة الرابعة</h2>
            <ul className="footer-student-list grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2" aria-label="أسماء الطلاب المشاركين">
              {students.map((student) => <li key={student.id} className="text-xs leading-5 text-neutral-400">{student.nameAr}</li>)}
            </ul>
            <p className="mt-3 text-xs text-neutral-500">تربية أساسي علوم</p>
          </section>

          <section aria-labelledby="footer-academic-title">
            <h2 id="footer-academic-title" className="mb-3 text-sm font-bold text-white">الهوية الأكاديمية</h2>
            <p className="text-sm leading-6 text-neutral-400">{universityAr}<br />{facultyAr}</p>
            <FooterSupervisor name={supervisorAr} />
          </section>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-neutral-400">التصميم والتطوير: <span className="font-semibold text-neutral-200">{developerAr}</span></p>
          <p className="text-neutral-500">{copyrightAr}</p>
        </div>
      </div>
    </footer>
  );
}
