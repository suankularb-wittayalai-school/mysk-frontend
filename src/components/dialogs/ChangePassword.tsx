// Modules
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Components
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";

// Backend
import { changePassword } from "@utils/backend/account";

interface ChangePasswordProps extends DialogProps {
  setShowDiscard?: Function;
}

const ChangePassword = ({
  show,
  onClose,
}: ChangePasswordProps): JSX.Element => {
  const { t } = useTranslation("account");
  const [showDiscard, setShowDiscard] = useState<boolean>(false);
  const [form, setForm] = useState({
    originalPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  function validateAndSend() {
    let formData = new FormData();

    if (form.originalPassword)
      formData.append("original-password", form.originalPassword);
    if (form.newPassword == form.confirmNewPassword)
      formData.append("new-password", form.newPassword);

    changePassword(formData);
  }

  return (
    <>
      <Dialog
        type="regular"
        label="change-password"
        title={t("dialog.changePassword.title")}
        supportingText={t("dialog.changePassword.supportingText")}
        actions={[
          { name: t("dialog.changePassword.action.cancel"), type: "close" },
          { name: t("dialog.changePassword.action.save"), type: "submit" },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => {
          validateAndSend();
          onClose();
        }}
      >
        <DialogSection>
          <form>
            <KeyboardInput
              name="original-password"
              type="password"
              label={t("dialog.changePassword.originalPwd")}
              onChange={(e: string) =>
                setForm({ ...form, originalPassword: e })
              }
            />
            <KeyboardInput
              name="new-password"
              type="password"
              label={t("dialog.changePassword.newPwd")}
              onChange={(e: string) => setForm({ ...form, newPassword: e })}
            />
            <KeyboardInput
              name="confirm-new-password"
              type="password"
              label={t("dialog.changePassword.confirmNewPwd")}
              onChange={(e: string) =>
                setForm({ ...form, confirmNewPassword: e })
              }
            />
          </form>
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

export default ChangePassword;
