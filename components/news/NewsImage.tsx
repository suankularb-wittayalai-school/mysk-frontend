// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import NewsPlaceholderDark from "@/public/images/graphics/news-placeholder-dark.svg";
import NewsPlaceholderLight from "@/public/images/graphics/news-placeholder-light.svg";
import cn from "@/utils/helpers/cn";
import { NewsArticle } from "@/utils/types/news";
import Image from "next/image";
import { ComponentProps, FC } from "react";

/**
 * An image for a News Article.
 *
 * @param image The URL of the image.
 */
const NewsImage: FC<
  Omit<ComponentProps<typeof Image>, "src" | "alt"> & Pick<NewsArticle, "image">
> = (props) => {
  const { image, style, className } = props;
  return (
    <MultiSchemeImage
      {...props}
      {...(image
        ? { srcLight: image, srcDark: undefined }
        : { srcLight: NewsPlaceholderLight, srcDark: NewsPlaceholderDark })}
      width={305}
      height={203}
      alt=""
      style={style}
      className={cn(
        `block aspect-[3/2] overflow-hidden rounded-md bg-surface-5
        [&>img]:h-full [&>img]:object-cover`,
        className,
      )}
    />
  );
};

export default NewsImage;
