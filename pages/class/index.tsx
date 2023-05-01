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
import {
  getClassFromUser,
  getClassOverview,
} from "@/utils/backend/classroom/classroom";
import { getClassAdvisorAt } from "@/utils/backend/person/teacher";

// Helpers
import { createTitleStr } from "@/utils/helpers/title";

// Types
import {
  ClassOverview as ClassOverviewType,
  ClassWNumber,
} from "@/utils/types/class";
import { CustomPage, LangCode } from "@/utils/types/common";
import { getLocalePath } from "@/utils/helpers/i18n";

const ClassOverviewPage: CustomPage<{
  classItem: ClassOverviewType;
  editable: boolean;
}> = ({ classItem, editable }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t("overview.title.class"), t)}</title>
      </Head>
      <MySKPageHeader title={t("overview.title.class")}>
        <ClassTabs number={classItem.number} type="class" />
      </MySKPageHeader>
      <ClassOverview {...{ classItem, editable }} />
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
  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);

  let classWNumber: ClassWNumber | null = null;
  let editable = false;
  if (metadata!.role === "student") {
    const { data } = await getClassFromUser(supabase, session!.user);
    classWNumber = data!;
  } else if (metadata!.role === "teacher") {
    const { data } = await getClassAdvisorAt(supabase, metadata!.teacher!);
    classWNumber = data!;
    editable = true;
  }

  if (!classWNumber) return { notFound: true };

  const { data: classItem } = await getClassOverview(
    supabase,
    classWNumber!.number
  );

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "class",
      ])),
      classItem,
      editable,
    },
  };
};

export default ClassOverviewPage;
