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

// Backend
import { SchedulePeriod } from "@utils/types/schedule";

// Hookes
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import { DialogProps } from "@utils/types/common";
import { addPeriodtoSchedule } from "@utils/backend/schedule";

const AddPeriodDialog = ({
  show,
  onClose,
  onSubmit,
  day,
  schedulePeriod,
}: DialogProps & {
  onSubmit: () => void;
  day: Day;
  schedulePeriod: SchedulePeriod;
}): JSX.Element => {
  const { t } = useTranslation(["schedule", "common"]);
  const locale = useRouter().locale as "en-US" | "th";
  const [teacher] = useTeacherAccount();

  // Form control
  const [form, setForm] = useState<{
    subjectID: number;
    room: string;
  }>({
    subjectID: 0,
    room: "",
  });

  useEffect(() => setForm({ subjectID: 0, room: "" }), [show]);

  // Form validation
  function validate(): boolean {
    if (!form.subjectID) return false;
    return true;
  }

  // Form submission
  function handleSubmit() {
    schedulePeriod.room = form.room;
    if (teacher)
      addPeriodtoSchedule(day, schedulePeriod, form.subjectID, teacher.id);
  }

  // Dialog display
  return (
    <Dialog
      type="regular"
      label="add-subject-to-period"
      title={t("dialog.addPeriod.title")}
      actions={[
        {
          name: t("dialog.addPeriod.action.cancel"),
          type: "close",
        },
        {
          name: t("dialog.addPeriod.action.save"),
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
          defaultValue={schedulePeriod.subject?.id}
          onChange={(e: number) => setForm({ ...form, subjectID: e })}
        />
        <KeyboardInput
          name="room"
          type="text"
          label={t("dialog.editPeriod.form.room")}
          onChange={(e: string) => setForm({ ...form, room: e })}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddPeriodDialog;
