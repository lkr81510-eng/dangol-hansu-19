import { ForgotPasswordForm } from "@/components/SimpleAuthForms";

export const metadata = { title: "비밀번호 찾기" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-5 py-12 sm:py-16">
      <h1 className="text-2xl font-extrabold">비밀번호 찾기</h1>
      <p className="mt-1.5 text-sm text-stone-600">
        가입한 이메일로 비밀번호 재설정 링크를 보내 드립니다.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
