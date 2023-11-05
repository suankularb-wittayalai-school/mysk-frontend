// Imports
import AttendanceDialog from "@/components/classes/AttendanceDialog";
import cn from "@/utils/helpers/cn";
import { AttendanceAtDate, AttendanceEvent } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Card,
  Interactive,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useState } from "react";

/**
 * A day of Attendance for Class Details Card.
 *
 * @param attendance The Attendance At Date (a summary of absence at assembly and homeroom) data for the day.
 * @param classroomID The ID of the Classroom the Attendance belongs to.
 * @param teacherID The ID of the Teacher viewing the Attendance.
 * @param isOwnClass Whether the user is viewing their Classroom.
 * @param onChange A callback function to call when the Attendance is changed. Should refresh the data.
 */
const RecentAttendanceItem: StylableFC<{
  attendance: AttendanceAtDate;
  classroomID: string;
  teacherID?: string;
  isOwnClass?: boolean;
  onChange: () => void;
}> = ({
  attendance,
  classroomID,
  teacherID,
  isOwnClass,
  onChange,
  style,
  className,
}) => {
  const { t } = useTranslation("classes", {
    keyPrefix: "detail.attendance",
  });

  const [eventToEdit, setEventToEdit] = useState<AttendanceEvent | null>(null);

  return (
    <>
      <Card
        appearance="filled"
        style={style}
        className={cn(`w-40 gap-1 !bg-surface p-2`, className)}
      >
        <Text type="title-medium" element="h5">
          {t("item.title", { date: new Date(attendance.date) })}
        </Text>
        {(["assembly", "homeroom"] as AttendanceEvent[]).map((event) => {
          const absenceCount = attendance.absence_count[event];
          const isInteractive =
            (isOwnClass && teacherID && absenceCount === null) ||
            absenceCount !== null;
          return (
            <Interactive
              key={event}
              stateLayerEffect={isInteractive}
              rippleEffect={isInteractive}
              onClick={() => {
                if (!isInteractive) return;
                va.track("View Attendance", {
                  location: "Classes",
                  role: teacherID ? "Teacher" : "Student",
                  isOwnClass: isOwnClass === true,
                });
                setEventToEdit(event);
              }}
              element={isInteractive ? "button" : "div"}
              className={cn(
                `flex flex-row items-center gap-2 rounded-sm px-2
                  py-1.5`,
                absenceCount === null
                  ? `-m-[1px] border-1 border-outline-variant
                    text-on-surface-variant`
                  : absenceCount === 0
                  ? `bg-surface-2 text-on-surface-variant`
                  : `bg-secondary-container text-on-secondary-container`,
                teacherID && absenceCount === null && `state-layer:!bg-primary`,
              )}
            >
              {isOwnClass && teacherID && absenceCount === null ? (
                <MaterialIcon icon="add" />
              ) : (
                {
                  assembly: <MaterialIcon icon="emoji_flags" />,
                  homeroom: <MaterialIcon icon="meeting_room" />,
                }[event]
              )}
              <Text type="label-large" className="!font-display">
                {absenceCount === null
                  ? isOwnClass && teacherID
                    ? t("action.addEvent")
                    : t("item.noData")
                  : t("item.absenceCount", { count: absenceCount })}
              </Text>
            </Interactive>
          );
        })}
      </Card>

      {(["assembly", "homeroom"] as AttendanceEvent[]).map((event) => (
        <AttendanceDialog
          key={event}
          event={event}
          date={new Date(attendance.date)}
          classroomID={classroomID}
          teacherID={teacherID}
          editable={isOwnClass && teacherID !== undefined}
          open={eventToEdit === event}
          onClose={() => setEventToEdit(null)}
          onSubmit={() => {
            setEventToEdit(null);
            onChange();
          }}
        />
      ))}
    </>
  );
};

export default RecentAttendanceItem;
