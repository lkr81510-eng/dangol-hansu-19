import type { ReactNode } from "react";
import Link from "next/link";
import NoticeCard from "@/components/NoticeCard";
import CategoryIcon from "@/components/CategoryIcon";
import { getViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type Category, type Notice } from "@/lib/notices";

const STEPS = [
  {
    no: "01",
    title: "단골이 말합니다",
    body: "맛 양, 서비스, 새 메뉴 아이디어까지. 자주 오는 손님의 한마디가 가장 정확한 조언입니다.",
  },
  {
    no: "02",
    title: "AI가 정리합니다",
    body: "흩어진 의견을 주제별로 묶고, 자주 나온 이야기와 새로운 제안을 한눈에 보여 드립니다.",
    soon: true,
  },
  {
    no: "03",
    title: "식당이 달라집니다",
    body: "사장님은 정리된 의견으로 개선하고, 단골은 할인과 혜택으로 보답받습니다.",
  },
];

const CATEGORY_GUIDE: Record<Category, string> = {
  general: "영업시간 변경, 휴무일 등 식당 소식",
  discount: "단골에게 먼저 알려 드리는 할인·이벤트",
  advisory: "자문단 모집과 의견 요청 안내",
};

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { welcome } = await searchParams;
  const supabase = await createClient();
  const [{ data }, viewer] = await Promise.all([
    supabase
      .from("notices")
      .select("id, category, title, content, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(4),
    getViewer(),
  ]);
  const latest = (data ?? []) as Notice[];

  return (
    <>
      {welcome && (
        <div className="bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white" role="status">
          이메일 인증이 완료되었습니다. 단골 한수에 오신 것을 환영합니다!
        </div>
      )}

      {/* 히어로 */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="text-sm font-semibold text-brand-600">우리 동네 식당 단골 자문단</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl sm:leading-tight">
            단골이 말하고,<br />
            AI가 정리하고,<br />
            <span className="text-brand-600">식당이 달라집니다</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600">
            자주 찾는 식당에 진짜 의견을 전하고, 할인 소식은 누구보다 먼저 받아 보세요.
            지금은 식당 한 곳과 함께 시작합니다.
          </p>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            {viewer ? (
              <Link href="/notices" className="btn-primary px-6 py-3 text-base">공지사항 보기</Link>
            ) : (
              <>
                <Link href="/signup" className="btn-primary px-6 py-3 text-base">단골로 등록하기</Link>
                <Link href="/notices" className="btn-ghost px-6 py-3 text-base">공지사항 먼저 보기</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 분류 바로가기 */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-5">
        <h2 className="text-lg font-bold">어떤 소식을 찾으세요?</h2>
        <ul className="mt-4 grid grid-cols-4 gap-2 sm:max-w-md sm:gap-3">
          {(Object.keys(CATEGORIES) as Category[]).map((key) => (
            <li key={key}>
              <CategoryShortcut
                href={`/notices?category=${key}`}
                label={CATEGORIES[key].label}
                title={CATEGORY_GUIDE[key]}
                icon={<CategoryIcon category={key} />}
                tone={CATEGORIES[key].badge}
              />
            </li>
          ))}
          <li>
            <CategoryShortcut
              href="/notices"
              label="전체"
              title="모든 공지 보기"
              icon={<CategoryIcon category="all" />}
              tone="bg-white text-stone-600 ring-1 ring-stone-200"
            />
          </li>
        </ul>
      </section>

      {/* 최근 공지 */}
      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-5">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-bold">최근 공지</h2>
          <Link href="/notices" className="text-sm font-semibold text-brand-700 hover:underline">전체 보기 →</Link>
        </div>
        {latest.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-10 text-center text-sm text-stone-500">
            아직 등록된 공지가 없어요.
          </p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-5">
            {latest.map((n) => (
              <li key={n.id}><NoticeCard notice={n} /></li>
            ))}
          </ul>
        )}
      </section>

      {/* 작동 방식 */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-5">
        <h2 className="text-lg font-bold">단골 한수는 이렇게 움직여요</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.no} className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-brand-600">{s.no}</span>
                {s.soon && <ComingSoon />}
              </div>
              <h3 className="mt-2 font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 준비 중 기능 */}
      <section id="coming-soon" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-5">
        <h2 className="text-lg font-bold">곧 만나요</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FeatureSoon
            title="AI 의견 요약"
            body="단골 자문단의 의견을 AI가 주제별로 정리해 사장님께 전달합니다."
          />
          <FeatureSoon
            title="단골 포인트"
            body="의견을 남기고 방문할 때마다 포인트를 모아 할인으로 돌려받으세요."
          />
        </div>
      </section>
    </>
  );
}

function CategoryShortcut({
  href,
  label,
  title,
  icon,
  tone,
}: {
  href: string;
  label: string;
  title: string;
  icon: ReactNode;
  tone: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      className="group flex flex-col items-center gap-2 rounded-2xl p-2 text-center transition hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      <span className={`flex size-14 items-center justify-center rounded-2xl transition group-hover:scale-105 sm:size-16 ${tone}`}>
        {icon}
      </span>
      <span className="text-sm font-semibold text-stone-700 group-hover:text-brand-700">{label}</span>
    </Link>
  );
}

function ComingSoon() {
  return (
    <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-semibold text-stone-600">
      준비 중
    </span>
  );
}

function FeatureSoon({ title, body }: { title: string; body: string }) {
  return (
    <div aria-disabled="true" className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-5">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-stone-700">{title}</h3>
        <ComingSoon />
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{body}</p>
    </div>
  );
}
