// Imports
import { UserRole } from "@/utils/types/person";
import { PeriodLocation } from "@/utils/types/schedule";
import { RefObject, createContext } from "react";

/**
 * A Context that provides information about a Schedule.
 */
const ScheduleContext = createContext<{
  view: UserRole;
  editable?: boolean;
  teacherID?: string;
  periodWidth: number;
  periodHeight: number;
  additionSite?: PeriodLocation;
  setAdditionSite?: (value?: PeriodLocation) => void;
  constraintsRef?: RefObject<Element>;
}>({
  view: UserRole.student,
  periodWidth: 0,
  periodHeight: 0,
  constraintsRef: undefined,
});

export default ScheduleContext;
