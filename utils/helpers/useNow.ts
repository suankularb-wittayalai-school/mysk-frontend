import periodNumberAt from "@/utils/helpers/schedule/periodNumberAt";
import schoolSessionStateAt from "@/utils/helpers/schedule/schoolSessionStateAt";
import { useEffect, useState } from "react";

/**
 * A hook to get the current time and related information.
 * @param updateFrequency The frequency to update the current time in milliseconds. Defaults to 1000 ms (1 second).
 * @returns An object with the current time and related information.
 */
export default function useNow(updateFrequency: number = 1000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), updateFrequency);
    return () => clearInterval(interval);
  }, []);

  const periodNumber = periodNumberAt(now);
  const schoolSessionState = schoolSessionStateAt(now);

  return {
    /** The current time as a Date object. */
    now,
    /** The current period number as an integer from 1 to 10. */
    periodNumber,
    /** The current school session state. */
    schoolSessionState,
  };
}
