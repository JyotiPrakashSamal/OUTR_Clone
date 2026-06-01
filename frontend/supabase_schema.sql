-- ====================================================================
-- OUTR PORTAL DATABASE SCHEMA (FINAL UP-TO-DATE PRODUCTION VERSION)
-- Execute this script in your Supabase SQL Editor.
-- ====================================================================

-- 1. Profiles Table (Linked to Supabase Auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('admin', 'warden', 'adviser', 'hos', 'dean_academic', 'dean_pga', 'controller', 'student')),
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

-- 2. Hostel Roster Students Table
create table if not exists public.students_hostel (
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

-- 3. File Tracking Table (With Dynamic 3-Way Routing Columns)
create table if not exists public.file_tracking (
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
  forwarded_to text check (forwarded_to in ('dean_pga', 'dean_academic', 'controller')),
  dean_status text default 'Pending' check (dean_status in ('Pending', 'Approved', 'Rejected')),
  dean_name text,
  controller_status text not null default 'Pending' check (controller_status in ('Pending', 'Approved', 'Rejected')),
  controller_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on File Tracking
alter table public.file_tracking enable row level security;

-- File Tracking Policies (Strict Role-Based and Authenticated Access Only)
drop policy if exists "Anyone can view tracking files." on public.file_tracking;
create policy "Select tracking files policy"
  on public.file_tracking for select
  using (
    auth.role() = 'authenticated'
    and (
      exists (
        select 1 from public.profiles
        where public.profiles.id = auth.uid()
        and public.profiles.role in ('adviser', 'hos', 'dean_academic', 'dean_pga', 'controller', 'admin')
      )
      -- Students can only view their own files
      or student_regd = split_part(auth.email(), '@', 1)
    )
  );

drop policy if exists "Anyone can insert tracking files." on public.file_tracking;
create policy "Insert tracking files policy"
  on public.file_tracking for insert
  with check (
    auth.role() = 'authenticated'
    and (
      exists (
        select 1 from public.profiles
        where public.profiles.id = auth.uid()
        and public.profiles.role = 'student'
      )
      -- Ensure student_regd matches the user's registration number
      or student_regd = split_part(auth.email(), '@', 1)
    )
  );

drop policy if exists "Faculty and admins can manage tracking files." on public.file_tracking;
create policy "Faculty and admins can manage tracking files."
  on public.file_tracking for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('adviser', 'hos', 'dean_academic', 'dean_pga', 'controller', 'admin')
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

-- ====================================================================
-- EXAMS, GRADES, & STORAGE SCHEMA UPGRADES (PRODUCTION VERSION)
-- ====================================================================

-- 5. Student Grade Sheets Table
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

-- Policies for student_grades (Strict Role-Based Policies)
drop policy if exists "Anyone can select student grades." on public.student_grades;
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
      or regd_no = split_part(auth.email(), '@', 1)
    )
  );

drop policy if exists "Anyone can insert student grades." on public.student_grades;
create policy "Insert student grades policy"
  on public.student_grades for insert
  with check (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

drop policy if exists "Anyone can update student grades." on public.student_grades;
create policy "Update student grades policy"
  on public.student_grades for update
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

drop policy if exists "Anyone can delete student grades." on public.student_grades;
create policy "Delete student grades policy"
  on public.student_grades for delete
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

-- 6. Student Admit Cards Table
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

-- Policies for student_admit_cards (Strict Role-Based Policies)
drop policy if exists "Anyone can select admit cards." on public.student_admit_cards;
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
      or regd_no = split_part(auth.email(), '@', 1)
    )
  );

drop policy if exists "Anyone can insert admit cards." on public.student_admit_cards;
create policy "Insert admit cards policy"
  on public.student_admit_cards for insert
  with check (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

drop policy if exists "Anyone can update admit cards." on public.student_admit_cards;
create policy "Update admit cards policy"
  on public.student_admit_cards for update
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );

drop policy if exists "Anyone can delete admit cards." on public.student_admit_cards;
create policy "Delete admit cards policy"
  on public.student_admit_cards for delete
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('admin', 'controller')
    )
  );


-- 7. Supabase Storage Bucket Provisioning
insert into storage.buckets (id, name, public) 
values ('clearance-letters', 'clearance-letters', false)
on conflict (id) do nothing;

-- Storage RLS Policies
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


-- 8. Performance Optimization Indexes
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_school_id on public.profiles(school_id);

create index if not exists idx_students_hostel_hostel on public.students_hostel(hostel);
create index if not exists idx_students_hostel_status on public.students_hostel(status);

create index if not exists idx_file_tracking_student_regd on public.file_tracking(student_regd);
create index if not exists idx_file_tracking_school_id on public.file_tracking(school_id);
create index if not exists idx_file_tracking_forwarded_to on public.file_tracking(forwarded_to);



