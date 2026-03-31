// ─── User / Auth ───────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  gender?: string;
  address?: string;
  image_url?: string;
  dob?: string;
  role: 'admin' | 'patient' | 'specialist' | 'hospital' | 'donor';
  email_verified: boolean;
  consultation_preference?: string;
  created_at: string;
  country?: string;
  status: string;  // "Active" | "Pending"
}

export interface PatientProfile extends AdminUser {
  blood_type?: string;
  chronic_illnesses?: string;
  allergies?: string;
  medications?: string;
  existing_conditions?: string;
  primary_physician?: {
    id: string;
    fullname: string;
    email: string;
    phone?: string;
  };
  hmo_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
}

export interface AppointmentHistoryItem {
  specialist_name: string;
  specialty: string;
  scheduled_time: string;
  status: string;
}

export interface DonationHistoryItem {
  hospital_name: string;
  created_at: string;
  status: string;
  blood_type?: string;
  units?: number;
}

export interface AdminPatientProfileResponse {
  profile: PatientProfile;
  appointments: AppointmentHistoryItem[];
  donations: DonationHistoryItem[];
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────

export interface StatCard {
  label: string;
  value: number;
  sub_label: string;
  sub_value?: string | null;
}

export interface AdminActivity {
  title: string;
  created_at: string;
}

export interface AdminDashboardResponse {
  stats: StatCard[];
  recent_activities: AdminActivity[];
}

// ─── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface UserListResponse {
  data: AdminUser[];
  pagination: PaginationMeta;
}

// ─── Generic API wrapper ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}
