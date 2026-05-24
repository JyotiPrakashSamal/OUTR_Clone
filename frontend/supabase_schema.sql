-- ====================================================================
-- OUTR PORTAL DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor.
-- ====================================================================

-- 1. Profiles Table (Linked to Supabase Auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('admin', 'adviser', 'hos', 'controller', 'warden', 'student')),
  school_id text, -- e.g., 'SCS', 'SEE', 'SIP', 'SEEC', 'SMS', 'TED', 'Biotech', 'SBSH'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by authenticated users." 
  on public.profiles for select 
  using (auth.role() = 'authenticated');

create policy "Users can update their own profile." 
  on public.profiles for update 
  using (auth.uid() = id);

-- 2. Hostel Students Table
create table public.students_hostel (
  id uuid default gen_random_uuid() primary key,
  regd_no text unique not null,
  name text not null,
  hostel text not null check (hostel in ('APJKHR', 'RHR', 'KHR', 'KCHR')),
  room text,
  status text not null default 'Active' check (status in ('Active', 'Checked Out', 'Inactive')),
  email text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Hostel Students
alter table public.students_hostel enable row level security;

-- Hostel Students Policies
create policy "Authenticated users can view hostel student records."
  on public.students_hostel for select
  using (auth.role() = 'authenticated');

create policy "Only wardens and admins can modify hostel records."
  on public.students_hostel for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('warden', 'admin')
    )
  );

-- 3. File Tracking Table
create table public.file_tracking (
  id uuid default gen_random_uuid() primary key,
  file_no text unique not null,
  student_name text not null,
  student_regd text not null,
  school_id text not null,
  subject text not null,
  file_url text, -- Supabase Storage URL for PDF documents
  adviser_status text not null default 'Pending' check (adviser_status in ('Pending', 'Approved', 'Rejected')),
  adviser_name text,
  hos_status text not null default 'Pending' check (hos_status in ('Pending', 'Approved', 'Rejected')),
  hos_name text,
  controller_status text not null default 'Pending' check (controller_status in ('Pending', 'Approved', 'Rejected')),
  controller_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on File Tracking
alter table public.file_tracking enable row level security;

-- File Tracking Policies
create policy "Authenticated users can view tracking files."
  on public.file_tracking for select
  using (auth.role() = 'authenticated');

create policy "Faculty and admins can manage tracking files."
  on public.file_tracking for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('adviser', 'hos', 'controller', 'admin')
    )
  );

-- 4. Automatically Sync Auth Users to Profiles Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role, school_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'school_id'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
