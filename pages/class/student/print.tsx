// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { FC } from "react";

// SK Components
import {
  Actions,
  Button,
  Checkbox,
  Columns,
  ContentLayout,
  FormGroup,
  FormItem,
  MaterialIcon,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@suankularb-components/react";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import {
  getClassFromUser,
  getClassStudentList,
} from "@/utils/backend/classroom/classroom";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Helpers
import { range, toggleItem } from "@/utils/helpers/array";
import {
  getCurrentAcademicYear,
  getCurrentSemester,
  getLocaleYear,
} from "@/utils/helpers/date";
import { createTitleStr } from "@/utils/helpers/title";

// Hooks
import { useForm } from "@/utils/hooks/form";
import { useLocale } from "@/utils/hooks/i18n";

// Types
import { getLocaleObj, getLocaleString } from "@/utils/helpers/i18n";
import { ClassWNumber } from "@/utils/types/class";
import { CustomPage, FormControlProps, LangCode } from "@/utils/types/common";
import { Role, Student } from "@/utils/types/person";
import { nameJoiner } from "@/utils/helpers/name";

type OptionsType = {
  language: LangCode;
  columns: ("classNo" | "studentID" | "prefix" | "fullName")[];
  numEmpty: number;
  enableNotes: boolean;
  enableTimestamp: boolean;
};

const StudentsListPaper: FC<{
  classItem: ClassWNumber;
  studentList: Student[];
  options: OptionsType;
}> = ({ classItem, studentList, options }) => {
  return (
    <article
      className="print aspect-[1/1.4142] min-w-[42rem] bg-white p-8
        text-black shadow-3 print:!block print:w-full print:min-w-0 print:p-0
        print:shadow-none md:col-span-2"
    >
      {/* Header */}
      <h1 className="mb-4 text-center text-lg font-bold">
        {options.language === "en-US"
          ? "Suankularb Wittayalai School"
          : "โรงเรียนสวนกุหลาบวิทยาลัย"}
        <br />
        {(() => {
          const number = classItem.number;
          const semester = getCurrentSemester();
          const year = getLocaleYear("th", getCurrentAcademicYear());
          if (options.language === "en-US")
            return `M.${number} student list of semester ${semester}/${year}`;
          return `รายชื่อนักเรียนห้อง ม.${number} ภาคเรียนที่ ${semester} ปีการศึกษา ${year}`;
        })()}
      </h1>

      {/* Table */}
      <table
        className="w-full [&_td]:border-1 [&_td]:border-black [&_td]:px-1
          [&_td]:py-0.5 [&_th]:border-1 [&_th]:border-black [&_th]:px-1
          [&_th]:py-0.5"
      >
        {/* Head area */}
        <thead>
          <tr>
            {/* Class no. */}
            {options.columns.includes("classNo") && (
              <th className="w-12">
                {options.language === "en-US" ? "№" : "เลขที่"}
              </th>
            )}

            {/* Student ID */}
            {options.columns.includes("studentID") && (
              <th className="w-24">เลขประจำตัว</th>
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
                {options.language === "en-US" ? "Full name" : "ชื่อ-สกุล"}
              </th>
            )}

            {/* Empty columns */}
            {range(options.numEmpty).map((idx) => (
              <th key={idx} className="w-8" />
            ))}

            {/* Notes */}
            {options.enableNotes && (
              <th className="min-w-32">
                {options.language === "en-US" ? "Notes" : "หมายเหตุ"}
              </th>
            )}
          </tr>
        </thead>

        {/* Body area */}
        <tbody>
          {studentList.map((student) => (
            <tr key={student.id} className="[&>td]:h-[1.625rem]">
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
                      middleName: "abbr",
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
                <td key={idx} />
              ))}

              {/* Notes */}
              {options.enableNotes && <td></td>}
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
    </article>
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
    <aside
      className="sticky top-12 divide-y-1 divide-outline rounded-xl bg-surface
        shadow-3 print:hidden lg:top-8 lg:shadow-none"
    >
      <header className="flex flex-row items-center gap-2 py-2 pl-2 pr-4">
        <Button
          appearance="text"
          icon={<MaterialIcon icon="arrow_backward" />}
          alt="Navigate up"
          href="/class/student"
          element={Link}
          className="!text-on-surface state-layer:!bg-on-surface"
        />
        <h2 className="skc-title-large">Print options</h2>
      </header>
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
          inputAttr={{ type: "number" }}
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
      <Actions className="px-4 py-3.5">
        <Button
          appearance="filled"
          icon={<MaterialIcon icon="print" />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </Actions>
    </aside>
  );
};

const StudentsListPrintPage: CustomPage<{
  classItem: ClassWNumber;
  studentList: Student[];
  userRole: Role;
}> = ({ classItem, studentList, userRole }) => {
  const locale = useLocale();
  const { t } = useTranslation(["class", "common"]);

  const { form, setForm, formProps } = useForm<
    "language" | "columns" | "numEmpty" | "enableNotes" | "enableTimestamp"
  >([
    { key: "language", defaultValue: locale },
    { key: "columns", defaultValue: ["classNo", "prefix", "fullName"] },
    { key: "numEmpty", defaultValue: "6" },
    { key: "enableNotes", defaultValue: false },
    { key: "enableTimestamp", defaultValue: false },
  ]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Print student list", t)}</title>
      </Head>
      <h1 className="sr-only">Print student list</h1>
      <ContentLayout
        className="min-h-screen bg-surface-2
          supports-[height:100dvh]:min-h-[100dvh] print:-mb-20 print:!py-0"
      >
        <Columns columns={3}>
          <StudentsListPaper {...{ classItem, studentList }} options={form} />
          <StudentsPrintOptions {...{ form, setForm, formProps, userRole }} />
        </Columns>
      </ContentLayout>
      <style jsx global>{`
        .skc-nav-bar {
          background-color: var(--surface-2) !important;
        }
      `}</style>
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
      studentList,
      userRole,
    },
  };
};

export default StudentsListPrintPage;
