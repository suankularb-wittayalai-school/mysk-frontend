import { OptionsType } from "@/components/classes/StudentListPrintout";
import StudentListTableBody from "@/components/classes/StudentListTableBody";
import StudentListTableHead from "@/components/classes/StudentListTableHead";
import PaperPreview from "@/components/common/print/PaperPreview";
import cn from "@/utils/helpers/cn";
import { LangCode, StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";

/**
 * A preview of the Student List Printout.
 *
 * @param header A component that displays the header of the printout. Can accept `locale` prop.
 * @param studentList The list of all Students in this Class.
 * @param options Print options.
 */
const StudentsListPaper: StylableFC<{
  header?: StylableFC<{ locale: LangCode }>;
  students: Student[];
  options: OptionsType;
}> = ({ header: PrintoutHeader, students, options, style, className }) => (
  <PaperPreview style={style} className={cn(className, "p-4")}>
    {/* Header */}
    {PrintoutHeader && <PrintoutHeader locale={options.language} />}

    {/* Table */}
    <table
      className={cn(`w-full border-2 border-black [&_td]:whitespace-nowrap
        [&_td]:border-1 [&_td]:border-black [&_td]:px-1 [&_td]:py-0.5
        [&_th]:border-1 [&_th]:border-black [&_th]:px-1 [&_th]:py-0.5`)}
    >
      {/* Head area */}
      <StudentListTableHead
        options={options}
        className="border-b-2 border-black"
      />

      {/* Body area */}
      <StudentListTableBody studentList={students} options={options} />
    </table>

    {/* Timestamp */}
    {options.enableTimestamp && (
      <time className="mt-2 block text-sm opacity-50">
        {new Date().toLocaleString(options.language, {
          dateStyle: "full",
          timeStyle: "medium",
        })}
      </time>
    )}
  </PaperPreview>
);

export default StudentsListPaper;
