// External libraries
import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
} from "@suankularb-components/react";

// Types
import { DialogComponent } from "@/utils/types/common";

/**
 * Tells the user the next steps after entering their email.
 *
 * @param email The email address where the log in link was sent to.
 *
 * @returns A Dialog.
 */
const CheckEmailDialog: DialogComponent<{
  email: string;
}> = ({ open, onClose, email }) => {
  const { t } = useTranslation("account", { keyPrefix: "dialog.checkEmail" });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader title={t("title")} desc={t("desc", { email })} />
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.gotIt")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default CheckEmailDialog;
