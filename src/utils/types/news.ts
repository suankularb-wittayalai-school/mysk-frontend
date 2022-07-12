import { MultiLangString } from "./common";

export type NewsList = Array<NewsItem>;
export type NewsListNoDate = Array<NewsItemNoDate>;

export type NewsItem =
  | NewsItemInfo
  | NewsItemStats
  | NewsItemForm
  | NewsItemPayment;

export type NewsItemNoDate = Omit<NewsItem, "postDate" | "dueDate"> & {
  postDate: string;
  dueDate?: string;
};

export type NewsItemType = "info" | "stats" | "form" | "payment";

type NewsItemCommon = {
  id: number;
  postDate: Date;
  image?: string;
  done?: boolean;
  content: {
    title: MultiLangString;
    description: MultiLangString;
  };
};

export type NewsItemInfo = NewsItemCommon & {
  type: "info";
};

export type NewsItemStats = NewsItemCommon & {
  type: "stats";
};

export type NewsItemForm = NewsItemCommon & {
  type: "form";
  frequency?: "once" | "weekly" | "monthly";
  dueDate?: Date;
  done: boolean;
};

export type NewsItemPayment = NewsItemCommon & {
  type: "payment";
  amount?: number;
  dueDate?: Date;
  done: boolean;
};

export type NewsItemInfoNoDate = Omit<NewsItemInfo, "postDate"> & {
  postDate: string;
};

export type NewsItemStatsNoDate = Omit<NewsItemStats, "postDate"> & {
  postDate: string;
};

export type NewsItemFormNoDate = Omit<NewsItemForm, "postDate" | "dueDate"> & {
  postDate: string;
  dueDate?: string;
};

export type NewsItemPaymentNoDate = Omit<
  NewsItemPayment,
  "postDate" | "dueDate"
> & {
  postDate: string;
  dueDate?: string;
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
