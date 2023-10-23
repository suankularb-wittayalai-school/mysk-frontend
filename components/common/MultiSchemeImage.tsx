// Imports
import AppStateContext from "@/contexts/AppStateContext";
import Image, { StaticImageData } from "next/image";
import { omit } from "radash";
import { ComponentProps, FC, useContext } from "react";

const MultiSchemeImage: FC<
  Omit<ComponentProps<typeof Image>, "src"> &
    (
      | { srcLight: StaticImageData; srcDark: StaticImageData }
      | { srcLight: string; srcDark: undefined }
    )
> = (props) => {
  const { srcLight, srcDark, className } = props;
  const BaseImage: FC<{ src: StaticImageData | string }> = ({ src }) => (
    // Disable reason: `alt` is already required in `props`
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      src={src}
      className="w-full"
      {...omit(props, ["srcLight", "srcDark", "className"])}
    />
  );

  const { colorScheme } = useContext(AppStateContext);

  return (
    <picture className={className}>
      {!colorScheme || colorScheme === "auto" ? (
        <>
          {srcDark && (
            <source srcSet={srcDark.src} media="(prefers-color-scheme: dark)" />
          )}
          <BaseImage src={srcLight} />
        </>
      ) : (
        <BaseImage
          src={colorScheme === "dark" && srcDark ? srcDark : srcLight}
        />
      )}
    </picture>
  );
};

export default MultiSchemeImage;
