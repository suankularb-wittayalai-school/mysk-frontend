import {
  AttendanceView,
  SelectorType,
} from "@/components/attendance/AttendanceViewSelector";
import getISODateString from "@/utils/helpers/getISODateString";
import lastWeekday from "@/utils/helpers/lastWeekday";
import useForm from "@/utils/helpers/useForm";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  TextField,
} from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

/**
 * A Dialog for selecting a date to jump to in the Attendance pages.
 *
 * @param open Whether the dialog is open and shown.
 * @param view The Attendance View of the page.
 * @param type The Selector Type of the page.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the Go Button is pressed.
 */
const AttendanceDatePickerDialog: StylableFC<{
  open?: boolean;
  view: AttendanceView;
  type: SelectorType;
  onClose: () => void;
  onSubmit: ({ date }: { date: string }) => void;
}> = ({ open, view, onClose, onSubmit, style, className }) => {
  const { t } = useTranslation("attendance/cheer");

  const router = useRouter();

  const { form, openFormSnackbar, formOK, formProps } = useForm<"date">([
    {
      key: "date",
      defaultValue: router.query.date as string,
      required: true,
    },
  ]);

  return (
    <Dialog
      open={open}
      width={320}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader desc={t("dateDialog.desc")} />
      <DialogContent className="grid gap-6 px-6">
        <TextField
          appearance="outlined"
          label={t("dateDialog.form.date")}
          {...formProps.date}
          inputAttr={
            {
              date: {
                type: "date",
                placeholder: "YYYY-MM-DD",
                max: getISODateString(lastWeekday(new Date())),
              },
              month: {
                type: "month",
                placeholder: "YYYY-MM",
                max: getISODateString(new Date()).substring(0, 7),
              },
            }[view]
          }
        />
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("dateDialog.action.cancel")}
        </Button>
        <Button
          appearance="text"
          onClick={async () => {
            openFormSnackbar();
            if (!formOK) return;
            onSubmit(form);
          }}
        >
          {t("dateDialog.action.go")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AttendanceDatePickerDialog;
