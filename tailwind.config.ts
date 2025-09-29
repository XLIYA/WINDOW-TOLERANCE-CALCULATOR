// tailwind.config.ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "hsl(var(--secondary-light))", // ← برای bg-secondary-light
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light: "hsl(var(--accent-light))", // ← برای bg-accent-light
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // شفاف برای نمودارها/اوورها
        transparent: "transparent",
        current: "currentColor",
      },

      backgroundImage: {
        // ← همین‌ها در کامپوننت‌ها استفاده شده بود
        "gradient-subtle":
          "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.35) 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--accent)) 100%)",
        "gradient-accent":
          "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)",
        "gradient-primary":
          "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)",
      },

      boxShadow: {
        glow:
          "0 0 0 2px hsl(var(--ring)/0.20), 0 8px 30px rgba(0,0,0,0.10)", // ← shadow-glow
      },

      keyframes: {
        glow: {
          "0%,100%": {
            boxShadow:
              "0 0 0 2px hsl(var(--ring)/0.15), 0 8px 26px rgba(0,0,0,0.08)",
          },
          "50%": {
            boxShadow:
              "0 0 0 4px hsl(var(--ring)/0.25), 0 10px 32px rgba(0,0,0,0.12)",
          },
        },
        "scale-in": {
          "0%": { transform: "scale(.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        glow: "glow 2s ease-in-out infinite",
        "scale-in": "scale-in .25s ease-out both",
        "fade-in": "fade-in .3s ease-out both",
        "slide-up": "slide-up .3s ease-out both",
      },

      borderRadius: {
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 2px)",
        "2xl": "calc(var(--radius) + 6px)",
        "3xl": "calc(var(--radius) + 12px)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
