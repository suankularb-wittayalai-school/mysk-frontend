// External libraries
import { FC } from "react";

// External
import { List } from "@suankularb-components/react";

// Components
import NewsListItem from "@/components/news/NewsListItem";

// Types
import { NewsItemNoDate } from "@/utils/types/news";

const NewsFeed: FC<{ news: NewsItemNoDate[]; isForAdmin?: boolean }> = ({
  news,
  isForAdmin,
}): JSX.Element => (
  <List divided>
    {news.map((newsItem, index) => (
      <NewsListItem
        key={["news", newsItem.type, newsItem.id].join("-")}
        newsItem={newsItem}
        editable={isForAdmin}
        showChips
      />
    ))}
  </List>
);

export default NewsFeed;
