import SeatGraphic from "@/components/account/certificates/SeatGraphic";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Text,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * A Dialog that shows the user’s seat in the Suankularb Ramluek hall.
 *
 * @param open Whether the dialog is open and shown.
 * @param seat Seat code. Should be in the format of row-column, e.g. A-1. If the seat is an extra seat, it should be in the format of row-สcolumn, e.g. A-ส1.
 * @param onClose Triggers when the Dialog is closed.
 */
const SeatDialog: StylableFC<{
  open?: boolean;
  seat: string;
  onClose: () => void;
}> = ({ open, seat, onClose, style, className }) => {
  const { t } = useTranslation("account", {
    keyPrefix: "certificates.dialog.seat",
  });
  const { t: tx } = useTranslation("common");

  if (!/[A-Z]\d?-(\u0E2A)?\d{1,2}/.test(seat)) return null;

  const row = seat.slice(0, 2).replace("-", "");
  const column = Number(seat.slice(-2).replace(/\u0E2A|-/, ""));
  const isExtra = seat.includes("\u0E2A");

  return (
    <Dialog
      open={open}
      width={360}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader
        title={t("title", { seat })}
        desc={t("desc", {
          column: tx("ordinal", { count: column, ordinal: true }),
          row,
        })}
        className="!pb-0"
      />
      <DialogContent>
        {isExtra && (
          <Text
            type="body-medium"
            element="p"
            className="mt-4 px-6 text-on-surface-variant"
          >
            {t("extra")}
          </Text>
        )}
        <SeatGraphic row={row} column={column} />
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.done")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default SeatDialog;
