import { Classroom } from "@/utils/types/classroom";
import { Student } from "@/utils/types/person";

export type AttendanceEvent = "homeroom" | "assembly";

export enum AbsenceType {
  late = "late",
  sick = "sick",
  activity = "activity",
  business = "business",
  absent = "absent",
  dropped = "dropped",
  other = "other",
}

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

export type ClassroomAttendance = {
  classroom: Pick<Classroom, "id" | "number">;
  expected_total: number;
  summary: ManagementAttendanceSummary & { covid: number };
  absent_students: Pick<Student, "id" | "profile" | "class_no">[];
  homeroom_content: string | null;
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

export type HomeroomContent = {
  id: string | null;
  date: string;
  homeroom_content: string;
};
