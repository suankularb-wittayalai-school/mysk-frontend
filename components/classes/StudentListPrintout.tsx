import StudentsListPaper from "@/components/classes/StudentsListPaper";
import StudentsPrintOptions from "@/components/classes/StudentsPrintOptions";
import PrintPagesFeed from "@/components/common/print/PrintPagesFeed";
import PrintPreviewLayout from "@/components/common/print/PrintPreviewLayout";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { LangCode, StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
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
    | "classroom"
    | "allergies"
    | "healthProblem"
    | "shirtSize"
    | "pantsSize"
    | "elective"
    | "randomized"
  )[];
  filters: ("noElective" | "hasAllergies" | "hasHealthProblem")[];
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
 * @param data An array of objects containing the header and the list of Students. Each item represents a page.
 * @param columns The columns the user can choose to display.
 * @param filters The filters the user can choose to apply.
 * @param parentURL The URL of the parent page.
 */
const StudentListPrintout: StylableFC<{
  data: { header: StylableFC<{ locale: LangCode }>; students: Student[] }[];
  columns: OptionsType["columns"];
  filters: OptionsType["filters"];
  parentURL: string;
}> = ({ data, columns, filters, parentURL, style, className }) => {
  const locale = useLocale();

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
        [
          "index",
          "classNo",
          "prefix",
          "fullName",
          "randomized",
        ] as OptionsType["columns"]
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
    <PrintPreviewLayout style={style} className={className}>
      <PrintPagesFeed>
        {data.map(({ header, students }, index) => (
          <StudentsListPaper
            key={index}
            header={header}
            students={students}
            options={form}
          />
        ))}
      </PrintPagesFeed>
      <StudentsPrintOptions
        form={form}
        allowedColumns={columns}
        allowedFilters={filters}
        parentURL={parentURL}
        setForm={setForm}
        formProps={formProps}
      />
    </PrintPreviewLayout>
  );
};

export default StudentListPrintout;
