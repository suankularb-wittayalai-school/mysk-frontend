// Types
import {
  FormDB,
  FormFieldValueTable,
  FormQuestionsTable,
  FormSubmissionTable,
} from "@utils/types/database/news";
import { BackendReturn } from "@utils/types/common";
import { FormPage, NewsItemFormNoDate } from "@utils/types/news";

// Converters
import { db2FormPage, dbForm2NewsItem } from "../database";

// Supabase
import { supabase } from "@utils/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";

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
  formID: number,
  formAnswer: { id: number; value: string | number | string[] | File | null }[],
  sendAs?: number
): Promise<BackendReturn<FormQuestionsTable[]>> {
  // TODO: Send form data to Supabase
  console.log(formAnswer);
  console.log(sendAs);

  // create submission in form_submissions
  const { data, error } = await supabase
    .from<FormSubmissionTable>("form_submissions")
    .insert({ form: formID, person: sendAs ?? null })
    .single();

  return { data: [], error: null };
}

async function sendFormAnswer(
  formAnswer: { id: number; value: string | number | string[] | File | null },
  submissionID: number
): Promise<BackendReturn<FormFieldValueTable[] | FormFieldValueTable | null>> {
  switch (typeof formAnswer.value) {
    // file, or array
    case "object":
      // is file
      if (formAnswer.value instanceof File) {
        // Upload file to Supabase and save value as path
        const { data: uploadedFile, error: uploadingError } =
          await supabase.storage
            .from("news")
            .upload(
              `form_submissions/${submissionID}/${formAnswer.id}/${formAnswer.value.name}`,
              formAnswer.value
            );
        if (uploadingError || !uploadedFile) {
          console.error(uploadingError);
          return { data: [], error: uploadingError };
        }
        // save value as path
        const { data, error } = await supabase
          .from<FormFieldValueTable>("form_field_values")
          .insert({
            field: formAnswer.id,
            value: `form_submissions/${submissionID}/${formAnswer.id}/${formAnswer.value.name}`,
            submission: submissionID,
          });
        return { data, error: null };
      }
      // is array
      if (Array.isArray(formAnswer.value)) {
        // save each value as separate answer
        const { data, error } = await supabase
          .from<FormFieldValueTable>("form_field_value")
          .insert(
            formAnswer.value.map((value) => ({
              field: formAnswer.id,
              value,
              submission: submissionID,
            }))
          );
        return { data, error: null };
      }
      break;
    // string, number, boolean
    default:
      // Save value as answer in plain text
      const { data, error } = await supabase
        .from<FormFieldValueTable>("form_field_value")
        .insert({
          field: formAnswer.id,
          value: formAnswer.value.toString(),
          submission: submissionID,
        })
        .single();
      return { data, error: null };
  }
  return { data: null, error: null };
}
