import getLocaleString from "@/utils/helpers/getLocaleString";
import { LangCode } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";

/**
 * Format a Subject Period’s Subject name with the duration in mind.
 *
 * @param duration The length of this Period.
 * @param subject The Subject name object.
 * @param locale The locale to format the Subject name in.
 *
 * @returns A formatted Subject name to be shown in a Subject Period.
 */
export function formatSubjectPeriodName(
  duration: SchedulePeriod["duration"],
  subject: Pick<Subject, "name" | "short_name">,
  locale: LangCode,
) {
  // Show the short name for a single period, if available.
  if (duration < 2 && subject.short_name)
    return getLocaleString(subject.short_name, locale);
  // Otherwise, show the full name.
  return getLocaleString(subject.name, locale);
}
