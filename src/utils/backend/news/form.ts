// Types
import { FormDB, FormQuestionsTable } from "@utils/types/database/news";
import { BackendReturn } from "@utils/types/common";
import { FormPage, NewsItemFormNoDate } from "@utils/types/news";

// Converters
import { db2FormPage, dbForm2NewsItem } from "../database";

// Supabase
import { supabase } from "@utils/supabaseClient";

export async function getForms(): Promise<BackendReturn<NewsItemFormNoDate[]>> {
  const { data, error } = await supabase
    .from<FormDB>("forms")
    .select(
      "id, created_at, due_date, students_done, frequency, parent:news(title_th, title_en, description_th, description_en, image, old_url)"
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  return { data: data.map(dbForm2NewsItem), error: null };
}

export async function getForm(
  formID: number
): Promise<BackendReturn<FormPage, null>> {
  const { data, error } = await supabase
    .from<FormDB>("forms")
    .select(
      "id, created_at, due_date, students_done, frequency, parent:news(title_th, title_en, description_th, description_en, image, old_url)"
    )
    .match({ id: formID })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error: error };
  }

  return { data: await db2FormPage(data as FormDB), error: null };
}

export async function sendForm(
  form: { id: number; value: string | number | string[] | File | null }[],
  sendAs?: number
): Promise<BackendReturn<FormQuestionsTable[]>> {
  console.log(form);
  // TODO: Send form data to Supabase
  console.log(sendAs);

  return { data: [], error: null };
}
