import Link from "next/link";
import { getViewer } from "@/lib/auth";
import { logout } from "@/app/auth/actions";
import Logo from "./Logo";

export default async function SiteHeader() {
  const viewer = await getViewer();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:h-16 sm:px-5">
        <Link href="/" className="shrink-0" aria-label="단골 한수 홈">
          <Logo />
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm font-medium text-stone-600 sm:flex">
          <Link href="/notices" className="rounded-lg px-3 py-2 hover:bg-stone-100">공지사항</Link>
          <Link href="/#coming-soon" className="rounded-lg px-3 py-2 hover:bg-stone-100">AI 요약</Link>
          <Link href="/#coming-soon" className="rounded-lg px-3 py-2 hover:bg-stone-100">포인트</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {viewer ? (
            <>
              <span className="hidden max-w-40 truncate text-sm text-stone-600 md:inline">
                {viewer.isAdmin && (
                  <span className="mr-1.5 rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-700">
                    관리자
                  </span>
                )}
                {viewer.nickname ?? viewer.email}님
              </span>
              <form action={logout}>
                <button type="submit" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100">
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100">
                로그인
              </Link>
              <Link href="/signup" className="btn-primary py-2">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 모바일 하위 내비게이션 */}
      <nav className="flex gap-1 overflow-x-auto border-t border-stone-100 px-3 py-1.5 text-sm font-medium text-stone-600 sm:hidden">
        <Link href="/notices" className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-stone-100">공지사항</Link>
        <Link href="/#coming-soon" className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-stone-100">AI 요약</Link>
        <Link href="/#coming-soon" className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-stone-100">포인트</Link>
      </nav>
    </header>
  );
}
