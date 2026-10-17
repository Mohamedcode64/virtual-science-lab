'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandingLogos } from '@/components/shared/logo';

const navItems = [
  { label: 'الرئيسية', href: '/', icon: 'M3 10.8 12 4l9 6.8M5.5 9.8V20h13V9.8M9 20v-6h6v6' },
  { label: 'الصفوف الدراسية', href: '/grades', icon: 'M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2ZM8 6h8M8 10h8' },
  { label: 'التجارب', href: '/experiments', icon: 'M9 3h6m-5 0v5.2L5.5 18a2 2 0 001.7 3h9.6a2 2 0 001.7-3L14 8.2V3M8 15h8' },
  { label: 'عن المعمل', href: '/about', icon: 'M12 16v-4m0-4h.01M22 12A10 10 0 112 12a10 10 0 0120 0Z' },
] as const;

function isItemActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ path }: { path: string }) {
  return <svg className="h-[17px] w-[17px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d={path} /></svg>;
}

export function Navbar() {
  const pathname = usePathname() ?? '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const isMobileMenuOpen = mobileMenuPath === pathname;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuPath(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMobileMenuOpen]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background,box-shadow] duration-300 ${isScrolled ? 'border-neutral-200 bg-white/95 shadow-sm backdrop-blur-md' : 'border-neutral-200/80 bg-white/92 backdrop-blur-md'}`} dir="rtl" lang="ar">
      <nav className="container flex h-[4.4rem] items-center justify-between gap-3" aria-label="التنقل الرئيسي">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-offset-4" aria-label="الذهاب إلى الصفحة الرئيسية">
          <BrandingLogos className="gap-1 border-0 bg-transparent p-0" />
          <span className="hidden min-w-0 border-r border-neutral-200 pr-2.5 sm:block">
            <span className="block truncate text-sm font-bold leading-tight text-neutral-900">معمل العلوم</span>
            <span className="mt-0.5 block text-[10px] leading-tight text-neutral-500">جامعة الوادي الجديد</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${active ? 'bg-brand-50 text-brand-800' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}`}
              >
                <NavIcon path={item.icon} />
                {item.label}
                {active && <span className="absolute inset-x-3 -bottom-[0.4rem] h-0.5 rounded-full bg-science-600" aria-hidden="true" />}
              </Link>
            );
          })}
        </div>

        <Link href="/experiments" className="btn-primary hidden min-h-10 gap-2 rounded-xl px-4 py-2 text-sm lg:inline-flex">
          <NavIcon path={navItems[2].icon} />
          ابدأ التجارب
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-offset-2 lg:hidden"
          onClick={() => setMobileMenuPath((currentPath) => currentPath === pathname ? null : pathname)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        >
          {isMobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m6 6 12 12M18 6 6 18" /></svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 7h16M4 12h16M4 17h16" /></svg>
          )}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="mobile-menu-panel border-t border-neutral-200 bg-white px-4 pb-4 pt-2 shadow-lg lg:hidden">
          <div className="container flex flex-col gap-1" role="navigation" aria-label="قائمة الجوال">
            {navItems.map((item) => {
              const active = isItemActive(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} onClick={() => setMobileMenuPath(null)} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? 'bg-brand-50 text-brand-800' : 'text-neutral-700 hover:bg-neutral-50'}`}>
                  <NavIcon path={item.icon} />
                  {item.label}
                </Link>
              );
            })}
            <Link href="/experiments" onClick={() => setMobileMenuPath(null)} className="btn-primary mt-2 min-h-11 justify-center text-sm">
              <NavIcon path={navItems[2].icon} />
              ابدأ التجارب
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
