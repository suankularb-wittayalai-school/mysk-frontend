import { ClassWNumber } from "./class";
import { Teacher } from "./person";
import { Subject } from "./subject";

export type Schedule = {
  class?: ClassWNumber;
  content: ScheduleRow[];
};

export type ScheduleRow = {
  day: Day;
  content: SchedulePeriod[];
};

export type SchedulePeriod = {
  id?: number;
  startTime: number;
  duration: number;
  content: PeriodContentItem[];
};

export type PeriodContentItem = {
  id?: number;
  startTime: number;
  duration: number;
  subject: {
    id: Subject["id"];
    name: Subject["name"];
    code: Subject["code"];
    teachers: Teacher[];
    coTeachers?: Teacher[];
  };
  // Physical room wherein this Subject is taught (Ex. 1214, 4306)
  room?: string;
  // The class taking this Subject
  class?: ClassWNumber;
};

export type PeriodContentItemOptSubj = Omit<PeriodContentItem, "subject"> & {
  subject?: PeriodContentItem["subject"];
};
