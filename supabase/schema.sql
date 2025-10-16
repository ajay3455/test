-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ===============================================
-- Table: pre_authorized_contractors
-- ===============================================
create table if not exists public.pre_authorized_contractors (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz not null default timezone('utc'::text, now()),
    name text not null,
    company text not null,
    contact_number text,
    known_license_plates text[],
    notes text,
    category text,
    is_active boolean not null default true,
    archived boolean not null default false,
    profile_picture_url text,
    created_by uuid references auth.users(id)
);

alter table public.pre_authorized_contractors enable row level security;

create policy "Allow authenticated access"
  on public.pre_authorized_contractors
  for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- ===============================================
-- Table: contractor_sign_ins
-- ===============================================
create table if not exists public.contractor_sign_ins (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamptz not null default timezone('utc'::text, now()),
    pre_authorized_contractor_id uuid references public.pre_authorized_contractors(id),
    name text not null,
    company text not null,
    contact_number text,
    purpose_of_visit text not null,
    needs_parking boolean not null default false,
    vehicles_signed_in text[],
    keys text[],
    id_provided boolean,
    contractor_notes text,
    is_signed_out boolean not null default false,
    sign_out_time timestamptz,
    approval_status text not null default 'pending',
    security_approval_notes text,
    security_sign_out_notes text,
    work_status text,
    work_details text,
    keys_returned boolean,
    keys_not_returned_reason text,
    parking_duration_minutes integer,
    created_by_user_id uuid references auth.users(id),
    created_by_user_name text,
    approved_by_name text,
    signed_out_by_name text,
    general_comments jsonb
);

alter table public.contractor_sign_ins enable row level security;

create policy "Allow authenticated access"
  on public.contractor_sign_ins
  for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- ===============================================
-- Storage bucket for contractor profile photos
-- ===============================================
insert into storage.buckets (id, name, public)
values ('contractor-profile-pictures', 'contractor-profile-pictures', true)
on conflict (id) do nothing;
