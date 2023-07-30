import { logError } from "@/utils/helpers/debug";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";
import { UserRole } from "@/utils/types/person";

/**
 * Fetches the 100 most recent school documents of a type.
 * @param type `order` (order; คำสั่ง) or `document` (official document; หนังสือออก).
 * @returns 100 school documents of a type.
 */
export async function getSchoolDocuments(
  supabase: DatabaseClient,
  role: UserRole,
  type?: SchoolDocumentType,
): Promise<BackendReturn<SchoolDocument[]>> {
  const query = supabase
    .from("school_documents")
    .select("*")
    .match({
      ...(role === "teacher"
        ? { include_teachers: true }
        : { include_students: true }),
    })
    .order("date", { ascending: false })
    .order("code", { ascending: false })
    .limit(100);

  if (type) {
    query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    logError("getSchoolDocs", error);
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
