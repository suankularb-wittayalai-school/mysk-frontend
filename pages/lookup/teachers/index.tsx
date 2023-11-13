// Imports
import PageHeader from "@/components/common/PageHeader";
import TeacherFiltersCard from "@/components/lookup/teachers/TeacherFiltersCard";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import { supabase } from "@/utils/supabase-backend";
import { LangCode } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import { ContentLayout } from "@suankularb-components/react";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const LookupTeachersPage: NextPage<{
  subjectGroups: SubjectGroup[];
}> = ({ subjectGroups }) => {
  const { t } = useTranslation("lookup", { keyPrefix: "teachers" });
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/lookup">{t("title")}</PageHeader>
      <ContentLayout>
        <TeacherFiltersCard subjectGroups={subjectGroups} />
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { data: subjectGroups } = await getSubjectGroups(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      subjectGroups,
    },
    revalidate: 3600,
  };
};

export default LookupTeachersPage;
