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
