export const CATEGORIES = {
  general: { label: "일반", badge: "bg-stone-100 text-stone-700" },
  discount: { label: "할인", badge: "bg-orange-100 text-orange-700" },
  advisory: { label: "자문단", badge: "bg-teal-100 text-teal-800" },
} as const;

export type Category = keyof typeof CATEGORIES;

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

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(iso));
}
