// External libraries
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import {
  Dialog,
  KeyboardInput,
  MaterialIcon,
} from "@suankularb-components/react";

// Types
import { SubmittableDialogComponent } from "@utils/types/common";

// Supabase
import { supabase } from "@utils/supabaseClient";

const ForgotPasswordDialog: SubmittableDialogComponent = ({
  show,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation("account");

  const [email, setEmail] = useState<string>("");

  return (
    <Dialog
      type="regular"
      label="forgot-password"
      title={t("dialog.forgotPassword.title")}
      icon={<MaterialIcon icon="email" />}
      supportingText={t("dialog.forgotPassword.supportingText")}
      show={show}
      actions={[
        { name: t("dialog.forgotPassword.action.cancel"), type: "close" },
        { name: t("dialog.forgotPassword.action.send"), type: "submit" },
      ]}
      onClose={onClose}
      onSubmit={async () => {
        if (!email) return;
        const { data, error } = await supabase.auth.api.resetPasswordForEmail(
          email
        );
        if (data) onSubmit();
      }}
    >
      <KeyboardInput
        name="email"
        type="email"
        label={t("logIn.form.email")}
        helperMsg={t("logIn.form.email_helper")}
        errorMsg={t("logIn.form.email_error")}
        useAutoMsg
        onChange={setEmail}
      />
    </Dialog>
  );
};

export default ForgotPasswordDialog;
