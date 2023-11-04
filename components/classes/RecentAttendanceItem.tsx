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
import { useTranslation } from "next-i18next";
import { useState } from "react";

const RecentAttendanceItem: StylableFC<{
  attendance: AttendanceAtDate;
  classroomID: string;
  teacherID?: string;
  onChange: () => void;
}> = ({ attendance, classroomID, teacherID, onChange, style, className }) => {
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
          return (
            <>
              <Interactive
                key={event}
                onClick={() => setEventToEdit(event)}
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
                  {absenceCount === null
                    ? t("action.addEvent")
                    : t("item.absenceCount", { count: absenceCount })}
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
        onSubmit={() => {
          setEventToEdit(null);
          onChange();
        }}
      />
    </>
  );
};

export default RecentAttendanceItem;
