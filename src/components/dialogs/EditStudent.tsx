// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";

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

const EditStudentDialog = ({
  show,
  onClose,
  onSubmit,
  mode,
  student,
}: DialogProps & {
  onSubmit: Function;
  mode: "add" | "edit";
  student?: Student;
}): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const { t } = useTranslation(["account", "admin", "common"]);

  // Form control
  const [form, setForm] = useState(
    mode == "edit" && student
      ? {
          prefix: student.prefix,
          thFirstName: student.name.th.firstName,
          thMiddleName: student.name.th.middleName,
          thLastName: student.name.th.lastName,
          enFirstName: student.name["en-US"]?.firstName || "",
          enMiddleName: student.name["en-US"]?.middleName || "",
          enLastName: student.name["en-US"]?.lastName || "",
          studentID: student.studentID,
          class: student.class.id,
          classNo: student.classNo.toString(),
        }
      : {
          prefix: "",
          thFirstName: "",
          thMiddleName: "",
          thLastName: "",
          enFirstName: "",
          enMiddleName: "",
          enLastName: "",
          studentID: "",
          class: 0,
          classNo: "",
        }
  );

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

  function validateAndSend() {
    if (!form.classNo) return false;
    const classNo = parseInt(form.classNo);

    if (!form.prefix) return false;
    if (!form.thFirstName) return false;
    if (!form.thLastName) return false;
    if (form.studentID.length != 5) return false;
    if (!form.class) return false;
    if (classNo < 1 || classNo > 50) return false;

    return true;
  }

  return (
    <Dialog
      type="large"
      label={mode == "add" ? "add-student" : "edit-student"}
      title={t(`studentList.dialog.editStudent.title.${mode}`, { ns: "admin" })}
      show={show}
      onClose={onClose}
      onSubmit={() => validateAndSend() && onSubmit()}
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
          defaultValue={student?.prefix}
          onChange={(e: Student["prefix"]) => setForm({ ...form, prefix: e })}
        />
        <KeyboardInput
          name="th-first-name"
          type="text"
          label={t("profile.name.firstName")}
          defaultValue={mode == "edit" ? student?.name.th.firstName : undefined}
          onChange={(e: string) => setForm({ ...form, thFirstName: e })}
        />
        <KeyboardInput
          name="th-middle-name"
          type="text"
          label={t("profile.name.middleName")}
          defaultValue={
            mode == "edit" ? student?.name.th.middleName : undefined
          }
          onChange={(e: string) => setForm({ ...form, thMiddleName: e })}
        />
        <KeyboardInput
          name="th-last-name"
          type="text"
          label={t("profile.name.lastName")}
          defaultValue={mode == "edit" ? student?.name.th.lastName : undefined}
          onChange={(e: string) => setForm({ ...form, thLastName: e })}
        />
      </DialogSection>

      {/* English name */}
      <DialogSection name={t("profile.enName.title")} isDoubleColumn>
        <KeyboardInput
          name="en-first-name"
          type="text"
          label={t("profile.enName.firstName")}
          defaultValue={
            mode == "edit" ? student?.name["en-US"]?.firstName : undefined
          }
          onChange={(e: string) => setForm({ ...form, enFirstName: e })}
        />
        <KeyboardInput
          name="en-middle-name"
          type="text"
          label={t("profile.enName.middleName")}
          defaultValue={
            mode == "edit" ? student?.name["en-US"]?.middleName : undefined
          }
          onChange={(e: string) => setForm({ ...form, enMiddleName: e })}
        />
        <KeyboardInput
          name="en-last-name"
          type="text"
          label={t("profile.enName.lastName")}
          defaultValue={
            mode == "edit" ? student?.name["en-US"]?.lastName : undefined
          }
          onChange={(e: string) => setForm({ ...form, enLastName: e })}
        />
      </DialogSection>

      {/* School information */}
      <DialogSection name={t("profile.class.title")} isDoubleColumn>
        <KeyboardInput
          name="student-id"
          type="text"
          label={t("profile.class.studentID")}
          onChange={(e: string) => setForm({ ...form, studentID: e })}
        />
        <Dropdown
          name="class"
          label={t("profile.class.class")}
          options={classes.map((classItem) => ({
            value: classItem.id,
            label: classItem.name[locale],
          }))}
          defaultValue={student?.class.id}
          onChange={(e: number) => setForm({ ...form, class: e })}
        />
        <KeyboardInput
          name="class-no"
          type="number"
          label={t("profile.class.classNo")}
          attr={{
            min: 1,
            max: 50,
          }}
          onChange={(e: string) => setForm({ ...form, classNo: e })}
        />
      </DialogSection>
    </Dialog>
  );
};

export default EditStudentDialog;
