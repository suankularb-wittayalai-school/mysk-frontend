// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// Supabase client
import { supabase } from "@utils/supabaseClient";

// SK Components
import {
  ChipInputList,
  Dialog,
  DialogSection,
  KeyboardInput,
  NativeInput,
} from "@suankularb-components/react";

// Components
import AddContactDialog from "@components/dialogs/AddContact";
import AddStudentDialog from "@components/dialogs/AddStudent";
import AddTeacherDialog from "@components/dialogs/AddTeacher";
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { Class } from "@utils/types/class";
import { ChipInputListItem, DialogProps } from "@utils/types/common";
import { Contact } from "@utils/types/contact";
import { Student, Teacher } from "@utils/types/person";

// Backend
import { createClassroom } from "@utils/backend/classroom/classroom";

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
  const locale = useRouter().locale as "en-US" | "th";
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
    semester: 1 | 2;
    students: Student[];
    advisors: Teacher[];
    contacts: Contact[];
  }>({
    number: 101,
    year: new Date().getFullYear(),
    semester: new Date().getMonth() < 3 && new Date().getMonth() > 8 ? 1 : 2,
    students: [],
    advisors: [],
    contacts: [],
  });

  useEffect(() => {
    if (mode == "edit" && classItem) {
      setForm({
        number: 101,
        year: new Date().getFullYear(),
        semester:
          new Date().getMonth() < 3 && new Date().getMonth() > 8 ? 1 : 2,
        students: [],
        advisors: [],
        contacts: [],
      });
    }
  }, [mode, classItem]);

  function validate(): boolean {
    // TODO
    return true;
  }

  async function handleAdd() {
    const classroom: Class = {
      id: 0, // this need to be something else when editting
      number: form.number,
      year: form.year,
      semester: form.semester as 1 | 2,
      students: form.students,
      classAdvisors: form.advisors,
      contacts: form.contacts,
      schedule: {
        id: 0,
        content: [], // this need to be something else when editting
      },
      subjects: [], // this need to be something else when editting
    };

    if (!validate()) return;

    if (mode == "add") {
      const {
        data: createdClass,
        error: classCreationError,
      } = await createClassroom(classroom);

      if (classCreationError) {
        console.error(classCreationError);
        return;
      }
    } else if (mode == "edit") {
      // TODO
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
          },
        ]}
      >
        {/* School */}
        <DialogSection name="school" title="School" isDoubleColumn hasNoGap>
          <KeyboardInput
            name="name-th"
            type="text"
            label="Name"
            helperMsg="Must be 3-digit, i.e. 408."
            errorMsg="Invalid. Should be 3-digit, i.e. 408."
            useAutoMsg
            onChange={(e: string) => setForm({ ...form, number: Number(e) })}
            defaultValue={classItem ? classItem.number : 101}
            attr={{ pattern: "[1-6][0-1][1-9]" }}
          />
          <KeyboardInput
            name="year"
            type="number"
            label="Academic year"
            onChange={(e: string) => setForm({ ...form, year: Number(e) })}
            defaultValue={classItem ? classItem.year : new Date().getFullYear()}
            attr={{ min: 2005 }}
          />
          <KeyboardInput
            name="name-en"
            type="number"
            label="Semester"
            onChange={(e: string) =>
              setForm({ ...form, semester: Number(e) as 1 | 2 })
            }
            defaultValue={
              classItem
                ? classItem.semester
                : new Date().getMonth() < 3 && new Date().getMonth() > 8
                ? 2
                : 1
            }
            attr={{ min: 1, max: 2 }}
          />
        </DialogSection>

        {/* Personnel */}
        <DialogSection name="personnel" title="Personnel" hasNoGap>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">Class advisors</h3>
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
                  advisors: form.advisors.filter((teacher) => {
                    teacher.id in newList.map(({ id }) => id);
                  }),
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">Students</h3>
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
        <DialogSection name="contacts" title="Contacts" hasNoGap>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">Contacts</h3>
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
        onSubmit={() => {
          setShowAddTeacher(false);
          // TODO
        }}
      />
      <AddStudentDialog
        show={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        onSubmit={() => {
          setShowAddStudent(false);
          // TODO
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
