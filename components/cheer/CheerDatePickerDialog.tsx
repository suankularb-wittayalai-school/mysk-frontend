import {
  AttendanceView,
  SelectorType,
} from "@/components/attendance/AttendanceViewSelector";
import SnackbarContext from "@/contexts/SnackbarContext";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import getISODateString from "@/utils/helpers/getISODateString";
import lastWeekday from "@/utils/helpers/lastWeekday";
import useForm from "@/utils/helpers/useForm";
import { YYYYMMDDRegex, YYYYMMRegex, classRegex } from "@/utils/patterns";
import { StylableFC } from "@/utils/types/common";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { isFuture, isPast, isWeekend } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

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
  const { t } = useTranslation("attendance/viewSelector/dialog");

  const router = useRouter();

  const { form, openFormSnackbar, formOK, formProps } = useForm<"date">([
    {
      key: "date",
      defaultValue: router.query.date as string,
      validate: (value: string) =>
        ({
          date:
            YYYYMMDDRegex.test(value) &&
            !isWeekend(new Date(value)) &&
            // Converting to UTC here means using the client’s midnight time.
            !isFuture(toZonedTime(new Date(value), "Etc/UTC")),
          month: YYYYMMRegex.test(value) && isPast(new Date(value)),
        })[view],
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
      <DialogHeader desc={t("date.desc")} />
      <DialogContent className="grid gap-6 px-6">
        <TextField
          appearance="outlined"
          label={t("date.form.date")}
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
          {t("date.action.cancel")}
        </Button>
        <Button
          appearance="text"
          onClick={async () => {
            openFormSnackbar();
            if (!formOK) return;
            onSubmit(form);
          }}
        >
          {t("date.action.go")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AttendanceDatePickerDialog;
