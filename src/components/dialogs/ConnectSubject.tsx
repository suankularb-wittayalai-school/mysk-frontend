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
import { Subject, SubjectListItem } from "@utils/types/subject";

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

  // Search subject via code
  const [subjectCode, setSubjectCode] = useState<string>("");
  const [subject, setSubject] = useState<Subject | null>(null);

  // Form control
  const [form, setForm] = useState<{
    classroom: string;
    teachers: Array<Teacher>;
    coTeachers?: Array<Teacher>;
    ggcCode?: string;
    ggcLink?: string;
    ggMeetLink?: string;
  }>({
    classroom: "",
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
    // Search subject via code
    if (!subject) return false;
    if (!(form.classroom && form.classroom.match(/[1-6][0-1][1-9]/)))
      return false;

    // Class access
    if (form.ggcCode?.length != 5 && form.ggcCode?.length != 6) return false;
    if (
      form.ggcLink &&
      !form.ggcLink.match(/https:\/\/classroom.google.com\/c\/[a-zA-Z0-9]{16}/)
    )
      return false;
    if (form.ggMeetLink) {
      try {
        new URL(form.ggMeetLink);
      } catch (_) {
        return false;
      }
    }

    // Personnel
    if (form.teachers.length == 0) return false;

    return true;
  }

  return (
    <>
      <Dialog
        type="large"
        label="add-subject"
        title={t("dialog.connectSubject.title")}
        supportingText={t("dialog.connectSubject.supportingText")}
        actions={[
          {
            name: t("dialog.connectSubject.action.cancel"),
            type: "close",
          },
          {
            name: t("dialog.connectSubject.action.connect"),
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
          name="connect-subject"
          title={t("dialog.connectSubject.connectSubject.title")}
          isDoubleColumn
          hasNoGap
        >
          {/* Search subject via code */}
          <KeyboardInput
            name="subject-code"
            type="text"
            label={t("dialog.connectSubject.connectSubject.subjectCode")}
            helperMsg={t(
              "dialog.connectSubject.connectSubject.subjectCode_helper"
            )}
            errorMsg={t(
              "dialog.connectSubject.connectSubject.subjectCode_error"
            )}
            useAutoMsg
            onChange={(e) => setSubjectCode(e)}
            attr={{ pattern: "[\u0E00-\u0E7FA-Z]\\d{5}|[A-Z]{1,3}\\d{5}" }}
          />
          <div>
            <h3 className="!text-base">
              {t("dialog.connectSubject.connectSubject.searchResult.title")}
            </h3>
            <p>
              {subject?.name ||
                t("dialog.connectSubject.connectSubject.searchResult.notFound")}
            </p>
          </div>

          {/* Class */}
          <KeyboardInput
            name="class"
            type="text"
            label={t("dialog.connectSubject.connectSubject.class")}
            helperMsg={t("dialog.connectSubject.connectSubject.class_helper")}
            errorMsg={t("dialog.connectSubject.connectSubject.class_error")}
            useAutoMsg
            onChange={(e) => setForm({ ...form, classroom: e })}
            attr={{ pattern: "[1-6][0-1][1-9]" }}
          />
        </DialogSection>

        {/* Class access */}
        <DialogSection
          name="class-access"
          title={t("dialog.connectSubject.classAccess.title")}
          hasNoGap
        >
          <KeyboardInput
            name="ggc-code"
            type="text"
            label={t("dialog.connectSubject.classAccess.ggcCode")}
            errorMsg={t("dialog.connectSubject.classAccess.ggcCode_error")}
            useAutoMsg
            onChange={(e) => setForm({ ...form, ggcCode: e })}
            attr={{ pattern: "[a-z0-9]{6,7}" }}
          />
          <KeyboardInput
            name="ggc-link"
            type="url"
            label={t("dialog.connectSubject.classAccess.ggcLink")}
            errorMsg={t("dialog.connectSubject.classAccess.ggcLink_error")}
            useAutoMsg
            onChange={(e) => setForm({ ...form, ggcLink: e })}
            attr={{ pattern: "https://classroom.google.com/c/[a-zA-Z0-9]{16}" }}
          />
          <KeyboardInput
            name="ggc-meet"
            type="url"
            label={t("dialog.connectSubject.classAccess.ggMeetLink")}
            errorMsg={t("dialog.connectSubject.classAccess.ggMeetLink_error")}
            useAutoMsg
            onChange={(e) => setForm({ ...form, ggMeetLink: e })}
          />
        </DialogSection>

        {/* Personnel */}
        <DialogSection
          name="personnel"
          title={t("item.personnel.title")}
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

      {/* Dialog */}
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
