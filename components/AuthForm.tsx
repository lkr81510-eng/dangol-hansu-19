"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type AuthState } from "@/app/auth/actions";

export default function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const isSignup = mode === "signup";
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    isSignup ? signup : login,
    undefined,
  );

  if (state?.message) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm leading-relaxed text-brand-900" role="status">
        <p className="font-semibold">메일을 확인해 주세요</p>
        <p className="mt-1">{state.message}</p>
        <Link href="/login" className="btn-primary mt-4 w-full">로그인 화면으로</Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {isSignup && (
        <div>
          <label htmlFor="nickname" className="label">닉네임 <span className="text-stone-400">(선택)</span></label>
          <input id="nickname" name="nickname" maxLength={30} className="field" placeholder="예: 점심단골" />
        </div>
      )}
      <div>
        <label htmlFor="email" className="label">이메일</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="password" className="label">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="field"
          placeholder={isSignup ? "6자 이상" : ""}
        />
        {!isSignup && (
          <p className="mt-1.5 text-right">
            <Link href="/forgot-password" className="text-xs text-stone-500 hover:text-brand-700 hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          </p>
        )}
      </div>
      {isSignup && (
        <div>
          <label htmlFor="passwordConfirm" className="label">비밀번호 확인</label>
          <input id="passwordConfirm" name="passwordConfirm" type="password" required minLength={6} autoComplete="new-password" className="field" />
        </div>
      )}

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "처리 중…" : isSignup ? "가입하기" : "로그인"}
      </button>

      <p className="text-center text-sm text-stone-600">
        {isSignup ? (
          <>이미 회원이신가요? <Link href="/login" className="font-semibold text-brand-700 hover:underline">로그인</Link></>
        ) : (
          <>처음이신가요? <Link href="/signup" className="font-semibold text-brand-700 hover:underline">회원가입</Link></>
        )}
      </p>
    </form>
  );
}
