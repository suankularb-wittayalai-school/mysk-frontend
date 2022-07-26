// Backend
import { getInfos } from "@utils/backend/news/info";

// Types
import { NewsListNoDate } from "@utils/types/news";
import { Role } from "@utils/types/person";

export async function getNewsFeed(
  role: Role | "admin"
): Promise<NewsListNoDate> {
  return role == "admin"
    ? // Admin feed includes everything
      [...(await getInfos())]
    : role == "teacher"
    ? // Teacher feed includes info, stats
      []
    : // Student feed includes info, form, payment
      [...(await getInfos())];
}
