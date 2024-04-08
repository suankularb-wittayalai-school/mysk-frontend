import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/**
 * TailwindCSS configuration.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    // Shadow
    boxShadow: {
      none: "none",
      1: "var(--shadow-1)",
      2: "var(--shadow-2)",
      3: "var(--shadow-3)",
      4: "var(--shadow-4)",
      5: "var(--shadow-5)",
    },
    dropShadow: {
      text: "var(--shadow-text)",
      1: "var(--drop-shadow-1)",
      2: "var(--drop-shadow-2)",
      3: "var(--drop-shadow-3)",
      4: "var(--drop-shadow-4)",
      5: "var(--drop-shadow-5)",
    },

    // Rounded corners
    borderRadius: {
      none: "var(--rounded-none)",
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
      body: "var(--font-body)",
      print: "var(--font-print)",
      mono: "var(--font-mono)",
      icon: "var(--font-icon)",
    },

    // Breakpoints
    screens: {
      sm: "600px",
      md: "905px",
      lg: "1440px",
    },

    extend: {
      borderWidth: {
        1: "1px",
      },

      // Colors
      colors: {
        // Static colors
        white: "#ffffff",
        black: "#000000",

        // Primary tones
        "primary-0": "var(--primary-0)",
        "primary-5": "var(--primary-5)",
        "primary-10": "var(--primary-10)",
        "primary-15": "var(--primary-15)",
        "primary-20": "var(--primary-20)",
        "primary-25": "var(--primary-25)",
        "primary-30": "var(--primary-30)",
        "primary-35": "var(--primary-35)",
        "primary-40": "var(--primary-40)",
        "primary-50": "var(--primary-50)",
        "primary-60": "var(--primary-60)",
        "primary-70": "var(--primary-70)",
        "primary-80": "var(--primary-80)",
        "primary-90": "var(--primary-90)",
        "primary-95": "var(--primary-95)",
        "primary-98": "var(--primary-98)",
        "primary-99": "var(--primary-99)",
        "primary-100": "var(--primary-100)",

        // Secondary tones
        "secondary-0": "var(--secondary-0)",
        "secondary-5": "var(--secondary-5)",
        "secondary-10": "var(--secondary-10)",
        "secondary-15": "var(--secondary-15)",
        "secondary-20": "var(--secondary-20)",
        "secondary-25": "var(--secondary-25)",
        "secondary-30": "var(--secondary-30)",
        "secondary-35": "var(--secondary-35)",
        "secondary-40": "var(--secondary-40)",
        "secondary-50": "var(--secondary-50)",
        "secondary-60": "var(--secondary-60)",
        "secondary-70": "var(--secondary-70)",
        "secondary-80": "var(--secondary-80)",
        "secondary-90": "var(--secondary-90)",
        "secondary-95": "var(--secondary-95)",
        "secondary-98": "var(--secondary-98)",
        "secondary-99": "var(--secondary-99)",
        "secondary-100": "var(--secondary-100)",

        // Tertiary tones
        "tertiary-0": "var(--tertiary-0)",
        "tertiary-5": "var(--tertiary-5)",
        "tertiary-10": "var(--tertiary-10)",
        "tertiary-15": "var(--tertiary-15)",
        "tertiary-20": "var(--tertiary-20)",
        "tertiary-25": "var(--tertiary-25)",
        "tertiary-30": "var(--tertiary-30)",
        "tertiary-35": "var(--tertiary-35)",
        "tertiary-40": "var(--tertiary-40)",
        "tertiary-50": "var(--tertiary-50)",
        "tertiary-60": "var(--tertiary-60)",
        "tertiary-70": "var(--tertiary-70)",
        "tertiary-80": "var(--tertiary-80)",
        "tertiary-90": "var(--tertiary-90)",
        "tertiary-95": "var(--tertiary-95)",
        "tertiary-98": "var(--tertiary-98)",
        "tertiary-99": "var(--tertiary-99)",
        "tertiary-100": "var(--tertiary-100)",

        // Neutral tones
        "neutral-0": "var(--neutral-0)",
        "neutral-5": "var(--neutral-5)",
        "neutral-10": "var(--neutral-10)",
        "neutral-15": "var(--neutral-15)",
        "neutral-20": "var(--neutral-20)",
        "neutral-25": "var(--neutral-25)",
        "neutral-30": "var(--neutral-30)",
        "neutral-35": "var(--neutral-35)",
        "neutral-40": "var(--neutral-40)",
        "neutral-50": "var(--neutral-50)",
        "neutral-60": "var(--neutral-60)",
        "neutral-70": "var(--neutral-70)",
        "neutral-80": "var(--neutral-80)",
        "neutral-90": "var(--neutral-90)",
        "neutral-95": "var(--neutral-95)",
        "neutral-98": "var(--neutral-98)",
        "neutral-99": "var(--neutral-99)",
        "neutral-100": "var(--neutral-100)",

        // Neutral variant tones
        "neutral-variant-0": "var(--neutral-variant-0)",
        "neutral-variant-5": "var(--neutral-variant-5)",
        "neutral-variant-10": "var(--neutral-variant-10)",
        "neutral-variant-15": "var(--neutral-variant-15)",
        "neutral-variant-20": "var(--neutral-variant-20)",
        "neutral-variant-25": "var(--neutral-variant-25)",
        "neutral-variant-30": "var(--neutral-variant-30)",
        "neutral-variant-35": "var(--neutral-variant-35)",
        "neutral-variant-40": "var(--neutral-variant-40)",
        "neutral-variant-50": "var(--neutral-variant-50)",
        "neutral-variant-60": "var(--neutral-variant-60)",
        "neutral-variant-70": "var(--neutral-variant-70)",
        "neutral-variant-80": "var(--neutral-variant-80)",
        "neutral-variant-90": "var(--neutral-variant-90)",
        "neutral-variant-95": "var(--neutral-variant-95)",
        "neutral-variant-98": "var(--neutral-variant-98)",
        "neutral-variant-99": "var(--neutral-variant-99)",
        "neutral-variant-100": "var(--neutral-variant-100)",

        // Error tones
        "error-0": "var(--error-0)",
        "error-5": "var(--error-5)",
        "error-10": "var(--error-10)",
        "error-15": "var(--error-15)",
        "error-20": "var(--error-20)",
        "error-25": "var(--error-25)",
        "error-30": "var(--error-30)",
        "error-35": "var(--error-35)",
        "error-40": "var(--error-40)",
        "error-50": "var(--error-50)",
        "error-60": "var(--error-60)",
        "error-70": "var(--error-70)",
        "error-80": "var(--error-80)",
        "error-90": "var(--error-90)",
        "error-95": "var(--error-95)",
        "error-98": "var(--error-98)",
        "error-99": "var(--error-99)",
        "error-100": "var(--error-100)",

        // Primary
        primary: "var(--primary)",
        "surface-tint": "var(--surface-tint)",
        "on-primary": "var(--on-primary)",
        "primary-container": "var(--primary-container)",
        "on-primary-container": "var(--on-primary-container)",

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

        // Background
        background: "var(--background)",
        "on-background": "var(--on-background)",

        // Surface
        surface: "var(--surface)",
        "on-surface": "var(--on-surface)",
        "surface-variant": "var(--surface-variant)",
        "on-surface-variant": "var(--on-surface-variant)",

        // Surface levels
        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",

        // Outline
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",

        // Scrim
        scrim: "var(--scrim)",

        // Inverse
        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "inverse-primary": "var(--inverse-primary)",

        // Fixed
        "primary-fixed": "var(--primary-fixed)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "primary-fixed-dim": "var(--primary-fixed-dim)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "secondary-fixed": "var(--secondary-fixed)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "secondary-fixed-dim": "var(--secondary-fixed-dim)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",
        "tertiary-fixed": "var(--tertiary-fixed)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
        "tertiary-fixed-dim": "var(--tertiary-fixed-dim)",
        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("state-layer", ["&::before", "&>span:empty"]);
      addVariant("safari", "@supports (-webkit-hyphens: none)");
    }),
  ],
};

export default config;
