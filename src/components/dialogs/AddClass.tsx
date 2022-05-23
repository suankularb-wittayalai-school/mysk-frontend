// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

const AddClassDialog = ({
  show,
  onClose,
}: DialogProps & { onSubmit: Function }): JSX.Element => {
  const { t } = useTranslation("common");

  return (
    <Dialog
      type="regular"
      label="add-class"
      title={t("dialog.addClass.title")}
      actions={[
        { name: t("dialog.addClass.action.cancel"), type: "close" },
        { name: t("dialog.addClass.action.add"), type: "submit" },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={() => onClose()}
    >
      <DialogSection name="input">
        <KeyboardInput
          name="class"
          type="text"
          label={t("dialog.addClass.class")}
          helperMsg={t("dialog.addClass.class_helper")}
          errorMsg={t("dialog.addClass.class_error")}
          useAutoMsg
          onChange={() => {}}
          attr={{ pattern: "[1-6][0-1][1-9]" }}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddClassDialog;
