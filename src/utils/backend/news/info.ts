// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { InfoDB } from "@utils/types/database/news";
import { dbInfo2News } from "../database";

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
