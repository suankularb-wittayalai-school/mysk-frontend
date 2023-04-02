// constraintsRef

// External libraries
import { Role } from "@/utils/types/person";
import { RefObject, createContext } from "react";

/**
 * A Context that provides the value and the setter for showing Snackbars.
 */
const ScheduleContext = createContext<{
  role: Role;
  constraintsRef?: RefObject<Element>;
}>({ role: "student", constraintsRef: undefined });

export default ScheduleContext;
