import ProfileNavigation from "@/components/account/ProfileNavigation";
import AboutPersonSummary from "@/components/account/about/AboutPersonSummary";
import PageHeader from "@/components/common/PageHeader";
import getLoggedInPerson from "@/utils/backend/account/getLoggedInPerson";
import createMySKClient from "@/utils/backend/mysk/createMySKClient";
import { CustomPage } from "@/utils/types/common";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import { ContentLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

/**
 * The Profile page is a mobile-only page that lets the user select which page
 * to view.
 *
 * @param user The Person to display the information of. Should be of the currently logged in user.
 */
const ProfilePage: CustomPage<{ user: Student | Teacher }> = ({ user }) => {
  const { t } = useTranslation("account/common");

  return (
    <>
      <Head>
        <title>{t("common:tabName", { tabName: t("title") })}</title>
      </Head>
      <PageHeader>{t("title")}</PageHeader>
      <ContentLayout className="*:*:mx-4 *:*:sm:mx-0">
        <AboutPersonSummary person={user} />
        <ProfileNavigation className="!mx-1 sm:!-mx-3" />
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const mysk = await createMySKClient(req);
  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });

  if (
    !mysk.user ||
    ![UserRole.student, UserRole.teacher].includes(mysk.user.role)
  )
    return { notFound: true };

  const { data: user } = await getLoggedInPerson(supabase, mysk, {
    detailed: true,
  });

  return { props: { user } };
};

export default ProfilePage;
