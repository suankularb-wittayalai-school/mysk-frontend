import getISODateString from "@/utils/helpers/getISODateString";
import { YYYYMMDDRegex, YYYYWwwRegex } from "@/utils/patterns";
import { getWeek, getYear, isPast, isWeekend, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * The possible views of the Attendance pages.
 */
export enum AttendanceView {
  today,
  thisWeek,
}

/**
 * The type of the View Selector.
 */
export enum SelectorType {
  classroom,
  management,
}

export default function useAttendanceView(
  type: SelectorType,
  dateString: string,
) {
  const { asPath } = useRouter();

  /**
   * The path segment to check for the selected {@link view}. The path prior to
   * this segment is the {@link parentURL parent URL}.
   *
   * ---
   *
   * For **`SelectorType.classroom`**, this is the 4th segment.
   *
   * ```plaintext
   * /classes/604/attendance/date/2024-01-01
   *                         ~~~~
   * ```
   *
   * ---
   *
   * For **`SelectorType.management`**, this is the 3rd segment.
   *
   * ```plaintext
   * /manage/attendance/date/2024-01-01
   *                    ~~~~
   * ```
   */
  const segmentToCheck = [4, 3][type];

  /**
   * The selected view of the parent Attendance page.
   */
  const view = {
    date: AttendanceView.today,
    week: AttendanceView.thisWeek,
  }[asPath.split("/")[segmentToCheck]]!;
  const parentURL = asPath.split("/").slice(0, segmentToCheck).join("/");

  const [dateField, setDateField] = useState(dateString);

  /**
   * Whether the date in the date field is valid.
   */
  const dateIsValid = [
    YYYYMMDDRegex.test(dateField) &&
      !isWeekend(new Date(dateField)) &&
      isPast(new Date(dateField)),
    YYYYWwwRegex.test(dateField) &&
      Number(dateField.slice(0, 4)) <= getYear(new Date()) &&
      Number(dateField.slice(6, 8)) <= getWeek(new Date()),
  ][view];

  /**
   * The URL to go to when the user clicks the “Today” or “This Week” button.
   *
   * @param destinationView The view to get the URL for.
   *
   * @returns A relative URL to use in a Link.
   */
  function getURLforView(destinationView: AttendanceView) {
    return [
      parentURL,
      ["date", "week"][destinationView],
      [
        // For “Today” button.
        view === AttendanceView.today
          ? dateField
          : dateIsValid && getISODateString(parseISO(dateField)),

        // For “This Week” button.
        view === AttendanceView.thisWeek
          ? dateField
          : dateIsValid &&
            `${dateField.slice(0, 4)}-W${String(
              getWeek(new Date(dateField)),
            ).padStart(2, "0")}`,
      ][destinationView],
      ,
    ].join("/");
  }

  return {
    view,
    dateField,
    setDateField,
    disabled: !dateIsValid,
    getURLforView,
  };
}
