import { Day } from "date-fns";
import { ClassWName } from "./class";
import { Teacher } from "./person";
import { Subject } from "./subject";

export type StudentSchedule = {
  // FIXME: Schedule class should be required
  // Temporary solution, awaiting response from @JimmyTempest
  class?: ClassWName;
  content: Array<ScheduleRow>;
};

export type ScheduleRow = {
  day: Day;
  content: Array<SchedulePeriod>;
};

export type SchedulePeriod = {
  startTime: number;
  duration: number;
  subject?: {
    name: Subject["name"];
    teacher: Teacher;
    coTeachers?: Teacher[];
  };
  room: string; // which physical room that subject is taught in (Ex. 1214, 4306)
};
