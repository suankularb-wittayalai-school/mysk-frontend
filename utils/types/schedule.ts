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
  startTime: number;
  duration: number;
  content: PeriodContentItem[];
};

export type PeriodContentItem = {
  id?: string;
  start_time: number;
  duration: number;
  subject: Pick<Subject, "id" | "code" | "name">;
  teachers: Teacher[];
  co_teachers?: Teacher[];
  // Physical rooms wherein this Subject is taught (Ex. 1214, 4306)
  rooms?: string[];
  // The classes taking this Subject
  classrooms?: Pick<Classroom, "id" | "number">[];
};
