// External libraries
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { FC } from "react";

// Components
import NewsListItem from "@/components/news/NewsListItem";

// Animations
import { animationTransition } from "@/utils/animations/config";

// Types
import { NewsItemNoDate } from "@/utils/types/news";

const NewsFeed: FC<{ news: NewsItemNoDate[]; isForAdmin?: boolean }> = ({
  news,
  isForAdmin,
}): JSX.Element => (
  <section role="feed" className="divide-y-[1px] divide-outline-variant !px-0">
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
