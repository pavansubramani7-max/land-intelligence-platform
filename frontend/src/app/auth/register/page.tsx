"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { RegisterData } from "@/types/user";
import api from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true); setServerError("");
    try {
      await api.post("/auth/register", data);
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (e: any) {
      setServerError(e.response?.data?.detail || "Registration failed");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-dark-900">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')" }} />
      <div className="absolute inset-0 bg-dark-900/85" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c46a)" }}>
            <span className="text-dark-900 font-black">LI</span>
          </div>
          <div>
            <span className="text-white font-bold text-2xl">Land IQ</span>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.5)" }}>Intelligence Platform</p>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "rgba(17,17,24,0.97)", border: "1px solid rgba(201,168,76,0.2)" }}>
          {/* Header */}
          <div className="px-6 py-5"
            style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(232,196,106,0.05))", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
            <h1 className="text-white font-bold text-xl">Create your account</h1>
            <p className="text-white/40 text-sm mt-0.5">Join the Land Intelligence Platform</p>
          </div>

          <div className="px-6 py-6">
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <p className="font-bold text-white text-lg">Account created!</p>
                <p className="text-white/40 text-sm mt-1">Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input placeholder="John Doe"
                    {...register("name", { required: "Name is required" })}
                    className="input-field" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input type="email" placeholder="you@example.com"
                    {...register("email", { required: "Email is required" })}
                    className="input-field" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
                  <input type="password" placeholder="Min 8 characters"
                    {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}
                    className="input-field" />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/40 mb-1.5 uppercase tracking-wider">Role</label>
                  <select {...register("role")} className="input-field">
                    <option value="viewer" className="bg-dark-800">Viewer</option>
                    <option value="analyst" className="bg-dark-800">Analyst</option>
                  </select>
                </div>
                {serverError && (
                  <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{serverError}</p>
                )}
                <button type="submit" disabled={isLoading}
                  className="w-full gold-btn py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  {isLoading
                    ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating account...</>
                    : "Create Account →"}
                </button>
                <p className="text-center text-xs text-white/30">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">Sign in</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
