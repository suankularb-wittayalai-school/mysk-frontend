// External libraries
import { useTranslation } from "next-i18next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// SK Components
import { Dialog } from "@suankularb-components/react";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { DialogProps } from "@utils/types/common";

const LogOutDialog = ({ show, onClose }: DialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const supabase = useSupabaseClient();

  const [loading, toggleLoading] = useToggle();

  return (
    <Dialog
      type="regular"
      label="log-out"
      title={t("dialog.logOut.title")}
      supportingText={t("dialog.logOut.supportingText")}
      actions={[
        {
          name: t("dialog.logOut.action.back"),
          type: "close",
        },
        {
          name: t("dialog.logOut.action.logOut"),
          type: "submit",
          disabled: loading,
          isDangerous: true,
        },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={async () => {
        toggleLoading();
        await supabase.auth.signOut();
      }}
    />
  );
};

export default LogOutDialog;
