// Modules
import { useTranslation } from "next-i18next";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Types
import { SubmittableDialogProps } from "@utils/types/common";

const ConnectSubjectDialog = ({
  show,
  onClose,
  onSubmit,
}: SubmittableDialogProps) => {
  const { t } = useTranslation("subjects");

  function validate(): boolean {
    return true;
  }

  return (
    <Dialog
      type="large"
      label="connect-subject"
      title={t("dialog.connectSubject.title")}
      supportingText={t("dialog.connectSubject.supportingText")}
      actions={[
        {
          name: t("dialog.connectSubject.action.cancel"),
          type: "close",
        },
        {
          name: t("dialog.connectSubject.action.save"),
          type: "submit",
          disabled: !validate(),
        },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <p>{t("dialog.connectSubject.note")}</p>
      <DialogSection
        name="subject"
        title="Connect subject"
        isDoubleColumn
        hasNoGap
      >
        <KeyboardInput
          name="subject-code"
          type="text"
          label="Subject code"
          helperMsg="Search for the subject with its code."
          onChange={() => {}}
        />
        <div>
          <h3 className="!text-base">Result</h3>
          <p>Communication and Presentation</p>
        </div>
        <KeyboardInput
          name="class"
          type="text"
          label="Class"
          helperMsg="The class you’re teaching this subject to."
          errorMsg="Invalid. Should be 3-digit, i.e. 408."
          useAutoMsg
          onChange={() => {}}
          attr={{ pattern: "[1-6][0-1][1-9]" }}
        />
      </DialogSection>
      <DialogSection name="codes" title="Class access" hasNoGap>
        <KeyboardInput
          name="ggc-code"
          type="text"
          label="Google Classroom code"
          errorMsg="Invalid. Should be 6-digit or 7-digit."
          useAutoMsg
          onChange={() => {}}
          attr={{ pattern: "[a-z0-9]{6,7}" }}
        />
        <KeyboardInput
          name="ggc-link"
          type="url"
          label="Google Classroom link"
          errorMsg="Invalid. Must be a full Classroom link."
          useAutoMsg
          onChange={() => {}}
          attr={{ pattern: "https://classroom.google.com/c/[a-zA-Z0-9]{16}" }}
        />
        <KeyboardInput
          name="ggc-meet"
          type="url"
          label="Google Meet link"
          errorMsg="Invalid. Must be a full Meet link."
          useAutoMsg
          onChange={() => {}}
        />
      </DialogSection>
    </Dialog>
  );
};

export default ConnectSubjectDialog;
