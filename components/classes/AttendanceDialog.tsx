// Imports
import AttendanceListItem from "@/components/classes/AttendanceListItem";
import SnackbarContext from "@/contexts/SnackbarContext";
import getAttendancesOfClassAtDate from "@/utils/backend/attendance/getAttendancesOfClass";
import recordAttendances from "@/utils/backend/attendance/recordAttendances";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import cn from "@/utils/helpers/cn";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
  FullscreenDialog,
  Progress,
  Section,
  SegmentedButton,
  Snackbar,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { isFuture, isWithinInterval } from "date-fns";
import { LayoutGroup, motion } from "framer-motion";
import { Trans, useTranslation } from "next-i18next";
import { replace } from "radash";
import { useContext, useEffect, useState } from "react";

/**
 * A Dialog for taking Attendance of Students in a classroom.
 *
 * @param event The default Attendance event to take Attendance for.
 * @param classroomID The ID of the Classroom for which Attendance is being taken.
 * @param teacherID The ID of the Teacher who is taking Attendance.
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const AttendanceDialog: StylableFC<{
  event?: "assembly" | "homeroom";
  classroomID: string;
  teacherID?: string;
  open: boolean;
  onClose: () => void;
}> = ({
  event: defaultEvent,
  classroomID,
  teacherID,
  open,
  onClose,
  style,
  className,
}) => {
  const { t } = useTranslation("classes", { keyPrefix: "dialog.attendance" });
  const { t: ts } = useTranslation("classes", {
    keyPrefix: "dialog.confirmAttendanceSave",
  }); // <-- Is this good practice?
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);
  const { duration, easing } = useAnimationConfig();

  const [event, setEvent] = useState<"assembly" | "homeroom">(
    defaultEvent || "assembly",
  );

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();
  const [attendances, setAttendances] = useState<
    (Omit<StudentAttendance, "id" | "is_present"> & {
      is_present: boolean | null;
    })[]
  >([]);

  /**
   * Whether the Attendance data is editable or not.
   */
  const editable =
    // The user must be a Teacher
    (teacherID &&
      // Assembly Attendance must be taken before 08:00
      event === "assembly" &&
      isFuture(new Date().setHours(8, 0, 0, 0))) ||
    // Homeroom Attendance must be taken between 08:00 and 08:30
    (event === "homeroom" &&
      isWithinInterval(new Date(), {
        start: new Date().setHours(8, 0, 0, 0),
        end: new Date().setHours(8, 30, 0, 0),
      }));

  useEffect(() => {
    if (
      // Don’t fetch if the Dialog is closed
      !open ||
      // Don’t fetch if the Attendance data for this event view is already set
      (attendances[0] && attendances[0].attendance_event === event)
    )
      return;
    withLoading(
      async () => {
        // Get Attendance data
        const { data } = await getAttendancesOfClassAtDate(
          supabase,
          classroomID,
          new Date(),
          event,
        );

        // If Attendance data exists, set it
        // This will make the Dialog read-only
        if (data && data.length > 0) {
          setAttendances(data);
          return true;
        }

        // If Attendance data does not exist, fetch Students and set blank
        // Attendances
        const { data: students, error: studentsError } =
          await getStudentsOfClass(supabase, classroomID);
        if (studentsError) return false;
        setAttendances(
          students.map((student) => ({
            student,
            is_present: null,
            attendance_event: event,
            absence_type: null,
            absence_reason: null,
          })),
        );
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }, [open, event]);

  const [confirmOpen, setConfirmOpen] = useState(false);

  /**
   * Validate the Attendance data.
   *
   * @returns `true` if the Attendance data is valid, `false` otherwise.
   */
  function validateAttendances() {
    for (const attendance of attendances) {
      if (attendance.is_present === null) return false;
      if (attendance.is_present === false) {
        if (!attendance.absence_type) return false;
        if (attendance.absence_type === "other" && !attendance.absence_reason)
          return false;
      }
    }
    return true;
  }

  /**
   * Save the Attendance data.
   */
  async function handleSave() {
    if (!teacherID) return;
    withLoading(
      async () => {
        const { error } = await recordAttendances(
          supabase,
          // `validateAttendances` already checks for null `is_present` so this
          // `as` is fine
          attendances as StudentAttendance[],
          event,
          teacherID,
        );
        setConfirmOpen(false);

        if (error) return false;
        onClose();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  return (
    <>
      <FullscreenDialog
        open={open}
        title={t(`title.${teacherID ? "take" : "view"}`)}
        action={
          // Only show Save Button for teachers
          teacherID ? (
            <Button
              appearance="text"
              onClick={() => {
                if (!validateAttendances())
                  setSnackbar(
                    <Snackbar>{tx("snackbar.formInvalid")}</Snackbar>,
                  );
                else setConfirmOpen(true);
              }}
              disabled={loading || !editable}
            >
              {t("action.save")}
            </Button>
          ) : undefined
        }
        width={400}
        onClose={onClose}
        style={style}
        className={cn(
          `sm:!h-[calc(100dvh-2rem)] [&>:last-child]:!overflow-x-hidden`,
          className,
        )}
      >
        <Progress
          appearance="linear"
          alt="Loading students"
          visible={loading}
          className="absolute inset-0 bottom-auto top-16 !mx-0"
        />

        {/* Event selection */}
        <Section>
          <SegmentedButton alt="View" full>
            <Button
              appearance="outlined"
              selected={event === "assembly"}
              onClick={() => setEvent("assembly")}
            >
              {t("event.assembly.name")}
            </Button>
            <Button
              appearance="outlined"
              selected={event === "homeroom"}
              onClick={() => setEvent("homeroom")}
            >
              {t("event.homeroom.name")}
            </Button>
          </SegmentedButton>
          {teacherID && (
            <Text
              type="body-medium"
              element="p"
              className="text-on-surface-variant"
            >
              <Trans
                i18nKey={`dialog.attendance.event.${event}.desc`}
                ns="classes"
              />
            </Text>
          )}
        </Section>

        {/* List */}
        <motion.ul
          key={event}
          layout="position"
          layoutRoot
          transition={transition(duration.medium2, easing.standard)}
          className="!mx-0 sm:!-mx-4"
        >
          <LayoutGroup id="attendance">
            {attendances.map((attendance) => (
              <AttendanceListItem
                key={attendance.student.id}
                attendance={attendance}
                editable={editable}
                onAttendanceChange={(attendance) =>
                  setAttendances(
                    replace(
                      attendances,
                      attendance,
                      (item) => attendance.student!.id === item.student!.id,
                    ),
                  )
                }
              />
            ))}
          </LayoutGroup>
        </motion.ul>
      </FullscreenDialog>

      {/* Confirm Save Dialog */}
      <Dialog
        open={confirmOpen}
        width={312}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogHeader title={ts("title")} desc={ts("desc")} />
        <Actions>
          <Button appearance="text" onClick={() => setConfirmOpen(false)}>
            {ts("action.goBack")}
          </Button>
          <Button appearance="text" onClick={handleSave}>
            {ts("action.confirm")}
          </Button>
        </Actions>
      </Dialog>
    </>
  );
};

export default AttendanceDialog;
