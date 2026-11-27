import Link from "next/link";

export default function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="현재 위치" className="text-xs text-stone-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">›</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-700 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-stone-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
