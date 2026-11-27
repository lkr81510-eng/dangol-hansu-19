import Link from "next/link";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryTabs from "@/components/CategoryTabs";
import NoticeCard from "@/components/NoticeCard";
import SortSelect from "@/components/SortSelect";
import { getViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, cleanQuery, isCategory, noticesHref, type Notice, type NoticeSort } from "@/lib/notices";

export const metadata = { title: "공지사항" };

export default async function NoticesPage({ searchParams }: PageProps<"/notices">) {
  const params = await searchParams;
  const active = isCategory(params.category) ? params.category : "all";
  const q = cleanQuery(params.q);
  const sort: NoticeSort = params.sort === "oldest" ? "oldest" : "latest";

  const supabase = await createClient();
  let query = supabase
    .from("notices")
    .select("id, category, title, content, created_at, updated_at")
    .order("created_at", { ascending: sort === "oldest" })
    .limit(60);
  if (active !== "all") query = query.eq("category", active);
  if (q) query = query.or(`title.ilike."%${q}%",content.ilike."%${q}%"`);

  const [{ data, error }, viewer] = await Promise.all([query, getViewer()]);
  const notices = (data ?? []) as Notice[];
  const heading = active === "all" ? "공지사항" : `${CATEGORIES[active].label} 공지`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8">
      <Breadcrumb
        items={[
          { label: "홈", href: "/" },
          active === "all" && !q
            ? { label: "공지사항" }
            : { label: "공지사항", href: "/notices" },
          ...(active !== "all" ? [{ label: CATEGORIES[active].label }] : []),
        ]}
      />

      <div className="mt-3 flex items-end justify-between gap-4">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{heading}</h1>
        {viewer?.isAdmin && (
          <Link href="/notices/new" className="btn-primary shrink-0">+ 공지 작성</Link>
        )}
      </div>

      {params.denied && (
        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
          관리자만 이용할 수 있는 기능입니다.
        </p>
      )}
      {params.deleted && (
        <p className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900" role="status">
          공지를 삭제했습니다.
        </p>
      )}

      {/* 필터 줄 */}
      <div className="mt-6">
        <CategoryTabs active={active} q={q} sort={sort} />
      </div>

      {/* 결과 수 · 검색어 · 정렬 */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-stone-600">
          {q ? (
            <>
              <strong className="text-stone-900">‘{q}’</strong> 검색 결과 {notices.length}건
              <Link href={noticesHref({ category: active, sort })} className="ml-2 text-stone-500 underline hover:text-brand-700">
                검색 지우기
              </Link>
            </>
          ) : (
            <>총 {notices.length}건</>
          )}
        </p>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      {error ? (
        <p className="mt-10 text-center text-sm text-red-600">공지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      ) : notices.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-16 text-center">
          <p className="font-semibold text-stone-700">
            {q
              ? "검색 결과가 없어요."
              : active === "all"
                ? "아직 등록된 공지가 없어요."
                : `'${CATEGORIES[active].label}' 공지가 아직 없어요.`}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            {q ? "다른 단어로 검색해 보세요." : "새 소식이 올라오면 이곳에 보여 드릴게요."}
          </p>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5">
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
