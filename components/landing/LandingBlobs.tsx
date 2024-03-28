import BlobsBlurringGroup from "@/components/common/BlobsBlurringGroup";
import DecorativeBlob from "@/components/common/DecorativeBlob";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";

/**
 * A group of Decorative Blobs meant for the Landing page background.
 */
const LandingBlobs: StylableFC = ({ style, className }) => (
  <BlobsBlurringGroup style={style} className={cn(`inset-0`, className)}>
    {/* Top right */}
    <DecorativeBlob
      variant="primary-1"
      style={{ width: 492, height: 479, top: -56, right: -346 }}
    />

    {/* Center */}
    <div
      style={{ width: 554, height: 442 }}
      className={cn(`left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2
        md:block`)}
    >
      <DecorativeBlob
        variant="secondary-2"
        style={{ width: 369, height: 370, bottom: 0, right: 0 }}
      />
      <DecorativeBlob
        variant="primary-2"
        style={{ width: 512, height: 235, top: 0, left: 0 }}
      />
    </div>

    {/* Bottom left */}
    <DecorativeBlob
      variant="primary-2"
      style={{ width: 800, height: 367, bottom: -232, left: -194 }}
    />
    <DecorativeBlob
      variant="secondary-1"
      style={{ width: 645, height: 649, bottom: -224, left: -470 }}
    />
  </BlobsBlurringGroup>
);

export default LandingBlobs;
