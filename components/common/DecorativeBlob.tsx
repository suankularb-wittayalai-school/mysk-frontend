import { StylableFC } from "@/utils/types/common";

/**
 * A decorative blob SVG.
 *
 * @param variant The variant of the blob.
 */
const DecorativeBlob: StylableFC<{
  variant: `${"primary" | "secondary"}-${1 | 2}`;
}> = ({ variant, style, className }) =>
  ({
    "primary-1": (
      <svg
        width={163}
        height={159}
        viewBox="0 0 163 159"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
        className={className}
      >
        <path
          d="M88.9467 158.249C120.427 158.249 174.822 166.874 160.322 99.7494C145.821 32.6244 39.9468 -30.0007 7.44665 16.1243C-25.0535 62.2493 57.4664 158.249 88.9467 158.249Z"
          className="fill-primary-90 dark:fill-primary-20"
        />
      </svg>
    ),
    "primary-2": (
      <svg
        width={267}
        height={123}
        viewBox="0 0 267 123"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
        className={className}
      >
        <path
          d="M266.855 79.375C266.855 110.855 93.0857 122.5 61.6055 122.5C30.1252 122.5 0.730469 67.6052 0.730469 36.125C0.730469 4.64477 58.2502 0.375 89.7305 0.375C121.211 0.375 266.855 47.8948 266.855 79.375Z"
          className="fill-primary-90 dark:fill-primary-20"
        />
      </svg>
    ),
    "secondary-1": (
      <svg
        width={215}
        height={215}
        viewBox="0 0 215 215"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
        className={className}
      >
        <path
          d="M214.605 124.625C214.605 156.105 102.861 214.875 71.3806 214.875C39.9003 214.875 0.855469 150.105 0.855469 118.625C0.855469 87.1448 107.125 0 138.605 0C170.086 0 214.605 93.1448 214.605 124.625Z"
          className="fill-secondary-90 dark:fill-secondary-20"
        />
      </svg>
    ),
    "secondary-2": (
      <svg
        width={155}
        height={108}
        viewBox="0 0 155 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
        className={className}
      >
        <path
          d="M154.856 70.3629C154.856 93.6131 73.4236 107.938 50.1761 107.938C26.9285 107.938 0.605591 56.5924 0.605591 33.3422C0.605591 10.0919 63.9448 0.9375 87.1924 0.9375C110.44 0.9375 154.856 47.1126 154.856 70.3629Z"
          className="fill-secondary-90 dark:fill-secondary-20"
        />
      </svg>
    ),
  })[variant];

export default DecorativeBlob;
