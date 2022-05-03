// Modules
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog } from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

interface DiscordDraftProps extends DialogProps {
  onSubmit: Function;
}

const DiscardDraft = ({
  show,
  onClose,
  onSubmit,
}: DiscordDraftProps): JSX.Element => {
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
