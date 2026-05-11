// Imports
import PhoneFrame from "@/public/images/phone-frame.png";
import calculateLuminance from "@/utils/helpers/club/calculateLuminance";
import cn from "@/utils/helpers/cn";
import { CalculatedClubScheme } from "@/utils/types/club";
import Image from "next/image";
import { FC } from "react";

/**
 * A simplified preview of the Request Club Join page, for previewing colors
 * and logo.
 *
 * @param logo A Club’s logo URL.
 * @param backgroundColor A Club’s configured background color.
 * @param accentColor A Club’s configured accent color.
 *
 * @returns A `<div>`.
 */
const ClubJoinPreview: FC<{
  logo: string;
  backgroundColor: string;
  accentColor: string;
}> = ({ logo, backgroundColor, accentColor }) => {
  const scheme: CalculatedClubScheme = {
    page: calculateLuminance(backgroundColor) > 128 ? "light" : "dark",
    button: calculateLuminance(accentColor) > 128 ? "dark" : "light",
  };

  return (
    <div className="relative isolate mx-auto mb-4 max-w-[16rem] sm:mb-0">
      <Image src={PhoneFrame} alt="" priority className="pointer-events-none" />
      <figure
        className={cn(
          `absolute bottom-[2.75%] left-[5.75%] right-[5.75%] top-[2.75%] -z-10 overflow-hidden rounded-md text-on-background [&_*]:transition-colors`,
          scheme.page,
        )}
        style={{ backgroundColor }}
      >
        {logo && (
          <Image
            src={logo}
            width={230}
            height={230}
            alt=""
            className="absolute inset-0 m-auto w-[90%] object-contain"
            style={{
              filter: `drop-shadow(0px 0px 48px ${accentColor})`,
            }}
          />
        )}
        <svg
          viewBox="0 0 393 852"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <g>
            <g opacity="0.4">
              <rect
                x="68.5"
                y="99"
                width="256"
                height="32"
                rx="6"
                className="fill-on-background"
              />
              <rect
                x="57.5"
                y="139"
                width="278"
                height="32"
                rx="6"
                className="fill-on-background"
              />
              <rect
                x="151.5"
                y="179"
                width="90"
                height="32"
                rx="6"
                className="fill-on-background"
              />
            </g>
            <g>
              <rect
                x="40"
                y="720"
                width="313"
                height="40"
                rx="20"
                fill={accentColor}
                className="!transition-none"
              />
              <rect
                opacity="0.1"
                x="40"
                y="720"
                width="313"
                height="40"
                rx="20"
                className={cn(`fill-on-surface`, scheme.button)}
              />
              <rect
                opacity="0.4"
                x="154.5"
                y="730"
                width="84"
                height="20"
                rx="3"
                className={cn(`fill-surface`, scheme.button)}
              />
            </g>
            <rect
              opacity="0.5"
              x="176"
              y="782"
              width="40"
              height="20"
              rx="3"
              fill={accentColor}
              className="!transition-none"
            />
            <rect
              x="40"
              y="772"
              width="313"
              height="40"
              rx="20"
              className="stroke-outline"
            />
            <path
              d="M296.799 26C296.799 25.4477 297.247 25 297.799 25H298.799C299.352 25 299.799 25.4477 299.799 26V34C299.799 34.5523 299.352 35 298.799 35H297.799C297.247 35 296.799 34.5523 296.799 34V26Z"
              className="fill-on-background"
            />
            <path
              d="M301.799 24C301.799 23.4477 302.247 23 302.799 23H303.799C304.352 23 304.799 23.4477 304.799 24V34C304.799 34.5523 304.352 35 303.799 35H302.799C302.247 35 301.799 34.5523 301.799 34V24Z"
              className="fill-on-background"
            />
            <path
              d="M291.799 29.5C291.799 28.9477 292.247 28.5 292.799 28.5H293.799C294.352 28.5 294.799 28.9477 294.799 29.5V34C294.799 34.5523 294.352 35 293.799 35H292.799C292.247 35 291.799 34.5523 291.799 34V29.5Z"
              className="fill-on-background"
            />
            <path
              d="M286.799 32C286.799 31.4477 287.247 31 287.799 31H288.799C289.352 31 289.799 31.4477 289.799 32V34C289.799 34.5523 289.352 35 288.799 35H287.799C287.247 35 286.799 34.5523 286.799 34V32Z"
              className="fill-on-background"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M321.3 25.5875C323.766 25.5876 326.139 26.5551 327.926 28.2898C328.061 28.4237 328.276 28.4221 328.409 28.286L329.695 26.9605C329.763 26.8915 329.8 26.798 329.799 26.7008C329.799 26.6035 329.76 26.5105 329.692 26.4423C325.001 21.8526 317.599 21.8526 312.907 26.4423C312.839 26.5105 312.8 26.6034 312.799 26.7007C312.799 26.7979 312.836 26.8914 312.903 26.9605L314.19 28.286C314.323 28.4223 314.538 28.424 314.673 28.2898C316.461 26.5549 318.833 25.5875 321.3 25.5875ZM321.335 29.5894C322.691 29.5893 323.997 30.1035 325.002 31.032C325.138 31.1638 325.352 31.1609 325.484 31.0255L326.77 29.7C326.837 29.6304 326.875 29.5361 326.874 29.4381C326.873 29.3401 326.833 29.2466 326.764 29.1784C323.705 26.2739 318.968 26.2739 315.909 29.1784C315.84 29.2466 315.8 29.3401 315.799 29.4382C315.799 29.5362 315.836 29.6305 315.904 29.7L317.189 31.0255C317.321 31.1609 317.535 31.1638 317.671 31.032C318.675 30.1041 319.981 29.5899 321.335 29.5894ZM323.949 32.1767C323.951 32.275 323.913 32.3698 323.844 32.4386L321.621 34.7289C321.556 34.7962 321.467 34.834 321.374 34.834C321.282 34.834 321.193 34.7962 321.128 34.7289L318.904 32.4386C318.835 32.3697 318.797 32.2749 318.8 32.1766C318.802 32.0783 318.843 31.9853 318.915 31.9194C320.335 30.6935 322.414 30.6935 323.834 31.9194C323.905 31.9853 323.947 32.0784 323.949 32.1767Z"
              className="fill-on-background"
            />
            <path
              opacity="0.35"
              d="M341.799 23.5275H358.799C360.717 23.5275 362.272 25.0822 362.272 27V32C362.272 33.9178 360.717 35.4725 358.799 35.4725H341.799C339.882 35.4725 338.327 33.9178 338.327 32V27C338.327 25.0822 339.882 23.5275 341.799 23.5275Z"
              stroke="white"
              strokeWidth="1.05509"
            />
            <path
              opacity="0.4"
              d="M363.799 28V32.2203C364.648 31.8629 365.201 31.0314 365.201 30.1102C365.201 29.1889 364.648 28.3574 363.799 28"
              className="fill-on-background"
            />
            <path
              d="M339.799 27C339.799 25.8954 340.695 25 341.799 25H358.799C359.904 25 360.799 25.8954 360.799 27V32C360.799 33.1046 359.904 34 358.799 34H341.799C340.695 34 339.799 33.1046 339.799 32V27Z"
              className="fill-on-background"
            />
            <rect
              opacity="0.4"
              x="40"
              y="20"
              width="54"
              height="20"
              rx="3"
              className="fill-on-background"
            />
          </g>
        </svg>
      </figure>
    </div>
  );
};

export default ClubJoinPreview;
