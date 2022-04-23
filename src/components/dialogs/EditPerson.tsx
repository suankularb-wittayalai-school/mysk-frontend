// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";
import { Student, Teacher } from "@utils/types/person";

const EditPersonDialog = ({
  show,
  onClose,
  onSubmit,
  mode,
  person,
}: DialogProps & {
  onSubmit: Function;
  mode: "add" | "edit";
  person?: Student | Teacher;
}): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const { t } = useTranslation(["account", "admin"]);

  // Form control
  const [form, setForm] = useState({
    prefix: "",
    thFirstName: "",
    thMiddleName: "",
    thLastName: "",
    enFirstName: "",
    enMiddleName: "",
    enLastName: "",
    studentID: "",
    role: "student",
    class: 0,
    classNo: "",
    subjectGroup: 0,
    classAdvisorAt: 0,
  });

  useEffect(() => {
    if (mode == "edit" && person)
      setForm({
        prefix: person.prefix,
        thFirstName: person.name.th.firstName,
        thMiddleName: person.name.th.middleName || "",
        thLastName: person.name.th.lastName,
        enFirstName: person.name["en-US"]?.firstName || "",
        enMiddleName: person.name["en-US"]?.middleName || "",
        enLastName: person.name["en-US"]?.lastName || "",
        studentID: person.role == "student" ? person.studentID : "",
        role: person.role,
        class: person.role == "student" ? person.class.id : 0,
        classNo: person.role == "student" ? person.classNo.toString() : "",
        // TODO: Use data from `person` once `subjectGroup` exists on type `Teacher`
        subjectGroup: 0,
        classAdvisorAt:
          person.role == "teacher" ? person.classAdvisorAt?.id || 0 : 0,
      });
  }, [mode, person]);

  // Dummybase
  const subjectGroups = [
    {
      id: 0,
      name: {
        "en-US": "Science and Technology",
        th: "วิทยาศาสตร์และเทคโนโลยี",
      },
    },
    {
      id: 1,
      name: {
        "en-US": "Mathematics",
        th: "คณิตศาสตร์",
      },
    },
    {
      id: 2,
      name: {
        "en-US": "Foreign Language",
        th: "ภาษาต่างประเทศ",
      },
    },
    {
      id: 3,
      name: {
        "en-US": "Thai",
        th: "ภาษาไทย",
      },
    },
  ];
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
      title={t(`dialog.editStudent.title.${mode}`, { ns: "admin" })}
      show={show}
      onClose={onClose}
      onSubmit={() => validateAndSend() && onSubmit()}
      actions={[
        {
          name: t("dialog.editStudent.action.cancel", {
            ns: "admin",
          }),
          type: "close",
        },
        {
          name: t("dialog.editStudent.action.save", {
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
              label: t("profile.name.prefix.master"),
            },
            {
              value: "mister",
              label: t("profile.name.prefix.mister"),
            },
            {
              value: "miss",
              label: t("profile.name.prefix.miss"),
            },
            {
              value: "missus",
              label: t("profile.name.prefix.missus"),
            },
          ]}
          defaultValue={person?.prefix}
          onChange={(e: Student["prefix"]) => setForm({ ...form, prefix: e })}
        />
        <KeyboardInput
          name="th-first-name"
          type="text"
          label={t("profile.name.firstName")}
          defaultValue={mode == "edit" ? person?.name.th.firstName : undefined}
          onChange={(e: string) => setForm({ ...form, thFirstName: e })}
        />
        <KeyboardInput
          name="th-middle-name"
          type="text"
          label={t("profile.name.middleName")}
          defaultValue={mode == "edit" ? person?.name.th.middleName : undefined}
          onChange={(e: string) => setForm({ ...form, thMiddleName: e })}
        />
        <KeyboardInput
          name="th-last-name"
          type="text"
          label={t("profile.name.lastName")}
          defaultValue={mode == "edit" ? person?.name.th.lastName : undefined}
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
            mode == "edit" ? person?.name["en-US"]?.firstName : undefined
          }
          onChange={(e: string) => setForm({ ...form, enFirstName: e })}
        />
        <KeyboardInput
          name="en-middle-name"
          type="text"
          label={t("profile.enName.middleName")}
          defaultValue={
            mode == "edit" ? person?.name["en-US"]?.middleName : undefined
          }
          onChange={(e: string) => setForm({ ...form, enMiddleName: e })}
        />
        <KeyboardInput
          name="en-last-name"
          type="text"
          label={t("profile.enName.lastName")}
          defaultValue={
            mode == "edit" ? person?.name["en-US"]?.lastName : undefined
          }
          onChange={(e: string) => setForm({ ...form, enLastName: e })}
        />
      </DialogSection>

      {/* Role */}
      <DialogSection name={t("profile.class.title")} isDoubleColumn>
        <Dropdown
          name="role"
          label={t("profile.role.role.label")}
          options={[
            { value: "student", label: t("profile.role.role.student") },
            { value: "teacher", label: t("profile.role.role.teacher") },
          ]}
          defaultValue={person?.role}
          onChange={(e: "student" | "teacher") => setForm({ ...form, role: e })}
        />
        {form.role == "student" ? (
          <>
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
              defaultValue={
                person?.role == "student" ? person?.class.id : undefined
              }
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
              defaultValue={
                person?.role == "student"
                  ? person?.classNo.toString()
                  : undefined
              }
              onChange={(e: string) => setForm({ ...form, classNo: e })}
            />
          </>
        ) : (
          <>
            <Dropdown
              name="subject-group"
              label={t("profile.role.subjectGroup")}
              options={subjectGroups.map((subjectGroup) => ({
                value: subjectGroup.id,
                label: subjectGroup.name[locale],
              }))}
              onChange={(e: number) => setForm({ ...form, subjectGroup: e })}
            />
            <Dropdown
              name="class-counselor-at"
              label={t("profile.role.classCounselorAt")}
              options={classes.map((classItem) => ({
                value: classItem.id,
                label: classItem.name[locale],
              }))}
              defaultValue={
                person?.role == "teacher"
                  ? person.classAdvisorAt?.id
                  : undefined
              }
              onChange={(e: number) => setForm({ ...form, classAdvisorAt: e })}
            />
          </>
        )}
      </DialogSection>
    </Dialog>
  );
};

export default EditPersonDialog;
