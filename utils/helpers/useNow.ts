import periodNumberAt from "@/utils/helpers/schedule/periodNumberAt";
import schoolSessionStateAt from "@/utils/helpers/schedule/schoolSessionStateAt";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";

/**
 * A hook to get the current time and related information.
 *
 * @param updateFrequency The frequency to update the current time in milliseconds. Defaults to 1000 ms (1 second).
 * @param timezone The timezone to convert the time to. Defaults to the school timezone. Use `null` to use the client’s timezone.
 *
 * @returns An object with the current time and related information.
 */
export default function useNow(
  updateFrequency: number = 1000,
  timezone: string | null = process.env.NEXT_PUBLIC_SCHOOL_TZ,
) {
  const [now, setNow] = useState(
    timezone ? toZonedTime(new Date(), timezone) : new Date(),
  );

  useEffect(() => {
    const interval = setInterval(
      () => setNow(timezone ? toZonedTime(new Date(), timezone) : new Date()),
      updateFrequency,
    );
    return () => clearInterval(interval);
  }, []);

  const periodNumber = periodNumberAt();
  const schoolSessionState = schoolSessionStateAt();

  return {
    /** The current time as a Date object. */
    now,
    /** The current period number as an integer from 1 to 10. */
    periodNumber,
    /** The current school session state. */
    schoolSessionState,
  };
}
