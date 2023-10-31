// Imports
import cn from "@/utils/helpers/cn";
import useLocale from "@/utils/helpers/useLocale";
import { AttendanceAtDate, AttendanceEvent } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Card,
  Interactive,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";

/**
 * A list of recent Attendance events grouped into dates for Class Details
 * Card.
 */
const RecentAttendanceList: StylableFC = ({ style, className }) => {
  const locale = useLocale();

  // TODO: Replace with real data
  const attendanceList: AttendanceAtDate[] = [
    {
      date: "2023-10-31",
      absence_count: { assembly: 2, homeroom: null },
    },
    {
      date: "2023-10-30",
      absence_count: { assembly: 0, homeroom: 0 },
    },
    {
      date: "2023-10-27",
      absence_count: { assembly: 1, homeroom: 1 },
    },
    {
      date: "2023-10-26",
      absence_count: { assembly: 0, homeroom: 1 },
    },
    {
      date: "2023-10-25",
      absence_count: { assembly: 1, homeroom: 1 },
    },
  ];

  return (
    <section style={style} className={cn(`space-y-2`, className)}>
      <Text
        type="title-medium"
        element="h4"
        className="rounded-md bg-surface px-3 py-2"
      >
        Attendance
      </Text>
      <div className="-mx-4 !-mb-2 overflow-auto pb-2">
        <ul className="flex w-fit flex-row gap-2 px-4">
          <Card
            appearance="filled"
            stateLayerEffect
            onClick={() => {}}
            className="!grid w-24 place-items-center !bg-primary-container"
          >
            <MaterialIcon icon="add" className="text-on-primary-container" />
          </Card>
          {attendanceList.map((attendance) => (
            <Card
              key={attendance.date}
              appearance="filled"
              className="w-40 gap-1 !bg-surface p-2"
            >
              <Text type="title-medium" element="h5">
                {new Date(attendance.date).toLocaleDateString(locale, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </Text>
              {["assembly", "homeroom"].map((event) => {
                const absenceCount =
                  attendance.absence_count[event as AttendanceEvent];
                return (
                  <Interactive
                    key={event}
                    onClick={() => {}}
                    className={cn(
                      `flex flex-row items-center gap-2 rounded-sm px-2
                      py-1.5`,
                      absenceCount === null
                        ? `-m-[1px] border-1 border-outline-variant
                          text-on-surface-variant state-layer:!bg-primary`
                        : absenceCount === 0
                        ? `bg-surface-2 text-on-surface-variant`
                        : `bg-secondary-container text-on-secondary-container`,
                    )}
                  >
                    {absenceCount === null ? (
                      <MaterialIcon icon="add" />
                    ) : (
                      {
                        assembly: <MaterialIcon icon="emoji_flags" />,
                        homeroom: <MaterialIcon icon="meeting_room" />,
                      }[event]
                    )}
                    <Text type="label-large" className="!font-display">
                      {absenceCount === null ? "Add" : `${absenceCount} absent`}
                    </Text>
                  </Interactive>
                );
              })}
            </Card>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RecentAttendanceList;
