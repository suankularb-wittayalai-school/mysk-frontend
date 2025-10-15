import { CheerAttendanceRecord } from "@/utils/types/cheer";
import { StylableFC } from "@/utils/types/common";
import { Card, CardHeader } from "@suankularb-components/react";
import PersonAvatar from "@/components/common/PersonAvatar";
import cn from "@/utils/helpers/cn";
import tallyCheerAttendances from "@/utils/helpers/attendance/cheer/tallyCheerAttendances";
import CheerAttendanceCountGrid from "./CheerAttendanceCountGrid";
import CheerAttendanceFigureDay from "./CheerAttendanceFigureDay";
import CheerAttendanceFigureEvent from "./CheerAttendanceFigureEvent";
import useLocale from "@/utils/helpers/useLocale";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { sift } from "radash";
import useTranslation from "next-translate/useTranslation";
const StudentCheerAttendanceSummaryCard: StylableFC<{
  student: CheerAttendanceRecord["student"];
  practiceDates: string[];
  attendances: CheerAttendanceRecord[];
}> = ({ student, practiceDates, attendances, style, className }) => {
  const locale = useLocale();
  const count = tallyCheerAttendances(attendances);
  attendances.sort((a, b) => {
    return a.practice_period.date.localeCompare(b.practice_period.date);
  });
  const { t } = useTranslation("common");
  return (
    <Card
      appearance="outlined"
      style={style}
      className={cn(
        `md:!grid md:!grid-cols-[minmax(0,3fr),minmax(0,7fr),minmax(0,2fr)] md:!items-center md:!gap-6 md:!rounded-none md:!border-0 md:!border-b-1 md:!bg-transparent`,
        className,
      )}
    >
      <CardHeader
        title={getLocaleName(locale, student)}
        subtitle={sift([
          t("classNo", { classNo: student.class_no }),
          student.nickname?.th && getLocaleString(student.nickname, locale),
        ]).join(" • ")}
        className={cn(
          `!grid grid-cols-[2.5rem,minmax(0,1fr)] [&>:nth-child(2)>*]:!truncate [&>:nth-child(2)>span]:block`,
        )}
        avatar={
          <PersonAvatar
            {...student}
            expandable
            size={40}
            className="!my-0 !h-12"
          />
        }
      />
      <div className="overflow-auto md:contents">
        <figure
          style={style}
          className={cn(
            `md:h-14w-fit flex h-20 flex-row items-center gap-0.5 px-4 md:w-full md:px-0 md:[&>*:not([role=separator])>*:first-child]:hidden md:[&_[role=separator]]:h-[calc(3rem+1px)]`,
          )}
        >
          {attendances.map((attendance) => (
            <CheerAttendanceFigureDay
              key={attendance.student.id}
              practiceDates={practiceDates}
              date={attendance.practice_period.date}
            >
              <div className="w-full space-y-[1px] overflow-hidden rounded-full">
                <CheerAttendanceFigureEvent attendance={attendance.presence} />
                <CheerAttendanceFigureEvent
                  attendance={attendance.presence_at_end}
                />
              </div>
            </CheerAttendanceFigureDay>
          ))}
        </figure>
      </div>
      <CheerAttendanceCountGrid counts={count} className="p-4 pb-3" />
    </Card>
  );
};

export default StudentCheerAttendanceSummaryCard;
