export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: UserRole;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface AuthResponse {
  user: User;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export enum UserRole {
  END_USER = 'END_USER',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  ADMINISTRATOR = 'ADMINISTRATOR',
  MANAGER = 'MANAGER'
}

export interface SuccessResponse {
  status: string;
  message: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
} 