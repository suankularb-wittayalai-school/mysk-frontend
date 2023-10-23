// Imports
import PaperPreview from "@/components/common/print/PaperPreview";
import PrintOptions from "@/components/common/print/PrintOptions";
import PrintPage from "@/components/common/print/PrintPage";
import cn from "@/utils/helpers/cn";
import getCurrentAcademicYear from "@/utils/helpers/getCurrentAcademicYear";
import getLocaleName from "@/utils/helpers/getLocaleName";
import getLocaleString from "@/utils/helpers/getLocaleString";
import getLocaleYear from "@/utils/helpers/getLocaleYear";
import useForm from "@/utils/helpers/useForm";
import useLocale from "@/utils/helpers/useLocale";
import { Classroom } from "@/utils/types/classroom";
import { FormControlProps, LangCode } from "@/utils/types/common";
import { Student, UserRole } from "@/utils/types/person";
import {
  Checkbox,
  FormGroup,
  FormItem,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { list, toggle } from "radash";
import { FC } from "react";

/**
 * The options type for the Student List Printout.
 */
type OptionsType = {
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
  )[];
  numEmpty: number;
  enableNotes: boolean;
  enableTimestamp: boolean;
};

/**
 * The maximum number of empty columns displayed on the preview.
 */
const maximumEmptyColumns = 20;

/**
 * A preview of the Student List Printout.
 *
 * @param classItem The Class (`ClassWNumber`) to print information of.
 * @param classOverview (`ClassOverview`); used for Class Advisors information.
 * @param studentList The list of all Students in this Class.
 * @param options Print options.
 *
 * @returns A Paper Preview.
 */
