// Imports
import BaseImportDialog from "@/components/admin/BaseImportDialog";
// import importTeachers from "@/utils/backend/person/importTeachers";
import { DialogFC } from "@/utils/types/component";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";

/**
 * An interface for importing Teachers with a CSV file.
 *
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the data is successfully imported.
 *
 * @returns A Full-screen Dialog.
 */
const ImportTeachersDialog: DialogFC<{
  onSubmit: () => void;
}> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation("admin");

  const supabase = useSupabaseClient();

  return (
    <BaseImportDialog
      open={open}
      onClose={onClose}
      // onSubmit={async (data: ImportedTeacherData[]) => {
      onSubmit={async (data: any[]) => {
        // await importTeachers(supabase, data);
        onSubmit();
      }}
      title={t("data.import.dialog.import.title.teacher")}
      // prettier-ignore
      columns={[
        { name: "prefix", type: '"เด็กชาย" | "นาย" | "นาง" | "นางสาว"' },
        { name: "first_name_th", type: "text" },
        { name: "first_name_en", type: "text" },
        { name: "middle_name_th", type: "text", optional: true },
        { name: "middle_name_en", type: "text", optional: true },
        { name: "last_name_th", type: "text" },
        { name: "last_name_en", type: "text" },
        { name: "birthdate", type: "date (YYYY-MM-DD) (in AD)" },
        { name: "citizen_id", type: "numeric (13-digit)" },
        { name: "teacher_id", type: "text" },
        { name: "subject_group", type: '"วิทยาศาสตร์" | "คณิตศาสตร์" | "ภาษาต่างประเทศ" | "ภาษาไทย" | "สุขศึกษาและพลศึกษา" | "การงานอาชีพและเทคโนโลยี" | "ศิลปะ" | "สังคมศึกษา ศาสนา และวัฒนธรรม" | "การศึกษาค้นคว้าด้วยตนเอง"' },
        { name: "email", type: "email" },
      ]}
    />
  );
};

export default ImportTeachersDialog;
