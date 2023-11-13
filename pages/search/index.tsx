import PageHeader from "@/components/common/PageHeader";
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
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
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { motion } from "framer-motion";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";

const SearchPage: CustomPage<{
  subjectGroups: SubjectGroup[];
}> = ({ subjectGroups }) => {
  const [view, setView] = useState<"students" | "teachers" | "documents">(
    "students",
  );

  const { duration, easing } = useAnimationConfig();

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <PageHeader>Search</PageHeader>
      <TabsContainer appearance="primary" alt="Searching for…">
        <Tab
          icon={<MaterialIcon icon="face_6" />}
          label="Students"
          selected={view === "students"}
          onClick={() => setView("students")}
        />
        <Tab
          icon={<MaterialIcon icon="support_agent" />}
          label="Teachers"
          selected={view === "teachers"}
          onClick={() => setView("teachers")}
        />
        <Tab
          icon={<MaterialIcon icon="document_scanner" />}
          label="Documents"
          selected={view === "documents"}
          onClick={() => setView("documents")}
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
              students: (
                <SearchFiltersCard onSubmit={() => {}}>
                  TODO: Students
                </SearchFiltersCard>
              ),
              teachers: <TeacherFiltersCard subjectGroups={subjectGroups} />,
              documents: (
                <SearchFiltersCard onSubmit={() => {}}>
                  TODO: Documents
                </SearchFiltersCard>
              ),
            }[view]
          }
        </motion.div>
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

export default SearchPage;
