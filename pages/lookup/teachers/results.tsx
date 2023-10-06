// Imports
import PageHeader from "@/components/common/PageHeader";
import ActiveSearchFiltersCard from "@/components/lookup/ActiveSearchFiltersCard";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import { supabase } from "@/utils/supabase-backend";
import { LangCode } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import { SplitLayout } from "@suankularb-components/react";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { camel } from "radash";

export type SearchFilters = Partial<{
  fullName: string;
  nickname: string;
  subjectGroup: number | "any";
  classroom: string;
  contact: string;
}>;

const LookupTeachersResultsPage: NextPage<{
  subjectGroups: SubjectGroup[];
}> = ({ subjectGroups }) => {
  // Translation
  const { t } = useTranslation("lookup", { keyPrefix: "teachers" });
  const { t: tx } = useTranslation("common");

  const router = useRouter();
  const filters = Object.fromEntries(
    Object.entries(router.query)
      .filter(([key]) =>
        [
          "full_name",
          "nickname",
          "subject_group",
          "classroom",
          "contact",
        ].includes(key),
      )
      .map(([key, value]) => [
        camel(key),
        key === "subject_group" && value !== "any" ? Number(value) : value,
      ]),
  ) as SearchFilters;

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader parentURL="/lookup/teachers">{t("title")}</PageHeader>
      <SplitLayout
        ratio="list-detail"
        className="sm:[&>div]:!grid-cols-2 md:[&>div]:!grid-cols-3"
      >
        <section className="!overflow-visible">
          {Object.keys(filters).length > 0 && (
            <ActiveSearchFiltersCard
              filters={filters}
              subjectGroups={subjectGroups}
            />
          )}
        </section>
        <main className="md:!col-span-2">
          <div className="h-full rounded-md bg-surface-1"></div>
        </main>
      </SplitLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const { data: subjectGroups } = await getSubjectGroups(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      subjectGroups,
    },
  };
};

export default LookupTeachersResultsPage;
