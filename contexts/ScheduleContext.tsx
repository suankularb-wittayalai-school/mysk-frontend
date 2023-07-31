// External libraries
import { RefObject, createContext } from "react";

// Types
import { UserRole } from "@/utils/types/person";
import { PeriodLocation } from "@/utils/types/schedule";

/**
 * A Context that provides the value and the setter for showing Snackbars.
 */
const ScheduleContext = createContext<{
  role: UserRole;
  teacherID?: string;
  periodWidth: number;
  periodHeight: number;
  additionSite?: PeriodLocation;
  setAdditionSite?: (value?: PeriodLocation) => void;
  constraintsRef?: RefObject<Element>;
}>({
  role: "student",
  periodWidth: 0,
  periodHeight: 0,
  constraintsRef: undefined,
});

export default ScheduleContext;
