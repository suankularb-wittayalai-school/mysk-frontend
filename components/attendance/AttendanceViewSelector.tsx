import useAttendanceView, {
  AttendanceView,
  SelectorType,
} from "@/utils/helpers/attendance/useAttendanceView";
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
  MaterialIcon,
  SegmentedButton,
  TextField,
} from "@suankularb-components/react";
import { isToday, parseISO } from "date-fns";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useState } from "react";

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
  const locale = useLocale();
  const { t } = useTranslation("attendance", { keyPrefix: "viewSelector" });
  const { view, dateField, setDateField, disabled, getURLforView } =
    useAttendanceView(type, date);

  const [dateOpen, setDateOpen] = useState(false);

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
        <SegmentedButton
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

        {/* Go to date (mobile) */}
        <Button
          appearance="tonal"
          icon={<MaterialIcon icon="event" />}
          alt={t("action.go")}
          onClick={() => setDateOpen(true)}
          className="sm:!hidden"
        >
          {(() => {
            const parsedDate =
              view === AttendanceView.today
                ? new Date(date)
                : new Date(parseISO(date));
            if (!isToday(parsedDate) || view === AttendanceView.thisWeek)
              return new Date(parsedDate).toLocaleDateString(locale, {
                month: "short",
                day: "numeric",
              });
          })()}
        </Button>

        {/* Date picker dialog */}
        <Dialog open={dateOpen} width={320} onClose={() => setDateOpen(false)}>
          <DialogHeader desc={t("dialog.date.desc")} />
          <div className="mx-6 mt-6">
            <TextField<string>
              appearance="outlined"
              label={t("dialog.date.label")}
              value={dateField}
              onChange={setDateField}
              inputAttr={
                [
                  { type: "date", placeholder: "YYYY-MM-DD" },
                  { type: "week", placeholder: "YYYY-Www" },
                ][view]
              }
            />
          </div>
          <Actions>
            <Button appearance="text" onClick={() => setDateOpen(false)}>
              {t("dialog.date.action.cancel")}
            </Button>
            <Button
              appearance="text"
              onClick={() => !disabled && setDateOpen(false)}
              href={disabled ? undefined : getURLforView(view)}
              element={disabled ? "button" : Link}
            >
              {t("dialog.date.action.go")}
            </Button>
          </Actions>
        </Dialog>
      </Actions>

      {/* Go to date (desktop) */}
      <div className="hidden flex-row items-center gap-2 sm:flex">
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
          alt={t("action.go")}
          disabled={disabled}
          href={getURLforView(view)}
          element={Link}
        />
      </div>
    </div>
  );
};

export default AttendanceViewSelector;
