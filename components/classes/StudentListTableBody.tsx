import {
  MAXIMUM_EMPTY_COLUMNS,
  OptionsType,
} from "@/components/classes/StudentListPrintout";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import { StylableFC } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import { list } from "radash";

/**
 * The body area of the table shown in Student List Printout. Displays the
 * student data based on the given options.
 *
 * Blank cells are filled with non-breaking spaces (`&nbsp;`) to ensure the
 * table structure is maintained.
 *
 * @param studentList The list of Students to display.
 * @param options The options for the printout.
 */
const StudentListTableBody: StylableFC<{
  studentList: Student[];
  options: OptionsType;
}> = ({ studentList, options, style, className }) => (
  <tbody style={style} className={className}>
    {studentList
      .filter(
        (student) =>
          (!options.filters.includes("noElective") ||
            !student.chosen_elective) &&
          (!options.filters.includes("hasAllergies") ||
            student.allergies?.length),
      )
      .map((student) => (
        <tr key={student.id}>
          {/* Class no. */}
          {options.columns.includes("classNo") && (
            <td className="text-center">{student.class_no}</td>
          )}

          {/* Student ID */}
          {options.columns.includes("studentID") && (
            <td className="text-center">{student.student_id}</td>
          )}

          {/* Prefix */}
          {options.columns.includes("prefix") && (
            <td className="w-8 !border-r-0">
              {getLocaleString(student.prefix, options.language)}
            </td>
          )}

          {/* Full name */}
          {options.columns.includes("fullName") && (
            <>
              <td className="w-28 !border-r-0 [&:not(:first-child)]:!border-l-0">
                {getLocaleName(options.language, student, {
                  middleName: options.language === "en-US" ? "abbr" : true,
                  lastName: false,
                })}
              </td>
              <td className="w-36 !border-l-0">
                {getLocaleString(student.last_name, options.language)}
              </td>
            </>
          )}

          {/* Nickname */}
          {options.columns.includes("nickname") && (
            <td>
              {student.nickname &&
                getLocaleString(student.nickname, options.language)}
            </td>
          )}

          {options.columns.includes("allergies") && (
            <td>{student.allergies?.join()}</td>
          )}

          {/* Shirt size */}
          {options.columns.includes("shirtSize") && (
            <td className="text-center">{student.shirt_size}</td>
          )}

          {/* Pants size */}
          {options.columns.includes("pantsSize") && (
            <td className="text-center">
              {student.pants_size?.replace("x", "×")}
            </td>
          )}

          {/* Chosen elective */}
          {options.columns.includes("elective") && (
            <>
              <td className="w-4">{student.chosen_elective?.session_code}</td>
              <td className="w-24">
                {student.chosen_elective
                  ? getLocaleString(
                      student.chosen_elective.name,
                      options.language,
                    )
                  : options.language === "en-US"
                    ? "Not chosen"
                    : "ยังไม่ได้เลือก"}
              </td>
            </>
          )}

          {/* Empty columns */}
          {list(Math.min(options.numEmpty, MAXIMUM_EMPTY_COLUMNS) - 1).map(
            (idx) => (
              <td key={idx} className={idx === 0 ? "!border-l-2" : undefined}>
                {idx === 0 && options.columns.length === 0 ? " " : undefined}
              </td>
            ),
          )}

          {/* Notes */}
          {options.enableNotes && (
            <td>{options.columns.length === 0 ? " " : undefined}</td>
          )}
        </tr>
      ))}
  </tbody>
);

export default StudentListTableBody;
