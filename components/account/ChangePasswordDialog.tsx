// External libraries
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

// SK Components
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Snackbar,
  TextField,
} from "@suankularb-components/react";

// Contexts
import SnackbarContext from "@/contexts/SnackbarContext";

// Backend
import { changePassword } from "@/utils/backend/account";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { DialogComponent } from "@/utils/types/common";

/**
 * The user can change their password by entering their current password and
 * their new password twice in this Dialog.
 *
 * @returns A Dialog.
 */
const ChangePasswordDialog: DialogComponent = ({ open, onClose }) => {
  const { t } = useTranslation("account");

  const { setSnackbar } = useContext(SnackbarContext);

  const { form, resetForm, formOK, formProps } = useForm<
    "originalPassword" | "newPassword" | "confirmNewPassword"
  >([
    { key: "originalPassword", required: true },
    { key: "newPassword", required: true },
    { key: "confirmNewPassword", required: true },
  ]);

  const supabase = useSupabaseClient();
  const user = useUser();

  const [loading, toggleLoading] = useToggle();

  /**
   * Validate the form and submit the password change to Supabase.
   */
  function handleSubmit() {
    withLoading(async () => {
      // General form validation:
      // `formOK` in this case checks for missing fields;
      // the equality check ensures the 2 new password fields have the same
      // value.
      if (!(formOK && form.newPassword === form.confirmNewPassword)) {
        setSnackbar(
          <Snackbar>{t("snackbar.formInvalid", { ns: "common" })}</Snackbar>
        );
        return false;
      }

      // Submit the password change to Supabase
      const { error } = await changePassword(supabase, form, user!);
      if (error) {
        setSnackbar(
          <Snackbar>
            {
              // The 400 status means the current password submitted was
              // incorrect
              error.status === 400
                ? t("dialog.changePassword.snackbar.invalidPwd")
                : // General error message
                  t("snackbar.failure", { ns: "common" })
            }
          </Snackbar>
        );
        return false;
      }

      onClose();
      resetForm();

      // Inform the user the procedure was successful
      setSnackbar(
        <Snackbar>{t("dialog.changePassword.snackbar.success")}</Snackbar>
      );

      return true;
    }, toggleLoading);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title={t("dialog.changePassword.title")}
        desc={t("dialog.changePassword.desc")}
      />

      <DialogContent className="flex flex-col gap-y-6 px-6">
        {/* Original password */}
        <TextField
          appearance="outlined"
          label="Original password"
          inputAttr={{ type: "password" }}
          {...formProps.originalPassword}
        />

        {/* New password */}
        <TextField
          appearance="outlined"
          label="New password"
          inputAttr={{ type: "password" }}
          {...formProps.newPassword}
        />

        {/* Confirm new password */}
        <TextField
          appearance="outlined"
          label="Confirm new password"
          inputAttr={{ type: "password" }}
          {...formProps.confirmNewPassword}
        />
      </DialogContent>

      <Actions>
        {/* Cancel */}
        <Button appearance="text" onClick={onClose}>
          {t("dialog.changePassword.action.cancel")}
        </Button>

        {/* Save */}
        <Button
          appearance="text"
          onClick={handleSubmit}
          loading={loading || undefined}
        >
          {t("dialog.changePassword.action.save")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
