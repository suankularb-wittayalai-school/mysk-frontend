// Modules
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

const AddOptionDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: (label: string) => void }): JSX.Element => {
  const { t } = useTranslation("admin");
  const [label, setLabel] = useState<string>("");

  return (
    <Dialog
      type="regular"
      label="add-option"
      title={t("dialog.addOption.title")}
      actions={[
        { name: t("dialog.addOption.action.cancel"), type: "close" },
        { name: t("dialog.addOption.action.add"), type: "submit" },
      ]}
      show={show}
      onClose={onClose}
      onSubmit={() => onSubmit(label)}
    >
      <DialogSection name="input">
        <KeyboardInput
          name="label"
          type="text"
          label={t("dialog.addOption.label")}
          onChange={(e) => setLabel(e)}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddOptionDialog;
