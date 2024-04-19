// Imports
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { DialogFC } from "@/utils/types/component";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
} from "@suankularb-components/react";
import va from "@vercel/analytics";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

/**
 * Ask the user to confirm their log out.
 *
 * @returns A Dialog.
 */
const LogOutDialog: DialogFC = ({ open, onClose }) => {
  const router = useRouter();
  const { t } = useTranslation("common", { keyPrefix: "dialog.logOut" });

  const [loading, toggleLoading] = useToggle();

  function handleSubmit() {
    withLoading(
      async () => {
        // Track event
        va.track("Log out");

        // Log the user out (without reload)
        await signOut({ redirect: false });
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

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
