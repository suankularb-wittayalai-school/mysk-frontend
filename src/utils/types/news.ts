export type NewsList = Array<NewsItem>;

export type NewsItem = {
  id: number;
  type: "news" | "form" | "payment";
  content: {
    "en-US": NewsContent;
    th: NewsContent;
  };
  postDate: Date;
  done: boolean;
};

export type NewsContent = {
  title: string;
  supportingText: string;
};
