import { StylableFC } from "@/utils/types/common";
import cn from "@/utils/helpers/cn";
import CheerAttendanceFigureEvent from "@/components/cheer/CheerAttendanceFigureEvent";
import { Text } from "@suankularb-components/react";
import { CheerAttendanceType } from "@/utils/types/cheer";
import useTranslation from "next-translate/useTranslation";

const CheerAttendanceLegend: StylableFC = ({ style, className }) => {
  const { t } = useTranslation("classes/cheer");
  return (
    <ul
      style={style}
      className={cn(
        `mx-4 flex flex-row flex-wrap justify-center gap-x-3 gap-y-1 rounded-md border-1 border-outline-variant p-2 pr-3 *:flex *:flex-row *:items-center *:gap-2 sm:mx-auto md:border-0 md:p-0 [&_div]:!w-5 [&_span]:whitespace-nowrap [&_span]:text-on-surface-variant`,
        className,
      )}
    >
      <li>
        <CheerAttendanceFigureEvent attendance={CheerAttendanceType.present} />
        <Text type="body-medium">{t("legend.present")}</Text>
      </li>
      <li>
        <CheerAttendanceFigureEvent attendance={CheerAttendanceType.late} />
        <Text type="body-medium">{t("legend.late")}</Text>
      </li>
      <li>
        <CheerAttendanceFigureEvent
          attendance={CheerAttendanceType.absentNoRemedial}
        />
        <Text type="body-medium">{t("legend.absentNoRemedial")}</Text>
      </li>
      <li>
        <CheerAttendanceFigureEvent
          attendance={CheerAttendanceType.absentWithRemedial}
        />
        <Text type="body-medium">{t("legend.absentWithRemedial")}</Text>
      </li>
      <li>
        <CheerAttendanceFigureEvent attendance={CheerAttendanceType.missing} />
        <Text type="body-medium">{t("legend.missing")}</Text>
      </li>
      <li>
        <CheerAttendanceFigureEvent attendance={null} />
        <Text type="body-medium">{t("legend.empty")}</Text>
      </li>
    </ul>
  );
};

export default CheerAttendanceLegend;
