import type { Category } from "@/lib/notices";

// 직접 그린 단순 아이콘 (외부 이미지 사용 안 함)
export default function CategoryIcon({
  category,
  size = 26,
}: {
  category: Category | "all";
  size?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (category) {
    case "general": // 확성기
      return (
        <svg {...props}>
          <path d="M4 10v4h3l6 4V6L7 10H4z" />
          <path d="M16.5 9a4 4 0 0 1 0 6" />
        </svg>
      );
    case "discount": // 가격표
      return (
        <svg {...props}>
          <path d="M3 12V4h8l10 10-8 8L3 12z" />
          <circle cx="7.5" cy="8.5" r="1.3" />
        </svg>
      );
    case "advisory": // 말풍선
      return (
        <svg {...props}>
          <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
          <path d="M8 10h8M8 13h5" />
        </svg>
      );
    default: // 전체: 격자
      return (
        <svg {...props}>
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
        </svg>
      );
  }
}
