import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import NicknameForm from "@/components/NicknameForm";
import { requireUser } from "@/lib/auth";
import { logout } from "@/app/auth/actions";

export const metadata = { title: "내 정보" };

export default async function AccountPage() {
  const viewer = await requireUser("/account");

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-5 sm:py-12">
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "내 정보" }]} />
      <h1 className="mt-3 text-2xl font-extrabold">내 정보</h1>

      <section className="mt-6 space-y-6 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
        <dl className="grid grid-cols-[5rem_1fr] gap-y-3 text-sm">
          <dt className="text-stone-500">이메일</dt>
          <dd className="break-all text-stone-900">{viewer.email}</dd>
          <dt className="text-stone-500">회원 구분</dt>
          <dd>
            {viewer.isAdmin ? (
              <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-700">관리자</span>
            ) : (
              <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-xs font-semibold text-stone-600">단골 회원</span>
            )}
          </dd>
        </dl>

        <hr className="border-stone-100" />
        <NicknameForm nickname={viewer.nickname} />

        <hr className="border-stone-100" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-stone-700">비밀번호</p>
            <p className="text-xs text-stone-500">주기적으로 바꾸면 더 안전해요.</p>
          </div>
          <Link href="/account/password" className="btn-ghost shrink-0">변경하기</Link>
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        {["의견 남긴 내역", "단골 포인트"].map((title) => (
          <div key={title} aria-disabled="true" className="flex items-center justify-between rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-4">
            <span className="text-sm font-semibold text-stone-600">{title}</span>
            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-600">준비 중</span>
          </div>
        ))}
      </section>

      <form action={logout} className="mt-8 text-center">
        <button type="submit" className="text-sm text-stone-500 underline hover:text-stone-800">로그아웃</button>
      </form>
    </div>
  );
}
