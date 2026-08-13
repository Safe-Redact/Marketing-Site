import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#D97757",
          dark: "#B85C3F",
          light: "#F4DDD4",
          50: "#FDF5F0",
          100: "#F4DDD4",
          200: "#EBBFA8",
          300: "#DFA17D",
          400: "#D97757",
          500: "#C4623F",
          600: "#B85C3F",
          700: "#9A4630",
          800: "#7C3724",
          900: "#5E2A1B",
        },
        primary: {
          DEFAULT: "#1A1A2E",
          50: "#E8E8EC",
          100: "#C5C5D1",
          200: "#9E9EB5",
          300: "#777799",
          400: "#52527A",
          500: "#3A3A5C",
          600: "#2D2D4A",
          700: "#1A1A2E",
          800: "#14142A",
          900: "#0E0E1F",
          950: "#080812",
        },
        surface: {
          DEFAULT: "#F8F7F4",
          50: "#FDFCFA",
          100: "#F8F7F4",
          200: "#F0EFE9",
          300: "#E2E0D8",
          400: "#D4D1C7",
        },
        muted: {
          DEFAULT: "#7C7C7C",
          light: "#9E9E9E",
          dark: "#5A5A5A",
        },
        success: "#4FAE68",
        warning: "#E8A341",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
      fontSize: {
        "display-lg": [
          "4rem",
          {
            lineHeight: "1.05",
            letterSpacing: "-0.03em",
            fontWeight: "700",
          },
        ],
        display: [
          "3rem",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "display-sm": [
          "2.25rem",
          {
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "heading-xl": [
          "1.5rem",
          { lineHeight: "1.3", fontWeight: "600" },
        ],
        "heading-lg": [
          "1.25rem",
          { lineHeight: "1.35", fontWeight: "600" },
        ],
        heading: [
          "1.125rem",
          { lineHeight: "1.4", fontWeight: "600" },
        ],
        "heading-sm": [
          "1rem",
          { lineHeight: "1.45", fontWeight: "600" },
        ],
        "body-xl": [
          "1.125rem",
          { lineHeight: "1.7", fontWeight: "400" },
        ],
        "body-lg": [
          "1rem",
          { lineHeight: "1.7", fontWeight: "400" },
        ],
        body: [
          "0.9375rem",
          { lineHeight: "1.7", fontWeight: "400" },
        ],
        "body-sm": [
          "0.875rem",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        caption: [
          "0.75rem",
          { lineHeight: "1.5", fontWeight: "500" },
        ],
      },
      spacing: {
        section: "5rem",
        "section-sm": "3rem",
      },
      borderRadius: {
        panel: "0.75rem",
        control: "0.5rem",
        chip: "0.25rem",
      },
      maxWidth: {
        content: "72rem",
        prose: "65ch",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
