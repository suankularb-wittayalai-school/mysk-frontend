/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Shadow
    boxShadow: {
      1: "var(--shadow-1)",
      2: "var(--shadow-2)",
      3: "var(--shadow-3)",
      4: "var(--shadow-4)",
      5: "var(--shadow-5)",
    },
    dropShadow: {
      text: "var(--shadow-text)",
      1: "var(--shadow-1)",
      2: "var(--shadow-2)",
      3: "var(--shadow-3)",
      4: "var(--shadow-4)",
      5: "var(--shadow-5)",
    },

    // Rounded corners
    borderRadius: {
      xs: "var(--rounded-xs)",
      sm: "var(--rounded-sm)",
      md: "var(--rounded-md)",
      lg: "var(--rounded-lg)",
      xl: "var(--rounded-xl)",
      full: "var(--rounded-full)",
    },

    // Font size
    fontSize: {
      xs: "var(--text-xs)",
      sm: "var(--text-sm)",
      base: "var(--text-base)",
      lg: "var(--text-lg)",
      xl: "var(--text-xl)",
      "2xl": "var(--text-2xl)",
      "3xl": "var(--text-3xl)",
      "4xl": "var(--text-4xl)",
      "5xl": "var(--text-5xl)",
      "6xl": "var(--text-6xl)",
      "7xl": "var(--text-7xl)",
      "8xl": "var(--text-8xl)",
      "9xl": "var(--text-9xl)",
    },

    // Font weight
    fontWeight: {
      thin: "var(--font-thin)",
      light: "var(--font-light)",
      regular: "var(--font-regular)",
      medium: "var(--font-medium)",
      bold: "var(--font-bold)",
    },

    // Font family
    fontFamily: {
      display: "var(--font-display)",
      sans: "var(--font-body)",
    },

    // Breakpoints
    screens: {
      sm: "600px",
      md: "905px",
      lg: "1440px",
    },

    // Colors
    extend: {
      colors: {
        // Static colors
        white: "#ffffff",
        black: "#000000",

        // Primary tones
        "primary-100": "var(--primary-100)",
        "primary-99": "var(--primary-99)",
        "primary-95": "var(--primary-95)",
        "primary-90": "var(--primary-90)",
        "primary-80": "var(--primary-80)",
        "primary-70": "var(--primary-70)",
        "primary-60": "var(--primary-60)",
        "primary-50": "var(--primary-50)",
        "primary-40": "var(--primary-40)",
        "primary-30": "var(--primary-30)",
        "primary-20": "var(--primary-20)",
        "primary-10": "var(--primary-10)",
        "primary-0": "var(--primary-0)",

        // Secondary tones
        "secondary-100": "var(--secondary-100)",
        "secondary-99": "var(--secondary-99)",
        "secondary-95": "var(--secondary-95)",
        "secondary-90": "var(--secondary-90)",
        "secondary-80": "var(--secondary-80)",
        "secondary-70": "var(--secondary-70)",
        "secondary-60": "var(--secondary-60)",
        "secondary-50": "var(--secondary-50)",
        "secondary-40": "var(--secondary-40)",
        "secondary-30": "var(--secondary-30)",
        "secondary-20": "var(--secondary-20)",
        "secondary-10": "var(--secondary-10)",
        "secondary-0": "var(--secondary-0)",

        // Tertiary tones
        "tertiary-100": "var(--tertiary-100)",
        "tertiary-99": "var(--tertiary-99)",
        "tertiary-95": "var(--tertiary-95)",
        "tertiary-90": "var(--tertiary-90)",
        "tertiary-80": "var(--tertiary-80)",
        "tertiary-70": "var(--tertiary-70)",
        "tertiary-60": "var(--tertiary-60)",
        "tertiary-50": "var(--tertiary-50)",
        "tertiary-40": "var(--tertiary-40)",
        "tertiary-30": "var(--tertiary-30)",
        "tertiary-20": "var(--tertiary-20)",
        "tertiary-10": "var(--tertiary-10)",
        "tertiary-0": "var(--tertiary-0)",

        // Neutral tones
        "neutral-100": "var(--neutral-100)",
        "neutral-99": "var(--neutral-99)",
        "neutral-95": "var(--neutral-95)",
        "neutral-90": "var(--neutral-90)",
        "neutral-80": "var(--neutral-80)",
        "neutral-70": "var(--neutral-70)",
        "neutral-60": "var(--neutral-60)",
        "neutral-50": "var(--neutral-50)",
        "neutral-40": "var(--neutral-40)",
        "neutral-30": "var(--neutral-30)",
        "neutral-20": "var(--neutral-20)",
        "neutral-10": "var(--neutral-10)",
        "neutral-0": "var(--neutral-0)",

        // Neutral variant tones
        "neutral-variant-100": "var(--neutral-variant-100)",
        "neutral-variant-99": "var(--neutral-variant-99)",
        "neutral-variant-95": "var(--neutral-variant-95)",
        "neutral-variant-90": "var(--neutral-variant-90)",
        "neutral-variant-80": "var(--neutral-variant-80)",
        "neutral-variant-70": "var(--neutral-variant-70)",
        "neutral-variant-60": "var(--neutral-variant-60)",
        "neutral-variant-50": "var(--neutral-variant-50)",
        "neutral-variant-40": "var(--neutral-variant-40)",
        "neutral-variant-30": "var(--neutral-variant-30)",
        "neutral-variant-20": "var(--neutral-variant-20)",
        "neutral-variant-10": "var(--neutral-variant-10)",
        "neutral-variant-0": "var(--neutral-variant-0)",

        // Error tones
        "error-100": "var(--error-100)",
        "error-99": "var(--error-99)",
        "error-95": "var(--error-95)",
        "error-90": "var(--error-90)",
        "error-80": "var(--error-80)",
        "error-70": "var(--error-70)",
        "error-60": "var(--error-60)",
        "error-50": "var(--error-50)",
        "error-40": "var(--error-40)",
        "error-30": "var(--error-30)",
        "error-20": "var(--error-20)",
        "error-10": "var(--error-10)",
        "error-0": "var(--error-0)",

        // Primary
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",
        "inverse-primary": "var(--inverse-primary)",

        // Secondary
        secondary: "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary-container": "var(--on-secondary-container)",

        // Tertiary
        tertiary: "var(--tertiary)",
        "on-tertiary": "var(--on-tertiary)",
        "tertiary-container": "var(--tertiary-container)",
        "on-tertiary-container": "var(--on-tertiary-container)",

        // Error
        error: "var(--error)",
        "on-error": "var(--on-error)",
        "error-container": "var(--error-container)",
        "on-error-container": "var(--on-error-container)",

        // Surface
        surface: "var(--surface)",
        "on-surface": "var(--on-surface)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "inverse-surface": "var(--inverse-surface)",
        "surface-1": "var(--surface-1)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        "surface-4": "var(--surface-4)",
        "surface-5": "var(--surface-5)",

        // Background
        background: "var(--background)",
        "on-background": "var(--on-background)",

        // Outline
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
      },
    },
  },
  plugins: [],
};
