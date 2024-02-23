import BlobsBlurringGroup from "@/components/common/BlobsBlurringGroup";
import DecorativeBlob from "@/components/common/DecorativeBlob";
import MySKLogo from "@/public/images/brand/mysk-light.svg";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import Image from "next/image";

/**
 * The background for Sake Celebration.
 */
const SakeBackground: StylableFC = ({ style, className }) => {
  return (
    <div
      style={{ width: 560, height: 256, ...style }}
      className={cn(`*:absolute`, className)}
    >
      {/* Blobs */}
      <BlobsBlurringGroup className="inset-0 *:absolute">
        <DecorativeBlob
          variant="secondary-1"
          style={{ width: 347, height: 348, top: 34, left: 260 }}
        />
        <DecorativeBlob
          variant="primary-2"
          style={{ width: 432, height: 198, top: -65, left: 260 }}
        />
      </BlobsBlurringGroup>

      {/* Logo */}
      <Image
        src={MySKLogo}
        style={{ width: 384, height: 384, top: 24, left: 275 }}
        alt=""
        className="opacity-10"
      />
    </div>
  );
};

export default SakeBackground;
