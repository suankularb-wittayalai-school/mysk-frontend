import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import MySKVariantLogoDark from "@/public/icons/petals-dark-variant.svg";
import MySKLogoDark from "@/public/icons/petals-dark.svg";
import MySKVariantLogoLight from "@/public/icons/petals-light-variant.svg";
import MySKLogoLight from "@/public/icons/petals-light.svg";
import { toZonedTime } from "date-fns-tz";
import Image from "next/image";
import { ComponentProps, FC } from "react";

/**
 * The full petals version of the MySK logo.
 */
const Logo: FC<Omit<ComponentProps<typeof Image>, "src">> = (props) => {
  /** Is it pride month? */
  const pride =
    toZonedTime(new Date(), process.env.NEXT_PUBLIC_SCHOOL_TZ).getMonth() === 5;

  return (
    <MultiSchemeImage
      {...(pride
        ? { srcLight: MySKVariantLogoLight, srcDark: MySKVariantLogoDark }
        : { srcLight: MySKLogoLight, srcDark: MySKLogoDark })}
      {...props}
    />
  );
};

export default Logo;
