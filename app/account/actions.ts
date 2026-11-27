"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; message?: string } | undefined;

// 닉네임만 수정 (DB 권한상 role 등 다른 컬럼은 수정 불가)
export async function updateNickname(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  if (nickname.length > 30) return { error: "닉네임은 30자 이내로 입력해 주세요." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const { data, error } = await supabase
    .from("profiles")
    .update({ nickname: nickname || null })
    .eq("id", user.id)
    .select("id");
  if (error || !data?.length) return { error: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };

  revalidatePath("/", "layout");
  return { message: "닉네임을 저장했습니다." };
}
