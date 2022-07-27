// Types
import { FormDB } from "@utils/types/database/news";
import { BackendReturn } from "@utils/types/common";
import { FormPage } from "@utils/types/news";

// Converters
import { db2FormPage } from "../database";

// Supabase
import { supabase } from "@utils/supabaseClient";

export async function getForm(
  formID: number
): Promise<BackendReturn<FormPage, null>> {
  const { data, error } = await supabase
    .from<FormDB>("forms")
    .select("id, created_at, due_date, students_done, frequency, parent")
    .match({ id: formID })
    .limit(1)
    .single();

  if (error || !data) {
    console.error(error);
    return { data: null, error };
  }

  return { data: await db2FormPage(data), error: null };
}
