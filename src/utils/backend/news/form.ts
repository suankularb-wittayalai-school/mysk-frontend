import { supabase } from "@utils/supabaseClient";
import { FormTable } from "@utils/types/database/form";
import { Form } from "@utils/types/form";
import { db2Form } from "../database";

export async function getForm(formId: number): Promise<Form | null> {
  const { data, error } = await supabase
    .from<FormTable>("forms")
    .select("*")
    .match({ id: formId })
    .limit(1)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return await db2Form(data);
}
