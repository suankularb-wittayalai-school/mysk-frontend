// Imports
import { Student } from "@/utils/types/person";

export type AttendanceEvent = "homeroom" | "assembly";

export type AbsenceType = "late" | "on_leave" | "absent" | "dropped" | "other";

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

export type AttendanceAtDate = {
  date: string;
  absence_count: Record<AttendanceEvent, number | null>;
};
