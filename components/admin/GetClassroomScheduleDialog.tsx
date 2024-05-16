import SnackbarContext from "@/contexts/SnackbarContext";
import getClassroomByNumber from "@/utils/backend/classroom/getClassroomByNumber";
import useForm from "@/utils/helpers/useForm";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { classRegex } from "@/utils/patterns";
import { Classroom } from "@/utils/types/classroom";
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
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { useContext } from "react";

/**
 * A Dialog to get the Classroom to load the Schedule for. Doesn’t actually load
 * the Schedule, just gets the Classroom.
 * 
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the Classroom is submitted.
 */
const GetClassroomScheduleDialog: StylableFC<{
  open?: boolean;
  onClose: () => void;
  onSubmit: (classroom: Pick<Classroom, "id" | "number">) => void;
}> = ({ open, onClose, onSubmit, style, className }) => {
  const { t } = useTranslation("admin", {
    keyPrefix: "schedule.dialog.getClassroom",
  });
  const { t: tx } = useTranslation("common");

  const { form, formOK, openFormSnackbar, formProps } = useForm<"classroom">([
    {
      key: "classroom",
      validate: (value: string) => classRegex.test(value),
      required: true,
    },
  ]);

  const plausible = usePlausible();
  const supabase = useSupabaseClient();
  const { setSnackbar } = useContext(SnackbarContext);

  const [loading, toggleLoading] = useToggle();

  /** Fetches the Classroom (with ID) via the given number. */
  async function handleSubmit() {
    openFormSnackbar();
    if (!formOK) return false;
    plausible("Get Classroom Schedule to Edit");

    const { data: classroom, error: classroomError } =
      await getClassroomByNumber(supabase, form.classroom);
    if (classroomError) {
      setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      return false;
    }
    onSubmit(classroom);

    return true;
  }

  return (
    <Dialog
      open={open}
      width={312}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader title={t("title")} desc={t("desc")} />
      <DialogContent className="px-6">
        <TextField
          appearance="outlined"
          label={t("form.classroom")}
          {...formProps.classroom}
        />
      </DialogContent>
      <Actions>
        <Button appearance="text" onClick={onClose}>
          {t("action.cancel")}
        </Button>
        <Button
          appearance="text"
          loading={loading}
          onClick={() =>
            withLoading(handleSubmit, toggleLoading, { hasEndToggle: true })
          }
        >
          {t("action.go")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default GetClassroomScheduleDialog;
