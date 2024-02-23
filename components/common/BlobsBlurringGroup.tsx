import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

/**
 * A group of Decorative Blobs that are blurred together.
 *
 * @param children Decorative Blobs.
 * 
 * @example
 * 
 * ```tsx
 * <BlobBlurringGroup className="absolute inset-0 -z-10 *:absolute">
 *   <DecorativeBlob
 *     variant="primary-2"
 *     style={{ width: 532, height: 244, top: -109, left: 72 }}
 *   />
 *   <DecorativeBlob
 *     variant="secondary-1"
 *     style={{ width: 428, height: 430, top: -133, left: -231 }}
 *   />
 * </BlobBlurringGroup>
 * ```
 */
const BlobsBlurringGroup: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => (
  <div
    style={style}
    className={cn(`overflow-hidden blur-[50px] dark:blur-[100px]`, className)}
  >
    {children}
  </div>
);

export default BlobsBlurringGroup;
