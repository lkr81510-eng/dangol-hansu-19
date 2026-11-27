import Link from "next/link";
import { Suspense } from "react";
import { getViewer } from "@/lib/auth";
import { logout } from "@/app/auth/actions";
import Logo from "./Logo";
import HeaderSearch from "./HeaderSearch";
import HeaderCategoryNav from "./HeaderCategoryNav";

export default async function SiteHeader() {
  const viewer = await getViewer();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
      {/* 1줄: 로고 · 검색창 · 계정 */}
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-[72px] sm:gap-6 sm:px-5">
        <Link href="/" className="shrink-0" aria-label="단골 한수 홈">
          <Logo />
        </Link>

        <Suspense fallback={<div className="hidden h-11 max-w-md flex-1 sm:block" />}>
          <HeaderSearch className="hidden max-w-md flex-1 sm:block" />
        </Suspense>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {viewer ? (
            <>
              <span className="hidden max-w-40 truncate text-sm text-stone-600 lg:inline">
                {viewer.isAdmin && (
                  <span className="mr-1.5 rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-700">
                    관리자
                  </span>
                )}
                {viewer.nickname ?? viewer.email}님
              </span>
              <form action={logout}>
                <button type="submit" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100">
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-stone-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 모바일: 검색창을 로고 아래 줄로 */}
      <div className="px-4 pb-2 sm:hidden">
        <Suspense fallback={<div className="h-11" />}>
          <HeaderSearch />
        </Suspense>
      </div>

      {/* 2줄: 분류 메뉴 */}
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <Suspense fallback={<div className="h-12" />}>
          <HeaderCategoryNav />
        </Suspense>
      </div>
    </header>
  );
}
