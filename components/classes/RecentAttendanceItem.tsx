// Imports
import AttendanceDialog from "@/components/classes/AttendanceDialog";
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
import { useState } from "react";

const RecentAttendanceItem: StylableFC<{
  attendance: AttendanceAtDate;
  classroomID: string;
  teacherID?: string;
}> = ({ attendance, classroomID, teacherID, style, className }) => {
  const locale = useLocale();
  const [eventToEdit, setEventToEdit] = useState<AttendanceEvent | null>(null);

  return (
    <>
      <Card
        appearance="filled"
        style={style}
        className={cn(`w-40 gap-1 !bg-surface p-2`, className)}
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
            <>
              <Interactive
                key={event}
                onClick={() => setEventToEdit(event as AttendanceEvent)}
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
            </>
          );
        })}
      </Card>

      <AttendanceDialog
        event={eventToEdit!}
        date={new Date(attendance.date)}
        classroomID={classroomID}
        teacherID={teacherID}
        open={eventToEdit !== null}
        onClose={() => setEventToEdit(null)}
      />
    </>
  );
};

export default RecentAttendanceItem;
