// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog } from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

// Backend
import { logOut } from "@utils/backend/account";

const LogOutDialog = ({ show, onClose }: DialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const router = useRouter();

  return (
    <Dialog
      type="regular"
      label="log-out"
      title={t("dialog.logOut.title")}
      supportingText={t("dialog.logOut.supportingText")}
      actions={[
        {
          name: t("dialog.logOut.action.logOut"),
          type: "submit",
          isDangerous: true,
        },
        {
          name: t("dialog.logOut.action.back"),
          type: "close",
        },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={async () => {
        onClose();
        logOut();
        router.push("/");
      }}
    ></Dialog>
  );
};

export default LogOutDialog;
