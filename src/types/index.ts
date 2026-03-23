export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'patient' | 'specialist' | 'hospital' | 'donor';
  is_verified?: boolean;
  status?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface DashboardStats {
  total_users: number;
  total_specialists: number;
  total_hospitals: number;
  total_blood_requests: number;
  total_pending_verifications: number;
  total_donations: number;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
}
