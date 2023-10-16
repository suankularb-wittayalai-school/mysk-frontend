// Imports
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import NewsPlaceholderDark from "@/public/images/graphics/news-placeholder-dark.svg";
import NewsPlaceholderLight from "@/public/images/graphics/news-placeholder-light.svg";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { NewsArticle } from "@/utils/types/news";

/**
 * An image for a News Article.
 *
 * @param image The URL of the image.
 */
const NewsImage: StylableFC<{
  image: NewsArticle["image"];
}> = ({ image, style, className }) => {
  return (
    <MultiSchemeImage
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