const StudentsListPaper: FC<{
  classItem: Pick<Classroom, "id" | "number">;
  classroomOverview: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  studentList: Student[];
  options: OptionsType;
}> = ({ classItem, classroomOverview, studentList, options }) => {
  return (
    <PaperPreview>
      {/* Header */}
      <div className="text-center text-[0.925rem] leading-6">
        <p>
          {options.language === "en-US"
            ? "Suankularb Wittayalai School"
            : "โรงเรียนสวนกุหลาบวิทยาลัย"}
        </p>
        <p>
          {(() => {
            const grade = Math.floor(classItem.number / 100);
            const year = getLocaleYear(
              options.language,
              getCurrentAcademicYear(),
            );
            if (options.language === "en-US")
              return `Mattayomsuksa ${grade} Student List; Academic Year ${year}`;
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
            ? `M.${classItem.number}`
            : `ม.${classItem.number}`}
        </span>
        <span className="mr-4 whitespace-nowrap font-bold">
          {options.language === "en-US" ? "Class advisors" : "ครูที่ปรึกษา"}
        </span>
        <div className="mb-1 flex grow flex-row flex-wrap gap-x-2 font-bold">
          {classroomOverview.class_advisors.map((teacher) => (
            <span key={teacher.id} className="-mb-1">
              {getLocaleName(options.language, teacher, {
                prefix: true,
              })}
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
        <thead className="border-b-2 border-black">
          <tr>
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
                colSpan={
                  options.columns.includes("prefix") &&
                  options.columns.includes("fullName")
                    ? 3
                    : options.columns.includes("fullName")
                    ? 2
                    : 1
                }
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

            {/* Notes */}
            {options.columns.includes("allergies") && (
              <th className="w-32">
                {options.language === "en-US"
                  ? "Allergies"
                  : "ภูมิแพ้/อาหารที่แพ้"}
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

            {/* Empty columns */}
            {list(Math.min(options.numEmpty, maximumEmptyColumns) - 1).map(
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

        {/* Body area */}
        <tbody>
          {studentList.map((student) => (
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

              {/* Empty columns */}
              {list(Math.min(options.numEmpty, maximumEmptyColumns) - 1).map(
                (idx) => (
                  <td
                    key={idx}
                    className={idx === 0 ? "!border-l-2" : undefined}
                  >
                    {idx === 0 && options.columns.length === 0
                      ? " "
                      : undefined}
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
};

/**
 * Options for the Student List Printout.
 *
 * @param form The form control values.
 * @param setForm The form setter.
 * @param formProps The form control props.
 * @param userRole The role of the user visitng the page. Exposes Student ID if the user is a Teacher.
 *
 * @returns A Print Options.
 */
const StudentsPrintOptions: FC<{
  form: OptionsType;
  setForm: (form: OptionsType) => void;
  formProps: FormControlProps<keyof OptionsType>;
  userRole: UserRole;
}> = ({ form, setForm, formProps, userRole }) => {
  const { t } = useTranslation("classes", { keyPrefix: "print" });

  return (
    <PrintOptions parentURL="/classes">
      <section className="flex flex-col gap-6 px-4 pb-5 pt-6">
        <Select
          appearance="outlined"
          label={t("language")}
          {...formProps.language}
        >
          <MenuItem value="en-US">English</MenuItem>
          <MenuItem value="th">ภาษาไทย</MenuItem>
        </Select>
        <FormGroup label={t("columns.label")}>
          {(
            [
              "classNo",
              userRole === "teacher" && "studentID",
              "prefix",
              "fullName",
              "nickname",
              "allergies",
              "shirtSize",
              "pantsSize",
            ].filter((column) => column) as OptionsType["columns"]
          ).map((column) => (
            <FormItem key={column} label={t(`columns.${column}`)}>
              <Checkbox
                value={form.columns.includes(column)}
                onChange={() =>
                  setForm({ ...form, columns: toggle(form.columns, column) })
                }
              />
            </FormItem>
          ))}
        </FormGroup>
        <TextField
          appearance="outlined"
          label={t("numEmpty")}
          inputAttr={{
            type: "number",
            min: 0,
            max: maximumEmptyColumns,
            step: 1,
          }}
          {...formProps.numEmpty}
        />
        <FormItem
          label={t("enableNotes")}
          labelAttr={{ className: "skc-text skc-text--title-medium grow" }}
          className="items-center"
        >
          <Switch
            value={form.enableNotes}
            onChange={(enableNotes) => setForm({ ...form, enableNotes })}
          />
        </FormItem>
        <FormItem
          label={t("enableTimestamp")}
          labelAttr={{ className: "skc-text skc-text--title-medium grow" }}
          className="items-center"
        >
          <Switch
            value={form.enableTimestamp}
            onChange={(enableTimestamp) =>
              setForm({ ...form, enableTimestamp })
            }
          />
        </FormItem>
      </section>
    </PrintOptions>
  );
};

/**
 * The preview page for the Student List Printout.
 *
 * @param classItem The Class (`ClassWNumber`) to print information of.
 * @param classOverview (`ClassOverview`); used for Class Advisors information.
 * @param studentList The list of all Students in this Class.
 * @param userRole The role of the user visitng the page. Exposes Student ID if the user is a Teacher.
 *
 * @returns A Print Page.
 */
const StudentListPrintout: FC<{
  classItem: Pick<Classroom, "id" | "number">;
  classroomOverview: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  studentList: Student[];
  userRole: UserRole;
}> = ({ classItem, classroomOverview, studentList, userRole }) => {
  const locale = useLocale();
  const { t } = useTranslation("class");

  const { form, setForm, formProps } = useForm<
    "language" | "columns" | "numEmpty" | "enableNotes" | "enableTimestamp"
  >([
    { key: "language", defaultValue: locale },
    { key: "columns", defaultValue: ["classNo", "prefix", "fullName"] },
    {
      key: "numEmpty",
      defaultValue: "10",
      validate: (value) => list(maximumEmptyColumns).includes(Number(value)),
    },
    { key: "enableNotes", defaultValue: false },
    { key: "enableTimestamp", defaultValue: false },
  ]);

  return (
    <>
      <h1 className="sr-only">{t("title")}</h1>
      <PrintPage>
        <StudentsListPaper
          {...{ classItem, classroomOverview, studentList }}
          options={form}
        />
        <StudentsPrintOptions
          {...{ form, setForm, formProps, classItem, userRole }}
        />
      </PrintPage>
    </>
  );
};

export default StudentListPrintout;
