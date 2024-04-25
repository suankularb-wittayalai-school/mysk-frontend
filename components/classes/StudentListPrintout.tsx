import StudentsListPaper from "@/components/classes/StudentsListPaper";
import StudentsPrintOptions from "@/components/classes/StudentsPrintOptions";
import PrintPage from "@/components/common/print/PrintPage";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
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
 * @param studentList The list of all Students in this Class.
 */
const StudentListPrintout: StylableFC<{
  classroom: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  studentList: Student[];
}> = ({ classroom, studentList }) => {
  const locale = useLocale();
  const { t } = useTranslation("classes", { keyPrefix: "print" });

  // Form control for the options.
  // Placed in the parent component as this state is shared between the Paper
  // and Options.
  const { form, setForm, formProps } = useForm<
    "language" | "columns" | "numEmpty" | "enableNotes" | "enableTimestamp"
  >([
    { key: "language", defaultValue: locale },
    { key: "columns", defaultValue: ["classNo", "prefix", "fullName"] },
    {
      key: "numEmpty",
      defaultValue: "10",
      // Integer under MAXIMUM_EMPTY_COLUMNS.
      validate: (value) => list(MAXIMUM_EMPTY_COLUMNS).includes(Number(value)),
    },
    { key: "enableNotes", defaultValue: false },
    { key: "enableTimestamp", defaultValue: false },
  ]);

  return (
    <>
      <h1 className="sr-only">{t("title")}</h1>
      <PrintPage>
        <StudentsListPaper
          classroom={classroom}
          studentList={studentList}
          options={form}
        />
        <StudentsPrintOptions
          form={form}
          setForm={setForm}
          formProps={formProps}
        />
      </PrintPage>
    </>
  );
};

export default StudentListPrintout;
