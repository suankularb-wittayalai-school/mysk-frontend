// Modules
import { useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Components
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Types
import { DialogProps } from "@utils/types/common";

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
        <DialogSection name="school" title="School" isDoubleColumn>
          <KeyboardInput
            name="credit"
            type={"number"}
            label={""}
            onChange={function (newValue: string): void {
              throw new Error("Function not implemented.");
            }}
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
