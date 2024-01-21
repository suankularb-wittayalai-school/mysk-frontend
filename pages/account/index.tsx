import ProfileNavigation from "@/components/account/ProfileNavigation";
import AboutPersonSummary from "@/components/account/about/AboutPersonSummary";
import PageHeader from "@/components/common/PageHeader";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  getStudentFromUserID,
  getTeacherFromUserID,
} from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import { ContentLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * The Profile page is a mobile-only page that lets the user select which page
 * to view.
 *
 * @param user The Person to display the information of. Should be of the currently logged in user.
 */
const ProfilePage: CustomPage<{ user: Student | Teacher }> = ({ user }) => {
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout>
        <AboutPersonSummary person={user} className="mx-4 sm:mx-0" />
        <ProfileNavigation role={user.role} className="mx-1 sm:-mx-3" />
      </ContentLayout>
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
  const session = await getServerSession(req, res, authOptions);
  const { data: user } = await getUserByEmail(supabase, session!.user!.email!);

  if (
    user === null ||
    ![UserRole.student, UserRole.teacher].includes(user.role)
  )
    return { notFound: true };

  const { data: person } = await {
    [UserRole.student]: getStudentFromUserID,
    [UserRole.teacher]: getTeacherFromUserID,
  }[user.role as UserRole.student | UserRole.teacher](supabase, user.id);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
      user: person,
    },
  };
};

export default ProfilePage;
