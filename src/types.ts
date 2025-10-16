export type ApprovalStatus = 'pending' | 'approved' | 'declined';
export type SignInStatus = 'active' | 'signed_out';
export type WorkStatus =
  | 'work_completed'
  | 'incomplete'
  | 'will_return'
  | 'cancelled'
  | 'not_applicable';

export interface GeneralComment {
  id: string;
  text: string;
  author_id?: string | null;
  author_name?: string | null;
  created_at: string;
  is_important?: boolean;
}

export interface PreAuthorizedContractor {
  id: string;
  created_at: string;
  name: string;
  company: string;
  contact_number?: string | null;
  known_license_plates?: string[] | null;
  notes?: string | null;
  category?: string | null;
  is_active?: boolean | null;
  archived?: boolean | null;
  profile_picture_url?: string | null;
  created_by?: string | null;
}

export interface ContractorSignIn {
  id: string;
  created_at: string;
  pre_authorized_contractor_id?: string | null;
  name: string;
  company: string;
  contact_number?: string | null;
  purpose_of_visit: string;
  needs_parking: boolean;
  vehicles_signed_in?: string[] | null;
  keys?: string[] | null;
  id_provided: boolean | null;
  contractor_notes?: string | null;
  is_signed_out: boolean;
  sign_out_time?: string | null;
  approval_status: ApprovalStatus;
  security_approval_notes?: string | null;
  security_sign_out_notes?: string | null;
  work_status?: string | null;
  work_details?: string | null;
  keys_returned?: boolean | null;
  keys_not_returned_reason?: string | null;
  parking_duration_minutes?: number | null;
  created_by_user_id?: string | null;
  created_by_user_name?: string | null;
  approved_by_name?: string | null;
  signed_out_by_name?: string | null;
  general_comments?: GeneralComment[] | null;
}

export interface FilterOptions {
  query: string;
  dateRange: 'today' | 'last7' | 'custom' | 'all';
  customRange?: {
    start: string;
    end: string;
  } | null;
  signInStatus: 'all' | 'active' | 'signed_out';
  approvalStatus: 'all' | ApprovalStatus;
  keyFilter: string | null;
  showJustParkingOnly: boolean;
}

export interface GuardProfile {
  name: string;
  autoApprove: boolean;
}
