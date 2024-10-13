import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
  MaterialIcon,
} from "@suankularb-components/react";
import { usePlausible } from "next-plausible";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";

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
  const { t } = useTranslation("landing/accountNotFoundDialog");

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
          <Trans
            i18nKey="landing/accountNotFoundDialog:desc"
            components={{
              0: (
                <a
                  href={process.env.NEXT_PUBLIC_HELP_FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    onClose();
                    plausible("Open Report Form", {
                      props: {
                        location: "Account Not Found Dialog",
                        category: "Mysk", // Spelled this way due to past Plausible data
                      },
                    });
                  }}
                  className="link"
                />
              ),
            }}
          />
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
