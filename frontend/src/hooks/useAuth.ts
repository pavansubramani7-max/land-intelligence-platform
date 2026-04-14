"use client";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser, clearUser, setLoading, setError } from "@/store/authSlice";
import { authService } from "@/services/authService";
import { LoginCredentials, RegisterData } from "@/types/user";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((s: RootState) => s.auth);

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch(setLoading(true));
    try {
      await authService.login(credentials);
      const me = await authService.getMe();
      dispatch(setUser(me));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.detail || "Login failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const register = useCallback(async (data: RegisterData) => {
    dispatch(setLoading(true));
    try {
      await authService.register(data);
    } catch (err: any) {
      dispatch(setError(err.response?.data?.detail || "Registration failed"));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    authService.logout();
    dispatch(clearUser());
  }, [dispatch]);

  return { user, isAuthenticated, isLoading, error, login, register, logout };
}
