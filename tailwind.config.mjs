/** @type {import('tailwindcss').Config} */
// Brand tokens follow openZro CLAUDE.md (root). Violet scale = brand
// primary; ink + paper = neutrals. Keep these in sync with the
// dashboard/tailwind.config.ts and docs/tailwind.config.ts so a logo
// next to a button next to a code block all hit the same hue.
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        ink: "#0f0a1f",
        "ink-2": "#1a1330",
        paper: "#faf9fc",
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        wordmark: "-0.025em",
      },
    },
  },
};
