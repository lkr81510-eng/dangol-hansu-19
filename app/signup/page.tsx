import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getViewer } from "@/lib/auth";

export const metadata = { title: "회원가입" };

export default async function SignupPage() {
  if (await getViewer()) redirect("/");

  return (
    <div className="mx-auto max-w-sm px-5 py-12 sm:py-16">
      <h1 className="text-2xl font-extrabold">단골 등록하기</h1>
      <p className="mt-1.5 text-sm text-stone-600">
        가입하면 할인 소식을 받고, 자문단 모집에 참여할 수 있어요.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
