import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string;
  email: string | null;
  nickname: string | null;
  isAdmin: boolean;
} | null;

// 한 요청 안에서 여러 번 불려도 한 번만 조회
export const getViewer = cache(async (): Promise<Viewer> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    nickname: profile?.nickname ?? null,
    isAdmin: profile?.role === "admin",
  };
});

// 로그인 필요 화면 진입 시 사용
export async function requireUser(next: string) {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  return viewer;
}

// 관리자 전용 화면/액션 진입 시 사용 (최종 방어는 RLS)
export async function requireAdmin() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login?next=/notices");
  if (!viewer.isAdmin) redirect("/notices?denied=1");
  return viewer;
}
