// Imports
import { Student } from "@/utils/types/person";

// Note:
// I don’t actually know what the end goal of collecting attendance is, as in
// what way the data is going to be represented in the UI and who is going to
// be using it, so here are some generic types.

export type AttendanceEvent = "homeroom" | "assembly";

export type AbsenceType = "sick" | "business" | "activity" | "other";

export type StudentAttendance = {
  id: string;
  student: Pick<
    Student,
    "id" | "first_name" | "last_name" | "nickname" | "class_no"
  >;
  is_present: boolean;
  attendance_event: AttendanceEvent;
  absence_type: AbsenceType | null;
  absence_reason: string | null;
};
