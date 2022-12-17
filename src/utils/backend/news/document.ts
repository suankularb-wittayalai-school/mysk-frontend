// Types
import { BackendDataReturn } from "@utils/types/common";
import {
  NewSchoolDocumentCount,
  SchoolDocument,
  SchoolDocumentType,
} from "@utils/types/news";

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
  console.error("function not implemented.");
  return {
    data: { order: 0, document: 0 },
    error: { message: "function not implemented." },
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
): Promise<BackendDataReturn<SchoolDocument>> {
  console.error("function not implemented.");
  return { data: [], error: { message: "function not implemented." } };
}

/**
 * Fetches all school documents of a type.
 * @param type
 * `order` (order; คำสั่ง) or `document` (official document; หนังสือออก)
 * @returns All school documents of a type
 */
export async function getSchoolDocs(
  type: SchoolDocumentType
): Promise<BackendDataReturn<SchoolDocument>> {
  console.error("function not implemented.");
  return { data: [], error: { message: "function not implemented." } };
}

/**
 * Finds how many pages are required to display all school documents of a type.
 * @param type
 * `order` (order; คำสั่ง) or `document` (official document; หนังสือออก)
 * @returns Number of pages
 */
export async function getNoOfSchoolDocsPages(
  type: SchoolDocumentType
): Promise<BackendDataReturn<number, null>> {
  const docsPerPage = 50;
  // TODO: Get numbers of school documents pages (divide total number of school
  // documents by number of orders per page)
  console.error("function not implemented.");

  return { data: 3, error: null };
}
