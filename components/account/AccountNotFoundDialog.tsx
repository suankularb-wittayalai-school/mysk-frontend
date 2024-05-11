import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
  MaterialIcon,
} from "@suankularb-components/react";
import { Trans, useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";

/**
 * A Dialog that shows when GSI succeeds but the account is not found within
 * MySK.
 *
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const AccountNotFoundDialog: StylableFC<{
  open?: boolean;
  onClose: () => void;
}> = ({ open, onClose, style, className }) => {
  const { t } = useTranslation("landing", {
    keyPrefix: "dialog.accountNotFound",
  });

  const plausible = usePlausible();

  return (
    <Dialog
      open={open}
      width={312}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader
        icon={<MaterialIcon icon="error" />}
        title={t("title")}
        desc={
          <Trans i18nKey="desc" t={t}>
            <a
              href={process.env.NEXT_PUBLIC_HELP_FORM_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                onClose();
                plausible("Open Report Form", {
                  props: { location: "Account Not Found Dialog" },
                });
              }}
              className="link"
            />
          </Trans>
        }
      />
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.gotIt")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AccountNotFoundDialog;
