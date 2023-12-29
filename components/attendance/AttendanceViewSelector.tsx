import useAttendanceView, {
  AttendanceView,
  SelectorType,
} from "@/utils/helpers/attendance/useAttendanceView";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  MaterialIcon,
  SegmentedButton,
  TextField,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

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
  const { view, dateField, setDateField, disabled, getURLforView } =
    useAttendanceView(type, date);

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
            disabled={disabled}
            href={getURLforView(AttendanceView.today)}
            element={Link}
          >
            {t("view.today")}
          </Button>
          <Button
            appearance="outlined"
            selected={view === AttendanceView.thisWeek}
            disabled={disabled || type === SelectorType.management}
            href={getURLforView(AttendanceView.thisWeek)}
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
          disabled={disabled}
          href={getURLforView(view)}
          element={Link}
        />
      </div>
    </div>
  );
};

export default AttendanceViewSelector;
