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
import AddTeacherDialog from "@components/dialogs/AddTeacher";
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { Class } from "@utils/types/class";
import { DialogProps } from "@utils/types/common";
import { createClassroom } from "@utils/backend/classroom/classroom";
import AddContactDialog from "./AddContact";

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
  const [showAddContact, setShowAddContact] = useState<boolean>(false);
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState({
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
            attr={{ pattern: "[1-6][0-1][1-5]" }}
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
            onChange={(e: string) => setForm({ ...form, semester: Number(e) })}
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
              list={[]}
              onAdd={() => setShowAddTeacher(true)}
              onChange={() => {}}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">Students</h3>
            <ChipInputList list={[]} onAdd={() => {}} onChange={() => {}} />
          </div>
        </DialogSection>

        {/* Personnel */}
        <DialogSection name="contacts" title="Contacts" hasNoGap>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">Contacts</h3>
            <ChipInputList
              list={[]}
              onAdd={() => setShowAddContact(true)}
              onChange={() => {}}
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
      <AddContactDialog
        show={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSubmit={() => {
          setShowAddContact(false);
          // TODO
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
