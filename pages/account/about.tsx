import AboutHeader from "@/components/account/about/AboutHeader";
import CertficateAnnouncementBanner from "@/components/account/about/CertficateAnnouncementBanner";
import ProfileNavigation from "@/components/account/ProfileNavigation";
import PageHeader from "@/components/common/PageHeader";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  getStudentFromUserID,
  getTeacherFromUserID,
} from "@/utils/backend/account/getLoggedInPerson";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import getSubjectGroups from "@/utils/backend/subject/getSubjectGroups";
import cn from "@/utils/helpers/cn";
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
        <div className="contents sm:grid sm:grid-cols-[1fr,3fr] sm:gap-6">
          <section className="hidden sm:block">
            <ProfileNavigation />
          </section>
          <section className="relative -mb-9 h-[calc(100dvh-5.75rem)]">
            <AboutHeader
              person={user}
              onSave={() => {}}
              className="absolute inset-0 bottom-auto top-0 z-[70]"
            />
            <div
              // The About Header component has different heights for different
              // screen sizes, represented here by the `--header-height` CSS
              // variable.
              // Using this variable, we can add the appropriate padding to the
              // top of the form and the appropriately position the fade-out
              // mask.
              className={cn(`h-full overflow-y-auto px-4 pb-9
                pt-[calc(var(--header-height)+2rem)] [--header-height:7.125rem]
                [mask-image:linear-gradient(to_bottom,transparent_var(--header-height),black_calc(var(--header-height)+2rem))]
                sm:px-0 md:[--header-height:4rem]`)}
            >
              {user.role === UserRole.student && (
                <CertficateAnnouncementBanner />
              )}
            </div>
          </section>
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
