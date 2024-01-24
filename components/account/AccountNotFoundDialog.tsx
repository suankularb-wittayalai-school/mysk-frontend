// Imports
import { DialogFC } from "@/utils/types/component";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  MaterialIcon,
  Text,
} from "@suankularb-components/react";
import { forwardRef } from "react";
import { Trans, useTranslation } from "next-i18next";

const AccountNotFoundDialog: DialogFC = ({ open, onClose }) => {
  const { t } = useTranslation("common", {
    keyPrefix: "dialog.accountNotFound",
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        icon={<MaterialIcon icon="error" />}
        title={t("title")}
        desc={
          <Trans
            i18nKey="dialog.accountNotFound.desc"
            ns="common"
            components={{ strong: <strong className="text-tertiary" /> }}
          />
        }
      />
      <DialogContent className="-mt-3 px-6">
        <Text
          type="body-medium"
          element="p"
          className="text-on-surface-variant"
        >
          {t("contact")}
        </Text>
      </DialogContent>
      <Actions className="!justify-between">
        <Button
          appearance="text"
          onClick={onClose}
          href={process.env.NEXT_PUBLIC_HELP_FORM_URL}
          // eslint-disable-next-line react/display-name
          element={forwardRef((props, ref) => (
            <a ref={ref} {...props} target="_blank" rel="noreferrer" />
          ))}
        >
          {t("action.report")}
        </Button>
        <Button appearance="text" onClick={onClose}>
          {t("action.tryAgain")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AccountNotFoundDialog;
