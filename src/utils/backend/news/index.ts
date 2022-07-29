// Backend
import { getInfos } from "@utils/backend/news/info";
import { getForms } from "@utils/backend/news/form";

// Types
import { BackendReturn } from "@utils/types/common";
import { NewsItemNoDate } from "@utils/types/news";
import { Role } from "@utils/types/person";

export async function getNewsFeed(
  role: Role | "admin"
): Promise<BackendReturn<NewsItemNoDate[]>> {
  const unsortedFeed =
    role == "admin"
      ? // Admin feed includes everything
        [...(await getInfos()).data, ...(await getForms()).data]
      : role == "teacher"
      ? // Teacher feed includes info, stats
        [...(await getInfos()).data]
      : role == "student" // Student feed includes info, form, payment
      ? [...(await getInfos()).data, ...(await getForms()).data]
      : [];

  return {
    data: unsortedFeed.sort(
      (a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
    ),
    error: null,
  };
}
