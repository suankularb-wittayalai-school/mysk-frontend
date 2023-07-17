// External libraries
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

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
import { Role } from "@/utils/types/person";

const ClassOverviewPage: CustomPage<{
  classItem: ClassOverviewType;
  editable: boolean;
  userRole: Role;
}> = ({ classItem, editable, userRole }) => {
  const { t } = useTranslation(["class", "common"]);

  return (
    <>
      <Head>
        <title>{createTitleStr(t(`overview.title.${userRole}`), t)}</title>
      </Head>
      <MySKPageHeader title={t(`overview.title.${userRole}`)}>
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
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: metadata } = await getUserMetadata(supabase, session!.user.id);

  const userRole = metadata!.role;

  let classWNumber: ClassWNumber | null = null;
  let editable = false;

  switch (userRole) {
    case "student":
      const { data: classItem } = await getClassFromUser(
        supabase,
        session!.user
      );
      classWNumber = classItem!;
      break;
    case "teacher":
      const { data: classAdvisorAt } = await getClassAdvisorAt(
        supabase,
        metadata!.teacher!
      );
      classWNumber = classAdvisorAt!;
      editable = true;
      break;
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
      userRole,
    },
  };
};

export default ClassOverviewPage;
