import {
  MAXIMUM_EMPTY_COLUMNS,
  OptionsType,
} from "@/components/classes/StudentListPrintout";
import { StylableFC } from "@/utils/types/common";
import { list } from "radash";

/**
 * The head area of the table shown in Student List Printout. Displays the
 * column headers based on the given options.
 *
 * @param options The options for the printout.
 *
 * @note Not to be confused with the header area of the printout itself.
 */
const StudentListTableHead: StylableFC<{
  options: OptionsType;
}> = ({ options, style, className }) => (
  <thead style={style} className={className}>
    <tr>
      {/* Index */}
      {options.columns.includes("index") && (
        <th className="w-12">{options.language === "en-US" ? "№" : "ลำดับ"}</th>
      )}

      {/* Class no. */}
      {options.columns.includes("classNo") && (
        <th className="w-12">
          {options.language === "en-US" ? "№" : "เลขที่"}
        </th>
      )}

      {/* Student ID */}
      {options.columns.includes("studentID") && (
        <th className="w-24">
          {options.language === "en-US" ? "Student ID" : "เลขประจำตัว"}
        </th>
      )}

      {/* Full name */}
      {(options.columns.includes("prefix") ||
        options.columns.includes("fullName")) && (
        <th
          colSpan={(() => {
            let colSpan = 0;
            // Prefix takes up one column.
            if (options.columns.includes("prefix")) colSpan += 1;
            // Full name takes up two columns.
            if (options.columns.includes("fullName")) colSpan += 2;
            return colSpan;
          })()}
        >
          {options.language === "en-US" ? "Full name" : "ชื่อ - นามสกุล"}
        </th>
      )}

      {/* Nickname */}
      {options.columns.includes("nickname") && (
        <th className="w-20">
          {options.language === "en-US" ? "Nickname" : "ชื่อเล่น"}
        </th>
      )}

      {/* Class no. */}
      {options.columns.includes("classroom") && (
        <th colSpan={2} className="w-16">
          {options.language === "en-US" ? "Class" : "ห้องเรียน"}
        </th>
      )}

      {/* Notes */}
      {options.columns.includes("allergies") && (
        <th className="w-32">
          {options.language === "en-US" ? "Allergies" : "ภูมิแพ้/อาหารที่แพ้"}
        </th>
      )}

      {/* Shirt size */}
      {options.columns.includes("shirtSize") && (
        <th className="w-12">
          {options.language === "en-US" ? "Shirt" : "เสื้อ"}
        </th>
      )}

      {/* Pants size */}
      {options.columns.includes("pantsSize") && (
        <th className="w-12">
          {options.language === "en-US" ? "Pants" : "กางเกง"}
        </th>
      )}

      {/* Elective */}
      {options.columns.includes("elective") && (
        <th colSpan={3}>
          {options.language === "en-US" ? "Chosen elective" : "วิชาเลือก"}
        </th>
      )}

      {/* Empty columns */}
      {list(Math.min(options.numEmpty, MAXIMUM_EMPTY_COLUMNS) - 1).map(
        (idx) => (
          <th key={idx} className={idx === 0 ? "!border-l-2" : undefined}>
            {idx === 0 && options.columns.length === 0 ? " " : undefined}
          </th>
        ),
      )}

      {/* Notes */}
      {options.enableNotes && (
        <th className="w-32">
          {options.language === "en-US" ? "Notes" : "หมายเหตุ"}
        </th>
      )}
    </tr>
  </thead>
);

export default StudentListTableHead;
