import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import MySKPrideLogoDark from "@/public/icons/petals-dark-pride.svg";
import MySKLogoDark from "@/public/icons/petals-dark.svg";
import MySKPrideLogoLight from "@/public/icons/petals-light-pride.svg";
import MySKLogoLight from "@/public/icons/petals-light.svg";
import MySKMourningLogoLight from "@/public/icons/petals-light-mourning.svg";
import MySKMourningLogoDark from "@/public/icons/petals-dark-mourning.svg";
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
      // {...(pride
      //   ? { srcLight: MySKPrideLogoLight, srcDark: MySKPrideLogoDark }
      //   : { srcLight: MySKLogoLight, srcDark: MySKLogoDark })}
      srcLight={MySKMourningLogoLight}
      srcDark={MySKMourningLogoDark}
      {...props}
    />
  );
};

export default Logo;
