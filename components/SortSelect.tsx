"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") === "oldest" ? "oldest" : "latest";

  return (
    <label className="flex items-center gap-1.5 text-sm text-stone-600">
      <span className="sr-only">정렬</span>
      <select
        value={current}
        onChange={(e) => {
          const sp = new URLSearchParams(searchParams.toString());
          if (e.target.value === "latest") sp.delete("sort");
          else sp.set("sort", e.target.value);
          const qs = sp.toString();
          router.push(qs ? `${pathname}?${qs}` : pathname);
        }}
        className="cursor-pointer rounded-lg border-0 bg-transparent py-1 pr-1 text-sm font-medium text-stone-700 focus:ring-2 focus:ring-brand-100 focus:outline-none"
      >
        <option value="latest">최신순</option>
        <option value="oldest">오래된순</option>
      </select>
    </label>
  );
}
