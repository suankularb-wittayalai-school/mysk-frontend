// External libraries
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog } from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

interface DiscordDraftProps extends DialogProps {
  onSubmit: Function;
}

const ConfirmDelete = ({
  show,
  onClose,
  onSubmit,
}: DiscordDraftProps): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Dialog
      type="regular"
      label="confirm-delete"
      title={t("dialog.confirmDelete.title")}
      supportingText={t("dialog.confirmDelete.supportingText")}
      actions={[
        {
          name: t("dialog.confirmDelete.action.cancel"),
          type: "close",
        },
        {
          name: t("dialog.confirmDelete.action.delete"),
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

export default ConfirmDelete;
