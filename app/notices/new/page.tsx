import NoticeForm from "@/components/NoticeForm";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "공지 작성" };

export default async function NewNoticePage() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-12">
      <h1 className="mb-6 text-2xl font-extrabold">공지 작성</h1>
      <NoticeForm />
    </div>
  );
}
