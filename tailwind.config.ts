import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081521",
        panel: "#101e2c",
        violet: "#834df6",
      },
      fontFamily: {
        ember: ["Amazon Ember", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
