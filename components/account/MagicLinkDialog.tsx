// External libraries
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useContext, useState } from "react";

// SK Components
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  MaterialIcon,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Internal components
import CheckEmailDialog from "@/components/account/CheckEmailDialog";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useLocale } from "@/utils/hooks/i18n";
import { useToggle } from "@/utils/hooks/toggle";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { DialogComponent } from "@/utils/types/common";
import { logError } from "@/utils/helpers/debug";

/**
 * Initiates the Log in With Magic Link process.
 *
 * @returns A Dialog.
 */
const MagicLinkDialog: DialogComponent = ({ open, onClose }) => {
  // Translation
  const { t } = useTranslation("account", { keyPrefix: "dialog.magicLink" });
  const { t: tx } = useTranslation("common");
  const locale = useLocale();

  const { setSnackbar } = useContext(SnackbarContext);

  // Form control
  const [email, setEmail] = useState<string>("");

  const [loading, toggleLoading] = useToggle();
  function handleSubmit() {
    if (!email) {
      setSnackbar(<Snackbar>{tx("snackbar.formInvalid")}</Snackbar>);
      return;
    }
    withLoading(
      async () => {
        // Send magic link
        const { data, error } = await supabase.auth.signInWithOtp({
          email: [email, "sk.ac.th"].join(""),
        });
        if (data) setShowCheckEmail(true);
        if (error) {
          logError("handleSubmit in MagicLinkDialog", error);
          setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          return false;
        }

        // Track event
        va.track("Send Magic Link");
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
          title={t("title")}
          icon={<MaterialIcon icon="magic_button" />}
          desc={t("desc")}
        />
        <DialogContent className="mx-6">
          <TextField<string>
            appearance="outlined"
            label={t("form.email")}
            align="right"
            trailing="sk.ac.th"
            error={email.endsWith("sk.ac.th")}
            value={email}
            onChange={(value) =>
              setEmail(value.endsWith("sk.ac.th") ? value.slice(0, -8) : value)
            }
            locale={locale}
            inputAttr={{ autoCapitalize: "off" }}
          />
        </DialogContent>
        <Actions>
          <Button appearance="text" onClick={onClose}>
            {t("action.cancel")}
          </Button>
          <Button
            appearance="text"
            loading={loading || undefined}
            onClick={handleSubmit}
          >
            {t("action.send")}
          </Button>
        </Actions>
      </Dialog>

      {/* Dialogs */}
      <CheckEmailDialog
        open={showCheckEmail}
        onClose={() => {
          setShowCheckEmail(false);
          onClose();
          setEmail("");
        }}
        email={[email, "sk.ac.th"].join("")}
      />
    </>
  );
};

export default MagicLinkDialog;
