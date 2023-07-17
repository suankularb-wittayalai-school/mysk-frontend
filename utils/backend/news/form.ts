// Types
import { BackendDataReturn } from "@/utils/types/common";
import {
  FormField,
  FormPage,
  FormSubmission,
  NewsItemFormNoDate,
} from "@/utils/types/news";
import { Database } from "@/utils/types/supabase";

// Converters
import { db2FormPage, dbForm2NewsItem } from "@/utils/backend/database";

// Supabase
import { supabase } from "@/utils/supabase-client";

export async function getForms(): Promise<
  BackendDataReturn<NewsItemFormNoDate[]>
> {
  const { data, error } = await supabase
    .from("forms")
    .select("*, parent(*)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  return { data: data.map(dbForm2NewsItem), error: null };
}

export async function getForm(
  formID: number
): Promise<BackendDataReturn<FormPage, null>> {
  const { data, error } = await supabase
    .from("forms")
    .select("*, parent(*)")
    .match({ id: formID })
    .order("id")
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error: error };
  }

  return {
    data: await db2FormPage(data!),
    error: null,
  };
}

export async function getFormSubmissions(
  formID: number,
  personID: number
): Promise<BackendDataReturn<FormSubmission[]>> {
  const { data: submissionIDs, error: submissionsError } = await supabase
    .from("form_submissions")
    .select("id")
    .match({ form: formID, person: personID });

  if (submissionsError) return { data: [], error: submissionsError };

  let submissions: FormSubmission[] = [];

  for (let submissionID of submissionIDs) {
    const { data, error } = await supabase
      .from("form_field_value")
      .select("field(label_th, label_en, type), value")
      .match({ submission: submissionID.id });

    if (error) return { data: [], error };

    submissions = [
      ...submissions,
      data!.map((field) => {
        const question = field.field as unknown as Pick<
          Database["public"]["Tables"]["form_questions"]["Row"],
          "label_th" | "label_en" | "type"
        >;

        return {
          label: {
            th: question.label_th,
            "en-US": question.label_en || undefined,
          },
          type: question.type,
          value: field.value,
        };
      }),
    ];
  }

  return { data: submissions, error: null };
}

export async function sendForm(
  formID: number,
  formAnswer: { id: number; value: string | number | string[] | File | null }[],
  sendAs?: number
): Promise<
  BackendDataReturn<Database["public"]["Tables"]["form_field_value"]["Row"][]>
> {
  // create submission in form_submissions
  const { data, error } = await supabase
    .from("form_submissions")
    .insert({ form: formID, person: sendAs ?? null })
    .select("*")
    .order("id")
    .limit(1)
    .single();

  if (error || !data) {
    console.error(error);
    return { data: [], error };
  }

  // Save answers to form_field_values
  const answers = (
    await Promise.all(
      formAnswer.map((answer) => sendFormAnswer(answer, data.id))
    )
  )
    .map((answer) => answer.data)
    .filter((answer) => answer !== null)
    .flat() as Database["public"]["Tables"]["form_field_value"]["Row"][];

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  return { data: answers, error: null };
}

async function sendFormAnswer(
  formAnswer: { id: number; value: string | number | string[] | File | null },
  submissionID: number
): Promise<
  BackendDataReturn<
    Database["public"]["Tables"]["form_field_value"]["Row"],
    null
  >
> {
  switch (typeof formAnswer.value) {
    // file, or array
    case "object":
      // is file
      if (formAnswer.value instanceof File) {
        // Upload file to Supabase and save value as path
        const { error: uploadingError } = await supabase.storage
          .from("news")
          .upload(
            `form_submissions/${submissionID}/file-${
              formAnswer.id
            }.${formAnswer.value.name.split(".").pop()}`,
            formAnswer.value,
            { cacheControl: "3600", upsert: false }
          );
        if (uploadingError) {
          console.error(uploadingError);
          return { data: null, error: uploadingError };
        }
        // save value as path
        const { data, error } = await supabase
          .from("form_field_value")
          .insert({
            field: formAnswer.id,
            value: `form_submissions/${submissionID}/file-${
              formAnswer.id
            }.${formAnswer.value.name.split(".").pop()}`,
            submission: submissionID,
          })
          .select("*")
          .order("id")
          .limit(1)
          .single();

        if (error) {
          console.error(error);
          return { data: null, error };
        }
        return {
          data: data!,
          error: null,
        };
      }
      // is array
      if (Array.isArray(formAnswer.value)) {
        // save each value as separate answer
        const { data, error } = await supabase
          .from("form_field_value")
          .insert(
            formAnswer.value.map((value) => ({
              field: formAnswer.id,
              value,
              submission: submissionID,
            }))
          )
          .select("*")
          .order("id")
          .limit(1)
          .single();

        if (error) {
          console.error(error);
          return { data: null, error };
        }

        return {
          data: data!,
          error: null,
        };
      }
      break;
    // string, number, boolean
    default:
      // Save value as answer in plain text
      const { data, error } = await supabase
        .from("form_field_value")
        .insert({
          field: formAnswer.id,
          value: formAnswer.value.toString(),
          submission: submissionID,
        })
        .select("*")
        .order("id")
        .limit(1)
        .single();

      if (error) {
        console.error(error);
        return { data: null, error };
      }

      return {
        data: data!,
        error: null,
      };
  }
  return { data: null, error: { message: "invalid field type." } };
}

export async function createForm(form: {
  titleTH: string;
  titleEN: string;
  descTH: string;
  descEN: string;
  image: File | null;
  oldURL: string;
  fields: Omit<FormField, "id">[];
}): Promise<
  BackendDataReturn<Database["public"]["Tables"]["forms"]["Row"], null>
> {
  // TODO: Push created form to Supabase

  return {
    data: null,
    error: { message: "function not implemented." },
  };
}
