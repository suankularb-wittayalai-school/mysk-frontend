// Converters
import { PostgrestError } from "@supabase/supabase-js";
import { dbInfo2News } from "@utils/backend/database";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { InfoDB, InfoTable, NewsTable } from "@utils/types/database/news";

export async function getLandingFeed() {
  const infos = await getInfos();

  return {
    lastUpdated: infos[0]?.postDate || "",
    content: infos,
  };
}

export async function getInfos() {
  const { data, error } = await supabase
    .from<InfoDB>("infos")
    .select(
      "*, parent:news(title_th, title_en, description_th, description_en, image, old_url)"
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data.map(dbInfo2News);
}

export async function getInfo(id: number) {
  const { data, error } = await supabase
    .from<InfoDB>("infos")
    .select(
      "*, parent:news(title_th, title_en, description_th, description_en, image, old_url)"
    )
    .match({ id })
    .limit(1)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return dbInfo2News(data);
}

export async function createInfo(form: {
  titleTH: string;
  titleEN: string;
  descTH: string;
  descEN: string;
  bodyTH: string;
  bodyEN: string;
  oldURL: string;
}): Promise<{ data: InfoTable[]; error: PostgrestError | null }> {
  const { data: news, error: newsError } = await supabase
    .from<NewsTable>("news")
    .insert({
      title_th: form.titleTH,
      title_en: form.titleEN,
      description_th: form.descTH,
      description_en: form.descEN,
      old_url: form.oldURL,
    })
    .limit(1)
    .single();

  if (newsError || !news) {
    console.error(newsError);
    return { data: [], error: newsError };
  }

  const { data: info, error: infoError } = await supabase
    .from<InfoTable>("infos")
    .insert({
      body_th: form.bodyTH,
      body_en: form.bodyEN,
      parent: news.id,
    });

  if (infoError || !info) {
    console.error(infoError);
    return { data: [], error: infoError };
  }

  return { data: info, error: null };
}

export async function updateInfo(
  id: number,
  form: {
    titleTH: string;
    titleEN: string;
    descTH: string;
    descEN: string;
    bodyTH: string;
    bodyEN: string;
    oldURL: string;
  }
): Promise<{ data: InfoTable[]; error: PostgrestError | null }> {
  const { data: updatedInfo, error: updatedInfoError } = await supabase
    .from<InfoTable>("infos")
    .update({
      body_th: form.bodyTH,
      body_en: form.bodyEN,
    })
    .match({ id });

  if (updatedInfoError || !updatedInfo || updatedInfo.length < 1) {
    console.error(updatedInfoError);
    return { data: [], error: updatedInfoError };
  }

  const { data: updatedNews, error: updatedNewsError } = await supabase
    .from<NewsTable>("news")
    .update({
      title_th: form.titleTH,
      title_en: form.titleEN,
      description_th: form.descTH,
      description_en: form.descEN,
      old_url: form.oldURL,
    })
    .match({ id: updatedInfo[0].parent });

  if (updatedNewsError || !updatedNews) {
    console.error(updatedNewsError);
    return { data: [], error: updatedNewsError };
  }

  return { data: updatedInfo, error: null };
}
