"use client";

import { useFormStatus } from "react-dom";
import { deleteNotice } from "@/app/notices/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-danger">
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}

export default function DeleteNoticeButton({ id }: { id: number }) {
  return (
    <form
      action={deleteNotice}
      onSubmit={(e) => {
        if (!confirm("이 공지를 삭제할까요? 삭제하면 되돌릴 수 없습니다.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}
