// External libraries
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

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
import { useToggle } from "@utils/hooks/toggle";

// Types
import {
  ChipInputListItem,
  LangCode,
  SubmittableDialogProps,
} from "@utils/types/common";

const AddSubjectDialog = ({
  show,
  onClose,
  onSubmit,
}: SubmittableDialogProps): JSX.Element => {
  const { t } = useTranslation("teach");
  const supabase = useSupabaseClient();
  const locale = useRouter().locale as LangCode;

  const [subjectID, setSubjectID] = useState<number>(0);
  const [classChipList, setClassChipList] = useState<ChipInputListItem[]>([]);

  const [showAddClass, toggleShowAddClass] = useToggle();

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
      .from("room_subjects")
      .select("*")
      .in("class", classroomList)
      .contains("teacher", [teacher!.id])
      .eq("subject", subjectID);

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
      await supabase.from("room_subjects").insert({
        class: Number(classroom),
        subject: subjectID,
        teacher: [teacher!.id],
      });
    });

    onSubmit();
  }

  useEffect(() => {
    if (show) {
      if (teacher?.subjectsInCharge?.length)
        setSubjectID(teacher.subjectsInCharge?.[0].id);
      else setSubjectID(0);
      setClassChipList([]);
    }
  }, [show, teacher]);

  useEffect(() => {
    if (teacher?.subjectsInCharge) setSubjectID(teacher.subjectsInCharge[0].id);
  }, [teacher]);

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
        onClose={onClose}
        onSubmit={handleSubmit}
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
            onAdd={toggleShowAddClass}
          />
        </DialogSection>
        <DialogSection>
          <p>{t("dialog.addSubject.detailsInfo")}</p>
          <p>{t("dialog.addSubject.scheduleInfo")}</p>
        </DialogSection>
      </Dialog>
      <AddClassDialog
        show={showAddClass}
        onClose={toggleShowAddClass}
        onSubmit={(classroom) => {
          if (
            !classChipList
              .map((classItem) => Number(classItem.id))
              .includes(classroom.id)
          )
            setClassChipList([
              ...classChipList,
              {
                id: classroom.id.toString(),
                name: t("class", { ns: "common", number: classroom.number }),
              },
            ]);
          toggleShowAddClass();
        }}
      />
    </>
  );
};

export default AddSubjectDialog;
