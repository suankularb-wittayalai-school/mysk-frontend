import cn from "@/utils/helpers/cn";
import getISODateString from "@/utils/helpers/getISODateString";
import { YYYYMMDDRegex, YYYYWwwRegex } from "@/utils/patterns";
import { StylableFC } from "@/utils/types/common";
import {
  Button,
  MaterialIcon,
  SegmentedButton,
  TextField,
} from "@suankularb-components/react";
import { getWeek, parseISO } from "date-fns";
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
 * The view selector for the Attendance pages. Allows the user to select the
 * view and jump to a date.
 *
 * @param date The date to display in the date field by default.
 */
const AttendanceViewSelector: StylableFC<{
  date: string;
}> = ({ date, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "viewSelector" });

  const { asPath } = useRouter();

  /**
   * The selected view of the parent Attendance page. This is determined by the
   * 4th path segment of the URL.
   *
   * ```plaintext
   * /classes/604/attendance/date/2024-01-01
   *                         ~~~~
   * ```
   */
  const view = {
    date: AttendanceView.today,
    week: AttendanceView.thisWeek,
  }[asPath.split("/")[4]]!;
  const parentURL = asPath.split("/").slice(0, 4).join("/");

  const [dateField, setDateField] = useState(date);
  const dateIsValid = [
    YYYYMMDDRegex.test(dateField),
    YYYYWwwRegex.test(dateField),
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
      <div className="space-y-2">
        <SegmentedButton alt="View" className="!grid grid-cols-2 sm:!flex">
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
            disabled={!dateIsValid}
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
      </div>

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