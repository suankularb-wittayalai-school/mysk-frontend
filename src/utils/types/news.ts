import { MultiLangString } from "./common";

// Feed
export type NewsList = NewsItem[];
export type NewsListNoDate = NewsItemNoDate[];

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
  oldURL?: string;
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
  dueDate?: string;
  done: boolean;
};

export type NewsItemPayment = NewsItemCommon & {
  type: "payment";
  amount?: number;
  dueDate?: string;
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

export type StudentFormItem = {
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

// Info page
export type InfoPage = NewsItemInfoNoDate & {
  content: {
    body: MultiLangString;
  };
};

// Form page
export type FieldType =
  | "short_answer"
  | "paragraph"
  | "multiple_choice"
  | "check_box"
  | "dropdown"
  | "file"
  | "date"
  | "time"
  | "scale";

export interface FormField {
  id: number;
  label: MultiLangString;
  type: FieldType;
  options?: string[];
  required: boolean;
  range: {
    start: number;
    end: number;
  };
}

export type FormPage = Omit<NewsItemFormNoDate, "done"> & {
  content: {
    fields: FormField[];
  };
};
