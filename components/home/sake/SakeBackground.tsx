import { StylableFC } from "@/utils/types/common";

/**
 * The background for Sake Celebration.
 */
const SakeBackground: StylableFC = ({ style, className }) => {
  return (
    <svg
      width={560}
      height={256}
      viewBox="0 0 560 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
    >
      {/* Blobs */}
      <g filter="url(#filter-sake)">
        <path
          d="M607.336 236.441C607.336 287.562 425.871 383 374.749 383C323.628 383 260.222 277.819 260.222 226.697C260.222 175.576 432.796 34.0593 483.917 34.0593C535.039 34.0593 607.336 185.319 607.336 236.441Z"
          className="fill-secondary-90 dark:fill-secondary-10"
        />
        <path
          d="M692.167 63.29C692.167 114.411 409.978 133.322 358.856 133.322C307.735 133.322 260 44.1768 260 -6.94472C260 -58.0662 353.408 -65 404.529 -65C455.651 -65 692.167 12.1685 692.167 63.29Z"
          className="fill-primary-90 dark:fill-primary-10"
        />
      </g>

      {/* Logo */}
      <image
        href="/images/brand/mysk-light.svg"
        x={275}
        y={24}
        width={384}
        height={384}
        opacity={0.1}
      />

      {/* Blur filter */}
      <defs>
        <filter
          id="filter-sake"
          x={160}
          y={-165}
          width={632}
          height={648}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation={50} />
        </filter>
      </defs>
    </svg>
  );
};

export default SakeBackground;
