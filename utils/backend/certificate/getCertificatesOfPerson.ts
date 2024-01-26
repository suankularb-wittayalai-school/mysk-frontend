import logError from "@/utils/helpers/logError";
import { BackendReturn, DatabaseClient } from "@/utils/types/backend";
import { StudentCertificate } from "@/utils/types/certificate";

/**
 * Get all Certificates of a Person.
 *
 * @param supabase The Supabase client.
 * @param personID The Person ID.
 * @param options Options.
 * @param options.year The academic year the Certificates were issued. If not specified, all years will be returned.
 *
 * @returns A Backend Return with an array of Student Certificates.
 */
export default async function getCertificatesOfPerson(
  supabase: DatabaseClient,
  personID: string,
  options?: Partial<{ year: number }>,
): Promise<BackendReturn<StudentCertificate[]>> {
  let query = supabase
    .from("student_certificates")
    .select(
      `id,
      year,
      certificate_type,
      certificate_detail,
      receiving_order_number,
      seat_code,
      students!inner(person_id)`,
    )
    .eq("students.person_id", personID);
  if (options?.year) query = query.eq("year", options.year);

  const { data, error } = await query;

  if (error) {
    logError("getCertificatesOfPerson", error);
    return { data: null, error };
  }
  return { data: data as StudentCertificate[], error: null };
}
