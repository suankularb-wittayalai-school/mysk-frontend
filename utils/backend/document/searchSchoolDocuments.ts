import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";

/**
 * Searches all school documents for matching type and query.
 * @param type `order` (order; คำสั่ง) or `document` (official document; หนังสือออก)
 * @param query A string to search for, will be matched against `code` and `subject`
 * @returns School documents matching type and query
 */
export async function searchSchoolDocuments(
  supabase: DatabaseClient,
  query: string,
  type?: SchoolDocumentType,
): Promise<BackendReturn<SchoolDocument[]>> {
  // Parse the query in case it is in {code}/{year}
  const codeSegments = query.split("/");
  const year = Number(codeSegments[1]) - 543;

  const dbQuery = supabase
    .from("school_documents")
    .select("*")
    .or(
      query.match(/\d+\/\d{4}/)
        ? // If the query is in {code}/{year}, parse it, and only search with
          // the code and year
          `and(code.like.%${codeSegments[0]}%,date.gte."${year}-01-01",date.lte."${year}-12-31"))`
        : // Otherwise, search for code and subject line
          `code.like.%${query}%, subject.like.%${query}%`,
    );

  if (type) {
    dbQuery.eq("type", type);
  }

  dbQuery
    .order("date", { ascending: false })
    .order("code", { ascending: false })
    .limit(100);

  const { data, error } = await dbQuery;

  if (error) {
    logError("searchSchoolDocs", error);
    return { data: null, error };
  }

  return {
    data: data!.map((document) => ({
      id: document.id,
      code: document.code,
      date: document.date,
      type: document.type,
      subject: document.subject,
      document_link: document.document_link,
      organization: null,
      include_parents: document.include_parents,
      include_students: document.include_students,
      include_teachers: document.include_teachers,
    })),
    error: null,
  };
}
