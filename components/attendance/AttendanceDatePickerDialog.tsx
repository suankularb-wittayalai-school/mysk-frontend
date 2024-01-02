import { AttendanceView } from "@/utils/helpers/attendance/useAttendanceView";
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
 * A Dialog for selecting a date to jump to in the Attendance pages.
 *
 * @param open Whether the dialog is open and shown.
 * @param dateField The date to display in the date field.
 * @param view The Attendance View of the page.
 * @param onClose Triggers when the Dialog is closed.
 * @param onDateFieldChange Triggers when the date field is changed.
 * @param onSubmit Triggers when the Go Button is pressed.
 */
const AttendanceDatePickerDialog: StylableFC<{
  open?: boolean;
  dateField: string;
  view: AttendanceView;
  onClose: () => void;
  onDateFieldChange: (value: string) => void;
  onSubmit: () => void;
}> = ({
  open,
  dateField,
  view,
  onClose,
  onDateFieldChange,
  onSubmit,
  style,
  className,
}) => {
  const { t } = useTranslation("attendance", {
    keyPrefix: "viewSelector.dialog.date",
  });

  return (
    <Dialog
      open={open}
      width={320}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader desc={t("desc")} />
      <DialogContent className="px-6">
        <TextField<string>
          appearance="outlined"
          label={t("field")}
          value={dateField}
          onChange={onDateFieldChange}
          inputAttr={
            [
              { type: "date", placeholder: "YYYY-MM-DD" },
              { type: "week", placeholder: "YYYY-Www" },
            ][view]
          }
        />
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button appearance="text" onClick={onSubmit}>
          {t("action.go")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AttendanceDatePickerDialog;
