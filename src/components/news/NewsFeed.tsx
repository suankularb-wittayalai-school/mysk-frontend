// Modules
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Masonry from "react-masonry-css";

// Components
import NewsCard from "@components/news/NewsCard";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { NewsItemNoDate, NewsListNoDate } from "@utils/types/news";

const NewsFeed = ({
  news,
  isForAdmin,
  btnType,
}: {
  news: NewsItemNoDate[];
  isForAdmin?: boolean;
  btnType?: "filled" | "tonal" | "text" | "outlined";
}): JSX.Element => (
  <section role="feed">
    <LayoutGroup>
      <AnimatePresence initial={false}>
        <Masonry
          role="feed"
          breakpointCols={{ default: 3, 905: 2, 600: 1 }}
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
              <motion.article
                key={newsItem.id}
                aria-posinset={index}
                aria-setsize={-1}
                initial={{ scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 20, opacity: 0 }}
                layoutId={["news", newsItem.type, newsItem.id].join("-")}
                transition={animationTransition}
              >
                <NewsCard
                  // (@SiravitPhokeed)
                  // I have no idea what’s wro here so…um…apologies
                  // for the `any`.
                  newsItem={newsItem as any}
                  editable={isForAdmin}
                  btnType={btnType || "filled"}
                  showChips
                />
              </motion.article>
            ))}
        </Masonry>
      </AnimatePresence>
    </LayoutGroup>
  </section>
);

export default NewsFeed;
