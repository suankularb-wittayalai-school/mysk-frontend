// External libraries
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  Dialog,
  TextField,
  MaterialIcon,
  DialogHeader,
  DialogContent,
  Actions,
  Button,
} from "@suankularb-components/react";

// Components
import CheckEmailDialog from "@/components/account/CheckEmailDialog";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { DialogComponent } from "@/utils/types/common";

const ForgotPasswordDialog: DialogComponent<{ inputEmail?: string }> = ({
  open,
  onClose,
  inputEmail,
}) => {
  // Translation
  const { t } = useTranslation("account");
  const locale = useLocale();

  // Form control
  const [email, setEmail] = useState<string>(inputEmail || "");
  useEffect(() => {
    if (inputEmail) setEmail(inputEmail);
  }, [inputEmail]);

  const [loading, toggleLoading] = useToggle();
  function handleSubmit() {
    if (!email) return;

    withLoading(
      async () => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
          [email, "sk.ac.th"].join("")
        );
        if (data) setShowCheckEmail(true);
        if (error) {
          console.error(error);
          return false;
        }
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  // Dialog control
  const [showCheckEmail, setShowCheckEmail] = useState<boolean>(false);

  return (
    <>
      <Dialog open={open ? !showCheckEmail : false} onClose={onClose}>
        <DialogHeader
          title={t("dialog.forgotPassword.title")}
          icon={<MaterialIcon icon="lock_open" />}
          desc={t("dialog.forgotPassword.supportingText")}
        />
        <DialogContent className="mx-6">
          <TextField
            appearance="outlined"
            label={t("dialog.forgotPassword.form.email", { ns: "account" })}
            align="right"
            trailing="sk.ac.th"
            error={email.endsWith("sk.ac.th")}
            value={email}
            onChange={(value) =>
              setEmail(
                (value as string).endsWith("sk.ac.th")
                  ? (value as string).slice(0, -8)
                  : (value as string)
              )
            }
            locale={locale}
            inputAttr={{ autoCapitalize: "off" }}
          />
        </DialogContent>
        <Actions>
          <Button appearance="text" onClick={onClose}>
            {t("dialog.forgotPassword.action.cancel")}
          </Button>
          <Button
            appearance="text"
            loading={loading || undefined}
            onClick={handleSubmit}
          >
            {t("dialog.forgotPassword.action.send")}
          </Button>
        </Actions>
      </Dialog>

      {/* Dialogs */}
      <CheckEmailDialog
        open={showCheckEmail}
        onClose={() => {
          setShowCheckEmail(false);
          onClose();
        }}
        email={[email, "sk.ac.th"].join("")}
      />
    </>
  );
};

export default ForgotPasswordDialog;
