-- ====================================================================
-- EXAMS, GRADES, & STORAGE LOCKDOWN PATCH (PRODUCTION-GRADE VERSION)
-- Execute this patch in your Supabase SQL Editor (New Query -> paste and run).
-- ====================================================================

-- 1. Create Student Grade Sheets Table (If not exists)
create table if not exists public.student_grades (
  id uuid default gen_random_uuid() primary key,
  regd_no text not null,
  name text not null,
  class_name text not null,
  semester text not null,
  exam_type text not null default 'Regular' check (exam_type in ('Regular', 'Back')),
  status text not null default 'PASS',
  subjects jsonb not null, -- Array of: { subName, subCode, credits, secured, total }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row-Level Security
alter table public.student_grades enable row level security;

-- Drop all old permissive policies
drop policy if exists "Anyone can select student grades." on public.student_grades;
drop policy if exists "Anyone can insert student grades." on public.student_grades;
drop policy if exists "Anyone can update student grades." on public.student_grades;
drop policy if exists "Anyone can delete student grades." on public.student_grades;
drop policy if exists "Select student grades policy" on public.student_grades;
drop policy if exists "Insert student grades policy" on public.student_grades;
drop policy if exists "Update student grades policy" on public.student_grades;
drop policy if exists "Delete student grades policy" on public.student_grades;

-- Strict Role-Based Policies for Grades Sheets
create policy "Select student grades policy"
  on public.student_grades for select
  using (
    auth.role() = 'authenticated' 
    and (
      exists (
        select 1 from public.profiles
        where public.profiles.id = auth.uid()
        and public.profiles.role in ('admin', 'controller')
      )
      -- Students can view their own grades if their email matches their regd_no prefix
      or regd_no = split_part(auth.email(), '@', 1)
    )
  );

create policy "Insert student grades policy"
  on public.student_grades for insert
  with check (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

create policy "Update student grades policy"
  on public.student_grades for update
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

create policy "Delete student grades policy"
  on public.student_grades for delete
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );


-- 2. Create Student Admit Cards Table (If not exists)
create table if not exists public.student_admit_cards (
  id uuid default gen_random_uuid() primary key,
  regd_no text not null,
  name text not null,
  branch text not null,
  semester text not null,
  academic_year text not null,
  exam_type text not null,
  dob date not null,
  subjects jsonb not null, -- Array of: { code, name, date, time }
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row-Level Security
alter table public.student_admit_cards enable row level security;

-- Drop all old permissive policies
drop policy if exists "Anyone can select admit cards." on public.student_admit_cards;
drop policy if exists "Anyone can insert admit cards." on public.student_admit_cards;
drop policy if exists "Anyone can update admit cards." on public.student_admit_cards;
drop policy if exists "Anyone can delete admit cards." on public.student_admit_cards;
drop policy if exists "Select admit cards policy" on public.student_admit_cards;
drop policy if exists "Insert admit cards policy" on public.student_admit_cards;
drop policy if exists "Update admit cards policy" on public.student_admit_cards;
drop policy if exists "Delete admit cards policy" on public.student_admit_cards;

-- Strict Role-Based Policies for Admit Cards
create policy "Select admit cards policy"
  on public.student_admit_cards for select
  using (
    auth.role() = 'authenticated' 
    and (
      exists (
        select 1 from public.profiles
        where public.profiles.id = auth.uid()
        and public.profiles.role in ('admin', 'controller')
      )
      -- Students can view their own admit cards if their email matches their regd_no prefix
      or regd_no = split_part(auth.email(), '@', 1)
    )
  );

create policy "Insert admit cards policy"
  on public.student_admit_cards for insert
  with check (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

create policy "Update admit cards policy"
  on public.student_admit_cards for update
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

create policy "Delete admit cards policy"
  on public.student_admit_cards for delete
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );


-- 3. Supabase Storage Bucket Provisioning (For Clearance Letter uploads)
insert into storage.buckets (id, name, public) 
values ('clearance-letters', 'clearance-letters', false)
on conflict (id) do nothing;

-- Enable storage RLS policies
drop policy if exists "Authenticated users can upload clearance letters" on storage.objects;
create policy "Authenticated users can upload clearance letters"
  on storage.objects for insert
  with check (
    bucket_id = 'clearance-letters' 
    and auth.role() = 'authenticated'
  );

drop policy if exists "Authenticated users can read clearance letters" on storage.objects;
create policy "Authenticated users can read clearance letters"
  on storage.objects for select
  using (
    bucket_id = 'clearance-letters' 
    and auth.role() = 'authenticated'
  );
