/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030303",
        foreground: "#ededed",
        brand: {
          DEFAULT: "#ff003c",
          glow: "#ff003c20",
          hover: "#e60036",
        },
        card: {
          DEFAULT: "#0f0f11",
          border: "#1f1f23",
          hover: "#18181c",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-up": "fade-in-up 0.3s ease-out forwards",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            opacity: 1,
            boxShadow: "0 0 15px rgba(255, 0, 60, 0.4)",
          },
          "50%": {
            opacity: .8,
            boxShadow: "0 0 5px rgba(255, 0, 60, 0.1)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
}
