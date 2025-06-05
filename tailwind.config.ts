import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Adding neon colors
        cyan: {
          DEFAULT: "#00FFFF", // Neon Cyan
          "50": "#E0FFFF",
          "100": "#B3FFFF",
          "200": "#80FFFF",
          "300": "#4DFFFF",
          "400": "#1AFFFF",
          "500": "#00FFFF", // Base
          "600": "#00CCCC",
          "700": "#009999",
          "800": "#006666",
          "900": "#003333",
          "950": "#001A1A",
        },
        violet: {
          DEFAULT: "#8F00FF", // Neon Violet
          "50": "#F5E6FF",
          "100": "#E0B3FF",
          "200": "#CC80FF",
          "300": "#B84DFF",
          "400": "#A31AFF",
          "500": "#8F00FF", // Base
          "600": "#7A00CC",
          "700": "#660099",
          "800": "#520066",
          "900": "#3D0033",
          "950": "#29001A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        "neon-cyan": "0 0 5px theme(colors.cyan.500), 0 0 10px theme(colors.cyan.500), 0 0 15px theme(colors.cyan.700)",
        "neon-violet":
          "0 0 5px theme(colors.violet.500), 0 0 10px theme(colors.violet.500), 0 0 15px theme(colors.violet.700)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
