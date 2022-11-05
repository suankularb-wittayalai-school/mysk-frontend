// External libraries
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { User, useUser } from "@supabase/auth-helpers-react";

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
import { useToggle } from "@utils/hooks/toggle";

const ChangePassword = ({ show, onClose }: DialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const user = useUser() as User;

  const [loading, toggleLoading] = useToggle();

  // Dialog control
  const [showDiscard, toggleShowDiscard] = useToggle();

  // Form control
  const [form, setForm] = useState({
    originalPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  function validate() {
    if (!form.newPassword || form.newPassword.length < 8) return;
    if (!form.confirmNewPassword || form.confirmNewPassword.length < 8) return;
    if (form.newPassword != form.confirmNewPassword) return;
    return true;
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
            disabled: !validate() || loading,
          },
        ]}
        show={show}
        onClose={toggleShowDiscard}
        onSubmit={async () => {
          toggleLoading();
          await changePassword(form, user);
          toggleLoading();
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

      {/* Dialogs */}
      <DiscardDraft
        show={showDiscard}
        onClose={toggleShowDiscard}
        onSubmit={() => {
          toggleShowDiscard();
          onClose();
        }}
      />
    </>
  );
};

export default ChangePassword;
