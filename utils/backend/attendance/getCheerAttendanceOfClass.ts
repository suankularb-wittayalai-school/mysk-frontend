import logError from "@/utils/helpers/logError";
import {
  CheerAttendanceRecord,
  CheerPracticePeriod,
  ClassroomCheerAttendance,
} from "@/utils/types/cheer";
import { BackendReturn } from "@/utils/types/backend";
import { SupabaseClient } from "@supabase/supabase-js";

export default async function getCheerAttendanceOfClass(
  classroom: ClassroomCheerAttendance,
  period: CheerPracticePeriod,
  supabase: SupabaseClient,
): Promise<BackendReturn<CheerAttendanceRecord[]>> {
  const attendances: CheerAttendanceRecord[] = [];

  for (let student of classroom.classroom.students) {
    const { data, error } = await supabase
      .from("cheer_practice_attendances")
      .select("id, presence, absence_reason, presence_at_end")
      .eq("student_id", student.id)
      .eq("practice_period_id", period.id)
      .limit(1);
    if (error) {
      logError("getCheerAttendanceOfClass", error);
      return { data: null, error: error };
    }
    if (data[0]) {
      let attendance: CheerAttendanceRecord = {
        ...data[0],
        practice_period: period,
        student: student,
      };
      attendances.push(attendance);
    } else {
      attendances.push({
        practice_period: period,
        student: student,
        presence: null,
        absence_reason: null,
        presence_at_end: null,
      });
    }
  }
  return { data: attendances, error: null };
}
