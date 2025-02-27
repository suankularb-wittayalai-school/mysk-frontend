import logError from "@/utils/helpers/logError";
import { DatabaseClient } from "@/utils/types/backend";
import { CeremonyConfirmationStatus } from "@/utils/types/certificate";

export default async function updateCeremonyConfirmation(
  supabase: DatabaseClient,
  personID: string,
  year: number,
  confirmationStatus: CeremonyConfirmationStatus,
) {
  const { data: studentID } = await supabase
    .from("student_certificates")
    .select(`student_id, students!inner(person_id)`)
    .eq("students.person_id", personID)
    .eq("year", year)
    .limit(1);
  if (studentID !== null) {
    let query = supabase
      .from("student_certificates")
      .update({ rsvp_status: confirmationStatus })
      .eq("student_id", studentID[0].student_id)
      .eq("year", year);

    const { error } = await query;

    if (error) {
      logError("updateCeremonyConfirmation", error);
    }
  }
}
