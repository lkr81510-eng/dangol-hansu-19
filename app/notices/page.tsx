import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import NoticeCard from "@/components/NoticeCard";
import { getViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, isCategory, type Notice } from "@/lib/notices";

export const metadata = { title: "공지사항" };

export default async function NoticesPage({ searchParams }: PageProps<"/notices">) {
  const { category, denied, deleted } = await searchParams;
  const active = isCategory(category) ? category : "all";

  const supabase = await createClient();
  let query = supabase
    .from("notices")
    .select("id, category, title, content, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(60);
  if (active !== "all") query = query.eq("category", active);

  const [{ data, error }, viewer] = await Promise.all([query, getViewer()]);
  const notices = (data ?? []) as Notice[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">공지사항</h1>
          <p className="mt-1 text-sm text-stone-600">식당 소식, 할인 안내, 자문단 모집을 한곳에서.</p>
        </div>
        {viewer?.isAdmin && (
          <Link href="/notices/new" className="btn-primary shrink-0">+ 공지 작성</Link>
        )}
      </div>

      {denied && (
        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
          관리자만 이용할 수 있는 기능입니다.
        </p>
      )}
      {deleted && (
        <p className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900" role="status">
          공지를 삭제했습니다.
        </p>
      )}

      <div className="mt-6">
        <CategoryTabs active={active} />
      </div>

      {error ? (
        <p className="mt-10 text-center text-sm text-red-600">공지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      ) : notices.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-16 text-center">
          <p className="font-semibold text-stone-700">
            {active === "all" ? "아직 등록된 공지가 없어요." : `'${CATEGORIES[active].label}' 공지가 아직 없어요.`}
          </p>
          <p className="mt-1 text-sm text-stone-500">새 소식이 올라오면 이곳에 보여 드릴게요.</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((n) => (
            <li key={n.id}>
              <NoticeCard notice={n} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
