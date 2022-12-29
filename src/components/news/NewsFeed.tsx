// External libraries
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Masonry from "react-masonry-css";

// Components
import NewsCard from "@components/news/NewsListItem";

// Animations
import { animationTransition } from "@utils/animations/config";

// Types
import { NewsItemNoDate } from "@utils/types/news";
import NewsListItem from "@components/news/NewsListItem";

const NewsFeed = ({
  news,
  isForAdmin,
  btnType,
}: {
  news: NewsItemNoDate[];
  isForAdmin?: boolean;
  btnType?: "filled" | "tonal" | "text" | "outlined";
}): JSX.Element => (
  <section role="feed" className="divide-y-2 divide-outline !px-0">
    <LayoutGroup>
      <AnimatePresence initial={false}>
        {news.map((newsItem, index) => (
          <motion.article
            key={["news", newsItem.type, newsItem.id].join("-")}
            aria-posinset={index}
            aria-setsize={-1}
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={animationTransition}
            className="!px-0"
          >
            <NewsListItem newsItem={newsItem} editable={isForAdmin} showChips />
          </motion.article>
        ))}
      </AnimatePresence>
    </LayoutGroup>
  </section>
);

export default NewsFeed;
