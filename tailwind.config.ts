import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e5ff",
          200: "#bcd2ff",
          300: "#8eb4ff",
          400: "#598bff",
          500: "#3366ff",
          600: "#1a45f5",
          700: "#1333e1",
          800: "#162cb6",
          900: "#182a8f",
          950: "#121b57",
        },
        midnight: {
          50: "#f5f6fa",
          100: "#eaecf4",
          200: "#d0d5e6",
          300: "#a7b1d0",
          400: "#7887b5",
          500: "#57689c",
          600: "#445282",
          700: "#38436a",
          800: "#313a59",
          900: "#1a1f35",
          950: "#0d1020",
        },
        success: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        warning: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        danger: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
        },
      },
      fontFamily: {
        display: ["var(--font-cabinet)", "system-ui", "sans-serif"],
        body: ["var(--font-general-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-md": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "count-up": "countUp 2s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(51, 102, 255, 0.2)" },
          "100%": { boxShadow: "0 0 40px rgba(51, 102, 255, 0.4)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0d1020 0%, #1a1f35 40%, #162cb6 100%)",
        "card-gradient":
          "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(51, 102, 255, 0.15)",
        "glow-lg": "0 0 80px rgba(51, 102, 255, 0.2)",
        card: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.06)",
        "card-hover":
          "0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
