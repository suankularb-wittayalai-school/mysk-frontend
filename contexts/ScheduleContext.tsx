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
  onEdit?: () => void;
}>({
  view: UserRole.student,
  periodWidth: 0,
  periodHeight: 0,
  constraintsRef: undefined,
  onEdit: undefined,
});

export default ScheduleContext;
