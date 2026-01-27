/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      borderRadius: {
        card: "0.75rem", // 12px
        button: "0.5rem", // 8px
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06)",
      },
      spacing: {
        "card-sm": "1rem", // 16px
        "card-md": "1.25rem", // 20px
        "card-lg": "1.5rem", // 24px
      },
    },
  },
  plugins: [],
};
