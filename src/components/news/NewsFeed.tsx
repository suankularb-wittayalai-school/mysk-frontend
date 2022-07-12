// Modules
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";

// Components
import NewsCard from "@components/news/NewsCard";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { NewsList } from "@utils/types/news";

const NewsFeed = ({
  news,
  isForAdmin,
}: {
  news: NewsList;
  isForAdmin?: boolean;
}): JSX.Element => (
  <ul>
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
          <motion.li
            key={newsItem.id}
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={animationTransition}
          >
            <article aria-posinset={index} aria-setsize={-1}>
              <NewsCard newsItem={newsItem} editable={isForAdmin} showChips />
            </article>
          </motion.li>
        ))}
    </Masonry>
  </ul>
);

export default NewsFeed;
