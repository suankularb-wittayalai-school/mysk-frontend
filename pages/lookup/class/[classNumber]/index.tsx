// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassOverview from "@/components/class/ClassOverview";
import PageHeader from "@/components/common/PageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";
import { getCurrentAcademicYear } from "@/utils/helpers/date";

const ClassOverviewPage: CustomPage<{ classItem: Pick<
      Classroom,
      "id" | "number" | "class_advisors" | "contacts" | "subjects"
    > }> = ({
  classItem,
}) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>
          {createTitleStr(
            t("overview.title.lookup", { number: classItem.number }),
            t
          )}
        </title>
      </Head>
      <PageHeader
        title={t("overview.title.lookup", { number: classItem.number })}
        parentURL="/lookup/class"
      >
        <ClassTabs number={classItem.number} type="lookup" />
      </PageHeader>
      <ClassOverview {...{ classroom: classItem }} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const {data, error} = await supabase.from("classrooms").select("id").eq("number", classNumber).eq("year", getCurrentAcademicYear()).single();

  if (error) return { notFound: true };

  const { data: classItem, error: classItemError } = await getClassroomOverview(
    supabase,
    data!.id
  );
  if (classItemError) return { notFound: true };

  // console.log({classItem});

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "class",
      ])),
      classItem,
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

export default ClassOverviewPage;
