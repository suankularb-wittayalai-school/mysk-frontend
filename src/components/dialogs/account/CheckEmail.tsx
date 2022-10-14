// External libraries
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog } from "@suankularb-components/react";

// Types
import { DialogComponent } from "@utils/types/common";

const CheckEmailDialog: DialogComponent<{ email: string }> = ({
  show,
  onClose,
  email,
}) => {
  const { t } = useTranslation("account");

  return (
    <Dialog
      type="regular"
      label="check-email"
      title={t("dialog.checkEmail.title")}
      supportingText={t("dialog.checkEmail.supportingText", { email })}
      show={show}
      actions={[{ name: t("dialog.checkEmail.action.gotIt"), type: "close" }]}
      onClose={onClose}
    />
  );
};

export default CheckEmailDialog;
