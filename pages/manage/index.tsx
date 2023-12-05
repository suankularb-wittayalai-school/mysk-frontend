// Imports
import PageHeader from "@/components/common/PageHeader";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getUserByEmail from "@/utils/backend/account/getUserByEmail";
import permitted from "@/utils/helpers/permitted";
import { CustomPage, LangCode } from "@/utils/types/common";
import { UserPermissionKey, UserRole } from "@/utils/types/person";
import {
  Columns,
  ContentLayout,
  Header,
  Section,
  Text,
} from "@suankularb-components/react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

/**
 * Management’s counterpart to Learn, where the user can view statistics about
 * the school. This page is only accessible to users with the
 * `can_see_management` permission.
 *
 * Management users see this page as their Home. Other users with the permission
 * can access this page from their Account page.
 */
const ManagePage: CustomPage = () => {
  const { t } = useTranslation("manage");
  const { t: tx } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{tx("tabName", { tabName: "Manage" })}</title>
      </Head>
      <PageHeader>{tx("appName")}</PageHeader>
      <ContentLayout>
        {/* Attendance */}
        <Section>
          <Header>Attendance</Header>
          <Text type="body-medium" className="!-mt-2">
            Every morning, teachers take attendance of their students during
            assembly and homeroom. Here’s a summary.
          </Text>
          <Columns columns={2}>{}</Columns>
        </Section>

        {/* Participation */}
        <Columns columns={6}>
          <Section className="col-span-2 sm:col-span-4 md:col-start-2">
            <Header>Participation</Header>
            <Text type="body-medium" className="!-mt-2">
              Metrics on students and teachers participation in using the MySK
              infrastructure.
            </Text>
          </Section>
        </Columns>
      </ContentLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
  res,
}) => {
  // Check if the user is logged in and has the correct permissions.
  // If not, return a 404.

  const supabase = createPagesServerClient({
    req: req as NextApiRequest,
    res: res as NextApiResponse,
  });
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return { notFound: true };

  const { data: user } = await getUserByEmail(supabase, session.user.email!);
  if (
    !(
      // The user is a management user.
      (
        user?.role === UserRole.management ||
        // The user has the `can_see_management` permission.
        permitted(user!, UserPermissionKey.can_see_management)
      )
    )
  )
    return { notFound: true };

  return {
    props: {
      ...(await serverSideTranslations(locale as LangCode, [
        "common",
        "manage",
      ])),
    },
  };
};

export default ManagePage;
