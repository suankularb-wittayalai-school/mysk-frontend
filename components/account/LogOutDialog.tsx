import UserContext from "@/contexts/UserContext";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
} from "@suankularb-components/react";
import { usePlausible } from "next-plausible";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext } from "react";

/**
 * Asks the user to confirm their log out.
 *
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const LogOutDialog: StylableFC<{
  open?: boolean;
  onClose: () => void;
}> = ({ open, onClose, style, className }) => {
  const { t } = useTranslation("account/logOutDialog");

  const router = useRouter();
  const plausible = usePlausible();
  const { setUser } = useContext(UserContext);

  function handleSubmit() {
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
  }

  return (
    <Dialog
      open={open}
      width={312}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader title={t("title")} desc={t("desc")} />
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.back")}
        </Button>
        <Button appearance="text" dangerous onClick={handleSubmit}>
          {t("action.logOut")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default LogOutDialog;
