"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createNotice, updateNotice, type NoticeFormState } from "@/app/notices/actions";
import { CATEGORIES, type Category, type Notice } from "@/lib/notices";

export default function NoticeForm({ notice }: { notice?: Notice }) {
  const editing = Boolean(notice);
  const [state, formAction, pending] = useActionState<NoticeFormState, FormData>(
    editing ? updateNotice : createNotice,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-stone-200 bg-white p-5 sm:p-7">
      {notice && <input type="hidden" name="id" value={notice.id} />}

      <fieldset>
        <legend className="label">분류</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORIES) as Category[]).map((key) => (
            <label key={key} className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value={key}
                defaultChecked={(notice?.category ?? "general") === key}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-100">
                {CATEGORIES[key].label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="title" className="label">제목</label>
        <input id="title" name="title" required maxLength={200} defaultValue={notice?.title} className="field" placeholder="예: 이번 주 평일 점심 10% 할인" />
      </div>

      <div>
        <label htmlFor="content" className="label">내용</label>
        <textarea id="content" name="content" required rows={12} defaultValue={notice?.content} className="field resize-y leading-relaxed" placeholder="단골분들께 전할 내용을 적어 주세요." />
      </div>

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">{state.error}</p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href={notice ? `/notices/${notice.id}` : "/notices"} className="btn-ghost">취소</Link>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "저장 중…" : editing ? "수정 완료" : "공지 등록"}
        </button>
      </div>
    </form>
  );
}
