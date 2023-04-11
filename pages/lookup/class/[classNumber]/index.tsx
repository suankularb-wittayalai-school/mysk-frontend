// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// SK Components
import { ContentLayout } from "@suankularb-components/react";

// Internal components
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend
import { getAllClassNumbers } from "@/utils/backend/classroom/classroom";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { ClassOverview } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";

const ClassOverviewPage: CustomPage<{ classItem: ClassOverview }> = ({
  classItem,
}) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(`M.${classItem.number} overview`, t)}</title>
      </Head>
      <MySKPageHeader
        title={`M.${classItem.number} overview`}
        parentURL="/lookup/class"
      >
        <ClassTabs number={classItem.number} />
      </MySKPageHeader>
      <ContentLayout>
        <p className="mx-4 sm:mx-0">TODO</p>
      </ContentLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const classItem: ClassOverview = {
    number: classNumber,
    classAdvisors: [],
    contacts: [],
    subjects: [],
  };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
      ])),
      classItem,
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

export default ClassOverviewPage;
