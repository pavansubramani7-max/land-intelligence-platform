export interface User {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role: "admin" | "analyst" | "viewer";
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
