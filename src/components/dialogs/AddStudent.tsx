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

// Backend
import { db2Student } from "@utils/backend/database";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Supabase
import { supabase } from "@utils/supabaseClient";

// Types
import { DialogProps } from "@utils/types/common";
import { StudentDB } from "@utils/types/database/person";
import { Student } from "@utils/types/person";

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
            db2Student(res.data, { contacts: true }).then((student) => {
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
          type="number"
          label={t("dialog.addStudent.studentID")}
          onChange={(e) => setStudentID(e)}
          attr={{ min: 10000, max: 99999 }}
        />
        <div>
          <h3 className="!text-base">
            {t("dialog.addStudent.searchResult.title")}
          </h3>
          <p>
            {student
              ? nameJoiner(
                  locale,
                  student.name,
                  t(`name.prefix.${student.prefix}`),
                  { prefix: true }
                )
              : t("dialog.addStudent.searchResult.notFound")}
          </p>
        </div>
      </DialogSection>
    </Dialog>
  );
};

export default AddStudentDialog;
