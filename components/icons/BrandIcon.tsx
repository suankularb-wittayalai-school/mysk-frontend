// External libraries
import type { FC } from "react";

// SK Components
import { MaterialIcon } from "@suankularb-components/react";

/**
 * A vector icon of a brand.
 * 
 * @param icon The icon ID.
 * @param size The size of the icon in pixels. Defaults to 24.
 * 
 * @returns A JSX Element.
 */
const BrandIcon: FC<{
  icon: "google" | "gg-classroom" | "gg-meet";
  size?: number;
}> = ({ icon, size }) =>
  icon ? (
    icon === "google" ? (
      <svg
        width={size?.toString() || "24"}
        height={size?.toString() || "24"}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 12C3 7.0374 7.0374 3 12 3C14.0043 3 15.9013 3.64483 17.4861 4.8648L15.3946 7.5816C14.4147 6.82731 13.2409 6.42857
            12 6.42857C8.92791 6.42857 6.42857 8.92791 6.42857 12C6.42857 15.0721 8.92791 17.5714 12 17.5714C14.4743 17.5714
            16.577 15.9503 17.3016 13.7143H12V10.2857H21V12C21 16.9626 16.9626 21 12 21C7.0374 21 3 16.9626 3 12Z"
          fill="currentColor"
        />
      </svg>
    ) : icon === "gg-classroom" ? (
      <svg
        width={size?.toString() || "24"}
        height={size?.toString() || "24"}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.6364 17.4211H17.7273M3 4V19H21V4H3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="transparent"
        />
        <path
          d="M15.3333 14.9167H8.66666V13.6667C8.66666 13.6667 9.49999 12 12 12C14.5 12 15.3333 13.6667 15.3333 13.6667V14.9167Z"
          fill="currentColor"
        />
        <path
          d="M10.3333 14.7083H6.16666V13.9048C6.16666 13.9048 6.68749 12.8333 8.24999 12.8333C9.81249 12.8333 10.3333 13.9048
            10.3333 13.9048V14.7083Z"
          fill="currentColor"
        />
        <path
          d="M17.8333 14.7083H13.6667V13.9048C13.6667 13.9048 14.1875 12.8333 15.75 12.8333C17.3125 12.8333 17.8333 13.9048
            17.8333 13.9048V14.7083Z"
          fill="currentColor"
        />
        <path
          d="M13.4583 9.70833C13.4583 10.5137 12.8054 11.1667 12 11.1667C11.1946 11.1667 10.5417 10.5137 10.5417 9.70833C10.5417
            8.90292 11.1946 8.25 12 8.25C12.8054 8.25 13.4583 8.90292 13.4583 9.70833Z"
          fill="currentColor"
        />
        <path
          d="M9.49999 10.9583C9.49999 11.5336 9.03362 12 8.45832 12C7.88303 12 7.41666 11.5336 7.41666 10.9583C7.41666 10.383
            7.88303 9.91667 8.45832 9.91667C9.03362 9.91667 9.49999 10.383 9.49999 10.9583Z"
          fill="currentColor"
        />
        <path
          d="M16.5833 10.9583C16.5833 11.5336 16.117 12 15.5417 12C14.9664 12 14.5 11.5336 14.5 10.9583C14.5 10.383 14.966
            9.91667 15.5417 9.91667C16.117 9.91667 16.5833 10.383 16.5833 10.9583Z"
          fill="currentColor"
        />
      </svg>
    ) : icon === "gg-meet" ? (
      <svg
        width={size?.toString() || "24"}
        height={size?.toString() || "24"}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7 4L3 8V18C3 18.5 3.5 19 4 19H16C16.5 19 17 18.5 17 18V15L20.2 17.4C20.5296 17.6472 21 17.412 21 17V6.10188C21 5.6723 20.494 5.44272 20.1707 5.7256L17 8.5V5C17 4.5 16.5 4 16 4H7ZM7 8H13V15H7V8Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <MaterialIcon icon="circle" />
    )
  ) : (
    <MaterialIcon icon="circle" />
  );

export default BrandIcon;
