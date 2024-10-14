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
  onSubmit: ({ date, classroom }: { date: string; classroom: string }) => void;
}> = ({ open, view, type, onClose, onSubmit, style, className }) => {
  const { t } = useTranslation("attendance/dateDialog");

  const router = useRouter();
  const supabase = useSupabaseClient();
  const { setSnackbar } = useContext(SnackbarContext);

  const [loading, setLoading] = useState(false);

  const { form, openFormSnackbar, formOK, formProps } = useForm<
    "date" | "classroom"
  >([
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
        <Button
          appearance="text"
          loading={loading}
          onClick={async () => {
            openFormSnackbar();
            if (!formOK) return;

            // Only validate Classroom if the Selector Type is Classroom.
            if (type !== SelectorType.classroom) {
              onSubmit(form);
              return;
            }

            // Check if the Classroom exists.
            setLoading(true);
            const { error } = await getClassroomByNumber(
              supabase,
              Number(form.classroom),
            );
            setLoading(false);

            if (error)
              setSnackbar(<Snackbar>{t("snackbar.classNotFound")}</Snackbar>);
            else onSubmit(form);
          }}
        >
          {t("action.go")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default AttendanceDatePickerDialog;
