export const CATEGORIES = {
  general: {
    label: "일반",
    badge: "bg-stone-100 text-stone-700",
    thumb: "bg-stone-100 text-stone-500",
  },
  discount: {
    label: "할인",
    badge: "bg-orange-100 text-orange-700",
    thumb: "bg-orange-50 text-orange-500",
  },
  advisory: {
    label: "자문단",
    badge: "bg-teal-100 text-teal-800",
    thumb: "bg-teal-50 text-teal-600",
  },
} as const;

export type Category = keyof typeof CATEGORIES;

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && value in CATEGORIES;
}

export type Notice = {
  id: number;
  category: Category;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type NoticeSort = "latest" | "oldest";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(iso));
}

// 목록 주소 만들기: 분류·검색어·정렬을 함께 유지
export function noticesHref(params: {
  category?: Category | "all";
  q?: string;
  sort?: NoticeSort;
}) {
  const sp = new URLSearchParams();
  if (params.category && params.category !== "all") sp.set("category", params.category);
  if (params.q) sp.set("q", params.q);
  if (params.sort && params.sort !== "latest") sp.set("sort", params.sort);
  const qs = sp.toString();
  return qs ? `/notices?${qs}` : "/notices";
}

// 검색어 정리: PostgREST 필터 문법에 쓰이는 문자를 제거
export function cleanQuery(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/[%_*,()"\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 50);
}
