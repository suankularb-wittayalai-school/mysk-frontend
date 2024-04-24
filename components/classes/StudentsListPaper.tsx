import { OptionsType } from "@/components/classes/StudentListPrintout";
import StudentListTableBody from "@/components/classes/StudentListTableBody";
import StudentListTableHead from "@/components/classes/StudentListTableHead";
import PaperPreview from "@/components/common/print/PaperPreview";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import { Classroom } from "@/utils/types/classroom";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";

/**
 * A preview of the Student List Printout.
 *
 * @param classroom The Classroom to display the Student List for.
 * @param studentList The list of all Students in this Class.
 * @param options Print options.
 */
const StudentsListPaper: StylableFC<{
  classroom: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  studentList: Student[];
  options: OptionsType;
}> = ({ classroom, studentList, options, style, className }) => (
  <PaperPreview style={style} className={cn(className, "p-4")}>
    {/* Header */}
    <div className="text-center text-[0.925rem] leading-6">
      <p>
        {options.language === "en-US"
          ? "Suankularb Wittayalai School"
          : "โรงเรียนสวนกุหลาบวิทยาลัย"}
      </p>
      <p>
        {(() => {
          const grade = Math.floor(classroom.number / 100);
          const year = getLocaleYear(
            options.language,
            getCurrentAcademicYear(),
          );
          if (options.language === "en-US")
            return `Mattayomsuksa ${grade} Student List for Academic Year ${year}`;
          return `รายชื่อนักเรียนชั้นมัธยมศึกษาปีที่ ${grade} ปีการศึกษา ${year}`;
        })()}
      </p>
    </div>

    {/* Class number and Advisors */}
    <div className="flex flex-row">
      <span
        className={cn(`-mt-2 ml-4 mr-14 inline-block self-end
            whitespace-nowrap text-xl font-medium`)}
      >
        {options.language === "en-US"
          ? `M.${classroom.number}`
          : `ม.${classroom.number}`}
      </span>
      <span className="mr-4 whitespace-nowrap font-bold">
        {options.language === "en-US" ? "Class advisors" : "ครูที่ปรึกษา"}
      </span>
      <div className="mb-1 flex grow flex-row flex-wrap gap-x-2 font-bold">
        {classroom.class_advisors.map((teacher) => (
          <span key={teacher.id} className="-mb-1">
            {getLocaleName(options.language, teacher, { prefix: true })}
          </span>
        ))}
      </div>
    </div>

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
      <StudentListTableBody studentList={studentList} options={options} />
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
