import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: "#86FAAF",
          bright: "#30ED7B",
          emerald: "#00D765",
          deep: "#00B369",
          forest: "#00875F",
        },
        dark: {
          bg: "#07140F",
          secondary: "#0A1D16",
          elevated: "#10251C",
          card: "#0D2119",
          border: "rgba(134, 250, 175, 0.13)",
        },
        light: {
          bg: "#F5FAF6",
          card: "#FFFFFF",
          text: "#13251B",
          subtext: "#617267",
          border: "#DFEAE1",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(135deg, #86FAAF 0%, #30ED7B 25%, #00D765 50%, #00B369 75%, #00875F 100%)",
        "secondary-gradient": "linear-gradient(135deg, #30ED7B 0%, #00D765 45%, #00875F 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(16, 37, 28, 0.6) 0%, rgba(13, 33, 25, 0.9) 100%)",
      },
      fontFamily: {
        sans: ["Inter", "Geist", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(48, 237, 123, 0.15)",
        "glow-md": "0 0 25px rgba(0, 215, 101, 0.22)",
        "card-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.35)",
      }
    },
  },
  plugins: [],
};

export default config;
