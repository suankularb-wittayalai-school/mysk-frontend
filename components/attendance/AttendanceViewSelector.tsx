import AttendanceDatePickerDialog from "@/components/attendance/AttendanceDatePickerDialog";
import AttendanceStatisticsDialog from "@/components/attendance/AttendanceStatisticsDialog";
import SnackbarContext from "@/contexts/SnackbarContext";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import useAttendanceView, {
  AttendanceView,
  SelectorType,
} from "@/utils/helpers/attendance/useAttendanceView";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { User, UserRole } from "@/utils/types/person";
import {
  Actions,
  Button,
  MaterialIcon,
  SegmentedButton,
  Snackbar,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { isToday } from "date-fns";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

/**
 * The view selector for the Attendance pages. Allows the user to select the
 * view and jump to a date.
 *
 * @param type The type of the View Selector, classroom or management.
 * @param user The currently logged in user.
 * @param date The date to display in the date field by default.
 */
const AttendanceViewSelector: StylableFC<{
  type: SelectorType;
  user?: User;
  date: string;
}> = ({ type, user, date, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "viewSelector" });

  const { view, form, formOK, formProps, getURLforView } = useAttendanceView(
    type,
    date,
  );

  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const router = useRouter();
  const supabase = useSupabaseClient();

  const { setSnackbar } = useContext(SnackbarContext);

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
              disabled={!formOK}
              href={getURLforView(AttendanceView.today)}
              element={Link}
            >
              {t("view.today")}
            </Button>
            <Button
              appearance="outlined"
              selected={view === AttendanceView.thisWeek}
              disabled={!formOK}
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
      {(user?.role === UserRole.teacher || user?.is_admin) &&
        view === AttendanceView.today && (
          <>
            <Button
              appearance="outlined"
              icon={<MaterialIcon icon="bar_chart" />}
              alt={t("action.statistics")}
              onClick={() => setStatisticsOpen(true)}
              className={collapsibleButtonClassName}
            >
              {t("action.statistics")}
            </Button>
            <AttendanceStatisticsDialog
              open={statisticsOpen}
              date={date}
              onClose={() => setStatisticsOpen(false)}
            />
          </>
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
        view={view}
        formProps={formProps}
        onClose={() => setDateOpen(false)}
        onSubmit={async () => {
          if (!formOK) return;
          setDateOpen(false);
          const { error } = await getClassroomByNumber(
            supabase,
            form.classroom,
          );
          if (error) {
            setSnackbar(<Snackbar>{t("snackbar.classNotFound")}</Snackbar>);
            setDateOpen(true);
          } else router.push(getURLforView(view));
        }}
      />
    </Actions>
  );
};

export default AttendanceViewSelector;
