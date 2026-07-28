import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-navy-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:text-navy-800">
                {item.name}
              </Link>
            ) : (
              <span className="text-navy-800">{item.name}</span>
            )}
            {i < items.length - 1 && <ChevronRight size={14} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
