import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "단골 한수 — 단골이 말하고, AI가 정리하고, 식당이 달라집니다",
    template: "%s | 단골 한수",
  },
  description:
    "식당 단골이 자문단이 되어 의견을 내고, 할인 소식을 가장 먼저 받는 서비스.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17714f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-5xl px-5 py-8 text-xs leading-relaxed text-stone-500">
            <p className="font-semibold text-stone-700">단골 한수</p>
            <p className="mt-1">단골이 말하고, AI가 정리하고, 식당이 달라집니다.</p>
            <p className="mt-3">© {new Date().getFullYear()} 단골 한수</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
