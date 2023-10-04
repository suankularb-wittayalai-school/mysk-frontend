// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import BlobsLeftDark from "@/public/images/graphics/blobs/left-dark.svg";
import BlobsLeftLight from "@/public/images/graphics/blobs/left-light.svg";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { Interactive, Text } from "@suankularb-components/react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

const LookupChoice: StylableFC<{
  icon: JSX.Element;
  title: string | JSX.Element;
  desc: string | JSX.Element;
  href: string;
}> = ({ icon, title, desc, href, style, className }) => {
  return (
    <Interactive
      href={href}
      element={Link}
      style={style}
      className={cn(
        `group relative grid gap-2 rounded-xl px-6 py-4
        transition-[border-radius] hover:[transition-duration:300ms]
        focus:rounded-xl active:rounded-xl state-layer:!bg-primary
        md:grid-cols-[6rem,1fr] md:gap-6 md:hover:rounded-full`,
        className,
      )}
    >
      <MultiSchemeImage
        srcLight={BlobsLeftLight}
        srcDark={BlobsLeftDark}
        alt=""
        priority
        className="absolute bottom-0 top-0 -z-10 aspect-[441/96]"
      />
      <div
        className={cn(`[&>i]:bg-gradient-to-tr [&>i]:from-primary
          [&>i]:via-secondary [&>i]:to-secondary [&>i]:bg-clip-text
          [&>i]:[-webkit-text-fill-color:transparent] md:[&>i]:!text-[6rem]`)}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <Text type="headline-medium" element="h2">
          {title}
        </Text>
        <Text type="body-large" element="p">
          <Balancer>{desc}</Balancer>
        </Text>
      </div>
    </Interactive>
  );
};

export default LookupChoice;
