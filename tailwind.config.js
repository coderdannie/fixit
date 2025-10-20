/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    /** @type {import('tailwindcss').Config} */
    extend: {
      colors: {
        primary: "#2964C2", //
        textPrimary: "#191919",
        textSecondary: "#808080",
        border: "#E6E6E6",
        borderButton: "#2E2F35",
      },
      fontFamily: {
        dmsans: {
          sourceSan: "source-san",
        },
        spaceMono: ["SpaceMono", "monospace"],
      },
    },
  },
  plugins: [],
};
