export type NewsList = Array<NewsItem>;
export type NewsListNoDate = Array<NewsItemNoDate>;

export type NewsItem =
  | NewsItemNews
  | NewsItemStats
  | NewsItemForm
  | NewsItemPayment;

export type NewsItemNoDate = NewsItem & {
  postDate: number;
  dueDate?: number;
};

export type NewsItemType = "news" | "stats" | "form" | "payment";

type NewsItemCommon = {
  id: number;
  postDate: Date;
  image?: string;
  done?: boolean;
  content: {
    "en-US": NewsContent;
    th: NewsContent;
  };
};

export interface NewsItemNews extends NewsItemCommon {
  type: "news";
}

export interface NewsItemStats extends NewsItemCommon {
  type: "stats";
}

export interface NewsItemForm extends NewsItemCommon {
  type: "form";
  frequency?: "once" | "weekly" | "monthly";
  dueDate?: Date;
  done: boolean;
}

export interface NewsItemPayment extends NewsItemCommon {
  type: "payment";
  amount?: number;
  dueDate?: Date;
  done: boolean;
}

export type NewsContent = {
  title: string;
  supportingText: string;
};
