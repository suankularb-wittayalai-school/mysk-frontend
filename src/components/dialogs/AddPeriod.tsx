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
  const [subject, setSubject] = useState<number>(0);

  // Form validation
  function validate(): boolean {
    return true;
  }

  // Form submission
  function handleSubmit() {}

  // Dialog display
  return (
    <Dialog
      type="regular"
      label="add-subject-to-period"
      title={t("dialog.addPeriod.title")}
      actions={[
        { name: t("dialog.addPeriod.action.cancel"), type: "close" },
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
        onClose();
      }}
    >
      <DialogSection name={t("dialog.addPeriod.form.title")} hasNoGap>
        <Dropdown
          name="subject"
          label={t("dialog.addPeriod.form.subject")}
          options={
            teacher?.subjectsInCharge
              ? teacher.subjectsInCharge.map((subject) => ({
                  value: subject.id,
                  label: (subject.name[locale] || subject.name.th).name,
                }))
              : []
          }
          defaultValue={schedulePeriod.subject?.id}
          onChange={(e: number) => setSubject(e)}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddPeriodDialog;
