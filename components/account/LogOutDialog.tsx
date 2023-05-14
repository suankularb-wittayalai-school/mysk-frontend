// External libraries
import va from "@vercel/analytics";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

// SK Components
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
  Snackbar,
} from "@suankularb-components/react";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Helpers
import { logError } from "@/utils/helpers/debug";
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useToggle } from "@/utils/hooks/toggle";

// Supabase
import { supabase } from "@/utils/supabase-client";

// Types
import { DialogComponent } from "@/utils/types/common";

/**
 * Ask the user to confirm their log out.
 *
 * @returns A Dialog.
 */
const MagicLinkDialog: DialogComponent = ({ open, onClose }) => {
  // Translation
  const { t } = useTranslation("account", { keyPrefix: "dialog.logOut" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  const router = useRouter();

  const [loading, toggleLoading] = useToggle();
  function handleSubmit() {
    withLoading(
      async () => {
        // Log the user out
        const { error } = await supabase.auth.signOut();
        if (error) {
          logError("handleSubmit in LogOutDialog", error);
          setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
          return false;
        }

        // Track event
        va.track("Log out");

        // Redirect to Landing
        router.push("/");
        return true;
      },
      toggleLoading,
      { hasEndToggle: true }
    );
  }

  return (
    <Dialog open={open} width={312} onClose={onClose}>
      <DialogHeader title={t("title")} desc={t("desc")} />
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.back")}
        </Button>
        <Button
          appearance="text"
          loading={loading || undefined}
          dangerous
          onClick={handleSubmit}
        >
          {t("action.logOut")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default MagicLinkDialog;
