// Imports
import MySKPageHeader from "@/components/common/MySKPageHeader";
import Schedule from "@/components/schedule/Schedule";
import { getTeacherByID } from "@/utils/backend/person/getTeacherByID";
import getTeacherSchedule from "@/utils/backend/schedule/getTeacherSchedule";
import { createTitleStr } from "@/utils/helpers/title";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Teacher } from "@/utils/types/person";
import { Schedule as ScheduleType } from "@/utils/types/schedule";
import { ContentLayout } from "@suankularb-components/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { pick } from "radash";

const LookupTeacherSchedulePage: CustomPage<{
  teacher: Pick<Teacher, "id" | "first_name" | "middle_name" | "last_name">;
  schedule: ScheduleType;
}> = ({ teacher, schedule }) => {
  // Translation
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {createTitleStr(
            // t("schedule.title", { number: classItem.number }),
            "TODO",
            tx,
          )}
        </title>
      </Head>
      <MySKPageHeader
        title="TODO"
        parentURL={`/lookup/person?id=${teacher.id}&role=teacher`}
      />
      <ContentLayout>
        <Schedule schedule={schedule} role="teacher" />
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const teacherID = params?.teacherID as string;

  const { data: teacher, error } = await getTeacherByID(supabase, teacherID);
  if (error) return { notFound: true };

  const { data: schedule } = await getTeacherSchedule(supabase, teacher.id);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
        "schedule",
      ])),
      teacher: pick(teacher, ["id", "first_name", "last_name", "middle_name"]),
      schedule,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: teachers, error } = await supabase
    .from("teachers")
    .select("id");

  if (error) return { paths: [], fallback: "blocking" };

  return {
    paths: teachers!.map((teacher) => ({ params: { teacherID: teacher.id } })),
    fallback: "blocking",
  };
};

LookupTeacherSchedulePage.navType = "student";

export default LookupTeacherSchedulePage;
