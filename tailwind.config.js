/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this line to include all files that will use Tailwind classes
  ],
  theme: {
    extend: {
      spacing: {
        72: "18rem",
      },
    },
  },
  plugins: [],
};

export default config;
