// External libraries
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog } from "@suankularb-components/react";

// Types
import { SubmittableDialogProps } from "@utils/types/common";

const DiscardDraft = ({
  show,
  onClose,
  onSubmit,
}: SubmittableDialogProps): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Dialog
      type="regular"
      label="discard-draft"
      title={t("dialog.discardDraft.title")}
      supportingText={t("dialog.discardDraft.supportingText")}
      actions={[
        {
          name: t("dialog.discardDraft.action.continue"),
          type: "close",
        },
        {
          name: t("dialog.discardDraft.action.discard"),
          type: "submit",
          isDangerous: true,
        },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

export default DiscardDraft;
