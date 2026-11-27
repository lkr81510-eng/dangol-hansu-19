-- 단골 한수: 프로필(역할) + 공지사항
-- 읽기는 누구나, 작성·수정·삭제는 관리자만. 일반 회원은 자기 role을 바꿀 수 없음.

-- ─────────────────────────────────────────────
-- 1) profiles
-- ─────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text check (char_length(nickname) <= 30),
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 관리자 여부 확인 (RLS 재귀를 피하려고 security definer)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 본인 프로필만 조회
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- 본인 프로필만 수정 (컬럼은 아래 GRANT로 nickname만 허용)
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- INSERT/DELETE 정책 없음 → 클라이언트에서 불가 (가입 트리거만 생성)

-- 컬럼 단위 권한: role 컬럼은 클라이언트에서 수정 불가
revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (nickname) on public.profiles to authenticated;

-- 이중 방어: API 역할(anon/authenticated)로는 role 변경 거부
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and current_user in ('anon', 'authenticated') then
    raise exception 'role 은 변경할 수 없습니다.';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- 회원가입 시 프로필 자동 생성 (role은 항상 member)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname, role)
  values (
    new.id,
    left(nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''), 30),
    'member'
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- 2) notices
-- ─────────────────────────────────────────────
create table public.notices (
  id bigint generated always as identity primary key,
  category text not null default 'general'
    check (category in ('general', 'discount', 'advisory')),
  title text not null check (char_length(title) between 1 and 200),
  content text not null check (char_length(content) between 1 and 20000),
  author_id uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notices_category_created_idx on public.notices (category, created_at desc);
create index notices_created_idx on public.notices (created_at desc);

alter table public.notices enable row level security;

create policy "notices_select_all"
  on public.notices for select
  to anon, authenticated
  using (true);

create policy "notices_insert_admin"
  on public.notices for insert
  to authenticated
  with check ((select public.is_admin()) and author_id = (select auth.uid()));

create policy "notices_update_admin"
  on public.notices for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "notices_delete_admin"
  on public.notices for delete
  to authenticated
  using ((select public.is_admin()));

revoke all on public.notices from anon, authenticated;
grant select on public.notices to anon, authenticated;
grant insert (category, title, content), update (category, title, content), delete
  on public.notices to authenticated;

-- updated_at 자동 갱신 + author_id/created_at 변경 방지
create or replace function public.notices_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.author_id := old.author_id;
  new.created_at := old.created_at;
  return new;
end;
$$;

create trigger notices_set_updated_at
  before update on public.notices
  for each row execute function public.notices_before_update();
