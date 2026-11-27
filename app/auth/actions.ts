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

  const origin = await getOrigin();

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

  // 이미 가입된 이메일이면 Supabase는 오류 없이 identities가 빈 사용자를 돌려주고 메일은 보내지 않음
  if (data.user && data.user.identities?.length === 0) {
    return {
      error: "이미 가입된 이메일입니다. 로그인하거나, 비밀번호가 기억나지 않으면 비밀번호 찾기를 이용해 주세요.",
    };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }
  return {
    message: `${email} 주소로 인증 메일을 보냈습니다. 메일의 링크를 누르면 가입이 완료됩니다.`,
  };
}

async function getOrigin() {
  const h = await headers();
  return h.get("origin") ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

// 비밀번호 재설정 메일 요청. 가입 여부를 노출하지 않도록 결과 문구는 항상 같게.
export async function requestPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "이메일을 입력해 주세요." };

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent("/account/password?reset=1")}`,
  });
  if (error && /rate limit/i.test(error.message)) {
    return { error: translateAuthError(error.message) };
  }
  return {
    message: `${email} 주소로 가입된 계정이 있다면 비밀번호 재설정 메일을 보냈습니다. 메일의 링크는 이 브라우저에서 열어 주세요.`,
  };
}

// 새 비밀번호 저장 (로그인 상태 또는 재설정 링크로 들어온 상태에서만 가능)
export async function updatePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  if (password.length < 6) return { error: "비밀번호는 6자 이상이어야 합니다." };
  if (password !== passwordConfirm) return { error: "비밀번호가 서로 다릅니다." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 만료되었습니다. 다시 로그인하거나 재설정 메일을 다시 요청해 주세요." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (/different from the old/i.test(error.message))
      return { error: "이전과 다른 비밀번호를 입력해 주세요." };
    if (/weak|short|characters/i.test(error.message))
      return { error: "비밀번호가 너무 약합니다. 더 길고 복잡하게 만들어 주세요." };
    return { error: translateAuthError(error.message) };
  }
  return { message: "비밀번호를 변경했습니다." };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
