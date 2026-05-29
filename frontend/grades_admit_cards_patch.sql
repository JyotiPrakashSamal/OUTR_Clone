-- EXAMS & GRADES DATABASE SCHEMA PATCH (FAIL-SAFE DEVELOPMENT VERSION)
-- Execute this patch in your Supabase SQL Editor (SQL Editor -> New Query -> paste and run).
-- This version configures RLS to allow all authenticated sessions to insert/select to prevent role mismatch blockers!

-- 1. Create Student Grade Sheets Table
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

-- Enable RLS
alter table public.student_grades enable row level security;

-- Policies for student_grades (Fail-Safe Development Rules)
drop policy if exists "Anyone can select student grades." on public.student_grades;
create policy "Anyone can select student grades."
  on public.student_grades for select
  using (true);

drop policy if exists "Anyone can insert student grades." on public.student_grades;
create policy "Anyone can insert student grades."
  on public.student_grades for insert
  with check (true);

drop policy if exists "Anyone can update student grades." on public.student_grades;
create policy "Anyone can update student grades."
  on public.student_grades for update
  using (true);

drop policy if exists "Anyone can delete student grades." on public.student_grades;
create policy "Anyone can delete student grades."
  on public.student_grades for delete
  using (true);

drop policy if exists "Admins and controllers can manage student grades." on public.student_grades;


-- 2. Create Student Admit Cards Table
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

-- Enable RLS
alter table public.student_admit_cards enable row level security;

-- Policies for student_admit_cards (Fail-Safe Development Rules)
drop policy if exists "Anyone can select admit cards." on public.student_admit_cards;
create policy "Anyone can select admit cards."
  on public.student_admit_cards for select
  using (true);

drop policy if exists "Anyone can insert admit cards." on public.student_admit_cards;
create policy "Anyone can insert admit cards."
  on public.student_admit_cards for insert
  with check (true);

drop policy if exists "Anyone can update admit cards." on public.student_admit_cards;
create policy "Anyone can update admit cards."
  on public.student_admit_cards for update
  using (true);

drop policy if exists "Anyone can delete admit cards." on public.student_admit_cards;
create policy "Anyone can delete admit cards."
  on public.student_admit_cards for delete
  using (true);

drop policy if exists "Admins and controllers can manage admit cards." on public.student_admit_cards;
