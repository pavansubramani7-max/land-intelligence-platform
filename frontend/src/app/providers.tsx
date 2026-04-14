"use client";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { setUser } from "@/store/authSlice";
import { authService } from "@/services/authService";

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    authService.getMe()
      .then((user) => dispatch(setUser(user)))
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      });
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}
