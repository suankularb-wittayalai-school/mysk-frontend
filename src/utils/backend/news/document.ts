// External libraries
import { previousMonday } from "date-fns";

// Types
import { BackendDataReturn } from "@utils/types/common";
import {
  NewSchoolDocumentCount,
  SchoolDocument,
  SchoolDocumentType,
} from "@utils/types/news";
import { supabase } from "@utils/supabase-client";
import { db2SchoolDocument } from "../database";

// Constants
// Number of documents displayed per page
const docsPerPage = 50;

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
  const { data, error } = await supabase
    .from("school_documents")
    .select("*")
    .match({ type })
    .or(`code.like.%${query}%, subject.like.%${query}%`);

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
 * Fetches all school documents of a type.
 * @param type
 * `order` (order; คำสั่ง) or `document` (official document; หนังสือออก)
 * @returns All school documents of a type
 */
export async function getSchoolDocs(
  type: SchoolDocumentType,
  page: number
): Promise<BackendDataReturn<SchoolDocument[]>> {
  const { data, error } = await supabase
    .from("school_documents")
    .select("*")
    .range((page - 1) * docsPerPage, page * docsPerPage)
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
 * Finds how many pages are required to display all school documents of a type.
 * @param type
 * `order` (order; คำสั่ง) or `document` (official document; หนังสือออก)
 * @returns Number of pages
 */
export async function getNoOfSchoolDocsPages(
  type: SchoolDocumentType
): Promise<BackendDataReturn<number, 1>> {
  const { count, error } = await supabase
    .from("school_documents")
    .select("id", { count: "estimated" })
    .match({ type });

  if (error) {
    console.error(error);
    return { data: 1, error };
  }

  const calculatedNoPages = Math.ceil(count! / docsPerPage);
  const cappedNoPages = calculatedNoPages < 1 ? 1 : calculatedNoPages;

  return { data: cappedNoPages, error: null };
}
