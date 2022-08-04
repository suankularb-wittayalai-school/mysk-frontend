// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import { Dialog } from "@suankularb-components/react";

// Backend
import { setAuthCookies } from "@utils/backend/account";

// Types
import { DialogProps } from "@utils/types/common";

// Supabase
import { supabase } from "@utils/supabaseClient";

const LogOutDialog = ({ show, onClose }: DialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

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
      onClose={() => onClose()}
      onSubmit={async () => {
        setLoading(true);
        await supabase.auth.signOut();
        await setAuthCookies("SIGNED_OUT");
        router.reload();
      }}
    />
  );
};

export default LogOutDialog;
