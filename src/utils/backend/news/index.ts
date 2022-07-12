// Backend
import { getInfos } from "@utils/backend/news/info";

// Supabase
import { PostgrestError } from "@supabase/supabase-js";

// Types
import { NewsListNoDate } from "@utils/types/news";
import { Role } from "@utils/types/person";

export async function getNewsFeed(role: Role): Promise<NewsListNoDate> {
  return role == "student"
    ? // Student feed includes info, form, payment
      [...(await getInfos())]
    : // Teacher feed includes info, stats
      [...(await getInfos())];
}
