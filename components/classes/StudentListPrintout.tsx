import StudentsListPaper from "@/components/classes/StudentsListPaper";
import StudentsPrintOptions from "@/components/classes/StudentsPrintOptions";
import PrintPage from "@/components/common/print/PrintPage";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { LangCode, StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { useTranslation } from "next-i18next";
import { list } from "radash";

/**
 * The options type for the Student List Printout.
 */
export type OptionsType = {
  language: LangCode;
  columns: (
    | "index"
    | "classNo"
    | "studentID"
    | "prefix"
    | "fullName"
    | "nickname"
    | "allergies"
    | "shirtSize"
    | "pantsSize"
    | "elective"
  )[];
  filters: ("noElective" | "hasAllergies")[];
  numEmpty: number;
  enableNotes: boolean;
  enableTimestamp: boolean;
};

/**
 * The maximum number of empty columns displayed on the preview.
 */
export const MAXIMUM_EMPTY_COLUMNS = 20;

/**
 * The preview page for the Student List Printout.
 *
 * @param classroom The Classroom to display the Student List for.
 * @param columns The columns the user can choose to display.
 * @param filters The filters the user can choose to apply.
 * @param studentList The list of all Students in this Class.
 */
const StudentListPrintout: StylableFC<{
  header: StylableFC<{ locale: LangCode }>;
  columns: OptionsType["columns"];
  filters: OptionsType["filters"];
  studentList: Student[];
}> = ({ header, columns, filters, studentList, style, className }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "print" });

  // Form control for the options.
  // Placed in the parent component as this state is shared between the Paper
  // and Options.
  const { form, setForm, formProps } = useForm<
    | "language"
    | "columns"
    | "filters"
    | "numEmpty"
    | "enableNotes"
    | "enableTimestamp"
  >([
    { key: "language", defaultValue: locale },
    {
      key: "columns",
      defaultValue: (
        ["index", "classNo", "prefix", "fullName"] as OptionsType["columns"]
      ).filter((column) => columns.includes(column)),
    },
    { key: "filters", defaultValue: [] },
    {
      key: "numEmpty",
      defaultValue: "10",
      // Must be an integer under MAXIMUM_EMPTY_COLUMNS.
      validate: (value) => list(MAXIMUM_EMPTY_COLUMNS).includes(Number(value)),
    },
    { key: "enableNotes", defaultValue: false },
    { key: "enableTimestamp", defaultValue: false },
  ]);

  return (
    <>
      <h1 className="sr-only">{t("title")}</h1>
      <PrintPage style={style} className={className}>
        <StudentsListPaper
          header={header}
          studentList={studentList}
          options={form}
        />
        <StudentsPrintOptions
          form={form}
          allowedColumns={columns}
          allowedFilters={filters}
          setForm={setForm}
          formProps={formProps}
        />
      </PrintPage>
    </>
  );
};

export default StudentListPrintout;
