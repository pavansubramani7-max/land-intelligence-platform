/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50: "#eff6ff", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 900: "#1e3a8a" },
        success: { 500: "#22c55e", 600: "#16a34a" },
        warning: { 500: "#f59e0b", 600: "#d97706" },
        danger: { 500: "#ef4444", 600: "#dc2626" },
        gold: {
          300: "#f5d78e",
          400: "#e8c46a",
          500: "#c9a84c",
          600: "#a8863a",
        },
        dark: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a24",
          600: "#22222f",
          500: "#2e2e3e",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #c9a84c 0%, #e8c46a 50%, #c9a84c 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
