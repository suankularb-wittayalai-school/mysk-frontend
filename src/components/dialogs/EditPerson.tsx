// External libraries
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// Supabase client

// SK Components
import {
  Dialog,
  DialogSection,
  Dropdown,
  KeyboardInput,
  NativeInput,
} from "@suankularb-components/react";

// Backend
import { createStudent } from "@utils/backend/person/student";
import { createTeacher } from "@utils/backend/person/teacher";

// Types
import { DialogProps, LangCode } from "@utils/types/common";
import { Role, Student, Teacher } from "@utils/types/person";

// Hooks
import { useSubjectGroupOption } from "@utils/hooks/subject";

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
  const locale = useRouter().locale as LangCode;
  const supabase = useSupabaseClient();
  const { t } = useTranslation(["account", "admin"]);

  // Form control
  const [form, setForm] = useState({
    thPrefix: "",
    thFirstName: "",
    thMiddleName: "",
    thLastName: "",
    enPrefix: "",
    enFirstName: "",
    enMiddleName: "",
    enLastName: "",
    studentID: "",
    teacherID: "",
    citizenID: "",
    birthdate: "",
    role: "student",
    subjectGroup: 0,
    email: "",
    isAdmin: false,
  });
  const subjectGroups = useSubjectGroupOption();

  // Set the role dropdown to the role of the user
  useEffect(
    () => userRole && setForm((form) => ({ ...form, role: userRole })),
    [userRole]
  );

  // Populate the form control with data if mode is edit
  useEffect(() => {
    if (mode == "edit" && person) {
      setForm({
        thPrefix: person.prefix.th,
        thFirstName: person.name.th.firstName,
        thMiddleName: person.name.th.middleName || "",
        thLastName: person.name.th.lastName,
        enPrefix: person.prefix["en-US"] || "",
        enFirstName: person.name["en-US"]?.firstName || "",
        enMiddleName: person.name["en-US"]?.middleName || "",
        enLastName: person.name["en-US"]?.lastName || "",
        studentID: person.role == "student" ? person.studentID : "",
        teacherID: person.role == "teacher" ? person.teacherID : "",
        role: person.role,
        citizenID: person.citizenID,
        birthdate: person.birthdate,
        subjectGroup: person.role == "teacher" ? person.subjectGroup.id : 0,
        email: person.contacts.filter((contact) => contact.type == "Email")[0]
          ?.value,
        isAdmin: person.isAdmin ?? false,
      });
    }
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

  function validate(): boolean {
    if (!form.thPrefix) return false;
    if (!form.thFirstName) return false;
    if (!form.thLastName) return false;
    if (form.role == "student" && form.studentID.length != 5) return false;
    if (form.role == "teacher" && form.teacherID.length < 4) return false;

    return true;
  }

  async function handleAdd() {
    if (!validate()) return;

    if (mode == "add") {
      if (form.role == "student") {
        const { error } = await createStudent(
          {
            id: 0,
            prefix: {
              th: form.thPrefix,
              "en-US": form.enPrefix,
            },
            role: "student",
            name: {
              th: {
                firstName: form.thFirstName,
                middleName: form.thMiddleName,
                lastName: form.thLastName,
              },
              "en-US": {
                firstName: form.enFirstName,
                middleName: form.enMiddleName,
                lastName: form.enLastName,
              },
            },
            studentID: form.studentID,
            citizenID: form.citizenID,
            birthdate: form.birthdate,
            classNo: 0,
            class: {
              id: 0,
              number: 0,
            },
            contacts: [
              {
                id: 1,
                type: "Email",
                value: form.email,
                name: {
                  "en-US": "School Email",
                  th: "School Email",
                },
              },
            ],
          },
          form.email,
          form.isAdmin
        );
        if (error) {
          console.error(error);
          return;
        }
      }
      // TODO: add student to class
      else if (form.role == "teacher") {
        const { error } = await createTeacher(
          {
            id: 0,
            prefix: {
              th: form.thPrefix,
              "en-US": form.enPrefix,
            },
            role: "teacher",
            name: {
              th: {
                firstName: form.thFirstName,
                middleName: form.thMiddleName,
                lastName: form.thLastName,
              },
              "en-US": {
                firstName: form.enFirstName,
                middleName: form.enMiddleName,
                lastName: form.enLastName,
              },
            },
            teacherID: form.teacherID,
            citizenID: form.citizenID,
            birthdate: form.birthdate,
            isAdmin: form.isAdmin,
            subjectGroup: {
              id: form.subjectGroup,
              name: {
                "en-US": "",
                th: "",
              },
            },
            classAdvisorAt: {
              id: 0,
              number: 0,
            },
            contacts: [
              {
                id: 1,
                type: "Email",
                value: form.email,
                name: {
                  "en-US": "School Email",
                  th: "School Email",
                },
              },
            ],
          },
          form.email,
          form.isAdmin
        );
        if (error) {
          console.error(error);
          return;
        }
      }
    } else if (mode == "edit") {
      // Get ID of the person
      const { data, error } = await supabase
        .from("people")
        .select("id")
        .match({ citizen_id: person?.citizenID })
        .limit(1)
        .maybeSingle();
      if (error || !data) {
        console.error(error);
        return;
      }

      const personID: number = data?.id;

      // Update person
      const { data: updatedPerson, error: updatePersonError } = await supabase
        .from("people")
        .update({
          prefix_th: form.thPrefix,
          first_name_th: form.thFirstName,
          middle_name_th: form.thMiddleName,
          last_name_th: form.thLastName,
          prefix_en: form.enPrefix,
          first_name_en: form.enFirstName,
          middle_name_en: form.enMiddleName,
          last_name_en: form.enLastName,
          birthdate: form.birthdate,
          citizen_id: form.citizenID,
        })
        .match({ id: personID });
      if (updatePersonError || !updatedPerson) {
        console.error(updatePersonError);
        return;
      }

      if (form.role == "student" && person?.role == "student") {
        const { data: student, error: studentUpdateError } = await supabase
          .from("student")
          .update({ std_id: form.studentID.trim() })
          .match({ person: personID, std_id: person.studentID });
        if (studentUpdateError || !student) {
          console.error(studentUpdateError);
        }
      } else if (form.role == "teacher" && person?.role == "teacher") {
        const { error: teacherUpdateError } = await supabase
          .from("teacher")
          .update({
            subject_group: form.subjectGroup,
            teacher_id: form.teacherID.trim(),
          })
          .match({ person: personID, teacher_id: person.teacherID });
        if (teacherUpdateError) {
          console.error(teacherUpdateError);
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
      onSubmit={handleAdd}
      actions={[
        {
          name: t("dialog.editStudent.action.cancel", { ns: "admin" }),
          type: "close",
        },
        {
          name: t("dialog.editStudent.action.save", { ns: "admin" }),
          type: "submit",
          disabled: !validate(),
        },
      ]}
    >
      {/* Local name */}
      <DialogSection
        name="name"
        title={t("profile.name.title")}
        isDoubleColumn
        hasNoGap
      >
        <KeyboardInput
          name="th-prefix"
          type="text"
          label={t("profile.name.prefix")}
          helperMsg={t("profile.name.prefix_helper")}
          defaultValue={mode == "edit" ? person?.prefix.th : undefined}
          onChange={(e: string) => setForm({ ...form, thPrefix: e })}
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
      <DialogSection
        name="en-name"
        title={t("profile.enName.title")}
        isDoubleColumn
        hasNoGap
      >
        <KeyboardInput
          name="en-prefix"
          type="text"
          label={t("profile.enName.prefix")}
          helperMsg={t("profile.enName.prefix_helper")}
          defaultValue={mode == "edit" ? person?.prefix["en-US"] : undefined}
          onChange={(e: string) => setForm({ ...form, enPrefix: e })}
        />
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
      <DialogSection
        name="general"
        title={t("profile.general.title")}
        isDoubleColumn
        hasNoGap
      >
        <KeyboardInput
          name="citizen-id"
          type="text"
          label={t("profile.general.citizenID")}
          defaultValue={mode == "edit" ? person?.citizenID : undefined}
          onChange={(e: string) => setForm({ ...form, citizenID: e })}
        />
        <NativeInput
          name="birth-date"
          type="date"
          label={t("profile.general.birthDate")}
          defaultValue={mode == "edit" ? person?.birthdate : undefined}
          onChange={(e: string) => setForm({ ...form, birthdate: e })}
        />
        <KeyboardInput
          name="email"
          type="email"
          label={t("profile.general.email")}
          defaultValue={
            mode == "edit"
              ? person?.contacts?.filter((c) => c.type == "Email")[0]?.value
              : undefined
          }
          onChange={(e: string) => setForm({ ...form, email: e })}
        />
      </DialogSection>

      {/* Role */}
      <DialogSection
        name="role"
        title={t("profile.role.title")}
        isDoubleColumn
        hasNoGap
      >
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
              defaultValue={
                mode == "edit" && person?.role == "student"
                  ? person?.studentID
                  : undefined
              }
            />
          </>
        ) : (
          <>
            <KeyboardInput
              name="teacher-id"
              type="text"
              label={t("profile.role.teacherID")}
              onChange={(e: string) => setForm({ ...form, teacherID: e })}
              defaultValue={
                person?.role == "teacher" ? person?.teacherID : undefined
              }
            />
            <Dropdown
              name="subject-group"
              label={t("profile.role.subjectGroup")}
              options={subjectGroups.map((subjectGroup) => ({
                value: subjectGroup.id,
                label: subjectGroup.name[locale],
              }))}
              onChange={(e: number) => setForm({ ...form, subjectGroup: e })}
              defaultValue={
                person?.role == "teacher" ? person?.subjectGroup.id : undefined
              }
            />
          </>
        )}
        <div className="flex flex-row gap-2">
          <input
            id="is-admin"
            name="is-admin"
            type="checkbox"
            onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
            checked={form.isAdmin}
          />
          <label htmlFor="is-admin">{t("profile.role.isAdmin")}</label>
        </div>
      </DialogSection>
    </Dialog>
  );
};

export default EditPersonDialog;
