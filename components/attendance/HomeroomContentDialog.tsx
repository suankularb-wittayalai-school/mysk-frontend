import useHomeroomContent from "@/utils/helpers/attendance/useHomeroomContent";
import { HomeroomContent } from "@/utils/types/attendance";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  TextField,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";

/**
 * Dialog to edit Homeroom Content.
 *
 * @param open Whether the dialog is open and shown.
 * @param homeroomContent The Homeroom Content to edit.
 * @param classroomID The ID of the Classroom that this Homeroom Content is for.
 * @param onClose Triggers when the Dialog is closed.
 */
const HomeroomContentDialog: StylableFC<{
  open?: boolean;
  homeroomContent: HomeroomContent;
  classroomID: string;
  onClose: () => void;
}> = ({ open, homeroomContent, classroomID, onClose, style, className }) => {
  const { t } = useTranslation("attendance", {
    keyPrefix: "day.dialog.homeroom",
  });

  const { field, setField, handleCancel, handleSave, loading } =
    useHomeroomContent(homeroomContent, classroomID, onClose, onClose);

  return (
    <Dialog open={open} onClose={onClose} style={style} className={className}>
      <DialogHeader desc={t("desc")} />
      <DialogContent className="px-6">
        <TextField<string>
          appearance="outlined"
          label={t("field")}
          behavior="multi-line"
          value={field}
          onChange={setField}
          inputAttr={{ readOnly: loading }}
          className="[&_textarea]:min-h-32"
        />
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={handleCancel}>
          {t("action.cancel")}
        </Button>
        <Button appearance="text" disabled={loading} onClick={handleSave}>
          {t("action.save")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default HomeroomContentDialog;
