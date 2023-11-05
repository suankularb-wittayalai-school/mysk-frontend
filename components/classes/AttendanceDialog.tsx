// Imports
import AttendanceListItem from "@/components/classes/AttendanceListItem";
import SnackbarContext from "@/contexts/SnackbarContext";
import getAttendanceOfClass from "@/utils/backend/attendance/getAttendanceOfClass";
import recordAttendances from "@/utils/backend/attendance/recordAttendances";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import cn from "@/utils/helpers/cn";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { StudentAttendance } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  AssistChip,
  Button,
  ChipSet,
  Dialog,
  DialogHeader,
  FullscreenDialog,
  MaterialIcon,
  Progress,
  Section,
  SegmentedButton,
  Snackbar,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { isToday } from "date-fns";
import { LayoutGroup, motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { replace, unique } from "radash";
import { useContext, useEffect, useState } from "react";

/**
 * A Dialog for taking Attendance of Students in a classroom.
 *
 * @param event The default Attendance event to take Attendance for.
 * @param date The date to take Attendance for.
 * @param classroomID The ID of the Classroom for which Attendance is being taken.
 * @param teacherID The ID of the Teacher who is taking Attendance.
 * @param editable Whether the Attendance data is editable.
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the user submits the Attendance.
 */
const AttendanceDialog: StylableFC<{
  event?: "assembly" | "homeroom";
  date?: Date;
  classroomID: string;
  teacherID?: string;
  editable?: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({
  event: defaultEvent,
  date,
  classroomID,
  teacherID,
  editable,
  open,
  onClose,
  onSubmit,
  style,
  className,
}) => {
  const { t } = useTranslation("classes", { keyPrefix: "dialog.attendance" });
  const { t: ts } = useTranslation("classes", {
    keyPrefix: "dialog.confirmAttendanceSave",
  }); // ts for “t save”
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);
  const { duration, easing } = useAnimationConfig();

  const [event, setEvent] = useState<"assembly" | "homeroom">(
    defaultEvent || "assembly",
  );
  useEffect(() => {
    if (defaultEvent && defaultEvent !== event) setEvent(defaultEvent);
  }, [defaultEvent]);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();
  const [attendances, setAttendances] = useState<
    (Omit<StudentAttendance, "id" | "is_present"> & {
      is_present: boolean | null;
    })[]
  >([]);

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
        const { data } = await getAttendanceOfClass(
          supabase,
          classroomID,
          date || new Date(),
          event,
        );

        // If Attendance data exists, set it
        if (data && data.length > 0) {
          setAttendances(unique(data, (attendance) => attendance.student.id));
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
          date || new Date(),
          teacherID,
        );
        setConfirmOpen(false);
        va.track("Save Attendance", {
          isToday: date !== undefined && isToday(date),
        });
        if (error) return false;
        onSubmit();
        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
    );
  }

  /**
   * Mark all Students in the client state as present.
   */
  async function handleMarkAllPresent() {
    va.track("Mark All Students as Present", {
      isToday: date !== undefined && isToday(date),
    });
    setAttendances(
      attendances.map((attendance) =>
        attendance.is_present !== null
          ? attendance
          : {
              ...attendance,
              is_present: true,
              absence_type: null,
              absence_reason: null,
            },
      ),
    );
  }

  /**
   * Clear the Attendance data in the client state.
   */
  async function handleClear() {
    va.track("Clear Attendance", {
      isToday: date !== undefined && isToday(date),
    });
    setAttendances(
      attendances.map((attendance) => ({
        ...attendance,
        is_present: null,
        absence_type: null,
        absence_reason: null,
      })),
    );
  }

  return (
    <>
      <FullscreenDialog
        open={open}
        title={t(`title.${editable ? "take" : "view"}`)}
        action={
          // Only show Save Button for Class Advisors
          editable ? (
            <Button
              appearance="text"
              onClick={() => {
                if (!validateAttendances()) {
                  va.track("Attempted Attendance Save With Incomplete Data");
                  setSnackbar(
                    <Snackbar>{tx("snackbar.formInvalid")}</Snackbar>,
                  );
                } else setConfirmOpen(true);
              }}
              disabled={loading || !teacherID}
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
          alt={t("loading")}
          visible={loading}
          className="absolute inset-0 bottom-auto top-16 !mx-0"
        />

        <Section>
          {/* Event selection */}
          <SegmentedButton alt={t("event.title")} full>
            <Button
              appearance="outlined"
              selected={event === "assembly"}
              onClick={() => setEvent("assembly")}
            >
              {t("event.assembly")}
            </Button>
            <Button
              appearance="outlined"
              selected={event === "homeroom"}
              onClick={() => setEvent("homeroom")}
            >
              {t("event.homeroom")}
            </Button>
          </SegmentedButton>

          {/* Bulk actions */}
          {editable && (
            <ChipSet scrollable className="-mx-4 px-4">
              <AssistChip
                icon={<MaterialIcon icon="done_all" />}
                onClick={handleMarkAllPresent}
              >
                {t("action.markAll")}
              </AssistChip>
              <AssistChip
                icon={<MaterialIcon icon="delete" />}
                dangerous
                onClick={handleClear}
              >
                {t("action.clear")}
              </AssistChip>
            </ChipSet>
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
                editable={Boolean(teacherID)}
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
