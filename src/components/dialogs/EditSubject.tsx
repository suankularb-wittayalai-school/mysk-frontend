// Modules
import { useEffect, useState } from "react";

// SK Components
import {
  ChipInputList,
  Dialog,
  DialogSection,
  FileInput,
  KeyboardInput,
  TextArea,
} from "@suankularb-components/react";

// Components
import AddTeacherDialog from "@components/dialogs/AddTeacher";
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";
import { Subject } from "@utils/types/subject";
import { Teacher } from "@utils/types/person";

const EditSubjectDialog = ({
  show,
  onClose,
  onSubmit,
  mode,
  subject,
}: DialogProps & {
  onSubmit: () => void;
  mode: "add" | "edit";
  subject?: Subject;
}): JSX.Element => {
  const [showDiscard, setShowDiscard] = useState<boolean>(false);
  const [showAddTeacher, setShowAddTeacher] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState<Subject>({
    id: 0,
    name: {
      "en-US": {
        name: "",
        shortName: "",
      },
      th: {
        name: "",
        shortName: "",
      },
    },
    code: {
      "en-US": "",
      th: "",
    },
    description: {
      "en-US": "",
      th: "",
    },
    teachers: [],
    coTeachers: [],
    subjectGroup: {
      id: 0,
      name: {
        "en-US": "",
        th: "",
      },
    },
    // set to 2 if month it after october but before march
    semester: new Date().getMonth() < 3 && new Date().getMonth() > 8 ? 2 : 1,
    year: new Date().getFullYear(),
    credit: 0,
    syllabus: null,
  });

  useEffect(() => {
    if (mode == "edit" || subject) {
      setForm({
        ...form,
        ...subject,
      });
    }
  }, [mode, subject]);

  return (
    <>
      {/* {console.log(form)} */}
      <Dialog
        type="large"
        label="edit-subject"
        title="Edit subject"
        actions={[
          { name: "Cancel", type: "close" },
          { name: "Save", type: "submit" },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={onSubmit}
      >
        <DialogSection name="name-th" title="Local name (Thai)" isDoubleColumn>
          <KeyboardInput
            name="code-th"
            type="text"
            label="Code"
            onChange={(e) =>
              setForm({ ...form, code: { ...form.code, th: e } })
            }
            defaultValue={form.code.th}
          />
          <KeyboardInput
            name="name-th"
            type="text"
            label="Full name"
            onChange={(e) =>
              setForm({
                ...form,
                name: { ...form.name, th: { ...form.name.th, name: e } },
              })
            }
            defaultValue={form.name.th.name}
          />
          <KeyboardInput
            name="short-name-th"
            type="text"
            label="Short name"
            helperMsg="Shown for short periods in Schedule."
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  th: { ...form.name.th, shortName: e },
                },
              })
            }
            defaultValue={form.name.th.shortName}
          />
        </DialogSection>
        <DialogSection name="name-en" title="English name" isDoubleColumn>
          <KeyboardInput
            name="code-en"
            type="text"
            label="English code"
            onChange={(e) =>
              setForm({ ...form, code: { ...form.code, "en-US": e } })
            }
            defaultValue={form.code["en-US"]}
          />
          <KeyboardInput
            name="name-en"
            type="text"
            label="English name"
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  "en-US": { ...form.name["en-US"], name: e },
                },
              })
            }
            defaultValue={form.name["en-US"].name}
          />
          <KeyboardInput
            name="short-name-en"
            type="text"
            label="English short name"
            helperMsg="Shown for short periods in Schedule."
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  "en-US": { ...form.name["en-US"], shortName: e },
                },
              })
            }
            defaultValue={form.name["en-US"].shortName}
          />
        </DialogSection>
        <DialogSection name="desc" title="Description">
          <TextArea
            name="desc-th"
            label="Local description (Thai)"
            onChange={(e) =>
              setForm({
                ...form,
                description: form.description
                  ? { ...form.description, th: e }
                  : undefined,
              })
            }
            defaultValue={form.description?.th}
          />
          <TextArea
            name="desc-en"
            label="English description"
            onChange={(e) =>
              setForm({
                ...form,
                description: form.description
                  ? { ...form.description, "en-US": e }
                  : undefined,
              })
            }
            defaultValue={form.description ? form.description["en-US"] : ""}
          />
        </DialogSection>
        <DialogSection name="school" title="School" isDoubleColumn>
          <KeyboardInput
            name="year"
            type="number"
            label="Academic year"
            helperMsg="In Buddhist Era (BE)."
            onChange={(e) => setForm({ ...form, year: Number(e) })}
            defaultValue={form.year}
            attr={{ min: 2005 }}
          />
          <KeyboardInput
            name="semester"
            type="number"
            label="Semester"
            onChange={(e) => setForm({ ...form, semester: Number(e) as 1 | 2 })}
            defaultValue={form.semester}
            attr={{ min: 1, max: 2 }}
          />
          <KeyboardInput
            name="credit"
            type="number"
            label="Credit"
            onChange={(e) => setForm({ ...form, credit: Number(e) })}
            attr={{ min: 0, step: 0.5 }}
            defaultValue={form.credit}
          />
          <FileInput
            name="syllabus"
            label="Syllabus"
            onChange={(e: File) => setForm({ ...form, syllabus: e })}
            attr={{ accept: ".pdf" }}
          />
        </DialogSection>
        <DialogSection name="personnel" title="Personnel" isDoubleColumn>
          <div className="flex flex-col gap-2">
            <p className="font-display">Teachers</p>
            <ChipInputList list={[]} onAdd={() => {}} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-display">Co-teachers</p>
            <ChipInputList list={[]} onAdd={() => {}} />
          </div>
        </DialogSection>
      </Dialog>

      {/* Dialog */}
      <DiscardDraft
        show={showDiscard}
        onClose={() => setShowDiscard(false)}
        onSubmit={() => {
          setShowDiscard(false);
          onClose();
        }}
      />
      <AddTeacherDialog
        show={showAddTeacher}
        onClose={() => setShowAddTeacher(false)}
        onSubmit={() => {
          setShowAddTeacher(false);
          // TODO: Add to Chip List
        }}
      />
    </>
  );
};

export default EditSubjectDialog;
