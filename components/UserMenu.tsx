"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { logout } from "@/app/auth/actions";

// 이름 버튼 → 펼침 메뉴(내 정보, 비밀번호 변경, 로그아웃)
// 로그아웃을 헤더에 바로 노출하지 않아 실수로 누르는 일을 줄인다.
export default function UserMenu({
  name,
  email,
  isAdmin,
}: {
  name: string;
  email: string | null;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const pathname = usePathname();

  // 페이지 이동 시 닫기
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // 바깥 클릭·Esc로 닫기
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-sm font-medium text-stone-700 hover:bg-stone-100"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
        {isAdmin && (
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700">관리자</span>
        )}
        <span className="hidden max-w-32 truncate sm:inline">{name}님</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" className={`transition ${open ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-white py-1.5 shadow-lg"
        >
          <div className="border-b border-stone-100 px-4 pt-2 pb-3">
            <p className="truncate text-sm font-semibold text-stone-900">{name}님</p>
            {email && <p className="truncate text-xs text-stone-500">{email}</p>}
          </div>
          <Link role="menuitem" href="/account" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
            내 정보
          </Link>
          <Link role="menuitem" href="/account/password" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
            비밀번호 변경
          </Link>
          {isAdmin && (
            <Link role="menuitem" href="/notices/new" className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
              공지 작성
            </Link>
          )}
          <form action={logout} className="mt-1 border-t border-stone-100 pt-1">
            <button role="menuitem" type="submit" className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
              로그아웃
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
