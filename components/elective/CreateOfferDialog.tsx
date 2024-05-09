import SnackbarContext from "@/contexts/SnackbarContext";
import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import getStudentIDByEmail from "@/utils/backend/person/getStudentIDByFiveDigitID";
import logError from "@/utils/helpers/logError";
import useForm from "@/utils/helpers/useForm";
import useRefreshProps from "@/utils/helpers/useRefreshProps";
import useToggle from "@/utils/helpers/useToggle";
import withLoading from "@/utils/helpers/withLoading";
import { schoolEmailRegex } from "@/utils/patterns";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  MaterialIcon,
  Snackbar,
  TextField,
} from "@suankularb-components/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import { useContext } from "react";

/**
 * A Dialog for creating an Elective Trade Offer with a friend.
 *
 * @param open Whether the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 */
const CreateOfferDialog: StylableFC<{
  open?: boolean;
  onClose: () => void;
}> = ({ open, onClose, style, className }) => {
  const { t } = useTranslation("elective", {
    keyPrefix: "dialog.createRequest",
  });
  const { t: tx } = useTranslation("common");

  const plausible = usePlausible();
  const refreshProps = useRefreshProps();
  const { setSnackbar } = useContext(SnackbarContext);
  const [loading, toggleLoading] = useToggle();

  const supabase = useSupabaseClient();
  const mysk = useMySKClient();

  const { form, setForm, resetForm, openFormSnackbar, formOK, formProps } =
    useForm<"email">([
      {
        key: "email",
        defaultValue: "",
        validate: (value: string) =>
          schoolEmailRegex.test(value) && value !== mysk.user?.email,
        required: true,
      },
    ]);

  /**
   * Validates and sends the request to the API.
   *
   * @returns Boolean of success.
   */
  async function handleSubmit() {
    // Special case: cannot trade with oneself. Thought this was funny.
    // Try it and let me know if it was funny.
    if (form.email === mysk.user?.email) {
      plausible("Attempt to Trade Electives with Self");
      setSnackbar(<Snackbar>{t("snackbar.self")}</Snackbar>);
      return false;
    }

    // Validate the form.
    openFormSnackbar();
    if (loading || !formOK) return false;

    // Get the recipient's database ID.
    const { data: recipientID, error: recipientIDError } =
      await getStudentIDByEmail(supabase, form.email);
    if (!recipientID) {
      if (recipientIDError)
        setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      else setSnackbar(<Snackbar>{t("snackbar.notFound")}</Snackbar>);
      return false;
    }

    // Send the request to the API.
    const { error } = await mysk.fetch(`/v1/subjects/electives/trade-offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fetch_level: "id_only",
        data: { receiver_id: recipientID },
      }),
    });
    if (error) {
      if (error.code === 400 || error.code === 403)
        setSnackbar(<Snackbar>{t("snackbar.notAllowed")}</Snackbar>);
      else setSnackbar(<Snackbar>{tx("snackbar.failure")}</Snackbar>);
      logError("handleSubmit", error);
      return false;
    }

    plausible("Send Elective Trade Offer", {
      props: (mysk.person as Student).classroom
        ? { classroom: `M.${(mysk.person as Student).classroom!.number}` }
        : undefined,
    });

    // Reflect the success to the user.
    await refreshProps();
    setSnackbar(<Snackbar>{t("snackbar.success")}</Snackbar>);
    onClose();
    resetForm();
    return true;
  }

  return (
    <Dialog
      open={open}
      width={300}
      onClose={onClose}
      style={style}
      className={className}
    >
      <DialogHeader
        icon={<MaterialIcon icon="group" />}
        title={t("title")}
        desc={t("desc")}
      />
      <DialogContent className="px-6">
        <TextField
          appearance="outlined"
          label={t("form.email")}
          disabled={loading}
          {...formProps.email}
          inputAttr={{
            type: "email",
            // Auto-append the school email domain.
            onKeyUp: ({ key }) =>
              key === "@" &&
              !form.email.includes("student.sk.ac.th") &&
              setForm({ email: form.email + "student.sk.ac.th" }),
          }}
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
          {t("action.send")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default CreateOfferDialog;
