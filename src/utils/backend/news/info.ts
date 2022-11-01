// External libraries
import { PostgrestError } from "@supabase/supabase-js";

// Converters
import { db2InfoPage, dbInfo2NewsItem } from "@utils/backend/database";

// Supabase
import { supabase } from "@utils/supabase-client";

// Types
import {
  BackendDataReturn,
  BackendReturn,
  DatabaseClient,
} from "@utils/types/common";
import { InfoPage, NewsItemInfoNoDate } from "@utils/types/news";
import { Database } from "@utils/types/supabase";

export async function getLandingFeed(): Promise<
  BackendDataReturn<
    { lastUpdated: string; content: NewsItemInfoNoDate[] },
    null
  >
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

export async function getInfos(): Promise<
  BackendDataReturn<NewsItemInfoNoDate[]>
> {
  const { data, error } = await supabase
    .from("infos")
    .select(
      "*, parent:news(title_th, title_en, description_th, description_en, image, old_url)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: data!.map(dbInfo2NewsItem),
    error: null,
  };
}

export async function getAllInfoIDs(): Promise<number[]> {
  const { data, error } = await supabase.from("infos").select("id");

  if (error) {
    console.error(error);
    return [];
  }

  return (data as Database["public"]["Tables"]["infos"]["Row"][]).map(
    (info) => info.id
  );
}

export async function getInfo(
  id: number
): Promise<BackendDataReturn<InfoPage, null>> {
  const { data, error } = await supabase
    .from("infos")
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

  return {
    data: db2InfoPage(data!),
    error: null,
  };
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

  const { error: newsWImageError } = await supabase
    .from("news")
    .update({ image: fileName })
    .match({ id: newsID });

  if (newsWImageError) {
    console.error(newsWImageError);
    return { error: newsWImageError };
  }

  return { error: null };
}

export async function createInfo(
  supabase: DatabaseClient,
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
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["infos"]["Row"], null>
> {
  const { data: news, error: newsError } = await supabase
    .from("news")
    .insert({
      title_th: form.titleTH,
      title_en: form.titleEN,
      description_th: form.descTH,
      description_en: form.descEN,
      old_url: form.oldURL,
    })
    .select("*")
    .limit(1)
    .single();

  if (newsError) {
    console.error(newsError);
    return { data: null, error: newsError };
  }

  // Upload image
  if (form.image) {
    const { error: imageError } = await uploadBanner(
      "add",
      (news as Database["public"]["Tables"]["news"]["Row"]).id,
      form.image
    );
    if (imageError) return { data: null, error: imageError };
  }

  const { data: info, error: infoError } = await supabase
    .from("infos")
    .insert({
      body_th: form.bodyTH,
      body_en: form.bodyEN,
      parent: (news as Database["public"]["Tables"]["news"]["Row"]).id,
    })
    .select("*, parent(*)")
    .limit(1)
    .single();

  if (infoError) {
    console.error(infoError);
    return { data: null, error: infoError };
  }

  return {
    data: info!,
    error: null,
  };
}

export async function updateInfo(
  supabase: DatabaseClient,
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
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["infos"]["Row"], null>
> {
  const { data: updatedInfo, error: updatedInfoError } = await supabase
    .from("infos")
    .update({
      body_th: form.bodyTH,
      body_en: form.bodyEN,
    })
    .match({ id })
    .select("*, parent(*)")
    .limit(1)
    .single();

  if (updatedInfoError) {
    console.error(updatedInfoError);
    return { data: null, error: updatedInfoError };
  }

  const { data: updatedNews, error: updatedNewsError } = await supabase
    .from("news")
    .update({
      title_th: form.titleTH,
      title_en: form.titleEN,
      description_th: form.descTH,
      description_en: form.descEN,
      old_url: form.oldURL,
    })
    .match({
      id: updatedInfo!.parent.id,
    })
    .select("image")
    .limit(1)
    .single();

  if (updatedNewsError) {
    console.error(updatedNewsError);
    return { data: null, error: updatedNewsError };
  }

  if (form.image) {
    const { error: imageError } = await uploadBanner(
      updatedNews!.image ? "edit" : "add",
      id,
      form.image
    );
    if (imageError) return { data: null, error: imageError };
  }

  return { data: updatedInfo!, error: null };
}

export async function deleteInfo(id: number): Promise<BackendReturn> {
  const { data: info, error: infoError } = await supabase
    .from("infos")
    .delete()
    .match({ id })
    .select("parent(id)")
    .limit(1)
    .single();

  if (infoError) {
    console.error(infoError);
    return { error: infoError };
  }

  const { error: newsError } = await supabase
    .from("news")
    .delete()
    .match({
      id: (info as Database["public"]["Tables"]["infos"]["Row"]).parent.id,
    });

  if (newsError) {
    console.error(newsError);
    return { error: newsError };
  }

  return { error: null };
}
