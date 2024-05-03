import { StylableFC } from "@/utils/types/common";

/**
 * One side of the More Indicator under Elective Period.
 *
 * ```plaintext
 * __     ________     __                                                 __
 * \_ and ________ and _/ combines into the Indicator. The edge is shaped \_.
 * ```
 */
const MoreIndicatorEdge: StylableFC = ({ style, className }) => (
  <svg
    width={7}
    height={4}
    viewBox="0 0 7 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    className={className}
  >
    <path
      d="M0.441406 0.582031C1.2447 0.85298 2.1051 0.999852 2.99979 0.999852L7
        1L6.99979 3.99961C4.28604 3.99961 1.88788 2.64838 0.441406 0.582031Z"
      fill="currentColor"
    />
  </svg>
);
export default MoreIndicatorEdge;
