// Modules
import { useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
  TextArea,
} from "@suankularb-components/react";

// Components
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";
import { Subject } from "@utils/types/subject";

const EditSubjectDialog = ({
  show,
  onClose,
  onSubmit,
  mode,
}: DialogProps & {
  onSubmit: () => void;
  mode: "add" | "edit";
}): JSX.Element => {
  const [showDiscard, setShowDiscard] = useState<boolean>(false);
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
  });

  return (
    <>
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
            onChange={() => {}}
          />
          <KeyboardInput
            name="name-th"
            type="text"
            label="Full name"
            onChange={() => {}}
          />
          <KeyboardInput
            name="short-name-th"
            type="text"
            label="Short name"
            helperMsg="Shown for short periods in Schedule."
            onChange={() => {}}
          />
        </DialogSection>
        <DialogSection name="name-en" title="English name" isDoubleColumn>
          <KeyboardInput
            name="code-en"
            type="text"
            label="English code"
            onChange={() => {}}
          />
          <KeyboardInput
            name="name-en"
            type="text"
            label="English name"
            onChange={() => {}}
          />
          <KeyboardInput
            name="short-name-en"
            type="text"
            label="English short name"
            helperMsg="Shown for short periods in Schedule."
            onChange={() => {}}
          />
        </DialogSection>
        <DialogSection name="desc" title="Description">
          <TextArea
            name="desc-th"
            label="Local description (Thai)"
            onChange={() => {}}
          />
          <TextArea
            name="desc-en"
            label="English description"
            onChange={() => {}}
          />
        </DialogSection>
        <DialogSection name="school" title="School" isDoubleColumn>
          <KeyboardInput
            name="credit"
            type="number"
            label="Credit"
            onChange={() => {}}
            attr={{ min: 0, step: 0.5 }}
          />
        </DialogSection>
        <DialogSection name="syllabus" title="Syllabus">
          <FileIn
            name="syllabus-th"
            label="Local description (Thai)"
            onChange={() => {}}
          />
          <TextArea
            name="syllabus-en"
            label="English description"
            onChange={() => {}}
          />
        </DialogSection>
      </Dialog>
      <DiscardDraft
        show={showDiscard}
        onClose={() => setShowDiscard(false)}
        onSubmit={() => {
          setShowDiscard(false);
          onClose();
        }}
      />
    </>
  );
};

export default EditSubjectDialog;
