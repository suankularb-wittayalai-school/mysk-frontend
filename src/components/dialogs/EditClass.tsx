// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  ChipInputList,
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Components
import AddContactDialog from "@components/dialogs/AddContact";
import AddStudentDialog from "@components/dialogs/AddStudent";
import AddTeacherDialog from "@components/dialogs/AddTeacher";
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Backend
import {
  createClassroom,
  updateClassroom,
} from "@utils/backend/classroom/classroom";

// Helpers
import { getCurrentAcedemicYear } from "@utils/helpers/date";
import { nameJoiner } from "@utils/helpers/name";

// Patterns
import { classPattern, classRegex } from "@utils/patterns";

// Types
import { Class } from "@utils/types/class";
import { ChipInputListItem, DialogProps, LangCode } from "@utils/types/common";
import { Contact } from "@utils/types/contact";
import { Student, Teacher } from "@utils/types/person";

const EditClassDialog = ({
  show,
  onClose,
  onSubmit,
  mode,
  classItem,
}: DialogProps & {
  onSubmit: Function;
  mode: "add" | "edit";
  classItem?: Class;
}): JSX.Element => {
  const locale = useRouter().locale as LangCode;
  const { t } = useTranslation(["class", "admin"]);

  // Dialog control
  const [showAddTeacher, setShowAddTeacher] = useState<boolean>(false);
  const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
  const [showAddContact, setShowAddContact] = useState<boolean>(false);
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState<{
    number: number;
    year: number;
    students: Student[];
    classAdvisors: Teacher[];
    contacts: Contact[];
  }>({
    number: 101,
    year: getCurrentAcedemicYear(),
    students: [],
    classAdvisors: [],
    contacts: [],
  });

  useEffect(() => {
    if (mode == "edit" && classItem) {
      setForm({
        number: classItem.number,
        year: classItem.year,
        students: classItem.students,
        classAdvisors: classItem.classAdvisors,
        contacts: classItem.contacts,
      });
    }
  }, [mode, classItem]);

  function validate(): boolean {
    // console.log(form);

    if (!form.number || !form.number.toString().match(classRegex)) return false;
    if (form.year < 2005) return false;

    return true;
  }

  async function handleAdd() {
    // console.log(classItem);

    const classroom: Class = {
      id: classItem?.id || 0,
      number: form.number,
      year: form.year,
      students: form.students,
      classAdvisors: form.classAdvisors,
      contacts: form.contacts,
      subjects: [], // this need to be something else when editting
    };

    if (!validate()) return;

    if (mode == "add") {
      const { data: createdClass, error: classCreationError } =
        await createClassroom(classroom);

      if (classCreationError) {
        console.error(classCreationError);
        return;
      }
    } else if (mode == "edit") {
      const { data: _, error: classUpdateError } = await updateClassroom(
        classroom
      );

      if (classUpdateError) {
        console.error(classUpdateError);
        return;
      }
    }

    onSubmit();
  }

  // Chip List control
  const [chipLists, setChipLists] = useState<{
    classAdvisors: ChipInputListItem[];
    students: ChipInputListItem[];
    contacts: ChipInputListItem[];
  }>({
    classAdvisors: [],
    students: [],
    contacts: [],
  });

  useEffect(() => {
    if (mode == "edit" && classItem) {
      setChipLists({
        classAdvisors: classItem.classAdvisors.map((teacher) => ({
          id: teacher.id.toString(),
          name: nameJoiner(locale, teacher.name),
        })),
        students: classItem.students.map((student) => ({
          id: student.id.toString(),
          name: nameJoiner(locale, student.name),
        })),
        contacts: classItem.contacts.map((contact) => ({
          id: contact.id.toString(),
          name: contact.name[locale],
        })),
      });
    }
  }, [mode, classItem]);

  return (
    <>
      <Dialog
        type="large"
        label={mode == "add" ? "add-student" : "edit-student"}
        title={t(`dialog.editClass.title.${mode}`, { ns: "admin" })}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => handleAdd()}
        actions={[
          {
            name: t("dialog.editClass.action.cancel", {
              ns: "admin",
            }),
            type: "close",
          },
          {
            name: t("dialog.editClass.action.save", {
              ns: "admin",
            }),
            type: "submit",
            disabled: !validate(),
          },
        ]}
      >
        {/* School */}
        <DialogSection
          name="school"
          title={t("item.school.title")}
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="number"
            type="text"
            label={t("item.school.classNo")}
            helperMsg={t("item.school.classNo_helper")}
            errorMsg={t("item.school.classNo_error")}
            useAutoMsg
            onChange={(e: string) => setForm({ ...form, number: Number(e) })}
            defaultValue={classItem ? classItem.number : 101}
            attr={{ pattern: classPattern }}
          />
          <KeyboardInput
            name="year"
            type="number"
            label={t("item.school.year")}
            onChange={(e: string) => setForm({ ...form, year: Number(e) })}
            defaultValue={classItem ? classItem.year : new Date().getFullYear()}
            attr={{ min: 2005 }}
          />
        </DialogSection>

        {/* Personnel */}
        <DialogSection name="people" title={t("item.people.title")} hasNoGap>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">{t("item.people.classAdvisors")}</h3>
            <ChipInputList
              list={chipLists.classAdvisors}
              onAdd={() => setShowAddTeacher(true)}
              onChange={(newList) => {
                setChipLists({
                  ...chipLists,
                  classAdvisors: newList as ChipInputListItem[],
                });
                setForm({
                  ...form,
                  classAdvisors: form.classAdvisors.filter((teacher) => {
                    teacher.id in newList.map(({ id }) => id);
                  }),
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">{t("item.people.students")}</h3>
            <ChipInputList
              list={chipLists.students}
              onAdd={() => setShowAddStudent(true)}
              onChange={(newList) => {
                setChipLists({
                  ...chipLists,
                  students: newList as ChipInputListItem[],
                });
                setForm({
                  ...form,
                  students: form.students.filter((student) => {
                    student.id in newList.map(({ id }) => id);
                  }),
                });
              }}
            />
          </div>
        </DialogSection>

        {/* Personnel */}
        <DialogSection
          name="contacts"
          title={t("item.contacts.title")}
          hasNoGap
        >
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">{t("item.contacts.contacts")}</h3>
            <ChipInputList
              list={chipLists.contacts}
              onAdd={() => setShowAddContact(true)}
              onChange={(newList) => {
                setChipLists({
                  ...chipLists,
                  contacts: newList as ChipInputListItem[],
                });
                setForm({
                  ...form,
                  contacts: form.contacts.filter((contact) => {
                    contact.id in newList.map(({ id }) => id);
                  }),
                });
              }}
            />
          </div>
        </DialogSection>
      </Dialog>

      {/* Dialogs */}
      <AddTeacherDialog
        show={showAddTeacher}
        onClose={() => setShowAddTeacher(false)}
        onSubmit={(teacher) => {
          setShowAddTeacher(false);
          setForm({ ...form, classAdvisors: [...form.classAdvisors, teacher] });
          setChipLists({
            ...chipLists,
            classAdvisors: [
              ...chipLists.classAdvisors,
              {
                id: teacher.id.toString(),
                name: nameJoiner(locale, teacher.name),
              },
            ],
          });
        }}
      />
      <AddStudentDialog
        show={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onSubmit={(student) => {
          setShowAddStudent(false);
          setForm({ ...form, students: [...form.students, student] });
          setChipLists({
            ...chipLists,
            students: [
              ...chipLists.students,
              {
                id: student.id.toString(),
                name: nameJoiner(locale, student.name),
              },
            ],
          });
        }}
      />
      <AddContactDialog
        show={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSubmit={(contact) => {
          setShowAddContact(false);
          setForm({ ...form, contacts: [...form.contacts, contact] });
          setChipLists({
            ...chipLists,
            contacts: [
              ...chipLists.contacts,
              {
                // (@SiravitPhokeed)
                // The current timestamp is used as the ID for Input Chip List
                // as other options would have been too slow/complicated.
                // Using ID from the database would require that this Contact
                // is already on the database, which it shouldn’t be.
                id: new Date().toISOString(),
                name: contact.name[locale] || contact.name.th,
              },
            ],
          });
        }}
        isGroup
      />
      <DiscardDraft
        show={showDiscard}
        onSubmit={() => {
          setShowDiscard(false);
          onClose();
        }}
        onClose={() => setShowDiscard(false)}
      />
    </>
  );
};

export default EditClassDialog;
