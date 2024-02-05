import AttendanceFigureEvent from "@/components/attendance/AttendanceFigureEvent";
import cn from "@/utils/helpers/cn";
import { AbsenceType } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import { Text } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A legend for the Month Attendance page, explaining the meaning of each
 * symbol in Attendance Figure.
 */
const MonthAttendanceLegend: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("attendance", { keyPrefix: "month.legend" });

  return (
    <ul
      style={style}
      className={cn(
        `mx-4 flex flex-row flex-wrap justify-center gap-x-3 gap-y-1 rounded-md
        border-1 border-outline-variant p-2 pr-3 *:flex *:flex-row
        *:items-center *:gap-2 sm:mx-auto md:border-0 md:p-0 [&_div]:!w-5
        [&_span]:whitespace-nowrap [&_span]:text-on-surface-variant`,
        className,
      )}
    >
      <li>
        <AttendanceFigureEvent
          attendance={{ is_present: true, absence_type: null }}
        />
        <Text type="body-medium">{t("present")}</Text>
      </li>
      <li>
        <AttendanceFigureEvent
          attendance={{ is_present: false, absence_type: AbsenceType.late }}
        />
        <Text type="body-medium">{t("late")}</Text>
      </li>
      <li>
        <AttendanceFigureEvent
          attendance={{ is_present: false, absence_type: AbsenceType.business }}
        />
        <Text type="body-medium">{t("onLeave")}</Text>
      </li>
      <li>
        <AttendanceFigureEvent
          attendance={{ is_present: false, absence_type: AbsenceType.absent }}
        />
        <Text type="body-medium">{t("absent")}</Text>
      </li>
      <li>
        <AttendanceFigureEvent
          attendance={{ is_present: null, absence_type: null }}
        />
        <Text type="body-medium">{t("empty")}</Text>
      </li>
    </ul>
  );
};

export default MonthAttendanceLegend;
