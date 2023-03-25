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

const CheckEmailDialog: DialogComponent<{ email: string }> = ({
  open,
  onClose,
  email,
}) => {
  const { t } = useTranslation("account");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title={t("dialog.checkEmail.title")}
        desc={t("dialog.checkEmail.supportingText", { email })}
      />
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("dialog.checkEmail.action.gotIt")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default CheckEmailDialog;
