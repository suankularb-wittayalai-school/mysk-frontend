import useForm from "@/utils/helpers/useForm";
import { YYYYMMDDRegex, YYYYWwwRegex, classRegex } from "@/utils/patterns";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  TextField,
} from "@suankularb-components/react";
import { getWeek, getYear, isPast, isWeekend } from "date-fns";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { AttendanceView, SelectorType } from "./AttendanceViewSelector";

/**
 * A Dialog for selecting a date to jump to in the Attendance pages.
 *
 * @param open Whether the dialog is open and shown.
 * @param view The Attendance View of the page.
 * @param formProps The props for the form fields: date and classroom.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the Go Button is pressed.
 */
const AttendanceDatePickerDialog: StylableFC<{
  open?: boolean;
  view: AttendanceView;
  type: SelectorType;
  onClose: () => void;
  onSubmit: ({ date, classroom }: { date: string; classroom: string }) => void;
}> = ({ open, view, type, onClose, onSubmit, style, className }) => {
  const { t } = useTranslation("attendance", {
    keyPrefix: "viewSelector.dialog.date",
  });

  const router = useRouter();

  const { form, formProps } = useForm<"date" | "classroom">([
    {
      key: "date",
      defaultValue: router.query.date as string,
      validate: (value: string) =>
        [
          YYYYMMDDRegex.test(value) &&
            !isWeekend(new Date(value)) &&
            isPast(new Date(value)),
          YYYYWwwRegex.test(value) &&
            Number(value.slice(0, 4)) <= getYear(new Date()) &&
            Number(value.slice(6, 8)) <= getWeek(new Date()),
        ][view],
      required: true,
    },
    {
      key: "classroom",
      defaultValue:
        type === SelectorType.classroom ? router.query.classNumber : "",
      validate: (value: string) => classRegex.test(value),
      required: type === SelectorType.classroom,
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
      <DialogHeader desc={t("desc")} />
      <DialogContent className="grid gap-6 px-6">
        <TextField
          appearance="outlined"
          label={t("form.date")}
          {...formProps.date}
          inputAttr={
            [
              { type: "date", placeholder: "YYYY-MM-DD" },
              { type: "month", placeholder: "YYYY-MM" },
            ][view]
          }
        />
        {type === SelectorType.classroom && (
          <TextField
            appearance="outlined"
            label={t("form.classroom")}
            {...formProps.classroom}
          />
        )}
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button appearance="text" onClick={() => onSubmit(form)}>
          {t("action.go")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AttendanceDatePickerDialog;
