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
  periodStart: number;
  duration: number;
  subject?: {
    name: Subject["name"];
    teachers: Array<{
      name: Teacher["name"];
    }>;
  };
};
