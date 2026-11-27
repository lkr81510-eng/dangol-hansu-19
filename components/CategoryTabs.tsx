import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/notices";

const TABS: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  ...(Object.keys(CATEGORIES) as Category[]).map((key) => ({
    key,
    label: CATEGORIES[key].label,
  })),
];

export default function CategoryTabs({ active }: { active: Category | "all" }) {
  return (
    <nav aria-label="공지 분류" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {TABS.map((tab) => {
        const selected = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/notices" : `/notices?category=${tab.key}`}
            aria-current={selected ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selected
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:border-brand-500 hover:text-brand-700"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
