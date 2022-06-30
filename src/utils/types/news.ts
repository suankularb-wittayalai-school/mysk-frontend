export type NewsList = Array<NewsItem>;

export type NewsItem =
  | NewsItemNews
  | NewsItemStats
  | NewsItemForm
  | NewsItemPayment;

export type NewsItemType = "news" | "stats" | "form" | "payment";

type NewsItemCommon = {
  id: number;
  postDate: number;
  image?: string;
  done?: boolean;
  content: {
    "en-US": NewsContent;
    th: NewsContent;
  };
};

export type NewsItemNews = NewsItemCommon & {
  type: "news";
};

export type NewsItemStats = NewsItemCommon & {
  type: "stats";
};

export type NewsItemForm = NewsItemCommon & {
  type: "form";
  frequency?: "once" | "weekly" | "monthly";
  dueDate?: number;
  done: boolean;
};

export type NewsItemPayment = NewsItemCommon & {
  type: "payment";
  amount?: number;
  dueDate?: number;
  done: boolean;
};

export type NewsContent = {
  title: string;
  supportingText: string;
};

export type StudentForm = {
  id: number;
  type: "form" | "payment";
  postDate: Date;
  percentDone: number;
  content: {
    "en-US"?: {
      title: string;
    };
    th: {
      title: string;
    };
  };
};
