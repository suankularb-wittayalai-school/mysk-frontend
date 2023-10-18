import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { NewsArticle } from "@/utils/types/news";

/**
 * Get all News Articles sorted by newest first.
 *
 * @param supabase The Supabase client to use.
 * 
 * @returns A Backend Return of an array of News Articles.
 */
export default async function getNewsFeed(
  supabase: DatabaseClient,
): Promise<BackendReturn<NewsArticle[]>> {
  const { data, error } = await supabase
    .from("infos")
    .select(`*, news(*)`)
    // Sort by newest first
    .order("created_at", { ascending: false });

  if (error) {
    logError("getNewsArticleByID", error);
    return { data: null, error };
  }

  // Format the data
  const feed = data.map((article) => ({
    id: article.id,
    title: mergeDBLocales(article.news, "title"),
    description: mergeDBLocales(article.news, "description"),
    body: mergeDBLocales(article, "body"),
    image: article.news!.image,
    created_at: article.news!.created_at,
    old_url: article.news!.old_url,
  }));

  return { data: feed, error: null };
}
