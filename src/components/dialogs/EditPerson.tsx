// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// Supabase client
import { supabase } from "@utils/supabaseClient";

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
  NativeInput,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";
import { Role, Student, Teacher } from "@utils/types/person";

const PREFIXMAP = {
  Master: "เด็กชาย",
  "Mr.": "นาย",
  "Mrs.": "นาง",
  "Miss.": "นางสาว",
};

const EditPersonDialog = ({
  show,
  onClose,
  onSubmit,
  mode,
  userRole,
  person,
}: DialogProps & {
  onSubmit: Function;
  mode: "add" | "edit";
  userRole?: Role;
  person?: Student | Teacher;
}): JSX.Element => {
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";
  const { t } = useTranslation(["account", "admin"]);

  // Form control
  const [form, setForm] = useState({
    prefix: "Master",
    thFirstName: "",
    thMiddleName: "",
    thLastName: "",
    enFirstName: "",
    enMiddleName: "",
    enLastName: "",
    studentID: "",
    teacherID: "",
    citizen_id: "",
    birthdate: "",
    role: "student",
    class: 0,
    classNo: "",
    subjectGroup: 0,
    classAdvisorAt: 0,
  });

  const [subjectGroups, setSubjectGroups] = useState<
    Array<{ id: number; name: { [key: string]: string } }>
  >([]);

  useEffect(() => {
    supabase
      .from("SubjectGroup")
      .select("*")
      .then((res: any) => {
        if (res.error) {
          console.error(res.error);
        }

        if (!res.data) {
          return;
        }

        let data = res.data.map(
          (group: { id: number; name_th: string; name_en: string }) => {
            return {
              id: group.id,
              name: { th: group.name_th, "en-US": group.name_en },
            };
          }
        );
        setSubjectGroups(data);
      });
  }, []);

  useEffect(
    () => userRole && setForm((form) => ({ ...form, role: userRole })),
    [userRole]
  );

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
        teacherID: person.role == "teacher" ? person.teacherID : "",
        role: person.role,
        class: person.role == "student" ? person.class.id : 0,
        classNo: person.role == "student" ? person.classNo.toString() : "",
        citizen_id: person.citizen_id,
        birthdate: person.birthdate,
        // TODO: Use data from `person` once `subjectGroup` exists on type `Teacher`
        subjectGroup: person.role == "teacher" ? person.subject_group.id : 0,
        classAdvisorAt:
          person.role == "teacher" ? person.classAdvisorAt?.id || 0 : 0,
      });
  }, [mode, person]);

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
    if (!form.classNo && form.role == "student") {
      return false;
    } else {
      const classNo = parseInt(form.classNo);
      if (classNo < 1 || classNo > 75) return false;
    }

    if (!form.prefix) return false;
    if (!form.thFirstName) return false;
    if (!form.thLastName) return false;
    if (form.studentID.length != 5 && form.role == "student") return false;
    if (form.teacherID.length < 4 && form.role == "teacher") return false;
    // if (!form.class) return false;

    return true;
  }

  async function handleAdd() {
    if (!validateAndSend()) return;

    // console.log(form);
    if (mode == "add") {
      const { data, error } = await supabase.from<any>("people").insert({
        prefix_th: PREFIXMAP[form.prefix as keyof typeof PREFIXMAP],
        prefix_en: form.prefix,
        first_name_th: form.thFirstName,
        middle_name_th: form.thMiddleName,
        last_name_th: form.thLastName,
        first_name_en: form.enFirstName,
        middle_name_en: form.enMiddleName,
        last_name_en: form.enLastName,
        birthdate: form.birthdate,
        citizen_id: form.citizen_id,
      });
      if (error) {
        console.log(error);
      }
      if (data) {
        if (form.role == "student") {
          await supabase.from<any>("student").insert({
            person: data[0]?.id,
            std_id: form.studentID.trim(),
          });
          // TODO: add student to class
        } else if (form.role == "teacher") {
          const res = await supabase.from<any>("teacher").insert({
            person: data[0]?.id,
            subject_group: form.subjectGroup,
            // class_advisor_at: form.classAdvisorAt,
            teacher_id: form.teacherID.trim(),
          });
          if (res.error) {
            console.error(res.error);
          }
        }
      }
    }

    onSubmit();
  }

  return (
    <Dialog
      type="large"
      label={mode == "add" ? "add-student" : "edit-student"}
      title={t(`dialog.editStudent.title.${mode}`, { ns: "admin" })}
      show={show}
      onClose={onClose}
      onSubmit={() => handleAdd()}
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
              value: "Master",
              label: t("profile.name.prefix.master"),
            },
            {
              value: "Mr.",
              label: t("profile.name.prefix.mister"),
            },
            {
              value: "Mrs.",
              label: t("profile.name.prefix.miss"),
            },
            {
              value: "Miss.",
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

      {/* General Information */}
      <DialogSection name={t("profile.general.title")}>
        <KeyboardInput
          name="citizen-id"
          type="text"
          label={t("profile.general.citizenID")}
          defaultValue={mode == "edit" ? person?.citizen_id : undefined}
          onChange={(e: string) => setForm({ ...form, citizen_id: e })}
        />
        <NativeInput
          name="birthdate"
          type="date"
          label={t("profile.general.birthdate")}
          defaultValue={mode == "edit" ? person?.birthdate : undefined}
          onChange={(e: string) => setForm({ ...form, birthdate: e })}
        />
      </DialogSection>

      {/* Role */}
      <DialogSection name={t("profile.role.title")} isDoubleColumn>
        <Dropdown
          name="role"
          label={t("profile.role.role.label")}
          options={[
            { value: "student", label: t("profile.role.role.student") },
            { value: "teacher", label: t("profile.role.role.teacher") },
          ]}
          defaultValue={
            mode == "edit"
              ? // Use role from user if editing
                person?.role
              : // Use role from props if adding
                userRole
          }
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
              label={t("profile.role.classAdvisorAt.label")}
              options={[
                {
                  value: 0,
                  label: t("profile.role.classAdvisorAt.none"),
                },
              ].concat(
                classes.map((classItem) => ({
                  value: classItem.id,
                  label: classItem.name[locale],
                }))
              )}
              defaultValue={
                person?.role == "teacher"
                  ? person.classAdvisorAt?.id
                  : undefined
              }
              onChange={(e: number) => setForm({ ...form, classAdvisorAt: e })}
            />
            <KeyboardInput
              name="teacher-id"
              type="text"
              label={t("profile.role.teacherID")}
              onChange={(e: string) => setForm({ ...form, teacherID: e })}
              defaultValue={
                person?.role == "teacher" ? person?.teacherID : undefined
              }
            />
          </>
        )}
      </DialogSection>
    </Dialog>
  );
};

export default EditPersonDialog;
