import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { User } from "@/utils/types/person";
import {
  Actions,
  Button,
  MaterialIcon,
  SegmentedButton,
} from "@suankularb-components/react";
import { isToday } from "date-fns";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import AttendanceDatePickerDialog from "./AttendanceDatePickerDialog";

/**
 * The possible views of the Attendance pages.
 */
export enum AttendanceView {
  day,
  month,
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
 */
const AttendanceViewSelector: StylableFC<{
  children?: ReactNode;
  view: AttendanceView;
  classroom: Pick<Classroom, "number">;
  user?: User;
  date: string;
}> = ({ children, view, classroom, user, date, style, className }) => {
  const locale = useLocale();

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
    if (newView === AttendanceView.day) {
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
        `!flex-nowrap [&>button_span]:!whitespace-nowrap`,
        // Collapse Buttons on small screens
        `[&>button]:!aspect-square [&>button]:!p-2 [&>button]:sm:!aspect-auto
        [&>button]:sm:!py-2.5 [&>button]:sm:!pl-4 [&>button]:sm:!pr-6
        [&>button_span:not(:empty)]:hidden
        [&>button_span:not(:empty)]:sm:inline`,
        className,
      )}
    >
      <SegmentedButton
        alt="Choose scope…"
        className="!grid grow !grid-cols-2 md:!flex"
      >
        <Button
          appearance="outlined"
          selected={view === AttendanceView.day}
          onClick={() => handleChangeView(AttendanceView.day)}
        >
          Daily
        </Button>
        <Button
          appearance="outlined"
          selected={view === AttendanceView.month}
          onClick={() => handleChangeView(AttendanceView.month)}
        >
          Monthly
        </Button>
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
          !(view === AttendanceView.day && isToday(new Date(date)))
            ? // `&&` is a trick to increase specificity.
              // https://csswizardry.com/2014/07/hacks-for-dealing-with-specificity/#safely-increasing-specificity
              `[&&]:!aspect-auto [&&]:!py-2.5 [&&]:!pl-4 [&&]:!pr-6
              [&_span:not(:empty)]:!inline`
            : undefined
        }
      >
        {new Date(date).toLocaleDateString(
          locale,
          view === AttendanceView.day
            ? { month: "short", day: "numeric" }
            : { month: "short", year: "2-digit" },
        )}
      </Button>
      <AttendanceDatePickerDialog
        open={datePickerOpen}
        view={view}
        type={SelectorType.classroom}
        onClose={() => setDatePickerOpen(false)}
        onSubmit={({ date, classroom }) => {
          setDatePickerOpen(false);
          router.push(
            `/classes/${classroom}/attendance/${["date", "month"][view]}/${date}`,
          );
        }}
      />
    </Actions>
  );
};

export default AttendanceViewSelector;
