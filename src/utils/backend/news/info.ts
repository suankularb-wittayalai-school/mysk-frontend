// Modules
import { PostgrestError } from "@supabase/supabase-js";

// Converters
import { db2InfoPage, dbInfo2NewsItem } from "@utils/backend/database";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import { InfoDB, InfoTable, NewsTable } from "@utils/types/database/news";
import { BackendDataReturn } from "@utils/types/common";
import { InfoPage, NewsItemInfoNoDate } from "@utils/types/news";

export async function getLandingFeed(): Promise<
  BackendDataReturn<{ lastUpdated: string; content: NewsItemInfoNoDate[] }, null>
> {
  const { data: infos, error: infosError } = await getInfos();

  if (infosError) {
    console.error(infosError);
    return { data: null, error: infosError };
  }

  return {
    data: {
      lastUpdated: infos[0]?.postDate || "",
      content: infos,
    },
    error: null,
  };
}

export async function getInfos(): Promise<BackendDataReturn<NewsItemInfoNoDate[]>> {
  const { data, error } = await supabase
    .from<InfoDB>("infos")
    .select(
      "*, parent:news(title_th, title_en, description_th, description_en, image, old_url)"
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  return { data: data.map(dbInfo2NewsItem), error: null };
}

export async function getAllInfoIDs(): Promise<number[]> {
  const { data, error } = await supabase.from<InfoDB>("infos").select("id");

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data.map((info) => info.id);
}

export async function getInfo(
  id: number
): Promise<BackendDataReturn<InfoPage, null>> {
  const { data, error } = await supabase
    .from<InfoDB>("infos")
    .select(
      "*, parent:news(title_th, title_en, description_th, description_en, image, old_url)"
    )
    .match({ id })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return { data: db2InfoPage(data as InfoDB), error: null };
}

export async function uploadBanner(
  mode: "add" | "edit",
  newsID: number,
  image: File
): Promise<{ error: Partial<PostgrestError> | null }> {
  const fileName: string = `info/${newsID}/banner.${image.name
    .split(".")
    .pop()}`;

  if (mode == "add") {
    const { error: imageError } = await supabase.storage
      .from("news")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (imageError) {
      console.error(imageError);
      return { error: { message: imageError.message } };
    }
  } else if (mode == "edit") {
    const { error: imageError } = await supabase.storage
      .from("news")
      .update(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (imageError) {
      console.error(imageError);
      return { error: { message: imageError.message } };
    }
  }

  const { data: newsWImage, error: newsWImageError } = await supabase
    .from<NewsTable>("news")
    .update({ image: fileName })
    .match({ id: newsID });

  if (newsWImageError || !newsWImage) {
    console.error(newsWImageError);
    return { error: newsWImageError };
  }

  return { error: null };
}

export async function createInfo(form: {
  titleTH: string;
  titleEN: string;
  descTH: string;
  descEN: string;
  bodyTH: string;
  bodyEN: string;
  image: File | null;
  oldURL: string;
}): Promise<BackendDataReturn<InfoTable[]>> {
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

  // Upload image
  if (form.image) {
    const { error: imageError } = await uploadBanner(
      "add",
      news.id,
      form.image
    );
    if (imageError) return { data: [], error: imageError };
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
    image: File | null;
    oldURL: string;
  }
): Promise<BackendDataReturn<InfoTable[]>> {
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

  if (updatedNewsError || !updatedNews || updatedNews.length < 0) {
    console.error(updatedNewsError);
    return { data: [], error: updatedNewsError };
  }

  if (form.image) {
    const { error: imageError } = await uploadBanner(
      updatedNews[0].image ? "edit" : "add",
      id,
      form.image
    );
    if (imageError) return { data: [], error: imageError };
  }

  return { data: updatedInfo, error: null };
}

export async function deleteInfo(
  id: number
): Promise<{ error: PostgrestError | null }> {
  const { data: info, error: infoError } = await supabase
    .from<InfoTable>("infos")
    .delete({ returning: "representation" })
    .match({ id });

  if (infoError || !info || info.length < 1) {
    console.error(infoError);
    return { error: infoError };
  }

  const { error: newsError } = await supabase
    .from<NewsTable>("news")
    .delete()
    .match({ id: info[0].parent });

  if (newsError) {
    console.error(newsError);
    return { error: newsError };
  }

  return { error: null };
}
