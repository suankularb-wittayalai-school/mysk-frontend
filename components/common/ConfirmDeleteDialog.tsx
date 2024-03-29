// Imports
import { DialogFC } from "@/utils/types/component";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Dialog to show before performing an irreversible deletion of something,
 * asking for confimation.
 *
 * @returns A Dialog.
 */
const ConfirmDeleteDialog: DialogFC<{
  onSubmit: () => void;
}> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation("common", { keyPrefix: "dialog.confirmDelete" });

  return (
    <Dialog {...{ open, onClose }} width={300}>
      <DialogHeader title={t("title")} desc={t("desc")} />
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button appearance="text" dangerous onClick={onSubmit}>
          {t("action.delete")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
