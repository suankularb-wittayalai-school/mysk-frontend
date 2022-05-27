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
import { ChipInputListItem, DialogProps } from "@utils/types/common";
import AddClassDialog from "./AddClass";
import { supabase } from "@utils/supabaseClient";
import { SubjectTable } from "@utils/types/database/subject";
import { db2Subject } from "@utils/backend/database";

const AddSubjectDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: (student: Subject) => void }): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale as "en-US" | "th";

  const [subjectCode, setSubjectCode] = useState<string>("");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [classChipList, setClassChipList] = useState<ChipInputListItem[]>([]);

  const [showAddClass, setShowAddClass] = useState<boolean>(false);

  // (@SiravitPhokeed)
  // From our perspective, this dialog is the “Generate RoomSubjects” dialog,
  // but I feel that’s a bit too complicated for the layman to understand so I
  // abstracted it away as adding a subject to Subjects You Teach.
  // This way they actually recieve obvious feedback as well.
  // (@Jimmy-Tempest)
  // Very cool.

  useEffect(() => {
    // Search for subject
    if (subjectCode.length >= 6) {
      supabase
        .from<SubjectTable>("subject")
        .select("*")
        .match(
          locale === "en-US"
            ? { code_en: subjectCode }
            : { code_th: subjectCode }
        )
        .limit(1)
        .single()
        .then((res) => {
          if (res.data) {
            db2Subject(res.data).then((subject) => {
              setSubject(subject);
            });
          } else {
            console.error(res.error);

            setSubject(null);
          }
        });
    }
  }, [subjectCode]);

  useEffect(() => setSubject(null), [show]);

  return (
    <>
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
                ? subject.name[locale].name
                : t("dialog.addSubject.searchResult.notFound")}
            </p>
          </div>
        </DialogSection>
        <DialogSection name="classes" title={t("dialog.addSubject.addClasses")}>
          <ChipInputList
            list={classChipList}
            onChange={(newList) => {
              setClassChipList(newList as ChipInputListItem[]);
            }}
            onAdd={() => setShowAddClass(true)}
          />
        </DialogSection>
      </Dialog>
      <AddClassDialog
        show={showAddClass}
        onClose={() => setShowAddClass(false)}
        onSubmit={(classroom) => {
          setClassChipList([
            ...classChipList,
            { id: classroom.id.toString(), name: classroom.number.toString() },
          ]);
          setShowAddClass(false);
        }}
      />
    </>
  );
};

export default AddSubjectDialog;
