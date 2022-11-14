// External libraries
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Backend
import { db2Class } from "@utils/backend/database";

// Helpers
import { getCurrentAcademicYear } from "@utils/helpers/date";
import { withLoading } from "@utils/helpers/loading";

// Hooks
import { useToggle } from "@utils/hooks/toggle";

// Types
import { Class } from "@utils/types/class";
import { SubmittableDialogProps } from "@utils/types/common";

// Miscellaneous
import { classPattern, classRegex } from "@utils/patterns";

const AddClassDialog = ({
  show,
  onClose,
  onSubmit,
}: SubmittableDialogProps<(classroom: Class) => void>): JSX.Element => {
  const { t } = useTranslation("common");
  const supabase = useSupabaseClient();

  const [loading, toggleLoading] = useToggle();

  // Form control
  const [number, setNumber] = useState<string>("");

  function validate(): boolean {
    return classRegex.test(number);
  }

  return (
    <Dialog
      type="regular"
      label="add-class"
      title={t("dialog.addClass.title")}
      actions={[
        { name: t("dialog.addClass.action.cancel"), type: "close" },
        {
          name: t("dialog.addClass.action.add"),
          type: "submit",
          disabled: !validate() || loading,
        },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={() =>
        withLoading(
          async () => {
            const { data, error } = await supabase
              .from("classroom")
              .select("*")
              .match({ number, year: getCurrentAcademicYear() })
              .limit(1)
              .single();

            if (error) {
              console.error(error);
              return false;
            }

            onSubmit(await db2Class(supabase, data));
            return true;
          },
          toggleLoading,
          { hasEndToggle: true }
        )
      }
    >
      <DialogSection name="input">
        <KeyboardInput
          name="class"
          type="text"
          label={t("dialog.addClass.class")}
          helperMsg={t("dialog.addClass.class_helper")}
          errorMsg={t("dialog.addClass.class_error")}
          useAutoMsg
          onChange={(e) => setNumber(e)}
          attr={{ pattern: classPattern }}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddClassDialog;
