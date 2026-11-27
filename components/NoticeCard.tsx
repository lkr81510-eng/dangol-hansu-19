import Link from "next/link";
import { CATEGORIES, formatDate, type Notice } from "@/lib/notices";

export default function NoticeCard({ notice }: { notice: Notice }) {
  const cat = CATEGORIES[notice.category];
  return (
    <Link
      href={`/notices/${notice.id}`}
      className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-md"
    >
      <span className={`w-fit rounded-md px-2 py-0.5 text-xs font-semibold ${cat.badge}`}>
        {cat.label}
      </span>
      <h3 className="mt-3 line-clamp-2 text-base font-bold leading-snug text-stone-900 group-hover:text-brand-700">
        {notice.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-600">
        {notice.content}
      </p>
      <time dateTime={notice.created_at} className="mt-4 text-xs text-stone-400">
        {formatDate(notice.created_at)}
      </time>
    </Link>
  );
}
