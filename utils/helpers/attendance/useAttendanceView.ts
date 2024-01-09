import getISODateString from "@/utils/helpers/getISODateString";
import useForm from "@/utils/helpers/useForm";
import { YYYYMMDDRegex, YYYYWwwRegex, classRegex } from "@/utils/patterns";
import { getWeek, getYear, isPast, isWeekend, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { replace } from "radash";

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

  const formReturns = useForm<"date" | "classroom">([
    {
      key: "date",
      defaultValue: dateString,
      validate: (value: string) =>
        [
          YYYYMMDDRegex.test(value) &&
            !isWeekend(new Date(value)) &&
            isPast(new Date(value)),
          YYYYWwwRegex.test(value) &&
            Number(value.slice(0, 4)) <= getYear(new Date()) &&
            Number(value.slice(6, 8)) <= getWeek(new Date()),
        ][view],
      required: true,
    },
    {
      key: "classroom",
      defaultValue: type === SelectorType.classroom ? asPath.split("/")[2] : "",
      validate: (value: string) => classRegex.test(value),
      required: type === SelectorType.classroom,
    },
  ]);
  const { form, formValids } = formReturns;

  const parentURL = replace(
    asPath.split("/").slice(0, segmentToCheck),
    form.classroom,
    (segment) => formValids.classroom && classRegex.test(segment),
  ).join("/");

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
          ? form.date
          : formValids.date && getISODateString(parseISO(form.date)),

        // For “This Week” button.
        view === AttendanceView.thisWeek
          ? form.date
          : formValids.date &&
            `${form.date.slice(0, 4)}-W${String(
              getWeek(new Date(form.date)),
            ).padStart(2, "0")}`,
      ][destinationView],
      ,
    ].join("/");
  }

  return {
    view,
    ...formReturns,
    getURLforView,
  };
}
