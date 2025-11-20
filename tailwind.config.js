/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        foreground: "var(--color-foreground)",
        subtle: "var(--color-subtle)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        highlight: "var(--color-highlight)",
      },
      spacing: {
        "space-xxl": "var(--space-xxl)",
        "space-xl": "var(--space-xl)",
        "space-lg": "var(--space-lg)",
        "space-md": "var(--space-md)",
        "space-sm": "var(--space-sm)",
        "space-xs": "var(--space-xs)",
      },
      maxWidth: {
        "container-wide": "var(--w-container-wide)",
        container: "var(--w-container)",
        "container-narrow": "var(--w-container-narrow)",
      },
      fontSize: {
        display: "var(--text-display)",
        h1: "var(--text-h1)",
        h2: "var(--text-h2)",
        h3: "var(--text-h3)",
        body: "var(--text-body)",
        small: "var(--text-small)",
        mini: "var(--text-mini)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui"],
        mono: ["var(--font-inconsolata)", "ui-monospace"],
      },
    },
  },
  plugins: [],
};
