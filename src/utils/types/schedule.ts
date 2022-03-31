import { Teacher } from "./person";
import { Subject } from "./subject";

export type Schedule = {
  content: Array<ScheduleRow>;
};

export type ScheduleRow = {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  content: Array<SchedulePeriod>;
};

export type SchedulePeriod = {
  periodStart: number;
  duration: number;
  subject?: {
    name: Subject["name"];
    teachers: Array<{
      name: Teacher["name"];
    }>;
  };
};
