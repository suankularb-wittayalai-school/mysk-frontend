import { DocumentSearchFilters } from "@/pages/search/documents/results";
import getISODateString from "@/utils/helpers/getISODateString";
import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";
import { User, UserRole } from "@/utils/types/person";
import { lastDayOfMonth } from "date-fns";

/**
 * Get Documents by Lookup filters.
 *
 * @param supabase The Supabase client to use.
 * @param user The user to get the documents for. Used for permissions.
 * @param filters Filters to be used in the query.
 *
 * @returns A Backend Return with a list of School Documents.
 */
export default async function getDocumentsByLookupFilters(
  supabase: DatabaseClient,
  user: User,
  filters: DocumentSearchFilters,
): Promise<BackendReturn<SchoolDocument[]>> {
  let query = supabase
    .from("school_documents")
    .select("*")
    .eq(
      user.is_admin || user.role === UserRole.teacher
        ? "include_teachers"
        : "include_students",
      true,
    );

  if (filters.types) query = query.in("type", filters.types);
  if (filters.subject) query = query.ilike("subject", `%${filters.subject}%`);
  if (filters.attendTo)
    query = query.ilike("attend_to", `%${filters.attendTo}%`);
  if (filters.month) {
    const firstDay = `${filters.month}-01`;
    query = query
      .gte("date", firstDay)
      .lte("date", getISODateString(lastDayOfMonth(new Date(firstDay))));
  }
  if (filters.code) query = query.eq("code", filters.code);

  const { data, error } = await query
    .order("date", { ascending: false })
    .order("code", { ascending: false })
    .limit(100);

  if (error) {
    logError("getDocumentsByLookupFilters", error);
    return { data: null, error };
  }

  return {
    data: data!.map((document) => ({
      id: document.id,
      code: document.code,
      date: document.date,
      type: <SchoolDocumentType>document.type,
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
