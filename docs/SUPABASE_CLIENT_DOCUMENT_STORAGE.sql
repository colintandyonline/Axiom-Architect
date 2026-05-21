-- Axiom Architect client document storage setup
-- Run this in Supabase SQL Editor before testing client file uploads.

create extension if not exists pgcrypto;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'axiom-client-documents',
  'axiom-client-documents',
  false,
  15728640,
  array[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.axiom_workspace_documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.axiom_client_workspaces(id) on delete cascade,
  customer_id uuid not null references public.axiom_customers(id) on delete cascade,
  original_filename text not null,
  document_category text not null default 'supporting_material',
  review_status text not null default 'under_review',
  title text,
  description text,
  storage_bucket text,
  storage_path text,
  mime_type text,
  file_size_bytes bigint,
  uploaded_by text not null default 'client',
  upload_source text not null default 'client_portal',
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.axiom_workspace_documents
  add column if not exists storage_bucket text,
  add column if not exists storage_path text,
  add column if not exists mime_type text,
  add column if not exists file_size_bytes bigint,
  add column if not exists uploaded_by text not null default 'client',
  add column if not exists upload_source text not null default 'client_portal',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create index if not exists axiom_workspace_documents_workspace_uploaded_idx
  on public.axiom_workspace_documents (workspace_id, uploaded_at desc);

create index if not exists axiom_workspace_documents_customer_uploaded_idx
  on public.axiom_workspace_documents (customer_id, uploaded_at desc);

create unique index if not exists axiom_workspace_documents_storage_path_uidx
  on public.axiom_workspace_documents (storage_bucket, storage_path)
  where storage_bucket is not null and storage_path is not null;
