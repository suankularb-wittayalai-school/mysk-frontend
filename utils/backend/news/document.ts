// External libraries
import { previousMonday } from "date-fns";

// Types
import { BackendDataReturn } from "@/utils/types/common";
import {
  NewSchoolDocumentCount,
  SchoolDocument,
  SchoolDocumentType,
} from "@/utils/types/news";
import { supabase } from "@/utils/supabase-client";

// Converters
import { db2SchoolDocument } from "@/utils/backend/database";

// Functions
/**
 * Fetches the number of new orders and documents dated within the week (from
 * Monday).
 * @returns
 * An object with number of new orders (key `order`) and documents (key
 * `document`)
 */
export async function getNewSchoolDocumentCount(): Promise<
  BackendDataReturn<NewSchoolDocumentCount, { order: 0; document: 0 }>
> {
  const lastMonday = previousMonday(new Date()).toISOString();

  const { count: orderCount, error: orderError } = await supabase
    .from("school_documents")
    .select("id", { count: "exact" })
    .match({ type: "order" })
    .gt("date", lastMonday);
  if (orderError) {
    console.error(orderError);
    return { data: { order: 0, document: 0 }, error: orderError };
  }

  const { count: documentCount, error: documentError } = await supabase
    .from("school_documents")
    .select("id", { count: "exact" })
    .match({ type: "document" })
    .gt("date", lastMonday);
  if (documentError) {
    console.error(documentError);
    return { data: { order: 0, document: 0 }, error: documentError };
  }

  return {
    data: { order: orderCount!, document: documentCount! },
    error: null,
  };
}

/**
 * Searches all school documents for matching type and query.
 * @param type
 * `order` (order; คำสั่ง) or `document` (official document; หนังสือออก)
 * @param query
 * A string to search for, will be matched against `code` and `subject`
 * @returns School documents matching type and query
 */
export async function searchSchoolDocs(
  type: SchoolDocumentType,
  query: string
): Promise<BackendDataReturn<SchoolDocument[]>> {
  // Parse the query in case it is in {code}/{year}
  const codeSegments = query.split("/");
  const year = Number(codeSegments[1]) - 543;

  const { data, error } = await supabase
    .from("school_documents")
    .select("*")
    .match({ type })
    .or(
      query.match(/\d+\/\d{4}/)
        ? // If the query is in {code}/{year}, parse it, and only search with the code and year
          `and(code.like.%${codeSegments[0]}%,date.gte."${year}-01-01",date.lte."${year}-12-31"))`
        : // Otherwise, search for code and subject line
          `code.like.%${query}%, subject.like.%${query}%`
    );

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: data!.map((document) => db2SchoolDocument(document)),
    error: null,
  };
}

/**
 * Fetches the 100 most recent school documents of a type.
 * @param type `order` (order; คำสั่ง) or `document` (official document; หนังสือออก).
 * @returns 100 school documents of a type.
 */
export async function getSchoolDocs(
  type: SchoolDocumentType
): Promise<BackendDataReturn<SchoolDocument[]>> {
  const { data, error } = await supabase
    .from("school_documents")
    .select("*")
    .order("date", { ascending: false })
    .limit(100)
    .match({ type });

  if (error) {
    console.error(error);
    return { data: [], error };
  }

  return {
    data: data!.map((document) => db2SchoolDocument(document)),
    error: null,
  };
}

/**
 * Get a school document by its Supabase ID.
 * @param type `order` (order; คำสั่ง) or `document` (official document; หนังสือออก).
 * @param id The Supabse ID of the school document.
 * @returns A school document.
 */
export async function getSchoolDocsByID(
  type: SchoolDocumentType,
  id: number
): Promise<BackendDataReturn<SchoolDocument, null>> {
  const { data, error } = await supabase
    .from("school_documents")
    .select("*")
    .order("date", { ascending: false })
    .match({ id, type })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return {
    data: db2SchoolDocument(data),
    error: null,
  };
}
