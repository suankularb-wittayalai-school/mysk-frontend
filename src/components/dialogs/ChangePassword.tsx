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

// Backend
import { changePassword } from "@utils/backend/account";

// Types
import { DialogProps } from "@utils/types/common";

// Hooks
import { useSession } from "@utils/hooks/auth";

const ChangePassword = ({ show, onClose }: DialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const [showDiscard, setShowDiscard] = useState<boolean>(false);
  const [form, setForm] = useState({
    originalPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const session = useSession();

  function validate() {
    if (!form.newPassword || form.newPassword.length < 8) return;
    if (!form.confirmNewPassword || form.confirmNewPassword.length < 8) return;
    if (form.newPassword != form.confirmNewPassword) return;
    return true;
  }

  function validateAndSend() {
    if (!validate) return;

    let formData = new FormData();

    if (form.originalPassword)
      formData.append("original-password", form.originalPassword);
    if (form.newPassword == form.confirmNewPassword)
      formData.append("new-password", form.newPassword);

    changePassword(formData, session);
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
          {
            name: t("dialog.changePassword.action.save"),
            type: "submit",
            disabled: !validate(),
          },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => {
          validateAndSend();
          onClose();
        }}
      >
        <DialogSection hasNoGap>
          <KeyboardInput
            name="old-password"
            type="password"
            label={t("dialog.changePassword.originalPwd")}
            onChange={(e: string) => setForm({ ...form, originalPassword: e })}
          />
          <KeyboardInput
            name="new-password"
            type="password"
            label={t("dialog.changePassword.newPwd")}
            errorMsg={t("dialog.changePassword.newPwd_error")}
            useAutoMsg
            onChange={(e: string) => setForm({ ...form, newPassword: e })}
            attr={{ minLength: 8 }}
          />
          <KeyboardInput
            name="confirm-new-password"
            type="password"
            label={t("dialog.changePassword.confirmNewPwd")}
            errorMsg={t("dialog.changePassword.newPwd_error")}
            useAutoMsg
            onChange={(e: string) =>
              setForm({ ...form, confirmNewPassword: e })
            }
            attr={{ minLength: 8 }}
          />
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
