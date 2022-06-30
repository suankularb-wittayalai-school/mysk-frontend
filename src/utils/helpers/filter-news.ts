import { NewsList, NewsList } from "@utils/types/news";

export function filterNews(
  news: NewsList,
  newsFilter: Array<string>,
  setFilteredNews: (newNews: NewsList) => void
): void;

export function filterNews(
  news: NewsList,
  newsFilter: Array<string>,
  setFilteredNews: (newNews: NewsList) => void
): void;

export function filterNews(
  news: NewsList | NewsList,
  newsFilter: Array<string>,
  setFilteredNews: any
) {
  // Reset filtered news if all filters are deselected
  if (newsFilter.length == 0) {
    setFilteredNews(news);

    // Handles done
  } else if (newsFilter.includes("not-done") || newsFilter.includes("done")) {
    if (newsFilter.length > 1) {
      setFilteredNews(
        news.filter(
          (newsItem) =>
            newsFilter.includes(newsItem.type) &&
            (newsFilter.includes("done")
              ? newsItem.done
              : newsItem.done == false)
        )
      );
    } else {
      setFilteredNews(
        news.filter((newsItem) =>
          newsFilter.includes("done") ? newsItem.done : newsItem.done == false
        )
      );
    }
  }

  // Handles types
  else {
    setFilteredNews(
      news.filter((newsItem) => newsFilter.includes(newsItem.type))
    );
  }
}
