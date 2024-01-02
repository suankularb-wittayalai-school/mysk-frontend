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
} from "@suankularb-components/react";
import { isToday } from "date-fns";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import AttendanceDatePickerDialog from "./AttendanceDatePickerDialog";

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

  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const router = useRouter();

  /**
   * Whether the date picker Button can be collapsed on small screens.
   */
  const canCollapseDateButton =
    view === AttendanceView.today && isToday(new Date(date));

  /**
   * The class name for the collapsible Buttons—Buttons that hide their label
   * on small screens.
   */
  const collapsibleButtonClassName = cn(
    `!aspect-square !p-2 sm:!aspect-auto md:!py-2.5 md:!pl-4 md:!pr-6
    [&_span:not(:empty)]:hidden [&_span:not(:empty)]:md:inline`,
  );

  return (
    <Actions
      style={style}
      className={cn(`!flex-nowrap [&_span]:!whitespace-nowrap`, className)}
    >
      {
        [
          // Show the View Selector only on the page for a Classroom.
          <SegmentedButton
            key="classroom"
            alt={t("view.title")}
            className="!grid grow grid-cols-2 sm:!flex"
          >
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
              disabled={disabled}
              href={getURLforView(AttendanceView.thisWeek)}
              element={Link}
            >
              {t("view.thisWeek")}
            </Button>
          </SegmentedButton>,

          // Show the Print button only on the page for Management.
          <Button
            key="management"
            appearance="filled"
            icon={<MaterialIcon icon="print" />}
            onClick={() => window.print()}
            className="hidden md:!flex"
          >
            {t("action.print")}
          </Button>,
        ][type]
      }

      {/* School-wide statistics */}
      {view === AttendanceView.today && (
        <Button
          appearance="outlined"
          icon={<MaterialIcon icon="bar_chart" />}
          alt={t("action.statistics")}
          onClick={() => setStatisticsOpen(true)}
          className={collapsibleButtonClassName}
        >
          {t("action.statistics")}
        </Button>
      )}

      {/* Date picker */}
      <Button
        appearance="tonal"
        icon={<MaterialIcon icon="event" />}
        alt={t("action.go")}
        onClick={() => setDateOpen(true)}
        className={
          canCollapseDateButton ? collapsibleButtonClassName : undefined
        }
      >
        {
          [
            t("action.date.today", { date: new Date(date) }),
            t("action.date.thisWeek", { week: Number(date.slice(6, 8)) }),
          ][view]
        }
      </Button>
      <AttendanceDatePickerDialog
        open={dateOpen}
        dateField={dateField}
        view={view}
        onClose={() => setDateOpen(false)}
        onDateFieldChange={setDateField}
        onSubmit={() => {
          if (disabled) return;
          setDateOpen(false);
          router.push(getURLforView(view));
        }}
      />
    </Actions>
  );
};

export default AttendanceViewSelector;
