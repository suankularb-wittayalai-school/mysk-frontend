// Modules
import Masonry from "react-masonry-css";

// Components
import NewsCard from "@components/news/NewsCard";

// Types
import { NewsList } from "@utils/types/news";

const NewsFeed = ({
  news,
  isForAdmin,
}: {
  news: NewsList;
  isForAdmin?: boolean;
}): JSX.Element => (
  <Masonry
    role="feed"
    breakpointCols={{
      default: 3,
      905: 2,
      600: 1,
    }}
    className="flex flex-row gap-4 sm:gap-6"
    columnClassName="flex flex-col gap-4 sm:gap-6"
  >
    {news
      .map((newsItem) => ({
        ...newsItem,
        postDate: new Date(newsItem.postDate),
        dueDate:
          newsItem.type == "form" || newsItem.type == "payment"
            ? newsItem.dueDate
            : undefined,
      }))
      .map((newsItem, index) => (
        <article key={newsItem.id} aria-posinset={index} aria-setsize={-1}>
          <NewsCard newsItem={newsItem} editable={isForAdmin} showChips />
        </article>
      ))}
  </Masonry>
);

export default NewsFeed;
