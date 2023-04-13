// External libraries
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Actions,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  TextField,
} from "@suankularb-components/react";

// Helpers
import { withLoading } from "@/utils/helpers/loading";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useToggle } from "@/utils/hooks/toggle";

// Types
import { DialogComponent } from "@/utils/types/common";

/**
 * The final Dialog of Forgor, where the user was just verified and enters
 * their new password.
 * 
 * Read about the full process in `/pages/_app.tsx`.
 * 
 * @returns A Dialog.
 */
const ForgorDialog: DialogComponent = ({ open, onClose }) => {
  const { t } = useTranslation("common", {
    keyPrefix: "dialog.completeForgor",
  });

  const { form, formOK, formProps } = useForm<"newPwd" | "confirmNewPwd">([
    {
      key: "newPwd",
      required: true,
      validate: (value: string) =>
        value.length < 8 ? t("newPwd_error") : true,
    },
    {
      key: "confirmNewPwd",
      required: true,
      validate: (value: string) =>
        value.length < 8 ? t("newPwd_error") : true,
    },
  ]);

  const supabase = useSupabaseClient();
  const [loading, toggleLoading] = useToggle();
  async function handleSubmit() {
    if (!(formOK && form.newPwd === form.confirmNewPwd)) return;

    withLoading(async () => {
      const { data, error } = await supabase.auth.updateUser({
        password: form.newPwd,
      });

      if (error) {
        console.error(error);
        return false;
      }

      if (data) onClose();
      return true;
    }, toggleLoading);
  }

  return (
    <Dialog {...{ open, onClose }}>
      <DialogHeader title={t("title")} desc={t("desc")} />
      <DialogContent className="flex flex-col gap-6 px-6">
        <TextField
          appearance="outlined"
          label={t("form.newPwd")}
          inputAttr={{ type: "password" }}
          {...formProps.newPwd}
        />
        <TextField
          appearance="outlined"
          label={t("form.confirmNewPwd")}
          inputAttr={{ type: "password" }}
          {...formProps.confirmNewPwd}
        />
      </DialogContent>
      <Actions>
        <Button
          appearance="text"
          loading={loading || undefined}
          onClick={handleSubmit}
        >
          {t("action.set")}
        </Button>
      </Actions>
    </Dialog>
  );
};

export default ForgorDialog;
