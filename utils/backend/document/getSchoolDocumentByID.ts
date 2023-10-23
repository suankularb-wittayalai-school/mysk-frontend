import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { SchoolDocument, SchoolDocumentType } from "@/utils/types/news";

/**
 * Get a school document by its Supabase ID.
 * @param type `order` (order; คำสั่ง) or `record` (record; บันทึกข้อความ) or `announcement` (announcement; ประกาศ) or `other` (other; อื่นๆ).
 * @param id The Supabse ID of the school document.
 * @returns A school document.
 */
export async function getSchoolDocumentByID(
  supabase: DatabaseClient,
  id: string,
  type?: SchoolDocumentType,
): Promise<BackendReturn<SchoolDocument>> {
  const { data: document, error } = await supabase
    .from("school_documents")
    .select("*")
    .order("date", { ascending: false })
    .eq("id", id)
    .order("id")
    .limit(1)
    .single();

  if (error) {
    // console.error(error);
    logError("getSchoolDocByID", error);
    return { data: null, error };
  }

  return {
    data: {
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
    },
    error: null,
  };
}
