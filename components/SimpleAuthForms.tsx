"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, updatePassword, type AuthState } from "@/app/auth/actions";

function Alert({ state }: { state: AuthState }) {
  if (state?.error)
    return (
      <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">
        {state.error}
      </p>
    );
  if (state?.message)
    return (
      <p className="rounded-xl bg-brand-50 px-3.5 py-2.5 text-sm text-brand-900" role="status">
        {state.message}
      </p>
    );
  return null;
}

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(requestPasswordReset, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">가입한 이메일</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" placeholder="you@example.com" />
      </div>
      <Alert state={state} />
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "보내는 중…" : "재설정 메일 받기"}
      </button>
      <p className="text-center text-sm text-stone-600">
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">로그인으로 돌아가기</Link>
      </p>
    </form>
  );
}

export function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(updatePassword, undefined);

  if (state?.message) {
    return (
      <div className="space-y-4">
        <Alert state={state} />
        <Link href="/account" className="btn-primary w-full">내 정보로</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="password" className="label">새 비밀번호</label>
        <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" className="field" placeholder="6자 이상" />
      </div>
      <div>
        <label htmlFor="passwordConfirm" className="label">새 비밀번호 확인</label>
        <input id="passwordConfirm" name="passwordConfirm" type="password" required minLength={6} autoComplete="new-password" className="field" />
      </div>
      <Alert state={state} />
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "저장 중…" : "비밀번호 변경"}
      </button>
    </form>
  );
}
