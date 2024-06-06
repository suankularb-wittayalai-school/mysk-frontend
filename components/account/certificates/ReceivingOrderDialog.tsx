import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogHeader,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";

/**
 * A Dialog that shows the user’s receiving order number.
 *
 * @param open Whether the dialog is open and shown.
 * @param receivingOrder Receiving order number.
 * @param onClose Triggers when the Dialog is closed.
 */
const ReceivingOrderDialog: StylableFC<{
  open?: boolean;
  receivingOrder: number;
  onClose: () => void;
}> = ({ open, receivingOrder, onClose, style, className }) => {
  const { t } = useTranslation("account/certificates/receivingOrderDialog");

  return (
    <Dialog
      open={open}
      width={312}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader
        title={t("title", { order: receivingOrder })}
        desc={t("desc", {
          order: t("common:ordinal", { count: receivingOrder }),
        })}
      />
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.done")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ReceivingOrderDialog;
