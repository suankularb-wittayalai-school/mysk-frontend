import AttendanceFigureEvent from "@/components/attendance/AttendanceFigureEvent";
import { StudentAttendance } from "@/utils/types/attendance";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
  FullscreenDialog,
  List,
  ListItem,
  ListItemContent,
  MaterialIcon,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

/**
 * A Dialog for displaying the absence history of a Student.
 *
 * @param open Whether the Dialog is open and shown.
 * @param attendances The entirety of the Student’s Attendance records.
 * @param classroom The Classroom the Student is in.
 * @param onClose Triggered when the Dialog is closed.
 */
const AbsenceHistoryDialog: StylableFC<{
  open?: boolean;
  attendances: (Omit<StudentAttendance, "student"> & { date: string })[];
  classroom?: Pick<Classroom, "number">;
  onClose: () => void;
}> = ({ open, attendances, classroom, onClose, style, className }) => {
  const { t } = useTranslation("lookup", {
    keyPrefix: "students.detail.attendance.dialog",
  });

  const absences = attendances.filter(
    (attendance) => attendance.assembly.is_present === false,
  );

  if (absences.length === 0)
    return (
      <Dialog
        open={open}
        width={300}
        onClose={onClose}
        style={style}
        className={className}
      >
        <DialogHeader
          icon={<MaterialIcon icon="event_available" />}
          title={t("perfect.title")}
          desc={t("perfect.desc")}
        />
        <Actions>
          <Button appearance="text" onClick={onClose}>
            {t("perfect.action.close")}
          </Button>
        </Actions>
      </Dialog>
    );

  return (
    <FullscreenDialog
      open={open}
      title={t("history.title")}
      width={280}
      onClose={onClose}
      style={style}
      className={className}
    >
      <List divided className="!-mx-4 *:px-4 sm:!-m-6 sm:*:px-0">
        {absences.map((absence) => (
          <ListItem
            key={absence.date}
            {...(classroom
              ? {
                  stateLayerEffect: true,
                  href: `/classes/${classroom?.number}/attendance/date/${absence.date}`,
                  element: Link,
                }
              : {})}
            align="center"
            lines={3}
          >
            <ListItemContent
              title={
                absence.assembly.absence_reason ||
                t(`history.item.title.${absence.assembly.absence_type}`)
              }
              desc={t("history.item.subtitle", {
                date: new Date(absence.date),
              })}
            />
            <AttendanceFigureEvent
              attendance={absence.assembly}
              className="-mr-4 !w-5"
            />
          </ListItem>
        ))}
      </List>
    </FullscreenDialog>
  );
};

export default AbsenceHistoryDialog;
