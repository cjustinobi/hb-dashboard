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
  verified?: boolean;
  suspended?: boolean;
  license_status?: boolean;
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

export interface SpecialistProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialty: string;
  bio?: string;
  experience?: number;
  country?: string;
  consultation_types: string;
  verified: boolean;
  status: string;
  license_url?: string;
}

export interface AdminSpecialistProfileResponse {
  profile: AdminUser;
  specialty: string;
  bio?: string;
  experience?: number;
  country?: string;
  consultation_types: string;
  verified: boolean;
  license_url?: string;
}

export interface HospitalBloodInventorySummary {
  blood_type: string;
  units: number;
}

export interface AdminHospitalProfileResponse {
  id: string;
  name: string;
  hospital_type?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  primary_phone: string;
  email?: string;
  license_status: boolean;
  contact_person: AdminUser;
  has_blood_bank: boolean;
  blood_inventory: HospitalBloodInventorySummary[];
  total_requests: number;
}

export type AdminUserProfileResponse = 
  | { role: 'patient'; data: AdminPatientProfileResponse }
  | { role: 'specialist'; data: AdminSpecialistProfileResponse }
  | { role: 'hospital'; data: AdminHospitalProfileResponse };

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

// ─── Blood Requests ────────────────────────────────────────────────────────────

export interface BloodRequest {
  id: string;
  hospital_id: string;
  donor_id: string | null;
  recipient_id: string | null;
  ref_id: string;
  units: number | null;
  blood_type: string | null;
  urgency: string | null;
  timeline_status: string | null;
  request_status: string | null;
  request_reason: string | null;
  note: string | null;
  preferred_time: string | null;
  donated_at: string | null;
  administered_at: string | null;
  created_at: string;
}

export interface BloodRequestUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
}

export interface BloodRequestResponse {
  blood_request: BloodRequest;
  donor: BloodRequestUser | null;
  patient: BloodRequestUser | null;
}

// ─── Appointments / Donations ──────────────────────────────────────────────────

export interface AppointmentRecord {
  id: string;
  blood_request_id: string;
  hospital_id: string;
  user_id: string;
  specialist_id: string;
  appointment_type: string;
  status: string;
  scheduled_time: string;
  previous_time: string | null;
  cancelled_by: string | null;
  cancelled_by_id: string | null;
  cancelled_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface AppointmentHospital {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  primary_phone: string;
  address: string;
}

export interface AppointmentBloodRequest {
  id: string;
  units: number | null;
  blood_type: string | null;
  urgency: string | null;
  donated_at: string | null;
  administered_at: string | null;
  ref_id: string;
  request_reason: string | null;
}

export interface AppointmentUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  gender?: string;
  dob?: string;
  consultation_preference?: string;
}

export interface Specialty {
  id: string;
  name: string;
  description?: string;
}

export interface Specialist {
  id: string;
  user_id: string;
  hospital_id?: string;
  specialty_id: string;
  bio?: string;
  years_of_experience?: number;
  consultation_type: string;
  session_duration_minutes?: number;
  verified: boolean;
  suspended: boolean;
}

export interface AppointmentResponse {
  appointment: AppointmentRecord;
  user: AppointmentUser;
  hospital: AppointmentHospital;
  blood_request: AppointmentBloodRequest;
  specialist: AppointmentUser;
  specialist_info?: Specialist;
  specialty?: Specialty;
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export type NotificationCategory = 'verification' | 'blood_request' | 'appointment' | 'system';

export interface NotificationResponse {
  id: string;
  user_id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  related_id?: string;
  related_type?: string;
  metadata?: string;
  is_read: boolean;
  created_by?: string;
  created_at: string;
  read_at?: string;
}

export interface NotificationListResponse {
  data: NotificationResponse[];
  pagination: PaginationMeta & { unread_count: number };
}

// ─── Consultations ────────────────────────────────────────────────────────────

export interface ConsultationType {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  base_price: string;
  is_active: boolean;
  created_at: string;
}

export interface ConsultationBenefit {
  id: string;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface ConsultationTypeBenefit {
  consultation_type_id: string;
  consultation_benefit_id: string;
}
