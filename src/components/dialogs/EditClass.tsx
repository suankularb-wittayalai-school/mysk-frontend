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
  const [showDiscard, setShowDiscard] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState({
    nameTH: "",
    nameEN: "",
    year: 0,
    semester: 0,
    students: [],
    advisors: [],
    contacts: [],
  });

  useEffect(() => {
    if (mode == "edit" && classItem) {
      setForm({
        nameTH: classItem.name.th,
        nameEN: classItem.name["en-US"],
        year: 0,
        semester: 0,
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
    if (!validate()) return;

    if (mode == "add") {
      // TODO
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
        {/* Name */}
        <DialogSection name="name" title="Name" isDoubleColumn hasNoGap>
          <KeyboardInput
            name="name-th"
            type="text"
            label="Local name (Thai)"
            helperMsg="i.e. ม.408"
            onChange={(e: string) => setForm({ ...form, nameTH: e })}
            defaultValue={form.nameTH}
          />
          <KeyboardInput
            name="name-en"
            type="text"
            label="English name"
            helperMsg="i.e. M.408"
            onChange={(e: string) => setForm({ ...form, nameEN: e })}
            defaultValue={form.nameEN}
          />
        </DialogSection>

        {/* School */}
        <DialogSection name="school" title="School" isDoubleColumn hasNoGap>
          <KeyboardInput
            name="year"
            type="number"
            label="Academic year"
            onChange={(e: string) => setForm({ ...form, year: Number(e) })}
            defaultValue={form.year}
            attr={{ minLength: 2005 }}
          />
          <KeyboardInput
            name="name-en"
            type="text"
            label="Semester"
            onChange={(e: string) => setForm({ ...form, nameEN: e })}
            defaultValue={form.semester}
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
            <ChipInputList list={[]} onAdd={() => {}} onChange={() => {}} />
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
