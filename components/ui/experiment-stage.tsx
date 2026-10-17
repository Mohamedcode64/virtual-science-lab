export function ExperimentStage() {
  return (
    <section className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm" aria-labelledby="stage-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-7">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-brand-700">مساحة المختبر</p>
          <h2 id="stage-title" className="text-lg font-bold text-neutral-900">منطقة التجربة التفاعلية</h2>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">بيئة تعليمية آمنة</span>
      </div>
      <div className="relative isolate flex min-h-64 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-science-50 px-5 py-12 sm:min-h-80">
        <div className="absolute inset-0 -z-10 opacity-40" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(to right, #dbeafe 1px, transparent 1px), linear-gradient(to bottom, #dbeafe 1px, transparent 1px)', backgroundSize: '34px 34px', maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
        <div className="absolute left-[12%] top-10 h-20 w-20 rounded-full bg-science-100/70 blur-2xl" aria-hidden="true" />
        <div className="absolute bottom-8 right-[14%] h-24 w-24 rounded-full bg-brand-100/70 blur-2xl" aria-hidden="true" />
        <div className="relative max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-700 shadow-sm">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 3h6m-5 0v5.2L5.5 18a2 2 0 001.7 3h9.6a2 2 0 001.7-3L14 8.2V3M8 15h8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M7 17h10" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-neutral-900">مساحة جاهزة للاستكشاف</h3>
          <p className="text-sm leading-7 text-neutral-600">
            ستظهر أدوات المحاكاة وخطوات التفاعل هنا. ابدأ الآن بقراءة خطوات التجربة، ثم تابع ملاحظاتك ونتائجك.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2 text-xs font-medium text-neutral-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-science-500" aria-hidden="true" />
            المحاكاة التعليمية قيد التجهيز
          </div>
        </div>
      </div>
    </section>
  );
}
