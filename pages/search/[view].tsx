import PageHeader from "@/components/common/PageHeader";
import DocumentFiltersCard from "@/components/lookup/document/DocumentFiltersCard";
import StudentsFiltersCard from "@/components/lookup/students/StudentFiltersCard";
import TeacherFiltersCard from "@/components/lookup/teachers/TeacherFiltersCard";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import {
  ContentLayout,
  DURATION,
  EASING,
  MaterialIcon,
  Tab,
  TabsContainer,
  transition,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

enum SearchPageView {
  students = "students",
  teachers = "teachers",
  documents = "documents",
}

const SEARCH_PAGE_VIEWS: SearchPageView[] = [
  SearchPageView.students,
  SearchPageView.teachers,
  SearchPageView.documents,
];

const SearchPage: CustomPage<{
  view: SearchPageView;
  subjectGroups: SubjectGroup[];
}> = ({ view: initialView, subjectGroups }) => {
  const { t } = useTranslation("search/landing");

  const router = useRouter();

  const [view, setView] = useState<SearchPageView>(initialView);

  function changeView(view: SearchPageView) {
    setView(view);
    router.push(`/search/${view}`, undefined, { shallow: true });
  }

  return (
    <>
      <Head>
        <title>{t("common:tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <TabsContainer appearance="primary" alt={t("view.alt")}>
        <Tab
          icon={<MaterialIcon icon="face_6" />}
          label={t("view.students")}
          selected={view === "students"}
          onClick={() => changeView(SearchPageView.students)}
        />
        <Tab
          icon={<MaterialIcon icon="support_agent" />}
          label={t("view.teachers")}
          selected={view === "teachers"}
          onClick={() => changeView(SearchPageView.teachers)}
        />
        <Tab
          icon={<MaterialIcon icon="document_scanner" />}
          label={t("view.documents")}
          selected={view === "documents"}
          onClick={() => changeView(SearchPageView.documents)}
        />
      </TabsContainer>
      <ContentLayout>
        <motion.div
          key={view}
          layoutRoot
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition(DURATION.long4, EASING.standardDecelerate)}
        >
          {
            {
              students: <StudentsFiltersCard />,
              teachers: <TeacherFiltersCard subjectGroups={subjectGroups} />,
              documents: <DocumentFiltersCard />,
            }[view]
          }
        </motion.div>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const view = params?.view;
  const { data: subjectGroups } = await getSubjectGroups(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "lookup",
      ])),
      view,
      subjectGroups,
    },
    revalidate: 3600,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: SEARCH_PAGE_VIEWS.map((view) => [
    { params: { view }, locale: "th" },
    { params: { view }, locale: "en-US" },
  ]).flat(),
  fallback: false,
});

export default SearchPage;
