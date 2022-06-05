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
import AddClassDialog from "@components/dialogs/AddClass";

// Backend
import { db2Subject } from "@utils/backend/database";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import { RoomSubjectTable, SubjectTable } from "@utils/types/database/subject";
import { ChipInputListItem, DialogProps } from "@utils/types/common";
import { Subject } from "@utils/types/subject";

// Supabase
import { supabase } from "@utils/supabaseClient";

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

  const [teacher, session] = useTeacherAccount();

  // (@SiravitPhokeed)
  // From our perspective, this dialog is the “Generate RoomSubjects” dialog,
  // but I feel that’s a bit too complicated for the layman to understand so I
  // abstracted it away as adding a subject to Subjects You Teach.
  // This way they actually recieve obvious feedback as well.

  // (@Jimmy-Tempest)
  // Very cool.

  function validate(): boolean {
    if (!teacher) return false;
    if (!subject) return false;
    if (classChipList.length === 0) return false;

    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    if (!teacher) return;
    if (!subject) return;

    const classroomList = classChipList.map((item) => item.id);

    // check if any of these classrooms already exist
    const { data, error } = await supabase
      .from<RoomSubjectTable>("RoomSubject")
      .select("*")
      .in("class", classroomList)
      .contains("teacher", [teacher.id])
      .eq("subject", subject.id);

    // console.log(data);
    if (error) {
      console.error(error);
      return;
    }
    // TODO: update this to add new teacher the new RoomSubject table
    if (data && data.length > 0) {
      onClose();
      return;
    }

    // add new RoomSubject
    classroomList.map(async (classroom) => {
      await supabase.from<RoomSubjectTable>("RoomSubject").insert({
        class: Number(classroom),
        subject: subject.id,
        teacher: [teacher.id],
      });
    });

    onSubmit(subject);
  }

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

  useEffect(() => {
    setSubject(null);
    setClassChipList([]);
  }, [show]);

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
        onSubmit={() => subject && handleSubmit()}
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
