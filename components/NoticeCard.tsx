import Link from "next/link";
import CategoryIcon from "./CategoryIcon";
import { CATEGORIES, formatDate, type Notice } from "@/lib/notices";

// 썸네일(분류 색 + 직접 그린 아이콘) 위, 제목·날짜·태그 아래. 카드 테두리 없음.
export default function NoticeCard({ notice }: { notice: Notice }) {
  const cat = CATEGORIES[notice.category];
  return (
    <Link href={`/notices/${notice.id}`} className="group block">
      <div
        className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl ${cat.thumb}`}
      >
        <span className="transition duration-200 group-hover:scale-110">
          <CategoryIcon category={notice.category} size={44} />
        </span>
        <span className="absolute bottom-2 left-2 rounded-md bg-white/85 px-1.5 py-0.5 text-[11px] font-semibold text-stone-700">
          {cat.label}
        </span>
      </div>
      <h3 className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug text-stone-900 group-hover:text-brand-700 sm:text-[15px]">
        {notice.title}
      </h3>
      <time dateTime={notice.created_at} className="mt-1 block text-xs text-stone-500">
        {formatDate(notice.created_at)}
      </time>
      <span className={`mt-2 inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${cat.badge}`}>
        {cat.label} 공지
      </span>
    </Link>
  );
}
