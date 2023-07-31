// External libraries
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { FC } from "react";

// SK Components
import {
  List,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";

// Internal components
import NewsListItem from "@/components/news/NewsListItem";

// Types
import { Info } from "@/utils/types/news";

const NewsFeed: FC<{
  news: Info[];
  isForAdmin?: boolean;
}> = ({ news, isForAdmin }) => {
  const { duration, easing } = useAnimationConfig();

  return (
    <List divided className="overflow-hidden sm:rounded-lg">
      <LayoutGroup>
        <AnimatePresence initial={false}>
          {news.map((newsItem) => (
            <motion.article
              key={newsItem.id}
              // layoutId={["news", newsItem.type, newsItem.id].join("-")}
              layoutId={["news", newsItem.id].join("-")}
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{
                scale: 0.95,
                y: 10,
                opacity: 0,
                transition: transition(
                  duration.short2,
                  easing.standardAccelerate,
                ),
              }}
              transition={transition(duration.medium4, easing.standard)}
            >
              <NewsListItem
                // key={["news", newsItem.type, newsItem.id].join("-")}
                key={["news", newsItem.id].join("-")}
                newsItem={newsItem}
                editable={isForAdmin}
                showChips
              />
            </motion.article>
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </List>
  );
};

export default NewsFeed;
