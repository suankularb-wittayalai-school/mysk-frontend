// External libraries
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

// SK Components
import {
  Dialog,
  DialogSection,
  KeyboardInput
} from "@suankularb-components/react";

// Backend
import { db2Student } from "@utils/backend/database";

// Helpers
import { nameJoiner } from "@utils/helpers/name";

// Types
import { DialogProps, LangCode } from "@utils/types/common";
import { Student } from "@utils/types/person";

const AddStudentDialog = ({
  show,
  onClose,
  onSubmit,
}: DialogProps & { onSubmit: (student: Student) => void }): JSX.Element => {
  const { t } = useTranslation("common");
  const supabase = useSupabaseClient();
  const locale = useRouter().locale as LangCode;

  const [studentID, setStudentID] = useState<string>("");
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (studentID.length === 5) {
      supabase
        .from("student")
        .select("*, person(*)")
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
          onChange={setStudentID}
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
                  student.prefix,
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
