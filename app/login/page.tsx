import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getViewer } from "@/lib/auth";

export const metadata = { title: "로그인" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getViewer()) redirect("/");
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-5 py-12 sm:py-16">
      <h1 className="text-2xl font-extrabold">로그인</h1>
      <p className="mt-1.5 text-sm text-stone-600">단골 자문단 소식과 할인 혜택을 확인하세요.</p>
      <div className="mt-8">
        <AuthForm mode="login" next={typeof next === "string" ? next : undefined} />
      </div>
    </div>
  );
}
