// Modules
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog } from "@suankularb-components/react";

// Types
import { SubmittableDialogProps } from "@utils/types/common";

const ConnectSubjectDialog = ({
  show,
  onClose,
  onSubmit,
}: SubmittableDialogProps) => {
  const { t } = useTranslation("subjects");

  return (
    <Dialog
      type="large"
      label="connect-subject"
      title={t("dialog.connectSubject.title")}
      actions={[
        {
          name: t("dialog.connectSubject.action.cancel"),
          type: "close",
        },
        {
          name: t("dialog.connectSubject.action.save"),
          type: "submit",
        },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default ConnectSubjectDialog;
