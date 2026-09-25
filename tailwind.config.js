/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050807",
        void: "#0a1210",
        panel: "#0f1a17",
        emerald: {
          50: "#e9fbf3",
          200: "#9df0c9",
          400: "#3ddc91",
          500: "#1fc879",
          600: "#12a862",
          700: "#0c7f49",
        },
        sky: {
          200: "#bfeaff",
          300: "#8fdcff",
          400: "#5cc9ff",
          500: "#2fb2f4",
          600: "#1c8fd1",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(31,200,121,0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(47,178,244,0.16), transparent 40%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(61,220,145,0.45)",
        skyglow: "0 0 40px -10px rgba(92,201,255,0.45)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseline: {
          "0%,100%": { opacity: 0.35 },
          "50%": { opacity: 1 },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        pulseline: "pulseline 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
