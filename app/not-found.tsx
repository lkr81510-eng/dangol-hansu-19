import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <h1 className="text-xl font-bold">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-sm text-stone-600">삭제되었거나 주소가 잘못되었을 수 있습니다.</p>
      <Link href="/" className="btn-primary mt-6">홈으로</Link>
    </div>
  );
}
