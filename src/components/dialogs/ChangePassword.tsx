// Modules
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Components
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";

// Backend
import { changePassword } from "@utils/backend/account";

const ChangePassword = ({ show, onClose }: DialogProps): JSX.Element => {
  const { t } = useTranslation("account");
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  return (
    <>
      <Dialog
        type="regular"
        label="change-password"
        title={t("dialog.changePassword.title")}
        supportingText={t("dialog.changePassword.supportingText")}
        actions={[
          { name: t("dialog.changePassword.action.cancel"), type: "close" },
          { name: t("dialog.changePassword.action.save"), type: "submit" },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => {
          changePassword();
          onClose();
        }}
      >
        {/* FIXME: Once `name` is no longer necessary, remove it */}
        <DialogSection name="">
          <KeyboardInput
            name="original-password"
            type="password"
            label={t("dialog.changePassword.originalPwd")}
            onChange={() => {}}
          />
          <KeyboardInput
            name="new-password"
            type="password"
            label={t("dialog.changePassword.newPwd")}
            onChange={() => {}}
          />
          <KeyboardInput
            name="confirm-new-password"
            type="password"
            label={t("dialog.changePassword.confirmNewPwd")}
            onChange={() => {}}
          />
        </DialogSection>
      </Dialog>
      <DiscardDraft
        show={showDiscard}
        onClose={() => setShowDiscard(false)}
        onSubmit={() => {
          setShowDiscard(false);
          onClose();
        }}
      />
    </>
  );
};

export default ChangePassword;
