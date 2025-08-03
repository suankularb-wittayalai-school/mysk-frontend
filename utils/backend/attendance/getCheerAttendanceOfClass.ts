import logError from "@/utils/helpers/logError";
import {
  CheerAttendanceRecord,
  CheerPracticePeriod,
  CheerPracticeSession,
  ClassroomCheerAttendance,
} from "@/utils/types/cheer";
import { MySKClient } from "@/utils/types/fetch";
import getClassroomByID from "@/utils/backend/classroom/getClassroomByID";
import { pick } from "radash";
import { getStudentByID } from "@/utils/backend/person/getStudentByID";
import { Student } from "@/utils/types/person";
import { BackendReturn } from "@/utils/types/backend";
import { SupabaseClient } from "@supabase/supabase-js";

export default async function getCheerAttendanceOfClass(
  period_id: string,
  classroom_id: string,
  mysk: MySKClient,
  supabase: SupabaseClient,
): Promise<BackendReturn<CheerAttendanceRecord[]>> {
  const { data, error: studentsError } = await mysk.fetch<CheerPracticeSession>(
    `/v1/attendance/cheer/periods/${period_id}`,
    { query: { fetch_level: "detailed", descendant_fetch_level: "compact" } },
  );
  if (studentsError) {
    logError("getCheerAttendanceOfClass", studentsError);
    return { data: null, error: studentsError };;
  }

  function pickStudentDetail(student: Student) {
    return pick(student, [
      "id",
      "first_name",
      "last_name",
      "nickname",
      "profile",
      "class_no",
    ]);
  }
  const practicePeriod: CheerPracticePeriod = pick(data, [
    "id",
    "date",
    "start_time",
    "duration",
  ]);
  let classroom: ClassroomCheerAttendance = data.classrooms.filter(
    (classroom) => classroom.classroom.id === classroom_id,
  )[0];
  const { data: classroomDetail, error: classroomDetailError } = await getClassroomByID(
    supabase,
    classroom.classroom.id,
    { includeStudents: true },
  );
  if (!classroomDetail) return { data: null, error: classroomDetailError };
  classroom.classroom = pick(classroomDetail, [
    "id",
    "number",
    "main_room",
    "class_advisors",
    "students",
  ]);

  const attendances: CheerAttendanceRecord[] = [];

  for (let student of classroom.classroom.students) {
    let attendance = classroom.attendances.find(
      (attendance) => attendance.student.id === student.id,
    );

    const { data: studentDetail, error: studentDetailError } = await getStudentByID(
      supabase,
      mysk,
      student.id,
      {
        detailed: true,
        includeCertificates: false,
        includeContacts: false,
      },
    );
    if (!studentDetail) return { data: null, error: studentDetailError };
    if (attendance) {
      attendance.student = pickStudentDetail(studentDetail);
      attendance.practice_period = practicePeriod;
      attendances.push(attendance);
    } else {
      attendances.push({
        practice_period: practicePeriod,
        student: pickStudentDetail(studentDetail),
        presence: null,
        absence_reason: null,
        presence_at_end: null,
      });
    }
  }
  classroom.attendances = attendances;
  return { data: attendances, error: null };;
}
