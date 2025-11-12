import logError from "@/utils/helpers/logError";
import {
  CheerAttendanceRecord,
  CheerPracticePeriod,
  ClassroomCheerAttendance,
} from "@/utils/types/cheer";
import { BackendReturn } from "@/utils/types/backend";
import { SupabaseClient } from "@supabase/supabase-js";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import { MySKClient } from "@/utils/types/fetch";

export default async function getCheerAttendanceOfClass(
  classroom: ClassroomCheerAttendance,
  cheerSession: CheerPracticePeriod,
  supabase: SupabaseClient,
  mysk: MySKClient,
): Promise<BackendReturn<CheerAttendanceRecord[]>> {
  const { data: recordedAttendance, error: recordedError } = await mysk.fetch<
    CheerAttendanceRecord[]
  >(`/v1/attendance/cheer`, {
    query: {
      fetch_level: "compact",
      filter: {
        data: {
          classroom_id: classroom.id,
          practice_period_id: cheerSession.id,
        },
      },
    },
  });
  if (recordedError) {
    logError("getCheerAttendance", recordedError);
    return { data: null, error: recordedError };
  }

  const { data: students, error: studentsError } = await getStudentsOfClass(
    supabase,
    classroom.id,
  );

  if (!students) {
    return { data: null, error: studentsError };
  }

  const attendances: CheerAttendanceRecord[] = students.map((student) => {
    const existing = recordedAttendance?.find(
      (attendance) => attendance.student.id === student.id,
    );

    if (existing) {
      return {
        ...existing,
        practice_period: cheerSession,
        student: student,
      };
    }

    return {
      practice_period: cheerSession,
      student: student,
      presence: null,
      absence_reason: null,
      presence_at_end: null,
      disabled: false,
      condition: null,
    };
  });

  return { data: attendances, error: null };
}
