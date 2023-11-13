import PageHeader from "@/components/common/PageHeader";
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import StudentsFiltersCard from "@/components/lookup/students/StudentFiltersCard";
import TeacherFiltersCard from "@/components/lookup/teachers/TeacherFiltersCard";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import { supabase } from "@/utils/supabase-backend";
import { CustomPage, LangCode } from "@/utils/types/common";
import { SubjectGroup } from "@/utils/types/subject";
import {
  ContentLayout,
  MaterialIcon,
  Tab,
  TabsContainer,
  Text,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type SearchPageView = "students" | "teachers" | "documents";

const SEARCH_PAGE_VIEWS: SearchPageView[] = [
  "students",
  "teachers",
  "documents",
];

const SearchPage: CustomPage<{
  view: SearchPageView;
  subjectGroups: SubjectGroup[];
}> = ({ view: initialView, subjectGroups }) => {
  const { t } = useTranslation("lookup");
  const { t: tx } = useTranslation("common");

  const router = useRouter();

  const [view, setView] = useState<"students" | "teachers" | "documents">(
    initialView,
  );

  const { duration, easing } = useAnimationConfig();

  function changeView(view: SearchPageView) {
    setView(view);
    router.push(`/search/${view}`, undefined, { shallow: true });
  }

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Search" })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <TabsContainer appearance="primary" alt="Searching for…">
        <Tab
          icon={<MaterialIcon icon="face_6" />}
          label={t("view.students")}
          selected={view === "students"}
          onClick={() => changeView("students")}
        />
        <Tab
          icon={<MaterialIcon icon="support_agent" />}
          label={t("view.teachers")}
          selected={view === "teachers"}
          onClick={() => changeView("teachers")}
        />
        <Tab
          icon={<MaterialIcon icon="document_scanner" />}
          label={t("view.documents")}
          selected={view === "documents"}
          // onClick={() => changeView("documents")}
          onClick={() => setView("documents")}
          href="/search/documents"
          element={Link}
        />
      </TabsContainer>
      <ContentLayout>
        <motion.div
          key={view}
          layoutRoot
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition(duration.long4, easing.standardDecelerate)}
        >
          {
            {
              students: <StudentsFiltersCard />,
              teachers: <TeacherFiltersCard subjectGroups={subjectGroups} />,
              documents: (
                <SearchFiltersCard
                  icon={<MaterialIcon icon="document_scanner" />}
                  title="Search documents"
                  onSubmit={() => {}}
                >
                  <Text
                    type="body-medium"
                    className="sm:col-span-2 md:col-span-4"
                  >
                    TODO: Documents filters aren’t implemented yet. Redirecting
                    you to the Search Documents page…
                  </Text>
                </SearchFiltersCard>
              ),
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
