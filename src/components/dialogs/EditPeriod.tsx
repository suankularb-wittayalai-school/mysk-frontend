// Modules
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";

import { useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
} from "@suankularb-components/react";

// Components
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";

// Backend
import { addPeriodtoSchedule } from "@utils/backend/schedule";

const EditPeriod = ({
  show,
  onClose,
  onSubmit,
  mode,
}: DialogProps & {
  onSubmit: (formData: FormData) => void;
  mode: "add" | "edit";
}): JSX.Element => {
  const { t } = useTranslation(["schedule", "common"]);
  const locale = useRouter().locale as "en-US" | "th";
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState({
    subject: 1,
    day: "1",
    periodStart: "",
    duration: "1",
  });

  function validateAndSend() {
    // Pre-parse validation
    if (!form.periodStart) return false;

    const periodStart = parseInt(form.periodStart);
    const duration = parseInt(form.duration);
    let formData = new FormData();

    // Validates
    if (form.subject < 0) return false;
    if (!form.day) return false;
    if (periodStart < 0 || periodStart > 10) return false;
    if (duration < 1 || duration > 10) return false;

    // Appends to form data
    formData.append("subject", form.subject.toString());
    formData.append("day", form.day);
    formData.append("period-start", form.periodStart);
    formData.append("duration", form.duration);

    // Send
    onSubmit(formData);
    addPeriodtoSchedule(formData);

    return true;
  }

  return (
    <>
      <Dialog
        type="regular"
        label="add-period"
        title={t("dialog.add.title")}
        actions={[
          { name: t("dialog.add.action.cancel"), type: "close" },
          { name: t("dialog.add.action.save"), type: "submit" },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => validateAndSend() && onClose()}
      >
        <DialogSection name={t("dialog.add.form.title")} hasNoGap>
          <Dropdown
            name="subject"
            label={t("dialog.add.form.subject")}
            options={[
              {
                value: 1,
                label: {
                  "en-US": "English 1",
                  th: "ภาษาอังกฤษ 1",
                }[locale],
              },
            ]}
            onChange={(e: number) => setForm({ ...form, subject: e })}
          />
          <Dropdown
            name="day"
            label={t("dialog.add.form.day")}
            options={[
              {
                value: "1",
                label: t("datetime.day.1", { ns: "common" }),
              },
              {
                value: "2",
                label: t("datetime.day.2", { ns: "common" }),
              },
              {
                value: "3",
                label: t("datetime.day.3", { ns: "common" }),
              },
              {
                value: "4",
                label: t("datetime.day.4", { ns: "common" }),
              },
              {
                value: "5",
                label: t("datetime.day.5", { ns: "common" }),
              },
            ]}
            defaultValue="1"
            onChange={(e: string) => setForm({ ...form, day: e })}
          />
          <KeyboardInput
            name="period-start"
            type="number"
            label={t("dialog.add.form.periodStart")}
            onChange={(e: string) => setForm({ ...form, periodStart: e })}
            attr={{
              min: 1,
              max: 10,
            }}
          />
          <KeyboardInput
            name="duration"
            type="number"
            label={t("dialog.add.form.duration")}
            defaultValue="1"
            onChange={(e: string) => setForm({ ...form, duration: e })}
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
