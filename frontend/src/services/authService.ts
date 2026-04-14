import api from "./api";
import { LoginCredentials, RegisterData, AuthTokens, User } from "@/types/user";

export const authService = {
  async register(data: RegisterData): Promise<User> {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const res = await api.post("/auth/login", credentials);
    const tokens: AuthTokens = res.data;
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    document.cookie = `access_token=${tokens.access_token}; path=/; max-age=86400; SameSite=Lax`;
    return tokens;
  },

  async getMe(): Promise<User> {
    const res = await api.get("/auth/me");
    return res.data;
  },

  async verifyOtp(email: string, otp_code: string): Promise<void> {
    await api.post("/auth/otp/verify", { email, otp_code });
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "access_token=; path=/; max-age=0";
  },
};
