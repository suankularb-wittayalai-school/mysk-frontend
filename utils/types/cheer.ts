import { Student } from "@/utils/types/person";
import { Classroom } from "@/utils/types/classroom";

export enum CheerAttendanceType {
  present = "present",
  late = "late",
  absentWithRemedial = "absent_with_remedial",
  absentNoRemedial = "absent_no_remedial",
  missing = "missing",
}

export type CheerAttendanceEvent = "start" | "end";

export type CheerPracticePeriod = {
  id: string;
  date: string;
  start_time: number;
  duration: number;
};

export type CheerAttendanceRecord = {
  id: string;
  practice_period: CheerPracticePeriod;
  student: Pick<
    Student,
    "id" | "first_name" | "last_name" | "nickname" | "profile" | "class_no"
  >;
  presence: CheerAttendanceType | null;
  presence_on_end: boolean | null;
};

export type ClassroomcheerAttendance = Pick<
  Classroom,
  "id" | "number" | "main_room" | "class_advisors" | "students"
> & { cheer_attendance: CheerAttendanceRecord[]; count: number | null };

export type CheerPracticeSession = CheerPracticePeriod & {
  classrooms: ClassroomcheerAttendance[];
};
