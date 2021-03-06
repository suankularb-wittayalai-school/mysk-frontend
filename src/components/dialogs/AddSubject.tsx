// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  ChipInputList,
  Dialog,
  DialogSection,
  Dropdown,
} from "@suankularb-components/react";

// Components
import AddClassDialog from "@components/dialogs/AddClass";

// Hooks
import { useTeacherAccount } from "@utils/hooks/auth";

// Types
import { ChipInputListItem, DialogProps } from "@utils/types/common";
import { RoomSubjectTable } from "@utils/types/database/subject";
import { Teacher } from "@utils/types/person";

// Supabase
import { supabase } from "@utils/supabaseClient";

const AddSubjectDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: () => void }): JSX.Element => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale as "en-US" | "th";

  const [subjectID, setSubjectID] = useState<number>(0);
  const [classChipList, setClassChipList] = useState<ChipInputListItem[]>([]);

  const [showAddClass, setShowAddClass] = useState<boolean>(false);

  const [teacher] = useTeacherAccount();

  // (@SiravitPhokeed)
  // From our perspective, this dialog is the “Generate RoomSubjects” dialog,
  // but I feel that’s a bit too complicated for the layman to understand so I
  // abstracted it away as adding a subject to Subjects You Teach.
  // This way they actually recieve obvious feedback as well.

  // (@Jimmy-Tempest)
  // Very cool.

  function validate(): boolean {
    if (!teacher) return false;
    if (!subjectID) return false;
    if (classChipList.length === 0) return false;

    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const classroomList = classChipList.map((item) => item.id);

    // Check if any of these classrooms already exist
    const { data, error } = await supabase
      .from<RoomSubjectTable>("room_subjects")
      .select("*")
      .in("class", classroomList)
      .contains("teacher", [(teacher as Teacher).id])
      .eq("subject", subjectID);

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

    // Add new RoomSubject
    classroomList.map(async (classroom) => {
      await supabase.from<RoomSubjectTable>("room_subjects").insert({
        class: Number(classroom),
        subject: subjectID,
        teacher: [(teacher as Teacher).id],
      });
    });

    onSubmit();
  }

  useEffect(() => {
    setSubjectID(0);
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
        onSubmit={() => handleSubmit()}
      >
        <DialogSection hasNoGap>
          <Dropdown
            name="subject"
            label={t("dialog.addSubject.subject")}
            options={
              teacher?.subjectsInCharge?.map((subject) => ({
                value: subject.id,
                label: (subject.name[locale] || subject.name.th).name,
              })) || []
            }
            onChange={(e: number) => setSubjectID(e)}
          />
          <h3 className="mb-1 !text-base">
            {t("dialog.addSubject.addClasses")}
          </h3>
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
            {
              id: classroom.id.toString(),
              name: t("class", { ns: "common", number: classroom.number }),
            },
          ]);
          setShowAddClass(false);
        }}
      />
    </>
  );
};

export default AddSubjectDialog;
