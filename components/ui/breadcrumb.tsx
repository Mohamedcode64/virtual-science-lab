import Link from 'next/link';
import type { BreadcrumbItem } from '@/types';

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="مسار التنقل" className="mb-7">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="text-neutral-300">/</span>}
            {item.isCurrent ? (
              <span aria-current="page" className="font-medium text-neutral-800">{item.label}</span>
            ) : (
              <Link href={item.href} className="transition hover:text-brand-700">{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
