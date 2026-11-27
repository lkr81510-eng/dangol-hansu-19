// 자체 제작 로고: 말풍선 안의 숟가락 형태
export default function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M6 4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H14l-6 5v-5H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
          fill="#17714f"
        />
        <ellipse cx="16" cy="11" rx="3.2" ry="4" fill="#fbf8f2" />
        <rect x="15" y="14" width="2" height="7" rx="1" fill="#fbf8f2" />
      </svg>
      <span className="text-lg font-extrabold tracking-tight text-stone-900">
        단골 <span className="text-brand-600">한수</span>
      </span>
    </span>
  );
}
