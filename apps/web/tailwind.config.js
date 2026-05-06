import preset from "../../packages/ui/tailwind.preset.js";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      /* =========================
        COLORS
      ========================= */
      colors: {
        surface: "var(--surface)",
        card: "var(--surface-card)",
        muted: "var(--surface-muted)",

        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",

        secondary: "var(--color-secondary)",
        "secondary-hover": "var(--color-secondary-hover)",

        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
      },

      /* =========================
        TYPOGRAPHY
      ========================= */
      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
      },

      fontWeight: {
        regular: "var(--font-weight-regular)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
      },

      lineHeight: {
        tight: "var(--line-height-tight)",
        normal: "var(--line-height-normal)",
        relaxed: "var(--line-height-relaxed)",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      /* =========================
         SPACING
      ========================= */
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
      },

      /* =========================
        BORDER RADIUS
      ========================= */
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },

      /* =========================
        SHADOW
      ========================= */
      boxShadow: {
        card: "var(--shadow-card)",
      },

      /* =========================
        RESPONSIVE BREAKPOINTS
      ========================= */
      screens: {
        xs: "320px",
        sm: "375px",
        md: "425px",
        'tablet-sm': "568px",
        tablet: "768px",
        lg: "1024px",
        xl: "1440px",
        "2xl": "2560px",
      },
    },
  },

  plugins: [],
};
