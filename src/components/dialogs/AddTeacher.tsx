// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// SK Components
import { Dialog, DialogSection, Dropdown } from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";
import { useSubjectGroupOption } from "@utils/hooks/subject";
import { useTeacherOption } from "@utils/hooks/teacher";
import { nameJoiner } from "@utils/helpers/name";
import { useState } from "react";

const AddTeacherDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: Function }): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const SubjectGroups = useSubjectGroupOption();
  const teachers = useTeacherOption(selectedGroup);

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
      onSubmit={() => onSubmit()}
    >
      {console.log(teachers, selectedGroup)}
      <DialogSection>
        <Dropdown
          name="subject-group"
          label={t("dialog.addTeacher.subjectGroup")}
          options={SubjectGroups.map((group) => ({
            value: group.id,
            label: group.name[locale],
          }))}
          onChange={(e: number) => setSelectedGroup(e)}
        />
        <Dropdown
          name="teacher"
          label={t("dialog.addTeacher.teacher")}
          options={teachers.map((teacher) => ({
            value: teacher.id,
            label: nameJoiner(locale, teacher.name),
          }))}
        />
      </DialogSection>
    </Dialog>
  );
};

export default AddTeacherDialog;
