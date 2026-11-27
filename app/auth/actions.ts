"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | undefined;

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  // 외부 주소로의 리다이렉트 방지
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function translateAuthError(message: string) {
  if (/invalid login credentials/i.test(message))
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (/email not confirmed/i.test(message))
    return "이메일 인증이 아직 완료되지 않았습니다. 받은 메일함을 확인해 주세요.";
  if (/already registered/i.test(message))
    return "이미 가입된 이메일입니다.";
  if (/password/i.test(message))
    return "비밀번호는 6자 이상이어야 합니다.";
  if (/rate limit/i.test(message))
    return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  return "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "이메일과 비밀번호를 입력해 주세요." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim().slice(0, 30);

  if (!email || !password) return { error: "이메일과 비밀번호를 입력해 주세요." };
  if (password.length < 6) return { error: "비밀번호는 6자 이상이어야 합니다." };
  if (password !== passwordConfirm) return { error: "비밀번호가 서로 다릅니다." };

  const h = await headers();
  const origin =
    h.get("origin") ??
    `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // role은 메타데이터로 받지 않음 — DB 트리거가 항상 member로 생성
      data: { nickname },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });
  if (error) return { error: translateAuthError(error.message) };

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }
  return {
    message: `${email} 주소로 인증 메일을 보냈습니다. 메일의 링크를 누르면 가입이 완료됩니다.`,
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
