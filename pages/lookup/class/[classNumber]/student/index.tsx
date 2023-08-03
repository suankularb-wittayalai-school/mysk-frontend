// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassStudents from "@/components/class/ClassStudents";
import PageHeader from "@/components/common/PageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student } from "@/utils/types/person";
import getStudentsOfClass from "@/utils/backend/classroom/getStudentsOfClass";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

const ClassStudentsPage: CustomPage<{
  classNumber: number;
  studentList: Student[];
}> = ({ classNumber, studentList }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(
            t("student.title.lookup", { number: classNumber }),
            t
          )}
        </title>
      </Head>
      <PageHeader
        title={t("student.title.lookup", { number: classNumber })}
        parentURL={`/lookup/class/${classNumber}`}
      >
        <ClassTabs number={classNumber} type="lookup" />
      </PageHeader>
      <ClassStudents {...{ studentList }} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const {data, error} = await supabase.from("classrooms").select("id").eq("number", classNumber).eq("year", getCurrentAcademicYear()).single();

  if (error) return { notFound: true };

  const classID = data?.id;

  const { data: studentList } = await getStudentsOfClass(supabase, classID);

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
  const { data: classNumbers, error } = await supabase.from("classrooms").select("number").eq("year", getCurrentAcademicYear());
  
  if (error) return { paths: [], fallback: "blocking" };

  return {
    paths: classNumbers!.map((classroom) => ({
      params: { classNumber: classroom.number.toString() },
    })),
    fallback: "blocking",
  };
};

export default ClassStudentsPage;
