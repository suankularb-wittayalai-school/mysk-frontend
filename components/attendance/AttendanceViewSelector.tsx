import AttendanceDatePickerDialog from "@/components/attendance/AttendanceDatePickerDialog";
import cn from "@/utils/helpers/cn";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  MaterialIcon,
  SegmentedButton,
} from "@suankularb-components/react";
import { isToday } from "date-fns";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

/**
 * The possible views of the Attendance pages.
 */
export enum AttendanceView {
  date = "date",
  month = "month",
}

/**
 * The type of the View Selector.
 */
export enum SelectorType {
  classroom = "classroom",
  management = "management",
}

/**
 * The view selector for the Attendance pages. Allows the user to select the
 * view and jump to a date.
 *
 * @param children Additional actions to be displayed.
 * @param view The current Attendance View.
 * @param classroom The classroom of the page. Used in constructing URLs.
 * @param date The date of the page.
 */
const AttendanceViewSelector: StylableFC<{
  children?: ReactNode;
  view: AttendanceView;
  classroom: Pick<Classroom, "number">;
  date: string;
}> = ({ children, view, classroom, date, style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "viewSelector" });

  const router = useRouter();

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  function handleChangeView(newView: AttendanceView) {
    // If the view is the same, just refresh the page.
    if (view === newView) {
      router.replace(router.asPath);
      return;
    }

    /**
     * The base URL for constructing the new URL.
     */
    const parentURL = `/classes/${classroom.number}/attendance`;

    // When converting to day view, use the original date from the query if
    // possible, otherwise use the first date of the month.
    if (newView === AttendanceView.date) {
      const formattedDate = [
        // Year and month:
        ...date.split("-").slice(0, 2),
        // Date:
        typeof router.query.original === "string" &&
        /\d{2}/.test(router.query.original)
          ? router.query.original
          : "01",
      ].join("-");
      router.push([parentURL, "date", formattedDate].join("/"));
      return;
    }

    // When converting to month view, use the original date from the query if
    if (newView === AttendanceView.month) {
      const formattedDate = date.split("-").slice(0, 2).join("-");
      router.push(
        [parentURL, "month", formattedDate].join("/") +
          `?original=${date.substring(8)}`,
      );
    }
  }

  return (
    <Actions
      align="left"
      style={style}
      className={cn(
        `!flex-nowrap [&_button_span]:!whitespace-nowrap`,
        // Collapse Buttons on small screens
        `[&>button]:!aspect-square [&>button]:!p-2 [&>button]:sm:!aspect-auto
        [&>button]:sm:!py-2.5 [&>button]:sm:!pl-4 [&>button]:sm:!pr-6
        [&>button_span:not(:empty)]:hidden
        [&>button_span:not(:empty)]:sm:inline`,
        className,
      )}
    >
      <SegmentedButton
        alt={t("view.title")}
        className="!grid grow !grid-cols-2 md:!flex"
      >
        {[AttendanceView.date, AttendanceView.month].map((buttonView) => (
          <Button
            key={buttonView}
            appearance="outlined"
            selected={view === buttonView}
            onClick={() => handleChangeView(buttonView)}
          >
            {t(`view.${buttonView}`)}
          </Button>
        ))}
      </SegmentedButton>

      {/* Spacer */}
      <div aria-hidden className="hidden grow md:block" />

      {/* Additional actions */}
      {children}

      {/* Date picker */}
      <Button
        appearance="tonal"
        icon={<MaterialIcon icon="event" />}
        onClick={() => setDatePickerOpen(true)}
        className={
          !(view === AttendanceView.date && isToday(new Date(date)))
            ? // `&&` is a trick to increase specificity.
              // https://csswizardry.com/2014/07/hacks-for-dealing-with-specificity/#safely-increasing-specificity
              `[&&]:!aspect-auto [&&]:!py-2.5 [&&]:!pl-4 [&&]:!pr-6
              [&_span:not(:empty)]:!inline`
            : undefined
        }
      >
        {t(`action.date.${view}`, { date: new Date(date) })}
      </Button>
      <AttendanceDatePickerDialog
        open={datePickerOpen}
        view={view}
        type={SelectorType.classroom}
        onClose={() => setDatePickerOpen(false)}
        onSubmit={({ date, classroom }) => {
          setDatePickerOpen(false);
          router.push(`/classes/${classroom}/attendance/${view}/${date}`);
        }}
      />
    </Actions>
  );
};

export default AttendanceViewSelector;
