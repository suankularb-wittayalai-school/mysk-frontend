// Imports
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClassOverview from "@/components/class/ClassOverview";
import PageHeader from "@/components/common/PageHeader";
import ClassTabs from "@/components/lookup/class/ClassTabs";
import getClassroomOverview from "@/utils/backend/classroom/getClassroomOverview";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { Classroom } from "@/utils/types/classroom";

const ClassroomOverviewPage: CustomPage<{
  classroom: Pick<
    Classroom,
    "id" | "number" | "class_advisors" | "contacts" | "subjects"
  >;
  editable: boolean;
  userRole: UserRole;
}> = ({ classroom, editable, userRole }) => {
  const { t } = useTranslation("class");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>
          {tx("tabName", { tabName: t(`overview.title.${userRole}`) })}
        </title>
      </Head>
      <PageHeader>{t(`overview.title.${userRole}`)}</PageHeader>
      <ClassTabs number={classroom.number} type="class" />
      <ClassOverview {...{ classroom, editable }} />
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

  const { data: user, error } = await getLoggedInPerson(
    supabase,
    authOptions,
    req,
    res,
    { includeContacts: true, detailed: true },
  );

  const userRole = user!.role;

  let classroom: Pick<Classroom, "id" | "number"> | null = null;
  let editable = false;

  switch (userRole) {
    case "student":
      classroom = user?.classroom!;
      break;
    case "teacher":
      classroom = user?.class_advisor_at!;
      editable = true;
      break;
  }

  if (!classroom) return { notFound: true };

  const { data: classroomOverview, error: classroomOverviewError } =
    await getClassroomOverview(supabase, classroom!.id);

  // console.log({classroomOverview, classroomOverviewError});

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
        "class",
      ])),
      classroom: classroomOverview,
      editable,
      userRole,
    },
  };
};

export default ClassroomOverviewPage;
