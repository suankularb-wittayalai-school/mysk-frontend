// Imports
import BaseImportDialog from "@/components/admin/BaseImportDialog";
// import importSubjects from "@/utils/backend/subject/importSubjects";
import { DialogFC } from "@/utils/types/component";
import { useTranslation } from "next-i18next";

/**
 * An interface for importing Subjects with a CSV file.
 *
 * @param open If the Dialog is open and shown.
 * @param onClose Triggers when the Dialog is closed.
 * @param onSubmit Triggers when the data is successfully imported.
 *
 * @returns A Full-screen Dialog.
 */
const ImportSubjectsDialog: DialogFC<{
  onSubmit: () => void;
}> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation("admin");

  return (
    <BaseImportDialog
      open={open}
      onClose={onClose}
      // onSubmit={async (data: ImportedSubjectData[]) => {
      onSubmit={async (data: any[]) => {
        // await importSubjects(data);
        onSubmit();
      }}
      title={t("data.import.dialog.import.title.subject")}
      // prettier-ignore
      columns={[
        { name: "name_th", type: "text" },
        { name: "name_en", type: "text" },
        { name: "short_name_th", type: "text", optional: true },
        { name: "short_name_en", type: "text", optional: true },
        { name: "code_th", type: "text" },
        { name: "code_en", type: "text" },
        { name: "type", type: '"รายวิชาพื้นฐาน" | "รายวิชาเพิ่มเติม" | "รายวิชาเลือก" | "กิจกรรมพัฒนาผู้เรียน"' },
        { name: "group", type: '"วิทยาศาสตร์" | "คณิตศาสตร์" | "ภาษาต่างประเทศ" | "ภาษาไทย" | "สุขศึกษาและพลศึกษา" | "การงานอาชีพและเทคโนโลยี" | "ศิลปะ" | "สังคมศึกษา ศาสนา และวัฒนธรรม" | "การศึกษาค้นคว้าด้วยตนเอง"' },
        { name: "credit", type: "numeric" },
        { name: "description_th", type: "text", optional: true },
        { name: "description_en", type: "text", optional: true },
        { name: "year", type: "number (in AD)" },
        { name: "semester", type: "1 | 2" },
      ]}
    />
  );
};

export default ImportSubjectsDialog;
