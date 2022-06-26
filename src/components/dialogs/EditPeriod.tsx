// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
} from "@suankularb-components/react";

// Backend
import {
  createScheduleItem,
  editScheduleItem,
} from "@utils/backend/schedule/schedule";
import { getRoomsEnrolledInSubject } from "@utils/backend/subject/roomSubject";

// Helpers
import { range } from "@utils/helpers/array";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import { ClassWNumber } from "@utils/types/class";
import { SubmittableDialogProps } from "@utils/types/common";
import { SchedulePeriod } from "@utils/types/schedule";

// Miscellaneous
import { roomPattern } from "@utils/patterns";

const EditPeriod = ({
  show,
  onClose,
  onSubmit,
  mode,
  day,
  schedulePeriod,
  canEditStartTime,
}: SubmittableDialogProps & {
  mode: "add" | "edit";
  day?: Day;
  schedulePeriod?: SchedulePeriod;
  canEditStartTime?: boolean;
}): JSX.Element => {
  const { t } = useTranslation(["schedule", "common"]);
  const locale = useRouter().locale as "en-US" | "th";
  const [teacher] = useTeacherAccount();

  // Form control
  const [form, setForm] = useState<{
    subject: number;
    classID: number;
    room: string;
    day: number;
    startTime: number;
    duration: number;
  }>({
    subject: teacher?.subjectsInCharge ? teacher.subjectsInCharge[0].id : 0,
    classID: 0,
    room: "",
    day: 0,
    startTime: 0,
    duration: 0,
  });

  // Classes
  const [classes, setClasses] = useState<ClassWNumber[]>([]);
  useEffect(() => {
    const fetchClasses = async () =>
      setClasses((await getRoomsEnrolledInSubject(form.subject)).data || []);
    fetchClasses();
  }, [form.subject]);

  useEffect(() => {
    // Populate form with data if editing
    if (mode == "edit" || !canEditStartTime)
      setForm({
        subject:
          schedulePeriod?.subject?.id ||
          (teacher?.subjectsInCharge ? teacher.subjectsInCharge[0].id : 0),
        classID:
          schedulePeriod?.class?.id || (classes.length > 0 ? classes[0].id : 0),
        room: schedulePeriod?.room || "",
        day: day || 0,
        startTime: schedulePeriod?.startTime || 0,
        duration: schedulePeriod?.duration || 1,
      });
    // Populate form with day-time data if adding from Schedule
    else if (!canEditStartTime)
      setForm({
        subject: teacher?.subjectsInCharge ? teacher.subjectsInCharge[0].id : 0,
        classID: classes.length > 0 ? classes[0].id : 0,
        room: "",
        day: day || 0,
        startTime: schedulePeriod?.startTime || 0,
        duration: 1,
      });
    // Reset the form
    else
      setForm({
        subject: teacher?.subjectsInCharge ? teacher.subjectsInCharge[0].id : 0,
        classID: classes.length > 0 ? classes[0].id : 0,
        room: "",
        day: 0,
        startTime: 0,
        duration: 0,
      });
  }, [show]);

  // Form validation
  function validate(): boolean {
    if (!form.subject) return false;
    if (!form.classID) return false;
    if (!form.room) return false;

    if (!form.day) return false;
    if (form.startTime < 1 || form.startTime > 10) return false;
    if (form.duration < 1 || form.duration > 10) return false;

    return true;
  }

  // Form submission
  async function handleSubmit() {
    if (!validate()) return;

    if (teacher) {
      if (mode == "add") await createScheduleItem(form, teacher.id);
      else if (mode == "edit")
        if (schedulePeriod?.id) await editScheduleItem(form, schedulePeriod.id);
        else
          console.error(
            "cannot push edit, Schedule Period is missing Supabase ID"
          );
    }
  }

  return (
    <Dialog
      type="regular"
      label={`${mode}-period`}
      title={t(`dialog.editPeriod.title.${mode}`)}
      actions={[
        {
          name: t("dialog.editPeriod.action.cancel"),
          type: "close",
        },
        {
          name: t("dialog.editPeriod.action.save"),
          type: "submit",
          disabled: !validate(),
        },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={async () => {
        await handleSubmit();
        onSubmit();
      }}
    >
      <DialogSection name={t("dialog.editPeriod.form.title")} hasNoGap>
        {/* Subject */}
        <Dropdown
          name="subject"
          label={t("dialog.editPeriod.form.subject")}
          options={
            teacher?.subjectsInCharge
              ? teacher.subjectsInCharge.map((subject) => ({
                  value: subject.id,
                  label: (subject.name[locale] || subject.name.th).name,
                }))
              : []
          }
          noOptionsText={t("input.none.noOptions", { ns: "common" })}
          defaultValue={mode == "edit" ? schedulePeriod?.subject?.id : 0}
          onChange={(e: number) => setForm({ ...form, subject: e })}
        />

        {/* Class */}
        <Dropdown
          name="class"
          label={t("dialog.editPeriod.form.class")}
          options={classes
            .map((classroom) => ({
              value: classroom.id,
              label: t("class", { ns: "common", number: classroom.number }),
            }))
            .sort((a, b) => a.label.localeCompare(b.label))}
          noOptionsText={t("input.none.noOptions", { ns: "common" })}
          defaultValue={mode == "edit" ? schedulePeriod?.class?.id : undefined}
          onChange={(e: number) => setForm({ ...form, classID: e })}
        />

        {/* Room */}
        <KeyboardInput
          name="room"
          type="text"
          label={t("dialog.editPeriod.form.room")}
          defaultValue={mode == "edit" ? schedulePeriod?.room : undefined}
          onChange={(e: string) => setForm({ ...form, room: e })}
          attr={{ pattern: roomPattern }}
        />

        {canEditStartTime && (
          <>
            {/* Day */}
            <Dropdown
              name="day"
              label={t("dialog.editPeriod.form.day")}
              options={range(5).map((day) => ({
                value: day + 1,
                label: t(`datetime.day.${day + 1}`, { ns: "common" }),
              }))}
              defaultValue={day}
              onChange={(e: string) => setForm({ ...form, day: Number(e) })}
            />

            {/* Start time */}
            <KeyboardInput
              name="period-start"
              type="number"
              label={t("dialog.editPeriod.form.periodStart")}
              defaultValue={
                mode == "edit" ? schedulePeriod?.startTime : undefined
              }
              onChange={(e: string) =>
                setForm({ ...form, startTime: Number(e) })
              }
              attr={{ min: 1, max: 10 }}
            />
          </>
        )}

        {/* Duration */}
        <KeyboardInput
          name="duration"
          type="number"
          label={t("dialog.editPeriod.form.duration")}
          defaultValue={mode == "edit" ? schedulePeriod?.duration : 1}
          onChange={(e: string) => setForm({ ...form, duration: Number(e) })}
          attr={{ min: 1, max: 10 }}
        />
      </DialogSection>
    </Dialog>
  );
};

export default EditPeriod;
