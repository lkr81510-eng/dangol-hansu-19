import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DeleteNoticeButton from "@/components/DeleteNoticeButton";
import { getViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, formatDate, type Notice } from "@/lib/notices";

async function getNotice(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("notices")
    .select("id, category, title, content, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();
  return data as Notice | null;
}

export async function generateMetadata({ params }: PageProps<"/notices/[id]">): Promise<Metadata> {
  const notice = await getNotice((await params).id);
  return { title: notice?.title ?? "공지사항" };
}

export default async function NoticeDetailPage({ params, searchParams }: PageProps<"/notices/[id]">) {
  const { id } = await params;
  const { error } = await searchParams;
  const [notice, viewer] = await Promise.all([getNotice(id), getViewer()]);
  if (!notice) notFound();

  const cat = CATEGORIES[notice.category];
  const edited = new Date(notice.updated_at).getTime() - new Date(notice.created_at).getTime() > 60_000;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-12">
      <Link href="/notices" className="text-sm font-medium text-stone-500 hover:text-brand-700">
        ← 공지사항 목록
      </Link>

      <article className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 sm:p-8">
        <Link
          href={`/notices?category=${notice.category}`}
          className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${cat.badge}`}
        >
          {cat.label}
        </Link>
        <h1 className="mt-3 text-xl font-extrabold leading-snug sm:text-2xl">{notice.title}</h1>
        <p className="mt-2 text-xs text-stone-400">
          <time dateTime={notice.created_at}>{formatDate(notice.created_at)}</time>
          {edited && <> · 수정됨 {formatDate(notice.updated_at)}</>}
        </p>
        <hr className="my-6 border-stone-100" />
        <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-stone-800">
          {notice.content}
        </div>
      </article>

      {error === "delete" && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          삭제하지 못했습니다. 권한을 확인해 주세요.
        </p>
      )}

      {viewer?.isAdmin && (
        <div className="mt-4 flex justify-end gap-2">
          <Link href={`/notices/${notice.id}/edit`} className="btn-ghost">수정</Link>
          <DeleteNoticeButton id={notice.id} />
        </div>
      )}
    </div>
  );
}
