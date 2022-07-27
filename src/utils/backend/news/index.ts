// Backend
import { getInfos } from "@utils/backend/news/info";
import { getForms } from "@utils/backend/news/form";

// Types
import { NewsListNoDate } from "@utils/types/news";
import { Role } from "@utils/types/person";

export async function getNewsFeed(
  role: Role | "admin",
): Promise<NewsListNoDate> {
  return role == "admin"
    ? // Admin feed includes everything
      [...(await getInfos()).data, ...(await getForms()).data]
    : role == "teacher"
    ? // Teacher feed includes info, stats
      [...(await getInfos()).data]
    : role == "student" // Student feed includes info, form, payment
    ? [...(await getInfos()).data, ...(await getForms()).data]
    : [];
}
