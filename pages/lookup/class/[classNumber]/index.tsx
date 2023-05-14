// External libraries
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassOverview from "@/components/class/ClassOverview";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Supabase
import { supabase } from "@/utils/supabase-backend";

// Backend
import {
  getAllClassNumbers,
  getClassOverview,
} from "@/utils/backend/classroom/classroom";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { ClassOverview as ClassOverviewType } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";

const ClassOverviewPage: CustomPage<{ classItem: ClassOverviewType }> = ({
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
      <MySKPageHeader
        title={t("overview.title.lookup", { number: classItem.number })}
        parentURL="/lookup/class"
      >
        <ClassTabs number={classItem.number} type="lookup" />
      </MySKPageHeader>
      <ClassOverview {...{ classItem }} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const classNumber = Number(params?.classNumber);
  if (Number.isNaN(classNumber)) return { notFound: true };

  const { data: classItem, error } = await getClassOverview(
    supabase,
    classNumber
  );
  if (error) return { notFound: true };

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
  return {
    paths: (await getAllClassNumbers(supabase)).map((number) => ({
      params: { classNumber: number.toString() },
    })),
    fallback: "blocking",
  };
};

export default ClassOverviewPage;
