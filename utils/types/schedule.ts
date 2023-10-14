import { Classroom } from "@/utils/types/classroom";
import { Teacher } from "@/utils/types/person";
import { Subject } from "@/utils/types/subject";

export type Schedule = {
  class?: Pick<Classroom, "id" | "number">;
  content: ScheduleRow[];
};

export type ScheduleRow = {
  day: Day;
  content: SchedulePeriod[];
};

export type SchedulePeriod = {
  id?: string;
  start_time: number;
  duration: number;
  content: PeriodContentItem[];
};

export type PeriodContentItem = {
  id: string;
  start_time: number;
  duration: number;
  subject: Pick<Subject, "id" | "code" | "name" | "short_name">;
  teachers: Pick<Teacher, "id" | "first_name" | "last_name">[];
  co_teachers?: Pick<Teacher, "id" | "first_name" | "last_name">[];
  // Physical rooms wherein this Subject is taught (Ex. 1214, 4306)
  rooms?: string[];
  // The classes taking this Subject
  classrooms?: Pick<Classroom, "id" | "number">[];
};

export type PeriodLocation = { startTime: number; day: number };
