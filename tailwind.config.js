/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A1931",
        secondary: "#1A3D63",
        accent: "#4A7FA7",
        softBlue: "#B3CFE5",
        background: "#F6FAFD",
        lightGray: "#E8EEF5",
        darkText: "#0A1931",
        borderColor: "#D9E3EC",
        hover: "#EDF4FB",
      },
    },
  },
  plugins: [],
}

