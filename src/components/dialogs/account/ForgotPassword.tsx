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
      title="Reset with password"
      icon={<MaterialIcon icon="email" />}
      supportingText="To verify your identity, we will send you an email with a link back to MySK."
      show={show}
      actions={[
        { name: "Cancel", type: "close" },
        { name: "Send", type: "submit" },
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
