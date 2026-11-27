import Link from "next/link";

export const metadata = { title: "인증 오류" };

export default function AuthErrorPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="text-xl font-bold">인증 링크를 확인할 수 없어요</h1>
      <p className="mt-3 text-sm text-stone-600">
        링크가 만료되었거나 이미 사용되었을 수 있습니다. 다시 로그인하거나 가입을 시도해 주세요.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/login" className="btn-primary">로그인</Link>
        <Link href="/signup" className="btn-ghost">회원가입</Link>
      </div>
    </div>
  );
}
