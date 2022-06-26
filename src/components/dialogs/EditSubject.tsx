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
  FileInput,
  KeyboardInput,
  TextArea,
} from "@suankularb-components/react";

// Components
import AddTeacherDialog from "@components/dialogs/AddTeacher";
import DiscardDraft from "@components/dialogs/DiscardDraft";

// Backend
import { createSubject, editSubject } from "@utils/backend/subject/subject";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Hooks
import { useSubjectGroupOption } from "@utils/hooks/subject";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { ChipInputListItem, DialogProps } from "@utils/types/common";
import {
  Subject,
  SubjectName,
  SubjectTypeEN,
  SubjectTypeTH,
} from "@utils/types/subject";

// Miscellaneous
import { subjectCodeENPattern, subjectCodeTHPattern } from "@utils/patterns";

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
  const { t } = useTranslation(["subjects", "common", "admin"]);
  const locale = useRouter().locale as "en-US" | "th";

  // Dialogs
  const [showDiscard, setShowDiscard] = useState<boolean>(false);
  const [showAddTeacher, setShowAddTeacher] = useState<boolean>(false);
  const [showAddCoTeacher, setShowAddCoTeacher] = useState<boolean>(false);

  const subjectGroups = useSubjectGroupOption();
  const subjectTypes: { th: SubjectTypeTH; "en-US": SubjectTypeEN }[] = [
    { th: "รายวิชาพื้นฐาน", "en-US": "Core Courses" },
    { th: "รายวิชาเพิ่มเติม", "en-US": "Additional Courses" },
    { th: "กิจกรรมพัฒนาผู้เรียน", "en-US": "Learner’s Development Activities" },
    { th: "รายวิชาเลือก", "en-US": "Elective Courses" },
  ];

  const [loading, setLoading] = useState<boolean>(false);

  // (@SiravitPhokeed)
  // Looking back at this code… this doesn’t look very good, does it?
  // Not sure I feel using a type like this for form control anymore, causes a lot
  // of problems when I made English name optional.

  // Form control
  const defaultForm: Subject = {
    id: 0,

    // Name
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

    // Description
    description: {
      "en-US": "",
      th: "",
    },

    // Personnel
    teachers: [],
    coTeachers: [],

    // Category
    subjectGroup: {
      id: 0,
      name: {
        "en-US": "",
        th: "",
      },
    },
    type: {
      th: "รายวิชาพื้นฐาน",
      "en-US": "Core Courses",
    },

    // School
    year: new Date().getFullYear(),
    // Set to 2 if the current month is after October but before March
    semester: new Date().getMonth() < 3 && new Date().getMonth() > 8 ? 2 : 1,
    credit: 0.5,
    syllabus: null,
  };

  const [form, setForm] = useState<Subject>(defaultForm);

  // Chip List control
  type ChipListsType = {
    teachers: ChipInputListItem[];
    coTeachers: ChipInputListItem[];
  };

  const [chipLists, setChipLists] = useState<ChipListsType>({
    teachers: [],
    coTeachers: [],
  });
  const [syllabus, setSyllabus] = useState<File | null>(null);

  useEffect(() => {
    // Populate the form control with data if mode is edit
    if (mode == "edit" || subject) {
      setForm({
        ...form,
        ...subject,
      });
    }
    // Resets form control if mode is add
    else if (mode == "add") {
      setForm(defaultForm);
    }
  }, [show, mode, subject]);

  useEffect(() => {
    if (subject?.syllabus && subject.syllabus !== "") {
      if (typeof subject.syllabus === "string") {
        supabase.storage
          .from("syllabus")
          .download(subject.syllabus)
          .then((res) => {
            if (res.error) {
              console.error(res.error);
              setForm({
                ...form,
                ...subject,
                syllabus: null,
              });
            }

            if (res.data) {
              setSyllabus(
                new File([res.data], "syllabus", {
                  type: "application/pdf",
                })
              );
              setForm({
                ...form,
                ...subject,
                syllabus: new File([res.data], "syllabus", {
                  type: "application/pdf",
                }),
              });
            }
          });
      }
    }
  }, [subject]);

  useEffect(() => {
    // Populate the Chip List control with data if mode is edit
    if (mode == "edit" && subject) {
      setChipLists({
        teachers: subject.teachers.map((teacher) => ({
          id: teacher.id.toString(),
          name: nameJoiner(locale, teacher.name),
        })),
        coTeachers: subject.coTeachers
          ? subject.coTeachers.map((coTeacher) => ({
              id: coTeacher.id.toString(),
              name: nameJoiner(locale, coTeacher.name),
            }))
          : [],
      });
    }

    // Resets Chip List control if mode is add
    else if (mode == "add") {
      setChipLists({
        teachers: [],
        coTeachers: [],
      });
    }
  }, [show, mode]);

  useEffect(() => {
    if (mode == "add") {
      setForm({
        ...form,
        subjectGroup: subjectGroups ? subjectGroups[0] : form.subjectGroup,
      });
    }
  }, [mode, subjectGroups]);

  // Form validation
  function validate() {
    // Name
    if (
      form.name.th.name.length == 0 ||
      (form.name["en-US"] as SubjectName).name.length == 0
    )
      return false;
    // Code
    if (form.code.th.length == 0 || form.code["en-US"].length == 0)
      return false;
    // Personnel
    if (chipLists.teachers.length == 0) return false;
    // Category
    if (form.subjectGroup.id == 0) return false;
    // School
    if (form.year == 0) return false;
    if ((form.semester as number) == 0) return false;
    if (form.credit == 0) return false;

    return true;
  }

  // Form submission
  async function handleSubmit() {
    setLoading(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    if (mode == "add") {
      const { data, error } = await createSubject(form);
      if (error) {
        console.error(error);
        setLoading(false);
      }
      if (!data) {
        setLoading(false);
        return;
      }
    } else if (mode == "edit") {
      const { data, error } = await editSubject(form);
      if (error) {
        console.error(error);
        setLoading(false);
      }
      if (!data) {
        setLoading(false);
        return;
      }
    }
    onSubmit();

    setLoading(false);
  }

  return (
    <>
      <Dialog
        type="large"
        label={mode == "edit" ? "edit-subject" : "add-subject"}
        title={t(`dialog.editSubject.title.${mode}`, { ns: "admin" })}
        actions={[
          {
            name: t("dialog.editSubject.action.cancel", { ns: "admin" }),
            type: "close",
          },
          {
            name: t("dialog.editSubject.action.save", { ns: "admin" }),
            type: "submit",
            disabled: !validate() || loading,
          },
        ]}
        show={show}
        onClose={() => setShowDiscard(true)}
        onSubmit={() => handleSubmit()}
      >
        {/* Thai name */}
        <DialogSection
          name="name-th"
          title={t("item.name.title")}
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="code-th"
            type="text"
            label={t("item.name.code")}
            onChange={(e) =>
              setForm({ ...form, code: { ...form.code, th: e } })
            }
            defaultValue={subject?.code.th}
            attr={{ pattern: subjectCodeTHPattern }}
          />
          <KeyboardInput
            name="name-th"
            type="text"
            label={t("item.name.name")}
            onChange={(e) =>
              setForm({
                ...form,
                name: { ...form.name, th: { ...form.name.th, name: e } },
              })
            }
            defaultValue={subject?.name.th.name}
          />
          <KeyboardInput
            name="short-name-th"
            type="text"
            label={t("item.name.shortName")}
            helperMsg={t("item.name.shortName_helper")}
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  th: { ...form.name.th, shortName: e },
                },
              })
            }
            defaultValue={subject?.name.th.shortName}
          />
        </DialogSection>

        {/* English name */}
        <DialogSection
          name="name-en"
          title={t("item.enName.title")}
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="code-en"
            type="text"
            label={t("item.enName.code")}
            onChange={(e) =>
              setForm({ ...form, code: { ...form.code, "en-US": e } })
            }
            defaultValue={subject?.code["en-US"]}
            attr={{ pattern: subjectCodeENPattern }}
          />
          <KeyboardInput
            name="name-en"
            type="text"
            label={t("item.enName.name")}
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  "en-US": { ...form.name["en-US"], name: e },
                },
              })
            }
            defaultValue={subject?.name["en-US"]?.name || ""}
          />
          <KeyboardInput
            name="short-name-en"
            type="text"
            label={t("item.enName.shortName")}
            helperMsg={t("item.name.shortName_helper")}
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  "en-US": {
                    ...(form.name["en-US"] as SubjectName),
                    shortName: e,
                  },
                },
              })
            }
            defaultValue={subject?.name["en-US"]?.shortName || ""}
          />
        </DialogSection>

        {/* Description */}
        <DialogSection name="desc" title={t("item.desc.title")}>
          <div>
            <TextArea
              name="desc-th"
              label={t("item.desc.thDesc")}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: form.description
                    ? { ...form.description, th: e }
                    : undefined,
                })
              }
              defaultValue={subject?.description?.th}
            />
            <TextArea
              name="desc-en"
              label={t("item.desc.enDesc")}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: form.description
                    ? { ...form.description, "en-US": e }
                    : undefined,
                })
              }
              defaultValue={
                subject?.description ? subject?.description["en-US"] : ""
              }
            />
          </div>
        </DialogSection>

        {/* School */}
        <DialogSection
          name="school"
          title={t("item.school.title")}
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="year"
            type="number"
            label={t("item.school.year")}
            onChange={(e) => setForm({ ...form, year: Number(e) })}
            defaultValue={subject ? subject.year : new Date().getFullYear()}
            attr={{ min: 2005 }}
          />
          <KeyboardInput
            name="semester"
            type="number"
            label={t("item.school.semester")}
            onChange={(e) => setForm({ ...form, semester: Number(e) as 1 | 2 })}
            defaultValue={
              subject
                ? subject.semester
                : new Date().getMonth() < 3 && new Date().getMonth() > 8
                ? 2
                : 1
            }
            attr={{ min: 1, max: 2 }}
          />
          <KeyboardInput
            name="credit"
            type="number"
            label={t("item.school.credit")}
            onChange={(e) => setForm({ ...form, credit: Number(e) })}
            attr={{ min: 0.5, step: 0.5 }}
            defaultValue={subject ? subject.credit : 0.5}
          />
          <FileInput
            name="syllabus"
            label={t("item.school.syllabus")}
            noneAttachedMsg={t("input.none.noFilesAttached", { ns: "common" })}
            onChange={(e: File) => setForm({ ...form, syllabus: e })}
            attr={{ accept: "application/pdf" }}
            defaultValue={syllabus ? syllabus : undefined}
          />
        </DialogSection>

        {/* Category */}
        <DialogSection
          name="category"
          title={t("item.category.title")}
          isDoubleColumn
          hasNoGap
        >
          <Dropdown
            name="subject-group"
            label={t("item.category.subjectGroup")}
            options={subjectGroups.map((subjectGroup) => ({
              value: subjectGroup.id,
              label: subjectGroup.name[locale],
            }))}
            onChange={(e: number) =>
              setForm({
                ...form,
                subjectGroup: subjectGroups.filter(
                  (subjectGroup) => subjectGroup.id == e
                )[0],
              })
            }
            defaultValue={subject?.subjectGroup?.id}
          />
          <Dropdown
            name="type"
            label={t("item.category.subjectType")}
            options={subjectTypes.map((type, index) => ({
              value: index,
              label: type[locale],
            }))}
            onChange={(e: number) =>
              setForm({
                ...form,
                type: subjectTypes[e],
              })
            }
            defaultValue={
              mode === "add"
                ? 0
                : subjectTypes.findIndex((type) => type.th === subject?.type.th)
            }
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

      {/* Dialogs */}
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

export default EditSubjectDialog;
