import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E417B', 
          light: '#235EE6',   
        },
        secondary: {
          DEFAULT: '#FFB000', 
          light: '#FFC501',   
        },
        neutral: {
          dark: '#424242',    
          black: '#000000',   
        }
      },
    },
  },
  plugins: [],
};
export default config;