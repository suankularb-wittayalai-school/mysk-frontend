// External libraries
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Internal components
import ClassOverview from "@/components/class/ClassOverview";
import MySKPageHeader from "@/components/common/MySKPageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";

// Backend
import { getUserMetadata } from "@/utils/backend/account";
import { getClassOverview } from "@/utils/backend/classroom/classroom";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import { ClassOverview as ClassOverviewType } from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";

const ClassOverviewPage: CustomPage<{
  classItem: ClassOverviewType;
}> = ({ classItem }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr("Your class", t)}</title>
      </Head>
      <MySKPageHeader title="Your class">
        <ClassTabs number={classItem.number} type="class" />
      </MySKPageHeader>
      <ClassOverview {...{ classItem }} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  const supabase = createServerSupabaseClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: metadata, error: metadataError } = await getUserMetadata(
    supabase,
    session!.user.id
  );

  const { data: classWNumber } = await getClassAdvisorAt(
    supabase,
    metadata!.teacher!
  );
  const { data: classItem } = await getClassOverview(
    supabase,
    classWNumber!.number
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "class",
      ])),
      classItem,
    },
  };
};

export default ClassOverviewPage;
