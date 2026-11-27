"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { isCategory } from "@/lib/notices";

export type NoticeFormState = { error?: string } | undefined;

function parseNotice(formData: FormData) {
  const category = formData.get("category");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!isCategory(category)) return { error: "분류를 선택해 주세요." } as const;
  if (!title) return { error: "제목을 입력해 주세요." } as const;
  if (title.length > 200) return { error: "제목은 200자 이내로 입력해 주세요." } as const;
  if (!content) return { error: "내용을 입력해 주세요." } as const;
  if (content.length > 20000) return { error: "내용이 너무 깁니다." } as const;
  return { data: { category, title, content } } as const;
}

function parseId(value: FormDataEntryValue | null) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// 모든 액션: 1) 화면 단 관리자 확인(requireAdmin) 2) DB에서 RLS가 최종 확인
export async function createNotice(_: NoticeFormState, formData: FormData): Promise<NoticeFormState> {
  await requireAdmin();
  const parsed = parseNotice(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .insert(parsed.data)
    .select("id")
    .single();
  if (error || !data) return { error: "저장하지 못했습니다. 권한을 확인해 주세요." };

  revalidatePath("/notices");
  revalidatePath("/");
  redirect(`/notices/${data.id}`);
}

export async function updateNotice(_: NoticeFormState, formData: FormData): Promise<NoticeFormState> {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) return { error: "잘못된 요청입니다." };
  const parsed = parseNotice(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .update(parsed.data)
    .eq("id", id)
    .select("id");
  // RLS에 막히면 error 없이 0건이 반환됨
  if (error || !data?.length) return { error: "수정하지 못했습니다. 권한을 확인해 주세요." };

  revalidatePath("/notices");
  revalidatePath(`/notices/${id}`);
  revalidatePath("/");
  redirect(`/notices/${id}`);
}

export async function deleteNotice(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get("id"));
  if (!id) redirect("/notices");

  const supabase = await createClient();
  const { data, error } = await supabase.from("notices").delete().eq("id", id).select("id");
  if (error || !data?.length) redirect(`/notices/${id}?error=delete`);

  revalidatePath("/notices");
  revalidatePath("/");
  redirect("/notices?deleted=1");
}
