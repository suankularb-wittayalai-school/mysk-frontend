// Imports
import { RefObject, createContext } from "react";
import { PeriodLocation } from "@/utils/types/schedule";

/**
 * A Context that provides information about a Schedule.
 */
const ScheduleContext = createContext<{
  view: "student" | "teacher";
  editable?: boolean;
  teacherID?: string;
  periodWidth: number;
  periodHeight: number;
  additionSite?: PeriodLocation;
  setAdditionSite?: (value?: PeriodLocation) => void;
  constraintsRef?: RefObject<Element>;
}>({
  view: "student",
  periodWidth: 0,
  periodHeight: 0,
  constraintsRef: undefined,
});

export default ScheduleContext;
