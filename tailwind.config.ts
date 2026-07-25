import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070B14",
          900: "#0B1220",
          800: "#131B2E",
          700: "#1B2540",
          600: "#26325288",
        },
        gold: {
          200: "#F1E2C0",
          300: "#E6CE9A",
          400: "#D4AF6A",
          500: "#C29A4E",
          600: "#A67F3A",
        },
        teal: {
          300: "#8FE3D9",
          400: "#5FCFC0",
          500: "#3BB3A3",
        },
        bone: "#F3F1EC",
        coral: "#E8735F",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 20px 60px -20px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(212,175,106,0.25), 0 20px 60px -15px rgba(212,175,106,0.25)",
      },
      backgroundImage: {
        "foil": "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 30%, rgba(212,175,106,0.18) 60%, rgba(255,255,255,0.06) 100%)",
        "gold-sheen": "linear-gradient(120deg, #E6CE9A 0%, #D4AF6A 30%, #FFF3D6 45%, #C29A4E 65%, #E6CE9A 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 3.5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
