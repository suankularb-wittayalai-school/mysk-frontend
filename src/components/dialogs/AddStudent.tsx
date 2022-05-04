// Modules
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput,
} from "@suankularb-components/react";

// Types
import { DialogProps } from "@utils/types/common";
import { Student } from "@utils/types/person";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Hooks
import { useSubjectGroupOption } from "@utils/hooks/subject";
import { useTeacherOption } from "@utils/hooks/teacher";
import { supabase } from "@utils/supabaseClient";
import { StudentDB } from "@utils/types/database/person";
import { db2Student } from "@utils/backend/database";

const AddStudentDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: (student: Student) => void }): JSX.Element => {
  const { t } = useTranslation("common");
  const locale = useRouter().locale as "en-US" | "th";

  const [studentID, setStudentID] = useState<string>("");
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (studentID.length === 5) {
      supabase
        .from<StudentDB>("student")
        .select("id, std_id, people:person(*)")
        .match({ std_id: Number(studentID) })
        .limit(1)
        .single()
        .then((res) => {
          if (res.data) {
            db2Student(res.data).then((student) => {
              setStudent(student);
            });
          }
        });
    } else setStudent(null);
  }, [studentID]);

  useEffect(() => setStudent(null), [show]);

  return (
    <Dialog
      type="regular"
      label="add-student"
      title={t("dialog.addStudent.title")}
      supportingText={t("dialog.addStudent.supportingText")}
      actions={[
        { name: t("dialog.addStudent.action.cancel"), type: "close" },
        { name: t("dialog.addStudent.action.add"), type: "submit" },
      ]}
      show={show}
      onClose={() => onClose()}
      onSubmit={() => student && onSubmit(student)}
    >
      <DialogSection hasNoGap>
        <KeyboardInput
          name="student-id"
          type="text"
          label={t("dialog.addStudent.studentID")}
          onChange={(e) => setStudentID(e)}
          attr={{ minLength: 5, maxLength: 5 }}
        />
      </DialogSection>
      <DialogSection hasNoGap>
        <div>
          <h3 className="!text-base">Search result</h3>
          <p>
            {student
              ? nameJoiner(
                  locale,
                  student.name,
                  t(`name.prefix.${student.prefix}`),
                  { prefix: true }
                )
              : "No students with this ID."}
          </p>
        </div>
      </DialogSection>
    </Dialog>
  );
};

export default AddStudentDialog;
