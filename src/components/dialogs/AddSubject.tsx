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

// Types
import { Subject } from "@utils/types/subject";
import { DialogProps } from "@utils/types/common";

const AddSubjectDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: (student: Subject) => void }): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale as "en-US" | "th";

  const [subjectCode, setSubjectCode] = useState<string>("");
  const [subject, setSubject] = useState<Subject | null>(null);

  // (@SiravitPhokeed)
  // From our perspective, this dialog is the “Generate RoomSubjects” dialog,
  // but I feel that’s a bit too complicated for the layman to understand so I
  // abstracted it away as adding a subject to Subjects You Teach.
  // This way they actually recieve obvious feedback as well.

  useEffect(() => {
    // Search for subject
  }, [subjectCode]);

  useEffect(() => setSubject(null), [show]);

  return (
    <Dialog
      type="regular"
      label="add-student"
      title={t("dialog.addSubject.title")}
      supportingText={t("dialog.addSubject.supportingText")}
      actions={[
        { name: t("dialog.addSubject.action.cancel"), type: "close" },
        { name: t("dialog.addSubject.action.add"), type: "submit" },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={() => subject && onSubmit(subject)}
    >
      <DialogSection
        name="subject"
        title={t("dialog.addSubject.searchSubject")}
        hasNoGap
      >
        <KeyboardInput
          name="subject-code"
          type="text"
          label={t("dialog.addSubject.subjectCode")}
          helperMsg={t("dialog.addSubject.subjectCode_helper")}
          errorMsg={t("dialog.addSubject.subjectCode_error")}
          useAutoMsg
          onChange={(e) => setSubjectCode(e)}
          attr={{ pattern: "[\u0E00-\u0E7FA-Z]\\d{5}|[A-Z]{1,3}\\d{5}" }}
        />
        <div>
          <h3 className="!text-base">
            {t("dialog.addSubject.searchResult.title")}
          </h3>
          <p>
            {subject
              ? subject.name[locale]
              : t("dialog.addSubject.searchResult.notFound")}
          </p>
        </div>
      </DialogSection>
      <DialogSection name="classes" title={t("dialog.addSubject.addClasses")}>
        <ChipInputList list={[]} onChange={() => {}} onAdd={() => {}} />
      </DialogSection>
    </Dialog>
  );
};

export default AddSubjectDialog;
