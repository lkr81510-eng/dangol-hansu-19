# 단골 한수

> 단골이 말하고, AI가 정리하고, 식당이 달라집니다

식당 단골이 자문단이 되어 의견을 내고, 할인 소식을 먼저 받는 서비스입니다.
현재는 **식당 1곳 전용**으로 운영합니다.

**배포 주소: https://dangol-hansu-19.vercel.app**

- 누구나 공지사항을 볼 수 있고, 회원가입 후 로그인할 수 있습니다.
- 공지 작성·수정·삭제는 관리자 계정에서만 가능합니다.

## 주요 기능

| 기능 | 내용 |
|---|---|
| 회원 | 회원가입(이메일 인증), 로그인, 로그아웃 — Supabase Auth + `@supabase/ssr` |
| 공지사항 | 목록, 상세, 작성, 수정, 삭제 |
| 분류 | 일반 · 할인 · 자문단 (목록 필터, 헤더 메뉴) |
| 검색·정렬 | 제목·내용 검색, 최신순/오래된순 |
| 권한 | 읽기는 누구나, 작성·수정·삭제는 관리자만 (화면 + RLS) |
| 준비 중 | AI 의견 요약, 단골 포인트 (화면에 "준비 중"으로 표시) |

## 기술 스택

- Next.js 16 (App Router, Turbopack, `proxy.ts`) · React 19 · TypeScript
- Tailwind CSS v4 (`@tailwindcss/turbopack` 로더)
- Supabase (Postgres, Auth, RLS)
- Cache Components는 사용하지 않습니다.

## 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수

프로젝트 루트에 `.env.local`을 만듭니다. **이 파일은 Git에 올리지 않습니다** (`.gitignore`에 `.env*` 포함).

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

- publishable(anon) 키만 사용합니다. **secret / service_role 키는 쓰지 않습니다.**
- 키는 Supabase 대시보드 → Project Settings → API Keys에서 확인합니다.

### 3. 데이터베이스

[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)을 새 프로젝트에 한 번 적용합니다.
Supabase 대시보드의 SQL Editor에 붙여 넣어 실행하거나, CLI로 실행합니다.

```bash
supabase db query --remote=<project-ref> -f supabase/migrations/0001_init.sql
```

### 4. Auth URL 설정

이메일 인증 링크가 앱으로 돌아오도록 Supabase 대시보드 → Authentication → URL Configuration에서 설정합니다.

- Site URL: `http://localhost:3000` (배포 후에는 `https://<배포 주소>`, 아래 "배포" 참고)
- Redirect URLs: `http://localhost:3000/**` (배포 후 `https://<배포 주소>/**`도 추가)

### 5. 실행

```bash
npm run dev     # 개발 서버 http://localhost:3000
npm run build   # 프로덕션 빌드 확인
npm run lint
```

### 6. 관리자 지정

회원가입 시 모든 계정은 `member`로 만들어집니다. 관리자는 SQL Editor(또는 CLI)에서 직접 지정합니다.

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = '관리자 이메일');
```

앱이나 API로는 role을 바꿀 수 없습니다 (아래 권한 구조 참고).

## 배포 (Vercel)

1. Vercel에서 이 GitHub 저장소를 Import 합니다. `main`에 push하면 자동으로 다시 배포됩니다.
2. Settings → Environment Variables에 **두 개 모두** 등록합니다 (Production·Preview).
   - Key: `NEXT_PUBLIC_SUPABASE_URL` / Value: `https://<project-ref>.supabase.co`
   - Key: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / Value: `sb_publishable_...`
   - Key 칸에는 변수 이름, Value 칸에는 `=` 오른쪽 값만 넣습니다.
3. 환경 변수를 추가·변경한 뒤에는 **Redeploy** 해야 반영됩니다 (`NEXT_PUBLIC_` 값은 빌드 시 포함).
4. Supabase Auth URL 설정에 배포 주소를 **`https://`로** 등록합니다.
   - Site URL: `https://<배포 주소>`
   - Redirect URLs: `https://<배포 주소>/**` (로컬 개발용 `http://localhost:3000/**`도 유지)

> 모든 페이지가 500 오류라면 대부분 환경 변수 누락입니다.
> Vercel Logs에 `Your project's URL and Key are required…` 또는 `Invalid supabaseUrl…`이 보이면 2번을 다시 확인하세요.

## 권한 구조

| 대상 | 방문자 | 일반 회원 | 관리자 |
|---|---|---|---|
| 공지 읽기 | O | O | O |
| 공지 작성·수정·삭제 | X | X | O |
| 내 프로필 읽기 | — | O | O |
| 내 닉네임 수정 | — | O | O |
| 내 role 변경 | — | X | X (SQL로만) |

이중으로 막습니다.

1. **화면·서버**: 관리자 전용 페이지와 Server Action에서 `requireAdmin()`으로 확인 ([lib/auth.ts](lib/auth.ts))
2. **DB (최종 방어)**
   - `notices`: SELECT는 모두 허용, INSERT/UPDATE/DELETE는 `is_admin()`일 때만 허용하는 RLS 정책
   - `profiles`: 회원에게는 `nickname` 컬럼 UPDATE 권한만 부여 (컬럼 단위 GRANT)
   - `profiles`: role 변경을 거부하는 트리거
   - 가입 트리거는 메타데이터와 관계없이 항상 `member`로 생성

## 폴더 구조

```
app/
  page.tsx                 홈 (소개, 분류 바로가기, 최근 공지, 준비 중 기능)
  login/ signup/           로그인 · 회원가입
  auth/actions.ts          로그인 · 회원가입 · 로그아웃 Server Action
  auth/confirm/route.ts    이메일 인증 링크 처리
  notices/                 목록 · 상세 · 작성 · 수정, actions.ts(CRUD)
components/                헤더, 검색창, 분류 메뉴, 카드, 폼 등
lib/
  supabase/server.ts       서버용 Supabase 클라이언트
  auth.ts                  현재 사용자 조회, 관리자 확인
  notices.ts               분류 정의, 타입, 유틸
proxy.ts                   요청마다 Supabase 세션 갱신
supabase/migrations/       DB 스키마 · RLS 정책
```

## 화면 참고

분류 버튼과 카드 목록 같은 **배치만** 일반적인 서비스 마켓 구성을 참고했습니다.
로고, 색상, 문구, 이미지는 모두 자체 제작입니다.
