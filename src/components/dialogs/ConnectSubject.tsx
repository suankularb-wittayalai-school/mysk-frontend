// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";

// SK Components
import {
  ChipInputList,
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Components
import AddTeacherDialog from "@components/dialogs/AddTeacher";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Types
import { ChipInputListItem, SubmittableDialogProps } from "@utils/types/common";
import { Teacher } from "@utils/types/person";

const ConnectSubjectDialog = ({
  show,
  onClose,
  onSubmit,
}: SubmittableDialogProps) => {
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale as "en-US" | "th";

  // Dialogs
  const [showAddTeacher, setShowAddTeacher] = useState<boolean>(false);
  const [showAddCoTeacher, setShowAddCoTeacher] = useState<boolean>(false);

  // Form control
  const [form, setForm] = useState<{
    teachers: Teacher[];
    coTeachers: Teacher[];
  }>({
    teachers: [],
    coTeachers: [],
  });

  // Chip List control
  type ChipListsType = {
    teachers: ChipInputListItem[];
    coTeachers: ChipInputListItem[];
  };

  const [chipLists, setChipLists] = useState<ChipListsType>({
    teachers: [],
    coTeachers: [],
  });

  function validate(): boolean {
    return true;
  }

  return (
    <>
      <Dialog
        type="large"
        label="connect-subject"
        title={t("dialog.connectSubject.title")}
        supportingText={t("dialog.connectSubject.supportingText")}
        actions={[
          {
            name: t("dialog.connectSubject.action.cancel"),
            type: "close",
          },
          {
            name: t("dialog.connectSubject.action.save"),
            type: "submit",
            disabled: !validate(),
          },
        ]}
        show={show}
        onClose={onClose}
        onSubmit={onSubmit}
      >
        <p>{t("dialog.connectSubject.note")}</p>
        {/* Connect subject */}
        <DialogSection
          name="subject"
          title="Connect subject"
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="subject-code"
            type="text"
            label="Subject code"
            helperMsg="Search for the subject with its code."
            onChange={() => {}}
            attr={{ pattern: "[\u0E00-\u0E7FA-Z]\\d{5}" }}
          />
          <div>
            <h3 className="!text-base">Result</h3>
            <p>Communication and Presentation</p>
          </div>
          <KeyboardInput
            name="class"
            type="text"
            label="Class"
            helperMsg="The class you’re teaching this subject to."
            errorMsg="Invalid. Should be 3-digit, i.e. 408."
            useAutoMsg
            onChange={() => {}}
            attr={{ pattern: "[1-6][0-1][1-9]" }}
          />
        </DialogSection>
        {/* Class access */}
        <DialogSection name="class-access" title="Class access" hasNoGap>
          <KeyboardInput
            name="ggc-code"
            type="text"
            label="Google Classroom code"
            errorMsg="Invalid. Should be 6-digit or 7-digit."
            useAutoMsg
            onChange={() => {}}
            attr={{ pattern: "[a-z0-9]{6,7}" }}
          />
          <KeyboardInput
            name="ggc-link"
            type="url"
            label="Google Classroom link"
            errorMsg="Invalid. Must be a full Classroom link."
            useAutoMsg
            onChange={() => {}}
            attr={{ pattern: "https://classroom.google.com/c/[a-zA-Z0-9]{16}" }}
          />
          <KeyboardInput
            name="ggc-meet"
            type="url"
            label="Google Meet link"
            errorMsg="Invalid. Must be a full Meet link."
            useAutoMsg
            onChange={() => {}}
          />
        </DialogSection>

        {/* Personnel */}
        <DialogSection
          name="personnel"
          title="Personnel"
          isDoubleColumn
          hasNoGap
        >
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">{t("item.personnel.teachers")}</h3>
            <ChipInputList
              list={chipLists.teachers}
              onAdd={() => setShowAddTeacher(true)}
              onChange={(newList) => {
                setChipLists({
                  ...chipLists,
                  teachers: newList as ChipInputListItem[],
                });
                setForm({
                  ...form,
                  teachers: form.teachers.filter((teacher) => {
                    teacher.id in newList.map(({ id }) => id);
                  }),
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="!text-base">{t("item.personnel.coTeachers")}</h3>
            <ChipInputList
              list={chipLists.coTeachers}
              onAdd={() => setShowAddCoTeacher(true)}
              onChange={(newList) => {
                setChipLists({
                  ...chipLists,
                  coTeachers: newList as { id: string; name: string }[],
                });
                setForm({
                  ...form,
                  coTeachers: form.coTeachers
                    ? form.coTeachers.filter((coTeacher) => {
                        coTeacher.id in newList.map(({ id }) => id);
                      })
                    : [],
                });
              }}
            />
          </div>
        </DialogSection>
      </Dialog>
      // Dialogs
      <AddTeacherDialog
        show={showAddTeacher}
        onClose={() => setShowAddTeacher(false)}
        onSubmit={(teacher) => {
          // Close the dialog
          setShowAddTeacher(false);
          // Update the chip list
          setChipLists({
            ...chipLists,
            teachers: [
              ...chipLists.teachers,
              {
                id: teacher.id.toString(),
                name: nameJoiner(locale, teacher.name),
              },
            ],
          });
          // Update the form control
          setForm({
            ...form,
            teachers: [...form.teachers, teacher],
          });
        }}
      />
      <AddTeacherDialog
        show={showAddCoTeacher}
        onClose={() => setShowAddCoTeacher(false)}
        onSubmit={(teacher) => {
          // Close the dialog
          setShowAddCoTeacher(false);
          // Update the chip list
          setChipLists({
            ...chipLists,
            coTeachers: [
              ...chipLists.coTeachers,
              {
                id: teacher.id.toString(),
                name: nameJoiner(locale, teacher.name),
              },
            ],
          });
          // Update the form control
          setForm({
            ...form,
            coTeachers: form.coTeachers
              ? [...form.coTeachers, teacher]
              : [teacher],
          });
        }}
      />
    </>
  );
};

export default ConnectSubjectDialog;
