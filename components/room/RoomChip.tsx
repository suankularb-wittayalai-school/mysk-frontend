import SnackbarContext from "@/contexts/SnackbarContext";
import { StylableFC } from "@/utils/types/common";
import { InputChip, Snackbar } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

const RoomChip: StylableFC<{ room: string }> = ({ room, style, className }) => {
  const { t } = useTranslation("common");
  const { setSnackbar } = useContext(SnackbarContext);

  return (
    <InputChip
      onClick={() => {
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
