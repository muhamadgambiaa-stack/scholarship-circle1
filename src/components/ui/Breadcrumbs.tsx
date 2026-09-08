import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

export default function Breadcrumbs({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  const mobileItems = items.length > 2 ? items.slice(0, 2) : items;

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-navy-500 sm:text-sm">
      <ol className="flex items-center gap-1 sm:hidden">
        {mobileItems.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex min-w-0 items-center gap-1">
            {item.href ? (
              <Link
                href={item.href}
                className="truncate transition-colors hover:text-navy-800"
              >
                {item.name}
              </Link>
            ) : (
              <span className="truncate text-navy-800">
                {item.name}
              </span>
            )}

            {index < mobileItems.length - 1 && (
              <ChevronRight size={13} className="shrink-0" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      <ol className="hidden flex-wrap items-center gap-1 sm:flex">
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex min-w-0 items-center gap-1">
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-navy-800"
              >
                {item.name}
              </Link>
            ) : (
              <span className="max-w-md truncate text-navy-800">
                {item.name}
              </span>
            )}

            {index < items.length - 1 && (
              <ChevronRight size={14} className="shrink-0" aria-hidden />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
