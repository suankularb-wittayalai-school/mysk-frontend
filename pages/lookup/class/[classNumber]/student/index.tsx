// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassStudents from "@/components/class/ClassStudents";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend
import {
  getAllClassNumbers,
  getClassIDFromNumber,
  getClassStudentList,
} from "@/utils/backend/classroom/classroom";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";

const ClassStudentsPage: CustomPage<{
  classNumber: number;
  studentList: Student[];
}> = ({ classNumber, studentList }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(`M.${classNumber} students`, t)}</title>
      </Head>
      <MySKPageHeader
        title={`M.${classNumber} students`}
        parentURL={`/lookup/class/${classNumber}`}
      >
        <ClassTabs number={classNumber} type="lookup" />
      </MySKPageHeader>
      <ClassStudents {...{ studentList }} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const { data: classID, error: classIDError } = await getClassIDFromNumber(
    supabase,
    classNumber
  );
  if (classIDError) return { notFound: true };

  const { data: studentList } = await getClassStudentList(supabase, classID);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classNumber,
      studentList,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: (await getAllClassNumbers(supabase)).map((number) => ({
      params: { classNumber: number.toString() },
    })),
    fallback: "blocking",
  };
};

export default ClassStudentsPage;
