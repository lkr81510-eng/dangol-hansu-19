import Breadcrumb from "@/components/Breadcrumb";
import { UpdatePasswordForm } from "@/components/SimpleAuthForms";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "비밀번호 변경" };

export default async function PasswordPage({ searchParams }: PageProps<"/account/password">) {
  const viewer = await requireUser("/account/password");
  const { reset } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-5 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "내 정보", href: "/account" }, { label: "비밀번호 변경" }]} />
      <h1 className="mt-3 text-2xl font-extrabold">{reset ? "새 비밀번호 설정" : "비밀번호 변경"}</h1>
      <p className="mt-1.5 text-sm text-stone-600">
        {reset
          ? "재설정 링크가 확인되었습니다. 새 비밀번호를 정해 주세요."
          : `${viewer.email} 계정의 비밀번호를 바꿉니다.`}
      </p>
      <div className="mt-8">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
