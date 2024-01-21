import ProfileNavigation from "@/components/account/ProfileNavigation";
import PageHeader from "@/components/common/PageHeader";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getStudentFromUserID } from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import { CustomPage, LangCode } from "@/utils/types/common";
import { Student, Teacher, UserRole } from "@/utils/types/person";
import { SubjectGroup } from "@/utils/types/subject";
import { ContentLayout } from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const AboutYouPage: CustomPage<{
  user: Student | Teacher;
  subjectGroups: SubjectGroup[];
}> = ({ user, subjectGroups }) => {
  const { t } = useTranslation("account");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "About you" })}</title>
      </Head>
      <PageHeader>Profile</PageHeader>
      <ContentLayout>
        <div className="contents sm:grid sm:grid-cols-2 sm:gap-6 md:grid-cols-[1fr,3fr]">
          <section className="hidden sm:block">
            <ProfileNavigation />
          </section>
          <section></section>
        </div>
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
  let person = null;

  // - Fetch Person for Student or Teacher
  // - Redirect to home page for other users (temporary fix)
  switch (user?.role) {
    case UserRole.student:
      const { data: student } = await getStudentFromUserID(supabase, user.id, {
        includeContacts: true,
        detailed: true,
      });
      person = student;
      break;
    case UserRole.teacher:
      const { data: teacher } = await getStudentFromUserID(supabase, user.id, {
        includeContacts: true,
        detailed: true,
      });
      person = teacher;
      break;
    default:
      return {
        redirect: {
          destination: (locale === "th" ? "" : "/en-US") + "/account",
          permanent: false,
        },
      };
  }

  const { data: subjectGroups } = await getSubjectGroups(supabase);

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "account",
      ])),
      user: person,
      subjectGroups,
    },
  };
};

export default AboutYouPage;
