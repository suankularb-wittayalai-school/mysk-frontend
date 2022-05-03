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

// Types
import { DialogProps } from "@utils/types/common";
import {
  Subject,
  SubjectGroup,
  SubjectTypeEN,
  SubjectTypeTH,
} from "@utils/types/subject";
import { Teacher } from "@utils/types/person";
import { useSubjectGroupOption } from "@utils/hooks/subject";
import { nameJoiner } from "@utils/helpers/name";
import { createSubject } from "@utils/backend/subject/subject";
import { supabase } from "@utils/supabaseClient";

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
  const { t } = useTranslation("subjects");
  const locale = useRouter().locale == "en-US" ? "en-US" : "th";

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

  // Form control
  const [form, setForm] = useState<Subject>({
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
    credit: 0,
    syllabus: null,
  });

  const [chipLists, setChipLists] = useState<{
    teachers: { id: string; name: string }[];
    coTeachers: { id: string; name: string }[];
  }>({
    teachers: [],
    coTeachers: [],
  });

  // Populate the form control with data if mode is edit
  useEffect(() => {
    if (mode == "edit" || subject) {
      setForm({
        ...form,
        ...subject,
      });
    }
  }, [mode, subject]);

  useEffect(() => {
    if (mode == "edit") {
      if (form.teachers.length > 0) {
        setChipLists({
          ...chipLists,
          teachers: form.teachers.map((teacher: Teacher) => ({
            id: teacher.id.toString(),
            name: teacher.name[locale]?.firstName ?? teacher.name.th.firstName,
          })),
        });
      }

      if (form.coTeachers && form.coTeachers.length > 0) {
        setChipLists({
          ...chipLists,
          coTeachers: form.coTeachers.map((teacher: Teacher) => ({
            id: teacher.id.toString(),
            name: teacher.name[locale]?.firstName ?? teacher.name.th.firstName,
          })),
        });
      }

      if (form.syllabus && form.syllabus !== "") {
        if (typeof form.syllabus === "string") {
          supabase.storage
            .from("syllabus")
            .download(form.syllabus)
            .then((res) => {
              if (res.error) console.error(res.error);

              if (res.data)
                setForm({
                  ...form,
                  syllabus: new File([res.data], "syllabus", {
                    type: "application/pdf",
                  }),
                });
            });
        }
      }
    }
  }, [mode, form]);

  useEffect(() => {
    if (mode == "add") {
      setForm({
        ...form,
        subjectGroup: subjectGroups ? subjectGroups[0] : form.subjectGroup,
      });
    }
  }, [mode, subjectGroups]);

  async function handleSubmit() {
    if (mode == "add") {
      const { data, error } = await createSubject(form);
      if (error) {
        console.error(error);
      }
      if (!data) {
        return;
      }
    }
    // else if (mode == "edit") {
    //   await onSubmit();
    // }
    onSubmit();
  }

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
        onSubmit={handleSubmit}
      >
        {/* {console.log(form)} */}
        {/* Thai name */}
        <DialogSection
          name="name-th"
          title="Local name (Thai)"
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="code-th"
            type="text"
            label="Code"
            onChange={(e) =>
              setForm({ ...form, code: { ...form.code, th: e } })
            }
            defaultValue={form.code.th}
          />
          <KeyboardInput
            name="name-th"
            type="text"
            label="Full name"
            onChange={(e) =>
              setForm({
                ...form,
                name: { ...form.name, th: { ...form.name.th, name: e } },
              })
            }
            defaultValue={form.name.th.name}
          />
          <KeyboardInput
            name="short-name-th"
            type="text"
            label="Short name"
            helperMsg="Shown for short periods in Schedule."
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  th: { ...form.name.th, shortName: e },
                },
              })
            }
            defaultValue={form.name.th.shortName}
          />
        </DialogSection>

        {/* English name */}
        <DialogSection
          name="name-en"
          title="English name"
          isDoubleColumn
          hasNoGap
        >
          <KeyboardInput
            name="code-en"
            type="text"
            label="English code"
            onChange={(e) =>
              setForm({ ...form, code: { ...form.code, "en-US": e } })
            }
            defaultValue={form.code["en-US"]}
          />
          <KeyboardInput
            name="name-en"
            type="text"
            label="English name"
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  "en-US": { ...form.name["en-US"], name: e },
                },
              })
            }
            defaultValue={form.name["en-US"].name}
          />
          <KeyboardInput
            name="short-name-en"
            type="text"
            label="English short name"
            helperMsg="Shown for short periods in Schedule."
            onChange={(e) =>
              setForm({
                ...form,
                name: {
                  ...form.name,
                  "en-US": { ...form.name["en-US"], shortName: e },
                },
              })
            }
            defaultValue={form.name["en-US"].shortName}
          />
        </DialogSection>

        {/* Description */}
        <DialogSection name="desc" title="Description">
          <TextArea
            name="desc-th"
            label="Local description (Thai)"
            onChange={(e) =>
              setForm({
                ...form,
                description: form.description
                  ? { ...form.description, th: e }
                  : undefined,
              })
            }
            defaultValue={form.description?.th}
          />
          <TextArea
            name="desc-en"
            label="English description"
            onChange={(e) =>
              setForm({
                ...form,
                description: form.description
                  ? { ...form.description, "en-US": e }
                  : undefined,
              })
            }
            defaultValue={form.description ? form.description["en-US"] : ""}
          />
        </DialogSection>

        {/* School */}
        <DialogSection name="school" title="School" isDoubleColumn hasNoGap>
          <KeyboardInput
            name="year"
            type="number"
            label="Academic year"
            helperMsg="In Buddhist Era (BE)."
            onChange={(e) => setForm({ ...form, year: Number(e) })}
            defaultValue={form.year}
            attr={{ min: 2005 }}
          />
          <KeyboardInput
            name="semester"
            type="number"
            label="Semester"
            onChange={(e) => setForm({ ...form, semester: Number(e) as 1 | 2 })}
            defaultValue={form.semester}
            attr={{ min: 1, max: 2 }}
          />
          <KeyboardInput
            name="credit"
            type="number"
            label="Credit"
            onChange={(e) => setForm({ ...form, credit: Number(e) })}
            attr={{ min: 0, step: 0.5 }}
            defaultValue={form.credit}
          />
          <FileInput
            name="syllabus"
            label="Syllabus"
            onChange={(e: File) => setForm({ ...form, syllabus: e })}
            attr={{ accept: ".pdf" }}
            defaultValue={
              typeof form.syllabus !== "string" && form.syllabus
                ? form.syllabus
                : undefined
            }
          />
        </DialogSection>

        {/* Category */}
        <DialogSection name="category" title="Category" isDoubleColumn hasNoGap>
          <Dropdown
            name="subject-group"
            label="Subject group"
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
            defaultValue={form.subjectGroup?.id}
          />
          <Dropdown
            name="type"
            label="Subject type"
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
                : subjectTypes.findIndex((type) => type.th === form.type.th)
            }
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
            <p className="font-display">Teachers</p>
            <ChipInputList
              list={chipLists.teachers}
              onAdd={() => setShowAddTeacher(true)}
              onChange={(newList) => {
                setChipLists({
                  ...chipLists,
                  teachers: newList as { id: string; name: string }[],
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
            <p className="font-display">Co-teachers</p>
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
