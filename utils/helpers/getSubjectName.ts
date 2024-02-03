// Imports
import getLocaleString from "@/utils/helpers/getLocaleString";
import { LangCode } from "@/utils/types/common";
import { SchedulePeriod } from "@/utils/types/schedule";
import { Subject } from "@/utils/types/subject";

/**
 * Format a Subject Period’s Subject name with the duration in mind.
 *
 * @param duration The length of this Period.
 * @param subject The Subject name object.
 *
 * @returns A formatted Subject name to be shown in a Subject Period.
 */
export function getSubjectName(
  duration: SchedulePeriod["duration"],
  subject: Pick<Subject, "name" | "short_name">,
  locale: LangCode,
) {
  return duration < 2
    ? // If short period, use short name
      subject.short_name[locale] ||
        subject.short_name.th ||
        // If no short name, use name
        subject.name[locale] ||
        subject.name.th
    : // If long period, use name
      getLocaleString(subject.name, locale);
}
