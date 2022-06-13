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

// Components
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Backend
import { SchedulePeriod } from "@utils/types/schedule";

// Hookes
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import { DialogProps } from "@utils/types/common";

const EditPeriod = ({
  show,
  onClose,
  onSubmit,
  mode,
  day,
  schedulePeriod,
}: DialogProps & {
  onSubmit: () => void;
  mode: "add" | "edit";
  day: Day;
  schedulePeriod: SchedulePeriod;
}): JSX.Element => {
  const { t } = useTranslation(["schedule", "common"]);
  const locale = useRouter().locale as "en-US" | "th";
  const [teacher] = useTeacherAccount();

  // Dialog control
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState<{
    subject: number;
    day: number;
    startTime: number;
    duration: number;
  }>({
    subject: 0,
    day,
    startTime: schedulePeriod.startTime,
    duration: schedulePeriod.duration,
  });

  useEffect(() => {
    setForm({
      subject: schedulePeriod.subject?.id || 0,
      day,
      startTime: schedulePeriod.startTime,
      duration: schedulePeriod.duration,
    });
  }, [show, day, schedulePeriod]);

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
  }

  return (
    <>
      <Dialog
        type="regular"
        label={`${mode}-period`}
        title={t(`dialog.editPeriod.title.${mode}`)}
        actions={[
          { name: t("dialog.editPeriod.action.cancel"), type: "close" },
          { name: t("dialog.editPeriod.action.save"), type: "submit" },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => {
          handleSubmit();
          onClose();
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
            defaultValue={schedulePeriod.subject?.id}
            onChange={(e: number) => setForm({ ...form, subject: e })}
          />
          <Dropdown
            name="day"
            label={t("dialog.editPeriod.form.day")}
            options={[
              {
                value: 1,
                label: t("datetime.day.1", { ns: "common" }),
              },
              {
                value: 2,
                label: t("datetime.day.2", { ns: "common" }),
              },
              {
                value: 3,
                label: t("datetime.day.3", { ns: "common" }),
              },
              {
                value: 4,
                label: t("datetime.day.4", { ns: "common" }),
              },
              {
                value: 5,
                label: t("datetime.day.5", { ns: "common" }),
              },
            ]}
            defaultValue={day}
            onChange={(e: string) => setForm({ ...form, day: Number(e) })}
          />
          <KeyboardInput
            name="period-start"
            type="number"
            label={t("dialog.editPeriod.form.periodStart")}
            defaultValue={schedulePeriod.startTime}
            onChange={(e: string) => setForm({ ...form, startTime: Number(e) })}
            attr={{
              min: 1,
              max: 10,
            }}
          />
          <KeyboardInput
            name="duration"
            type="number"
            label={t("dialog.editPeriod.form.duration")}
            defaultValue={schedulePeriod.duration}
            onChange={(e: string) => setForm({ ...form, duration: Number(e) })}
            attr={{
              min: 1,
              max: 10,
            }}
          />
        </DialogSection>
      </Dialog>
      <DiscardDraft
        show={showDiscard}
        onClose={() => setShowDiscard(false)}
        onSubmit={() => {
          setShowDiscard(false);
          onClose();
        }}
      />
    </>
  );
};

export default EditPeriod;
