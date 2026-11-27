import Link from "next/link";
import { CATEGORIES, CATEGORY_KEYS, noticesHref, type Category, type NoticeSort } from "@/lib/notices";

// 목록 위 필터 줄: 테두리 있는 둥근 사각 버튼. 검색어·정렬은 유지.
export default function CategoryTabs({
  active,
  q,
  sort,
}: {
  active: Category | "all";
  q?: string;
  sort?: NoticeSort;
}) {
  const tabs: { key: Category | "all"; label: string }[] = [
    { key: "all", label: "전체" },
    ...CATEGORY_KEYS.map((key) => ({ key, label: CATEGORIES[key].label })),
  ];

  return (
    <nav aria-label="공지 분류" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {tabs.map((tab) => {
        const selected = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={noticesHref({ category: tab.key, q, sort })}
            aria-current={selected ? "page" : undefined}
            className={`shrink-0 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
              selected
                ? "border-brand-600 bg-brand-50 font-semibold text-brand-700"
                : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
