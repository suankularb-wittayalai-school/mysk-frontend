import { Day } from "date-fns";
import { ClassWNumber } from "./class";
import { Teacher } from "./person";
import { Subject } from "./subject";

export type StudentSchedule = {
  id: number;
  content: ScheduleRow[];
};

export type ScheduleRow = {
  day: Day;
  content: SchedulePeriod[];
};

export type SchedulePeriod = {
  startTime: number;
  duration: number;
  subject?: {
    name: Subject["name"];
    teachers: Teacher[];
    coTeachers?: Teacher[];
  };
  class?: ClassWNumber;
  // Physical room wherein this Subject is taught (Ex. 1214, 4306)
  room?: string;
};
