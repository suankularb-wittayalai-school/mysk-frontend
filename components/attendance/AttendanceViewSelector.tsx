import cn from "@/utils/helpers/cn";
import getISODateString from "@/utils/helpers/getISODateString";
import { YYYYMMDDRegex, YYYYWwwRegex } from "@/utils/patterns";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  MaterialIcon,
  SegmentedButton,
  TextField,
} from "@suankularb-components/react";
import {
  getWeek,
  getYear,
  isFuture,
  isPast,
  isWeekend,
  parse,
  parseISO,
  startOfWeek,
} from "date-fns";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * The possible views of the Attendance pages.
 */
enum AttendanceView {
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

/**
 * The view selector for the Attendance pages. Allows the user to select the
 * view and jump to a date.
 *
 * @param type The type of the View Selector, classroom or management.
 * @param date The date to display in the date field by default.
 */
const AttendanceViewSelector: StylableFC<{
  type: SelectorType;
  date: string;
}> = ({ type, date, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "viewSelector" });

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

  const [dateField, setDateField] = useState(date);
  const dateIsValid = [
    YYYYMMDDRegex.test(dateField) &&
      !isWeekend(new Date(dateField)) &&
      isPast(new Date(dateField)),
    YYYYWwwRegex.test(dateField) &&
      Number(dateField.slice(0, 4)) <= getYear(new Date()) &&
      Number(dateField.slice(6, 8)) <= getWeek(new Date()),
  ][view];

  return (
    <div
      style={style}
      className={cn(
        `grid flex-row gap-4 sm:flex sm:items-center sm:justify-between`,
        className,
      )}
    >
      {/* View selector */}
      <Actions align="left">
        <SegmentedButton alt="View" className="!grid grow grid-cols-2 sm:!flex">
          <Button
            appearance="outlined"
            selected={view === AttendanceView.today}
            disabled={!dateIsValid}
            href={[
              parentURL,
              "date",
              view === AttendanceView.today
                ? dateField
                : dateIsValid && getISODateString(parseISO(dateField)),
            ].join("/")}
            element={Link}
          >
            {t("view.today")}
          </Button>
          <Button
            appearance="outlined"
            selected={view === AttendanceView.thisWeek}
            disabled={!dateIsValid || type === SelectorType.management}
            href={[
              parentURL,
              "week",
              view === AttendanceView.thisWeek
                ? dateField
                : dateIsValid &&
                  `${dateField.slice(0, 4)}-W${String(
                    getWeek(new Date(dateField)),
                  ).padStart(2, "0")}`,
            ].join("/")}
            element={Link}
          >
            {t("view.thisWeek")}
          </Button>
        </SegmentedButton>

        {type === SelectorType.management && (
          <Button
            appearance="filled"
            icon={<MaterialIcon icon="print" />}
            onClick={() => window.print()}
          >
            {t("action.print")}
          </Button>
        )}
      </Actions>

      {/* Go to date */}
      <div className="flex flex-row items-center gap-2">
        <TextField<string>
          appearance="outlined"
          label={t("date")}
          value={dateField}
          onChange={setDateField}
          inputAttr={
            [
              { type: "date", placeholder: "YYYY-MM-DD" },
              { type: "week", placeholder: "YYYY-Www" },
            ][view]
          }
          className="grow sm:w-56"
        />
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="arrow_forward" />}
          alt={t("actions.go")}
          disabled={!dateIsValid}
          href={[parentURL, ["date", "week"][view], dateField].join("/")}
          element={Link}
        />
      </div>
    </div>
  );
};

export default AttendanceViewSelector;
