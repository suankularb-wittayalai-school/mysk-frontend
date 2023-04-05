// External libraries
import Image, { StaticImageData } from "next/image";
import { ComponentProps, FC } from "react";

// Helpers
import { removeFromObjectByKeys } from "@/utils/helpers/object";

const MultiSchemeImage: FC<
  Omit<ComponentProps<typeof Image>, "src"> &
    (
      | { srcLight: StaticImageData; srcDark: StaticImageData }
      | { srcLight: string; srcDark: undefined }
    )
> = (props) => {
  const { srcLight, srcDark, className } = props;

  return (
    <picture className={className}>
      {srcDark && (
        <source srcSet={srcDark.src} media="(prefers-color-scheme: dark)" />
      )}
      {/* `alt` is required in `props` */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        src={srcLight}
        {...removeFromObjectByKeys<
          Omit<ComponentProps<typeof Image>, "src" | "className">
        >(["srcLight", "srcDark", "className"], props)}
      />
    </picture>
  );
};

export default MultiSchemeImage;
