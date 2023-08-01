// Imports
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import BaseImportDialog from "@/components/admin/BaseImportDialog";
// import importStudents from "@/utils/backend/person/importStudents";
import { DialogFC } from "@/utils/types/component";

/**
 * An interface for importing Students with a CSV file.
 *
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the data is successfully imported.
 *
 * @returns A Full-screen Dialog.
 */
const ImportStudentsDialog: DialogFC<{
  onSubmit: () => void;
}> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation("admin");

  const supabase = useSupabaseClient();

  return (
    <BaseImportDialog
      open={open}
      onClose={onClose}
      // onSubmit={async (data: ImportedStudentData[]) => {
      onSubmit={async (data: any[]) => {
        // await importStudents(supabase, data);
        onSubmit();
      }}
      title={t("data.import.dialog.import.title.student")}
      columns={[
        { name: "prefix", type: '"เด็กชาย" | "นาย"' },
        { name: "first_name_th", type: "text" },
        { name: "first_name_en", type: "text" },
        { name: "middle_name_th", type: "text", optional: true },
        { name: "middle_name_en", type: "text", optional: true },
        { name: "last_name_th", type: "text" },
        { name: "last_name_en", type: "text" },
        { name: "birthdate", type: "date (YYYY-MM-DD) (in AD)" },
        { name: "citizen_id", type: "numeric (13-digit)" },
        { name: "student_id", type: "numeric (5-digit)" },
        { name: "class", type: "numeric (3-digit)" },
        { name: "class_number", type: "number" },
        { name: "email", type: "email" },
      ]}
    />
  );
};

export default ImportStudentsDialog;
