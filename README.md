# Security Hub Mini

Security Hub Mini is a focused contractor sign-in and sign-out single-page application designed as a resilient backup tool for security desk teams. The application is built with React, TypeScript, Vite, Tailwind CSS, and Supabase to deliver a modern, responsive, and real-time experience across desktop and tablet devices.

## Features

### Contractor Sign-In Workspace
- Smart sign-in form with pre-authorized contractor lookups and instant auto-fill.
- Parking management, Just Parking mode, and multi-vehicle plate tracking.
- Keys tracking with searchable presets, custom "Other" entry, and ID verification workflow.
- Quick purpose buttons, auto-approval preferences, and fully persistent draft recovery.

### Live Contractor Log Dashboard
- Real-time Supabase subscription powering the activity grid.
- Status-aware contractor cards with elapsed time and parking countdown timers.
- Quick filters for active visits and same-day activity, plus advanced filtering by date range, approval state, keys, and parking mode.
- Detail modal with comment timeline, approval/decline workflow, sign-out process, and visit history viewer.

### Pre-Authorized Directory Management
- Searchable, filterable directory with activation, archival, and profile picture management.
- Add/edit modal for complete contractor profiles, including category, notes, and known license plates.
- Merge workflow to consolidate duplicates and reassign historical sign-ins automatically.
- CSV import/export for rapid bootstrapping and secure data backups.

## Getting Started

### Prerequisites
- Node.js 18+
- npm, pnpm, or yarn (examples below assume npm)
- A Supabase project with the following environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in the Supabase credentials in `.env`:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="public-anon-key"
```

### Install & Run

```bash
npm install
npm run dev
```

The application runs at [http://localhost:5173](http://localhost:5173) by default.

To build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Supabase Setup

### Database Tables

Create two tables using the SQL snippets provided in `/supabase/schema.sql` (or add them manually via the Supabase dashboard):

#### `pre_authorized_contractors`
Stores the master directory of contractors for quick lookups.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key, `uuid_generate_v4()` default |
| `created_at` | `timestamptz` | Default `now()` |
| `name` | `text` | Required |
| `company` | `text` | Required |
| `contact_number` | `text` | Optional |
| `known_license_plates` | `text[]` | Optional |
| `notes` | `text` | Optional |
| `category` | `text` | Optional |
| `is_active` | `boolean` | Default `true` |
| `archived` | `boolean` | Default `false` |
| `profile_picture_url` | `text` | Optional |
| `created_by` | `uuid` | Optional FK to `auth.users` |

#### `contractor_sign_ins`
Tracks every visit including approvals, notes, and sign-out details.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key, `uuid_generate_v4()` default |
| `created_at` | `timestamptz` | Default `now()` (sign-in time) |
| `pre_authorized_contractor_id` | `uuid` | Optional FK to `pre_authorized_contractors` |
| `name` | `text` | Required |
| `company` | `text` | Required |
| `contact_number` | `text` | Optional |
| `purpose_of_visit` | `text` | Required |
| `needs_parking` | `boolean` | Default `false` |
| `vehicles_signed_in` | `text[]` | Optional |
| `keys` | `text[]` | Optional |
| `id_provided` | `boolean` | Default `true` |
| `contractor_notes` | `text` | Optional |
| `is_signed_out` | `boolean` | Default `false` |
| `sign_out_time` | `timestamptz` | Optional |
| `approval_status` | `text` | Default `'pending'` |
| `security_approval_notes` | `text` | Optional |
| `security_sign_out_notes` | `text` | Optional |
| `work_status` | `text` | Optional |
| `work_details` | `text` | Optional |
| `keys_returned` | `boolean` | Optional |
| `keys_not_returned_reason` | `text` | Optional |
| `parking_duration_minutes` | `integer` | Optional |
| `created_by_user_id` | `uuid` | Optional FK to `auth.users` |
| `created_by_user_name` | `text` | Optional |
| `approved_by_name` | `text` | Optional |
| `signed_out_by_name` | `text` | Optional |
| `general_comments` | `jsonb` | Optional array of comment objects |

### Row Level Security
Enable RLS on both tables and allow access to authenticated users or service role as needed for your deployment model.

### Storage Bucket
Create a public storage bucket named `contractor-profile-pictures` for profile photo uploads. Grant authenticated users the ability to upload and read.

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Modal.tsx
│   │   ├── dashboard/
│   │   │   ├── ContractorCard.tsx
│   │   │   ├── ContractorDetailModal.tsx
│   │   │   ├── ContractorLog.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── modals/
│   │   ├── pre-authorized/
│   │   │   ├── ManageContractorModal.tsx
│   │   │   ├── MergeContractorsModal.tsx
│   │   │   ├── PreAuthorizedDirectory.tsx
│   │   │   └── ProfileImageUploader.tsx
│   │   └── sign-in/
│   │       └── SignInForm.tsx
│   ├── context/
│   │   └── GuardProfileContext.tsx
│   ├── hooks/
│   ├── lib/
│   │   └── supabaseClient.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   └── PreAuthorizedPage.tsx
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Environment Notes
- Guard settings (name + auto-approval preference) persist via `localStorage` so each station retains its configuration.
- Form drafts are auto-saved in `localStorage` and can be cleared manually.
- All Supabase mutations show toast feedback to operators and gracefully handle errors.

## Accessibility & Responsiveness
- Every interactive control has focus styles and keyboard support (e.g., toggles and modals).
- Layout is optimized for 1280px desktop displays and 1024px tablet landscape orientations.
- High-contrast dark theme keeps long shifts comfortable and aligns with security desk lighting.

## License

This project is open source. Adapt freely for your operational needs.
