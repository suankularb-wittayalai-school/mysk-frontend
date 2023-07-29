// Imports
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { signOut } from "next-auth/react";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
  Snackbar,
} from "@suankularb-components/react";
import SnackbarContext from "@/contexts/SnackbarContext";
import { logError } from "@/utils/helpers/debug";
import { withLoading } from "@/utils/helpers/loading";
import { useToggle } from "@/utils/hooks/toggle";
import { DialogFC } from "@/utils/types/component";

/**
 * Ask the user to confirm their log out.
 *
 * @returns A Dialog.
 */
const LogOutDialog: DialogFC = ({ open, onClose }) => {
  // Translation
  const { t } = useTranslation("common", { keyPrefix: "dialog.logOut" });
  const { t: tx } = useTranslation("common");

  const { setSnackbar } = useContext(SnackbarContext);

  const router = useRouter();

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();

  function handleSubmit() {
    withLoading(
      async () => {
        // Track event
        va.track("Log out");

        // Log the user out
        signOut();

        // Close the Dialog
        onClose();
        // Redirect to Landing
        router.push("/");

        return true;
      },
      toggleLoading,
      { hasEndToggle: true },
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

export default LogOutDialog;
