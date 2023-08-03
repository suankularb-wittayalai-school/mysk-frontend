// Imports
import ClassOverview from "@/components/class/ClassOverview";
import PageHeader from "@/components/common/PageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";
import { getCurrentAcademicYear } from "@/utils/helpers/date";
import { createTitleStr } from "@/utils/helpers/title";
import { supabase } from "@/utils/supabase-backend";
import { Classroom } from "@/utils/types/classroom";
import { CustomPage, LangCode } from "@/utils/types/common";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * Displays an overview of a Class via the Class Overview component.
 *
 * @param classroom The overview information (Advisors and Contacts) of the Class to display.
 *
 * @returns A Page.
 */
const ClassOverviewPage: CustomPage<{
  classroom: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
}> = ({ classroom }) => {
  const { t } = useTranslation("class", { keyPrefix: "overview" });
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(t("title.lookup", { number: classroom.number }), tx)}
        </title>
      </Head>
      <PageHeader
        title={t("title.lookup", { number: classroom.number })}
        parentURL="/lookup/class"
      >
        <ClassTabs number={classroom.number} type="lookup" />
      </PageHeader>
      <ClassOverview {...{ classroom: classroom }} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const { data, error } = await supabase
    .from("classrooms")
    .select("id")
    .eq("number", classNumber)
    .eq("year", getCurrentAcademicYear())
    .single();

  if (error) return { notFound: true };

  const { data: classroom, error: classroomError } = await getClassroomOverview(
    supabase,
    data!.id,
  );
  if (classroomError) return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "class",
      ])),
      classroom,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default ClassOverviewPage;
