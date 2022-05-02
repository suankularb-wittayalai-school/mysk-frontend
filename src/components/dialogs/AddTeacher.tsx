// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog, DialogSection, Dropdown } from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";

const AddTeacherDialog = ({
  show,
  onClose,
}: DialogProps & { onSubmit: Function }): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

  return (
    <Dialog
      type="regular"
      label="add-teacher"
      title={t("dialog.addTeacher.title")}
      supportingText={t("dialog.addTeacher.supportingText")}
      actions={[
        { name: t("dialog.addTeacher.action.cancel"), type: "close" },
        { name: t("dialog.addTeacher.action.add"), type: "submit" },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={() => onClose()}
    >
      <DialogSection>
        <Dropdown
          name="subject-group"
          label={t("dialog.addTeacher.subjectGroup")}
          options={[]}
        />
        <Dropdown
          name="teacher"
          label={t("dialog.addTeacher.teacher")}
          options={[]}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddTeacherDialog;
