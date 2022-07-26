import {
  NewsItem,
  NewsItemForm,
  NewsItemNoDate,
  NewsItemPayment,
} from "@utils/types/news";

export function replaceNumberInNewsWithDate(
  newsItemNoDate: NewsItemNoDate
): NewsItem | null {
  if (newsItemNoDate.type == "info" || newsItemNoDate.type == "stats")
    return {
      ...newsItemNoDate,
      type: newsItemNoDate.type,
      postDate: new Date(newsItemNoDate.postDate),
    };
  else if (newsItemNoDate.type == "form" || newsItemNoDate.type == "payment")
    return {
      ...(newsItemNoDate as Omit<
        NewsItemForm | NewsItemPayment,
        "postDate" | "dueDate"
      > & {
        postDate: string;
        dueDate?: string;
      }),
      postDate: new Date(newsItemNoDate.postDate),
      dueDate: newsItemNoDate.dueDate
        ? new Date(newsItemNoDate.dueDate)
        : undefined,
    };
  else return null;
}
