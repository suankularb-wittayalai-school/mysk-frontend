// Imports
import { Student } from "@/utils/types/person";

export type AttendanceEvent = "homeroom" | "assembly";

export type AbsenceType = "late" | "on_leave" | "absent" | "dropped" | "other";

export type StudentAttendance = {
  student: Pick<
    Student,
    "id" | "first_name" | "last_name" | "nickname" | "profile" | "class_no"
  >;
} & {
  [key in AttendanceEvent]: {
    id: string | null;
    is_present: boolean | null;
    absence_type: AbsenceType | null;
    absence_reason: string | null;
  };
};

export type AttendanceAtDate = {
  date: string;
  absence_count: Record<AttendanceEvent, number | null>;
};

export type ManagementAttendanceSummary = {
  presence: number;
  late: number;
  absence: number;
};
