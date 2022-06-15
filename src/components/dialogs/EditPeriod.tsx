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
import { addPeriodtoSchedule } from "@utils/backend/schedule";

// Helpers
import { range } from "@utils/helpers/array";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import { SubmittableDialogProps } from "@utils/types/common";
import { SchedulePeriod } from "@utils/types/schedule";

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

  // Dialog control
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState<{
    subject: number;
    class: number;
    room: string;
    day: number;
    startTime: number;
    duration: number;
  }>({
    subject: teacher?.subjectsInCharge ? teacher.subjectsInCharge[0].id : 0,
    class: 0,
    room: "",
    day: 0,
    startTime: 0,
    duration: 0,
  });

  useEffect(() => {
    if (mode == "edit" || canEditStartTime)
      setForm({
        subject:
          schedulePeriod?.subject?.id ||
          (teacher?.subjectsInCharge ? teacher.subjectsInCharge[0].id : 0),
        class: schedulePeriod?.class?.number || 0,
        room: schedulePeriod?.room || "",
        day: day || 0,
        startTime: schedulePeriod?.startTime || 0,
        duration: schedulePeriod?.duration || 0,
      });
    else
      setForm({
        subject: teacher?.subjectsInCharge ? teacher.subjectsInCharge[0].id : 0,
        class: 0,
        room: "",
        day: 0,
        startTime: 0,
        duration: 0,
      });
  }, [canEditStartTime, day, mode, schedulePeriod, teacher]);

  // Form validation
  function validate(): boolean {
    if (!form.startTime) return false;
    if (!form.subject) return false;
    if (!form.day) return false;
    if (form.startTime < 0 || form.startTime > 10) return false;
    if (form.duration < 1 || form.duration > 10) return false;

    return true;
  }

  // Form submission
  function handleSubmit() {
    if (!validate()) return;

    if (teacher) {
      if (mode == "add")
        addPeriodtoSchedule(
          form.day,
          { startTime: form.startTime, duration: form.duration },
          form.subject,
          teacher.id
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
      onSubmit={() => {
        handleSubmit();
        onSubmit();
      }}
    >
      <DialogSection name={t("dialog.editPeriod.form.title")} hasNoGap>
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
          defaultValue={mode == "edit" ? schedulePeriod?.subject?.id : 0}
          onChange={(e: number) => setForm({ ...form, subject: e })}
        />
        <KeyboardInput
          name="room"
          type="text"
          label={t("dialog.editPeriod.form.room")}
          onChange={(e: string) => setForm({ ...form, room: e })}
        />
        {canEditStartTime && (
          <>
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
              attr={{
                min: 1,
                max: 10,
              }}
            />
            <KeyboardInput
              name="duration"
              type="number"
              label={t("dialog.editPeriod.form.duration")}
              defaultValue={
                mode == "edit" ? schedulePeriod?.duration : undefined
              }
              onChange={(e: string) =>
                setForm({ ...form, duration: Number(e) })
              }
              attr={{
                min: 1,
                max: 10,
              }}
            />
          </>
        )}
      </DialogSection>
    </Dialog>
  );
};

export default EditPeriod;
