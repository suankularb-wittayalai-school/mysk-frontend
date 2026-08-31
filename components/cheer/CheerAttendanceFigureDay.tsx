import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";
import { Text } from "@suankularb-components/react";
import cn from "@/utils/helpers/cn";
import useTranslation from "next-translate/useTranslation";

/**
 * A column in the Cheer Attendance summary table representing one practice
 * day, labeled with the date.
 *
 * @param children The cells representing the Attendances on this day.
 * @param practiceDates All practice dates shown in the table, used to add a
 * separator between days.
 * @param date The date this column represents.
 */
const CheerAttendanceFigureDay: StylableFC<{
  children: ReactNode;
  practiceDates: string[];
  date: string;
}> = ({ children, practiceDates, date, style, className }) => {
  const { t } = useTranslation("classes/cheer");
  return (
    <>
      {practiceDates.indexOf(date) > 0 && (
        <div role="separator" className="h-[calc(4rem+1px)] px-1">
          <div
            aria-hidden
            className="h-full w-0 border-r-1 border-r-outline-variant"
          />
        </div>
      )}
      <div
        style={style}
        className={cn(`flex w-[40px] flex-col items-center`, className)}
      >
        <Text
          type="label-small"
          className="text-center text-on-surface-variant"
        >
          {t("list.month", { date: new Date(date) })}
          <br />
          {t("list.date", { date: new Date(date) })}
        </Text>
        {children}
      </div>
    </>
  );
};

export default CheerAttendanceFigureDay;
