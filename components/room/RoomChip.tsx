import SnackbarContext from "@/contexts/SnackbarContext";
import { StylableFC } from "@/utils/types/common";
import { InputChip, Snackbar } from "@suankularb-components/react";
import va from "@vercel/analytics";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

/**
 * An Input Chip that displays a room code.
 *
 * @param room The room code to display.
 */
const RoomChip: StylableFC<{ room: string }> = ({ room, style, className }) => {
  const { t } = useTranslation("common");
  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <InputChip
      onClick={() => {
        va.track("Copy Room Code");
        navigator.clipboard.writeText(room);
        setSnackbar(<Snackbar>{t("snackbar.copiedToClipboard")}</Snackbar>);
      }}
      style={style}
      className={className}
    >
      {room}
    </InputChip>
  );
};

export default RoomChip;
