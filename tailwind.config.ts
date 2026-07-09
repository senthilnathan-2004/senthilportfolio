import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0A0A0A",
        "bg-card": "#141414",
        "bg-container": "#101010",
        "green-accent": "#8CFF9E",
        "green-hover": "#7AE88C",
        "border-subtle": "#262626",
        "text-secondary": "#A0A0A0",
        "text-tertiary": "#6B6B6B",
      },
      fontFamily: {
        display: ["Archivo Black", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "hero-sm": ["36px", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "hero-md": ["60px", { lineHeight: "0.97", letterSpacing: "-0.03em" }],
        "hero-lg": ["80px", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "hero-xl": ["96px", { lineHeight: "0.93", letterSpacing: "-0.04em" }],
        "stat-lg": ["64px", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "stat-xl": ["80px", { lineHeight: "1", letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
        full: "999px",
      },
      boxShadow: {
        "green-glow": "0 0 40px rgba(140, 255, 158, 0.08)",
        "green-glow-strong": "0 0 60px rgba(140, 255, 158, 0.15)",
        card: "0 1px 0 rgba(255,255,255,0.04), 0 4px 32px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "radial-green":
          "radial-gradient(ellipse at 50% 0%, rgba(140, 255, 158, 0.06) 0%, transparent 60%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(140, 255, 158, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(140, 255, 158, 0.25)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "fade-up": "fade-up 0.6s ease forwards",
        "fade-in": "fade-in 0.4s ease forwards",
        marquee: "marquee 20s linear infinite",
        "scale-in": "scale-in 0.3s ease forwards",
        "slide-in": "slide-in 0.3s ease forwards",
        "pulse-green": "pulse-green 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
