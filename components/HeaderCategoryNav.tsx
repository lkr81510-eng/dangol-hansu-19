"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import CategoryIcon from "./CategoryIcon";
import { CATEGORIES, CATEGORY_KEYS, isCategory } from "@/lib/notices";

// 헤더 2줄째: 분류 메뉴(왼쪽) + 준비 중 기능(오른쪽)
export default function HeaderCategoryNav() {
  const pathname = usePathname();
  const category = useSearchParams().get("category");
  const onNotices = pathname === "/notices";
  const active = onNotices ? (isCategory(category) ? category : "all") : null;

  const item = (selected: boolean) =>
    `relative shrink-0 px-1 py-3 text-[15px] transition ${
      selected
        ? "font-bold text-stone-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brand-600"
        : "font-medium text-stone-600 hover:text-stone-900"
    }`;

  return (
    <nav aria-label="공지 분류 메뉴" className="flex items-center gap-5 overflow-x-auto sm:gap-7">
      <Link
        href="/notices"
        aria-current={active === "all" ? "page" : undefined}
        className={`${item(active === "all")} flex items-center gap-1.5`}
      >
        <CategoryIcon category="all" size={17} />
        전체 공지
      </Link>
      <span className="h-4 w-px shrink-0 bg-stone-200" aria-hidden="true" />
      {CATEGORY_KEYS.map((key) => (
        <Link
          key={key}
          href={`/notices?category=${key}`}
          aria-current={active === key ? "page" : undefined}
          className={item(active === key)}
        >
          {CATEGORIES[key].label}
        </Link>
      ))}

      <div className="ml-auto flex shrink-0 items-center gap-5 pl-4 sm:gap-7">
        {["AI 요약", "포인트"].map((label) => (
          <Link key={label} href="/#coming-soon" className="flex items-center gap-1.5 py-3 text-[15px] font-medium text-stone-500 hover:text-stone-800">
            {label}
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">준비 중</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
