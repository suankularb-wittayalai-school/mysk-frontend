// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC } from "react";

// SK Components
import {
  Checkbox,
  FormGroup,
  FormItem,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@suankularb-components/react";

// Internal components
import PaperPreview from "@/components/common/print/PaperPreview";
import PrintOptions from "@/components/common/print/PrintOptions";
import PrintPage from "@/components/common/print/PrintPage";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import {
  getClassFromUser,
  getClassOverview,
  getClassStudentList,
} from "@/utils/backend/classroom/classroom";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Helpers
import { range, toggleItem } from "@/utils/helpers/array";
import { getCurrentAcademicYear, getLocaleYear } from "@/utils/helpers/date";
import { getLocaleObj, getLocaleString } from "@/utils/helpers/i18n";
import { nameJoiner } from "@/utils/helpers/name";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { ClassOverview, ClassWNumber } from "@/utils/types/class";
import { CustomPage, FormControlProps, LangCode } from "@/utils/types/common";
import { Role, Student } from "@/utils/types/person";

type OptionsType = {
  language: LangCode;
  columns: ("classNo" | "studentID" | "prefix" | "fullName")[];
  numEmpty: number;
  enableNotes: boolean;
  enableTimestamp: boolean;
};

const StudentsListPaper: FC<{
  classItem: ClassWNumber;
  classOverview: ClassOverview;
  studentList: Student[];
  options: OptionsType;
}> = ({ classItem, classOverview, studentList, options }) => {
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
              getCurrentAcademicYear()
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
          className="-mt-2 ml-4 mr-14 inline-block self-end whitespace-nowrap
            text-xl font-medium"
        >
          {options.language === "en-US"
            ? `M.${classItem.number}`
            : `ม.${classItem.number}`}
        </span>
        <span className="mr-4 whitespace-nowrap font-bold">
          {options.language === "en-US" ? "Class advisors" : "ครูที่ปรึกษา"}
        </span>
        <div className="mb-1 flex grow flex-row flex-wrap gap-x-2">
          {classOverview.classAdvisors.map((teacher) => (
            <span key={teacher.id} className="-mb-1 font-medium">
              {nameJoiner(options.language, teacher.name, teacher.prefix, {
                prefix: true,
              })}
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <table
        className="w-full border-2 border-black [&_td]:border-1
            [&_td]:border-black [&_td]:px-1 [&_td]:py-0.5 [&_th]:border-1
            [&_th]:border-black [&_th]:px-1 [&_th]:py-0.5"
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

            {/* Empty columns */}
            {range(options.numEmpty).map((idx) => (
              <th key={idx} className={idx === 0 ? "!border-l-2" : undefined}>
                &nbsp;
              </th>
            ))}

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
                <td className="text-center">{student.classNo}</td>
              )}

              {/* Student ID */}
              {options.columns.includes("studentID") && (
                <td className="text-center">{student.studentID}</td>
              )}

              {/* Prefix */}
              {options.columns.includes("prefix") && (
                <td className="w-12 !border-r-0">
                  {getLocaleString(student.prefix, options.language)}
                </td>
              )}

              {/* Full name */}
              {options.columns.includes("fullName") && (
                <>
                  <td className="w-28 !border-r-0 [&:not(:first-child)]:!border-l-0">
                    {nameJoiner(options.language, student.name, undefined, {
                      middleName: options.language === "en-US" ? "abbr" : true,
                      lastName: false,
                    })}
                  </td>
                  <td className="w-36 !border-l-0">
                    {getLocaleObj(student.name, options.language).lastName}
                  </td>
                </>
              )}

              {/* Empty columns */}
              {range(options.numEmpty).map((idx) => (
                <td key={idx} className={idx === 0 ? "!border-l-2" : undefined}>
                  &nbsp;
                </td>
              ))}

              {/* Notes */}
              {options.enableNotes && <td>&nbsp;</td>}
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

const StudentsPrintOptions: FC<{
  form: OptionsType;
  setForm: (form: OptionsType) => void;
  formProps: FormControlProps<keyof OptionsType>;
  userRole: Role;
}> = ({ form, setForm, formProps, userRole }) => {
  const { t } = useTranslation("class");

  return (
    <PrintOptions>
      <section className="flex flex-col gap-6 px-4 pb-5 pt-6">
        <Select appearance="outlined" label="Language" {...formProps.language}>
          <MenuItem value="en-US">English</MenuItem>
          <MenuItem value="th">ภาษาไทย</MenuItem>
        </Select>
        <FormGroup label="Information to show">
          <FormItem label="Class №">
            <Checkbox
              value={form.columns.includes("classNo")}
              onChange={() =>
                setForm({
                  ...form,
                  columns: toggleItem("classNo", form.columns),
                })
              }
            />
          </FormItem>
          {userRole === "teacher" && (
            <FormItem label="Student ID">
              <Checkbox
                value={form.columns.includes("studentID")}
                onChange={() =>
                  setForm({
                    ...form,
                    columns: toggleItem("studentID", form.columns),
                  })
                }
              />
            </FormItem>
          )}
          <FormItem label="Prefix">
            <Checkbox
              value={form.columns.includes("prefix")}
              onChange={() =>
                setForm({
                  ...form,
                  columns: toggleItem("prefix", form.columns),
                })
              }
            />
          </FormItem>
          <FormItem label="Full name">
            <Checkbox
              value={form.columns.includes("fullName")}
              onChange={() =>
                setForm({
                  ...form,
                  columns: toggleItem("fullName", form.columns),
                })
              }
            />
          </FormItem>
        </FormGroup>
        <TextField
          appearance="outlined"
          label="Empty columns"
          inputAttr={{ type: "number", min: 0, max: 15, step: 1 }}
          {...formProps.numEmpty}
        />
        <FormItem
          label="Notes column"
          labelAttr={{ className: "grow skc-title-medium" }}
          className="items-center"
        >
          <Switch
            value={form.enableNotes}
            onChange={(enableNotes) => setForm({ ...form, enableNotes })}
          />
        </FormItem>
        <FormItem
          label="Timestamp"
          labelAttr={{ className: "grow skc-title-medium" }}
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

const StudentsListPrintPage: CustomPage<{
  classItem: ClassWNumber;
  classOverview: ClassOverview;
  studentList: Student[];
  userRole: Role;
}> = ({ classItem, classOverview, studentList, userRole }) => {
  const locale = useLocale();
  const { t } = useTranslation(["class", "common"]);

  const { form, setForm, formProps } = useForm<
    "language" | "columns" | "numEmpty" | "enableNotes" | "enableTimestamp"
  >([
    { key: "language", defaultValue: locale },
    { key: "columns", defaultValue: ["classNo", "prefix", "fullName"] },
    {
      key: "numEmpty",
      defaultValue: "10",
      validate: (value) => range(16).includes(Number(value)),
    },
    { key: "enableNotes", defaultValue: false },
    { key: "enableTimestamp", defaultValue: false },
  ]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Print student list", t)}</title>
      </Head>
      <h1 className="sr-only">Print student list</h1>
      <PrintPage>
        <StudentsListPaper
          {...{ classItem, classOverview, studentList }}
          options={form}
        />
        <StudentsPrintOptions {...{ form, setForm, formProps, userRole }} />
      </PrintPage>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);

  const userRole = metadata!.role;

  let classItem: ClassWNumber;
  if (userRole === "student") {
    const { data } = await getClassFromUser(supabase, session!.user);
    classItem = data!;
  } else if (userRole === "teacher") {
    const { data } = await getClassAdvisorAt(supabase, metadata!.teacher!);
    classItem = data!;
  }

  const { data: classOverview } = await getClassOverview(
    supabase,
    classItem!.number
  );

  const { data: studentList } = await getClassStudentList(
    supabase,
    classItem!.id
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classItem: classItem!,
      classOverview,
      studentList,
      userRole,
    },
  };
};

export default StudentsListPrintPage;
