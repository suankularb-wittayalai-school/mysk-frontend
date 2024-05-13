import UserContext from "@/contexts/UserContext";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { DialogFC } from "@/utils/types/component";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { useRouter } from "next/router";
import { useContext } from "react";

/**
 * Ask the user to confirm their log out.
 *
 * @returns A Dialog.
 */
const LogOutDialog: DialogFC = ({ open, onClose }) => {
  const { t } = useTranslation("common", { keyPrefix: "dialog.logOut" });

  const router = useRouter();
  const plausible = usePlausible();
  const { setUser } = useContext(UserContext);

  const [loading, toggleLoading] = useToggle();

  function handleSubmit() {
    withLoading(
      async () => {
        // Track event
        plausible("Log out");

        // Log the user out
        setUser(null);
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
