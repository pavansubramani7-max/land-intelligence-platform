"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api from "@/services/api";
import { authService } from "@/services/authService";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";

type Modal = "closed" | "email" | "phone" | "otp";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳" },
  { code: "+1",  flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+971",flag: "🇦🇪" },
  { code: "+65", flag: "🇸🇬" },
];

const FEATURES = [
  { icon: "🤖", label: "AI Valuation" },
  { icon: "🛡️", label: "Fraud Detection" },
  { icon: "⚖️", label: "Dispute Risk" },
  { icon: "📈", label: "Price Forecast" },
  { icon: "🗺️", label: "Geo Intelligence" },
  { icon: "📄", label: "Legal OCR" },
];

const STATS = [
  { value: "10K+", label: "Properties Analysed" },
  { value: "₹500Cr+", label: "Value Predicted" },
  { value: "99%", label: "Accuracy Rate" },
  { value: "13", label: "AI Models" },
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [modal, setModal] = useState<Modal>("closed");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [devOtp, setDevOtp] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [resendTimer]);

  const open = (m: Modal) => { setModal(m); setError(""); };
  const close = () => { setModal("closed"); setError(""); };

  const saveTokensAndRedirect = async (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    // Set cookie so middleware can read it
    document.cookie = `access_token=${access}; path=/; max-age=86400; SameSite=Lax`;
    try {
      const me = await authService.getMe();
      dispatch(setUser(me));
    } catch {}
    router.push("/dashboard");
  };

  const handleEmailLogin = async () => {
    if (!email || !password) { setError("Enter email and password"); return; }
    setIsLoading(true); setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      await saveTokensAndRedirect(res.data.access_token, res.data.refresh_token);
    } catch (e: any) {
      setError(e.response?.data?.detail || "Invalid credentials");
    } finally { setIsLoading(false); }
  };

  const fullPhone = `${countryCode}${phone}`;

  const handleSendOtp = async () => {
    if (phone.length < 7) { setError("Enter a valid phone number"); return; }
    setIsLoading(true); setError(""); setDevOtp("");
    try {
      const res = await api.post("/auth/phone/send-otp", { phone: fullPhone });
      // Dev mode: backend returns OTP in response — auto-fill it
      if (res.data.otp) {
        const digits = res.data.otp.split("");
        setOtp(digits);
        setDevOtp(res.data.otp);
      }
      setModal("otp");
      setResendTimer(30);
      setTimeout(() => otpRefs.current[5]?.focus(), 100);
    } catch (e: any) {
      setError(e.response?.data?.detail || "Failed to send OTP. Make sure the backend is running.");
    } finally { setIsLoading(false); }
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every(d => d !== "")) handleVerifyOtp(next.join(""));
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = async (code?: string) => {
    const otpCode = code || otp.join("");
    if (otpCode.length < 6) { setError("Enter the 6-digit OTP"); return; }
    setIsLoading(true); setError("");
    try {
      const res = await api.post("/auth/phone/verify-otp", { phone: fullPhone, otp_code: otpCode });
      await saveTokensAndRedirect(res.data.access_token, res.data.refresh_token);
    } catch (e: any) {
      setError(e.response?.data?.detail || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-900">
      {/* Cinematic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/50 to-dark-900/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60" />
      </div>

      {/* Floating gold orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c9a84c, #e8c46a)" }}>
            <span className="text-dark-900 font-black text-sm">LI</span>
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight">Land IQ</span>
            <span className="text-gold-500/70 text-xs block -mt-0.5 tracking-widest uppercase">Intelligence Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => open("email")}
            className="text-white/60 hover:text-white text-sm font-medium transition-colors tracking-wide">
            Sign In
          </button>
          <Link href="/auth/register"
            className="gold-btn px-6 py-2.5 rounded-full text-sm font-bold shadow-lg">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[88vh] text-center px-4">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
            <span className="text-gold-400 text-xs font-semibold tracking-widest uppercase">AI-Powered Land Intelligence</span>
          </motion.div>

          <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
            The Future of<br />
            <span className="gold-text">Land Valuation</span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Predict property values, detect fraud, assess dispute risk and forecast prices —
            all powered by ensemble AI models with 99% accuracy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              onClick={() => open("email")}
              className="gold-btn px-10 py-4 rounded-2xl text-base font-bold shadow-2xl">
              Sign In with Email →
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              onClick={() => open("phone")}
              className="glass-dark hover:bg-white/10 text-white font-bold text-base px-10 py-4 rounded-2xl transition-all">
              📱 Phone OTP
            </motion.button>
          </div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex gap-8 md:gap-16 justify-center mb-12">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="gold-text text-2xl md:text-3xl font-black">{value}</p>
                <p className="text-white/40 text-xs mt-1 tracking-wide">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Feature pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex flex-wrap gap-2 justify-center">
            {FEATURES.map(({ icon, label }) => (
              <span key={label}
                className="glass-dark text-white/60 text-xs px-4 py-2 rounded-full hover:text-gold-400 hover:border-gold-500/30 transition-all cursor-default">
                {icon} {label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal !== "closed" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
            onClick={e => { if (e.target === e.currentTarget && !isLoading) close(); }}>
            <div className="absolute inset-0 bg-dark-900/70 backdrop-blur-md" />

            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full md:max-w-md rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: "rgba(17,17,24,0.97)", border: "1px solid rgba(201,168,76,0.2)" }}>

              {/* Modal header */}
              <div className="px-6 pt-6 pb-5"
                style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(232,196,106,0.08))", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #c9a84c, #e8c46a)" }}>
                      <span className="text-dark-900 font-black text-sm">LI</span>
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">
                        {modal === "otp" ? "Verify OTP" : "Welcome to Land IQ"}
                      </h2>
                      <p className="text-white/40 text-xs">
                        {modal === "otp" ? `Code sent to ${countryCode} ${phone}` : "Sign in to your account"}
                      </p>
                    </div>
                  </div>
                  {!isLoading && (
                    <button onClick={close} className="text-white/30 hover:text-white/80 text-xl transition-colors">✕</button>
                  )}
                </div>

                {(modal === "email" || modal === "phone") && (
                  <div className="flex mt-4 bg-white/5 rounded-xl p-1 gap-1">
                    {(["email", "phone"] as const).map(tab => (
                      <button key={tab} onClick={() => open(tab)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                          modal === tab
                            ? "text-dark-900 font-bold"
                            : "text-white/40 hover:text-white/70"
                        }`}
                        style={modal === tab ? { background: "linear-gradient(135deg, #c9a84c, #e8c46a)" } : {}}>
                        {tab === "email" ? "📧 Email" : "📱 Phone OTP"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 py-6">
                <AnimatePresence mode="wait">

                  {/* Email tab */}
                  {modal === "email" && (
                    <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email Address</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleEmailLogin()}
                            placeholder="admin@landiq.com" autoFocus
                            className="input-field" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
                          <div className="relative">
                            <input type={showPw ? "text" : "password"} value={password}
                              onChange={e => setPassword(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && handleEmailLogin()}
                              placeholder="••••••••"
                              className="input-field pr-14" />
                            <button type="button" onClick={() => setShowPw(p => !p)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold-400 text-xs transition-colors">
                              {showPw ? "Hide" : "Show"}
                            </button>
                          </div>
                        </div>
                        {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          onClick={handleEmailLogin} disabled={isLoading}
                          className="w-full gold-btn py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                          {isLoading
                            ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in...</>
                            : "Sign In →"}
                        </motion.button>

                        {/* Demo credentials */}
                        <div className="rounded-xl p-3" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
                          <p className="text-xs font-bold text-gold-400 mb-2 uppercase tracking-wider">Demo Credentials</p>
                          {[["admin@landiq.com","admin1234","Admin"],["analyst@landiq.com","analyst1234","Analyst"],["demo@landiq.com","demo1234","Viewer"]].map(([e,p,r]) => (
                            <button key={e} onClick={() => { setEmail(e); setPassword(p); }}
                              className="block w-full text-left text-xs text-white/50 hover:text-gold-400 py-1 transition-colors">
                              {e} / {p} <span className="text-gold-600">({r})</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-center text-xs text-white/30">
                          No account?{" "}
                          <Link href="/auth/register" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">Register here</Link>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Phone tab */}
                  {modal === "phone" && (
                    <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <p className="text-white/40 text-sm mb-4">Enter your mobile number to receive an OTP</p>
                      <div className="flex gap-2 mb-4">
                        <select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                          className="input-field w-28 flex-shrink-0">
                          {COUNTRY_CODES.map(c => (
                            <option key={c.code} value={c.code} className="bg-dark-800">{c.flag} {c.code}</option>
                          ))}
                        </select>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                          placeholder="Mobile number" maxLength={10} autoFocus
                          className="input-field flex-1" />
                      </div>
                      {error && <p className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
                      <button onClick={handleSendOtp} disabled={isLoading}
                        className="w-full gold-btn py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                        {isLoading ? "Sending..." : "Send OTP →"}
                      </button>
                      <p className="text-center text-xs text-white/25 mt-3">In dev mode, OTP is auto-filled from the response</p>
                    </motion.div>
                  )}

                  {/* OTP step */}
                  {modal === "otp" && (
                    <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <p className="text-white/40 text-sm mb-6">
                        Enter the 6-digit code sent to <span className="font-semibold text-white/80">{countryCode} {phone}</span>
                      </p>
                      <div className="flex gap-2 justify-center mb-5">
                        {otp.map((digit, i) => (
                          <input key={i} ref={el => { otpRefs.current[i] = el; }}
                            type="text" inputMode="numeric" maxLength={1} value={digit}
                            onChange={e => handleOtpChange(i, e.target.value)}
                            onKeyDown={e => handleOtpKeyDown(i, e)}
                            className={`w-11 h-12 text-center text-xl font-bold rounded-xl border-2 focus:outline-none transition-all bg-white/5
                              ${digit ? "border-gold-500 text-gold-400" : "border-white/10 text-white"}
                              focus:border-gold-500`} />
                        ))}
                      </div>
                      {devOtp && (
                        <div className="mb-4 text-center rounded-xl py-2 px-3" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
                          <p className="text-xs text-gold-400 font-semibold">Dev Mode — OTP auto-filled: <span className="font-black text-gold-300">{devOtp}</span></p>
                        </div>
                      )}
                      {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}
                      <button onClick={() => handleVerifyOtp()} disabled={isLoading}
                        className="w-full gold-btn py-3.5 rounded-xl font-bold disabled:opacity-50">
                        {isLoading ? "Verifying..." : "Verify & Continue →"}
                      </button>
                      <div className="flex items-center justify-between mt-4">
                        <button onClick={() => { setModal("phone"); setOtp(["","","","","",""]); setError(""); }}
                          className="text-xs text-white/30 hover:text-white/60 transition-colors">← Change number</button>
                        {resendTimer > 0
                          ? <p className="text-xs text-white/30">Resend in {resendTimer}s</p>
                          : <button onClick={handleSendOtp} className="text-xs text-gold-400 font-semibold hover:text-gold-300 transition-colors">Resend OTP</button>}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
