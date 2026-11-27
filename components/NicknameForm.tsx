"use client";

import { useActionState } from "react";
import { updateNickname, type ProfileState } from "@/app/account/actions";

export default function NicknameForm({ nickname }: { nickname: string | null }) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(updateNickname, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <label htmlFor="nickname" className="label">닉네임</label>
      <div className="flex gap-2">
        <input
          id="nickname"
          name="nickname"
          maxLength={30}
          defaultValue={nickname ?? ""}
          placeholder="예: 점심단골"
          className="field"
        />
        <button type="submit" disabled={pending} className="btn-primary shrink-0">
          {pending ? "저장 중…" : "저장"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}
      {state?.message && <p className="text-sm text-brand-700" role="status">{state.message}</p>}
    </form>
  );
}
