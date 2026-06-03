// Imports
import { StylableFC } from "@/utils/types/common";

/**
 * Rays and sparkles, should be placed behind a club logo.
 *
 * @returns An `<svg>`.
 */
const LogoRays: StylableFC = ({ className, style }) => (
  // THE FOLLOWING SVG CONTENT IS GENERATED FROM FIGMA, DO NOT ATTEMPT TO EDIT
  // ---
  // For those within the SK IT Solutions Figma team, go to MySK > MySK Club
  // Registry > Graphics
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 360 360"
    fill="none"
    className={className}
    style={style}
  >
    {/* Content */}
    <path
      d="M220.269 156.309L341.837 133.296V225.296L218.822 202.009L300.837 297.296L221.163 343.296L180 225.627L138.837 343.296L59.1628 297.296L141.242 201.936L17.8372 225.296L17.8372 133.296L139.794 156.383L59.1628 62.7039L138.837 16.7039L180 134.373L221.163 16.7039L300.837 62.7039L220.269 156.309Z"
      fill="url(#paint-0)"
      fillOpacity="0.7"
    />

    {/* Gradient definitions */}
    <defs>
      {/* Rays radial gradient */}
      <radialGradient
        id="paint-0"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(180 180) rotate(180) scale(162 162)"
      >
        <stop stopColor="currentColor" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export default LogoRays;
