import { Student } from "@/utils/types/person";
import { Classroom } from "@/utils/types/classroom";

export enum CheerAttendanceType {
  present = "present",
  late = "late",
  onLeaveWithRemedial = "absent_without_leave",
  onLeaveNoRemedial = "absent_with_leave",
  missing = "deserted",
}

export type CheerAttendanceEvent = "start" | "end";

export type CheerPracticePeriod = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
};

export type CheerAttendanceRecord = {
  id?: string;
  practice_period: CheerPracticePeriod;
  student: Pick<
    Student,
    | "id"
    | "first_name"
    | "middle_name"
    | "last_name"
    | "nickname"
    | "profile"
    | "class_no"
  >;
  presence: CheerAttendanceType | null;
  absence_reason: string | null;
  presence_at_end:
    | CheerAttendanceType.present
    | CheerAttendanceType.missing
    | null;
  disabled: boolean;
};

export type ClassroomCheerAttendance = Pick<
  Classroom,
  "id" | "number" | "main_room" | "class_advisors" | "students"
> & {
  attendances: CheerAttendanceRecord[];
};

export type CheerTallyCount = {
  id: string;
  count: {
    presence: number;
    total: number;
  };
};

export type CheerPracticeSession = CheerPracticePeriod & {
  classrooms: ClassroomCheerAttendance[];
};
