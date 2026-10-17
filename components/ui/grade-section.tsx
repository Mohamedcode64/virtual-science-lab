import Link from 'next/link';
import { getExperimentsByGrade } from '@/data/experiments';

const gradeDetails = [
  {
    id: 4,
    title: 'الصف الرابع الابتدائي',
    shortDesc: 'استكشف حالات المادة ودورة الماء وقوى المغناطيس في نماذج تفاعلية.',
    color: 'brand',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    topics: ['حالات المادة', 'دورة الماء', 'المغناطيس'],
  },
  {
    id: 5,
    title: 'الصف الخامس الابتدائي',
    shortDesc: 'تعرّف إلى انتقال الطاقة وصنع الغذاء وانتقال حبوب اللقاح بين الأزهار.',
    color: 'science',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    topics: ['السلسلة الغذائية', 'البناء الضوئي', 'التلقيح'],
  },
  {
    id: 6,
    title: 'الصف السادس الابتدائي',
    shortDesc: 'استكشف بنية الخلية، وتعلّم قراءة الرقم الهيدروجيني، وابنِ دائرة كهربائية.',
    color: 'accent',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    topics: ['الخلية', 'مقياس pH', 'الدائرة الكهربائية'],
  },
];

const colorStyles = {
  brand: {
    badge: 'badge-primary',
    iconBg: 'bg-brand-100',
    iconColor: 'text-brand-600',
    border: 'border-brand-200',
    hoverBorder: 'hover:border-brand-300',
    ctaBg: 'bg-brand-50',
    ctaColor: 'text-brand-600',
    ctaHover: 'hover:bg-brand-100',
    gradient: 'from-brand-500 to-brand-600',
    ring: 'ring-brand-500/20',
  },
  science: {
    badge: 'badge-science',
    iconBg: 'bg-science-100',
    iconColor: 'text-science-600',
    border: 'border-science-200',
    hoverBorder: 'hover:border-science-300',
    ctaBg: 'bg-science-50',
    ctaColor: 'text-science-600',
    ctaHover: 'hover:bg-science-100',
    gradient: 'from-science-500 to-science-600',
    ring: 'ring-science-500/20',
  },
  accent: {
    badge: 'badge-accent',
    iconBg: 'bg-accent-100',
    iconColor: 'text-accent-600',
    border: 'border-accent-200',
    hoverBorder: 'hover:border-accent-300',
    ctaBg: 'bg-accent-50',
    ctaColor: 'text-accent-600',
    ctaHover: 'hover:bg-accent-100',
    gradient: 'from-accent-500 to-accent-600',
    ring: 'ring-accent-500/20',
  },
};

export function GradeSection() {
  return (
    <section className="section bg-white" dir="rtl" lang="ar" aria-labelledby="grades-title">
      <div className="container">
        <header className="section-header">
          <span className="section-eyebrow">اختر صفك الدراسي</span>
          <h2 id="grades-title" data-page-heading className="section-title">الصفوف الدراسية</h2>
          <p className="section-subtitle">
            ابدأ رحلتك العلمية حسب الصف الدراسي — محتوى مصمم خصيصاً لمنهج العلوم المصري
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gradeDetails.map((grade) => {
            const styles = colorStyles[grade.color as keyof typeof colorStyles];
            const gradeExperiments = getExperimentsByGrade(grade.id);
            const availableCount = gradeExperiments.filter((experiment) => experiment.status === 'implemented').length;
            return (
              <article
                key={grade.id}
                className={`card-interactive animated-border-card relative flex h-full flex-col overflow-hidden ${styles.border} ${styles.hoverBorder} ${styles.ring} p-6 lg:p-7`}
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className={`animated-card-icon inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconColor}`}>
                    {grade.icon}
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">{availableCount} تجارب تفاعلية</span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-2">{grade.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed mb-5 flex-1">{grade.shortDesc}</p>

                <div className="flex flex-wrap gap-1.5 mb-6" aria-hidden="true">
                  {grade.topics.map((topic, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {topic}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/grades/${grade.id}`}
                  className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${styles.ctaBg} ${styles.ctaColor} ${styles.ctaHover}`}
                >
                  استكشف موضوعات الصف
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
