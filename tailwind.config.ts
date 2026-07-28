import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef3fb",
          100: "#d6e3f5",
          200: "#adc7eb",
          300: "#7fa5db",
          400: "#4d7ec5",
          500: "#2f5fa8",
          600: "#20477f",
          700: "#183a68",
          800: "#122b4d",
          900: "#0b1c33",
          950: "#071223",
        },
        gold: {
          50: "#fdf8ec",
          100: "#faedc9",
          200: "#f4da93",
          300: "#eec25c",
          400: "#e6ab35",
          500: "#d6931f",
          600: "#b37317",
          700: "#8c5716",
          800: "#734818",
          900: "#623d19",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
