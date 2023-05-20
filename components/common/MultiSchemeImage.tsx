// External libraries
import Image, { StaticImageData } from "next/image";
import { ComponentProps, FC, useContext } from "react";

// Contexts
import AppStateContext from "@/contexts/AppStateContext";

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
  const BaseImage: FC<{ src: StaticImageData | string }> = ({ src }) => (
    // Disable reason: `alt` is already required in `props`
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      src={src}
      className="w-full"
      {...removeFromObjectByKeys<
        Omit<ComponentProps<typeof Image>, "src" | "className">
      >(["srcLight", "srcDark", "className"], props)}
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
