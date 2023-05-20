// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassTeachers from "@/components/class/ClassTeachers";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend
import {
  getAllClassNumbers,
  getClassIDFromNumber,
  getClassTeachersList,
} from "@/utils/backend/classroom/classroom";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { ClassTeachersListSection } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";

const ClassTeachersPage: CustomPage<{
  classNumber: number;
  teacherList: ClassTeachersListSection[];
}> = ({ classNumber, teacherList }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(
            t("teacher.title.lookup", { number: classNumber }),
            t
          )}
        </title>
      </Head>
      <MySKPageHeader
        title={t("teacher.title.lookup", { number: classNumber })}
        parentURL={`/lookup/class/${classNumber}`}
      >
        <ClassTabs number={classNumber} type="lookup" />
      </MySKPageHeader>
      <ClassTeachers {...{ teacherList, classNumber }} />
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

  const { data: teacherList } = await getClassTeachersList(supabase, classID);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
        "lookup",
      ])),
      classNumber,
      teacherList,
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

export default ClassTeachersPage;
