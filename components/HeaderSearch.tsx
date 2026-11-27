"use client";

import Form from "next/form";
import { useId } from "react";
import { useSearchParams } from "next/navigation";

// 공지 제목·내용 검색 → /notices?q=
export default function HeaderSearch({ className = "" }: { className?: string }) {
  const q = useSearchParams().get("q") ?? "";
  const id = useId();

  return (
    <Form action="/notices" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">공지 검색</label>
      <input
        key={q}
        id={id}
        name="q"
        type="search"
        defaultValue={q}
        maxLength={50}
        placeholder="공지 제목이나 내용을 검색해 보세요"
        className="h-11 w-full rounded-full border border-stone-300 bg-white pr-12 pl-5 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="검색"
        className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 hover:text-brand-700"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4.2-4.2" />
        </svg>
      </button>
    </Form>
  );
}
