import PageHeader from "@/components/common/PageHeader";
import SearchFiltersCard from "@/components/lookup/SearchFiltersCard";
import { CustomPage, LangCode } from "@/utils/types/common";
import {
  ContentLayout,
  MaterialIcon,
  Tab,
  TabsContainer,
  transition,
  useAnimationConfig,
} from "@suankularb-components/react";
import { AnimatePresence, motion } from "framer-motion";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";

const SearchPage: CustomPage = () => {
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
          <SearchFiltersCard onSubmit={() => {}}>TODO</SearchFiltersCard>
        </motion.div>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: await serverSideTranslations(locale as LangCode, ["common", "search"]),
});

export default SearchPage;
