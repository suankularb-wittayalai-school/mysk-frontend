// Modules
import { useTranslation } from "next-i18next";

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";
import { Student } from "@utils/types/person";
import { useRouter } from "next/router";

const EditStudentDialog = ({
  show,
  onClose,
  mode,
  student,
}: DialogProps & { mode: "add" | "edit"; student?: Student }): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const { t } = useTranslation(["account", "admin", "common"]);

  // Dummybase
  const classes = [
    {
      id: 509,
      name: {
        "en-US": "M.509",
        th: "ม.509",
      },
    },
  ];

  return (
    <Dialog
      type="large"
      label={mode == "add" ? "add-student" : "edit-student"}
      title={t(`studentList.dialog.editStudent.title.${mode}`, { ns: "admin" })}
      show={show}
      onClose={onClose}
      actions={[
        {
          name: t("studentList.dialog.editStudent.action.cancel", {
            ns: "admin",
          }),
          type: "close",
        },
        {
          name: t("studentList.dialog.editStudent.action.save", {
            ns: "admin",
          }),
          type: "submit",
        },
      ]}
    >
      {/* Local name */}
      <DialogSection name={t("profile.name.title")} isDoubleColumn>
        <Dropdown
          name="prefix"
          label={t("profile.name.prefix.label")}
          options={[
            {
              value: "master",
              label: t("name.prefix.master", { ns: "common" }),
            },
            {
              value: "mister",
              label: t("name.prefix.mister", { ns: "common" }),
            },
            {
              value: "miss",
              label: t("name.prefix.miss", { ns: "common" }),
            },
            {
              value: "missus",
              label: t("name.prefix.missus", { ns: "common" }),
            },
          ]}
        />
        <KeyboardInput
          name="th-first-name"
          type="text"
          label={t("profile.name.firstName")}
          onChange={() => {}}
        />
        <KeyboardInput
          name="th-middle-name"
          type="text"
          label={t("profile.name.middleName")}
          onChange={() => {}}
        />
        <KeyboardInput
          name="th-last-name"
          type="text"
          label={t("profile.name.lastName")}
          onChange={() => {}}
        />
      </DialogSection>

      {/* English name */}
      <DialogSection name={t("profile.enName.title")} isDoubleColumn>
        <KeyboardInput
          name="en-first-name"
          type="text"
          label={t("profile.enName.firstName")}
          onChange={() => {}}
        />
        <KeyboardInput
          name="en-middle-name"
          type="text"
          label={t("profile.enName.middleName")}
          onChange={() => {}}
        />
        <KeyboardInput
          name="en-last-name"
          type="text"
          label={t("profile.enName.lastName")}
          onChange={() => {}}
        />
      </DialogSection>

      {/* School information */}
      <DialogSection name={t("profile.class.title")} isDoubleColumn>
        <KeyboardInput
          name="student-id"
          type="text"
          label={t("profile.class.studentID")}
          onChange={() => {}}
        />
        <Dropdown
          name="class"
          label={t("profile.class.class")}
          options={classes.map((classItem) => ({
            value: classItem.id,
            label: classItem.name[locale],
          }))}
        />
        <KeyboardInput
          name="class-no"
          type="number"
          label={t("profile.class.classNo")}
          attr={{
            min: 1,
            max: 50,
          }}
          onChange={() => {}}
        />
      </DialogSection>
    </Dialog>
  );
};

export default EditStudentDialog;
