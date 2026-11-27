import { notFound } from "next/navigation";
import NoticeForm from "@/components/NoticeForm";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Notice } from "@/lib/notices";

export const metadata = { title: "공지 수정" };

export default async function EditNoticePage({ params }: PageProps<"/notices/[id]/edit">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("notices")
    .select("id, category, title, content, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-12">
      <h1 className="mb-6 text-2xl font-extrabold">공지 수정</h1>
      <NoticeForm notice={data as Notice} />
    </div>
  );
}
