import logError from "@/utils/helpers/logError";
import mergeDBLocales from "@/utils/helpers/mergeDBLocales";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { NewsArticle } from "@/utils/types/news";

/**
 * Get a News Article by its ID.
 *
 * @param supabase The Supabase client to use.
 * @param id The ID of the Article.
 */
export default async function getNewsArticleByID(
  supabase: DatabaseClient,
  id: string,
): Promise<BackendReturn<NewsArticle>> {
  const { data, error } = await supabase
    .from("infos")
    .select(`*, news(*)`)
    .eq("id", id)
    .limit(1)
    .order("id")
    .single();

  if (error) {
    logError("getNewsArticleByID", error);
    return { data: null, error };
  }

  const article = {
    id: data.id,
    title: mergeDBLocales(data.news, "title"),
    description: mergeDBLocales(data.news, "description"),
    body: mergeDBLocales(data, "body"),
    image: data.news!.image,
    created_at: data.news!.created_at,
    old_url: data.news!.old_url,
  };

  return { data: article, error: null };
}
